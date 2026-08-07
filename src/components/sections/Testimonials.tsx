"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Star } from "lucide-react";
import { GoogleG } from "@/components/ui/GoogleG";
import {
  formatiereNote,
  zitatKlassen,
  type GoogleBewertungen,
} from "@/lib/google-reviews";
import { maskedHeadline, revealItems } from "@/lib/motion";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * Stimmen – echte Google-Rezensionen.
 *
 * ═══ WOHER DIE DATEN KOMMEN ═══
 * Aus der Places API, abgerufen serverseitig in `page.tsx` und als Prop
 * hereingereicht (siehe `lib/google-reviews.ts`). Es gibt keinen
 * Handschalter mehr: Liegen echte Rezensionen vor, stehen sie hier; liegt
 * nichts vor, ist `bewertungen` gleich `null` und die Sektion zeigt keine
 * einzige Bewertungsaussage. Vorher entschied das eine Konstante
 * `BEWERTUNGEN_ECHT`, die jemand beim Livegang hätte umlegen müssen – und
 * zwar an einer Stelle, während dieselbe Aussage an zweien steht.
 *
 * ═══ WARUM KEIN KARUSSELL MEHR ═══
 * Hier lief ein einzelnes Zitat, das alle sieben Sekunden von selbst
 * wechselte, gedeckelt auf 24 Zeichen Zeilenlänge. Zwei Probleme, die
 * zusammenfielen: Zu jedem Zeitpunkt war ungefähr ein Achtel der Fläche
 * belegt, und wer zu Ende lesen wollte, wurde vom nächsten Wechsel
 * unterbrochen. Zwischen zwei großen Nachbarsektionen las sich das als
 * Randnotiz.
 *
 * Jetzt stehen alle Stimmen gleichzeitig da, groß gesetzt. Belege bewegen
 * sich nicht, sie liegen aus.
 *
 * ═══ ATTRIBUTION ═══
 * Google verlangt, dass Rezensionen dem Verfasser zugeordnet und als
 * Google-Inhalt erkennbar sind. Name, Zeitangabe und der Verweis auf die
 * Rezension stehen deshalb an jeder Stimme, das Google-G an der Kennzahl.
 */
export function Testimonials({
  bewertungen,
}: {
  bewertungen: GoogleBewertungen | null;
}) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        revealItems("[data-t-reveal]", { distance: 20, start: "top 88%" });

        return maskedHeadline({
          headline: "[data-t-h2]",
          follow: "[data-t-eyebrow]",
          scrollTrigger: { trigger: scope.current, start: "top 80%", once: true },
        });
      });
    },
    { scope },
  );

  /* Ohne echte Rezensionen bleibt eine schmale, ehrliche Zeile stehen statt
     einer leeren Bühne. Die Sektion ganz auszublenden wäre auch vertretbar –
     aber `#referenzen` ist ein Navigationsziel, und ein Sprungziel, das ins
     Leere führt, ist schlechter als ein kurzer wahrer Satz. */
  if (!bewertungen) {
    return (
      <section
        ref={scope}
        id="referenzen"
        data-nav-theme="light"
        className="scroll-mt-[var(--nav-h)] bg-ep-paper"
      >
        {/* Mittig wie der gefüllte Zustand – sonst wechselt die Sektion je
            nach Datenlage die Achse, und das fällt beim Umschalten sofort
            auf. */}
        <div className="ep-container py-24 text-center sm:py-32">
          <p data-t-eyebrow className="t-label text-ep-orange-deep">
            Stimmen
          </p>
          <h2 data-t-h2 className="t-h2 mx-auto mt-6 max-w-[22ch] text-balance text-ep-ink">
            Die ersten Anlagen laufen.{" "}
            <span className="text-ep-navy">Die Bewertungen kommen.</span>
          </h2>
          <p
            data-t-reveal
            className="t-lead mx-auto mt-8 max-w-[52ch] text-ep-ink/70"
          >
            Wir zeigen hier ausschließlich echte Google-Rezensionen. Solange
            keine vorliegen, steht an dieser Stelle nichts. Fragen Sie uns nach
            Referenzen, wir nennen Ihnen gern welche.
          </p>
        </div>
      </section>
    );
  }

  const { quelle, note, anzahl, profilUrl, rezensionen } = bewertungen;
  /* Steuert nur noch die Pflichtangabe zur Echtheitsprüfung ganz unten.
     Sterne, Note, Anzahl, Google-Zeichen und Profillink stehen immer – der
     Auftritt soll seine Wirkung vollständig zeigen. Der Satz „stammen
     unverändert aus unserem Google-Unternehmensprofil" ist dagegen eine
     Tatsachenbehauptung über die Herkunft der Texte und bleibt weg, solange
     sie nicht stimmt. Er steht in 14 px Grau am Sektionsende; sein Fehlen
     kostet optisch nichts. */
  const vonGoogle = quelle === "google";

  return (
    <section
      ref={scope}
      id="referenzen"
      data-nav-theme="light"
      className="scroll-mt-[var(--nav-h)] bg-ep-paper"
    >
      {/* ⚠️ MITTELACHSE – die einzige Sektion der Seite, die von der linken
          Kante abweicht, und das ist Absicht.

          Alles andere hängt an `.ep-container` und der Datenblatt-Achse:
          links die Kennung, rechts der Wert. Diese Ordnung ist die Sprache
          eines Anbieters, der etwas vorlegt. Stimmen sind aber nicht unsere
          Aussage – sie stehen für sich, und eine mittige Komposition ohne
          Kennspur entzieht sie genau dieser Ordnung. Man liest sie als
          Zitate, nicht als weiteren Punkt auf unserer Liste.

          Es funktioniert nur, weil es EINMAL vorkommt. Eine zweite mittige
          Sektion wäre keine Ausnahme mehr, sondern eine zweite Systematik. */}
      <div className="ep-container py-28 text-center sm:py-40 lg:py-48">
        {/* ═══ Kopf: Aussage, darunter der Beleg als Kennzahl ═══
            Untereinander statt nebeneinander: Auf der Mittelachse gibt es
            kein Links und Rechts mehr, an dem zwei Blöcke hängen könnten. */}
        <div>
          <p data-t-eyebrow className="t-label text-ep-orange-deep">
            Stimmen
          </p>
          <h2 data-t-h2 className="t-h2 mx-auto mt-6 max-w-[20ch] text-balance text-ep-ink">
            Was Kunden{" "}
            <span className="text-ep-navy">nach der Abnahme sagen.</span>
          </h2>

          {/* DIE KENNZAHL. Das Einzige an dieser Sektion, das man
              nachprüfen kann – deshalb groß, mit Sternen, Google-Zeichen
              und dem Verweis aufs Profil. */}
          <div data-t-reveal className="mt-12 flex flex-col items-center">
            <div className="flex items-end gap-4">
              <span className="t-stat text-ep-ink">{formatiereNote(note)}</span>
              <div className="pb-1 text-left">
                <span className="flex items-center gap-0.5" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={
                        i < Math.round(note)
                          ? "size-4 fill-ep-orange-deep text-ep-orange-deep"
                          : "size-4 text-ep-line"
                      }
                    />
                  ))}
                </span>
                <p className="t-key mt-1.5 flex items-center gap-2 text-ep-ink/70">
                  <GoogleG className="size-3.5 shrink-0" />
                  {anzahl} {anzahl === 1 ? "Bewertung" : "Bewertungen"}
                </p>
              </div>
            </div>

            {profilUrl && (
              <a
                href={profilUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="t-key mt-4 inline-block text-ep-ink/60 underline underline-offset-4 outline-none transition-colors hover:text-ep-ink focus-visible:text-ep-ink"
              >
                Bei Google ansehen
              </a>
            )}
          </div>
        </div>

        {/* ═══ Die Stimmen ═══
            Alle gleichzeitig, jede über einer Haarlinie. Ab lg zwei Spalten,
            weil ein einzelner Strang aus fünf großen Zitaten die Sektion
            länger machen würde als jede andere auf der Seite. */}
        {/* Trennlinien laufen SENKRECHT zwischen den Spalten, nicht mehr
            waagerecht unter jedem Zitat. Waagerechte Linien schneiden eine
            mittige Komposition in Streifen und stellen die Ordnung wieder
            her, die hier gerade weggenommen werden soll. */}
        <ul className="mt-20 grid gap-y-16 sm:mt-28 lg:mt-36 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-20">
          {rezensionen.map((r, i) => (
            <li
              key={`${r.autor}-${i}`}
              data-t-reveal
              className={[
                "flex flex-col items-center",
                i % 2 === 1 ? "lg:border-l lg:border-ep-line lg:pl-16" : "",
              ].join(" ")}
            >
              <span className="flex items-center gap-0.5" aria-hidden="true">
                {Array.from({ length: r.sterne }).map((_, s) => (
                  <Star
                    key={s}
                    className="size-4 fill-ep-orange-deep text-ep-orange-deep"
                  />
                ))}
              </span>

              {/* Zitate sind der Inhalt dieser Sektion, nicht die Erläuterung
                  eines Inhalts – kurze Stimmen stehen deshalb in
                  Auszeichnungsgröße. Wie groß genau, entscheidet die
                  Textlänge (`zitatKlassen`, dort steht die Begründung);
                  `"mitte"` gibt die Zugabe für den zentrierten Satz.

                  Vorher lief hier alles in 2,9 rem mit `line-clamp-[6]` –
                  das schnitt jede normale Google-Rezension mit einem „…"
                  ab. Eine abgeschnittene Kundenstimme ist schlimmer als
                  eine kurze. */}
              <blockquote
                className={cn(
                  "mt-6 text-ep-ink",
                  zitatKlassen(r.text, {
                    ausrichtung: "mitte",
                    anzahl: rezensionen.length,
                  }),
                )}
              >
                „{r.text}&ldquo;
              </blockquote>

              <figcaption className="mt-7 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1">
                <span className="font-semibold text-ep-ink">{r.autor}</span>
                <span className="t-key text-ep-ink/60">{r.wann}</span>
                {vonGoogle && r.url && (
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="t-key text-ep-ink/60 underline underline-offset-4 outline-none transition-colors hover:text-ep-ink focus-visible:text-ep-ink"
                  >
                    bei Google
                  </a>
                )}
              </figcaption>
            </li>
          ))}
        </ul>

        {/* Pflichtangabe seit 2022: Wer mit Bewertungen wirbt, muss sagen, ob
            und wie er ihre Echtheit sicherstellt (§ 5b Abs. 3 UWG). Hier ist
            die Antwort einfach und stark – wir stellen sie nicht sicher,
            Google tut es, und wir zeigen ungefiltert, was dort steht.

            Sie steht ausdrücklich nur bei echten Google-Daten. Eine
            Echtheitszusage über vorläufige Inhalte wäre die unwahrste Zeile
            der ganzen Seite. */}
        {vonGoogle && (
          <p data-t-reveal className="mx-auto mt-20 max-w-[62ch] text-sm leading-relaxed text-ep-ink/60">
            Alle Bewertungen stammen unverändert aus unserem
            Google-Unternehmensprofil und werden automatisch von dort geladen.
            Wir wählen nicht aus, welche erscheinen.
          </p>
        )}
      </div>
    </section>
  );
}
