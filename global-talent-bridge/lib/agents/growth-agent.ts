import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
export type GrowthAgentResult = {
  leads_scored: number
  tasks_created: number
  messages_drafted: number
  signals_found: number
  summary: string
}

type EmployerLead = {
  id: string
  company_name: string
  sector: string | null
  status: string
  score: number
  city: string | null
  contact_name: string | null
  contact_email: string | null
  last_contacted_at: string | null
  next_followup_at: string | null
}

type CandidateGrowthSource = {
  id: string
  source_name: string
  source_type: string
  status: string
  estimated_candidates: number
  target_sector: string | null
}

type PartnerLead = {
  id: string
  organization_name: string
  partner_type: string
  status: string
  potential_candidates_per_month: number
}

type GrowthTask = {
  title: string
}

// ─────────────────────────────────────────────────────────────
// Scoring logic
// Higher score = better fit for immediate outreach
// ─────────────────────────────────────────────────────────────
const HIGH_DEMAND_SECTORS = ['Pflege & Gesundheit', 'Logistik & Transport', 'Gastronomie & Hotel', 'Handwerk & Bau']

function scoreLead(lead: EmployerLead): number {
  let score = lead.score ?? 0

  // Bonus: high-demand sector
  if (lead.sector && HIGH_DEMAND_SECTORS.some((s) => lead.sector!.includes(s.split(' ')[0]))) {
    score = Math.min(100, score + 10)
  }

  // Bonus: has email
  if (lead.contact_email) {
    score = Math.min(100, score + 5)
  }

  // Penalty: already closed
  if (lead.status === 'closed_lost') {
    score = Math.max(0, score - 30)
  }

  // Bonus: interested status
  if (lead.status === 'interested') {
    score = Math.min(100, score + 15)
  }

  return Math.round(score)
}

// ─────────────────────────────────────────────────────────────
// Draft personalized outreach message
// ─────────────────────────────────────────────────────────────
function draftOutreachEmail(lead: EmployerLead): string {
  const sectorContext =
    lead.sector?.includes('Pflege') ? 'qualifizierte Pflegefachkräfte'
    : lead.sector?.includes('Logistik') ? 'erfahrene Logistik- und Transportfachkräfte'
    : lead.sector?.includes('Gastronomie') ? 'motivierte Fachkräfte aus der Gastronomie'
    : lead.sector?.includes('Handwerk') ? 'qualifizierte Handwerker und Facharbeiter'
    : lead.sector?.includes('IT') ? 'internationale IT-Fachkräfte'
    : 'internationale Fachkräfte'

  return `Betreff: Internationale Fachkräfte für ${lead.company_name} – Global Talent Bridge

Sehr geehrte Damen und Herren${lead.contact_name ? `,\nsehr geehrte${lead.contact_name.startsWith('Dr.') || lead.contact_name.startsWith('Prof.') ? '' : ' Frau/Herr'} ${lead.contact_name}` : ''},

als spezialisierter Anbieter für internationale Fachkräftevermittlung in Deutschland möchten wir Sie auf unsere Plattform Global Talent Bridge aufmerksam machen.

Wir verbinden Unternehmen wie ${lead.company_name}${lead.city ? ` in ${lead.city}` : ''} mit ${sectorContext} aus dem europäischen Ausland – rechtssicher, DSGVO-konform und ohne Vorabkosten für Sie.

Unsere Kandidaten verfügen über:
✅ Anerkannte Berufsabschlüsse oder laufende Anerkennungsverfahren
✅ Deutschkenntnisse ab B1 aufwärts
✅ Arbeitsgenehmigung für Deutschland (EU-Bürger oder Aufenthaltstitel)

Dürfen wir Ihnen unverbindlich zeigen, welche Kandidaten aktuell für Ihr Unternehmen infrage kommen?

Mit freundlichen Grüßen
Global Talent Bridge Team
transl.delta@gmail.com`
}

// ─────────────────────────────────────────────────────────────
// Main agent function
// ─────────────────────────────────────────────────────────────
export async function runGrowthAgent(): Promise<GrowthAgentResult> {
  const adminSupabase = createAdminClient()
  const startTime = Date.now()

  let leadsScored = 0
  let tasksCreated = 0
  let messagesDrafted = 0
  let signalsFound = 0

  // ── 1. Load employer leads ──────────────────────────────────
  const { data: employerLeads } = await adminSupabase
    .from('employer_leads')
    .select('id, company_name, sector, status, score, city, contact_name, contact_email, last_contacted_at, next_followup_at')
    .not('status', 'in', '("closed_won","closed_lost")')
    .order('score', { ascending: false })

  const leads = (employerLeads ?? []) as EmployerLead[]

  // ── 2. Re-score leads ───────────────────────────────────────
  for (const lead of leads) {
    const newScore = scoreLead(lead)
    if (newScore !== lead.score) {
      await adminSupabase
        .from('employer_leads')
        .update({ score: newScore, updated_at: new Date().toISOString() })
        .eq('id', lead.id)
    }
    leadsScored++
  }

  // ── 3. Load existing open growth task titles (dedup) ────────
  const { data: existingTasks } = await adminSupabase
    .from('growth_tasks')
    .select('title')
    .eq('status', 'open')

  const existingTaskTitles = new Set((existingTasks ?? []).map((t: GrowthTask) => t.title))

  const tasksToInsert: {
    title: string
    description: string
    category: string
    priority: string
    status: string
    assigned_to: string
    source: string
    due_date: string
  }[] = []

  // ── 4. Signal: High-score leads not yet contacted ────────────
  const highScoreUncontacted = leads.filter((l) => l.score >= 70 && l.status === 'new' && !l.last_contacted_at)
  if (highScoreUncontacted.length > 0) {
    signalsFound++
    const lead = highScoreUncontacted[0]
    const title = `Hochrangigen Lead kontaktieren: ${lead.company_name}`
    if (!existingTaskTitles.has(title)) {
      tasksToInsert.push({
        title,
        description: `${lead.company_name}${lead.city ? ` (${lead.city})` : ''} hat einen Score von ${lead.score}/100 und wurde noch nicht kontaktiert. Sofort E-Mail senden.`,
        category: 'employer_outreach',
        priority: 'high',
        status: 'open',
        assigned_to: 'CEO',
        source: 'agent_suggested',
        due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      })
      existingTaskTitles.add(title)
    }
  }

  // ── 5. Signal: Leads with "interested" status – follow up ────
  const interestedLeads = leads.filter((l) => l.status === 'interested')
  if (interestedLeads.length > 0) {
    signalsFound++
    const lead = interestedLeads[0]
    const title = `Nachfassen bei interessiertem Lead: ${lead.company_name}`
    if (!existingTaskTitles.has(title)) {
      tasksToInsert.push({
        title,
        description: `${lead.company_name} hat Interesse bekundet. Jetzt konkrete Kandidatenvorschläge schicken oder Termin vereinbaren.`,
        category: 'employer_outreach',
        priority: 'critical',
        status: 'open',
        assigned_to: 'CEO',
        source: 'agent_suggested',
        due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      })
      existingTaskTitles.add(title)
    }
  }

  // ── 6. Check candidate sources – inactive or new ─────────────
  const { data: sources } = await adminSupabase
    .from('candidate_growth_sources')
    .select('id, source_name, source_type, status, estimated_candidates, target_sector')

  const candidateSources = (sources ?? []) as CandidateGrowthSource[]
  const unactivatedSources = candidateSources.filter((s) => s.status === 'identified')

  if (unactivatedSources.length > 0) {
    signalsFound++
    const src = unactivatedSources[0]
    const title = `Kandidatenquelle aktivieren: ${src.source_name}`
    if (!existingTaskTitles.has(title)) {
      tasksToInsert.push({
        title,
        description: `Quelle "${src.source_name}" (${src.source_type}) wurde noch nicht aktiviert. Kontakt aufnehmen oder Profil anlegen. Potenzial: ~${src.estimated_candidates} Kandidaten.`,
        category: 'candidate_acquisition',
        priority: 'medium',
        status: 'open',
        assigned_to: 'CEO',
        source: 'agent_suggested',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      })
      existingTaskTitles.add(title)
    }
  }

  // ── 7. Check partners – high-potential not yet active ────────
  const { data: partnerData } = await adminSupabase
    .from('partner_leads')
    .select('id, organization_name, partner_type, status, potential_candidates_per_month')

  const partners = (partnerData ?? []) as PartnerLead[]
  const highPotentialPartners = partners.filter(
    (p) => p.potential_candidates_per_month >= 20 && p.status === 'identified'
  )

  if (highPotentialPartners.length > 0) {
    signalsFound++
    const partner = highPotentialPartners[0]
    const title = `Partnerschaft prüfen: ${partner.organization_name}`
    if (!existingTaskTitles.has(title)) {
      tasksToInsert.push({
        title,
        description: `"${partner.organization_name}" (${partner.partner_type}) kann bis zu ${partner.potential_candidates_per_month} Kandidaten/Monat liefern. Noch kein Kontakt. Jetzt Kooperation besprechen.`,
        category: 'partner_development',
        priority: 'high',
        status: 'open',
        assigned_to: 'CEO',
        source: 'agent_suggested',
        due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      })
      existingTaskTitles.add(title)
    }
  }

  // ── 8. Check platform data for matching quality ──────────────
  const { count: candidateCount } = await adminSupabase
    .from('candidates')
    .select('*', { count: 'exact', head: true })

  const { count: jobCount } = await adminSupabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  if ((candidateCount ?? 0) < 10) {
    signalsFound++
    const title = 'Kandidaten-Akquise: Weniger als 10 Profile auf der Plattform'
    if (!existingTaskTitles.has(title)) {
      tasksToInsert.push({
        title,
        description: `Nur ${candidateCount ?? 0} Kandidaten registriert. Sofort Kandidatenquellen aktivieren und Reichweite erhöhen. Ohne Kandidaten kein Matching möglich.`,
        category: 'candidate_acquisition',
        priority: 'critical',
        status: 'open',
        assigned_to: 'CEO',
        source: 'agent_suggested',
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      })
      existingTaskTitles.add(title)
    }
  }

  if ((jobCount ?? 0) < 5) {
    signalsFound++
    const title = 'Stellenangebote: Weniger als 5 aktive Jobs auf der Plattform'
    if (!existingTaskTitles.has(title)) {
      tasksToInsert.push({
        title,
        description: `Nur ${jobCount ?? 0} aktive Stellen vorhanden. Arbeitgeber müssen aktiviert werden, damit Kandidaten echte Matches sehen.`,
        category: 'employer_outreach',
        priority: 'high',
        status: 'open',
        assigned_to: 'CEO',
        source: 'agent_suggested',
        due_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      })
      existingTaskTitles.add(title)
    }
  }

  // ── 9. Draft outreach messages for top leads ─────────────────
  const topLeads = leads
    .filter((l) => l.score >= 60 && l.contact_email && l.status !== 'closed_won')
    .slice(0, 3)

  for (const lead of topLeads) {
    // Check if draft already exists
    const { count: existingMsg } = await adminSupabase
      .from('outreach_messages')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_id', lead.id)
      .eq('status', 'draft')

    if ((existingMsg ?? 0) === 0) {
      const body = draftOutreachEmail(lead)
      await adminSupabase.from('outreach_messages').insert({
        recipient_type: 'employer_lead',
        recipient_id: lead.id,
        recipient_name: lead.company_name,
        recipient_email: lead.contact_email,
        subject: `Internationale Fachkräfte für ${lead.company_name} – Global Talent Bridge`,
        body,
        channel: 'email',
        status: 'draft',
      })
      messagesDrafted++
    }
  }

  // ── 10. Insert tasks ─────────────────────────────────────────
  if (tasksToInsert.length > 0) {
    const { error } = await adminSupabase.from('growth_tasks').insert(
      tasksToInsert.map((t) => ({
        ...t,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }))
    )
    if (!error) tasksCreated = tasksToInsert.length
  }

  // ── 11. Log run ──────────────────────────────────────────────
  const durationMs = Date.now() - startTime
  const summary = [
    `${leadsScored} Leads bewertet`,
    `${tasksCreated} Aufgaben erstellt`,
    `${messagesDrafted} Nachrichten entworfen`,
    `${signalsFound} Signale erkannt`,
  ].join(' · ')

  await adminSupabase.from('growth_agent_runs').insert({
    triggered_by: 'admin',
    leads_scored: leadsScored,
    tasks_created: tasksCreated,
    messages_drafted: messagesDrafted,
    signals_found: signalsFound,
    duration_ms: durationMs,
    status: 'completed',
    summary,
  })

  return { leads_scored: leadsScored, tasks_created: tasksCreated, messages_drafted: messagesDrafted, signals_found: signalsFound, summary }
}
