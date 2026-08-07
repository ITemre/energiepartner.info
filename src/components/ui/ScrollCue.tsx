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
 */
export function ScrollCue() {
  return (
    <span
      data-hero-cue
      aria-hidden="true"
      className="pointer-events-none ml-auto hidden items-center gap-3 sm:inline-flex"
    >
      <span className="t-label text-white/70">
        <span className="sm:hidden">Swipe</span>
        <span className="hidden sm:inline">Scrollen</span>
      </span>
      <span className="flex h-8 w-[21px] items-start justify-center rounded-full border border-white/30 p-[5px]">
        <span className="ep-scrollcue-dot size-1.5 rounded-full bg-ep-sun" />
      </span>
    </span>
  );
}
