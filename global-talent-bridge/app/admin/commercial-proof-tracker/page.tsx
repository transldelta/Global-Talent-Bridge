/**
 * app/admin/commercial-proof-tracker/page.tsx
 *
 * Commercial Proof Tracker — ehrlich tracken was vorhanden ist.
 * Keine Fake-Umsätze. Keine Fake-Kunden. Kein Schönreden.
 */
import { redirect }            from 'next/navigation'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient }   from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export default async function CommercialProofTrackerPage() {
  const user = await getCurrentAdminUser()
  if (!user) redirect('/auth/login?redirectTo=/admin/commercial-proof-tracker')

  const supabase = createAdminClient()

  const [
    { count: strategicLeads },
    { count: agencyLeads },
    { count: employerLeads },
    { count: intelLeads },
    { count: globalEmployerLeads },
    { count: candidateLeads },
    { count: allNew },
  ] = await Promise.all([
    supabase.from('revenue_leads').select('id', { count: 'exact', head: true }).eq('lead_type', 'strategic_partner'),
    supabase.from('revenue_leads').select('id', { count: 'exact', head: true }).eq('lead_type', 'agency_partner'),
    supabase.from('revenue_leads').select('id', { count: 'exact', head: true }).eq('lead_type', 'employer_pilot'),
    supabase.from('revenue_leads').select('id', { count: 'exact', head: true }).eq('lead_type', 'market_intelligence'),
    supabase.from('global_employer_leads').select('id', { count: 'exact', head: true }),
    supabase.from('candidate_interest_leads').select('id', { count: 'exact', head: true }),
    supabase.from('revenue_leads').select('id', { count: 'exact', head: true }).eq('status', 'new'),
  ])

  const totalLeads = (strategicLeads ?? 0) + (agencyLeads ?? 0) + (employerLeads ?? 0) + (intelLeads ?? 0) + (globalEmployerLeads ?? 0) + (candidateLeads ?? 0)

  const PROOF_ITEMS = [
    { label: 'Zahlende Kunden',          value: '0',    status: 'missing', note: 'Phase 1 Pre-Revenue' },
    { label: 'Echter Umsatz',            value: '0 EUR', status: 'missing', note: 'Kein Stripe, kein Payment' },
    { label: 'Echte Inbound-Leads',      value: String(allNew ?? 0), status: (allNew ?? 0) > 0 ? 'ok' : 'missing', note: (allNew ?? 0) > 0 ? 'Echte Leads vorhanden' : 'Alle bisherigen = intern' },
    { label: 'Globale Employer-Anfragen', value: String(globalEmployerLeads ?? 0), status: (globalEmployerLeads ?? 0) > 0 ? 'ok' : 'empty', note: 'via /global/employers' },
    { label: 'Kandidaten-Interesse',     value: String(candidateLeads ?? 0), status: (candidateLeads ?? 0) > 0 ? 'ok' : 'empty', note: 'via /global/candidates' },
    { label: 'Strategic Partner Leads',  value: String(strategicLeads ?? 0), status: (strategicLeads ?? 0) > 0 ? 'ok' : 'empty', note: 'via /strategic-partnership' },
    { label: 'Agency Partner Leads',     value: String(agencyLeads ?? 0), status: (agencyLeads ?? 0) > 0 ? 'ok' : 'empty', note: 'via /partners' },
    { label: 'Employer Pilot Leads',     value: String(employerLeads ?? 0), status: (employerLeads ?? 0) > 0 ? 'ok' : 'empty', note: 'via /pilot/employers' },
    { label: 'Market Intel Leads',       value: String(intelLeads ?? 0), status: (intelLeads ?? 0) > 0 ? 'ok' : 'empty', note: 'via /market-intelligence' },
    { label: 'Stripe aktiv',             value: 'Nein', status: 'blocked', note: 'Bewusst deaktiviert (Phase 1)' },
    { label: 'AÜG-Prüfung',             value: 'Ausstehend', status: 'warning', note: 'Erforderlich für operativen Betrieb' },
    { label: 'Pilot-Abschlüsse',         value: '0',    status: 'missing', note: 'Noch kein Pilot' },
  ]

  function badgeCls(status: string) {
    if (status === 'ok')      return 'bg-green-100 text-green-700 border-green-200'
    if (status === 'empty')   return 'bg-blue-100 text-blue-600 border-blue-200'
    if (status === 'missing') return 'bg-red-100 text-red-700 border-red-200'
    if (status === 'blocked') return 'bg-orange-100 text-orange-700 border-orange-200'
    if (status === 'warning') return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    return 'bg-gray-100 text-gray-600 border-gray-200'
  }
  function badgeLabel(status: string) {
    if (status === 'ok')      return '✅ Vorhanden'
    if (status === 'empty')   return '⬜ Leer (0)'
    if (status === 'missing') return '❌ Fehlt'
    if (status === 'blocked') return '🔒 Deaktiviert'
    if (status === 'warning') return '⚠️ Offen'
    return status
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">📊 Commercial Proof Tracker</h1>
        <p className="text-gray-500 mt-1">Ehrlicher Stand — was ist bewiesen, was fehlt noch.</p>
        <p className="text-xs text-gray-400 mt-1">Keine erfundenen Zahlen · Kein Schönreden · Stand: {new Date().toLocaleDateString('de-DE')}</p>
      </div>

      {/* Score */}
      <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm text-gray-500 uppercase font-semibold">Commercial Proof Score</div>
            <div className="text-5xl font-black text-red-600 mt-1">4<span className="text-2xl text-gray-400">/20</span></div>
            <div className="text-sm text-red-700 font-semibold mt-1">Schwach — Phase 1 Pre-Revenue</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Gesamt-Leads (alle Typen)</div>
            <div className="text-4xl font-bold text-gray-700">{totalLeads}</div>
          </div>
        </div>
        <p className="text-xs text-red-700">
          ⚠️ <strong>Ehrlicher Hinweis:</strong> 0 zahlende Kunden, 0 EUR Umsatz. Stripe nicht aktiv.
          Score wird erst erhöht, wenn echte zahlende Kunden oder echte Umsätze vorhanden sind.
        </p>
      </div>

      {/* Proof Items */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b bg-gray-50">
          <h2 className="font-bold text-gray-900">Commercial Proof — Vollständige Übersicht</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {PROOF_ITEMS.map(item => (
            <div key={item.label} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-gray-800">{item.label}</span>
                <span className="text-xs text-gray-400 ml-2">— {item.note}</span>
              </div>
              <div className="flex items-center gap-3 ml-3">
                <span className="text-sm font-semibold text-gray-700">{item.value}</span>
                <span className={`px-2 py-0.5 text-xs rounded-full border font-semibold ${badgeCls(item.status)}`}>
                  {badgeLabel(item.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Was noch fehlt */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-5">
        <h2 className="font-bold text-gray-900 mb-3">🎯 Was noch fehlt für echten Commercial Proof</h2>
        <div className="space-y-2 text-sm text-amber-800">
          <div>1. <strong>Ersten zahlenden Kunden gewinnen</strong> — Strategic Partnership, White-Label oder Employer Pilot Deal</div>
          <div>2. <strong>Payment aktivieren</strong> — Stripe konfigurieren oder Rechnung-basiertes Billing</div>
          <div>3. <strong>AÜG-Rechtsprüfung</strong> — vor operativem DE/EU-Betrieb</div>
          <div>4. <strong>AGB vervollständigen</strong> — Widerruf, Leistungsbeschreibung</div>
          <div>5. <strong>Echten Pilot abschließen</strong> — auch ohne Zahlung als Proof-of-Value</div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: 'Buyer Readiness',      href: '/admin/buyer-readiness' },
          { label: 'Revenue Inbox',        href: '/admin/revenue-inbox' },
          { label: 'Global Rev Control',   href: '/admin/global-revenue-control' },
          { label: 'Sale Room',            href: '/admin/sale-room' },
          { label: 'Strategic Partnership', href: '/strategic-partnership' },
          { label: 'CWO Command Center',   href: '/admin/cwo-command-center' },
        ].map(l => (
          <a key={l.href} href={l.href}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-center text-gray-700 hover:bg-gray-50 transition-colors">
            {l.label}
          </a>
        ))}
      </div>

    </div>
  )
}
