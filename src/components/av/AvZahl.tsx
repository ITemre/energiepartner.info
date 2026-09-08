"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SITE } from "@/lib/site";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * „Die Zahl" – der Signature-Moment der Prüfstrecke.
 *
 * WAS SICH GEGENÜBER DEM GEPARKTEN ENTWURF GEÄNDERT HAT, und warum das der
 * ganze Punkt ist: Die Vorlage (`ZahlSequenz.tsx` im Alt-Repo) zählte von
 * einer Angebotssumme auf einen „fairen Vergleichspreis" HERUNTER und
 * begründete das mit einem Aufschlag über dem Marktschnitt. Das ist das
 * Preis-Framing, das der Kunde ausdrücklich nicht will – und es ist auch
 * das schwächere Argument: „billiger" kann jeder behaupten, und der Besucher
 * hat es schon dreimal gehört.
 *
 * Hier zählt die Zahl deshalb HOCH. Die Angebotssumme steht, der Scroll
 * deckt auf, was in dem Angebot NICHT enthalten ist, und die Summe wächst
 * mit jedem Fund. Am Ende steht nicht „zu teuer", sondern der Satz, der die
 * Positionierung trägt: das Angebot war unvollständig.
 *
 * Das ist dieselbe Mechanik, aber die umgekehrte Aussage – und es ist die
 * Erfahrung, die der Kunde beschreibt: Man unterschreibt eine Summe und
 * zahlt am Ende eine andere.
 *
 * ALLE WERTE SIND BEISPIELWERTE. Das steht sichtbar über der Zahl und nicht
 * als Fußnote: Eine Rechnung, die wie ein echter Fall aussieht, muss sich
 * als Beispiel zu erkennen geben (§ 5 UWG). Aus demselben Grund steht hier
 * keine Statistik über durchschnittliche Preisunterschiede – wir könnten
 * sie nicht belegen.
 */

/** Die Summe, die im Angebot steht. */
const ANGEBOT = 28400;

/** Was im Angebot steht. Unaufgeregt, das ist der ehrliche Teil. */
const ENTHALTEN = [
  { label: "Luft-Wasser-Wärmepumpe 10 kW", betrag: "18.900 €" },
  { label: "Montage und Inbetriebnahme", betrag: "6.400 €" },
  { label: "Pufferspeicher", betrag: "2.100 €" },
  { label: "Demontage der Altanlage", betrag: "1.000 €" },
] as const;

/**
 * Was fehlt – und WARUM es kein Extra ist.
 *
 * DIE BEGRÜNDUNG IST DER KERN DER SEKTION * Ohne sie stand hier vier Mal „nicht enthalten" plus ein Betrag, und der
 * Leser zog den naheliegenden Schluss: Da will jemand nachverkaufen. Genau
 * dieser Verdacht zerstört die Positionierung, denn die Leistung besteht
 * ja darin, ihn NICHT zu bedienen.
 *
 * Der Unterschied zwischen Aufpreis und Befund liegt in einer einzigen
 * Information: Muss der Kunde das ohnehin zahlen? Bei drei dieser vier
 * Positionen lautet die Antwort eindeutig ja – sie stehen nur nicht im
 * Angebot, tauchen dafür auf der Schlussrechnung auf. Das ist der ganze
 * Punkt, und deshalb steht es jetzt an jeder Zeile.
 *
 * FACHLICH VON ILIAS ABZUNEHMEN. Die Begründungen sind nach bestem
 * Wissen formuliert, aber sie sind technische Aussagen über sein Gewerk.
 * Insbesondere die Rohrreinigung ist der schwächste Punkt der vier: Sie ist
 * bei Altanlagen sinnvoll, aber nicht in jedem Fall zwingend. Wenn er sie
 * nicht als Pflichtposition verteidigen kann, gehört sie ersetzt – ein
 * Beispiel, das der Empfänger in dreißig Sekunden widerlegen kann, kostet
 * mehr Vertrauen als es aufbaut.
 *
 * Steigleitung und Rohrreinigung sind die vom Kunden vorgegebenen
 * Textbausteine (Projekt-Briefing, Abschnitt 5) und stehen deshalb zuerst.
 */
/* JEDE BEGRÜNDUNG MUSS AUF EINE ZEILE PASSEN – unter etwa 48 Zeichen.
   Die Sektion steht in einer Bühne von einer Bildschirmhöhe abzüglich
   Kopfleiste (`overflow-hidden`), und der
   Befund-Block liegt absolut über der Auflösung. Was über die Bühnenhöhe
   hinausgeht, wird nicht abgeschnitten, sondern läuft in die Fußnote
   darunter. Ein längerer Satz bricht auf 375 px um und kostet sofort 17 px –
   bei vier Positionen reicht das, um die Sektion zu zerlegen.
   Kurz ist hier ohnehin besser: „Sonst bleibt es oben kalt" sagt dasselbe
   wie „Ohne sie kommt die Wärme nicht in die oberen Räume", nur schneller. */
const FEHLT = [
  {
    label: "Steigleitung",
    betrag: 2400,
    warum: "Sonst bleibt es oben kalt.",
  },
  {
    label: "Reinigung der Rohre",
    betrag: 900,
    warum: "Schlamm kostet dauerhaft Leistung.",
  },
  {
    label: "Hydraulischer Abgleich",
    betrag: 1200,
    warum: "Pflicht für die Förderung.",
  },
  {
    label: "Elektroanschluss",
    betrag: 2000,
    warum: "Braucht einen eigenen Starkstromkreis.",
  },
] as const;

const LUECKE = FEHLT.reduce((summe, position) => summe + position.betrag, 0);
const ENDSUMME = ANGEBOT + LUECKE;

const fmt = (n: number) => Math.round(n).toLocaleString("de-DE");

export function AvZahl() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const zahl = scope.current?.querySelector<HTMLElement>("[data-z-wert]");

        gsap.set("[data-z-aufloesung]", { autoAlpha: 0 });

        /* Eine einzige gescrubbte Timeline über die ganze Sektionshöhe.
           Die Zahlen darin sind keine Sekunden, sondern Anteile der
           Scrollstrecke – die Timeline läuft von 0 bis 100. */
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: scope.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
          },
        });

        const zeige = (sel: string, ab: number, dauer = 6) =>
          tl.fromTo(
            sel,
            { y: 20, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: dauer, ease: "power2.out" },
            ab,
          );

        /* ---- Akt 1: die Summe steht ---- */
        tl.fromTo(
          "[data-z-block]",
          { scale: 0.92, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 8, ease: "power2.out" },
          2,
        );
        ENTHALTEN.forEach((_, i) => zeige(`[data-z-pos='${i}']`, 10 + i * 3.5));

        /* ---- Akt 2: die Lücken tauchen auf, der Zähler zählt sie ----

           HIER STAND EINE WACHSENDE EURO-SUMME, und das war ein Fehler
           im Kern der Sektion. Drei Bildschirme lang sah der Besucher eine
           riesige Zahl, die immer größer wurde – die Botschaft war „Ihre
           Kosten steigen". Das ist Angst, und zwar die unbrauchbare Sorte:
           Sie hält jemanden davon ab, sich mit der Sache zu beschäftigen,
           statt ihn zum Handeln zu bringen. Ausgerechnet auf der Seite von
           jemandem, der GERADE ein Angebot bekommen hat.

           Jetzt zählt die große Zahl die GEFUNDENEN LÜCKEN: 0, 1, 2, 3, 4.
           Dieselbe Mechanik, dieselbe Kopplung an den Fund – aber eine 4
           bedroht niemanden. Sie ist ein Befund, und Befunde sind genau das,
           was hier verkauft wird. Der Euro-Betrag verschwindet nicht, er
           steht in der Auflösung als Nebeninfo, wo er einordnet statt zu
           erschlagen. */
        const zaehler = { n: 0 };

        tl.to("[data-z-label-angebot]", { autoAlpha: 0, duration: 3 }, 26);
        tl.fromTo("[data-z-label-echt]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 4 }, 28);

        /* DIE BESCHRIFTUNG ZÄHLT MIT (08.09.). Sie stand fest auf
           „Positionen fehlten", während der Zähler bei 0, 1, 2, 3, 4
           durchläuft – beim ersten Fund stand also rund zwei Sekunden lang
           „1 Positionen fehlten" unter der größten Zahl der Seite.

           Der Wortlaut wird hier im selben `onUpdate` gesetzt, in dem die
           Ziffer ohnehin geschrieben wird: kein zusätzlicher Zustand, kein
           Rerender, und die beiden können nicht auseinanderlaufen. */
        const label = scope.current?.querySelector<HTMLElement>(
          "[data-z-label-echt]",
        );

        FEHLT.forEach((_, i) => {
          const ab = 28 + i * 8;
          zeige(`[data-z-luecke='${i}']`, ab, 4);

          tl.to(
            zaehler,
            {
              n: i + 1,
              duration: 3,
              ease: "power2.out",
              onUpdate: () => {
                const n = Math.round(zaehler.n);
                if (zahl) zahl.textContent = String(n);
                if (label) {
                  label.textContent =
                    n === 1 ? "Position fehlte" : "Positionen fehlten";
                }
              },
            },
            ab + 1,
          );
        });

        /* Die Zahl wechselt die Farbe, während sie zählt: Sie ist ab hier
           nicht mehr die Angebotssumme, sondern der Befund. */
        tl.to("[data-z-block]", { color: "#F26A21", duration: 14 }, 30);
        tl.to("[data-z-cue]", { autoAlpha: 0, duration: 4 }, 30);

        /* ---- Akt 3: die Auflösung ----
           Der Grund bleibt Navy. Ein Umschlag auf Papier hätte die
           Kopfleiste mitten in der Sektion unlesbar gemacht (sie leitet
           ihre Farbe aus `data-nav-theme` des Bandes ab, und ein Band hat
           genau einen Wert). Die Wärme kommt deshalb über Licht und
           Akzentfarbe, nicht über einen Flächentausch – was ohnehin näher
           an der CI-Regel „flaches Navy, kein Verlauf als Grundfläche"
           liegt.

           Die Auflösung hellt sich auf `#F48042` auf – einen helleren Tint
           DERSELBEN Orange-Familie (identisch zu `[data-surface="dark"]`
           in globals.css) statt eines zweiten Farbtons: Der Bogen "wärmt
           sich auf", bleibt aber innerhalb einer Hue. */
        tl.to("[data-z-befund]", { autoAlpha: 0, y: -16, duration: 8 }, 66);
        tl.fromTo("[data-z-waerme]", { opacity: 0 }, { opacity: 1, duration: 20 }, 62);
        tl.to("[data-z-block]", { color: "#F48042", duration: 12 }, 68);
        tl.to("[data-z-aufloesung]", { autoAlpha: 1, duration: 2 }, 72);
        zeige("[data-z-satz]", 72, 8);
        zeige("[data-z-nachsatz]", 80, 6);
        zeige("[data-z-cta]", 86, 6);
      });
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      id="beispiel"
      data-nav-theme="dark"
      data-surface="dark"
      /* Die Höhe IST die Spieldauer: 320 svh geben der Sequenz rund drei
         Bildschirme Scrollstrecke. Bei `prefers-reduced-motion` fällt die
         Bühne auf normalen Fluss zurück und zeigt alles untereinander. */
      className="relative h-[320svh] bg-ep-navy-deep text-white motion-reduce:h-auto"
    >
      {/* FLÄCHE UND SKALA GEHÖREN DER SEKTION, NICHT DER BÜHNE.
          Sie lagen vorher beide auf der klebenden Bühne – und die ist um die
          Kopfleistenhöhe kürzer als das Fenster. Am Übergang vom Hero stieß
          damit Fläche auf Fläche: zwei eigene Malschichten in exakt
          demselben Navy, deren Kante bei einer gebrochenen Fensterhöhe
          (`dvh` auf dem Handy ist selten ganzzahlig) auf einem halben Pixel
          landet. Was man dann sieht, ist keine Linie im Entwurf, sondern die
          Rundung des Browsers – und zusätzlich der Rand, an dem die Textur
          aufhörte, während die Sektion weiterlief.

          Trägt die Sektion beides, gibt es an der Naht nichts mehr, was
          aneinanderstoßen könnte: Der Hero endet, die Sektionsfläche läuft
          über die volle Scrollstrecke durch. Für die Skala ist das
          gefahrlos, weil ihre Striche senkrecht verlaufen – sie sieht an
          jeder Höhe gleich aus, es fällt also nicht auf, dass sie mitscrollt
          statt mit der Bühne zu stehen. */}
      <div
        aria-hidden="true"
        className="ep-skala pointer-events-none absolute inset-0"
      />

      {/* Die Bühne beginnt unter der Kopfleiste und ist entsprechend
          niedriger: So zentriert sich die Zahl in der Fläche, die der
          Besucher tatsächlich sieht, statt hinter der Leiste. Sie ist
          durchsichtig – die Fläche darunter gehört der Sektion. */}
      <div className="sticky top-[var(--nav-h)] flex h-[calc(100dvh-var(--nav-h))] flex-col items-center justify-center overflow-hidden motion-reduce:relative motion-reduce:top-0 motion-reduce:h-auto motion-reduce:overflow-visible motion-reduce:py-24">
        {/* Die Wärme steigt mit der Auflösung von unten auf. Als eigene
            Ebene mit `opacity`, nicht als Farbwechsel der Fläche: So bleibt
            der Grund flach und es wird nur Licht dazugelegt. */}
        <div
          data-z-waerme
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0"
          style={{
            background:
              "radial-gradient(130% 90% at 50% 118%, rgba(244,128,66,0.30) 0%, rgba(242,106,33,0.10) 48%, rgba(242,106,33,0) 76%)",
          }}
        />

        {/* ZWEISPURIG AB lg (08.09.), UND DAS WAR EIN ECHTER FEHLER,
            KEINE GESCHMACKSFRAGE.

            Hier stand eine einzige `max-w-[34rem]`-Spalte, mittig, für die
            ganze Sektion. Gemessen auf 1920 px: 544 px Inhalt in 1732 px
            verfügbarer Breite – 31 % Füllung, über drei Bildschirmhöhen
            Scrollstrecke. Der Signature-Moment der Seite las sich auf dem
            Desktop als unfertige Seite; genau dieser Befund hat am 07.08.
            den Hero von energiepartner.info neu gebaut („rund 55 % der
            Fläche waren leer").

            Der zweite, schwerere Grund ist die HÖHE. Die Bühne misst
            `100dvh − nav-h` und trägt `overflow-hidden` – was nicht
            hineinpasst, verschwindet ersatzlos. Gestapelt braucht der Inhalt
            gemessen 759 px; auf einem 1366×768-Notebook stehen davon rund
            624 px zur Verfügung, und die Fußnote samt letzter Fundzeilen war
            weg. Nicht abgeschnitten – WEG, auch durch Scrollen nicht
            erreichbar.

            Nebeneinander verschwindet beides: Die Zahl steht nicht mehr ÜBER
            dem Befund, sondern daneben, und die gestapelte Höhe fällt um
            rund 250 px.

            Unter lg bleibt alles wie es war – auf 390 px ist für zwei Spuren
            kein Platz, und dort kommt der Traffic her. */}
        <div className="ep-container relative z-10 w-full">
          <div className="mx-auto grid w-full max-w-[34rem] text-center lg:max-w-[72rem] lg:grid-cols-12 lg:items-center lg:gap-x-16 lg:text-left">
            {/* ---------- Spur A: die Zahl ---------- */}
            <div className="lg:col-span-5">
            <p className="t-label text-white/55">Eine Beispielrechnung</p>

            {/* DIE ZAHL. `will-change` ist hier kein Feinschliff: Der Block
                wird beim Hochzählen in jedem Frame neu gesetzt, und ohne
                eigene Ebene rastert der Browser dabei die halbe Bühne mit. */}
            {/* Die Angebotssumme steht klein darüber – sie ist der Kontext,
                nicht die Aussage. Genau umgekehrt war es vorher, und daran
                hing der ganze Fehleindruck. */}
            <p className="mt-4 text-white/50">
              Ein Angebot über{" "}
              <span className="font-semibold text-white/75">
                {fmt(ANGEBOT)} €
              </span>
              , wie wir es täglich sehen.
            </p>

            <div
              data-z-block
              className="mt-6 will-change-[transform,opacity,color]"
            >
              {/* DIE GRÖSSE IST ZUSÄTZLICH GEGEN DIE HÖHE GEDECKELT
                  (`16svh`), nicht nur gegen die Breite. `t-display` allein
                  skaliert mit `vw` und wird auf einem breiten, flachen
                  Fenster (1600×700) am größten – also genau dort, wo am
                  wenigsten Platz ist. Dieselbe Deckelung nach Höhe steht in
                  `Testimonials.tsx` an jedem Zitat. */}
              <div
                className="flex items-end justify-center leading-none lg:justify-start"
                style={{
                  fontSize: "min(clamp(2.9rem, 8.4vw, 8.5rem), 16svh)",
                  fontWeight: 700,
                  fontStretch: "86%",
                  letterSpacing: "-0.03em",
                }}
              >
                <span data-z-wert className="[font-variant-numeric:tabular-nums]">
                  0
                </span>
              </div>

              {/* Zwei Beschriftungen übereinander statt nacheinander: Die
                  Zeile darf beim Wechsel nicht in der Höhe springen, sonst
                  wackelt die Zahl darüber mit. */}
              <div className="relative mt-3 h-6">
                <span
                  data-z-label-angebot
                  className="t-label absolute inset-x-0 text-white/60"
                >
                  Wir prüfen Position für Position
                </span>
                <span
                  data-z-label-echt
                  className="t-label absolute inset-x-0 text-ep-accent opacity-0"
                >
                  Positionen fehlten
                </span>
              </div>
            </div>
            </div>

            {/* ---------- Spur B: Befund ↔ Auflösung ---------- */}
            {/* Wechselbühne: Befund ↔ Auflösung liegen übereinander, damit
                die Zahl an ihrem Platz bleibt.

                RASTER STATT `absolute` + `min-height`, und das ist die
                eigentliche Lehre aus einem Fehler: Vorher lagen beide Blöcke
                absolut in einem Kasten mit geratener Mindesthöhe. Sobald der
                Befund höher wurde – hier durch eine ergänzte Begründungszeile
                je Position – lief er unten heraus und ÜBER die Fußnote.
                Absolut positionierte Kinder melden ihre Höhe nicht nach oben,
                der Kasten wusste also nichts davon.

                Beide Kinder liegen jetzt in derselben Rasterzelle
                (`[grid-area:1/1]`). Sie stapeln sich weiterhin, aber die
                Bühne nimmt automatisch die Höhe des größeren an. Damit kann
                zusätzlicher Inhalt nichts mehr überdecken – er schiebt die
                Fußnote nach unten, und das sieht man beim ersten Blick.

                DIE HÖHE BLEIBT DIE KNAPPE GRÖSSE. Die Bühne misst eine
                Bildschirmhöhe minus Kopfleiste und hat `overflow-hidden` –
                was nicht hineinpasst, verschwindet ersatzlos. Ab lg steht
                dieser Block neben der Zahl statt darunter, damit ist der
                Fall entschärft; unter lg stapelt es weiterhin, dort ist das
                Fenster aber ein Telefon im Hochformat.

                Wer hier Inhalt ergänzt, muss auf einem flachen Fenster
                (etwa 1280×700) nachsehen. Deshalb sind die Zeilen mobil
                dicht gesetzt und die Begründungen auf eine Zeile begrenzt
                (siehe `FEHLT`). */}
            <div className="mt-8 grid sm:mt-10 lg:col-span-7 lg:mt-0">
              {/* ---------- Befund ---------- */}
              <div
                data-z-befund
                className="text-left [grid-area:1/1]"
              >
                <ul className="flex flex-col">
                  {ENTHALTEN.map((position, i) => (
                    <li
                      key={position.label}
                      data-z-pos={i}
                      className="flex items-baseline justify-between gap-4 border-b border-ep-line-dark py-2 sm:py-2.5"
                    >
                      <span className="text-[13px] text-white/70 sm:text-sm">
                        {position.label}
                      </span>
                      <span className="t-key shrink-0 text-white/85">
                        {position.betrag}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Die Lücken. Orange ist auf dieser Seite die Farbe des
                    Befunds – sie markiert, was fehlt, nicht was teuer ist.

                    Unter jeder Zeile steht, warum die Position unvermeidbar
                    ist. Ohne diese Begründung liest sich die Liste als
                    Angebotserweiterung; mit ihr als das, was sie ist – eine
                    Rechnung, die ohnehin kommt, nur später. */}
                <ul className="mt-4 flex flex-col gap-2.5 sm:mt-5 sm:gap-3">
                  {FEHLT.map((position, i) => (
                    <li
                      key={position.label}
                      data-z-luecke={i}
                      className="border-l-2 border-ep-accent-strong pl-3 text-left"
                    >
                      <span className="flex items-baseline justify-between gap-4">
                      <span className="text-[13px] leading-snug text-ep-accent sm:text-sm">
                        {position.label}
                        <span className="text-white/60"> nicht enthalten</span>
                      </span>
                      <span className="t-key shrink-0 text-ep-accent">
                        + {fmt(position.betrag)} €
                      </span>
                      </span>
                      <span className="mt-0.5 block text-[12px] leading-snug text-white/50 sm:text-[13px]">
                        {position.warum}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ---------- Auflösung ----------
                  Dieselbe Rasterzelle wie der Befund: Beide liegen
                  übereinander, die Bühne richtet sich nach dem höheren.
                  `self-start`, damit die Auflösung oben ansetzt und nicht
                  in der Restfläche des höheren Geschwisters schwebt.

                  `lg:text-left`: Unter lg erbt die Auflösung die mittige
                  Setzung der Spalte – so war es immer und so bleibt es.
                  Ab lg steht sie in der rechten Spur neben der Zahl, und
                  dort wäre mittiger Satz die einzige Stelle der Sektion
                  ohne gemeinsame linke Kante. */}
              <div
                data-z-aufloesung
                className="self-start [grid-area:1/1] lg:text-left"
              >
                <p data-z-satz className="t-h3 text-white">
                  Das Angebot war nicht zu teuer.{" "}
                  <span className="text-ep-accent">Es war unvollständig.</span>
                </p>
                {/* Der Betrag steht HIER und nicht als Hauptzahl – als
                    Einordnung eines Befunds, nicht als Drohung. Und der
                    zweite Satz ist der eigentliche Verkaufsgrund: Wer die
                    Lücken vorher kennt, kann sie klären. Wer sie nicht
                    kennt, bezahlt sie hinterher. Das ist die Botschaft, für
                    die diese Sektion existiert. */}
                {/* Der entscheidende Halbsatz ist „hätte er ohnehin
                    gezahlt". Ohne ihn liest sich die ganze Sektion als
                    Angebotserweiterung – mit ihm als das, was sie ist: Die
                    Rechnung kommt so oder so, die Frage ist nur, ob man sie
                    vor oder nach der Unterschrift sieht. */}
                <p
                  data-z-nachsatz
                  className="mx-auto mt-5 max-w-[42ch] text-white/75 lg:mx-0"
                >
                  Diese {fmt(LUECKE)} € hätte der Eigentümer ohnehin gezahlt –
                  nur eben als Nachtrag, nachdem er unterschrieben hatte. Wer
                  sie vorher kennt, kann sie klären oder einplanen.
                </p>
                <div data-z-cta className="mt-8 inline-block">
                  <WhatsAppButton
                    href={SITE.whatsapp.angebotHref}
                    size="lg"
                    label="Angebot kostenlos prüfen lassen"
                  />
                </div>
              </div>
            </div>

            {/* Der Pflichthinweis. Auf sehr kurzen Displays trägt ihn schon
                die Zeile „Eine Beispielrechnung" über der Zahl – deshalb
                hier die knappe Fassung mobil und die vollständige ab sm,
                statt sie unten aus der Fläche laufen zu lassen.

                Ab lg eine eigene Rasterzeile über beide Spuren: Er ist die
                Fußnote zur ganzen Rechnung, nicht zu einer der beiden
                Spalten. In einer der Spuren stünde er entweder unter der
                Zahl (wo er die Auflösung nicht mehr erreicht) oder unter dem
                Befund (wo er die Bühne höher macht – genau das, was hier
                nicht passieren darf). */}
            <p className="mt-6 text-[12px] leading-relaxed text-white/40 sm:mt-8 sm:text-[13px] lg:col-span-12 lg:mt-10">
              Beispielwerte zur Veranschaulichung.{" "}
              <span className="hidden sm:inline">
                Angebot {fmt(ANGEBOT)} €, mit den fehlenden Positionen{" "}
                {fmt(ENDSUMME)} €.{" "}
              </span>
              Welche Positionen in Ihrem Angebot fehlen, zeigt erst die Prüfung.
            </p>
          </div>
        </div>

        {/* Hinweis, dass die Sequenz am Scrollen hängt. Ohne ihn wirkt die
            stehende Zahl wie eine Seite, die nicht weitergeht. */}
        <div
          data-z-cue
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-5 flex flex-col items-center gap-2.5 motion-reduce:hidden"
        >
          <span className="flex h-9 w-[23px] items-start justify-center rounded-full border border-white/25 p-[5px]">
            <span className="ep-scrollcue-dot size-1.5 rounded-full bg-ep-accent-strong" />
          </span>
        </div>
      </div>
    </section>
  );
}
