/**
 * app/admin/candidate-magnet/page.tsx
 *
 * Candidate Magnet — Inbound-Strategie für Bewerber
 */
import { redirect }            from 'next/navigation'
import { getCurrentAdminUser } from '@/lib/admin'
import { getCandidateMagnetAssets, getTopCandidateAssets, getAssetsByAudience, getComplianceSummary } from '@/lib/cwo-agent'

export const dynamic = 'force-dynamic'

export default async function CandidateMagnetPage() {
  const user = await getCurrentAdminUser()
  if (!user) redirect('/auth/login?redirectTo=/admin/candidate-magnet')

  const assets        = getCandidateMagnetAssets()
  const topAssets     = getTopCandidateAssets(5)
  const complianceSummary = getComplianceSummary()
  const employerAssets = getAssetsByAudience('employer')
  const candidateAssets = getAssetsByAudience('candidate')

  const typeLabels: Record<string, string> = {
    landing_page:  '📄 Landingpage',
    employer_page: '🏢 Arbeitgeber',
    country_page:  '🌐 Länderseite',
    seo_content:   '📝 SEO-Content',
    corridor_page: '🛤️ Korridor',
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

      <div>
        <h1 className="text-3xl font-bold text-gray-900">🧲 Candidate Magnet</h1>
        <p className="text-gray-500 mt-1">Legale Inbound-Strategie — SEO, Landingpages, Korridorseiten. Kein Spam.</p>
      </div>

      {/* Compliance Banner */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-green-600 text-xl">✅</span>
          <div>
            <div className="font-semibold text-green-900">Compliance: {complianceSummary.safe} Assets safe</div>
            <div className="text-sm text-green-700">
              {complianceSummary.needs_review > 0 && `${complianceSummary.needs_review} needs_review · `}
              {complianceSummary.blocked > 0 && `${complianceSummary.blocked} blocked · `}
              Keine falschen Jobversprechen · Keine Visa-Garantien
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-blue-600">{assets.length}</div>
          <div className="text-xs text-gray-500">Gesamt-Assets</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-purple-600">{candidateAssets.length}</div>
          <div className="text-xs text-gray-500">Kandidaten-Assets</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-600">{employerAssets.length}</div>
          <div className="text-xs text-gray-500">Arbeitgeber-Assets</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-orange-600">{assets.filter(a => a.priority === 'high').length}</div>
          <div className="text-xs text-gray-500">Hohe Priorität</div>
        </div>
      </div>

      {/* Top 5 Assets */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">⭐ Top-5 Assets (Prio-sortiert)</h2>
        <div className="space-y-3">
          {topAssets.map((asset, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-600 text-sm font-bold flex items-center justify-center">{idx + 1}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium">
                    {typeLabels[asset.type] ?? asset.type}
                  </span>
                  {asset.targetCountry && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{asset.targetCountry}</span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                    asset.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>{asset.priority}</span>
                </div>
                <div className="font-medium text-gray-900 mt-1">{asset.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{asset.description}</div>
                <div className="text-xs text-amber-700 mt-1">⚖️ {asset.complianceNote}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Assets */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Alle Assets ({assets.length})</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {assets.map((asset, idx) => (
            <div key={idx} className="p-4 hover:bg-gray-50">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                      {typeLabels[asset.type] ?? asset.type}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      asset.audience === 'employer' ? 'bg-purple-100 text-purple-700' :
                      asset.audience === 'candidate' ? 'bg-green-100 text-green-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {asset.audience === 'both' ? '👥 Beide' : asset.audience === 'employer' ? '🏢 Arbeitgeber' : '👤 Kandidat'}
                    </span>
                  </div>
                  <div className="font-medium text-gray-900 mt-1">{asset.title}</div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {asset.seoKeywords.slice(0, 3).map((kw, ki) => (
                      <span key={ki} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{kw}</span>
                    ))}
                  </div>
                </div>
                <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded font-semibold ${
                  asset.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                }`}>{asset.priority}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
