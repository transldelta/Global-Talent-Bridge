/**
 * app/admin/revenue-pragmatist/page.tsx
 *
 * Revenue Pragmatist — Revenue-Streams bewerten
 */
import { redirect }            from 'next/navigation'
import { getCurrentAdminUser } from '@/lib/admin'
import { analyzeRevenueStreams, getImmediateRevenueStreams, getBlockedRevenueStreams, getPriorityScore } from '@/lib/cwo-agent'

export const dynamic = 'force-dynamic'

export default async function RevenuePragmatistPage() {
  const user = await getCurrentAdminUser()
  if (!user) redirect('/auth/login?redirectTo=/admin/revenue-pragmatist')

  const allStreams     = analyzeRevenueStreams()
  const immediate     = getImmediateRevenueStreams()
  const blocked       = getBlockedRevenueStreams()
  const laterStreams   = allStreams.filter(s => s.recommendation === 'test_later')

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

      <div>
        <h1 className="text-3xl font-bold text-gray-900">💰 Revenue Pragmatist</h1>
        <p className="text-gray-500 mt-1">Revenue-Streams nach Potenzial, Risiko, Aufwand und Schnelligkeit bewertet</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-600">{immediate.length}</div>
          <div className="text-xs text-green-700">Sofort testbar</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-yellow-600">{laterStreams.length}</div>
          <div className="text-xs text-yellow-700">Später testen</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-red-600">{blocked.length}</div>
          <div className="text-xs text-red-700">Blockiert (Rechtsprüfung)</div>
        </div>
      </div>

      {/* Immediate Streams */}
      <div className="bg-white rounded-xl border border-green-200 p-6">
        <h2 className="text-lg font-bold text-green-900 mb-4">✅ Sofort testbare Revenue-Streams</h2>
        <div className="space-y-4">
          {immediate.map(stream => (
            <div key={stream.id} className="border border-green-100 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl flex-shrink-0">{stream.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900">{stream.name}</div>
                  <div className="text-sm text-gray-600 mt-1">{stream.rationale}</div>
                  <div className="text-xs text-gray-500 mt-1">⏱️ {stream.timeToRevenue}</div>

                  {/* Score Bars */}
                  <div className="mt-3 space-y-1">
                    {[
                      { label: 'Potenzial',  value: stream.incomePotential, color: 'bg-green-400' },
                      { label: 'Rechtsrisiko', value: stream.legalRisk,     color: 'bg-red-400' },
                      { label: 'Aufwand',    value: stream.effort,          color: 'bg-blue-400' },
                    ].map(bar => (
                      <div key={bar.label} className="flex items-center gap-2">
                        <div className="text-xs text-gray-500 w-24 flex-shrink-0">{bar.label}</div>
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${bar.color}`} style={{ width: `${bar.value}%` }} />
                        </div>
                        <div className="text-xs text-gray-600 w-6 text-right">{bar.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Prerequisites */}
                  <div className="mt-2">
                    <div className="text-xs font-semibold text-gray-500 mb-1">Voraussetzungen:</div>
                    <ul className="space-y-0.5">
                      {stream.prerequisites.map((req, ri) => (
                        <li key={ri} className="text-xs text-gray-600 flex items-start gap-1">
                          <span className="text-green-500 flex-shrink-0">✓</span> {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="text-lg font-bold text-blue-600">Score: {getPriorityScore(stream)}</div>
                  <div className="text-xs text-gray-400 mt-1">Prioritätsscore</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Later Streams */}
      {laterStreams.length > 0 && (
        <div className="bg-white rounded-xl border border-yellow-200 p-6">
          <h2 className="text-lg font-bold text-yellow-800 mb-4">⏳ Später testen</h2>
          <div className="space-y-3">
            {laterStreams.map(stream => (
              <div key={stream.id} className="border border-yellow-100 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{stream.icon}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{stream.name}</div>
                    <div className="text-sm text-gray-600 mt-1">{stream.rationale}</div>
                    <div className="text-xs text-gray-500 mt-1">⏱️ {stream.timeToRevenue}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold text-yellow-700">Potenzial: {stream.incomePotential}%</div>
                    <div className="text-xs text-gray-400">Risiko: {stream.legalRisk}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Blocked Streams */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <h2 className="text-lg font-bold text-red-900 mb-4">🚫 Blockiert — Rechtliche Prüfung erforderlich</h2>
        <div className="space-y-3">
          {blocked.map(stream => (
            <div key={stream.id} className="border border-red-200 rounded-lg p-4 bg-white">
              <div className="flex items-start gap-3">
                <div className="text-2xl">{stream.icon}</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{stream.name}</div>
                  <div className="text-sm text-red-700 mt-1">{stream.rationale}</div>
                  <ul className="mt-2 space-y-0.5">
                    {stream.prerequisites.map((req, ri) => (
                      <li key={ri} className="text-xs text-red-800 flex items-start gap-1">
                        <span className="flex-shrink-0">{req.startsWith('⚠️') ? '' : '→'}</span> {req}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-semibold">BLOCKIERT</span>
                  <div className="text-xs text-gray-400 mt-1">Risiko: {stream.legalRisk}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs text-red-700">
          Keine dieser Optionen kann ohne anwaltliche Freigabe aktiviert werden. Phase-1-Constraint.
        </div>
      </div>

    </div>
  )
}
