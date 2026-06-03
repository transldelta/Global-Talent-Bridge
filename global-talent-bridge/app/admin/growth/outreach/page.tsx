import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NavBar } from '@/app/_components/NavBar'
import { MessageActions } from './MessageActions'

const statusColor: Record<string, string> = {
  draft:    'bg-gray-800 text-gray-300 border border-gray-700',
  approved: 'bg-green-900/30 text-green-300 border border-green-800/40',
  sent:     'bg-blue-900/30 text-blue-300 border border-blue-800/40',
  bounced:  'bg-red-900/20 text-red-400 border border-red-800/30',
  replied:  'bg-purple-900/30 text-purple-300 border border-purple-800/40',
}

const statusLabel: Record<string, string> = {
  draft: 'Entwurf', approved: 'Freigegeben', sent: 'Versendet', bounced: 'Unzustellbar', replied: 'Beantwortet',
}

export default async function OutreachMessagesPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const adminSupabase = createAdminClient()
  const { data: profile } = await adminSupabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') redirect('/auth/login')

  const { data: messages } = await adminSupabase
    .from('outreach_messages')
    .select('*')
    .order('created_at', { ascending: false })

  const allMessages = messages ?? []

  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar badge="Admin" badgeColor="red" />
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        <div>
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <Link href="/admin/growth" className="hover:text-gray-300">Growth Engine</Link>
            <span>›</span>
            <span>Outreach-Nachrichten</span>
          </div>
          <h1 className="text-2xl font-bold text-white">✉️ Outreach-Nachrichten</h1>
          <p className="text-gray-400 mt-1 text-sm">
            {allMessages.length} Nachrichten gesamt ·{' '}
            {allMessages.filter((m) => m.status === 'draft').length} Entwürfe ·{' '}
            {allMessages.filter((m) => m.status === 'approved').length} freigegeben ·{' '}
            {allMessages.filter((m) => m.status === 'sent').length} versendet
          </p>
        </div>

        {/* Warning */}
        <div className="bg-yellow-900/10 border border-yellow-800/30 rounded-xl p-4 flex items-start gap-3">
          <span className="text-xl shrink-0">⚠️</span>
          <div>
            <p className="text-yellow-300 text-sm font-medium">Kein automatischer Versand</p>
            <p className="text-yellow-200/60 text-xs mt-1">
              Alle Nachrichten müssen manuell freigegeben werden. &quot;Als versendet markieren&quot; bedeutet nur,
              dass du die Nachricht selbst versendet hast — die Plattform sendet niemals automatisch.
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="space-y-4">
          {allMessages.map((msg) => (
            <div key={msg.id} className="bg-gray-900 rounded-xl border border-gray-800 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[msg.status] ?? statusColor.draft}`}>
                      {statusLabel[msg.status] ?? msg.status}
                    </span>
                    <span className="text-gray-500 text-xs capitalize">{msg.channel}</span>
                    <span className="text-gray-600 text-xs">·</span>
                    <span className="text-gray-500 text-xs">{msg.recipient_type.replace('_', ' ')}</span>
                  </div>
                  <p className="text-white font-medium mt-1">{msg.recipient_name ?? '—'}</p>
                  {msg.recipient_email && (
                    <p className="text-blue-400 text-xs">{msg.recipient_email}</p>
                  )}
                  {msg.subject && (
                    <p className="text-gray-400 text-sm mt-1 font-medium">Betreff: {msg.subject}</p>
                  )}
                </div>
                <div className="text-right text-xs text-gray-600 shrink-0">
                  {new Date(msg.created_at).toLocaleDateString('de-DE')}
                  {msg.approved_at && (
                    <p>Freigegeben: {new Date(msg.approved_at).toLocaleDateString('de-DE')}</p>
                  )}
                  {msg.sent_at && (
                    <p>Versendet: {new Date(msg.sent_at).toLocaleDateString('de-DE')}</p>
                  )}
                </div>
              </div>

              {/* Body preview */}
              <div className="bg-gray-950 rounded-lg p-3 text-xs text-gray-400 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto font-mono">
                {msg.body}
              </div>

              {/* Actions */}
              {(msg.status === 'draft' || msg.status === 'approved') && (
                <MessageActions id={msg.id} status={msg.status} />
              )}
            </div>
          ))}

          {allMessages.length === 0 && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 text-center">
              <p className="text-4xl mb-3">✉️</p>
              <p className="text-gray-400">Keine Nachrichten. Growth-Agent ausführen, um Entwürfe zu generieren.</p>
              <Link href="/admin/growth" className="inline-block mt-3 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-sm rounded-lg transition-colors">
                → Growth Dashboard
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
