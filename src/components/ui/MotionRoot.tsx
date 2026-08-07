"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Globale Bewegungsebene – zwei Schichten, die über der ganzen Seite liegen.
 *
 * SCHICHT 1 · Versatz
 *   `data-parallax="<px>"` verschiebt gegen die Flussrichtung (y),
 *   `data-drift="<px>"` quer dazu (x). Positiv = das Element wandert beim
 *   Runterscrollen nach oben bzw. nach links. Nachbarn bekommen absichtlich
 *   unterschiedliche Werte; dieser Versatz ist der eigentliche Effekt. Ein
 *   einzelnes Element fällt nie auf, das Ensemble schon.
 *
 * SCHICHT 2 · Trägheit
 *   Eine gemeinsame Geschwindigkeitsquelle, zwei Ausdrucksformen – deshalb
 *   liest man es als ein Verhalten und nicht als zwei Effekte:
 *   `data-dance` neigt ein Element minimal in Scrollrichtung und lässt es
 *   zurückfedern – das Bild „hängt nach", wie Masse es täte.
 *   `data-bend` (siehe BendLine) lässt Haarlinien durchhängen und elastisch
 *   zurückschnappen. Da diese Seite ohne Bilder auskommt und fast
 *   ausschließlich aus Linien besteht, ist das ihr stärkster Materialeffekt.
 *
 * Konventionen:
 * - Versatz bewegt `x`/`y`, Reveals bewegen `yPercent` (siehe lib/motion.ts).
 *   GSAP hält beides getrennt, sie können sich also nicht überschreiben.
 * - `data-dance` und `data-parallax` gehören NICHT auf dasselbe Element,
 *   sondern auf Wrapper und Kind – dann schreibt pro Element nur eine Quelle
 *   in die Transform.
 * - Niemals in einem Pin, nicht auf `position: sticky`, nicht auf
 *   Trigger-Elementen und nicht auf Zellen, die Trennlinien tragen.
 * - Versatz 8–28 px. Alles darüber wirkt schnell wie ein Fehler.
 *
 * Auf schmalen Viewports laufen alle Wege auf 45 % zusammen: die sichtbare
 * Strecke ist dort kürzer, dieselben Werte würden übertrieben wirken.
 */

/** Maximale Neigung in Grad. Bewusst niedrig – die Zielgruppe sind
 *  Eigenheimbesitzer, keine Design-Jury. Ab etwa 4° kippt der Eindruck von
 *  „lebendig" zu „kaputt". */
const SKEW_MAX = 2;

/** Maximaler Durchhang der Linien in Pixeln (Scheitel der Kurve). */
const BEND_MAX = 16;

export function MotionRoot() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    /* ---------- Neuvermessung, sobald die Schrift steht ----------
       Der wichtigste Fix an dieser Datei, und er ist unsichtbar bis er fehlt.

       Die Seite misst ihre Scroll-Positionen beim Mounten – da läuft aber
       noch die Fallback-Schrift. Sobald Archivo geladen ist, ändern sich
       Zeilenumbrüche und damit die Höhen praktisch jeder Überschrift; dazu
       baut SplitText (das ebenfalls an `document.fonts.ready` hängt) die
       Headlines in Zeilenmasken um. Alles darunter rutscht.

       Ohne eine Neuvermessung rechnen die Pins danach mit veralteten
       Positionen. Sichtbar wurde das am Übergang von den Leistungen zur
       Bildstrecke: Die Galerie hat sich rund 600 px zu früh festgesetzt und
       damit über die letzte, noch sichtbare Leistungskarte gelegt – es sah
       aus, als würde die Seite springen.

       Zwei verschachtelte `requestAnimationFrame`: Die SplitText-Aufrufe der
       Sektionen hängen an derselben `fonts.ready`-Promise wie dieser Callback.
       Ein einzelner Frame reicht nicht sicher, um sie alle durchlaufen zu
       lassen – gemessen werden darf erst, wenn das Markup endgültig steht. */
    let raf1 = 0;
    let raf2 = 0;
    document.fonts.ready.then(() => {
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => ScrollTrigger.refresh());
      });
    });

    const mm = gsap.matchMedia();

    mm.add(
      {
        wide: "(min-width: 640px) and (prefers-reduced-motion: no-preference)",
        narrow: "(max-width: 639px) and (prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const { narrow } = context.conditions as { narrow: boolean };
        const factor = narrow ? 0.45 : 1;

        /* ---------- Schicht 1: Versatz ---------- */
        gsap.utils
          .toArray<HTMLElement>("[data-parallax], [data-drift]")
          .forEach((el) => {
            const y = Number(el.dataset.parallax ?? 0) * factor;
            const x = Number(el.dataset.drift ?? 0) * factor;
            if (!y && !x) return;

            gsap.fromTo(
              el,
              { y, x },
              {
                y: -y,
                x: -x,
                ease: "none",
                scrollTrigger: {
                  trigger: el,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.8,
                  invalidateOnRefresh: true,
                },
              },
            );
          });

        return;
      },
    );

    /* ---------- Schicht 2: Trägheit – nur Zeigergeräte ----------
       Beides schreibt bei jedem Frame in Inhalte, die neu gerastert werden
       müssen: der Skew verzerrt Textblöcke, der Bend schreibt das
       `d`-Attribut von SVG-Pfaden neu. Auf dem Desktop ist das nicht
       spürbar. Auf dem Handy schon – und zwar doppelt: Die Rasterleistung
       ist geringer, und beim Daumen-Scrollen steht die Geschwindigkeit
       praktisch dauerhaft am Anschlag, die Effekte laufen also durchgehend
       statt in kurzen Spitzen. Der Zugewinn ist auf der Fläche eines
       Handydisplays zugleich am kleinsten. */
    mm.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        const dancers = gsap.utils.toArray<HTMLElement>("[data-dance]");
        const benders = gsap.utils.toArray<SVGPathElement>("[data-bend]");
        if (!dancers.length && !benders.length) return;

        /* Die Abfrage oben lässt schon durch, wenn NUR Linien da sind – auf
           angebote-vergleichen.info ist genau das der Fall (BendLines, aber
           kein `data-dance`). `gsap.set` auf einer leeren Liste meldet dann
           „GSAP target not found" in die Konsole. Harmlos, aber eine Warnung,
           die bei jedem Seitenaufruf steht, verdeckt irgendwann eine echte. */
        let setSkew: ReturnType<typeof gsap.quickSetter> | null = null;
        if (dancers.length) {
          gsap.set(dancers, { transformOrigin: "right center", force3D: true });
          setSkew = gsap.quickSetter(dancers, "skewY", "deg");
        }

        const clampSkew = gsap.utils.clamp(-SKEW_MAX, SKEW_MAX);
        const clampBend = gsap.utils.clamp(-BEND_MAX, BEND_MAX);

        // Ein gemeinsamer Proxy für beide Größen. Wichtig: die zwei Tweens
        // laufen auf demselben Objekt, deshalb `overwrite: "auto"` – ein
        // hartes `true` würde jeweils den anderen mit abräumen.
        const proxy = { skew: 0, bend: 0 };

        // Der Scheitel einer quadratischen Bézier liegt auf halber Höhe des
        // Kontrollpunkts, deshalb der Faktor 2: `bend` ist damit direkt der
        // Durchhang in Pixeln.
        const drawBend = () => {
          const d = `M0 0.5 Q 50 ${0.5 + proxy.bend * 2} 100 0.5`;
          benders.forEach((path) => path.setAttribute("d", d));
        };

        ScrollTrigger.create({
          onUpdate: (self) => {
            const velocity = self.getVelocity();

            // Jeweils nur übernehmen, wenn stärker als die laufende
            // Rückfederung – sonst stößt jedes Tick die Erholung neu an und
            // die Auslenkung bleibt hängen, statt zurückzuschnappen.
            const skew = clampSkew(velocity / -420);
            if (setSkew && Math.abs(skew) > Math.abs(proxy.skew)) {
              proxy.skew = skew;
              gsap.to(proxy, {
                skew: 0,
                duration: 0.7,
                ease: "power3",
                overwrite: "auto",
                onUpdate: () => setSkew(proxy.skew),
              });
            }

            // Nach unten scrollen heißt: die Enden werden nach oben gezogen,
            // die Mitte hängt nach – also Durchhang nach unten, positiv.
            const bend = clampBend(velocity / 450);
            if (benders.length && Math.abs(bend) > Math.abs(proxy.bend)) {
              proxy.bend = bend;
              gsap.to(proxy, {
                bend: 0,
                duration: 1.1,
                ease: "elastic.out(1, 0.45)",
                overwrite: "auto",
                onUpdate: drawBend,
              });
            }
          },
        });
      },
    );

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      mm.revert();
    };
  }, []);

  return null;
}
