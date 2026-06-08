/**
 * lib/market-proof-launch.ts
 *
 * Market Proof Launch — data layer for /admin/market-proof-launch.
 *
 * ⚠️  No fake customers. No fake revenue. No automatic send. No scraping.
 *     No job guarantee. No visa guarantee. No Stripe.
 *     Test data does NOT count as market proof.
 *     All targets with no real contact data have status = 'real_contact_needed'.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export type ReplyClassification =
  | 'positive_interest'
  | 'wants_more_info'
  | 'neutral_feedback'
  | 'not_relevant'
  | 'rejected'
  | 'legal_risk'
  | 'buyer_interest'

export type TargetStatus =
  | 'real_contact_needed'   // placeholder — no real contact yet
  | 'draft_ready'           // message draft prepared
  | 'draft_opened'          // Gmail/form opened manually
  | 'sent_manually'         // confirmed manually sent
  | 'reply_received'        // real reply received
  | 'proof_confirmed'       // classified, marked as market proof

export type CampaignId = 'germany-healthcare' | 'partner-channels' | 'buyer-candidates'

export interface ProofTarget {
  id:             string
  campaignId:     CampaignId
  targetType:     string
  country:        string
  corridor:       string
  contactChannel: 'email' | 'linkedin' | 'contact_form'
  status:         TargetStatus
  note:           string
}

export interface ProofReply {
  targetId:        string
  classification:  ReplyClassification
  summary:         string   // anonymised — no PII
  buyerVisible:    boolean
  isReal:          boolean  // must be true — test/fake data excluded
}

export interface Campaign {
  id:          CampaignId
  label:       string
  goal:        string
  targetCount: number
  targetTypes: string[]
  corridor:    string
  priority:    'high' | 'medium' | 'low'
  status:      'ready-to-launch' | 'in-progress' | 'completed'
  note:        string
}

export interface ProofTrackerState {
  targetsPrepared:    number
  draftsOpened:       number
  sentManually:       number
  repliesReceived:    number
  positiveReplies:    number
  neutralReplies:     number
  rejectedReplies:    number
  legalRiskReplies:   number
  buyerInterestLeads: number
  proofNotes:         string
  buyerVisibleProof:  boolean
}

export interface BuyerOutreachText {
  id:          string
  label:       string
  targetType:  string
  channel:     'dm' | 'email' | 'listing' | 'teaser'
  subject?:    string
  body:        string
  note:        string
}

// ── Reply Classification taxonomy ─────────────────────────────────────────────

export const REPLY_CLASSIFICATIONS: {
  value:       ReplyClassification
  label:       string
  description: string
  buyerValue:  'high' | 'medium' | 'low' | 'none'
}[] = [
  {
    value:      'positive_interest',
    label:      'Positive interest',
    description: 'Contact expressed clear interest in the product, corridor, or partnership.',
    buyerValue: 'high',
  },
  {
    value:      'wants_more_info',
    label:      'Wants more info',
    description: 'Contact asked follow-up questions or requested additional information.',
    buyerValue: 'high',
  },
  {
    value:      'neutral_feedback',
    label:      'Neutral feedback',
    description: 'Contact responded but neither accepted nor rejected. Useful market signal.',
    buyerValue: 'medium',
  },
  {
    value:      'not_relevant',
    label:      'Not relevant',
    description: 'Contact indicated the product or corridor is not relevant to them.',
    buyerValue: 'low',
  },
  {
    value:      'rejected',
    label:      'Rejected',
    description: 'Contact explicitly declined or opted out.',
    buyerValue: 'none',
  },
  {
    value:      'legal_risk',
    label:      'Legal risk signal',
    description: 'Contact raised a legal, regulatory, or compliance concern. Document and escalate.',
    buyerValue: 'low',
  },
  {
    value:      'buyer_interest',
    label:      'Buyer interest',
    description: 'Contact expressed interest in acquiring, investing in, or partnering on the platform itself.',
    buyerValue: 'high',
  },
]

// ── Campaigns ─────────────────────────────────────────────────────────────────

export const CAMPAIGNS: Campaign[] = [
  {
    id:          'germany-healthcare',
    label:       'Campaign A — Germany Healthcare Candidate Sources',
    goal:        'Collect written feedback from language schools, training providers, and nursing schools about Germany-bound healthcare candidates. Validate the corridor.',
    targetCount: 20,
    targetTypes: ['Language schools (Morocco/Tunisia)', 'Nursing schools (Philippines)', 'Training providers', 'Candidate-source partners'],
    corridor:    'Morocco / Tunisia → Germany / DACH',
    priority:    'high',
    status:      'ready-to-launch',
    note:        'Highest Buyer Opportunity Score corridor (93). Fastest validation path. Language schools in Morocco already prepare candidates for Germany — warm topic.',
  },
  {
    id:          'partner-channels',
    label:       'Campaign B — Recruiting / Relocation Partners',
    goal:        'Collect partner feedback from recruiting agencies and relocation firms about demand for corridor intelligence and growth pipeline tooling.',
    targetCount: 15,
    targetTypes: ['Recruiting agencies', 'Relocation partners', 'Training providers'],
    corridor:    'Multi-corridor (DACH, UK, Canada, Gulf)',
    priority:    'high',
    status:      'ready-to-launch',
    note:        'Partner feedback = buyer proof. A recruiting agency saying "this fills a real gap" is a strong signal for any buyer.',
  },
  {
    id:          'buyer-candidates',
    label:       'Campaign C — Buyer Candidates',
    goal:        'Identify and contact potential buyers: recruiting agency owners, relocation companies, HR-tech founders, staffing agency owners.',
    targetCount: 10,
    targetTypes: ['Recruiting agency owners', 'Relocation companies', 'HR-tech founders', 'Agency owners', 'Micro-SaaS buyers'],
    corridor:    'N/A — acquisition interest',
    priority:    'high',
    status:      'ready-to-launch',
    note:        'Direct buyer outreach. Use buyer DM or email template. Show /admin/buyer-room in demo. Not market validation — buyer pipeline.',
  },
]

// ── Placeholder targets (real_contact_needed = no PII, placeholders only) ─────

export const CAMPAIGN_TARGETS: ProofTarget[] = [
  // Campaign A — Germany Healthcare (20 targets)
  { id: 'a01', campaignId: 'germany-healthcare', targetType: 'Language school (Morocco)', country: 'Morocco', corridor: 'Morocco → Germany', contactChannel: 'email', status: 'real_contact_needed', note: 'Find via Google: "école de langue allemande Maroc" or "Goethe-Institut Casablanca"' },
  { id: 'a02', campaignId: 'germany-healthcare', targetType: 'Language school (Morocco)', country: 'Morocco', corridor: 'Morocco → Germany', contactChannel: 'email', status: 'real_contact_needed', note: 'Search: language schools preparing candidates for Germany in Rabat or Marrakech' },
  { id: 'a03', campaignId: 'germany-healthcare', targetType: 'Language school (Tunisia)', country: 'Tunisia', corridor: 'Tunisia → Germany', contactChannel: 'email', status: 'real_contact_needed', note: 'Search: "école de langue Tunis" or "formation langue allemande Tunisie"' },
  { id: 'a04', campaignId: 'germany-healthcare', targetType: 'Language school (Tunisia)', country: 'Tunisia', corridor: 'Tunisia → Germany', contactChannel: 'email', status: 'real_contact_needed', note: 'Search: language institutes in Sfax or Sousse with Germany placement history' },
  { id: 'a05', campaignId: 'germany-healthcare', targetType: 'Nursing school (Philippines)', country: 'Philippines', corridor: 'Philippines → Germany', contactChannel: 'email', status: 'real_contact_needed', note: 'Search: nursing schools in Manila or Cebu with international placement programs' },
  { id: 'a06', campaignId: 'germany-healthcare', targetType: 'Nursing school (Philippines)', country: 'Philippines', corridor: 'Philippines → Germany', contactChannel: 'email', status: 'real_contact_needed', note: 'Search: Philippine nursing colleges with Dreiklang programme connections' },
  { id: 'a07', campaignId: 'germany-healthcare', targetType: 'Training provider (Morocco)', country: 'Morocco', corridor: 'Morocco → Germany', contactChannel: 'contact_form', status: 'real_contact_needed', note: 'Search: vocational training centres in Morocco with healthcare focus' },
  { id: 'a08', campaignId: 'germany-healthcare', targetType: 'Training provider (Philippines)', country: 'Philippines', corridor: 'Philippines → Germany', contactChannel: 'contact_form', status: 'real_contact_needed', note: 'POLO-registered training centres for healthcare workers' },
  { id: 'a09', campaignId: 'germany-healthcare', targetType: 'Candidate source partner (DE)', country: 'Germany', corridor: 'Multi → Germany', contactChannel: 'linkedin', status: 'real_contact_needed', note: 'Search LinkedIn: "Pflegefachkraft Vermittlung international" or "Nurse recruitment international Germany"' },
  { id: 'a10', campaignId: 'germany-healthcare', targetType: 'Relocation partner (DE)', country: 'Germany', corridor: 'Multi → Germany', contactChannel: 'linkedin', status: 'real_contact_needed', note: 'Search LinkedIn: relocation consultants specialising in healthcare professionals Germany' },
  { id: 'a11', campaignId: 'germany-healthcare', targetType: 'Language school (Morocco)', country: 'Morocco', corridor: 'Morocco → Germany', contactChannel: 'email', status: 'real_contact_needed', note: 'Goethe-Institut Morocco — official German language institute' },
  { id: 'a12', campaignId: 'germany-healthcare', targetType: 'Language school (Morocco)', country: 'Morocco', corridor: 'Morocco → France', contactChannel: 'email', status: 'real_contact_needed', note: 'French language schools in Casablanca with healthcare placement focus' },
  { id: 'a13', campaignId: 'germany-healthcare', targetType: 'Training provider (Tunisia)', country: 'Tunisia', corridor: 'Tunisia → France', contactChannel: 'email', status: 'real_contact_needed', note: 'Healthcare training centres in Tunis — France corridor also active' },
  { id: 'a14', campaignId: 'germany-healthcare', targetType: 'Nursing school (Philippines)', country: 'Philippines', corridor: 'Philippines → Germany', contactChannel: 'email', status: 'real_contact_needed', note: 'University nursing departments with international mobility programmes' },
  { id: 'a15', campaignId: 'germany-healthcare', targetType: 'Training provider (Philippines)', country: 'Philippines', corridor: 'Philippines → Canada', contactChannel: 'contact_form', status: 'real_contact_needed', note: 'Canada corridor — nursing training centres in Manila' },
  { id: 'a16', campaignId: 'germany-healthcare', targetType: 'Language school (Eastern Europe)', country: 'Poland', corridor: 'Poland → Germany', contactChannel: 'email', status: 'real_contact_needed', note: 'German language schools in Warsaw or Kraków with Germany placement focus' },
  { id: 'a17', campaignId: 'germany-healthcare', targetType: 'Candidate source partner (IN)', country: 'India', corridor: 'India → UK/Canada', contactChannel: 'linkedin', status: 'real_contact_needed', note: 'Nursing colleges in Kerala or Tamil Nadu with UK/Canada pathway' },
  { id: 'a18', campaignId: 'germany-healthcare', targetType: 'Training provider (India)', country: 'India', corridor: 'India → UK', contactChannel: 'email', status: 'real_contact_needed', note: 'IT training institutes in Bangalore or Hyderabad with UK placement track' },
  { id: 'a19', campaignId: 'germany-healthcare', targetType: 'Language school (Turkey)', country: 'Turkey', corridor: 'Turkey → Germany', contactChannel: 'email', status: 'real_contact_needed', note: 'German language schools in Istanbul or Ankara' },
  { id: 'a20', campaignId: 'germany-healthcare', targetType: 'Training provider (Nigeria)', country: 'Nigeria', corridor: 'Nigeria → UK', contactChannel: 'linkedin', status: 'real_contact_needed', note: 'Nursing associations in Lagos with UK pathway connections' },

  // Campaign B — Partner Channels (15 targets)
  { id: 'b01', campaignId: 'partner-channels', targetType: 'Recruiting agency (DACH)', country: 'Germany', corridor: 'Multi → DACH', contactChannel: 'linkedin', status: 'real_contact_needed', note: 'Search LinkedIn: "Internationale Personalvermittlung Gesundheitswesen Deutschland"' },
  { id: 'b02', campaignId: 'partner-channels', targetType: 'Recruiting agency (UK)', country: 'UK', corridor: 'India/Africa → UK', contactChannel: 'linkedin', status: 'real_contact_needed', note: 'Search LinkedIn: international healthcare recruitment agencies London' },
  { id: 'b03', campaignId: 'partner-channels', targetType: 'Relocation partner (DE)', country: 'Germany', corridor: 'Multi → Germany', contactChannel: 'linkedin', status: 'real_contact_needed', note: 'Search: relocation management companies specialising in skilled workers Germany' },
  { id: 'b04', campaignId: 'partner-channels', targetType: 'Relocation partner (CA)', country: 'Canada', corridor: 'India/Nigeria → Canada', contactChannel: 'email', status: 'real_contact_needed', note: 'Canadian relocation firms with international healthcare/tech worker focus' },
  { id: 'b05', campaignId: 'partner-channels', targetType: 'Recruiting agency (Gulf)', country: 'UAE', corridor: 'Philippines/India → Gulf', contactChannel: 'email', status: 'real_contact_needed', note: 'Recruitment agencies in Dubai specialising in hospitality/healthcare' },
  { id: 'b06', campaignId: 'partner-channels', targetType: 'Training provider (DE)', country: 'Germany', corridor: 'Multi → Germany', contactChannel: 'contact_form', status: 'real_contact_needed', note: 'German vocational training providers with international recruitment integration' },
  { id: 'b07', campaignId: 'partner-channels', targetType: 'Staffing agency (NL)', country: 'Netherlands', corridor: 'Eastern Europe → NL', contactChannel: 'linkedin', status: 'real_contact_needed', note: 'Dutch staffing agencies with Eastern European corridor expertise' },
  { id: 'b08', campaignId: 'partner-channels', targetType: 'Recruiting agency (AU)', country: 'Australia', corridor: 'Philippines/India → AU', contactChannel: 'linkedin', status: 'real_contact_needed', note: 'Australian healthcare recruitment agencies with Asia-Pacific corridor' },
  { id: 'b09', campaignId: 'partner-channels', targetType: 'Relocation partner (CH)', country: 'Switzerland', corridor: 'Multi → Switzerland', contactChannel: 'email', status: 'real_contact_needed', note: 'Swiss relocation management with healthcare sector focus' },
  { id: 'b10', campaignId: 'partner-channels', targetType: 'Language school network', country: 'Germany', corridor: 'Multi → Germany', contactChannel: 'email', status: 'real_contact_needed', note: 'Language school networks in Germany with integration programmes' },
  { id: 'b11', campaignId: 'partner-channels', targetType: 'Recruiting agency (France)', country: 'France', corridor: 'Morocco/Tunisia → France', contactChannel: 'linkedin', status: 'real_contact_needed', note: 'French recruitment agencies specialising in North African professionals' },
  { id: 'b12', campaignId: 'partner-channels', targetType: 'Relocation partner (ES)', country: 'Spain', corridor: 'LatAm → Spain', contactChannel: 'email', status: 'real_contact_needed', note: 'Spanish relocation firms with Latin American corridor focus' },
  { id: 'b13', campaignId: 'partner-channels', targetType: 'Staffing agency (UK)', country: 'UK', corridor: 'Nigeria/Ghana → UK', contactChannel: 'linkedin', status: 'real_contact_needed', note: 'UK staffing agencies with West Africa healthcare corridor' },
  { id: 'b14', campaignId: 'partner-channels', targetType: 'Training provider (CA)', country: 'Canada', corridor: 'India → Canada', contactChannel: 'contact_form', status: 'real_contact_needed', note: 'Canadian IT/healthcare training providers with immigrant intake programmes' },
  { id: 'b15', campaignId: 'partner-channels', targetType: 'Diaspora organisation', country: 'Germany', corridor: 'Turkey → Germany', contactChannel: 'email', status: 'real_contact_needed', note: 'Turkish-German professional associations with workforce placement focus' },

  // Campaign C — Buyer Candidates (10 targets)
  { id: 'c01', campaignId: 'buyer-candidates', targetType: 'Recruiting agency owner', country: 'Germany', corridor: 'N/A', contactChannel: 'linkedin', status: 'real_contact_needed', note: 'Search LinkedIn: owners/founders of international healthcare recruitment agencies DACH' },
  { id: 'c02', campaignId: 'buyer-candidates', targetType: 'Relocation company', country: 'Germany', corridor: 'N/A', contactChannel: 'linkedin', status: 'real_contact_needed', note: 'Search LinkedIn: managing directors of relocation management companies Germany' },
  { id: 'c03', campaignId: 'buyer-candidates', targetType: 'HR-tech founder', country: 'UK', corridor: 'N/A', contactChannel: 'linkedin', status: 'real_contact_needed', note: 'Search LinkedIn: founders of HR-tech or workforce SaaS startups UK with international focus' },
  { id: 'c04', campaignId: 'buyer-candidates', targetType: 'Staffing agency owner', country: 'Netherlands', corridor: 'N/A', contactChannel: 'linkedin', status: 'real_contact_needed', note: 'Search LinkedIn: owners of staffing agencies NL with international corridors' },
  { id: 'c05', campaignId: 'buyer-candidates', targetType: 'Micro-SaaS buyer', country: 'Various', corridor: 'N/A', contactChannel: 'email', status: 'real_contact_needed', note: 'Acquire.com, MicroAcquire, Flippa listing or direct outreach to serial micro-SaaS buyers' },
  { id: 'c06', campaignId: 'buyer-candidates', targetType: 'Language/training group owner', country: 'Germany', corridor: 'N/A', contactChannel: 'linkedin', status: 'real_contact_needed', note: 'Owners of language school networks with international placement ambitions' },
  { id: 'c07', campaignId: 'buyer-candidates', targetType: 'Recruiting agency owner', country: 'UK', corridor: 'N/A', contactChannel: 'linkedin', status: 'real_contact_needed', note: 'Search LinkedIn: founders/MDs of international recruitment firms UK with DACH/Canada corridors' },
  { id: 'c08', campaignId: 'buyer-candidates', targetType: 'HR-tech investor/acquirer', country: 'Various', corridor: 'N/A', contactChannel: 'email', status: 'real_contact_needed', note: 'Angel investors or PE firms active in HR-tech / workforce space — check Crunchbase' },
  { id: 'c09', campaignId: 'buyer-candidates', targetType: 'Relocation company', country: 'UAE', corridor: 'N/A', contactChannel: 'linkedin', status: 'real_contact_needed', note: 'Gulf-based relocation and workforce management companies — expanding corridors' },
  { id: 'c10', campaignId: 'buyer-candidates', targetType: 'Micro-SaaS buyer', country: 'Various', corridor: 'N/A', contactChannel: 'email', status: 'real_contact_needed', note: 'Post on Indie Hackers, Hacker News (Ask HN: looking to sell), or SaaS marketplace forums' },
]

// ── Proof Tracker initial state ───────────────────────────────────────────────

export const INITIAL_PROOF_STATE: ProofTrackerState = {
  targetsPrepared:    0,
  draftsOpened:       0,
  sentManually:       0,
  repliesReceived:    0,
  positiveReplies:    0,
  neutralReplies:     0,
  rejectedReplies:    0,
  legalRiskReplies:   0,
  buyerInterestLeads: 0,
  proofNotes:         '',
  buyerVisibleProof:  false,
}

// Populated only when real replies are collected
export const REAL_REPLIES: ProofReply[] = [
  // Empty — no real replies yet. Add only when genuine replies are received.
  // Format: { targetId, classification, summary (anonymised), buyerVisible, isReal: true }
]

// ── Buyer Outreach Pack ───────────────────────────────────────────────────────

export const BUYER_OUTREACH_TEXTS: BuyerOutreachText[] = [
  {
    id:         'dm-agency-owner',
    label:      'Short DM — Recruiting Agency Owner',
    targetType: 'recruiting_agency_owner',
    channel:    'dm',
    body: `Hi [Name],

I'm wrapping up a side project that might be interesting to you: CorridorWork — a global talent corridor intelligence platform built for the international recruitment market.

It's a transfer-ready SaaS asset: live domain, Supabase-backed pipeline, 8 scored corridors (Germany healthcare, Canada IT, Gulf hospitality, etc.), admin toolset, 4k+ green tests.

Not a job board. More of a corridor operating system — structured targeting by market, sector, and partner channel.

Happy to share the Buyer Room if you're curious. No pressure.`,
    note: 'Keep it short. Lead with the product, not the ask. Send via LinkedIn DM or Twitter/X.',
  },
  {
    id:         'email-agency-owner',
    label:      'Buyer Email — Recruiting Agency Owner',
    targetType: 'recruiting_agency_owner',
    channel:    'email',
    subject:    'CorridorWork — global talent corridor intelligence platform for sale',
    body: `Subject: CorridorWork — global talent corridor intelligence platform for sale

Hi [Name],

I'm reaching out because [Company] operates in international recruitment, and I think CorridorWork might be a fit for your portfolio or toolset.

CorridorWork is a transfer-ready SaaS asset:
– Live domain: corridorwork.com
– 8 global talent corridors with Buyer Opportunity Scores
– Supabase-backed approval pipeline (employer + candidate source + partner)
– Admin toolset: Growth Department, Contact Copilot, Corridor Intelligence
– TypeScript, Vercel, PostgreSQL — fully documented, 4 112+ green tests

It's at asset stage — no MRR yet, no paying customers. The product is built and transfer-ready. The first buyer activates the monetization paths (agency licence, employer pilot, intelligence package).

Suggested ask: 49 000–79 000 €, depending on buyer fit.

If you'd like a 10-minute walkthrough of the Buyer Room, I'm happy to arrange it.

Best regards,
[Your name]

P.S. Full transfer package: GitHub → Vercel → Supabase → Domain. All four independently transferable.`,
    note: 'Use for cold email to agency owners. Honest about asset stage. Strong on transfer readiness.',
  },
  {
    id:         'email-relocation',
    label:      'Buyer Email — Relocation Company',
    targetType: 'relocation_company',
    channel:    'email',
    subject:    'CorridorWork — corridor intelligence platform, looking for acquisition partner',
    body: `Subject: CorridorWork — corridor intelligence platform, looking for acquisition partner

Hi [Name],

Relocation companies increasingly need to demonstrate corridor-level intelligence — which markets, which sectors, which languages, which regulatory paths.

CorridorWork is a platform I built for exactly that: 8 global talent corridors with Buyer Opportunity Scores, a structured partner channel targeting system, and an approval-based growth pipeline.

It's a transfer-ready SaaS asset at asset stage:
– corridorwork.com (live, indexed)
– Germany healthcare, Canada IT, Gulf hospitality, Eastern Europe corridors
– Supabase (EU-Frankfurt, GDPR), Vercel, TypeScript, 4 112+ tests
– Full documentation, 10-step transfer guide

No MRR yet. First buyer activates the business model. Suggested ask: 49 000–79 000 €.

Worth a 10-minute demo?

Best regards,
[Your name]`,
    note: 'Emphasise the corridor intelligence angle — relocation firms sell this narrative to clients.',
  },
  {
    id:         'email-hrtech-founder',
    label:      'Buyer Email — HR-Tech Founder',
    targetType: 'hrtech_founder',
    channel:    'email',
    subject:    'Acquisition opportunity: global talent corridor SaaS (transfer-ready, TypeScript, 4k+ tests)',
    body: `Subject: Acquisition opportunity: global talent corridor SaaS (transfer-ready, TypeScript, 4k+ tests)

Hi [Name],

Quick pitch for a potential micro-acquisition:

CorridorWork — global talent corridor intelligence & approval-based growth SaaS.

Tech: Next.js App Router, TypeScript strict, Supabase (PostgreSQL 17, EU-Frankfurt, RLS), Vercel. 4 112 passing tests. 0 TypeScript errors. ESLint clean.

Product: 8 scored talent corridors, 3-sided market (employer + candidate source + partner), Supabase-backed approval queue, admin toolset, corridor intelligence engine.

Status: Live at corridorwork.com. Asset stage — no MRR. Transfer-ready: GitHub + Vercel + Supabase + Domain all independently transferable.

Why sell: looking for a buyer with the commercial network to activate the monetization paths faster than solo.

Suggested ask: 49 000–79 000 € (asset-stage valuation, not revenue multiple).

Happy to share the Buyer Room (/admin/buyer-room) for due diligence.

[Your name]`,
    note: 'Lead with technical credibility for HR-tech founders. They care about code quality and stack.',
  },
  {
    id:         'listing-summary',
    label:      'Broker / Listing Summary',
    targetType: 'marketplace_listing',
    channel:    'listing',
    subject:    'Global Talent Corridor Intelligence SaaS — Transfer-Ready Asset',
    body: `Title: Global Talent Corridor Intelligence & Approval-Based Growth SaaS

One-line: Corridor-level talent market intelligence platform with persistent Supabase pipeline, transfer-ready infrastructure, and 4 112+ green tests.

What it is:
CorridorWork is a global talent corridor operating system — not a job board, not a standard ATS. It scores 8 global talent corridors across 7 criteria, manages employer/candidate source/partner pipelines through an approval-based growth queue, and provides structured intelligence for international recruitment market entry.

Tech: Next.js App Router · TypeScript strict · Supabase PostgreSQL 17 (EU, GDPR) · Vercel · 4 112 tests · 0 TS errors · ESLint clean

Revenue: €0 MRR (asset stage). 7 monetization paths ready to activate: SaaS licence, employer pilot, partner intelligence, white-label, corridor dashboard, acquisition.

Transfer: GitHub transfer + Vercel transfer + Supabase transfer + Domain transfer. All 4 independently transferable. 10-step guide documented.

Ask: €49 000–€79 000 (asset stage, not revenue multiple)

Gaps (honest): No paying customers. No market validation yet. Legal review needed before paid placement. Stripe not active.

URL: corridorwork.com
Admin demo: /admin/buyer-room (available on request)`,
    note: 'Use for Acquire.com, MicroAcquire, Flippa, or broker submission. Honest about gaps.',
  },
  {
    id:         'teaser-acquisition',
    label:      'Acquisition Teaser (1 paragraph)',
    targetType: 'all',
    channel:    'teaser',
    body: `CorridorWork is a transfer-ready global talent corridor intelligence SaaS — live at corridorwork.com. Built on Next.js, TypeScript strict, Supabase (EU-Frankfurt, GDPR), and Vercel. 8 global talent corridors scored across 7 buyer opportunity criteria. Three-sided market: employer intake + candidate source intake + partner channel pipeline. Approval-based growth queue (no automated sends). 4 112+ passing tests, 0 TypeScript errors, ESLint clean. Asset stage (no MRR) — first buyer activates SaaS licence, employer pilot, or partner intelligence monetization paths. All four primary assets independently transferable (GitHub, Vercel, Supabase, Domain). Suggested ask: €49 000–€79 000.`,
    note: 'Use as a one-paragraph teaser for any context: forum posts, social media, intro messages.',
  },
]

// ── Launch steps ──────────────────────────────────────────────────────────────

export const LAUNCH_STEPS: {
  step:   number
  label:  string
  action: string
  tool:   string
  done:   boolean
}[] = [
  { step: 1, label: 'Prepare 20–50 targets',         action: 'Open Growth Department → Batch Planner → select Campaign A targets', tool: '/admin/global-growth-department', done: false },
  { step: 2, label: 'Review message drafts',          action: 'For each target, open Contact Copilot → review generated draft → edit as needed', tool: '/admin/contact-copilot', done: false },
  { step: 3, label: 'Open Gmail drafts manually',     action: 'Click Gmail Draft link in Contact Copilot → opens pre-filled draft in Gmail', tool: '/admin/contact-copilot', done: false },
  { step: 4, label: 'Send manually only',             action: 'Press Send in Gmail yourself — manually only. No automated send. No scheduled send.', tool: 'Gmail (manual)', done: false },
  { step: 5, label: 'Track replies',                  action: 'When reply arrives: update target status to reply_received in Growth Department', tool: '/admin/global-growth-department', done: false },
  { step: 6, label: 'Classify replies',               action: 'For each reply: select classification (positive_interest, wants_more_info, etc.)', tool: '/admin/market-proof-launch', done: false },
  { step: 7, label: 'Mark as buyer-visible proof',    action: 'For replies with high buyer value: toggle buyerVisible = true. Anonymise if needed.', tool: '/admin/market-proof-launch', done: false },
  { step: 8, label: 'Export proof summary for buyer', action: 'Click "Export Market Proof Summary" — generates honest summary for buyer due diligence', tool: '/admin/market-proof-launch', done: false },
]

// ── Proof export generator ────────────────────────────────────────────────────

export function generateProofExport(
  tracker:  ProofTrackerState,
  replies:  ProofReply[],
  date:     string,
): string {
  const realReplies = replies.filter((r) => r.isReal)
  const buyerVisible = realReplies.filter((r) => r.buyerVisible)
  const highValue = realReplies.filter((r) =>
    ['positive_interest', 'wants_more_info', 'buyer_interest'].includes(r.classification),
  )

  return `# Market Proof Summary — CorridorWork
Generated: ${date}

⚠️ REAL REPLIES ONLY. Test data and synthetic data are explicitly excluded.
⚠️ No fake customers. No fake revenue. No fake testimonials.

## Outreach Activity

- Targets prepared:       ${tracker.targetsPrepared}
- Drafts opened:          ${tracker.draftsOpened}
- Messages sent manually: ${tracker.sentManually}
- Replies received:       ${tracker.repliesReceived}

## Reply Breakdown

- Positive interest:      ${tracker.positiveReplies}
- Neutral feedback:       ${tracker.neutralReplies}
- Rejected:               ${tracker.rejectedReplies}
- Legal risk signals:     ${tracker.legalRiskReplies}
- Buyer interest leads:   ${tracker.buyerInterestLeads}

## Buyer-Visible Proof (anonymised)

${buyerVisible.length === 0
    ? 'No buyer-visible replies collected yet. Outreach in progress.'
    : buyerVisible.map((r, i) =>
        `Reply ${i + 1} [${r.classification}]:\n"${r.summary}"`
      ).join('\n\n')
  }

## High-Value Signals

${highValue.length === 0
    ? 'None yet — outreach not yet executed.'
    : highValue.map((r) => `• [${r.classification}] ${r.summary}`).join('\n')
  }

## Notes

${tracker.proofNotes || 'No notes added yet.'}

## Disclaimer

All replies shown are from real human contacts. No AI-generated responses.
No staged or fabricated feedback. No personal data included.
Market proof is at early stage — outreach execution pending.
`
}
