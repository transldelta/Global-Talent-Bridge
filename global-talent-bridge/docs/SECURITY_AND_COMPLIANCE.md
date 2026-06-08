# 🛡️ Security & Compliance — CorridorWork

*Sprint: Sell-Ready Buyer Room · 2026-06-08*

> Buyer-facing compliance summary. For technical RLS details see
> `docs/SECURITY_AND_RLS_SUMMARY.md`.

---

## Core Safety Guarantees

| Guarantee | How enforced | Level |
|---|---|---|
| No automatic sending | DB CHECK constraint on `growth_messages.no_auto_send = true` | Database |
| No automatic sending | No send-button in any UI | Application |
| No scraping | Zero external HTTP calls in lib layer | Code |
| No Stripe active | Not connected, no payment flows | Infrastructure |
| No job guarantee | Explicit in all public copy and docs | Content |
| No visa guarantee | Explicit in Buyer Value Layer and docs | Content |
| No candidate fees | Intake forms are free and voluntary | Product |
| Admin routes protected | Middleware (session) + page-level (admin email check) | Application |
| No public admin links | Not in nav, sitemap, or robots | SEO/Crawl |
| GDPR-compliant hosting | Supabase EU-Frankfurt (eu-central-1) | Infrastructure |
| RLS on all tables | Row Level Security active — no anon/public access | Database |

---

## Database Security

### Row Level Security (RLS)

Every table in the Supabase project has RLS enabled:

```sql
-- Verify RLS status (run as superuser/service role)
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
-- Expected: rowsecurity = true for all tables
```

Anon key access returns empty/error. Only service role key can bypass RLS.

### no_auto_send Constraint

```sql
-- growth_messages table — DB-level enforcement
no_auto_send boolean NOT NULL DEFAULT true
  CHECK (no_auto_send = true)
```

This constraint cannot be bypassed at the application layer. Any INSERT or UPDATE that sets `no_auto_send = false` fails at the database level.

---

## Admin Access Control

### Layer 1 — Middleware

`middleware.ts` intercepts all requests to `/admin/*`. If no valid Supabase session exists → immediate HTTP 307 redirect to `/auth/login?redirectTo=...`. No admin page content is served to unauthenticated users.

### Layer 2 — Page-level Admin Check

Each admin page calls `getCurrentAdminUser()` which verifies:
1. Valid Supabase session
2. Authenticated email matches `ADMIN_EMAIL` environment variable

Non-admin authenticated users (e.g. regular account holders) cannot access admin pages.

---

## SEO & Crawl Protection

### robots.txt
```
Disallow: /admin/
Disallow: /auth/
Disallow: /candidate/
Disallow: /employer/
Disallow: /api/
```

### sitemap.xml
No `/admin/*` URLs included. Only public-facing pages.

### Meta robots
All admin pages have:
```html
<meta name="robots" content="noindex, nofollow" />
```

---

## GDPR Compliance

| Item | Status |
|---|---|
| Data hosting location | EU-Frankfurt (eu-central-1) |
| Personal data storage | Only explicitly submitted form data |
| Data collected | Name, email, company, role (voluntary intake forms) |
| Data access | Admin-only via RLS-protected tables |
| Data export | Available via `/api/admin/growth/export` |
| Deletion | Possible via Supabase dashboard or API |
| Legal basis | Legitimate interest / consent (intake form submission) |

---

## What Requires Legal Review Before Going Commercial

The following activities require independent legal review before a buyer activates them:

1. **Recruitment intermediary regulation** — acting as an intermediary in employment placement is regulated differently in each jurisdiction (Germany: Arbeitnehmerüberlassungsgesetz; UK: Employment Agencies Act; etc.)
2. **Data processing agreements** — if personal data of EU residents is shared with employers or agencies, a Data Processing Agreement (DPA) may be required
3. **Candidate consent** — specific consent language for specific use of candidate data
4. **Sector-specific licensing** — healthcare staffing has specific licensing requirements in some jurisdictions

**The platform architecture is designed to be compliant by default.** Legal review is needed before operating commercially — not before buying the asset.

---

*Related: [`TECHNICAL_ARCHITECTURE.md`](./TECHNICAL_ARCHITECTURE.md) · [`TRANSFER_GUIDE.md`](./TRANSFER_GUIDE.md)*
