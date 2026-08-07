import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Eine Haarlinie, die beim Scrollen durchhängt.
 *
 * Diese Seite hat keine Bilder – ihr Baumaterial sind Linien: Trennstriche,
 * Schienen, Ringleitungen. Genau deshalb lohnt es sich, ihnen Masse zu
 * geben: Beim schnellen Scrollen bogen sie sich in Scrollrichtung durch und
 * schnappen elastisch zurück, wie ein gespanntes Seil. Aus starrer Grafik
 * wird ein Werkstoff, der auf Bewegung reagiert.
 *
 * Angetrieben wird das zentral im MotionRoot über `[data-bend]` – aus
 * derselben Geschwindigkeitsquelle wie die Trägheits-Neigung, damit beides
 * als ein Verhalten gelesen wird und nicht als zwei Effekte.
 *
 * Technik: viewBox 100×1 bei 1 px Höhe und `preserveAspectRatio="none"`
 * bedeutet, dass eine Y-Einheit exakt einem Pixel entspricht – der
 * Durchhang lässt sich also direkt in Pixeln rechnen. `overflow-visible`
 * ist Pflicht (SVG clippt sonst), `non-scaling-stroke` hält die Linie trotz
 * extremer Breitenskalierung bei 1 px.
 *
 * Die Farbe kommt über `currentColor`, also per `text-*` von außen.
 */
export function BendLine({ className, ...rest }: ComponentProps<"span">) {
  return (
    <span
      aria-hidden="true"
      className={cn("relative block h-px w-full", className)}
      {...rest}
    >
      <svg
        className="absolute inset-0 h-px w-full overflow-visible"
        viewBox="0 0 100 1"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          data-bend
          d="M0 0.5 Q 50 0.5 100 0.5"
          stroke="currentColor"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  );
}
