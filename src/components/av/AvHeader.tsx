"use client";

import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { AvWortmarke } from "@/components/av/AvWortmarke";
import { useNavTheme } from "@/components/nav/useNavTheme";

/**
 * Kopfleiste von angebote-vergleichen.info.
 *
 * EIGENE MARKE * Hier stand die energiepartner-Wortmarke, und die Seite sah dadurch aus
 * wie dieselbe – obwohl sie eine andere Aufgabe hat und andere Leute
 * anspricht. Jetzt trägt sie ihren eigenen Namen, mit der Herkunft als
 * Unterzeile (siehe `AvWortmarke`).
 *
 * OHNE NAVIGATION * Auf energiepartner.info führen Sprungmarken durch einen
 * Unternehmensauftritt – dort darf man stöbern, das ist der Zweck. Hier
 * kommt der Besucher per QR aus einem Brief mit genau einer Frage und soll
 * genau eine Handlung finden. Jeder zusätzliche Link ist an dieser Stelle
 * ein Ausgang.
 *
 * Auch die Wortmarke ist bewusst kein Link: Auf der eigenen Domain wäre er
 * ein Klick ins Nichts, und auf energiepartner.info (wo `/av` ebenfalls
 * erreichbar ist) würde er aus der Prüfstrecke heraustragen.
 */
export function AvHeader() {
  const { onDark, lifted } = useNavTheme();

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        lifted
          ? onDark
            ? "border-b border-ep-line-dark bg-ep-navy-deep/80 backdrop-blur-md"
            : "border-b border-ep-line bg-ep-paper/85 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <div className="ep-container flex h-[var(--nav-h)] items-center justify-between gap-4">
        {/* Die Wortmarke ist gesetzter Text, kein Bild – sie muss ihre Farbe
            mit dem Band wechseln können, und ein zweites SVG mit Crossfade
            wäre für vier Wörter unverhältnismäßig. */}
        <AvWortmarke
          ton={onDark ? "hell" : "dunkel"}
          /* Auf schmalen Geräten ohne Herkunftszeile: Zwei Zeilen in einer
             60 px hohen Leiste stehen sonst gedrängt neben dem Knopf. */
          kompakt
        />

        {/* `solid` STATT `quiet` (08.09.), und die Begründung ist
            dieselbe Regel wie drüben, nur mit umgekehrtem Vorzeichen.

            `WhatsAppButton` kennt drei Töne, weil zwei volle Grünflächen im
            selben Bild den Kanal gegen die Marke gewinnen lassen. Auf
            energiepartner.info ist der Hero-CTA grün, deshalb trägt die
            Kopfleiste dort `accent` (Orange).

            Hier ist es andersherum: Der Auslöser im ersten Bild ist der
            orange Upload-Knopf. Ein oranger Knopf in der Leiste wäre die
            Kollision – zweimal dieselbe Farbe für zwei verschiedene
            Handlungen, und der Besucher müsste lesen, um sie zu
            unterscheiden. Grün sagt auf einen Blick „anderer Weg".

            `quiet` war die alte Fassung und stammt aus der Zeit des dunklen
            Heros. Auf Papier ist eine Kontur in `currentColor/30` rund
            1,4:1 – der Knopf war faktisch nicht da, obwohl er der einzige
            Dauer-Kontaktweg der Seite ist. */}
        <div className="flex items-center">
          <WhatsAppButton
            href={SITE.whatsapp.angebotHref}
            tone="solid"
            aria-label="Angebot per WhatsApp schicken"
            label={<span className="hidden sm:inline">Angebot schicken</span>}
            className="max-sm:size-10 max-sm:px-0"
          />
        </div>
      </div>
    </header>
  );
}
