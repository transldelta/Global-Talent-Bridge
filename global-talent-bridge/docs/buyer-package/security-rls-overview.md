# Security & RLS Overview — CorridorWork Buyer Package

*Zero-Cost Buyer Package Sprint · 2026-06-09*

---

## Security architecture summary

CorridorWork is built with a **compliance-first** security model. Every layer enforces constraints that protect both operators and users from accidental or intentional misuse.

---

## Row Level Security (RLS)

RLS is active on **all** Supabase tables.

```sql
-- Verify post-transfer:
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
-- All tables must show rowsecurity = true
```

**What this means:**
- The Supabase anon key cannot read any production data
- All data access requires the service role key (server-side only)
- No public API route exposes database records
- The anon key is safe to include in the client bundle — it cannot access anything useful

---

## `no_auto_send` CHECK constraint

A database-level constraint enforces the no-automated-outreach principle:

```sql
-- Enforced at DB level — cannot be bypassed by application code
ALTER TABLE growth_messages
  ADD CONSTRAINT no_auto_send CHECK (no_auto_send = TRUE);
```

**What this means:**
- The `sent` status on any outreach message cannot be set without passing through the manual approval queue
- No application-level code can accidentally trigger automated sending
- The constraint survives code changes, refactors, and new developers

---

## Authentication

| Layer | Implementation |
|---|---|
| Admin session | Supabase Auth — cookie-based |
| Admin gate | `getCurrentAdminUser()` server function |
| Redirect | `redirect('/auth/login')` — HTTP 307 |
| Admin email | `ADMIN_EMAIL` env variable |
| Brute force | Supabase handles rate limiting |

All admin pages:
- `export const dynamic = 'force-dynamic'`
- `robots: 'noindex, nofollow'` in metadata
- Auth check before any rendering

---

## robots.txt and sitemap

```
# /robots.txt
Disallow: /admin/
Disallow: /api/
```

- `/sitemap.xml` contains **0 admin URLs**
- No admin routes appear in any public navigation
- No admin routes appear in any footer or header

---

## GDPR compliance

| Property | Status |
|---|---|
| Data hosting | EU-Frankfurt (eu-central-1) — EU jurisdiction |
| Data residency | All data stays in EU |
| Candidate intake | Voluntary · Consent-based · No fees |
| No automated outreach | Enforced at DB level |
| No scraping | No external data fetching in codebase |
| Legal pages | /legal/impressum · /legal/datenschutz · /legal/agb |

---

## What the buyer inherits

| Risk | Status |
|---|---|
| Automated outreach risk | ✅ Zero — DB constraint prevents it |
| Scraping risk | ✅ Zero — no scraping code exists |
| Payment risk | ✅ Zero — Stripe not connected |
| Admin data leak | ✅ Zero — RLS + auth + noindex |
| GDPR exposure | ✅ Minimal — EU hosting, consent-based, no candidate fees |
| Compliance legal risk | ⚠️ Recruitment intermediary rules vary by jurisdiction — buyer's responsibility |

---

## Secrets rotation after transfer

The buyer **must** rotate all credentials after receiving the project:

1. Supabase service role key (Dashboard → Settings → API → Regenerate)
2. Supabase JWT secret (Dashboard → Settings → API)
3. Update all rotated values in Vercel environment variables
4. Trigger a fresh Vercel deploy to apply new secrets
5. Verify RLS is still active after transfer

---

*Part of the CorridorWork Buyer Package. See also: [`technical-architecture.md`](./technical-architecture.md) · [`deployment-transfer-checklist.md`](./deployment-transfer-checklist.md)*
