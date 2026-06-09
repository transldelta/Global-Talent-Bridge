# What the Buyer Gets — CorridorWork Buyer Package

*Zero-Cost Buyer Package Sprint · 2026-06-09*

---

## Four primary transferable assets

| Asset | Transfer | Notes |
|---|---|---|
| Domain — corridorwork.com | Registrar EPP code transfer | 1–48 hours |
| GitHub repository | GitHub Settings → Transfer | Full history, all branches |
| Vercel project | Vercel Settings → Transfer | All deployments, env vars |
| Supabase project | Supabase Settings → Transfer | Full DB, all RLS policies |

All four are independently transferable. No single point of failure.

---

## Public-facing product

| Page / Feature | Status | Notes |
|---|---|---|
| corridorwork.com homepage | ✅ Live | Indexed, HTTPS |
| Employer intake form | ✅ Live | → Supabase with audit trail |
| Candidate interest form | ✅ Live | Voluntary, consent-based, free |
| Partner intake (4 tracks) | ✅ Live | Agency, relocation, language school, strategic |
| Demo page | ✅ Live | /demo + /demo/sandbox |
| Strategic partnership page | ✅ Live | /strategic-partnership |
| Pilot landing pages | ✅ Live | /pilot |
| For-candidates page | ✅ Live | /for-candidates |
| For-employers page | ✅ Live | /for-employers |
| Pricing page | ✅ Live | /pricing |
| 25+ SEO corridor/industry/solution pages | ✅ Live | Indexed |

---

## Admin toolset (auth-gated, 10+ tools)

Every admin tool is protected by auth, noindex/nofollow, and absent from sitemap.

| Tool | Route | Function |
|---|---|---|
| Corridor Intelligence | `/admin/corridor-intelligence` | 8 corridors, Buyer Opportunity Scores, Demo Cards |
| Global Growth Department | `/admin/global-growth-department` | Supabase pipeline, Batch Planner, Approval Queue |
| Contact Copilot | `/admin/contact-copilot` | Gmail draft links, form autofill — no auto-send |
| Buyer Room | `/admin/buyer-room` | Sale readiness score, transfer checklist, due diligence |
| Market Proof Launch | `/admin/market-proof-launch` | 3 campaigns, 45 targets, reply tracker, proof export |
| CEO Dashboard | `/admin/ceo-dashboard` | Strategic overview |
| Buyer Readiness | `/admin/buyer-readiness` | Transferability audit |
| Exit Readiness | `/admin/exit-readiness` | Acquisition checklist |
| Sale Readiness | `/admin/sale-readiness` | 6-dimension sale readiness score |

---

## Database (Supabase)

- PostgreSQL 17
- EU-Frankfurt (eu-central-1) — GDPR jurisdiction
- Row Level Security (RLS) active on **all** tables
- `no_auto_send` CHECK constraint — enforces no automated outreach at DB level
- Tables: `growth_targets`, `growth_messages`, `employer_applications`, `partner_applications`, `candidate_interests`, and more
- Full schema transferable with project

---

## Code quality metrics

| Metric | Value |
|---|---|
| Vitest tests | **4 352 passing · 48 files · 0 failures** |
| TypeScript errors | **0** (`tsc --noEmit`) |
| ESLint warnings/errors | **0** |
| Next.js build | **Clean** (163 pages) |
| TypeScript mode | Strict |

---

## Documentation

50+ markdown documents covering:
- Technical architecture
- Security and RLS
- Transfer guide (10 steps)
- Asset inventory
- Buyer demo script
- Valuation argument
- Monetization map
- Business model
- Operating costs
- Global expansion strategy
- And more

---

## What is NOT included / NOT active

| Item | Status | Notes |
|---|---|---|
| Revenue | ❌ None | €0 MRR |
| Paying customers | ❌ None | 0 at time of listing |
| Stripe | ❌ Not connected | Architecture supports it; buyer activates |
| Automated outreach | ❌ Not active (by design) | DB constraint + manual-only workflow |
| Scraping | ❌ Not present | All data manually curated |
| Job guarantee | ❌ Not promised | Explicitly disclaimed |
| Visa guarantee | ❌ Not promised | Explicitly disclaimed |

---

*Part of the CorridorWork Buyer Package. See also: [`executive-summary.md`](./executive-summary.md) · [`technical-architecture.md`](./technical-architecture.md) · [`handover-checklist.md`](./handover-checklist.md)*
