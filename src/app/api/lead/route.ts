import { NextResponse } from "next/server";
import {
  DATEI_MAX_BYTES,
  LEER,
  beschrifte,
  hatFehler,
  pruefe,
  pruefeDatei,
  type Lead,
} from "@/lib/lead";

/**
 * Anfrage → Bitrix24 (`crm.lead.add`).
 *
 * Der Webhook ist ein Geheimnis und steht ausschließlich in `.env.local`.
 * Diese Route ist der einzige Ort, an dem er gelesen wird – der Browser
 * bekommt ihn nie zu sehen. Deshalb läuft der Versand hier und nicht per
 * fetch aus der Komponente.
 */

export const runtime = "nodejs";

/** Sehr einfache Bremse gegen Formular-Spam: pro IP höchstens fünf
 *  Anfragen in zehn Minuten. Im Speicher, also pro Instanz – für eine
 *  Onepager-Landingpage ist das die richtige Größenordnung. Wird daraus
 *  einmal mehr Traffic, gehört das in einen geteilten Speicher. */
const FENSTER_MS = 10 * 60 * 1000;
const MAX = 5;
const bremse = new Map<string, number[]>();

function zuOft(ip: string) {
  const jetzt = Date.now();
  const alt = bremse.get(ip) ?? [];
  const neu = alt.filter((t) => jetzt - t < FENSTER_MS);
  if (neu.length >= MAX) return true;
  neu.push(jetzt);
  bremse.set(ip, neu);
  return false;
}

/** Nur Felder übernehmen, die es geben darf – ein hereingereichtes
 *  Fremdfeld hätte sonst den Weg bis ins CRM. */
function saeubere(roh: unknown): Lead {
  const q = (roh ?? {}) as Record<string, unknown>;
  const text = (v: unknown, max: number) =>
    typeof v === "string" ? v.trim().slice(0, max) : "";

  return {
    ...LEER,
    // Nur die beiden bekannten Werte zulassen – die Variante steuert die
    // Pflichtfelder, ein hereingereichter Fantasiewert würde die Prüfung
    // aushebeln.
    variante: q.variante === "angebot" ? "angebot" : "beratung",
    anliegen: text(q.anliegen, 40) as Lead["anliegen"],
    gebaeude: text(q.gebaeude, 40) as Lead["gebaeude"],
    plz: text(q.plz, 5),
    name: text(q.name, 120),
    telefon: text(q.telefon, 40),
    email: text(q.email, 160),
    nachricht: text(q.nachricht, 2000),
    einwilligung: q.einwilligung === true,
    nurUpload: q.nurUpload === true,
  };
}

/**
 * Hängt das hochgeladene Angebot an den frisch erzeugten Lead.
 *
 * WARUM ALS TIMELINE-KOMMENTAR und nicht als Feld am Lead: Ein Dateifeld
 * müsste in Bitrix erst als benutzerdefiniertes Feld angelegt und über seine
 * kryptische `UF_CRM_…`-Kennung angesprochen werden. Der Timeline-Kommentar
 * braucht keinerlei Vorkonfiguration, funktioniert mit demselben Webhook und
 * legt die Datei genau dort ab, wo sie gesucht wird: im Verlauf des Leads.
 *
 * FEHLER SIND HIER NICHT TÖDLICH. Der Lead steht zu diesem Zeitpunkt bereits
 * im CRM, die Anfrage ist also angekommen. Schlägt der Anhang fehl, wird das
 * protokolliert – aber der Nutzer bekommt keine Fehlermeldung für etwas, das
 * seine Anfrage nicht verhindert hat. Die Alternative wäre, ihn wegen eines
 * Anhangs alles noch einmal ausfüllen zu lassen.
 */
async function haengeDateiAn(
  url: string,
  leadId: number,
  datei: File,
): Promise<boolean> {
  try {
    const base64 = Buffer.from(await datei.arrayBuffer()).toString("base64");

    const antwort = await fetch(`${url}crm.timeline.comment.add.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: {
          ENTITY_ID: leadId,
          ENTITY_TYPE: "lead",
          COMMENT: `Vom Interessenten hochgeladenes Angebot: ${datei.name}`,
          // Bitrix erwartet Paare aus Dateiname und Base64-Inhalt.
          FILES: [[datei.name, base64]],
        },
      }),
      signal: AbortSignal.timeout(20_000),
    });

    const daten = (await antwort.json()) as { error_description?: string };
    if (!antwort.ok || daten.error_description) {
      console.error("[lead] Anhang abgelehnt:", antwort.status, daten.error_description);
      return false;
    }
    return true;
  } catch (error) {
    console.error("[lead] Anhang fehlgeschlagen:", error);
    return false;
  }
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unbekannt";

  if (zuOft(ip)) {
    return NextResponse.json(
      { ok: false, grund: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
      { status: 429 },
    );
  }

  /* Zwei Formate, ein Endpunkt: Ohne Angebotsdatei kommt die Anfrage als
     JSON, mit Datei als FormData (Feld `daten` = derselbe JSON-Text, Feld
     `datei` = die Datei). Die Datei durch JSON zu schleusen hieße, sie
     vorher nach Base64 zu wandeln – ein Drittel mehr Nutzlast, ohne dass
     irgendetwas dadurch einfacher würde. */
  let roh: unknown;
  let datei: File | null = null;

  const typ = request.headers.get("content-type") ?? "";

  try {
    if (typ.includes("multipart/form-data")) {
      const form = await request.formData();
      roh = JSON.parse(String(form.get("daten") ?? "{}"));

      const angehaengt = form.get("datei");
      if (angehaengt instanceof File && angehaengt.size > 0) {
        // Serverseitig noch einmal prüfen: Die Kontrolle im Browser ist
        // Bequemlichkeit, verbindlich ist erst diese hier.
        const meldung = pruefeDatei(angehaengt);
        if (meldung) {
          return NextResponse.json({ ok: false, grund: meldung }, { status: 400 });
        }
        if (angehaengt.size > DATEI_MAX_BYTES) {
          return NextResponse.json(
            { ok: false, grund: "Die Datei ist zu groß." },
            { status: 413 },
          );
        }
        datei = angehaengt;
      }
    } else {
      roh = await request.json();
    }
  } catch {
    return NextResponse.json({ ok: false, grund: "Ungültige Anfrage." }, { status: 400 });
  }

  // Honeypot: ein für Menschen unsichtbares Feld. Ist es gefüllt, war es
  // ein Bot. Wir antworten trotzdem freundlich – wer abgewiesen wird,
  // probiert es anders herum noch einmal.
  if (typeof (roh as Record<string, unknown>)?.website === "string" &&
      (roh as Record<string, string>).website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const lead = saeubere(roh);
  const fehler = pruefe(lead, "alle");
  if (hatFehler(fehler)) {
    return NextResponse.json({ ok: false, fehler }, { status: 400 });
  }

  /* Beim WhatsApp-Weg des AV-Funnels sind Name und Kontaktweg leer – das
     ist gewollt (siehe `nurUpload` in lib/lead.ts). Was dann NICHT fehlen
     darf, ist die Datei: Ohne sie entstünde ein leerer Lead ohne Name, ohne
     Nummer und ohne Angebot, also ein Vorgang, mit dem niemand etwas
     anfangen kann. */
  if (lead.nurUpload && !datei) {
    return NextResponse.json(
      { ok: false, grund: "Bitte laden Sie zuerst Ihr Angebot hoch." },
      { status: 400 },
    );
  }

  const webhook = process.env.BITRIX24_WEBHOOK_URL;
  if (!webhook) {
    // Kein Ausfall nach außen erfinden: Wenn die Anbindung fehlt, muss der
    // Nutzer das erfahren und den Telefonweg angeboten bekommen.
    console.error("[lead] BITRIX24_WEBHOOK_URL fehlt – Anfrage nicht zugestellt.");
    return NextResponse.json(
      { ok: false, grund: "Die Übermittlung ist gerade nicht möglich." },
      { status: 503 },
    );
  }

  // Herkunft nur als Freitext und gedeckelt – sie kommt aus dem Browser.
  const quelle =
    typeof (roh as Record<string, unknown>)?.quelle === "string"
      ? (roh as Record<string, string>).quelle.trim().slice(0, 60)
      : "Unbekannt";

  const anliegen = beschrifte("anliegen", lead.anliegen);
  const gebaeude = beschrifte("gebaeude", lead.gebaeude);
  const istAngebot = lead.variante === "angebot";

  /* Die Herkunft steht im Titel, nicht nur im Beschreibungsfeld: In der
     Lead-Liste sieht man ausschließlich den Titel, und die beiden Anfragen
     verlangen völlig verschiedene Reaktionen. Bei einer Angebotsprüfung
     wartet jemand auf eine Auswertung innerhalb von 24 Stunden. */
  const domain = istAngebot ? "angebote-vergleichen.info" : "energiepartner.info";
  const art = istAngebot ? "Angebotsprüfung" : "Beratung";

  /* Der Titel ist das Einzige, was in der Lead-Liste sichtbar ist. Beim
     WhatsApp-Weg steht dort weder Name noch PLZ – dann muss er sagen, was
     tatsächlich zu tun ist: Es liegt ein Angebot da, und der Kunde meldet
     sich gleich selbst im Chat. */
  const titel = lead.nurUpload
    ? `Angebotsprüfung · WhatsApp · ${lead.telefon}`
    : `${art} · ${anliegen}${lead.plz ? ` · ${lead.plz}` : ""}`;

  const felder: Record<string, unknown> = {
    TITLE: titel,
    SOURCE_ID: "WEB",
    SOURCE_DESCRIPTION: `${domain} – ${lead.nurUpload ? "Upload-Funnel" : "Anfrageformular"} (${quelle})`,
    COMMENTS: [
      `Herkunft: ${domain}`,
      lead.nurUpload
        ? "Über den WhatsApp-Weg. Der Kunde nennt die Vorgangsnummer dieses Leads im Chat; der Name steht in seinem WhatsApp-Profil. Falls er sich nicht meldet, ist er über die Nummer oben erreichbar."
        : `Anliegen: ${anliegen}`,
      // Die Gebäudeart wird bei der Angebotsprüfung nicht erhoben – eine
      // Zeile „Gebäude: " ohne Wert wäre im CRM nur Rauschen.
      istAngebot || lead.nurUpload ? "" : `Gebäude: ${gebaeude}`,
      lead.plz ? `PLZ: ${lead.plz}` : "",
      datei ? `\nAngebot hochgeladen: ${datei.name}` : "",
      lead.nachricht ? `\nNachricht:\n${lead.nachricht}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  };

  // Leere Felder gar nicht erst mitschicken – Bitrix legt sonst einen
  // Kontakt ohne Namen an, der in jeder Liste als „(kein Name)" auftaucht.
  if (lead.name) felder.NAME = lead.name;
  if (lead.plz) felder.ADDRESS_POSTAL_CODE = lead.plz;

  if (lead.telefon) felder.PHONE = [{ VALUE: lead.telefon, VALUE_TYPE: "WORK" }];
  if (lead.email) felder.EMAIL = [{ VALUE: lead.email, VALUE_TYPE: "WORK" }];

  try {
    // `/` am Ende sicherstellen – die Webhook-URL wird von Hand gepflegt und
    // ist mal mit, mal ohne notiert.
    const url = webhook.endsWith("/") ? webhook : `${webhook}/`;

    const antwort = await fetch(`${url}crm.lead.add.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields: felder, params: { REGISTER_SONET_EVENT: "Y" } }),
      // Nicht ewig hängen lassen: Der Nutzer sitzt davor.
      signal: AbortSignal.timeout(10_000),
    });

    const daten = (await antwort.json()) as { result?: number; error_description?: string };

    if (!antwort.ok || daten.error_description) {
      console.error("[lead] Bitrix meldet:", antwort.status, daten.error_description);
      return NextResponse.json(
        { ok: false, grund: "Die Übermittlung ist gerade nicht möglich." },
        { status: 502 },
      );
    }

    /* Der Lead steht. Erst jetzt das Angebot anhängen – umgekehrt gäbe es
       eine Datei ohne Vorgang, an den sie gehört. Schlägt der Anhang fehl,
       bleibt die Anfrage trotzdem erfolgreich: Sie IST angekommen, und der
       Nutzer kann für einen Fehler auf unserer Seite nichts. */
    let anhang: boolean | undefined;
    if (datei && typeof daten.result === "number") {
      anhang = await haengeDateiAn(url, daten.result, datei);
      if (!anhang) {
        console.error(
          `[lead] Angebot "${datei.name}" konnte Lead ${daten.result} nicht angehängt werden – bitte manuell nachfordern.`,
        );
      }
    }

    return NextResponse.json({ ok: true, id: daten.result, anhang });
  } catch (error) {
    console.error("[lead] Zustellung fehlgeschlagen:", error);
    return NextResponse.json(
      { ok: false, grund: "Die Übermittlung ist gerade nicht möglich." },
      { status: 502 },
    );
  }
}
