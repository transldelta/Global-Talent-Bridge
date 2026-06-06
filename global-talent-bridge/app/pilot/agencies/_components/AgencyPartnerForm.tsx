'use client'
/**
 * AgencyPartnerForm.tsx
 *
 * Formular für Agency / White-Label Partner-Anfragen.
 * Kein automatischer Versand. Nur speichern → Admin-Inbox.
 */
import { useState } from 'react'
import { COMPLIANCE_DISCLAIMER } from '@/lib/revenue-leads'

const ORG_TYPES = [
  'Recruiting-Agentur',
  'Sprachschule',
  'Relocation-Dienstleister',
  'HR-Beratung',
  'Bildungseinrichtung',
  'NGO / Verein',
  'Sonstiges',
]

const INTEREST_OPTIONS = [
  { value: 'white_label',        label: 'White-Label Lösung' },
  { value: 'matching',           label: 'Talent-Matching Integration' },
  { value: 'market_intelligence',label: 'Market Intelligence Reports' },
  { value: 'employer_pipeline',  label: 'Employer Pipeline Zugang' },
]

export function AgencyPartnerForm() {
  const [form, setForm] = useState({
    organization_name: '',
    contact_name:      '',
    email:             '',
    country:           '',
    sector:            '',       // Zielkorridor
    org_type:          '',
    interests:         [] as string[],
    message:           '',
    consent_to_contact: false,
    website:           '', // Honeypot
  })
  const [loading, setLoading]  = useState(false)
  const [success, setSuccess]  = useState(false)
  const [errors,  setErrors]   = useState<string[]>([])

  function toggleInterest(val: string) {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(val)
        ? f.interests.filter(i => i !== val)
        : [...f.interests, val],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors([])
    setLoading(true)

    const messageWithInterests = [
      form.message,
      form.org_type ? `Organisation: ${form.org_type}` : '',
      form.interests.length > 0 ? `Interesse: ${form.interests.join(', ')}` : '',
    ].filter(Boolean).join(' | ')

    try {
      const res = await fetch('/api/public/revenue-leads', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          lead_type:          'agency_partner',
          organization_name:  form.organization_name,
          contact_name:       form.contact_name,
          email:              form.email,
          country:            form.country,
          sector:             form.sector,
          message:            messageWithInterests,
          consent_to_contact: form.consent_to_contact,
          source_page:        '/pilot/agencies',
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
        <h3 className="text-xl font-bold text-green-900 mb-2">Partner-Anfrage eingereicht!</h3>
        <p className="text-green-800 text-sm">
          Danke für Ihr Interesse. Wir prüfen Ihre Anfrage und melden uns <strong>manuell</strong> bei Ihnen.
        </p>
        <p className="text-green-700 text-xs mt-3">
          ✓ Keine automatische Kontaktaufnahme &nbsp;·&nbsp; ✓ Pilotphase kostenlos &nbsp;·&nbsp; ✓ Unverbindlich
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
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
            placeholder="Talent GmbH"
            value={form.organization_name}
            onChange={e => setForm(f => ({ ...f, organization_name: e.target.value }))}
            maxLength={200}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ansprechpartner <span className="text-red-500">*</span></label>
          <input
            type="text" required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
            placeholder="Anna Müller"
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
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
          placeholder="anna@talent-gmbh.de"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Land</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="Deutschland"
            value={form.country}
            onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Zielkorridor</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="z.B. Philippinen → DE"
            value={form.sector}
            onChange={e => setForm(f => ({ ...f, sector: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Art der Organisation</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            value={form.org_type}
            onChange={e => setForm(f => ({ ...f, org_type: e.target.value }))}
          >
            <option value="">Bitte wählen</option>
            {ORG_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Interesse (Mehrfachauswahl)</label>
        <div className="grid grid-cols-2 gap-2">
          {INTEREST_OPTIONS.map(opt => (
            <label key={opt.value} className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors text-sm ${form.interests.includes(opt.value) ? 'bg-purple-50 border-purple-300' : 'border-gray-200 hover:border-purple-200'}`}>
              <input
                type="checkbox"
                className="rounded border-gray-300 text-purple-600"
                checked={form.interests.includes(opt.value)}
                onChange={() => toggleInterest(opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Kurze Beschreibung</label>
        <textarea
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
          placeholder="Wir sind eine Recruiting-Agentur und suchen eine White-Label-Lösung für den Korridor Philippinen → Deutschland..."
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          maxLength={1000}
        />
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-1">
        <p className="text-xs text-gray-600 font-semibold uppercase">Hinweise</p>
        <p className="text-xs text-gray-500">✗ {COMPLIANCE_DISCLAIMER.noAutoContact}</p>
        <p className="text-xs text-gray-500">✗ White-Label ist Pilotprojekt — keine verbindlichen Verträge in Phase 1.</p>
        <p className="text-xs text-gray-500">✓ {COMPLIANCE_DISCLAIMER.gdprNote}</p>
      </div>

      <div className="flex items-start gap-3">
        <input
          type="checkbox" required id="consent_agency"
          className="mt-1 rounded border-gray-300 text-purple-600"
          checked={form.consent_to_contact}
          onChange={e => setForm(f => ({ ...f, consent_to_contact: e.target.checked }))}
        />
        <label htmlFor="consent_agency" className="text-sm text-gray-700">
          <span className="text-red-500">*</span> Ich möchte zum Partner-Pilot kontaktiert werden und stimme zu, dass CorridorWork meine Angaben verarbeitet (freiwillig, widerrufbar).
        </label>
      </div>

      <button
        type="submit"
        disabled={loading || !form.consent_to_contact}
        className="w-full bg-purple-600 text-white rounded-lg py-3 px-6 font-semibold text-sm hover:bg-purple-700 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Wird eingereicht...' : 'Partner-Pilot anfragen →'}
      </button>
      <p className="text-xs text-center text-gray-400">Pilotphase · Kostenlos · Unverbindlich · Kein automatischer Versand</p>
    </form>
  )
}
