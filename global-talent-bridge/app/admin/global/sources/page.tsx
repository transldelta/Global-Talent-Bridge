import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { NavBar } from '@/app/_components/NavBar'

export const dynamic = 'force-dynamic'

type CandidateSource = {
  id: string
  source_name: string
  source_country: string | null
  language: string | null
  source_type: string | null
  estimated_audience: number
  priority_score: number
  notes: string | null
  status: string | null
  created_at: string
}

const TYPE_STYLES: Record<string, string> = {
  university:      'bg-blue-900/20 text-blue-300 border-blue-800/30',
  language_school: 'bg-purple-900/20 text-purple-300 border-purple-800/30',
  community:       'bg-green-900/20 text-green-300 border-green-800/30',
  job_board:       'bg-yellow-900/20 text-yellow-300 border-yellow-800/30',
  association:     'bg-orange-900/20 text-orange-300 border-orange-800/30',
  social_network:  'bg-pink-900/20 text-pink-300 border-pink-800/30',
  referral:        'bg-teal-900/20 text-teal-300 border-teal-800/30',
  recruiter:       'bg-red-900/20 text-red-300 border-red-800/30',
}

const TYPE_LABELS: Record<string, string> = {
  university:      '🎓 Universität',
  language_school: '🗣️ Sprachschule',
  community:       '👥 Community',
  job_board:       '💼 Job-Board',
  association:     '🤝 Verband',
  social_network:  '📱 Social Media',
  referral:        '🔗 Empfehlung',
  recruiter:       '🎯 Recruiter',
}

function formatAudience(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return String(n)
}

function PriorityBar({ score }: { score: number }) {
  const color =
    score >= 85 ? 'bg-red-500' :
    score >= 70 ? 'bg-orange-500' :
    score >= 50 ? 'bg-yellow-500' : 'bg-gray-500'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.max(0, Math.min(100, score))}%` }} />
      </div>
      <span className="text-xs text-gray-400 w-6 text-right font-medium">{score}</span>
    </div>
  )
}

export default async function SourcesPage() {
  const admin = await getCurrentAdminUser()
  if (!admin) redirect('/login')

  const supabase = createAdminClient()

  const { data: sources, error } = await supabase
    .from('candidate_sources')
    .select('*')
    .order('priority_score', { ascending: false })

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 p-8">
        <p className="text-red-400">Fehler: {error.message}</p>
      </div>
    )
  }

  const all = (sources ?? []) as CandidateSource[]
  const active = all.filter((s) => s.status === 'active')
  const totalAudience = all.reduce((sum, s) => sum + (s.estimated_audience ?? 0), 0)
  const highPriority = all.filter((s) => s.priority_score >= 75)

  // Gruppiert nach source_type
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
            </div>
            <h1 className="text-2xl font-bold text-white">🎯 Kandidatenquellen</h1>
            <p className="text-gray-400 text-sm mt-1">
              Globale Quellen für internationales Talent-Recruiting — analysiert, nicht automatisch kontaktiert
            </p>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <KpiCard label="Aktive Quellen" value={active.length} color="blue" />
          <KpiCard label="Hohe Priorität (≥75)" value={highPriority.length} color="orange" />
          <KpiCard label="Gesamtreichweite" value={formatAudience(totalAudience)} color="green" />
          <KpiCard label="Quellentypen" value={Object.keys(byType).length} color="purple" />
        </div>

        {/* Type Summary */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(byType).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
            <span key={type} className={`text-xs px-3 py-1.5 rounded-full border ${TYPE_STYLES[type] ?? 'border-gray-700 text-gray-400 bg-gray-800/30'}`}>
              {TYPE_LABELS[type] ?? type} · {count}
            </span>
          ))}
        </div>

        {/* Sources Grid */}
        {all.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center text-gray-500">
            <div className="text-4xl mb-3">🎯</div>
            <div>Noch keine Kandidatenquellen. GMI-Agent starten um Daten zu analysieren.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {all.map((s) => (
              <div
                key={s.id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors"
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-sm leading-tight">{s.source_name}</h3>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {s.source_country && (
                        <span className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full">
                          📍 {s.source_country}
                        </span>
                      )}
                      {s.language && (
                        <span className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full">
                          🗣️ {s.language}
                        </span>
                      )}
                    </div>
                  </div>
                  {s.source_type && (
                    <span className={`text-xs px-2 py-1 rounded-full border shrink-0 ${TYPE_STYLES[s.source_type] ?? 'border-gray-700 text-gray-400'}`}>
                      {TYPE_LABELS[s.source_type] ?? s.source_type}
                    </span>
                  )}
                </div>

                {/* Metrics */}
                <div className="space-y-2 mb-3">
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Priorität</span>
                      <span className={s.priority_score >= 85 ? 'text-red-400' : s.priority_score >= 70 ? 'text-orange-400' : 'text-gray-400'}>
                        {s.priority_score >= 85 ? '🔥' : s.priority_score >= 70 ? '📈' : '🟡'}
                      </span>
                    </div>
                    <PriorityBar score={s.priority_score} />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Geschätzte Reichweite</span>
                    <span className="text-white font-semibold">{formatAudience(s.estimated_audience)}</span>
                  </div>
                </div>

                {/* Notes */}
                {s.notes && (
                  <p className="text-xs text-gray-500 leading-relaxed border-t border-gray-800 pt-3">
                    {s.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* DSGVO Note */}
        <div className="mt-8 p-4 bg-blue-900/10 border border-blue-800/30 rounded-xl text-xs text-blue-300/70">
          🔒 <strong className="text-blue-300">DSGVO-Hinweis:</strong> Diese Quellen werden nur für interne Analyse
          und manuelle Outreach-Vorbereitung genutzt. Kein automatisches Scraping. Kein automatisches Senden.
          Alle Aktionen müssen manuell durch den Admin initiiert werden.
        </div>

      </main>
    </>
  )
}

function KpiCard({ label, value, color }: { label: string; value: number | string; color: string }) {
  const colorMap: Record<string, string> = {
    blue:   'text-blue-300 border-blue-800/40',
    orange: 'text-orange-300 border-orange-800/40',
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
