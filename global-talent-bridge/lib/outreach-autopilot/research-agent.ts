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
import type { CompanyInput, CompanyProfile, ContactMethod, ContactSource, PlaceholderDetectionResult, ScoreImprovementHint } from './types'

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

// ── Placeholder-Erkennung ──────────────────────────────────────────────────────

/**
 * Bekannte Test-/Platzhalternamen die NICHT als echte Firmen akzeptiert werden.
 * Groß-/Kleinschreibung wird ignoriert. Trimmen erfolgt vorher.
 */
const PLACEHOLDER_PATTERNS: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /^testfirma/i,                      label: 'Testfirma' },
  { pattern: /\btest\b/i,                         label: 'Test-Begriff' },
  { pattern: /\bpilot\s+test/i,                   label: 'Pilot Testfirma' },
  { pattern: /^beispiel/i,                        label: 'Beispiel' },
  { pattern: /\bbeispiel\s+gmbh\b/i,              label: 'Beispiel GmbH' },
  { pattern: /^demo\b/i,                          label: 'Demo' },
  { pattern: /^musterfirma/i,                     label: 'Musterfirma' },
  { pattern: /^muster\b/i,                        label: 'Muster' },
  { pattern: /echter\s+pflegebetrieb/i,           label: 'Echter Pflegebetrieb Name (Platzhalter)' },
  { pattern: /name\s+der\s+firma/i,               label: 'Name der Firma (Platzhalter)' },
  { pattern: /^firmenname$/i,                     label: 'Firmenname (Platzhalter)' },
  { pattern: /^platzhalter/i,                     label: 'Platzhalter' },
  { pattern: /^lorem/i,                           label: 'Lorem ipsum' },
  { pattern: /\bfake\b/i,                         label: 'Fake' },
  { pattern: /^[a-z]{1,2}$/i,                     label: 'Zu kurzer Name (1-2 Zeichen)' },
  { pattern: /^(test|firma|company|name|abc)$/i,  label: 'Generischer Platzhalter' },
]

/**
 * Erkennt ob ein Firmenname nach Test oder Platzhalter aussieht.
 * Reine Funktion. Kein I/O.
 */
export function detectPlaceholder(companyName: string): PlaceholderDetectionResult {
  const trimmed = companyName.trim()

  if (!trimmed) {
    return {
      isPlaceholder:   true,
      matchedPattern:  'empty',
      userMessage:     'Bitte einen echten Firmennamen eintragen.',
      improvementHint: 'Echte Firma + Website + Branche + Personalbedarf-Hinweis ergänzen.',
    }
  }

  for (const { pattern, label } of PLACEHOLDER_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        isPlaceholder:   true,
        matchedPattern:  label,
        userMessage:     `Das sieht nach einem Test- oder Platzhalternamen aus ("${label}"). Bitte echte Firma eintragen.`,
        improvementHint: 'Echte Firma + Website + Branche + Personalbedarf-Hinweis ergänzen.',
      }
    }
  }

  return {
    isPlaceholder:   false,
    matchedPattern:  null,
    userMessage:     null,
    improvementHint: null,
  }
}

/**
 * Gibt Hinweise welche Felder den Fit Score verbessern würden.
 * Nur für Felder die fehlen / leer sind.
 */
export function buildScoreImprovementHints(input: CompanyInput): ScoreImprovementHint[] {
  const hints: ScoreImprovementHint[] = []

  if (!input.sector?.trim()) {
    hints.push({
      field:       'sector',
      label:       'Branche eintragen',
      explanation: 'Die Branche ist das wichtigste Kriterium. Pflege, Bau, IT, Logistik → hoher Score.',
      example:     'z.B. "Altenpflege" oder "IT-Dienstleistung" oder "Baugewerbe"',
      scoreGain:   25,
    })
  }

  if (!input.website?.trim()) {
    hints.push({
      field:       'website',
      label:       'Website eintragen',
      explanation: 'Eine Website zeigt, dass die Firma digital aufgestellt ist.',
      example:     'z.B. "https://www.pflegeheim-musterhausen.de"',
      scoreGain:   10,
    })
  }

  if (!input.notes?.trim() || input.notes.trim().length < 20) {
    hints.push({
      field:       'notes',
      label:       'Personalbedarf-Hinweis eintragen',
      explanation: 'Ein kurzer Hinweis auf offene Stellen oder Fachkräftemangel erhöht den Score deutlich.',
      example:     'z.B. "Suchen Pflegefachkräfte, haben offene Stellen, internationaler Bedarf bekannt"',
      scoreGain:   20,
    })
  }

  if (!input.contact_person?.trim()) {
    hints.push({
      field:       'contact_person',
      label:       'Kontaktperson eintragen',
      explanation: 'Ein bekannter Ansprechpartner macht die Nachricht persönlicher.',
      example:     'z.B. "Maria Muster" (Geschäftsführerin)',
      scoreGain:   5,
    })
  }

  return hints
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
