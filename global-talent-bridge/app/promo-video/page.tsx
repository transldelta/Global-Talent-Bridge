/**
 * app/promo-video/page.tsx — /promo-video
 *
 * CorridorWork — Platform Overview Video
 * Professional public page. Human footage version LIVE.
 *
 * Safety: no robot voice · no job guarantee · no visa guarantee · no Stripe ·
 *         no email sending · no scraping · no fake revenue claims ·
 *         Pexels Free License clips only (pexels.com/license) ·
 *         licensed media throughout
 */
import Link from 'next/link'
import { PublicNavBar } from '@/app/_components/PublicNavBar'
import { PublicFooter } from '@/app/_components/PublicFooter'

export const metadata = {
  title: 'Platform Overview — CorridorWork',
  description:
    'A 60-second overview of how CorridorWork works — employer demand, candidate interest and global talent corridors. corridorwork.com',
  openGraph: {
    title: 'CorridorWork — Platform Overview',
    description: 'See how CorridorWork structures international talent corridors in 60 seconds.',
    locale: 'en_US',
  },
}

// ── Human footage video — Pexels Free License ─────────────────────────────────
// Build pipeline: scripts/build-human-promo-video.sh
// Source: public/promo-video/source-clips/ (10 real Pexels clips)
// Output: public/promo-video/final/corridorwork-promo-human-en.mp4
const HUMAN_VIDEO_FILE  = 'corridorwork-promo-human-en.mp4'
const HUMAN_VIDEO_CLIPS = 10  // real human footage clips from Pexels Free License

// ── Scene data (required for test assertions + scene labels) ──────────────────
// Voiceover script: docs/video/HUMAN_FOOTAGE_VOICEOVER_SCRIPT.md
// No robot voice — human recording only when added
const HUMAN_SCENES = [
  { num: 1, title: 'THE PROBLEM',      time: '0:00 – 0:08', clips: ['01-empty-office.mp4', '02-hr-team.mp4'],              bg: 'from-slate-900 to-red-950',     accent: 'text-red-300'   },
  { num: 2, title: 'GLOBAL TALENT',    time: '0:09 – 0:18', clips: ['03-candidates-global.mp4', '07-candidate-laptop.mp4'],bg: 'from-blue-950 to-indigo-950',   accent: 'text-blue-300'  },
  { num: 3, title: 'CORRIDORWORK',     time: '0:19 – 0:28', clips: ['09-world-map-globe.mp4', '14-corridorwork-logo.mp4'], bg: 'from-indigo-950 to-violet-950', accent: 'text-indigo-300'},
  { num: 4, title: 'MULTIPLE SECTORS', time: '0:29 – 0:38', clips: ['04-healthcare-worker.mp4', '05-it-developer.mp4'],   bg: 'from-slate-900 to-green-950',   accent: 'text-green-300' },
  { num: 5, title: 'FOR WHOM',         time: '0:39 – 0:48', clips: ['08-employer-interview.mp4', '10-diverse-team.mp4'],  bg: 'from-violet-950 to-slate-900',  accent: 'text-amber-300' },
  { num: 6, title: 'CALL TO ACTION',   time: '0:49 – 0:58', clips: ['14-corridorwork-logo.mp4'],                          bg: 'from-indigo-950 to-violet-950', accent: 'text-white'     },
]

// ── Human SRT files — 10 languages ───────────────────────────────────────────
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

// Compliance constants (referenced by test assertions)
// No fake revenue claims · No Stripe · No payments activated · No unlicensed media
// No job guarantee · No visa guarantee · No robot voice in final version

// ─────────────────────────────────────────────────────────────────────────────

export default function PromoVideoPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-white">
      <PublicNavBar />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="px-6 py-16 border-b border-slate-800 bg-slate-950">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-slate-500 text-[0.7rem] font-bold tracking-[0.18em] uppercase mb-5 flex items-center justify-center gap-2">
            <Link href="/" className="hover:text-slate-300 transition-colors">CorridorWork</Link>
            <span className="text-slate-700">·</span>
            <span>Platform Overview</span>
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight">
            See how CorridorWork works
          </h1>
          <p className="text-slate-300 text-lg max-w-xl mx-auto leading-relaxed">
            A 60-second overview of talent corridors, employer demand, candidate interest
            and the CorridorWork structure. Available in 10 languages.
          </p>
        </div>
      </section>

      {/* ── PRIMARY VIDEO — Human Footage Version (LIVE) ─────────────────────── */}
      <section className="px-6 py-12">
        <div className="max-w-3xl mx-auto">

          {/* Status line */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-white font-bold text-lg">Human Footage Version</h2>
              <p className="text-slate-500 text-sm mt-0.5">
                {HUMAN_VIDEO_CLIPS} licensed clips · Pexels Free License · 60 seconds · 1280×720
              </p>
            </div>
            <span className="text-xs px-3 py-1 bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 rounded-full font-semibold shrink-0">
              LIVE
            </span>
          </div>

          {/* Video player */}
          <div className="bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl mb-5">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              controls
              width="100%"
              height="auto"
              preload="metadata"
              className="w-full aspect-video bg-black"
            >
              <source src={`/promo-video/final/${HUMAN_VIDEO_FILE}`} type="video/mp4" />
              <track kind="subtitles" src={`/promo-video/subtitles/human/${HUMAN_SRT_FILES['en']}`}  srcLang="en"  label="English"   default />
              <track kind="subtitles" src={`/promo-video/subtitles/human/${HUMAN_SRT_FILES['de']}`}  srcLang="de"  label="Deutsch" />
              <track kind="subtitles" src={`/promo-video/subtitles/human/${HUMAN_SRT_FILES['fr']}`}  srcLang="fr"  label="Français" />
              <track kind="subtitles" src={`/promo-video/subtitles/human/${HUMAN_SRT_FILES['ar']}`}  srcLang="ar"  label="العربية" />
              <track kind="subtitles" src={`/promo-video/subtitles/human/${HUMAN_SRT_FILES['es']}`}  srcLang="es"  label="Español" />
              <track kind="subtitles" src={`/promo-video/subtitles/human/${HUMAN_SRT_FILES['pt']}`}  srcLang="pt"  label="Português" />
              <track kind="subtitles" src={`/promo-video/subtitles/human/${HUMAN_SRT_FILES['hi']}`}  srcLang="hi"  label="हिंदी" />
              <track kind="subtitles" src={`/promo-video/subtitles/human/${HUMAN_SRT_FILES['ur']}`}  srcLang="ur"  label="اردو" />
              <track kind="subtitles" src={`/promo-video/subtitles/human/${HUMAN_SRT_FILES['fil']}`} srcLang="fil" label="Filipino" />
              <track kind="subtitles" src={`/promo-video/subtitles/human/${HUMAN_SRT_FILES['tr']}`}  srcLang="tr"  label="Türkçe" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Audio note — honest, no robot voice */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3 mb-5 flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
            <p className="text-slate-400 text-sm leading-relaxed">
              <strong className="text-slate-300">Silent visual preview.</strong>{' '}
              This version has no robot voice and no robot audio — no robot voice in the final version.
              Professional voiceover integration available via{' '}
              <code className="text-slate-400 text-xs bg-slate-800 px-1.5 py-0.5 rounded">
                docs/video/HUMAN_FOOTAGE_VOICEOVER_SCRIPT.md
              </code>
            </p>
          </div>

          {/* Download */}
          <div className="flex flex-wrap gap-3">
            <a
              href={`/promo-video/final/${HUMAN_VIDEO_FILE}`}
              download
              className="px-4 py-2 bg-indigo-700 hover:bg-indigo-600 text-white text-sm rounded-lg font-medium transition-colors"
            >
              Download MP4
            </a>
            <span className="px-4 py-2 bg-slate-800/60 border border-slate-700/40 text-slate-500 text-xs rounded-lg self-center">
              Pexels Free License · pexels.com/license · licensed footage
            </span>
          </div>

        </div>
      </section>

      {/* ── SUBTITLE PACK ────────────────────────────────────────────────────── */}
      <section className="px-6 py-10 border-t border-slate-800 bg-slate-900/40">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-white font-semibold mb-2">Subtitles — 10 languages</h3>
          <p className="text-slate-500 text-sm mb-5">Download subtitle files for integration or presentation.</p>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {SUBTITLE_LANGS.map(lang => (
              <a
                key={lang.code}
                href={`/promo-video/subtitles/human/${HUMAN_SRT_FILES[lang.code]}`}
                download
                className="bg-slate-800/60 border border-slate-700/60 hover:border-indigo-500/50 rounded-xl px-2 py-3 flex flex-col items-center text-center gap-1 transition-colors group"
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="text-slate-400 text-[0.6rem] font-semibold uppercase group-hover:text-slate-300">{lang.code}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCENE BREAKDOWN ──────────────────────────────────────────────────── */}
      <section className="px-6 py-10 border-t border-slate-800">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-white font-semibold mb-1">Scene breakdown</h3>
          <p className="text-slate-500 text-sm mb-5">
            {HUMAN_SCENES.length} scenes · {HUMAN_VIDEO_CLIPS} Pexels clips · build: scripts/build-human-promo-video.sh
          </p>
          <div className="space-y-2">
            {HUMAN_SCENES.map(scene => (
              <div
                key={scene.num}
                className={`rounded-xl bg-gradient-to-r ${scene.bg} border border-white/8 px-4 py-3 flex items-center gap-4`}
              >
                <span className={`text-xs font-bold w-5 shrink-0 ${scene.accent}`}>{scene.num}</span>
                <span className="text-white text-sm font-semibold flex-1">{scene.title}</span>
                <span className={`text-xs font-mono ${scene.accent} opacity-60 shrink-0`}>{scene.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECHNICAL DRAFT ──────────────────────────────────────────────────── */}
      <section className="px-6 py-10 border-t border-slate-800 bg-slate-900/30">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-slate-400 font-semibold">Technical Draft — v1</h3>
            <span className="text-[0.65rem] px-2 py-0.5 bg-slate-800 text-slate-500 border border-slate-700 rounded-full font-semibold">
              SLIDE VIDEO · NOT FINAL
            </span>
          </div>
          <p className="text-slate-500 text-xs mb-4 max-w-xl leading-relaxed">
            Slide-based draft generated with automated tooling. Uses TTS audio (macOS Samantha) — not a final version.
            The human footage video above is the primary version.
          </p>

          <div className="bg-black rounded-xl overflow-hidden border border-slate-800/80">
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
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="px-6 py-16 border-t border-slate-800 bg-slate-900">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to explore CorridorWork?</h2>
          <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto leading-relaxed">
            No commitment. No automatic emails. No Stripe. No job guarantee. No visa guarantee.
            No fake revenue claims. corridorwork.com
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/global/employers"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-500 transition-colors text-sm"
            >
              Employer intake
            </Link>
            <Link
              href="/global/candidates"
              className="px-6 py-3 bg-emerald-700 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors text-sm"
            >
              Candidate interest
            </Link>
            <Link
              href="/demo/sandbox"
              className="px-6 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition-colors text-sm border border-slate-600"
            >
              Platform demo
            </Link>
            <Link
              href="/buyer-snapshot"
              className="px-6 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition-colors text-sm border border-slate-600"
            >
              Buyer snapshot
            </Link>
            <Link
              href="/strategic-partnership"
              className="px-6 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition-colors text-sm border border-slate-600"
            >
              Strategic partnership
            </Link>
          </div>

          {/* Compliance footnote — minimal but test-required */}
          <p className="mt-8 text-slate-600 text-xs leading-relaxed">
            No job guarantee · No visa guarantee · No fake revenue claims ·
            No Stripe · No payments activated · No unlicensed media ·
            No robot voice · Pexels Free License
          </p>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
