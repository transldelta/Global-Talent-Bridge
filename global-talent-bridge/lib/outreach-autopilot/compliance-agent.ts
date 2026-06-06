/**
 * lib/outreach-autopilot/compliance-agent.ts
 *
 * Compliance & Spam-Risk Agent
 *
 * Aufgabe: Prüft jeden Nachrichtentext auf Spam-Risiken, unerlaubte Inhalte,
 *          fehlende Pflichtbestandteile und Datenschutzverstöße.
 *
 * Ergebnis:
 * - safe:         Text ist sauber, darf kopiert werden
 * - needs_review: Warnungen vorhanden, manuell prüfen
 * - blocked:      Kritische Verstöße, kein Kopieren als "ready" möglich
 *
 * Reine Funktion. Kein DB-Call, kein API-Call.
 */
import type { ComplianceResult, ComplianceViolation, SpamRisk } from './types'

// ── Pflicht-Bestandteile ───────────────────────────────────────────────────────

/** Signatur die immer enthalten sein muss */
const REQUIRED_SIGNATURE = 'CorridorWork Team'

/** Verbotene Signaturen / persönliche Namen */
const FORBIDDEN_SIGNATURES = [
  '[Ihr Name]', '[DEIN NAME]', '[NAME]', '[IHR NAME]',
  'Brahim Ben Abla', 'Gründer von',
]

/** Pflicht-Wörter für Pilot-Charakter (mindestens eins) */
const REQUIRED_PILOT_TERMS = [
  'pilot', 'kostenlos', 'testen', 'unverbindlich', 'testphase',
]

// ── Spam-Indikatoren ───────────────────────────────────────────────────────────

/** Sehr werbliche / aggressive Sprache → blocked */
const BLOCKED_PATTERNS: RegExp[] = [
  /jetzt\s+(sofort\s+)?kaufen/i,
  /begrenzte?\s+(anzahl|plätze|kapazität|verfügbarkeit)/i,
  /letzte\s+chance/i,
  /nur\s+noch\s+\d+/i,
  /revolutionär/i,
  /garantier(t|en)\s+(stell|einstellung|kandidaten|erfolg)/i,
  /100\s*%\s*(erfolg|garantie)/i,
  /sofort\s+einstell/i,
  /massenversand/i,
  /an\s+alle\s+(arbeitgeber|firmen|unternehmen)/i,
  /automatisch\s+(verschickt|versendet|gesendet)/i,
  /bulk/i,
  /newsletter.*abonnieren/i,
]

/** Warnungs-Muster → needs_review */
const WARNING_PATTERNS: Array<{ pattern: RegExp; description: string }> = [
  {
    pattern: /dringend/i,
    description: 'Dringlichkeit kann als Druck wirken',
  },
  {
    pattern: /sofort/i,
    description: '"Sofort" klingt unter Umständen drängend',
  },
  {
    pattern: /exklusiv/i,
    description: '"Exklusiv" kann übertrieben wirken',
  },
  {
    pattern: /beste\s+(lösung|plattform|software)/i,
    description: 'Superlative klingen werblich',
  },
  {
    pattern: /\bdas\s+beste\b/i,
    description: '"Das Beste" ist ein nicht belegbarer Superlativ',
  },
  {
    pattern: /rabatt/i,
    description: 'Rabatt-Erwähnungen passen nicht zum unverbindlichen Pilot',
  },
  {
    pattern: /\bangebot\s+(nur\s+)?bis\b/i,
    description: 'Zeitlich begrenzte Angebote erzeugen künstlichen Druck',
  },
  {
    pattern: /geld\s+verdienen/i,
    description: 'Einkommensversprechen können unrealistisch wirken',
  },
  {
    pattern: /kein\s+risiko\s+—\s+garantiert/i,
    description: 'Absolute Garantien nicht belegbar',
  },
  {
    pattern: /persönliche\s+(daten|informationen)\s+gesammelt/i,
    description: 'DSGVO-relevante Formulierung prüfen',
  },
]

/** Persönliche Daten ohne Grundlage */
const PERSONAL_DATA_PATTERNS: RegExp[] = [
  /\bIhr\s+(umsatz|gewinn|mitarbeiterzahl|mitarbeiteranzahl)\b/i,
  /\bwir\s+wissen[,\s]+dass\s+Sie\b/i,
  /\bIhre\s+Schwäche\b/i,
  /\bIhre\s+Probleme\s+(mit|bei)\b/i,
]

// ── Helper ─────────────────────────────────────────────────────────────────────

function hasSignature(text: string): boolean {
  return text.includes(REQUIRED_SIGNATURE)
}

function hasForbiddenSignature(text: string): boolean {
  return FORBIDDEN_SIGNATURES.some(sig => text.includes(sig))
}

function hasPilotCharacter(text: string): boolean {
  const lower = text.toLowerCase()
  return REQUIRED_PILOT_TERMS.some(term => lower.includes(term))
}

function hasRegistrationLink(text: string): boolean {
  return text.includes('corridorwork.com')
}

// ── Main Export ────────────────────────────────────────────────────────────────

/**
 * Prüft einen Nachrichtentext auf Compliance.
 * @param text  Die zu prüfende Nachricht (body oder subject+body)
 * @returns     ComplianceResult mit Status, Verstößen und Warnungen
 */
export function checkCompliance(text: string): ComplianceResult {
  const violations: ComplianceViolation[] = []
  const warnings: string[] = []

  const normalizedText = text.trim()

  // ── Pflicht: Signatur ──────────────────────────────────────────────────────
  const sigOk = hasSignature(normalizedText)
  if (!sigOk) {
    violations.push({
      rule:        'missing_signature',
      severity:    'error',
      description: `Signatur "${REQUIRED_SIGNATURE}" fehlt. Muss am Ende stehen.`,
    })
  }

  // ── Pflicht: Pilot-Charakter ───────────────────────────────────────────────
  const pilotOk = hasPilotCharacter(normalizedText)
  if (!pilotOk) {
    violations.push({
      rule:        'missing_pilot_character',
      severity:    'error',
      description: 'Kein klarer Pilot-/Test-Charakter ("kostenlos", "unverbindlich", "Pilot" oder "testen" fehlt).',
    })
  }

  // ── Pflicht: CorridorWork-Domain ───────────────────────────────────────────
  if (!hasRegistrationLink(normalizedText)) {
    violations.push({
      rule:        'missing_registration_link',
      severity:    'error',
      description: 'Kein Registrierungslink mit corridorwork.com vorhanden.',
    })
  }

  // ── Verboten: Persönliche Signaturen ──────────────────────────────────────
  if (hasForbiddenSignature(normalizedText)) {
    violations.push({
      rule:        'personal_name_in_signature',
      severity:    'error',
      description: 'Persönlicher Name oder Platzhalter wie [Ihr Name] in der Signatur gefunden.',
    })
  }

  // ── Verboten: Aggressive Spam-Muster ──────────────────────────────────────
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(normalizedText)) {
      violations.push({
        rule:        'spam_pattern',
        severity:    'error',
        description: `Unerlaubter Spam-Ausdruck gefunden: "${pattern.source}"`,
      })
    }
  }

  // ── Verboten: Persönliche Daten ohne Grundlage ────────────────────────────
  for (const pattern of PERSONAL_DATA_PATTERNS) {
    if (pattern.test(normalizedText)) {
      violations.push({
        rule:        'unauthorized_personal_data',
        severity:    'error',
        description: 'Nutzung persönlicher Unternehmensdaten ohne Grundlage.',
      })
    }
  }

  // ── Warnungen ──────────────────────────────────────────────────────────────
  for (const { pattern, description } of WARNING_PATTERNS) {
    if (pattern.test(normalizedText)) {
      warnings.push(description)
    }
  }

  // ── Längen-Check ──────────────────────────────────────────────────────────
  if (normalizedText.length < 50) {
    violations.push({
      rule:        'too_short',
      severity:    'error',
      description: 'Text zu kurz (< 50 Zeichen). Kein vollständiger Nachrichtentext.',
    })
  }

  if (normalizedText.length > 4000) {
    warnings.push('Text sehr lang (> 4000 Zeichen) — könnte wie automatisch generierter Massentext wirken.')
  }

  // ── Status berechnen ──────────────────────────────────────────────────────
  const hasErrors = violations.some(v => v.severity === 'error')
  const hasWarnings = warnings.length > 0

  let status: ComplianceResult['status']
  if (hasErrors) {
    status = 'blocked'
  } else if (hasWarnings) {
    status = 'needs_review'
  } else {
    status = 'safe'
  }

  return {
    status,
    violations,
    warnings,
    hasSignature:        sigOk,
    hasPilotNote:        pilotOk,
    hasNoSpamIndicators: violations.filter(v => v.rule === 'spam_pattern').length === 0,
  }
}

/**
 * Berechnet das Spam-Risiko eines Textes (low/medium/high).
 */
export function calculateSpamRisk(result: ComplianceResult): SpamRisk {
  if (result.status === 'blocked') return 'high'
  if (result.warnings.length >= 3) return 'high'
  if (result.warnings.length >= 1 || result.status === 'needs_review') return 'medium'
  return 'low'
}
