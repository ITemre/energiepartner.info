"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { maskedHeadline, revealItems } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * Ablauf – die sechs Schritte als randloses Raster über den ganzen Schirm.
 *
 * WARUM DER INHALT ZENTRIERT STEHT UND NICHT AUSEINANDERGEZOGEN * Eine frühere Fassung setzte die Zelle auf `justify-between`: Ziffer an die
 * Oberkante, Titel an die Unterkante, dazwischen Luft. Der Gedanke war eine
 * durchgehende Ziffernlinie über die ganze Reihe.
 *
 * In einer Zelle von rund 450 px Höhe ergibt das ein Loch von 200 px in der
 * Mitte – die Karte sieht leer aus, nicht großzügig. Weißraum wirkt nur
 * dann als Gestaltung, wenn er AUSSEN liegt; innerhalb einer Gruppe liest
 * er sich als fehlender Inhalt.
 *
 * Jetzt ein zusammenhängender Block, mittig. Ziffer, Strich und Titel
 * gehören zusammen und stehen auch so da. Denselben Ort nimmt die Rückseite
 * ein, damit beim Umdrehen nichts springt.
 *
 * Die Trennlinien entstehen über `gap-px` auf farbigem Grund und nicht über
 * Rahmen an den Zellen: Rahmen ergeben an jeder Innenkante zwei Striche
 * übereinander.
 *
 * DAS UMDREHEN * Vorderseite Ziffer und Titel, Rückseite der Erklärtext auf Navy.
 *
 * Der Farbwechsel ist die eigentliche Rückmeldung. Eine Drehung sieht man
 * nur, während sie läuft – danach stünde wieder eine helle Zelle da und man
 * wüsste nicht mehr, welche man geöffnet hat.
 *
 * MEHRERE DÜRFEN OFFEN SEIN. Ein Raster ist kein Karussell: Wer Schritt
 * zwei und fünf vergleichen will, soll beide offen lassen können.
 *
 * `backface-visibility: hidden` NIMMT NICHTS AUS DEM BAUM. Die abgewandte
 * Seite ist optisch weg, für Vorlesesoftware aber weiterhin da – deshalb
 * zusätzlich `aria-hidden`, gesteuert vom Zustand.
 *
 * AUF DEM HANDY DIESELBEN KARTEN, NUR EINSPALTIG * Eine Zwischenfassung hatte dort ein Aufklapp-Accordion. Das war ein
 * zweites Bedienmuster für dieselbe Sache, und Aufklapplisten sind auf
 * einer Seite wie dieser der ältere, langweiligere Weg.
 *
 * Einspaltig hat jede Karte die volle Breite und rund 355 px Höhe – mehr
 * Platz als jede Zelle auf dem Desktop. Die Drehung funktioniert dort
 * dadurch besser als im Raster, nicht schlechter.
 *
 * FREIGABE STEHT AUS. Schritte und Texte sind ein Entwurf von Corivo,
 * kein abgestimmter Kundentext.
 */
const SCHRITTE = [
  {
    titel: "Auftrag und Unterlagen",
    text: "Sie unterschreiben einmal. Danach sammeln wir, was gebraucht wird: Zählerstände, Grundriss, Fotos vom Heizungsraum.",
  },
  {
    titel: "Termin vor Ort",
    text: "Aufmaß, Aufstellort, Leitungswege, Elektroanschluss. Wir sind dabei, damit Sie nicht allein mit dem Monteur dastehen.",
  },
  {
    titel: "Förderung und Anmeldung",
    text: "Förderantrag, Netzbetreiber, Marktstammdatenregister. Die Anträge stellen wir, Sie unterschreiben nur, wo es sein muss.",
  },
  {
    titel: "Installationstermin",
    text: "Sie bekommen ein Datum. Keine Ankündigung, dass sich irgendwann jemand melden wird.",
  },
  {
    titel: "Einbau und Inbetriebnahme",
    text: "Der Fachbetrieb baut ein, wir begleiten. Ihr Ansprechpartner bleibt derselbe wie am ersten Tag.",
  },
  {
    titel: "Abnahme und Einweisung",
    text: "Gemeinsame Abnahme, Einweisung in die Anlage, Protokoll und Dokumentation. Den Förderabruf übernehmen wir.",
  },
] as const;

/* HIER STAND EIN ZAHLWORT-HELFER („Sechs"), der die Anzahl aus der
   Liste ableitete. Er ist mit der neuen Überschrift entfallen: Sie nennt
   keine Anzahl mehr, also kann sie auch nicht mit der Liste auseinander
   laufen. Falls je wieder eine Zahl in die Überschrift soll – als ZIFFER
   schreiben („6 Schritte"), nicht ausgeschrieben. */

/** Innenmaß beider Seiten. Muss identisch sein, sonst springt der Inhalt
 *  beim Umdrehen. */
const POLSTER = "px-8 py-10 xl:px-12";

export function Ablauf() {
  const scope = useRef<HTMLElement>(null);
  const [offen, setOffen] = useState<ReadonlySet<number>>(new Set());

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        revealItems("[data-abl-zelle]", { distance: 18, start: "top 88%" });

        return maskedHeadline({
          headline: "[data-abl-h2]",
          follow: "[data-abl-eyebrow]",
          scrollTrigger: { trigger: scope.current, start: "top 78%", once: true },
        });
      });
    },
    { scope },
  );

  function drehe(i: number) {
    setOffen((alt) => {
      const neu = new Set(alt);
      if (neu.has(i)) neu.delete(i);
      else neu.add(i);
      return neu;
    });
  }

  return (
    <section
      ref={scope}
      id="ablauf"
      data-nav-theme="light"
/* `scroll-mt` UND `lg:pt` SIND BEIDE PFLICHT, und beide fehlten.
         Die Kopfleiste liegt `fixed` ÜBER dem Inhalt:

         · Ohne `scroll-mt` landet beim Sprung über den Menüpunkt „Ablauf"
           die Oberkante der Sektion auf y=0 – die erste Kartenreihe liegt
           dann unter der Leiste.
         · Ohne `lg:pt` reicht das Raster über die volle Bildschirmhöhe,
           obwohl die obersten 76 px verdeckt sind. Die obere Reihe wirkt
           dadurch enger als die untere, ohne dass ein Wert daran schuld
           wäre. Mit `box-border` zählt das Polster in die `h-dvh` hinein,
           beide Reihen teilen sich also sauber die SICHTBARE Höhe. */
      className="scroll-mt-[var(--nav-h)] bg-ep-paper lg:flex lg:h-dvh lg:flex-col lg:pt-[var(--nav-h)]"
    >
      {/* EIN RASTER FÜR ALLE BREITEN, keine zweite Variante.
          Darunter eine Spalte, ab lg drei mal zwei. Die Karten drehen sich
          überall gleich – ein Aufklapp-Accordion für Mobil wäre ein zweites
          Bedienmuster für dieselbe Sache gewesen.

          DIE HÖHE KOMMT UNTER lg VON DER KARTE, NICHT VON DER SEKTION.
          Sechs Karten in einer Spalte auf einem Bildschirm wären je 140 px
          hoch – zu wenig für Ziffer, Titel und den Text der Rückseite.
          Deshalb greift `h-dvh` erst ab lg, darunter gibt `min-h` je Karte
          das Maß und die Sektion scrollt. */}
      {/* KOPF Im Container, während das Raster darunter randlos läuft. Das ist
          Absicht: Der Kopf gehört zur Seite und fluchtet mit allen anderen
          Sektionen, das Raster ist eine Fläche und hat keinen Rand.

          `shrink-0` plus `flex-1` am Raster: Der Kopf nimmt, was er
          braucht, das Raster den Rest. Ohne das teilen sich beide die Höhe
          gleichmäßig und die Karten verlieren ein Drittel. */}
      <div className="ep-container shrink-0 pt-16 sm:pt-20 lg:py-[clamp(1rem,3svh,2.5rem)]">
        <p data-abl-eyebrow className="t-label text-ep-accent">
          Der Ablauf
        </p>
        <h2
          data-abl-h2
          className="t-h2 mt-3"
          /* Höhendeckel wie in der Förderung: `.t-h2` skaliert nur mit der
             Breite. Ohne den Deckel frisst die Überschrift auf einem flachen
             Fenster die Höhe, die das Raster braucht. */
          style={{ fontSize: "min(clamp(1.75rem,3.4vw,3.5rem),8svh)" }}
        >
          {/* FESTE UMBRÜCHE, keine zufälligen. Vorher deckelte ein
              `max-w-[16ch]` die Zeile, und der Bruch fiel genau vor das
              letzte Wort: „Zu Ihrer fertigen" / „Anlage." Ein Substantiv
              allein auf einer Zeile liest sich als Fehler.

              Zwei `block`-Zeilen statt einer Breitenbegrenzung: Der Bruch
              sitzt dort, wo auch die Farbe wechselt, und er sitzt auf jeder
              Fensterbreite gleich. Dasselbe Verfahren wie in der Förderung
              und im Hero. */}
          <span className="block">Zu Ihrer</span>
          <span className="block text-ep-navy">fertigen Anlage.</span>
        </h2>
      </div>

      {/* KEIN `gap`, DIE LINIEN SIND RÄNDER AN DEN KARTEN.
          Vorher trennte `gap-px` auf farbigem Grund. Das ist elegant und
          hier trotzdem falsch: Ein 1-px-Spalt verteilt sich über drei
          Spalten, und wenn die Containerbreite nicht durch drei teilbar
          ist, landet eine Spaltenkante auf einem halben Pixel. Der Browser
          rundet dann unterschiedlich – die Naht zwischen 02 und 03 wird
          breiter als die zwischen 01 und 02.

          Bei sechs hellen Karten sieht das niemand. Sobald eine umgedreht
          und damit navy ist, wird die Naht hochkontrastig und der
          Unterschied springt ins Auge.

          Ein Rahmen rendert dagegen immer exakt 1 px, unabhängig davon, wo
          das Element liegt. Deshalb: Rand LINKS an jeder Karte außer der
          ersten der Reihe, Rand OBEN an der zweiten Reihe. So trägt jede
          Naht genau einen Strich – doppelte Ränder gibt es nicht, weil nie
          beide Nachbarn denselben zeichnen.

          RAHMEN AUSSEN HERUM, DIESELBE HAARLINIE – ABER NICHT OBEN AUF
          DEM HANDY (13.08.). Links, rechts und unten reicht die `ep-line`-
          Haarlinie überall. Oben nicht: Genau das Problem, das weiter unten
          die 2-px-Orangekante zwischen den Karten begründet („eine 1-px-
          Linie in 16 % verschwindet"), gilt hier genauso – auf Papier gegen
          Papier ist die Kante über Karte 01 unsichtbar. Deshalb steht die
          Oberkante nicht hier am Container, sondern unten an Karte 01
          selbst, in derselben kräftigen Sprache wie die übrigen
          Mobil-Trennlinien. Ab lg übernimmt wieder die Haarlinie hier am
          Container (Orange ist dort schon durch `ProofBar`s eigene
          `border-y border-ep-accent/25` belegt, siehe deren Kommentar). */}
      <div className="mt-10 grid border-x border-b border-ep-line lg:mt-0 lg:min-h-0 lg:flex-1 lg:grid-cols-3 lg:grid-rows-2 lg:border-t">
        {SCHRITTE.map((schritt, i) => {
          const an = offen.has(i);
          return (
            <button
              key={schritt.titel}
              type="button"
              data-abl-zelle
              onClick={() => drehe(i)}
              aria-expanded={an}
              /* UNTER lg EINE ORANGE UNTERKANTE.
                Die Trennlinien des Rasters entstehen über `gap-px` auf
                `ep-line` (16 % Tinte). Zwischen zwei Spalten auf dem Desktop
                reicht das – einspaltig auf dem Handy nicht: Dort liegen sechs
                helle Karten direkt untereinander, und eine 1-px-Linie in 16 %
                verschwindet zwischen ihnen. Man sieht keine Karten mehr,
                sondern eine lange Fläche.

                2 px in Orange statt einer dunkleren Haarlinie, weil die
                Kante hier nicht nur trennen, sondern auch zeigen soll, dass
                jede Karte ein eigenes Element ist. Ab lg weg, dort trägt das
                Raster. */
              className={cn(
                "group relative min-h-[42svh] bg-ep-paper text-left outline-none [perspective:1600px] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ep-accent-strong lg:min-h-0",
                // Unter lg trennt die orange Unterkante, außer bei der
                // letzten Karte – sonst endet die Sektion mit einer Linie,
                // während sie ohne beginnt.
                "border-b-2 border-ep-accent-strong last:border-b-0 lg:border-b-0",
                // Dieselbe Kante zusätzlich OBEN an Karte 01 – siehe
                // Kommentar am Container, warum sie dort und nicht am
                // Container selbst steht.
                i === 0 && "max-sm:border-t-2 max-sm:border-ep-accent-strong",
                // Ab lg das Rasternetz: senkrecht vor jeder Karte außer der
                // ersten je Reihe, waagerecht vor der zweiten Reihe.
                i % 3 !== 0 && "lg:border-l lg:border-ep-line",
                i >= 3 && "lg:border-t lg:border-ep-line",
              )}
            >
              <div
                className={cn(
                  "relative h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [transform-style:preserve-3d] motion-reduce:transition-none",
                  an && "[transform:rotateY(180deg)]",
                )}
              >
                {/* VORDERSEITE */}
                <div
                  aria-hidden={an}
                  className={cn(
                    "absolute inset-0 flex flex-col justify-center bg-ep-paper [backface-visibility:hidden]",
                    POLSTER,
                  )}
                >
                  {/* `tabular-nums`: Sechs Ziffern in einem Raster – mit
                      proportionalen Ziffern stünde die 1 schmaler als die 4
                      und die Reihe fluchtet nicht. */}
                  <span className="block text-[clamp(2.5rem,4vw,5rem)] font-bold leading-[0.85] tracking-[-0.04em] text-ep-ink/30 transition-colors duration-300 [font-stretch:86%] [font-variant-numeric:tabular-nums] group-hover:text-ep-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Der kurze Strich ist die Auszeichnung der Marke,
                      dieselbe wie an den 22.400 € in der Förderung. Er
                      wächst beim Überfahren – die kleinste Bewegung, die
                      eine Fläche lebendig macht, ohne Text zu verschieben. */}
                  <span
                    aria-hidden="true"
                    className="mt-6 block h-0.5 w-10 bg-ep-accent-strong transition-[width] duration-300 group-hover:w-20"
                  />

                  <h3 className="mt-5 max-w-[15ch] text-[clamp(1.25rem,1.8vw,2rem)] font-semibold leading-[1.15] tracking-[-0.025em] text-ep-ink [font-stretch:92%] [hyphens:auto]">
                    {schritt.titel}
                  </h3>

                  {/* HINWEIS, DASS SICH DIE KARTE UMDREHEN LÄSST (13.08.).
                      Ein `<button>` ist semantisch klickbar, sieht aber wie
                      eine normale Karte aus – nichts an Ziffer, Strich und
                      Titel verrät, dass mehr dahinter steckt. `aria-hidden`,
                      weil der Button selbst schon `aria-expanded` trägt;
                      Vorlesesoftware braucht die zweite Ansage nicht.
                      Absolut positioniert statt im Fluss: Der Inhalt
                      darüber ist vertikal zentriert (`justify-center`), ein
                      normales Geschwisterelement würde also mittig
                      mitrutschen statt unten in der Ecke zu bleiben. */}
                  <span
                    aria-hidden="true"
                    className="absolute bottom-6 right-8 flex items-center gap-1.5 text-ep-ink/35 transition-colors duration-300 group-hover:text-ep-accent xl:bottom-8 xl:right-12"
                  >
                    <span className="text-[13px] font-medium">Mehr erfahren</span>
                    <Plus className="size-3.5" strokeWidth={2.5} />
                  </span>
                </div>

                {/* RÜCKSEITE Auf Navy, damit man von weitem sieht, welche Zelle offen
                    ist. `data-surface="dark"` sitzt bewusst HIER und nicht
                    am Karten-Root: Vorder- und Rückseite liegen gleichzeitig
                    im DOM (CSS-3D-Flip, `backface-visibility: hidden`), ein
                    Attribut am Root würde also auch die Papier-Vorderseite
                    umschalten.

                    Derselbe Aufbau wie vorn: Ziffer, Strich, Inhalt. Beim
                    Umdrehen bleiben Ziffer und Strich damit an Ort und
                    Stelle, es wechselt nur der Text darunter. */}
                <div
                  data-surface="dark"
                  aria-hidden={!an}
                  className={cn(
                    "absolute inset-0 flex flex-col justify-center bg-ep-navy text-white [backface-visibility:hidden] [transform:rotateY(180deg)]",
                    POLSTER,
                  )}
                >
                  <span className="block text-[clamp(2.5rem,4vw,5rem)] font-bold leading-[0.85] tracking-[-0.04em] text-white/25 [font-stretch:86%] [font-variant-numeric:tabular-nums]">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <span
                    aria-hidden="true"
                    className="mt-6 block h-0.5 w-10 bg-ep-accent-strong"
                  />

                  <p className="mt-5 max-w-[34ch] text-[clamp(0.9375rem,1.05vw,1.1875rem)] leading-[1.55] text-white/85">
                    {schritt.text}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

    </section>
  );
}
