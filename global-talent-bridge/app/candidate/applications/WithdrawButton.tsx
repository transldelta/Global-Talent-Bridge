'use client'

import { useTransition, useState } from 'react'
import { withdrawApplicationAction } from '@/app/candidate/actions'

export function WithdrawButton({ applicationId }: { applicationId: string }) {
  const [isPending, startTransition] = useTransition()
  const [withdrawn, setWithdrawn] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (withdrawn) {
    return <span className="text-xs text-gray-500">↩️ Zurückgezogen</span>
  }

  function handleWithdraw() {
    if (!confirm('Bewerbung wirklich zurückziehen?')) return
    startTransition(async () => {
      const res = await withdrawApplicationAction(applicationId)
      if (res.success) {
        setWithdrawn(true)
      } else {
        setError(res.error ?? 'Fehler')
      }
    })
  }

  return (
    <div className="shrink-0">
      <button
        onClick={handleWithdraw}
        disabled={isPending}
        className="text-xs px-3 py-1.5 bg-gray-800 hover:bg-red-900/30 border border-gray-700 hover:border-red-800/40 text-gray-400 hover:text-red-400 rounded-lg transition-colors disabled:opacity-50"
      >
        {isPending ? '…' : '↩️ Zurückziehen'}
      </button>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
}
