"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { BendLine } from "@/components/ui/BendLine";
import { maskedHeadline, revealItems } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * Der Pacing-Absatz – freigegebene Kundencopy, wörtlich zu übernehmen
 * (Projekt-Briefing, Abschnitt 5).
 *
 * Verkaufspsychologisch ist das ein Pacing-Satz: zwei Aussagen, denen der
 * Leser nicht widersprechen kann, bevor überhaupt etwas behauptet wird.
 * Genau deshalb steht er hier ganz allein auf der Fläche und nicht als
 * Fließtext neben drei Argumenten – seine Wirkung hängt daran, dass man ihn
 * zu Ende liest und dabei nickt.
 *
 * Er trägt kein Bild und keine Kachel. Die Sektion besteht aus dem Satz und
 * zwei Haarlinien, sonst nichts.
 *
 * MITTIG, UND ZWAR ALS EINZIGE * Die Seite setzt sonst überall linksbündig an der Datenblatt-Achse. Diese
 * Sektion nicht, und der Bruch ist der Punkt: Ein Pacing-Satz behauptet
 * nichts und belegt nichts, er hält den Lauf der Seite kurz an. Mittig hat
 * er keine Kante, an der ein Blick weiterlaufen könnte – man liest ihn zu
 * Ende oder gar nicht.
 *
 * Linksbündig auf voller Containerbreite war er dagegen nur angeschlagen:
 * eine Textsäule links, rechts zwei Drittel leere Fläche, ohne dass diese
 * Leere etwas bedeutet hätte.
 *
 * Deshalb wachsen auch die Haarlinien aus der MITTE (`origin-center`)
 * statt von links. Eine Linie, die von links einfährt, während der Text
 * mittig steht, ist die alte Achse, die durch die Hintertür zurückkommt.
 */
const SATZ = [
  "Sie sind sicherlich nicht der Erste und nicht der Letzte.",
  "Unter Umständen haben Sie es satt, so viele Angebote einzuholen und am Ende den Überblick zu verlieren.",
] as const;

export function AvPacing() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-p-rule]").forEach((rule) => {
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

        /* Signatur und Abschluss steigen nacheinander ein – der Name ZUERST
           und getrennt vom Zitat: Er ist die Auflösung der Frage „wer sagt
           das?", und die stellt sich erst, wenn der Satz gelesen ist. */
        revealItems("[data-p-quelle], [data-p-schluss]", {
          distance: 22,
          start: "top 90%",
        });

        return maskedHeadline({
          headline: "[data-p-satz]",
          scrollTrigger: { trigger: scope.current, start: "top 74%", once: true },
        });
      });
    },
    { scope },
  );

  return (
    /* `border-t-2 border-ep-accent` seit dem 08.09. Der Hero darüber ist
       seither ebenfalls Papier – ohne gezeichnete Kante liefen erstes Bild
       und zweiter Abschnitt in eine Fläche zusammen. Die Kante ist zugleich
       das Zeichen, dass der Funnel oben zu Ende ist. Dieselbe Lösung wie an
       der Förderung auf energiepartner.info.

       Polster von `py-24 sm:py-36` auf `py-20 sm:py-28`: Die Sektion war
       gemessen 957 px hoch für zwei Sätze, davon rund eine halbe
       Bildschirmhöhe leeres Papier vor dem Zitat. Mittig gesetzt bleibt sie –
       das ist begründet und richtig –, nur das Polster war zu groß. */
    <section
      ref={scope}
      data-nav-theme="light"
      className="border-t-2 border-ep-accent bg-ep-paper"
    >
      <div className="ep-container py-20 sm:py-28">
        <BendLine data-p-rule className="origin-center text-ep-line" />

        {/* `figure`/`blockquote`/`figcaption` statt drei Absätzen: Der Satz
            IST jetzt ein Zitat, und die Zuordnung zum Sprecher gehört
            maschinenlesbar dazu – sonst steht unter einer Aussage ein Name,
            der technisch nichts mit ihr zu tun hat. */}
        <figure>
          {/* `max-w` steht auf dem Textelement selbst, nicht auf einem
              Wrapper: `ch` rechnet gegen die Schriftgröße DES Elements, an
              dem es notiert ist – auf einem Wrapper mit geerbten 16 px wäre
              das ein Bruchteil der beabsichtigten Breite.

              `mx-auto` gehört aus demselben Grund an dasselbe Element: Was
              zentriert wird, ist die Zeilenlänge, nicht der Container. */}
          <blockquote
            data-p-satz
            className="t-quote mx-auto mt-12 max-w-[24ch] text-center text-ep-ink sm:mt-16"
          >
            {/* Die Anführungszeichen machen aus der Ansprache eine Aussage
                von jemandem. Der Wortlaut bleibt unangetastet – er ist vom
                Kunden freigegeben (Briefing 5). */}
            „{SATZ[0]}{" "}
            <span className="text-ep-navy">{SATZ[1]}</span>“
          </blockquote>

          {/* Der Name ist die EINZIGE Person auf dieser Seite, und er
              steht hier als Text, nicht als Foto. Das ist kein Detail:
              angebote-vergleichen.info ist laut Briefing (Abschnitt 3) die
              Strecke OHNE Personenfoto – das Porträt hat seinen einen
              Auftritt auf energiepartner.info. Eine Signatur widerspricht
              dem nicht, sie liefert im Gegenteil das, was ein Pacing-Satz
              braucht: jemanden, der ihn gesagt hat.

              Kein „Geschäftsführer" und kein „Energieexperte" darunter.
              Ilias vermittelt und koordiniert (Briefing 2), und ein Titel,
              den niemand geprüft hat, ist genau die Sorte Behauptung, die
              diese Seite sonst vermeidet. Ort und Marke reichen. */}
          <figcaption data-p-quelle className="mt-8 text-center sm:mt-10">
            <span className="block text-base font-semibold text-ep-ink">
              Ilias Zayakh
            </span>
            <span className="t-key mt-1 block text-ep-ink/55">
              energiepartner, Stuttgart
            </span>
          </figcaption>
        </figure>

        <div data-p-schluss className="mt-12 sm:mt-16">
          <BendLine className="origin-center text-ep-line" />
          <p className="mx-auto mt-8 max-w-[52ch] text-center text-lg leading-relaxed text-ep-ink/75">
            Wir nehmen Ihnen das Vergleichen nicht ab, indem wir ein weiteres
            Angebot dazulegen. Wir sehen uns das an, das Sie schon haben.
          </p>
        </div>
      </div>
    </section>
  );
}
