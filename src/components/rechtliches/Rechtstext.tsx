import type { ReactNode } from "react";

/**
 * Bausteine für Impressum und Datenschutz.
 *
 * Warum eigene Komponenten und keine Prose-Klasse: Die Seite hat ein
 * Typo-System aus Rollen (`.t-h2`, `.t-lead`, …), und Rechtstexte sind der
 * Ort, an dem man am ehesten anfängt, daneben eine zweite Skala aufzumachen.
 * Drei kleine Bausteine halten das zusammen und sorgen dafür, dass beide
 * Seiten identisch aussehen.
 */

export function Seitenkopf({
  titel,
  stand,
}: {
  titel: string;
  stand: string;
}) {
  return (
    <div className="border-b border-ep-line pb-10">
      <h1 className="t-h2 max-w-[16ch] text-ep-ink">{titel}</h1>
      <p className="t-key mt-5 text-ep-ink/60">Stand: {stand}</p>
    </div>
  );
}

export function Abschnitt({
  titel,
  children,
}: {
  titel: string;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-ep-line py-10">
      <h2 className="t-h4 text-ep-ink">{titel}</h2>
      {/* `[&_p]` statt einer Klasse an jedem Absatz: In einem Rechtstext
          stehen Dutzende davon, und jeder einzeln ausgezeichnete Absatz ist
          eine Stelle, an der die Skala auseinanderlaufen kann. */}
      <div className="mt-5 flex max-w-[76ch] flex-col gap-4 leading-relaxed text-ep-ink/80 [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-ep-ink [&_li]:leading-relaxed [&_strong]:font-semibold [&_strong]:text-ep-ink">
        {children}
      </div>
    </section>
  );
}

/**
 * Eine noch nicht gelieferte Pflichtangabe.
 *
 * Sie steht sichtbar im Text und nicht als Kommentar im Quelltext, weil
 * genau das ihr Zweck ist: Der Kunde soll beim Durchklicken sofort sehen,
 * was von ihm fehlt. Ein `<!-- TODO -->` sieht er nie.
 *
 * VOR DEM LIVEGANG MUSS DIESE KOMPONENTE AUS BEIDEN SEITEN VERSCHWUNDEN
 * SEIN. Ein Impressum mit Lücken ist kein unvollständiges Impressum,
 * sondern ein fehlendes (§ 5 DDG) – und damit abmahnfähig. Solange irgendwo
 * ein `<Fehlt>` steht, darf die Seite nicht online gehen.
 */
export function Fehlt({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-baseline gap-2 rounded-[4px] bg-ep-accent-strong/15 px-2 py-0.5 font-semibold text-ep-accent">
      <span aria-hidden="true">▲</span>
      {children}
    </span>
  );
}
