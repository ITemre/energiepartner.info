"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Star } from "lucide-react";
import { GoogleG } from "@/components/ui/GoogleG";
import {
  formatiereNote,
  zitatKlassen,
  type GoogleBewertungen,
} from "@/lib/google-reviews";
import { maskedHeadline, revealItems } from "@/lib/motion";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * Stimmen zur Angebotsprüfung – echte Google-Rezensionen.
 *
 * ⚠️ HIER STANDEN ZWEI AUSFORMULIERTE WUNSCHREZENSIONEN aus dem
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
 * Kein leeres Band, kein Platzhalter: Solange es nichts Belegbares gibt,
 * existiert die Sektion für den Besucher nicht. Auf einer Leadstrecke ist
 * eine leere Vertrauenssektion schlimmer als gar keine.
 */
export function AvStimmen({
  bewertungen,
}: {
  bewertungen: GoogleBewertungen | null;
}) {
  const scope = useRef<HTMLElement>(null);

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

  return (
    <section
      ref={scope}
      id="stimmen"
      data-nav-theme="light"
      className="scroll-mt-[var(--nav-h)] bg-ep-paper"
    >
      <div className="ep-container py-24 sm:py-32">
        <div className="lg:flex lg:items-end lg:justify-between lg:gap-16">
          <h2 data-st-h2 className="t-h2 max-w-[16ch] text-ep-ink">
            Was andere{" "}
            <span className="text-ep-navy">vor der Unterschrift erfahren haben.</span>
          </h2>

          <div data-st-block className="mt-10 shrink-0 lg:mt-0">
            <div className="flex items-end gap-4">
              <span className="t-stat text-ep-ink">{formatiereNote(note)}</span>
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
                <p className="t-key mt-1.5 flex items-center gap-2 text-ep-ink/70">
                  <GoogleG className="size-3.5 shrink-0" />
                  {anzahl} {anzahl === 1 ? "Bewertung" : "Bewertungen"}
                </p>
              </div>
            </div>

            {profilUrl && (
              <a
                href={profilUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="t-key mt-3 inline-block text-ep-ink/60 underline underline-offset-4 outline-none transition-colors hover:text-ep-ink focus-visible:text-ep-ink"
              >
                Bei Google ansehen
              </a>
            )}
          </div>
        </div>

        <ul className="mt-16 grid border-t border-ep-line sm:mt-20 lg:grid-cols-2">
          {rezensionen.map((r, i) => (
            <li
              key={`${r.autor}-${i}`}
              data-st-block
              className={[
                "border-b border-ep-line py-10 pr-8 sm:py-14",
                i % 2 === 1 ? "lg:border-l lg:border-ep-line lg:pl-12" : "",
              ].join(" ")}
            >
              <span className="flex items-center gap-0.5" aria-hidden="true">
                {Array.from({ length: r.sterne }).map((_, s) => (
                  <Star
                    key={s}
                    className="size-3.5 fill-ep-accent text-ep-accent"
                  />
                ))}
              </span>

              {/* Größe und Zeilenlänge kommen aus der Textlänge
                  (`zitatKlassen`) – nichts wird abgeschnitten. Vorher stand
                  hier ein `line-clamp-[6]`, das mitten im Satz ein „…"
                  erzeugte. Siehe die Begründung an der Funktion. */}
              <blockquote
                className={cn(
                  "mt-6 text-ep-ink",
                  zitatKlassen(r.text, { anzahl: rezensionen.length }),
                )}
              >
                „{r.text}&ldquo;
              </blockquote>

              <figcaption className="mt-7 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-semibold text-ep-ink">{r.autor}</span>
                <span className="t-key text-ep-ink/60">{r.wann}</span>
                {vonGoogle && r.url && (
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="t-key text-ep-ink/60 underline underline-offset-4 outline-none transition-colors hover:text-ep-ink focus-visible:text-ep-ink"
                  >
                    bei Google
                  </a>
                )}
              </figcaption>
            </li>
          ))}
        </ul>

        {/* Nur bei echten Google-Daten – eine Echtheitszusage über
            vorläufige Inhalte wäre die unwahrste Zeile der Seite. */}
        {vonGoogle && (
          <p data-st-block className="mt-12 max-w-[68ch] text-sm leading-relaxed text-ep-ink/60">
            Alle Bewertungen stammen unverändert aus unserem
            Google-Unternehmensprofil und werden automatisch von dort geladen.
            Wir wählen nicht aus, welche erscheinen.
          </p>
        )}
      </div>
    </section>
  );
}
