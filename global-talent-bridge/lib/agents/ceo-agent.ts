import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'

type SuggestionInsert = {
  department_slug: string
  title: string
  description: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  impact_score: number
  effort_score: number
  risk_score: number
  expected_benefit?: string
  risk_note?: string
  action_type?: string
  action_payload?: Record<string, unknown>
  requires_approval: boolean
}

type NotificationInsert = {
  title: string
  message: string
  severity: 'info' | 'success' | 'warning' | 'critical'
  department_slug?: string
}

/**
 * CEO Control Agent
 * Liest Live-KPIs, erkennt wichtige Signale, erstellt Vorschläge + Notifications.
 * Keine externen Aktionen. Keine E-Mails. Nur interne Analyse + DB-Writes.
 */
export async function runCeoAgent(): Promise<{
  suggestions: number
  notifications: number
}> {
  const supabase = createAdminClient()

  // ── Live-KPIs lesen ───────────────────────────────────────────────────────
  const [
    candidatesRes,
    employersRes,
    activeJobsRes,
    totalMatchesRes,
    contactRequestsNewRes,
    contactRequestsFollowupRes,
    outreachTotalRes,
    outreachInterestedRes,
    outreachFollowupRes,
    salesLeadsNewRes,
  ] = await Promise.all([
    supabase.from('candidates').select('*', { count: 'exact', head: true }),
    supabase.from('employers').select('*', { count: 'exact', head: true }),
    supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('matches').select('*', { count: 'exact', head: true }),
    supabase.from('contact_requests').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase
      .from('contact_requests')
      .select('*', { count: 'exact', head: true })
      .not('next_follow_up_at', 'is', null)
      .lte('next_follow_up_at', new Date().toISOString()),
    supabase.from('outreach_targets').select('*', { count: 'exact', head: true }),
    supabase.from('outreach_targets').select('*', { count: 'exact', head: true }).eq('status', 'interested'),
    supabase
      .from('outreach_targets')
      .select('*', { count: 'exact', head: true })
      .not('next_follow_up_at', 'is', null)
      .lte('next_follow_up_at', new Date().toISOString()),
    supabase.from('sales_leads').select('*', { count: 'exact', head: true }).eq('status', 'new'),
  ])

  const candidates = candidatesRes.count ?? 0
  const employers = employersRes.count ?? 0
  const activeJobs = activeJobsRes.count ?? 0
  const totalMatches = totalMatchesRes.count ?? 0
  const newLeads = contactRequestsNewRes.count ?? 0
  const followupsDue = contactRequestsFollowupRes.count ?? 0
  const outreachTotal = outreachTotalRes.count ?? 0
  const outreachInterested = outreachInterestedRes.count ?? 0
  const outreachFollowup = outreachFollowupRes.count ?? 0
  const newSalesLeads = salesLeadsNewRes.count ?? 0

  // ── Bestehende suggested-Vorschläge laden (Deduplication) ─────────────────
  const { data: existingSuggestions } = await supabase
    .from('agent_suggestions')
    .select('title')
    .eq('status', 'suggested')

  const existingTitles = new Set((existingSuggestions ?? []).map((s: { title: string }) => s.title))

  const suggestionsToInsert: SuggestionInsert[] = []
  const notificationsToInsert: NotificationInsert[] = []

  // ── Signalanalyse ─────────────────────────────────────────────────────────

  // 1. Kritisch: keine aktiven Jobs → Matching unmöglich
  if (activeJobs === 0) {
    const title = '⚠️ Keine aktiven Jobs — Matching nicht möglich'
    if (!existingTitles.has(title)) {
      suggestionsToInsert.push({
        department_slug: 'ceo_control',
        title,
        description:
          'Es gibt aktuell keine aktiven Stellenanzeigen. Ohne aktive Jobs können Kandidaten nicht gematcht werden. Einen Arbeitgeber überzeugen, eine Stelle zu veröffentlichen, oder selbst eine Demostelle erstellen.',
        category: 'product',
        priority: 'critical',
        impact_score: 10,
        effort_score: 3,
        risk_score: 1,
        expected_benefit: 'Matching wird möglich, Plattform-Wert steigt',
        requires_approval: false,
      })
      notificationsToInsert.push({
        title: '🚨 Keine aktiven Jobs',
        message: 'Es gibt keine aktiven Stellenanzeigen. Matching ist blockiert.',
        severity: 'critical',
        department_slug: 'ceo_control',
      })
    }
  }

  // 2. Wenig Arbeitgeber → Wachstum priorisieren
  if (employers < 3) {
    const title = '🏢 Wenig Arbeitgeber — Employer-Akquise priorisieren'
    if (!existingTitles.has(title)) {
      suggestionsToInsert.push({
        department_slug: 'ceo_control',
        title,
        description: `Nur ${employers} Arbeitgeber registriert. Mindest-Ziel: 5 aktive Pilot-Arbeitgeber für validen MVP-Test. Outreach-System nutzen und personalisierte Nachrichten vorbereiten.`,
        category: 'growth',
        priority: employers === 0 ? 'critical' : 'high',
        impact_score: 9,
        effort_score: 5,
        risk_score: 2,
        expected_benefit: '5+ Pilot-Arbeitgeber = erste echte Validierung',
        action_type: 'create_outreach_draft',
        action_payload: {
          sector: 'Pflege',
          country: 'Deutschland',
          priority: 'high',
          reason: 'Pflege hat starken Fachkräftemangel und niedrige digitale Abdeckung',
          suggested_message:
            'Wir suchen Pilot-Arbeitgeber für kostenlose Nutzung von Global Talent Bridge — internationales Matching ohne Aufwand.',
        },
        requires_approval: true,
      })
    }
  }

  // 3. Wenig Kandidaten
  if (candidates < 10) {
    const title = '👤 Wenig Kandidaten — Kandidaten-Wachstum nötig'
    if (!existingTitles.has(title)) {
      suggestionsToInsert.push({
        department_slug: 'ceo_control',
        title,
        description: `Nur ${candidates} Kandidaten registriert. Für sinnvolles Matching werden mindestens 20–30 Kandidatenprofile benötigt. Kandidaten-Akquise-Strategie entwickeln.`,
        category: 'growth',
        priority: candidates < 5 ? 'high' : 'medium',
        impact_score: 8,
        effort_score: 6,
        risk_score: 1,
        expected_benefit: 'Mehr Matches, höhere Arbeitgeber-Zufriedenheit',
        requires_approval: false,
      })
    }
  }

  // 4. Keine Matches trotz Kandidiaten + Jobs
  if (candidates > 0 && activeJobs > 0 && totalMatches === 0) {
    const title = '🎯 Keine Matches — Matching-Run ausführen'
    if (!existingTitles.has(title)) {
      suggestionsToInsert.push({
        department_slug: 'ceo_control',
        title,
        description:
          'Es gibt Kandidaten und aktive Jobs, aber noch keine Matches. Matching-Algorithmus manuell ausführen (/api/matches/run-basic).',
        category: 'matching',
        priority: 'high',
        impact_score: 9,
        effort_score: 1,
        risk_score: 1,
        expected_benefit: 'Erste Matches sichtbar → Arbeitgeber-Wert demonstrierbar',
        action_type: 'run_matching',
        requires_approval: true,
      })
    }
  }

  // 5. Neue Leads → sofort bearbeiten
  if (newLeads > 0) {
    const title = `📬 ${newLeads} neue Kontaktanfrage${newLeads > 1 ? 'n' : ''} — sofort prüfen`
    if (!existingTitles.has(title)) {
      suggestionsToInsert.push({
        department_slug: 'ceo_control',
        title,
        description: `${newLeads} unbearbeitete Kontaktanfrage${newLeads > 1 ? 'n' : ''} im System. Schnelle Reaktion erhöht Konversionsrate deutlich.`,
        category: 'leads',
        priority: newLeads >= 3 ? 'high' : 'medium',
        impact_score: 8,
        effort_score: 2,
        risk_score: 1,
        expected_benefit: 'Schnellere Antwort → höhere Pilot-Employer-Conversion',
        requires_approval: false,
      })
      notificationsToInsert.push({
        title: `📬 ${newLeads} neue Lead${newLeads > 1 ? 's' : ''}`,
        message: `${newLeads} neue Kontaktanfrage${newLeads > 1 ? 'n' : ''} warten auf Bearbeitung in /admin/leads.`,
        severity: newLeads >= 3 ? 'warning' : 'info',
        department_slug: 'ceo_control',
      })
    }
  }

  // 6. Follow-ups fällig
  if (followupsDue > 0) {
    const title = `📅 ${followupsDue} Lead-Follow-up${followupsDue > 1 ? 's' : ''} fällig`
    if (!existingTitles.has(title)) {
      notificationsToInsert.push({
        title,
        message: `${followupsDue} Follow-up${followupsDue > 1 ? 's' : ''} mit Leads sind heute fällig. Jetzt unter /admin/leads prüfen.`,
        severity: 'warning',
        department_slug: 'ceo_control',
      })
    }
  }

  // 7. Outreach-Follow-ups fällig
  if (outreachFollowup > 0) {
    const title = `📡 ${outreachFollowup} Outreach-Follow-up${outreachFollowup > 1 ? 's' : ''} fällig`
    if (!existingTitles.has(title)) {
      notificationsToInsert.push({
        title,
        message: `${outreachFollowup} Outreach-Ziel${outreachFollowup > 1 ? 'e' : ''} mit fälligem Follow-up. Jetzt unter /admin/outreach?filter=follow_up prüfen.`,
        severity: 'warning',
        department_slug: 'ceo_control',
      })
    }
  }

  // 8. Interessierte Outreach-Ziele → nicht vergessen
  if (outreachInterested > 0) {
    const title = `🤝 ${outreachInterested} interessierte Firma${outreachInterested > 1 ? 'en' : ''} — nächsten Schritt planen`
    if (!existingTitles.has(title)) {
      notificationsToInsert.push({
        title,
        message: `${outreachInterested} Outreach-Ziel${outreachInterested > 1 ? 'e haben' : ' hat'} Status "interessiert". Pilot-Onboarding-Schritte senden.`,
        severity: 'success',
        department_slug: 'ceo_control',
      })
    }
  }

  // 9. Outreach noch nicht gestartet
  if (outreachTotal === 0 && employers < 3) {
    const title = '📡 Outreach noch nicht gestartet — erste Ziele erfassen'
    if (!existingTitles.has(title)) {
      suggestionsToInsert.push({
        department_slug: 'ceo_control',
        title,
        description:
          'Noch keine Outreach-Ziele erfasst. Pilot-Arbeitgeber-Akquise beginnen: erste 10 Unternehmen in /admin/outreach/new eintragen.',
        category: 'growth',
        priority: 'high',
        impact_score: 9,
        effort_score: 4,
        risk_score: 1,
        expected_benefit: 'Strukturierte Akquise → erste Pilot-Arbeitgeber',
        requires_approval: false,
      })
    }
  }

  // 10. New Sales Leads
  if (newSalesLeads > 0) {
    const title = `🎯 ${newSalesLeads} neuer Sales-Lead${newSalesLeads > 1 ? 's' : ''} — qualifizieren`
    if (!existingTitles.has(title)) {
      notificationsToInsert.push({
        title,
        message: `${newSalesLeads} unqualifizierte Sales-Lead${newSalesLeads > 1 ? 's' : ''} warte${newSalesLeads > 1 ? 'n' : 't'} auf Qualifizierung.`,
        severity: 'info',
        department_slug: 'ceo_control',
      })
    }
  }

  // ── DB-Writes ─────────────────────────────────────────────────────────────
  let suggestionsCreated = 0
  let notificationsCreated = 0

  if (suggestionsToInsert.length > 0) {
    const { error } = await supabase.from('agent_suggestions').insert(suggestionsToInsert)
    if (!error) suggestionsCreated = suggestionsToInsert.length
  }

  if (notificationsToInsert.length > 0) {
    const { error } = await supabase.from('agent_notifications').insert(notificationsToInsert)
    if (!error) notificationsCreated = notificationsToInsert.length
  }

  return { suggestions: suggestionsCreated, notifications: notificationsCreated }
}
