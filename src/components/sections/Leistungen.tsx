"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { maskedHeadline, revealItems } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * „Unser Service. Ihr Durchblick." – die Leistungen des Hauses:
 * Wärmepumpe, Photovoltaik, Stromtarif, Wallbox.
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
 * FORM: ein Stapel bildschirmhoher Karten. Jede liegt `sticky` und bleibt
 * stehen, während die nächste darüberschiebt – am Ende liegen alle
 * aufeinander wie abgearbeitete Blätter.
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
 * Wechsel stattfindet, zeigt seit 11.08. das FOTO hinter der Karte; vorher
 * war es ein wechselnder Grundton (navy-deep / navy). Beides zusammen wäre
 * doppelt gemoppelt, und der Verlauf über dem Bild müsste dann je Karte die
 * Farbe wechseln.
 *
 * Kein Aufklappen: Ein Klick, der nur Text sichtbar macht, ist eine Hürde
 * ohne Gegenwert. „In Sekunden erfassbar" ist deshalb durch KÜRZEN gelöst –
 * aus je einem Absatz sind drei Stichpunkte geworden, Wortlaut unverändert.
 */
const STEPS = [
  {
    title: "Wärmepumpen",
    bild: "/galerie/g3-waermepumpe-v2.webp",
    bildAlt: "Wärmepumpen-Außengerät neben einem Wohnhaus",
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
    bild: "/galerie/g1-photovoltaik-v2.webp",
    bildAlt: "Photovoltaikmodule auf einem Ziegeldach",
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
    bild: "/galerie/g2-speicher-v2.webp",
    bildAlt: "Wechselrichter und Batteriespeicher an einer Wand",
    /* freigegeben (Briefing 4) */
    result:
      "Wir wechseln für Sie zum günstigsten Anbieter, schnell, einfach und ohne Aufwand für Sie.",
    points: [
      "Tarife anbieterübergreifend verglichen",
      "Kündigung und Wechsel übernehmen wir",
      "Jährlich neu geprüft, damit es günstig bleibt",
    ],
  },
  /* VIERTE KARTE, NOCH NICHT FREIGEGEBEN.
     Ilias hat E-Mobilität im Gespräch erwähnt (Emre, 10.08.), aber ohne
     Wortlaut – anders als die drei darüber, die wörtlich aus Briefing 4
     stammen. Die Formulierungen hier sind deshalb von uns und folgen nur
     dem Muster der anderen drei: eine Ergebniszeile, drei Stichpunkte,
     jeder davon eine Leistung und keine Eigenschaft.

     VOR DEM LIVEGANG von Ilias bestätigen lassen, insbesondere ob er
     Wallboxen tatsächlich vermittelt und ob der THG-Punkt stimmt. Eine
     Leistung zu behaupten, die es nicht gibt, ist derselbe Fehler wie eine
     erfundene Bewertung, nur unauffälliger. */
  {
    title: "Wallbox & E-Mobilität",
    bild: "/galerie/g7-wallbox.webp",
    bildAlt: "Wallbox an einer Hauswand, daneben ein ladendes Auto",
    result:
      "Wir bringen Ihre Wallbox mit Photovoltaik und Speicher zusammen, damit Ihr Auto möglichst mit eigenem Strom lädt.",
    points: [
      "Wallbox passend zu Anschluss und Fahrzeug",
      "Laden vorrangig aus der eigenen Anlage",
      "Anmeldung beim Netzbetreiber übernehmen wir",
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
      data-surface="dark"
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
            <div className="relative flex h-full flex-col justify-center overflow-hidden bg-ep-navy-deep">
              {/* DAS BILD DER KARTE (11.08.) Die Fotos kommen aus der aufgelösten Bildstrecke. Dort
                  standen sie als eigene Sektion unter der Überschrift „In
                  Bildern" und bewiesen nichts: erzeugte Symbolbilder, die
                  aussahen wie ein Referenzteil. Hinter der jeweils
                  passenden Leistungskarte sind sie das, was ein Bild an
                  dieser Stelle sein soll – Zuordnung statt Beleg. Man sieht
                  sofort, wovon die Karte spricht.

                  DIE ALTERNATION IST DAFÜR ENTFALLEN. Vorher wechselten
                  die Karten zwischen `navy-deep` und `navy`, weil sich
                  sonst Navy auf Navy geschoben hätte und man nur einen
                  Textwechsel gesehen hätte. Diesen Dienst leistet jetzt das
                  Bild, und zwar deutlicher. Zwei Grundtöne UND wechselnde
                  Fotos wären zwei Systeme für dieselbe Aufgabe – dazu
                  müsste der Verlauf unten je Karte die Farbe wechseln,
                  sonst mischt er sich auf den ungeraden Karten falsch. */}
              <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <Image
                  src={step.bild}
                  alt=""
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
                {/* DER VERLAUF LÄUFT SENKRECHT, NICHT WAAGERECHT.
                    Ein erster Versuch deckte von links ab – die Logik des
                    Heros, wo rechts nur Fläche liegt. Hier stimmt sie
                    nicht: Der Kartentitel steht links, der gelbe
                    Ergebnissatz und die Stichpunkte stehen RECHTS. Beide
                    Seiten tragen Text, also gibt es keine freie Hälfte, in
                    der das Bild durchkommen könnte. Vom Foto war praktisch
                    nichts zu sehen.

                    Frei ist dagegen oben und unten: Der Inhalt ist
                    vertikal zentriert und belegt rund die mittlere Hälfte
                    der Karte. Der Verlauf ist dort am dichtesten und
                    öffnet sich zu beiden Kanten – man sieht das Dach oben
                    und den Vorplatz unten, und der Text steht trotzdem auf
                    einer ruhigen Fläche.

                    Als `background` und nicht als `filter: blur`: Ein
                    Weichzeichner kostet pro Bild einen vollen
                    Gauß-Durchgang, und diese Karten liegen sticky
                    übereinander. */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(10,35,55,0.45) 0%, rgba(10,35,55,0.82) 20%, rgba(10,35,55,0.93) 42%, rgba(10,35,55,0.93) 60%, rgba(10,35,55,0.78) 80%, rgba(10,35,55,0.42) 100%)",
                  }}
                />
              </div>

              <div className="ep-container relative z-10">
                {/* Die Überschrift läuft mit der ersten Karte ein und
                    verschwindet mit ihr unter der zweiten. */}
                {i === 0 && (
                  <div className="mb-16 sm:mb-24">
                    <h2 data-l-h2 className="t-h2 max-w-[16ch]">
                      Leistungen.{" "}

                    </h2>


                  </div>
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
                    <p className="t-h4 max-w-[34ch] text-ep-accent [hyphens:none]">
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
