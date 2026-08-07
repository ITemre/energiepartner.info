"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ScrollCue } from "@/components/ui/ScrollCue";
import { GoogleG } from "@/components/ui/GoogleG";
import { Marker } from "@/components/ui/Marker";
import { formatiereNote, type GoogleBewertungen } from "@/lib/google-reviews";
import { maskedHeadline } from "@/lib/motion";
import { useAnfrage } from "@/components/anfrage/AnfrageProvider";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * ══════════════════════════════════════════════════════════════════
 * HERO — Neubau (07.08.2026)
 * ══════════════════════════════════════════════════════════════════
 *
 * ═══ WAS AM VORGÄNGER NICHT STIMMTE ═══
 * Er war schön und hat nicht verkauft. Konkret:
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
 * ═══ DER NEUE AUFBAU ═══
 *
 *   ┌─────────────────────────────┬───────────────────┐
 *   │ Eyebrow                     │                   │
 *   │ HEADLINE (groß, markiert)   │   Foto, randlos   │
 *   │ Ein Satz                    │   bis Unterkante  │
 *   │ ▸ CTA-Paar                  │                   │
 *   │ Mikrozusagen                │                   │
 *   ├─────────────────────────────┴───────────────────┤
 *   │ BELEG-LEISTE über die volle Breite              │
 *   └─────────────────────────────────────────────────┘
 *
 * Eine Blickachse von oben nach unten: sehen, verstehen, handeln, geglaubt
 * bekommen. Der Beleg steht darunter über die ganze Breite und trägt den
 * Block, statt am Rand mitzulaufen.
 *
 * ═══ WARUM DAS FOTO ═══
 * Es ist ein Stockfoto einer Wärmepumpe, deshalb der Hinweis an der Kante.
 * Kein Personenfoto: Das Kickoff verlangt ausdrücklich, dass kein
 * One-Man-Show-Eindruck entsteht, Ilias' Porträt hat seinen Auftritt in der
 * Bildstrecke. Und keine KI-Bilder (feste Bild-Regel des Projekts).
 *
 * Es läuft randlos an die rechte und untere Kante. Ein Bild in einem Rahmen
 * mit Abstand ringsum ist eine Illustration; eines, das den Bildschirm
 * verlässt, ist ein Fenster.
 *
 * ═══ BEWEGUNG ═══
 * Ankunft gestaffelt (Zeilenmasken für die Headline, danach Satz, Handlung,
 * Beleg). Das Foto zieht sich per `clip-path` von unten auf — kein `scale`,
 * weil ein skaliertes Foto beim Zoom-Abgang doppelt transformiert würde.
 * Abgang unverändert: Der Hero liegt sticky auf z-0 und zoomt heraus,
 * während der Rest darüberzieht.
 */

/**
 * Die Fragen, die zwischen Lesen und Klicken stehen.
 *
 * ⚠️ HIER STAND „20 MINUTEN" AN ERSTER STELLE – entfernt (07.08.), weil die
 * Zahl nirgends herkommt. Sie steht nicht im Projekt-Briefing und nicht im
 * Markenhandbuch (`docs/markenhandbuch-quelle/ci.html` kennt weder
 * „Minuten" noch „Stunden"); sie ist im Code entstanden.
 *
 * Sie kollidierte NICHT mit den 3 Minuten von angebote-vergleichen.info –
 * das ist eine andere Domain und eine andere Sache (dort die Übermittlung
 * eines Angebots, hier die Dauer eines Beratungsgesprächs). Das Problem ist
 * ein anderes: Es ist eine Zusage über einen Termin, den Ilias führt, nicht
 * wir. Dauert das Gespräch fünfundvierzig Minuten, beginnt die Beziehung
 * mit einem gebrochenen Versprechen – und zwar in der ersten Zeile, die der
 * Besucher liest.
 *
 * Die beiden verbliebenen Zusagen stimmen ohne Rückfrage: Der Kanal steht
 * im Kickoff, die Unverbindlichkeit ist die Grundlage des Angebots.
 *
 * SOBALD ILIAS EINE ECHTE DAUER NENNT, gehört sie wieder an die erste
 * Stelle – dort beantwortet sie die Frage, die vor den beiden anderen
 * kommt. Es fehlt nur die Zahl, nicht der Platz.
 */
const ZUSAGEN = ["vor Ort oder am Telefon", "ohne Verpflichtung"] as const;

/**
 * Wann der sticky Hero samt Zoom-Abgang läuft.
 *
 * ═══ DIE SCHWELLE HÄNGT AN DER HÖHE, NICHT AN DER BREITE ═══
 * Ein iPhone SE hat 667 px, ein iPhone 14 hat 852 px – gleich schmal, aber
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
 * ═══ WARUM DIE QUERY SO UMSTÄNDLICH AUSSIEHT ═══
 * Ausgeschlossen werden soll „flach UND schmal". Die Negation davon ist
 * „hoch ODER breit", und dieses ODER ist in Media Queries das Komma – die
 * einzige Schreibweise, die überall funktioniert. `not (… and …)` gehört zu
 * Media Queries Level 4; wo das nicht ausgewertet wird, wäre die Bedingung
 * immer falsch und der Auftakt der Seite verschwunden.
 *
 * `prefers-reduced-motion` steht in BEIDEN Zweigen, weil ein Komma
 * vollständige Bedingungen trennt und nichts klammert.
 *
 * ⚠️ Die Sektion trägt dieselbe Schwelle noch einmal als
 * `[@media(max-height:700px)_and_(max-width:640px)]:relative`. Tailwind
 * kann keine Konstante aus TypeScript lesen – wer einen Wert ändert, muss
 * den anderen mitändern, sonst zoomt ein Hero, der gar nicht mehr steht.
 */
const ABGANG_ERLAUBT =
  "(prefers-reduced-motion: no-preference) and (min-height: 701px)," +
  "(prefers-reduced-motion: no-preference) and (min-width: 641px)";

/* Die Beleg-Leiste in drei Bausteinen statt in vier gleichlautenden
   Klassenketten. Der Grund ist nicht Tipparbeit, sondern dass die vier
   Werte GARANTIERT gleich groß sein müssen: Sobald einer davon abweicht,
   liest sich die Leiste als Rangfolge statt als Reihe – und dann behauptet
   sie etwas, das niemand gemeint hat.
   `clamp` gegen die Breite plus `min()` gegen die Höhe, aus demselben
   Grund wie bei der Headline: Der Hero hat feste Höhe, und auf einem
   flachen Laptop-Fenster muss auch die Leiste kleiner werden. */
const beleg =
  "flex flex-col gap-1 border-b border-ep-line-dark py-3 pr-4 sm:gap-1.5 sm:py-4 sm:pr-5 lg:border-b-0";
const trenner = "lg:border-l lg:border-ep-line-dark lg:pl-6";
/* Mobil kleiner: Auf 375 px stehen vier Werte im 2×2-Raster, und jede
   Zeile Höhe hier fehlt oben bei der Handlung. Ab sm wächst der Wert
   wieder auf sein volles Maß. */
const wert =
  "text-[min(clamp(1.25rem,2.2vw,2.125rem),4.4svh)] font-bold leading-none tracking-[-0.02em] sm:text-[min(clamp(1.5rem,2.2vw,2.125rem),4.4svh)]";
const label = "text-[12px] leading-snug text-white/65 sm:text-[13px]";

export function Hero({
  bewertungen = null,
}: {
  bewertungen?: GoogleBewertungen | null;
}) {
  const scope = useRef<HTMLElement>(null);
  const { oeffne } = useAnfrage();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Vor dem ersten Paint verstecken (useGSAP läuft als LayoutEffect),
        // damit nichts aufblitzt, bevor die Schrift steht.
        gsap.set(
          "[data-hero-eyebrow], [data-hero-sub], [data-hero-cta] > *, [data-hero-zusagen], [data-hero-beleg] > *",
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
                "[data-hero-zusagen]",
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

         ⚠️ NICHT auf kleinen Telefonen: Dort ist die Sektion `relative`
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
      data-nav-theme="dark"
      className="sticky top-0 z-0 flex min-h-svh flex-col overflow-hidden bg-ep-navy-deep [@media(max-height:700px)_and_(max-width:640px)]:relative"
    >
      {/* DIE SKALA – die Teilung eines Messinstruments, nicht Karopapier.
          Zwei Ebenen, weil Ankunft (innen) und Abgang (außen) beide auf
          `scale` gehen und sich sonst gegenseitig überschreiben würden.
          Bewusst übergroß, damit beim Herauszoomen keine Kante frei wird. */}
      <div
        data-hero-grid
        aria-hidden="true"
        className="absolute -inset-[10%] will-change-[transform,opacity]"
      >
        <div
          data-hero-grid-in
          className="ep-skala ep-skala-auslauf absolute inset-0 will-change-[transform,opacity]"
        />
      </div>

      {/* ══════════════ DAS FOTO ══════════════
          Randlos an die rechte und untere Kante, ab lg. Es liegt UNTER dem
          Inhalt (z-0 gegen z-10) und hört auf halber Breite auf – der
          Verlauf nach links löst es ins Navy auf, damit die Headline nie
          gegen Bildrauschen gelesen werden muss.

          Unter lg gibt es kein Foto: Auf 390 px müsste es sich die Höhe mit
          Headline, Satz, zwei Knöpfen und dem Beleg teilen, und dann ist es
          ein Briefmarkenbild. Lieber keins. */}
      <div
        data-hero-foto
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[52%] will-change-[transform,opacity] lg:block"
      >
        <Image
          src="/galerie/g3-waermepumpe-v2.webp"
          alt=""
          fill
          priority
          sizes="52vw"
          className="object-cover object-left"
        />
        {/* Zwei Verläufe, nicht einer: Der waagerechte löst die linke Kante
            ins Navy auf (sonst schnitte das Foto die Fläche hart durch),
            der senkrechte nimmt der Unterkante die Härte, wo die
            Beleg-Leiste ansetzt. Beide über `background`, nicht als Filter –
            ein animierter `blur` würde pro Frame einen vollen Gauß-Durchgang
            kosten. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, #0A2337 0%, rgba(10,35,55,0.92) 22%, rgba(10,35,55,0.35) 58%, rgba(10,35,55,0.15) 100%)",
          }}
        />
        {/* Der senkrechte Verlauf ist NICHT Kosmetik, sondern Lesbarkeit:
            Die Beleg-Leiste läuft über die volle Breite und damit über das
            Foto. Ohne diesen Fuß stünden „24 Std." und „300+" auf Laub und
            Ziegelmauer – und Weiß auf einem unruhigen Foto ist an keiner
            Stelle mehr sicher lesbar. Er setzt deshalb früh an und geht bis
            ganz auf Navy durch. */}
        <div
          className="absolute inset-x-0 bottom-0 h-[52%]"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,35,55,0) 0%, rgba(10,35,55,0.55) 34%, rgba(10,35,55,0.94) 66%, #0A2337 88%)",
          }}
        />
      </div>

      <div
        data-hero-content
        className="ep-container relative z-10 flex flex-1 flex-col justify-between pb-5 pt-[calc(var(--nav-h)+1rem)] text-white will-change-[transform,opacity] sm:pb-10 sm:pt-[calc(var(--nav-h)+3rem)]"
      >
        {/* ══════════════ ZONE 1 · Aussage und Handlung ══════════════
            Vertikal zentriert in der Restfläche, links am Anschlag. Die
            Spalte endet bei 7 von 12 – rechts davon liegt das Foto, und
            zwischen beiden bleibt eine Gasse, damit die Headline nie auf
            dem Bild steht. */}
        <div className="flex flex-1 flex-col justify-center py-6 lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-10 lg:py-10">
          <div className="lg:col-span-7">
            <p data-hero-eyebrow className="t-label text-ep-sun">
              Stuttgart · herstellerunabhängig
            </p>

            {/* Feste Umbrüche statt Zufall: Die zweite Zeile trägt den
                Akzent und den gezogenen Strich, sie darf nie mit der
                ersten verschmelzen. Der Strich sitzt NUR hier – zwei
                markierte Zeilen heben sich gegenseitig auf.

                ⚠️ EIGENE GRÖSSE STATT `.t-display`, und das ist hier keine
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
              className="mt-4 font-bold leading-[1.02] tracking-[-0.03em] text-white sm:mt-6"
              style={{
                fontSize: "min(clamp(2.5rem, 6.4vw, 6.5rem), 11svh)",
                fontStretch: "86%",
              }}
            >
              <span className="block">Ihre Energie.</span>
              <span className="block text-ep-sun">
                <Marker delay={1.05}>Ihr Vorteil.</Marker>
              </span>
            </h1>

            {/* Ein Satz, nicht drei. Der Vorgänger erklärte hier das ganze
                Geschäftsmodell; im Hero entscheidet niemand aufgrund eines
                Absatzes, sondern aufgrund einer Zeile. Der Rest der Seite
                hat Platz genug. */}
            {/* Der zweite Satz steht mobil nicht: „Die Beratung kostet Sie
                nichts" sagt dort bereits der grüne Knopf darunter
                („Kostenlos beraten lassen") und die Zusagen sagen es ein
                drittes Mal. Auf 375 px kostet die Wiederholung eine ganze
                Zeile – und die entscheidet, ob die Beleg-Leiste noch ins
                Bild passt. Ab sm ist Platz, dort rundet der Satz die
                Einordnung ab. */}
            <p
              data-hero-sub
              className="mt-4 max-w-[38ch] text-[clamp(1rem,1.15vw,1.1875rem)] leading-relaxed text-white/80 sm:mt-6"
            >
              Wärmepumpe, Photovoltaik und Stromtarif als ein abgestimmtes
              System geplant.
              <span className="hidden sm:inline">
                {" "}
                Die Beratung kostet Sie nichts.
              </span>
            </p>

            {/* DIE HANDLUNG steht direkt unter der Aussage, nicht am
                rechten Rand. Wer zustimmt, findet den Knopf dort, wo er
                aufgehört hat zu lesen. */}
            <div
              data-hero-cta
              className="mt-7 flex flex-col items-start gap-3.5 sm:mt-8 sm:flex-row sm:items-center"
            >
              <WhatsAppButton
                size="lg"
                label="Kostenlos beraten lassen"
                className="w-full justify-center sm:w-auto"
              />
              {/* Der zweite Weg. WhatsApp erreicht nur, wer WhatsApp nutzt
                  UND bereit ist, sofort seine Nummer herauszugeben. Für
                  alle anderen gab es vorher nur `tel:` – also die höchste
                  Hürde überhaupt. Dieser Knopf öffnet das Formular.

                  ⚠️ MOBIL EIN LINK, ab sm ein Knopf. Zwei gestapelte Knöpfe
                  kosten auf 375 px rund 126 px Höhe – der Unterschied
                  zwischen „Beleg-Leiste sichtbar" und „Beleg-Leiste
                  unerreichbar" (der Hero ist sticky, siehe unten).
                  Es ist außerdem die ehrlichere Hierarchie: WhatsApp ist
                  laut Kickoff der Hauptkanal, zwei gleich große Knöpfe
                  behaupten das Gegenteil. Die Trefferfläche bleibt über
                  `py-3` bei 44 px. */}
              <button
                type="button"
                onClick={() => oeffne("Hero · Sekundär-CTA")}
                className="inline-flex items-center justify-center gap-2 rounded-ep py-3 text-base font-semibold text-white underline underline-offset-4 outline-none transition-colors hover:text-white/80 focus-visible:ring-2 focus-visible:ring-ep-sun sm:w-auto sm:border sm:border-white/30 sm:px-6 sm:py-4 sm:no-underline sm:hover:border-white/60 sm:hover:bg-white/10 sm:hover:text-white"
              >
                Anfrage senden
              </button>
            </div>

            {/* Die Mikrozusagen. „Kostenlos" beantwortet nur eine der drei
                Fragen, die vom Klicken abhalten – die anderen sind: wie
                lange dauert das, und wie komme ich wieder raus. Die
                Dauer-Antwort fehlt derzeit, weil es dafür keine belegte
                Zahl gibt (siehe `ZUSAGEN`).

                MOBIL UNTEREINANDER. In einer Zeile brachen sie auf
                375 px an beliebiger Stelle um, und die senkrechten Trenner
                landeten dann am Zeilenanfang – eine Reihe, die nicht als
                Reihe lesbar ist, ist keine. Untereinander mit Punkt davor
                liest sich jede Zusage einzeln, und genau darum geht es:
                drei Antworten, nicht ein Satzband.

                Der Punkt ist der Leucht-Punkt der Wortmarke, kein Häkchen –
                ein Häkchen behauptet Erledigtes, hier stehen Zusagen. */}
            <ul
              data-hero-zusagen
              className="mt-4 flex flex-col gap-2 text-[13px] text-white/65 sm:mt-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-2 sm:text-sm"
            >
              {ZUSAGEN.map((zusage, i) => (
                <li key={zusage} className="flex items-center gap-2.5 sm:gap-4">
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
                  {zusage}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ══════════════ ZONE 2 · DIE BELEG-LEISTE ══════════════
            Über die volle Breite, unter allem. Das ist die eigentliche
            Änderung an diesem Hero: Der Beleg war vorher eine graue Zeile
            zwischen Fließtext und Typenschild. Jetzt trägt er die
            Komposition von unten.

            Vier Werte in gleicher Größe, durch Haarlinien getrennt – die
            Sprache des Typenschilds an einer Anlage, dieselbe wie in der
            Beleg-Leiste weiter unten auf der Seite. */}
        <div data-hero-beleg>
          <ul className="grid grid-cols-2 border-t border-ep-line-dark lg:grid-cols-4">
            {/* Die Bewertung zuerst: Sie ist die einzige Aussage hier, die
                nicht von uns stammt. Ohne echte Daten fällt sie weg und
                die Leiste läuft auf drei Werten – kein Loch, weil das
                Raster mitzählt. */}
            {bewertungen && (
              <li className={beleg}>
                <span className="flex items-baseline gap-2.5">
                  <span className={cn(wert, "text-white [font-variant-numeric:tabular-nums]")}>
                    {formatiereNote(bewertungen.note)}
                  </span>
                  <span className="flex items-center gap-0.5" aria-hidden="true">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={
                          i < Math.round(bewertungen.note)
                            ? "size-[0.9rem] fill-ep-sun text-ep-sun"
                            : "size-[0.9rem] text-white/25"
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

            {/* Die Förderung ist das stärkste Argument dieses Geschäfts und
                stand bisher erst sieben Bildschirme weiter unten. Wer im
                Hero abspringt, hat sie nie gesehen. */}
            <li className={cn(beleg, trenner)}>
              <span className={cn(wert, "text-ep-sun")}>bis 70 %</span>
              <span className={label}>Förderung, Antrag über uns</span>
            </li>

            <li className={cn(beleg, trenner)}>
              <span className={cn(wert, "text-white")}>300+</span>
              <span className={label}>geprüfte Angebote</span>
            </li>

            <li className={cn(beleg, trenner)}>
              <span className={cn(wert, "text-white")}>24 Std.</span>
              <span className={label}>bis zur Rückmeldung</span>
            </li>
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
