# CorridorWork — Setup & Deployment Guide

**For the Buyer — Getting the Platform Running Under New Ownership**

---

## Overview

CorridorWork runs on:
- **GitHub** — Source code repository
- **Vercel** — Hosting and deployment
- **Supabase** — Database and authentication

The buyer sets up their own accounts for each service. No seller accounts are transferred. The seller provides the source code; the buyer connects it to their own infrastructure.

---

## Step 1: Receive the Source Code

After Escrow completion, seller transfers the GitHub repository to the buyer's GitHub account.

```bash
# Clone the repository
git clone https://github.com/<your-account>/global-talent-bridge.git
cd global-talent-bridge
```

Verify you're on the production branch:
```bash
git branch --show-current
# feature/global-talent-bridge-mvp-phase-1
```

---

## Step 2: Install Dependencies

```bash
npm install
```

Requires: **Node.js 18+** (Node.js 20 LTS recommended)

---

## Step 3: Create Your Supabase Project

1. Create an account at https://supabase.com
2. Create a new project (EU region recommended for GDPR)
3. Note down your:
   - Project URL: `https://<your-project>.supabase.co`
   - Anon (public) key
   - Service Role key (keep secret — server-only)
4. Run the database migrations in the `supabase/` directory:
   ```bash
   # Install Supabase CLI if needed
   npx supabase db push
   # Or apply migrations manually via Supabase dashboard
   ```

---

## Step 4: Configure Environment Variables

Copy the example file:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your own values (see `.env.example` for all variable names):

```
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
NEXT_PUBLIC_BASE_URL=https://<your-domain>.com
CRON_SECRET=<generate: openssl rand -hex 32>
ADMIN_EMAILS=<your-admin-email@example.com>
EMAIL_PROVIDER=none
OUTREACH_EMAIL_PROVIDER=none
```

**Important:** `.env.local` is in `.gitignore` — never commit it.

---

## Step 5: Run Quality Checks Locally

```bash
# Lint
npm run lint

# Build
npm run build

# Test
npm test
```

All should pass with 0 errors and 4596 tests green.

---

## Step 6: Connect to Vercel

1. Create an account at https://vercel.com
2. Import the GitHub repository
3. Vercel auto-detects Next.js — no framework configuration needed
4. In Vercel project settings → **Environment Variables**, add all variables from `.env.local`
5. Set the cron job secret: `CRON_SECRET=<your-value>`

Vercel will deploy automatically on every push to the connected branch.

---

## Step 7: Set Your Admin Email

In Vercel environment variables, set:
```
ADMIN_EMAILS=your@email.com
```

This controls access to the `/admin` dashboard. Only emails listed here can log in to the admin area.

---

## Step 8: Register Your Admin Account

1. Go to `https://<your-domain>/auth/register`
2. Register with the email address you set in `ADMIN_EMAILS`
3. Log in at `https://<your-domain>/auth/login`
4. Access the admin dashboard at `https://<your-domain>/admin`

---

## Step 9: Domain Transfer

Domain transfer (`corridorwork.com`) is handled separately after Escrow:

1. Escrow completes and funds clear
2. Seller initiates domain transfer (push or auth code)
3. Buyer accepts at their registrar
4. Buyer updates DNS to point to their Vercel deployment
5. Update `NEXT_PUBLIC_BASE_URL` in Vercel environment variables

**DNS settings for Vercel:**
- Add the domain in Vercel Project Settings → Domains
- Vercel provides the required DNS records (A record or CNAME)
- SSL/TLS is handled automatically by Vercel

---

## Step 10: Optional — Activate Email (Resend)

The platform ships with `EMAIL_PROVIDER=none` for safety. To activate transactional email:

1. Create account at https://resend.com
2. Add your domain and verify it
3. Generate an API key
4. Update environment variables:
   ```
   EMAIL_PROVIDER=resend
   RESEND_API_KEY=<your-resend-api-key>
   ```

---

## Step 11: Optional — Activate Payments (Stripe)

The platform does not include Stripe configuration. To add payment processing:

1. Create account at https://stripe.com
2. Create a product and pricing plan
3. Install the Stripe SDK: `npm install stripe`
4. Add Stripe keys to environment variables
5. Implement payment flows (developer work required)

---

## Verification Checklist After Setup

- [ ] `npm run build` completes without errors
- [ ] `npm test` passes (4596 tests)
- [ ] Homepage loads at your domain
- [ ] `/global/employers` form is accessible
- [ ] `/global/candidates` form is accessible
- [ ] `/admin` redirects to login when not authenticated
- [ ] Admin login works with your `ADMIN_EMAILS` address
- [ ] `/demo/sandbox` shows demo content
- [ ] `/legal/datenschutz` loads the Privacy Policy
- [ ] Domain DNS resolves correctly

---

## Development Workflow

```bash
# Start local dev server
npm run dev
# → http://localhost:3000

# Run tests in watch mode
npx vitest

# Build for production check
npm run build
```

---

*Seller provides no deployment service. This guide covers the standard setup process. For platform-specific questions during the Inspection Period, see `support-boundaries.md`.*
