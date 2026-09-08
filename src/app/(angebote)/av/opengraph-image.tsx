import { ImageResponse } from "next/og";

/**
 * Das Link-Vorschaubild von angebote-vergleichen.info.
 *
 * WARUM DIESE SEITE EINS BRAUCHT, UND ZWAR MEHR ALS JEDE ANDERE * WhatsApp ist laut Kickoff der Hauptkanal, und der Traffic kommt per QR
 * aus einem Brief und aus Anzeigen. Ein erheblicher Teil der Besucher sieht
 * die Marke deshalb ZUERST als geteilte Linkvorschau in einem Chat – lange
 * bevor der Hero lädt. Ohne Bild ist das eine graue Zeile Text.
 *
 * GENERIERT STATT ABGELEGT * Als `.tsx` und nicht als PNG im Repository: Das Bild trägt Copy, und Copy
 * ändert sich. Eine abgelegte Datei müsste jemand in einem Grafikprogramm
 * nachziehen und würde beim nächsten Textwechsel vergessen; hier steht der
 * Satz im selben Repository wie der Hero und im selben Review.
 *
 * KEINE MARKENSCHRIFT. `ImageResponse` braucht Schriftdateien als
 * ArrayBuffer, und Archivo liegt nicht im Repository – es käme nur über
 * einen Netzabruf zur Bauzeit herein, der den Build zum Erliegen bringt,
 * sobald Google Fonts hustet. Das Bild läuft deshalb in der eingebauten
 * Schrift. Es trägt die Marke über Farbe, Fläche und den Leucht-Punkt, und
 * das reicht: Eine Linkvorschau wird in 200 px Breite gelesen, dort
 * unterscheidet niemand zwei Grotesken.
 *
 * FLÄCHE DUNKEL, obwohl der Hero seit dem 08.09. hell ist. In einem
 * WhatsApp-Chat steht die Vorschau auf hellem Grund zwischen hellen
 * Blasen – ein Bild in Papierfarbe verschwindet dort in der Oberfläche.
 * Navy ist die zweite Fläche der Marke und hebt sich in beiden
 * Chat-Themes ab.
 */
export const alt =
  "angebote-vergleichen.info – Ist Ihr Wärmepumpen-Angebot vollständig?";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Rohwerte statt Tokens: `ImageResponse` rendert außerhalb des
   Browser-Kontexts, CSS-Variablen aus `globals.css` existieren dort nicht.
   Die Werte sind dieselben wie im Token-Block – wer sie dort ändert, muss
   hier mit. */
const NAVY_DEEP = "#0A2337";
const ORANGE = "#F26A21";
const PAPER = "#FBF6EE";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: NAVY_DEEP,
          padding: "72px 80px",
          /* Derselbe warme Schein wie im Hero, nur auf dunklem Grund. Er
             gibt der Fläche eine Richtung, ohne eine Kante einzuziehen. */
          backgroundImage: `radial-gradient(120% 90% at 85% 15%, rgba(242,106,33,0.28) 0%, rgba(242,106,33,0.08) 45%, rgba(10,35,55,0) 70%)`,
        }}
      >
        {/* Absender oben – wer eine Datei hochladen soll, muss sehen, wo er
            landet, bevor er tippt. */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              fontSize: 30,
              fontWeight: 700,
              color: PAPER,
              letterSpacing: "-0.01em",
            }}
          >
            angebote-vergleichen
          </span>
          {/* Der Leucht-Punkt der Marke, an der Stelle des Domain-Punkts. */}
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: 12,
              background: ORANGE,
              display: "flex",
            }}
          />
          <span style={{ fontSize: 30, fontWeight: 700, color: "#8FA6B8" }}>
            info
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: 26,
              fontWeight: 600,
              color: ORANGE,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Kostenlose Angebotsprüfung
          </span>

          {/* Die Frage des Heros, wörtlich. Eine Vorschau, die etwas
              anderes verspricht als die Seite dahinter, ist ein gebrochener
              Vorschuss.

              ZWEI GESETZTE ZEILEN STATT EINES UMBRUCHS.
              Zuerst stand hier ein Fließtext mit `maxWidth` und einem
              farbigen `<span>` mittendrin. Satori – die Engine hinter
              `ImageResponse` – bricht so einen gemischten Inhalt nicht um:
              Im gebauten Bild lief „vollständig?" rechts aus der Fläche
              heraus und war zur Hälfte abgeschnitten. Das fällt in keinem
              Typecheck und in keinem Lint auf, nur im fertigen PNG.

              Die Zeilen stehen deshalb einzeln, wie im Bild von
              energiepartner.info auch. Das ist hier ohnehin die bessere
              Lösung: Der Umbruch sitzt vor dem Wort, das die Farbe trägt,
              und liegt damit fest statt im Ermessen einer Textengine. */}
          <span
            style={{
              marginTop: 22,
              fontSize: 74,
              fontWeight: 700,
              color: PAPER,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
            }}
          >
            Ist Ihr Wärmepumpen-Angebot
          </span>
          <span
            style={{
              fontSize: 74,
              fontWeight: 700,
              color: ORANGE,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
            }}
          >
            vollständig?
          </span>
        </div>

        {/* Die drei Zusagen aus dem Hero – dieselbe Trennung der
            Zeitangaben: 3 Minuten ist die Übermittlung, 24 Stunden die
            Auswertung. */}
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {[
            "In 3 Minuten übermittelt",
            "Antwort in 24 Stunden",
            "Ohne Verpflichtung",
          ].map((zeile, i) => (
            <div
              key={zeile}
              style={{ display: "flex", alignItems: "center", gap: 28 }}
            >
              {i > 0 && (
                <span
                  style={{
                    width: 1,
                    height: 26,
                    background: "rgba(255,255,255,0.25)",
                    display: "flex",
                  }}
                />
              )}
              <span style={{ fontSize: 27, color: "rgba(251,246,238,0.82)" }}>
                {zeile}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
