"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { maskedHeadline } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * „Vier Bausteine. Ein System." – die Signature-Sektion der Seite.
 *
 * Die Aussage ist die *Verbindung*, also ist die Verbindung auch die
 * Choreografie: Vier Bausteine liegen zunächst verstreut („einzeln
 * gekauft"), reihen sich beim Scrollen auf eine Leitung, und erst dann
 * fließt Energie hindurch.
 *
 * WARUM EINE KETTE UND KEIN RING: Die Sektion war vorher ein 2×2-Raster mit
 * einer Ringleitung – und das Konzept hat einen eingebauten Widerspruch.
 * Entweder die Leitung verbindet die Beschriftungen, dann liegt sie hinter
 * ihnen und ist unsichtbar; oder sie ist sichtbar, dann verbindet sie
 * nichts. Dazu kam, dass ein 2×2-Raster nur die Bildschirmmitte belegt und
 * die Fläche links und rechts verschenkt.
 *
 * Die Kette löst beides: eine durchgehende Linie über die volle Breite, vier
 * Knoten darauf, der Energiepuls läuft sichtbar von links nach rechts. Und
 * sie ist ehrlicher als der Ring – die Reihenfolge erzeugt → speichert →
 * heizt → deckt den Rest ist ein Weg, kein Kreislauf.
 *
 * „Warm werden" passiert ohne Verlauf und ohne Glow (CI-Regel: flaches
 * Navy): Leitung, Knoten und Indizes wandern nach Sonnengelb, dazu eine
 * zweite Rasterlinien-Ebene in Sun.
 *
 * Ohne JS und bei prefers-reduced-motion rendert das Markup direkt den
 * Endzustand: aufgereiht, verbunden, „ein System". Kein Pin, kein Fluss.
 */
const PARTS = [
  { index: "01", label: "Photovoltaik", role: "erzeugt" },
  { index: "02", label: "Stromspeicher", role: "speichert" },
  { index: "03", label: "Wärmepumpe", role: "heizt damit" },
  { index: "04", label: "Energietarif", role: "deckt den Rest" },
] as const;

/** Startlage je Baustein, bevor sie sich aufreihen. Bewusst gesetzt und
 *  klein gehalten – es soll „noch nicht sortiert" heißen, nicht „chaotisch". */
const STREUUNG = [
  { x: -70, y: -54 },
  { x: 48, y: 62 },
  { x: -40, y: 70 },
  { x: 66, y: -46 },
] as const;

const INDEX_COLD = "rgba(20,35,46,0.3)";
const INDEX_WARM = "#c24e12";

export function Gesamtsystem() {
  const scope = useRef<HTMLElement>(null);
  const scene = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () =>
        maskedHeadline({
          headline: "[data-g-h2]",
          follow: "[data-g-reveal]",
          scrollTrigger: { trigger: "[data-g-head]", start: "top 78%", once: true },
        }),
      );

      /* Endlosschleifen anhalten, solange die Sektion nicht im Bild ist.
         `background-position` zu animieren heißt neu zeichnen – auch drei
         Bildschirme entfernt. */
      ScrollTrigger.create({
        trigger: scope.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) =>
          scope.current?.toggleAttribute("data-flow-paused", !self.isActive),
        onRefresh: (self) =>
          scope.current?.toggleAttribute("data-flow-paused", !self.isActive),
      });

      /* ---------- Die Szene ---------- */
      mm.add(
        {
          isDesktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          isMobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { isMobile } = context.conditions as { isMobile: boolean };
          const nodes = gsap.utils.toArray<HTMLElement>("[data-g-node]");

          /* Startzustand. useGSAP läuft als LayoutEffect, greift also vor dem
             ersten Paint – kein Aufblitzen des Endzustands. */
          // Startzustand: Die vier Sätze stehen versetzt und weit auseinander,
          // jeder für sich – „einzeln gekauft". Der Abstand ist das eigentliche
          // Motiv, deshalb wird er animiert und nicht Position oder Größe.
          gsap.set("[data-g-saetze]", { gap: isMobile ? "1.75rem" : "3rem" });
          nodes.forEach((node, i) => {
            gsap.set(node, {
              x: isMobile ? STREUUNG[i].x * 0.3 : STREUUNG[i].x,
              opacity: 0.3,
            });
          });
          gsap.set("[data-g-warmgrid]", { opacity: 0 });
          gsap.set("[data-g-index]", { color: INDEX_COLD });
          gsap.set("[data-g-state-a]", { opacity: 1 });
          gsap.set("[data-g-state-b]", { opacity: 0 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: scene.current,
              start: "top top",
              end: () => "+=" + window.innerHeight * (isMobile ? 1.3 : 1.7),
              pin: scene.current,
              scrub: 0.6,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              // Der Pin verschiebt alles darunter und muss deshalb vor den
              // übrigen Triggern neu berechnet werden. Diese Sektion ist seit
              // dem Umsortieren die ERSTE gepinnte im Dokument – also der
              // höchste Wert. Stand sie niedriger als die Galerie, hat deren
              // Pin seine Strecke gegen eine Seitenhöhe gerechnet, die dieser
              // Pin unmittelbar danach noch verändert hat: Genau das ist der
              // sichtbare Sprung am Übergang von den Leistungen zur
              // Bildstrecke gewesen.
              refreshPriority: 2,
            },
          });

          // AKT 1 – die Sätze richten sich aus, einer nach dem anderen
          tl.to(
            nodes,
            { x: 0, opacity: 1, duration: 1, ease: "expo.out", stagger: 0.14 },
            0,
          )

            // AKT 2 – sie rücken zu einem Block zusammen. Das ist die
            // Kernbewegung: aus vier Einzelteilen wird ein Gefüge. Bewusst
            // überlappend mit Akt 1 begonnen – ein sauberer Schnitt dazwischen
            // würde den Fluss zerteilen, und die Sektion soll durchlaufen.
            .to("[data-g-saetze]", { gap: "0rem", duration: 1.1, ease: "power3.inOut" }, 0.85)

            // AKT 3 – der Block wird warm: die Tätigkeiten treten hervor
            .to("[data-g-rolle]", {
              color: "#f26a21",
              duration: 0.5,
              stagger: 0.1,
              ease: "none",
            }, 1.6)
            .to("[data-g-index]", { color: INDEX_WARM, duration: 0.6, stagger: 0.08 }, 1.6)
            .to("[data-g-warmgrid]", { opacity: 1, duration: 0.7 }, 1.7)

            // AKT 4 – die Auflösung: aus vier Entscheidungen wird eine Anlage
            .to("[data-g-state-a]", { opacity: 0, duration: 0.35 }, 2.1)
            .to("[data-g-state-b]", { opacity: 1, duration: 0.45 }, 2.3);

          return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
          };
        },
      );
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      id="gesamtsystem"
      data-nav-theme="light"
      /* `t-loud` – diese Sektion ist der Moment, für den die Seite erinnert
         wird, und sie darf das auch hören lassen. Die Klasse hebt den Pegel
         der ganzen Skala an, statt hier einzelne Größen von Hand zu setzen:
         Die Verhältnisse innerhalb der Typo-Skala bleiben unangetastet, es
         verschiebt sich nur der Ausschlag. */
      /* `overflow-x-clip`: Die Bausteine starten seitlich versetzt
         („einzeln gekauft") – und weil jede Zeile die volle Breite hat,
         schiebt schon ein Offset von +66 px die Sektion über den rechten
         Rand hinaus. Messbar zwischen 768 und 1440 px, also genau in der
         Zone zwischen Handy und großem Desktop, in der niemand nachsieht.
         `clip` statt `hidden`: hidden würde die Y-Achse zum Scrollcontainer
         machen und damit den Pin der Szene zerstören. */
      className="t-loud relative scroll-mt-[var(--nav-h)] overflow-x-clip bg-ep-paper text-ep-ink"
    >
      {/* Rasterlinien wie im Hero, hier in Vertrauensblau auf Papier.
          Sie laufen nach unten aus, statt an der Sektionskante abzureißen –
          eine harte Kante quer über die volle Breite würde als Strich lesen.

          Der Verlauf steckt in `mask-image`, nicht in der Farbe: Die Linien
          bleiben dadurch überall gleich stark und nur ihre Sichtbarkeit
          nimmt ab. Über die Farbe gelöst müsste man den Verlauf in jede
          einzelne Linie rechnen. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(14,53,82,.28) 0 1px, transparent 1px 72px)",
          maskImage:
            "linear-gradient(to bottom, #000 0%, #000 55%, transparent 92%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, #000 0%, #000 55%, transparent 92%)",
        }}
      />
      {/* Zweite Ebene in Orange: blendet auf, wenn das System warm wird.
          Dieselbe Maske wie das Grundraster – sonst liefe die warme Ebene
          weiter nach unten als die kalte und der Auslauf wäre zweistufig. */}
      <div
        data-g-warmgrid
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(242,106,33,.4) 0 1px, transparent 1px 72px)",
          maskImage:
            "linear-gradient(to bottom, #000 0%, #000 55%, transparent 92%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, #000 0%, #000 55%, transparent 92%)",
        }}
      />

      <div className="relative">
        {/* ================= Kopf – scrollt normal ================= */}
        <div data-g-head className="ep-container pb-4 pt-20 sm:pb-8 sm:pt-28">
          <p data-g-reveal className="t-label text-ep-accent">
            Ihr Eigenheim
          </p>
          {/* `text-ep-accent-strong` bleibt hier zulässig: Bei dieser Größe
              gilt die Schwelle für Großtext (3:1), und die Basis-Akzentfarbe
              (#F26A21) auf Papier liegt mit 3,06:1 darüber. Bei den Labels
              darunter tut sie das nicht – deshalb dort die adaptive Rolle
              `ep-accent`. */}
          <h2 data-g-h2 className="t-h2 mt-6 max-w-[16ch]">
            Vier Bausteine. <span className="text-ep-accent-strong">Ein System.</span>
          </h2>
          <p data-g-reveal className="t-lead mt-6 max-w-[46ch] text-ep-ink/75">
            Einzeln gekauft verschenken sie Potenzial. Zusammen geplant spielen sie
            sich zu.
          </p>
        </div>

        {/* ================= Szene – wird gepinnt ================= */}
        <div
          ref={scene}
          className="ep-container flex min-h-svh flex-col justify-center pb-14 pt-[var(--nav-h)]"
        >
          {/* Vier Sätze, die zu einem Block zusammenrücken.
              Kein Diagramm mehr: Knoten, Leitungen und Kacheln haben hier nie
              getragen – sie waren immer klein, mittig und dekorativ. Die
              starken Momente dieser Seite sind typografisch, also ist es das
              hier auch. Der Zusammenhalt entsteht dadurch, dass die vier
              Zeilen am Ende buchstäblich zu einem Block werden. */}
          <ul data-g-saetze className="flex flex-col">
            {PARTS.map(({ index, label, role }) => (
              /* DER UMBRUCH IST STRUKTURELL, NICHT ZUFÄLLIG.
                 Vorher entschied allein `flex-wrap`, ob Baustein und
                 Tätigkeit in eine Zeile passen. Auf 414 px hieß das:
                 „Photovoltaik erzeugt." blieb einzeilig, die drei anderen
                 brachen um – vier Zeilen, die dasselbe sagen sollen, in
                 zwei verschiedenen Formen. Und die Grenze verschiebt sich
                 mit jedem Pixel Fensterbreite, es gibt also keinen Zustand,
                 den man einmal prüfen und dann glauben könnte.

                 Jetzt gilt: unter lg IMMER zwei Zeilen (Tätigkeit auf
                 `basis-full`), ab lg immer eine. `whitespace-nowrap` auf
                 beiden Teilen schließt zusätzlich aus, dass ein Teil in
                 sich umbricht („deckt den / Rest.").

                 Der einzeilige Zustand ab lg ist über die Schriftgröße
                 abgesichert, nicht erhofft: 6.5vw ergab im Bereich
                 1024–1500 px eine Zeile, die ein paar Prozent zu breit war
                 – genau die Zone, in der niemand nachsieht. */
              <li
                key={label}
                data-g-node
                className="flex flex-wrap items-baseline gap-x-[0.35em] will-change-transform"
              >
                <span data-g-index className="t-label mr-4">
                  {index}
                </span>
                <span className="whitespace-nowrap text-[clamp(2rem,5.9vw,6rem)] font-bold leading-[1.1] tracking-[-0.035em]">
                  {label}
                </span>
                <span
                  data-g-rolle
                  className="basis-full whitespace-nowrap text-[clamp(2rem,5.9vw,6rem)] font-bold leading-[1.1] tracking-[-0.035em] text-ep-ink/20 lg:basis-auto"
                >
                  {role}.
                </span>
              </li>
            ))}
          </ul>

          {/* Statuszeile: der Satz kippt genau dann, wenn der Block schließt.
              Beide Zeilen liegen in derselben Rasterzelle – kein Layoutsprung. */}
          <div className="mt-16 grid sm:mt-20">
            <p
              data-g-state-a
              className="t-label col-start-1 row-start-1 text-ep-ink/75"
              style={{ opacity: 0 }}
            >
              Einzeln gekauft · vier Einzelentscheidungen
            </p>
            <p
              data-g-state-b
              className="t-label col-start-1 row-start-1 text-ep-accent"
            >
              Zusammen geplant · eine abgestimmte Anlage
            </p>
          </div>
        </div>

        {/* ================= Abschluss – scrollt normal ================= */}
        <div className="ep-container pb-20 sm:pb-28">
          <div
            data-parallax="18"
            className="ep-indent flex flex-col gap-6 border-t border-ep-line pt-10 lg:flex-row lg:items-center lg:justify-between"
          >
            {/* EIN WORT GEÄNDERT: „gebaut" → „koordiniert". Ilias vermittelt
                und koordiniert, er baut nicht selbst – das ist im Briefing
                der ausdrücklich geklärte Punkt (23.07.) und war die einzige
                Stelle auf der Seite, die eine eigene Ausführung behauptet
                hat. Ansonsten wurde an der Copy nichts angefasst. */}
            <p className="t-h3 max-w-[24ch]">
              Alles aus einer Hand: geplant, koordiniert, betreut.
            </p>
            <WhatsAppButton size="lg" label="Kostenlos beraten lassen" />
          </div>
        </div>
      </div>
    </section>
  );
}
