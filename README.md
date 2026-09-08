# energiepartner.info · angebote-vergleichen.info

Zwei Domains, **eine** Next-Anwendung. `energiepartner.info` ist der
Unternehmensauftritt (Vertrauen), `angebote-vergleichen.info` die Leadstrecke
(technische Zweitmeinung zu Wärmepumpen-Angeboten).

Stack: Next.js 16 (App Router, `src/`) · React 19 · Tailwind v4 · GSAP + Lenis.

```bash
npm install
npm run dev      # http://localhost:3000        → energiepartner.info
                 # http://localhost:3000/av     → angebote-vergleichen.info
```

`npm run dev` läuft bewusst auf **Webpack**, nicht Turbopack (Corivo-Konvention).

---

## Wie die zwei Domains zusammenhängen

| | |
|---|---|
| `src/app/(energiepartner)/` | liegt auf `/` |
| `src/app/(angebote)/av/` | liegt intern auf `/av` |
| `src/app/(rechtliches)/` | `/impressum`, `/datenschutz` — für **beide** Domains |

`src/proxy.ts` liest bei jeder Anfrage den `Host`-Header. Lautet er
`angebote-vergleichen.info`, wird `/` auf `/av` **umgeschrieben** (kein
Redirect — der Besucher soll die Domain in der Adresszeile sehen).

Zwei Route-Groups dürfen nicht denselben Pfad beanspruchen, deshalb braucht
eine von beiden ein echtes Pfadsegment. Nebeneffekt und Absicht zugleich:
`/av` ist überall direkt erreichbar, also auch ohne DNS und ohne Eingriff in
die Hosts-Datei.

> In Next 16 heißt die Datei `proxy.ts`, nicht mehr `middleware.ts`, und die
> exportierte Funktion muss `proxy` heißen.

**Kanonische Adressen stehen fest im Code** (`SITE.url` und `AV_ORIGIN` in
`src/lib/site.ts`), nicht in der Umgebung. Grund: Ein Deploy bedient zwei
Domains, `VERCEL_PROJECT_PRODUCTION_URL` kennt aber nur eine — daraus
abgeleitet trüge einer der beiden Auftritte systematisch die falsche Herkunft
in jedem Canonical.

---

## Deploy auf Vercel

Die Anwendung **braucht einen Server**, sie ist keine statische Ausgabe:
`api/lead` spricht mit Bitrix24, `proxy.ts` entscheidet pro Anfrage über die
Marke, `google-reviews.ts` ruft die Places API serverseitig ab. Vercel erkennt
Next.js automatisch richtig — es ist nichts umzustellen.

### 1. Projekt anlegen

Repository importieren. Framework-Preset **Next.js**, Build-Command,
Output-Verzeichnis und Install-Command auf den Vorgaben lassen.

`vercel.json` setzt nur eins: `regions: ["fra1"]` (Frankfurt). Ohne das
laufen die Serverless-Funktionen in Washington — spürbar langsamer für
deutsche Besucher, und Leaddaten deutscher Interessenten würden für die
Verarbeitung in die USA laufen, was die Datenschutzerklärung so nicht sagt.

### 2. Umgebungsvariablen

Alle Werte aus `.env.example` unter **Settings → Environment Variables**.
Auf die Sichtbarkeit achten:

| Variable | Production | Preview |
|---|:--:|:--:|
| `BITRIX24_WEBHOOK_URL` | ✅ | ✅ |
| `BITRIX24_DOMAIN` | ✅ | ✅ |
| `NEXT_PUBLIC_AV_URL` | — | — |
| `GOOGLE_PLACES_API_KEY` | ✅ | ✅ |
| `GOOGLE_PLACE_ID` | ✅ | ✅ |

`NEXT_PUBLIC_AV_URL` wird derzeit von nichts gelesen: Einzige Fundstelle ist
`Zweitmeinung.tsx`, und die Sektion ist ausgehängt (beide Auftritte bleiben
getrennt, Entscheidung vom 10.08.). Erst wenn sie zurückkommt, gehört die
Variable auf Production.

Anders als bei Amplify reicht Vercel die Variablen sowohl dem Build als auch
der Laufzeit durch. Der `.env.production`-Umweg in `amplify.yml` ist hier
überflüssig.

### 3. Beide Domains verbinden

Unter **Settings → Domains** alle vier eintragen:

```
energiepartner.info                 (Primary)
www.energiepartner.info             → Redirect auf energiepartner.info
angebote-vergleichen.info
www.angebote-vergleichen.info       → Redirect auf angebote-vergleichen.info
```

Beim Registrar (united-domains) muss für beide Apex-Domains ein A-Record auf
`76.76.21.21` zeigen, oder die Nameserver wechseln auf `ns1.vercel-dns.com` /
`ns2.vercel-dns.com`. Stand 08.09. zeigen beide noch auf IONOS (217.160.0.x).

Beide Apex-Domains zeigen auf dasselbe Projekt — die Weiche macht `proxy.ts`,
nicht Vercel. `AV_HOSTS` in `src/lib/site.ts` kennt die Variante mit und ohne
`www`; die `www`-Umleitung übernimmt trotzdem Vercel, damit gar nicht erst
zwei Adressen für dieselbe Seite im Umlauf sind.

### 4. Nach dem ersten Deploy prüfen

```bash
# Domain-Weiche: liefert die Prüfstrecke, nicht den Unternehmensauftritt
curl -sI https://angebote-vergleichen.info | head -1
curl -s  https://angebote-vergleichen.info | grep -o "<title>[^<]*"

# robots.txt ist hostabhängig — beide müssen sich unterscheiden
curl -s https://energiepartner.info/robots.txt
curl -s https://angebote-vergleichen.info/robots.txt

# Link-Vorschaubilder (WhatsApp ist der Hauptkanal)
curl -sI https://angebote-vergleichen.info/opengraph-image | head -1
```

Dazu von Hand: Ein echtes PDF durch den Upload-Funnel schicken und
kontrollieren, dass der Lead in Bitrix ankommt.

---

## Vor dem Livegang

- [ ] **Impressumsdaten vervollständigen.** `/impressum` und `/datenschutz`
      markieren fehlende Pflichtangaben sichtbar über die `<Fehlt>`-Komponente.
      Solange dort eine Markierung steht, gilt das Impressum als fehlend.
- [ ] **Anwaltliche Abnahme** von Datenschutzerklärung und dem
      Transparenz-Absatz auf angebote-vergleichen.info.
- [ ] **Fördersätze prüfen** (`src/components/sections/Foerderung.tsx` und
      `FOERDERHINWEIS` in `src/lib/site.ts`). Die einzige Angabe der Seite,
      die von allein veraltet.
- [ ] **Upload-Grenze testen.** Das Formular schreibt 10 MB an; Vercels
      Serverless-Funktionen deckeln den Request-Body bei 4,5 MB. Mit einem
      8-MB-PDF gegen Production testen und notfalls `DATEI_MAX_BYTES` in
      `src/lib/lead.ts` senken — samt der angeschriebenen Zahl in
      `AvUpload.tsx`.
- [ ] **Places API (New)** im Google-Cloud-Projekt freischalten und
      `GOOGLE_PLACE_ID` setzen (Pflicht, siehe `.env.example`).
- [ ] **Fünf Sterne im AV-Hero** gegen das echte Profil abgleichen. Steht
      dort keine 5,0, gehört ein halber Stern hin oder gar nichts.

---

## Ordnung im Code

- **Farben und Schrift** kommen ausschließlich aus dem `@theme`-Block in
  `src/app/globals.css`. Keine Roh-Hex im Markup.
- **Zwei Kanten, nicht fünf:** `.ep-container` (Seitenrand über `--edge`) und
  `.ep-axis` (Datenblatt-Raster). Zeilenlänge wird am Textelement selbst
  begrenzt (`max-w-[..ch]`), nie am Wrapper.
- **Typo-Rollen** statt Einzelwerte: `.t-display`, `.t-h2`, `.t-lead`,
  `.t-label` (Mono, „abgelesener Wert"), `.t-feld` (Formularbeschriftung),
  `.t-key`. Die Begründungen stehen als Kommentar an der jeweiligen Klasse.
- Ausgehängte Sektionen liegen weiter unter `components/` und sind nur nicht
  eingebunden — nichts wird gelöscht, was zurückkommen könnte.

`docs/` (Markenhandbuch, Briefing, Kickoff) liegt bewusst **nicht** in Git.
