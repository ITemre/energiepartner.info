"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { SITE } from "@/lib/site";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { useAnfrage } from "@/components/anfrage/AnfrageProvider";
import { maskedHeadline, revealItems } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * Die Mindestangaben aus dem Markenhandbuch – wörtlich.
 *
 * Sie stehen hier und nicht in der Prüf-Sektion, weil sie erst jetzt
 * nützlich sind: Direkt vor der Handlung beantworten sie die letzte Frage
 * („was muss ich überhaupt schicken?"), weiter oben wären sie eine Hürde
 * vor einer Entscheidung, die noch gar nicht gefallen ist.
 */
const MINDESTANGABEN = [
  "Leistung (kW) und Modell",
  "Gesamtpreis inkl. MwSt.",
  "Einzelpositionen und Zubehör",
  "Förderung / KfW-Angaben",
] as const;

/**
 * Der Abschluss.
 *
 * Headline und Einleitung wörtlich aus `docs/markenhandbuch-quelle/ci.html`.
 *
 * Zwei Wege nebeneinander, und zwar in dieser Reihenfolge: WhatsApp trägt
 * die Fläche, das Formular steht daneben. Das ist die Kanalentscheidung aus
 * dem Kickoff – WhatsApp ist der Hauptkanal, das Formular der zweite Weg für
 * alle, die ihre Nummer nicht sofort herausgeben wollen.
 */
export function AvAbschluss() {
  const scope = useRef<HTMLElement>(null);
  const { oeffne } = useAnfrage();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        revealItems("[data-abs-block]", { distance: 22, start: "top 90%" });

        return maskedHeadline({
          headline: "[data-abs-h2]",
          scrollTrigger: { trigger: scope.current, start: "top 80%", once: true },
        });
      });
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      id="kontakt"
      data-nav-theme="dark"
      className="relative scroll-mt-[var(--nav-h)] overflow-hidden bg-ep-navy text-white"
    >
      <div
        aria-hidden="true"
        className="ep-skala pointer-events-none absolute inset-0"
      />

      <div className="ep-container relative py-24 sm:py-32">
        <h2 data-abs-h2 className="t-h2 max-w-[20ch]">
          Bestehendes Angebot prüfen.{" "}
          <span className="text-ep-sun">
            Schwachstellen erkennen. Bessere Lösung erhalten.
          </span>
        </h2>

        <p data-abs-block className="t-lead mt-8 max-w-[58ch] text-white/80">
          Wir analysieren Preis, Technik, Förderung und Leistungsumfang.
          Anschließend erhalten Sie eine verständliche Einschätzung und auf
          Wunsch ein passendes Empfehlungsangebot.
        </p>

        <div
          data-abs-block
          className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
        >
          <WhatsAppButton
            href={SITE.whatsapp.angebotHref}
            size="lg"
            label="Angebot kostenlos prüfen lassen"
            className="w-full justify-center sm:w-auto"
          />
          <button
            type="button"
            onClick={() => oeffne("AV-Abschluss · Formular")}
            className="inline-flex w-full items-center justify-center gap-2 rounded-ep border border-white/30 px-6 py-4 text-base font-semibold text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-ep-sun sm:w-auto"
          >
            Angebot über das Formular schicken
          </button>
        </div>

        {/* ===== Was das Angebot enthalten muss ===== */}
        <div
          data-abs-block
          className="mt-20 border-t border-ep-line-dark pt-12 sm:mt-28"
        >
          <p className="t-label text-ep-sun">Das muss Ihr Angebot enthalten</p>
          <p className="mt-6 max-w-[58ch] leading-relaxed text-white/75">
            Damit wir seriös prüfen können, brauchen wir diese Mindestangaben.
            So wissen Sie von Anfang an, was gebraucht wird, kein Hin und Her.
          </p>

          <ul className="mt-10 grid border-t border-ep-line-dark sm:grid-cols-2 lg:grid-cols-4">
            {MINDESTANGABEN.map((angabe, i) => (
              <li
                key={angabe}
                className={[
                  "flex items-baseline gap-4 border-b border-ep-line-dark py-5 pr-5",
                  /* Senkrechte Trenner nur INNEN – die äußeren Kanten macht
                     der Seitenrand. Zwei Regeln, die sich ergänzen statt
                     sich zu widersprechen:
                       ab sm (2 Spalten) trennt jede zweite Kachel,
                       ab lg (4 Spalten) zusätzlich alle außer der ersten.
                     Kachel 2 bekommt ihren Strich damit erst ab lg – vorher
                     steht sie in Spalte 1 und hätte dort einen Trenner am
                     Seitenrand. */
                  i % 2 === 1 ? "sm:border-l sm:border-ep-line-dark sm:pl-6" : "",
                  i > 0 ? "lg:border-l lg:border-ep-line-dark lg:pl-6" : "",
                ].join(" ")}
              >
                <span className="t-key shrink-0 text-ep-sun">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[15px] leading-snug text-white/85">
                  {angabe}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
