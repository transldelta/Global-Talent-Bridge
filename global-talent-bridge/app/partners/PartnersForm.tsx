/**
 * app/partners/PartnersForm.tsx — client component
 * CorridorWork partner interest form — submits to /api/public/revenue-leads (lead_type: agency_partner)
 * No email sending · No Stripe · Manual review only · GDPR-compliant
 */
'use client'
import { useState } from 'react'
import { COMPLIANCE_DISCLAIMER } from '@/lib/revenue-leads'

const ORG_TYPES = [
  'Recruiting Agency',
  'Language School / Education Provider',
  'Relocation Services',
  'HR Consulting',
  'B2B Platform',
  'Other B2B Partner',
]

const INTEREST_OPTIONS = [
  { value: 'white_label',       label: 'White-Label Integration' },
  { value: 'partnership',       label: 'Operational Partnership' },
  { value: 'licensing',         label: 'Licensing / API Access' },
  { value: 'market_intelligence', label: 'Market Intelligence' },
]

export function PartnersForm() {
  const [form, setForm] = useState({
    organization_name: '',
    contact_name:      '',
    email:             '',
    country:           '',
    org_type:          '',
    interest_type:     '',
    message:           '',
    consent:           false,
    website:           '', // honeypot
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.consent) { setErrMsg('Please accept the consent statement to continue.'); return }
    setStatus('loading'); setErrMsg('')
    try {
      const res = await fetch('/api/public/revenue-leads', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_type:          'agency_partner',
          organization_name:  form.organization_name,
          contact_name:       form.contact_name,
          email:              form.email,
          country:            form.country,
          sector:             form.org_type,
          interest_type:      form.interest_type || undefined,
          message:            form.message,
          consent_to_contact: form.consent,
          source_page:        '/partners',
          website:            form.website, // honeypot
        }),
      })
      const data = await res.json()
      if (!res.ok) { setErrMsg(data.error ?? 'Submission failed. Please try again.'); setStatus('error'); return }
      setStatus('success')
    } catch {
      setErrMsg('Network error. Please try again.'); setStatus('error')
    }
  }

  return (
    <section className="bg-slate-50 px-6 py-14 border-t border-slate-200">
      <div className="max-w-2xl mx-auto">
        <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-2">
          Partner Interest
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Register your interest</h2>
        <p className="text-slate-500 text-sm mb-8">
          Free and non-binding. No automatic emails. Manual review only. Submitted via secure form.
        </p>

        {status === 'success' ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-emerald-900 font-bold text-lg mb-2">Interest registered</h3>
            <p className="text-slate-600 text-sm">
              Your submission has been saved. Our team will review it manually —
              no automatic emails, no automatic outreach.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Honeypot */}
            <input
              type="text"
              name="website"
              value={form.website}
              onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Organisation *</label>
                <input
                  required
                  value={form.organization_name}
                  onChange={e => setForm(f => ({ ...f, organization_name: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  placeholder="Your organisation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact name *</label>
                <input
                  required
                  value={form.contact_name}
                  onChange={e => setForm(f => ({ ...f, contact_name: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  placeholder="Your name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  placeholder="name@organisation.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                <input
                  value={form.country}
                  onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  placeholder="e.g. Germany"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Organisation type</label>
                <select
                  value={form.org_type}
                  onChange={e => setForm(f => ({ ...f, org_type: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value="">Select type…</option>
                  {ORG_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Interest type</label>
                <select
                  value={form.interest_type}
                  onChange={e => setForm(f => ({ ...f, interest_type: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value="">Select…</option>
                  {INTEREST_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
              <textarea
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                placeholder="What interests you? How could we work together?"
              />
            </div>

            {/* Consent */}
            <div className="bg-slate-100 rounded-lg p-4 border border-slate-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  required
                  type="checkbox"
                  name="consent_to_contact"
                  checked={form.consent}
                  onChange={e => setForm(f => ({ ...f, consent: e.target.checked }))}
                  className="mt-1 h-4 w-4 rounded border-slate-400 text-indigo-600 flex-shrink-0"
                />
                <span className="text-slate-600 text-xs leading-relaxed">
                  {COMPLIANCE_DISCLAIMER.consentText}{' '}
                  <a href="/legal/datenschutz" className="underline text-indigo-600">Privacy Policy</a>. *
                </span>
              </label>
            </div>

            {errMsg && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                {errMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {status === 'loading' ? 'Submitting…' : 'Submit Partner Interest'}
            </button>

            <div className="flex flex-wrap gap-3 justify-center text-xs text-slate-500 pt-1">
              <span>No automatic emails</span>
              <span>·</span>
              <span>No payment processing active</span>
              <span>·</span>
              <span>GDPR-compliant</span>
              <span>·</span>
              <span>Manual review</span>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
