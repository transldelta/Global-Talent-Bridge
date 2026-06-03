import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { NavBar } from '@/app/_components/NavBar'
import { AdminNotesForm } from './AdminNotesForm'
import { CopyTemplateButton } from './CopyTemplateButton'
import { updateContactStatusAction } from '../actions'
import { StatusSelect } from '../StatusSelect'

// ── Typen ────────────────────────────────────────────────────────────────────

type ContactDetail = {
  id: string
  name: string
  email: string
  role: string | null
  company_name: string | null
  interest: string | null
  message: string
  status: string
  consent: boolean
  created_at: string
  admin_notes: string | null
  contacted_at: string | null
  next_follow_up_at: string | null
}

// ── Status-Stile ─────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-blue-900/40 text-blue-300',
  contacted: 'bg-yellow-900/40 text-yellow-300',
  qualified: 'bg-green-900/40 text-green-300',
  rejected: 'bg-red-900/40 text-red-400',
  closed: 'bg-gray-800 text-gray-500',
}

const ROLE_LABELS: Record<string, string> = {
  candidate: '👤 Kandidat',
  employer: '🏢 Arbeitgeber',
  partner: '🤝 Partner',
  other: '❓ Sonstiges',
}

const INTEREST_LABELS: Record<string, string> = {
  pilot_employer: '🏢 Pilot-Arbeitgeber',
  candidate: '👤 Kandidat',
  partnership: '🤝 Partnerschaft',
  feedback: '💬 Feedback',
  other: '❓ Sonstiges',
}

// ── Antwortvorlagen ───────────────────────────────────────────────────────────

function buildTemplate(name: string, interest: string | null): string {
  const greeting = `Hallo ${name},`
  const signature = `\nMit freundlichen Grüßen\nBrahim Ben Abla\nGlobal Talent Bridge | transl.delta@gmail.com`

  switch (interest) {
    case 'pilot_employer':
      return `${greeting}

vielen Dank für Ihre Anfrage als Pilot-Arbeitgeber bei Global Talent Bridge.

Wir befinden uns in der MVP-Phase und suchen aktiv nach Unternehmen, die unsere Plattform testen und uns ehrliches Feedback geben möchten.

Ich würde mich freuen, mehr über Ihre konkreten Anforderungen zu erfahren. Hätten Sie 15 Minuten für ein kurzes Gespräch?

Unsere Plattform verbindet internationale Fachkräfte mit Arbeitgebern über ein strukturiertes Matching — kostenlos in der aktuellen Phase.${signature}`

    case 'candidate':
      return `${greeting}

vielen Dank für Ihr Interesse an Global Talent Bridge.

Sie können sich kostenlos als Kandidat registrieren und Ihr Profil ausfüllen:
https://global-talent-bridge.vercel.app/auth/register?role=candidate

Das System berechnet dann automatisch passende Job-Matches für Sie. Bei Fragen stehe ich gerne zur Verfügung.${signature}`

    case 'partnership':
      return `${greeting}

vielen Dank für Ihr Interesse an einer Partnerschaft mit Global Talent Bridge.

Wir sind offen für Kooperationen mit Organisationen, die internationalen Talenten helfen. Ich würde gerne mehr über Ihre Ideen erfahren.

Können wir einen kurzen Austausch vereinbaren?${signature}`

    case 'feedback':
      return `${greeting}

vielen Dank für Ihr Feedback zu Global Talent Bridge!

Ihr Input ist wertvoll für uns — besonders in der aktuellen MVP-Phase. Wir lesen jedes Feedback sorgfältig und berücksichtigen es bei der Weiterentwicklung.

Falls Sie weitere Gedanken haben, freuen wir uns über Ihre Rückmeldung.${signature}`

    default:
      return `${greeting}

vielen Dank für Ihre Anfrage bei Global Talent Bridge.

Ich habe Ihre Nachricht erhalten und melde mich in Kürze mit einer Antwort zurück.${signature}`
  }
}

// ── Seite ────────────────────────────────────────────────────────────────────

export default async function LeadDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const admin = await getCurrentAdminUser()

  if (!admin) {
    redirect('/auth/login')
  }

  const supabase = createAdminClient()
  const { data: contact } = await supabase
    .from('contact_requests')
    .select(
      'id, name, email, role, company_name, interest, message, status, consent, created_at, admin_notes, contacted_at, next_follow_up_at'
    )
    .eq('id', params.id)
    .single()

  if (!contact) {
    notFound()
  }

  const detail = contact as ContactDetail
  const template = buildTemplate(detail.name.split(' ')[0], detail.interest)

  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar badge="Admin" badgeColor="purple" />

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* Zurück + Titel */}
        <div>
          <Link
            href="/admin/leads"
            className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            ← Zurück zu Leads
          </Link>
          <h1 className="text-2xl font-bold text-white mt-3">
            {detail.name}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLES[detail.status] ?? STATUS_STYLES.new}`}>
              {detail.status}
            </span>
            {detail.interest && (
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                detail.interest === 'pilot_employer'
                  ? 'bg-green-900/40 text-green-300'
                  : 'bg-blue-900/40 text-blue-300'
              }`}>
                {INTEREST_LABELS[detail.interest] ?? detail.interest}
              </span>
            )}
            {detail.contacted_at && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-yellow-900/30 text-yellow-300 font-medium">
                ✉️ Kontaktiert
              </span>
            )}
            <span className="text-gray-600 text-xs">
              {new Date(detail.created_at).toLocaleDateString('de-DE', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Linke Spalte: Kontaktdaten + Nachricht */}
          <div className="lg:col-span-2 space-y-5">

            {/* Kontaktdaten */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-base font-semibold text-white mb-4">📋 Kontaktdaten</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Name</p>
                  <p className="text-white text-sm font-medium">{detail.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">E-Mail</p>
                  <a
                    href={`mailto:${detail.email}`}
                    className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                  >
                    {detail.email}
                  </a>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Rolle</p>
                  <p className="text-white text-sm">
                    {ROLE_LABELS[detail.role ?? ''] ?? detail.role ?? '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Unternehmen</p>
                  <p className="text-white text-sm">{detail.company_name ?? '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Interesse</p>
                  <p className="text-white text-sm">
                    {detail.interest
                      ? (INTEREST_LABELS[detail.interest] ?? detail.interest)
                      : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Datenschutz zugestimmt</p>
                  <p className="text-white text-sm">{detail.consent ? '✅ Ja' : '❌ Nein'}</p>
                </div>
                {detail.next_follow_up_at && (
                  <div className="sm:col-span-2">
                    <p className="text-xs text-gray-500 mb-1">Nächstes Follow-up</p>
                    <p className="text-yellow-300 text-sm font-medium">
                      📅 {new Date(detail.next_follow_up_at).toLocaleDateString('de-DE')}
                    </p>
                  </div>
                )}
              </div>

              {/* Status ändern */}
              <div className="mt-5 pt-4 border-t border-gray-800 flex items-center gap-3">
                <p className="text-xs text-gray-500">Status:</p>
                <StatusSelect
                  id={detail.id}
                  currentStatus={detail.status}
                  action={updateContactStatusAction}
                />
              </div>
            </div>

            {/* Nachricht */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-base font-semibold text-white mb-3">💬 Nachricht</h2>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                {detail.message}
              </p>
            </div>

            {/* Manuelle Antwortvorlage */}
            <div className="bg-gray-900 border border-blue-800/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-white">✉️ Manuelle Antwortvorlage</h2>
                <CopyTemplateButton text={template} />
              </div>
              <div className="p-3 bg-blue-900/10 border border-blue-800/20 rounded-xl mb-3">
                <p className="text-blue-300/70 text-xs">
                  Diese Vorlage wird nur angezeigt. Keine automatische E-Mail wird gesendet.
                  Kopiere den Text und sende ihn manuell über dein E-Mail-Programm.
                </p>
              </div>
              <pre className="text-gray-300 text-xs leading-relaxed whitespace-pre-wrap font-mono bg-gray-800 rounded-lg p-4 overflow-x-auto">
                {template}
              </pre>
            </div>
          </div>

          {/* Rechte Spalte: CRM-Aktionen */}
          <div className="space-y-5">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-base font-semibold text-white mb-4">🗂️ CRM</h2>
              <AdminNotesForm
                id={detail.id}
                currentNotes={detail.admin_notes}
                currentFollowUp={detail.next_follow_up_at}
                contactedAt={detail.contacted_at}
                currentStatus={detail.status}
              />
            </div>

            {/* Sicherheitshinweis */}
            <div className="p-3 bg-green-900/10 border border-green-800/30 rounded-xl">
              <p className="text-green-300/60 text-xs leading-relaxed">
                🔒 Alle Aktionen sind manuell und serverseitig.
                Keine automatische E-Mail. Kein Datenleck.
                Service Role Key nur serverseitig.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
