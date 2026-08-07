/**
 * Anfrage-Formular · Datenmodell und Prüfung
 *
 * Bewusst eine gemeinsame Datei für Browser und Server: Die Prüfung im
 * Browser ist Bequemlichkeit (der Nutzer soll den Fehler sehen, bevor er
 * abschickt), die Prüfung auf dem Server ist die verbindliche. Zwei
 * getrennte Regelwerke laufen unweigerlich auseinander – dann meldet das
 * Formular grün und die Route wirft 400, und niemand findet den Grund.
 */

export const ANLIEGEN = [
  { value: "waermepumpe", label: "Wärmepumpe", hint: "Heizung tauschen" },
  { value: "photovoltaik", label: "Photovoltaik & Speicher", hint: "Strom selbst erzeugen" },
  { value: "stromtarif", label: "Stromtarif", hint: "Anbieter wechseln" },
  { value: "gesamt", label: "Das ganze System", hint: "Alles zusammen planen" },
] as const;

export const GEBAEUDE = [
  { value: "bestand", label: "Bestandsgebäude" },
  { value: "neubau", label: "Neubau" },
  { value: "offen", label: "Weiß ich noch nicht" },
] as const;

/**
 * Welcher Auftritt hat die Anfrage ausgelöst.
 *
 * `beratung` = energiepartner.info: jemand sucht Beratung, es gibt noch
 * nichts Schriftliches.
 * `angebot` = angebote-vergleichen.info: es liegt bereits ein Angebot vor
 * und soll geprüft werden.
 *
 * Der Unterschied ist nicht kosmetisch. Er entscheidet, welche Felder
 * gebraucht werden (bei einer Angebotsprüfung ist die Gebäudeart im Angebot
 * schon beantwortet), wie der Lead im CRM heißt und mit welcher Erwartung
 * jemand ans Telefon geht.
 */
export type Variante = "beratung" | "angebot";

/**
 * Die auf angebote-vergleichen.info zur Auswahl stehenden Anliegen.
 * „Stromtarif" fällt weg: Dafür bekommt niemand ein Angebot, das man auf
 * fehlende Positionen prüfen müsste.
 */
export const ANLIEGEN_ANGEBOT = ANLIEGEN.filter(
  (eintrag) => eintrag.value !== "stromtarif",
);

export type AnliegenValue = (typeof ANLIEGEN)[number]["value"];
export type GebaeudeValue = (typeof GEBAEUDE)[number]["value"];

export type Lead = {
  variante: Variante;
  anliegen: AnliegenValue | "";
  gebaeude: GebaeudeValue | "";
  plz: string;
  name: string;
  telefon: string;
  email: string;
  nachricht: string;
  einwilligung: boolean;
  /**
   * Übergabe an WhatsApp statt vollständiges Formular.
   *
   * Auf angebote-vergleichen.info kann der Besucher sein Angebot hochladen
   * und danach entscheiden, dass er per WhatsApp weitermachen will. Dann
   * fehlen Name und Kontaktweg – und das ist kein Mangel, sondern der Punkt:
   * Die Telefonnummer liefert WhatsApp beim ersten Chat, der Name steht im
   * Profil. Ein Formular, das beides vorher abfragt, verlangt Daten, die
   * der gewählte Kanal ohnehin mitbringt.
   *
   * Die Datei muss trotzdem zu uns, sonst hat der Upload nichts bewirkt –
   * deshalb entsteht auch hier ein Lead, nur eben mit weniger Feldern und
   * einer Vorgangsnummer, die der Besucher in den Chat mitnimmt.
   */
  nurUpload: boolean;
};

export const LEER: Lead = {
  variante: "beratung",
  anliegen: "",
  gebaeude: "",
  plz: "",
  name: "",
  telefon: "",
  email: "",
  nachricht: "",
  einwilligung: false,
  nurUpload: false,
};

/* ---------------------------------------------------------------
   Angebots-Upload
   --------------------------------------------------------------- */

/** 10 MB, wie im Markenhandbuch am Formular angeschrieben. */
export const DATEI_MAX_BYTES = 10 * 1024 * 1024;

/** PDF und Fotos – mehr braucht es nicht, und alles andere wäre eine
 *  Einladung, uns beliebige Dateien zu schicken. */
export const DATEI_TYPEN = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/heic",
  "image/heif",
] as const;

/** Für das `accept`-Attribut. HEIC steht dabei, weil iPhones genau das
 *  liefern und die Kamera-Aufnahme sonst ausgegraut im Dateidialog steht. */
export const DATEI_ACCEPT = ".pdf,.jpg,.jpeg,.png,.heic,.heif,application/pdf,image/*";

/** Gibt eine Fehlermeldung zurück, oder `undefined`, wenn die Datei passt. */
export function pruefeDatei(datei: { name: string; size: number; type: string }) {
  if (datei.size > DATEI_MAX_BYTES) {
    return "Die Datei ist größer als 10 MB. Bitte schicken Sie sie uns per WhatsApp.";
  }
  // Manche Browser liefern für HEIC einen leeren Typ – dann entscheidet die
  // Endung. Eine Datei wegen eines fehlenden MIME-Typs abzulehnen, träfe
  // ausgerechnet iPhone-Fotos, also den Regelfall.
  const typOk =
    (DATEI_TYPEN as readonly string[]).includes(datei.type) ||
    (!datei.type && /\.(pdf|jpe?g|png|heic|heif)$/i.test(datei.name));

  if (!typOk) {
    return "Bitte ein PDF oder ein Foto (JPG, PNG) auswählen.";
  }
  return undefined;
}

export type Fehler = Partial<Record<keyof Lead, string>>;

/** Deutsche PLZ: genau fünf Ziffern. */
const PLZ = /^\d{5}$/;
/** Absichtlich großzügig – eine Adresse endgültig zu validieren geht nur
 *  durch Zustellen. Die Regel fängt Tippfehler, nicht Exotik. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
/** Ziffern, Leerzeichen, +, -, /, Klammern. Mindestens sechs Ziffern. */
const TEL = /^[+()\/\s\d-]{6,}$/;

/**
 * Prüft genau den Schritt, in dem der Nutzer steht – nicht das ganze
 * Formular. Ein Fehler an einem Feld, das noch gar nicht sichtbar war, ist
 * keine Hilfe, sondern eine Anschuldigung.
 *
 * `schritt: "alle"` ist die Server-Sicht.
 */
export function pruefe(lead: Lead, schritt: 0 | 1 | 2 | "alle"): Fehler {
  const f: Fehler = {};

  /* Beim WhatsApp-Weg wird weniger verlangt, aber nicht nichts.
     Zwei Angaben sind unverzichtbar, und beide aus einem konkreten Grund:

     TELEFONNUMMER – ein erster Entwurf kam ohne sie aus, mit dem Gedanken,
     die Nummer liefere ja der Chat. Das stimmt nur, wenn der Besucher
     tatsächlich schreibt. Tut er es nicht, liegt im CRM ein Angebot ohne
     Namen, ohne Nummer und ohne jede Möglichkeit, sich zu melden – ein
     Vorgang, der niemandem nützt und den auch niemand mehr löschen kann,
     weil unklar ist, zu wem er gehört.

     EINWILLIGUNG – im selben Entwurf wurde sie beim Absenden hart auf
     `true` gesetzt. Das ist keine Einwilligung, sondern eine Behauptung
     darüber. Wer auf „Per WhatsApp" klickt, weiß ohne Hinweis nicht, dass
     damit sein Angebot bereits übermittelt und gespeichert wird (Art. 6
     Abs. 1 lit. a, Art. 13 DSGVO). Sie muss aktiv gesetzt werden, und der
     Hinweis muss vor dem Klick sichtbar sein. */
  if (lead.nurUpload) {
    const tel = lead.telefon.trim();
    if (!tel) {
      f.telefon = "Für die Antwort per WhatsApp brauchen wir Ihre Nummer.";
    } else if (!TEL.test(tel)) {
      f.telefon = "Diese Telefonnummer sieht unvollständig aus.";
    }
    if (!lead.einwilligung) {
      f.einwilligung = "Ohne Ihre Einwilligung dürfen wir Ihr Angebot nicht prüfen.";
    }
    return f;
  }

  const alle = schritt === "alle";

  if (alle || schritt === 0) {
    if (!lead.anliegen) f.anliegen = "Bitte wählen Sie aus, worum es geht.";
  }

  if (alle || schritt === 1) {
    if (!PLZ.test(lead.plz.trim())) {
      f.plz = "Bitte eine fünfstellige Postleitzahl eintragen.";
    }
    // Die Gebäudeart wird nur bei der Beratung gebraucht. Wer ein Angebot
    // prüfen lässt, hat sie dort schon beantwortet – die Frage noch einmal
    // zu stellen, kostet ein Feld und liefert nichts Neues.
    if (lead.variante === "beratung" && !lead.gebaeude) {
      f.gebaeude = "Bitte wählen Sie eine Angabe aus.";
    }
  }

  if (alle || schritt === 2) {
    if (lead.name.trim().length < 2) f.name = "Bitte tragen Sie Ihren Namen ein.";

    const tel = lead.telefon.trim();
    const mail = lead.email.trim();

    // Ein Kontaktweg genügt – zwei Pflichtfelder für dieselbe Aufgabe sind
    // der klassische Abbruchgrund. Welcher es ist, entscheidet der Nutzer.
    if (!tel && !mail) {
      f.telefon = "Telefon oder E-Mail, eines von beiden brauchen wir.";
    } else {
      if (tel && !TEL.test(tel)) f.telefon = "Diese Telefonnummer sieht unvollständig aus.";
      if (mail && !EMAIL.test(mail)) f.email = "Diese E-Mail-Adresse sieht nicht gültig aus.";
    }

    if (!lead.einwilligung) {
      f.einwilligung = "Ohne Ihre Einwilligung dürfen wir Sie nicht kontaktieren.";
    }
  }

  return f;
}

export const hatFehler = (f: Fehler) => Object.keys(f).length > 0;

/** Klartext für CRM und Bestätigungsmail. */
export function beschrifte(feld: "anliegen" | "gebaeude", value: string): string {
  const quelle = feld === "anliegen" ? ANLIEGEN : GEBAEUDE;
  return (quelle as readonly { value: string; label: string }[]).find(
    (e) => e.value === value,
  )?.label ?? value;
}
