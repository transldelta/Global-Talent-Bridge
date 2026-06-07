/**
 * app/admin/distribution-pack/page.tsx — /admin/distribution-pack
 *
 * Admin Distribution Pack — fertige Copy-Paste-Texte für passive Verbreitung.
 *
 * Kein Send-Button. Kein Outreach. Nur Kopieren-Buttons.
 * Geschützt: nur eingeloggte Admins.
 */
import { redirect }            from 'next/navigation'
import { getCurrentAdminUser } from '@/lib/admin'
import { DistributionPackClient } from './_components/DistributionPackClient'

export const dynamic = 'force-dynamic'

// ── Copy-Texte ─────────────────────────────────────────────────────────────────

// Priorität 1: Für Plattformen (keine Social-Media-Pflicht)
// Priorität 2: Social optional — nur falls Nutzer eigene Kanäle hat
const DISTRIBUTION_BLOCKS = [
  {
    id:    '1-satz-pitch',
    label: '1-Satz Pitch',
    icon:  '⚡',
    note:  'Für Profil-Bios, Kurzbeschreibungen, Visitenkarten',
    text:  'CorridorWork ist ein live betriebenes SaaS-Asset für strukturiertes, compliance-first Cross-border Hiring zwischen internationalen Fachkräfte-Märkten und Arbeitgebern in Deutschland und Europa.',
  },
  {
    id:    '3-satz-pitch',
    label: '3-Satz Pitch',
    icon:  '📝',
    note:  'Für E-Mail-Signaturen oder falls jemand fragt',
    text:  `CorridorWork ist ein live betriebenes SaaS-System für strukturiertes Cross-border Hiring. Das System läuft autonom, erfasst inbound Leads über 4 Revenue-Pfade und bereitet täglich Revenue-Berichte vor.

Offen für strategische Partnerschaften, White-Label-Nutzung, Lizenzierung und ernsthafte Übernahme- oder Beteiligungsgespräche. Kein Cold-Outreach — nur inbound.

Live: corridorwork.com/launch`,
  },
  {
    id:    '30-sekunden-pitch',
    label: '30-Sekunden Pitch (gesprochen)',
    icon:  '🎙️',
    note:  'Falls jemand persönlich fragt — kein Pflichtschritt',
    text:  `„CorridorWork ist ein live betriebenes System für Cross-border Hiring. Es verbindet internationale Fachkräfte mit Unternehmen in Deutschland und Europa — strukturiert und compliance-first.

Das System läuft autonom: tägliche Berichte, 4 Inbound-Lead-Pfade, 16+ SEO-Seiten. Alles verifizierbar.

Phase 1, ohne laufende Revenue-Verträge, aber offen für strategische Gespräche: Partnerschaft, White-Label, Lizenzierung oder Übernahme.

Nur was live läuft: corridorwork.com"`,
  },
  {
    id:    'marketplace-listing',
    label: 'Marketplace / Buyer Listing Text',
    icon:  '🏪',
    note:  'Für Acquire.com, MicroAcquire, Flippa oder ähnliche Plattformen',
    text:  `CorridorWork — Live SaaS Asset for Cross-border Hiring

ASSET TYPE: SaaS (Phase 1 Pilot)
TECH STACK: Next.js 14, Supabase, Vercel, TypeScript
DOMAIN: corridorwork.com (live, HTTPS)

LIVE SYSTEMS:
- Autonomous CWO Operating System (daily runner, täglich)
- 4 Inbound Revenue Paths (strategic_partner, agency_partner, employer_pilot, market_intelligence)
- Lead Capture with scoring (status, lead_score, interest_type)
- 16+ SEO-indexable pages (industries, corridors, solutions)
- Admin Dashboard (Revenue Accelerator, Revenue Inbox, CWO Command Center)
- Sitemap.xml + robots.txt

COMPLIANCE & SAFETY:
- No emails sent (EMAIL_PROVIDER=none)
- No auto-outreach
- No Stripe/payments active
- No scraping
- Phase 1 — no active revenue contracts

REVENUE PATHS PREPARED:
1. Strategic Partner / White-Label / Acquisition
2. Agency Partner
3. Employer Pilot
4. Market Intelligence

INBOUND-FIRST: System collects leads via website forms — no manual social media required.

PHASE: 1 (Pilot) — no revenue contracts, no fake numbers
CONTACT: corridorwork.com/strategic-partnership`,
  },
  // ── OPTIONAL: Nur falls Nutzer eigene Social-Media-Kanäle hat ─────────────
  {
    id:    'linkedin-post',
    label: 'LinkedIn Post (optional)',
    icon:  '💼',
    note:  '⚪ OPTIONAL — nur falls du ein eigenes LinkedIn-Profil nutzt. Nicht notwendig für Inbound.',
    text:  `🚀 CorridorWork ist live.

Ein SaaS-System für strukturiertes, compliance-first Cross-border Hiring.

Was bereits läuft:
✅ 4 Revenue-Pfade aktiv (inbound only)
✅ Autonomous Daily Runner
✅ 16+ SEO-Seiten indexierbar
✅ Admin Revenue Dashboard
✅ Safety-First: kein Scraping, kein automatischer Versand

Offen für:
🎯 Strategische Partnerschaft
🏷️ White-Label-Nutzung
📜 Lizenzierung / API-Zugang
🏢 Übernahme / Beteiligungsgespräch

Phase 1 Pilot. Keine erfundenen Zahlen. Nur was verifizierbar läuft.

👉 corridorwork.com/strategic-partnership`,
  },
  {
    id:    'whatsapp-status',
    label: 'WhatsApp Business Status (optional)',
    icon:  '📱',
    note:  '⚪ OPTIONAL — nur für WhatsApp Business-Nummer, NICHT private Nummer. Nicht notwendig.',
    text:  `CorridorWork ist live 🚀
Cross-border Hiring, 4 Revenue-Pfade offen.
Strategic Partnership, White-Label, Pilot.
→ corridorwork.com/launch`,
  },
  {
    id:    'partner-text',
    label: 'Kurzer Text falls jemand fragt (optional)',
    icon:  '🤝',
    note:  '⚪ OPTIONAL — nur falls jemand persönlich fragt. Kein Cold-Outreach.',
    text:  `CorridorWork ist ein live betriebenes System für Cross-border Hiring.

Live-Features:
- 4 Inbound-Revenue-Pfade
- Autonomous Daily Runner
- 16+ SEO-Seiten

Offen für: Strategische Partnerschaft, White-Label, Lizenzierung oder Übernahme.

Kein Pitch-Druck. Falls es interessant klingt: corridorwork.com/strategic-partnership

Alles ist verifizierbar. Keine erfundenen Zahlen.`,
  },
  {
    id:    'marketplace-listing',
    label: 'Marketplace / Buyer Listing Text',
    icon:  '🏪',
    note:  'Für Acquire.com, MicroAcquire, Flippa oder ähnliche Plattformen',
    text:  `CorridorWork — Live SaaS Asset for Cross-border Hiring

ASSET TYPE: SaaS (Phase 1 Pilot)
TECH STACK: Next.js 14, Supabase, Vercel, TypeScript
DOMAIN: corridorwork.com (live, HTTPS)

LIVE SYSTEMS:
- Autonomous CWO Operating System (daily runner, täglich)
- 4 Inbound Revenue Paths (strategic_partner, agency_partner, employer_pilot, market_intelligence)
- Lead Capture with scoring (status, lead_score, interest_type)
- 16+ SEO-indexable pages (industries, corridors, solutions)
- Admin Dashboard (Revenue Accelerator, Revenue Inbox, CWO Command Center)
- Sitemap.xml + robots.txt

COMPLIANCE & SAFETY:
- No emails sent (EMAIL_PROVIDER=none)
- No auto-outreach
- No Stripe/payments active
- No scraping
- Phase 1 — no active revenue contracts

REVENUE PATHS PREPARED:
1. Strategic Partner / White-Label / Acquisition
2. Agency Partner
3. Employer Pilot
4. Market Intelligence

PHASE: 1 (Pilot) — no revenue contracts, no fake numbers
CONTACT: corridorwork.com/strategic-partnership`,
  },
]

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function DistributionPackPage() {
  const user = await getCurrentAdminUser()
  if (!user) redirect('/auth/login?redirectTo=/admin/distribution-pack')

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📦 Distribution Pack</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Fertige Copy-Paste-Texte für passive Verbreitung — kein Send-Button, kein Outreach
          </p>
        </div>
        <div className="flex gap-2">
          <a href="/launch" target="_blank" rel="noopener noreferrer"
             className="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-800 text-xs font-semibold rounded-lg border border-green-200 transition-colors">
            /launch ↗
          </a>
          <a href="/buyer-snapshot" target="_blank" rel="noopener noreferrer"
             className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-semibold rounded-lg border border-amber-200 transition-colors">
            /buyer-snapshot ↗
          </a>
          <a href="/strategic-partnership" target="_blank" rel="noopener noreferrer"
             className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-semibold rounded-lg border border-blue-200 transition-colors">
            /strategic-partnership ↗
          </a>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">🔗 Wichtigste öffentliche Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          {[
            { label: '🎯 Strategic Partnership',  url: 'https://corridorwork.com/strategic-partnership' },
            { label: '🤝 Partner-Programm',        url: 'https://corridorwork.com/partners' },
            { label: '🚀 Launch-Seite',            url: 'https://corridorwork.com/launch' },
            { label: '📋 Buyer Snapshot',          url: 'https://corridorwork.com/buyer-snapshot' },
            { label: '🏭 Employer Pilot',          url: 'https://corridorwork.com/pilot/employers' },
            { label: '🎬 Demo',                    url: 'https://corridorwork.com/demo' },
          ].map(link => (
            <div key={link.url} className="flex items-center justify-between gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
              <span className="text-gray-700 text-xs">{link.label}</span>
              <a href={link.url} target="_blank" rel="noopener noreferrer"
                 className="text-blue-600 text-xs font-mono hover:underline truncate max-w-[200px]">
                {link.url.replace('https://corridorwork.com', '')}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Inbound-First Hinweis */}
      <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0">🌐</span>
          <div>
            <div className="font-bold text-blue-900 text-sm mb-1">
              Kein LinkedIn erforderlich. Kein WhatsApp erforderlich.
            </div>
            <p className="text-blue-700 text-xs leading-relaxed">
              CorridorWork arbeitet <strong>inbound-first</strong> über öffentliche Website-Formulare,
              Google-Indexierung, die Launch-Seite und die Revenue Inbox. Du musst nicht aktiv posten.
              Das System arbeitet für dich — du prüfst nur die Revenue Inbox und das CWO Command Center.
            </p>
            <p className="text-blue-600 text-xs mt-1.5 font-medium">
              LinkedIn und WhatsApp sind optional — nur falls du eigene Business-Kanäle nutzen möchtest.
              Private Telefonnummern und private WhatsApp-Nummern werden nicht empfohlen.
              Falls WhatsApp: nur separates WhatsApp Business.
            </p>
          </div>
        </div>
      </div>

      {/* Copy-Paste Blocks */}
      <DistributionPackClient blocks={DISTRIBUTION_BLOCKS} />

      {/* Admin Note */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-500 text-center">
        Admin-only · Kein automatischer Versand · Kein Outreach · Inbound-first: System arbeitet für dich
      </div>
    </div>
  )
}
