/**
 * app/admin/employer-demand-map/page.tsx
 *
 * Employer Demand Map — Arbeitgeberbranchen nach Potenzial
 */
import { redirect }            from 'next/navigation'
import { getCurrentAdminUser } from '@/lib/admin'
import { analyzeEmployerDemand, getPilotReadySectors } from '@/lib/cwo-agent'

export const dynamic = 'force-dynamic'

export default async function EmployerDemandMapPage() {
  const user = await getCurrentAdminUser()
  if (!user) redirect('/auth/login?redirectTo=/admin/employer-demand-map')

  const sectors     = analyzeEmployerDemand()
  const pilotReady  = getPilotReadySectors()

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

      <div>
        <h1 className="text-3xl font-bold text-gray-900">🏭 Employer Demand Map</h1>
        <p className="text-gray-500 mt-1">Arbeitgeberbranchen nach Personalnot, Zahlungsbereitschaft und Pilotfähigkeit</p>
      </div>

      {/* Safety Note */}
      <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 flex items-center gap-3">
        <span className="text-green-600">✓</span>
        <span className="text-sm text-green-800">
          Interne Bewertungslogik — kein Scraping, kein externer API-Call, kein Cold-Outreach
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-blue-600">{sectors.length}</div>
          <div className="text-xs text-gray-500">Sektoren analysiert</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-600">{pilotReady.length}</div>
          <div className="text-xs text-gray-500">Sofort pilotfähig</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-purple-600">
            {sectors.filter(s => s.overallScore >= 78).length}
          </div>
          <div className="text-xs text-gray-500">Hohe Priorität</div>
        </div>
      </div>

      {/* Pilot Ready Highlight */}
      {pilotReady.length > 0 && (
        <div className="bg-white rounded-xl border border-green-200 p-6">
          <h2 className="text-lg font-bold text-green-900 mb-3">⚡ Sofort Pilotfähig (PilotReadiness ≥ 80)</h2>
          <div className="flex flex-wrap gap-2">
            {pilotReady.map(s => (
              <span key={s.sector} className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-sm font-medium">
                {s.sectorIcon} {s.sector}
                <span className="text-green-600 font-bold ml-1">{s.pilotReadiness}%</span>
              </span>
            ))}
          </div>
          <p className="text-xs text-green-700 mt-3">
            Diese Sektoren haben hohe Entscheidungsbereitschaft und niedrige Einstiegshürden.
          </p>
        </div>
      )}

      {/* Full Sectors Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Alle Sektoren (sortiert nach Score)</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {sectors.map((sector, idx) => (
            <div key={sector.sector} className="p-4 hover:bg-gray-50">
              <div className="flex items-start gap-4">
                {/* Rank + Icon */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xl font-bold text-gray-200 w-6">#{idx + 1}</span>
                  <span className="text-3xl">{sector.sectorIcon}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900">{sector.sector}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{sector.recommendation}</div>

                  {/* Scores Bar */}
                  <div className="mt-2 space-y-1">
                    {[
                      { label: 'Personalnot',         value: sector.urgency,            color: 'bg-red-400' },
                      { label: 'Zahlungsbereitschaft', value: sector.paymentWillingness, color: 'bg-green-400' },
                      { label: 'Int. Bedarf',          value: sector.internationalNeed,   color: 'bg-blue-400' },
                      { label: 'Pilotfähigkeit',       value: sector.pilotReadiness,      color: 'bg-purple-400' },
                    ].map(bar => (
                      <div key={bar.label} className="flex items-center gap-2">
                        <div className="text-xs text-gray-500 w-36 flex-shrink-0">{bar.label}</div>
                        <div className="flex-1 bg-gray-100 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${bar.color}`}
                            style={{ width: `${bar.value}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-600 w-8 text-right">{bar.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Score */}
                <div className="flex-shrink-0 text-right">
                  <div className="text-2xl font-bold text-blue-600">{sector.overallScore}</div>
                  <div className="text-xs text-gray-400">Gesamt</div>
                  <div className="text-xs text-red-500 mt-1">Risiko: {sector.riskScore}</div>
                </div>
              </div>

              {/* Search Strategies */}
              <div className="mt-2 ml-14 flex flex-wrap gap-1">
                {sector.searchStrategies.slice(0, 2).map((term, tIdx) => (
                  <a
                    key={tIdx}
                    href={`https://www.google.com/search?q=${encodeURIComponent(term)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded hover:bg-blue-100 transition-colors"
                  >
                    🔍 {term}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
