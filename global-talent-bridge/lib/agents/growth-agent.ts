import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'

/** Prioritäts-Score: 0–100 */
function calcPriorityScore({
  status,
  sector,
  followupDue,
  isInterested,
}: {
  status: string
  sector: string | null
  followupDue: boolean
  isInterested: boolean
}): number {
  let score = 30

  // Sektoren mit starkem Fachkräftemangel priorisieren
  const highDemandSectors = ['pflege', 'pflege', 'health', 'gesundheit', 'it', 'technik', 'logistik', 'bau']
  if (sector && highDemandSectors.some((s) => sector.toLowerCase().includes(s))) {
    score += 25
  }

  // Bereits interessiert → höhere Priorität
  if (isInterested) score += 30

  // Follow-up überfällig
  if (followupDue) score += 20

  // Noch geplant (noch nicht kontaktiert)
  if (status === 'planned') score += 10

  return Math.min(score, 100)
}

function buildEmailDraft(target: {
  company_name: string
  contact_person: string | null
  sector: string | null
  city: string | null
  country: string | null
}): { subject: string; body: string } {
  const greeting = target.contact_person
    ? `Sehr geehrte/r ${target.contact_person},`
    : `Sehr geehrte Damen und Herren,`

  const sectorText = target.sector
    ? ` im Bereich ${target.sector}`
    : ''

  const locationText = target.city
    ? ` aus ${target.city}${target.country ? ', ' + target.country : ''}`
    : ''

  const subject = `Global Talent Bridge – Internationale Fachkräfte für ${target.company_name}`

  const body = `${greeting}

mein Name ist [Ihr Name] vom Team Global Talent Bridge.

Wir sind eine spezialisierte Plattform für internationales Talent-Matching${sectorText}. Unsere vorqualifizierten Kandidaten verfügen über nachgewiesene Sprachkenntnisse (Deutsch/Englisch) und passende Berufserfahrung.

**Warum Global Talent Bridge${locationText}?**
- Vorqualifizierte internationale Fachkräfte – kein Aufwand bei der Vorauswahl
- Kostenlose Pilot-Nutzung für erste Unternehmen
- DSGVO-konform, vollständig dokumentiert
- Persönlicher Ansprechpartner während des gesamten Prozesses

Hätten Sie Interesse an einem kurzen 15-minütigen Gespräch, um zu sehen, ob wir Ihnen helfen können, offene Stellen schneller zu besetzen?

Mit freundlichen Grüßen
[Ihr Name]
Global Talent Bridge
https://globaltalentbridge.de

---
ℹ️ Diese Nachricht wurde als Entwurf vom Growth Agent erstellt und wartet auf manuelle Freigabe.`

  return { subject, body }
}

function buildWhatsAppDraft(target: {
  company_name: string
  contact_person: string | null
  sector: string | null
}): string {
  const name = target.contact_person ? ` ${target.contact_person}` : ''
  const sector = target.sector ? ` (${target.sector})` : ''

  return `Guten Tag${name}! 👋

Ich schreibe Ihnen von Global Talent Bridge${sector} – wir helfen Unternehmen wie ${target.company_name}, internationale Fachkräfte gezielt zu finden.

Aktuell haben wir vorqualifizierte Kandidaten mit Deutsch-Kenntnissen, die kurzfristig verfügbar sind.

Hätten Sie 5 Minuten für ein kurzes Gespräch? 🙏

– Global Talent Bridge Team

ℹ️ Entwurf – wartet auf Admin-Freigabe`
}

function buildFollowUpEmailDraft(target: {
  company_name: string
  contact_person: string | null
}): { subject: string; body: string } {
  const greeting = target.contact_person
    ? `Guten Tag ${target.contact_person},`
    : `Guten Tag,`

  return {
    subject: `Nachfrage: Global Talent Bridge – ${target.company_name}`,
    body: `${greeting}

ich wollte kurz nachfragen, ob unsere frühere Anfrage angekommen ist und ob Sie inzwischen Interesse an unserer Plattform haben.

Global Talent Bridge vermittelt vorqualifizierte internationale Fachkräfte – kostenfrei für Pilot-Unternehmen.

Darf ich Ihnen mehr Details schicken?

Mit freundlichen Grüßen
[Ihr Name] · Global Talent Bridge

---
ℹ️ Follow-up-Entwurf vom Growth Agent – wartet auf Freigabe`,
  }
}

/**
 * Growth Agent
 * Analysiert Leads, erstellt Outreach-Entwürfe + Follow-up-Pläne.
 * Schreibt NUR in outreach_approval_queue (status='pending') + agent_notifications.
 * Sendet NIEMALS selbst. Alles wartet auf Admin-Freigabe.
 */
export async function runGrowthAgent(runType: 'manual' | 'scheduled' | 'triggered' = 'manual'): Promise<{
  leadsAnalyzed: number
  draftsCreated: number
  followupsPlanned: number
  alertsSent: number
}> {
  const supabase = createAdminClient()
  const now = new Date().toISOString()

  let leadsAnalyzed = 0
  let draftsCreated = 0
  let followupsPlanned = 0
  let alertsSent = 0
  let errorMessage: string | undefined

  try {
    // ── 1. Outreach-Ziele lesen ───────────────────────────────────────────────
    const { data: targets } = await supabase
      .from('outreach_targets')
      .select('id, company_name, contact_person, email, phone, sector, city, country, status, priority, next_follow_up_at')
      .in('status', ['planned', 'follow_up', 'interested'])
      .order('priority', { ascending: false })
      .limit(50)

    const allTargets = targets ?? []
    leadsAnalyzed += allTargets.length

    // ── 2. Sales Leads lesen ──────────────────────────────────────────────────
    const { data: salesLeads } = await supabase
      .from('sales_leads')
      .select('id, company_name, contact_name, email, phone, sector, status, source')
      .eq('status', 'new')
      .limit(20)

    leadsAnalyzed += (salesLeads ?? []).length

    // ── 3. Bestehende Entwürfe laden (Deduplication by target_name) ───────────
    const { data: existingDrafts } = await supabase
      .from('outreach_approval_queue')
      .select('target_name, channel, status')
      .in('status', ['pending', 'approved', 'prepared_for_manual_send'])

    const existingKeys = new Set(
      (existingDrafts ?? []).map((d: { target_name: string; channel: string }) => `${d.target_name}::${d.channel}`)
    )

    const draftsToInsert: Array<{
      created_by_agent: string
      target_type: string
      target_name: string
      target_email: string | null
      target_phone: string | null
      channel: string
      message_subject: string | null
      message_body: string
      status: string
      risk_level: string
      priority_score: number
      requires_double_confirmation: boolean
      source_context: Record<string, unknown>
    }> = []

    // ── 4. Neue Outreach-Entwürfe für ungekontaktierte Ziele ──────────────────
    for (const t of allTargets) {
      const followupDue = !!(t.next_follow_up_at && t.next_follow_up_at <= now)
      const isInterested = t.status === 'interested'
      const priority = calcPriorityScore({
        status: t.status,
        sector: t.sector,
        followupDue,
        isInterested,
      })

      // E-Mail-Entwurf für ungekontaktierte Ziele
      if (t.status === 'planned' && t.email) {
        const key = `${t.company_name}::email`
        if (!existingKeys.has(key)) {
          const { subject, body } = buildEmailDraft(t)
          draftsToInsert.push({
            created_by_agent: 'growth_agent',
            target_type: 'employer_lead',
            target_name: t.company_name,
            target_email: t.email,
            target_phone: t.phone ?? null,
            channel: 'email',
            message_subject: subject,
            message_body: body,
            status: 'pending',
            risk_level: priority >= 70 ? 'medium' : 'low',
            priority_score: priority,
            requires_double_confirmation: false,
            source_context: {
              outreach_target_id: t.id,
              sector: t.sector,
              city: t.city,
              country: t.country,
              original_status: t.status,
            },
          })
          existingKeys.add(key)
        }
      }

      // Follow-up-Entwurf für überfällige Targets
      if (followupDue && t.email) {
        const key = `${t.company_name}::followup_email`
        if (!existingKeys.has(key)) {
          const { subject, body } = buildFollowUpEmailDraft(t)
          draftsToInsert.push({
            created_by_agent: 'growth_agent',
            target_type: 'employer_lead',
            target_name: t.company_name,
            target_email: t.email,
            target_phone: t.phone ?? null,
            channel: 'email',
            message_subject: subject,
            message_body: body,
            status: 'pending',
            risk_level: 'low',
            priority_score: Math.min(priority + 10, 100),
            requires_double_confirmation: false,
            source_context: {
              outreach_target_id: t.id,
              is_followup: true,
              original_status: t.status,
              next_follow_up_at: t.next_follow_up_at,
            },
          })
          existingKeys.add(key)
          followupsPlanned++
        }
      }

      // WhatsApp-Entwurf für Targets mit Telefonnummer + high priority
      if (t.phone && priority >= 65) {
        const key = `${t.company_name}::whatsapp`
        if (!existingKeys.has(key)) {
          const waBody = buildWhatsAppDraft(t)
          draftsToInsert.push({
            created_by_agent: 'growth_agent',
            target_type: 'employer_lead',
            target_name: t.company_name,
            target_email: t.email ?? null,
            target_phone: t.phone,
            channel: 'whatsapp',
            message_subject: null,
            message_body: waBody,
            status: 'pending',
            risk_level: priority >= 80 ? 'high' : 'medium',
            priority_score: priority,
            requires_double_confirmation: priority >= 80,
            source_context: {
              outreach_target_id: t.id,
              sector: t.sector,
              original_status: t.status,
            },
          })
          existingKeys.add(key)
        }
      }
    }

    // ── 5. Sales Leads → Email-Entwürfe ───────────────────────────────────────
    for (const lead of salesLeads ?? []) {
      const key = `${lead.company_name}::email`
      if (!existingKeys.has(key) && lead.email) {
        const { subject, body } = buildEmailDraft({
          company_name: lead.company_name ?? 'Unbekanntes Unternehmen',
          contact_person: lead.contact_name ?? null,
          sector: lead.sector ?? null,
          city: null,
          country: null,
        })
        draftsToInsert.push({
          created_by_agent: 'growth_agent',
          target_type: 'employer_lead',
          target_name: lead.company_name ?? 'Unbekannt',
          target_email: lead.email,
          target_phone: lead.phone ?? null,
          channel: 'email',
          message_subject: subject,
          message_body: body,
          status: 'pending',
          risk_level: 'low',
          priority_score: 50,
          requires_double_confirmation: false,
          source_context: {
            sales_lead_id: lead.id,
            source: lead.source,
            original_status: lead.status,
          },
        })
        existingKeys.add(key)
      }
    }

    // ── 6. Entwürfe in DB speichern ───────────────────────────────────────────
    if (draftsToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('outreach_approval_queue')
        .insert(draftsToInsert)

      if (!insertError) {
        draftsCreated = draftsToInsert.length
      } else {
        console.error('[growth-agent] Insert error:', insertError.message)
      }
    }

    // ── 7. CEO-Alerts erstellen ───────────────────────────────────────────────
    const notificationsToInsert: Array<{
      title: string
      message: string
      severity: string
      department_slug: string
    }> = []

    const highPriorityDrafts = draftsToInsert.filter((d) => d.priority_score >= 70)
    if (highPriorityDrafts.length > 0) {
      notificationsToInsert.push({
        title: `🚀 ${highPriorityDrafts.length} hochprioritäre Outreach-Entwürfe bereit`,
        message: `${highPriorityDrafts.length} Entwurf${highPriorityDrafts.length > 1 ? 'e' : ''} mit hoher Priorität warten auf Freigabe unter /admin/outreach/approval-queue.`,
        severity: 'warning',
        department_slug: 'marketing_growth_department',
      })
      alertsSent++
    }

    if (followupsPlanned > 0) {
      notificationsToInsert.push({
        title: `📅 ${followupsPlanned} Follow-up-Entwurf${followupsPlanned > 1 ? 'e' : ''} erstellt`,
        message: `${followupsPlanned} fällige Follow-ups als Entwurf in der Approval-Queue. Jetzt freigeben: /admin/outreach/approval-queue`,
        severity: 'info',
        department_slug: 'marketing_growth_department',
      })
      alertsSent++
    }

    const highRiskDrafts = draftsToInsert.filter((d) => d.risk_level === 'high')
    if (highRiskDrafts.length > 0) {
      notificationsToInsert.push({
        title: `⚠️ ${highRiskDrafts.length} High-Risk-Outreach benötig${highRiskDrafts.length > 1 ? 'en' : 't'} doppelte Bestätigung`,
        message: `${highRiskDrafts.length} WhatsApp-Entwurf${highRiskDrafts.length > 1 ? 'e' : ''} mit Risikostufe "hoch" warten auf doppelte Bestätigung.`,
        severity: 'critical',
        department_slug: 'marketing_growth_department',
      })
      alertsSent++
    }

    if (notificationsToInsert.length > 0) {
      await supabase.from('agent_notifications').insert(notificationsToInsert)
    }

  } catch (err) {
    errorMessage = err instanceof Error ? err.message : 'Unbekannter Fehler'
    console.error('[growth-agent] Error:', errorMessage)
  }

  // ── 8. Run-Log speichern ──────────────────────────────────────────────────
  const supabase2 = createAdminClient()
  const runSummary = errorMessage
    ? `Growth-Agent Fehler: ${errorMessage}`
    : `Growth-Agent: ${leadsAnalyzed} Leads analysiert, ${draftsCreated} Entwürfe erstellt, ${followupsPlanned} Follow-ups geplant, ${alertsSent} Alerts.`

  await supabase2.from('internal_growth_agent_runs').insert({
    run_type: runType,
    status: errorMessage ? 'error' : draftsCreated > 0 ? 'success' : 'partial',
    leads_analyzed: leadsAnalyzed,
    drafts_created: draftsCreated,
    followups_planned: followupsPlanned,
    alerts_sent: alertsSent,
    summary: runSummary,
    error_message: errorMessage ?? null,
  })

  await supabase2.from('system_logs').insert({
    agent_name: 'growth_agent',
    status: errorMessage ? 'error' : 'success',
    message: runSummary,
  })

  return { leadsAnalyzed, draftsCreated, followupsPlanned, alertsSent }
}
