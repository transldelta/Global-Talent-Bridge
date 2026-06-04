import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { NavBar } from '@/app/_components/NavBar'

export const dynamic = 'force-dynamic'

type CorridorMeta = {
  source_country: string
  target_country: string
  sector: string
}

type Campaign = {
  id: string
  corridor_id: string
  target_audience: string | null
  language: string | null
  recommended_channels: string[]
  landingpage_slug: string | null
  campaign_priority: string
  estimated_reach: number | null
  status: string
  notes: string | null
  created_at: string
  migration_corridors: CorridorMeta
}

const PRIORITY_STYLES: Record<string, string> = {
  critical: 'bg-red-900/30 text-red-300 border-red-800/40',
  high:     'bg-orange-900/30 text-orange-300 border-orange-800/40',
  medium:   'bg-yellow-900/30 text-yellow-300 border-yellow-800/40',
  low:      'bg-gray-800/50 text-gray-400 border-gray-700/40',
}

const STATUS_STYLES: Record<string, string> = {
  draft:            'bg-gray-800/50 text-gray-400 border-gray-700/40',
  ready_for_review: 'bg-blue-900/30 text-blue-300 border-blue-800/40',
  approved:         'bg-green-900/30 text-green-300 border-green-800/40',
  paused:           'bg-yellow-900/30 text-yellow-300 border-yellow-800/40',
  rejected:         'bg-red-900/20 text-red-400 border-red-800/30',
}

const PRIORITY_ICONS: Record<string, string> = {
  critical: '🔥',
  high: '📈',
  medium: '🟡',
  low: '⬇️',
}

const STATUS_LABELS: Record<string, string> = {
  draft: 'Entwurf',
  ready_for_review: 'Zur Prüfung',
  approved: '✅ Genehmigt',
  paused: '⏸ Pausiert',
  rejected: '❌ Abgelehnt',
}

function formatReach(n: number | null): string {
  if (!n) return '—'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return String(n)
}

const LANG_LABELS: Record<string, string> = {
  en: '🇬🇧 Englisch',
  de: '🇩🇪 Deutsch',
  fr: '🇫🇷 Französisch',
  tr: '🇹🇷 Türkisch',
  pt: '🇧🇷 Portugiesisch',
  ar: '🇲🇦 Arabisch',
}

export default async function CampaignsPage() {
  const admin = await getCurrentAdminUser()
  if (!admin) redirect('/login')

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('campaign_recommendations')
    .select(`
      *,
      migration_corridors (source_country, target_country, sector)
    `)
    .order('campaign_priority', { ascending: false })
    .order('estimated_reach', { ascending: false })

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 p-8">
        <p className="text-red-400">Fehler: {error.message}</p>
      </div>
    )
  }

  const campaigns = (data ?? []) as Campaign[]
  const criticalCount = campaigns.filter((c) => c.campaign_priority === 'critical').length
  const approvedCount = campaigns.filter((c) => c.status === 'approved').length
  const totalReach = campaigns.reduce((s, c) => s + (c.estimated_reach ?? 0), 0)

  // Group by priority for display order
  const priorityOrder = ['critical', 'high', 'medium', 'low']
  const byPriority = priorityOrder
    .map((p) => ({ priority: p, items: campaigns.filter((c) => c.campaign_priority === p) }))
    .filter((g) => g.items.length > 0)

  return (
    <>
      <NavBar badge="Admin" badgeColor="purple" />
      <main className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1 text-sm text-gray-500">
              <Link href="/admin/ceo-dashboard" className="hover:text-gray-400">CEO Dashboard</Link>
              <span>·</span>
              <Link href="/admin/global/corridor-intelligence" className="hover:text-gray-400">CI</Link>
              <span>·</span>
              <Link href="/admin/global/corridors" className="hover:text-gray-400">Korridore</Link>
            </div>
            <h1 className="text-2xl font-bold text-white">📣 Kampagnen-Empfehlungen</h1>
            <p className="text-gray-400 text-sm mt-1">
              Strategische Kampagnenplanung je Korridor — Vorbereitung, kein automatisches Senden
            </p>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <KpiCard label="Kampagnen gesamt" value={campaigns.length} color="blue" />
          <KpiCard label="Kritische Priorität" value={criticalCount} color="red" />
          <KpiCard label="Genehmigt" value={approvedCount} color="green" />
          <KpiCard label="Gesamtreichweite" value={formatReach(totalReach)} color="purple" />
        </div>

        {/* Campaigns by priority */}
        {campaigns.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center text-gray-500">
            <div className="text-4xl mb-3">📣</div>
            <div>Noch keine Kampagnen-Empfehlungen. CI-Agent starten um Empfehlungen zu generieren.</div>
          </div>
        ) : (
          <div className="space-y-8">
            {byPriority.map(({ priority, items }) => (
              <div key={priority}>
                <h2 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wide">
                  {PRIORITY_ICONS[priority]} {priority} — {items.length} Kampagne{items.length > 1 ? 'n' : ''}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map((camp) => {
                    const c = camp.migration_corridors
                    const corridorLabel = `${c.source_country} → ${c.target_country}`

                    return (
                      <div
                        key={camp.id}
                        className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors"
                      >
                        {/* Top row */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <h3 className="font-semibold text-white text-sm">{corridorLabel}</h3>
                            <span className="text-xs text-gray-500">{c.sector}</span>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${PRIORITY_STYLES[camp.campaign_priority]}`}>
                              {PRIORITY_ICONS[camp.campaign_priority]} {camp.campaign_priority}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_STYLES[camp.status]}`}>
                              {STATUS_LABELS[camp.status] ?? camp.status}
                            </span>
                          </div>
                        </div>

                        {/* Target audience */}
                        {camp.target_audience && (
                          <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                            🎯 {camp.target_audience}
                          </p>
                        )}

                        {/* Meta row */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {camp.language && (
                            <span className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full">
                              {LANG_LABELS[camp.language] ?? camp.language}
                            </span>
                          )}
                          {camp.estimated_reach && (
                            <span className="text-xs text-green-400 bg-green-900/20 px-2 py-0.5 rounded-full border border-green-800/30">
                              👥 {formatReach(camp.estimated_reach)} Reichweite
                            </span>
                          )}
                          {camp.landingpage_slug && (
                            <span className="text-xs text-blue-400 bg-blue-900/20 px-2 py-0.5 rounded-full border border-blue-800/30">
                              /{camp.landingpage_slug}
                            </span>
                          )}
                        </div>

                        {/* Channels */}
                        {Array.isArray(camp.recommended_channels) && camp.recommended_channels.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {camp.recommended_channels.slice(0, 5).map((ch, i) => (
                              <span key={i} className="text-xs text-gray-500 bg-gray-800/60 px-2 py-0.5 rounded">
                                {ch}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Notes */}
                        {camp.notes && (
                          <p className="text-xs text-gray-500 border-t border-gray-800 pt-2.5 leading-relaxed">
                            {camp.notes}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DSGVO Note */}
        <div className="mt-8 p-4 bg-yellow-900/10 border border-yellow-800/30 rounded-xl text-xs text-yellow-300/70">
          ⚠️ <strong className="text-yellow-300">Wichtig:</strong> Kampagnen-Empfehlungen sind ausschließlich
          Planungsdokumente. Kein automatisches Senden von E-Mails, WhatsApp oder Werbeanzeigen.
          Alle Kampagnen müssen manuell vom Admin genehmigt und durchgeführt werden.
        </div>

      </main>
    </>
  )
}

function KpiCard({ label, value, color }: { label: string; value: number | string; color: string }) {
  const colorMap: Record<string, string> = {
    blue:   'text-blue-300 border-blue-800/40',
    red:    'text-red-300 border-red-800/40',
    green:  'text-green-300 border-green-800/40',
    purple: 'text-purple-300 border-purple-800/40',
  }
  return (
    <div className={`bg-gray-800/50 border rounded-xl p-4 text-center ${colorMap[color] ?? 'border-gray-700 text-gray-400'}`}>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-xs mt-1 text-gray-400">{label}</div>
    </div>
  )
}
