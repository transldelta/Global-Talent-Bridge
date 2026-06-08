# ⚡ Fast Sale Plan — CorridorWork (7 Days)

*Final Sales Launch Preparation · 2026-06-08*

> Concrete plan for executing the sale in 7 days from launch.
> All actions are manual. No automatic sending. No scraping. No fake proof.

---

## Pre-condition: Before Day 1

- [x] Buyer Room complete (`/admin/buyer-room`)
- [x] Sale Listing Draft ready (`docs/SALE_LISTING_DRAFT.md`)
- [x] Buyer Outreach Messages ready (`docs/BUYER_OUTREACH_MESSAGES.md`)
- [x] Buyer Q&A ready (`docs/BUYER_QA.md`)
- [x] Data Room Index ready (`docs/SALE_DATA_ROOM_INDEX.md`)
- [x] Market Proof Launch structured (`/admin/market-proof-launch`)
- [x] 4 258 tests green, build clean, Vercel READY

---

## Tag 1 — Listing finalisieren / Day 1: Finalise Listing

**Goal:** Listing is live on at least one marketplace or shared with first 3 contacts.

**Actions:**
- [ ] Read `docs/SALE_LISTING_DRAFT.md` — confirm all [placeholders] are replaced
- [ ] Create account on Acquire.com (or MicroAcquire / Flippa if preferred)
- [ ] Submit listing using content from `SALE_LISTING_DRAFT.md`
- [ ] Set price: €49 000–€79 000 (or equivalent in platform currency)
- [ ] Mark listing as "private" or "unlisted" initially if preferred — share URL directly with contacts
- [ ] Optional: Post teaser on LinkedIn / Indie Hackers (use Acquisition Teaser from `/admin/market-proof-launch` → Tab F)

**Deliverable:** Listing URL ready to share.

---

## Tag 2 — 20 Käuferkandidaten vorbereiten / Day 2: Prepare 20 Buyer Candidates

**Goal:** 20 real buyer candidates identified and listed in Buyer Target List.

**Actions:**
- [ ] Open `/admin/market-proof-launch` → Tab C (Targets) — review Campaign C (buyer candidates)
- [ ] Open `docs/BUYER_TARGET_LIST_TEMPLATE.md` — copy template into private spreadsheet / Notion
- [ ] Research 20 real buyer candidates manually:
  - 6–8 recruiting agency owners (Germany, UK, Netherlands)
  - 4–5 relocation companies
  - 4–5 HR-tech founders
  - 2–3 micro-SaaS buyers (Acquire.com, Indie Hackers)
  - 2 language/training group owners
- [ ] For each: record name, company, country, contact channel, reason fit
- [ ] No PII in the repository — keep in private spreadsheet only
- [ ] Set status: `identified` for all 20

**Deliverable:** Private spreadsheet with 20 identified buyer candidates.

---

## Tag 3 — 5–10 Käufer manuell anschreiben / Day 3: Contact 5–10 Buyers Manually

**Goal:** First 5–10 buyer candidates contacted. Messages sent manually, one at a time.

**Actions:**
- [ ] Open `docs/BUYER_OUTREACH_MESSAGES.md` — select the right template for each buyer type
- [ ] Personalise each message: replace [Company], adjust context
- [ ] Send via LinkedIn DM or email — **manually, one at a time**
- [ ] After each send: update target status to `sent` in spreadsheet
- [ ] Do NOT use bulk sending tools
- [ ] Do NOT send more than 10 messages in one day — quality over volume

**Deliverable:** 5–10 messages sent, all tracked in spreadsheet.

⚠️ No automatic sending. No bulk messaging. Every message personally reviewed before sending.

---

## Tag 4 — Market-Proof-Kontakte senden / Day 4: Market Proof Outreach

**Goal:** First 10–15 market validation contacts (language schools, recruiting agencies) contacted.

**Actions:**
- [ ] Open `/admin/market-proof-launch` → Tab B (Campaigns) — select Campaign A (Germany Healthcare)
- [ ] Open `/admin/contact-copilot` — prepare 10 drafts for language schools / nursing schools
- [ ] For each draft: review, personalise, open Gmail, send manually
- [ ] Update status in Growth Department after each send
- [ ] Open `/admin/market-proof-launch` → Tab D (Reply Tracker) — update `sentManually` count

**Deliverable:** 10–15 market validation messages sent, tracker updated.

---

## Tag 5 — Antworten dokumentieren / Day 5: Document Replies

**Goal:** All replies received by Day 5 classified and documented.

**Actions:**
- [ ] For each buyer reply: update status in spreadsheet (`replied`, `interested`)
- [ ] For each market proof reply: go to `/admin/market-proof-launch` → Tab D — update tracker
- [ ] Classify each reply using Tab E (Classification Guide)
- [ ] For high-value replies (positive_interest, buyer_interest): toggle buyer-visible
- [ ] Anonymise any reply before marking buyer-visible (remove names, companies, emails)
- [ ] Update proof notes in Tab D
- [ ] If no replies yet: continue sending — Day 3–4 outreach often has 2–3 day lag

**Deliverable:** All replies classified and documented. Tracker updated.

---

## Tag 6 — Buyer Demo vorbereiten / Day 6: Prepare Buyer Demo

**Goal:** Buyer demo ready for any interested buyer who requests it.

**Actions:**
- [ ] Read `docs/BUYER_DEMO_SCRIPT.md` — review all 10 steps
- [ ] Verify all demo URLs are live:
  - corridorwork.com
  - /admin/corridor-intelligence
  - /admin/global-growth-department
  - /admin/buyer-room
  - /admin/contact-copilot
  - /admin/market-proof-launch
- [ ] Create a temporary demo-access admin account (Supabase → Auth → Add user)
- [ ] Test the demo account: login → all 6 tabs accessible
- [ ] For interested buyers: share demo access link (not full admin credentials)
- [ ] Prepare 3-sentence written summary of current market proof (from Tab G export)
- [ ] Update `/admin/buyer-room` proof state if new replies received

**Deliverable:** Demo access ready. Demo script reviewed. Written proof summary available.

---

## Tag 7 — Verhandlungen starten / Day 7: Start Negotiations

**Goal:** At least one buyer in active discussion. Price and terms being explored.

**Actions:**
- [ ] Review all replies received since Day 3
- [ ] For any buyer who expressed interest: send follow-up with Buyer Room access
- [ ] Share `docs/SALE_DATA_ROOM_INDEX.md` with interested buyers
- [ ] For any buyer who requested due diligence: share access to relevant docs
- [ ] Assess: is the current ask (€49 000–€79 000) matching buyer expectations?
- [ ] If negotiations start: request written LOI or term sheet (no handshake deals)
- [ ] If no buyers yet: continue outreach — extend plan by 7 days, increase volume

**Deliverable:** At least one buyer in written discussion, or clear signal on price/fit.

---

## Success Criteria

| Day | Minimum | Good | Excellent |
|---|---|---|---|
| Day 1 | Listing draft finalised | Listing submitted to marketplace | Listing live + 3 direct contacts |
| Day 2 | 10 buyers identified | 20 buyers identified | 20 buyers + 5 already researched |
| Day 3 | 5 messages sent | 10 messages sent | 10 messages + 2 replies |
| Day 4 | 5 market proof sends | 15 market proof sends | 15 sends + 3 replies |
| Day 5 | Replies tracked | Replies classified | Buyer-visible proof ready |
| Day 6 | Demo script reviewed | Demo account created | Demo delivered to 1 buyer |
| Day 7 | 1 buyer interested | 1 buyer in discussion | Term sheet / LOI received |

---

## If Nothing Happens in 7 Days

That is normal for asset-stage acquisitions. Adjust and continue:

- Extend outreach volume (increase to 30–50 buyers contacted)
- Try different channels (Acquire.com listing, Indie Hackers post, broker)
- Wait for market proof (1–3 real replies significantly increase buyer confidence)
- Adjust ask if price is a consistent blocker
- Consider broker engagement for wider reach

There is no deadline. The platform is running. The cost of waiting is near zero.

---

⚠️ **Safety constraints — always active:**  
No automatic sending · No scraping · No fake customers · No fake revenue ·  
No job guarantee · No visa guarantee · No Stripe activation

---

*Related: [`SALE_LISTING_DRAFT.md`](./SALE_LISTING_DRAFT.md) · [`BUYER_OUTREACH_MESSAGES.md`](./BUYER_OUTREACH_MESSAGES.md) · [`BUYER_QA.md`](./BUYER_QA.md) · [`SALE_DATA_ROOM_INDEX.md`](./SALE_DATA_ROOM_INDEX.md)*
