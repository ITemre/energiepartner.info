"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, SITE } from "@/lib/site";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

const LISTE: Variants = {
  zu: {},
  offen: { transition: { delayChildren: 0.22, staggerChildren: 0.06 } },
};

const EINTRAG: Variants = {
  zu: { opacity: 0, y: 18 },
  offen: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EXPO } },
};

/**
 * Vollbild-Hauptmenü für Mobile/Tablet.
 *
 * ⚠️ KEIN natives `<dialog>` mehr (13.08., zweiter Anlauf). Ein `<dialog>`
 * rendert im Top-Layer des Browsers – ÜBER JEDEM z-index, auch über der
 * eigenen Kopfleiste. Der Hamburger dort wurde beim Öffnen unsichtbar, und
 * das Menü brachte einen zweiten, anders platzierten Schließen-Knopf mit;
 * sichtbar wurde das als „Button springt". Jetzt liegt dieses Overlay unter
 * der Kopfleiste (`z-50` gegen `z-[60]`, siehe `SiteHeader`) – der Knopf in
 * der Leiste bleibt durchgehend derselbe Knoten, nur `MenuOverlay` legt
 * sich darunter.
 *
 * Fokusfalle/Escape/Scroll-Sperre sind darum von Hand gebaut statt vom
 * Dialog geschenkt (siehe Effekt unten) – dasselbe Ergebnis, ohne den
 * Top-Layer.
 *
 * ⚠️ HELL, NICHT NAVY (Kundenwunsch 13.08.): dieselbe Fläche wie der Hero,
 * mit demselben warmen Schein und derselben Skala – kein zweites Motiv für
 * denselben Auftritt.
 *
 * ⚠️ CLIP-PATH STATT FADE: Der Kreis wächst aus der oberen rechten Ecke –
 * genau dort, wo der Hamburger sitzt. Die Öffnung liest sich dadurch als
 * Folge des Klicks, nicht als unabhängig eingeblendete Fläche.
 */
export function MenuOverlay({
  offen,
  onSchliessen,
}: {
  offen: boolean;
  onSchliessen: () => void;
}) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!offen) return;

    const zuvorFokussiert = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const fokussierbar = () =>
      Array.from(
        panel.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? [],
      );

    const frame = requestAnimationFrame(() => fokussierbar()[0]?.focus());

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onSchliessen();
        return;
      }
      if (event.key !== "Tab") return;

      const items = fokussierbar();
      if (items.length === 0) return;
      const erster = items[0];
      const letzter = items[items.length - 1];

      if (event.shiftKey && document.activeElement === erster) {
        event.preventDefault();
        letzter.focus();
      } else if (!event.shiftKey && document.activeElement === letzter) {
        event.preventDefault();
        erster.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
      zuvorFokussiert?.focus();
    };
  }, [offen, onSchliessen]);

  return (
    <AnimatePresence>
      {offen && (
        <motion.div
          key="menu"
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label="Hauptmenü"
          initial={{ clipPath: "circle(0% at 100% 0%)" }}
          animate={{ clipPath: "circle(150% at 100% 0%)" }}
          exit={{ clipPath: "circle(0% at 100% 0%)" }}
          transition={{ duration: 0.65, ease: EXPO }}
          className="fixed inset-0 z-50 overflow-y-auto bg-ep-paper text-ep-ink lg:hidden"
        >
          {/* Derselbe warme Schein wie im Hero – siehe Kommentar dort
              („DER WARME SCHEIN"). Eine helle Fläche über die volle
              Bildschirmhöhe ist sonst einfach nur leer. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 70% at 100% 0%, rgba(242,106,33,0.16) 0%, rgba(242,106,33,0.05) 45%, transparent 70%)",
            }}
          />
          <div
            aria-hidden="true"
            className="ep-skala ep-skala-tinte ep-skala-auslauf pointer-events-none absolute inset-0"
          />

          <div className="relative flex min-h-dvh flex-col">
            {/* Platzhalter in der Höhe der Kopfleiste, die über diesem
                Overlay liegt – der Inhalt beginnt erst darunter. */}
            <div aria-hidden="true" className="h-[var(--nav-h)] shrink-0" />

            {/* ⚠️ KEIN `exit` HIER, UND DAS IST DER FIX FÜR EINEN ECHTEN BUG
                (13.08.): „Menü auf, zu, wieder auf – Links weg."

                Ursache war die Kombination aus Exit-Propagierung und
                Wiederbelebung: `AnimatePresence` reicht das Exit an alle
                Nachfahren weiter, die Einträge liefen also auf `opacity: 0`.
                Öffnet man wieder, BEVOR das Exit durch ist, montiert
                `AnimatePresence` nicht neu – es belebt dasselbe Element mit
                demselben `key` wieder. Dabei ändert sich `animate="offen"`
                nicht, die Prop stand ja durchgehend auf „offen". Ohne
                Prop-Wechsel startet Framer Motion die Animation nicht neu,
                und die Einträge blieben auf dem Wert stehen, den das
                abgebrochene Exit hinterlassen hatte: unsichtbar.

                Das Exit war ohnehin überflüssig – der zulaufende
                Clip-Path-Kreis des Eltern-Elements verdeckt die Einträge
                bereits. Ohne eigenes Exit stehen sie beim Wiederbeleben
                weiterhin auf `opacity: 1` und sind sofort da; bei einem
                echten Neuaufbau greift `initial="zu"` wie gehabt. */}
            <motion.nav
              aria-label="Hauptnavigation"
              variants={LISTE}
              initial="zu"
              animate="offen"
              className="ep-container py-8"
            >
              <ul className="flex flex-col">
                {NAV_ITEMS.map((item, i) => (
                  <motion.li
                    key={item.href}
                    variants={EINTRAG}
                    className={cn("border-b border-ep-line", i === 0 && "border-t")}
                  >
                    <Link
                      href={item.href}
                      onClick={onSchliessen}
                      className="group flex items-center gap-5 py-4 outline-none sm:py-5"
                    >
                      <span className="t-key text-ep-ink/40">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="t-h2 flex-1 transition-[color,transform] duration-300 group-hover:translate-x-2 group-hover:text-ep-accent group-focus-visible:translate-x-2 group-focus-visible:text-ep-accent">
                        {item.label}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>

            {/* Ebenfalls ohne `exit`, aus demselben Grund wie an der
                Navigation darüber. */}
            <motion.div
              variants={EINTRAG}
              initial="zu"
              animate="offen"
              transition={{ duration: 0.5, ease: EXPO, delay: 0.5 }}
              className="ep-container mt-auto shrink-0 border-t border-ep-line py-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <WhatsAppButton
                  size="lg"
                  className="w-full justify-center sm:w-auto"
                  onClick={onSchliessen}
                />
                <a
                  href={SITE.phone.href}
                  className="inline-flex items-center justify-center gap-2 text-ep-ink/70 outline-none transition-colors hover:text-ep-ink focus-visible:text-ep-ink"
                >
                  <Phone className="size-4 text-ep-accent" aria-hidden="true" />
                  {SITE.phone.display}
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
