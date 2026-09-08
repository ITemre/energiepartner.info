import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * Profilbilder echter Google-Rezensenten.
     *
     * `authorAttribution.photoUri` aus der Places API zeigt auf
     * `lh3.googleusercontent.com` (gelegentlich lh4/lh5/lh6). `next/image`
     * lädt aus Sicherheitsgründen keinen fremden Host, der hier nicht steht –
     * es wirft stattdessen, und die Bilder bleiben leer.
     *
     * Aufgefallen ist es erst mit echten Daten: Die Platzhalter-Rezensenten
     * liegen als Dateien unter `public/stimmen/`, sind also lokal und
     * brauchen keine Freigabe. Der Fehler war deshalb in der Vorführung
     * unsichtbar und wäre genau beim Umschalten auf echte Bewertungen
     * aufgetreten.
     *
     * Ein Platzhalter über der ersten Ebene (`*.googleusercontent.com`)
     * deckt alle lh-Nummern ab, ohne den Host allgemein zu öffnen.
     */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
    ],
  },

  /**
   * Sicherheits-Kopfzeilen.
   *
   * ═══ HIER UND NICHT IN `vercel.json` ═══
   * Beides ginge auf Vercel. Der Unterschied zeigt sich lokal: Was in
   * `next.config.ts` steht, gilt auch unter `npm run dev` und `npm start` –
   * Kopfzeilen lassen sich damit prüfen, bevor irgendetwas deployed ist. Was
   * in `vercel.json` steht, existiert ausschließlich auf Vercel und fällt
   * bei einem Plattformwechsel stillschweigend weg.
   *
   * ⚠️ BEWUSST OHNE Content-Security-Policy. Die Seite lebt von GSAP und
   * Lenis, die zur Laufzeit Stile setzen, und `next/font` schreibt
   * `<style>`-Blöcke ins Dokument. Eine CSP ohne sorgfältig gepflegte
   * Nonces würde beides abschalten – und zwar nicht als Fehlermeldung,
   * sondern als Seite, auf der nichts mehr animiert. Eine halbherzige CSP
   * ist schlechter als keine, weil sie Sicherheit behauptet, die sie nicht
   * liefert. Gehört nachgezogen, wenn jemand Zeit hat, sie richtig zu
   * bauen.
   *
   * `Strict-Transport-Security` fehlt absichtlich: Vercel setzt sie für
   * eigene Domains selbst, und zwei Quellen für denselben Header sind eine
   * zu viel.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          /* Verhindert, dass der Browser den Inhaltstyp errät. Ohne den
             Header kann eine hochgeladene Datei, die als Text ausgeliefert
             wird, als Skript interpretiert werden. */
          { key: "X-Content-Type-Options", value: "nosniff" },

          /* Beim Wechsel auf eine fremde Domain nur noch die Herkunft
             senden, nicht den vollen Pfad. Auf dieser Seite konkret: Die
             Verweise auf das Google-Profil sollen nicht mitteilen, von
             welcher Unterseite jemand kam. */
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

          /* Kein Einbetten in fremde Rahmen – Schutz gegen Clickjacking auf
             dem Upload-Auslöser. `SAMEORIGIN` statt `DENY`, damit
             Vorschau-Werkzeuge auf derselben Domain weiter funktionieren. */
          { key: "X-Frame-Options", value: "SAMEORIGIN" },

          /* Die Seite fragt nichts davon ab. Explizit abzuschalten kostet
             nichts und nimmt einem eingeschleusten Skript die Möglichkeit,
             es zu versuchen. */
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
