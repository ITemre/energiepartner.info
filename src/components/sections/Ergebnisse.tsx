"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { Marker } from "@/components/ui/Marker";
import { maskedHeadline, revealItems } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * „Das bekommen Sie schwarz auf weiß." – konkrete Artefakte statt
 * Versprechen. Der Besucher weiß danach genau, was am Ende der kostenlosen
 * Beratung tatsächlich vor ihm liegt.
 *
 * FORM – hier ist der Umbau am größten. Vorher standen vier gleich große
 * weiße Karten in einer Reihe: die generischste Form, die es gibt,
 * ausgerechnet auf der Seite mit dem stärksten typografischen Charakter.
 * Karten mit Schatten, Hover-Lift und einer 01–04 obendrauf – das hätte auf
 * jeder beliebigen Dienstleisterseite stehen können.
 *
 * Jetzt ist es das, was es inhaltlich ist: eine LIEFERLISTE. Links die
 * Bezeichnung, rechts der Inhalt, dazwischen eine Haarlinie – die Form eines
 * Datenblatts oder Leistungsverzeichnisses, also genau das Dokument, das der
 * Besucher am Ende in der Hand hält. Die Sektion zeigt damit nicht nur, was
 * er bekommt, sondern sieht aus wie das, was er bekommt.
 *
 * Auf Navy, weil sie die Seite abschließt und direkt in den Kontaktbereich
 * läuft: Die letzten beiden Bänder bilden zusammen den dunklen Schluss.
 */
const RESULTS = [
  {
    key: "Bestandsaufnahme",
    text: "Was Ihr Haus heute braucht und verbraucht.",
  },
  {
    key: "Konzept",
    text: "Welche Anlage passt, in welcher Größe, in welcher Reihenfolge.",
  },
  {
    key: "Wirtschaftlichkeitsrechnung",
    text: "Was es kostet, was es spart, wann es sich trägt.",
  },
  {
    key: "Förderung & Finanzierung",
    text: "Was Ihnen zusteht. Die Anträge stellen wir, auf Wunsch zeigen wir Ihnen passende Finanzierungswege.",
  },
] as const;

export function Ergebnisse() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        revealItems("[data-e-row]", { distance: 24, start: "top 90%" });
        revealItems("[data-e-outro]", { distance: 30, start: "top 92%" });

        return maskedHeadline({
          headline: "[data-e-h2]",
          follow: "[data-e-eyebrow]",
          scrollTrigger: { trigger: scope.current, start: "top 78%", once: true },
        });
      });
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      data-nav-theme="dark"
      className="bg-ep-navy text-white"
    >
      <div className="ep-container py-28 sm:py-40 lg:py-48">
        <div>
          <p data-e-eyebrow className="t-label text-ep-sun">
            Das Ergebnis
          </p>
          <h2 data-e-h2 className="t-h2 mt-6 max-w-[18ch]">
            Das bekommen Sie{" "}
            <span className="text-ep-sun">schwarz auf weiß.</span>
          </h2>
        </div>

        {/* Die Liste. Erste Zeile mit Oberlinie, danach jede mit eigener –
            dadurch schließt die Tafel oben UND unten ab und steht als Block
            auf der Fläche, statt nach unten auszufransen.

            MASSSTAB (07.08.): Die Sektion stand auf py-20 mit Fließtext in
            Lesegröße und war damit die kleinste am Seitenende – ausgerechnet
            die, die vier konkrete Liefergegenstände aufzählt. Sie sagte
            „schwarz auf weiß" und sah aus wie eine Fußnote. Die vier Werte
            SIND hier der Inhalt, nicht die Erläuterung eines Inhalts, und
            stehen jetzt entsprechend groß. */}
        <ul className="mt-20 border-t border-ep-line-dark sm:mt-28 lg:mt-36">
          {RESULTS.map(({ key, text }, i) => (
            <li
              key={key}
              data-e-row
              className="ep-axis border-b border-ep-line-dark py-10 sm:py-14 lg:py-20"
            >
              {/* Spur A – die Bezeichnung. Mono, damit sie als Kennung
                  gelesen wird und nicht als Überschrift. Sonnengelb ist auf
                  Navy die einzige Akzentfarbe, die klein noch trägt.
                  Die Ziffer davor macht aus der Aufzählung eine Tafel mit
                  Positionen – dieselbe Logik wie in Ablauf und Leistungen. */}
              {/* `hyphens-auto` (html lang="de"): „Wirtschaftlichkeitsrechnung"
                  passt bei schmalen Fenstern nicht in die Kennspur und ist ein
                  einziges Wort – ohne Trennung würde es die Wertspur
                  überschreiben statt umzubrechen. */}
              <div className="self-start">
                <span className="t-key block text-white/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="t-label mt-2 block text-ep-sun [hyphens:auto]">
                  {key}
                </span>
              </div>

              {/* Spur B – der Inhalt. */}
              <p className="max-w-[26ch] text-[clamp(1.375rem,2.6vw,2.375rem)] font-semibold leading-[1.18] tracking-[-0.02em] text-white">
                {text}
              </p>
            </li>
          ))}
        </ul>

        {/* Abschluss. Vorher eine Zeile in `t-h3` auf der Wertspur – der
            letzte Satz der Seite, gesetzt wie eine Zwischenüberschrift.
            Jetzt am linken Anschlag und in Display-Nähe: Was danach kommt,
            ist nur noch der Footer. */}
        <div
          data-e-outro
          className="mt-20 flex flex-col gap-10 sm:mt-28 lg:flex-row lg:items-end lg:justify-between lg:gap-16"
        >
          <p className="max-w-[16ch] text-[clamp(2rem,4.6vw,4rem)] font-bold leading-[1.05] tracking-[-0.03em]">
            Der erste Schritt{" "}
            <span className="text-ep-sun">
              kostet Sie <Marker variante={1}>nichts</Marker>.
            </span>
          </p>
          <WhatsAppButton
            size="lg"
            label="Kostenlos beraten lassen"
            className="shrink-0"
          />
        </div>
      </div>
    </section>
  );
}
