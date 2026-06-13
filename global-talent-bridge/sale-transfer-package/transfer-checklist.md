# CorridorWork — Transfer Checklist

**Secure Buyer Handover Process — Step by Step**

---

## Phase 1: Before Escrow Opens

### Seller Prepares
- [ ] Verify all source code is committed and pushed (current commit: 351df82)
- [ ] Confirm `npm run build` passes (167 pages, 0 errors)
- [ ] Confirm `npm test` passes (4596 tests, 0 failures)
- [ ] Confirm `.env.local` is NOT committed (gitignored)
- [ ] Confirm no secrets, API keys or passwords are in the repository
- [ ] Confirm this transfer package is complete and accurate
- [ ] Draft purchase agreement with clear Inspection Period terms

### Buyer Due Diligence (Before Payment)
- [ ] Review `/for-buyers` on the live site
- [ ] Review `/buyer-snapshot` on the live site
- [ ] Review `/demo/sandbox` — verify technical capabilities
- [ ] Review this transfer package
- [ ] Review `docs/BUYER_DUE_DILIGENCE.md` in the repository
- [ ] Confirm understanding: 0 customers, €0 revenue, pre-revenue asset
- [ ] Confirm understanding: buyer must set up own Vercel, Supabase, domain registrar accounts
- [ ] Confirm understanding: no seller accounts, credentials or data are transferred
- [ ] Optional: Request one-time technical walkthrough call with seller

---

## Phase 2: Escrow Opens

- [ ] Buyer initiates purchase via agreed platform (e.g. BlueprintBox Escrow)
- [ ] Buyer deposits funds into Escrow
- [ ] Escrow platform notifies seller of payment receipt
- [ ] Seller receives buyer's contact details from Escrow platform

---

## Phase 3: Transfer Initiation (Within 24h of Escrow Confirmation)

### Seller Actions (Within 24 Hours)
- [ ] Seller contacts buyer via email (contact provided by Escrow platform)
- [ ] Seller confirms readiness to transfer
- [ ] Seller shares:
  - [ ] GitHub repository invite (transfer to buyer's account) OR download link
  - [ ] Link to this transfer package (already in repository)
  - [ ] Domain transfer initiation (registrar push or auth code)
  - [ ] Optional: Link to 77+ docs in `docs/` directory

### What Seller Does NOT Transfer
- [ ] No Vercel account or access
- [ ] No Supabase account, project or keys
- [ ] No database exports with real user data (GDPR)
- [ ] No email accounts or inboxes
- [ ] No Stripe account or payment credentials
- [ ] No Google Search Console access
- [ ] No `.env.local` file or any secrets

---

## Phase 4: Buyer Setup (Inspection Period)

Buyer works through `setup-and-deployment-guide.md`. Key steps:

- [ ] Clone / fork repository to buyer's GitHub account
- [ ] Create Supabase project (EU region recommended)
- [ ] Run database migrations (`supabase/` directory)
- [ ] Create Vercel project and connect GitHub repository
- [ ] Set all environment variables in Vercel (see `.env.example` for names)
- [ ] Set `ADMIN_EMAILS` to buyer's admin email
- [ ] Deploy — verify Vercel build succeeds
- [ ] Register admin account at `/auth/register`
- [ ] Verify admin dashboard accessible at `/admin`
- [ ] Test public pages: `/`, `/global/employers`, `/global/candidates`, `/demo/sandbox`
- [ ] Accept domain transfer at buyer's registrar
- [ ] Update DNS to point to buyer's Vercel deployment
- [ ] Update `NEXT_PUBLIC_BASE_URL` in Vercel to buyer's domain

---

## Phase 5: Inspection Period

Duration: as agreed (typically 14–30 days)

During Inspection Period:
- [ ] Buyer verifies all documented features work as transferred
- [ ] Buyer raises any genuine defects via agreed support channel
- [ ] Seller addresses confirmed pre-transfer defects within 5 business days
- [ ] Buyer completes their own legal/GDPR review for their jurisdiction
- [ ] Buyer updates `/legal/impressum` and `/legal/datenschutz` with their own details

---

## Phase 6: Escrow Release

- [ ] Buyer confirms acceptance (or Inspection Period ends without dispute)
- [ ] Escrow releases funds to seller
- [ ] Domain transfer confirmed complete
- [ ] Transfer officially closed

---

## Phase 7: Post-Transfer

- [ ] Seller revokes any shared repository access (if applicable)
- [ ] Buyer is sole owner of all transferred assets
- [ ] Seller support ends (unless separate paid agreement)
- [ ] Buyer operates platform independently

---

## Security Reminders Throughout Transfer

- ✅ All communication via Escrow platform or agreed secure channel
- ✅ No credentials shared via email, Slack, or other unencrypted channels
- ✅ Buyer generates their own keys for all services
- ✅ Seller's `.env.local` is never shared — buyer creates their own
- ✅ Database data is not exported — buyer starts with empty database
- ✅ Domain transfer only after Escrow confirmation

---

*This checklist is a guide — the binding terms are in the purchase agreement. Both parties should retain a copy of the signed agreement.*
