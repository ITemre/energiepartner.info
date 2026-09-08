import type { Metadata } from "next";
import { AvHero } from "@/components/av/AvHero";
import { AvPacing } from "@/components/av/AvPacing";
import { AvZahl } from "@/components/av/AvZahl";
import { AvStimmen } from "@/components/av/AvStimmen";
import { AvAblauf } from "@/components/av/AvAblauf";
import { AvTransparenz } from "@/components/av/AvTransparenz";
import { AvCtaBand } from "@/components/av/AvCtaBand";
import { holeGoogleBewertungen } from "@/lib/google-reviews";
import { holeStimmen } from "@/lib/stimmen";

/**
 * KEIN `title` MEHR (08.09.). Er stand hier als „Angebot prüfen lassen ·
 * Wärmepumpe" und lief durch die Vorlage des Layouts – zusammen ergab das
 * 58 Zeichen, hart an der Kante, an der Google abschneidet.
 *
 * Der Titel steht jetzt EINMAL, als `title.default` im Layout der
 * Route-Group. Diese Seite ist die einzige darin; zwei Stellen für einen
 * Titel sind hier zwei Gelegenheiten, sie auseinanderlaufen zu lassen.
 */
export const metadata: Metadata = {
  description:
    "Wärmepumpen-Angebot hochladen und kostenlos auf Vollständigkeit prüfen lassen. Rückmeldung innerhalb von 24 Stunden, ohne Verpflichtung.",
};

/**
 * angebote-vergleichen.info · Leadstrecke.
 *
 * DER AUFBAU IST EINE EINWAND-KETTE * Der Funnel steht im ersten Bild und bedient alle, die schon entschieden
 * sind. Alles darunter ist für die, die gezögert haben – und jede Sektion
 * räumt genau einen Einwand aus, in der Reihenfolge, in der sie auftreten:
 *
 *   Pacing        noch kein Einwand, sondern der Einstieg in die Kette.
 *                 Zwei Sätze, denen niemand widersprechen kann, bevor
 *                 überhaupt etwas behauptet wird. Freigegebene Kundencopy
 *                 (Briefing 5), wörtlich.
 *   Die Zahl      „Lohnt sich das überhaupt?"
 *                 Der Beweis am Beispiel: Die Summe wächst, während die
 *                 fehlenden Positionen auftauchen. Sie zeigt nebenbei
 *                 auch das Fachwissen, denn sie benennt die fehlenden
 *                 Positionen einzeln.
 *   Stimmen       „Wem ist es schon so gegangen?"
 *                 Dieselben Google-Rezensionen wie auf
 *                 energiepartner.info, aus derselben Quelle. Steht
 *                 zwischen Beweis und Ablauf: Erst das eigene Rechenbeispiel
 *                 (unser Wort), dann fremde Stimmen (nicht unser Wort),
 *                 dann die Frage, worauf man sich einlässt.
 *   Ablauf        „Worauf lasse ich mich ein?"
 *                 Fünf Schritte, davon einer beim Kunden.
 *   Transparenz   „Was habt ihr davon?"
 *                 Die Frage, die bei einer kostenlosen Leistung immer
 *                 mitläuft – beantwortet, bevor sie gestellt wird.
 *
 * Nach jeder steht ein CTA-Band. Wer nach der zweiten Sektion überzeugt
 * ist, soll nicht bis ans Seitenende scrollen müssen: Auf einer
 * Leadstrecke ist die Länge des Wegs zur Handlung die eigentliche
 * Konversionsgröße.
 *
 * BANDRHYTHMUS *   navy(Hero) · papier(Pacing) · navy(Zahl) · sand(CTA) · papier(Stimmen)
 *   · navy(Ablauf) · sand(CTA) · navy-deep(Transparenz) · navy(CTA)
 *
 * Sand und Papier stoßen an einer Stelle aneinander (CTA → Stimmen). Das
 * geht nur, weil das CTA-Band `border-y` trägt: Die Kante ist gezeichnet,
 * nicht dem Helligkeitsunterschied überlassen. Ohne diesen Rahmen wären es
 * zwei fast gleiche Hellwerte, die weder als Fläche noch als Wechsel
 * durchgehen – genau der Fehler, der auf energiepartner.info schon einmal
 * korrigiert wurde.
 *
 * Nicht eingehängt: `AvPruefung` (die Zahl benennt die fehlenden
 * Positionen bereits einzeln – die Prüfliste sagte dasselbe ein zweites
 * Mal, nur als Aufzählung; ihr CTA-Band fiel mit ihr weg, sonst hätten
 * zwei Bänder aufeinander gestanden), `AvAuswertung` (überschneidet sich
 * mit der Prüfliste), `AvAbschluss` (dessen CTA erledigen jetzt die Bänder
 * – und er hängt noch am entfernten `AnfrageProvider`, siehe Layout).
 */
export default async function AngebotePage() {
  /* Serverseitig, exakt wie auf energiepartner.info: Der Places-Schlüssel
     darf den Server nie verlassen. Echte Rezensionen haben Vorrang, sonst
     greift die gepflegte Liste aus `lib/stimmen.ts`.

     Liefert beides nichts, rendert `AvStimmen` `null` und die Sektion
     existiert für den Besucher nicht. Auf energiepartner.info bleibt an
     dieser Stelle eine Ersatzzeile stehen, weil `#referenzen` dort ein
     Navigationsziel ist; eine Leadstrecke ohne Menü hat diesen Zwang
     nicht, und eine leere Vertrauenssektion ist schlechter als keine. */
  const bewertungen = (await holeGoogleBewertungen()) ?? holeStimmen();

  return (
    <main className="flex-1">
      {/* DER GEMEINSAME NAVY-GRUND IST WEG (08.09.).
          Hier lag ein `bg-ep-navy-deep`-Wrapper um Hero, Pacing und
          Beispielrechnung. Er hatte genau einen Zweck: Hero und Zahl waren
          beide navy-deep, und an ihren Nähten zum hellen Pacing dazwischen
          landete die Kante auf dem Handy fast immer auf einem halben Pixel
          (die Herohöhe rechnet in `svh`). Der Browser rundete zwei Flächen
          auseinander und ließ eine helle Haarlinie stehen; ein durchlaufender
          Grund darunter hat das aufgefangen.

          Seit der Hero auf Papier läuft, gibt es diese Nähte nicht mehr:
          Hero und Pacing sind beide hell, die einzige verbliebene Kante ist
          Pacing→Zahl, und die ist ein gewollter Bandwechsel mit vollem
          Kontrast. Ein Navy-Wrapper darunter wäre jetzt das Gegenteil einer
          Hilfe – er läge als dunkle Fläche hinter zwei hellen Sektionen und
          würde an jeder gerundeten Kante durchblitzen. */}
      <AvHero bewertungen={bewertungen} />

      {/* Freigegebene Kundencopy (Briefing 5), wörtlich.
          STELLUNG: zwischen Funnel und Beweis. Vor dem Hero ginge nicht,
          der trägt die Ein-Bildschirm-Zusage; hinter der Zahl wäre es ein
          Nachklapp, weil dann bereits argumentiert wurde. Genau hier ist
          der Satz das, wofür Pacing gedacht ist – die erste Zeile für
          alle, die nicht sofort hochgeladen haben.

          Die Sektion trägt seit dem 08.09. eine Akzentkante an der
          Oberkante. Sie ist keine Zierde: Hero und Pacing sind jetzt
          dieselbe Fläche, und ohne gezeichnete Kante gäbe es zwischen dem
          ersten Bild und dem zweiten Abschnitt kein Signal. Dieselbe Lösung
          steht auf energiepartner.info an der Förderung, aus demselben
          Grund. */}
      <AvPacing />

      {/* „Lohnt sich das?" – der Beweis am Beispiel. */}
      <AvZahl />
      <AvCtaBand
        ton="hell"
        zeile="Was fehlt in Ihrem Angebot? Finden wir es heraus."
      />

      {/* „Wem ist es schon so gegangen?" – dieselben Google-Rezensionen wie
          auf energiepartner.info, aus derselben serverseitigen Quelle.

          Zwischen CTA-Band und Ablauf und nicht davor: Das Band gehört
          direkt an die Beispielrechnung, es ist deren Auflösung („Was fehlt
          in Ihrem Angebot?"). Diese beiden zu trennen würde den stärksten
          Moment der Seite von seiner Handlung abschneiden.

          Ohne echte Rezensionen rendert die Sektion `null` – dann steht das
          CTA-Band direkt vor dem Ablauf, also wieder der Zustand von vorher.
          Es entsteht keine Lücke, die man später zuschieben müsste. */}
      <AvStimmen bewertungen={bewertungen} />

      {/* „Worauf lasse ich mich ein?" – fünf Schritte. */}
      <AvAblauf />
      <AvCtaBand
        ton="hell"
        zeile="Schritt eins dauert drei Minuten. Den Rest übernehmen wir."
      />

      {/* „Was habt ihr davon?" – offen, bevor jemand fragt. */}
      <AvTransparenz />
      <AvCtaBand zeile="Kostenlos, unverbindlich, und Sie behalten die Entscheidung." />
    </main>
  );
}
