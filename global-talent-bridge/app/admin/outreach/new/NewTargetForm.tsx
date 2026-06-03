'use client'

import { useFormStatus } from 'react-dom'
import { createOutreachTargetAction } from '../actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-6 py-2.5 bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors"
    >
      {pending ? '⏳ Wird gespeichert…' : '✅ Ziel hinzufügen'}
    </button>
  )
}

/**
 * NewTargetForm — Client Component für Formular-Interaktion.
 * Keine E-Mail wird gesendet. Nur DB-Eintrag wird erstellt.
 */
export function NewTargetForm() {
  return (
    <form action={createOutreachTargetAction} className="space-y-5">

      {/* Firma */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Firmenname <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="company_name"
            required
            placeholder="z.B. TechBridge GmbH"
            className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Ansprechpartner</label>
          <input
            type="text"
            name="contact_person"
            placeholder="z.B. Maria Müller"
            className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">E-Mail</label>
          <input
            type="email"
            name="email"
            placeholder="kontakt@firma.de"
            className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Telefon</label>
          <input
            type="tel"
            name="phone"
            placeholder="+49 30 123456"
            className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Website</label>
          <input
            type="url"
            name="website"
            placeholder="https://firma.de"
            className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Branche</label>
          <input
            type="text"
            name="sector"
            placeholder="z.B. IT, Pflege, Gastronomie, Logistik"
            className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Stadt</label>
          <input
            type="text"
            name="city"
            placeholder="z.B. Berlin"
            className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Land</label>
          <input
            type="text"
            name="country"
            defaultValue="Deutschland"
            className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Priorität</label>
          <select
            name="priority"
            defaultValue="normal"
            className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="high">🔴 Hoch</option>
            <option value="normal">🟡 Normal</option>
            <option value="low">🟢 Niedrig</option>
          </select>
        </div>
      </div>

      {/* Notizen */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Notizen{' '}
          <span className="text-gray-600 font-normal text-xs">(intern — nicht sichtbar für Firma)</span>
        </label>
        <textarea
          name="notes"
          rows={3}
          placeholder="Woher kam der Kontakt? Besondere Hinweise? Bisherige Gespräche?"
          className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 resize-none"
        />
      </div>

      {/* Hinweis */}
      <div className="p-3 bg-blue-900/10 border border-blue-800/30 rounded-xl">
        <p className="text-blue-300/70 text-xs">
          💡 Nach dem Speichern wirst du zur Detailseite weitergeleitet.
          Dort kannst du personalisierte Nachrichten generieren und Status-Aktionen ausführen.
          Keine E-Mail wird automatisch gesendet.
        </p>
      </div>

      <SubmitButton />
    </form>
  )
}
