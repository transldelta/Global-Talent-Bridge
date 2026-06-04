# Employer Acquisition Engine

**Branch:** `feature/global-employer-acquisition`  
**Status:** Active — Analyze only, no automatic contact  
**Created:** 2026-06-04  

---

## Übersicht

Die Employer Acquisition Engine analysiert globale Arbeitgeberquellen und hilft dabei, die richtigen Arbeitgeber für die Global Talent Bridge Plattform zu identifizieren und zu priorisieren.

**Was der Agent tut:**
- ✅ Arbeitgeberquellen analysieren und bewerten
- ✅ Opportunity Scores berechnen und aktualisieren
- ✅ Outreach-Empfehlungen (Kanal + Nachrichtentyp) erstellen
- ✅ CEO-Vorschläge für kritische Quellen erstellen
- ✅ Benachrichtigungen für kritische Chancen erzeugen
- ✅ Alle Aktionen in `system_logs` protokollieren

**Was der Agent NICHT tut:**
- ❌ E-Mails an Arbeitgeber senden
- ❌ WhatsApp-Nachrichten senden
- ❌ Arbeitgeber automatisch kontaktieren
- ❌ Externe APIs (kostenpflichtig) aufrufen
- ❌ Werbung schalten
- ❌ Automatisches Scraping

---

## Datenbankstruktur

### `employer_acquisition_sources`

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| `id` | uuid | Primärschlüssel |
| `source_name` | text | Name der Quelle |
| `country` | text | Zielland |
| `sector` | text | Branche (z.B. "Pflege", "IT / Software") |
| `source_type` | text | Typ (enum, s.u.) |
| `estimated_employers` | integer | Geschätzte Anzahl erreichbarer Arbeitgeber |
| `quality_score` | integer (0–100) | Qualitätsbewertung der Quelle |
| `opportunity_score` | integer (0–100) | Berechneter Opportunity-Score |
| `acquisition_difficulty` | integer (0–100) | Schwierigkeit der Kontaktaufnahme |
| `priority_level` | text | low / medium / high / critical |
| `notes` | text | Freitext-Notizen |
| `status` | text | active / inactive / research |

**Source Types (Enum):**
- `hospital_group` — NHS Trusts, Krankenhaus-Gruppen
- `care_home_group` — Pflegeheim-Gruppen
- `it_company` — IT-Unternehmen
- `logistics_company` — Logistik-Unternehmen
- `industrial_company` — Industrie-Unternehmen
- `recruiter` — Einzelne Recruiter / Headhunter
- `staffing_agency` — Personalvermittlungen
- `employer_association` — Arbeitgeberverbände

### `employer_outreach_recommendations`

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| `id` | uuid | Primärschlüssel |
| `source_id` | uuid | FK → `employer_acquisition_sources` |
| `recommended_message_type` | text | Empfohlener Nachrichtentyp |
| `recommended_channel` | text | Empfohlener Outreach-Kanal |
| `priority_level` | text | low / medium / high / critical |
| `notes` | text | Automatisch generierte Hinweise |
| `status` | text | draft / ready_for_review / approved / paused |

---

## Opportunity Score Formel

```
opportunity_score = quality_score * 0.45
                  + reach_score   * 0.25
                  + ease          * 0.30

reach_score = log10(estimated_employers) / log10(15_000) * 100  (max 100)
ease        = 100 - acquisition_difficulty
```

**Prioritäts-Schwellenwerte:**
| Score | Priorität |
|-------|-----------|
| ≥ 85 | critical |
| ≥ 70 | high |
| ≥ 50 | medium |
| < 50 | low |

---

## Seed-Daten (8 Quellen)

| Quelle | Land | Sektor | Typ |
|--------|------|--------|-----|
| NHS Trusts UK | UK | Pflege | hospital_group |
| Canadian Health Employers | Canada | Pflege | hospital_group |
| Australian Aged Care Providers | Australia | Pflege | care_home_group |
| German Hospital Networks (KKVD) | Deutschland | Pflege | hospital_group |
| German Care Home Groups (bpa) | Deutschland | Pflege | care_home_group |
| Turkish IT Employers (TÜBİSAD) | Türkei | IT / Software | it_company |
| Portugal Industry Employers (CIP) | Portugal | Industrie / Produktion | employer_association |
| France Industrial Associations (UIMM) | Frankreich | Industrie / Produktion | employer_association |

---

## API-Routen

| Route | Methode | Beschreibung |
|-------|---------|--------------|
| `/api/admin/global/employer-acquisition` | GET | Alle Quellen (nach opportunity_score) |
| `/api/admin/global/employer-acquisition/run-agent` | POST | GEA-Agent manuell starten |
| `/api/admin/global/employer-outreach` | GET | Alle Outreach-Empfehlungen mit Source-Infos |

**Zugriff:** Nur für Admins (`getCurrentAdminUser()`)

---

## Admin-Seiten

| Route | Beschreibung |
|-------|--------------|
| `/admin/global/employer-acquisition` | Quellenübersicht + GEA-Agent starten |
| `/admin/global/employer-outreach` | Outreach-Empfehlungen nach Priorität |

---

## Agent-Logik (`lib/agents/global-employer-acquisition-agent.ts`)

1. **Lade aktive Quellen** aus `employer_acquisition_sources`
2. **Berechne Opportunity Scores** für alle Quellen
3. **Aktualisiere geänderte Scores** in der DB
4. **Erstelle Outreach-Empfehlungen** für Quellen ohne bestehende Empfehlung
5. **Erstelle CEO-Vorschläge** für critical + Top-3-Quellen (7-Tage-Dedup)
6. **Erstelle Benachrichtigungen** für critical-Quellen (24h-Dedup)
7. **Schreibe system_logs**

---

## Sicherheit & Compliance

- **RLS aktiviert** auf beiden Tabellen — kein öffentlicher Zugriff
- **Keine automatischen E-Mails** an Arbeitgeber
- **Keine automatischen Nachrichten** (kein WhatsApp, kein SMS)
- **Kein automatisches Scraping** von Arbeitgeber-Webseiten
- **Nur interne Analyse** — alle Outreach-Aktionen manuell durch Admin
- **system_logs** — alle Agent-Läufe werden vollständig protokolliert
- **DSGVO-konform** — keine personenbezogenen Daten ohne Einwilligung

---

## CEO Dashboard

Sektion "🏢 Employer Acquisition" zeigt:
- KPIs: Aktive Quellen, Kritische, Hohe Priorität, Outreach-Empfehlungen gesamt
- Top-Quellen-Tabelle mit Opportunity Scores, Arbeitgeberanzahl und Priorität
- Links zu Detail-Seiten

---

## Verwandte Module

- [[corridor-intelligence]] — Migrations-Korridore und Kampagnen-Empfehlungen
- [[global-candidate-acquisition]] — Kandidatenquellen weltweit
- [[global-market-intelligence]] — GMI-Übersicht und Korridor-Scoring
- Outreach Approval Queue — manueller Genehmigungsprozess für alle Aktionen
