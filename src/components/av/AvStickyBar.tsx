"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUpload } from "@/components/av/AvUpload";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Die mitlaufende Leiste am unteren Rand – nur auf dem Handy.
 *
 * WARUM SIE DER STÄRKSTE EINZELNE HEBEL IST * Sobald der Hero aus dem Bild ist, gibt es auf einem Telefon keinen Weg
 * mehr zur Handlung außer Scrollen – nach oben zurück oder bis zum nächsten
 * CTA-Band hinunter. Beides sind Sekunden, in denen jemand aufhören kann.
 * Eine Leiste, die immer da ist, macht den Weg zur Handlung konstant kurz,
 * egal wo man gerade liest.
 *
 * WARUM NUR MOBIL * Auf dem Desktop steht die Ablagefläche im Hero, die CTA-Bänder liegen im
 * Blickfeld, und der Mauszeiger erreicht jede Stelle der Seite in einer
 * Bewegung. Eine fixierte Leiste wäre dort ein Balken, der Inhalt verdeckt,
 * ohne einen Weg zu verkürzen.
 *
 * WARUM SIE ERST NACH DEM HERO ERSCHEINT * Solange der Hero im Bild ist, steht der Auslöser ohnehin da. Zwei
 * identische Knöpfe gleichzeitig sehen nicht nach Angebot aus, sondern nach
 * Drängeln – und verdecken zusätzlich die Vertrauenszeile, die genau dort
 * ihre Arbeit tut.
 */
export function AvStickyBar() {
  const { oeffneDateiauswahl } = useUpload();
  const leiste = useRef<HTMLDivElement>(null);
  const [sichtbar, setSichtbar] = useState(false);

  useEffect(() => {
    /* Bezug ist der Hero: Die Leiste erscheint, sobald er nach oben aus dem
       Bild gelaufen ist. `[data-nav-theme]` reicht dafür nicht, das tragen
       alle Bänder – deshalb die eigene Kennung am Hero.

       NICHT über die Stellung im Baum („erste Sektion in `<main>`"). So
       stand es hier, und es brach in dem Moment, in dem Hero und
       Beispielrechnung einen gemeinsamen Grund-Wrapper bekamen: Der Selektor
       fand danach das erste CTA-Band und die Leiste erschien viel zu spät.
       Eine Kennung überlebt Umbauten am Markup, eine Position nicht. */
    const hero = document.querySelector("[data-av-hero]");
    if (!hero) return;

    const trigger = ScrollTrigger.create({
      trigger: hero,
      start: "bottom top+=80",
      onToggle: (self) => setSichtbar(self.isActive || self.progress > 0),
      onLeaveBack: () => setSichtbar(false),
    });

    return () => trigger.kill();
  }, []);

  useEffect(() => {
    const el = leiste.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.to(el, {
      yPercent: sichtbar ? 0 : 120,
      autoAlpha: sichtbar ? 1 : 0,
      duration: 0.4,
      ease: sichtbar ? "power3.out" : "power2.in",
    });
  }, [sichtbar]);

  return (
    <div
      ref={leiste}
      /* `pb-[env(safe-area-inset-bottom)]`: Auf iPhones mit Gestenleiste
         läge der Knopf sonst unter dem Balken, den das System dort
         einblendet – erreichbar, aber nur mit einem zweiten Versuch. */
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 translate-y-full opacity-0 lg:hidden",
        "border-t border-ep-line-dark bg-ep-navy-deep/95 backdrop-blur-md",
        "pb-[env(safe-area-inset-bottom)]",
      )}
      /* Solange sie unten steht, darf sie keine Klicks abfangen und für
         Vorlesesoftware nicht existieren. */
      aria-hidden={!sichtbar}
      style={{ pointerEvents: sichtbar ? "auto" : "none" }}
    >
      <div className="ep-container flex items-center gap-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold text-white">
            Angebot prüfen lassen
          </p>
          <p className="truncate text-[12px] text-white/60">
            Kostenlos · Antwort in 24 Std.
          </p>
        </div>

        <button
          type="button"
          onClick={oeffneDateiauswahl}
          tabIndex={sichtbar ? 0 : -1}
          className="inline-flex shrink-0 items-center gap-2 rounded-ep bg-ep-accent-strong px-5 py-3 text-[15px] font-bold text-white outline-none transition-colors hover:bg-[#d95c17] focus-visible:ring-2 focus-visible:ring-ep-accent-strong"
        >
          <Upload className="size-4 shrink-0" aria-hidden="true" />
          Hochladen
        </button>
      </div>
    </div>
  );
}
