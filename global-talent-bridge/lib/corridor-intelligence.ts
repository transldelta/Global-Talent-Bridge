/**
 * lib/corridor-intelligence.ts
 *
 * Corridor Intelligence Engine — global talent corridor data, buyer scoring,
 * monetization map, and buyer value positioning.
 *
 * All scores are strategic estimates based on publicly available labour
 * market knowledge. They require market validation before commercial use.
 * No external data APIs. No scraping. Pure data layer.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ScoreCriterion {
  key:    string
  label:  string
  value:  number   // 0–max
  max:    number
  note:   string
}

export interface CorridorProfile {
  id:                  string
  label:               string
  sourceMarkets:       string[]
  destinationMarkets:  string[]
  sectors:             string[]
  candidateSourceTypes: string[]
  partnerChannels:     string[]
  legalRisk:           'low' | 'medium' | 'high'
  speedToPilot:        'fast' | 'medium' | 'slow'
  description:         string
  buyerNote:           string
  recommendedFirstAction: string
  scoreBreakdown:      ScoreCriterion[]
}

export interface DemoCorridor {
  id:                   string
  label:                string
  tag:                  string
  sourceMarkets:        string[]
  destinationMarket:    string
  sectors:              string[]
  candidateSources:     string[]
  partnerChannels:      string[]
  buyerScore:           number
  whyHighValue:         string
  recommendedTargetBatch: string
  growthDepartmentLink: string
}

export interface MonetizationPath {
  id:         string
  label:      string
  desc:       string
  revenueType: 'recurring' | 'one-time' | 'transaction' | 'licence'
  effort:     'low' | 'medium' | 'high'
  note:       string
}

// ── Score calculator ──────────────────────────────────────────────────────────

export function calculateBuyerScore(criteria: ScoreCriterion[]): number {
  const total = criteria.reduce((s, c) => s + c.value, 0)
  const max   = criteria.reduce((s, c) => s + c.max,   0)
  return max > 0 ? Math.round((total / max) * 100) : 0
}

export function scoreBand(score: number): { label: string; color: 'green' | 'yellow' | 'red' } {
  if (score >= 75) return { label: 'High opportunity',   color: 'green'  }
  if (score >= 50) return { label: 'Medium opportunity', color: 'yellow' }
  return                 { label: 'Lower priority',      color: 'red'    }
}

// ── Corridor profiles ─────────────────────────────────────────────────────────

export const CORRIDOR_PROFILES: CorridorProfile[] = [
  {
    id:    'morocco-dach-france-spain',
    label: 'Morocco / Tunisia → DACH / France / Spain',
    sourceMarkets:       ['Morocco', 'Tunisia'],
    destinationMarkets:  ['Germany / DACH', 'France', 'Spain'],
    sectors:             ['Healthcare', 'Hospitality', 'Skilled Trades', 'Logistics'],
    candidateSourceTypes: ['Language schools', 'Nursing schools', 'Vocational training centres', 'Training providers'],
    partnerChannels:     ['Relocation partners', 'Recruiting agencies', 'Training providers', 'Language institutes'],
    legalRisk:           'low',
    speedToPilot:        'fast',
    description:         'Morocco and Tunisia have well-developed French and German language training infrastructure. Large documented nursing shortages in DACH create strong pull demand. Language schools in Morocco already prepare candidates for German healthcare employment.',
    buyerNote:           'Germany\'s nursing shortage (Pflegenotstand) is government-documented and structural. Morocco corridor has active bilateral agreements. Fastest corridor to activate with existing language school contacts.',
    recommendedFirstAction: 'Prepare 10 language-school targets in Morocco + 10 healthcare employer targets in Germany/Austria.',
    scoreBreakdown: [
      { key: 'demand',     label: 'Employer demand strength',    value: 19, max: 20, note: 'Germany nursing shortage is legally documented and structural' },
      { key: 'supply',     label: 'Candidate supply potential',  value: 17, max: 20, note: 'Morocco/Tunisia strong French+German language training base' },
      { key: 'partners',   label: 'Partner availability',        value: 13, max: 15, note: 'Language schools, relocation firms, agencies well-established' },
      { key: 'speed',      label: 'Speed to pilot',              value: 13, max: 15, note: 'Fast: existing bilateral agreements, warm contact routes' },
      { key: 'revenue',    label: 'Revenue potential',           value: 14, max: 15, note: 'Healthcare placements command high fees in DACH' },
      { key: 'compliance', label: 'Compliance simplicity',       value: 9,  max: 10, note: 'Low risk if matching-only (not AÜG). Direct hire preferred.' },
      { key: 'buyer',      label: 'Buyer attractiveness',        value: 5,  max: 5,  note: 'High strategic value for HR tech buyer in EU market' },
    ],
  },
  {
    id:    'india-uk-canada-australia-gulf',
    label: 'India → UK / Canada / Australia / Gulf',
    sourceMarkets:       ['India'],
    destinationMarkets:  ['UK', 'Canada', 'Australia', 'Gulf region'],
    sectors:             ['Healthcare', 'IT & Software', 'Engineering'],
    candidateSourceTypes: ['Universities', 'Career centres', 'Nursing colleges', 'IT training institutes'],
    partnerChannels:     ['IT recruiters', 'Nursing placement agencies', 'University career offices', 'Relocation firms'],
    legalRisk:           'low',
    speedToPilot:        'fast',
    description:         'India has the world\'s largest English-speaking professional workforce outside the USA. Strong diaspora networks in UK, Canada, and Australia accelerate placement. IT and healthcare professionals well-prepared for English-speaking markets.',
    buyerNote:           'Largest addressable candidate pool globally for English-market corridor. UK nursing shortage and Canadian tech demand well-documented. LinkedIn-accessible decision-makers make partner outreach fast.',
    recommendedFirstAction: 'Prepare 10 IT employer targets in Canada + 10 Indian university career centres.',
    scoreBreakdown: [
      { key: 'demand',     label: 'Employer demand strength',    value: 17, max: 20, note: 'Strong but competitive — many players in this corridor' },
      { key: 'supply',     label: 'Candidate supply potential',  value: 19, max: 20, note: 'Largest English-speaking graduate pool globally' },
      { key: 'partners',   label: 'Partner availability',        value: 14, max: 15, note: 'IT recruiters, nursing agencies, universities all active' },
      { key: 'speed',      label: 'Speed to pilot',              value: 13, max: 15, note: 'Fast via LinkedIn — English language no barrier' },
      { key: 'revenue',    label: 'Revenue potential',           value: 14, max: 15, note: 'IT hourly rates high; healthcare fees significant' },
      { key: 'compliance', label: 'Compliance simplicity',       value: 10, max: 10, note: 'Low risk — English-speaking, established immigration paths' },
      { key: 'buyer',      label: 'Buyer attractiveness',        value: 5,  max: 5,  note: 'Highest global scale — strong acquisition narrative' },
    ],
  },
  {
    id:    'philippines-germany-canada-gulf',
    label: 'Philippines → Germany / Canada / Gulf / Australia',
    sourceMarkets:       ['Philippines'],
    destinationMarkets:  ['Germany / DACH', 'Canada', 'Gulf region', 'Australia'],
    sectors:             ['Healthcare', 'Hospitality', 'Construction'],
    candidateSourceTypes: ['Nursing schools', 'Vocational training', 'Diaspora associations', 'Career centres'],
    partnerChannels:     ['Recruitment agencies', 'Relocation partners', 'Diaspora organisations', 'Training institutes'],
    legalRisk:           'low',
    speedToPilot:        'medium',
    description:         'Philippines is the world\'s largest international healthcare and hospitality worker source. Established bilateral agreements with Germany (Dreiklang programme). POLO (Philippine Overseas Labour Office) infrastructure supports structured outreach.',
    buyerNote:           'Germany has specific bilateral agreements for Filipino nurses. Pre-existing institutional infrastructure reduces compliance risk significantly. High volume, repeatable corridor with government support.',
    recommendedFirstAction: 'Prepare 10 Filipino nursing-school targets + 10 German healthcare employers.',
    scoreBreakdown: [
      { key: 'demand',     label: 'Employer demand strength',    value: 18, max: 20, note: 'Germany/Gulf/Australia all have documented healthcare demand' },
      { key: 'supply',     label: 'Candidate supply potential',  value: 18, max: 20, note: 'Philippines #1 healthcare worker export country globally' },
      { key: 'partners',   label: 'Partner availability',        value: 12, max: 15, note: 'Strong agency infrastructure but competitive market' },
      { key: 'speed',      label: 'Speed to pilot',              value: 11, max: 15, note: 'Medium: language training for Germany adds time' },
      { key: 'revenue',    label: 'Revenue potential',           value: 13, max: 15, note: 'High volume placement potential' },
      { key: 'compliance', label: 'Compliance simplicity',       value: 9,  max: 10, note: 'Bilateral agreements reduce risk' },
      { key: 'buyer',      label: 'Buyer attractiveness',        value: 5,  max: 5,  note: 'Government-backed corridor — high institutional credibility' },
    ],
  },
  {
    id:    'nigeria-ghana-kenya-uk-canada-germany',
    label: 'Nigeria / Ghana / Kenya → UK / Canada / Germany',
    sourceMarkets:       ['Nigeria', 'Ghana', 'Kenya'],
    destinationMarkets:  ['UK', 'Canada', 'Germany / DACH'],
    sectors:             ['Healthcare', 'IT & Software', 'Engineering'],
    candidateSourceTypes: ['Universities', 'Professional associations', 'Training providers', 'Diaspora organisations'],
    partnerChannels:     ['Recruiting agencies', 'Professional bodies', 'Diaspora networks'],
    legalRisk:           'medium',
    speedToPilot:        'medium',
    description:         'Growing professional pools in West and East Africa, particularly healthcare and tech. UK and Canada have established immigration pathways. Germany requires German language preparation which adds lead time.',
    buyerNote:           'Growing corridor with strong diaspora networks. Medium compliance complexity. High long-term upside as African professional markets mature. Ideal for buyer seeking emerging-market positioning.',
    recommendedFirstAction: 'Prepare 5 UK healthcare employer targets + 5 Nigerian professional association targets.',
    scoreBreakdown: [
      { key: 'demand',     label: 'Employer demand strength',    value: 15, max: 20, note: 'UK/Canada strong; Germany improving but needs language' },
      { key: 'supply',     label: 'Candidate supply potential',  value: 15, max: 20, note: 'Growing fast but variable quality assurance' },
      { key: 'partners',   label: 'Partner availability',        value: 10, max: 15, note: 'Fewer structured partners than India/Morocco corridors' },
      { key: 'speed',      label: 'Speed to pilot',              value: 9,  max: 15, note: 'Medium — language and qualification verification needed' },
      { key: 'revenue',    label: 'Revenue potential',           value: 12, max: 15, note: 'UK healthcare fees significant; Canada tech rates high' },
      { key: 'compliance', label: 'Compliance simplicity',       value: 7,  max: 10, note: 'Medium risk — varying qualification recognition' },
      { key: 'buyer',      label: 'Buyer attractiveness',        value: 4,  max: 5,  note: 'Emerging market upside attractive to growth-oriented buyer' },
    ],
  },
  {
    id:    'turkey-dach-eu',
    label: 'Turkey → DACH / EU',
    sourceMarkets:       ['Turkey'],
    destinationMarkets:  ['Germany / DACH', 'Netherlands', 'France'],
    sectors:             ['Healthcare', 'Engineering', 'Skilled Trades', 'Construction'],
    candidateSourceTypes: ['Vocational schools', 'Universities', 'Training providers', 'Diaspora networks'],
    partnerChannels:     ['Recruiting agencies', 'Diaspora organisations', 'Vocational training institutes'],
    legalRisk:           'low',
    speedToPilot:        'fast',
    description:         'Turkey has a large established diaspora in Germany (3+ million). Cultural and linguistic familiarity accelerates integration. Strong vocational training infrastructure. Healthcare and engineering professionals increasingly mobile.',
    buyerNote:           'Diaspora networks significantly reduce initial outreach friction. Germany-Turkey corridor has decades of established labour mobility. High cultural fit reduces employer hesitation.',
    recommendedFirstAction: 'Prepare 10 German healthcare/engineering employer targets with Turkey corridor focus.',
    scoreBreakdown: [
      { key: 'demand',     label: 'Employer demand strength',    value: 16, max: 20, note: 'Strong in skilled trades and healthcare in DACH' },
      { key: 'supply',     label: 'Candidate supply potential',  value: 15, max: 20, note: 'Large diaspora + active new-generation professionals' },
      { key: 'partners',   label: 'Partner availability',        value: 12, max: 15, note: 'Diaspora networks strong, formal agencies less structured' },
      { key: 'speed',      label: 'Speed to pilot',              value: 13, max: 15, note: 'Fast: existing community, German language often present' },
      { key: 'revenue',    label: 'Revenue potential',           value: 12, max: 15, note: 'Medium — skilled trades fees lower than healthcare' },
      { key: 'compliance', label: 'Compliance simplicity',       value: 9,  max: 10, note: 'Low risk — EU candidate, established mobility framework' },
      { key: 'buyer',      label: 'Buyer attractiveness',        value: 4,  max: 5,  note: 'Established corridor — reduces risk perception for buyer' },
    ],
  },
  {
    id:    'latam-spain-portugal-canada',
    label: 'Latin America → Spain / Portugal / Canada',
    sourceMarkets:       ['Latin America'],
    destinationMarkets:  ['Spain', 'Portugal', 'Canada'],
    sectors:             ['Healthcare', 'IT & Software', 'Hospitality'],
    candidateSourceTypes: ['Universities', 'Career centres', 'Nursing schools', 'IT training providers'],
    partnerChannels:     ['University career offices', 'IT recruiters', 'Healthcare agencies'],
    legalRisk:           'low',
    speedToPilot:        'fast',
    description:         'Spanish and Portuguese language advantage creates the most frictionless cultural corridor in global talent mobility. Canada increasingly accepting Latin American professionals under Express Entry. Healthcare and tech strong candidate pipeline.',
    buyerNote:           'Language advantage is a structural differentiator. Spain and Portugal actively seek Latin American professionals for healthcare and tech. Canada Express Entry creates institutional pathway.',
    recommendedFirstAction: 'Prepare 10 Latin American university career centre targets + 10 Spanish healthcare employer targets.',
    scoreBreakdown: [
      { key: 'demand',     label: 'Employer demand strength',    value: 14, max: 20, note: 'Spain/Portugal growing demand; Canada strong' },
      { key: 'supply',     label: 'Candidate supply potential',  value: 16, max: 20, note: 'Large Spanish-speaking professional pools in multiple countries' },
      { key: 'partners',   label: 'Partner availability',        value: 11, max: 15, note: 'Less structured agency infrastructure than EU-Africa corridors' },
      { key: 'speed',      label: 'Speed to pilot',              value: 13, max: 15, note: 'Fast: no language barrier, cultural fit' },
      { key: 'revenue',    label: 'Revenue potential',           value: 11, max: 15, note: 'Medium — Spanish/Portuguese markets smaller fee potential' },
      { key: 'compliance', label: 'Compliance simplicity',       value: 9,  max: 10, note: 'Low — EU residency rights for some, Canada has clear pathways' },
      { key: 'buyer',      label: 'Buyer attractiveness',        value: 4,  max: 5,  note: 'Language advantage is a genuine differentiator' },
    ],
  },
  {
    id:    'eastern-europe-dach-netherlands-uk',
    label: 'Eastern Europe → Germany / Netherlands / UK',
    sourceMarkets:       ['Eastern Europe'],
    destinationMarkets:  ['Germany / DACH', 'Netherlands', 'UK'],
    sectors:             ['Healthcare', 'Construction', 'Logistics', 'Engineering'],
    candidateSourceTypes: ['Vocational schools', 'Nursing schools', 'Training providers', 'Recruiting agencies'],
    partnerChannels:     ['Staffing agencies', 'Recruiting firms', 'Training providers'],
    legalRisk:           'low',
    speedToPilot:        'fast',
    description:         'Established intra-EU and post-EU mobility. Strong vocational training infrastructure in Poland, Romania, Ukraine. Healthcare and construction particularly active corridors with documented demand.',
    buyerNote:           'Most operationally mature corridor in Europe. EU-to-EU mobility reduces legal complexity. Large existing agency infrastructure means partner channel outreach is highly efficient.',
    recommendedFirstAction: 'Prepare 10 German/Netherlands construction or healthcare employer targets with Eastern European corridor tag.',
    scoreBreakdown: [
      { key: 'demand',     label: 'Employer demand strength',    value: 16, max: 20, note: 'Construction and nursing demand very strong in DACH/NL' },
      { key: 'supply',     label: 'Candidate supply potential',  value: 15, max: 20, note: 'Poland, Romania, Ukraine large professional pools' },
      { key: 'partners',   label: 'Partner availability',        value: 14, max: 15, note: 'Most mature agency infrastructure of all corridors' },
      { key: 'speed',      label: 'Speed to pilot',              value: 14, max: 15, note: 'Fastest: existing agencies, EU mobility, established routes' },
      { key: 'revenue',    label: 'Revenue potential',           value: 11, max: 15, note: 'Competitive market — fees lower but volume high' },
      { key: 'compliance', label: 'Compliance simplicity',       value: 10, max: 10, note: 'Lowest risk of all corridors — EU-to-EU movement' },
      { key: 'buyer',      label: 'Buyer attractiveness',        value: 4,  max: 5,  note: 'Mature corridor — lower risk perception for buyer' },
    ],
  },
  {
    id:    'egypt-pakistan-gulf-uk-canada',
    label: 'Egypt / Pakistan → Gulf / UK / Canada',
    sourceMarkets:       ['Egypt', 'Pakistan'],
    destinationMarkets:  ['Gulf region', 'UK', 'Canada'],
    sectors:             ['Engineering', 'Healthcare', 'Construction', 'IT & Software'],
    candidateSourceTypes: ['Universities', 'Engineering colleges', 'Training providers', 'Professional associations'],
    partnerChannels:     ['Staffing agencies', 'Engineering recruiters', 'Gulf-focused agencies'],
    legalRisk:           'medium',
    speedToPilot:        'medium',
    description:         'Long-established Gulf labour corridors for both countries. UK and Canada offering alternative pathways as Gulf labour law evolves. Engineering and healthcare main professional sectors.',
    buyerNote:           'Proven historical corridor with decades of labour flow. Gulf expansion by CorridorWork adds intelligence layer to existing but unstructured market. Medium compliance due to Gulf labour law variation.',
    recommendedFirstAction: 'Prepare 10 Gulf engineering employer targets + 5 Pakistani engineering college targets.',
    scoreBreakdown: [
      { key: 'demand',     label: 'Employer demand strength',    value: 17, max: 20, note: 'Gulf construction and engineering demand consistently high' },
      { key: 'supply',     label: 'Candidate supply potential',  value: 15, max: 20, note: 'Pakistan/Egypt large engineering and healthcare pools' },
      { key: 'partners',   label: 'Partner availability',        value: 11, max: 15, note: 'Gulf-focused agencies active but fragmented' },
      { key: 'speed',      label: 'Speed to pilot',              value: 10, max: 15, note: 'Medium — Gulf visa processes and qualification checks' },
      { key: 'revenue',    label: 'Revenue potential',           value: 12, max: 15, note: 'Gulf placements often high-value' },
      { key: 'compliance', label: 'Compliance simplicity',       value: 7,  max: 10, note: 'Medium — Gulf labour law varies by country' },
      { key: 'buyer',      label: 'Buyer attractiveness',        value: 4,  max: 5,  note: 'Established market with intelligence gap — differentiation opportunity' },
    ],
  },
]

// ── Demo Corridors (buyer-facing highlights) ──────────────────────────────────

export const DEMO_CORRIDORS: DemoCorridor[] = [
  {
    id:                'germany-healthcare',
    label:             'Germany Healthcare Corridor',
    tag:               'Highest demand · Fastest activation · EU-documented shortage',
    sourceMarkets:     ['Philippines', 'Morocco', 'Tunisia'],
    destinationMarket: 'Germany / DACH',
    sectors:           ['Healthcare', 'Nursing', 'Care support'],
    candidateSources:  ['Language schools (Morocco/Tunisia)', 'Nursing schools (Philippines)', 'Training providers'],
    partnerChannels:   ['Relocation partners', 'Training providers', 'Recruiting agencies'],
    buyerScore:        93,
    whyHighValue:      'Germany faces a legally documented structural nursing shortage (Pflegenotstand). The Morocco and Philippines corridors have existing bilateral frameworks. Language training is the key bottleneck — and language schools are the fastest contact point. One pilot language school can activate dozens of qualified candidates.',
    recommendedTargetBatch: 'Prepare 10 candidate-source targets (language schools Morocco/Philippines) + 10 employer/partner targets (German healthcare employers or relocation firms).',
    growthDepartmentLink: '/admin/global-growth-department',
  },
  {
    id:                'canada-it',
    label:             'Canada IT Corridor',
    tag:               'High revenue per placement · English-speaking · LinkedIn-accessible',
    sourceMarkets:     ['India', 'Nigeria', 'Eastern Europe'],
    destinationMarket: 'Canada',
    sectors:           ['IT & Software', 'Cloud', 'Technical support'],
    candidateSources:  ['Universities', 'Career centres', 'Candidate communities (India)', 'IT training institutes'],
    partnerChannels:   ['IT recruiters', 'Training providers', 'Relocation support firms'],
    buyerScore:        88,
    whyHighValue:      'Canada IT market combines high hourly rates with an Express Entry immigration system that actively recruits tech professionals. India is the world\'s largest English-speaking tech candidate pool. LinkedIn-accessible decision-makers mean the partner outreach cycle is fast and low-friction.',
    recommendedTargetBatch: 'Prepare 10 IT employer targets in Canada + 10 candidate-source partners (Indian universities, career centres).',
    growthDepartmentLink: '/admin/global-growth-department',
  },
  {
    id:                'gulf-hospitality',
    label:             'Gulf Hospitality Corridor',
    tag:               'High volume · Proven historical corridor · Recurring demand',
    sourceMarkets:     ['Philippines', 'India', 'Egypt', 'Pakistan'],
    destinationMarket: 'Gulf region',
    sectors:           ['Hospitality', 'Logistics', 'Service'],
    candidateSources:  ['Training centres', 'Vocational schools', 'Hospitality institutes', 'Recruitment agencies'],
    partnerChannels:   ['Staffing partners', 'Training providers', 'Relocation support'],
    buyerScore:        81,
    whyHighValue:      'Gulf hospitality demand is structural and recurring — driven by tourism, mega-projects (Saudi Vision 2030, UAE Expo follow-on), and permanent hospitality infrastructure. Philippines and India have the world\'s largest hospitality-trained candidate pipelines. High repeat-placement potential.',
    recommendedTargetBatch: 'Prepare partner-channel targets first (Gulf staffing agencies, Filipino hospitality training centres). Employer outreach second.',
    growthDepartmentLink: '/admin/global-growth-department',
  },
]

// ── Buyer Value Layer ─────────────────────────────────────────────────────────

export const BUYER_VALUE_ITEMS: { category: string; items: string[] }[] = [
  {
    category: 'Employer side',
    items: [
      'Structured demand intake via /global/employers',
      'Manual review workflow with admin-reviewed lead qualification',
      'Fit score and sector-specific matching',
      'Employer leads stored in production PostgreSQL with full audit trail',
    ],
  },
  {
    category: 'Candidate source side',
    items: [
      'Inbound candidate interest via /global/candidates',
      'Source-market targeting across 12 source countries',
      'Voluntary, consent-based, no candidate fees',
      'Candidate interest leads in production PostgreSQL',
    ],
  },
  {
    category: 'Partner side',
    items: [
      'Partner enquiry intake via /partners',
      'Recruiting agency, relocation, language school, and strategic partner tracks',
      'Strategic partnership page via /strategic-partnership',
      'Partner leads in production PostgreSQL',
    ],
  },
  {
    category: 'Corridor intelligence',
    items: [
      '8 pre-defined global talent corridors with Buyer Opportunity Scores',
      'Demand + supply + partner + compliance + revenue scoring per corridor',
      '3 demo corridor deep-dives with actionable batch targets',
      'Corridor map integrated with Growth Department',
    ],
  },
  {
    category: 'Approval-based growth pipeline',
    items: [
      'Persistent growth_targets table in Supabase (EU-Frankfurt, RLS active)',
      'Persistent growth_messages table (no_auto_send enforced at DB level)',
      'Quick Add Bulk Import (up to 50 targets)',
      'Batch Target Planner per corridor / sector / country',
      'Gmail draft integration (mail.google.com — no API, manual send only)',
      'Contact Form Autofill Helper (fills fields, never submits)',
      'Approval Queue with 9 status stages',
    ],
  },
  {
    category: 'Buyer transfer readiness',
    items: [
      'JSON export of full growth pipeline via /api/admin/growth/export',
      'docs/BUYER_TRANSFER_DATA_EXPORT.md with full transfer checklist',
      'Supabase project transferable (Settings → Transfer Project)',
      'Vercel project transferable',
      'All env vars documented in .env.example',
    ],
  },
  {
    category: 'Safety & compliance',
    items: [
      'No automatic sending — ever',
      'No scraping',
      'No job guarantee',
      'No visa guarantee',
      'No candidate fees',
      'No Stripe activated',
      'no_auto_send CHECK constraint enforced at PostgreSQL level',
      'RLS active on all tables — no public/anon access',
    ],
  },
]

export const BUYER_DIFFERENTIATION = `CorridorWork is positioned as a global corridor operating system, not a job board. The value is in prioritising high-potential corridors, preparing compliant growth actions, and managing every employer, partner, and candidate-source step through a persistent approval queue backed by a GDPR-compliant EU database.`

// ── Monetization paths ────────────────────────────────────────────────────────

export const MONETIZATION_PATHS: MonetizationPath[] = [
  {
    id:          'saas_agency',
    label:       'SaaS licence for recruiting agencies',
    desc:        'Monthly or annual licence for agencies to access corridor intelligence, generate outreach drafts, and manage their own approval queue.',
    revenueType: 'recurring',
    effort:      'low',
    note:        'Most natural first commercial step. Agencies already use similar tools. Corridor intelligence is a genuine differentiator.',
  },
  {
    id:          'white_label',
    label:       'White-label licence for partners',
    desc:        'Partners (relocation firms, training providers) can access a white-labelled version of the platform under their own brand.',
    revenueType: 'licence',
    effort:      'medium',
    note:        'Higher value per customer. Requires UI customisation. Platform architecture supports this without structural changes.',
  },
  {
    id:          'employer_pilot',
    label:       'Employer pilot package',
    desc:        'One-time or recurring fee for employers to access corridor matching, candidate interest profiles, and structured follow-up.',
    revenueType: 'one-time',
    effort:      'low',
    note:        'Fastest to activate once first pilot employer is on-board. No infrastructure changes required.',
  },
  {
    id:          'partner_intelligence',
    label:       'Partner intelligence package',
    desc:        'Access to corridor intelligence reports, Buyer Opportunity Scores, and recommended target batches for a given corridor.',
    revenueType: 'recurring',
    effort:      'low',
    note:        'Intelligence-as-a-Service model. No operational involvement in placement required.',
  },
  {
    id:          'candidate_source',
    label:       'Candidate source partnership package',
    desc:        'Language schools, training providers, and universities pay for structured access to employer demand data for their graduates.',
    revenueType: 'recurring',
    effort:      'medium',
    note:        'Reverses the traditional model — candidate sources pay for employer demand intelligence rather than the other way around.',
  },
  {
    id:          'corridor_dashboard',
    label:       'Market corridor intelligence dashboard',
    desc:        'A premium dashboard for HR tech companies, government bodies, or investment firms needing structured corridor-level market data.',
    revenueType: 'licence',
    effort:      'high',
    note:        'Highest per-customer value. Requires data validation and client-facing reporting. Long-term strategic path.',
  },
  {
    id:          'acquisition',
    label:       'Acquisition by recruiting or HR tech company',
    desc:        'Full acquisition of the CorridorWork platform, pipeline, corridor intelligence, and codebase.',
    revenueType: 'one-time',
    effort:      'high',
    note:        'The primary current focus. Platform is transfer-ready: Supabase transferable, Vercel transferable, full docs, JSON export.',
  },
]

// ── Operating disclaimer ──────────────────────────────────────────────────────

export const SCORE_DISCLAIMER = 'Strategic estimate — requires market validation. Scores are based on publicly available labour market knowledge and the authors\' assessment. They are not derived from a commissioned market study and should not be used as investment advice.'
