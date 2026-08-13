/**
 * Scroll-/Swipe-Hinweis.
 *
 * Steht INLINE, nicht absolut. Vorher schwebte er zentriert am unteren
 * Hero-Rand und landete damit genau auf der Bausteinreihe, die dort
 * ebenfalls sitzt – zwei Elemente auf derselben Zeile, von denen keines vom
 * anderen wusste. Es sah nicht komponiert aus, sondern zufällig.
 *
 * Als Zeilenelement hat er eine Position, die aus dem Layout kommt: rechts
 * außen in der Vertrauenszeile, am Ende der Leserichtung – also genau dort,
 * wo der Blick ankommt, wenn er mit dem Hero fertig ist.
 *
 * Das Ausblenden steuert die Abgangs-Timeline im Hero über
 * `[data-hero-cue]`. Eine eigene Sichtbarkeitslogik hätte hier keine
 * Grundlage: Der Hero liegt sticky, seine Sektion bleibt also im Viewport,
 * während der restliche Inhalt sich darüberschiebt – ein
 * IntersectionObserver auf die Sektion würde nie auslösen.
 *
 * ═══ FARBE KOMMT VON AUSSEN (10.08.) ═══
 * Schrift und Kontur standen fest auf Weiß, weil der Hinweis nur im
 * Navy-Hero vorkam. Seit der auf Papier läuft, wäre das eine unsichtbare
 * Kontur auf heller Fläche.
 *
 * Beides hängt jetzt an `currentColor`, die Deckkraft regelt der Aufrufer
 * über die Textfarbe. Das ist der kleinere Eingriff als eine Ton-Prop: Ein
 * Hinweis, der nur Umriss und Punkt ist, braucht keine zwei Paletten,
 * sondern nur eine Farbe, die er erbt.
 *
 * Der Punkt bleibt `ep-accent-strong`: Er ist FLÄCHE, keine Schrift, und
 * unterliegt damit nicht der Kontrastregel der adaptiven Rolle `ep-accent`.
 */
/**
 * ⚠️ ZWEI AUFSTELLUNGEN, EINE KOMPONENTE (13.08.).
 *
 * `zeile` (Vorgabe) – wie bisher: rechts außen in der Beleg-Leiste, waagerecht,
 *   erst ab `sm` sichtbar. Das ist die Desktop-Fassung.
 * `saeule` – mittig, Text ÜBER dem Zeichen, für den unteren Rand des Heros
 *   auf dem Handy. Dort gab es bis jetzt gar keinen Hinweis: Die alte Fassung
 *   hing in `[data-hero-beleg]`, und dieser Block ist unter `lg` ausgeblendet
 *   (13.08., Kundenwunsch). Ausgerechnet auf dem Gerät, auf dem gewischt statt
 *   gescrollt wird, fehlte der Hinweis also vollständig.
 *
 * Die Ausblendung beim Rausscrollen übernimmt weiterhin die Abgangs-Timeline
 * des Heros über `[data-hero-cue]`. Sie greift auf beide Aufstellungen, weil
 * das Attribut hier steht und nicht am Aufrufer.
 */
export function ScrollCue({
  variante = "zeile",
}: {
  variante?: "zeile" | "saeule";
}) {
  const saeule = variante === "saeule";

  return (
    <span
      data-hero-cue
      aria-hidden="true"
      className={
        saeule
          ? "pointer-events-none flex flex-col items-center gap-1.5"
          : "pointer-events-none ml-auto hidden items-center gap-3 sm:inline-flex"
      }
    >
      {/* In der Säule zuerst der Text, dann das Zeichen – gelesen wird von
          oben nach unten, und die Bewegung im Zeichen zeigt nach unten.
          Andersherum stünde die Anweisung hinter ihrer Ausführung.

          ⚠️ DIE SÄULE SETZT NICHT `.t-label`. Die Rolle ist 15 px Mono,
          versalisiert und auf 0.14em gesperrt – als Overline über einer
          Sektionsüberschrift richtig, als Fußnote am unteren Heroende viel
          zu laut. Ein Wischhinweis ist das Leiseste auf dem Bildschirm, er
          darf nicht so viel Gewicht tragen wie eine Sektionskennung. */}
      <span
        className={
          saeule
            ? "text-[10px] font-medium uppercase leading-none tracking-[0.12em] opacity-55"
            : "t-label opacity-70"
        }
      >
        {saeule ? "Swipe" : (
          <>
            <span className="sm:hidden">Swipe</span>
            <span className="hidden sm:inline">Scrollen</span>
          </>
        )}
      </span>
      <span
        className={
          saeule
            ? "flex h-5 w-3 items-start justify-center rounded-full border border-current/25 p-[3px]"
            : "flex h-8 w-[21px] items-start justify-center rounded-full border border-current/30 p-[5px]"
        }
      >
        <span
          className={
            saeule
              ? "ep-scrollcue-dot size-1 rounded-full bg-ep-accent-strong"
              : "ep-scrollcue-dot size-1.5 rounded-full bg-ep-accent-strong"
          }
        />
      </span>
    </span>
  );
}
