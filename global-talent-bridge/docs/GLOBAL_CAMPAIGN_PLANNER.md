# Global Campaign Planner — CorridorWork

> Status: Prepared Only · No campaigns live · No paid ads · No budget spent

## Overview

The Global Campaign Planner (`/admin/global-campaign-planner`) is an **admin-only** tool for preparing future inbound campaigns. No campaign is live. No ad budget is active. No Google API is connected.

---

## What It Is

A structured planning tool that:
- Shows top corridors by opportunity score
- Shows top skill segments by revenue potential
- Shows top employer/candidate segments
- Drafts 5 audience-specific campaigns (prepared, not live)
- Displays all 21 skill segments with revenue scores

---

## Campaign Drafts (Status as of Sprint)

| # | Title | Target | Status |
|---|-------|--------|--------|
| 1 | Philippines Healthcare Pipeline | Healthcare employers EU/US/AU | prepared |
| 2 | India Tech Corridor | IT employers globally | prepared |
| 3 | Morocco → Germany Construction | German construction employers | needs_approval |
| 4 | Pakistan Gulf Pipeline | Gulf region construction | needs_approval |
| 5 | Global Recruiting Agency Partners | Recruiting agencies worldwide | blocked_until_budget_and_legal_review |

---

## Activation Requirements

Before any campaign can go live, the following must be completed:

1. **Budget approved** — no ad budget allocated yet
2. **Legal review** — GDPR-compliant ad targeting review
3. **Landing page review** — ensure no misleading claims
4. **Consent banner** — cookie consent for tracking pixels
5. **Compliance sign-off** — no job/visa guarantees in ad copy

---

## Technical Architecture

```
Admin visits /admin/global-campaign-planner
         ↓
Page reads TALENT_CATEGORIES (lib/talent-categories.ts)
         ↓
Shows static campaign drafts
         ↓
NO external API calls
NO Google Ads API
NO Meta API
NO budget spend
```

---

## What's NOT Here

- ❌ No "Start Campaign" button
- ❌ No Google Ads API connection
- ❌ No Meta/Facebook API
- ❌ No budget management
- ❌ No tracking pixel activation
- ❌ No automated A/B testing

---

## Skill Segments Available

All 21 talent categories from `lib/talent-categories.ts` are available as audience segments:

Healthcare, IT, Engineering, Construction, Logistics, Manufacturing, Hospitality, Finance, Education, Legal, Agriculture, Retail, Maritime, Aviation, Energy, Automotive, Mining, Architecture, Science, Security, Skilled Trades.

---

## How to Use (When Ready)

1. Admin reviews campaign drafts in `/admin/global-campaign-planner`
2. Admin selects target corridor and skill segment
3. Admin manually creates campaign in Google Ads / Meta Ads console
4. Admin links to corresponding CorridorWork landing page
5. Monitor inbound leads in `/admin/global-revenue-control`

No automation. Manual process only. Full admin control at every step.
