/**
 * lib/outreach-autopilot/research-agent.ts
 *
 * Research Agent — Phase 1
 *
 * Aufgabe: Nimmt manuell eingegebene Firmendaten entgegen und strukturiert sie.
 * KEIN automatisches Scraping.
 * KEIN Crawling externer URLs.
 * KEIN Datenkauf.
 * KEIN API-Call an externe Dienste.
 *
 * Reine Funktion: input → CompanyProfile
 */
import type { CompanyInput, CompanyProfile, ContactMethod, ContactSource } from './types'

/** Branchen mit plausiblem internationalem Fachkräftebedarf */
const HIGH_DEMAND_SECTORS = [
  'pflege', 'altenpflege', 'krankenpflege', 'gesundheit', 'klinik', 'krankenhaus',
  'arztpraxis', 'medizin', 'sozial', 'sozialdienst',
  'bau', 'baugewerbe', 'handwerk', 'elektriker', 'sanitär', 'installation',
  'it', 'informatik', 'software', 'tech', 'digital', 'entwicklung',
  'logistik', 'transport', 'spedition', 'lager', 'versand',
  'gastronomie', 'hotel', 'küche', 'catering', 'restaurant', 'gastgewerbe',
  'industrie', 'fertigung', 'produktion', 'metalll', 'maschinenbau',
  'landwirtschaft', 'gartenbau', 'forst',
  'reinigung', 'gebäude', 'facility',
] as const

/** Schlüsselwörter in Notizen die Einstellungsbedarf signalisieren */
const HIRING_KEYWORDS = [
  'suchen', 'stellen', 'fachkraft', 'fachkräfte', 'personal', 'mitarbeiter',
  'bewerber', 'kandidaten', 'einstellung', 'stellenanzeige', 'job', 'offene stelle',
  'mangel', 'bedarf', 'engpass', 'schwierigkeiten', 'probleme bei',
  'rekrutierung', 'recruiting', 'personalbedarf', 'wachstum', 'expansion',
  'international', 'ausland', 'migration', 'zuwanderung',
]

/**
 * Normalisiert einen Sektorstring auf Kleinbuchstaben und trimmt ihn.
 * Matched gegen bekannte high-demand Sektoren.
 */
export function normalizeSector(sector: string | null | undefined): string | null {
  if (!sector?.trim()) return null
  return sector.trim().toLowerCase()
}

/**
 * Extrahiert Signalwörter aus den Eingabetexten.
 */
export function extractKeywords(input: CompanyInput): string[] {
  const searchText = [
    input.company_name,
    input.sector,
    input.notes,
    input.website,
  ].filter(Boolean).join(' ').toLowerCase()

  return HIRING_KEYWORDS.filter(kw => searchText.includes(kw))
}

/**
 * Prüft ob der Sektor hohen internationalen Fachkräftebedarf hat.
 */
export function isHighDemandSector(sector: string | null | undefined): boolean {
  if (!sector) return false
  const normalized = sector.toLowerCase()
  return HIGH_DEMAND_SECTORS.some(s => normalized.includes(s))
}

/**
 * Bestimmt die Kontaktquelle — Phase 1 ist immer manual_input.
 */
export function determineContactSource(_input: CompanyInput): ContactSource {
  // Phase 1: Nur manual_input erlaubt.
  // Phase 2: existing_relationship oder explicit_opt_in möglich.
  return 'manual_input'
}

/**
 * Baut ein strukturiertes CompanyProfile aus dem Nutzer-Input.
 * KEIN externer Aufruf, KEIN Scraping.
 */
export function buildCompanyProfile(input: CompanyInput): CompanyProfile {
  const normalizedSector = normalizeSector(input.sector)
  const keywords = extractKeywords(input)
  const hasWebsite = Boolean(input.website?.trim())
  const hasContactPerson = Boolean(input.contact_person?.trim())
  const source = determineContactSource(input)

  return {
    ...input,
    company_name:     input.company_name.trim(),
    website:          input.website?.trim() || null,
    sector:           input.sector?.trim() || null,
    contact_person:   input.contact_person?.trim() || null,
    contact_method:   (input.contact_method ?? 'personal') as ContactMethod,
    contact_address:  input.contact_address?.trim() || null,
    notes:            input.notes?.trim() || null,
    source,
    hasWebsite,
    hasContactPerson,
    normalizedSector,
    keywords,
  }
}
