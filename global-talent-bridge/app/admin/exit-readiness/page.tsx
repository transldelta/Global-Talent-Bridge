/**
 * /admin/exit-readiness
 *
 * Exit Readiness Evidence Pack.
 * Zeigt: Product Summary, Buyer Checklist, Value Drivers,
 *        Risk Register, Buyer Q&A, Export-Link.
 *
 * Admin-only. Server Component.
 * Ehrliche, nicht-übertriebene Darstellung des Projektstatus.
 */
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentAdminUser } from '@/lib/admin'
import { NavBar } from '@/app/_components/NavBar'
import {
  generateExitEvidence,
  computeExitReadinessScore,
  type ChecklistItem,
  type ValueDriver,
  type RiskItem,
  type BuyerQuestion,
} from '@/lib/exit-readiness'
import { ExportButton } from './_components/ExportButton'

export const dynamic = 'force-dynamic'

// ── Sub-components ────────────────────────────────────────────────────────────

function ChecklistBadge({ status }: { status: 'confirmed' | 'partial' | 'missing' }) {
  if (status === 'confirmed')
    return <span className="text-green-400 text-base">✅</span>
  if (status === 'partial')
    return <span className="text-yellow-400 text-base">⚠️</span>
  return <span className="text-red-400 text-base">❌</span>
}

function SeverityBadge({ s }: { s: 'critical' | 'high' | 'medium' | 'low' }) {
  const styles = {
    critical: 'bg-red-900/40 text-red-300 border-red-800/50',
    high:     'bg-orange-900/40 text-orange-300 border-orange-800/50',
    medium:   'bg-yellow-900/40 text-yellow-300 border-yellow-800/50',
    low:      'bg-gray-800 text-gray-400 border-gray-700',
  }[s]
  return <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${styles}`}>{s.toUpperCase()}</span>
}

function StrengthBadge({ s }: { s: 'strong' | 'moderate' | 'weak' }) {
  const styles = {
    strong:   'bg-green-900/30 text-green-400',
    moderate: 'bg-yellow-900/30 text-yellow-400',
    weak:     'bg-red-900/30 text-red-400',
  }[s]
  return <span className={`text-xs px-2 py-0.5 rounded ${styles}`}>{s}</span>
}

function HonestyBadge({ h }: { h: 'positive' | 'neutral' | 'candid' }) {
  if (h === 'candid')
    return <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-900/30 text-yellow-400">candid</span>
  if (h === 'positive')
    return <span className="text-xs px-1.5 py-0.5 rounded bg-green-900/30 text-green-400">positive</span>
  return <span className="text-xs px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">neutral</span>
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ExitReadinessPage() {
  const admin = await getCurrentAdminUser()
  if (!admin) redirect('/auth/login')

  const evidence = generateExitEvidence()
  const { productSummary: ps, buyerChecklist, valueDrivers, riskRegister, buyerQuestions } = evidence
  const score = computeExitReadinessScore(buyerChecklist)

  const confirmedCount = buyerChecklist.filter((c) => c.status === 'confirmed').length
  const partialCount   = buyerChecklist.filter((c) => c.status === 'partial').length
  const missingCount   = buyerChecklist.filter((c) => c.status === 'missing').length

  const criticalRisks = riskRegister.filter((r) => r.severity === 'critical').length
  const highRisks     = riskRegister.filter((r) => r.severity === 'high').length

  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar />

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-2xl font-bold text-white">📋 Exit Readiness Evidence Pack</h1>
              <span className="text-sm font-bold px-3 py-1 rounded-full bg-gray-900 border border-gray-700 text-blue-400">
                {score}% ready
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Strukturierter Nachweis für Käufer, Investoren oder Due-Diligence-Prozesse.
              Keine erfundenen Umsätze. Ehrliche Darstellung.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap items-center">
            <ExportButton />
            <Link href="/admin/pilot-execution" className="text-xs text-green-400 hover:text-green-300">🚀 Pilot Execution →</Link>
            <Link href="/admin/ceo-dashboard" className="text-xs text-gray-400 hover:text-gray-300">🏠 CEO Dashboard →</Link>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mb-8 bg-blue-900/10 border border-blue-800/30 rounded-xl px-4 py-3">
          <p className="text-blue-300/80 text-xs leading-relaxed">
            ℹ️ <strong>Hinweis:</strong> Dieses Dokument ist eine strukturierte Orientierungshilfe für M&A-/Investorengespräche.
            Schätzungen sind klar als Schätzungen markiert. Keine Rechtsberatung. Keine Finanzberatung. Keine Garantie.
          </p>
        </div>

        {/* ── A: Product Asset Summary ─────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-white mb-4">🏗️ A. Product Asset Summary</h2>
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{ps.name}</h3>
                <p className="text-blue-400 text-sm mt-0.5 italic">{ps.tagline}</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">{ps.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Zielgruppe</p>
                <ul className="space-y-1">
                  {ps.targetAudience.map((a, i) => (
                    <li key={i} className="text-xs text-gray-400 flex gap-2">
                      <span className="text-gray-600">→</span>{a}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Kernmodule ({ps.coreModules.length})</p>
                <ul className="space-y-1">
                  {ps.coreModules.map((m, i) => (
                    <li key={i} className="text-xs text-gray-400 flex gap-2">
                      <span className="text-blue-500">✓</span>{m}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Pilotstatus</p>
                <p className="text-xs text-gray-300 leading-relaxed">{ps.pilotStatus}</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Technischer Status</p>
                <p className="text-xs text-gray-300 leading-relaxed">{ps.technicalStatus}</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Monetarisierung</p>
                <p className="text-xs text-yellow-300/80 leading-relaxed">{ps.monetizationLogic}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── B: Buyer Evidence Checklist ───────────────────────────────────── */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="text-lg font-bold text-white">✅ B. Buyer Evidence Checklist</h2>
            <div className="flex gap-3 text-xs">
              <span className="text-green-400">✅ {confirmedCount} confirmed</span>
              {partialCount > 0 && <span className="text-yellow-400">⚠️ {partialCount} partial</span>}
              {missingCount > 0 && <span className="text-red-400">❌ {missingCount} missing</span>}
              <span className="text-blue-400 font-semibold">{score}%</span>
            </div>
          </div>
          <div className="space-y-2">
            {buyerChecklist.map((item: ChecklistItem) => (
              <div key={item.id} className="bg-gray-900 rounded-xl border border-gray-800 p-4 flex items-start gap-3">
                <ChecklistBadge status={item.status} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{item.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── C: Value Drivers ──────────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-white mb-4">💎 C. Value Drivers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {valueDrivers.map((v: ValueDriver) => (
              <div key={v.id} className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm font-semibold text-white leading-tight">{v.title}</p>
                  <StrengthBadge s={v.strength} />
                </div>
                <p className="text-xs text-gray-400 leading-relaxed mb-2">{v.description}</p>
                <p className="text-xs text-gray-600 italic">Evidence: {v.evidence}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── D: Risk Register ──────────────────────────────────────────────── */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="text-lg font-bold text-white">⚠️ D. Risk Register</h2>
            <div className="flex gap-3 text-xs">
              {criticalRisks > 0 && <span className="text-red-400">{criticalRisks} critical</span>}
              {highRisks > 0 && <span className="text-orange-400">{highRisks} high</span>}
              <span className="text-gray-500">{riskRegister.length} total</span>
            </div>
          </div>
          <div className="space-y-3">
            {riskRegister.map((risk: RiskItem) => (
              <div
                key={risk.id}
                className={`bg-gray-900 rounded-xl border p-4 ${
                  risk.severity === 'critical' ? 'border-red-800/60' :
                  risk.severity === 'high'     ? 'border-orange-800/50' :
                  risk.severity === 'medium'   ? 'border-yellow-800/40' :
                  'border-gray-800'
                }`}
              >
                <div className="flex items-start gap-3 mb-2">
                  <SeverityBadge s={risk.severity} />
                  <p className="text-sm font-semibold text-white">{risk.title}</p>
                </div>
                <p className="text-xs text-gray-400 mb-2 leading-relaxed">{risk.explanation}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  <div className="bg-gray-800/50 rounded-lg p-2">
                    <p className="text-xs text-gray-500 mb-0.5">Mitigation</p>
                    <p className="text-xs text-green-300/80">{risk.mitigation}</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-2">
                    <p className="text-xs text-gray-500 mb-0.5">Owner Suggestion</p>
                    <p className="text-xs text-blue-300/80">{risk.ownerSuggestion}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── E: Buyer Q&A ──────────────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-white mb-4">💬 E. Buyer Questions &amp; Honest Answers</h2>
          <div className="space-y-3">
            {buyerQuestions.map((qa: BuyerQuestion, i) => (
              <details key={i} className="group bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                <summary className="flex items-center justify-between gap-3 p-4 cursor-pointer list-none">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-gray-600 text-sm group-open:rotate-90 transition-transform inline-block">▶</span>
                    <p className="text-sm font-medium text-white">{qa.question}</p>
                  </div>
                  <HonestyBadge h={qa.honesty} />
                </summary>
                <div className="px-4 pb-4 border-t border-gray-800 pt-3">
                  <p className="text-sm text-gray-300 leading-relaxed">{qa.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Export + Navigation */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm font-semibold text-white mb-1">📥 Evidence Pack exportieren</p>
              <p className="text-xs text-gray-500">
                JSON-Export mit allen Daten + Markdown für Data-Room / PDF.
                Route: <code className="bg-gray-800 px-1 rounded">GET /api/admin/exit-readiness/export</code>
              </p>
            </div>
            <ExportButton />
          </div>
        </div>

      </div>
    </div>
  )
}
