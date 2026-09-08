import type { Metadata } from "next";
import { AvHeader } from "@/components/av/AvHeader";
import { AvFooter } from "@/components/av/AvFooter";
import { AvUploadProvider } from "@/components/av/AvUpload";
import { AvStickyBar } from "@/components/av/AvStickyBar";
import { AV_ORIGIN } from "@/lib/site";

/**
 * EIGENE MARKE, AUCH IM REITER * Das Root-Layout setzt `title.template` auf `"%s · energiepartner"`. Diese
 * Vorlage griff auch hier – im Browser stand über der Prüfstrecke
 * „Angebot prüfen lassen · Wärmepumpe · energiepartner", und damit machte
 * der Reitertitel genau das rückgängig, was `AvWortmarke` seitenlang
 * begründet: Wer per QR aus einem Brief kommt, hat von energiepartner
 * womöglich nie gehört und sucht eine Prüfung, keinen
 * Unternehmensauftritt.
 *
 * Die eigene Vorlage überschreibt sie für alles unterhalb dieser Group.
 * Der Absender geht dabei nicht verloren: Er steht in der Wortmarke, im
 * Footer und im Impressum.
 *
 * HERKUNFT * `metadataBase` und Canonical zeigen fest auf angebote-vergleichen.info –
 * auch dann, wenn die Seite gerade über `energiepartner.info/av`
 * ausgeliefert wird. Begründung an `AV_ORIGIN` in `lib/site.ts`.
 */
export const metadata: Metadata = {
  metadataBase: new URL(AV_ORIGIN),
  /* `absolute`, NICHT `default` – und das ist genau der Fallstrick, den
     man erst im gebauten HTML sieht.

     `title.default` gilt in Next als Titel eines Kind-Segments und läuft
     deshalb weiterhin durch die `template` des Root-Layouts. Gemessen im
     Produktionsbuild stand dort:

       „Wärmepumpen-Angebot prüfen lassen · angebote-vergleichen.info
        · energiepartner"

     – also beide Marken hintereinander, 74 Zeichen, und der Fehler, der
     hier eigentlich behoben werden sollte, nur eine Ebene tiefer.

     `absolute` ist die einzige Form, die eine ererbte Vorlage abschaltet.
     Die eigene `template` daneben bleibt gültig: Sie greift für künftige
     Unterseiten dieser Group, nicht für diesen Titel selbst. */
  title: {
    absolute: "Wärmepumpen-Angebot prüfen lassen · angebote-vergleichen.info",
    template: "%s · angebote-vergleichen.info",
  },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "/",
    siteName: "angebote-vergleichen.info",
    title: "Ist Ihr Wärmepumpen-Angebot vollständig?",
    description:
      "Angebot hochladen, in 24 Stunden erfahren, welche Positionen fehlen. Kostenlos und unverbindlich.",
  },
};

/**
 * Layout von angebote-vergleichen.info.
 *
 * DER UPLOAD LIEGT IM LAYOUT * `AvUploadProvider` hält den einen `<input type="file">` und den einen
 * Vollbild-`<dialog>` der Seite. Jeder Auslöser – der Knopf im Hero, die
 * Ablagefläche daneben, die vier CTA-Bänder, die mitlaufende Leiste – ruft
 * über `useUpload()` dieselbe Funktion auf.
 *
 * Läge er stattdessen in einer Sektion, hätte jede weitere ihren eigenen
 * Dialog und ihren eigenen Dateizustand; welcher gerade gilt, hinge davon
 * ab, auf welchen Knopf jemand zufällig geklickt hat.
 *
 * OHNE `AnfrageProvider` * Er stand hier, solange die Seite denselben Anfrage-Dialog nutzte wie
 * energiepartner.info. Seit der Upload-Funnel seinen eigenen mitbringt,
 * ruft ihn hier niemand mehr auf.
 *
 * `AvAbschluss` öffnet das alte Formular noch über `useAnfrage()` und
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
