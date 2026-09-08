"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Marker } from "@/components/ui/Marker";
import { countUp, maskedHeadline, revealItems } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * „Was der Staat dazugibt."
 *
 * WARUM DIESE SEKTION DER GRÖSSTE HEBEL DER SEITE IST * Der Einwand, an dem eine Wärmepumpe scheitert, ist immer derselbe: zu
 * teuer. Die Seite hatte darauf bisher keine Antwort — die Förderung kam in
 * einem Nebensatz vor („Fördermittel prüfen und beantragen", ein Punkt unter
 * acht). Dabei ist sie das stärkste Argument, das dieses Geschäft hat: Sie
 * halbiert die Rechnung, sie ist keine Behauptung von uns, und Ilias stellt
 * die Anträge selbst.
 *
 * Ein Einwand, den man mit einer Zahl beantworten kann, gehört in eine eigene
 * Sektion. Versteckt in einer Aufzählung ist er nur ein Punkt unter acht.
 *
 * ZU DEN ZAHLEN * Die Sätze der Bundesförderung für effiziente Gebäude ändern sich, und was
 * im Einzelfall gilt, hängt am Gebäude, am Einkommen und am Zeitpunkt. Die
 * Sektion nennt deshalb die STRUKTUR (Grundförderung plus Boni, gedeckelt)
 * und nicht „Sie bekommen X". Der individuelle Betrag entsteht in der
 * Beratung — genau das ist ja die Leistung.
 *
 * Das ist auch der wettbewerbsrechtlich saubere Weg: „Bis zu 70 %" mit
 * sichtbarer Herleitung und Stichtag ist belegbar. „70 % Förderung" ohne
 * Bedingungen wäre eine Zusage, die für die meisten Häuser nicht stimmt.
 *
 * VOR DEM LIVEGANG: Sätze und Stichtag gegen die dann gültige Richtlinie
 * prüfen. Diese Sektion ist die einzige der Seite, die veralten kann.
 */
/**
 * `kurz` statt `text` (10.08.): Die Bedingung muss dastehen, sonst behauptet
 * jeder Bonus, für jeden zu gelten. Ausformuliert muss sie nicht sein – wer
 * wissen will, ob ein Bonus für ihn gilt, erfährt das ohnehin erst in der
 * Beratung, und genau das sagt die Fußnote am Ende der Sektion.
 *
 * Vier ausformulierte Sätze kosteten hier rund eine halbe Bildschirmhöhe.
 */
const BAUSTEINE = [
  {
    wert: "30 %",
    titel: "Grundförderung",
    kurz: "Für den Tausch einer alten Heizung gegen eine Wärmepumpe.",
  },
  {
    wert: "+ 20 %",
    titel: "Klimageschwindigkeits-Bonus",
    kurz: "Wenn Sie eine alte, funktionierende Öl- oder Gasheizung früh ersetzen.",
  },
  {
    wert: "+ 30 %",
    titel: "Einkommens-Bonus",
    kurz: "Für Selbstnutzer unter einer Einkommensgrenze des Haushalts.",
  },
  {
    wert: "+ 5 %",
    titel: "Effizienz-Bonus",
    kurz: "Für natürliches Kältemittel oder Erdreich, Wasser, Abwasser als Quelle.",
  },
] as const;

export function Foerderung() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        revealItems("[data-f-baustein]", { distance: 24, start: "top 90%" });
        revealItems("[data-f-block]", { distance: 20, start: "top 92%" });

        /* DIE ZAHLEN LAUFEN HOCH (13.08.) Die Sektion ist die einzige, die mit Beträgen argumentiert, und
           sie tat es bis hier vollkommen bewegungslos. Der Hauptbetrag
           bekommt mehr Zeit als die vier Bausteine: Er ist die Aussage,
           sie sind die Herleitung.

           Die Bausteine starten SPÄTER als die 21.000 € („top 92%" gegen
           „top 86%"), obwohl sie im Markup darunter stehen. Auf dem
           Desktop liegen beide gleichzeitig im Bild, und wenn fünf Zahlen
           im selben Moment loslaufen, zählt keine – es flimmert nur. So
           läuft erst der Betrag, dann die Herleitung darunter. */
        const zahlAus = countUp("[data-f-zahl]", { start: "top 86%", duration: 1.9 });
        const bausteineAus = countUp("[data-f-wert]", {
          start: "top 92%",
          duration: 1.1,
        });

        const kopfAus = maskedHeadline({
          headline: "[data-f-h2]",
          follow: "[data-f-eyebrow]",
          scrollTrigger: { trigger: scope.current, start: "top 78%", once: true },
        });

        return () => {
          zahlAus();
          bausteineAus();
          kopfAus();
        };
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

       DIE OBERKANTE IN DER AKZENTFARBE IST PFLICHT, NICHT ZIERDE.
       Seit die Sektion direkt hinter dem Hero steht, trägt sie dessen
       Aufgabe mit: Der Hero liegt sticky und zoomt beim Rausscrollen
       heraus, und ein Zoom ist nur wahrnehmbar, wenn etwas mit sichtbarer
       Kante davorzieht. Ohne die Linie schöbe sich Papier lautlos über
       Navy und der Effekt verpuffte.

       FARBREGEL: Auf Papier ist die Rolle `ep-accent` durchgehend zu
       verwenden (löst zu `ep-orange-deep`, 5,4:1) – nie die rohe Basis
       `ep-orange` als Schrift (3,1:1, zu wenig für Kleintext).

       EIN BILDSCHIRM. DAS IST EINE OBERGRENZE, KEIN RICHTWERT. Die Sektion lief auf gut 200vh und war damit der Hauptgrund für den
       Eindruck vom endlosen Scrollen, den der Kunde zurückgemeldet hat
       (10.08.). Sie steht an zweiter Stelle: Wer hier ins Scrollen gerät,
       sieht vom Rest der Seite nichts mehr.

       Rausgeflogen ist der zweite Argumentationsstrang („Den Papierkram
       machen wir" mit vier Aufgaben und der `BendLine`). Er war gut, aber
       er beantwortet eine Frage, die an dieser Stelle noch niemand stellt.
       Wer gerade erfährt, dass er 21.000 € geschenkt bekommt, fragt nicht
       nach dem Antragsaufwand.

       WAS NICHT GEKÜRZT WERDEN DARF, und das ist kein Geschmack:
       Die vier Bausteine sind die HERLEITUNG der 70 %, und die Fußnote
       nennt Stand und Deckelung. „Bis zu 70 %" mit sichtbarer Herleitung
       und Stichtag ist belegbar; dieselbe Zahl ohne beides ist eine Zusage,
       die für die meisten Häuser nicht stimmt. Wer weiter kürzen muss,
       nimmt den Reihenfolge-Hinweis oder die CTA-Zeile, niemals die
       Bausteine und niemals die Fußnote.

       Auf Mobil greift die Deckelung bewusst NICHT (`lg:min-h-svh`): Vier
       Bausteine plus Fußnote passen auf 390 px in keinen Bildschirm, und
       eine Zusage, die man nur durch Abschneiden hält, ist keine.

       `lg:pt-[var(--nav-h)]` GEHÖRT ZUR DECKELUNG, nicht zur Optik.
       Die Kopfleiste liegt `fixed` ÜBER dem Inhalt. Ohne diesen Abzug
       zentriert `justify-center` gegen die volle Bildschirmhöhe, also auch
       gegen die Fläche, die die Leiste verdeckt – der Inhalt säße um eine
       halbe Leistenhöhe zu hoch, und bei voller Sektion verschwände die
       Oberkante darunter. Mit `box-border` (Tailwind-Vorgabe) zählt das
       Polster in die `min-height` hinein, der freie Raum für die
       Zentrierung ist damit genau der SICHTBARE Bereich. */
    <section
      ref={scope}
      id="foerderung"
      data-nav-theme="light"
      className="relative scroll-mt-[var(--nav-h)] overflow-hidden border-t-2 border-ep-accent bg-ep-paper text-ep-ink lg:flex lg:min-h-svh lg:flex-col lg:justify-center lg:pt-[var(--nav-h)]"
    >
      <div className="ep-container relative py-16 sm:py-20 lg:py-[clamp(0.75rem,2.4svh,2.75rem)]">
        <div className="lg:flex lg:items-end lg:justify-between lg:gap-14">
          <div>
            <p data-f-eyebrow className="t-label text-ep-accent">
              Förderung
            </p>
            <h2
              data-f-h2
              className="t-h2 mt-4 max-w-[15ch] text-ep-ink"
              /* DECKEL GEGEN DIE HÖHE, nicht nur gegen die Breite.
                 `.t-h2` skaliert mit `vw`. Auf einem flachen Fenster
                 (1280×720) füllt eine zweizeilige Headline damit ein
                 Fünftel des Bildschirms und schiebt den Rest der Sektion
                 hinaus. Dieselbe Technik wie im Hero. */
              style={{ fontSize: "min(clamp(2.1rem,4.4vw,4.75rem),9svh)" }}
            >
              Bis zu{" "}
              <span className="text-ep-accent">
                <Marker variante={1}>70 Prozent</Marker>
              </span>{" "}
              zahlt nicht Ihr Haushalt.
            </h2>
          </div>

          {/* DIE ZAHL, DIE ÜBERZEUGT.
              Prozente sind abstrakt, ein Euro-Betrag ist es nicht: 70 %
              versteht man, 21.000 € spürt man. Der Deckel von 30.000 € steht
              nicht mehr hier, sondern nur noch in der Fußnote – zweimal
              dieselbe Einschränkung kostet eine Zeile und nimmt der Zahl
              ihre Wirkung. */}
          {/* `data-parallax` GEHÖRT AUF DEN WRAPPER, NICHT AUF DAS `<p>`.
              Das `<p>` trägt die Akzentkante; säße der Versatz dort, würde
              die Kante gegen ihre eigene Textzeile wandern. Auf dem Wrapper
              bewegt sich der Block als eine Einheit.

              18 px ist der obere Rand dessen, was die Konvention in
              `MotionRoot` erlaubt (8–28) – bewusst, weil dieser Block der
              Nachbar der Überschrift ist und der Versatz ZWISCHEN beiden
              den Effekt macht. Die Überschrift bleibt ohne Wert, sie ist
              die ruhende Bezugskante. */}
          <div data-f-block data-parallax="18" className="mt-8 shrink-0 lg:mt-0">
            <p className="border-l-2 border-ep-accent-strong pl-5">
              <span
                data-f-zahl
                className="block text-[min(clamp(2.25rem,4.6vw,4rem),7.5svh)] font-bold leading-none tracking-[-0.03em] text-ep-accent [font-variant-numeric:tabular-nums]"
              >
                21.000 €
              </span>
              <span className="mt-2.5 block max-w-[30ch] text-lg leading-snug text-ep-ink/80">
                Zuschuss im besten Fall, den Sie nicht zurückzahlen.
              </span>
            </p>
          </div>
        </div>

        {/* Die vier Bausteine. Als ADDITION gesetzt, nicht als Liste: Das
            Pluszeichen macht sichtbar, dass sich die Sätze stapeln – genau
            das versteht kaum jemand, und genau daran hängt die 70.

            Die erklärenden Sätze sind auf einen Halbsatz eingedampft. Sie
            müssen bleiben (sonst behauptet jeder Bonus, für jeden zu
            gelten), aber sie müssen nicht ausformuliert sein: Wer wissen
            will, ob ein Bonus für ihn gilt, erfährt es ohnehin erst in der
            Beratung. Das sagt die Fußnote. */}
        <ul className="mt-10 grid gap-px sm:mt-12 lg:mt-[clamp(0.75rem,2.5svh,3rem)] lg:grid-cols-4">
          {BAUSTEINE.map((b, i) => (
            <li
              key={b.titel}
              data-f-baustein
              className={[
                "border-t border-ep-line py-5 pr-6 lg:py-[clamp(0.5rem,1.6svh,1.25rem)]",
                i > 0 ? "lg:border-l lg:border-ep-line lg:pl-6" : "",
              ].join(" ")}
            >
              <span
                data-f-wert
                className="block text-[clamp(1.5rem,2.4vw,2rem)] font-bold leading-none tracking-[-0.015em] text-ep-accent [font-variant-numeric:tabular-nums]"
              >
                {b.wert}
              </span>
              <h3 className="mt-2.5 text-[15px] font-semibold leading-snug text-ep-ink [hyphens:auto] sm:text-base">
                {b.titel}
              </h3>
              <p className="mt-1.5 max-w-[30ch] text-[13px] leading-snug text-ep-ink/60">
                {b.kurz}
              </p>
            </li>
          ))}
        </ul>

        {/* Der Reihenfolge-Hinweis ist der wertvollste Satz der Sektion:
            konkret, nachprüfbar, und er beschreibt einen Fehler, der richtig
            weh tut. Wer ihn liest, versteht sofort, wofür er einen Begleiter
            braucht. Steht jetzt neben der Handlung statt darüber, das spart
            eine ganze Bildschirmhöhe. */}
        {/* HIER STAND EIN CTA-KNOPF („Förderung prüfen lassen"), raus am
            10.08. auf Kundenwunsch.

            Der Grund ist die Aufgabenteilung der beiden Auftritte: Anfragen
            erzeugt angebote-vergleichen.info, energiepartner.info baut
            Vertrauen auf. Ein Handlungsknopf mitten in einer
            Argumentationssektion ist die Sprache einer Landingpage – er
            unterbricht das Argument genau dort, wo es gerade wirkt, und
            macht aus einer Erklärung eine Verkaufsfläche.

            Der Weg zur Kontaktaufnahme steht jetzt an zwei Stellen, an
            denen ihn auch jedes andere Unternehmen hat: oben im Hero und
            unten in der Kontaktsektion. Dazwischen wird argumentiert, nicht
            verkauft. */}
        {/* Kleinster Versatz der Sektion (10 gegen 18 am Betrag): Der
            Hinweis ist der letzte Block und soll nachziehen, nicht
            vorauslaufen. */}
        <div
          data-f-block
          data-parallax="10"
          className="mt-10 max-w-[62ch] border-l-2 border-ep-accent-strong bg-ep-sand/60 py-4 pl-5 pr-4 sm:mt-12 lg:mt-[clamp(0.75rem,2.5svh,3rem)]"
        >
          <p className="leading-relaxed text-ep-ink/85">
            <span className="font-semibold text-ep-ink">
              Die Reihenfolge entscheidet.
            </span>{" "}
            Wer den Auftrag unterschreibt, bevor der Antrag gestellt ist,
            kann den Zuschuss vollständig verlieren.
          </p>
        </div>

        {/* HIER STAND DIE FÖRDER-FUSSNOTE, raus am 12.08. auf Wunsch von
            Emre: fünf Zeilen Kleingedrucktes brachen die Komposition, und
            eine Vertrauensseite ist kein AGB-Dokument.

            SIE IST NICHT GELÖSCHT, sondern in den Footer gewandert, direkt
            neben den Vermittlerhinweis (`FOERDERHINWEIS` in `lib/site.ts`).
            Das ist kein Formalismus: „Bis zu 70 Prozent" und „21.000 € im
            besten Fall" sind ohne Stichtag und ohne die Deckelung auf
            30.000 € eine Zusage, die für die meisten Häuser nicht stimmt.
            Belegbar wird die Zahl erst durch die vier Bausteine darüber
            (die Herleitung) UND die Angabe, worauf sie sich bezieht.

            Wer die Sektion umbaut, darf die Bausteine also weiterhin nicht
            anfassen – und muss prüfen, ob der Hinweis im Footer noch steht. */}
      </div>
    </section>
  );
}
