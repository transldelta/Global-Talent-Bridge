import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NavBar } from '@/app/_components/NavBar'
import { TaskDoneButton } from './TaskDoneButton'

const priorityColor: Record<string, string> = {
  critical: 'bg-red-900/30 text-red-300 border border-red-800/40',
  high:     'bg-orange-900/20 text-orange-300 border border-orange-800/30',
  medium:   'bg-yellow-900/20 text-yellow-300 border border-yellow-800/30',
  low:      'bg-gray-800 text-gray-400 border border-gray-700',
}

const categoryIcon: Record<string, string> = {
  employer_outreach:     '🏢',
  candidate_acquisition: '👤',
  partner_development:   '🤝',
  content:               '✍️',
  admin:                 '⚙️',
}

export default async function GrowthTasksPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const adminSupabase = createAdminClient()
  const { data: profile } = await adminSupabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') redirect('/auth/login')

  const { data: tasks } = await adminSupabase
    .from('growth_tasks')
    .select('*')
    .order('status')
    .order('priority')
    .order('due_date', { ascending: true, nullsFirst: false })

  const allTasks = tasks ?? []
  const openTasks = allTasks.filter((t) => t.status === 'open')
  const inProgressTasks = allTasks.filter((t) => t.status === 'in_progress')
  const doneTasks = allTasks.filter((t) => t.status === 'done')

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date()
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar badge="Admin" badgeColor="red" />
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        <div>
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <Link href="/admin/growth" className="hover:text-gray-300">Growth Engine</Link>
            <span>›</span>
            <span>Aufgaben</span>
          </div>
          <h1 className="text-2xl font-bold text-white">📋 Aufgaben-Board</h1>
          <p className="text-gray-400 mt-1 text-sm">
            {openTasks.length} offen · {inProgressTasks.length} in Bearbeitung · {doneTasks.length} erledigt
          </p>
        </div>

        {/* Open / In Progress tasks */}
        {[...openTasks, ...inProgressTasks].length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Offene Aufgaben</h2>
            {[...openTasks, ...inProgressTasks].map((task) => (
              <div
                key={task.id}
                className={`bg-gray-900 rounded-xl border p-5 ${isOverdue(task.due_date) ? 'border-red-900/50' : 'border-gray-800'}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-base">{categoryIcon[task.category] ?? '📌'}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColor[task.priority] ?? priorityColor.low}`}>
                        {task.priority}
                      </span>
                      {task.source === 'agent_suggested' && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-900/20 text-purple-400 border border-purple-800/30">🤖 Agent</span>
                      )}
                      {isOverdue(task.due_date) && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-900/30 text-red-300 border border-red-800/40">⏰ Überfällig</span>
                      )}
                    </div>
                    <h3 className="text-white font-medium leading-snug">{task.title}</h3>
                    {task.description && (
                      <p className="text-gray-500 text-sm mt-1 leading-relaxed">{task.description}</p>
                    )}
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-600">
                      <span>👤 {task.assigned_to ?? 'CEO'}</span>
                      <span>📁 {task.category.replace(/_/g, ' ')}</span>
                      {task.due_date && (
                        <span className={isOverdue(task.due_date) ? 'text-red-400' : ''}>
                          📅 {new Date(task.due_date).toLocaleDateString('de-DE')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0">
                    <TaskDoneButton id={task.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Done tasks */}
        {doneTasks.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Erledigt ({doneTasks.length})</h2>
            {doneTasks.slice(0, 10).map((task) => (
              <div key={task.id} className="bg-gray-900/50 rounded-xl border border-gray-800/50 p-4 opacity-60">
                <div className="flex items-center gap-2">
                  <span className="text-green-400 text-sm">✅</span>
                  <p className="text-gray-400 text-sm line-through">{task.title}</p>
                  {task.completed_at && (
                    <p className="text-gray-600 text-xs ml-auto">{new Date(task.completed_at).toLocaleDateString('de-DE')}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {allTasks.length === 0 && (
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 text-center">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-gray-400">Keine Aufgaben. Growth-Agent ausführen, um automatisch Aufgaben zu erstellen.</p>
          </div>
        )}

      </div>
    </div>
  )
}
