/**
 * Google-Rezensionen über die Places API (New).
 *
 * ═══ SICHERHEIT ═══
 * Dieses Modul läuft AUSSCHLIESSLICH auf dem Server. Der Schlüssel heißt
 * bewusst `GOOGLE_PLACES_API_KEY` und nicht `NEXT_PUBLIC_…` – ein Präfix
 * `NEXT_PUBLIC_` würde ihn in jedes Browser-Bundle backen, wo ihn jeder
 * auslesen und auf eigene Rechnung verbrauchen kann. Places-Aufrufe kosten
 * Geld; ein offener Key ist eine offene Rechnung.
 *
 * Deshalb gilt: Diese Datei darf nur aus Server Components oder Route
 * Handlern importiert werden, niemals aus einer Datei mit `"use client"`.
 * Die Seite holt die Daten in `page.tsx` und reicht das fertige Ergebnis als
 * Props weiter – im Browser landen nur Name, Text und Note, nie der Zugang.
 *
 * Zusätzlich gehört im Google-Cloud-Projekt eine Beschränkung auf den Key:
 * „API restrictions" auf Places API (New) und „Application restrictions" auf
 * IP-Adressen des Servers. Ein Key ohne Beschränkung ist auch serverseitig
 * ein Risiko, sobald er einmal irgendwo hinausrutscht.
 *
 * ═══ EINRICHTUNG ═══
 * In `.env.local` genügt eine Zeile:
 *
 *     GOOGLE_PLACES_API_KEY=…
 *
 * Die Place-ID sucht das Modul beim ersten Abruf selbst über die Textsuche
 * und schreibt sie ins Server-Log. Wer sie dort abliest und als
 * `GOOGLE_PLACE_ID` einträgt, spart dauerhaft einen Suchaufruf und schließt
 * aus, dass jemals ein falscher Betrieb getroffen wird.
 */

/** Was die Seite tatsächlich anzeigt – bewusst schmal gehalten. */
export type GoogleRezension = {
  /** Der Text der Rezension. */
  text: string;
  /** Anzeigename des Verfassers. Attribution ist Pflicht. */
  autor: string;
  /** Profilbild des Verfassers, falls vorhanden. */
  autorBild?: string;
  /** Profil des Verfassers bei Google. */
  autorUrl?: string;
  /** „vor 2 Monaten" – kommt fertig formatiert von Google. */
  wann: string;
  /** 1–5. */
  sterne: number;
  /** Verweis auf genau diese Rezension bei Google. */
  url?: string;
};

export type GoogleBewertungen = {
  /**
   * Woher die Daten stammen.
   *
   * Nicht kosmetisch: An dieser Angabe hängen alle Aussagen ÜBER die
   * Bewertungen – das Google-Zeichen, der Verweis aufs Profil und die
   * Pflichtangabe zur Echtheitsprüfung (§ 5b Abs. 3 UWG). Die darf nur
   * erscheinen, wenn sie stimmt. Bei vorläufigen Daten bleibt sie weg,
   * statt eine Herkunft zu behaupten, die es nicht gibt.
   */
  quelle: "google" | "platzhalter";
  /** Durchschnitt, z. B. 5 oder 4.8. */
  note: number;
  /** Anzahl der abgegebenen Bewertungen. */
  anzahl: number;
  /** Verweis auf das Profil bei Google Maps. */
  profilUrl?: string;
  /** Höchstens fünf – mehr gibt die API nicht heraus. */
  rezensionen: GoogleRezension[];
};

/**
 * Suchbegriff für den Fall, dass keine Place-ID hinterlegt ist.
 *
 * Exakt der Name, unter dem das Unternehmensprofil bei Google steht –
 * bestätigt über den Teilen-Link des Profils (Knowledge-Graph-ID
 * `/g/11ntfnqsw5`). Die Telefonnummer steht bewusst mit drin: Sie ist das
 * eindeutigste Merkmal, falls es einmal mehrere Betriebe ähnlichen Namens
 * gibt, und die Textsuche gewichtet sie mit.
 *
 * Trotzdem gilt: Sobald das Log beim ersten Abruf die Place-ID ausgibt,
 * gehört sie als `GOOGLE_PLACE_ID` in die Umgebung. Eine feste ID kann nie
 * den falschen Betrieb treffen, eine Suche im Prinzip schon.
 */
const SUCHE = "energiepartner Deutschland Energieberatung 0173 6834665";

/**
 * Sechs Stunden. Damit fallen vier Abrufe am Tag an – die Quote bleibt
 * unauffällig, und die Rezensionen sind nie älter als ein halber Tag.
 * Deutlich längere Zeiträume sind auch nicht erlaubt: Google gestattet das
 * Zwischenspeichern von Inhalten nur befristet, Place-IDs ausgenommen.
 */
const FRISCHE = 21_600;

const ENDPUNKT = "https://places.googleapis.com/v1";

type ApiRezension = {
  name?: string;
  relativePublishTimeDescription?: string;
  rating?: number;
  text?: { text?: string };
  originalText?: { text?: string };
  authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
  googleMapsUri?: string;
};

type ApiOrt = {
  id?: string;
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: ApiRezension[];
};

/**
 * Sucht die Place-ID, wenn keine hinterlegt ist.
 *
 * Bewusst mit `revalidate: false`: Eine Place-ID ändert sich nicht, und sie
 * ist der einzige Wert, den Google dauerhaft zwischenspeichern lässt.
 */
async function findePlaceId(key: string): Promise<string | null> {
  try {
    const antwort = await fetch(`${ENDPUNKT}/places:searchText`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress",
      },
      body: JSON.stringify({ textQuery: SUCHE, languageCode: "de" }),
      next: { revalidate: false },
    });

    if (!antwort.ok) {
      console.error("[google] Textsuche fehlgeschlagen:", antwort.status);
      return null;
    }

    const daten = (await antwort.json()) as {
      places?: { id?: string; displayName?: { text?: string }; formattedAddress?: string }[];
    };
    const treffer = daten.places?.[0];
    if (!treffer?.id) return null;

    console.info(
      `[google] Place-ID gefunden: ${treffer.id} (${treffer.displayName?.text ?? "?"}, ${treffer.formattedAddress ?? "?"}). ` +
        "Als GOOGLE_PLACE_ID eintragen, dann entfällt diese Suche.",
    );
    return treffer.id;
  } catch (error) {
    console.error("[google] Textsuche fehlgeschlagen:", error);
    return null;
  }
}

/**
 * Holt Note und Rezensionen.
 *
 * ⚠️ GIBT IM ZWEIFEL `null` ZURÜCK, und das ist die wichtigste Eigenschaft
 * dieser Funktion. Kein Schlüssel, kein Treffer, ein Fehler der API, ein noch
 * unverifiziertes Profil oder schlicht null Rezensionen führen alle zum
 * selben Ergebnis: Die Seite zeigt an diesen Stellen gar keine
 * Bewertungsaussage. Eine ausgedachte 5,0 wäre keine Zuspitzung, sondern eine
 * glatte Tatsachenbehauptung – und Bewertungsangaben sind der Klassiker unter
 * den UWG-Abmahnungen (§ 5 Abs. 1 UWG, dazu seit 2022 die Pflicht anzugeben,
 * ob Bewertungen auf Echtheit geprüft werden).
 *
 * Eine kaputte API darf eine Seite leerer machen, niemals unwahrer.
 */
export async function holeGoogleBewertungen(): Promise<GoogleBewertungen | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return null;

  /* ⚠️ DIE PLACE-ID MUSS GESETZT SEIN. Die Textsuche darf sie nicht mehr
     selbst bestimmen, und dafür gibt es einen konkreten Anlass:
     Am 07.08. hat sie auf „energiepartner Deutschland Energieberatung
     0173 6834665" die **Dein Energiepartner GmbH in Bielefeld** getroffen
     (ChIJ0SvuzH09ukcR6wMZYFRIc7I) und deren 4,9 samt fünf fremder
     Rezensionen auf dieser Seite ausgespielt. Auf einer Seite, die mit
     Vollständigkeit und Transparenz wirbt, sind fremde Kundenstimmen der
     denkbar schlechteste Fehler – und man sieht ihm nichts an, die Sektion
     wirkt einfach fertig.
     Eine Textsuche wählt immer irgendein Ergebnis. Eine feste ID kann nicht
     danebenliegen. `findePlaceId` bleibt als Hilfsmittel, um die richtige ID
     einmalig zu ermitteln – dann aber mit Prüfung durch einen Menschen. */
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!placeId) {
    if (process.env.GOOGLE_PLACES_SUCHE === "an") {
      const gefunden = await findePlaceId(key);
      console.warn(
        `[google] GOOGLE_PLACE_ID fehlt. Vorschlag aus der Textsuche: ${gefunden ?? "kein Treffer"}. ` +
          "Vor dem Eintragen prüfen, ob das WIRKLICH der richtige Betrieb ist.",
      );
    }
    return null;
  }

  try {
    const antwort = await fetch(
      `${ENDPUNKT}/places/${encodeURIComponent(placeId)}?languageCode=de`,
      {
        headers: {
          "X-Goog-Api-Key": key,
          // Die Feldmaske ist bei dieser API Pflicht und zugleich der
          // Preishebel: Abgerechnet wird nach angeforderten Feldern. Hier
          // steht deshalb genau das, was angezeigt wird, und nichts sonst.
          "X-Goog-FieldMask":
            "id,rating,userRatingCount,googleMapsUri,reviews",
        },
        next: { revalidate: FRISCHE },
      },
    );

    if (!antwort.ok) {
      console.error(
        "[google] Ortsabruf fehlgeschlagen:",
        antwort.status,
        await antwort.text().catch(() => ""),
      );
      return null;
    }

    const ort = (await antwort.json()) as ApiOrt;

    const rezensionen: GoogleRezension[] = (ort.reviews ?? [])
      .map((r) => ({
        text: (r.text?.text ?? r.originalText?.text ?? "").trim(),
        autor: r.authorAttribution?.displayName?.trim() ?? "",
        autorBild: r.authorAttribution?.photoUri,
        autorUrl: r.authorAttribution?.uri,
        wann: r.relativePublishTimeDescription ?? "",
        sterne: Math.round(r.rating ?? 0),
        url: r.googleMapsUri,
      }))
      // Ohne Text und ohne Namen ist es keine zeigbare Rezension: Google
      // verlangt die Nennung des Verfassers, und ein leeres Zitat wäre
      // ohnehin nur eine Sternereihe mit Anführungszeichen.
      .filter((r) => r.text.length > 0 && r.autor.length > 0);

    if (!ort.rating || !ort.userRatingCount || rezensionen.length === 0) {
      return null;
    }

    return {
      quelle: "google",
      note: ort.rating,
      anzahl: ort.userRatingCount,
      profilUrl: ort.googleMapsUri,
      rezensionen,
    };
  } catch (error) {
    console.error("[google] Ortsabruf fehlgeschlagen:", error);
    return null;
  }
}

/** Note in deutscher Schreibweise: 5,0 statt 5. */
export function formatiereNote(note: number) {
  return note.toLocaleString("de-DE", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

/**
 * Schriftgröße und Zeilenlänge eines Zitats, abgeleitet aus seiner Länge.
 *
 * ═══ WAS HIER VORHER STAND ═══
 * Beide Stimmen-Sektionen setzten jede Rezension in Zitatgröße (bis 2,9 rem)
 * und schnitten sie danach mit `line-clamp` auf sechs Zeilen ab. Das erzeugte
 * genau das, was eine Bewertungssektion nicht zeigen darf: ein „…" mitten im
 * Satz. Eine abgeschnittene Kundenstimme ist schlimmer als eine kurze – der
 * Besucher sieht, dass etwas fehlt, und der Teil, der fehlt, könnte alles
 * gewesen sein.
 *
 * Ein größerer Clamp hätte das Problem nur verschoben: Google-Rezensionen
 * haben keine Obergrenze, und der Wert, ab dem nichts mehr abgeschnitten
 * wird, existiert nicht.
 *
 * ═══ DIE URSACHE ═══
 * Nicht der Text war zu lang, sondern die Größe zu groß. 2,9 rem sind eine
 * Auszeichnungsgröße für einen Satz – über vierhundert Zeichen ist das keine
 * Aussage mehr, sondern eine Wand. Umgekehrt verpufft ein Zweizeiler in
 * Lesegröße.
 *
 * Also skaliert die Schrift mit der Länge, statt den Text zu kürzen: Kurze
 * Stimmen sprechen laut, lange sprechen leise und werden dafür vollständig
 * gelesen. Nichts wird abgeschnitten, und die Kacheln bleiben trotzdem in
 * einer Größenordnung.
 *
 * ⚠️ Die Zeilenlänge MUSS mitwandern. `ch` rechnet gegen die Schriftgröße
 * des Elements – 22ch sind bei 2,9 rem eine breite Spalte und bei 1,25 rem
 * eine Briefmarke. Beide Werte gehören deshalb hierher und nicht an die
 * Fundstelle, sonst laufen sie beim nächsten Eingriff auseinander.
 *
 * `text-balance` nur in den kurzen Stufen: Browser geben den Ausgleich bei
 * langen Absätzen ohnehin auf (Chromium rechnet ihn ab wenigen Zeilen nicht
 * mehr), und in Lesegröße ist ein linksbündiger Flattersatz das Richtige.
 *
 * ═══ DIE ANZAHL DECKELT DIE GRÖSSE ═══
 * Länge allein reicht nicht. Vier Rezensionen à 200 Zeichen liegen alle in
 * derselben Längenstufe – und ergaben trotzdem vier Blöcke à 2,4 rem
 * nebeneinander. Als Raster gelesen ist das keine Stimmensammlung mehr,
 * sondern vier konkurrierende Überschriften, und links ausgerichtet fällt
 * das sofort auf: Vier ungleich lange Textsäulen an einer gemeinsamen
 * linken Kante haben vier verschiedene rechte Kanten.
 *
 * Auszeichnungsgröße funktioniert, wenn EIN Zitat die Fläche trägt. Sobald
 * mehrere nebeneinander stehen, ist die Größe nicht mehr Betonung, sondern
 * Lautstärke ohne Hierarchie. Also: je mehr Karten, desto ruhiger die
 * Schrift. Bei drei und mehr ist es Lesegröße, und zwar unabhängig davon,
 * wie kurz die einzelne Stimme ist.
 *
 * ⚠️ JEDE KLASSE STEHT AUSGESCHRIEBEN IM QUELLTEXT. Kein
 * `max-w-[${n}ch]` – Tailwind liest die Dateien als Text und kennt den
 * Wert von `n` nicht. Zusammengebaute Klassennamen landen nie im
 * Stylesheet, und der Fehler fällt erst im Produktionsbuild auf, wo der
 * Zeilenlängen-Deckel dann einfach fehlt.
 */
export function zitatKlassen(
  text: string,
  {
    /** Zentrierter Satz braucht längere Zeilen: Bei kurzen Zeilen franst
     *  jede anders aus und der Block zerfällt zur Zickzackkante. */
    ausrichtung = "links",
    /** Wie viele Stimmen stehen nebeneinander. Deckelt die Stufe. */
    anzahl = 1,
  }: { ausrichtung?: "links" | "mitte"; anzahl?: number } = {},
) {
  const laenge = text.trim().length;
  const mittig = ausrichtung === "mitte";

  /* 0 = Auszeichnung, 1 = Zwischengröße, 2 = Lesegröße.
     Erst aus der Länge, dann von der Anzahl nach unten gedeckelt – die
     Stufe kann dadurch nur ruhiger werden, nie lauter. */
  let stufe = laenge <= 110 ? 0 : laenge <= 240 ? 1 : 2;
  if (anzahl >= 3) stufe = Math.max(stufe, 2);
  else if (anzahl === 2) stufe = Math.max(stufe, 1);

  if (stufe === 0) {
    return mittig
      ? "t-quote max-w-[26ch] text-balance"
      : "t-quote max-w-[22ch] text-balance";
  }

  if (stufe === 1) {
    return mittig
      ? "t-h3 max-w-[34ch] text-balance"
      : "t-h3 max-w-[30ch] text-balance";
  }

  // Lesegröße, volle Länge, kein „…".
  return mittig ? "t-lead max-w-[50ch]" : "t-lead max-w-[46ch]";
}
