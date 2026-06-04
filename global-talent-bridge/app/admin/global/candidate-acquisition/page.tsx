import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { NavBar } from '@/app/_components/NavBar'
import { RunGCAAgentButton } from './_components/RunGCAAgentButton'

export const dynamic = 'force-dynamic'

type AcqSource = {
  id: string
  source_name: string
  country: string | null
  language: string | null
  source_type: string | null
  profession_focus: string | null
  estimated_audience: number
  quality_score: number
  opportunity_score: number
  priority_level: string | null
  acquisition_difficulty: number
  notes: string | null
  status: string
}

const TYPE_STYLES: Record<string, string> = {
  university:       'bg-blue-900/20 text-blue-300 border-blue-800/30',
  language_school:  'bg-purple-900/20 text-purple-300 border-purple-800/30',
  community:        'bg-green-900/20 text-green-300 border-green-800/30',
  job_board:        'bg-yellow-900/20 text-yellow-300 border-yellow-800/30',
  association:      'bg-orange-900/20 text-orange-300 border-orange-800/30',
  recruiter:        'bg-red-900/20 text-red-300 border-red-800/30',
  training_center:  'bg-teal-900/20 text-teal-300 border-teal-800/30',
  migration_forum:  'bg-pink-900/20 text-pink-300 border-pink-800/30',
}

const TYPE_LABELS: Record<string, string> = {
  university:       '🎓 Universität',
  language_school:  '🗣️ Sprachschule',
  community:        '👥 Community',
  job_board:        '💼 Job-Board',
  association:      '🤝 Verband',
  recruiter:        '🎯 Recruiter',
  training_center:  '🏫 Ausbildung',
  migration_forum:  '🌐 Migration Forum',
}

const PRIORITY_STYLES: Record<string, string> = {
  critical: 'bg-red-900/30 text-red-300 border-red-800/40',
  high:     'bg-orange-900/30 text-orange-300 border-orange-800/40',
  medium:   'bg-yellow-900/30 text-yellow-300 border-yellow-800/40',
  low:      'bg-gray-800/50 text-gray-400 border-gray-700/40',
}

function formatAudience(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`
  return String(n)
}

function ScoreBar({ score, color }: { score: number; color: 'green' | 'blue' | 'red' | 'orange' }) {
  const colorMap = {
    green: 'bg-green-500', blue: 'bg-blue-500',
    red: 'bg-red-500', orange: 'bg-orange-500',
  }
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${colorMap[color]}`} style={{ width: `${Math.max(0, Math.min(100, score))}%` }} />
      </div>
      <span className="text-xs text-gray-400 w-6 text-right font-mono">{score}</span>
    </div>
  )
}

export default async function CandidateAcquisitionPage() {
  const admin = await getCurrentAdminUser()
  if (!admin) redirect('/login')

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('candidate_acquisition_sources')
    .select('*')
    .order('opportunity_score', { ascending: false })

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 p-8">
        <p className="text-red-400">Fehler: {error.message}</p>
      </div>
    )
  }

  const all = (data ?? []) as AcqSource[]
  const active = all.filter((s) => s.status === 'active')
  const critical = all.filter((s) => s.priority_level === 'critical')
  const high = all.filter((s) => s.priority_level === 'high')
  const totalAudience = all.reduce((sum, s) => sum + s.estimated_audience, 0)

  const byType = all.reduce<Record<string, number>>((acc, s) => {
    const t = s.source_type ?? 'other'
    acc[t] = (acc[t] ?? 0) + 1
    return acc
  }, {})

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
              <Link href="/admin/global/landingpages" className="hover:text-gray-400">Landingpages</Link>
            </div>
            <h1 className="text-2xl font-bold text-white">🎯 Candidate Acquisition</h1>
            <p className="text-gray-400 text-sm mt-1">
              Globale Kandidatenquellen — analysiert, priorisiert, nicht automatisch kontaktiert
            </p>
          </div>
          <RunGCAAgentButton />
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <KpiCard label="Aktive Quellen" value={active.length} color="blue" />
          <KpiCard label="Kritisch (≥85)" value={critical.length} color="red" />
          <KpiCard label="Hoch (≥70)" value={high.length} color="orange" />
          <KpiCard label="Gesamtreichweite" value={formatAudience(totalAudience)} color="green" />
        </div>

        {/* Type filter chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(byType).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
            <span key={type} className={`text-xs px-3 py-1.5 rounded-full border ${TYPE_STYLES[type] ?? 'border-gray-700 text-gray-400 bg-gray-800/30'}`}>
              {TYPE_LABELS[type] ?? type} · {count}
            </span>
          ))}
        </div>

        {/* Source cards */}
        {all.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center text-gray-500">
            <div className="text-4xl mb-3">🎯</div>
            <div>Noch keine Quellen. GCA-Agent starten um Analyse zu beginnen.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {all.map((src) => (
              <div
                key={src.id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors"
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-sm leading-tight">{src.source_name}</h3>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {src.country && (
                        <span className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full">
                          📍 {src.country}
                        </span>
                      )}
                      {src.language && (
                        <span className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full">
                          🗣️ {src.language}
                        </span>
                      )}
                      {src.profession_focus && (
                        <span className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full">
                          💼 {src.profession_focus}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 items-end shrink-0">
                    {src.source_type && (
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${TYPE_STYLES[src.source_type] ?? 'border-gray-700 text-gray-400'}`}>
                        {TYPE_LABELS[src.source_type] ?? src.source_type}
                      </span>
                    )}
                    {src.priority_level && (
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${PRIORITY_STYLES[src.priority_level]}`}>
                        {src.priority_level === 'critical' ? '🔥' : src.priority_level === 'high' ? '📈' : '🟡'} {src.priority_level}
                      </span>
                    )}
                  </div>
                </div>

                {/* Scores */}
                <div className="space-y-2 mb-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Opportunity Score</div>
                    <ScoreBar score={src.opportunity_score} color="green" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Qualität</div>
                    <ScoreBar score={src.quality_score} color="blue" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Schwierigkeit</div>
                    <ScoreBar score={src.acquisition_difficulty} color="orange" />
                  </div>
                </div>

                {/* Audience */}
                <div className="flex justify-between text-xs mb-3">
                  <span className="text-gray-500">Geschätzte Reichweite</span>
                  <span className="text-white font-semibold">{formatAudience(src.estimated_audience)}</span>
                </div>

                {/* Notes */}
                {src.notes && (
                  <p className="text-xs text-gray-500 leading-relaxed border-t border-gray-800 pt-3">
                    {src.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* DSGVO Note */}
        <div className="mt-8 p-4 bg-blue-900/10 border border-blue-800/30 rounded-xl text-xs text-blue-300/70">
          🔒 <strong className="text-blue-300">DSGVO-Hinweis:</strong> Kandidatenquellen werden nur für
          interne Strategieentwicklung genutzt. Kein automatisches Scraping. Kein automatisches Kontaktieren.
          Alle Outreach-Aktionen müssen manuell durch den Admin initiiert werden.
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
