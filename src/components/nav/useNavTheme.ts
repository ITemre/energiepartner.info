"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Die Kopfleiste liegt ohne eigene Fläche auf dem Inhalt, und der Inhalt
 * wechselt bandweise zwischen Navy und Papier. Welche Farbe Wortmarke und
 * Links tragen müssen, kann die Leiste deshalb nicht aus ihrer Scrollposition
 * ableiten – nur das Band unter ihr weiß es.
 *
 * Jede Sektion meldet über `data-nav-theme="dark|light"`, worauf die Leiste
 * dort liegt. Ein ScrollTrigger je Band schaltet um, sobald es die
 * MITTELLINIE der Leiste erreicht – nicht deren Oberkante: Dort stehen
 * Wortmarke und Links, dort muss der Kontrast stimmen.
 *
 * ⚠️ Neue Sektion = `data-nav-theme` nicht vergessen. Ohne das Attribut
 * behält die Leiste den Zustand des vorherigen Bandes bei, und über einem
 * hellen Band steht dann weiße Schrift auf Papier.
 *
 * Beide Auftritte (energiepartner.info und angebote-vergleichen.info) haben
 * eigene Kopfleisten, aber dasselbe Problem – deshalb liegt die Logik hier
 * und nicht in einer der beiden Komponenten.
 */
export function useNavTheme() {
  /** Liegt die Leiste gerade auf dunklem Grund? Startwert: ja, beide
   *  Auftritte beginnen mit einem Navy-Hero. */
  const [onDark, setOnDark] = useState(true);
  /** Schon gescrollt? Steuert, ob die Leiste eine Fläche bekommt. */
  const [lifted, setLifted] = useState(false);

  useEffect(() => {
    // Als Funktion, weil --nav-h am sm-Breakpoint wechselt und bei jedem
    // Refresh neu gelesen werden muss.
    const midline = () => {
      const raw = getComputedStyle(document.documentElement).getPropertyValue(
        "--nav-h",
      );
      return (parseFloat(raw) || 60) / 2;
    };

    const triggers = gsap.utils
      .toArray<HTMLElement>("[data-nav-theme]")
      .map((section) =>
        ScrollTrigger.create({
          trigger: section,
          start: () => `top top+=${midline()}`,
          end: () => `bottom top+=${midline()}`,
          invalidateOnRefresh: true,
          onToggle: (self) => {
            // Beim Bandwechsel feuern zwei Trigger (Austritt und Eintritt).
            // Nur der eintretende ist aktiv – der austretende würde sonst
            // kurz die falsche Farbe setzen.
            if (self.isActive) {
              setOnDark(section.dataset.navTheme === "dark");
            }
          },
        }),
      );

    // Die Fläche schaltet kurz nach dem Start – früh genug, dass nie etwas
    // ungetönt durchläuft, spät genug, dass ein Mikro-Scroll sie nicht
    // auslöst.
    const surface = ScrollTrigger.create({
      start: 40,
      onToggle: (self) => setLifted(self.isActive),
    });

    return () => {
      triggers.forEach((trigger) => trigger.kill());
      surface.kill();
    };
  }, []);

  return { onDark, lifted };
}
