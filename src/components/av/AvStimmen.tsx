"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { GoogleG } from "@/components/ui/GoogleG";
import { formatiereNote, type GoogleBewertungen } from "@/lib/google-reviews";
import { maskedHeadline, revealItems } from "@/lib/motion";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * Stimmen zur Angebotsprüfung – echte Google-Rezensionen.
 *
 * HIER STANDEN ZWEI AUSFORMULIERTE WUNSCHREZENSIONEN aus dem
 * Markenhandbuch („Sandra B. · Fellbach", „Thomas R. · Waiblingen"), die ein
 * Handschalter freigeben sollte. Beides ist entfallen: die Zitate, weil sie
 * erfunden waren, und der Schalter, weil die Datenlage die Frage besser
 * beantwortet. Die Sektion zeigt jetzt, was im Google-Profil steht – oder
 * nichts.
 *
 * Erfundene Kundenstimmen sind keine Zuspitzung, sondern eine
 * Tatsachenbehauptung über etwas, das es nicht gibt (§ 5 UWG, dazu seit 2022
 * die Pflicht anzugeben, ob und wie Bewertungen auf Echtheit geprüft werden).
 *
 * EINE STIMME ZUR ZEIT (08.09.) * Hier stand bis eben ein zweispaltiges Raster mit allen Rezensionen
 * gleichzeitig – die Fassung, die auf energiepartner.info am 12.08.
 * ausdrücklich verworfen wurde. Der Grund gilt hier genauso: Vier Zitate
 * nebeneinander lesen sich als Wand. Man überfliegt sie, greift eines
 * heraus und glaubt am Ende keinem. Eine einzelne Stimme in
 * Auszeichnungsgröße wird gelesen.
 *
 * NIEMALS AUTOMATISCH WEITERSCHALTEN. Derselbe Satz steht in
 * `Testimonials.tsx`, und er ist dort aus Erfahrung notiert: Wer eine
 * Rezension zu Ende lesen will und dabei vom nächsten Wechsel unterbrochen
 * wird, prüft keinen Beleg mehr. Ein Beleg, der wegläuft, während man ihn
 * prüft, ist das Gegenteil eines Belegs.
 *
 * WAS ANDERS IST ALS AUF energiepartner.info * Dort bleibt ohne Rezensionen eine ehrliche Ersatzzeile stehen, weil
 * `#referenzen` ein Navigationsziel ist und nicht ins Leere springen darf.
 * Hier gibt es kein Menü und damit keinen Zwang: Ohne Daten rendert die
 * Sektion `null` und existiert für den Besucher nicht. Auf einer
 * Leadstrecke ist eine leere Vertrauenssektion schlechter als gar keine.
 */

/** Dauer des Zitatwechsels. Kurz genug, dass Klicken sich direkt anfühlt. */
const WECHSEL = 0.4;

export function AvStimmen({
  bewertungen,
}: {
  bewertungen: GoogleBewertungen | null;
}) {
  const scope = useRef<HTMLElement>(null);
  const buehne = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useGSAP(
    () => {
      if (!bewertungen) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        revealItems("[data-st-block]", { distance: 22, start: "top 88%" });

        return maskedHeadline({
          headline: "[data-st-h2]",
          scrollTrigger: { trigger: scope.current, start: "top 80%", once: true },
        });
      });
    },
    { scope, dependencies: [bewertungen] },
  );

  if (!bewertungen) return null;

  const { quelle, note, anzahl, profilUrl, rezensionen } = bewertungen;
  /* Steuert nur die Pflichtangabe zur Echtheitsprüfung am Sektionsende –
     eine Tatsachenbehauptung über die Herkunft der Texte. Alles Sichtbare
     (Sterne, Note, Google-Zeichen) steht unabhängig davon. */
  const vonGoogle = quelle === "google";
  const mehrAlsEine = rezensionen.length > 1;

  /**
   * Weiterschalten.
   *
   * `richtung` steuert, aus welcher Seite das neue Zitat hereinkommt. Ohne
   * Richtung fühlt sich „zurück" genauso an wie „weiter", und nach zwei
   * Klicks weiß niemand mehr, wo er ist.
   *
   * Die Liste läuft im Kreis. Vier Stimmen sind zu wenige, um jemanden am
   * Ende der Reihe mit einem toten Knopf stehen zu lassen.
   */
  function schalte(richtung: 1 | -1) {
    setIndex((i) => (i + richtung + rezensionen.length) % rezensionen.length);

    if (!buehne.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.fromTo(
      buehne.current,
      { x: 34 * richtung, autoAlpha: 0 },
      {
        x: 0,
        autoAlpha: 1,
        duration: WECHSEL,
        ease: "power2.out",
        overwrite: true,
      },
    );
  }

  /** Pfeiltasten, wenn der Bereich den Fokus hat. Ein Karussell, das man nur
   *  mit der Maus bedienen kann, ist für Tastaturnutzer eine Wand. */
  function taste(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      schalte(1);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      schalte(-1);
    }
  }

  return (
    <section
      ref={scope}
      id="stimmen"
      data-nav-theme="light"
      className="scroll-mt-[var(--nav-h)] bg-ep-paper"
    >
      <div className="ep-container py-20 sm:py-24 lg:py-28">
        {/* KOPF: Aussage links, der nachprüfbare Teil rechts Die Gesamtnote gehört nach oben und nicht zum Zitat: Sie gilt für
            alle Stimmen und darf beim Weiterschalten nicht mitwandern. */}
        <div className="flex flex-col gap-6 border-b border-ep-line pb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
          <h2
            data-st-h2
            className="t-h2 max-w-[16ch] text-ep-ink"
            style={{ fontSize: "min(clamp(1.75rem,3.4vw,3.25rem),7svh)" }}
          >
            Was andere{" "}
            <span className="text-ep-navy">vor der Unterschrift erfahren haben.</span>
          </h2>

          <div data-st-block className="flex items-end gap-4 sm:shrink-0">
            <span className="text-[min(clamp(2rem,3.4vw,3rem),6svh)] font-bold leading-none tracking-[-0.02em] text-ep-ink [font-variant-numeric:tabular-nums]">
              {formatiereNote(note)}
            </span>
            <div className="pb-1">
              <span className="flex items-center gap-0.5" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={
                      i < Math.round(note)
                        ? "size-4 fill-ep-accent text-ep-accent"
                        : "size-4 text-ep-line"
                    }
                  />
                ))}
              </span>
              <p className="t-key mt-1.5 flex flex-wrap items-baseline gap-x-2 text-ep-ink/65">
                <GoogleG className="size-3.5 shrink-0 self-center" />
                {anzahl} {anzahl === 1 ? "Bewertung" : "Bewertungen"}
                {profilUrl && (
                  <a
                    href={profilUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 outline-none transition-colors hover:text-ep-ink focus-visible:text-ep-ink"
                  >
                    ansehen
                  </a>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* BÜHNE UND STEUERUNG Zwei Anordnungen aus einer Markup-Reihenfolge, gesteuert über
            `order`:

              ab lg    ←  [ Zitat, volle Breite ]  →
              darunter ←      01 / 04             →
                       [ Zitat ]

            Auf dem Desktop flankieren die Pfeile das Zitat. Auf dem Handy
            wäre das falsch – zwei Knöpfe an den Rändern nähmen dem Text die
            halbe Breite –, dort stehen sie als Reihe ÜBER dem Zitat.

            Die DOM-Reihenfolge ist `zurück · Zitat · weiter · Zählung`,
            weil sie ab lg unverändert gilt. Zwei getrennte Knopfpaare mit
            `hidden`/`lg:flex` wären vier Knöpfe im Baum, jeder mit derselben
            Beschriftung – für Vorlesesoftware doppelt so viele
            Bedienelemente wie es gibt. */}
        <div
          role="group"
          aria-label="Kundenstimmen"
          aria-roledescription="Karussell"
          onKeyDown={taste}
          className="mt-14 flex flex-wrap items-center justify-between gap-x-4 gap-y-8 sm:mt-16 lg:mt-20 lg:flex-nowrap lg:gap-x-10"
        >
          {mehrAlsEine && (
            <Pfeil
              richtung="zurueck"
              onClick={() => schalte(-1)}
              className="order-1 lg:order-none"
            />
          )}

          {/* ALLE ZITATE LIEGEN IN DERSELBEN RASTERZELLE.
              Die Texte sind unterschiedlich lang, und ohne das spränge alles
              darunter bei jedem Wechsel nach oben oder unten.

              `grid` mit `col-start-1 row-start-1` an jedem Zitat: Der Kasten
              ist immer so hoch wie das LÄNGSTE, unabhängig davon, welches
              gerade sichtbar ist. Kein geschätztes `min-h`, das bei neuer
              Copy wieder falsch wäre.

              `visibility: hidden` statt `display: none`: Nur so behält die
              Zelle ihre Maße. Nebenbei nimmt es die verborgenen Zitate aus
              der Tabulator-Reihenfolge, ihre Google-Links sind also nicht
              heimlich fokussierbar.

              `aria-live="polite"`: Ohne die Ansage bemerkt eine
              Vorlesesoftware den Wechsel nicht – der Knopf hätte scheinbar
              nichts getan. */}
          <div
            ref={buehne}
            aria-live="polite"
            className="order-4 grid w-full min-w-0 lg:order-none lg:flex-1"
          >
            {rezensionen.map((r, i) => {
              const an = i === index;
              return (
                <figure
                  key={`${r.autor}-${i}`}
                  aria-hidden={!an}
                  className={cn(
                    "col-start-1 row-start-1 flex flex-col items-center text-center",
                    !an && "invisible",
                  )}
                >
                  {/* KEINE STERNE AM EINZELNEN ZITAT. Die Gesamtnote steht
                      mit Sternen im Kopf der Sektion; bei durchweg
                      Fünf-Sterne-Rezensionen ist die Wiederholung an jedem
                      Zitat eine Grafik ohne Information.

                      EINE GRÖSSE FÜR ALLE, nicht nach Textlänge.
                      `zitatKlassen` wählt die Größe aus der Länge – richtig,
                      wenn Zitate NEBENEINANDER stehen. Hier stehen sie
                      NACHEINANDER an derselben Stelle, und dann wäre
                      wechselnde Schriftgröße ein Springen beim Klicken. */}
                  <blockquote className="max-w-[40ch] text-[min(clamp(1.375rem,2.5vw,3rem),5.4svh)] font-normal leading-[1.34] tracking-[-0.01em] text-ep-ink lg:max-w-none">
                    „{r.text}&ldquo;
                  </blockquote>

                  <figcaption className="mt-8 flex items-center gap-4 lg:mt-10">
                    {r.autorBild && (
                      <span className="relative size-11 shrink-0 overflow-hidden rounded-full bg-ep-sand">
                        <Image
                          src={r.autorBild}
                          alt=""
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      </span>
                    )}
                    <span>
                      <span className="block font-semibold text-ep-ink">
                        {r.autor}
                      </span>
                      {vonGoogle && r.url && (
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="t-key mt-0.5 inline-block text-ep-ink/60 underline underline-offset-4 outline-none transition-colors hover:text-ep-ink focus-visible:text-ep-ink"
                        >
                          bei Google
                        </a>
                      )}
                    </span>
                  </figcaption>
                </figure>
              );
            })}
          </div>

          {mehrAlsEine && (
            <Pfeil
              richtung="weiter"
              onClick={() => schalte(1)}
              className="order-3 lg:order-none"
            />
          )}

          {/* Die Zählung – nur darunter, wo sie zwischen den beiden Pfeilen
              in der Kopfreihe steht. Ab lg flankieren die Pfeile das Zitat,
              dort hätte sie zwischen ihnen keinen Platz und steht im Fuß. */}
          {mehrAlsEine && (
            <p className="t-key order-2 text-ep-ink/60 [font-variant-numeric:tabular-nums] lg:hidden">
              {String(index + 1).padStart(2, "0")}
              <span className="mx-1 text-ep-ink/30">/</span>
              {String(rezensionen.length).padStart(2, "0")}
            </p>
          )}
        </div>

        {/* FUSS Pflichtangabe seit 2022: Wer mit Bewertungen wirbt, muss sagen, ob
            und wie er ihre Echtheit sicherstellt (§ 5b Abs. 3 UWG). Nur bei
            echten Google-Daten – eine Echtheitszusage über vorläufige Inhalte
            wäre die unwahrste Zeile der ganzen Seite. */}
        <div className="mt-10 flex flex-col gap-5 border-t border-ep-line pt-6 sm:flex-row sm:items-start sm:justify-between sm:gap-10 lg:mt-14">
          {vonGoogle ? (
            <p className="max-w-[68ch] text-[13px] leading-snug text-ep-ink/55">
              Alle Bewertungen stammen unverändert aus unserem
              Google-Unternehmensprofil und werden automatisch von dort
              geladen. Wir wählen nicht aus, welche erscheinen.
            </p>
          ) : (
            <span />
          )}

          {mehrAlsEine && (
            <p className="t-key hidden shrink-0 text-ep-ink/60 [font-variant-numeric:tabular-nums] lg:block">
              {String(index + 1).padStart(2, "0")}
              <span className="mx-1 text-ep-ink/30">/</span>
              {String(rezensionen.length).padStart(2, "0")}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * Ein Pfeilknopf. Gleiche Fassung wie auf energiepartner.info – beide
 * Sektionen stehen auf Papier, es gibt keinen Grund für zwei Gestaltungen.
 *
 * 2 px Kontur in vollem Navy, Pfeil in Navy, innen Luft. Navy auf Papier
 * liegt bei rund 11:1, die Knöpfe sind also zweifelsfrei da – aber sie sind
 * ein Umriss und keine Fläche, und Umrisse treten hinter Text zurück. Erst
 * beim Überfahren füllt sich der Kreis.
 *
 * Bewusst NICHT Orange: Das ist auf Papier die Akzentfarbe für Text. Ein
 * zweiter oranger Punkt im selben Bild macht aus einer Hierarchie eine
 * Ansammlung.
 */
function Pfeil({
  richtung,
  onClick,
  className,
}: {
  richtung: "zurueck" | "weiter";
  onClick: () => void;
  className?: string;
}) {
  const zurueck = richtung === "zurueck";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={zurueck ? "Vorherige Stimme" : "Nächste Stimme"}
      className={cn(
        "grid size-12 shrink-0 place-items-center rounded-full border-2 border-ep-navy text-ep-navy outline-none transition-colors",
        "hover:bg-ep-navy hover:text-white",
        "focus-visible:ring-2 focus-visible:ring-ep-accent-strong focus-visible:ring-offset-2 focus-visible:ring-offset-ep-paper",
        className,
      )}
    >
      {zurueck ? (
        <ArrowLeft className="size-5" aria-hidden="true" />
      ) : (
        <ArrowRight className="size-5" aria-hidden="true" />
      )}
    </button>
  );
}
