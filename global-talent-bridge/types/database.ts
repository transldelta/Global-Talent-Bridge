/**
 * CorridorWork — Datenbank-Typen
 * Phase 1 MVP
 */

export type UserRole = 'candidate' | 'employer'
export type MatchStatus = 'pending' | 'accepted' | 'rejected'
export type TaskStatus = 'planned' | 'in_progress' | 'completed' | 'failed' | 'blocked'
export type RiskLevel = 'low' | 'medium' | 'high'
export type AgentLogStatus = 'info' | 'success' | 'warning' | 'error'

export interface Profile {
  id: string
  role: UserRole
  full_name: string | null
  country: string | null
  city: string | null
  created_at: string
  updated_at: string
}

export interface Candidate {
  id: string
  user_id: string
  sector: string | null
  years_experience: number
  german_level: string | null
  english_level: string | null
  skills: string[]
  preferred_countries: string[]
  created_at: string
}

export interface Employer {
  id: string
  user_id: string
  company_name: string
  country: string | null
  sector: string | null
  contact_email: string | null
  created_at: string
}

export interface Job {
  id: string
  employer_id: string
  title: string
  sector: string | null
  required_experience: number
  required_german: string | null
  required_english: string | null
  salary_range: string | null
  city: string | null
  country: string | null
  is_active: boolean
  created_at: string
}

export interface Match {
  id: string
  candidate_id: string
  job_id: string
  score: number
  status: MatchStatus
  created_at: string
}

export interface OnboardingProgress {
  id: string
  user_id: string
  step1_complete: boolean
  step2_complete: boolean
  step3_complete: boolean
  step4_complete: boolean
  step5_complete: boolean
  completed_at: string | null
}

export interface SystemLog {
  id: string
  agent_name: string | null
  status: AgentLogStatus | null
  message: string | null
  created_at: string
}

export interface AgentDepartment {
  id: string
  department_key: string
  name: string
  description: string | null
  mission: string | null
  active: boolean
  created_at: string
}

export interface AgentRegistry {
  agent_name: string
  department_key: string | null
  description: string | null
  responsibility: string | null
  active: boolean
  risk_level: RiskLevel
  requires_human_approval: boolean
  created_at: string
}

export interface AgentTask {
  id: string
  department_key: string | null
  agent_name: string | null
  title: string | null
  description: string | null
  status: TaskStatus
  priority: number
  requires_human_approval: boolean
  created_at: string
  updated_at: string
}

export interface AgentReport {
  id: string
  department_key: string | null
  agent_name: string | null
  report_type: string | null
  title: string | null
  summary: string | null
  recommendations: string | null
  risk_notes: string | null
  created_at: string
}

export interface BusinessMetric {
  id: string
  metric_key: string | null
  metric_name: string | null
  metric_value: number
  period: string | null
  source: string | null
  created_at: string
}
