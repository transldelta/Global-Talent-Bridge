'use client'

/**
 * EmployerIntakeForm — interactive form for /global/employers
 * Client component only (state + fetch). No server-side code.
 */
import { useState } from 'react'
import Link from 'next/link'
import { TALENT_CATEGORIES } from '@/lib/talent-categories'

const URGENCY_OPTIONS = [
  { value: 'immediate',  label: 'Immediately' },
  { value: '1-3months',  label: 'Within 1–3 months' },
  { value: '3-6months',  label: 'Within 3–6 months' },
  { value: 'later',      label: 'Planning for later' },
]

const QUALIFICATION_OPTIONS = [
  { value: 'entry-level',            label: 'Entry-Level' },
  { value: 'skilled-worker',         label: 'Skilled Worker' },
  { value: 'certified-professional', label: 'Certified Professional' },
  { value: 'senior-specialist',      label: 'Senior Specialist' },
  { value: 'regulated-profession',   label: 'Regulated Profession (e.g. nurse, doctor)' },
]

export function EmployerIntakeForm() {
  const [form, setForm] = useState({
    organization_name: '',
    contact_name: '',
    email: '',
    country: '',
    city: '',
    sector: '',
    sectors: [] as string[],
    hiring_need: '',
    target_candidate_regions: '',
    urgency: '',
    qualification_level: '',
    message: '',
    consent_to_contact: false,
    website: '', // honeypot
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function toggleSector(key: string) {
    setForm(prev => ({
      ...prev,
      sectors: prev.sectors.includes(key)
        ? prev.sectors.filter(s => s !== key)
        : [...prev.sectors, key],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/public/global-employer-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source_page: '/global/employers' }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.errors?.join(' ') ?? data.error ?? 'Submission failed.')
        setStatus('error')
      } else {
        setStatus('success')
      }
    } catch {
      setErrorMsg('Network error. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-slate-50 py-20 px-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
            <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Request Received</h2>
          <p className="text-slate-600 mb-2 leading-relaxed">
            Your hiring request has been registered. Our team will review it manually.
          </p>
          <p className="text-sm text-slate-500 mb-7">
            No automatic emails · No payment · No job or visa guarantees · Manual review only
          </p>
          <Link
            href="/strategic-partnership"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-500 transition-colors text-sm"
          >
            Explore Partnership Options
          </Link>
        </div>
      </div>
    )
  }

  // Field styling helpers
  const inputCls = "w-full border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
  const labelCls = "block text-sm font-medium text-slate-700 mb-1.5"

  return (
    <div className="bg-slate-50 py-14 px-6">
      <div className="max-w-3xl mx-auto">

        {/* Section header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Submit workforce demand</h2>
          <p className="text-slate-500 text-sm">
            All submissions are reviewed manually. No automatic matching, no payment, no outreach.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Honeypot */}
          <input type="text" name="website" value={form.website}
            onChange={e => setForm(p => ({ ...p, website: e.target.value }))}
            style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

          {/* Organization */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <h3 className="font-semibold text-slate-900">Organization Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>
                  Organization Name <span className="text-red-400">*</span>
                </label>
                <input type="text" required value={form.organization_name}
                  onChange={e => setForm(p => ({ ...p, organization_name: e.target.value }))}
                  className={inputCls} placeholder="e.g. Sunrise Healthcare GmbH" />
              </div>
              <div>
                <label className={labelCls}>
                  Contact Name <span className="text-red-400">*</span>
                </label>
                <input type="text" required value={form.contact_name}
                  onChange={e => setForm(p => ({ ...p, contact_name: e.target.value }))}
                  className={inputCls} placeholder="Your full name" />
              </div>
              <div>
                <label className={labelCls}>
                  Email <span className="text-red-400">*</span>
                </label>
                <input type="email" required value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className={inputCls} placeholder="you@company.com" />
              </div>
              <div>
                <label className={labelCls}>Country</label>
                <input type="text" value={form.country}
                  onChange={e => setForm(p => ({ ...p, country: e.target.value }))}
                  className={inputCls} placeholder="e.g. Germany, UK, Canada, UAE" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>City / Region</label>
                <input type="text" value={form.city}
                  onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                  className={inputCls} placeholder="e.g. Berlin, London, Toronto" />
              </div>
            </div>
          </div>

          {/* Sectors */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900">Sectors Needed</h3>
              <p className="text-sm text-slate-500 mt-0.5">Select all that apply</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TALENT_CATEGORIES.map(cat => (
                <button
                  type="button"
                  key={cat.sector_key}
                  onClick={() => toggleSector(cat.sector_key)}
                  className={`px-3 py-2.5 rounded-lg border text-sm text-left transition-colors font-medium ${
                    form.sectors.includes(cat.sector_key)
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50'
                  }`}
                >
                  {cat.public_label}
                </button>
              ))}
            </div>
          </div>

          {/* Hiring Details */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <h3 className="font-semibold text-slate-900">Hiring Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Qualification Level</label>
                <select value={form.qualification_level}
                  onChange={e => setForm(p => ({ ...p, qualification_level: e.target.value }))}
                  className={inputCls}>
                  <option value="">Select level…</option>
                  {QUALIFICATION_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Urgency</label>
                <select value={form.urgency}
                  onChange={e => setForm(p => ({ ...p, urgency: e.target.value }))}
                  className={inputCls}>
                  <option value="">Select urgency…</option>
                  {URGENCY_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Target Candidate Regions (optional)</label>
                <input type="text" value={form.target_candidate_regions}
                  onChange={e => setForm(p => ({ ...p, target_candidate_regions: e.target.value }))}
                  className={inputCls} placeholder="e.g. Philippines, India, Morocco, Nigeria" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Hiring Need Description (optional)</label>
                <textarea rows={3} value={form.hiring_need}
                  onChange={e => setForm(p => ({ ...p, hiring_need: e.target.value }))}
                  className={inputCls} placeholder="Briefly describe the role(s) and number of positions" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Additional Message (optional)</label>
                <textarea rows={3} value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  className={inputCls} placeholder="Anything else we should know" />
              </div>
            </div>
          </div>

          {/* Consent */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" required
                checked={form.consent_to_contact}
                onChange={e => setForm(p => ({ ...p, consent_to_contact: e.target.checked }))}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-400"
              />
              <span className="text-sm text-slate-700 leading-relaxed">
                I consent to being contacted regarding this hiring request.
                I understand this is a <strong>manual review process</strong> —
                no automatic emails, no payment, no employment or visa guarantees.{' '}
                <Link href="/legal/datenschutz" className="text-indigo-600 hover:underline" target="_blank">
                  Privacy Policy
                </Link>
              </span>
            </label>
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading' || !form.consent_to_contact}
            className="w-full py-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {status === 'loading' ? 'Submitting…' : 'Submit Workforce Demand'}
          </button>

          <p className="text-xs text-center text-slate-400">
            No automatic outreach · No payment · Admin-reviewed · No employment or visa guarantees
          </p>
        </form>
      </div>
    </div>
  )
}
