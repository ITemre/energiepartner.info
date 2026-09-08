"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ScrollCue } from "@/components/ui/ScrollCue";
import { GoogleG } from "@/components/ui/GoogleG";
import { Marker } from "@/components/ui/Marker";
import { formatiereNote, type GoogleBewertungen } from "@/lib/google-reviews";
import { maskedHeadline } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * * HERO — Neubau (07.08.2026)
 * *
 * WAS AM VORGÄNGER NICHT STIMMTE * Er war schön und hat nicht verkauft. Konkret:
 *
 * 1. **Rund 55 % der Fläche waren leer.** Headline, Fließtext und Knöpfe
 *    standen alle im linken Drittel, rechts lag nichts. Als „Rand, gegen den
 *    die Schrift wirkt" gedacht — gelesen hat es sich als unfertige Seite.
 * 2. **Die Knöpfe saßen rechts unten neben dem Fließtext**, also weder bei
 *    der Aussage noch am Blickziel. Man musste die Handlung suchen.
 * 3. **Der einzige Beleg war eine 13-px-Zeile in 70 % Weiß.** Der stärkste
 *    Inhalt des Bildschirms — eine Fremdbewertung — war typografisch sein
 *    schwächster.
 * 4. **Kein Bild.** Bei einem Gewerk, das man anfassen kann, ist eine rein
 *    typografische Fläche eine Behauptung ohne Gegenstand.
 *
 * HELL STATT NAVY (10.08.2026) * Der Hero lief auf `navy-deep` mit randlosem Foto und zwei Verläufen. Auf
 * Wunsch von Emre ist er jetzt hell, nach dem Muster einer
 * Konversionsseite aus derselben Branche (febesol.de/s/solaranlage/v3).
 *
 * Übernommen ist die STRUKTUR, nicht die Gestaltung: Auszeichnungszeile,
 * große Überschrift, ein Satz, drei abgehakte Punkte, ein Knopfpaar,
 * Belege darunter. Farben, Schrift, Raster und Bildsprache bleiben die der
 * Marke.
 *
 * WAS DER HELLE GRUND ALLES MITZIEHT, falls jemand zurückbaut:
 *   · `data-nav-theme="light"` an der Sektion (ungenutzt seit die
 *     Kopfleiste auf „solide Bar" umgestellt ist, siehe `SiteHeader.tsx` –
 *     steht trotzdem zur Dokumentation und für mögliche künftige Nutzung)
 *   · `ep-skala-tinte` – weiße Linien sind auf Papier unsichtbar
 *   · `ep-accent` für JEDEN Text (löst hier zu `ep-orange-deep` auf –
 *     die Rolle passt sich über `data-surface` automatisch an, siehe
 *     Token-Block von `globals.css`)
 *   · `ep-line` statt `ep-line-dark` an der Beleg-Leiste
 *   · `ScrollCue` erbt seine Farbe seit 10.08. über `currentColor`
 *
 * DER AUFBAU *
 *   ┌─────────────────────────────┬───────────────────┐
 *   │ Eyebrow                     │                   │
 *   │ HEADLINE (groß, markiert)   │   Foto im Rahmen  │
 *   │ Ein Satz                    │                   │
 *   │ ✓ drei Punkte               │                   │
 *   │ ▸ CTA-Paar                  │                   │
 *   ├─────────────────────────────┴───────────────────┤
 *   │ BELEG-LEISTE über die volle Breite              │
 *   └─────────────────────────────────────────────────┘
 *
 * Eine Blickachse von oben nach unten: sehen, verstehen, zustimmen,
 * handeln, geglaubt bekommen. Der Beleg steht darunter über die ganze
 * Breite und trägt den Block, statt am Rand mitzulaufen.
 *
 * WARUM DAS FOTO * Es ist ein Stockfoto einer Wärmepumpe. Kein Personenfoto: Das Kickoff
 * verlangt ausdrücklich, dass kein One-Man-Show-Eindruck entsteht, Ilias'
 * Porträt hat seinen Auftritt in der Bildstrecke.
 *
 * Es steht in einem Rahmen und nicht mehr randlos. Randlos war auf Navy
 * richtig – ein Foto kann in eine dunkle Fläche hineinlaufen. Auf Papier
 * geht das nicht: Ein Verlauf nach #FBF6EE macht daraus einen
 * ausgeblichenen Fleck, ohne Verlauf schneidet ein dunkles Rechteck die
 * helle Fläche hart durch.
 *
 * BEWEGUNG * Ankunft gestaffelt (Zeilenmasken für die Headline, danach Satz, Handlung,
 * Beleg). Das Foto zieht sich per `clip-path` von unten auf — kein `scale`,
 * weil ein skaliertes Foto beim Zoom-Abgang doppelt transformiert würde.
 * Abgang unverändert: Der Hero liegt sticky auf z-0 und zoomt heraus,
 * während der Rest darüberzieht.
 */

/**
 * Die drei Punkte über der Handlung.
 *
 * HIER STAND EINMAL „20 MINUTEN" – entfernt (07.08.), weil die Zahl
 * nirgends herkommt: nicht aus dem Projekt-Briefing, nicht aus dem
 * Markenhandbuch. Sie ist im Code entstanden. Und sie wäre eine Zusage über
 * einen Termin, den Ilias führt, nicht wir – dauert das Gespräch
 * fünfundvierzig Minuten, beginnt die Beziehung mit einem gebrochenen
 * Versprechen. Sobald er eine echte Dauer nennt, gehört sie hier hinein.
 *
 * WOHER DAS MUSTER KOMMT * Eine Konversionsseite, die dieselbe Zielgruppe bedient, macht es genauso:
 * Auszeichnungszeile, große Überschrift, drei abgehakte Punkte, ein Knopf.
 * Der Grund ist nicht Mode. Zwischen einer Überschrift und einem Knopf
 * fehlt sonst der Schritt, in dem jemand ENTSCHEIDET – ein Fließtextsatz
 * wird überflogen, drei Zeilen mit Haken werden gelesen.
 *
 * HAKEN STATT LEUCHT-PUNKT, UND DAS IST EINE AUSNAHME.
 * An anderer Stelle steht in dieser Datei, dass ein Häkchen Erledigtes
 * behauptet und Zusagen deshalb den Markenpunkt tragen. Das galt für die
 * alten `ZUSAGEN` („vor Ort oder am Telefon"), und es stimmt dort auch:
 * Das sind Angebote, keine Fakten.
 *
 * Diese drei sind Fakten über die Arbeitsweise. „Wir stellen den
 * Förderantrag" ist keine Absichtserklärung, sondern eine Leistung. Für
 * Erledigtes ist der Haken das richtige Zeichen.
 *
 * ERSTER PUNKT = DIE VERMITTLERROLLE, und die steht hier nicht zufällig
 * an erster Stelle: Der Kunde hat am 09.08. ausdrücklich darum gebeten, sie
 * schon zu zeigen, „wenn der Kunde auf die Seite kommt", statt sie unten in
 * den FAQ zu lassen. Wer sie umformuliert, muss diesen Kern erhalten:
 * Anschluss zu vielen, und wir suchen daraus das Beste heraus.
 */
const PUNKTE = [
  "Anbieterübergreifend",
  "Bis zu 70% Förderung",
  "Kostenlose Beratung",
] as const;

/**
 * Wann der sticky Hero samt Zoom-Abgang läuft.
 *
 * DIE SCHWELLE HÄNGT AN DER HÖHE, NICHT AN DER BREITE * Ein iPhone SE hat 667 px, ein iPhone 14 hat 852 px – gleich schmal, aber
 * nur beim ersten wird der Hero höher als der Bildschirm. Und ein sticky
 * Element, das nicht in den Viewport passt, hat einen dauerhaft
 * unerreichbaren Bereich: Es klebt oben fest, während der Rest der Seite
 * darüberzieht.
 *
 * Die Breitenbedingung schützt den Desktop: Ein flaches, aber breites
 * Fenster (etwa 1600×690) hat das Problem nicht, weil dort die Beleg-Leiste
 * vierspaltig läuft und die Knöpfe nebeneinander stehen. Ohne sie verlöre
 * ausgerechnet jeder Laptop den Auftakt der Seite.
 *
 * WARUM DIE QUERY SO UMSTÄNDLICH AUSSIEHT * Ausgeschlossen werden soll „flach UND schmal". Die Negation davon ist
 * „hoch ODER breit", und dieses ODER ist in Media Queries das Komma – die
 * einzige Schreibweise, die überall funktioniert. `not (… and …)` gehört zu
 * Media Queries Level 4; wo das nicht ausgewertet wird, wäre die Bedingung
 * immer falsch und der Auftakt der Seite verschwunden.
 *
 * `prefers-reduced-motion` steht in BEIDEN Zweigen, weil ein Komma
 * vollständige Bedingungen trennt und nichts klammert.
 *
 * Die Sektion trägt dieselbe Schwelle noch einmal als
 * `[@media(max-height:780px)]:relative`. Tailwind
 * kann keine Konstante aus TypeScript lesen – wer einen Wert ändert, muss
 * den anderen mitändern, sonst zoomt ein Hero, der gar nicht mehr steht.
 */
/* 701 → 601 (07.08.) * Die Schwelle war gegen die GERÄTEhöhe gerechnet, Media Queries messen
 * aber das Browser-FENSTER. Auf einem iPhone 16 (852 px Gerät) bleiben nach
 * Statusleiste, Safari-Tableiste und Home-Indikator rund 700 bis 710 px
 * übrig – die alte Schwelle lag mit 701 px also genau auf dieser Kante, und
 * je nach Schriftgröße und iOS-Version fiel ein aktuelles Telefon darunter.
 * Genau das sollte nie passieren: Ausgeschlossen werden sollten die kleinen
 * Geräte, nicht die aktuellen.
 *
 * 601 px trennt sauber, mit Abstand nach beiden Seiten:
 *   iPhone SE (667 px Gerät)        → rund 553 px Fenster → ohne Effekt
 *   iPhone 13 mini (812 px Gerät)   → rund 667 px Fenster → mit Effekt
 *   iPhone 16 (852 px Gerät)        → rund 707 px Fenster → mit Effekt
 *
 * Der Grund für die Sperre bleibt bestehen (siehe unten): Auf einem sehr
 * flachen Schirm wäre die Beleg-Leiste unter einem sticky Hero dauerhaft
 * unerreichbar. Nur die Grenze lag falsch. */
/**
 * DIE BREITENBEDINGUNG IST WEG (10.08.), und das ist der eigentliche Fix.
 *
 * Hier stand ein zweiter Zweig: „oder mindestens 641 px breit". Die
 * Begründung war, ein breites Fenster habe das Problem nicht, weil dort die
 * Beleg-Leiste vierspaltig läuft und die Knöpfe nebeneinander stehen.
 *
 * Nachgemessen stimmt das nicht. Auf 1280×720 – einer völlig normalen
 * Fenstergröße – braucht der Hero 767 px. Der Zweig hat sticky dort
 * erlaubt, und die Beleg-Leiste war weg. Die Breite sagt eben nichts
 * darüber, ob etwas in die HÖHE passt; sie hat nur zufällig oft
 * mitkorreliert.
 *
 * Jetzt entscheidet allein die Höhe, und zwar dieselbe Zahl für alle
 * Breiten: Der Hero ist auf 375 px 722 px hoch und auf 1280 px 767 px, die
 * schmale Fassung ist also nicht die kritische. 781 deckt beide ab.
 *
 * Der Grund ist ein gemeldeter Fehler, nicht Vorsicht: Auf einem Telefon
 * mit wenig Höhe war die Beleg-Leiste weg. Nicht abgeschnitten – WEG. Ein
 * sticky Element klebt oben fest, während der Rest der Seite darüberzieht;
 * was darin unter die Bildschirmkante rutscht, ist dauerhaft unerreichbar,
 * auch durch Scrollen.
 *
 * Die alte Schwelle stand auf 601 px und traf damit ausgerechnet die
 * Geräte, auf denen es klemmt: Ein iPhone SE hat 667 px, also sticky – und
 * der Hero braucht mit drei Punkten und der Beleg-Leiste rund 780.
 *
 * 781 px ist deshalb kein runder Wert, sondern gemessen: die Höhe, ab der
 * der Hero auf 390 px Breite vollständig hineinpasst. Die Breitenbedingung
 * steht auf 1024 (dem `lg`-Breakpoint), weil erst dort das zweispaltige
 * Layout greift und die Knöpfe nebeneinander stehen.
 *
 * WER DEN HERO INHALTLICH ERWEITERT, muss diese Zahl neu messen. Eine
 * vierte Zeile in den Punkten verschiebt sie, und der Fehler zeigt sich
 * nicht als Layoutbruch, sondern als fehlender Inhalt.
 */
const ABGANG_ERLAUBT =
  "(prefers-reduced-motion: no-preference) and (min-height: 781px)";

/* Die Beleg-Leiste in drei Bausteinen statt in vier gleichlautenden
   Klassenketten. Der Grund ist nicht Tipparbeit, sondern dass die vier
   Werte GARANTIERT gleich groß sein müssen: Sobald einer davon abweicht,
   liest sich die Leiste als Rangfolge statt als Reihe – und dann behauptet
   sie etwas, das niemand gemeint hat.
   `clamp` gegen die Breite plus `min()` gegen die Höhe, aus demselben
   Grund wie bei der Headline: Der Hero hat feste Höhe, und auf einem
   flachen Laptop-Fenster muss auch die Leiste kleiner werden. */
const beleg =
  "flex flex-col gap-1 border-b border-ep-line py-3 pr-4 sm:gap-1.5 sm:py-4 sm:pr-5 lg:border-b-0";
const trenner = "lg:border-l lg:border-ep-line lg:pl-6";
/* Mobil kleiner: Auf 375 px stehen vier Werte im 2×2-Raster, und jede
   Zeile Höhe hier fehlt oben bei der Handlung. Ab sm wächst der Wert
   wieder auf sein volles Maß. */
const wert =
  "text-[min(clamp(1.25rem,2.2vw,2.125rem),4.4svh)] font-bold leading-none tracking-[-0.02em] sm:text-[min(clamp(1.5rem,2.2vw,2.125rem),4.4svh)]";
const label = "text-[12px] leading-snug text-ep-ink/65 sm:text-[13px]";

export function Hero({
  bewertungen = null,
}: {
  bewertungen?: GoogleBewertungen | null;
}) {
  const scope = useRef<HTMLElement>(null);

  /* Wie viele Kacheln die Beleg-Leiste tatsächlich zeigt. Steuert nur die
     mobile Rasterregel; siehe Kommentar dort. */
  const anzahlBelege = 2 + (bewertungen ? 1 : 0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Vor dem ersten Paint verstecken (useGSAP läuft als LayoutEffect),
        // damit nichts aufblitzt, bevor die Schrift steht.
        gsap.set(
          "[data-hero-eyebrow], [data-hero-sub], [data-hero-cta] > *, [data-hero-punkte] > *, [data-hero-beleg] > *",
          { autoAlpha: 0 },
        );

        // Die Skala setzt sich, noch bevor die Schrift steht.
        gsap.fromTo(
          "[data-hero-grid-in]",
          { scale: 1.06, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 2.4, ease: "expo.out", force3D: true },
        );

        // Das Foto zieht von unten auf. `clip-path` statt `scale`: Der
        // Abgang skaliert den ganzen Inhalt, zwei Skalierungen auf demselben
        // Element würden sich überschreiben. Ein Zuschnitt lässt die
        // Transform frei.
        gsap.fromTo(
          "[data-hero-foto]",
          { clipPath: "inset(28% 0% 0% 0%)", autoAlpha: 0 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            autoAlpha: 1,
            duration: 1.6,
            ease: "expo.out",
            delay: 0.25,
          },
        );

        // Alles Weitere hängt über `build` an derselben Timeline wie die
        // Zeilenmasken – ein eigenes `new SplitText` hier würde an jeder
        // zentralen Korrektur vorbeilaufen (siehe lib/motion.ts).
        return maskedHeadline({
          headline: "[data-hero-h1]",
          build: (tl) => {
            tl.fromTo(
              "[data-hero-eyebrow]",
              { y: 14, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.8 },
              0.1,
            )
              .fromTo(
                "[data-hero-sub]",
                { y: 26, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 1 },
                0.7,
              )
              .fromTo(
                "[data-hero-cta] > *",
                { y: 22, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.08 },
                0.9,
              )
              .fromTo(
                "[data-hero-punkte] > *",
                { y: 14, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.7 },
                1.15,
              )
              // Der Beleg kommt zuletzt und Wert für Wert. Er ist die
              // Antwort auf alles darüber, also darf er nicht gleichzeitig
              // mit der Behauptung erscheinen.
              .fromTo(
                "[data-hero-beleg] > *",
                { y: 20, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.1 },
                1.3,
              );
          },
        });
      });

      /* Abgang. Textur, Inhalt und Foto laufen auf derselben Strecke in
         unterschiedlichem Tempo – daraus entsteht Tiefe statt eines
         gemeinsamen Wegrutschens.

         Bezahlbar ist das mobil nur, weil `will-change` beide Ebenen einmal
         rastert und danach ausschließlich auf der GPU verschiebt – ein
         starker Zoom kostet dadurch nicht mehr als ein schwacher.

         NICHT auf kleinen Telefonen: Dort ist die Sektion `relative`
         (siehe `ABGANG_ERLAUBT`), und ein Zoom-Abgang ohne stehenden Hero
         liest sich als Fehler – das Bild zoomt heraus, während es
         gleichzeitig weggeschoben wird. Das `visibility: hidden` wäre dort
         sogar schädlich: Im normalen Fluss würde es einen unsichtbaren
         Block mitten im Dokument hinterlassen. */
      mm.add(ABGANG_ERLAUBT, () => {
        const tl = gsap.timeline({
          defaults: { ease: "none", force3D: true },
          scrollTrigger: {
            trigger: scope.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
            // Sobald der Hero verdeckt ist, aus dem Rendering nehmen: Sonst
            // mischt der Compositor eine bildschirmfüllende Fläche über die
            // ganze restliche Seite mit. `visibility` statt `display`, damit
            // die Sektion ihre Ausmaße behält und ScrollTrigger weiter
            // korrekt rechnet.
            onLeave: () => gsap.set(scope.current, { visibility: "hidden" }),
            onEnterBack: () => gsap.set(scope.current, { visibility: "visible" }),
          },
        });

        tl.to("[data-hero-grid]", { scale: 0.8, opacity: 0.2 }, 0)
          .to("[data-hero-content]", { yPercent: -18, scale: 0.9, opacity: 0.06 }, 0)
          // Das Foto zieht langsamer weg als der Text – es liegt dadurch
          // gefühlt weiter hinten im Raum.
          .to("[data-hero-foto]", { yPercent: -8, scale: 0.94, opacity: 0.1 }, 0)
          .to("[data-hero-cue]", { autoAlpha: 0, duration: 0.15 }, 0);

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });
    },
    { scope },
  );

  return (
    /* STICKY überall – außer auf kleinen Telefonen.
       Der Zoom-Abgang ist der Auftakt der Seite und gehört auf das Handy
       genauso wie auf den Desktop. Er hat aber eine harte Bedingung: Was
       hier höher wird als der Bildschirm, ist DAUERHAFT unerreichbar. Ein
       sticky Element klebt oben fest, während der Rest der Seite (z-10)
       darüberzieht – man kann nicht „weiterscrollen", um den Rest zu sehen,
       er existiert für den Nutzer nicht.

       Auf einem iPhone SE (375×667) hat das die Beleg-Leiste getroffen. Sie
       stand rund 76 px unter der Kante und war weg – ausgerechnet die
       Belege, wegen derer sie dort steht. Der Hero ist seither deutlich
       verdichtet (rund 100 px), aber auf 667 px bleibt es zu knapp, um sich
       darauf zu verlassen.

       Deshalb: unterhalb dieser Schwelle (siehe `ABGANG_ERLAUBT`) läuft der Hero im normalen
       Fluss. Der Inhalt ist vollständig erreichbar, nur der Zoom entfällt –
       auf 667 px hätte man von ihm ohnehin am wenigsten gesehen. Überall
       sonst, auch auf jedem aktuellen Telefon ab 700 px Höhe, bleibt der
       Effekt. */
    <section
      ref={scope}
      data-nav-theme="light"
      className="sticky top-0 z-0 flex min-h-svh flex-col overflow-hidden bg-ep-paper [@media(max-height:780px)]:relative"
    >
      {/* DIE SKALA – die Teilung eines Messinstruments, nicht Karopapier.
          Zwei Ebenen, weil Ankunft (innen) und Abgang (außen) beide auf
          `scale` gehen und sich sonst gegenseitig überschreiben würden.
          Bewusst übergroß, damit beim Herauszoomen keine Kante frei wird.

          `ep-skala-tinte`, seit der Hero auf Papier läuft: Die Grundfassung
          zeichnet weiße Linien, und die sind auf #FBF6EE nicht vorhanden,
          sondern unsichtbar. */}
      <div
        data-hero-grid
        aria-hidden="true"
        className="absolute -inset-[10%] will-change-[transform,opacity]"
      >
        <div
          data-hero-grid-in
          className="ep-skala ep-skala-tinte ep-skala-auslauf absolute inset-0 will-change-[transform,opacity]"
        />
      </div>

      {/* DER WARME SCHEIN Auf Navy trug die Fläche sich selbst. Papier über die volle
          Bildschirmhöhe ist dagegen einfach nur leer, und ein leerer heller
          Hero wirkt nicht ruhig, sondern unfertig.

          Ein sehr weicher Verlauf in der Akzentfarbe hinter dem Bild gibt
          der rechten Hälfte Gewicht, ohne eine Fläche einzuziehen. Bewusst
          als `radial-gradient` und nicht als getönter Kasten: Eine Kante
          wäre ein zweites Band, ein Verlauf ist Licht. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 82% 22%, rgba(242,106,33,0.20) 0%, rgba(242,106,33,0.07) 42%, transparent 68%)",
        }}
      />

      {/* DAS FOTO GERAHMT STATT RANDLOS, und das ist die eigentliche Folge des
          hellen Grundes. Vorher lief das Foto randlos in die rechte Kante
          und wurde von zwei Verläufen ins Navy aufgelöst – ein Verfahren,
          das nur auf dunklem Grund funktioniert, weil ein Foto dort in die
          Fläche hineinlaufen kann.

          Auf Papier geht das nicht: Ein Verlauf nach #FBF6EE macht aus dem
          Bild einen ausgeblichenen Fleck, und randlos ohne Verlauf schneidet
          ein dunkles Rechteck die helle Fläche hart durch. Also ein
          Bildkasten mit demselben Radius wie überall sonst – dieselbe
          Behandlung wie in der Bildstrecke und beim Porträt.

          Unter lg gibt es weiterhin kein Foto: Auf 390 px müsste es sich die
          Höhe mit Headline, drei Punkten, Knöpfen und dem Beleg teilen, und
          dann ist es ein Briefmarkenbild. Lieber keins. */}
      {/* OBEN UND UNTEN VERANKERT, NICHT ZENTRIERT.
          Der Kasten stand auf `top-1/2 -translate-y-1/2` und war damit auf
          die ganze Sektionshöhe zentriert – auch auf den Teil, den unten die
          Beleg-Leiste belegt. Auf einem 1440×900-Fenster lag „24 Std."
          dadurch auf dem Foto.

          Jetzt spannt er zwischen zwei Kanten: oben unter der Kopfleiste,
          unten oberhalb der Beleg-Leiste. Er kann die Leiste damit nicht
          mehr erreichen, unabhängig von der Fensterhöhe – eine Kollision,
          die konstruktiv ausgeschlossen ist statt wegjustiert. Das
          Seitenverhältnis ergibt sich aus dieser Höhe, deshalb kein
          `aspect-*` mehr. */}
      <div
        data-hero-foto
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[24svh] right-[var(--edge)] top-[calc(var(--nav-h)+2.5rem)] hidden w-[42%] max-w-[680px] items-center will-change-[transform,opacity] lg:flex"
      >
        {/* QUERFORMAT, UND DAS IST INHALTLICH, NICHT GESTALTERISCH.
            Der Rahmen war hochkant (`h-full` zwischen zwei Kanten). Bei
            einem 4:3-Foto hätte `object-cover` darin rund ein Drittel der
            BREITE weggeschnitten – und links steht die Wärmepumpe, rechts
            die Wallbox mit dem Auto. Übrig geblieben wäre die Hausmitte,
            also genau das, was das Bild NICHT zeigen soll.

            Deshalb gibt jetzt die Breite das Maß vor und `aspect-[4/3]`
            die Höhe. Die beiden Kanten oben und unten bleiben als GRENZE
            stehen (der Kasten zentriert sich mit `items-center` darin),
            damit er weiterhin nicht in die Beleg-Leiste laufen kann. */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-ep bg-white shadow-[0_40px_80px_-40px_rgba(20,35,46,0.35)]">
          <Image
            src="/hero-paket.webp"
            alt=""
            fill
            priority
            sizes="42vw"
            className="object-cover"
          />
        </div>
      </div>

      <div
        data-hero-content
        className="ep-container relative z-10 flex flex-1 flex-col justify-between pb-[clamp(0.5rem,1.2svh,1.25rem)] pt-[calc(var(--nav-h)+clamp(0.25rem,1svh,1rem))] text-ep-ink will-change-[transform,opacity] sm:pb-[clamp(0.75rem,1.5svh,2.5rem)] sm:pt-[calc(var(--nav-h)+clamp(0.5rem,1.8svh,3rem))]"
      >
        {/* ZONE 1 · Aussage und Handlung Vertikal zentriert in der Restfläche, links am Anschlag. Die
            Spalte endet bei 7 von 12 – rechts davon liegt das Foto, und
            zwischen beiden bleibt eine Gasse, damit die Headline nie auf
            dem Bild steht. */}
        <div className="flex flex-1 flex-col justify-center py-[clamp(0.5rem,1.5svh,1.5rem)] lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-10 lg:py-10">
          <div className="lg:col-span-7">
            {/* `ep-accent`, adaptive Rolle: löst hier zu `orange-deep`
                (5,4:1) auf – die Farbregel steht im Token-Block von
                `globals.css`. */}
            {/* HIER STAND „Ihr UNABHÄNGIGER Energie-Vermittler" (13.08.
                entfernt) – ein seit 21.07. verbindlich untersagter Claim.
                Projekt-Briefing Abschnitt 2: „Kein absolutes ,100 %
                unabhängig` […] — er profitiert von erfolgreicher
                Vermittlung." Erlaubt sind ausschließlich
                „herstellerunabhängig" (nicht an eine Marke gebunden) und
                „anbieterübergreifend".

                Es war zusätzlich ein Widerspruch im eigenen Haus: Der
                Footer legt zwei Bildschirme weiter offen, dass wir vom
                ausführenden Unternehmen vergütet werden. Genau das ist die
                Definition von nicht unabhängig – und eine Seite, die oben
                das Gegenteil ihrer eigenen Fußnote behauptet, verliert
                nicht nur den Claim, sondern die Fußnote gleich mit
                (§ 5 Abs. 1 UWG). */}
            <p data-hero-eyebrow className="t-label text-ep-accent">
              Ihr Energie-Vermittler aus Stuttgart
            </p>

            {/* Feste Umbrüche statt Zufall: Die zweite Zeile trägt den
                Akzent und den gezogenen Strich, sie darf nie mit der
                ersten verschmelzen. Der Strich sitzt NUR hier – zwei
                markierte Zeilen heben sich gegenseitig auf.

                EIGENE GRÖSSE STATT `.t-display`, und das ist hier keine
                Ausnahme aus Geschmack: Der Hero ist die einzige Sektion mit
                fester Höhe (`min-h-svh`). `.t-display` skaliert nur mit der
                BREITE (bis 8.5rem), und auf einem 1680×700-Fenster – also
                jedem normalen Laptop – schiebt eine zweizeilige Headline
                dieser Größe Satz, Knöpfe und Beleg unter die Kante.
                `min(…, 11svh)` deckelt sie zusätzlich gegen die Höhe: breit
                und flach wird sie kleiner, hoch und schmal darf sie groß
                sein. Damit passt der Hero auf jedem Fenster in einen
                Bildschirm, ohne dass irgendwo ein fester Wert steht. */}
            <h1
              data-hero-h1
              className="mt-4 font-bold leading-[1.02] tracking-[-0.03em] text-ep-ink sm:mt-[clamp(0.5rem,1.5svh,1.5rem)]"
              style={{
                fontSize: "min(clamp(2.5rem, 6.4vw, 6.5rem), 11svh)",
                fontStretch: "86%",
              }}
            >
              <span className="block">Ihre Energie.</span>
              <span className="block text-ep-accent">
                <Marker delay={1.05}>Ihr Vorteil.</Marker>
              </span>
            </h1>

            {/* Ein Satz, nicht drei. Der Vorgänger erklärte hier das ganze
                Geschäftsmodell; im Hero entscheidet niemand aufgrund eines
                Absatzes, sondern aufgrund einer Zeile. Der Rest der Seite
                hat Platz genug.

                „Die Beratung kostet Sie nichts" ist aus diesem Satz
                heraus und steht jetzt im dritten Punkt darunter. Es stand
                vorher zusätzlich im Knopf und in den Zusagen, also dreimal
                im selben Bild.

                „Makler" → „Berater" (08.09., Wunsch von Ilias). Sein
                Vorschlag war „unabhängige Berater"; „unabhängig" ist seit
                dem 21.07. verbindlich gesperrt (Briefing 2). Die Aussage
                geht trotzdem nicht verloren – sie steht als erster der drei
                Punkte darunter („Anbieterübergreifend"), und genau dort
                gehört sie laut Kundenwunsch vom 09.08. auch hin. Deshalb
                hier das schlichte „Berater" statt einer zweiten,
                längeren Qualifizierung im selben Bild. */}
            <p
              data-hero-sub
              className="mt-4 max-w-[38ch] text-[clamp(1rem,1.15vw,1.1875rem)] leading-relaxed text-ep-ink/75 sm:mt-[clamp(0.5rem,1.5svh,1.5rem)]"
            >
             Wir sind Ihr Berater für Wärmepumpen, PV-Anlagen uvm. Wir finden die beste Lösung für Ihr Zuhause und kümmern uns um den gesamten Prozess.
            </p>

            {/* DIE DREI PUNKTE Sie stehen ÜBER der Handlung, nicht darunter, und das ist der
                ganze Zweck: Zwischen einer Überschrift und einem Knopf fehlt
                sonst der Schritt, in dem jemand zustimmt. Wer die drei
                Zeilen gelesen hat, klickt aus einem Grund und nicht aus
                Neugier.

                Der Haken sitzt in einem eigenen Kreis statt frei im Text.
                Freistehende Haken in Textgröße verschwinden neben der
                Zeile; mit Fläche darunter liest sich die Reihe als Liste
                abgehakter Punkte, und genau das soll sie. */}
            <ul
              data-hero-punkte
              className="mt-[clamp(0.75rem,2svh,1.5rem)] flex flex-col gap-[clamp(0.375rem,1svh,0.75rem)] sm:mt-[clamp(0.75rem,1.8svh,2rem)] sm:gap-[clamp(0.375rem,1svh,0.875rem)]"
            >
              {PUNKTE.map((punkt) => (
                <li key={punkt} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-ep-accent/12 text-ep-accent"
                  >
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  <span className="max-w-[46ch] text-[15px] font-medium leading-snug text-ep-ink/85 sm:text-base">
                    {punkt}
                  </span>
                </li>
              ))}
            </ul>

            {/* DIE HANDLUNG steht direkt unter der Aussage, nicht am
                rechten Rand. Wer zustimmt, findet den Knopf dort, wo er
                aufgehört hat zu lesen. */}
            <div
              data-hero-cta
              className="mt-[clamp(0.875rem,2.2svh,1.75rem)] flex sm:mt-[clamp(0.75rem,1.8svh,2rem)]"
            >
              <WhatsAppButton
                size="lg"
                label="Kontakt"
                className="w-full justify-center sm:w-auto"
              />
            </div>

            {/* Mobil/Tablet: die Bewertung groß und zentriert direkt unter
                dem Knopf, NICHT unten in der Beleg-Leiste (13.08.,
                Kundenwunsch). Sie ist der letzte Vertrauens-Schub
                unmittelbar nach der Handlung – ganz unten hinter dem Foto
                sähe sie kaum noch jemand. Ab lg steht sie weiterhin unten in
                Zone 2, dort passt die Breite bereits. */}
            {bewertungen && (
              <div className="mt-6 flex flex-col items-center gap-1.5 text-center lg:hidden">
                <span className="flex items-baseline gap-2.5">
                  <span className="text-2xl font-bold leading-none text-ep-ink [font-variant-numeric:tabular-nums]">
                    {formatiereNote(bewertungen.note)}
                  </span>
                  <span className="flex items-center gap-0.5" aria-hidden="true">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={
                          i < Math.round(bewertungen.note)
                            ? "size-4 fill-ep-accent text-ep-accent"
                            : "size-4 text-ep-line"
                        }
                      />
                    ))}
                  </span>
                </span>
                <span className="flex items-center gap-1.5 text-sm text-ep-ink/65">
                  <GoogleG className="size-4 shrink-0" />
                  {bewertungen.anzahl}{" "}
                  {bewertungen.anzahl === 1 ? "Bewertung" : "Bewertungen"}
                </span>
              </div>
            )}

            {/* HIER STANDEN DIE MIKROZUSAGEN („vor Ort oder am Telefon",
                „ohne Verpflichtung"). Sie sind in den dritten Punkt über der
                Handlung gewandert. Zwei Listen im selben Bild, eine über und
                eine unter dem Knopf, waren eine zu viel – und die untere war
                die leisere, obwohl beide dasselbe sagten. */}
          </div>
        </div>

        {/* WISCH-HINWEIS · nur unter lg Ab `lg` steht der Hinweis rechts in der Beleg-Leiste (Zone 2).
            Diese Leiste ist mobil ausgeblendet, und damit fehlte der Hinweis
            ausgerechnet dort, wo gewischt statt gescrollt wird.

            `mt-auto` statt einer festen Position: Zone 1 darüber trägt
            `flex-1`, der Hinweis wird also von unten gegen die Kante
            gedrückt und kann keiner anderen Zeile in die Quere kommen. Ein
            `absolute bottom-…` läge dagegen über dem Inhalt, sobald der
            Hero auf einem flachen Gerät eng wird – genau der Fehler, der
            weiter oben schon einmal die Beleg-Leiste gekostet hat. */}
        <div className="mt-auto flex justify-center pt-2 lg:hidden">
          <ScrollCue variante="saeule" />
        </div>

        {/* ZONE 2 · DIE BELEG-LEISTE Über die volle Breite, unter allem. Das ist die eigentliche
            Änderung an diesem Hero: Der Beleg war vorher eine graue Zeile
            zwischen Fließtext und Typenschild. Jetzt trägt er die
            Komposition von unten.

            Vier Werte in gleicher Größe, durch Haarlinien getrennt – die
            Sprache des Typenschilds an einer Anlage, dieselbe wie in der
            Beleg-Leiste weiter unten auf der Seite.

            AB LG, NICHT MOBIL (13.08., Kundenwunsch). Mobil wirkte die
            volle Zeile zu dicht, und die Bewertung sitzt dort seit demselben
            Tag direkt unter dem Knopf in Zone 1 statt hier unten hinter dem
            Foto. Förderung und Rückmeldung fallen mobil ganz weg – beide
            Zahlen kommen ohnehin gleich noch einmal, in der
            Förderung-Sektion und in der ProofBar. Ab lg, wo laut Emre
            bereits alles passt, bleibt die Zeile unverändert. */}
        <div data-hero-beleg className="hidden lg:block">
          <ul
            className={cn(
              "grid border-t border-ep-line",
              anzahlBelege === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2",
            )}
          >
            {/* Die Förderung ist das stärkste Argument dieses Geschäfts und
                stand bisher erst sieben Bildschirme weiter unten. Wer im
                Hero abspringt, hat sie nie gesehen. */}
            <li className={beleg}>
              <span className={cn(wert, "text-ep-accent")}>bis 70 %</span>
              <span className={label}>Förderung, Antrag über uns</span>
            </li>

            <li className={cn(beleg, trenner)}>
              <span className={cn(wert, "text-ep-ink")}>24 Std.</span>
              <span className={label}>bis zur Rückmeldung</span>
            </li>

            {bewertungen && (
              <li className={cn(beleg, trenner)}>
                <span className="flex items-baseline gap-2.5">
                  <span className={cn(wert, "text-ep-ink [font-variant-numeric:tabular-nums]")}>
                    {formatiereNote(bewertungen.note)}
                  </span>
                  <span className="flex items-center gap-0.5" aria-hidden="true">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={
                          i < Math.round(bewertungen.note)
                            ? "size-[0.9rem] fill-ep-accent text-ep-accent"
                            : "size-[0.9rem] text-ep-line"
                        }
                      />
                    ))}
                  </span>
                </span>
                <span className={cn(label, "flex items-center gap-1.5")}>
                  <GoogleG className="size-3 shrink-0" />
                  {bewertungen.anzahl}{" "}
                  {bewertungen.anzahl === 1 ? "Bewertung" : "Bewertungen"}
                </span>
              </li>
            )}
          </ul>

          {/* KEIN Symbolbild-Hinweis hier, anders als in der Bildstrecke.
              Dort zeigt eine Reihe von Anlagenfotos unter der Überschrift
              „In Bildern" – das kann man als eigene Referenzen lesen, also
              muss der Hinweis stehen. Hier illustriert ein Produktfoto, was
              eine Wärmepumpe ist; niemand liest das als Aussage über eine
              bestimmte Anlage. Ein Vorbehalt an dieser Stelle beantwortet
              eine Frage, die keiner gestellt hat, und schwächt genau den
              Bildschirm, der überzeugen soll. */}
          {/* Der Scroll-Hinweis ist ein Desktop-Signal und mobil sogar
              kontraproduktiv: Dort reicht der Hero ohnehin über die
              Bildschirmkante hinaus, das Weiterscrollen ist also sichtbar,
              und die Zeile kostet 46 px genau dort, wo sie am teuersten
              sind. Seine Ausblend-Animation hängt ohnehin an der
              Abgangs-Timeline, die nur ab lg läuft. */}
          <div className="mt-3 hidden justify-end lg:flex">
            <ScrollCue />
          </div>
        </div>
      </div>
    </section>
  );
}
