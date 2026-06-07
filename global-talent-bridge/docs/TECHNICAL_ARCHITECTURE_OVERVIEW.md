# CorridorWork — Technical Architecture Overview

> Für Käufer, Entwickler und technische Due-Diligence.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 14.x |
| Language | TypeScript | 5.x |
| Database | Supabase (PostgreSQL 17.6) | — |
| Auth | Supabase Auth (JWT + Cookies) | — |
| Hosting | Vercel (Serverless) | — |
| Styling | Tailwind CSS | 3.x |
| Tests | Vitest | 4.x |
| Package Manager | npm | — |

---

## Verzeichnisstruktur

```
app/
├── _components/         # Geteilte UI-Komponenten (PublicFooter, etc.)
├── admin/               # Admin-Seiten (alle auth-geschützt)
│   ├── buyer-readiness/
│   ├── cwo-command-center/
│   ├── distribution-pack/
│   ├── revenue-accelerator/
│   ├── revenue-inbox/
│   └── seo-indexing-control/
├── api/
│   ├── cron/
│   │   └── cwo-daily-runner/   # Vercel Cron (täglich)
│   └── public/
│       └── revenue-leads/      # Public Lead-Capture API
├── auth/                # Login, Register
├── buyer-snapshot/      # Öffentliche Buyer-Seite
├── corridors/           # SEO Korridore-Seiten
├── demo/                # Demo-Seite
├── industries/          # SEO Branchen-Seiten
├── launch/              # Launch-Übersicht
├── legal/               # Impressum, Datenschutz, AGB
├── market-intelligence/ # Revenue Page
├── partners/            # Revenue Page
├── pilot/               # Revenue Pages
├── solutions/           # SEO Solutions-Seiten
└── strategic-partnership/ # Revenue Page (Rang 1)

lib/
├── admin.ts             # getCurrentAdminUser()
├── cwo-agent/           # CWO State, Tageslage, Compliance Guard
├── revenue-leads.ts     # REVENUE_PATHS, Lead-Typen, Score-Berechnung
├── seo-indexing.ts      # SEO Page Entries
└── supabase/
    ├── admin.ts         # createAdminClient() (service_role)
    └── server.ts        # createServerClient() (anon)

supabase/
└── migrations/          # 21 SQL-Migrationen

__tests__/               # 2061 Vitest-Tests
```

---

## Public Pages

| Seite | URL | Typ |
|---|---|---|
| Startseite | / | Marketing |
| Launch-Übersicht | /launch | Revenue |
| Buyer Snapshot | /buyer-snapshot | Buyer |
| Strategic Partnership | /strategic-partnership | Revenue |
| Partner-Programm | /partners | Revenue |
| Employer Pilot | /pilot/employers | Revenue |
| Market Intelligence | /market-intelligence | Revenue |
| Demo | /demo | Demo |
| Über uns | /about | Info |
| Kontakt | /contact | Info |
| Für Kandidaten | /for-candidates | Marketing |
| Für Arbeitgeber | /for-employers | Marketing |
| Impressum | /legal/impressum | Legal |
| Datenschutz | /legal/datenschutz | Legal |
| AGB | /legal/agb | Legal |
| Branchen (5) | /industries/* | SEO |
| Korridore (5+) | /corridors/* | SEO |

---

## Admin-Seiten (alle auth-geschützt via `getCurrentAdminUser()`)

| Seite | URL | Funktion |
|---|---|---|
| Revenue Inbox | /admin/revenue-inbox | Leads prüfen |
| Revenue Accelerator | /admin/revenue-accelerator | Lead-Dashboard |
| Buyer Readiness | /admin/buyer-readiness | Verkaufsbereitschaft |
| CWO Command Center | /admin/cwo-command-center | Systemstatus |
| Distribution Pack | /admin/distribution-pack | Copy-Texte |
| SEO Indexing | /admin/seo-indexing-control | GSC Setup |
| Autonomous Worklog | /admin/autonomous-worklog | Tagesberichte |

---

## API Routes

| Route | Auth | Funktion |
|---|---|---|
| POST /api/public/revenue-leads | Public | Lead-Capture mit Honeypot + Rate-Limit |
| GET /api/cron/cwo-daily-runner | CRON_SECRET | Daily CWO Runner |

---

## Daily Runner (CWO Cron)

- **Trigger:** Vercel Cron, täglich (konfiguriert in `vercel.json`)
- **Auth:** `Authorization: Bearer <CRON_SECRET>`
- **Funktion:** Tageslage generieren, Revenue-Leads zählen, in `autonomous_worklog` schreiben
- **Safety:** Kein E-Mail-Versand, kein Scraping, keine externen API-Calls
- **Response:** JSON mit Systemstatus, Lead-Counts, Safety-Bestätigung

---

## Lead-Capture System

- **Endpoint:** `POST /api/public/revenue-leads`
- **Schutz:** Honeypot-Feld (`website`), Rate-Limit (10/h/IP), Duplicate-Limit (5/E-Mail)
- **Typen:** `employer_pilot`, `agency_partner`, `market_intelligence`, `strategic_partner`
- **Scoring:** automatisch berechnet (0–100), strategic_partner hat höchsten Score
- **Safety-Flags:** `no_email_sent=true`, `no_auto_outreach=true`, `no_payment_started=true` in DB

---

## CWO Agent System

```
lib/cwo-agent/
├── index.ts              # generateCWOState()
├── ceo-agent.ts          # generateTageslageSummary()
├── compliance-guard.ts   # validateInvariants(), SYSTEM_INVARIANTS
└── ...
```

Das CWO-System ist ein rein internes, funktionales System ohne externe Calls.

---

## Datenbank (Supabase)

- **Region:** eu-central-1 (Frankfurt, DSGVO)
- **RLS:** Aktiv auf allen Tabellen
- **Key Tables:** `revenue_leads`, `autonomous_worklog`, `landingpage_factory`
- **Migrationen:** 21 SQL-Dateien in `supabase/migrations/`

---

## Tests

- **Framework:** Vitest 4.x
- **Stand:** 2061 Tests, alle bestanden
- **Coverage:** Revenue Leads, Safety Invariants, CWO System, SEO, Admin-Logik

```bash
npm test          # alle Tests
npx vitest run    # CI-Modus
```

---

## Deployment

```bash
npm install
cp .env.example .env.local
# .env.local ausfüllen
npm run dev       # lokal
vercel deploy     # Vercel
```

---

*Erstellt: 2026-06-07 | Phase 1 Transfer Pack*
