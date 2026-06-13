'use client'
/**
 * AgencyPartnerForm.tsx
 *
 * Form for Agency / White-Label partner enquiries.
 * No automatic sending. Save only → Admin inbox.
 */
import { useState } from 'react'
import { COMPLIANCE_DISCLAIMER } from '@/lib/revenue-leads'

const ORG_TYPES = [
  'Recruiting Agency',
  'Language School',
  'Relocation Service Provider',
  'HR Consulting',
  'Education Institution',
  'NGO / Non-Profit',
  'Other',
]

const INTEREST_OPTIONS = [
  { value: 'white_label',         label: 'White-Label Solution' },
  { value: 'matching',            label: 'Talent Matching Integration' },
  { value: 'market_intelligence', label: 'Market Intelligence Reports' },
  { value: 'employer_pipeline',   label: 'Employer Pipeline Access' },
]

export function AgencyPartnerForm() {
  const [form, setForm] = useState({
    organization_name:  '',
    contact_name:       '',
    email:              '',
    country:            '',
    sector:             '',       // Target corridor
    org_type:           '',
    interests:          [] as string[],
    message:            '',
    consent_to_contact: false,
    website:            '', // Honeypot
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
      form.org_type             ? `Organisation type: ${form.org_type}` : '',
      form.interests.length > 0 ? `Interests: ${form.interests.join(', ')}` : '',
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
        setErrors(data.errors ?? [data.error ?? 'Submission error.'])
      } else {
        setSuccess(true)
      }
    } catch {
      setErrors(['Network error. Please try again.'])
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-slate-800 border border-emerald-700/50 rounded-xl p-8 text-center">
        <div className="w-10 h-10 rounded-full bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
          <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Partner enquiry submitted</h3>
        <p className="text-slate-400 text-sm">
          Thank you for your interest. We will review your enquiry and follow up{' '}
          <strong className="text-slate-300">manually</strong>.
        </p>
        <p className="text-slate-500 text-xs mt-3">
          ✓ No automatic contact &nbsp;·&nbsp; ✓ Pilot phase free &nbsp;·&nbsp; ✓ No commitment
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
        <div className="bg-red-950/40 border border-red-700/50 rounded-lg p-4">
          {errors.map((err, i) => (
            <p key={i} className="text-sm text-red-400">⚠ {err}</p>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Organisation <span className="text-red-400">*</span>
          </label>
          <input
            type="text" required
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Talent Ltd"
            value={form.organization_name}
            onChange={e => setForm(f => ({ ...f, organization_name: e.target.value }))}
            maxLength={200}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Contact name <span className="text-red-400">*</span>
          </label>
          <input
            type="text" required
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Anna Smith"
            value={form.contact_name}
            onChange={e => setForm(f => ({ ...f, contact_name: e.target.value }))}
            maxLength={200}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Email <span className="text-red-400">*</span>
        </label>
        <input
          type="email" required
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="anna@talent-agency.com"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Country</label>
          <input
            type="text"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Germany"
            value={form.country}
            onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Target corridor</label>
          <input
            type="text"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. Philippines → DE"
            value={form.sector}
            onChange={e => setForm(f => ({ ...f, sector: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Organisation type</label>
          <select
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={form.org_type}
            onChange={e => setForm(f => ({ ...f, org_type: e.target.value }))}
          >
            <option value="">Select type</option>
            {ORG_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Areas of interest (multiple selection)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {INTEREST_OPTIONS.map(opt => (
            <label
              key={opt.value}
              className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors text-sm ${
                form.interests.includes(opt.value)
                  ? 'bg-indigo-900/30 border-indigo-600/50 text-white'
                  : 'border-slate-700 text-slate-400 hover:border-indigo-700/50'
              }`}
            >
              <input
                type="checkbox"
                className="rounded border-slate-600 bg-slate-800 text-indigo-500"
                checked={form.interests.includes(opt.value)}
                onChange={() => toggleInterest(opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Brief description</label>
        <textarea
          rows={3}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="We are a recruiting agency looking for a white-label solution for the corridor Philippines → Germany..."
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          maxLength={1000}
        />
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-1.5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Notes</p>
        <p className="text-xs text-slate-500">✗ {COMPLIANCE_DISCLAIMER.noAutoContact}</p>
        <p className="text-xs text-slate-500">
          ✗ White-label is a pilot project — no binding contracts in Phase 1.
        </p>
        <p className="text-xs text-slate-500">
          ✓ {COMPLIANCE_DISCLAIMER.gdprNote}{' '}
          <a
            href={COMPLIANCE_DISCLAIMER.datenschutzUrl}
            className="underline text-slate-400 hover:text-slate-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
        </p>
      </div>

      <div className="flex items-start gap-3">
        <input
          type="checkbox" required id="consent_agency"
          className="mt-1 rounded border-slate-600 bg-slate-800 text-indigo-500"
          checked={form.consent_to_contact}
          onChange={e => setForm(f => ({ ...f, consent_to_contact: e.target.checked }))}
        />
        <label htmlFor="consent_agency" className="text-sm text-slate-400">
          <span className="text-red-400">*</span>{' '}
          I agree that CorridorWork may contact me to process this enquiry. I consent to the
          storage of my details in accordance with the{' '}
          <a href={COMPLIANCE_DISCLAIMER.datenschutzUrl} className="underline text-slate-300 hover:text-white">
            Privacy Policy
          </a>{' '}
          (voluntary, revocable at any time).
        </label>
      </div>

      <button
        type="submit"
        disabled={loading || !form.consent_to_contact}
        className="w-full bg-indigo-600 text-white rounded-lg py-3 px-6 font-semibold text-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Submitting…' : 'Request partner pilot →'}
      </button>
      <p className="text-xs text-center text-slate-500">
        Pilot phase · Free · No commitment · No automatic sending
      </p>
    </form>
  )
}
