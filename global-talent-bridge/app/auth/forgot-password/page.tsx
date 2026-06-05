import Link from 'next/link'
import { forgotPasswordAction } from '@/app/actions'

interface Props {
  searchParams: { error?: string; message?: string }
}

export default function ForgotPasswordPage({ searchParams }: Props) {
  const { error, message } = searchParams

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">CorridorWork</h1>
          <p className="text-gray-400">Passwort zurücksetzen</p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
          <h2 className="text-xl font-semibold text-white mb-2">Passwort vergessen?</h2>
          <p className="text-gray-400 text-sm mb-6">
            Gib deine E-Mail-Adresse ein. Falls ein Konto existiert, senden wir dir einen Reset-Link.
          </p>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/40 border border-red-700 rounded-lg text-red-300 text-sm">
              {decodeURIComponent(error)}
            </div>
          )}

          {/* Success */}
          {message && (
            <div className="mb-4 p-3 bg-green-900/40 border border-green-700 rounded-lg text-green-300 text-sm">
              {decodeURIComponent(message)}
            </div>
          )}

          {!message && (
            <form action={forgotPasswordAction} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  E-Mail-Adresse
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

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
              >
                Reset-Link senden
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-gray-800 text-center">
            <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              ← Zurück zum Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
