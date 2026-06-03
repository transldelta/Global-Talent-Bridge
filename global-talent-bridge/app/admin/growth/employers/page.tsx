import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NavBar } from '@/app/_components/NavBar'

const statusLabel: Record<string, { label: string; color: string }> = {
  new:          { label: 'Neu', color: 'bg-gray-800 text-gray-300 border border-gray-700' },
  contacted:    { label: 'Kontaktiert', color: 'bg-blue-900/30 text-blue-300 border border-blue-800/40' },
  interested:   { label: 'Interessiert', color: 'bg-yellow-900/30 text-yellow-300 border border-yellow-800/40' },
  qualified:    { label: 'Qualifiziert', color: 'bg-green-900/30 text-green-300 border border-green-800/40' },
  closed_won:   { label: 'Gewonnen', color: 'bg-emerald-900/40 text-emerald-300 border border-emerald-800/40' },
  closed_lost:  { label: 'Verloren', color: 'bg-red-900/20 text-red-400 border border-red-800/30' },
}

export default async function EmployerLeadsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const adminSupabase = createAdminClient()
  const { data: profile } = await adminSupabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') redirect('/auth/login')

  const { data: leads } = await adminSupabase
    .from('employer_leads')
    .select('*')
    .order('score', { ascending: false })
    .order('created_at', { ascending: false })

  const allLeads = leads ?? []

  // Group by status
  const byStatus: Record<string, typeof allLeads> = {}
  for (const lead of allLeads) {
    if (!byStatus[lead.status]) byStatus[lead.status] = []
    byStatus[lead.status].push(lead)
  }

  const statusOrder = ['interested', 'qualified', 'contacted', 'new', 'closed_won', 'closed_lost']

  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar badge="Admin" badgeColor="red" />
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <Link href="/admin/growth" className="hover:text-gray-300">Growth Engine</Link>
              <span>›</span>
              <span>Arbeitgeber-Leads</span>
            </div>
            <h1 className="text-2xl font-bold text-white">🏢 Arbeitgeber-Leads</h1>
            <p className="text-gray-400 mt-1 text-sm">{allLeads.length} Leads gesamt</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {statusOrder.map((s) => {
            const count = byStatus[s]?.length ?? 0
            const info = statusLabel[s] ?? { label: s, color: 'bg-gray-800 text-gray-400 border border-gray-700' }
            return (
              <div key={s} className="bg-gray-900 rounded-xl border border-gray-800 p-3 text-center">
                <div className="text-xl font-bold text-white">{count}</div>
                <div className="text-xs mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${info.color}`}>{info.label}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Lead list */}
        <div className="space-y-3">
          {allLeads.map((lead) => {
            const info = statusLabel[lead.status] ?? { label: lead.status, color: 'bg-gray-800 text-gray-400 border border-gray-700' }
            return (
              <div key={lead.id} className="bg-gray-900 rounded-xl border border-gray-800 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-white font-semibold">{lead.company_name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${info.color}`}>{info.label}</span>
                      {lead.priority === 'critical' && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-900/30 text-red-300 border border-red-800/40">🔥 Kritisch</span>
                      )}
                      {lead.priority === 'high' && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-orange-900/20 text-orange-300 border border-orange-800/30">⬆ Hoch</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-400">
                      {lead.sector && <span>📁 {lead.sector}</span>}
                      {lead.city && <span>📍 {lead.city}, {lead.country}</span>}
                      {lead.company_size && <span>👥 {lead.company_size === 'small' ? 'Klein' : lead.company_size === 'large' ? 'Groß' : 'Mittel'}</span>}
                      {lead.contact_name && <span>👤 {lead.contact_name}</span>}
                      {lead.contact_email && (
                        <a href={`mailto:${lead.contact_email}`} className="text-blue-400 hover:text-blue-300">✉️ {lead.contact_email}</a>
                      )}
                    </div>
                    {lead.notes && (
                      <p className="text-gray-500 text-xs mt-2 leading-relaxed">{lead.notes}</p>
                    )}
                    {lead.last_contacted_at && (
                      <p className="text-gray-600 text-xs mt-1">
                        Zuletzt kontaktiert: {new Date(lead.last_contacted_at).toLocaleDateString('de-DE')}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`text-2xl font-bold ${lead.score >= 70 ? 'text-green-400' : lead.score >= 50 ? 'text-yellow-400' : 'text-gray-400'}`}>
                      {lead.score}
                    </div>
                    <div className="text-gray-600 text-xs">Score</div>
                    <div className="text-gray-600 text-xs mt-1">
                      {lead.source === 'agent_suggested' ? '🤖 Agent' : lead.source === 'referral' ? '🔗 Referral' : '✏️ Manuell'}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {allLeads.length === 0 && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 text-center">
              <p className="text-4xl mb-3">🏢</p>
              <p className="text-gray-400">Noch keine Leads. Growth-Agent ausführen oder manuell hinzufügen.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
