import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AV_HOSTS, AV_PFAD } from "@/lib/site";

/**
 * Zwei Domains, eine Codebasis.
 *
 * `energiepartner.info` liefert die Route-Group `(energiepartner)` auf `/`,
 * `angebote-vergleichen.info` liefert `(angebote)` – die liegt intern unter
 * `/av` und wird hier auf `/` gespiegelt.
 *
 * WARUM NICHT BEIDE AUF `/`: Zwei Route-Groups dürfen nicht denselben Pfad
 * beanspruchen, das bricht schon beim Build („You cannot have two parallel
 * pages that resolve to the same path"). Eine der beiden braucht also einen
 * echten Pfadsegment-Namen, und den blendet der Rewrite auf der zugehörigen
 * Domain wieder aus.
 *
 * WARUM REWRITE UND NICHT REDIRECT: Der Besucher soll
 * `angebote-vergleichen.info` in der Adresszeile sehen. Ein Redirect würde
 * ihn nach `/av` schicken und die Domain zur Durchgangsstation machen.
 *
 * Nebenbei ist `/av` überall direkt erreichbar. Das ist Absicht: Für die
 * Kundenpräsentation und die lokale Arbeit gibt es damit einen Weg auf die
 * Seite, der ohne DNS und ohne Eingriff in die Hosts-Datei auskommt.
 *
 * ⚠️ Next 16: Die Datei heißt `proxy.ts`, nicht mehr `middleware.ts`, und die
 * Funktion muss `proxy` heißen (siehe `node_modules/next/dist/docs/01-app/
 * 01-getting-started/16-proxy.md`).
 */
export function proxy(request: NextRequest) {
  // `request.headers.get("host")` statt `nextUrl.hostname`: Hinter einem
  // Proxy trägt die URL den internen Namen, der Host-Header den, den der
  // Besucher eingegeben hat. Nur Letzterer entscheidet, welche Marke er
  // gerade sieht.
  const host = (request.headers.get("host") ?? "").split(":")[0].toLowerCase();

  if (!AV_HOSTS.includes(host as (typeof AV_HOSTS)[number])) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  // Nur die Wurzel spiegeln. Alles andere (`/impressum`, `/datenschutz`,
  // `/api/lead`, statische Dateien) ist für beide Domains dasselbe und
  // darf nicht umgebogen werden.
  if (pathname !== "/") {
    return NextResponse.next();
  }

  const ziel = request.nextUrl.clone();
  ziel.pathname = AV_PFAD;
  return NextResponse.rewrite(ziel);
}

export const config = {
  /* Nur die Wurzel prüfen. Jede weitere Anfrage – und das sind bei einer
     Seite mit Schriften, Bildern und Logo-SVGs die allermeisten – läuft
     damit gar nicht erst durch diese Funktion. */
  matcher: "/",
};
