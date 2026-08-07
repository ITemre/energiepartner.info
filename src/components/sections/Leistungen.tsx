"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { cn } from "@/lib/utils";
import { maskedHeadline, revealItems } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * „Unser Service. Ihr Durchblick." – die drei Leistungen des Hauses:
 * Wärmepumpe, Photovoltaik, Stromtarif.
 *
 * COPY-QUELLE: Der gelbe Satz auf jeder Karte ist die von Ilias WÖRTLICH
 * freigegebene Leistungscopy (Projekt-Briefing Abschnitt 4). Er darf nur
 * nach Rücksprache mit ihm geändert werden. Angepasst ist ausschließlich
 * die Interpunktion: Die Gedankenstriche der Vorlage sind durch Komma
 * ersetzt (Corivo-Regel, sie sind das deutlichste KI-Anzeichen).
 *
 * REIHENFOLGE: Wärmepumpe zuerst. Das Briefing setzt sie zum Start in den
 * Vordergrund, PV und Tarif sind die weiteren Leistungen.
 *
 * Vorher standen hier drei Prozessschritte (Beratung → Planung →
 * Ausführung). Die waren nicht falsch, sie standen nur zweimal auf der
 * Seite: Die Aufgabenteilung listet denselben Ablauf weiter unten in acht
 * Punkten und deutlich konkreter. Was dagegen komplett fehlte, waren die
 * Leistungen selbst – ein Besucher konnte die Seite lesen, ohne zu
 * erfahren, dass Stromtarife überhaupt dazugehören.
 *
 * „Fachgerechte Ausführung" ist mit dem Umbau ebenfalls weg, und das ist
 * kein Nebeneffekt: Ilias vermittelt und koordiniert, er baut nicht selbst.
 * Eine Überschrift, die eigene Ausführung behauptet, war der Punkt, den das
 * Kickoff am 23.07. ausdrücklich geklärt hat.
 *
 * FORM: ein Stapel aus drei bildschirmhohen Karten. Jede liegt `sticky` und
 * bleibt stehen, während die nächste darüberschiebt – am Ende liegen alle
 * drei aufeinander wie abgearbeitete Blätter.
 *
 * Bewusst OHNE Pin. Ein Pin hält den Scroll an und spielt eine Sequenz ab;
 * das unterbricht den Lesefluss und man merkt, dass einem die Kontrolle
 * genommen wird. `position: sticky` erreicht dasselbe Bild, ohne den Scroll
 * anzufassen: Man scrollt normal weiter, die Karten legen sich von selbst
 * übereinander. Nebenbei ist es eine reine Compositor-Sache und kostet auf
 * dem Handy praktisch nichts.
 *
 * Alle Karten schließen oben bündig ab – kein Versatz, keine sichtbaren
 * Kanten. Die vorige verschwindet vollständig unter der nächsten. Dass ein
 * Wechsel stattfindet, zeigt allein der wechselnde Ton (navy-deep / navy):
 * ohne ihn schöbe sich dieselbe Farbe über sich selbst und man sähe nichts
 * als einen Textwechsel.
 *
 * Kein Aufklappen: Ein Klick, der nur Text sichtbar macht, ist eine Hürde
 * ohne Gegenwert. „In Sekunden erfassbar" ist deshalb durch KÜRZEN gelöst –
 * aus je einem Absatz sind drei Stichpunkte geworden, Wortlaut unverändert.
 */
const STEPS = [
  {
    title: "Wärmepumpen",
    /* freigegeben (Briefing 4) */
    result:
      "Wir empfehlen die passende Lösung für Ihr Zuhause und begleiten Sie durch Förderantrag und Installation, mit maximaler Förderung.",
    points: [
      "Ehrliche Prüfung, ob Ihr Haus geeignet ist",
      "Förderanträge stellen wir für Sie",
      "Installation durch geprüfte Fachbetriebe",
    ],
  },
  {
    title: "Photovoltaik-Anlagen",
    /* freigegeben (Briefing 4) */
    result:
      "Wir finden den besten regionalen Installateur für Sie, zum fairsten Preis.",
    points: [
      "Ertrag und Wirtschaftlichkeit vorab gerechnet",
      "Angebote regionaler Fachbetriebe verglichen",
      "Speicher nur, wenn er sich für Sie rechnet",
    ],
  },
  {
    title: "Stromtarif-Vergleich",
    /* freigegeben (Briefing 4) */
    result:
      "Wir wechseln für Sie zum günstigsten Anbieter, schnell, einfach und ohne Aufwand für Sie.",
    points: [
      "Tarife anbieterübergreifend verglichen",
      "Kündigung und Wechsel übernehmen wir",
      "Jährlich neu geprüft, damit es günstig bleibt",
    ],
  },
] as const;

export function Leistungen() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cleanup = maskedHeadline({
          headline: "[data-l-h2]",
          scrollTrigger: { trigger: scope.current, start: "top 78%", once: true },
        });

        // Inhalt jeder Karte taucht auf, wenn sie ins Bild kommt. Kein
        // Scrub – die Karte selbst bewegt sich ja schon durch das Scrollen,
        // eine zweite gescrubbte Bewegung darin wäre unruhig.
        revealItems("[data-l-inhalt] > *", { distance: 18, start: "top 92%" });

        return cleanup;
      });
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      id="leistungen"
      data-nav-theme="dark"
      className="relative scroll-mt-[var(--nav-h)] bg-ep-navy-deep text-white"
    >
      {/* Der Stapel beginnt sofort mit der Sektion – die Überschrift steckt
          in der ersten Karte. Stünde sie davor, würde man erst an ihr
          vorbeiscrollen und der Stapel finge irgendwo in der Mitte an.

          Jede Karte füllt den Bildschirm ganz: randlos, ohne Kachel, ohne
          Innenabstand um die Fläche herum. Die Karte IST die Fläche. */}
      <div className="relative">
        {STEPS.map((step, i) => (
          <div key={step.title} className="sticky top-0 h-svh">
            <div
              className={cn(
                "flex h-full flex-col justify-center overflow-hidden",
                // Alle Karten schließen oben bündig ab und decken die vorige
                // vollständig. Erkennbar bleibt der Wechsel allein über den
                // Ton – ohne ihn schöbe sich Navy auf Navy und man sähe
                // nichts als einen Textwechsel.
                i % 2 === 0 ? "bg-ep-navy-deep" : "bg-ep-navy",
              )}
            >
              <div className="ep-container">
                {/* Die Überschrift läuft mit der ersten Karte ein und
                    verschwindet mit ihr unter der zweiten. */}
                {i === 0 && (
                  <h2 data-l-h2 className="t-h2 mb-16 max-w-[16ch] sm:mb-24">
                    Unser Service.{" "}
                    <span className="text-ep-sun">Ihr Durchblick.</span>
                  </h2>
                )}

                <div
                  data-l-inhalt
                  className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-10"
                >
                  <span className="t-num block text-white/30 lg:col-span-2">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Deutlich größer als `t-h3`: Auf einer bildschirmfüllenden
                      Karte ist der Titel nicht eine Überschrift unter vielen,
                      sondern das Einzige, was man aus der Entfernung liest.
                      5vw ergibt auf 1920 rund 96 px. */}
                  <h3 className="mt-6 max-w-[12ch] text-[clamp(2.25rem,5vw,5rem)] font-bold leading-[1.04] tracking-[-0.035em] lg:col-span-5 lg:col-start-3 lg:mt-0">
                    {step.title}
                  </h3>

                  <div className="mt-10 lg:col-span-5 lg:col-start-8 lg:mt-0">
                    {/* `hyphens-none`: `.t-h4` trennt bewusst automatisch, weil dort sonst
                        die langen Fachkomposita der Kartentitel überstehen. Diese
                        Zeile ist aber ein SATZ, kein Begriff – dort erwischt die
                        Trennung normale Wörter („spa-ren") und liest sich wie ein
                        Fehler. */}
                    {/* 26ch → 34ch: Hier steht jetzt die freigegebene
                        Kundencopy, und die ist ein ganzer Satz statt eines
                        Halbsatzes. Auf 26 Zeichen Zeilenlänge lief der
                        Wärmepumpen-Satz auf sechs sehr kurze Zeilen aus und
                        las sich wie ein Gedicht. */}
                    <p className="t-h4 max-w-[34ch] text-ep-sun [hyphens:none]">
                      {step.result}
                    </p>

                    {/* Linien als Trenner, nicht als Aufzählungszeichen: Ein
                        kurzer Strich vor jedem Punkt ließ sich nie sauber
                        ausrichten (ein 1 px hohes Element hat keine
                        Schriftlinie) und las sich wie ein Gedankenstrich. */}
                    <ul className="mt-8 flex flex-col">
                      {step.points.map((point) => (
                        <li
                          key={point}
                          className="t-lead border-t border-ep-line-dark py-4 leading-relaxed text-white/80 last:border-b last:border-ep-line-dark"
                        >
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
