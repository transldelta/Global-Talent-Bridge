# Red Lines — CorridorWork Sale Process

*Sale Process · Buyer Response Kit · Admin use only*

---

These are absolute rules that apply during the entire sale process.
They exist to protect you legally, financially, and reputationally.

No exception. No "just this once."

---

## 1. Do not promise revenue

**Never say:**
- "You can expect €X MRR within 6 months"
- "Comparable platforms earn €X / month"
- "With your network this will monetise quickly"
- "Revenue potential is €X–€Y"

**Why:** Any revenue promise that turns out to be wrong is a misrepresentation.
CorridorWork has €0 MRR. State that clearly and let the buyer make their own assessment.

**Safe version:**
> "CorridorWork is pre-revenue. I cannot predict or guarantee future revenue."

---

## 2. Do not promise customers

**Never say:**
- "There are X interested organisations ready to sign"
- "I have warm leads ready for you"
- "Customers are already waiting"

**Why:** If no customers exist, claiming otherwise is fraud. The buyer Q&A is clear:
0 paying customers, 0 signed agreements.

**Safe version:**
> "There are no paying customers and no signed agreements. Market Signal Sprint profiles
> identify target buyer and pilot customer types — none have been contacted yet."

---

## 3. Do not promise jobs, visas, or placements

**Never say:**
- "The platform will help candidates get jobs in Germany"
- "Employers will be able to place X candidates per month"
- "The visa success rate is X%"

**Why:** CorridorWork is a corridor intelligence tool. It does not place candidates,
process visas, or guarantee employment outcomes. Any such claim is false.

---

## 4. Do not share passwords or API keys before escrow payment

**Never share:**
- Supabase connection string or service role key
- Vercel API token
- GitHub repository write access
- Admin panel login credentials (email + password)
- Any .env file contents

**Before escrow payment:** Read-only documentation and read-only GitHub access only.
**After escrow payment confirmed:** Full transfer of all credentials per handover checklist.

**Why:** Once credentials are shared, there is no way to undo that. A buyer who receives
credentials before paying could extract everything and not complete the purchase.

---

## 5. Use escrow for any serious sale

**Minimum process:**
1. Buyer makes written offer
2. Seller accepts in writing
3. Both parties agree on escrow service (e.g. Escrow.com, Acquire.com built-in escrow)
4. Buyer initiates escrow payment
5. Escrow confirms payment received and held
6. Seller begins transfer: domain → GitHub → Vercel → Supabase
7. Buyer confirms receipt of all assets
8. Escrow releases payment to seller

**Never accept:**
- Wire transfer before transfer begins (no protection if buyer disappears)
- Crypto payment without escrow (irreversible if things go wrong)
- "I'll pay the second half after 30 days" without legal agreement
- PayPal (chargeable by buyer after transfer)

---

## 6. Use written questions for technical accuracy

**Why:** Answering technical questions verbally in a call increases the risk of
mis-stating something under pressure. Written questions and written answers create
a record and give you time to be accurate.

**Recommended response to "can we jump on a call?":**
> "Happy to answer technical questions in writing first to make sure I give you accurate
> information. If you still want a call after that, we can arrange one."

**In any call:** do not share your screen in a way that exposes credentials, the Supabase
dashboard, or any admin page with real data visible.

---

## 7. Do not accept off-platform risky payment

If the sale originates on Acquire.com, SideProjectors, or another marketplace:
use their built-in process. Do not move the transaction off-platform to avoid fees
unless you have independent legal protection in place.

Off-platform payments:
- Remove the platform's buyer/seller protection
- Leave no neutral record of the agreement
- Create more risk than the platform fee is worth

---

## Summary checklist

Before finalising any sale:

- [ ] Price stated in writing as asset-based, not revenue-multiple
- [ ] Pre-revenue status stated clearly in every written communication
- [ ] No revenue, customer, job, visa, or placement promises made
- [ ] No credentials shared before escrow payment confirmed
- [ ] Written offer and written acceptance on record
- [ ] Escrow service agreed and payment initiated before transfer starts
- [ ] Full transfer checklist completed and verified

---

*Part of the CorridorWork Buyer Response Kit. See also: [`buyer-first-reply.md`](./buyer-first-reply.md) · [`buyer-question-answer-bank.md`](./buyer-question-answer-bank.md)*
