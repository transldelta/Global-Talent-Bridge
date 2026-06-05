import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Landingpage Factory Agent
 *
 * Liest migration_corridors + corridor_intelligence, erzeugt und aktualisiert
 * Landingpages in der landingpage_factory Tabelle.
 *
 * ✅ analysieren  ✅ priorisieren  ✅ Landingpages erzeugen  ✅ SEO-Daten setzen
 * ❌ veröffentlichen  ❌ E-Mails senden  ❌ Werbung  ❌ externe APIs
 *
 * Alle Aktionen werden in system_logs protokolliert.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

type MigrationCorridor = {
  id: string
  source_country: string
  target_country: string
  sector: string
  status: string
  opportunity_score: number
  priority_level: string | null
}

type CorridorIntelligence = {
  corridor_id: string
  top_professions: string[]
  opportunity_score: number
  demand_level: number
  recommended_landingpage_slug: string | null
}

type LandingpageRow = {
  id: string
  slug: string
  status: string
  opportunity_score: number
  priority_level: string | null
}

// ─── Language detection per corridor ─────────────────────────────────────────

function detectLanguage(sourceCountry: string, targetCountry: string): string {
  const countryLang: Record<string, string> = {
    Marokko: 'fr', Tunesien: 'fr', Algerien: 'fr', Frankreich: 'fr',
    Türkei: 'tr',
    Brasilien: 'pt', Portugal: 'pt',
    Indien: 'en', Nigeria: 'en', Philippinen: 'en', Australien: 'en', UK: 'en', Kanada: 'en',
    Deutschland: 'de', Österreich: 'de', Schweiz: 'de',
  }
  // Source country language takes priority for candidate-facing pages
  return countryLang[sourceCountry] ?? countryLang[targetCountry] ?? 'en'
}

// ─── SEO title generator ──────────────────────────────────────────────────────

function generateSeoTitle(
  sourceCountry: string,
  targetCountry: string,
  sector: string,
  language: string,
  professions: string[]
): string {
  const mainProfession = professions[0] ?? sector

  const templates: Record<string, string> = {
    en: `${mainProfession} Jobs in ${targetCountry} for ${sourceCountry} Professionals | CorridorWork`,
    de: `${mainProfession}-Jobs in ${targetCountry} für Fachkräfte aus ${sourceCountry} | CorridorWork`,
    fr: `Emplois ${mainProfession} en ${targetCountry} pour professionnels de ${sourceCountry} | CorridorWork`,
    tr: `${targetCountry}'da ${mainProfession} İş Fırsatları — ${sourceCountry} Uzmanları İçin | CorridorWork`,
    pt: `Vagas de ${mainProfession} em ${targetCountry} para profissionais de ${sourceCountry} | CorridorWork`,
    ar: `وظائف ${mainProfession} في ${targetCountry} للمهنيين من ${sourceCountry} | CorridorWork`,
  }
  return templates[language] ?? templates.en
}

// ─── SEO description generator ───────────────────────────────────────────────

function generateSeoDescription(
  sourceCountry: string,
  targetCountry: string,
  sector: string,
  language: string
): string {
  const templates: Record<string, string> = {
    en: `Structured job matching for ${sourceCountry} professionals seeking ${sector} roles in ${targetCountry}. Visa pathway guidance, qualification recognition support, and transparent employer matching — no fees.`,
    de: `Strukturiertes Job-Matching für Fachkräfte aus ${sourceCountry} im Bereich ${sector} in ${targetCountry}. Visa-Begleitung, Anerkennung ausländischer Abschlüsse und transparentes Arbeitgeber-Matching — kostenlos.`,
    fr: `Matching structuré pour professionnels de ${sourceCountry} en ${sector} vers ${targetCountry}. Accompagnement visa, reconnaissance des diplômes et mise en relation avec employeurs — gratuit.`,
    tr: `${sourceCountry} kökenli ${sector} uzmanları için ${targetCountry}'da yapılandırılmış iş eşleştirmesi. Vize rehberliği, diploma tanıma desteği ve şeffaf işveren eşleştirmesi — ücretsiz.`,
    pt: `Matching estruturado para profissionais de ${sourceCountry} na área de ${sector} em ${targetCountry}. Orientação de visto, reconhecimento de qualificações e matching com empregadores — gratuito.`,
    ar: `مطابقة وظيفية منظمة للمهنيين من ${sourceCountry} في مجال ${sector} نحو ${targetCountry}. إرشادات التأشيرة ودعم الاعتراف بالمؤهلات — مجانًا.`,
  }
  return templates[language] ?? templates.en
}

// ─── Slug generator ───────────────────────────────────────────────────────────

function generateSlug(
  sourceCountry: string,
  targetCountry: string,
  sector: string,
  language: string
): string {
  const countrySlug: Record<string, string> = {
    'Indien': 'india', 'Nigeria': 'nigeria', 'Philippinen': 'philippines',
    'Marokko': 'maroc', 'Tunesien': 'tunisie', 'Türkei': 'turkiye',
    'Brasilien': 'brasil', 'Algerien': 'algerie',
    'UK': 'uk', 'Kanada': 'canada', 'Australien': 'australia',
    'Deutschland': 'almanya', 'Österreich': 'austria', 'Portugal': 'portugal',
    'Frankreich': 'france',
  }

  const sectorSlug: Record<string, Record<string, string>> = {
    en: { 'Pflege': 'nursing', 'IT / Software': 'it-jobs', 'Technik / Ingenieurwesen': 'engineering', 'Industrie / Produktion': 'industry' },
    de: { 'Pflege': 'pflege', 'IT / Software': 'it-jobs', 'Technik / Ingenieurwesen': 'ingenieur', 'Industrie / Produktion': 'industrie' },
    fr: { 'Pflege': 'soins-emplois', 'IT / Software': 'emplois-it', 'Technik / Ingenieurwesen': 'ingenierie', 'Industrie / Produktion': 'industrie-emplois' },
    tr: { 'Pflege': 'saglik-kariyer', 'IT / Software': 'it-kariyer', 'Technik / Ingenieurwesen': 'muhendis-kariyer', 'Industrie / Produktion': 'endustri-kariyer' },
    pt: { 'Pflege': 'enfermagem-vagas', 'IT / Software': 'vagas-ti', 'Technik / Ingenieurwesen': 'engenharia-vagas', 'Industrie / Produktion': 'industria-vagas' },
  }

  const src = countrySlug[sourceCountry] ?? sourceCountry.toLowerCase().replace(/\s+/g, '-')
  const tgt = countrySlug[targetCountry] ?? targetCountry.toLowerCase().replace(/\s+/g, '-')
  const sec = (sectorSlug[language] ?? sectorSlug.en)[sector] ?? sector.toLowerCase().replace(/[^a-z0-9]/g, '-')

  return `${src}-${tgt}-${sec}`
}

// ─── Title generator ─────────────────────────────────────────────────────────

function generateTitle(
  sourceCountry: string,
  targetCountry: string,
  sector: string,
  language: string
): string {
  const templates: Record<string, string> = {
    en: `${sector} Jobs in ${targetCountry} for ${sourceCountry} Professionals`,
    de: `${sector}-Jobs in ${targetCountry} für Fachkräfte aus ${sourceCountry}`,
    fr: `Emplois en ${sector} en ${targetCountry} pour professionnels de ${sourceCountry}`,
    tr: `${targetCountry}'da ${sector} Kariyer Fırsatları`,
    pt: `Vagas de ${sector} em ${targetCountry} para ${sourceCountry}`,
  }
  return templates[language] ?? templates.en
}

// ─── Priority derivation ──────────────────────────────────────────────────────

function derivePriority(score: number): string {
  if (score >= 85) return 'critical'
  if (score >= 70) return 'high'
  if (score >= 50) return 'medium'
  return 'low'
}

// ─── Main Agent ───────────────────────────────────────────────────────────────

export async function runLandingpageFactoryAgent(): Promise<{
  corridorsProcessed: number
  landingpagesCreated: number
  landingpagesUpdated: number
  suggestionsCreated: number
  notificationsCreated: number
}> {
  const supabase = createAdminClient()
  const agentName = 'landingpage-factory-agent'

  let landingpagesCreated = 0
  let landingpagesUpdated = 0
  let suggestionsCreated = 0
  let notificationsCreated = 0

  // ── 1. Load active corridors ──────────────────────────────────────────────────
  const { data: rawCorridors, error: corrErr } = await supabase
    .from('migration_corridors')
    .select('id, source_country, target_country, sector, status, opportunity_score, priority_level')
    .eq('status', 'active')

  if (corrErr) {
    await supabase.from('system_logs').insert({
      agent_name: agentName, status: 'error',
      message: `LPF Agent: Fehler beim Laden der Korridore — ${corrErr.message}`,
    })
    throw new Error(`LPF Agent: ${corrErr.message}`)
  }

  const corridors = (rawCorridors ?? []) as MigrationCorridor[]

  // ── 2. Load corridor intelligence for score enrichment ──────────────────────
  const { data: rawCI } = await supabase
    .from('corridor_intelligence')
    .select('corridor_id, top_professions, opportunity_score, demand_level, recommended_landingpage_slug')

  const ciMap = new Map<string, CorridorIntelligence>()
  for (const ci of (rawCI ?? []) as CorridorIntelligence[]) {
    ciMap.set(ci.corridor_id, ci)
  }

  // ── 3. Load existing landingpages (slugs for dedup) ──────────────────────────
  const { data: rawExisting } = await supabase
    .from('landingpage_factory')
    .select('id, slug, status, opportunity_score, priority_level')

  const existingBySlug = new Map<string, LandingpageRow>()
  for (const lp of (rawExisting ?? []) as LandingpageRow[]) {
    existingBySlug.set(lp.slug, lp)
  }

  // ── 4. Load existing suggestion titles (7-day dedup) ────────────────────────
  const { data: existingSugg } = await supabase
    .from('agent_suggestions')
    .select('title')
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
  const existingTitles = new Set((existingSugg ?? []).map((s: { title: string }) => s.title))

  // ── 5. Process each corridor ──────────────────────────────────────────────────
  for (const corridor of corridors) {
    const ci = ciMap.get(corridor.id)
    const professions = ci?.top_professions ?? []
    const opportunityScore = ci?.opportunity_score ?? corridor.opportunity_score
    const language = detectLanguage(corridor.source_country, corridor.target_country)

    // Determine slug: prefer CI recommendation, fallback to generated
    const slug = ci?.recommended_landingpage_slug
      ?? generateSlug(corridor.source_country, corridor.target_country, corridor.sector, language)

    const title    = generateTitle(corridor.source_country, corridor.target_country, corridor.sector, language)
    const seoTitle = generateSeoTitle(corridor.source_country, corridor.target_country, corridor.sector, language, professions)
    const seoDesc  = generateSeoDescription(corridor.source_country, corridor.target_country, corridor.sector, language)
    const priority = derivePriority(opportunityScore)
    const professionFocus = professions.slice(0, 3).join(', ') || corridor.sector

    const existing = existingBySlug.get(slug)

    if (!existing) {
      // Create new landingpage
      const { error } = await supabase.from('landingpage_factory').insert({
        corridor_id:      corridor.id,
        title,
        slug,
        language,
        target_country:   corridor.target_country,
        source_country:   corridor.source_country,
        profession_focus: professionFocus,
        seo_title:        seoTitle,
        seo_description:  seoDesc,
        opportunity_score: opportunityScore,
        priority_level:   priority,
        status:           opportunityScore >= 80 ? 'ready_for_review' : 'draft',
      })
      if (!error) landingpagesCreated++
    } else {
      // Update score/priority if changed
      if (existing.opportunity_score !== opportunityScore || existing.priority_level !== priority) {
        const { error } = await supabase
          .from('landingpage_factory')
          .update({
            opportunity_score: opportunityScore,
            priority_level:    priority,
            seo_title:         seoTitle,
            seo_description:   seoDesc,
            profession_focus:  professionFocus,
            updated_at:        new Date().toISOString(),
          })
          .eq('id', existing.id)
        if (!error) landingpagesUpdated++
      }
    }
  }

  // ── 6. CEO suggestions for high-priority new landingpages ────────────────────
  const { data: topLPs } = await supabase
    .from('landingpage_factory')
    .select('id, slug, title, opportunity_score, priority_level, status, source_country, target_country, profession_focus')
    .in('priority_level', ['critical', 'high'])
    .in('status', ['draft', 'ready_for_review'])
    .order('opportunity_score', { ascending: false })
    .limit(5)

  for (const lp of (topLPs ?? []) as Array<{ id: string; slug: string; title: string; opportunity_score: number; priority_level: string; status: string; source_country: string; target_country: string; profession_focus: string | null }>) {
    const suggTitle = `[LPF] ${lp.title} — Score ${lp.opportunity_score}/100`
    if (existingTitles.has(suggTitle)) continue

    const { error } = await supabase.from('agent_suggestions').insert({
      agent_name:  agentName,
      title:       suggTitle,
      description: `Landingpage "${lp.title}" (/${lp.slug}) ist bereit zur Überprüfung. ` +
        `Korridor: ${lp.source_country} → ${lp.target_country}. ` +
        `Fokus: ${lp.profession_focus ?? '—'}. Score: ${lp.opportunity_score}/100. ` +
        `Status: ${lp.status}. Nächster Schritt: Inhalt prüfen und auf "approved" setzen.`,
      priority: lp.priority_level,
      metadata: {
        slug: lp.slug,
        opportunity_score: lp.opportunity_score,
        source_country: lp.source_country,
        target_country: lp.target_country,
      },
    })
    if (!error) {
      suggestionsCreated++
      existingTitles.add(suggTitle)
    }
  }

  // ── 7. Notifications for critical landingpages ───────────────────────────────
  const { data: criticalLPs } = await supabase
    .from('landingpage_factory')
    .select('id, slug, title, opportunity_score')
    .eq('priority_level', 'critical')
    .in('status', ['draft', 'ready_for_review'])

  for (const lp of (criticalLPs ?? []) as Array<{ id: string; slug: string; title: string; opportunity_score: number }>) {
    const notifTitle = `🚀 Kritische Landingpage bereit: /${lp.slug}`
    const { data: existing } = await supabase
      .from('agent_notifications')
      .select('id')
      .eq('title', notifTitle)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .limit(1)
    if (existing && existing.length > 0) continue

    const { error } = await supabase.from('agent_notifications').insert({
      agent_name:        agentName,
      title:             notifTitle,
      message:           `Landingpage "${lp.title}" (Score: ${lp.opportunity_score}/100) ist bereit zur Überprüfung und Veröffentlichung. Bitte im Admin-Bereich freigeben.`,
      notification_type: 'alert',
      priority:          'critical',
      metadata:          { slug: lp.slug, opportunity_score: lp.opportunity_score },
    })
    if (!error) notificationsCreated++
  }

  // ── 8. System log ─────────────────────────────────────────────────────────────
  await supabase.from('system_logs').insert({
    agent_name: agentName,
    status:     'success',
    message:    `LPF Agent abgeschlossen: ${corridors.length} Korridore, ${landingpagesCreated} neue Landingpages, ${landingpagesUpdated} Updates, ${suggestionsCreated} Vorschläge.`,
  })

  return {
    corridorsProcessed: corridors.length,
    landingpagesCreated,
    landingpagesUpdated,
    suggestionsCreated,
    notificationsCreated,
  }
}
