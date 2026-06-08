# CorridorWork — First Pilot Employer Playbook

**Version:** 1.0 · June 2026
**Status:** Active · Phase 1 Pilot
**Admin tool:** https://corridorwork.com/admin/first-pilot

---

## Goal of the First Pilot

The first pilot employer is not about revenue — it is about validation.

The goal is to get one real employer to:
1. Submit a workforce demand
2. Review matching results
3. Give honest feedback on what works and what does not

**One pilot employer, reviewed manually, is worth more than 100 untested signups.**

---

## Commercial & Legal Readiness — Honest State

| Status | Value |
|---|---|
| Pilot-ready | ✅ yes |
| Inbound-ready | ✅ yes |
| Payment-ready | ❌ no |
| Legal review needed before paid placement | ⚠️ yes |
| Automatic outreach | ❌ off |
| Candidate fee active | ❌ no |
| Job guarantee | ❌ never |
| Visa guarantee | ❌ never |
| Stripe active | ❌ no |
| Email sending | ❌ none (EMAIL_PROVIDER=none) |

No fake metrics. No fake revenue. No fake traction.

---

## Which Employers Are a Good Fit

A pilot employer should have **all or most** of the following:

1. **Genuine workforce demand** — a real, specific hiring need, not theoretical
2. **Clear sector and role** — can name the industry and job title they need
3. **Open to international candidates** — willing to consider relocation or cross-border hiring
4. **Reachable contact person** — a named HR manager or decision-maker
5. **Accepts manual process** — understands there is no automated matching or instant placement
6. **No guarantees expected** — does not expect job, visa, or placement guarantees
7. **Realistic scope** — open to starting with 1–2 roles, not expecting mass placement

### Examples of Good Pilot Employer Types

- A mid-sized engineering or manufacturing company with open technical roles
- A healthcare operator needing nursing or care staff across borders
- An IT company needing software developers with specific tech stacks
- A logistics firm with recurring driver or warehouse operator needs

---

## Which Employers Are Not a Good Fit

Decline or refer to partner track if:

| Red Flag | Why |
|---|---|
| Requesting job guarantee | We cannot guarantee employment outcomes |
| Requesting visa guarantee | We do not offer visa or immigration services |
| Requesting candidate fees | Candidate fees are not permitted |
| Expecting mass placement | Our model is structured, not bulk |
| Unverifiable company | No address, no registration, no contact name |
| Legally ambiguous request | AÜG (temp staffing) territory — requires legal review first |
| Pressure for automated outreach | Against current policy; EMAIL_PROVIDER=none |

---

## What Remains Manual — Always

The following steps will **never** be automated without explicit legal and operational setup:

- Reviewing employer submissions
- Assessing employer fit
- Contacting employers or candidates
- Sending any communication
- Progressing to commercial terms

---

## What Is Automatically Prepared (Without Sending)

The `/admin/first-pilot` tool generates the following — but sends nothing:

- Outreach templates (WhatsApp, LinkedIn, Email) for the admin to copy and send manually
- Response drafts for inbound leads (good fit, unclear, legal risk, partner alternative)
- Pilot qualification checklist

---

## Pilot Process — Step by Step

```
1. Employer submits workforce demand via /global/employers
      ↓
2. Admin receives lead notification (check /admin/revenue-inbox or /admin/leads)
      ↓
3. Admin reviews submission manually using the qualification criteria above
      ↓
4. Admin assigns informal fit score: Good fit / Needs clarification / Not suitable / Partner alternative
      ↓
5. If information is missing → admin copies the "Needs clarification" draft and sends manually
      ↓
6. If good fit → admin copies the "Good fit" draft and sends manually
      ↓
7. Employer registers via https://corridorwork.com/auth/register?role=employer
      ↓
8. Admin guides employer through setup: profile → job listing → matching review
      ↓
9. Feedback call scheduled manually
      ↓
10. Only then: assess whether commercial or legal next steps are warranted
```

No step is automated. No email is sent by the system. No guarantee is made at any point.

---

## Response Drafts — When to Use Which

All drafts are available in `/admin/first-pilot` → "Copy-ready Response Drafts" section.
All are in English. All are signed `CorridorWork Team`.

| Draft | When to use |
|---|---|
| **Good fit** | Employer has a real need, clear sector, open to process |
| **Needs clarification** | Missing role, sector, or contact; unclear scope |
| **Legal risk** | Requests guarantee, visa service, or AÜG arrangement |
| **Partner alternative** | Employer is an agency, staffing firm, or B2B platform |

---

## Legal Boundaries — Non-Negotiable

CorridorWork does **not**:

- Guarantee employment for any candidate
- Guarantee visa processing or immigration outcomes
- Charge candidate fees of any kind
- Provide temporary staffing services (AÜG) without a valid licence
- Operate as a placement agency without appropriate legal setup
- Send automated emails or outreach messages

Any employer expecting the above must be declined or referred to legal review before proceeding.

---

## Fastest Safe Path to First Pilot Discussion

1. Identify one employer with a **real, specific** workforce demand
2. Use `/admin/first-pilot` to prepare a personal outreach (WhatsApp or LinkedIn, 1–2 sentences)
3. Send manually — no automation
4. If they respond positively: guide them to `corridorwork.com/auth/register?role=employer`
5. Support them through setup (15 minutes of your time)
6. Ask for a 30-minute feedback call
7. Document what works and what does not
8. That is a successful first pilot

**No payment. No guarantee. No legal risk. Just learning.**

---

## References

- Admin tool: `/admin/first-pilot`
- Inbound leads: `/admin/revenue-inbox` · `/admin/leads`
- Employer intake: `/global/employers`
- Candidate intake: `/global/candidates`
- Partner enquiries: `/partners`
- Commercial readiness: `docs/COMMERCIAL_READINESS_SUMMARY.md`
- Pilot readiness: `docs/PILOT_READINESS.md`
- Legal readiness: `docs/LEGAL_READINESS_REVENUE_LEADS.md`

---

*CorridorWork · Operated by Delta Translation, Karlsruhe*
*No job guarantee · No visa guarantee · No automatic outreach · No Stripe*
