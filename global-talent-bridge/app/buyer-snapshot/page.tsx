/**
 * app/buyer-snapshot/page.tsx — /buyer-snapshot
 *
 * Öffentliche Buyer Snapshot Page.
 * Käufer/Partner verstehen in 2 Minuten: Was ist CorridorWork, welche Systeme laufen,
 * welche Revenue-Pfade sind vorbereitet, was ist geblockt, keine Secrets.
 *
 * Safety: kein Versand · kein Stripe · kein Scraping · keine Admin-Details
 */
import Link from 'next/link'
import { PublicFooter } from '@/app/_components/PublicFooter'

export const metadata = {
  title:       'Buyer Snapshot — CorridorWork Live Asset Overview',
  description: 'Was ist CorridorWork? Live-Systeme, Revenue-Pfade, Compliance-Architektur. Für ernsthafte Interessenten: 2-Minuten-Überblick.',
}

const LIVE_ASSETS = [
  { icon: '🌐', label: 'Live-Domain',          detail: 'corridorwork.com',                    status: '✅ Live' },
  { icon: '🔧', label: 'Tech Stack',            detail: 'Next.js 14, Supabase, Vercel, TypeScript', status: '✅ Prod' },
  { icon: '🧠', label: 'CWO Operating System', detail: 'Autonomous Revenue OS, Phase 1',      status: '✅ Aktiv' },
  { icon: '⏱️', label: 'Daily Runner',          detail: 'Läuft täglich (Vercel Cron)',         status: '✅ Aktiv' },
  { icon: '📥', label: 'Lead Capture',          detail: '4 Revenue-Pfade aktiv',               status: '✅ Live' },
  { icon: '🔍', label: 'SEO Network',           detail: '16+ öffentliche Seiten + sitemap.xml', status: '✅ Indexierbar' },
  { icon: '⚖️', label: 'Compliance Guard',      detail: 'Safety-First, täglich geprüft',       status: '✅ Aktiv' },
  { icon: '📋', label: 'Admin Tools',           detail: 'Revenue Inbox, Accelerator, CWO CC',  status: '✅ Aktiv' },
]

const REVENUE_PATHS = [
  {
    rank:  1,
    icon:  '🎯',
    type:  'strategic_partner',
    title: 'Strategic Partner / White-Label / Acquisition',
    url:   '/strategic-partnership',
    note:  'Strategische Partnerschaft, White-Label-Lösung, Lizenzierung, Übernahme/Beteiligung.',
  },
  {
    rank:  2,
    icon:  '🤝',
    type:  'agency_partner',
    title: 'Agency / White-Label Partner',
    url:   '/partners',
    note:  'Recruiting-Agenturen und HR-Dienstleister.',
  },
  {
    rank:  3,
    icon:  '🏭',
    type:  'employer_pilot',
    title: 'Employer Pilot',
    url:   '/pilot/employers',
    note:  'Unternehmen für Cross-border Hiring.',
  },
  {
    rank:  4,
    icon:  '📊',
    type:  'market_intelligence',
    title: 'Market Intelligence',
    url:   '/market-intelligence',
    note:  'Aggregierte Korridor- und Nachfragedaten.',
  },
]

const NOT_ACTIVE = [
  { icon: '❌', item: 'Keine E-Mails werden gesendet' },
  { icon: '❌', item: 'Kein Cold-Outreach / Bulk-Outreach' },
  { icon: '❌', item: 'Keine Stripe-Zahlungen aktiv' },
  { icon: '❌', item: 'Kein Scraping externer Daten' },
  { icon: '❌', item: 'Keine Jobgarantie oder Visa-Garantie' },
  { icon: '❌', item: 'Keine laufenden Revenue-Verträge (Phase 1)' },
  { icon: '❌', item: 'Keine personalisierten Kandidatenprofile öffentlich' },
  { icon: '❌', item: 'Keine erfundenen Umsatzzahlen' },
]

const CONVERSATION_FORMATS = [
  { icon: '🤝', title: 'Strategische Partnerschaft',      desc: 'Gemeinsame Marktbearbeitung, Revenue-Sharing, operative Zusammenarbeit.' },
  { icon: '🏷️', title: 'White-Label-Lösung',             desc: 'Nutzung des CorridorWork-Systems unter eigenem Branding.' },
  { icon: '📜', title: 'Lizenzierung / API-Zugang',      desc: 'Technologie-Lizenz oder API-Integration.' },
  { icon: '🏢', title: 'Übernahme / Beteiligungsgespräch', desc: 'Ernsthaftes Interesse an Übernahme oder strategischer Beteiligung.' },
  { icon: '📊', title: 'Market Intelligence',             desc: 'Aggregierte Korridor- und Nachfragedaten für strategische Analysen.' },
]

export default function BuyerSnapshotPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-4 pt-14 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-900/40 border border-amber-600/40 rounded-full text-amber-400 text-xs font-medium mb-5">
          📋 Buyer Snapshot · 2 Minuten Lesen
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Was ist CorridorWork?
        </h1>
        <p className="text-gray-400 text-base mb-2">
          CorridorWork ist ein live betriebenes SaaS-Asset für strukturiertes, compliance-first
          Cross-border Hiring. Das System läuft autonom, sammelt inbound Leads über 4 Revenue-Pfade
          und bereitet täglich Berichte vor.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-2 bg-blue-900/40 border border-blue-600/40 rounded-lg text-blue-300 text-xs font-medium mb-3">
          🌐 Inbound-first SaaS Asset — designed to work without manual social media or owner involvement.
        </div>
        <p className="text-gray-500 text-sm">
          Phase 1 Pilot — kein laufender Revenue-Vertrag. Alle Zahlen verifizierbar.
          Keine erfundenen Umsätze.
        </p>
      </section>

      {/* Live Assets */}
      <section className="max-w-3xl mx-auto px-4 pb-8">
        <h2 className="text-white font-bold text-lg mb-3">⚙️ Sofort prüfbare Assets</h2>
        <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden">
          {LIVE_ASSETS.map((asset, i) => (
            <div key={asset.label}
                 className={`flex items-center gap-3 px-4 py-3 ${i < LIVE_ASSETS.length - 1 ? 'border-b border-slate-800' : ''}`}>
              <span className="text-xl w-7 shrink-0">{asset.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-gray-400 text-xs">{asset.label}</div>
                <div className="text-white text-sm">{asset.detail}</div>
              </div>
              <span className="text-green-400 text-xs font-medium shrink-0">{asset.status}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Revenue Paths */}
      <section className="max-w-3xl mx-auto px-4 pb-8">
        <h2 className="text-white font-bold text-lg mb-3">💰 Revenue-Pfade (4 aktiv)</h2>
        <div className="space-y-2">
          {REVENUE_PATHS.map(path => (
            <div key={path.rank} className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
                {path.rank}
              </div>
              <span className="text-lg shrink-0">{path.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium text-sm">{path.title}</div>
                <div className="text-gray-500 text-xs mt-0.5">{path.note}</div>
                <div className="text-gray-600 text-xs mt-0.5 font-mono">corridorwork.com{path.url}</div>
              </div>
              <span className="text-green-400 text-xs font-medium shrink-0">✅ Live</span>
            </div>
          ))}
        </div>
      </section>

      {/* Compliance & Safety */}
      <section className="max-w-3xl mx-auto px-4 pb-8">
        <h2 className="text-white font-bold text-lg mb-3">🛡️ Compliance & Safety-Architektur</h2>
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              { k: 'EMAIL_PROVIDER',          v: 'none' },
              { k: 'OUTREACH_EMAIL_PROVIDER', v: 'none' },
              { k: 'Stripe',                  v: 'inaktiv' },
              { k: 'Scraping',                v: 'nie' },
              { k: 'Google API',              v: 'inaktiv' },
              { k: 'Phase',                   v: '1 (Pilot)' },
            ].map(row => (
              <div key={row.k} className="flex items-center justify-between px-3 py-1.5 bg-slate-800 rounded-lg">
                <span className="text-gray-400 text-xs font-mono">{row.k}</span>
                <span className="text-green-400 text-xs font-semibold">{row.v} ✓</span>
              </div>
            ))}
          </div>
        </div>
        <h3 className="text-gray-400 text-sm font-semibold mb-2">Was explizit NICHT aktiv ist:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
          {NOT_ACTIVE.map(item => (
            <div key={item.item} className="flex items-center gap-2 text-gray-400 text-sm">
              <span>{item.icon}</span>
              <span>{item.item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Conversation Formats */}
      <section className="max-w-3xl mx-auto px-4 pb-8">
        <h2 className="text-white font-bold text-lg mb-3">💬 Gesprächsformate</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CONVERSATION_FORMATS.map(f => (
            <div key={f.title} className="bg-slate-900 border border-slate-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{f.icon}</span>
                <span className="text-white font-medium text-sm">{f.title}</span>
              </div>
              <p className="text-gray-500 text-xs">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 pb-10">
        <div className="bg-amber-950/50 border-2 border-amber-600/50 rounded-2xl p-6 text-center">
          <p className="text-amber-200 text-sm mb-4">
            Ernsthaftes Interesse an einer strategischen Partnerschaft, White-Label-Lösung oder
            Übernahme? Alle Anfragen werden manuell geprüft — vertraulich, ohne automatischen Versand.
          </p>
          <Link href="/strategic-partnership"
                className="inline-block px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors text-base">
            🎯 Strategic Interest anmelden →
          </Link>
          <p className="text-amber-300/60 text-xs mt-3">
            Kein Spam. Keine automatischen E-Mails. Manuell geprüft. DSGVO-konform.
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4">
          <p className="text-gray-600 text-xs text-center">
            CorridorWork befindet sich in Phase 1 (Pilot). Keine Umsatzversprechen.
            Keine garantierten Wachstumszahlen. Kein laufender Revenue-Vertrag ohne schriftliche Vereinbarung.
            Alle genannten Features sind live und verifizierbar.
            <br />
            <span className="text-gray-700 mt-1 block">
              Stand: 2026-06-07 · Phase 1 · Kontakt: transl.delta@gmail.com
            </span>
          </p>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
