import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicNavBar } from '@/app/_components/PublicNavBar'
import { PublicFooter } from '@/app/_components/PublicFooter'

export const metadata: Metadata = {
  title: 'Global Talent Bridge — Internationale Talente treffen globale Arbeitgeber',
  description:
    'Kostenlose Registrierung für internationale Fachkräfte und Arbeitgeber. KI-gestütztes Matching nach Erfahrung, Sprachlevel und Zielland.',
  openGraph: {
    title: 'Global Talent Bridge',
    description: 'Internationale Talente treffen globale Arbeitgeber — kostenloses Matching.',
    type: 'website',
    locale: 'de_DE',
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <PublicNavBar />

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-900/40 border border-blue-700/50 text-blue-300 text-xs font-medium mb-6">
            🌍 Kostenlos starten · Kein Kreditkarte erforderlich
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Internationale Talente{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              treffen globale Arbeitgeber
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Dein Profil. Dein Sprachlevel. Deine Erfahrung. Wir verbinden dich mit den
            passenden Jobs — automatisch, transparent und kostenlos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register?role=candidate"
              className="px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors text-base"
            >
              👤 Als Kandidat registrieren
            </Link>
            <Link
              href="/auth/register?role=employer"
              className="px-7 py-3.5 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl border border-gray-700 transition-colors text-base"
            >
              🏢 Als Arbeitgeber starten
            </Link>
          </div>
          <p className="mt-5 text-sm text-gray-600">
            Bereits registriert?{' '}
            <Link href="/auth/login" className="text-gray-400 hover:text-white transition-colors">
              Einloggen →
            </Link>
          </p>
        </div>
      </section>

      {/* ── PROBLEM ──────────────────────────────────── */}
      <section className="px-4 py-16 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Das Problem
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
            Qualifizierte internationale Fachkräfte finden keine passenden Jobs.
            Arbeitgeber finden keine passenden Kandidaten aus dem Ausland.
            Beide Seiten verlieren Zeit mit unstrukturierten Bewerbungen.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: '🌐', title: 'Sprachbarrieren', text: 'Anforderungen sind unklar, Kandidaten wissen nicht, ob sie qualifiziert sind.' },
              { icon: '📋', title: 'Unstrukturierte Suche', text: 'Keine klare Übersicht, welche Erfahrung und Sprachlevel wirklich gefordert sind.' },
              { icon: '⏱️', title: 'Zeitverschwendung', text: 'Arbeitgeber sichten hunderte irrelevante Bewerbungen manuell.' },
            ].map((item) => (
              <div key={item.title} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LÖSUNG ───────────────────────────────────── */}
      <section className="px-4 py-16 border-t border-gray-800 bg-gray-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Unsere Lösung
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
            Global Talent Bridge bringt strukturierte Kandidatenprofile und
            klare Job-Anforderungen zusammen — mit einem transparenten Matching-Score.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
            <div className="bg-gray-900 border border-blue-800/40 rounded-2xl p-6">
              <div className="text-2xl mb-3">🎯</div>
              <h3 className="text-white font-semibold mb-2">Strukturiertes Matching</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Kandidaten geben Sprachlevel, Erfahrungsjahre und Zielländer an.
                Jobs definieren klare Anforderungen. Das System berechnet einen
                Matching-Score (0–100 %).
              </p>
            </div>
            <div className="bg-gray-900 border border-purple-800/40 rounded-2xl p-6">
              <div className="text-2xl mb-3">🔍</div>
              <h3 className="text-white font-semibold mb-2">Transparenz für beide Seiten</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Kandidaten sehen ihren Score pro Job. Arbeitgeber sehen
                rankierte Kandidaten mit Detailinfos zu Erfahrung und Sprachkenntnissen.
              </p>
            </div>
            <div className="bg-gray-900 border border-green-800/40 rounded-2xl p-6">
              <div className="text-2xl mb-3">🆓</div>
              <h3 className="text-white font-semibold mb-2">Kostenlos für Kandidaten</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Die Registrierung und das Matching sind für Kandidaten dauerhaft kostenlos.
                Kein versteckter Preis, keine Kreditkarte.
              </p>
            </div>
            <div className="bg-gray-900 border border-yellow-800/40 rounded-2xl p-6">
              <div className="text-2xl mb-3">🚀</div>
              <h3 className="text-white font-semibold mb-2">Wachsend mit Premium</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Arbeitgeber starten kostenlos. Erweiterte Funktionen wie
                erweiterte Kandidatenansicht und mehr Jobs kommen in Premium-Plänen.
                (Zahlungen noch nicht aktiv — MVP-Phase.)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FÜR KANDIDATEN ───────────────────────────── */}
      <section className="px-4 py-16 border-t border-gray-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-3">👤 Für Kandidaten</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Internationale Fachkräfte, die in Europa oder weltweit arbeiten möchten.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: '1', title: 'Kostenloses Profil erstellen', text: 'Branche, Erfahrungsjahre, Deutsch- und Englischkenntnisse, Zielland angeben.' },
              { step: '2', title: 'Matching starten', text: 'Das System vergleicht dein Profil mit allen aktiven Jobs und berechnet Scores.' },
              { step: '3', title: 'Passende Jobs sehen', text: 'Du siehst deine Top-Matches mit Score, Jobtitel, Anforderungen und Standort.' },
            ].map((item) => (
              <div key={item.step} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center mb-4">
                  {item.step}
                </div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/for-candidates"
              className="inline-block text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Mehr für Kandidaten →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FÜR ARBEITGEBER ──────────────────────────── */}
      <section className="px-4 py-16 border-t border-gray-800 bg-gray-900/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-3">🏢 Für Arbeitgeber</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Unternehmen, die qualifizierte internationale Fachkräfte suchen.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: '1', title: 'Unternehmensprofil anlegen', text: 'Branche, Standort und Kontaktdaten einmal angeben. Kostenlos starten.' },
              { step: '2', title: 'Jobs einstellen', text: 'Jobtitel, Anforderungen, Sprachlevel und Gehalt definieren. Sofort sichtbar.' },
              { step: '3', title: 'Kandidaten-Matches sehen', text: 'Rankierte Kandidaten mit Score, Erfahrung und Sprachkenntnissen auf einem Blick.' },
            ].map((item) => (
              <div key={item.step} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <div className="w-8 h-8 rounded-full bg-green-700 text-white text-sm font-bold flex items-center justify-center mb-4">
                  {item.step}
                </div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/for-employers"
              className="inline-block text-sm text-green-400 hover:text-green-300 transition-colors"
            >
              Mehr für Arbeitgeber →
            </Link>
          </div>
        </div>
      </section>

      {/* ── SO FUNKTIONIERT ES ───────────────────────── */}
      <section className="px-4 py-16 border-t border-gray-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-10">⚙️ So funktioniert das Matching</h2>
          <div className="space-y-4 text-left">
            {[
              { icon: '📝', title: 'Kandidat legt Profil an', text: 'Branche, Erfahrungsjahre (0–20), Deutschkenntnisse (A1–C2), Englischkenntnisse, Zielland.' },
              { icon: '💼', title: 'Arbeitgeber erstellt Job', text: 'Jobtitel, Branche, Mindest-Erfahrung, Sprachanforderungen, Standort.' },
              { icon: '🤖', title: 'System berechnet Score', text: 'Matching-Algorithmus vergleicht Kandidatenattribute mit Job-Anforderungen → Score 0–100 %.' },
              { icon: '📊', title: 'Beide Seiten sehen Ergebnisse', text: 'Kandidat sieht Top-Jobs. Arbeitgeber sieht rankierte Kandidaten mit Detailinfos.' },
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
          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-800/40 rounded-xl text-sm text-blue-300">
            💡 Das Matching ist eine MVP-Funktion. Der Score basiert auf regelbasierten Kriterien.
            KI-gestütztes Matching ist in Vorbereitung.
          </div>
        </div>
      </section>

      {/* ── WARUM GLOBAL TALENT BRIDGE ───────────────── */}
      <section className="px-4 py-16 border-t border-gray-800 bg-gray-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-10">
            Warum Global Talent Bridge?
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: '🆓', label: 'Kostenlos für Kandidaten' },
              { icon: '🔒', label: 'DSGVO-freundlich' },
              { icon: '🎯', label: 'Transparenter Score' },
              { icon: '🌍', label: 'Fokus: Internationales Talent' },
              { icon: '⚡', label: 'Schnelle Registrierung' },
              { icon: '📱', label: 'Mobil optimiert' },
              { icon: '🔑', label: 'Keine Zahlung nötig' },
              { icon: '🤝', label: 'Klar & ehrlich' },
            ].map((item) => (
              <div key={item.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="text-gray-300 text-xs font-medium leading-tight">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SICHERHEIT & DATENSCHUTZ ─────────────────── */}
      <section className="px-4 py-16 border-t border-gray-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">🔒 Sicherheit & Datenschutz</h2>
          <p className="text-gray-400 mb-8">
            Deine Daten sind sicher. Wir sammeln nur, was für das Matching nötig ist.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {[
              { ok: true, text: 'Row Level Security (RLS) auf allen Datentabellen' },
              { ok: true, text: 'Keine Secrets im Browser — nur Anon-Key öffentlich' },
              { ok: true, text: 'Keine echten E-Mails werden automatisch gesendet' },
              { ok: true, text: 'Keine Zahlungsdaten werden gespeichert' },
              { ok: true, text: 'Daten werden ausschließlich in der EU gespeichert (Supabase EU)' },
              { ok: true, text: 'Kandidatenprofile sind für Arbeitgeber nur durch Admin-Client lesbar' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-900 border border-gray-800 rounded-lg">
                <span className="text-green-400 mt-0.5 shrink-0">✅</span>
                <p className="text-gray-300 text-sm">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/legal/datenschutz" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
              Datenschutzerklärung →
            </Link>
            <Link href="/legal/agb" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
              AGB →
            </Link>
            <Link href="/legal/impressum" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
              Impressum →
            </Link>
          </div>
        </div>
      </section>

      {/* ── MVP-STATUS ───────────────────────────────── */}
      <section className="px-4 py-16 border-t border-gray-800">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-900/40 border border-green-700/50 text-green-300 text-xs font-medium mb-4">
              🚦 Aktueller MVP-Status
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Was bereits funktioniert</h2>
            <p className="text-gray-400 text-sm">
              Ehrlicher Überblick über den aktuellen Stand der Plattform.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-3">
            {[
              { ok: true,  text: 'Kandidaten können sich registrieren und ein Profil erstellen' },
              { ok: true,  text: 'Arbeitgeber können ein Unternehmensprofil und Jobs erstellen' },
              { ok: true,  text: 'Matching-Algorithmus berechnet Score (0–100 %) regelbasiert' },
              { ok: true,  text: 'Kandidaten sehen ihre Top-Jobs mit Score, Firma, Ort, Gehalt' },
              { ok: true,  text: 'Arbeitgeber sehen rankierte Kandidaten in ihrem Dashboard' },
              { ok: true,  text: 'Kontaktanfragen werden in der Datenbank gespeichert' },
              { ok: false, text: 'Zahlungen / Premium-Pläne — in Vorbereitung, noch nicht aktiv' },
              { ok: false, text: 'Direkter Kandidatenkontakt durch Arbeitgeber — kommt später' },
              { ok: false, text: 'KI-gestütztes Matching — in Planung, heute regelbasiert' },
              { ok: false, text: 'Automatische E-Mails — bewusst nicht aktiviert (DSGVO-freundlich)' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className={`mt-0.5 shrink-0 text-sm ${item.ok ? 'text-green-400' : 'text-gray-600'}`}>
                  {item.ok ? '✅' : '⏳'}
                </span>
                <p className={`text-sm ${item.ok ? 'text-gray-300' : 'text-gray-500'}`}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="text-gray-600 text-xs">
              Letzte Aktualisierung: Juni 2026 · Kein Fake-Status, keine erfundenen Zahlen
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA UNTEN ────────────────────────────────── */}
      <section className="px-4 py-16 border-t border-gray-800 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Jetzt kostenlos starten</h2>
          <p className="text-gray-400 mb-8">
            Keine Kreditkarte. Kein Risiko. Sofort loslegen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register?role=candidate"
              className="px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors"
            >
              👤 Als Kandidat registrieren
            </Link>
            <Link
              href="/auth/register?role=employer"
              className="px-7 py-3.5 bg-green-700 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors"
            >
              🏢 Als Arbeitgeber registrieren
            </Link>
            <Link
              href="/pricing"
              className="px-7 py-3.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded-xl border border-gray-700 transition-colors"
            >
              Pricing ansehen
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
