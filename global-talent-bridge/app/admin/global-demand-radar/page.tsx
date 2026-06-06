/**
 * app/admin/global-demand-radar/page.tsx
 *
 * Global Demand Radar — analysiert globale Talent-Korridore
 */
import { redirect }            from 'next/navigation'
import { getCurrentAdminUser } from '@/lib/admin'
import { analyzeCorridors, getAvailableOrigins, getAvailableDestinations } from '@/lib/cwo-agent'

export const dynamic = 'force-dynamic'

export default async function GlobalDemandRadarPage() {
  const user = await getCurrentAdminUser()
  if (!user) redirect('/auth/login?redirectTo=/admin/global-demand-radar')

  const corridors     = analyzeCorridors()
  const origins       = getAvailableOrigins()
  const destinations  = getAvailableDestinations()

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">🌍 Global Demand Radar</h1>
        <p className="text-gray-500 mt-1">Automatische Analyse globaler Talent-Korridore — kein Scraping, kein I/O</p>
      </div>

      {/* Safety Note */}
      <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 flex items-center gap-3">
        <span className="text-green-600">✓</span>
        <span className="text-sm text-green-800">
          Alle Analysen basieren auf internen Regeln. Kein Scraping. Kein externer API-Call. noScraping: true
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-blue-600">{corridors.length}</div>
          <div className="text-xs text-gray-500">Korridore analysiert</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-purple-600">{origins.length}</div>
          <div className="text-xs text-gray-500">Ursprungsländer</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-600">{destinations.length}</div>
          <div className="text-xs text-gray-500">Zielmärkte</div>
        </div>
      </div>

      {/* Corridors Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Alle Talent-Korridore (sortiert nach Score)</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {corridors.map((corridor, idx) => (
            <div key={corridor.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                {/* Rank */}
                <div className="text-2xl font-bold text-gray-200 w-8 flex-shrink-0 mt-1">#{idx + 1}</div>

                {/* Flags + Names */}
                <div className="flex-shrink-0 flex items-center gap-2">
                  <div className="text-3xl">{corridor.originFlag}</div>
                  <div className="text-gray-400 text-xl">→</div>
                  <div className="text-3xl">{corridor.destinationFlag}</div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900">
                    {corridor.origin} → {corridor.destination}
                  </div>
                  <div className="text-sm text-gray-500 mt-0.5">
                    {corridor.primarySectors.join(' · ')}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{corridor.demandRationale}</div>
                  <div className="text-xs text-blue-700 mt-1">⚖️ {corridor.legalReadiness}</div>
                </div>

                {/* Score + Priority */}
                <div className="flex-shrink-0 flex flex-col items-end gap-2">
                  <div className="text-2xl font-bold text-blue-600">{corridor.score}</div>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    corridor.priority === 'high'   ? 'bg-green-100 text-green-700' :
                    corridor.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                     'bg-gray-100 text-gray-600'
                  }`}>
                    {corridor.priority}
                  </span>
                </div>
              </div>

              {/* Search Suggestions */}
              <div className="mt-3 ml-12 flex flex-wrap gap-2">
                {corridor.searchSuggestions.slice(0, 2).map((url, sIdx) => {
                  const q = new URL(url).searchParams.get('q') ?? url
                  return (
                    <a
                      key={sIdx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                    >
                      🔍 {q}
                    </a>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legal Note */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
        <strong>Hinweis:</strong> Diese Analyse ist intern und regelbasiert. Suchvorschläge sind manuelle Recherche-Links.
        Kein automatischer Scraping oder Datenabruf. Compliance-Status: safe.
      </div>

    </div>
  )
}
