import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { NavBar } from '@/app/_components/NavBar'

export const dynamic = 'force-dynamic'

type Corridor = {
  id: string
  source_country: string
  target_country: string
  sector: string
  language_requirement: string | null
  visa_pathway: string | null
  recognition_requirement: string | null
  estimated_supply_score: number
  estimated_demand_score: number
  opportunity_score: number
  priority_level: string
  status: string
  notes: string | null
  created_at: string
  updated_at: string
}

const PRIORITY_STYLES: Record<string, string> = {
  critical: 'bg-red-900/30 text-red-300 border-red-800/40',
  high:     'bg-orange-900/30 text-orange-300 border-orange-800/40',
  medium:   'bg-yellow-900/20 text-yellow-300 border-yellow-800/30',
  low:      'bg-gray-800/50 text-gray-400 border-gray-700/50',
}

const STATUS_STYLES: Record<string, string> = {
  active:     'bg-green-900/20 text-green-400',
  paused:     'bg-yellow-900/20 text-yellow-400',
  research:   'bg-blue-900/20 text-blue-400',
  deprecated: 'bg-gray-800 text-gray-500',
}

function ScoreBar({ value, color }: { value: number; color: string }) {
  const w = Math.max(0, Math.min(100, value))
  const colors: Record<string, string> = {
    blue:   'bg-blue-500',
    green:  'bg-green-500',
    purple: 'bg-purple-500',
  }
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${colors[color] ?? 'bg-gray-500'}`} style={{ width: `${w}%` }} />
      </div>
      <span className="text-xs text-gray-400 w-6 text-right">{value}</span>
    </div>
  )
}

export default async function CorridorsPage() {
  const admin = await getCurrentAdminUser()
  if (!admin) redirect('/login')

  const supabase = createAdminClient()

  const { data: corridors, error } = await supabase
    .from('migration_corridors')
    .select('*')
    .order('opportunity_score', { ascending: false })

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 p-8">
        <p className="text-red-400">Fehler: {error.message}</p>
      </div>
    )
  }

  const all = (corridors ?? []) as Corridor[]
  const active = all.filter((c) => c.status === 'active')
  const critical = all.filter((c) => c.priority_level === 'critical')
  const high = all.filter((c) => c.priority_level === 'high')
  const avgScore = all.length > 0
    ? Math.round(all.reduce((s, c) => s + c.opportunity_score, 0) / all.length)
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
              <Link href="/admin/global/sources" className="hover:text-gray-400">Kandidatenquellen</Link>
            </div>
            <h1 className="text-2xl font-bold text-white">🌍 Migrations-Korridore</h1>
            <p className="text-gray-400 text-sm mt-1">
              Globale Talentmigrations-Korridore — Analyse, Priorisierung, Opportunity Scoring
            </p>
          </div>
          <div className="text-right text-xs text-gray-500">
            <div>Zuletzt aktualisiert durch GMI-Agent</div>
            <div className="mt-1">
              <Link href="/admin/ceo-dashboard" className="text-blue-400 hover:text-blue-300">
                Agent starten →
              </Link>
            </div>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <KpiCard label="Aktive Korridore" value={active.length} color="blue" />
          <KpiCard label="🔥 Kritisch" value={critical.length} color="red" />
          <KpiCard label="📈 Hohe Priorität" value={high.length} color="orange" />
          <KpiCard label="Ø Opportunity" value={avgScore} color="purple" suffix="/100" />
        </div>

        {/* Corridors Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="font-semibold text-white">
              Alle Korridore <span className="text-gray-500 text-sm font-normal">({all.length})</span>
            </h2>
            <div className="text-xs text-gray-500">Sortiert nach Opportunity Score</div>
          </div>

          {all.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <div className="text-4xl mb-3">🌍</div>
              <div>Noch keine Korridore. GMI-Agent starten um Daten zu analysieren.</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-left">
                    <th className="px-4 py-3 text-gray-400 font-medium">Quelle → Ziel</th>
                    <th className="px-4 py-3 text-gray-400 font-medium">Berufsfeld</th>
                    <th className="px-4 py-3 text-gray-400 font-medium">Sprache</th>
                    <th className="px-4 py-3 text-gray-400 font-medium w-32">Nachfrage</th>
                    <th className="px-4 py-3 text-gray-400 font-medium w-32">Angebot</th>
                    <th className="px-4 py-3 text-gray-400 font-medium w-32">Opportunity</th>
                    <th className="px-4 py-3 text-gray-400 font-medium">Priorität</th>
                    <th className="px-4 py-3 text-gray-400 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {all.map((c) => (
                    <tr key={c.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      <td className="px-4 py-4">
                        <div className="font-semibold text-white">
                          {c.source_country}
                          <span className="mx-2 text-gray-600">→</span>
                          {c.target_country}
                        </div>
                        {c.visa_pathway && (
                          <div className="text-xs text-gray-500 mt-0.5 truncate max-w-48">{c.visa_pathway}</div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-gray-300">{c.sector}</span>
                        {c.recognition_requirement && (
                          <div className="text-xs text-gray-600 mt-0.5 truncate max-w-36">{c.recognition_requirement}</div>
                        )}
                      </td>
                      <td className="px-4 py-4 text-gray-400 text-xs">
                        {c.language_requirement ?? '—'}
                      </td>
                      <td className="px-4 py-4">
                        <ScoreBar value={c.estimated_demand_score} color="green" />
                      </td>
                      <td className="px-4 py-4">
                        <ScoreBar value={c.estimated_supply_score} color="blue" />
                      </td>
                      <td className="px-4 py-4">
                        <ScoreBar value={c.opportunity_score} color="purple" />
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full border font-medium ${PRIORITY_STYLES[c.priority_level] ?? PRIORITY_STYLES.medium}`}>
                          {c.priority_level === 'critical' ? '🔥 kritisch' :
                           c.priority_level === 'high' ? '📈 hoch' :
                           c.priority_level === 'medium' ? '🟡 mittel' : '⬇️ niedrig'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${STATUS_STYLES[c.status] ?? 'text-gray-400'}`}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Notes Section — Top 3 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {all.slice(0, 3).map((c) => c.notes && (
            <div key={c.id} className={`p-4 rounded-xl border ${PRIORITY_STYLES[c.priority_level] ?? 'border-gray-700 bg-gray-800/30'}`}>
              <div className="font-semibold text-sm mb-1">
                {c.source_country} → {c.target_country} · {c.sector}
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{c.notes}</p>
            </div>
          ))}
        </div>

      </main>
    </>
  )
}

function KpiCard({ label, value, color, suffix = '' }: {
  label: string; value: number; color: string; suffix?: string
}) {
  const colorMap: Record<string, string> = {
    blue:   'text-blue-300 border-blue-800/40',
    red:    'text-red-300 border-red-800/40',
    orange: 'text-orange-300 border-orange-800/40',
    purple: 'text-purple-300 border-purple-800/40',
  }
  return (
    <div className={`bg-gray-800/50 border rounded-xl p-4 text-center ${colorMap[color] ?? 'border-gray-700 text-gray-400'}`}>
      <div className="text-3xl font-bold">{value}{suffix}</div>
      <div className="text-xs mt-1 text-gray-400">{label}</div>
    </div>
  )
}
