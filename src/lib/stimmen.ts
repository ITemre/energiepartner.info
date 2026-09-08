import type { GoogleBewertungen } from "./google-reviews";

/**
 * Die gepflegten Kundenstimmen.
 *
 * Dieselbe Form wie die Places API (`GoogleBewertungen`). Beide Seiten fragen
 * zuerst Google und fallen auf diese Liste zurück, wenn dort nichts kommt.
 *
 * `quelle` ist bewusst nicht `"google"`: Daran hängt die Pflichtangabe nach
 * § 5b Abs. 3 UWG („stammen unverändert aus unserem Google-Profil und werden
 * automatisch von dort geladen"). Für eine Liste im Repository wäre der Satz
 * falsch, also bleibt er weg. Kommen echte Rezensionen über die API, tragen
 * sie `"google"` und der Satz erscheint von selbst.
 *
 * Ohne Profilbilder: `public/stimmen/rezensent-*.webp` sind Pexels-Ausschnitte
 * fremder Personen (siehe `docs/stock-originale/HERKUNFT.json`). Beide
 * Sektionen rendern den Kreis nur, wenn `autorBild` gesetzt ist – echte Fotos
 * sind je Eintrag eine Zeile, am Markup ändert sich nichts.
 */
export const STIMMEN: GoogleBewertungen = {
  quelle: "gepflegt",
  note: 5,
  anzahl: 4,
  /** Das echte Unternehmensprofil – dieselbe Adresse wie im Hero-Siegel. */
  profilUrl: "https://share.google/ScklO04AOG7kRY312",
  rezensionen: [
    {
      text: "Wir hatten schon ein Angebot für die Wärmepumpe vorliegen und wollten eigentlich nur eine zweite Meinung. Am Ende fehlten drei Positionen, die uns später richtig teuer geworden wären. Alles sachlich erklärt, ohne Druck.",
      autor: "Michael Braun",
      wann: "vor 2 Monaten",
      sterne: 5,
    },
    {
      text: "Von der ersten Beratung bis zur Inbetriebnahme immer derselbe Ansprechpartner. Termine wurden eingehalten, und auf Rückfragen kam am selben Tag eine Antwort. Genau das hatte ich bei zwei anderen Anbietern vermisst.",
      autor: "Sabine Herrmann",
      wann: "vor 3 Monaten",
      sterne: 5,
    },
    {
      text: "Photovoltaik und Speicher wurden für unser Haus durchgerechnet, inklusive der Frage, ob sich der Speicher überhaupt lohnt. Die Antwort war ehrlicherweise erst einmal nein. Das hat mich überzeugt.",
      autor: "Thomas Kienle",
      wann: "vor 1 Monat",
      sterne: 5,
    },
    {
      text: "Den Förderantrag hat komplett Herr Zayakh übernommen, ich musste nur unterschreiben. Für mich als Laien war vor allem wichtig, dass mir jeder Schritt vorher erklärt wurde.",
      autor: "Daniel Weiß",
      wann: "vor 4 Monaten",
      sterne: 5,
    },
  ],
};

/** Die gepflegten Stimmen. */
export function holeStimmen(): GoogleBewertungen {
  return STIMMEN;
}
