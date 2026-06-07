/**
 * app/_components/CorridorPageTemplate.tsx
 *
 * Shared template for all static /corridors/* SEO pages.
 * No auth required — fully public, no DB calls, no email, no Stripe.
 * Safety: Keine Visa-Garantie, keine Jobgarantie, kein automatischer Versand.
 *
 * NOTE: Static routes /corridors/<slug>/page.tsx take priority over
 *       the dynamic /corridors/[slug]/page.tsx.
 */
import type { CorridorConfig } from '@/lib/seo-pages'

interface CorridorPageTemplateProps {
  config: CorridorConfig
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 90 ? 'text-green-400' : score >= 80 ? 'text-blue-400' : 'text-amber-400'
  const bg    = score >= 90 ? 'bg-green-900/30 border-green-700/50' : score >= 80 ? 'bg-blue-900/30 border-blue-700/50' : 'bg-amber-900/30 border-amber-700/50'
  const label = score >= 90 ? 'Sehr hoch' : score >= 80 ? 'Hoch' : 'Mittel'
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${bg}`}>
      <span className={`text-2xl font-bold ${color}`}>{score}</span>
      <div>
        <div className={`text-xs font-semibold ${color}`}>Korridor-Score</div>
        <div className="text-xs text-slate-400">{label}</div>
      </div>
    </div>
  )
}

export function CorridorPageTemplate({ config }: CorridorPageTemplateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">

      {/* Header */}
      <header className="border-b border-slate-700">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="text-white font-bold text-lg">CorridorWork</a>
          <div className="flex gap-4">
            <a href="/pilot/employers"     className="text-sm text-slate-400 hover:text-white transition-colors">Arbeitgeber →</a>
            <a href="/market-intelligence" className="text-sm text-slate-400 hover:text-white transition-colors">Market Intel →</a>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-4 pt-4">
        <nav className="text-xs text-slate-500 flex items-center gap-1">
          <a href="/" className="hover:text-slate-300 transition-colors">CorridorWork</a>
          <span>›</span>
          <a href="/corridors" className="hover:text-slate-300 transition-colors">Korridore</a>
          <span>›</span>
          <span className="text-blue-400">{config.headline}</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">
          {config.originFlag} <span className="text-slate-500 text-3xl">→</span> {config.destinationFlag}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {config.headline}
        </h1>
        <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
          {config.description}
        </p>

        <div className="flex justify-center mb-8">
          <ScoreBadge score={config.corridorScore} />
        </div>

        {/* Sectors */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {config.sectors.map(s => (
            <span key={s} className="bg-slate-700 border border-slate-600 text-slate-300 text-xs px-3 py-1 rounded-full">
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* Details */}
      <section className="max-w-3xl mx-auto px-4 pb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Matching-Logik */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-blue-400 mb-2">⚙️ Matching-Logik</h3>
          <p className="text-slate-300 text-sm leading-relaxed">{config.matchingLogic}</p>
        </div>

        {/* Compliance */}
        <div className="bg-slate-800 border border-amber-700/40 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-amber-400 mb-2">⚖️ Rechtlicher Hinweis</h3>
          <p className="text-slate-300 text-sm leading-relaxed">{config.complianceNote}</p>
        </div>
      </section>

      {/* Score Erklärung */}
      <section className="max-w-3xl mx-auto px-4 pb-10">
        <div className="bg-blue-900/20 border border-blue-700/40 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-blue-400 mb-3">📊 Was bedeutet der Korridor-Score?</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-green-400 font-bold text-xl">90–100</div>
              <div className="text-slate-400 text-xs">Sehr hohe Nachfrage & Rechtssicherheit</div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 font-bold text-xl">80–89</div>
              <div className="text-slate-400 text-xs">Hohe Nachfrage, gute Bedingungen</div>
            </div>
            <div className="text-center">
              <div className="text-amber-400 font-bold text-xl">70–79</div>
              <div className="text-slate-400 text-xs">Mittlere Nachfrage, aktiver Aufbau</div>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            * Aggregierter Score basierend auf Nachfragedaten, Rechtslage und Korridor-Aktivität. Kein Versprechen.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Pilot anfragen — {config.originCountry} → {config.destinationCountry}
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Kostenlos · Unverbindlich · Keine Visa-Garantie · Kein automatischer Versand
          </p>
          <a
            href="/pilot/employers"
            className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-base"
          >
            🚀 Jetzt Pilot anfragen →
          </a>
          <p className="text-xs text-gray-400 mt-4">
            Nach Einreichung: manuelle Prüfung. Kein automatischer Kontakt. DSGVO-konform.
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="max-w-2xl mx-auto px-4 pb-16 text-center">
        <p className="text-xs text-slate-500">
          CorridorWork ist ein Matching-Dienst (Phase 1 Pilot). Keine Jobgarantie. Keine Visa-Garantie.
          Visa-Prozesse liegen bei den zuständigen Behörden — nicht bei CorridorWork.
          Keine automatische Zahlung. Kein automatischer Kontakt. DSGVO-konform.
          · <a href="/legal/datenschutz" className="hover:text-slate-300 underline">Datenschutz</a>
          · <a href="/legal/impressum"   className="hover:text-slate-300 underline">Impressum</a>
        </p>
      </section>
    </div>
  )
}
