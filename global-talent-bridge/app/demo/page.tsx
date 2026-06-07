/**
 * app/demo/page.tsx — /demo
 *
 * Public Demo-Seite — zeigt wie CorridorWork-Matching funktioniert.
 * Keine echten Kandidatendaten. Kein Auth. Kein Stripe. Kein Versand.
 * Safety: Aggregierte Beispieldaten. Keine personenbezogenen Kandidatenprofile.
 */
import type { Metadata } from 'next'
import { INDUSTRY_CONFIGS, CORRIDOR_CONFIGS } from '@/lib/seo-pages'

export const metadata: Metadata = {
  title: 'Demo — CorridorWork Talent-Matching ansehen',
  description:
    'Interaktive Demo: So funktioniert das CorridorWork Talent-Matching. Korridor-Scores, Branchennachfrage, Matching-Logik — keine echten Kandidatendaten. Kostenlos ansehen.',
  keywords: [
    'CorridorWork Demo',
    'Talent-Matching Demo',
    'internationales Recruiting Demo',
    'Korridor-Score Demo',
  ],
  openGraph: {
    title: 'Demo — CorridorWork Talent-Matching ansehen',
    description:
      'Interaktive Demo des CorridorWork Talent-Matching-Systems. Korridor-Scores, Sektornachfrage, Matching-Logik ansehen. Keine echten Kandidatendaten.',
    url: 'https://corridorwork.com/demo',
    type: 'website',
    locale: 'de_DE',
    siteName: 'CorridorWork',
  },
  alternates: { canonical: 'https://corridorwork.com/demo' },
}

// Sample candidate profiles — KEINE echten Daten, nur Beispiele
const DEMO_PROFILES = [
  {
    id: 'demo-001',
    initials: 'FK',
    origin: 'Philippinen 🇵🇭',
    sector: 'Pflege & Gesundheit',
    experience: '5 Jahre',
    languages: 'Englisch C1 · Deutsch A2',
    matchScore: 94,
    status: 'Beispiel',
  },
  {
    id: 'demo-002',
    initials: 'AK',
    origin: 'Marokko 🇲🇦',
    sector: 'Bau & Handwerk',
    experience: '8 Jahre',
    languages: 'Arabisch · Französisch B2 · Deutsch A1',
    matchScore: 82,
    status: 'Beispiel',
  },
  {
    id: 'demo-003',
    initials: 'RN',
    origin: 'Indien 🇮🇳',
    sector: 'IT & Technologie',
    experience: '6 Jahre',
    languages: 'Englisch C2 · Deutsch B1',
    matchScore: 91,
    status: 'Beispiel',
  },
]

const DEMO_CORRIDORS = [
  CORRIDOR_CONFIGS['philippines-care'],
  CORRIDOR_CONFIGS['india-uk'],
  CORRIDOR_CONFIGS['morocco-germany'],
]

const DEMO_INDUSTRIES = [
  INDUSTRY_CONFIGS.care,
  INDUSTRY_CONFIGS.it,
  INDUSTRY_CONFIGS.construction,
]

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">

      {/* Header */}
      <header className="border-b border-slate-700">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="text-white font-bold text-lg">CorridorWork</a>
          <div className="flex gap-4">
            <a href="/pilot/employers"     className="text-sm text-slate-400 hover:text-white transition-colors">Arbeitgeber →</a>
            <a href="/pilot/agencies"      className="text-sm text-slate-400 hover:text-white transition-colors">Agenturen →</a>
            <a href="/market-intelligence" className="text-sm text-slate-400 hover:text-white transition-colors">Market Intel →</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="inline-block bg-blue-900 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full mb-4">
          🎬 Demo — Beispieldaten, keine echten Profile
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          CorridorWork — Demo
        </h1>
        <p className="text-slate-300 text-lg mb-4 max-w-2xl mx-auto">
          So funktioniert das Talent-Matching: Korridor-Scores, Branchennachfrage und strukturierte Profile.
        </p>
        <div className="inline-flex items-center gap-2 bg-amber-900/30 border border-amber-700/50 rounded-full px-4 py-2 text-amber-300 text-sm">
          ⚠️ Alle Daten sind Beispieldaten — keine echten Kandidatenprofile, keine personenbezogenen Daten
        </div>
      </section>

      {/* Demo: Korridor-Scores */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <h2 className="text-white font-bold text-xl mb-4">📊 Korridor-Scores (Beispiel)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DEMO_CORRIDORS.map(c => (
            <div key={c.slug} className="bg-slate-800 border border-slate-700 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{c.originFlag}</span>
                <span className="text-slate-400">→</span>
                <span className="text-2xl">{c.destinationFlag}</span>
              </div>
              <div className="text-white font-semibold text-sm mb-1">{c.headline}</div>
              <div className="flex items-center gap-2 mb-2">
                <div className={`text-2xl font-bold ${c.corridorScore >= 90 ? 'text-green-400' : c.corridorScore >= 80 ? 'text-blue-400' : 'text-amber-400'}`}>
                  {c.corridorScore}
                </div>
                <div className="text-xs text-slate-400">Korridor-Score</div>
              </div>
              <div className="flex flex-wrap gap-1">
                {c.sectors.slice(0, 2).map(s => (
                  <span key={s} className="bg-slate-700 text-slate-300 text-xs px-2 py-0.5 rounded">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Demo: Kandidatenprofile */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <h2 className="text-white font-bold text-xl mb-2">👤 Beispiel-Profile (anonymisiert)</h2>
        <p className="text-slate-500 text-sm mb-4">* Keine echten Personendaten. Ausschließlich zu Demonstrationszwecken.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DEMO_PROFILES.map(p => (
            <div key={p.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-700 text-white font-bold flex items-center justify-center text-sm">
                  {p.initials}
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">{p.origin}</div>
                  <div className="text-slate-500 text-xs">{p.sector}</div>
                </div>
              </div>
              <div className="space-y-1 text-xs text-slate-400 mb-3">
                <div>Erfahrung: <span className="text-slate-300">{p.experience}</span></div>
                <div>Sprachen: <span className="text-slate-300">{p.languages}</span></div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl font-bold text-blue-400">{p.matchScore}</span>
                  <span className="text-xs text-slate-500 ml-1">Match-Score</span>
                </div>
                <span className="bg-amber-900/30 border border-amber-700/40 text-amber-300 text-xs px-2 py-0.5 rounded">
                  {p.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Demo: Branchen */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <h2 className="text-white font-bold text-xl mb-4">🏭 Beispiel-Branchen</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DEMO_INDUSTRIES.map(ind => (
            <a key={ind.slug} href={`/industries/${ind.slug}`}
               className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-blue-600/50 transition-colors group">
              <div className="text-2xl mb-2">{ind.emoji}</div>
              <div className={`font-semibold text-sm mb-1 group-hover:text-white ${ind.colorClass}`}>{ind.name}</div>
              <div className="text-slate-400 text-xs">{ind.tagline}</div>
              <div className="mt-3 text-xs text-blue-400 group-hover:underline">Mehr erfahren →</div>
            </a>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Bereit für den echten Pilot?</h2>
          <p className="text-gray-500 text-sm mb-6">
            Kostenlos · Unverbindlich · Kein Abo · Keine automatische Zahlung · Keine Jobgarantie
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/pilot/employers"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              🏭 Arbeitgeber-Pilot →
            </a>
            <a
              href="/pilot/agencies"
              className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
            >
              🤝 Agentur-Pilot →
            </a>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Nach Einreichung: manuelle Prüfung. Kein automatischer Kontakt. DSGVO-konform.
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="max-w-2xl mx-auto px-4 pb-16 text-center">
        <p className="text-xs text-slate-500">
          Alle auf dieser Demo-Seite gezeigten Kandidatenprofile sind fiktive Beispieldaten.
          Keine echten personenbezogenen Daten. Keine Jobgarantie. Keine Visa-Garantie.
          CorridorWork Phase 1 Pilot — kein automatischer Versand. DSGVO-konform.
          · <a href="/legal/datenschutz" className="hover:text-slate-300 underline">Datenschutz</a>
          · <a href="/legal/impressum"   className="hover:text-slate-300 underline">Impressum</a>
        </p>
      </section>
    </div>
  )
}
