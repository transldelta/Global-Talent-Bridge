# Revenue Intelligence Engine

**Branch:** `feature/revenue-intelligence-engine`  
**Status:** Active — Simulation & Forecast only. No real payments. No Stripe.  
**Created:** 2026-06-04  

---

## ⚠️ Wichtiger Hinweis

**Alle Zahlen auf diesen Seiten und in diesem Dokument sind Forecast-Simulationen.**  
Keine echten Zahlungen. Keine Stripe-Integration. Keine Abbuchungen.  
Die Revenue Intelligence dient ausschließlich der internen Planung und Investor-Kommunikation.

---

## Übersicht

Die Revenue Intelligence Engine modelliert die Monetarisierungsstruktur von CorridorWork.
Sie analysiert Revenue-Pläne, berechnet MRR/ARR-Forecasts in drei Szenarien und leitet Break-even-Schätzungen ab.

**Was der Agent tut:**
- ✅ Revenue Plans analysieren (Arbeitgeber, Kandidaten, Partner)
- ✅ MRR und ARR für 3 Szenarien berechnen
- ✅ Break-even schätzen
- ✅ Vermittlungsgebühren-Potenzial kalkulieren
- ✅ CEO-Vorschläge mit Forecast-Daten erstellen
- ✅ Tägliche Forecast-Events in `revenue_events` speichern
- ✅ Alle Aktionen in `system_logs` protokollieren

**Was der Agent NICHT tut:**
- ❌ Stripe aufrufen
- ❌ Echte Zahlungen auslösen
- ❌ Abbuchungen verarbeiten
- ❌ Externe APIs nutzen
- ❌ E-Mails senden

---

## Revenue-Modell

### Arbeitgeber-Pläne

| Plan | Monatlich | Jährlich | Zielgruppe |
|------|-----------|---------|------------|
| Free | 0 € | 0 € | Einstieg / Testen |
| Starter | 149 € | 1.490 € | KMU mit 1–5 Stellen |
| Professional | 399 € | 3.990 € | Wachsende Arbeitgeber |
| Enterprise | 999 € | 9.990 € | Konzerne / Institutionen |

**Annahme Arbeitgeber-Mix:** 70% Starter + 25% Professional + 5% Enterprise  
→ Ø MRR/Arbeitgeber: **~254 EUR**

### Kandidaten-Pläne

| Plan | Monatlich | Jährlich | Zielgruppe |
|------|-----------|---------|------------|
| Free | 0 € | 0 € | Alle Kandidaten |
| Premium | 29 € | 290 € | Aktiv suchende Fachkräfte |

**Annahme:** 15% der Kandidaten konvertieren zu Premium.

### Partner-Pläne

| Plan | Monatlich | Provision | Beschreibung |
|------|-----------|---------|------------|
| Referral Partner | 0 € | 10% (Abo) / 5% (Placement) | Externe Empfehlungspartner |

---

## Zusätzliche Umsatzquellen

### Vermittlungsgebühren (Placement Fees)

- **500 EUR** pro erfolgreicher internationaler Vermittlung
- Annahme: 5% der Kandidaten führen zu einer erfolgreichen Vermittlung pro Jahr
- Zusätzlich zu Abo-Umsätzen — nicht in MRR enthalten

---

## Forecast-Szenarien

### Forecast-Annahmen

| Parameter | Wert |
|-----------|------|
| Ø MRR/Arbeitgeber | ~254 EUR |
| Kandidaten-Conversion Premium | 15% |
| Kandidaten-Premium-Preis | 29 EUR/Monat |
| Vermittlungsgebühr | 500 EUR/Placement |
| Vermittlungsrate | 5%/Jahr der Kandidaten |
| Monatliche OpEx (Schätzung) | ~3.000 EUR |

### Szenario A — Early Stage

| Kennzahl | Wert |
|---------|------|
| Arbeitgeber | 10 |
| Kandidaten | 100 |
| MRR | ~1.827 EUR |
| ARR | ~21.924 EUR |
| Placement Fees/Jahr | ~250 EUR |
| Gesamt Jahresumsatz | ~22.174 EUR |
| Break-even | ~2 Monate |

### Szenario B — Growth Phase

| Kennzahl | Wert |
|---------|------|
| Arbeitgeber | 50 |
| Kandidaten | 500 |
| MRR | ~13.392 EUR |
| ARR | ~160.704 EUR |
| Placement Fees/Jahr | ~1.250 EUR |
| Gesamt Jahresumsatz | ~161.954 EUR |
| Break-even | 1 Monat |

### Szenario C — Scale Phase

| Kennzahl | Wert |
|---------|------|
| Arbeitgeber | 100 |
| Kandidaten | 1.000 |
| MRR | ~29.050 EUR |
| ARR | ~348.600 EUR |
| Placement Fees/Jahr | ~2.500 EUR |
| Gesamt Jahresumsatz | ~351.100 EUR |
| Break-even | < 1 Monat |

> ⚠️ Alle Szenarien sind Simulationen. Keine Garantien.

---

## Datenbankstruktur

### `revenue_plans`

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| `id` | uuid | Primärschlüssel |
| `audience_type` | text | employer / candidate / partner |
| `plan_name` | text | Planname |
| `monthly_price` | numeric | Monatlicher Preis in EUR |
| `yearly_price` | numeric | Jährlicher Preis in EUR |
| `features` | jsonb | Feature-Liste als Array |
| `active` | boolean | Ist der Plan aktiv |
| `created_at` | timestamptz | Erstellt am |

**RLS:** Aktiviert. Kein öffentlicher Zugriff — nur service_role.

### `revenue_events`

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| `id` | uuid | Primärschlüssel |
| `event_type` | text | subscription / placement_fee / premium_upgrade / referral_commission / forecast |
| `amount` | numeric | Betrag in EUR |
| `currency` | text | Währung (Standard: EUR) |
| `source` | text | Quelle / Szenario-Label |
| `notes` | text | Notiz / Beschreibung |
| `created_at` | timestamptz | Erstellt am |

**RLS:** Aktiviert. Kein öffentlicher Zugriff — nur service_role.

---

## Agent: `lib/agents/revenue-intelligence-agent.ts`

**Schritte:**
1. Aktive `revenue_plans` laden
2. 3 Forecast-Szenarien berechnen (via `lib/revenue/forecast.ts`)
3. 7-Tage-Dedup für agent_suggestions
4. CEO-Vorschläge: Top-Szenario, Plan-Vollständigkeit, Break-even-Alert
5. Tägliche Forecast-Events in `revenue_events` speichern (1x/Tag)
6. System-Log schreiben

---

## API-Routen

| Route | Methode | Beschreibung |
|-------|---------|--------------|
| `/api/admin/revenue` | GET | Plans + Events laden |
| `/api/admin/revenue/run-agent` | POST | Revenue-Agent starten |

---

## Seiten

| Route | Typ | Beschreibung |
|-------|-----|--------------|
| `/admin/revenue` | Admin (privat) | Revenue-Übersicht + Forecasts + Pläne + Agent-Button |

---

## Risiken und Annahmen

| Risiko | Beschreibung |
|--------|--------------|
| Conversion-Rate | 15% Kandidaten-Conversion ist eine Schätzung — könnte niedriger sein |
| Arbeitgeber-Mix | 70/25/5% Mix ist eine Annahme — Enterprise-Anteil könnte kleiner sein |
| Churn | Kein Churn modelliert — reale MRR-Entwicklung könnte schlechter sein |
| OpEx | 3.000 EUR/Monat ist eine konservative Schätzung für frühe Phase |
| Placement Rate | 5% ist eine Branchen-Schätzung — könnte variieren |

---

## Verwandte Module

- [[landingpage-factory]] — SEO-Kandidatenakquisition für Skalierung
- [[global-candidate-acquisition]] — Kandidatenquellen für Revenue-Basis
- [[migration-intelligence]] — Korridor-Bewertung beeinflusst Placement-Potenzial
- [[global-market-intelligence]] — Marktdaten für Forecast-Validierung
