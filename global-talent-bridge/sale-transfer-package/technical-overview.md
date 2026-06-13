# CorridorWork — Technical Overview

**For Buyers and Technical Due Diligence**  
**Commit:** 351df82 — Sale-Ready

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 14.x |
| Language | TypeScript | 5.x (strict mode) |
| Styling | Tailwind CSS | 3.x |
| Database | Supabase (PostgreSQL 17.6) | — |
| Auth | Supabase Auth (JWT + cookies) | — |
| Hosting | Vercel (Serverless + Edge Middleware) | — |
| Testing | Vitest | 4.x |
| Cron | Vercel Cron Jobs | — |

**Result:** 167 built pages, 4596 tests passing, 0 lint errors.

---

## Architecture

```
Public request
  → Vercel CDN / Edge
    → Next.js App Router (Server Components default)
      → Supabase (PostgreSQL, Auth, Storage)
```

- **Server Components** used by default throughout.
- **Client Components** only where interactivity is required (form state, mobile nav).
- **Middleware** (`middleware.ts`) protects `/admin`, `/candidate`, `/employer` routes — requires valid Supabase Auth session.
- **Admin area** additionally checks `ADMIN_EMAILS` env variable server-side per page.

---

## Key Directory Structure

```
/
├── app/                        # Next.js App Router pages and layouts
│   ├── page.tsx                # Homepage /
│   ├── layout.tsx              # Root layout (fonts, metadata)
│   ├── _components/            # Shared UI components (PublicNavBar, PublicFooter, etc.)
│   ├── global/
│   │   ├── employers/          # /global/employers — intake form
│   │   └── candidates/         # /global/candidates — interest form
│   ├── partners/               # /partners
│   ├── strategic-partnership/  # /strategic-partnership
│   ├── demo/
│   │   └── sandbox/            # /demo/sandbox — platform demo
│   ├── admin/                  # Protected admin dashboard
│   ├── auth/                   # Login / register
│   ├── pilot/                  # /pilot/employers, /pilot/agencies
│   ├── buyer-snapshot/         # /buyer-snapshot
│   ├── for-buyers/             # /for-buyers
│   ├── corridors/              # SEO corridor pages
│   ├── industries/             # SEO industry pages
│   ├── legal/                  # /legal/datenschutz, /legal/impressum, /legal/agb
│   ├── sitemap.ts              # Sitemap (dynamic)
│   └── actions.ts              # Server Actions (form handling)
│
├── lib/                        # Business logic, utilities, DB clients
│   ├── supabase/
│   │   ├── client.ts           # Supabase browser client
│   │   ├── server.ts           # Supabase server client
│   │   └── admin.ts            # Supabase admin client (service role, server-only)
│   ├── talent-categories.ts    # 21-sector taxonomy (static)
│   ├── seo-pages.ts            # SEO page configs (corridors, industries)
│   ├── revenue-leads.ts        # Lead capture logic (no email, no payment)
│   └── cwo-agent/              # CWO Daily Runner logic
│
├── __tests__/                  # Vitest test suite (52 files, 4596 tests)
├── middleware.ts               # Route protection (auth guard)
├── next.config.js              # Redirects (legal aliases, etc.)
├── public/                     # Static assets (images, robots.txt, og-image)
├── docs/                       # Buyer documentation (77+ files)
├── sale-transfer-package/      # This directory
├── .env.example                # ENV variable names (no values)
└── vercel.json                 # Vercel build config + cron schedule
```

---

## Public Routes

| Route | Type | Description |
|---|---|---|
| `/` | Marketing | Homepage |
| `/global/employers` | Intake | Employer demand form |
| `/global/candidates` | Intake | Candidate interest form |
| `/partners` | Lead | Agency partner form |
| `/strategic-partnership` | Lead | Strategic partner form |
| `/pilot/employers` | Lead | Employer pilot intake |
| `/pilot/agencies` | Lead | Agency pilot intake |
| `/market-intelligence` | Lead | Market intelligence lead |
| `/for-employers` | Marketing | Employer marketing page |
| `/for-candidates` | Marketing | Candidate marketing page |
| `/for-buyers` | Acquisition | Buyer-facing acquisition page |
| `/buyer-snapshot` | Acquisition | Platform snapshot for buyers |
| `/demo/sandbox` | Demo | Platform capabilities (synthetic data) |
| `/demo` | Redirect | → `/demo/sandbox` (permanent) |
| `/pricing` | Marketing | Pricing page |
| `/about` | Marketing | About page |
| `/contact` | Lead | Contact form |
| `/launch` | Revenue | Launch overview |
| `/corridors/*` | SEO | 15+ corridor pages |
| `/industries/*` | SEO | 5 industry pages |
| `/solutions/*` | SEO | Solutions pages |
| `/legal/datenschutz` | Legal | Privacy Policy (German) |
| `/legal/impressum` | Legal | Legal Notice / Imprint |
| `/legal/agb` | Legal | Terms of Service |
| `/legal/privacy` | Redirect | → `/legal/datenschutz` |
| `/legal/notice` | Redirect | → `/legal/impressum` |
| `/legal/terms` | Redirect | → `/legal/agb` |
| `/sitemap.xml` | SEO | Sitemap |
| `/robots.txt` | SEO | Robots file |

---

## Protected Routes (Auth Required)

| Route | Auth Level |
|---|---|
| `/admin/*` | Login + `ADMIN_EMAILS` check |
| `/candidate/*` | Login + candidate role |
| `/employer/*` | Login + employer role |
| `/auth/login` | Public (login form) |
| `/auth/register` | Public (registration form) |

---

## Environment Variables (Names Only — No Values)

Buyer must supply their own values. All variables documented in `.env.example`.

| Variable | Used For | Required |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (public) | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (public) | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side admin operations | ✅ |
| `NEXT_PUBLIC_BASE_URL` | Canonical URL for OG/meta | ✅ |
| `CRON_SECRET` | Vercel cron job auth header | ✅ |
| `ADMIN_EMAILS` | Comma-separated admin email(s) | ✅ |
| `EMAIL_PROVIDER` | `none` / `resend` — default `none` | Optional |
| `OUTREACH_EMAIL_PROVIDER` | `none` / `resend` — default `none` | Optional |
| `RESEND_API_KEY` | Only if using Resend email | Optional |

---

## Database

- **Provider:** Supabase (PostgreSQL 17.6)
- **Region recommended:** EU (e.g. eu-central-1, Frankfurt) for GDPR
- **Auth:** Supabase Auth (email/password + JWT cookies)
- **RLS:** Row Level Security configured on candidate/employer tables
- **Migrations:** Available in `supabase/` directory
- **Admin client:** `lib/supabase/admin.ts` — uses `SUPABASE_SERVICE_ROLE_KEY`, never exposed to client

---

## Cron Job

- **Path:** `/api/cron/cwo-daily-runner`
- **Schedule:** Daily at 06:00 UTC (`0 6 * * *`)
- **Purpose:** CWO Daily Runner — operational status, lead aggregation
- **Auth:** `Authorization: Bearer <CRON_SECRET>` header
- **Configured in:** `vercel.json`

---

## Safety Invariants (Code-Level)

These are enforced in `lib/revenue-leads.ts` and tested in 52 test files:

```
EMAIL_PROVIDER=none           → No transactional email possible
OUTREACH_EMAIL_PROVIDER=none  → No outreach email possible
Stripe                        → Not configured anywhere
Scraping                      → Blocked (compliance guard)
Cold outreach                 → Blocked (compliance guard)
Candidate fees                → Not activated
```

---

## Performance & Scale Notes

- All public pages are Server Components (fast TTFB)
- Static pages pre-rendered at build time (167 pages)
- Dynamic pages (admin, intake forms) server-rendered on demand
- No client-side data fetching on public pages
- Tailwind CSS — no large CSS bundles
- Images: Next.js `<Image>` with optimisation
- First Load JS shared: ~87 KB

---

*No API keys, secrets, passwords or real values are included in this document.*
