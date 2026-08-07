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
};

export default nextConfig;
