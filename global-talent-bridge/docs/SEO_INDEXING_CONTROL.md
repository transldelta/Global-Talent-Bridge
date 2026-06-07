# SEO Indexing & Visibility Control — CorridorWork

**Datum:** 2026-06-07  
**Phase:** 1 (Pilot)  
**Status:** ✅ Live  
**Seite:** `/admin/seo-indexing-control`

---

## Überblick

Der SEO Indexing & Visibility Control Layer ist ein internes Admin-Tool, das zeigt:

- Welche öffentlichen SEO-/Revenue-Seiten live sind
- Ob sie indexierbar sind (robots.txt, canonical, Sitemap)
- Was der Nutzer einmalig in Google Search Console tun muss
- Welche Seiten zuerst indexiert werden sollen
- SEO-Systemstatus auf einen Blick

**Safety-Invarianten: UNVERÄNDERT**
- Kein Google Search Console API Call
- Kein automatischer Versand
- Kein Scraping
- Kein Stripe
- EMAIL_PROVIDER = none
- OUTREACH_EMAIL_PROVIDER = none
- Alle Schritte sind rein manuell und kostenlos

---

## Warum Google Search Console wichtig ist

Google indexiert neue Seiten in der Regel innerhalb von Wochen bis Monaten.
Durch die einmalige Einrichtung von Google Search Console lässt sich dieser Prozess beschleunigen:

1. **Sitemap einreichen** → Google lernt schneller alle URLs kennen
2. **URL-Indexierung beantragen** → Priorisierte Crawling-Anfrage für wichtige Seiten
3. **Sichtbarkeit überwachen** → Impressions, Klicks, Rankings verfolgen

Ohne Search Console: Google findet Seiten irgendwann — aber ohne Priorität.  
Mit Search Console: Kontrollierter, beschleunigter Prozess.

---

## Sitemap

**URL:** `https://corridorwork.com/sitemap.xml`

Die Sitemap wird automatisch von Next.js generiert (`app/sitemap.ts`).
Sie enthält alle öffentlichen SEO-/Revenue-Seiten mit korrekten Prioritäten.

### Enthaltene URL-Gruppen

| Gruppe | Anzahl | Priorität |
|--------|--------|----------|
| Homepage + Static | 9 | 0.5 – 1.0 |
| Revenue Pilot Pages | 3 | 0.75 – 0.85 |
| Industry SEO Pages | 5 | 0.75 – 0.80 |
| Corridor SEO Pages | 5 | 0.70 – 0.80 |
| Solutions + Demo | 2 | 0.75 – 0.80 |
| Dynamic Corridors (DB) | variabel | 0.70 – 0.90 |

---

## Welche Seiten zuerst indexiert werden sollen

Priorisierung nach Revenue-Relevanz und Suchvolumen:

| Priorität | URL | Begründung |
|-----------|-----|-----------|
| 1 | `/demo` | Hohe Konversionsrelevanz, Demo-Intent |
| 2 | `/pilot/employers` | Primäre Revenue-Page |
| 3 | `/industries/care` | Stärkster Nachfrage-Sektor |
| 4 | `/solutions/recruiting-agencies` | B2B-Partner-Zielgruppe |
| 5 | `/pilot/agencies` | Sekundäre Revenue-Page |
| 6 | `/corridors/philippines-care` | Score 95, aktivster Korridor |
| 7 | `/industries/it` | Hohes Suchvolumen für IT-Recruiting |

---

## robots.txt

**URL:** `https://corridorwork.com/robots.txt`

### Allow-Regeln (öffentlich zugänglich)

```
Allow: /
Allow: /for-candidates
Allow: /for-employers
Allow: /pricing
Allow: /about
Allow: /contact
Allow: /legal/
Allow: /corridors/
Allow: /pilot/
Allow: /market-intelligence
Allow: /industries/
Allow: /solutions/
Allow: /demo
```

### Disallow-Regeln (blockiert für Crawler)

```
Disallow: /admin/
Disallow: /auth/
Disallow: /candidate/
Disallow: /employer/
Disallow: /api/
```

Die Admin-Seite `/admin/seo-indexing-control` ist bewusst in `/admin/` — und damit für Suchmaschinen blockiert.

---

## Was automatisch geprüft wird

Der Daily Runner (`/api/cron/cwo-daily-runner`) führt täglich folgende SEO-Checks durch:

- Anzahl SEO-Seiten aus Konfiguration zählen
- Sitemap-URL bestätigen
- robots.txt-URL bestätigen
- Eintrag in `autonomous_worklog`: "SEO visibility check prepared"

**Kein externer Call.** Alle Checks basieren auf der statischen Konfiguration in `lib/seo-indexing.ts`.

---

## Was bewusst manuell bleibt

| Schritt | Warum manuell |
|---------|--------------|
| Google Search Console Einrichtung | Einmalig, kostenlos, kein API nötig |
| Sitemap-Einreichung | Manuell in GSC UI, kein API-Key erforderlich |
| URL-Indexierung beantragen | Manuelle Anfrage in GSC — schneller und kontrollierbarer |
| Ranking-Überwachung | In GSC UI, keine externe API |

---

## Keine externen APIs

Dieser Layer nutzt **keine** externen APIs:

| Service | Status |
|---------|--------|
| Google Search Console API | ❌ Nicht aktiviert |
| Google PageSpeed API | ❌ Nicht aktiviert |
| Screaming Frog / Ahrefs / SEMrush | ❌ Nicht aktiviert |
| Resend / SendGrid | ❌ Nicht aktiviert |
| Stripe | ❌ Nicht aktiviert |

---

## Keine bezahlten Dienste

Alle SEO-Maßnahmen in Phase 1 sind **kostenlos**:

- Google Search Console: kostenlos
- robots.txt: statische Datei
- Sitemap: automatisch generiert
- Canonical Tags: in Next.js Metadata
- Open Graph: in Next.js Metadata

---

## Technische Dateien

```
lib/seo-indexing.ts                          — Statische SEO-Konfiguration (Single-Source-of-Truth)
app/admin/seo-indexing-control/page.tsx      — Admin-Kontrollseite
app/api/cron/cwo-daily-runner/route.ts       — Daily Runner (SEO-Check-Items ergänzt)
app/admin/cwo-command-center/page.tsx        — CWO Panel "SEO Indexing" ergänzt
__tests__/seo-indexing-control.test.ts       — Test-Suite
docs/SEO_INDEXING_CONTROL.md                 ← diese Datei
```

---

## Einmalige Setup-Anleitung

```
1. https://search.google.com/search-console öffnen
2. "+ Property hinzufügen" → Domain → "corridorwork.com"
3. DNS-Verifizierung (TXT-Eintrag bei DNS-Anbieter)
4. Sitemaps → https://corridorwork.com/sitemap.xml einreichen
5. URL-Prüfung → /demo, /pilot/employers, /industries/care, /solutions/recruiting-agencies
   → jeweils "Indexierung beantragen"
```

**Dauer:** ca. 15–20 Minuten.  
**Kosten:** 0 €.  
**Ergebnis:** Google kennt und priorisiert CorridorWork.com.

---

*Erstellt: 2026-06-07 · CorridorWork Phase 1 Pilot · Delta Translation, Karlsruhe*
