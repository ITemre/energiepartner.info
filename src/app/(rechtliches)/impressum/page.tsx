import type { Metadata } from "next";
import { SITE, VERMITTLERHINWEIS } from "@/lib/site";
import { Abschnitt, Fehlt, Seitenkopf } from "@/components/rechtliches/Rechtstext";

export const metadata: Metadata = {
  title: "Impressum",
  // Rechtstexte gehören nicht in den Index – sie ziehen Suchtreffer auf
  // eine Seite, die niemand sucht, und verwässern die eigentliche.
  robots: { index: false, follow: true },
};

/**
 * Impressum.
 *
 * NOCH NICHT LIVEGANG-FÄHIG. Die mit `<Fehlt>` markierten Angaben stehen
 * aus (Projekt-Briefing, Abschnitt 9). Ein Impressum, dem Pflichtangaben
 * fehlen, gilt als nicht vorhanden – die Seite darf mit diesen Markierungen
 * nicht online gehen.
 *
 * Die Anschrift stammt aus dem Briefing und ist ihrerseits als „vollständige
 * Impressumsdaten ausstehend" gekennzeichnet, also vor Veröffentlichung
 * gegen die Gewerbeanmeldung zu prüfen.
 */
export default function ImpressumSeite() {
  return (
    <div className="ep-container py-16 sm:py-24">
      <Seitenkopf titel="Impressum" stand="Entwurf, Angaben unvollständig" />

      <Abschnitt titel="Angaben gemäß § 5 DDG">
        <p>
          Ihr Makler Ltd.
          <br />
          Niederlassung Deutschland
          <br />
          Panoramastraße 99
          <br />
          70839 Gerlingen
        </p>
        <p>
          <Fehlt>Rechtsform und Registereintrag bestätigen</Fehlt>
        </p>
      </Abschnitt>

      <Abschnitt titel="Vertreten durch">
        <p>
          <Fehlt>Name des Vertretungsberechtigten</Fehlt>
        </p>
      </Abschnitt>

      <Abschnitt titel="Kontakt">
        <p>
          Telefon und WhatsApp:{" "}
          <a href={SITE.phone.href}>{SITE.phone.display}</a>
        </p>
        <p>
          E-Mail: <Fehlt>E-Mail-Adresse fehlt</Fehlt>
        </p>
        <p className="text-ep-ink/60">
          Eine E-Mail-Adresse ist Pflichtangabe. Ohne sie ist das Impressum
          unvollständig.
        </p>
      </Abschnitt>

      <Abschnitt titel="Registereintrag">
        <p>
          <Fehlt>Registergericht und Registernummer</Fehlt>
        </p>
      </Abschnitt>

      <Abschnitt titel="Umsatzsteuer-Identifikationsnummer">
        <p>
          <Fehlt>USt-IdNr. gemäß § 27 a UStG</Fehlt>
        </p>
      </Abschnitt>

      <Abschnitt titel="Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV">
        <p>
          <Fehlt>Name und Anschrift der verantwortlichen Person</Fehlt>
        </p>
      </Abschnitt>

      <Abschnitt titel="Unsere Rolle">
        <p>
          Wir beraten herstellerunabhängig zu Wärmepumpe, Photovoltaik und
          Stromtarif, vergleichen anbieterübergreifend und vermitteln die
          Ausführung an geprüfte Fachbetriebe. Die Installation führen wir
          nicht selbst aus.
        </p>
        <p>{VERMITTLERHINWEIS}</p>
      </Abschnitt>

      <Abschnitt titel="Streitbeilegung">
        <p>
          Die Europäische Kommission stellt eine Plattform zur
          Online-Streitbeilegung bereit:{" "}
          <a
            href="https://ec.europa.eu/consumers/odr/"
            target="_blank"
            rel="noopener noreferrer"
          >
            ec.europa.eu/consumers/odr
          </a>
          .
        </p>
        <p>
          Wir sind nicht bereit und nicht verpflichtet, an
          Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
          teilzunehmen.
        </p>
      </Abschnitt>
    </div>
  );
}
