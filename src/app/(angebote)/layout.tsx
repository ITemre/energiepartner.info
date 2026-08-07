import { AvHeader } from "@/components/av/AvHeader";
import { AvFooter } from "@/components/av/AvFooter";
import { AvUploadProvider } from "@/components/av/AvUpload";
import { AvStickyBar } from "@/components/av/AvStickyBar";

/**
 * Layout von angebote-vergleichen.info.
 *
 * ═══ DER UPLOAD LIEGT IM LAYOUT ═══
 * `AvUploadProvider` hält den einen `<input type="file">` und den einen
 * Vollbild-`<dialog>` der Seite. Jeder Auslöser – der Knopf im Hero, die
 * Ablagefläche daneben, die vier CTA-Bänder, die mitlaufende Leiste – ruft
 * über `useUpload()` dieselbe Funktion auf.
 *
 * Läge er stattdessen in einer Sektion, hätte jede weitere ihren eigenen
 * Dialog und ihren eigenen Dateizustand; welcher gerade gilt, hinge davon
 * ab, auf welchen Knopf jemand zufällig geklickt hat. nice
 *
 * ═══ OHNE `AnfrageProvider` ═══
 * Er stand hier, solange die Seite denselben Anfrage-Dialog nutzte wie
 * energiepartner.info. Seit der Upload-Funnel seinen eigenen mitbringt,
 * ruft ihn hier niemand mehr auf.
 *
 * ⚠️ `AvAbschluss` öffnet das alte Formular noch über `useAnfrage()` und
 * würde ohne den Provider zur Laufzeit werfen. Beim Wiedereinhängen also
 * entweder den Provider zurückholen oder – besser – die Komponente auf
 * `AvUploadKnopf` umstellen, damit alle Einstiege denselben Weg gehen.
 */
export default function AngeboteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AvUploadProvider>
      <AvHeader />
      {children}
      <AvFooter />
      {/* Nach dem Footer, damit die Leiste über allem liegt – sie ist
          `fixed`, ihre Position im Baum entscheidet aber über die
          Stapelung gegenüber gleichrangigen Ebenen. */}
      <AvStickyBar />
    </AvUploadProvider>
  );
}
