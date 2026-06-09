# Handover Checklist — CorridorWork Buyer Package

*Zero-Cost Buyer Package Sprint · 2026-06-09*

---

## Before handover — seller actions

- [ ] Confirm escrow funds received and held
- [ ] Prepare all `.env.example` values (actual values) securely
- [ ] Verify current Vercel deployment is READY
- [ ] Verify all 4 352 tests are green locally
- [ ] Confirm GitHub repo is clean (no uncommitted work-in-progress)
- [ ] Document any known issues or quirks (none currently)

---

## Asset handover sequence

Transfer in this order (each is independent):

| Step | Asset | Action | Time |
|---|---|---|---|
| 1 | GitHub repository | Settings → Transfer → buyer GitHub username | 5 min |
| 2 | Vercel project | Dashboard → Settings → Transfer Project | 10 min |
| 3 | Supabase project | Dashboard → Settings → Transfer Project | 10 min |
| 4 | Domain | Registrar → unlock + EPP code | 2–48 hrs |
| 5 | Environment variables | Secure file share (1Password, encrypted) | 15 min |

---

## Credentials handover

Deliver securely (not via email plaintext):

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` *(rotate immediately after receipt)*
- [ ] `ADMIN_EMAIL` *(buyer will change to their own)*
- [ ] Any additional vars in `.env.example`
- [ ] Domain registrar login details (or EPP code)

---

## Buyer verification checklist (buyer confirms these)

### Infrastructure
- [ ] GitHub repo transferred and cloned successfully
- [ ] Vercel project transferred — deployment triggers from buyer's GitHub
- [ ] Supabase project transferred — buyer can log in to Supabase dashboard
- [ ] Domain DNS resolving to buyer's Vercel project

### Admin access
- [ ] Login at `/auth/login` with buyer admin email works
- [ ] `/admin/corridor-intelligence` loads — 8 corridors visible
- [ ] `/admin/global-growth-department` loads — pipeline visible
- [ ] `/admin/buyer-room` loads — sale readiness score visible
- [ ] `/admin/market-proof-launch` loads — 3 campaigns visible
- [ ] Unauthenticated `/admin/corridor-intelligence` → 307 redirect ✅

### Public product
- [ ] corridorwork.com homepage loads
- [ ] Employer intake form submits to Supabase
- [ ] Candidate interest form submits to Supabase
- [ ] Partner intake form submits to Supabase
- [ ] `/robots.txt` → `Disallow: /admin/` present
- [ ] `/sitemap.xml` → no admin URLs

### Code quality (run locally)
- [ ] `npm install` — no errors
- [ ] `npm test` — 4 352 tests passing, 0 failures
- [ ] `npx tsc --noEmit` — 0 TypeScript errors
- [ ] `npm run build` — clean, 163 pages

### Security (run post-transfer)
- [ ] RLS active on all Supabase tables (SQL query confirms)
- [ ] Anon key cannot read `growth_targets` (test returns empty)
- [ ] All credentials rotated (Supabase keys regenerated)
- [ ] New secrets applied in Vercel environment variables
- [ ] Fresh Vercel deploy triggered after rotation

---

## Optional handover call (1 hour)

Recommended: schedule a 1-hour walkthrough call after technical transfer is complete.

**Suggested agenda:**
1. Admin tools walkthrough (15 min) — Corridor Intelligence, Growth Dept, Contact Copilot
2. Buyer Room walkthrough (10 min) — sale readiness, transfer checklist, honest gaps
3. Growth Department live demo (10 min) — how to add targets, run batch planner, approval queue
4. Q&A on codebase (20 min)
5. Next steps for commercial activation (5 min)

---

## Post-handover — buyer owns

After the checklist is complete and escrow releases payment:

- [ ] Seller retains **no access** to GitHub, Vercel, Supabase, or domain
- [ ] Seller has provided all documentation and conducted any agreed walkthrough call
- [ ] Buyer is fully independent operator

---

*Part of the CorridorWork Buyer Package. See also: [`deployment-transfer-checklist.md`](./deployment-transfer-checklist.md) · [`security-rls-overview.md`](./security-rls-overview.md)*
