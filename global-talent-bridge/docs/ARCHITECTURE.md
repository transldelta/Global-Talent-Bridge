# Architektur — Global Talent Bridge

**Stand:** 2026-06-04  
**Zweck:** Technische Architektur für Entwickler, Käufer und technische Prüfer.

---

## Stack-Übersicht

```
┌────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                │
│  Next.js 14 App Router · TypeScript · Tailwind CSS            │
│  Server Components (default) · Client Components ('use client')│
└────────────────────────────────┬───────────────────────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
    ┌─────────────────┐ ┌──────────────┐ ┌─────────────────┐
    │  Supabase       │ │  lib/agents/ │ │  lib/revenue/   │
    │  (DB + Auth)    │ │  (Agent Layer│ │  (Forecast)     │
    │  PostgreSQL+RLS │ │  server-only)│ │                 │
    └─────────────────┘ └──────────────┘ └─────────────────┘
              │
    ┌─────────────────┐
    │  Vercel         │
    │  (CDN + Deploy) │
    └─────────────────┘
```

---

## Layer-Beschreibungen

### 1. Frontend Layer — `app/`

**Prinzip:** Server Components by default. Client Components nur für Interaktivität.

```
app/
├── (public)/               # Öffentliche Seiten (marketing, legal, jobs)
│   ├── page.tsx            # Landing/Home
│   ├── jobs/               # Job-Listings (public)
│   ├── corridors/[slug]/   # SEO-Landingpages (public)
│   ├── for-candidates/
│   ├── for-employers/
│   ├── pricing/
│   └── legal/              # AGB, Datenschutz, Impressum
├── auth/                   # Login, Register
├── candidate/              # Kandidaten-Dashboard (auth required)
├── employer/               # Arbeitgeber-Dashboard (auth required)
└── admin/                  # Admin-Dashboard (admin email required)
    ├── ceo-dashboard/
    ├── global/             # Korridore, CI, GCA, LPF, MI
    ├── revenue/
    ├── sale-readiness/
    ├── export-readiness/
    ├── leads/
    ├── outreach/
    ├── pilot-kit/
    └── system-check/
```

**Schutz:**
- Middleware (`middleware.ts`) prüft Auth für alle geschützten Routen.
- `getCurrentAdminUser()` prüft ADMIN_EMAILS für Admin-Routen.

---

### 2. API Layer — `app/api/`

```
app/api/
├── admin/
│   ├── agents/             # Agent-Orchestrator-Steuerung
│   ├── global/             # Domain-spezifische Agenten
│   │   ├── corridor-intelligence/
│   │   ├── candidate-acquisition/
│   │   ├── landingpage-factory/
│   │   └── migration-intelligence/
│   ├── revenue/            # Revenue Intelligence
│   ├── growth-agent/
│   ├── gmi-agent/
│   ├── recalculate-metrics/
│   ├── system-check/
│   └── notifications/
├── employer/               # Arbeitgeber-Aktionen
├── matches/                # Matching-Trigger
└── actions.ts              # Server Actions (Logout, etc.)
```

Alle Admin-Routen: `import { getCurrentAdminUser } from '@/lib/admin'` → `if (!admin) return 401`.

---

### 3. Supabase Layer

```
lib/supabase/
├── admin.ts        # createAdminClient() — service_role, server-only
├── server.ts       # createClient() — per-request, respects RLS
└── client.ts       # createBrowserClient() — client-side, RLS enforced
```

**Regel:** Schreibende Admin-Operationen immer via `createAdminClient()`.  
Niemals service_role KEY clientseitig exponieren.

```
supabase/
└── migrations/
    ├── 202606040001_...sql   # Kerntabellen
    ├── 202606040002_...sql   # Agenten-Support-Tabellen
    ├── ...
    └── 202606040020_revenue_intelligence.sql
```

---

### 4. Agent Layer — `lib/agents/`

Jeder Agent ist ein eigenständiges TypeScript-Modul:

```typescript
// Muster für jeden Agenten
import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'

export async function runXxxAgent(): Promise<{ suggestionsCreated: number; ... }> {
  const supabase = createAdminClient()
  // 1. Daten laden
  // 2. Analysieren/Berechnen
  // 3. agent_suggestions + agent_notifications schreiben
  // 4. system_logs schreiben
  return { ... }
}
```

**Neuen Agenten ergänzen:**

1. Neue Datei: `lib/agents/my-new-agent.ts` (Muster oben)
2. Agent in `agent-orchestrator.ts` importieren und aufrufen:
   ```typescript
   import { runMyNewAgent } from './my-new-agent'
   // in runAllAgents():
   const result = await runMyNewAgent()
   details.myNewAgent = result
   totalSuggestions += result.suggestionsCreated
   ```
3. Details-Typ in `AgentRunResult` ergänzen
4. Admin-Trigger: neue `run-agent` API-Route + Button-Komponente
5. CEO-Dashboard-Sektion ergänzen

**Alle Agenten:** Server-only, kein Browser-Code, kein externer API-Call, kein Versand.

---

### 5. Dashboard Layer — `app/admin/`

**CEO Dashboard** (`/admin/ceo-dashboard`):
- Aggregiert alle KPIs aus allen Modulen in einem Promise.all()-Call
- Zeigt: Leads, Korridore, CI, GCA, LPF, MI, Revenue, Due Diligence
- Alle Daten: server-seitig gerendert, kein Client-State

**Sale Readiness** (`/admin/sale-readiness`):
- Statische Checkliste + Live-Datenbankzähler
- Dokumentationsstatus-Übersicht

**Export Readiness** (`/admin/export-readiness`):
- Ampelsystem für alle Module
- Kein echter Export — nur Status-Anzeige

---

### 6. Landingpage Layer — `app/corridors/`

```
app/corridors/
└── [slug]/
    └── page.tsx    # Dynamische SEO-Landingpage
```

**Datenfluss:**
```
landingpage_factory (slug, title, seo_title, seo_description)
    └── migration_corridors (scores)
        └── corridor_intelligence (professions, language, visa)
            └── migration_intelligence (complexity, next steps)
```

**SEO:**
- `generateMetadata()` für dynamische `<title>`, `<meta description>`, OG-Tags
- `app/sitemap.ts` — dynamisch, queries published/approved Landingpages
- `public/robots.txt` — `/corridors/` freigegeben

---

### 7. Revenue Layer — `lib/revenue/`

```
lib/revenue/
└── forecast.ts     # computeScenario(), computeScenarios(), MONTHLY_OPEX_EUR
```

Geteilte Logik zwischen Admin-Seite und Agent:
```
revenue-intelligence-agent.ts  ─┐
                                 ├─► lib/revenue/forecast.ts
app/admin/revenue/page.tsx      ─┘
app/admin/ceo-dashboard/page.tsx
```

---

## Deployment

```
git push origin main
    │
    ▼
Vercel (Auto-Deploy)
    │
    ├── next build (SSG + SSR)
    ├── Edge Middleware (Auth-Schutz)
    └── Serverless Functions (API-Routen)
```

**Environment Variables (Vercel + lokal `.env.local`):**

| Variable | Beschreibung |
|---------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Projekt-URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon-Key (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service-Role-Key (server-only) |
| `ADMIN_EMAILS` | Comma-separated Admin-E-Mail-Adressen |

---

## Skalierungshinweise

| Szenario | Empfehlung |
|---------|------------|
| >10.000 Kandidaten | Supabase Read Replicas |
| Agenten dauern >30s | Supabase Edge Functions oder Background Jobs |
| >100.000 Seitenaufrufe/Monat | Vercel Pro (automatisch skaliert) |
| Emails nötig | PostHog / Resend / SendGrid ergänzen |
| Stripe Live | `lib/stripe/` anlegen, Webhook-Handler in `app/api/stripe/` |

---

*Stand: 2026-06-04. Für aktuelle Migration-Status: `supabase/migrations/`.*
