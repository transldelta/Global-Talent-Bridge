/**
 * app/admin/seo-indexing-control/page.tsx
 *
 * SEO Indexing & Visibility Control — /admin/seo-indexing-control
 *
 * Geschützt durch Admin-Auth.
 * Zeigt: SEO-Systemstatus, alle öffentlichen Seiten, Sitemap-Status,
 *        robots.txt-Status, Google Search Console Anleitung (rein manuell).
 *
 * Safety:
 * - Kein Google Search Console API Call
 * - Kein Scraping
 * - Kein externer Call
 * - Kein E-Mail-Versand
 * - Kein Stripe
 */
import { redirect }            from 'next/navigation'
import { getCurrentAdminUser } from '@/lib/admin'
import {
  SEO_PAGE_ENTRIES,
  SEO_SYSTEM_STATUS,
  TOP_PRIORITY_PATHS_FOR_INDEXING,
  GOOGLE_SEARCH_CONSOLE_GUIDE,
  type PagePriority,
} from '@/lib/seo-indexing'

export const dynamic = 'force-dynamic'

// ── Helpers ───────────────────────────────────────────────────────────────────

const GROUP_LABELS: Record<string, string> = {
  revenue:   '💰 Revenue Pages',
  industry:  '🏭 Branchen-Seiten',
  corridor:  '🌍 Korridor-Seiten',
  solutions: '🔗 Lösungen',
  static:    '🏠 Hauptseiten',
}

const PRIORITY_BADGE: Record<PagePriority, string> = {
  high:   'bg-green-100 text-green-700 border border-green-200',
  medium: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  low:    'bg-gray-100   text-gray-500   border border-gray-200',
}

const PRIORITY_LABEL: Record<PagePriority, string> = {
  high:   '🟢 Hoch',
  medium: '🟡 Mittel',
  low:    '⚪ Niedrig',
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function SeoIndexingControlPage() {
  const user = await getCurrentAdminUser()
  if (!user) redirect('/auth/login?redirectTo=/admin/seo-indexing-control')

  // Group pages
  const groups = ['static', 'revenue', 'solutions', 'industry', 'corridor'] as const
  const grouped = groups.map(g => ({
    group: g,
    label: GROUP_LABELS[g],
    pages: SEO_PAGE_ENTRIES.filter(p => p.group === g),
  }))

  const highPriorityPages = SEO_PAGE_ENTRIES.filter(p => p.priority === 'high')

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <a href="/admin/cwo-command-center" className="text-sm text-blue-600 hover:underline">← Command Center</a>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">🔍 SEO Indexing Control</h1>
          <p className="text-gray-500 mt-1">
            Visibility Layer — öffentliche Seiten, Sitemap, robots.txt, Search Console Anleitung
          </p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200">
            ✅ {SEO_SYSTEM_STATUS.indexablePages} Seiten indexierbar
          </span>
          <span className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full border border-blue-200">
            Sitemap: ✅
          </span>
        </div>
      </div>

      {/* Safety Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-4 flex items-center gap-4">
        <span className="text-2xl">🛡️</span>
        <div className="flex flex-wrap gap-4 text-sm text-slate-300">
          <span className="text-green-400 font-semibold">Alle Safety-Invarianten eingehalten</span>
          <span>Kein Google API Call</span>
          <span>Kein Scraping</span>
          <span>Kein E-Mail-Versand</span>
          <span>Kein Stripe</span>
          <span>EMAIL_PROVIDER: {SEO_SYSTEM_STATUS.noEmailSent ? 'none ✓' : '?'}</span>
        </div>
      </div>

      {/* System Status Kacheln */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
          <div className="text-3xl font-bold text-blue-600">{SEO_SYSTEM_STATUS.totalPublicPages}</div>
          <div className="text-xs text-gray-500 mt-1">Öffentliche SEO-Seiten</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
          <div className="text-3xl font-bold text-green-600">{SEO_SYSTEM_STATUS.indexablePages}</div>
          <div className="text-xs text-gray-500 mt-1">Indexierbar</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
          <div className="text-2xl font-bold text-emerald-600">✅</div>
          <div className="text-xs text-gray-500 mt-1">Sitemap bereit</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
          <div className="text-2xl font-bold text-emerald-600">✅</div>
          <div className="text-xs text-gray-500 mt-1">robots.txt korrekt</div>
        </div>
      </div>

      {/* Sitemap + robots.txt Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sitemap */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-bold text-gray-900 mb-3">🗺️ Sitemap Status</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">URL</span>
              <a href={SEO_SYSTEM_STATUS.sitemapUrl} target="_blank" rel="noopener noreferrer"
                 className="text-blue-600 hover:underline font-mono text-xs">
                {SEO_SYSTEM_STATUS.sitemapUrl}
              </a>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Status</span>
              <span className="text-green-600 font-semibold">✅ Vorhanden</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Einträge</span>
              <span className="text-gray-900 font-semibold">{SEO_SYSTEM_STATUS.totalPublicPages} URLs</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Format</span>
              <span className="text-gray-700">Next.js MetadataRoute (auto-generiert)</span>
            </div>
          </div>
          <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer"
             className="mt-3 inline-block text-xs text-blue-600 hover:underline">
            Sitemap öffnen →
          </a>
        </div>

        {/* robots.txt */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-bold text-gray-900 mb-3">🤖 robots.txt Status</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">URL</span>
              <a href={SEO_SYSTEM_STATUS.robotsUrl} target="_blank" rel="noopener noreferrer"
                 className="text-blue-600 hover:underline font-mono text-xs">
                {SEO_SYSTEM_STATUS.robotsUrl}
              </a>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Status</span>
              <span className="text-green-600 font-semibold">✅ Vorhanden</span>
            </div>
          </div>
          <div className="mt-3 bg-slate-50 rounded-lg p-3">
            <div className="text-xs text-slate-500 font-mono space-y-0.5">
              {[
                'Allow: /corridors/',
                'Allow: /pilot/',
                'Allow: /market-intelligence',
                'Allow: /industries/',
                'Allow: /solutions/',
                'Allow: /demo',
                'Disallow: /admin/',
                'Disallow: /api/',
                'Disallow: /auth/',
              ].map(line => (
                <div key={line} className={line.startsWith('Allow') ? 'text-green-700' : 'text-red-600'}>
                  {line}
                </div>
              ))}
            </div>
          </div>
          <a href="/robots.txt" target="_blank" rel="noopener noreferrer"
             className="mt-2 inline-block text-xs text-blue-600 hover:underline">
            robots.txt öffnen →
          </a>
        </div>
      </div>

      {/* Top-Priorität Seiten für erste Indexierung */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">🎯 Top-Seiten für erste Indexierung</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Diese Seiten zuerst in Google Search Console einreichen — höchste Conversion-Relevanz.
            </p>
          </div>
          <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full border border-amber-200">
            {TOP_PRIORITY_PATHS_FOR_INDEXING.length} URLs
          </span>
        </div>
        <div className="space-y-2">
          {TOP_PRIORITY_PATHS_FOR_INDEXING.map((path, idx) => {
            const entry = SEO_PAGE_ENTRIES.find(p => p.path === path)
            return (
              <div key={path} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 font-mono truncate">
                    https://corridorwork.com{path}
                  </div>
                  {entry && <div className="text-xs text-gray-500 mt-0.5">{entry.metaNote}</div>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded font-semibold ${PRIORITY_BADGE[entry?.priority ?? 'medium']}`}>
                    {PRIORITY_LABEL[entry?.priority ?? 'medium']}
                  </span>
                  <a href={`https://corridorwork.com${path}`} target="_blank" rel="noopener noreferrer"
                     className="text-xs text-blue-600 hover:underline">Live →</a>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Google Search Console Anleitung */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">📋 Google Search Console — Einmalige Einrichtung</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Rein manuell. Kein API-Call. Kein automatischer Versand. Kostenlos.
            </p>
          </div>
          <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full border border-slate-200">
            Einmalig
          </span>
        </div>

        <div className="space-y-4">
          {/* Step 1 */}
          <div className="flex gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0">1</div>
            <div>
              <div className="font-semibold text-blue-900 text-sm">{GOOGLE_SEARCH_CONSOLE_GUIDE.step1.title}</div>
              <div className="text-xs text-blue-700 mt-1">{GOOGLE_SEARCH_CONSOLE_GUIDE.step1.text}</div>
              <a href={GOOGLE_SEARCH_CONSOLE_GUIDE.step1.url} target="_blank" rel="noopener noreferrer"
                 className="mt-1 inline-block text-xs text-blue-600 hover:underline font-mono">
                {GOOGLE_SEARCH_CONSOLE_GUIDE.step1.url} →
              </a>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-gray-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0">2</div>
            <div>
              <div className="font-semibold text-gray-900 text-sm">{GOOGLE_SEARCH_CONSOLE_GUIDE.step2.title}</div>
              <div className="text-xs text-gray-700 mt-1">{GOOGLE_SEARCH_CONSOLE_GUIDE.step2.text}</div>
              <div className="mt-1 font-mono text-xs bg-white border border-gray-300 rounded px-2 py-1 inline-block">
                {GOOGLE_SEARCH_CONSOLE_GUIDE.step2.value}
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-gray-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0">3</div>
            <div>
              <div className="font-semibold text-gray-900 text-sm">{GOOGLE_SEARCH_CONSOLE_GUIDE.step3.title}</div>
              <div className="text-xs text-gray-700 mt-1">{GOOGLE_SEARCH_CONSOLE_GUIDE.step3.text}</div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0">4</div>
            <div>
              <div className="font-semibold text-emerald-900 text-sm">{GOOGLE_SEARCH_CONSOLE_GUIDE.step4.title}</div>
              <div className="text-xs text-emerald-700 mt-1">{GOOGLE_SEARCH_CONSOLE_GUIDE.step4.text}</div>
              <div className="mt-1 font-mono text-xs bg-white border border-emerald-300 rounded px-2 py-1 inline-block text-emerald-800">
                {GOOGLE_SEARCH_CONSOLE_GUIDE.step4.sitemapUrl}
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex gap-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0">5</div>
            <div className="flex-1">
              <div className="font-semibold text-amber-900 text-sm">{GOOGLE_SEARCH_CONSOLE_GUIDE.step5.title}</div>
              <div className="text-xs text-amber-700 mt-1">{GOOGLE_SEARCH_CONSOLE_GUIDE.step5.text}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {GOOGLE_SEARCH_CONSOLE_GUIDE.step5.urls.map(path => (
                  <span key={path} className="font-mono text-xs bg-white border border-amber-300 rounded px-2 py-0.5 text-amber-800">
                    {path}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Important Note */}
          <div className="bg-slate-900 text-white rounded-lg p-4 flex items-start gap-3">
            <span className="text-xl flex-shrink-0">🛡️</span>
            <div className="text-sm">
              <span className="font-semibold text-green-400">Wichtig: </span>
              <span className="text-slate-300">{GOOGLE_SEARCH_CONSOLE_GUIDE.importantNote}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alle öffentlichen Seiten — gruppiert */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">🌐 Alle öffentlichen SEO-Seiten</h2>
          <span className="text-xs text-gray-500">{SEO_SYSTEM_STATUS.totalPublicPages} Seiten total</span>
        </div>

        <div className="space-y-6">
          {grouped.map(({ group, label, pages }) => pages.length === 0 ? null : (
            <div key={group}>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{label}</div>
              <div className="space-y-1">
                {pages.map(page => (
                  <div key={page.path}
                       className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    {/* Indexierbarkeit */}
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      page.indexability === 'indexable' ? 'bg-green-500' :
                      page.indexability === 'blocked'   ? 'bg-red-500'   : 'bg-gray-300'
                    }`} />

                    {/* URL */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-gray-700 truncate">{page.path}</span>
                        <span className="text-xs text-gray-400 hidden sm:inline">— {page.label}</span>
                      </div>
                    </div>

                    {/* Priority */}
                    <span className={`text-xs px-2 py-0.5 rounded font-semibold flex-shrink-0 ${PRIORITY_BADGE[page.priority]}`}>
                      {page.priority}
                    </span>

                    {/* Sitemap */}
                    <span className={`text-xs flex-shrink-0 ${page.sitemapEntry ? 'text-green-600' : 'text-gray-400'}`}>
                      {page.sitemapEntry ? '✓ sitemap' : '— sitemap'}
                    </span>

                    {/* Robots */}
                    <span className={`text-xs flex-shrink-0 ${page.robotsAllowed ? 'text-green-600' : 'text-red-600'}`}>
                      {page.robotsAllowed ? '✓ robots' : '✗ robots'}
                    </span>

                    {/* Live Link */}
                    <a href={page.url} target="_blank" rel="noopener noreferrer"
                       className="text-xs text-blue-500 hover:underline flex-shrink-0">↗</a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nächste sichere Aktion */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-4">
        <span className="text-2xl flex-shrink-0">🎯</span>
        <div>
          <div className="font-bold text-amber-900 mb-1">Nächste sichere Aktion (einmalig)</div>
          <div className="text-sm text-amber-800">
            Google Search Console öffnen → Property corridorwork.com verifizieren →
            Sitemap <span className="font-mono bg-amber-100 px-1 rounded">https://corridorwork.com/sitemap.xml</span> einreichen →
            Top-4 URLs (<span className="font-mono">/demo</span>, <span className="font-mono">/pilot/employers</span>,{' '}
            <span className="font-mono">/industries/care</span>, <span className="font-mono">/solutions/recruiting-agencies</span>) zur Indexierung beantragen.
          </div>
          <div className="mt-2 text-xs text-amber-700">
            ✓ Kein API · ✓ Kein automatischer Versand · ✓ Kein Scraping · ✓ Kostenlos
          </div>
        </div>
      </div>

    </div>
  )
}
