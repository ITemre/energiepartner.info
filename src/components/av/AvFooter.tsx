import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { SITE, VERMITTLERHINWEIS } from "@/lib/site";
import { AvWortmarke } from "@/components/av/AvWortmarke";

const LOGO_HEIGHT = 30;
const LOGO_WIDTH = Math.round(LOGO_HEIGHT * SITE.logo.ratio);

const LEGAL = [
  { label: "Impressum", href: "/impressum" },
  { label: "Datenschutz", href: "/datenschutz" },
] as const;

/**
 * Footer von angebote-vergleichen.info – bewusst schmaler als der auf
 * energiepartner.info.
 *
 * Dort ist der Footer selbst eine Sektion („Kontakt"), hier steht der
 * Kontakt schon über die ganze Seite verteilt. Was hier bleiben MUSS, ist
 * das Pflichtprogramm: Absender, Vermittlerhinweis, Impressum, Datenschutz.
 *
 * Der Vermittlerhinweis steht auf dieser Seite mit besonderem Gewicht: Wir
 * prüfen ein fremdes Angebot und bieten anschließend ein eigenes an. Wer
 * das erst im Impressum erfährt, liest die Prüfung rückwirkend als
 * Verkaufsgespräch. Deshalb dieselbe Formulierung wie auf der Hauptseite,
 * aus `VERMITTLERHINWEIS`, und nicht kleiner gesetzt als der Rest.
 */
export function AvFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      data-nav-theme="dark"
      data-surface="dark"
      className="relative overflow-hidden bg-ep-navy-deep text-white"
    >
      <div
        aria-hidden="true"
        className="ep-skala ep-skala-auslauf pointer-events-none absolute inset-0"
      />

      <div className="ep-container relative py-14">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {/* Die eigene Marke oben, das Absender-Logo darunter – dieselbe
                Ordnung wie in der Kopfleiste. Im Footer steht das
                energiepartner-Logo aber als BILD und nicht nur als Wort:
                Hier endet die Seite, hier stehen Impressum und
                Vermittlerhinweis, und hier gehört der Betreiber sichtbar
                hin. Wer eine Datei hochlädt, darf nachsehen können, wem er
                sie gegeben hat. */}
            <AvWortmarke />

            <p className="mt-6 max-w-[42ch] text-white/75">
              Angebotsprüfung für Wärmepumpe und Photovoltaik. Ein Angebot
              vorlegen, erfahren was fehlt, in Ruhe entscheiden.
            </p>

            <div className="mt-7 border-t border-ep-line-dark pt-6">
              <p className="t-key mb-3 text-white/50">Betrieben von</p>
              <Image
                src={SITE.logo.negativ}
                alt="energiepartner"
                width={LOGO_WIDTH}
                height={LOGO_HEIGHT}
                unoptimized
                className="h-[26px] w-auto"
              />
            </div>
          </div>

          <ul className="flex flex-col gap-3">
            <li>
              <a
                href={SITE.whatsapp.angebotHref}
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

        <p className="mt-12 max-w-[76ch] border-t border-ep-line-dark pt-7 text-sm leading-relaxed text-white/65">
          {VERMITTLERHINWEIS}
        </p>

        <div className="mt-7 flex flex-col gap-4 border-t border-ep-line-dark pt-7 text-sm text-white/65 sm:flex-row sm:items-center sm:justify-between">
          {/* Der Betreiber steht im Copyright, nicht die Domain – rechtlich
              haftet energiepartner, nicht ein Seitenname. */}
          <p>© {year} energiepartner · angebote-vergleichen.info</p>
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
