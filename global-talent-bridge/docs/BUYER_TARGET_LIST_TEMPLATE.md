# 🎯 Buyer Target List Template — CorridorWork

*Sprint: Market Proof & Buyer Launch · 2026-06-08*

> Template for tracking potential buyers and market validation contacts.
> Copy this template into a spreadsheet or Notion table.
> Do not store real contact data in the repository.

---

## Template Fields

| Field | Description | Example values |
|---|---|---|
| `id` | Unique identifier | b001, b002, m001 |
| `buyer_type` | Category of contact | recruiting_agency_owner, relocation_company, hrtech_founder, staffing_agency_owner, microsaas_buyer, language_school_network |
| `company_or_person` | Company name or person name | [Manually researched — not stored here] |
| `country` | Country of contact | Germany, UK, Netherlands, UAE |
| `reason_fit` | Why this buyer is a good fit | "Operates Germany healthcare corridor", "HR-tech background + international staffing" |
| `contact_channel` | How to reach them | linkedin, email, broker_form, forum |
| `status` | Current status | identified, researching, draft_ready, sent, replied, interested, in_discussion, declined |
| `notes` | Internal notes | Anonymised — no PII in shared docs |
| `buyer_interest_level` | Signal strength | none, low, medium, high, confirmed |
| `last_contact_date` | Date of last interaction | 2026-06-15 |
| `next_action` | What to do next | Send intro DM, Follow up on reply, Schedule demo call |
| `reply_classification` | Classification of reply | positive_interest, wants_more_info, neutral_feedback, rejected, buyer_interest |

---

## Example Rows (fictional — template only)

| id | buyer_type | company | country | reason_fit | channel | status | interest | next_action |
|---|---|---|---|---|---|---|---|---|
| b001 | recruiting_agency_owner | [Research needed] | Germany | DE healthcare corridor match | linkedin | identified | none | Find and DM |
| b002 | hrtech_founder | [Research needed] | UK | International staffing focus | email | identified | none | Find contact |
| b003 | microsaas_buyer | [Research needed] | Various | Active SaaS acquirer | broker_form | identified | none | List on Acquire.com |
| b004 | relocation_company | [Research needed] | Germany | DACH corridor relocation | linkedin | identified | none | Find and DM |
| m001 | language_school | [Research needed] | Morocco | German language school → DE | email | identified | none | Find contact email |

---

## Status Progression

```
identified → researching → draft_ready → sent → replied → interested → in_discussion → (closed / declined)
```

---

## Buyer Interest Levels

| Level | Meaning |
|---|---|
| `none` | No contact yet |
| `low` | Opened / read but no reply |
| `medium` | Replied with questions or neutral feedback |
| `high` | Expressed clear interest in product or acquisition |
| `confirmed` | LOI or term sheet received |

---

## Channels

| Channel | Notes |
|---|---|
| `linkedin` | DM via LinkedIn — use buyer DM template |
| `email` | Direct email — use buyer email template |
| `broker_form` | Acquire.com, MicroAcquire, or similar marketplace |
| `forum` | Indie Hackers, Hacker News, or SaaS community posts |

---

## Privacy Notes

- Do not store real names, email addresses, or phone numbers in the repository
- Keep PII in a private spreadsheet or Notion database (not git-committed)
- Anonymise all buyer feedback before including in the Buyer Room proof export
- If a contact asks to be removed, delete their entry immediately

---

## How to Use

1. Copy this template into Google Sheets, Notion, or Airtable
2. Add one row per buyer candidate or market validation target
3. Research contact details manually (LinkedIn, company website, Google)
4. Set initial status to `identified`
5. Use `/admin/market-proof-launch` → Tab F for outreach templates
6. Update status after each interaction
7. For market proof contacts: update reply tracker in Tab D
8. For buyer contacts: track separately from market proof contacts

---

## Buyer Type Definitions

| Type | Description |
|---|---|
| `recruiting_agency_owner` | Owner/MD of an international recruiting agency |
| `relocation_company` | Relocation management firm with international workforce clients |
| `hrtech_founder` | Founder of an HR-tech SaaS company |
| `staffing_agency_owner` | Owner of a staffing agency with international corridors |
| `microsaas_buyer` | Serial acquirer of micro-SaaS businesses |
| `language_school_network` | Owner of a language school network with international placement |

---

*Related: [`SALE_LISTING_DRAFT.md`](./SALE_LISTING_DRAFT.md) · [`VALUATION_ARGUMENT.md`](./VALUATION_ARGUMENT.md) · `/admin/market-proof-launch`*
