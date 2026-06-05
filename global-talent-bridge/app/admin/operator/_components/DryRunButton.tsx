'use client'

import { useState } from 'react'

interface DryRunCheck {
  approved: boolean
  channelIsEmail: boolean
  hasRecipientEmail: boolean
  providerConfigured: boolean
  hasSubject: boolean
  hasBody: boolean
  safetyPassed: boolean
  noPersonalNames: boolean
}

interface DryRunResult {
  canSend: boolean
  reason: string
  checks: DryRunCheck
  provider: {
    provider: string
    readinessStatus: string
    canSend: boolean
    missingConfig: string[]
  }
  note: string
}

interface DryRunButtonProps {
  draftId: string
  channel: string
}

const CHECK_LABELS: Record<keyof DryRunCheck, string> = {
  approved:           'Freigegeben (approved)',
  channelIsEmail:     'Kanal: E-Mail',
  hasRecipientEmail:  'Empfänger-E-Mail vorhanden',
  providerConfigured: 'Provider konfiguriert',
  hasSubject:         'Betreff vorhanden',
  hasBody:            'Text vorhanden',
  safetyPassed:       'Safety-Check bestanden',
  noPersonalNames:    'Keine persönlichen Namen',
}

export function DryRunButton({ draftId, channel }: DryRunButtonProps) {
  const [loading, setLoading]   = useState(false)
  const [result, setResult]     = useState<DryRunResult | null>(null)
  const [expanded, setExpanded] = useState(false)

  async function runCheck() {
    setLoading(true)
    setResult(null)
    setExpanded(true)
    try {
      const res = await fetch('/api/admin/operator/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'dry_run', draft_id: draftId }),
      })
      const data = await res.json() as DryRunResult & { error?: string }
      if (!res.ok) {
        setResult(null)
        setExpanded(false)
        alert(data.error ?? 'Fehler beim Dry-Run')
      } else {
        setResult(data)
      }
    } catch {
      alert('Netzwerkfehler')
    } finally {
      setLoading(false)
    }
  }

  if (channel !== 'email') return null

  return (
    <div className="mt-1">
      <button
        onClick={runCheck}
        disabled={loading}
        className="px-3 py-1 text-xs rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 border border-gray-700 disabled:opacity-50 transition-colors"
      >
        {loading ? '…Prüfe…' : '🔍 Dry Run prüfen'}
      </button>

      {result && expanded && (
        <div className="mt-2 p-3 bg-gray-800/60 border border-gray-700/50 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <p className={`text-xs font-semibold ${result.canSend ? 'text-green-400' : 'text-red-400'}`}>
              {result.canSend ? '✅ Kann gesendet werden' : '❌ Kann NICHT gesendet werden'}
            </p>
            <button
              onClick={() => setExpanded(false)}
              className="text-xs text-gray-600 hover:text-gray-400"
            >
              ✕
            </button>
          </div>

          <p className="text-xs text-gray-400">{result.reason}</p>

          <div className="space-y-0.5">
            {(Object.entries(result.checks) as [keyof DryRunCheck, boolean][]).map(([key, val]) => (
              <div key={key} className="flex items-center gap-1.5 text-xs">
                <span className={val ? 'text-green-400' : 'text-red-400'}>{val ? '✓' : '✗'}</span>
                <span className={val ? 'text-gray-400' : 'text-gray-300'}>{CHECK_LABELS[key]}</span>
              </div>
            ))}
          </div>

          {result.provider.missingConfig.length > 0 && (
            <div className="text-xs text-yellow-400/80">
              Fehlend: {result.provider.missingConfig.join(', ')}
            </div>
          )}

          <p className="text-xs text-gray-600 italic">{result.note}</p>
        </div>
      )}
    </div>
  )
}
