/**
 * lib/cwo-agent/index.ts
 *
 * CWO Agent — Main Orchestrator
 *
 * Haupt-Export-Datei für das CWO Operating System.
 * Importiere aus hier, nicht direkt aus den Department-Dateien.
 */

// Re-exports für Types
export type {
  AutonomyLevel,
  ComplianceStatus,
  Priority,
  RiskLevel,
  Department,
  CorridorOpportunity,
  EmployerSectorDemand,
  RevenueStream,
  BlockedRisk,
  CWOTask,
  CWOCommandCenterState,
} from './types'

// Re-exports für Global Demand
export {
  analyzeCorridors,
  getTopCorridors,
  getAvailableOrigins,
  getAvailableDestinations,
} from './global-demand'

// Re-exports für Employer Demand
export {
  analyzeEmployerDemand,
  getTopEmployerSectors,
  getPilotReadySectors,
} from './employer-demand'

// Re-exports für Revenue Pragmatist
export {
  analyzeRevenueStreams,
  getImmediateRevenueStreams,
  getBlockedRevenueStreams,
  getTopRevenueStreams,
  getPriorityScore,
} from './revenue-pragmatist'

// Re-exports für Compliance Guard
export {
  getAllBlockedRisks,
  getCriticalRisks,
  checkAction,
  validateInvariants,
  getRiskSummary,
  SYSTEM_INVARIANTS,
} from './compliance-guard'

// Re-exports für Candidate Magnet
export {
  getCandidateMagnetAssets,
  getTopCandidateAssets,
  getAssetsByAudience,
  getAssetsByType,
  getComplianceSummary,
} from './candidate-magnet'

// Re-exports für Inbound Growth
export {
  getInboundChannels,
  getTopInboundChannels,
  getContentCalendar,
  getUpcomingContent,
  getSEOClusters,
  getRegistrationFunnels,
  getGrowthSummary,
} from './inbound-growth'

export type {
  InboundChannel,
  ContentCalendarItem,
  RegistrationFunnel,
  SEOPlan,
} from './inbound-growth'

// Re-exports für Operations
export {
  getSystemChecks,
  getSystemIssues,
  getPilotSteps,
  getOpenPilotSteps,
  getNextPilotStep,
  generateDailyReport,
  getSystemStatusSummary,
} from './operations'

export type {
  SystemCheck,
  PilotStep,
  DailyReport,
} from './operations'

// Re-exports für CEO Agent (Hauptorchestrator)
export {
  generateTageslageSummary,
  generateTopTasks,
  getDepartmentMeta,
  generateCWOState,
} from './ceo-agent'
