/**
 * app/admin/global-campaign-planner/page.tsx
 *
 * Global Campaign Planner — Kampagnen vorbereiten, NICHT live schalten.
 * Admin-geschützt. Keine Ads. Keine externen APIs. Keine Kampagne starten.
 *
 * Safety: Keine Ads live · Kein Google API · Kein Outreach · Kein Versand
 */
import { redirect }            from 'next/navigation'
import { getCurrentAdminUser } from '@/lib/admin'
import { TALENT_CATEGORIES, getTopCategoriesByRevenue } from '@/lib/talent-categories'

export const dynamic = 'force-dynamic'

const TOP_CORRIDORS = [
  { flag1: '🇵🇭', flag2: '🌍', name: 'Philippines → Global Healthcare', score: 92, sectors: ['Healthcare', 'Hospitality'] },
  { flag1: '🇮🇳', flag2: '🇨🇦', name: 'India → Canada',                 score: 88, sectors: ['IT', 'Engineering', 'Healthcare'] },
  { flag1: '🇮🇳', flag2: '🇬🇧', name: 'India → UK',                     score: 87, sectors: ['IT', 'Engineering', 'Finance'] },
  { flag1: '🇵🇰', flag2: '🌏', name: 'Pakistan → Gulf',                  score: 85, sectors: ['Construction', 'Manufacturing'] },
  { flag1: '🇲🇦', flag2: '🇩🇪', name: 'Morocco → Germany',              score: 84, sectors: ['Construction', 'Logistics', 'Care'] },
]

const TOP_COUNTRIES_EMPLOYER = [
  { flag: '🇩🇪', name: 'Germany',    demand: 'Healthcare, Construction, IT, Logistics', urgency: 'high' },
  { flag: '🇬🇧', name: 'UK',         demand: 'NHS Nursing, IT, Engineering',            urgency: 'high' },
  { flag: '🇨🇦', name: 'Canada',     demand: 'IT, Healthcare, Skilled Trades',          urgency: 'high' },
  { flag: '🇦🇺', name: 'Australia',  demand: 'Healthcare, Engineering, IT',             urgency: 'medium' },
  { flag: '🇦🇪', name: 'UAE/Gulf',   demand: 'Construction, Hospitality, Tech',         urgency: 'medium' },
]

const CAMPAIGN_DRAFTS = [
  {
    id: 'seo-content-plan',
    type: 'SEO Content Plan',
    icon: '🔍',
    status: 'prepared',
    description: '50 SEO-Artikel für globale Talent-Korridore vorbereitet. Themen: Korridore, Branchen, Qualifikationen, Länder.',
    risk: 'low',
    blockedReason: null,
  },
  {
    id: 'google-ads-draft',
    type: 'Google Ads Entwurf',
    icon: '📢',
    status: 'needs_approval',
    description: 'Keyword-Research für globale Employer-Targeting. Budget: TBD. Keine Ads live geschaltet.',
    risk: 'medium',
    blockedReason: 'Needs budget approval + legal review before activation',
  },
  {
    id: 'linkedin-ads-draft',
    type: 'LinkedIn Ads Entwurf',
    icon: '💼',
    status: 'blocked_until_budget_and_legal_review',
    description: 'Zielgruppen vorbereitet: HR-Manager, Recruiting-Agenturen, Facility-Manager weltweit.',
    risk: 'medium',
    blockedReason: 'Budget required + AÜG legal review + no private LinkedIn account available',
  },
  {
    id: 'partner-outreach-draft',
    type: 'Partner Outreach Entwurf',
    icon: '🤝',
    status: 'needs_approval',
    description: 'Vorlage für Recruiting-Agenturen und Relocation-Partner. Inbound-first. Kein Cold-Outreach.',
    risk: 'low',
    blockedReason: 'Needs manual review before sending — no automatic outreach',
  },
  {
    id: 'content-calendar',
    type: 'Content-Kalender',
    icon: '📅',
    status: 'prepared',
    description: '12-Wochen Content-Plan für Corridor-Seiten, Branchen-Content und Partner-Material.',
    risk: 'low',
    blockedReason: null,
  },
]

const AUDIENCE_SEGMENTS = [
  { icon: '🏢', label: 'Arbeitgeber weltweit',         count: 'Healthcare DE/UK/CA/AU, Construction Gulf' },
  { icon: '👤', label: 'Kandidaten weltweit',          count: 'PH/IN/NG/MA/TN/KE/PK/ID' },
  { icon: '🤝', label: 'Recruiting-Agenturen',         count: 'White-label Partner, Agency Partners' },
  { icon: '🎓', label: 'Sprachschulen',                count: 'Arabisch, Tagalog, Hindi, Swahili' },
  { icon: '✈️', label: 'Relocation-Partner',           count: 'Visa-Agenturen, Wohnungs-Vermittler' },
]

const topRevCategories = getTopCategoriesByRevenue(5)

function statusBadge(status: string) {
  if (status === 'prepared') return { cls: 'bg-green-100 text-green-700 border-green-200', label: '✅ Prepared' }
  if (status === 'needs_approval') return { cls: 'bg-yellow-100 text-yellow-700 border-yellow-200', label: '⏳ Needs Approval' }
  return { cls: 'bg-red-100 text-red-700 border-red-200', label: '🔒 Blocked' }
}

export default async function GlobalCampaignPlannerPage() {
  const user = await getCurrentAdminUser()
  if (!user) redirect('/auth/login?redirectTo=/admin/global-campaign-planner')

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">🌍 CorridorWork — Global Campaign Planner</h1>
        <p className="text-gray-500 mt-1">Kampagnen professionell vorbereiten — aber NICHT live schalten.</p>
        <div className="mt-2 flex gap-2">
          <span className="px-3 py-1 bg-red-100 text-red-700 border border-red-200 rounded-full text-xs font-bold">🚫 Keine Ads live</span>
          <span className="px-3 py-1 bg-red-100 text-red-700 border border-red-200 rounded-full text-xs font-bold">🚫 Kein Outreach</span>
          <span className="px-3 py-1 bg-red-100 text-red-700 border border-red-200 rounded-full text-xs font-bold">🚫 Kein Google API</span>
          <span className="px-3 py-1 bg-green-100 text-green-700 border border-green-200 rounded-full text-xs font-bold">✅ Inbound-first</span>
        </div>
      </div>

      {/* Top Corridors */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="font-bold text-gray-900 text-lg mb-4">🌍 Top 5 Zielkorridore</h2>
        <div className="space-y-2">
          {TOP_CORRIDORS.map((c, i) => (
            <div key={c.name} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-gray-300 font-bold w-5">#{i+1}</div>
              <span className="text-xl">{c.flag1}</span>
              <span className="text-gray-400">→</span>
              <span className="text-xl">{c.flag2}</span>
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm">{c.name}</div>
                <div className="text-xs text-gray-500">{c.sectors.join(' · ')}</div>
              </div>
              <div className="text-sm font-bold text-indigo-600">{c.score}/100</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Skill Categories */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="font-bold text-gray-900 text-lg mb-4">💡 Top 5 Skill Categories (Revenue Potential)</h2>
        <div className="space-y-2">
          {topRevCategories.map((cat, i) => (
            <div key={cat.sector_key} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-gray-300 font-bold w-5">#{i+1}</div>
              <span className="text-xl">{cat.emoji}</span>
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm">{cat.public_label}</div>
                <div className="text-xs text-gray-500">{cat.employer_description.slice(0, 60)}…</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-green-600">{cat.revenue_potential}/100</div>
                <div className="text-xs text-gray-400">Revenue</div>
              </div>
              {cat.remote_eligible && (
                <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 border border-blue-200 rounded-full">Remote</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Top Employer Countries */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="font-bold text-gray-900 text-lg mb-4">🏢 Top 5 Arbeitgeberländer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TOP_COUNTRIES_EMPLOYER.map(c => (
            <div key={c.name} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl shrink-0">{c.flag}</span>
              <div>
                <div className="font-semibold text-gray-900">{c.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">{c.demand}</div>
              </div>
              <span className={`ml-auto px-2 py-0.5 text-xs rounded-full border font-semibold ${c.urgency === 'high' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>
                {c.urgency}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Audience Segments */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="font-bold text-gray-900 text-lg mb-4">🎯 Zielgruppen</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {AUDIENCE_SEGMENTS.map(seg => (
            <div key={seg.label} className="flex items-start gap-3 p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
              <span className="text-2xl">{seg.icon}</span>
              <div>
                <div className="font-medium text-gray-900 text-sm">{seg.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{seg.count}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Campaign Drafts */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="font-bold text-gray-900 text-lg mb-2">📋 Kampagnen-Entwürfe</h2>
        <p className="text-xs text-gray-500 mb-4">Alle Entwürfe — noch NICHT live. Aktivierung erfordert Budget-Freigabe + Rechtsprüfung.</p>
        <div className="space-y-3">
          {CAMPAIGN_DRAFTS.map(draft => {
            const badge = statusBadge(draft.status)
            return (
              <div key={draft.id} className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-2xl shrink-0">{draft.icon}</span>
                    <div>
                      <div className="font-semibold text-gray-900">{draft.type}</div>
                      <div className="text-sm text-gray-600 mt-0.5">{draft.description}</div>
                      {draft.blockedReason && (
                        <div className="text-xs text-red-600 mt-1">🔒 {draft.blockedReason}</div>
                      )}
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full border font-semibold shrink-0 ${badge.cls}`}>
                    {badge.label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Sector Segments for Campaigns */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="font-bold text-gray-900 text-lg mb-4">🏭 Alle Skill Segments ({TALENT_CATEGORIES.length})</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {TALENT_CATEGORIES.map(cat => (
            <div key={cat.sector_key} className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-100 rounded-lg">
              <span>{cat.emoji}</span>
              <div className="min-w-0">
                <div className="text-xs font-medium text-gray-700 truncate">{cat.public_label}</div>
                <div className="text-xs text-gray-400">{cat.revenue_potential}/100</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Footer */}
      <div className="bg-slate-900 text-white rounded-xl p-4 flex items-start gap-4">
        <span className="text-2xl shrink-0">🛡️</span>
        <div className="text-sm">
          <div className="font-semibold text-green-400 mb-1">Campaign Planner Safety</div>
          <div className="text-slate-300 text-xs">
            Keine Ads live · Kein Google API · Kein Outreach · Kein Versand · Kein Stripe ·
            Alle Kampagnen-Entwürfe erfordern manuelle Freigabe + Rechtsprüfung vor Aktivierung
          </div>
        </div>
      </div>

    </div>
  )
}
