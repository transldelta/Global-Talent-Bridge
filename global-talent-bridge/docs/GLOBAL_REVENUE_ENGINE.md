# Global Revenue Engine — CorridorWork

> Status: Phase 1 — Inbound Ready · No real leads yet · No paid ads · No Stripe

## Overview

The Global Revenue Engine describes how CorridorWork generates inbound demand from employers and candidates worldwide — without cold outreach, paid ads, or automated email.

All revenue paths are passive: **users find us, we collect structured interest, admin reviews and acts manually.**

---

## Revenue Paths (4 Live, 0 Active Revenue)

| Path | Status | URL | Est. Value |
|------|--------|-----|-----------|
| Strategic Partnership / White-Label | Live | /strategic-partnership | €5k–€50k |
| Employer Direct Placement | Live | /global/employers | €2k–€10k/placement |
| Recruiting Agency Revenue Share | Live | /partners | TBD |
| Market Intelligence / Data | Live | /market-intelligence | TBD |

All paths are **inbound only**. No Stripe. No invoicing active. No payment collection.

---

## Global Intake System

### Employer Intake — `/global/employers`
- Worldwide employers submit hiring needs
- Multi-sector: 21 qualified sectors supported
- Fields: organization, contact, email, country, sector(s), urgency, message
- Stored in: `global_employer_leads` (Supabase)
- Safety flags (DB-level CHECK): `no_email_sent=TRUE`, `no_auto_outreach=TRUE`, `no_payment_started=TRUE`

### Candidate Interest — `/global/candidates`
- Worldwide candidates express interest
- Multi-sector, multi-target country
- Fields: name, email, origin country, target country, sectors, experience, languages
- Stored in: `candidate_interest_leads` (Supabase)
- Safety flags (DB-level CHECK): `no_job_guarantee=TRUE`, `no_visa_guarantee=TRUE`, `no_candidate_fee=TRUE`

---

## Daily Revenue Engine (CWO Daily Runner)

The `cwo-daily-runner` cron job (daily at 06:00 UTC) automatically:

1. Counts new global employer leads (last 24h)
2. Counts new candidate interest leads (last 24h)
3. Outputs `topCorridors`, `topSkillCategories`, `topEmployerSegments`, `topCandidateSegments`
4. Computes `buyerReadinessScore` (66/100)
5. Summarizes `topBuyerConcern` and `nextValueBooster`

**No automatic actions.** Output is JSON — admin reads and acts manually.

---

## Talent Categories (21 Sectors)

Full list in `lib/talent-categories.ts`.

Top 5 by revenue potential:

| Rank | Sector | Revenue Score | Remote Eligible |
|------|--------|--------------|-----------------|
| 1 | IT & Software | 92 | ✅ Yes |
| 2 | Healthcare & Nursing | 90 | Partial |
| 3 | Engineering | 85 | Partial |
| 4 | Skilled Trades | 83 | No |
| 5 | Construction | 82 | No |

---

## Global Corridor Network (15+ Corridors)

| Corridor | Score | Key Sectors |
|----------|-------|-------------|
| Philippines → Healthcare | 92 | Healthcare, Hospitality |
| India → Canada | 88 | IT, Engineering, Healthcare |
| India → UK | 87 | IT, Engineering, Finance |
| Pakistan → Gulf | 85 | Construction, Manufacturing |
| Morocco → Germany | 84 | Construction, Logistics, Care |
| Nigeria → UK | 84 | IT, Construction, Healthcare |
| Tunisia → Germany | 83 | Manufacturing, Logistics |
| India → Australia | 86 | IT, Engineering |
| Morocco → France | 82 | Hospitality, Construction |
| Brazil → Portugal | 80 | IT, Hospitality |
| Pakistan → Gulf | 85 | Construction |
| Indonesia → Hospitality | 79 | Hospitality |
| Kenya → Care | 78 | Care, Healthcare |

---

## Safety Invariants

All revenue operations enforce these hard constraints:

```
no_email_sent = TRUE (always)
no_auto_outreach = TRUE (always)
no_payment_started = TRUE (always)
no_job_guarantee = TRUE (always)
no_visa_guarantee = TRUE (always)
no_candidate_fee = TRUE (always)
```

These are enforced at:
1. API route level (hardcoded in INSERT)
2. Database level (CHECK constraints)
3. Environment level (`EMAIL_PROVIDER=none`, `OUTREACH_EMAIL_PROVIDER=none`)

---

## What's Missing for Real Revenue

1. **Payment activation** — Stripe integration not started
2. **Real paying customer** — 0 customers, 0 EUR
3. **Legal contracts** — placement terms, white-label agreements
4. **First paid pilot** — employer or agency partner needed
5. **Visa/compliance partner** — for actual placement execution

---

## Architecture

```
Public Form → API Route → Supabase (RLS) → Admin Dashboard
     ↓                         ↓                  ↓
Honeypot      Safety flags   READ ONLY        Manual action
Rate limit    CHECK constraints  for admin       required
```

No automated pipeline. No email drip. No ML matching (yet).
