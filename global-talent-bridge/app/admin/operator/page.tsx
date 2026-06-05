/**
 * /admin/operator
 *
 * Operator Console — Zentrale Arbeitszentrale für Einzelgründer.
 * Ziel: 10 Minuten pro Tag. Prüfen → JA/NEIN/SPÄTER → System erledigt den Rest.
 *
 * Sektionen:
 *   A. Heute wichtigste Aktionen (Top 5)
 *   B. Approval Queue (Drafts)
 *   C. System-Empfehlungen
 *   D. Research-Aufgaben
 */
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { NavBar } from '@/app/_components/NavBar'
import {
  generateDailyOperatorActions,
  getDailyActionSummary,
  getNextBestActionForEmployer,
  type EmployerForDraft,
} from '@/lib/operator-autopilot'
import { getDetailedProviderStatus, type EnvSnapshot } from '@/lib/email-provider-status'
import { DraftApprovalCard } from './_components/DraftApprovalCard'
import { ActionDecisionButtons } from './_components/ActionDecisionButtons'
import { GenerateDraftsButton } from './_components/GenerateDraftsButton'
import { ProviderStatusCard } from './_components/ProviderStatusCard'

// ── Types ─────────────────────────────────────────────────────────────────────

type DbDraft = {
  id: string
  channel: string
  recipient_name: string | null
  recipient_email: string | null
  recipient_phone: string | null
  subject: string | null
  body: string
  status: string
  risk_level: string
  risk_notes: string | null
  next_follow_up_at: string | null
  error_message: string | null
  pilot_employer_id: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const PRIORITY_STYLES: Record<string, string> = {
  critical: 'text-red-400 bg-red-900/20 border-red-800/40',
  high:     'text-orange-400 bg-orange-900/20 border-orange-800/40',
  medium:   'text-yellow-400 bg-yellow-900/20 border-yellow-800/40',
  low:      'text-gray-400 bg-gray-800 border-gray-700',
}

const ACTION_ICONS: Record<string, string> = {
  approve_outreach:           '✅',
  reject_outreach:            '❌',
  postpone_outreach:          '⏳',
  send_email:                 '📤',
  mark_manual_platform_ready: '📋',
  create_follow_up:           '🔄',
  update_employer_status:     '🔁',
  research_contact:           '🔍',
  review_risk:                '⚠️',
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function OperatorPage() {
  const admin = await getCurrentAdminUser()
  if (!admin) redirect('/auth/login')

  const db = createAdminClient()
  const providerStatus = getDetailedProviderStatus(process.env as EnvSnapshot)
  const providerConfigured = providerStatus.canSend

  // Load pilot employers
  const { data: employersRaw } = await db
    .from('pilot_employers')
    .select('id, company_name, contact_name, contact_email, contact_phone, industry, country, status, notes')
    .in('status', ['identified', 'contacted_manual', 'interested', 'demo_scheduled'])
    .order('created_at', { ascending: true })
    .limit(20)

  const employers: EmployerForDraft[] = (employersRaw ?? []) as EmployerForDraft[]

  // Load pending drafts
  const { data: draftsRaw } = await db
    .from('pilot_outreach_drafts')
    .select('*')
    .in('status', ['generated', 'needs_review', 'approved', 'sent'])
    .order('created_at', { ascending: false })
    .limit(20)

  const drafts: DbDraft[] = (draftsRaw ?? []) as DbDraft[]

  // Build employer lookup map
  const employerMap = new Map(employers.map((e) => [e.id, e]))

  // Enriched drafts with company_name
  const enrichedDrafts = drafts.map((d) => ({
    ...d,
    company_name: employerMap.get(d.pilot_employer_id)?.company_name,
  }))

  // Business-logic driven actions (null → undefined to match OutreachDraft types)
  const pendingDraftsForLogic = drafts.map((d) => ({
    ...d,
    approval_required: true,
    demo: false,
    recipient_name: d.recipient_name ?? undefined,
    recipient_email: d.recipient_email ?? undefined,
    recipient_phone: d.recipient_phone ?? undefined,
    subject: d.subject ?? undefined,
    risk_notes: d.risk_notes ?? undefined,
    error_message: d.error_message ?? undefined,
    next_follow_up_at: d.next_follow_up_at ? new Date(d.next_follow_up_at) : undefined,
    status: d.status as import('@/lib/operator-autopilot').DraftStatus,
    channel: d.channel as import('@/lib/operator-autopilot').DraftChannel,
    provider: 'none' as import('@/lib/operator-autopilot').DraftProvider,
    risk_level: d.risk_level as import('@/lib/operator-autopilot').RiskLevel,
  }))

  const summary = getDailyActionSummary(employers, pendingDraftsForLogic)

  // Load DB operator_actions (pending)
  const { data: dbActionsRaw } = await db
    .from('operator_actions')
    .select('*')
    .in('status', ['pending', 'postponed'])
    .order('created_at', { ascending: false })
    .limit(20)

  const dbActions = (dbActionsRaw ?? []) as Array<{
    id: string
    action_type: string
    title: string
    description: string | null
    priority: string
    status: string
    recommended_decision: string | null
    risk_level: string
    due_at: string | null
  }>

  // Research tasks (employers without contacts)
  const researchTasks = employers.filter(
    (e) => !e.contact_email && !e.contact_phone
  )

  // Per-employer next best actions
  const perEmployerActions = employers
    .filter((e) => e.contact_email || e.contact_phone)
    .slice(0, 5)
    .map((e) => ({ employer: e, action: getNextBestActionForEmployer(e) }))

  const queueDrafts = enrichedDrafts.filter(
    (d) => d.status === 'generated' || d.status === 'needs_review' || d.status === 'approved'
  )
  const hasDrafts = queueDrafts.length > 0
  const noDraftsYet = drafts.length === 0

  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar badge="Admin" badgeColor="purple" />

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">

        {/* ── Header ── */}
        <div>
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <h1 className="text-2xl font-bold text-white">🎛️ Operator Console</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-900/30 text-blue-300 border border-blue-800/50">
              Autopilot
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${
              providerStatus.readinessStatus === 'ready'
                ? 'bg-green-900/30 text-green-300 border-green-800/50'
                : providerStatus.readinessStatus === 'warning'
                ? 'bg-yellow-900/30 text-yellow-300 border-yellow-800/50'
                : 'bg-orange-900/30 text-orange-300 border-orange-800/50'
            }`}>
              {providerStatus.readinessStatus === 'ready' ? '✉️ E-Mail: bereit' :
               providerStatus.readinessStatus === 'warning' ? '⚠️ E-Mail: teilweise' :
               '⚙️ E-Mail: blockiert'}
            </span>
          </div>
          <p className="text-gray-400 text-sm">
            Ziel: 10 Minuten pro Tag. System bereitet vor — du prüfst und klickst JA / NEIN / SPÄTER.
          </p>
        </div>

        {/* ── Sicherheits-Banner ── */}
        <div className="flex items-start gap-3 p-4 bg-blue-900/10 border border-blue-800/30 rounded-xl">
          <span className="text-blue-400 text-lg shrink-0">🔒</span>
          <div>
            <p className="text-blue-300 text-sm font-medium">Keine Aktion ohne deine Freigabe</p>
            <p className="text-blue-200/60 text-xs mt-0.5">
              Kein automatischer Versand · Keine Massenmail · LinkedIn/WhatsApp nur als manuelle Plattform-Aktion ·
              Jede Entscheidung wird protokolliert · Alles abschaltbar
            </p>
          </div>
        </div>

        {/* ── A. KPI-Übersicht ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${summary.urgentCount > 0 ? 'text-red-400' : 'text-gray-400'}`}>
              {summary.urgentCount}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">Dringend</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-yellow-400">{summary.pendingDraftCount}</p>
            <p className="text-xs text-gray-500 mt-0.5">Drafts warten</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">{summary.researchCount}</p>
            <p className="text-xs text-gray-500 mt-0.5">Recherche</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-purple-400">{summary.followUpCount}</p>
            <p className="text-xs text-gray-500 mt-0.5">Follow-ups</p>
          </div>
        </div>

        {/* ── A. Heute wichtigste Aktionen ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">⚡ Heute wichtigste Aktionen</h2>
            <span className="text-xs text-gray-500">Top {summary.actions.length} von {employers.length + drafts.length}</span>
          </div>

          {summary.actions.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-gray-900 border border-gray-800 rounded-2xl">
              <p className="text-2xl mb-2">✓</p>
              <p>Keine dringenden Aktionen. Gut gemacht!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {summary.actions.map((action, i) => (
                <div key={i} className={`border rounded-xl p-4 ${PRIORITY_STYLES[action.priority] ?? PRIORITY_STYLES.low}`}>
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-base">{ACTION_ICONS[action.action_type] ?? '●'}</span>
                        <span className="text-xs font-medium uppercase tracking-wide opacity-70">
                          {action.priority}
                        </span>
                        <span className="text-xs opacity-50">{action.action_type}</span>
                      </div>
                      <p className="text-sm font-semibold">{action.title}</p>
                      {action.description && (
                        <p className="text-xs opacity-70 mt-1 leading-relaxed">{action.description}</p>
                      )}
                      {action.recommended_decision && (
                        <p className="text-xs mt-1 font-medium">
                          → Empfehlung: {action.recommended_decision}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── B. Approval Queue ── */}
        <section>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="text-lg font-bold text-white">📋 Approval Queue</h2>
            <GenerateDraftsButton />
          </div>

          {noDraftsYet ? (
            <div className="text-center py-10 bg-gray-900 border border-gray-800 rounded-2xl">
              <p className="text-3xl mb-3">📭</p>
              <p className="text-gray-400 text-sm mb-4">
                Noch keine Drafts generiert. Klicke auf &quot;Batch-Drafts generieren&quot;, um Batch&nbsp;1 vorzubereiten.
              </p>
              <p className="text-gray-600 text-xs">
                Das System erstellt personalisierte Texte für alle Arbeitgeber mit Kontaktdaten.
              </p>
            </div>
          ) : !hasDrafts ? (
            <div className="text-center py-8 text-gray-500 bg-gray-900 border border-gray-800 rounded-2xl">
              <p className="text-2xl mb-2">✓</p>
              <p>Alle Drafts wurden bearbeitet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {queueDrafts.map((draft) => (
                <DraftApprovalCard
                  key={draft.id}
                  draft={draft}
                  providerConfigured={providerConfigured}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── C. System-Empfehlungen (pro Arbeitgeber) ── */}
        {perEmployerActions.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-white mb-4">💡 System-Empfehlungen</h2>
            <div className="space-y-3">
              {perEmployerActions.map(({ employer, action }) => (
                <div key={employer.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">{employer.company_name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {ACTION_ICONS[action.action_type]} {action.title}
                      </p>
                      {action.recommended_decision && (
                        <p className="text-xs text-blue-300 mt-1">→ {action.recommended_decision}</p>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${PRIORITY_STYLES[action.priority] ?? PRIORITY_STYLES.low}`}>
                      {action.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── C. DB Operator Actions Queue ── */}
        {dbActions.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-white mb-4">🗂 Gespeicherte Aktionen</h2>
            <div className="space-y-3">
              {dbActions.map((action) => (
                <div key={action.id} className={`border rounded-xl p-4 ${PRIORITY_STYLES[action.priority] ?? PRIORITY_STYLES.low}`}>
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{action.title}</p>
                      {action.description && (
                        <p className="text-xs opacity-70 mt-1">{action.description}</p>
                      )}
                      {action.recommended_decision && (
                        <p className="text-xs mt-1">→ {action.recommended_decision}</p>
                      )}
                    </div>
                    <ActionDecisionButtons
                      actionId={action.id}
                      currentStatus={action.status}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── D. Research-Aufgaben ── */}
        {researchTasks.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-white mb-4">🔍 Research-Aufgaben</h2>
            <div className="space-y-2">
              {researchTasks.map((emp) => (
                <div key={emp.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-start gap-3">
                  <span className="text-yellow-400 shrink-0 mt-0.5">⚠️</span>
                  <div>
                    <p className="text-sm font-semibold text-white">{emp.company_name}</p>
                    <p className="text-xs text-gray-400">
                      Keine E-Mail und kein Telefon vorhanden.
                      Website · LinkedIn · XING prüfen → Kontaktdaten in DB nachtragen.
                    </p>
                    <p className="text-xs text-yellow-300/70 mt-1">
                      Danach: Outreach-Draft via &quot;Batch-Drafts generieren&quot; erstellen.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── E. Provider-Status (immer anzeigen) ── */}
        <ProviderStatusCard status={providerStatus} />

        {/* ── Navigation ── */}
        <div className="flex gap-4 flex-wrap pb-4 text-sm">
          <Link href="/admin/employer-responses" className="text-gray-400 hover:text-white transition-colors">
            📊 Response Pipeline →
          </Link>
          <Link href="/admin/pilot-outreach" className="text-gray-400 hover:text-white transition-colors">
            📤 Pilot Outreach →
          </Link>
          <Link href="/admin/pilot-offer" className="text-gray-400 hover:text-white transition-colors">
            💼 Pilot Offer →
          </Link>
          <Link href="/admin/ceo-dashboard" className="text-gray-400 hover:text-white transition-colors">
            🏠 CEO Dashboard →
          </Link>
        </div>

      </div>
    </div>
  )
}
