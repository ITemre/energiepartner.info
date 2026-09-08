import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

/**
 * Bewegungs-Vokabular der Seite.
 *
 * Die Regel dahinter: Es gibt genau drei Reveal-Typen, und jeder hat eine
 * feste Zuständigkeit. Acht Sektionen mit demselben „y:24, autoAlpha" lesen
 * sich sauber, aber tot – acht Sektionen mit acht Ideen lesen sich unruhig.
 *
 *   Typ 1  Zeilenmaske      → Headlines (maskedHeadline)
 *   Typ 2  Versatz + Fade   → Fließtext, Listen, Karten
 *   Typ 3  Scrub            → alles, was am Scroll hängt (Linien, Szene)
 *
 * Dazu kommt als eigene Ebene der Parallax (siehe ParallaxRoot): dieselbe
 * Richtung für alle, nur unterschiedliche Tempi. Das ist der Versatz, der
 * eine Seite lebendig wirken lässt, ohne dass ein einzelnes Element auffällt.
 */

/** Gemeinsame Taktung. Wer hiervon abweicht, sollte einen Grund haben. */
export const EASE = "expo.out";
export const EASE_SOFT = "power2.out";

/** Vertikaler Puffer der Zeilenmasken, siehe `padMasks`. */
const MASK_PAD = "0.18em";

/** Startversatz der maskierten Zeilen. Muss deutlich über 100 % liegen,
 *  damit die Zeile auch unterhalb des gepufferten Maskenrands beginnt und
 *  nicht schon als Schnipsel sichtbar ist. */
const MASK_FROM = 135;

/**
 * Gibt den SplitText-Masken vertikal Luft, ohne das Layout zu verändern.
 *
 * Die Masken sind exakt zeilenhoch und schneiden mit `overflow: hidden`
 * alles ab, was darüber hinausragt. Bei enger Zeilenführung trifft das
 * ausgerechnet die deutschen Problemzonen: Unterlängen (g, j, p, ß) und
 * Umlautpunkte auf Großbuchstaben (Ä, Ö, Ü). Sichtbar wird das als
 * abgeschnittene Buchstaben – „Ihre Energie." verliert den Bauch des g.
 *
 * Der Innenabstand schafft den Platz, der gleich große negative
 * Außenabstand nimmt ihn dem Layout wieder weg: Die Zeilen stehen also
 * weiterhin genau so eng, wie sie gesetzt sind.
 */
function padMasks(split: SplitText, container: Element) {
  split.lines.forEach((line) => {
    const mask = (line as HTMLElement).parentElement;
    // Ohne Maske ist das Elternelement der Container selbst – dann gäbe es
    // nichts zu puffern, und ein Padding säße an der falschen Stelle.
    if (!mask || mask === container) return;

    mask.style.paddingTop = MASK_PAD;
    mask.style.marginTop = `-${MASK_PAD}`;
    mask.style.paddingBottom = MASK_PAD;
    mask.style.marginBottom = `-${MASK_PAD}`;
  });
}

/**
 * Typ 1 – Headline schiebt sich Zeile für Zeile aus unsichtbaren Masken.
 *
 * Wichtig: Gesplittet wird erst nach `document.fonts.ready`, sonst berechnet
 * SplitText die Umbrüche auf der Fallback-Schrift und die Masken sitzen
 * falsch. Bis dahin ist die Headline auf autoAlpha 0 – das passiert im
 * LayoutEffect, also vor dem ersten Paint, es blitzt nichts auf.
 *
 * Die Selektoren müssen seitenweit eindeutig sein (z. B. `[data-x-h2]`):
 * der Timeline-Aufbau läuft asynchron und damit außerhalb des
 * gsap.context-Scopings von useGSAP.
 *
 * @returns Cleanup – im matchMedia-Callback zurückgeben.
 */
export function maskedHeadline(config: {
  /** Selektor der Headline. */
  headline: string;
  /** Optional: was direkt danach nachrückt (Fließtext, CTA, Eyebrow). */
  follow?: string;
  /** Startzeit des Nachzugs auf der Timeline. */
  followAt?: number;
  /** Ohne Angabe läuft die Timeline sofort – für den Hero, der beim Laden
   *  spielt und nicht beim Reinscrollen. */
  scrollTrigger?: ScrollTrigger.Vars;
  /** Für Sektionen mit eigener Abfolge (Hero): hängt weitere Schritte an
   *  dieselbe Timeline. Damit bleibt auch eine maßgeschneiderte
   *  Choreografie an diesem Baustein und braucht kein eigenes SplitText –
   *  sonst gehen zentrale Korrekturen wie `padMasks` an ihr vorbei. */
  build?: (timeline: gsap.core.Timeline) => void;
}): () => void {
  const {
    headline,
    follow,
    followAt = 0.35,
    scrollTrigger,
    build,
  } = config;
  let split: SplitText | undefined;
  let cancelled = false;

  gsap.set(headline, { autoAlpha: 0 });
  if (follow) gsap.set(follow, { autoAlpha: 0 });

  document.fonts.ready.then(() => {
    if (cancelled) return;

    /* `aria-hidden` schützt den gezogenen Strich (`Marker`).
       SplitText zerlegt den Inhalt intern in Wörter und baut daraus die
       Zeilen neu zusammen. Ein `<span>`, das mehrere Wörter umfasst, wird
       dabei aufgebrochen – im Hero blieb vom Strich unter „Ihr Vorteil."
       genau einer unter „Ihr" übrig. `ignore` hält solche Elemente
       zusammen, statt sie als Wortfolge zu behandeln. */
    split = new SplitText(headline, {
      type: "lines",
      mask: "lines",
      ignore: "[data-marker]",
    });
    document.querySelectorAll(headline).forEach((el) => padMasks(split!, el));

    const tl = gsap.timeline({ defaults: { ease: EASE }, scrollTrigger });
    tl.set(headline, { autoAlpha: 1 }).from(split.lines, {
      yPercent: MASK_FROM,
      duration: 1,
      stagger: 0.12,
    });

    if (follow) {
      tl.fromTo(
        follow,
        { y: 20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.1 },
        followAt,
      );
    }

    build?.(tl);
  });

  return () => {
    cancelled = true;
    split?.revert();
  };
}

/**
 * Typ 1b – dieselbe Zeilenmaske, aber pro Element mit eigenem Trigger.
 *
 * Für Sektionen, in denen mehrere gleichrangige Textblöcke nacheinander
 * gelesen werden (Zitate, Aussagen). `maskedHeadline` würde alle vier
 * Blöcke an einen gemeinsamen Trigger hängen – dann sind die unteren längst
 * enthüllt, bevor man sie erreicht.
 */
export function maskedItems(
  selector: string,
  options: { start?: string; stagger?: number } = {},
): () => void {
  const { start = "top 85%", stagger = 0.1 } = options;
  const splits: SplitText[] = [];
  let cancelled = false;

  const elements = gsap.utils.toArray<HTMLElement>(selector);
  gsap.set(elements, { autoAlpha: 0 });

  document.fonts.ready.then(() => {
    if (cancelled) return;

    elements.forEach((el) => {
      const split = new SplitText(el, { type: "lines", mask: "lines" });
      padMasks(split, el);
      splits.push(split);

      gsap.set(el, { autoAlpha: 1 });
      gsap.from(split.lines, {
        yPercent: MASK_FROM,
        duration: 1,
        stagger,
        ease: EASE,
        scrollTrigger: { trigger: el, start, once: true },
      });
    });
  });

  return () => {
    cancelled = true;
    splits.forEach((split) => split.revert());
  };
}

/**
 * Typ 2 – Listen und Karten kommen einzeln, nicht als Block.
 *
 * Jedes Element bekommt seinen eigenen Trigger statt eines gemeinsamen mit
 * Stagger. Dadurch reagiert die Sektion auf das Scrolltempo des Nutzers:
 * langsam gescrollt erscheinen die Einträge einzeln, schnell gescrollt
 * praktisch zusammen. Genau das fühlt sich „mitgehend" an.
 *
 * Bewegt wird `yPercent`, nicht `y` – `y` gehört dem Parallax. GSAP hält
 * beide Werte getrennt, sie können sich also nicht gegenseitig überschreiben.
 */
export function revealItems(
  targets: gsap.TweenTarget,
  options: { distance?: number; duration?: number; start?: string } = {},
) {
  const { distance = 14, duration = 0.85, start = "top 88%" } = options;

  gsap.utils.toArray<HTMLElement>(targets).forEach((el) => {
    gsap.fromTo(
      el,
      { yPercent: distance, autoAlpha: 0 },
      {
        yPercent: 0,
        autoAlpha: 1,
        duration,
        ease: EASE_SOFT,
        scrollTrigger: { trigger: el, start, once: true },
      },
    );
  });
}

/**
 * Typ 3 – eine Zahl zählt hoch, sobald sie ins Bild kommt.
 *
 * WARUM ÜBERHAUPT * Die Seite argumentiert an ihren wichtigsten Stellen mit Zahlen (Förderung,
 * Beleg-Leiste). Eine Zahl, die fertig dasteht, wird gelesen; eine, die
 * hochläuft, wird BEOBACHTET – und das ist bei einem Betrag, der die
 * Kaufentscheidung trägt, genau die Sekunde Aufmerksamkeit, um die es geht.
 *
 * EINMALIG, NICHT AM SCROLL GESCRUBBT (`once: true`). Das ist dieselbe
 * Entscheidung wie beim `Marker` und aus demselben Grund: Etwas, das beim
 * Zurückscrollen wieder verschwindet, ist ein Effekt; etwas, das einmal
 * passiert und dann steht, ist eine Aussage. Eine Zahl, die beim Hoch- und
 * Runterscrollen mitzählt, wirkt zudem wie ein kaputtes Messgerät.
 *
 * KEINE ÄNDERUNG AM MARKUP NÖTIG * Der Endwert wird aus dem gerenderten Text GELESEN, nicht als Prop
 * übergeben. Das hat einen handfesten Grund: Der Text im Markup bleibt damit
 * die einzige Quelle. Eine zweite Angabe (`data-count="21000"`) neben dem
 * sichtbaren „21.000 €" wäre ein Wert, der beim nächsten Textwechsel
 * lautlos falsch wird – und niemand prüft eine Zahl, die man nicht sieht.
 *
 * Erkannt wird die erste Zahlengruppe, der Rest der Zeichenkette bleibt
 * unangetastet:
 *   „21.000 €"  → zählt 21000, zeigt „21.000 €"
 *   „+ 20 %"    → zählt 20,    zeigt „+ 20 %"
 *   „5,0"       → zählt 5,     zeigt „5,0" (eine Nachkommastelle)
 *   „24 Std."   → zählt 24,    zeigt „24 Std."
 *
 * DAS ELEMENT BRAUCHT `tabular-nums`. Mit proportionalen Ziffern ändert
 * sich die Breite bei jedem Zwischenwert, und die Zahl zappelt, statt zu
 * laufen. Auf der ganzen Seite steht dafür `[font-variant-numeric:tabular-nums]`
 * an den Kennzahlen – wer eine neue anlegt, muss es mitnehmen.
 *
 * @returns Cleanup – im matchMedia-Callback zurückgeben.
 */
export function countUp(
  selector: string,
  options: { start?: string; duration?: number } = {},
): () => void {
  const { start = "top 88%", duration = 1.6 } = options;
  const tweens: gsap.core.Tween[] = [];

  gsap.utils.toArray<HTMLElement>(selector).forEach((el) => {
    const vorlage = el.textContent ?? "";
    const treffer = vorlage.match(/\d[\d.,]*/);
    if (!treffer) return;

    const roh = treffer[0];
    // Deutsche Schreibweise: Punkt trennt Tausender, Komma die Dezimalen.
    const ziel = Number(roh.replace(/\./g, "").replace(",", "."));
    if (!Number.isFinite(ziel)) return;

    const nachkomma = (roh.split(",")[1] ?? "").length;
    const formatiere = new Intl.NumberFormat("de-DE", {
      minimumFractionDigits: nachkomma,
      maximumFractionDigits: nachkomma,
    });

    const zaehler = { wert: 0 };

    tweens.push(
      gsap.to(zaehler, {
        wert: ziel,
        duration,
        ease: EASE_SOFT,
        scrollTrigger: { trigger: el, start, once: true },
        onUpdate: () => {
          el.textContent = vorlage.replace(roh, formatiere.format(zaehler.wert));
        },
        /* Am Ende die Ausgangszeichenkette zurückschreiben statt den
           formatierten Endwert stehen zu lassen: `Intl` und die Vorlage
           können in Kleinigkeiten auseinanderliegen (schmales Leerzeichen,
           fehlende Nachkommastelle), und die letzte Fassung ist die, die
           dauerhaft dasteht. Sie muss exakt das sein, was im Markup steht. */
        onComplete: () => {
          el.textContent = vorlage;
        },
      }),
    );
  });

  return () => {
    tweens.forEach((tween) => {
      tween.scrollTrigger?.kill();
      tween.kill();
    });
  };
}
