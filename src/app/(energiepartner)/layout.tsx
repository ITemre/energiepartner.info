import type { Metadata } from "next";
import { SiteHeader } from "@/components/nav/SiteHeader";
import { SiteFooter } from "@/components/nav/SiteFooter";
import { AnfrageProvider } from "@/components/anfrage/AnfrageProvider";
import { SITE } from "@/lib/site";

/**
 * HERKUNFT UND KANONISCHE ADRESSE DIESES AUFTRITTS *
 * `metadataBase` ist die Grundlage, gegen die Next alle relativen Adressen
 * in den Metadaten auflöst – Canonical, `og:url`, `og:image`. Ohne sie
 * bleiben genau diese Felder relativ, und relative Adressen sind in
 * OpenGraph nicht erlaubt: Die WhatsApp-Vorschau bekäme dann kein Bild.
 *
 * SIE STEHT HIER UND NICHT IM ROOT-LAYOUT, und das ist der ganze Punkt
 * dieser Datei. Ein Deploy bedient ZWEI Domains. Stünde eine gemeinsame
 * Basis oben, trügen die Seiten der jeweils anderen Marke die falsche
 * Herkunft in jedem Canonical – der sicherste Weg, zwei Auftritte zu einem
 * Duplikat zu erklären. Jede Route-Group bringt ihre eigene mit; die
 * Zuordnung ist eindeutig, weil eine Group immer zu genau einer Domain
 * gehört.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "/",
    siteName: "energiepartner",
    title: "energiepartner · Ihre Energie. Ihr Vorteil.",
    description:
      "Ihr herstellerunabhängiger Berater für Wärmepumpe, Photovoltaik und Stromtarif: anbieterübergreifend verglichen, persönlich betreut in Stuttgart. Kostenlos.",
  },
};

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
