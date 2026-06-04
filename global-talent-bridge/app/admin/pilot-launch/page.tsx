import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { RunPilotAgentButton } from './_components/RunPilotAgentButton'

type PilotEmployer = {
  id: string
  company_name: string
  country: string
  industry: string | null
  contact_name: string | null
  status: string
  interest_level: string
  next_step: string | null
  next_follow_up_at: string | null
  notes: string | null
  source: string | null
  created_at: string
}

type PilotCandidate = {
  id: string
  full_name: string | null
  origin_country: string
  target_country: string
  profession: string
  language: string | null
  language_level: string | null
  status: string
  quality_score: number
  source: string | null
  notes: string | null
}

type PilotTask = {
  id: string
  title: string
  type: string
  priority: string
  status: string
  due_at: string | null
  created_at: string
}

type PilotFeedback = {
  id: string
  source_type: string
  category: string
  title: string
  description: string | null
  priority: string
  status: string
  impact_score: number
  created_at: string
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  identified:       { label: 'Identifiziert',    color: 'bg-gray-100 text-gray-700' },
  contacted_manual: { label: 'Kontaktiert',       color: 'bg-blue-100 text-blue-700' },
  interested:       { label: 'Interessiert',      color: 'bg-yellow-100 text-yellow-700' },
  demo_scheduled:   { label: 'Demo geplant',      color: 'bg-purple-100 text-purple-700' },
  onboarding:       { label: 'Onboarding',        color: 'bg-orange-100 text-orange-700' },
  active_pilot:     { label: 'Aktiver Pilot',     color: 'bg-green-100 text-green-700' },
  rejected:         { label: 'Abgelehnt',         color: 'bg-red-100 text-red-500' },
  // Kandidaten
  identified_cand:  { label: 'Identifiziert',    color: 'bg-gray-100 text-gray-700' },
  contacted:        { label: 'Kontaktiert',       color: 'bg-blue-100 text-blue-700' },
  placed:           { label: 'Platziert',         color: 'bg-green-200 text-green-800' },
}

const INTEREST_COLOR: Record<string, string> = {
  unknown:  'text-gray-400',
  low:      'text-blue-500',
  medium:   'text-yellow-600',
  high:     'text-orange-600',
  very_high:'text-red-600 font-semibold',
}

const PRIORITY_COLOR: Record<string, string> = {
  low:      'bg-gray-100 text-gray-600',
  medium:   'bg-blue-100 text-blue-700',
  high:     'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
}

const TYPE_ICON: Record<string, string> = {
  call:         '📞',
  demo_prep:    '🎯',
  lp_review:    '🌐',
  source_check: '🔍',
  feedback:     '💬',
  follow_up:    '🔔',
  onboarding:   '🚀',
  general:      '📋',
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_LABELS[status] ?? { label: status, color: 'bg-gray-100 text-gray-600' }
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.color}`}>{cfg.label}</span>
}

export default async function PilotLaunchPage() {
  const admin = await getCurrentAdminUser()
  if (!admin) redirect('/admin/login')

  const supabase = createAdminClient()

  const [empRes, candRes, taskRes, fbRes] = await Promise.all([
    supabase.from('pilot_employers').select('*').order('created_at', { ascending: false }),
    supabase.from('pilot_candidates').select('*').order('quality_score', { ascending: false }),
    supabase.from('pilot_tasks').select('*').neq('status', 'done').order('created_at', { ascending: false }),
    supabase.from('pilot_feedback').select('*').order('created_at', { ascending: false }),
  ])

  const employers:  PilotEmployer[]  = (empRes.data  ?? []) as PilotEmployer[]
  const candidates: PilotCandidate[] = (candRes.data ?? []) as PilotCandidate[]
  const tasks:      PilotTask[]      = (taskRes.data ?? []) as PilotTask[]
  const feedback:   PilotFeedback[]  = (fbRes.data   ?? []) as PilotFeedback[]

  const now = new Date().toISOString()
  const followUpDue    = employers.filter(e => e.next_follow_up_at && e.next_follow_up_at <= now).length
  const demoScheduled  = employers.filter(e => e.status === 'demo_scheduled').length
  const activePilot    = employers.filter(e => e.status === 'active_pilot').length
  const interested     = employers.filter(e => ['interested', 'demo_scheduled', 'onboarding', 'active_pilot'].includes(e.status)).length
  const criticalTasks  = tasks.filter(t => t.priority === 'critical').length
  const critFeedback   = feedback.filter(f => f.priority === 'critical' || f.priority === 'high').length

  return (
    <main className="p-8 max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🚀 Pilot Launch Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm">Sprint G · Erste echte Pilot-Arbeitgeber und Kandidaten gewinnen · Kein externer Versand</p>
        </div>
        <RunPilotAgentButton />
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Arbeitgeber gesamt',  value: employers.length,  color: 'text-gray-800' },
          { label: 'Interessiert/aktiv',  value: interested,        color: 'text-yellow-600' },
          { label: 'Demo-Termine',        value: demoScheduled,     color: 'text-purple-600' },
          { label: 'Aktive Pilotkunden',  value: activePilot,       color: 'text-green-600' },
          { label: 'Pilot-Kandidaten',    value: candidates.length, color: 'text-blue-600' },
          { label: 'Offene Aufgaben',     value: tasks.length,      color: criticalTasks > 0 ? 'text-red-600' : 'text-gray-700' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white rounded-xl border p-4 text-center">
            <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
            <p className="text-xs text-gray-500 mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {(followUpDue > 0 || criticalTasks > 0 || critFeedback > 0) && (
        <div className="space-y-2">
          {followUpDue > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-3 text-sm text-red-700 flex items-center gap-2">
              🔔 <strong>{followUpDue} Follow-up(s) überfällig</strong> — Sofort Kontakt aufnehmen!
            </div>
          )}
          {criticalTasks > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl px-5 py-3 text-sm text-orange-700 flex items-center gap-2">
              ⚠️ <strong>{criticalTasks} kritische Aufgabe(n)</strong> offen
            </div>
          )}
          {critFeedback > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-3 text-sm text-yellow-700 flex items-center gap-2">
              💬 <strong>{critFeedback} Feedback-Eintrag/-träge</strong> mit hoher/kritischer Priorität unbearbeitet
            </div>
          )}
        </div>
      )}

      {/* ── Pilot-Arbeitgeber ── */}
      <section className="bg-white rounded-xl border overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">🏢 Pilot-Arbeitgeber</h2>
          <span className="text-xs text-gray-500">{employers.length} gesamt</span>
        </div>
        {employers.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">Noch keine Arbeitgeber eingetragen</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Unternehmen</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Land / Branche</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Kontakt</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Interesse</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Nächster Schritt</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Follow-up</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {employers.map(emp => {
                  const overdue = emp.next_follow_up_at && emp.next_follow_up_at <= now
                  return (
                    <tr key={emp.id} className={`hover:bg-gray-50 ${overdue ? 'bg-red-50/30' : ''}`}>
                      <td className="px-5 py-3">
                        <p className="font-medium text-gray-800">{emp.company_name}</p>
                        {emp.source && <p className="text-xs text-gray-400">{emp.source}</p>}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">
                        {emp.country}{emp.industry ? ` · ${emp.industry}` : ''}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{emp.contact_name ?? '—'}</td>
                      <td className="px-4 py-3 text-center"><StatusBadge status={emp.status} /></td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs font-medium ${INTEREST_COLOR[emp.interest_level] ?? 'text-gray-500'}`}>
                          {emp.interest_level}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600 max-w-xs truncate">{emp.next_step ?? '—'}</td>
                      <td className={`px-5 py-3 text-xs text-right ${overdue ? 'text-red-600 font-medium' : 'text-gray-400'}`}>
                        {emp.next_follow_up_at
                          ? new Date(emp.next_follow_up_at).toLocaleDateString('de-DE')
                          : '—'}
                        {overdue && ' ⚠️'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Pilot-Kandidaten ── */}
      <section className="bg-white rounded-xl border overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">🎓 Pilot-Kandidaten</h2>
          <span className="text-xs text-gray-500">{candidates.length} gesamt</span>
        </div>
        {candidates.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">Noch keine Kandidaten eingetragen</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Korridor</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Beruf</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Sprache</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Qualität</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Quelle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {candidates.map(cand => (
                  <tr key={cand.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 text-xs text-gray-700">
                      {cand.origin_country} → {cand.target_country}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800 text-sm">{cand.profession}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {cand.language ?? '—'}{cand.language_level ? ` (${cand.language_level})` : ''}
                    </td>
                    <td className="px-4 py-3 text-center"><StatusBadge status={cand.status} /></td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <div className="w-12 bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${cand.quality_score >= 80 ? 'bg-green-500' : cand.quality_score >= 60 ? 'bg-yellow-500' : 'bg-red-400'}`}
                            style={{ width: `${cand.quality_score}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 font-medium">{cand.quality_score}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">{cand.source ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Pilot-Aufgaben ── */}
      <section className="bg-white rounded-xl border overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">✅ Offene Aufgaben</h2>
          <span className="text-xs text-gray-500">{tasks.length} offen</span>
        </div>
        {tasks.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">Keine offenen Aufgaben ✅</div>
        ) : (
          <div className="divide-y">
            {tasks.map(task => (
              <div key={task.id} className="px-5 py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-lg shrink-0">{TYPE_ICON[task.type] ?? '📋'}</span>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">{task.title}</p>
                    <p className="text-xs text-gray-400">{task.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_COLOR[task.priority]}`}>
                    {task.priority}
                  </span>
                  {task.due_at && (
                    <span className={`text-xs ${new Date(task.due_at) <= new Date() ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
                      {new Date(task.due_at).toLocaleDateString('de-DE')}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Pilot-Feedback ── */}
      <section className="bg-white rounded-xl border overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">💬 Pilot-Feedback</h2>
          <span className="text-xs text-gray-500">{feedback.length} Einträge</span>
        </div>
        {feedback.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">Noch kein Feedback erfasst</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Feedback</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Quelle</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Kategorie</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Priorität</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {feedback.map(fb => (
                <tr key={fb.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-800">{fb.title}</p>
                    {fb.description && <p className="text-xs text-gray-400 mt-0.5 truncate max-w-sm">{fb.description}</p>}
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-gray-500">{fb.source_type}</td>
                  <td className="px-4 py-3 text-center text-xs text-gray-500">{fb.category}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_COLOR[fb.priority]}`}>
                      {fb.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-xs text-gray-500">{fb.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm text-blue-800">
        <strong>ℹ️ Hinweis:</strong> Alle Einträge werden per service_role direkt aus Supabase geladen.
        Keine externen Nachrichten werden versendet. Der Agent erstellt nur interne Aufgaben und Suggestions.
        Arbeitgeber und Kandidaten können direkt in der Supabase-Datenbank verwaltet werden.
      </div>
    </main>
  )
}
