import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicNavBar } from '@/app/_components/PublicNavBar'
import { PublicFooter } from '@/app/_components/PublicFooter'

export const metadata: Metadata = {
  title: 'Für Arbeitgeber',
  description:
    'Qualifizierte internationale Kandidaten finden. Jobs einstellen, Matching-Scores sehen, Kandidaten kontaktieren. Kostenlos starten.',
  openGraph: {
    title: 'Für Arbeitgeber — CorridorWork',
    description: 'Internationale Talente finden — strukturiert, mit transparentem Matching-Score.',
    type: 'website',
  },
}

export default function ForEmployersPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <PublicNavBar />

      {/* Hero */}
      <section className="px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-900/40 border border-green-700/50 text-green-300 text-xs font-medium mb-6">
            🏢 Für Arbeitgeber
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight">
            Qualifizierte internationale Talente finden
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            Erstelle Jobs mit klaren Anforderungen und sieh sofort, welche Kandidaten
            am besten passen — sortiert nach Matching-Score.
          </p>
          <Link
            href="/auth/register?role=employer"
            className="inline-block px-8 py-4 bg-green-700 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors text-base"
          >
            Kostenlos als Arbeitgeber starten →
          </Link>
          <p className="mt-3 text-sm text-gray-600">Kein Kreditkarte · Kostenlos starten</p>
        </div>
      </section>

      {/* Ablauf */}
      <section className="px-4 py-16 border-t border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-3">
            In 3 Schritten zu deinen Kandidaten
          </h2>
          <p className="text-gray-400 text-center mb-10">
            Keine manuelle Vorauswahl. Kein Sichten unpassender Bewerbungen.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                step: '1',
                icon: '🏢',
                title: 'Unternehmensprofil anlegen',
                text: 'Unternehmensname, Branche, Land und Kontakt-E-Mail einmal angeben. Fertig in wenigen Minuten.',
              },
              {
                step: '2',
                icon: '💼',
                title: 'Job erstellen',
                text: 'Jobtitel, Branche, Standort, Mindest-Erfahrung, Sprachanforderungen (Deutsch/Englisch) und Gehalt definieren.',
              },
              {
                step: '3',
                icon: '📊',
                title: 'Kandidaten-Matches sehen',
                text: 'Sobald Kandidaten das Matching starten, erscheinen sie rankiert nach Score: Name, Branche, Erfahrung, Sprachlevel, Score.',
              },
            ].map((item) => (
              <div key={item.step} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-green-700 text-white text-sm font-bold flex items-center justify-center shrink-0">
                    {item.step}
                  </div>
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Was Arbeitgeber sehen */}
      <section className="px-4 py-16 border-t border-gray-800 bg-gray-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-10">
            Was du als Arbeitgeber siehst
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { icon: '🎯', title: 'Matching-Score (0–100 %)', text: 'Für jeden Kandidaten ein klarer Score basierend auf Branche, Erfahrung und Sprachlevel.' },
              { icon: '👤', title: 'Kandidaten-Details', text: 'Name, Branche, Erfahrungsjahre, Deutschkenntnisse, Englischkenntnisse — auf einen Blick.' },
              { icon: '📋', title: 'Job-Dashboard', text: 'Alle deine Jobs mit Status (aktiv/inaktiv), Match-Anzahl und Zugang zu Detailansichten.' },
              { icon: '🔄', title: 'Job-Status steuern', text: 'Jobs jederzeit aktivieren oder deaktivieren. Inaktive Jobs nehmen nicht am Matching teil.' },
              { icon: '📈', title: 'KPIs im Dashboard', text: 'Jobs gesamt, aktive Jobs, Matches gesamt, bester Score — immer im Überblick.' },
              { icon: '🔒', title: 'Sichere Daten', text: 'Kandidatenprofile sind nur für verifizierte Arbeitgeber sichtbar, nicht öffentlich zugänglich.' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="text-2xl shrink-0">{item.icon}</div>
                <div>
                  <p className="text-white font-medium mb-1">{item.title}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="px-4 py-16 border-t border-gray-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Pricing</h2>
          <p className="text-gray-400 mb-8">
            Für Arbeitgeber gibt es verschiedene Pakete. In der aktuellen MVP-Phase
            sind alle Funktionen kostenlos nutzbar. Zahlungen werden in einer
            späteren Phase aktiviert.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { name: 'Free', price: '0 €', color: 'text-gray-300' },
              { name: 'Starter', price: '49 €/Mo', color: 'text-blue-300' },
              { name: 'Growth', price: '149 €/Mo', color: 'text-purple-300' },
              { name: 'Enterprise', price: '499 €/Mo', color: 'text-amber-300' },
            ].map((plan) => (
              <div key={plan.name} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
                <p className={`text-sm font-semibold mb-1 ${plan.color}`}>{plan.name}</p>
                <p className="text-white text-xs">{plan.price}</p>
              </div>
            ))}
          </div>
          <div className="p-3 bg-yellow-900/20 border border-yellow-800/40 rounded-xl text-sm text-yellow-300 mb-6">
            ⚠️ Zahlungen sind in dieser MVP-Version noch nicht aktiviert.
          </div>
          <Link
            href="/pricing"
            className="inline-block text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            Alle Pricing-Details ansehen →
          </Link>
        </div>
      </section>

      {/* Pilot-Arbeitgeber-Abschnitt */}
      <section className="px-4 py-16 border-t border-gray-800 bg-gradient-to-r from-green-900/10 to-blue-900/10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-900/40 border border-green-700/50 text-green-300 text-xs font-medium mb-4">
              🏢 Jetzt gesucht
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">Pilot-Arbeitgeber gesucht</h2>
            <p className="text-gray-400 text-base leading-relaxed max-w-2xl mx-auto">
              CorridorWork ist live und voll funktionsfähig — jetzt suchen wir Unternehmen,
              die die Plattform als erste testen und mitgestalten.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {[
              {
                icon: '✅',
                title: 'MVP ist live',
                text: 'Die Plattform funktioniert bereits: Arbeitgeber-Profile, Job-Erstellung, Matching-Score, Kandidaten-Übersicht.',
              },
              {
                icon: '🆓',
                title: 'Komplett kostenlos',
                text: 'In der Pilot-Phase entstehen keine Kosten. Kein Vertrag, keine Zahlungspflicht, keine versteckten Bedingungen.',
              },
              {
                icon: '👤',
                title: 'Persönliche Betreuung',
                text: 'Ich bin direkt erreichbar und beantworte Fragen persönlich. Kein Support-Ticket, kein automatisches System.',
              },
              {
                icon: '💬',
                title: 'Dein Feedback zählt',
                text: 'Pilot-Arbeitgeber prägen direkt die Weiterentwicklung. Was fehlt, was stört, was hilft — ich setze es schnell um.',
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="text-2xl shrink-0">{item.icon}</div>
                <div>
                  <p className="text-white font-medium mb-1 text-sm">{item.title}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Was Pilot-Arbeitgeber machen */}
          <div className="bg-gray-900 border border-green-800/30 rounded-2xl p-6 mb-6">
            <h3 className="text-white font-semibold mb-4">So läuft die Pilot-Phase ab</h3>
            <div className="space-y-3">
              {[
                { n: '1', text: 'Konto erstellen oder Pilot-Anfrage senden' },
                { n: '2', text: 'Unternehmensprofil anlegen (5 Minuten)' },
                { n: '3', text: 'Einen oder mehrere Jobs erstellen' },
                { n: '4', text: 'Matching-Score und passende Kandidaten ansehen' },
                { n: '5', text: 'Direktes Feedback an mich — was hilft, was fehlt' },
              ].map((step) => (
                <div key={step.n} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-700 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {step.n}
                  </div>
                  <p className="text-gray-300 text-sm">{step.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact?role=employer&interest=pilot_employer"
                className="px-8 py-4 bg-green-700 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors"
              >
                📋 Als Pilot-Arbeitgeber anfragen
              </Link>
              <Link
                href="/auth/register?role=employer"
                className="px-8 py-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 font-semibold rounded-xl transition-colors"
              >
                🏢 Direkt registrieren
              </Link>
            </div>
            <p className="mt-3 text-xs text-gray-600">
              Pilot-Anfrage = persönliches Gespräch, keine automatischen E-Mails, kein Spam.
              Direkte Registrierung = sofort loslegen, kein Gespräch nötig.
            </p>
          </div>
        </div>
      </section>

      {/* Spätere Premium-Funktionen */}
      <section className="px-4 py-16 border-t border-gray-800 bg-gray-900/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-3">🚀 Kommende Premium-Funktionen</h2>
          <p className="text-gray-400 text-sm mb-8">
            Diese Funktionen sind in Vorbereitung und werden in Premium-Plänen verfügbar sein.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              'Erweiterte Kandidatenprofile',
              'Direkter Kontakt zu Kandidaten',
              'Mehr gleichzeitige Jobs',
              'Priorität im Matching',
              'Team-Zugänge',
              'CSV-Export',
              'API-Zugang',
              'Dedizierter Support',
            ].map((f) => (
              <span
                key={f}
                className="text-xs px-3 py-1.5 bg-purple-900/20 border border-purple-800/30 text-purple-300 rounded-full"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 border-t border-gray-800 bg-gradient-to-r from-green-900/20 to-blue-900/20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Jetzt kostenlos starten</h2>
          <p className="text-gray-400 mb-6">
            Unternehmensprofil anlegen, ersten Job erstellen, Kandidaten finden.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register?role=employer"
              className="px-8 py-4 bg-green-700 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors"
            >
              🏢 Als Arbeitgeber registrieren →
            </Link>
            <Link
              href="/contact?role=employer&interest=pilot_employer"
              className="px-8 py-4 bg-blue-900/40 hover:bg-blue-800/60 border border-blue-700/60 text-blue-300 font-semibold rounded-xl transition-colors"
            >
              📋 Als Pilot-Arbeitgeber anfragen
            </Link>
          </div>
          <p className="mt-4 text-xs text-gray-600">
            Pilot-Anfrage: Direktes Gespräch, keine automatischen E-Mails, kein Spam.
          </p>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
