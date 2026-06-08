'use client'

/**
 * app/admin/pilot-targets/_components/PilotTargetsClient.tsx
 *
 * Guided Pilot Target Strategy — step-by-step admin preparation tool.
 * No send button. No automatic outreach. No scraping. Copy-only.
 */

import { useState } from 'react'
import Link from 'next/link'
import {
  TARGET_GROUPS,
  FIT_SCORE_CRITERIA,
  RED_FLAGS,
  TARGET_STATUS_OPTIONS,
  OPERATING_RULES,
  EXAMPLE_TARGET_PROFILES,
  GUIDED_ACTION,
  PILOT_ROUTES,
  calculateFitScore,
  fitScoreLabel,
  generateOutreachDrafts,
} from '@/lib/pilot-target-strategy'
import type { TargetStatus } from '@/lib/pilot-target-strategy'

// ── Copy Button ───────────────────────────────────────────────────────────────

function CopyButton({ text, label = 'Copy text' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  async function handleCopy() {
    try { await navigator.clipboard.writeText(text) } catch {
      const el = document.createElement('textarea')
      el.value = text; document.body.appendChild(el); el.select()
      document.execCommand('copy'); document.body.removeChild(el)
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
        copied ? 'bg-green-700 text-green-100' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
      }`}
    >
      {copied ? '✅ Copied' : `📋 ${label}`}
    </button>
  )
}

// ── Section wrapper ───────────────────────────────────────────────────────────

function Section({ title, badge, accent = false, children }: {
  title: string
  badge?: string
  accent?: boolean
  children: React.ReactNode
}) {
  return (
    <div className={`border rounded-2xl overflow-hidden ${accent ? 'bg-indigo-950/30 border-indigo-800/40' : 'bg-gray-900 border-gray-700'}`}>
      <div className={`px-5 py-4 border-b flex items-center gap-3 ${accent ? 'border-indigo-800/40' : 'border-gray-800'}`}>
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">{title}</h2>
        {badge && (
          <span className="px-2 py-0.5 bg-blue-900/40 text-blue-300 text-xs rounded-full">{badge}</span>
        )}
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

// ── Risk badge ────────────────────────────────────────────────────────────────

function RiskBadge({ level }: { level: 'low' | 'medium' | 'high' }) {
  const styles = {
    low:    'bg-green-900/30 text-green-400 border-green-800/40',
    medium: 'bg-yellow-900/30 text-yellow-400 border-yellow-800/40',
    high:   'bg-red-900/30 text-red-400 border-red-800/40',
  }
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${styles[level]}`}>
      {level} risk
    </span>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export function PilotTargetsClient() {

  // Target Card state
  const [cardCompany,  setCardCompany]  = useState('')
  const [cardCountry,  setCardCountry]  = useState('')
  const [cardSector,   setCardSector]   = useState('')
  const [cardContact,  setCardContact]  = useState('')
  const [cardWebsite,  setCardWebsite]  = useState('')
  const [cardWhy,      setCardWhy]      = useState('')
  const [cardRisk,     setCardRisk]     = useState('')
  const [cardApproach, setCardApproach] = useState('')
  const [cardStatus,   setCardStatus]   = useState<TargetStatus>('idea')

  // Fit score
  const [metCriteria, setMetCriteria] = useState<string[]>([])
  const score      = calculateFitScore(metCriteria)
  const scoreMeta  = fitScoreLabel(score)

  // Red flags
  const [flagsPresent, setFlagsPresent] = useState<string[]>([])

  // Outreach drafts
  const [draftTab, setDraftTab] = useState<string>('linkedin')
  const drafts = generateOutreachDrafts(cardCompany, cardSector)
  const activeDraft = drafts.find((d) => d.id === draftTab) ?? drafts[0]

  // Example profiles accordion
  const [expandedProfile, setExpandedProfile] = useState<string | null>(null)

  // Target groups tab (keep for reference section)
  const [groupTab, setGroupTab] = useState<string>('employer')
  const activeGroup = TARGET_GROUPS.find((g) => g.id === groupTab) ?? TARGET_GROUPS[0]

  function toggleCriterion(key: string) {
    setMetCriteria((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  function toggleFlag(label: string) {
    setFlagsPresent((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    )
  }

  function loadExampleIntoCard(profileId: string) {
    const p = EXAMPLE_TARGET_PROFILES.find((e) => e.id === profileId)
    if (!p) return
    setCardSector(p.sector)
    setCardCountry(p.country)
    setCardWhy(p.whyFits)
    setCardRisk(p.riskNote)
    setCardApproach(`Use ${p.suggestedMessageType} draft`)
    // Do NOT pre-fill company or contact — user must add real data
  }

  const hasHighRiskFlag = flagsPresent.some(
    (f) => RED_FLAGS.find((r) => r.label === f)?.severity === 'high'
  )

  return (
    <div className="space-y-8">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-white">Pilot Target Strategy</h1>
        <p className="text-gray-400 text-sm mt-1">
          Guided preparation for the first pilot contact.
          No automatic outreach. No send button. You review everything manually.
        </p>
      </div>

      {/* ── Guided Action Box ───────────────────────────────────────────── */}
      <div className="bg-indigo-950/50 border border-indigo-700/50 rounded-2xl p-6 space-y-5">
        <div>
          <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest mb-2">
            Where to start
          </p>
          <h2 className="text-xl font-bold text-white">{GUIDED_ACTION.title}</h2>
          <p className="text-indigo-200/70 text-sm mt-2 leading-relaxed">{GUIDED_ACTION.subtitle}</p>
        </div>

        {/* 6 Steps */}
        <ol className="space-y-3">
          {GUIDED_ACTION.steps.map((s) => (
            <li key={s.n} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-indigo-800/60 border border-indigo-700 flex items-center justify-center text-xs font-bold text-indigo-300 shrink-0 mt-0.5">
                {s.n}
              </span>
              <div>
                <div className="text-white text-sm font-medium">{s.label}</div>
                <div className="text-indigo-200/60 text-xs mt-0.5 leading-relaxed">{s.desc}</div>
              </div>
            </li>
          ))}
        </ol>

        {/* Quick links */}
        <div className="flex flex-wrap gap-3 pt-2 border-t border-indigo-800/30">
          <Link
            href="/admin/first-pilot"
            className="px-4 py-2 bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Open first pilot checklist →
          </Link>
          <Link
            href="/global/employers"
            className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl border border-white/20 transition-colors"
          >
            Open employer intake →
          </Link>
          <Link
            href="/partners"
            className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl border border-white/20 transition-colors"
          >
            Open partner page →
          </Link>
        </div>
      </div>

      {/* ── No Automatic Contact Banner ─────────────────────────────────── */}
      <div className="bg-slate-900 border border-slate-700 rounded-xl px-5 py-3">
        <div className="flex flex-wrap gap-x-6 gap-y-1">
          {[
            'No automatic contact',
            'No send button',
            'No email automation',
            'No scraping',
            'Human approval required',
          ].map((item) => (
            <span key={item} className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="text-green-500">✓</span> {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Three Pilot Routes ──────────────────────────────────────────── */}
      <Section title="Three Pilot Routes" badge="choose one to start">
        <div className="space-y-4">
          {PILOT_ROUTES.map((route, i) => (
            <div
              key={route.id}
              className="bg-gray-800/40 border border-gray-700 rounded-xl p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-5 h-5 rounded-full bg-blue-900/60 text-blue-300 text-xs font-bold flex items-center justify-center shrink-0">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-white text-sm font-semibold">{route.label}</span>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">{route.tagline}</p>
                </div>
                <Link
                  href={route.link}
                  className="shrink-0 px-3 py-1.5 bg-blue-900/40 hover:bg-blue-800/60 text-blue-300 text-xs font-medium rounded-lg border border-blue-800/40 transition-colors whitespace-nowrap"
                >
                  {route.linkLabel}
                </Link>
              </div>
              <div>
                <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide mb-1">Best for</p>
                <p className="text-gray-400 text-xs">{route.bestFor}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide mb-1">Process</p>
                <ol className="space-y-0.5">
                  {route.steps.map((step, j) => (
                    <li key={j} className="text-xs text-gray-500 flex items-start gap-1.5">
                      <span className="text-gray-700 shrink-0">{j + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Example Target Profiles ─────────────────────────────────────── */}
      <Section title="Example Target Profiles" badge="not real leads — placeholders only">
        <div className="space-y-3">
          <div className="bg-yellow-900/20 border border-yellow-800/40 rounded-xl px-4 py-2.5">
            <p className="text-yellow-300/80 text-xs">
              These are example profiles to illustrate what a good target looks like.
              <strong className="text-yellow-200"> They are not real companies or leads.</strong> Replace the placeholder data with a real contact before using any draft.
            </p>
          </div>

          {EXAMPLE_TARGET_PROFILES.map((profile) => {
            const isOpen = expandedProfile === profile.id
            return (
              <div key={profile.id} className="border border-gray-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedProfile(isOpen ? null : profile.id)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-800/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white text-sm font-medium">{profile.title}</span>
                        <span className="text-gray-600 text-xs border border-gray-700 rounded px-1.5 py-0.5">
                          {profile.disclaimer}
                        </span>
                      </div>
                      <div className="text-gray-500 text-xs mt-0.5">
                        {profile.sector} · {profile.country}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <RiskBadge level={profile.riskLevel} />
                    <span className="text-gray-500 text-xs">{isOpen ? '▲' : '▼'}</span>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-2 space-y-3 border-t border-gray-800">
                    <div>
                      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1">Why it fits</p>
                      <p className="text-gray-300 text-sm leading-relaxed">{profile.whyFits}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1">Risk note</p>
                      <p className="text-gray-400 text-sm">{profile.riskNote}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1">First question to ask</p>
                        <p className="text-gray-300 text-sm italic">&ldquo;{profile.firstQuestion}&rdquo;</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1">Suggested message type</p>
                        <p className="text-gray-300 text-sm capitalize">{profile.suggestedMessageType}</p>
                      </div>
                    </div>
                    <div className="bg-blue-900/10 border border-blue-900/30 rounded-xl p-3">
                      <p className="text-blue-300/80 text-xs">
                        <span className="font-semibold">Recommended next action:</span> {profile.nextAction}
                      </p>
                    </div>
                    <button
                      onClick={() => loadExampleIntoCard(profile.id)}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs font-medium rounded-xl transition-colors"
                    >
                      Load sector &amp; why-fits into Target Card below ↓
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Section>

      {/* ── Divider ─────────────────────────────────────────────────────── */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-800" /></div>
        <div className="relative flex justify-center">
          <span className="bg-gray-950 px-4 text-xs text-gray-600 uppercase tracking-widest">
            Fill in your own target below
          </span>
        </div>
      </div>

      {/* ── Target Card Template ─────────────────────────────────────────── */}
      <Section title="Target Card" badge="your real target — not sent anywhere">
        <div className="space-y-4">
          <div className="bg-blue-900/10 border border-blue-800/30 rounded-xl p-3 text-xs text-blue-300/70">
            Fill in a real company and contact. This card is internal only — not sent anywhere automatically.
            The company name and sector auto-fill the outreach drafts in the section below.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Company name <span className="text-gray-600">(real, replace placeholder)</span>
              </label>
              <input
                value={cardCompany}
                onChange={(e) => setCardCompany(e.target.value)}
                placeholder="e.g. Klinikum Karlsruhe"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Country</label>
              <input
                value={cardCountry}
                onChange={(e) => setCardCountry(e.target.value)}
                placeholder="e.g. Germany"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Sector <span className="text-gray-600">(used in outreach drafts)</span>
              </label>
              <input
                value={cardSector}
                onChange={(e) => setCardSector(e.target.value)}
                placeholder="e.g. Healthcare, IT, Engineering"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Contact person</label>
              <input
                value={cardContact}
                onChange={(e) => setCardContact(e.target.value)}
                placeholder="e.g. Dr. Müller, HR Director"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Website</label>
              <input
                value={cardWebsite}
                onChange={(e) => setCardWebsite(e.target.value)}
                placeholder="https://…"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Status</label>
              <select
                value={cardStatus}
                onChange={(e) => setCardStatus(e.target.value as TargetStatus)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
              >
                {TARGET_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Why this target fits</label>
            <textarea
              value={cardWhy}
              onChange={(e) => setCardWhy(e.target.value)}
              rows={2}
              placeholder="What makes this a good pilot candidate? (pre-filled if you loaded an example above)"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Risk notes</label>
            <textarea
              value={cardRisk}
              onChange={(e) => setCardRisk(e.target.value)}
              rows={2}
              placeholder="Any compliance, legal, or reputational risks?"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Suggested approach</label>
            <input
              value={cardApproach}
              onChange={(e) => setCardApproach(e.target.value)}
              placeholder="e.g. LinkedIn DM, email to HR, WhatsApp via mutual contact"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <p className="text-xs text-gray-600">
            No automatic contact. Human approval required before any outreach.
          </p>
        </div>
      </Section>

      {/* ── Fit Score ───────────────────────────────────────────────────── */}
      <Section title="Fit Score" badge="0–100 — aim for ≥ 70">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div
              className={`text-5xl font-bold ${
                scoreMeta.color === 'green'  ? 'text-green-400' :
                scoreMeta.color === 'yellow' ? 'text-yellow-400' : 'text-red-400'
              }`}
            >
              {score}
            </div>
            <div>
              <div className={`text-sm font-semibold ${
                scoreMeta.color === 'green'  ? 'text-green-300' :
                scoreMeta.color === 'yellow' ? 'text-yellow-300' : 'text-red-300'
              }`}>
                {scoreMeta.label}
              </div>
              <div className="text-gray-500 text-xs mt-0.5">
                {score < 70
                  ? 'Check more criteria or choose a different target.'
                  : 'Good fit — proceed to outreach drafts when ready.'}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {FIT_SCORE_CRITERIA.map((c) => (
              <label
                key={c.key}
                className="flex items-start gap-3 p-3 bg-gray-800/40 border border-gray-700 rounded-xl cursor-pointer hover:bg-gray-800/70 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={metCriteria.includes(c.key)}
                  onChange={() => toggleCriterion(c.key)}
                  className="mt-0.5 w-4 h-4 rounded accent-blue-500 shrink-0"
                />
                <div className="flex-1">
                  <div className={`text-sm font-medium ${metCriteria.includes(c.key) ? 'text-green-400' : 'text-white'}`}>
                    {c.label}
                    <span className="ml-2 text-xs text-gray-600">(+{c.weight} pts)</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{c.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Red Flags ───────────────────────────────────────────────────── */}
      <Section title="Red Flags — check if any apply">
        {hasHighRiskFlag && (
          <div className="mb-4 bg-red-900/20 border border-red-800/40 rounded-xl p-3">
            <p className="text-red-300 text-sm font-semibold">
              High-risk flag detected — do not proceed without legal review.
            </p>
          </div>
        )}
        <p className="text-gray-500 text-xs mb-3">
          Check any flags that apply to this target. High-risk flags require a stop.
        </p>
        <div className="space-y-2">
          {RED_FLAGS.map((flag) => {
            const present = flagsPresent.includes(flag.label)
            return (
              <label
                key={flag.label}
                className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${
                  present
                    ? flag.severity === 'high'
                      ? 'bg-red-900/20 border-red-800/50'
                      : 'bg-yellow-900/20 border-yellow-800/50'
                    : 'bg-gray-800/40 border-gray-700 hover:bg-gray-800/70'
                }`}
              >
                <input
                  type="checkbox"
                  checked={present}
                  onChange={() => toggleFlag(flag.label)}
                  className="mt-0.5 w-4 h-4 rounded shrink-0"
                />
                <div>
                  <div className={`text-sm font-medium flex items-center gap-2 ${
                    present
                      ? flag.severity === 'high' ? 'text-red-300' : 'text-yellow-300'
                      : 'text-white'
                  }`}>
                    {flag.label}
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      flag.severity === 'high'
                        ? 'bg-red-900/50 text-red-400'
                        : 'bg-yellow-900/50 text-yellow-400'
                    }`}>
                      {flag.severity}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{flag.desc}</div>
                </div>
              </label>
            )
          })}
        </div>
      </Section>

      {/* ── Manual Outreach Pack ─────────────────────────────────────────── */}
      <Section title="Manual Outreach Pack" badge="copy only — no send button">
        <div className="space-y-4">
          <div className="bg-green-900/10 border border-green-800/30 rounded-xl p-3 flex items-start gap-2">
            <span className="text-green-400 shrink-0">✓</span>
            <p className="text-green-300/70 text-xs">
              No send button. No automatic outreach. No email automation.
              Copy the text and send it yourself — from your own LinkedIn, email, or phone.
              All messages are signed: <strong>CorridorWork Team</strong>.
            </p>
          </div>

          {/* Tab nav */}
          <div className="flex flex-wrap gap-2 border-b border-gray-800 pb-2">
            {drafts.map((d) => (
              <button
                key={d.id}
                onClick={() => setDraftTab(d.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  draftTab === d.id
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Active draft */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {activeDraft.channel} — {activeDraft.note}
              </span>
              <CopyButton text={activeDraft.text} />
            </div>
            <pre className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 text-sm text-gray-200 whitespace-pre-wrap font-sans leading-relaxed">
              {activeDraft.text}
            </pre>
          </div>

          <p className="text-xs text-gray-600">
            Uses company name and sector from the Target Card above.
            Leave company name empty to see the generic fallback text.
          </p>
        </div>
      </Section>

      {/* ── Operating Rules ─────────────────────────────────────────────── */}
      <Section title="Operating Rules — always active">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {OPERATING_RULES.map((rule) => (
            <div key={rule.label} className="flex items-start gap-2 text-xs">
              <span className={rule.ok ? 'text-green-400 shrink-0' : 'text-yellow-400 shrink-0'}>
                {rule.ok ? '✓' : '⚠'}
              </span>
              <span className={rule.ok ? 'text-gray-400' : 'text-yellow-300'}>{rule.label}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Target Groups Reference ──────────────────────────────────────── */}
      <Section title="Target Group Reference" badge="strategy background">
        <div className="flex flex-wrap gap-2 mb-4 border-b border-gray-800 pb-3">
          {TARGET_GROUPS.map((g) => (
            <button
              key={g.id}
              onClick={() => setGroupTab(g.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                groupTab === g.id
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          <p className="text-white text-sm font-semibold">{activeGroup.tagline}</p>
          <p className="text-gray-400 text-sm leading-relaxed">{activeGroup.why}</p>
          <ul className="space-y-1">
            {activeGroup.examples.map((ex) => (
              <li key={ex} className="flex items-start gap-2 text-sm text-gray-400">
                <span className="text-gray-600 shrink-0">→</span>{ex}
              </li>
            ))}
          </ul>
          <div className="bg-blue-900/10 border border-blue-900/30 rounded-xl p-3">
            <p className="text-blue-300/80 text-xs">
              <span className="font-semibold">Best approach:</span> {activeGroup.approach}
            </p>
          </div>
        </div>
      </Section>

      {/* ── Related Pages ───────────────────────────────────────────────── */}
      <Section title="Related Pages">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { href: '/admin/first-pilot',        label: 'First Pilot Assistant',   desc: '4-step outreach + response drafts' },
            { href: '/admin/revenue-inbox',       label: 'Revenue Inbox',            desc: 'All inbound leads' },
            { href: '/admin/pilot-target-finder', label: 'Pilot Target Finder',      desc: 'Search suggestions (no scraping)' },
            { href: '/global/employers',          label: '/global/employers',        desc: 'Public employer intake page' },
            { href: '/partners',                  label: '/partners',                desc: 'Public partner enquiry' },
            { href: '/strategic-partnership',     label: '/strategic-partnership',   desc: 'Public strategic partnership' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block p-3 bg-gray-800/40 border border-gray-700 rounded-xl hover:bg-gray-800 transition-colors"
            >
              <div className="text-white text-sm font-medium">{link.label}</div>
              <div className="text-gray-500 text-xs mt-0.5">{link.desc}</div>
            </Link>
          ))}
        </div>
      </Section>

    </div>
  )
}
