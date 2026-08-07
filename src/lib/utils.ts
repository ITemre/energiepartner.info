import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind-Klassen konfliktfrei (clsx + tailwind-merge).
 * Corivo-Standard-Helper – in allen Web-Repos genutzt.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
