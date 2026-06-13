'use client'
/**
 * MarketIntelForm.tsx
 *
 * Form for Market Intelligence report interest.
 * No personal candidate data. Aggregated insights only.
 */
import { useState } from 'react'
import { COMPLIANCE_DISCLAIMER } from '@/lib/revenue-leads'

const CORRIDORS = [
  'Philippines → Germany',
  'Morocco → Germany / France',
  'Tunisia → Germany',
  'India → Germany / UK',
  'Serbia → Germany / Austria',
  'Bosnia → Germany / Austria',
  'Georgia → Germany',
  'Kenya → Germany',
  'Brazil → Germany / Portugal',
  'Mexico → Germany / USA',
]

export function MarketIntelForm() {
  const [form, setForm] = useState({
    organization_name:  '',
    contact_name:       '',
    email:              '',
    country:            '',
    sector:             '',
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
        <h3 className="text-lg font-bold text-white mb-2">Interest registered</h3>
        <p className="text-slate-400 text-sm">
          Thank you. We will follow up{' '}
          <strong className="text-slate-300">manually</strong> once reports are available.
          No automatic emails.
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
            placeholder="Company / Organisation"
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
            placeholder="Your name"
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
          placeholder="you@company.com"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Country / Region</label>
          <input
            type="text"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Germany"
            value={form.country}
            onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Corridor of interest</label>
          <select
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={form.sector}
            onChange={e => setForm(f => ({ ...f, sector: e.target.value }))}
          >
            <option value="">Select corridor</option>
            {CORRIDORS.map(c => <option key={c} value={c}>{c}</option>)}
            <option value="Other / Multiple">Other / Multiple</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          What would you like to know?
        </label>
        <textarea
          rows={3}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="We are interested in demand data for healthcare, corridor Philippines → Germany..."
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          maxLength={1000}
        />
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-1.5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
          What Market Intelligence does NOT include
        </p>
        <p className="text-xs text-slate-500">✗ No personal candidate data</p>
        <p className="text-xs text-slate-500">✗ No candidate lists</p>
        <p className="text-xs text-slate-500">✗ No individual profiles</p>
        <p className="text-xs text-slate-500">✓ Aggregated, anonymised market data only</p>
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
          type="checkbox" required id="consent_intel"
          className="mt-1 rounded border-slate-600 bg-slate-800 text-indigo-500"
          checked={form.consent_to_contact}
          onChange={e => setForm(f => ({ ...f, consent_to_contact: e.target.checked }))}
        />
        <label htmlFor="consent_intel" className="text-sm text-slate-400">
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
        {loading ? 'Submitting…' : 'Register report interest →'}
      </button>
      <p className="text-xs text-center text-slate-500">
        No automatic sending · Manually reviewed · GDPR-compliant
      </p>
    </form>
  )
}
