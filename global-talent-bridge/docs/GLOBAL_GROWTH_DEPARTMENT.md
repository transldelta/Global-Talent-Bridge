# CorridorWork — Global Growth Department

**Version:** 1.0 · June 2026
**Admin tool:** https://corridorwork.com/admin/global-growth-department

---

## Goal

The Global Growth Department prepares outreach at scale — worldwide, across multiple markets and corridors — while keeping the human in control of every send. The system does the operational preparation; the user reviews and approves.

No automatic sending. No scraping. No mass email. Manual approval required at every step.

---

## The Five Departments

### 1. CEO Growth Control
Displays the global summary dashboard: total targets, statuses, corridor overview, and next safe action. The CEO sees at a glance what has been prepared and what is waiting for approval.

### 2. Employer Market Agent
Prepares employer targets in destination markets (Germany/DACH, UK, Canada, Australia, Gulf, Netherlands, France, Spain, Portugal, USA) across sectors (Healthcare, IT, Engineering, Skilled Trades, Logistics, Hospitality, Construction).

Uses Batch Target Planner: enter country + sector + count → system generates N template targets with status `real_contact_needed`. The user then finds real companies via Search Playbook and fills in the data.

### 3. Candidate Source Agent
Prepares organisations in source markets (Morocco, Tunisia, Egypt, India, Philippines, Pakistan, Nigeria, Ghana, Kenya, Turkey, Latin America, Eastern Europe) that can direct candidates to `/global/candidates`.

**Never direct outreach to individual candidates.** Only approach organisations, admins, community partners, or training providers.

### 4. Partner Channel Agent
Prepares recruiting agencies, relocation partners, training providers, language schools, employer associations, and strategic buyer candidates. Goal: cooperation, pilot feedback, white-label, or acquisition discussion.

### 5. Approval Queue
All prepared targets land here. The user reviews each one, updates with real contact data if needed, generates a Gmail draft or copies the message, and manually approves before sending.

---

## Global Corridor Strategy

Pre-defined corridors optimise which source markets match which destination markets:

| Corridor | Risk | Best first contact |
|---|---|---|
| Morocco / Tunisia → DACH / France / Spain | Low | Language school |
| India → UK / Canada / Australia / Gulf | Low | University / Career centre |
| Philippines → Germany / Canada / Gulf | Low | Candidate source |
| Nigeria / Ghana / Kenya → UK / Canada / Germany | Medium | Recruiting agency |
| Turkey → DACH / EU | Low | Language school |
| Latin America → Spain / Portugal / Canada | Low | University / Career centre |
| Eastern Europe → Germany / Netherlands / UK | Low | Recruiting agency |
| Egypt / Pakistan → Gulf / UK / Canada | Medium | University / Career centre |

---

## How to Prepare 20–50 Targets per Market

1. Go to the relevant Agent tab (Employer / Candidate / Partner)
2. Set country, sector, message type, and count (max 50)
3. Click "Add N targets to Approval Queue"
4. Switch to Approval Queue tab
5. Use Search Playbook links to open Google/LinkedIn searches in your browser
6. Find real company names and contact details manually
7. Update each target card with the real data
8. The message is already generated — review it
9. Use Gmail draft or copy message to prepare send

---

## How Quick Add Works

Paste up to 50 lines in this format:
```
Company name | email@example.com | Country | Sector | https://website.com
```

Example:
```
Sprache & Beruf GmbH | info@sb.de | Germany | Language training | https://sb.de
VFBB Speyer | info@vfbb.de | Germany | Healthcare | https://vfbb.de
```

The system parses each line, generates a message, and adds targets to the Approval Queue with status `draft_prepared`. No automatic sending.

---

## How Gmail Draft Works

For each target with an email address, click **"Open Gmail draft in browser"**. This opens:
```
https://mail.google.com/mail/?view=cm&fs=1&to=EMAIL&su=SUBJECT&body=BODY
```

Gmail opens with the recipient, subject, and message pre-filled. **The user must click Send in Gmail themselves.** Nothing is sent automatically. No Gmail API is used.

---

## How Contact Form Autofill Works

For targets without email but with a contact form:
1. Open the target's contact form page in your browser
2. Copy the autofill snippet from the target card
3. Paste it into the browser console (F12 → Console)
4. The snippet fills visible form fields and highlights them in purple
5. **It never submits the form and never clicks any button**
6. Take a screenshot, review it, then click Submit yourself

---

## How Candidate Sources Are Built (Inbound-First)

CorridorWork never directly contacts individual candidates. Instead:
1. Approach organisations (language schools, training providers, universities, diaspora associations)
2. Ask them to direct interested candidates to `corridorwork.com/global/candidates`
3. Candidates register their interest voluntarily — no fee, no obligation
4. The platform captures their sector, experience, language level
5. Matching happens when employer demand is also registered

This is inbound-first: candidates come to us, not the other way around.

---

## How the User Reviews and Approves

1. Open Approval Queue
2. Expand any target card
3. Read the generated message
4. Update status: `needs_review` → `screenshot_review` → `approved_to_send`
5. Open Gmail draft or copy message
6. Send manually from your own inbox or LinkedIn
7. Update status to `sent_manually`
8. Record replies as `replied`

---

## Why No Automatic Mass Email

1. **Anti-spam law (UWG §7, DE)** — unsolicited automated bulk email is illegal without consent
2. **Quality** — mass automation bypasses the review that prevents mistakes
3. **Deliverability** — mass cold email gets flagged as spam, destroying reputation
4. **Brand integrity** — CorridorWork's value proposition is human-reviewed, structured, and trustworthy. Automated blasting contradicts this entirely
5. **GDPR** — bulk collection and automated sending of personal data requires legal basis

One reviewed, approved, personally sent email is worth more than 1,000 automated messages.

---

## Non-Negotiable Rules

- No automatic outreach — ever
- Manual approval required before every send
- No scraping or automated data collection
- No job guarantee
- No visa guarantee
- No candidate fees
- No Stripe without legal setup
- No calls or meetings required — written reply by email only
- All messages signed: CorridorWork Team
- Screenshot review before any manual send

---

*CorridorWork · Operated by Delta Translation, Karlsruhe*
