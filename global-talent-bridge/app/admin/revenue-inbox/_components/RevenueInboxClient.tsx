'use client'
/**
 * RevenueInboxClient.tsx
 *
 * Client-seitige Inbox mit Filter + Live-Updates.
 * KEIN Send-Button. KEIN Stripe. KEIN automatischer Versand.
 */
import { useState, useEffect } from 'react'
import { RevenueLeadCard }     from './RevenueLeadCard'
import { LEAD_TYPE_LABELS, STATUS_LABELS } from '@/lib/revenue-leads'
import type { RevenueLead, LeadType, LeadStatus } from '@/lib/revenue-leads'

interface Props {
  initialLeads: RevenueLead[]
}

export function RevenueInboxClient({ initialLeads }: Props) {
  const [leads,        setLeads]        = useState<RevenueLead[]>(initialLeads)
  const [filterType,   setFilterType]   = useState<LeadType | ''>('')
  const [filterStatus, setFilterStatus] = useState<LeadStatus | ''>('')
  const [loading,      setLoading]      = useState(false)

  async function reload() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterType)   params.set('lead_type', filterType)
      if (filterStatus) params.set('status', filterStatus)
      const res  = await fetch(`/api/admin/revenue-leads?${params}`)
      const data = await res.json()
      if (res.ok) setLeads(data.leads)
    } finally {
      setLoading(false)
    }
  }

  // Filter-Change → neu laden
  useEffect(() => { reload() }, [filterType, filterStatus]) // eslint-disable-line

  function handleLeadUpdated(updated: RevenueLead) {
    setLeads(ls => ls.map(l => l.id === updated.id ? updated : l))
  }

  const newCount       = leads.filter(l => l.status === 'new').length
  const qualifiedCount = leads.filter(l => l.status === 'qualified').length

  return (
    <div className="space-y-4">

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-yellow-700">{newCount}</div>
          <div className="text-xs text-yellow-600">Neue Leads</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-700">{qualifiedCount}</div>
          <div className="text-xs text-green-600">Qualifiziert</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-700">{leads.filter(l => l.lead_type === 'employer_pilot').length}</div>
          <div className="text-xs text-blue-600">Employer Pilot</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-purple-700">{leads.filter(l => l.lead_type === 'agency_partner').length}</div>
          <div className="text-xs text-purple-600">Agency Partner</div>
        </div>
      </div>

      {/* Safety Banner */}
      <div className="bg-slate-900 text-white rounded-lg p-3 flex items-center gap-3 text-xs">
        <span className="text-green-400">🛡️</span>
        <span>Kein Send-Button · Kein automatischer Versand · Kein Stripe · Manuell kontrolliert</span>
        <span className="ml-auto text-slate-400">EMAIL_PROVIDER: none</span>
      </div>

      {/* Filter */}
      <div className="flex gap-3 flex-wrap">
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          value={filterType}
          onChange={e => setFilterType(e.target.value as LeadType | '')}
        >
          <option value="">Alle Typen</option>
          {(Object.entries(LEAD_TYPE_LABELS) as [LeadType, string][]).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as LeadStatus | '')}
        >
          <option value="">Alle Status</option>
          {(Object.entries(STATUS_LABELS) as [LeadStatus, string][]).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <button
          onClick={reload}
          disabled={loading}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
        >
          {loading ? '⟳ Lädt...' : '🔄 Aktualisieren'}
        </button>
      </div>

      {/* Lead List */}
      {leads.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
          <div className="text-4xl mb-3">📭</div>
          <div className="font-semibold mb-1">Keine Leads gefunden</div>
          <div className="text-sm">
            Noch keine Anfragen eingegangen — oder Filter anpassen.
          </div>
          <div className="mt-4 flex justify-center gap-4 text-xs text-gray-400">
            <a href="/pilot/employers"    className="hover:underline text-blue-500">→ /pilot/employers</a>
            <a href="/pilot/agencies"     className="hover:underline text-purple-500">→ /pilot/agencies</a>
            <a href="/market-intelligence" className="hover:underline text-green-500">→ /market-intelligence</a>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map(lead => (
            <RevenueLeadCard
              key={lead.id}
              lead={lead}
              onUpdated={handleLeadUpdated}
            />
          ))}
        </div>
      )}
    </div>
  )
}
