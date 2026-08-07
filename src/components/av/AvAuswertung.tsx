"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { maskedHeadline, revealItems } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * „So sieht Ihre Auswertung aus." – die vier Bereiche und der optionale
 * direkte Vergleich.
 *
 * Alle Texte wörtlich aus `docs/markenhandbuch-quelle/ci.html`.
 *
 * WARUM DIESE SEKTION WICHTIGER IST, ALS SIE AUSSIEHT: Bis hierher weiß der
 * Besucher, dass wir prüfen. Er weiß nicht, was er dafür bekommt. „Eine
 * Einschätzung" ist nichts, was man sich vorstellen kann. Vier benannte
 * Bereiche und eine Tabelle sind es.
 *
 * Die Tabelle ist außerdem der ehrlichste Ort der Seite: Sie zeigt das
 * Empfehlungsangebot als Ergebnis der Analyse, nicht als Überraschung am
 * Ende. Der Hinweis darunter sagt genau das, wörtlich.
 */
const BEREICHE = [
  {
    key: "Gut gelöst",
    text: "Welche Bestandteile sind plausibel und vollständig?",
  },
  {
    key: "Unklar oder fehlend",
    text: "Welche Leistungen sind nicht eindeutig beschrieben?",
  },
  {
    key: "Risiken",
    text: "Wo können später Mehrkosten oder technische Probleme entstehen?",
  },
  {
    key: "Empfehlung",
    text: "Welche Punkte sollten vor der Unterschrift geklärt werden?",
  },
] as const;

/** Beispielhafte Gegenüberstellung, Werte aus dem Markenhandbuch. */
const VERGLEICH = [
  { merkmal: "Wärmepumpe", a: "Modell A", b: "Modell B" },
  { merkmal: "Leistung", a: "12 kW", b: "10 kW" },
  { merkmal: "Heizlast", a: "nicht angegeben", b: "berücksichtigt" },
  {
    merkmal: "Elektroanschluss",
    a: "teilweise enthalten",
    b: "vollständig enthalten",
  },
  { merkmal: "Förderung", a: "pauschale Annahme", b: "objektspezifisch geprüft" },
] as const;

export function AvAuswertung() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        revealItems("[data-au-block]", { distance: 22, start: "top 90%" });
        revealItems("[data-au-zeile]", { distance: 16, start: "top 94%" });

        return maskedHeadline({
          headline: "[data-au-h2]",
          follow: "[data-au-eyebrow]",
          scrollTrigger: { trigger: scope.current, start: "top 78%", once: true },
        });
      });
    },
    { scope },
  );

  return (
    <section ref={scope} data-nav-theme="light" className="bg-ep-paper">
      <div className="ep-container py-24 sm:py-32">
        <div>
          <p data-au-eyebrow className="t-label text-ep-orange-deep">
            So sieht Ihre Auswertung aus
          </p>
          <h2 data-au-h2 className="t-h2 mt-6 max-w-[16ch] text-ep-ink">
            Verständlich statt{" "}
            <span className="text-ep-navy">Fachchinesisch.</span>
          </h2>
          <p
            data-au-block
            className="t-lead mt-7 max-w-[56ch] text-ep-ink/75"
          >
            Ihre kostenlose Einschätzung ordnet Ihr bestehendes Angebot in vier
            klare Bereiche ein.
          </p>
        </div>

        {/* Die vier Bereiche. Bewusst als Reihe mit Trennlinien und nicht als
            Kachelgitter: Vier Kacheln mit Rand und Schatten sind die
            generischste Form, die es gibt, und die Seite hat sonst keine. */}
        <ul className="mt-14 grid border-t border-ep-line sm:mt-20 sm:grid-cols-2">
          {BEREICHE.map(({ key, text }, i) => (
            <li
              key={key}
              data-au-block
              className={[
                "border-b border-ep-line py-7 pr-6 sm:py-9",
                i % 2 === 1 ? "sm:border-l sm:border-ep-line sm:pl-8" : "",
              ].join(" ")}
            >
              <p className="t-label text-ep-orange-deep">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="t-h4 mt-3 text-ep-ink">{key}</h3>
              <p className="mt-2 max-w-[42ch] leading-relaxed text-ep-ink/70">
                {text}
              </p>
            </li>
          ))}
        </ul>

        {/* ============ Der direkte Vergleich ============ */}
        <div data-au-block className="mt-20 sm:mt-28">
          <p className="t-label text-ep-orange-deep">
            Auf Wunsch: direkter Vergleich
          </p>

          {/* KEINE <table>-Optik auf schmalen Geräten: Drei Spalten auf
              390 px lassen jede Zelle umbrechen, und eine Tabelle, deren
              Zellen umbrechen, verliert genau die Eigenschaft, für die man
              sie nimmt – dass man waagerecht vergleichen kann.
              Deshalb ein Raster aus drei Spuren, das auf kleinen Displays
              zum Stapel wird: Merkmal oben, darunter die beiden Werte
              nebeneinander. Waagerecht verglichen wird also weiterhin, nur
              auf engerem Raum. */}
          <div className="mt-8 border-t border-ep-line">
            {/* Kopfzeile: erst ab sm, darunter trägt jede Zeile ihre eigene
                Beschriftung (s. u.). */}
            <div className="hidden border-b border-ep-line py-4 sm:grid sm:grid-cols-[1fr_1fr_1fr] sm:gap-6">
              <span className="t-label text-ep-ink/60">Merkmal</span>
              <span className="t-label text-ep-ink/60">Ihr Angebot</span>
              <span className="t-label text-ep-navy">Unsere Empfehlung</span>
            </div>

            {VERGLEICH.map(({ merkmal, a, b }) => (
              <div
                key={merkmal}
                data-au-zeile
                className="border-b border-ep-line py-5 sm:grid sm:grid-cols-[1fr_1fr_1fr] sm:items-baseline sm:gap-6"
              >
                <span className="t-label block text-ep-ink/60 sm:text-ep-ink">
                  {merkmal}
                </span>

                <div className="mt-3 grid grid-cols-2 gap-6 sm:mt-0 sm:contents">
                  <div>
                    <span className="t-label mb-1 block text-ep-ink/45 sm:hidden">
                      Ihr Angebot
                    </span>
                    <span className="text-ep-ink/70">{a}</span>
                  </div>
                  <div>
                    <span className="t-label mb-1 block text-ep-navy/60 sm:hidden">
                      Empfehlung
                    </span>
                    {/* Die Empfehlungsspalte trägt als Einzige eine
                        Auszeichnung – ohne sie liest man fünf Zeilen und
                        weiß am Ende nicht, welche Seite die bessere war. */}
                    <span className="font-semibold text-ep-navy">{b}</span>
                  </div>
                </div>
              </div>
            ))}

            <div
              data-au-zeile
              className="border-b border-ep-line py-5 sm:grid sm:grid-cols-[1fr_1fr_1fr] sm:items-baseline sm:gap-6"
            >
              <span className="t-label block text-ep-ink/60 sm:text-ep-ink">
                Gesamtpreis
              </span>
              <div className="mt-3 grid grid-cols-2 gap-6 sm:mt-0 sm:contents">
                <span className="text-ep-ink/70">Betrag</span>
                <span className="font-semibold text-ep-navy">Betrag</span>
              </div>
            </div>
          </div>

          {/* Wörtlich aus dem Markenhandbuch. Der zweite Satz ist der
              wichtige: Er nimmt dem Empfehlungsangebot vorweg den Verdacht,
              den es sonst erzeugt. */}
          <p className="mt-6 max-w-[72ch] text-sm leading-relaxed text-ep-ink/60">
            Beispielhafte Darstellung. Das Empfehlungsangebot entsteht als
            nachvollziehbare Konsequenz der Analyse, nicht als nachgeschobenes
            Verkaufsangebot.
          </p>
        </div>
      </div>
    </section>
  );
}
