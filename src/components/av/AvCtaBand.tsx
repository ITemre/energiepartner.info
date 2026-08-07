"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { AvUploadKnopf } from "@/components/av/AvUpload";
import { revealItems } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Das CTA-Band zwischen den Sektionen.
 *
 * ═══ WARUM NACH JEDER SEKTION UND NICHT NUR AM ENDE ═══
 * Jede Sektion dieser Seite räumt einen anderen Einwand aus – die
 * Beispielrechnung den Zweifel am Nutzen, die Prüfliste den an der
 * Kompetenz, der Ablauf den an der Verbindlichkeit. Wer nach der zweiten
 * überzeugt ist, soll nicht bis ans Ende scrollen müssen, um das zu tun,
 * wozu er gerade bereit ist.
 *
 * Auf einer Leadstrecke ist der Weg zur Handlung die eigentliche
 * Konversionsgröße. Ein einziger CTA am Seitenende setzt voraus, dass alle
 * denselben Weg brauchen – tatsächlich springt jeder an einer anderen
 * Stelle ab oder eben zu.
 *
 * ═══ DIE ZEILE ÜBER DEM KNOPF WECHSELT ═══
 * Sie greift auf, was gerade gelesen wurde. Ein viermal identisches Band
 * liest sich als Wiederholung und wird ab dem zweiten Mal übersprungen;
 * eines, das an den Inhalt darüber anschließt, liest sich als Schluss der
 * Sektion.
 */
export function AvCtaBand({
  zeile,
  /** Dunkles Band auf hellem Grund oder umgekehrt – wechselt mit dem
   *  Rhythmus der Seite. */
  ton = "dunkel",
  className,
}: {
  zeile: string;
  ton?: "dunkel" | "hell";
  className?: string;
}) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        revealItems("[data-cta-teil]", { distance: 18, start: "top 92%" });
      });
    },
    { scope },
  );

  const dunkel = ton === "dunkel";

  return (
    <section
      ref={scope}
      data-nav-theme={dunkel ? "dark" : "light"}
      className={cn(
        "relative overflow-hidden",
        dunkel ? "bg-ep-navy text-white" : "border-y border-ep-line bg-ep-sand/50 text-ep-ink",
        className,
      )}
    >
      {dunkel && (
        <div
          aria-hidden="true"
          className="ep-skala pointer-events-none absolute inset-0"
        />
      )}

      <div className="ep-container relative py-14 sm:py-20">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <p
            data-cta-teil
            className={cn(
              "max-w-[24ch] text-[clamp(1.375rem,2.8vw,2.25rem)] font-bold leading-[1.1] tracking-[-0.025em]",
              dunkel ? "text-white" : "text-ep-ink",
            )}
          >
            {zeile}
          </p>

          <div data-cta-teil className="shrink-0">
            <AvUploadKnopf className="w-full sm:w-auto" />
            <p
              className={cn(
                "mt-3 text-sm",
                dunkel ? "text-white/60" : "text-ep-ink/60",
              )}
            >
              PDF oder Foto · Antwort in 24 Stunden
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
