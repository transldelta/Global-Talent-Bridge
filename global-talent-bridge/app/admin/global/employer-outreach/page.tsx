import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { NavBar } from '@/app/_components/NavBar'

export const dynamic = 'force-dynamic'

type SourceMeta = {
  source_name: string
  country: string | null
  sector: string | null
  opportunity_score: number
  priority_level: string | null
}

type OutreachRec = {
  id: string
  source_id: string | null
  recommended_message_type: string | null
  recommended_channel: string | null
  priority_level: string | null
  notes: string | null
  status: string
  created_at: string
  employer_acquisition_sources: SourceMeta | null
}

const PRIORITY_STYLES: Record<string, string> = {
  critical: 'bg-red-900/30 text-red-300 border-red-800/40',
  high:     'bg-orange-900/30 text-orange-300 border-orange-800/40',
  medium:   'bg-yellow-900/30 text-yellow-300 border-yellow-800/40',
  low:      'bg-gray-800/50 text-gray-400 border-gray-700/40',
}

const STATUS_STYLES: Record<string, string> = {
  draft:             'bg-gray-800/50 text-gray-400 border-gray-700/40',
  ready_for_review:  'bg-blue-900/30 text-blue-300 border-blue-800/40',
  approved:          'bg-green-900/30 text-green-300 border-green-800/40',
  paused:            'bg-yellow-900/30 text-yellow-300 border-yellow-800/40',
}

const STATUS_LABELS: Record<string, string> = {
  draft:            '📋 Entwurf',
  ready_for_review: '🔍 Zur Prüfung',
  approved:         '✅ Genehmigt',
  paused:           '⏸ Pausiert',
}

const PRIORITY_ICONS: Record<string, string> = {
  critical: '🔥', high: '📈', medium: '🟡', low: '⬇️',
}

const MSG_TYPE_LABELS: Record<string, string> = {
  case_study_nursing_shortage:   '📋 Pflege-Fallstudie',
  talent_pipeline_offer:         '🔗 Talent-Pipeline',
  engineering_talent_proposal:   '⚙️ Engineering-Talent',
  industrial_talent_partnership: '🏭 Industrie-Partnerschaft',
  general_partnership_proposal:  '🤝 Allgemeine Partnerschaft',
}

export default async function EmployerOutreachPage() {
  const admin = await getCurrentAdminUser()
  if (!admin) redirect('/login')

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('employer_outreach_recommendations')
    .select(`*, employer_acquisition_sources(source_name, country, sector, opportunity_score, priority_level)`)
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 p-8">
        <p className="text-red-400">Fehler: {error.message}</p>
      </div>
    )
  }

  const all = (data ?? []) as unknown as OutreachRec[]
  const approved = all.filter((r) => r.status === 'approved')
  const readyForReview = all.filter((r) => r.status === 'ready_for_review')
  const critical = all.filter((r) => r.priority_level === 'critical')

  const priorityOrder = ['critical', 'high', 'medium', 'low']
  const byPriority = priorityOrder
    .map((p) => ({ priority: p, items: all.filter((r) => r.priority_level === p) }))
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
              <Link href="/admin/global/employer-acquisition" className="hover:text-gray-400">Employer Acquisition</Link>
              <span>·</span>
              <Link href="/admin/global/corridors" className="hover:text-gray-400">Korridore</Link>
            </div>
            <h1 className="text-2xl font-bold text-white">📋 Employer Outreach-Empfehlungen</h1>
            <p className="text-gray-400 text-sm mt-1">
              Kanalempfehlungen und Nachrichtentypen — kein automatisches Senden
            </p>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <KpiCard label="Empfehlungen gesamt" value={all.length} color="blue" />
          <KpiCard label="Kritische Priorität" value={critical.length} color="red" />
          <KpiCard label="Zur Prüfung" value={readyForReview.length} color="orange" />
          <KpiCard label="Genehmigt" value={approved.length} color="green" />
        </div>

        {/* Recommendations by priority */}
        {all.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center text-gray-500">
            <div className="text-4xl mb-3">📋</div>
            <div>Noch keine Outreach-Empfehlungen. GEA-Agent starten.</div>
            <div className="mt-3">
              <Link href="/admin/global/employer-acquisition" className="text-sm text-emerald-400 hover:text-emerald-300">
                → Employer Acquisition öffnen
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {byPriority.map(({ priority, items }) => (
              <div key={priority}>
                <h2 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wide">
                  {PRIORITY_ICONS[priority]} {priority} — {items.length} Empfehlung{items.length > 1 ? 'en' : ''}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map((rec) => {
                    const src = rec.employer_acquisition_sources
                    return (
                      <div
                        key={rec.id}
                        className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors"
                      >
                        {/* Top row */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white text-sm leading-tight">
                              {src?.source_name ?? '—'}
                            </h3>
                            {src && (
                              <span className="text-xs text-gray-500">
                                {src.country} · {src.sector} · Score: {src.opportunity_score}/100
                              </span>
                            )}
                          </div>
                          <div className="flex gap-1.5 shrink-0 flex-wrap justify-end">
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${PRIORITY_STYLES[rec.priority_level ?? 'low']}`}>
                              {PRIORITY_ICONS[rec.priority_level ?? 'low']} {rec.priority_level ?? 'low'}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_STYLES[rec.status]}`}>
                              {STATUS_LABELS[rec.status] ?? rec.status}
                            </span>
                          </div>
                        </div>

                        {/* Channel + Message type */}
                        <div className="space-y-2 mb-3">
                          {rec.recommended_channel && (
                            <div className="flex items-start gap-2">
                              <span className="text-xs text-gray-500 shrink-0 w-16">Kanal:</span>
                              <span className="text-xs text-gray-300">{rec.recommended_channel}</span>
                            </div>
                          )}
                          {rec.recommended_message_type && (
                            <div className="flex items-start gap-2">
                              <span className="text-xs text-gray-500 shrink-0 w-16">Nachricht:</span>
                              <span className="text-xs text-gray-300">
                                {MSG_TYPE_LABELS[rec.recommended_message_type] ?? rec.recommended_message_type}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Notes */}
                        {rec.notes && (
                          <p className="text-xs text-gray-500 border-t border-gray-800 pt-2.5 leading-relaxed">
                            {rec.notes}
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

        {/* Compliance Note */}
        <div className="mt-8 p-4 bg-amber-900/10 border border-amber-800/30 rounded-xl text-xs text-amber-300/70">
          ⚠️ <strong className="text-amber-300">Hinweis:</strong> Outreach-Empfehlungen sind Planungsdokumente.
          Kein automatisches Kontaktieren von Arbeitgebern. Kein automatisches Senden von E-Mails oder Nachrichten.
          Alle Outreach-Aktionen müssen manuell durch den Admin initiiert und dokumentiert werden.
        </div>

      </main>
    </>
  )
}

function KpiCard({ label, value, color }: { label: string; value: number | string; color: string }) {
  const colorMap: Record<string, string> = {
    blue:   'text-blue-300 border-blue-800/40',
    red:    'text-red-300 border-red-800/40',
    orange: 'text-orange-300 border-orange-800/40',
    green:  'text-green-300 border-green-800/40',
  }
  return (
    <div className={`bg-gray-800/50 border rounded-xl p-4 text-center ${colorMap[color] ?? 'border-gray-700 text-gray-400'}`}>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-xs mt-1 text-gray-400">{label}</div>
    </div>
  )
}
