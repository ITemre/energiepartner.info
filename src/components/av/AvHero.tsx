"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Image from "next/image";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Marker } from "@/components/ui/Marker";
import { GoogleG } from "@/components/ui/GoogleG";
import { AvUploadKnopf, AvUploadZone } from "@/components/av/AvUpload";
import type { GoogleBewertungen } from "@/lib/google-reviews";
import { maskedHeadline } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * Hero von angebote-vergleichen.info.
 *
 * ═══ DIE HANDLUNG STEHT IM HERO, NICHT DAHINTER ═══
 * Der vorherige Aufbau war ein Longread: Hero mit zwei Knöpfen, dann
 * Pacing, dann eine dreiteilige Zahlensequenz, dann Prüfliste, Ablauf,
 * Auswertung, Transparenz, Stimmen – und ganz am Ende das Formular. Das war
 * gut erzählt und für diese Seite trotzdem falsch.
 *
 * Der Grund liegt in der Aufgabentrennung der beiden Domains (Briefing 3):
 * energiepartner.info baut Vertrauen auf, hier werden Anfragen erzeugt. Wer
 * hier landet, kommt per QR aus einem Brief oder aus einer Anzeige, hat ein
 * Angebot auf dem Tisch und genau eine Frage. Er sucht keinen Anbieter, er
 * sucht eine Antwort – und jede Sektion vor dem Upload ist eine Gelegenheit
 * abzuspringen.
 *
 * Deshalb: Überschrift, ein Satz, Funnel. Mehr steht nicht im ersten Bild.
 *
 * ═══ WAS AUS DEM ALTEN AUFBAU WURDE ═══
 * Die Sektionen sind nicht gelöscht, nur ausgehängt (siehe `av/page.tsx`).
 * Was davon zurückkommt – und in welcher Reihenfolge – entscheidet sich
 * nach dem Kundentermin. Sicher ist nur: Es kommt NACH dem Funnel, für die,
 * die noch etwas brauchen, bevor sie hochladen.
 *
 * ═══ KEIN STICKY, KEIN ZOOM ═══
 * Anders als auf energiepartner.info. Dort ist der Hero eine Bühne, die sich
 * verabschiedet; hier enthält er ein Formular mit Dateiauswahl und
 * wechselnden Schritten. Ein Element, das seine Höhe ändert, während es
 * sticky klebt und gleichzeitig herauszoomt, ist nicht zu kontrollieren –
 * und der Funnel darf unter keinen Umständen teilweise unerreichbar werden.
 */
/**
 * Die Vertrauenszeile aus dem Markenhandbuch – verbindlich, und die
 * Trennung der Zeitangaben ebenfalls: 3 Minuten ist die Übermittlung,
 * 24 Stunden die Auswertung. Wer beides vermischt, verspricht eine Prüfung
 * in drei Minuten.
 *
 * Sie steht zweimal im Markup, weil sie ihren Platz wechselt: ab lg unter
 * der Aussage, darunter unter dem Auslöser. Das ist hier unbedenklich – es
 * ist eine statische Liste ohne Zustand. Bei `AvUpload` wäre dasselbe ein
 * Fehler (zwei Dialoge, zwei Dateizustände), deshalb dort der andere Weg.
 *
 * Mobil untereinander: In einer Zeile brechen die drei Angaben auf 375 px
 * an beliebiger Stelle um, und die senkrechten Trenner landen dann am
 * Zeilenanfang. Der Punkt davor ist der Leucht-Punkt der Wortmarke.
 *
 * ⚠️ HIER STEHT KEINE BEWERTUNG. Ein Zwischenstand hatte Note und Sterne als
 * vierten Punkt in diese Zeile gelegt. Das ist genau die Behandlung, die ein
 * Beleg nicht verträgt: Er stünde in 13 px Grau zwischen drei Zusagen, die
 * wir uns selbst geben – gleich groß, gleich leise, nicht mehr als
 * Fremdaussage erkennbar. Die Bewertung hat deshalb einen eigenen Block
 * (`GoogleSiegel`), und sie steht dort nur EINMAL im ersten Bild.
 */
function Vertrauenszeile({ className }: { className?: string }) {
  return (
    <ul
      data-h-trust
      className={cn(
        "flex-col gap-2 text-[13px] text-white/65 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-2 sm:text-sm",
        className,
      )}
    >
      {[
        "In etwa 3 Minuten übermittelt",
        "Rückmeldung innerhalb von 24 Stunden",
        "Keine Verpflichtung",
      ].map((zeile, i) => (
        <li key={zeile} className="flex items-center gap-2.5 sm:gap-5">
          <span
            aria-hidden="true"
            className="size-1 shrink-0 rounded-full bg-ep-sun sm:hidden"
          />
          {i > 0 && (
            <span
              aria-hidden="true"
              className="hidden h-3.5 w-px bg-white/25 sm:block"
            />
          )}
          {zeile}
        </li>
      ))}
    </ul>
  );
}

/**
 * ⚠️⚠️ DIE EINZIGE STELLE IM PROJEKT MIT FEST GESETZTEN BEWERTUNGSZAHLEN ⚠️⚠️
 *
 * Alles andere zieht Bewertungen serverseitig aus der Places API
 * (`lib/google-reviews.ts`) und zeigt lieber nichts als etwas Ausgedachtes.
 * Hier steht bewusst eine Ausnahme: Das Profil ist zu neu, es liefert über
 * die API noch keine Rezensionen aus, und der Beleg wird im ersten Bild
 * trotzdem gebraucht.
 *
 * WAS HIER NOCH BEHAUPTET WIRD: Note und Anzahl standen als Text im Block
 * und sind raus. Geblieben sind fünf gefüllte Sterne – und die sind selbst
 * eine Tatsachenbehauptung über die eigene Leistung, nur ohne Ziffer. Ein
 * unzutreffendes Sternband ist wettbewerbsrechtlich nichts anderes als eine
 * unzutreffende Zahl (§ 5 Abs. 1 UWG), und Bewertungsangaben sind der
 * zuverlässigste Abmahnfall überhaupt.
 *
 * VOR DEM LIVEGANG gilt deshalb weiterhin: Das Profil muss tatsächlich bei
 * fünf Sternen stehen. Ist es eine 4,7, gehört hier ein halber Stern hin
 * oder gar nichts.
 *
 * ⚠️ DIE KREISE TRAGEN IN DER VORFÜHRUNG STOCKFOTOS. Sie kommen nicht von
 * hier, sondern aus `stimmen-platzhalter.ts` und hängen damit an
 * `PLATZHALTER_INHALTE` – dieselbe doppelte Sperre wie die erfundenen Texte
 * (Umgebungsvariable UND keine Produktionsumgebung). Ohne sie sind die
 * Kreise leer getönt, und genau so geht die Seite live.
 *
 * Warum das nicht verhandelbar ist: Es sind erkennbare Menschen, die diesen
 * Betrieb nie gesehen haben. Öffentlich wären sie eine erfundene Bewertung
 * (§ 5 Abs. 1 UWG) UND eine Bildnisverwendung zu Werbezwecken ohne
 * Einwilligung (§ 22 KUG) UND ein Lizenzverstoß gegenüber Pexels. Wer diese
 * Sperre umgeht, hebelt nicht eine Vorsichtsmaßnahme aus, sondern drei.
 *
 * DIE ATTRIBUTION BLEIBT: Das Profil gehört energiepartner, nicht
 * angebote-vergleichen.info. Deshalb führt der Verweis auf genau dieses
 * Profil – wer nachsieht, muss finden, was hier steht.
 */
const GOOGLE_SIEGEL = {
  /** Das echte Unternehmensprofil – derselbe Verweis wie in den Stimmen. */
  profil: "https://share.google/ScklO04AOG7kRY312",
  /** Wie viele Kreise stehen, solange keine echten Profilbilder da sind. */
  kreise: 4,
} as const;

/**
 * Die Füllungen der Platzhalter-Kreise.
 *
 * Vier verschiedene Töne, nicht vier gleiche: Ein Band identischer Kreise
 * liest sich als Ladezustand, ein Band leicht verschiedener als eine Reihe
 * von Menschen. Deshalb auch die Mischung aus warm und kühl – es sind die
 * Markentöne, nur so weit heruntergezogen, dass sie nicht als Farbmuster
 * auffallen.
 */
const KREIS_TOENE = [
  "bg-white/25",
  "bg-ep-sun/30",
  "bg-ep-blue/50",
  "bg-white/15",
] as const;

/**
 * Das Google-Siegel im ersten Bild.
 *
 * ═══ WARUM ES HIERHER GEHÖRT ═══
 * Der Hero verlangt die größte Handlung der Seite: eine Datei herausgeben,
 * an einen Absender, von dem der Besucher meist noch nie gehört hat – er
 * kommt per QR aus einem Brief. Alles, was bis dahin auf dem Bildschirm
 * steht, ist unsere eigene Aussage. Das Siegel ist die einzige Angabe im
 * ersten Bild, die von außen kommt, und deshalb steht es unmittelbar vor dem
 * Auslöser statt irgendwo darunter.
 *
 * ═══ FORM: KEIN KASTEN ═══
 * Ein erster Entwurf war eine gerahmte Kachel mit eigener Fläche. Sie sah
 * aus wie ein zugekauftes Trust-Widget, und der Grund dafür ist kein
 * Geschmack, sondern ein Stilbruch: Diese Seite baut mit LINIEN. Trennstriche,
 * die Skala im Hintergrund, die durchhängenden `BendLine`s, der handgezogene
 * `Marker` – nirgends steht eine Karte. Die ProofBar auf energiepartner.info
 * notiert im Kopfkommentar denselben Satz („Keine Kacheln, keine Karten"),
 * und die Ablagefläche daneben ist bewusst gestrichelt und flächenlos.
 *
 * Ein Kasten im Hero führt deshalb ein Bauteil ein, das es sonst nicht gibt –
 * und ein einzelnes fremdes Bauteil liest sich immer als eingekauft.
 *
 * Jetzt trägt eine Haarlinie in Sonnengelb den Block, links, über die volle
 * Höhe. Das ist dieselbe Auszeichnung, mit der die Förderung ihre 21.000 €
 * heraushebt (`border-l-2` plus Einzug) – ein Zeichen, das die Seite schon
 * kennt, statt eines neuen.
 *
 * Drei Zeilen, jede mit genau einer Aufgabe: Sternband, Gesichter, Herkunft.
 * Die Sterne sind dabei bewusst KLEINER geworden. Große Sterne wirken nicht
 * wertiger, sondern lauter – bei kleinem Grad liest man das Band als
 * Auszeichnung, bei großem als Werbebanner.
 *
 * WARUM DIE ZIFFERN WEG SIND: „5,0" und „4 Bewertungen" standen als Text im
 * Block, und die Anzahl arbeitete gegen die Aussage. Vier ist eine kleine
 * Zahl; sie auszuschreiben macht aus einem Beleg eine Einschränkung. Die
 * Gesichterreihe sagt dasselbe – hier haben Menschen etwas geschrieben –
 * ohne die Menge zu betonen, die noch klein ist.
 *
 * ⚠️ `ring-ep-navy-deep` MUSS ZUM GRUND DAHINTER PASSEN. Der Ring schneidet
 * die Kreise voreinander frei und macht die Reihe erst als Stapel lesbar.
 * Seit der Block keine eigene Fläche mehr hat, ist dieser Grund der Hero
 * selbst – also `navy-deep`, nicht `navy`. Wer den Block auf ein anderes
 * Band verschiebt, muss den Ring mitziehen, sonst bekommt jeder Kreis einen
 * Rand in einem Ton, den es nirgends sonst gibt.
 *
 * Als `<a>` und nicht als `<div>`: Ein Beleg, den man nicht nachsehen kann,
 * ist keiner.
 *
 * ═══ ECHTE DATEN GEWINNEN ═══
 * Liegen Rezensionen aus der API vor, bestimmen sie das Sternband und den
 * Verweis. Die Konstante greift nur, solange das Profil nichts ausliefert.
 */
function GoogleSiegel({
  bewertungen = null,
  className,
}: {
  bewertungen?: GoogleBewertungen | null;
  className?: string;
}) {
  const profil = bewertungen?.profilUrl ?? GOOGLE_SIEGEL.profil;
  const volleSterne = bewertungen ? Math.round(bewertungen.note) : 5;

  /* Die Reihe. Mit Rezensionen so viele Kreise, wie es Rezensionen gibt
     (höchstens vier – mehr wird die Reihe zum Balken), sonst die feste
     Anzahl aus der Konstante.

     `bild` ist bewusst optional: Auch bei echten Google-Rezensenten hat
     nicht jeder ein Profilbild. Wer keines hat, bekommt hier denselben
     getönten Kreis wie im datenlosen Zustand – dieselbe Lösung, die Google
     selbst wählt, nur ohne Initiale. */
  const reihe = bewertungen
    ? bewertungen.rezensionen
        .slice(0, GOOGLE_SIEGEL.kreise)
        .map((r) => ({ bild: r.autorBild }))
    : Array.from({ length: GOOGLE_SIEGEL.kreise }, () => ({
        bild: undefined as string | undefined,
      }));

  return (
    <a
      data-h-siegel
      href={profil}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        /* Untereinander, ab lg nebeneinander. Der Grund ist die Fläche, an
           der er hängt: Unter dem vollbreiten Knopf auf dem Handy hat er
           Höhe und keine Breite, unter der Ablagefläche auf dem Desktop
           genau umgekehrt. Zwei Zeilen in einer 530 px breiten Spalte
           lassen rechts daneben ein Loch. */
        "group inline-flex flex-col items-start gap-3 border-l-2 border-ep-sun pl-5 outline-none focus-visible:ring-2 focus-visible:ring-ep-sun focus-visible:ring-offset-4 focus-visible:ring-offset-ep-navy-deep lg:flex-row lg:items-center lg:gap-5",
        className,
      )}
    >
      {/* Die Sterne sind Bild, nicht Text: Für Vorlesesoftware wären fünf
          Grafiken ohne Inhalt nur Lärm – die Aussage trägt der Verweis auf
          das Profil.

          Enger Abstand (3 px) statt `gap-1`: Fünf Sterne sollen als EIN
          Band gelesen werden, nicht als fünf Zeichen nebeneinander. */}
      <span className="flex items-center gap-[3px]" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "size-[1.0625rem]",
              i < volleSterne ? "fill-ep-sun text-ep-sun" : "text-white/25",
            )}
          />
        ))}
      </span>

      {/* Die Rezensenten. `-space-x-3` schiebt die Kreise übereinander, der
          Ring in der Grundfarbe schneidet den darunterliegenden frei – so
          entsteht der Stapel ohne eine einzige Maske.

          Beim Überfahren fächert die Reihe leicht auf: Der Abstand geht von
          −12 px auf −8 px. Das ist die kleinste Bewegung, die aus einem
          Stapel eine Gruppe von Einzelnen macht – und sie sagt nebenbei,
          dass hier etwas anklickbar ist. */}
      <span className="flex items-center gap-3.5">
        {/* Die Rezensenten. `-space-x-3` schiebt die Kreise übereinander, der
            Ring in der Grundfarbe schneidet den darunterliegenden frei – so
            entsteht der Stapel ohne eine einzige Maske.

            Beim Überfahren fächert die Reihe leicht auf: Der Abstand geht von
            −12 px auf −8 px. Das ist die kleinste Bewegung, die aus einem
            Stapel eine Gruppe von Einzelnen macht – und sie sagt nebenbei,
            dass hier etwas anklickbar ist. */}
        <span className="flex -space-x-3 transition-[margin] duration-300 group-hover:-space-x-2">
          {reihe.map((eintrag, i) => (
            <span
              key={i}
              aria-hidden="true"
              className={cn(
                "relative size-9 shrink-0 overflow-hidden rounded-full ring-2 ring-ep-navy-deep",
                eintrag.bild ? "bg-ep-navy" : KREIS_TOENE[i % KREIS_TOENE.length],
              )}
            >
              {eintrag.bild && (
                /* `fill` statt fester Maße: `sizes` deckelt, was der Browser
                   tatsächlich lädt – ohne die Angabe zieht Next die volle
                   Viewportbreite und holt für einen 36-px-Kreis ein Bild in
                   Bildschirmgröße. */
                <Image
                  src={eintrag.bild}
                  alt=""
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              )}
            </span>
          ))}
        </span>

        {/* Kein Text mehr daneben. „Bewertungen für energiepartner"
            stand hier und las sich wie eine Bildunterschrift – erklärend,
            wo nichts zu erklären ist. Sterne, Gesichter und das
            Google-Zeichen sagen die Sache in drei Zeichen; jedes Wort
            zusätzlich macht aus dem Beleg eine Behauptung über den Beleg.

            Die Herkunft geht dabei nicht verloren: Sie steht im
            Vorlese-Text unten und im Ziel des Verweises. */}
        <GoogleG className="size-[1.375rem] shrink-0 opacity-80 transition-opacity group-hover:opacity-100" />
      </span>

      <span className="sr-only">
        Bewertungen für energiepartner bei Google ansehen
      </span>
    </a>
  );
}

export function AvHero({
  /* Optional und mit `null` als Vorgabe: Solange das Profil über die API
     nichts ausliefert, ruft `av/page.tsx` den Hero ohne Daten auf und das
     Siegel greift auf seine Konstante zurück. Die Prop ist der Weg, auf dem
     echte Zahlen später ohne Markup-Änderung hereinkommen. */
  bewertungen = null,
}: {
  bewertungen?: GoogleBewertungen | null;
}) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(
          "[data-h-vorzeile], [data-h-sub], [data-h-siegel], [data-h-trust]",
          { autoAlpha: 0 },
        );

        gsap.fromTo(
          "[data-h-skala]",
          { scale: 1.06, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 2.4, ease: "expo.out", force3D: true },
        );

        return maskedHeadline({
          headline: "[data-h-h1]",
          build: (tl) => {
            tl.fromTo(
              "[data-h-vorzeile]",
              { y: 14, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.8 },
              0.1,
            )
              .fromTo(
                "[data-h-sub]",
                { y: 24, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.9 },
                0.6,
              )
              /* Das Siegel kommt VOR der Vertrauenszeile herein und mit
                 etwas mehr Weg (24 statt 16): Es ist der Beleg, sie ist die
                 Absicherung – in dieser Reihenfolge liest man es auch. */
              .fromTo(
                "[data-h-siegel]",
                { y: 24, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.8 },
                0.8,
              )
              .fromTo(
                "[data-h-trust]",
                { y: 16, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.8 },
                1,
              );
          },
        });
      });
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      /* Der Bezugspunkt der mitlaufenden Leiste (`AvStickyBar`). Als eigene
         Kennung, nicht über die Stellung im Baum: Die suchte den Hero vorher
         als „erste Sektion in `<main>`" und griff daneben, sobald Hero und
         Beispielrechnung einen gemeinsamen Grund-Wrapper bekamen. */
      data-av-hero
      data-nav-theme="dark"
      className="relative overflow-hidden bg-ep-navy-deep"
    >
      <div
        data-h-skala
        aria-hidden="true"
        className="ep-skala pointer-events-none absolute inset-0"
      />

      {/* ⚠️ EIN BILDSCHIRM, AUCH AUF DEM HANDY.
          Der Funnel ist die Seite. Wer scrollen muss, um ihn zu sehen,
          bekommt ihn nicht zu sehen – auf einer Leadstrecke, deren Traffic
          per QR aus einem Brief kommt, entscheidet sich alles im ersten
          Bild.

          `100svh`, nicht `dvh`: `dvh` misst die Höhe OHNE Browserleiste und
          ist damit der optimistische Wert – beim ersten Laden ist die Leiste
          aber ausgefahren, und genau dann müsste alles passen. `svh` ist die
          kleinste garantierte Höhe und deshalb die einzige, auf die man eine
          Zusage wie diese stellen kann.

          Der Hero trägt nur Aussage und Auslöser – die Schritte laufen im
          Vollbild (siehe `AvUpload`). Dadurch bleibt Platz für die
          vollständige Copy, statt sie für ein eingebautes Formular zu
          kürzen.

          ⚠️ ZWEI KOMPOSITIONEN, EINE SEKTION:
          Unter lg steht alles in einer Spalte, und der Auslöser ist ein
          Knopf – so passt der Hero auf ein Handydisplay, ohne dass ein Wort
          fehlt.
          Ab lg trägt die rechte Hälfte die Ablagefläche. Das ist nicht nur
          Platzverwertung: Eine sichtbare Zone zeigt, dass hier etwas
          hineingehört, statt es zu behaupten – und auf dem Desktop kann man
          eine Datei tatsächlich hineinziehen. */}
      <div className="ep-container relative z-10 flex min-h-[100svh] flex-col justify-center pb-10 pt-[calc(var(--nav-h)+1.5rem)] sm:pb-16 sm:pt-[calc(var(--nav-h)+3rem)]">
        <div className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-14">
          <div className="max-w-[46rem] lg:col-span-7">
          {/* Freigegebene Kundencopy, wörtlich. „Mehr" trägt die
              Auszeichnung, weil dort der Schmerz sitzt: nicht die Kosten
              sind das Problem, sondern dass sie NACH der Unterschrift
              dazukamen. */}
          <p data-h-vorzeile className="t-label max-w-[32ch] text-white/70">
            Unterschrieben und hinterher{" "}
            <span className="text-ep-sun">Mehr</span>kosten? Schluss damit!
          </p>

          {/* Weiches Trennzeichen im Kompositum: „Wärmepumpenangebot" ist
              auf 375 px breiter als die Zeile. Ohne die Trennmöglichkeit
              schiebt es die Headline über den Rand, mit einem harten
              Bindestrich stünde er auch dort, wo Platz ist.

              `11svh` deckelt gegen die HÖHE, nicht nur gegen die Breite:
              Der Hero hat hier eine Zusage einzuhalten – ein Bildschirm –
              und eine Headline, die nur mit der Breite skaliert, sprengt
              sie auf jedem flachen Gerät. */}
          <h1
            data-h-h1
            className="mt-5 max-w-[13ch] font-bold leading-[1.03] tracking-[-0.03em] text-white sm:mt-7"
            style={{
              fontSize: "min(clamp(2.25rem, 6vw, 5.5rem), 11svh)",
              fontStretch: "86%",
            }}
          >
            Ist Ihr Wärmepumpen&shy;angebot{" "}
            <span className="text-ep-sun">
              <Marker delay={1}>vollständig</Marker>
            </span>
            ?
          </h1>

          <p
            data-h-sub
            className="mt-5 max-w-[42ch] text-[clamp(1rem,1.2vw,1.1875rem)] leading-relaxed text-white/80 sm:mt-7"
          >
            Laden Sie es hoch. Wir lesen es Position für Position und sagen
            Ihnen, was darin fehlt.
          </p>

            {/* Ab lg steht die Vertrauenszeile hier unter der Aussage;
                mobil rückt sie unter den Auslöser, weil sie dort die
                Absicherung zur Handlung ist. */}
            <Vertrauenszeile className="mt-8 hidden sm:mt-10 lg:flex" />
          </div>

          {/* Zwei Erscheinungsformen desselben Auslösers – Input und Dialog
              liegen im `AvUploadProvider`, hier steht nur der Griff.

              Auf dem Handy ein Knopf: Man tippt, der Systemdialog geht auf,
              dort liegen Kamera und Dateien. Ab lg die Ablagefläche, weil
              dort Platz neben der Aussage ist und Ziehen wirklich
              funktioniert. */}
          <div data-h-cta className="mt-8 sm:mt-10 lg:col-span-5 lg:mt-0">
            <div className="lg:hidden">
              <AvUploadKnopf className="w-full sm:w-auto" />
            </div>

            <div className="hidden lg:block">
              <AvUploadZone />
            </div>

            {/* ═══ DER BELEG SITZT AM AUSLÖSER, NICHT BEI DER AUSSAGE ═══
                Er stand zuerst links unter dem Fließtext. Dort war er ein
                weiteres Argument unter Argumenten – und Argumente hat diese
                Spalte genug. Hier unten ist er das Letzte, was im Blick
                liegt, bevor jemand eine Datei herausgibt: erst die Handlung,
                dann wer sie schon gemacht hat.

                ⚠️ AB lg EINE ZEILE, NICHT ZWEI ZENTRIERTE BLÖCKE.
                Ein Zwischenstand hatte Siegel und Preiszeile mittig
                untereinander gesetzt. Zwei Fehler auf einmal: Der Block
                trägt seine Auszeichnung LINKS, und eine linke Haarlinie an
                einem zentrierten Element liest sich nicht als Anker, sondern
                als verirrter Strich. Und drei gestapelte Dinge unter einer
                großen gestrichelten Fläche lassen den kleinsten davon wie
                einen Nachtrag aussehen.

                Jetzt spannt sich eine Zeile über die volle Spaltenbreite:
                Siegel an der linken Kante der Ablagefläche, Preiszeile an
                der rechten. Die Haarlinie fluchtet damit mit dem Rand der
                Zone darüber und hat eine Kante, an der sie hängt.

                Darunter (kein lg) bleibt beides untereinander und links –
                dort gibt es keine zweite Kante, gegen die man setzen
                könnte. */}
            <div className="mt-6 flex flex-col gap-5 lg:mt-7 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
              <GoogleSiegel bewertungen={bewertungen} />

              {/* ⚠️ NUR NOCH ZWEI WÖRTER, UND DAS IST DER PUNKT.
                  Hier stand „Kostenlos · Rückmeldung innerhalb von 24
                  Stunden". Neben dem Siegel blieben davon rund 200 px
                  Restbreite, und der Satz zerfiel rechtsbündig in vier
                  Fetzen („Kostenlos · / Rückmeldung / innerhalb von 24 /
                  Stunden") – ein Flattersatz-Klotz neben einer sauberen
                  Zeile.

                  Gestrichen ist dabei nichts, was fehlt: Frist und
                  Unverbindlichkeit stehen zwei Zentimeter weiter links in
                  der Vertrauenszeile. Der Preis stand dort NICHT, und er
                  ist das einzige Wort, das an einen Auslöser gehört. */}
              <p className="shrink-0 text-sm text-white/60 lg:text-right">
                Kostenlos · unverbindlich
              </p>
            </div>
          </div>

          <Vertrauenszeile className="mt-8 flex lg:hidden" />
        </div>
      </div>
    </section>
  );
}
