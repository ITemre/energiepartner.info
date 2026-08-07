import { Hero } from "@/components/sections/Hero";
import { ProofBar } from "@/components/sections/ProofBar";
import { Situationen } from "@/components/sections/Situationen";
import { Foerderung } from "@/components/sections/Foerderung";
import { Referenzen } from "@/components/sections/Referenzen";
import { FAQ } from "@/components/sections/FAQ";
import { Gesamtsystem } from "@/components/sections/Gesamtsystem";
import { Leistungen } from "@/components/sections/Leistungen";
import { Galerie } from "@/components/sections/Galerie";
import { Aufgabenteilung } from "@/components/sections/Aufgabenteilung";
import { Ablauf } from "@/components/sections/Ablauf";
import { Zweitmeinung } from "@/components/sections/Zweitmeinung";
import { Testimonials } from "@/components/sections/Testimonials";
import { Ergebnisse } from "@/components/sections/Ergebnisse";
import { holeGoogleBewertungen } from "@/lib/google-reviews";
import { holePlatzhalterStimmen } from "@/lib/stimmen-platzhalter";
import { holeKennzahlen, holeReferenzfaelle } from "@/lib/proof";

/**
 * energiepartner.info = Unternehmensauftritt & Vertrauensaufbau, als Onepager.
 *
 * REIHENFOLGE (Stand 07.08., Emre)
 *
 *   Hero · Förderung · Testimonials · Gesamtsystem · Leistungen
 *   · Situationen · Galerie · ProofBar · Aufgabenteilung · Ablauf
 *   · Referenzen · FAQ · Zweitmeinung · Ergebnisse
 *
 * Drei Umstellungen führten hierher, alle mit demselben Gedanken: Was den
 * Besucher zum Bleiben bringt, steht vorn – nicht das, was die Reihenfolge
 * einer Argumentation nahelegt.
 *
 * FÖRDERUNG ↔ PROOFBAR. „Bis zu 70 Prozent zahlt nicht Ihr Haushalt." ist
 * die Antwort auf den einzigen Einwand, der schon im Kopf steht, bevor die
 * Seite überhaupt argumentiert hat – die Sektion lag an sechster Stelle.
 * Die Belegzeile verträgt die spätere Position dagegen gut: Sie beantwortet
 * keine Frage, sie deckt Behauptungen, und Behauptungen müssen erst einmal
 * aufgestellt sein.
 *
 * TESTIMONIALS NACH VORN. Die Stimmen standen an elfter Stelle und
 * erreichten damit nur die, die ohnehin schon überzeugt waren. Sie sind die
 * einzige Aussage der Seite, die nicht von uns stammt – das ist zu wertvoll
 * für Position elf. Jetzt stehen sie hinter der Förderung und vor „Ihr
 * Eigenheim".
 *
 * SITUATIONEN HINTER DIE LEISTUNGEN. „Wo stehen Sie gerade?" war der
 * Einstieg und ist jetzt die Zuordnung: erst was es gibt, dann welche der
 * vier Lagen die eigene ist. Der Signature-Moment („Vier Bausteine. Ein
 * System.") steht damit direkt hinter der Förderung – er beantwortet dort
 * die Frage, die eine Zahl immer aufwirft: wofür genau eigentlich.
 *
 * BANDRHYTHMUS – nur zwei Flächen, Navy und Papier. Vorher liefen drei
 * Helligkeiten (Papier, Sand, Weiß) gegeneinander, die sich zu ähnlich waren,
 * um als Wechsel gelesen zu werden, und zu verschieden, um als eine Fläche
 * durchzugehen. Navy sind Hero, Leistungen und ProofBar; alles andere ist
 * Papier.
 *
 * Die Angebotsprüf-Story (ZahlSequenz, Ablauf-Chat) gehört auf
 * angebote-vergleichen.info und liegt dafür im Original-Repo.
 */
export default async function Home() {
  /* Serverseitig, damit der Places-Schlüssel den Server nie verlässt. Der
     Abruf ist zwischengespeichert (sechs Stunden) und darf ausfallen.

     Echte Daten haben immer Vorrang. Der Rückfall greift nur, wenn Google
     nichts liefert UND die Umgebung ihn ausdrücklich erlaubt (siehe
     `stimmen-platzhalter.ts`) – auf dem Livesystem also nie. Bleiben beide
     leer, zeigen Hero und Stimmen keine Bewertungsaussage. */
  const bewertungen = (await holeGoogleBewertungen()) ?? holePlatzhalterStimmen();

  /* Kennzahlen und Referenzfälle sind derzeit vorläufig und hängen an
     derselben Sperre wie die Stimmen (`PLATZHALTER_INHALTE`, siehe
     `lib/proof.ts`). Ohne sie liefern beide `null`, und die zugehörigen
     Sektionen entfallen ersatzlos statt leer dazustehen. */
  const kennzahlen = holeKennzahlen();
  const referenzfaelle = holeReferenzfaelle();

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

            Die Sonnenkante an der Oberkante der Sektion (`border-t-2
            border-ep-sun`) übernimmt hier zusätzlich die Aufgabe, die vorher
            die ProofBar hatte: Sie ist die sichtbare Kante, gegen die der
            Zoom des sticky Heros überhaupt erst wahrnehmbar wird. */}
        <Foerderung />

        {/* ============ STIMMEN – Google-Rezensionen ============
            Steht seit 07.08. vorn, direkt hinter der Förderung und vor „Ihr
            Eigenheim". Die einzige Sektion der Seite, deren Aussage nicht von
            uns stammt – und sie stand bisher an elfter Stelle, wo sie nur
            noch die erreicht, die ohnehin schon überzeugt waren.

            Sie verträgt die Position auch formal: Die mittige Komposition
            ohne Kennspur hebt sie aus der Datenblatt-Achse heraus, deshalb
            liest sie sich zwischen zwei Papierbändern trotzdem als eigener
            Abschnitt (siehe Kommentar in `Testimonials.tsx`). */}
        <Testimonials bewertungen={bewertungen} />

        {/* ============ SIGNATURE – vier Zeilen, zweimal gelesen ============ */}
        <Gesamtsystem />

        {/* ====== LEISTUNGEN – Wärmepumpe, Photovoltaik, Stromtarif ====== */}
        <Leistungen />

        {/* ====== AUSGANGSLAGE – „Wo stehen Sie gerade?" ======
            Steht hinter den Leistungen, nicht davor (Emre, 07.08.). Der
            Besucher weiß jetzt, was es gibt – die Sektion holt ihn genau an
            der Stelle ab, an der die Frage „und was davon gilt für mich?"
            aufkommt, und beantwortet sie mit vier Sätzen, in denen er sich
            wiedererkennt.

            ⚠️ Sie ist damit nicht mehr der Einstieg. Wer ihre Copy anfasst,
            muss sie nicht mehr als erste Begegnung mit dem Haus lesen,
            sondern als Zuordnung: Vier Lagen, und für jede steht schon
            oben, was wir dafür bauen. */}
        <Situationen />

        {/* ============ GALERIE – die Anlagen, dann der Mensch ============ */}
        <Galerie />

        {/* ====== BELEG – Zahlen und Bewertung ======
            Steht nach der Bildstrecke, wo vorher die Förderung lag: Der
            Besucher hat jetzt Angebot, Lage, System, Leistungen und Anlagen
            gesehen – die Frage „stimmt das alles auch?" ist an dieser Stelle
            offen, und das Band beantwortet sie mit Zahlen und der Bewertung.

            Nebenbei bricht es die drei hellen Bänder auf, die sonst
            hintereinanderstünden (Galerie, Aufgabenteilung, Ablauf). */}
        <ProofBar kennzahlen={kennzahlen} bewertungen={bewertungen} />

        {/* ============ VORTEIL – Entlastung: 3 Aufgaben gegen 8 ============ */}
        <Aufgabenteilung />

        {/* ====== NACH DER UNTERSCHRIFT – der Weg bis zur Abnahme ======
            Steht direkt hinter der Aufgabenteilung, weil die dort mit „wir
            machen den Rest" endet: erst die Behauptung, dann der Beleg.
            Vorher hörte die Seite beim Ergebnis der kostenlosen Beratung auf
            – also genau an der Stelle, an der der Besucher zum ersten Mal
            etwas zu verlieren hat. */}
        <Ablauf />

        {/* ====== AUS DER PRAXIS – die einzige Sektion, die nicht über uns spricht ======
            Ausgangslage, Befund, Ergebnis in Zahlen. Steht nach dem Ablauf:
            erst wie wir arbeiten, dann was dabei herauskam. */}
        <Referenzen faelle={referenzfaelle} />

        {/* ====== EINWÄNDE – was zwischen Lesen und Anrufen steht ====== */}
        <FAQ />

        {/* ====== BRÜCKE – Sie haben schon ein Angebot? ======
            Kurzes Band, kein zweiter Longread: Die Prüf-Story gehört auf
            angebote-vergleichen.info, hier steht nur die Tür dorthin.
            Hinter der FAQ, weil dort ohnehin danach gefragt wird. */}
        <Zweitmeinung />

        {/* ============ ERGEBNIS – was schwarz auf weiß vorliegt ============ */}
        <Ergebnisse />
      </div>
    </main>
  );
}
