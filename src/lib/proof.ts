/**
 * Belege: Kennzahlen und Referenzfälle.
 *
 * KENNZAHLEN stehen so im Projekt-Briefing (Abschnitt 7) und sind freigegeben.
 * Keine davon behauptet eine Erfolgsgeschichte: Berufserfahrung, ein
 * Fördersatz des Bundes, eine Zusage über das eigene Verhalten.
 *
 * REFERENZFAELLE sind Entwürfe und zeigen die Form, in der wir Ilias' echte
 * Fälle brauchen. Sie erscheinen nirgends – `Referenzen.tsx` ist in
 * `(energiepartner)/page.tsx` ausgehängt. Wer die Sektion zurückholt, trägt
 * vorher echte Fälle ein: eine erfundene Fallzahl ist eine
 * Tatsachenbehauptung über die eigene Leistung (§ 5 Abs. 1 UWG).
 */

export type Kennzahl = {
  /** Der Wert, so wie er dasteht. */
  wert: string;
  /** Wofür er steht. Kurz, zwei bis vier Wörter. */
  label: string;
};

export type Referenzfall = {
  /** Ort und Gebäudeart statt Kundenname – Privatkunden nennt man nicht. */
  ort: string;
  gebaeude: string;
  /** Die Ausgangslage in einem Satz. */
  ausgangslage: string;
  /** Was die Prüfung ergeben hat. Das ist der Teil, der uns auszeichnet. */
  befund: string;
  /** Das Ergebnis in Zahlen. Zwei bis drei Punkte, jeder mit einem Wert. */
  ergebnis: { wert: string; text: string }[];
};

/**
 * Kennzahlen für die Beleg-Zeile unter dem Hero.
 *
 * Bewusst konservativ (Briefing 7): Der Wärmepumpenmarkt ist jung, und
 * „12 Jahre Erfahrung" oder „1.200+ Projekte" wären beim ersten Nachfragen
 * widerlegt. Eine Zahl, die der Empfänger in dreißig Sekunden kippen kann,
 * schadet mehr als gar keine.
 */
export const KENNZAHLEN: Kennzahl[] = [
  /* EIN WORT JE LABEL, nicht mehr. Die Langfassungen („Erfahrung in der
     Energieberatung", „Förderung für Wärmepumpen") standen in einer
     einzeiligen Leiste als Fließtext neben der Zahl und machten aus vier
     Angaben vier Sätze. Wert und Label bilden zusammen die Aussage:
     „5 Jahre Erfahrung", „bis 80 % Förderung". Was darüber hinausgeht,
     erklärt die Sektion daneben. */
  { wert: "5 Jahre", label: "Erfahrung" },
  /* „300+ geprüfte Angebote" ist raus (12.08., Emre). Von allen vier war
     das die einzige Zahl über die eigene BILANZ – und der Betrieb hat noch
     keinen abgeschlossenen Kunden. Die verbliebenen drei sind anderer Natur:
     Berufserfahrung, ein Fördersatz des Bundes und eine Zusage über das
     eigene Verhalten. Keine davon behauptet eine Erfolgsgeschichte. */
  { wert: "bis 80 %", label: "Förderung" },
  { wert: "24 Std.", label: "Rückmeldung" },
];

export const REFERENZFAELLE: Referenzfall[] = [
  {
    ort: "Gerlingen",
    gebaeude: "Einfamilienhaus, Baujahr 1978",
    ausgangslage:
      "Die Ölheizung war 24 Jahre alt. Ein Angebot für eine Wärmepumpe lag bereits vor, unterschrieben war noch nichts.",
    befund:
      "Die Anlage war mit 14 kW deutlich zu groß ausgelegt. Steigleitung, hydraulischer Abgleich und der Elektroanschluss fehlten im Angebot vollständig.",
    ergebnis: [
      { wert: "10 kW", text: "statt 14 kW nach neuer Heizlastberechnung" },
      { wert: "6.500 €", text: "an Positionen, die nachträglich fällig gewesen wären" },
      { wert: "55 %", text: "Förderung ausgeschöpft, Antrag über uns" },
    ],
  },
  {
    ort: "Ditzingen",
    gebaeude: "Doppelhaushälfte, Sanierung",
    ausgangslage:
      "Dach frei, Stromkosten hoch, drei Angebote für Photovoltaik eingeholt und den Überblick verloren.",
    befund:
      "Zwei der drei Angebote rechneten mit einem Eigenverbrauch, der zum tatsächlichen Lastprofil nicht passte. Der Speicher hätte sich im ersten Angebot nicht getragen.",
    ergebnis: [
      { wert: "9,8 kWp", text: "Anlage, ausgelegt auf den echten Verbrauch" },
      { wert: "ohne Speicher", text: "gestartet, Nachrüstung bleibt möglich" },
      { wert: "4 Wochen", text: "von der Beratung bis zur Inbetriebnahme" },
    ],
  },
  {
    ort: "Stuttgart-Feuerbach",
    gebaeude: "Zweifamilienhaus, Baujahr 1995",
    ausgangslage:
      "Gastherme defekt, schneller Ersatz nötig, gleichzeitig sollte die Förderung nicht verfallen.",
    befund:
      "Die Förderfähigkeit hing an der Reihenfolge der Anträge. Ein zu früh unterschriebener Auftrag hätte den Zuschuss vollständig gekostet.",
    ergebnis: [
      { wert: "22.400 €", text: "Zuschuss gesichert durch richtige Antragsfolge" },
      { wert: "3 Wochen", text: "bis zum festen Installationstermin" },
      { wert: "1", text: "Ansprechpartner über den ganzen Vorgang" },
    ],
  },
];

/**
 * Die Kennzahlen für die Beleg-Zeile.
 *
 * Der Rückgabetyp bleibt `| null`, obwohl heute nie `null` zurückkommt.
 * `ProofBar` und `Hero` behandeln den leeren Fall bereits sauber (die
 * Sektion entfällt dann ersatzlos), und diese Behandlung soll erhalten
 * bleiben: Wer die Liste später aus einer Quelle zieht, die ausfallen kann,
 * ändert nur diese Funktion und nicht drei Aufrufstellen.
 */
export function holeKennzahlen(): Kennzahl[] | null {
  return KENNZAHLEN;
}

/**
 * WIRD DERZEIT VON KEINER SEITE AUFGERUFEN, und das ist die Sicherung.
 * Die Fälle sind Entwürfe (siehe Kopf dieser Datei). `Referenzen.tsx` ist
 * ausgehängt; wer die Sektion zurückholt, trägt vorher echte Fälle ein.
 */
export function holeReferenzfaelle(): Referenzfall[] | null {
  return REFERENZFAELLE;
}
