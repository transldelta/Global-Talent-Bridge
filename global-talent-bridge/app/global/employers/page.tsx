/**
 * app/global/employers/page.tsx — /global/employers
 *
 * Global Employer Intake — Arbeitgeber weltweit können Bedarf melden.
 * Public, no auth. Inbound-only. No email, no payment, no guarantee.
 */
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TALENT_CATEGORIES } from '@/lib/talent-categories'

const URGENCY_OPTIONS = [
  { value: 'immediate',  label: 'Immediately / Sofort' },
  { value: '1-3months',  label: 'Within 1–3 months' },
  { value: '3-6months',  label: 'Within 3–6 months' },
  { value: 'later',      label: 'Planning for later' },
]

const QUALIFICATION_OPTIONS = [
  { value: 'entry-level',           label: 'Entry-Level' },
  { value: 'skilled-worker',        label: 'Skilled Worker' },
  { value: 'certified-professional', label: 'Certified Professional' },
  { value: 'senior-specialist',     label: 'Senior Specialist' },
  { value: 'regulated-profession',  label: 'Regulated Profession (e.g. nurse, doctor)' },
]

export default function GlobalEmployersPage() {
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-green-200 rounded-2xl p-8 text-center shadow-sm">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Request Received</h1>
          <p className="text-gray-600 mb-4">
            Thank you. Your hiring request has been registered. Our team will review it manually.
            No automatic emails, no payment, no guarantees.
          </p>
          <Link href="/strategic-partnership"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
            Explore Partnership Options →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-900 text-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-sm text-blue-300 mb-2">
            <Link href="/" className="hover:underline">CorridorWork</Link>
            {' · '}Global Intake
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">🌍 Global Employer Intake</h1>
          <p className="text-blue-200 text-lg max-w-2xl">
            Register your global hiring need. We match qualified talent from worldwide corridors
            with employers in any country. Inbound-only — no cold calls, no spam.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {['🏥 Healthcare', '💻 IT', '🏗️ Construction', '🚚 Logistics', '⚙️ Engineering', '+ 16 more sectors'].map(tag => (
              <span key={tag} className="px-3 py-1 bg-blue-800 border border-blue-600 rounded-full text-sm text-blue-200">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Safety Banner */}
      <div className="bg-green-50 border-b border-green-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-3 text-sm text-green-800">
          <span className="text-lg">🛡️</span>
          <span>
            <strong>Safe & Manual:</strong> No automatic emails · No automatic matching · No payment required ·
            All requests reviewed manually · No job or visa guarantees ·{' '}
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

          {/* Organization Info */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h2 className="font-bold text-gray-900 text-lg">Organization Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Name <span className="text-red-500">*</span>
                </label>
                <input type="text" required
                  value={form.organization_name}
                  onChange={e => setForm(p => ({ ...p, organization_name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Sunrise Healthcare GmbH"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Name <span className="text-red-500">*</span>
                </label>
                <input type="text" required
                  value={form.contact_name}
                  onChange={e => setForm(p => ({ ...p, contact_name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input type="email" required
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="you@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input type="text"
                  value={form.country}
                  onChange={e => setForm(p => ({ ...p, country: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Germany, UK, Canada, UAE…"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City / Region</label>
                <input type="text"
                  value={form.city}
                  onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Berlin, London, Toronto…"
                />
              </div>
            </div>
          </div>

          {/* Sector Selection */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h2 className="font-bold text-gray-900 text-lg">Sectors Needed <span className="text-gray-400 font-normal text-sm">(select all that apply)</span></h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TALENT_CATEGORIES.map(cat => (
                <button
                  type="button"
                  key={cat.sector_key}
                  onClick={() => toggleSector(cat.sector_key)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm text-left transition-colors ${
                    form.sectors.includes(cat.sector_key)
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span className="truncate">{cat.public_label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hiring Details */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h2 className="font-bold text-gray-900 text-lg">Hiring Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qualification Level Needed</label>
                <select
                  value={form.qualification_level}
                  onChange={e => setForm(p => ({ ...p, qualification_level: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select level…</option>
                  {QUALIFICATION_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
                <select
                  value={form.urgency}
                  onChange={e => setForm(p => ({ ...p, urgency: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select urgency…</option>
                  {URGENCY_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Candidate Regions (optional)</label>
                <input type="text"
                  value={form.target_candidate_regions}
                  onChange={e => setForm(p => ({ ...p, target_candidate_regions: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Philippines, India, Morocco, Nigeria…"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Hiring Need Description (optional)</label>
                <textarea rows={3}
                  value={form.hiring_need}
                  onChange={e => setForm(p => ({ ...p, hiring_need: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Briefly describe the role(s) and number of positions…"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Message (optional)</label>
                <textarea rows={3}
                  value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Anything else we should know…"
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
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              <span className="text-sm text-gray-700">
                <strong>I consent to being contacted</strong> regarding this hiring request.
                I understand this is a manual review process — no automatic emails, no payment,
                no job or visa guarantees.{' '}
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
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg">
            {status === 'loading' ? 'Submitting…' : '🌍 Submit Hiring Request'}
          </button>

          <p className="text-xs text-center text-gray-400">
            No automatic outreach · No payment · Manual review only · No job or visa guarantees
          </p>
        </form>
      </div>
    </div>
  )
}
