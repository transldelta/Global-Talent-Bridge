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
  const highDemandSectors = ['pflege', 'health', 'gesundheit', 'it', 'technik', 'logistik', 'bau', 'klinik']
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

  const sectorText = target.sector ? ` im Bereich ${target.sector}` : ''
  const locationText = target.city
    ? ` aus ${target.city}${target.country ? ', ' + target.country : ''}`
    : ''

  const subject = `CorridorWork – Internationale Fachkräfte für ${target.company_name}`

  const body = `${greeting}

CorridorWork ist eine spezialisierte Plattform für internationales Talent-Matching${sectorText}. Unsere Kandidaten verfügen über dokumentierte Sprachkenntnisse (Deutsch/Englisch) und passende Berufserfahrung.

**Warum CorridorWork${locationText}?**
- Vorqualifizierte internationale Fachkräfte – kein Aufwand bei der Vorauswahl
- Kostenlose Pilot-Nutzung für erste Unternehmen
- DSGVO-konform, vollständig dokumentiert
- Persönlicher Ansprechpartner während des gesamten Prozesses

Hätten Sie Interesse an einem kurzen 15-minütigen Gespräch, um zu sehen, ob wir Ihnen helfen können, offene Stellen schneller zu besetzen?

Mit freundlichen Grüßen
CorridorWork Team

---
ℹ️ Entwurf vom Growth Agent · wartet auf Admin-Freigabe · kein automatischer Versand`

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

Ich schreibe Ihnen von CorridorWork${sector} – wir helfen Unternehmen wie ${target.company_name}, internationale Fachkräfte gezielt zu finden.

Wir haben vorqualifizierte Kandidaten mit Deutsch-Kenntnissen, die kurzfristig verfügbar sind.

Hätten Sie 5 Minuten für ein kurzes Gespräch? 🙏

– CorridorWork Team

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
    subject: `Nachfrage: CorridorWork – ${target.company_name}`,
    body: `${greeting}

ich wollte kurz nachfragen, ob unsere frühere Anfrage angekommen ist und ob Sie inzwischen Interesse an unserer Plattform haben.

CorridorWork vermittelt vorqualifizierte internationale Fachkräfte – kostenfrei für Pilot-Unternehmen.

Darf ich Ihnen mehr Details schicken?

Mit freundlichen Grüßen
CorridorWork Team

---
ℹ️ Follow-up-Entwurf vom Growth Agent – wartet auf Freigabe`,
  }
}

type DraftInsert = {
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
    // Felder: id, company_name, contact_person, email, phone, sector, city, country, status, priority, next_follow_up_at
    const { data: targets, error: targetsError } = await supabase
      .from('outreach_targets')
      .select('id, company_name, contact_person, email, phone, sector, city, country, status, priority, next_follow_up_at')
      .in('status', ['planned', 'follow_up', 'interested'])
      .order('priority', { ascending: false })
      .limit(50)

    if (targetsError) {
      console.error('[growth-agent] outreach_targets error:', targetsError.message)
    }

    const allTargets = targets ?? []
    leadsAnalyzed += allTargets.length

    // ── 2. Sales Leads lesen ──────────────────────────────────────────────────
    // Felder: id, source, role, name, email, company_name, status, priority, notes
    // ACHTUNG: sales_leads hat KEIN phone, KEIN sector, KEIN contact_person
    const { data: salesLeads, error: leadsError } = await supabase
      .from('sales_leads')
      .select('id, name, email, company_name, status, role, source, notes')
      .eq('status', 'new')
      .limit(20)

    if (leadsError) {
      console.error('[growth-agent] sales_leads error:', leadsError.message)
    }

    leadsAnalyzed += (salesLeads ?? []).length

    // ── 3. Bestehende Entwürfe laden (Deduplication) ──────────────────────────
    const { data: existingDrafts } = await supabase
      .from('outreach_approval_queue')
      .select('target_name, channel, status')
      .in('status', ['pending', 'approved', 'prepared_for_manual_send'])

    const existingKeys = new Set(
      (existingDrafts ?? []).map((d: { target_name: string; channel: string }) => `${d.target_name}::${d.channel}`)
    )

    const draftsToInsert: DraftInsert[] = []

    // ── 4. Entwürfe für outreach_targets ─────────────────────────────────────
    for (const t of allTargets) {
      const followupDue = !!(t.next_follow_up_at && t.next_follow_up_at <= now)
      const isInterested = t.status === 'interested'
      const priority = calcPriorityScore({
        status: t.status,
        sector: t.sector ?? null,
        followupDue,
        isInterested,
      })

      // E-Mail-Entwurf für ungekontaktierte/geplante Ziele
      if ((t.status === 'planned' || t.status === 'interested') && t.email) {
        const key = `${t.company_name}::email`
        if (!existingKeys.has(key)) {
          const { subject, body } = buildEmailDraft({
            company_name: t.company_name ?? 'Unbekanntes Unternehmen',
            contact_person: t.contact_person ?? null,
            sector: t.sector ?? null,
            city: t.city ?? null,
            country: t.country ?? null,
          })
          draftsToInsert.push({
            created_by_agent: 'growth_agent',
            target_type: 'employer_lead',
            target_name: t.company_name ?? 'Unbekannt',
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
          const { subject, body } = buildFollowUpEmailDraft({
            company_name: t.company_name ?? 'Unbekannt',
            contact_person: t.contact_person ?? null,
          })
          draftsToInsert.push({
            created_by_agent: 'growth_agent',
            target_type: 'employer_lead',
            target_name: t.company_name ?? 'Unbekannt',
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

      // WhatsApp-Entwurf: nur wenn Telefon + hohe Priorität
      if (t.phone && priority >= 65) {
        const key = `${t.company_name}::whatsapp`
        if (!existingKeys.has(key)) {
          const waBody = buildWhatsAppDraft({
            company_name: t.company_name ?? 'Unbekannt',
            contact_person: t.contact_person ?? null,
            sector: t.sector ?? null,
          })
          draftsToInsert.push({
            created_by_agent: 'growth_agent',
            target_type: 'employer_lead',
            target_name: t.company_name ?? 'Unbekannt',
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
    // sales_leads Spalten: id, source, role, name, email, company_name, status, priority, notes
    for (const lead of salesLeads ?? []) {
      const companyName = lead.company_name ?? lead.name ?? 'Unbekanntes Unternehmen'
      const key = `${companyName}::email`
      if (!existingKeys.has(key) && lead.email) {
        const { subject, body } = buildEmailDraft({
          company_name: companyName,
          contact_person: lead.name ?? null,  // 'name' Feld als Kontaktperson
          sector: null,                        // sales_leads hat kein sector-Feld
          city: null,
          country: null,
        })
        draftsToInsert.push({
          created_by_agent: 'growth_agent',
          target_type: 'employer_lead',
          target_name: companyName,
          target_email: lead.email,
          target_phone: null,  // sales_leads hat kein phone-Feld
          channel: 'email',
          message_subject: subject,
          message_body: body,
          status: 'pending',
          risk_level: 'low',
          priority_score: 40,
          requires_double_confirmation: false,
          source_context: {
            sales_lead_id: lead.id,
            source: lead.source,
            role: lead.role,
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
        errorMessage = `Fehler beim Speichern der Entwürfe: ${insertError.message}`
      }
    }

    // ── 7. CEO-Alerts ─────────────────────────────────────────────────────────
    const notificationsToInsert: Array<{
      title: string
      message: string
      severity: string
      department_slug: string
    }> = []

    if (draftsCreated > 0) {
      notificationsToInsert.push({
        title: `📬 Growth Agent: ${draftsCreated} neue Outreach-Entwürfe`,
        message: `${draftsCreated} Entwurf${draftsCreated > 1 ? 'e' : ''} erstellt und warten auf Freigabe: /admin/outreach/approval-queue`,
        severity: 'info',
        department_slug: 'marketing_growth_department',
      })
      alertsSent++
    }

    const highPriorityDrafts = draftsToInsert.filter((d) => d.priority_score >= 70)
    if (highPriorityDrafts.length > 0) {
      notificationsToInsert.push({
        title: `🚀 ${highPriorityDrafts.length} hochprioritäre Entwürfe bereit`,
        message: `${highPriorityDrafts.length} Entwurf${highPriorityDrafts.length > 1 ? 'e' : ''} mit hoher Priorität (≥70) warten auf Freigabe.`,
        severity: 'warning',
        department_slug: 'marketing_growth_department',
      })
      alertsSent++
    }

    if (followupsPlanned > 0) {
      notificationsToInsert.push({
        title: `📅 ${followupsPlanned} fällige Follow-up${followupsPlanned > 1 ? 's' : ''} als Entwurf erstellt`,
        message: `Follow-up-Entwürfe für überfällige Targets bereit: /admin/outreach/approval-queue?status=pending`,
        severity: 'info',
        department_slug: 'marketing_growth_department',
      })
      alertsSent++
    }

    const highRiskDrafts = draftsToInsert.filter((d) => d.risk_level === 'high')
    if (highRiskDrafts.length > 0) {
      notificationsToInsert.push({
        title: `⚠️ ${highRiskDrafts.length} High-Risk-Entwurf${highRiskDrafts.length > 1 ? 'e' : ''} — doppelte Bestätigung nötig`,
        message: `Diese Entwürfe erfordern manuelle doppelte Bestätigung vor Freigabe.`,
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
    console.error('[growth-agent] Uncaught error:', errorMessage)
  }

  // ── 8. Run-Log speichern ──────────────────────────────────────────────────
  const runSummary = errorMessage
    ? `Growth-Agent Fehler: ${errorMessage}`
    : `Growth-Agent: ${leadsAnalyzed} Leads analysiert, ${draftsCreated} Entwürfe erstellt, ${followupsPlanned} Follow-ups, ${alertsSent} Alerts.`

  await supabase.from('internal_growth_agent_runs').insert({
    run_type: runType,
    status: errorMessage ? 'error' : draftsCreated > 0 ? 'success' : 'partial',
    leads_analyzed: leadsAnalyzed,
    drafts_created: draftsCreated,
    followups_planned: followupsPlanned,
    alerts_sent: alertsSent,
    summary: runSummary,
    error_message: errorMessage ?? null,
  })

  await supabase.from('system_logs').insert({
    agent_name: 'growth_agent',
    status: errorMessage ? 'error' : 'success',
    message: runSummary,
  })

  return { leadsAnalyzed, draftsCreated, followupsPlanned, alertsSent }
}
