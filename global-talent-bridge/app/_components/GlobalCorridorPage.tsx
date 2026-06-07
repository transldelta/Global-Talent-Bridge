/**
 * app/_components/GlobalCorridorPage.tsx
 *
 * Reusable template for global corridor pages.
 * Public, no auth, no DB, no email, no Stripe.
 * No job guarantee, no visa guarantee.
 */
import Link from 'next/link'

export type GlobalCorridorConfig = {
  slug:             string
  originCountry:    string
  destinationCountry: string
  originFlag:       string
  destinationFlag:  string
  headline:         string
  description:      string
  sectors:          string[]
  corridorScore:    number
  complianceNote:   string
  metaDescription:  string
}

export function GlobalCorridorPage({ cfg }: { cfg: GlobalCorridorConfig }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-indigo-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-sm text-indigo-300 mb-3">
            <Link href="/" className="hover:underline">CorridorWork</Link>
            {' → '}
            <Link href="/corridors" className="hover:underline">Corridors</Link>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{cfg.originFlag}</span>
            <span className="text-2xl text-indigo-400">→</span>
            <span className="text-5xl">{cfg.destinationFlag}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{cfg.headline}</h1>
          <p className="text-indigo-200 text-lg max-w-2xl">{cfg.description}</p>
          <div className="flex items-center gap-3 mt-4">
            <span className="px-3 py-1 bg-indigo-800 border border-indigo-600 rounded-full text-sm text-indigo-200">
              Corridor Score: {cfg.corridorScore}/100
            </span>
            <span className="px-3 py-1 bg-green-800 border border-green-600 rounded-full text-sm text-green-200">
              ✅ Global Corridor
            </span>
          </div>
        </div>
      </div>

      {/* Compliance Note */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
        <div className="max-w-4xl mx-auto text-sm text-amber-800">
          ⚠️ {cfg.complianceNote}{' · '}
          No job guarantee · No visa guarantee · No candidate fees · Manual review only
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* Sectors */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-4">🏭 Sectors in this Corridor</h2>
          <div className="flex flex-wrap gap-2">
            {cfg.sectors.map(s => (
              <span key={s} className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg text-sm font-medium">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/global/employers"
            className="flex items-start gap-4 p-5 bg-blue-50 border-2 border-blue-300 rounded-xl hover:bg-blue-100 transition-colors">
            <span className="text-3xl shrink-0">🏢</span>
            <div>
              <div className="font-bold text-blue-900 text-lg">Employer Intake</div>
              <div className="text-sm text-blue-700 mt-1">
                Register your hiring need globally. Manual review. No payment required.
              </div>
              <div className="text-sm text-blue-600 font-semibold mt-2">→ /global/employers</div>
            </div>
          </Link>

          <Link href="/global/candidates"
            className="flex items-start gap-4 p-5 bg-green-50 border-2 border-green-300 rounded-xl hover:bg-green-100 transition-colors">
            <span className="text-3xl shrink-0">👤</span>
            <div>
              <div className="font-bold text-green-900 text-lg">Candidate Interest</div>
              <div className="text-sm text-green-700 mt-1">
                Register your interest. Free. No job or visa guarantee. Manual review.
              </div>
              <div className="text-sm text-green-600 font-semibold mt-2">→ /global/candidates</div>
            </div>
          </Link>

          <Link href="/partners"
            className="flex items-start gap-4 p-5 bg-purple-50 border-2 border-purple-300 rounded-xl hover:bg-purple-100 transition-colors">
            <span className="text-3xl shrink-0">🤝</span>
            <div>
              <div className="font-bold text-purple-900 text-lg">Partner Program</div>
              <div className="text-sm text-purple-700 mt-1">
                Recruiting agencies and relocation partners — white-label options available.
              </div>
              <div className="text-sm text-purple-600 font-semibold mt-2">→ /partners</div>
            </div>
          </Link>

          <Link href="/market-intelligence"
            className="flex items-start gap-4 p-5 bg-emerald-50 border-2 border-emerald-300 rounded-xl hover:bg-emerald-100 transition-colors">
            <span className="text-3xl shrink-0">📊</span>
            <div>
              <div className="font-bold text-emerald-900 text-lg">Market Intelligence</div>
              <div className="text-sm text-emerald-700 mt-1">
                Corridor data, sector demand reports, talent supply analysis.
              </div>
              <div className="text-sm text-emerald-600 font-semibold mt-2">→ /market-intelligence</div>
            </div>
          </Link>
        </div>

        {/* Corridor Context */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-3">🌍 About this Talent Corridor</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white border border-indigo-100 rounded-lg p-3 text-center">
              <div className="text-2xl">{cfg.originFlag}</div>
              <div className="text-xs text-gray-500 mt-1">Origin</div>
              <div className="text-sm font-semibold text-gray-700">{cfg.originCountry}</div>
            </div>
            <div className="bg-white border border-indigo-100 rounded-lg p-3 text-center">
              <div className="text-2xl">{cfg.destinationFlag}</div>
              <div className="text-xs text-gray-500 mt-1">Destination</div>
              <div className="text-sm font-semibold text-gray-700">{cfg.destinationCountry}</div>
            </div>
            <div className="bg-white border border-indigo-100 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-indigo-600">{cfg.corridorScore}</div>
              <div className="text-xs text-gray-500 mt-1">Corridor Score</div>
            </div>
            <div className="bg-white border border-indigo-100 rounded-lg p-3 text-center">
              <div className="text-2xl">{cfg.sectors.length}</div>
              <div className="text-xs text-gray-500 mt-1">Active Sectors</div>
            </div>
          </div>
        </div>

        {/* Safety */}
        <div className="bg-slate-900 text-white rounded-xl p-4 text-sm">
          <div className="font-semibold text-green-400 mb-1">🛡️ Safety & Compliance</div>
          <div className="text-slate-300">
            All corridor operations are compliance-first. No automatic placements. No visa advice.
            No job guarantees. No candidate fees. All submissions reviewed manually.
            CorridorWork operates as a structured inbound matching platform — not a staffing agency.
          </div>
        </div>
      </div>
    </div>
  )
}
