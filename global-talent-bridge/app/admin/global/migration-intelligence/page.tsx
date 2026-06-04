import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { NavBar } from '@/app/_components/NavBar'
import { RunMIAgentButton } from './_components/RunMIAgentButton'

export const dynamic = 'force-dynamic'

type MIRow = {
  id: string
  source_country: string | null
  target_country: string | null
  sector: string | null
  visa_complexity: number
  recognition_complexity: number
  language_complexity: number
  document_complexity: number
  estimated_success_score: number
  risk_level: string
  status: string
  required_documents: unknown
  language_requirements: unknown
  recognition_steps: unknown
  visa_pathways: unknown
  recommended_next_steps: unknown
  disclaimer: string | null
  created_at: string
  updated_at: string
}

const RISK_COLORS: Record<string, string> = {
  low:      'bg-green-900/30 text-green-300 border-green-800/30',
  medium:   'bg-yellow-900/30 text-yellow-300 border-yellow-800/30',
  high:     'bg-orange-900/30 text-orange-300 border-orange-800/30',
  critical: 'bg-red-900/30 text-red-300 border-red-800/30',
}

const STATUS_COLORS: Record<string, string> = {
  draft:    'bg-gray-800 text-gray-400',
  reviewed: 'bg-blue-900/30 text-blue-300',
  approved: 'bg-green-900/30 text-green-300',
  outdated: 'bg-gray-700 text-gray-500',
}

function ComplexityBar({ value }: { value: number }) {
  const color = value >= 70 ? 'bg-red-500' : value >= 50 ? 'bg-orange-500' : 'bg-green-500'
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs text-gray-400 font-mono w-6">{value}</span>
    </div>
  )
}

export default async function MigrationIntelligencePage() {
  const admin = await getCurrentAdminUser()
  if (!admin) redirect('/auth/login')

  const supabase = createAdminClient()

  const { data: rows } = await supabase
    .from('migration_intelligence')
    .select('*')
    .order('estimated_success_score', { ascending: false })

  const miRows = (rows ?? []) as MIRow[]

  const totals = {
    total:    miRows.length,
    approved: miRows.filter((r) => r.status === 'approved').length,
    reviewed: miRows.filter((r) => r.status === 'reviewed').length,
    draft:    miRows.filter((r) => r.status === 'draft').length,
    outdated: miRows.filter((r) => r.status === 'outdated').length,
    high:     miRows.filter((r) => r.risk_level === 'high' || r.risk_level === 'critical').length,
  }

  const avgScore = miRows.length
    ? Math.round(miRows.reduce((sum, r) => sum + r.estimated_success_score, 0) / miRows.length)
    : 0

  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar badge="Migration Intelligence" badgeColor="green" />

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">🛂 Migration Intelligence</h1>
            <p className="text-gray-400 text-sm mt-1">
              Strukturierte Komplexitätsanalyse pro Migrationskorridor · Kein Rechtsbeistand · Nur Orientierung
            </p>
          </div>
          <RunMIAgentButton />
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{totals.total}</div>
            <div className="text-xs text-gray-400 mt-0.5">Gesamt</div>
          </div>
          <div className="bg-gray-900 border border-blue-800/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-300">{totals.reviewed}</div>
            <div className="text-xs text-gray-400 mt-0.5">Reviewed</div>
          </div>
          <div className="bg-gray-900 border border-green-800/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-300">{totals.approved}</div>
            <div className="text-xs text-gray-400 mt-0.5">Approved</div>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gray-400">{totals.draft}</div>
            <div className="text-xs text-gray-400 mt-0.5">Draft</div>
          </div>
          <div className="bg-gray-900 border border-orange-800/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-300">{totals.high}</div>
            <div className="text-xs text-gray-400 mt-0.5">⚠️ Hochrisiko</div>
          </div>
          <div className="bg-gray-900 border border-teal-800/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-teal-300">{avgScore}</div>
            <div className="text-xs text-gray-400 mt-0.5">Ø Erfolgs-Score</div>
          </div>
        </div>

        {/* Disclaimer Banner */}
        <div className="bg-yellow-900/10 border border-yellow-800/40 rounded-xl p-4 flex items-start gap-3">
          <span className="text-yellow-400 text-lg shrink-0">⚠️</span>
          <div>
            <p className="text-yellow-300 text-sm font-semibold">Wichtiger Hinweis</p>
            <p className="text-yellow-200/70 text-xs mt-0.5 leading-relaxed">
              Alle Scores und Einschätzungen sind algorithmisch berechnet und dienen nur zur internen Orientierung.
              Keine Rechtsberatung. Keine Garantien. Alle Angaben ohne Gewähr.
              Für individuelle Beratung sind lokale Migrations- und Anerkennungsexperten hinzuzuziehen.
            </p>
          </div>
        </div>

        {/* Main Table */}
        {miRows.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
            <p className="text-gray-500">Keine Migration-Intelligence-Daten vorhanden.</p>
            <p className="text-gray-600 text-sm mt-2">MI-Agent starten, um Daten zu generieren.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {(['approved', 'reviewed', 'draft', 'outdated'] as const).map((statusGroup) => {
              const groupRows = miRows.filter((r) => r.status === statusGroup)
              if (groupRows.length === 0) return null

              const groupLabels: Record<string, string> = {
                approved: '✅ Approved',
                reviewed: '🔵 Reviewed',
                draft:    '📋 Draft',
                outdated: '🗑️ Outdated',
              }

              return (
                <div key={statusGroup}>
                  <h2 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                    {groupLabels[statusGroup]} · {groupRows.length}
                  </h2>
                  <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-3 px-4 py-2 border-b border-gray-800 text-xs text-gray-500 uppercase tracking-wider">
                      <div className="col-span-3">Korridor</div>
                      <div className="col-span-1 text-center">Visa</div>
                      <div className="col-span-1 text-center">Anerk.</div>
                      <div className="col-span-1 text-center">Sprache</div>
                      <div className="col-span-1 text-center">Dokum.</div>
                      <div className="col-span-2 text-center">Erfolg</div>
                      <div className="col-span-1 text-center">Risiko</div>
                      <div className="col-span-1 text-center">Vollst.</div>
                      <div className="col-span-1 text-right">Update</div>
                    </div>

                    <div className="divide-y divide-gray-800">
                      {groupRows.map((row) => {
                        const hasAllData = !!(
                          row.required_documents &&
                          row.language_requirements &&
                          row.recognition_steps &&
                          row.visa_pathways &&
                          row.recommended_next_steps
                        )

                        return (
                          <div key={row.id} className="grid grid-cols-12 gap-3 px-4 py-3 items-center hover:bg-gray-800/30 transition-colors">
                            {/* Corridor */}
                            <div className="col-span-3">
                              <div className="text-sm text-white font-medium leading-snug">
                                {row.source_country ?? '?'} → {row.target_country ?? '?'}
                              </div>
                              {row.sector && (
                                <div className="text-xs text-gray-500 mt-0.5">{row.sector}</div>
                              )}
                            </div>

                            {/* Complexity bars */}
                            <div className="col-span-1 flex justify-center">
                              <ComplexityBar value={row.visa_complexity} />
                            </div>
                            <div className="col-span-1 flex justify-center">
                              <ComplexityBar value={row.recognition_complexity} />
                            </div>
                            <div className="col-span-1 flex justify-center">
                              <ComplexityBar value={row.language_complexity} />
                            </div>
                            <div className="col-span-1 flex justify-center">
                              <ComplexityBar value={row.document_complexity} />
                            </div>

                            {/* Success Score */}
                            <div className="col-span-2 flex items-center justify-center gap-1.5">
                              <div
                                className={`text-sm font-bold ${
                                  row.estimated_success_score >= 80 ? 'text-green-300' :
                                  row.estimated_success_score >= 60 ? 'text-yellow-300' :
                                  row.estimated_success_score >= 40 ? 'text-orange-300' :
                                  'text-red-300'
                                }`}
                              >
                                {row.estimated_success_score}%
                              </div>
                            </div>

                            {/* Risk Level */}
                            <div className="col-span-1 flex justify-center">
                              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${RISK_COLORS[row.risk_level] ?? ''}`}>
                                {row.risk_level}
                              </span>
                            </div>

                            {/* Completeness */}
                            <div className="col-span-1 flex justify-center">
                              <span className={hasAllData ? 'text-green-400' : 'text-orange-400'}>
                                {hasAllData ? '✅' : '⚠️'}
                              </span>
                            </div>

                            {/* Updated at */}
                            <div className="col-span-1 text-right">
                              <span className="text-xs text-gray-600">
                                {new Date(row.updated_at).toLocaleDateString('de-DE')}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Score formula explanation */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">📐 Score-Formel</h3>
          <pre className="text-xs text-gray-500 leading-relaxed font-mono whitespace-pre-wrap">
{`estimated_success_score =
  100
  − visa_complexity         × 0.25
  − recognition_complexity  × 0.25
  − language_complexity     × 0.20
  − document_complexity     × 0.15
  + opportunity_score       × 0.15

Risikolevel: ≥80 → low | ≥60 → medium | ≥40 → high | <40 → critical`}
          </pre>
        </div>
      </div>
    </div>
  )
}
