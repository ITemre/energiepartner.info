import { Hero } from "@/components/sections/Hero";
import { ProofBar } from "@/components/sections/ProofBar";
import { Foerderung } from "@/components/sections/Foerderung";
import { FAQ } from "@/components/sections/FAQ";
import { Leistungen } from "@/components/sections/Leistungen";
import { Ablauf } from "@/components/sections/Ablauf";
import { Testimonials } from "@/components/sections/Testimonials";
import { Kontakt } from "@/components/sections/Kontakt";
import { holeGoogleBewertungen } from "@/lib/google-reviews";
import { holePlatzhalterStimmen } from "@/lib/stimmen-platzhalter";
import { holeKennzahlen } from "@/lib/proof";

/**
 * energiepartner.info = Unternehmensauftritt & Vertrauensaufbau, als Onepager.
 *
 * REIHENFOLGE (Stand 10.08., Emre)
 *
 *   Hero · Förderung · Testimonials · Leistungen · ProofBar · Ablauf
 *   · FAQ · Kontakt
 *
 * Acht Sektionen. Es waren vierzehn, und die sechs fehlenden sind der
 * eigentliche Punkt dieser Datei.
 *
 * ═══ WAS DIE SEITE LEISTEN MUSS ═══
 * Sie ist die VERTRAUENSSEITE. Anfragen erzeugt angebote-vergleichen.info,
 * hier soll jemand den Eindruck bekommen, dass er es mit einem seriösen
 * Vermittler zu tun hat. Daraus folgt der Maßstab für jede Sektion: Zahlt
 * sie auf Vertrauen ein, oder beschreibt sie nur noch einmal, was wir tun?
 *
 * ⚠️ BEIDE AUFTRITTE SIND GETRENNT UND SOLLEN ES BLEIBEN (Emre, 10.08.).
 * Von hier führt bewusst KEIN Verweis auf `/av`. Wer die Prüfstrecke sucht,
 * kommt per QR aus einem Brief oder aus einer Anzeige, nicht über diese
 * Seite. Deshalb ist `Zweitmeinung` raus und kommt nicht als Fuß- oder
 * Menüpunkt zurück.
 *
 * ═══ WAS RAUSGEFLOGEN IST (10.08., Kundenwunsch „kürzen") ═══
 *
 * GESAMTSYSTEM („Vier Bausteine. Ein System."). Emre ausdrücklich: zu viel,
 * stoppt den Scrollfluss. Sie war der Signature-Moment und gestalterisch
 * die stärkste Sektion der Seite – aber sie erklärt ein Produktkonzept, und
 * ein Produktkonzept ist kein Vertrauensargument. Vier gepinnte Bausteine
 * kosten mehr Scroll als jede andere Sektion außer der Galerie.
 *
 * SITUATIONEN („Wo stehen Sie gerade?"). Sagt dasselbe wie die Stichpunkte
 * unter den Leistungen, nur ausführlicher: „Wir prüfen, ob eine Wärmepumpe
 * in Ihr Haus passt" steht dort als „Ehrliche Prüfung, ob Ihr Haus geeignet
 * ist". Zwei Sektionen für eine Aussage.
 *
 * ERGEBNISSE („Das bekommen Sie schwarz auf weiß."). Die vier Punkte waren
 * fast wörtlich die Liste aus der Aufgabenteilung: Bestandsaufnahme,
 * Wirtschaftlichkeitsrechnung, Förderung. Dieselbe Aussage, zwei Bänder
 * weiter unten und ohne neuen Gedanken.
 *
 * REFERENZEN („Aus der Praxis"). Die Fälle sind erfunden (siehe
 * `lib/proof.ts`), Ilias hatte zum Zeitpunkt der Kürzung keinen einzigen
 * abgeschlossenen Kunden. Die Sektion rendert live ohnehin `null`. Sie hat
 * damit nur die Vorführung länger gemacht und dabei den falschen Eindruck
 * erweckt, es gäbe schon Fälle.
 *
 * AUFGABENTEILUNG („Sie entscheiden. Wir machen den Rest."). Dieselbe
 * Aussage wie der Ablauf, nur ohne Zeitachse. Acht Aufzählungspunkte, die
 * beschreiben was wir tun – das ist die Textsorte, von der die Seite zu
 * viel hatte.
 *
 * ZWEITMEINUNG („Dann sehen wir es uns an, bevor Sie unterschreiben.").
 * War die Tür zu `/av`. Die Auftritte bleiben getrennt, siehe oben.
 *
 * GALERIE (12.08.). Zuletzt nur noch der Porträt-Auftritt von Ilias über
 * eine halbe Bildschirmbreite; die Bildstrecke davor war schon vorher
 * aufgelöst und liegt als Hintergrund hinter den Leistungskarten. Emre hat
 * die Sektion komplett gestrichen.
 *
 * ⚠️ Damit steht auf der Seite kein Foto und kein Name von Ilias mehr –
 * auf einer VERTRAUENSSEITE ist das die auffälligste Lücke von allen. Die
 * Kontaktsektion nennt ihn noch als Ansprechpartner, aber ohne Gesicht.
 * `Galerie.tsx` liegt unverändert bereit, falls das zurückkommen soll.
 *
 * ⚠️ Alle sechs Dateien liegen weiter unter `components/sections/` und sind
 * nur ausgehängt, nicht gelöscht – dieselbe Konvention wie auf `/av`. Wenn
 * echte Referenzfälle vorliegen, ist `Referenzen` die erste, die
 * zurückkommt.
 *
 * ═══ BANDRHYTHMUS ═══
 * Zwei Flächen, Navy und Papier. Navy sind Hero, Leistungen, ProofBar,
 * Ablauf und FAQ; alles andere ist Papier.
 *
 * ⚠️ OFFEN: ProofBar, Ablauf und FAQ stehen jetzt als drei dunkle Bänder
 * hintereinander, das letzte Drittel der Seite ist damit durchgehend Navy.
 * Die Nuancen wechseln (navy · navy-deep · navy) und beide Nähte tragen
 * eine Sonnenlinie, aber sauber ist das nicht. Der nächste Schnitt gehört
 * an die ProofBar: Ihre Kennzahlen sind Platzhalter, und die Bewertung
 * zeigt zwei Bänder weiter oben schon die Stimmen-Sektion.
 */
export default async function Home() {
  /* Serverseitig, damit der Places-Schlüssel den Server nie verlässt. Der
     Abruf ist zwischengespeichert (sechs Stunden) und darf ausfallen.

     Echte Daten haben immer Vorrang. Der Rückfall greift nur, wenn Google
     nichts liefert UND die Umgebung ihn ausdrücklich erlaubt (siehe
     `stimmen-platzhalter.ts`) – auf dem Livesystem also nie. Bleiben beide
     leer, zeigen Hero und Stimmen keine Bewertungsaussage. */
  /* ⚠️ 13.08.: Reihenfolge umgedreht — solange `PLATZHALTER_AN` steht, haben
     die vorläufigen Stimmen VORRANG vor Google. Grund: Das Profil ist frisch,
     die Places-Abfrage liefert entweder nichts oder eine einzelne ausstehende
     Rezension, und in der Vorführung soll die Sektion vollständig aussehen.
     Sobald der Schalter fällt, gewinnt Google wieder automatisch. */
  const bewertungen = holePlatzhalterStimmen() ?? (await holeGoogleBewertungen());

  /* Die Kennzahlen sind vorläufig und hängen an derselben Sperre wie die
     Stimmen (`PLATZHALTER_INHALTE`, siehe `lib/proof.ts`). Ohne sie liefert
     die Funktion `null`, und die Belegzeile entfällt ersatzlos statt leer
     dazustehen.

     `holeReferenzfaelle` wird hier nicht mehr aufgerufen: Die Sektion ist
     ausgehängt (siehe Kopfkommentar). Die Funktion bleibt in `proof.ts`
     stehen, weil sie beim Wiedereinhängen unverändert gebraucht wird. */
  const kennzahlen = holeKennzahlen();

  return (
    <main className="flex-1">
      {/* ============ HERO – „Ihre Energie. Ihr Vorteil." ============ */}
      {/* Liegt sticky auf z-0 und bleibt stehen, während sich alles Weitere
          darüberschiebt. Erst dadurch wird sein Zoom-out beim Rausscrollen
          überhaupt sichtbar – ohne etwas, das davorzieht, fehlt dem Auge die
          Bezugskante. */}
      <Hero bewertungen={bewertungen} />

      {/* Der komplette Rest fährt als eine Ebene über den Hero. Wichtig:
          auf diesem Wrapper niemals transform/filter setzen – das würde den
          Pin der Galerie- und Gesamtsystem-Szenen (position: fixed) außer
          Kraft setzen. */}
      {/* `bg-ep-paper` ist Pflicht, nicht Kosmetik: Sektionen, die beim
          Reinscrollen aus einer eingerückten Fläche aufwachsen, geben an den
          Seiten kurz den Untergrund frei. Ohne diesen Grund läge dort der
          sticky Hero – navy blitzt neben Papier auf. */}
      <div className="relative z-10 bg-ep-paper">
        {/* ====== FÖRDERUNG – der größte Einwand, direkt hinter dem Hero ======
            Die Sektion stand vorher an sechster Stelle, hinter Ausgangslagen,
            Signature, Leistungen und der Bildstrecke. Damit lag das stärkste
            Argument dieses Geschäfts – Geld, das jemand anderes zahlt – hinter
            dem längsten Teil der Seite.

            „Zu teuer" ist der Grund, an dem eine Wärmepumpe scheitert, und er
            steht schon im Kopf, bevor der Besucher die erste Sektion gelesen
            hat. Eine Antwort darauf gehört an die Stelle, an der der Einwand
            entsteht, nicht ans Ende der Argumentation.

            Die Akzentkante an der Oberkante der Sektion (`border-t-2
            border-ep-accent`) übernimmt hier zusätzlich die Aufgabe, die
            vorher die ProofBar hatte: Sie ist die sichtbare Kante, gegen die
            der Zoom des sticky Heros überhaupt erst wahrnehmbar wird. */}
        <Foerderung />

        {/* ============ STIMMEN – Google-Rezensionen ============
            Die einzige Sektion, deren Aussage nicht von uns stammt. Steht
            deshalb vorn und nicht am Ende, wo sie nur noch die erreicht,
            die ohnehin überzeugt waren.

            Sie verträgt die Position auch formal: Die mittige Komposition
            ohne Kennspur hebt sie aus der Datenblatt-Achse heraus, deshalb
            liest sie sich zwischen zwei Papierbändern trotzdem als eigener
            Abschnitt (siehe Kommentar in `Testimonials.tsx`). */}
        <Testimonials bewertungen={bewertungen} />

        {/* ====== LEISTUNGEN – Wärmepumpe, Photovoltaik, Stromtarif ======
            Trägt seit der Kürzung allein, wofür vorher drei Sektionen
            standen: was es gibt, für wen es passt, was dabei herauskommt.
            Die Stichpunkte je Bereich („Ehrliche Prüfung, ob Ihr Haus
            geeignet ist", „Ertrag und Wirtschaftlichkeit vorab gerechnet")
            sagen das bereits. */}
        <Leistungen />


        {/* ====== BELEG – Zahlen und Bewertung ======
            Steht nach der Bildstrecke, wo vorher die Förderung lag: Der
            Besucher hat jetzt Angebot, Lage, System, Leistungen und Anlagen
            gesehen – die Frage „stimmt das alles auch?" ist an dieser Stelle
            offen, und das Band beantwortet sie mit Zahlen und der Bewertung.

            Nebenbei bricht es die drei hellen Bänder auf, die sonst
            hintereinanderstünden (Galerie, Aufgabenteilung, Ablauf). */}
        <ProofBar kennzahlen={kennzahlen} bewertungen={bewertungen} />

        {/* ====== NACH DER UNTERSCHRIFT – der Weg bis zur Abnahme ======
            Die einzige Sektion, die nicht beschreibt was wir können, sondern
            was passiert, nachdem der Besucher etwas zu verlieren hat. Genau
            deshalb hat sie die Aufgabenteilung überlebt und die nicht: Beide
            sagten „wir machen das", diese sagt zusätzlich wann und in
            welcher Reihenfolge. */}
        <Ablauf />

        {/* ====== EINWÄNDE – was zwischen Lesen und Anrufen steht ====== */}
        <FAQ />

        {/* ====== KONTAKT – der einzige Handlungsort neben dem Hero ======
            Neu am 10.08. `#kontakt` zeigte vorher auf den Footer, wo
            WhatsApp und Telefon als zwei kleine Fußzeilen-Links standen.
            Gleichzeitig lagen Knöpfe über die Seite verstreut, unter
            anderem mitten in der Förderung.

            Beides ist zusammen aufgelöst: keine Knöpfe im
            Argumentationsteil, dafür ein richtiger Kontaktbereich am Ende.
            Das ist die Form, die eine Vertrauensseite hat – eine
            Landingpage verteilt Handlungsaufforderungen, ein
            Unternehmensauftritt hat einen Ort dafür. */}
        <Kontakt />
      </div>
    </main>
  );
}
