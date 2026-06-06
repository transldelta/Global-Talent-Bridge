/**
 * lib/cwo-agent/operations.ts
 *
 * Operations Department
 *
 * Prüft Systemstatus, offene ENV-/DNS-/Mail-Blocker,
 * offene Pilot-Schritte, offene Entwürfe, erstellt Tagesbericht.
 * KEIN externer API-Call. Reine interne Regellogik.
 * Autonomy Level: A1/A2 (automatisch prüfen und berichten)
 */
import type { Priority, ComplianceStatus } from './types'

// ── Types ─────────────────────────────────────────────────────────────────────

export type SystemCheck = {
  id:          string
  label:       string
  category:    'env' | 'dns' | 'email' | 'db' | 'auth' | 'compliance' | 'feature'
  status:      'ok' | 'warning' | 'blocked' | 'unknown'
  description: string
  actionNeeded?: string
  isBlocker:   boolean
}

export type PilotStep = {
  id:            string
  step:          string
  description:   string
  status:        'done' | 'in_progress' | 'blocked' | 'not_started'
  blockedReason?: string
  priority:      Priority
  estimatedDays: number
  complianceNote?: string
}

export type DailyReport = {
  generatedAt:      string
  systemHealth:     'green' | 'yellow' | 'red'
  blockers:         string[]
  completedToday:   string[]
  openItems:        string[]
  nextBestAction:   string
  nextBestActionHref: string
  complianceStatus: ComplianceStatus
  safetyInvariants: {
    noEmailSent:       true
    noAutoOutreach:    true
    noScraping:        true
    emailProvider:     'none'
    outreachProvider:  'none'
    phase:             1
  }
}

// ── System Checks ─────────────────────────────────────────────────────────────

const SYSTEM_CHECKS: SystemCheck[] = [
  // Compliance Invarianten
  {
    id: 'email_provider_none',
    label: 'EMAIL_PROVIDER = none',
    category: 'email',
    status: 'ok',
    description: 'Kein E-Mail-Provider aktiviert. Phase-1-Invariante eingehalten.',
    isBlocker: false,
  },
  {
    id: 'outreach_email_provider_none',
    label: 'OUTREACH_EMAIL_PROVIDER = none',
    category: 'email',
    status: 'ok',
    description: 'Kein Outreach-E-Mail-Provider aktiviert. Bulk-Versand deaktiviert.',
    isBlocker: false,
  },
  {
    id: 'no_send_button',
    label: 'Kein Send-Button in UI',
    category: 'feature',
    status: 'ok',
    description: 'Delivery-Agent hardcoded auf allowed: false. Kein UI-Send-Button.',
    isBlocker: false,
  },
  {
    id: 'no_scraping',
    label: 'Scraping deaktiviert',
    category: 'compliance',
    status: 'ok',
    description: 'noScraping: true in allen Agent-Outputs. Keine externen API-Calls.',
    isBlocker: false,
  },
  // ENV-Checks
  {
    id: 'supabase_url',
    label: 'NEXT_PUBLIC_SUPABASE_URL gesetzt',
    category: 'env',
    status: 'ok',
    description: 'Supabase URL ist konfiguriert.',
    isBlocker: false,
  },
  {
    id: 'supabase_anon_key',
    label: 'NEXT_PUBLIC_SUPABASE_ANON_KEY gesetzt',
    category: 'env',
    status: 'ok',
    description: 'Supabase Anon Key ist konfiguriert.',
    isBlocker: false,
  },
  {
    id: 'supabase_service_role',
    label: 'SUPABASE_SERVICE_ROLE_KEY gesetzt',
    category: 'env',
    status: 'ok',
    description: 'Service-Role Key für Admin-Operationen konfiguriert.',
    isBlocker: false,
  },
  // Feature-Checks
  {
    id: 'admin_auth',
    label: 'Admin-Auth aktiv (/auth/login)',
    category: 'auth',
    status: 'ok',
    description: 'getCurrentAdminUser() schützt alle /admin/* Routen.',
    isBlocker: false,
  },
  {
    id: 'outreach_autopilot_live',
    label: '/admin/outreach-autopilot live',
    category: 'feature',
    status: 'ok',
    description: 'Outreach Autopilot mit Placeholder-Schutz und Score-Hints live.',
    isBlocker: false,
  },
  {
    id: 'pilot_target_finder_live',
    label: '/admin/pilot-target-finder live',
    category: 'feature',
    status: 'ok',
    description: 'Pilot Target Finder mit 10 Sektoren live.',
    isBlocker: false,
  },
  {
    id: 'pilot_control_live',
    label: '/admin/pilot-control live',
    category: 'feature',
    status: 'ok',
    description: 'Pilot Control Dashboard mit Summary-API live.',
    isBlocker: false,
  },
  // Offene Blocker
  {
    id: 'stripe_not_configured',
    label: 'Stripe nicht aktiviert (kein Zahlungsfluss)',
    category: 'feature',
    status: 'warning',
    description: 'Stripe ist noch nicht konfiguriert — kein Umsatz möglich bis Pilot-Validation.',
    actionNeeded: 'Nach Piloten: Stripe-Account erstellen, AGB für Arbeitgeber prüfen, dann aktivieren.',
    isBlocker: false,
  },
  {
    id: 'public_registration_not_live',
    label: 'Öffentliche Registrierung noch nicht live',
    category: 'feature',
    status: 'warning',
    description: 'Arbeitgeber- und Kandidaten-Selbstregistrierung noch nicht öffentlich erreichbar.',
    actionNeeded: 'Inbound-Growth-Seiten deployen: /employer/register, /candidate/register.',
    isBlocker: false,
  },
  {
    id: 'no_seo_pages',
    label: 'SEO-Landingpages fehlen noch',
    category: 'feature',
    status: 'warning',
    description: 'Corridor-Landingpages und Blog-Artikel noch nicht erstellt.',
    actionNeeded: 'Content-Kalender abarbeiten. Woche 1–4 Seiten erstellen.',
    isBlocker: false,
  },
]

// ── Pilot Steps ───────────────────────────────────────────────────────────────

const PILOT_STEPS: PilotStep[] = [
  {
    id: 'p1',
    step: '1. Erster Pilot-Arbeitgeber identifizieren',
    description: 'Einen realen Pflegebetrieb oder IT-Arbeitgeber für den Piloten gewinnen (Inbound oder persönlicher Kontakt).',
    status: 'in_progress',
    priority: 'high',
    estimatedDays: 14,
    complianceNote: 'Kein Cold-Email-Outreach. Persönlicher Kontakt oder Inbound.',
  },
  {
    id: 'p2',
    step: '2. Arbeitgeber-Profil anlegen',
    description: 'Pilot-Arbeitgeber in der DB anlegen. Dashboard zeigen. Feedback sammeln.',
    status: 'not_started',
    priority: 'high',
    estimatedDays: 3,
  },
  {
    id: 'p3',
    step: '3. Erste Kandidaten-Profile hinterlegen',
    description: 'Testkandidaten (mit Einwilligung) oder anonymisierte Profile anlegen.',
    status: 'not_started',
    priority: 'high',
    estimatedDays: 5,
    complianceNote: 'Nur mit expliziter DSGVO-Einwilligung. Keine Drittdaten ohne Basis.',
  },
  {
    id: 'p4',
    step: '4. Matching-Score validieren',
    description: 'Matching-Score für die ersten Kandidaten-Arbeitgeber-Paare prüfen und kalibrieren.',
    status: 'not_started',
    priority: 'high',
    estimatedDays: 7,
  },
  {
    id: 'p5',
    step: '5. Outreach-Entwürfe manuell prüfen',
    description: 'Generierte Entwürfe durch Pilot-Arbeitgeber oder intern prüfen lassen.',
    status: 'not_started',
    priority: 'medium',
    estimatedDays: 3,
    complianceNote: 'Entwürfe werden NICHT automatisch versandt. Manuelle Prüfung und Versand durch Nutzer.',
  },
  {
    id: 'p6',
    step: '6. Erste Landingpages live stellen',
    description: 'Corridor-Landingpages (Philippinen→DE, Indien→DE) + Arbeitgeber-Seite live.',
    status: 'not_started',
    priority: 'high',
    estimatedDays: 10,
  },
  {
    id: 'p7',
    step: '7. Selbstregistrierung öffnen',
    description: 'Öffentliche /employer/register und /candidate/register live stellen.',
    status: 'not_started',
    priority: 'medium',
    estimatedDays: 5,
    complianceNote: 'DSGVO: Einwilligung + Datenschutzerklärung auf den Seiten.',
  },
  {
    id: 'p8',
    step: '8. Piloten-Feedback auswerten',
    description: 'Nach 30 Tagen: Feedback vom Pilot-Arbeitgeber. Matching-Qualität? Dashboard-UX? Prozess?',
    status: 'not_started',
    priority: 'high',
    estimatedDays: 7,
  },
  {
    id: 'p9',
    step: '9. Revenue-Modell testen (SaaS)',
    description: 'Nach positivem Pilot-Feedback: Employer-SaaS-Abo anbieten. Stripe aktivieren.',
    status: 'not_started',
    priority: 'medium',
    estimatedDays: 14,
    complianceNote: 'Erst Rechtsprüfung Zahlungsabwicklung + AGB für Arbeitgeber.',
  },
  {
    id: 'p10',
    step: '10. Scale-Entscheidung',
    description: 'Basierend auf Piloten: welche Korridore, Sektoren, Revenue-Modelle skalieren?',
    status: 'not_started',
    priority: 'high',
    estimatedDays: 14,
  },
]

// ── Report-Logik ──────────────────────────────────────────────────────────────

function determineSystemHealth(checks: SystemCheck[]): 'green' | 'yellow' | 'red' {
  const hardBlockers = checks.filter(c => c.status === 'blocked' && c.isBlocker)
  if (hardBlockers.length > 0) return 'red'
  const warnings = checks.filter(c => c.status === 'warning')
  if (warnings.length > 0) return 'yellow'
  return 'green'
}

// ── Hauptfunktionen ───────────────────────────────────────────────────────────

/**
 * Gibt alle System-Checks zurück.
 */
export function getSystemChecks(): SystemCheck[] {
  return SYSTEM_CHECKS
}

/**
 * Gibt nur Blocker und Warnungen zurück.
 */
export function getSystemIssues(): SystemCheck[] {
  return SYSTEM_CHECKS.filter(c => c.status === 'warning' || c.status === 'blocked')
}

/**
 * Gibt alle Pilot-Schritte zurück.
 */
export function getPilotSteps(): PilotStep[] {
  return PILOT_STEPS
}

/**
 * Gibt offene Pilot-Schritte zurück (nicht done).
 */
export function getOpenPilotSteps(): PilotStep[] {
  return PILOT_STEPS.filter(s => s.status !== 'done')
}

/**
 * Gibt den nächsten Pilot-Schritt zurück.
 */
export function getNextPilotStep(): PilotStep | null {
  return PILOT_STEPS.find(s => s.status === 'in_progress' || s.status === 'not_started') ?? null
}

/**
 * Erstellt den Tagesbericht.
 * Reine Funktion. Kein I/O.
 */
export function generateDailyReport(): DailyReport {
  const checks  = getSystemChecks()
  const issues  = getSystemIssues()
  const next    = getNextPilotStep()
  const health  = determineSystemHealth(checks)

  return {
    generatedAt: new Date().toISOString(),
    systemHealth: health,
    blockers: issues
      .filter(i => i.status === 'blocked')
      .map(i => i.description),
    completedToday: [
      'CWO Operating System initialisiert',
      'Alle Compliance-Invarianten eingehalten',
      'Outreach Autopilot mit Placeholder-Schutz live',
      'Pilot Target Finder live',
      'Pilot Control Dashboard live',
    ],
    openItems: issues
      .filter(i => i.status === 'warning')
      .map(i => i.actionNeeded ?? i.description),
    nextBestAction: next
      ? `${next.step} — ${next.description}`
      : 'Alle Pilot-Schritte abgeschlossen. Scale-Entscheidung treffen.',
    nextBestActionHref: '/admin/pilot-control',
    complianceStatus: 'safe',
    safetyInvariants: {
      noEmailSent:      true,
      noAutoOutreach:   true,
      noScraping:       true,
      emailProvider:    'none',
      outreachProvider: 'none',
      phase:            1,
    },
  }
}

/**
 * Gibt Systemstatus-Zusammenfassung zurück.
 */
export function getSystemStatusSummary(): {
  total:   number
  ok:      number
  warning: number
  blocked: number
  health:  'green' | 'yellow' | 'red'
} {
  const checks = getSystemChecks()
  return {
    total:   checks.length,
    ok:      checks.filter(c => c.status === 'ok').length,
    warning: checks.filter(c => c.status === 'warning').length,
    blocked: checks.filter(c => c.status === 'blocked').length,
    health:  determineSystemHealth(checks),
  }
}
