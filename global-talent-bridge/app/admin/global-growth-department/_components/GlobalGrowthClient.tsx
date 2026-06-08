'use client'

/**
 * app/admin/global-growth-department/_components/GlobalGrowthClient.tsx
 *
 * CEO Global Growth Department — persistent Supabase-backed pipeline.
 * No automatic sending. No send button. No scraping.
 * Manual approval required. Manual send only.
 */

import { useState, useId, useCallback } from 'react'
import Link from 'next/link'
import {
  CORRIDORS,
  DESTINATION_MARKETS,
  SOURCE_MARKETS,
  GROWTH_SECTORS,
  MESSAGE_TYPE_CONFIG,
  QUEUE_STATUS_OPTIONS,
  SEARCH_PLAYBOOK,
  GROWTH_OPERATING_RULES,
  SENDER_EMAIL,
  generateGrowthMessage,
  generateGmailDraftUrl,
  generateContactFormSnippet,
  generateSearchUrl,
  parseQuickAddBulk,
  generateBatchTargets,
} from '@/lib/global-growth-department'
import type {
  GrowthTarget,
  MessageType,
  TargetKind,
  QueueStatus,
  BatchSpec,
} from '@/lib/global-growth-department'

// ── Helpers ───────────────────────────────────────────────────────────────────

function CopyBtn({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [ok, setOk] = useState(false)
  async function go() {
    try { await navigator.clipboard.writeText(text) } catch {
      const el = document.createElement('textarea')
      el.value = text; document.body.appendChild(el); el.select()
      document.execCommand('copy'); document.body.removeChild(el)
    }
    setOk(true); setTimeout(() => setOk(false), 2200)
  }
  return (
    <button onClick={go} className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors shrink-0 ${ok ? 'bg-green-700 text-green-100' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'}`}>
      {ok ? '✅ Copied' : `📋 ${label}`}
    </button>
  )
}

function Badge({ label, color }: { label: string; color: 'green' | 'yellow' | 'red' | 'blue' | 'gray' }) {
  const cls = { green: 'bg-green-900/30 text-green-400 border-green-800/40', yellow: 'bg-yellow-900/30 text-yellow-400 border-yellow-800/40', red: 'bg-red-900/30 text-red-400 border-red-800/40', blue: 'bg-blue-900/30 text-blue-300 border-blue-800/40', gray: 'bg-gray-800 text-gray-400 border-gray-700' }
  return <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${cls[color]}`}>{label}</span>
}

type Tab = 'ceo' | 'employer' | 'candidate' | 'partner' | 'queue'

const TABS: { id: Tab; label: string }[] = [
  { id: 'ceo',       label: 'CEO Growth Control'    },
  { id: 'employer',  label: 'Employer Market Agent' },
  { id: 'candidate', label: 'Candidate Source Agent' },
  { id: 'partner',   label: 'Partner Channel Agent'  },
  { id: 'queue',     label: 'Approval Queue'         },
]

// ── Main ──────────────────────────────────────────────────────────────────────

interface Props {
  initialTargets?: Record<string, unknown>[]
  dbError?:        string | null
}

export function GlobalGrowthClient({ initialTargets = [], dbError = null }: Props) {
  const uid = useId()
  const [activeTab, setActiveTab] = useState<Tab>('ceo')

  // Cast server-loaded rows to GrowthTarget shape (best-effort)
  const [queue, setQueue] = useState<GrowthTarget[]>(() =>
    initialTargets.map((row) => ({
      id:            String(row.id ?? ''),
      targetKind:    (row.target_kind as GrowthTarget['targetKind']) ?? 'employer',
      companyName:   String(row.company_name ?? ''),
      contactEmail:  String(row.contact_email ?? ''),
      website:       String(row.website_url ?? ''),
      contactPage:   String(row.contact_page_url ?? ''),
      country:       String(row.country ?? ''),
      sourceMarket:  String(row.source_market ?? ''),
      destMarket:    String(row.destination_market ?? ''),
      sector:        String(row.sector ?? ''),
      corridor:      String(row.corridor ?? ''),
      messageType:   (row.message_type as GrowthTarget['messageType']) ?? 'employer_healthcare',
      fitScore:      Number(row.fit_score ?? 0),
      riskLevel:     (row.risk_level as GrowthTarget['riskLevel']) ?? 'unknown',
      status:        (row.status as GrowthTarget['status']) ?? 'target_profile',
      notes:         String(row.notes ?? ''),
      subject:       '',   // loaded from growth_messages if needed
      body:          '',
      createdAt:     String(row.created_at ?? ''),
    }))
  )

  const [apiError, setApiError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Batch planner state
  const [batchKind,    setBatchKind]    = useState<TargetKind>('employer')
  const [batchCountry, setBatchCountry] = useState('Germany / DACH')
  const [batchSector,  setBatchSector]  = useState('Healthcare')
  const [batchMsgType, setBatchMsgType] = useState<MessageType>('employer_healthcare')
  const [batchCount,   setBatchCount]   = useState(5)

  // Quick Add state
  const [quickText,    setQuickText]    = useState('')
  const [quickResult,  setQuickResult]  = useState<string | null>(null)

  // Queue expanded
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const addToQueue = useCallback(async (items: Omit<GrowthTarget, 'id' | 'createdAt'>[]) => {
    setIsSaving(true); setApiError(null)
    try {
      const payload = items.map((item) => ({
        target_kind:        item.targetKind,
        company_name:       item.companyName,
        contact_email:      item.contactEmail,
        website_url:        item.website,
        contact_page_url:   item.contactPage,
        country:            item.country,
        source_market:      item.sourceMarket,
        destination_market: item.destMarket,
        sector:             item.sector,
        corridor:           item.corridor,
        message_type:       item.messageType,
        fit_score:          item.fitScore,
        risk_level:         item.riskLevel,
        status:             item.status,
        notes:              item.notes,
        message_subject:    item.subject,
        message_body:       item.body,
      }))
      const res = await fetch('/api/admin/growth/targets', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) { setApiError(data.error ?? 'Save failed'); return }
      // Add created items to local queue
      const now = new Date().toISOString()
      const newItems: GrowthTarget[] = (data.created ?? []).map((row: Record<string, unknown>, i: number) => ({
        id:           String(row.id ?? `${uid}-${Date.now()}-${i}`),
        targetKind:   (row.target_kind as GrowthTarget['targetKind']) ?? items[i]?.targetKind ?? 'employer',
        companyName:  String(row.company_name ?? items[i]?.companyName ?? ''),
        contactEmail: String(row.contact_email ?? items[i]?.contactEmail ?? ''),
        website:      String(row.website_url ?? items[i]?.website ?? ''),
        contactPage:  String(row.contact_page_url ?? items[i]?.contactPage ?? ''),
        country:      String(row.country ?? items[i]?.country ?? ''),
        sourceMarket: String(row.source_market ?? items[i]?.sourceMarket ?? ''),
        destMarket:   String(row.destination_market ?? items[i]?.destMarket ?? ''),
        sector:       String(row.sector ?? items[i]?.sector ?? ''),
        corridor:     String(row.corridor ?? items[i]?.corridor ?? ''),
        messageType:  (row.message_type as GrowthTarget['messageType']) ?? items[i]?.messageType ?? 'employer_healthcare',
        fitScore:     Number(row.fit_score ?? items[i]?.fitScore ?? 0),
        riskLevel:    (row.risk_level as GrowthTarget['riskLevel']) ?? items[i]?.riskLevel ?? 'unknown',
        status:       (row.status as GrowthTarget['status']) ?? items[i]?.status ?? 'target_profile',
        notes:        String(row.notes ?? items[i]?.notes ?? ''),
        subject:      items[i]?.subject ?? '',
        body:         items[i]?.body ?? '',
        createdAt:    String(row.created_at ?? now),
      }))
      setQueue((prev) => [...newItems, ...prev])
      if (data.errors?.length) setApiError(`${data.errors.length} item(s) failed to save.`)
    } catch (e) {
      // Fallback: add to local state only (in-memory mode if DB unavailable)
      const now = new Date().toISOString()
      setQueue((prev) => [...prev, ...items.map((item, i) => ({ ...item, id: `${uid}-${Date.now()}-${i}`, createdAt: now }))])
      setApiError('DB unavailable — targets saved in-memory only (not persistent).')
    } finally { setIsSaving(false) }
  }, [uid])

  const updateStatus = useCallback(async (id: string, status: QueueStatus) => {
    setQueue((prev) => prev.map((t) => t.id === id ? { ...t, status } : t))
    // Persist if looks like a real UUID
    if (id.includes('-') && id.length > 10) {
      try {
        await fetch(`/api/admin/growth/targets/${id}`, {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        })
      } catch { /* silent — local state already updated */ }
    }
  }, [])

  const removeFromQueue = useCallback(async (id: string) => {
    setQueue((prev) => prev.filter((t) => t.id !== id))
    if (id.includes('-') && id.length > 10) {
      try {
        await fetch(`/api/admin/growth/targets/${id}`, { method: 'DELETE' })
      } catch { /* silent */ }
    }
  }, [])

  async function handleBatchAdd() {
    const spec: BatchSpec = { targetKind: batchKind, country: batchCountry, sector: batchSector, count: batchCount, messageType: batchMsgType }
    await addToQueue(generateBatchTargets(spec))
  }

  async function handleQuickAdd() {
    const parsed = parseQuickAddBulk(quickText)
    if (!parsed.length) { setQuickResult('No valid lines found. Format: Name | email | Country | Sector | website'); return }
    const items = parsed.map((p) => {
      const msgType = MESSAGE_TYPE_CONFIG.find((m) => m.targetKind === 'employer')?.value ?? 'employer_healthcare' as MessageType
      const msg = generateGrowthMessage(msgType, p.companyName, p.country, p.sector)
      return {
        targetKind:   'employer' as TargetKind,
        companyName:  p.companyName,
        contactEmail: p.contactEmail,
        website:      p.website,
        contactPage:  '',
        country:      p.country,
        sourceMarket: '',
        destMarket:   p.country,
        sector:       p.sector,
        corridor:     '',
        messageType:  msgType,
        fitScore:     0,
        riskLevel:    'low' as const,
        status:       'draft_prepared' as QueueStatus,
        notes:        '',
        subject:      msg.subject,
        body:         msg.body,
      }
    })
    await addToQueue(items)
    setQuickText('')
    setQuickResult(`✅ ${items.length} target(s) added to persistent pipeline.`)
  }

  // Stats
  const stats = {
    total:            queue.length,
    needsContact:     queue.filter((t) => t.status === 'real_contact_needed').length,
    draftPrepared:    queue.filter((t) => t.status === 'draft_prepared').length,
    awaitingReview:   queue.filter((t) => ['needs_review', 'screenshot_review'].includes(t.status)).length,
    approved:         queue.filter((t) => t.status === 'approved_to_send').length,
    sentManually:     queue.filter((t) => t.status === 'sent_manually').length,
    replied:          queue.filter((t) => t.status === 'replied').length,
    employers:        queue.filter((t) => t.targetKind === 'employer').length,
    partners:         queue.filter((t) => t.targetKind === 'partner').length,
    candidateSources: queue.filter((t) => t.targetKind === 'candidate_source').length,
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Global Growth Department</h1>
        <p className="text-gray-400 text-sm mt-1">Internal CEO operations centre — prepares targets, generates messages, builds approval queue. No automatic sending. Manual approval required.</p>
      </div>

      {/* Safety bar */}
      <div className="bg-slate-900 border border-slate-700 rounded-xl px-5 py-3 flex flex-wrap gap-x-5 gap-y-1">
        {['No automatic send', 'No scraping', 'No send button', 'Manual approval required', 'No job guarantee', 'No visa guarantee'].map((r) => (
          <span key={r} className="flex items-center gap-1.5 text-xs text-slate-400"><span className="text-green-500">✓</span>{r}</span>
        ))}
      </div>

      {/* DB status banners */}
      {dbError && (
        <div className="bg-yellow-900/20 border border-yellow-800/40 rounded-xl px-4 py-3 text-xs text-yellow-300/80">
          ⚠ DB connection issue: {dbError}. Targets saved in-memory only until resolved.
        </div>
      )}
      {apiError && (
        <div className="bg-red-900/20 border border-red-800/40 rounded-xl px-4 py-3 text-xs text-red-300/80 flex items-center justify-between">
          <span>⚠ {apiError}</span>
          <button onClick={() => setApiError(null)} className="text-red-400 hover:text-red-300 ml-3">✕</button>
        </div>
      )}
      {isSaving && (
        <div className="bg-blue-900/20 border border-blue-800/40 rounded-xl px-4 py-2 text-xs text-blue-300/80">
          ⏳ Saving to persistent pipeline…
        </div>
      )}

      {/* Tab nav */}
      <div className="flex flex-wrap gap-2 border-b border-gray-800 pb-2">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === t.id ? 'bg-indigo-900/50 text-indigo-300 border-b-2 border-indigo-500' : 'text-gray-500 hover:text-gray-300'}`}>
            {t.label}
            {t.id === 'queue' && queue.length > 0 && <span className="ml-1.5 px-1.5 py-0.5 bg-indigo-700 text-white text-xs rounded-full">{queue.length}</span>}
          </button>
        ))}
      </div>

      {/* ── TAB: CEO Growth Control ──────────────────────────────────── */}
      {activeTab === 'ceo' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total targets',    value: stats.total,         color: 'blue'  },
              { label: 'Need real contact', value: stats.needsContact, color: 'yellow'},
              { label: 'Draft prepared',   value: stats.draftPrepared, color: 'green' },
              { label: 'Awaiting review',  value: stats.awaitingReview,color: 'yellow'},
              { label: 'Approved',         value: stats.approved,      color: 'green' },
              { label: 'Sent manually',    value: stats.sentManually,  color: 'green' },
              { label: 'Replies',          value: stats.replied,       color: 'blue'  },
              { label: 'Employer targets', value: stats.employers,     color: 'gray'  },
              { label: 'Partner targets',  value: stats.partners,      color: 'gray'  },
              { label: 'Candidate sources',value: stats.candidateSources,color:'gray' },
            ].map((s) => (
              <div key={s.label} className="bg-gray-900 border border-gray-700 rounded-xl p-3 text-center">
                <div className={`text-2xl font-bold ${s.color === 'green' ? 'text-green-400' : s.color === 'yellow' ? 'text-yellow-400' : s.color === 'blue' ? 'text-blue-400' : 'text-gray-400'}`}>{s.value}</div>
                <div className="text-xs text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Operating rules */}
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Operating Rules — always active</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {GROWTH_OPERATING_RULES.map((r) => (
                <div key={r} className="flex items-start gap-2 text-xs">
                  <span className="text-green-400 shrink-0">✓</span>
                  <span className="text-gray-400">{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Export growth pipeline JSON */}
          <ExportPanel />

          {/* Next action */}
          <div className="bg-indigo-950/40 border border-indigo-800/40 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-indigo-300 mb-2">Next safe action</h2>
            <ol className="space-y-2">
              {[
                'Choose a corridor or target type in one of the Agent tabs',
                'Use Batch Planner or Quick Add to populate the Approval Queue',
                'Use Search Playbook to find real company names',
                'Open each target in Approval Queue — review, update with real data',
                'Open Gmail draft or copy message',
                'Take screenshot, review, then send manually',
              ].map((s, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-indigo-200/70">
                  <span className="w-5 h-5 rounded-full bg-indigo-800/60 text-indigo-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>

          {/* Corridor overview */}
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Global Corridor Map</h2>
            <div className="space-y-2">
              {CORRIDORS.map((c) => (
                <div key={c.id} className="bg-gray-800/40 border border-gray-700 rounded-xl p-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-sm text-white font-medium">{c.label}</span>
                    <Badge label={c.riskLevel + ' risk'} color={c.riskLevel === 'low' ? 'green' : c.riskLevel === 'medium' ? 'yellow' : 'red'} />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{c.sectors.join(' · ')}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: Employer Market Agent ───────────────────────────────── */}
      {activeTab === 'employer' && (
        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-white">Employer Market Agent</h2>
            <p className="text-xs text-gray-500">Target employers in destination markets. Sectors: Healthcare, IT, Engineering, Skilled Trades, Logistics, Hospitality, Construction. Use Batch Planner to prepare multiple targets at once.</p>

            {/* Destination markets */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Destination markets covered</p>
              <div className="flex flex-wrap gap-2">
                {DESTINATION_MARKETS.map((m) => <Badge key={m} label={m} color="blue" />)}
              </div>
            </div>

            {/* Batch planner */}
            <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-semibold text-white">Batch Target Planner</h3>
              <p className="text-xs text-gray-500">Prepare N employer targets for a country and sector. Targets will have status <em>real_contact_needed</em> — use Search Playbook to find real companies.</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Country</label>
                  <select value={batchCountry} onChange={(e) => setBatchCountry(e.target.value)} className="w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs focus:outline-none">
                    {DESTINATION_MARKETS.map((m) => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Sector</label>
                  <select value={batchSector} onChange={(e) => setBatchSector(e.target.value)} className="w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs focus:outline-none">
                    {GROWTH_SECTORS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Message type</label>
                  <select value={batchMsgType} onChange={(e) => setBatchMsgType(e.target.value as MessageType)} className="w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs focus:outline-none">
                    {MESSAGE_TYPE_CONFIG.filter((m) => m.targetKind === 'employer').map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Count (max 50)</label>
                  <input type="number" min={1} max={50} value={batchCount} onChange={(e) => setBatchCount(Math.min(50, Math.max(1, Number(e.target.value))))} className="w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs focus:outline-none" />
                </div>
              </div>
              <button onClick={() => { setBatchKind('employer'); void handleBatchAdd() }} className="px-4 py-2 bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-semibold rounded-lg transition-colors">
                Add {batchCount} employer targets to Approval Queue →
              </button>
            </div>

            {/* Search Playbook */}
            <SearchPlaybook />
          </div>
        </div>
      )}

      {/* ── TAB: Candidate Source Agent ──────────────────────────────── */}
      {activeTab === 'candidate' && (
        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-white">Candidate Source Agent</h2>
            <p className="text-xs text-gray-500">Target organisations in source markets that can direct candidates to /global/candidates. Never contact individual candidates directly. Only approach organisations, admins, or community partners.</p>

            <div className="bg-yellow-900/15 border border-yellow-800/30 rounded-xl p-3 text-xs text-yellow-300/80">
              Candidate sources only — no direct outreach to individual candidates. Approach: language schools, training providers, universities, community organisations, diaspora associations. Link always: {' '}
              <span className="text-blue-300">corridorwork.com/global/candidates</span>
            </div>

            {/* Source markets */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Source markets</p>
              <div className="flex flex-wrap gap-2">
                {SOURCE_MARKETS.map((m) => <Badge key={m} label={m} color="yellow" />)}
              </div>
            </div>

            {/* Source types */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Source organisation types</p>
              <div className="flex flex-wrap gap-2">
                {['Language schools', 'Vocational schools', 'Nursing training centres', 'Universities', 'Career centres', 'Diaspora associations', 'Training providers', 'Recruiting partners', 'Candidate communities'].map((t) => (
                  <span key={t} className="px-2 py-0.5 text-xs text-gray-400 border border-gray-700 rounded-full">{t}</span>
                ))}
              </div>
            </div>

            {/* Candidate source batch planner */}
            <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-semibold text-white">Batch Target Planner — Candidate Sources</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Source market</label>
                  <select value={batchCountry} onChange={(e) => setBatchCountry(e.target.value)} className="w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs focus:outline-none">
                    {SOURCE_MARKETS.map((m) => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Sector</label>
                  <select value={batchSector} onChange={(e) => setBatchSector(e.target.value)} className="w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs focus:outline-none">
                    {GROWTH_SECTORS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Message type</label>
                  <select value={batchMsgType} onChange={(e) => setBatchMsgType(e.target.value as MessageType)} className="w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs focus:outline-none">
                    {MESSAGE_TYPE_CONFIG.filter((m) => m.targetKind === 'candidate_source').map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Count (max 50)</label>
                  <input type="number" min={1} max={50} value={batchCount} onChange={(e) => setBatchCount(Math.min(50, Math.max(1, Number(e.target.value))))} className="w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs focus:outline-none" />
                </div>
              </div>
              <button onClick={() => { setBatchKind('candidate_source'); handleBatchAdd() }} className="px-4 py-2 bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-semibold rounded-lg transition-colors">
                Add {batchCount} candidate source targets to Approval Queue →
              </button>
            </div>

            <SearchPlaybook />
          </div>
        </div>
      )}

      {/* ── TAB: Partner Channel Agent ───────────────────────────────── */}
      {activeTab === 'partner' && (
        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-white">Partner Channel Agent</h2>
            <p className="text-xs text-gray-500">Target recruiting agencies, relocation providers, training partners, employer associations. Goal: cooperation, feedback, pilot access, white-label, or strategic acquisition discussion.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CORRIDORS.map((c) => (
                <div key={c.id} className="bg-gray-800/40 border border-gray-700 rounded-xl p-3 space-y-1.5">
                  <p className="text-white text-xs font-semibold">{c.label}</p>
                  <p className="text-gray-500 text-xs">Best first contact: {MESSAGE_TYPE_CONFIG.find((m) => m.value === c.bestFirstContact)?.label}</p>
                  <p className="text-gray-600 text-xs">{c.candidateSourceTypes.join(' · ')}</p>
                </div>
              ))}
            </div>

            {/* Partner batch planner */}
            <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-semibold text-white">Batch Target Planner — Partners</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Country</label>
                  <input value={batchCountry} onChange={(e) => setBatchCountry(e.target.value)} placeholder="Germany, France…" className="w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Sector</label>
                  <select value={batchSector} onChange={(e) => setBatchSector(e.target.value)} className="w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs focus:outline-none">
                    {GROWTH_SECTORS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Message type</label>
                  <select value={batchMsgType} onChange={(e) => setBatchMsgType(e.target.value as MessageType)} className="w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs focus:outline-none">
                    {MESSAGE_TYPE_CONFIG.filter((m) => m.targetKind === 'partner').map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Count (max 50)</label>
                  <input type="number" min={1} max={50} value={batchCount} onChange={(e) => setBatchCount(Math.min(50, Math.max(1, Number(e.target.value))))} className="w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs focus:outline-none" />
                </div>
              </div>
              <button onClick={() => { setBatchKind('partner'); handleBatchAdd() }} className="px-4 py-2 bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-semibold rounded-lg transition-colors">
                Add {batchCount} partner targets to Approval Queue →
              </button>
            </div>

            <SearchPlaybook />
          </div>
        </div>
      )}

      {/* ── TAB: Approval Queue ──────────────────────────────────────── */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          {/* Quick Add Bulk Import */}
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 space-y-3">
            <h2 className="text-sm font-semibold text-white">Quick Add Bulk Import</h2>
            <p className="text-xs text-gray-500">Paste multiple lines — up to 50 at once. Format per line:</p>
            <code className="text-xs text-indigo-300 bg-gray-800 px-2 py-1 rounded block">Company name | email@example.com | Country | Sector | https://website.com</code>
            <textarea
              value={quickText}
              onChange={(e) => setQuickText(e.target.value)}
              rows={5}
              placeholder={'Sprache & Beruf GmbH | info@sb.de | Germany | Language training | https://sb.de\nVFBB Speyer | info@vfbb.de | Germany | Healthcare | https://vfbb.de'}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 text-xs focus:outline-none focus:border-indigo-500 font-mono resize-none"
            />
            <div className="flex items-center gap-3">
              <button onClick={handleQuickAdd} disabled={!quickText.trim()} className="px-4 py-2 bg-indigo-700 hover:bg-indigo-600 disabled:opacity-40 text-white text-xs font-semibold rounded-lg transition-colors">
                Parse and add to queue →
              </button>
              {quickResult && <span className="text-xs text-green-400">{quickResult}</span>}
            </div>
            <p className="text-xs text-gray-600">No automatic sending. All items land in the queue with status <em>draft_prepared</em>. You review and approve each one.</p>
          </div>

          {/* Queue list */}
          {queue.length === 0 ? (
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 text-center">
              <p className="text-gray-500 text-sm">Approval Queue is empty.</p>
              <p className="text-gray-600 text-xs mt-1">Use Batch Planner or Quick Add to populate it, or use the Agent tabs above.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-gray-500">{queue.length} target(s) in queue — manual approval required before any send</p>
              {queue.map((target) => (
                <QueueCard
                  key={target.id}
                  target={target}
                  expanded={expandedId === target.id}
                  onToggle={() => setExpandedId(expandedId === target.id ? null : target.id)}
                  onStatusChange={(s) => updateStatus(target.id, s)}
                  onRemove={() => removeFromQueue(target.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Related pages */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
        <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-2">Related admin pages</p>
        <div className="flex flex-wrap gap-2">
          {[
            ['/admin/contact-copilot',  'Contact Copilot'],
            ['/admin/pilot-targets',    'Pilot Targets'],
            ['/admin/first-pilot',      'First Pilot'],
            ['/admin/revenue-inbox',    'Revenue Inbox'],
            ['/global/employers',       '/global/employers'],
            ['/global/candidates',      '/global/candidates'],
            ['/partners',               '/partners'],
          ].map(([href, label]) => (
            <Link key={href} href={href} className="px-3 py-1.5 bg-gray-800/60 border border-gray-700 text-xs text-gray-400 hover:text-white rounded-lg transition-colors">{label}</Link>
          ))}
        </div>
      </div>

    </div>
  )
}

// ── Export Panel ──────────────────────────────────────────────────────────────

function ExportPanel() {
  const [loading, setLoading] = useState(false)
  const [json,    setJson]    = useState<string | null>(null)
  const [error,   setError]   = useState<string | null>(null)

  async function handleExport() {
    setLoading(true); setError(null); setJson(null)
    try {
      const res = await fetch('/api/admin/growth/export')
      if (!res.ok) { setError(`Export failed: ${res.status}`); return }
      const data = await res.json()
      setJson(JSON.stringify(data, null, 2))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Export error')
    } finally { setLoading(false) }
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white">Export growth pipeline JSON</h2>
          <p className="text-xs text-gray-500 mt-0.5">For sale / transfer due diligence. Admin only. No PII beyond contact name.</p>
        </div>
        <button
          onClick={handleExport}
          disabled={loading}
          className="px-4 py-2 bg-indigo-700 hover:bg-indigo-600 disabled:opacity-40 text-white text-xs font-semibold rounded-lg transition-colors shrink-0"
        >
          {loading ? '⏳ Exporting…' : '⬇ Export growth pipeline JSON'}
        </button>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {json && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Export ready ({json.length.toLocaleString()} chars)</span>
            <div className="flex gap-2">
              <button
                onClick={() => { navigator.clipboard.writeText(json).catch(() => {}) }}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs font-medium rounded-lg transition-colors"
              >
                📋 Copy JSON
              </button>
              <button onClick={() => setJson(null)} className="text-xs text-gray-600 hover:text-gray-400">✕ close</button>
            </div>
          </div>
          <pre className="bg-gray-950 border border-gray-800 rounded-xl p-3 text-xs text-gray-400 overflow-x-auto max-h-60 font-mono">{json.slice(0, 3000)}{json.length > 3000 ? '\n…(truncated for display — copy full JSON above)' : ''}</pre>
        </div>
      )}
    </div>
  )
}

// ── Search Playbook sub-component ─────────────────────────────────────────────

function SearchPlaybook() {
  return (
    <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4 space-y-2">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Search Playbook — opens browser search, no scraping</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {SEARCH_PLAYBOOK.map((s) => (
          <a key={s.id} href={generateSearchUrl(s.platform, s.query)} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 bg-gray-900 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors text-xs text-gray-400 hover:text-white">
            <span className={`w-5 h-5 rounded text-xs font-bold flex items-center justify-center shrink-0 ${s.platform === 'google' ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-800/50 text-blue-200'}`}>
              {s.platform === 'google' ? 'G' : 'Li'}
            </span>
            {s.label}
          </a>
        ))}
      </div>
      <p className="text-xs text-gray-700">Opens Google or LinkedIn in a new tab. You read results manually and enter real companies via Quick Add. No automated data collection.</p>
    </div>
  )
}

// ── Queue Card sub-component ──────────────────────────────────────────────────

function QueueCard({ target, expanded, onToggle, onStatusChange, onRemove }: {
  target:         GrowthTarget
  expanded:       boolean
  onToggle:       () => void
  onStatusChange: (s: QueueStatus) => void
  onRemove:       () => void
}) {
  const gmailUrl   = generateGmailDraftUrl(target.contactEmail, target.subject, target.body)
  const snippet    = generateContactFormSnippet(target.subject, target.body)
  const statusOpt  = QUEUE_STATUS_OPTIONS.find((s) => s.value === target.status)
  const needsReal  = target.status === 'real_contact_needed'

  return (
    <div className={`border rounded-xl overflow-hidden ${needsReal ? 'border-yellow-800/40 bg-yellow-950/10' : 'border-gray-700 bg-gray-900'}`}>
      <button onClick={onToggle} className="w-full px-4 py-3 flex items-start justify-between gap-3 hover:bg-gray-800/30 transition-colors text-left">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-white font-medium">{target.companyName}</span>
            {needsReal && <Badge label="real contact needed" color="yellow" />}
            <Badge label={target.targetKind.replace('_', ' ')} color="gray" />
          </div>
          <div className="text-xs text-gray-500 mt-0.5">{target.country} · {target.sector} · {statusOpt?.label ?? target.status}</div>
        </div>
        <span className="text-gray-500 text-xs shrink-0">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-800">
          {/* Status */}
          <div className="flex items-center gap-3 pt-3">
            <label className="text-xs text-gray-500 shrink-0">Status</label>
            <select value={target.status} onChange={(e) => onStatusChange(e.target.value as QueueStatus)}
              className="flex-1 px-2 py-1 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs focus:outline-none">
              {QUEUE_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Message preview */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Message</span>
              <div className="flex gap-2">
                <CopyBtn text={target.subject} label="Subject" />
                <CopyBtn text={target.body}    label="Message" />
              </div>
            </div>
            <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-3">
              <p className="text-xs text-gray-400 font-medium mb-1">{target.subject}</p>
              <pre className="text-xs text-gray-300 whitespace-pre-wrap font-sans leading-relaxed max-h-40 overflow-y-auto">{target.body}</pre>
            </div>
          </div>

          {/* Send options */}
          <div className="space-y-2">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Sending options — manual only</p>

            {/* Gmail */}
            <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white font-medium">Open Gmail draft in browser</span>
                <a href={gmailUrl} target="_blank" rel="noopener noreferrer"
                  className="px-3 py-1 bg-blue-900/40 hover:bg-blue-800/60 text-blue-300 text-xs font-semibold rounded-lg border border-blue-800/40 transition-colors">
                  Open Gmail draft ↗
                </a>
              </div>
              {!target.contactEmail && <p className="text-xs text-yellow-600">No email — opens blank Gmail compose. Add recipient manually.</p>}
              <p className="text-xs text-gray-600">Opens Gmail compose. You click Send yourself. Nothing sent automatically.</p>
            </div>

            {/* Contact Form Autofill Helper */}
            <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-3 space-y-2">
              <p className="text-xs text-white font-medium">Contact Form Autofill Helper</p>
              <p className="text-xs text-gray-500">Paste snippet in browser console on the contact form page. Fills fields only — never submits.</p>
              <div className="flex items-center gap-2">
                <CopyBtn text={snippet} label="Copy autofill snippet" />
              </div>
              <div className="bg-red-900/15 border border-red-800/30 rounded-lg p-2">
                <p className="text-xs text-red-300/80 font-semibold">Review before sending — take a screenshot and check before clicking Send.</p>
              </div>
            </div>
          </div>

          {/* Screenshot reminder */}
          <div className="bg-yellow-900/15 border border-yellow-800/30 rounded-xl p-3">
            <p className="text-yellow-300/80 text-xs font-semibold">Screenshot approval reminder</p>
            <p className="text-yellow-300/60 text-xs mt-0.5">Before clicking Send in Gmail or on a form: take a screenshot, review it, confirm recipient and message are correct. Manual send only after screenshot approval.</p>
          </div>

          {/* Remove */}
          <button onClick={onRemove} className="text-xs text-red-500 hover:text-red-400 transition-colors">Remove from queue</button>
        </div>
      )}
    </div>
  )
}
