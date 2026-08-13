"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { BendLine } from "@/components/ui/BendLine";
import { maskedHeadline, revealItems } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * Der Fünf-Schritte-Ablauf aus dem Markenhandbuch v1.1.
 *
 * TITEL UND TEXTE SIND WÖRTLICH ÜBERNOMMEN (Quelle:
 * `docs/markenhandbuch-quelle/ci.html`, Abschnitt „Der Ablauf"). Der Kunde
 * hat die Formulierungen seines Beraters ausdrücklich 1:1 gewollt – hier
 * wird nicht umformuliert, auch nicht „nur etwas flüssiger".
 *
 * Ergänzt ist ausschließlich die Zeitangabe je Schritt; sie stammt aus der
 * ebenfalls freigegebenen Vertrauenszeile und macht sichtbar, wo die drei
 * Minuten und wo die 24 Stunden hingehören.
 *
 * Schritt 4 ist der ehrliche: Wir bieten auf Wunsch ein eigenes Angebot an.
 * Das könnte man verstecken, und genau das wäre der Fehler – wer nach der
 * Prüfung überrascht ein Verkaufsgespräch bekommt, liest die Prüfung
 * rückwirkend als Köder. Angekündigt ist es ein Service.
 *
 * Schritt 5 existiert nur deshalb: Er sagt ausdrücklich, dass nichts folgen
 * muss. Ein Ablauf, der mit „Angebot" endet, liest sich wie ein Trichter.
 *
 * ZEITANGABEN – nie vermischen: die 3 Minuten gehören an Schritt 1
 * (Übermittlung), die 24 Stunden an Schritt 3 (Auswertung). Beides an einer
 * Stelle würde eine Prüfung in drei Minuten versprechen.
 */
const SCHRITTE = [
  {
    titel: "Angebot übermitteln",
    dauer: "etwa 3 Minuten",
    text: "Laden Sie Ihr bestehendes Wärmepumpenangebot als PDF oder Foto hoch.",
  },
  {
    titel: "Angebotsanalyse",
    dauer: "wir übernehmen",
    text: "Wir prüfen Ihr Angebot anhand einheitlicher Kriterien.",
  },
  {
    titel: "Verständliche Auswertung",
    dauer: "innerhalb von 24 Stunden",
    text: "Sie erhalten eine kompakte Bewertung: Gut gelöst, Unklar oder fehlend, Risiken, Empfehlung.",
  },
  {
    titel: "Empfehlungsangebot",
    dauer: "auf Wunsch",
    text: "Wenn wir Optimierungspotenzial erkennen, erstellen wir Ihnen auf Wunsch ein alternatives Empfehlungsangebot über einen passenden Fachpartner.",
  },
  {
    titel: "Freie Entscheidung",
    dauer: "ohne Verpflichtung",
    text: "Sie entscheiden selbst, ob Sie bei Ihrem bisherigen Angebot bleiben oder unsere Empfehlung nutzen.",
  },
] as const;

export function AvAblauf() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Eigener Trigger je Schritt: Bei einem gemeinsamen Stagger wären
        // die unteren längst enthüllt, bevor man sie erreicht.
        revealItems("[data-ab-schritt]", { distance: 26, start: "top 88%" });

        return maskedHeadline({
          headline: "[data-ab-h2]",
          follow: "[data-ab-eyebrow]",
          scrollTrigger: { trigger: scope.current, start: "top 78%", once: true },
        });
      });
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      id="ablauf"
      data-nav-theme="dark"
      data-surface="dark"
      className="scroll-mt-[var(--nav-h)] bg-ep-navy text-white"
    >
      <div className="ep-container py-24 sm:py-32">
        <div>
          <p data-ab-eyebrow className="t-label text-ep-accent">
            So läuft es ab
          </p>
          <h2 data-ab-h2 className="t-h2 mt-6 max-w-[17ch]">
            Fünf Schritte.{" "}
            <span className="text-ep-accent">Einer davon ist Ihrer.</span>
          </h2>
        </div>

        <ol className="mt-16 sm:mt-20">
          {SCHRITTE.map((schritt, i) => (
            <li key={schritt.titel} data-ab-schritt>
              <BendLine className="origin-left text-ep-line-dark" />

              {/* Ab lg als Zwölfer-Spread: Ziffer, Titel und Erklärung
                  laufen waagerecht auseinander und lesen sich als
                  Kursverlauf statt als Stapel. Darunter fällt alles
                  untereinander – auf 390 px ist für drei Spuren kein
                  Platz, und genau dort kommt der Traffic her. */}
              <div className="py-9 sm:py-12 lg:grid lg:grid-cols-12 lg:items-baseline lg:gap-x-10">
                <span className="t-num block text-white/30 lg:col-span-2">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="mt-4 lg:col-span-4 lg:col-start-3 lg:mt-0">
                  <h3 className="text-[clamp(1.5rem,2.6vw,2.25rem)] font-bold leading-tight tracking-[-0.025em]">
                    {schritt.titel}
                  </h3>
                  <p className="t-key mt-2 text-ep-accent">{schritt.dauer}</p>
                </div>

                <p className="mt-5 max-w-[52ch] leading-relaxed text-white/75 lg:col-span-5 lg:col-start-8 lg:mt-0">
                  {schritt.text}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <BendLine className="origin-left text-ep-line-dark" />
      </div>
    </section>
  );
}
