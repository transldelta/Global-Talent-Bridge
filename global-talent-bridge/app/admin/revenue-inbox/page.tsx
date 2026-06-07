/**
 * app/admin/revenue-inbox/page.tsx
 *
 * Admin Revenue Inbox — /admin/revenue-inbox
 * Admin-only. Zeigt alle Inbound Revenue Leads.
 * Kein Send-Button. Kein Stripe. Kein automatischer Versand.
 */
import { redirect }            from 'next/navigation'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient }   from '@/lib/supabase/admin'
import { RevenueInboxClient }  from './_components/RevenueInboxClient'

export const dynamic = 'force-dynamic'

export default async function RevenueInboxPage() {
  const user = await getCurrentAdminUser()
  if (!user) redirect('/auth/login?redirectTo=/admin/revenue-inbox')

  // Initial-Load: alle Leads (neueste zuerst)
  const supabase = createAdminClient()
  const { data: leads, error } = await supabase
    .from('revenue_leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    console.error('[RevenueInbox] Load error:', error.message)
  }

  const allLeads      = leads ?? []
  const newCount      = allLeads.filter(l => l.status === 'new').length
  const totalCount    = allLeads.length
  const strategicNew  = allLeads.filter(l => l.lead_type === 'strategic_partner' && l.status === 'new').length
  const strategicAll  = allLeads.filter(l => l.lead_type === 'strategic_partner').length

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📥 Revenue Inbox</h1>
          <p className="text-gray-500 mt-1">Inbound Revenue Leads — manuell prüfen und bearbeiten</p>
          <p className="text-xs text-gray-400 mt-1">
            {totalCount} Leads total · {newCount} neu · {strategicAll} Strategic · Kein automatischer Versand
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {strategicNew > 0 && (
            <span className="px-3 py-1.5 rounded-full text-xs font-bold border bg-amber-50 text-amber-700 border-amber-400 animate-pulse">
              🎯 {strategicNew} neue Strategic Leads
            </span>
          )}
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${newCount > 0 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
            {newCount > 0 ? `🆕 ${newCount} neue Leads` : '✓ Alle geprüft'}
          </span>
        </div>
      </div>

      {/* Strategic Lead Highlight */}
      {strategicNew > 0 && (
        <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-4">
          <div className="font-bold text-amber-900 text-sm mb-1">
            🎯 {strategicNew} neue Strategic Partner / Acquisition Leads warten auf Prüfung
          </div>
          <div className="text-xs text-amber-700">
            Strategic Leads sind der schnellste Revenue-Weg (Priorität 1).
            Manuell prüfen → persönlich antworten. Kein automatischer Versand.
          </div>
          <div className="mt-2">
            <a href="/admin/revenue-accelerator" className="text-xs text-amber-700 hover:underline font-medium">
              → Revenue Accelerator öffnen
            </a>
          </div>
        </div>
      )}

      {/* Hinweis */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="font-semibold text-blue-900 text-sm mb-1">
          📋 Inbound-Leads können geprüft werden. Kein automatischer Versand aktiv.
        </div>
        <div className="text-xs text-blue-700 space-y-0.5">
          <p>✓ Leads werden manuell kontaktiert — kein System sendet automatisch E-Mails</p>
          <p>✓ Kein Stripe aktiviert — keine automatische Zahlung</p>
          <p>✓ Status-Änderungen sind nur interne Markierungen</p>
        </div>
        <div className="mt-3 flex flex-wrap gap-3 text-xs">
          <a href="/strategic-partnership" className="text-amber-600 hover:underline font-semibold">→ /strategic-partnership öffnen</a>
          <a href="/partners"              className="text-purple-600 hover:underline font-semibold">→ /partners öffnen</a>
          <a href="/pilot/employers"       className="text-blue-600 hover:underline">→ /pilot/employers öffnen</a>
          <a href="/pilot/agencies"        className="text-blue-600 hover:underline">→ /pilot/agencies öffnen</a>
          <a href="/market-intelligence"   className="text-blue-600 hover:underline">→ /market-intelligence öffnen</a>
        </div>
      </div>

      {/* Client Inbox */}
      <RevenueInboxClient initialLeads={allLeads as any} />

    </div>
  )
}
