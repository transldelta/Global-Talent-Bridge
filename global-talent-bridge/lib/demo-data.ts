/**
 * lib/demo-data.ts
 *
 * Buyer Demo Data Pack — synthetische Beispieldaten für Demo/Due-Diligence-Zwecke.
 * Keine echten Personen. Keine echten Unternehmen. Keine echten Umsätze.
 * Alle Objekte tragen demo: true.
 *
 * CONSTRAINTS:
 * - Alle Einträge haben demo: true
 * - Keine echten Personen oder Firmennamen
 * - Keine Umsatzzahlen als bestätigt darstellen
 * - Nur gültige pilot_employers Status:
 *   identified | contacted_manual | interested | demo_scheduled |
 *   onboarding | active_pilot | rejected
 * - NICHT: draft, demo_requested
 */

import { VALID_PILOT_STATUSES, type ValidPilotStatus } from '@/lib/pilot-execution'

// ── Types ────────────────────────────────────────────────────────────────────

export type DemoCandidate = {
  id: string
  displayName: string          // Never a real person
  sourceCountry: string
  targetCountry: string
  profession: string
  sector: 'care' | 'it' | 'construction' | 'hospitality' | 'logistics' | 'engineering'
  languageLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
  experienceYears: number
  cvStatus: 'uploaded' | 'pending' | 'missing'
  relocationReadiness: 'ready' | 'planning' | 'exploring'
  complianceStatus: 'verified' | 'pending' | 'not_started'
  qualityScore: number          // 0–100
  corridor: string              // e.g. "India → Germany"
  demo: true
  dataSource: 'synthetic'
}

export type DemoEmployer = {
  id: string
  companyName: string           // Generic fictitious names only
  country: string
  industry: string
  contactRole: string
  status: ValidPilotStatus
  interestLevel: 'unknown' | 'low' | 'medium' | 'high' | 'very_high'
  sector: string
  notes: string
  demo: true
  dataSource: 'synthetic'
}

export type DemoCorridor = {
  id: string
  name: string
  sourceCountry: string
  targetCountry: string
  talentCategory: string
  demandSignal: 'low' | 'medium' | 'high' | 'critical'
  candidateSupplySignal: 'low' | 'medium' | 'high' | 'very_high'
  complianceRisk: 'low' | 'medium' | 'high'
  employerUrgency: 'low' | 'medium' | 'high' | 'critical'
  opportunityScore: number      // 0–100
  suggestedLandingPageAngle: string
  suggestedOutreachAngle: string
  nextBestAction: string
  demo: true
  dataSource: 'synthetic'
}

export type DemoRevenueAssumption = {
  id: string
  label: string
  type: 'subscription' | 'placement_fee' | 'pilot_fee' | 'consulting'
  scenario: 'conservative' | 'base' | 'optimistic'
  monthlyEstimate: number       // EUR — ESTIMATE ONLY, not verified
  annualEstimate: number        // EUR — ESTIMATE ONLY, not verified
  assumption: string            // Clear disclaimer per item
  isVerified: false             // Always false — never real revenue
  demo: true
  dataSource: 'synthetic'
}

export type DemoRisk = {
  id: string
  title: string
  category: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  description: string
  mitigation: string
  demo: true
  dataSource: 'synthetic'
}

// ── Demo Candidates (12) ──────────────────────────────────────────────────────

export function getDemoCandidates(): DemoCandidate[] {
  return [
    {
      id: 'demo-cand-01',
      displayName: 'Sample Candidate A',
      sourceCountry: 'India',
      targetCountry: 'Canada',
      profession: 'Registered Nurse',
      sector: 'care',
      languageLevel: 'B2',
      experienceYears: 4,
      cvStatus: 'uploaded',
      relocationReadiness: 'ready',
      complianceStatus: 'verified',
      qualityScore: 82,
      corridor: 'India → Canada',
      demo: true,
      dataSource: 'synthetic',
    },
    {
      id: 'demo-cand-02',
      displayName: 'Sample Candidate B',
      sourceCountry: 'India',
      targetCountry: 'United Kingdom',
      profession: 'Care Assistant',
      sector: 'care',
      languageLevel: 'C1',
      experienceYears: 6,
      cvStatus: 'uploaded',
      relocationReadiness: 'ready',
      complianceStatus: 'verified',
      qualityScore: 88,
      corridor: 'India → United Kingdom',
      demo: true,
      dataSource: 'synthetic',
    },
    {
      id: 'demo-cand-03',
      displayName: 'Sample Candidate C',
      sourceCountry: 'Philippines',
      targetCountry: 'Germany',
      profession: 'Altenpfleger/in',
      sector: 'care',
      languageLevel: 'B1',
      experienceYears: 3,
      cvStatus: 'uploaded',
      relocationReadiness: 'planning',
      complianceStatus: 'pending',
      qualityScore: 71,
      corridor: 'Philippines → Germany',
      demo: true,
      dataSource: 'synthetic',
    },
    {
      id: 'demo-cand-04',
      displayName: 'Sample Candidate D',
      sourceCountry: 'Morocco',
      targetCountry: 'Germany',
      profession: 'Elektriker',
      sector: 'construction',
      languageLevel: 'B2',
      experienceYears: 5,
      cvStatus: 'uploaded',
      relocationReadiness: 'ready',
      complianceStatus: 'pending',
      qualityScore: 74,
      corridor: 'Morocco → Germany',
      demo: true,
      dataSource: 'synthetic',
    },
    {
      id: 'demo-cand-05',
      displayName: 'Sample Candidate E',
      sourceCountry: 'Tunisia',
      targetCountry: 'France',
      profession: 'Chef de Cuisine',
      sector: 'hospitality',
      languageLevel: 'C1',
      experienceYears: 7,
      cvStatus: 'uploaded',
      relocationReadiness: 'ready',
      complianceStatus: 'verified',
      qualityScore: 86,
      corridor: 'Tunisia → France',
      demo: true,
      dataSource: 'synthetic',
    },
    {
      id: 'demo-cand-06',
      displayName: 'Sample Candidate F',
      sourceCountry: 'Nigeria',
      targetCountry: 'United Kingdom',
      profession: 'Software Engineer',
      sector: 'it',
      languageLevel: 'C2',
      experienceYears: 5,
      cvStatus: 'uploaded',
      relocationReadiness: 'ready',
      complianceStatus: 'verified',
      qualityScore: 91,
      corridor: 'Nigeria → United Kingdom',
      demo: true,
      dataSource: 'synthetic',
    },
    {
      id: 'demo-cand-07',
      displayName: 'Sample Candidate G',
      sourceCountry: 'Kenya',
      targetCountry: 'Germany',
      profession: 'Lkw-Fahrer',
      sector: 'logistics',
      languageLevel: 'B1',
      experienceYears: 8,
      cvStatus: 'pending',
      relocationReadiness: 'planning',
      complianceStatus: 'not_started',
      qualityScore: 65,
      corridor: 'Kenya → Germany',
      demo: true,
      dataSource: 'synthetic',
    },
    {
      id: 'demo-cand-08',
      displayName: 'Sample Candidate H',
      sourceCountry: 'Turkey',
      targetCountry: 'Germany',
      profession: 'Maurer',
      sector: 'construction',
      languageLevel: 'B2',
      experienceYears: 10,
      cvStatus: 'uploaded',
      relocationReadiness: 'ready',
      complianceStatus: 'pending',
      qualityScore: 78,
      corridor: 'Turkey → Germany',
      demo: true,
      dataSource: 'synthetic',
    },
    {
      id: 'demo-cand-09',
      displayName: 'Sample Candidate I',
      sourceCountry: 'India',
      targetCountry: 'Germany',
      profession: 'DevOps Engineer',
      sector: 'it',
      languageLevel: 'B2',
      experienceYears: 4,
      cvStatus: 'uploaded',
      relocationReadiness: 'ready',
      complianceStatus: 'verified',
      qualityScore: 84,
      corridor: 'India → Germany',
      demo: true,
      dataSource: 'synthetic',
    },
    {
      id: 'demo-cand-10',
      displayName: 'Sample Candidate J',
      sourceCountry: 'Philippines',
      targetCountry: 'Germany',
      profession: 'Gesundheits- und Krankenpfleger/in',
      sector: 'care',
      languageLevel: 'B2',
      experienceYears: 6,
      cvStatus: 'uploaded',
      relocationReadiness: 'ready',
      complianceStatus: 'verified',
      qualityScore: 89,
      corridor: 'Philippines → Germany',
      demo: true,
      dataSource: 'synthetic',
    },
    {
      id: 'demo-cand-11',
      displayName: 'Sample Candidate K',
      sourceCountry: 'Morocco',
      targetCountry: 'Germany',
      profession: 'Hotelfachmann/-frau',
      sector: 'hospitality',
      languageLevel: 'B1',
      experienceYears: 3,
      cvStatus: 'missing',
      relocationReadiness: 'exploring',
      complianceStatus: 'not_started',
      qualityScore: 58,
      corridor: 'Morocco → Germany',
      demo: true,
      dataSource: 'synthetic',
    },
    {
      id: 'demo-cand-12',
      displayName: 'Sample Candidate L',
      sourceCountry: 'Nigeria',
      targetCountry: 'Canada',
      profession: 'Frontend Developer',
      sector: 'it',
      languageLevel: 'C1',
      experienceYears: 3,
      cvStatus: 'uploaded',
      relocationReadiness: 'ready',
      complianceStatus: 'pending',
      qualityScore: 76,
      corridor: 'Nigeria → Canada',
      demo: true,
      dataSource: 'synthetic',
    },
  ]
}

// ── Demo Employers (10) ───────────────────────────────────────────────────────

export function getDemoEmployers(): DemoEmployer[] {
  return [
    {
      id: 'demo-emp-01',
      companyName: 'Sample Care Facility Alpha',
      country: 'Germany',
      industry: 'Pflegeheim',
      contactRole: 'HR Manager',
      status: 'active_pilot',
      interestLevel: 'very_high',
      sector: 'Care / Nursing',
      notes: 'Demo employer — synthetic data only',
      demo: true,
      dataSource: 'synthetic',
    },
    {
      id: 'demo-emp-02',
      companyName: 'Sample Hospital Beta',
      country: 'United Kingdom',
      industry: 'Klinik',
      contactRole: 'Talent Acquisition Lead',
      status: 'interested',
      interestLevel: 'high',
      sector: 'Healthcare',
      notes: 'Demo employer — synthetic data only',
      demo: true,
      dataSource: 'synthetic',
    },
    {
      id: 'demo-emp-03',
      companyName: 'Sample IT Firm Gamma',
      country: 'Canada',
      industry: 'IT-Unternehmen',
      contactRole: 'CTO',
      status: 'demo_scheduled',
      interestLevel: 'high',
      sector: 'Technology',
      notes: 'Demo employer — synthetic data only',
      demo: true,
      dataSource: 'synthetic',
    },
    {
      id: 'demo-emp-04',
      companyName: 'Sample Logistics Delta',
      country: 'Germany',
      industry: 'Logistik',
      contactRole: 'Fleet Manager',
      status: 'contacted_manual',
      interestLevel: 'medium',
      sector: 'Logistics',
      notes: 'Demo employer — synthetic data only',
      demo: true,
      dataSource: 'synthetic',
    },
    {
      id: 'demo-emp-05',
      companyName: 'Sample Construction Epsilon',
      country: 'Germany',
      industry: 'Bau',
      contactRole: 'Site Director',
      status: 'identified',
      interestLevel: 'unknown',
      sector: 'Construction',
      notes: 'Demo employer — synthetic data only',
      demo: true,
      dataSource: 'synthetic',
    },
    {
      id: 'demo-emp-06',
      companyName: 'Sample Hospitality Zeta',
      country: 'France',
      industry: 'Gastronomie',
      contactRole: 'HR Director',
      status: 'interested',
      interestLevel: 'high',
      sector: 'Hospitality',
      notes: 'Demo employer — synthetic data only',
      demo: true,
      dataSource: 'synthetic',
    },
    {
      id: 'demo-emp-07',
      companyName: 'Sample Nursing Home Eta',
      country: 'Austria',
      industry: 'Pflegeheim',
      contactRole: 'Pflegedienstleitung',
      status: 'onboarding',
      interestLevel: 'very_high',
      sector: 'Care / Nursing',
      notes: 'Demo employer — synthetic data only',
      demo: true,
      dataSource: 'synthetic',
    },
    {
      id: 'demo-emp-08',
      companyName: 'Sample Staffing Agency Theta',
      country: 'United Kingdom',
      industry: 'Personalvermittler',
      contactRole: 'Business Development Manager',
      status: 'interested',
      interestLevel: 'medium',
      sector: 'Staffing',
      notes: 'Demo employer — synthetic data only',
      demo: true,
      dataSource: 'synthetic',
    },
    {
      id: 'demo-emp-09',
      companyName: 'Sample Tech Corp Iota',
      country: 'Canada',
      industry: 'IT-Unternehmen',
      contactRole: 'Recruiter',
      status: 'rejected',
      interestLevel: 'low',
      sector: 'Technology',
      notes: 'Demo employer — synthetic data only. Marked rejected for pipeline demo.',
      demo: true,
      dataSource: 'synthetic',
    },
    {
      id: 'demo-emp-10',
      companyName: 'Sample Engineering Kappa',
      country: 'Germany',
      industry: 'Maschinenbau',
      contactRole: 'HR Business Partner',
      status: 'contacted_manual',
      interestLevel: 'medium',
      sector: 'Engineering',
      notes: 'Demo employer — synthetic data only',
      demo: true,
      dataSource: 'synthetic',
    },
  ]
}

// ── Demo Corridors (8) ────────────────────────────────────────────────────────

export function getDemoCorridors(): DemoCorridor[] {
  return [
    {
      id: 'demo-corr-01',
      name: 'India → Canada (Nursing)',
      sourceCountry: 'India',
      targetCountry: 'Canada',
      talentCategory: 'Nursing / Care',
      demandSignal: 'critical',
      candidateSupplySignal: 'very_high',
      complianceRisk: 'medium',
      employerUrgency: 'critical',
      opportunityScore: 88,
      suggestedLandingPageAngle: 'Nursing Jobs in Canada for Indian Professionals',
      suggestedOutreachAngle: 'Canada is actively recruiting nurses from India — licensing support available',
      nextBestAction: 'Launch LinkedIn campaign targeting Indian nurses with 2+ years ICU experience',
      demo: true,
      dataSource: 'synthetic',
    },
    {
      id: 'demo-corr-02',
      name: 'India → United Kingdom (Healthcare)',
      sourceCountry: 'India',
      targetCountry: 'United Kingdom',
      talentCategory: 'Healthcare / NHS',
      demandSignal: 'critical',
      candidateSupplySignal: 'very_high',
      complianceRisk: 'medium',
      employerUrgency: 'high',
      opportunityScore: 85,
      suggestedLandingPageAngle: 'NHS Jobs for Indian Healthcare Professionals',
      suggestedOutreachAngle: 'NHS actively recruits internationally — structured pathway available',
      nextBestAction: 'Contact NHS trusts with international recruitment needs via LinkedIn outreach',
      demo: true,
      dataSource: 'synthetic',
    },
    {
      id: 'demo-corr-03',
      name: 'Philippines → Germany (Care)',
      sourceCountry: 'Philippines',
      targetCountry: 'Germany',
      talentCategory: 'Altenpflege / Care',
      demandSignal: 'critical',
      candidateSupplySignal: 'high',
      complianceRisk: 'high',
      employerUrgency: 'critical',
      opportunityScore: 82,
      suggestedLandingPageAngle: 'Pflegejobs in Deutschland für philippinische Fachkräfte',
      suggestedOutreachAngle: 'Deutschland braucht dringend Pflegefachkräfte — Triple-Win möglich',
      nextBestAction: 'Pilot mit einem Pflegeheim in NRW oder Bayern starten',
      demo: true,
      dataSource: 'synthetic',
    },
    {
      id: 'demo-corr-04',
      name: 'Morocco → Germany (Construction)',
      sourceCountry: 'Morocco',
      targetCountry: 'Germany',
      talentCategory: 'Construction / Trades',
      demandSignal: 'high',
      candidateSupplySignal: 'high',
      complianceRisk: 'medium',
      employerUrgency: 'high',
      opportunityScore: 78,
      suggestedLandingPageAngle: 'Handwerkerjobs in Deutschland — Marokko',
      suggestedOutreachAngle: 'Deutsch-marokkanisches Fachkräfteabkommen nutzen',
      nextBestAction: 'Baufirmen in Bayern und BW mit konkreten Vakanzlisten ansprechen',
      demo: true,
      dataSource: 'synthetic',
    },
    {
      id: 'demo-corr-05',
      name: 'Tunisia → France (Hospitality)',
      sourceCountry: 'Tunisia',
      targetCountry: 'France',
      talentCategory: 'Hospitality / Gastronomy',
      demandSignal: 'high',
      candidateSupplySignal: 'high',
      complianceRisk: 'low',
      employerUrgency: 'medium',
      opportunityScore: 74,
      suggestedLandingPageAngle: 'Emplois en restauration en France pour les professionnels tunisiens',
      suggestedOutreachAngle: 'La France recrute activement dans la restauration — parcours simplifié',
      nextBestAction: 'Contacter des chaînes hôtelières françaises avec des besoins en saisonniers',
      demo: true,
      dataSource: 'synthetic',
    },
    {
      id: 'demo-corr-06',
      name: 'Nigeria → United Kingdom (IT)',
      sourceCountry: 'Nigeria',
      targetCountry: 'United Kingdom',
      talentCategory: 'Software Engineering / IT',
      demandSignal: 'high',
      candidateSupplySignal: 'very_high',
      complianceRisk: 'low',
      employerUrgency: 'high',
      opportunityScore: 80,
      suggestedLandingPageAngle: 'UK Tech Jobs for Nigerian Software Engineers',
      suggestedOutreachAngle: 'Nigeria has world-class engineers — UK Skilled Worker Visa pathway is open',
      nextBestAction: 'Target UK tech scale-ups actively hiring internationally via LinkedIn recruiter',
      demo: true,
      dataSource: 'synthetic',
    },
    {
      id: 'demo-corr-07',
      name: 'Kenya → Germany (Logistics)',
      sourceCountry: 'Kenya',
      targetCountry: 'Germany',
      talentCategory: 'Logistics / Transport',
      demandSignal: 'medium',
      candidateSupplySignal: 'medium',
      complianceRisk: 'medium',
      employerUrgency: 'medium',
      opportunityScore: 62,
      suggestedLandingPageAngle: 'Logistikjobs in Deutschland für kenianische Fachkräfte',
      suggestedOutreachAngle: 'Deutscher Lkw-Fahrermangel — strukturiertes Anerkennungsverfahren möglich',
      nextBestAction: 'Sprachförderung als Voraussetzung klar kommunizieren — B1 Mindest anforderung',
      demo: true,
      dataSource: 'synthetic',
    },
    {
      id: 'demo-corr-08',
      name: 'Turkey → Germany (Engineering)',
      sourceCountry: 'Turkey',
      targetCountry: 'Germany',
      talentCategory: 'Engineering / Manufacturing',
      demandSignal: 'high',
      candidateSupplySignal: 'high',
      complianceRisk: 'low',
      employerUrgency: 'high',
      opportunityScore: 76,
      suggestedLandingPageAngle: 'Ingenieurjobs in Deutschland für türkische Fachkräfte',
      suggestedOutreachAngle: 'Deutsch-türkische Fachkräftebeziehungen — historisch gewachsen, aktuell stark',
      nextBestAction: 'Maschinenbauunternehmen in Baden-Württemberg direkt ansprechen',
      demo: true,
      dataSource: 'synthetic',
    },
  ]
}

// ── Demo Revenue Assumptions (6) ─────────────────────────────────────────────

export function getDemoRevenueAssumptions(): DemoRevenueAssumption[] {
  return [
    {
      id: 'demo-rev-01',
      label: 'Employer Monthly Subscription (Conservative)',
      type: 'subscription',
      scenario: 'conservative',
      monthlyEstimate: 149,
      annualEstimate: 1788,
      assumption:
        'ESTIMATE ONLY. Assumes €149/month per employer × assumed 3 paying employers at month 6. Not verified. Not real revenue.',
      isVerified: false,
      demo: true,
      dataSource: 'synthetic',
    },
    {
      id: 'demo-rev-02',
      label: 'Employer Monthly Subscription (Base)',
      type: 'subscription',
      scenario: 'base',
      monthlyEstimate: 499,
      annualEstimate: 5988,
      assumption:
        'ESTIMATE ONLY. Assumes €499/month per employer × assumed 5 paying employers at month 9. Not verified. Not real revenue.',
      isVerified: false,
      demo: true,
      dataSource: 'synthetic',
    },
    {
      id: 'demo-rev-03',
      label: 'Employer Monthly Subscription (Optimistic)',
      type: 'subscription',
      scenario: 'optimistic',
      monthlyEstimate: 999,
      annualEstimate: 11988,
      assumption:
        'ESTIMATE ONLY. Assumes €999/month per employer × assumed 10 paying employers at month 12. Not verified. Not real revenue.',
      isVerified: false,
      demo: true,
      dataSource: 'synthetic',
    },
    {
      id: 'demo-rev-04',
      label: 'Placement Success Fee (Base)',
      type: 'placement_fee',
      scenario: 'base',
      monthlyEstimate: 1000,
      annualEstimate: 12000,
      assumption:
        'ESTIMATE ONLY. Assumes €500/placement × 2 successful placements/month in year 1. Not verified. No placement has occurred yet.',
      isVerified: false,
      demo: true,
      dataSource: 'synthetic',
    },
    {
      id: 'demo-rev-05',
      label: 'Employer Pilot Access Fee (Conservative)',
      type: 'pilot_fee',
      scenario: 'conservative',
      monthlyEstimate: 299,
      annualEstimate: 3588,
      assumption:
        'ESTIMATE ONLY. Assumes €299/month pilot fee × 5 pilot employers. First conversion not yet achieved.',
      isVerified: false,
      demo: true,
      dataSource: 'synthetic',
    },
    {
      id: 'demo-rev-06',
      label: 'B2B Consulting / Integration (Optimistic)',
      type: 'consulting',
      scenario: 'optimistic',
      monthlyEstimate: 2000,
      annualEstimate: 24000,
      assumption:
        'ESTIMATE ONLY. Assumes one B2B consulting arrangement at €2,000/month. Highly speculative. No such arrangement exists.',
      isVerified: false,
      demo: true,
      dataSource: 'synthetic',
    },
  ]
}

// ── Demo Risk Register (8) ───────────────────────────────────────────────────

export function getDemoRisks(): DemoRisk[] {
  return [
    {
      id: 'demo-risk-01',
      title: 'Legal / Compliance Risk',
      category: 'Regulatory',
      severity: 'high',
      description:
        'International recruitment is regulated in most target countries (Germany: §291 SGB III, UK: REC, Canada: provincial agencies). Operating without proper licensing exposes the platform to legal risk.',
      mitigation:
        'Legal review required per target country before commercial launch. Partner with licensed agencies as interim model.',
      demo: true,
      dataSource: 'synthetic',
    },
    {
      id: 'demo-risk-02',
      title: 'Candidate Verification Risk',
      category: 'Operational',
      severity: 'medium',
      description:
        'Candidate qualifications (CVs, language certificates, professional licenses) are self-reported. No independent verification mechanism currently in place.',
      mitigation:
        'Introduce tiered verification: CV review → language certificate upload → video interview → admin approval. Integrate credential verification API in v2.',
      demo: true,
      dataSource: 'synthetic',
    },
    {
      id: 'demo-risk-03',
      title: 'Employer Conversion Risk',
      category: 'Commercial',
      severity: 'high',
      description:
        'No paying employer yet. Conversion from "interested" to "paying" is unproven. Employers may be skeptical without track record or references.',
      mitigation:
        'Offer first employer a 30-day free pilot with one corridor. Use case documentation and candidate pool visibility as conversion tools.',
      demo: true,
      dataSource: 'synthetic',
    },
    {
      id: 'demo-risk-04',
      title: 'Cold Start Marketplace Risk',
      category: 'Strategic',
      severity: 'high',
      description:
        'Classic two-sided marketplace chicken-and-egg problem: employers want candidates, candidates join only when employers exist.',
      mitigation:
        'Focus first on one deep corridor (e.g., Philippines → Germany, Care) rather than broad coverage. Use 25 demo pilot candidates as initial pool.',
      demo: true,
      dataSource: 'synthetic',
    },
    {
      id: 'demo-risk-05',
      title: 'Data Privacy Risk',
      category: 'Compliance',
      severity: 'medium',
      description:
        'Candidate CVs and personal data stored in Supabase Storage. GDPR compliance requires deletion workflow, DPA with Supabase, privacy policy updates.',
      mitigation:
        'Sign DPA with Supabase. Implement candidate data deletion endpoint. Update privacy policy before commercial launch.',
      demo: true,
      dataSource: 'synthetic',
    },
    {
      id: 'demo-risk-06',
      title: 'Cross-Border Recruitment Regulation Risk',
      category: 'Regulatory',
      severity: 'high',
      description:
        'Requirements differ significantly: Germany (ZAV/BA), UK (Gangmasters Licensing), Australia (RCSA), Canada (ACSESS). Each market requires separate legal review.',
      mitigation:
        'Start with one target country and one corridor. Build a regulatory checklist per country before expanding.',
      demo: true,
      dataSource: 'synthetic',
    },
    {
      id: 'demo-risk-07',
      title: 'Payment Activation Risk',
      category: 'Commercial',
      severity: 'high',
      description:
        'Stripe is integrated but not live. No real transactions possible until Stripe live mode is activated. This blocks revenue verification entirely.',
      mitigation:
        'Activate Stripe live mode after first employer confirms intent to pay. Requires business bank account and Stripe KYC.',
      demo: true,
      dataSource: 'synthetic',
    },
    {
      id: 'demo-risk-08',
      title: 'Operational Handover Risk',
      category: 'Transition',
      severity: 'medium',
      description:
        'If the platform is acquired or transferred, the new operator needs onboarding time. Operational knowledge is concentrated with the founding team.',
      mitigation:
        'Document all admin workflows. Admin dashboards designed for non-technical operators. Test suite provides safety net for changes.',
      demo: true,
      dataSource: 'synthetic',
    },
  ]
}

// ── Aggregate Demo Pack ───────────────────────────────────────────────────────

export type DemoPack = {
  candidates: DemoCandidate[]
  employers: DemoEmployer[]
  corridors: DemoCorridor[]
  revenueAssumptions: DemoRevenueAssumption[]
  risks: DemoRisk[]
  meta: {
    totalCandidates: number
    totalEmployers: number
    totalCorridors: number
    totalRevenueAssumptions: number
    totalRisks: number
    allMarkedAsDemo: true
    noVerifiedRevenue: true
    noRealCustomers: true
    generatedAt: string
  }
}

export function getDemoPack(): DemoPack {
  const candidates = getDemoCandidates()
  const employers = getDemoEmployers()
  const corridors = getDemoCorridors()
  const revenueAssumptions = getDemoRevenueAssumptions()
  const risks = getDemoRisks()

  return {
    candidates,
    employers,
    corridors,
    revenueAssumptions,
    risks,
    meta: {
      totalCandidates: candidates.length,
      totalEmployers: employers.length,
      totalCorridors: corridors.length,
      totalRevenueAssumptions: revenueAssumptions.length,
      totalRisks: risks.length,
      allMarkedAsDemo: true,
      noVerifiedRevenue: true,
      noRealCustomers: true,
      generatedAt: new Date().toISOString(),
    },
  }
}
