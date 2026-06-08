# CorridorWork — Buyer Transfer & Data Export Guide

**Version:** 1.0 · June 2026

---

## Overview

This guide explains how to export CorridorWork operational data for sale, transfer, or investor due diligence.

---

## Growth Pipeline Export

### How to export

1. Log in as admin: https://corridorwork.com/admin/login
2. Go to: https://corridorwork.com/admin/global-growth-department
3. In the **CEO Growth Control** tab, click **"Export growth pipeline JSON"**
4. Copy the full JSON
5. Save as `corridorwork-growth-pipeline-export-YYYY-MM-DD.json`

### What is exported

- All growth targets (employer, partner, candidate_source)
- Status per target
- Associated messages (prepared, not sent)
- Summary statistics (by status, by country, by target kind)
- Export metadata (date, safety flags, note about manual-only outreach)

### What is NOT exported

- Admin user passwords or session tokens
- SUPABASE_SERVICE_ROLE_KEY (never in export)
- Any automatically sent emails (there are none)

---

## What the export proves to a buyer

| Fact | Evidence in export |
|---|---|
| Active pipeline with N qualified targets | `summary.total_targets` |
| Targets across multiple corridors | `summary.by_country` |
| Approval-based workflow (not spam) | `export_metadata.note` + `no_auto_send: true` |
| No fake data (status = real_contact_needed if no real name) | `status` field per target |
| Safety invariants enforced at DB level | `no_auto_send`, `no_job_guarantee`, `no_visa_guarantee` fields |
| Messages prepared but not auto-sent | `growth_messages[].status = prepared` |

---

## Other data exports available

| What | How |
|---|---|
| Revenue leads (inbound) | /admin/revenue-inbox → filter + copy |
| Global employer leads | Supabase table: global_employer_leads |
| Candidate interest leads | Supabase table: candidate_interest_leads |
| Pilot outreach tracking | Supabase table: outreach_targets |

---

## Technical transfer checklist for buyer

- [ ] Vercel project transferred (transfer ownership in Vercel dashboard)
- [ ] Supabase project transferred (Settings → Transfer Project)
- [ ] Environment variables documented (see .env.example)
- [ ] GitHub repository access granted
- [ ] Domain (corridorwork.com) DNS transferred
- [ ] Growth pipeline JSON exported and handed over
- [ ] Admin email updated in ADMIN_EMAILS env var

---

## Why this pipeline has value

CorridorWork's growth pipeline is not a scraped contact list. It is:

1. **Qualified targets** — each has a sector, corridor, and generated professional message
2. **Approval-based** — every outreach was reviewed before sending
3. **Compliant** — no automated bulk email, no scraping, GDPR-aligned
4. **Persistent** — stored in Supabase PostgreSQL with full audit trail
5. **Transferable** — JSON export contains all operational data

A buyer inherits not just a platform but an active, qualified outreach pipeline.

---

*CorridorWork · Operated by Delta Translation, Karlsruhe*
*No job guarantee · No visa guarantee · No automatic outreach*
