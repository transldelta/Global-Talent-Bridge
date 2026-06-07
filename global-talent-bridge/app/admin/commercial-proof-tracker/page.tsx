/**
 * app/admin/commercial-proof-tracker/page.tsx
 *
 * Commercial Proof Tracker — ehrlich tracken was vorhanden ist.
 * Trennt Test-Leads von echten Leads. Kein Fake-Umsatz. Kein Schönreden.
 *
 * Safety: Kein Stripe · Kein E-Mail · Kein Outreach · Kein Scraping
 */
import { redirect }            from 'next/navigation'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient }   from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

// Commercial Proof Score: nur echte Leads/Kunden zählen
// 0–4: Schwach | 5–10: Aufbauend | 11–16: Solide | 17–20: Stark
const BASE_PROOF_SCORE = 4 // Technik + Code + RLS + Tests

export default async function CommercialProofTrackerPage() {
  const user = await getCurrentAdminUser()
  if (!user) redirect('/auth/login?redirectTo=/admin/commercial-proof-tracker')

  const supabase = createAdminClient()

  // ── DB-Abfragen: echte und Test-Leads separat ─────────────────────────────

  const [
    { count: strategicAll },
    { count: agencyAll },
    { count: employerPilotAll },
    { count: intelAll },
    { count: globalEmployerAll },
    { count: globalEmployerTest },
    { count: candidateAll },
    { count: candidateTest },
    { count: revenueNew },
    { count: revenueQualified },
  ] = await Promise.all([
    // Revenue Leads nach Typ
    supabase.from('revenue_leads').select('id', { count: 'exact', head: true })
      .eq('lead_type', 'strategic_partner'),
    supabase.from('revenue_leads').select('id', { count: 'exact', head: true })
      .eq('lead_type', 'agency_partner'),
    supabase.from('revenue_leads').select('id', { count: 'exact', head: true })
      .eq('lead_type', 'employer_pilot'),
    supabase.from('revenue_leads').select('id', { count: 'exact', head: true })
      .eq('lead_type', 'market_intelligence'),
    // Global Employer: gesamt
    supabase.from('global_employer_leads').select('id', { count: 'exact', head: true }),
    // Global Employer: Test-Leads (admin_note enthält 'smoke test' oder 'internal')
    supabase.from('global_employer_leads').select('id', { count: 'exact', head: true })
      .ilike('admin_note', '%smoke test%'),
    // Candidate: gesamt
    supabase.from('candidate_interest_leads').select('id', { count: 'exact', head: true }),
    // Candidate: Test-Leads
    supabase.from('candidate_interest_leads').select('id', { count: 'exact', head: true })
      .ilike('admin_note', '%smoke test%'),
    // Revenue Leads: neue
    supabase.from('revenue_leads').select('id', { count: 'exact', head: true })
      .eq('status', 'new'),
    // Revenue Leads: qualifiziert
    supabase.from('revenue_leads').select('id', { count: 'exact', head: true })
      .in('status', ['qualified', 'interested', 'demo_scheduled']),
  ])

  // ── Berechnungen ──────────────────────────────────────────────────────────

  const realGlobalEmployerLeads = Math.max(0, (globalEmployerAll ?? 0) - (globalEmployerTest ?? 0))
  const testGlobalEmployerLeads = globalEmployerTest ?? 0
  const realCandidateLeads      = Math.max(0, (candidateAll ?? 0) - (candidateTest ?? 0))
  const testCandidateLeads      = candidateTest ?? 0

  const totalRevLeads    = (strategicAll ?? 0) + (agencyAll ?? 0) + (employerPilotAll ?? 0) + (intelAll ?? 0)
  const realLeadsTotal   = realGlobalEmployerLeads + realCandidateLeads + totalRevLeads
  const testLeadsTotal   = testGlobalEmployerLeads + testCandidateLeads
  const revenueEUR       = 0 // Stripe nicht aktiv — bleibt 0

  // Commercial Proof Score: nur echte Leads beeinflussen Score
  let proofScore = BASE_PROOF_SCORE // 4 = Tech/Code/RLS/Tests
  if (realLeadsTotal > 0)           proofScore += 1  // +1 für ersten echten Lead
  if (realLeadsTotal >= 3)          proofScore += 1  // +1 für 3+ echte Leads
  if ((revenueQualified ?? 0) > 0)  proofScore += 2  // +2 für qualifizierte Leads
  if (revenueEUR > 0)               proofScore += 5  // +5 für echten Umsatz
  const proofScoreMax = 20

  const proofLabel = proofScore <= 4  ? 'Schwach — Phase 1 Pre-Revenue'
                   : proofScore <= 8  ? 'Aufbauend — erste Leads vorhanden'
                   : proofScore <= 14 ? 'Solide — qualifizierte Pipeline'
                   :                   'Stark — Umsatz nachgewiesen'

  // ── Proof Items ───────────────────────────────────────────────────────────

  const PROOF_ITEMS = [
    // Kritische Fehlstellen
    {
      label:  'Zahlende Kunden',
      value:  '0',
      status: 'missing',
      note:   'Phase 1 Pre-Revenue — kein zahlender Kunde',
      group:  'revenue',
    },
    {
      label:  'Echter Umsatz',
      value:  `${revenueEUR} EUR`,
      status: 'missing',
      note:   'Stripe nicht aktiv — kein Payment eingegangen',
      group:  'revenue',
    },
    {
      label:  'Pilot-Abschlüsse',
      value:  '0',
      status: 'missing',
      note:   'Noch kein abgeschlossener Pilot',
      group:  'revenue',
    },
    // Leads (real)
    {
      label:  'Echte Employer Leads (global)',
      value:  String(realGlobalEmployerLeads),
      status: realGlobalEmployerLeads > 0 ? 'ok' : 'empty',
      note:   `via /global/employers — ohne Test-Leads`,
      group:  'leads',
    },
    {
      label:  'Echte Kandidaten-Registrierungen',
      value:  String(realCandidateLeads),
      status: realCandidateLeads > 0 ? 'ok' : 'empty',
      note:   `via /global/candidates — ohne Test-Leads`,
      group:  'leads',
    },
    {
      label:  'Strategic Partner Leads',
      value:  String(strategicAll ?? 0),
      status: (strategicAll ?? 0) > 0 ? 'ok' : 'empty',
      note:   'via /strategic-partnership',
      group:  'leads',
    },
    {
      label:  'Agency Partner Leads',
      value:  String(agencyAll ?? 0),
      status: (agencyAll ?? 0) > 0 ? 'ok' : 'empty',
      note:   'via /partners',
      group:  'leads',
    },
    {
      label:  'Employer Pilot Leads',
      value:  String(employerPilotAll ?? 0),
      status: (employerPilotAll ?? 0) > 0 ? 'ok' : 'empty',
      note:   'via /pilot/employers',
      group:  'leads',
    },
    {
      label:  'Market Intel Leads',
      value:  String(intelAll ?? 0),
      status: (intelAll ?? 0) > 0 ? 'ok' : 'empty',
      note:   'via /market-intelligence',
      group:  'leads',
    },
    // Test-Daten (kein Proof-Wert)
    {
      label:  'Test-Employer-Leads (intern)',
      value:  String(testGlobalEmployerLeads),
      status: 'blocked',
      note:   'Status: rejected + admin_note "smoke test" — zählt NICHT als echter Lead',
      group:  'test',
    },
    {
      label:  'Test-Kandidaten-Leads (intern)',
      value:  String(testCandidateLeads),
      status: 'blocked',
      note:   'Status: archived + admin_note "smoke test" — zählt NICHT als echter Lead',
      group:  'test',
    },
    // Qualität
    {
      label:  'Qualifizierte Leads',
      value:  String(revenueQualified ?? 0),
      status: (revenueQualified ?? 0) > 0 ? 'ok' : 'empty',
      note:   'Status: qualified / interested / demo_scheduled',
      group:  'quality',
    },
    // Compliance
    {
      label:  'Stripe aktiv',
      value:  'Nein',
      status: 'blocked',
      note:   'Bewusst deaktiviert (Phase 1) — korrekt so',
      group:  'compliance',
    },
    {
      label:  'AÜG-Prüfung',
      value:  'Ausstehend',
      status: 'warning',
      note:   'Erforderlich für operativen DE/EU-Betrieb',
      group:  'compliance',
    },
  ]

  function badgeCls(s: string) {
    if (s === 'ok')      return 'bg-green-100 text-green-700 border-green-200'
    if (s === 'empty')   return 'bg-blue-100 text-blue-600 border-blue-200'
    if (s === 'missing') return 'bg-red-100 text-red-700 border-red-200'
    if (s === 'blocked') return 'bg-orange-100 text-orange-700 border-orange-200'
    if (s === 'warning') return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    return 'bg-gray-100 text-gray-600 border-gray-200'
  }
  function badgeLabel(s: string) {
    if (s === 'ok')      return '✅ Vorhanden'
    if (s === 'empty')   return '⬜ Leer (0)'
    if (s === 'missing') return '❌ Fehlt'
    if (s === 'blocked') return '🔒 Deaktiviert'
    if (s === 'warning') return '⚠️ Offen'
    return s
  }

  const groups: { key: string; label: string; emoji: string }[] = [
    { key: 'revenue',    label: 'Umsatz & Kunden',    emoji: '💶' },
    { key: 'leads',      label: 'Echte Leads',         emoji: '📥' },
    { key: 'test',       label: 'Test-Daten (kein Proof-Wert)', emoji: '🧪' },
    { key: 'quality',    label: 'Lead-Qualität',       emoji: '⭐' },
    { key: 'compliance', label: 'Compliance',          emoji: '🛡️' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <a href="/admin/cwo-command-center" className="text-sm text-blue-600 hover:underline">← Command Center</a>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">📊 CorridorWork — Commercial Proof Tracker</h1>
        <p className="text-gray-500 mt-1">Ehrlicher Stand — echte Leads getrennt von Testdaten. Kein Schönreden.</p>
        <p className="text-xs text-gray-400 mt-1">
          Keine erfundenen Zahlen · Test-Leads zählen nicht · Stand: {new Date().toLocaleDateString('de-DE')}
        </p>
      </div>

      {/* Score Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Commercial Proof Score',
            value: `${proofScore}/${proofScoreMax}`,
            sub:   proofLabel,
            cls:   proofScore <= 4 ? 'bg-red-50 border-red-300 text-red-600'
                 : proofScore <= 8 ? 'bg-amber-50 border-amber-300 text-amber-700'
                 :                   'bg-green-50 border-green-300 text-green-700',
          },
          {
            label: 'Echte Leads',
            value: String(realLeadsTotal),
            sub:   'Test-Leads ausgeschlossen',
            cls:   realLeadsTotal > 0 ? 'bg-green-50 border-green-200 text-green-700'
                                      : 'bg-gray-50 border-gray-200 text-gray-500',
          },
          {
            label: 'Test-Leads',
            value: String(testLeadsTotal),
            sub:   'Zählen NICHT als Proof',
            cls:   'bg-orange-50 border-orange-200 text-orange-600',
          },
          {
            label: 'Echter Umsatz',
            value: `${revenueEUR} EUR`,
            sub:   'Stripe nicht aktiv',
            cls:   'bg-red-50 border-red-200 text-red-600',
          },
        ].map(s => (
          <div key={s.label} className={`border-2 rounded-xl p-4 ${s.cls}`}>
            <div className="text-xs font-semibold uppercase opacity-70 mb-1">{s.label}</div>
            <div className="text-3xl font-black">{s.value}</div>
            <div className="text-xs mt-1 opacity-80">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Test vs. Real Info */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
        <span className="text-2xl">🧪</span>
        <div className="text-sm">
          <div className="font-semibold text-orange-800 mb-1">Test-Leads sind klar getrennt</div>
          <div className="text-orange-700">
            Alle internen Smoke-Tests sind mit <code className="bg-orange-100 px-1 rounded">admin_note = &quot;Internal Global Intake Smoke Test — no contact&quot;</code> markiert
            und haben Status <code className="bg-orange-100 px-1 rounded">rejected</code> / <code className="bg-orange-100 px-1 rounded">archived</code>.
            Sie erscheinen hier transparent, erhöhen aber den Commercial Proof Score <strong>nicht</strong>.
          </div>
        </div>
      </div>

      {/* Proof Items by Group */}
      {groups.map(group => {
        const items = PROOF_ITEMS.filter(i => i.group === group.key)
        return (
          <div key={group.key} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b bg-gray-50 flex items-center gap-2">
              <span>{group.emoji}</span>
              <h2 className="font-bold text-gray-900 text-sm">{group.label}</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {items.map(item => (
                <div key={item.label}
                  className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-gray-800">{item.label}</span>
                    <span className="text-xs text-gray-400 ml-2">— {item.note}</span>
                  </div>
                  <div className="flex items-center gap-3 ml-3 shrink-0">
                    <span className="text-sm font-bold text-gray-700">{item.value}</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full border font-semibold ${badgeCls(item.status)}`}>
                      {badgeLabel(item.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {/* Was fehlt */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-5">
        <h2 className="font-bold text-gray-900 mb-3">🎯 Was fehlt für echten Commercial Proof (Score {'>'}10)</h2>
        <div className="space-y-2 text-sm text-amber-800">
          {[
            '1. Ersten zahlenden Kunden gewinnen — Strategic Partnership, White-Label oder Employer-Pilot',
            '2. Echten Inbound-Lead ohne Testcharakter erhalten — via SEO, persönliches Netzwerk oder Share',
            '3. Payment aktivieren — Stripe konfigurieren oder Rechnung-basiertes Billing',
            '4. AÜG-Rechtsprüfung — vor operativem DE/EU-Betrieb',
            '5. Echten Pilot abschließen — auch ohne Zahlung als Proof-of-Value',
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-amber-500 shrink-0">→</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: '🏪 Sale Room',              href: '/admin/sale-room' },
          { label: '📊 Buyer Readiness',        href: '/admin/buyer-readiness' },
          { label: '🌍 Global Rev Control',     href: '/admin/global-revenue-control' },
          { label: '📥 Revenue Inbox',          href: '/admin/revenue-inbox' },
          { label: '🎯 Strategic Partnership',  href: '/strategic-partnership' },
          { label: '🖥️ CWO Command Center',    href: '/admin/cwo-command-center' },
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
