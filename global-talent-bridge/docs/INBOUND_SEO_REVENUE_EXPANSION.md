# Inbound SEO Revenue Expansion — CorridorWork

**Datum:** 2026-06-07  
**Phase:** 1 (Pilot)  
**Status:** ✅ Live

---

## Überblick

Die Inbound SEO Revenue Expansion erweitert CorridorWork um 12 neue öffentliche Landingpages.
Ziel: organische Auffindbarkeit (SEO) für Arbeitgeber, Recruiting-Agenturen und Market-Intelligence-Interessenten.

**Safety-Invarianten: UNVERÄNDERT**
- Kein Stripe aktiviert
- Keine E-Mails versendet
- Kein automatischer Outreach
- Kein Scraping
- Keine Job- oder Visa-Garantien
- EMAIL_PROVIDER = none
- OUTREACH_EMAIL_PROVIDER = none

---

## Neue Seiten (12 gesamt)

### Branchen-Seiten (5)

| URL | Branche | Status |
|-----|---------|--------|
| `/industries/care` | Pflege & Gesundheit 🏥 | ✅ Live |
| `/industries/hospitality` | Gastronomie & Hotellerie 🍽️ | ✅ Live |
| `/industries/logistics` | Logistik & Transport 🚚 | ✅ Live |
| `/industries/it` | IT & Technologie 💻 | ✅ Live |
| `/industries/construction` | Bau & Handwerk 🏗️ | ✅ Live |

### Korridor-Seiten (5)

| URL | Korridor | Score | Status |
|-----|----------|-------|--------|
| `/corridors/philippines-care` | 🇵🇭→🇩🇪 Philippinen → Deutschland | 95 | ✅ Live |
| `/corridors/india-uk` | 🇮🇳→🇬🇧 Indien → UK / Deutschland | 91 | ✅ Live |
| `/corridors/morocco-germany` | 🇲🇦→🇩🇪 Marokko → Deutschland | 84 | ✅ Live |
| `/corridors/nigeria-tech` | 🇳🇬→🇩🇪 Nigeria → Deutschland / UK | 82 | ✅ Live |
| `/corridors/tunisia-france` | 🇹🇳→🇫🇷 Tunesien → Frankreich | 79 | ✅ Live |

### Lösungen & Demo (2)

| URL | Beschreibung | Status |
|-----|-------------|--------|
| `/solutions/recruiting-agencies` | White-Label für Recruiting-Agenturen | ✅ Live |
| `/demo` | Interaktive Demo — nur Beispieldaten | ✅ Live |

---

## Technische Umsetzung

### Neue Dateien

```
lib/seo-pages.ts                         — Datenkonstanten (INDUSTRY_CONFIGS, CORRIDOR_CONFIGS, SEO_REVENUE_PAGES)
app/_components/IndustryPageTemplate.tsx  — Shared Template für alle 5 Branchen-Seiten
app/_components/CorridorPageTemplate.tsx  — Shared Template für alle 5 Korridor-Seiten

app/industries/care/page.tsx
app/industries/hospitality/page.tsx
app/industries/logistics/page.tsx
app/industries/it/page.tsx
app/industries/construction/page.tsx

app/corridors/morocco-germany/page.tsx    — Static route (Priorität über [slug])
app/corridors/tunisia-france/page.tsx
app/corridors/india-uk/page.tsx
app/corridors/philippines-care/page.tsx
app/corridors/nigeria-tech/page.tsx

app/solutions/recruiting-agencies/page.tsx
app/demo/page.tsx

__tests__/inbound-seo-revenue-expansion.test.ts
docs/INBOUND_SEO_REVENUE_EXPANSION.md     ← diese Datei
```

### Geänderte Dateien

```
app/sitemap.ts           — 12 neue Seiten hinzugefügt (+ Demo, Solutions, Industries, Corridors)
public/robots.txt        — Allow: /industries/, /solutions/, /demo
app/_components/PublicFooter.tsx  — Branchen-Zeile + Korridore-Zeile hinzugefügt
app/admin/cwo-command-center/page.tsx  — SEO Expansion Panel hinzugefügt
```

---

## Sitemap-Einträge

Die `app/sitemap.ts` wurde um folgende URL-Einträge ergänzt:

| URL | Priorität | Frequenz |
|-----|-----------|---------|
| `/demo` | 0.80 | monthly |
| `/solutions/recruiting-agencies` | 0.75 | monthly |
| `/industries/care` | 0.80 | monthly |
| `/industries/hospitality` | 0.75 | monthly |
| `/industries/logistics` | 0.75 | monthly |
| `/industries/it` | 0.75 | monthly |
| `/industries/construction` | 0.75 | monthly |
| `/corridors/philippines-care` | 0.80 | monthly |
| `/corridors/india-uk` | 0.80 | monthly |
| `/corridors/morocco-germany` | 0.75 | monthly |
| `/corridors/nigeria-tech` | 0.75 | monthly |
| `/corridors/tunisia-france` | 0.70 | monthly |

---

## robots.txt

```
Allow: /industries/
Allow: /solutions/
Allow: /demo
```

Diese Zeilen wurden zu den bereits vorhandenen Allow-Regeln hinzugefügt.

---

## Wichtig: Statische Korridor-Routen vs. Dynamische Route

Next.js 14 priorisiert statische Routen vor dynamischen.  
`app/corridors/philippines-care/page.tsx` **hat Priorität** vor `app/corridors/[slug]/page.tsx`.

Das bedeutet:
- SEO-Seiten unter `/corridors/philippines-care` etc. werden direkt aus den statischen Dateien gerendert.
- Die DB-gesteuerte Route `[slug]` wird nur für andere Slugs genutzt (aus der `landingpage_factory` Tabelle).
- Kein Konflikt — beide Systeme koexistieren.

---

## SEO-Strategie

### Keyword-Fokus

**Branchen:**
- "internationale Pflegekräfte finden"
- "internationale IT Fachkräfte"
- "Gastronomie Fachkräfte international"
- "Logistik Fachkräfte international"
- "Baufachkräfte international"

**Korridore:**
- "marokkanische Fachkräfte Deutschland"
- "philippinische Pflegekräfte Deutschland"
- "Indien UK IT Fachkräfte"
- "Nigeria Tech Talent Deutschland"
- "Tunesien Frankreich Gastronomie"

### SEO-Metadaten
- Alle Seiten haben: `title`, `description`, `keywords`, `openGraph`, `alternates.canonical`
- Kein `| CorridorWork` in page-level titles (Root Layout Template übernimmt das automatisch)
- Canonical URLs zeigen auf `https://corridorwork.com/...`

---

## Safety-Checks

Alle Seiten wurden auf folgende Punkte geprüft:

| Check | Ergebnis |
|-------|---------|
| Kein Stripe-Button | ✅ |
| Kein "Jetzt kaufen" | ✅ |
| Kein automatischer E-Mail-Versand | ✅ |
| Kein Outreach-CTA | ✅ |
| Kein Scraping | ✅ |
| Keine Jobgarantie | ✅ |
| Keine Visa-Garantie | ✅ |
| DSGVO-Hinweis vorhanden | ✅ |
| Datenschutz-Link vorhanden | ✅ |
| Impressum-Link vorhanden | ✅ |
| "kein automatischer Versand" | ✅ |
| Compliance-Hinweise auf Korridor-Seiten | ✅ |
| Demo-Seite mit Beispieldaten-Warnung | ✅ |

---

## Test-Suite

`__tests__/inbound-seo-revenue-expansion.test.ts`

Abgedeckte Bereiche:
- SEO_REVENUE_PAGES Konstanten und Safety-Flags
- INDUSTRY_CONFIGS: alle 5 Branchen, alle Pflichtfelder
- CORRIDOR_CONFIGS: alle 5 Korridore, Scores, Compliance-Hinweise
- Branding: kein "Global Talent Bridge"
- URL-Struktur: alle 12 Pfade
- Sitemap-Vollständigkeit
- robots.txt Allow-Liste konzeptuell
- Safety Invarianten (kein Stripe, kein Versand, kein Scraping)

---

## Deployment

- Branch: `feature/global-talent-bridge-mvp-phase-1`
- Vercel: automatisches Deployment bei Push auf diesen Branch
- Live-URL: `https://corridorwork.com`

---

## Nächste Schritte (nach Live-Verifikation)

1. SEO-Ranking beobachten (Google Search Console)
2. Lead-Tracking über `/admin/revenue-inbox` verfolgen
3. Content-Erweiterung für Top-Korridore (mehr Beispieldaten)
4. A/B-Test: CTA-Platzierung auf Branchen-Seiten
5. Weitere Branchen: Energie, Landwirtschaft, Logistik (Phase 2)
6. White-Label Features für `/solutions/recruiting-agencies` (Phase 2)

---

*Erstellt: 2026-06-07 · CorridorWork Phase 1 Pilot · Delta Translation, Karlsruhe*
