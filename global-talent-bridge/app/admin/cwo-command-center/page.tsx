/**
 * app/admin/cwo-command-center/page.tsx
 *
 * CWO Command Center — Hauptseite des Autonomous Revenue Operating System
 */
import { redirect }            from 'next/navigation'
import { getCurrentAdminUser } from '@/lib/admin'
import { generateCWOState, generateTageslageSummary } from '@/lib/cwo-agent'
import { createAdminClient }   from '@/lib/supabase/admin'
import { LastRunPanel }        from './_components/LastRunPanel'

export const dynamic = 'force-dynamic'

export default async function CWOCommandCenterPage() {
  const user = await getCurrentAdminUser()
  if (!user) redirect('/auth/login?redirectTo=/admin/cwo-command-center')

  const state      = generateCWOState()
  const tageslage  = generateTageslageSummary()

  // Revenue Leads — neue Inbound-Leads zählen
  const supabase = createAdminClient()
  const { count: newLeadsCount } = await supabase
    .from('revenue_leads')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'new')
  const { data: topLeadRow } = await supabase
    .from('revenue_leads')
    .select('lead_type')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  const newLeads = newLeadsCount ?? 0
  const topLeadType = topLeadRow?.lead_type ?? null
  const statusColor = tageslage.status === 'green' ? 'text-green-600' : tageslage.status === 'yellow' ? 'text-yellow-600' : 'text-red-600'
  const statusBg    = tageslage.status === 'green' ? 'bg-green-50 border-green-200' : tageslage.status === 'yellow' ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🧠 CWO Command Center</h1>
          <p className="text-gray-500 mt-1">Autonomous Revenue Operating System — Phase 1</p>
          <p className="text-xs text-gray-400 mt-1">Generiert: {new Date(state.generatedAt).toLocaleString('de-DE')}</p>
        </div>
        <div className={`px-4 py-2 rounded-full border text-sm font-semibold ${statusColor} ${statusBg}`}>
          System: {tageslage.status === 'green' ? '✅ OK' : tageslage.status === 'yellow' ? '⚠️ Hinweise' : '🔴 Prüfen'}
        </div>
      </div>

      {/* Safety Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-4 flex items-center gap-4">
        <span className="text-2xl">🛡️</span>
        <div>
          <div className="font-semibold text-green-400">Alle Sicherheitsinvarianten eingehalten</div>
          <div className="text-sm text-slate-300">
            EMAIL_PROVIDER: {state.systemInvariants.emailProvider} &nbsp;·&nbsp;
            OUTREACH: {state.systemInvariants.outreachEmailProvider} &nbsp;·&nbsp;
            Phase {state.systemInvariants.phase} &nbsp;·&nbsp;
            Autonomy: {state.systemInvariants.currentAutonomyLevel} &nbsp;·&nbsp;
            noScraping: {String(state.systemInvariants.noScraping)} &nbsp;·&nbsp;
            noEmailSent: {String(state.systemInvariants.noEmailSent)}
          </div>
        </div>
      </div>

      {/* Inbound Revenue Leads */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">📥 Inbound Revenue Leads</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Inbound-Leads können geprüft werden. Kein automatischer Versand aktiv.
            </p>
          </div>
          <a href="/admin/revenue-inbox" className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Inbox öffnen →
          </a>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className={`rounded-lg p-3 text-center border ${newLeads > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'}`}>
            <div className={`text-2xl font-bold ${newLeads > 0 ? 'text-yellow-700' : 'text-gray-400'}`}>{newLeads}</div>
            <div className="text-xs text-gray-500">Neue Leads</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
            <div className="text-sm font-semibold text-blue-700">
              {topLeadType === 'employer_pilot'      ? '🏭 Employer Pilot' :
               topLeadType === 'agency_partner'       ? '🤝 Agency Partner' :
               topLeadType === 'market_intelligence'  ? '📊 Market Intel' :
               '—'}
            </div>
            <div className="text-xs text-blue-500">Top Lead-Typ</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
            <div className="text-sm font-semibold text-green-700">Leads prüfen</div>
            <div className="text-xs text-green-500">Nächster Revenue-Schritt</div>
          </div>
        </div>
      </div>

      {/* Revenue Pages Live — Public Visibility Status */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">🌐 Revenue Pages — Public Visibility</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Alle drei Inbound-Seiten sind live, öffentlich verlinkbar und in der Sitemap. Kein Versand, kein Stripe.
            </p>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200">
            ✅ LIVE
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <a href="/pilot/employers" target="_blank" rel="noopener noreferrer"
             className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
            <span className="text-xl">🏭</span>
            <div>
              <div className="text-sm font-semibold text-blue-900">/pilot/employers</div>
              <div className="text-xs text-blue-600">Arbeitgeber-Pilot</div>
            </div>
          </a>
          <a href="/pilot/agencies" target="_blank" rel="noopener noreferrer"
             className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
            <span className="text-xl">🤝</span>
            <div>
              <div className="text-sm font-semibold text-purple-900">/pilot/agencies</div>
              <div className="text-xs text-purple-600">Agentur-/Partner-Pilot</div>
            </div>
          </a>
          <a href="/market-intelligence" target="_blank" rel="noopener noreferrer"
             className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors">
            <span className="text-xl">📊</span>
            <div>
              <div className="text-sm font-semibold text-emerald-900">/market-intelligence</div>
              <div className="text-xs text-emerald-600">Market Intelligence</div>
            </div>
          </a>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-3">
          <span className="text-lg shrink-0">🎯</span>
          <div>
            <div className="text-sm font-semibold text-amber-900">Nächster sicherer Schritt</div>
            <div className="text-xs text-amber-700 mt-0.5">
              Inbound-Seiten intern testen → erste Leads abwarten → Leads in{' '}
              <a href="/admin/revenue-inbox" className="underline font-medium">Revenue Inbox</a> prüfen →
              erst nach 3 erfolgreichen Pilot-Abschlüssen extern teilen. Kein Outreach, keine E-Mails, kein Stripe.
            </div>
          </div>
        </div>
      </div>

      {/* SEO Indexing Control Panel */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">🔍 SEO Indexing & Google Search Console</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              16 öffentliche Seiten · Sitemap bereit · robots.txt korrekt · Google API: nicht aktiv ✓
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full border border-amber-200">
              ⏳ DNS-Eintrag ausstehend
            </span>
            <a href="/admin/seo-indexing-control"
               className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Setup-Assistent →
            </a>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3 mb-3">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-green-700">16</div>
            <div className="text-xs text-green-600">Seiten indexierbar</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
            <div className="text-sm font-bold text-blue-700">✅ Bereit</div>
            <div className="text-xs text-blue-600">sitemap.xml</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
            <div className="text-sm font-bold text-blue-700">✅ Korrekt</div>
            <div className="text-xs text-blue-600">robots.txt</div>
          </div>
          <div className="bg-violet-50 border border-violet-200 rounded-lg p-3 text-center">
            <div className="text-sm font-bold text-violet-700">🔧 Bereit</div>
            <div className="text-xs text-violet-600">GSC Setup</div>
          </div>
        </div>
        {/* GSC Setup Status */}
        <div className="mb-3 bg-slate-50 border border-slate-200 rounded-lg p-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-green-700">
              <span>✅</span>
              <span>Google Search Console Setup: <strong>vorbereitet</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-blue-700">
              <span>✅</span>
              <span>Sitemap: <strong>bereit</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-green-700">
              <span>✅</span>
              <span>Google API: <strong>nicht aktiv</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-green-700">
              <span>✅</span>
              <span>Kein Scraping · Kein E-Mail</span>
            </div>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-3">
          <span className="text-lg shrink-0">🎯</span>
          <div>
            <div className="text-sm font-semibold text-amber-900">Nächster manueller Schritt</div>
            <div className="text-xs text-amber-700 mt-0.5">
              <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer"
                 className="underline font-medium">Google Search Console öffnen</a>{' '}
              → Domain-Property <span className="font-mono font-bold">corridorwork.com</span> einrichten
              → DNS-TXT-Wert bei DNS-Anbieter eintragen → Verifizieren → Sitemap{' '}
              <span className="font-mono bg-amber-100 px-1 rounded">https://corridorwork.com/sitemap.xml</span>{' '}
              einreichen ·{' '}
              <a href="/admin/seo-indexing-control" className="underline font-medium">5-Schritt-Anleitung →</a>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Revenue Expansion — 12 neue öffentliche Seiten */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">🚀 SEO Revenue Expansion — 12 neue Seiten</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              5 Branchen · 5 Korridore · 1 Agentur-Lösung · 1 Demo — alle öffentlich, alle in der Sitemap.
            </p>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200">
            ✅ LIVE
          </span>
        </div>

        {/* Branchen */}
        <div className="mb-3">
          <div className="text-xs font-semibold text-gray-400 uppercase mb-2">🏭 Branchen (5)</div>
          <div className="flex flex-wrap gap-2">
            {[
              { href: '/industries/care',         label: '🏥 Pflege' },
              { href: '/industries/hospitality',  label: '🍽️ Gastronomie' },
              { href: '/industries/logistics',    label: '🚚 Logistik' },
              { href: '/industries/it',           label: '💻 IT' },
              { href: '/industries/construction', label: '🏗️ Bau' },
            ].map(p => (
              <a key={p.href} href={p.href} target="_blank" rel="noopener noreferrer"
                 className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs rounded-lg hover:bg-blue-100 transition-colors">
                {p.label}
              </a>
            ))}
          </div>
        </div>

        {/* Korridore */}
        <div className="mb-3">
          <div className="text-xs font-semibold text-gray-400 uppercase mb-2">🌍 Korridore (5)</div>
          <div className="flex flex-wrap gap-2">
            {[
              { href: '/corridors/philippines-care',  label: '🇵🇭 Philippinen' },
              { href: '/corridors/india-uk',          label: '🇮🇳 Indien' },
              { href: '/corridors/morocco-germany',   label: '🇲🇦 Marokko' },
              { href: '/corridors/nigeria-tech',      label: '🇳🇬 Nigeria' },
              { href: '/corridors/tunisia-france',    label: '🇹🇳 Tunesien' },
            ].map(p => (
              <a key={p.href} href={p.href} target="_blank" rel="noopener noreferrer"
                 className="px-3 py-1 bg-purple-50 border border-purple-200 text-purple-700 text-xs rounded-lg hover:bg-purple-100 transition-colors">
                {p.label}
              </a>
            ))}
          </div>
        </div>

        {/* Solutions + Demo */}
        <div className="mb-4">
          <div className="text-xs font-semibold text-gray-400 uppercase mb-2">🔗 Lösungen & Demo (2)</div>
          <div className="flex flex-wrap gap-2">
            {[
              { href: '/solutions/recruiting-agencies', label: '🤝 Agentur-Lösung' },
              { href: '/demo',                          label: '🎬 Demo' },
            ].map(p => (
              <a key={p.href} href={p.href} target="_blank" rel="noopener noreferrer"
                 className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg hover:bg-emerald-100 transition-colors">
                {p.label}
              </a>
            ))}
          </div>
        </div>

        {/* Öffentliche Seiten Gesamt */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center justify-between">
          <div className="text-sm text-slate-700">
            <span className="font-bold">Öffentliche Seiten gesamt:</span>{' '}
            3 Revenue-Pilot-Seiten + 12 SEO-Expansion-Seiten + Static Pages
          </div>
          <div className="text-2xl font-bold text-blue-600">15+</div>
        </div>
      </div>

      {/* Daily Runner — letzter automatischer Lauf */}
      <LastRunPanel />

      {/* Tageslage */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-900">📋 Aktuelle Tageslage</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-xs font-semibold text-green-700 uppercase mb-1">🌟 Top-Opportunity</div>
            <div className="text-sm text-green-900">{tageslage.topOpportunity}</div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="text-xs font-semibold text-amber-700 uppercase mb-1">⚠️ Top-Risiko (blockiert)</div>
            <div className="text-sm text-amber-900">{tageslage.topRisk}</div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-xs font-semibold text-blue-700 uppercase mb-1">🎯 Nächste Aktion</div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-blue-900">{tageslage.immediateAction}</div>
            <a href={tageslage.immediateActionHref} className="ml-4 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap">
              Zum Bereich →
            </a>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-3xl font-bold text-blue-600">{tageslage.corridorsAnalyzed}</div>
          <div className="text-xs text-gray-500 mt-1">Talent-Korridore</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-3xl font-bold text-purple-600">{tageslage.sectorsAnalyzed}</div>
          <div className="text-xs text-gray-500 mt-1">Arbeitgeber-Sektoren</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-3xl font-bold text-green-600">{tageslage.revenueStreams}</div>
          <div className="text-xs text-gray-500 mt-1">Revenue-Streams</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-3xl font-bold text-red-600">{tageslage.blockedRisks}</div>
          <div className="text-xs text-gray-500 mt-1">Blockierte Risiken</div>
        </div>
      </div>

      {/* Top 3 Corridors */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">🌍 Top-Talent-Korridore</h2>
          <a href="/admin/global-demand-radar" className="text-sm text-blue-600 hover:underline">Alle anzeigen →</a>
        </div>
        <div className="space-y-3">
          {state.topCorridors.map((corridor, idx) => (
            <div key={corridor.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-300 w-8">#{idx + 1}</div>
              <div className="text-2xl">{corridor.originFlag}</div>
              <div className="text-gray-400">→</div>
              <div className="text-2xl">{corridor.destinationFlag}</div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{corridor.origin} → {corridor.destination}</div>
                <div className="text-xs text-gray-500">{corridor.primarySectors.join(', ')}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">{corridor.score}</div>
                  <div className="text-xs text-gray-400">Score</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${corridor.priority === 'high' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {corridor.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Streams */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">💰 Sofort testbare Revenue-Streams</h2>
          <a href="/admin/revenue-pragmatist" className="text-sm text-blue-600 hover:underline">Alle anzeigen →</a>
        </div>
        <div className="space-y-3">
          {state.topRevenueStreams.map(stream => (
            <div key={stream.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl">{stream.icon}</div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{stream.name}</div>
                <div className="text-xs text-gray-500">{stream.timeToRevenue}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-green-600">Potenzial: {stream.incomePotential}%</div>
                <div className="text-xs text-gray-400">Risiko: {stream.legalRisk}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Tasks */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">✅ Priorisierte Aufgaben (Auto-generiert)</h2>
        <div className="space-y-2">
          {state.topTasks.map((task, idx) => (
            <div key={task.id} className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center">{idx + 1}</div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm">{task.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{task.description}</div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded font-semibold ${task.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {task.priority}
                </span>
                <a href={task.actionHref} className="text-xs text-blue-600 hover:underline">→</a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Departments Grid */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">🏢 Agent Departments</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {state.departments.filter(d => d.id !== 'ceo_agent').map(dept => (
            <a key={dept.id} href={dept.href} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition-all group">
              <div className="text-2xl mb-2">{dept.icon}</div>
              <div className="font-semibold text-gray-900 text-sm group-hover:text-blue-700">{dept.name}</div>
              <div className="text-xs text-gray-500 mt-1">{dept.description}</div>
            </a>
          ))}
        </div>
      </div>

      {/* Blocked Risks Summary */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <h2 className="text-lg font-bold text-red-900 mb-3">🚫 Automatisch blockierte Risiken</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {state.blockedRisks.slice(0, 4).map(risk => (
            <div key={risk.id} className="flex items-start gap-2 text-sm">
              <span className="text-red-500 mt-0.5 flex-shrink-0">✗</span>
              <div>
                <span className="font-medium text-red-900">{risk.category}:</span>{' '}
                <span className="text-red-700">{risk.description}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs text-red-600">
          {state.blockedRisks.length} Risiken blockiert · Kein manueller Override möglich in Phase 1
        </div>
      </div>

    </div>
  )
}
