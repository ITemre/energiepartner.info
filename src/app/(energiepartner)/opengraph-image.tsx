import { ImageResponse } from "next/og";

/**
 * Das Link-Vorschaubild von energiepartner.info.
 *
 * Schwesterdatei zu `(angebote)/av/opengraph-image.tsx`; die Begründungen
 * zu Format, fehlender Markenschrift und dunkler Fläche stehen dort und
 * gelten hier unverändert.
 *
 * Der Unterschied ist der Inhalt, und er folgt der Aufgabentrennung aus dem
 * Briefing (Abschnitt 3): Diese Domain baut Vertrauen auf, sie erzeugt
 * keine Anfragen. Deshalb steht hier der Claim und die Rolle – nicht eine
 * Frage mit Handlungsaufforderung.
 *
 * „herstellerunabhängig" und „anbieterübergreifend" sind die beiden
 * erlaubten Formulierungen. Das absolute „unabhängig" ist seit dem 21.07.
 * verbindlich gesperrt (Briefing 2), und eine Linkvorschau ist der
 * sichtbarste Ort, an dem so ein Wort versehentlich wieder auftaucht.
 */
export const alt = "energiepartner – Ihre Energie. Ihr Vorteil.";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          backgroundImage: `radial-gradient(120% 90% at 85% 15%, rgba(242,106,33,0.28) 0%, rgba(242,106,33,0.08) 45%, rgba(10,35,55,0) 70%)`,
        }}
      >
        {/* DER SONNEN-PUNKT STEHT VOR DEM WORT, NICHT ÜBER DEM „i".
            Ein erster Versuch hat die Wortmarke in „energ" + gesetzter Punkt
            über einem punktlosen „ı" + „epartner" zerlegt, um das
            Markenmotiv nachzubauen. Im fertigen PNG las sich das als
            „energ | epartner" – zwei Wörter mit einem Strich dazwischen,
            weil die eingebaute Schrift andere Vorbreiten hat als Archivo und
            die drei Teile nicht zusammenrücken.

            Ohne die Markenschrift ist das Motiv nicht sauber zu treffen.
            Ein vorangestellter Punkt ist die ehrlichere Lösung: Er trägt
            dieselbe Farbe und dieselbe Form, gibt sich aber als Zeichen
            neben dem Namen aus statt als schlecht gesetztes „i". */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: 14,
              background: ORANGE,
              display: "flex",
            }}
          />
          <span
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: PAPER,
              letterSpacing: "-0.01em",
            }}
          >
            energiepartner
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
            Wärmepumpe · Photovoltaik · Stromtarif
          </span>

          <span
            style={{
              marginTop: 22,
              fontSize: 96,
              fontWeight: 700,
              color: PAPER,
              lineHeight: 1.04,
              letterSpacing: "-0.03em",
            }}
          >
            Ihre Energie.
          </span>
          <span
            style={{
              fontSize: 96,
              fontWeight: 700,
              color: ORANGE,
              lineHeight: 1.04,
              letterSpacing: "-0.03em",
            }}
          >
            Ihr Vorteil.
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {[
            "Herstellerunabhängig beraten",
            "Bis zu 70 % Förderung",
            "Kostenlose Beratung",
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
