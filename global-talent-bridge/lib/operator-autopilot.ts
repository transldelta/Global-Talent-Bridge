/**
 * lib/operator-autopilot.ts
 *
 * Operator Autopilot — reine Business-Logic für die Approval-Queue.
 * Keine UI. Keine Server-Imports. Vollständig testbar mit Vitest.
 *
 * HARD CONSTRAINTS:
 * - Keine Aktion ohne status === 'approved'
 * - E-Mail nur bei konfiguriertem Provider (nicht 'none')
 * - LinkedIn/WhatsApp/Phone → ready_for_manual_platform_send (kein API-Send)
 * - Keine persönlichen Namen in generierten Texten
 * - Signatur immer: "Viele Grüße\nCorridorWork Team"
 * - Keine Fake-Umsätze, keine Fake-Kunden, keine Garantieversprechen
 * - pilot_employers.status: NIEMALS 'draft' oder 'demo_requested'
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export type OperatorActionType =
  | 'approve_outreach'
  | 'reject_outreach'
  | 'postpone_outreach'
  | 'send_email'
  | 'mark_manual_platform_ready'
  | 'create_follow_up'
  | 'update_employer_status'
  | 'research_contact'
  | 'review_risk'

export type OperatorActionStatus =
  | 'pending' | 'approved' | 'rejected' | 'done' | 'postponed' | 'blocked'

export type DraftStatus =
  | 'generated' | 'needs_review' | 'approved' | 'rejected'
  | 'sent' | 'failed' | 'ready_for_manual_platform_send' | 'postponed'

export type DraftChannel = 'email' | 'linkedin' | 'whatsapp' | 'phone'

export type DraftProvider =
  | 'none' | 'resend' | 'smtp'
  | 'manual_platform' | 'whatsapp_business_api' | 'linkedin_manual'

export type RiskLevel = 'low' | 'medium' | 'high'

export type Priority = 'critical' | 'high' | 'medium' | 'low'

export type ValidPilotEmployerStatus =
  | 'identified' | 'contacted_manual' | 'interested'
  | 'demo_scheduled' | 'onboarding' | 'active_pilot' | 'rejected'

export interface OperatorAction {
  id?: string
  action_type: OperatorActionType
  entity_type?: string
  entity_id?: string
  title: string
  description?: string
  priority: Priority
  status: OperatorActionStatus
  recommended_decision?: string
  risk_level: RiskLevel
  due_at?: Date
  completed_at?: Date
  created_at?: Date
  updated_at?: Date
}

export interface OutreachDraft {
  id?: string
  pilot_employer_id: string
  channel: DraftChannel
  recipient_name?: string
  recipient_email?: string
  recipient_phone?: string
  subject?: string
  body: string
  status: DraftStatus
  approval_required: boolean
  approved_at?: Date
  approved_by?: string
  sent_at?: Date
  provider: DraftProvider
  risk_level: RiskLevel
  risk_notes?: string
  next_follow_up_at?: Date
  error_message?: string
  demo: boolean
}

export interface SafetyCheckResult {
  safe: boolean
  issues: string[]
  riskLevel: RiskLevel
}

export interface ProviderConfig {
  provider: DraftProvider
  fromEmail?: string
}

export interface ExecutionPlan {
  canExecute: boolean
  action: 'send_email' | 'mark_manual_platform_ready' | 'blocked' | 'noop'
  reason: string
  blockedReason?: string
  draftUpdates: Partial<OutreachDraft>
}

export interface AuditLogEntry {
  agent_name: string
  status: 'info' | 'warning' | 'error' | 'success'
  message: string
  metadata?: Record<string, unknown>
}

export interface EmployerForDraft {
  id: string
  company_name: string
  contact_name: string | null
  contact_email: string | null
  contact_phone: string | null
  industry: string | null
  country: string
  status: ValidPilotEmployerStatus
  notes: string | null
}

export interface DailyActionSummary {
  actions: OperatorAction[]
  urgentCount: number
  pendingDraftCount: number
  researchCount: number
  followUpCount: number
}

// ── Constants ─────────────────────────────────────────────────────────────────

export const VALID_DRAFT_STATUSES: DraftStatus[] = [
  'generated','needs_review','approved','rejected',
  'sent','failed','ready_for_manual_platform_send','postponed',
]

export const VALID_OPERATOR_ACTION_TYPES: OperatorActionType[] = [
  'approve_outreach','reject_outreach','postpone_outreach',
  'send_email','mark_manual_platform_ready',
  'create_follow_up','update_employer_status',
  'research_contact','review_risk',
]

export const VALID_PILOT_EMPLOYER_STATUSES: ValidPilotEmployerStatus[] = [
  'identified','contacted_manual','interested',
  'demo_scheduled','onboarding','active_pilot','rejected',
]

// Forbidden status values that must never appear in pilot_employers.status
export const FORBIDDEN_PILOT_STATUSES = ['draft', 'demo_requested'] as const

// ── Helpers ───────────────────────────────────────────────────────────────────

function industryContains(industry: string | null, ...terms: string[]): boolean {
  const i = (industry ?? '').toLowerCase()
  return terms.some((t) => i.includes(t))
}

function inferIndustryCorridor(employer: EmployerForDraft): string {
  const { country, industry } = employer
  const i = (industry ?? '').toLowerCase()
  if (i.includes('pflege') || i.includes('care') || i.includes('nursing')) {
    if (country.toLowerCase().includes('german') || country === 'Deutschland')
      return 'Marokko / Philippinen → Deutschland (Pflege)'
    if (country.toLowerCase().includes('austral'))
      return 'Philippinen → Australien (Pflege)'
    if (country.toLowerCase().includes('uk') || country.toLowerCase().includes('united kingdom'))
      return 'Indien → UK (Pflege)'
    return `Ausland → ${country} (Pflege)`
  }
  if (i.includes('it') || i.includes('software') || i.includes('tech')) {
    if (country.toLowerCase().includes('canad'))
      return 'Indien → Kanada (IT)'
    if (country.toLowerCase().includes('german') || country === 'Germany')
      return 'Türkei → Deutschland (IT)'
    return `Ausland → ${country} (IT)`
  }
  return `Ausland → ${country}`
}

function buildGreeting(contactName: string | null, channel: DraftChannel): string {
  if (!contactName) return 'Sehr geehrte Damen und Herren'
  // For LinkedIn/WhatsApp use informal greeting without full name reveal
  if (channel === 'linkedin' || channel === 'whatsapp') {
    return `Hallo [NACHNAME]`
  }
  // For email, use formal greeting with placeholder for unknown full details
  const parts = contactName.trim().split(' ')
  const lastName = parts.length > 1 ? parts[parts.length - 1] : contactName
  return `Hallo Frau/Herr ${lastName}`
}

function buildSignature(channel: DraftChannel, includeContact = true): string {
  const base = 'Viele Grüße\nCorridorWork Team'
  if (!includeContact || channel === 'linkedin' || channel === 'whatsapp') return base
  return `${base}\n[KONTAKT-E-MAIL]\nhttps://corridorwork.com`
}

// ── Draft Text Generation ─────────────────────────────────────────────────────

function buildEmailDraftText(employer: EmployerForDraft): {
  subject: string
  body: string
  riskLevel: RiskLevel
  riskNotes?: string
  status: DraftStatus
} {
  const corridor = inferIndustryCorridor(employer)
  const greeting = buildGreeting(employer.contact_name, 'email')
  const signature = buildSignature('email')
  const isCare = industryContains(employer.industry, 'pflege','care','nursing')
  const isIT   = industryContains(employer.industry, 'it','software','tech')
  const isWarm = employer.status === 'interested' || employer.status === 'contacted_manual'

  // Risk: cold outreach for identified employers
  const riskLevel: RiskLevel = isWarm ? 'low' : 'medium'
  const status: DraftStatus  = isWarm ? 'generated' : 'needs_review'
  const riskNotes = isWarm
    ? undefined
    : 'Cold Outreach — Arbeitgeber noch nicht kontaktiert. Bitte vor Versand prüfen.'

  if (isCare) {
    return {
      subject: `Pflegekräfte international – Pilotangebot für ${employer.company_name}`,
      body:
`${greeting},

CorridorWork ist eine Plattform, die Pflegekräfte aus dem Ausland mit Pflegeeinrichtungen in ${employer.country} zusammenbringt — Korridor: ${corridor}.

Wir befinden uns in der Pilotphase und testen den Prozess gemeinsam mit ausgewählten Einrichtungen — kostenlos, kein Vertrag, kein Garantieversprechen. Nur ehrliches Feedback.

Darf ich die Plattform in einem kurzen Gespräch (20 Min.) vorstellen?
Terminvorschlag: [DEMO-TERMIN 1] oder [DEMO-TERMIN 2]

${signature}`,
      riskLevel,
      riskNotes,
      status,
    }
  }

  if (isIT) {
    return {
      subject: `Internationale IT-Fachkräfte für ${employer.company_name} – Demo`,
      body:
`${greeting},

CorridorWork ist eine Plattform für strukturiertes internationales Recruiting im IT-Bereich — Korridor: ${corridor}.

Wir befinden uns in der Pilotphase und suchen IT-Unternehmen, die den Matching-Prozess mit echten Vakanzen testen möchten — kostenlos, kein Vertrag, ehrliches Feedback.

Darf ich die Plattform in einem kurzen Gespräch (20 Min.) vorstellen?
Terminvorschlag: [DEMO-TERMIN 1] oder [DEMO-TERMIN 2]

${signature}`,
      riskLevel,
      riskNotes,
      status,
    }
  }

  // Generic
  return {
    subject: `Internationale Fachkräfte für ${employer.company_name} – Pilotanfrage`,
    body:
`${greeting},

CorridorWork ist eine Plattform, die internationale Fachkräfte mit Arbeitgebern in ${employer.country} zusammenbringt — Korridor: ${corridor}.

Wir befinden uns in der Pilotphase und suchen Unternehmen, die den Prozess gemeinsam mit uns testen möchten — kostenlos, kein Vertrag, ehrliches Feedback.

Darf ich die Plattform in einem kurzen Gespräch (20 Min.) vorstellen?
Terminvorschlag: [DEMO-TERMIN 1] oder [DEMO-TERMIN 2]

${signature}`,
    riskLevel,
    riskNotes,
    status,
  }
}

function buildLinkedInDraftText(employer: EmployerForDraft): {
  body: string
  riskLevel: RiskLevel
  riskNotes?: string
  status: DraftStatus
} {
  const corridor = inferIndustryCorridor(employer)
  const isCare = industryContains(employer.industry, 'pflege','care','nursing')
  const signature = buildSignature('linkedin')
  const hasNoEmail = !employer.contact_email

  const status: DraftStatus  = hasNoEmail ? 'needs_review' : 'generated'
  const riskNotes = hasNoEmail
    ? 'Kein Nachname bekannt — [NACHNAME] vor Versand aus LinkedIn-Profil ermitteln.'
    : undefined

  if (isCare) {
    return {
      body:
`Hallo [NACHNAME],

${employer.status === 'interested'
  ? 'vielen Dank für Ihre positive Reaktion auf unsere erste Anfrage.\n\n'
  : ''}CorridorWork bringt Pflegekräfte aus dem Ausland mit Pflegeeinrichtungen in ${employer.country} zusammen — Korridor: ${corridor}.

Die Plattform befindet sich in der Pilotphase — gemeinsames Testen, kostenlos, kein Vertrag, kein Garantieversprechen.

Hätten Sie 20 Minuten für ein kurzes Gespräch?
[DEMO-TERMIN 1] oder [DEMO-TERMIN 2]

${signature}`,
      riskLevel: 'medium',
      riskNotes,
      status,
    }
  }

  return {
    body:
`Hallo [NACHNAME],

CorridorWork ist eine Plattform für strukturiertes internationales Recruiting — Korridor: ${corridor}.

Wir testen den Prozess in der Pilotphase mit ausgewählten Unternehmen — kostenlos, kein Vertrag.

Wäre ein kurzes Gespräch (20 Min.) möglich?
[DEMO-TERMIN 1] oder [DEMO-TERMIN 2]

${signature}`,
    riskLevel: 'medium',
    riskNotes,
    status,
  }
}

// ── Core Functions ────────────────────────────────────────────────────────────

/**
 * Berechnet Follow-up-Datum: N Werktage ab fromDate.
 * Wochenenden werden übersprungen. Keine Feiertag-Logik.
 */
export function calculateFollowUpDate(fromDate: Date, businessDays = 3): Date {
  const date = new Date(fromDate)
  let remaining = businessDays
  while (remaining > 0) {
    date.setDate(date.getDate() + 1)
    const dow = date.getDay()
    if (dow !== 0 && dow !== 6) remaining-- // skip Sun(0) and Sat(6)
  }
  return date
}

/**
 * Prüft einen Draft auf Sicherheits-Constraints.
 * Gibt SafetyCheckResult zurück — safe=true bedeutet sendbar.
 */
export function validateDraftSafety(draft: {
  body: string
  subject?: string
}): SafetyCheckResult {
  const text = `${draft.subject ?? ''}\n${draft.body}`
  const issues: string[] = []

  // Personal names
  if (/brahim|ben abla/i.test(text))
    issues.push('Persönlicher Name "Brahim Ben Abla" gefunden — entfernen')
  if (/\[dein name\]|\[dein vollständiger name\]|\[ihr name\]/i.test(text))
    issues.push('Persönlicher Namens-Platzhalter gefunden — durch "CorridorWork Team" ersetzen')
  if (/\bich bin gründer\b|\bals gründer\b|\bmein name ist \[/i.test(text))
    issues.push('"Gründer" als persönliche Identifikation gefunden — neutralisieren')

  // Fake promises
  if (/\bgarantier|\bguaranteed placement\b|0[\s-]*risiko\b|zero[\s-]*risk\b/i.test(text))
    issues.push('Garantie-Versprechen gefunden — entfernen')
  if (/\b(fake|nicht.*echt)\b/i.test(text))
    issues.push('Möglicherweise unechte Inhalte')

  // Signature check
  if (!/corridorwork team/i.test(text))
    issues.push('Signatur "CorridorWork Team" fehlt — hinzufügen')

  // Mass-send indicators
  if (/massensend|bulk send|automated send|auto-send/i.test(text))
    issues.push('Massen-Versand-Hinweis gefunden — entfernen')

  const riskLevel: RiskLevel =
    issues.length === 0 ? 'low' :
    issues.length <= 2  ? 'medium' : 'high'

  return { safe: issues.length === 0, issues, riskLevel }
}

/**
 * Generiert Outreach-Drafts für einen Batch von Arbeitgebern.
 * Gibt reine Objekte zurück (keine DB-Calls).
 */
export function generateApprovalDraftsForBatch(
  employers: EmployerForDraft[],
): OutreachDraft[] {
  const drafts: OutreachDraft[] = []
  const followUpAt = calculateFollowUpDate(new Date(), 3)

  for (const emp of employers) {
    // No contact details at all → skip (research_contact action instead)
    if (!emp.contact_email && !emp.contact_phone) {
      // Only generate a LinkedIn draft if there's a way to reach them
      const liDraft = buildLinkedInDraftText(emp)
      drafts.push({
        pilot_employer_id: emp.id,
        channel: 'linkedin',
        recipient_name: emp.contact_name ?? undefined,
        body: liDraft.body,
        status: liDraft.status,
        approval_required: true,
        provider: 'linkedin_manual',
        risk_level: liDraft.riskLevel,
        risk_notes: liDraft.riskNotes,
        next_follow_up_at: followUpAt,
        demo: false,
      })
      continue
    }

    // Has email → email draft
    if (emp.contact_email) {
      const emailDraft = buildEmailDraftText(emp)
      drafts.push({
        pilot_employer_id: emp.id,
        channel: 'email',
        recipient_name: emp.contact_name ?? undefined,
        recipient_email: emp.contact_email,
        recipient_phone: emp.contact_phone ?? undefined,
        subject: emailDraft.subject,
        body: emailDraft.body,
        status: emailDraft.status,
        approval_required: true,
        provider: 'none', // Safe default — operator sets provider
        risk_level: emailDraft.riskLevel,
        risk_notes: emailDraft.riskNotes,
        next_follow_up_at: followUpAt,
        demo: false,
      })
    }
  }

  return drafts
}

/**
 * Erzeugt tagesaktuelle Operator-Aktionen aus Arbeitgebern und Drafts.
 */
export function generateDailyOperatorActions(
  employers: EmployerForDraft[],
  pendingDrafts: OutreachDraft[],
): OperatorAction[] {
  const actions: OperatorAction[] = []
  const now = new Date()

  // 1. Draft-Freigaben
  for (const draft of pendingDrafts) {
    if (draft.status === 'generated' || draft.status === 'needs_review') {
      const emp = employers.find((e) => e.id === draft.pilot_employer_id)
      const companyName = emp?.company_name ?? 'Unbekanntes Unternehmen'
      const isReview = draft.status === 'needs_review'

      actions.push({
        action_type: 'approve_outreach',
        entity_type: 'pilot_outreach_draft',
        entity_id: draft.id,
        title: `Draft prüfen: ${companyName} (${draft.channel})`,
        description: isReview
          ? `⚠️ Manuelle Prüfung nötig: ${draft.risk_notes ?? 'Bitte prüfen'}`
          : `Outreach-Draft für ${companyName} über ${draft.channel} freigeben oder ablehnen.`,
        priority: isReview ? 'high' : (emp?.status === 'interested' ? 'high' : 'medium'),
        status: 'pending',
        recommended_decision: isReview ? 'Erst prüfen, dann freigeben' : 'Freigeben',
        risk_level: draft.risk_level,
        due_at: now,
      })
    }
  }

  // 2. Research-Aufgaben (keine Kontaktdaten)
  for (const emp of employers) {
    if (!emp.contact_email && !emp.contact_phone) {
      actions.push({
        action_type: 'research_contact',
        entity_type: 'pilot_employer',
        entity_id: emp.id,
        title: `Kontaktdaten ermitteln: ${emp.company_name}`,
        description: `Keine E-Mail und kein Telefon vorhanden. Website / LinkedIn / XING prüfen und in DB nachtragen.`,
        priority: emp.status === 'contacted_manual' ? 'high' : 'medium',
        status: 'pending',
        recommended_decision: 'Recherchieren und nachtragen',
        risk_level: 'low',
      })
    }
  }

  // 3. Follow-ups fällig (Drafts mit next_follow_up_at in der Vergangenheit)
  for (const draft of pendingDrafts) {
    if (
      draft.status === 'sent' &&
      draft.next_follow_up_at &&
      draft.next_follow_up_at <= now
    ) {
      const emp = employers.find((e) => e.id === draft.pilot_employer_id)
      const companyName = emp?.company_name ?? 'Unbekanntes Unternehmen'
      actions.push({
        action_type: 'create_follow_up',
        entity_type: 'pilot_outreach_draft',
        entity_id: draft.id,
        title: `Follow-up fällig: ${companyName}`,
        description: `Kein Follow-up seit Versand. Antwort klassifizieren oder erneut kontaktieren.`,
        priority: 'high',
        status: 'pending',
        recommended_decision: 'Follow-up vorbereiten',
        risk_level: 'low',
        due_at: draft.next_follow_up_at,
      })
    }
  }

  return prioritizeOperatorActions(actions)
}

/**
 * Priorisiert Operator-Aktionen: critical → high → medium → low,
 * dann nach due_at (früher = höher).
 */
export function prioritizeOperatorActions(actions: OperatorAction[]): OperatorAction[] {
  const order: Record<Priority, number> = {
    critical: 0, high: 1, medium: 2, low: 3,
  }
  return [...actions].sort((a, b) => {
    const pd = order[a.priority] - order[b.priority]
    if (pd !== 0) return pd
    if (a.due_at && b.due_at) return a.due_at.getTime() - b.due_at.getTime()
    if (a.due_at) return -1
    if (b.due_at) return 1
    return 0
  })
}

/**
 * Gibt die nächste beste Aktion für einen einzelnen Arbeitgeber zurück.
 */
export function getNextBestActionForEmployer(
  employer: EmployerForDraft,
): OperatorAction {
  const hasContacts = !!(employer.contact_email || employer.contact_phone)

  if (!hasContacts) {
    return {
      action_type: 'research_contact',
      entity_type: 'pilot_employer',
      entity_id: employer.id,
      title: `Kontaktdaten ermitteln: ${employer.company_name}`,
      description: 'Keine Kontaktdaten vorhanden. Recherche notwendig.',
      priority: employer.status === 'contacted_manual' ? 'high' : 'medium',
      status: 'pending',
      recommended_decision: 'Recherchieren',
      risk_level: 'low',
    }
  }

  if (employer.status === 'identified') {
    return {
      action_type: 'approve_outreach',
      entity_type: 'pilot_employer',
      entity_id: employer.id,
      title: `Erstkontakt-Draft freigeben: ${employer.company_name}`,
      description: 'Noch nicht kontaktiert. Cold-Outreach-Draft überprüfen und freigeben.',
      priority: 'medium',
      status: 'pending',
      recommended_decision: 'Draft prüfen und freigeben',
      risk_level: 'medium',
    }
  }

  if (employer.status === 'interested') {
    return {
      action_type: 'approve_outreach',
      entity_type: 'pilot_employer',
      entity_id: employer.id,
      title: `Follow-up-Draft freigeben: ${employer.company_name}`,
      description: 'Arbeitgeber hat Interesse signalisiert. Demo-Termin-Anfrage freigeben.',
      priority: 'high',
      status: 'pending',
      recommended_decision: 'Freigeben',
      risk_level: 'low',
    }
  }

  if (employer.status === 'contacted_manual') {
    return {
      action_type: 'create_follow_up',
      entity_type: 'pilot_employer',
      entity_id: employer.id,
      title: `Follow-up vorbereiten: ${employer.company_name}`,
      description: 'Bereits kontaktiert. Follow-up-Draft erstellen und freigeben.',
      priority: 'high',
      status: 'pending',
      recommended_decision: 'Follow-up draft generieren',
      risk_level: 'low',
    }
  }

  return {
    action_type: 'review_risk',
    entity_type: 'pilot_employer',
    entity_id: employer.id,
    title: `Status prüfen: ${employer.company_name}`,
    description: `Aktueller Status: ${employer.status}. Nächste Aktion manuell bestimmen.`,
    priority: 'low',
    status: 'pending',
    recommended_decision: 'Manuell prüfen',
    risk_level: 'low',
  }
}

/**
 * State-Transition: genehmigt eine Aktion.
 * Verändert keine DB — gibt nur das neue Objekt zurück.
 */
export function approveAction(
  action: OperatorAction,
  approvedBy?: string,
): OperatorAction {
  return {
    ...action,
    status: 'approved',
    completed_at: new Date(),
    updated_at: new Date(),
    recommended_decision: approvedBy
      ? `Genehmigt von ${approvedBy}`
      : action.recommended_decision,
  }
}

/**
 * State-Transition: lehnt eine Aktion ab.
 */
export function rejectAction(action: OperatorAction): OperatorAction {
  return {
    ...action,
    status: 'rejected',
    completed_at: new Date(),
    updated_at: new Date(),
  }
}

/**
 * State-Transition: verschiebt eine Aktion.
 */
export function postponeAction(
  action: OperatorAction,
  dueAt?: Date,
): OperatorAction {
  return {
    ...action,
    status: 'postponed',
    due_at: dueAt ?? calculateFollowUpDate(new Date(), 1),
    updated_at: new Date(),
  }
}

/**
 * Gibt einen ExecutionPlan zurück — was als nächstes passieren darf.
 * Führt NICHTS aus (keine Seiteneffekte).
 */
export function executeApprovedAction(
  draft: OutreachDraft,
  providerConfig: ProviderConfig,
): ExecutionPlan {
  // Rule 1: Must be approved
  if (draft.status !== 'approved') {
    return {
      canExecute: false,
      action: 'blocked',
      reason: 'Blocked',
      blockedReason: `Draft nicht freigegeben (status: ${draft.status}). Freigabe erforderlich.`,
      draftUpdates: {},
    }
  }

  // Rule 2: Non-email channels → manual platform only (no API send)
  if (draft.channel === 'linkedin' || draft.channel === 'whatsapp' || draft.channel === 'phone') {
    return {
      canExecute: true,
      action: 'mark_manual_platform_ready',
      reason: `${draft.channel} wird nicht automatisch gesendet — als "Bereit für manuellen Versand" markiert.`,
      draftUpdates: {
        status: 'ready_for_manual_platform_send',
        provider: draft.channel === 'linkedin' ? 'linkedin_manual' : 'manual_platform',
      },
    }
  }

  // Rule 3: Email — recipient required
  if (!draft.recipient_email) {
    return {
      canExecute: false,
      action: 'blocked',
      reason: 'Blocked',
      blockedReason: 'E-Mail-Adresse des Empfängers fehlt.',
      draftUpdates: {},
    }
  }

  // Rule 4: Email — provider must be configured
  if (providerConfig.provider === 'none') {
    return {
      canExecute: false,
      action: 'blocked',
      reason: 'Blocked',
      blockedReason:
        'E-Mail-Provider nicht konfiguriert (OUTREACH_EMAIL_PROVIDER=none). ' +
        'Bitte OUTREACH_EMAIL_PROVIDER=resend oder smtp in .env setzen.',
      draftUpdates: {
        error_message: 'Provider not configured',
      },
    }
  }

  // Rule 5: Safety check
  const safety = validateDraftSafety({ body: draft.body, subject: draft.subject })
  if (!safety.safe) {
    return {
      canExecute: false,
      action: 'blocked',
      reason: 'Blocked',
      blockedReason: `Safety-Check fehlgeschlagen: ${safety.issues.join('; ')}`,
      draftUpdates: {
        risk_level: safety.riskLevel,
        risk_notes: safety.issues.join('; '),
      },
    }
  }

  // All checks passed → send email
  return {
    canExecute: true,
    action: 'send_email',
    reason: `E-Mail kann über Provider "${providerConfig.provider}" gesendet werden.`,
    draftUpdates: {},
  }
}

/**
 * Erstellt einen Audit-Log-Eintrag (zum Speichern in system_logs).
 */
export function createAuditLogForAction(
  action: OperatorAction,
  draft?: OutreachDraft,
): AuditLogEntry {
  const draftInfo = draft
    ? ` | Draft: ${draft.id ?? 'neu'} | Kanal: ${draft.channel} | Status: ${draft.status}`
    : ''

  return {
    agent_name: 'operator_autopilot',
    status: action.status === 'rejected' ? 'warning' :
            action.status === 'approved' ? 'success' : 'info',
    message:
      `[${action.action_type}] ${action.title} → ${action.status}${draftInfo}`,
    metadata: {
      action_type: action.action_type,
      entity_type: action.entity_type,
      entity_id: action.entity_id,
      priority: action.priority,
      risk_level: action.risk_level,
      ...(draft ? { draft_channel: draft.channel, draft_provider: draft.provider } : {}),
    },
  }
}

/**
 * Erzeugt eine tägliche Zusammenfassung für das Dashboard.
 */
export function getDailyActionSummary(
  employers: EmployerForDraft[],
  pendingDrafts: OutreachDraft[],
): DailyActionSummary {
  const actions = generateDailyOperatorActions(employers, pendingDrafts)
  return {
    actions: actions.slice(0, 5), // Top 5 für die Console
    urgentCount: actions.filter((a) => a.priority === 'critical' || a.priority === 'high').length,
    pendingDraftCount: actions.filter((a) => a.action_type === 'approve_outreach').length,
    researchCount: actions.filter((a) => a.action_type === 'research_contact').length,
    followUpCount: actions.filter((a) => a.action_type === 'create_follow_up').length,
  }
}

/**
 * Prüft ob ein Status-Wert für pilot_employers gültig ist.
 * Stellt sicher, dass 'draft' und 'demo_requested' NIEMALS verwendet werden.
 */
export function isValidPilotEmployerStatus(status: string): status is ValidPilotEmployerStatus {
  if (FORBIDDEN_PILOT_STATUSES.includes(status as never)) return false
  return VALID_PILOT_EMPLOYER_STATUSES.includes(status as ValidPilotEmployerStatus)
}
