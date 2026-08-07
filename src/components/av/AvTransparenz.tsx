"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { maskedHeadline, revealItems } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/** Die drei Zusagen, wörtlich aus dem Markenhandbuch. */
const ZUSAGEN = [
  "Kostenlose Einschätzung",
  "Anbieterübergreifend geprüft",
  "Keine Annahmepflicht",
] as const;

/**
 * „So arbeiten wir, ganz transparent."
 *
 * Der Absatz ist wörtlich aus `docs/markenhandbuch-quelle/ci.html` und
 * enthält den Vermittlerhinweis im Fließtext – an der Stelle, an der er
 * gebraucht wird, nicht im Impressum.
 *
 * Das ist die inhaltlich heikelste Sektion der Seite und deshalb die, an der
 * am wenigsten formuliert werden darf. Der Kunde prüft ein fremdes Angebot
 * und bietet danach ein eigenes an. Wer das offen sagt, wirkt souverän; wer
 * es andeutet, wirkt ertappt.
 *
 * NICHT übernommen ist die Zeile „Formulierung als Grundlage – die
 * rechtliche Endfassung wird vor Veröffentlichung fachanwaltlich geprüft".
 * Das ist eine Notiz im Handbuch an uns, keine Website-Copy. Der Vorbehalt
 * selbst bleibt bestehen: Vor dem Livegang muss dieser Absatz anwaltlich
 * abgenommen werden (siehe Projekt-Briefing, Abschnitt 9).
 */
export function AvTransparenz() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        revealItems("[data-t-block]", { distance: 20, start: "top 90%" });

        return maskedHeadline({
          headline: "[data-t-h2]",
          follow: "[data-t-eyebrow]",
          scrollTrigger: { trigger: scope.current, start: "top 80%", once: true },
        });
      });
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      data-nav-theme="dark"
      className="relative overflow-hidden bg-ep-navy-deep text-white"
    >
      <div
        aria-hidden="true"
        className="ep-skala pointer-events-none absolute inset-0"
      />

      <div className="ep-container relative py-24 sm:py-32">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-5">
            <p data-t-eyebrow className="t-label text-ep-sun">
              Volle Transparenz
            </p>
            <h2 data-t-h2 className="t-h2 mt-6 max-w-[14ch]">
              So arbeiten wir,{" "}
              <span className="text-ep-sun">ganz transparent.</span>
            </h2>
          </div>

          <div className="mt-10 lg:col-span-6 lg:col-start-7 lg:mt-0">
            <p
              data-t-block
              className="t-lead max-w-[62ch] text-white/80"
            >
              Wir prüfen Ihr bestehendes Angebot anhand einheitlicher Kriterien.
              Die Einschätzung ist für Sie kostenlos und unverbindlich. Wenn wir
              eine passendere oder vollständigere Lösung empfehlen können,
              bieten wir Ihnen auf Wunsch ein alternatives Angebot über einen
              unserer Fachpartner an. Bei erfolgreicher Vermittlung können wir
              eine Vergütung vom ausführenden Unternehmen erhalten. Ihre
              Entscheidung bleibt davon unberührt.
            </p>

            <ul
              data-t-block
              className="mt-10 flex flex-col border-t border-ep-line-dark"
            >
              {ZUSAGEN.map((zusage, i) => (
                <li
                  key={zusage}
                  className="flex items-baseline gap-5 border-b border-ep-line-dark py-4"
                >
                  <span className="t-key shrink-0 text-ep-sun">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-lg font-semibold">{zusage}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
