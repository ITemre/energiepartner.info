import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";

/** WhatsApp-Markenglyph (Kanal-Signal, nicht Teil der Markenfarben) */
function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M16 3C9 3 3.5 8.5 3.5 15.5c0 2.3.6 4.4 1.7 6.3L3 29l7.4-2c1.8 1 3.9 1.5 6.1 1.5 7 0 12.5-5.5 12.5-12.5S23 3 16 3Zm0 22.8c-1.9 0-3.7-.5-5.3-1.5l-.4-.2-4.4 1.2 1.2-4.3-.3-.4a10 10 0 0 1-1.6-5.4C5.2 9.6 10 5 16 5s10.8 4.6 10.8 10.5S22 25.8 16 25.8Zm5.9-7.7c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.7 8.7 0 0 1-4.3-3.7c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.6l-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-1.2 1.3-1.2 3.1-.1 4.9a12 12 0 0 0 5.9 5.1c2.1.9 2.9.8 4 .6.6-.1 1.9-.8 2.2-1.5s.3-1.4.2-1.5-.3-.2-.6-.3Z" />
    </svg>
  );
}

type Size = "sm" | "lg";

/**
 * `solid` – volles Kanal-Grün (`ep-whatsapp`). Der Regelfall für jeden
 *   Knopf, der WhatsApp öffnet: Kopfleiste wie Hero-CTA.
 * `quiet` – Kontur, Glyph in Grün. Für Stellen, an denen bereits eine
 *   volle Grünfläche im selben Bild steht.
 *
 * WARUM DIE KOPFLEISTE WIEDER GRÜN TRÄGT (22.09.) * Dazwischen stand dort ein dritter Ton `accent` in Marken-Orange. Grund
 * war eine echte Beobachtung: #25D366 ist heller und gesättigter als jede
 * Markenfarbe, und standen Leiste und Hero-CTA gleichzeitig im Bild, war
 * das Grün zweimal das Auffälligste auf der Fläche – der Kanal gewann
 * gegen die Marke, ausgerechnet im wichtigsten Frame der Seite.
 *
 * Dagegen steht das Gegenargument, das jetzt zählt: Beide Knöpfe führen an
 * denselben Ort. Ein Kanal, der oben rechts orange und in der Mitte grün
 * aussieht, liest sich als zwei verschiedene Angebote statt als eine
 * Handlung, die zweimal angeboten wird. Eine Handlung, ein Ton.
 *
 * `quiet` bleibt als Ausweg: Der Glyph trägt die Erkennung, nicht die
 * Fläche – wo eine zweite Grünfläche wirklich stört, genügt die Kontur.
 */
type Tone = "solid" | "quiet";

export function WhatsAppButton({
  size = "sm",
  tone = "solid",
  label = "Per WhatsApp anfragen",
  className,
  ...props
}: {
  size?: Size;
  tone?: Tone;
  /** ReactNode statt string, damit Aufrufer die Beschriftung responsiv
   *  ausblenden können (`<span className="hidden sm:inline">`). Wer das
   *  tut, muss ein `aria-label` mitgeben – sonst bleibt ein namenloser
   *  Link zurück. */
  label?: React.ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<"a">) {
  return (
    <a
      href={SITE.whatsapp.href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group inline-flex items-center justify-center gap-2 rounded-ep font-semibold",
        "transition-[transform,background-color,border-color] duration-200",
        "hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ep-whatsapp",
        tone === "solid" &&
          "bg-ep-whatsapp text-[#04381A] shadow-[0_8px_24px_-8px_rgba(37,211,102,0.45)]",
        tone === "quiet" &&
          // Farbneutrale Kontur: funktioniert auf Navy wie auf Papier,
          // weil sie `currentColor` erbt. Die Elternfläche gibt die
          // Textfarbe vor, der Glyph bleibt grün.
          "border border-current/30 hover:border-current/60 hover:bg-current/10",
        size === "lg" ? "px-6 py-4 text-base" : "px-4 py-2.5 text-sm",
        className,
      )}
      {...props}
    >
      <WhatsAppGlyph
        className={cn(
          "shrink-0",
          tone === "quiet" && "text-ep-whatsapp",
          size === "lg" ? "size-6" : "size-5",
        )}
      />
      {label}
    </a>
  );
}
