/**
 * energiepartner · zentrale Seiten-Konfiguration
 * Single Source of Truth für Navigation & Kontaktwege.
 * Tonalität: „wir“, durchgehend siezen (CI 05).
 */

/* ⚠️ „Energieberatung" → „Beratung" (13.08.). Der Satz ist das, was der
   INTERESSENT schickt – wir haben ihm damit die falsche Rolle in den Mund
   gelegt: Ilias vermittelt und vergleicht, er ist kein Energieberater
   (Briefing 2). „Beratung" als Tätigkeit bleibt richtig und steht so auch
   im Impressum („Wir beraten herstellerunabhängig […] und vermitteln die
   Ausführung"); falsch war allein das Kompositum, weil es einen Berufsstand
   benennt statt einer Leistung. */
const WHATSAPP_TEXT =
  "Hallo, ich interessiere mich für eine kostenlose Beratung.";

/**
 * Eigener Einstiegstext für angebote-vergleichen.info.
 *
 * Der Anlass ist dort ein anderer: Der Besucher hat bereits ein Angebot und
 * will wissen, ob etwas fehlt. Käme er mit „ich interessiere mich für eine
 * Beratung" an, müsste Ilias die Hälfte des Gesprächs damit verbringen,
 * herauszufinden, worum es überhaupt geht.
 *
 * Der Satz nennt außerdem gleich die Handlung („schicke Ihnen mein Angebot"),
 * damit der Nutzer im geöffneten Chat weiß, was er als Nächstes tut. Ein
 * Chatfenster ohne Anweisung ist derselbe Abbruchpunkt wie ein leeres
 * Formular.
 */
const WHATSAPP_TEXT_ANGEBOT =
  "Hallo, ich schicke Ihnen mein Wärmepumpen-Angebot zur Prüfung.";

export const SITE = {
  name: "energiepartner",
  whatsapp: {
    /** internationales Format ohne + und Leerzeichen für wa.me */
    number: "491736834665",
    display: "0173 6834665",
    href: `https://wa.me/491736834665?text=${encodeURIComponent(WHATSAPP_TEXT)}`,
    /** Für angebote-vergleichen.info – an `WhatsAppButton` als `href`
     *  durchreichen, der Spread der Props gewinnt gegen die Vorgabe. */
    angebotHref: `https://wa.me/491736834665?text=${encodeURIComponent(WHATSAPP_TEXT_ANGEBOT)}`,
  },
  phone: {
    display: "0173 6834665",
    href: "tel:+491736834665",
  },
  /** Ansprechpartner, der auf der Kontaktseite genannt wird. */
  ansprechpartner: "Ilias Zayakh",
  /* ⚠️ PLATZHALTER (13.08.), von Ilias abzunehmen. Emre nannte „9–17 Uhr"
     nur als Beispiel, keine bestätigte Angabe – deshalb im Markup über
     `<Fehlt>` (aus `components/rechtliches/Rechtstext`) sichtbar markiert,
     nicht als stiller Fakt gerendert. Vor Livegang: echte Zeiten eintragen
     UND den `<Fehlt>`-Wrapper an der Fundstelle entfernen. */
  oeffnungszeiten: {
    tage: "Mo. – Fr.",
    zeit: "9 – 17 Uhr",
  },
  logo: {
    /** weiße Wortmarke + Sonnen-Punkt – für dunkle Flächen/Fotos */
    negativ: "/energiepartner_Logo-Mappe/SVG/02_horizontal_negativ.svg",
    /** dunkle Wortmarke – für helle Flächen */
    positiv: "/energiepartner_Logo-Mappe/SVG/01_horizontal_positiv.svg",
    /** natives Seitenverhältnis der horizontalen Wortmarke */
    ratio: 1612.6 / 323,
  },
} as const;

/**
 * Vorbehalt zu den Förderzahlen.
 *
 * Stand 12.08. im Footer statt in der Förderungs-Sektion: Dort brach der
 * fünfzeilige Block die Komposition, und eine Vertrauensseite soll nicht
 * aussehen wie ein Vertragswerk.
 *
 * ⚠️ ER MUSS ABER IRGENDWO STEHEN. „Bis zu 70 %" ist nur belegbar, solange
 * die Herleitung (die vier Bausteine in der Sektion) UND der Bezug sichtbar
 * sind: welcher Stand, worauf gedeckelt, wovon abhängig. Ohne das ist es
 * eine Zusage, die für die meisten Häuser nicht stimmt – und
 * Förderangaben veralten zusätzlich, eine ohne Datum ist in zwölf Monaten
 * schlicht falsch.
 *
 * ⚠️ VOR DEM LIVEGANG: Sätze und Stichtag gegen die dann gültige Richtlinie
 * prüfen. Das ist die einzige Angabe der Seite, die von allein veraltet.
 */
export const FOERDERHINWEIS =
  "Sätze der Bundesförderung für effiziente Gebäude (Einzelmaßnahmen), Stand 2026. " +
  "Grundförderung und Boni sind zusammen auf 70 % der förderfähigen Kosten begrenzt, " +
  "diese wiederum auf 30.000 € für die erste Wohneinheit. Ob und in welcher Höhe ein " +
  "Bonus für Sie gilt, hängt von Gebäude, Nutzung und Haushaltseinkommen ab und wird " +
  "individuell geprüft.";

/**
 * Transparenter Vermittlerhinweis. Wortlaut aus dem Projekt-Briefing
 * (Abschnitt 2) und nicht frei formulierbar.
 *
 * Warum er überhaupt da sein muss: Ilias vermittelt und vergleicht, er baut
 * nicht selbst, und er verdient an der erfolgreichen Vermittlung. Genau
 * deshalb darf die Seite nicht „unabhängig" oder „ohne Eigeninteresse"
 * behaupten – sie sagt stattdessen offen, wie das Geschäft funktioniert.
 * „Herstellerunabhängig" bleibt zulässig: Es beschreibt nur, dass wir an
 * keine Marke gebunden sind.
 *
 * Ein offengelegtes Eigeninteresse kostet keine Glaubwürdigkeit, es schafft
 * sie – vorausgesetzt, es steht dort, wo entschieden wird, und nicht im
 * Kleingedruckten.
 */
export const VERMITTLERHINWEIS =
  "Bei erfolgreicher Vermittlung können wir eine Vergütung vom ausführenden Unternehmen erhalten. Ihre Entscheidung bleibt davon unberührt.";

/*
 * HIER STAND `BEWERTUNGEN_ECHT` – ein Handschalter, der alle
 * Google-Claims (Sterne, Note, Zitate) freigab.
 *
 * Er ist ersatzlos entfallen, weil die Frage „haben wir echte Bewertungen?"
 * jetzt die Datenlage selbst beantwortet: `lib/google-reviews.ts` holt Note
 * und Rezensionen live aus dem Unternehmensprofil und liefert `null`, solange
 * es dort nichts gibt. Hero und Stimmen zeigen dann keine Bewertungsaussage.
 *
 * Der Schalter hatte genau die Schwäche, die solche Schalter immer haben: Er
 * musste beim Livegang von Hand umgelegt werden, und die Aussage steht an
 * mehreren Stellen. Ein vergessener Schalter hätte hier keine Kleinigkeit
 * bedeutet, sondern eine erfundene Bewertungsangabe – der Klassiker unter den
 * UWG-Abmahnungen (§ 5 Abs. 1, dazu § 5b Abs. 3 zur Echtheitsprüfung).
 */

export type NavItem = {
  label: string;
  href: string;
};

/**
 * Hauptnavigation. energiepartner.info ist ein Onepager (Angebot AG0025:
 * eine Seite je Domain, dazu Impressum und Datenschutz) – jeder Punkt ist
 * deshalb ein Sprung zu einer Sektion, keine eigene Route.
 *
 * Jeder Punkt beantwortet genau eine Besucherfrage:
 *   Förderung  → Was zahle ich am Ende wirklich?
 *   Stimmen    → Wem habt ihr schon geholfen?
 *   Service    → Was macht ihr?
 *   Ablauf     → Was passiert nach der Unterschrift?
 *   Kontakt    → Wie erreiche ich euch?
 *
 * Die Wörter sind nicht frei gewählt, sondern stammen aus den Sektionen
 * selbst – jedes ist dort der Eyebrow oder die Überschrift.
 *
 * ═══ WAS SICH GEÄNDERT HAT (07.08.) ═══
 * „System" (#gesamtsystem) ist raus, „Förderung" und „Ablauf" sind neu.
 * Die alte Leiste stammte aus der Zeit, als es diese Sektionen noch nicht
 * gab – ausgerechnet die Förderung, das stärkste Argument des Geschäfts,
 * war über die Kopfleiste nicht erreichbar. „System" beantwortet dagegen
 * eine Detailfrage, keine Navigationsfrage: Wer wissen will, wie die vier
 * Bausteine zusammenhängen, scrollt ohnehin.
 *
 * ⚠️ NUR ANKER, DIE IMMER EXISTIEREN. `#referenzfaelle` steht bewusst nicht
 * hier: Die Sektion rendert `null`, solange keine belegbaren Fälle
 * vorliegen (siehe `lib/proof.ts`), und ein Menüpunkt, der ins Leere
 * springt, ist schlimmer als ein fehlender. Sobald echte Referenzen da
 * sind, kann er dazu – dann aber zusammen mit der Entscheidung, welcher
 * andere Punkt dafür weicht. Fünf sind das Maximum, das die mittige Leiste
 * am lg-Breakpoint ruhig trägt.
 */
export const NAV_ITEMS: readonly NavItem[] = [
  /* ⚠️ DIE LEISTE STEHT IN SEITENREIHENFOLGE, nicht in Wichtigkeit.
     Förderung und Stimmen liegen seit 07.08. vor dem Leistungsstapel, also
     stehen sie auch hier vorn. Andersherum sprünge „Service" nach unten und
     „Stimmen" wieder hinauf – eine Leiste, deren Reihenfolge nicht der
     Seite entspricht, liest sich als Fehler, nicht als Gewichtung.
     Wer Sektionen umstellt, stellt hier mit um. */
  { label: "Förderung", href: "/#foerderung" },
  { label: "Stimmen", href: "/#referenzen" },
  { label: "Service", href: "/#leistungen" },
  { label: "Ablauf", href: "/#ablauf" },
  { label: "Kontakt", href: "/#kontakt" },
] as const;

/* =========================================================
   angebote-vergleichen.info
   ---------------------------------------------------------
   Zweite Domain, gleiche Codebasis. Die Aufgabentrennung steht im
   Projekt-Briefing Abschnitt 3: energiepartner.info baut Vertrauen auf,
   angebote-vergleichen.info erzeugt Anfragen (technische Zweitmeinung).
   ========================================================= */

/** Host, für den die Middleware `/` auf `/av` umschreibt. Mit und ohne
 *  www, weil beide Schreibweisen im Umlauf sind (QR-Code, Anzeigen). */
export const AV_HOSTS = [
  "angebote-vergleichen.info",
  "www.angebote-vergleichen.info",
] as const;

/** Interner Pfad der AV-Seite. Auf der eigenen Domain liegt sie auf `/`
 *  (Rewrite), lokal und auf energiepartner.info ist sie hierüber direkt
 *  erreichbar – genau das brauchen wir für Demo und Verlinkung, ohne an
 *  der Hosts-Datei zu drehen. */
export const AV_PFAD = "/av";

/**
 * Ziel des Verweises von energiepartner.info auf die Prüfstrecke.
 *
 * Voreinstellung ist der interne Pfad, damit lokal und in der Vorschau
 * alles ohne DNS funktioniert. Sobald die Domain live ist, gehört
 * `NEXT_PUBLIC_AV_URL=https://angebote-vergleichen.info` in die
 * Umgebungsvariablen – dann zeigt der Verweis dorthin, wo die Seite
 * inhaltlich hingehört, statt sie unter der falschen Domain zu spiegeln.
 */
export const AV_URL = process.env.NEXT_PUBLIC_AV_URL || AV_PFAD;
