/**
 * app/admin/global-revenue-control/page.tsx
 *
 * Global Revenue Control — Übersicht globaler Leads, Kandidaten, Arbeitgeber, Partner.
 * Admin-geschützt. Kein Send-Button. Kein Ads-Button. Kein Stripe.
 */
import { redirect }            from 'next/navigation'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient }   from '@/lib/supabase/admin'
import { getTopCategoriesByRevenue } from '@/lib/talent-categories'

export const dynamic = 'force-dynamic'

export default async function GlobalRevenueControlPage() {
  const user = await getCurrentAdminUser()
  if (!user) redirect('/auth/login?redirectTo=/admin/global-revenue-control')

  const supabase = createAdminClient()

  // Count all lead types
  const [
    { count: globalEmployerTotal },
    { count: globalEmployerNew },
    { count: candidateTotal },
    { count: candidateNew },
    { count: strategicLeads },
    { count: agencyLeads },
    { count: employerPilotLeads },
    { count: allRevenueLeads },
  ] = await Promise.all([
    supabase.from('global_employer_leads').select('id', { count: 'exact', head: true }),
    supabase.from('global_employer_leads').select('id', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('candidate_interest_leads').select('id', { count: 'exact', head: true }),
    supabase.from('candidate_interest_leads').select('id', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('revenue_leads').select('id', { count: 'exact', head: true }).eq('lead_type', 'strategic_partner').eq('status', 'new'),
    supabase.from('revenue_leads').select('id', { count: 'exact', head: true }).eq('lead_type', 'agency_partner').eq('status', 'new'),
    supabase.from('revenue_leads').select('id', { count: 'exact', head: true }).eq('lead_type', 'employer_pilot').eq('status', 'new'),
    supabase.from('revenue_leads').select('id', { count: 'exact', head: true }).eq('status', 'new'),
  ])

  // Top employer countries/sectors from global_employer_leads
  const { data: employerCountries } = await supabase
    .from('global_employer_leads')
    .select('country')
    .not('country', 'is', null)
    .limit(100)

  const { data: employerSectors } = await supabase
    .from('global_employer_leads')
    .select('sector')
    .not('sector', 'is', null)
    .limit(100)

  const { data: candidateCountries } = await supabase
    .from('candidate_interest_leads')
    .select('country_of_origin')
    .not('country_of_origin', 'is', null)
    .limit(100)

  // Aggregate top countries
  function topItems(items: {[k: string]: string | null}[], key: string, limit = 5) {
    const counts: Record<string, number> = {}
    for (const item of items) {
      const val = item[key]
      if (val) counts[val] = (counts[val] ?? 0) + 1
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, limit)
  }

  const topEmpCountries  = topItems(employerCountries  ?? [], 'country')
  const topEmpSectors    = topItems(employerSectors    ?? [], 'sector')
  const topCandCountries = topItems(candidateCountries ?? [], 'country_of_origin')

  const topRevCategories = getTopCategoriesByRevenue(5)

  const totalNew = (allRevenueLeads ?? 0) + (globalEmployerNew ?? 0) + (candidateNew ?? 0)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">🌍 Global Revenue Control</h1>
        <p className="text-gray-500 mt-1">Globale Lead-Übersicht — Kandidaten, Arbeitgeber, Partner</p>
        <div className="mt-2 flex gap-2">
          <span className="px-3 py-1 bg-red-100 text-red-700 border border-red-200 rounded-full text-xs">🚫 Kein Send</span>
          <span className="px-3 py-1 bg-red-100 text-red-700 border border-red-200 rounded-full text-xs">🚫 Kein Ads</span>
          <span className="px-3 py-1 bg-red-100 text-red-700 border border-red-200 rounded-full text-xs">🚫 Kein Stripe</span>
        </div>
      </div>

      {/* Total Counts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Neue Leads gesamt',        value: totalNew,                  color: totalNew > 0 ? 'text-green-600' : 'text-gray-400', bg: 'bg-green-50 border-green-200' },
          { label: 'Global Employer Leads',    value: globalEmployerTotal ?? 0,   color: 'text-blue-600',    bg: 'bg-blue-50 border-blue-200' },
          { label: 'Candidate Interest',       value: candidateTotal ?? 0,        color: 'text-purple-600',  bg: 'bg-purple-50 border-purple-200' },
          { label: 'Revenue Leads (classic)',  value: allRevenueLeads ?? 0,       color: 'text-amber-600',   bg: 'bg-amber-50 border-amber-200' },
        ].map(stat => (
          <div key={stat.label} className={`rounded-xl border p-4 text-center ${stat.bg}`}>
            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* New Leads Breakdown */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="font-bold text-gray-900 text-lg mb-4">📥 Neue Leads — Aufschlüsselung</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: '🎯 Strategic',         value: strategicLeads ?? 0,    href: '/admin/revenue-inbox' },
            { label: '🤝 Agency Partner',    value: agencyLeads ?? 0,       href: '/admin/revenue-inbox' },
            { label: '🏭 Employer Pilot',    value: employerPilotLeads ?? 0, href: '/admin/revenue-inbox' },
            { label: '🌍 Global Employer',   value: globalEmployerNew ?? 0,  href: '/admin/global-revenue-control' },
            { label: '👤 Candidate Interest', value: candidateNew ?? 0,     href: '/admin/global-revenue-control' },
          ].map(item => (
            <a key={item.label} href={item.href}
              className={`rounded-lg p-3 text-center border hover:opacity-90 transition-opacity ${item.value > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className={`text-2xl font-bold ${item.value > 0 ? 'text-yellow-700' : 'text-gray-400'}`}>{item.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{item.label}</div>
            </a>
          ))}
        </div>
      </div>

      {/* Top Countries & Sectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Employer Countries */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-800 mb-3">🏢 Top Arbeitgeberländer</h3>
          {topEmpCountries.length > 0 ? (
            <div className="space-y-1">
              {topEmpCountries.map(([country, count]) => (
                <div key={country} className="flex justify-between text-sm">
                  <span className="text-gray-700">{country}</span>
                  <span className="text-gray-500 font-medium">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-400 italic">Noch keine Daten</div>
          )}
        </div>

        {/* Employer Sectors */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-800 mb-3">🏭 Top Arbeitgeberbranchen</h3>
          {topEmpSectors.length > 0 ? (
            <div className="space-y-1">
              {topEmpSectors.map(([sector, count]) => (
                <div key={sector} className="flex justify-between text-sm">
                  <span className="text-gray-700">{sector}</span>
                  <span className="text-gray-500 font-medium">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-400 italic">Noch keine Daten</div>
          )}
        </div>

        {/* Candidate Countries */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-800 mb-3">👤 Top Kandidatenländer</h3>
          {topCandCountries.length > 0 ? (
            <div className="space-y-1">
              {topCandCountries.map(([country, count]) => (
                <div key={country} className="flex justify-between text-sm">
                  <span className="text-gray-700">{country}</span>
                  <span className="text-gray-500 font-medium">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-400 italic">Noch keine Daten</div>
          )}
        </div>
      </div>

      {/* Top Revenue Segments */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="font-bold text-gray-900 text-lg mb-4">💰 Top 5 monetarisierbare Berufsbereiche</h2>
        <div className="space-y-2">
          {topRevCategories.map((cat, i) => (
            <div key={cat.sector_key} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-gray-300 font-bold w-5">#{i+1}</div>
              <span className="text-xl">{cat.emoji}</span>
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm">{cat.public_label}</div>
                <div className="text-xs text-gray-500">{cat.recommended_corridors.slice(0, 3).join(' · ')}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-green-600">{cat.revenue_potential}/100</div>
                <div className="text-xs text-gray-400">Revenue Potential</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">{cat.global_relevance_score}/100</div>
                <div className="text-xs text-gray-400">Global Relevance</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Safe Actions */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-5">
        <h2 className="font-bold text-gray-900 text-lg mb-4">🎯 Nächste sichere Schritte</h2>
        <div className="space-y-2">
          {[
            { step: 1, action: 'Revenue Inbox prüfen', desc: 'Neue strategische Leads qualifizieren', href: '/admin/revenue-inbox' },
            { step: 2, action: 'Global Employer Intake beobachten', desc: '/global/employers — neue Anfragen prüfen', href: '/global/employers' },
            { step: 3, action: 'Google-Indexierung abwarten', desc: 'GSC: neue Corridor-Seiten beantragen', href: '/admin/seo-indexing-control' },
          ].map(item => (
            <a key={item.step} href={item.href}
              className="flex items-center gap-3 p-3 bg-white border border-amber-200 rounded-lg hover:bg-amber-50 transition-colors">
              <div className="w-7 h-7 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0">{item.step}</div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">{item.action}</div>
                <div className="text-xs text-gray-500">{item.desc}</div>
              </div>
              <span className="ml-auto text-amber-600 text-sm">→</span>
            </a>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Revenue Inbox',     href: '/admin/revenue-inbox' },
          { label: 'Campaign Planner',  href: '/admin/global-campaign-planner' },
          { label: 'Buyer Readiness',   href: '/admin/buyer-readiness' },
          { label: 'CWO Command',       href: '/admin/cwo-command-center' },
        ].map(link => (
          <a key={link.href} href={link.href}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-center text-gray-700 hover:bg-gray-50 transition-colors">
            {link.label}
          </a>
        ))}
      </div>

    </div>
  )
}
