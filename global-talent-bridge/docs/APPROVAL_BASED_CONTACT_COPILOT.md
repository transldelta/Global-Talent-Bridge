# CorridorWork — Approval-Based Contact Copilot

**Version:** 1.0 · June 2026
**Admin tool:** https://corridorwork.com/admin/contact-copilot

---

## Goal

Prepare outreach contacts, generate professional messages, and make it as easy as possible for the user to send a message manually — without any automation, scraping, or automatic sending.

The Contact Copilot does **all the preparation**. The user does **one manual action**: clicking Send themselves.

---

## How the User Works (No Programming Required)

1. Open `/admin/contact-copilot`
2. Select the target route (language school, recruiting agency, etc.)
3. Enter the company name and any contact details you found manually (from LinkedIn, Google, a website)
4. The system generates a professional German B2B message automatically
5. Review the message in Step 3
6. Choose how to send in Step 4:
   - **Copy message** — paste manually into LinkedIn or a form
   - **Open mail draft** — clicks a mailto: link that opens your email programme
   - **Contact Form Autofill Helper** — paste a snippet into the browser console to fill a form
7. Work through the approval checklist in Step 5
8. Send manually yourself — only after all checks are done

---

## What Is Automatically Prepared

| What | How |
|---|---|
| Professional B2B message | Generated from route + target data |
| Email subject line | Generated per route |
| mailto: link | Pre-fills recipient, subject, body in email programme |
| Autofill snippet | JavaScript that fills form fields (not submits) |
| Individual copy buttons | Per field: name, email, subject, message |
| Approval checklist | 9 items to verify before sending |

---

## What Never Happens Automatically

| Never | Why |
|---|---|
| Automatic email sending | EMAIL_PROVIDER=none; system has no sending capability |
| Automatic LinkedIn message | No LinkedIn API integration |
| Automatic WhatsApp | No WhatsApp Business API |
| Automatic form submission | Autofill snippet explicitly excludes submit() |
| Scraping of contact data | User enters all data manually |
| Google search | No API calls to search engines |
| Mass outreach | Tool prepares one contact at a time |
| Sending without approval | Checklist must be completed first |

---

## Why No Automatic Sending

1. **Legal compliance** — Unsolicited automated email is governed by anti-spam law (UWG §7 in Germany). Manual, targeted, personal outreach is clearly permitted.

2. **Quality control** — Every message should be read before sending. Automated sending bypasses this entirely.

3. **Reputation protection** — A single wrong automated email to the wrong person causes more damage than 10 manually reviewed messages.

4. **Platform integrity** — CorridorWork's value proposition includes being non-automated and human-reviewed. The outreach must match the product.

---

## Why No Scraping

- Scraping violates the terms of service of most websites and databases
- Scraped data quality is low and often outdated
- Data collected without consent creates GDPR exposure
- The first pilot contact should be a genuine, researched connection — not a scraped email address

---

## Screenshot Approval Process

Before sending via a contact form:

1. Open the contact form in your browser
2. Paste the autofill snippet in the browser console
3. The fields will be highlighted in purple — **do not click Send yet**
4. Take a screenshot of the filled form — **Review before sending**
5. Review the screenshot: is everything correct?
6. Come back to the approval checklist and check all 9 items
7. Only then: go back to the form and click Send manually

---

## Manual Send Only Rule

Every outreach from CorridorWork is sent by a human, from a human account:
- LinkedIn messages: sent from your own LinkedIn profile
- Emails: sent from your own inbox (transl.delta@gmail.com)
- Contact forms: submitted by you in your own browser

The Contact Copilot prepares the content. You execute the send.

---

## Data Protection / Spam Protection

- Only one contact prepared at a time
- No bulk lists, no CSV imports
- No automated follow-ups
- Contacts found by the user through manual research (LinkedIn, website, Google)
- All messages signed: CorridorWork Team (no personal name misrepresented)
- No fake identity, no impersonation
- GDPR note: data entered in the tool is not persisted to any database — it exists only in the current browser session

---

## Contact Status Workflow

```
draft_prepared
      ↓
awaiting_review       ← user reads message in Step 3
      ↓
screenshot_sent       ← user took screenshot for approval
      ↓
approved              ← checklist complete
      ↓
sent_manually         ← user clicked Send themselves
      ↓
replied / rejected
```

---

## Related Tools

| Tool | URL |
|---|---|
| Contact Copilot | `/admin/contact-copilot` |
| Pilot Target Strategy | `/admin/pilot-targets` |
| First Pilot Assistant | `/admin/first-pilot` |
| Revenue Inbox | `/admin/revenue-inbox` |

---

*CorridorWork · Operated by Delta Translation, Karlsruhe*
*No job guarantee · No visa guarantee · No automatic outreach · No scraping*
