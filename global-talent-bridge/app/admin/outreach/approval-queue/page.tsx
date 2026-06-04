import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { NavBar } from '@/app/_components/NavBar'
import { ApprovalQueueClient } from './_components/ApprovalQueueClient'

export const dynamic = 'force-dynamic'

type QueueEntry = {
  id: string
  created_by_agent: string
  target_type: string
  target_name: string
  target_email: string | null
  target_phone: string | null
  channel: string
  message_subject: string | null
  message_body: string
  status: string
  risk_level: string
  priority_score: number
  source_context: Record<string, unknown>
  approved_by: string | null
  approved_at: string | null
  sent_at: string | null
  rejected_by: string | null
  rejected_at: string | null
  rejection_reason: string | null
  requires_double_confirmation: boolean
  double_confirmed: boolean
  remind_later_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

type GrowthRun = {
  id: string
  run_at: string
  run_type: string
  status: string
  leads_analyzed: number
  drafts_created: number
  followups_planned: number
  alerts_sent: number
  summary: string | null
}

export default async function ApprovalQueuePage() {
  const admin = await getCurrentAdminUser()
  if (!admin) redirect('/login')

  const supabase = createAdminClient()

  const [
    allEntriesRes,
    lastRunRes,
  ] = await Promise.all([
    supabase
      .from('outreach_approval_queue')
      .select('*')
      .order('priority_score', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(200),
    supabase
      .from('internal_growth_agent_runs')
      .select('id, run_at, run_type, status, leads_analyzed, drafts_created, followups_planned, alerts_sent, summary')
      .order('run_at', { ascending: false })
      .limit(5),
  ])

  const allEntries = (allEntriesRes.data ?? []) as QueueEntry[]
  const lastRuns = (lastRunRes.data ?? []) as GrowthRun[]

  // KPIs
  const pending = allEntries.filter((e) => e.status === 'pending').length
  const approved = allEntries.filter((e) => e.status === 'approved').length
  const sent = allEntries.filter((e) => e.status === 'sent').length
  const preparedManual = allEntries.filter((e) => e.status === 'prepared_for_manual_send').length
  const rejected = allEntries.filter((e) => e.status === 'rejected').length
  const remindLater = allEntries.filter((e) => e.status === 'remind_later').length
  const highRisk = allEntries.filter((e) => e.risk_level === 'high' && e.status === 'pending').length
  const emailDrafts = allEntries.filter((e) => e.channel === 'email' && e.status === 'pending').length
  const whatsappDrafts = allEntries.filter((e) => e.channel === 'whatsapp' && e.status === 'pending').length

  return (
    <>
      <NavBar badge="Admin" badgeColor="purple" />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link href="/admin/outreach" className="text-gray-500 hover:text-gray-400 text-sm">
                ← Outreach
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-white">📬 Outreach Approval Queue</h1>
            <p className="text-gray-400 text-sm mt-1">
              Vom Growth Agent erstellte Entwürfe — kein Versand ohne Admin-Freigabe
            </p>
          </div>
          <div className="flex gap-2">
            <RunGrowthAgentButton />
          </div>
        </div>

        {/* Security Banner */}
        <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-800/40 rounded-xl text-sm text-yellow-300">
          <strong>🔒 Sicherheitshinweis:</strong> Der Growth Agent erstellt nur Entwürfe. Kein Versand ohne explizite
          Admin-Freigabe. Bei risk_level=&quot;high&quot; ist eine doppelte Bestätigung erforderlich. Alle Aktionen
          werden in system_logs protokolliert.
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
          <KpiCard label="Ausstehend" value={pending} color="yellow" />
          <KpiCard label="E-Mail" value={emailDrafts} color="blue" />
          <KpiCard label="WhatsApp" value={whatsappDrafts} color="green" />
          <KpiCard label="Freigegeben" value={approved} color="purple" />
          <KpiCard label="Man. Versand" value={preparedManual} color="orange" />
          <KpiCard label="Gesendet" value={sent} color="teal" />
          <KpiCard label="Abgelehnt" value={rejected} color="gray" />
          <KpiCard label="⚠️ High-Risk" value={highRisk} color="red" />
        </div>

        {/* Last Growth Agent Runs */}
        {lastRuns.length > 0 && (
          <div className="mb-6 p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">🤖 Letzte Growth-Agent-Läufe</h3>
            <div className="space-y-2">
              {lastRuns.map((run) => (
                <div key={run.id} className="flex items-center gap-3 text-xs text-gray-400">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    run.status === 'success' ? 'bg-green-900/30 text-green-400' :
                    run.status === 'partial' ? 'bg-yellow-900/30 text-yellow-400' :
                    'bg-red-900/30 text-red-400'
                  }`}>
                    {run.status}
                  </span>
                  <span className="text-gray-500">{new Date(run.run_at).toLocaleString('de-DE')}</span>
                  <span>{run.leads_analyzed} Leads · {run.drafts_created} Entwürfe · {run.followups_planned} Follow-ups</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Remind Later banner */}
        {remindLater > 0 && (
          <div className="mb-4 p-3 bg-blue-900/20 border border-blue-800/30 rounded-lg text-sm text-blue-300">
            📅 {remindLater} Eintrag{remindLater > 1 ? 'e' : ''} auf &quot;Später erinnern&quot; gesetzt
          </div>
        )}

        {/* Client component für interaktive Aktionen */}
        <ApprovalQueueClient initialEntries={allEntries} />
      </main>
    </>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function KpiCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colorMap: Record<string, string> = {
    yellow: 'border-yellow-800/40 text-yellow-300',
    blue: 'border-blue-800/40 text-blue-300',
    green: 'border-green-800/40 text-green-300',
    purple: 'border-purple-800/40 text-purple-300',
    orange: 'border-orange-800/40 text-orange-300',
    teal: 'border-teal-800/40 text-teal-300',
    gray: 'border-gray-700 text-gray-400',
    red: 'border-red-800/40 text-red-400',
  }
  return (
    <div className={`bg-gray-800/50 border rounded-xl p-3 text-center ${colorMap[color] ?? colorMap.gray}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs mt-1 text-gray-400">{label}</div>
    </div>
  )
}

function RunGrowthAgentButton() {
  return (
    <form action="/api/admin/growth-agent/run" method="POST">
      <button
        type="submit"
        className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white text-sm rounded-lg transition-colors"
      >
        🤖 Growth Agent starten
      </button>
    </form>
  )
}
