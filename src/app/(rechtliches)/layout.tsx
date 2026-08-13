import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SITE } from "@/lib/site";

const LOGO_H = 42;
const LOGO_W = Math.round(LOGO_H * SITE.logo.ratio);

/**
 * Layout für Impressum und Datenschutz.
 *
 * EIGENE ROUTE-GROUP, und das hat einen konkreten Grund: Beide Seiten
 * müssen unter BEIDEN Domains erreichbar sein – `src/proxy.ts` schreibt nur
 * die Wurzel um, alles andere liefert dieselbe Anwendung. Lägen sie in
 * `(energiepartner)`, bekäme ein Besucher von angebote-vergleichen.info hier
 * die Navigation des anderen Auftritts vorgesetzt und landete beim
 * Zurückklicken auf der falschen Domain.
 *
 * Deshalb: kein Menü, keine Sprungmarken, kein CTA. Eine Wortmarke, ein
 * Zurück, der Text. Rechtstexte sind der einzige Ort einer Website, an dem
 * niemand konvertiert werden soll.
 */
export default function RechtlichesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col bg-ep-paper">
      <header className="border-b border-ep-line">
        <div className="ep-container flex h-[var(--nav-h)] items-center justify-between gap-4">
          <Link
            href="/"
            aria-label="Zur Startseite"
            className="block rounded outline-none focus-visible:ring-2 focus-visible:ring-ep-accent-strong"
          >
            <Image
              src={SITE.logo.positiv}
              alt="energiepartner"
              width={LOGO_W}
              height={LOGO_H}
              unoptimized
              className="h-[26px] w-auto sm:h-[34px]"
            />
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ep-ink/75 outline-none transition-colors hover:text-ep-ink focus-visible:text-ep-ink"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Zurück
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-ep-line">
        <div className="ep-container flex flex-col gap-3 py-8 text-sm text-ep-ink/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} energiepartner</p>
          <ul className="flex items-center gap-6">
            <li>
              <Link
                href="/impressum"
                className="outline-none transition-colors hover:text-ep-ink focus-visible:text-ep-ink"
              >
                Impressum
              </Link>
            </li>
            <li>
              <Link
                href="/datenschutz"
                className="outline-none transition-colors hover:text-ep-ink focus-visible:text-ep-ink"
              >
                Datenschutz
              </Link>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
