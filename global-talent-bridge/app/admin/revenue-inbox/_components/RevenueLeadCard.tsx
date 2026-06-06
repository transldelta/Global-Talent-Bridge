'use client'
/**
 * RevenueLeadCard.tsx
 *
 * Zeigt einen einzelnen Revenue-Lead mit Status-Update-Optionen.
 * KEIN Send-Button. KEIN automatischer Versand. KEIN Stripe.
 */
import { useState } from 'react'
import {
  LEAD_TYPE_LABELS, LEAD_TYPE_COLORS,
  STATUS_LABELS, STATUS_COLORS,
  calculateLeadScore,
} from '@/lib/revenue-leads'
import type { RevenueLead, LeadStatus } from '@/lib/revenue-leads'

interface Props {
  lead:      RevenueLead
  onUpdated: (updated: RevenueLead) => void
}

const STATUS_ACTIONS: { status: LeadStatus; label: string; color: string }[] = [
  { status: 'reviewed',         label: '👁️ Als geprüft markieren',          color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
  { status: 'qualified',        label: '✅ Als qualifiziert markieren',       color: 'bg-green-100 text-green-700 hover:bg-green-200' },
  { status: 'contacted_manual', label: '📞 Als manuell kontaktiert markieren', color: 'bg-purple-100 text-purple-700 hover:bg-purple-200' },
  { status: 'rejected',         label: '❌ Ablehnen',                         color: 'bg-red-100 text-red-700 hover:bg-red-200' },
]

export function RevenueLeadCard({ lead, onUpdated }: Props) {
  const [loading,  setLoading]  = useState(false)
  const [note,     setNote]     = useState(lead.admin_note || '')
  const [expanded, setExpanded] = useState(false)

  const score = calculateLeadScore(lead)

  async function updateStatus(status: LeadStatus, worklog = false) {
    setLoading(true)
    try {
      const res  = await fetch('/api/admin/revenue-leads', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ id: lead.id, status, worklog }),
      })
      const data = await res.json()
      if (res.ok) onUpdated({ ...lead, status })
      else console.error(data.error)
    } finally {
      setLoading(false)
    }
  }

  async function saveNote() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/revenue-leads', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ id: lead.id, admin_note: note }),
      })
      const data = await res.json()
      if (res.ok) onUpdated({ ...lead, admin_note: note })
      else console.error(data.error)
    } finally {
      setLoading(false)
    }
  }

  async function sendToWorklog() {
    await updateStatus(lead.status, true)
  }

  const createdAt = new Date(lead.created_at).toLocaleString('de-DE', {
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
  })

  const scoreColor = score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600'

  return (
    <div className={`bg-white rounded-xl border ${lead.status === 'new' ? 'border-yellow-300' : 'border-gray-200'} p-5 space-y-3`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${LEAD_TYPE_COLORS[lead.lead_type]}`}>
              {LEAD_TYPE_LABELS[lead.lead_type]}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded font-semibold ${STATUS_COLORS[lead.status]}`}>
              {STATUS_LABELS[lead.status]}
            </span>
            <span className={`text-sm font-bold ml-2 ${scoreColor}`}>Score: {score}</span>
          </div>
          <div className="font-semibold text-gray-900 mt-1">{lead.organization_name}</div>
          <div className="text-sm text-gray-600">{lead.contact_name} · {lead.email}</div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xs text-gray-400">{createdAt}</div>
          <button
            className="text-xs text-blue-600 hover:underline mt-1"
            onClick={() => setExpanded(e => !e)}
          >
            {expanded ? 'Weniger ▲' : 'Details ▼'}
          </button>
        </div>
      </div>

      {/* Details */}
      {expanded && (
        <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
          {lead.sector  && <div><span className="text-gray-500">Branche/Korridor:</span> {lead.sector}</div>}
          {lead.country && <div><span className="text-gray-500">Land:</span> {lead.country}{lead.city ? ` / ${lead.city}` : ''}</div>}
          {lead.message && (
            <div>
              <span className="text-gray-500">Nachricht:</span>
              <p className="text-gray-700 mt-0.5 bg-gray-50 rounded p-2 text-xs">{lead.message}</p>
            </div>
          )}
          <div className="text-xs text-gray-500">
            Consent: {lead.consent_to_contact ? '✓ Ja' : '✗ Nein'} · Quelle: {lead.source_page}
          </div>
          {/* Safety */}
          <div className="flex gap-3 text-xs text-gray-400 pt-1">
            <span className="text-green-600">✓ noEmailSent</span>
            <span className="text-green-600">✓ noAutoOutreach</span>
            <span className="text-green-600">✓ noPayment</span>
          </div>
        </div>
      )}

      {/* Admin Notiz */}
      <div className="border-t border-gray-100 pt-3">
        <label className="block text-xs font-medium text-gray-500 mb-1">Admin-Notiz</label>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border border-gray-200 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500"
            placeholder="Interne Notiz..."
            value={note}
            onChange={e => setNote(e.target.value)}
          />
          <button
            onClick={saveNote}
            disabled={loading}
            className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            Notiz speichern
          </button>
        </div>
      </div>

      {/* Status Actions — kein Send-Button */}
      <div className="border-t border-gray-100 pt-3">
        <div className="text-xs text-gray-500 mb-2">Status ändern (kein automatischer Versand):</div>
        <div className="flex flex-wrap gap-2">
          {STATUS_ACTIONS.filter(a => a.status !== lead.status).map(action => (
            <button
              key={action.status}
              onClick={() => updateStatus(action.status)}
              disabled={loading}
              className={`text-xs px-3 py-1.5 rounded font-medium transition-colors disabled:opacity-50 ${action.color}`}
            >
              {action.label}
            </button>
          ))}
          <button
            onClick={sendToWorklog}
            disabled={loading}
            className="text-xs px-3 py-1.5 rounded font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            📋 In CWO Worklog übernehmen
          </button>
        </div>
      </div>
    </div>
  )
}
