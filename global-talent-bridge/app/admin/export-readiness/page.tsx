import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { NavBar } from '@/app/_components/NavBar'
import { computeScenarios } from '@/lib/revenue/forecast'

export const dynamic = 'force-dynamic'

type TrafficLight = 'green' | 'yellow' | 'red'

type StatusItem = {
  label: string
  detail: string
  status: TrafficLight
}

function TrafficBadge({ status }: { status: TrafficLight }) {
  const config = {
    green:  { bg: 'bg-green-900/30 border-green-800/40 text-green-300',  icon: '🟢', label: 'Bereit' },
    yellow: { bg: 'bg-yellow-900/30 border-yellow-800/40 text-yellow-300', icon: '🟡', label: 'Ausstehend' },
    red:    { bg: 'bg-red-900/30 border-red-800/40 text-red-300',        icon: '🔴', label: 'Fehlt' },
  }[status]

  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${config.bg}`}>
      {config.icon} {config.label}
    </span>
  )
}

function Section({ title, items }: { title: string; items: StatusItem[] }) {
  const green  = items.filter(i => i.status === 'green').length
  const yellow = items.filter(i => i.status === 'yellow').length
  const red    = items.filter(i => i.status === 'red').length
  const overall: TrafficLight = red > 0 ? (red >= items.length / 2 ? 'red' : 'yellow') : yellow > 0 ? 'yellow' : 'green'

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-200">{title}</h3>
        <div className="flex items-center gap-3">
          <span className="text-xs text-green-400">{green}×🟢</span>
          <span className="text-xs text-yellow-400">{yellow}×🟡</span>
          <span className="text-xs text-red-400">{red}×🔴</span>
          <TrafficBadge status={overall} />
        </div>
      </div>
      <div className="divide-y divide-gray-800">
        {items.map((item) => (
          <div key={item.label} className="px-5 py-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-gray-300">{item.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.detail}</p>
            </div>
            <TrafficBadge status={item.status} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default async function ExportReadinessPage() {
  const admin = await getCurrentAdminUser()
  if (!admin) redirect('/auth/login')

  const supabase = createAdminClient()

  const [
    corridorsRes, activeCorridorsRes,
    miReviewedRes, miTotalRes,
    lpfPublishedRes, lpfTotalRes,
    plansRes, eventsRes,
    logsSuccessRes, logsErrorRes,
    candidatesRes, employersRes,
  ] = await Promise.all([
    supabase.from('migration_corridors').select('*', { count: 'exact', head: true }),
    supabase.from('migration_corridors').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('migration_intelligence').select('*', { count: 'exact', head: true }).in('status', ['reviewed','approved']),
    supabase.from('migration_intelligence').select('*', { count: 'exact', head: true }),
    supabase.from('landingpage_factory').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('landingpage_factory').select('*', { count: 'exact', head: true }),
    supabase.from('revenue_plans').select('*', { count: 'exact', head: true }).eq('active', true),
    supabase.from('revenue_events').select('*', { count: 'exact', head: true }),
    supabase.from('system_logs').select('*', { count: 'exact', head: true }).eq('status', 'success'),
    supabase.from('system_logs').select('*', { count: 'exact', head: true }).eq('status', 'error'),
    supabase.from('candidates').select('*', { count: 'exact', head: true }),
    supabase.from('employers').select('*', { count: 'exact', head: true }),
  ])

  const scenarios = computeScenarios()
  const scenarioA = scenarios[0]

  // ── Build status sections ────────────────────────────────────────────────────

  const dbStatus: StatusItem[] = [
    { label: 'Migrations-Korridore', detail: `${corridorsRes.count ?? 0} gesamt, ${activeCorridorsRes.count ?? 0} aktiv`, status: (activeCorridorsRes.count ?? 0) >= 5 ? 'green' : 'yellow' },
    { label: 'Migration Intelligence', detail: `${miReviewedRes.count ?? 0} reviewed/approved von ${miTotalRes.count ?? 0}`, status: (miReviewedRes.count ?? 0) >= 5 ? 'green' : (miReviewedRes.count ?? 0) > 0 ? 'yellow' : 'red' },
    { label: 'Landingpages', detail: `${lpfPublishedRes.count ?? 0} published, ${lpfTotalRes.count ?? 0} gesamt`, status: (lpfTotalRes.count ?? 0) >= 5 ? 'green' : (lpfTotalRes.count ?? 0) > 0 ? 'yellow' : 'red' },
    { label: 'Revenue Plans', detail: `${plansRes.count ?? 0} aktive Pläne`, status: (plansRes.count ?? 0) >= 5 ? 'green' : 'yellow' },
    { label: 'Revenue Events', detail: `${eventsRes.count ?? 0} Einträge (Forecasts)`, status: (eventsRes.count ?? 0) > 0 ? 'green' : 'yellow' },
    { label: 'Kandidaten', detail: `${candidatesRes.count ?? 0} registriert`, status: (candidatesRes.count ?? 0) >= 10 ? 'green' : 'yellow' },
    { label: 'Arbeitgeber', detail: `${employersRes.count ?? 0} registriert`, status: (employersRes.count ?? 0) >= 3 ? 'green' : 'yellow' },
  ]

  const docStatus: StatusItem[] = [
    { label: 'Due Diligence Tech', detail: 'docs/DUE_DILIGENCE_TECH.md', status: 'green' },
    { label: 'Architektur', detail: 'docs/ARCHITECTURE.md', status: 'green' },
    { label: 'Security & Compliance', detail: 'docs/SECURITY_COMPLIANCE.md', status: 'green' },
    { label: 'Betriebskosten', detail: 'docs/OPERATING_COSTS.md', status: 'green' },
    { label: 'Business Model', detail: 'docs/BUSINESS_MODEL.md', status: 'green' },
    { label: 'Exit Readiness', detail: 'docs/EXIT_READINESS.md', status: 'green' },
    { label: 'Buyer One Pager', detail: 'docs/BUYER_ONE_PAGER.md', status: 'green' },
    { label: 'Datenschutz / AGB / Impressum', detail: '/legal/*', status: 'green' },
    { label: 'Pen-Test Report', detail: 'Noch nicht erstellt', status: 'red' },
    { label: 'Automatisierte Tests', detail: 'Lint + Build vorhanden, Unit-Tests fehlen', status: 'yellow' },
  ]

  const agentStatus: StatusItem[] = [
    { label: 'CEO Agent', detail: 'ceo-agent.ts', status: 'green' },
    { label: 'Marketing Strategy', detail: 'marketing-strategy-agent.ts', status: 'green' },
    { label: 'Visionary Agent', detail: 'visionary-agent.ts', status: 'green' },
    { label: 'Growth Agent', detail: 'growth-agent.ts', status: 'green' },
    { label: 'Global Market Intelligence', detail: 'global-market-intelligence-agent.ts', status: 'green' },
    { label: 'Corridor Intelligence', detail: 'corridor-intelligence-agent.ts', status: 'green' },
    { label: 'Candidate Acquisition', detail: 'global-candidate-acquisition-agent.ts', status: 'green' },
    { label: 'Landingpage Factory', detail: 'landingpage-factory-agent.ts', status: 'green' },
    { label: 'Migration Intelligence', detail: 'migration-intelligence-agent.ts', status: 'green' },
    { label: 'Revenue Intelligence', detail: 'revenue-intelligence-agent.ts', status: 'green' },
    { label: 'Orchestrator', detail: 'agent-orchestrator.ts — alle 10 Agenten', status: 'green' },
    { label: 'Agent Logs (system_logs)', detail: `${logsSuccessRes.count ?? 0} Erfolge, ${logsErrorRes.count ?? 0} Fehler`, status: (logsErrorRes.count ?? 0) === 0 ? 'green' : 'yellow' },
  ]

  const revenueStatus: StatusItem[] = [
    { label: 'Revenue Plans', detail: `${plansRes.count ?? 0} aktive Pläne (Employer, Kandidat, Partner)`, status: 'green' },
    { label: 'Forecast Engine', detail: `lib/revenue/forecast.ts — 3 Szenarien`, status: 'green' },
    { label: 'MRR Szenario A', detail: `${scenarioA.mrr.toLocaleString('de-DE')} EUR/Monat (Simulation)`, status: 'green' },
    { label: 'Break-even Szenario A', detail: `~${scenarioA.breakEvenMonths} Monate (Simulation)`, status: 'green' },
    { label: 'Stripe Live-Integration', detail: 'Architektur vorbereitet, nicht aktiviert', status: 'yellow' },
    { label: 'Erste zahlende Kunden', detail: 'Noch keine Pilot-Umsätze', status: 'red' },
  ]

  const lpStatus: StatusItem[] = [
    { label: 'Landingpages gesamt', detail: `${lpfTotalRes.count ?? 0} generiert`, status: (lpfTotalRes.count ?? 0) >= 5 ? 'green' : 'yellow' },
    { label: 'Published Landingpages', detail: `${lpfPublishedRes.count ?? 0} veröffentlicht`, status: (lpfPublishedRes.count ?? 0) >= 3 ? 'green' : 'yellow' },
    { label: 'Mehrsprachigkeit', detail: 'EN, DE, FR, TR, PT, AR', status: 'green' },
    { label: 'SEO-Metadaten', detail: 'generateMetadata() + OG-Tags vorhanden', status: 'green' },
    { label: 'Sitemap.xml', detail: 'Dynamisch aus DB generiert', status: 'green' },
    { label: 'robots.txt', detail: '/corridors/ freigegeben', status: 'green' },
    { label: 'Google Indexierung', detail: 'Noch nicht geprüft (kein Published live)', status: 'yellow' },
  ]

  // Overall score
  const allItems = [...dbStatus, ...docStatus, ...agentStatus, ...revenueStatus, ...lpStatus]
  const totalGreen  = allItems.filter(i => i.status === 'green').length
  const totalYellow = allItems.filter(i => i.status === 'yellow').length
  const totalRed    = allItems.filter(i => i.status === 'red').length
  const overallPct  = Math.round((totalGreen / allItems.length) * 100)

  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar badge="Export Readiness" badgeColor="yellow" />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">📊 Export Readiness</h1>
            <p className="text-gray-400 text-sm mt-1">
              Ampelsystem · Vollständige Status-Übersicht · Kein Export notwendig
            </p>
          </div>
          <Link href="/admin/sale-readiness" className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs transition-colors">
            ← Sale Readiness
          </Link>
        </div>

        {/* Overall Score */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex flex-wrap items-center gap-6">
            <div className="text-center">
              <div className={`text-4xl font-bold ${overallPct >= 80 ? 'text-green-300' : overallPct >= 60 ? 'text-yellow-300' : 'text-orange-300'}`}>
                {overallPct}%
              </div>
              <div className="text-xs text-gray-400 mt-1">Gesamt-Readiness</div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${overallPct >= 80 ? 'bg-green-500' : overallPct >= 60 ? 'bg-yellow-500' : 'bg-orange-500'}`}
                  style={{ width: `${overallPct}%` }}
                />
              </div>
              <div className="flex gap-6 text-xs">
                <span className="text-green-400">🟢 {totalGreen} bereit</span>
                <span className="text-yellow-400">🟡 {totalYellow} ausstehend</span>
                <span className="text-red-400">🔴 {totalRed} fehlt</span>
                <span className="text-gray-500">∑ {allItems.length} Prüfpunkte</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sections */}
        <Section title="🗄️ Datenbankstatus" items={dbStatus} />
        <Section title="📄 Dokumentationsstatus" items={docStatus} />
        <Section title="🤖 Agentenstatus" items={agentStatus} />
        <Section title="💰 Revenue-Status" items={revenueStatus} />
        <Section title="🌐 Landingpage-Status" items={lpStatus} />

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
          <span>🟢 Bereit — produktiv vorhanden</span>
          <span>🟡 Ausstehend — vorbereitet oder teilweise vorhanden</span>
          <span>🔴 Fehlt — noch nicht implementiert</span>
        </div>

      </div>
    </div>
  )
}
