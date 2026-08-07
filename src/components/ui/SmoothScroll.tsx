"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Lenis + GSAP ScrollTrigger, sauber verheiratet: Lenis fährt den Scroll,
 * GSAP-Ticker treibt Lenis, ScrollTrigger hört auf Lenis.
 * Bei prefers-reduced-motion bleibt nativer Scroll.
 *
 * ⚠️ DIE NEUVERMESSUNG IST DER WICHTIGE TEIL — sie hat gefehlt, und der
 * Seitenfuß war deshalb nicht erreichbar.
 *
 * Lenis merkt sich die Scrollstrecke einmal und aktualisiert sie von sich aus
 * nur bei einer Größenänderung des Fensters. Diese Seite ändert ihre Höhe
 * aber ohne Größenänderung, und zwar erheblich: Gesamtsystem und Galerie sind
 * gepinnt, und ScrollTrigger legt deren Pin-Spacer erst beim Refresh nach
 * `document.fonts.ready` an (siehe MotionRoot). Die Dokumenthöhe wächst dabei
 * um mehrere Bildschirme — Lenis' Grenze blieb auf dem alten, kürzeren Wert.
 *
 * Folge: Man scrollt bis zum Anschlag und kommt trotzdem nicht unten an. Der
 * Footer mit Impressum und Datenschutz lag hinter dieser falschen Grenze und
 * war nicht anklickbar. Deshalb hängt `lenis.resize()` jetzt an jedem
 * ScrollTrigger-Refresh.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({ lerp: 0.12, anchors: true });
    lenis.on("scroll", ScrollTrigger.update);
    // Debug-Hook (erlaubt präzises Springen bei der Browser-Verifikation und
    // den Abgleich `__lenis.limit + innerHeight === scrollHeight`)
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    // Nach JEDEM Refresh neu vermessen – nicht nur nach dem ersten. Pins
    // werden auch bei Breakpoint-Wechseln und `invalidateOnRefresh` neu
    // aufgebaut, und jedes Mal ändert sich die Gesamthöhe.
    const messeNeu = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", messeNeu);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      ScrollTrigger.removeEventListener("refresh", messeNeu);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
