import Link from 'next/link'
import { registerAction } from '@/app/actions'

interface Props {
  searchParams: { error?: string; role?: string }
}

export default function RegisterPage({ searchParams }: Props) {
  const { error, role: defaultRole } = searchParams

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Global Talent Bridge</h1>
          <p className="text-gray-400">Konto erstellen</p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Registrieren</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-900/40 border border-red-700 rounded-lg text-red-300 text-sm">
              {decodeURIComponent(error)}
            </div>
          )}

          <form action={registerAction} className="space-y-4">
            {/* Voller Name */}
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-300 mb-1">
                Vollständiger Name
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                placeholder="Max Mustermann"
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* E-Mail */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                E-Mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="name@beispiel.de"
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Passwort */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Passwort
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
                placeholder="Mindestens 6 Zeichen"
                minLength={6}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Rolle */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ich bin ...
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="candidate"
                    defaultChecked={defaultRole !== 'employer'}
                    className="sr-only peer"
                  />
                  <div className="p-3 bg-gray-800 border border-gray-700 rounded-lg text-center peer-checked:border-blue-500 peer-checked:bg-blue-900/30 transition-colors">
                    <div className="text-2xl mb-1">👤</div>
                    <div className="text-sm font-medium text-gray-200">Kandidat</div>
                    <div className="text-xs text-gray-500">Ich suche Arbeit</div>
                  </div>
                </label>
                <label className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="employer"
                    defaultChecked={defaultRole === 'employer'}
                    className="sr-only peer"
                  />
                  <div className="p-3 bg-gray-800 border border-gray-700 rounded-lg text-center peer-checked:border-blue-500 peer-checked:bg-blue-900/30 transition-colors">
                    <div className="text-2xl mb-1">🏢</div>
                    <div className="text-sm font-medium text-gray-200">Arbeitgeber</div>
                    <div className="text-xs text-gray-500">Ich stelle ein</div>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
            >
              Konto erstellen
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-800 text-center">
            <p className="text-gray-400 text-sm">
              Bereits ein Konto?{' '}
              <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 font-medium">
                Einloggen
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-gray-500 hover:text-gray-400 text-sm">
            ← Zurück zur Startseite
          </Link>
        </div>
      </div>
    </div>
  )
}
