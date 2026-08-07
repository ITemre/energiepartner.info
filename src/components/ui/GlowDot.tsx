import { cn } from "@/lib/utils";

/**
 * Der Leucht-Punkt aus der Wortmarke.
 *
 * Im Logo sitzt er als i-Punkt über dem „i" und ist das einzige Bildelement
 * der Marke – kein Symbol, kein Piktogramm, nur Licht. Genau deshalb eignet
 * er sich als Zustandsanzeige: Wo etwas aktiv wird, geht das Markenlicht an.
 *
 * Aufbau wie im Original (Logo-Mappe): weicher Halo außen, fester Kern
 * innen, Lichtreflex nach links oben versetzt. Der Halo liegt in einer
 * eigenen, überstehenden Ebene – die Maße des Punktes bleiben dadurch die
 * des Kerns, und ein `size-*` von außen wirkt so, wie man es erwartet.
 *
 * Ausnahme von der Flat-Regel: Verläufe sind auf dieser Seite sonst
 * unerwünscht (Hero, Bänder). Hier sind sie die Marke selbst.
 */
export function GlowDot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("relative block size-1.5 shrink-0", className)}
    >
      {/* Halo – trägt das Leuchten, ohne die Größe zu verändern */}
      <span
        className="absolute -inset-[100%] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,194,77,0.45) 0%, rgba(245,166,35,0.18) 38%, rgba(245,166,35,0) 70%)",
        }}
      />
      {/* Kern mit Lichtreflex */}
      <span
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 34% 30%, #FFE1A3 0%, #FFC24D 45%, #F5A623 100%)",
        }}
      />
    </span>
  );
}
