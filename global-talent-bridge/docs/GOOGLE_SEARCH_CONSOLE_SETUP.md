# Google Search Console Setup — CorridorWork

**Datum:** 2026-06-07  
**Zweck:** Schritt-für-Schritt-Anleitung zur Einrichtung von Google Search Console für corridorwork.com  
**Sicherheit:** Kein Google API · Kein Scraping · Kein E-Mail · Kein Stripe · Kostenlos  

---

## Übersicht

Google Search Console (GSC) ist ein kostenloses Tool von Google, mit dem du:
- Die Indexierung deiner Seiten überwachen kannst
- Sitemap-Einreichungen verwalten kannst
- Suchperformance (Klicks, Impressionen, Position) analysieren kannst
- Technische SEO-Probleme erkennen kannst

**Wichtig:** Diese Anleitung nutzt keine Google API, kein Scraping und kein automatisiertes Tool. Alle Schritte sind manuell und kostenlos.

---

## Schritt 1 — Google Search Console öffnen

**URL:** https://search.google.com/search-console

1. Gehe zu https://search.google.com/search-console
2. Melde dich mit deinem Google-Konto an
3. Klicke auf **„Property hinzufügen"** (oben links, Dropdown)

---

## Schritt 2 — Domain-Property einrichten

1. Wähle **„Domain"** (nicht „URL-Präfix"!)
   - Domain-Property = verifiziert für alle URLs (http, https, www, non-www)
   - URL-Präfix = nur eine spezifische URL-Version
2. Gib ein: **`corridorwork.com`**
3. Klicke auf **„Weiter"**

GSC zeigt dir einen TXT-Wert zur DNS-Verifizierung an (Format: `google-site-verification=XXXXXXXXXX`).

---

## Schritt 3 — DNS-TXT-Eintrag setzen

Gehe zum DNS-Anbieter (z.B. Namecheap, Cloudflare, GoDaddy, Vercel DNS) und füge folgenden Eintrag hinzu:

| Feld | Wert |
|------|------|
| **Typ** | TXT |
| **Host / Name** | `@` (steht für die Root-Domain) |
| **Wert / Value** | `google-site-verification=XXXX...` (aus GSC kopieren) |
| **TTL** | Automatisch / 3600 |

**Hinweise:**
- Bei Cloudflare: DNS → Add Record → Typ TXT → Name: @ → Content: google-site-verification=...
- Bei Namecheap: Domain → Advanced DNS → Add New Record → TXT Record → Host: @ → Value: ...
- Bei Vercel DNS: Domains → corridorwork.com → DNS Records → Add → TXT → @ → ...
- DNS-Propagation kann 5 Minuten bis 48 Stunden dauern

---

## Schritt 4 — DNS-Propagation prüfen

Im Admin-Bereich unter `/admin/seo-indexing-control` gibt es einen DNS-Checker:

1. Kopiere den Google TXT-Wert aus Google Search Console
2. Füge ihn in das Eingabefeld ein
3. Klicke **„DNS prüfen"**
4. Warte auf das Ergebnis:
   - ✅ **Gefunden** → DNS-Propagation abgeschlossen → Zurück zu GSC → „Verifizieren"
   - ⏳ **Noch nicht sichtbar** → Warte und prüfe erneut

**Technischer Hinweis:** Der DNS-Checker nutzt das Node.js `dns`-Modul (`dns.resolveTxt('corridorwork.com')`). Kein Scraping, kein Google API, keine externen Dienste.

---

## Schritt 5 — Sitemap einreichen

Nach erfolgreicher Verifizierung:

1. Gehe in Google Search Console zu **Sitemaps** (linke Navigation)
2. Gib ein: **`sitemap.xml`** (nur den relativen Pfad, nicht die volle URL)
3. Klicke auf **„Senden"**

Die vollständige Sitemap-URL lautet: `https://corridorwork.com/sitemap.xml`

**Inhalt der Sitemap (16 URLs):**
- `/` — Homepage
- `/demo` — Demo
- `/pilot/employers` — Arbeitgeber-Pilot
- `/pilot/agencies` — Agentur-Partner
- `/market-intelligence` — Market Intelligence
- `/solutions/recruiting-agencies` — Recruiting Agencies
- `/industries/care` — Pflegekräfte
- `/industries/hospitality` — Gastronomie
- `/industries/logistics` — Logistik
- `/industries/it` — IT & Tech
- `/industries/construction` — Bau & Handwerk
- `/corridors/philippines-care` — Philippinen → EU (Pflege)
- `/corridors/india-uk` — Indien → UK (Tech)
- `/corridors/morocco-germany` — Marokko → Deutschland
- `/corridors/nigeria-tech` — Nigeria → Tech-Hubs
- `/corridors/tunisia-france` — Tunesien → Frankreich

---

## Prioritäts-URLs für manuelle URL-Inspektion

Nach dem Sitemap-Import empfiehlt es sich, die wichtigsten URLs manuell zur Indexierung einzureichen:

1. `/demo` — Demo-Seite (hohe Conversion-Relevanz)
2. `/pilot/employers` — Arbeitgeber-Pilot (primäre Revenue-Seite)
3. `/pilot/agencies` — Agentur-Partner (sekundäre Revenue-Seite)
4. `/market-intelligence` — Market Intelligence
5. `/industries/care` — Pflegebranche (hohe Suchvolumen)
6. `/solutions/recruiting-agencies` — Lösung für Agenturen

**So geht's:** In GSC → URL-Inspektion → URL eingeben → „Indexierung beantragen"

---

## Robots.txt & Crawling

Die aktuelle `robots.txt` (https://corridorwork.com/robots.txt) erlaubt alle relevanten Pfade:

```
User-agent: *
Allow: /
Allow: /industries/
Allow: /solutions/
Allow: /demo
```

Admin-Bereiche (`/admin/`) und API-Routen (`/api/`) sind blockiert:
```
Disallow: /admin/
Disallow: /api/
```

---

## Sicherheitsinvarianten — Bestätigt

| Eigenschaft | Status |
|------------|--------|
| Google Search Console API | ❌ Nicht aktiv |
| Scraping | ❌ Nicht aktiv |
| E-Mail-Versand | ❌ Nicht aktiv |
| Stripe / Zahlung | ❌ Nicht aktiv |
| Externe bezahlte Dienste | ❌ Nicht aktiv |
| DNS-Check | ✅ Nur Standard-DNS (Node.js built-in) |
| Sitemap-Einreichung | ✅ Nur manuell über GSC UI |
| EMAIL_PROVIDER | none |
| OUTREACH_EMAIL_PROVIDER | none |

---

## Admin-Bereich

Die vollständige Setup-Anleitung ist im Admin-Bereich verfügbar:

- **5-Schritt-Assistent:** `/admin/seo-indexing-control`
- **CWO Command Center:** `/admin/cwo-command-center` → SEO Indexing Panel

---

## Zeitplan (geschätzt)

| Schritt | Aktion | Zeit |
|---------|--------|------|
| 1 | GSC öffnen + Property anlegen | 5 Min |
| 2 | DNS-TXT-Eintrag setzen | 5 Min |
| 3 | DNS-Propagation abwarten | 5 Min – 48 Std |
| 4 | In GSC verifizieren | 1 Min |
| 5 | Sitemap einreichen | 2 Min |
| 6 | Top-URLs zur Indexierung einreichen | 10 Min |

---

## Relevante Dateien

| Datei | Zweck |
|-------|-------|
| `lib/seo-indexing.ts` | SEO-Konfiguration, 16 Seiten, GSC Guide-Daten |
| `app/sitemap.ts` | Automatisch generierte sitemap.xml |
| `public/robots.txt` | Crawling-Regeln |
| `app/admin/seo-indexing-control/page.tsx` | 5-Schritt-Setup-Assistent |
| `app/api/admin/dns-check/route.ts` | DNS-TXT-Prüfung (kein Scraping) |
| `app/admin/seo-indexing-control/_components/DnsTxtChecker.tsx` | DNS-Check UI-Komponente |

---

*Kein Google API · Kein Scraping · Kein E-Mail · Kein Stripe · Kostenlos · Phase 1*
