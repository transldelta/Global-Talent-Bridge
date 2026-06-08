'use client'

/**
 * MarketProofLaunchClient.tsx
 *
 * Sections A–G for /admin/market-proof-launch:
 *   A. Overview & Launch Steps
 *   B. Campaigns
 *   C. Targets
 *   D. Reply Tracker
 *   E. Reply Classification Guide
 *   F. Buyer Outreach Pack
 *   G. Proof Export
 *
 * ⚠️  No automatic send. No scraping. No fake customers. No fake revenue.
 */

import { useState } from 'react'
import {
  CAMPAIGNS,
  CAMPAIGN_TARGETS,
  LAUNCH_STEPS,
  REPLY_CLASSIFICATIONS,
  BUYER_OUTREACH_TEXTS,
  INITIAL_PROOF_STATE,
  REAL_REPLIES,
  generateProofExport,
  type CampaignId,
  type ProofTrackerState,
} from '@/lib/market-proof-launch'

// ── Tab type ──────────────────────────────────────────────────────────────────

type Tab =
  | 'overview'
  | 'campaigns'
  | 'targets'
  | 'tracker'
  | 'classification'
  | 'outreach-pack'
  | 'export'

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview',        label: 'A. Overview'          },
  { id: 'campaigns',       label: 'B. Campaigns'         },
  { id: 'targets',         label: 'C. Targets'           },
  { id: 'tracker',         label: 'D. Reply Tracker'     },
  { id: 'classification',  label: 'E. Classification'    },
  { id: 'outreach-pack',   label: 'F. Outreach Pack'     },
  { id: 'export',          label: 'G. Export'            },
]

// ── Small helpers ─────────────────────────────────────────────────────────────

function Badge({
  children,
  color,
}: {
  children: React.ReactNode
  color: 'green' | 'yellow' | 'red' | 'gray' | 'blue' | 'purple' | 'orange'
}) {
  const cls: Record<string, string> = {
    green:  'bg-green-900 text-green-200 border-green-700',
    yellow: 'bg-yellow-900 text-yellow-200 border-yellow-700',
    red:    'bg-red-900   text-red-200   border-red-700',
    gray:   'bg-gray-800  text-gray-300  border-gray-600',
    blue:   'bg-blue-900  text-blue-200  border-blue-700',
    purple: 'bg-purple-900 text-purple-200 border-purple-700',
    orange: 'bg-orange-900 text-orange-200 border-orange-700',
  }
  return (
    <span
      className={`inline-block text-xs font-semibold px-2 py-0.5 rounded border ${cls[color]}`}
    >
      {children}
    </span>
  )
}

function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    void navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded transition-colors"
    >
      {copied ? '✓ Copied' : label}
    </button>
  )
}

function SafetyBanner() {
  return (
    <div className="bg-yellow-950 border border-yellow-700 rounded-lg p-4 mb-6">
      <p className="text-yellow-200 text-sm font-semibold mb-1">
        ⚠️ Safety Constraints (always active)
      </p>
      <ul className="text-yellow-300 text-xs space-y-0.5 list-disc list-inside">
        <li>No automatic send — every message requires manual review and manual sending</li>
        <li>No scraping — all contacts found manually</li>
        <li>No fake customers — no fabricated testimonials or contacts</li>
        <li>No fake revenue — no staged transactions</li>
        <li>No job guarantee — no visa guarantee</li>
        <li>Test data does NOT count as market proof</li>
        <li>No Stripe activation</li>
      </ul>
    </div>
  )
}

// ── Tab A: Overview ───────────────────────────────────────────────────────────

function OverviewTab() {
  return (
    <div className="space-y-8">
      <SafetyBanner />

      <div>
        <h2 className="text-xl font-bold text-white mb-2">Market Proof Launch</h2>
        <p className="text-gray-300 text-sm leading-relaxed max-w-3xl">
          The Sale Readiness Score is currently ~65/100. The two gaps holding it back are{' '}
          <strong className="text-yellow-300">market_proof (8/100)</strong> and{' '}
          <strong className="text-yellow-300">revenue_proof (5/100)</strong>. This section
          guides you through collecting 1–3 real market replies — the single highest-impact
          action before any buyer conversation.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Launch Steps</h3>
        <div className="space-y-3">
          {LAUNCH_STEPS.map((s) => (
            <div
              key={s.step}
              className="flex gap-4 bg-gray-800 rounded-lg p-4 border border-gray-700"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center text-sm font-bold text-gray-300">
                {s.step}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm">{s.label}</p>
                <p className="text-gray-400 text-xs mt-0.5">{s.action}</p>
                <p className="text-gray-500 text-xs mt-0.5 italic">Tool: {s.tool}</p>
              </div>
              <div className="flex-shrink-0">
                {s.done ? (
                  <Badge color="green">Done</Badge>
                ) : (
                  <Badge color="gray">Pending</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
        <h3 className="text-base font-semibold text-white mb-3">Why market proof matters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div>
            <p className="font-semibold text-green-300 mb-1">Without proof</p>
            <ul className="list-disc list-inside space-y-0.5 text-xs text-gray-400">
              <li>Sale Readiness Score: ~65/100</li>
              <li>Valuation: 49 000–79 000 € range</li>
              <li>Buyer position: &quot;interesting asset&quot;</li>
              <li>Buyer risk perception: high</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-green-300 mb-1">With 1–3 real replies</p>
            <ul className="list-disc list-inside space-y-0.5 text-xs text-gray-400">
              <li>Sale Readiness Score: 75–80/100</li>
              <li>Valuation: moves toward 79 000 € ceiling</li>
              <li>Buyer position: &quot;validated market signal&quot;</li>
              <li>Buyer risk perception: reduced significantly</li>
            </ul>
          </div>
        </div>
        <p className="text-xs text-yellow-400 mt-3 italic">
          ⚠️ Only real replies count. Simulated, test, or staged replies are excluded by definition.
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
        <h3 className="text-base font-semibold text-white mb-2">Navigation links</h3>
        <div className="flex flex-wrap gap-3 text-xs">
          <a href="/admin/global-growth-department" className="text-blue-400 hover:underline">
            → Global Growth Department (target pipeline)
          </a>
          <a href="/admin/contact-copilot" className="text-blue-400 hover:underline">
            → Contact Copilot (draft + send manually)
          </a>
          <a href="/admin/buyer-room" className="text-blue-400 hover:underline">
            → Buyer Room (sale readiness score)
          </a>
          <a href="/admin/corridor-intelligence" className="text-blue-400 hover:underline">
            → Corridor Intelligence (buyer opportunity scores)
          </a>
        </div>
      </div>
    </div>
  )
}

// ── Tab B: Campaigns ──────────────────────────────────────────────────────────

function CampaignsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-2">Campaigns</h2>
        <p className="text-gray-400 text-sm">
          Three outreach campaigns targeting 45 contacts total. All targets require manual
          contact research — placeholders only, no real contact data stored here.
        </p>
      </div>

      {CAMPAIGNS.map((c) => (
        <div key={c.id} className="bg-gray-800 rounded-lg p-5 border border-gray-700">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className="text-base font-bold text-white">{c.label}</h3>
            <div className="flex gap-2 flex-shrink-0">
              <Badge color={c.priority === 'high' ? 'green' : c.priority === 'medium' ? 'yellow' : 'gray'}>
                {c.priority} priority
              </Badge>
              <Badge color={c.status === 'ready-to-launch' ? 'blue' : c.status === 'in-progress' ? 'yellow' : 'green'}>
                {c.status}
              </Badge>
            </div>
          </div>

          <p className="text-gray-300 text-sm mb-3">{c.goal}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-3">
            <div className="bg-gray-700 rounded p-2">
              <p className="text-gray-400">Targets</p>
              <p className="text-white font-bold text-base">{c.targetCount}</p>
            </div>
            <div className="bg-gray-700 rounded p-2 col-span-1 md:col-span-3">
              <p className="text-gray-400 mb-1">Target types</p>
              <div className="flex flex-wrap gap-1">
                {c.targetTypes.map((t) => (
                  <span key={t} className="bg-gray-600 text-gray-300 px-1.5 py-0.5 rounded text-xs">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded p-3 text-xs text-gray-300 border border-gray-600">
            <span className="text-gray-500 mr-1">Corridor:</span>{c.corridor}
          </div>

          <p className="text-gray-400 text-xs mt-2 italic">{c.note}</p>
        </div>
      ))}
    </div>
  )
}

// ── Tab C: Targets ────────────────────────────────────────────────────────────

function TargetsTab() {
  const [filter, setFilter] = useState<CampaignId | 'all'>('all')

  const displayed = filter === 'all'
    ? CAMPAIGN_TARGETS
    : CAMPAIGN_TARGETS.filter((t) => t.campaignId === filter)

  const campaignLabel: Record<CampaignId, string> = {
    'germany-healthcare': 'Campaign A',
    'partner-channels':   'Campaign B',
    'buyer-candidates':   'Campaign C',
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-white mb-2">Targets</h2>
        <p className="text-gray-400 text-sm mb-4">
          45 placeholder targets. All have status <code className="bg-gray-700 px-1 rounded">real_contact_needed</code>.
          No real contact data stored here — use Growth Department to record actual contacts.
        </p>
        <div className="flex gap-2 flex-wrap">
          {(['all', 'germany-healthcare', 'partner-channels', 'buyer-candidates'] as const).map(
            (f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs px-3 py-1.5 rounded border transition-colors ${
                  filter === f
                    ? 'bg-blue-700 border-blue-500 text-white'
                    : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-400'
                }`}
              >
                {f === 'all' ? `All (${CAMPAIGN_TARGETS.length})` : `${campaignLabel[f]} (${CAMPAIGN_TARGETS.filter((t) => t.campaignId === f).length})`}
              </button>
            ),
          )}
        </div>
      </div>

      <div className="space-y-2">
        {displayed.map((t) => (
          <div
            key={t.id}
            className="bg-gray-800 rounded-lg p-3 border border-gray-700 flex gap-3 items-start"
          >
            <div className="flex-shrink-0 text-xs text-gray-500 w-8 text-right pt-0.5">{t.id}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="text-white text-sm font-medium">{t.targetType}</span>
                <Badge color="gray">{t.country}</Badge>
                <Badge color="blue">{t.contactChannel}</Badge>
                <Badge color={campaignLabel[t.campaignId] === 'Campaign A' ? 'green' : campaignLabel[t.campaignId] === 'Campaign B' ? 'yellow' : 'purple'}>
                  {campaignLabel[t.campaignId]}
                </Badge>
              </div>
              <p className="text-gray-400 text-xs">{t.note}</p>
            </div>
            <div className="flex-shrink-0">
              <Badge color="orange">needs contact</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Tab D: Reply Tracker ──────────────────────────────────────────────────────

function TrackerTab() {
  const [tracker, setTracker] = useState<ProofTrackerState>(INITIAL_PROOF_STATE)

  const update = (key: keyof ProofTrackerState, value: number | string | boolean) => {
    setTracker((prev) => ({ ...prev, [key]: value }))
  }

  const numberField = (
    label: string,
    key: keyof ProofTrackerState,
    note?: string,
  ) => (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <label className="block text-xs text-gray-400 mb-1">{label}</label>
      <input
        type="number"
        min={0}
        value={tracker[key] as number}
        onChange={(e) => update(key, parseInt(e.target.value, 10) || 0)}
        className="w-full bg-gray-700 text-white rounded px-3 py-1.5 text-sm border border-gray-600 focus:border-blue-500 focus:outline-none"
      />
      {note && <p className="text-xs text-gray-500 mt-1">{note}</p>}
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-2">Reply Tracker</h2>
        <p className="text-gray-400 text-sm">
          Track your outreach activity manually. Update after each real action.
          Values here populate the proof export for buyers.
        </p>
      </div>

      <div className="bg-yellow-950 border border-yellow-700 rounded-lg p-3 text-yellow-300 text-xs">
        ⚠️ Only real actions count. Do not enter simulated or test values here.
        Buyers may ask to verify these numbers.
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {numberField('Targets prepared', 'targetsPrepared', 'Set target status to draft_ready in Growth Dept')}
        {numberField('Drafts opened (Gmail)', 'draftsOpened', 'Gmail draft link clicked — not yet sent')}
        {numberField('Sent manually', 'sentManually', 'You pressed Send in Gmail yourself')}
        {numberField('Replies received', 'repliesReceived', 'Real reply from a real contact')}
        {numberField('Positive replies', 'positiveReplies', 'positive_interest or wants_more_info')}
        {numberField('Neutral replies', 'neutralReplies', 'Responded but no clear interest')}
        {numberField('Rejected', 'rejectedReplies', 'Declined or opted out')}
        {numberField('Legal risk signals', 'legalRiskReplies', 'Raised a compliance concern')}
        {numberField('Buyer interest leads', 'buyerInterestLeads', 'Expressed interest in acquiring the platform')}
      </div>

      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <label className="block text-xs text-gray-400 mb-1">Proof notes (internal)</label>
        <textarea
          value={tracker.proofNotes}
          onChange={(e) => update('proofNotes', e.target.value)}
          rows={4}
          placeholder="e.g. 'Received positive response from language school in Casablanca — asked for demo call'"
          className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
        />
        <p className="text-xs text-gray-500 mt-1">
          Anonymise before showing to buyers. No PII in the export.
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex items-center gap-3">
        <input
          type="checkbox"
          id="buyerVisible"
          checked={tracker.buyerVisibleProof}
          onChange={(e) => update('buyerVisibleProof', e.target.checked)}
          className="w-4 h-4 rounded"
        />
        <label htmlFor="buyerVisible" className="text-sm text-gray-300">
          Mark as buyer-visible proof — I confirm the above values are real and accurate
        </label>
      </div>

      <div className="bg-gray-900 rounded-lg p-4 border border-gray-600">
        <p className="text-sm font-semibold text-white mb-2">Activity summary</p>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-400">{tracker.targetsPrepared}</p>
            <p className="text-xs text-gray-500">prepared</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-400">{tracker.sentManually}</p>
            <p className="text-xs text-gray-500">sent</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-400">{tracker.repliesReceived}</p>
            <p className="text-xs text-gray-500">replies</p>
          </div>
        </div>
        {tracker.repliesReceived === 0 && (
          <p className="text-center text-xs text-yellow-400 mt-3">
            No replies yet — outreach execution pending.
          </p>
        )}
      </div>
    </div>
  )
}

// ── Tab E: Classification ─────────────────────────────────────────────────────

function ClassificationTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-2">Reply Classification Guide</h2>
        <p className="text-gray-400 text-sm">
          Use these categories when a real reply arrives. Classification determines whether a
          reply appears in the buyer-visible proof export.
        </p>
      </div>

      <div className="space-y-3">
        {REPLY_CLASSIFICATIONS.map((r) => (
          <div
            key={r.value}
            className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex gap-4 items-start"
          >
            <div className="flex-shrink-0 w-32">
              <Badge
                color={
                  r.buyerValue === 'high'   ? 'green'  :
                  r.buyerValue === 'medium' ? 'yellow' :
                  r.buyerValue === 'low'    ? 'orange' :
                  'gray'
                }
              >
                {r.buyerValue} buyer value
              </Badge>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm">{r.label}</p>
              <p className="text-gray-400 text-xs mt-0.5">{r.description}</p>
              <p className="text-gray-600 text-xs mt-1 font-mono">{r.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <p className="text-sm font-semibold text-white mb-2">Which replies go to buyers?</p>
        <p className="text-gray-400 text-xs">
          Only replies classified as <strong className="text-green-300">positive_interest</strong>,{' '}
          <strong className="text-green-300">wants_more_info</strong>, or{' '}
          <strong className="text-green-300">buyer_interest</strong> appear in the buyer proof
          export — and only when you explicitly toggle &quot;buyer visible&quot; on the reply.
          Neutral, rejected, and legal-risk replies are internal only unless you choose to include them.
        </p>
        <p className="text-yellow-400 text-xs mt-2 italic">
          Always anonymise: remove names, companies, email addresses before marking as buyer-visible.
        </p>
      </div>
    </div>
  )
}

// ── Tab F: Outreach Pack ──────────────────────────────────────────────────────

function OutreachPackTab() {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-white mb-2">Buyer Outreach Pack</h2>
        <p className="text-gray-400 text-sm">
          Copy-ready templates for each buyer type. Personalise before sending.
          All templates are honest about asset stage and gaps.
        </p>
      </div>

      <div className="bg-yellow-950 border border-yellow-700 rounded-lg p-3 text-yellow-300 text-xs">
        ⚠️ These are templates. Replace [Name], [Company], and personalise context before
        sending. Send manually only. Never send in bulk without personalisation.
      </div>

      <div className="space-y-3">
        {BUYER_OUTREACH_TEXTS.map((t) => (
          <div key={t.id} className="bg-gray-800 rounded-lg border border-gray-700">
            <button
              onClick={() => setExpanded(expanded === t.id ? null : t.id)}
              className="w-full flex items-center justify-between px-4 py-3 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-white font-semibold text-sm">{t.label}</span>
                <Badge color={t.channel === 'dm' ? 'blue' : t.channel === 'email' ? 'green' : t.channel === 'listing' ? 'purple' : 'orange'}>
                  {t.channel}
                </Badge>
              </div>
              <span className="text-gray-400 text-xs">{expanded === t.id ? '▲ collapse' : '▼ expand'}</span>
            </button>

            {expanded === t.id && (
              <div className="px-4 pb-4 space-y-3">
                {t.subject && (
                  <div className="bg-gray-700 rounded p-2">
                    <p className="text-xs text-gray-400 mb-0.5">Subject line:</p>
                    <p className="text-white text-sm font-medium">{t.subject}</p>
                  </div>
                )}
                <div className="bg-gray-900 rounded p-3 border border-gray-600">
                  <pre className="text-gray-300 text-xs whitespace-pre-wrap font-sans leading-relaxed">
                    {t.body}
                  </pre>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-500 text-xs italic">{t.note}</p>
                  <CopyButton text={t.body} label="Copy template" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Tab G: Export ─────────────────────────────────────────────────────────────

function ExportTab() {
  const [tracker] = useState<ProofTrackerState>(INITIAL_PROOF_STATE)
  const today = new Date().toISOString().split('T')[0]
  const exportText = generateProofExport(tracker, REAL_REPLIES, today ?? 'unknown')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-2">Proof Export for Buyer</h2>
        <p className="text-gray-400 text-sm">
          This export is generated from your Reply Tracker values. Share with buyers during
          due diligence. The export is always honest — it reflects current state, including
          zero replies if none have been collected.
        </p>
      </div>

      <div className="bg-yellow-950 border border-yellow-700 rounded-lg p-3 text-yellow-300 text-xs">
        ⚠️ Update the Reply Tracker (Tab D) with real values before sharing this export.
        The export below currently reflects the initial state (0 replies).
      </div>

      <div className="bg-gray-900 rounded-lg p-4 border border-gray-600">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-white">Market Proof Summary</p>
          <CopyButton text={exportText} label="Copy full export" />
        </div>
        <pre className="text-gray-300 text-xs whitespace-pre-wrap font-mono leading-relaxed max-h-96 overflow-y-auto">
          {exportText}
        </pre>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <p className="text-sm font-semibold text-white mb-2">What to tell buyers</p>
        <ul className="text-gray-400 text-xs space-y-1 list-disc list-inside">
          <li>Market proof is at early stage — outreach not yet executed</li>
          <li>The platform is designed to generate this proof: campaigns, templates, and tracking are all in place</li>
          <li>Buyers can activate the outreach immediately after transfer</li>
          <li>Be transparent: no replies yet. This builds trust.</li>
        </ul>
      </div>

      <div className="bg-blue-950 rounded-lg p-4 border border-blue-700">
        <p className="text-sm font-semibold text-white mb-1">Next step</p>
        <p className="text-blue-300 text-xs">
          Execute outreach → collect real replies → update tracker → re-export. Target: 1–3
          real written replies before the first buyer conversation.
        </p>
        <a
          href="/admin/buyer-room"
          className="inline-block mt-2 text-xs text-blue-400 hover:underline"
        >
          → View Sale Readiness Score in Buyer Room
        </a>
      </div>
    </div>
  )
}

// ── Root client component ─────────────────────────────────────────────────────

export function MarketProofLaunchClient() {
  const [tab, setTab] = useState<Tab>('overview')

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-white">Market Proof Launch</h1>
          <span className="text-xs bg-yellow-700 text-yellow-200 px-2 py-0.5 rounded font-semibold">
            ASSET STAGE
          </span>
        </div>
        <p className="text-gray-400">
          Collect 1–3 real market replies to raise the Sale Readiness Score from ~65 to 75+.
          Manual outreach only. No automatic sending.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-800 pb-3">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`text-sm px-4 py-2 rounded-t border-b-2 transition-colors ${
              tab === t.id
                ? 'border-blue-500 text-blue-400 bg-gray-800'
                : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'overview'       && <OverviewTab />}
      {tab === 'campaigns'      && <CampaignsTab />}
      {tab === 'targets'        && <TargetsTab />}
      {tab === 'tracker'        && <TrackerTab />}
      {tab === 'classification' && <ClassificationTab />}
      {tab === 'outreach-pack'  && <OutreachPackTab />}
      {tab === 'export'         && <ExportTab />}
    </div>
  )
}
