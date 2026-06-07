/**
 * app/admin/buyer-readiness/page.tsx
 *
 * Buyer Readiness — Transferability Audit Dashboard
 *
 * Zeigt ehrlich, wie weit CorridorWork für einen Käufer, Partner oder Investor bereit ist.
 * Keine erfundenen Zahlen. Kein Schönreden.
 *
 * Safety: Kein Stripe · Kein E-Mail-Versand · Kein Outreach · Kein Scraping · Keine Fake-Zahlen
 */
import { redirect }            from 'next/navigation'
import { getCurrentAdminUser } from '@/lib/admin'

export const dynamic = 'force-dynamic'

// ── Buyer Readiness Sections ──────────────────────────────────────────────────

const READINESS_SECTIONS = [
  {
    id: 'A',
    icon: '🛠️',
    label: 'Produkt-Bereitschaft',
    score: 15,
    maxScore: 20,
    color: 'green',
    items: [
      { label: 'Öffentliche Website live',              status: 'ok',      note: 'corridorwork.com live' },
      { label: '4 Revenue-Pfade aktiv',                 status: 'ok',      note: 'Forms live, DB-Speicherung' },
      { label: 'Admin-Dashboards (5+ Tools)',           status: 'ok',      note: 'Revenue Inbox, Accelerator, CWO etc.' },
      { label: 'SEO Network (16+ Seiten)',              status: 'ok',      note: 'Branchen, Korridore, Sitemap' },
      { label: 'Demo-Seite live',                       status: 'ok',      note: '/demo öffentlich' },
      { label: 'Validierter Product-Market-Fit',        status: 'missing', note: 'Phase 1 — noch nicht validiert' },
      { label: 'Echte Nutzer / Traction',               status: 'missing', note: '0 echte zahlende Nutzer' },
    ],
  },
  {
    id: 'B',
    icon: '💻',
    label: 'Tech-Bereitschaft',
    score: 17,
    maxScore: 20,
    color: 'green',
    items: [
      { label: 'Next.js 14, TypeScript strict',        status: 'ok',      note: 'App Router, keine `any`-Typen in Kern' },
      { label: 'Supabase (PostgreSQL 17, DSGVO)',      status: 'ok',      note: 'eu-central-1, Frankfurt' },
      { label: '2061 Tests (Vitest), alle grün',       status: 'ok',      note: 'npm test — CI-ready' },
      { label: 'Vercel Deployment (serverless)',       status: 'ok',      note: 'auto-deploy via git push' },
      { label: '.env.example vorhanden',               status: 'ok',      note: 'alle Variablen dokumentiert' },
      { label: 'Git History sauber',                   status: 'ok',      note: 'Kein Merge-Konflikt, klare Commits' },
      { label: 'TypeScript Build fehlerfrei',          status: 'ok',      note: 'npx tsc --noEmit → 0 Fehler' },
      { label: 'Kein technischer Schuldenberg',        status: 'partial', note: 'Kleinere TODO-Kommentare vorhanden' },
    ],
  },
  {
    id: 'C',
    icon: '🔒',
    label: 'Sicherheits-Bereitschaft',
    score: 16,
    maxScore: 20,
    color: 'green',
    items: [
      { label: 'RLS auf allen DB-Tabellen aktiv',     status: 'ok',      note: 'revenue_leads, worklog, factory' },
      { label: 'Admin-Auth via ADMIN_EMAILS',         status: 'ok',      note: 'getCurrentAdminUser() schützt alle Admin-Seiten' },
      { label: 'Safety Invariants (compliance-guard)', status: 'ok',      note: 'noEmailSent, noScraping, noOutreach — hardcoded' },
      { label: 'Kein Secret-Leak im Code',            status: 'ok',      note: 'Secret Scan: 0 Treffer' },
      { label: 'Honeypot + Rate-Limit in Public API', status: 'ok',      note: '10/h/IP, 5/Email-Limit' },
      { label: 'DSGVO-Seiten vorhanden',              status: 'ok',      note: 'Impressum, Datenschutz, AGB live' },
      { label: 'AGB / Widerrufsrecht vollständig',    status: 'partial', note: 'AGB vorhanden, Widerruf nicht vollständig geprüft' },
      { label: 'AÜG-Rechtsprüfung (DE)',              status: 'missing', note: 'Noch nicht geprüft — erforderlich für operativen Betrieb' },
    ],
  },
  {
    id: 'D',
    icon: '📦',
    label: 'Transfer-Bereitschaft',
    score: 14,
    maxScore: 20,
    color: 'yellow',
    items: [
      { label: 'docs/BUYER_DUE_DILIGENCE.md',         status: 'ok',      note: 'Ehrliche Übersicht' },
      { label: 'docs/TRANSFER_CHECKLIST.md',          status: 'ok',      note: '10-Punkte-Checkliste inkl. IDs' },
      { label: 'docs/TECHNICAL_ARCHITECTURE_OVERVIEW.md', status: 'ok', note: 'Stack, DB, API, Tests' },
      { label: 'docs/SECURITY_AND_RLS_SUMMARY.md',    status: 'ok',      note: 'RLS, Auth, Secrets, DSGVO' },
      { label: 'docs/COMMERCIAL_READINESS_SUMMARY.md', status: 'ok',     note: 'Revenue-Pfade, Lücken, schnellster Weg' },
      { label: '.env.example vollständig',            status: 'ok',      note: 'alle Env-Variablen dokumentiert' },
      { label: 'README.md für Käufer',                status: 'ok',      note: 'Tech-Stack, Setup, Safety, Docs' },
      { label: 'Supabase-Projekt übertragbar',        status: 'ok',      note: 'Owner-Transfer oder neues Projekt möglich' },
      { label: 'Vercel-Projekt übertragbar',          status: 'ok',      note: 'Projekt-ID dokumentiert, Team-Transfer möglich' },
      { label: 'Domain corridorwork.com',             status: 'ok',      note: 'Eigentümer kann Domain transferieren' },
    ],
  },
  {
    id: 'E',
    icon: '💰',
    label: 'Commercial Proof',
    score: 4,
    maxScore: 20,
    color: 'red',
    items: [
      { label: 'Lead-Capture-System live',            status: 'ok',      note: '4 Revenue-Pfade, Forms funktionieren' },
      { label: 'Lead-Scoring implementiert',          status: 'ok',      note: '0–100 Score, automatisch berechnet' },
      { label: 'Zahlende Kunden',                     status: 'missing', note: '0 zahlende Kunden (Phase 1)' },
      { label: 'Echter Umsatz',                       status: 'missing', note: '0 EUR Umsatz — ehrlich' },
      { label: 'Echte Inbound-Leads',                 status: 'missing', note: '0 echte Leads — alle = interne Tests' },
      { label: 'Payment / Stripe aktiv',              status: 'missing', note: 'Stripe nicht konfiguriert' },
      { label: 'Pilotpartner gewonnen',               status: 'missing', note: 'Noch kein Pilot abgeschlossen' },
      { label: 'Product-Market-Fit nachgewiesen',     status: 'missing', note: 'Noch nicht validiert' },
    ],
  },
  {
    id: 'F',
    icon: '⚠️',
    label: 'Offene Punkte / Risiken',
    score: null,
    maxScore: null,
    color: 'amber',
    items: [
      { label: 'Kein echter Umsatz',                  status: 'risk',    note: 'Phase 1 — 0 EUR, 0 Kunden' },
      { label: 'Keine echten Leads',                  status: 'risk',    note: 'Alle Leads = interne Tests (rejected)' },
      { label: 'Payment nicht aktiv',                 status: 'risk',    note: 'Stripe muss konfiguriert werden' },
      { label: 'AÜG-Rechtsprüfung ausstehend',       status: 'warning', note: 'DE-Pflicht für Arbeitsvermittlung' },
      { label: 'Google-Indexierung noch offen',       status: 'warning', note: 'GSC eingerichtet, Crawling braucht Zeit' },
      { label: 'Market Validation ausstehend',        status: 'warning', note: 'Kein validierter Product-Market-Fit' },
    ],
  },
]

// ── Score Berechnung ──────────────────────────────────────────────────────────

const scoredSections = READINESS_SECTIONS.filter(s => s.score !== null && s.maxScore !== null)
const totalScore     = scoredSections.reduce((sum, s) => sum + (s.score ?? 0), 0)
const maxTotalScore  = scoredSections.reduce((sum, s) => sum + (s.maxScore ?? 0), 0)

// ── Farb-Helpers ──────────────────────────────────────────────────────────────

function scoreColor(score: number, max: number) {
  const pct = score / max
  if (pct >= 0.8) return { bar: 'bg-green-500',  text: 'text-green-700',  bg: 'bg-green-50 border-green-300' }
  if (pct >= 0.6) return { bar: 'bg-yellow-500', text: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-300' }
  return                  { bar: 'bg-red-500',    text: 'text-red-700',    bg: 'bg-red-50 border-red-300' }
}

function statusBadge(status: string) {
  if (status === 'ok')      return { label: '✅ OK',       cls: 'bg-green-100 text-green-700 border-green-200' }
  if (status === 'partial') return { label: '⚠️ Partial', cls: 'bg-yellow-100 text-yellow-700 border-yellow-200' }
  if (status === 'missing') return { label: '❌ Fehlt',    cls: 'bg-red-100 text-red-700 border-red-200' }
  if (status === 'risk')    return { label: '🔴 Risiko',   cls: 'bg-red-100 text-red-700 border-red-200' }
  if (status === 'warning') return { label: '🟡 Offen',   cls: 'bg-yellow-100 text-yellow-700 border-yellow-200' }
  return                             { label: status,        cls: 'bg-gray-100 text-gray-700 border-gray-200' }
}

// ── Buyer Gap List ────────────────────────────────────────────────────────────

const BUYER_GAPS = [
  { priority: 1, gap: 'Kein echter Umsatz / 0 zahlende Kunden', action: 'Ersten Pilot-Deal oder White-Label-Partner gewinnen' },
  { priority: 2, gap: 'Payment / Stripe nicht aktiv',           action: 'Stripe konfigurieren oder Rechnung-basiertes Billing' },
  { priority: 3, gap: 'AÜG-Rechtsprüfung ausstehend',          action: 'Anwalt für Arbeitnehmerüberlassung in DE' },
  { priority: 4, gap: 'AGB / Widerruf unvollständig',          action: 'Rechtsanwalt-Template oder Kanzlei beauftragen' },
  { priority: 5, gap: 'Keine echten Inbound-Leads',            action: 'Google-Indexierung abwarten + Distribution Pack nutzen' },
  { priority: 6, gap: 'Market Validation ausstehend',          action: '5 Employer-Interviews führen und Feedback dokumentieren' },
]

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function BuyerReadinessPage() {
  const user = await getCurrentAdminUser()
  if (!user) redirect('/auth/login?redirectTo=/admin/buyer-readiness')

  const totalColors = scoreColor(totalScore, maxTotalScore)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">📊 Buyer Readiness</h1>
        <p className="text-gray-500 mt-1">
          Transferability Audit — Ehrlicher Stand für Käufer, Partner und Investoren
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Keine erfundenen Zahlen · Kein Schönreden · Stand: {new Date().toLocaleDateString('de-DE')}
        </p>
      </div>

      {/* ── Gesamtscore ─────────────────────────────────────────────────────── */}
      <div className={`rounded-2xl border-2 p-6 ${totalColors.bg}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Buyer Readiness Score</div>
            <div className={`text-5xl font-black mt-1 ${totalColors.text}`}>{totalScore}<span className="text-2xl font-bold text-gray-400">/{maxTotalScore}</span></div>
            <div className={`text-sm font-semibold mt-1 ${totalColors.text}`}>
              {totalScore >= 80 ? 'Sehr hoch — Transfer-ready' :
               totalScore >= 60 ? 'Mittel — Technisch solide, Commercial schwach' :
               'Niedrig — Phase 1 Pilot'}
            </div>
          </div>
          <div className="text-right">
            <div className="text-8xl font-black text-gray-100 select-none leading-none">{Math.round(totalScore / maxTotalScore * 100)}%</div>
          </div>
        </div>
        {/* Score Bar */}
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${totalColors.bar}`}
            style={{ width: `${Math.round(totalScore / maxTotalScore * 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0</span>
          <span>{maxTotalScore}</span>
        </div>
        {/* Sub-scores */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4">
          {scoredSections.map(section => {
            const c = scoreColor(section.score!, section.maxScore!)
            return (
              <div key={section.id} className="bg-white rounded-xl border border-gray-100 p-3 text-center shadow-sm">
                <div className="text-lg mb-1">{section.icon}</div>
                <div className={`text-xl font-bold ${c.text}`}>{section.score}<span className="text-xs text-gray-400">/{section.maxScore}</span></div>
                <div className="text-xs text-gray-500 leading-tight">{section.label}</div>
              </div>
            )
          })}
        </div>
        <p className="text-xs text-gray-500 mt-3">
          ⚠️ <strong>Ehrlicher Hinweis:</strong> Commercial Proof ist bewusst niedrig bewertet (4/20),
          weil 0 echte Kunden und 0 EUR Umsatz vorhanden sind. Kein Schönreden.
        </p>
      </div>

      {/* ── Buyer Gap List ──────────────────────────────────────────────────── */}
      <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-5">
        <h2 className="text-lg font-bold text-gray-900 mb-1">🎯 Buyer Gap List</h2>
        <p className="text-xs text-gray-500 mb-4">Was muss ein Käufer/Betreiber als nächstes lösen, um Umsatz zu generieren?</p>
        <div className="space-y-2">
          {BUYER_GAPS.map(gap => (
            <div key={gap.priority} className="flex items-start gap-3 bg-white border border-amber-200 rounded-lg p-3">
              <div className="w-6 h-6 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0">
                {gap.priority}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-800">{gap.gap}</div>
                <div className="text-xs text-gray-500 mt-0.5">→ {gap.action}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Readiness Sections ──────────────────────────────────────────────── */}
      {READINESS_SECTIONS.map(section => {
        const hasScore = section.score !== null && section.maxScore !== null
        const colors   = hasScore ? scoreColor(section.score!, section.maxScore!) : null

        return (
          <div key={section.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {/* Section Header */}
            <div className={`flex items-center justify-between px-5 py-4 border-b ${
              section.color === 'green'  ? 'bg-green-50 border-green-100' :
              section.color === 'yellow' ? 'bg-yellow-50 border-yellow-100' :
              section.color === 'red'    ? 'bg-red-50 border-red-100' :
              'bg-amber-50 border-amber-100'
            }`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{section.icon}</span>
                <div>
                  <div className="font-bold text-gray-900">{section.id}. {section.label}</div>
                  {hasScore && colors && (
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${colors.bar}`}
                          style={{ width: `${Math.round(section.score! / section.maxScore! * 100)}%` }}
                        />
                      </div>
                      <span className={`text-xs font-semibold ${colors.text}`}>
                        {section.score}/{section.maxScore}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {!hasScore && (
                <span className="px-2 py-1 text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200 rounded-full">
                  Risiken & Lücken
                </span>
              )}
            </div>

            {/* Section Items */}
            <div className="divide-y divide-gray-50">
              {section.items.map(item => {
                const badge = statusBadge(item.status)
                return (
                  <div key={item.label} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-gray-800">{item.label}</span>
                      {item.note && (
                        <span className="text-xs text-gray-400 ml-2">— {item.note}</span>
                      )}
                    </div>
                    <span className={`ml-3 px-2 py-0.5 text-xs font-semibold rounded-full border shrink-0 ${badge.cls}`}>
                      {badge.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* ── Transfer Pack Links ─────────────────────────────────────────────── */}
      <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-5">
        <h2 className="text-lg font-bold text-gray-900 mb-1">📁 Transfer Pack — Docs</h2>
        <p className="text-xs text-gray-500 mb-4">Alle Dokumente für eine professionelle Due-Diligence-Prüfung.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {[
            { label: 'Buyer Due Diligence',             path: 'docs/BUYER_DUE_DILIGENCE.md' },
            { label: 'Transfer Checklist',              path: 'docs/TRANSFER_CHECKLIST.md' },
            { label: 'Technical Architecture',          path: 'docs/TECHNICAL_ARCHITECTURE_OVERVIEW.md' },
            { label: 'Security & RLS Summary',         path: 'docs/SECURITY_AND_RLS_SUMMARY.md' },
            { label: 'Commercial Readiness Summary',   path: 'docs/COMMERCIAL_READINESS_SUMMARY.md' },
            { label: 'README (für Käufer)',             path: 'README.md' },
          ].map(doc => (
            <div key={doc.path} className="flex items-center gap-2 px-3 py-2 bg-white border border-blue-200 rounded-lg">
              <span className="text-blue-500 text-sm">📄</span>
              <div className="min-w-0">
                <div className="text-sm font-medium text-gray-800">{doc.label}</div>
                <div className="text-xs text-gray-400 font-mono truncate">{doc.path}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Revenue-Pfade Live ───────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="text-lg font-bold text-gray-900 mb-1">🌐 Revenue-Pfade — alle live</h2>
        <p className="text-xs text-gray-500 mb-4">
          Alle Seiten sind öffentlich prüfbar ohne Login. Kein Umsatz, aber alle Systeme funktionieren.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { rank: 1, label: 'Strategic Partnership',  href: '/strategic-partnership',  color: 'bg-amber-50 border-amber-300' },
            { rank: 2, label: 'Agency Partner',         href: '/partners',                color: 'bg-purple-50 border-purple-300' },
            { rank: 3, label: 'Employer Pilot',         href: '/pilot/employers',         color: 'bg-blue-50 border-blue-300' },
            { rank: 4, label: 'Market Intelligence',    href: '/market-intelligence',     color: 'bg-green-50 border-green-300' },
          ].map(p => (
            <a key={p.rank} href={p.href} target="_blank" rel="noopener noreferrer"
               className={`flex items-center justify-between p-3 border rounded-lg hover:opacity-90 transition-opacity ${p.color}`}>
              <div>
                <span className="text-xs text-gray-500">Rang {p.rank}</span>
                <div className="text-sm font-semibold text-gray-800">{p.label}</div>
                <div className="text-xs text-gray-400 font-mono">{p.href}</div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="px-2 py-0.5 text-xs font-bold bg-green-100 text-green-700 border border-green-200 rounded-full">✅ LIVE</span>
                <span className="px-2 py-0.5 text-xs bg-red-50 text-red-600 border border-red-100 rounded-full">0 echte Leads</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* ── Admin-Links ─────────────────────────────────────────────────────── */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
        <h2 className="text-lg font-bold text-gray-900 mb-4">🔗 Admin Quick Links</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { label: 'Revenue Inbox',    href: '/admin/revenue-inbox' },
            { label: 'Revenue Accelerator', href: '/admin/revenue-accelerator' },
            { label: 'CWO Command Center', href: '/admin/cwo-command-center' },
            { label: 'Distribution Pack', href: '/admin/distribution-pack' },
            { label: 'SEO Indexing',     href: '/admin/seo-indexing-control' },
            { label: 'Autonomous Worklog', href: '/admin/autonomous-worklog' },
          ].map(link => (
            <a key={link.href} href={link.href}
               className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-gray-700 hover:bg-slate-100 transition-colors text-center">
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {/* ── Safety Footer ───────────────────────────────────────────────────── */}
      <div className="bg-slate-900 text-white rounded-xl p-4 flex items-start gap-4">
        <span className="text-2xl shrink-0">🛡️</span>
        <div className="text-sm">
          <div className="font-semibold text-green-400 mb-1">Safety Invariants aktiv</div>
          <div className="text-slate-300 text-xs leading-relaxed">
            Kein E-Mail-Versand · Kein Outreach · Kein Scraping · Kein Stripe · Keine Fake-Zahlen ·
            EMAIL_PROVIDER=none · OUTREACH_EMAIL_PROVIDER=none · Alle Safety-Flags in DB: true
          </div>
        </div>
      </div>

    </div>
  )
}
