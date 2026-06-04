# Migration Intelligence Engine

**Branch:** `feature/migration-intelligence-engine`  
**Status:** Active — Analyse und Orientierung, kein Rechtsbeistand, keine Garantien  
**Created:** 2026-06-04  

---

## Übersicht

Die Migration Intelligence Engine bewertet Migrationskorridore strukturiert nach ihrer Komplexität
und berechnet eine interne Erfolgswahrscheinlichkeit sowie ein Risikolevel. Sie dient ausschließlich
zur internen Orientierung und strategischen Priorisierung.

**Was der Agent tut:**
- ✅ Komplexität je Korridor analysieren (Visa, Anerkennung, Sprache, Dokumente)
- ✅ Erfolgswahrscheinlichkeit berechnen (Score-Formel)
- ✅ Risikolevel ableiten (low / medium / high / critical)
- ✅ Veraltete Einträge markieren (wenn Korridor inaktiv)
- ✅ CEO-Vorschläge für Top-Korridore und Hochrisiko-Korridore erstellen
- ✅ Benachrichtigungen für critical/high-Risk-Korridore erstellen
- ✅ Alle Aktionen in `system_logs` protokollieren

**Was der Agent NICHT tut:**
- ❌ Rechtsberatung geben
- ❌ Garantien abgeben
- ❌ Externe APIs aufrufen
- ❌ E-Mails oder WhatsApp-Nachrichten senden
- ❌ Kandidaten direkt kontaktieren

---

## Datenbankstruktur

### `migration_intelligence`

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| `id` | uuid | Primärschlüssel |
| `corridor_id` | uuid | FK → `migration_corridors` (UNIQUE) |
| `source_country` | text | Herkunftsland |
| `target_country` | text | Zielland |
| `sector` | text | Berufssektor |
| `visa_complexity` | integer (0–100) | Visa-Komplexität |
| `recognition_complexity` | integer (0–100) | Anerkennungsaufwand |
| `language_complexity` | integer (0–100) | Sprachanforderung |
| `document_complexity` | integer (0–100) | Dokumentenaufwand |
| `estimated_success_score` | integer (0–100) | Berechnete Erfolgswahrscheinlichkeit |
| `risk_level` | text | low / medium / high / critical |
| `required_documents` | jsonb | Typische Dokumente (strukturiert) |
| `language_requirements` | jsonb | Sprachlevels (z.B. Deutsch: B2) |
| `recognition_steps` | jsonb | Anerkennungsschritte als Array |
| `visa_pathways` | jsonb | Visa-Wege als Array |
| `recommended_next_steps` | jsonb | Empfohlene nächste Schritte |
| `disclaimer` | text | Haftungsausschluss |
| `status` | text | draft / reviewed / approved / outdated |
| `created_at` | timestamptz | Erstellt am |
| `updated_at` | timestamptz | Zuletzt aktualisiert |

**RLS:** Aktiviert. Kein öffentlicher Zugriff — nur `service_role` (Admin).

---

## Score-Formel

```
estimated_success_score =
  100
  − visa_complexity         × 0.25
  − recognition_complexity  × 0.25
  − language_complexity     × 0.20
  − document_complexity     × 0.15
  + opportunity_score       × 0.15

Ergebnis wird auf [0, 100] geclampt und gerundet.
```

**Opportunity Score** kommt aus `migration_corridors.opportunity_score` des verknüpften Korridors.

---

## Risikolevel

| Score | Risiko |
|-------|--------|
| ≥ 80  | `low` |
| ≥ 60  | `medium` |
| ≥ 40  | `high` |
| < 40  | `critical` |

---

## Status-Workflow

```
draft → reviewed → approved
              ↘ outdated (wenn Korridor inaktiv)
```

- **draft**: Neu generiert oder unvollständige Daten
- **reviewed**: Manuell geprüft, wird auf /corridors/[slug] angezeigt
- **approved**: Vollständig freigegeben
- **outdated**: Korridor ist nicht mehr aktiv

Public-Seiten (`/corridors/[slug]`) zeigen MI-Daten **nur** wenn status = `reviewed` oder `approved`.

---

## Agent

### `lib/agents/migration-intelligence-agent.ts`

**Schritte:**
1. Alle nicht-veralteten `migration_intelligence`-Einträge laden
2. Korridor-Opportunity-Scores laden
3. Existierende Suggestion-Titel der letzten 7 Tage laden (Dedup)
4. Scores neu berechnen, Risikolevel ableiten, unvollständige Einträge → status=draft
5. Korridore mit inaktivem Korridor → status=outdated
6. CEO-Vorschläge: Top-3 (Erfolg) + alle high/critical
7. Notifications: alle high/critical (24h-Dedup)
8. System-Log schreiben

---

## API-Routen

| Route | Methode | Beschreibung |
|-------|---------|--------------|
| `/api/admin/global/migration-intelligence` | GET | Alle MI-Einträge |
| `/api/admin/global/migration-intelligence/run-agent` | POST | MI-Agent manuell starten |

**Zugriff:** Nur für Admins (`getCurrentAdminUser()`)

---

## Seiten

| Route | Typ | Beschreibung |
|-------|-----|--------------|
| `/admin/global/migration-intelligence` | Admin (privat) | Übersicht + Agent-Button + Score-Tabelle |
| `/corridors/[slug]` | Public (dynamisch) | Zeigt MI-Daten wenn reviewed/approved |

---

## Public-Seite `/corridors/[slug]` — MI-Sektion

Wenn für den Korridor ein `migration_intelligence`-Eintrag mit status = `reviewed` oder `approved`
existiert, wird eine zusätzliche Sektion angezeigt mit:

- **Erfolgswahrscheinlichkeit** mit Farbbalken
- **Komplexitätswerte** (Visa, Anerkennung, Sprache, Dokumente)
- **Typische Dokumente** (aus `required_documents`)
- **Anerkennungsschritte** (aus `recognition_steps`)
- **Visa-Wege** (aus `visa_pathways`, falls CI nicht schon etwas zeigt)
- **Sprachanforderungen** (aus `language_requirements`, falls CI nicht schon etwas zeigt)
- **Empfohlene nächste Schritte** (aus `recommended_next_steps`)
- **Disclaimer** — immer sichtbar

---

## Seed-Daten (8 Korridore)

| Korridor | Erfolg | Risiko | Status |
|---------|--------|--------|--------|
| Indien → Kanada (IT) | 89% | low | reviewed |
| Indien → UK (Pflege) | 74% | medium | reviewed |
| Philippinen → Australien (Pflege) | 70% | medium | reviewed |
| Marokko → Deutschland (Pflege) | 56% | high | reviewed |
| Türkei → Deutschland (IT) | 72% | medium | reviewed |
| Nigeria → UK (Pflege) | 71% | medium | reviewed |
| Brasilien → Portugal (Technik) | 82% | low | reviewed |
| Tunesien → Frankreich (Industrie) | 69% | medium | reviewed |

---

## Sicherheit & Compliance

- **RLS aktiviert** — kein öffentlicher Zugriff
- **Kein Rechtsbeistand** — klarer Disclaimer auf allen Seiten
- **Keine Garantien** — alle Scores sind Orientierungswerte
- **Keine externen APIs** — alle Daten aus interner DB
- **system_logs** — alle Agent-Läufe vollständig protokolliert
- **Kein automatisches Senden** — Agent analysiert nur, schreibt nie E-Mails

---

## Verwandte Module

- [[corridor-intelligence]] — Quelldata für Berufe, Visa-Wege, Sprachanforderungen
- [[global-market-intelligence]] — Korridor-Scores und Opportunity-Scores
- [[landingpage-factory]] — Öffentliche Karierre-Landingpages pro Korridor
- [[global-candidate-acquisition]] — Kandidatenquellen für Outreach
