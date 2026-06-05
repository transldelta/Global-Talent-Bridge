/**
 * /admin/employer-responses
 *
 * Employer Response Pipeline.
 * Zeigt: Liste aller Pilot-Arbeitgeber, letzte Interaktion,
 *        nächstes Follow-up, Interaktionsformular.
 *
 * Admin-only. Server Component.
 * Keine Nachrichten werden gesendet. Nur manuelle Protokollierung.
 */
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { NavBar } from '@/app/_components/NavBar'
import {
  buildNextBestAction,
  getPipelineSummary,
  getRecommendedNextAction,
  RESPONSE_TYPE_LABELS,
  INTERACTION_TYPE_LABELS,
  type ResponseType,
  type InteractionType,
} from '@/lib/employer-response-pipeline'
import { InteractionForm } from './_components/InteractionForm'

export const dynamic = 'force-dynamic'

type Interaction = {
  id: string
  interaction_type: string
  response_type: string
  summary: string | null
  next_action: string | null
  next_follow_up_at: string | null
  created_at: string
  created_by: string | null
}

type EmployerWithInteractions = {
  id: string
  company_name: string
  industry: string | null
  country: string
  status: string
  interest_level: string | null
  next_step: string | null
  next_follow_up_at: string | null
  notes: string | null
  interactions: Interaction[]
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function EmployerResponsesPage() {
  const admin = await getCurrentAdminUser()
  if (!admin) redirect('/auth/login')

  const supabase = createAdminClient()

  // Load employers
  const { data: employers } = await supabase
    .from('pilot_employers')
    .select('id, company_name, industry, country, status, interest_level, next_step, next_follow_up_at, notes')
    .order('status')

  const allEmployers = employers ?? []

  // Load interactions for all employers (last 3 per employer)
  const employerIds = allEmployers.map((e) => e.id)
  const { data: interactions } = employerIds.length > 0
    ? await supabase
        .from('pilot_employer_interactions')
        .select('id, pilot_employer_id, interaction_type, response_type, summary, next_action, next_follow_up_at, created_at, created_by')
        .in('pilot_employer_id', employerIds)
        .order('created_at', { ascending: false })
    : { data: [] }

  // Group interactions by employer
  const interactionsByEmployer = new Map<string, Interaction[]>()
  for (const interaction of (interactions ?? [])) {
    const list = interactionsByEmployer.get(interaction.pilot_employer_id) ?? []
    list.push(interaction)
    interactionsByEmployer.set(interaction.pilot_employer_id, list)
  }

  const employersWithInteractions: EmployerWithInteractions[] = allEmployers.map((e) => ({
    ...e,
    interactions: (interactionsByEmployer.get(e.id) ?? []).slice(0, 3),
  }))

  const summary = getPipelineSummary(allEmployers)

  // Status order for display
  const statusOrder: Record<string, number> = {
    demo_scheduled: 0,
    interested: 1,
    onboarding: 2,
    active_pilot: 3,
    contacted_manual: 4,
    identified: 5,
    rejected: 6,
  }

  const sorted = [...employersWithInteractions].sort(
    (a, b) => (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9)
  )

  const statusColors: Record<string, string> = {
    identified:       'bg-gray-800 text-gray-400',
    contacted_manual: 'bg-blue-900/30 text-blue-400',
    interested:       'bg-yellow-900/30 text-yellow-400',
    demo_scheduled:   'bg-orange-900/30 text-orange-400',
    onboarding:       'bg-purple-900/30 text-purple-400',
    active_pilot:     'bg-green-900/30 text-green-400',
    rejected:         'bg-red-900/20 text-red-400',
  }

  const responseColors: Record<string, string> = {
    no_response:    'text-gray-500',
    positive:       'text-green-400',
    neutral:        'text-blue-400',
    objection:      'text-yellow-400',
    rejected:       'text-red-400',
    demo_requested: 'text-orange-400',
    pilot_requested:'text-purple-400',
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar />

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">📋 Employer Response Pipeline</h1>
            <p className="text-gray-400 text-sm">
              Manuelle Interaktionsprotokolle für Pilot-Arbeitgeber. Kein automatischer Versand.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap items-center">
            <Link href="/admin/pilot-offer" className="text-xs text-yellow-400 hover:text-yellow-300">🎯 Pilot Offer →</Link>
            <Link href="/admin/pilot-outreach" className="text-xs text-green-400 hover:text-green-300">📤 Outreach →</Link>
            <Link href="/admin/ceo-dashboard" className="text-xs text-gray-400 hover:text-gray-300">🏠 CEO Dashboard →</Link>
          </div>
        </div>

        {/* No-Send Reminder */}
        <div className="mb-6 bg-amber-900/10 border border-amber-800/30 rounded-xl px-4 py-3">
          <p className="text-amber-300/80 text-xs leading-relaxed">
            ⚠️ <strong>Wichtig:</strong> Diese Seite protokolliert nur was manuell durchgeführt wurde.
            Kein automatischer Versand. Keine echten Nachrichten werden gesendet.
          </p>
        </div>

        {/* Pipeline Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Gesamt', value: summary.total, color: 'text-gray-300' },
            { label: '🔥 Hot Leads', value: summary.hotLeads, color: 'text-orange-400' },
            { label: '✅ Aktiver Pilot', value: summary.activeCount, color: 'text-green-400' },
            { label: '⏰ Aktion nötig', value: summary.nextActionRequired, color: 'text-yellow-400' },
          ].map((s, i) => (
            <div key={i} className="bg-gray-900 rounded-xl border border-gray-800 p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Status Funnel */}
        <div className="mb-8 bg-gray-900 rounded-xl border border-gray-800 p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Pipeline-Funnel</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(summary.byStatus).map(([status, count]) => (
              <div key={status} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs ${statusColors[status] ?? 'bg-gray-800 text-gray-400'}`}>
                <span className="font-bold">{count}</span>
                <span className="opacity-80">{status.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Employer List */}
        {sorted.length === 0 ? (
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 text-center">
            <p className="text-gray-500 mb-2">Keine Pilot-Arbeitgeber gefunden.</p>
            <Link href="/admin/pilot-launch" className="text-xs text-blue-400 hover:text-blue-300">
              → Pilot Launch: Seed Data laden
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {sorted.map((employer) => {
              const lastInteraction = employer.interactions[0]
              const nba = buildNextBestAction(employer)

              return (
                <div key={employer.id} className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                  {/* Employer Header */}
                  <div className="p-4 flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusColors[employer.status] ?? 'bg-gray-800 text-gray-400'}`}>
                          {employer.status}
                        </span>
                        <p className="text-sm font-semibold text-white">{employer.company_name}</p>
                        {employer.industry && <span className="text-xs text-gray-600">· {employer.industry}</span>}
                        <span className="text-xs text-gray-600">· {employer.country}</span>
                      </div>

                      {/* Recommended Next Action */}
                      <p className="text-xs text-blue-300 mt-1">
                        → {nba.recommendedAction}
                      </p>

                      {/* Last Interaction */}
                      {lastInteraction && (
                        <div className="mt-2 flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-gray-600">Letzte Interaktion:</span>
                          <span className="text-xs text-gray-400">
                            {INTERACTION_TYPE_LABELS[lastInteraction.interaction_type as InteractionType] ?? lastInteraction.interaction_type}
                          </span>
                          <span className={`text-xs ${responseColors[lastInteraction.response_type] ?? 'text-gray-400'}`}>
                            {RESPONSE_TYPE_LABELS[lastInteraction.response_type as ResponseType] ?? lastInteraction.response_type}
                          </span>
                          <span className="text-xs text-gray-700">
                            {new Date(lastInteraction.created_at).toLocaleDateString('de-DE')}
                          </span>
                        </div>
                      )}
                      {!lastInteraction && (
                        <p className="text-xs text-gray-600 mt-1">Noch keine Interaktion protokolliert.</p>
                      )}

                      {/* Follow-up */}
                      {employer.next_follow_up_at && (
                        <p className="text-xs text-yellow-400/70 mt-1">
                          📅 Follow-up: {new Date(employer.next_follow_up_at).toLocaleDateString('de-DE')}
                        </p>
                      )}
                    </div>

                    <Link
                      href="/admin/pilot-outreach"
                      className="text-xs text-green-400 hover:text-green-300 flex-shrink-0"
                    >
                      📤 Outreach →
                    </Link>
                  </div>

                  {/* Interaction History (last 2) */}
                  {employer.interactions.length > 1 && (
                    <div className="px-4 pb-3 border-t border-gray-800/50 pt-3">
                      <p className="text-xs text-gray-600 mb-2">Letzte Interaktionen</p>
                      <div className="space-y-1.5">
                        {employer.interactions.slice(0, 2).map((interaction) => (
                          <div key={interaction.id} className="flex items-start gap-2 text-xs">
                            <span className="text-gray-600 flex-shrink-0">
                              {new Date(interaction.created_at).toLocaleDateString('de-DE')}
                            </span>
                            <span className="text-gray-500 flex-shrink-0">
                              {INTERACTION_TYPE_LABELS[interaction.interaction_type as InteractionType] ?? interaction.interaction_type}
                            </span>
                            <span className={responseColors[interaction.response_type] ?? 'text-gray-400'}>
                              {RESPONSE_TYPE_LABELS[interaction.response_type as ResponseType] ?? interaction.response_type}
                            </span>
                            {interaction.summary && (
                              <span className="text-gray-600 truncate max-w-xs">{interaction.summary}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Interaction Form */}
                  <div className="px-4 pb-4 pt-2 border-t border-gray-800/30">
                    <InteractionForm
                      employerId={employer.id}
                      employerName={employer.company_name}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}
