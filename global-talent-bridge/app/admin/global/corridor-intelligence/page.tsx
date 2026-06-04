import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { NavBar } from '@/app/_components/NavBar'
import { RunCIAgentButton } from './_components/RunCIAgentButton'

export const dynamic = 'force-dynamic'

type CorridorRow = {
  id: string
  source_country: string
  target_country: string
  sector: string
  opportunity_score: number
  priority_level: string | null
}

type CIRow = {
  id: string
  corridor_id: string
  top_professions: string[]
  language_requirements: Record<string, string>
  visa_pathways: string[]
  recognition_requirements: Record<string, string>
  estimated_salary_range: Record<string, unknown>
  migration_difficulty: number
  demand_level: number
  opportunity_score: number
  recommended_channels: string[]
  recommended_landingpage_slug: string | null
  notes: string | null
  migration_corridors: CorridorRow
}

const PRIORITY_STYLES: Record<string, string> = {
  critical: 'bg-red-900/30 text-red-300 border-red-800/40',
  high:     'bg-orange-900/30 text-orange-300 border-orange-800/40',
  medium:   'bg-yellow-900/30 text-yellow-300 border-yellow-800/40',
  low:      'bg-gray-800/50 text-gray-400 border-gray-700/40',
}

function derivePriority(score: number): string {
  if (score >= 85) return 'critical'
  if (score >= 70) return 'high'
  if (score >= 50) return 'medium'
  return 'low'
}

function ScoreBar({ score, color }: { score: number; color: string }) {
  const colorMap: Record<string, string> = {
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
  }
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${colorMap[color] ?? 'bg-blue-500'}`}
          style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
        />
      </div>
      <span className="text-xs text-gray-400 w-7 text-right font-mono">{score}</span>
    </div>
  )
}

export default async function CorridorIntelligencePage() {
  const admin = await getCurrentAdminUser()
  if (!admin) redirect('/login')

  const supabase = createAdminClient()

  const { data: rows, error } = await supabase
    .from('corridor_intelligence')
    .select(`
      *,
      migration_corridors (
        id, source_country, target_country, sector,
        opportunity_score, priority_level
      )
    `)
    .order('opportunity_score', { ascending: false })

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 p-8">
        <p className="text-red-400">Fehler: {error.message}</p>
      </div>
    )
  }

  const all = (rows ?? []) as CIRow[]
  const critical = all.filter((r) => derivePriority(r.opportunity_score) === 'critical')
  const high = all.filter((r) => derivePriority(r.opportunity_score) === 'high')
  const avgScore = all.length
    ? Math.round(all.reduce((s, r) => s + r.opportunity_score, 0) / all.length)
    : 0

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
              <Link href="/admin/global/campaigns" className="hover:text-gray-400">Kampagnen</Link>
            </div>
            <h1 className="text-2xl font-bold text-white">🧠 Corridor Intelligence</h1>
            <p className="text-gray-400 text-sm mt-1">
              Tiefes Korridor-Wissen: Berufe, Sprachen, Visa-Wege, Anerkennung, Opportunity Scores
            </p>
          </div>
          <RunCIAgentButton />
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <KpiCard label="Korridore analysiert" value={all.length} color="blue" />
          <KpiCard label="Kritisch (≥85)" value={critical.length} color="red" />
          <KpiCard label="Hoch (≥70)" value={high.length} color="orange" />
          <KpiCard label="Ø Opportunity Score" value={avgScore} color="green" />
        </div>

        {/* Corridor Cards */}
        {all.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center text-gray-500">
            <div className="text-4xl mb-3">🧠</div>
            <div>Noch keine Corridor Intelligence. Agent starten um Analyse zu beginnen.</div>
          </div>
        ) : (
          <div className="space-y-4">
            {all.map((ci) => {
              const c = ci.migration_corridors
              const priority = derivePriority(ci.opportunity_score)
              const label = `${c.source_country} → ${c.target_country}`

              return (
                <div
                  key={ci.id}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors"
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                    <div>
                      <h3 className="font-semibold text-white text-base">{label}</h3>
                      <span className="text-xs text-gray-500">{c.sector}</span>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full border font-medium ${PRIORITY_STYLES[priority]}`}>
                      {priority === 'critical' ? '🔥' : priority === 'high' ? '📈' : priority === 'medium' ? '🟡' : '⬇️'} {priority}
                    </span>
                  </div>

                  {/* Scores */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Opportunity</div>
                      <ScoreBar score={ci.opportunity_score} color="green" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Nachfrage</div>
                      <ScoreBar score={ci.demand_level} color="blue" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Schwierigkeit</div>
                      <ScoreBar score={ci.migration_difficulty} color="orange" />
                    </div>
                  </div>

                  {/* Knowledge columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 text-xs">
                    {/* Top Professions */}
                    {Array.isArray(ci.top_professions) && ci.top_professions.length > 0 && (
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <div className="text-gray-400 font-medium mb-1.5">👔 Top-Berufe</div>
                        <ul className="space-y-0.5">
                          {ci.top_professions.slice(0, 4).map((p, i) => (
                            <li key={i} className="text-gray-300">{p}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Language Requirements */}
                    {ci.language_requirements && Object.keys(ci.language_requirements).length > 0 && (
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <div className="text-gray-400 font-medium mb-1.5">🗣️ Sprache</div>
                        <ul className="space-y-0.5">
                          {Object.entries(ci.language_requirements).slice(0, 4).map(([k, v]) => (
                            <li key={k} className="text-gray-300">
                              <span className="text-gray-500">{k}:</span> {String(v)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Visa Pathways */}
                    {Array.isArray(ci.visa_pathways) && ci.visa_pathways.length > 0 && (
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <div className="text-gray-400 font-medium mb-1.5">🛂 Visa-Wege</div>
                        <ul className="space-y-0.5">
                          {ci.visa_pathways.slice(0, 4).map((v, i) => (
                            <li key={i} className="text-gray-300">{String(v)}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Recommended Channels */}
                    {Array.isArray(ci.recommended_channels) && ci.recommended_channels.length > 0 && (
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <div className="text-gray-400 font-medium mb-1.5">📢 Kanäle</div>
                        <ul className="space-y-0.5">
                          {ci.recommended_channels.slice(0, 4).map((ch, i) => (
                            <li key={i} className="text-gray-300">{ch}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Landingpage slug + notes */}
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    {ci.recommended_landingpage_slug && (
                      <span className="text-xs text-blue-400 bg-blue-900/20 px-2 py-1 rounded border border-blue-800/30">
                        /{ci.recommended_landingpage_slug}
                      </span>
                    )}
                    {ci.notes && (
                      <span className="text-xs text-gray-500 flex-1">{ci.notes}</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* DSGVO Note */}
        <div className="mt-8 p-4 bg-blue-900/10 border border-blue-800/30 rounded-xl text-xs text-blue-300/70">
          🔒 <strong className="text-blue-300">DSGVO-Hinweis:</strong> Corridor Intelligence dient ausschließlich
          der internen strategischen Analyse. Kein automatisches Scraping, kein automatisches Senden,
          keine externen API-Aufrufe. Alle Aktionen müssen manuell vom Admin initiiert werden.
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
