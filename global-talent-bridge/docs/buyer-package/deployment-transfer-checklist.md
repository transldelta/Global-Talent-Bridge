# Deployment & Transfer Checklist — CorridorWork Buyer Package

*Zero-Cost Buyer Package Sprint · 2026-06-09*

---

## ⚠️ Payment rule — first

**No asset is transferred before payment is confirmed in escrow.**

Recommended escrow: Escrow.com, Acquire.com built-in escrow, or broker escrow.

1. Agree on price and terms in writing
2. Buyer deposits funds into escrow
3. Escrow confirms funds are held
4. Transfer all assets (steps below)
5. Buyer confirms receipt and functionality
6. Escrow releases payment to seller

---

## Transfer checklist (10 steps)

### Step 1 — GitHub repository
- [ ] Seller: GitHub → Repository Settings → Transfer
- [ ] Enter buyer's GitHub username or organisation
- [ ] Buyer: accept transfer invitation via email
- [ ] Buyer: clone repo and verify full history present
- **Effort:** ~5 minutes

### Step 2 — Vercel project
- [ ] Seller: Vercel Dashboard → `global-talent-bridge` project → Settings → Transfer Project
- [ ] Enter buyer's Vercel team or account
- [ ] Buyer: accept transfer in Vercel dashboard
- [ ] Reconnect GitHub integration (Settings → Git Integration)
- [ ] Trigger a fresh deploy to confirm
- **Effort:** ~5–15 minutes

### Step 3 — Supabase project
- [ ] Seller: Supabase Dashboard → Project → Settings → Transfer Project
- [ ] Enter buyer's Supabase organisation
- [ ] Buyer: accept transfer
- [ ] Verify RLS policies are still active (see Step 8)
- **Effort:** ~5 minutes
- **Note:** Supabase service role key changes on transfer — update in Vercel env vars

### Step 4 — Domain transfer
- [ ] Seller: unlock domain at registrar
- [ ] Seller: provide transfer authorisation code (EPP code)
- [ ] Buyer: initiate transfer at their chosen registrar
- [ ] Wait for DNS propagation (up to 48 hours)
- **Effort:** 2–48 hours (registrar-dependent)
- **Alternative:** Seller updates DNS nameservers to buyer's Vercel project (~5 minutes)

### Step 5 — Environment variables handover
- [ ] Seller provides all `.env.example` values securely (1Password share, encrypted message)
- [ ] Buyer updates variables in Vercel Dashboard → Settings → Environment Variables
- **Effort:** ~15 minutes
- **Key vars:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_EMAIL`

### Step 6 — Admin email configuration
- [ ] Buyer updates `ADMIN_EMAIL` in Vercel to their admin email
- [ ] Trigger redeploy (Settings → Deployments → Redeploy)
- [ ] Verify: login with new admin email → `/admin/corridor-intelligence` loads
- **Effort:** ~5 minutes

### Step 7 — Secrets rotation
- [ ] Rotate: Supabase service role key
- [ ] Rotate: Supabase JWT secret
- [ ] Rotate: Supabase anon key (if desired)
- [ ] Update all rotated values in Vercel env vars
- [ ] Trigger fresh Vercel deploy
- **Effort:** ~1–2 hours

### Step 8 — RLS verification
- [ ] Run in Supabase SQL editor:
  ```sql
  SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
  ```
- [ ] All tables must show `rowsecurity = true`
- [ ] Test with anon key — should return empty data or error
- **Effort:** ~1 hour

### Step 9 — Deployment verification
- [ ] Trigger fresh Vercel build (push empty commit or manual redeploy)
- [ ] Confirm: `✓ Compiled successfully` in build logs
- [ ] Confirm: all static pages generated
- [ ] Run `npm test` locally — all 4 352 tests must pass
- **Effort:** ~15 minutes

### Step 10 — Buyer access checklist
- [ ] `/auth/login` accessible
- [ ] Admin login with buyer email works
- [ ] `/admin/corridor-intelligence` loads
- [ ] `/admin/global-growth-department` loads
- [ ] `/admin/buyer-room` loads
- [ ] `GET /api/admin/growth/export` returns JSON
- [ ] `/robots.txt` → `Disallow: /admin/` present
- [ ] `/sitemap.xml` → no admin URLs
- [ ] Unauthenticated `/admin/*` → redirects to `/auth/login` (307)
- **Effort:** ~1–2 hours

---

## Total transfer time

~1–2 working days (domain propagation is the longest step).

---

## What the buyer can customise immediately

- Admin email (Step 6 above)
- Branding (logo, colours in `app/` and `public/`)
- Domain (keep corridorwork.com or redirect to new domain)
- Corridor data in `lib/corridor-intelligence.ts`
- Pricing page content

---

*Part of the CorridorWork Buyer Package. See also: [`handover-checklist.md`](./handover-checklist.md) · [`security-rls-overview.md`](./security-rls-overview.md)*
