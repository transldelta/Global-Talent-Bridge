/**
 * lib/market-signals.ts
 *
 * Market Signal Sprint — static profile data for manual outreach preparation.
 *
 * ⚠️  SAFETY CONSTRAINTS — ALWAYS ACTIVE:
 *     No automatic sending. No scraping. No fake customers. No fake revenue.
 *     No fake LOIs. No real contact data. No job guarantee. No visa guarantee.
 *     Every outreach action requires manual review and manual sending.
 *     This file contains profile types only — no real contact details.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SignalProfile {
  id:             string
  label:          string        // Short name for the profile type
  description:    string        // Who they are
  whyRelevant:    string        // Why this profile matters for CorridorWork
  coreProblem:    string        // The problem they have that CW can address
  whyCWFits:      string        // Why CorridorWork is the right fit
  proofQuestion:  string        // The single validation question to ask
  complianceNote: string        // Risk / legal note for this profile type
  outreachStatus: 'not-started' // Always not-started at sprint prep stage
  approvalRequired: true        // Always true — no auto-send ever
}

export interface OutreachTemplate {
  id:       string
  audience: 'buyer' | 'pilot-customer' | 'partner'
  label:    string
  subject:  string
  body:     string
  rules:    string[]
}

export interface ResponseLogEntry {
  date:            string
  contactType:     'buyer' | 'pilot-customer' | 'partner'
  organization:    string
  contactPerson:   string
  channel:         string
  sentManually:    boolean
  responseReceived: boolean
  interestLevel:   'none' | 'low' | 'medium' | 'high' | 'unknown'
  notes:           string
  shareable:       boolean
  evidenceLink:    string
}

// ── Buyer Profiles ────────────────────────────────────────────────────────────

export const BUYER_PROFILES: SignalProfile[] = [
  {
    id:             'hr-tech-saas',
    label:          'HR-Tech SaaS Company',
    description:    'A B2B SaaS company already operating in the talent acquisition or workforce management space.',
    whyRelevant:    'Has existing GTM motion, customer relationships, and engineering capacity to integrate corridor intelligence into their existing product.',
    coreProblem:    'Lacks structured international corridor data to help their customers expand hiring across borders.',
    whyCWFits:      'CorridorWork\'s 8-corridor intelligence engine + three-sided intake pipeline plugs directly into their existing product as a module or acquisition.',
    proofQuestion:  'Would structured corridor intelligence data (scored corridors, employer demand intake, partner channels) be something your customers would pay for as an add-on?',
    complianceNote: 'No job guarantee or visa guarantee to be stated in any communication. No revenue claims. State pre-revenue status honestly.',
    outreachStatus: 'not-started',
    approvalRequired: true,
  },
  {
    id:             'intl-recruiting-agency',
    label:          'International Recruiting Agency',
    description:    'A recruiting firm that specialises in cross-border placements, especially for healthcare, engineering, or skilled trades.',
    whyRelevant:    'Operates in exactly the corridors CorridorWork covers. Could use the platform as an internal tool or licence it to clients.',
    coreProblem:    'Lacks structured corridor-level intelligence to advise clients on where international hiring is viable, fast, and legally straightforward.',
    whyCWFits:      'Corridor Intelligence + Approval Queue + Contact Copilot maps directly onto their daily workflow without requiring a new tech team.',
    proofQuestion:  'Would a corridor intelligence tool — showing employer demand, candidate supply, and compliance complexity per country-pair — improve how you advise your clients?',
    complianceNote: 'Recruitment intermediary rules vary by jurisdiction. State explicitly: no placement guarantee, no visa guidance, buyer must conduct own legal review.',
    outreachStatus: 'not-started',
    approvalRequired: true,
  },
  {
    id:             'relocation-mobility',
    label:          'Relocation / Talent Mobility Firm',
    description:    'A firm providing relocation services, visa support, or mobility programmes for employers moving international hires.',
    whyRelevant:    'Operates upstream of candidate placement — needs early-stage corridor intelligence to identify growing markets before their employer clients ask.',
    coreProblem:    'Reactive rather than proactive — relocation firms often find out about new corridors after employers have already committed.',
    whyCWFits:      'CorridorWork\'s corridor scoring gives relocation firms advance intelligence on which corridors will generate demand in the next 6–12 months.',
    proofQuestion:  'Would early-stage corridor intelligence — scoring which country-pairs are building hiring momentum — be useful for planning your service capacity?',
    complianceNote: 'No visa guarantee to be stated. No guarantee that any corridor will produce demand. Framed as intelligence tool only.',
    outreachStatus: 'not-started',
    approvalRequired: true,
  },
  {
    id:             'micro-saas-operator',
    label:          'Micro-SaaS Operator / Acquirer',
    description:    'An independent operator who buys and runs small SaaS products, typically with 1–3 person teams.',
    whyRelevant:    'Has operating discipline and can activate CorridorWork\'s monetisation paths faster than a solo founder building from scratch.',
    coreProblem:    'Looking for acquisition targets with solid technical foundations and clear niche positioning — often struggles to find transfer-ready assets.',
    whyCWFits:      'CorridorWork is transfer-prepared with documented handover steps; actual transfer timing depends on domain, GitHub, Vercel, Supabase, and buyer-side account setup. Latest lint, TypeScript, build, and test suite passed. Full documentation. Clear niche.',
    proofQuestion:  'Are you currently evaluating small pre-revenue SaaS acquisitions in HR-tech, recruiting, or talent mobility?',
    complianceNote: 'Pre-revenue status must be stated clearly. No MRR claims. No customer claims. Transfer guide available for technical due diligence.',
    outreachStatus: 'not-started',
    approvalRequired: true,
  },
  {
    id:             'portfolio-investor',
    label:          'SaaS Portfolio Investor / Micro-PE',
    description:    'A small private equity firm or operator-investor acquiring a portfolio of micro-SaaS businesses.',
    whyRelevant:    'Asset-stage acquisitions at Tier 1 pricing (€15K–€25K) fit their acquisition criteria; they assign an operator after purchase.',
    coreProblem:    'Evaluating many assets simultaneously — needs clear transfer readiness, technical quality verification, and honest gap disclosure.',
    whyCWFits:      'Full Buyer Package (9 docs), 6-dimension Sale Readiness Score, latest lint/build/test suite passed, and escrow-first transfer protocol reduces their due diligence time.',
    proofQuestion:  'Do you currently have an operator you\'d assign to an international talent tech asset if you acquired it?',
    complianceNote: 'No revenue guarantee. No growth projection guarantee. Asset-stage pricing must be stated. Escrow-first transfer only.',
    outreachStatus: 'not-started',
    approvalRequired: true,
  },
]

// ── Pilot Customer Profiles ───────────────────────────────────────────────────

export const PILOT_CUSTOMER_PROFILES: SignalProfile[] = [
  {
    id:             'german-hospital-group',
    label:          'German Hospital Group / Klinikverbund',
    description:    'A regional German hospital group or care facility operator actively recruiting nurses, doctors, or care staff from abroad.',
    whyRelevant:    'Germany–Southeast Europe and Germany–Philippines corridors score 87–93 on CorridorWork\'s Buyer Opportunity Score. Healthcare is the highest-demand corridor.',
    coreProblem:    'Recruiting internationally is slow, expensive, and filled with compliance uncertainty. HR teams lack structured corridor intelligence.',
    whyCWFits:      'CorridorWork\'s Germany Healthcare corridor card shows exactly which source markets, partner channels, and compliance pathways apply — with Buyer Opportunity Score rationale.',
    proofQuestion:  'Would a structured corridor intelligence briefing — showing the top 3 source markets for your open roles, ranked by speed-to-hire and compliance simplicity — be useful to your HR team?',
    complianceNote: 'No job guarantee. No visa guarantee. No placement fee arrangement without legal review. Pilot engagement is intelligence and advisory only.',
    outreachStatus: 'not-started',
    approvalRequired: true,
  },
  {
    id:             'engineering-firm-germany',
    label:          'German Engineering / Manufacturing Firm',
    description:    'A Mittelstand engineering or manufacturing company struggling to fill skilled trades roles domestically.',
    whyRelevant:    'Germany Engineering corridor scores 87. Eastern Europe and South America corridors are relevant source markets with CorridorWork coverage.',
    coreProblem:    'Domestic talent shortage is structural. International hiring feels risky and legally complex without a guide.',
    whyCWFits:      'Corridor Intelligence simplifies the decision: which country, which partner, which timeline — without the firm needing a dedicated international HR expert.',
    proofQuestion:  'If we could show you the top 3 international source markets for [role type], ranked by compliance simplicity and time-to-onboard — would that help you make the case internally?',
    complianceNote: 'No placement guarantee. No visa processing. Advisory and intelligence only. Buyer must engage own legal counsel for actual hiring.',
    outreachStatus: 'not-started',
    approvalRequired: true,
  },
  {
    id:             'uk-hospitality-operator',
    label:          'UK Hospitality Operator (Post-Brexit)',
    description:    'A UK hotel group, restaurant chain, or hospitality operator struggling with post-Brexit staffing gaps.',
    whyRelevant:    'UK Hospitality corridor scores 81. Post-Brexit created a structural supply gap that hasn\'t been resolved by domestic hiring alone.',
    coreProblem:    'Right-to-work complexity, visa uncertainty, and lack of structured access to EU or non-EU candidate sources.',
    whyCWFits:      'CorridorWork\'s UK Hospitality corridor card maps legal pathways, candidate source markets (Southern Europe, Latin America), and partner channels.',
    proofQuestion:  'Are you currently exploring international hiring as a solution to the post-Brexit staffing gap, and if so, what is your biggest obstacle?',
    complianceNote: 'No visa processing or legal advice. Right-to-work verification is the employer\'s responsibility. No placement guarantee.',
    outreachStatus: 'not-started',
    approvalRequired: true,
  },
  {
    id:             'netherlands-logistics',
    label:          'Netherlands Logistics / Warehousing Operator',
    description:    'A Dutch logistics, distribution, or warehousing company hiring warehouse operators, drivers, or supply chain staff internationally.',
    whyRelevant:    'Netherlands Logistics scores 79. Eastern European and Southeast Asian candidate pipelines are active and structured in the corridor data.',
    coreProblem:    'Logistics operators need volume hiring — finding reliable partner channels who understand Dutch labour law is the main bottleneck.',
    whyCWFits:      'CorridorWork\'s partner intake maps recruiting agencies and relocation firms already operating in this corridor.',
    proofQuestion:  'What partner channels are you currently using for international logistics hiring — and what\'s your main frustration with them?',
    complianceNote: 'No placement guarantee. Dutch employment law compliance is operator\'s responsibility. No visa guidance.',
    outreachStatus: 'not-started',
    approvalRequired: true,
  },
  {
    id:             'language-school-operator',
    label:          'Language School / Training Provider',
    description:    'A German, Austrian, or Swiss language school or vocational training provider preparing international candidates for employment in DACH.',
    whyRelevant:    'Language schools are a core supply-side partner in multiple corridors. They have candidate pools that CorridorWork\'s employer demand intake can match against.',
    coreProblem:    'Language schools graduate candidates but lack structured access to employer demand. They don\'t know which sectors are actively hiring their graduates.',
    whyCWFits:      'CorridorWork\'s employer intake + corridor intelligence can show language schools exactly which employers, sectors, and corridors their candidates should target.',
    proofQuestion:  'Do you currently have a structured channel for connecting your graduates with employers actively hiring internationally — and if not, what would that be worth to you?',
    complianceNote: 'No job guarantee for graduates. No visa guarantee. Candidate intake is voluntary and consent-based. No candidate fees.',
    outreachStatus: 'not-started',
    approvalRequired: true,
  },
]

// ── Partner Profiles ──────────────────────────────────────────────────────────

export const PARTNER_PROFILES: SignalProfile[] = [
  {
    id:             'intl-recruitment-agency-partner',
    label:          'International Recruitment Agency (Partner Track)',
    description:    'A recruiting agency that specialises in cross-border placements and wants access to corridor intelligence to improve their service.',
    whyRelevant:    'Partner agencies generate both employer demand signal and candidate supply signal simultaneously — the highest-value data input for corridor validation.',
    coreProblem:    'Agencies operate corridor-by-corridor but lack a structured framework for comparing corridor attractiveness, compliance complexity, or employer demand concentration.',
    whyCWFits:      'The partner intelligence package gives agencies corridor scores, employer demand intake data, and a structured pipeline tool — without replacing their existing CRM.',
    proofQuestion:  'Would corridor-level intelligence (scoring corridors by employer demand, compliance simplicity, and candidate supply) improve how you pitch your service to clients?',
    complianceNote: 'Agency must conduct its own compliance and legal review per jurisdiction. No revenue guarantee. No placement volume guarantee.',
    outreachStatus: 'not-started',
    approvalRequired: true,
  },
  {
    id:             'relocation-service-partner',
    label:          'Relocation Service Provider',
    description:    'A firm providing visa assistance, housing, cultural integration, or logistics support for international hires arriving in a destination country.',
    whyRelevant:    'Relocation firms are the downstream partner in every corridor — activating them creates a full-corridor pipeline from demand identification to candidate arrival.',
    coreProblem:    'Relocation firms are reactive — they engage once an employer has committed. They want earlier access to pipeline to plan capacity.',
    whyCWFits:      'CorridorWork\'s corridor intelligence provides 6–12 month advance signal on which corridors are building employer demand, allowing relocation firms to prepare capacity.',
    proofQuestion:  'Would access to advance corridor demand signal — showing which country-pairs are likely to generate employer hiring volume in the next 6 months — help you plan service capacity?',
    complianceNote: 'No visa processing or legal advice provided by CorridorWork. Relocation firm\'s own compliance responsibility. No placement guarantee.',
    outreachStatus: 'not-started',
    approvalRequired: true,
  },
  {
    id:             'language-school-partner',
    label:          'Language School / B1-B2 Preparation Provider',
    description:    'A language school preparing international candidates for German, English, Dutch, or French language certification (B1/B2) as a prerequisite for employment.',
    whyRelevant:    'Language schools are the upstream supply-side partner — they have graduating candidate cohorts that corridor intelligence can help route to the right employers.',
    coreProblem:    'Language schools don\'t know which sectors, roles, or corridors their graduates should target. Employer partnerships are informal and unstructured.',
    whyCWFits:      'CorridorWork\'s employer intake captures active hiring demand. Corridor scores show language schools which sectors are absorbing their candidate profiles.',
    proofQuestion:  'Do you have a structured employer relationship programme for placing your graduates — and if not, would you value a tool that shows you where employer demand is highest?',
    complianceNote: 'No job guarantee for graduates. Candidate intake is voluntary, consent-based, free. No visa guidance.',
    outreachStatus: 'not-started',
    approvalRequired: true,
  },
  {
    id:             'hr-consulting-partner',
    label:          'HR Consulting Firm',
    description:    'An HR consultancy or workforce planning firm advising mid-to-large employers on international talent strategy.',
    whyRelevant:    'HR consultants translate corridor intelligence into board-level employer decisions — they are the fastest route to employer pilot engagements.',
    coreProblem:    'HR consultants advise on international hiring but lack structured data to benchmark corridors objectively. Recommendations are experience-based, not data-driven.',
    whyCWFits:      'CorridorWork\'s Buyer Opportunity Score framework gives HR consultants an evidence-backed structure for corridor recommendations — and a tool to demonstrate to their clients.',
    proofQuestion:  'When advising a client on international hiring strategy, what data would make your corridor recommendation more compelling and defensible?',
    complianceNote: 'No advice on employment law. No visa or immigration guidance. Consultant\'s own professional liability applies.',
    outreachStatus: 'not-started',
    approvalRequired: true,
  },
  {
    id:             'strategic-tech-partner',
    label:          'Strategic Tech / Integration Partner',
    description:    'An ATS, HRIS, or workforce management platform that wants to integrate corridor intelligence as a module or partner feature.',
    whyRelevant:    'A tech integration partner converts CorridorWork from a standalone tool into an embedded intelligence layer — the highest scalability path.',
    coreProblem:    'ATS and HRIS platforms have employer relationships and workflows but lack structured international corridor intelligence as a feature.',
    whyCWFits:      'CorridorWork\'s TypeScript-strict API layer and Supabase data model are designed for clean integration. The corridor intelligence engine can be embedded or white-labelled.',
    proofQuestion:  'Is international hiring intelligence a feature request you hear from your customers — and would a corridor intelligence API be something you\'d consider integrating?',
    complianceNote: 'No automated data sharing without explicit integration agreement. No auto-send from integration. GDPR data processing agreement required.',
    outreachStatus: 'not-started',
    approvalRequired: true,
  },
]

// ── Outreach Templates ────────────────────────────────────────────────────────

export const OUTREACH_TEMPLATES: OutreachTemplate[] = [
  {
    id:       'buyer-intro',
    audience: 'buyer',
    label:    'Potential Buyer — Initial Introduction',
    subject:  'CorridorWork — transfer-ready international talent intelligence platform',
    body: `Hi [Name],

I'm reaching out because [Company] operates in the international talent or HR-tech space, and I wanted to introduce a platform that may be a fit for your portfolio or product roadmap.

CorridorWork is a structured corridor intelligence and approval-based growth platform for the international recruitment market. It's built, tested, and transfer-ready — currently listed for acquisition.

What it includes:
- 8 scored global talent corridors with Buyer Opportunity Scores
- Three-sided intake pipeline (employer + candidate source + partner)
- 10+ admin tools including a full Buyer Room with due diligence package
- Latest lint, TypeScript, build, and test suite passed · Supabase EU-Frankfurt
- Domain: corridorwork.com (live)

The platform is pre-revenue — no MRR, no customers yet. The asking price reflects the built infrastructure, not a revenue multiple.

If this is relevant to what you're building or acquiring, I'm happy to share the full Buyer Room access for technical due diligence.

No obligation. No pressure.

CorridorWork Team
corridorwork.com`,
    rules: [
      'Send manually — one message at a time',
      'No bulk send. No scheduled send. No automated follow-up.',
      'Personalise [Name] and [Company] before sending',
      'Do not send without manual review',
      'No revenue claims. No MRR claims. No customer claims.',
      'If no reply in 7 days, do not follow up more than once',
    ],
  },
  {
    id:       'pilot-customer-intro',
    audience: 'pilot-customer',
    label:    'Potential Pilot Customer — Corridor Intelligence Offer',
    subject:  'International hiring intelligence for [Corridor] — a quick question',
    body: `Hi [Name],

I'm reaching out because [Company] is active in international hiring, and I've been working on a tool that might be relevant to your team.

CorridorWork is a corridor intelligence platform — it maps international talent corridors (which country-pairs are viable for hiring, ranked by employer demand, compliance simplicity, and candidate supply) and helps teams structure their international hiring strategy.

I'd like to understand if this type of intelligence would be useful to your HR or talent acquisition team. Specifically:

[Insert proof question from profile — e.g. "Would a structured briefing on the top 3 source markets for nursing roles, ranked by time-to-hire, be useful for your planning?"]

This is a discovery question — I'm validating whether this type of tool solves a real problem. No sales pitch, no commitment, no cost at this stage.

Happy to share a brief overview if there's interest.

CorridorWork Team
corridorwork.com`,
    rules: [
      'Send manually — one message at a time',
      'No bulk send. No automated follow-up.',
      'Fill in [Name], [Company], and [Corridor] before sending',
      'Replace [Insert proof question] with the relevant question from the pilot customer profile',
      'No job guarantee. No visa guarantee. No placement guarantee.',
      'No candidate fees mentioned or implied.',
      'Do not represent CorridorWork as having existing customers or revenue',
    ],
  },
  {
    id:       'partner-intro',
    audience: 'partner',
    label:    'Partner — Corridor Intelligence Collaboration',
    subject:  'Corridor intelligence partnership — [Partner type] alignment',
    body: `Hi [Name],

I'm reaching out because [Company] works in [recruiting/relocation/language training/HR consulting] and I believe there's an interesting overlap with what we've built at CorridorWork.

CorridorWork is a corridor intelligence platform for the international talent mobility market. We map employer demand, candidate supply, and partner channels across 8 global talent corridors — and we're currently exploring structured partnership with operators in your space.

The core question I wanted to ask: [Insert proof question from partner profile]

We're at an early stage — no revenue, no formal partnerships signed. I'm doing discovery calls to understand whether corridor intelligence is something operators in your space would find valuable.

If the question above resonates, I'd welcome a 20-minute call.

No pressure. No commitment required.

CorridorWork Team
corridorwork.com`,
    rules: [
      'Send manually — one message at a time',
      'No bulk send. No automated follow-up.',
      'Fill in [Name], [Company], and [Partner type] before sending',
      'Replace [Insert proof question] with the relevant question from the partner profile',
      'No revenue guarantee. No partnership guarantee. No exclusivity implied.',
      'No job guarantee. No visa guarantee.',
      'State pre-revenue status if asked directly',
      'Manual review required before every send',
    ],
  },
]

// ── Response evidence log — empty template ────────────────────────────────────

export const RESPONSE_LOG_TEMPLATE: ResponseLogEntry = {
  date:             '',
  contactType:      'buyer',
  organization:     '',
  contactPerson:    '',
  channel:          '',
  sentManually:     true,
  responseReceived: false,
  interestLevel:    'unknown',
  notes:            '',
  shareable:        false,
  evidenceLink:     '',
}

export const REAL_RESPONSES: ResponseLogEntry[] = []
// ↑ Intentionally empty. No fake responses. No test data counted as market proof.
// Add entries only when real, manual outreach generates real, written replies.

// ── Market signal state ───────────────────────────────────────────────────────

export const MARKET_SIGNAL_STATE = {
  sprintStatus:        'prepared' as const,
  outreachSent:        0,
  responsesReceived:   0,
  realProofItems:      0,
  lastUpdated:         '2026-06-09',
  disclaimer:          'No outreach has been sent yet. No market proof exists. Sprint is prepared for manual execution only.',
  noAutoSend:          true,
  noScraping:          true,
  noFakeResponses:     true,
  manualApprovalOnly:  true,
} as const
