import { cn } from "@/lib/utils";
import { GlowDot } from "@/components/ui/GlowDot";

/**
 * Die Wortmarke von angebote-vergleichen.info.
 *
 * EIGENE MARKE, SICHTBARER ABSENDER * Die Seite trug bisher die energiepartner-Wortmarke. Das war falsch, und
 * zwar in beide Richtungen: Sie sah aus wie dieselbe Seite (obwohl sie eine
 * andere Aufgabe hat, siehe Projekt-Briefing 3), und sie versprach dem
 * Besucher einen Unternehmensauftritt, wo eine Prüfstrecke steht.
 *
 * Die beiden Domains sind im Kern verbunden – derselbe Betrieb, dieselbe
 * Person am Telefon – aber sie sprechen verschiedene Leute an. Wer per QR
 * aus einem Brief kommt, hat ein Angebot in der Hand und sucht eine Prüfung;
 * er hat energiepartner womöglich noch nie gehört. Für ihn muss oben stehen,
 * wo er ist, nicht wer dahintersteht.
 *
 * DIE LÖSUNG: NAME VORN, HERKUNFT DAHINTER * Der Domainname selbst ist die Marke – er sagt in drei Wörtern, was die
 * Seite tut, und der Besucher hat ihn gerade eingegeben oder gescannt.
 * Darunter steht klein, von wem sie betrieben wird. Das ist die übliche
 * Ordnung für Untermarken, und sie leistet hier zweierlei: Der Auftritt
 * wirkt eigenständig, und der Absender bleibt nachprüfbar – was bei einer
 * Seite, der man eine Datei anvertraut, kein Detail ist.
 *
 * WAS DIE VERBINDUNG TRÄGT * Nicht das Logo, sondern die Elemente darunter: dieselbe Schrift, dieselbe
 * Farbwelt, dieselbe Skala im Hintergrund – und der Leucht-Punkt, das
 * eigentliche Markenmotiv, hier auf dem Punkt vor „info". Man erkennt die
 * Herkunft, ohne dass zweimal dasselbe Zeichen steht.
 */
export function AvWortmarke({
  className,
  /** Ohne Herkunftszeile – für sehr enge Stellen. */
  kompakt = false,
  /**
   * Grund, auf dem sie steht.
   *
   * ALS PROP UND NICHT ALS KLASSEN-ÜBERSCHREIBUNG VON AUSSEN (08.09.).
   * Die Kopfleiste setzte vorher `[&_span]:text-ep-ink`, um die weiße
   * Fassung umzufärben. Das traf ALLE Spans mit derselben Deckkraft und
   * hat damit genau die Abstufung eingeebnet, aus der die Wortmarke
   * besteht: „info" bei 70 %, die Herkunftszeile bei 45 %. Zusätzlich
   * entscheidet zwischen zwei gleich spezifischen Tailwind-Utilities die
   * Reihenfolge in der Layer-Ausgabe, nicht die im Markup – die
   * Überschreibung war also nicht einmal verlässlich.
   *
   * Seit der Hero auf Papier läuft, ist das kein Randfall mehr: Die
   * Kopfleiste steht die meiste Zeit auf hellem Grund.
   */
  ton = "hell",
}: {
  className?: string;
  kompakt?: boolean;
  ton?: "hell" | "dunkel";
}) {
  const aufDunkel = ton === "hell";

  return (
    <span className={cn("inline-flex flex-col leading-none", className)}>
      <span
        className={cn(
          "flex items-baseline text-[clamp(0.9375rem,1.4vw,1.125rem)] font-bold tracking-[-0.02em] [font-stretch:88%]",
          aufDunkel ? "text-white" : "text-ep-ink",
        )}
      >
        angebote-vergleichen
        {/* Der Punkt der Domain ist der Leucht-Punkt der Marke. Er sitzt an
            der Stelle, an der ohnehin ein Punkt stehen müsste – deshalb
            wirkt er als Zeichen und nicht als Dekoration. */}
        <span className="mx-[0.14em] inline-flex translate-y-[-0.06em] items-center">
          <GlowDot />
        </span>
        <span className={aufDunkel ? "text-white/70" : "text-ep-ink/55"}>
          info
        </span>
      </span>

      {!kompakt && (
        <span
          className={cn(
            "mt-1.5 text-[11px] font-medium tracking-[0.04em]",
            aufDunkel ? "text-white/45" : "text-ep-ink/50",
          )}
        >
          ein Service von energiepartner
        </span>
      )}
    </span>
  );
}
