'use client'

/**
 * app/admin/contact-copilot/_components/ContactCopilotClient.tsx
 *
 * Approval-Based Contact Copilot — prepares contact, generates message,
 * provides mailto link and autofill helper.
 *
 * SAFETY:
 * - No automatic sending
 * - No send button
 * - No form auto-submission of any kind
 * - No email automation
 * - No scraping
 * - Human approval required at every step
 */

import { useState } from 'react'
import Link from 'next/link'
import {
  CONTACT_ROUTES,
  CONTACT_STATUS_OPTIONS,
  APPROVAL_CHECKLIST,
  SENDER,
  generateMessage,
  generateMailtoLink,
  generateAutofillSnippet,
} from '@/lib/contact-copilot'
import type { ContactRoute, ContactStatus, ContactTarget } from '@/lib/contact-copilot'

// ── Copy Button ───────────────────────────────────────────────────────────────

function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  async function handleCopy() {
    try { await navigator.clipboard.writeText(text) } catch {
      const el = document.createElement('textarea')
      el.value = text; document.body.appendChild(el); el.select()
      document.execCommand('copy'); document.body.removeChild(el)
    }
    setCopied(true); setTimeout(() => setCopied(false), 2500)
  }
  return (
    <button
      onClick={handleCopy}
      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors shrink-0 ${
        copied ? 'bg-green-700 text-green-100' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
      }`}
    >
      {copied ? '✅ Copied' : `📋 ${label}`}
    </button>
  )
}

// ── Field Row ─────────────────────────────────────────────────────────────────

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2 border-b border-gray-800 last:border-0">
      <div className="min-w-0">
        <div className="text-xs text-gray-500 mb-0.5">{label}</div>
        <div className="text-sm text-white font-mono break-all">{value}</div>
      </div>
      <CopyButton text={value} />
    </div>
  )
}

// ── Step header ───────────────────────────────────────────────────────────────

function StepHeader({ n, title, active }: { n: number; title: string; active: boolean }) {
  return (
    <div className={`flex items-center gap-3 mb-4 ${active ? '' : 'opacity-50'}`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
        active ? 'bg-indigo-700 text-white' : 'bg-gray-700 text-gray-400'
      }`}>{n}</div>
      <h2 className="text-base font-semibold text-white">{title}</h2>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function ContactCopilotClient() {

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1)

  // Step 1
  const [route, setRoute] = useState<ContactRoute>('language_school')

  // Step 2 — target data
  const [target, setTarget] = useState<ContactTarget>({
    companyName:    '',
    website:        '',
    contactPageUrl: '',
    contactEmail:   '',
    sector:         '',
    country:        '',
    contactPerson:  '',
    notes:          '',
  })

  // Step 3 — generated message
  const generated = generateMessage(route, target)
  const mailtoLink = generateMailtoLink(target.contactEmail, generated.subject, generated.body)
  const autofillSnippet = generateAutofillSnippet(target, generated.subject, generated.body)

  // Step 5 — approval checklist + status
  const [checks, setChecks] = useState<Record<string, boolean>>({})
  const [status, setStatus] = useState<ContactStatus>('draft_prepared')

  const allChecked = APPROVAL_CHECKLIST.every((c) => checks[c.key])

  function toggleCheck(key: string) {
    setChecks((p) => ({ ...p, [key]: !p[key] }))
  }

  function updateTarget(field: keyof ContactTarget, value: string) {
    setTarget((p) => ({ ...p, [field]: value }))
  }

  const routeConfig = CONTACT_ROUTES.find((r) => r.value === route)!
  const canAdvanceStep2 = target.companyName.trim().length > 0

  return (
    <div className="space-y-8">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-white">Contact Copilot</h1>
        <p className="text-gray-400 text-sm mt-1">
          Prepares messages and contact helpers — manual send only.
          Nothing is sent automatically.
        </p>
      </div>

      {/* ── Safety banner ───────────────────────────────────────────────── */}
      <div className="bg-slate-900 border border-slate-700 rounded-xl px-5 py-3">
        <div className="flex flex-wrap gap-x-6 gap-y-1">
          {[
            'No automatic sending',
            'No send button',
            'No scraping',
            'Manual send only',
            'Review before sending',
            'Screenshot approval',
          ].map((item) => (
            <span key={item} className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="text-green-500">✓</span> {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Step progress ────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3">
        {([
          [1, 'Select route'],
          [2, 'Enter target'],
          [3, 'Review message'],
          [4, 'Prepare options'],
          [5, 'Approval checklist'],
        ] as [number, string][]).map(([n, label]) => (
          <div key={n} className={`flex items-center gap-1.5 text-xs ${step === n ? 'text-white font-semibold' : step > n ? 'text-green-400' : 'text-gray-600'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
              step > n ? 'bg-green-700 text-white' : step === n ? 'bg-indigo-700 text-white' : 'bg-gray-800 text-gray-600'
            }`}>{step > n ? '✓' : n}</span>
            {label}
          </div>
        ))}
      </div>

      {/* ── STEP 1 — Select route ────────────────────────────────────────── */}
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
        <StepHeader n={1} title="Select route" active={step >= 1} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CONTACT_ROUTES.map((r) => (
            <button
              key={r.value}
              onClick={() => { setRoute(r.value); if (step < 2) setStep(2) }}
              className={`text-left p-4 rounded-xl border transition-colors ${
                route === r.value
                  ? 'bg-indigo-900/30 border-indigo-700/60 text-white'
                  : 'bg-gray-800/40 border-gray-700 text-gray-400 hover:bg-gray-800/70'
              }`}
            >
              <div className={`text-sm font-semibold mb-0.5 ${route === r.value ? 'text-indigo-300' : 'text-white'}`}>
                {r.label}
              </div>
              <div className="text-xs text-gray-500">{r.desc}</div>
            </button>
          ))}
        </div>
        {step === 1 && (
          <button
            onClick={() => setStep(2)}
            className="mt-4 w-full py-2.5 bg-indigo-700 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Continue with: {routeConfig.label} →
          </button>
        )}
      </div>

      {/* ── STEP 2 — Enter target ────────────────────────────────────────── */}
      {step >= 2 && (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-4">
          <StepHeader n={2} title="Enter target manually" active={step >= 2} />

          <div className="bg-blue-900/10 border border-blue-800/30 rounded-xl p-3 text-xs text-blue-300/70">
            No automatic search. No scraping. Paste URLs from your own browser research.
            The contact email field is optional — leave blank to use the mailto without a recipient.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {([
              ['companyName',    'Company name *',          'e.g. Sprache & Beruf GmbH',        false],
              ['contactEmail',   'Contact email (optional)', 'e.g. info@sprachschule.de',        false],
              ['sector',         'Sector',                  'e.g. Language training / Healthcare', false],
              ['country',        'Country',                 'e.g. Germany',                     false],
              ['website',        'Website URL',             'https://…',                        false],
              ['contactPageUrl', 'Contact page URL',        'https://…/contact',                false],
              ['contactPerson',  'Contact person (optional)', 'e.g. Dr. Müller',                false],
            ] as [keyof ContactTarget, string, string, boolean][]).map(([field, label, placeholder]) => (
              <div key={field}>
                <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
                <input
                  value={target[field]}
                  onChange={(e) => updateTarget(field, e.target.value)}
                  placeholder={placeholder}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Internal notes</label>
            <textarea
              value={target.notes}
              onChange={(e) => updateTarget('notes', e.target.value)}
              rows={2}
              placeholder="How did you find this contact? Any context? (internal only, not sent)"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <button
            onClick={() => setStep(3)}
            disabled={!canAdvanceStep2}
            className="w-full py-2.5 bg-indigo-700 hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Generate message →
          </button>
        </div>
      )}

      {/* ── STEP 3 — Review message ──────────────────────────────────────── */}
      {step >= 3 && (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-4">
          <StepHeader n={3} title="Review generated message" active={step >= 3} />

          <div className="bg-yellow-900/20 border border-yellow-800/40 rounded-xl p-3 text-xs text-yellow-300/80">
            Read carefully before proceeding. This message will not be sent automatically.
            You approve it in Step 5 before sending manually.
          </div>

          {/* Subject */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Subject</span>
              <CopyButton text={generated.subject} label="Copy subject" />
            </div>
            <div className="bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white font-medium">
              {generated.subject}
            </div>
          </div>

          {/* Body */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Message</span>
              <CopyButton text={generated.body} label="Copy message" />
            </div>
            <pre className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 text-sm text-gray-200 whitespace-pre-wrap font-sans leading-relaxed">
              {generated.body}
            </pre>
          </div>

          {/* Sender info */}
          <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1">Signed as:</p>
            <p className="text-sm text-white font-medium">{SENDER.name} · {SENDER.website}</p>
          </div>

          <button
            onClick={() => setStep(4)}
            className="w-full py-2.5 bg-indigo-700 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Prepare sending options →
          </button>
        </div>
      )}

      {/* ── STEP 4 — Prepare options ─────────────────────────────────────── */}
      {step >= 4 && (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-5">
          <StepHeader n={4} title="Prepare options — manual send only" active={step >= 4} />

          <div className="bg-green-900/10 border border-green-800/30 rounded-xl p-3 text-xs text-green-300/70">
            No send button. Nothing is sent automatically.
            Choose how you want to prepare and send manually.
          </div>

          {/* Option A — Copy message */}
          <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-900/50 text-blue-300 text-xs font-bold flex items-center justify-center shrink-0">A</span>
              <h3 className="text-sm font-semibold text-white">Copy message</h3>
            </div>
            <p className="text-xs text-gray-500">Copy subject and body separately. Paste into LinkedIn, email, or any form manually.</p>
            <div className="flex gap-2 flex-wrap">
              <CopyButton text={generated.subject} label="Copy subject" />
              <CopyButton text={generated.body}    label="Copy message" />
              <CopyButton text={`${generated.subject}\n\n${generated.body}`} label="Copy both" />
            </div>
          </div>

          {/* Option B — Open mail draft */}
          <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-900/50 text-purple-300 text-xs font-bold flex items-center justify-center shrink-0">B</span>
              <h3 className="text-sm font-semibold text-white">Open mail draft</h3>
            </div>
            <p className="text-xs text-gray-500">
              Opens your email programme with recipient, subject, and body pre-filled.
              {' '}<strong className="text-yellow-300">You must click Send yourself.</strong>
              {' '}Only a draft is opened — nothing is sent automatically.
            </p>
            <a
              href={mailtoLink}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-900/40 hover:bg-purple-800/60 text-purple-300 text-xs font-semibold rounded-xl border border-purple-800/40 transition-colors"
            >
              ✉ Open mail draft (mailto:)
            </a>
            {!target.contactEmail && (
              <p className="text-xs text-yellow-600">No email address entered — add one in Step 2 for a pre-filled recipient.</p>
            )}
          </div>

          {/* Option C — Contact Form Autofill Helper */}
          <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-900/50 text-emerald-300 text-xs font-bold flex items-center justify-center shrink-0">C</span>
              <h3 className="text-sm font-semibold text-white">Contact Form Autofill Helper</h3>
            </div>
            <p className="text-xs text-gray-500">
              Use this if the company has a contact form instead of an email address.
              The snippet fills visible form fields — it does <strong className="text-white">not</strong> submit the form.
            </p>

            {/* Field values — copy individually */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 space-y-1">
              <p className="text-xs text-gray-600 mb-2 uppercase tracking-wide font-semibold">Fields to fill manually or via snippet</p>
              <FieldRow label="Name / Sender"  value={SENDER.name}          />
              <FieldRow label="Email"          value={SENDER.email}         />
              <FieldRow label="Subject"        value={generated.subject}    />
              <FieldRow label="Message"        value={generated.body}       />
            </div>

            {/* Bookmarklet / console snippet */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Browser console snippet — paste on the contact form page
                </span>
                <CopyButton text={autofillSnippet} label="Copy snippet" />
              </div>
              <div className="bg-red-900/10 border border-red-800/30 rounded-xl p-3">
                <p className="text-red-300/80 text-xs font-semibold">
                  ⚠ Review before sending — Take a screenshot and ask for approval before clicking Send.
                </p>
                <p className="text-red-300/60 text-xs mt-1">
                  The snippet fills fields only. It does not submit. It does not click any button.
                  You click Send yourself, only after reviewing.
                </p>
              </div>
              <pre className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-xs text-gray-400 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-48">
                {autofillSnippet}
              </pre>
            </div>
          </div>

          {/* Contact page link */}
          {target.contactPageUrl && (
            <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Target contact page</p>
                <p className="text-sm text-blue-300 break-all">{target.contactPageUrl}</p>
              </div>
              <a
                href={target.contactPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs font-medium rounded-lg transition-colors"
              >
                Open ↗
              </a>
            </div>
          )}

          <button
            onClick={() => { setStatus('awaiting_review'); setStep(5) }}
            className="w-full py-2.5 bg-indigo-700 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Go to approval checklist →
          </button>
        </div>
      )}

      {/* ── STEP 5 — Approval checklist ──────────────────────────────────── */}
      {step >= 5 && (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-5">
          <StepHeader n={5} title="Approval checklist — do not send until checked" active={step >= 5} />

          <div className="bg-red-900/20 border border-red-800/40 rounded-xl p-4">
            <p className="text-red-300 text-sm font-bold mb-1">Do not send until all boxes are checked.</p>
            <p className="text-red-300/70 text-xs">
              Manual send only. Take a screenshot of the filled form or drafted email,
              review it carefully, then send yourself from your own LinkedIn, email client, or browser.
            </p>
          </div>

          <div className="space-y-2">
            {APPROVAL_CHECKLIST.map((item) => (
              <label
                key={item.key}
                className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${
                  checks[item.key]
                    ? 'bg-green-900/15 border-green-800/40'
                    : 'bg-gray-800/40 border-gray-700 hover:bg-gray-800/70'
                }`}
              >
                <input
                  type="checkbox"
                  checked={!!checks[item.key]}
                  onChange={() => toggleCheck(item.key)}
                  className="w-4 h-4 rounded accent-green-500 shrink-0"
                />
                <span className={`text-sm font-medium ${checks[item.key] ? 'text-green-400' : 'text-white'}`}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>

          {/* Status selector */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Contact status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ContactStatus)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
            >
              {CONTACT_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {allChecked ? (
            <div className="bg-green-900/20 border border-green-800/40 rounded-xl p-4">
              <p className="text-green-300 text-sm font-semibold">✓ All checks passed.</p>
              <p className="text-green-300/70 text-xs mt-1">
                You may now send manually — from your own LinkedIn, email client, or browser.
                Nothing has been sent automatically. Update the status above after sending.
              </p>
            </div>
          ) : (
            <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-3">
              <p className="text-gray-500 text-xs">
                {APPROVAL_CHECKLIST.filter((c) => !checks[c.key]).length} item(s) remaining before you may send.
              </p>
            </div>
          )}

          {/* Start new */}
          <button
            onClick={() => {
              setStep(1); setRoute('language_school')
              setTarget({ companyName: '', website: '', contactPageUrl: '', contactEmail: '', sector: '', country: '', contactPerson: '', notes: '' })
              setChecks({}); setStatus('draft_prepared')
            }}
            className="w-full py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm font-medium rounded-xl transition-colors"
          >
            ↩ Prepare another contact
          </button>
        </div>
      )}

      {/* ── Related pages ────────────────────────────────────────────────── */}
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 space-y-3">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Related pages</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { href: '/admin/pilot-targets', label: 'Pilot Target Strategy' },
            { href: '/admin/first-pilot',   label: 'First Pilot Assistant' },
            { href: '/admin/revenue-inbox', label: 'Revenue Inbox'         },
            { href: '/global/employers',    label: '/global/employers'     },
            { href: '/partners',            label: '/partners'             },
          ].map((l) => (
            <Link key={l.href} href={l.href}
              className="block px-3 py-2 bg-gray-800/40 border border-gray-700 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}
