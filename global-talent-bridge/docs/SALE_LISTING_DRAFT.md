# 📋 Sale Listing — CorridorWork

*Final Sales Launch Preparation · 2026-06-08*

---

## Title

**CorridorWork — Global Talent Corridor Intelligence Platform**  
*Transfer-Ready SaaS Asset · Asset Stage · No MRR*

---

## One-Line Pitch

A structured corridor intelligence and approval-based growth SaaS for the international talent mobility market — built, tested, documented, and transfer-ready on day one.

---

## What Makes This Different

Most international recruitment tools are job boards with a map overlay. CorridorWork is something else: a **corridor operating system**. It tells you which global talent corridors to activate, in what order, with which partner channels — and then provides the pipeline to execute it.

- **8 scored talent corridors** — each rated across 7 buyer opportunity criteria
- **Three-sided pipeline** — employer intake + candidate source intake + partner intake, all in Supabase
- **Approval-based by default** — every outreach action is manually reviewed and manually sent; no automation risk
- **Buyer Room** — a full due-diligence package built into the admin, including sale readiness score, transfer checklist, and honest gaps
- **Market Proof Launch** — three outreach campaigns, reply tracker, and buyer proof export already structured and ready to activate

No other micro-SaaS in this space is transfer-ready at this level of documentation and structural clarity.

---

## What Is Being Sold

Four independently transferable assets:

| Asset | Transfer method | Status |
|---|---|---|
| Domain — corridorwork.com | Registrar transfer / DNS change | ✅ Live |
| GitHub repository | Settings → Transfer | ✅ Ready |
| Vercel project | Settings → Transfer | ✅ Ready |
| Supabase project | Settings → Transfer | ✅ Ready |

Plus everything built on top:
- Admin toolset (9+ tools)
- 25+ SEO landing pages
- 50+ documentation files
- 4 258 passing tests
- Full transfer guide (10 steps)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js App Router · TypeScript strict |
| Database | Supabase PostgreSQL 17 · EU-Frankfurt · GDPR |
| Security | RLS on all tables · `no_auto_send` DB CHECK constraint |
| Deployment | Vercel · serverless · auto-deploy |
| Testing | Vitest · 4 258 tests · 47 files · 0 failures |
| Code quality | 0 TypeScript errors · ESLint clean · 0 warnings |

---

## Admin Toolset

Every tool is auth-gated (noindex, nofollow). No admin URL appears in sitemap or robots.

| Tool | Route | What it does |
|---|---|---|
| Corridor Intelligence | `/admin/corridor-intelligence` | 8 corridors, Buyer Opportunity Scores, Demo Cards, Monetization Map |
| Global Growth Department | `/admin/global-growth-department` | Persistent pipeline, Batch Planner, Approval Queue |
| Contact Copilot | `/admin/contact-copilot` | Gmail Draft links, Form Autofill — no auto-send |
| Buyer Room | `/admin/buyer-room` | Sale Readiness Score, full due-diligence package, transfer checklist |
| Market Proof Launch | `/admin/market-proof-launch` | 3 campaigns, 45 targets, reply tracker, proof export |
| CEO Dashboard | `/admin/ceo-dashboard` | Strategic overview |
| Buyer Readiness | `/admin/buyer-readiness` | Transferability audit |
| Exit Readiness | `/admin/exit-readiness` | Acquisition checklist |

---

## Product (Public-Facing)

- **corridorwork.com** — live, indexed, HTTPS
- Employer intake → Supabase (with full audit trail)
- Candidate source intake → Supabase
- Partner intake (4 tracks: recruiting agency, relocation, language school, strategic)
- Demo + sandbox page
- Strategic partnership page
- Pilot landing pages (employers + agencies)
- 25+ SEO corridor/industry/solution landing pages

---

## Monetization Paths

Seven paths. None are active yet — the buyer activates them:

| Path | Effort | Description |
|---|---|---|
| SaaS licence | Low | Monthly/annual subscription for corridor intelligence access |
| Employer pilot | Medium | Paid 3–6 month onboarding engagement |
| Partner intelligence | Medium | Corridor intelligence packages for recruiting/relocation firms |
| Placement fee | High | Success-based fee per placed candidate — requires legal review |
| White-label | High | Sell the platform under a recruiting firm's brand |
| Corridor consulting | Low | Strategy consulting using the intelligence engine |
| Acquisition | — | Current path |

---

## Sale Readiness Score: ~65 / 100

Calculated in `/admin/buyer-room`:

| Criterion | Score |
|---|---|
| Product completeness | 84 / 100 |
| Technical quality | 93 / 100 |
| Transfer readiness | 82 / 100 |
| Differentiation | 79 / 100 |
| Compliance posture | 91 / 100 |
| Documentation quality | 83 / 100 |
| Market proof | 8 / 100 |
| Revenue proof | 5 / 100 |

**Strong on:** technical quality, compliance, transfer readiness, documentation.  
**Honest gaps:** market proof and revenue proof — outreach not yet executed, no MRR.

Collecting 1–3 real market replies raises the score to ~75–80 and moves the valuation toward the upper bound.

---

## Honest Gaps (Disclosed Proactively)

| Gap | Details |
|---|---|
| No paying customers | Zero at time of listing |
| No MRR | Monthly recurring revenue = €0 |
| Stripe not active | Payment processing not connected |
| Market validation pending | Outreach campaigns structured but not yet executed |
| Legal review needed | Recruitment intermediary rules vary by jurisdiction — buyer's responsibility |

These gaps are documented in `/admin/buyer-room` → Honest Gaps tab. They are the expected gaps for an asset-stage acquisition — not a sign of dysfunction.

---

## Suggested Ask

**€49 000 – €79 000**

This is an **asset-stage valuation**, not a revenue multiple.

- **€49 000** — code, infrastructure, documentation, domain, as-is
- **€79 000** — full value of the corridor intelligence IP, transfer-ready state, admin toolset, and documented monetization paths

Where the final price lands depends on the buyer's activation plan and market proof at time of agreement. Negotiable.

---

## Compliance & Safety

Built to be safe to operate from day one:

- `no_auto_send` CHECK constraint enforced at the database level
- No automated outreach — every message requires manual review and manual sending
- No scraping — all contacts found manually
- No job guarantees in any UI copy or document
- No visa guarantees in any UI copy or document
- No candidate fees — all intake forms are free
- `/robots.txt` blocks `/admin/` and `/api/`
- All admin pages: `noindex, nofollow`
- Supabase EU-Frankfurt (GDPR jurisdiction)
- Row-Level Security active on all tables

A buyer inherits zero automated outreach risk.

---

## Transfer (10 Steps, ~1–2 Days)

1. GitHub repository transfer (5 min)
2. Vercel project transfer (15 min)
3. Supabase project transfer (30 min)
4. Domain transfer (1–48 hours, registrar dependent)
5. Environment variables handover
6. Admin user setup in Supabase Auth
7. DNS verification
8. Smoke test (5 pages + admin login)
9. Documentation handover
10. Optional 1-hour handover call

Full guide: `docs/TRANSFER_GUIDE.md`

---

## Reason for Sale

The platform is built. The infrastructure runs. The documentation is complete. The test suite passes.

The bottleneck is commercial activation — converting the corridor intelligence framework into paying clients. That requires active relationships in international recruitment, HR-tech, or relocation. A buyer with those relationships can move faster than continued solo development.

No distress. No technical debt. No legal issues. A deliberate exit.

---

## Due Diligence

All of the following are available immediately:

- `/admin/buyer-room` — interactive due-diligence package (share access on request)
- `npm test` — run all 4 258 tests in under 5 seconds
- `npx tsc --noEmit` — zero errors
- `npm run build` — clean build, 163 pages
- Full docs library (50+ files)
- `docs/SALE_DATA_ROOM_INDEX.md` — complete index

---

## Contact

CorridorWork Team  
corridorwork.com

> **⚠️ Before publishing:** Replace this section with your actual contact information.
> Options: LinkedIn profile URL, email address, or "Contact via [platform name] messaging".
> Do NOT include personal phone numbers in public listings.

---

## Payment & Transfer Security

All asset transfers happen **after payment is confirmed in escrow**. No exceptions.

- Recommended: Escrow.com, Acquire.com built-in escrow, or broker escrow
- No asset is shared before escrow confirmation
- Full transfer guide: `docs/TRANSFER_GUIDE.md`

---

*No fake revenue. No fake customers. No job guarantees. No visa guarantees.*  
*This is an honest asset-stage listing.*

*Related: [`VALUATION_ARGUMENT.md`](./VALUATION_ARGUMENT.md) · [`ASSET_INVENTORY.md`](./ASSET_INVENTORY.md) · [`TRANSFER_GUIDE.md`](./TRANSFER_GUIDE.md) · [`BUYER_QA.md`](./BUYER_QA.md)*
