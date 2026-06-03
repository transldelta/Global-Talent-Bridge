import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NavBar } from '@/app/_components/NavBar'
import { MessageActions } from '../outreach/MessageActions'
import { SuggestionActions } from '@/app/admin/ceo-dashboard/SuggestionActions'

export default async function ApprovalQueuePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const adminSupabase = createAdminClient()
  const { data: profile } = await adminSupabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') redirect('/auth/login')

  const [
    { data: draftMessages },
    { data: agentSuggestions },
  ] = await Promise.all([
    adminSupabase
      .from('outreach_messages')
      .select('*')
      .in('status', ['draft', 'approved'])
      .order('created_at', { ascending: false }),
    adminSupabase
      .from('agent_suggestions')
      .select('*')
      .eq('status', 'suggested')
      .order('priority', { ascending: true })
      .limit(20),
  ])

  const messages = draftMessages ?? []
  const suggestions = agentSuggestions ?? []
  const totalPending = messages.length + suggestions.length

  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar badge="Admin" badgeColor="red" />
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        <div>
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <Link href="/admin/growth" className="hover:text-gray-300">Growth Engine</Link>
            <span>›</span>
            <span>Freigabe-Warteschlange</span>
          </div>
          <h1 className="text-2xl font-bold text-white">✅ Freigabe-Warteschlange</h1>
          <p className="text-gray-400 mt-1 text-sm">
            {totalPending} Elemente warten auf Freigabe ·{' '}
            {messages.length} Nachrichten · {suggestions.length} Agent-Vorschläge
          </p>
        </div>

        {totalPending === 0 && (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 text-center">
            <p className="text-4xl mb-3">🎉</p>
            <p className="text-white font-medium">Alles freigegeben!</p>
            <p className="text-gray-500 text-sm mt-1">Keine ausstehenden Elemente.</p>
          </div>
        )}

        {/* Outreach Messages */}
        {messages.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-white">✉️ Outreach-Nachrichten ({messages.length})</h2>
            {messages.map((msg) => (
              <div key={msg.id} className="bg-gray-900 rounded-xl border border-gray-800 p-5">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${msg.status === 'draft' ? 'bg-gray-800 text-gray-300 border border-gray-700' : 'bg-green-900/30 text-green-300 border border-green-800/40'}`}>
                        {msg.status === 'draft' ? 'Entwurf' : 'Freigegeben'}
                      </span>
                      <span className="text-gray-500 text-xs capitalize">{msg.channel}</span>
                    </div>
                    <p className="text-white font-medium mt-1">{msg.recipient_name ?? '—'}</p>
                    {msg.recipient_email && <p className="text-blue-400 text-xs">{msg.recipient_email}</p>}
                    {msg.subject && <p className="text-gray-400 text-sm mt-1">Betreff: {msg.subject}</p>}
                  </div>
                  <span className="text-gray-600 text-xs">{new Date(msg.created_at).toLocaleDateString('de-DE')}</span>
                </div>
                <div className="bg-gray-950 rounded-lg p-3 text-xs text-gray-400 whitespace-pre-wrap max-h-32 overflow-y-auto font-mono">
                  {msg.body}
                </div>
                <MessageActions id={msg.id} status={msg.status} />
              </div>
            ))}
          </div>
        )}

        {/* Agent Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-white">🤖 Agent-Vorschläge ({suggestions.length})</h2>
            {suggestions.map((sug) => (
              <div key={sug.id} className="bg-gray-900 rounded-xl border border-gray-800 p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium">{sug.title}</p>
                    <p className="text-gray-400 text-sm mt-1">{sug.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-600">
                      <span>Abt.: {sug.department}</span>
                      <span>Prio: {sug.priority}</span>
                    </div>
                    <SuggestionActions id={sug.id} status={sug.status} actionType={sug.action_type ?? null} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
