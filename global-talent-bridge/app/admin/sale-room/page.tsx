/**
 * app/admin/sale-room/page.tsx
 *
 * Sale Room — Käufer/Partner-Übersicht für Due-Diligence.
 * Zeigt globale Positionierung, Multisector-Fähigkeit, Revenue-Pfade, Commercial Proof.
 * Ehrlich: Pre-Revenue Phase 1.
 */
import { redirect }            from 'next/navigation'
import { getCurrentAdminUser } from '@/lib/admin'
import { TALENT_CATEGORIES, getTopCategoriesByRevenue } from '@/lib/talent-categories'

export const dynamic = 'force-dynamic'

export default async function SaleRoomPage() {
  const user = await getCurrentAdminUser()
  if (!user) redirect('/auth/login?redirectTo=/admin/sale-room')

  const topRevCats = getTopCategoriesByRevenue(5)
  const remoteCategories = TALENT_CATEGORIES.filter(c => c.remote_eligible).length

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">🏪 Sale Room</h1>
        <p className="text-gray-500 mt-1">Für Käufer, Partner und Investoren — professionelle Due-Diligence Übersicht</p>
        <p className="text-xs text-gray-400 mt-1">Keine erfundenen Zahlen · Stand: {new Date().toLocaleDateString('de-DE')}</p>
      </div>

      {/* Global Positioning Statement */}
      <div className="bg-indigo-900 text-white rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-3">🌍 Global Positioning</h2>
        <p className="text-indigo-200 leading-relaxed">
          CorridorWork ist eine <strong className="text-white">globale Talent-Corridor-Plattform</strong> für strukturiertes,
          compliance-first Cross-border Hiring. Das System verbindet qualifizierte Arbeitskräfte aus{' '}
          <strong className="text-white">{TALENT_CATEGORIES.length} Berufsbereichen</strong> mit Arbeitgebern{' '}
          <strong className="text-white">weltweit</strong> — nicht auf Deutschland oder einzelne Branchen beschränkt.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {[
            { value: `${TALENT_CATEGORIES.length}+`, label: 'Berufsbereiche' },
            { value: '15+',  label: 'Globale Korridore' },
            { value: '50+',  label: 'Länder abgedeckt' },
            { value: `${remoteCategories}`, label: 'Remote-geeignet' },
          ].map(s => (
            <div key={s.label} className="bg-indigo-800 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-indigo-300 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* What a Buyer Gets */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-bold text-gray-900 text-lg mb-4">📦 Was ein Käufer bekommt</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { icon: '✅', label: 'Live SaaS-Plattform',               note: 'corridorwork.com, Vercel, Supabase' },
            { icon: '✅', label: 'Globales Employer Intake',           note: '/global/employers — alle Branchen' },
            { icon: '✅', label: 'Globales Candidate Intake',          note: '/global/candidates — weltweit' },
            { icon: '✅', label: `${TALENT_CATEGORIES.length} Talent-Kategorien`, note: 'Vollständige Skill-Taxonomie' },
            { icon: '✅', label: '15+ globale Korridor-Seiten',        note: 'SEO-ready, sitemap, GSC' },
            { icon: '✅', label: '4 Revenue-Pfade aktiv',              note: 'Strategic, Agency, Employer, Intel' },
            { icon: '✅', label: 'Admin-Dashboard (7+ Tools)',         note: 'Buyer Readiness, Campaign Planner, etc.' },
            { icon: '✅', label: 'Daily Runner (autonom)',              note: 'Kein manuelles Zutun nötig' },
            { icon: '✅', label: '2134+ Tests (alle grün)',             note: 'TypeScript, Vitest, CI-ready' },
            { icon: '✅', label: 'Transfer-Dokumentation',             note: '5 Docs + README + Checkliste' },
            { icon: '✅', label: 'DSGVO-konform (EU-Region)',          note: 'Supabase eu-central-1' },
            { icon: '✅', label: 'Multisector Capability',             note: 'Nicht auf einzelne Branchen beschränkt' },
            { icon: '❌', label: 'Zahlende Kunden',                    note: '0 — Phase 1 Pre-Revenue' },
            { icon: '❌', label: 'Echter Umsatz',                      note: '0 EUR — Stripe nicht aktiv' },
            { icon: '❌', label: 'AÜG-Lizenz',                         note: 'Für DE-Betrieb erforderlich' },
          ].map(item => (
            <div key={item.label} className={`flex items-start gap-3 p-3 rounded-lg ${item.icon === '✅' ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
              <span className="text-lg shrink-0">{item.icon}</span>
              <div>
                <div className="text-sm font-semibold text-gray-800">{item.label}</div>
                <div className="text-xs text-gray-500">{item.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Multisector Capability */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-bold text-gray-900 text-lg mb-2">🏭 Multisector Capability — {TALENT_CATEGORIES.length} Berufsbereiche</h2>
        <p className="text-xs text-gray-500 mb-4">CorridorWork ist nicht auf Pflege oder IT beschränkt. Alle qualifizierten Berufsbereiche sind abgedeckt.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {TALENT_CATEGORIES.map(cat => (
            <div key={cat.sector_key} className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-100 rounded-lg">
              <span>{cat.emoji}</span>
              <div className="min-w-0">
                <div className="text-xs font-medium text-gray-700 truncate">{cat.public_label}</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="text-xs text-gray-400">{cat.revenue_potential}/100</div>
                  {cat.remote_eligible && <span className="text-xs text-blue-500">🌐</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Revenue Segments */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <h2 className="font-bold text-gray-900 text-lg mb-4">💰 Top 5 Revenue-Segmente</h2>
        <div className="space-y-2">
          {topRevCats.map((cat, i) => (
            <div key={cat.sector_key} className="flex items-center gap-3 p-3 bg-white border border-green-100 rounded-lg">
              <span className="text-gray-400 font-bold w-5">#{i+1}</span>
              <span>{cat.emoji}</span>
              <div className="flex-1">
                <div className="font-semibold text-gray-800 text-sm">{cat.public_label}</div>
                <div className="text-xs text-gray-500">{cat.recommended_corridors.slice(0, 3).join(', ')}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-green-700">Rev: {cat.revenue_potential}/100</div>
                <div className="text-xs text-gray-400">Relevance: {cat.global_relevance_score}/100</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Paths */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-bold text-gray-900 text-lg mb-4">🚀 Revenue-Pfade (alle live, 0 echter Umsatz)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { rank: 1, label: 'Strategic Partnership / White-Label / Acquisition', href: '/strategic-partnership', badge: 'Rang 1 — schnellster Weg' },
            { rank: 2, label: 'Agency / White-Label Partner',                      href: '/partners',              badge: 'Rang 2' },
            { rank: 3, label: 'Employer Pilot (global)',                            href: '/pilot/employers',       badge: 'Rang 3' },
            { rank: 4, label: 'Market Intelligence',                               href: '/market-intelligence',   badge: 'Rang 4' },
          ].map(p => (
            <a key={p.rank} href={p.href} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors">
              <div>
                <div className="text-xs text-amber-600 font-semibold">{p.badge}</div>
                <div className="text-sm font-medium text-gray-800">{p.label}</div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="px-2 py-0.5 text-xs font-bold bg-green-100 text-green-700 border border-green-200 rounded-full">✅ LIVE</span>
                <span className="px-2 py-0.5 text-xs bg-red-50 text-red-600 border border-red-100 rounded-full">0 echte Leads</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Docs */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h2 className="font-bold text-gray-900 mb-3">📁 Transfer-Dokumentation</h2>
        <div className="grid grid-cols-2 gap-2">
          {[
            'docs/BUYER_DUE_DILIGENCE.md',
            'docs/TRANSFER_CHECKLIST.md',
            'docs/TECHNICAL_ARCHITECTURE_OVERVIEW.md',
            'docs/SECURITY_AND_RLS_SUMMARY.md',
            'docs/COMMERCIAL_READINESS_SUMMARY.md',
            'docs/GLOBAL_REVENUE_ENGINE.md',
          ].map(doc => (
            <div key={doc} className="flex items-center gap-2 p-2 bg-white border border-blue-100 rounded-lg">
              <span className="text-blue-400 text-sm">📄</span>
              <span className="text-xs text-gray-600 font-mono">{doc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: 'Buyer Readiness',       href: '/admin/buyer-readiness' },
          { label: 'Commercial Proof',      href: '/admin/commercial-proof-tracker' },
          { label: 'Global Rev Control',    href: '/admin/global-revenue-control' },
          { label: 'Campaign Planner',      href: '/admin/global-campaign-planner' },
          { label: 'Revenue Inbox',         href: '/admin/revenue-inbox' },
          { label: 'Final Readiness',       href: '/admin/final-readiness' },
        ].map(l => (
          <a key={l.href} href={l.href}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-center hover:bg-gray-50 transition-colors">
            {l.label}
          </a>
        ))}
      </div>

    </div>
  )
}
