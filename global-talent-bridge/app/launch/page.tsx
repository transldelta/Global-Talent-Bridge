/**
 * app/launch/page.tsx — /launch
 *
 * Öffentliche Launch- & Partner-Übersichtsseite.
 * Zeigt alle Revenue-Pfade mit klaren CTAs.
 *
 * Safety: kein Versand · kein Stripe · kein Scraping · kein Outreach
 */
import Link from 'next/link'
import { PublicFooter } from '@/app/_components/PublicFooter'

export const metadata = {
  title:       'CorridorWork ist live — Partner, Pilot & Strategic Partnership',
  description: 'CorridorWork verbindet internationale Fachkräfte mit Arbeitgebern in Deutschland und Europa. Employer Pilot, Agency Partner, Strategic Partnership und Market Intelligence — jetzt offen für Anfragen.',
}

const REVENUE_PATHS = [
  {
    rank:        1,
    icon:        '🎯',
    title:       'Strategic Partnership',
    subtitle:    'Schnellster Revenue-Weg',
    description: 'Strategische Partnerschaft, White-Label, Lizenzierung oder Übernahme/Beteiligung. Für Unternehmen mit ernsthaftem Interesse an CorridorWork.',
    cta:         'Strategic Interest anmelden',
    href:        '/strategic-partnership',
    color:       'amber',
    border:      'border-amber-400',
    bg:          'bg-amber-50',
    ctaBg:       'bg-amber-500 hover:bg-amber-600',
    badge:       'Rang 1 · Höchste Priorität',
    badgeBg:     'bg-amber-100 text-amber-800',
  },
  {
    rank:        2,
    icon:        '🤝',
    title:       'Agency / White-Label Partner',
    subtitle:    'Partner-Programm',
    description: 'Recruiting-Agenturen, HR-Dienstleister und Fachvermittler können CorridorWork als White-Label-Lösung oder kooperativ nutzen.',
    cta:         'Partner-Interesse anmelden',
    href:        '/partners',
    color:       'purple',
    border:      'border-purple-300',
    bg:          'bg-purple-50',
    ctaBg:       'bg-purple-600 hover:bg-purple-700',
    badge:       'Rang 2 · Agency Partner',
    badgeBg:     'bg-purple-100 text-purple-800',
  },
  {
    rank:        3,
    icon:        '🏭',
    title:       'Employer Pilot',
    subtitle:    'Arbeitgeber-Pilot',
    description: 'Unternehmen in Deutschland und Europa testen CorridorWork für strukturiertes, compliance-first Cross-border Hiring. Pflege, Logistik, IT, Bau.',
    cta:         'Pilot-Interesse anmelden',
    href:        '/pilot/employers',
    color:       'blue',
    border:      'border-blue-300',
    bg:          'bg-blue-50',
    ctaBg:       'bg-blue-600 hover:bg-blue-700',
    badge:       'Rang 3 · Employer Pilot',
    badgeBg:     'bg-blue-100 text-blue-800',
  },
  {
    rank:        4,
    icon:        '📊',
    title:       'Market Intelligence',
    subtitle:    'Korridor-Daten & Trends',
    description: 'Aggregierte Nachfrage- und Korridor-Daten für strategische Analysen. Für Berater, Investoren und Marktforscher.',
    cta:         'Market Intelligence anfragen',
    href:        '/market-intelligence',
    color:       'emerald',
    border:      'border-emerald-300',
    bg:          'bg-emerald-50',
    ctaBg:       'bg-emerald-600 hover:bg-emerald-700',
    badge:       'Rang 4 · Market Intelligence',
    badgeBg:     'bg-emerald-100 text-emerald-800',
  },
]

const LIVE_SYSTEMS = [
  { icon: '🌐', label: 'Live-Domain',          value: 'corridorwork.com' },
  { icon: '⚙️', label: 'CWO Operating System', value: 'Autonomous, täglich' },
  { icon: '📥', label: 'Lead Capture',          value: '4 Revenue-Pfade aktiv' },
  { icon: '🔍', label: 'SEO Network',           value: '16+ Seiten indexierbar' },
  { icon: '⚖️', label: 'Compliance',            value: 'Safety-First, Phase 1' },
  { icon: '🔧', label: 'Tech Stack',            value: 'Next.js 14, Supabase, Vercel' },
]

export default function LaunchPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-16 pb-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-900/40 border border-green-600/40 rounded-full text-green-400 text-sm font-medium mb-6">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Live seit 2026 — Phase 1 Pilot
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
          CorridorWork ist live.
        </h1>
        <p className="text-gray-400 text-lg mb-4 max-w-2xl mx-auto">
          Strukturiertes, compliance-first Cross-border Hiring. Verbindet internationale Fachkräfte
          mit Arbeitgebern in Deutschland und Europa.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          Kein Cold-Outreach. Kein Spam. Nur inbound — manuell geprüft.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/strategic-partnership"
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors">
            🎯 Strategic Partnership
          </Link>
          <Link href="/demo"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl border border-white/20 transition-colors">
            🎬 Demo ansehen
          </Link>
        </div>
      </section>

      {/* Live Systems */}
      <section className="max-w-4xl mx-auto px-4 pb-10">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">⚙️ Live-Systeme</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {LIVE_SYSTEMS.map(s => (
              <div key={s.label} className="flex items-start gap-2">
                <span className="text-lg shrink-0">{s.icon}</span>
                <div>
                  <div className="text-gray-400 text-xs">{s.label}</div>
                  <div className="text-white text-sm font-medium">{s.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue Paths */}
      <section className="max-w-4xl mx-auto px-4 pb-10">
        <h2 className="text-white text-2xl font-bold mb-2">4 Revenue-Pfade offen</h2>
        <p className="text-gray-500 text-sm mb-6">Alle Anfragen werden manuell geprüft. Kein automatischer Versand.</p>
        <div className="space-y-4">
          {REVENUE_PATHS.map(path => (
            <div key={path.rank} className={`rounded-2xl border-2 ${path.border} ${path.bg} p-5`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-3xl shrink-0">{path.icon}</span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-gray-900 font-bold text-base">{path.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${path.badgeBg}`}>
                        {path.badge}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{path.description}</p>
                  </div>
                </div>
                <Link href={path.href}
                      className={`shrink-0 px-4 py-2 ${path.ctaBg} text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap`}>
                  {path.cta} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Demo CTA */}
      <section className="max-w-4xl mx-auto px-4 pb-10">
        <div className="bg-slate-800 border border-slate-600 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-white font-bold text-lg">🎬 Live-Demo ansehen</h3>
            <p className="text-gray-400 text-sm">Vollständige Demo des CorridorWork Revenue Operating System.</p>
          </div>
          <Link href="/demo"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors whitespace-nowrap">
            Demo →
          </Link>
        </div>
      </section>

      {/* Buyer CTA */}
      <section className="max-w-4xl mx-auto px-4 pb-10">
        <div className="bg-amber-950/40 border border-amber-800/40 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-amber-300 font-bold text-lg">📋 Buyer Snapshot</h3>
            <p className="text-amber-200/70 text-sm">Was ist CorridorWork wirklich? Live-Systeme, Revenue-Pfade, Compliance. 2 Minuten.</p>
          </div>
          <Link href="/buyer-snapshot"
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors whitespace-nowrap">
            Buyer Snapshot →
          </Link>
        </div>
      </section>

      {/* Safety Note */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 text-center">
          <p className="text-gray-500 text-xs">
            ✓ Kein Cold-Outreach &nbsp;·&nbsp; ✓ Kein automatischer Versand &nbsp;·&nbsp;
            ✓ Kein Stripe aktiv &nbsp;·&nbsp; ✓ Kein Scraping &nbsp;·&nbsp; ✓ Phase 1 Pilot &nbsp;·&nbsp;
            ✓ DSGVO-konform &nbsp;·&nbsp; ✓ Keine erfundenen Umsätze
          </p>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
