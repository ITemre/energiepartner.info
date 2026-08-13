import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { FOERDERHINWEIS, NAV_ITEMS, SITE, VERMITTLERHINWEIS } from "@/lib/site";

const LOGO_HEIGHT = 30;
const LOGO_WIDTH = Math.round(LOGO_HEIGHT * SITE.logo.ratio);

const LEGAL = [
  { label: "Impressum", href: "/impressum" },
  { label: "Datenschutz", href: "/datenschutz" },
] as const;

/** Footer-Link mit einlaufendem Akzent-Punkt (CI-Motiv) */
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 text-white/75 outline-none transition-colors hover:text-white focus-visible:text-white"
    >
      <span className="size-1.5 scale-0 rounded-full bg-ep-accent-strong opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100" />
      {children}
    </Link>
  );
}

/**
 * Kontakt + Footer.
 *
 * Zwei Änderungen gegenüber vorher:
 *
 * 1. `.ep-container` statt `max-w-[1240px] mx-auto`. Der Bereich war eines
 *    von drei Container-Systemen und begann auf 1920 px bei 373 px – über
 *    270 px weiter innen als die Sektionen darüber. Der Abschluss der Seite
 *    rückte dadurch sichtbar von der Kante weg, ohne dass es einen Grund
 *    dafür gab.
 *
 * 2. Kein radialer Verlauf und kein weichgezeichneter Lichtfleck mehr.
 *    Beides war das einzige Weiche auf einer sonst konsequent flachen
 *    Seite – und widersprach der eigenen CI-Regel „flaches Navy, kein
 *    Glow". Die Tiefe kommt jetzt aus derselben Skala wie im Hero: dieselbe
 *    Teilung, dieselbe Deckkraft. Anfang und Ende der Seite tragen damit
 *    dasselbe Muster, was den Bogen schließt.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    /* ⚠️ KEIN `id="kontakt"` MEHR (10.08.). Die Kennung liegt jetzt an der
       Kontaktsektion darüber (`sections/Kontakt.tsx`). Zwei Elemente mit
       derselben `id` sind ungültiges Markup, und der Menüpunkt „Kontakt"
       soll auf einen Kontaktbereich springen, nicht in die Fußzeile.

       Die Kontaktangaben bleiben hier trotzdem stehen: Sie gehören zu den
       Pflichtangaben eines Impressumsblocks und werden dort gesucht,
       unabhängig davon, wo der Menüpunkt hinführt. */
    <footer
      data-nav-theme="dark"
      data-surface="dark"
      className="relative overflow-hidden bg-ep-navy-deep text-white"
    >
      <div
        aria-hidden="true"
        className="ep-skala ep-skala-auslauf pointer-events-none absolute inset-0"
      />

      <div className="ep-container relative">
        {/* ===== Haupt-Grid ===== */}
        <div className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">
          {/* Marke */}
          <div>
            <Image
              src={SITE.logo.negativ}
              alt="energiepartner"
              width={LOGO_WIDTH}
              height={LOGO_HEIGHT}
              unoptimized
              className="h-[30px] w-auto"
            />
            {/* Nennt die drei Leistungen in der Reihenfolge des Briefings
                (Wärmepumpe zuerst) und trennt sauber, was uns auszeichnet:
                herstellerunabhängig = an keine Marke gebunden,
                anbieterübergreifend = wir vergleichen über die Anbieter
                hinweg. Das absolute „unabhängig" steht bewusst nirgends. */}
            {/* ⚠️ „Energieberatung aus Stuttgart" → „Energie-Vermittlung"
                (13.08.). Das Wort benannte die falsche Rolle: Ilias
                vermittelt und vergleicht, er ist kein Energieberater
                (Briefing 2). „Energieberatung" ist zudem der Begriff, den
                die Aufgabenliste des Briefings ausdrücklich am
                Google-Profil bemängelt („widerspricht der gesamten
                Website-Copy") – er stand hier also genau dort, wo er laut
                eigener Notiz nicht stehen darf.

                Der Rest des Absatzes bleibt unverändert:
                „herstellerunabhängig" und „anbieterübergreifend" sind die
                beiden ausdrücklich erlaubten Formulierungen. */}
            <p className="mt-6 max-w-[38ch] text-white/75">
              Energie-Vermittlung aus Stuttgart: Wärmepumpe, Photovoltaik und
              Stromtarif als ein abgestimmtes System. Herstellerunabhängig
              beraten, anbieterübergreifend verglichen.
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer-Navigation">
            <h3 className="t-label mb-6 text-white/75">Navigation</h3>
            <ul className="flex flex-col gap-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <FooterLink href={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Kontakt */}
          <div>
            <h3 className="t-label mb-6 text-white/75">Kontakt</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href={SITE.whatsapp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white/75 outline-none transition-colors hover:text-white focus-visible:text-white"
                >
                  <MessageCircle className="size-4 text-ep-accent" aria-hidden="true" />
                  WhatsApp: {SITE.whatsapp.display}
                </a>
              </li>
              <li>
                <a
                  href={SITE.phone.href}
                  className="inline-flex items-center gap-2 text-white/75 outline-none transition-colors hover:text-white focus-visible:text-white"
                >
                  <Phone className="size-4 text-ep-accent" aria-hidden="true" />
                  {SITE.phone.display}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Derselbe Hinweis wie in der Aufgabenteilung, hier als dauerhafte
            Angabe am Seitenende. Zwei Stellen, ein Wortlaut: Er kommt aus
            `VERMITTLERHINWEIS` und kann nicht auseinanderlaufen. */}
        <div className="border-t border-ep-line-dark pt-7">
          <p className="max-w-[76ch] text-sm leading-relaxed text-white/65">
            {VERMITTLERHINWEIS}
          </p>
          {/* ⚠️ SEIT 12.08. HIER STATT IN DER FÖRDERUNGS-SEKTION.
              Dort brachen fünf Zeilen Kleingedrucktes die Komposition. Weg
              darf der Vorbehalt trotzdem nicht: „Bis zu 70 Prozent" und
              „21.000 € im besten Fall" sind ohne Stichtag und ohne die
              Deckelung auf 30.000 € eine Zusage, die für die meisten Häuser
              nicht stimmt. Begründung ausführlich an `FOERDERHINWEIS`.

              Kleiner gesetzt als der Vermittlerhinweis, und das ist die
              richtige Rangfolge: Der eine legt ein Eigeninteresse offen und
              gehört gelesen, der andere präzisiert eine Zahl, die zwei
              Bildschirme weiter oben bereits hergeleitet wird. */}
          <p className="mt-4 max-w-[92ch] text-[13px] leading-snug text-white/45">
            {FOERDERHINWEIS}
          </p>
        </div>

        {/* ===== Bottom-Bar ===== */}
        <div className="mt-7 flex flex-col gap-4 border-t border-ep-line-dark py-7 text-sm text-white/65 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} energiepartner · Alle Rechte vorbehalten.</p>
          <ul className="flex items-center gap-6">
            {LEGAL.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="outline-none transition-colors hover:text-white focus-visible:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
