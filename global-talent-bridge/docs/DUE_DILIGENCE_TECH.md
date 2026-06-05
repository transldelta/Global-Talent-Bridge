# Technical Due Diligence Report — CorridorWork

**Dokumenttyp:** Technische Due-Diligence  
**Stand:** 2026-06-04  
**Zweck:** Ermöglicht Käufern, Investoren und technischen Prüfern eine strukturierte Bewertung der Plattform.  

---

## 1. Architekturübersicht

### Stack

| Schicht | Technologie | Begründung |
|---------|-------------|------------|
| Frontend | Next.js 14 (App Router) | Server-Components, SEO-fähig, typsicher |
| Styling | Tailwind CSS | Kein Custom-CSS nötig, konsistentes Design-System |
| Backend (BaaS) | Supabase (PostgreSQL + Auth + RLS) | Managed, EU-Hosting, keine eigene DB-Verwaltung nötig |
| Hosting | Vercel | Automatisches Deployment, Edge-Functions, CDN |
| Sprache | TypeScript (strict) | Vollständige Typsicherheit, keine impliziten `any` |
| Agenten | Server-only TypeScript Module | Kein Framework-Lock, direkt testbar |

### Infrastrukturdiagramm (vereinfacht)

```
Browser / Suchmaschine
    │
    ▼
Vercel CDN / Edge
    │
    ▼
Next.js App Router (Server Components)
    │           │
    ▼           ▼
Supabase    lib/agents/
(DB, Auth)  (Pure TS, server-only)
    │
    ▼
PostgreSQL (EU: eu-central-1)
```

---

## 2. Datenbankstruktur

### Kerntabellen (10 Migrationen)

| Tabelle | Beschreibung | RLS |
|---------|-------------|-----|
| `profiles` | Nutzerprofile (Kandidat / Arbeitgeber) | ✅ |
| `employers` | Arbeitgeberprofile | ✅ |
| `candidates` | Kandidatenprofile | ✅ |
| `jobs` | Stellenanzeigen | ✅ |
| `applications` | Bewerbungen | ✅ |
| `matches` | KI-Matching-Ergebnisse | ✅ |
| `migration_corridors` | Migrationskorridor-Stammdaten | ✅ |
| `corridor_intelligence` | KI-Analyse pro Korridor | ✅ |
| `candidate_acquisition_sources` | Kandidatenquellen | ✅ |
| `landingpage_factory` | Generierte Karriere-Landingpages | ✅ |
| `migration_intelligence` | Visa/Anerkennungs-Komplexität pro Korridor | ✅ |
| `revenue_plans` | Monetarisierungspläne | ✅ |
| `revenue_events` | Forecast-Events | ✅ |
| `agent_suggestions` | CEO-Vorschläge von Agenten | ✅ |
| `agent_notifications` | Benachrichtigungen von Agenten | ✅ |
| `agent_run_logs` | Agenten-Lauf-Protokolle | ✅ |
| `system_logs` | Systemweites Logging | ✅ |
| `business_metrics` | Gespeicherte KPIs | ✅ |
| `pricing_plans` | Öffentliche Preispläne | ✅ |
| `outreach_contacts` | Sales-Kontakte | ✅ |

**Gesamt:** 20+ Tabellen, alle mit RLS geschützt.  
**Backup:** Supabase Daily Backups (managed).  
**Region:** eu-central-1 (Frankfurt).

---

## 3. Agenten-System

10 eigenständige Server-Only TypeScript-Agenten:

| Agent | Datei | Aufgabe |
|-------|-------|---------|
| CEO Agent | `ceo-agent.ts` | Metaanalyse, Gesamtkoordination |
| Marketing Strategy Agent | `marketing-strategy-agent.ts` | Kampagnenanalyse |
| Visionary Agent | `visionary-agent.ts` | Strategische Vorschläge |
| Growth Agent | `growth-agent.ts` | Lead-Analyse, Approval Queue |
| Global Market Intelligence | `global-market-intelligence-agent.ts` | Korridor-Scoring |
| Corridor Intelligence | `corridor-intelligence-agent.ts` | Korridoranalyse, Sprachanforderungen |
| Global Candidate Acquisition | `global-candidate-acquisition-agent.ts` | Kandidatenquellen-Scoring |
| Landingpage Factory | `landingpage-factory-agent.ts` | SEO-Landingpage-Generierung |
| Migration Intelligence | `migration-intelligence-agent.ts` | Visa/Anerkennungs-Scoring |
| Revenue Intelligence | `revenue-intelligence-agent.ts` | Forecast-Simulation, Revenue-Analyse |

**Orchestrator:** `agent-orchestrator.ts` führt alle Agenten sequenziell aus.  
**Alle Agenten:** Schreiben in `system_logs`. Erstellen `agent_suggestions` und `agent_notifications`.  
**Kein Agent:** sendet E-Mails, WhatsApp, Zahlungen, oder ruft externe APIs auf.

---

## 4. API-Routen

24 Admin-only API-Routen:

| Kategorie | Anzahl Routen |
|-----------|--------------|
| Agent-Steuerung | 6 |
| Datenabfragen (GET) | 10 |
| Agenten-Trigger (POST) | 8 |

Alle Admin-Routen sind durch `getCurrentAdminUser()` geschützt.  
Keine öffentlichen schreibenden API-Routen.

---

## 5. RLS-Konzept (Row Level Security)

- **Alle Tabellen** haben RLS aktiviert.
- **service_role** (Server/Admin): Vollzugriff, nur serverseitig.
- **anon/authenticated**: Lesen nur bei explizit genehmigten Datensätzen (z.B. `published` Landingpages).
- **Admin-Operationen**: Ausschließlich via `createAdminClient()` (service_role KEY), nie clientseitig exponiert.

```typescript
// Muster für Admin-Operationen
const supabase = createAdminClient()  // uses SERVICE_ROLE_KEY — server-only
```

---

## 6. Authentifizierungs- und Admin-Konzept

### User Auth
- Supabase Auth (Email + Password)
- JWT-basiert, Cookie-gestützt
- Middleware-Schutz für alle `/admin/*`, `/employer/*`, `/candidate/*` Routen

### Admin-Zugang
```typescript
// lib/admin.ts
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '').split(',')
export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.trim().toLowerCase())
}
```

- Admin-E-Mails werden ausschließlich über Umgebungsvariable konfiguriert.
- Kein Datenbank-Flag für Admin-Status (Sicherheitsprinzip: kein Privilege Escalation durch DB-Manipulation).

---

## 7. DSGVO-Konzept

| Maßnahme | Status |
|---------|--------|
| Keine Drittanbieter-Tracker auf Landingpages | ✅ |
| Keine Cookies außer Auth-Session | ✅ |
| Kandidatendaten nur für autorisierte Arbeitgeber sichtbar (nach Freigabe) | ✅ |
| Kein automatischer E-Mail-Versand ohne Admin-Freigabe | ✅ |
| Daten in EU (Frankfurt) | ✅ |
| Datenlöschung: Supabase-Kaskaden via ON DELETE CASCADE | ✅ |
| Impressum, Datenschutz, AGB vorhanden | ✅ |
| Kein Profiling ohne Einwilligung | ✅ |

---

## 8. Landingpage-System

- 7+ SEO-Landingpages für internationale Karriere-Korridore
- Mehrsprachig: EN, DE, FR, TR, PT, AR
- Dynamisch über `/corridors/[slug]`
- `generateMetadata()` für vollständige SEO-Meta-Tags
- Sitemap (`/sitemap.xml`) dynamisch aus DB generiert
- `robots.txt`: `/corridors/` für Suchmaschinen freigegeben
- Status-Workflow: `draft → ready_for_review → approved → published`
- Kein automatisches Publishing — immer manuelle Admin-Freigabe

---

## 9. Revenue-System

- **revenue_plans**: 7 aktive Pläne (Employer, Kandidat, Partner)
- **revenue_events**: Forecast-Events (Simulationen, keine echten Transaktionen)
- **Kein Stripe**: Zahlungsverarbeitung noch nicht implementiert — vorbereitet
- **Forecast Engine**: `lib/revenue/forecast.ts` — mathematisch, deterministisch, geteilte Logic

---

## 10. Migration Intelligence

- 8 Korridore mit Visa-, Anerkennungs-, Sprach- und Dokumentenkomplexität bewertet
- Score-Formel deterministisch und dokumentiert
- JSONB-Felder für: `required_documents`, `language_requirements`, `recognition_steps`, `visa_pathways`, `recommended_next_steps`
- Öffentlich nur sichtbar wenn status = `reviewed` oder `approved`
- Klarer Disclaimer: keine Rechtsberatung, keine Garantien

---

## 11. Testabdeckung

| Bereich | Status |
|---------|--------|
| Unit Tests | ❌ noch nicht implementiert |
| Integration Tests | ❌ noch nicht implementiert |
| E2E Tests | ❌ noch nicht implementiert |
| Lint (ESLint) | ✅ 0 Fehler |
| TypeScript-Compiler | ✅ 0 Fehler |
| Build (next build) | ✅ erfolgreich |

**Empfehlung:** Unit-Tests für Agenten-Score-Formeln, Integration-Tests für kritische API-Routen.

---

## 12. Offene technische Schulden

| Punkt | Priorität | Beschreibung |
|-------|-----------|-------------|
| Keine automatisierten Tests | Mittel | Lint + Build reichen für frühe Phase |
| Stripe-Integration | Niedrig | Architektur vorbereitet, noch nicht implementiert |
| Email-Versand (Postmark/SendGrid) | Niedrig | Nur mit Admin-Freigabe geplant |
| Skalierung Agent-Laufzeiten | Niedrig | Bei >1.000 Datensätzen ggf. Queue nötig |
| Monitoring/Alerting | Niedrig | Vercel Analytics vorhanden, kein externes APM |

---

*Dieses Dokument ist Stand 2026-06-04 und spiegelt den aktuellen Entwicklungsstand wider.*
