"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const SPRING = { type: "spring" as const, stiffness: 380, damping: 32 };

/**
 * Der Hamburger-/Schließen-Knopf der mobilen Navigation.
 *
 * BLEIBT DERSELBE KNOTEN, IMMER (13.08., zweiter Anlauf). Vorher lag der
 * Schließen-Knopf im `MenuOverlay` selbst, an anderer Stelle als der
 * Hamburger hier – sichtbar wurde das, sobald man öffnete: Der Button
 * „sprang". Jetzt gibt es nur diesen einen Knopf, er lebt in der
 * Kopfleiste (über dem Overlay, siehe `SiteHeader`) und morpht nur sein
 * Icon zwischen den drei Balken und dem X. Kein zweiter Knopf, kein Sprung.
 *
 * Federn statt Ease-Kurven (`type: "spring"`): Für einen Knopf, den man
 * antippt, wirkt eine Feder direkter als eine Timing-Funktion – sie
 * reagiert auf die Geste, statt eine feste Zeit abzuspulen.
 */
export function MenuToggle({
  open,
  className,
  ...props
}: { open: boolean } & Omit<React.ComponentPropsWithoutRef<"button">, "children">) {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-expanded={open}
      className={cn(
        "relative z-10 grid size-11 shrink-0 place-items-center rounded-ep outline-none transition-colors hover:bg-current/10 focus-visible:ring-2 focus-visible:ring-ep-accent-strong",
        className,
      )}
      {...props}
    >
      <span className="sr-only">{open ? "Menü schließen" : "Menü öffnen"}</span>
      <span aria-hidden="true" className="relative block size-5">
        <motion.span
          className="absolute inset-x-0 h-[2px] rounded-full bg-current"
          style={{ top: 3 }}
          animate={open ? { y: 6, rotate: 45 } : { y: 0, rotate: 0 }}
          transition={SPRING}
        />
        <motion.span
          className="absolute inset-x-0 h-[2px] rounded-full bg-current"
          style={{ top: 9 }}
          animate={{ opacity: open ? 0 : 1, scale: open ? 0.4 : 1 }}
          transition={{ duration: 0.15 }}
        />
        <motion.span
          className="absolute inset-x-0 h-[2px] rounded-full bg-current"
          style={{ top: 15 }}
          animate={open ? { y: -6, rotate: -45 } : { y: 0, rotate: 0 }}
          transition={SPRING}
        />
      </span>
    </button>
  );
}
