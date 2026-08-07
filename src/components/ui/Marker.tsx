"use client";

import { useId, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Der handgezogene Strich unter einem Wort.
 *
 * ═══ WARUM DAS HIER HINEINGEHÖRT ═══
 * Seiten, die verkaufen, markieren ein Wort pro Aussage von Hand. Der Effekt
 * ist banal und trotzdem stark: Ein gerader Balken liest sich als
 * Textauszeichnung, ein leicht schiefer, ungleichmäßiger Strich liest sich
 * als **Geste**. Jemand hat hier etwas für wichtig gehalten und es angestrichen.
 * Das ist der Unterschied zwischen einem Dokument und einer Empfehlung.
 *
 * Für diese Seite ist es zusätzlich naheliegend: Sie hat keine Bilder, ihr
 * Baumaterial sind Linien – Trennstriche, Ringleitungen, die Skala des
 * Messinstruments, die durchhängenden `BendLine`s. Ein gezogener Strich ist
 * dasselbe Material in einer anderen Handschrift, nicht ein neues Element.
 *
 * ═══ ⚠️ EIN BIS ZWEI WÖRTER, NIE EIN SATZTEIL ═══
 * Die wichtigste Regel im Umgang damit, und sie ist rein gestalterisch:
 * Ein Strich unter „bevor Sie unterschreiben." ist über 600 px lang und
 * liest sich als Linie, nicht als Geste – eine Hand zieht keinen
 * halbmeterlangen Strich. Unter „unterschreiben" allein sticht dasselbe
 * Zeichen heraus.
 *
 * Inhaltlich ist es derselbe Punkt: Markiert wird das Wort, auf das es
 * ankommt. Wer den ganzen Nebensatz anstreicht, hat nichts hervorgehoben,
 * sondern nur unterstrichen.
 *
 *   richtig   kostet Sie <Marker>nichts</Marker>.
 *   falsch    <Marker>kostet Sie nichts.</Marker>
 *
 * Faustregel: Passt der markierte Text nicht in ein Drittel seiner Zeile,
 * ist er zu lang.
 *
 * ═══ WARUM ER SICH ZEICHNET ═══
 * Er läuft nicht mit dem Scroll (kein Scrub), sondern zeichnet sich EINMAL,
 * wenn die Zeile ins Bild kommt – in etwa der Geschwindigkeit, in der man
 * ihn zöge. Ein Strich, der beim Zurückscrollen wieder verschwindet, wäre
 * ein Effekt; einer, der einmal gezogen wird und dann steht, ist eine Notiz.
 *
 * ═══ TECHNIK ═══
 * `stroke-dasharray`/`dashoffset` auf einem Bézier-Pfad.
 *
 * ⚠️ `pathLength={1}` IST DER TRICK, und er löst ein sichtbares Problem:
 * Ohne ihn müsste die tatsächliche Pfadlänge zur Laufzeit über
 * `getTotalLength()` gemessen und erst danach versteckt werden. Zwischen
 * dem vom Server gelieferten Markup und diesem ersten JavaScript liegt aber
 * mindestens ein Frame – und in dem stand der fertige Strich schon da.
 * Sichtbar wurde das als kurzes Aufblitzen eines Strichstücks am rechten
 * Rand, bevor die Animation von links loslief.
 *
 * `pathLength` normiert die Länge auf 1, unabhängig von der echten
 * Geometrie. Damit lassen sich `strokeDasharray` und `strokeDashoffset`
 * schon als Attribute ins SSR-Markup schreiben: Der Strich ist vom ersten
 * Byte an unsichtbar, GSAP muss ihn nur noch von 1 auf 0 laufen lassen und
 * nichts mehr messen.
 *
 * `preserveAspectRatio="none"` zerrt die viewBox auf die Wortbreite.
 *
 * ⚠️ Bewusst OHNE `non-scaling-stroke`, anders als bei `BendLine`: Dort soll
 * eine Haarlinie über jede Breite exakt 1 px bleiben. Hier ist das falsch –
 * die Strichstärke muss mit der Schriftgröße wachsen, sonst liegt unter
 * einer 100-px-Headline derselbe dünne Strich wie unter Fließtext. Weil die
 * SVG-Höhe in `em` steht, skaliert die Stärke automatisch mit der Schrift.
 * Dass sie durch das horizontale Zerren leicht ungleichmäßig wird, ist hier
 * kein Fehler, sondern genau der handgezogene Eindruck.
 *
 * Der Pfad liegt ABSOLUT unter dem Wort und beansprucht keine Zeilenhöhe.
 * Ein Element im Fluss würde den Zeilenabstand der Headline verändern, und
 * die ist an mehreren Stellen auf 1.02 gesetzt – da ist kein Platz.
 */

/** Zwei Handschriften, damit nicht jeder Strich identisch aussieht.
 *  Beide leicht ansteigend und in der Mitte durchhängend – so zieht man
 *  einen Strich mit dem Handgelenk, nicht mit dem Lineal. */
const PFADE = [
  "M1,7.5 C 22,3.4 48,2.6 74,4.2 C 88,5.1 96,6.6 99,8.4",
  "M1,6.2 C 18,9.2 44,9.6 70,7.4 C 84,6.2 94,4.4 99,2.6",
] as const;

export function Marker({
  children,
  /** 0 oder 1 – wählt die Handschrift. Nachbarn sollten sich unterscheiden. */
  variante = 0,
  /** Verzögerung in Sekunden, wenn mehrere Striche nacheinander laufen. */
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  variante?: 0 | 1;
  delay?: number;
  className?: string;
}) {
  const scope = useRef<HTMLSpanElement>(null);
  const uid = useId().replace(/:/g, "");

  useGSAP(
    () => {
      const pfad = scope.current?.querySelector<SVGPathElement>("path");
      if (!pfad) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Nichts zu messen und nichts zu verstecken: Der Pfad kommt dank
        // `pathLength={1}` bereits unsichtbar aus dem Server-Markup.
        gsap.to(pfad, {
          strokeDashoffset: 0,
          duration: 0.7,
          delay,
          // `power2.out`: schnell angesetzt, zum Ende hin auslaufend. Genau
          // so bewegt sich eine Hand – gleichmäßig gezogen wirkt es wie
          // ein Ladebalken.
          ease: "power2.out",
          scrollTrigger: { trigger: scope.current, start: "top 88%", once: true },
        });
      });

      // Ohne Bewegung steht der Strich sofort da. Er trägt Bedeutung, also
      // darf er nicht ganz fehlen, nur weil jemand Animationen abgestellt hat.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(pfad, { strokeDashoffset: 0 });
      });
    },
    { scope },
  );

  return (
    /* `data-marker` ist kein Selektor für Styling, sondern ein Schutzschild:
       `maskedHeadline` reicht ihn als `ignore` an SplitText weiter. Ohne
       das zerlegt SplitText den Inhalt in Wörter und baut ihn neu zusammen –
       der Strich landet dann nur unter dem ersten Wort. */
    <span
      ref={scope}
      data-marker
      className={cn("relative inline-block", className)}
    >
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 100 12"
        preserveAspectRatio="none"
        fill="none"
        /* Sitzt unterhalb der Grundlinie und ragt seitlich leicht heraus –
           ein von Hand gezogener Strich endet nie exakt am Buchstaben.
           Alle Maße in `em`, damit er bei jeder Schriftgröße gleich weit
           unter dem Wort liegt.

           ⚠️ DIE TIEFE IST AN DEN MASKENPUFFER GEBUNDEN. Headlines laufen
           durch SplitText mit `mask: "lines"`, und diese Masken clippen
           exakt zeilenhoch. `padMasks()` in lib/motion.ts gibt ihnen 0.18em
           Luft nach unten – mehr steht nicht zur Verfügung. Unterkante hier
           also −0.02em + 0.14em = 0.12em, sicher innerhalb des Puffers.
           Wer den Strich tiefer setzt, schneidet ihn in jeder maskierten
           Headline ab, und zwar nur dort: im Fließtext fiele es nicht auf.

           ⚠️ DIE BREITE MUSS EXPLIZIT STEHEN. `left-0 right-0` allein
           streckt ein SVG NICHT: Es hat über seine viewBox (100×12) ein
           intrinsisches Seitenverhältnis, und `width: auto` rechnet daraus
           Breite = Höhe × 100/12. Der Strich war dadurch immer gleich kurz,
           egal wie lang das Wort darunter war – unter „Ihr Vorteil." reichte
           er exakt bis zum Ende von „Ihr". */
        className="pointer-events-none absolute -bottom-[0.02em] -left-[0.04em] h-[0.14em] w-[calc(100%+0.08em)] overflow-visible"
      >
        <path
          id={uid}
          d={PFADE[variante]}
          stroke="currentColor"
          strokeWidth={3.2}
          strokeLinecap="round"
          /* Länge auf 1 normiert – siehe Kopfkommentar. Dadurch stehen
             Strichmuster und Versatz schon im Server-Markup und der Strich
             ist vor der Animation nie sichtbar. */
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1}
        />
      </svg>
    </span>
  );
}
