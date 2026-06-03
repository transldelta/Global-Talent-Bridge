import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { NavBar } from '@/app/_components/NavBar'
import { updateContactStatusAction, updateLeadStatusAction } from './actions'

type ContactRequest = {
  id: string
  name: string
  email: string
  role: string | null
  company_name: string | null
  message: string
  status: string
  created_at: string
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
  closed: 'bg-gray-800 text-gray-500',
}

const ROLE_LABELS: Record<string, string> = {
  candidate: '👤 Kandidat',
  employer: '🏢 Arbeitgeber',
  partner: '🤝 Partner',
  other: '❓ Sonstiges',
}

function StatusSelect({
  id,
  currentStatus,
  action,
}: {
  id: string
  currentStatus: string
  action: (formData: FormData) => Promise<void>
}) {
  return (
    <form action={action} className="inline-flex">
      <input type="hidden" name="id" value={id} />
      <select
        name="status"
        defaultValue={currentStatus}
        onChange={(e) => {
          const form = e.target.closest('form') as HTMLFormElement
          if (form) form.requestSubmit()
        }}
        className="text-xs bg-gray-800 border border-gray-700 text-white rounded-lg px-2 py-1 focus:outline-none focus:border-blue-500 cursor-pointer"
      >
        <option value="new">new</option>
        <option value="contacted">contacted</option>
        <option value="qualified">qualified</option>
        <option value="closed">closed</option>
      </select>
      <button type="submit" className="sr-only">Speichern</button>
    </form>
  )
}

export default async function AdminLeadsPage() {
  const admin = await getCurrentAdminUser()

  if (!admin) {
    redirect('/auth/login')
  }

  const supabase = createAdminClient()

  const [contactsRes, leadsRes] = await Promise.all([
    supabase
      .from('contact_requests')
      .select('id, name, email, role, company_name, message, status, created_at')
      .order('created_at', { ascending: false })
      .limit(100),
    supabase
      .from('sales_leads')
      .select('id, source, role, name, email, company_name, status, priority, notes, created_at')
      .order('created_at', { ascending: false })
      .limit(100),
  ])

  const contacts: ContactRequest[] = contactsRes.data ?? []
  const leads: SalesLead[] = leadsRes.data ?? []

  // KPIs
  const newContacts = contacts.filter((c) => c.status === 'new').length
  const newLeads = leads.filter((l) => l.status === 'new').length
  const qualifiedLeads = leads.filter((l) => l.status === 'qualified').length
  const employerLeads = leads.filter((l) => l.role === 'employer').length
  const candidateLeads = leads.filter((l) => l.role === 'candidate').length

  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar badge="Admin" badgeColor="purple" />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">🎯 Leads & Kontaktanfragen</h1>
          <p className="text-gray-400 text-sm">Alle Kontaktanfragen und Sales Leads. Keine E-Mails werden gesendet.</p>
        </div>

        {/* KPI-Kacheln */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{contacts.length}</div>
            <div className="text-xs text-gray-400 mt-0.5">Kontaktanfragen</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{newContacts}</div>
            <div className="text-xs text-gray-400 mt-0.5">Neue Anfragen</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{leads.length}</div>
            <div className="text-xs text-gray-400 mt-0.5">Sales Leads</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{qualifiedLeads}</div>
            <div className="text-xs text-gray-400 mt-0.5">Qualifiziert</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{newLeads}</div>
            <div className="text-xs text-gray-400 mt-0.5">Neue Leads</div>
          </div>
        </div>

        {/* Lead-Aufschlüsselung */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <div className="text-xl font-bold text-green-400">{employerLeads}</div>
            <div className="text-xs text-gray-400 mt-0.5">🏢 Arbeitgeber-Leads</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <div className="text-xl font-bold text-blue-400">{candidateLeads}</div>
            <div className="text-xs text-gray-400 mt-0.5">👤 Kandidaten-Leads</div>
          </div>
        </div>

        {/* ── Kontaktanfragen ── */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">
            📬 Kontaktanfragen
            {contacts.length > 0 && (
              <span className="ml-2 text-sm text-gray-400 font-normal">({contacts.length})</span>
            )}
            {newContacts > 0 && (
              <span className="ml-2 text-sm text-blue-400 font-normal">· {newContacts} neu</span>
            )}
          </h2>

          {contacts.length === 0 ? (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 text-center">
              <div className="text-3xl mb-2">📭</div>
              <p className="text-gray-500 text-sm">Noch keine Kontaktanfragen vorhanden.</p>
            </div>
          ) : (
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
              {/* Tabellenkopf */}
              <div className="px-5 py-3 border-b border-gray-800 grid grid-cols-12 gap-2 text-xs text-gray-500 font-medium hidden sm:grid">
                <div className="col-span-2">Name</div>
                <div className="col-span-2">E-Mail</div>
                <div className="col-span-1">Rolle</div>
                <div className="col-span-2">Firma</div>
                <div className="col-span-3">Nachricht (Auszug)</div>
                <div className="col-span-1">Datum</div>
                <div className="col-span-1">Status</div>
              </div>

              <div className="divide-y divide-gray-800">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="px-5 py-4 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-2 items-start"
                  >
                    <div className="sm:col-span-2">
                      <p className="text-white text-sm font-medium truncate">{contact.name}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-gray-400 text-xs truncate">{contact.email}</p>
                    </div>
                    <div className="sm:col-span-1">
                      <p className="text-gray-400 text-xs">
                        {ROLE_LABELS[contact.role ?? ''] ?? contact.role ?? '—'}
                      </p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-gray-400 text-xs truncate">{contact.company_name ?? '—'}</p>
                    </div>
                    <div className="sm:col-span-3">
                      <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                        {contact.message.slice(0, 120)}{contact.message.length > 120 ? '…' : ''}
                      </p>
                    </div>
                    <div className="sm:col-span-1">
                      <p className="text-gray-500 text-xs">
                        {new Date(contact.created_at).toLocaleDateString('de-DE')}
                      </p>
                    </div>
                    <div className="sm:col-span-1">
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
                  </div>
                ))}
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
        <div className="flex gap-3">
          <Link
            href="/admin/ceo-dashboard"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← CEO Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
