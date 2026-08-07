"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { SITE, NAV_ITEMS } from "@/lib/site";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { GlowDot } from "@/components/ui/GlowDot";
import { MenuToggle } from "./MenuToggle";
import { MenuOverlay } from "./MenuOverlay";
import { useNavTheme } from "./useNavTheme";

// Intrinsische Maße nur für Next/Image (Seitenverhältnis) – die tatsächliche
// Anzeigegröße kommt responsiv über Tailwind-Klassen (mobil kleiner).
const LOGO_H = 46;
const LOGO_W = Math.round(LOGO_H * SITE.logo.ratio);

/**
 * Kopfleiste.
 *
 * SIE HAT JETZT EINE FLÄCHE – und das ist der wichtigste Fix an ihr.
 * Vorher lag sie randlos und ohne Hintergrund direkt auf dem Inhalt. Beim
 * Scrollen lief die Navigation dadurch mitten durch Überschriften, die
 * Wortmarke stand auf „Ihre Energie", der Hamburger klebte auf Satzenden –
 * und zwar in JEDER Sektion, nicht nur einmal. Der Theme-Wechsel über
 * `data-nav-theme` hat nur die Farbfrage gelöst, nicht die Kollision.
 *
 * Die Fläche erscheint erst nach dem ersten Scroll: Im Hero soll die Leiste
 * schweben (dort steht nichts unter ihr, was kollidieren könnte, und eine
 * Fläche würde den Auftakt zerschneiden). Sobald Inhalt darunter durchläuft,
 * legt sie sich als getönte Scheibe darüber. Zwei Zustände, ein Übergang.
 *
 * Das Band darunter meldet über `data-nav-theme`, ob die Leiste gerade auf
 * Navy oder auf Papier liegt; ein ScrollTrigger je Band schaltet um, sobald
 * es die Mittellinie der Leiste erreicht. Getönt wird passend dazu.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  /* Welches Band liegt unter der Leiste, und wurde schon gescrollt?
     Beide Auftritte brauchen dieselbe Antwort – die Logik steht deshalb in
     `useNavTheme` und nicht zweimal in zwei Kopfleisten. */
  const { onDark, lifted } = useNavTheme();

  // Scroll-Lock mit Scrollbar-Kompensation: body UND die fixe Leiste bekommen
  // exakt die Scrollbar-Breite als padding-right -> kein Sprung, kein weißer
  // Reststreifen, geräteunabhängig (auch bei Overlay-Scrollbars).
  useEffect(() => {
    if (!open) return;
    const body = document.body;
    const header = headerRef.current;
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    const prev = {
      overflow: body.style.overflow,
      bodyPad: body.style.paddingRight,
      headPad: header?.style.paddingRight ?? "",
    };
    body.style.overflow = "hidden";
    if (sbw > 0) {
      body.style.paddingRight = `${sbw}px`;
      if (header) header.style.paddingRight = `${sbw}px`;
    }
    return () => {
      body.style.overflow = prev.overflow;
      body.style.paddingRight = prev.bodyPad;
      if (header) header.style.paddingRight = prev.headPad;
    };
  }, [open]);

  // Über dunklem Grund oder bei offenem Overlay: weiße Marke und Links.
  const light = open || onDark;

  function close() {
    setOpen(false);
    // Fokus zurück auf den Auslöser (A11y)
    requestAnimationFrame(() => toggleRef.current?.focus());
  }

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
          // Tönung UND Unschärfe, plus eine Haarlinie als Kante.
          // `backdrop-blur` allein reicht nicht: Über einer ruhigen Fläche
          // verschwimmt nichts Sichtbares, der Text darunter bliebe lesbar
          // und würde weiter mit der Navigation kollidieren.
          lifted && !open
            ? onDark
              ? "border-b border-ep-line-dark bg-ep-navy-deep/80 backdrop-blur-md"
              : "border-b border-ep-line bg-ep-paper/85 backdrop-blur-md"
            : "border-b border-transparent",
        )}
      >
        {/* Dieselbe Kante wie die Sektionen (.ep-container), damit die
            Wortmarke exakt über deren Inhalt steht und nicht daneben. */}
        <div className="ep-container relative flex h-[var(--nav-h)] items-center justify-between gap-4 sm:gap-6">
          {/* Logo (Crossfade weiß ↔ dunkel) */}
          <Link
            href="/"
            aria-label="energiepartner – Startseite"
            className="relative block h-[28px] w-[140px] shrink-0 rounded outline-none focus-visible:ring-2 focus-visible:ring-ep-sun sm:h-[42px] sm:w-[210px]"
          >
            <Image
              src={SITE.logo.negativ}
              alt="energiepartner"
              width={LOGO_W}
              height={LOGO_H}
              priority
              unoptimized
              className={cn(
                "absolute inset-0 h-full w-full object-contain transition-opacity duration-300",
                light ? "opacity-100" : "opacity-0",
              )}
            />
            <Image
              src={SITE.logo.positiv}
              alt=""
              aria-hidden="true"
              width={LOGO_W}
              height={LOGO_H}
              unoptimized
              className={cn(
                "absolute inset-0 h-full w-full object-contain transition-opacity duration-300",
                light ? "opacity-0" : "opacity-100",
              )}
            />
          </Link>

          {/* Sprungmarken, ab lg optisch mittig. Absolut gesetzt, damit die
              Mitte die Mitte des Bildschirms ist und nicht der Rest zwischen
              Marke und CTA – die sind unterschiedlich breit. */}
          <nav
            aria-label="Hauptnavigation"
            className="absolute left-1/2 hidden -translate-x-1/2 lg:block"
          >
            {/* Eng gesetzt, damit die vier Punkte als ein Block gelesen
                werden und nicht als vier verstreute Links. Innen sperrig,
                außen dicht – dieser Gegensatz macht die Gruppe. */}
            {/* `gap` wächst mit dem Fenster. Die Leiste liegt absolut auf
                der Mittelachse und wächst damit nach BEIDEN Seiten – bei
                1024 px und fünf Punkten (seit „Förderung" und „Ablauf" dazu
                sind) stößt ihre linke Kante sonst an die Wortmarke. Ab xl
                ist Platz genug, dort darf sie wieder atmen. */}
            <ul className="flex items-center gap-x-4 xl:gap-x-6">
              {NAV_ITEMS.map((navItem) => (
                <li key={navItem.href}>
                  <Link
                    href={navItem.href}
                    className={cn(
                      "t-nav group relative block px-1 py-2 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ep-sun",
                      // /75 bzw. /80 statt der vorherigen /60 und /70:
                      // Auf Papier kam `text-ep-ink/60` auf 4,27:1 und lag
                      // damit unter den 4,5:1, die die t-label-Klasse für
                      // Kleintext selbst vorschreibt. Die Hauptnavigation
                      // war faktisch das schwächste Element der Seite.
                      light
                        ? "text-white/80 hover:text-white"
                        : "text-ep-ink/75 hover:text-ep-ink",
                    )}
                  >
                    {navItem.label}
                    {/* Der Leucht-Punkt der Wortmarke zündet unter dem Wort.
                        Absolut gesetzt, damit er im eng gesetzten Cluster
                        keine Breite beansprucht – ein mitlaufendes Element
                        würde die Gruppe wieder auseinanderziehen. */}
                    <span className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pr-[0.07em]">
                      <span className="scale-50 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                        <GlowDot />
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Rechte Seite. WhatsApp ist der Hauptkanal und steht deshalb
              AUCH auf dem Handy in der Leiste – vorher war er dort nur
              hinter dem Hamburger erreichbar, ausgerechnet auf den Geräten,
              über die der Traffic hereinkommt. Unter sm ohne Beschriftung,
              damit Marke, Kanal und Menü nebeneinander passen. */}
          <div
            className={cn(
              "flex items-center gap-1 sm:gap-3",
              light ? "text-white" : "text-ep-ink",
            )}
          >
            <WhatsAppButton
              tone="quiet"
              aria-label="Per WhatsApp anfragen"
              label={<span className="hidden sm:inline">WhatsApp</span>}
              className="max-sm:size-10 max-sm:px-0"
              data-nav-focusable
            />
            <MenuToggle
              open={open}
              light={light}
              onClick={() => setOpen((v) => !v)}
              toggleRef={toggleRef}
              className="lg:hidden"
            />
          </div>
        </div>
      </header>

      <AnimatePresence>{open && <MenuOverlay onClose={close} />}</AnimatePresence>
    </>
  );
}
