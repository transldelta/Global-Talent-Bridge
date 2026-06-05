import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { NavBar } from '@/app/_components/NavBar'
import { OutreachActionsPanel } from './OutreachActionsPanel'
import { CopyButton } from './CopyButton'

// ── Typen ─────────────────────────────────────────────────────────────────────

type OutreachTarget = {
  id: string
  company_name: string
  contact_person: string | null
  email: string | null
  phone: string | null
  website: string | null
  sector: string | null
  city: string | null
  country: string | null
  source: string | null
  status: string
  priority: string
  last_contacted_at: string | null
  next_follow_up_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

// ── Status-Stile ──────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  planned: 'bg-gray-800 text-gray-400',
  contacted: 'bg-yellow-900/40 text-yellow-300',
  interested: 'bg-blue-900/40 text-blue-300',
  not_interested: 'bg-gray-800 text-gray-500',
  follow_up: 'bg-orange-900/40 text-orange-300',
  converted: 'bg-green-900/40 text-green-300',
  archived: 'bg-gray-900 text-gray-600',
}

const STATUS_LABELS: Record<string, string> = {
  planned: '📋 Geplant',
  contacted: '✉️ Kontaktiert',
  interested: '🤝 Interessiert',
  not_interested: '👎 Nicht interessiert',
  follow_up: '📅 Follow-up',
  converted: '⭐ Konvertiert',
  archived: '🗄️ Archiviert',
}

const PRIORITY_STYLES: Record<string, string> = {
  high: 'bg-red-900/40 text-red-300',
  normal: 'bg-gray-800 text-gray-400',
  low: 'bg-gray-800 text-gray-500',
}

const PRIORITY_LABELS: Record<string, string> = {
  high: '🔴 Hoch',
  normal: '🟡 Normal',
  low: '🟢 Niedrig',
}

// ── Personalisierte Nachricht ─────────────────────────────────────────────────

const CTA_URL =
  'https://global-talent-bridge.vercel.app/contact?role=employer&interest=pilot_employer'

function buildPersonalizedMessage(target: OutreachTarget): string {
  const greeting = target.contact_person
    ? `Guten Tag ${target.contact_person},`
    : 'Guten Tag,'

  return `${greeting}

wenn Sie regelmäßig internationale Bewerber für Ihr Unternehmen prüfen, kennen Sie das Problem:
viele Unterlagen, wenig Vorauswahl, viel manueller Aufwand.

CorridorWork löst genau das: Kandidaten legen ihr Profil an —
Branche, Erfahrung, Deutsch- und Englischkenntnisse. Sie erstellen eine Stelle
und sehen sofort, wer am besten passt — sortiert nach transparentem Matching-Score.

Die Plattform ist live. Ich suche aktuell einige Pilot-Unternehmen, die
das System kostenlos testen:

• Kein Vertrag, keine Kosten, keine automatischen Nachrichten
• Persönliche Betreuung durch mich direkt
• Ihr Feedback fließt direkt in die Weiterentwicklung ein

Hätten Sie 15 Minuten für ein kurzes Gespräch?
${CTA_URL}

Mit freundlichen Grüßen
CorridorWork Team
transl.delta@gmail.com`
}

// ── Seite ─────────────────────────────────────────────────────────────────────

export default async function OutreachDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const admin = await getCurrentAdminUser()
  if (!admin) redirect('/auth/login')

  const supabase = createAdminClient()
  const { data } = await supabase
    .from('outreach_targets')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!data) notFound()

  const target = data as OutreachTarget
  const personalizedMessage = buildPersonalizedMessage(target)
  const today = new Date().toISOString()
  const followupDue =
    target.next_follow_up_at != null && target.next_follow_up_at <= today

  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar badge="Admin" badgeColor="purple" />

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* Breadcrumb + Titel */}
        <div>
          <Link
            href="/admin/outreach"
            className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            ← Outreach-Übersicht
          </Link>
          <h1 className="text-2xl font-bold text-white mt-3">{target.company_name}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLES[target.status] ?? STATUS_STYLES.planned}`}>
              {STATUS_LABELS[target.status] ?? target.status}
            </span>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${PRIORITY_STYLES[target.priority] ?? PRIORITY_STYLES.normal}`}>
              {PRIORITY_LABELS[target.priority] ?? target.priority}
            </span>
            {followupDue && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-orange-900/40 text-orange-300 font-medium animate-pulse">
                📅 Follow-up fällig
              </span>
            )}
            <span className="text-gray-600 text-xs">
              Erstellt: {new Date(target.created_at).toLocaleDateString('de-DE')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Linke Spalte */}
          <div className="lg:col-span-2 space-y-5">

            {/* Firmendaten */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-base font-semibold text-white mb-4">🏢 Firmendaten</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Firma</p>
                  <p className="text-white text-sm font-medium">{target.company_name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Ansprechpartner</p>
                  <p className="text-white text-sm">{target.contact_person ?? '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">E-Mail</p>
                  {target.email ? (
                    <a href={`mailto:${target.email}`} className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
                      {target.email}
                    </a>
                  ) : (
                    <p className="text-gray-500 text-sm">—</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Telefon</p>
                  {target.phone ? (
                    <a href={`tel:${target.phone}`} className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
                      {target.phone}
                    </a>
                  ) : (
                    <p className="text-gray-500 text-sm">—</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Website</p>
                  {target.website ? (
                    <a href={target.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
                      {target.website}
                    </a>
                  ) : (
                    <p className="text-gray-500 text-sm">—</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Branche</p>
                  <p className="text-white text-sm">{target.sector ?? '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Stadt</p>
                  <p className="text-white text-sm">{target.city ?? '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Land</p>
                  <p className="text-white text-sm">{target.country ?? 'Deutschland'}</p>
                </div>
                {target.last_contacted_at && (
                  <div className="sm:col-span-2">
                    <p className="text-xs text-gray-500 mb-1">Zuletzt kontaktiert</p>
                    <p className="text-yellow-300 text-sm">
                      ✉️ {new Date(target.last_contacted_at).toLocaleDateString('de-DE', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </div>
                )}
                {target.next_follow_up_at && (
                  <div className="sm:col-span-2">
                    <p className="text-xs text-gray-500 mb-1">Nächstes Follow-up</p>
                    <p className={`text-sm font-medium ${followupDue ? 'text-orange-400' : 'text-blue-300'}`}>
                      📅 {new Date(target.next_follow_up_at).toLocaleDateString('de-DE')}
                      {followupDue && ' ← fällig'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Personalisierte Nachricht */}
            <div className="bg-gray-900 border border-blue-800/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3 gap-3">
                <div>
                  <h2 className="text-base font-semibold text-white">✉️ Personalisierte Nachricht</h2>
                  <p className="text-gray-500 text-xs mt-0.5">
                    Automatisch aus Firmendaten generiert — nur anzeigen und manuell kopieren.
                    Keine automatische E-Mail.
                  </p>
                </div>
                <CopyButton text={personalizedMessage} label="Nachricht kopieren" />
              </div>
              <div className="p-3 bg-blue-900/10 border border-blue-800/20 rounded-xl mb-3">
                <p className="text-blue-300/70 text-xs">
                  💡 Kopiere diesen Text und sende ihn manuell über dein E-Mail-Programm oder LinkedIn.
                  Falls kein Ansprechpartner bekannt, nutze &quot;Guten Tag,&quot; als allgemeine Anrede.
                </p>
              </div>
              <pre className="text-gray-300 text-xs leading-relaxed whitespace-pre-wrap font-mono bg-gray-800 rounded-xl p-4 overflow-x-auto">
                {personalizedMessage}
              </pre>
            </div>

            {/* Pilot-Kit Link */}
            <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl flex items-center justify-between gap-3">
              <div>
                <p className="text-white text-sm font-medium">🎯 Mehr Vorlagen im Pilot-Kit</p>
                <p className="text-gray-500 text-xs mt-0.5">
                  LinkedIn, WhatsApp, Telefon-Leitfaden, Follow-up-Vorlagen
                </p>
              </div>
              <a
                href="/admin/pilot-kit"
                className="shrink-0 text-xs px-3 py-1.5 bg-blue-900/30 hover:bg-blue-900/50 border border-blue-800/50 text-blue-300 rounded-lg transition-colors font-medium"
              >
                Pilot-Kit öffnen →
              </a>
            </div>
          </div>

          {/* Rechte Spalte: CRM-Aktionen */}
          <div className="space-y-5">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-base font-semibold text-white mb-4">🗂️ CRM-Aktionen</h2>
              <OutreachActionsPanel
                id={target.id}
                currentStatus={target.status}
                currentNotes={target.notes}
                currentFollowUp={target.next_follow_up_at}
                lastContactedAt={target.last_contacted_at}
              />
            </div>

            {/* Sicherheitshinweis */}
            <div className="p-3 bg-green-900/10 border border-green-800/30 rounded-xl">
              <p className="text-green-300/60 text-xs leading-relaxed">
                🔒 Alle Aktionen sind manuell und serverseitig.
                Keine automatische E-Mail. Service Role Key nur serverseitig.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
