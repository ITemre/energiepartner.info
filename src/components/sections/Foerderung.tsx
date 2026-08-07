"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { BendLine } from "@/components/ui/BendLine";
import { Marker } from "@/components/ui/Marker";
import { maskedHeadline, revealItems } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * „Was der Staat dazugibt."
 *
 * ═══ WARUM DIESE SEKTION DER GRÖSSTE HEBEL DER SEITE IST ═══
 * Der Einwand, an dem eine Wärmepumpe scheitert, ist immer derselbe: zu
 * teuer. Die Seite hatte darauf bisher keine Antwort — die Förderung kam in
 * einem Nebensatz vor („Fördermittel prüfen und beantragen", ein Punkt unter
 * acht). Dabei ist sie das stärkste Argument, das dieses Geschäft hat: Sie
 * halbiert die Rechnung, sie ist keine Behauptung von uns, und Ilias stellt
 * die Anträge selbst.
 *
 * Ein Einwand, den man mit einer Zahl beantworten kann, gehört in eine eigene
 * Sektion. Versteckt in einer Aufzählung ist er nur ein Punkt unter acht.
 *
 * ═══ ⚠️ ZU DEN ZAHLEN ═══
 * Die Sätze der Bundesförderung für effiziente Gebäude ändern sich, und was
 * im Einzelfall gilt, hängt am Gebäude, am Einkommen und am Zeitpunkt. Die
 * Sektion nennt deshalb die STRUKTUR (Grundförderung plus Boni, gedeckelt)
 * und nicht „Sie bekommen X". Der individuelle Betrag entsteht in der
 * Beratung — genau das ist ja die Leistung.
 *
 * Das ist auch der wettbewerbsrechtlich saubere Weg: „Bis zu 70 %" mit
 * sichtbarer Herleitung und Stichtag ist belegbar. „70 % Förderung" ohne
 * Bedingungen wäre eine Zusage, die für die meisten Häuser nicht stimmt.
 *
 * ⚠️ VOR DEM LIVEGANG: Sätze und Stichtag gegen die dann gültige Richtlinie
 * prüfen. Diese Sektion ist die einzige der Seite, die veralten kann.
 */
const BAUSTEINE = [
  {
    wert: "30 %",
    titel: "Grundförderung",
    text: "Für den Tausch einer alten Heizung gegen eine Wärmepumpe. Gilt für selbstgenutztes und vermietetes Wohneigentum.",
  },
  {
    wert: "+ 20 %",
    titel: "Klimageschwindigkeits-Bonus",
    text: "Wenn Sie eine alte funktionierende Öl-, Kohle- oder Gasheizung frühzeitig ersetzen. Für Selbstnutzer.",
  },
  {
    wert: "+ 30 %",
    titel: "Einkommens-Bonus",
    text: "Für selbstnutzende Eigentümer unterhalb einer Einkommensgrenze des Haushalts.",
  },
  {
    wert: "+ 5 %",
    titel: "Effizienz-Bonus",
    text: "Für Wärmepumpen mit natürlichem Kältemittel oder mit Erdreich, Wasser oder Abwasser als Wärmequelle.",
  },
] as const;

/** Was wir übernehmen. Der zweite Teil des Arguments – Geld allein hilft
 *  nicht, wenn der Weg dorthin nach Behörde aussieht. */
const UEBERNEHMEN = [
  "Prüfen, welche Boni für Ihr Haus überhaupt in Frage kommen",
  "Antrag stellen, in der richtigen Reihenfolge zum Auftrag",
  "Fristen und Nachweise überwachen",
  "Verwendungsnachweis und Auszahlung begleiten",
] as const;

export function Foerderung() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        revealItems("[data-f-baustein]", { distance: 24, start: "top 90%" });
        revealItems("[data-f-block]", { distance: 20, start: "top 92%" });

        return maskedHeadline({
          headline: "[data-f-h2]",
          follow: "[data-f-eyebrow]",
          scrollTrigger: { trigger: scope.current, start: "top 78%", once: true },
        });
      });
    },
    { scope },
  );

  return (
    /* HELLES BAND, bewusst.
       Die Sektion lief zuerst auf Navy und wirkte dort erdrückend: Sie ist
       die längste Fläche der Seite (vier Bausteine, vier Aufgaben, Hinweis,
       Fußnote), und dunkel gesetzt liest sich diese Menge als Wand statt
       als Angebot. Inhaltlich ist sie außerdem die guteste Nachricht der
       Seite – Geld, das jemand anderes zahlt. Das gehört auf Papier.

       ⚠️ DIE OBERKANTE IN SONNENGELB IST PFLICHT, NICHT ZIERDE.
       Seit die Sektion direkt hinter dem Hero steht, trägt sie dessen
       Aufgabe mit: Der Hero liegt sticky und zoomt beim Rausscrollen
       heraus, und ein Zoom ist nur wahrnehmbar, wenn etwas mit sichtbarer
       Kante davorzieht. Ohne die Sonnenlinie schöbe sich Papier lautlos
       über Navy und der Effekt verpuffte.

       Nach hinten läuft sie in die Ausgangslagen (`Situationen`), die
       ebenfalls auf Papier stehen – der Übergang dort ist bewusst weich,
       weil beide zusammen die Eröffnung bilden.

       ⚠️ FARBREGEL: Auf Papier ist `ep-sun` (#FBB23F) als Text nicht
       zulässig – 2,1:1 gegen #FBF6EE. Akzentfarbe hier ist durchgehend
       `ep-orange-deep` (5,4:1). `ep-sun` erscheint nur noch als FLÄCHE
       (Kante, Strich), nie als Schrift. */
    <section
      ref={scope}
      id="foerderung"
      data-nav-theme="light"
      className="relative scroll-mt-[var(--nav-h)] overflow-hidden border-t-2 border-ep-sun bg-ep-paper text-ep-ink"
    >
      <div className="ep-container relative py-28 sm:py-40 lg:py-48">
        <div className="lg:flex lg:items-end lg:justify-between lg:gap-16">
          <div>
            <p data-f-eyebrow className="t-label text-ep-orange-deep">
              Förderung
            </p>
            <h2 data-f-h2 className="t-h2 mt-6 max-w-[15ch] text-ep-ink">
              Bis zu{" "}
              <span className="text-ep-orange-deep">
                <Marker variante={1}>70 Prozent</Marker>
              </span>{" "}
              zahlt nicht Ihr Haushalt.
            </h2>
          </div>

          {/* DIE ZAHL, DIE ÜBERZEUGT.
              Sie stand vorher als Halbsatz im Fließtext („bleiben davon rund
              21.000 € Zuschuss übrig") – die stärkste Zahl der ganzen Seite,
              gesetzt wie eine Fußnote. Prozente sind abstrakt, ein
              Euro-Betrag ist es nicht: 70 % versteht man, 21.000 € spürt man.
              Deshalb steht sie jetzt als Kennzahl und der erklärende Satz
              darunter. */}
          <div data-f-block className="mt-10 shrink-0 lg:mt-0">
            <p className="border-l-2 border-ep-orange pl-6">
              <span className="block text-[clamp(2.75rem,5.5vw,4.5rem)] font-bold leading-none tracking-[-0.03em] text-ep-orange-deep [font-variant-numeric:tabular-nums]">
                21.000 €
              </span>
              <span className="mt-3 block max-w-[30ch] text-lg leading-snug text-ep-ink/80">
                Zuschuss im besten Fall, den Sie nicht zurückzahlen.
              </span>
            </p>
            <p className="mt-4 max-w-[38ch] pl-6 text-[15px] leading-relaxed text-ep-ink/60">
              Förderfähig sind bis zu 30.000 € der Kosten für den
              Heizungstausch.
            </p>
          </div>
        </div>

        {/* Die vier Bausteine. Als ADDITION gesetzt, nicht als Liste: Das
            Pluszeichen macht sichtbar, dass sich die Sätze stapeln – genau
            das versteht kaum jemand, und genau daran hängt die 70. */}
        <ul className="mt-20 grid gap-px sm:mt-28 lg:mt-32 lg:grid-cols-4">
          {BAUSTEINE.map((b, i) => (
            <li
              key={b.titel}
              data-f-baustein
              className={[
                "border-t border-ep-line py-8 pr-6 sm:py-10",
                i > 0 ? "lg:border-l lg:border-ep-line lg:pl-8" : "",
              ].join(" ")}
            >
              <span className="t-stat block text-ep-orange-deep">{b.wert}</span>
              <h3 className="mt-5 text-[clamp(1.125rem,1.5vw,1.375rem)] font-semibold leading-snug text-ep-ink [hyphens:auto]">
                {b.titel}
              </h3>
              <p className="mt-3 max-w-[34ch] text-[15px] leading-relaxed text-ep-ink/70">
                {b.text}
              </p>
            </li>
          ))}
        </ul>

        <BendLine className="mt-2 origin-left text-ep-line" />

        {/* Der zweite Teil des Arguments. Geld allein überzeugt nicht, wenn
            der Weg dorthin nach Antragsformular aussieht – der häufigste
            Grund, warum Förderung liegen bleibt, ist nicht Unkenntnis,
            sondern Aufwandsscheu. */}
        <div className="mt-20 sm:mt-28 lg:grid lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-5">
            <h3
              data-f-block
              className="max-w-[16ch] text-[clamp(1.75rem,3.4vw,3rem)] font-bold leading-[1.06] tracking-[-0.03em] text-ep-ink"
            >
              Den Papierkram{" "}
              <span className="text-ep-navy">machen wir.</span>
            </h3>
            <p
              data-f-block
              className="mt-6 max-w-[42ch] leading-relaxed text-ep-ink/70"
            >
              Der häufigste Grund, warum Förderung liegen bleibt, ist nicht
              Unkenntnis. Es ist der Aufwand. Deshalb ist das unsere Aufgabe,
              nicht Ihre.
            </p>
          </div>

          <ul className="mt-12 lg:col-span-6 lg:col-start-7 lg:mt-0">
            {UEBERNEHMEN.map((punkt, i) => (
              <li
                key={punkt}
                data-f-block
                className="flex items-baseline gap-5 border-b border-ep-line py-5 first:border-t first:border-ep-line"
              >
                <span className="t-key shrink-0 text-ep-orange-deep">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[17px] leading-snug text-ep-ink/85 sm:text-lg">
                  {punkt}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Der Reihenfolge-Hinweis ist der wertvollste Satz der Sektion:
            Er ist konkret, er ist nachprüfbar, und er beschreibt einen
            Fehler, der richtig weh tut. Wer ihn liest, versteht sofort,
            wofür er einen Begleiter braucht. */}
        <div
          data-f-block
          className="mt-16 max-w-[62ch] border-l-2 border-ep-orange bg-ep-sand/60 py-5 pl-6 pr-5 sm:mt-20"
        >
          <p className="text-lg leading-relaxed text-ep-ink/85">
            <span className="font-semibold text-ep-ink">
              Die Reihenfolge entscheidet.
            </span>{" "}
            Wer den Auftrag unterschreibt, bevor der Antrag gestellt ist, kann
            den Zuschuss vollständig verlieren. Das ist der Fehler, der uns am
            häufigsten begegnet.
          </p>
        </div>

        <div
          data-f-block
          className="mt-16 flex flex-col gap-6 sm:mt-20 lg:flex-row lg:items-center lg:justify-between"
        >
          <p className="max-w-[26ch] text-[clamp(1.5rem,3vw,2.5rem)] font-bold leading-[1.08] tracking-[-0.025em] text-ep-ink">
            Wir rechnen Ihren Fall durch, bevor Sie irgendetwas unterschreiben.
          </p>
          <WhatsAppButton
            size="lg"
            label="Förderung prüfen lassen"
            className="shrink-0"
          />
        </div>

        {/* Stand und Vorbehalt. Nicht kleingedruckt versteckt: Eine
            Förderangabe ohne Datum ist in zwölf Monaten falsch, und eine
            falsche Förderangabe ist der teuerste Fehler auf dieser Seite. */}
        <p className="mt-12 max-w-[76ch] text-sm leading-relaxed text-ep-ink/60">
          Sätze der Bundesförderung für effiziente Gebäude (Einzelmaßnahmen),
          Stand 2026. Grundförderung und Boni sind zusammen auf 70 % der
          förderfähigen Kosten begrenzt, diese wiederum auf 30.000 € für die
          erste Wohneinheit. Ob und in welcher Höhe ein Bonus für Sie gilt,
          hängt von Gebäude, Nutzung und Haushaltseinkommen ab und wird
          individuell geprüft.
        </p>
      </div>
    </section>
  );
}
