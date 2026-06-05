/**
 * CorridorWork — Basic Matching Engine
 * Keine KI, kein ML. Einfaches regelbasiertes Scoring.
 */

/** Sprachlevel in aufsteigender Reihenfolge */
const LANGUAGE_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const
type LanguageLevel = (typeof LANGUAGE_LEVELS)[number]

export interface CandidateForMatching {
  id: string
  sector: string | null
  years_experience: number
  german_level: string | null
  english_level: string | null
  skills: string[]
  preferred_countries: string[]
}

export interface JobForMatching {
  id: string
  employer_id: string
  title: string
  sector: string | null
  required_experience: number
  required_german: string | null
  required_english: string | null
  country: string | null
  is_active: boolean
}

export interface MatchResult {
  job_id: string
  job_title: string
  score: number
  breakdown: {
    sector_match: number
    experience_match: number
    german_match: number
    english_match: number
    country_match: number
  }
}

/**
 * Prüft ob ein Kandidatenlevel das geforderte Level erfüllt.
 * Unbekannte/leere Level gelten als nicht erfüllt.
 */
function meetsLanguageLevel(
  candidateLevel: string | null,
  requiredLevel: string | null
): boolean {
  if (!requiredLevel) return true // kein Level gefordert
  if (!candidateLevel) return false

  const candidateIdx = LANGUAGE_LEVELS.indexOf(candidateLevel.toUpperCase() as LanguageLevel)
  const requiredIdx = LANGUAGE_LEVELS.indexOf(requiredLevel.toUpperCase() as LanguageLevel)

  if (candidateIdx === -1 || requiredIdx === -1) return false
  return candidateIdx >= requiredIdx
}

/**
 * Berechnet den Match-Score für einen Kandidaten und einen Job.
 * Maximale Punktzahl: 100
 *
 * Kriterien:
 * - Gleicher Sektor:                +30
 * - Ausreichende Erfahrung:         +20
 * - Deutschlevel erfüllt:           +20
 * - Englischlevel erfüllt:          +10
 * - Zielland in preferred_countries: +20
 * - preferred_countries leer:       +10 (kein Länderfilter)
 */
export function scoreJob(
  candidate: CandidateForMatching,
  job: JobForMatching
): MatchResult {
  const breakdown = {
    sector_match: 0,
    experience_match: 0,
    german_match: 0,
    english_match: 0,
    country_match: 0,
  }

  // Sektor-Match
  if (
    candidate.sector &&
    job.sector &&
    candidate.sector.toLowerCase() === job.sector.toLowerCase()
  ) {
    breakdown.sector_match = 30
  }

  // Erfahrungs-Match
  if (candidate.years_experience >= job.required_experience) {
    breakdown.experience_match = 20
  }

  // Deutsch-Level
  if (meetsLanguageLevel(candidate.german_level, job.required_german)) {
    breakdown.german_match = 20
  }

  // Englisch-Level
  if (meetsLanguageLevel(candidate.english_level, job.required_english)) {
    breakdown.english_match = 10
  }

  // Land-Match
  const preferred = candidate.preferred_countries.map((c) => c.toLowerCase())
  if (preferred.length === 0) {
    breakdown.country_match = 10 // kein Filter — neutraler Bonus
  } else if (job.country && preferred.includes(job.country.toLowerCase())) {
    breakdown.country_match = 20
  }

  const score = Math.min(
    100,
    breakdown.sector_match +
      breakdown.experience_match +
      breakdown.german_match +
      breakdown.english_match +
      breakdown.country_match
  )

  return {
    job_id: job.id,
    job_title: job.title,
    score,
    breakdown,
  }
}

/**
 * Berechnet Scores für alle Jobs und sortiert absteigend nach Score.
 */
export function scoreJobs(
  candidate: CandidateForMatching,
  jobs: JobForMatching[]
): MatchResult[] {
  return jobs
    .map((job) => scoreJob(candidate, job))
    .sort((a, b) => b.score - a.score)
}
