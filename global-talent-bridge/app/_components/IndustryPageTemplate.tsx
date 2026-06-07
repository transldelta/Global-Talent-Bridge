/**
 * app/_components/IndustryPageTemplate.tsx
 *
 * Shared template for all /industries/* pages.
 * No auth required — fully public, no DB calls, no email, no Stripe.
 * Safety: Keine Jobgarantie, keine Visa-Garantie, kein automatischer Versand.
 */
import type { IndustryConfig } from '@/lib/seo-pages'

interface IndustryPageTemplateProps {
  config: IndustryConfig
}

export function IndustryPageTemplate({ config }: IndustryPageTemplateProps) {
  const pillBg = config.bgClass
  const border  = config.borderClass
  const color   = config.colorClass

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">

      {/* Header */}
      <header className="border-b border-slate-700">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="text-white font-bold text-lg">CorridorWork</a>
          <div className="flex gap-4">
            <a href="/pilot/employers"  className="text-sm text-slate-400 hover:text-white transition-colors">Arbeitgeber →</a>
            <a href="/pilot/agencies"   className="text-sm text-slate-400 hover:text-white transition-colors">Agenturen →</a>
            <a href="/market-intelligence" className="text-sm text-slate-400 hover:text-white transition-colors">Market Intel →</a>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-4 pt-4">
        <nav className="text-xs text-slate-500 flex items-center gap-1">
          <a href="/" className="hover:text-slate-300 transition-colors">CorridorWork</a>
          <span>›</span>
          <a href="/industries" className="hover:text-slate-300 transition-colors">Branchen</a>
          <span>›</span>
          <span className={color}>{config.name}</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className={`inline-block ${pillBg} border ${border} text-xs font-semibold px-3 py-1 rounded-full mb-4 ${color}`}>
          {config.emoji} Branche: {config.name}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {config.name}.<br />
          <span className={color}>International. Geprüft. Kein Risiko.</span>
        </h1>
        <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
          {config.tagline}
        </p>

        {/* Key Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 text-left">
          {config.keyPoints.map(pt => (
            <div key={pt.title} className={`bg-slate-800 rounded-xl p-5 border ${border}`}>
              <div className="text-2xl mb-2">{pt.icon}</div>
              <div className={`font-semibold text-sm mb-1 ${color}`}>{pt.title}</div>
              <div className="text-slate-400 text-sm">{pt.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Description */}
      <section className="max-w-3xl mx-auto px-4 pb-10">
        <div className={`bg-slate-800 rounded-xl border ${border} p-6`}>
          <h2 className={`text-sm font-semibold uppercase ${color} mb-3`}>ℹ️ Über diesen Bereich</h2>
          <p className="text-slate-300 text-sm leading-relaxed">{config.description}</p>
          <div className="mt-4 pt-4 border-t border-slate-700">
            <span className="text-xs text-slate-500">Zielgruppe: </span>
            <span className="text-xs text-slate-400">{config.targetEmployers}</span>
          </div>
        </div>
      </section>

      {/* Aktive Korridore */}
      <section className="max-w-3xl mx-auto px-4 pb-10">
        <h2 className="text-white font-semibold text-lg mb-4">🌍 Aktive Talent-Korridore</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {config.corridors.map(c => (
            <div key={c} className={`bg-slate-800 border ${border} rounded-lg px-4 py-3 flex items-center gap-3`}>
              <span className={`text-lg ${color}`}>→</span>
              <span className="text-slate-300 text-sm">{c}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Pilot anfragen — {config.name}
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Kostenlos · Unverbindlich · Kein Abo · Keine automatische Zahlung · Keine Jobgarantie
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
          Keine automatische Zahlung. Kandidatenkontakt nur nach expliziter Freigabe. DSGVO-konform.
          · <a href="/legal/datenschutz" className="hover:text-slate-300 underline">Datenschutz</a>
          · <a href="/legal/impressum"   className="hover:text-slate-300 underline">Impressum</a>
        </p>
      </section>
    </div>
  )
}
