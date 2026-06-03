import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { saveEmployerOnboardingAction } from '@/app/actions'

interface Props {
  searchParams: { error?: string }
}

export default async function EmployerOnboardingPage({ searchParams }: Props) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { error } = searchParams
  const LANGUAGE_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

  return (
    <div className="min-h-screen bg-gray-950 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Arbeitgeber-Profil</h1>
          <p className="text-gray-400">Stell dein Unternehmen vor und erstelle deinen ersten Job.</p>
          <div className="mt-4 flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex-1 h-1.5 rounded-full bg-blue-600" />
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">Alle 5 Schritte in einem Formular</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-900/40 border border-red-700 rounded-lg text-red-300 text-sm">
            {decodeURIComponent(error)}
          </div>
        )}

        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
          <form action={saveEmployerOnboardingAction} className="space-y-6">

            {/* Kontaktperson */}
            <div>
              <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4">
                Kontaktperson
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Vollständiger Name *</label>
                  <input
                    name="full_name"
                    type="text"
                    required
                    placeholder="Max Mustermann"
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Land</label>
                  <input
                    name="country"
                    type="text"
                    placeholder="Deutschland"
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Stadt</label>
                  <input
                    name="city"
                    type="text"
                    placeholder="Berlin"
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Unternehmen */}
            <div>
              <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4">
                Unternehmen
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Firmenname *</label>
                  <input
                    name="company_name"
                    type="text"
                    required
                    placeholder="Musterfirma GmbH"
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Branche</label>
                  <input
                    name="sector"
                    type="text"
                    placeholder="IT, Pflege, Logistik ..."
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Kontakt-E-Mail</label>
                  <input
                    name="contact_email"
                    type="email"
                    placeholder="hr@firma.de"
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Erster Job (optional) */}
            <div>
              <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-1">
                Erster Job <span className="text-gray-500 font-normal normal-case">(optional)</span>
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Du kannst auch später Jobs hinzufügen.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Jobtitel</label>
                  <input
                    name="job_title"
                    type="text"
                    placeholder="Senior Softwareentwickler"
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Min. Erfahrung (Jahre)</label>
                  <input
                    name="required_experience"
                    type="number"
                    min="0"
                    defaultValue={0}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Gehaltsspanne</label>
                  <input
                    name="salary_range"
                    type="text"
                    placeholder="3.000 - 5.000 €"
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Mindest-Deutschlevel</label>
                  <select
                    name="required_german"
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Kein</option>
                    {LANGUAGE_LEVELS.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Mindest-Englischlevel</label>
                  <select
                    name="required_english"
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Kein</option>
                    {LANGUAGE_LEVELS.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Stadt</label>
                  <input
                    name="job_city"
                    type="text"
                    placeholder="Berlin"
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Land</label>
                  <input
                    name="job_country"
                    type="text"
                    placeholder="Deutschland"
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors"
            >
              Profil speichern & zum Dashboard →
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
