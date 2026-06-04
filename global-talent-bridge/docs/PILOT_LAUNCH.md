# Pilot Launch — Global Talent Bridge

> **Zweck:** Dieses Dokument erklärt, wie Global Talent Bridge systematisch erste echte Pilot-Arbeitgeber und Pilot-Kandidaten gewinnt, verwaltet und in messbare Geschäftsergebnisse umwandelt — ohne automatischen externen Versand, mit vollständiger Admin-Kontrolle.

---

## 1. Strategie: Wie erste echte Nutzer gewonnen werden

### Grundprinzip
GTB gewinnt erste echte Nutzer **nicht durch Marketing-Kampagnen**, sondern durch direktes, kontrolliertes Pilotieren mit ausgewählten Arbeitgebern und Kandidaten.

### Drei Phasen des Pilot-Launches

| Phase             | Fokus                         | Ziel                                        |
|-------------------|-------------------------------|---------------------------------------------|
| **Phase 1 — Identifikation** | Arbeitgeber mit Fachkräftemangel finden | 10 qualifizierte Arbeitgeber kontaktieren  |
| **Phase 2 — Demo & Onboarding** | Demo-Termine, erstes Matching zeigen | 3-5 aktive Pilotkunden gewinnen        |
| **Phase 3 — Aktiver Pilot** | Echtes Matching + Feedback | Erstes echtes Revenue, Referenzen, Case Studies |

### Zielkorridore für Pilot
1. **Marokko → Deutschland (Pflege)** — hohe Nachfrage, viele Kandidaten verfügbar
2. **Indien → Deutschland (IT)** — Visaerleichterungen, starkes Interesse
3. **Philippinen → Deutschland (Pflege)** — AHV/Anerkennungsroute etabliert
4. **Tunesien → Deutschland (Handwerk)** — Pilotprogramme vorhanden

---

## 2. Pilot-Arbeitgeber verwalten

### Status-Workflow

```
identified
    ↓
contacted_manual      ← Admin nimmt telefonisch/persönlich Kontakt auf
    ↓
interested            ← Arbeitgeber signalisiert Interesse
    ↓
demo_scheduled        ← Termin für Produkt-Demo vereinbart
    ↓
onboarding            ← Vertrag / Trial-Zugang
    ↓
active_pilot          ← Erster echter Einsatz des Systems
    ↓
[rejected]            ← Falls kein Interesse
```

### Pflichtfelder pro Arbeitgeber
- **Firmenname** + **Land** + **Branche**
- **Kontaktperson** (Name, optional E-Mail, Telefon)
- **Status** + **Interesse-Level** (unknown/low/medium/high/very_high)
- **Nächster Schritt** (Freitext: z.B. "Demo am 15.06.2026 um 14:00")
- **Follow-up-Datum** — wird vom Agent überwacht

### Interesse-Level als Priorisierungskriterium
| Level    | Bedeutung                                      | Agent-Priorität |
|----------|------------------------------------------------|-----------------|
| very_high| Hat aktiv nachgefragt oder Demo-Termin bestätigt| Critical        |
| high     | Klar Interesse, wartet auf Details              | Critical        |
| medium   | Neugierig, nicht dringend                       | High            |
| low      | Hat reagiert, aber wenig Interesse              | Medium          |
| unknown  | Noch nicht eingeschätzt                         | Low             |

### Admin-Steuerung
Arbeitgeber werden direkt in Supabase verwaltet oder über die Admin-Page `/admin/pilot-launch` eingesehen. Kein automatischer Versand. Alle Kontakte erfolgen manuell durch den Admin.

---

## 3. Pilot-Kandidaten verwalten

### Wer sind Pilot-Kandidaten?
Pilot-Kandidaten sind **Testkandidaten**, die:
- aus bekannten Korridoren kommen (z.B. Marokko → DE Pflege)
- qualifiziert genug sind, um in Demo-Präsentationen gezeigt zu werden
- über Landingpages, Facebook-Gruppen oder Empfehlungen gewonnen wurden

### Qualitätsscore (0-100)
| Tier       | Score  | Bedeutung                              |
|------------|--------|----------------------------------------|
| Excellent  | ≥ 85   | Demo-reif, sofort einsetzbar           |
| Good       | 70-84  | Gut, minimaler Aufwand zur Demo-Reife  |
| Fair       | 50-69  | Potential vorhanden, Nacharbeit nötig  |
| Low        | < 50   | Nicht für Demo geeignet                |

### Kandidaten-Status-Workflow
```
identified → contacted → interested → onboarding → active → placed
                                                          ↓
                                                       [rejected]
```

---

## 4. Pilot Launch Agent

### Funktionsweise
Der `runPilotLaunchAgent()` in `lib/agents/pilot-launch-agent.ts` wird täglich durch den Agent Orchestrator ausgeführt und hat folgende Aufgaben:

1. **Follow-ups erkennen** — Arbeitgeber, bei denen `next_follow_up_at ≤ today`
2. **Tasks für Follow-ups erstellen** — automatisch in `pilot_tasks` (Dedup: 24h)
3. **Demo-Prep-Tasks** — für jeden Arbeitgeber mit `status = demo_scheduled`
4. **CEO-Suggestions generieren**:
   - Pipeline-Übersicht (Arbeitgeber in aktiven Phasen)
   - Follow-up-Alarm (wenn überfällig)
   - Kandidaten-Qualitäts-Alarm (wenn ≥3 hochwertige Kandidaten bereit)
   - Feedback-Alarm (wenn kritisches Feedback unbearbeitet)
5. **system_logs schreiben** — vollständiger Audit-Trail

### Was der Agent NICHT tut
- Keine E-Mails senden
- Keine WhatsApp-Nachrichten
- Keine externen API-Aufrufe
- Keine Datenlöschung

### Agent manuell starten
```bash
POST /api/admin/pilot-launch/run-agent
# Nur für Admin (getCurrentAdminUser check)
```

---

## 5. Pilot-Aufgaben (Tasks)

### Aufgaben-Typen
| Typ          | Beschreibung                            | Icon |
|--------------|-----------------------------------------|------|
| call         | Arbeitgeber anrufen                     | 📞   |
| demo_prep    | Demo vorbereiten                        | 🎯   |
| lp_review    | Landingpage auf Konversion prüfen       | 🌐   |
| source_check | Kandidatenquelle überprüfen             | 🔍   |
| feedback     | Feedback einholen                       | 💬   |
| follow_up    | Follow-up Kontakt aufnehmen             | 🔔   |
| onboarding   | Onboarding-Prozess vorbereiten          | 🚀   |
| general      | Allgemeine Aufgabe                      | 📋   |

### Prioritäten
- **critical** — Demo-Termin steht an, Follow-up überfällig
- **high** — Interessierter Kontakt wartet auf Antwort
- **medium** — Standard Follow-up, keine Dringlichkeit
- **low** — Langfristige Aufgabe

---

## 6. Pilot-Feedback

### Wozu Pilot-Feedback?
Feedback von Pilot-Arbeitgebern und -Kandidaten ist der **wichtigste Input für Produktverbesserungen**. Jedes strukturierte Feedback:
1. Erhöht die Produktqualität
2. Zeigt Investoren: "Wir hören auf Kunden"
3. Schafft Basis für Case Studies und Testimonials

### Feedback-Kategorien
| Kategorie       | Beispiel                                    |
|-----------------|---------------------------------------------|
| ux              | "Formular zu kompliziert"                   |
| feature_request | "Direktnachrichten an Kandidaten senden"    |
| bug             | "Login schlägt fehl bei bestimmten Emails"  |
| process         | "Anerkennungsdoku-Upload fehlt"             |
| pricing         | "Preis zu hoch für kleines Pflegeheim"      |
| matching        | "Match-Score passt nicht zu unseren Needs"  |
| general         | Sonstiges                                   |

### Feedback-Priorität = direkter Produktpriorität
- **critical** → Sofort im nächsten Sprint adressieren
- **high** → Im übernächsten Sprint
- **medium** → Backlog, nächstes Quartal
- **low** → Nice-to-have

---

## 7. Warum Pilotdaten den Verkaufswert erhöhen

### Das Pilot-Paradox
Ein Startup ohne Kunden ist schwer zu bewerten.
Ein Startup mit **auch nur 3 aktiven Pilotkunden** und strukturierten Daten ist **fundamental anders zu bewerten**.

### Konkrete Wertsteigerung durch Pilotdaten

| Datenpunkt                         | Auswirkung auf Bewertung                          |
|------------------------------------|---------------------------------------------------|
| 1+ aktiver Pilotkunde              | Proof of Concept → Bewertung ×2-3                 |
| Strukturiertes Feedback-System     | "Wir haben ein echtes Lernloop" → Vertrauen ↑     |
| Messbare Demo-Konversionsrate      | Investoren können Wachstum modellieren            |
| Pilot-Kandidaten mit Qualitäts-Score | Supply-Side validiert → kein leeres Versprechen |
| Vollständige Pipeline-Daten        | Revenue-Forecast wird glaubwürdig                 |
| Dokumentierter Follow-up-Prozess   | Sales-Reife beweisen → M&A Readiness ↑            |

### Was Käufer suchen
Beim Kauf einer SaaS-Plattform suchen Käufer nicht nur Technologie — sie suchen:
1. **Beweis, dass echte Kunden zahlen würden** → Active Pilot = Beweis
2. **Reproduzierbaren Prozess** → Pilot-Workflow = Prozess
3. **Skalierungspotential** → 5 Piloten → 50 Kunden = plausibel
4. **Niedrige Churn-Risiken** → Feedback-Loop = Kundenbindung

---

## 8. Admin-Pages & API

| Seite / Route                        | Funktion                                      |
|--------------------------------------|-----------------------------------------------|
| `/admin/pilot-launch`                | Pilot Launch Dashboard (Arbeitgeber, Kandidaten, Tasks, Feedback) |
| `GET /api/admin/pilot-launch`        | Alle Pilot-Daten abrufen                      |
| `POST /api/admin/pilot-launch/run-agent` | Pilot Launch Agent manuell starten       |
| `/admin/ceo-dashboard`               | 🚀 Pilot Launch Sektion (KPIs)                |

---

## 9. Datenbank-Tabellen

| Tabelle           | Zeilen (Seed) | Zweck                              |
|-------------------|---------------|------------------------------------|
| `pilot_employers` | 5             | Pilot-Arbeitgeber Pipeline         |
| `pilot_candidates`| 5             | Pilot-Kandidaten Pool              |
| `pilot_campaigns` | 0             | Kampagnen-Verwaltung               |
| `pilot_tasks`     | 6             | Offene Aufgaben                    |
| `pilot_feedback`  | 0             | Feedback-Tracker                   |

Alle Tabellen: RLS aktiv, service_role-only, keine Public-Zugriffe.

---

## 10. Nächste Schritte (Pilot Roadmap)

| Aktion                                  | Verantwortlich | Zeitrahmen   |
|-----------------------------------------|----------------|--------------|
| Demo-Termin mit Hospitality Group Wien  | Admin          | Sofort       |
| Demo vorbereiten: Pflege Plus GmbH      | Admin          | Diese Woche  |
| MedCare Bayern anrufen                  | Admin          | Heute        |
| 5 Pilot-Kandidaten Profile vervollständigen | Admin      | Diese Woche  |
| Erste aktive Pilot-Phase starten        | Admin          | Q3 2026      |
| 3 aktive Pilotkunden erreichen          | Admin          | Q3 2026      |
| Erstes Pilot-Feedback erheben           | Admin          | Nach Demo    |

---

*Erstellt: 2026-06-04 · Sprint G — Pilot Launch Engine*  
*Keine automatischen externen Nachrichten. Alle Aktionen durch Admin kontrolliert.*
