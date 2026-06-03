'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'

export function MarkAllReadButton() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleMarkAll() {
    startTransition(async () => {
      await fetch('/api/admin/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true }),
      })
      router.refresh()
    })
  }

  return (
    <button
      onClick={handleMarkAll}
      disabled={isPending}
      className="text-xs px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white border border-gray-700 rounded-lg transition-colors disabled:opacity-50"
    >
      {isPending ? '…' : '✓ Alle als gelesen markieren'}
    </button>
  )
}
