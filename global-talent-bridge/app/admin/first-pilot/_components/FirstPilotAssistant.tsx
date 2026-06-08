'use client'

import { useState } from 'react'
import {
  generateWhatsAppTemplate,
  generateLinkedInTemplate,
  generateEmailTemplate,
  generateResponseGoodEmployer,
  generateResponseUnclearEmployer,
  generateResponseLegalRisk,
  generateResponsePartnerAlternative,
  PILOT_GOOD_CRITERIA,
  PILOT_RED_FLAGS,
  COMMERCIAL_READINESS,
} from '@/lib/first-pilot-templates'

interface Props {
  emailProviderSafe: boolean
}

type ContactMethod = 'whatsapp' | 'linkedin' | 'email' | 'personal'
type Tab = 'whatsapp' | 'linkedin' | 'email'
type ResponseTab = 'good' | 'unclear' | 'legal' | 'partner'
type CheckKey =
  | 'registered'
  | 'profile_created'
  | 'job_created'
  | 'matching_visible'
  | 'followup_needed'

// ── Copy Button ───────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
        copied
          ? 'bg-green-700 text-green-100'
          : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
      }`}
    >
      {copied ? '✅ Copied' : '📋 Copy text'}
    </button>
  )
}

// ── Step Badge ────────────────────────────────────────────────────────────────

function StepBadge({
  n,
  label,
  active,
  done,
}: {
  n: number
  label: string
  active: boolean
  done: boolean
}) {
  return (
    <div className={`flex items-center gap-2 ${active ? 'opacity-100' : 'opacity-40'}`}>
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
          done
            ? 'bg-green-700 text-white'
            : active
              ? 'bg-blue-700 text-white'
              : 'bg-gray-700 text-gray-400'
        }`}
      >
        {done ? '✓' : n}
      </div>
      <span className={`text-sm ${active ? 'text-white font-medium' : 'text-gray-500'}`}>
        {label}
      </span>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export function FirstPilotAssistant({ emailProviderSafe }: Props) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)

  // Step 1 form
  const [companyName, setCompanyName]       = useState('')
  const [contactPerson, setContactPerson]   = useState('')
  const [contactMethod, setContactMethod]   = useState<ContactMethod>('whatsapp')
  const [contactAddress, setContactAddress] = useState('')
  const [notes, setNotes]                   = useState('')

  // Step 2 tab
  const [activeTab, setActiveTab] = useState<Tab>('whatsapp')

  // Step 3
  const [saveLoading, setSaveLoading] = useState(false)
  const [saveError, setSaveError]     = useState<string | null>(null)
  const [saved, setSaved]             = useState(false)
  const [savedId, setSavedId]         = useState<string | null>(null)

  // Step 4 checklist
  const [checks, setChecks] = useState<Record<CheckKey, boolean>>({
    registered:       false,
    profile_created:  false,
    job_created:      false,
    matching_visible: false,
    followup_needed:  false,
  })

  // Qualification accordion
  const [showQualification, setShowQualification] = useState(false)

  // Response drafts
  const [responseDraftCompany, setResponseDraftCompany] = useState('')
  const [activeResponseTab, setActiveResponseTab]       = useState<ResponseTab>('good')

  // Templates
  const wa    = generateWhatsAppTemplate(companyName, contactPerson)
  const li    = generateLinkedInTemplate(companyName, contactPerson)
  const email = generateEmailTemplate(companyName, contactPerson)

  // Response drafts
  const draftCompany = responseDraftCompany.trim() || companyName.trim()
  const responseDrafts: Record<ResponseTab, string> = {
    good:    generateResponseGoodEmployer(draftCompany),
    unclear: generateResponseUnclearEmployer(draftCompany),
    legal:   generateResponseLegalRisk(draftCompany),
    partner: generateResponsePartnerAlternative(draftCompany),
  }

  const REGISTER_LINK = 'https://corridorwork.com/auth/register?role=employer'

  // ── Save tracking ─────────────────────────────────────────────────────────

  async function handleSave() {
    setSaveLoading(true)
    setSaveError(null)
    try {
      const res = await fetch('/api/admin/first-pilot/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name:    companyName.trim(),
          contact_person:  contactPerson.trim() || null,
          contact_method:  contactMethod,
          contact_address: contactAddress.trim() || null,
          notes:           notes.trim() || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSaveError(data.error ?? 'Unknown error while saving.')
      } else {
        setSaved(true)
        setSavedId(data.id ?? null)
        setStep(4)
      }
    } catch {
      setSaveError('Network error. Please try again.')
    } finally {
      setSaveLoading(false)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-white">First Pilot Assistant</h1>
        <p className="text-gray-400 text-sm mt-1">
          Step-by-step preparation for the first pilot employer — manual, secure, no automatic sending.
        </p>
      </div>

      {/* ── Commercial Readiness ────────────────────────────────────────── */}
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">
          Commercial &amp; Legal Readiness
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-green-900/20 border border-green-800/40 rounded-xl p-3 text-center">
            <div className="text-green-400 text-xs font-bold uppercase tracking-wide">Pilot-ready</div>
            <div className="text-green-300 text-sm font-semibold mt-1">yes</div>
          </div>
          <div className="bg-green-900/20 border border-green-800/40 rounded-xl p-3 text-center">
            <div className="text-green-400 text-xs font-bold uppercase tracking-wide">Inbound-ready</div>
            <div className="text-green-300 text-sm font-semibold mt-1">yes</div>
          </div>
          <div className="bg-red-900/20 border border-red-800/40 rounded-xl p-3 text-center">
            <div className="text-red-400 text-xs font-bold uppercase tracking-wide">Payment-ready</div>
            <div className="text-red-300 text-sm font-semibold mt-1">no</div>
          </div>
          <div className={`${emailProviderSafe ? 'bg-green-900/20 border-green-800/40' : 'bg-red-900/20 border-red-800/40'} border rounded-xl p-3 text-center`}>
            <div className={`${emailProviderSafe ? 'text-green-400' : 'text-red-400'} text-xs font-bold uppercase tracking-wide`}>
              Auto-outreach
            </div>
            <div className={`${emailProviderSafe ? 'text-green-300' : 'text-red-300'} text-sm font-semibold mt-1`}>
              {emailProviderSafe ? 'off' : 'WARNING'}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {[
            { label: 'Legal review needed before paid placement', ok: false },
            { label: 'No automatic outreach', ok: true },
            { label: 'No candidate fee active', ok: true },
            { label: 'No job guarantee', ok: true },
            { label: 'No visa guarantee', ok: true },
            { label: 'No Stripe active', ok: true },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-xs">
              <span className={item.ok ? 'text-green-400' : 'text-yellow-400'}>
                {item.ok ? '✓' : '⚠'}
              </span>
              <span className={item.ok ? 'text-gray-400' : 'text-yellow-300'}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Pilot Process ───────────────────────────────────────────────── */}
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-4">
          Pilot Process
        </h2>
        <ol className="space-y-2">
          {[
            'Employer submits workforce demand via /global/employers',
            'Admin reviews lead manually — no automated processing',
            'Fit score is assessed against good/bad criteria',
            'Missing details requested manually if needed',
            'Candidate corridor potential reviewed internally',
            'Pilot discussion prepared — copy-ready response sent manually',
            'Only then: commercial and legal steps considered',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-slate-600 text-sm font-bold shrink-0 w-5 text-right">{i + 1}.</span>
              <span className="text-gray-400 text-sm leading-relaxed">{item}</span>
            </li>
          ))}
        </ol>
        <p className="text-xs text-gray-600 mt-4 pt-4 border-t border-gray-800">
          No automatic placement · No payment · No guarantee · Manual at every step
        </p>
      </div>

      {/* ── Lead Qualification ──────────────────────────────────────────── */}
      <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowQualification((v) => !v)}
          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-800/50 transition-colors"
        >
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">
            Lead Qualification &amp; Fit Score
          </h2>
          <span className="text-gray-500 text-sm">{showQualification ? '▲ collapse' : '▼ expand'}</span>
        </button>

        {showQualification && (
          <div className="px-5 pb-5 space-y-5 border-t border-gray-800">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
              {/* Good criteria */}
              <div>
                <p className="text-green-400 text-xs font-bold uppercase tracking-wide mb-3">
                  ✓ Good Pilot Employer
                </p>
                <div className="space-y-2">
                  {PILOT_GOOD_CRITERIA.map((c) => (
                    <div key={c.label} className="bg-green-900/10 border border-green-900/30 rounded-lg px-3 py-2">
                      <div className="text-green-300 text-xs font-semibold">{c.label}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{c.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Red flags */}
              <div>
                <p className="text-red-400 text-xs font-bold uppercase tracking-wide mb-3">
                  ✗ Red Flags — Not Suitable
                </p>
                <div className="space-y-2">
                  {PILOT_RED_FLAGS.map((c) => (
                    <div key={c.label} className="bg-red-900/10 border border-red-900/30 rounded-lg px-3 py-2">
                      <div className="text-red-300 text-xs font-semibold">{c.label}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{c.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Response Drafts ─────────────────────────────────────────────── */}
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">
          Copy-ready Response Drafts
        </h2>
        <p className="text-xs text-gray-600">
          For inbound employer leads. Copy manually — no send button.
          Signed: CorridorWork Team.
        </p>

        {/* Company name for drafts */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">
            Employer name for drafts
            <span className="text-gray-600 font-normal ml-1">(uses Step 1 name if left empty)</span>
          </label>
          <input
            type="text"
            value={responseDraftCompany}
            onChange={(e) => setResponseDraftCompany(e.target.value)}
            placeholder="e.g. Acme Healthcare GmbH"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Response tab navigation */}
        <div className="flex flex-wrap gap-2 border-b border-gray-700 pb-2">
          {(
            [
              { id: 'good',    label: '✓ Good fit',          color: 'green'  },
              { id: 'unclear', label: '? Needs clarification', color: 'yellow' },
              { id: 'legal',   label: '✗ Legal risk',         color: 'red'    },
              { id: 'partner', label: '→ Partner alternative', color: 'blue'   },
            ] as { id: ResponseTab; label: string; color: string }[]
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveResponseTab(t.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeResponseTab === t.id
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Draft display */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {activeResponseTab === 'good'    && 'Qualified inbound employer — confirm next steps'}
              {activeResponseTab === 'unclear' && 'Unclear submission — request clarification'}
              {activeResponseTab === 'legal'   && 'Legal/compliance concern — polite decline'}
              {activeResponseTab === 'partner' && 'Agency/partner fit — redirect to /partners'}
            </span>
            <CopyButton text={responseDrafts[activeResponseTab]} />
          </div>
          <pre className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 text-sm text-gray-200 whitespace-pre-wrap font-sans leading-relaxed">
            {responseDrafts[activeResponseTab]}
          </pre>
        </div>

        <div className="bg-blue-900/10 border border-blue-800/30 rounded-xl p-3">
          <p className="text-blue-300/70 text-xs">
            No send button — copy and send manually via email, LinkedIn, or phone.
            No automatic outreach is triggered.
          </p>
        </div>
      </div>

      {/* ── Einladungslink ──────────────────────────────────────────────── */}
      <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-xs text-gray-500 mb-1">Employer registration link</div>
          <code className="text-blue-300 text-sm break-all">{REGISTER_LINK}</code>
        </div>
        <CopyButton text={REGISTER_LINK} />
      </div>

      {/* ── Step Navigation ─────────────────────────────────────────────── */}
      <div>
        <p className="text-xs text-gray-600 uppercase tracking-widest mb-3 font-semibold">
          Outreach Preparation — 4 Steps
        </p>
        <div className="flex flex-wrap gap-4">
          <StepBadge n={1} label="Enter employer data"       active={step === 1} done={step > 1} />
          <StepBadge n={2} label="Select outreach template"  active={step === 2} done={step > 2} />
          <StepBadge n={3} label="Mark as contacted"         active={step === 3} done={step > 3} />
          <StepBadge n={4} label="Review after registration" active={step === 4} done={false}    />
        </div>
      </div>

      {/* ── STEP 1: Employer data ────────────────────────────────────────── */}
      {step === 1 && (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-5">
          <h2 className="text-lg font-semibold text-white">Step 1 — Employer data</h2>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Company name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. TechBridge GmbH"
              className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Contact person <span className="text-gray-600 font-normal text-xs">(optional)</span>
            </label>
            <input
              type="text"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              placeholder="e.g. Maria Müller"
              className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Contact channel</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(
                [
                  { value: 'whatsapp',  label: 'WhatsApp' },
                  { value: 'linkedin',  label: 'LinkedIn' },
                  { value: 'email',     label: 'Email' },
                  { value: 'personal',  label: 'In person' },
                ] as { value: ContactMethod; label: string }[]
              ).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setContactMethod(opt.value)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    contactMethod === opt.value
                      ? 'bg-blue-700 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              {contactMethod === 'email'     ? 'Email address' :
               contactMethod === 'whatsapp'  ? 'Phone number / handle' :
               contactMethod === 'linkedin'  ? 'LinkedIn profile URL' :
               'Contact info'}
              {' '}<span className="text-gray-600 font-normal text-xs">(optional)</span>
            </label>
            <input
              type="text"
              value={contactAddress}
              onChange={(e) => setContactAddress(e.target.value)}
              placeholder={
                contactMethod === 'email'    ? 'name@company.com' :
                contactMethod === 'whatsapp' ? '+49 …' :
                contactMethod === 'linkedin' ? 'https://linkedin.com/in/…' :
                'Date / location / note'
              }
              className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Internal note <span className="text-gray-600 font-normal text-xs">(not visible to employer)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Where did this contact come from? Any special context? Previous conversations?"
              className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!companyName.trim()}
            className="w-full py-2.5 bg-blue-700 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Next → Select outreach template
          </button>
        </div>
      )}

      {/* ── STEP 2: Outreach template ────────────────────────────────────── */}
      {step === 2 && (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Step 2 — Outreach template</h2>
            <button
              onClick={() => setStep(1)}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              ← Back
            </button>
          </div>

          <div className="bg-blue-900/10 border border-blue-800/30 rounded-xl p-3">
            <p className="text-blue-300/70 text-xs">
              Select the appropriate channel. Copy the text and send it manually.
              There is <strong>no send button</strong> — you send it yourself.
            </p>
          </div>

          {/* Tab navigation */}
          <div className="flex gap-2 border-b border-gray-700 pb-1">
            {(
              [
                { id: 'whatsapp', label: 'WhatsApp' },
                { id: 'linkedin', label: 'LinkedIn' },
                { id: 'email',    label: 'Email' },
              ] as { id: Tab; label: string }[]
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === t.id
                    ? 'bg-blue-900/40 text-blue-300 border-b-2 border-blue-500'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* WhatsApp */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">WhatsApp — short and direct</span>
                <CopyButton text={wa} />
              </div>
              <pre className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 text-sm text-gray-200 whitespace-pre-wrap font-sans leading-relaxed">
                {wa}
              </pre>
            </div>
          )}

          {/* LinkedIn */}
          {activeTab === 'linkedin' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">LinkedIn — professional</span>
                <CopyButton text={li} />
              </div>
              <pre className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 text-sm text-gray-200 whitespace-pre-wrap font-sans leading-relaxed">
                {li}
              </pre>
            </div>
          )}

          {/* Email */}
          {activeTab === 'email' && (
            <div className="space-y-3">
              <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Subject</span>
                  <CopyButton text={email.subject} />
                </div>
                <p className="text-sm text-white font-medium">{email.subject}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Email body — formal</span>
                  <CopyButton text={email.body} />
                </div>
                <pre className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 text-sm text-gray-200 whitespace-pre-wrap font-sans leading-relaxed">
                  {email.body}
                </pre>
              </div>
            </div>
          )}

          <button
            onClick={() => setStep(3)}
            className="w-full py-2.5 bg-blue-700 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Next → Mark as contacted
          </button>
        </div>
      )}

      {/* ── STEP 3: Save tracking ─────────────────────────────────────────── */}
      {step === 3 && (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Step 3 — Save tracking entry</h2>
            <button
              onClick={() => setStep(2)}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              ← Back
            </button>
          </div>

          <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-4 space-y-2">
            <div className="text-sm text-gray-400">What will be saved:</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-gray-500">Company:</div>
              <div className="text-white font-medium">{companyName}</div>
              {contactPerson && <>
                <div className="text-gray-500">Contact:</div>
                <div className="text-white">{contactPerson}</div>
              </>}
              <div className="text-gray-500">Channel:</div>
              <div className="text-white">{contactMethod}</div>
              <div className="text-gray-500">Status:</div>
              <div className="text-green-400 font-medium">contacted_manual</div>
              <div className="text-gray-500">Email sent:</div>
              <div className="text-green-400">No (no_email_sent: true)</div>
              <div className="text-gray-500">Auto-outreach:</div>
              <div className="text-green-400">No (no_auto_outreach: true)</div>
            </div>
          </div>

          {saveError && (
            <div className="bg-red-900/20 border border-red-800/40 rounded-xl p-3 text-red-300 text-sm">
              ⚠️ {saveError}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saveLoading}
            className="w-full py-3 bg-green-700 hover:bg-green-600 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            {saveLoading ? 'Saving…' : '✅ Mark as manually contacted'}
          </button>

          <p className="text-xs text-gray-600 text-center">
            No email is sent. No automatic outreach. Internal DB entry only.
          </p>
        </div>
      )}

      {/* ── STEP 4: Post-registration checklist ──────────────────────────── */}
      {step === 4 && (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-5">
          <h2 className="text-lg font-semibold text-white">Step 4 — After registration</h2>

          {saved && (
            <div className="bg-green-900/20 border border-green-800/40 rounded-xl p-3">
              <p className="text-green-300 text-sm">
                ✅ Saved{savedId ? ` (ID: ${savedId.slice(0, 8)}…)` : ''}. Once the employer has registered, check here:
              </p>
            </div>
          )}

          <div className="space-y-3">
            {(
              [
                { key: 'registered',       label: 'Employer has registered',            hint: '/admin/ceo-dashboard — employer count increased?' },
                { key: 'profile_created',  label: 'Company profile fully completed',    hint: 'Industry, country, description present?' },
                { key: 'job_created',      label: 'First job listing created',          hint: 'At least 1 job with requirements visible?' },
                { key: 'matching_visible', label: 'Matching results visible',           hint: 'Score breakdown working? Candidates shown?' },
                { key: 'followup_needed',  label: 'Manual follow-up needed',            hint: 'Feedback call scheduled?' },
              ] as { key: CheckKey; label: string; hint: string }[]
            ).map(({ key, label, hint }) => (
              <label
                key={key}
                className="flex items-start gap-3 p-3 bg-gray-800/40 border border-gray-700 rounded-xl cursor-pointer hover:bg-gray-800/70 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={checks[key]}
                  onChange={(e) =>
                    setChecks((prev) => ({ ...prev, [key]: e.target.checked }))
                  }
                  className="mt-0.5 w-4 h-4 rounded accent-blue-500 shrink-0"
                />
                <div>
                  <div className={`text-sm font-medium ${checks[key] ? 'text-green-400 line-through' : 'text-white'}`}>
                    {label}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{hint}</div>
                </div>
              </label>
            ))}
          </div>

          <div className="border-t border-gray-800 pt-4 space-y-2">
            <p className="text-xs text-gray-500">Next steps after onboarding:</p>
            <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
              <li>Schedule a feedback call with the employer</li>
              <li>Update entry in <code className="text-gray-300">/admin/outreach</code></li>
              <li>If interested: add employer to <code className="text-gray-300">/admin/pilot-outreach</code></li>
              <li>No payments without explicit confirmation and legal review</li>
            </ul>
          </div>

          <button
            onClick={() => {
              setStep(1)
              setCompanyName('')
              setContactPerson('')
              setContactAddress('')
              setNotes('')
              setSaved(false)
              setSavedId(null)
              setChecks({
                registered:       false,
                profile_created:  false,
                job_created:      false,
                matching_visible: false,
                followup_needed:  false,
              })
            }}
            className="w-full py-2.5 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-xl transition-colors"
          >
            ↩ Prepare another pilot employer
          </button>
        </div>
      )}
    </div>
  )
}
