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
 * „Was wir uns ansehen." – die Prüfliste.
 *
 * Das ist die Sektion, die aus einer Behauptung ein Angebot macht. „Wir
 * prüfen Ihr Angebot auf Vollständigkeit" ist ein Satz, den jeder schreiben
 * kann; sechs benannte Prüfpunkte mit je einem typischen Fund kann nur
 * jemand schreiben, der die Angebote kennt. Fachwissen zeigt man, indem man
 * konkret wird, nicht indem man es behauptet.
 *
 * WORTLAUT: Die Funde bei „Leitungen und Anschlüsse" sind die beiden vom
 * Kunden vorgegebenen Textbausteine (Projekt-Briefing, Abschnitt 5) und
 * stehen wörtlich so da.
 *
 * FORM: dieselbe Lieferlisten-Struktur wie „Das bekommen Sie schwarz auf
 * weiß" auf energiepartner.info – links die Kennung, rechts der Inhalt, das
 * Datenblatt-Raster der Marke (`.ep-axis`). Eine Prüfliste, die aussieht wie
 * ein Prüfprotokoll.
 */
const PUNKTE = [
  {
    key: "Auslegung",
    frage: "Passt die Wärmepumpe zu Ihrem Haus?",
    fund: "Häufiger Fund: eine Nummer zu groß gewählt. Das kostet beim Kauf und danach bei jedem Start.",
  },
  {
    key: "Hydraulik",
    frage: "Ist alles dabei, was das Wasser bewegt?",
    fund: "Hydraulischer Abgleich, Pufferspeicher, Umwälzpumpe. Fehlt der Abgleich, läuft die Anlage nie so, wie sie gerechnet wurde.",
  },
  {
    key: "Leitungen und Anschlüsse",
    frage: "Was liegt zwischen Gerät und Haus?",
    /* Zwei wörtliche Textbausteine des Kunden. Die Anführungszeichen sind
       typografisch (U+201E/U+201C) – ein gerades " würde hier das
       JS-Zeichenkettenliteral beenden. */
    fund: "„Steigleitung nicht enthalten“, „Reinigung der Rohre nicht enthalten“: zwei Zeilen, die im Angebot fehlen und auf der Rechnung stehen.",
  },
  {
    key: "Altanlage",
    frage: "Wer räumt weg, was raus muss?",
    fund: "Demontage, Entsorgung, Stilllegung des Öltanks. Selten beziffert, immer fällig.",
  },
  {
    key: "Förderung",
    frage: "Ist die Förderung wirklich ausgeschöpft?",
    fund: "Wir rechnen nach, welche Sätze für Ihren Fall gelten und ob das Angebot sie vollständig berücksichtigt.",
  },
  {
    key: "Nebenarbeiten",
    frage: "Was steht nirgends und passiert trotzdem?",
    fund: "Durchbrüche, Fundament, Elektroanschluss, Putz- und Malerarbeiten, Einweisung.",
  },
] as const;

export function AvPruefung() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        revealItems("[data-pr-zeile]", { distance: 22, start: "top 90%" });

        return maskedHeadline({
          headline: "[data-pr-h2]",
          follow: "[data-pr-eyebrow]",
          scrollTrigger: { trigger: scope.current, start: "top 78%", once: true },
        });
      });
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      id="pruefung"
      data-nav-theme="light"
      className="scroll-mt-[var(--nav-h)] bg-ep-paper"
    >
      <div className="ep-container py-24 sm:py-32">
        <div>
          <p data-pr-eyebrow className="t-label text-ep-orange-deep">
            Die Prüfung
          </p>
          <h2 data-pr-h2 className="t-h2 mt-6 max-w-[18ch] text-ep-ink">
            Was wir uns{" "}
            <span className="text-ep-navy">Position für Position</span> ansehen.
          </h2>
        </div>

        <ul className="mt-16 border-t border-ep-line sm:mt-20">
          {PUNKTE.map(({ key, frage, fund }) => (
            <li
              key={key}
              data-pr-zeile
              className="ep-axis border-b border-ep-line py-7 sm:py-9"
            >
              {/* Kennungen wie „Leitungen und Anschlüsse" sind länger als
                  die schmale Spur – Silbentrennung verhindert, dass sie in
                  die Wertspur hineinlaufen. */}
              <span className="t-label self-start text-ep-orange-deep [hyphens:auto]">
                {key}
              </span>

              <div>
                <p className="t-h4 max-w-[30ch] text-ep-ink">{frage}</p>
                <p className="mt-3 max-w-[58ch] leading-relaxed text-ep-ink/70">
                  {fund}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* Der Satz, der die Positionierung festhält. Er steht am Ende der
            Liste, weil er erst dann trägt: Nach sechs konkreten Prüfpunkten
            ist „nicht billiger, sondern vollständig" keine Behauptung mehr,
            sondern die Zusammenfassung dessen, was man gerade gelesen hat. */}
        <p
          data-pr-zeile
          className="ep-indent mt-14 max-w-[46ch] text-[clamp(1.25rem,2vw,1.75rem)] font-semibold leading-snug text-ep-ink sm:mt-16"
        >
          Wir suchen nicht das billigere Angebot.{" "}
          <span className="text-ep-navy">
            Wir suchen, was in Ihrem fehlt.
          </span>
        </p>
      </div>
    </section>
  );
}
