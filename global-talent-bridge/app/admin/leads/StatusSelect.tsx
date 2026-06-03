'use client'

import { useTransition } from 'react'

/**
 * StatusSelect — Client Component für Status-Änderung von Leads/Kontaktanfragen.
 * Muss Client Component sein, weil onChange event handler nicht in Server Components erlaubt ist.
 * Ruft Server Action via useTransition auf — kein Seitenneuladen nötig.
 */
export function StatusSelect({
  id,
  currentStatus,
  action,
}: {
  id: string
  currentStatus: string
  action: (formData: FormData) => Promise<void>
}) {
  const [isPending, startTransition] = useTransition()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value
    const formData = new FormData()
    formData.append('id', id)
    formData.append('status', newStatus)
    startTransition(() => {
      action(formData)
    })
  }

  return (
    <select
      defaultValue={currentStatus}
      onChange={handleChange}
      disabled={isPending}
      className="text-xs bg-gray-800 border border-gray-700 text-white rounded-lg px-2 py-1 focus:outline-none focus:border-blue-500 cursor-pointer disabled:opacity-50"
    >
      <option value="new">new</option>
      <option value="contacted">contacted</option>
      <option value="qualified">qualified</option>
      <option value="rejected">rejected</option>
      <option value="closed">closed</option>
    </select>
  )
}
