"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ArrowRight, Check, Paperclip, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";
import {
  ANLIEGEN,
  ANLIEGEN_ANGEBOT,
  DATEI_ACCEPT,
  GEBAEUDE,
  LEER,
  hatFehler,
  pruefe,
  pruefeDatei,
  type Fehler,
  type Lead,
  type Variante,
} from "@/lib/lead";

/**
 * Schrittname (für die Skala) und Überschrift (für den Nutzer), je Variante.
 *
 * Die Beratungsstrecke fragt zuerst nach dem Anliegen, dann nach dem Haus.
 * Die Angebotsprüfung fragt zuerst, wofür ein Angebot vorliegt, und dann
 * nach dem Angebot selbst – die Datei ist dort der eigentliche Inhalt der
 * Anfrage, nicht ein Anhang.
 */
const SCHRITTE: Record<Variante, readonly { kurz: string; frage: string }[]> = {
  beratung: [
    { kurz: "Anliegen", frage: "Worum geht es?" },
    { kurz: "Zuhause", frage: "Wo steht Ihr Haus?" },
    { kurz: "Kontakt", frage: "Wie erreichen wir Sie?" },
  ],
  angebot: [
    { kurz: "Angebot", frage: "Wofür liegt Ihnen ein Angebot vor?" },
    { kurz: "Unterlage", frage: "Ihr Angebot" },
    { kurz: "Kontakt", frage: "Wie erreichen wir Sie?" },
  ],
};

/**
 * Der zweite Weg – Vollbild-Dialog, ausgelöst vom Sekundär-CTA im Hero.
 *
 * ARCHITEKTUR – und das ist hier die eigentliche Entscheidung: DREI ZONEN
 * in einer festen Höhe (`h-dvh`), nicht ein langes Dokument.
 *
 *   Kopf     shrink-0   Marke + Schließen
 *   Frage    shrink-0   Skala, Schrittzahl, Überschrift
 *   Felder   flex-1     das Einzige, was überhaupt scrollen darf
 *   Fuß      shrink-0   Weiter/Zurück + der Direktkanal
 *
 * Der erste Entwurf war ein normaler Fluss im Dialog. Auf dem Handy stand
 * der „Weiter"-Knopf dadurch unterhalb der Bildschirmkante: Man füllt ein
 * Feld aus, sieht keine Handlung und muss erst suchen. Ein Formular, dessen
 * Knopf man suchen muss, verliert genau dort, wo es gewinnen sollte.
 *
 * Jetzt ist die Handlung IMMER sichtbar, und der Mittelteil scrollt nur
 * dann, wenn der Inhalt es wirklich erzwingt – auf allen drei Schritten
 * passt er auf ein übliches Handydisplay ohne Scrollen.
 *
 * WARUM `<dialog>`: Fokusfalle, Escape, Inertisierung des Hintergrunds und
 * die Rückgabe des Fokus an den auslösenden Knopf sind nativ enthalten.
 * Nachgebaut sind das rund hundert Zeilen, die regelmäßig undicht sind.
 *
 * WARUM ORANGE: Die Seite hatte genau eine Handlungsfarbe, und die gehört
 * einem fremden Kanal (#25D366). Zwei Wege, zwei Farben – Grün bleibt
 * WhatsApp, das Formular übernimmt Energie-Orange.
 *
 * WARUM DREI SCHRITTE: Ein Block aus sechs Feldern ist eine Wand. Schritt 1
 * verlangt kein Tippen, sondern einen Klick – die kleinste Zusage, die es
 * gibt. Die Tastatur kommt erst, wenn die Entscheidung gefallen ist.
 */
export function AnfrageDialog({
  offen,
  quelle,
  variante = "beratung",
  onSchliessen,
}: {
  offen: boolean;
  quelle: string;
  variante?: Variante;
  onSchliessen: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const frageRef = useRef<HTMLHeadingElement>(null);
  const uid = useId();

  const schritte = SCHRITTE[variante];
  const istAngebot = variante === "angebot";

  const [schritt, setSchritt] = useState<0 | 1 | 2>(0);
  const [lead, setLead] = useState<Lead>({ ...LEER, variante });
  const [fehler, setFehler] = useState<Fehler>({});
  const [sendet, setSendet] = useState(false);
  const [fertig, setFertig] = useState(false);
  const [stoerung, setStoerung] = useState("");
  /** Optionales Nachrichtenfeld – siehe Schritt 3. */
  const [notiz, setNotiz] = useState(false);
  /** Das hochgeladene Angebot. Bleibt bewusst außerhalb von `lead`: Eine
   *  Datei ist kein Formularwert, sie lässt sich nicht als JSON mitschicken
   *  und gehört deshalb nicht in dieselbe Struktur wie Name und Telefon. */
  const [datei, setDatei] = useState<File | null>(null);
  const [dateiFehler, setDateiFehler] = useState("");

  /* ---------- Öffnen / Schließen ---------- */
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;

    if (offen && !el.open) {
      el.showModal();
      document.body.style.overflow = "hidden";

      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, ease: "power2.out" });
        gsap.fromTo(
          el.querySelectorAll("[data-an-in]"),
          { y: 18, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.06, ease: "power3.out", delay: 0.06 },
        );
      }
    }

    if (!offen && el.open) el.close();
  }, [offen]);

  /** Aufräumen an EINER Stelle: `close` feuert auch bei Escape, nicht nur
   *  beim eigenen Knopf. */
  const aufraeumen = useCallback(() => {
    document.body.style.overflow = "";
    onSchliessen();

    // Nach erfolgreicher Anfrage beim nächsten Öffnen frisch beginnen.
    // Bricht jemand dagegen ab, bleiben seine Eingaben stehen – ein
    // versehentliches Escape darf keine Arbeit vernichten.
    if (fertig) {
      setFertig(false);
      setLead({ ...LEER, variante });
      setSchritt(0);
      setFehler({});
      setStoerung("");
      setDatei(null);
      setDateiFehler("");
    }
  }, [fertig, onSchliessen, variante]);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    el.addEventListener("close", aufraeumen);
    return () => el.removeEventListener("close", aufraeumen);
  }, [aufraeumen]);

  /* ---------- Formularlogik ---------- */
  const setzeFeld = <K extends keyof Lead>(feld: K, wert: Lead[K]) => {
    setLead((l) => ({ ...l, [feld]: wert }));
    // Fehler verschwindet, sobald der Nutzer ihn behebt – nicht erst beim
    // nächsten Absenden. Eine Meldung, die stehen bleibt, obwohl das Feld
    // stimmt, liest sich wie ein Vorwurf.
    setFehler((f) => (f[feld] ? { ...f, [feld]: undefined } : f));
  };

  /** Fokus auf die neue Frage – ohne das weiß ein Tastatur- oder
   *  Screenreader-Nutzer nach „Weiter" nicht, dass sich etwas getan hat. */
  const wechsle = useCallback((ziel: 0 | 1 | 2, richtung: 1 | -1) => {
    setSchritt(ziel);
    requestAnimationFrame(() => {
      frageRef.current?.focus();
      if (!panel.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }
      gsap.fromTo(
        panel.current,
        { x: 22 * richtung, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 0.4, ease: "power2.out" },
      );
    });
  }, []);

  const weiter = () => {
    const f = pruefe(lead, schritt);
    setFehler(f);
    if (hatFehler(f)) return;
    if (schritt < 2) wechsle((schritt + 1) as 0 | 1 | 2, 1);
  };

  const zurueck = () => {
    if (schritt > 0) wechsle((schritt - 1) as 0 | 1 | 2, -1);
  };

  async function absenden(event: React.FormEvent) {
    event.preventDefault();
    const f = pruefe(lead, "alle");
    setFehler(f);
    if (hatFehler(f)) {
      // Zum ersten unvollständigen Schritt führen, statt einen Fehler an
      // einem Feld zu melden, das gerade nicht sichtbar ist.
      const ziel = hatFehler(pruefe(lead, 0)) ? 0 : hatFehler(pruefe(lead, 1)) ? 1 : 2;
      if (ziel !== schritt) wechsle(ziel as 0 | 1 | 2, -1);
      return;
    }

    setSendet(true);
    setStoerung("");
    try {
      /* Mit Datei geht die Anfrage als FormData raus, ohne Datei als JSON.
         Eine Datei durch JSON zu schleusen hieße, sie vorher nach Base64 zu
         wandeln – das bläht die Nutzlast um ein Drittel auf und macht aus
         einem 8-MB-Angebot einen 11-MB-Request. Die Route versteht beide
         Formate, der Rest der Anfrage ist identisch. */
      const antwort = await fetch("/api/lead", {
        method: "POST",
        ...(datei
          ? {
              body: (() => {
                const fd = new FormData();
                fd.append("daten", JSON.stringify({ ...lead, quelle, website: "" }));
                fd.append("datei", datei, datei.name);
                return fd;
              })(),
              // KEIN Content-Type von Hand setzen: Bei FormData muss der
              // Browser ihn samt Boundary erzeugen, sonst kann der Server
              // die Teile nicht trennen.
            }
          : {
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...lead, quelle, website: "" }),
            }),
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

  const letzter = schritt === 2;

  return (
    <dialog
      ref={dialog}
      aria-labelledby={`${uid}-titel`}
      /* Das native Element bringt eigene Maße, Ränder und einen weißen Grund
         mit – ohne Zurücksetzen sitzt der Vollbild-Dialog in einem Kasten in
         der Mitte. `overflow-hidden` ist Absicht: Gescrollt wird ausschließlich
         in der Feldzone, damit Kopf und Fuß nie weglaufen. */
      data-surface="dark"
      className="m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden bg-ep-navy-deep p-0 text-white backdrop:bg-ep-navy-deep/90"
    >
      {/* Dieselbe Skala wie Hero und Footer – der Dialog ist Teil derselben
          Fläche, kein aufgesetztes Fenster. */}
      <div
        aria-hidden="true"
        className="ep-skala ep-skala-auslauf pointer-events-none absolute inset-0"
      />

      <div className="relative flex h-dvh flex-col">
        {/* ══════════ ZONE 1 · Kopf ══════════ */}
        <div className="ep-container flex h-[var(--nav-h)] shrink-0 items-center justify-between border-b border-ep-line-dark">
          <Image
            src={SITE.logo.negativ}
            alt="energiepartner"
            width={210}
            height={42}
            unoptimized
            className="h-[24px] w-auto sm:h-[32px]"
          />
          {/* 44 px Trefferfläche, beschriftet statt nur bebildert. */}
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            className="-mr-2 inline-flex items-center gap-2 rounded-ep px-2 py-2 text-white/80 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-ep-accent-strong"
          >
            <span className="t-key hidden sm:inline">Schließen</span>
            <X className="size-6" aria-hidden="true" />
            <span className="sr-only">Anfrage schließen</span>
          </button>
        </div>

        {/* Ab hier eine mittige Spalte: Ein Formular über 1900 px Breite
            wäre unlesbar, und der Dialog ist eine eigene Komposition – die
            Kanten der Seite gelten hier nicht. */}
        <form
          onSubmit={absenden}
          noValidate
          className="mx-auto flex w-full max-w-[46rem] flex-1 flex-col overflow-hidden px-[max(var(--edge),1.25rem)]"
        >
          {/* Honigtopf – aus Tab-Fluss und Vorlesereihenfolge heraus. */}
          <div aria-hidden="true" className="absolute left-[-9999px] top-0">
            <label htmlFor={`${uid}-website`}>Website</label>
            <input id={`${uid}-website`} name="website" tabIndex={-1} autoComplete="off" />
          </div>

          {/* ══════════ ZONE 2 · Frage ══════════ */}
          <div data-an-in className="shrink-0 pb-4 pt-4 sm:pb-8 sm:pt-10">
            {!fertig && (
              <div className="flex items-center gap-4">
                {/* DIE SKALA – dieselbe Teilung wie in den Stimmen und in
                    der Textur des Heros. Fortschritt ohne Balken. */}
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  {schritte.map(({ kurz }, i) => (
                    <span
                      key={kurz}
                      className={cn(
                        "h-0.5 w-8 transition-colors duration-500 sm:w-10",
                        i <= schritt ? "bg-ep-accent-strong" : "bg-white/25",
                      )}
                    />
                  ))}
                </div>
                <p className="t-key text-white/80">
                  Schritt {schritt + 1} von {schritte.length}
                </p>
              </div>
            )}

            <h2
              id={`${uid}-titel`}
              ref={frageRef}
              tabIndex={-1}
              className="t-h3 mt-4 outline-none"
            >
              {fertig ? "Ihre Anfrage ist angekommen." : schritte[schritt].frage}
            </h2>
          </div>

          {/* ══════════ ZONE 3 · Felder (das Einzige, was scrollt) ══════════
              `data-lenis-prevent` ist Pflicht: Lenis fängt Rad-Ereignisse
              global ab und verhindert sie. Ohne dieses Attribut ließ sich
              im Dialog überhaupt nicht scrollen – der Inhalt war da, das
              Rad hat nur nichts bewirkt. */}
          <div
            ref={panel}
            data-lenis-prevent
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-2"
          >
            {fertig ? (
              <div>
                <span className="grid size-12 place-items-center rounded-full bg-ep-accent-strong text-white">
                  <Check className="size-6" strokeWidth={2.5} aria-hidden="true" />
                </span>
                {/* Bestätigungen sagen, was als Nächstes passiert – sonst
                    bleibt der Nutzer mit einem Häkchen und einer offenen
                    Frage zurück. */}
                <p className="t-lead mt-6 max-w-[42ch] text-white/85">
                  {istAngebot
                    ? "Wir sehen uns Ihr Angebot Position für Position an und melden uns innerhalb von 24 Stunden mit der Auswertung, auf dem Weg, den Sie angegeben haben."
                    : "Wir sehen uns Ihre Angaben an und melden uns innerhalb von 24 Stunden, auf dem Weg, den Sie angegeben haben."}
                </p>
              </div>
            ) : (
              <>
                {/* ---------- Schritt 1 · Anliegen ---------- */}
                {schritt === 0 && (
                  <fieldset className="border-t border-ep-line-dark">
                    <legend className="sr-only">{schritte[0].frage}</legend>
                    <ul>
                      {(istAngebot ? ANLIEGEN_ANGEBOT : ANLIEGEN).map(({ value, label, hint }) => {
                        const aktiv = lead.anliegen === value;
                        return (
                          <li key={value}>
                            <button
                              type="button"
                              onClick={() => {
                                setzeFeld("anliegen", value);
                                // Die Auswahl IST die Antwort – ein
                                // zusätzliches „Weiter" wäre ein Klick
                                // ohne Aussage.
                                setTimeout(() => wechsle(1, 1), 150);
                              }}
                              aria-pressed={aktiv}
                              className={cn(
                                "group flex w-full items-center justify-between gap-5 border-b border-ep-line-dark px-1 py-4 text-left outline-none transition-colors focus-visible:bg-white/10 sm:py-5",
                                aktiv ? "bg-white/10" : "hover:bg-white/[0.07]",
                              )}
                            >
                              <span className="flex flex-col gap-0.5">
                                <span className="text-lg font-semibold text-white sm:text-xl">
                                  {label}
                                </span>
                                <span className="text-sm text-white/70">{hint}</span>
                              </span>
                              <ArrowRight
                                className="size-5 shrink-0 text-ep-accent-strong transition-transform duration-300 group-hover:translate-x-1.5"
                                aria-hidden="true"
                              />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                    {fehler.anliegen && <Meldung>{fehler.anliegen}</Meldung>}
                  </fieldset>
                )}

                {/* ---------- Schritt 2 · Zuhause bzw. das Angebot ---------- */}
                {schritt === 1 && (
                  <div className="flex flex-col gap-7">
                    <Feld
                      id={`${uid}-plz`}
                      label="Postleitzahl"
                      hinweis="Damit wir den passenden Fachbetrieb in Ihrer Nähe finden."
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

                    {istAngebot ? (
                      /* DER UPLOAD. Er ist hier kein Zusatzfeld, sondern der
                         Inhalt der Anfrage – deshalb steht er direkt unter
                         der PLZ und nicht am Ende hinter den Kontaktdaten.

                         Optional bleibt er trotzdem: Viele haben das Angebot
                         als Papier im Ordner und fotografieren es erst
                         später. Wer hier nichts anhängt, bekommt den Hinweis
                         auf WhatsApp – ein Pflichtfeld an dieser Stelle
                         würde genau die verlieren, die am weitesten sind. */
                      <DateiFeld
                        id={`${uid}-datei`}
                        datei={datei}
                        fehler={dateiFehler}
                        onWaehle={(f) => {
                          if (!f) {
                            setDatei(null);
                            setDateiFehler("");
                            return;
                          }
                          const meldung = pruefeDatei(f);
                          setDateiFehler(meldung ?? "");
                          setDatei(meldung ? null : f);
                        }}
                      />
                    ) : (
                      <fieldset>
                        <legend className={etikett}>Ihr Gebäude</legend>
                        <div className="mt-3 flex flex-wrap gap-2.5">
                          {GEBAEUDE.map(({ value, label }) => {
                            const aktiv = lead.gebaeude === value;
                            return (
                              <button
                                key={value}
                                type="button"
                                onClick={() => setzeFeld("gebaeude", value)}
                                aria-pressed={aktiv}
                                className={cn(
                                  "rounded-ep border px-5 py-3 text-base font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ep-accent-strong",
                                  aktiv
                                    ? "border-ep-accent-strong bg-ep-accent-strong text-white"
                                    : "border-white/35 text-white hover:border-white/60 hover:bg-white/10",
                                )}
                              >
                                {label}
                              </button>
                            );
                          })}
                        </div>
                        {fehler.gebaeude && <Meldung>{fehler.gebaeude}</Meldung>}
                      </fieldset>
                    )}
                  </div>
                )}

                {/* ---------- Schritt 3 · Kontakt ---------- */}
                {schritt === 2 && (
                  <div className="flex flex-col gap-4 sm:gap-5">
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

                    <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
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

                    {/* Die Nachricht ist optional und kostet rund 90 px –
                        auf einem kurzen Display entscheidet genau das
                        darüber, ob der Absenden-Knopf noch ins Bild passt.
                        Als Klick ist sie da für die, die sie brauchen, und
                        weg für alle anderen. */}
                    {notiz || lead.nachricht ? (
                      <Feld id={`${uid}-nachricht`} label="Nachricht" optional>
                        <textarea
                          id={`${uid}-nachricht`}
                          value={lead.nachricht}
                          onChange={(e) => setzeFeld("nachricht", e.target.value)}
                          rows={2}
                          autoFocus
                          className={cn(eingabe, "resize-none")}
                        />
                      </Feld>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setNotiz(true)}
                        className="-mt-1 self-start text-sm text-white/80 underline underline-offset-4 outline-none transition-colors hover:text-white focus-visible:text-white"
                      >
                        Nachricht hinzufügen
                      </button>
                    )}

                    <div>
                      <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-white/85">
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
                            className="underline underline-offset-4 hover:text-white"
                          >
                            Datenschutz
                          </a>
                        </span>
                      </label>
                      {fehler.einwilligung && <Meldung>{fehler.einwilligung}</Meldung>}
                    </div>

                    {stoerung && (
                      <div role="alert" className="border-l-2 border-ep-accent-strong bg-white/10 px-4 py-3">
                        {/* Fehler entschuldigen sich nicht und bleiben nicht
                            vage – sie sagen, was jetzt geht. */}
                        <p className="font-semibold text-white">{stoerung}</p>
                        <p className="mt-1 text-sm text-white/85">
                          Erreichen Sie uns bitte direkt unter {SITE.phone.display}.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* ══════════ ZONE 4 · Fuß ══════════
              Die Handlung steht IMMER im Bild. Auf Schritt 1 gibt es bewusst
              kein „Weiter" – dort ist die Auswahl selbst der Fortschritt. */}
          <div className="shrink-0 border-t border-ep-line-dark py-4 sm:py-5">
            {fertig ? (
              <button
                type="button"
                onClick={() => dialog.current?.close()}
                className={knopf}
              >
                Zurück zur Seite
              </button>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 sm:gap-5">
                  {schritt > 0 && (
                    <>
                      <button
                        type={letzter ? "submit" : "button"}
                        onClick={letzter ? undefined : weiter}
                        disabled={sendet}
                        className={knopf}
                      >
                        {/* Eine Aktion behält ihren Namen: „Anfrage senden"
                            erzeugt „Ihre Anfrage ist angekommen." */}
                        {letzter ? (sendet ? "Wird gesendet …" : "Anfrage senden") : "Weiter"}
                        {!sendet && <ArrowRight className="size-5" aria-hidden="true" />}
                      </button>
                      <button
                        type="button"
                        onClick={zurueck}
                        className="text-white/80 underline underline-offset-4 outline-none transition-colors hover:text-white focus-visible:text-white"
                      >
                        Zurück
                      </button>
                    </>
                  )}
                </div>

                {/* Der Direktkanal bleibt sichtbar – aber als Zeile, nicht
                    als zweiter Knopf. Ein Formular, das WhatsApp versteckt,
                    gewinnt keine Anfrage dazu; eines, das damit konkurriert,
                    verwässert seine eigene Handlung. */}
                {/* Auf schmalen Displays nur „WhatsApp" – die Zeile
                    brach sonst um und kostete den Fuß eine zweite Reihe. */}
                <a
                  href={SITE.whatsapp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-2 text-sm text-white/80 outline-none transition-colors hover:text-white focus-visible:text-white"
                >
                  <span className="hidden sm:inline">Lieber per&nbsp;</span>WhatsApp
                  <ArrowRight className="size-4 text-ep-whatsapp" aria-hidden="true" />
                </a>
              </div>
            )}
          </div>
        </form>
      </div>
    </dialog>
  );
}

/* ---------------------------------------------------------------- */

/** Beschriftung: Mono, versalisiert, Sonnengelb – dieselbe Kennung wie in
 *  der Ergebnis-Tafel. Vorher stand hier 14-px-Mono auf 60 % Weiß; klein,
 *  grau und ohne Auszeichnung war das der schwächste Text im Dialog. */
const etikett = "t-label text-ep-accent";

/** Gefülltes Feld mit Unterkante statt reiner Haarlinie.
 *  Die nackte Linie war zu leise: Auf einer dunklen Fläche mit 30 % Weiß
 *  sah man nicht, wo das Feld anfängt und ob es überhaupt eines ist. Die
 *  Füllung macht die Trefferfläche sichtbar, die kräftige Unterkante behält
 *  die Formensprache der Seite. */
const eingabe =
  "mt-2 w-full rounded-t-[6px] border-b-2 border-white/35 bg-white/[0.07] px-4 py-2.5 text-base text-white outline-none transition-colors placeholder:text-white/40 hover:border-white/55 hover:bg-white/10 focus:border-ep-accent-strong focus:bg-white/10 sm:py-3 sm:text-xl";

const knopf =
  "inline-flex items-center gap-2.5 rounded-ep bg-ep-accent-strong px-6 py-3.5 text-base font-semibold text-white outline-none transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-[#d95c17] focus-visible:ring-2 focus-visible:ring-ep-accent-strong focus-visible:ring-offset-2 focus-visible:ring-offset-ep-navy-deep disabled:cursor-not-allowed disabled:opacity-60";

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
        {optional && <span className="text-white/55">optional</span>}
      </label>
      {children}
      {hinweis && !fehler && <p className="mt-1.5 text-[13px] leading-snug text-white/70">{hinweis}</p>}
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

/** Dateigröße in der Einheit, in der Menschen sie lesen. */
function lesbareGroesse(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
}

/**
 * Das Angebot als Datei.
 *
 * ES IST EIN ECHTER `<input type="file">`, nur unsichtbar über dem Label –
 * kein nachgebauter Knopf, der per JavaScript einen versteckten Input
 * anklickt. Der native Input bringt Tastaturbedienung, Fokusring,
 * Vorlese-Ansage und vor allem den Kamerazugriff auf dem Handy mit. Genau
 * der ist hier der Hauptfall: Das Angebot liegt als Papier auf dem Tisch,
 * und der Besucher steht mit dem Telefon davor.
 *
 * Ist eine Datei gewählt, tritt der Input zurück und macht Platz für Name,
 * Größe und einen Entfernen-Knopf. Ein Dateifeld, das nach der Auswahl noch
 * genauso aussieht wie vorher, lässt den Nutzer im Unklaren, ob es geklappt
 * hat.
 */
function DateiFeld({
  id,
  datei,
  fehler,
  onWaehle,
}: {
  id: string;
  datei: File | null;
  fehler: string;
  onWaehle: (datei: File | null) => void;
}) {
  if (datei) {
    return (
      <div>
        <p className={etikett}>Ihr Angebot</p>
        <div className="mt-3 flex items-center gap-3 rounded-ep border border-ep-accent-strong/60 bg-white/[0.07] px-4 py-3.5">
          <Paperclip className="size-5 shrink-0 text-ep-accent-strong" aria-hidden="true" />
          <span className="min-w-0 flex-1">
            {/* `truncate` plus `min-w-0`: Ohne die Mindestbreite wächst das
                Flex-Kind über seinen Container hinaus, statt zu kürzen –
                und Angebotsdateien heißen gern „Angebot_Waermepumpe_
                Musterhaus_final_2.pdf". */}
            <span className="block truncate font-medium text-white">{datei.name}</span>
            <span className="t-key text-white/60">{lesbareGroesse(datei.size)}</span>
          </span>
          <button
            type="button"
            onClick={() => onWaehle(null)}
            className="shrink-0 rounded p-1 text-white/70 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-ep-accent-strong"
          >
            <X className="size-5" aria-hidden="true" />
            <span className="sr-only">Datei entfernen</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <label htmlFor={id} className={etikett}>
        Ihr Angebot <span className="text-white/55">optional</span>
      </label>

      <div className="relative mt-3">
        <input
          id={id}
          type="file"
          accept={DATEI_ACCEPT}
          onChange={(e) => onWaehle(e.target.files?.[0] ?? null)}
          aria-describedby={`${id}-hinweis`}
          /* Der Input liegt deckungsgleich über der Fläche und ist
             durchsichtig: Der Klick trifft das echte Element, die
             Gestaltung liegt darunter. `file:` -Varianten von Tailwind
             würden nur den Knopf im Input umfärben, nicht die Fläche. */
          className="peer absolute inset-0 z-10 w-full cursor-pointer opacity-0"
        />
        <div className="pointer-events-none flex items-center gap-3 rounded-ep border border-dashed border-white/40 bg-white/[0.04] px-4 py-5 transition-colors peer-hover:border-white/70 peer-hover:bg-white/[0.08] peer-focus-visible:ring-2 peer-focus-visible:ring-ep-accent-strong">
          <Paperclip className="size-5 shrink-0 text-ep-accent" aria-hidden="true" />
          <span className="text-white/85">Datei auswählen oder fotografieren</span>
        </div>
      </div>

      <p id={`${id}-hinweis`} className="mt-1.5 text-[13px] leading-snug text-white/70">
        PDF, JPG oder PNG, bis 10 MB. Sie können es auch später per WhatsApp
        nachreichen.
      </p>

      {fehler && <Meldung>{fehler}</Meldung>}
    </div>
  );
}
