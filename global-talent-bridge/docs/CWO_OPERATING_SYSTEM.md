# CWO Operating System — Autonomous Revenue Operating System

**Version:** 1.0 (Phase 1)  
**Status:** Live  
**Autonomy Level:** A4 (automatisch analysieren + priorisieren + berichten; keine externen Aktionen)

---

## Was ist das CWO Operating System?

Das CWO (CorridorWork Operating System) ist ein **autonomes Revenue Operating System** — es analysiert, priorisiert und bereitet Aufgaben vor, damit CorridorWork für den Nutzer arbeitet statt umgekehrt.

Es besteht aus **8 Agent-Departments**, die intern zusammenarbeiten, ohne externe API-Calls, ohne E-Mail-Versand und ohne Scraping.

---

## 8 Agent Departments

| Department | Seite | Aufgabe |
|---|---|---|
| 🧠 CEO Agent | `/admin/cwo-command-center` | Orchestriert alle Departments, erstellt Tageslage |
| 🌍 Global Demand | `/admin/global-demand-radar` | Analysiert 10 globale Talent-Korridore |
| 🏭 Employer Demand | `/admin/employer-demand-map` | Priorisiert 10 Arbeitgeberbranchen |
| 🧲 Candidate Magnet | `/admin/candidate-magnet` | Baut legale Inbound-Strategie für Bewerber |
| 📈 Inbound Growth | `/admin/inbound-growth-engine` | SEO, Landingpages, Selbstregistrierung |
| 💰 Revenue Pragmatist | `/admin/revenue-pragmatist` | Bewertet Revenue-Streams |
| 🛡️ Compliance Guard | (Teil des Command Centers) | Blockiert riskante Aktionen |
| ⚙️ Operations | `/admin/autonomous-worklog` | Systemstatus, Pilot-Schritte, Tagesbericht |

---

## Autonomy Levels (Phase 1)

| Level | Bedeutung | Status |
|---|---|---|
| A0 | Read-only: Anzeigen ohne Aktion | ✅ Erlaubt |
| A1 | Analyse automatisch ausführen | ✅ Erlaubt |
| A2 | Interne Berichte erstellen | ✅ Erlaubt |
| A3 | Entwürfe + Inhalte vorbereiten | ✅ Erlaubt |
| A4 | Aufgaben priorisieren + planen | ✅ Erlaubt |
| A5 | Externe Aktionen ausführen (E-Mail, API) | 🚫 Phase 1 BLOCKIERT |

---

## System-Invarianten (unveränderlich)

```
EMAIL_PROVIDER         = none
OUTREACH_EMAIL_PROVIDER = none
noEmailSent            = true  (DB CHECK CONSTRAINT)
noAutoOutreach         = true  (DB CHECK CONSTRAINT)
noScraping             = true
sendButtonExists       = false
bulkSendExists         = false
autoContactExists      = false
scrapingEnabled        = false
phase                  = 1
currentAutonomyLevel   = A4
```

Diese Werte sind als TypeScript `const` definiert und können nicht zur Laufzeit geändert werden.

---

## Dateistruktur

```
lib/cwo-agent/
├── types.ts              # Gemeinsame Types
├── global-demand.ts      # Korridor-Analyse
├── employer-demand.ts    # Sektor-Bewertung
├── revenue-pragmatist.ts # Revenue-Streams
├── compliance-guard.ts   # Compliance + Invarianten
├── candidate-magnet.ts   # Inbound-Assets
├── inbound-growth.ts     # Wachstumskanäle
├── operations.ts         # Systemstatus + Pilotplan
├── ceo-agent.ts          # Orchestrator
└── index.ts              # Re-Exports

app/admin/
├── cwo-command-center/   # Hauptseite
├── global-demand-radar/  # Korridor-Seite
├── employer-demand-map/  # Sektor-Seite
├── candidate-magnet/     # Inbound-Assets
├── inbound-growth-engine/ # Wachstum
├── revenue-pragmatist/   # Revenue
└── autonomous-worklog/   # Ops + Tagesbericht

supabase/migrations/
└── 202606060300_cwo_operating_system.sql  # 6 neue Tabellen

__tests__/
└── cwo-operating-system.test.ts  # 120+ Tests
```

---

## Was das System automatisch tut

✅ Analysiert 10 globale Talent-Korridore (intern, regelbasiert)  
✅ Priorisiert 10 Arbeitgebersektoren nach 5 Kriterien  
✅ Bewertet 7 Revenue-Streams nach Potenzial und Risiko  
✅ Generiert priorisierte Aufgabenliste (Top-5)  
✅ Erstellt täglichen Systemstatus-Bericht  
✅ Blockiert alle rechtlich riskanten Aktionen automatisch  
✅ Bereitet Inbound-Asset-Plan vor (10 Assets)  
✅ Erstellt Content-Kalender (Wochen 1–4)  
✅ Erstellt SEO-Cluster-Plan (5 Cluster)  

## Was das System NICHT tut

🚫 Kein automatischer E-Mail-Versand  
🚫 Kein Cold-Outreach an fremde Firmen  
🚫 Kein Web-Scraping oder externer API-Call  
🚫 Kein WhatsApp/LinkedIn-Automation  
🚫 Keine Visa-Garantien oder falsche Jobversprechen  
🚫 Keine Kandidatengebühren ohne Rechtsprüfung  
🚫 Keine personenbezogenen Daten ohne DSGVO-Grundlage  

---

## Tests ausführen

```bash
npx vitest run __tests__/cwo-operating-system.test.ts
```
