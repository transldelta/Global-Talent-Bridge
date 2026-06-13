# CorridorWork — Customisation Guide

**For Buyers — Safe Surface-Level Changes**

---

## Overview

This guide covers safe surface-level customisations that a buyer can make after taking ownership. These are UI/text/branding changes that do not require modifying business logic, auth systems, database schemas or security layers.

**Rule:** If in doubt about a change — especially anything involving auth, database, API routes, middleware, or payment — consult a qualified Next.js developer before making changes.

---

## 1. Brand Name / Product Name

The platform name "CorridorWork" appears in:

| File | Location |
|---|---|
| `app/_components/PublicNavBar.tsx` | Nav brand text |
| `app/_components/PublicFooter.tsx` | Footer brand text |
| `app/layout.tsx` | Root metadata title template |
| `app/page.tsx` | Homepage H1, eyebrow |
| Individual page metadata | `metadata.title` in each `page.tsx` |
| `public/` | favicon, og-image (image files) |

**How to change:**
1. Use find-and-replace across `app/` for `CorridorWork`
2. Update image files in `public/` (favicon, OG image)
3. Run `npm run build` to verify no broken references

---

## 2. Logo / Favicon

| Asset | Location |
|---|---|
| Favicon (ico) | `public/favicon.ico` |
| OG Image | `public/og-image.png` (1200×630) |
| Apple touch icon | `public/apple-touch-icon.png` (if present) |

Replace files in `public/` with your own versions. Keep the same filenames or update the references in `app/layout.tsx`.

---

## 3. Colours

The design system uses **Tailwind CSS**. The primary colours are:

| Role | Tailwind Class | Usage |
|---|---|---|
| Primary CTA | `bg-indigo-600` | Employer buttons |
| Candidate CTA | `bg-emerald-600` / `bg-emerald-700` | Candidate buttons |
| Partner CTA | `bg-amber-700` | Partner buttons |
| Dark background | `bg-slate-950` | Page backgrounds |
| Card background | `bg-slate-900` | Cards, sections |
| Border | `border-slate-800` / `border-slate-700` | Borders |

To change primary colour globally, search and replace `indigo-600` → your chosen Tailwind colour across `app/`.

For custom colours not in Tailwind's palette, extend `tailwind.config.ts`:
```ts
theme: {
  extend: {
    colors: {
      brand: '#your-hex-color',
    },
  },
},
```

---

## 4. Page Text / Copy

All public-facing text is hardcoded in the page files (no CMS). To change:

- Open the relevant `app/[page]/page.tsx`
- Edit the JSX text directly
- Run `npm run build` to verify

**Key pages for text changes:**
| Page | File |
|---|---|
| Homepage | `app/page.tsx` |
| Employer intake | `app/global/employers/page.tsx` |
| Candidate interest | `app/global/candidates/page.tsx` |
| Partners | `app/partners/page.tsx` |
| About | `app/about/page.tsx` |
| Pricing | `app/pricing/page.tsx` |

---

## 5. SEO Metadata

Each page has a `metadata` export at the top:

```ts
export const metadata: Metadata = {
  title: 'Page Title — CorridorWork',
  description: 'Page description for search engines.',
  openGraph: { ... },
}
```

Update `title` and `description` for each page you want to customise.

The root metadata template is in `app/layout.tsx`:
```ts
export const metadata: Metadata = {
  title: {
    template: '%s | CorridorWork',
    default: 'CorridorWork',
  },
}
```

---

## 6. Public Page Structure

To add, remove or reorder sections on a public page:
- Open the page file
- Add/remove JSX sections
- Keep the `<PublicNavBar />` and `<PublicFooter />` at top/bottom

**Do not remove compliance disclaimers** — they protect against misleading claims.

---

## 7. Footer Links

Footer links are in `app/_components/PublicFooter.tsx`. Edit the link lists directly.

---

## 8. Navigation Links

Desktop and mobile nav are in:
- `app/_components/PublicNavBar.tsx` — desktop nav links
- `app/_components/MobileNavMenu.tsx` — mobile hamburger menu

---

## 9. Legal Pages

Legal pages (`/legal/datenschutz`, `/legal/impressum`, `/legal/agb`) are in `app/legal/`.

**Important:** The Privacy Policy and Impressum contain the seller's personal details. **The buyer must update these with their own details** and consult a lawyer to ensure compliance with applicable law (GDPR and local regulations).

---

## What NOT to Change Without a Developer

The following require careful developer review before changes:

| Area | Risk |
|---|---|
| `middleware.ts` | Auth protection — changes could expose admin routes |
| `lib/supabase/` | Database connections — changes could break auth or data access |
| `app/actions.ts` | Server Actions — form handling and DB writes |
| `app/auth/` | Authentication flows — incorrect changes lock users out |
| `app/admin/` | Admin dashboard — connected to database queries |
| `supabase/` migrations | Schema changes — may break existing functionality |
| `lib/revenue-leads.ts` | Lead capture logic — safety invariants enforced here |
| `vercel.json` | Cron schedule and build config |
| `next.config.js` | Redirect rules and build config |
| Any `/api/` routes | Server-side API endpoints |

---

## After Any Changes

Always run:

```bash
npm run lint    # 0 errors expected
npm run build   # 167 pages, 0 errors expected
npm test        # 4596 tests expected passing
```

---

*Seller provides no customisation service. All customisations are the buyer's responsibility. Seller makes no warranty for modified versions of the platform.*
