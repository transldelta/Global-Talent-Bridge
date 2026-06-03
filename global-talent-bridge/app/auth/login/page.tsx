import Link from 'next/link'
import { loginAction } from '@/app/actions'

interface Props {
  searchParams: { error?: string; message?: string; redirectTo?: string }
}

export default function LoginPage({ searchParams }: Props) {
  const { error, message } = searchParams

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Global Talent Bridge</h1>
          <p className="text-gray-400">Willkommen zurück</p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Einloggen</h2>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/40 border border-red-700 rounded-lg text-red-300 text-sm">
              {decodeURIComponent(error)}
            </div>
          )}

          {/* Success message */}
          {message && (
            <div className="mb-4 p-3 bg-green-900/40 border border-green-700 rounded-lg text-green-300 text-sm">
              {decodeURIComponent(message)}
            </div>
          )}

          <form action={loginAction} className="space-y-4">
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

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Passwort
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
            >
              Einloggen
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-800 text-center">
            <p className="text-gray-400 text-sm">
              Noch kein Konto?{' '}
              <Link href="/auth/register" className="text-blue-400 hover:text-blue-300 font-medium">
                Jetzt registrieren
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
