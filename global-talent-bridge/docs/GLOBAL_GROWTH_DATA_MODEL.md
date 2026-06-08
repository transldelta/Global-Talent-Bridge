# CorridorWork — Global Growth Data Model

**Version:** 1.0 · June 2026

---

## Tables

### `growth_targets`

Stores outreach targets across all pipeline stages.

| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| target_kind | TEXT | employer / partner / candidate_source |
| company_name | TEXT | Up to 300 chars |
| contact_email | TEXT | Optional |
| website_url | TEXT | Optional |
| contact_page_url | TEXT | Optional |
| country | TEXT | Destination market |
| source_market | TEXT | Origin market for corridor |
| destination_market | TEXT | Target market |
| sector | TEXT | Healthcare, IT, etc. |
| route | TEXT | Route type |
| corridor | TEXT | Pre-defined corridor ID |
| message_type | TEXT | One of 9 message types |
| fit_score | INTEGER | 0–100 |
| risk_level | TEXT | low / medium / high / unknown |
| status | TEXT | See status model below |
| notes | TEXT | Internal notes |
| no_auto_send | BOOLEAN | Always TRUE (CHECK constraint) |
| no_job_guarantee | BOOLEAN | Always TRUE (CHECK constraint) |
| no_visa_guarantee | BOOLEAN | Always TRUE (CHECK constraint) |
| created_by | UUID | Admin user who created |
| created_at | TIMESTAMPTZ | Auto |
| updated_at | TIMESTAMPTZ | Auto-updated via trigger |

### `growth_messages`

Stores prepared messages for each target.

| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| target_id | UUID | FK → growth_targets(id) ON DELETE CASCADE |
| channel | TEXT | email / linkedin / whatsapp / contact_form |
| subject | TEXT | Message subject |
| body | TEXT | Message body |
| status | TEXT | prepared / reviewed / approved / sent_manually |
| no_auto_send | BOOLEAN | Always TRUE (CHECK constraint) |
| created_at | TIMESTAMPTZ | Auto |
| updated_at | TIMESTAMPTZ | Auto-updated via trigger |

---

## Status Model

### Target statuses

```
target_profile          → placeholder, no real contact data
real_contact_needed     → template without a real company name
draft_prepared          → real contact data + message generated
needs_review            → waiting for admin to read it
screenshot_review       → admin has taken screenshot, reviewing
approved_to_send_manually → checklist complete, ready to send
sent_manually           → admin sent it (Gmail, LinkedIn, form)
replied                 → target responded
rejected                → target declined or not suitable
```

### Message statuses

```
prepared     → generated, not yet reviewed
reviewed     → admin has read it
approved     → cleared for manual send
sent_manually → confirm sent
```

---

## RLS Policy

Row Level Security is **enabled** on both tables.

- **Public / anon**: NO read, NO write
- **Authenticated users**: NO access (growth data is admin-only)
- **Service role**: full access (used exclusively by admin API routes via `createAdminClient()`)

No policy grants public or authenticated user access to growth data.

---

## Safety Constraints (DB-level)

These three columns have `CHECK (col = TRUE)` constraints. They can never be set to FALSE:

- `no_auto_send` — enforces no automated sending at the database level
- `no_job_guarantee` — enforces no job guarantee at the database level
- `no_visa_guarantee` — enforces no visa guarantee at the database level

These are not just application-level rules — they are database-level invariants.

---

## API Routes

| Method | Route | Description |
|---|---|---|
| GET | /api/admin/growth/targets | Load all targets (with messages) |
| POST | /api/admin/growth/targets | Create 1–50 targets (bulk) |
| PATCH | /api/admin/growth/targets/[id] | Update status, notes, fit_score |
| DELETE | /api/admin/growth/targets/[id] | Remove target |
| GET | /api/admin/growth/export | Export full pipeline as JSON |

All routes: admin auth required, no automatic outreach triggered.

---

## Migration

File: `supabase/migrations/202606080500_growth_pipeline.sql`
Idempotent (`CREATE TABLE IF NOT EXISTS`).
