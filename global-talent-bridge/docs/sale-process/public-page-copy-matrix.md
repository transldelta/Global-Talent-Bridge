# Public Page Copy Matrix — CorridorWork

**Date:** 2026-06-09
**Purpose:** Per-page risk matrix for marketplace sale readiness

---

| Page | Main claim | Revenue words | Customer/traction words | Video link | Admin link | Status |
|------|-----------|---------------|------------------------|------------|------------|--------|
| `/` (Homepage) | "Connect employer demand with qualified international talent." | None | None | None (removed) | None | CLEAN |
| `/for-buyers` | "CorridorWork is available for acquisition." | "Revenue (MRR): €0 · Pre-revenue asset stage" (honest zero) | "Paying customers: 0" (honest zero) | None | None | CLEAN |
| `/for-employers` | Employer intake for international workforce interest | None | None | None | None | CLEAN |
| `/for-candidates` | Candidate interest form — consent-based | None | None | None | None | CLEAN |
| `/partners` | "Partner with a global talent corridor platform." | None | None | None | None | CLEAN |
| `/demo/sandbox` | Demo with synthetic data, clear disclaimer banner | "Revenue Paths: 4" (capability label, not real revenue) | "Echte Kunden (0)" in disclaimer | None | None | CLEAN |
| `/buyer-snapshot` | Platform snapshot — 2-minute overview | "No active revenue contracts (pilot stage)" | "No fabricated metrics" | None | None | CLEAN |
| `/promo-video` | Internal visual preview — noindex, nofollow | None | None | Self (internal page only, no inbound links) | None | INTERNAL ONLY |
| `/strategic-partnership` | "Explore a strategic partnership with CorridorWork." | "No revenue promises or projections" | None | None | None | CLEAN |
| `/demo` | How CorridorWork works | None | "No real personal data" disclaimer | None | None | CLEAN |
| `/launch` | CorridorWork is live | None | None | None | None | CLEAN |
| `/contact` | Contact form | None | None | None | None | CLEAN |
| `/sitemap.xml` | Machine-readable sitemap | None | None | /promo-video NOT listed (removed) | None | CLEAN |
| `/robots.txt` | Crawler rules | None | None | None | None — /admin/ disallowed | CLEAN |

---

## Notes

**Revenue words that are acceptable:** Any mention of "€0", "pre-revenue", "no active revenue contracts", "no MRR multiple" — these are honest disclosures, not fake claims.

**Revenue words that would be risky (not found):** Specific MRR figures, ARR projections, "X paying customers", traction claims, growth rate claims.

**Customer/traction words that are acceptable:** "Paying customers: 0", "no active revenue contracts", "no customer traction claimed".

**Customer/traction words that would be risky (not found):** Named customers, customer logos, case studies claiming revenue, "X companies use CorridorWork".

**Video link policy:** `/promo-video` has no inbound public links. The page itself is noindex/nofollow and not in the sitemap. It exists as an internal preview only.

**Admin link policy:** No public page links to `/admin`, `/candidate/dashboard`, or `/employer/dashboard`. The PublicNavBar and PublicFooter have been verified to contain no admin links.

---

## Files verified clean (no promo-video links, no fake claims)

- `app/page.tsx` — Homepage
- `app/for-buyers/page.tsx` — For Buyers
- `app/_components/PublicFooter.tsx` — Shared footer
- `app/_components/PublicNavBar.tsx` — Shared nav
- `app/buyer-snapshot/page.tsx` — Buyer Snapshot
- `app/demo/sandbox/page.tsx` — Demo Sandbox
- `app/partners/page.tsx` — Partners
- `app/sitemap.ts` — Sitemap
- `public/robots.txt` — Robots
- `app/promo-video/page.tsx` — Internal preview (noindex, no public links)
