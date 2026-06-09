# Technical Architecture — CorridorWork Buyer Package

*Zero-Cost Buyer Package Sprint · 2026-06-09*

---

## Stack overview

```
┌─────────────────────────────────────────────────────────┐
│                    corridorwork.com                      │
│                  (Vercel — serverless)                   │
├─────────────────────────────────────────────────────────┤
│             Next.js 14 App Router                        │
│             TypeScript strict                            │
│             Tailwind CSS                                 │
├──────────────────────────┬──────────────────────────────┤
│   Public routes          │   Admin routes (auth-gated)  │
│   /for-employers         │   /admin/corridor-intelligence│
│   /for-candidates        │   /admin/buyer-room          │
│   /partners              │   /admin/global-growth-dept  │
│   /demo                  │   /admin/contact-copilot     │
│   /corridors/*           │   /admin/market-proof-launch │
│   25+ SEO pages          │   10+ admin tools            │
├──────────────────────────┴──────────────────────────────┤
│              Supabase (EU-Frankfurt)                     │
│              PostgreSQL 17 · RLS active                  │
│              no_auto_send CHECK constraint               │
└─────────────────────────────────────────────────────────┘
```

---

## Framework

| Property | Value |
|---|---|
| Framework | Next.js App Router (v14) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| Package manager | npm |
| Node version | 18+ |
| Deployment | Vercel (serverless functions) |
| Auto-deploy | GitHub → Vercel (on push) |

---

## Rendering strategy

| Route type | Strategy |
|---|---|
| Public SEO pages | Static (SSG) — pre-rendered |
| Admin pages | Dynamic — `export const dynamic = 'force-dynamic'` |
| API routes | Server-side (Vercel Edge / Node runtime) |
| Auth-gated admin | `getCurrentAdminUser()` + `redirect()` |

---

## Authentication

- Custom auth via Supabase Auth
- `getCurrentAdminUser()` server function reads session cookies
- All `/admin/*` routes: redirect to `/auth/login` if unauthenticated (HTTP 307)
- Admin email configured via `ADMIN_EMAIL` environment variable
- `noindex, nofollow` metadata on all admin pages
- Zero admin URLs in `/sitemap.xml`
- `Disallow: /admin/` in `/robots.txt`

---

## Database (Supabase)

| Property | Value |
|---|---|
| Engine | PostgreSQL 17 |
| Region | EU-Frankfurt (eu-central-1) |
| GDPR jurisdiction | Yes — EU data residency |
| RLS | Active on all tables |
| Key constraint | `no_auto_send CHECK(no_auto_send = TRUE)` |
| Transfer | Via Supabase Settings → Transfer Project |

### Key tables

| Table | Purpose |
|---|---|
| `growth_targets` | Outreach targets for global growth pipeline |
| `growth_messages` | Messages in approval queue |
| `employer_applications` | Employer intake submissions |
| `candidate_interests` | Candidate interest submissions |
| `partner_applications` | Partner intake (4 tracks) |

### RLS policy principle

No anonymous access to any table. All data access requires authenticated session via Supabase service role key (server-side only). The anon key never accesses production data.

---

## API routes

All API routes are under `/api/`. Key routes:

| Route | Purpose |
|---|---|
| `/api/admin/growth/export` | Export full pipeline JSON (auth-gated) |
| `/api/admin/growth/targets` | CRUD for growth targets |
| `/api/admin/growth/messages` | CRUD for growth messages |

No public API routes expose admin or pipeline data.

---

## Environment variables

All documented in `.env.example`:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only admin key |
| `ADMIN_EMAIL` | Email for admin access |

---

## Code quality

| Metric | Value |
|---|---|
| Tests | 4 352 passing · 48 files · 0 failures |
| TypeScript errors | 0 (`tsc --noEmit`) |
| ESLint | 0 warnings · 0 errors |
| Build | Clean (163 pages) |

---

## What a developer buyer can do immediately

```bash
git clone <repo>
npm install
cp .env.example .env.local   # fill in Supabase + ADMIN_EMAIL
npm run dev                   # localhost:3000
npm test                      # 4 352 tests green
npx tsc --noEmit              # 0 errors
npm run build                 # clean, 163 pages
```

---

*Part of the CorridorWork Buyer Package. See also: [`security-rls-overview.md`](./security-rls-overview.md) · [`deployment-transfer-checklist.md`](./deployment-transfer-checklist.md)*
