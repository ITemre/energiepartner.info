import { SiteHeader } from "@/components/nav/SiteHeader";
import { SiteFooter } from "@/components/nav/SiteFooter";
import { AnfrageProvider } from "@/components/anfrage/AnfrageProvider";

/**
 * Layout des Auftritts energiepartner.info (Vertrauens-/Info-Seite).
 *
 * Kopfleiste neu gebaut (13.08., Kundenwunsch: moderner, wirkt wie eine
 * richtige Company) – siehe `SiteHeader` für Farbwechsel/Ankunft und
 * `MenuOverlay` für das mobile Vollbildmenü.
 */
export default function EnergiepartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /* Der Anfrage-Dialog liegt im Layout, nicht in einer Sektion: So gibt
       es genau eine Instanz, und jeder beliebige Knopf auf der Seite kann
       sie über `useAnfrage()` öffnen. */
    <AnfrageProvider>
      <SiteHeader />
      {children}
      <SiteFooter />
    </AnfrageProvider>
  );
}
