"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { maskedHeadline, revealItems } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * „Was Sie jetzt noch wissen wollen."
 *
 * ═══ EINWÄNDE, NICHT LEISTUNGEN ═══
 * Die meisten FAQ-Bereiche listen auf, was der Anbieter gern erzählt hätte
 * („Welche Leistungen bieten Sie an?"). Das ist eine Rubrik, kein Werkzeug.
 * Hier steht ausschließlich, was den Besucher an dieser Stelle wirklich vom
 * Anrufen abhält: der Preis, die Dauer, das Risiko, dass sein Haus nicht
 * geeignet ist, und die Frage, woran wir verdienen.
 *
 * Genau der letzte Punkt gehört hierher und nicht in die Mitte des
 * Verkaufsarguments: Wer sich fragt, was wir davon haben, sucht die Antwort
 * am Ende. Wer sie nicht sucht, wird von ihr nicht abgelenkt.
 *
 * ═══ WARUM HIER EIN AUFKLAPPER ERLAUBT IST ═══
 * Auf dieser Seite gilt sonst: nicht verbergen, sondern kürzen (siehe
 * Leistungen). Eine FAQ ist die eine Ausnahme, und zwar aus einem
 * strukturellen Grund: Niemand liest alle Antworten. Jeder liest ein bis
 * zwei. Sichtbar bleiben müssen deshalb die FRAGEN – wer seine eigene
 * wiedererkennt, klickt. Alles ausgeklappt wären das rund zwei Bildschirme
 * Text, durch die sich niemand arbeitet.
 *
 * ⚠️ Die Preisantwort braucht Ilias' Freigabe. Eine Spanne zu nennen filtert
 * die aus, für die es ohnehin nicht passt – das spart beiden Seiten den
 * Termin. Aber die Zahl muss von ihm kommen.
 */
const FRAGEN = [
  {
    frage: "Was kostet mich die Beratung?",
    antwort:
      "Nichts. Die Bestandsaufnahme, die Auslegung, die Wirtschaftlichkeitsrechnung und die Förderprüfung bekommen Sie, ohne dass Sie etwas beauftragen. Erst wenn Sie sich für eine Umsetzung entscheiden, entstehen Kosten, und die stehen vorher schriftlich fest.",
  },
  {
    frage: "Und was kostet die Anlage?",
    antwort:
      "Das hängt am Haus, deshalb nennt Ihnen niemand seriös vorab eine Zahl. Was wir Ihnen sagen können: Bei einem Einfamilienhaus liegt eine Wärmepumpe inklusive Einbau in aller Regel im mittleren fünfstelligen Bereich, bevor die Förderung abgezogen wird. Nach Abzug bleibt oft deutlich weniger übrig, als die meisten erwarten. Die konkrete Zahl für Ihr Haus steht in der Wirtschaftlichkeitsrechnung, die Sie kostenlos bekommen.",
    /* ⚠️ Von Ilias abzunehmen: Spanne bestätigen oder korrigieren. */
    freigabeOffen: true,
  },
  {
    frage: "Was, wenn mein Haus gar nicht geeignet ist?",
    antwort:
      "Dann sagen wir Ihnen das, und der Termin ist beendet. Eine Wärmepumpe in ein Haus zu planen, das dafür nicht taugt, produziert einen unzufriedenen Kunden und eine schlechte Bewertung. Uns nützt das nichts. In solchen Fällen sprechen wir über das, was tatsächlich zuerst hilft, etwa die Hülle oder eine andere Reihenfolge der Maßnahmen.",
  },
  {
    frage: "Wie lange dauert es vom ersten Gespräch bis zur fertigen Anlage?",
    antwort:
      "Rechnen Sie mit einigen Monaten. Beratung und Planung sind in Wochen erledigt, danach bestimmen Förderbescheid, Netzbetreiber und die Auslastung der Fachbetriebe das Tempo. Wir nennen Ihnen keinen Wunschtermin, sondern einen, den wir halten können, und sagen Ihnen, sobald sich etwas verschiebt.",
  },
  {
    frage: "Bauen Sie selbst ein?",
    antwort:
      "Nein. Wir beraten, planen und vergleichen anbieterübergreifend, die Ausführung übernehmen geprüfte Fachbetriebe. Für Sie ändert das nichts an der Zuständigkeit: Ihr Ansprechpartner bleibt derselbe, von der ersten Frage bis zur Abnahme.",
  },
  {
    frage: "Woran verdienen Sie?",
    antwort:
      "Bei erfolgreicher Vermittlung können wir eine Vergütung vom ausführenden Unternehmen erhalten. Ihre Entscheidung bleibt davon unberührt, und Sie zahlen deswegen nicht mehr. Wir sagen Ihnen das hier, weil Sie es ohnehin wissen sollten, bevor Sie uns Ihr Haus zeigen.",
  },
  {
    frage: "Ich habe schon ein Angebot. Bringt ein Gespräch dann noch etwas?",
    antwort:
      "Gerade dann. Wir lesen ein vorliegendes Angebot Position für Position und sagen Ihnen, was darin fehlt. Es geht nicht darum, es zu unterbieten, sondern darum, dass Sie wissen, was Sie unterschreiben. Auch das kostet Sie nichts.",
  },
] as const;

export function FAQ() {
  const scope = useRef<HTMLElement>(null);
  const [offen, setOffen] = useState<number | null>(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        revealItems("[data-faq-item]", { distance: 20, start: "top 92%" });
        revealItems("[data-faq-outro]", { distance: 22, start: "top 92%" });

        return maskedHeadline({
          headline: "[data-faq-h2]",
          follow: "[data-faq-eyebrow]",
          scrollTrigger: { trigger: scope.current, start: "top 80%", once: true },
        });
      });
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      id="fragen"
      data-nav-theme="dark"
      className="relative scroll-mt-[var(--nav-h)] overflow-hidden bg-ep-navy text-white"
    >
      <div
        aria-hidden="true"
        className="ep-skala pointer-events-none absolute inset-0"
      />

      <div className="ep-container relative py-28 sm:py-40 lg:py-48">
        <div>
          <p data-faq-eyebrow className="t-label text-ep-sun">
            Offene Fragen
          </p>
          <h2 data-faq-h2 className="t-h2 mt-6 max-w-[17ch]">
            Das fragen uns{" "}
            <span className="text-ep-sun">fast alle zuerst.</span>
          </h2>
        </div>

        <div className="mt-20 border-t border-ep-line-dark sm:mt-28 lg:mt-36">
          {FRAGEN.map((eintrag, i) => {
            const aktiv = offen === i;
            return (
              <div
                key={eintrag.frage}
                data-faq-item
                className="border-b border-ep-line-dark"
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => setOffen(aktiv ? null : i)}
                    aria-expanded={aktiv}
                    aria-controls={`faq-antwort-${i}`}
                    className="group ep-axis w-full py-8 text-left outline-none focus-visible:ring-2 focus-visible:ring-ep-sun sm:py-10"
                  >
                    {/* Spur A – Ziffer und Zeichen. Das Plus dreht sich zum
                        Minus; ein Pfeil würde „weiter" bedeuten, nicht
                        „mehr davon". */}
                    <span className="flex items-center justify-between gap-4 lg:justify-start lg:gap-6">
                      <span className="t-key text-ep-sun">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "grid size-8 shrink-0 place-items-center rounded-full border transition-all duration-300 lg:hidden",
                          aktiv
                            ? "rotate-45 border-ep-sun text-ep-sun"
                            : "border-white/30 text-white/70 group-hover:border-white/60",
                        )}
                      >
                        <Plus className="size-4" aria-hidden="true" />
                      </span>
                    </span>

                    {/* Spur B – die Frage. Groß, weil sie das Einzige ist,
                        was jeder liest. */}
                    <span className="flex items-start justify-between gap-8">
                      <span
                        className={cn(
                          "max-w-[24ch] text-[clamp(1.25rem,2.4vw,2rem)] font-semibold leading-snug tracking-[-0.02em] transition-colors duration-300",
                          aktiv ? "text-ep-sun" : "text-white group-hover:text-white/80",
                        )}
                      >
                        {eintrag.frage}
                      </span>
                      <span
                        className={cn(
                          "hidden size-9 shrink-0 place-items-center rounded-full border transition-all duration-300 lg:grid",
                          aktiv
                            ? "rotate-45 border-ep-sun text-ep-sun"
                            : "border-white/30 text-white/70 group-hover:border-white/60",
                        )}
                      >
                        <Plus className="size-4" aria-hidden="true" />
                      </span>
                    </span>
                  </button>
                </h3>

                {/* Die Antwort. `grid-rows` von 0fr auf 1fr statt einer
                    Höhenanimation: Damit fährt sie auf ihre TATSÄCHLICHE
                    Höhe auf, ohne dass jemand sie vorher messen muss – und
                    ohne den Sprung, den ein fester max-height-Wert bei
                    langen Antworten erzeugt. */}
                <div
                  id={`faq-antwort-${i}`}
                  hidden={!aktiv}
                  className={cn(
                    "ep-axis grid transition-[grid-template-rows] duration-500 ease-out",
                    aktiv ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <span aria-hidden="true" className="max-lg:hidden" />
                  <div className="overflow-hidden">
                    <p className="max-w-[62ch] pb-10 text-[17px] leading-relaxed text-white/75 sm:text-lg">
                      {eintrag.antwort}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Der Ausgang aus der FAQ. Wer bis hierher gelesen hat, hat eine
            Frage, die nicht dabei war – und soll sie stellen können, ohne
            wieder nach oben zu scrollen. */}
        <div
          data-faq-outro
          className="mt-16 flex flex-col gap-6 sm:mt-20 lg:flex-row lg:items-center lg:justify-between"
        >
          <p className="max-w-[22ch] text-[clamp(1.5rem,3vw,2.5rem)] font-bold leading-[1.08] tracking-[-0.025em]">
            Ihre Frage war nicht dabei?
          </p>
          <WhatsAppButton size="lg" label="Einfach fragen" className="shrink-0" />
        </div>
      </div>
    </section>
  );
}
