# 📦 Asset Inventory — CorridorWork

*Sprint: Sell-Ready Buyer Room · 2026-06-08*

> Complete inventory of all assets included in a CorridorWork acquisition.

---

## Infrastructure Assets

| Asset | Details | Transfer method | Status |
|---|---|---|---|
| Domain — corridorwork.com | Live, indexed by Google, active HTTPS | Registrar transfer / DNS change | ✅ Ready |
| GitHub Repository | Full git history, TypeScript codebase | Settings → Transfer | ✅ Ready |
| Vercel Project | Production deployment, auto-deploy | Settings → Transfer | ✅ Ready |
| Supabase Project | PostgreSQL 17, EU-Frankfurt, RLS | Settings → Transfer | ✅ Ready |

---

## Product Assets

### Public Website (corridorwork.com)

| Page | Purpose |
|---|---|
| Homepage | Positioning, three-sided market intro |
| `/for-employers` | Employer value proposition |
| `/for-candidates` | Candidate interest page |
| `/partners` | Partner intake (4 tracks) |
| `/strategic-partnership` | Strategic partner engagement |
| `/demo` + `/demo/sandbox` | Buyer-facing demonstration |
| `/pilot/employers` | Employer pilot landing |
| `/pilot/agencies` | Agency pilot landing |
| `/market-intelligence` | Market intelligence page |
| `/launch` | Product launch page |
| `/buyer-snapshot` | Buyer overview page |
| `/pricing` | Pricing page (not commercially active) |

### SEO Pages (25+ indexed)

- 11 corridor landing pages (`/corridors/*`)
- 5 industry landing pages (`/industries/*`)
- 1 solutions page (`/solutions/recruiting-agencies`)
- Legal pages (Impressum, Datenschutz, AGB)
- Auth pages (/auth/login, /auth/register)

---

## Admin System Assets

| Tool | Route | Function |
|---|---|---|
| Corridor Intelligence | `/admin/corridor-intelligence` | 8 corridors, Buyer Opportunity Scores, Demo Cards, Monetization Map, Buyer Value Layer |
| Global Growth Department | `/admin/global-growth-department` | Persistent pipeline, Quick Add, Batch Planner, Approval Queue |
| Buyer Room | `/admin/buyer-room` | Sell-ready package, transfer checklist, sale readiness score |
| Contact Copilot | `/admin/contact-copilot` | Gmail Draft, Form Autofill, no auto-send |
| Buyer Readiness | `/admin/buyer-readiness` | Transferability audit |
| Exit Readiness | `/admin/exit-readiness` | Acquisition checklist |
| CEO Dashboard | `/admin/ceo-dashboard` | Command centre |
| Revenue Accelerator | `/admin/revenue-accelerator` | Revenue tools |
| Revenue Inbox | `/admin/revenue-inbox` | Lead inbox |
| Revenue Control | `/admin/global-revenue-control` | Revenue overview |
| CWO Command Center | `/admin/cwo-command-center` | Operational control |
| First Pilot | `/admin/first-pilot` | Pilot execution tools |

---

## Data Assets

| Asset | Location | Notes |
|---|---|---|
| Growth targets table | Supabase `growth_targets` | Employer, candidate source, partner leads |
| Growth messages table | Supabase `growth_messages` | Approval-gated outreach drafts |
| Pipeline JSON export | `/api/admin/growth/export` | Full pipeline in JSON format |
| Corridor Intelligence data | `lib/corridor-intelligence.ts` | 8 corridors, scores, monetization paths |
| Growth department logic | `lib/global-growth-department.ts` | Message templates, batch planner, queue |

---

## Code Assets

| Asset | Location | Notes |
|---|---|---|
| Next.js codebase | `/` | App Router, TypeScript strict |
| Test suite | `/__tests__/` | 45 files, 4 112 tests, all green |
| Library modules | `/lib/` | Pure TypeScript, no `any` types |
| API routes | `/app/api/` | Admin-protected |
| Documentation | `/docs/` | 50+ files |

---

## Documentation Assets

| Document | Purpose |
|---|---|
| `BUYER_OVERVIEW.md` | Executive summary for buyers |
| `TRANSFER_GUIDE.md` | 10-step transfer process |
| `TECHNICAL_ARCHITECTURE.md` | Technical stack and structure |
| `SECURITY_AND_COMPLIANCE.md` | Security and compliance posture |
| `MARKET_PROOF_PLAN.md` | Path to market validation |
| `VALUATION_ARGUMENT.md` | Honest valuation framework |
| `ASSET_INVENTORY.md` | This document |
| `SELL_READY_CHECKLIST.md` | Sell-readiness checklist |
| `BUYER_DEMO_SCRIPT.md` | 10-minute demo script |
| `MONETIZATION_MAP.md` | 7 monetization paths |
| `BUYER_VALUE_LAYER.md` | Buyer value categories |
| `CORRIDOR_INTELLIGENCE.md` | Full corridor engine documentation |
| `GLOBAL_GROWTH_DEPARTMENT.md` | Growth department documentation |
| + 35 additional docs | Full documentation library |

---

## What is NOT Included

| Item | Notes |
|---|---|
| Paying customers | None |
| Revenue history | None |
| Market validation | Not yet executed |
| Stripe integration | Not active |
| Automated outreach pipeline | Not executed |
| Legal clearance | Buyer's responsibility |

---

*Related: [`BUYER_OVERVIEW.md`](./BUYER_OVERVIEW.md) · [`TRANSFER_GUIDE.md`](./TRANSFER_GUIDE.md) · [`SELL_READY_CHECKLIST.md`](./SELL_READY_CHECKLIST.md)*
