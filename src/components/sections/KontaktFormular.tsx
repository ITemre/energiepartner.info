"use client";

import { useId, useState } from "react";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";
import {
  ANLIEGEN,
  GEBAEUDE,
  LEER,
  hatFehler,
  pruefe,
  type Fehler,
  type Lead,
} from "@/lib/lead";

/**
 * Das eigentliche Kontaktformular – flach statt gestuft (13.08.).
 *
 * ═══ WARUM NICHT DER `AnfrageDialog` ═══
 * Derselbe Datensatz (`lib/lead.ts`), derselbe Endpunkt (`/api/lead`), aber
 * ein anderer Ort verlangt eine andere Form. Der Dialog ist der Einstieg von
 * einer Landingpage aus – dort trägt ein geführter Drei-Schritt-Ablauf,
 * weil die erste Handlung so klein wie möglich sein soll (ein Klick, kein
 * Feld). Diese Sektion HIER ist bereits der Kontaktbereich: Wer bis hierher
 * gescrollt ist, sucht kein sanftes Anstupsen mehr, sondern das, was jede
 * normale Firmenseite unter „Kontakt" hat – ein Formular auf einen Blick,
 * zum Ausfüllen von oben nach unten, wie bei jeder anderen Firma auch.
 *
 * ═══ WARUM DIESELBEN PFLICHTFELDER ═══
 * `pruefe(lead, "alle")` verlangt Anliegen, PLZ, Gebäude, Name und einen
 * Kontaktweg – serverseitig, nicht verhandelbar (siehe `api/lead/route.ts`).
 * Ein schlankeres Formular mit nur Name/Kontakt/Nachricht würde serverseitig
 * abgelehnt, wenn man die übrigen Felder nicht mit erfundenen Werten
 * vorbelegt – und erfundene Werte (ein geratenes Anliegen, eine falsche PLZ)
 * verfälschen genau die Daten, nach denen Ilias seine Leads sortiert. Lieber
 * ein Feld mehr im Formular als ein Lead mit falschen Angaben im CRM.
 */
export function KontaktFormular() {
  const uid = useId();

  const [lead, setLead] = useState<Lead>({ ...LEER, variante: "beratung" });
  const [fehler, setFehler] = useState<Fehler>({});
  const [sendet, setSendet] = useState(false);
  const [fertig, setFertig] = useState(false);
  const [stoerung, setStoerung] = useState("");

  const setzeFeld = <K extends keyof Lead>(feld: K, wert: Lead[K]) => {
    setLead((l) => ({ ...l, [feld]: wert }));
    // Fehler verschwindet, sobald der Nutzer ihn behebt – nicht erst beim
    // nächsten Absenden. Dasselbe Prinzip wie im `AnfrageDialog`.
    setFehler((f) => (f[feld] ? { ...f, [feld]: undefined } : f));
  };

  async function absenden(event: React.FormEvent) {
    event.preventDefault();
    const f = pruefe(lead, "alle");
    setFehler(f);
    if (hatFehler(f)) return;

    setSendet(true);
    setStoerung("");
    try {
      const antwort = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, quelle: "Kontaktsektion", website: "" }),
      });
      const daten = await antwort.json();
      if (!antwort.ok || !daten.ok) {
        setStoerung(daten?.grund ?? "Die Übermittlung ist gerade nicht möglich.");
        return;
      }
      setFertig(true);
    } catch {
      setStoerung("Die Übermittlung ist gerade nicht möglich.");
    } finally {
      setSendet(false);
    }
  }

  if (fertig) {
    return (
      <div data-k-block className="border-t border-ep-line pt-8">
        <span className="grid size-12 place-items-center rounded-full bg-ep-accent-strong text-white">
          <Check className="size-6" strokeWidth={2.5} aria-hidden="true" />
        </span>
        <p className="t-lead mt-6 max-w-[42ch] text-ep-ink/80">
          Ihre Anfrage ist angekommen. Wir melden uns innerhalb von
          24&nbsp;Stunden, auf dem Weg, den Sie angegeben haben.
        </p>
      </div>
    );
  }

  return (
    <form
      data-k-block
      onSubmit={absenden}
      noValidate
      className="relative border-t border-ep-line pt-8"
    >
      {/* Honigtopf – aus Tab-Fluss und Vorlesereihenfolge heraus, dasselbe
          Muster wie im `AnfrageDialog`. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-0">
        <label htmlFor={`${uid}-website`}>Website</label>
        <input id={`${uid}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Feld id={`${uid}-anliegen`} label="Anliegen" fehler={fehler.anliegen}>
            <div className="relative">
              <select
                id={`${uid}-anliegen`}
                value={lead.anliegen}
                onChange={(e) => setzeFeld("anliegen", e.target.value as Lead["anliegen"])}
                aria-invalid={!!fehler.anliegen}
                className={cn(eingabe, "appearance-none pr-10")}
              >
                <option value="" disabled>
                  Bitte wählen
                </option>
                {ANLIEGEN.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ep-ink/40"
                aria-hidden="true"
              />
            </div>
          </Feld>

          <Feld id={`${uid}-gebaeude`} label="Gebäude" fehler={fehler.gebaeude}>
            <div className="relative">
              <select
                id={`${uid}-gebaeude`}
                value={lead.gebaeude}
                onChange={(e) => setzeFeld("gebaeude", e.target.value as Lead["gebaeude"])}
                aria-invalid={!!fehler.gebaeude}
                className={cn(eingabe, "appearance-none pr-10")}
              >
                <option value="" disabled>
                  Bitte wählen
                </option>
                {GEBAEUDE.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ep-ink/40"
                aria-hidden="true"
              />
            </div>
          </Feld>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Feld
            id={`${uid}-plz`}
            label="Postleitzahl"
            hinweis="Für den passenden Fachbetrieb in Ihrer Nähe."
            fehler={fehler.plz}
          >
            <input
              id={`${uid}-plz`}
              value={lead.plz}
              onChange={(e) =>
                setzeFeld("plz", e.target.value.replace(/\D/g, "").slice(0, 5))
              }
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="70839"
              aria-invalid={!!fehler.plz}
              className={cn(eingabe, "max-w-[10ch] tabular-nums")}
            />
          </Feld>

          <Feld id={`${uid}-name`} label="Name" fehler={fehler.name}>
            <input
              id={`${uid}-name`}
              value={lead.name}
              onChange={(e) => setzeFeld("name", e.target.value)}
              autoComplete="name"
              aria-invalid={!!fehler.name}
              className={eingabe}
            />
          </Feld>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Feld
            id={`${uid}-tel`}
            label="Telefon"
            fehler={fehler.telefon}
            hinweis="Telefon oder E-Mail, eines genügt."
          >
            <input
              id={`${uid}-tel`}
              value={lead.telefon}
              onChange={(e) => setzeFeld("telefon", e.target.value)}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              aria-invalid={!!fehler.telefon}
              className={eingabe}
            />
          </Feld>
          <Feld id={`${uid}-mail`} label="E-Mail" fehler={fehler.email}>
            <input
              id={`${uid}-mail`}
              value={lead.email}
              onChange={(e) => setzeFeld("email", e.target.value)}
              type="email"
              inputMode="email"
              autoComplete="email"
              aria-invalid={!!fehler.email}
              className={eingabe}
            />
          </Feld>
        </div>

        <Feld id={`${uid}-nachricht`} label="Nachricht" optional>
          <textarea
            id={`${uid}-nachricht`}
            value={lead.nachricht}
            onChange={(e) => setzeFeld("nachricht", e.target.value)}
            rows={3}
            className={cn(eingabe, "resize-none")}
          />
        </Feld>

        <div>
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ep-ink/75">
            <input
              type="checkbox"
              checked={lead.einwilligung}
              onChange={(e) => setzeFeld("einwilligung", e.target.checked)}
              aria-invalid={!!fehler.einwilligung}
              className="mt-0.5 size-5 shrink-0 accent-ep-accent-strong"
            />
            <span>
              Wir dürfen Ihre Angaben verwenden, um Sie zu dieser Anfrage zu
              kontaktieren.{" "}
              <a
                href="/datenschutz"
                className="underline underline-offset-4 hover:text-ep-ink"
              >
                Datenschutz
              </a>
            </span>
          </label>
          {fehler.einwilligung && <Meldung>{fehler.einwilligung}</Meldung>}
        </div>

        {stoerung && (
          <div role="alert" className="border-l-2 border-ep-accent-strong bg-ep-accent/5 px-4 py-3">
            {/* Fehler entschuldigen sich nicht und bleiben nicht vage –
                dasselbe Prinzip wie im `AnfrageDialog`. */}
            <p className="font-semibold text-ep-ink">{stoerung}</p>
            <p className="mt-1 text-sm text-ep-ink/75">
              Erreichen Sie uns bitte direkt unter {SITE.phone.display}.
            </p>
          </div>
        )}

        <button type="submit" disabled={sendet} className={cn(knopf, "self-start")}>
          {sendet ? "Wird gesendet …" : "Anfrage senden"}
          {!sendet && <ArrowRight className="size-5" aria-hidden="true" />}
        </button>
      </div>
    </form>
  );
}

/* ---------------------------------------------------------------- */

/** Helle Fassung der Feld-Bausteine aus `AnfrageDialog` – dort auf Navy,
 *  hier auf Papier. Bewusst eine eigene, kleine Kopie statt eines geteilten
 *  Moduls: Die beiden Formulare leben in verschiedenen Flächen und sollen
 *  unabhängig voneinander änderbar bleiben.
 *
 *  ⚠️ `.t-feld` STATT `.t-label` (13.08.). Der Dialog setzt seine
 *  Beschriftungen in `.t-label` (Mono, versalisiert, gesperrt) und kommt
 *  damit durch, weil dort nie mehr als drei Felder gleichzeitig im Bild
 *  stehen. Hier stehen sieben untereinander, dazu Eyebrow und drei
 *  Datenblatt-Kennungen der Sektion – die halbe Fläche war Monospace.
 *  Begründung ausführlich an `.t-feld` in `globals.css`. */
const etikett = "t-feld text-ep-ink/70";

/* 18 px statt 16: Die Seite setzt Fließtext ab `.t-lead` bei 17 px, ein
   16-px-Eingabefeld darunter liest sich als Fremdkörper aus einem
   Standard-Formular. Der Dialog geht auf 20 px, das ist dort richtig
   (Vollbild, eine Frage je Schritt) und hier zu laut. */
const eingabe =
  "mt-2 w-full rounded-t-[6px] border-b-2 border-ep-ink/25 bg-ep-ink/[0.03] px-4 py-3 text-lg text-ep-ink outline-none transition-colors placeholder:text-ep-ink/35 hover:border-ep-ink/40 hover:bg-ep-ink/[0.05] focus:border-ep-accent-strong focus:bg-ep-ink/[0.05]";

const knopf =
  "inline-flex items-center gap-2.5 rounded-ep bg-ep-accent-strong px-6 py-3.5 text-base font-semibold text-white outline-none transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-[#d95c17] focus-visible:ring-2 focus-visible:ring-ep-accent-strong focus-visible:ring-offset-2 focus-visible:ring-offset-ep-paper disabled:cursor-not-allowed disabled:opacity-60";

function Feld({
  id,
  label,
  hinweis,
  optional,
  fehler,
  children,
}: {
  id: string;
  label: string;
  hinweis?: string;
  optional?: boolean;
  fehler?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className={cn(etikett, "flex items-baseline gap-2")}>
        {label}
        {optional && (
          <span className="font-normal text-ep-ink/45">optional</span>
        )}
      </label>
      {children}
      {hinweis && !fehler && (
        <p className="mt-1.5 text-sm leading-snug text-ep-ink/55">{hinweis}</p>
      )}
      {fehler && <Meldung>{fehler}</Meldung>}
    </div>
  );
}

function Meldung({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="mt-2 text-sm font-medium text-ep-accent">
      {children}
    </p>
  );
}
