'use client'

/**
 * CandidateIntakeForm — interactive form for /global/candidates
 * Client component only (state + fetch). No server-side code.
 */
import { useState } from 'react'
import Link from 'next/link'
import { TALENT_CATEGORIES } from '@/lib/talent-categories'

const EXPERIENCE_OPTIONS = [
  { value: 'entry-level', label: 'Entry-Level (0–1 year)' },
  { value: 'junior',      label: 'Junior (1–3 years)' },
  { value: 'mid-level',   label: 'Mid-Level (3–6 years)' },
  { value: 'senior',      label: 'Senior (6–10 years)' },
  { value: 'specialist',  label: 'Specialist / Expert (10+ years)' },
]

const RELOCATION_OPTIONS = [
  { value: 'yes',         label: 'Yes, ready to relocate' },
  { value: 'flexible',    label: 'Flexible / Open to discuss' },
  { value: 'remote-only', label: 'Remote only' },
  { value: 'no',          label: 'Not at this time' },
]

export function CandidateIntakeForm() {
  const [form, setForm] = useState({
    display_name: '',
    email: '',
    country_of_origin: '',
    target_country: '',
    sector: '',
    sectors: [] as string[],
    experience_level: '',
    languages: '',
    qualifications: '',
    relocation_readiness: '',
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
      const res = await fetch('/api/public/candidate-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source_page: '/global/candidates' }),
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
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Interest Registered</h2>
          <p className="text-slate-600 mb-2 leading-relaxed">
            Your interest has been registered and will be reviewed manually.
          </p>
          <p className="text-sm text-slate-500 mb-7 leading-relaxed">
            This is not a job offer. We cannot guarantee employment, visa processing,
            or any placement. All submissions are reviewed manually.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-500 transition-colors text-sm"
          >
            Back to CorridorWork
          </Link>
        </div>
      </div>
    )
  }

  const inputCls = "w-full border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
  const labelCls = "block text-sm font-medium text-slate-700 mb-1.5"

  return (
    <div className="bg-slate-50 py-14 px-6">
      <div className="max-w-3xl mx-auto">

        {/* Safety note — calm, not alarming */}
        <div className="mb-8 p-4 bg-white border border-slate-200 rounded-xl">
          <p className="text-sm text-slate-500 leading-relaxed">
            <strong className="text-slate-700">This is an interest form, not a job offer or visa service.</strong>{' '}
            Registering is voluntary and free. No job guarantee. No visa guidance.
            No candidate fee. All submissions are reviewed manually.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Submit candidate interest</h2>
          <p className="text-slate-500 text-sm">
            Share your background and the sectors and regions you are interested in.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Honeypot */}
          <input type="text" name="website" value={form.website}
            onChange={e => setForm(p => ({ ...p, website: e.target.value }))}
            style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

          {/* Personal Info */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <h3 className="font-semibold text-slate-900">Your Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>
                  Name / Display Name <span className="text-red-400">*</span>
                </label>
                <input type="text" required value={form.display_name}
                  onChange={e => setForm(p => ({ ...p, display_name: e.target.value }))}
                  className={inputCls} placeholder="Your name (first name is fine)" />
              </div>
              <div>
                <label className={labelCls}>
                  Email <span className="text-red-400">*</span>
                </label>
                <input type="email" required value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className={inputCls} placeholder="your@email.com" />
              </div>
              <div>
                <label className={labelCls}>Country of Origin</label>
                <input type="text" value={form.country_of_origin}
                  onChange={e => setForm(p => ({ ...p, country_of_origin: e.target.value }))}
                  className={inputCls} placeholder="e.g. Philippines, India, Nigeria" />
              </div>
              <div>
                <label className={labelCls}>Target Country / Region</label>
                <input type="text" value={form.target_country}
                  onChange={e => setForm(p => ({ ...p, target_country: e.target.value }))}
                  className={inputCls} placeholder="e.g. Germany, UK, Canada, Australia" />
              </div>
            </div>
          </div>

          {/* Sector Selection */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900">Your Field of Work</h3>
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
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50'
                  }`}
                >
                  {cat.public_label}
                </button>
              ))}
            </div>
          </div>

          {/* Professional Details */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <h3 className="font-semibold text-slate-900">Professional Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Experience Level</label>
                <select value={form.experience_level}
                  onChange={e => setForm(p => ({ ...p, experience_level: e.target.value }))}
                  className={inputCls}>
                  <option value="">Select experience…</option>
                  {EXPERIENCE_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Relocation / Remote</label>
                <select value={form.relocation_readiness}
                  onChange={e => setForm(p => ({ ...p, relocation_readiness: e.target.value }))}
                  className={inputCls}>
                  <option value="">Select…</option>
                  {RELOCATION_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Languages (optional)</label>
                <input type="text" value={form.languages}
                  onChange={e => setForm(p => ({ ...p, languages: e.target.value }))}
                  className={inputCls} placeholder="e.g. English B2, Arabic native, German A2" />
              </div>
              <div>
                <label className={labelCls}>Qualifications (optional)</label>
                <input type="text" value={form.qualifications}
                  onChange={e => setForm(p => ({ ...p, qualifications: e.target.value }))}
                  className={inputCls} placeholder="e.g. BSc Nursing, 5yr exp, BLS certified" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Additional Message (optional)</label>
                <textarea rows={3} value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  className={inputCls} placeholder="Anything else you would like us to know" />
              </div>
            </div>
          </div>

          {/* Consent */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" required
                checked={form.consent_to_contact}
                onChange={e => setForm(p => ({ ...p, consent_to_contact: e.target.checked }))}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-400"
              />
              <span className="text-sm text-slate-700 leading-relaxed">
                I voluntarily register my interest and consent to being contacted.
                I understand: <strong>no employment guarantee, no visa guidance, no automatic placement,
                no candidate fee</strong>. This is a manual review process.{' '}
                <Link href="/legal/datenschutz" className="text-emerald-600 hover:underline" target="_blank">
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
            className="w-full py-4 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {status === 'loading' ? 'Submitting…' : 'Submit Candidate Interest'}
          </button>

          <p className="text-xs text-center text-slate-400">
            No automatic outreach · No payment · No employment or visa guarantee · Manual review
          </p>
        </form>
      </div>
    </div>
  )
}
