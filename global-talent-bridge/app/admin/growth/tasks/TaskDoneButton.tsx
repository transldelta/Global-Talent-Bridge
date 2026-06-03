'use client'

import { useTransition, useState } from 'react'
import { useRouter } from 'next/navigation'

export function TaskDoneButton({ id }: { id: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [done, setDone] = useState(false)

  function handleDone() {
    startTransition(async () => {
      const res = await fetch(`/api/admin/growth/tasks/${id}/done`, { method: 'POST' })
      if (res.ok) {
        setDone(true)
        router.refresh()
      }
    })
  }

  if (done) {
    return <span className="text-xs text-green-400 px-2">✅ Erledigt</span>
  }

  return (
    <button
      onClick={handleDone}
      disabled={isPending}
      className="text-xs px-3 py-1.5 bg-gray-800 hover:bg-green-900/40 border border-gray-700 hover:border-green-800 text-gray-400 hover:text-green-300 rounded-lg transition-colors disabled:opacity-50"
    >
      {isPending ? '…' : '✓ Erledigt'}
    </button>
  )
}
