"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Check } from "lucide-react";
import { Marker } from "@/components/ui/Marker";
import { maskedHeadline, revealItems } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * „Sie entscheiden. Wir machen den Rest." – Entlastung ist das eigentliche
 * Verkaufsargument. Die Asymmetrie zwischen drei und acht Punkten trägt die
 * Aussage, deshalb stehen beide Listen nebeneinander statt untereinander.
 *
 * Ab lg bleibt die linke Spalte stehen, während die rechte durchläuft: Ihre
 * drei Aufgaben sind erledigt und rühren sich nicht mehr, unsere acht ziehen
 * darunter weiter vorbei. Die Asymmetrie wird damit körperlich statt nur
 * gezählt. Reines CSS-Sticky – kein Pin, also kein Risiko auf kleinen
 * Viewports, wo die Spalten ohnehin untereinander stehen.
 */
const YOURS = ["Uns Ihr Haus zeigen", "Fragen stellen", "Entscheiden"] as const;

/* „Installation und Inbetriebnahme" hieß hier vorher, wir würden selbst
   bauen. Wir vermitteln und koordinieren – die Zeile sagt das jetzt, ohne
   an Gewicht zu verlieren: Für den Besucher ändert sich nichts, es bleibt
   unsere Aufgabe. */
const OURS = [
  "Bestandsaufnahme & Verbrauchsanalyse",
  "Auslegung und Simulation",
  "Wirtschaftlichkeitsrechnung",
  "Fördermittel prüfen und beantragen",
  "Anmeldung bei Netzbetreiber und Marktstammdatenregister",
  "Geprüfte Fachbetriebe auswählen und beauftragen",
  "Installation und Inbetriebnahme begleiten",
  "Einweisung",
] as const;

export function Aufgabenteilung() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Ihre drei kommen als Block – sie sind schnell abgehakt.
        gsap.fromTo(
          "[data-a-yours]",
          { x: -12, autoAlpha: 0 },
          {
            x: 0,
            autoAlpha: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: { trigger: "[data-a-lists]", start: "top 84%", once: true },
          },
        );

        // Unsere acht ticken einzeln herein, während die linke Spalte steht.
        // Genau dieser Kontrast ist die Aussage der Sektion.
        revealItems("[data-a-ours]", { distance: 40, duration: 0.6, start: "top 92%" });

        return maskedHeadline({
          headline: "[data-a-h2]",
          follow: "[data-a-eyebrow]",
          scrollTrigger: { trigger: scope.current, start: "top 78%", once: true },
        });
      });
    },
    { scope },
  );

  return (
    <section ref={scope} data-nav-theme="light" className="bg-ep-paper">
      <div className="ep-container py-20 sm:py-28">
        <div>
          <p data-a-eyebrow className="t-label text-ep-accent">
            Aufgabenteilung
          </p>
          <h2 data-a-h2 className="t-h2 mt-6 max-w-[20ch] text-ep-ink">
            Sie entscheiden.{" "}
            <span className="text-ep-navy">
              Wir machen <Marker variante={1}>den Rest</Marker>.
            </span>
          </h2>
        </div>

        <div
          data-a-lists
          className="mt-14 grid items-start gap-12 sm:mt-20 lg:grid-cols-[0.8fr_1.4fr] lg:gap-20"
        >
          {/* Ihre Aufgabe – bewusst kurz. Bleibt ab lg stehen, während
              rechts die lange Liste durchläuft. */}
          <div className="lg:sticky lg:top-[calc(var(--nav-h)+5rem)]">
            <h3 className="t-label text-ep-navy">Ihre Aufgabe</h3>

            {/* Drei Zeilen ohne Auszeichnung lasen sich wie eine Aufzählung
                aus einem Textprogramm. Jetzt trägt jede ihre eigene Ziffer
                und steht über einer Haarlinie – dieselbe Sprache wie die
                Wegmarken in Leistungen und die Trenner im Gesamtsystem.

                Bewusst KEINE Häkchen wie in der rechten Spalte: Diese drei
                sind nicht abgehakt, sondern das, was der Besucher noch tun
                wird. Ein Häkchen davor würde das Gegenteil behaupten. */}
            <ol className="mt-10 flex flex-col">
              {YOURS.map((task, i) => (
                <li
                  key={task}
                  data-a-yours
                  className="flex items-baseline gap-5 border-t border-ep-line py-7 last:border-b last:border-ep-line sm:gap-7"
                >
                  <span className="t-label shrink-0 text-ep-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {/* `text-balance` statt fester Umbrüche: „Uns Ihr Haus
                      zeigen" brach sonst nach dem vorletzten Wort um und ließ
                      ein einzelnes „zeigen" auf der zweiten Zeile stehen.
                      Der Browser verteilt jetzt gleichmäßig – und weil die
                      Spalte inzwischen breit genug ist, bleibt es meist
                      ohnehin einzeilig. */}
                  <span className="text-balance text-[clamp(1.5rem,2.8vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.025em] text-ep-ink">
                    {task}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Unsere Aufgabe – die Länge ist das Argument, deshalb ab lg
              einspaltig: acht Zeilen untereinander wirken lang, acht in
              zwei Spalten wirken nach nichts. */}
          <div className="border-t border-ep-line pt-10 lg:border-l lg:border-t-0 lg:pl-20 lg:pt-0">
            <h3 className="t-label text-ep-navy">Unsere Aufgabe</h3>
            {/* Deutlich größer als vorher (16 px). Acht Einträge in Lesegröße
                wirkten wie eine Fußnote – dabei IST ihre Länge das Argument
                der Sektion. Groß gesetzt wird die Liste hoch genug, dass man
                sie scrollen muss: Man erlebt die acht Aufgaben, statt sie
                nur gezählt zu bekommen. Und die Sektion bekommt endlich
                dieselbe Größenordnung wie ihre Nachbarn. */}
            <ul className="mt-6 flex flex-col">
              {OURS.map((task) => (
                <li
                  key={task}
                  data-a-ours
                  className="flex items-baseline gap-5 border-b border-ep-line py-6 last:border-b-0 sm:py-7"
                >
                  <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-ep-navy/10 text-ep-navy sm:size-7">
                    <Check className="size-3.5 sm:size-4" strokeWidth={3} aria-hidden="true" />
                  </span>
                  <span className="text-[clamp(1.125rem,1.7vw,1.625rem)] leading-snug text-ep-ink/75">
                    {task}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* HIER STAND DER VERMITTLERHINWEIS – bewusst entfernt (07.08.).
            Geprüft: Er war für energiepartner.info nie vorgesehen. Im
            Markenhandbuch (`docs/markenhandbuch-quelle/ci.html`) steht er
            genau einmal, nämlich im Block „So arbeiten wir – ganz
            transparent" auf angebote-vergleichen.info. Beide Vorkommen hier
            waren unsere Zutat.

            Und an dieser Stelle kostete er: Direkt nach „Sie entscheiden.
            Wir machen den Rest." stellt er dem Leser eine Frage, die er
            nicht gestellt hatte, und lenkt ihn mitten im Argument auf die
            Provision. Offenlegen muss man sie trotzdem – das passiert im
            Footer, am Ende und in Fußnotengröße, wo sie niemanden aus dem
            Lesefluss holt. Auf angebote-vergleichen.info bleibt sie im
            Fließtext stehen: Dort ist sie freigegebener Kundentext. */}
      </div>
    </section>
  );
}
