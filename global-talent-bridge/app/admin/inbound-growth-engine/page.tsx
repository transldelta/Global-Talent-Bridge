/**
 * app/admin/inbound-growth-engine/page.tsx
 *
 * Inbound Growth Engine — sichere Wachstumskanäle
 */
import { redirect }            from 'next/navigation'
import { getCurrentAdminUser } from '@/lib/admin'
import { getInboundChannels, getContentCalendar, getSEOClusters, getRegistrationFunnels, getGrowthSummary } from '@/lib/cwo-agent'

export const dynamic = 'force-dynamic'

export default async function InboundGrowthEnginePage() {
  const user = await getCurrentAdminUser()
  if (!user) redirect('/auth/login?redirectTo=/admin/inbound-growth-engine')

  const channels  = getInboundChannels()
  const calendar  = getContentCalendar()
  const seo       = getSEOClusters()
  const funnels   = getRegistrationFunnels()
  const summary   = getGrowthSummary()

  const effortColor = (e: string) => e === 'low' ? 'bg-green-100 text-green-700' : e === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
  const typeIcon: Record<string, string> = {
    blog: '📝', landing_page: '📄', social_post: '📣', email_template: '✉️', corridor_page: '🛤️'
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

      <div>
        <h1 className="text-3xl font-bold text-gray-900">📈 Inbound Growth Engine</h1>
        <p className="text-gray-500 mt-1">Sichere Wachstumskanäle — kein Spam, kein Bulk-Outreach, kein E-Mail-Versand</p>
      </div>

      {/* Safety Banner */}
      <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-green-600">🛡️</span>
          <span className="text-sm font-semibold text-green-800">Alle Kanäle sind Inbound — Nutzer kommen zu CorridorWork. Kein automatischer Outbound.</span>
        </div>
        <div className="mt-1 text-xs text-green-700 flex gap-4 flex-wrap">
          <span>✓ noEmailSent: true</span>
          <span>✓ noAutoOutreach: true</span>
          <span>✓ EMAIL_PROVIDER: none</span>
          <span>✓ DSGVO-konform</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-blue-600">{summary.totalChannels}</div>
          <div className="text-xs text-gray-500">Inbound-Kanäle</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-600">{summary.contentItemsPlanned}</div>
          <div className="text-xs text-gray-500">Content-Items geplant</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-sm font-bold text-purple-600">{summary.estimatedFirstLeadWeeks}</div>
          <div className="text-xs text-gray-500">Erster Lead erwartet</div>
        </div>
      </div>

      {/* Channels */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">📡 Inbound-Kanäle</h2>
        <div className="space-y-4">
          {channels.map(channel => (
            <div key={channel.id} className="border border-gray-100 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl flex-shrink-0">{channel.channelIcon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900">{channel.channel}</span>
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${effortColor(channel.effort)}`}>
                      Aufwand: {channel.effort}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                      channel.priority === 'high' ? 'bg-red-100 text-red-700' : channel.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                    }`}>{channel.priority}</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{channel.description}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    📊 {channel.estimatedReach} · ⏱️ Erster Lead: {channel.timeToFirstLead}
                  </div>
                  <ul className="mt-2 space-y-1">
                    {channel.actionItems.slice(0, 3).map((item, i) => (
                      <li key={i} className={`text-xs flex items-start gap-1 ${item.startsWith('⚠️') ? 'text-amber-700' : 'text-gray-600'}`}>
                        <span className="flex-shrink-0">{item.startsWith('⚠️') ? '' : '→'}</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="text-xs text-green-700 mt-2">⚖️ {channel.complianceNote}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Calendar */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">📅 Content-Kalender (Wochen 1–4)</h2>
        <div className="space-y-3">
          {calendar.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">W{item.week}</div>
              <div className="text-xl flex-shrink-0">{typeIcon[item.type] ?? '📌'}</div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm">{item.title}</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.seoKeywords.slice(0, 2).map((kw, ki) => (
                    <span key={ki} className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">{kw}</span>
                  ))}
                </div>
                <div className="text-xs text-amber-700 mt-1">⚖️ {item.complianceNote}</div>
              </div>
              <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded ${
                item.status === 'ready' ? 'bg-green-100 text-green-700' :
                item.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-600'
              }`}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SEO Clusters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">🔍 SEO-Cluster-Plan</h2>
        <div className="space-y-3">
          {seo.map((cluster, idx) => (
            <div key={idx} className="border border-gray-100 rounded-lg p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{cluster.cluster}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{cluster.pageType} · ~{cluster.estimatedMonthlySearches} Suchen/Monat</div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {cluster.keywords.map((kw, ki) => (
                      <span key={ki} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{kw}</span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                    cluster.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>{cluster.priority}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    cluster.competitionLevel === 'low' ? 'bg-green-100 text-green-700' :
                    cluster.competitionLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>Wettbewerb: {cluster.competitionLevel}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Registration Funnels */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">🔄 Registrierungs-Funnels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {funnels.map(funnel => (
            <div key={funnel.id} className="border border-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold text-gray-900">{funnel.funnelName}</div>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  funnel.currentStatus === 'active' ? 'bg-green-100 text-green-700' :
                  funnel.currentStatus === 'blocked' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-600'
                }`}>{funnel.currentStatus}</span>
              </div>
              <ol className="space-y-1">
                {funnel.steps.map((step, si) => (
                  <li key={si} className="text-xs text-gray-600 flex items-start gap-2">
                    <span className="flex-shrink-0 w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">{si + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
