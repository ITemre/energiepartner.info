"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star } from "lucide-react";
import { GoogleG } from "@/components/ui/GoogleG";
import { formatiereNote, type GoogleBewertungen } from "@/lib/google-reviews";
import type { Kennzahl } from "@/lib/proof";
import { revealItems } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Die Beleg-Zeile.
 *
 * ═══ WARUM NACH DER BILDSTRECKE ═══
 * Sie stand bis 07.08. direkt unter dem Hero und hat mit der Förderung die
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
 * ═══ FORM ═══
 * Navy, einen Ton HELLER als der Hero (`ep-navy` statt `navy-deep`), dazu
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
      aria-label="Zahlen und Bewertung"
      className="border-t border-ep-sun/25 bg-ep-navy text-white"
    >
      <div className="ep-container py-12 sm:py-16">
        <div className="lg:flex lg:items-stretch lg:gap-12">
          {/* Die Kennzahlen. Der Wert trägt, das Label erklärt – deshalb
              Wert groß und Label klein, nicht umgekehrt. Vier Werte in
              gleicher Größe nebeneinander wären eine Tabelle; hier soll man
              vier Aussagen lesen. */}
          {kennzahlen?.length ? (
            <dl className="grid flex-1 grid-cols-2 gap-x-8 gap-y-8 lg:grid-cols-4">
              {kennzahlen.map((k, i) => (
                <div
                  key={k.label}
                  data-pb-item
                  className={[
                    "border-t border-ep-line-dark pt-5",
                    // Auf Mobil zwei Spalten, ab lg vier – die senkrechten
                    // Trenner müssen sich entsprechend mitverschieben.
                    i % 2 === 1 ? "border-l border-ep-line-dark pl-6 lg:border-l-0 lg:pl-0" : "",
                    i > 0 ? "lg:border-l lg:border-ep-line-dark lg:pl-8" : "",
                  ].join(" ")}
                >
                  <dt className="sr-only">{k.label}</dt>
                  <dd>
                    <span className="t-stat block text-ep-sun">{k.wert}</span>
                    <span className="mt-2 block max-w-[18ch] text-[15px] leading-snug text-white/70">
                      {k.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}

          {/* Die Bewertung. Steht rechts als eigener Block und nicht als
              fünfte Kennzahl – sie ist die einzige Aussage hier, die nicht
              von uns stammt, und genau das ist ihr Wert. */}
          {bewertungen && (
            <div
              data-pb-item
              className="mt-12 shrink-0 border-t border-ep-line-dark pt-5 lg:mt-0 lg:w-56 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"
            >
              <div className="flex items-end gap-3">
                <span className="t-stat text-white">
                  {formatiereNote(bewertungen.note)}
                </span>
                <div className="pb-1">
                  <span className="flex items-center gap-0.5" aria-hidden="true">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={
                          i < Math.round(bewertungen.note)
                            ? "size-3.5 fill-ep-sun text-ep-sun"
                            : "size-3.5 text-white/25"
                        }
                      />
                    ))}
                  </span>
                </div>
              </div>
              <p className="mt-2 flex items-center gap-2 text-[15px] text-white/70">
                <GoogleG className="size-3.5 shrink-0" />
                {bewertungen.anzahl}{" "}
                {bewertungen.anzahl === 1 ? "Bewertung" : "Bewertungen"} bei Google
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
