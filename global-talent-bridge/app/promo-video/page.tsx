/**
 * app/promo-video/page.tsx — /promo-video
 *
 * CorridorWork Promo Video Preview Page — publicly accessible.
 * Shows the full storyboard, 10-language pack overview,
 * production-ready assets, and CTAs.
 *
 * Safety: no MP4 file · no paid video service · no job guarantee ·
 *         no visa guarantee · no Stripe · no email sending · no scraping
 */
import Link from 'next/link'
import { PublicFooter } from '@/app/_components/PublicFooter'

export const metadata = {
  title: 'Promo Video Preview — CorridorWork',
  description:
    'Storyboard preview of the CorridorWork multilingual promo video. 10 languages, SRT subtitles, AI generation prompts. No MP4 yet — script-only.',
}

// ── Storyboard scenes (from CORRIDORWORK_PROMO_MASTER_EN.md) ─────────────────

const SCENES = [
  {
    time:    '0:00 – 0:05',
    title:   'THE HOOK',
    visual:  'Aerial view of Earth. Glowing connection lines between cities — Manila → Frankfurt, Casablanca → Paris, Mumbai → Toronto.',
    screen:  ['Millions of skilled professionals.', 'Thousands of global employers.', 'Almost no structured path between them.'],
    voiceover: '"Millions of skilled professionals. Thousands of employers worldwide. And almost no structured way to connect them."',
    bg:      'from-slate-900 to-indigo-950',
    accent:  'text-indigo-300',
    badge:   'bg-indigo-900/60 text-indigo-200',
  },
  {
    time:    '0:05 – 0:15',
    title:   'THE PROBLEM',
    visual:  'Triptych: Filipino nurse with complex visa forms / German construction firm with unsuitable applications / Moroccan engineer searching international jobs without result.',
    screen:  ['Complex.', 'Uncertain.', 'Unstructured.'],
    voiceover: '"International hiring is hard. Compliance gaps. Bureaucratic hurdles. Visa uncertainty. Nobody owns the process end to end."',
    bg:      'from-red-950 to-slate-900',
    accent:  'text-red-300',
    badge:   'bg-red-900/60 text-red-200',
  },
  {
    time:    '0:15 – 0:30',
    title:   'THE SOLUTION',
    visual:  'CorridorWork platform appears on modern monitor. Corridor map animates: India → Germany, Philippines → EU Healthcare, Nigeria → UK Tech. Logo and claim.',
    screen:  ['CorridorWork', 'Structured. Compliance-First. Global.', 'corridorwork.com'],
    voiceover: '"CorridorWork is a structured, compliance-first platform for global workforce mobility. It connects skilled professionals with employers across 21 sectors and 15+ global talent corridors — transparently, with no shortcuts."',
    bg:      'from-indigo-950 to-blue-950',
    accent:  'text-blue-300',
    badge:   'bg-blue-900/60 text-blue-200',
  },
  {
    time:    '0:30 – 0:45',
    title:   'THE FEATURES',
    visual:  'Fast product montage: sector grid (Care, Construction, IT, Logistics…) / India–Canada corridor page / employer registration form.',
    screen:  ['21 Sectors', '15+ Global Corridors', 'Inbound-Driven Platform', 'Compliance-First Architecture'],
    voiceover: '"From care to construction. From India to Germany. From Morocco to France. CorridorWork structures the journey — with honest pathways and zero false promises."',
    bg:      'from-blue-950 to-slate-900',
    accent:  'text-cyan-300',
    badge:   'bg-cyan-900/60 text-cyan-200',
  },
  {
    time:    '0:45 – 0:55',
    title:   'FOR WHOM?',
    visual:  'Four-panel split screen: Employer at desk / Candidate browsing / Agency team / Investor with dashboard.',
    screen:  ['Employers  |  Candidates  |  Agencies  |  Investors'],
    voiceover: '"For employers seeking structured international talent. For professionals exploring global career corridors. For agencies and partners ready to scale. For investors in proven SaaS infrastructure."',
    bg:      'from-slate-900 to-violet-950',
    accent:  'text-violet-300',
    badge:   'bg-violet-900/60 text-violet-200',
  },
  {
    time:    '0:55 – 1:00',
    title:   'CALL TO ACTION',
    visual:  'Clean end card. CorridorWork logo. Domain prominent.',
    screen:  ['CorridorWork', 'The structured path to global talent.', 'corridorwork.com', 'Express Interest — no commitment'],
    voiceover: '"Explore CorridorWork. The structured path to global talent."',
    bg:      'from-violet-950 to-indigo-950',
    accent:  'text-white',
    badge:   'bg-white/10 text-white',
  },
]

// ── Language pack ─────────────────────────────────────────────────────────────

const LANGUAGES = [
  { code: 'EN', label: 'English',    flag: '🇬🇧', note: 'Master script' },
  { code: 'DE', label: 'Deutsch',    flag: '🇩🇪', note: 'German' },
  { code: 'FR', label: 'Français',   flag: '🇫🇷', note: 'French' },
  { code: 'AR', label: 'العربية',    flag: '🇸🇦', note: 'Arabic (RTL)' },
  { code: 'ES', label: 'Español',    flag: '🇪🇸', note: 'Spanish' },
  { code: 'PT', label: 'Português',  flag: '🇧🇷', note: 'Portuguese' },
  { code: 'HI', label: 'हिंदी',      flag: '🇮🇳', note: 'Hindi' },
  { code: 'UR', label: 'اردو',       flag: '🇵🇰', note: 'Urdu (RTL)' },
  { code: 'FIL', label: 'Filipino',  flag: '🇵🇭', note: 'Tagalog' },
  { code: 'TR', label: 'Türkçe',     flag: '🇹🇷', note: 'Turkish' },
]

// ── Production assets ─────────────────────────────────────────────────────────

const ASSETS = [
  { icon: '🎙️', label: 'Voiceover Scripts',       detail: '10 languages · 60s / 30s / 10s each',     file: 'CORRIDORWORK_PROMO_*.md' },
  { icon: '📝', label: 'SRT Subtitle Pack',        detail: 'All 10 languages, copy-paste ready',       file: 'CORRIDORWORK_SUBTITLES_SRT_PACK.md' },
  { icon: '🎬', label: 'Runway Gen-3 Prompts',     detail: '6 scene-specific text-to-video prompts',   file: 'CORRIDORWORK_VIDEO_GENERATION_PROMPTS.md' },
  { icon: '⚡', label: 'Pika 2.0 Prompts',         detail: '3 variants · 16:9 / 9:16 / 1:1',          file: 'CORRIDORWORK_VIDEO_GENERATION_PROMPTS.md' },
  { icon: '🖼️', label: 'Canva Magic Media Prompts', detail: 'Scene prompts + animation guide',        file: 'CORRIDORWORK_VIDEO_GENERATION_PROMPTS.md' },
  { icon: '✂️', label: 'CapCut Script-to-Video',   detail: '60s master + 9:16 social cut',             file: 'CORRIDORWORK_VIDEO_GENERATION_PROMPTS.md' },
  { icon: '🤖', label: 'Synthesia / HeyGen Script', detail: 'Avatar script + multilingual translation guide', file: 'CORRIDORWORK_VIDEO_GENERATION_PROMPTS.md' },
]

// ─────────────────────────────────────────────────────────────────────────────

export default function PromoVideoPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ── No-MP4 Banner ───────────────────────────────────────────────────── */}
      <div className="bg-amber-900/40 border-b border-amber-700/50 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-start gap-3">
          <span className="text-xl shrink-0 mt-0.5">📋</span>
          <p className="text-sm text-amber-200">
            <span className="font-bold text-amber-100">Storyboard / Script Preview — No MP4 yet.</span>
            {' '}This is a storyboard/script preview. No final MP4 video has been generated yet.
            All voiceover scripts, SRT subtitles and AI generation prompts are ready in{' '}
            <code className="text-amber-300 bg-amber-950/60 px-1 rounded">docs/video/</code>.
            No paid video service is activated.
          </p>
        </div>
      </div>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-16 px-4 border-b border-indigo-900/40">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-indigo-400 text-sm font-medium mb-3 tracking-wide uppercase">
            <Link href="/" className="hover:underline">CorridorWork</Link>
            {' '}· Promo Video Preview
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
            🎬 CorridorWork Promo Video Preview
          </h1>
          <p className="text-indigo-200 text-lg max-w-2xl mx-auto mb-4">
            60-second storyboard · 10 languages · compliance-first · no job or visa guarantee
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-900/40 border border-amber-700/40 rounded-full text-amber-300 text-sm">
            <span>⚠️</span>
            <span>Script-only preview — no MP4 file exists yet</span>
          </div>
        </div>
      </div>

      {/* ── Storyboard ──────────────────────────────────────────────────────── */}
      <div className="py-12 px-4">
        <div className="max-w-5xl mx-auto">

          <h2 className="text-2xl font-bold text-white mb-2">60-Second Storyboard</h2>
          <p className="text-slate-400 text-sm mb-8">
            Scene-by-scene breakdown — visual description, on-screen text, and English voiceover.
          </p>

          <div className="space-y-6">
            {SCENES.map((scene, i) => (
              <div
                key={i}
                className={`rounded-2xl bg-gradient-to-r ${scene.bg} border border-white/10 overflow-hidden`}
              >
                {/* Scene header */}
                <div className="px-6 py-4 border-b border-white/10 flex items-center gap-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${scene.badge}`}>
                    SCENE {i + 1}
                  </span>
                  <span className="text-white font-bold">{scene.title}</span>
                  <span className={`ml-auto text-xs font-mono ${scene.accent} opacity-80`}>{scene.time}</span>
                </div>

                {/* Scene body */}
                <div className="grid md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/10">
                  {/* Visual */}
                  <div className="px-5 py-4">
                    <div className={`text-xs font-semibold uppercase tracking-wider mb-2 ${scene.accent} opacity-70`}>
                      Visual
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">{scene.visual}</p>
                  </div>

                  {/* Screen text */}
                  <div className="px-5 py-4">
                    <div className={`text-xs font-semibold uppercase tracking-wider mb-2 ${scene.accent} opacity-70`}>
                      On-Screen Text
                    </div>
                    <div className="space-y-1">
                      {scene.screen.map((line, j) => (
                        <div key={j} className="text-white text-sm font-medium bg-black/20 rounded px-2 py-0.5">
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Voiceover */}
                  <div className="px-5 py-4">
                    <div className={`text-xs font-semibold uppercase tracking-wider mb-2 ${scene.accent} opacity-70`}>
                      Voiceover (EN)
                    </div>
                    <p className={`text-sm italic leading-relaxed ${scene.accent}`}>
                      {scene.voiceover}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Language Pack ───────────────────────────────────────────────────── */}
      <div className="py-12 px-4 bg-slate-900/60 border-y border-slate-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-2">10-Language Script Pack</h2>
          <p className="text-slate-400 text-sm mb-8">
            Each language includes: 60s full script · 30s short version · 10s social hook ·
            scene voiceover · on-screen text · SRT subtitles · compliance checklist.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {LANGUAGES.map(lang => (
              <div
                key={lang.code}
                className="bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-3 flex flex-col items-center text-center gap-1"
              >
                <span className="text-2xl">{lang.flag}</span>
                <span className="text-white font-bold text-sm">{lang.code}</span>
                <span className="text-slate-300 text-xs">{lang.label}</span>
                <span className="text-slate-500 text-xs">{lang.note}</span>
                <span className="mt-1 text-xs bg-green-900/40 text-green-400 border border-green-800/40 px-2 py-0.5 rounded-full">
                  ✓ Ready
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Production-Ready Assets ─────────────────────────────────────────── */}
      <div className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-2">Production-Ready Assets</h2>
          <p className="text-slate-400 text-sm mb-8">
            All scripts and AI generation prompts are available in{' '}
            <code className="text-indigo-300 bg-indigo-950/60 px-1 rounded">docs/video/</code>.
            No paid tool is activated — use these prompts with the AI tool of your choice.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {ASSETS.map((asset, i) => (
              <div
                key={i}
                className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex items-start gap-3"
              >
                <span className="text-2xl shrink-0">{asset.icon}</span>
                <div>
                  <div className="text-white font-semibold text-sm">{asset.label}</div>
                  <div className="text-slate-400 text-xs mt-0.5">{asset.detail}</div>
                  <div className="text-slate-600 text-xs mt-1 font-mono">{asset.file}</div>
                </div>
                <span className="ml-auto shrink-0 text-xs text-green-400">✓</span>
              </div>
            ))}
          </div>

          {/* Compliance note */}
          <div className="mt-6 p-4 bg-green-950/40 border border-green-800/40 rounded-xl">
            <div className="text-green-400 font-semibold text-sm mb-2">✅ Compliance — all 10 languages verified</div>
            <div className="grid sm:grid-cols-2 gap-1">
              {[
                'Zero employment guarantee claims — all 10 languages',
                'Zero visa guarantee claims — all 10 languages',
                'No income guarantee language',
                'No false placement promises',
                'Brand: CorridorWork ✓',
                'Domain: corridorwork.com ✓',
                'No Stripe / no payments',
                'No email sending',
                'No scraping / no external APIs',
                '535 compliance tests — 0 failures',
              ].map(item => (
                <div key={item} className="text-green-300 text-xs flex items-center gap-1.5">
                  <span className="text-green-500">·</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <div className="py-12 px-4 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 border-t border-indigo-900/40">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Interested in CorridorWork?</h2>
          <p className="text-indigo-200 text-sm mb-8">
            Explore the platform, request a demo, or discuss a partnership.
            No commitment. No automatic emails.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/demo/sandbox"
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-500 transition-colors text-sm"
            >
              🔬 Platform Demo
            </Link>
            <Link
              href="/buyer-snapshot"
              className="px-6 py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-500 transition-colors text-sm"
            >
              📋 Buyer Snapshot
            </Link>
            <Link
              href="/strategic-partnership"
              className="px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-500 transition-colors text-sm"
            >
              🎯 Strategic Partnership
            </Link>
          </div>

          <p className="mt-6 text-slate-500 text-xs">
            corridorwork.com · No payments activated · No email sending · No scraping
          </p>
        </div>
      </div>

      <PublicFooter />
    </div>
  )
}
