# 🔄 Transfer Guide — CorridorWork

*Sprint: Sell-Ready Buyer Room · 2026-06-08*

> Complete 10-step guide for transferring the CorridorWork platform to a buyer.
> All four primary assets (GitHub, Vercel, Supabase, Domain) are independently transferable.
> Estimated total transfer time: 1–2 working days.

---

## Prerequisites

**Buyer needs:**
- GitHub account (personal or organisation)
- Vercel account (free tier sufficient to start)
- Supabase account (free tier sufficient; Pro recommended for production)
- Domain registrar access (to receive corridorwork.com transfer)

**Seller provides:**
- Completed transfer of each asset (steps 1–4)
- .env values (step 5)
- Admin email update (step 6)
- Secrets rotation guidance (step 7)

---

## Step 1 — GitHub Repository Transfer

**Effort: ~5 minutes**

1. Seller: GitHub → Repository Settings → "Transfer" → enter buyer's GitHub username/org
2. Buyer: accept transfer invitation via email
3. Buyer: clone or re-link local development environment if needed
4. Buyer: update any CI/CD references to the new repo path

**What transfers:** Full git history, all branches, all commits, all tags.

---

## Step 2 — Vercel Project Transfer

**Effort: ~5 minutes**

1. Seller: Vercel Dashboard → `global-talent-bridge` project → Settings → "Transfer Project"
2. Enter buyer's Vercel team/account
3. Buyer: accept transfer in Vercel dashboard
4. Reconnect GitHub integration if needed (Settings → Git Integration → connect new repo)
5. Trigger a fresh deploy to confirm

**What transfers:** All deployment history, environment variables (encrypted), domain aliases.

---

## Step 3 — Supabase Project Transfer

**Effort: ~5 minutes**

1. Seller: Supabase Dashboard → Project → Settings → "Transfer Project"
2. Enter buyer's Supabase organisation
3. Buyer: accept transfer
4. Buyer: verify RLS policies are still active (see Step 8)

**What transfers:** Full PostgreSQL database, all tables, all RLS policies, all migrations, all edge functions.

**Important:** Supabase service role key changes on transfer. Update in Vercel env vars (Step 7).

---

## Step 4 — Domain Transfer

**Effort: 2–24 hours (registrar-dependent)**

1. Seller: unlock domain at registrar
2. Seller: provide transfer authorisation code (EPP code)
3. Buyer: initiate transfer at their chosen registrar
4. Wait for DNS propagation (up to 48 hours)
5. Update Vercel domain alias if needed

**Alternative:** Seller changes DNS nameservers to point to buyer's Vercel project (faster, ~5 minutes).

---

## Step 5 — Environment Variables Handover

**Effort: ~15 minutes**

All variables are documented in `.env.example`. Seller provides actual values securely (e.g. encrypted message, 1Password share, or secure file transfer).

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (admin only) |
| `ADMIN_EMAIL` | Email address that gets admin access |
| Any other vars in .env.example | As documented |

---

## Step 6 — Admin Email Configuration

**Effort: ~5 minutes**

1. Buyer updates `ADMIN_EMAIL` environment variable in Vercel to their admin email
2. Redeploy on Vercel (Settings → Deployments → Redeploy)
3. Verify: login with new admin email → `/admin/corridor-intelligence` should load

---

## Step 7 — Secrets Rotation

**Effort: ~1–2 hours**

Buyer rotates all sensitive credentials:

1. **Supabase service role key** — Dashboard → Settings → API → regenerate
2. **Supabase JWT secret** — Dashboard → Settings → API
3. **Supabase anon key** — regenerate if desired
4. Update all rotated values in Vercel environment variables
5. Trigger fresh Vercel deployment to apply new secrets

---

## Step 8 — RLS Policy Verification

**Effort: ~1 hour**

Confirm Row Level Security is active post-transfer:

```sql
-- Run in Supabase SQL editor
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
-- All tables should show rowsecurity = true
```

Test with anon key:
```javascript
// Should return empty data or error — never real rows
const { data, error } = await supabase.from('growth_targets').select('*')
```

---

## Step 9 — Deployment Verification

**Effort: ~15 minutes**

1. Trigger a fresh Vercel deployment (push empty commit or manual redeploy)
2. Confirm: `✓ Compiled successfully` in build logs
3. Confirm: `161/161 static pages generated`
4. Confirm: production URL responds correctly
5. Run `npm test` locally to confirm all 4 112 tests pass

---

## Step 10 — Buyer Access Checklist

**Effort: ~1–2 hours**

| Check | Expected result |
|---|---|
| `/auth/login` accessible | ✓ Login page loads |
| Admin login with buyer email | ✓ Redirects to `/admin/corridor-intelligence` |
| `/admin/corridor-intelligence` | ✓ Loads without error |
| `/admin/global-growth-department` | ✓ Shows growth pipeline |
| `/admin/buyer-room` | ✓ Shows buyer room with sale readiness score |
| `GET /api/admin/growth/export` | ✓ Returns JSON pipeline data |
| `/robots.txt` | ✓ `Disallow: /admin/` present |
| `/sitemap.xml` | ✓ No admin URLs |
| Unauthenticated `/admin/*` | ✓ Redirects to `/auth/login` |

---

## What the Buyer Can Change Immediately

- Admin email (Step 6)
- Branding (logo, colours in `app/` and `public/`)
- Domain (redirect corridorwork.com or use new domain)
- Pricing page content
- Corridor data in `lib/corridor-intelligence.ts`
- Email templates in `lib/global-growth-department.ts`

## What Requires Technical Work

- Stripe activation (payment infrastructure is ready, just not connected)
- Automated email integration (SMTP/Resend config in env)
- Additional corridor profiles
- White-label theming for partner use

---

*Related docs: [`ASSET_INVENTORY.md`](./ASSET_INVENTORY.md) · [`SECURITY_AND_COMPLIANCE.md`](./SECURITY_AND_COMPLIANCE.md) · [`SELL_READY_CHECKLIST.md`](./SELL_READY_CHECKLIST.md)*
