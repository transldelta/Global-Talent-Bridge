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

export type LeadType = 'employer_pilot' | 'agency_partner' | 'market_intelligence' | 'strategic_partner'

export type InterestType = 'partnership' | 'white_label' | 'licensing' | 'acquisition_discussion' | 'market_intelligence'

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
  lead_score:         number | null
  interest_type:      InterestType | null
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
  interest_type?:     InterestType
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
    errors.push('Organisation name is required (min. 2 characters).')
  }
  if (input.organization_name?.trim().length > 200) {
    errors.push('Organisation name too long (max. 200 characters).')
  }

  if (!input.contact_name?.trim() || input.contact_name.trim().length < 2) {
    errors.push('Contact name is required (min. 2 characters).')
  }

  if (!input.email?.trim() || !EMAIL_REGEX.test(input.email.trim())) {
    errors.push('A valid email address is required.')
  }

  if (!['employer_pilot', 'agency_partner', 'market_intelligence', 'strategic_partner'].includes(input.lead_type)) {
    errors.push('Invalid lead type.')
  }

  if (!input.consent_to_contact) {
    errors.push('Consent to contact is required.')
  }

  return { valid: errors.length === 0, errors }
}

// ── Lead Score (einfach, regelbasiert) ───────────────────────────────────────

export function calculateLeadScore(lead: Pick<RevenueLead, 'lead_type' | 'consent_to_contact' | 'sector' | 'country' | 'message'>): number {
  let score = 40 // Basis

  // Lead-Typ Gewichtung
  if (lead.lead_type === 'employer_pilot')       score += 30
  if (lead.lead_type === 'strategic_partner')    score += 35  // höchste Priorität
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
  strategic_partner:    '🎯 Strategic Partner',
}

export const LEAD_TYPE_COLORS: Record<LeadType, string> = {
  employer_pilot:      'bg-blue-100 text-blue-800 border-blue-200',
  agency_partner:      'bg-purple-100 text-purple-800 border-purple-200',
  market_intelligence: 'bg-green-100 text-green-800 border-green-200',
  strategic_partner:   'bg-amber-100 text-amber-800 border-amber-200',
}

export const INTEREST_TYPE_LABELS: Record<InterestType, string> = {
  partnership:             '🤝 Partnerschaft',
  white_label:             '🏷️ White-Label',
  licensing:               '📜 Lizenzierung',
  acquisition_discussion:  '🏢 Übernahme / Beteiligung',
  market_intelligence:     '📊 Market Intelligence',
}

export const REVENUE_PATHS = [
  {
    id:          'strategic',
    rank:        1,
    icon:        '🎯',
    label:       'Strategic Partner / White-Label',
    description: 'Sofortige Gespräche möglich. Kein Stripe. Kein Outreach.',
    path:        '/strategic-partnership',
    leadType:    'strategic_partner' as LeadType,
    speed:       'schnellster Weg',
  },
  {
    id:          'agency',
    rank:        2,
    icon:        '🤝',
    label:       'Agency / White-Label Partner',
    description: 'Recruiting-Agenturen, Sprachschulen, Relocation.',
    path:        '/partners',
    leadType:    'agency_partner' as LeadType,
    speed:       'schnell',
  },
  {
    id:          'employer',
    rank:        3,
    icon:        '🏭',
    label:       'Employer Pilot',
    description: 'Direkte Arbeitgeber-Anfragen für internationales Recruiting.',
    path:        '/pilot/employers',
    leadType:    'employer_pilot' as LeadType,
    speed:       'mittel',
  },
  {
    id:          'intel',
    rank:        4,
    icon:        '📊',
    label:       'Market Intelligence',
    description: 'Aggregierte Korridor- und Nachfragedaten.',
    path:        '/market-intelligence',
    leadType:    'market_intelligence' as LeadType,
    speed:       'mittel',
  },
] as const

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
  noJobGuarantee:  'No job guarantee. CorridorWork is a matching service, not an employment agency.',
  noVisaGuarantee: 'No visa guarantee. Visa processes are the responsibility of the relevant authorities.',
  noAutoPayment:   'No automatic payment. The pilot is free and non-binding.',
  noAutoContact:   'No automatic contact. Your enquiry is reviewed manually.',
  gdprNote:        'Your data is used solely to process your enquiry (GDPR Art. 6(1)(b)).',
  phase1Note:      'CorridorWork is in Phase 1 (Pilot). No ongoing contracts without written agreement.',
  // Legal-Readiness additions (Revenue Leads)
  datenschutzUrl:  '/legal/datenschutz',
  impressumUrl:    '/legal/impressum',
  legalContact:    'transl.delta@gmail.com',
  consentText:     'I agree that CorridorWork may contact me to process this enquiry. I consent to the storage of my details in accordance with the Privacy Policy (voluntary, revocable at any time).',
} as const

// ── Safety Export ─────────────────────────────────────────────────────────────

export const REVENUE_LEAD_INVARIANTS = {
  no_email_sent:      true  as const,
  no_auto_outreach:   true  as const,
  no_payment_started: true  as const,
  no_scraping:        true  as const,
  emailProvider:      'none' as const,
  phase:              1     as const,
} as const
