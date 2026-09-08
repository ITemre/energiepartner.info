import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { AV_HOSTS } from "@/lib/site";

/**
 * robots.txt für BEIDE Domains.
 *
 * HOSTABHÄNGIG, UND DAS IST KEINE FEINHEIT * Ein Deploy bedient energiepartner.info und angebote-vergleichen.info.
 * Eine statische Datei müsste sich für eine der beiden entscheiden – und
 * die andere bekäme eine Freigabe für Pfade, die es dort gar nicht gibt.
 *
 * Konkret: `/av` ist unter energiepartner.info technisch erreichbar (der
 * Rewrite in `src/proxy.ts` greift nur auf der eigenen Domain). Ohne
 * Ausschluss stünde die Leadstrecke doppelt im Index und teilte sich die
 * Sichtbarkeit mit sich selbst. Das Canonical in
 * `(angebote)/layout.tsx` sagt bereits, welche Fassung zählt – aber ein
 * Canonical ist ein Hinweis, ein Disallow ist eine Ansage. Beide zusammen
 * sind die belastbare Lösung.
 *
 * Der Aufruf von `headers()` macht diese Route absichtlich dynamisch: Sie
 * MUSS pro Anfrage entscheiden, sonst wäre die erste ausgelieferte Fassung
 * für beide Hosts zementiert.
 *
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = ((await headers()).get("host") ?? "")
    .split(":")[0]
    .toLowerCase();

  const istAv = (AV_HOSTS as readonly string[]).includes(host);

  /* Vorschau-Deployments tragen eine `*.vercel.app`-Adresse. Sie liefern
     dieselbe Anwendung aus wie die Produktion und würden ohne diesen Zweig
     als eigenständige Domain in den Index wandern – dieselbe Seite, dritte
     Adresse. */
  if (host.endsWith(".vercel.app")) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  const origin = istAv
    ? "https://angebote-vergleichen.info"
    : "https://energiepartner.info";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      /* Auf der Unternehmensdomain ist die Prüfstrecke unter `/av`
         technisch erreichbar, gehört dort aber nicht hin. Auf ihrer eigenen
         Domain liegt sie auf `/` – dort gibt es nichts auszuschließen. */
      disallow: istAv ? [] : ["/av"],
    },
    host: origin,
  };
}
