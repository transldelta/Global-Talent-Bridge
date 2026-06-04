import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'

// ─────────────────────────────────────────────────────────────────────────────
// Pilot Launch Agent — Sprint G
//
// Aufgaben:
//  1. Follow-ups erkennen (next_follow_up_at ≤ heute)
//  2. Wichtigste Pilot-Arbeitgeber priorisieren
//  3. Offene Aufgaben erzeugen (ohne Duplikate)
//  4. CEO-Suggestions erstellen
//  5. system_logs schreiben
//
// Kein externer Versand. Nur interne Daten und Empfehlungen.
// ─────────────────────────────────────────────────────────────────────────────

const DEDUP_WINDOW_HOURS = 24

type PilotEmployer = {
  id: string
  company_name: string
  country: string
  industry: string | null
  status: string
  interest_level: string
  next_step: string | null
  next_follow_up_at: string | null
  notes: string | null
}

type PilotTask = {
  id: string
  title: string
  status: string
}

type AgentResult = {
  followUpsDue:       number
  tasksCreated:       number
  suggestionsCreated: number
  employersActive:    number
  candidatesTotal:    number
  feedbackCritical:   number
}

// ── Hilfsfunktion: Suggestion-Dedup ─────────────────────────────────────────
async function suggestionExists(
  supabase: ReturnType<typeof createAdminClient>,
  title: string
): Promise<boolean> {
  const since = new Date(Date.now() - DEDUP_WINDOW_HOURS * 3_600_000).toISOString()
  const { count } = await supabase
    .from('agent_suggestions')
    .select('id', { count: 'exact', head: true })
    .eq('title', title)
    .gte('created_at', since)
  return (count ?? 0) > 0
}

// ── Hilfsfunktion: Pilot-Task-Dedup ─────────────────────────────────────────
async function pilotTaskExists(
  supabase: ReturnType<typeof createAdminClient>,
  title: string
): Promise<boolean> {
  const { count } = await supabase
    .from('pilot_tasks')
    .select('id', { count: 'exact', head: true })
    .eq('title', title)
    .eq('status', 'open')
  return (count ?? 0) > 0
}

// ── Hauptfunktion ────────────────────────────────────────────────────────────
export async function runPilotLaunchAgent(): Promise<AgentResult> {
  const supabase = createAdminClient()
  const result: AgentResult = {
    followUpsDue: 0, tasksCreated: 0, suggestionsCreated: 0,
    employersActive: 0, candidatesTotal: 0, feedbackCritical: 0,
  }

  // ── 1. Daten laden ────────────────────────────────────────────────────────
  const now = new Date().toISOString()

  const [
    employersRes, candidatesRes, tasksOpenRes, feedbackRes,
  ] = await Promise.all([
    supabase.from('pilot_employers').select('*').neq('status', 'rejected'),
    supabase.from('pilot_candidates').select('id, status, profession, origin_country, quality_score').neq('status', 'rejected'),
    supabase.from('pilot_tasks').select('id, title, status').eq('status', 'open'),
    supabase.from('pilot_feedback').select('id, priority, status').in('priority', ['high', 'critical']).eq('status', 'new'),
  ])

  const employers: PilotEmployer[] = (employersRes.data ?? []) as PilotEmployer[]
  const candidates = candidatesRes.data ?? []
  const openTasks: PilotTask[] = (tasksOpenRes.data ?? []) as PilotTask[]
  const critFeedback = feedbackRes.data ?? []

  result.employersActive  = employers.filter(e => e.status === 'active_pilot').length
  result.candidatesTotal  = candidates.length
  result.feedbackCritical = critFeedback.length

  // ── 2. Follow-ups fällig ──────────────────────────────────────────────────
  const followUpsDue = employers.filter(e =>
    e.next_follow_up_at && e.next_follow_up_at <= now
  )
  result.followUpsDue = followUpsDue.length

  // ── 3. Neue Pilot-Tasks für Follow-ups ────────────────────────────────────
  for (const emp of followUpsDue) {
    const taskTitle = `Follow-up: ${emp.company_name}`
    const exists = await pilotTaskExists(supabase, taskTitle)
    if (!exists) {
      await supabase.from('pilot_tasks').insert({
        title:       taskTitle,
        description: `Fälliges Follow-up für ${emp.company_name} (${emp.country}) — Status: ${emp.status}. Nächster Schritt: ${emp.next_step ?? 'nicht definiert'}`,
        type:        'follow_up',
        priority:    emp.interest_level === 'very_high' || emp.interest_level === 'high' ? 'critical' : 'high',
        status:      'open',
        related_employer_id: emp.id,
        created_by:  'pilot-launch-agent',
      })
      result.tasksCreated++
    }
  }

  // ── 4. Demo-Prep-Tasks für demo_scheduled Arbeitgeber ────────────────────
  const demoScheduled = employers.filter(e => e.status === 'demo_scheduled')
  for (const emp of demoScheduled) {
    const taskTitle = `Demo vorbereiten: ${emp.company_name}`
    const exists = await pilotTaskExists(supabase, taskTitle)
    if (!exists) {
      await supabase.from('pilot_tasks').insert({
        title:       taskTitle,
        description: `Demo vorbereiten für ${emp.company_name} (${emp.industry ?? emp.country}). Interesse-Level: ${emp.interest_level}.`,
        type:        'demo_prep',
        priority:    'critical',
        status:      'open',
        related_employer_id: emp.id,
        created_by:  'pilot-launch-agent',
        due_at:      new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(),
      })
      result.tasksCreated++
    }
  }

  // ── 5. CEO-Suggestions ────────────────────────────────────────────────────
  const interested = employers.filter(e =>
    ['interested', 'demo_scheduled', 'onboarding', 'active_pilot'].includes(e.status)
  )

  // Suggestion A: Übersicht aktive Pipeline
  const suggTitle_A = `Pilot-Pipeline: ${interested.length} Arbeitgeber in aktiven Phasen`
  if (interested.length > 0 && !(await suggestionExists(supabase, suggTitle_A))) {
    const topCompanies = interested.slice(0, 3).map(e => e.company_name).join(', ')
    await supabase.from('agent_suggestions').insert({
      department_slug:   'ceo_control',
      title:             suggTitle_A,
      description:       `Die Pilot-Pipeline enthält ${interested.length} aktive Arbeitgeber: ${topCompanies}${interested.length > 3 ? ' u.a.' : ''}. ${demoScheduled.length} Demo-Termin(e) ausstehend.`,
      category:          'pilot_launch',
      priority:          demoScheduled.length > 0 ? 'critical' : 'high',
      status:            'suggested',
      impact_score:      90,
      effort_score:      20,
      risk_score:        10,
      expected_benefit:  'Erste echte Pilot-Kunden gewinnen — kritisch für Revenue-Validierung',
      action_type:       'review',
      requires_approval: false,
    })
    result.suggestionsCreated++
  }

  // Suggestion B: Follow-ups dringend
  if (followUpsDue.length > 0) {
    const suggTitle_B = `${followUpsDue.length} Pilot-Follow-up(s) überfällig`
    if (!(await suggestionExists(supabase, suggTitle_B))) {
      await supabase.from('agent_suggestions').insert({
        department_slug:   'ceo_control',
        title:             suggTitle_B,
        description:       `Folgende Arbeitgeber haben überfällige Follow-ups: ${followUpsDue.slice(0,3).map(e => e.company_name).join(', ')}. Sofortige Kontaktaufnahme empfohlen.`,
        category:          'pilot_launch',
        priority:          'critical',
        status:            'suggested',
        impact_score:      95,
        effort_score:      10,
        risk_score:        30,
        expected_benefit:  'Interesse nicht verlieren — Follow-up ist entscheidend für Konversionsrate',
        action_type:       'urgent_action',
        requires_approval: false,
      })
      result.suggestionsCreated++
    }
  }

  // Suggestion C: Kandidaten-Qualität
  const highQualCandidates = candidates.filter(
    (c: { quality_score: number; status: string }) =>
      c.quality_score >= 80 && ['identified', 'interested'].includes(c.status)
  )
  if (highQualCandidates.length >= 3) {
    const suggTitle_C = `${highQualCandidates.length} hochwertige Pilot-Kandidaten verfügbar`
    if (!(await suggestionExists(supabase, suggTitle_C))) {
      await supabase.from('agent_suggestions').insert({
        department_slug:   'ceo_control',
        title:             suggTitle_C,
        description:       `${highQualCandidates.length} Pilot-Kandidaten mit Quality-Score ≥ 80 sind verfügbar. Diese können direkt für Pilot-Demo mit Arbeitgebern genutzt werden.`,
        category:          'pilot_launch',
        priority:          'high',
        status:            'suggested',
        impact_score:      80,
        effort_score:      30,
        risk_score:        15,
        expected_benefit:  'Konkrete Kandidatenprofile erhöhen Arbeitgeber-Konversionsrate signifikant',
        action_type:       'review',
        requires_approval: false,
      })
      result.suggestionsCreated++
    }
  }

  // Suggestion D: Kritisches Feedback bearbeiten
  if (critFeedback.length > 0) {
    const suggTitle_D = `${critFeedback.length} kritisches/hohes Feedback wartet auf Bearbeitung`
    if (!(await suggestionExists(supabase, suggTitle_D))) {
      await supabase.from('agent_suggestions').insert({
        department_slug:   'ceo_control',
        title:             suggTitle_D,
        description:       `${critFeedback.length} Feedback-Einträge mit Priorität high/critical sind unbearbeitet. Schnelle Reaktion auf Pilot-Feedback ist entscheidend für Kundenbindung.`,
        category:          'pilot_launch',
        priority:          'high',
        status:            'suggested',
        impact_score:      75,
        effort_score:      25,
        risk_score:        40,
        expected_benefit:  'Pilot-Kunden-Zufriedenheit sicherstellen — direkt relevant für Weiterempfehlung',
        action_type:       'review',
        requires_approval: false,
      })
      result.suggestionsCreated++
    }
  }

  // ── 6. system_logs ───────────────────────────────────────────────────────
  await supabase.from('system_logs').insert({
    action:  'pilot_launch_agent_run',
    details: `Pilot Launch Agent abgeschlossen: ${result.followUpsDue} Follow-ups fällig, ${result.tasksCreated} Tasks erstellt, ${result.suggestionsCreated} Suggestions, ${employers.length} Arbeitgeber, ${result.candidatesTotal} Kandidaten`,
  })

  return result
}
