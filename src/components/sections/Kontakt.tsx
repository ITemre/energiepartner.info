"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Clock, Phone, User } from "lucide-react";
import { SITE } from "@/lib/site";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { Fehlt } from "@/components/rechtliches/Rechtstext";
import { KontaktFormular } from "@/components/sections/KontaktFormular";
import { maskedHeadline, revealItems } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * Der Kontaktbereich.
 *
 * WARUM ES DIESE SEKTION GIBT (10.08.) * Es gab sie nicht. `#kontakt` zeigte auf den Footer, und dort standen
 * WhatsApp und Telefonnummer als zwei kleine Fußzeilen-Links zwischen
 * Navigation und Impressum. Ein Menüpunkt „Kontakt", der in einer Fußzeile
 * endet, ist kein Kontaktbereich, sondern eine Sprungmarke ins Kleingedruckte.
 *
 * ZWEITER ANLAUF (13.08., Kundenwunsch) * „Wie eine normale Firmen-Kontaktseite." Eine Anfahrt gibt es nicht – Ilias
 * vermittelt, es gibt kein Ladengeschäft, zu dem man fährt –, aber alles
 * andere, was eine solche Seite hat, jetzt schon:
 *
 *   LINKS   wie man uns erreicht – Ansprechpartner, Öffnungszeiten, Telefon
 *   RECHTS  ein echtes Kontaktformular, direkt ausfüllbar
 *
 * Vorher stand hier ein Knopf, der `AnfrageDialog` öffnete. Das ist als
 * EINSTIEG von einer Landingpage aus richtig (siehe dessen Kopfkommentar),
 * aber falsch für eine Sektion, die sich selbst „Kontakt" nennt: Wer den
 * Menüpunkt „Kontakt" anklickt, erwartet ein Formular an dieser Stelle, kein
 * weiteres Fenster, das sich darüber legt. Das eigentliche Formular steht
 * jetzt in `KontaktFormular` – eigene Datei, weil es mit ~250 Zeilen für
 * eine Unterkomponente dieser Sektion zu groß wäre.
 *
 * WHATSAPP BLEIBT DER ZWEITE WEG, NICHT DER ERSTE * „Wir wollen die Leute letztendlich auf WhatsApp bekommen" (Kunde, 10.08.)
 * galt für die vorherige Fassung mit zwei gleichrangigen Knöpfen. Mit einem
 * echten Formular an dieser Stelle kehrt sich die Reihenfolge um: Wer schon
 * dabei ist, ein Formular auszufüllen, soll es zu Ende bringen können, nicht
 * mitten drin zu einem zweiten Kanal abspringen. WhatsApp steht deshalb
 * UNTER dem Formular als ausdrücklich schnellerer Weg für alle, die lieber
 * direkt schreiben – Kundenwunsch (13.08.): „Formular, drunter der Knopf."
 */
export function Kontakt() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        revealItems("[data-k-block]", { distance: 22, start: "top 90%" });

        return maskedHeadline({
          headline: "[data-k-h2]",
          follow: "[data-k-eyebrow]",
          scrollTrigger: { trigger: scope.current, start: "top 80%", once: true },
        });
      });
    },
    { scope },
  );

  return (
    /* Papier zwischen FAQ und Footer, die beide dunkel sind. Das ist nicht
       nur Rhythmus: Der Kontaktbereich ist die letzte Fläche, auf der etwas
       passieren soll, und eine helle Fläche zwischen zwei dunklen ist die
       auffälligste Stelle der ganzen Seite, ohne dass ein einziges Element
       lauter werden muss.

       `id="kontakt"` liegt seit dem 10.08. HIER und nicht mehr am Footer –
       zwei Elemente mit derselben Kennung wären ungültiges Markup, und der
       Menüpunkt soll ohnehin hierher springen. */
    <section
      ref={scope}
      id="kontakt"
      data-nav-theme="light"
      className="scroll-mt-[var(--nav-h)] border-t-2 border-ep-accent bg-ep-paper text-ep-ink"
    >
      <div className="ep-container py-20 sm:py-24 lg:py-28">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-16">
          <div className="lg:col-span-5">
            <p data-k-eyebrow className="t-label text-ep-accent">
              Kontakt
            </p>
            <h2 data-k-h2 className="t-h2 mt-4 max-w-[14ch] text-ep-ink">
              Reden wir über{" "}
              <span className="text-ep-navy">Ihr Haus.</span>
            </h2>
            <p
              data-k-block
              className="t-lead mt-6 max-w-[42ch] text-ep-ink/75"
            >
              Sie schildern Ihre Lage, wir sagen Ihnen, was sich lohnt und was
              nicht. Die Beratung kostet nichts und verpflichtet zu nichts.
            </p>

            {/* SO ERREICHEN SIE UNS Die drei Angaben, die eine normale Kontaktseite im Info-Block
                neben dem Formular zeigt – ohne die Anfahrt, die es hier
                nicht gibt (kein Ladengeschäft, Ilias vermittelt). Als Liste
                mit Icon-Spalte statt als Fließtext: Jede Zeile ist ein
                eigener Fakt, kein Satz, der gelesen werden muss. */}
            {/* Versatz gegen das Formular rechts (dort keiner): Die beiden
                Spalten wandern beim Scrollen minimal gegeneinander, und
                genau dieser Unterschied ist der Effekt – ein einzelner
                bewegter Block fiele nicht auf. 12 px, am unteren Rand der
                Konvention aus `MotionRoot`: Neben einem Formular darf sich
                nichts bewegen, was die Feldpositionen infrage stellt. */}
            <dl
              data-k-block
              data-parallax="12"
              className="mt-10 flex flex-col gap-5 border-t border-ep-line pt-8"
            >
              <div className="flex items-start gap-3.5">
                <User className="mt-0.5 size-5 shrink-0 text-ep-accent" aria-hidden="true" />
                <div>
                  <dt className="t-key text-ep-ink/55">Ansprechpartner</dt>
                  <dd className="text-lg font-semibold text-ep-ink">
                    {SITE.ansprechpartner}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Clock className="mt-0.5 size-5 shrink-0 text-ep-accent" aria-hidden="true" />
                <div>
                  <dt className="t-key text-ep-ink/55">Öffnungszeiten</dt>
                  <dd className="text-lg font-semibold text-ep-ink">
                    {SITE.oeffnungszeiten.tage}{" "}
                    <Fehlt>{SITE.oeffnungszeiten.zeit}</Fehlt>
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Phone className="mt-0.5 size-5 shrink-0 text-ep-accent" aria-hidden="true" />
                <div>
                  <dt className="t-key text-ep-ink/55">Telefon</dt>
                  <dd>
                    <a
                      href={SITE.phone.href}
                      className="text-lg font-semibold text-ep-ink outline-none transition-colors hover:text-ep-accent focus-visible:text-ep-accent"
                    >
                      {SITE.phone.display}
                    </a>
                  </dd>
                </div>
              </div>
            </dl>
          </div>

          {/* Das Formular trägt die Handlung, WhatsApp steht als
              ausdrücklich schnellerer Weg darunter – nicht daneben, siehe
              Kopfkommentar. */}
          <div className="mt-14 lg:col-span-6 lg:col-start-7 lg:mt-0">
            <KontaktFormular />

            <div
              data-k-block
              className="mt-8 flex flex-col gap-4 border-t border-ep-line pt-8 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="text-sm text-ep-ink/65">
                Oder direkt schreiben, ohne Formular:
              </p>
              <WhatsAppButton
                label="Per WhatsApp schreiben"
                className="w-full justify-center sm:w-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
