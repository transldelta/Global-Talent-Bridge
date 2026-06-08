# ❓ Buyer Q&A — CorridorWork

*Final Sales Launch Preparation · 2026-06-08*

> Honest answers to every question a buyer is likely to ask.
> No spin. No omissions. No inflated claims.

---

## Q1: Gibt es Umsatz? / Is there revenue?

**Nein. / No.**

Monthly recurring revenue = €0. No paid transactions have occurred. Stripe is not active.

This is an asset-stage acquisition. The valuation is based on the value of the built infrastructure, the corridor intelligence framework, the documented transfer package, and the structured monetization paths — not on revenue history.

The suggested ask of €49 000–€79 000 reflects this honestly.

---

## Q2: Gibt es Kunden? / Are there customers?

**Nein. / No.**

There are no paying customers. No free trials with signed agreements. No LOIs from clients. The intake forms (employer, candidate source, partner) are live and functional, but no commercial relationships have been established.

This is disclosed in the Buyer Room (`/admin/buyer-room` → Honest Gaps tab) and in the Sale Listing.

---

## Q3: Was ist fertig? / What is ready?

The following are complete, tested, and transfer-ready:

**Infrastructure**
- corridorwork.com — live, indexed, HTTPS
- GitHub repository — full codebase, git history
- Vercel production deployment — auto-deploy from GitHub
- Supabase PostgreSQL 17 — EU-Frankfurt, GDPR, RLS active

**Product (public-facing)**
- Employer intake form → Supabase
- Candidate source intake form → Supabase
- Partner intake (4 tracks) → Supabase
- Demo and sandbox pages
- Strategic partnership page
- Pilot landing pages
- 25+ SEO corridor / industry / solution pages

**Admin toolset (9+ tools)**
- Corridor Intelligence (8 scored corridors, Buyer Opportunity Scores)
- Global Growth Department (persistent pipeline, batch planner, approval queue)
- Contact Copilot (Gmail draft, form autofill — no auto-send)
- Buyer Room (sale readiness score, transfer checklist, full due-diligence package)
- Market Proof Launch (3 campaigns, 45 targets, reply tracker, proof export)
- CEO Dashboard, Buyer Readiness, Exit Readiness, and more

**Documentation**
- 50+ documents including transfer guide, technical architecture, security, valuation, asset inventory, demo script, buyer Q&A, and this document

**Code quality**
- 4 258 passing tests (47 files, 0 failures)
- 0 TypeScript errors (`tsc --noEmit`)
- ESLint clean
- Build clean (163 pages)

---

## Q4: Was ist noch nicht aktiv? / What is not yet active?

| Item | Status | Notes |
|---|---|---|
| Revenue | Not active | €0 MRR |
| Paying customers | Not active | None |
| Stripe | Not connected | Can be activated by buyer |
| Market outreach | Not executed | Campaigns structured, ready to launch |
| Market validation | Pending | No real replies collected yet |
| Legal review | Not done | Buyer's responsibility per jurisdiction |
| Placement fees | Not active | Requires legal review before use |

---

## Q5: Warum ist es wertvoll? / Why is it valuable?

Three reasons:

**1. Corridor intelligence IP**
No comparable micro-SaaS exists with structured corridor-level analysis of the global talent mobility market. The Buyer Opportunity Score framework, the 8 scored corridors, and the monetization path map represent genuine research and product thinking — not just boilerplate code.

**2. Transfer-ready infrastructure**
Four independently transferable assets, each with documented transfer procedures. 4 258 green tests. 0 TypeScript errors. The buyer can run `npm test` in their first 10 minutes of due diligence and verify the code quality themselves.

**3. Activation-ready**
The pipeline is built. The campaigns are structured. The outreach templates are written. The monetization paths are mapped. A buyer with existing relationships in international recruitment, HR-tech, or relocation can begin activating the business model on day one.

---

## Q6: Wie wird es übertragen? / How is the transfer done?

10 steps, ~1–2 days:

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

All four assets are independently transferable — GitHub, Vercel, Supabase, and the domain registrar are separate systems that each have their own transfer process. No single point of failure.

---

## Q7: Welche Accounts braucht man? / What accounts does the buyer need?

| Account | Purpose | Notes |
|---|---|---|
| GitHub | Code repository | Free or paid |
| Vercel | Deployment | Free tier sufficient for current load |
| Supabase | Database | Free tier → Pro if scaling |
| Domain registrar | corridorwork.com | Transfer from current registrar |
| Resend (or equivalent) | Transactional email | Currently configured in .env |
| Stripe | Payments | Not active — connect when ready |

All credentials and environment variables are documented and will be handed over at transfer.

---

## Q8: Welche Risiken gibt es? / What are the risks?

Disclosed honestly:

| Risk | Severity | Notes |
|---|---|---|
| No revenue proof | High | Asset-stage — no MRR, no customers |
| Market validation pending | Medium | Outreach not executed; demand not yet confirmed |
| Legal complexity | Medium | Recruitment intermediary rules vary by jurisdiction — buyer must review |
| Corridor demand assumptions | Medium | Corridor scores are structured analysis, not guaranteed market data |
| Activation dependency | Medium | Monetization requires buyer to have or build commercial relationships |
| Platform risk | Low | Next.js, Supabase, Vercel are all active, well-supported platforms |
| Technical debt | Low | 4 258 tests, TypeScript strict, ESLint clean — code quality is verifiable |

There are no hidden legal issues, no outstanding liabilities, and no undisclosed technical problems.

---

## Q9: Warum kein automatischer Versand? / Why no automatic sending?

Deliberate design decision, enforced at multiple layers:

1. **Database CHECK constraint** — `no_auto_send` prevents the `sent` status from being set without going through the manual approval queue
2. **UI design** — Contact Copilot opens Gmail drafts or pre-fills forms; the operator clicks Send
3. **No scheduled jobs** — no cron jobs, no queued email delivery
4. **Compliance** — automated bulk outreach to professional contacts raises GDPR, CAN-SPAM, and jurisdiction-specific compliance issues; manual review eliminates this risk category

A buyer inherits zero automated outreach risk. This is a feature, not a limitation.

---

## Q10: Warum kein Scraping? / Why no scraping?

For the same reasons: legal risk and platform terms of service.

Scraping professional networks (LinkedIn, XING) violates their ToS. Scraping contact data without consent raises GDPR and CCPA compliance issues. The platform is designed to work with manually researched, consent-based outreach — which is slower but legally clean.

The corridor intelligence and target identification in the admin tools are powered by structured analysis, not scraped data.

---

## Q11: Wie schnell kann ein Käufer starten? / How quickly can a buyer start?

**Technical activation: Day 1.**

The transfer takes 1–2 days. After that:
- Admin tools are immediately operational
- Corridor intelligence is live
- Growth pipeline is operational
- Contact Copilot is ready
- All outreach templates are ready

**Commercial activation: Week 1.**

With existing relationships in the target market, a buyer can:
- Start the 3 outreach campaigns in Market Proof Launch
- Send first outreach messages via Contact Copilot
- Begin employer and partner intake
- Run the first buyer demo via the Buyer Demo Script

---

## Q12: Was kann der Käufer nach Übernahme tun? / What can the buyer do after transfer?

In order of speed and effort:

| Action | Effort | Expected outcome |
|---|---|---|
| List on Acquire.com / MicroAcquire | Low | Attract additional buyer interest (if using as portfolio asset) |
| Execute Market Proof campaigns | Low | Collect 1–3 written market replies |
| Activate employer pilot programme | Medium | First paying client via pilot fee |
| Partner with language school or recruiting agency | Medium | Build candidate source pipeline |
| Activate Stripe + SaaS licence | Medium | First recurring revenue |
| White-label for a recruiting firm | High | Larger deal, recurring licence |
| Legal review + activate placement fees | High | Success-based revenue per placed candidate |

The platform is not a finished product waiting to be sold. It is a built, documented, transfer-ready infrastructure waiting to be operated by someone with the right market relationships.

---

*Related: [`SALE_LISTING_DRAFT.md`](./SALE_LISTING_DRAFT.md) · [`VALUATION_ARGUMENT.md`](./VALUATION_ARGUMENT.md) · [`TRANSFER_GUIDE.md`](./TRANSFER_GUIDE.md) · [`BUYER_OUTREACH_MESSAGES.md`](./BUYER_OUTREACH_MESSAGES.md)*
