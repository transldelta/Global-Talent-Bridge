'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { submitContactAction } from './actions'

const initialState = { success: false, error: undefined }

const INTEREST_OPTIONS = [
  { value: '',              label: '— No specific topic (optional) —' },
  { value: 'pilot_employer', label: 'Employer inquiry' },
  { value: 'candidate',     label: 'Candidate interest' },
  { value: 'partnership',   label: 'Partner inquiry' },
  { value: 'feedback',      label: 'Feedback' },
  { value: 'other',         label: 'General inquiry' },
]

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm"
    >
      {pending ? 'Sending…' : 'Send message →'}
    </button>
  )
}

/**
 * ContactForm — Client Component
 * Reads optional URL parameters (role, interest) for pre-selection from pilot CTAs.
 * Must be wrapped in Suspense (useSearchParams requirement in Next.js 14).
 */
export function ContactForm() {
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get('role') || 'candidate'
  const defaultInterest = searchParams.get('interest') || ''

  const [state, formAction] = useFormState(submitContactAction, initialState)

  return (
    <>
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-4">Contact</h1>
        <p className="text-slate-400 leading-relaxed">
          Questions, feedback or partnership inquiries? Write to us.
          We respond manually — no automated emails.
        </p>
      </div>

      {/* Notice */}
      <div className="mb-8 p-4 bg-slate-800/60 border border-slate-700/60 rounded-xl flex items-start gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-1.5" />
        <p className="text-slate-300 text-sm">
          Your inquiry is stored in our database. We will respond manually by email.
          No automatic replies, no spam.
        </p>
      </div>

      {state.success ? (
        /* Success */
        <div className="bg-emerald-900/20 border border-emerald-700/50 rounded-2xl p-8 text-center">
          <div className="w-8 h-8 rounded-full bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-emerald-300 mb-2">Inquiry submitted</h2>
          <p className="text-emerald-200/70 text-sm mb-2">
            Thank you — your inquiry has been saved.
          </p>
          <p className="text-emerald-200/50 text-xs mb-6">
            We will respond manually by email, typically within a few business days.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm rounded-lg transition-colors"
          >
            Back to homepage
          </Link>
        </div>
      ) : (
        /* Form */
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
          {state.error && (
            <div className="mb-5 p-3 bg-red-900/20 border border-red-700/50 rounded-xl text-red-300 text-sm">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                minLength={2}
                placeholder="Your full name"
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="your@email.com"
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Role + Company */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  I am
                </label>
                <select
                  name="role"
                  defaultValue={defaultRole}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="candidate">Candidate / Professional</option>
                  <option value="employer">Employer / Company</option>
                  <option value="partner">Partner / Organisation</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Company (optional)
                </label>
                <input
                  type="text"
                  name="company_name"
                  placeholder="Company name"
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Topic */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Topic{' '}
                <span className="text-slate-500 font-normal text-xs">(optional)</span>
              </label>
              <select
                name="interest"
                defaultValue={defaultInterest}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
              >
                {INTEREST_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Message <span className="text-red-400">*</span>
              </label>
              <textarea
                name="message"
                required
                minLength={10}
                rows={5}
                placeholder="Your question, feedback or inquiry (min. 10 characters)…"
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            {/* Privacy consent */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                name="consent"
                id="consent"
                required
                value="on"
                className="mt-1 w-4 h-4 rounded border-slate-600 bg-slate-800 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="consent" className="text-slate-400 text-sm leading-relaxed">
                I agree to the{' '}
                <Link href="/legal/datenschutz" className="text-indigo-400 hover:text-indigo-300" target="_blank">
                  Privacy Policy
                </Link>{' '}
                and consent to my inquiry being stored for processing.{' '}
                <span className="text-red-400">*</span>
              </label>
            </div>

            {/* Honeypot — hidden from humans, filled by bots; server silently rejects */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />

            <SubmitButton />
          </form>

          <p className="mt-4 text-center text-xs text-slate-600">
            Your inquiry is stored. No automatic email reply. We respond manually.
          </p>
        </div>
      )}
    </>
  )
}
