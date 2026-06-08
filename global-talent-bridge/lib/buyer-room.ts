/**
 * lib/buyer-room.ts
 *
 * Buyer Room — structured data for the /admin/buyer-room sell-ready package.
 *
 * ⚠️  All data is honest. No fake revenue. No fake customers. No guaranteed
 *     valuation. No automatic send. No Stripe active.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SaleReadinessCriterion {
  key:        string
  label:      string
  score:      number   // 0–100
  rationale:  string
  canImprove: string
}

export interface AssetItem {
  id:       string
  category: string
  label:    string
  detail:   string
  status:   'ready' | 'partial' | 'not-active'
}

export interface TransferStep {
  order:  number
  label:  string
  detail: string
  effort: 'minutes' | 'hours' | 'days'
}

export interface MonetizationOption {
  id:          string
  label:       string
  revenueType: string
  effort:      'low' | 'medium' | 'high'
  readiness:   'ready-to-activate' | 'needs-sales-step' | 'strategic-long-term'
  note:        string
}

export interface HonestGap {
  label:    string
  detail:   string
  severity: 'info' | 'caution' | 'blocker'
}

// ── Sale Readiness Score ──────────────────────────────────────────────────────

export const SALE_READINESS_CRITERIA: SaleReadinessCriterion[] = [
  {
    key:        'product',
    label:      'Product completeness',
    score:      84,
    rationale:  'Public website live. Employer, candidate and partner intake working. Admin system with 10+ tools. Corridor Intelligence with 8 corridors. Global Growth Department with Supabase persistence.',
    canImprove: 'Add first real employer response. Add demo video walkthrough.',
  },
  {
    key:        'technical',
    label:      'Technical quality',
    score:      93,
    rationale:  'TypeScript strict (0 errors). ESLint clean (0 warnings). Next.js build clean. 4 112 tests green. Supabase EU-Frankfurt (GDPR). Vercel serverless. RLS active on all tables.',
    canImprove: 'Add E2E tests (Playwright). Improve test coverage on edge cases.',
  },
  {
    key:        'transfer',
    label:      'Transfer readiness',
    score:      82,
    rationale:  'Supabase project transferable. Vercel project transferable. GitHub repo transferable. Domain transferable. All env vars in .env.example. JSON pipeline export at /api/admin/growth/export. docs/TRANSFER_GUIDE.md complete.',
    canImprove: 'Create a buyer-facing handover walkthrough recording.',
  },
  {
    key:        'differentiation',
    label:      'Differentiation',
    score:      79,
    rationale:  '8 global talent corridors with Buyer Opportunity Scores. Approval-based growth pipeline (not a job board). Three-sided market: employer + candidate source + partner. No direct competitor at this intersection.',
    canImprove: 'Validate corridor approach with 1–3 real market participants.',
  },
  {
    key:        'compliance',
    label:      'Compliance posture',
    score:      91,
    rationale:  'No automatic send (DB CHECK constraint). No scraping. No Stripe active. No candidate fees. No job guarantee. No visa guarantee. RLS active. GDPR-compliant hosting (EU-Frankfurt). Robots.txt blocks /admin. Sitemap has no admin URLs.',
    canImprove: 'Commission independent legal review of recruitment intermediary rules before paid placement.',
  },
  {
    key:        'documentation',
    label:      'Documentation',
    score:      83,
    rationale:  '50+ docs in /docs. Architecture, security, transfer, monetization, buyer value, demo script, asset inventory all documented. CLAUDE.md and AGENTS.md for developer onboarding.',
    canImprove: 'Add video walkthrough. Simplify docs index for non-technical buyer.',
  },
  {
    key:        'market_proof',
    label:      'Market proof',
    score:      8,
    rationale:  'No real employer replies yet. No signed LOIs. No pilot partner confirmed. Platform is live and intake forms are active — but zero validated inbound responses at time of writing.',
    canImprove: 'Send 20–50 manual reviewed outreach messages. Collect 1–3 written replies. Use Growth Department batch planner.',
  },
  {
    key:        'revenue_proof',
    label:      'Revenue proof',
    score:      5,
    rationale:  'No paying customers. No MRR. Stripe not active. Platform has multiple monetization paths ready to activate but none are live.',
    canImprove: 'Activate one employer pilot package (one-time fee). Even one €500 invoice raises this score significantly.',
  },
]

export function calculateSaleReadinessScore(): number {
  const total = SALE_READINESS_CRITERIA.reduce((s, c) => s + c.score, 0)
  return Math.round(total / SALE_READINESS_CRITERIA.length)
}

export function saleReadinessBand(score: number): {
  label: string
  color: 'green' | 'yellow' | 'red'
  summary: string
} {
  if (score >= 70) return {
    label:   'Sell-ready (asset stage)',
    color:   'green',
    summary: 'Strong technical and product foundation. Honest gaps on market proof. Ready for buyer conversations at asset-stage pricing.',
  }
  if (score >= 50) return {
    label:   'Near sell-ready',
    color:   'yellow',
    summary: 'Good foundation but key gaps remain. Not yet ready for premium pricing without additional validation.',
  }
  return {
    label:   'Pre-sale preparation needed',
    color:   'red',
    summary: 'Significant gaps need closing before buyer conversations.',
  }
}

// ── Executive Summary ─────────────────────────────────────────────────────────

export const EXECUTIVE_SUMMARY = [
  'CorridorWork is a global talent corridor intelligence and approval-based growth platform for the international recruitment market.',
  'It serves three market sides: employers seeking international talent, candidate sources (language schools, universities, training providers), and partner channels (recruiting agencies, relocation firms).',
  'The platform provides structured Buyer Opportunity Scores for 8 global talent corridors, a persistent Supabase-backed approval queue, and a full admin toolset — all without automatic sending, scraping, or candidate fees.',
  'The codebase is TypeScript-strict, fully tested (4 112 green tests), and hosted on Vercel (auto-deploy) with Supabase (EU-Frankfurt, GDPR-compliant, RLS active).',
  'The asset is transfer-ready: Supabase transferable, Vercel transferable, GitHub transferable, domain transferable, all documentation and env vars complete.',
]

// ── What the buyer gets ───────────────────────────────────────────────────────

export const BUYER_ASSETS: AssetItem[] = [
  // Infrastructure
  { id: 'domain',     category: 'Infrastructure', label: 'Domain — corridorwork.com',           detail: 'Registered and live. Transferable via registrar.',              status: 'ready' },
  { id: 'github',     category: 'Infrastructure', label: 'GitHub Repository',                   detail: 'Full history, clean commits. Transfer via GitHub Settings.',     status: 'ready' },
  { id: 'vercel',     category: 'Infrastructure', label: 'Vercel Project',                      detail: 'Auto-deploy from GitHub. Serverless. Transfer via Vercel.',      status: 'ready' },
  { id: 'supabase',   category: 'Infrastructure', label: 'Supabase Project',                    detail: 'PostgreSQL 17, EU-Frankfurt, RLS active. Transfer via Supabase.', status: 'ready' },
  // Product
  { id: 'website',    category: 'Product',        label: 'Public Website (corridorwork.com)',   detail: '30+ pages, SEO-optimised, industry and corridor landing pages.',   status: 'ready' },
  { id: 'employer',   category: 'Product',        label: 'Employer Intake System',              detail: '/global/employers — structured demand intake with DB persistence.', status: 'ready' },
  { id: 'candidate',  category: 'Product',        label: 'Candidate Interest System',           detail: '/global/candidates — voluntary, consent-based, no fees.',         status: 'ready' },
  { id: 'partner',    category: 'Product',        label: 'Partner Intake (4 tracks)',           detail: '/partners + /strategic-partnership — agencies, relocation, language schools, strategic.', status: 'ready' },
  { id: 'demo',       category: 'Product',        label: 'Demo Page + Sandbox',                 detail: '/demo and /demo/sandbox — buyer-facing demonstration.',            status: 'ready' },
  // Admin
  { id: 'admin',      category: 'Admin System',   label: 'Admin Control Areas (10+)',           detail: 'CEO dashboard, corridor intelligence, growth department, contact copilot, buyer readiness, exit readiness, revenue tools.', status: 'ready' },
  { id: 'corridor',   category: 'Admin System',   label: 'Corridor Intelligence Engine',        detail: '8 corridors with Buyer Opportunity Scores, 3 demo deepdives, monetization map, buyer value layer.', status: 'ready' },
  { id: 'growth',     category: 'Admin System',   label: 'Global Growth Department',            detail: 'Supabase-backed target pipeline. Quick Add, Batch Planner, Approval Queue (9 stages).', status: 'ready' },
  { id: 'copilot',    category: 'Admin System',   label: 'Contact Copilot',                     detail: 'Gmail Draft integration (no API). Form Autofill Helper. No auto-send.', status: 'ready' },
  { id: 'pilot',      category: 'Admin System',   label: 'First Pilot System',                  detail: 'Pilot target finder, execution tracker, launch tools.',            status: 'ready' },
  // Data
  { id: 'pipeline',   category: 'Data',           label: 'Persistent Growth Pipeline (DB)',     detail: 'growth_targets + growth_messages tables. RLS. no_auto_send CHECK constraint.', status: 'ready' },
  { id: 'export',     category: 'Data',           label: 'Data Export API',                     detail: '/api/admin/growth/export — full JSON pipeline export.',            status: 'ready' },
  // Docs & Code
  { id: 'docs',       category: 'Documentation',  label: '50+ Documentation Files',             detail: 'Architecture, security, transfer, monetization, buyer value, demo script.', status: 'ready' },
  { id: 'tests',      category: 'Code Quality',   label: '4 112 Tests (Vitest)',                detail: 'All green. CI-ready. TypeScript strict. ESLint clean.',            status: 'ready' },
  // Not yet active
  { id: 'stripe',     category: 'Revenue',        label: 'Stripe Integration',                  detail: 'NOT active. Architecture supports it. Activation is a buyer decision.', status: 'not-active' },
  { id: 'customers',  category: 'Revenue',        label: 'Paying Customers',                    detail: 'None yet. Platform is live but no commercial transactions completed.', status: 'not-active' },
]

// ── Differentiation ───────────────────────────────────────────────────────────

export const DIFFERENTIATION_POINTS = [
  {
    label:   'Not a job board',
    detail:  'CorridorWork does not list individual job vacancies. It structures talent corridors — matching labour market demand patterns across countries and sectors.',
  },
  {
    label:   'Not a standard ATS',
    detail:  'No applicant tracking for individual CVs at scale. No mass processing. Operates at the market-intelligence and partner-channel level.',
  },
  {
    label:   'Not a classic recruiter tool',
    detail:  'No individual recruiter workflow. The platform enables corridor-level strategy: which markets, which sectors, which partner channels, in what order.',
  },
  {
    label:   'Global Corridor Intelligence',
    detail:  '8 corridors scored across 7 criteria: employer demand, candidate supply, partner availability, speed to pilot, revenue potential, compliance simplicity, buyer attractiveness.',
  },
  {
    label:   'Three-sided market architecture',
    detail:  'Employer side (demand intake) + Candidate source side (language schools, universities, training providers) + Partner channel side (agencies, relocation, strategic). All three active.',
  },
  {
    label:   'Approval-based growth',
    detail:  'Every outreach action goes through a manual approval queue. No automated emails. No automated submissions. Compliance-safe from day one.',
  },
  {
    label:   'Persistent Supabase pipeline',
    detail:  'All growth targets, messages, and pipeline state live in a GDPR-compliant EU PostgreSQL database — not in spreadsheets or local files.',
  },
  {
    label:   'Transfer-ready by design',
    detail:  'Domain, Supabase, Vercel, and GitHub are all independently transferable. Buyer does not need the seller\'s accounts to operate the platform.',
  },
]

// ── Technical proof ───────────────────────────────────────────────────────────

export const TECHNICAL_PROOF_ITEMS: { label: string; value: string; status: 'pass' | 'info' }[] = [
  { label: 'Tests passing',              value: '4 112 / 4 112',          status: 'pass' },
  { label: 'Test files',                 value: '45 / 45',                status: 'pass' },
  { label: 'TypeScript errors',          value: '0',                      status: 'pass' },
  { label: 'ESLint warnings/errors',     value: '0',                      status: 'pass' },
  { label: 'Next.js build',             value: '✓ Compiled successfully', status: 'pass' },
  { label: 'Static pages generated',    value: '161 / 161',               status: 'pass' },
  { label: 'Vercel deployment state',   value: 'READY (production)',      status: 'pass' },
  { label: 'Supabase project',          value: 'EU-Frankfurt (GDPR)',     status: 'pass' },
  { label: 'RLS active on DB tables',   value: 'Yes — all tables',        status: 'pass' },
  { label: 'Public admin links',        value: 'None',                    status: 'pass' },
  { label: 'Robots.txt blocks /admin',  value: 'Disallow: /admin/',       status: 'pass' },
  { label: 'Sitemap admin URLs',        value: '0',                       status: 'pass' },
  { label: '/admin/* redirect (no auth)', value: 'HTTP 307 → /auth/login', status: 'pass' },
  { label: 'no_auto_send DB constraint', value: 'CHECK constraint active', status: 'pass' },
]

// ── Honest gaps ───────────────────────────────────────────────────────────────

export const HONEST_GAPS: HonestGap[] = [
  {
    label:    'No paying customers yet',
    detail:   'Zero commercial transactions. No MRR. No ARR. No invoice issued.',
    severity: 'caution',
  },
  {
    label:    'No MRR yet',
    detail:   'Monthly recurring revenue is €0. Stripe is not active.',
    severity: 'caution',
  },
  {
    label:    'Stripe not active',
    detail:   'Payment infrastructure is not connected. Activation is a post-sale or buyer decision.',
    severity: 'info',
  },
  {
    label:    'No automated outreach',
    detail:   'All outreach is manual and approval-gated by design. No outreach pipeline has been executed yet.',
    severity: 'info',
  },
  {
    label:    'Market validation still needed',
    detail:   'The corridor strategy and buyer opportunity scores are based on publicly available market knowledge. They are not validated by a commissioned market study or live customer feedback.',
    severity: 'caution',
  },
  {
    label:    'Legal review needed before paid placement',
    detail:   'Operating as a recruitment intermediary across multiple jurisdictions requires legal review. The platform architecture supports compliance — but specific legal clearance is the buyer\'s responsibility.',
    severity: 'caution',
  },
  {
    label:    'First pilot still pending',
    detail:   'No pilot employer, agency, or partner has been formally activated. The pilot infrastructure is built and ready.',
    severity: 'caution',
  },
  {
    label:    'Test data ≠ market proof',
    detail:   'Existing test data in the platform is synthetic. It demonstrates system functionality, not real market demand.',
    severity: 'info',
  },
]

// ── Market proof plan ─────────────────────────────────────────────────────────

export const MARKET_PROOF_PLAN = [
  'Prepare 20–50 outreach targets via Global Growth Department batch planner (by corridor, sector, country)',
  'Send only manually reviewed messages — via Gmail draft or contact form helper',
  'Collect 1–3 written replies from real employers, agencies, or language schools',
  'Use reply content as corridor validation data',
  'Document replies (anonymised if needed) as market proof for buyer conversations',
  'No fake testimonials. No invented case studies. No staged responses.',
]

// ── Transfer checklist ────────────────────────────────────────────────────────

export const TRANSFER_STEPS: TransferStep[] = [
  { order: 1,  label: 'GitHub repository transfer',      detail: 'Settings → Transfer Repository. Buyer creates GitHub account/org if needed.',   effort: 'minutes' },
  { order: 2,  label: 'Vercel project transfer',         detail: 'Vercel Dashboard → Settings → Transfer Project to buyer team.',                  effort: 'minutes' },
  { order: 3,  label: 'Supabase project transfer',       detail: 'Supabase Dashboard → Settings → Transfer Project. Buyer needs Supabase account.', effort: 'minutes' },
  { order: 4,  label: 'Domain transfer',                 detail: 'Transfer corridorwork.com via domain registrar. Buyer updates DNS.',              effort: 'hours'   },
  { order: 5,  label: 'ENV variables handover',          detail: 'All variables documented in .env.example. Securely share actual values.',         effort: 'minutes' },
  { order: 6,  label: 'Admin email configuration',       detail: 'Update ADMIN_EMAIL in env to buyer admin email. Redeploy.',                       effort: 'minutes' },
  { order: 7,  label: 'Secrets rotation',                detail: 'Buyer rotates: Supabase service role key, JWT secret, any API keys.',             effort: 'hours'   },
  { order: 8,  label: 'RLS policy verification',         detail: 'Confirm RLS policies active post-transfer. Test with anon key — should fail.',    effort: 'hours'   },
  { order: 9,  label: 'Deployment verification',         detail: 'Trigger a fresh Vercel deploy. Confirm all 161 pages build successfully.',        effort: 'minutes' },
  { order: 10, label: 'Buyer access checklist',          detail: 'Admin login works. Growth pipeline visible. Data export returns pipeline JSON.',   effort: 'hours'   },
]

// ── Monetization options ──────────────────────────────────────────────────────

export const MONETIZATION_OPTIONS: MonetizationOption[] = [
  { id: 'employer_pilot',      label: 'Employer pilot package',                    revenueType: 'one-time',   effort: 'low',    readiness: 'ready-to-activate',        note: 'Fastest to activate. No infrastructure changes needed.' },
  { id: 'partner_intelligence',label: 'Partner intelligence package',              revenueType: 'recurring',  effort: 'low',    readiness: 'ready-to-activate',        note: 'Intelligence-as-a-Service. No placement operations required.' },
  { id: 'saas_agency',         label: 'SaaS licence for recruiting agencies',      revenueType: 'recurring',  effort: 'low',    readiness: 'needs-sales-step',         note: 'Most scalable. Requires 1–3 agency pilot customers.' },
  { id: 'white_label',         label: 'White-label licence for partners',          revenueType: 'licence',    effort: 'medium', readiness: 'needs-sales-step',         note: 'Higher per-customer value. UI customisation needed.' },
  { id: 'candidate_source',    label: 'Candidate source partnership package',      revenueType: 'recurring',  effort: 'medium', readiness: 'needs-sales-step',         note: 'Language schools / universities pay for employer demand data.' },
  { id: 'corridor_dashboard',  label: 'Market corridor intelligence dashboard',    revenueType: 'licence',    effort: 'high',   readiness: 'strategic-long-term',      note: 'Premium for HR tech companies, government, investment firms.' },
  { id: 'acquisition',         label: 'Full acquisition by HR tech / relocation company', revenueType: 'one-time', effort: 'high', readiness: 'ready-to-activate', note: 'Primary current goal. Platform is transfer-ready today.' },
]

// ── Valuation context (honest — not a guarantee) ─────────────────────────────

export const VALUATION_CONTEXT = {
  disclaimer:    'This is not a guaranteed valuation. It is an honest assessment of asset-stage value factors. No revenue-based multiple applies at this stage.',
  suggestedAsk:  '49 000 – 79 000 €',
  rationale: [
    'Asset-stage SaaS: value is based on code, infrastructure, domain, documentation, and market positioning — not revenue.',
    'Comparable asset-stage SaaS platforms with live product, working admin system, and full documentation typically trade in the €20 000 – €100 000 range depending on domain strength and technical quality.',
    'The €49 000 floor assumes: live domain, tested codebase, 10+ admin tools, 8-corridor intelligence engine, transfer-ready infrastructure.',
    'The €79 000 ceiling assumes: same plus buyer can demonstrate immediate activation path (employer pilot, agency licence, or corridor intelligence package).',
    'Without market proof (real replies): expect pressure toward lower end or below.',
    'With 1–3 real written replies: justifies mid-range or above.',
    'With first paid pilot: justifies upper range or renegotiation.',
  ],
  valueDrivers: [
    { driver: 'Corridor Intelligence Engine (8 corridors)',      impact: '+ significant — unique market positioning' },
    { driver: 'Persistent Supabase pipeline (GDPR, RLS)',        impact: '+ significant — enterprise-ready data layer' },
    { driver: 'Transfer-ready (all 4 assets transferable)',       impact: '+ significant — reduces buyer risk' },
    { driver: '4 112 green tests, TypeScript strict',            impact: '+ meaningful — reduces technical due diligence risk' },
    { driver: '50+ documentation files',                         impact: '+ meaningful — reduces onboarding time' },
    { driver: 'Zero paying customers',                           impact: '− significant downward pressure' },
    { driver: 'No market validation yet',                        impact: '− meaningful downward pressure' },
    { driver: 'Legal review needed',                             impact: '− risk factor, buyer must resolve' },
  ],
}

// ── Demo script outline ───────────────────────────────────────────────────────
// (full script is in docs/BUYER_DEMO_SCRIPT.md)

export const DEMO_STEPS = [
  { step: 1,  title: 'Homepage',                    url: '/',                                   duration: '60s',  focus: 'Positioning headline, three-sided market intro' },
  { step: 2,  title: 'Employer Intake',             url: '/global/employers',                   duration: '60s',  focus: 'Demand intake form, sector + corridor selection' },
  { step: 3,  title: 'Candidate Interest',          url: '/global/candidates',                  duration: '45s',  focus: 'Voluntary intake, source-market targeting' },
  { step: 4,  title: 'Partner Pages',               url: '/partners',                           duration: '45s',  focus: '4 partner tracks, strategic partnership page' },
  { step: 5,  title: 'Corridor Intelligence',       url: '/admin/corridor-intelligence',        duration: '90s',  focus: 'Buyer Opportunity Scores, 8 corridors ranked' },
  { step: 6,  title: 'Germany Healthcare Demo Card', url: '/admin/corridor-intelligence',       duration: '60s',  focus: 'Demo Cards tab — Score 93, Copy card button' },
  { step: 7,  title: 'Global Growth Department',   url: '/admin/global-growth-department',     duration: '90s',  focus: 'Persistent pipeline, Batch Planner, Quick Add' },
  { step: 8,  title: 'Approval Queue',             url: '/admin/global-growth-department',     duration: '60s',  focus: '9-stage queue, no auto-send, manual control' },
  { step: 9,  title: 'Contact Copilot',            url: '/admin/contact-copilot',              duration: '60s',  focus: 'Gmail Draft link, Form Autofill, zero risk' },
  { step: 10, title: 'Buyer Room',                 url: '/admin/buyer-room',                   duration: '90s',  focus: 'Transfer checklist, asset inventory, sale readiness score' },
]

// ── Sell-ready checklist ──────────────────────────────────────────────────────

export const SELL_READY_ITEMS: { category: string; label: string; done: boolean; note: string }[] = [
  // Done
  { category: 'Product',        label: 'Public website live',                              done: true,  note: 'corridorwork.com' },
  { category: 'Product',        label: 'Employer intake form + DB persistence',            done: true,  note: '/global/employers → Supabase' },
  { category: 'Product',        label: 'Candidate interest form + DB persistence',         done: true,  note: '/global/candidates → Supabase' },
  { category: 'Product',        label: 'Partner intake (4 tracks)',                        done: true,  note: '/partners → Supabase' },
  { category: 'Product',        label: 'Demo page live',                                   done: true,  note: '/demo + /demo/sandbox' },
  { category: 'Tech',           label: 'TypeScript strict — 0 errors',                    done: true,  note: 'tsc --noEmit → 0' },
  { category: 'Tech',           label: 'ESLint clean',                                     done: true,  note: '0 warnings, 0 errors' },
  { category: 'Tech',           label: 'Build clean',                                      done: true,  note: 'next build → ✓' },
  { category: 'Tech',           label: '4 112 tests green',                               done: true,  note: '45 test files, 0 failures' },
  { category: 'Tech',           label: 'Vercel deployment READY',                          done: true,  note: 'production, auto-deploy' },
  { category: 'Tech',           label: 'Supabase EU-Frankfurt, RLS active',                done: true,  note: 'GDPR-compliant' },
  { category: 'Compliance',     label: 'No automatic send (DB constraint)',                done: true,  note: 'no_auto_send CHECK' },
  { category: 'Compliance',     label: 'No scraping',                                      done: true,  note: 'confirmed in all code' },
  { category: 'Compliance',     label: 'No Stripe active',                                 done: true,  note: 'not connected' },
  { category: 'Compliance',     label: 'No job guarantee / visa guarantee',                done: true,  note: 'confirmed in docs + UI' },
  { category: 'Compliance',     label: '/robots.txt blocks /admin',                        done: true,  note: 'Disallow: /admin/' },
  { category: 'Compliance',     label: '/sitemap.xml has no admin URLs',                   done: true,  note: '0 admin entries' },
  { category: 'Transfer',       label: 'Supabase project transferable',                    done: true,  note: 'Settings → Transfer' },
  { category: 'Transfer',       label: 'Vercel project transferable',                      done: true,  note: 'Settings → Transfer' },
  { category: 'Transfer',       label: 'GitHub repo transferable',                         done: true,  note: 'Settings → Transfer' },
  { category: 'Transfer',       label: 'Domain transferable',                              done: true,  note: 'corridorwork.com' },
  { category: 'Transfer',       label: '.env.example complete',                            done: true,  note: 'all variables documented' },
  { category: 'Transfer',       label: 'docs/TRANSFER_GUIDE.md complete',                  done: true,  note: '10-step guide' },
  { category: 'Docs',           label: 'BUYER_OVERVIEW.md',                                done: true,  note: 'created this sprint' },
  { category: 'Docs',           label: 'VALUATION_ARGUMENT.md',                            done: true,  note: 'honest, no fake numbers' },
  { category: 'Docs',           label: 'BUYER_DEMO_SCRIPT.md',                             done: true,  note: '10-minute script' },
  { category: 'Docs',           label: 'ASSET_INVENTORY.md',                               done: true,  note: 'all assets listed' },
  { category: 'Docs',           label: 'SELL_READY_CHECKLIST.md',                          done: true,  note: 'this file' },
  // Still needed
  { category: 'Market',         label: '1–3 real written replies from targets',             done: false, note: 'Next action: run Growth Department batch' },
  { category: 'Market',         label: 'First pilot partner confirmed',                     done: false, note: 'Pending outreach execution' },
  { category: 'Revenue',        label: 'First paid transaction',                            done: false, note: 'Stripe activation + pilot package needed' },
  { category: 'Legal',          label: 'Legal review of recruitment intermediary rules',    done: false, note: 'Buyer responsibility or pre-sale commission' },
  { category: 'Buyer',          label: 'Buyer demo session delivered',                      done: false, note: 'Ready to schedule' },
]
