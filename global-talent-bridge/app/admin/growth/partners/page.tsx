import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NavBar } from '@/app/_components/NavBar'

const statusColor: Record<string, string> = {
  identified:  'bg-gray-800 text-gray-300 border border-gray-700',
  contacted:   'bg-blue-900/30 text-blue-300 border border-blue-800/40',
  negotiating: 'bg-yellow-900/30 text-yellow-300 border border-yellow-800/40',
  active:      'bg-green-900/30 text-green-300 border border-green-800/40',
  inactive:    'bg-red-900/20 text-red-400 border border-red-800/30',
}

const typeIcon: Record<string, string> = {
  language_school:     '🗣️',
  recruitment_agency:  '🏛️',
  job_portal:          '📋',
  university:          '🎓',
  ngo:                 '❤️',
  government:          '🏛️',
}

const modelColor: Record<string, string> = {
  referral_fee:   'text-green-400',
  revenue_share:  'text-blue-400',
  free:           'text-emerald-400',
  barter:         'text-purple-400',
}

export default async function PartnerLeadsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const adminSupabase = createAdminClient()
  const { data: profile } = await adminSupabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') redirect('/auth/login')

  const { data: partners } = await adminSupabase
    .from('partner_leads')
    .select('*')
    .order('potential_candidates_per_month', { ascending: false })

  const allPartners = partners ?? []
  const totalPotential = allPartners.reduce((sum, p) => sum + (p.potential_candidates_per_month ?? 0), 0)

  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar badge="Admin" badgeColor="red" />
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        <div>
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <Link href="/admin/growth" className="hover:text-gray-300">Growth Engine</Link>
            <span>›</span>
            <span>Partner-Leads</span>
          </div>
          <h1 className="text-2xl font-bold text-white">🤝 Partner-Leads</h1>
          <p className="text-gray-400 mt-1 text-sm">
            {allPartners.length} Partner · ~{totalPotential} Kandidaten/Monat Potenzial
          </p>
        </div>

        {/* Partner list */}
        <div className="space-y-3">
          {allPartners.map((partner) => (
            <div key={partner.id} className="bg-gray-900 rounded-xl border border-gray-800 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xl">{typeIcon[partner.partner_type] ?? '🤝'}</span>
                    <h3 className="text-white font-semibold">{partner.organization_name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[partner.status] ?? statusColor.identified}`}>
                      {partner.status.replace('_', ' ')}
                    </span>
                    {partner.partnership_model && (
                      <span className={`text-xs font-medium ${modelColor[partner.partnership_model] ?? 'text-gray-400'}`}>
                        {partner.partnership_model.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-400">
                    <span>📍 {partner.city}, {partner.country}</span>
                    <span>🏷️ {partner.partner_type.replace('_', ' ')}</span>
                    {partner.contact_name && <span>👤 {partner.contact_name}</span>}
                    {partner.contact_email && (
                      <a href={`mailto:${partner.contact_email}`} className="text-blue-400 hover:text-blue-300">
                        ✉️ {partner.contact_email}
                      </a>
                    )}
                  </div>
                  {partner.notes && (
                    <p className="text-gray-500 text-xs mt-2 leading-relaxed">{partner.notes}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xl font-bold text-purple-400">~{partner.potential_candidates_per_month}</div>
                  <div className="text-gray-600 text-xs">Kand./Monat</div>
                </div>
              </div>
            </div>
          ))}

          {allPartners.length === 0 && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 text-center">
              <p className="text-4xl mb-3">🤝</p>
              <p className="text-gray-400">Keine Partner-Leads gefunden.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
