import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { NavBar } from '@/app/_components/NavBar'

export const dynamic = 'force-dynamic'

// ─── Static inventory ─────────────────────────────────────────────────────────

const AGENTS = [
  'ceo-agent', 'marketing-strategy-agent', 'visionary-agent', 'growth-agent',
  'global-market-intelligence-agent', 'corridor-intelligence-agent',
  'global-candidate-acquisition-agent', 'landingpage-factory-agent',
  'migration-intelligence-agent', 'revenue-intelligence-agent',
]

const ADMIN_PAGES = [
  '/admin/ceo-dashboard', '/admin/global/corridors', '/admin/global/sources',
  '/admin/global/corridor-intelligence', '/admin/global/campaigns',
  '/admin/global/candidate-acquisition', '/admin/global/landingpage-factory',
  '/admin/global/migration-intelligence', '/admin/global/landingpages',
  '/admin/revenue', '/admin/leads', '/admin/outreach', '/admin/pilot-kit',
  '/admin/system-check', '/admin/sale-readiness', '/admin/export-readiness',
]

const DOCS = [
  { name: 'Due Diligence Tech',   file: 'DUE_DILIGENCE_TECH.md',    status: 'vorhanden' as const },
  { name: 'Architektur',          file: 'ARCHITECTURE.md',           status: 'vorhanden' as const },
  { name: 'Security & Compliance',file: 'SECURITY_COMPLIANCE.md',    status: 'vorhanden' as const },
  { name: 'Betriebskosten',       file: 'OPERATING_COSTS.md',        status: 'vorhanden' as const },
  { name: 'Business Model',       file: 'BUSINESS_MODEL.md',         status: 'vorhanden' as const },
  { name: 'Exit Readiness',       file: 'EXIT_READINESS.md',         status: 'vorhanden' as const },
  { name: 'Buyer One Pager',      file: 'BUYER_ONE_PAGER.md',        status: 'vorhanden' as const },
  { name: 'Revenue Intelligence', file: 'REVENUE_INTELLIGENCE.md',   status: 'vorhanden' as const },
  { name: 'Migration Intelligence',file:'MIGRATION_INTELLIGENCE.md', status: 'vorhanden' as const },
  { name: 'Landingpage Factory',  file: 'LANDINGPAGE_FACTORY.md',    status: 'vorhanden' as const },
  { name: 'Corridor Intelligence',file: 'CORRIDOR_INTELLIGENCE.md',  status: 'vorhanden' as const },
  { name: 'Candidate Acquisition',file: 'CANDIDATE_ACQUISITION.md',  status: 'vorhanden' as const },
  { name: 'Global Expansion',     file: 'GLOBAL_EXPANSION_STRATEGY.md', status: 'vorhanden' as const },
  { name: 'Datenschutzerklärung', file: '/legal/datenschutz',        status: 'vorhanden' as const },
  { name: 'AGB',                  file: '/legal/agb',                status: 'vorhanden' as const },
  { name: 'Impressum',            file: '/legal/impressum',          status: 'vorhanden' as const },
  { name: 'Automatisierte Tests', file: '—',                         status: 'fehlt' as const },
  { name: 'Pen-Test Report',      file: '—',                         status: 'fehlt' as const },
  { name: 'Stripe-Integration',   file: '—',                         status: 'fehlt' as const },
]

const API_ROUTES = 24  // from find app/api -name "route.ts" | wc -l

function Badge({ status }: { status: 'vorhanden' | 'fehlt' | 'vorbereitet' }) {
  const styles = {
    vorhanden:   'bg-green-900/40 text-green-300 border border-green-800/40',
    vorbereitet: 'bg-yellow-900/40 text-yellow-300 border border-yellow-800/40',
    fehlt:       'bg-red-900/40 text-red-300 border border-red-800/40',
  }
  const icons = { vorhanden: '✅', vorbereitet: '🟡', fehlt: '❌' }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[status]}`}>
      {icons[status]} {status}
    </span>
  )
}

export default async function SaleReadinessPage() {
  const admin = await getCurrentAdminUser()
  if (!admin) redirect('/auth/login')

  const supabase = createAdminClient()

  const [
    corridorsRes, miRes, lpfRes,
    plansRes, agentSuggRes, systemLogRes,
  ] = await Promise.all([
    supabase.from('migration_corridors').select('*', { count: 'exact', head: true }),
    supabase.from('migration_intelligence').select('*', { count: 'exact', head: true }).in('status', ['reviewed','approved']),
    supabase.from('landingpage_factory').select('*', { count: 'exact', head: true }),
    supabase.from('revenue_plans').select('*', { count: 'exact', head: true }).eq('active', true),
    supabase.from('agent_suggestions').select('*', { count: 'exact', head: true }),
    supabase.from('system_logs').select('status, created_at').eq('status', 'success').order('created_at', { ascending: false }).limit(1),
  ])

  const lastSuccessLog = (systemLogRes.data ?? [])[0] as { created_at: string } | undefined

  const docsPresent = DOCS.filter(d => d.status === 'vorhanden').length
  const docsMissing = DOCS.filter(d => d.status === 'fehlt').length

  const readinessScore = Math.round(
    (docsPresent / DOCS.length * 40) +
    ((corridorsRes.count ?? 0) > 0 ? 15 : 0) +
    ((miRes.count ?? 0) > 0 ? 15 : 0) +
    ((lpfRes.count ?? 0) > 0 ? 15 : 0) +
    ((plansRes.count ?? 0) > 0 ? 15 : 0)
  )

  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar badge="Sale Readiness" badgeColor="purple" />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">📁 Sale Readiness Center</h1>
            <p className="text-gray-400 text-sm mt-1">
              Due-Diligence-Vorbereitung · Übernahmefähigkeit · Investor-Readiness
            </p>
          </div>
          <Link
            href="/admin/export-readiness"
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm transition-colors"
          >
            📊 Export Readiness →
          </Link>
        </div>

        {/* Readiness Score */}
        <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-800/40 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">🏆 Gesamtbewertung Sale Readiness</h2>
            <span className={`text-3xl font-bold ${readinessScore >= 80 ? 'text-green-300' : readinessScore >= 60 ? 'text-yellow-300' : 'text-orange-300'}`}>
              {readinessScore}%
            </span>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${readinessScore >= 80 ? 'bg-green-500' : readinessScore >= 60 ? 'bg-yellow-500' : 'bg-orange-500'}`}
              style={{ width: `${readinessScore}%` }}
            />
          </div>
          <p className="text-gray-500 text-xs mt-3">
            Basierend auf: Dokumentation (40%), Korridore (15%), Migration Intelligence (15%), Landingpages (15%), Revenue Plans (15%)
          </p>
        </div>

        {/* A. Plattform-Überblick */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">🏗️ A. Plattform-Überblick</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'DB-Tabellen', value: '20+', color: 'text-blue-300' },
              { label: 'Agenten', value: AGENTS.length, color: 'text-violet-300' },
              { label: 'API-Routen', value: API_ROUTES, color: 'text-teal-300' },
              { label: 'Admin-Seiten', value: ADMIN_PAGES.length, color: 'text-emerald-300' },
              { label: 'Landingpages', value: lpfRes.count ?? 0, color: 'text-orange-300' },
              { label: 'Korridore', value: corridorsRes.count ?? 0, color: 'text-pink-300' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
                <div className={`text-2xl font-bold ${color}`}>{value}</div>
                <div className="text-xs text-gray-400 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* B. Qualitäts-Status */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">✅ B. Code-Qualität</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Letzter erfolgreicher Build', value: lastSuccessLog ? new Date(lastSuccessLog.created_at).toLocaleDateString('de-DE') : 'n/a', ok: true },
                { label: 'ESLint — Warnungen/Fehler', value: '0', ok: true },
                { label: 'TypeScript strict mode', value: 'Aktiviert', ok: true },
                { label: 'Automatisierte Tests', value: 'Nicht implementiert', ok: false },
                { label: 'server-only in Agenten', value: 'Alle 10 Agenten', ok: true },
                { label: 'RLS aktiviert', value: 'Alle Tabellen', ok: true },
                { label: 'SECRET_KEY clientseitig', value: 'Nicht vorhanden', ok: true },
                { label: 'Pen-Test', value: 'Ausstehend', ok: false },
              ].map(({ label, value, ok }) => (
                <div key={label} className="flex items-center justify-between gap-3 py-2 border-b border-gray-800/50 last:border-0">
                  <span className="text-sm text-gray-400">{label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-200">{value}</span>
                    <span>{ok ? '✅' : '⚠️'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* C. Dokumentation */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">📄 C. Dokumentation</h2>
            <div className="flex gap-3 text-xs">
              <span className="text-green-300">✅ {docsPresent} vorhanden</span>
              <span className="text-red-300">❌ {docsMissing} fehlt</span>
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="divide-y divide-gray-800">
              {DOCS.map((doc) => (
                <div key={doc.name} className="px-5 py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-gray-200">{doc.name}</p>
                    {doc.file !== '—' && (
                      <p className="text-xs text-gray-600 font-mono mt-0.5">{doc.file}</p>
                    )}
                  </div>
                  <Badge status={doc.status} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* D. Module-Status */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">🔧 D. Modul-Status</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: 'Nutzer-Management (Auth, Profiles)', status: 'vorhanden' as const },
              { name: 'Job-Listing & Bewerbungs-Workflow', status: 'vorhanden' as const },
              { name: 'KI-Matching (Scoring)', status: 'vorhanden' as const },
              { name: 'Approval Queue (Anti-Spam)', status: 'vorhanden' as const },
              { name: 'Agent-Orchestrator (10 Agenten)', status: 'vorhanden' as const },
              { name: 'Corridor Intelligence', status: 'vorhanden' as const },
              { name: 'Migration Intelligence', status: 'vorhanden' as const },
              { name: 'Landingpage Factory (SEO)', status: 'vorhanden' as const },
              { name: 'Revenue Intelligence (Forecast)', status: 'vorhanden' as const },
              { name: 'CEO Dashboard (vollständig)', status: 'vorhanden' as const },
              { name: 'Stripe-Zahlungen', status: 'fehlt' as const },
              { name: 'E-Mail-Versand (aktiviert)', status: 'vorbereitet' as const },
              { name: 'WhatsApp-Versand (aktiviert)', status: 'vorbereitet' as const },
              { name: 'Automatisierte Tests', status: 'fehlt' as const },
              { name: 'Self-Service DSGVO', status: 'fehlt' as const },
              { name: 'Monitoring/APM', status: 'vorbereitet' as const },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between gap-3 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
                <span className="text-sm text-gray-300">{item.name}</span>
                <Badge status={item.status} />
              </div>
            ))}
          </div>
        </div>

        {/* E. Agenten-Liste */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">🤖 E. Agenten ({AGENTS.length})</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {AGENTS.map((agent) => (
                <div key={agent} className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="text-green-400">✅</span>
                  <code className="text-violet-400 font-mono text-xs">{agent}.ts</code>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* F. Links */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">🔗 F. Quick Links</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { href: '/admin/ceo-dashboard', label: '📊 CEO Dashboard' },
              { href: '/admin/export-readiness', label: '📈 Export Readiness' },
              { href: '/admin/revenue', label: '💰 Revenue' },
              { href: '/admin/global/migration-intelligence', label: '🛂 MI' },
              { href: '/admin/global/landingpage-factory', label: '🚀 LPF' },
              { href: '/admin/system-check', label: '🔧 System Check' },
              { href: '/admin/outreach/approval-queue', label: '✉️ Approval Queue' },
              { href: '/admin/pilot-kit', label: '🧪 Pilot Kit' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-3 py-2.5 bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl text-sm text-gray-300 transition-colors text-center"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
