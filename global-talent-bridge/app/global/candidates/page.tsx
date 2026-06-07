/**
 * app/global/candidates/page.tsx — /global/candidates
 *
 * Global Candidate Interest Intake — Kandidaten weltweit können Interesse anmelden.
 * Public, no auth. Inbound-only. No email, no payment, no job/visa guarantee.
 */
'use client'

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
  { value: 'no',          label: 'No relocation' },
]

export default function GlobalCandidatesPage() {
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-green-200 rounded-2xl p-8 text-center shadow-sm">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Interest Registered</h1>
          <p className="text-gray-600 mb-2">
            Thank you. Your interest has been registered and will be reviewed manually.
          </p>
          <p className="text-sm text-gray-500 mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
            ⚠️ <strong>Important:</strong> This is not a job offer. We cannot guarantee employment,
            visa processing, or any placement. All submissions are reviewed manually.
          </p>
          <Link href="/for-candidates"
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors">
            Learn More →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-900 text-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-sm text-green-300 mb-2">
            <Link href="/" className="hover:underline">CorridorWork</Link>
            {' · '}Global Intake
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">🌍 Global Candidate Interest</h1>
          <p className="text-green-200 text-lg max-w-2xl">
            Register your interest in international work opportunities. We connect qualified
            professionals from worldwide talent corridors with employers globally.
          </p>
          <div className="mt-4 p-3 bg-green-800 border border-green-600 rounded-xl text-sm text-green-100">
            ⚠️ <strong>Important Disclaimer:</strong> Registering interest is voluntary and free.
            This is not a job offer. No visa advice. No job guarantee. No candidate fee.
            All submissions reviewed manually.
          </div>
        </div>
      </div>

      {/* Safety Banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-3 text-sm text-amber-800">
          <span className="text-lg">🛡️</span>
          <span>
            <strong>Safe & Free:</strong> No automatic emails · No fees · No payment required ·
            No job guarantee · No visa guarantee · Manual review only ·{' '}
            <Link href="/legal/datenschutz" className="underline">Privacy Policy</Link>
          </span>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hidden honeypot */}
          <input type="text" name="website" value={form.website}
            onChange={e => setForm(p => ({ ...p, website: e.target.value }))}
            style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

          {/* Personal Info */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h2 className="font-bold text-gray-900 text-lg">Your Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name / Display Name <span className="text-red-500">*</span>
                </label>
                <input type="text" required
                  value={form.display_name}
                  onChange={e => setForm(p => ({ ...p, display_name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Your name (first name only is fine)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input type="email" required
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country of Origin</label>
                <input type="text"
                  value={form.country_of_origin}
                  onChange={e => setForm(p => ({ ...p, country_of_origin: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g. Philippines, India, Nigeria…"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Country / Region</label>
                <input type="text"
                  value={form.target_country}
                  onChange={e => setForm(p => ({ ...p, target_country: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g. Germany, UK, Canada, Australia, UAE…"
                />
              </div>
            </div>
          </div>

          {/* Sector Selection */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h2 className="font-bold text-gray-900 text-lg">Your Field of Work <span className="text-gray-400 font-normal text-sm">(select all that apply)</span></h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TALENT_CATEGORIES.map(cat => (
                <button
                  type="button"
                  key={cat.sector_key}
                  onClick={() => toggleSector(cat.sector_key)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm text-left transition-colors ${
                    form.sectors.includes(cat.sector_key)
                      ? 'bg-green-600 border-green-600 text-white'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-green-300'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span className="truncate">{cat.public_label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Professional Details */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h2 className="font-bold text-gray-900 text-lg">Professional Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                <select
                  value={form.experience_level}
                  onChange={e => setForm(p => ({ ...p, experience_level: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select experience…</option>
                  {EXPERIENCE_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Relocation / Remote</label>
                <select
                  value={form.relocation_readiness}
                  onChange={e => setForm(p => ({ ...p, relocation_readiness: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select…</option>
                  {RELOCATION_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Languages (optional)</label>
                <input type="text"
                  value={form.languages}
                  onChange={e => setForm(p => ({ ...p, languages: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g. English B2, Arabic native, German A2…"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications (optional)</label>
                <input type="text"
                  value={form.qualifications}
                  onChange={e => setForm(p => ({ ...p, qualifications: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g. BSc Nursing, 5yr exp, BLS certified…"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Message (optional)</label>
                <textarea rows={3}
                  value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Anything else you would like us to know…"
                />
              </div>
            </div>
          </div>

          {/* Consent */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" required
                checked={form.consent_to_contact}
                onChange={e => setForm(p => ({ ...p, consent_to_contact: e.target.checked }))}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-green-600"
              />
              <span className="text-sm text-gray-700">
                <strong>I voluntarily register my interest</strong> and consent to being contacted.
                I understand: <strong>No job guarantee. No visa guarantee. No automatic placement.
                No candidate fee. Free of charge.</strong> This is a manual review process.{' '}
                <Link href="/legal/datenschutz" className="text-blue-600 underline" target="_blank">
                  Privacy Policy
                </Link>
              </span>
            </label>
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          <button type="submit" disabled={status === 'loading' || !form.consent_to_contact}
            className="w-full py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg">
            {status === 'loading' ? 'Submitting…' : '🌍 Register My Interest (Free)'}
          </button>

          <p className="text-xs text-center text-gray-400">
            Free · No automatic outreach · No payment · No job guarantee · No visa guarantee · Manual review
          </p>
        </form>
      </div>
    </div>
  )
}
