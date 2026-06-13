# CorridorWork — Secrets & Data Safety Checklist

**Pre-Transfer Security Verification**  
**Reviewed at Commit:** 351df82

---

## Purpose

This checklist confirms that no secrets, credentials, API keys, passwords, private tokens or personal data are present in the transferred repository. It is provided for buyer due diligence and seller verification.

---

## 1. Environment Variables — Git Status

| Check | Status |
|---|---|
| `.env.local` committed to git | ❌ Not committed — in `.gitignore` |
| `.env` committed to git | ❌ Not committed — in `.gitignore` |
| `.env.development.local` committed | ❌ Not committed — in `.gitignore` |
| `.env.test.local` committed | ❌ Not committed — in `.gitignore` |
| `.env.production.local` committed | ❌ Not committed — in `.gitignore` |
| `.env.example` committed | ✅ Committed — contains only variable NAMES, no values |

**`.gitignore` protects:** `.env`, `.env.local`, `.env.*.local`

---

## 2. Source Code — No Hardcoded Secrets

| Check | Status |
|---|---|
| No Stripe live keys (`sk_live_*`) in source | ✅ Verified |
| No Stripe test keys (`sk_test_*`) in source | ✅ Verified |
| No Supabase Service Role key value in source | ✅ Verified — only variable NAME referenced |
| No Supabase Anon key value in source | ✅ Verified — only variable NAME referenced |
| No Resend API key in source | ✅ Verified |
| No SMTP passwords in source | ✅ Verified |
| No JWT secrets hardcoded | ✅ Verified — Supabase handles auth |
| No bearer tokens in source | ✅ Verified |
| No OAuth secrets in source | ✅ Verified |
| No `CRON_SECRET` value in source | ✅ Verified — only referenced as `process.env.CRON_SECRET` |

---

## 3. No Active Payment Integration

| Check | Status |
|---|---|
| Stripe SDK not installed | ✅ Not in `package.json` |
| No `stripe.com` API calls in source | ✅ Verified |
| No `loadStripe()` in source | ✅ Verified |
| Payment processing not active | ✅ `EMAIL_PROVIDER=none` default |

---

## 4. No Email / Outreach Automation Active

| Check | Status |
|---|---|
| `EMAIL_PROVIDER` default | ✅ `none` — no transactional email |
| `OUTREACH_EMAIL_PROVIDER` default | ✅ `none` — no outreach email |
| No `sendEmail()` function exported from `lib/revenue-leads.ts` | ✅ Verified by tests |
| No Resend API calls in active code paths | ✅ Verified — only in conditional `if (provider === 'resend')` blocks |

---

## 5. No Real User / Customer Data in Repository

| Check | Status |
|---|---|
| No real candidate profiles in source | ✅ All demo data is fictional (explicitly labelled) |
| No real employer submissions in source | ✅ No real employer data in repo |
| No real lead data in source | ✅ Leads are stored in Supabase — not in repo |
| No personal contact lists in source | ✅ Not present |
| No real names, emails or phone numbers in source code | ✅ Demo profiles use initials only (FK, AK, RN) |
| No database export files committed | ✅ No `.sql` data dumps committed |

---

## 6. Admin Access Safety

| Check | Status |
|---|---|
| Admin routes protected by middleware | ✅ `middleware.ts` guards `/admin`, `/candidate`, `/employer` |
| Admin email check server-side | ✅ Each admin page checks `ADMIN_EMAILS` env variable |
| No admin credentials hardcoded | ✅ Verified |
| No admin links on public-facing pages | ✅ Verified — nav, footer, CTAs checked |
| `/admin` redirects to login when unauthenticated | ✅ Live-verified |

---

## 7. Seller's Personal Data

| Check | Status |
|---|---|
| Seller's personal email in `.env.example` | ⚠️ `ADMIN_EMAILS=transl.delta@gmail.com` — same as Impressum, no secret |
| Seller's name in Impressum | ✅ Required by German law — buyer must update after transfer |
| Seller's name in README | ✅ "Betrieben von: Brahim Ben Abla" — buyer updates after transfer |
| Seller's name in Footer | ✅ "Delta Translation, Karlsruhe" — buyer updates after transfer |
| No private phone numbers in source | ✅ Verified |
| No private addresses beyond Impressum | ✅ Impressum address is legally required |

**Buyer action required:** Update `/legal/impressum`, `/legal/datenschutz`, and footer with buyer's own details after transfer.

---

## 8. Git History — Obvious Secrets Check

A pattern-based scan of the git history for common secret patterns has been performed.

| Pattern Checked | Result |
|---|---|
| `sk_live_*` (Stripe live) | ✅ Not found |
| `sk_test_*` (Stripe test) | ✅ Not found |
| `eyJ` (JWT token prefix) | ✅ Not found as hardcoded value |
| `service_role` key values | ✅ Not found as values |
| Raw API key patterns (`[A-Za-z0-9]{32,}` in assignments) | ✅ No obvious hardcoded values found |

*Note: This is a surface-level check. Buyer is encouraged to perform their own git history review using tools like `git log -p | grep -i "secret\|key\|token\|password"` before accepting the transfer.*

---

## 9. GDPR / Data Protection

| Check | Status |
|---|---|
| Privacy Policy accessible | ✅ `/legal/datenschutz` |
| Legal Notice accessible | ✅ `/legal/impressum` |
| Terms of Service accessible | ✅ `/legal/agb` |
| Consent checkboxes on all intake forms | ✅ Verified |
| No automatic email sending | ✅ `EMAIL_PROVIDER=none` |
| No candidate data shared with third parties | ✅ No third-party sharing configured |
| Supabase EU region (seller's setup) | ✅ eu-central-1 Frankfurt |

**Buyer responsibility:** Set up their own Supabase project in a GDPR-appropriate region and consult a lawyer for compliance in their jurisdiction.

---

## 10. Summary

| Area | Status |
|---|---|
| No secrets in repository | ✅ CLEAN |
| No real user data in repository | ✅ CLEAN |
| No active payment integration | ✅ CLEAN |
| No active email automation | ✅ CLEAN |
| Admin access protected | ✅ CLEAN |
| GDPR compliance (seller setup) | ✅ CLEAN |
| Git history surface check | ✅ CLEAN |

**Overall status: ✅ SAFE TO TRANSFER**

---

*This checklist was verified at commit 351df82. Buyer is encouraged to perform their own independent security review before accepting the transfer.*
