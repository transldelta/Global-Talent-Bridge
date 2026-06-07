# Candidate & Employer Global Intake — CorridorWork

> Status: Live · Accepting interest registrations worldwide · No payments · No guarantees

## Overview

CorridorWork accepts inbound interest from employers and candidates worldwide. Both intake forms are live at public URLs — no login required, no fees, no guarantees.

---

## Employer Intake

### URL
`/global/employers`

### Purpose
Worldwide employers can register hiring interest across 21 sectors. Admin reviews and follows up manually.

### Form Fields
| Field | Required | Notes |
|-------|----------|-------|
| Organization Name | ✅ | Company/institution name |
| Contact Name | ✅ | Person responsible |
| Email | ✅ | For admin follow-up only |
| Country | Optional | Employer's country |
| City | Optional | Employer's city |
| Sector(s) | Optional | Multi-select from 21 categories |
| Qualification Level | Optional | Junior/Mid/Senior/Expert |
| Urgency | Optional | ASAP/1–3 months/3–6 months/Flexible |
| Target Candidate Regions | Optional | e.g. "Southeast Asia, North Africa" |
| Hiring Need | Optional | Number of positions needed |
| Message | Optional | Additional context |
| Consent | ✅ | GDPR consent required |

### API Endpoint
`POST /api/public/global-employer-leads`

### Safety
- Honeypot field (`website`) — rejects bots
- Rate limit: 10 requests/IP/hour
- Duplicate limit: max 3 submissions per email
- All safety flags hardcoded `true` in insert
- No email sent after submission

### Database Table
`global_employer_leads`

```sql
no_email_sent       BOOLEAN DEFAULT TRUE CHECK (no_email_sent = TRUE)
no_auto_outreach    BOOLEAN DEFAULT TRUE CHECK (no_auto_outreach = TRUE)
no_payment_started  BOOLEAN DEFAULT TRUE CHECK (no_payment_started = TRUE)
consent_to_contact  BOOLEAN NOT NULL CHECK (consent_to_contact = TRUE)
```

---

## Candidate Interest

### URL
`/global/candidates`

### Purpose
Worldwide candidates can express interest in working abroad. Admin reviews and may contact qualified candidates for placement opportunities.

### Form Fields
| Field | Required | Notes |
|-------|----------|-------|
| Display Name | ✅ | First name or pseudonym |
| Email | ✅ | For admin contact only |
| Country of Origin | Optional | Where candidate currently lives |
| Target Country | Optional | Where candidate wants to work |
| Sector(s) | Optional | Multi-select from 21 categories |
| Experience Level | Optional | Student/Junior/Mid/Senior/Expert |
| Relocation Readiness | Optional | Immediately/Within 3 months/etc. |
| Languages | Optional | Free text |
| Qualifications | Optional | Free text |
| Message | Optional | Additional context |
| Consent | ✅ | GDPR consent required |

### API Endpoint
`POST /api/public/candidate-interest`

### Safety
- Honeypot field (`website`) — rejects bots
- Rate limit: 10 requests/IP/hour
- Duplicate limit: max 2 submissions per email
- All safety flags hardcoded `true` in insert
- No email sent after submission

### Database Table
`candidate_interest_leads`

```sql
no_email_sent       BOOLEAN DEFAULT TRUE CHECK (no_email_sent = TRUE)
no_auto_outreach    BOOLEAN DEFAULT TRUE CHECK (no_auto_outreach = TRUE)
no_payment_started  BOOLEAN DEFAULT TRUE CHECK (no_payment_started = TRUE)
no_job_guarantee    BOOLEAN DEFAULT TRUE CHECK (no_job_guarantee = TRUE)
no_visa_guarantee   BOOLEAN DEFAULT TRUE CHECK (no_visa_guarantee = TRUE)
no_candidate_fee    BOOLEAN DEFAULT TRUE CHECK (no_candidate_fee = TRUE)
consent_to_contact  BOOLEAN NOT NULL CHECK (consent_to_contact = TRUE)
```

---

## Data Flow

```
Visitor fills form
      ↓
Client-side validation
      ↓
POST to /api/public/...
      ↓
Server: honeypot check
      ↓
Server: rate limit check
      ↓
Server: duplicate limit check
      ↓
Supabase INSERT (safety flags forced true)
      ↓
Success response to user
      ↓
Admin sees lead in /admin/global-revenue-control
      ↓
Admin manually decides next action
```

---

## Admin Management

Leads are visible at:
- `/admin/global-revenue-control` — overview + counts by country/sector
- Supabase dashboard — direct table access

Admin actions (all manual):
- Review lead details
- Update status (new → reviewed → qualified → contacted_manual)
- Note follow-up actions
- Match with appropriate corridor

---

## GDPR Compliance

- Consent explicitly captured at form submission
- `consent_to_contact = TRUE` required (CHECK constraint)
- Data stored in EU region (Supabase eu-central-1)
- No third-party sharing
- No automated processing
- Retention: per CorridorWork Datenschutzerklärung
- Right to deletion: contact@corridorwork.com (admin handles manually)

---

## Migration

File: `supabase/migrations/202606070400_global_intake_tables.sql`

Creates both tables with:
- All safety CHECK constraints
- RLS policies (public INSERT only with consent+safety; service_role full access)
- Indexes on status, country, sector, email
