/**
 * app/demo/sandbox/page.tsx — /demo/sandbox
 *
 * Demo Sandbox — öffentlich, zeigt globale Plattform-Capabilities.
 * Keine echten Daten. Keine Accounts. Kein Login nötig.
 */
import Link from 'next/link'
import { TALENT_CATEGORIES, getTopCategoriesByRevenue } from '@/lib/talent-categories'

export const metadata = {
  title: 'Demo Sandbox — CorridorWork Global Talent Platform',
  description: 'Explore CorridorWork — global talent corridors, multisector capability, employer and candidate intake. Live demo.',
}

const DEMO_CORRIDORS = [
  { flag1: '🇵🇭', flag2: '🌍', name: 'Philippines → Global Healthcare', score: 92, href: '/corridors/philippines-healthcare' },
  { flag1: '🇮🇳', flag2: '🇨🇦', name: 'India → Canada', score: 88, href: '/corridors/india-canada' },
  { flag1: '🇲🇦', flag2: '🇩🇪', name: 'Morocco → Germany', score: 84, href: '/corridors/morocco-germany' },
  { flag1: '🇳🇬', flag2: '🇬🇧', name: 'Nigeria → UK', score: 84, href: '/corridors/nigeria-uk' },
  { flag1: '🇵🇰', flag2: '🌏', name: 'Pakistan → Gulf', score: 85, href: '/corridors/pakistan-gulf' },
]

export default function DemoSandboxPage() {
  const topRevCats = getTopCategoriesByRevenue(5)

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ⚠️ Demonstration-Only Banner */}
      <div className="bg-amber-50 border-b-2 border-amber-300 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <span className="text-xl shrink-0">🧪</span>
          <div className="text-sm">
            <span className="font-bold text-amber-800">Demo-Modus — Synthetische Daten:</span>
            <span className="text-amber-700 ml-1">
              Diese Seite zeigt ausschließlich Plattformfähigkeiten. Keine echten Kunden, keine echten Umsätze,
              keine echten Kandidaten- oder Arbeitgeberdaten. Alle Zahlen sind Demo-Daten.
            </span>
          </div>
          <Link href="/strategic-partnership"
            className="shrink-0 px-3 py-1.5 bg-amber-500 text-white text-xs font-bold rounded-lg hover:bg-amber-400 transition-colors">
            Echter Käufer? →
          </Link>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-blue-900 text-white py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-sm text-indigo-300 mb-2">
            <Link href="/" className="hover:underline">CorridorWork</Link> · Live Demo
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">🌍 Global Talent Corridor Platform</h1>
          <p className="text-indigo-200 text-lg max-w-2xl mb-6">
            Structured, compliance-first Cross-border Hiring — worldwide employers, worldwide candidates,
            {' '}{TALENT_CATEGORIES.length}+ sectors, 15+ global corridors. Inbound-first. No cold outreach.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/global/employers"
              className="px-5 py-2.5 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-400 transition-colors">
              🏢 Employer Intake →
            </Link>
            <Link href="/global/candidates"
              className="px-5 py-2.5 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-400 transition-colors">
              👤 Candidate Interest →
            </Link>
            <Link href="/strategic-partnership"
              className="px-5 py-2.5 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-400 transition-colors">
              🎯 Strategic Partnership →
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">

        {/* Platform Numbers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: `${TALENT_CATEGORIES.length}+`, label: 'Sectors', icon: '🏭', color: 'text-indigo-600' },
            { value: '15+',  label: 'Global Corridors', icon: '🌍', color: 'text-blue-600' },
            { value: '4',    label: 'Revenue Paths',    icon: '💰', color: 'text-green-600' },
            { value: '2134+', label: 'Tests Passing',   icon: '✅', color: 'text-emerald-600' },
          ].map(s => (
            <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Sectors */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-bold text-gray-900 text-xl mb-2">🏭 {TALENT_CATEGORIES.length} Sectors Supported</h2>
          <p className="text-sm text-gray-500 mb-4">Not limited to healthcare or IT — all qualified sectors worldwide.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {TALENT_CATEGORIES.map(cat => (
              <div key={cat.sector_key} className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-100 rounded-lg">
                <span>{cat.emoji}</span>
                <div className="min-w-0">
                  <div className="text-xs font-medium text-gray-700 truncate">{cat.public_label}</div>
                  {cat.remote_eligible && <span className="text-xs text-blue-500">🌐 Remote</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Corridors */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-bold text-gray-900 text-xl mb-4">🌍 Top Talent Corridors</h2>
          <div className="space-y-2">
            {DEMO_CORRIDORS.map(c => (
              <Link key={c.href} href={c.href}
                className="flex items-center gap-4 p-3 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition-colors">
                <span className="text-xl">{c.flag1}</span>
                <span className="text-gray-400">→</span>
                <span className="text-xl">{c.flag2}</span>
                <span className="flex-1 font-medium text-gray-900 text-sm">{c.name}</span>
                <span className="text-sm font-bold text-indigo-600">{c.score}/100</span>
                <span className="text-indigo-500 text-sm">→</span>
              </Link>
            ))}
            <Link href="/corridors" className="block text-center text-sm text-blue-600 hover:underline mt-2">
              View all 15+ corridors →
            </Link>
          </div>
        </div>

        {/* Top Revenue Potential */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h2 className="font-bold text-gray-900 text-xl mb-4">💰 Top 5 Revenue Segments</h2>
          <div className="space-y-2">
            {topRevCats.map((cat, i) => (
              <div key={cat.sector_key} className="flex items-center gap-3 p-3 bg-white border border-green-100 rounded-lg">
                <span className="text-gray-400 font-bold w-5">#{i+1}</span>
                <span>{cat.emoji}</span>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800 text-sm">{cat.public_label}</div>
                </div>
                <div className="text-sm font-bold text-green-700">{cat.revenue_potential}/100</div>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-bold text-gray-900 text-xl mb-4">⚙️ How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step: '1', icon: '📥', title: 'Inbound Intake', desc: 'Employers and candidates register interest globally — no cold outreach needed.' },
              { step: '2', icon: '🤖', title: 'Daily Automation', desc: 'CWO Daily Runner prepares top corridors, sectors, and revenue priorities every day — automatically.' },
              { step: '3', icon: '🎯', title: 'Manual Review', desc: 'Admin reviews leads, qualifies matches, and takes action — compliance-first, approval-based.' },
            ].map(step => (
              <div key={step.step} className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-3xl mb-2">{step.icon}</div>
                <div className="font-bold text-gray-900 mb-1">{step.title}</div>
                <div className="text-sm text-gray-600">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Honest Demo Disclaimer */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-5">
          <div className="font-bold text-amber-800 mb-2">🧪 Demo Disclaimer — Was diese Seite zeigt und was nicht</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <div className="font-semibold text-green-700 mb-1">✅ Was gezeigt wird:</div>
              {['Plattformarchitektur (echt)', 'Technische Fähigkeiten (echt)', '21 Sektoren-Taxonomie (echt)', '15+ Korridor-Seiten (echt)', 'Test-Zahlen (synthetisch)', 'Demo-Inhalte (zur Illustration)'].map(item => (
                <div key={item} className="flex items-center gap-1.5 text-green-700 text-xs"><span>✓</span>{item}</div>
              ))}
            </div>
            <div>
              <div className="font-semibold text-red-700 mb-1">❌ Was NICHT gezeigt wird:</div>
              {['Echte Kunden (0)', 'Echter Umsatz (0 EUR)', 'Echte Traction (keine)', 'Echter Traffic (nicht messbar)', 'Echte Placements (keine)', 'Fake-Erfolgszahlen (keine)'].map(item => (
                <div key={item} className="flex items-center gap-1.5 text-red-700 text-xs"><span>✗</span>{item}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Promo Video Script Available */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎬</span>
            <div>
              <div className="font-bold text-indigo-900 mb-1">Promo Video Script Available</div>
              <p className="text-sm text-indigo-700 leading-relaxed">
                A <strong>multilingual promo video pack</strong> (10 languages: EN, DE, FR, AR, ES, PT, HI, UR, FIL, TR)
                is available in <code className="bg-indigo-100 px-1 rounded text-xs">docs/video/</code>.
                Includes 60s master script, 30s short, 10s social hook, SRT subtitles,
                and AI generation prompts for Runway, Pika, Canva, CapCut, and Synthesia/HeyGen.
              </p>
              <p className="text-xs text-indigo-500 mt-1">
                No video file yet — script only. No paid video service activated.
                Compliance-safe: no job guarantee, no visa guarantee in any language.
              </p>
              <div className="mt-2 flex gap-2 flex-wrap">
                <a href="/strategic-partnership"
                  className="text-xs bg-indigo-700 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-800 transition-colors">
                  🤝 Interested in a video partnership?
                </a>
                <a href="/demo/sandbox"
                  className="text-xs bg-white border border-indigo-300 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors">
                  📄 View platform demo
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Safety */}
        <div className="bg-slate-900 text-white rounded-xl p-5 text-sm">
          <div className="font-semibold text-green-400 mb-2">🛡️ Safety & Compliance</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-slate-300 text-xs">
            {['No automatic emails', 'No cold outreach', 'No scraping', 'No Stripe/payment', 'No job guarantee', 'No visa guarantee', 'No candidate fees', 'GDPR-compliant (EU region)', 'Inbound-only'].map(item => (
              <div key={item} className="flex items-center gap-1.5">
                <span className="text-green-400">✓</span>{item}
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/global/employers"
            className="flex flex-col items-center p-5 bg-blue-50 border-2 border-blue-300 rounded-xl text-center hover:bg-blue-100 transition-colors">
            <span className="text-3xl mb-2">🏢</span>
            <div className="font-bold text-blue-900">I&apos;m an Employer</div>
            <div className="text-sm text-blue-700 mt-1">Register global hiring need</div>
          </Link>
          <Link href="/global/candidates"
            className="flex flex-col items-center p-5 bg-green-50 border-2 border-green-300 rounded-xl text-center hover:bg-green-100 transition-colors">
            <span className="text-3xl mb-2">👤</span>
            <div className="font-bold text-green-900">I&apos;m a Candidate</div>
            <div className="text-sm text-green-700 mt-1">Register interest — free</div>
          </Link>
          <Link href="/strategic-partnership"
            className="flex flex-col items-center p-5 bg-amber-50 border-2 border-amber-300 rounded-xl text-center hover:bg-amber-100 transition-colors">
            <span className="text-3xl mb-2">🎯</span>
            <div className="font-bold text-amber-900">Partner / Buyer</div>
            <div className="text-sm text-amber-700 mt-1">White-label, licensing, acquisition</div>
          </Link>
        </div>

      </div>
    </div>
  )
}
