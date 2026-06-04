import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import { PublicNavBar } from '@/app/_components/PublicNavBar'
import { PublicFooter } from '@/app/_components/PublicFooter'

export const dynamic = 'force-dynamic'

type CorridorDetail = {
  source_country: string
  target_country: string
  sector: string
  opportunity_score: number
  supply_score: number
  demand_score: number
  priority_level: string | null
}

type CorridorIntelligenceDetail = {
  top_professions: string[]
  language_requirements: Record<string, unknown>
  visa_pathways: unknown[]
  demand_level: number
  migration_difficulty: number
  notes: string | null
}

type LandingpageFull = {
  id: string
  slug: string
  title: string
  language: string
  source_country: string | null
  target_country: string | null
  profession_focus: string | null
  seo_title: string | null
  seo_description: string | null
  opportunity_score: number
  priority_level: string | null
  status: string
  migration_corridors: CorridorDetail | null
}

type MigrationIntelligenceDetail = {
  visa_complexity: number
  recognition_complexity: number
  language_complexity: number
  document_complexity: number
  estimated_success_score: number
  risk_level: string
  required_documents: Record<string, unknown> | null
  language_requirements: Record<string, string> | null
  recognition_steps: string[] | null
  visa_pathways: string[] | null
  recommended_next_steps: string[] | null
  disclaimer: string | null
  status: string
}

// ─── generateMetadata ─────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('landingpage_factory')
    .select('seo_title, seo_description, slug, language, source_country, target_country')
    .eq('slug', params.slug)
    .single()

  if (!data) {
    return { title: 'Karriere-Korridor | Global Talent Bridge' }
  }

  const seoTitle = data.seo_title ?? `Jobs ${data.target_country ?? ''} | Global Talent Bridge`
  const seoDesc  = data.seo_description ?? `International career opportunities via Global Talent Bridge.`

  return {
    title: seoTitle,
    description: seoDesc,
    alternates: {
      canonical: `https://global-talent-bridge.vercel.app/corridors/${data.slug}`,
    },
    openGraph: {
      title: seoTitle,
      description: seoDesc,
      type: 'website',
      url: `https://global-talent-bridge.vercel.app/corridors/${data.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDesc,
    },
    robots: {
      index:  true,
      follow: true,
    },
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const LANG_LABELS: Record<string, string> = {
  en: 'English', de: 'Deutsch', fr: 'Français', tr: 'Türkçe', pt: 'Português', ar: 'العربية',
}

const LANG_FLAGS: Record<string, string> = {
  en: '🇬🇧', de: '🇩🇪', fr: '🇫🇷', tr: '🇹🇷', pt: '🇧🇷', ar: '🇲🇦',
}

function ScoreMeter({ label, score, color }: { label: string; score: number; color: string }) {
  const colorMap: Record<string, string> = {
    green: 'bg-green-500', blue: 'bg-blue-500', orange: 'bg-orange-500', red: 'bg-red-500',
  }
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>{label}</span>
        <span className="font-mono font-medium text-white">{score}/100</span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${colorMap[color] ?? colorMap.blue} transition-all`}
          style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
        />
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CorridorLandingPage(
  { params }: { params: { slug: string } }
) {
  const supabase = createAdminClient()

  // Load the landingpage — allow draft/ready/approved/published (admin uses this too)
  const { data: lpData, error: lpErr } = await supabase
    .from('landingpage_factory')
    .select(`
      id, slug, title, language, source_country, target_country,
      profession_focus, seo_title, seo_description, opportunity_score, priority_level, status,
      migration_corridors(source_country, target_country, sector, opportunity_score, supply_score, demand_score, priority_level)
    `)
    .eq('slug', params.slug)
    .single()

  if (lpErr || !lpData) notFound()

  const lp = lpData as unknown as LandingpageFull
  const corridor = lp.migration_corridors

  // Load corridor intelligence if available
  let ci: CorridorIntelligenceDetail | null = null
  let mi: MigrationIntelligenceDetail | null = null

  if (corridor) {
    const { data: corridorRows } = await supabase
      .from('migration_corridors')
      .select('id')
      .eq('source_country', corridor.source_country)
      .eq('target_country', corridor.target_country)
      .single()

    if (corridorRows?.id) {
      const [ciResult, miResult] = await Promise.all([
        supabase
          .from('corridor_intelligence')
          .select('top_professions, language_requirements, visa_pathways, demand_level, migration_difficulty, notes')
          .eq('corridor_id', corridorRows.id)
          .single(),
        supabase
          .from('migration_intelligence')
          .select('visa_complexity, recognition_complexity, language_complexity, document_complexity, estimated_success_score, risk_level, required_documents, language_requirements, recognition_steps, visa_pathways, recommended_next_steps, disclaimer, status')
          .eq('corridor_id', corridorRows.id)
          .in('status', ['reviewed', 'approved'])
          .single(),
      ])

      if (ciResult.data) ci = ciResult.data as CorridorIntelligenceDetail
      if (miResult.data) mi = miResult.data as MigrationIntelligenceDetail
    }
  }

  const langLabel = LANG_LABELS[lp.language] ?? lp.language
  const langFlag  = LANG_FLAGS[lp.language] ?? '🌐'
  const professions = ci?.top_professions ?? lp.profession_focus?.split(',').map((p) => p.trim()) ?? []

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <PublicNavBar />

      {/* Hero */}
      <section className="px-4 pt-16 pb-10 text-center">
        <div className="max-w-3xl mx-auto">
          {/* Language + corridor badge */}
          <div className="flex justify-center gap-2 mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-violet-900/40 border border-violet-700/50 text-violet-300 text-xs font-medium">
              {langFlag} {langLabel}
            </span>
            {corridor && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-900/40 border border-blue-700/50 text-blue-300 text-xs font-medium">
                🌍 {corridor.source_country} → {corridor.target_country}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            {lp.title}
          </h1>

          {lp.seo_description && (
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              {lp.seo_description}
            </p>
          )}

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth/register"
              className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              🚀 Kostenloses Profil erstellen
            </Link>
            <Link
              href="/jobs"
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold rounded-xl transition-colors text-sm"
            >
              💼 Jobs ansehen
            </Link>
          </div>
        </div>
      </section>

      {/* Scores section */}
      {corridor && (
        <section className="px-4 py-8 max-w-4xl mx-auto w-full">
          <h2 className="text-lg font-bold text-white mb-4">📊 Korridor-Analyse</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-violet-300">{corridor.opportunity_score}</div>
              <div className="text-xs text-gray-400 mt-1">Opportunity Score</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-blue-300">{corridor.demand_score}</div>
              <div className="text-xs text-gray-400 mt-1">Nachfrage (Arbeitgeber)</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-green-300">{corridor.supply_score}</div>
              <div className="text-xs text-gray-400 mt-1">Angebot (Kandidaten)</div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
            <ScoreMeter label="Gesamtchance" score={corridor.opportunity_score} color="green" />
            <ScoreMeter label="Arbeitgeber-Nachfrage" score={corridor.demand_score} color="blue" />
            {ci && (
              <>
                <ScoreMeter label="Nachfrage-Niveau (CI)" score={ci.demand_level} color="orange" />
                <ScoreMeter
                  label="Migrationsschwierigkeit"
                  score={ci.migration_difficulty}
                  color="red"
                />
              </>
            )}
          </div>
        </section>
      )}

      {/* Professions section */}
      {professions.length > 0 && (
        <section className="px-4 py-8 max-w-4xl mx-auto w-full">
          <h2 className="text-lg font-bold text-white mb-4">💼 Gesuchte Berufe</h2>
          <div className="flex flex-wrap gap-2">
            {professions.map((prof, i) => (
              <span
                key={i}
                className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200"
              >
                {prof}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Visa pathways */}
      {ci && Array.isArray(ci.visa_pathways) && ci.visa_pathways.length > 0 && (
        <section className="px-4 py-8 max-w-4xl mx-auto w-full">
          <h2 className="text-lg font-bold text-white mb-4">🛂 Visa-Wege</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <ul className="space-y-2">
              {(ci.visa_pathways as string[]).map((path, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-violet-400 shrink-0 mt-0.5">→</span>
                  {path}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Language requirements */}
      {ci && ci.language_requirements && Object.keys(ci.language_requirements).length > 0 && (
        <section className="px-4 py-8 max-w-4xl mx-auto w-full">
          <h2 className="text-lg font-bold text-white mb-4">🗣️ Sprachanforderungen</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex flex-wrap gap-3">
              {Object.entries(ci.language_requirements).map(([lang, level]) => (
                <div key={lang} className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg">
                  <span className="text-xs text-gray-400">{lang}</span>
                  <div className="text-sm font-semibold text-white">{String(level)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Migration Intelligence Section ─────────────────────────────────── */}
      {mi && (
        <section className="px-4 py-8 max-w-4xl mx-auto w-full space-y-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-white">🛂 Migrations-Orientierung</h2>
            <span
              className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                mi.risk_level === 'low'      ? 'bg-green-900/30 text-green-300 border-green-800/30' :
                mi.risk_level === 'medium'   ? 'bg-yellow-900/30 text-yellow-300 border-yellow-800/30' :
                mi.risk_level === 'high'     ? 'bg-orange-900/30 text-orange-300 border-orange-800/30' :
                'bg-red-900/30 text-red-300 border-red-800/30'
              }`}
            >
              Risiko: {mi.risk_level}
            </span>
          </div>

          {/* Success probability */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-300 font-medium">Erfolgswahrscheinlichkeit (Orientierung)</span>
              <span className={`text-xl font-bold ${
                mi.estimated_success_score >= 80 ? 'text-green-300' :
                mi.estimated_success_score >= 60 ? 'text-yellow-300' :
                mi.estimated_success_score >= 40 ? 'text-orange-300' :
                'text-red-300'
              }`}>
                {mi.estimated_success_score}%
              </span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  mi.estimated_success_score >= 80 ? 'bg-green-500' :
                  mi.estimated_success_score >= 60 ? 'bg-yellow-500' :
                  mi.estimated_success_score >= 40 ? 'bg-orange-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${mi.estimated_success_score}%` }}
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {[
                { label: 'Visa-Komplexität', value: mi.visa_complexity },
                { label: 'Anerkennungs-Aufwand', value: mi.recognition_complexity },
                { label: 'Sprachanforderung', value: mi.language_complexity },
                { label: 'Dokumentenaufwand', value: mi.document_complexity },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <div className={`text-lg font-bold ${value >= 70 ? 'text-red-300' : value >= 50 ? 'text-orange-300' : 'text-green-300'}`}>
                    {value}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Required Documents */}
          {mi.required_documents && typeof mi.required_documents === 'object' && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">📄 Typische Dokumente</h3>
              <div className="space-y-2">
                {Object.entries(mi.required_documents as Record<string, string>).map(([key, value]) => (
                  <div key={key} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-teal-400 shrink-0 mt-0.5">→</span>
                    <span><span className="text-gray-400 font-medium">{key}:</span> {value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recognition Steps */}
          {Array.isArray(mi.recognition_steps) && mi.recognition_steps.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">🎓 Anerkennungsschritte</h3>
              <ol className="space-y-2">
                {mi.recognition_steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-teal-900/50 border border-teal-700/50 text-teal-300 text-xs flex items-center justify-center font-bold mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Visa Pathways from MI */}
          {Array.isArray(mi.visa_pathways) && mi.visa_pathways.length > 0 && !ci?.visa_pathways && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">🛂 Typische Visa-Wege</h3>
              <ul className="space-y-2">
                {mi.visa_pathways.map((path, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-teal-400 shrink-0 mt-0.5">→</span>
                    {path}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Language Requirements from MI */}
          {mi.language_requirements && Object.keys(mi.language_requirements).length > 0 && !ci?.language_requirements && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">🗣️ Sprachanforderungen (Orientierung)</h3>
              <div className="flex flex-wrap gap-3">
                {Object.entries(mi.language_requirements).map(([lang, level]) => (
                  <div key={lang} className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg">
                    <span className="text-xs text-gray-400">{lang}</span>
                    <div className="text-sm font-semibold text-white">{String(level)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Next Steps */}
          {Array.isArray(mi.recommended_next_steps) && mi.recommended_next_steps.length > 0 && (
            <div className="bg-gray-900 border border-teal-800/30 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-teal-300 mb-3">💡 Empfohlene nächste Schritte</h3>
              <ul className="space-y-2">
                {mi.recommended_next_steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-teal-400 shrink-0 mt-0.5">✓</span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Disclaimer */}
          <div className="bg-yellow-900/10 border border-yellow-800/30 rounded-xl p-4 flex items-start gap-3">
            <span className="text-yellow-400 shrink-0">⚠️</span>
            <p className="text-yellow-200/70 text-xs leading-relaxed">
              {mi.disclaimer ??
                'Diese Informationen sind algorithmisch berechnet und dienen ausschließlich zur allgemeinen Orientierung. Keine Rechtsberatung. Keine Garantien. Alle Angaben ohne Gewähr. Für individuelle Beratung bitte lokale Migrations- und Anerkennungsexperten hinzuziehen.'}
            </p>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="px-4 py-10 max-w-4xl mx-auto w-full">
        <h2 className="text-lg font-bold text-white mb-6">⚙️ Wie funktioniert es?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: '1', icon: '👤', title: 'Profil erstellen', desc: 'Kostenlos registrieren und berufliche Qualifikationen angeben.' },
            { step: '2', icon: '🎯', title: 'Matching erhalten', desc: 'Strukturiertes Matching mit Arbeitgebern im Zielland — transparent und nachvollziehbar.' },
            { step: '3', icon: '🚀', title: 'Prozess starten', desc: 'Visa-Wege, Anerkennung von Abschlüssen und direkter Kontakt mit genehmigenden Arbeitgebern.' },
          ].map(({ step, icon, title, desc }) => (
            <div key={step} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{icon}</span>
                <span className="text-xs text-gray-500 font-mono">Schritt {step}</span>
              </div>
              <h3 className="font-semibold text-white text-sm mb-1">{title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-12 text-center">
        <div className="max-w-xl mx-auto bg-gradient-to-r from-violet-900/30 to-blue-900/30 border border-violet-800/40 rounded-2xl p-8">
          <div className="text-4xl mb-4">🌍</div>
          <h2 className="text-xl font-bold text-white mb-3">
            Bereit für deine internationale Karriere?
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Registriere dich kostenlos. Erstelle dein Profil. Finde Arbeitgeber, die aktiv internationale Fachkräfte suchen.
          </p>
          <Link
            href="/auth/register"
            className="inline-block px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-colors"
          >
            Jetzt kostenlos starten →
          </Link>
          <p className="text-xs text-gray-600 mt-4">
            Keine versteckten Kosten. Keine automatischen Zahlungen. Kein Spam.
          </p>
        </div>
      </section>

      {/* Status notice for non-published pages */}
      {lp.status !== 'published' && (
        <div className="fixed bottom-4 right-4 bg-yellow-900/90 border border-yellow-700 text-yellow-300 text-xs px-3 py-2 rounded-lg">
          ⚠️ Vorschau — Status: {lp.status}
        </div>
      )}

      <PublicFooter />
    </div>
  )
}
