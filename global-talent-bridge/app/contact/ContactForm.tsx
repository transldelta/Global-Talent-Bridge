'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { submitContactAction } from './actions'

const initialState = { success: false, error: undefined }

const INTEREST_OPTIONS = [
  { value: '', label: '— Kein Interesse gewählt (optional) —' },
  { value: 'pilot_employer', label: '🏢 Arbeitgeber-Pilot' },
  { value: 'candidate', label: '👤 Kandidat' },
  { value: 'partnership', label: '🤝 Partnerschaft' },
  { value: 'feedback', label: '💬 Feedback' },
  { value: 'other', label: '❓ Sonstiges' },
]

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors text-sm"
    >
      {pending ? '⏳ Wird gespeichert…' : 'Anfrage senden →'}
    </button>
  )
}

/**
 * ContactForm — Client Component
 * Liest optionale URL-Parameter (role, interest) für Vorauswahl aus Pilot-CTA.
 * Muss als 'use client' in Suspense eingebettet sein (useSearchParams-Anforderung).
 */
export function ContactForm() {
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get('role') || 'candidate'
  const defaultInterest = searchParams.get('interest') || ''

  const [state, formAction] = useFormState(submitContactAction, initialState)

  return (
    <>
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-4">Kontakt</h1>
        <p className="text-gray-400 leading-relaxed">
          Fragen, Feedback oder Partnerschaftsanfragen? Schreib uns.
          Wir melden uns manuell — keine automatischen E-Mails.
        </p>
      </div>

      {/* Hinweis */}
      <div className="mb-8 p-4 bg-blue-900/20 border border-blue-800/40 rounded-xl flex items-start gap-3">
        <span className="text-blue-400 shrink-0">ℹ️</span>
        <p className="text-blue-300 text-sm">
          Deine Anfrage wird in unserer Datenbank gespeichert. Wir melden uns manuell
          per E-Mail. Keine automatischen E-Mails, kein Spam.
        </p>
      </div>

      {state.success ? (
        /* Erfolgsmeldung */
        <div className="bg-green-900/20 border border-green-700 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-green-300 mb-2">Anfrage gespeichert!</h2>
          <p className="text-green-200/70 text-sm mb-2">
            Danke, deine Anfrage wurde gespeichert.
          </p>
          <p className="text-green-200/50 text-xs mb-6">
            Wir melden uns manuell per E-Mail — in der Regel innerhalb weniger Werktage.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors"
          >
            Zurück zur Startseite
          </Link>
        </div>
      ) : (
        /* Kontaktformular */
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          {state.error && (
            <div className="mb-5 p-3 bg-red-900/20 border border-red-700 rounded-xl text-red-300 text-sm">
              ❌ {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                minLength={2}
                placeholder="Dein vollständiger Name"
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* E-Mail */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                E-Mail <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="deine@email.de"
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Rolle + Firma */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Ich bin
                </label>
                <select
                  name="role"
                  defaultValue={defaultRole}
                  className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="candidate">Kandidat / Fachkraft</option>
                  <option value="employer">Arbeitgeber / Unternehmen</option>
                  <option value="partner">Partner / Organisation</option>
                  <option value="other">Sonstiges</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Unternehmen (optional)
                </label>
                <input
                  type="text"
                  name="company_name"
                  placeholder="Firmenname"
                  className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Interesse */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Interesse{' '}
                <span className="text-gray-500 font-normal text-xs">(optional)</span>
              </label>
              <select
                name="interest"
                defaultValue={defaultInterest}
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
              >
                {INTEREST_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Nachricht */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Nachricht <span className="text-red-400">*</span>
              </label>
              <textarea
                name="message"
                required
                minLength={10}
                rows={5}
                placeholder="Deine Frage, dein Feedback oder dein Anliegen (mind. 10 Zeichen)..."
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            {/* Datenschutz Checkbox */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                name="consent"
                id="consent"
                required
                value="on"
                className="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="consent" className="text-gray-400 text-sm leading-relaxed">
                Ich stimme der{' '}
                <Link href="/legal/datenschutz" className="text-blue-400 hover:text-blue-300" target="_blank">
                  Datenschutzerklärung
                </Link>{' '}
                zu und bin einverstanden, dass meine Anfrage gespeichert wird.{' '}
                <span className="text-red-400">*</span>
              </label>
            </div>

            <SubmitButton />
          </form>

          <p className="mt-4 text-center text-xs text-gray-600">
            Deine Anfrage wird gespeichert. Keine automatische E-Mail-Antwort.
            Wir melden uns manuell.
          </p>
        </div>
      )}
    </>
  )
}
