import type { Metadata } from "next";
import { Archivo, DM_Mono } from "next/font/google";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { MotionRoot } from "@/components/ui/MotionRoot";
import "./globals.css";

/**
 * SCHRIFT — eine Familie, zwei Weiten.
 *
 * Vorher lief hier Rubik für alles, mit der Begründung „dieselbe Schrift wie
 * die Wortmarke". Das Argument trägt nicht: Eine Wortmarke ist ein gezeichnetes
 * Bild, kein Schriftsystem. Rubik ist freundlich und rund – bei 100 px liest
 * sie sich gefällig, aber ohne Haltung, und genau daran hing der Eindruck
 * „sehr ordentlich" statt „scharf".
 *
 * Archivo ist eine Grotesk mit zwei Achsen: Gewicht UND Weite. Das erlaubt
 * den Kontrast, den sonst ein Familienwechsel liefern müsste – und der kommt
 * hier direkt aus der Welt des Kunden: Technische Beschriftung an Anlagen,
 * Zählerschränken und Typenschildern ist schmal gesetzt, weil sie in eine
 * feste Breite passen muss. Headlines laufen deshalb auf `font-stretch: 86%`,
 * Fließtext auf 100 %. Deutsche Komposita („Wirtschaftlichkeitsrechnung")
 * profitieren doppelt: schmal gesetzt passen sie überhaupt erst in eine Zeile.
 *
 * DM Mono statt JetBrains Mono für die Mikro-Ebene. JetBrains ist eine
 * Editor-Schrift – sie erzählt „Code". DM Mono ist feiner und ruhiger und
 * erzählt „Messwert", und das ist hier das richtige Register.
 */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

/* Der Suchtreffer ist die erste Copy, die ein Besucher sieht – lange bevor
   der Hero lädt. Deshalb dieselbe Reihenfolge wie auf der Seite selbst:
   Wärmepumpe zuerst (Briefing 4), danach PV und Tarif. Der Trenner ist der
   CI-Mittelpunkt, kein Gedankenstrich.
   Die Beschreibung bleibt unter 160 Zeichen, sonst schneidet Google sie
   mitten im Nutzenversprechen ab. */
export const metadata: Metadata = {
  title: {
    default: "energiepartner · Ihre Energie. Ihr Vorteil.",
    template: "%s · energiepartner",
  },
  description:
    "Wärmepumpe, Photovoltaik und Stromtarif aus einer Hand: herstellerunabhängig beraten, anbieterübergreifend verglichen, persönlich betreut in Stuttgart. Beratung kostenlos.",
};

/**
 * ⚠️ KEIN `h-full` auf `<html>`, und das ist kein Versehen.
 *
 * Ein `height: 100%` auf dem Dokument ist genau das, was Lenis' eigenes
 * Stylesheet mit `html.lenis { height: auto }` wieder zurücknimmt. Solange
 * beides gleichzeitig galt, hat Lenis die Scrollstrecke falsch gemessen: Man
 * kam am Seitenende nicht an, Impressum und Datenschutz im Footer waren nicht
 * anklickbar.
 *
 * `min-h-svh` am `<body>` erfüllt denselben Zweck – die Seite füllt
 * mindestens den Schirm, der Footer rutscht auf kurzen Seiten nicht nach
 * oben – ohne die Höhe des Dokuments festzunageln.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${archivo.variable} ${dmMono.variable} antialiased`}>
      <body className="flex min-h-svh flex-col bg-ep-paper font-sans text-ep-ink">
        <SmoothScroll />
        <MotionRoot />
        {children}
      </body>
    </html>
  );
}
