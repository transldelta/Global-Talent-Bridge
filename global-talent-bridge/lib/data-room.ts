/**
 * lib/data-room.ts
 *
 * Data Room Snapshot — pure business logic for the Buyer Data Room.
 * Keine UI. Keine Server-Imports. Testbar mit Vitest.
 *
 * CONSTRAINTS:
 * - Keine Fake-Umsätze als echte Umsätze
 * - "notYetProven" section muss ehrlich und vollständig sein
 * - Alle Werte, die nicht live aus CI gelesen werden, als verifizierte Snapshot-Werte kennzeichnen
 */

import { getDemoPack, type DemoPack } from '@/lib/demo-data'

// ── Types ─────────────────────────────────────────────────────────────────────

export type AssetOverview = {
  productName: string
  oneLineDescription: string
  targetBuyer: string[]
  businessModel: string
  currentStage: string
  technicalReadiness: string
  demoModeStatus: string
}

export type BuiltModule = {
  id: string
  name: string
  route: string
  status: 'complete' | 'partial' | 'planned'
  description: string
}

export type TechnicalProof = {
  label: string
  value: string | number
  verified: boolean
  note: string
}

export type DemoAssetSummary = {
  demoCandidates: number
  demoEmployers: number
  demoCorridors: number
  demoRevenueAssumptions: number
  demoRisks: number
  allMarkedAsDemo: true
  noVerifiedRevenue: true
}

export type HandoverChecklistItem = {
  id: string
  label: string
  status: 'done' | 'partial' | 'missing'
  note: string
}

export type NotYetProvenItem = {
  id: string
  label: string
  explanation: string
  priority: 'critical' | 'high' | 'medium'
}

export type NextAction = {
  id: string
  action: string
  priority: 'critical' | 'high' | 'medium'
  effort: 'hours' | 'days' | 'weeks'
}

export type DataRoomSnapshot = {
  generatedAt: string
  demoMode: boolean
  assetOverview: AssetOverview
  builtModules: BuiltModule[]
  technicalProof: TechnicalProof[]
  demoAssets: DemoAssetSummary
  handoverChecklist: HandoverChecklistItem[]
  notYetProven: NotYetProvenItem[]
  nextActions: NextAction[]
}

// ── Asset Overview ────────────────────────────────────────────────────────────

export function getAssetOverview(): AssetOverview {
  return {
    productName: 'CorridorWork',
    oneLineDescription:
      'B2B SaaS marketplace connecting international talent with employers in Europe, North America and Australia via structured migration corridors.',
    targetBuyer: [
      'HR-Tech / Marketplace acquirers',
      'International staffing agency operators',
      'Migration & visa consulting firms',
      'PE/VC investors focused on Future of Work',
    ],
    businessModel:
      'Employer subscription (planned €149–999/month) + success fee per placement (€500/hire). ' +
      'Candidate access is free. No verified revenue yet.',
    currentStage:
      'Pre-revenue. Product complete. Pilot infrastructure built. First employer outreach ready to execute.',
    technicalReadiness:
      'Production-deployed on Vercel. Supabase (PostgreSQL + Auth + Storage + RLS). ' +
      '410 automated tests (100% passing). Full admin intelligence layer. CV upload tested.',
    demoModeStatus:
      'Demo Mode available via BUYER_DEMO_MODE=true env variable. ' +
      'All demo data is clearly marked demo: true — no fake revenue or customer claims.',
  }
}

// ── Built Modules (11) ────────────────────────────────────────────────────────

export function getBuiltModules(): BuiltModule[] {
  return [
    {
      id: 'pilot-launch',
      name: 'Pilot Launch Dashboard',
      route: '/admin/pilot-launch',
      status: 'complete',
      description: 'E2E pilot launch orchestration, seed data management, live status tracking.',
    },
    {
      id: 'due-diligence',
      name: 'Due Diligence Center',
      route: '/admin/sale-readiness',
      status: 'partial',
      description: 'Sale readiness overview. Dedicated due_diligence_sections table not yet configured.',
    },
    {
      id: 'revenue-intelligence',
      name: 'Revenue Intelligence',
      route: '/admin/revenue',
      status: 'complete',
      description: 'Revenue forecast engine with scenario modeling. All values are estimates, not verified revenue.',
    },
    {
      id: 'landingpage-factory',
      name: 'Landingpage Factory',
      route: '/admin/pilot-kit',
      status: 'complete',
      description: 'Auto-generated corridor landing pages for candidate acquisition via targeted campaigns.',
    },
    {
      id: 'candidate-acquisition',
      name: 'Candidate Acquisition',
      route: '/admin/global/candidate-acquisition',
      status: 'complete',
      description: 'Full candidate onboarding flow, CV upload, profile management, admin review workflow.',
    },
    {
      id: 'employer-acquisition',
      name: 'Employer Acquisition',
      route: '/employer/dashboard',
      status: 'complete',
      description: 'Employer dashboard, job management, application review, approval workflow.',
    },
    {
      id: 'migration-intelligence',
      name: 'Migration Intelligence',
      route: '/admin/global/corridor-intelligence',
      status: 'complete',
      description: '8+ migration corridors with opportunity scores (62–88). Corridor Intelligence Agent.',
    },
    {
      id: 'pilot-outreach',
      name: 'Pilot Outreach Kit',
      route: '/admin/pilot-outreach',
      status: 'complete',
      description: '5 template types × 3 channels (email/WhatsApp/LinkedIn). Status tracking. No auto-send.',
    },
    {
      id: 'pilot-execution',
      name: 'Pilot Execution Center',
      route: '/admin/pilot-execution',
      status: 'complete',
      description: '8-category readiness scoring, launch blockers, 7-day plan, KPI snapshot, corridor cards.',
    },
    {
      id: 'exit-readiness',
      name: 'Exit Readiness Evidence Pack',
      route: '/admin/exit-readiness',
      status: 'complete',
      description: 'Buyer checklist (13 items), value drivers (9), risk register (10), buyer Q&A (10 pairs).',
    },
    {
      id: 'buyer-demo',
      name: 'Buyer Demo Mode + Data Room',
      route: '/admin/data-room',
      status: 'complete',
      description: 'Synthetic demo data pack, data room snapshot, export API. Demo: true tags on all items.',
    },
    {
      id: 'pilot-offer',
      name: 'Pilot Offer Center',
      route: '/admin/pilot-offer',
      status: 'complete',
      description: '3 offer variants, 6 industry pitches, objection handling (8), call script, next best action per employer.',
    },
    {
      id: 'employer-responses',
      name: 'Employer Response Pipeline',
      route: '/admin/employer-responses',
      status: 'complete',
      description: 'Manual interaction logging, response classification, follow-up tracking. No auto-send.',
    },
  ]
}

// ── Technical Proof ───────────────────────────────────────────────────────────

export function getTechnicalProof(): TechnicalProof[] {
  return [
    {
      label: 'Automated Tests',
      value: '410',
      verified: true,
      note: 'Vitest 4.x. 12 test files. All passing at last commit.',
    },
    {
      label: 'E2E Pilot Steps',
      value: '12/12',
      verified: true,
      note: 'Admin E2E test page validates all 12 steps of pilot launch flow.',
    },
    {
      label: 'Build Status',
      value: 'Passing',
      verified: true,
      note: 'Next.js 14 build compiles cleanly. No ESLint errors.',
    },
    {
      label: 'CV Upload',
      value: 'Implemented',
      verified: true,
      note: 'Supabase Storage. Admin CV review flow. Tested in integration tests.',
    },
    {
      label: 'Auth Flow',
      value: 'Complete',
      verified: true,
      note: 'Candidate / Employer / Admin roles. Password reset. RLS on all tables.',
    },
    {
      label: 'Admin Dashboards',
      value: '15+',
      verified: true,
      note: 'CEO Dashboard, Pilot Launch, Outreach, E2E Test, Revenue, System Audit, Data Room, etc.',
    },
    {
      label: 'Production Deployment',
      value: 'Vercel',
      verified: true,
      note: 'Deployed to https://global-talent-bridge.vercel.app. Supabase EU-Central-1.',
    },
    {
      label: 'Database Tables',
      value: '51+',
      verified: true,
      note: 'PostgreSQL via Supabase. RLS on all user-facing tables. Migrations documented.',
    },
    {
      label: 'AI Agent Infrastructure',
      value: '10+',
      verified: true,
      note: 'CEO, Growth, Corridor Intelligence, Revenue Intelligence, Migration Intelligence, Landingpage Factory, etc.',
    },
    {
      label: 'Stripe Live',
      value: 'Not yet active',
      verified: true,
      note: 'Stripe integration present but in test mode only. No real payments processed.',
    },
  ]
}

// ── Handover Checklist ────────────────────────────────────────────────────────

export function getHandoverChecklist(): HandoverChecklistItem[] {
  return [
    {
      id: 'codebase',
      label: 'Codebase structured and documented',
      status: 'done',
      note: 'Next.js 14 App Router. TypeScript. 410 tests. Clear lib/ separation.',
    },
    {
      id: 'admin-dashboards',
      label: 'Admin dashboards present',
      status: 'done',
      note: '15+ admin pages covering all major workflows.',
    },
    {
      id: 'env-vars',
      label: 'Environment variables documented',
      status: 'done',
      note: '.env.example present. All required vars documented.',
    },
    {
      id: 'demo-mode',
      label: 'Demo Mode available',
      status: 'done',
      note: 'BUYER_DEMO_MODE=true activates demo data layer on /admin/data-room.',
    },
    {
      id: 'risks-documented',
      label: 'Risks documented',
      status: 'done',
      note: 'Risk Register in /admin/exit-readiness + /admin/data-room. 8–10 risks with mitigation.',
    },
    {
      id: 'revenue-assumptions',
      label: 'Revenue assumptions documented',
      status: 'done',
      note: 'Revenue Intelligence + Demo Revenue Assumptions. Clearly labeled as estimates.',
    },
    {
      id: 'pilot-plan',
      label: 'Pilot launch plan available',
      status: 'done',
      note: '7-Day Plan in /admin/pilot-execution. Launch blockers listed. 10 employers ready for outreach.',
    },
    {
      id: 'export',
      label: 'Export available',
      status: 'done',
      note: 'GET /api/admin/exit-readiness/export + GET /api/admin/data-room/export. JSON + Markdown.',
    },
    {
      id: 'next-steps',
      label: 'Next growth steps documented',
      status: 'done',
      note: 'Pilot Execution Center has 7-Day Plan and KPI targets. notYetProven section is transparent.',
    },
  ]
}

// ── Not Yet Proven ────────────────────────────────────────────────────────────

export function getNotYetProven(): NotYetProvenItem[] {
  return [
    {
      id: 'no-revenue',
      label: 'No verified live revenue yet',
      explanation:
        'Stripe is not live. No paying customer exists. Revenue Intelligence shows financial models — all are estimates, not confirmed income.',
      priority: 'critical',
    },
    {
      id: 'no-paying-employer',
      label: 'No confirmed paying employer yet',
      explanation:
        '10 pilot employers identified, outreach templates ready. No employer has signed up or paid. First conversion is the immediate priority.',
      priority: 'critical',
    },
    {
      id: 'legal-review',
      label: 'Legal review required before real international placement',
      explanation:
        'International recruitment is regulated in Germany (§291 SGB III), UK (REC), Canada (ACSESS), Australia (RCSA). Legal opinion required per country before commercial placement activity.',
      priority: 'high',
    },
    {
      id: 'candidate-verification',
      label: 'Candidate verification process needs real-world validation',
      explanation:
        'CV and credential verification is admin-reviewed but not independently verified. No third-party verification service integrated. Process works for pilot scale, not production volume.',
      priority: 'high',
    },
    {
      id: 'outreach-manual',
      label: 'Outreach still manual',
      explanation:
        'Outreach kit is ready. No automated email sending or WhatsApp API configured. All outreach is copy-paste manually. Acceptable for pilot, not scalable.',
      priority: 'medium',
    },
  ]
}

// ── Next Actions ──────────────────────────────────────────────────────────────

export function getNextActions(): NextAction[] {
  return [
    {
      id: 'first-outreach',
      action: 'Execute manual outreach to 10 identified pilot employers using prepared templates',
      priority: 'critical',
      effort: 'hours',
    },
    {
      id: 'first-conversion',
      action: 'Convert first employer to paying pilot (even €99/month trial)',
      priority: 'critical',
      effort: 'days',
    },
    {
      id: 'stripe-live',
      action: 'Activate Stripe live mode after first employer confirms intent',
      priority: 'high',
      effort: 'hours',
    },
    {
      id: 'candidate-pool',
      action: 'Grow candidate pool to 20+ real profiles via community campaigns',
      priority: 'high',
      effort: 'weeks',
    },
    {
      id: 'legal-review',
      action: 'Commission legal opinion for target countries (start: Germany, UK)',
      priority: 'high',
      effort: 'weeks',
    },
    {
      id: 'first-placement',
      action: 'Execute first end-to-end match: employer job → candidate application → admin approval',
      priority: 'high',
      effort: 'weeks',
    },
  ]
}

// ── Full Snapshot ─────────────────────────────────────────────────────────────

export function generateDataRoomSnapshot(demoMode = false): DataRoomSnapshot {
  const pack: DemoPack = getDemoPack()
  return {
    generatedAt: new Date().toISOString(),
    demoMode,
    assetOverview: getAssetOverview(),
    builtModules: getBuiltModules(),
    technicalProof: getTechnicalProof(),
    demoAssets: {
      demoCandidates: pack.meta.totalCandidates,
      demoEmployers: pack.meta.totalEmployers,
      demoCorridors: pack.meta.totalCorridors,
      demoRevenueAssumptions: pack.meta.totalRevenueAssumptions,
      demoRisks: pack.meta.totalRisks,
      allMarkedAsDemo: true,
      noVerifiedRevenue: true,
    },
    handoverChecklist: getHandoverChecklist(),
    notYetProven: getNotYetProven(),
    nextActions: getNextActions(),
  }
}

// ── Markdown Export ───────────────────────────────────────────────────────────

export function generateDataRoomMarkdown(snapshot: DataRoomSnapshot): string {
  const { assetOverview: ao, builtModules, technicalProof, demoAssets, handoverChecklist, notYetProven, nextActions } = snapshot

  const statusIcon = (s: string) => s === 'done' || s === 'complete' ? '✅' : s === 'partial' ? '⚠️' : '❌'
  const priorityIcon = (p: string) => p === 'critical' ? '🔴' : p === 'high' ? '🟠' : '🟡'

  const modulesMd = builtModules
    .map((m) => `| ${statusIcon(m.status)} | **${m.name}** | \`${m.route}\` | ${m.description} |`)
    .join('\n')

  const techMd = technicalProof
    .map((t) => `| ${t.verified ? '✅' : '⚠️'} | **${t.label}** | ${t.value} | ${t.note} |`)
    .join('\n')

  const handoverMd = handoverChecklist
    .map((h) => `| ${statusIcon(h.status)} | **${h.label}** | ${h.note} |`)
    .join('\n')

  const notYetMd = notYetProven
    .map((n) => `### ${priorityIcon(n.priority)} ${n.label}\n${n.explanation}`)
    .join('\n\n')

  const actionsMd = nextActions
    .map((a) => `| ${priorityIcon(a.priority)} | ${a.action} | ${a.effort} |`)
    .join('\n')

  return `# ${ao.productName} — Buyer Data Room Snapshot

*Generated: ${new Date(snapshot.generatedAt).toLocaleDateString('de-DE')}*
*Demo Mode: ${snapshot.demoMode ? 'ACTIVE — synthetic data only' : 'inactive'}*

---

## A. Asset Overview

**Product:** ${ao.productName}

**Description:** ${ao.oneLineDescription}

**Business Model:** ${ao.businessModel}

**Current Stage:** ${ao.currentStage}

**Technical Readiness:** ${ao.technicalReadiness}

**Target Buyer:**
${ao.targetBuyer.map((b) => `- ${b}`).join('\n')}

---

## B. Built Modules

| Status | Module | Route | Description |
|--------|--------|-------|-------------|
${modulesMd}

---

## C. Technical Proof

| Verified | Item | Value | Note |
|----------|------|-------|------|
${techMd}

---

## D. Demo Assets

| Metric | Count |
|--------|-------|
| Demo Candidates | ${demoAssets.demoCandidates} |
| Demo Employers | ${demoAssets.demoEmployers} |
| Demo Corridors | ${demoAssets.demoCorridors} |
| Demo Revenue Assumptions | ${demoAssets.demoRevenueAssumptions} |
| Demo Risks | ${demoAssets.demoRisks} |

> All demo data is tagged \`demo: true\`. No verified revenue. No real customers.

---

## E. Buyer Handover Checklist

| Status | Item | Note |
|--------|------|------|
${handoverMd}

---

## F. What Is Not Yet Proven

${notYetMd}

---

## G. Next Actions

| Priority | Action | Effort |
|----------|--------|--------|
${actionsMd}

---

*Hinweis: Dieses Dokument ist eine strukturierte Orientierungshilfe. Keine Rechtsberatung. Keine Finanzberatung. Keine Garantie. Schätzungen klar als Schätzungen markiert.*
`
}
