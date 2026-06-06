/**
 * lib/outreach-autopilot/fit-scoring-agent.ts
 *
 * Fit Scoring Agent
 *
 * Aufgabe: Bewertet, ob eine Firma als Pilot-Arbeitgeber für CorridorWork geeignet ist.
 * Score 0–100. Unter 70 → kein Outreach vorgeschlagen.
 *
 * Kriterien:
 * - Sektorpassung (0–30)
 * - Digitale Präsenz / Website (0–10)
 * - Einstellungssignale in Notizen (0–20)
 * - Internationaler Fachkräftebedarf plausibel (0–20)
 * - Kontaktqualität (0–10)
 * - Profilvollständigkeit (0–10)
 *
 * Reine Funktion. Kein DB-Call, kein API-Call.
 */
import type { CompanyProfile, FitScoreBreakdown, FitScoreResult } from './types'
import { isHighDemandSector } from './research-agent'

/** Minimum-Score für Outreach-Empfehlung */
export const FIT_SCORE_THRESHOLD = 70

/** Sektor-Kategorien mit Basiswert */
const SECTOR_SCORES: Record<string, number> = {
  pflege:        30, altenpflege:    30, krankenpflege:  30,
  gesundheit:    28, klinik:         28, krankenhaus:    28,
  bau:           27, baugewerbe:     27, handwerk:       25,
  elektriker:    25, sanitär:        24,
  it:            26, informatik:     26, software:       26, tech: 25,
  logistik:      24, transport:      23, spedition:      22,
  gastronomie:   22, hotel:          22, gastgewerbe:    21,
  industrie:     23, fertigung:      22, produktion:     22,
  reinigung:     20, gebäude:        20, facility:       19,
  landwirtschaft:18, gartenbau:      17,
}

/**
 * Bewertet die Sektorrelevanz (0–30).
 */
function scoreSector(profile: CompanyProfile): number {
  if (!profile.normalizedSector) return 8  // unbekannter Sektor: Basiswert

  // Versuche direkten Match
  for (const [key, val] of Object.entries(SECTOR_SCORES)) {
    if (profile.normalizedSector.includes(key)) return val
  }

  // Fallback: hoher Bedarf erkannt durch isHighDemandSector
  if (isHighDemandSector(profile.normalizedSector)) return 18

  return 5  // niedriger Sektor-Score
}

/**
 * Bewertet digitale Präsenz / Website-Existenz (0–10).
 */
function scoreDigitalPresence(profile: CompanyProfile): number {
  if (!profile.hasWebsite) return 3
  const url = (profile.website ?? '').toLowerCase()
  // Bekannte professionelle Domains signalisieren mehr Reife
  if (url.includes('.de') || url.includes('.com') || url.includes('.eu')) return 10
  return 7
}

/**
 * Bewertet Einstellungssignale aus Keywords (0–20).
 */
function scoreHiringSignals(profile: CompanyProfile): number {
  const count = profile.keywords.length
  if (count === 0) return 5
  if (count === 1) return 10
  if (count === 2) return 14
  if (count === 3) return 17
  return 20
}

/**
 * Bewertet die Plausibilität internationalen Fachkräftebedarfs (0–20).
 */
function scoreInternationalNeed(profile: CompanyProfile): number {
  const notes = (profile.notes ?? '').toLowerCase()
  const hasExplicitInt =
    notes.includes('international') ||
    notes.includes('ausland') ||
    notes.includes('migration') ||
    notes.includes('fachkräftemangel') ||
    notes.includes('engpass') ||
    notes.includes('schwer zu finden') ||
    notes.includes('kein bewerber') ||
    notes.includes('keine kandidaten')

  if (hasExplicitInt) return 20

  // Sektoren mit hohem internationalem Bedarf
  if (isHighDemandSector(profile.normalizedSector)) return 14

  return 5
}

/**
 * Bewertet die Kontaktqualität (0–10).
 */
function scoreContactQuality(profile: CompanyProfile): number {
  let score = 0
  if (profile.hasContactPerson) score += 5
  if (profile.contact_method && profile.contact_method !== 'personal') score += 3
  if (profile.contact_address?.trim()) score += 2
  return score
}

/**
 * Bewertet die Vollständigkeit des Profils (0–10).
 */
function scoreProfileCompleteness(profile: CompanyProfile): number {
  let score = 0
  if (profile.company_name.trim().length >= 3) score += 2
  if (profile.sector) score += 2
  if (profile.website) score += 2
  if (profile.contact_person) score += 2
  if (profile.notes && profile.notes.length >= 20) score += 2
  return score
}

/**
 * Gibt ein lesbares Label für den Score zurück.
 */
function scoreToLabel(score: number): FitScoreResult['label'] {
  if (score >= 85) return 'excellent'
  if (score >= 70) return 'good'
  if (score >= 55) return 'marginal'
  if (score >= 35) return 'low'
  return 'rejected'
}

/**
 * Gibt eine Handlungsempfehlung basierend auf Score und Label zurück.
 */
function buildRecommendation(score: number, label: FitScoreResult['label']): string {
  if (label === 'excellent')
    return 'Sehr gute Passung — Outreach empfohlen. Vorlage kopieren und manuell versenden.'
  if (label === 'good')
    return 'Gute Passung — Outreach möglich. Vorlage prüfen und manuell versenden.'
  if (label === 'marginal')
    return `Score ${score}/100 — knapp unter Schwellenwert. Mehr Informationen zur Firma eintragen und erneut analysieren.`
  if (label === 'low')
    return 'Geringe Passung — Outreach nicht empfohlen. Sektor oder Bedarf prüfen.'
  return `Score zu niedrig (${score}/100). Kein Outreach vorgeschlagen. Firma auf Relevanz prüfen.`
}

/**
 * Berechnet den Fit Score für ein CompanyProfile.
 * Gibt FitScoreResult zurück.
 */
export function calculateFitScore(profile: CompanyProfile): FitScoreResult {
  const breakdown: FitScoreBreakdown = {
    sectorRelevance:     scoreSector(profile),
    digitalPresence:     scoreDigitalPresence(profile),
    hiringSignals:       scoreHiringSignals(profile),
    internationalNeed:   scoreInternationalNeed(profile),
    contactQuality:      scoreContactQuality(profile),
    profileCompleteness: scoreProfileCompleteness(profile),
  }

  const raw =
    breakdown.sectorRelevance +
    breakdown.digitalPresence +
    breakdown.hiringSignals +
    breakdown.internationalNeed +
    breakdown.contactQuality +
    breakdown.profileCompleteness

  const score = Math.min(100, Math.max(0, Math.round(raw)))
  const label = scoreToLabel(score)

  return {
    score,
    breakdown,
    label,
    recommendation: buildRecommendation(score, label),
    blockedByScore: score < FIT_SCORE_THRESHOLD,
  }
}
