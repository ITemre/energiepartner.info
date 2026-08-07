"use client";

import { useRef } from "react";
import Image from "next/image";
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
 * Die Bildstrecke – der einzige Moment echter Fotografie auf einer sonst
 * typografischen Seite.
 *
 * DESKTOP: Die Bilder liegen zunächst verteilt auf der Fläche, klein. Beim
 * Scrollen sortieren sie sich in eine Reihe, wachsen auf ihre Größe, und die
 * Reihe fährt seitwärts durch. Am Ende steht das Portrait als halbes
 * Bildschirmpanel über die volle Höhe, rechts daneben der Schlusssatz.
 * Aus Verteilung wird Ordnung wird Weg wird Ankunft – dieselbe Dramaturgie
 * wie in der Gesamtsystem-Szene, nur mit Fotos statt Bausteinen.
 *
 * ENTFERNT (07.08.): der Zwischenakt „die Reise". Das Porträt wanderte
 * vorher erst senkrecht in die Bildmitte, während rechts drei Fragen an ihm
 * vorbeiliefen, und wuchs erst danach. Das waren zwei zusätzliche
 * Bildschirme, in denen sich nur eine Position änderte – der Moment, auf den
 * die Sektion zuläuft, kam damit nach einer Wartestrecke statt nach dem
 * Höhepunkt der Fahrt. Jetzt wächst es unmittelbar an seinem Platz. Auf
 * Mobil gibt es die drei Fragen weiter: Dort sind sie keine Wartestrecke,
 * sondern die einzige Komposition, die auf 390 px trägt.
 *
 * MOBIL: schlicht untereinander. Eine horizontale Strecke, die an vertikalem
 * Scrollen hängt, ist auf dem Handy nicht elegant, sondern verwirrend – man
 * wischt nach oben und etwas bewegt sich zur Seite. Deshalb greift die
 * gesamte Choreografie erst ab lg.
 *
 * ⚠️ DIE ANLAGENFOTOS SIND KI-GENERIERT (07.08.2026, Freigabe Emre) und
 * zeigen keine Anlagen von Ilias. Der Hinweis unter der Überschrift muss
 * deshalb stehen bleiben – sonst wäre es eine Irreführung über eigene
 * Leistungen (UWG). An der Rechtslage ändert die Quelle nichts: Ein
 * Stockfoto einer fremden Anlage und ein erzeugtes Bild sind beide keine
 * Referenz.
 *
 * Die frühere Regel „keine KI-Bilder" gilt weiterhin für MENSCHEN – deshalb
 * ist `g5-handwerk` noch Stockmaterial und `g6-ilias-frei` das echte
 * Porträt. Gesichter sind der eine Fall, in dem Erzeugtes wirklich schadet.
 *
 * Sobald Bilder echter Anlagen von Ilias vorliegen, ersetzen sie das
 * Material und der Hinweis kann weg.
 */
const BILDER = [
  { src: "/galerie/g1-photovoltaik-v2.webp", titel: "Photovoltaik", zeile: "Der Strom entsteht auf dem Dach.", alt: "Photovoltaikmodule auf einem roten Ziegeldach" },
  { src: "/galerie/g2-speicher-v2.webp", titel: "Stromspeicher", zeile: "Was tagsüber übrig bleibt, wird abends gebraucht.", alt: "Wechselrichter und Batteriespeicher an einer Wand" },
  { src: "/galerie/g3-waermepumpe-v2.webp", titel: "Wärmepumpe", zeile: "Aus einer Kilowattstunde Strom werden mehrere Wärme.", alt: "Wärmepumpen-Außengerät neben einem Wohnhaus" },
  { src: "/galerie/g4-technikraum-v2.webp", titel: "Technikraum", zeile: "Speicher, Hydraulik, Regelung: abgestimmt aufeinander.", alt: "Technikraum mit Pufferspeichern und Innengerät" },
  { src: "/galerie/g5-handwerk.webp", titel: "Ausführung", zeile: "Gebaut von geprüften Fachbetrieben.", alt: "Monteur montiert eine Heizungsleitung" },
  // Das echte Foto zum Schluss. `finale` macht daraus ab lg ein halbes
  // Bildschirmpanel über die volle Höhe – und zwar von Anfang an, nicht als
  // Umbau mitten in der Bewegung. Es wächst in Akt 1 wie alle anderen aus
  // der Verteilung, nur eben auf seine echte Größe. Ein Element während
  // eines Scrubs umzubauen wäre beim Zurückscrollen kaum sauber
  // rückgängig zu machen.
  { src: "/galerie/g6-ilias-frei.webp", titel: "Ilias Zayakh", zeile: "Ihr Ansprechpartner in Stuttgart.", alt: "Ilias Zayakh, energiepartner", finale: true },
] as const;

/** Startlage je Bild – als Abstand von der MITTE DER BÜHNE, in Anteilen
 *  ihrer Breite bzw. Höhe. Also 0 = Mitte, -0.25 = ein Stück nach links.
 *
 *  Bezug ist bewusst die Bühne und nicht die Sektion: Die Sektion enthält
 *  auch die Überschrift, und ein Bild oben links landete dadurch genau
 *  darauf. Die Bühne beginnt unterhalb – damit ist die Überdeckung
 *  konstruktiv ausgeschlossen und nicht nur wegjustiert.
 *
 *  KEINE DREHUNG. Schräg liegende Fotos lesen sich als Fotoalbum oder
 *  Pinnwand, nicht als Gestaltung. Die Spannung kommt allein aus Größe und
 *  Position: sechs achsenparallele Rechtecke in gestaffelten Größen.
 *
 *  Es muss für JEDES Bild eine Lage geben – der Zugriff läuft über Modulo,
 *  bei zu wenigen Einträgen starten zwei Bilder exakt übereinander. */
/** Drei Fragen, die sich in seinem Namen auflösen: Der Schlusssatz „Hinter
 *  jeder Planung steht ein Name." beantwortet sie alle drei auf einmal. Ohne
 *  diesen Aufbau wäre er nur eine Behauptung.
 *
 *  NUR NOCH MOBIL. Am Desktop liefen sie als Spalte am wandernden Porträt
 *  vorbei; dieser Zwischenakt ist entfallen. Auf dem Handy tragen sie
 *  weiterhin die ganze Sektion, weil dort jede Frage allein auf dem Schirm
 *  steht und der Blick zwischen links und rechts springt – das ist der
 *  einzige Rhythmus, den 390 px hergeben.
 *
 *  Inhaltlich gedeckt: Ilias schaut sich das Haus an, rechnet nach und
 *  koordiniert die Fachbetriebe – gebaut wird von Partnerbetrieben, danach
 *  fragt hier bewusst niemand. */
const REISE = [
  "Wer schaut sich Ihr Haus an?",
  "Wer rechnet nach, ob es sich lohnt?",
  "Wer koordiniert die Fachbetriebe?",
] as const;

/** Das Schlussbild – am Desktop letztes Glied der Reihe, mobil eigener
 *  Auftritt. Steht hier oben, damit beide Stellen dieselbe Quelle nutzen. */
const FINALE = BILDER[BILDER.length - 1];

/**
 * Die Startlage jedes Bildes – Abstand von der MITTE DER BÜHNE, in Anteilen
 * ihrer Breite und Höhe. 0 = Mitte, −0.25 = ein Stück nach links.
 *
 * ═══ WAS AN DER ERSTEN FASSUNG NICHT STIMMTE ═══
 * Die Werte lagen alle zwischen ±0.37 und die Größen zwischen 0.16 und
 * 0.33. Das ergab keine Streuung, sondern einen Haufen: sechs ähnlich
 * kleine Rechtecke, eng um die Mitte, eines davon (x −0.06 / y 0.02) sogar
 * fast genau IN der Mitte und mit 0.16 so klein, dass es unter den anderen
 * verschwand. Es sah nach Unordnung aus, nicht nach Raum.
 *
 * ═══ WAS ES JETZT MACHT ═══
 * `t` ist die Tiefe: 0 = ganz vorn, 1 = ganz hinten. Aus ihr folgen Größe
 * UND Deckkraft, und genau diese Kopplung erzeugt den Eindruck von Raum
 * statt von verstreuten Kärtchen – was weiter weg ist, ist kleiner und
 * blasser, wie durch Dunst gesehen.
 *
 * Die Anordnung ist bewusst weiter (bis ±0.62) und meidet die Mitte: Dort
 * kommt die Reihe später zusammen, und ein Bild, das schon dort liegt,
 * nimmt der Ankunft ihr Ziel.
 *
 * Reihenfolge der Tiefen: vorn, hinten, mittig, hinten, vorn, mittig –
 * gemischt, damit beim Einsortieren nicht sichtbar eine Staffel abgearbeitet
 * wird, sondern der Raum sich von überall her schließt.
 */
const STREUUNG = [
  { x: -0.58, y: -0.3, t: 0.15 },
  { x: 0.44, y: -0.42, t: 0.85 },
  { x: -0.32, y: 0.38, t: 0.45 },
  { x: 0.62, y: 0.26, t: 0.7 },
  { x: -0.5, y: 0.06, t: 0.0 },
  { x: 0.24, y: -0.14, t: 0.55 },
];

/** Größe und Deckkraft aus der Tiefe. Vorn 0.46 (noch klar als Bild
 *  erkennbar), hinten 0.13 (nur noch eine Andeutung). Die Deckkraft fällt
 *  flacher ab als die Größe – sonst verschwinden die hinteren Bilder
 *  vollständig und der Raum wirkt leer statt tief. */
const groesse = (t: number) => 0.46 - t * 0.33;
const deckkraft = (t: number) => 0.85 - t * 0.45;

export function Galerie() {
  const scope = useRef<HTMLElement>(null);
  const buehne = useRef<HTMLDivElement>(null);
  const spur = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () =>
        maskedHeadline({
          headline: "[data-gal-h2]",
          follow: "[data-gal-eyebrow]",
          scrollTrigger: { trigger: scope.current, start: "top 75%", once: true },
        }),
      );

      /* ---------- Mobil: Stapel + Schleier, der ihn am Ende freigibt ------ */
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        revealItems("[data-gal-item]", { distance: 12, start: "top 88%" });
        revealItems("[data-gal-antwort]", { distance: 16, start: "top 85%" });

        // Die Fragen fliegen von der Seite herein, auf der sie stehen –
        // links stehende von links, rechts stehende von rechts. Sie kommen
        // dadurch aus dem Bildschirmrand statt aus dem Nichts.
        //
        // `x` und nicht `xPercent`: Der Weg soll bei jeder Frage gleich weit
        // sein, unabhängig davon wie breit ihr Text zufällig ist.
        gsap.utils.toArray<HTMLElement>("[data-gal-frage]").forEach((el, i) => {
          gsap.fromTo(
            el,
            { x: i % 2 === 1 ? 90 : -90, autoAlpha: 0 },
            {
              x: 0,
              autoAlpha: 1,
              duration: 1.1,
              ease: "expo.out",
              scrollTrigger: { trigger: el, start: "top 78%", once: true },
            },
          );
        });
      });

      /* ---------- Ab lg: Verteilung → Reihe → Fahrt → Ankunft ---------- */
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-gal-item]");
        if (items.length < 2 || !spur.current || !buehne.current) return;

        // Alles ohne Transformationen gemessen – zum Zeitpunkt der Fahrt ist
        // die Spur längst verschoben, ein Messen dort läge daneben.
        //
        // `fahrt`      Weg der Reihe: so weit, dass das letzte Bild genau
        //              dort steht, wo das erste angefangen hat. Dadurch endet
        //              die Fahrt an einer Kante, die es schon gibt.
        // `panelNat*`  Lage und Maße des Schlussrahmens, bezogen auf die
        //              Sektion – die füllt im Pin den Bildschirm, ihre
        //              Koordinaten sind also Bildschirmkoordinaten.
        let fahrt = 0;
        let panelNatLeft = 0;
        let panelNatTop = 0;

        /* Höhe der Kopfleiste, aus dem Token gelesen statt hart notiert –
           `--nav-h` wechselt am sm-Breakpoint, und die Funktion wird bei
           jedem Refresh neu ausgewertet. */
        const navH = () =>
          parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue("--nav-h"),
          ) || 76;

        // Erst zurücksetzen, dann messen: `getBoundingClientRect` liefert die
        // Lage INKLUSIVE bereits gesetzter Transformationen. Ohne das
        // Zurücksetzen würde jeder Refresh auf dem vorigen Versatz aufsetzen
        // und die Bilder bei jeder Größenänderung weiter wegwandern.
        const panel = scope.current!.querySelector<HTMLElement>("[data-gal-panel]");

        const setzeVerteilung = () => {
          // `zIndex` gehört mit in den Reset: Er wird pro Bild aus der Tiefe
          // gesetzt, und ohne Rücksetzen bliebe beim nächsten Refresh die
          // Stapelung des vorigen Durchlaufs stehen.
          gsap.set(items, { x: 0, y: 0, scale: 1, opacity: 1, zIndex: 0 });
          gsap.set(spur.current, { x: 0 });
          if (panel) gsap.set(panel, { clearProps: "width,height,x,y,borderRadius" });

          const b = buehne.current!.getBoundingClientRect();
          const sek = scope.current!.getBoundingClientRect();
          const mitteX = b.width / 2;
          const mitteY = b.height / 2;

          const ersteLinks = items[0].getBoundingClientRect().left - b.left;

          // MUSS vor dem Setzen der Streuung passieren. Der Rahmen liegt
          // absolut im Kärtchen und erbt dessen Transformation – nach der
          // Streuung läge hier der Streuungsversatz mit drin (bis zu einige
          // hundert Pixel), und das Ziel der Verwandlung wäre entsprechend
          // weit daneben.
          if (panel) {
            const p = panel.getBoundingClientRect();
            panelNatLeft = p.left - sek.left;
            panelNatTop = p.top - sek.top;
          }

          items.forEach((el, i) => {
            const s = STREUUNG[i % STREUUNG.length];
            const r = el.getBoundingClientRect();

            // Lage der Bildmitte innerhalb der Bühne
            const istX = r.left - b.left + r.width / 2;
            const istY = r.top - b.top + r.height / 2;

            if (i === items.length - 1) fahrt = r.left - b.left - ersteLinks;

            gsap.set(el, {
              x: mitteX + s.x * b.width - istX,
              y: mitteY + s.y * b.height - istY,
              scale: groesse(s.t),
              opacity: deckkraft(s.t),
              // Was vorn liegt, gehört auch nach vorn. Ohne das schiebt
              // sich ein weit entferntes Bild über ein nahes, und die
              // Tiefenstaffelung, die Größe und Deckkraft aufbauen, ist
              // in dem Moment wieder dahin.
              zIndex: Math.round((1 - s.t) * 10),
              force3D: true,
            });
          });
        };
        setzeVerteilung();

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: scope.current,
            start: "top top",
            // Einsortieren + Fahrt + Verwandlung.
            //
            // 0.7 → 1.5 Bildschirmhöhen für das Einsortieren. Das war der
            // Kern des Problems: Der schönste Moment der Sektion – sechs
            // Bilder finden aus dem Raum in eine Reihe – lief auf einer
            // Strecke ab, die man mit zwei Radumdrehungen durchscrollt.
            // Choreografie braucht Zeit, sonst ist sie nur ein Übergang.
            //
            // Die Fahrt bleibt an ihrer gemessenen Strecke (`fahrt`), der
            // Schluss bei 0.9 – nur der Anfang bekommt Luft.
            end: () =>
              "+=" + (window.innerHeight * 1.5 + fahrt + window.innerHeight * 0.9),
            pin: scope.current,
            scrub: 0.7,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            // Zweite gepinnte Sektion im Dokument, also NIEDRIGER als der
            // Gesamtsystem-Pin (siehe dort). Die Werte stammten noch aus der
            // alten Seitenreihenfolge, in der die Galerie vor dem
            // Gesamtsystem stand.
            refreshPriority: 1,
            onRefreshInit: setzeVerteilung,
            onLeave: () => window.dispatchEvent(new CustomEvent("ep:nav-theme", { detail: null })),
            onLeaveBack: () => window.dispatchEvent(new CustomEvent("ep:nav-theme", { detail: null })),
          },
        });

        /* Nur die Anlagenbilder ziehen am Ende ab – das Porträt bleibt und
           wächst. Eine eigene Referenz auf das letzte Element braucht es
           nicht mehr, seit es nicht mehr senkrecht bewegt wird. */
        const vorherige = items.slice(0, -1);

        /* AKT 1 – aus dem Raum in die Reihe.
           Der Akt hatte vorher `duration: 1, stagger: 0.06`: Bei sechs
           Bildern überlappten sich damit alle Wege fast vollständig, und
           das Ganze war nach 1,3 Einheiten vorbei. Es sah aus, als würde
           ein Bild einrasten – sechsmal gleichzeitig.

           Jetzt kommt jedes Bild einzeln an (`stagger` 0.22 gegen
           `duration` 1.4, also rund ein Drittel Überlappung) und braucht
           dafür spürbar länger. `expo.out` statt `power2.inOut`: schnell
           gelöst, lang auslaufend – die Bewegung kommt zum Stehen, statt
           anzuhalten. Genau dieses Auslaufen ist der Unterschied zwischen
           „es bewegt sich" und „es fügt sich zusammen".

           Deckkraft und zIndex laufen mit: Am Ende von Akt 1 stehen alle
           sechs gleich hell und auf derselben Ebene – aus Raum ist Reihe
           geworden. */
        tl.to(items, {
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          zIndex: 0,
          duration: 1.4,
          ease: "expo.out",
          stagger: { each: 0.22, from: "end" },
        })
          // AKT 2 – die Reihe fährt, bis das Panel links bündig steht
          .to(
            spur.current,
            {
              x: () => -fahrt,
              ease: "none",
              // 0.85 → 0.5 je Bild: Die Fahrt war der zäheste Teil der
              // Sektion, weil ihre Dauer linear mit der Bildanzahl wuchs.
              duration: Math.max(1.2, items.length * 0.5),
            },
            ">-0.1",
          )
          // AKT 3 – abräumen. Kopf und Anlagenbilder ziehen nach oben aus dem
          // Bild, das Porträt bleibt stehen, wo die Fahrt es abgesetzt hat.
          //
          // Es wandert NICHT mehr in die Bildmitte. Diese Wanderung war ein
          // eigener Akt über zwei Bildschirme, in dem sich nichts änderte
          // außer einer Position – der Höhepunkt der Sektion kam dadurch
          // nach einer Wartestrecke. Das Wachsen setzt jetzt unmittelbar an.
          .to("[data-gal-kopf]", { yPercent: -160, autoAlpha: 0, duration: 0.9 }, ">")
          .to(
            vorherige,
            { y: -window.innerHeight * 0.75, autoAlpha: 0, duration: 0.9, ease: "power1.in" },
            "<",
          )

          // AKT 4 – die Verwandlung. Das Kärtchen wächst zum halben
          // Bildschirm über die volle Höhe und rückt bündig nach links.
          //
          // Ziel sind Bildschirmkoordinaten: Die Sektion ist gepinnt, füllt
          // also genau den Schirm. Der Rahmen sitzt im Kärtchen, seine Lage
          // ist daher die natürliche plus die Verschiebung davor – `fahrt`
          // nach links.
          //
          // ⚠️ DIE KOPFLEISTE MUSS ABGEZOGEN WERDEN. Sie liegt fest über der
          // Seite; ein Panel über die volle `innerHeight` schiebt sich
          // darunter, und dann steht die Wortmarke auf dem Gesicht. Das Foto
          // beginnt deshalb an der Unterkante der Leiste und ist um deren
          // Höhe kürzer. Der Papierstreifen, der dadurch oben stehen bleibt,
          // ist kein Rest – er ist der Grund, auf dem die Leiste sitzt.
          //
          // `width`/`height` statt `scale`: Ein Kärtchen im Verhältnis 4:3
          // soll zu einem hohen Panel werden. Uniformes Skalieren kann das
          // nicht, es würde das Bild verzerren.
          .to(
            panel,
            {
              width: () => window.innerWidth / 2,
              height: () => window.innerHeight - navH(),
              x: () => -(panelNatLeft - fahrt),
              y: () => navH() - panelNatTop,
              borderRadius: 0,
              duration: 1.2,
              ease: "power2.inOut",
            },
            ">-0.2",
          )
          // Die ganze Fläche kippt nach Navy. Etwas VOR der Verwandlung
          // gestartet, damit der Raum schon dunkel ist, wenn sein Rahmen
          // aufzieht – sonst sähe man erst ein navyfarbenes Rechteck wachsen
          // und danach den Rest nachziehen.
          .fromTo(
            "[data-gal-outro] > *",
            { y: 36, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.12, ease: "power2.out" },
            "<0.5",
          );

        // KEIN Rückzug am Ende. Das Porträt bleibt stehen und wird von der
        // nächsten Sektion überdeckt – genau darin liegt der Effekt. Ein
        // Ausblenden davor nimmt ihm die Wirkung: Man sieht dann nicht mehr,
        // wie sich etwas darüberschiebt, sondern nur noch, wie etwas
        // verschwindet.

        // Die Textur läuft über die GESAMTE Strecke – vom ersten Einsortieren
        // bis zum Schlussbild. Deshalb erst jetzt eingehängt, wenn die
        // Gesamtlänge feststeht: Mit fester Dauer wäre sie nach dem ersten
        // Akt am Ende und die restliche Reise wieder still.
        const gesamt = tl.duration();

        // Wanderung: gleichmäßig quer über die ganze Strecke, ohne Sprünge
        // an den Akt-Grenzen. Beide Ebenen ziehen gemeinsam durch.
        tl.fromTo(
          "[data-gal-raster], [data-gal-raster-dicht]",
          { xPercent: 0 },
          { xPercent: -14, ease: "none", duration: gesamt },
          0,
        )
          // Verdichtung: kommt auf der Reise dazu, ist auf halbem Weg am
          // stärksten und geht danach wieder.
          .fromTo(
            "[data-gal-raster-dicht]",
            { opacity: 0 },
            { opacity: 1, ease: "power1.inOut", duration: gesamt * 0.45 },
            0,
          )
          .to(
            "[data-gal-raster-dicht]",
            { opacity: 0, ease: "power1.inOut", duration: gesamt * 0.3 },
            gesamt * 0.5,
          )
          // Und das Grundraster geht am Ende MIT. Ohne das bliebe die Fläche
          // bis zum Schluss durchgezogen liniert – er soll aber in der
          // Reinheit ankommen. Der Auslauf endet vor dem Ende der Timeline,
          // damit die letzte Strecke wirklich ruhig ist und nicht noch
          // etwas nachzieht.
          .to(
            "[data-gal-raster]",
            { opacity: 0, ease: "power2.inOut", duration: gesamt * 0.22 },
            gesamt * 0.62,
          );

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      data-nav-theme="light"
      aria-label="Die Bausteine in Bildern"
      className="relative overflow-hidden bg-ep-paper pb-24 pt-24 sm:pt-32 lg:flex lg:h-svh lg:flex-col lg:justify-center lg:py-0 lg:pt-[var(--nav-h)]"
    >
      {/* Die Textur, durch die die Reise führt.
          Vorher war die Fläche durchgehend Papier – man ist zwei Bildschirme
          lang durch ein weißes Nichts gefahren. Statt eines Farbwechsels
          bewegt sich jetzt die Linien-Textur der Marke: dieselbe, die Hero
          und Gesamtsystem tragen. Sie wandert quer, verdichtet sich unterwegs
          und löst sich am Ziel wieder auf.

          Kein Farbwechsel, weil der Text darüber Tinte ist und sonst mitten
          in der Bewegung die Farbe wechseln müsste – im Standbild sieht so
          etwas stark aus, beim Scrollen wird es zum Kontrastproblem.

          Zwei Ebenen, weil Verdichtung und Wanderung getrennt laufen müssen:
          Die Wanderung ist `translateX` (läuft auf der GPU), die Verdichtung
          ist eine zweite Rasterebene auf halbem Versatz, die nur ein- und
          ausgeblendet wird. Den Linienabstand selbst zu animieren würde die
          Fläche bei jedem Frame neu zeichnen. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          data-gal-raster
          className="absolute inset-y-0 -left-[20%] w-[140%] will-change-transform"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(14,53,82,.16) 0 1px, transparent 1px 72px)",
          }}
        />
        <div
          data-gal-raster-dicht
          className="absolute inset-y-0 -left-[20%] w-[140%] opacity-0 will-change-transform"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(14,53,82,.16) 36px 37px, transparent 37px 72px)",
          }}
        />
      </div>

      {/* Der Kopf gehört zur gepinnten Sektion und bliebe sonst bis zum Ende
          stehen – „Vom Dach bis in den Heizungskeller." über einem Porträt
          ergibt keinen Sinn. Er tritt deshalb ab, sobald die Verwandlung
          beginnt, und macht dem Schlusstext Platz. */}
      <div data-gal-kopf className="ep-container relative z-10 shrink-0">
        <p data-gal-eyebrow className="t-label text-ep-orange-deep">
          In Bildern
        </p>
        {/* Headline und Hinweis stehen jetzt nebeneinander statt
            untereinander: Der Symbolbild-Hinweis klebte direkt unter der
            Überschrift und las sich wie eine Unterzeile – ausgerechnet ein
            Disclaimer an der prominentesten Stelle der Sektion. Als
            Randnotiz auf der Grundlinie ist er da, wo er hingehört, ohne
            leiser zu werden. Und er spart eine Zeile Höhe, die die
            gepinnte Sektion nicht hat. */}
        <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-baseline lg:justify-between lg:gap-10">
          <h2 data-gal-h2 className="t-h2 max-w-[18ch] text-ep-ink">
            Vom Dach bis in den Heizungskeller.
          </h2>
          {/* Muss stehen bleiben: Es sind Stockfotos, keine Anlagen von
              Ilias. Einmal und beiläufig – nicht als Etikett an jedem Bild. */}
          <p data-gal-eyebrow className="t-key shrink-0 text-ep-ink/70">
            Anlagenfotos sind Symbolbilder.
          </p>
        </div>
      </div>

      {/* Bühne: begrenzt die Sicht, damit die Reihe seitlich hinein- und
          hinausfahren kann, ohne die Seite breiter zu machen. */}
      <div ref={buehne} className="ep-container relative z-10 mt-12 shrink-0 sm:mt-16 lg:mt-8">
        <div
          ref={spur}
          className="flex flex-col gap-12 lg:w-max lg:flex-row lg:items-center lg:gap-8 lg:will-change-transform"
        >
          {BILDER.map(({ src, titel, zeile, alt, ...rest }) => {
            const finale = "finale" in rest && rest.finale;
            return (
              /* Ab lg gibt die HÖHE das Maß vor, nicht die Breite: Die Sektion
                 ist gepinnt, alles muss also in einen Bildschirm passen.
                 `w-[64svh]` ergibt bei 4:3 genau 48svh Bildhöhe.
                 Das Schlussbild reiht sich ein wie jedes andere – seine
                 Verwandlung passiert erst danach. */
              <figure
                key={src}
                data-gal-item
                className={cn(
                  // 48/51svh → 40/43svh. Kopf + Bild + Bildunterschrift
                  // passten auf einem 911 px hohen Fenster nicht zusammen in
                  // einen Bildschirm: Die Unterschriften der gepinnten Reihe
                  // rutschten unter die Kante und waren abgeschnitten – und
                  // das betrifft nicht nur kleine Displays, sondern jedes
                  // normale Laptop-Fenster.
                  "relative w-full shrink-0 lg:h-[40svh] lg:w-[53svh] xl:h-[43svh] xl:w-[57svh]",
                  // Mobil bekommt das Porträt einen eigenen Auftritt weiter
                  // unten – im Stapel wäre es nur das sechste Bild.
                  finale && "max-lg:hidden",
                )}
              >
                <div
                  {...(finale ? { "data-gal-panel": true } : {})}
                  className={cn(
                    "relative aspect-[4/3] overflow-hidden rounded-ep",
                    "bg-ep-sand",
                    // Der Rahmen des Schlussbilds liegt ab lg ABSOLUT im
                    // Kärtchen. Nur dadurch lässt er sich später auf halbe
                    // Bildschirmbreite und volle Höhe wachsen, ohne die
                    // Reihe auseinanderzureißen: Ein Element im Fluss würde
                    // beim Wachsen alle Nachbarn verschieben.
                    finale &&
                      "lg:absolute lg:inset-0 lg:aspect-auto lg:will-change-[width,height,transform]",
                  )}
                >
                  {/* Das Porträt ist ein Foto wie die anderen fünf: ein
                      Rechteck mit sichtbaren Kanten, formatfüllend
                      beschnitten.

                      VORHER stand es als Freisteller frei in der Fläche, mit
                      seitlichem Überstand und einem Verlauf ins Papier über
                      der Unterkante. Der Verlauf war nötig, weil das Original
                      ein Brustbild ist und unten hart abgeschnitten endet –
                      während der Reise schwebte diese Kante mitten im Bild
                      und las sich als schlecht freigestellter Sticker.

                      Mit dem Wegfall der Reise entfällt der Grund: Das Bild
                      steht durchgehend in seinem Rahmen, die Schnittkante
                      liegt bei `object-cover` außerhalb und wird vom
                      `overflow-hidden` weggeschnitten. Der Verlauf würde
                      jetzt nur noch wie ein Schatten über dem Foto liegen. */}
                  <div className="absolute inset-0">
                    <Image
                      src={src}
                      alt={alt}
                      fill
                      sizes={finale ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 68svh, 100vw"}
                      className={cn(
                        // `object-top`, weil der Kasten beim Wachsen vom
                        // Querformat ins Hochformat kippt: Bei mittigem
                        // Ausschnitt wandert der Kopf dabei aus dem Bild.
                        finale ? "object-cover object-top" : "object-cover",
                        finale && "will-change-transform",
                      )}
                      {...(finale ? { "data-gal-portrait": true } : {})}
                    />
                  </div>
                </div>

                {/* Beim Schlussbild trägt der Text rechts daneben die
                    Bildunterschrift – auf Mobil gibt es ihn dort nicht,
                    also bleibt sie hier stehen. */}
                <figcaption
                  className={cn(
                    "mt-4 flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:gap-5",
                    finale && "lg:hidden",
                  )}
                >
                  <span className="t-label shrink-0 text-ep-orange-deep">{titel}</span>
                  <span className="text-ep-ink/75">{zeile}</span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>

      {/* Schlusssatz. Mobil steht er unter den Bildern, ab lg füllt er die
          rechte Bildschirmhälfte neben dem gewachsenen Portrait – deshalb
          liegt er an der SEKTION und nicht an der Bühne: Er muss sich an der
          Bildschirmhöhe ausrichten, nicht an der Höhe der Bilderreihe. */}
      {/* ================= Mobiles Finale =================
          Dieselbe Dramaturgie wie am Desktop, nur senkrecht und ohne Kunst-
          griffe: erst die drei Fragen, jede allein auf dem Schirm, dann das
          Porträt, dann die Antwort.

          Text NICHT über das Foto gelegt: Der mobile Ausschnitt sitzt eng
          auf Gesicht und dunklem Hemd, dort ist keine ruhige Fläche für
          Schrift. Ein Schleier, der sie lesbar macht, verdeckt zugleich das
          Bild – beides zusammen geht nicht. Nacheinander ist hier stärker
          als übereinander. */}
      <div className="mt-28 lg:hidden">
        {REISE.map((frage, i) => (
          /* Bewusst größer als `t-h3`: Ein Satz, der allein auf dem Schirm
             steht, muss die Fläche auch tragen. Die Skala ist hier nicht
             falsch – sie gilt für Überschriften ÜBER Inhalt, und die dürfen
             kleiner sein. Diese Fragen SIND der Inhalt.
             10vw ergibt auf einem 390er Display rund 39 px. */
          <p
            key={frage}
            data-gal-frage
            className={cn(
              "flex min-h-[46svh] max-w-[13ch] items-center px-6",
              "text-[clamp(2.25rem,10vw,3.25rem)] font-bold leading-[1.05] tracking-[-0.03em]",
              // Abwechselnd links und rechts. Der Blick springt dadurch beim
              // Scrollen hin und her, statt eine Spalte abzuarbeiten – auf
              // dem schmalen Schirm ist das der einzige Platz für Rhythmus.
              i % 2 === 1 ? "ml-auto justify-end text-right" : "",
              // Die letzte Frage steht direkt über dem Bild und leitet
              // dorthin über – deshalb enger und in Orange.
              i === REISE.length - 1 ? "min-h-[38svh] text-ep-orange-deep" : "text-ep-ink",
            )}
          >
            {frage}
          </p>
        ))}

        <div data-gal-antwort className="px-6">
          <div className="relative aspect-[4/5] overflow-hidden rounded-ep bg-white">
            <Image
              src={FINALE.src}
              alt={FINALE.alt}
              fill
              sizes="100vw"
              className="object-cover object-top"
            />
          </div>

          <p className="t-label mt-10 text-ep-orange-deep">Ihr Ansprechpartner</p>
          {/* Die Antwort muss die Fragen überbieten, nicht ihnen gleichen –
              sonst wirkt sie wie eine weitere Frage statt wie der Schluss. */}
          <h3 className="mt-5 max-w-[13ch] text-[clamp(2.5rem,11vw,3.75rem)] font-bold leading-[1.03] tracking-[-0.035em] text-ep-ink">
            Hinter jeder Planung steht ein Name.
          </h3>
          <p className="mt-8 max-w-[38ch] text-[clamp(1.125rem,1.5vw,1.5rem)] leading-relaxed text-ep-ink/75">
            Ilias Zayakh, Stuttgart. Wir beraten persönlich, planen
            anbieterübergreifend und koordinieren die Ausführung mit geprüften
            Fachbetrieben.
          </p>
        </div>
      </div>

      {/* HIER STAND DIE FRAGEN-SPALTE, an der das Porträt vorbeizog. Sie ist
          mit dem Zwischenakt entfallen – die drei Fragen leben weiter im
          mobilen Teil oben, wo sie die Sektion tragen statt sie zu dehnen. */}

      {/* Bewusst OHNE `ep-container`: Die Klasse steht in globals.css außerhalb
          jeder Layer und setzt `width: 100%`. Ungelayertes CSS gewinnt in der
          Kaskade gegen Tailwinds `@layer utilities` – `lg:w-1/2` käme also
          nicht durch, und der Text läge quer über dem Foto statt daneben.
          Die Randabstände stehen deshalb hier direkt. */}
      {/* `lg:pt-[var(--nav-h)]`: Der Text zentriert sich damit in derselben
          Fläche wie das Foto daneben – nämlich unterhalb der Kopfleiste.
          Ohne den Abzug säße er eine halbe Leistenhöhe zu hoch, und das
          sieht man sofort, weil das Foto direkt daneben die Kante zieht. */}
      <div
        data-gal-outro
        className="hidden lg:absolute lg:inset-y-0 lg:right-0 lg:z-10 lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:pl-[5vw] lg:pr-[6vw] lg:pt-[var(--nav-h)]"
      >
        <p className="t-label text-ep-orange-deep">Ihr Ansprechpartner</p>
        <h3 className="mt-6 max-w-[13ch] text-[clamp(2.75rem,5vw,5.5rem)] font-bold leading-[1.03] tracking-[-0.035em] text-ep-ink">
          Hinter jeder Planung steht ein Name.
        </h3>
        <p className="t-lead mt-6 max-w-[40ch] text-ep-ink/75">
          Ilias Zayakh, Stuttgart. Wir beraten persönlich, planen
          anbieterübergreifend und koordinieren die Ausführung mit geprüften
          Fachbetrieben.
        </p>
      </div>
    </section>
  );
}
