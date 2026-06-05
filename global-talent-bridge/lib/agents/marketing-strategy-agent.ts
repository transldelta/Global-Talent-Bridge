import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Marketing Strategy Agent
 * Analysiert vorhandene Daten (Kandidaten-Sektoren, offene Jobs, Leads),
 * leitet Markt-Signale ab und erstellt Strategie-Vorschläge.
 * Keine externen APIs. Nur interne Daten.
 */
export async function runMarketingStrategyAgent(): Promise<{
  suggestions: number
  signals: number
}> {
  const supabase = createAdminClient()

  // ── Interne Daten lesen ───────────────────────────────────────────────────
  const [candidateSectorsRes, jobSectorsRes, pilotLeadsRes] = await Promise.all([
    supabase.from('candidates').select('sector'),
    supabase.from('jobs').select('sector').eq('is_active', true),
    supabase
      .from('contact_requests')
      .select('interest')
      .eq('interest', 'pilot_employer'),
  ])

  const candidateSectors = (candidateSectorsRes.data ?? [])
    .map((c: { sector: string | null }) => c.sector)
    .filter(Boolean) as string[]

  const jobSectors = (jobSectorsRes.data ?? [])
    .map((j: { sector: string | null }) => j.sector)
    .filter(Boolean) as string[]

  const pilotLeadCount = (pilotLeadsRes.data ?? []).length

  // ── Sektor-Analyse: Kandidaten vs. Jobs ───────────────────────────────────
  const candidateSectorMap = new Map<string, number>()
  for (const s of candidateSectors) {
    candidateSectorMap.set(s, (candidateSectorMap.get(s) ?? 0) + 1)
  }

  const jobSectorSet = new Set(jobSectors)

  // Sektoren mit Kandidaten aber ohne Jobs = Gap → Zielgruppe für Arbeitgeber
  const gapSectors = [...candidateSectorMap.entries()]
    .filter(([sector]) => !jobSectorSet.has(sector))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)

  // ── Bestehende suggested Vorschläge ──────────────────────────────────────
  const { data: existingSuggestions } = await supabase
    .from('agent_suggestions')
    .select('title')
    .eq('status', 'suggested')

  const existingTitles = new Set((existingSuggestions ?? []).map((s: { title: string }) => s.title))

  const suggestionsToInsert = []
  const signalsToInsert = []

  // ── Zielgruppen nach bekanntem Bedarf (ohne externe Daten) ────────────────
  // Strukturierte Markt-Prioritäten basierend auf BMAS/Bundesagentur-Trends (fest kodiert, ehrlich als Schätzung markiert)
  const HIGH_DEMAND_SECTORS = [
    {
      sector: 'Pflege & Gesundheit',
      reason: 'Größter Fachkräftemangel in Deutschland, hohe Bereitschaft zu internationalem Recruiting',
      channel: 'Direktakquise Pflegeheime & Kliniken',
      confidence: 85,
    },
    {
      sector: 'Logistik & Transport',
      reason: 'Starkes Wachstum, viele KMUs, internationaler Kandidaten-Pool vorhanden',
      channel: 'Logistik-KMUs, Speditionen, Lagerhäuser',
      confidence: 75,
    },
    {
      sector: 'Gastronomie & Hotellerie',
      reason: 'Hohe Fluktuation, ständiger Personalbedarf, mehrsprachige Mitarbeiter willkommen',
      channel: 'Restaurants, Hotels, Catering-Betriebe',
      confidence: 70,
    },
    {
      sector: 'Handwerk & Bau',
      reason: 'Massiver Fachkräftemangel, EU-Erweiterungspotenzial groß',
      channel: 'Handwerksbetriebe, Bauunternehmen',
      confidence: 80,
    },
    {
      sector: 'IT & Software',
      reason: 'Hohe Zahlungsbereitschaft, globale Kandidaten-Verfügbarkeit, remote-affin',
      channel: 'Tech-Startups, IT-Dienstleister, Agenturen',
      confidence: 72,
    },
  ]

  for (const target of HIGH_DEMAND_SECTORS) {
    const title = `📣 Zielgruppe: ${target.sector} — als Arbeitgeber ansprechen`
    if (!existingTitles.has(title)) {
      suggestionsToInsert.push({
        department_slug: 'marketing_strategy',
        title,
        description: `${target.reason}. Empfohlener Kanal: ${target.channel}. Dieser Vorschlag basiert auf bekannten deutschen Arbeitsmarkt-Trends (keine externen API-Daten).`,
        category: 'marketing',
        priority: target.confidence >= 80 ? 'high' : ('medium' as 'high' | 'medium'),
        impact_score: Math.round(target.confidence / 10),
        effort_score: 5,
        risk_score: 2,
        expected_benefit: `Erste ${target.sector}-Arbeitgeber als Pilot-Partner gewinnen`,
        risk_note: 'Schätzung ohne Echtzeit-Marktdaten. Manuell validieren.',
        action_type: 'create_outreach_draft',
        action_payload: {
          sector: target.sector,
          country: 'Deutschland',
          priority: target.confidence >= 80 ? 'high' : 'normal',
          reason: target.reason,
          suggested_message: `Guten Tag, wir suchen Pilot-Arbeitgeber im Bereich ${target.sector} für kostenlosen Zugang zu CorridorWork — strukturiertes internationales Kandidaten-Matching. Kein Vertrag, keine Kosten.`,
        },
        requires_approval: true,
      })

      signalsToInsert.push({
        source: 'internal_analysis',
        region: 'DACH',
        country: 'Deutschland',
        sector: target.sector,
        signal_type: 'employer_demand',
        title: `Nachfrage-Signal: ${target.sector}`,
        summary: target.reason,
        confidence_score: target.confidence,
        status: 'new',
      })
    }
  }

  // ── Gap-Sektoren aus Kandidaten-Daten ────────────────────────────────────
  for (const [sector, count] of gapSectors) {
    const title = `🔍 Kandidaten-Gap: ${count}x ${sector} ohne Job-Angebote`
    if (!existingTitles.has(title)) {
      suggestionsToInsert.push({
        department_slug: 'marketing_strategy',
        title,
        description: `${count} Kandidat${count > 1 ? 'en' : ''} im Bereich "${sector}" haben kein passendes Job-Angebot. Arbeitgeber in diesem Sektor aktiv ansprechen.`,
        category: 'matching',
        priority: 'medium' as const,
        impact_score: 7,
        effort_score: 4,
        risk_score: 1,
        expected_benefit: `Mehr Matches für ${count} wartende Kandidaten`,
        action_type: 'create_outreach_draft',
        action_payload: {
          sector,
          country: 'Deutschland',
          priority: 'normal',
          reason: `${count} Kandidaten im Bereich ${sector} ohne passende Jobs`,
          suggested_message: `Haben Sie offene Stellen im Bereich ${sector}? CorridorWork zeigt Ihnen sofort passende internationale Kandidaten.`,
        },
        requires_approval: true,
      })
    }
  }

  // ── Pilot-Lead-Status ─────────────────────────────────────────────────────
  if (pilotLeadCount === 0) {
    const title = '🎯 Noch kein Pilot-Lead über Kontaktformular — CTA prüfen'
    if (!existingTitles.has(title)) {
      suggestionsToInsert.push({
        department_slug: 'marketing_strategy',
        title,
        description:
          'Noch keine Pilot-Anfragen über das Kontaktformular (/contact?role=employer&interest=pilot_employer). CTA-Sichtbarkeit auf Landing Page und /for-employers prüfen.',
        category: 'conversion',
        priority: 'medium' as const,
        impact_score: 6,
        effort_score: 3,
        risk_score: 1,
        expected_benefit: 'Erste inbound Pilot-Anfragen',
        requires_approval: false,
      })
    }
  }

  // ── DB-Writes ─────────────────────────────────────────────────────────────
  let suggestionsCreated = 0
  let signalsCreated = 0

  if (suggestionsToInsert.length > 0) {
    const { error } = await supabase.from('agent_suggestions').insert(suggestionsToInsert)
    if (!error) suggestionsCreated = suggestionsToInsert.length
  }

  if (signalsToInsert.length > 0) {
    const { error } = await supabase.from('market_signals').insert(signalsToInsert)
    if (!error) signalsCreated = signalsToInsert.length
  }

  return { suggestions: suggestionsCreated, signals: signalsCreated }
}
