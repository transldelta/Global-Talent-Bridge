/**
 * /admin/pilot-offer
 *
 * Pilot Offer Center.
 * Zeigt: Pilot-Angebotsvarianten, Branchen-Pitches,
 *        Objection Handling, Call Script, Next Best Action per Employer.
 *
 * Admin-only. Server Component.
 * Keine Nachrichten werden gesendet.
 */
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { NavBar } from '@/app/_components/NavBar'
import {
  getPilotOfferVariants,
  getIndustryPitch,
  getAllObjectionResponses,
  getCallScript,
  buildNextBestAction,
  getPipelineSummary,
  inferPitchType,
  OFFER_VARIANT_LABELS,
  type PilotOffer,
  type IndustryPitch,
  type ObjectionResponse,
  type IndustryPitchType,
} from '@/lib/employer-response-pipeline'

export const dynamic = 'force-dynamic'

// ── Sub-components ────────────────────────────────────────────────────────────

function OfferVariantCard({ offer }: { offer: PilotOffer }) {
  const bgStyles = {
    validation:    'border-blue-800/50 bg-blue-900/10',
    starter:       'border-green-800/50 bg-green-900/10',
    success_based: 'border-purple-800/50 bg-purple-900/10',
  }[offer.variant]

  const labelColor = {
    validation:    'text-blue-400',
    starter:       'text-green-400',
    success_based: 'text-purple-400',
  }[offer.variant]

  return (
    <div className={`rounded-2xl border p-5 ${bgStyles}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className={`text-base font-bold ${labelColor}`}>{offer.title}</h3>
        <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-0.5 rounded">Vorschlag</span>
      </div>
      <p className={`text-sm font-semibold mb-3 ${labelColor}`}>{offer.priceLabel}</p>
      <p className="text-xs text-gray-300 leading-relaxed mb-3">{offer.description}</p>
      <div className="bg-gray-800/30 rounded-lg p-2 mb-2">
        <p className="text-xs text-gray-500 mb-0.5">Zielgruppe</p>
        <p className="text-xs text-gray-400">{offer.targetEmployer}</p>
      </div>
      <p className="text-xs text-amber-400/80 italic">{offer.noGuaranteeNote}</p>
    </div>
  )
}

const PITCH_TYPES: IndustryPitchType[] = ['care', 'it', 'construction', 'hospitality', 'logistics', 'other']
const PITCH_LABELS: Record<IndustryPitchType, string> = {
  care: '🏥 Care / Pflege',
  it: '💻 IT / Tech',
  construction: '🏗️ Bau / Handwerk',
  hospitality: '🍽️ Gastro / Hotel',
  logistics: '🚛 Logistik',
  other: '🏢 Sonstige',
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function PilotOfferPage() {
  const admin = await getCurrentAdminUser()
  if (!admin) redirect('/auth/login')

  const supabase = createAdminClient()
  const { data: employers } = await supabase
    .from('pilot_employers')
    .select('id, company_name, industry, country, status, interest_level')
    .order('status')

  const allEmployers = employers ?? []
  const offers = getPilotOfferVariants()
  const objections = getAllObjectionResponses()
  const callScript = getCallScript()
  const summary = getPipelineSummary(allEmployers)
  const nextActions = allEmployers
    .map((e) => buildNextBestAction(e))
    .sort((a, b) => {
      const urgencyOrder = { high: 0, medium: 1, low: 2 }
      return urgencyOrder[a.urgency] - urgencyOrder[b.urgency]
    })

  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar />

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">🎯 Pilot Offer Center</h1>
            <p className="text-gray-400 text-sm">
              Angebotsvarianten, Branchen-Pitches, Objection Handling und Call Script.
              Kein automatischer Versand.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap items-center">
            <Link href="/admin/employer-responses" className="text-xs text-blue-400 hover:text-blue-300">📋 Response Pipeline →</Link>
            <Link href="/admin/pilot-outreach" className="text-xs text-green-400 hover:text-green-300">📤 Outreach-Cockpit →</Link>
            <Link href="/admin/ceo-dashboard" className="text-xs text-gray-400 hover:text-gray-300">🏠 CEO Dashboard →</Link>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mb-8 bg-amber-900/10 border border-amber-800/30 rounded-xl px-4 py-3">
          <p className="text-amber-300/80 text-xs leading-relaxed">
            ⚠️ <strong>Wichtig:</strong> Alle Preise sind Vorschläge/Annahmen. Kein verifizierter Umsatz.
            Kein automatischer Versand. Alle Aktionen bleiben manuell und kontrolliert.
            Rechtliche Prüfung vor kommerziellem Einsatz empfohlen.
          </p>
        </div>

        {/* Pipeline Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Gesamt Arbeitgeber', value: summary.total, color: 'text-gray-300' },
            { label: '🔥 Hot Leads', value: summary.hotLeads, color: 'text-orange-400' },
            { label: '⚡ Aktiver Pilot', value: summary.activeCount, color: 'text-green-400' },
            { label: '⏰ Aktion nötig', value: summary.nextActionRequired, color: 'text-yellow-400' },
          ].map((s, i) => (
            <div key={i} className="bg-gray-900 rounded-xl border border-gray-800 p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── A: Pilot Offer Variants ───────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-white mb-4">💼 A. Pilot-Angebotsvarianten</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {offers.map((offer) => (
              <OfferVariantCard key={offer.variant} offer={offer} />
            ))}
          </div>
        </section>

        {/* ── B: Industry Pitches ───────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-white mb-4">📢 B. Branchen-Pitches</h2>
          <div className="space-y-3">
            {PITCH_TYPES.map((pitchType) => {
              const pitch = getIndustryPitch(pitchType)
              return (
                <details key={pitchType} className="group bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                  <summary className="flex items-center justify-between gap-3 p-4 cursor-pointer list-none">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 text-sm group-open:rotate-90 transition-transform inline-block">▶</span>
                      <p className="text-sm font-medium text-white">{PITCH_LABELS[pitchType]}</p>
                    </div>
                    <span className="text-xs text-gray-600">{pitch.headline.slice(0, 40)}…</span>
                  </summary>
                  <div className="px-4 pb-4 border-t border-gray-800 pt-4 space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Headline</p>
                      <p className="text-sm font-semibold text-white">{pitch.headline}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Problem</p>
                        <p className="text-xs text-gray-300 leading-relaxed">{pitch.problem}</p>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Nutzen</p>
                        <p className="text-xs text-gray-300 leading-relaxed">{pitch.benefit}</p>
                      </div>
                    </div>
                    <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-3">
                      <p className="text-xs text-blue-300/80 font-semibold mb-1">Pilotangebot</p>
                      <p className="text-xs text-gray-300">{pitch.pilotOffer}</p>
                    </div>
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="bg-green-900/20 border border-green-800/30 rounded-lg p-3 flex-1">
                        <p className="text-xs text-green-400 font-semibold mb-1">Nächste Aktion</p>
                        <p className="text-xs text-gray-300">{pitch.nextAction}</p>
                      </div>
                      <div className="bg-amber-900/10 border border-amber-800/20 rounded-lg p-2">
                        <p className="text-xs text-amber-400/70 italic text-xs">{pitch.noFakeClaimsNote}</p>
                      </div>
                    </div>
                  </div>
                </details>
              )
            })}
          </div>
        </section>

        {/* ── C: Objection Handling ─────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-white mb-4">🛡️ C. Objection Handling</h2>
          <div className="space-y-2">
            {objections.map((obj: ObjectionResponse) => (
              <details key={obj.objectionKey} className="group bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                <summary className="flex items-center gap-3 p-4 cursor-pointer list-none">
                  <span className="text-gray-600 text-sm group-open:rotate-90 transition-transform inline-block">▶</span>
                  <p className="text-sm font-medium text-white flex-1">{obj.objection}</p>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    obj.honesty === 'candid' ? 'bg-yellow-900/30 text-yellow-400' :
                    obj.honesty === 'positive' ? 'bg-green-900/30 text-green-400' :
                    'bg-gray-800 text-gray-400'
                  }`}>{obj.honesty}</span>
                </summary>
                <div className="px-4 pb-4 border-t border-gray-800 pt-3">
                  <p className="text-sm text-gray-300 leading-relaxed">{obj.response}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* ── D: Call Script ────────────────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-white mb-4">📞 D. Call Script</h2>
          <div className="space-y-3">
            {Object.values(callScript).map((section) => (
              <div key={section.id} className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                <p className="text-sm font-semibold text-white mb-2">{section.label}</p>
                <div className="bg-gray-800/60 rounded-lg p-3 mb-2">
                  <pre className="text-xs text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">{section.script}</pre>
                </div>
                <p className="text-xs text-gray-500 italic">{section.notes}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── E: Next Best Action per Employer ─────────────────────────────── */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="text-lg font-bold text-white">🎯 E. Next Best Action per Arbeitgeber</h2>
            <Link href="/admin/employer-responses" className="text-xs text-blue-400 hover:text-blue-300">
              📋 Response Pipeline →
            </Link>
          </div>
          {nextActions.length === 0 ? (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 text-center">
              <p className="text-gray-500 text-sm">Keine Pilot-Arbeitgeber gefunden.</p>
              <Link href="/admin/pilot-launch" className="text-xs text-blue-400 hover:text-blue-300 mt-2 inline-block">
                → Pilot Launch: Seed Data laden
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {nextActions.map((action) => {
                const urgencyStyles = {
                  high:   'border-orange-800/50 bg-orange-900/5',
                  medium: 'border-yellow-800/40 bg-yellow-900/5',
                  low:    'border-gray-800 bg-gray-900',
                }[action.urgency]

                const statusColors: Record<string, string> = {
                  identified:       'text-gray-400',
                  contacted_manual: 'text-blue-400',
                  interested:       'text-yellow-400',
                  demo_scheduled:   'text-orange-400',
                  onboarding:       'text-purple-400',
                  active_pilot:     'text-green-400',
                  rejected:         'text-red-400',
                }

                return (
                  <div key={action.employerId} className={`rounded-xl border p-4 ${urgencyStyles}`}>
                    <div className="flex items-start justify-between gap-2 flex-wrap mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold ${statusColors[action.currentStatus] ?? 'text-gray-400'}`}>
                          [{action.currentStatus}]
                        </span>
                        <p className="text-sm font-semibold text-white">{action.employerName}</p>
                        <span className="text-xs text-gray-600">· {action.country}</span>
                        {action.industry && <span className="text-xs text-gray-600">· {action.industry}</span>}
                      </div>
                      <div className="flex gap-2">
                        <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">
                          {OFFER_VARIANT_LABELS[action.suggestedOfferVariant]}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          action.urgency === 'high' ? 'bg-orange-900/30 text-orange-400' :
                          action.urgency === 'medium' ? 'bg-yellow-900/30 text-yellow-400' :
                          'bg-gray-800 text-gray-500'
                        }`}>
                          {action.urgency}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-blue-300 mb-1">→ {action.recommendedAction}</p>
                    <p className="text-xs text-gray-500 mb-2">{action.opportunityNote}</p>
                    <Link
                      href="/admin/pilot-outreach"
                      className="text-xs text-green-400 hover:text-green-300"
                    >
                      📤 Outreach-Vorlage öffnen →
                    </Link>
                  </div>
                )
              })}
            </div>
          )}
        </section>

      </div>
    </div>
  )
}
