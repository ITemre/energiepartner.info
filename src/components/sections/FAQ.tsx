/**
 * FAQ – wird neu gebaut (12.08., Emre). Die Sektion ist leer.
 *
 * DIE FRAGEN BLEIBEN STEHEN. Sie sind der Grund, warum es die Sektion
 * gibt: Jede räumt einen Einwand aus, der sonst zwischen Lesen und Anrufen
 * steht. Zwei davon sind zusätzlich rechtlich relevant („Bauen Sie selbst
 * ein?" und „Woran verdienen Sie?" tragen die Vermittler- und
 * Vergütungsaussage im Wortlaut des Briefings).
 *
 * `freigabeOffen` an Frage zwei: Die Preisspanne ist ein Entwurf von
 * Corivo und von Ilias abzunehmen.
 */
const FRAGEN = [
  {
    frage: "Was kostet mich die Beratung?",
    antwort:
      "Nichts. Die Bestandsaufnahme, die Auslegung, die Wirtschaftlichkeitsrechnung und die Förderprüfung bekommen Sie, ohne dass Sie etwas beauftragen. Erst wenn Sie sich für eine Umsetzung entscheiden, entstehen Kosten, und die stehen vorher schriftlich fest.",
  },
  {
    frage: "Und was kostet die Anlage?",
    antwort:
      "Das hängt am Haus, deshalb nennt Ihnen niemand seriös vorab eine Zahl. Was wir Ihnen sagen können: Bei einem Einfamilienhaus liegt eine Wärmepumpe inklusive Einbau in aller Regel im mittleren fünfstelligen Bereich, bevor die Förderung abgezogen wird. Nach Abzug bleibt oft deutlich weniger übrig, als die meisten erwarten. Die konkrete Zahl für Ihr Haus steht in der Wirtschaftlichkeitsrechnung, die Sie kostenlos bekommen.",
    /* Von Ilias abzunehmen: Spanne bestätigen oder korrigieren. */
    freigabeOffen: true,
  },
  {
    frage: "Was, wenn mein Haus gar nicht geeignet ist?",
    antwort:
      "Dann sagen wir Ihnen das, und der Termin ist beendet. Eine Wärmepumpe in ein Haus zu planen, das dafür nicht taugt, produziert einen unzufriedenen Kunden und eine schlechte Bewertung. Uns nützt das nichts. In solchen Fällen sprechen wir über das, was tatsächlich zuerst hilft, etwa die Hülle oder eine andere Reihenfolge der Maßnahmen.",
  },
  {
    frage: "Wie lange dauert es vom ersten Gespräch bis zur fertigen Anlage?",
    antwort:
      "Rechnen Sie mit einigen Monaten. Beratung und Planung sind in Wochen erledigt, danach bestimmen Förderbescheid, Netzbetreiber und die Auslastung der Fachbetriebe das Tempo. Wir nennen Ihnen keinen Wunschtermin, sondern einen, den wir halten können, und sagen Ihnen, sobald sich etwas verschiebt.",
  },
  {
    frage: "Bauen Sie selbst ein?",
    antwort:
      "Nein. Wir beraten, planen und vergleichen anbieterübergreifend, die Ausführung übernehmen geprüfte Fachbetriebe. Für Sie ändert das nichts an der Zuständigkeit: Ihr Ansprechpartner bleibt derselbe, von der ersten Frage bis zur Abnahme.",
  },
  {
    frage: "Woran verdienen Sie?",
    antwort:
      "Bei erfolgreicher Vermittlung können wir eine Vergütung vom ausführenden Unternehmen erhalten. Ihre Entscheidung bleibt davon unberührt, und Sie zahlen deswegen nicht mehr. Wir sagen Ihnen das hier, weil Sie es ohnehin wissen sollten, bevor Sie uns Ihr Haus zeigen.",
  },
  {
    frage: "Ich habe schon ein Angebot. Bringt ein Gespräch dann noch etwas?",
    antwort:
      "Gerade dann. Wir lesen ein vorliegendes Angebot Position für Position und sagen Ihnen, was darin fehlt. Es geht nicht darum, es zu unterbieten, sondern darum, dass Sie wissen, was Sie unterschreiben. Auch das kostet Sie nichts.",
  },
] as const;

void FRAGEN;

export function FAQ() {
  return (
    <section
      id="fragen"
      data-nav-theme="light"
      className="scroll-mt-[var(--nav-h)] bg-ep-paper"
    />
  );
}
