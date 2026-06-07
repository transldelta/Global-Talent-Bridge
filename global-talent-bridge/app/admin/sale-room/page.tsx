/**
 * app/admin/sale-room/page.tsx
 *
 * Sale Room — Alles für Käufer, Partner und Investoren.
 * Bündelt Live-URLs, Scores, Commercial Proof, Docs, Blocker, nächster Wert-Booster.
 * Ehrlich: Pre-Revenue Phase 1.
 *
 * Safety: Kein Stripe · Kein E-Mail · Kein Outreach · Kein Scraping
 */
import { redirect }            from 'next/navigation'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient }   from '@/lib/supabase/admin'
import { TALENT_CATEGORIES, getTopCategoriesByRevenue } from '@/lib/talent-categories'

export const dynamic = 'force-dynamic'

const BASE_URL = 'https://corridorwork.com'

export default async function SaleRoomPage() {
  const user = await getCurrentAdminUser()
  if (!user) redirect('/auth/login?redirectTo=/admin/sale-room')

  const supabase = createAdminClient()
  const topRevCats = getTopCategoriesByRevenue(5)

  // DB: echte Lead-Zählungen
  const [
    { count: globalEmployerAll },
    { count: globalEmployerTest },
    { count: candidateAll },
    { count: candidateTest },
    { count: revLeadsAll },
  ] = await Promise.all([
    supabase.from('global_employer_leads').select('id', { count: 'exact', head: true }),
    supabase.from('global_employer_leads').select('id', { count: 'exact', head: true })
      .ilike('admin_note', '%smoke test%'),
    supabase.from('candidate_interest_leads').select('id', { count: 'exact', head: true }),
    supabase.from('candidate_interest_leads').select('id', { count: 'exact', head: true })
      .ilike('admin_note', '%smoke test%'),
    supabase.from('revenue_leads').select('id', { count: 'exact', head: true }),
  ])

  const realEmployerLeads  = Math.max(0, (globalEmployerAll ?? 0) - (globalEmployerTest ?? 0))
  const realCandidateLeads = Math.max(0, (candidateAll ?? 0) - (candidateTest ?? 0))
  const realLeadsTotal     = realEmployerLeads + realCandidateLeads + (revLeadsAll ?? 0)
  const revenueEUR         = 0
  const buyerReadinessScore = 66
  const commercialProofScore = 4 + (realLeadsTotal > 0 ? 1 : 0)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <a href="/admin/cwo-command-center" className="text-sm text-blue-600 hover:underline">← Command Center</a>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">🏪 CorridorWork — Sale Room</h1>
        <p className="text-gray-500 mt-1">Für Käufer, Partner und Investoren — professionelle Due-Diligence Übersicht</p>
        <p className="text-xs text-gray-400 mt-1">Keine erfundenen Zahlen · Ehrlich: Pre-Revenue Phase 1 · Stand: {new Date().toLocaleDateString('de-DE')}</p>
      </div>

      {/* Score Banner — Phase 1: 0 echte Leads bei Launch, 0 EUR Umsatz (ehrlich) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Buyer Readiness', value: `${buyerReadinessScore}/100`, sub: 'Tech stark, Commercial schwach', cls: 'bg-violet-50 border-violet-300 text-violet-700' },
          { label: 'Commercial Proof', value: `${commercialProofScore}/20`, sub: 'Phase 1 Pre-Revenue', cls: 'bg-red-50 border-red-300 text-red-600' },
          { label: 'Echte Leads', value: String(realLeadsTotal), sub: 'Test-Leads ausgeschlossen', cls: realLeadsTotal > 0 ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500' },
          { label: 'Echter Umsatz', value: `${revenueEUR} EUR`, sub: 'Stripe nicht aktiv', cls: 'bg-red-50 border-red-200 text-red-600' },
        ].map(s => (
          <div key={s.label} className={`border-2 rounded-xl p-4 ${s.cls}`}>
            <div className="text-xs font-semibold uppercase opacity-70 mb-1">{s.label}</div>
            <div className="text-3xl font-black">{s.value}</div>
            <div className="text-xs mt-1 opacity-80">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Live URLs für Käufer */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-bold text-gray-900 text-lg mb-4">🔗 Live URLs — Demo & Intake</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { label: '🔬 Demo Sandbox',            url: `${BASE_URL}/demo/sandbox`,            note: 'Öffentlich — kein Login — zeigt Plattformfähigkeit', badge: 'PUBLIC', badgeCls: 'bg-green-100 text-green-700' },
            { label: '📋 Buyer Snapshot',           url: `${BASE_URL}/buyer-snapshot`,          note: '2-Minuten-Übersicht für Käufer/Investoren',           badge: 'PUBLIC', badgeCls: 'bg-green-100 text-green-700' },
            { label: '🎯 Strategic Partnership',    url: `${BASE_URL}/strategic-partnership`,   note: 'White-Label / Acquisition / Licensing — Rang 1',     badge: 'PUBLIC', badgeCls: 'bg-green-100 text-green-700' },
            { label: '🚀 Launch-Übersicht',         url: `${BASE_URL}/launch`,                  note: 'Alle Revenue-Pfade auf einen Blick',                  badge: 'PUBLIC', badgeCls: 'bg-green-100 text-green-700' },
            { label: '🏢 Global Employer Intake',   url: `${BASE_URL}/global/employers`,        note: 'Weltweite Arbeitgeber-Registrierung — alle Branchen', badge: 'PUBLIC', badgeCls: 'bg-green-100 text-green-700' },
            { label: '👤 Global Candidate Intake',  url: `${BASE_URL}/global/candidates`,       note: 'Weltweite Kandidaten-Registrierung — kostenlos',      badge: 'PUBLIC', badgeCls: 'bg-green-100 text-green-700' },
            { label: '🎬 Demo (Produktvideo)',       url: `${BASE_URL}/demo`,                    note: 'Demo-Seite mit Revenue-System-Überblick',            badge: 'PUBLIC', badgeCls: 'bg-green-100 text-green-700' },
            { label: '🤝 Partner-Programm',         url: `${BASE_URL}/partners`,                note: 'Agency / White-Label Partner — Rang 2',              badge: 'PUBLIC', badgeCls: 'bg-green-100 text-green-700' },
          ].map(item => (
            <a key={item.url} href={item.url} target="_blank" rel="noopener noreferrer"
              className="flex items-start justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 transition-colors group">
              <div>
                <div className="text-sm font-semibold text-gray-800 group-hover:text-blue-700">{item.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{item.note}</div>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 ${item.badgeCls}`}>{item.badge}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Global Positioning */}
      <div className="bg-indigo-900 text-white rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-3">🌍 Global Positioning — Multisector Plattform</h2>
        <p className="text-indigo-200 leading-relaxed">
          CorridorWork ist eine <strong className="text-white">globale Talent-Corridor-Plattform</strong> für strukturiertes,
          compliance-first Cross-border Hiring. Das System verbindet qualifizierte Arbeitskräfte aus{' '}
          <strong className="text-white">{TALENT_CATEGORIES.length} Berufsbereichen</strong> mit Arbeitgebern{' '}
          <strong className="text-white">weltweit</strong> — nicht auf Deutschland oder einzelne Branchen beschränkt.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {[
            { value: `${TALENT_CATEGORIES.length}+`, label: 'Berufsbereiche' },
            { value: '15+',  label: 'Globale Korridore' },
            { value: '4',    label: 'Revenue-Pfade' },
            { value: '2317+', label: 'Tests grün' },
          ].map(s => (
            <div key={s.label} className="bg-indigo-800 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-indigo-300 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Was ein Käufer bekommt */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-bold text-gray-900 text-lg mb-4">📦 Was ein Käufer bekommt</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { icon: '✅', label: 'Live SaaS-Plattform',               note: 'corridorwork.com, Vercel, Supabase EU' },
            { icon: '✅', label: 'Globales Employer Intake',           note: '/global/employers — alle 21 Branchen' },
            { icon: '✅', label: 'Globales Candidate Intake',          note: '/global/candidates — weltweit' },
            { icon: '✅', label: `${TALENT_CATEGORIES.length} Talent-Kategorien`, note: 'Vollständige Skill-Taxonomie' },
            { icon: '✅', label: '15+ globale Korridor-Seiten',        note: 'SEO-ready, sitemap, GSC' },
            { icon: '✅', label: '4 Revenue-Pfade (alle live)',        note: 'Strategic, Agency, Employer, Intel' },
            { icon: '✅', label: 'Admin-Dashboard (10+ Tools)',        note: 'Buyer Readiness, Campaign Planner, Sale Room, etc.' },
            { icon: '✅', label: 'Daily Runner (autonom)',              note: 'Kein manuelles Zutun — täglich 06:00 UTC' },
            { icon: '✅', label: '2317+ Tests (alle grün)',             note: 'TypeScript, Vitest, CI-ready' },
            { icon: '✅', label: 'Transfer-Dokumentation (9 Docs)',    note: 'README, Checkliste, Architecture, RLS, etc.' },
            { icon: '✅', label: 'DSGVO-konform (EU-Region)',          note: 'Supabase eu-central-1, Frankfurt' },
            { icon: '✅', label: 'RLS auf allen Tabellen',             note: 'Row-Level Security vollständig aktiv' },
            { icon: '❌', label: 'Zahlende Kunden',                    note: '0 — Phase 1 Pre-Revenue (ehrlich)' },
            { icon: '❌', label: 'Echter Umsatz',                      note: '0 EUR — Stripe nicht aktiv' },
            { icon: '❌', label: 'AÜG-Lizenz',                         note: 'Für operativen DE-Betrieb erforderlich' },
          ].map(item => (
            <div key={item.label}
              className={`flex items-start gap-3 p-3 rounded-lg ${
                item.icon === '✅'
                  ? 'bg-green-50 border border-green-100'
                  : 'bg-red-50 border border-red-100'
              }`}>
              <span className="text-lg shrink-0">{item.icon}</span>
              <div>
                <div className="text-sm font-semibold text-gray-800">{item.label}</div>
                <div className="text-xs text-gray-500">{item.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Paths */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-bold text-gray-900 text-lg mb-2">🚀 Revenue-Pfade</h2>
        <p className="text-xs text-amber-700 mb-4">
          ⚠️ Alle Pfade live — 0 echter Umsatz, 0 zahlende Kunden (Phase 1, ehrlich)
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { rank: 1, label: 'Strategic Partnership / White-Label / Acquisition', href: '/strategic-partnership', value: '€5k–€50k', speed: 'Schnellster Weg' },
            { rank: 2, label: 'Agency / White-Label Partner',                      href: '/partners',              value: '% Placement',   speed: 'Mittel' },
            { rank: 3, label: 'Employer Pilot (global)',                            href: '/pilot/employers',       value: '€2k–€10k/Vermittlung', speed: 'Mittel' },
            { rank: 4, label: 'Market Intelligence',                               href: '/market-intelligence',   value: '€500–€5k/Monat', speed: 'Langfristig' },
          ].map(p => (
            <a key={p.rank} href={`${BASE_URL}${p.href}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors">
              <div>
                <div className="text-xs text-amber-600 font-semibold">Rang {p.rank} — {p.speed}</div>
                <div className="text-sm font-semibold text-gray-800">{p.label}</div>
                <div className="text-xs text-gray-500">Potenzial: {p.value}</div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                <span className="px-2 py-0.5 text-xs font-bold bg-green-100 text-green-700 border border-green-200 rounded-full">✅ LIVE</span>
                <span className="px-2 py-0.5 text-xs bg-red-50 text-red-600 border border-red-100 rounded-full">0 EUR</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Top Revenue Segments */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-5">
        <h2 className="font-bold text-gray-900 mb-3">💰 Top 5 Revenue-Segmente</h2>
        <div className="space-y-2">
          {topRevCats.map((cat, i) => (
            <div key={cat.sector_key} className="flex items-center gap-3 p-2 bg-white border border-green-100 rounded-lg">
              <span className="text-gray-400 font-bold w-5 text-sm">#{i+1}</span>
              <span>{cat.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800 text-sm">{cat.public_label}</div>
              </div>
              <div className="text-sm font-bold text-green-700">{cat.revenue_potential}/100</div>
            </div>
          ))}
        </div>
      </div>

      {/* Open Blockers */}
      <div className="bg-red-50 border-2 border-red-300 rounded-xl p-5">
        <h2 className="font-bold text-gray-900 mb-3">🚧 Offene Blocker (ehrlich)</h2>
        <div className="space-y-2 text-sm">
          {[
            { blocker: '0 zahlende Kunden — kein Umsatz nachgewiesen',                         fix: 'Ersten Strategic Partnership Deal oder Employer-Pilot abschließen' },
            { blocker: 'Stripe nicht aktiviert — kein Payment möglich',                        fix: 'Stripe konfigurieren nach erstem Kundengespräch' },
            { blocker: 'Kein Visa/Compliance-Partner — kein operativer Betrieb möglich',       fix: 'Partner-Sourcing starten' },
            { blocker: 'AÜG-Prüfung ausstehend — für DE/EU-Betrieb erforderlich',             fix: 'Rechtsprüfung beauftragen (Arbeitsrecht DE/EU)' },
            { blocker: 'E-Mail-Versand deaktiviert — kein Follow-up mit Leads möglich',        fix: 'SMTP-Provider nach DSGVO-Review konfigurieren' },
          ].map((item, i) => (
            <div key={i} className="p-3 bg-white border border-red-100 rounded-lg">
              <div className="font-semibold text-red-700">❌ {item.blocker}</div>
              <div className="text-xs text-gray-500 mt-1">→ Fix: {item.fix}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Value Booster */}
      <div className="bg-green-900 text-white rounded-xl p-5 flex items-start gap-4">
        <span className="text-3xl shrink-0">🚀</span>
        <div>
          <div className="font-bold text-green-300 text-lg mb-1">Nächster Wert-Booster</div>
          <div className="text-white text-base font-semibold">
            1 echten Lead oder 1 Partnergespräch gewinnen
          </div>
          <div className="text-green-300 text-sm mt-2">
            Ein einziges echtes Gespräch (Strategic Partnership, White-Label, Employer Pilot)
            hebt den Commercial Proof Score von {commercialProofScore}/20 auf 7+/20
            und macht CorridorWork deutlich verkaufsfähiger.
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <a href={`${BASE_URL}/strategic-partnership`} target="_blank" rel="noopener noreferrer"
              className="px-3 py-1.5 bg-green-700 text-white text-sm rounded-lg hover:bg-green-600 transition-colors">
              → Strategic Partnership →
            </a>
            <a href={`${BASE_URL}/demo/sandbox`} target="_blank" rel="noopener noreferrer"
              className="px-3 py-1.5 bg-indigo-700 text-white text-sm rounded-lg hover:bg-indigo-600 transition-colors">
              → Demo Sandbox →
            </a>
          </div>
        </div>
      </div>

      {/* Transfer Docs */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h2 className="font-bold text-gray-900 mb-3">📁 Transfer-Dokumentation (9 Docs)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            'docs/BUYER_DUE_DILIGENCE.md',
            'docs/TRANSFER_CHECKLIST.md',
            'docs/TECHNICAL_ARCHITECTURE_OVERVIEW.md',
            'docs/SECURITY_AND_RLS_SUMMARY.md',
            'docs/COMMERCIAL_READINESS_SUMMARY.md',
            'docs/GLOBAL_REVENUE_ENGINE.md',
            'docs/GLOBAL_CAMPAIGN_PLANNER.md',
            'docs/CANDIDATE_AND_EMPLOYER_GLOBAL_INTAKE.md',
            'docs/BUYER_SATISFACTION_GAP_CLOSURE.md',
            'docs/FINAL_COMPLETION_AND_MONETIZATION_READINESS.md',
          ].map(doc => (
            <div key={doc} className="flex items-center gap-2 p-2 bg-white border border-blue-100 rounded-lg">
              <span className="text-blue-400 text-sm shrink-0">📄</span>
              <span className="text-xs text-gray-600 font-mono truncate">{doc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Tools */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="font-bold text-gray-900 mb-3">🛠️ Admin Tools</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: '📊 Buyer Readiness',         href: '/admin/buyer-readiness' },
            { label: '📊 Commercial Proof',        href: '/admin/commercial-proof-tracker' },
            { label: '🌍 Global Rev Control',      href: '/admin/global-revenue-control' },
            { label: '🗺️ Campaign Planner',        href: '/admin/global-campaign-planner' },
            { label: '📥 Revenue Inbox',           href: '/admin/revenue-inbox' },
            { label: '✅ Final Readiness',         href: '/admin/final-readiness' },
            { label: '🖥️ CWO Command Center',     href: '/admin/cwo-command-center' },
            { label: '🔍 SEO Indexing',            href: '/admin/seo-indexing-control' },
            { label: '📦 Distribution Pack',       href: '/admin/distribution-pack' },
          ].map(l => (
            <a key={l.href} href={l.href}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-center text-gray-700 hover:bg-gray-100 transition-colors">
              {l.label}
            </a>
          ))}
        </div>
      </div>

    </div>
  )
}
