"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Marker } from "@/components/ui/Marker";
import { GoogleG } from "@/components/ui/GoogleG";
import { ScrollCue } from "@/components/ui/ScrollCue";
import { AvUploadKnopf, AvUploadZone } from "@/components/av/AvUpload";
import { formatiereNote, type GoogleBewertungen } from "@/lib/google-reviews";
import { maskedHeadline } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * * HERO · angebote-vergleichen.info
 * *
 * HELL STATT NAVY (08.09.) * Der Hero lief auf `navy-deep` mit Skala und einer Ablagefläche in
 * Weißtönen. Er ist jetzt hell, nach demselben Muster wie
 * energiepartner.info seit dem 10.08. – auf Wunsch von Emre, damit beide
 * Auftritte als eine Marke lesbar sind.
 *
 * Übernommen ist die STRUKTUR des dortigen Heros, nicht seine Copy:
 * Auszeichnungszeile, große Überschrift, ein Satz, drei abgehakte Punkte,
 * die Handlung, Belege darunter über die volle Breite.
 *
 *   ┌─────────────────────────────┬───────────────────┐
 *   │ Pre-Headline                │                   │
 *   │ IST IHR ANGEBOT VOLLSTÄNDIG?│   Ablagefläche    │
 *   │ Ein Satz                    │                   │
 *   │ ✓ drei Punkte               │                   │
 *   ├─────────────────────────────┴───────────────────┤
 *   │ BELEG-LEISTE über die volle Breite              │
 *   └─────────────────────────────────────────────────┘
 *
 * WAS DER HELLE GRUND ALLES MITZIEHT, falls jemand zurückbaut:
 *   · `data-nav-theme="light"` statt `"dark"` – sonst zeichnet die
 *     Kopfleiste weiße Schrift auf Papier
 *   · KEIN `data-surface="dark"` mehr – die Rolle `ep-accent` löst dadurch
 *     zu `orange-deep` auf (5,4:1 auf Papier statt des helleren Tints, der
 *     nur auf Navy trägt)
 *   · `ep-skala-tinte` – weiße Linien sind auf #FBF6EE unsichtbar
 *   · `AvUploadZone` trägt seit demselben Tag eine helle Fassung
 *   · `AvWortmarke` bekommt ihre Farbe über `ton`, nicht über eine
 *     Klassen-Überschreibung von außen
 *
 * DIE HANDLUNG STEHT IM HERO, NICHT DAHINTER * Der Funnel ist die Seite. Wer hier landet, kommt per QR aus einem Brief
 * oder aus einer Anzeige, hat ein Angebot auf dem Tisch und genau eine
 * Frage. Er sucht keinen Anbieter, er sucht eine Antwort – und jede Sektion
 * vor dem Upload ist eine Gelegenheit abzuspringen.
 *
 * KEIN STICKY, KEIN ZOOM * Anders als auf energiepartner.info. Dort ist der Hero eine Bühne, die
 * sich verabschiedet; hier enthält er den Auslöser eines Formulars mit
 * Dateiauswahl. Ein Element, das seine Höhe ändert, während es sticky klebt
 * und gleichzeitig herauszoomt, ist nicht zu kontrollieren – und der Funnel
 * darf unter keinen Umständen teilweise unerreichbar werden.
 */

/**
 * Die drei Punkte über der Handlung.
 *
 * Inhaltlich ist das die frühere „Vertrauenszeile" – dieselben drei
 * Zusagen, dieselbe verbindliche Trennung der Zeitangaben: **3 Minuten ist
 * die Übermittlung, 24 Stunden die Auswertung.** Wer beides vermischt,
 * verspricht eine Prüfung in drei Minuten.
 *
 * Neu ist nur die Form. Sie standen als 13-px-Zeile mit senkrechten
 * Trennern unter dem Fließtext und wurden überflogen. Als abgehakte Liste
 * werden sie gelesen – zwischen einer Überschrift und einem Auslöser fehlt
 * sonst der Schritt, in dem jemand ZUSTIMMT.
 *
 * HAKEN SIND HIER RICHTIG, anders als bei Zusagen an anderer Stelle.
 * Ein Häkchen behauptet Erledigtes; „Rückmeldung innerhalb von 24 Stunden"
 * ist eine Leistung, die wir erbringen, keine Absichtserklärung.
 */
const PUNKTE = [
  "In etwa 3 Minuten übermittelt",
  "Rückmeldung innerhalb von 24 Stunden",
  "Kostenlos und ohne Verpflichtung",
] as const;

/* Bausteine der Beleg-Leiste – identisch gesetzt wie auf
   energiepartner.info, damit die beiden Leisten als dieselbe Sprache
   gelesen werden. */
const beleg = "flex flex-col gap-1 py-5";
const trenner = "border-l border-ep-line pl-6";
const wert =
  "text-[clamp(1.375rem,1.9vw,1.75rem)] font-bold leading-none tracking-[-0.02em] [font-stretch:86%]";
const label = "text-[13px] leading-snug text-ep-ink/60";

export function AvHero({
  /* Optional und mit `null` als Vorgabe: Solange das Profil über die API
     nichts ausliefert, ruft `av/page.tsx` den Hero ohne Daten auf – dann
     entfällt die Bewertungskachel ersatzlos, statt eine Note zu erfinden. */
  bewertungen = null,
}: {
  bewertungen?: GoogleBewertungen | null;
}) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(
          "[data-h-vorzeile], [data-h-sub], [data-h-punkte], [data-h-cta], [data-h-beleg]",
          { autoAlpha: 0 },
        );

        gsap.fromTo(
          "[data-h-skala]",
          { scale: 1.06, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 2.4, ease: "expo.out", force3D: true },
        );

        return maskedHeadline({
          headline: "[data-h-h1]",
          build: (tl) => {
            tl.fromTo(
              "[data-h-vorzeile]",
              { y: 14, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.8 },
              0.1,
            )
              .fromTo(
                "[data-h-sub]",
                { y: 24, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.9 },
                0.6,
              )
              .fromTo(
                "[data-h-punkte]",
                { y: 18, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.8 },
                0.8,
              )
              /* Der Auslöser kommt VOR dem Beleg herein: erst die Handlung,
                 dann wer sie schon gemacht hat. */
              .fromTo(
                "[data-h-cta]",
                { y: 24, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.8 },
                0.95,
              )
              .fromTo(
                "[data-h-beleg]",
                { y: 16, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.8 },
                1.2,
              );
          },
        });
      });
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      /* Der Bezugspunkt der mitlaufenden Leiste (`AvStickyBar`). Als eigene
         Kennung, nicht über die Stellung im Baum: Die suchte den Hero vorher
         als „erste Sektion in `<main>`" und griff daneben, sobald Hero und
         Beispielrechnung einen gemeinsamen Grund-Wrapper bekamen. */
      data-av-hero
      data-nav-theme="light"
      className="relative flex min-h-svh flex-col overflow-hidden bg-ep-paper"
    >
      {/* Die Skala in Tinte statt Weiß – siehe Kopfkommentar. */}
      <div
        data-h-skala
        aria-hidden="true"
        className="ep-skala ep-skala-tinte ep-skala-auslauf pointer-events-none absolute inset-0"
      />

      {/* DER WARME SCHEIN Papier über die volle Bildschirmhöhe ist einfach nur leer, und ein
          leerer heller Hero wirkt nicht ruhig, sondern unfertig. Ein sehr
          weicher Verlauf in der Akzentfarbe gibt der rechten Hälfte Gewicht,
          ohne eine Fläche einzuziehen – als `radial-gradient` und nicht als
          getönter Kasten: Eine Kante wäre ein zweites Band, ein Verlauf ist
          Licht.

          Er sitzt hier hinter der Ablagefläche, wo drüben das Foto steht.
          Damit hat der Auslöser auf der leeren Seite einen Grund, auf dem er
          liegt. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 78% 30%, rgba(242,106,33,0.20) 0%, rgba(242,106,33,0.07) 42%, transparent 68%)",
        }}
      />

      {/* EIN BILDSCHIRM, AUCH AUF DEM HANDY.
          Wer scrollen muss, um den Funnel zu sehen, bekommt ihn nicht zu
          sehen. Auf einer Leadstrecke, deren Traffic per QR aus einem Brief
          kommt, entscheidet sich alles im ersten Bild. */}
      <div className="ep-container relative z-10 flex flex-1 flex-col pb-[clamp(0.5rem,1.2svh,1.25rem)] pt-[calc(var(--nav-h)+clamp(0.25rem,1svh,1rem))] text-ep-ink sm:pb-[clamp(0.75rem,1.5svh,2.5rem)] sm:pt-[calc(var(--nav-h)+clamp(0.5rem,1.8svh,3rem))]">
        {/* ZONE 1 · Aussage und Handlung */}
        <div className="flex flex-1 flex-col justify-center py-[clamp(0.5rem,1.5svh,1.5rem)] lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-12 lg:py-10">
          <div className="lg:col-span-6">
            {/* Freigegebene Kundencopy, wörtlich. „Mehr" trägt die
                Auszeichnung, weil dort der Schmerz sitzt: nicht die Kosten
                sind das Problem, sondern dass sie NACH der Unterschrift
                dazukamen. */}
            {/* DIE ZEILE IST GEDÄMPFT, NUR „Mehr" TRÄGT DEN AKZENT.
                Auf Navy stand sie in `white/70` mit orangem „Mehr" – der
                Kontrast machte das eine Wort zur Aussage. Komplett in
                Akzentfarbe (wie der Eyebrow auf energiepartner.info) ginge
                die Hervorhebung verloren, und genau sie ist hier der Inhalt:
                Nicht die Kosten sind das Problem, sondern dass sie NACH der
                Unterschrift dazukamen. */}
            <p data-h-vorzeile className="t-label max-w-[32ch] text-ep-ink/60">
              Unterschrieben und hinterher{" "}
              <span className="text-ep-accent">Mehr</span>kosten? Schluss
              damit!
            </p>

            {/* Weiches Trennzeichen im Kompositum: „Wärmepumpenangebot" ist
                auf 375 px breiter als die Zeile. Ohne die Trennmöglichkeit
                schiebt es die Headline über den Rand, mit einem harten
                Bindestrich stünde er auch dort, wo Platz ist.

                `11svh` deckelt gegen die HÖHE, nicht nur gegen die Breite:
                Der Hero hat hier eine Zusage einzuhalten – ein Bildschirm –
                und eine Headline, die nur mit der Breite skaliert, sprengt
                sie auf jedem flachen Gerät. */}
            <h1
              data-h-h1
              className="mt-4 max-w-[14ch] font-bold leading-[1.02] tracking-[-0.03em] text-ep-ink sm:mt-[clamp(0.5rem,1.5svh,1.5rem)]"
              style={{
                fontSize: "min(clamp(2.25rem, 6vw, 5.5rem), 11svh)",
                fontStretch: "86%",
              }}
            >
              Ist Ihr Wärmepumpen&shy;angebot{" "}
              <span className="text-ep-accent">
                <Marker delay={1}>vollständig</Marker>
              </span>
              ?
            </h1>

            <p
              data-h-sub
              className="mt-4 max-w-[42ch] text-[clamp(1rem,1.15vw,1.1875rem)] leading-relaxed text-ep-ink/75 sm:mt-[clamp(0.5rem,1.5svh,1.5rem)]"
            >
              Laden Sie es hoch. Wir lesen es Position für Position und sagen
              Ihnen, was darin fehlt.
            </p>

            {/* Der Haken sitzt in einem eigenen Kreis statt frei im Text.
                Freistehende Haken in Textgröße verschwinden neben der Zeile;
                mit Fläche darunter liest sich die Reihe als Liste abgehakter
                Punkte, und genau das soll sie. */}
            <ul
              data-h-punkte
              className="mt-[clamp(0.75rem,2svh,1.5rem)] flex flex-col gap-[clamp(0.375rem,1svh,0.75rem)] sm:mt-[clamp(0.75rem,1.8svh,2rem)] sm:gap-[clamp(0.375rem,1svh,0.875rem)]"
            >
              {PUNKTE.map((punkt) => (
                <li key={punkt} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-ep-accent/12 text-ep-accent"
                  >
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  <span className="max-w-[46ch] text-[15px] font-medium leading-snug text-ep-ink/85 sm:text-base">
                    {punkt}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Zwei Erscheinungsformen desselben Auslösers – Input und Dialog
              liegen im `AvUploadProvider`, hier steht nur der Griff.

              Auf dem Handy ein Knopf: Man tippt, der Systemdialog geht auf,
              dort liegen Kamera und Dateien. Ab lg die Ablagefläche, weil
              dort Platz neben der Aussage ist und Ziehen wirklich
              funktioniert. */}
          <div
            data-h-cta
            className="mt-[clamp(0.875rem,2.2svh,1.75rem)] sm:mt-[clamp(0.75rem,1.8svh,2rem)] lg:col-span-6 lg:mt-0"
          >
            <div className="lg:hidden">
              <AvUploadKnopf className="w-full sm:w-auto" />
            </div>

            <div className="hidden lg:block">
              <AvUploadZone />
            </div>

            {/* NUR NOCH ZWEI WÖRTER, UND DAS IST DER PUNKT.
                Hier stand „Kostenlos · Rückmeldung innerhalb von 24
                Stunden". Frist und Unverbindlichkeit stehen jetzt in den
                drei Punkten links; übrig bleibt das einzige Wort, das an
                einen Auslöser gehört. */}
            <p className="mt-4 text-sm text-ep-ink/60">
              Kostenlos · unverbindlich
            </p>

            {/* Mobil/Tablet: die Bewertung groß und zentriert direkt unter
                dem Auslöser, NICHT unten in der Beleg-Leiste. Sie ist der
                letzte Vertrauens-Schub unmittelbar vor der größten Handlung
                der Seite – eine Datei herausgeben, an einen Absender, von
                dem der Besucher meist noch nie gehört hat. Dieselbe Lösung
                wie im Hero von energiepartner.info. */}
            {bewertungen && (
              <a
                href={bewertungen.profilUrl ?? undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex flex-col items-center gap-1.5 text-center outline-none focus-visible:ring-2 focus-visible:ring-ep-accent-strong focus-visible:ring-offset-2 focus-visible:ring-offset-ep-paper lg:hidden"
              >
                <span className="flex items-baseline gap-2.5">
                  <span className="text-2xl font-bold leading-none text-ep-ink [font-variant-numeric:tabular-nums]">
                    {formatiereNote(bewertungen.note)}
                  </span>
                  <span className="flex items-center gap-0.5" aria-hidden="true">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={
                          i < Math.round(bewertungen.note)
                            ? "size-4 fill-ep-accent text-ep-accent"
                            : "size-4 text-ep-line"
                        }
                      />
                    ))}
                  </span>
                </span>
                <span className="flex items-center gap-1.5 text-sm text-ep-ink/65">
                  <GoogleG className="size-4 shrink-0" />
                  {bewertungen.anzahl}{" "}
                  {bewertungen.anzahl === 1 ? "Bewertung" : "Bewertungen"}
                </span>
              </a>
            )}
          </div>
        </div>

        {/* WISCH-HINWEIS · nur unter lg `mt-auto` statt einer festen Position: Zone 1 darüber trägt
            `flex-1`, der Hinweis wird also von unten gegen die Kante
            gedrückt und kann keiner anderen Zeile in die Quere kommen. */}
        <div className="mt-auto flex justify-center pt-2 lg:hidden">
          <ScrollCue variante="saeule" />
        </div>

        {/* ZONE 2 · DIE BELEG-LEISTE Über die volle Breite, unter allem – dieselbe Sprache wie im Hero
            von energiepartner.info: Werte in gleicher Größe, durch
            Haarlinien getrennt, die Beschriftung darunter.

            AB lg, NICHT MOBIL. Mobil wirkt die volle Zeile zu dicht, und
            die Bewertung sitzt dort direkt unter dem Auslöser in Zone 1
            statt hier unten.

            WAS HIER STEHT, IST NACHPRÜFBAR ODER EINE ZUSAGE, DIE WIR
            EINHALTEN – keine Kennzahl über uns selbst. „300+ geprüfte
            Angebote" wäre die naheliegende dritte Kachel und ist bis heute
            ein Platzhalter (Briefing 7); sie hat auf der Seite, die um
            Vollständigkeit wirbt, nichts verloren, solange sie nicht belegt
            ist. */}
        <div data-h-beleg className="hidden lg:block">
          <ul
            className={cn(
              "grid border-t border-ep-line",
              bewertungen ? "lg:grid-cols-3" : "lg:grid-cols-2",
            )}
          >
            <li className={beleg}>
              <span className={cn(wert, "text-ep-accent")}>3 Minuten</span>
              <span className={label}>bis Ihr Angebot bei uns ist</span>
            </li>

            <li className={cn(beleg, trenner)}>
              <span className={cn(wert, "text-ep-ink")}>24 Std.</span>
              <span className={label}>bis zur Auswertung</span>
            </li>

            {bewertungen && (
              <li className={cn(beleg, trenner)}>
                <span className="flex items-baseline gap-2.5">
                  <span
                    className={cn(
                      wert,
                      "text-ep-ink [font-variant-numeric:tabular-nums]",
                    )}
                  >
                    {formatiereNote(bewertungen.note)}
                  </span>
                  <span className="flex items-center gap-0.5" aria-hidden="true">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={
                          i < Math.round(bewertungen.note)
                            ? "size-[0.9rem] fill-ep-accent text-ep-accent"
                            : "size-[0.9rem] text-ep-line"
                        }
                      />
                    ))}
                  </span>
                </span>
                {/* Als Verweis auf das echte Profil: Ein Beleg, den man
                    nicht nachsehen kann, ist keiner. Die Attribution gehört
                    dabei zu energiepartner und nicht zu dieser Domain –
                    deshalb führt der Link auf genau dieses Profil. */}
                <a
                  href={bewertungen.profilUrl ?? undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    label,
                    "flex items-center gap-1.5 underline-offset-4 outline-none transition-colors hover:text-ep-ink hover:underline focus-visible:text-ep-ink",
                  )}
                >
                  <GoogleG className="size-3 shrink-0" />
                  {bewertungen.anzahl}{" "}
                  {bewertungen.anzahl === 1 ? "Bewertung" : "Bewertungen"}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
