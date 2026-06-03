# Global Talent Bridge — Agenten-Architektur

Das System folgt dem Prinzip eines großen Unternehmens mit CEO-Zentrale und spezialisierten Abteilungen.

---

## CEO / Erzdirigent

Der CEO-Agent ist die zentrale Steuerungseinheit.

**Der CEO-Agent darf:**
- Berichte lesen
- Status aller Abteilungen prüfen
- Aufgaben priorisieren
- Risiken erkennen
- Aufgaben an Abteilungen verteilen
- Menschliche Freigabe bei riskanten Aktionen anfordern

**Der CEO-Agent darf NICHT:**
- Eigenständig kostenpflichtige Dienste aktivieren
- Rechtliche Texte als garantiert rechtssicher markieren
- Ohne Freigabe echte E-Mails versenden
- Ohne Freigabe externe Scraper aktivieren
- Secrets lesen oder anzeigen

---

## 12 Hauptabteilungen

| # | Department Key | Name |
|---|----------------|------|
| 1 | `strategy_vision_department` | Strategie & Vision |
| 2 | `product_tech_department` | Produkt & Technik |
| 3 | `data_matching_department` | Daten & Matching |
| 4 | `marketing_growth_department` | Marketing & Wachstum |
| 5 | `sales_employer_department` | Sales & Arbeitgebergewinnung |
| 6 | `partnerships_department` | Partnerschaften & Netzwerke |
| 7 | `revenue_monetization_department` | Umsatz & Monetarisierung |
| 8 | `customer_success_department` | Kundenservice & Support |
| 9 | `legal_risk_department` | Recht, DSGVO & Risiko |
| 10 | `quality_control_department` | Qualität & Kontrolle |
| 11 | `finance_cost_department` | Finanzen & Kostenkontrolle |
| 12 | `automation_orchestration_department` | Automatisierung & Agenten-Orchestrierung |

---

## Kommunikationsprinzip

Das System kommuniziert intern über strukturierte Datenbanktabellen:

| Tabelle | Zweck |
|---------|-------|
| `system_logs` | Diagnose- und Ereignisprotokoll |
| `agent_tasks` | Aufgabenliste (geplant, aktiv, abgeschlossen) |
| `agent_reports` | Berichte und Empfehlungen der Abteilungen |
| `business_metrics` | Geschäftliche Kennzahlen |
| `agent_registry` | Installierte Agenten/Baugruppen |
| `agent_departments` | Unternehmensstruktur |

---

## Sicherheitsprinzipien

1. **Kein autonomes Handeln ohne Freigabe** — alle Agenten mit `requires_human_approval = true` warten auf Bestätigung
2. **Kein direkter Client-Zugriff** auf interne Tabellen — nur Service Role / Admin-API
3. **Keine kostenpflichtigen Aktionen** ohne explizite Genehmigung
4. **Risk Levels**: `low` → `medium` → `high` — je höher, desto mehr menschliche Überwachung

---

## Phase-Plan

### Phase 1 (aktuell)
- Alle Abteilungen sind vorbereitet (`active = false`)
- Keine autonomen Agenten aktiv
- Fundament: Datenbank, RLS, Typen, Supabase-Clients

### Phase 2 (geplant)
- Einzelne Agenten aktivieren (z.B. Matching-Agent)
- Menschliche Freigabe für alle Aktionen erforderlich
- System-Logs und Reports aufbauen

### Phase 3 (Zukunft)
- Teilautomatisierung mit kontrollierten Freigabe-Workflows
- CEO-Koordination zwischen aktiven Abteilungen
- Business Metrics Tracking

---

> ⚠️ **Wichtig**: Agenten sind Baugruppen — sie werden gezielt hinzugefügt, nicht alle auf einmal aktiviert.
> Niemals alle Agenten gleichzeitig aktivieren. Immer kontrolliert, abteilungsweise, mit Freigabe.
