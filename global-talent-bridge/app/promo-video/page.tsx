/**
 * app/promo-video/page.tsx — /promo-video
 *
 * CorridorWork Promo Video Preview Page — publicly accessible.
 * Shows:
 *   1. Human Footage Version — PIPELINE READY (clips needed)
 *   2. Technical Draft v1 — slide-based video (existing)
 *   3. 10-language subtitle pack, storyboard, CTAs
 *
 * Safety: no job guarantee · no visa guarantee · no Stripe ·
 *         no email sending · no scraping · no fake revenue claims ·
 *         no unlicensed media
 */
import Link from 'next/link'
import { PublicFooter } from '@/app/_components/PublicFooter'

export const metadata = {
  title: 'Promo Video — CorridorWork',
  description:
    'CorridorWork promo video. Human footage version in production. Technical draft available now. No job guarantee, no visa guarantee. corridorwork.com',
}

// ── Scene definitions (Human Footage version) ─────────────────────────────────

const HUMAN_SCENES = [
  {
    num: 1,
    time:    '0:00 – 0:08',
    title:   'THE PROBLEM',
    visual:  'Empty offices · HR team · open positions',
    text:    ['MILLIONS OF JOBS.', 'MILLIONS OF SKILLED WORKERS.', 'STILL DISCONNECTED.'],
    clips:   ['01-empty-office.mp4', '02-hr-team.mp4'],
    bg:      'from-slate-900 to-red-950',
    accent:  'text-red-300',
    badge:   'bg-red-900/50 text-red-200',
  },
  {
    num: 2,
    time:    '0:09 – 0:18',
    title:   'GLOBAL TALENT',
    visual:  'Diverse professionals · candidates · international workers',
    text:    ['Talent is global.', 'Opportunity should be connected.'],
    clips:   ['03-candidates-global.mp4', '07-candidate-laptop.mp4'],
    bg:      'from-blue-950 to-indigo-950',
    accent:  'text-blue-300',
    badge:   'bg-blue-900/50 text-blue-200',
  },
  {
    num: 3,
    time:    '0:19 – 0:28',
    title:   'CORRIDORWORK',
    visual:  'World map · globe · CorridorWork platform',
    text:    ['Introducing CorridorWork.', 'A global talent corridor platform.', 'corridorwork.com'],
    clips:   ['09-world-map-globe.mp4', '14-corridorwork-logo.mp4'],
    bg:      'from-indigo-950 to-violet-950',
    accent:  'text-indigo-300',
    badge:   'bg-indigo-900/50 text-indigo-200',
  },
  {
    num: 4,
    time:    '0:29 – 0:38',
    title:   'MULTIPLE SECTORS',
    visual:  'Healthcare · IT / Software · Engineering · Logistics · Hospitality',
    text:    ['Multiple sectors.', 'Multiple countries.', 'One structured system.'],
    clips:   ['04-healthcare-worker.mp4', '05-it-developer.mp4', '06-construction-worker.mp4', '12-logistics-worker.mp4'],
    bg:      'from-slate-900 to-green-950',
    accent:  'text-green-300',
    badge:   'bg-green-900/50 text-green-200',
  },
  {
    num: 5,
    time:    '0:39 – 0:48',
    title:   'FOR WHOM',
    visual:  'Employer interview · candidate at laptop · diverse team',
    text:    ['For employers.', 'For candidates.', 'For partners.'],
    clips:   ['08-employer-interview.mp4', '07-candidate-laptop.mp4', '10-diverse-team.mp4'],
    bg:      'from-violet-950 to-slate-900',
    accent:  'text-amber-300',
    badge:   'bg-amber-900/50 text-amber-200',
  },
  {
    num: 6,
    time:    '0:49 – 0:58',
    title:   'CALL TO ACTION',
    visual:  'CorridorWork brand · website · domain',
    text:    ['corridorwork.com', 'Connecting global talent with opportunity.'],
    clips:   ['14-corridorwork-logo.mp4'],
    bg:      'from-indigo-950 to-violet-950',
    accent:  'text-white',
    badge:   'bg-white/10 text-white',
  },
]

// ── Required clip list ────────────────────────────────────────────────────────

const REQUIRED_CLIPS = [
  { file: '01-empty-office.mp4',       label: 'Empty office / open desks',           priority: 'Must-have', icon: '🏢' },
  { file: '02-hr-team.mp4',            label: 'HR team reviewing candidates',          priority: 'Must-have', icon: '👥' },
  { file: '03-candidates-global.mp4',  label: 'Diverse international professionals',   priority: 'Must-have', icon: '🌍' },
  { file: '04-healthcare-worker.mp4',  label: 'Nurse / healthcare worker',             priority: 'Must-have', icon: '🏥' },
  { file: '05-it-developer.mp4',       label: 'IT professional / software developer',  priority: 'Must-have', icon: '💻' },
  { file: '06-construction-worker.mp4',label: 'Skilled trades / engineering worker',   priority: 'Recommended', icon: '🏗️' },
  { file: '07-candidate-laptop.mp4',   label: 'Candidate at laptop, applying',         priority: 'Must-have', icon: '💼' },
  { file: '08-employer-interview.mp4', label: 'Employer / HR in interview',            priority: 'Must-have', icon: '🤝' },
  { file: '09-world-map-globe.mp4',    label: 'World map / globe / flight paths',      priority: 'Recommended', icon: '🗺️' },
  { file: '10-diverse-team.mp4',       label: 'International team, collaboration',     priority: 'Recommended', icon: '🌐' },
  { file: '12-logistics-worker.mp4',   label: 'Logistics / warehouse worker',          priority: 'Optional', icon: '📦' },
  { file: '13-hospitality-worker.mp4', label: 'Hospitality / restaurant professional', priority: 'Optional', icon: '🍽️' },
  { file: '14-corridorwork-logo.mp4',  label: 'CorridorWork brand / logo end card',    priority: 'Must-have', icon: '✨' },
]

const FREE_SOURCES = [
  { name: 'Pexels.com',  url: 'https://www.pexels.com/search/videos/diverse+team/', note: 'Free license, no attribution required' },
  { name: 'Mixkit.co',   url: 'https://mixkit.co/free-stock-video/people/', note: 'Free license, no attribution required' },
  { name: 'Coverr.co',   url: 'https://coverr.co/search?q=office+diverse', note: 'Free license, no attribution required' },
  { name: 'Pixabay.com', url: 'https://pixabay.com/videos/search/healthcare/', note: 'Free license, no attribution required' },
]

// ── Subtitle languages ─────────────────────────────────────────────────────────

// Human version SRT files (10 languages) — explicit filenames for traceability
const HUMAN_SRT_FILES: Record<string, string> = {
  en:  'corridorwork-human-en.srt',
  de:  'corridorwork-human-de.srt',
  fr:  'corridorwork-human-fr.srt',
  ar:  'corridorwork-human-ar.srt',
  es:  'corridorwork-human-es.srt',
  pt:  'corridorwork-human-pt.srt',
  hi:  'corridorwork-human-hi.srt',
  ur:  'corridorwork-human-ur.srt',
  fil: 'corridorwork-human-fil.srt',
  tr:  'corridorwork-human-tr.srt',
}

const SUBTITLE_LANGS = [
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
          <span className="text-green-600">·</span>
          <span className="text-green-300">No unlicensed media</span>
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
            Human footage version in production · Technical draft available now ·
            10 subtitle languages · No robot voice in final version
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 1 — Human Footage Version (Pipeline Ready)
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="py-10 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Status banner */}
          <div className="mb-8 bg-amber-950/40 border border-amber-700/50 rounded-2xl p-5">
            <div className="flex items-start gap-4">
              <span className="text-3xl shrink-0">🎥</span>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-white font-bold text-lg">Human Footage Version — Pipeline Ready</h2>
                  <span className="text-xs px-2.5 py-0.5 bg-amber-900/60 text-amber-300 border border-amber-700/50 rounded-full font-semibold">
                    AWAITING CLIPS
                  </span>
                </div>
                <p className="text-amber-200/80 text-sm leading-relaxed">
                  The full automated build pipeline is prepared. Drop licensed clips into{' '}
                  <code className="text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded font-mono text-xs">
                    public/promo-video/source-clips/
                  </code>{' '}
                  and run{' '}
                  <code className="text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded font-mono text-xs">
                    bash scripts/build-human-promo-video.sh
                  </code>{' '}
                  to generate the final human footage MP4 automatically.
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1 bg-slate-800/80 border border-slate-700/60 rounded-full text-slate-300">✅ Build script: ready</span>
                  <span className="px-2.5 py-1 bg-slate-800/80 border border-slate-700/60 rounded-full text-slate-300">✅ Scene structure: 6 scenes · 58s</span>
                  <span className="px-2.5 py-1 bg-slate-800/80 border border-slate-700/60 rounded-full text-slate-300">✅ SRT subtitles: 10 languages</span>
                  <span className="px-2.5 py-1 bg-slate-800/80 border border-slate-700/60 rounded-full text-slate-300">✅ Voiceover script: ready</span>
                  <span className="px-2.5 py-1 bg-amber-900/60 border border-amber-700/50 rounded-full text-amber-200">⏳ Licensed clips: needed</span>
                  <span className="px-2.5 py-1 bg-amber-900/60 border border-amber-700/50 rounded-full text-amber-200">⏳ Human voiceover: needed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Voiceover script preview */}
          <div className="mb-8 bg-slate-900/60 border border-slate-700/60 rounded-2xl p-5">
            <h3 className="text-white font-semibold text-sm mb-3">📄 Voiceover Script (English — Human Voice Required)</h3>
            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              {[
                { time: '0:00–0:08', line: '"Millions of jobs. Millions of skilled workers. Still disconnected."' },
                { time: '0:10–0:18', line: '"Talent is global. Opportunity should be connected."' },
                { time: '0:19–0:28', line: '"Introducing CorridorWork. A global talent corridor platform."' },
                { time: '0:29–0:38', line: '"Multiple sectors. Multiple countries. One structured system."' },
                { time: '0:39–0:48', line: '"For employers. For candidates. For partners."' },
                { time: '0:49–0:58', line: '"corridorwork.com — Connecting global talent with opportunity."' },
              ].map((s, i) => (
                <div key={i} className="flex gap-3 bg-slate-800/50 rounded-lg px-3 py-2.5">
                  <span className="text-slate-500 font-mono shrink-0 pt-0.5">{s.time}</span>
                  <span className="text-slate-300 italic leading-snug">{s.line}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-slate-500 text-xs">
              Full script: <code className="text-slate-400">docs/video/HUMAN_FOOTAGE_VOICEOVER_SCRIPT.md</code>
              {' · '}No robot voice · Record with real voice artist or use silent+subtitles version
            </p>
          </div>

          {/* Required clips */}
          <div className="mb-8">
            <h3 className="text-white font-semibold text-sm mb-3">
              🎞️ Required Clips — Drop into <code className="text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded font-mono">public/promo-video/source-clips/</code>
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {REQUIRED_CLIPS.map((clip) => (
                <div key={clip.file}
                  className={`rounded-xl border px-3 py-2.5 flex items-center gap-2.5
                    ${clip.priority === 'Must-have'
                      ? 'bg-red-950/30 border-red-800/40'
                      : clip.priority === 'Recommended'
                        ? 'bg-amber-950/30 border-amber-800/40'
                        : 'bg-slate-800/40 border-slate-700/40'
                    }`}
                >
                  <span className="text-lg shrink-0">{clip.icon}</span>
                  <div className="min-w-0">
                    <div className="text-white text-xs font-semibold truncate">{clip.label}</div>
                    <div className="text-slate-500 text-xs font-mono truncate mt-0.5">{clip.file}</div>
                  </div>
                  <span className={`ml-auto shrink-0 text-xs px-1.5 py-0.5 rounded font-semibold
                    ${clip.priority === 'Must-have'
                      ? 'bg-red-900/60 text-red-300'
                      : clip.priority === 'Recommended'
                        ? 'bg-amber-900/60 text-amber-300'
                        : 'bg-slate-700/60 text-slate-400'
                    }`}>
                    {clip.priority === 'Must-have' ? '🔴' : clip.priority === 'Recommended' ? '🟡' : '🟢'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Free licensed sources */}
          <div className="mb-8 bg-slate-900/60 border border-slate-700/60 rounded-2xl p-5">
            <h3 className="text-white font-semibold text-sm mb-3">🔗 Free Licensed Sources (no attribution required)</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {FREE_SOURCES.map((src) => (
                <div key={src.name} className="bg-slate-800/50 rounded-lg px-3 py-2.5">
                  <div className="text-indigo-300 font-semibold text-sm">{src.name}</div>
                  <div className="text-slate-400 text-xs mt-0.5">{src.note}</div>
                  <div className="text-slate-600 text-xs font-mono mt-1 truncate">{src.url}</div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-slate-500 text-xs">
              Full license requirements: <code className="text-slate-400">docs/video/HUMAN_FOOTAGE_ASSET_LIST.md</code>
            </p>
          </div>

          {/* Human SRT pack */}
          <div className="mb-2">
            <h3 className="text-white font-semibold text-sm mb-3">
              📝 Human Version Subtitles — 10 Languages (Ready to use)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {SUBTITLE_LANGS.map(lang => (
                <a
                  key={lang.code}
                  href={`/promo-video/subtitles/human/${HUMAN_SRT_FILES[lang.code]}`}
                  download
                  className="bg-slate-800/60 border border-slate-700/60 hover:border-indigo-600/60 rounded-xl px-3 py-2.5 flex flex-col items-center text-center gap-1 transition-colors group"
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span className="text-white text-xs font-semibold">{lang.code.toUpperCase()}</span>
                  <span className={`text-slate-400 text-xs ${lang.rtl ? 'direction-rtl' : ''}`}>{lang.label}</span>
                  <span className="text-xs text-indigo-400 mt-0.5">⬇ .srt</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Human Scene Storyboard ─────────────────────────────────────────────── */}
      <div className="py-10 px-4 bg-slate-900/40 border-y border-slate-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-1">Human Footage — Scene Breakdown</h2>
          <p className="text-slate-400 text-sm mb-6">6 scenes · 58 seconds · real people · global talent · multiple sectors</p>
          <div className="space-y-4">
            {HUMAN_SCENES.map((scene) => (
              <div key={scene.num} className={`rounded-xl bg-gradient-to-r ${scene.bg} border border-white/10 overflow-hidden`}>
                <div className="px-5 py-3 border-b border-white/10 flex items-center gap-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${scene.badge}`}>{scene.num}</span>
                  <span className="text-white font-semibold text-sm">{scene.title}</span>
                  <span className={`ml-auto text-xs font-mono ${scene.accent} opacity-70`}>{scene.time}</span>
                </div>
                <div className="grid md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/10">
                  <div className="px-4 py-3">
                    <div className={`text-xs font-semibold uppercase tracking-wider mb-1.5 ${scene.accent} opacity-60`}>Visual</div>
                    <p className="text-slate-300 text-xs leading-relaxed">{scene.visual}</p>
                  </div>
                  <div className="px-4 py-3">
                    <div className={`text-xs font-semibold uppercase tracking-wider mb-1.5 ${scene.accent} opacity-60`}>On-Screen Text</div>
                    <div className="space-y-1">
                      {scene.text.map((line, j) => (
                        <div key={j} className="text-white text-xs font-medium bg-black/20 rounded px-2 py-0.5">{line}</div>
                      ))}
                    </div>
                  </div>
                  <div className="px-4 py-3">
                    <div className={`text-xs font-semibold uppercase tracking-wider mb-1.5 ${scene.accent} opacity-60`}>Source Clips</div>
                    <div className="space-y-1">
                      {scene.clips.map((clip, j) => (
                        <div key={j} className="text-slate-400 text-xs font-mono bg-black/20 rounded px-2 py-0.5">{clip}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 2 — Technical Draft v1 (Slide Video)
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="py-10 px-4">
        <div className="max-w-5xl mx-auto">

          <div className="mb-6 flex items-center gap-3">
            <h2 className="text-lg font-bold text-white">Technical Draft — v1</h2>
            <span className="text-xs px-2.5 py-0.5 bg-slate-800 text-slate-400 border border-slate-700 rounded-full font-semibold">
              SLIDE VIDEO · NOT FINAL
            </span>
          </div>

          <div className="mb-4 bg-slate-900/80 border border-slate-700/60 rounded-xl px-4 py-3 text-xs text-slate-400">
            ⚠️ This is a technical slide-based draft generated with automated tooling for development and testing purposes.
            It uses a synthetic voice (macOS Samantha TTS) and animated text slides — not real human footage.
            The human footage version above will replace this as the primary version once licensed clips are available.
          </div>

          <div className="bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              controls
              width="100%"
              height="auto"
              preload="metadata"
              className="w-full aspect-video bg-black"
            >
              <source src="/promo-video/corridorwork-promo-en.mp4" type="video/mp4" />
              <track kind="subtitles" src="/promo-video/subtitles/corridorwork-promo-en.srt"  srcLang="en"  label="English"   default />
              <track kind="subtitles" src="/promo-video/subtitles/corridorwork-promo-de.srt"  srcLang="de"  label="Deutsch" />
              <track kind="subtitles" src="/promo-video/subtitles/corridorwork-promo-fr.srt"  srcLang="fr"  label="Français" />
              <track kind="subtitles" src="/promo-video/subtitles/corridorwork-promo-ar.srt"  srcLang="ar"  label="العربية" />
              <track kind="subtitles" src="/promo-video/subtitles/corridorwork-promo-es.srt"  srcLang="es"  label="Español" />
              <track kind="subtitles" src="/promo-video/subtitles/corridorwork-promo-pt.srt"  srcLang="pt"  label="Português" />
              <track kind="subtitles" src="/promo-video/subtitles/corridorwork-promo-hi.srt"  srcLang="hi"  label="हिंदी" />
              <track kind="subtitles" src="/promo-video/subtitles/corridorwork-promo-ur.srt"  srcLang="ur"  label="اردو" />
              <track kind="subtitles" src="/promo-video/subtitles/corridorwork-promo-fil.srt" srcLang="fil" label="Filipino" />
              <track kind="subtitles" src="/promo-video/subtitles/corridorwork-promo-tr.srt"  srcLang="tr"  label="Türkçe" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="mt-3 flex flex-wrap gap-3 justify-center">
            {['🎬 H264 1280×720', '🔊 TTS Draft Audio', '⏱ 52 seconds', '📝 10 subtitle languages', '⚠️ Not final version'].map(item => (
              <span key={item} className="text-xs px-3 py-1 bg-slate-800/80 border border-slate-700/60 rounded-full text-slate-400">
                {item}
              </span>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            <a href="/promo-video/corridorwork-promo-en.mp4" download
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg font-medium transition-colors">
              ⬇ Download Draft MP4 (with TTS audio)
            </a>
            <a href="/promo-video/corridorwork-promo-en-noaudio.mp4" download
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm rounded-lg font-medium transition-colors">
              ⬇ Download Draft MP4 (video-only)
            </a>
          </div>
        </div>
      </div>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <div className="py-12 px-4 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 border-t border-indigo-900/40">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Interested in CorridorWork?</h2>
          <p className="text-indigo-200 text-sm mb-6">No commitment. No automatic emails. No Stripe. No fake revenue claims.</p>
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
            CorridorWork · corridorwork.com · No job guarantee · No visa guarantee · No fake revenue claims
          </p>
        </div>
      </div>

      <PublicFooter />
    </div>
  )
}
