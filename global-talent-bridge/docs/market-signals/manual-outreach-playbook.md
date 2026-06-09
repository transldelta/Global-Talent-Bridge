# Manual Outreach Playbook — CorridorWork Market Signal Sprint

*Market Signal Sprint · 2026-06-09 · Admin use only*

---

## ⚠️ Absolute rules — read before any outreach

1. **No auto-send.** Every message is drafted, reviewed, and sent manually by the founder.
2. **No scraping.** All contacts are identified manually. No email extraction tools.
3. **No mass messaging.** One contact at a time. No BCC lists.
4. **No fake responses.** Every logged response must be a real, verifiable written reply.
5. **No revenue claims.** State pre-revenue status when asked.
6. **No job guarantee.** No visa guarantee. No placement guarantee.
7. **Evidence only.** If you can't show a screenshot or forward the email, it doesn't count.

---

## Step 1 — Choose a profile

Read the relevant profile document:
- [`target-buyer-profiles.md`](./target-buyer-profiles.md) — platform acquisition targets
- [`pilot-customer-profiles.md`](./pilot-customer-profiles.md) — pilot employer / organisation targets
- [`partner-profiles.md`](./partner-profiles.md) — distribution and channel partners

Pick **one** profile type per outreach session. Do not send more than 3 messages per day total.

---

## Step 2 — Find a real contact

Manually identify a real person at a real organisation. Methods:

- **LinkedIn search** — search job title + sector keywords
- **Company "About" pages** — find founders or heads of HR/partnerships
- **Industry directories** — sector-specific directories (e.g. BAMF employer lists, NHS procurement contacts)
- **Personal network** — warm introductions preferred

**What you need before sending:**
- [ ] Real name of the contact
- [ ] Their actual role title
- [ ] Organisation name
- [ ] Verified send channel (LinkedIn DM, company email, contact form)

Do **not** guess email addresses. Do **not** use "info@" addresses for cold outreach.

---

## Step 3 — Select a template

Three templates available — select by audience:

| Template ID | Audience | Use case |
|---|---|---|
| `buyer-intro` | HR-Tech SaaS, Micro-SaaS Operators, Portfolio Investors | Platform acquisition interest |
| `pilot-customer-intro` | Employers, hospitals, logistics, language schools | Pilot customer interest check |
| `partner-intro` | Recruitment agencies, relocation firms, language schools (partner track) | Distribution partnership interest |

Templates are in [`lib/market-signals.ts`](../../lib/market-signals.ts) — `OUTREACH_TEMPLATES` array.

---

## Step 4 — Personalise the message

The templates include `[CONTACT_NAME]`, `[ORGANISATION]`, `[SPECIFIC_CONTEXT]` placeholders. Before sending:

1. Replace `[CONTACT_NAME]` with their actual first name
2. Replace `[ORGANISATION]` with their organisation name
3. Replace `[SPECIFIC_CONTEXT]` with **one specific, real reason** why you're reaching out to them specifically
   - e.g. "I noticed you recently posted about international nursing shortages" 
   - e.g. "Your firm appears on the BAMF approved employer list for skilled worker immigration"
   - e.g. "You mentioned on LinkedIn that you're building corridor-specific recruiting capacity"

Do **not** fabricate context. If you can't find a specific, real reason — wait until you can.

---

## Step 5 — Review before sending

Before hitting send, check:

- [ ] Pre-revenue status is stated honestly or can be stated if asked
- [ ] No MRR claims
- [ ] No customer claims
- [ ] No placement guarantee
- [ ] No job guarantee
- [ ] No visa guarantee
- [ ] Message is personalised, not copy-paste
- [ ] You have reviewed and approved this specific message
- [ ] You know how to respond if they ask "how many customers do you have?"

**Answer to "how many customers do you have?"**:
> "CorridorWork is pre-revenue — zero paying customers currently. I'm reaching out to identify whether organisations like yours would be interested in a pilot or in acquiring the platform. No fake traction, no inflated numbers — just an honest conversation about fit."

---

## Step 6 — Send manually

Send via the identified channel. Do not forward to any automation tool. Do not schedule through any tool.

---

## Step 7 — Log the interaction

Open [`response-evidence-log-template.md`](./response-evidence-log-template.md) and create a new entry immediately after sending.

Fields to fill:
- `date` — YYYY-MM-DD
- `contactType` — `buyer | pilot-customer | partner`
- `organization` — organisation name
- `contactPerson` — first name or role if name unknown
- `channel` — `linkedin-dm | email | contact-form | warm-intro`
- `sentManually` — must always be `true`
- `responseReceived` — `false` initially; update when response arrives
- `interestLevel` — leave blank until response
- `notes` — what you said, what they said

---

## Step 8 — Follow up (if no response after 7 days)

One follow-up only. Same template, no new claim. Shorter message:

> "Hi [Name] — just following up on my message from [date]. Happy to share the full buyer package or jump on a quick call if this is relevant. No pressure either way."

If no response after follow-up — move on. Do not chase.

---

## How outreach results affect platform value

| Signal | What it proves | Value tier |
|---|---|---|
| 0 responses | No market signal yet | Tier 1 (€15K–€25K) |
| 1–2 written responses showing interest | Minimal early signal | Moving toward Tier 2 |
| 3+ written responses + follow-up calls | Documented buyer/partner interest | Tier 2 (€30K–€50K) |
| 1 signed LOI or pilot agreement | Real market validation | Approaching Tier 3 |
| First paying customer | MRR-based valuation begins | Tier 3 (€50K–€69K+) |

**None of these tiers are automatic or guaranteed.** They require real, documented proof — not intentions or informal conversations.

---

## What to share with interested contacts

If someone responds with genuine interest and asks for more information, you can share:

- [ ] The `/for-buyers` public page URL: `corridorwork.com/for-buyers`
- [ ] The executive summary from `docs/buyer-package/executive-summary.md`
- [ ] The corridor intelligence overview (exported as PDF from admin)
- [ ] The technical architecture doc `docs/buyer-package/technical-architecture.md`

Do **not** share:
- ❌ Admin panel access
- ❌ Database credentials
- ❌ Supabase URL or keys
- ❌ Any personal data from the DB

---

## Frequently asked questions

**"Why should I trust a pre-revenue platform?"**
> CorridorWork has €0 MRR but a production-ready codebase: 4 477 green tests, zero TypeScript errors, live on Vercel, and a structured buyer package. The value is the infrastructure — not traction. Think of it as buying a purpose-built building with no tenants yet.

**"Why is it for sale?"**
> The founder is prioritising other projects. The platform is transfer-ready and well-documented. A buyer or operator with existing distribution can activate it faster than building from scratch.

**"Can you guarantee results after I buy it?"**
> No. No revenue guarantee. No placement guarantee. No growth guarantee. Asset-stage purchase — buyer takes on operational responsibility.

---

*Part of the CorridorWork Market Signal Sprint. See also: [`target-buyer-profiles.md`](./target-buyer-profiles.md) · [`response-evidence-log-template.md`](./response-evidence-log-template.md)*
