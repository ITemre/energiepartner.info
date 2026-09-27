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


const WECHSEL = 0.4;

export function Testimonials({
  bewertungen,
}: {
  bewertungen: GoogleBewertungen | null;
}) {
  const scope = useRef<HTMLElement>(null);
  const buehne = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        revealItems("[data-t-reveal]", { distance: 20, start: "top 88%" });

        return maskedHeadline({
          headline: "[data-t-h2]",
          follow: "[data-t-eyebrow]",
          scrollTrigger: { trigger: scope.current, start: "top 80%", once: true },
        });
      });
    },
    { scope },
  );

  /* Ohne echte Rezensionen bleibt eine schmale, ehrliche Zeile stehen statt
     einer leeren Bühne. Die Sektion ganz auszublenden wäre auch vertretbar –
     aber `#referenzen` ist ein Navigationsziel, und ein Sprungziel, das ins
     Leere führt, ist schlechter als ein kurzer wahrer Satz. */
  if (!bewertungen) {
    return (
      <section
        ref={scope}
        id="referenzen"
        data-nav-theme="light"
        className="scroll-mt-[var(--nav-h)] bg-ep-paper"
      >
        <div className="ep-container py-24 sm:py-32">
          <p data-t-eyebrow className="t-label text-ep-accent">
            Rezensionen
          </p>
          <h2 data-t-h2 className="t-h2 mt-4 max-w-[22ch] text-ep-ink">
            Die ersten Anlagen laufen.{" "}
            <span className="text-ep-navy">Die Bewertungen kommen.</span>
          </h2>
          <p data-t-reveal className="t-lead mt-8 max-w-[52ch] text-ep-ink/70">
            Wir zeigen hier ausschließlich echte Google-Rezensionen. Solange
            keine vorliegen, steht an dieser Stelle nichts. Fragen Sie uns nach
            Referenzen, wir nennen Ihnen gern welche.
          </p>
        </div>
      </section>
    );
  }

  const { quelle, note, anzahl, profilUrl, rezensionen } = bewertungen;
  const vonGoogle = quelle === "google";
  const mehrAlsEine = rezensionen.length > 1;

  /**
   * Weiterschalten.
   *
   * `richtung` steuert, aus welcher Seite das neue Zitat hereinkommt. Das
   * ist nicht Zierde: Ohne Richtung fühlt sich „zurück" genauso an wie
   * „weiter", und dann weiß man nach zwei Klicks nicht mehr, wo man ist.
   *
   * Bewusst ohne Umbruch am Ende in eine Sackgasse – die Liste läuft im
   * Kreis. Vier Stimmen sind zu wenige, um jemanden am Ende der Reihe mit
   * einem toten Knopf stehen zu lassen.
   */
  function schalte(richtung: 1 | -1) {
    const naechster =
      (index + richtung + rezensionen.length) % rezensionen.length;
    setIndex(naechster);

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
      id="referenzen"
      data-nav-theme="light"
      /* KEIN `min-h-svh` MEHR (13.08.). Stand vorher wie Förderung und
         Ablauf auf einen vollen Bildschirm – die überschüssige Höhe sammelte
         sich unten vor Leistungen zu einer spürbar zu großen Lücke. Der
         Inhalt hier ist kürzer als eine volle Bildschirmhöhe und braucht sie
         nicht: Die Sektion läuft jetzt im normalen Fluss mit eigenem, festem
         Polster – vorhersehbarer Abstand statt Restfläche, die von der
         Fensterhöhe abhängt.

         OBEN SCHMAL, UNTEN GROSSZÜGIG, nicht symmetrisch. Förderung
         zentriert ihren Inhalt weiterhin in einer vollen Bildschirmhöhe
         (siehe dort) und lässt dadurch selbst schon Luft an ihrer Unterkante.
         Ein zusätzlich großes `pt` hier addierte sich zu dieser Luft und die
         Naht zu Förderung wurde wieder zu breit. Unten bleibt der Abstand zu
         Leistungen dagegen groß, dort gibt es diese Vorluft nicht. */
      className="scroll-mt-[var(--nav-h)] bg-ep-paper"
    >
      <div className="ep-container pb-20 pt-16 sm:pb-24 sm:pt-20 lg:pb-28 lg:pt-[clamp(1rem,3svh,2.5rem)]">
        {/* KOPF: Kennung links, der nachprüfbare Teil rechts Dieselbe Aufteilung wie in der Förderung, wo die 22.400 € neben
            der Überschrift stehen. Die Kennzahl gehört nach oben und nicht
            zum Zitat: Sie gilt für alle vier Stimmen und darf beim
            Weiterschalten nicht mitwandern. */}
        <div className="flex flex-col gap-6 border-b border-ep-line pb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
          <div>
            <p data-t-eyebrow className="t-label text-ep-accent">
              Rezensionen
            </p>
            <h2
              data-t-h2
              className="t-h2 mt-3 text-ep-ink"
              style={{ fontSize: "min(clamp(1.75rem,3.4vw,3.25rem),7svh)" }}
            >
              Was Kunden{" "}
              <span className="text-ep-navy">sagen.</span>
            </h2>
          </div>

          <div data-t-reveal className="flex items-end gap-4 sm:shrink-0">
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
            halbe Breite –, dort stehen sie deshalb als Reihe ÜBER dem Zitat
            und `justify-between` schiebt sie an die Ränder, die Zählung in
            die Mitte.

            Die DOM-Reihenfolge ist `zurück · Zitat · weiter · Zählung`,
            weil sie ab lg unverändert gilt. Die Handy-Anordnung entsteht
            allein über `order`. Zwei getrennte Knopfpaare mit
            `hidden`/`lg:flex` wären vier Knöpfe im Baum, jeder mit
            derselben Beschriftung – für Vorlesesoftware doppelt so viele
            Bedienelemente wie es gibt. */}
        <div
          role="group"
          aria-label="Kundenstimmen"
          aria-roledescription="Karussell"
          onKeyDown={taste}
          className="mt-14 flex flex-wrap items-center justify-between gap-x-4 gap-y-8 sm:mt-16 lg:mt-[clamp(2.5rem,6svh,5.5rem)] lg:flex-nowrap lg:gap-x-10"
        >
          {mehrAlsEine && (
            <Pfeil
              richtung="zurueck"
              onClick={() => schalte(-1)}
              className="order-1 lg:order-none"
            />
          )}

          {/* ALLE VIER ZITATE LIEGEN IN DERSELBEN RASTERZELLE.
              Die vier Texte sind unterschiedlich lang, und ohne das sprang
              alles darunter bei jedem Wechsel nach oben oder unten.

              `grid` mit `col-start-1 row-start-1` an jedem Zitat: Der Kasten
              ist immer so hoch wie das LÄNGSTE, unabhängig davon, welches
              gerade sichtbar ist. Kein geschätztes `min-h`, das bei neuer
              Copy wieder falsch wäre – die Höhe kommt aus dem Inhalt selbst.

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
                  {/* HIER STANDEN DIE STERNE DER EINZELNEN STIMME, raus am
                      12.08. Die Gesamtnote steht mit Sternen im Kopf der
                      Sektion; bei vier Fünf-Sterne-Rezensionen ist die
                      Wiederholung an jedem Zitat eine Grafik ohne
                      Information.

                      AB lg OHNE ZEILENDECKEL. Die Zeilenlänge folgt der
                      Spaltenbreite, das Zitat nutzt also die volle Fläche
                      zwischen den Pfeilen. Damit die Zeilen dabei nicht
                      unlesbar lang werden, wächst die SCHRIFT mit (bis
                      48 px auf 1920) – mehr Schrift bei gleicher Breite
                      heißt weniger Zeichen pro Zeile. Unter lg bleibt der
                      Deckel bei 40 Zeichen, dort gibt die Breite ohnehin
                      nichts her.

                      EINE GRÖSSE FÜR ALLE VIER, nicht nach Textlänge.
                      `zitatKlassen` wählt die Größe aus der Länge – richtig,
                      wenn Zitate NEBENEINANDER stehen. Hier stehen sie
                      NACHEINANDER an derselben Stelle, und dann wäre
                      wechselnde Schriftgröße ein Springen beim Klicken. */}
                  <blockquote className="max-w-[40ch] text-[min(clamp(1.375rem,2.5vw,3rem),5.4svh)] font-normal leading-[1.34] tracking-[-0.01em] text-ep-ink lg:max-w-none">
                    „{r.text}&ldquo;
                  </blockquote>

                  <figcaption className="mt-8 flex items-center gap-4 lg:mt-[clamp(1rem,2.5svh,2.5rem)]">
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
                      {/* HIER STAND DIE ZEITANGABE („vor 2 Monaten"), raus
                          am 12.08.

                          Sie war als Teil der Attribution gedacht. Verlangt
                          ist sie dafür nicht: Google fordert, dass eine
                          Rezension dem VERFASSER zugeordnet und als
                          Google-Inhalt erkennbar ist – das leisten der Name
                          und der Verweis darunter.

                          Inhaltlich hat sie sogar gegen die Sektion
                          gearbeitet: Bei vier Stimmen fällt „vor 4 Monaten"
                          sofort auf und lässt den Betrieb älter aussehen,
                          als er ist. Sobald echte Rezensionen laufend
                          dazukommen, kann sie zurück – dann trägt sie
                          Aktualität statt Alter. */}
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
              dort hätte sie zwischen ihnen keinen Platz und steht deshalb im
              Fuß der Sektion. */}
          {mehrAlsEine && (
            <p className="t-key order-2 text-ep-ink/60 [font-variant-numeric:tabular-nums] lg:hidden">
              {String(index + 1).padStart(2, "0")}
              <span className="mx-1 text-ep-ink/30">/</span>
              {String(rezensionen.length).padStart(2, "0")}
            </p>
          )}
        </div>

        {/* FUSS Pflichtangabe seit 2022: Wer mit Bewertungen wirbt, muss sagen,
            ob und wie er ihre Echtheit sicherstellt (§ 5b Abs. 3 UWG). Die
            Antwort ist hier einfach und stark – wir stellen sie nicht
            sicher, Google tut es, und wir zeigen ungefiltert, was dort
            steht. Nur bei echten Google-Daten: Eine Echtheitszusage über
            vorläufige Inhalte wäre die unwahrste Zeile der ganzen Seite. */}
        <div className="mt-10 flex flex-col gap-5 border-t border-ep-line pt-6 sm:flex-row sm:items-start sm:justify-between sm:gap-10 lg:mt-[clamp(1rem,3svh,3rem)]">
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
 * Ein Pfeilknopf.
 *
 * GEFÜLLT STATT KONTUR (12.08.) * Hier stand eine 1-px-Kontur in `ep-ink/20` – mit der Begründung, ein
 * gefüllter Knopf wäre auf Papier der lauteste Punkt der Sektion und das
 * solle das Zitat sein.
 *
 * Die Begründung war falsch gerechnet: Zwei Kreise von 48 px können einer
 * Überschrift von 40 px nichts wegnehmen. Was tatsächlich passierte, war
 * das Gegenteil – 20 % Deckkraft auf #FBF6EE ergibt einen Kontrast von rund
 * 1,3:1, die Knöpfe verschwanden schlicht. Und sie sind das EINZIGE
 * Bedienelement der Sektion: Wer sie übersieht, sieht drei von vier
 * Rezensionen nie. Das ist ein Funktionsfehler, kein Schönheitsfehler.
 *
 * Der erste Versuch der Korrektur war dann flächiges Navy – und das war zu
 * viel. Zwei gefüllte Scheiben auf einer hellen, ruhigen Fläche ziehen den
 * Blick VOR dem Zitat auf sich, und damit hätten sie das Problem nur
 * umgedreht.
 *
 * Jetzt der Mittelweg: 2 px Kontur in vollem Navy, Pfeil in Navy, innen
 * Luft. Der Kontrast von Navy auf Papier liegt bei rund 11:1, die Knöpfe
 * sind also zweifelsfrei da – aber sie sind ein Umriss und keine Fläche,
 * und Umrisse treten hinter Text zurück. Erst beim Überfahren füllt sich
 * der Kreis: Rückmeldung dort, wo sie gebraucht wird, statt Dauerpräsenz.
 *
 * Bewusst NICHT Orange: Das ist auf Papier die Akzentfarbe für Text
 * (Eyebrow, Kennzahlen, die 80 Prozent). Ein zweiter oranger Punkt im
 * selben Bild macht aus einer Hierarchie eine Ansammlung.
 *
 * Flach, ohne Schatten und ohne Verlauf – CI-Regel für Navy.
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
