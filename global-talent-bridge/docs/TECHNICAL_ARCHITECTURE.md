# 🔧 Technical Architecture — CorridorWork

*Sprint: Sell-Ready Buyer Room · 2026-06-08*

> For full historical architecture notes see `docs/ARCHITECTURE.md` and
> `docs/TECHNICAL_ARCHITECTURE_OVERVIEW.md`. This document is the
> buyer-facing technical summary.

---

## Stack Overview

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js (App Router) | TypeScript strict, no `any` types in core |
| Language | TypeScript 5.x | `strict: true` in tsconfig |
| Styling | Tailwind CSS | Utility-first, no CSS-in-JS |
| Database | Supabase (PostgreSQL 17) | EU-Frankfurt, GDPR-compliant |
| Auth | Supabase Auth + SSR | Cookie-based, middleware-protected |
| Deployment | Vercel | Serverless, auto-deploy from GitHub |
| Testing | Vitest | 4 112 tests, 45 files, all green |
| Linting | ESLint (Next.js config) | 0 warnings, 0 errors |
| Build | next build | ✓ Compiled, 161 static pages |

---

## Directory Structure

```
global-talent-bridge/
├── app/                    # Next.js App Router pages
│   ├── _components/        # Shared UI components (NavBar etc.)
│   ├── admin/              # Admin pages (auth-gated)
│   │   ├── buyer-room/     # Sell-ready buyer package
│   │   ├── corridor-intelligence/
│   │   ├── global-growth-department/
│   │   ├── contact-copilot/
│   │   └── ...             # 10+ admin tools
│   ├── global/             # Public intake pages
│   ├── corridors/          # SEO corridor landing pages
│   ├── industries/         # SEO industry pages
│   └── api/                # API routes (admin-protected)
├── lib/                    # Pure TypeScript data/logic layer
│   ├── buyer-room.ts       # Buyer room data (sale readiness, assets)
│   ├── corridor-intelligence.ts  # 8 corridors, scores, monetization
│   ├── global-growth-department.ts  # Growth pipeline logic
│   ├── admin.ts            # Admin auth helper
│   ├── supabase/           # Supabase client factories
│   └── ...
├── __tests__/              # Vitest test files (45 files)
├── docs/                   # 50+ documentation files
├── public/                 # Static assets, robots.txt
├── middleware.ts           # Auth middleware (protects /admin/*)
└── supabase/               # DB migrations
```

---

## Authentication & Authorization

**Two-layer protection for all admin routes:**

1. **Middleware** (`middleware.ts`): checks Supabase session on every request to `/admin/*`. Unauthenticated → HTTP 307 → `/auth/login?redirectTo=...`

2. **Page-level** (`getCurrentAdminUser()`): checks admin email in addition to session. Non-admin authenticated users cannot access admin pages.

**No public admin links** — admin routes are not linked from public pages, not in sitemap, and blocked by robots.txt.

---

## Database Schema (Key Tables)

```sql
-- Growth targets (employers, candidate sources, partners)
growth_targets (
  id uuid PRIMARY KEY,
  created_at timestamptz,
  target_kind text,        -- 'employer' | 'candidate_source' | 'partner'
  company_name text,
  contact_name text,
  contact_email text,
  status text,             -- approval queue status
  corridor text,
  sector text,
  source_market text,
  destination_market text,
  -- ...
)

-- Growth messages (outreach drafts)
growth_messages (
  id uuid PRIMARY KEY,
  created_at timestamptz,
  target_id uuid REFERENCES growth_targets(id),
  channel text,            -- 'email' | 'linkedin' | 'contact_form'
  subject text,
  body text,
  status text,
  no_auto_send boolean NOT NULL DEFAULT true
    CHECK (no_auto_send = true),   -- ← enforced at DB level
  -- ...
)
```

**RLS policies:** All tables have Row Level Security enabled. No public/anon read or write access. Only service role key can bypass.

---

## Compliance Architecture

| Constraint | Implementation |
|---|---|
| No auto-send | DB `CHECK (no_auto_send = true)` on `growth_messages` |
| No scraping | Zero external HTTP calls in lib layer |
| Admin-only data | RLS on all tables |
| GDPR hosting | Supabase EU-Frankfurt only |
| No public admin exposure | robots.txt + sitemap exclusion + noindex meta |

---

## API Routes (Admin-Protected)

| Route | Method | Purpose |
|---|---|---|
| `/api/admin/growth/export` | GET | JSON export of full growth pipeline |
| `/api/admin/growth/targets` | GET/POST | Target CRUD |
| `/api/admin/growth/messages` | GET/POST | Message CRUD |
| `/api/admin/global/corridor-intelligence` | GET | Corridor data API |

All routes verify admin session before returning data.

---

## Build & Test

```bash
npm run lint      # ESLint — 0 warnings, 0 errors
npx tsc --noEmit  # TypeScript — 0 errors
npm run build     # next build — ✓ Compiled, 161 pages
npm test          # Vitest — 4 112/4 112 green
```

---

## Vercel Configuration

- Framework: Next.js (auto-detected)
- Build command: `npm run build`
- Output: serverless functions (LAMBDAS)
- Region: iad1 (US East — Vercel default; buyer can change)
- Auto-deploy: on every push to `feature/global-talent-bridge-mvp-phase-1`
- Production alias: `corridorwork.com`, `www.corridorwork.com`

---

*Related: [`SECURITY_AND_COMPLIANCE.md`](./SECURITY_AND_COMPLIANCE.md) · [`TRANSFER_GUIDE.md`](./TRANSFER_GUIDE.md)*
