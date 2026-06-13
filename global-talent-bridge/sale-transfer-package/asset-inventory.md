# CorridorWork — Asset Inventory

**Date:** June 2026  
**Commit:** 351df82 (Sale-Ready, verified)

---

## Included Assets

### 1. Domain
| Item | Detail |
|---|---|
| Domain | corridorwork.com |
| Registrar | To be disclosed to buyer after Escrow confirmation |
| Transfer method | Domain push or auth code — after Escrow completion |
| Status | Active, live, publicly resolving |

### 2. Source Code
| Item | Detail |
|---|---|
| Repository | GitHub (private) — transferred to buyer's GitHub account |
| Framework | Next.js 14 App Router |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS 3.x |
| Tests | Vitest — 4596 tests, 0 failing |
| Branch | `feature/global-talent-bridge-mvp-phase-1` (production branch) |

### 3. Public Website — 167 Built Pages
Public-facing pages include:

**Core:**
- `/` — Homepage
- `/about` — About page
- `/contact` — Contact form
- `/pricing` — Pricing page

**Audience paths:**
- `/global/employers` — Employer intake form
- `/global/candidates` — Candidate interest form
- `/for-employers` — Employer marketing page
- `/for-candidates` — Candidate marketing page
- `/partners` — Partner programme page
- `/strategic-partnership` — Strategic partnership form

**Revenue paths:**
- `/pilot/employers` — Employer pilot intake
- `/pilot/agencies` — Agency partner intake
- `/market-intelligence` — Market intelligence lead form
- `/launch` — Launch overview

**Platform demo:**
- `/demo/sandbox` — Full platform capabilities demo (synthetic data only)
- `/buyer-snapshot` — Buyer-facing platform snapshot

**SEO network:**
- `/corridors/` — 15+ corridor SEO pages
- `/industries/` — 5 industry sector pages
- `/solutions/` — Solutions pages

**Legal:**
- `/legal/datenschutz` — Privacy Policy (German, GDPR)
- `/legal/impressum` — Legal Notice / Imprint
- `/legal/agb` — Terms of Service
- `/legal/privacy` → redirect to `/legal/datenschutz`
- `/legal/notice` → redirect to `/legal/impressum`
- `/legal/terms` → redirect to `/legal/agb`

**Admin (protected, login required):**
- `/admin/buyer-readiness`
- `/admin/revenue-inbox`
- `/admin/revenue-accelerator`
- `/admin/cwo-command-center`
- `/admin/distribution-pack`
- `/admin/seo-indexing-control`
- `/admin/autonomous-worklog`

### 4. Buyer Documentation (docs/ directory)
77+ Markdown documents covering:
- Buyer due diligence
- Transfer checklist
- Technical architecture
- Security and RLS summary
- Commercial readiness
- Business model
- Revenue paths
- SEO strategy
- Pilot playbooks

### 5. Brand & Design Assets
| Item | Location |
|---|---|
| Marketplace screenshots | `public/images/marketplace/` |
| Hero images | `public/images/home/`, `public/images/global/` |
| Favicon / logo assets | `public/` |
| OG image | `public/og-image.png` |
| Design references | `docs/design/` |

### 6. Infrastructure (Setup Guidance Included)
| Item | Detail |
|---|---|
| Vercel deployment | Buyer creates own Vercel account and connects GitHub repo |
| Supabase database | Buyer creates own Supabase project (EU region recommended) |
| Domain | Transferred via registrar after Escrow |
| Cron job | `/api/cron/cwo-daily-runner` — daily at 06:00 UTC |

---

## Excluded Assets

### Accounts (Seller Retains All)
| Item | Status |
|---|---|
| Seller's Vercel account | ❌ Not transferred |
| Seller's Supabase account | ❌ Not transferred — buyer creates own |
| Seller's domain registrar account | ❌ Not transferred |
| Seller's GitHub account | ❌ Repo transferred, not account |
| Seller's email accounts | ❌ Not transferred |
| Google Search Console access | ❌ Buyer sets up own |
| Google Analytics | ❌ Not configured in platform |

### Credentials (Never Transferred)
| Item | Status |
|---|---|
| Supabase Service Role Key | ❌ Buyer generates own |
| Supabase Anon Key | ❌ Buyer generates own |
| Vercel API token | ❌ Buyer uses own account |
| CRON_SECRET | ❌ Buyer generates own |
| RESEND_API_KEY (if any) | ❌ Buyer provides own |
| ADMIN_EMAILS | ❌ Buyer sets own admin email |
| Any `.env.local` file | ❌ Never committed, never transferred |

### Data (Protected by GDPR)
| Item | Status |
|---|---|
| Real candidate profiles | ❌ Not transferred (GDPR) |
| Real employer submissions | ❌ Not transferred (GDPR) |
| Real lead data from forms | ❌ Not transferred (GDPR) |
| Seller's personal contact list | ❌ Not included |

### Business Assets
| Item | Status |
|---|---|
| Paying customers | ❌ 0 customers exist |
| Revenue contracts | ❌ 0 contracts exist |
| Partner agreements | ❌ No formal agreements |
| Ongoing operations | ❌ Not included |
| Social media accounts | ❌ None exist for CorridorWork |
| Marketing assets beyond repo | ❌ Not included |

---

*All listed assets are transferred only after successful Escrow completion and according to the transfer-checklist.md process.*
