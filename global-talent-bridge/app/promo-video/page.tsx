/**
 * app/promo-video/page.tsx — /promo-video
 *
 * CorridorWork Promo Video Preview Page — publicly accessible.
 * Shows the embedded MP4, storyboard, 10-language subtitle pack,
 * production-ready assets, and CTAs.
 *
 * Safety: no job guarantee · no visa guarantee · no Stripe ·
 *         no email sending · no scraping · no fake revenue claims
 */
import Link from 'next/link'
import { PublicFooter } from '@/app/_components/PublicFooter'

export const metadata = {
  title: 'Promo Video — CorridorWork',
  description:
    'Watch the CorridorWork promo video. 52-second multilingual production with English voiceover and SRT subtitles in 10 languages. Compliance-first: no job guarantee, no visa guarantee.',
}

// ── Storyboard scenes ─────────────────────────────────────────────────────────

const SCENES = [
  {
    time:    '0:00 – 0:08',
    title:   'THE HOOK',
    visual:  'Dark slide — glowing text. Millions of jobs. Millions of skilled workers. Still disconnected.',
    screen:  ['MILLIONS OF JOBS.', 'MILLIONS OF SKILLED WORKERS.', 'STILL DISCONNECTED.'],
    voiceover: '"Millions of jobs. Millions of skilled workers. Still disconnected."',
    bg:      'from-slate-900 to-indigo-950',
    accent:  'text-indigo-300',
    badge:   'bg-indigo-900/60 text-indigo-200',
  },
  {
    time:    '0:08 – 0:16',
    title:   'INTRODUCING CORRIDORWORK',
    visual:  'CorridorWork name appears with indigo gradient. Domain shown.',
    screen:  ['INTRODUCING', 'CorridorWork', 'corridorwork.com'],
    voiceover: '"Introducing CorridorWork — connecting employers with qualified international talent."',
    bg:      'from-indigo-950 to-violet-950',
    accent:  'text-violet-300',
    badge:   'bg-violet-900/60 text-violet-200',
  },
  {
    time:    '0:16 – 0:25',
    title:   'THE SOLUTION',
    visual:  'Cyan accent slides. Smarter matching. Global reach. Better opportunities.',
    screen:  ['SMARTER MATCHING.', 'GLOBAL REACH.', 'BETTER OPPORTUNITIES.'],
    voiceover: '"Smarter matching. Global reach. Better opportunities — transparently, with no shortcuts."',
    bg:      'from-blue-950 to-slate-900',
    accent:  'text-cyan-300',
    badge:   'bg-cyan-900/60 text-cyan-200',
  },
  {
    time:    '0:25 – 0:34',
    title:   'THE FEATURES',
    visual:  'Green accent. 4 feature lines: 21 Sectors · 15+ Corridors · Compliance-First · Inbound.',
    screen:  ['21 SECTORS', '15+ GLOBAL CORRIDORS', 'COMPLIANCE-FIRST ARCHITECTURE', 'INBOUND-DRIVEN PLATFORM'],
    voiceover: '"21 sectors. 15-plus global talent corridors. Compliance-first. Zero false promises."',
    bg:      'from-slate-900 to-indigo-950',
    accent:  'text-green-300',
    badge:   'bg-green-900/60 text-green-200',
  },
  {
    time:    '0:34 – 0:42',
    title:   'FOR WHOM',
    visual:  'Amber accent split: For Employers. For Talent. For Growth.',
    screen:  ['FOR EMPLOYERS.', 'FOR TALENT.', 'FOR GROWTH.'],
    voiceover: '"For employers, professionals, agencies, and investors."',
    bg:      'from-violet-950 to-slate-900',
    accent:  'text-amber-300',
    badge:   'bg-amber-900/60 text-amber-200',
  },
  {
    time:    '0:42 – 0:52',
    title:   'CALL TO ACTION',
    visual:  'Clean end card: CorridorWork logo + domain + express interest.',
    screen:  ['CorridorWork', 'The structured path to global talent.', 'corridorwork.com'],
    voiceover: '"Explore CorridorWork today. The structured path to global talent."',
    bg:      'from-indigo-950 to-violet-950',
    accent:  'text-white',
    badge:   'bg-white/10 text-white',
  },
]

// ── Subtitle languages ─────────────────────────────────────────────────────────

const SUBTITLES = [
  { code: 'en',  flag: '🇬🇧', label: 'English',   rtl: false },
  { code: 'de',  flag: '🇩🇪', label: 'Deutsch',   rtl: false },
  { code: 'fr',  flag: '🇫🇷', label: 'Français',  rtl: false },
  { code: 'ar',  flag: '🇸🇦', label: 'العربية',   rtl: true  },
  { code: 'es',  flag: '🇪🇸', label: 'Español',   rtl: false },
  { code: 'pt',  flag: '🇧🇷', label: 'Português', rtl: false },
  { code: 'hi',  flag: '🇮🇳', label: 'हिंदी',     rtl: false },
  { code: 'ur',  flag: '🇵🇰', label: 'اردو',      rtl: true  },
  { code: 'fil', flag: '🇵🇭', label: 'Filipino',  rtl: false },
  { code: 'tr',  flag: '🇹🇷', label: 'Türkçe',    rtl: false },
]

// ── Production assets ─────────────────────────────────────────────────────────

const ASSETS = [
  { icon: '🎬', label: 'MP4 with Audio (EN)',     detail: '52s · H264 1280×720 · AAC · macOS Samantha voice',    file: 'corridorwork-promo-en.mp4' },
  { icon: '🎞️', label: 'MP4 Video-Only (EN)',     detail: '52s · H264 1280×720 · no audio (fallback)',           file: 'corridorwork-promo-en-noaudio.mp4' },
  { icon: '📝', label: 'SRT Subtitles (10 lang)', detail: 'EN DE FR AR ES PT HI UR FIL TR — copy-paste ready',   file: 'subtitles/' },
  { icon: '📄', label: 'Multilingual Scripts',    detail: '10 full scripts in docs/video/',                       file: 'docs/video/CORRIDORWORK_PROMO_*.md' },
  { icon: '🤖', label: 'AI Generation Prompts',   detail: 'Runway · Pika · Canva · CapCut · Synthesia/HeyGen',   file: 'docs/video/CORRIDORWORK_VIDEO_GENERATION_PROMPTS.md' },
]

// ─────────────────────────────────────────────────────────────────────────────

export default function PromoVideoPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ── Compliance Banner ────────────────────────────────────────────────── */}
      <div className="bg-green-950/50 border-b border-green-800/40 px-4 py-2">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center gap-x-6 gap-y-1 text-xs">
          <span className="text-green-400 font-semibold">✅ Compliance:</span>
          <span className="text-green-300">No job guarantee</span>
          <span className="text-green-600">·</span>
          <span className="text-green-300">No visa guarantee</span>
          <span className="text-green-600">·</span>
          <span className="text-green-300">No fake revenue claims</span>
          <span className="text-green-600">·</span>
          <span className="text-green-300">No Stripe · No email sending · No scraping</span>
        </div>
      </div>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-12 px-4 border-b border-indigo-900/40">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-indigo-400 text-sm font-medium mb-3 tracking-wide uppercase">
            <Link href="/" className="hover:underline">CorridorWork</Link>
            {' '}· Promo Video
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
            🎬 CorridorWork Promo Video
          </h1>
          <p className="text-indigo-200 text-base max-w-xl mx-auto">
            52-second English-language promo · H264 1280×720 · AAC audio ·
            SRT subtitles in 10 languages
          </p>
        </div>
      </div>

      {/* ── Video Player ─────────────────────────────────────────────────────── */}
      <div className="py-10 px-4">
        <div className="max-w-4xl mx-auto">

          <div className="bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              controls
              width="100%"
              height="auto"
              poster=""
              preload="metadata"
              className="w-full aspect-video bg-black"
            >
              <source
                src="/promo-video/corridorwork-promo-en.mp4"
                type="video/mp4"
              />
              {/* Subtitle tracks */}
              <track
                kind="subtitles"
                src="/promo-video/subtitles/corridorwork-promo-en.srt"
                srcLang="en"
                label="English"
                default
              />
              <track
                kind="subtitles"
                src="/promo-video/subtitles/corridorwork-promo-de.srt"
                srcLang="de"
                label="Deutsch"
              />
              <track
                kind="subtitles"
                src="/promo-video/subtitles/corridorwork-promo-fr.srt"
                srcLang="fr"
                label="Français"
              />
              <track
                kind="subtitles"
                src="/promo-video/subtitles/corridorwork-promo-ar.srt"
                srcLang="ar"
                label="العربية"
              />
              <track
                kind="subtitles"
                src="/promo-video/subtitles/corridorwork-promo-es.srt"
                srcLang="es"
                label="Español"
              />
              <track
                kind="subtitles"
                src="/promo-video/subtitles/corridorwork-promo-pt.srt"
                srcLang="pt"
                label="Português"
              />
              <track
                kind="subtitles"
                src="/promo-video/subtitles/corridorwork-promo-hi.srt"
                srcLang="hi"
                label="हिंदी"
              />
              <track
                kind="subtitles"
                src="/promo-video/subtitles/corridorwork-promo-ur.srt"
                srcLang="ur"
                label="اردو"
              />
              <track
                kind="subtitles"
                src="/promo-video/subtitles/corridorwork-promo-fil.srt"
                srcLang="fil"
                label="Filipino"
              />
              <track
                kind="subtitles"
                src="/promo-video/subtitles/corridorwork-promo-tr.srt"
                srcLang="tr"
                label="Türkçe"
              />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Video meta */}
          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            {[
              '🎬 H264 1280×720',
              '🔊 AAC Audio (EN)',
              '⏱ 52 seconds',
              '📝 10 subtitle languages',
              '✅ No job guarantee',
              '✅ No visa guarantee',
            ].map(item => (
              <span key={item} className="text-xs px-3 py-1 bg-slate-800/80 border border-slate-700/60 rounded-full text-slate-300">
                {item}
              </span>
            ))}
          </div>

          {/* Direct download */}
          <div className="mt-5 flex flex-wrap gap-3 justify-center">
            <a
              href="/promo-video/corridorwork-promo-en.mp4"
              download
              className="px-4 py-2 bg-indigo-700 hover:bg-indigo-600 text-white text-sm rounded-lg font-medium transition-colors"
            >
              ⬇ Download MP4 (with audio)
            </a>
            <a
              href="/promo-video/corridorwork-promo-en-noaudio.mp4"
              download
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg font-medium transition-colors"
            >
              ⬇ Download MP4 (video-only, 7MB)
            </a>
          </div>
        </div>
      </div>

      {/* ── Subtitles ─────────────────────────────────────────────────────────── */}
      <div className="py-10 px-4 bg-slate-900/60 border-y border-slate-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-2">Subtitles — 10 Languages</h2>
          <p className="text-slate-400 text-sm mb-6">
            SRT subtitle files available for all 10 languages.
            Use in VLC, YouTube Studio, Premiere Pro, DaVinci Resolve, or any video editor.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {SUBTITLES.map(lang => (
              <a
                key={lang.code}
                href={`/promo-video/subtitles/corridorwork-promo-${lang.code}.srt`}
                download
                className="bg-slate-800/60 border border-slate-700/60 hover:border-indigo-600/60 rounded-xl px-3 py-3 flex flex-col items-center text-center gap-1 transition-colors group"
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="text-white text-xs font-semibold group-hover:text-indigo-300 transition-colors">
                  {lang.code.toUpperCase()}
                </span>
                <span className={`text-slate-400 text-xs ${lang.rtl ? 'direction-rtl' : ''}`}>
                  {lang.label}
                </span>
                <span className="text-xs text-indigo-400 mt-0.5">⬇ .srt</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Storyboard ───────────────────────────────────────────────────────── */}
      <div className="py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-2">Scene Breakdown</h2>
          <p className="text-slate-400 text-sm mb-6">6 scenes · 52 seconds · dark SaaS design</p>
          <div className="space-y-4">
            {SCENES.map((scene, i) => (
              <div
                key={i}
                className={`rounded-xl bg-gradient-to-r ${scene.bg} border border-white/10 overflow-hidden`}
              >
                <div className="px-5 py-3 border-b border-white/10 flex items-center gap-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${scene.badge}`}>
                    {i + 1}
                  </span>
                  <span className="text-white font-semibold text-sm">{scene.title}</span>
                  <span className={`ml-auto text-xs font-mono ${scene.accent} opacity-70`}>{scene.time}</span>
                </div>
                <div className="grid md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/10">
                  <div className="px-4 py-3">
                    <div className={`text-xs font-semibold uppercase tracking-wider mb-1.5 ${scene.accent} opacity-60`}>Visual</div>
                    <p className="text-slate-300 text-xs leading-relaxed">{scene.visual}</p>
                  </div>
                  <div className="px-4 py-3">
                    <div className={`text-xs font-semibold uppercase tracking-wider mb-1.5 ${scene.accent} opacity-60`}>On-Screen</div>
                    <div className="space-y-1">
                      {scene.screen.map((line, j) => (
                        <div key={j} className="text-white text-xs font-medium bg-black/20 rounded px-2 py-0.5">{line}</div>
                      ))}
                    </div>
                  </div>
                  <div className="px-4 py-3">
                    <div className={`text-xs font-semibold uppercase tracking-wider mb-1.5 ${scene.accent} opacity-60`}>Voiceover (EN)</div>
                    <p className={`text-xs italic leading-relaxed ${scene.accent}`}>{scene.voiceover}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Production Assets ─────────────────────────────────────────────────── */}
      <div className="py-10 px-4 bg-slate-900/40 border-y border-slate-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-2">Production-Ready Assets</h2>
          <p className="text-slate-400 text-sm mb-6">
            All files in <code className="text-indigo-300 bg-indigo-950/60 px-1 rounded">public/promo-video/</code>{' '}
            and <code className="text-indigo-300 bg-indigo-950/60 px-1 rounded">docs/video/</code>
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {ASSETS.map((asset, i) => (
              <div key={i} className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex items-start gap-3">
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
        </div>
      </div>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <div className="py-12 px-4 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 border-t border-indigo-900/40">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Interested in CorridorWork?</h2>
          <p className="text-indigo-200 text-sm mb-6">No commitment. No automatic emails. No Stripe.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/demo/sandbox"
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-500 transition-colors text-sm">
              🔬 Platform Demo
            </Link>
            <Link href="/buyer-snapshot"
              className="px-6 py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-500 transition-colors text-sm">
              📋 Buyer Snapshot
            </Link>
            <Link href="/strategic-partnership"
              className="px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-500 transition-colors text-sm">
              🎯 Strategic Partnership
            </Link>
          </div>
          <p className="mt-5 text-slate-500 text-xs">
            corridorwork.com · No job guarantee · No visa guarantee · No fake revenue claims
          </p>
        </div>
      </div>

      <PublicFooter />
    </div>
  )
}
