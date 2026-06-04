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

type LandingpageRow = {
  id: string
  corridor_id: string | null
  title: string
  language: string
  slug: string
  target_audience: string | null
  priority: string
  notes: string | null
  status: string
  created_at: string
  migration_corridors: CorridorMeta | null
}

const PRIORITY_STYLES: Record<string, string> = {
  critical: 'bg-red-900/30 text-red-300 border-red-800/40',
  high:     'bg-orange-900/30 text-orange-300 border-orange-800/40',
  medium:   'bg-yellow-900/30 text-yellow-300 border-yellow-800/40',
  low:      'bg-gray-800/50 text-gray-400 border-gray-700/40',
}

const STATUS_STYLES: Record<string, string> = {
  planned:     'bg-gray-800/50 text-gray-400 border-gray-700/40',
  in_progress: 'bg-blue-900/30 text-blue-300 border-blue-800/40',
  live:        'bg-green-900/30 text-green-300 border-green-800/40',
  paused:      'bg-yellow-900/30 text-yellow-300 border-yellow-800/40',
}

const STATUS_LABELS: Record<string, string> = {
  planned: '📋 Geplant',
  in_progress: '🔨 In Arbeit',
  live: '✅ Live',
  paused: '⏸ Pausiert',
}

const PRIORITY_ICONS: Record<string, string> = {
  critical: '🔥', high: '📈', medium: '🟡', low: '⬇️',
}

const LANG_FLAGS: Record<string, string> = {
  en: '🇬🇧', de: '🇩🇪', fr: '🇫🇷', tr: '🇹🇷', pt: '🇧🇷', ar: '🇲🇦',
}

export default async function LandingpagesPage() {
  const admin = await getCurrentAdminUser()
  if (!admin) redirect('/login')

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('landingpage_recommendations')
    .select(`*, migration_corridors(source_country, target_country, sector)`)
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 p-8">
        <p className="text-red-400">Fehler: {error.message}</p>
      </div>
    )
  }

  const all = (data ?? []) as LandingpageRow[]
  const live = all.filter((lp) => lp.status === 'live')
  const critical = all.filter((lp) => lp.priority === 'critical')
  const planned = all.filter((lp) => lp.status === 'planned')

  const priorityOrder = ['critical', 'high', 'medium', 'low']
  const byPriority = priorityOrder
    .map((p) => ({ priority: p, items: all.filter((lp) => lp.priority === p) }))
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
              <Link href="/admin/global/candidate-acquisition" className="hover:text-gray-400">Akquisition</Link>
              <span>·</span>
              <Link href="/admin/global/corridors" className="hover:text-gray-400">Korridore</Link>
            </div>
            <h1 className="text-2xl font-bold text-white">🌐 Landingpage-Empfehlungen</h1>
            <p className="text-gray-400 text-sm mt-1">
              Korridor-spezifische Landing Pages — Strategie und Priorisierung, kein automatisches Deployment
            </p>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <KpiCard label="Landingpages gesamt" value={all.length} color="blue" />
          <KpiCard label="Kritische Priorität" value={critical.length} color="red" />
          <KpiCard label="Live" value={live.length} color="green" />
          <KpiCard label="Geplant" value={planned.length} color="purple" />
        </div>

        {/* Landingpages by priority */}
        {all.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center text-gray-500">
            <div className="text-4xl mb-3">🌐</div>
            <div>Noch keine Landingpage-Empfehlungen. GCA-Agent starten.</div>
          </div>
        ) : (
          <div className="space-y-8">
            {byPriority.map(({ priority, items }) => (
              <div key={priority}>
                <h2 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wide">
                  {PRIORITY_ICONS[priority]} {priority} — {items.length} Landingpage{items.length > 1 ? 's' : ''}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map((lp) => {
                    const c = lp.migration_corridors
                    return (
                      <div
                        key={lp.id}
                        className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors"
                      >
                        {/* Top row */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white text-sm leading-tight">{lp.title}</h3>
                            {c && (
                              <span className="text-xs text-gray-500">
                                {c.source_country} → {c.target_country} · {c.sector}
                              </span>
                            )}
                          </div>
                          <div className="flex gap-1.5 shrink-0 flex-wrap justify-end">
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${PRIORITY_STYLES[lp.priority]}`}>
                              {PRIORITY_ICONS[lp.priority]} {lp.priority}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_STYLES[lp.status]}`}>
                              {STATUS_LABELS[lp.status] ?? lp.status}
                            </span>
                          </div>
                        </div>

                        {/* Slug + Language */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <code className="text-xs text-blue-400 bg-blue-900/20 px-2 py-1 rounded border border-blue-800/30 font-mono">
                            /{lp.slug}
                          </code>
                          <span className="text-xs text-gray-400">
                            {LANG_FLAGS[lp.language] ?? '🌐'} {lp.language}
                          </span>
                        </div>

                        {/* Target audience */}
                        {lp.target_audience && (
                          <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                            🎯 {lp.target_audience}
                          </p>
                        )}

                        {/* Notes */}
                        {lp.notes && (
                          <p className="text-xs text-gray-500 border-t border-gray-800 pt-2.5 leading-relaxed">
                            {lp.notes}
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
          ⚠️ <strong className="text-yellow-300">Hinweis:</strong> Landingpage-Empfehlungen sind Planungsdokumente.
          Kein automatisches Deployment. Kein automatisches Senden. Alle Seiten müssen manuell erstellt und
          freigegeben werden.
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
