'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PILOT_STATUS_LABELS } from '@/lib/outreach/templates'

const STATUS_OPTIONS = [
  'identified',
  'contacted_manual',
  'interested',
  'demo_scheduled',
  'onboarding',
  'active_pilot',
  'rejected',
] as const

export function StatusUpdater({
  employerId,
  currentStatus,
  companyName,
}: {
  employerId: string
  currentStatus: string
  companyName: string
}) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  async function handleChange(newStatus: string) {
    if (newStatus === status) return
    setLoading(true)
    setError(null)
    setSaved(false)

    try {
      const res = await fetch(`/api/admin/pilot-outreach/${employerId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? `HTTP ${res.status}`)
      } else {
        setStatus(newStatus)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
        router.refresh()
      }
    } catch (e) {
      setError(`Netzwerkfehler: ${e}`)
    } finally {
      setLoading(false)
    }
  }

  const meta = PILOT_STATUS_LABELS[status] ?? { label: status, color: 'text-gray-400' }

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value)}
        disabled={loading}
        className="bg-gray-800 text-gray-200 text-xs rounded-lg px-3 py-1.5 border border-gray-700 focus:outline-none focus:border-blue-500 disabled:opacity-50"
        aria-label={`Status für ${companyName}`}
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {PILOT_STATUS_LABELS[s]?.label ?? s}
          </option>
        ))}
      </select>

      {loading && <span className="text-xs text-gray-500">Speichern…</span>}
      {saved && <span className="text-xs text-green-400">✅ Gespeichert</span>}
      {error && <span className="text-xs text-red-400">❌ {error}</span>}
    </div>
  )
}
