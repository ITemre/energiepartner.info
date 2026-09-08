"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star } from "lucide-react";
import { GoogleG } from "@/components/ui/GoogleG";
import { formatiereNote, type GoogleBewertungen } from "@/lib/google-reviews";
import type { Kennzahl } from "@/lib/proof";
import { cn } from "@/lib/utils";
import { countUp, revealItems } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Die Beleg-Zeile.
 *
 * WARUM NACH DER BILDSTRECKE * Sie stand bis 07.08. direkt unter dem Hero und hat mit der Förderung die
 * Plätze getauscht. Der Grund liegt in dem, was die beiden jeweils leisten:
 * Die Förderung beantwortet einen Einwand, der schon im Kopf steht, bevor
 * die Seite argumentiert hat. Diese Zeile beantwortet keine Frage, sie deckt
 * Behauptungen – und Behauptungen müssen erst einmal aufgestellt sein. Nach
 * System, Leistungen und Anlagen ist die Frage „stimmt das alles auch?"
 * offen; auf Position zwei war sie es noch nicht.
 *
 * Vorne bleibt sie trotzdem genug: Die Vertrauenszeile im Hero trägt
 * Bewertung und Rückmeldefrist, es steht also nicht eine ganze Seite lang
 * Unbelegtes.
 *
 * FORM * Navy, einen Ton HELLER als der Hero (`ep-navy` statt `navy-deep`), dazu
 * eine Sonnenkante nach oben. Das Band ist damit auch der einzige dunkle
 * Einschnitt in der langen hellen Strecke zwischen Bildern und Ablauf –
 * ohne ihn liefen Galerie, Aufgabenteilung und Ablauf als ein Papierblock
 * durch.
 *
 * Keine Kacheln, keine Karten: vier Werte auf einer Achse, getrennt durch
 * Haarlinien. Dieselbe Sprache wie das Typenschild im Hero.
 */
export function ProofBar({
  kennzahlen,
  bewertungen,
}: {
  kennzahlen: Kennzahl[] | null;
  bewertungen: GoogleBewertungen | null;
}) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        revealItems("[data-pb-item]", { distance: 18, start: "top 94%" });

        /* Dieselbe Primitive wie in der Förderung, nur kürzer: Die Leiste
           ist eine schmale Zeile, keine Argumentationsfläche – hier soll
           die Bewegung bestätigen, nicht vorführen. Auch die Bewertung
           zählt mit, sie ist die wichtigste Zahl der Reihe. */
        return countUp("[data-pb-zahl]", { start: "top 94%", duration: 1.1 });
      });
    },
    { scope },
  );

  // Ohne belegbare Zahlen UND ohne Bewertung gibt es nichts zu zeigen. Eine
  // Beleg-Zeile ohne Belege ist schlimmer als keine.
  if (!kennzahlen?.length && !bewertungen) return null;

  return (
    <section
      ref={scope}
      data-nav-theme="dark"
      data-surface="dark"
      aria-label="Zahlen und Bewertung"
      className="border-y border-ep-accent/25 bg-ep-navy text-white"
    >
      {/* EINE ZEILE, KEIN BLOCK (12.08.) Vorher war das ein vierspaltiges Raster mit `t-stat`-Werten und
          `py-16` – rund 200 px hoch und damit optisch eine eigene Sektion.
          Das ist zu viel Gewicht für eine Beleg-Leiste: Sie soll etwas
          BESTÄTIGEN, was daneben behauptet wird, nicht selbst eine Aussage
          aufmachen.

          Jetzt eine schmale Zeile. Wert und Label stehen nebeneinander statt
          übereinander – das halbiert die Höhe und liest sich als Angabe
          („5 Jahre Erfahrung") statt als Kennzahl mit Bildunterschrift.

          KEIN `<dl>` MEHR. Die alte Fassung hatte je Eintrag ein
          `<dt class="sr-only">` mit dem Label UND dasselbe Label sichtbar im
          `<dd>`. Vorlesesoftware las dadurch jede Angabe doppelt. Eine Liste
          aus Wert-plus-Label-Paaren braucht keine Definitionsliste, sie ist
          keine Begriffserklärung. */}
      <div className="ep-container py-5 sm:py-6">
        {/* ZWEITER ANLAUF (13.08.) – MOBIL EINE SPALTE, KEIN RASTER MEHR.
            Die vorherige Fassung presste die Angaben mobil in zwei
            Grid-Spalten zu je ~171 px. Selbst mit `flex-wrap` gegen den
            Overflow blieb das hässlich: eine Bewertungszelle, die zeilenweise
            zerbricht, neben einer „Förderung"-Zelle, die es nicht tut –
            ungleiche Zeilenzahl, ungleiche Höhe, krumme Kanten. Der Fehler
            war nicht das Wrapping, sondern der Zwang, vier Angaben unter
            600 px überhaupt nebeneinander zu pressen.
            Jetzt: EINE Spalte, jede Angabe ihre eigene volle Breite – exakt
            das Datenblatt-Muster, nur senkrecht statt waagerecht. Haarlinien
            trennen die Zeilen (`border-b`), nicht mehr die Spalten. Ab `sm`
            unverändert das vierspaltige Raster mit `border-l` – dort ist
            genug Breite, um es „bereits perfekt" (Emre) sein zu lassen. */}
        <ul className="flex flex-col sm:grid sm:grid-cols-4">
          {/* Die Bewertung zuerst: Sie ist die einzige Angabe hier, die
              nicht von uns stammt. */}
          {bewertungen && (
            <li className="flex items-baseline gap-2.5 border-b border-ep-line-dark py-3 sm:border-b-0 sm:py-0">
              <span
                data-pb-zahl
                className="text-[1.375rem] font-bold leading-none text-white [font-variant-numeric:tabular-nums]"
              >
                {formatiereNote(bewertungen.note)}
              </span>
              <span className="flex items-center gap-0.5" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={
                      i < Math.round(bewertungen.note)
                        ? "size-3.5 fill-ep-accent text-ep-accent"
                        : "size-3.5 text-white/25"
                    }
                  />
                ))}
              </span>
              <span className="flex items-center gap-1.5 text-[14px] text-white/60">
                <GoogleG className="size-3.5 shrink-0" />
                {bewertungen.anzahl}{" "}
                {bewertungen.anzahl === 1 ? "Bewertung" : "Bewertungen"}
              </span>
            </li>
          )}

          {kennzahlen?.map((k, i) => (
            <li
              key={k.label}
              data-pb-item
              className={cn(
                "flex items-baseline gap-2.5 py-3 sm:py-0",
                // Haarlinie links ab `sm` – dieselbe Spur wie vorher, nur
                // nicht mehr auch für Mobil zuständig (siehe `border-b`
                // unten). „Erfahrung" (i===0) ist unter sm ausgeblendet
                // (13.08., Kundenwunsch) und bekommt die Leiste deshalb erst
                // ab sm, wo sie tatsächlich sichtbar ist.
                "sm:border-l sm:border-ep-line-dark sm:pl-6",
                !bewertungen && i === 0 && "sm:border-l-0 sm:pl-0",
                i === 0 && "max-sm:hidden",
                // Haarlinie unten zwischen den Mobil-Zeilen. „24 Std." (i===2)
                // ist immer die letzte Zeile – DOM-Reihenfolge ändert sich
                // nie, unabhängig davon, ob eine Bewertung voransteht. Sie
                // bekommt deshalb nie eine untere Linie, alle davor immer.
                i !== 2 && "border-b border-ep-line-dark sm:border-b-0",
              )}
            >
              <span
                data-pb-zahl
                className="text-[1.375rem] font-bold leading-none text-ep-accent [font-variant-numeric:tabular-nums]"
              >
                {k.wert}
              </span>
              <span className="text-[14px] leading-snug text-white/60">
                {k.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
