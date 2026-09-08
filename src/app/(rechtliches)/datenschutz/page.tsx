import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { Abschnitt, Fehlt, Seitenkopf } from "@/components/rechtliches/Rechtstext";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  robots: { index: false, follow: true },
};

/**
 * Datenschutzerklärung.
 *
 * ENTWURF, KEINE RECHTSBERATUNG. Der Text beschreibt exakt das, was
 * diese Anwendung technisch tut – nicht mehr und nicht weniger. Genau das
 * ist sein Wert: Ein aus einem Generator gezogener Standardtext beschreibt
 * meistens Google Analytics, Cookie-Banner und Social-Plugins, die es hier
 * alle nicht gibt, und schweigt zu dem, was es gibt (Bitrix24, WhatsApp,
 * Angebots-Upload).
 *
 * Vor dem Livegang gehört er trotzdem durch eine anwaltliche Prüfung – so
 * steht es auch im Markenhandbuch. Offen sind außerdem die
 * Auftragsverarbeitung mit Bitrix24 und die Angaben des Hosters.
 *
 * WAS HIER BEWUSST NICHT STEHT: Ein Hinweis auf Google Fonts. Die Schriften
 * werden über `next/font/google` beim Bauen heruntergeladen und vom eigenen
 * Server ausgeliefert; beim Seitenaufruf entsteht keine Verbindung zu
 * Google, also gibt es auch keine IP-Übermittlung zu erklären. Das ist der
 * häufigste Falschtext in deutschen Datenschutzerklärungen.
 */
export default function DatenschutzSeite() {
  return (
    <div className="ep-container py-16 sm:py-24">
      <Seitenkopf
        titel="Datenschutzerklärung"
        stand="Entwurf, anwaltliche Prüfung ausstehend"
      />

      <Abschnitt titel="Verantwortlicher">
        <p>
          Verantwortlich für die Datenverarbeitung auf dieser Website ist der
          im <a href="/impressum">Impressum</a> genannte Anbieter.
        </p>
        <p>
          <Fehlt>
            Kontaktdaten des Verantwortlichen vervollständigen (E-Mail)
          </Fehlt>
        </p>
      </Abschnitt>

      <Abschnitt titel="Aufruf der Website">
        <p>
          Beim Aufruf dieser Website übermittelt Ihr Browser technisch
          notwendige Daten an unseren Hoster, der sie in Server-Logdateien
          speichert: IP-Adresse, Datum und Uhrzeit, aufgerufene Adresse,
          übertragene Datenmenge, Browsertyp und Betriebssystem.
        </p>
        <p>
          Die Verarbeitung erfolgt auf Grundlage unseres berechtigten
          Interesses am sicheren und stabilen Betrieb der Website (Art. 6
          Abs. 1 lit. f DSGVO). Eine Zusammenführung dieser Daten mit anderen
          Datenquellen findet nicht statt.
        </p>
        <p>
          <Fehlt>Hoster benennen und Auftragsverarbeitung ergänzen</Fehlt>
        </p>
      </Abschnitt>

      <Abschnitt titel="Cookies und Analyse">
        <p>
          <strong>
            Diese Website setzt keine Cookies, die nicht technisch notwendig
            sind.
          </strong>{" "}
          Es findet keine Reichweitenmessung statt, es sind keine
          Analysewerkzeuge und keine Social-Media-Plugins eingebunden. Aus
          diesem Grund gibt es auch kein Einwilligungsbanner.
        </p>
        <p>
          Die verwendeten Schriftarten werden von unserem eigenen Server
          ausgeliefert. Beim Betrachten der Seite entsteht dadurch keine
          Verbindung zu Servern Dritter.
        </p>
      </Abschnitt>

      <Abschnitt titel="Anfrageformular">
        <p>
          Wenn Sie uns über das Formular eine Anfrage schicken, verarbeiten wir
          die von Ihnen gemachten Angaben: Ihr Anliegen, die Postleitzahl, bei
          einer Beratungsanfrage die Gebäudeart, Ihren Namen, Telefonnummer
          und E-Mail-Adresse, sowie eine freiwillige Nachricht.
        </p>
        <p>
          Diese Daten verwenden wir ausschließlich, um Ihre Anfrage zu
          bearbeiten und Sie dazu zu kontaktieren. Rechtsgrundlage ist Ihre
          Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) sowie die Durchführung
          vorvertraglicher Maßnahmen (Art. 6 Abs. 1 lit. b DSGVO). Sie können
          Ihre Einwilligung jederzeit für die Zukunft widerrufen.
        </p>
        <p>
          Zum Schutz vor automatisierten Einsendungen enthält das Formular ein
          für Sie unsichtbares Feld und begrenzt die Zahl der Anfragen je
          IP-Adresse. Weitere Daten werden dabei nicht erhoben.
        </p>
      </Abschnitt>

      <Abschnitt titel="Übermittlung Ihres Angebots">
        <p>
          Auf angebote-vergleichen.info können Sie ein bestehendes Angebot als
          PDF oder Foto übermitteln. Die Datei verarbeiten wir ausschließlich,
          um sie fachlich zu prüfen und Ihnen eine Einschätzung zu geben.
        </p>
        <p>
          Bitte übermitteln Sie uns keine Unterlagen, die besondere
          Kategorien personenbezogener Daten im Sinne des Art. 9 DSGVO
          enthalten. Für die Prüfung genügen die technischen und preislichen
          Angaben des Angebots.
        </p>
      </Abschnitt>

      <Abschnitt titel="Kundenverwaltung (Bitrix24)">
        <p>
          Ihre Anfrage speichern wir in unserem Kundenverwaltungssystem
          Bitrix24, um sie bearbeiten und den weiteren Kontakt nachvollziehen
          zu können. Anbieter ist die Bitrix24 GmbH. Die Daten werden auf
          Servern innerhalb der Europäischen Union verarbeitet.
        </p>
        <p>
          Die Verarbeitung erfolgt in unserem Auftrag auf Grundlage eines
          Vertrags zur Auftragsverarbeitung nach Art. 28 DSGVO.
        </p>
        <p>
          <Fehlt>
            Auftragsverarbeitungsvertrag mit Bitrix24 abschließen und
            Serverstandort bestätigen
          </Fehlt>
        </p>
      </Abschnitt>

      <Abschnitt titel="Kontakt über WhatsApp">
        <p>
          Auf unseren Seiten finden Sie Schaltflächen, die WhatsApp öffnen.
          Es handelt sich um einfache Verweise: Erst wenn Sie darauf klicken,
          wird eine Verbindung zu WhatsApp hergestellt. Vorher werden keine
          Daten an den Anbieter übertragen, und es sind keine Skripte von
          WhatsApp oder Meta eingebunden.
        </p>
        <p>
          Nehmen Sie über WhatsApp Kontakt auf, gelten zusätzlich die
          Datenschutzbestimmungen der WhatsApp Ireland Limited. Dabei können
          Daten auch außerhalb der Europäischen Union verarbeitet werden.
          Wenn Sie das vermeiden möchten, nutzen Sie bitte das Formular oder
          rufen Sie uns an: <a href={SITE.phone.href}>{SITE.phone.display}</a>.
        </p>
      </Abschnitt>

      <Abschnitt titel="Weitergabe an Fachbetriebe">
        <p>
          Wir vermitteln die Ausführung an geprüfte Fachbetriebe. Ihre Daten
          geben wir an einen Fachbetrieb nur weiter, wenn Sie das wünschen und
          wir Sie zuvor darüber informiert haben. Ohne Ihr Einverständnis
          erfolgt keine Weitergabe zu Werbezwecken.
        </p>
      </Abschnitt>

      <Abschnitt titel="Speicherdauer">
        <p>
          Wir speichern Ihre Anfrage, solange sie zur Bearbeitung erforderlich
          ist. Kommt kein Vertrag zustande, löschen wir die Daten, sobald der
          Vorgang abgeschlossen ist und keine gesetzlichen
          Aufbewahrungspflichten entgegenstehen. Für Geschäftsunterlagen
          gelten die handels- und steuerrechtlichen Fristen von sechs
          beziehungsweise zehn Jahren.
        </p>
      </Abschnitt>

      <Abschnitt titel="Ihre Rechte">
        <p>Sie haben jederzeit das Recht auf</p>
        <ul className="flex list-disc flex-col gap-2 pl-5">
          <li>Auskunft über die zu Ihnen gespeicherten Daten (Art. 15 DSGVO),</li>
          <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO),</li>
          <li>Löschung (Art. 17 DSGVO),</li>
          <li>Einschränkung der Verarbeitung (Art. 18 DSGVO),</li>
          <li>Datenübertragbarkeit (Art. 20 DSGVO),</li>
          <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO).</li>
        </ul>
        <p>
          Eine erteilte Einwilligung können Sie jederzeit mit Wirkung für die
          Zukunft widerrufen. Außerdem steht Ihnen ein Beschwerderecht bei
          einer Datenschutz-Aufsichtsbehörde zu, in Baden-Württemberg beim
          Landesbeauftragten für den Datenschutz und die Informationsfreiheit.
        </p>
      </Abschnitt>
    </div>
  );
}
