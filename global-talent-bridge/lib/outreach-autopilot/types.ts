/**
 * lib/outreach-autopilot/types.ts
 *
 * Gemeinsame Typen für alle Outreach-Autopilot-Agenten.
 * Keine Seiteneffekte. Keine Server-Imports. Rein deklarativ.
 *
 * Sicherheits-Invarianten (gelten für alle Phasen):
 * - no_email_sent ist immer true in Phase 1
 * - no_auto_outreach ist immer true in Phase 1
 * - Delivery nur erlaubt wenn alle DeliveryConditions erfüllt (Phase 2)
 */

// ── Enums ──────────────────────────────────────────────────────────────────────

export type ContactMethod = 'whatsapp' | 'linkedin' | 'email' | 'personal'
export type ContactSource = 'manual_input' | 'existing_relationship' | 'explicit_opt_in'
export type ComplianceStatus = 'safe' | 'needs_review' | 'blocked'
export type SpamRisk = 'low' | 'medium' | 'high'

export type EntryStatus =
  | 'draft'
  | 'needs_review'
  | 'approved_for_manual_copy'
  | 'contacted_manual'
  | 'blocked'

// ── Research Agent ─────────────────────────────────────────────────────────────

export type CompanyInput = {
  company_name:     string
  website?:         string | null
  sector?:          string | null
  contact_person?:  string | null
  contact_method?:  ContactMethod
  contact_address?: string | null
  notes?:           string | null
}

export type CompanyProfile = CompanyInput & {
  source:              ContactSource
  hasWebsite:          boolean
  hasContactPerson:    boolean
  normalizedSector:    string | null
  keywords:            string[]
}

// ── Fit Scoring Agent ──────────────────────────────────────────────────────────

export type FitScoreBreakdown = {
  sectorRelevance:          number   // 0–30
  digitalPresence:          number   // 0–10
  hiringSignals:            number   // 0–20
  internationalNeed:        number   // 0–20
  contactQuality:           number   // 0–10
  profileCompleteness:      number   // 0–10
}

export type FitScoreResult = {
  score:            number           // 0–100
  breakdown:        FitScoreBreakdown
  label:            'excellent' | 'good' | 'marginal' | 'low' | 'rejected'
  recommendation:   string
  blockedByScore:   boolean          // true if score < 70
}

// ── Compliance Agent ───────────────────────────────────────────────────────────

export type ComplianceViolation = {
  rule:        string
  severity:    'error' | 'warning'
  description: string
}

export type ComplianceResult = {
  status:       ComplianceStatus
  violations:   ComplianceViolation[]
  warnings:     string[]
  hasSignature: boolean
  hasPilotNote: boolean
  hasNoSpamIndicators: boolean
}

// ── Personalization Agent ──────────────────────────────────────────────────────

export type DraftMessage = {
  subject?:  string
  body:      string
  channel:   ContactMethod
  wordCount: number
  hasCTA:    boolean
}

// ── Human Approval Agent ───────────────────────────────────────────────────────

export type ApprovalState = {
  canApprove:         boolean
  canCopy:            boolean
  canSaveAsDraft:     boolean
  blockers:           string[]
  suggestedAction:    string
  nextSafeAction:     string
}

// ── Delivery Agent (Phase 2 — nur Architektur) ─────────────────────────────────

export type DeliveryCondition = {
  name:        string
  met:         boolean
  description: string
}

export type DeliveryCheckResult = {
  allowed:    false               // IMMER false in Phase 1
  phase:      1
  reason:     string
  conditions: DeliveryCondition[]
}

// ── Orchestrator Output ────────────────────────────────────────────────────────

export type AutopilotAnalysis = {
  profile:           CompanyProfile
  fitScore:          FitScoreResult
  compliance:        ComplianceResult
  draft:             DraftMessage
  approval:          ApprovalState
  delivery:          DeliveryCheckResult
  // Aggregated for UI
  overallSafe:       boolean
  recommendedChannel: ContactMethod
  spamRisk:          SpamRisk
  summary:           string
}

// ── DB Row ─────────────────────────────────────────────────────────────────────

export type OutreachAutopilotEntry = {
  id:                    string
  company_name:          string
  website:               string | null
  sector:                string | null
  contact_person:        string | null
  contact_method:        ContactMethod
  contact_address:       string | null
  notes:                 string | null
  fit_score:             number
  fit_score_breakdown:   FitScoreBreakdown
  compliance_status:     ComplianceStatus
  spam_risk:             SpamRisk
  compliance_warnings:   string[]
  draft_message:         string | null
  draft_subject:         string | null
  status:                EntryStatus
  no_email_sent:         true
  no_auto_outreach:      true
  created_by:            string
  created_at:            string
  updated_at:            string
}
