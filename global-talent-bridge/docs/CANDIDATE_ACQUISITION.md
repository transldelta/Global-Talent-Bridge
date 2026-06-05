# 🎯 CorridorWork — Candidate Acquisition Engine

## Was ist die Candidate Acquisition Engine?

Die Candidate Acquisition Engine ist das Modul, das CorridorWork dabei hilft, **die richtigen Kandidatenquellen weltweit zu identifizieren, zu priorisieren und strategisch zu nutzen**.

Ziel ist nicht, automatisch Kandidaten anzusprechen — sondern dem Admin zu helfen, **die wertvollsten Quellen zu erkennen** und **gezielte, gut vorbereitete Aktionen zu planen**.

---

## 1. Wie Kandidatenquellen bewertet werden

Jede Quelle wird anhand von drei Dimensionen bewertet:

### Quality Score (0–100)
Wie gut ist die Qualität der potenziellen Kandidaten aus dieser Quelle?

Faktoren:
- Qualifikationsniveau (Berufsabschlüsse, Zertifizierungen)
- Sprachkompetenz (für Zielmärkte relevant)
- Migrationsmotivation (aktiv vs. passiv suchend)
- Historische Vermittlungserfolge (wenn vorhanden)

**Beispiel:** IIT Alumni Network India → Quality Score 92 (Elite-Ingenieure, weltweit gefragt)

### Opportunity Score (0–100)
Wie gut ist die Kombination aus Qualität, Reichweite und Erreichbarkeit?

```
opportunity_score = quality * 0.4 + reach_score * 0.3 + ease * 0.3

reach_score = log10(audience) / log10(10.000.000) * 100  (normalisiert)
ease = 100 - acquisition_difficulty
```

Prioritäten:
- 🔥 **critical** ≥ 85
- 📈 **high** ≥ 70
- 🟡 **medium** ≥ 50
- ⬇️ **low** < 50

### Acquisition Difficulty (0–100)
Wie schwierig ist es, mit dieser Quelle in Kontakt zu treten?

Faktoren:
- Zugangsbarrieren (offene vs. geschlossene Gemeinschaften)
- Formalitäten (Partnerschaftsvereinbarungen, Verbandsregeln)
- Wettbewerbsdichte (wie viele andere Anbieter werben hier?)
- Sprachliche/kulturelle Barrieren

---

## 2. Die 8 priorisierten Quellen

| Quelle | Land | Typ | Opportunity | Reichweite |
|---|---|---|---|---|
| IIT Alumni Network India | Indien | Universität | 88 | 500K |
| Naukri.com | Indien | Job-Board | 82 | 7M |
| POLO Philippines (POEA) | Philippinen | Verband | 80 | 800K |
| Goethe-Institut Rabat | Marokko | Sprachschule | 75 | 12K |
| Nigerian Nursing Association | Nigeria | Verband | 78 | 150K |
| Turkish Software Community | Türkei | Community | 74 | 90K |
| Brazil Engineering Network | Brasilien | Verband | 68 | 200K |
| Tunisia Industry Training Centers | Tunesien | Ausbildung | 62 | 35K |

---

## 3. Wie Prioritäten berechnet werden

Der **Global Candidate Acquisition Agent** läuft auf Admin-Anfrage und:

1. Lädt alle aktiven Quellen aus `candidate_acquisition_sources`
2. Berechnet `opportunity_score` nach der Formel oben
3. Leitet `priority_level` ab (critical/high/medium/low)
4. Aktualisiert geänderte Werte in der Datenbank
5. Erstellt `agent_suggestions` für kritische + Top-3-Quellen
6. Erstellt `agent_notifications` für kritische Quellen
7. Empfiehlt Landingpages, die noch nicht live sind (kritische Priorität)
8. Schreibt alles in `system_logs`

**Der Agent führt keine externen Aktionen aus.**

---

## 4. Landingpage-Empfehlungen

### Was sind Landingpage-Empfehlungen?

Für jeden Migrations-Korridor wird eine dedizierte Landing Page empfohlen, die:
- In der Sprache der Kandidaten geschrieben ist
- Den spezifischen Visa-Weg erklärt
- Die relevanten Berufe hervorhebt
- Eine klare Call-to-Action für die Registrierung enthält

### Beispiele

| Slug | Sprache | Korridor | Priorität |
|---|---|---|---|
| `/india-canada-it-jobs` | Englisch | Indien → Kanada IT | critical |
| `/india-uk-nursing-jobs` | Englisch | Indien → UK Pflege | high |
| `/philippines-australia-nursing-jobs` | Englisch | PH → AU Pflege | high |
| `/nigeria-uk-healthcare-jobs` | Englisch | Nigeria → UK Pflege | high |
| `/maroc-allemagne-soins-emplois` | Französisch | Marokko → DE Pflege | medium |
| `/turkiye-almanya-it-kariyer` | Türkisch | Türkei → DE IT | medium |
| `/brasil-portugal-engenharia-vagas` | Portugiesisch | Brasilien → PT Technik | medium |
| `/tunisie-france-industrie-emplois` | Französisch | Tunesien → FR Industrie | low |

### Status-Workflow

```
planned → in_progress → live → paused
```

Landingpages werden manuell vom Admin erstellt und deployed. Der Agent empfiehlt nur — er deployed nicht.

---

## 5. Warum dies den SaaS-Wert erhöht

### Präzisere Kandidatengewinnung

Statt generischer Stellenanzeigen: Korridor-spezifische Seiten mit exakten Informationen zu Visa, Gehalt, Anerkennung und Sprachvoraussetzungen.

**Konversion:**
- Generische Seite: ~0.5–1% Registrierungsrate
- Korridor-spezifische Seite: ~3–8% (erfahrungsgemäß bei spezifischen Nischenseiten)

### Skalierbarkeit

8 Korridore × 8 Quellen = 64 potenzielle Kombinations-Strategien, die systematisch priorisiert werden können.

### Daten-Moat

Die Kombination aus:
- Korridor-spezifischen Qualitätsdaten
- Quellenqualitäts-Scoring
- Historischen Vermittlungserfolgen

...ist nicht einfach replizierbar. Mit wachsenden Daten wird das System intelligenter.

### Bessere Arbeitgeberzufriedenheit

Arbeitgeber erhalten Kandidaten, die:
- Den richtigen Visa-Weg bereits kennen
- Die Sprachanforderungen verstehen
- Motiviert und informiert sind (nicht zufällig beworben haben)

---

## 6. Quellentypen und ihre Eigenschaften

| Typ | Beispiel | Stärke | Schwäche |
|---|---|---|---|
| `university` | IIT Alumni | Hochqualifiziert, Netzwerkeffekte | Kleinere Gruppen, selektiv |
| `job_board` | Naukri.com | Groß, aktiv jobsuchend | Niedrigere Qualität, viel Wettbewerb |
| `association` | POLO POEA | Offizielle Pipeline, vertrauenswürdig | Formale Anforderungen |
| `language_school` | Goethe-Institut | Sprachkompetenz gesichert | Kleinere Gruppen |
| `community` | Turkish Software | Engagiert, niedrige Barrier | Schwer zu messen |
| `training_center` | ATFP Tunesien | Strukturierte Ausbildung | Begrenzte Reichweite |
| `recruiter` | Externe Recruiter | Vorsortiert | Hohe Kosten, Abhängigkeit |
| `migration_forum` | Migration Foren | Hohe Motivation | Qualität variiert stark |

---

## 7. DSGVO-Compliance

- Keine personenbezogenen Daten in `candidate_acquisition_sources`
- Keine personenbezogenen Daten in `landingpage_recommendations`
- RLS aktiviert: nur Admin (service_role) kann auf diese Tabellen zugreifen
- Kein automatisches Scraping von Websites
- Kein automatisches Versenden von Nachrichten
- Alle Aktionen in `system_logs` protokolliert

---

## 8. Nächste Schritte (manuell durch Admin)

1. **Kritische Landingpages erstellen**: `/india-canada-it-jobs` als erste Seite, da höchster Opportunity Score
2. **IIT Alumni Network kontaktieren**: Offiziellen Partnerschaftskanal identifizieren
3. **POLO POEA Partnerschaft**: Formale Vereinbarung für Philippinen → Australien Korridor prüfen
4. **Naukri.com**: Arbeitgeber-Account für internationale Stellen einrichten (kostenpflichtig)
5. **Goethe-Institut Marokko**: Partnerschaft für Marokko → Deutschland Pflegekräfte

---

*Dokument erstellt: 2026-06-04*
*Branch: feature/global-candidate-acquisition*
*Agent: global-candidate-acquisition-agent.ts*
*DSGVO-konform. Kein Scraping. Keine automatischen Aktionen.*
