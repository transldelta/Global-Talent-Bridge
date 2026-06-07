/**
 * app/partners/page.tsx — /partners
 *
 * Public Partner-Seite: Recruiting-Agenturen, Sprachschulen, Relocation,
 * HR-Berater, B2B-Partner können Interesse anmelden.
 *
 * Safety: Kein E-Mail · Kein Outreach · Kein Stripe · lead_type=agency_partner
 */
'use client'
import { useState } from 'react'
import type { Metadata } from 'next'
import { COMPLIANCE_DISCLAIMER } from '@/lib/revenue-leads'

// Metadata is handled separately in a server component via layout
// For this page we use 'use client' for the form, metadata via head tags

const ORG_TYPES = [
  'Recruiting-Agentur',
  'Sprachschule / Bildungseinrichtung',
  'Relocation-Dienstleister',
  'HR-Beratung',
  'B2B-Plattform',
  'Sonstiger B2B-Partner',
]

const INTEREST_OPTIONS = [
  { value: 'white_label',  label: '🏷️ White-Label Integration' },
  { value: 'partnership',  label: '🤝 Operative Partnerschaft' },
  { value: 'licensing',    label: '📜 Lizenzierung / API-Zugang' },
  { value: 'market_intelligence', label: '📊 Market Intelligence' },
]

export default function PartnersPage() {
  const [form, setForm] = useState({
    organization_name: '',
    contact_name:      '',
    email:             '',
    country:           '',
    org_type:          '',
    interest_type:     '',
    message:           '',
    consent:           false,
    website:           '', // Honeypot
  })
  const [status,  setStatus]  = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errMsg,  setErrMsg]  = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.consent) { setErrMsg('Bitte Zustimmung erteilen.'); return }
    setStatus('loading'); setErrMsg('')
    try {
      const res = await fetch('/api/public/revenue-leads', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_type:         'agency_partner',
          organization_name: form.organization_name,
          contact_name:      form.contact_name,
          email:             form.email,
          country:           form.country,
          sector:            form.org_type,
          interest_type:     form.interest_type || undefined,
          message:           form.message,
          consent_to_contact: form.consent,
          source_page:       '/partners',
          website:           form.website, // Honeypot
        }),
      })
      const data = await res.json()
      if (!res.ok) { setErrMsg(data.error ?? 'Fehler beim Senden'); setStatus('error'); return }
      setStatus('success')
    } catch {
      setErrMsg('Netzwerkfehler. Bitte erneut versuchen.'); setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-slate-900">

      {/* Nav */}
      <header className="border-b border-purple-900/50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="text-white font-bold text-lg">CorridorWork</a>
          <div className="flex gap-4 text-sm">
            <a href="/strategic-partnership" className="text-purple-300 hover:text-white transition-colors">Strategic Partnership →</a>
            <a href="/demo" className="text-slate-400 hover:text-white transition-colors">Demo</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="inline-block bg-purple-900/60 text-purple-300 text-xs font-semibold px-3 py-1 rounded-full mb-4 border border-purple-700/50">
          🤝 Partner-Programm — Phase 1
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          CorridorWork als<br />
          <span className="text-purple-400">Partnerlösung nutzen</span>
        </h1>
        <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
          Recruiting-Agenturen, Sprachschulen, Relocation-Dienstleister und HR-Berater
          können das CorridorWork Talent-Matching-System als White-Label-Partnerlösung oder
          operative Partnerschaft nutzen.
        </p>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 text-left">
          {[
            { icon: '🏷️', title: 'White-Label',     text: 'Eigenes Branding auf dem Matching-System (Phase 2+).' },
            { icon: '🌍', title: 'Talent-Korridore', text: '10+ geprüfte internationale Migrations-Korridore.' },
            { icon: '📊', title: 'Market Data',      text: 'Aggregierte Nachfragedaten für Ihre Märkte.' },
            { icon: '🔗', title: 'Employer Pipeline', text: 'Vorqualifizierte Arbeitgeber-Kontakte (Pilot).' },
          ].map(b => (
            <div key={b.title} className="bg-slate-800/60 rounded-xl p-5 border border-purple-900/40">
              <div className="text-2xl mb-2">{b.icon}</div>
              <div className="font-semibold text-white text-sm mb-1">{b.title}</div>
              <div className="text-slate-400 text-sm">{b.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Who is it for */}
      <section className="max-w-4xl mx-auto px-4 pb-10">
        <h2 className="text-white font-bold text-xl mb-4 text-center">Für wen ist das Partner-Programm?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: '🏢', title: 'Recruiting-Agenturen',         text: 'Erweitern Sie Ihr Portfolio um internationales Talent-Matching.' },
            { icon: '🎓', title: 'Sprachschulen',                text: 'Verbinden Sie Sprachkompetenzen mit Arbeitgeber-Nachfrage.' },
            { icon: '✈️', title: 'Relocation-Dienstleister',     text: 'Vervollständigen Sie Ihre Cross-border Hiring Services.' },
            { icon: '👔', title: 'HR-Berater',                   text: 'Bieten Sie strukturiertes internationales Matching als Service.' },
            { icon: '🌐', title: 'B2B-Plattformen',              text: 'API-Integration oder White-Label-Lösung für Ihre Plattform.' },
            { icon: '🤝', title: 'Operative Partner',            text: 'Gemeinsame Bearbeitung von Arbeitgeber-Anfragen.' },
          ].map(c => (
            <div key={c.title} className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50">
              <div className="text-xl mb-2">{c.icon}</div>
              <div className="font-semibold text-white text-sm mb-1">{c.title}</div>
              <div className="text-slate-400 text-sm">{c.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA links */}
      <section className="max-w-4xl mx-auto px-4 pb-8 text-center">
        <div className="flex flex-wrap justify-center gap-3">
          <a href="/strategic-partnership" className="px-5 py-2.5 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors text-sm">
            🎯 Strategische Partnerschaft / Übernahme →
          </a>
          <a href="/demo" className="px-5 py-2.5 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-600 transition-colors text-sm">
            Demo ansehen
          </a>
        </div>
      </section>

      {/* Form */}
      <section className="max-w-2xl mx-auto px-4 pb-20">
        <div className="bg-slate-800/60 rounded-2xl border border-purple-900/40 p-8">
          <h2 className="text-xl font-bold text-white mb-2">🤝 Partner-Interesse anmelden</h2>
          <p className="text-slate-400 text-sm mb-6">
            Kostenlos und unverbindlich. Kein automatischer Versand. Manuelle Prüfung.
          </p>

          {status === 'success' ? (
            <div className="bg-green-900/30 border border-green-700/50 rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">✅</div>
              <div className="text-green-300 font-bold text-lg mb-2">Interesse registriert!</div>
              <div className="text-slate-300 text-sm">
                Ihre Anfrage wurde gespeichert. Wir melden uns manuell — kein automatischer Versand.
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot */}
              <input type="text" name="website" value={form.website} onChange={e => setForm(f => ({...f, website: e.target.value}))} className="hidden" tabIndex={-1} autoComplete="off" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Organisation *</label>
                  <input required value={form.organization_name} onChange={e => setForm(f => ({...f, organization_name: e.target.value}))}
                    className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    placeholder="Ihre Organisation" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Ansprechpartner *</label>
                  <input required value={form.contact_name} onChange={e => setForm(f => ({...f, contact_name: e.target.value}))}
                    className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    placeholder="Ihr Name" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">E-Mail *</label>
                  <input required type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
                    className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    placeholder="name@organisation.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Land</label>
                  <input value={form.country} onChange={e => setForm(f => ({...f, country: e.target.value}))}
                    className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    placeholder="z.B. Deutschland" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Art der Organisation</label>
                  <select value={form.org_type} onChange={e => setForm(f => ({...f, org_type: e.target.value}))}
                    className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm">
                    <option value="">Bitte wählen…</option>
                    {ORG_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Interesse</label>
                  <select value={form.interest_type} onChange={e => setForm(f => ({...f, interest_type: e.target.value}))}
                    className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm">
                    <option value="">Bitte wählen…</option>
                    {INTEREST_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Nachricht</label>
                <textarea value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} rows={3}
                  className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm resize-none"
                  placeholder="Was interessiert Sie? Wie können wir zusammenarbeiten?" />
              </div>

              {/* Consent */}
              <div className="bg-slate-700/40 rounded-lg p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input required type="checkbox" checked={form.consent} onChange={e => setForm(f => ({...f, consent: e.target.checked}))}
                    className="mt-1 h-4 w-4 rounded border-slate-500 bg-slate-600 text-purple-500 flex-shrink-0" />
                  <span className="text-slate-300 text-xs leading-relaxed">
                    {COMPLIANCE_DISCLAIMER.consentText}{' '}
                    <a href="/legal/datenschutz" className="underline text-purple-400">Datenschutzerklärung</a>. *
                  </span>
                </label>
              </div>

              {errMsg && (
                <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3 text-sm text-red-300">
                  ⚠️ {errMsg}
                </div>
              )}

              <button type="submit" disabled={status === 'loading'}
                className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors">
                {status === 'loading' ? '⟳ Wird gesendet…' : '🤝 Partner-Interesse anmelden'}
              </button>

              {/* Safety Badges */}
              <div className="flex flex-wrap gap-3 justify-center text-xs text-slate-500 pt-2">
                <span>✓ Kein automatischer Versand</span>
                <span>·</span>
                <span>✓ Kein Stripe</span>
                <span>·</span>
                <span>✓ DSGVO-konform</span>
                <span>·</span>
                <span>✓ Manuelle Prüfung</span>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
