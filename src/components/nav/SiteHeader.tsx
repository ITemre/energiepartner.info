"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, SITE } from "@/lib/site";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { useNavTheme } from "@/components/nav/useNavTheme";
import { MenuToggle } from "@/components/nav/MenuToggle";
import { MenuOverlay } from "@/components/nav/MenuOverlay";

const LOGO_HEIGHT = 28;
const LOGO_WIDTH = Math.round(LOGO_HEIGHT * SITE.logo.ratio);

/**
 * Kopfleiste von energiepartner.info – Neubau (13.08.2026).
 *
 * WARUM SIE NEU ENTSTAND * Kundenwunsch: „moderner, wirkt wie eine richtige Company." Die alte Leiste
 * (`SiteHeader`, `MenuToggle`, `MenuOverlay`) war bereits vollständig
 * entfernt (siehe Layout-Kommentar) – das hier ist der Ersatz, keine
 * Überarbeitung.
 *
 * FARBE FOLGT DEM BAND * Wie `AvHeader`: `useNavTheme()` liest, welches `data-nav-theme` gerade
 * unter der Leistenmitte liegt, und schaltet Wortmarke, Links und Fläche
 * gemeinsam um. `data-surface` auf dem Farb-Wrapper ist Pflicht, nicht
 * Kosmetik – ohne es löst `ep-accent` beim Hover über Navy zu knapp
 * kontrastierendem Orange auf, siehe Token-Regel in `globals.css`.
 *
 * MOBIL NUR DER HAMBURGER * Der WhatsApp-Knopf steht ab `lg` fest in der Leiste. Darunter würde er
 * neben dem Hamburger um Platz konkurrieren, und er hat ohnehin einen
 * größeren, deutlicheren Auftritt im Vollbildmenü selbst (`MenuOverlay`) –
 * dort steht er allein am Fuß, nicht gequetscht in einer 60-px-Zeile.
 *
 * z-[60], EINE STUFE ÜBER DEM OVERLAY * `MenuOverlay` liegt auf `z-50` und deckt beim Öffnen den ganzen
 * Bildschirm ab. Die Leiste bleibt darüber, damit ihr Hamburger-Knopf
 * durchgehend derselbe Knoten bleibt – er morpht nur sein Icon, statt beim
 * Öffnen zu verschwinden und einem zweiten Schließen-Knopf im Overlay Platz
 * zu machen (der frühere Bug: „Button springt beim Öffnen").
 *
 * LEISTE WIRD HELL, SOBALD DAS MENÜ OFFEN IST * Das Overlay ist hell (Papier), unabhängig davon, über welchem Band man
 * gerade steht. Ohne `chromeOnDark` bliebe die Leiste in dem Moment, in dem
 * jemand aus einer Navy-Sektion heraus öffnet, dunkel – ein dunkler Streifen
 * über einer hellen Fläche.
 *
 * ANKUNFT * Die Leiste fährt einmal beim Laden herein (kein Scroll-Trigger, sie ist
 * ja von Anfang an im Bild), Wortmarke/Navigation/Knopf folgen leicht
 * versetzt – derselbe Ankunfts-Rhythmus wie der Hero, nur kürzer, damit sie
 * nicht hinter dessen Zeilenmasken zurücksteht.
 */
export function SiteHeader() {
  const scope = useRef<HTMLElement>(null);
  const { onDark, lifted } = useNavTheme({ startetDunkel: false });
  const [menuOffen, setMenuOffen] = useState(false);
  /* `useCallback`, KEIN Inline-Arrow (13.08., Bugfix). Ohne das bekam
     `MenuOverlay` bei JEDEM Rerender der Leiste eine NEUE Funktionsreferenz
     als `onSchliessen` – und die steht im Dependency-Array von dessen
     Fokusfallen-Effekt. Der Effekt lief dadurch öfter als nötig neu an,
     setzte mitten im offenen Menü den Fokus zurück und räumte die
     Scroll-Sperre ab, bevor sie sollte. Sichtbar wurde das als „Menü zu,
     wieder auf – Links weg": ein Rerender zwischen den beiden Klicks reichte,
     um den Effekt in einem halb aufgeräumten Zustand zu erwischen. */
  const schliesseMenu = useCallback(() => setMenuOffen(false), []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.fromTo(
          scope.current,
          { y: -18, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8 },
        ).fromTo(
          "[data-header-in]",
          { y: -8, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.08 },
          "-=0.45",
        );
      });
    },
    { scope },
  );

  /* Solange das Vollbildmenü offen ist, trägt die Leiste dessen helle
     Fläche mit statt der scrollabhängigen Bandfarbe. */
  const chromeOnDark = menuOffen ? false : onDark;

  return (
    <>
      <header
        ref={scope}
        className={cn(
          "fixed inset-x-0 top-0 z-[60] transition-colors duration-300",
          menuOffen
            ? "border-b border-ep-line bg-ep-paper/95 backdrop-blur-md"
            : lifted
              ? chromeOnDark
                ? "border-b border-ep-line-dark bg-ep-navy-deep/80 backdrop-blur-md"
                : "border-b border-ep-line bg-ep-paper/85 backdrop-blur-md"
              : "border-b border-transparent",
        )}
      >
        <div
          data-surface={chromeOnDark ? "dark" : undefined}
          className={cn(
            "ep-container flex h-[var(--nav-h)] items-center justify-between gap-6",
            chromeOnDark ? "text-white" : "text-ep-ink",
          )}
        >
          <Link
            href="/"
            data-header-in
            aria-label="energiepartner – zum Seitenanfang"
            className="shrink-0 rounded-ep outline-none focus-visible:ring-2 focus-visible:ring-ep-accent-strong"
          >
            <Image
              src={chromeOnDark ? SITE.logo.negativ : SITE.logo.positiv}
              alt="energiepartner"
              width={LOGO_WIDTH}
              height={LOGO_HEIGHT}
              unoptimized
              priority
              className="h-[22px] w-auto sm:h-[28px]"
            />
          </Link>

          <nav aria-label="Hauptnavigation" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <li key={item.href} data-header-in>
                  <Link
                    href={item.href}
                    className="t-nav group relative inline-flex items-center py-2 text-current/85 outline-none transition-colors hover:text-ep-accent focus-visible:text-ep-accent after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-ep-accent after:transition-transform after:duration-300 after:content-[''] hover:after:scale-x-100 focus-visible:after:scale-x-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div data-header-in className="flex items-center gap-2">
            <WhatsAppButton tone="accent" size="sm" className="hidden lg:inline-flex" />
            <MenuToggle
              open={menuOffen}
              onClick={() => setMenuOffen((v) => !v)}
              className="lg:hidden"
            />
          </div>
        </div>
      </header>

      <MenuOverlay offen={menuOffen} onSchliessen={schliesseMenu} />
    </>
  );
}
