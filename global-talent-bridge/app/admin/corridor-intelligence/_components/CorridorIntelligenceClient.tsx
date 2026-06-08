'use client'

/**
 * app/admin/corridor-intelligence/_components/CorridorIntelligenceClient.tsx
 *
 * Corridor Intelligence — Buyer Opportunity Scores · Demo Corridors ·
 * Monetization Map · Buyer Value Layer.
 *
 * Four tabs, fully client-side. No API calls. No sending. No scraping.
 */

import { useState } from 'react'
import Link from 'next/link'
import {
  CORRIDOR_PROFILES,
  DEMO_CORRIDORS,
  MONETIZATION_PATHS,
  BUYER_VALUE_ITEMS,
  BUYER_DIFFERENTIATION,
  SCORE_DISCLAIMER,
  calculateBuyerScore,
  scoreBand,
} from '@/lib/corridor-intelligence'

// ── Shared UI helpers ─────────────────────────────────────────────────────────

function Badge({
  label,
  color,
}: {
  label: string
  color: 'green' | 'yellow' | 'red' | 'blue' | 'gray' | 'purple'
}) {
  const cls: Record<string, string> = {
    green:  'bg-green-900/30 text-green-400 border-green-800/40',
    yellow: 'bg-yellow-900/30 text-yellow-400 border-yellow-800/40',
    red:    'bg-red-900/30 text-red-400 border-red-800/40',
    blue:   'bg-blue-900/30 text-blue-300 border-blue-800/40',
    gray:   'bg-gray-800 text-gray-400 border-gray-700',
    purple: 'bg-purple-900/30 text-purple-300 border-purple-800/40',
  }
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${cls[color]}`}>
      {label}
    </span>
  )
}

function ScoreBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  const color =
    pct >= 80 ? 'bg-green-500' : pct >= 55 ? 'bg-yellow-500' : 'bg-red-500'
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="flex-1 bg-gray-700 rounded-full h-1.5 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-400 w-10 text-right shrink-0">
        {value}/{max}
      </span>
    </div>
  )
}

function OverallScore({ score }: { score: number }) {
  const { label, color } = scoreBand(score)
  const ring =
    color === 'green'
      ? 'ring-green-500/50 text-green-400'
      : color === 'yellow'
      ? 'ring-yellow-500/50 text-yellow-400'
      : 'ring-red-500/50 text-red-400'
  return (
    <div
      className={`w-16 h-16 rounded-full ring-2 flex flex-col items-center justify-center shrink-0 ${ring}`}
    >
      <span className="text-xl font-bold">{score}</span>
      <span className="text-[9px] leading-tight text-center opacity-70">/ 100</span>
    </div>
  )
}

function CopyBtn({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [ok, setOk] = useState(false)
  async function go() {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setOk(true)
    setTimeout(() => setOk(false), 2200)
  }
  return (
    <button
      onClick={go}
      className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors shrink-0 ${
        ok
          ? 'bg-green-700 text-green-100'
          : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
      }`}
    >
      {ok ? '✅ Copied' : `📋 ${label}`}
    </button>
  )
}

// ── Tab definitions ───────────────────────────────────────────────────────────

type Tab = 'corridors' | 'demo' | 'monetization' | 'buyer-value'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'corridors',    label: 'Corridor Scores',  icon: '🌐' },
  { id: 'demo',         label: 'Demo Cards',        icon: '🎯' },
  { id: 'monetization', label: 'Monetization Map',  icon: '💰' },
  { id: 'buyer-value',  label: 'Buyer Value Layer', icon: '🏆' },
]

// ── Tab: Corridor Scores ──────────────────────────────────────────────────────

function CorridorScoresTab() {
  const [expanded, setExpanded] = useState<string | null>(null)

  const sorted = [...CORRIDOR_PROFILES].sort(
    (a, b) =>
      calculateBuyerScore(b.scoreBreakdown) -
      calculateBuyerScore(a.scoreBreakdown),
  )

  return (
    <section>
      <p className="text-sm text-gray-400 mb-1">
        {sorted.length} global talent corridors — ranked by Buyer Opportunity Score.
      </p>
      <p className="text-xs text-yellow-400/80 bg-yellow-900/20 border border-yellow-800/30 rounded-lg px-3 py-2 mb-6">
        ⚠️ {SCORE_DISCLAIMER}
      </p>

      <div className="space-y-3">
        {sorted.map((c) => {
          const score = calculateBuyerScore(c.scoreBreakdown)
          const { label: bandLabel, color: bandColor } = scoreBand(score)
          const open = expanded === c.id

          return (
            <div
              key={c.id}
              className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
            >
              {/* Header row */}
              <button
                onClick={() => setExpanded(open ? null : c.id)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-800/40 transition-colors"
              >
                <OverallScore score={score} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm leading-snug">{c.label}</p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    <Badge label={bandLabel} color={bandColor} />
                    <Badge
                      label={`Legal: ${c.legalRisk}`}
                      color={
                        c.legalRisk === 'low'
                          ? 'green'
                          : c.legalRisk === 'medium'
                          ? 'yellow'
                          : 'red'
                      }
                    />
                    <Badge
                      label={`Pilot: ${c.speedToPilot}`}
                      color={
                        c.speedToPilot === 'fast'
                          ? 'green'
                          : c.speedToPilot === 'medium'
                          ? 'yellow'
                          : 'red'
                      }
                    />
                    {c.sectors.slice(0, 2).map((s) => (
                      <Badge key={s} label={s} color="blue" />
                    ))}
                  </div>
                </div>
                <span className="text-gray-500 text-lg select-none shrink-0">
                  {open ? '▲' : '▼'}
                </span>
              </button>

              {/* Expanded detail */}
              {open && (
                <div className="border-t border-gray-800 px-5 py-4 space-y-5">
                  {/* Description */}
                  <p className="text-sm text-gray-300 leading-relaxed">{c.description}</p>

                  {/* Buyer note */}
                  <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg px-4 py-3">
                    <p className="text-xs text-blue-300 font-semibold mb-1">Buyer note</p>
                    <p className="text-sm text-blue-100/80 leading-relaxed">{c.buyerNote}</p>
                  </div>

                  {/* Score breakdown */}
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                      Score breakdown
                    </p>
                    <div className="space-y-2">
                      {c.scoreBreakdown.map((cr) => (
                        <div key={cr.key} className="grid grid-cols-[120px_1fr] gap-3 items-center">
                          <span className="text-xs text-gray-400 truncate">{cr.label}</span>
                          <div className="space-y-0.5">
                            <ScoreBar value={cr.value} max={cr.max} />
                            <p className="text-[11px] text-gray-500">{cr.note}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Markets & sectors */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Source markets</p>
                      <p className="text-gray-300">{c.sourceMarkets.join(', ')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Destination markets</p>
                      <p className="text-gray-300">{c.destinationMarkets.join(', ')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Partner channels</p>
                      <p className="text-gray-300">{c.partnerChannels.join(', ')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Candidate source types</p>
                      <p className="text-gray-300">{c.candidateSourceTypes.join(', ')}</p>
                    </div>
                  </div>

                  {/* Recommended first action */}
                  <div className="bg-green-900/20 border border-green-800/30 rounded-lg px-4 py-3">
                    <p className="text-xs text-green-400 font-semibold mb-1">
                      Recommended first action
                    </p>
                    <p className="text-sm text-green-100/80">{c.recommendedFirstAction}</p>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href="/admin/global-growth-department"
                      className="text-xs text-blue-400 hover:text-blue-300 underline"
                    >
                      → Open Growth Department
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ── Tab: Demo Corridor Cards ──────────────────────────────────────────────────

function DemoCorridorsTab() {
  return (
    <section className="space-y-6">
      <p className="text-sm text-gray-400">
        3 featured corridors for buyer demos and pilot prioritisation.
      </p>

      {DEMO_CORRIDORS.map((dc) => {
        const { label: bandLabel, color: bandColor } = scoreBand(dc.buyerScore)
        return (
          <div
            key={dc.id}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4"
          >
            {/* Title + score */}
            <div className="flex items-start gap-4">
              <OverallScore score={dc.buyerScore} />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-base">{dc.label}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{dc.tag}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <Badge label={bandLabel} color={bandColor} />
                  {dc.sectors.map((s) => (
                    <Badge key={s} label={s} color="blue" />
                  ))}
                </div>
              </div>
              <CopyBtn
                text={`${dc.label}\nScore: ${dc.buyerScore}/100\n${dc.tag}\n\nWhy high value:\n${dc.whyHighValue}\n\nRecommended targets:\n${dc.recommendedTargetBatch}`}
                label="Copy card"
              />
            </div>

            {/* Markets */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-500 mb-1">Source markets</p>
                <div className="flex flex-wrap gap-1">
                  {dc.sourceMarkets.map((m) => (
                    <Badge key={m} label={m} color="gray" />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Destination market</p>
                <Badge label={dc.destinationMarket} color="purple" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Candidate sources</p>
                <p className="text-gray-300 text-xs">{dc.candidateSources.join(' · ')}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Partner channels</p>
                <p className="text-gray-300 text-xs">{dc.partnerChannels.join(' · ')}</p>
              </div>
            </div>

            {/* Why high value */}
            <div className="bg-green-900/20 border border-green-800/30 rounded-lg px-4 py-3">
              <p className="text-xs text-green-400 font-semibold mb-1">Why high value</p>
              <p className="text-sm text-green-100/80 leading-relaxed">{dc.whyHighValue}</p>
            </div>

            {/* Recommended batch */}
            <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg px-4 py-3">
              <p className="text-xs text-blue-300 font-semibold mb-1">
                Recommended target batch
              </p>
              <p className="text-sm text-blue-100/80">{dc.recommendedTargetBatch}</p>
            </div>

            <Link
              href={dc.growthDepartmentLink}
              className="inline-block text-xs text-blue-400 hover:text-blue-300 underline"
            >
              → Open Growth Department
            </Link>
          </div>
        )
      })}
    </section>
  )
}

// ── Tab: Monetization Map ─────────────────────────────────────────────────────

const EFFORT_COLOR: Record<string, 'green' | 'yellow' | 'red'> = {
  low:    'green',
  medium: 'yellow',
  high:   'red',
}

const REVENUE_COLOR: Record<string, 'blue' | 'green' | 'purple' | 'yellow'> = {
  recurring:   'green',
  'one-time':  'blue',
  transaction: 'yellow',
  licence:     'purple',
}

function MonetizationTab() {
  return (
    <section className="space-y-4">
      <p className="text-sm text-gray-400 mb-4">
        {MONETIZATION_PATHS.length} monetization paths — ranked from lowest effort to
        highest.
      </p>

      {[...MONETIZATION_PATHS]
        .sort((a, b) => {
          const order = { low: 0, medium: 1, high: 2 }
          return order[a.effort] - order[b.effort]
        })
        .map((mp) => (
          <div
            key={mp.id}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-white text-sm">{mp.label}</h3>
              <div className="flex gap-1.5 shrink-0">
                <Badge
                  label={`Effort: ${mp.effort}`}
                  color={EFFORT_COLOR[mp.effort]}
                />
                <Badge
                  label={mp.revenueType}
                  color={REVENUE_COLOR[mp.revenueType] ?? 'gray'}
                />
              </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{mp.desc}</p>
            <p className="text-xs text-gray-500 italic">{mp.note}</p>
          </div>
        ))}
    </section>
  )
}

// ── Tab: Buyer Value Layer ────────────────────────────────────────────────────

function BuyerValueTab() {
  return (
    <section className="space-y-6">
      {/* Positioning statement */}
      <div className="bg-purple-900/20 border border-purple-800/30 rounded-xl px-5 py-4">
        <p className="text-xs text-purple-300 font-semibold uppercase tracking-wider mb-2">
          Positioning
        </p>
        <p className="text-sm text-purple-100/90 leading-relaxed">{BUYER_DIFFERENTIATION}</p>
      </div>

      {/* Value categories */}
      {BUYER_VALUE_ITEMS.map((section) => (
        <div key={section.category}>
          <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-3">
            {section.category}
          </h3>
          <div className="bg-gray-900 border border-gray-800 rounded-xl divide-y divide-gray-800">
            {section.items.map((item, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3">
                <span className="text-green-400 mt-0.5 shrink-0">✓</span>
                <span className="text-sm text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Transfer-readiness link */}
      <div className="flex gap-4 text-sm">
        <Link
          href="/admin/buyer-readiness"
          className="text-blue-400 hover:text-blue-300 underline"
        >
          → Buyer Readiness Audit
        </Link>
        <Link
          href="/admin/exit-readiness"
          className="text-blue-400 hover:text-blue-300 underline"
        >
          → Exit Readiness
        </Link>
      </div>
    </section>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function CorridorIntelligenceClient() {
  const [tab, setTab] = useState<Tab>('corridors')

  return (
    <>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">🌐 Corridor Intelligence</h1>
        <p className="text-gray-400 mt-1 text-sm">
          Buyer Opportunity Scores · Demo Corridor Cards · Monetization Map · Buyer
          Value Layer
        </p>
        <p className="text-xs text-gray-600 mt-1">
          No sending · No scraping · No job guarantee · No visa guarantee
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex flex-wrap gap-2 mb-8">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
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
      {tab === 'corridors'    && <CorridorScoresTab />}
      {tab === 'demo'         && <DemoCorridorsTab />}
      {tab === 'monetization' && <MonetizationTab />}
      {tab === 'buyer-value'  && <BuyerValueTab />}
    </>
  )
}
