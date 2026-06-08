'use client'

/**
 * app/admin/pilot-targets/_components/PilotTargetsClient.tsx
 *
 * Pilot Target Strategy — interactive admin tool.
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

function Section({ title, badge, children }: {
  title: string
  badge?: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-800 flex items-center gap-3">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">{title}</h2>
        {badge && (
          <span className="px-2 py-0.5 bg-blue-900/40 text-blue-300 text-xs rounded-full">{badge}</span>
        )}
      </div>
      <div className="p-5">{children}</div>
    </div>
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

  // Target groups tab
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

  const hasHighRiskFlag = flagsPresent.some(
    (f) => RED_FLAGS.find((r) => r.label === f)?.severity === 'high'
  )

  return (
    <div className="space-y-8">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-white">Pilot Target Strategy</h1>
        <p className="text-gray-400 text-sm mt-1">
          Manual preparation tool for the first pilot employer or partner contact.
          No automatic outreach. No send button. Copy and send manually.
        </p>
      </div>

      {/* ── Operating Rules ─────────────────────────────────────────────── */}
      <Section title="Operating Rules">
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

      {/* ── Target Groups ───────────────────────────────────────────────── */}
      <Section title="Pilot Target Strategy" badge="3 groups">
        {/* Tab nav */}
        <div className="flex flex-wrap gap-2 mb-5 border-b border-gray-800 pb-3">
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

        {/* Active group */}
        <div className="space-y-4">
          <div>
            <p className="text-white font-semibold text-sm">{activeGroup.tagline}</p>
            <p className="text-gray-400 text-sm mt-2 leading-relaxed">{activeGroup.why}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wide font-semibold mb-2">Examples</p>
            <ul className="space-y-1">
              {activeGroup.examples.map((ex) => (
                <li key={ex} className="flex items-start gap-2 text-sm text-gray-400">
                  <span className="text-gray-600 shrink-0 mt-0.5">→</span>{ex}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-blue-900/10 border border-blue-900/30 rounded-xl p-3">
            <p className="text-blue-300/80 text-xs">
              <span className="font-semibold">Best approach:</span> {activeGroup.approach}
            </p>
          </div>
        </div>
      </Section>

      {/* ── Target Card Template ─────────────────────────────────────────── */}
      <Section title="Target Card Template" badge="fill in for each target">
        <div className="space-y-4">
          <div className="bg-blue-900/10 border border-blue-800/30 rounded-xl p-3 text-xs text-blue-300/70">
            Fill in the card below for each potential target. This is an internal working tool — not sent anywhere.
            The company name and sector are also used to pre-fill the outreach drafts below.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Company name</label>
              <input
                value={cardCompany}
                onChange={(e) => setCardCompany(e.target.value)}
                placeholder="e.g. MedStaff GmbH"
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
              <label className="block text-xs font-medium text-gray-400 mb-1">Sector</label>
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
                placeholder="e.g. Maria Müller, HR Manager"
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
              placeholder="What makes this a good pilot candidate?"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Risk notes</label>
            <textarea
              value={cardRisk}
              onChange={(e) => setCardRisk(e.target.value)}
              rows={2}
              placeholder="Any compliance, legal, or reputational risks to be aware of?"
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
      <Section title="Fit Score" badge="0–100">
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
                Check all criteria that apply to this target
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
      <Section title="Red Flags">
        {hasHighRiskFlag && (
          <div className="mb-4 bg-red-900/20 border border-red-800/40 rounded-xl p-3">
            <p className="text-red-300 text-sm font-semibold">
              ⚠ High-risk flag detected — do not proceed without legal review.
            </p>
          </div>
        )}
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

      {/* ── Outreach Drafts ─────────────────────────────────────────────── */}
      <Section title="Manual Outreach Pack" badge="copy-only — no send button">
        <div className="space-y-4">
          <div className="bg-blue-900/10 border border-blue-800/30 rounded-xl p-3 text-xs text-blue-300/70">
            Copy and send manually. No send button. No automatic outreach.
            Signed: CorridorWork Team. Uses company name and sector from Target Card above.
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
              <span className="text-xs text-gray-500">{activeDraft.channel} — {activeDraft.note}</span>
              <CopyButton text={activeDraft.text} />
            </div>
            <pre className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 text-sm text-gray-200 whitespace-pre-wrap font-sans leading-relaxed">
              {activeDraft.text}
            </pre>
          </div>
        </div>
      </Section>

      {/* ── Quick Links ─────────────────────────────────────────────────── */}
      <Section title="Related Admin Pages">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { href: '/admin/first-pilot',       label: 'First Pilot Assistant',       desc: '4-step outreach + response drafts' },
            { href: '/admin/revenue-inbox',      label: 'Revenue Inbox',               desc: 'All inbound leads' },
            { href: '/admin/pilot-target-finder',label: 'Pilot Target Finder',         desc: 'Search string suggestions (no scraping)' },
            { href: '/global/employers',         label: '/global/employers',           desc: 'Public employer intake page' },
            { href: '/partners',                 label: '/partners',                   desc: 'Public partner enquiry page' },
            { href: '/strategic-partnership',    label: '/strategic-partnership',      desc: 'Public strategic partnership page' },
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
