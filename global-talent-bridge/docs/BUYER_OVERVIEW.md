# 📋 Buyer Overview — CorridorWork

*Sprint: Sell-Ready Buyer Room · 2026-06-08*

## What is CorridorWork?

CorridorWork is a **global talent corridor intelligence and approval-based growth platform** for the international recruitment market.

It is not a job board. It is not a standard ATS. It is a **corridor operating system** — structuring which global talent markets to target, through which partner channels, in what order, with which compliance safeguards.

## Live Product

**Domain:** https://corridorwork.com  
**Status:** Live, production-deployed on Vercel (auto-deploy from GitHub)  
**Database:** Supabase PostgreSQL 17, EU-Frankfurt, GDPR-compliant, RLS active  
**Admin:** Protected at `/admin/*` — requires admin authentication

## Three-Sided Market

| Side | Interface | Database |
|---|---|---|
| Employers (demand) | `/global/employers` | `growth_targets` (Supabase) |
| Candidate sources | `/global/candidates` | `growth_targets` (Supabase) |
| Partner channels | `/partners`, `/strategic-partnership` | `growth_targets` (Supabase) |

## Core Product Areas

### Public Website
- Homepage, employer page, candidate page, partner pages
- 30+ SEO-optimised pages (industry, corridor, solution landing pages)
- Demo page + sandbox
- Legal pages (Impressum, Datenschutz, AGB)

### Admin Control System (10+ tools)
- **Corridor Intelligence** — 8 corridors with Buyer Opportunity Scores
- **Global Growth Department** — persistent Supabase pipeline, batch planner, approval queue
- **Contact Copilot** — Gmail draft helper, form autofill, no auto-send
- **Buyer Readiness** — transferability audit
- **Exit Readiness** — acquisition preparation checklist
- **CEO Dashboard** — command centre
- **Revenue tools** — accelerator, inbox, control

### Data Layer
- `growth_targets` — employer, candidate source, and partner leads
- `growth_messages` — approval-gated outreach drafts (`no_auto_send` CHECK constraint)
- JSON export via `/api/admin/growth/export`
- RLS active — no public/anon access

## Technical Stack

| Component | Technology |
|---|---|
| Framework | Next.js (App Router, TypeScript strict) |
| Database | Supabase (PostgreSQL 17, EU-Frankfurt) |
| Deployment | Vercel (serverless, auto-deploy) |
| Tests | Vitest — 4 112 tests, all green |
| CI | GitHub → Vercel auto-deploy |

## What is NOT active

| Item | Status |
|---|---|
| Paying customers | None yet |
| MRR | €0 |
| Stripe | Not connected |
| Automated outreach | Not executed |
| Market validation | Pending (outreach not yet sent) |
| Legal review | Recommended before paid placement |

## Transfer Readiness

All four primary assets are independently transferable:

1. **GitHub** — repo transfer via Settings
2. **Vercel** — project transfer via Settings
3. **Supabase** — project transfer via Settings
4. **Domain** — corridorwork.com via registrar

See `docs/TRANSFER_GUIDE.md` for the 10-step transfer process.

## Related Documents

- [`TRANSFER_GUIDE.md`](./TRANSFER_GUIDE.md)
- [`TECHNICAL_ARCHITECTURE.md`](./TECHNICAL_ARCHITECTURE.md)
- [`SECURITY_AND_COMPLIANCE.md`](./SECURITY_AND_COMPLIANCE.md)
- [`VALUATION_ARGUMENT.md`](./VALUATION_ARGUMENT.md)
- [`ASSET_INVENTORY.md`](./ASSET_INVENTORY.md)
- [`SELL_READY_CHECKLIST.md`](./SELL_READY_CHECKLIST.md)
- [`BUYER_DEMO_SCRIPT.md`](./BUYER_DEMO_SCRIPT.md)
- [`MONETIZATION_MAP.md`](./MONETIZATION_MAP.md)
