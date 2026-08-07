"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { BendLine } from "@/components/ui/BendLine";
import { maskedHeadline, revealItems } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * „Was nach Ihrer Unterschrift passiert."
 *
 * WARUM ES DIESE SEKTION GIBT. Die Seite endete inhaltlich beim Ergebnis der
 * kostenlosen Beratung – also genau an dem Punkt, an dem der Besucher zum
 * ersten Mal etwas zu verlieren hat. Was danach kommt, stand nirgends.
 *
 * Das ist kein Schönheitsfehler. Der Kunde hat zuletzt einen bereits
 * entschiedenen PV-Auftrag verloren, weil er auf genau diese Frage keine
 * Antwort geben konnte. Wer nach der Unterschrift nicht weiß, wer wann bei
 * ihm klingelt, unterschreibt nicht – und zwar unabhängig davon, wie gut das
 * Angebot war. Transparenz über den Ablauf ist hier kein Vertrauensbonus,
 * sondern die Voraussetzung für den Abschluss.
 *
 * Sie steht direkt nach der Aufgabenteilung: Dort steht „wir machen den
 * Rest", hier steht, was „der Rest" konkret ist. Die Reihenfolge ist
 * Behauptung, dann Beleg.
 *
 * ⚠️ FREIGABE STEHT AUS. Die sechs Schritte sind ein ENTWURF VON CORIVO, kein
 * abgestimmter Kundentext. Der Kunde kennt seinen eigenen Nachlauf bisher
 * nicht in dieser Form – das ist ja die Ursache des Problems. Er geht die
 * Schritte im Termin durch und korrigiert sie; erst danach sind sie
 * verbindlich. Zeitangaben sind bewusst Spannen und keine Zusagen: Ein
 * konkretes Datum an dieser Stelle wäre ein Versprechen über Dritte
 * (Fachbetrieb, Netzbetreiber, Förderstelle), das niemand halten kann.
 */
const SCHRITTE = [
  {
    titel: "Auftrag und Unterlagen",
    dauer: "in den ersten Tagen",
    text: "Sie unterschreiben einmal. Danach sammeln wir, was gebraucht wird: Zählerstände, Grundriss, Fotos vom Heizungsraum.",
  },
  {
    titel: "Vor-Ort-Termin mit dem Fachbetrieb",
    dauer: "in den ersten Wochen",
    text: "Aufmaß, Aufstellort, Leitungswege, Elektroanschluss. Wir sind bei diesem Termin dabei, damit Sie nicht allein mit dem Monteur dastehen.",
  },
  {
    titel: "Förderung und Anmeldungen",
    dauer: "parallel dazu",
    text: "Förderantrag, Anmeldung beim Netzbetreiber, Eintrag im Marktstammdatenregister. Die Anträge stellen wir, Sie unterschreiben nur, wo es sein muss.",
  },
  {
    titel: "Fester Installationstermin",
    dauer: "sobald die Freigaben da sind",
    text: "Sie bekommen ein Datum, keine Ankündigung, dass sich jemand melden wird.",
  },
  {
    titel: "Installation und Inbetriebnahme",
    dauer: "meist wenige Tage",
    text: "Der Fachbetrieb baut ein, wir begleiten. Ihr Ansprechpartner bleibt derselbe wie am ersten Tag.",
  },
  {
    titel: "Abnahme, Einweisung, Unterlagen",
    dauer: "zum Abschluss",
    text: "Gemeinsame Abnahme, Einweisung in die Anlage, Protokoll und Dokumentation. Den Förderabruf übernehmen wir. Danach bleiben wir erreichbar.",
  },
] as const;

export function Ablauf() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Eigener Trigger je Schritt: Die Sektion soll mit dem Scrolltempo
        // mitgehen. Bei einem gemeinsamen Stagger wären die unteren
        // Schritte längst aufgedeckt, bevor man bei ihnen ankommt.
        revealItems("[data-abl-schritt]", { distance: 26, start: "top 88%" });
        revealItems("[data-abl-klammer]", { distance: 20, start: "top 92%" });

        return maskedHeadline({
          headline: "[data-abl-h2]",
          follow: "[data-abl-eyebrow]",
          scrollTrigger: { trigger: scope.current, start: "top 78%", once: true },
        });
      });
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      id="ablauf"
      /* Navy, weil die Aufgabenteilung davor auf Papier läuft – ohne den
         Wechsel liefen zwei helle Bänder ineinander und die Sektion wäre
         optisch ein Anhängsel der vorigen statt eine eigene Aussage.
         ⚠️ `data-nav-theme` ist Pflicht, sonst behält die Kopfleiste die
         Farbe des vorherigen Bandes und wird hier unlesbar. */
      data-nav-theme="dark"
      className="relative scroll-mt-[var(--nav-h)] overflow-hidden bg-ep-navy-deep text-white"
    >
      <div
        aria-hidden="true"
        className="ep-skala pointer-events-none absolute inset-0"
      />

      <div className="ep-container relative py-24 sm:py-32">
        <div>
          <p data-abl-eyebrow className="t-label text-ep-sun">
            Nach der Unterschrift
          </p>
          {/* Die Überschrift nennt den Zeitpunkt, der sonst nirgends
              vorkommt. „So arbeiten wir" hätte dasselbe Thema gehabt und
              die eigentliche Frage nicht gestellt. */}
          <h2 data-abl-h2 className="t-h2 mt-6 max-w-[17ch]">
            Und dann?{" "}
            <span className="text-ep-sun">Das hier passiert als Nächstes.</span>
          </h2>
          <p
            data-abl-klammer
            className="t-lead mt-7 max-w-[54ch] text-white/80"
          >
            Die meisten Angebote enden mit der Unterschrift und fangen dort
            erst an. Damit Sie wissen, worauf Sie sich einlassen, steht der
            Weg hier vollständig.
          </p>
        </div>

        {/* DIE BLICKFÜHRUNG IST HIER DER GANZE PUNKT.
            Vorher lief jeder Schritt als Zwölfer-Spread: Ziffer auf Spur 1–2,
            Titel auf 3–6, Erklärtext auf 8–12. Titel und Text standen damit
            NEBENEINANDER auf gleicher Höhe – und weil der Text der längere,
            dichtere Block ist, hat ihn das Auge zuerst genommen. Der Titel,
            der die eigentliche Information trägt, wurde zur Randnotiz auf
            halber Strecke.

            Jetzt trägt die Datenblatt-Achse der Marke (`.ep-axis`) die
            Sektion: links die Kennung (Ziffer, Zeitraum), rechts der Inhalt –
            und im Inhalt steht der Titel ÜBER dem Text, nicht daneben.
            Horizontal konkurriert damit nichts mehr mit ihm, gelesen wird von
            oben nach unten. */}
        <ol className="mt-20 sm:mt-28 lg:mt-36">
          {SCHRITTE.map((schritt, i) => (
            <li key={schritt.titel} data-abl-schritt>
              <BendLine className="origin-left text-ep-line-dark" />

              {/* Innenabstand rund verdoppelt (vorher py-8/sm:py-11). Sechs
                  Schritte mit knappem Polster lesen sich als Tabelle; mit
                  Luft dazwischen liest sich jeder als eigener Halt. */}
              <div className="ep-axis py-12 sm:py-16 lg:py-24">
                {/* Spur A – die Kennung. `self-start`, damit sie an der
                    Oberkante des Titels sitzt und nicht mittig zum ganzen
                    Block treibt. */}
                <div className="self-start">
                  <span className="t-num block text-white/25">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {/* Spanne statt Datum: Alles hier hängt an Dritten –
                      Fachbetrieb, Netzbetreiber, Förderstelle. Eine
                      Wochenzahl wäre ein Versprechen über jemanden, den wir
                      nicht steuern, und die erste Enttäuschung im Projekt. */}
                  <p className="t-key mt-3 text-ep-sun">{schritt.dauer}</p>
                </div>

                {/* Spur B – der Inhalt. */}
                <div>
                  <h3 className="max-w-[18ch] text-[clamp(1.625rem,3.4vw,3rem)] font-bold leading-[1.06] tracking-[-0.03em]">
                    {schritt.titel}
                  </h3>
                  {/* Deutlich gedämpfter als der Titel und in kürzerer
                      Zeile: Die Hierarchie darf nicht allein an der Größe
                      hängen, sonst gewinnt der längere Block trotzdem. */}
                  <p className="mt-6 max-w-[46ch] text-[17px] leading-relaxed text-white/65 sm:text-lg lg:mt-8">
                    {schritt.text}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <BendLine className="origin-left text-ep-line-dark" />

        {/* DIE KLAMMER. Sie ist der eigentliche Grund für die Sektion: Nicht
            die sechs Schritte lösen das Problem, sondern dass durch alle
            sechs dieselbe Person durchgeht.

            Sie stand vorher auf `ep-indent` und `max-w-[24ch]` – also
            eingerückt auf die Wertspur und auf ein Maß gedeckelt, bei dem der
            Satz auf dem Desktop in vier kurze Zeilen zerfiel. Das las sich
            wie ein Nachsatz zur Liste, nicht wie ihr Fazit.

            Jetzt steht sie am linken Anschlag über die volle Breite, in
            eigener Größe, mit festen Umbrüchen: eine Zeile Behauptung, eine
            Zeile Umfang. Zufallsumbrüche sind hier ausgeschlossen – bei
            diesem Grad entscheidet jede Fensterbreite sonst neu, wo der Satz
            auseinanderfällt. */}
        <p
          data-abl-klammer
          className="mt-20 text-[clamp(1.75rem,4.2vw,3.75rem)] font-bold leading-[1.06] tracking-[-0.03em] sm:mt-28"
        >
          <span className="block">Ein Ansprechpartner.</span>
          <span className="block text-ep-sun">
            Von der ersten Frage bis zur Abnahme.
          </span>
        </p>
      </div>
    </section>
  );
}
