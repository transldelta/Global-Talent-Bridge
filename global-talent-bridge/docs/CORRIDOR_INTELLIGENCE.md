# 🧠 CorridorWork — Corridor Intelligence

## Was ist Corridor Intelligence?

Corridor Intelligence ist die zweite Wissensschicht über den einfachen Migrations-Korridoren (Quelle → Ziel).

Während ein Migrations-Korridor nur beschreibt **wohin** Menschen migrieren wollen, beschreibt Corridor Intelligence **wie** diese Migration konkret funktioniert:

---

## 1. Was Corridor Intelligence enthält

Für jeden der 8 Migrations-Korridore werden folgende Informationen strukturiert gespeichert:

### Berufs-Wissen (top_professions)
Welche konkreten Berufe in diesem Korridor gefragt sind.

**Beispiel Nigeria → UK Pflege:**
- Registered Nurse (Adult)
- Mental Health Nurse
- Healthcare Assistant
- Senior Care Worker

### Sprachanforderungen (language_requirements)
Welche Sprachtests und -niveaus für Visa und Berufsanerkennung erforderlich sind.

**Beispiel Marokko → Deutschland Pflege:**
- Beruflicher Einstieg: B1 Deutsch
- Anerkennung: B2 Deutsch
- Empfohlen: C1 für eigenständige Patientenkommunikation

### Visa-Wege (visa_pathways)
Welche Visa-Kategorien für den jeweiligen Korridor relevant sind.

**Beispiel Indien → Kanada IT:**
- Express Entry — Federal Skilled Worker
- Provincial Nominee Program (PNP)
- Intra-Company Transfer (L-1 äquivalent)
- Post-Graduate Work Permit (PGWP)

### Anerkennungsanforderungen (recognition_requirements)
Welche Dokumente und Prüfungen für Berufsanerkennung im Zielland erforderlich sind.

**Beispiel Philippinen → Australien Pflege:**
- AHPRA Registration (Australian Health Practitioner Regulation Agency)
- IELTS ≥ 7.0 (alle Bereiche)
- Certificate of Registration aus PH
- Bridging Program (sofern erforderlich)

### Gehaltsrahmen (estimated_salary_range)
Marktübliche Gehaltsspannen im Zielland für die Top-Berufe des Korridors.

### Scoring
- **opportunity_score**: Kombiniert Nachfrage, Angebot und CI-Wissen (0–100)
- **demand_level**: Stärke der Arbeitgebernachfrage im Zielland (0–100)
- **migration_difficulty**: Komplexität des Migrationsprozesses (0–100, höher = schwieriger)

### Empfohlene Kanäle (recommended_channels)
Auf welchen Plattformen und Kanälen potenzielle Kandidaten für diesen Korridor am besten erreichbar sind.

---

## 2. Kampagnen-Empfehlungen

Aus den Corridor Intelligence Daten werden **Kampagnen-Empfehlungen** abgeleitet:

| Feld | Beschreibung |
|---|---|
| target_audience | Präzise Beschreibung der Zielgruppe |
| language | Sprache der Kampagne (en/de/fr/tr/pt) |
| recommended_channels | Konkrete Kanäle (LinkedIn, Facebook, WhatsApp-Gruppen, etc.) |
| landingpage_slug | URL-Pfad für korridor-spezifische Landing Page |
| campaign_priority | critical / high / medium / low |
| estimated_reach | Geschätzte Reichweite (informativ, nicht garantiert) |
| status | draft / ready_for_review / approved / paused / rejected |

### Wichtig: Kampagnen-Empfehlungen sind Planungsdokumente

Kampagnen-Empfehlungen führen zu **keinen automatischen Aktionen**:
- ❌ Kein automatisches Schalten von Werbeanzeigen
- ❌ Kein automatisches Versenden von E-Mails
- ❌ Kein automatisches Versenden von WhatsApp-Nachrichten
- ❌ Kein automatisches Posten auf Social Media

Alle Kampagnen müssen vom Admin **manuell genehmigt** (status = 'approved') und **manuell durchgeführt** werden.

---

## 3. Corridor Intelligence Agent

Der Corridor Intelligence Agent läuft auf Admin-Anfrage (kein Cron, kein Auto-Trigger):

### Was der Agent tut:
- ✅ Analysiert alle `corridor_intelligence` Einträge
- ✅ Aktualisiert `opportunity_score` basierend auf aktuellen Corridor-Daten
- ✅ Erstellt `agent_suggestions` für kritische und Top-Korridore
- ✅ Erstellt `agent_notifications` für kritische Korridore
- ✅ Schreibt alle Aktionen in `system_logs`

### Was der Agent NICHT tut:
- ❌ Keine externen API-Aufrufe
- ❌ Kein Scraping von Websites
- ❌ Keine E-Mails senden
- ❌ Keine WhatsApp-Nachrichten senden
- ❌ Keine Werbeanzeigen schalten
- ❌ Keine Daten löschen oder RLS ändern

---

## 4. Opportunity Score Formel

```
opportunity_score = round(
  corridor.demand_score  * 0.4 +
  corridor.supply_score  * 0.2 +
  ci.demand_level        * 0.4
)
```

- **corridor.demand_score**: Vom GMI-Agent berechnete Arbeitgebernachfrage
- **corridor.supply_score**: Verfügbare Kandidaten im Quellland
- **ci.demand_level**: Tiefes CI-Wissen über sektorspezifische Nachfrage

Prioritäten:
- 🔥 **critical** ≥ 85
- 📈 **high** ≥ 70
- 🟡 **medium** ≥ 50
- ⬇️ **low** < 50

---

## 5. Die 8 Korridore mit CI-Scores

| Korridor | Opportunity | Nachfrage | Schwierigkeit |
|---|---|---|---|
| Indien → Kanada (IT) | 88 | 85 | 55 |
| Indien → UK (Pflege) | 84 | 82 | 50 |
| Philippinen → Australien (Pflege) | 82 | 78 | 48 |
| Nigeria → UK (Pflege) | 78 | 76 | 42 |
| Marokko → Deutschland (Pflege) | 75 | 72 | 60 |
| Türkei → Deutschland (IT) | 75 | 70 | 45 |
| Brasilien → Portugal (Technik) | 68 | 65 | 35 |
| Tunesien → Frankreich (Industrie) | 62 | 60 | 40 |

*Scores sind initiale Seed-Werte. Der CI-Agent aktualisiert sie basierend auf aktuellen Daten.*

---

## 6. Kampagnen-Priorisierung

| Priorität | Korridore | Empfohlene Aktion |
|---|---|---|
| 🔥 critical | IN→CA (IT) | Sofortige manuelle Kampagnenplanung |
| 📈 high | IN→UK (Pflege), PH→AU (Pflege), NG→UK (Pflege) | Mittelfristige Kampagnenplanung |
| 🟡 medium | MA→DE (Pflege), TR→DE (IT), BR→PT (Technik) | Langfristige Kampagnenplanung |
| ⬇️ low | TN→FR (Industrie) | Beobachten, noch nicht priorisieren |

---

## 7. DSGVO-Compliance

- Keine personenbezogenen Daten in `corridor_intelligence` oder `campaign_recommendations`
- RLS aktiviert: nur Admin (service_role) kann auf diese Tabellen zugreifen
- Alle Aktionen werden in `system_logs` protokolliert
- Keine externen Datenquellen: alle Daten wurden manuell erfasst oder vom Agenten intern berechnet

---

*Dokument erstellt: 2026-06-04*
*Branch: feature/corridor-intelligence*
*Agent: corridor-intelligence-agent.ts*

---

## 8. Corridor Intelligence Sprint — lib/corridor-intelligence.ts

*Sprint: 2026-06-08 · Branch: feature/global-talent-bridge-mvp-phase-1*

### Neue Datei: `lib/corridor-intelligence.ts`

Reine Datenschicht ohne externe API-Abhängigkeiten. Enthält:

| Export | Zweck |
|---|---|
| `CORRIDOR_PROFILES` | 8 Korridore mit vollständigen Score-Breakdowns |
| `DEMO_CORRIDORS` | 3 Demo-Korridore für Käufer-Demos |
| `MONETIZATION_PATHS` | 7 Monetarisierungspfade |
| `BUYER_VALUE_ITEMS` | 7 Käufer-Wert-Kategorien |
| `BUYER_DIFFERENTIATION` | Positionierungsaussage |
| `SCORE_DISCLAIMER` | Pflicht-Disclaimer für alle Scores |
| `calculateBuyerScore()` | Score aus ScoreCriterion-Array berechnen |
| `scoreBand()` | green/yellow/red Band + Label für Score |

### Score-Methode (Buyer Opportunity Score)

```typescript
function calculateBuyerScore(criteria: ScoreCriterion[]): number {
  // sum(value) / sum(max) * 100, rounded
}
```

Jeder Korridor hat 7 Kriterien mit max=100 Gesamtpunkten:

| Kriterium | Max | Gewicht |
|---|---|---|
| Employer demand strength | 20 | 20 % |
| Candidate supply potential | 20 | 20 % |
| Partner availability | 15 | 15 % |
| Speed to pilot | 15 | 15 % |
| Revenue potential | 15 | 15 % |
| Compliance simplicity | 10 | 10 % |
| Buyer attractiveness | 5 | 5 % |

### Admin-Seite: `/admin/corridor-intelligence`

Vier Tabs:

1. **🌐 Corridor Scores** — 8 Korridore sortiert nach Buyer Opportunity Score, aufklappbar mit vollständigem Score-Breakdown
2. **🎯 Demo Cards** — 3 Demo-Korridore für Käufer-Demos mit Copy-Button
3. **💰 Monetization Map** — 7 Monetarisierungspfade sortiert nach Aufwand (low → high)
4. **🏆 Buyer Value Layer** — Vollständige Käufer-Wert-Übersicht mit Positionierungsstatement

### Tests

Datei: `__tests__/corridor-intelligence.lib.test.ts`

- 38 Tests · alle grün
- Abdeckung: `calculateBuyerScore`, `scoreBand`, Datenintegrität aller Arrays, Safety-Constraints

### Safety-Garantien

- ❌ Kein automatischer Versand
- ❌ Kein Scraping
- ❌ Keine Jobgarantie
- ❌ Keine Visagarantie
- ❌ Kein Stripe
- ❌ Keine Fake-Umsätze
- ✅ SCORE_DISCLAIMER auf jeder Score-Anzeige sichtbar
