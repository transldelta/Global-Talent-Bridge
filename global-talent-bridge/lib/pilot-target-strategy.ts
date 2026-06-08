/**
 * lib/pilot-target-strategy.ts
 *
 * Pure data and functions for the Pilot Target Strategy admin page.
 * No side effects. No sending. No scraping. No external API calls.
 * Text generation and scoring only.
 *
 * Importable in Client Components and Tests.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export type TargetGroup = 'employer' | 'recruiting_partner' | 'strategic_partner'

export type TargetStatus =
  | 'idea'
  | 'shortlisted'
  | 'contacted_manually'
  | 'replied'
  | 'rejected'
  | 'pilot_discussion'

export interface FitScoreCriterion {
  key:   string
  label: string
  desc:  string
  weight: number   // points if criterion met (total = 100)
}

export interface TargetGroup_ {
  id:      TargetGroup
  label:   string
  tagline: string
  why:     string
  examples: string[]
  approach: string
}

export interface RedFlag {
  label: string
  desc:  string
  severity: 'high' | 'medium'
}

export interface OutreachDraft {
  id:      string
  label:   string
  channel: string
  note:    string
  text:    string
}

// ── Target Groups ─────────────────────────────────────────────────────────────

export const TARGET_GROUPS: TargetGroup_[] = [
  {
    id:      'employer',
    label:   'Employer — Direct Workforce Demand',
    tagline: 'Companies with genuine international hiring needs',
    why:     'Employers with unfilled roles in sectors with documented shortages are the most natural first pilot. They have a real problem, a budget, and motivation to try something new.',
    examples: [
      'Healthcare operator needing nursing or care staff',
      'Engineering or manufacturing firm with open technical roles',
      'IT company needing software developers or data specialists',
      'Construction firm with recurring skilled trades needs',
      'Hospitality group with seasonal or permanent staffing gaps',
      'Logistics operator needing drivers or warehouse staff',
    ],
    approach: 'LinkedIn or WhatsApp — personal, short, specific to their sector. Reference the actual shortage, not a generic pitch.',
  },
  {
    id:      'recruiting_partner',
    label:   'Recruiting & Staffing Partner',
    tagline: 'Agencies and providers that work with international candidates',
    why:     'Recruiting partners already have the infrastructure, the relationships, and the problem we solve. A single partner can open access to multiple employer clients immediately.',
    examples: [
      'International recruiting agencies with Germany/Austria/Switzerland focus',
      'Language schools placing graduates with employers',
      'Vocational training providers with international cohorts',
      'Relocation service providers working with HR teams',
      'Staffing agencies with cross-border placement track record',
    ],
    approach: 'Email or LinkedIn — professional tone, reference the partner programme at /partners. Position as infrastructure, not competition.',
  },
  {
    id:      'strategic_partner',
    label:   'Strategic Partner / White-Label Candidate',
    tagline: 'Organisations that could license, buy, or co-build CorridorWork',
    why:     'Strategic partners offer the highest leverage: one deal can generate ongoing revenue, validation, or an exit path. Worth longer discussion but high upside.',
    examples: [
      'Staffing or HR tech company looking for international corridor infrastructure',
      'Company with existing employer network seeking a matching tool',
      'Private equity or family office with HR tech portfolio interest',
      'Government-adjacent body funding labour market programmes',
      'Large employer group wanting a white-label internal tool',
    ],
    approach: 'Email — formal, data-driven. Reference the full platform capability, the live deployment, and the strategic-partnership page at /strategic-partnership.',
  },
]

// ── Fit Score Criteria ────────────────────────────────────────────────────────

export const FIT_SCORE_CRITERIA: FitScoreCriterion[] = [
  {
    key:    'real_demand',
    label:  'Real workforce demand',
    desc:   'Has a documented or stated hiring need in a specific role or sector.',
    weight: 20,
  },
  {
    key:    'clear_sector',
    label:  'Clear sector',
    desc:   'Operates in a defined industry — not vague or multi-sector conglomerate.',
    weight: 15,
  },
  {
    key:    'international_openness',
    label:  'International hiring openness',
    desc:   'Has hired or expressed willingness to hire internationally before.',
    weight: 20,
  },
  {
    key:    'professional_presence',
    label:  'Professional website or verifiable presence',
    desc:   'Has a working website, LinkedIn page, or other verifiable identity.',
    weight: 15,
  },
  {
    key:    'contact_available',
    label:  'Contact person available',
    desc:   'Can identify a specific HR manager, CEO, or decision-maker to approach.',
    weight: 15,
  },
  {
    key:    'no_risky_promises',
    label:  'No risky promises requested',
    desc:   'Has not asked for job guarantees, visa services, or candidate fees.',
    weight: 10,
  },
  {
    key:    'pilot_value',
    label:  'Clear pilot value',
    desc:   'A successful pilot with this target would generate useful feedback or referrals.',
    weight: 5,
  },
]

/** Calculate fit score from a set of met criterion keys. */
export function calculateFitScore(metKeys: string[]): number {
  return FIT_SCORE_CRITERIA.filter((c) => metKeys.includes(c.key))
    .reduce((sum, c) => sum + c.weight, 0)
}

/** Return a label for a given score. */
export function fitScoreLabel(score: number): { label: string; color: 'green' | 'yellow' | 'red' } {
  if (score >= 70) return { label: 'Strong fit',   color: 'green' }
  if (score >= 40) return { label: 'Possible fit', color: 'yellow' }
  return               { label: 'Poor fit',     color: 'red' }
}

// ── Red Flags ─────────────────────────────────────────────────────────────────

export const RED_FLAGS: RedFlag[] = [
  {
    label:    'Wants job guarantee',
    desc:     'Explicitly asks CorridorWork to guarantee employment for candidates.',
    severity: 'high',
  },
  {
    label:    'Wants visa guarantee',
    desc:     'Expects visa processing, immigration services, or visa outcome assurance.',
    severity: 'high',
  },
  {
    label:    'Asks candidate fees',
    desc:     'Wants to charge candidates a fee for access or placement.',
    severity: 'high',
  },
  {
    label:    'Unclear or unverifiable company',
    desc:     'No working website, no business registration, no verifiable identity.',
    severity: 'high',
  },
  {
    label:    'Demands immediate mass placement',
    desc:     'Expects hundreds of candidates to be delivered within days.',
    severity: 'high',
  },
  {
    label:    'No legal clarity on arrangement type',
    desc:     'Request implies AÜG (temp staffing) or placement-for-fee without legal basis.',
    severity: 'high',
  },
  {
    label:    'Pressure for automated outreach',
    desc:     'Insists that candidates be contacted automatically without consent.',
    severity: 'medium',
  },
  {
    label:    'No named contact person',
    desc:     'Cannot identify who to speak with — generic info@ only.',
    severity: 'medium',
  },
]

// ── Target Status Options ─────────────────────────────────────────────────────

export const TARGET_STATUS_OPTIONS: { value: TargetStatus; label: string; color: string }[] = [
  { value: 'idea',               label: 'Idea',                color: 'gray'   },
  { value: 'shortlisted',        label: 'Shortlisted',         color: 'blue'   },
  { value: 'contacted_manually', label: 'Contacted manually',  color: 'yellow' },
  { value: 'replied',            label: 'Replied',             color: 'purple' },
  { value: 'rejected',           label: 'Rejected',            color: 'red'    },
  { value: 'pilot_discussion',   label: 'Pilot discussion',    color: 'green'  },
]

// ── Outreach Drafts ───────────────────────────────────────────────────────────

const SIGNATURE = '— CorridorWork Team\n  https://corridorwork.com'

/**
 * Generate all 4 outreach drafts for a given target.
 * Professional B2B tone. No sales promises. No guarantees.
 * No sending. Copy and send manually.
 */
export function generateOutreachDrafts(
  companyName: string,
  sector: string,
): OutreachDraft[] {
  const company = companyName.trim() || 'your organisation'
  const sec     = sector.trim()      || 'your sector'

  return [
    {
      id:      'linkedin',
      label:   'LinkedIn — language school / training provider',
      channel: 'LinkedIn',
      note:    'For Sprachschulen, Training Provider, Placement-Koordinatoren im DACH-Raum. Unter 300 Zeichen. Manuell senden.',
      text:
`Hallo,

ich arbeite an CorridorWork, einer Plattform zur strukturierten Erfassung von Arbeitgeberbedarf und internationalem Kandidateninteresse.

Für die erste Pilotphase suche ich eine Sprachschule oder einen Training Provider, der Feedback dazu geben kann, ob dieser Ansatz für internationale Absolventen und Arbeitgeber hilfreich wäre.

Es geht nicht um Jobgarantie, Visaberatung oder automatische Vermittlung, sondern um ein kurzes, unverbindliches Feedbackgespräch.

Wäre ein 15-minütiger Austausch diese Woche möglich?

${SIGNATURE}`,
    },
    {
      id:      'email',
      label:   'Email — professional / formal',
      channel: 'Email',
      note:    'Für formellere Kontakte oder kältere Ansprache. Betreff anpassen. Manuell aus eigenem Postfach senden.',
      text:
`Betreff: CorridorWork — Feedbackgespräch zur Pilotphase

Guten Tag,

ich wende mich an ${company} im Zusammenhang mit einem frühen Entwicklungsstadium von CorridorWork — einer Plattform zur strukturierten Erfassung von Arbeitgeberbedarf und internationalem Kandidateninteresse im Bereich ${sec}.

Ziel der Pilotphase ist es, Feedback von Praxispartnern einzuholen: Ist dieser Ansatz für Ihre Arbeit relevant? Welche Informationen fehlen? Was wäre tatsächlich hilfreich?

Zur Klarheit:
→ Keine Jobgarantie und keine Visaberatung
→ Keine automatische Vermittlung — alles wird manuell geprüft
→ Kein Vertrag, keine Kosten, keine Verpflichtung zur Weiterarbeit

Wäre ein kurzes, unverbindliches Gespräch (15–20 Minuten) in dieser oder nächster Woche möglich?

${SIGNATURE}`,
    },
    {
      id:      'whatsapp',
      label:   'WhatsApp — kurze persönliche Nachricht',
      channel: 'WhatsApp Business',
      note:    'Nur für echte persönliche Kontakte. Nicht für Kaltkontakte. Kurz und direkt.',
      text:
`Hallo,

ich arbeite gerade an CorridorWork — einem frühen Plattformansatz zur strukturierten Erfassung von Arbeitgeberbedarf und internationalem Kandidateninteresse.

Ich suche Feedback von Bildungseinrichtungen oder Placement-Stellen: Ist dieser Ansatz für eure Arbeit mit ${company} relevant?

Kein Versprechen, keine Automatik — nur ein kurzes unverbindliches Gespräch.

Wäre 15 Minuten diese Woche möglich?

${SIGNATURE}`,
    },
    {
      id:      'strategic',
      label:   'Strategic partner — agency / HR tech',
      channel: 'Email / LinkedIn',
      note:    'Für Recruiting-Agenturen, HR-Tech-Unternehmen oder potenzielle White-Label-Partner.',
      text:
`Betreff: CorridorWork — Strategisches Partnergespräch

Guten Tag,

ich wende mich an ${company} bezüglich eines möglichen strategischen Austauschs zu CorridorWork — einer live betriebenen Plattform zur strukturierten Erfassung von Arbeitgeberbedarf und internationalem Kandidateninteresse im Bereich ${sec}.

CorridorWork befindet sich in der ersten Pilotphase und sucht strategische Partner, die im Bereich Cross-border Hiring tätig sind — ob als Kanalpartner, Infrastrukturkunde oder für eine weitergehende Zusammenarbeit.

Zur Einordnung:
→ Keine automatische Outreach-Funktion aktiv
→ Manuelle Prüfung aller Matches
→ DSGVO-konform, kein Kandidatengebührenmodell
→ Keine Jobgarantie, keine Visaberatung

Weitere Informationen: https://corridorwork.com/strategic-partnership

Wäre ein unverbindliches Gespräch möglich?

${SIGNATURE}`,
    },
  ]
}

// ── Example Target Profiles ──────────────────────────────────────────────────

export interface ExampleTargetProfile {
  id:                  string
  isExample:           true       // always true — never a real lead
  disclaimer:          string
  targetType:          TargetGroup
  title:               string
  sector:              string
  country:             string
  whyFits:             string
  riskLevel:           'low' | 'medium' | 'high'
  riskNote:            string
  suggestedMessageType: 'linkedin' | 'email' | 'whatsapp' | 'strategic'
  firstQuestion:       string
  nextAction:          string
}

export const EXAMPLE_TARGET_PROFILES: ExampleTargetProfile[] = [
  {
    id:                  'ex-healthcare-de',
    isExample:           true,
    disclaimer:          'Example target profile — not a real lead',
    targetType:          'employer',
    title:               'Healthcare employer in Germany',
    sector:              'Healthcare & Nursing',
    country:             'Germany',
    whyFits:             'Germany has one of the highest documented nursing shortages in Europe. Healthcare employers here are legally allowed and financially motivated to hire internationally. Corridor matching adds immediate value.',
    riskLevel:           'low',
    riskNote:            'Check for AÜG licence requirements if placement is involved. Direct hire is lower risk.',
    suggestedMessageType: 'email',
    firstQuestion:       'Are you currently trying to fill nursing or care roles that local candidates are not filling?',
    nextAction:          'Replace placeholder with a real clinic, care home, or hospital group in your region. Search LinkedIn for "Pflegedirektor" or "HR Manager Krankenhaus".',
  },
  {
    id:                  'ex-it-uk-ca',
    isExample:           true,
    disclaimer:          'Example target profile — not a real lead',
    targetType:          'employer',
    title:               'IT employer in UK or Canada',
    sector:              'IT & Software',
    country:             'UK / Canada',
    whyFits:             'IT companies in English-speaking markets are highly experienced with international hiring. Decision-makers are often reachable on LinkedIn. Language barrier is lower than DACH region.',
    riskLevel:           'low',
    riskNote:            'UK post-Brexit visa process and Canadian immigration are complex — clarify you provide matching, not visa services.',
    suggestedMessageType: 'linkedin',
    firstQuestion:       'Are you hiring software engineers or data specialists and open to international candidates?',
    nextAction:          'Search LinkedIn for CTOs or Engineering Managers at software companies in London, Toronto, or Vancouver. Use LinkedIn message draft.',
  },
  {
    id:                  'ex-engineering-gulf',
    isExample:           true,
    disclaimer:          'Example target profile — not a real lead',
    targetType:          'employer',
    title:               'Engineering employer in Gulf region',
    sector:              'Engineering',
    country:             'UAE / Saudi Arabia / Qatar',
    whyFits:             'Gulf construction and engineering markets have extremely high international hiring rates. Structured matching adds value over unstructured CV pools.',
    riskLevel:           'medium',
    riskNote:            'Gulf labour law varies by country. Clarify that CorridorWork provides matching only — not visa sponsorship or placement guarantees.',
    suggestedMessageType: 'email',
    firstQuestion:       'Are you currently looking for civil, mechanical, or electrical engineers with international backgrounds?',
    nextAction:          'Search for HR contacts at engineering or construction firms active in UAE projects. Use formal email draft.',
  },
  {
    id:                  'ex-agency-morocco',
    isExample:           true,
    disclaimer:          'Example target profile — not a real lead',
    targetType:          'recruiting_partner',
    title:               'Recruiting agency in Morocco',
    sector:              'International Recruiting',
    country:             'Morocco',
    whyFits:             'Moroccan recruiting agencies already work with European employer clients and have access to French and Arabic-speaking candidate pools. Strong fit for structured corridor matching as infrastructure.',
    riskLevel:           'low',
    riskNote:            'Position as infrastructure partner — not as competition. Use partner programme at /partners.',
    suggestedMessageType: 'email',
    firstQuestion:       'Are you currently placing candidates in DACH, France, or Gulf markets?',
    nextAction:          'Search LinkedIn for "agence de recrutement internationale Maroc". Introduce CorridorWork as matching infrastructure they can use.',
  },
  {
    id:                  'ex-language-school',
    isExample:           true,
    disclaimer:          'Example target profile — not a real lead',
    targetType:          'recruiting_partner',
    title:               'Language school or training provider',
    sector:              'Language Training / Vocational',
    country:             'Germany / Austria / Switzerland',
    whyFits:             'Language schools that prepare international candidates for DACH employment already have the candidates CorridorWork needs. A structured matching tool is a direct product extension.',
    riskLevel:           'low',
    riskNote:            'Low risk. No AÜG concerns. Position as a tool that improves placement outcomes for their graduates.',
    suggestedMessageType: 'linkedin',
    firstQuestion:       'Do you work with candidates who are preparing to work in Germany and looking for employer connections?',
    nextAction:          'Search for language schools with employer placement programmes on LinkedIn or their websites.',
  },
  {
    id:                  'ex-relocation-partner',
    isExample:           true,
    disclaimer:          'Example target profile — not a real lead',
    targetType:          'recruiting_partner',
    title:               'Relocation service provider',
    sector:              'Relocation / HR Services',
    country:             'Germany / Netherlands / Sweden',
    whyFits:             'Relocation firms work directly with HR teams at companies hiring internationally. They are trusted by employers and need matching infrastructure to add more value.',
    riskLevel:           'low',
    riskNote:            'Low risk. Complementary service, not competition. Use partner programme.',
    suggestedMessageType: 'email',
    firstQuestion:       'Do you currently work with employers who need to match and onboard international hires?',
    nextAction:          'Search for relocation firms in Germany or Benelux on LinkedIn. Use partner email draft.',
  },
]

// ── Guided Action ─────────────────────────────────────────────────────────────

export const GUIDED_ACTION = {
  title:   'Next safe action: prepare one pilot target',
  subtitle: 'Choose one sector, fill one target card, check the fit score, then manually send one reviewed message.',
  steps: [
    { n: 1, label: 'Choose one target profile',         desc: 'Browse the example profiles below or start from a sector you know personally.' },
    { n: 2, label: 'Replace placeholder with real data', desc: 'Fill in the Target Card with a real company name and contact you want to approach.' },
    { n: 3, label: 'Check the fit score',               desc: 'Run through the 7 criteria. Only proceed if score ≥ 70 and no high-risk flags.' },
    { n: 4, label: 'Copy the safest message draft',     desc: 'Select LinkedIn, email, or WhatsApp draft. Copy it. Do not modify tone significantly.' },
    { n: 5, label: 'Send manually — only after review', desc: 'Read the message once more. Then send it yourself, from your own LinkedIn or inbox.' },
    { n: 6, label: 'Record the response manually',      desc: 'Update the status in the Target Card. If they respond positively, open First Pilot Assistant.' },
  ],
} as const

// ── Pilot Routes ──────────────────────────────────────────────────────────────

export const PILOT_ROUTES = [
  {
    id:      'route-a',
    label:   'Route A — Employer Pilot',
    tagline: 'For employers with a genuine workforce demand',
    bestFor: 'Healthcare · IT & Software · Engineering · Skilled Trades · Logistics · Hospitality',
    steps:   ['Employer submits demand via /global/employers', 'You review manually', 'Fit score ≥ 70', 'One personal message sent manually', 'Pilot discussion → feedback call'],
    link:    '/global/employers',
    linkLabel: 'Open employer intake →',
  },
  {
    id:      'route-b',
    label:   'Route B — Recruiting / Training Partner',
    tagline: 'For agencies, language schools, training providers, relocation partners',
    bestFor: 'International recruiting agencies · Language schools · Vocational training providers · Relocation partners',
    steps:   ['Partner submits enquiry via /partners', 'You review manually', 'Partnership discussion → access to matching infrastructure'],
    link:    '/partners',
    linkLabel: 'Open partner page →',
  },
  {
    id:      'route-c',
    label:   'Route C — Strategic Partner',
    tagline: 'For companies that could license, white-label, or acquire CorridorWork',
    bestFor: 'HR tech companies · Staffing groups · Agencies with employer networks · Strategic buyers',
    steps:   ['Initial outreach via /strategic-partnership', 'You send strategic partner email manually', 'Due diligence discussion → commercial exploration'],
    link:    '/strategic-partnership',
    linkLabel: 'Open strategic partnership page →',
  },
] as const

// ── Operating Rules ───────────────────────────────────────────────────────────

export const OPERATING_RULES: { label: string; ok: boolean }[] = [
  { label: 'Human approval required before any outreach',     ok: true  },
  { label: 'No automatic outreach',                           ok: true  },
  { label: 'No payment active',                               ok: true  },
  { label: 'No candidate fees active',                        ok: true  },
  { label: 'No job guarantee',                                ok: true  },
  { label: 'No visa guarantee',                               ok: true  },
  { label: 'Legal review before paid placement',              ok: false }, // warning
  { label: 'All communication must be manually reviewed',     ok: true  },
  { label: 'No Stripe integration active',                    ok: true  },
  { label: 'No scraping or automated data collection',        ok: true  },
]
