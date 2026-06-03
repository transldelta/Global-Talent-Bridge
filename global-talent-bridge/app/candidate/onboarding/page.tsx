import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { saveCandidateOnboardingAction } from '@/app/actions'

interface Props {
  searchParams: { error?: string }
}

export default async function CandidateOnboardingPage({ searchParams }: Props) {
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Kandidaten-Profil</h1>
          <p className="text-gray-400">Fülle dein Profil aus, damit wir passende Jobs finden können.</p>

          {/* 5-Schritte-Hinweis */}
          <div className="mt-4 flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className="flex-1 h-1.5 rounded-full bg-blue-600"
              />
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
          <form action={saveCandidateOnboardingAction} className="space-y-6">

            {/* Persönliche Daten */}
            <div>
              <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4">
                Persönliche Daten
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Vollständiger Name
                  </label>
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

            {/* Berufliche Daten */}
            <div>
              <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4">
                Berufliche Qualifikation
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Branche / Sektor</label>
                  <input
                    name="sector"
                    type="text"
                    placeholder="IT, Pflege, Logistik ..."
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Jahre Erfahrung</label>
                  <input
                    name="years_experience"
                    type="number"
                    min="0"
                    max="50"
                    defaultValue={0}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Sprachkenntnisse */}
            <div>
              <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4">
                Sprachkenntnisse
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Deutschlevel</label>
                  <select
                    name="german_level"
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Kein</option>
                    {LANGUAGE_LEVELS.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Englischlevel</label>
                  <select
                    name="english_level"
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Kein</option>
                    {LANGUAGE_LEVELS.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Präferenzen */}
            <div>
              <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4">
                Präferenzen
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Fähigkeiten <span className="text-gray-500">(kommagetrennt)</span>
                  </label>
                  <input
                    name="skills"
                    type="text"
                    placeholder="Python, Projektmanagement, Pflege ..."
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Bevorzugte Länder <span className="text-gray-500">(kommagetrennt, leer = alle)</span>
                  </label>
                  <input
                    name="preferred_countries"
                    type="text"
                    placeholder="Deutschland, Österreich, Schweiz ..."
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
