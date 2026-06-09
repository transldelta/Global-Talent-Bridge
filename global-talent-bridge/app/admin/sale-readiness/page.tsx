/**
 * app/admin/sale-readiness/page.tsx
 *
 * Sale Readiness — 6-dimension honest score for CorridorWork acquisition readiness.
 * Admin-only. Noindex/nofollow. Static data — no DB queries.
 *
 * Dimensions: Technical · Transfer · Documentation · Commercial Proof ·
 *             Buyer Confidence · Overall
 *
 * No fake revenue · No fake customers · No Stripe · No auto-send ·
 * No scraping · No job guarantee · No visa guarantee
 */

import { getCurrentAdminUser } from '@/lib/admin'
import { redirect }            from 'next/navigation'
import Link                    from 'next/link'
import { NavBar }              from '@/app/_components/NavBar'
import {
  SALE_READINESS_DIMENSIONS,
  SELL_READY_ITEMS,
  calculateSaleReadinessScore,
} from '@/lib/buyer-room'

export const dynamic = 'force-dynamic'

export const metadata = {
  title:  'Sale Readiness | CorridorWork Admin',
  robots: 'noindex, nofollow',
}

function DimBar({ score, band }: { score: number; band: 'high' | 'medium' | 'low' }) {
  const fill =
    band === 'high'   ? 'bg-green-500'  :
    band === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
  const text =
    band === 'high'   ? 'text-green-400'  :
    band === 'medium' ? 'text-yellow-400' : 'text-red-400'
  const label =
    band === 'high'   ? 'HIGH'   :
    band === 'medium' ? 'MEDIUM' : 'LOW'
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
        <div className={`h-full rounded-full transition-all ${fill}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-sm font-bold tabular-nums w-8 text-right text-gray-200">{score}</span>
      <span className={`text-xs font-semibold w-16 ${text}`}>{label}</span>
    </div>
  )
}

export default async function SaleReadinessPage() {
  const admin = await getCurrentAdminUser()
  if (!admin) redirect('/auth/login?redirectTo=/admin/sale-readiness')

  const overallScore = calculateSaleReadinessScore()

  const doneCount    = SELL_READY_ITEMS.filter(i => i.done).length
  const pendingCount = SELL_READY_ITEMS.filter(i => !i.done).length

  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar badge="Admin" badgeColor="purple" />

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">📊 Sale Readiness</h1>
            <p className="text-gray-400 text-sm mt-1">
              6-dimension honest score — CorridorWork acquisition readiness
            </p>
            <p className="text-xs text-gray-600 mt-0.5">
              No fake revenue · No fake customers · Pre-revenue asset stage
            </p>
          </div>
          <Link
            href="/admin/buyer-room"
            className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm transition-colors shrink-0"
          >
            🏦 Buyer Room →
          </Link>
        </div>

        {/* Overall score hero */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6">
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center justify-center w-24 h-24 rounded-full ring-2 ring-yellow-500/60 shrink-0">
              <span className="text-3xl font-bold text-yellow-400">{overallScore}</span>
              <span className="text-[10px] text-gray-500">/ 100</span>
            </div>
            <div>
              <p className="text-lg font-bold text-white">Overall Sale Readiness</p>
              <p className="text-sm text-gray-400 mt-1">
                Asset-stage platform. Strong technical foundation. Honest commercial proof gap.
              </p>
              <div className="flex gap-2 mt-2 flex-wrap">
                <span className="px-2 py-0.5 text-xs font-medium rounded-full border bg-green-900/30 text-green-400 border-green-800/40">
                  Technical ✅
                </span>
                <span className="px-2 py-0.5 text-xs font-medium rounded-full border bg-green-900/30 text-green-400 border-green-800/40">
                  Transfer ✅
                </span>
                <span className="px-2 py-0.5 text-xs font-medium rounded-full border bg-red-900/30 text-red-400 border-red-800/40">
                  Commercial proof ❌
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 6 dimensions */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">6-Dimension Score Breakdown</h2>
          <div className="space-y-4">
            {SALE_READINESS_DIMENSIONS.map((dim) => (
              <div
                key={dim.id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-semibold text-white text-sm">{dim.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{dim.description}</p>
                  </div>
                </div>
                <DimBar score={dim.score} band={dim.band} />
                <p className="text-xs text-gray-600 mt-2 italic">{dim.honest_note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Summary table */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Score Summary</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="divide-y divide-gray-800">
              {SALE_READINESS_DIMENSIONS.map((dim) => (
                <div key={dim.id} className="flex items-center justify-between px-5 py-3 gap-4">
                  <span className="text-sm text-gray-300">{dim.label}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-700 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          dim.band === 'high' ? 'bg-green-500' :
                          dim.band === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${dim.score}%` }}
                      />
                    </div>
                    <span className={`text-sm font-bold w-8 text-right tabular-nums ${
                      dim.band === 'high' ? 'text-green-400' :
                      dim.band === 'medium' ? 'text-yellow-400' : 'text-red-400'
                    }`}>{dim.score}</span>
                    <span className={`text-xs font-semibold w-16 ${
                      dim.band === 'high' ? 'text-green-400' :
                      dim.band === 'medium' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {dim.band.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Checklist progress */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Sell-Ready Checklist Progress</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-6 mb-4">
              <div className="text-center">
                <span className="text-2xl font-bold text-green-400">{doneCount}</span>
                <p className="text-xs text-gray-500">Done</p>
              </div>
              <div className="flex-1 bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full rounded-full bg-green-500"
                  style={{ width: `${Math.round((doneCount / (doneCount + pendingCount)) * 100)}%` }}
                />
              </div>
              <div className="text-center">
                <span className="text-2xl font-bold text-red-400">{pendingCount}</span>
                <p className="text-xs text-gray-500">Pending</p>
              </div>
            </div>
            <div className="space-y-1">
              {SELL_READY_ITEMS.filter(i => !i.done).map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="text-red-500">❌</span>
                  <span className="text-gray-400">[{item.category}]</span>
                  <span>{item.label}</span>
                  <span className="text-gray-600">— {item.note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What would improve the score */}
        <div className="bg-blue-950 border border-blue-800/50 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-blue-300 mb-3">
            💡 What would raise the overall score to 75–80
          </h2>
          <ul className="space-y-1.5 text-xs text-blue-200/70">
            <li>→ Collect 1–3 real written replies from growth targets (+8 to commercial proof)</li>
            <li>→ Confirm first pilot partner in writing (+10 to commercial proof)</li>
            <li>→ Complete one paid transaction, even €500 (+15 to commercial proof)</li>
            <li>→ Commission legal review of recruitment intermediary rules (+3 to buyer confidence)</li>
          </ul>
        </div>

        {/* Market Signal Sprint status */}
        <div className="bg-yellow-950/20 border border-yellow-700/40 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-yellow-300 mb-3">
            📡 Market Signal Sprint — Status
          </h2>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span className="text-gray-300">Sprint prepared — profiles, templates, and playbook ready</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">○</span>
              <span className="text-gray-300">No outreach sent yet — 0 messages sent as of 2026-06-09</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">○</span>
              <span className="text-gray-300">No responses received — 0 real written responses</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">○</span>
              <span className="text-gray-300">No market proof items — Commercial Proof score remains 7 (LOW)</span>
            </div>
          </div>
          <p className="mt-3 text-xs text-yellow-200/60 italic">
            Sprint is for manual execution only. No auto-send. No fake responses. All outreach
            requires manual review and approval before sending.
          </p>
          <div className="mt-3">
            <Link
              href="/admin/market-signals"
              className="text-xs text-yellow-400 hover:text-yellow-300 underline transition-colors"
            >
              Open Market Signals →
            </Link>
          </div>
        </div>

        {/* Safety */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-400 mb-2">Safety constraints — always active</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-xs text-gray-600">
            <span>✗ No auto-send</span>
            <span>✗ No scraping</span>
            <span>✗ No fake revenue</span>
            <span>✗ No fake customers</span>
            <span>✗ No job guarantee</span>
            <span>✗ No visa guarantee</span>
            <span>✗ No Stripe active</span>
            <span>✗ No bulk messaging</span>
          </div>
        </div>

      </div>
    </div>
  )
}
