import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicNavBar } from '@/app/_components/PublicNavBar'
import { PublicFooter } from '@/app/_components/PublicFooter'

export const metadata: Metadata = {
  title: 'About CorridorWork',
  description:
    'CorridorWork connects qualified international professionals with employers — structured, transparent and honest. Learn about our mission and approach.',
  openGraph: {
    title: 'About CorridorWork',
    description: 'Structured international talent matching for employers, candidates and partners.',
    type: 'website',
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <PublicNavBar />

      <div className="max-w-3xl mx-auto px-6 py-16 flex-1 space-y-12">

        {/* Header */}
        <div className="text-center">
          <p className="text-indigo-400 text-xs font-bold tracking-[0.18em] uppercase mb-5">
            About
          </p>
          <h1 className="text-4xl font-bold text-white mb-4">
            About CorridorWork
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            A structured platform connecting international talent with employers —
            transparent, consent-based and honest about what we are and what we are not.
          </p>
        </div>

        {/* Mission */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Our mission</h2>
          <p className="text-slate-400 leading-relaxed mb-4">
            Qualified professionals from around the world are looking for opportunities
            in Europe and beyond. At the same time, employers are looking for international
            talent with specific language skills and sector experience.
          </p>
          <p className="text-slate-400 leading-relaxed">
            CorridorWork creates a structured connection: candidates register their profile
            once — sector, experience, language level. Employers define clear requirements.
            The system calculates a transparent matching score. No guesswork, no hidden criteria.
          </p>
        </div>

        {/* What we are */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">What we are</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              'A matching platform for international professionals and employers',
              'A structured system with a transparent score (0–100)',
              'Free for candidates — always',
              'GDPR-compliant with EU data storage',
              'An honest MVP — we do not promise what does not exist yet',
              'A growing platform with a clear roadmap',
            ].map((text) => (
              <div key={text} className="flex items-start gap-3 p-4 bg-slate-900 border border-slate-800 rounded-xl">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                <p className="text-slate-300 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What we are not */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">What we are not</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              'Not a traditional job board with public application forms',
              'Not a headhunter or staffing agency',
              'Not a platform with fake client logos or fabricated numbers',
              'No automated email campaigns or spam',
              'No payment processing (not yet active — MVP phase)',
            ].map((text) => (
              <div key={text} className="flex items-start gap-3 p-4 bg-slate-900 border border-slate-800 rounded-xl">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0 mt-1.5" />
                <p className="text-slate-400 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Focus */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Our focus</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-1.5 h-6 bg-indigo-500 rounded-full shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-semibold mb-1.5">International talent</p>
                <p className="text-slate-400 text-sm leading-relaxed">
                  We focus on professionals crossing borders. German and English proficiency
                  are key matching criteria because they are central requirements for international roles.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-1.5 h-6 bg-emerald-500 rounded-full shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-semibold mb-1.5">Structured data over CV chaos</p>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Instead of parsing unstructured PDFs, we capture structured attributes:
                  sector, years of experience, language level. That makes matching possible and comparable.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-1.5 h-6 bg-amber-500 rounded-full shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-semibold mb-1.5">Both sides benefit</p>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Candidates save time by not applying to poorly-defined roles.
                  Employers save time by not reviewing irrelevant applications.
                  The system works for both.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* MVP Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-3">Platform status — MVP phase</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-3">
            CorridorWork is in the MVP phase (Minimum Viable Product). Core features —
            profile, matching, job management, candidate matches — are fully operational and live.
          </p>
          <p className="text-slate-500 text-sm leading-relaxed">
            Features in preparation: Stripe payments, AI-assisted matching, direct candidate contact,
            team access. These are on the roadmap but not yet active. We do not promise
            what is not ready.
          </p>
        </div>

        {/* Operated by */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-3">Operated by</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            CorridorWork is operated by{' '}
            <span className="text-white">Delta Translation</span>,
            Karlsruhe, Germany.
          </p>
          <div className="mt-4 flex gap-4">
            <Link href="/legal/impressum" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
              Legal notice →
            </Link>
            <Link href="/contact" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
              Contact →
            </Link>
          </div>
        </div>

      </div>

      <PublicFooter />
    </div>
  )
}
