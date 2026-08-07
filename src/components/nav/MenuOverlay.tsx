"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, Phone } from "lucide-react";
import { NAV_ITEMS, SITE } from "@/lib/site";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { GlowDot } from "@/components/ui/GlowDot";

/** Ursprung des Kreis-Reveals = Position des Menübuttons (oben rechts) */
const ORIGIN = "calc(100% - 44px) 44px";

export function MenuOverlay({ onClose }: { onClose: () => void }) {
  const reduce = useReducedMotion();
  const scope = useRef<HTMLDivElement>(null);

  // Esc + Fokus-Falle, solange das Overlay lebt.
  // (Scroll-Lock inkl. Scrollbar-Kompensation liegt im SiteHeader.)
  useEffect(() => {
    // Fokus in das Overlay legen
    const firstLink = scope.current?.querySelector<HTMLElement>("[data-nav-focusable]");
    firstLink?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      // Fokus zwischen allen markierten Elementen (inkl. Header-Toggle) halten
      const focusables = Array.from(
        document.querySelectorAll<HTMLElement>("[data-nav-focusable]"),
      ).filter((el) => el.offsetParent !== null);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  // GSAP: ambienter, endlos driftender Sonnen-Orb (nur wenn Motion erlaubt)
  useGSAP(
    () => {
      if (reduce) return;
      gsap.to("[data-orb]", {
        xPercent: 12,
        yPercent: -10,
        duration: 9,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    },
    { scope, dependencies: [reduce] },
  );

  // Auf und Zu sind exakte Spiegel: gleicher Kreis-Sog, gleiche Dauer,
  // gleiche Kurve – nur die Richtung dreht sich.
  const EASE = [0.4, 0, 0.2, 1] as const;

  const panel: Variants = {
    closed: {
      clipPath: reduce ? "inset(0%)" : `circle(0% at ${ORIGIN})`,
      opacity: reduce ? 0 : 1,
      transition: { duration: 0.45, ease: EASE },
    },
    open: {
      clipPath: reduce ? "inset(0%)" : `circle(150% at ${ORIGIN})`,
      opacity: 1,
      transition: { duration: 0.45, ease: EASE },
    },
  };

  const list: Variants = {
    closed: {},
    open: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
  };

  const item: Variants = {
    closed: {
      opacity: 0,
      y: reduce ? 0 : 34,
      transition: { duration: 0.2, ease: EASE },
    },
    open: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
  };

  const fade: Variants = {
    closed: {
      opacity: 0,
      y: reduce ? 0 : 20,
      transition: { duration: 0.2, ease: EASE },
    },
    open: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE, delay: 0.18 } },
  };

  return (
    <motion.div
      ref={scope}
      id="nav-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Hauptnavigation"
      variants={panel}
      initial="closed"
      animate="open"
      exit="closed"
      className="fixed inset-0 z-40 overflow-hidden bg-ep-navy-deep text-white"
    >
      {/* Grund: radialer Navy-Verlauf wie CI-Cover */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 130% at 82% 8%, #1C6FB0 0%, #0E3552 48%, #0A2337 100%)",
        }}
      />
      {/* feine vertikale Rasterlinien */}
      <div
        className="absolute inset-0 -z-10 opacity-40"
        style={{
          background:
            "repeating-linear-gradient(90deg, rgba(255,255,255,.05) 0 1px, transparent 1px 96px)",
        }}
      />
      {/* driftender Sonnen-Orb */}
      <div
        data-orb
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 -z-10 size-[420px] rounded-full blur-[2px]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, #FBB23F 0%, #F26A21 55%, rgba(242,106,33,0) 72%)",
        }}
      />

      <div className="ep-container flex h-full flex-col justify-center pb-10 pt-28">
        {/* Einspaltig, mittig – seit das Porträt raus ist (siehe unten). */}
        <nav aria-label="Hauptnavigation">
          <motion.p
            variants={fade}
            className="t-label mb-6 text-ep-sun"
          >
            Menü · Ihr Energiepartner
          </motion.p>

          <motion.ul variants={list} className="flex flex-col gap-1">
            {NAV_ITEMS.map((navItem, i) => (
              <motion.li key={navItem.href} variants={item}>
                <Link
                  href={navItem.href}
                  onClick={onClose}
                  data-nav-focusable
                  className="group flex items-baseline gap-4 rounded-ep py-2 outline-none focus-visible:ring-2 focus-visible:ring-ep-sun sm:gap-6"
                >
                  <span className="t-label text-white/80 transition-colors group-hover:text-ep-sun">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="t-h2 relative text-white/90 transition-colors duration-300 group-hover:text-white">
                    {navItem.label}
                    {/* Derselbe Leucht-Punkt wie in der Desktop-Leiste –
                        dort unter dem Wort, hier daneben. Ein flacher Kreis
                        stand hier vorher; die Marke leuchtet aber, und das
                        soll auf beiden Geräten dasselbe Zeichen sein. */}
                    <span className="ml-3 inline-block -translate-y-[0.15em] scale-0 align-middle opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                      <GlowDot className="size-2" />
                    </span>
                  </span>
                  <ArrowUpRight
                    className="size-6 -translate-x-2 self-center text-ep-sun opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </Link>
              </motion.li>
            ))}
          </motion.ul>

          {/* Kontakt-Aktionen */}
          <motion.div variants={fade} className="mt-10 flex flex-wrap items-center gap-4">
            <WhatsAppButton size="lg" data-nav-focusable />
            <a
              href={SITE.phone.href}
              data-nav-focusable
              className="inline-flex items-center gap-2 rounded-ep border border-white/25 px-5 py-4 text-base font-semibold text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-ep-sun"
            >
              <Phone className="size-5" aria-hidden="true" />
              {SITE.phone.display}
            </a>
          </motion.div>
        </nav>

        {/* ⚠️ HIER STAND EIN PORTRÄT IN DER RECHTEN SPALTE – entfernt
            (07.08.), aus zwei Gründen.

            Erstens war es kaputt: Die Datei `/Foto_Ilias.jpg` liegt nicht
            in `public/`. Das Overlay zeigte am Desktop eine leere Fläche
            mit Bildunterschrift.

            Zweitens hätte es auch mit Datei nicht hierher gedurft. Das
            Kickoff verlangt, dass Ilias' Porträt GENAU EINMAL erscheint,
            damit kein One-Man-Show-Eindruck entsteht – und diesen einen
            Auftritt hat es am Ende der Bildstrecke
            (`Galerie.tsx`, `g6-ilias-frei.webp`). Ein zweites Mal im Menü,
            also auf jeder Seite jederzeit abrufbar, ist genau das
            Gegenteil.

            Das Menü läuft dadurch einspaltig. Das ist kein Verlust: Eine
            Navigation ist eine Liste von Wegen, kein Schaufenster. */}
      </div>
    </motion.div>
  );
}
