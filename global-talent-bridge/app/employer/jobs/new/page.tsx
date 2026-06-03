import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { NavBar } from '@/app/_components/NavBar'
import { createJobAction } from '@/app/employer/actions'

const LANGUAGE_LEVELS = ['', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Muttersprache']

export default async function NewJobPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: employer } = await supabase
    .from('employers')
    .select('id, company_name')
    .eq('user_id', user.id)
    .single()

  if (!employer) redirect('/employer/onboarding')

  const error = searchParams?.error

  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar badge="Arbeitgeber" badgeColor="green" />

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/employer/jobs" className="hover:text-gray-300 transition-colors">
            Meine Jobs
          </Link>
          <span>/</span>
          <span className="text-white">Neuer Job</span>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <h1 className="text-xl font-bold text-white mb-2">Neuen Job erstellen</h1>
          <p className="text-gray-400 text-sm mb-6">
            Firma: <span className="text-white">{employer.company_name}</span>
          </p>

          {/* Fehlermeldung */}
          {error && (
            <div className="mb-6 bg-red-900/20 border border-red-700 rounded-xl p-3 text-red-300 text-sm">
              ❌ {error}
            </div>
          )}

          <form action={createJobAction} className="space-y-5">
            {/* Jobtitel */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Jobtitel <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                placeholder="z.B. Senior Python Developer"
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Branche */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Branche
              </label>
              <input
                type="text"
                name="sector"
                placeholder="z.B. IT & Software"
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Erfahrung + Gehalt */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Erfahrung (Jahre)
                </label>
                <input
                  type="number"
                  name="required_experience"
                  min="0"
                  max="20"
                  defaultValue="0"
                  className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Gehalt
                </label>
                <input
                  type="text"
                  name="salary_range"
                  placeholder="z.B. 60.000 – 80.000 €"
                  className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Sprachkenntnisse */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  🇩🇪 Deutschkenntnisse
                </label>
                <select
                  name="required_german"
                  className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  {LANGUAGE_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level || 'Keine Anforderung'}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  🇬🇧 Englischkenntnisse
                </label>
                <select
                  name="required_english"
                  className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  {LANGUAGE_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level || 'Keine Anforderung'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Ort */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Stadt
                </label>
                <input
                  type="text"
                  name="city"
                  placeholder="z.B. München"
                  className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Land
                </label>
                <input
                  type="text"
                  name="country"
                  placeholder="z.B. Deutschland"
                  className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Status
              </label>
              <select
                name="is_active"
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="true">✅ Aktiv (sofort sichtbar)</option>
                <option value="false">⏸ Inaktiv (versteckt)</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Job erstellen →
              </button>
              <Link
                href="/employer/jobs"
                className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded-lg transition-colors"
              >
                Abbrechen
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
