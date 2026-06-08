'use client'

/**
 * app/admin/buyer-room/_components/BuyerRoomClient.tsx
 *
 * Buyer Room — Sell-Ready Package UI.
 * 9 tabs covering all sell-readiness sections.
 *
 * No fake revenue · No fake customers · No Stripe · No auto-send ·
 * No scraping · No job guarantee · No visa guarantee
 */

import { useState } from 'react'
import Link from 'next/link'
import {
  SALE_READINESS_CRITERIA,
  EXECUTIVE_SUMMARY,
  BUYER_ASSETS,
  DIFFERENTIATION_POINTS,
  TECHNICAL_PROOF_ITEMS,
  HONEST_GAPS,
  MARKET_PROOF_PLAN,
  TRANSFER_STEPS,
  MONETIZATION_OPTIONS,
  VALUATION_CONTEXT,
  DEMO_STEPS,
  SELL_READY_ITEMS,
  calculateSaleReadinessScore,
  saleReadinessBand,
} from '@/lib/buyer-room'

// ── Shared helpers ────────────────────────────────────────────────────────────

function Badge({
  label,
  color,
}: {
  label: string
  color: 'green' | 'yellow' | 'red' | 'blue' | 'gray' | 'purple' | 'orange'
}) {
  const cls: Record<string, string> = {
    green:  'bg-green-900/30 text-green-400 border-green-800/40',
    yellow: 'bg-yellow-900/30 text-yellow-400 border-yellow-800/40',
    red:    'bg-red-900/30 text-red-400 border-red-800/40',
    blue:   'bg-blue-900/30 text-blue-300 border-blue-800/40',
    gray:   'bg-gray-800 text-gray-400 border-gray-700',
    purple: 'bg-purple-900/30 text-purple-300 border-purple-800/40',
    orange: 'bg-orange-900/30 text-orange-300 border-orange-800/40',
  }
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${cls[color]}`}>
      {label}
    </span>
  )
}

function ScoreRing({ score, size = 'lg' }: { score: number; size?: 'sm' | 'lg' }) {
  const { color } = saleReadinessBand(score)
  const ring =
    color === 'green'  ? 'ring-green-500/60 text-green-400'  :
    color === 'yellow' ? 'ring-yellow-500/60 text-yellow-400' :
                         'ring-red-500/60 text-red-400'
  const dim = size === 'lg' ? 'w-24 h-24 text-3xl' : 'w-14 h-14 text-lg'
  return (
    <div className={`rounded-full ring-2 flex flex-col items-center justify-center shrink-0 ${ring} ${dim}`}>
      <span className="font-bold leading-none">{score}</span>
      <span className="text-[10px] opacity-60 leading-tight">/ 100</span>
    </div>
  )
}

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 70 ? 'bg-green-500' : score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-700 rounded-full h-1.5 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs text-gray-400 w-8 text-right shrink-0">{score}</span>
    </div>
  )
}

function CopyBtn({ text }: { text: string }) {
  const [ok, setOk] = useState(false)
  async function go() {
    try { await navigator.clipboard.writeText(text) } catch {
      const el = document.createElement('textarea')
      el.value = text; document.body.appendChild(el); el.select()
      document.execCommand('copy'); document.body.removeChild(el)
    }
    setOk(true); setTimeout(() => setOk(false), 2200)
  }
  return (
    <button onClick={go} className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${ok ? 'bg-green-700 text-green-100' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'}`}>
      {ok ? '✅ Copied' : '📋 Copy'}
    </button>
  )
}

// ── Tabs ──────────────────────────────────────────────────────────────────────

type Tab =
  | 'overview'
  | 'assets'
  | 'differentiation'
  | 'monetization'
  | 'technical'
  | 'compliance'
  | 'gaps'
  | 'transfer'
  | 'demo'
  | 'sales-launch'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'overview',      label: 'Overview',        icon: '📋' },
  { id: 'assets',        label: 'Assets',          icon: '📦' },
  { id: 'differentiation', label: 'Differentiation', icon: '⚡' },
  { id: 'monetization',  label: 'Monetization',    icon: '💰' },
  { id: 'technical',     label: 'Technical Proof', icon: '🔧' },
  { id: 'compliance',    label: 'Compliance',      icon: '🛡️' },
  { id: 'gaps',          label: 'Honest Gaps',     icon: '⚠️' },
  { id: 'transfer',      label: 'Transfer',        icon: '🔄' },
  { id: 'demo',          label: 'Demo Script',     icon: '🎬' },
  { id: 'sales-launch',  label: 'Sales Launch',    icon: '🚀' },
]

// ── Tab: Overview (Executive Summary + Sale Readiness Score) ──────────────────

function OverviewTab() {
  const score = calculateSaleReadinessScore()
  const { label: bandLabel, color: bandColor, summary: bandSummary } = saleReadinessBand(score)

  return (
    <section className="space-y-8">
      {/* Sale Readiness Score */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-sm text-gray-500 uppercase tracking-wider mb-4">Sale Readiness Score</h2>
        <div className="flex items-start gap-6">
          <ScoreRing score={score} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-bold text-white">{bandLabel}</span>
              <Badge
                label={bandLabel}
                color={bandColor === 'green' ? 'green' : bandColor === 'yellow' ? 'yellow' : 'red'}
              />
            </div>
            <p className="text-sm text-gray-300 mb-4">{bandSummary}</p>
            <div className="space-y-2">
              {SALE_READINESS_CRITERIA.map((c) => (
                <div key={c.key} className="grid grid-cols-[160px_1fr] gap-3 items-center">
                  <span className="text-xs text-gray-400 truncate">{c.label}</span>
                  <ScoreBar score={c.score} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Score detail */}
      <div className="space-y-3">
        {SALE_READINESS_CRITERIA.map((c) => (
          <div key={c.key} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="font-medium text-white text-sm">{c.label}</span>
              <div className="flex items-center gap-2">
                <ScoreBar score={c.score} />
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-1">{c.rationale}</p>
            {c.score < 70 && (
              <p className="text-xs text-yellow-400/80">
                ↑ To improve: {c.canImprove}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Executive Summary */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h2 className="text-sm text-gray-500 uppercase tracking-wider mb-4">Executive Summary</h2>
        <ol className="space-y-3">
          {EXECUTIVE_SUMMARY.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-gray-600 shrink-0 w-5 text-right">{i + 1}.</span>
              <span className="text-sm text-gray-300 leading-relaxed">{s}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Valuation context */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
        <h2 className="text-sm text-gray-500 uppercase tracking-wider">Valuation Context</h2>
        <p className="text-xs text-yellow-400/80 bg-yellow-900/20 border border-yellow-800/30 rounded-lg px-3 py-2">
          ⚠️ {VALUATION_CONTEXT.disclaimer}
        </p>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-green-400">{VALUATION_CONTEXT.suggestedAsk}</span>
          <Badge label="Suggested ask (asset stage)" color="green" />
        </div>
        <ul className="space-y-1">
          {VALUATION_CONTEXT.rationale.map((r, i) => (
            <li key={i} className="text-xs text-gray-400 flex gap-2">
              <span className="text-gray-600 shrink-0">•</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
        <div className="space-y-2 pt-2 border-t border-gray-800">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Value drivers</p>
          {VALUATION_CONTEXT.valueDrivers.map((v, i) => (
            <div key={i} className="flex items-start gap-2 text-xs">
              <span className="text-gray-300 flex-1">{v.driver}</span>
              <span className={v.impact.startsWith('+') ? 'text-green-400' : 'text-red-400'}>
                {v.impact}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Tab: Assets ───────────────────────────────────────────────────────────────

function AssetsTab() {
  const categories = [...new Set(BUYER_ASSETS.map((a) => a.category))]
  const done  = BUYER_ASSETS.filter((a) => a.status === 'ready').length
  const total = BUYER_ASSETS.length

  return (
    <section className="space-y-6">
      <p className="text-sm text-gray-400">
        <span className="text-white font-semibold">{done}</span> of {total} assets are{' '}
        <Badge label="ready" color="green" />
      </p>

      {/* Sell-ready checklist summary */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-white mb-3">Sell-Ready Checklist</h3>
        {(() => {
          const cats = [...new Set(SELL_READY_ITEMS.map((i) => i.category))]
          return cats.map((cat) => {
            const items = SELL_READY_ITEMS.filter((i) => i.category === cat)
            const allDone = items.every((i) => i.done)
            return (
              <div key={cat} className="mb-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{cat}</p>
                <div className="space-y-1">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <span className={item.done ? 'text-green-400' : 'text-yellow-400'}>
                        {item.done ? '✅' : '⏳'}
                      </span>
                      <span className={item.done ? 'text-gray-300' : 'text-yellow-200'}>
                        {item.label}
                      </span>
                      <span className="text-gray-600 text-xs ml-auto shrink-0">{item.note}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })
        })()}
      </div>

      {/* What the buyer gets */}
      {categories.map((cat) => {
        const items = BUYER_ASSETS.filter((a) => a.category === cat)
        return (
          <div key={cat}>
            <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-3">{cat}</h3>
            <div className="bg-gray-900 border border-gray-800 rounded-xl divide-y divide-gray-800">
              {items.map((a) => (
                <div key={a.id} className="flex items-start gap-3 px-4 py-3">
                  <span className={
                    a.status === 'ready'      ? 'text-green-400 shrink-0' :
                    a.status === 'partial'    ? 'text-yellow-400 shrink-0' :
                                               'text-red-400 shrink-0'
                  }>
                    {a.status === 'ready' ? '✓' : a.status === 'partial' ? '◑' : '✗'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium">{a.label}</p>
                    <p className="text-xs text-gray-500">{a.detail}</p>
                  </div>
                  <Badge
                    label={a.status === 'ready' ? 'ready' : a.status === 'partial' ? 'partial' : 'not active'}
                    color={a.status === 'ready' ? 'green' : a.status === 'partial' ? 'yellow' : 'red'}
                  />
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </section>
  )
}

// ── Tab: Differentiation ──────────────────────────────────────────────────────

function DifferentiationTab() {
  return (
    <section className="space-y-4">
      <div className="bg-purple-900/20 border border-purple-800/30 rounded-xl px-5 py-4 mb-6">
        <h2 className="text-base font-bold text-white mb-1">
          Why CorridorWork is not a generic recruiting SaaS
        </h2>
        <p className="text-sm text-purple-200/70">
          8 reasons this platform occupies a distinct market position.
        </p>
      </div>

      {DIFFERENTIATION_POINTS.map((dp, i) => (
        <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex gap-4">
          <span className="text-2xl font-bold text-gray-700 shrink-0 w-8">{i + 1}</span>
          <div>
            <p className="font-semibold text-white text-sm mb-1">{dp.label}</p>
            <p className="text-sm text-gray-400 leading-relaxed">{dp.detail}</p>
          </div>
        </div>
      ))}
    </section>
  )
}

// ── Tab: Monetization ─────────────────────────────────────────────────────────

const EFFORT_COLOR: Record<string, 'green' | 'yellow' | 'red'> = { low: 'green', medium: 'yellow', high: 'red' }
const READINESS_COLOR: Record<string, 'green' | 'yellow' | 'gray'> = {
  'ready-to-activate':     'green',
  'needs-sales-step':      'yellow',
  'strategic-long-term':   'gray',
}

function MonetizationTab() {
  return (
    <section className="space-y-4">
      <p className="text-sm text-gray-400">
        {MONETIZATION_OPTIONS.length} monetization paths — sorted by activation effort.
      </p>
      {[...MONETIZATION_OPTIONS]
        .sort((a, b) => ({ low: 0, medium: 1, high: 2 }[a.effort]! - ({ low: 0, medium: 1, high: 2 }[b.effort]!)))
        .map((mo) => (
          <div key={mo.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-white text-sm">{mo.label}</h3>
              <div className="flex gap-1.5 shrink-0 flex-wrap justify-end">
                <Badge label={`Effort: ${mo.effort}`} color={EFFORT_COLOR[mo.effort]} />
                <Badge label={mo.revenueType} color="blue" />
                <Badge
                  label={mo.readiness.replace(/-/g, ' ')}
                  color={READINESS_COLOR[mo.readiness]}
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 italic">{mo.note}</p>
          </div>
        ))}
    </section>
  )
}

// ── Tab: Technical Proof ──────────────────────────────────────────────────────

function TechnicalTab() {
  return (
    <section>
      <p className="text-sm text-gray-400 mb-4">
        Verified technical quality indicators at time of last deployment.
      </p>
      <div className="bg-gray-900 border border-gray-800 rounded-xl divide-y divide-gray-800">
        {TECHNICAL_PROOF_ITEMS.map((item, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3">
            <span className="text-green-400 shrink-0">✓</span>
            <span className="text-sm text-gray-300 flex-1">{item.label}</span>
            <span className="text-xs font-mono text-green-300 shrink-0">{item.value}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Tab: Compliance ───────────────────────────────────────────────────────────

const COMPLIANCE_ITEMS = [
  { label: 'No automatic sending — ever',               detail: 'No send button. No scheduled outreach. DB CHECK constraint enforced.' },
  { label: 'No scraping',                               detail: 'Zero external data fetching. All corridor data is manually curated.' },
  { label: 'No Stripe active',                          detail: 'Payment infrastructure not connected. Safe for pre-commercial operation.' },
  { label: 'No job guarantee',                          detail: 'Explicitly stated in SCORE_DISCLAIMER and Buyer Value Layer.' },
  { label: 'No visa guarantee',                         detail: 'Explicitly stated in Buyer Value Layer Safety category.' },
  { label: 'No candidate fees',                         detail: 'Candidate intake is voluntary and free. No charging of job-seekers.' },
  { label: 'Manual approval required for all actions',  detail: '9-stage approval queue. Every outreach step needs human sign-off.' },
  { label: 'Test data ≠ market proof',                  detail: 'Synthetic test data demonstrates system function, not real demand.' },
  { label: 'Legal review recommended before paid placement', detail: 'Recruitment intermediary rules vary by jurisdiction. Buyer responsibility.' },
  { label: 'RLS active on all Supabase tables',         detail: 'No public/anon access to any database table.' },
  { label: 'GDPR-compliant hosting',                    detail: 'Supabase EU-Frankfurt (eu-central-1). No data leaves EU.' },
  { label: 'Admin routes noindex/nofollow',             detail: 'robots: noindex on all admin pages. Not crawlable.' },
]

function ComplianceTab() {
  return (
    <section>
      <p className="text-sm text-gray-400 mb-4">
        Compliance posture for buyer due diligence.
      </p>
      <div className="bg-gray-900 border border-gray-800 rounded-xl divide-y divide-gray-800">
        {COMPLIANCE_ITEMS.map((item, i) => (
          <div key={i} className="flex items-start gap-3 px-4 py-3">
            <span className="text-green-400 shrink-0 mt-0.5">✓</span>
            <div>
              <p className="text-sm text-white font-medium">{item.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Tab: Honest Gaps ──────────────────────────────────────────────────────────

function HonestGapsTab() {
  const severityColor: Record<string, 'red' | 'yellow' | 'gray'> = {
    blocker: 'red', caution: 'yellow', info: 'gray',
  }

  return (
    <section className="space-y-4">
      <div className="bg-yellow-900/20 border border-yellow-800/30 rounded-xl px-5 py-4">
        <h2 className="font-bold text-white mb-1">What is not active yet</h2>
        <p className="text-sm text-yellow-200/70">
          Honest disclosure of gaps. These are known and documented — not hidden.
        </p>
      </div>

      {HONEST_GAPS.map((gap, i) => (
        <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex gap-4">
          <Badge
            label={gap.severity}
            color={severityColor[gap.severity]}
          />
          <div className="flex-1">
            <p className="font-semibold text-white text-sm mb-1">{gap.label}</p>
            <p className="text-sm text-gray-400 leading-relaxed">{gap.detail}</p>
          </div>
        </div>
      ))}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mt-4">
        <h3 className="font-semibold text-white text-sm mb-3">Market Proof Plan</h3>
        <p className="text-xs text-gray-500 mb-3">
          Structured path to closing the market proof gap — no fake data.
        </p>
        <ol className="space-y-2">
          {MARKET_PROOF_PLAN.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="text-gray-600 shrink-0 w-5 text-right">{i + 1}.</span>
              <span className="text-gray-300">{step}</span>
            </li>
          ))}
        </ol>
        <div className="mt-4">
          <Link
            href="/admin/global-growth-department"
            className="text-xs text-blue-400 hover:text-blue-300 underline"
          >
            → Open Growth Department to start outreach
          </Link>
        </div>
      </div>
    </section>
  )
}

// ── Tab: Transfer ─────────────────────────────────────────────────────────────

const EFFORT_BADGE_COLOR: Record<string, 'green' | 'yellow' | 'orange'> = {
  minutes: 'green', hours: 'yellow', days: 'orange',
}

function TransferTab() {
  const exportText = TRANSFER_STEPS
    .map((s) => `${s.order}. ${s.label}\n   ${s.detail}\n   Effort: ${s.effort}`)
    .join('\n\n')

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          {TRANSFER_STEPS.length}-step transfer checklist. Everything is independently transferable.
        </p>
        <CopyBtn text={exportText} />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl divide-y divide-gray-800">
        {TRANSFER_STEPS.map((step) => (
          <div key={step.order} className="flex items-start gap-4 px-4 py-4">
            <span className="w-7 h-7 rounded-full bg-gray-800 text-gray-400 text-xs font-bold flex items-center justify-center shrink-0">
              {step.order}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white text-sm">{step.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{step.detail}</p>
            </div>
            <Badge label={step.effort} color={EFFORT_BADGE_COLOR[step.effort]} />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 pt-2 text-sm">
        <Link href="/admin/buyer-readiness"  className="text-blue-400 hover:text-blue-300 underline text-xs">→ Buyer Readiness Audit</Link>
        <Link href="/admin/exit-readiness"   className="text-blue-400 hover:text-blue-300 underline text-xs">→ Exit Readiness</Link>
        <Link href="/api/admin/growth/export" target="_blank" className="text-blue-400 hover:text-blue-300 underline text-xs">→ JSON Pipeline Export</Link>
      </div>
    </section>
  )
}

// ── Tab: Demo Script ──────────────────────────────────────────────────────────

function DemoTab() {
  const totalMinutes = DEMO_STEPS.reduce((s, step) => {
    return s + parseInt(step.duration)
  }, 0)

  const scriptText = DEMO_STEPS
    .map((s) => `Step ${s.step} (${s.duration}): ${s.title}\nURL: ${s.url}\nFocus: ${s.focus}`)
    .join('\n\n')

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white">10-Minute Buyer Demo Script</h2>
          <p className="text-xs text-gray-500">
            {DEMO_STEPS.length} steps · ~{Math.round(totalMinutes / 60)} minutes total
          </p>
        </div>
        <CopyBtn text={scriptText} />
      </div>

      <div className="space-y-3">
        {DEMO_STEPS.map((step) => (
          <div key={step.step} className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-4 flex gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-900/40 border border-blue-800/40 text-blue-300 text-sm font-bold flex items-center justify-center shrink-0">
              {step.step}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-white text-sm">{step.title}</p>
                <Badge label={step.duration} color="gray" />
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                <span className="font-mono text-gray-600">{step.url}</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">{step.focus}</p>
            </div>
            <Link
              href={step.url}
              className="text-xs text-blue-400 hover:text-blue-300 underline shrink-0 mt-1"
            >
              Open →
            </Link>
          </div>
        ))}
      </div>

      <div className="bg-blue-900/20 border border-blue-800/30 rounded-xl px-4 py-3">
        <p className="text-xs text-blue-300 font-semibold mb-1">Full script in docs</p>
        <p className="text-xs text-blue-100/70">
          See <code className="bg-blue-900/40 px-1 rounded">docs/BUYER_DEMO_SCRIPT.md</code> for
          the full talking-points script with suggested phrases and objection handling.
        </p>
      </div>
    </section>
  )
}

// ── Tab: Sales Launch ─────────────────────────────────────────────────────────

function SalesLaunchTab() {
  const docs = [
    {
      title: 'Sale Listing Draft',
      file:  'SALE_LISTING_DRAFT.md',
      desc:  'Full sale listing for Acquire.com, MicroAcquire, broker, or direct sharing.',
      action: 'Copy listing text',
    },
    {
      title: 'Buyer Outreach Messages',
      file:  'BUYER_OUTREACH_MESSAGES.md',
      desc:  '5 ready-to-personalise messages for each buyer type. Manual send only.',
      action: 'Open messages',
    },
    {
      title: 'Buyer Q&A',
      file:  'BUYER_QA.md',
      desc:  'Honest answers to all 12 standard buyer questions including revenue, customers, and risks.',
      action: 'Open Q&A',
    },
    {
      title: 'Fast Sale Plan',
      file:  'FAST_SALE_PLAN.md',
      desc:  '7-day plan: Day 1 listing → Day 7 negotiation. Concrete daily actions.',
      action: 'Open plan',
    },
    {
      title: 'Data Room Index',
      file:  'SALE_DATA_ROOM_INDEX.md',
      desc:  'Index of all 18 buyer-facing documents. Share as the starting point for due diligence.',
      action: 'Open index',
    },
  ]

  const steps = [
    { step: 1, label: 'Finalise listing',             tool: 'docs/SALE_LISTING_DRAFT.md',       done: false },
    { step: 2, label: 'Prepare 20 buyer candidates',  tool: 'docs/BUYER_TARGET_LIST_TEMPLATE.md', done: false },
    { step: 3, label: 'Contact 5–10 buyers manually', tool: 'docs/BUYER_OUTREACH_MESSAGES.md',   done: false },
    { step: 4, label: 'Send market proof outreach',   tool: '/admin/market-proof-launch',        done: false },
    { step: 5, label: 'Document replies',             tool: '/admin/market-proof-launch → Tab D', done: false },
    { step: 6, label: 'Prepare buyer demo',           tool: 'docs/BUYER_DEMO_SCRIPT.md',         done: false },
    { step: 7, label: 'Start negotiations',           tool: 'docs/BUYER_QA.md',                  done: false },
  ]

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="bg-blue-950 border border-blue-800 rounded-xl p-5">
        <h2 className="text-lg font-bold text-white mb-1">🚀 Sales Launch</h2>
        <p className="text-blue-200 text-sm">
          CorridorWork is sell-ready. All docs, tools, and outreach materials are in place.
          The next action is execution: list, reach out, collect proof, demonstrate, negotiate.
        </p>
        <div className="mt-3 flex gap-3 flex-wrap text-xs">
          <span className="bg-green-900 text-green-300 px-2 py-0.5 rounded border border-green-700">✅ Product built</span>
          <span className="bg-green-900 text-green-300 px-2 py-0.5 rounded border border-green-700">✅ Transfer-ready</span>
          <span className="bg-green-900 text-green-300 px-2 py-0.5 rounded border border-green-700">✅ 4 258 tests green</span>
          <span className="bg-green-900 text-green-300 px-2 py-0.5 rounded border border-green-700">✅ Docs complete</span>
          <span className="bg-yellow-900 text-yellow-300 px-2 py-0.5 rounded border border-yellow-700">⏳ Outreach pending</span>
          <span className="bg-yellow-900 text-yellow-300 px-2 py-0.5 rounded border border-yellow-700">⏳ Market proof pending</span>
        </div>
      </div>

      {/* Next action */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <p className="text-sm font-semibold text-white mb-2">Next action</p>
        <div className="flex flex-col gap-2 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <span className="text-blue-400 font-bold">1</span>
            <span>Prepare 20 buyer candidates in a private spreadsheet</span>
            <Link href="/admin/market-proof-launch" className="text-blue-400 text-xs hover:underline ml-auto">
              → Market Proof Launch
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-400 font-bold">2</span>
            <span>Contact 5–10 buyers manually using outreach messages below</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-400 font-bold">3</span>
            <span>Collect 1–3 real market replies to raise Sale Readiness Score to 75+</span>
          </div>
        </div>
      </div>

      {/* 7-day plan */}
      <div>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">7-Day Fast Sale Plan</h3>
        <div className="space-y-2">
          {steps.map((s) => (
            <div key={s.step} className="flex gap-3 items-start bg-gray-900 border border-gray-800 rounded-lg p-3">
              <div className="w-6 h-6 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs font-bold text-gray-400 shrink-0">
                {s.step}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium">Day {s.step} — {s.label}</p>
                <p className="text-xs text-gray-500 mt-0.5 font-mono">{s.tool}</p>
              </div>
              <span className="text-xs bg-gray-800 text-gray-500 px-2 py-0.5 rounded border border-gray-700 shrink-0">
                pending
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Documents */}
      <div>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Sales Launch Documents</h3>
        <div className="space-y-3">
          {docs.map((d) => (
            <div key={d.file} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">{d.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{d.desc}</p>
                  <p className="text-xs text-gray-600 font-mono mt-1">docs/{d.file}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety reminder */}
      <div className="bg-yellow-950 border border-yellow-800/50 rounded-xl p-4">
        <p className="text-xs font-semibold text-yellow-300 mb-2">⚠️ Safety Constraints — Always Active</p>
        <div className="grid grid-cols-2 gap-1 text-xs text-yellow-200/70">
          <span>✗ No automatic sending</span>
          <span>✗ No scraping</span>
          <span>✗ No fake customers</span>
          <span>✗ No fake revenue</span>
          <span>✗ No job guarantee</span>
          <span>✗ No visa guarantee</span>
          <span>✗ No Stripe activation</span>
          <span>✗ No bulk messaging</span>
        </div>
      </div>
    </section>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function BuyerRoomClient() {
  const [tab, setTab] = useState<Tab>('overview')
  const score = calculateSaleReadinessScore()
  void saleReadinessBand(score) // band used inside OverviewTab and ScoreRing directly

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">🏦 Buyer Room</h1>
            <p className="text-gray-400 mt-1 text-sm">
              Sell-Ready Package — CorridorWork · corridorwork.com
            </p>
            <p className="text-xs text-gray-600 mt-0.5">
              No fake revenue · No fake customers · No Stripe · No auto-send ·
              No job guarantee · No visa guarantee
            </p>
            {/* Market Proof Launch link */}
            <div className="mt-3 bg-blue-950 border border-blue-700 rounded-lg px-3 py-2 inline-block">
              <p className="text-xs text-blue-300 font-semibold mb-0.5">
                Next step: collect 1–3 real market replies
              </p>
              <Link
                href="/admin/market-proof-launch"
                className="text-xs text-blue-400 hover:underline"
              >
                → Open Market Proof Launch →
              </Link>
            </div>
          </div>
          <div className="ml-auto shrink-0">
            <ScoreRing score={score} size="sm" />
            <p className="text-xs text-center text-gray-500 mt-1">Sale Ready</p>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex flex-wrap gap-2 mb-8">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.id
                ? 'bg-blue-700 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'overview'        && <OverviewTab />}
      {tab === 'assets'          && <AssetsTab />}
      {tab === 'differentiation' && <DifferentiationTab />}
      {tab === 'monetization'    && <MonetizationTab />}
      {tab === 'technical'       && <TechnicalTab />}
      {tab === 'compliance'      && <ComplianceTab />}
      {tab === 'gaps'            && <HonestGapsTab />}
      {tab === 'transfer'        && <TransferTab />}
      {tab === 'demo'            && <DemoTab />}
      {tab === 'sales-launch'    && <SalesLaunchTab />}
    </>
  )
}
