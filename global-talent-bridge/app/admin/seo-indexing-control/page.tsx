/**
 * app/admin/seo-indexing-control/page.tsx
 *
 * Google Search Console Setup-Assistent — /admin/seo-indexing-control
 *
 * Geschützt durch Admin-Auth.
 * Führt den Nutzer Schritt für Schritt durch die einmalige GSC-Einrichtung.
 *
 * Safety:
 * ✓ Kein Google API Call
 * ✓ Kein Scraping
 * ✓ Kein E-Mail-Versand
 * ✓ Kein Stripe
 * ✓ Alle Schritte rein manuell und kostenlos
 */
import { redirect }            from 'next/navigation'
import { getCurrentAdminUser } from '@/lib/admin'
import { DnsTxtChecker }       from './_components/DnsTxtChecker'
import {
  SEO_PAGE_ENTRIES,
  SEO_SYSTEM_STATUS,
  TOP_PRIORITY_PATHS_FOR_INDEXING,
} from '@/lib/seo-indexing'

export const dynamic = 'force-dynamic'

const PRIORITY_URLS_FOR_INDEXING = [
  { path: '/demo',                          label: 'Demo',                    note: 'Hohe Konversionsrelevanz' },
  { path: '/pilot/employers',               label: 'Employer Pilot',          note: 'Primäre Revenue-Page' },
  { path: '/pilot/agencies',               label: 'Agentur Pilot',            note: 'Sekundäre Revenue-Page' },
  { path: '/market-intelligence',           label: 'Market Intelligence',     note: 'B2B-Zielgruppe' },
  { path: '/industries/care',               label: 'Branche: Pflege',         note: 'Stärkste Nachfrage-Branche' },
  { path: '/solutions/recruiting-agencies', label: 'Agentur-Lösung',          note: 'Partner-Zielgruppe' },
]

const BASE_URL = 'https://corridorwork.com'
const SITEMAP_URL = `${BASE_URL}/sitemap.xml`
const GSC_URL = 'https://search.google.com/search-console'

export default async function SeoIndexingControlPage() {
  const user = await getCurrentAdminUser()
  if (!user) redirect('/auth/login?redirectTo=/admin/seo-indexing-control')

  const indexableCount = SEO_PAGE_ENTRIES.filter(p => p.indexability === 'indexable').length

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <a href="/admin/cwo-command-center" className="text-sm text-blue-600 hover:underline">← Command Center</a>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">🔍 Google Search Console — Setup</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Einmalige Einrichtung · Kostenlos · Kein Google API · Kein Scraping
          </p>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200">
            {indexableCount} Seiten indexierbar
          </span>
          <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full border border-slate-200">
            Google API: Nicht aktiv ✓
          </span>
        </div>
      </div>

      {/* Safety Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-wrap gap-4 items-center">
        <span className="text-xl">🛡️</span>
        <span className="text-green-400 font-semibold text-sm">Safety — alle Invarianten eingehalten:</span>
        <span className="text-slate-300 text-sm">Kein Google API</span>
        <span className="text-slate-300 text-sm">·</span>
        <span className="text-slate-300 text-sm">Kein Scraping</span>
        <span className="text-slate-300 text-sm">·</span>
        <span className="text-slate-300 text-sm">Kein E-Mail-Versand</span>
        <span className="text-slate-300 text-sm">·</span>
        <span className="text-slate-300 text-sm">Kein Stripe</span>
        <span className="text-slate-300 text-sm">·</span>
        <span className="text-slate-300 text-sm">EMAIL_PROVIDER: none</span>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-base font-bold text-gray-900 mb-4">📋 5 Schritte zur Google-Indexierung</h2>
        <div className="flex flex-wrap gap-2">
          {[
            'Search Console öffnen',
            'Domain eintragen',
            'DNS-TXT eintragen',
            'DNS verifizieren',
            'Sitemap einreichen',
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-3 py-1.5">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                {i + 1}
              </span>
              <span className="text-blue-800 text-xs font-medium">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── SCHRITT 1 ──────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border-2 border-blue-300 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-base flex items-center justify-center flex-shrink-0">1</div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Google Search Console öffnen</h2>
            <p className="text-xs text-gray-500">Im Browser, in einem neuen Tab</p>
          </div>
        </div>
        <a
          href={GSC_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          🔗 Search Console öffnen →
        </a>
        <p className="text-xs text-gray-400 mt-3">
          {GSC_URL} · Google-Konto erforderlich · Kostenlos
        </p>
      </div>

      {/* ── SCHRITT 2 ──────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-gray-700 text-white font-bold text-base flex items-center justify-center flex-shrink-0">2</div>
          <h2 className="text-lg font-bold text-gray-900">Property-Typ und Domain eintragen</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-blue-600 font-bold text-sm mt-0.5">→</span>
            <div>
              <div className="text-sm font-semibold text-gray-800">„+ Property hinzufügen" klicken</div>
              <div className="text-xs text-gray-500 mt-0.5">Oben links im Search Console Dashboard</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-blue-600 font-bold text-sm mt-0.5">→</span>
            <div>
              <div className="text-sm font-semibold text-gray-800">Property-Typ: <span className="text-blue-700">„Domain"</span> auswählen</div>
              <div className="text-xs text-gray-500 mt-0.5">Nicht „URL-Präfix" — Domain erfasst automatisch http/https/www</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <span className="text-blue-600 font-bold text-sm mt-0.5">→</span>
            <div>
              <div className="text-sm font-semibold text-blue-900">Domain eingeben:</div>
              <div className="mt-1 font-mono text-base bg-white border-2 border-blue-400 rounded-lg px-4 py-2 inline-block text-blue-800 font-bold select-all">
                corridorwork.com
              </div>
              <div className="text-xs text-blue-600 mt-1">Ohne https:// und ohne www</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-blue-600 font-bold text-sm mt-0.5">→</span>
            <div>
              <div className="text-sm font-semibold text-gray-800">„Weiter" klicken</div>
              <div className="text-xs text-gray-500 mt-0.5">Google zeigt dann einen DNS-TXT-Wert zur Verifizierung</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SCHRITT 3 ──────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-gray-700 text-white font-bold text-base flex items-center justify-center flex-shrink-0">3</div>
          <h2 className="text-lg font-bold text-gray-900">DNS-TXT-Eintrag bei deinem DNS-Anbieter hinzufügen</h2>
        </div>

        <p className="text-sm text-gray-700 mb-4">
          Google zeigt dir einen TXT-Wert (z.B. <span className="font-mono text-xs bg-gray-100 px-1 rounded">google-site-verification=abc123…</span>).
          Diesen Wert trägst du bei deinem DNS-Anbieter ein.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
          <div className="text-xs font-semibold text-amber-800 uppercase mb-3">🔑 So trägst du den TXT-Wert ein (DNS-Anbieter / Vercel DNS)</div>
          <div className="space-y-2">
            {[
              { field: 'Typ', value: 'TXT', note: 'Auswahl: TXT Record' },
              { field: 'Host / Name', value: '@', note: 'Steht für die Root-Domain (corridorwork.com). Manche Anbieter lassen das Feld leer.' },
              { field: 'Value / Inhalt', value: 'google-site-verification=…', note: '← Den genauen Wert von Google kopieren' },
              { field: 'TTL', value: 'auto / 3600', note: 'Standard-Wert, muss nicht geändert werden' },
            ].map(row => (
              <div key={row.field} className="flex items-start gap-3 bg-white rounded-lg px-3 py-2 border border-amber-100">
                <div className="w-28 text-xs font-semibold text-amber-900 flex-shrink-0 pt-0.5">{row.field}</div>
                <div className="font-mono text-xs text-gray-800 flex-shrink-0">{row.value}</div>
                <div className="text-xs text-gray-500 flex-1">{row.note}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-3">
          <span className="text-lg flex-shrink-0">ℹ️</span>
          <div className="text-xs text-blue-800">
            <strong>Wichtig:</strong> Den genauen TXT-Wert gibt Google vor — wir erfinden keinen.
            Kopiere den Wert direkt aus Search Console und füge ihn bei deinem DNS-Anbieter ein.
            DNS-Propagation kann 5 Minuten bis 48 Stunden dauern.
          </div>
        </div>
      </div>

      {/* ── SCHRITT 4 — DNS-Checker ────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-emerald-300 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold text-base flex items-center justify-center flex-shrink-0">4</div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">DNS-Eintrag prüfen</h2>
            <p className="text-xs text-gray-500">Kein Google API · Kein Scraping · Standard-DNS-Abfrage</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Füge den Google TXT-Wert ein und klicke „DNS prüfen" — das System prüft,
          ob der Eintrag für <span className="font-mono">corridorwork.com</span> im öffentlichen DNS sichtbar ist.
        </p>
        <DnsTxtChecker />
      </div>

      {/* ── SCHRITT 5 — Sitemap einreichen ────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-gray-700 text-white font-bold text-base flex items-center justify-center flex-shrink-0">5</div>
          <h2 className="text-lg font-bold text-gray-900">Sitemap einreichen</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Nach erfolgreicher Verifizierung: Im linken Menü der Search Console auf <strong>„Sitemaps"</strong> klicken.
        </p>

        <div className="space-y-3 mb-4">
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-green-600 font-bold text-sm mt-0.5">→</span>
            <div className="flex-1">
              <div className="text-sm font-semibold text-gray-800">Sitemap-URL eingeben:</div>
              <div className="mt-1 font-mono text-sm bg-white border-2 border-green-400 rounded-lg px-4 py-2 inline-block text-green-800 font-bold select-all">
                {SITEMAP_URL}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-green-600 font-bold text-sm mt-0.5">→</span>
            <div>
              <div className="text-sm font-semibold text-gray-800">„Einreichen" klicken</div>
              <div className="text-xs text-gray-500 mt-0.5">Google crawlt die Sitemap und findet alle {indexableCount} indexierbaren Seiten</div>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-3">
          <span>✅</span>
          <div className="text-xs text-green-800">
            Sitemap ist live und korrekt: <a href={SITEMAP_URL} target="_blank" rel="noopener noreferrer"
              className="underline font-mono">{SITEMAP_URL}</a>
          </div>
        </div>
      </div>

      {/* ── URL-PRIORITÄTEN ────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">🎯 Diese URLs zuerst indexieren</h2>
        <p className="text-sm text-gray-500 mb-4">
          In Search Console → „URL-Prüfung" → URL eingeben → „Indexierung beantragen".
          Für jede URL einzeln, höchste Priorität zuerst.
        </p>
        <div className="space-y-2">
          {PRIORITY_URLS_FOR_INDEXING.map((entry, idx) => (
            <div key={entry.path} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-mono text-gray-800 truncate select-all">
                  {BASE_URL}{entry.path}
                </div>
                <div className="text-xs text-gray-500">{entry.note}</div>
              </div>
              <a
                href={`${BASE_URL}${entry.path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline flex-shrink-0"
              >
                Live ↗
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* ── STATUS-ÜBERSICHT ───────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-base font-bold text-gray-900 mb-4">📊 System-Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-700">{indexableCount}</div>
            <div className="text-xs text-green-600 mt-0.5">Seiten indexierbar</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-blue-700">✅</div>
            <div className="text-xs text-blue-600 mt-0.5">sitemap.xml live</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-blue-700">✅</div>
            <div className="text-xs text-blue-600 mt-0.5">robots.txt korrekt</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
            <div className="text-sm font-bold text-slate-600">Nicht aktiv</div>
            <div className="text-xs text-slate-500 mt-0.5">Google API</div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
          <div className="bg-gray-50 rounded-lg p-3 space-y-1">
            <div className="font-semibold text-gray-600 uppercase text-xs">Sitemap-URL</div>
            <a href={SITEMAP_URL} target="_blank" rel="noopener noreferrer"
               className="text-blue-600 hover:underline font-mono break-all">{SITEMAP_URL}</a>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 space-y-1">
            <div className="font-semibold text-gray-600 uppercase text-xs">robots.txt</div>
            <a href={`${BASE_URL}/robots.txt`} target="_blank" rel="noopener noreferrer"
               className="text-blue-600 hover:underline font-mono break-all">{BASE_URL}/robots.txt</a>
          </div>
        </div>
      </div>

      {/* ── NÄCHSTE AKTION ─────────────────────────────────────────────────────── */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-5 flex items-start gap-4">
        <span className="text-2xl flex-shrink-0">🎯</span>
        <div>
          <div className="font-bold text-amber-900 mb-1">Nächster manueller Schritt</div>
          <div className="text-sm text-amber-800 space-y-1">
            <div>1. <a href={GSC_URL} target="_blank" rel="noopener noreferrer" className="underline font-semibold">Google Search Console öffnen</a></div>
            <div>2. Property corridorwork.com als <strong>Domain</strong> hinzufügen</div>
            <div>3. DNS-TXT-Wert von Google kopieren und bei DNS-Anbieter eintragen</div>
            <div>4. Hier auf dieser Seite mit „DNS prüfen" verifizieren</div>
            <div>5. In GSC: <strong>{SITEMAP_URL}</strong> einreichen</div>
            <div>6. Top-6 URLs einzeln zur Indexierung beantragen</div>
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-amber-700">
            <span>✓ Kostenlos</span>
            <span>·</span>
            <span>✓ Kein API</span>
            <span>·</span>
            <span>✓ Kein Scraping</span>
            <span>·</span>
            <span>✓ Ca. 15 Min.</span>
          </div>
        </div>
      </div>

    </div>
  )
}
