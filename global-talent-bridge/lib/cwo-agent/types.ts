/**
 * lib/cwo-agent/types.ts
 *
 * Shared types for the CWO Operating System.
 * All types are pure data — no DB calls, no side effects.
 *
 * Autonomy Levels:
 * A0 — display only
 * A1 — auto-analyze
 * A2 — auto-save draft
 * A3 — auto-create internal tasks
 * A4 — auto-prepare safe inbound content
 * A5 — external action (DISABLED Phase 1 — requires legal review + explicit approval)
 */

export type AutonomyLevel = 'A0' | 'A1' | 'A2' | 'A3' | 'A4' | 'A5'

export type ComplianceStatus = 'safe' | 'needs_review' | 'blocked'

export type Priority = 'high' | 'medium' | 'low'

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

export type TaskStatus = 'pending' | 'planned' | 'in_progress' | 'done' | 'blocked'

export type RevenueRecommendation = 'test_now' | 'test_later' | 'blocked_legal_review'

export type InboundAssetType =
  | 'landing_page'
  | 'seo_content'
  | 'country_page'
  | 'blog_post'
  | 'employer_page'
  | 'corridor_page'

export type Department =
  | 'ceo_agent'
  | 'global_demand'
  | 'employer_demand'
  | 'candidate_magnet'
  | 'inbound_growth'
  | 'revenue_pragmatist'
  | 'compliance_guard'
  | 'operations'

// ── Corridor / Global Demand ──────────────────────────────────────────────────

export type CorridorOpportunity = {
  id:                 string
  origin:             string
  originFlag:         string
  destination:        string
  destinationFlag:    string
  primarySectors:     string[]
  score:              number  // 0–100
  demandRationale:    string
  legalReadiness:     string
  searchSuggestions:  string[]
  priority:           Priority
  complianceStatus:   ComplianceStatus
  noScraping:         true
}

// ── Employer Demand ───────────────────────────────────────────────────────────

export type EmployerSectorDemand = {
  sector:               string
  sectorIcon:           string
  urgency:              number  // 0–100
  paymentWillingness:   number  // 0–100
  internationalNeed:    number  // 0–100
  pilotReadiness:       number  // 0–100
  riskScore:            number  // 0–100
  overallScore:         number  // 0–100
  recommendation:       string
  searchStrategies:     string[]
  complianceStatus:     ComplianceStatus
}

// ── Candidate Magnet ──────────────────────────────────────────────────────────

export type CandidateMagnetAsset = {
  type:           InboundAssetType
  title:          string
  description:    string
  targetCountry?: string
  targetSector?:  string
  audience:       'employer' | 'candidate' | 'both'
  priority:       Priority
  seoKeywords:    string[]
  complianceNote: string
  complianceStatus: ComplianceStatus
}

// ── Inbound Growth ────────────────────────────────────────────────────────────

export type InboundGrowthChannel = {
  id:             string
  channel:        string
  channelIcon:    string
  description:    string
  automatable:    boolean
  autonomyLevel:  AutonomyLevel
  priority:       Priority
  effort:         'low' | 'medium' | 'high'
  expectedImpact: 'low' | 'medium' | 'high'
  nextActions:    string[]
  complianceStatus: ComplianceStatus
}

// ── Revenue Pragmatist ────────────────────────────────────────────────────────

export type RevenueStream = {
  id:               string
  name:             string
  icon:             string
  type:             'saas' | 'white_label' | 'premium' | 'report' | 'featured' | 'success_fee' | 'candidate_service'
  incomePotential:  number  // 0–100
  legalRisk:        number  // 0–100
  effort:           number  // 0–100
  timeToRevenue:    string
  recommendation:   RevenueRecommendation
  rationale:        string
  prerequisites:    string[]
  complianceStatus: ComplianceStatus
}

// ── Compliance Guard ──────────────────────────────────────────────────────────

export type BlockedRisk = {
  id:          string
  category:    string
  description: string
  severity:    RiskLevel
  reason:      string
  status:      'blocked'
}

// ── CWO Task ──────────────────────────────────────────────────────────────────

export type CWOTask = {
  id:               string
  title:            string
  description:      string
  department:       Department
  autonomyLevel?:   AutonomyLevel
  status:           TaskStatus
  priority:         Priority
  score:            number  // 0–100
  riskLevel:        RiskLevel
  complianceStatus: ComplianceStatus
  recommendation:   string
  actionHref?:      string
  noEmailSent:      true
  noAutoOutreach:   true
  noScraping:       true
  createdAt?:       string
}

// ── Operations ────────────────────────────────────────────────────────────────

export type SystemHealthItem = {
  check:    string
  status:   'ok' | 'warning' | 'blocked'
  value:    string
  note?:    string
}

export type WorklogEntry = {
  id:         string
  department: Department
  action:     string
  result:     string
  autonomyLevel: AutonomyLevel
  timestamp:  string
  noEmailSent:    true
  noAutoOutreach: true
  noScraping:     true
}

// ── Department Status ─────────────────────────────────────────────────────────

export type DepartmentStatus = {
  id:           Department
  name:         string
  label?:       string
  icon:         string
  status:       'active' | 'standby' | 'blocked'
  lastAction?:  string
  autonomyLevel?: AutonomyLevel
  route?:       string
  href:         string
  description:  string
}

// ── CWO Command Center ────────────────────────────────────────────────────────

export type CWOCommandCenterState = {
  generatedAt:        string
  topCorridors:       CorridorOpportunity[]
  topEmployerSectors: EmployerSectorDemand[]
  topRevenueStreams:  RevenueStream[]
  topTasks:           CWOTask[]
  blockedRisks:       BlockedRisk[]
  nextBestStep:       string
  nextBestStepHref:   string
  departments:        DepartmentStatus[]
  systemInvariants: {
    emailProvider:         'none'
    outreachEmailProvider: 'none'
    noEmailSent:           true
    noAutoOutreach:        true
    noScraping:            true
    currentAutonomyLevel:  'A4'
    phase:                 1
  }
}
