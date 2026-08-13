"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { ArrowRight, Check, FileText, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";
import { AvWortmarke } from "@/components/av/AvWortmarke";
import {
  DATEI_ACCEPT,
  LEER,
  hatFehler,
  pruefe,
  pruefeDatei,
  type Fehler,
  type Lead,
} from "@/lib/lead";

/**
 * ══════════════════════════════════════════════════════════════════
 * ANGEBOT HOCHLADEN — CTA im Hero, Rest im Vollbild
 * ══════════════════════════════════════════════════════════════════
 *
 * ═══ WARUM DER FUNNEL NICHT IM HERO STEHT ═══
 * Ein erster Versuch hatte die drei Schritte als Karte neben die Headline
 * gestellt. Das kostete den Hero seine Komposition: Damit Karte UND Aussage
 * gemeinsam auf ein Handydisplay passen, mussten Fließtext und
 * Vertrauenszeile weichen – am Ende stand ein halbierter Hero neben einem
 * gedrängten Formular, und beides wirkte kleiner als es ist.
 *
 * Jetzt trägt der Hero nur den Auslöser: einen Knopf, der direkt den
 * Dateidialog öffnet. Kein Feld, keine Dropzone, keine Schrittanzeige – die
 * kleinste mögliche Oberfläche für die größte Handlung der Seite.
 *
 * Sobald eine Datei gewählt ist, übernimmt ein Vollbild. Dort ist Platz für
 * genau eine Frage pro Bildschirm, und der Besucher ist bereits drin: Er hat
 * seine Datei schon ausgewählt, der teuerste Schritt liegt hinter ihm.
 *
 * ═══ WARUM `<dialog>` ═══
 * Fokusfalle, Escape, Inertisierung des Hintergrunds und die Rückgabe des
 * Fokus an den auslösenden Knopf sind nativ enthalten. Nachgebaut sind das
 * rund hundert Zeilen, die regelmäßig undicht sind.
 *
 * ═══ WARUM DIE DATEI AUCH BEIM WHATSAPP-WEG ZU UNS GEHT ═══
 * Über einen `wa.me`-Link lässt sich keine Datei mitgeben, nur Text. Ohne
 * eigenen Versand müsste der Besucher sein Angebot im Chat ein zweites Mal
 * auswählen – und genau dort bricht die Hälfte ab. Deshalb geht die Datei
 * bei BEIDEN Wegen über unsere Route an Bitrix; der WhatsApp-Weg legt einen
 * Lead mit Vorgangsnummer an und öffnet den Chat mit einem Text, der diese
 * Nummer trägt.
 */

type Schritt = "kanal" | "whatsapp" | "formular" | "fertig";

/**
 * ═══ EIN DIALOG, VIELE AUSLÖSER ═══
 * Der Upload wird nicht nur im Hero angeboten, sondern nach jeder Sektion
 * und in der mitlaufenden Leiste auf dem Handy. Alle diese Stellen müssen
 * denselben Dateidialog und denselben Vollbild-Ablauf bedienen – sonst gäbe
 * es mehrere `<input type="file">`, mehrere `<dialog>` und je nach Klick den
 * falschen Zustand.
 *
 * Deshalb hält der Provider beides genau einmal, und jeder Knopf ruft über
 * `useUpload()` dieselbe Funktion auf.
 *
 * ⚠️ `oeffneDateiauswahl` MUSS aus einer Klickreaktion heraus aufgerufen
 * werden. Ein `input.click()` ohne Nutzergeste wird von jedem Browser
 * ignoriert – die Auswahl ginge dann still nicht auf.
 */
type UploadKontext = {
  /** Öffnet den Dateiwähler. Nur aus einer Klickreaktion heraus. */
  oeffneDateiauswahl: () => void;
  /** Übergibt eine Datei direkt – für Drag & Drop, wo der Browser sie
   *  bereits liefert und kein Dialog nötig ist. */
  uebergibDatei: (datei: File) => void;
};

const Kontext = createContext<UploadKontext | null>(null);

export function useUpload() {
  const wert = useContext(Kontext);
  if (!wert) {
    throw new Error("useUpload benötigt <AvUploadProvider> im Baum darüber.");
  }
  return wert;
}

export function AvUploadProvider({ children }: { children: React.ReactNode }) {
  const eingabeRef = useRef<HTMLInputElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const buehne = useRef<HTMLDivElement>(null);
  const titelRef = useRef<HTMLHeadingElement>(null);
  const uid = useId().replace(/:/g, "");

  const [offen, setOffen] = useState(false);
  const [schritt, setSchritt] = useState<Schritt>("kanal");
  const [datei, setDatei] = useState<File | null>(null);
  const [dateiFehler, setDateiFehler] = useState("");
  const [lead, setLead] = useState<Lead>({ ...LEER, variante: "angebot" });
  const [fehler, setFehler] = useState<Fehler>({});
  const [sendet, setSendet] = useState(false);
  const [stoerung, setStoerung] = useState("");
  const [vorgang, setVorgang] = useState<number | null>(null);

  /* ---------- Öffnen / Schließen ---------- */
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;

    if (offen && !el.open) {
      el.showModal();
      document.body.style.overflow = "hidden";
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 });
        gsap.fromTo(
          el.querySelectorAll("[data-up-in]"),
          { y: 20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.07, ease: "power3.out", delay: 0.05 },
        );
      }
    }
    if (!offen && el.open) el.close();
  }, [offen]);

  /** Aufräumen an EINER Stelle: `close` feuert auch bei Escape, nicht nur
   *  beim eigenen Knopf. */
  const aufraeumen = useCallback(() => {
    document.body.style.overflow = "";
    setOffen(false);

    // Nach erfolgreicher Übermittlung beim nächsten Öffnen frisch beginnen.
    // Bricht jemand dagegen ab, bleibt seine Datei gewählt – ein
    // versehentliches Escape darf keine Arbeit vernichten.
    if (schritt === "fertig") {
      setSchritt("kanal");
      setDatei(null);
      setLead({ ...LEER, variante: "angebot" });
      setFehler({});
      setStoerung("");
      setVorgang(null);
      if (eingabeRef.current) eingabeRef.current.value = "";
    }
  }, [schritt]);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    el.addEventListener("close", aufraeumen);
    return () => el.removeEventListener("close", aufraeumen);
  }, [aufraeumen]);

  /** Schrittwechsel mit weichem Übergang und Fokus auf die neue Frage –
   *  ohne den weiß ein Tastatur- oder Screenreader-Nutzer nicht, dass sich
   *  etwas getan hat. */
  const wechsle = (ziel: Schritt) => {
    setSchritt(ziel);
    requestAnimationFrame(() => {
      titelRef.current?.focus();
      if (!buehne.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }
      gsap.fromTo(
        buehne.current,
        { x: 20, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 0.4, ease: "power2.out" },
      );
    });
  };

  function waehleDatei(f: File | null) {
    if (!f) return;
    const meldung = pruefeDatei(f);
    if (meldung) {
      setDateiFehler(meldung);
      return;
    }
    setDateiFehler("");
    setDatei(f);
    setSchritt("kanal");
    setOffen(true);
  }

  /* Der einzige Weg, den Dateiwähler zu öffnen. `value` wird vorher
     geleert, damit dieselbe Datei zweimal hintereinander gewählt werden
     kann – ohne das feuert `change` beim zweiten Mal nicht, und für den
     Nutzer passiert dann einfach nichts. */
  const oeffneDateiauswahl = useCallback(() => {
    const el = eingabeRef.current;
    if (!el) return;
    el.value = "";
    el.click();
  }, []);

  const wert = useMemo(
    () => ({ oeffneDateiauswahl, uebergibDatei: waehleDatei }),
    // `waehleDatei` ist eine Funktionsdeklaration im Komponentenkörper und
    // wird bei jedem Rendern neu erzeugt – sie hier aufzuführen würde das
    // Memo wirkungslos machen. Sie schließt nur über `setState`-Funktionen,
    // die React stabil hält, also ist die Auslassung sicher.
    [oeffneDateiauswahl],
  );

  async function uebermittle(nutzlast: Lead): Promise<number | null> {
    const fd = new FormData();
    fd.append(
      "daten",
      JSON.stringify({
        ...nutzlast,
        quelle: nutzlast.nurUpload ? "AV-Upload · WhatsApp" : "AV-Upload · Formular",
        website: "",
      }),
    );
    if (datei) fd.append("datei", datei, datei.name);

    // Kein Content-Type von Hand: Bei FormData muss der Browser ihn samt
    // Boundary setzen, sonst kann der Server die Teile nicht trennen.
    const antwort = await fetch("/api/lead", { method: "POST", body: fd });
    const daten = await antwort.json();

    if (!antwort.ok || !daten.ok) {
      setStoerung(daten?.grund ?? "Die Übermittlung ist gerade nicht möglich.");
      if (daten?.fehler) setFehler(daten.fehler);
      return null;
    }
    return typeof daten.id === "number" ? daten.id : 0;
  }

  /**
   * Weg A – WhatsApp.
   *
   * ⚠️ Wird erst aufgerufen, nachdem Nummer und Einwilligung vorliegen
   * (Schritt „whatsapp"). Ein früherer Entwurf sprang direkt von der
   * Kanalwahl hierher und setzte die Einwilligung dabei hart auf `true` –
   * das war weder eine Einwilligung noch ein verwertbarer Lead: Wer danach
   * nicht in den Chat schrieb, hinterließ ein Angebot ohne Namen, ohne
   * Nummer und ohne Zuordnung.
   */
  async function perWhatsApp(event: React.FormEvent) {
    event.preventDefault();
    const nutzlast: Lead = { ...lead, nurUpload: true };
    const f = pruefe(nutzlast, "alle");
    setFehler(f);
    if (hatFehler(f)) return;

    setSendet(true);
    setStoerung("");

    /* Das Fenster wird VOR dem Warten geöffnet und erst danach befüllt:
       Safari und iOS erlauben `window.open` nur direkt in der Klickreaktion;
       nach einem `await` gilt der Aufruf als automatisch und wird blockiert –
       der Besucher landet dann nirgends. */
    const fenster = window.open("", "_blank");

    try {
      const id = await uebermittle(nutzlast);
      if (id === null) {
        fenster?.close();
        return;
      }
      const text = id
        ? `Hallo, ich habe mein Angebot zur Prüfung hochgeladen. Vorgangsnummer ${id}.`
        : "Hallo, ich habe mein Angebot zur Prüfung hochgeladen.";
      const ziel = `https://wa.me/${SITE.whatsapp.number}?text=${encodeURIComponent(text)}`;

      if (fenster) fenster.location.href = ziel;
      else window.location.href = ziel;

      setVorgang(id);
      wechsle("fertig");
    } catch {
      fenster?.close();
      setStoerung("Die Übermittlung ist gerade nicht möglich.");
    } finally {
      setSendet(false);
    }
  }

  /** Weg B – Formular. */
  async function absenden(event: React.FormEvent) {
    event.preventDefault();
    const f = pruefe(lead, "alle");
    setFehler(f);
    if (hatFehler(f)) return;

    setSendet(true);
    setStoerung("");
    try {
      const id = await uebermittle(lead);
      if (id === null) return;
      setVorgang(id);
      wechsle("fertig");
    } catch {
      setStoerung("Die Übermittlung ist gerade nicht möglich.");
    } finally {
      setSendet(false);
    }
  }

  const setzeFeld = <K extends keyof Lead>(feld: K, wert: Lead[K]) => {
    setLead((l) => ({ ...l, [feld]: wert }));
    setFehler((f) => (f[feld] ? { ...f, [feld]: undefined } : f));
  };

  return (
    <Kontext.Provider value={wert}>
      {children}

      {/* Der eine Dateiwähler der Seite. Er liegt unsichtbar im Provider;
          jeder Auslöser klickt ihn über `oeffneDateiauswahl()` an. */}
      <input
        ref={eingabeRef}
        id={`${uid}-datei`}
        type="file"
        accept={DATEI_ACCEPT}
        onChange={(e) => waehleDatei(e.target.files?.[0] ?? null)}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />

      {/* Fehler zur Dateiwahl erscheinen dort, wo sie entstehen: als
          schwebende Meldung, weil der auslösende Knopf irgendwo auf der
          Seite stehen kann. */}
      {dateiFehler && (
        <div
          role="alert"
          className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-[28rem] rounded-ep bg-ep-accent-strong px-5 py-4 text-white shadow-[0_16px_40px_-12px_rgba(0,0,0,0.5)]"
        >
          <div className="flex items-start gap-3">
            <p className="flex-1 text-sm font-medium">{dateiFehler}</p>
            <button
              type="button"
              onClick={() => setDateiFehler("")}
              className="shrink-0 rounded p-0.5 outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X className="size-4" aria-hidden="true" />
              <span className="sr-only">Meldung schließen</span>
            </button>
          </div>
        </div>
      )}

      {/* ══════════════ DAS VOLLBILD ══════════════ */}
      <dialog
        ref={dialog}
        aria-labelledby={`${uid}-titel`}
        /* Das native Element bringt eigene Maße, Ränder und einen weißen
           Grund mit – ohne Zurücksetzen sitzt der Vollbild-Dialog in einem
           Kasten in der Mitte. */
        data-surface="dark"
        className="m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden bg-ep-navy-deep p-0 text-white backdrop:bg-ep-navy-deep/95"
      >
        <div
          aria-hidden="true"
          className="ep-skala ep-skala-auslauf pointer-events-none absolute inset-0"
        />

        <div className="relative flex h-dvh flex-col">
          {/* Kopf: Marke und Schließen. 44 px Trefferfläche. */}
          <div className="ep-container flex h-[var(--nav-h)] shrink-0 items-center justify-between">
            {/* Dieselbe Marke wie die Kopfleiste dahinter. Der Dialog ist
                ein Vollbild – ohne sie wüsste der Besucher im Moment der
                Kontaktwahl nicht mehr, wem er gerade seine Datei gibt. */}
            <AvWortmarke kompakt />
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              className="-mr-2 inline-flex items-center gap-2 rounded-ep px-2 py-2 text-white/80 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-ep-accent-strong"
            >
              <span className="t-key hidden sm:inline">Schließen</span>
              <X className="size-6" aria-hidden="true" />
              <span className="sr-only">Schließen</span>
            </button>
          </div>

          {/* Mittige Spalte, vertikal zentriert: eine Frage pro Bildschirm.
              `overflow-y-auto` als Sicherheitsnetz für sehr kleine Geräte,
              `data-lenis-prevent`, weil Lenis Rad-Ereignisse global abfängt
              und das Scrollen im Dialog sonst wirkungslos bliebe. */}
          <div
            data-lenis-prevent
            className="ep-container flex min-h-0 flex-1 flex-col justify-center overflow-y-auto overscroll-contain py-8"
          >
            <div ref={buehne} className="mx-auto w-full max-w-[34rem]">
              {/* Die gewählte Datei steht über allem – sie ist der Grund,
                  warum dieser Bildschirm überhaupt offen ist. */}
              {datei && schritt !== "fertig" && (
                <div
                  data-up-in
                  className="mb-8 flex items-center gap-3 rounded-ep border border-ep-line-dark bg-white/5 px-4 py-3"
                >
                  <FileText className="size-5 shrink-0 text-ep-accent" aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {datei.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => eingabeRef.current?.click()}
                    className="t-key shrink-0 text-white/60 underline underline-offset-4 outline-none transition-colors hover:text-white focus-visible:text-white"
                  >
                    Ändern
                  </button>
                </div>
              )}

              {/* ══════ Kanalwahl ══════ */}
              {schritt === "kanal" && (
                <div>
                  <h2
                    id={`${uid}-titel`}
                    ref={titelRef}
                    tabIndex={-1}
                    data-up-in
                    className="t-h2 max-w-[14ch] outline-none"
                  >
                    Wie sollen wir <span className="text-ep-accent">antworten?</span>
                  </h2>

                  <div data-up-in className="mt-10 flex flex-col gap-3">
                    {/* WhatsApp zuerst und in Kanalfarbe: Er ist laut
                        Kickoff der Hauptkanal und der schnellere Weg –
                        ein Klick gegen drei Felder. */}
                    <button
                      type="button"
                      onClick={() => wechsle("whatsapp")}
                      className="group flex items-center justify-between gap-4 rounded-ep bg-ep-whatsapp px-6 py-5 text-left outline-none transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-white"
                    >
                      <span className="text-[#04381A]">
                        <span className="block text-lg font-bold">Per WhatsApp</span>
                        <span className="mt-0.5 block text-sm opacity-80">
                          Nur Ihre Nummer, dann geht es direkt in den Chat
                        </span>
                      </span>
                      <ArrowRight
                        className="size-6 shrink-0 text-[#04381A] transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => wechsle("formular")}
                      className="group flex items-center justify-between gap-4 rounded-ep border border-white/30 px-6 py-5 text-left outline-none transition-colors hover:border-white/60 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-ep-accent-strong"
                    >
                      <span>
                        <span className="block text-lg font-bold text-white">
                          Per E-Mail
                        </span>
                        <span className="mt-0.5 block text-sm text-white/70">
                          Sie hinterlassen Ihre Angaben, wir schreiben Ihnen
                        </span>
                      </span>
                      <ArrowRight
                        className="size-6 shrink-0 text-ep-accent transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </button>
                  </div>

                  {/* Der Hinweis steht VOR der Wahl, nicht erst danach: Ab
                      hier wird die Datei übermittelt, und das muss man
                      wissen, bevor man sich für einen Weg entscheidet. */}
                  <p className="mt-6 text-sm leading-relaxed text-white/55">
                    In beiden Fällen übermitteln wir Ihr Angebot an uns, um es
                    zu prüfen. Im nächsten Schritt fragen wir Sie danach.
                  </p>

                  {stoerung && <Stoerung text={stoerung} />}
                </div>
              )}

              {/* ══════ WhatsApp: Nummer und Einwilligung ══════ */}
              {schritt === "whatsapp" && (
                <form onSubmit={perWhatsApp} noValidate>
                  <h2
                    id={`${uid}-titel`}
                    ref={titelRef}
                    tabIndex={-1}
                    className="t-h2 max-w-[15ch] outline-none"
                  >
                    Unter welcher Nummer{" "}
                    <span className="text-ep-accent">erreichen wir Sie?</span>
                  </h2>

                  <div className="mt-10">
                    <Feld
                      id={`${uid}-tel`}
                      label="Mobilnummer"
                      fehler={fehler.telefon}
                      hinweis="Damit wir Ihre Auswertung dem richtigen Chat zuordnen können."
                    >
                      <input
                        id={`${uid}-tel`}
                        value={lead.telefon}
                        onChange={(e) => setzeFeld("telefon", e.target.value)}
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        autoFocus
                        placeholder="0170 1234567"
                        aria-invalid={!!fehler.telefon}
                        className={eingabe}
                      />
                    </Feld>

                    <div className="mt-7">
                      <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-white/85">
                        <input
                          type="checkbox"
                          checked={lead.einwilligung}
                          onChange={(e) => setzeFeld("einwilligung", e.target.checked)}
                          aria-invalid={!!fehler.einwilligung}
                          className="mt-0.5 size-5 shrink-0 accent-ep-accent-strong"
                        />
                        <span>
                          Wir dürfen Ihr Angebot und Ihre Nummer speichern, um es zu
                          prüfen und Sie zu kontaktieren.{" "}
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
                  </div>

                  {stoerung && <Stoerung text={stoerung} />}

                  <div className="mt-8 flex items-center gap-5">
                    <button
                      type="submit"
                      disabled={sendet}
                      className="inline-flex items-center gap-2.5 rounded-ep bg-ep-whatsapp px-6 py-3.5 text-base font-bold text-[#04381A] outline-none transition-[transform,background-color] duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {sendet ? "Wird übermittelt …" : "Angebot senden und Chat öffnen"}
                      {!sendet && <ArrowRight className="size-5" aria-hidden="true" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => wechsle("kanal")}
                      className="text-white/70 underline underline-offset-4 outline-none transition-colors hover:text-white focus-visible:text-white"
                    >
                      Zurück
                    </button>
                  </div>
                </form>
              )}

              {/* ══════ Formular ══════ */}
              {schritt === "formular" && (
                <form onSubmit={absenden} noValidate>
                  <h2
                    id={`${uid}-titel`}
                    ref={titelRef}
                    tabIndex={-1}
                    className="t-h2 max-w-[16ch] outline-none"
                  >
                    Wohin dürfen wir <span className="text-ep-accent">antworten?</span>
                  </h2>

                  <div className="mt-10 flex flex-col gap-5">
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

                    <Feld
                      id={`${uid}-mail`}
                      label="E-Mail"
                      fehler={fehler.email ?? fehler.telefon}
                    >
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

                    {/* PLZ statt voller Adresse: Sie genügt, um regional zu
                        vergleichen, und kostet eine Zeile statt vier. */}
                    <Feld
                      id={`${uid}-plz`}
                      label="Postleitzahl"
                      fehler={fehler.plz}
                      hinweis="Damit wir regionale Preise vergleichen können."
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
                          Wir dürfen Ihre Angaben und Ihr Angebot verwenden, um Sie
                          zu dieser Anfrage zu kontaktieren.{" "}
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
                  </div>

                  {stoerung && <Stoerung text={stoerung} />}

                  <div className="mt-8 flex items-center gap-5">
                    <button type="submit" disabled={sendet} className={knopf}>
                      {sendet ? "Wird gesendet …" : "Angebot prüfen lassen"}
                      {!sendet && <ArrowRight className="size-5" aria-hidden="true" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => wechsle("kanal")}
                      className="text-white/70 underline underline-offset-4 outline-none transition-colors hover:text-white focus-visible:text-white"
                    >
                      Zurück
                    </button>
                  </div>
                </form>
              )}

              {/* ══════ Schluss ══════ */}
              {schritt === "fertig" && (
                <div>
                  <span className="grid size-14 place-items-center rounded-full bg-ep-accent-strong text-white">
                    <Check className="size-7" strokeWidth={2.5} aria-hidden="true" />
                  </span>
                  <h2
                    id={`${uid}-titel`}
                    ref={titelRef}
                    tabIndex={-1}
                    className="t-h2 mt-8 max-w-[16ch] outline-none"
                  >
                    Ihr Angebot ist{" "}
                    <span className="text-ep-accent">angekommen.</span>
                  </h2>
                  {/* Bestätigungen sagen, was als Nächstes passiert – sonst
                      bleibt der Nutzer mit einem Häkchen und einer offenen
                      Frage zurück. */}
                  <p className="t-lead mt-6 max-w-[44ch] text-white/85">
                    Wir lesen es Position für Position und melden uns innerhalb
                    von 24&nbsp;Stunden mit der Auswertung.
                  </p>
                  {vorgang ? (
                    <p className="t-key mt-8 inline-block rounded-ep border border-ep-line-dark px-4 py-2 text-white/70">
                      Vorgang {vorgang}
                    </p>
                  ) : null}

                  <div className="mt-10">
                    <button
                      type="button"
                      onClick={() => dialog.current?.close()}
                      className={knopf}
                    >
                      Zurück zur Seite
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </dialog>
    </Kontext.Provider>
  );
}

/* ════════════════════════════════════════════════════════════════
   DIE AUSLÖSER
   ════════════════════════════════════════════════════════════════ */

/**
 * Der Knopf. Überall einsetzbar, öffnet immer denselben Dateiwähler.
 *
 * Bewusst ein `<button>` und kein `<label for>`: Die Auslöser stehen quer
 * über die Seite verteilt, der Input liegt im Provider – ein `for` über
 * mehrere Sektionen hinweg wäre zwar gültig, aber niemand fände den
 * Zusammenhang beim Lesen wieder.
 */
export function AvUploadKnopf({
  label = "Angebot hochladen",
  className,
  ton = "voll",
}: {
  label?: string;
  className?: string;
  /** `voll` = orange Fläche (Haupthandlung), `leise` = Kontur. */
  ton?: "voll" | "leise";
}) {
  const { oeffneDateiauswahl } = useUpload();

  return (
    <button
      type="button"
      onClick={oeffneDateiauswahl}
      className={cn(
        "group inline-flex items-center justify-center gap-3 rounded-ep text-center font-bold outline-none transition-[transform,background-color,border-color] duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ep-accent-strong focus-visible:ring-offset-2",
        ton === "voll"
          ? "bg-ep-accent-strong px-7 py-5 text-[clamp(1rem,1.4vw,1.1875rem)] text-white shadow-[0_16px_40px_-16px_rgba(242,106,33,0.8)] hover:bg-[#d95c17] focus-visible:ring-offset-ep-navy-deep"
          : "border border-current/30 px-6 py-4 text-base hover:border-current/60 focus-visible:ring-offset-transparent",
        className,
      )}
    >
      <Upload className="size-5 shrink-0" aria-hidden="true" />
      {label}
      <ArrowRight
        className="size-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
        aria-hidden="true"
      />
    </button>
  );
}

/**
 * Die Ablagefläche – nur dort, wo Platz ist (Hero ab lg).
 *
 * Sie zeigt, dass hier etwas hineingehört, statt es zu behaupten, und auf
 * dem Desktop kann man tatsächlich etwas hineinziehen. Auf dem Handy wäre
 * sie eine große Fläche mit der Aufschrift „hierher ziehen" – und ziehen
 * kann man dort nichts.
 */
export function AvUploadZone({ className }: { className?: string }) {
  const { oeffneDateiauswahl, uebergibDatei } = useUpload();
  const [ueberZone, setUeberZone] = useState(false);

  return (
    <button
      type="button"
      onClick={oeffneDateiauswahl}
      onDragOver={(e) => {
        e.preventDefault();
        setUeberZone(true);
      }}
      onDragLeave={() => setUeberZone(false)}
      onDrop={(e) => {
        e.preventDefault();
        setUeberZone(false);
        const f = e.dataTransfer.files?.[0];
        if (f) uebergibDatei(f);
      }}
      className={cn(
        "flex w-full cursor-pointer flex-col items-center gap-4 rounded-ep border-2 border-dashed bg-white/[0.04] px-8 py-14 text-center outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ep-accent-strong",
        ueberZone
          ? "border-ep-accent-strong bg-white/10"
          : "border-white/25 hover:border-ep-accent-strong/70 hover:bg-white/[0.07]",
        className,
      )}
    >
      <span className="grid size-14 place-items-center rounded-full bg-ep-accent-strong text-white shadow-[0_12px_32px_-12px_rgba(242,106,33,0.9)]">
        <Upload className="size-6" aria-hidden="true" />
      </span>
      <span>
        <span className="block text-xl font-bold text-white">
          Angebot hochladen
        </span>
        <span className="mt-1.5 block text-white/65">
          Datei auswählen oder hierher ziehen
        </span>
      </span>
      <span className="t-key text-white/45">PDF, JPG oder PNG · bis 10 MB</span>
    </button>
  );
}

/* ---------------------------------------------------------------- */

const etikett = "t-label text-ep-accent";

const eingabe =
  "mt-2 w-full rounded-t-[6px] border-b-2 border-white/35 bg-white/[0.07] px-4 py-3 text-base text-white outline-none transition-colors placeholder:text-white/40 hover:border-white/55 hover:bg-white/10 focus:border-ep-accent-strong focus:bg-white/10 sm:text-lg";

const knopf =
  "inline-flex items-center gap-2.5 rounded-ep bg-ep-accent-strong px-6 py-3.5 text-base font-semibold text-white outline-none transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-[#d95c17] focus-visible:ring-2 focus-visible:ring-ep-accent-strong focus-visible:ring-offset-2 focus-visible:ring-offset-ep-navy-deep disabled:cursor-not-allowed disabled:opacity-60";

function Feld({
  id,
  label,
  hinweis,
  fehler,
  children,
}: {
  id: string;
  label: string;
  hinweis?: string;
  fehler?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className={etikett}>
        {label}
      </label>
      {children}
      {hinweis && !fehler && (
        <p className="mt-1.5 text-[13px] leading-snug text-white/70">{hinweis}</p>
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

function Stoerung({ text }: { text: string }) {
  return (
    <div role="alert" className="mt-6 border-l-2 border-ep-accent-strong bg-white/10 px-4 py-3">
      {/* Fehler entschuldigen sich nicht und bleiben nicht vage – sie sagen,
          was jetzt geht. */}
      <p className="font-semibold text-white">{text}</p>
      <p className="mt-1 text-sm text-white/85">
        Erreichen Sie uns bitte direkt unter {SITE.phone.display}.
      </p>
    </div>
  );
}
