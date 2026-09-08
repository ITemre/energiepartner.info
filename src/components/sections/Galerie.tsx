"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { maskedHeadline, revealItems } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * Ihr Ansprechpartner – das Porträt als halber Bildschirm.
 *
 * DIE BILDSTRECKE IST WEG (11.08.) * Diese Datei hatte zwei Akte: fünf Anlagenfotos als Raster („In Bildern.
 * Vom Dach bis in den Heizungskeller.") und danach das Porträt. Der erste
 * ist entfallen, und zwar weil ihm an einem Tag zweimal die Grundlage
 * entzogen wurde.
 *
 * Er bewies nichts: Die Fotos sind erzeugte Symbolbilder und trugen den
 * Hinweis darauf. Eine Strecke, die wie ein Referenzteil aussieht und
 * danebenschreibt, dass sie keiner ist, zahlt auf Vertrauen nicht ein. Und
 * seit im Hero ein echtes Haus mit PV, Wärmepumpe und Wallbox steht, sagt
 * ein Bild dort mehr als fünf erzeugte Einzelteile hier.
 *
 * Die Fotos sind nicht gelöscht, sie liegen jetzt als Hintergrund hinter
 * den passenden Karten in `Leistungen.tsx`. Dort leisten sie, was ein Bild
 * an dieser Stelle leisten soll: Zuordnung statt Beleg.
 *
 * DER DATEINAME PASST NICHT MEHR. „Galerie" heißt eine Sektion, die
 * keine mehr ist. Umbenennen kostet einen Import in `page.tsx` und wäre
 * sauberer – bewusst nicht gemacht, solange offen ist, ob echte
 * Anlagenfotos zurückkommen und die Strecke mit ihnen.
 *
 * WARUM DIE GEPINNTE REISE WEG IST (10.08.) * Hier lief eine gepinnte Szene: sechs Bilder starteten verstreut im Raum,
 * reihten sich beim Scrollen auf eine waagerechte Spur, fuhren seitlich
 * durch, und am Ende wuchs das Porträt auf eine halbe Bildschirmhälfte.
 * Gestalterisch war das der aufwendigste Teil der Seite.
 *
 * Gemessen hat er 6,37 Bildschirme gekostet – bei einer Gesamtseite von 17.
 * Ein Drittel der Seite für eine Bildstrecke, und genau das war es, was der
 * Kunde als „endloses Scrollen" zurückgemeldet hat. Horizontales Scrollen
 * hat dabei ein Problem, das man ihm nicht ansieht: Es entkoppelt Weg und
 * Fortschritt. Der Besucher scrollt und scrollt, die Seite bewegt sich
 * seitwärts, und sein Gefühl dafür, wie weit er noch muss, stimmt nicht
 * mehr. Deshalb wirkt eine gepinnte Strecke immer länger als sie ist.
 *
 * WAS GEBLIEBEN IST * Zwei Akte, jeder rund einen Bildschirm:
 *
 *   1. Die Anlagen als ruhiges Raster. Fünf Bilder, keine Bewegung außer
 *      dem Hereinblenden. Sie sind Beleg, kein Erlebnis – Symbolbilder
 *      (siehe Hinweis unten), und für Symbolbilder eine Choreografie zu
 *      bauen, war ohnehin überzogen.
 *
 *   2. Das Porträt mit dem Größerwerden. Das ist der eine Effekt, den der
 *      Kunde ausdrücklich behalten wollte, und er ist auch der einzige, der
 *      inhaltlich etwas tut: Aus einem Baustein unter Bausteinen wird ein
 *      Gesicht. Auf einer Vertrauensseite ist das der Moment, auf den alles
 *      zuläuft.
 *
 * ENTFALLEN sind zusätzlich die drei Fragen („Wer schaut sich Ihr Haus
 * an?" …). Sie waren die mobile Wirbelsäule der langen Reise, jede stand
 * allein auf einem halben Bildschirm. Ohne die Reise würden sie die
 * Sektion wieder aufblähen, und ihre Antwort steht im Schlusssatz ohnehin.
 *
 * DIE ANLAGENFOTOS SIND KI-GENERIERT (07.08.2026, Freigabe Emre) und
 * zeigen keine Anlagen von Ilias. Der Hinweis unter der Überschrift muss
 * deshalb stehen bleiben – sonst wäre es eine Irreführung über eigene
 * Leistungen (UWG). An der Rechtslage ändert die Quelle nichts: Ein
 * Stockfoto einer fremden Anlage und ein erzeugtes Bild sind beide keine
 * Referenz.
 *
 * Die frühere Regel „keine KI-Bilder" gilt weiterhin für MENSCHEN – deshalb
 * ist `g5-handwerk` Stockmaterial und `g6-ilias-frei` das echte Porträt.
 * Gesichter sind der eine Fall, in dem Erzeugtes wirklich schadet.
 *
 * Sobald Bilder echter Anlagen von Ilias vorliegen, ersetzen sie das
 * Material und der Hinweis kann weg.
 */

const PORTRAET = {
  src: "/galerie/g6-ilias-frei.webp",
  alt: "Ilias Zayakh, energiepartner",
} as const;

export function Galerie() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        revealItems("[data-gal-item]", { distance: 28, start: "top 88%" });
        revealItems("[data-gal-outro]", { distance: 24, start: "top 85%" });

        /* DAS GRÖSSERWERDEN – der eine Effekt, der bleiben sollte.
           Als Scrub und nicht als einmalige Bewegung: Der Besucher zieht
           das Bild selbst auf, statt ihm beim Wachsen zuzusehen. Das ist
           der Unterschied zwischen einer Animation und einer Reaktion.

           `scale` und nicht `width`/`height`: Eine Transformation läuft auf
           der GPU und löst kein Layout aus. Über die Breite animiert würde
           der Text daneben bei jedem Frame neu umbrechen.

           Von 0.86 und nicht von 0.5: Der Sprung soll als Näherkommen
           lesbar sein, nicht als Zoom. Alles darunter wirkt wie ein
           Bildfehler beim Laden. */
        gsap.fromTo(
          "[data-gal-portraet]",
          { scale: 0.86 },
          {
            scale: 1,
            ease: "none",
            force3D: true,
            scrollTrigger: {
              trigger: "[data-gal-portraet-rahmen]",
              start: "top 85%",
              end: "center center",
              scrub: 0.6,
            },
          },
        );

        return maskedHeadline({
          headline: "[data-gal-h2]",
          follow: "[data-gal-eyebrow]",
          scrollTrigger: { trigger: scope.current, start: "top 78%", once: true },
        });
      });
    },
    { scope },
  );

  return (
    /* Zwei `<section>` in einem Fragment wären zwei Bänder für die
       Kopfleiste – beide hell, also derselbe Zustand. Ein gemeinsamer
       Wrapper mit einem `data-nav-theme` reicht und spart einen
       ScrollTrigger. */
    <div ref={scope} data-nav-theme="light" className="bg-ep-paper">
      {/* AKT 2 · Der Mensch dahinter HALBER BILDSCHIRM, NICHT KACHEL NEBEN TEXT (11.08.).

          Beim Auflösen der gepinnten Reise war das hier ein Bildkasten von
          68svh mit Text daneben. Damit ging genau der Moment verloren, den
          der Kunde am stärksten fand: In der alten Fassung wuchs das
          Porträt am Ende auf eine volle Bildschirmhälfte, randlos, und die
          Aussage stand in der anderen Hälfte.

          Der Unterschied ist nicht die Größe, sondern die Kante. Ein Bild
          in einem Rahmen ist eine Abbildung; eines, das den Bildschirm
          zur Hälfte übernimmt, ist eine Begegnung. Auf einer
          Vertrauensseite, deren ganzer Punkt „hinter jeder Planung steht
          ein Name" ist, trägt das die Aussage.

          Der Sandgrund bleibt und füllt die rechte Hälfte. `ep-sand` ist
          laut Token-Datei nur als Einlage zulässig, nie als eigenes Band –
          genau das ist es hier. */}
      <section className="relative border-t border-ep-line bg-ep-sand/50 lg:h-svh lg:overflow-hidden">
        {/* DAS PORTRÄT.
            Mobil ein Bild im Fluss mit Radius, ab lg die linke Hälfte über
            die volle Höhe, randlos und ohne Radius. Ein Element, zwei
            Erscheinungsformen – nicht zwei `<Image>`, sonst lädt der
            Browser dasselbe Foto zweimal.

            `overflow-hidden` am Kasten, `scale` am Bild: Der Kasten behält
            seine Maße, das Bild wächst darin. Ohne das verschöbe die
            Skalierung den Text daneben. */}
        <div
          data-gal-portraet-rahmen
          className="relative mx-[var(--edge)] mt-20 aspect-[4/5] overflow-hidden rounded-ep bg-white sm:mt-24 sm:aspect-[3/2] lg:absolute lg:inset-y-0 lg:left-0 lg:m-0 lg:aspect-auto lg:w-1/2 lg:rounded-none"
        >
          <Image
            data-gal-portraet
            src={PORTRAET.src}
            alt={PORTRAET.alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-top will-change-transform"
          />
        </div>

        {/* DIE AUSSAGE.
            Ab lg in der rechten Hälfte, vertikal zentriert.

            Bewusst OHNE `ep-container`: Die Klasse steht in globals.css
            außerhalb jeder Layer und setzt `width: 100%`. Ungelayertes CSS
            gewinnt in der Kaskade gegen Tailwinds `@layer utilities` –
            `lg:w-1/2` käme also nicht durch, und der Text läge quer über
            dem Foto statt daneben. Die Randabstände stehen deshalb hier
            direkt.

            `lg:pt-[var(--nav-h)]`: Der Text zentriert sich damit in
            derselben Fläche wie das Foto daneben, nämlich unterhalb der
            fixen Kopfleiste. Ohne den Abzug säße er eine halbe Leistenhöhe
            zu hoch, und das sieht man sofort, weil das Foto direkt daneben
            die Kante zieht. */}
        <div className="px-[var(--edge)] pb-20 pt-10 sm:pb-24 lg:absolute lg:inset-y-0 lg:right-0 lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:px-0 lg:pb-0 lg:pl-[5vw] lg:pr-[6vw] lg:pt-[var(--nav-h)]">
          <p data-gal-outro className="t-label text-ep-accent">
            Ihr Ansprechpartner
          </p>
          {/* HIER STAND „Hinter jeder Planung steht ein Name." (12.08.
              durch den Namen ersetzt).

              Der Satz war die Behauptung, der Name ist die Einlösung. Auf
              einer Vertrauensseite, deren Foto den Menschen bereits in
              halber Bildschirmgröße zeigt, ist eine Umschreibung schwächer
              als die Sache selbst – man liest erst einen Werbesatz und sucht
              den Namen dann im Fließtext darunter.

              Der alte Satz ist damit nicht verloren: Er ist das PRINZIP der
              Sektion und steht als solches in diesem Kommentar. Auf der
              Seite steht jetzt, wer gemeint ist. */}
          <h3
            data-gal-outro
            className="mt-5 max-w-[14ch] text-[min(clamp(2.25rem,4.4vw,5rem),9svh)] font-bold leading-[1.04] tracking-[-0.035em] text-ep-ink"
          >
            Ilias Zayakh
          </h3>
          {/* Der Name ist aus dem Absatz raus, er steht jetzt darüber.
              „Stuttgart." allein als Auftakt ist kein Versehen, sondern
              derselbe knappe Ton wie vorher („Ilias Zayakh, Stuttgart."). */}
          <p data-gal-outro className="t-lead mt-6 max-w-[40ch] text-ep-ink/75">
            Stuttgart. Wir beraten persönlich, planen anbieterübergreifend
            und koordinieren die Ausführung mit geprüften Fachbetrieben.
          </p>
        </div>
      </section>
    </div>
  );
}
