'use client'
/**
 * MarketIntelForm.tsx
 *
 * Formular für Market Intelligence Report-Interesse.
 * Keine personenbezogenen Kandidatendaten. Nur aggregierte Insights.
 */
import { useState } from 'react'
import { COMPLIANCE_DISCLAIMER } from '@/lib/revenue-leads'

const CORRIDORS = [
  'Philippinen → Deutschland',
  'Marokko → Deutschland / Frankreich',
  'Tunesien → Deutschland',
  'Indien → Deutschland / UK',
  'Serbien → Deutschland / Österreich',
  'Bosnien → Deutschland / Österreich',
  'Georgien → Deutschland',
  'Kenia → Deutschland',
  'Brasilien → Deutschland / Portugal',
  'Mexiko → Deutschland / USA',
]

export function MarketIntelForm() {
  const [form, setForm] = useState({
    organization_name:  '',
    contact_name:       '',
    email:              '',
    country:            '',
    sector:             '', // Zielkorridor
    message:            '',
    consent_to_contact: false,
    website:            '', // Honeypot
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors,  setErrors]  = useState<string[]>([])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors([])
    setLoading(true)

    try {
      const res = await fetch('/api/public/revenue-leads', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          lead_type:          'market_intelligence',
          organization_name:  form.organization_name,
          contact_name:       form.contact_name,
          email:              form.email,
          country:            form.country,
          sector:             form.sector,
          message:            form.message,
          consent_to_contact: form.consent_to_contact,
          source_page:        '/market-intelligence',
          website:            form.website,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrors(data.errors ?? [data.error ?? 'Fehler beim Einreichen.'])
      } else {
        setSuccess(true)
      }
    } catch {
      setErrors(['Netzwerkfehler. Bitte versuche es erneut.'])
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <div className="text-4xl mb-3">✅</div>
        <h3 className="text-xl font-bold text-green-900 mb-2">Interesse registriert!</h3>
        <p className="text-green-800 text-sm">
          Danke. Wir melden uns <strong>manuell</strong> sobald Reports verfügbar sind.
          Keine automatischen E-Mails.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <input
          type="text" name="website" value={form.website}
          onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
          tabIndex={-1} autoComplete="off"
        />
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          {errors.map((err, i) => <p key={i} className="text-sm text-red-700">⚠️ {err}</p>)}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Organisation <span className="text-red-500">*</span></label>
          <input
            type="text" required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
            placeholder="Firma / Organisation"
            value={form.organization_name}
            onChange={e => setForm(f => ({ ...f, organization_name: e.target.value }))}
            maxLength={200}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ansprechpartner <span className="text-red-500">*</span></label>
          <input
            type="text" required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
            placeholder="Name"
            value={form.contact_name}
            onChange={e => setForm(f => ({ ...f, contact_name: e.target.value }))}
            maxLength={200}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail <span className="text-red-500">*</span></label>
        <input
          type="email" required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
          placeholder="name@firma.de"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Land / Region</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="Deutschland"
            value={form.country}
            onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Interessanter Korridor</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            value={form.sector}
            onChange={e => setForm(f => ({ ...f, sector: e.target.value }))}
          >
            <option value="">Bitte wählen</option>
            {CORRIDORS.map(c => <option key={c} value={c}>{c}</option>)}
            <option value="Sonstiges">Sonstiges / Mehrere</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Was möchten Sie wissen?</label>
        <textarea
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
          placeholder="Wir interessieren uns für Nachfragedaten im Pflegebereich, Korridor Philippinen → Deutschland..."
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          maxLength={1000}
        />
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-1">
        <p className="text-xs text-green-800 font-semibold">Wichtig: Was Market Intelligence NICHT enthält</p>
        <p className="text-xs text-green-700">✗ Keine personenbezogenen Kandidatendaten</p>
        <p className="text-xs text-green-700">✗ Keine Kandidatenlisten</p>
        <p className="text-xs text-green-700">✗ Keine individuellen Profile</p>
        <p className="text-xs text-green-700">✓ Nur aggregierte, anonymisierte Marktdaten</p>
        <p className="text-xs text-green-700">
          ✓ {COMPLIANCE_DISCLAIMER.gdprNote}{' '}
          <a href={COMPLIANCE_DISCLAIMER.datenschutzUrl} className="underline text-green-800 hover:text-green-900" target="_blank" rel="noopener noreferrer">
            Datenschutzerklärung
          </a>
        </p>
      </div>

      <div className="flex items-start gap-3">
        <input
          type="checkbox" required id="consent_intel"
          className="mt-1 rounded border-gray-300 text-green-600"
          checked={form.consent_to_contact}
          onChange={e => setForm(f => ({ ...f, consent_to_contact: e.target.checked }))}
        />
        <label htmlFor="consent_intel" className="text-sm text-gray-700">
          <span className="text-red-500">*</span>{' '}
          Ich möchte, dass CorridorWork mich zur Bearbeitung dieser Anfrage kontaktiert.
          Ich stimme der Speicherung meiner Angaben gemäß der{' '}
          <a href={COMPLIANCE_DISCLAIMER.datenschutzUrl} className="underline text-green-700 hover:text-green-900">
            Datenschutzerklärung
          </a>{' '}
          zu (freiwillig, jederzeit widerrufbar).
        </label>
      </div>

      <button
        type="submit"
        disabled={loading || !form.consent_to_contact}
        className="w-full bg-green-600 text-white rounded-lg py-3 px-6 font-semibold text-sm hover:bg-green-700 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Wird eingereicht...' : 'Report-Interesse anmelden →'}
      </button>
      <p className="text-xs text-center text-gray-400">Kein automatischer Versand · Manuell geprüft · DSGVO-konform</p>
    </form>
  )
}
