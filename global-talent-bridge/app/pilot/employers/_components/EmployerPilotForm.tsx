'use client'
/**
 * EmployerPilotForm.tsx
 *
 * Formular für kostenlose Employer-Pilot-Anfragen.
 * Kein Send-Button für E-Mails. Kein Stripe. Kein automatischer Versand.
 * Nur Speichern → manuell geprüft durch Admin.
 */
import { useState } from 'react'
import { COMPLIANCE_DISCLAIMER } from '@/lib/revenue-leads'

const SECTORS = [
  'Pflege & Gesundheit',
  'Bau & Handwerk',
  'IT & Technologie',
  'Gastronomie & Hotellerie',
  'Logistik & Transport',
  'Landwirtschaft',
  'Produktion & Industrie',
  'Bildung & Soziales',
  'Sonstiges',
]

export function EmployerPilotForm() {
  const [form, setForm] = useState({
    organization_name: '',
    contact_name:      '',
    email:             '',
    sector:            '',
    city:              '',
    country:           '',
    message:           '',
    consent_to_contact: false,
    website:           '', // Honeypot
  })
  const [loading,  setLoading]  = useState(false)
  const [success,  setSuccess]  = useState(false)
  const [errors,   setErrors]   = useState<string[]>([])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors([])
    setLoading(true)

    try {
      const res = await fetch('/api/public/revenue-leads', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ...form, lead_type: 'employer_pilot', source_page: '/pilot/employers' }),
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
        <h3 className="text-xl font-bold text-green-900 mb-2">Pilot-Anfrage eingereicht!</h3>
        <p className="text-green-800 text-sm">
          Danke für Ihr Interesse. Wir prüfen Ihre Anfrage und melden uns <strong>manuell</strong> bei Ihnen.
          Es erfolgt kein automatischer Versand, keine automatische Zahlung.
        </p>
        <p className="text-green-700 text-xs mt-3">
          ✓ Keine automatische Kontaktaufnahme &nbsp;·&nbsp; ✓ Kostenloser Pilot &nbsp;·&nbsp; ✓ Unverbindlich
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot — unsichtbar für Menschen */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <input
          type="text"
          name="website"
          value={form.website}
          onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          {errors.map((err, i) => (
            <p key={i} className="text-sm text-red-700">⚠️ {err}</p>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Firmenname <span className="text-red-500">*</span>
          </label>
          <input
            type="text" required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Mustermann GmbH"
            value={form.organization_name}
            onChange={e => setForm(f => ({ ...f, organization_name: e.target.value }))}
            maxLength={200}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ansprechpartner <span className="text-red-500">*</span>
          </label>
          <input
            type="text" required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Max Mustermann"
            value={form.contact_name}
            onChange={e => setForm(f => ({ ...f, contact_name: e.target.value }))}
            maxLength={200}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          E-Mail <span className="text-red-500">*</span>
        </label>
        <input
          type="email" required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="max@mustermann.de"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        />
        <p className="text-xs text-gray-500 mt-1">Keine automatische E-Mail von uns. Manueller Kontakt nach Prüfung.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Branche</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            value={form.sector}
            onChange={e => setForm(f => ({ ...f, sector: e.target.value }))}
          >
            <option value="">Bitte wählen</option>
            {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stadt</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            placeholder="Berlin"
            value={form.city}
            onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Land</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            placeholder="Deutschland"
            value={form.country}
            onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Personalbedarf (kurz beschreiben)</label>
        <textarea
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          placeholder="Wir suchen 3 Pflegefachkräfte aus Südeuropa für unser Pflegeheim in Berlin..."
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          maxLength={1000}
        />
      </div>

      {/* Compliance Disclaimer */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-1">
        <p className="text-xs text-gray-600 font-semibold uppercase">Wichtige Hinweise</p>
        <p className="text-xs text-gray-500">✗ {COMPLIANCE_DISCLAIMER.noJobGuarantee}</p>
        <p className="text-xs text-gray-500">✗ {COMPLIANCE_DISCLAIMER.noVisaGuarantee}</p>
        <p className="text-xs text-gray-500">✗ {COMPLIANCE_DISCLAIMER.noAutoPayment}</p>
        <p className="text-xs text-gray-500">✓ {COMPLIANCE_DISCLAIMER.gdprNote}</p>
      </div>

      <div className="flex items-start gap-3">
        <input
          type="checkbox" required id="consent"
          className="mt-1 rounded border-gray-300 text-blue-600"
          checked={form.consent_to_contact}
          onChange={e => setForm(f => ({ ...f, consent_to_contact: e.target.checked }))}
        />
        <label htmlFor="consent" className="text-sm text-gray-700">
          <span className="text-red-500">*</span> Ich möchte zum Pilot kontaktiert werden und stimme zu, dass CorridorWork meine Angaben zur Bearbeitung dieser Anfrage speichert (freiwillig, jederzeit widerrufbar).
        </label>
      </div>

      <button
        type="submit"
        disabled={loading || !form.consent_to_contact}
        className="w-full bg-blue-600 text-white rounded-lg py-3 px-6 font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Wird eingereicht...' : 'Pilot anfragen →'}
      </button>
      <p className="text-xs text-center text-gray-400">Kein Abo · Keine Zahlung · Kostenlos · Unverbindlich</p>
    </form>
  )
}
