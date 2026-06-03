import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { NavBar } from '@/app/_components/NavBar'
import { updateContactStatusAction, updateLeadStatusAction } from './actions'
import { StatusSelect } from './StatusSelect'

type ContactRequest = {
  id: string
  name: string
  email: string
  role: string | null
  company_name: string | null
  interest: string | null
  message: string
  status: string
  created_at: string
  next_follow_up_at: string | null
}

type SalesLead = {
  id: string
  source: string
  role: string | null
  name: string | null
  email: string | null
  company_name: string | null
  status: string
  priority: string
  notes: string | null
  created_at: string
}

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-blue-900/40 text-blue-300',
  contacted: 'bg-yellow-900/40 text-yellow-300',
  qualified: 'bg-green-900/40 text-green-300',
  rejected: 'bg-red-900/40 text-red-400',
  closed: 'bg-gray-800 text-gray-500',
}

const ROLE_LABELS: Record<string, string> = {
  candidate: '👤 Kandidat',
  employer: '🏢 Arbeitgeber',
  partner: '🤝 Partner',
  other: '❓ Sonstiges',
}

const INTEREST_LABELS: Record<string, string> = {
  pilot_employer: '🏢 Pilot-Arbeitgeber',
  candidate: '👤 Kandidat',
  partnership: '🤝 Partnerschaft',
  feedback: '💬 Feedback',
  other: '❓ Sonstiges',
}

type FilterType = 'all' | 'new' | 'contacted' | 'qualified' | 'pilot' | 'followup'

const FILTER_LABELS: Record<FilterType, string> = {
  all: 'Alle',
  new: 'Neue',
  contacted: 'Kontaktiert',
  qualified: 'Qualifiziert',
  pilot: 'Pilot-Arbeitgeber',
  followup: 'Follow-up fällig',
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: { filter?: string }
}) {
  const admin = await getCurrentAdminUser()

  if (!admin) {
    redirect('/auth/login')
  }

  const activeFilter = (searchParams.filter ?? 'all') as FilterType
  const today = new Date().toISOString()

  const supabase = createAdminClient()

  const [contactsRes, leadsRes] = await Promise.all([
    supabase
      .from('contact_requests')
      .select('id, name, email, role, company_name, interest, message, status, created_at, next_follow_up_at')
      .order('created_at', { ascending: false })
      .limit(200),
    supabase
      .from('sales_leads')
      .select('id, source, role, name, email, company_name, status, priority, notes, created_at')
      .order('created_at', { ascending: false })
      .limit(100),
  ])

  const allContacts: ContactRequest[] = contactsRes.data ?? []
  const leads: SalesLead[] = leadsRes.data ?? []

  // Filter anwenden (JS-seitig — einfacher und flexibler als Query-Params)
  let contacts = allContacts
  if (activeFilter === 'new') {
    contacts = allContacts.filter((c) => c.status === 'new')
  } else if (activeFilter === 'contacted') {
    contacts = allContacts.filter((c) => c.status === 'contacted')
  } else if (activeFilter === 'qualified') {
    contacts = allContacts.filter((c) => c.status === 'qualified')
  } else if (activeFilter === 'pilot') {
    contacts = allContacts.filter((c) => c.interest === 'pilot_employer')
  } else if (activeFilter === 'followup') {
    contacts = allContacts.filter(
      (c) => c.next_follow_up_at != null && c.next_follow_up_at <= today
    )
  }

  // KPIs (immer aus allen, nicht aus gefilterter Liste)
  const newContacts = allContacts.filter((c) => c.status === 'new').length
  const newLeads = leads.filter((l) => l.status === 'new').length
  const qualifiedLeads = leads.filter((l) => l.status === 'qualified').length
  const employerLeads = leads.filter((l) => l.role === 'employer').length
  const candidateLeads = leads.filter((l) => l.role === 'candidate').length
  const pilotContacts = allContacts.filter((c) => c.interest === 'pilot_employer').length
  const followupDue = allContacts.filter(
    (c) => c.next_follow_up_at != null && c.next_follow_up_at <= today
  ).length

  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar badge="Admin" badgeColor="purple" />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">🎯 Leads & Kontaktanfragen</h1>
            <p className="text-gray-400 text-sm">Alle Kontaktanfragen und Sales Leads. Keine E-Mails werden gesendet.</p>
          </div>
          <Link
            href="/admin/pilot-kit"
            className="shrink-0 text-sm px-4 py-2 bg-blue-900/30 hover:bg-blue-900/50 border border-blue-800/50 text-blue-300 rounded-xl transition-colors font-medium"
          >
            🎯 Pilot-Kit
          </Link>
        </div>

        {/* KPI-Kacheln */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{allContacts.length}</div>
            <div className="text-xs text-gray-400 mt-0.5">Anfragen gesamt</div>
          </div>
          <div className="bg-gray-900 border border-blue-800/40 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{newContacts}</div>
            <div className="text-xs text-gray-400 mt-0.5">Neu</div>
          </div>
          <div className="bg-gray-900 border border-yellow-800/40 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {allContacts.filter((c) => c.status === 'contacted').length}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">Kontaktiert</div>
          </div>
          <div className="bg-gray-900 border border-green-800/40 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {allContacts.filter((c) => c.status === 'qualified').length}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">Qualifiziert</div>
          </div>
          <div className="bg-gray-900 border border-green-700/60 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-300">{pilotContacts}</div>
            <div className="text-xs text-gray-400 mt-0.5">🏢 Pilot</div>
          </div>
          <div className={`rounded-xl p-4 text-center ${followupDue > 0 ? 'bg-orange-900/20 border border-orange-700/50' : 'bg-gray-900 border border-gray-800'}`}>
            <div className={`text-2xl font-bold ${followupDue > 0 ? 'text-orange-400' : 'text-gray-500'}`}>{followupDue}</div>
            <div className="text-xs text-gray-400 mt-0.5">📅 Follow-up fällig</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{leads.length}</div>
            <div className="text-xs text-gray-400 mt-0.5">Sales Leads</div>
          </div>
        </div>

        {/* ── Kontaktanfragen ── */}
        <div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="text-lg font-semibold text-white">
              📬 Kontaktanfragen
              <span className="ml-2 text-sm text-gray-400 font-normal">
                ({contacts.length}{activeFilter !== 'all' ? ` von ${allContacts.length}` : ''})
              </span>
              {newContacts > 0 && activeFilter === 'all' && (
                <span className="ml-2 text-sm text-blue-400 font-normal">· {newContacts} neu</span>
              )}
            </h2>
          </div>

          {/* Filter-Tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {(Object.keys(FILTER_LABELS) as FilterType[]).map((f) => {
              const isActive = f === activeFilter
              const href = f === 'all' ? '/admin/leads' : `/admin/leads?filter=${f}`
              const count = f === 'all' ? allContacts.length
                : f === 'new' ? newContacts
                : f === 'contacted' ? allContacts.filter((c) => c.status === 'contacted').length
                : f === 'qualified' ? allContacts.filter((c) => c.status === 'qualified').length
                : f === 'pilot' ? pilotContacts
                : followupDue
              return (
                <Link
                  key={f}
                  href={href}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    isActive
                      ? f === 'followup' && followupDue > 0
                        ? 'bg-orange-700 text-white'
                        : 'bg-blue-700 text-white'
                      : f === 'followup' && followupDue > 0
                      ? 'bg-orange-900/20 border border-orange-700/40 text-orange-300 hover:bg-orange-900/40'
                      : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  {FILTER_LABELS[f]}
                  {count > 0 && (
                    <span className="ml-1.5 opacity-70">({count})</span>
                  )}
                </Link>
              )
            })}
          </div>

          {contacts.length === 0 ? (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 text-center">
              <div className="text-3xl mb-2">📭</div>
              <p className="text-gray-500 text-sm">
                {activeFilter === 'all'
                  ? 'Noch keine Kontaktanfragen vorhanden.'
                  : `Keine Anfragen für Filter „${FILTER_LABELS[activeFilter]}".`}
              </p>
            </div>
          ) : (
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
              {/* Tabellenkopf */}
              <div className="px-5 py-3 border-b border-gray-800 grid grid-cols-12 gap-2 text-xs text-gray-500 font-medium hidden sm:grid">
                <div className="col-span-2">Name</div>
                <div className="col-span-2">E-Mail</div>
                <div className="col-span-1">Rolle</div>
                <div className="col-span-1">Interesse</div>
                <div className="col-span-2">Firma</div>
                <div className="col-span-1">Datum</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1">Details</div>
              </div>

              <div className="divide-y divide-gray-800">
                {contacts.map((contact) => {
                  const isFollowupDue =
                    contact.next_follow_up_at != null &&
                    contact.next_follow_up_at <= today
                  return (
                    <div
                      key={contact.id}
                      className={`px-5 py-4 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-2 items-center ${
                        contact.interest === 'pilot_employer'
                          ? 'bg-green-900/5 border-l-2 border-l-green-700/50'
                          : isFollowupDue
                          ? 'bg-orange-900/5 border-l-2 border-l-orange-700/50'
                          : ''
                      }`}
                    >
                      <div className="sm:col-span-2">
                        <p className="text-white text-sm font-medium truncate">{contact.name}</p>
                        {isFollowupDue && (
                          <span className="text-xs text-orange-400">📅 Follow-up fällig</span>
                        )}
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-gray-400 text-xs truncate">{contact.email}</p>
                      </div>
                      <div className="sm:col-span-1">
                        <p className="text-gray-400 text-xs">
                          {ROLE_LABELS[contact.role ?? ''] ?? contact.role ?? '—'}
                        </p>
                      </div>
                      <div className="sm:col-span-1">
                        {contact.interest ? (
                          <span className={`text-xs px-1.5 py-0.5 rounded-full whitespace-nowrap ${
                            contact.interest === 'pilot_employer'
                              ? 'bg-green-900/40 text-green-300'
                              : 'bg-blue-900/30 text-blue-300'
                          }`}>
                            {INTEREST_LABELS[contact.interest] ?? contact.interest}
                          </span>
                        ) : (
                          <p className="text-gray-600 text-xs">—</p>
                        )}
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-gray-400 text-xs truncate">{contact.company_name ?? '—'}</p>
                      </div>
                      <div className="sm:col-span-1">
                        <p className="text-gray-500 text-xs">
                          {new Date(contact.created_at).toLocaleDateString('de-DE')}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLES[contact.status] ?? STATUS_STYLES.new}`}>
                          {contact.status}
                        </span>
                        <div className="mt-1">
                          <StatusSelect
                            id={contact.id}
                            currentStatus={contact.status}
                            action={updateContactStatusAction}
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-1">
                        <Link
                          href={`/admin/leads/${contact.id}`}
                          className="text-xs text-blue-400 hover:text-blue-300 transition-colors whitespace-nowrap"
                        >
                          Details →
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Sales Leads ── */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">
            💼 Sales Leads
            {leads.length > 0 && (
              <span className="ml-2 text-sm text-gray-400 font-normal">({leads.length})</span>
            )}
          </h2>

          {/* Lead-Aufschlüsselung */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-green-400">{employerLeads}</div>
              <div className="text-xs text-gray-400 mt-0.5">🏢 Arbeitgeber</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-blue-400">{candidateLeads}</div>
              <div className="text-xs text-gray-400 mt-0.5">👤 Kandidaten</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-yellow-400">{newLeads}</div>
              <div className="text-xs text-gray-400 mt-0.5">Neue Leads</div>
            </div>
          </div>

          {leads.length === 0 ? (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 text-center">
              <div className="text-3xl mb-2">🎯</div>
              <p className="text-gray-500 text-sm">Noch keine Sales Leads vorhanden.</p>
            </div>
          ) : (
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-800 grid grid-cols-12 gap-2 text-xs text-gray-500 font-medium hidden sm:grid">
                <div className="col-span-2">Name</div>
                <div className="col-span-2">E-Mail</div>
                <div className="col-span-1">Rolle</div>
                <div className="col-span-2">Firma</div>
                <div className="col-span-2">Quelle</div>
                <div className="col-span-1">Priorität</div>
                <div className="col-span-1">Datum</div>
                <div className="col-span-1">Status</div>
              </div>

              <div className="divide-y divide-gray-800">
                {leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="px-5 py-4 grid grid-cols-1 sm:grid-cols-12 gap-2 items-start"
                  >
                    <div className="sm:col-span-2">
                      <p className="text-white text-sm font-medium truncate">{lead.name ?? '—'}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-gray-400 text-xs truncate">{lead.email ?? '—'}</p>
                    </div>
                    <div className="sm:col-span-1">
                      <p className="text-gray-400 text-xs">
                        {ROLE_LABELS[lead.role ?? ''] ?? lead.role ?? '—'}
                      </p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-gray-400 text-xs truncate">{lead.company_name ?? '—'}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-gray-400 text-xs">{lead.source}</p>
                    </div>
                    <div className="sm:col-span-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        lead.priority === 'high'
                          ? 'bg-red-900/40 text-red-300'
                          : lead.priority === 'normal'
                          ? 'bg-gray-800 text-gray-400'
                          : 'bg-gray-800 text-gray-500'
                      }`}>
                        {lead.priority}
                      </span>
                    </div>
                    <div className="sm:col-span-1">
                      <p className="text-gray-500 text-xs">
                        {new Date(lead.created_at).toLocaleDateString('de-DE')}
                      </p>
                    </div>
                    <div className="sm:col-span-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLES[lead.status] ?? STATUS_STYLES.new}`}>
                        {lead.status}
                      </span>
                      <div className="mt-1">
                        <StatusSelect
                          id={lead.id}
                          currentStatus={lead.status}
                          action={updateLeadStatusAction}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sicherheitshinweis */}
        <div className="p-4 bg-green-900/10 border border-green-800/30 rounded-xl flex items-start gap-3">
          <span className="text-green-400 shrink-0">🔒</span>
          <p className="text-green-300/70 text-xs leading-relaxed">
            Alle Daten werden über den Service Role Key gelesen — nur serverseitig.
            Keine E-Mails werden gesendet. Status-Änderungen erfolgen manuell durch Admin.
            Kein automatischer Kontakt mit Leads.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 flex-wrap">
          <Link
            href="/admin/ceo-dashboard"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← CEO Dashboard
          </Link>
          <Link
            href="/admin/pilot-kit"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            🎯 Pilot-Kit →
          </Link>
        </div>
      </div>
    </div>
  )
}
