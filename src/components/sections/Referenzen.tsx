"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { BendLine } from "@/components/ui/BendLine";
import type { Referenzfall } from "@/lib/proof";
import { maskedHeadline, revealItems } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * „Drei Häuser, drei Befunde."
 *
 * ═══ DIE EINZIGE SEKTION, DIE NICHT ÜBER UNS SPRICHT ═══
 * Der restliche Auftritt beschreibt, wer wir sind und wie wir arbeiten. Das
 * ist Selbstbeschreibung, und ein Besucher liest sie auch als solche. Hier
 * steht stattdessen, was bei jemand anderem herauskam. Das ist die einzige
 * Textsorte auf einer Anbieterseite, die nicht als Eigenlob gelesen wird –
 * vorausgesetzt, sie enthält Zahlen. Ohne Zahlen ist ein Referenzfall nur
 * eine längere Behauptung.
 *
 * ═══ AUFBAU JE FALL ═══
 * Ausgangslage → Befund → Ergebnis. Die Mitte ist der Teil, der uns von
 * einem Installateur unterscheidet: WAS WIR GEFUNDEN HABEN. Ein Fall, der
 * nur „Anlage eingebaut, Kunde zufrieden" erzählt, könnte von jedem stammen.
 *
 * Keine Kundennamen: Es sind Privathaushalte. Ort und Gebäudeart sind
 * konkret genug, um vorstellbar zu sein, und nennen niemanden.
 *
 * ⚠️ Die Fälle sind vorläufig (siehe `lib/proof.ts`) und zeigen Ilias die
 * Form, in der wir seine echten brauchen. Sie hängen an
 * `PLATZHALTER_INHALTE` und gehen ohne diese Variable nicht mit.
 */
export function Referenzen({ faelle }: { faelle: Referenzfall[] | null }) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!faelle?.length) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        revealItems("[data-ref-fall]", { distance: 26, start: "top 88%" });

        return maskedHeadline({
          headline: "[data-ref-h2]",
          follow: "[data-ref-eyebrow]",
          scrollTrigger: { trigger: scope.current, start: "top 80%", once: true },
        });
      });
    },
    { scope, dependencies: [faelle] },
  );

  // Ohne belegbare Fälle keine Sektion. Eine Referenzstrecke mit einem
  // einzigen vagen Beispiel schadet mehr, als sie nützt.
  if (!faelle?.length) return null;

  return (
    <section
      ref={scope}
      id="referenzfaelle"
      data-nav-theme="light"
      className="scroll-mt-[var(--nav-h)] bg-ep-paper"
    >
      <div className="ep-container py-28 sm:py-40 lg:py-48">
        <div>
          <p data-ref-eyebrow className="t-label text-ep-accent">
            Aus der Praxis
          </p>
          <h2 data-ref-h2 className="t-h2 mt-6 max-w-[17ch] text-ep-ink">
            Drei Häuser.{" "}
            <span className="text-ep-navy">Drei Befunde.</span>
          </h2>
        </div>

        <div className="mt-20 sm:mt-28 lg:mt-36">
          {faelle.map((fall, i) => (
            <article key={`${fall.ort}-${i}`} data-ref-fall>
              <BendLine className="origin-left text-ep-line" />

              <div className="py-14 sm:py-20 lg:py-24">
                {/* Kopf: Ort und Gebäude als Kennung. Sie machen den Fall
                    vorstellbar, ohne jemanden zu nennen. */}
                <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
                  <span className="t-label text-ep-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-[clamp(1.5rem,2.8vw,2.25rem)] font-bold leading-tight tracking-[-0.025em] text-ep-ink">
                    {fall.ort}
                  </h3>
                  <span className="t-key text-ep-ink/60">{fall.gebaeude}</span>
                </div>

                <div className="mt-10 lg:grid lg:grid-cols-12 lg:gap-x-12">
                  {/* Ausgangslage und Befund – der erzählende Teil. */}
                  <div className="lg:col-span-6">
                    <p className="t-key text-ep-ink/60">Ausgangslage</p>
                    <p className="mt-3 max-w-[52ch] text-lg leading-relaxed text-ep-ink/80">
                      {fall.ausgangslage}
                    </p>

                    {/* DER BEFUND ist das Herzstück. Er steht deshalb
                        ausgezeichnet an der Akzentkante und nicht als
                        dritter Absatz im Fließtext: Was wir gefunden haben,
                        ist der Unterschied zwischen uns und einem Betrieb,
                        der nur einbaut. */}
                    <div className="mt-8 border-l-2 border-ep-accent pl-6">
                      <p className="t-key text-ep-accent">Befund</p>
                      <p className="mt-3 max-w-[50ch] text-[clamp(1.125rem,1.6vw,1.375rem)] font-medium leading-snug text-ep-ink">
                        {fall.befund}
                      </p>
                    </div>
                  </div>

                  {/* Das Ergebnis – der zählbare Teil. Große Werte, kleine
                      Erklärung. Wer nur überfliegt, nimmt die Zahlen mit,
                      und die tragen den Fall allein. */}
                  <dl className="mt-12 lg:col-span-5 lg:col-start-8 lg:mt-0">
                    <dt className="t-key text-ep-ink/60">Ergebnis</dt>
                    <dd className="mt-5 flex flex-col">
                      {fall.ergebnis.map((e) => (
                        <span
                          key={e.text}
                          className="flex flex-col gap-1 border-t border-ep-line py-5 last:border-b last:border-ep-line"
                        >
                          <span className="t-stat text-ep-navy">{e.wert}</span>
                          <span className="max-w-[34ch] text-[15px] leading-snug text-ep-ink/70">
                            {e.text}
                          </span>
                        </span>
                      ))}
                    </dd>
                  </dl>
                </div>
              </div>
            </article>
          ))}
          <BendLine className="origin-left text-ep-line" />
        </div>

        {/* HIER STAND EINE ERKLÄRUNG, WARUM KEINE NAMEN DASTEHEN.
            Raus, und zwar ersatzlos: Niemand erwartet bei einem
            Privathaushalt einen Klarnamen, die Frage stellt sich gar nicht.
            Der Satz hat sie erst aufgeworfen und dann beantwortet – und
            damit am Ende einer Beleg-Strecke einen Zweifel gesät, wo gerade
            Vertrauen aufgebaut wurde. Eine Rechtfertigung, nach der niemand
            gefragt hat, klingt immer nach Ausrede. */}
      </div>
    </section>
  );
}
