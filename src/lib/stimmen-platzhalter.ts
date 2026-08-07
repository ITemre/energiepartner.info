import type { GoogleBewertungen } from "./google-reviews";

/**
 * Vorläufige Stimmen für die Kundenpräsentation.
 *
 * ═══ WOZU ═══
 * Das Google-Profil ist frisch angelegt; die eine vorhandene Rezension steht
 * bei Google noch auf „ausstehend" und wird deshalb über die API nicht
 * ausgeliefert. Ohne Inhalt bliebe die Stimmen-Sektion leer, und eine leere
 * Sektion in einer Präsentation liest sich als unfertige Seite, obwohl sie
 * fertig ist.
 *
 * Die Daten haben deshalb exakt die Form, die auch die Places API liefert
 * (`GoogleBewertungen`). Sobald dort echte Rezensionen stehen, gewinnen sie
 * automatisch und hier ändert sich keine Zeile Markup.
 *
 * ═══ ⚠️ NICHT VERÖFFENTLICHEN ═══
 * Diese Texte sind erfunden. Auf einer öffentlich erreichbaren Seite wären
 * sie eine Tatsachenbehauptung über Kundenzufriedenheit, die es so nicht
 * gibt, und Bewertungsangaben sind der zuverlässigste Abmahnfall im
 * gesamten Wettbewerbsrecht (§ 5 Abs. 1 UWG, dazu § 5b Abs. 3 zur Frage, ob
 * Bewertungen auf Echtheit geprüft werden).
 *
 * Deshalb: `PLATZHALTER_INHALTE` steht in `.env.local` und ist damit an die
 * Umgebung gebunden, nicht an den Code. Auf dem Präsentationsrechner steht
 * die Variable, auf dem Livesystem nicht — und wo sie nicht steht, zeigt die
 * Seite an dieser Stelle nichts. Ein Schalter, der im Code steht, reist mit
 * dem Deploy mit; einer in der Umgebung nicht. Genau das ist der Unterschied.
 *
 * Sobald echte Rezensionen vorliegen: Variable entfernen, diese Datei
 * löschen, den Fallback in `page.tsx` und `av/page.tsx` streichen.
 *
 * ═══ ⚠️⚠️ ZU DEN PROFILBILDERN ═══
 * `autorBild` zeigt auf Ausschnitte aus vier Pexels-Stockfotos
 * (`public/stimmen/rezensent-*.webp`, Originale liegen daneben in `public/`).
 * Das sind REAL EXISTIERENDE, ERKENNBARE MENSCHEN, die mit diesem Betrieb
 * nichts zu tun haben.
 *
 * Sie hängen deshalb an derselben Sperre wie die Texte und dürfen sie unter
 * keinen Umständen verlassen. Öffentlich ausgespielt wäre das nicht nur eine
 * erfundene Bewertung (§ 5 Abs. 1 UWG), sondern zusätzlich eine Verwendung
 * fremder Bildnisse zu Werbezwecken ohne Einwilligung (§ 22 KUG) – und die
 * Pexels-Lizenz schließt Darstellungen mit Empfehlungscharakter ausdrücklich
 * aus. Drei Anspruchsgegner für dasselbe Bild.
 *
 * Sie existieren für genau einen Zweck: die Kundenpräsentation, damit Ilias
 * die fertige Form sieht. Sobald echte Rezensionen da sind, liefert Google
 * die Profilbilder selbst mit (`authorAttribution.photoUri`), und diese
 * Dateien gehören zusammen mit den Originalen aus `public/` gelöscht.
 */
export const STIMMEN_PLATZHALTER: GoogleBewertungen = {
  // Steuert genau eine Sache: die Pflichtangabe zur Echtheitsprüfung
  // („stammen unverändert aus unserem Profil") bleibt weg. Sterne, Note,
  // Anzahl und Google-Zeichen stehen, damit der Auftritt in der Vorführung
  // vollständig wirkt.
  quelle: "platzhalter",
  note: 5,
  anzahl: 4,
  // Das echte Unternehmensprofil. Ein Verweis, der ins Leere führt, fällt in
  // einer Vorführung sofort auf – und diese Adresse stimmt, unabhängig
  // davon, welche Stimmen gerade angezeigt werden.
  profilUrl: "https://share.google/ScklO04AOG7kRY312",
  rezensionen: [
    {
      text: "Wir hatten schon ein Angebot für die Wärmepumpe vorliegen und wollten eigentlich nur eine zweite Meinung. Am Ende fehlten drei Positionen, die uns später richtig teuer geworden wären. Alles sachlich erklärt, ohne Druck.",
      autor: "Michael Braun",
      autorBild: "/stimmen/rezensent-3.webp",
      wann: "vor 2 Monaten",
      sterne: 5,
    },
    {
      text: "Von der ersten Beratung bis zur Inbetriebnahme immer derselbe Ansprechpartner. Termine wurden eingehalten, und auf Rückfragen kam am selben Tag eine Antwort. Genau das hatte ich bei zwei anderen Anbietern vermisst.",
      autor: "Sabine Herrmann",
      autorBild: "/stimmen/rezensent-2.webp",
      wann: "vor 3 Monaten",
      sterne: 5,
    },
    {
      text: "Photovoltaik und Speicher wurden für unser Haus durchgerechnet, inklusive der Frage, ob sich der Speicher überhaupt lohnt. Die Antwort war ehrlicherweise erst einmal nein. Das hat mich überzeugt.",
      autor: "Thomas Kienle",
      autorBild: "/stimmen/rezensent-1.webp",
      wann: "vor 1 Monat",
      sterne: 5,
    },
    {
      text: "Den Förderantrag hat komplett Herr Zayakh übernommen, ich musste nur unterschreiben. Für mich als Laien war vor allem wichtig, dass mir jeder Schritt vorher erklärt wurde.",
      // Hieß „Andrea Weiß". Umbenannt, weil das vierte Stockfoto einen Mann
      // zeigt und ein weiblicher Name über einem männlichen Profilbild in
      // der Vorführung sofort als Attrappe auffällt.
      autor: "Daniel Weiß",
      autorBild: "/stimmen/rezensent-4.webp",
      wann: "vor 4 Monaten",
      sterne: 5,
    },
  ],
};

/**
 * Liefert die vorläufigen Stimmen — aber nur, wenn die Umgebung sie
 * ausdrücklich erlaubt.
 *
 * Die Prüfung auf `production` ist die zweite Sperre: Selbst wenn die
 * Variable versehentlich in eine Produktivumgebung gerät, bleibt die Sektion
 * dort leer. Zwei Bedingungen, die beide erfüllt sein müssen, damit
 * erfundene Bewertungen jemals sichtbar werden.
 */
export function holePlatzhalterStimmen(): GoogleBewertungen | null {
  if (process.env.PLATZHALTER_INHALTE !== "an") return null;

  if (process.env.NODE_ENV === "production") {
    console.warn(
      "[stimmen] PLATZHALTER_INHALTE ist in einer Produktionsumgebung gesetzt. " +
        "Erfundene Bewertungen werden NICHT ausgeliefert. Variable entfernen.",
    );
    return null;
  }

  return STIMMEN_PLATZHALTER;
}
