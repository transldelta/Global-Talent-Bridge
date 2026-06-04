import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { NavBar } from '@/app/_components/NavBar'
import { RunLandingpageAgentButton } from './_components/RunLandingpageAgentButton'

export const dynamic = 'force-dynamic'

type CorridorMeta = {
  source_country: string
  target_country: string
  sector: string
}

type LandingpageRow = {
  id: string
  slug: string
  title: string
  language: string
  source_country: string | null
  target_country: string | null
  profession_focus: string | null
  seo_title: string | null
  opportunity_score: number
  priority_level: string | null
  status: string
  created_at: string
  migration_corridors: CorridorMeta | null
}

const STATUS_STYLES: Record<string, string> = {
  draft:            'bg-gray-800/50 text-gray-400 border-gray-700/40',
  ready_for_review: 'bg-blue-900/30 text-blue-300 border-blue-800/40',
  approved:         'bg-purple-900/30 text-purple-300 border-purple-800/40',
  published:        'bg-green-900/30 text-green-300 border-green-800/40',
  paused:           'bg-yellow-900/30 text-yellow-300 border-yellow-800/40',
}

const STATUS_LABELS: Record<string, string> = {
  draft:            '📋 Entwurf',
  ready_for_review: '🔍 Zur Prüfung',
  approved:         '✅ Genehmigt',
  published:        '🌐 Live',
  paused:           '⏸ Pausiert',
}

const PRIORITY_STYLES: Record<string, string> = {
  critical: 'bg-red-900/30 text-red-300 border-red-800/40',
  high:     'bg-orange-900/30 text-orange-300 border-orange-800/40',
  medium:   'bg-yellow-900/30 text-yellow-300 border-yellow-800/40',
  low:      'bg-gray-800/50 text-gray-400 border-gray-700/40',
}

const LANG_FLAGS: Record<string, string> = {
  en: '🇬🇧', de: '🇩🇪', fr: '🇫🇷', tr: '🇹🇷', pt: '🇧🇷', ar: '🇲🇦',
}

const PRIORITY_ICONS: Record<string, string> = {
  critical: '🔥', high: '📈', medium: '🟡', low: '⬇️',
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 85 ? 'bg-red-500' : score >= 70 ? 'bg-orange-500' : score >= 50 ? 'bg-yellow-500' : 'bg-gray-500'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.max(0, Math.min(100, score))}%` }} />
      </div>
      <span className="text-xs text-gray-400 w-6 text-right font-mono">{score}</span>
    </div>
  )
}

export default async function LandingpageFactoryPage() {
  const admin = await getCurrentAdminUser()
  if (!admin) redirect('/login')

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('landingpage_factory')
    .select('*, migration_corridors(source_country, target_country, sector)')
    .order('opportunity_score', { ascending: false })

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 p-8">
        <p className="text-red-400">Fehler: {error.message}</p>
      </div>
    )
  }

  const all = (data ?? []) as unknown as LandingpageRow[]
  const published  = all.filter((lp) => lp.status === 'published')
  const readyForReview = all.filter((lp) => lp.status === 'ready_for_review')
  const critical   = all.filter((lp) => lp.priority_level === 'critical')
  const high       = all.filter((lp) => lp.priority_level === 'high')

  const statusGroups = ['ready_for_review', 'approved', 'published', 'draft', 'paused']
  const byStatus = statusGroups
    .map((s) => ({ status: s, items: all.filter((lp) => lp.status === s) }))
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
              <Link href="/admin/global/corridors" className="hover:text-gray-400">Korridore</Link>
              <span>·</span>
              <Link href="/admin/global/corridor-intelligence" className="hover:text-gray-400">CI</Link>
            </div>
            <h1 className="text-2xl font-bold text-white">🚀 Landingpage Factory</h1>
            <p className="text-gray-400 text-sm mt-1">
              Internationale Karriere-Landingpages — vorbereitet, nicht automatisch veröffentlicht
            </p>
          </div>
          <RunLandingpageAgentButton />
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <KpiCard label="Landingpages gesamt" value={all.length} color="blue" />
          <KpiCard label="Zur Prüfung" value={readyForReview.length} color="orange" />
          <KpiCard label="Kritische Priorität" value={critical.length} color="red" />
          <KpiCard label="Live / Published" value={published.length} color="green" />
        </div>

        {/* Priority overview chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { label: `🔥 Critical (${critical.length})`, style: 'border-red-800/40 bg-red-900/10 text-red-300' },
            { label: `📈 High (${high.length})`, style: 'border-orange-800/40 bg-orange-900/10 text-orange-300' },
            { label: `🔍 Ready for Review (${readyForReview.length})`, style: 'border-blue-800/40 bg-blue-900/10 text-blue-300' },
            { label: `🌐 Published (${published.length})`, style: 'border-green-800/40 bg-green-900/10 text-green-300' },
          ].map(({ label, style }) => (
            <span key={label} className={`text-xs px-3 py-1.5 rounded-full border ${style}`}>{label}</span>
          ))}
        </div>

        {/* Landingpages by status */}
        {all.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center text-gray-500">
            <div className="text-4xl mb-3">🚀</div>
            <div>Noch keine Landingpages. Agent starten um aus Korridor-Daten zu generieren.</div>
          </div>
        ) : (
          <div className="space-y-8">
            {byStatus.map(({ status, items }) => (
              <div key={status}>
                <h2 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wide">
                  {STATUS_LABELS[status]} — {items.length} Seite{items.length > 1 ? 'n' : ''}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {items.map((lp) => {
                    const c = lp.migration_corridors
                    return (
                      <div
                        key={lp.id}
                        className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors"
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white text-sm leading-tight line-clamp-2">
                              {lp.title}
                            </h3>
                            {c && (
                              <p className="text-xs text-gray-500 mt-0.5">
                                {c.source_country} → {c.target_country} · {c.sector}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col gap-1 items-end shrink-0">
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_STYLES[lp.status]}`}>
                              {STATUS_LABELS[lp.status] ?? lp.status}
                            </span>
                            {lp.priority_level && (
                              <span className={`text-xs px-2 py-0.5 rounded-full border ${PRIORITY_STYLES[lp.priority_level]}`}>
                                {PRIORITY_ICONS[lp.priority_level]} {lp.priority_level}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Slug + Language */}
                        <div className="flex items-center gap-2 mb-3">
                          <code className="text-xs text-violet-400 bg-violet-900/20 px-2 py-1 rounded border border-violet-800/30 font-mono truncate flex-1">
                            /corridors/{lp.slug}
                          </code>
                          <span className="text-sm shrink-0">{LANG_FLAGS[lp.language] ?? '🌐'}</span>
                        </div>

                        {/* Score */}
                        <div className="mb-3">
                          <div className="text-xs text-gray-500 mb-1">Opportunity Score</div>
                          <ScoreBar score={lp.opportunity_score} />
                        </div>

                        {/* Profession focus */}
                        {lp.profession_focus && (
                          <p className="text-xs text-gray-500 mb-2 leading-relaxed">
                            💼 {lp.profession_focus}
                          </p>
                        )}

                        {/* SEO title */}
                        {lp.seo_title && (
                          <p className="text-xs text-gray-600 leading-relaxed border-t border-gray-800 pt-2.5 line-clamp-2">
                            🔍 {lp.seo_title}
                          </p>
                        )}

                        {/* Public preview link (published only) */}
                        {lp.status === 'published' && (
                          <div className="mt-2 pt-2 border-t border-gray-800">
                            <Link
                              href={`/corridors/${lp.slug}`}
                              className="text-xs text-green-400 hover:text-green-300 transition-colors"
                              target="_blank"
                            >
                              🔗 Seite ansehen →
                            </Link>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Compliance note */}
        <div className="mt-8 p-4 bg-violet-900/10 border border-violet-800/30 rounded-xl text-xs text-violet-300/70">
          🔒 <strong className="text-violet-300">Hinweis:</strong> Landingpages werden vom Agenten vorbereitet und müssen manuell
          genehmigt und auf &quot;published&quot; gesetzt werden. Kein automatisches Deployment. Kein automatischer Versand.
          SEO-Inhalte sind Vorschläge und müssen vor der Veröffentlichung geprüft werden.
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
