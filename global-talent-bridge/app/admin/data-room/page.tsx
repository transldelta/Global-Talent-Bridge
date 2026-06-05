/**
 * /admin/data-room
 *
 * Buyer Data Room Snapshot.
 * Zeigt: Asset Overview, Built Modules, Technical Proof,
 *        Demo Assets, Handover Checklist, Not Yet Proven.
 *
 * Admin-only. Server Component.
 * Demo Mode: aktivierbar via BUYER_DEMO_MODE=true in .env.local
 */
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentAdminUser } from '@/lib/admin'
import { NavBar } from '@/app/_components/NavBar'
import {
  generateDataRoomSnapshot,
  type BuiltModule,
  type TechnicalProof,
  type HandoverChecklistItem,
  type NotYetProvenItem,
  type NextAction,
} from '@/lib/data-room'
import { getDemoDisclaimer, isDemoModeEnabled } from '@/lib/demo-mode'
import { getDemoPack } from '@/lib/demo-data'
import { StaticDemoModeBanner } from './_components/DemoModeBanner'
import { DataRoomExportButton } from './_components/DataRoomExportButton'

export const dynamic = 'force-dynamic'

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ s }: { s: 'complete' | 'partial' | 'planned' | 'done' | 'missing' }) {
  if (s === 'complete' || s === 'done')
    return <span className="text-green-400 text-sm">✅</span>
  if (s === 'partial')
    return <span className="text-yellow-400 text-sm">⚠️</span>
  return <span className="text-red-400 text-sm">❌</span>
}

function PriorityBadge({ p }: { p: 'critical' | 'high' | 'medium' }) {
  const styles = {
    critical: 'bg-red-900/40 text-red-300 border-red-800/50',
    high:     'bg-orange-900/40 text-orange-300 border-orange-800/50',
    medium:   'bg-yellow-900/40 text-yellow-300 border-yellow-800/50',
  }[p]
  return <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${styles}`}>{p.toUpperCase()}</span>
}

function EffortBadge({ e }: { e: 'hours' | 'days' | 'weeks' }) {
  const styles = {
    hours: 'bg-green-900/30 text-green-400',
    days:  'bg-blue-900/30 text-blue-400',
    weeks: 'bg-purple-900/30 text-purple-400',
  }[e]
  return <span className={`text-xs px-2 py-0.5 rounded ${styles}`}>{e}</span>
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function DataRoomPage() {
  const admin = await getCurrentAdminUser()
  if (!admin) redirect('/auth/login')

  const demoMode = isDemoModeEnabled()
  const snapshot = generateDataRoomSnapshot(demoMode)
  const demoPack = getDemoPack()

  const { assetOverview: ao, builtModules, technicalProof, demoAssets, handoverChecklist, notYetProven, nextActions } = snapshot

  const completedModules  = builtModules.filter((m) => m.status === 'complete').length
  const doneHandover      = handoverChecklist.filter((h) => h.status === 'done').length
  const criticalUnproven  = notYetProven.filter((n) => n.priority === 'critical').length
  const verifiedTechItems = technicalProof.filter((t) => t.verified).length

  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar />

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-2xl font-bold text-white">🏛️ Buyer Data Room</h1>
              {demoMode && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-900/30 border border-amber-700/50 text-amber-400">
                  🎬 Demo Mode
                </span>
              )}
            </div>
            <p className="text-gray-400 text-sm">
              Strukturierte Käufer-/Due-Diligence-Übersicht für M&A, Investoren und Partner.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap items-center">
            <DataRoomExportButton />
            <Link href="/admin/exit-readiness" className="text-xs text-blue-400 hover:text-blue-300">📋 Exit Readiness →</Link>
            <Link href="/admin/pilot-execution" className="text-xs text-green-400 hover:text-green-300">🚀 Pilot Execution →</Link>
            <Link href="/admin/ceo-dashboard" className="text-xs text-gray-400 hover:text-gray-300">🏠 CEO Dashboard →</Link>
          </div>
        </div>

        {/* Demo Mode Banner */}
        <StaticDemoModeBanner active={demoMode} />

        {/* Disclaimer */}
        <div className="mb-8 bg-blue-900/10 border border-blue-800/30 rounded-xl px-4 py-3">
          <p className="text-blue-300/80 text-xs leading-relaxed">
            ℹ️ <strong>Hinweis:</strong> {getDemoDisclaimer()}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Module komplett', value: `${completedModules}/${builtModules.length}`, color: 'text-green-400' },
            { label: 'Tech-Proof verifiziert', value: `${verifiedTechItems}/${technicalProof.length}`, color: 'text-blue-400' },
            { label: 'Handover done', value: `${doneHandover}/${handoverChecklist.length}`, color: 'text-purple-400' },
            { label: 'Kritisch unbewiesen', value: criticalUnproven, color: 'text-red-400' },
          ].map((stat, i) => (
            <div key={i} className="bg-gray-900 rounded-xl border border-gray-800 p-4 text-center">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-gray-500 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ── A: Asset Overview ─────────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-white mb-4">🏗️ A. Asset Overview</h2>
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
            <h3 className="text-xl font-bold text-white mb-1">{ao.productName}</h3>
            <p className="text-blue-400 text-sm italic mb-4">{ao.oneLineDescription}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Business Model</p>
                <p className="text-xs text-gray-300 leading-relaxed">{ao.businessModel}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Current Stage</p>
                <p className="text-xs text-yellow-300/80 leading-relaxed">{ao.currentStage}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Technical Readiness</p>
                <p className="text-xs text-gray-300 leading-relaxed">{ao.technicalReadiness}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Target Buyer</p>
                <ul className="space-y-0.5">
                  {ao.targetBuyer.map((b, i) => (
                    <li key={i} className="text-xs text-gray-400 flex gap-2">
                      <span className="text-blue-500">→</span>{b}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Demo Mode</p>
                <p className="text-xs text-gray-300 leading-relaxed">{ao.demoModeStatus}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── B: Built Modules ──────────────────────────────────────────────── */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="text-lg font-bold text-white">🧩 B. Built Modules</h2>
            <span className="text-xs text-green-400">{completedModules}/{builtModules.length} complete</span>
          </div>
          <div className="space-y-2">
            {builtModules.map((m: BuiltModule) => (
              <div key={m.id} className="bg-gray-900 rounded-xl border border-gray-800 p-4 flex items-start gap-3">
                <StatusBadge s={m.status} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-white">{m.name}</p>
                    <code className="text-xs text-blue-400 bg-gray-800 px-1.5 py-0.5 rounded">{m.route}</code>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{m.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── C: Technical Proof ────────────────────────────────────────────── */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="text-lg font-bold text-white">🔬 C. Technical Proof</h2>
            <span className="text-xs text-blue-400">{verifiedTechItems}/{technicalProof.length} verified</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {technicalProof.map((t: TechnicalProof) => (
              <div key={t.label} className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-semibold text-white">{t.label}</p>
                  <span className={`text-xs font-bold ${t.verified ? 'text-green-400' : 'text-yellow-400'}`}>
                    {t.value}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{t.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── D: Demo Assets ────────────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-white mb-4">🎬 D. Demo Assets</h2>
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
            <div className="flex items-start gap-3 mb-4">
              <span className="text-amber-400 text-lg">⚠️</span>
              <p className="text-xs text-amber-300/80 leading-relaxed">
                Alle Demo-Daten sind synthetisch und tragen <code className="bg-gray-800 px-1 rounded">demo: true</code>.
                Sie repräsentieren keine echten Kunden und keinen echten Umsatz.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {[
                { label: 'Candidates', value: demoAssets.demoCandidates, icon: '👤' },
                { label: 'Employers', value: demoAssets.demoEmployers, icon: '🏢' },
                { label: 'Corridors', value: demoAssets.demoCorridors, icon: '🌍' },
                { label: 'Revenue Assumptions', value: demoAssets.demoRevenueAssumptions, icon: '💰' },
                { label: 'Risks', value: demoAssets.demoRisks, icon: '⚠️' },
              ].map((item, i) => (
                <div key={i} className="bg-gray-800/50 rounded-lg p-3 text-center">
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <p className="text-xl font-bold text-white">{item.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
                  <span className="text-xs text-amber-500/70">demo</span>
                </div>
              ))}
            </div>

            {/* Demo Candidate Snippets */}
            <div className="mt-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                Sample Demo Candidates (showing 4 of {demoPack.meta.totalCandidates})
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {demoPack.candidates.slice(0, 4).map((c) => (
                  <div key={c.id} className="bg-gray-800/40 rounded-lg p-3 flex items-center gap-3">
                    <span className="text-2xl">
                      {c.sector === 'care' ? '🏥' : c.sector === 'it' ? '💻' : c.sector === 'construction' ? '🏗️' : c.sector === 'hospitality' ? '🍽️' : '🚛'}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-gray-300">{c.displayName}</p>
                      <p className="text-xs text-gray-500">{c.profession} · {c.corridor}</p>
                      <p className="text-xs text-gray-600">{c.languageLevel} · {c.experienceYears}y exp · Q{c.qualityScore}</p>
                    </div>
                    <span className="ml-auto text-xs text-amber-600/60 bg-amber-900/20 px-1.5 py-0.5 rounded">demo</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── E: Buyer Handover Checklist ───────────────────────────────────── */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="text-lg font-bold text-white">✅ E. Buyer Handover Checklist</h2>
            <span className="text-xs text-green-400">{doneHandover}/{handoverChecklist.length} done</span>
          </div>
          <div className="space-y-2">
            {handoverChecklist.map((h: HandoverChecklistItem) => (
              <div key={h.id} className="bg-gray-900 rounded-xl border border-gray-800 p-4 flex items-start gap-3">
                <StatusBadge s={h.status} />
                <div>
                  <p className="text-sm font-semibold text-white">{h.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{h.note}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── F: Not Yet Proven ─────────────────────────────────────────────── */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="text-lg font-bold text-white">⚠️ F. What Is Not Yet Proven</h2>
            <span className="text-xs text-red-400">{criticalUnproven} critical</span>
          </div>
          <div className="space-y-3">
            {notYetProven.map((n: NotYetProvenItem) => (
              <div
                key={n.id}
                className={`bg-gray-900 rounded-xl border p-4 ${
                  n.priority === 'critical' ? 'border-red-800/60' :
                  n.priority === 'high'     ? 'border-orange-800/50' :
                  'border-yellow-800/40'
                }`}
              >
                <div className="flex items-start gap-3 mb-2">
                  <PriorityBadge p={n.priority} />
                  <p className="text-sm font-semibold text-white">{n.label}</p>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{n.explanation}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── G: Next Actions ───────────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-white mb-4">🎯 G. Next Actions</h2>
          <div className="space-y-2">
            {nextActions.map((a: NextAction) => (
              <div key={a.id} className="bg-gray-900 rounded-xl border border-gray-800 p-4 flex items-center gap-3">
                <PriorityBadge p={a.priority} />
                <p className="text-sm text-gray-300 flex-1">{a.action}</p>
                <EffortBadge e={a.effort} />
              </div>
            ))}
          </div>
        </section>

        {/* Export Footer */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm font-semibold text-white mb-1">📥 Data Room exportieren</p>
              <p className="text-xs text-gray-500">
                JSON + Markdown Export. Grundlage für PDF oder Verkaufsdokument.
                Route: <code className="bg-gray-800 px-1 rounded">GET /api/admin/data-room/export</code>
              </p>
            </div>
            <DataRoomExportButton />
          </div>
        </div>

      </div>
    </div>
  )
}
