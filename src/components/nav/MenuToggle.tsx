"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Zwei-Strich-Menübutton, der zu einem X morpht.
 * `light` = weiße Striche (über Hero/Overlay), sonst Tinte.
 */
export function MenuToggle({
  open,
  light,
  onClick,
  toggleRef,
  className,
}: {
  open: boolean;
  light: boolean;
  onClick: () => void;
  toggleRef?: React.Ref<HTMLButtonElement>;
  className?: string;
}) {
  const bar =
    "absolute left-1/2 h-[2px] w-6 -translate-x-1/2 rounded-full transition-colors duration-300";
  const color = light ? "bg-white" : "bg-ep-ink";

  return (
    <button
      ref={toggleRef}
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-controls="nav-overlay"
      aria-label={open ? "Menü schließen" : "Menü öffnen"}
      data-nav-focusable
      className={cn(
        "relative grid size-11 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ep-sun",
        className,
      )}
    >
      <span className="relative block size-6" aria-hidden="true">
        <motion.span
          className={cn(bar, color, "top-1/2")}
          initial={false}
          animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }}
          transition={{ type: "spring", stiffness: 400, damping: 26 }}
        />
        <motion.span
          className={cn(bar, color, "top-1/2")}
          initial={false}
          animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }}
          transition={{ type: "spring", stiffness: 400, damping: 26 }}
        />
      </span>
    </button>
  );
}
