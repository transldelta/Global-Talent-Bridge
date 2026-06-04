# Landingpage Factory

**Branch:** `feature/landingpage-factory`  
**Status:** Active — Generate and manage only, no automatic publishing  
**Created:** 2026-06-04  

---

## Übersicht

Die Landingpage Factory erzeugt strukturierte, SEO-fähige Karriere-Landingpages für internationale Migrations-Korridore. Jede Seite richtet sich an Kandidaten aus einem Herkunftsland, die Jobs in einem Zielland suchen.

**Was der Agent tut:**
- ✅ Migrations-Korridore analysieren
- ✅ Corridor Intelligence Daten verwenden (Berufe, Visa-Wege, Sprachanforderungen)
- ✅ Landingpages generieren und SEO-Daten setzen
- ✅ Opportunity Scores aus Korridor-Daten übernehmen
- ✅ CEO-Vorschläge für hochpriorisierte Landingpages erstellen
- ✅ Benachrichtigungen für kritische Seiten erzeugen
- ✅ Alle Aktionen in `system_logs` protokollieren

**Was der Agent NICHT tut:**
- ❌ Landingpages automatisch veröffentlichen
- ❌ Werbung schalten
- ❌ Externe APIs aufrufen
- ❌ E-Mails senden
- ❌ Inhalte ohne manuelle Prüfung freigeben

---

## Datenbankstruktur

### `landingpage_factory`

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| `id` | uuid | Primärschlüssel |
| `corridor_id` | uuid | FK → `migration_corridors` (nullable) |
| `title` | text | Seitentitel |
| `slug` | text UNIQUE | URL-Slug (verwendet in `/corridors/[slug]`) |
| `language` | text | Sprache des Inhalts (en/de/fr/tr/pt/ar) |
| `target_country` | text | Zielland |
| `source_country` | text | Herkunftsland |
| `profession_focus` | text | Komma-getrennte Berufsfelder |
| `seo_title` | text | SEO-optimierter Seitentitel |
| `seo_description` | text | Meta-Description (max ~160 Zeichen) |
| `opportunity_score` | integer (0–100) | Opportunity Score (aus Korridor-Daten) |
| `priority_level` | text | low / medium / high / critical |
| `status` | text | draft / ready_for_review / approved / published / paused |

**Status-Workflow:**
```
draft → ready_for_review → approved → published
                                   ↘ paused
```

**RLS:** Aktiviert. Public READ nur für `status = 'published'`.

---

## SEO-Strategie

### URL-Struktur
```
/corridors/[slug]
```
Beispiel: `/corridors/india-canada-it-jobs`

### Meta-Tags
Jede Landingpage generiert dynamisch:
- `<title>` — sprachspezifisch, korridor-spezifisch
- `<meta name="description">` — max 160 Zeichen, korridor-spezifisch
- `<link rel="canonical">` — absolute URL
- `<meta property="og:*">` — Open Graph für Social Sharing
- `<meta name="twitter:*">` — Twitter Card

### Sitemap-Integration
`app/sitemap.ts` ist dynamisch. Alle `published` und `approved` Seiten werden automatisch in die Sitemap aufgenommen mit:
- `priority`: 0.9 (critical) / 0.8 (high) / 0.7 (medium)
- `changeFrequency`: weekly

### robots.txt
`/corridors/` ist für Suchmaschinen freigegeben:
```
Allow: /corridors/
```

---

## Korridor-Strategie

Der Agent liest aktive `migration_corridors` und verknüpft sie mit `corridor_intelligence`:

1. **Sprachermittlung** — basierend auf Herkunftsland (z.B. Marokko → fr, Türkei → tr)
2. **Slug-Generierung** — normierte Ländernamen + sektorspezifische Begriffe
3. **Score-Übernahme** — `corridor_intelligence.opportunity_score` hat Priorität über `migration_corridors.opportunity_score`
4. **Berufs-Fokus** — top 3 Berufe aus `corridor_intelligence.top_professions`

---

## Mehrsprachigkeit

| Sprache | Herkunftsländer | Zielländer |
|---------|-----------------|------------|
| `en` | Indien, Nigeria, Philippinen | UK, Kanada, Australien |
| `de` | (alle, falls Ziel = DE/AT/CH) | Deutschland, Österreich |
| `fr` | Marokko, Tunesien, Algerien | Frankreich, Deutschland |
| `tr` | Türkei | Deutschland |
| `pt` | Brasilien | Portugal |
| `ar` | Arabische Länder | (alle) |

Die Sprache wird vom Agenten automatisch erkannt. Admin kann sie manuell ändern.

---

## Seed-Daten (7 Landingpages)

| Slug | Korridor | Sprache | Status |
|------|---------|---------|--------|
| `india-canada-it-jobs` | Indien → Kanada (IT) | en | ready_for_review |
| `india-uk-nursing-jobs` | Indien → UK (Pflege) | en | ready_for_review |
| `philippines-australia-care-jobs` | Philippinen → Australien (Pflege) | en | ready_for_review |
| `maroc-allemagne-soins-emplois` | Marokko → Deutschland (Pflege) | fr | ready_for_review |
| `turkiye-almanya-it-kariyer` | Türkei → Deutschland (IT) | tr | draft |
| `brasil-portugal-engenharia-vagas` | Brasilien → Portugal (Ingenieurwesen) | pt | draft |
| `tunisie-france-industrie-emplois` | Tunesien → Frankreich (Industrie) | fr | draft |

---

## API-Routen

| Route | Methode | Beschreibung |
|-------|---------|--------------|
| `/api/admin/global/landingpage-factory` | GET | Alle Landingpages mit Korridor-Infos |
| `/api/admin/global/landingpage-factory/run-agent` | POST | LPF-Agent manuell starten |

**Zugriff:** Nur für Admins (`getCurrentAdminUser()`)

---

## Seiten

| Route | Typ | Beschreibung |
|-------|-----|--------------|
| `/admin/global/landingpage-factory` | Admin (privat) | Übersicht + Agent-Button |
| `/corridors/[slug]` | Public (dynamisch) | Kandidaten-Landingpage |

---

## Public-Seite `/corridors/[slug]`

Die öffentliche Route zeigt:
- **Hero**: Titel, Korridor-Badge, Sprache, SEO-Description, CTA-Buttons
- **Korridor-Analyse**: Opportunity Score, Demand Score, Supply Score (aus `migration_corridors`)
- **Score-Visualisierung**: Balken-Diagramme für alle Scores
- **Gesuchte Berufe**: Top-Professions aus `corridor_intelligence`
- **Visa-Wege**: Strukturierte Liste (falls in CI vorhanden)
- **Sprachanforderungen**: Sprachlevels (falls in CI vorhanden)
- **Wie funktioniert es**: 3-Schritt-Erklärung
- **CTA**: Link zu `/auth/register` und `/jobs`
- **Vorschau-Badge**: Sichtbar für nicht-published Seiten (Admin-Vorschau)

---

## Kandidatengewinnung

Die Seiten dienen langfristig als SEO-Magnet für internationale Fachkräfte:

- Suchmaschinenoptimierte Titel und Descriptions in Landessprache
- Korridor-spezifische Inhalte für relevante Suchanfragen
- Direkter CTA zur kostenlosen Registrierung
- Transparenz über Opportunity Scores und Nachfrage

---

## Verkaufswert

- **Für Arbeitgeber**: Zeigt aktive Kandidaten-Pipeline in ihrem Sektor
- **Für Kandidaten**: Strukturierter Einstieg in den Migrationsprozess
- **Für die Plattform**: SEO-Traffic ohne Werbekosten
- **Für Investoren**: Messbare Conversion-Daten (Registrierungen aus Korridor-Seiten)

---

## Sicherheit & Compliance

- **RLS aktiviert** — Public liest nur `published` Seiten
- **Kein automatisches Publishing** — Admin muss Status manuell auf `published` setzen
- **Kein automatisches Scraping** — alle Daten aus interner DB
- **DSGVO-konform** — keine Tracking-Cookies, kein Drittanbieter auf Landingpages
- **system_logs** — alle Agent-Läufe vollständig protokolliert

---

## Verwandte Module

- [[corridor-intelligence]] — Quelldata für Berufe, Visa-Wege, Sprachanforderungen
- [[global-market-intelligence]] — Korridor-Scores und Prioritäten
- [[global-candidate-acquisition]] — Kandidatenquellen für Outreach
- [[employer-acquisition]] — Arbeitgeberquellen für Demand-Side
