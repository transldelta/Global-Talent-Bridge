/**
 * app/strategic-partnership/page.tsx — /strategic-partnership
 *
 * Public Strategic Partnership / Licensing / Acquisition Interest Page
 *
 * Wording: professionell, kein Verkaufsdruck, keine erfundenen Umsätze.
 * Safety: Kein E-Mail · Kein Outreach · Kein Stripe · lead_type=strategic_partner
 */
'use client'
import { useState } from 'react'
import { COMPLIANCE_DISCLAIMER } from '@/lib/revenue-leads'

const INTEREST_OPTIONS = [
  { value: 'partnership',            label: '🤝 Strategische Partnerschaft',          desc: 'Gemeinsame Marktbearbeitung, Revenue-Sharing oder operative Zusammenarbeit.' },
  { value: 'white_label',            label: '🏷️ White-Label-Lösung',                  desc: 'Nutzung des CorridorWork-Systems unter eigenem Branding.' },
  { value: 'licensing',              label: '📜 Lizenzierung / API-Zugang',            desc: 'Technologie-Lizenz oder API-Integration in eigene Systeme.' },
  { value: 'acquisition_discussion', label: '🏢 Übernahme / Beteiligungsgespräch',     desc: 'Ernsthaftes Interesse an Übernahme oder Beteiligung.' },
  { value: 'market_intelligence',    label: '📊 Market Intelligence',                  desc: 'Aggregierte Korridor- und Nachfragedaten für strategische Analysen.' },
]

const ASSET_FACTS = [
  { icon: '🌐', label: 'Live-Domain',              value: 'corridorwork.com' },
  { icon: '🧠', label: 'CWO Operating System',     value: 'Autonomous Revenue Operating System, Phase 1' },
  { icon: '⚙️', label: 'Daily Runner',             value: 'Läuft täglich, erzeugt Tagesbericht automatisch' },
  { icon: '📥', label: 'Inbound Lead Capture',      value: '4 Revenue-Pfade aktiv' },
  { icon: '🌍', label: 'SEO Network',               value: '16 indexierbare Seiten, 12 neue SEO-Seiten' },
  { icon: '⚖️', label: 'Compliance-Architektur',    value: 'Safety-First: Kein Scraping, kein Auto-Outreach' },
  { icon: '🔧', label: 'Tech Stack',                value: 'Next.js 14, Supabase, Vercel, TypeScript' },
  { icon: '📋', label: 'Phase',                     value: 'Phase 1 — Pilot, kein laufender Revenue-Vertrag' },
]

export default function StrategicPartnershipPage() {
  const [form, setForm] = useState({
    organization_name: '',
    contact_name:      '',
    email:             '',
    country:           '',
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
    if (!form.interest_type) { setErrMsg('Bitte Interesse-Typ auswählen.'); return }
    setStatus('loading'); setErrMsg('')
    try {
      const res = await fetch('/api/public/revenue-leads', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_type:          'strategic_partner',
          organization_name:  form.organization_name,
          contact_name:       form.contact_name,
          email:              form.email,
          country:            form.country,
          interest_type:      form.interest_type,
          message:            form.message,
          consent_to_contact: form.consent,
          source_page:        '/strategic-partnership',
          website:            form.website,
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
    <div className="min-h-screen bg-gradient-to-b from-amber-950 to-slate-900">

      {/* Nav */}
      <header className="border-b border-amber-900/50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="text-white font-bold text-lg">CorridorWork</a>
          <div className="flex gap-4 text-sm">
            <a href="/partners" className="text-amber-300 hover:text-white transition-colors">Partner-Programm →</a>
            <a href="/demo"     className="text-slate-400 hover:text-white transition-colors">Demo</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="inline-block bg-amber-900/40 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full mb-4 border border-amber-700/40">
          🎯 Strategic Partnership · Licensing · White-Label · Acquisition
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          CorridorWork als<br />
          <span className="text-amber-400">Strategisches Asset</span>
        </h1>
        <p className="text-slate-300 text-lg mb-4 max-w-2xl mx-auto">
          CorridorWork ist ein live betriebenes SaaS-Asset für strukturiertes, compliance-first
          Cross-border Hiring. Das System läuft autonom, sammelt Inbound-Leads und bereitet
          Revenue-Pfade täglich vor.
        </p>
        <div className="inline-flex items-center gap-2 bg-slate-800/60 border border-slate-700/50 rounded-xl px-5 py-3 text-slate-300 text-sm">
          ⚠️ Keine Umsatzversprechen. Keine erfundenen Zahlen. Pilot-Phase 1.
        </div>
      </section>

      {/* Asset facts */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <h2 className="text-white font-bold text-xl mb-4">📋 Was sofort geprüft werden kann</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ASSET_FACTS.map(f => (
            <div key={f.label} className="bg-slate-800/50 rounded-xl px-4 py-3 border border-slate-700/40 flex items-start gap-3">
              <span className="text-lg flex-shrink-0">{f.icon}</span>
              <div>
                <div className="text-slate-400 text-xs font-semibold uppercase">{f.label}</div>
                <div className="text-white text-sm">{f.value}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interest types */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <h2 className="text-white font-bold text-xl mb-4">Welche Gesprächsformen sind möglich?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {INTEREST_OPTIONS.map(opt => (
            <div key={opt.value} className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/40">
              <div className="text-base font-semibold text-white mb-1">{opt.label}</div>
              <div className="text-slate-400 text-sm">{opt.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* What we're not */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <div className="bg-slate-800/40 rounded-xl border border-slate-700/40 p-5">
          <h3 className="text-white font-bold text-base mb-3">Klare Grenzen (keine falschen Erwartungen)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-400">
            {[
              'Keine garantierten Umsätze oder Wachstumszahlen',
              'Kein automatischer E-Mail-Versand aktiv',
              'Keine aktiven Zahlungssysteme (Stripe nicht aktiv)',
              'Kein Cold-Outreach oder Bulk-Outreach',
              'Keine bestehenden laufenden Verträge',
              'Kein Scraping oder externe API-Calls',
              'Phase 1: Pilot ohne verbindliche Verträge',
              'Keine personalisierten Kandidatenprofile öffentlich',
            ].map(l => (
              <div key={l} className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5 flex-shrink-0">·</span>
                <span>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTAs */}
      <section className="max-w-4xl mx-auto px-4 pb-8 text-center">
        <div className="flex flex-wrap justify-center gap-3">
          <a href="/demo" className="px-5 py-2.5 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-600 transition-colors text-sm">
            Demo ansehen
          </a>
          <a href="/partners" className="px-5 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors text-sm">
            Partner-Programm
          </a>
        </div>
      </section>

      {/* Form */}
      <section className="max-w-2xl mx-auto px-4 pb-20">
        <div className="bg-slate-800/60 rounded-2xl border border-amber-900/40 p-8">
          <h2 className="text-xl font-bold text-white mb-2">🎯 Strategic Interest anmelden</h2>
          <p className="text-slate-400 text-sm mb-6">
            Vertraulich. Keine automatische Antwort. Manuelle Prüfung und persönliche Antwort.
          </p>

          {status === 'success' ? (
            <div className="bg-green-900/30 border border-green-700/50 rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">✅</div>
              <div className="text-green-300 font-bold text-lg mb-2">Interesse registriert!</div>
              <div className="text-slate-300 text-sm">
                Ihre Anfrage wurde vertraulich gespeichert. Wir melden uns persönlich.
                Kein automatischer Versand.
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
                    className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                    placeholder="Ihr Unternehmen" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Ansprechpartner *</label>
                  <input required value={form.contact_name} onChange={e => setForm(f => ({...f, contact_name: e.target.value}))}
                    className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                    placeholder="Ihr Name" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">E-Mail *</label>
                  <input required type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
                    className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                    placeholder="name@unternehmen.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Land</label>
                  <input value={form.country} onChange={e => setForm(f => ({...f, country: e.target.value}))}
                    className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                    placeholder="z.B. Deutschland" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Interesse *</label>
                <select required value={form.interest_type} onChange={e => setForm(f => ({...f, interest_type: e.target.value}))}
                  className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm">
                  <option value="">Bitte Interesse-Typ auswählen…</option>
                  {INTEREST_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Nachricht</label>
                <textarea value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} rows={4}
                  className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm resize-none"
                  placeholder="Beschreiben Sie Ihr Interesse. Was möchten Sie prüfen oder besprechen?" />
              </div>

              {/* Consent */}
              <div className="bg-slate-700/40 rounded-lg p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input required type="checkbox" checked={form.consent} onChange={e => setForm(f => ({...f, consent: e.target.checked}))}
                    className="mt-1 h-4 w-4 rounded border-slate-500 bg-slate-600 text-amber-500 flex-shrink-0" />
                  <span className="text-slate-300 text-xs leading-relaxed">
                    {COMPLIANCE_DISCLAIMER.consentText}{' '}
                    <a href="/legal/datenschutz" className="underline text-amber-400">Datenschutzerklärung</a>. *
                  </span>
                </label>
              </div>

              {errMsg && (
                <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3 text-sm text-red-300">
                  ⚠️ {errMsg}
                </div>
              )}

              <button type="submit" disabled={status === 'loading'}
                className="w-full py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors">
                {status === 'loading' ? '⟳ Wird gesendet…' : '🎯 Strategic Interest anmelden'}
              </button>

              <div className="flex flex-wrap gap-3 justify-center text-xs text-slate-500 pt-2">
                <span>✓ Vertraulich</span>
                <span>·</span>
                <span>✓ Kein automatischer Versand</span>
                <span>·</span>
                <span>✓ Manuelle Antwort</span>
                <span>·</span>
                <span>✓ DSGVO-konform</span>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
