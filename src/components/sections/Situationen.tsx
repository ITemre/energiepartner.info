"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { cn } from "@/lib/utils";
import { BendLine } from "@/components/ui/BendLine";
import { maskedHeadline, maskedItems, revealItems } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * „Wo stehen Sie gerade?" – die Ausgangslage des Besuchers, nicht unsere
 * Technik. Er erkennt seinen eigenen Satz wieder und liest direkt darunter,
 * was daraufhin passiert.
 *
 * STELLUNG: hinter den Leistungen (Emre, 07.08.). Sie war lange der Einstieg
 * der Seite; jetzt ist sie die Zuordnung – erst zeigt „Unser Service. Ihr
 * Durchblick.", was es gibt, dann sagt diese Sektion, welche der vier Lagen
 * die eigene ist. Wer die Copy anfasst, schreibt sie also nicht mehr als
 * erste Begegnung mit dem Haus.
 *
 * Form: Die vier Sätze treppen über ein 12-Spalten-Feld nach unten, der Blick
 * zickzackt mit. Genau diese Suchbewegung ist die Aussage der Sektion. Vier
 * gleich große Kacheln hätten dasselbe gesagt und nichts davon gezeigt.
 *
 * KEINE NUMMERN MEHR. Vorher trug jeder Satz eine 01–04, und dieselbe
 * Nummerierung lief zusätzlich durch fünf weitere Sektionen – sechs
 * nummerierte Listen auf einer Seite. Bei einer echten Reihenfolge
 * (Beratung → Planung → Ausführung) kodiert die Ziffer etwas; hier sind es
 * Alternativen, keine Sequenz, die Ziffer war reine Dekoration. Und wenn
 * alles nummeriert ist, bedeutet Nummerierung nichts mehr. Die Staffelung
 * trägt die Struktur ohnehin allein.
 *
 * Abgrenzung zu den Testimonials: dort steht ein fertiges Urteil von außen.
 * Hier sind es unfertige eigene Gedanken. Beide arbeiten mit Zitaten, dürfen
 * sich aber nicht ähneln.
 */
const SITUATIONS = [
  {
    quote: "Die alte Heizung muss raus.",
    answer:
      "Wir prüfen, ob eine Wärmepumpe in Ihr Haus passt. Ehrlich, auch wenn die Antwort Nein lautet.",
  },
  {
    quote: "Das Dach ist frei, der Strom teuer.",
    answer:
      "Wir rechnen aus, was eine PV-Anlage bei Ihrem Verbrauch bringt und ob sich ein Speicher lohnt.",
  },
  {
    quote: "Wir bauen neu oder sanieren.",
    answer: "Wir planen Strom und Wärme zusammen, solange noch alles offen ist.",
  },
  {
    quote: "Ich weiß nicht, wo ich anfangen soll.",
    answer: "Wir sehen uns Ihr Haus an und sagen Ihnen, was sich zuerst lohnt.",
  },
] as const;

export function Situationen() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Die Trennlinien ziehen sich auf, bevor der Satz erscheint – das
        // liest sich wie ein Schnitt, der Platz für den Gedanken macht.
        gsap.utils.toArray<HTMLElement>("[data-s-rule]").forEach((rule) => {
          gsap.fromTo(
            rule,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.1,
              ease: "expo.out",
              scrollTrigger: { trigger: rule, start: "top 92%", once: true },
            },
          );
        });

        // Zitat in Zeilenmasken, Antwort rückt danach nach – je Block ein
        // eigener Trigger, damit die unteren nicht vorweggenommen werden.
        const cleanupQuotes = maskedItems("[data-s-quote]", { start: "top 88%" });
        revealItems("[data-s-answer]", { distance: 30, start: "top 90%" });

        const cleanupHead = maskedHeadline({
          headline: "[data-s-h2]",
          follow: "[data-s-eyebrow]",
          scrollTrigger: { trigger: scope.current, start: "top 78%", once: true },
        });

        return () => {
          cleanupQuotes();
          cleanupHead();
        };
      });
    },
    { scope },
  );

  return (
    <section ref={scope} data-nav-theme="light" className="bg-ep-paper">
      {/* `.ep-container` statt eines eigenen `max-w-[1240px] mx-auto`: Diese
          Sektion war einer von drei Container-Systemen auf der Seite und
          begann auf 1920 px bei 373 px, während Galerie und Gesamtsystem bei
          96 px anfingen. Der Blick musste bei jedem Wechsel neu suchen. */}
      <div className="ep-container py-20 sm:py-28">
        <div>
          <p data-s-eyebrow className="t-label text-ep-accent">
            Wo stehen Sie gerade?
          </p>
          <h2 data-s-h2 className="t-h2 mt-6 max-w-[22ch] text-ep-ink lg:max-w-none">
            Vier Ausgangslagen.{" "}
            <span className="text-ep-navy">Ein Ansprechpartner.</span>
          </h2>
        </div>

        {/* Abstände deutlich enger als vorher (gap-y-24 → gap-y-16).
            Die Sektion brauchte 1,9 Bildschirme für vier kurze Sätze, weil
            zwischen ihnen jeweils fast eine halbe Bildschirmhöhe Nichts
            stand. Weißraum wirkt gegen eine Kante – hier lief er einfach
            aus. Die Staffelung braucht Abstand, aber sie braucht ihn quer,
            nicht längs. */}
        {/* `t-loud` hebt den Pegel NUR dieser Liste, nicht der Sektion: Die
            Zitate sind hier der Inhalt, nicht eine Zwischenüberschrift über
            Inhalt. Sie standen auf 46 px unter einer 76-px-Headline und
            wirkten dadurch wie eine Bildunterschrift zu sich selbst. Die
            Headline bleibt bewusst außen vor – die Hierarchie stimmt
            weiterhin, der Abstand wird nur kleiner. */}
        <div className="t-loud mt-14 flex flex-col gap-y-14 sm:mt-20 lg:gap-y-20">
          {SITUATIONS.map(({ quote, answer }, i) => (
            /* Wrapper trägt den Versatz, damit pro Element nur eine Quelle
               in die Transform schreibt. Der Drift läuft nach außen – die
               linken Blöcke wandern beim Scrollen nach links, die rechten
               nach rechts. Die Sätze gehen also auseinander, statt brav in
               der Spur zu bleiben. */
            /* ZWEI KANTEN STATT ZWÖLF SPALTEN.
               Vorher lagen die vier Blöcke in überlappenden Rasterspalten
               (col-start 1/6/2/5). Auf dem breiten Container hieß das:
               Trennlinie über 1011 px, Text darunter 440 px – jeder Block
               klebte links in seinem eigenen Rahmen, und die Sektion wirkte
               dadurch aus der Mitte gerutscht.
               Jetzt hat jeder Block eine feste Breite und eine echte Kante:
               ungerade links am Seitenrand, gerade rechts am Seitenrand. Die
               Komposition ist damit um die Seitenachse symmetrisch, die
               Trennlinie endet dort, wo der Text endet, und der Zickzack –
               der eigentliche Punkt der Sektion – wird stärker statt
               schwächer. */
            <article
              key={quote}
              className={cn(
                "w-full lg:max-w-[46rem]",
                i % 2 === 1 && "lg:ml-auto lg:text-right",
              )}
            >
              <div
                data-parallax={[16, 8, 20, 10][i]}
                data-drift={[20, -20, 16, -18][i]}
              >
                <BendLine data-s-rule className="origin-left text-ep-line" />

                <p data-s-quote className="t-quote mt-7 text-ep-ink">
                  „{quote}&ldquo;
                </p>

                {/* Die Antwort steht eingerückt und kleiner: sie ist die
                    Reaktion auf den Satz, nicht gleichrangig mit ihm. */}
                {/* Der Akzentstrich sitzt immer an der Kante, an der auch
                    der Block hängt – rechts ausgerichtete Blöcke bekommen ihn
                    rechts. Ein linker Strich an einem rechtsbündigen Absatz
                    liest sich sonst wie ein Fehler. */}
                <p
                  data-s-answer
                  className={cn(
                    "mt-5 max-w-[46ch] text-base leading-relaxed text-ep-ink/75 sm:text-lg",
                    i % 2 === 1
                      ? "border-r-2 border-ep-accent pr-5 lg:ml-auto"
                      : "border-l-2 border-ep-accent pl-5",
                  )}
                >
                  {answer}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
