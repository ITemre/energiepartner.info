"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ArrowRight } from "lucide-react";
import { Marker } from "@/components/ui/Marker";
import { AV_URL } from "@/lib/site";
import { maskedHeadline, revealItems } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * „Sie haben schon ein Angebot?" – die Brücke zur Prüfstrecke.
 *
 * WARUM SIE HIER STEHT UND TROTZDEM KURZ BLEIBT. Die Vollständigkeitsprüfung
 * ist das Verkaufsargument, das der Kunde selbst am häufigsten vorbringt.
 * Sie hat eine eigene Domain, weil sie eine eigene Zielgruppe hat: jemanden,
 * der schon mitten in einer Entscheidung steckt. Dieser Besucher kommt aber
 * auch hier vorbei – und fand bislang keinen einzigen Hinweis darauf, dass
 * wir genau das anbieten.
 *
 * Die Sektion ist deshalb bewusst ein BAND und kein zweiter Longread: Sie
 * erzählt die Geschichte nicht, sie zeigt, dass es sie gibt, und gibt eine
 * Tür. Würde die Prüf-Story hier vollständig stehen, hätten beide Domains
 * dieselbe Aufgabe – und die Trennung, die im Briefing (Abschnitt 3)
 * festgehalten ist, wäre aufgehoben.
 *
 * Die beiden Beispiele sind die vom Kunden vorgegebenen Textbausteine und
 * stehen wörtlich so da. Sie sind der Beweis in dieser Sektion: „wir prüfen
 * auf Vollständigkeit" ist eine Behauptung, zwei konkrete fehlende Posten
 * sind eine Erfahrung, die der Leser sofort einordnen kann.
 */
const BEISPIELE = [
  "Reinigung der Rohre nicht enthalten",
  "Steigleitung nicht enthalten",
] as const;

export function Zweitmeinung() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        revealItems("[data-zm-block]", { distance: 22, start: "top 90%" });

        return maskedHeadline({
          headline: "[data-zm-h2]",
          follow: "[data-zm-eyebrow]",
          scrollTrigger: { trigger: scope.current, start: "top 80%", once: true },
        });
      });
    },
    { scope },
  );

  return (
    <section ref={scope} data-nav-theme="light" className="bg-ep-paper">
      <div className="ep-container py-24 sm:py-32">
        <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12">
          <div className="lg:col-span-6">
            <p data-zm-eyebrow className="t-label text-ep-orange-deep">
              Sie haben schon ein Angebot?
            </p>
            <h2 data-zm-h2 className="t-h2 mt-6 max-w-[15ch] text-ep-ink">
              Dann sehen wir es uns an,{" "}
              <span className="text-ep-navy">
                bevor Sie <Marker>unterschreiben</Marker>.
              </span>
            </h2>
          </div>

          <div className="mt-10 lg:col-span-5 lg:col-start-8 lg:mt-0">
            <p data-zm-block className="t-lead max-w-[48ch] text-ep-ink/75">
              Wir vergleichen es nicht mit einem billigeren Angebot. Wir lesen
              es Position für Position und sagen Ihnen, was darin fehlt. Zwei
              Sätze, die wir dabei immer wieder schreiben:
            </p>

            {/* Die Beispiele als Befund-Zeilen: Orange markiert auf beiden
                Auftritten dasselbe – eine Lücke, nicht einen Preis. */}
            <ul data-zm-block className="mt-8 flex flex-col gap-3">
              {BEISPIELE.map((beispiel) => (
                <li
                  key={beispiel}
                  className="border-l-2 border-ep-orange-deep pl-4 text-lg font-medium text-ep-ink"
                >
                  „{beispiel}&ldquo;
                </li>
              ))}
            </ul>

            {/* Externer Auftritt, deshalb ein <a> und kein <Link>: Sobald
                `NEXT_PUBLIC_AV_URL` gesetzt ist, führt der Verweis auf eine
                andere Domain, und der Client-Router von Next hätte dort
                nichts zu suchen. Lokal zeigt er auf `/av`. */}
            <a
              data-zm-block
              href={AV_URL}
              className="group mt-10 inline-flex items-center gap-3 rounded-ep bg-ep-navy px-6 py-4 text-base font-semibold text-white outline-none transition-colors hover:bg-ep-navy-deep focus-visible:ring-2 focus-visible:ring-ep-orange focus-visible:ring-offset-2"
            >
              Angebot kostenlos prüfen lassen
              <ArrowRight
                className="size-5 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </a>

            <p data-zm-block className="mt-4 text-sm text-ep-ink/60">
              Kostenlos, Rückmeldung innerhalb von 24 Stunden, keine
              Verpflichtung zur Annahme einer Empfehlung.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
