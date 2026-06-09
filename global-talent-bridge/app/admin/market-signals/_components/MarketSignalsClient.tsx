'use client'

import { useState } from 'react'
import {
  MARKET_SIGNAL_STATE,
  BUYER_PROFILES,
  PILOT_CUSTOMER_PROFILES,
  PARTNER_PROFILES,
  OUTREACH_TEMPLATES,
  REAL_RESPONSES,
  type SignalProfile,
  type OutreachTemplate,
} from '@/lib/market-signals'

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab =
  | 'overview'
  | 'buyers'
  | 'pilot-customers'
  | 'partners'
  | 'templates'
  | 'responses'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'overview',        label: 'Overview',          icon: '📡' },
  { id: 'buyers',          label: 'Buyer Profiles',    icon: '🏢' },
  { id: 'pilot-customers', label: 'Pilot Customers',   icon: '🏥' },
  { id: 'partners',        label: 'Partners',          icon: '🤝' },
  { id: 'templates',       label: 'Templates',         icon: '✉️' },
  { id: 'responses',       label: 'Response Log',      icon: '📋' },
]

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ label, color }: { label: string; color: 'yellow' | 'green' | 'red' | 'gray' }) {
  const cls = {
    yellow: 'bg-yellow-900/40 border-yellow-700/40 text-yellow-300',
    green:  'bg-green-900/40 border-green-700/40 text-green-300',
    red:    'bg-red-900/40 border-red-700/40 text-red-300',
    gray:   'bg-gray-800 border-gray-700 text-gray-400',
  }[color]
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${cls}`}>
      {label}
    </span>
  )
}

function ProfileCard({ profile }: { profile: SignalProfile }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-white">{profile.label}</h3>
            <StatusBadge label="Not started" color="gray" />
            <StatusBadge label="Approval required" color="yellow" />
          </div>
          <p className="mt-1 text-xs text-gray-400">{profile.description}</p>
        </div>
        <button
          onClick={() => setExpanded(v => !v)}
          className="shrink-0 text-xs text-gray-500 hover:text-white transition-colors"
        >
          {expanded ? 'Collapse ▲' : 'Expand ▼'}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 space-y-3 border-t border-gray-800 pt-4 text-xs">
          <div>
            <span className="text-gray-500 font-medium uppercase tracking-wide">Why relevant</span>
            <p className="mt-1 text-gray-300">{profile.whyRelevant}</p>
          </div>
          <div>
            <span className="text-gray-500 font-medium uppercase tracking-wide">Core problem</span>
            <p className="mt-1 text-gray-300">{profile.coreProblem}</p>
          </div>
          <div>
            <span className="text-gray-500 font-medium uppercase tracking-wide">Why CW fits</span>
            <p className="mt-1 text-gray-300">{profile.whyCWFits}</p>
          </div>
          <div className="rounded-md bg-blue-950/40 border border-blue-800/40 p-3">
            <span className="text-blue-400 font-medium uppercase tracking-wide text-xs">Proof question</span>
            <p className="mt-1 text-blue-200 italic">&ldquo;{profile.proofQuestion}&rdquo;</p>
          </div>
          <div className="rounded-md bg-yellow-950/30 border border-yellow-800/30 p-3">
            <span className="text-yellow-400 font-medium uppercase tracking-wide text-xs">⚠️ Compliance note</span>
            <p className="mt-1 text-yellow-200 text-xs">{profile.complianceNote}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function TemplateCard({ template }: { template: OutreachTemplate }) {
  const [expanded, setExpanded] = useState(false)
  const audienceColor = {
    'buyer': 'purple',
    'pilot-customer': 'green',
    'partner': 'blue',
  }[template.audience] as 'purple' | 'green' | 'blue'

  const audienceCls = {
    purple: 'bg-purple-900/40 border-purple-700/40 text-purple-300',
    green:  'bg-green-900/40 border-green-700/40 text-green-300',
    blue:   'bg-blue-900/40 border-blue-700/40 text-blue-300',
  }[audienceColor]

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-white">{template.label}</h3>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${audienceCls}`}>
              {template.audience}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-400 font-mono">Subject: {template.subject}</p>
        </div>
        <button
          onClick={() => setExpanded(v => !v)}
          className="shrink-0 text-xs text-gray-500 hover:text-white transition-colors"
        >
          {expanded ? 'Collapse ▲' : 'Expand ▼'}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 space-y-4 border-t border-gray-800 pt-4">
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">Message body</p>
            <pre className="text-xs text-gray-300 whitespace-pre-wrap font-sans leading-relaxed bg-gray-950 rounded-md p-3 border border-gray-800">
              {template.body}
            </pre>
          </div>
          <div>
            <p className="text-xs text-yellow-400 font-medium uppercase tracking-wide mb-2">⚠️ Rules — read before sending</p>
            <ul className="space-y-1">
              {template.rules.map((rule, i) => (
                <li key={i} className="text-xs text-yellow-200 flex items-start gap-2">
                  <span className="text-yellow-500 mt-0.5">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Tab content ───────────────────────────────────────────────────────────────

function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Sprint status */}
      <div className="rounded-lg border border-yellow-700/40 bg-yellow-950/20 p-5">
        <h2 className="text-sm font-semibold text-yellow-300 mb-3">Sprint Status</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Sprint', value: MARKET_SIGNAL_STATE.sprintStatus },
            { label: 'Outreach sent', value: MARKET_SIGNAL_STATE.outreachSent.toString() },
            { label: 'Responses', value: MARKET_SIGNAL_STATE.responsesReceived.toString() },
            { label: 'Proof items', value: MARKET_SIGNAL_STATE.realProofItems.toString() },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="text-xl font-bold text-white">{value}</div>
              <div className="text-xs text-gray-400 mt-1">{label}</div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-yellow-200 border-t border-yellow-700/30 pt-3">
          {MARKET_SIGNAL_STATE.disclaimer}
        </p>
      </div>

      {/* Safety constraints */}
      <div className="rounded-lg border border-red-800/40 bg-red-950/20 p-5">
        <h2 className="text-sm font-semibold text-red-300 mb-3">⚠️ Absolute safety constraints</h2>
        <ul className="space-y-1.5">
          {[
            { flag: MARKET_SIGNAL_STATE.noAutoSend,         label: 'No auto-send — every message sent manually by the founder' },
            { flag: MARKET_SIGNAL_STATE.noScraping,         label: 'No scraping — all contacts identified manually' },
            { flag: MARKET_SIGNAL_STATE.noFakeResponses,    label: 'No fake responses — only real written replies count as proof' },
            { flag: MARKET_SIGNAL_STATE.manualApprovalOnly, label: 'Manual approval only — no scheduled or automated outreach' },
          ].map(({ flag, label }) => (
            <li key={label} className="flex items-center gap-2 text-xs">
              <span className={flag ? 'text-green-400' : 'text-red-400'}>{flag ? '✓' : '✗'}</span>
              <span className="text-gray-300">{label}</span>
            </li>
          ))}
          {[
            'No job guarantee',
            'No visa guarantee',
            'No placement guarantee',
            'No candidate fees',
            'No fake MRR',
            'No fake customers',
          ].map(label => (
            <li key={label} className="flex items-center gap-2 text-xs">
              <span className="text-green-400">✓</span>
              <span className="text-gray-300">{label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Profile counts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Buyer profiles', count: BUYER_PROFILES.length, icon: '🏢', color: 'purple' },
          { label: 'Pilot customer profiles', count: PILOT_CUSTOMER_PROFILES.length, icon: '🏥', color: 'green' },
          { label: 'Partner profiles', count: PARTNER_PROFILES.length, icon: '🤝', color: 'blue' },
        ].map(({ label, count, icon, color }) => (
          <div
            key={label}
            className={`rounded-lg border p-4 ${
              color === 'purple' ? 'border-purple-700/40 bg-purple-950/20'
              : color === 'green' ? 'border-green-700/40 bg-green-950/20'
              : 'border-blue-700/40 bg-blue-950/20'
            }`}
          >
            <div className="text-2xl mb-2">{icon}</div>
            <div className="text-2xl font-bold text-white">{count}</div>
            <div className="text-xs text-gray-400 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Docs reference */}
      <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
        <h2 className="text-sm font-semibold text-white mb-3">Playbook documents</h2>
        <ul className="space-y-2 text-xs text-gray-400">
          <li>📄 <code>docs/market-signals/manual-outreach-playbook.md</code> — Step-by-step outreach guide</li>
          <li>📄 <code>docs/market-signals/target-buyer-profiles.md</code> — Buyer profile details</li>
          <li>📄 <code>docs/market-signals/pilot-customer-profiles.md</code> — Pilot customer details</li>
          <li>📄 <code>docs/market-signals/partner-profiles.md</code> — Partner profile details</li>
          <li>📄 <code>docs/market-signals/response-evidence-log-template.md</code> — Log template</li>
          <li>📄 <code>docs/market-signals/loi-email-template.md</code> — LOI template (buyer use only)</li>
        </ul>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function MarketSignalsClient() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  return (
    <div>
      {/* Tab bar */}
      <div className="flex flex-wrap gap-1 mb-6 border-b border-gray-800 pb-3">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <span className="mr-1.5">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && <OverviewTab />}

      {activeTab === 'buyers' && (
        <div className="space-y-4">
          <p className="text-xs text-gray-400">
            {BUYER_PROFILES.length} acquisition target profile types. No real contacts stored here.
            All outreach manual and reviewed before sending.
          </p>
          {BUYER_PROFILES.map(profile => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      )}

      {activeTab === 'pilot-customers' && (
        <div className="space-y-4">
          <p className="text-xs text-gray-400">
            {PILOT_CUSTOMER_PROFILES.length} pilot customer profile types. These are employer organisation types,
            not real named companies. All outreach manual.
          </p>
          {PILOT_CUSTOMER_PROFILES.map(profile => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      )}

      {activeTab === 'partners' && (
        <div className="space-y-4">
          <p className="text-xs text-gray-400">
            {PARTNER_PROFILES.length} partner profile types for distribution and channel development.
            All outreach manual.
          </p>
          {PARTNER_PROFILES.map(profile => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div className="rounded-md bg-yellow-950/30 border border-yellow-800/30 p-3 text-xs text-yellow-200">
            ⚠️ These templates must be personalised and reviewed before sending. No auto-send. No bulk send.
            Each message sent manually, one at a time.
          </div>
          {OUTREACH_TEMPLATES.map(template => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}

      {activeTab === 'responses' && (
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-center">
            <div className="text-4xl mb-3">📋</div>
            <h3 className="text-sm font-semibold text-white mb-1">No responses logged yet</h3>
            <p className="text-xs text-gray-400 max-w-md mx-auto">
              {REAL_RESPONSES.length === 0
                ? 'Sprint prepared — no outreach has been sent. Responses will appear here after real, manual outreach generates real, written replies.'
                : `${REAL_RESPONSES.length} response(s) logged.`}
            </p>
            <p className="mt-3 text-xs text-yellow-300">
              To log a response: add an entry to{' '}
              <code className="text-yellow-200">docs/market-signals/response-evidence-log-template.md</code>
            </p>
          </div>
          {REAL_RESPONSES.length > 0 && (
            <div className="space-y-3">
              {REAL_RESPONSES.map((entry, i) => (
                <div key={i} className="rounded-lg border border-gray-700 bg-gray-900 p-4 text-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <StatusBadge
                      label={entry.interestLevel}
                      color={
                        entry.interestLevel === 'high' ? 'green'
                        : entry.interestLevel === 'medium' ? 'yellow'
                        : 'gray'
                      }
                    />
                    <span className="text-gray-400">{entry.date}</span>
                    <span className="text-gray-500">·</span>
                    <span className="text-gray-400">{entry.contactType}</span>
                    <span className="text-gray-500">·</span>
                    <span className="text-gray-400">{entry.organization}</span>
                  </div>
                  <p className="text-gray-300">{entry.notes}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
