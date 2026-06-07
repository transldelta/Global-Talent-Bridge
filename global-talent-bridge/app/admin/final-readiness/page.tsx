/**
 * app/admin/final-readiness/page.tsx
 *
 * Final Readiness — Übersicht aller System-Readiness-Checks.
 */
import { redirect }            from 'next/navigation'
import { getCurrentAdminUser } from '@/lib/admin'
import { TALENT_CATEGORIES }   from '@/lib/talent-categories'

export const dynamic = 'force-dynamic'

const READINESS_CHECKS = [
  { category: 'Global', label: 'Global-ready',                                    status: 'yes',  note: 'Employer + Candidate worldwide intake live' },
  { category: 'Global', label: 'Employer worldwide intake',                       status: 'yes',  note: '/global/employers — alle Branchen, alle Länder' },
  { category: 'Global', label: 'Candidate worldwide intake',                      status: 'yes',  note: '/global/candidates — alle Branchen, alle Länder' },
  { category: 'Global', label: `Multisector (${TALENT_CATEGORIES.length} Bereiche)`, status: 'yes', note: 'Nicht auf DE oder einzelne Branchen beschränkt' },
  { category: 'Global', label: '15+ globale Korridor-Seiten',                    status: 'yes',  note: 'PH, IN, NG, MA, TN, KE, PK, ID, BR, …' },
  { category: 'Campaign', label: 'Global Campaign Planner',                       status: 'yes',  note: 'Vorbereitet, NICHT live' },
  { category: 'Campaign', label: 'Paid Ads live',                                 status: 'no',   note: 'Bewusst deaktiviert — Budget + Rechtsprüfung fehlt' },
  { category: 'Campaign', label: 'Outreach live',                                 status: 'no',   note: 'EMAIL_PROVIDER=none — kein Outreach möglich' },
  { category: 'Campaign', label: 'SEO Content Plan vorbereitet',                  status: 'yes',  note: '16+ SEO-Seiten live' },
  { category: 'Revenue', label: 'Payment-ready',                                  status: 'no',   note: 'Stripe nicht konfiguriert' },
  { category: 'Revenue', label: 'Zahlende Kunden',                               status: 'no',   note: '0 — Phase 1 Pre-Revenue' },
  { category: 'Revenue', label: 'Fully automated money machine',                  status: 'no',   note: 'Ohne echte Umsätze/Payment nicht möglich' },
  { category: 'Revenue', label: 'Autonomous global preparation',                  status: 'yes',  note: 'Daily Runner bereitet täglich global vor' },
  { category: 'Revenue', label: '4 Revenue-Pfade live',                          status: 'yes',  note: 'Strategic, Agency, Employer, Intel' },
  { category: 'Autonomous', label: 'Daily Runner aktiv',                          status: 'yes',  note: 'Vercel Cron, täglich, kein manuelles Zutun' },
  { category: 'Autonomous', label: 'CWO Operating System',                        status: 'yes',  note: 'Tageslage, Revenue-Tracking, Worklog' },
  { category: 'Autonomous', label: 'Global Revenue Engine täglich',               status: 'yes',  note: 'Top Korridore, Kategorien, Leads täglich' },
  { category: 'Transfer', label: 'Buyer-demo-ready',                              status: 'yes',  note: 'Alle öffentlichen Seiten ohne Login prüfbar' },
  { category: 'Transfer', label: 'Transfer-Dokumentation (5+ Docs)',              status: 'yes',  note: 'BUYER_DUE_DILIGENCE, TRANSFER_CHECKLIST, …' },
  { category: 'Transfer', label: 'Secret-Leak',                                   status: 'no',   note: 'Scan: 0 echte Schlüssel im Code' },
  { category: 'Legal', label: 'DSGVO-Seiten',                                    status: 'yes',  note: 'Impressum, Datenschutz, AGB live' },
  { category: 'Legal', label: 'AÜG-Rechtsprüfung',                               status: 'no',   note: 'Ausstehend — für operativen DE-Betrieb nötig' },
  { category: 'Legal', label: 'Payment/AGB vollständig',                          status: 'no',   note: 'Stripe + AGB-Widerruf fehlt' },
]

function badge(status: string, isNegative?: boolean) {
  if (status === 'yes' && !isNegative) return { cls: 'bg-green-100 text-green-700 border-green-200', label: '✅ Ja' }
  if (status === 'no'  && !isNegative) return { cls: 'bg-red-100 text-red-700 border-red-200',       label: '❌ Nein' }
  if (status === 'no'  &&  isNegative) return { cls: 'bg-green-100 text-green-700 border-green-200', label: '✅ Nein' }
  return { cls: 'bg-gray-100 text-gray-600 border-gray-200', label: status }
}

const CATEGORIES_ORDER = ['Global', 'Campaign', 'Revenue', 'Autonomous', 'Transfer', 'Legal']

// "Nein" ist gut für: Paid Ads live, Outreach live, Fully automated money machine, Secret-Leak
const GOOD_NO_LABELS = new Set(['Paid Ads live', 'Outreach live', 'Fully automated money machine', 'Secret-Leak'])

export default async function FinalReadinessPage() {
  const user = await getCurrentAdminUser()
  if (!user) redirect('/auth/login?redirectTo=/admin/final-readiness')

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">🏁 Final Readiness</h1>
        <p className="text-gray-500 mt-1">Vollständige System-Readiness-Übersicht — global, autonom, ehrlich</p>
        <p className="text-xs text-gray-400 mt-1">Stand: {new Date().toLocaleDateString('de-DE')}</p>
      </div>

      {/* Quick Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Global-ready',         value: 'Ja',   color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
          { label: 'Buyer-demo-ready',     value: 'Ja',   color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
          { label: 'Payment-ready',        value: 'Nein', color: 'text-red-600',   bg: 'bg-red-50 border-red-200' },
          { label: 'Paid Ads live',        value: 'Nein', color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-4 text-center ${s.bg}`}>
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Readiness Checks by Category */}
      {CATEGORIES_ORDER.map(cat => {
        const items = READINESS_CHECKS.filter(c => c.category === cat)
        return (
          <div key={cat} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 border-b">
              <h2 className="font-bold text-gray-900">{cat}</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {items.map(item => {
                const isGoodNo = GOOD_NO_LABELS.has(item.label)
                const b = badge(item.status, isGoodNo && item.status === 'no')
                return (
                  <div key={item.label} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-gray-800">{item.label}</span>
                      <span className="text-xs text-gray-400 ml-2">— {item.note}</span>
                    </div>
                    <span className={`ml-3 px-2 py-0.5 text-xs rounded-full border font-semibold shrink-0 ${b.cls}`}>
                      {b.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Admin Links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: 'Buyer Readiness',      href: '/admin/buyer-readiness' },
          { label: 'Commercial Proof',     href: '/admin/commercial-proof-tracker' },
          { label: 'Sale Room',            href: '/admin/sale-room' },
          { label: 'Global Rev Control',   href: '/admin/global-revenue-control' },
          { label: 'Campaign Planner',     href: '/admin/global-campaign-planner' },
          { label: 'CWO Command Center',   href: '/admin/cwo-command-center' },
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
