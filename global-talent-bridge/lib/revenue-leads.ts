/**
 * lib/revenue-leads.ts
 *
 * Inbound Revenue Activation — Business Logic
 *
 * Phase 1 Constraints:
 * - Kein E-Mail-Versand
 * - Kein automatischer Outreach
 * - Keine Zahlungsauslösung
 * - Alle Leads landen zur manuellen Prüfung im Admin-Inbox
 */

export type LeadType = 'employer_pilot' | 'agency_partner' | 'market_intelligence'

export type LeadStatus = 'new' | 'reviewed' | 'qualified' | 'rejected' | 'contacted_manual'

export interface RevenueLead {
  id:                 string
  lead_type:          LeadType
  organization_name:  string
  contact_name:       string
  email:              string
  country:            string | null
  city:               string | null
  sector:             string | null
  message:            string | null
  consent_to_contact: boolean
  status:             LeadStatus
  source_page:        string
  admin_note:         string
  no_email_sent:      boolean
  no_auto_outreach:   boolean
  no_payment_started: boolean
  created_at:         string
  updated_at:         string
}

export interface LeadFormInput {
  lead_type:          LeadType
  organization_name:  string
  contact_name:       string
  email:              string
  country?:           string
  city?:              string
  sector?:            string
  message?:           string
  consent_to_contact: boolean
  source_page:        string
  // Honeypot — muss leer sein
  website?:           string
}

// ── Validierung ───────────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/

export function validateLeadInput(input: LeadFormInput): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Honeypot
  if (input.website && input.website.trim().length > 0) {
    return { valid: false, errors: ['Bot detected'] }
  }

  if (!input.organization_name?.trim() || input.organization_name.trim().length < 2) {
    errors.push('Organisationsname ist erforderlich (min. 2 Zeichen).')
  }
  if (input.organization_name?.trim().length > 200) {
    errors.push('Organisationsname zu lang (max. 200 Zeichen).')
  }

  if (!input.contact_name?.trim() || input.contact_name.trim().length < 2) {
    errors.push('Ansprechpartner ist erforderlich (min. 2 Zeichen).')
  }

  if (!input.email?.trim() || !EMAIL_REGEX.test(input.email.trim())) {
    errors.push('Gültige E-Mail-Adresse ist erforderlich.')
  }

  if (!['employer_pilot', 'agency_partner', 'market_intelligence'].includes(input.lead_type)) {
    errors.push('Ungültiger Lead-Typ.')
  }

  if (!input.consent_to_contact) {
    errors.push('Zustimmung zur Kontaktaufnahme ist erforderlich.')
  }

  return { valid: errors.length === 0, errors }
}

// ── Lead Score (einfach, regelbasiert) ───────────────────────────────────────

export function calculateLeadScore(lead: Pick<RevenueLead, 'lead_type' | 'consent_to_contact' | 'sector' | 'country' | 'message'>): number {
  let score = 40 // Basis

  // Lead-Typ Gewichtung
  if (lead.lead_type === 'employer_pilot')       score += 30
  if (lead.lead_type === 'agency_partner')        score += 25
  if (lead.lead_type === 'market_intelligence')   score += 15

  // Vollständigkeit
  if (lead.sector)    score += 10
  if (lead.country)   score += 5
  if (lead.message && lead.message.trim().length > 20) score += 10

  return Math.min(score, 100)
}

// ── Lead Type Labels ──────────────────────────────────────────────────────────

export const LEAD_TYPE_LABELS: Record<LeadType, string> = {
  employer_pilot:       '🏭 Employer Pilot',
  agency_partner:       '🤝 Agency Partner',
  market_intelligence:  '📊 Market Intelligence',
}

export const LEAD_TYPE_COLORS: Record<LeadType, string> = {
  employer_pilot:      'bg-blue-100 text-blue-800 border-blue-200',
  agency_partner:      'bg-purple-100 text-purple-800 border-purple-200',
  market_intelligence: 'bg-green-100 text-green-800 border-green-200',
}

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new:               '🆕 Neu',
  reviewed:          '👁️ Geprüft',
  qualified:         '✅ Qualifiziert',
  rejected:          '❌ Abgelehnt',
  contacted_manual:  '📞 Manuell kontaktiert',
}

export const STATUS_COLORS: Record<LeadStatus, string> = {
  new:               'bg-yellow-100 text-yellow-800',
  reviewed:          'bg-blue-100 text-blue-800',
  qualified:         'bg-green-100 text-green-800',
  rejected:          'bg-red-100 text-red-800',
  contacted_manual:  'bg-purple-100 text-purple-800',
}

// ── Compliance Disclaimer (für Formulare) ────────────────────────────────────

export const COMPLIANCE_DISCLAIMER = {
  noJobGuarantee:      'Keine Jobgarantie. CorridorWork ist ein Matching-Dienst, kein Arbeitsvermittler.',
  noVisaGuarantee:     'Keine Visa-Garantie. Visaprozesse liegen in der Zuständigkeit der Behörden.',
  noAutoPayment:       'Keine automatische Zahlung. Pilot ist kostenlos und unverbindlich.',
  noAutoContact:       'Keine automatische Kontaktaufnahme. Ihr Lead wird manuell geprüft.',
  gdprNote:            'Ihre Daten werden nur zur Bearbeitung Ihrer Anfrage verwendet (DSGVO Art. 6 Abs. 1 lit. b).',
  phase1Note:          'CorridorWork befindet sich in Phase 1 (Pilot). Keine laufenden Verträge ohne schriftliche Vereinbarung.',
} as const

// ── Safety Export ─────────────────────────────────────────────────────────────

export const REVENUE_LEAD_INVARIANTS = {
  no_email_sent:      true  as const,
  no_auto_outreach:   true  as const,
  no_payment_started: true  as const,
  emailProvider:      'none' as const,
  phase:              1     as const,
} as const
