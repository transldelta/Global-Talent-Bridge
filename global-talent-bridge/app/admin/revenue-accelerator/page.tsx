/**
 * app/admin/revenue-accelerator/page.tsx — /admin/revenue-accelerator
 *
 * Emergency Revenue Accelerator — Admin-Dashboard
 *
 * Zeigt sofort:
 * - Schnellster legaler Revenue-Weg
 * - Aktuelle Revenue-Pfade mit Status
 * - Neue Leads nach Typ
 * - Strategic / Partner Leads hervorgehoben
 * - Demo / Buyer-Ready Status
 * - Nächste sichere Aufgabe
 * - Blockierte Risiken (Stripe, Outreach, Kandidatengebühren)
 *
 * Safety: Kein Send-Button · Kein Stripe · Kein Outreach · Nur DB-Read
 */
import { redirect }            from 'next/navigation'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient }   from '@/lib/supabase/admin'
import {
  REVENUE_PATHS,
  LEAD_TYPE_LABELS,
  LEAD_TYPE_COLORS,
  INTEREST_TYPE_LABELS,
} from '@/lib/revenue-leads'
import type { LeadType, InterestType } from '@/lib/revenue-leads'

export const dynamic = 'force-dynamic'

// ── Blockierte Risiken ────────────────────────────────────────────────────────

const BLOCKED_RISKS = [
  {
    id:    'stripe',
    icon:  '💳',
    label: 'Stripe / Zahlungssystem',
    desc:  'Kein Stripe aktiviert. Keine automatische Zahlung. Erst nach rechtlicher Prüfung.',
    color: 'bg-red-50 border-red-200 text-red-800',
  },
  {
    id:    'outreach',
    icon:  '📧',
    label: 'E-Mail / Outreach',
    desc:  'EMAIL_PROVIDER=none. Kein automatischer Versand. Kein Cold-Outreach. Kein Bulk-Outreach.',
    color: 'bg-red-50 border-red-200 text-red-800',
  },
  {
    id:    'candidate_fees',
    icon:  '💰',
    label: 'Kandidatengebühren',
    desc:  'Keine Gebühren von Kandidaten aktiviert. Nur nach schriftlicher Rechtsprüfung möglich.',
    color: 'bg-orange-50 border-orange-200 text-orange-800',
  },
  {
    id:    'scraping',
    icon:  '🕷️',
    label: 'Scraping / Externe Daten',
    desc:  'Kein Scraping. Keine externen API-Calls. Nur eigene DB-Daten.',
    color: 'bg-orange-50 border-orange-200 text-orange-800',
  },
  {
    id:    'job_guarantee',
    icon:  '🚫',
    label: 'Jobgarantie / Visa-Garantie',
    desc:  'Keine falschen Versprechen. CorridorWork ist ein Matching-System, kein Arbeitsvermittler.',
    color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  },
]

// ── Nächste sichere Schritte ──────────────────────────────────────────────────

const NEXT_SAFE_STEPS = [
  {
    rank:  1,
    icon:  '🎯',
    label: 'Strategic Partner ansprechen',
    desc:  'Inbound Strategic Interest öffnen → manuell prüfen → persönlich antworten (kein automatischer Versand).',
    link:  '/admin/revenue-inbox',
    color: 'bg-amber-50 border-amber-300',
  },
  {
    rank:  2,
    icon:  '🔍',
    label: 'Google Search Console DNS-Eintrag',
    desc:  'DNS TXT-Wert eintragen → CorridorWork.com in GSC verifizieren → Sitemap einreichen → SEO-Traffic aktivieren.',
    link:  '/admin/seo-indexing-control',
    color: 'bg-blue-50 border-blue-200',
  },
  {
    rank:  3,
    icon:  '📥',
    label: 'Revenue Inbox täglich prüfen',
    desc:  'Alle neuen Leads in der Revenue Inbox manuell prüfen → qualifizieren oder ablehnen.',
    link:  '/admin/revenue-inbox',
    color: 'bg-green-50 border-green-200',
  },
  {
    rank:  4,
    icon:  '🌐',
    label: 'Revenue-Seiten öffentlich teilen',
    desc:  'Nach erstem qualifizierten Lead: /strategic-partnership, /partners, /demo in Netzwerk teilen. Kein Cold-Outreach.',
    link:  null,
    color: 'bg-purple-50 border-purple-200',
  },
]

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function RevenueAcceleratorPage() {
  const user = await getCurrentAdminUser()
  if (!user) redirect('/auth/login?redirectTo=/admin/revenue-accelerator')

  const supabase = createAdminClient()

  // ── Lead-Counts nach Typ und Status ─────────────────────────────────────────

  const [
    { count: totalLeads    },
    { count: newLeads      },
    { count: qualifiedLeads },
    { count: strategicLeads },
    { count: agencyLeads   },
    { count: employerLeads },
    { count: intelLeads    },
    { count: newStrategic  },
    { count: newAgency     },
    { count: newEmployer   },
  ] = await Promise.all([
    supabase.from('revenue_leads').select('id', { count: 'exact', head: true }),
    supabase.from('revenue_leads').select('id', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('revenue_leads').select('id', { count: 'exact', head: true }).eq('status', 'qualified'),
    supabase.from('revenue_leads').select('id', { count: 'exact', head: true }).eq('lead_type', 'strategic_partner'),
    supabase.from('revenue_leads').select('id', { count: 'exact', head: true }).eq('lead_type', 'agency_partner'),
    supabase.from('revenue_leads').select('id', { count: 'exact', head: true }).eq('lead_type', 'employer_pilot'),
    supabase.from('revenue_leads').select('id', { count: 'exact', head: true }).eq('lead_type', 'market_intelligence'),
    supabase.from('revenue_leads').select('id', { count: 'exact', head: true }).eq('lead_type', 'strategic_partner').eq('status', 'new'),
    supabase.from('revenue_leads').select('id', { count: 'exact', head: true }).eq('lead_type', 'agency_partner').eq('status', 'new'),
    supabase.from('revenue_leads').select('id', { count: 'exact', head: true }).eq('lead_type', 'employer_pilot').eq('status', 'new'),
  ])

  // Neueste Strategic-Leads
  const { data: topStrategicLeads } = await supabase
    .from('revenue_leads')
    .select('id, organization_name, contact_name, interest_type, lead_score, created_at, status')
    .eq('lead_type', 'strategic_partner')
    .order('created_at', { ascending: false })
    .limit(3)

  const t   = totalLeads    ?? 0
  const n   = newLeads      ?? 0
  const q   = qualifiedLeads ?? 0
  const s   = strategicLeads ?? 0
  const ns  = newStrategic  ?? 0
  const na  = newAgency     ?? 0
  const ne  = newEmployer   ?? 0

  // Schnellster Revenue-Weg bestimmen
  const fastestPath = ns > 0 ? 'strategic_partner'
    : na > 0               ? 'agency_partner'
    : ne > 0               ? 'employer_pilot'
    : null

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">⚡ Revenue Accelerator</h1>
          <p className="text-gray-500 mt-1">Schnellster legaler Revenue-Weg — Inbound-Fokus, Phase 1</p>
          <p className="text-xs text-gray-400 mt-1">
            Kein Outreach · Kein Stripe · Kein E-Mail · Alle Wege: Inbound only
          </p>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <a href="/admin/revenue-inbox"
             className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg font-medium hover:bg-blue-700 transition-colors">
            📥 Revenue Inbox →
          </a>
          <a href="/admin/cwo-command-center"
             className="px-4 py-2 bg-slate-100 text-slate-700 text-sm rounded-lg font-medium hover:bg-slate-200 transition-colors">
            🧠 CWO Command Center →
          </a>
        </div>
      </div>

      {/* Safety Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-4 flex items-center gap-4">
        <span className="text-2xl">🛡️</span>
        <div className="flex-1">
          <div className="font-semibold text-green-400 text-sm">Alle Sicherheitsinvarianten aktiv</div>
          <div className="text-xs text-slate-300 mt-0.5">
            EMAIL_PROVIDER: none &nbsp;·&nbsp; OUTREACH: none &nbsp;·&nbsp; Stripe: inaktiv &nbsp;·&nbsp;
            Scraping: nie &nbsp;·&nbsp; Phase 1 Pilot
          </div>
        </div>
        <div className="text-xs text-green-400 font-mono">✓ SAFE</div>
      </div>

      {/* Schnellster Revenue-Weg */}
      <div className={`rounded-xl border-2 p-5 ${
        fastestPath === 'strategic_partner' ? 'bg-amber-50 border-amber-400' :
        fastestPath === 'agency_partner'    ? 'bg-purple-50 border-purple-400' :
        fastestPath === 'employer_pilot'    ? 'bg-blue-50 border-blue-400' :
        'bg-slate-50 border-slate-300'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase mb-1">⚡ Schnellster legaler Revenue-Weg</div>
            {fastestPath ? (
              <>
                <div className="text-2xl font-bold text-gray-900">
                  {fastestPath === 'strategic_partner' ? '🎯 Strategic Partner / White-Label' :
                   fastestPath === 'agency_partner'    ? '🤝 Agency / White-Label Partner' :
                   '🏭 Employer Pilot'}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {fastestPath === 'strategic_partner'
                    ? `${ns} neue Strategic-Leads warten auf manuelle Prüfung. Sofort prüfen und persönlich antworten.`
                    : fastestPath === 'agency_partner'
                    ? `${na} neue Agency-Leads warten. Prüfen → qualifizieren → persönlich antworten.`
                    : `${ne} neue Employer-Leads warten. Prüfen → qualifizieren → persönlich antworten.`}
                </div>
              </>
            ) : (
              <>
                <div className="text-xl font-bold text-gray-600">Noch keine neuen Leads</div>
                <div className="text-sm text-gray-500 mt-1">
                  Revenue-Seiten sind live. Auf Inbound-Leads warten.
                  Nächster Schritt: Google Search Console DNS-Eintrag → SEO-Traffic aktivieren.
                </div>
              </>
            )}
          </div>
          {fastestPath && (
            <a href="/admin/revenue-inbox"
               className="ml-4 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg text-sm hover:bg-blue-700 transition-colors whitespace-nowrap">
              Inbox öffnen →
            </a>
          )}
        </div>
      </div>

      {/* Lead Counts Overview */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">📊 Revenue Leads — Übersicht</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-yellow-700">{n}</div>
            <div className="text-xs text-yellow-600 font-medium mt-1">Neue Leads</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-green-700">{q}</div>
            <div className="text-xs text-green-600 font-medium mt-1">Qualifiziert</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-gray-700">{t}</div>
            <div className="text-xs text-gray-500 font-medium mt-1">Gesamt</div>
          </div>
          <div className={`rounded-xl p-4 text-center border-2 ${s > 0 ? 'bg-amber-50 border-amber-400' : 'bg-gray-50 border-gray-200'}`}>
            <div className={`text-3xl font-bold ${s > 0 ? 'text-amber-700' : 'text-gray-400'}`}>{s}</div>
            <div className={`text-xs font-medium mt-1 ${s > 0 ? 'text-amber-600' : 'text-gray-400'}`}>🎯 Strategic</div>
          </div>
        </div>

        {/* Per-type detail */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { type: 'strategic_partner' as LeadType, total: s,                    newCount: ns, bg: 'bg-amber-50 border-amber-200',  text: 'text-amber-800',  badge: 'bg-amber-200' },
            { type: 'agency_partner'    as LeadType, total: agencyLeads   ?? 0,   newCount: na, bg: 'bg-purple-50 border-purple-200', text: 'text-purple-800', badge: 'bg-purple-200' },
            { type: 'employer_pilot'    as LeadType, total: employerLeads ?? 0,   newCount: ne, bg: 'bg-blue-50 border-blue-200',     text: 'text-blue-800',   badge: 'bg-blue-200' },
            { type: 'market_intelligence' as LeadType, total: intelLeads  ?? 0,   newCount: 0,  bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-800', badge: 'bg-emerald-200' },
          ].map(row => (
            <div key={row.type} className={`rounded-lg border p-3 ${row.bg}`}>
              <div className={`text-xs font-semibold uppercase mb-1 ${row.text}`}>
                {LEAD_TYPE_LABELS[row.type]}
              </div>
              <div className={`text-2xl font-bold ${row.text}`}>{row.total}</div>
              {row.newCount > 0 && (
                <div className={`mt-1 inline-block text-xs px-2 py-0.5 rounded-full font-semibold ${row.badge} ${row.text}`}>
                  {row.newCount} neu
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Aktuelle Revenue-Pfade */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">🛤️ Revenue-Pfade — Priorisiert</h2>
        <div className="space-y-2">
          {REVENUE_PATHS.map(path => (
            <div key={path.id}
              className={`rounded-xl border p-4 flex items-center gap-4 ${
                path.leadType === 'strategic_partner' ? 'bg-amber-50 border-amber-300' :
                path.leadType === 'agency_partner'    ? 'bg-purple-50 border-purple-200' :
                path.leadType === 'employer_pilot'    ? 'bg-blue-50 border-blue-200' :
                'bg-emerald-50 border-emerald-200'
              }`}>
              <div className="text-2xl flex-shrink-0">{path.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 text-sm">
                  Rang {path.rank} — {path.label}
                </div>
                <div className="text-xs text-gray-600 mt-0.5">{path.description}</div>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-xs font-semibold text-gray-500 bg-white rounded px-2 py-0.5 border border-gray-200">
                  {path.speed}
                </span>
                <a href={path.path} target="_blank" rel="noopener noreferrer"
                   className="text-xs text-blue-600 hover:underline">
                  {path.path} ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Neueste Strategic Leads */}
      {(topStrategicLeads?.length ?? 0) > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">🎯 Neueste Strategic Leads</h2>
          <div className="space-y-2">
            {topStrategicLeads!.map(lead => {
              const interestLabel = lead.interest_type
                ? INTEREST_TYPE_LABELS[lead.interest_type as InterestType]
                : null
              const createdAt = new Date(lead.created_at).toLocaleString('de-DE', {
                day: '2-digit', month: '2-digit', year: '2-digit',
                hour: '2-digit', minute: '2-digit',
              })
              return (
                <div key={lead.id}
                  className="bg-white rounded-xl border-2 border-amber-200 p-4 flex items-center gap-4">
                  <span className="text-2xl flex-shrink-0">🎯</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-sm">{lead.organization_name}</div>
                    <div className="text-xs text-gray-500">{lead.contact_name}</div>
                    {interestLabel && (
                      <div className="mt-0.5 inline-block text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                        {interestLabel}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0 text-xs text-gray-400">
                    <span>{createdAt}</span>
                    {lead.lead_score != null && (
                      <span className={`font-bold ${lead.lead_score >= 80 ? 'text-green-600' : lead.lead_score >= 60 ? 'text-yellow-600' : 'text-red-500'}`}>
                        Score: {lead.lead_score}
                      </span>
                    )}
                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded font-semibold capitalize">
                      {lead.status}
                    </span>
                  </div>
                </div>
              )
            })}
            <a href="/admin/revenue-inbox?lead_type=strategic_partner"
               className="block text-center text-sm text-amber-600 hover:underline pt-1">
              Alle Strategic Leads in Revenue Inbox →
            </a>
          </div>
        </div>
      )}

      {/* Revenue-Seiten Status */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">🌐 Revenue-Seiten — Live Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { href: '/strategic-partnership', label: '🎯 Strategic Partnership',   color: 'amber',  desc: 'White-Label, Übernahme, Lizenzierung' },
            { href: '/partners',              label: '🤝 Partner-Programm',        color: 'purple', desc: 'Recruiting-Agenturen, Sprachschulen, Relocation' },
            { href: '/pilot/employers',       label: '🏭 Employer Pilot',          color: 'blue',   desc: 'Direkte Arbeitgeber-Anfragen' },
            { href: '/pilot/agencies',        label: '🤝 Agentur-Pilot',           color: 'purple', desc: 'Agenturen (legacy)' },
            { href: '/market-intelligence',   label: '📊 Market Intelligence',     color: 'emerald', desc: 'Aggregierte Korridordaten' },
            { href: '/demo',                  label: '🎬 Demo',                    color: 'slate',  desc: 'CorridorWork ansehen' },
          ].map(p => (
            <div key={p.href} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
              <span className="text-green-500 text-lg flex-shrink-0">✅</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-gray-900">{p.label}</div>
                <div className="text-xs text-gray-500">{p.desc}</div>
              </div>
              <a href={p.href} target="_blank" rel="noopener noreferrer"
                 className="text-xs text-blue-600 hover:underline flex-shrink-0">
                Öffnen ↗
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Nächste sichere Schritte */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">🎯 Nächste sichere Schritte</h2>
        <div className="space-y-2">
          {NEXT_SAFE_STEPS.map(step => (
            <div key={step.rank} className={`rounded-xl border p-4 flex items-start gap-4 ${step.color}`}>
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                {step.rank}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 text-sm">{step.icon} {step.label}</div>
                <div className="text-xs text-gray-600 mt-0.5">{step.desc}</div>
              </div>
              {step.link && (
                <a href={step.link}
                   className="flex-shrink-0 text-xs text-blue-600 hover:underline font-medium">
                  Öffnen →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Blockierte Risiken */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">🚫 Blockierte Risiken — Phase 1</h2>
        <div className="space-y-2">
          {BLOCKED_RISKS.map(risk => (
            <div key={risk.id} className={`rounded-lg border p-3 flex items-start gap-3 ${risk.color}`}>
              <span className="text-lg flex-shrink-0">{risk.icon}</span>
              <div>
                <div className="font-semibold text-sm">✗ {risk.label}</div>
                <div className="text-xs mt-0.5 opacity-80">{risk.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 bg-slate-900 text-white rounded-lg p-3 text-xs">
          <span className="text-green-400 font-semibold">✓ Alle Risiken sind aktiv blockiert.</span>
          {' '}Keine Aktivierung ohne explizite rechtliche Freigabe und manuelle Bestätigung.
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-base font-bold text-gray-900 mb-3">🔗 Quick Links</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { href: '/admin/revenue-inbox',        label: '📥 Revenue Inbox' },
            { href: '/admin/cwo-command-center',   label: '🧠 CWO Command Center' },
            { href: '/admin/seo-indexing-control', label: '🔍 SEO Indexing Control' },
            { href: '/admin/autonomous-worklog',   label: '📋 Worklog' },
            { href: '/strategic-partnership',      label: '🎯 /strategic-partnership ↗', ext: true },
            { href: '/partners',                   label: '🤝 /partners ↗', ext: true },
            { href: '/demo',                       label: '🎬 /demo ↗', ext: true },
          ].map(link => (
            <a key={link.href} href={link.href}
               {...(link.ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
               className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-100 transition-colors">
              {link.label}
            </a>
          ))}
        </div>
      </div>

    </div>
  )
}
