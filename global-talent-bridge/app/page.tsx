import Link from 'next/link'

export default function Home() {
  const departments = [
    'Strategie & Vision',
    'Produkt & Technik',
    'Daten & Matching',
    'Marketing & Wachstum',
    'Sales & Arbeitgebergewinnung',
    'Partnerschaften & Netzwerke',
    'Umsatz & Monetarisierung',
    'Kundenservice & Support',
    'Recht, DSGVO & Risiko',
    'Qualität & Kontrolle',
    'Finanzen & Kostenkontrolle',
    'Automatisierung & Orchestrierung',
  ]

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero */}
      <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-900/40 border border-purple-700/50 text-purple-300 text-xs font-medium mb-6">
            🏗️ MVP Phase 1 — Fundament aufgebaut
          </div>

          {/* Titel */}
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Global{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Talent Bridge
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed">
            Internationale Talente treffen globale Arbeitgeber.
            KI-gestütztes Matching. Automatisiertes Unternehmen.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register?role=candidate"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors"
            >
              👤 Als Kandidat registrieren
            </Link>
            <Link
              href="/auth/register?role=employer"
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl border border-gray-700 transition-colors"
            >
              🏢 Als Arbeitgeber registrieren
            </Link>
          </div>

          <div className="mt-4">
            <Link
              href="/auth/login"
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              Bereits registriert? Einloggen →
            </Link>
          </div>
        </div>
      </main>

      {/* CEO-Struktur */}
      <section className="px-4 py-20 border-t border-gray-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">
              🎯 CEO-geführte Unternehmensarchitektur
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Global Talent Bridge ist wie ein automatisiertes Unternehmen aufgebaut.
              12 spezialisierte Abteilungen, koordiniert vom CEO-Agenten.
            </p>
          </div>

          {/* CEO */}
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-700/40 rounded-2xl p-6 mb-6 text-center">
            <div className="text-4xl mb-2">🎯</div>
            <h3 className="text-xl font-bold text-white">CEO / Erzdirigent</h3>
            <p className="text-gray-400 text-sm mt-1">
              Kontrolliert alle Abteilungen · Priorisiert Aufgaben · Erkennt Risiken
            </p>
          </div>

          {/* 12 Abteilungen */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {departments.map((dept, i) => (
              <div
                key={dept}
                className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center"
              >
                <div className="text-lg mb-1">{['📊','⚙️','🔍','📢','💼','🤝','💰','🎧','⚖️','✅','💹','🤖'][i]}</div>
                <p className="text-gray-300 text-xs font-medium leading-tight">{dept}</p>
                <div className="mt-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-500">
                    Phase 1 bereit
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-4 text-center">
        <p className="text-gray-600 text-sm">
          Global Talent Bridge · MVP Phase 1 ·{' '}
          <Link href="/auth/login" className="text-gray-500 hover:text-gray-300">
            Login
          </Link>
          {' · '}
          <Link href="/admin/ceo-dashboard" className="text-gray-500 hover:text-gray-300">
            Admin
          </Link>
        </p>
      </footer>
    </div>
  )
}
