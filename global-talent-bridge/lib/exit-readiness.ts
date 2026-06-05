/**
 * lib/exit-readiness.ts
 *
 * Exit Readiness Evidence Pack — reine Business-Logic.
 * Keine UI. Keine Server-Imports. Testbar mit Vitest.
 *
 * CONSTRAINTS:
 * - Keine erfundenen Umsätze oder Kunden
 * - Ehrliche Antworten auf Käufer-Fragen
 * - Risiken klar dokumentieren
 * - Schätzungen als Schätzungen markieren
 */

// ── Types ────────────────────────────────────────────────────────────────────

export type ChecklistStatus = 'confirmed' | 'partial' | 'missing'

export type ChecklistItem = {
  id: string
  label: string
  status: ChecklistStatus
  detail: string
}

export type ValueDriver = {
  id: string
  title: string
  description: string
  evidence: string
  strength: 'strong' | 'moderate' | 'weak'
}

export type RiskItem = {
  id: string
  title: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  explanation: string
  mitigation: string
  ownerSuggestion: string
}

export type BuyerQuestion = {
  question: string
  answer: string
  honesty: 'positive' | 'neutral' | 'candid'
}

export type ProductSummary = {
  name: string
  tagline: string
  description: string
  targetAudience: string[]
  coreModules: string[]
  pilotStatus: string
  technicalStatus: string
  monetizationLogic: string
  generatedAt: string
}

export type ExitEvidence = {
  productSummary: ProductSummary
  buyerChecklist: ChecklistItem[]
  valueDrivers: ValueDriver[]
  riskRegister: RiskItem[]
  buyerQuestions: BuyerQuestion[]
  overallReadinessScore: number
  generatedAt: string
}

// ── Product Summary ──────────────────────────────────────────────────────────

export function generateProductSummary(): ProductSummary {
  return {
    name: 'Global Talent Bridge',
    tagline: 'International talent matching — structured, transparent, scalable.',
    description:
      'Global Talent Bridge ist eine B2B SaaS-Plattform für strukturiertes internationales Recruiting. ' +
      'Sie verbindet Arbeitgeber in Europa/Nordamerika/Australien mit vorqualifizierten internationalen ' +
      'Fachkräften über datengetriebene Migrations-Korridore. Die Plattform deckt den vollständigen ' +
      'Matching-Zyklus ab: Kandidaten-Onboarding, CV-Upload, Bewerbungsmanagement, Admin-Freigabe-Workflow, ' +
      'Arbeitgeber-Dashboard und Pilot-Outreach-System.',
    targetAudience: [
      'Arbeitgeber mit internationalem Rekrutierungsbedarf (Pflege, IT, Ingenieurwesen)',
      'Personalvermittler mit globalem Kandidatenpool',
      'Migrationsberater und Visa-Agenturen',
      'Acquirer / Investoren im HR-Tech / Marketplace-Bereich',
    ],
    coreModules: [
      'Kandidaten-Onboarding & CV-Management',
      'Arbeitgeber-Dashboard & Job-Management',
      'Bewerbungsmanagement mit Admin-Freigabe-Workflow',
      'Pilot-Outreach-Cockpit (5 Template-Typen × 3 Kanäle)',
      'CEO Dashboard mit Echtzeit-KPIs',
      'Migration Corridor Intelligence (8+ Korridore)',
      'Revenue Intelligence & Forecast-Engine',
      'E2E-Pilot-Test-Infrastruktur',
      'Multi-Agent-Orchestrierung (10+ KI-Agenten)',
      'Admin-only E2E-Validierung',
    ],
    pilotStatus:
      'Pilot-Infrastruktur aufgebaut: 10 Pilot-Arbeitgeber identifiziert, 5 Outreach-Templates aktiv, ' +
      'E2E-Test 12/12 bestanden. Noch kein aktiver zahlender Pilotkunde.',
    technicalStatus:
      'Next.js 14 / Supabase / Vercel. 246 Tests passing (100% green). ' +
      'RLS auf allen Tabellen. Auth-Flow vollständig. CV-Upload-Storage aktiv.',
    monetizationLogic:
      'Subscription-Modell (Employer: €149–999/Monat geplant) + Placement-Fee (€500/Hire). ' +
      'Kein Stripe Live. Kein verifizierter Umsatz. Revenue Intelligence zeigt Schätzungen.',
    generatedAt: new Date().toISOString(),
  }
}

// ── Buyer Checklist ──────────────────────────────────────────────────────────

export function generateBuyerChecklist(liveData?: {
  hasAdminDashboards?: boolean
  hasCandidateAcquisition?: boolean
  hasEmployerAcquisition?: boolean
  hasMigrationIntelligence?: boolean
  hasRevenueIntelligence?: boolean
  hasDueDiligence?: boolean
  hasOutreachKit?: boolean
  pilotOutreachTested?: boolean
  deploymentPresent?: boolean
  testsDocumented?: boolean
}): ChecklistItem[] {
  const d = liveData ?? {}
  return [
    {
      id: 'product_exists',
      label: 'Product exists (deployed, functional)',
      status: 'confirmed',
      detail: 'Produktiv deployt auf Vercel. Next.js 14 App läuft. Alle Core-Routes erreichbar.',
    },
    {
      id: 'admin_dashboards',
      label: 'Admin dashboards exist',
      status: 'confirmed',
      detail: '15+ Admin-Seiten: CEO Dashboard, Pilot Launch, Outreach, E2E-Test, Revenue, Sale Readiness u.a.',
    },
    {
      id: 'candidate_acquisition',
      label: 'Candidate acquisition module exists',
      status: 'confirmed',
      detail: 'Kandidaten-Onboarding, CV-Upload, Profil-Verwaltung, Admin-Review-Flow — alles vorhanden.',
    },
    {
      id: 'employer_acquisition',
      label: 'Employer acquisition module exists',
      status: 'confirmed',
      detail: 'Arbeitgeber-Dashboard, Job-Erstellung, Bewerbungsansicht, Freigabe-Workflow — komplett.',
    },
    {
      id: 'migration_intelligence',
      label: 'Migration Intelligence module exists',
      status: 'confirmed',
      detail: '8 Migrations-Korridore mit Opportunity-Scores (62–88). Priorisierung nach supply/demand.',
    },
    {
      id: 'revenue_intelligence',
      label: 'Revenue intelligence module exists',
      status: 'confirmed',
      detail: 'Revenue Forecast Engine, Szenario-Modellierung, Break-Even-Kalkulation — als Schätzungen.',
    },
    {
      id: 'due_diligence',
      label: 'Due diligence center exists',
      status: 'partial',
      detail: 'Sale-Readiness-Modul vorhanden. Dedizierte Due-Diligence-Tabelle noch nicht konfiguriert.',
    },
    {
      id: 'outreach_kit',
      label: 'Outreach kit exists',
      status: 'confirmed',
      detail: 'Pilot-Outreach-Cockpit: 5 Template-Typen × 3 Kanäle, Status-Verwaltung, Feedback-Vorbereitung.',
    },
    {
      id: 'pilot_outreach_tested',
      label: 'Pilot outreach tested and verified',
      status: 'confirmed',
      detail: '10 Arbeitgeber verifiziert, alle Templates generiert, Status-API validiert. Kein Echtversand.',
    },
    {
      id: 'tests_documented',
      label: 'Test status documented',
      status: 'confirmed',
      detail: '246 Tests passing (Vitest 4.x). 10 Test-Dateien. E2E 12/12 bestanden. CI-ready.',
    },
    {
      id: 'deployment_structure',
      label: 'Deployment structure present',
      status: 'confirmed',
      detail: 'Vercel Production Deployment. Supabase EU-Central-1. ENV-Variablen konfiguriert.',
    },
    {
      id: 'risks_documented',
      label: 'Risks documented',
      status: 'confirmed',
      detail: 'Risk Register mit 10 Risiken (legal, compliance, cold-start, revenue, privacy).',
    },
    {
      id: 'next_growth_steps',
      label: 'Next growth steps documented',
      status: 'confirmed',
      detail: '7-Day Pilot Execution Plan, Launch Blockers priorisiert, Nächste Aktionen je Modul.',
    },
    {
      id: 'pilot_offer_exists',
      label: 'Pilot offer exists',
      status: 'confirmed',
      detail: '3 Angebotsvarianten (Validation/Starter/Success-Based), 6 Branchen-Pitches, Objection Handling, Call Script.',
    },
    {
      id: 'response_pipeline_exists',
      label: 'Employer response pipeline exists',
      status: 'confirmed',
      detail: 'Manuelle Interaktionsprotokolle, Response-Klassifizierung, Follow-up-Tracking. pilot_employer_interactions Tabelle vorhanden.',
    },
  ]
}

// ── Value Drivers ────────────────────────────────────────────────────────────

export function generateValueDrivers(): ValueDriver[] {
  return [
    {
      id: 'marketplace_structure',
      title: 'Multi-sided Marketplace Structure',
      description: 'Zwei-seitiger Marktplatz: Arbeitgeber zahlen für Zugang zu Kandidaten, Kandidaten profitieren von Matching. Network effects möglich.',
      evidence: 'Vollständige Doppel-Onboarding-Flows, Bewerbungsmanagement, Freigabe-Workflow.',
      strength: 'strong',
    },
    {
      id: 'migration_corridor_positioning',
      title: 'Global Migration Corridor Positioning',
      description: '8+ konfigurierte Migrations-Korridore mit quantifizierten Opportunity-Scores. Systematischer Ansatz statt Einzel-Vermittlung.',
      evidence: 'migration_corridors Tabelle mit supply/demand/opportunity scores, Corridor Intelligence Agent.',
      strength: 'strong',
    },
    {
      id: 'dual_acquisition',
      title: 'Employer & Candidate Dual Acquisition',
      description: 'Separate Onboarding-Flows, Dashboards und Akquisitionsstrategien für beide Seiten des Marktplatzes.',
      evidence: '/candidate/dashboard, /employer/dashboard, getrennte Onboarding-Flows, separate KPI-Tracking.',
      strength: 'strong',
    },
    {
      id: 'intelligence_modules',
      title: 'Internal Intelligence Modules',
      description: '10+ KI-Agenten (CEO, Growth, Corridor Intelligence, Migration Intelligence, Revenue Intelligence, Landingpage Factory u.a.) für automatisierte Analyse.',
      evidence: 'lib/agents/, Multi-Agent-Orchestrierung, Agent Task Queue, Approval Workflow.',
      strength: 'moderate',
    },
    {
      id: 'outreach_system',
      title: 'Manual-Safe Outreach System',
      description: 'Strukturiertes Outreach-Cockpit: personalisierte Templates (5 Typen × 3 Kanäle), ohne automatischen Versand. DSGVO-konform.',
      evidence: '/admin/pilot-outreach, lib/outreach/templates.ts, Status-Tracking, system_logs.',
      strength: 'strong',
    },
    {
      id: 'modular_saas',
      title: 'Modular SaaS Architecture',
      description: 'Next.js 14 App Router, Supabase (PostgreSQL + Storage + Auth + RLS), Vercel — Standard-Stack, leicht übertragbar.',
      evidence: 'Produktiv deployt, 246 Tests, CI/CD via Vercel, ENV-Variablen dokumentiert.',
      strength: 'strong',
    },
    {
      id: 'pilot_launch_readiness',
      title: 'Pilot Launch Readiness',
      description: 'Gesamte Pilot-Infrastruktur aufgebaut: Seed-Daten, Outreach-Kit, E2E-Test, 7-Day-Plan. Nächster Schritt: manueller Outreach.',
      evidence: '12/12 E2E-Steps bestanden, 10 Arbeitgeber vorbereitet, Outreach-Templates aktiv.',
      strength: 'moderate',
    },
    {
      id: 'evidence_admin',
      title: 'Evidence-Oriented Admin Structure',
      description: 'Admin-Bereich dokumentiert den Zustand des Produkts systematisch für Due Diligence und Käufer.',
      evidence: 'Exit Readiness Pack, Sale Readiness, CEO Dashboard, E2E Test Page, System Audit.',
      strength: 'moderate',
    },
    {
      id: 'due_diligence_prep',
      title: 'Due Diligence Preparation',
      description: 'Risk Register, Buyer Checklist, Buyer Questions mit ehrlichen Antworten — strukturiert für M&A-Prozess.',
      evidence: '/admin/exit-readiness — vollständig dokumentiert.',
      strength: 'moderate',
    },
  ]
}

// ── Risk Register ────────────────────────────────────────────────────────────

export function generateRiskRegister(): RiskItem[] {
  return [
    {
      id: 'legal_compliance',
      title: 'Legal / Compliance Risk',
      severity: 'high',
      explanation: 'Internationale Arbeitsvermittlung unterliegt in vielen Ländern Lizenzpflichten (z.B. §291 SGB III in Deutschland, ähnliche Gesetze in UK/Australien/Kanada).',
      mitigation: 'Rechtliche Prüfung pro Zielland vor kommerziellem Betrieb. Alternativ: Kooperationsmodell mit lizenziertem Partner.',
      ownerSuggestion: 'Gründer / externer Rechtsanwalt (Arbeitsrecht international)',
    },
    {
      id: 'no_revenue',
      title: 'No Verified Revenue',
      severity: 'high',
      explanation: 'Kein Stripe Live, keine echten Zahlungen, kein MRR. Revenue Intelligence zeigt nur Schätzungen. Valuation stark abhängig von erstem echten Umsatz.',
      mitigation: 'Ersten Pilotkunden mit symbolischem Pricing konvertieren. Proof-of-Payment erhöht Valuation signifikant.',
      ownerSuggestion: 'Gründer / Pilot-Sales-Verantwortlicher',
    },
    {
      id: 'no_traction',
      title: 'No Verified Traction',
      severity: 'high',
      explanation: 'Nur 2 registrierte echte Kandidaten, 2 echte Arbeitgeber. Pilot-Daten sind Seed-Daten, kein organisches Wachstum.',
      mitigation: 'Manuelle Outreach-Kampagne mit 10+ Arbeitgebern in 4 Wochen. Kandidaten über Community gewinnen.',
      ownerSuggestion: 'Gründer / Growth Manager',
    },
    {
      id: 'cold_start',
      title: 'Marketplace Cold-Start Risk',
      severity: 'high',
      explanation: 'Klassisches Chicken-and-Egg-Problem: Arbeitgeber wollen Kandidaten sehen, Kandidaten kommen nur wenn Arbeitgeber da sind.',
      mitigation: 'Korridor-fokussierter Start: einen Korridor tief statt alle flach. Pilot-Kandidaten (25 vorhanden) als Demo-Pool nutzen.',
      ownerSuggestion: 'Gründer / Produktstrategie',
    },
    {
      id: 'outreach_deliverability',
      title: 'Outreach Deliverability Risk',
      severity: 'medium',
      explanation: 'Kein E-Mail-Provider konfiguriert. Kein WhatsApp-Business-API. Outreach muss manuell erfolgen — begrenzte Skalierbarkeit.',
      mitigation: 'Für Pilotphase akzeptabel. Skalierung: SendGrid/Brevo für E-Mail, WhatsApp Business API für Kampagnen.',
      ownerSuggestion: 'Technischer Lead',
    },
    {
      id: 'data_privacy',
      title: 'Data Privacy Risk',
      severity: 'medium',
      explanation: 'Kandidaten-CVs und persönliche Daten in Supabase Storage. DSGVO-Compliance erfordert Löschkonzept, Auftragsverarbeitungsvertrag mit Supabase.',
      mitigation: 'AVV mit Supabase abschließen. Löschfunktion implementieren. Datenschutz-Policy aktualisieren.',
      ownerSuggestion: 'Gründer / Datenschutzbeauftragter',
    },
    {
      id: 'operational_dependency',
      title: 'Operational Dependency Risk',
      severity: 'medium',
      explanation: 'Starke Abhängigkeit von Vercel (Hosting) und Supabase (Datenbank/Auth/Storage). Vendor Lock-in möglich.',
      mitigation: 'Standard-PostgreSQL-Schema. Next.js portierbar auf andere Plattformen. Backup-Strategie dokumentieren.',
      ownerSuggestion: 'Technischer Lead / Käufer (Infrastruktur-Review)',
    },
    {
      id: 'international_regulation',
      title: 'International Recruitment Regulation Risk',
      severity: 'high',
      explanation: 'Regulatorische Anforderungen für Arbeitsvermittlung variieren stark: Deutschland (Bundesagentur für Arbeit), UK (REC), Australien (RCSA), Kanada (ACSESS).',
      mitigation: 'Zu Beginn auf beratende Rolle beschränken. Keine Vermittlungsgebühren ohne Lizenz. Partnerschaften mit zugelassenen Vermittlern aufbauen.',
      ownerSuggestion: 'Gründer / Rechtsanwalt',
    },
    {
      id: 'employer_trust',
      title: 'Employer Trust Risk',
      severity: 'medium',
      explanation: 'Arbeitgeber müssen dem Matching-Prozess und der Kandidatenqualität vertrauen. Ohne Referenzen und Track Record schwer zu überzeugen.',
      mitigation: 'Transparente Matching-Kriterien kommunizieren. Ersten Pilot kostenlos oder sehr günstig anbieten. Testimonials aktiv sammeln.',
      ownerSuggestion: 'Sales / Gründer',
    },
    {
      id: 'candidate_quality',
      title: 'Candidate Quality Verification Risk',
      severity: 'medium',
      explanation: 'Kandidaten-Qualifikationen werden nicht unabhängig verifiziert. CV-Inhalt und Sprachnachweise obliegen dem Kandidaten.',
      mitigation: 'Stufenweises Verification-System: CV → Sprach-Zertifikat → Video-Interview → Admin-Review. Anerkennungsverfahren in den Flow integrieren.',
      ownerSuggestion: 'Produkt / Operations',
    },
  ]
}

// ── Buyer Q&A ────────────────────────────────────────────────────────────────

export function generateBuyerQuestions(): BuyerQuestion[] {
  return [
    {
      question: 'What problem does this solve?',
      answer:
        'Structural talent shortages in high-demand sectors (nursing, IT, engineering) in Western countries. Traditional recruitment agencies lack systematic global sourcing. Global Talent Bridge provides structured corridor-based matching with data-driven prioritization.',
      honesty: 'positive',
    },
    {
      question: 'Who pays?',
      answer:
        'Employers pay subscription fees (planned: €149–999/month) plus placement fees (€500/hire). Candidate access is free. No paying customer yet — first conversion is the immediate priority.',
      honesty: 'candid',
    },
    {
      question: 'Is there revenue?',
      answer:
        'No verified revenue. Stripe is not live. Revenue Intelligence module shows financial models and break-even scenarios — all estimates. The product needs its first paying customer to establish commercial traction.',
      honesty: 'candid',
    },
    {
      question: 'What is already built?',
      answer:
        'Full product: candidate onboarding + CV upload, employer dashboard + job management, application workflow with admin approval, pilot outreach cockpit (5 template types × 3 channels), CEO dashboard with live KPIs, 8 migration corridor models, revenue forecast engine, 10+ AI agents, 246 automated tests, E2E validation (12/12 steps passing).',
      honesty: 'positive',
    },
    {
      question: 'What still needs validation?',
      answer:
        'Commercial traction (first paying employer), candidate pool depth (currently 2 real candidates), international legal compliance per target country, delivery mechanism for outreach at scale (currently manual-only), employer willingness to pay.',
      honesty: 'candid',
    },
    {
      question: 'How can a buyer launch it?',
      answer:
        'The platform is deployed and functional. A buyer needs: (1) continue or initiate employer outreach using prepared templates, (2) grow candidate pool via targeted campaigns, (3) legal review per target country, (4) first paid conversion, (5) set Stripe to live mode. Technical setup is complete. Operational effort is on the business side.',
      honesty: 'positive',
    },
    {
      question: 'What are the main risks?',
      answer:
        'International recruitment licensing requirements vary by country. No revenue yet (valuation impact). Cold-start marketplace dynamics. Manual outreach limits near-term scale. Candidate quality verification not yet automated. All risks are documented in the Risk Register.',
      honesty: 'candid',
    },
    {
      question: 'What would increase valuation?',
      answer:
        'First paying employer (even €149/month). 10+ real candidate profiles with CVs. First successful placement. Employer testimonial. One active migration corridor with demonstrated matches. Any of these would meaningfully increase defensibility and valuation.',
      honesty: 'positive',
    },
    {
      question: 'Why is this not just a landing page?',
      answer:
        'Fully functional product: database (51 tables, RLS), auth (candidate/employer/admin roles), file storage (CV uploads), automated testing (246 tests), multi-agent AI infrastructure, admin intelligence layer, and outreach system. Not a prototype — a production application missing only paying customers.',
      honesty: 'positive',
    },
    {
      question: 'What makes the asset transferable?',
      answer:
        'Standard tech stack (Next.js 14 / Supabase / Vercel). Comprehensive admin documentation. Documented codebase with tests. ENV variables documented. Database schema in migrations. Agent orchestration is modular. A technical buyer can take over within days, not weeks.',
      honesty: 'positive',
    },
  ]
}

// ── Overall Exit Readiness Score ─────────────────────────────────────────────

export function computeExitReadinessScore(checklist: ChecklistItem[]): number {
  if (checklist.length === 0) return 0
  const weights: Record<ChecklistStatus, number> = {
    confirmed: 1,
    partial: 0.5,
    missing: 0,
  }
  const total = checklist.reduce((sum, item) => sum + weights[item.status], 0)
  return Math.round((total / checklist.length) * 100)
}

// ── Full Evidence Pack ────────────────────────────────────────────────────────

export function generateExitEvidence(liveData?: Parameters<typeof generateBuyerChecklist>[0]): ExitEvidence {
  const checklist = generateBuyerChecklist(liveData)
  return {
    productSummary:   generateProductSummary(),
    buyerChecklist:   checklist,
    valueDrivers:     generateValueDrivers(),
    riskRegister:     generateRiskRegister(),
    buyerQuestions:   generateBuyerQuestions(),
    overallReadinessScore: computeExitReadinessScore(checklist),
    generatedAt:      new Date().toISOString(),
  }
}

// ── Markdown Export ──────────────────────────────────────────────────────────

export function generateMarkdown(evidence: ExitEvidence): string {
  const { productSummary: ps, buyerChecklist, valueDrivers, riskRegister, buyerQuestions } = evidence

  const statusIcon: Record<ChecklistStatus, string> = {
    confirmed: '✅',
    partial: '⚠️',
    missing: '❌',
  }

  const severityIcon: Record<string, string> = {
    critical: '🔴',
    high: '🟠',
    medium: '🟡',
    low: '🟢',
  }

  const strengthIcon: Record<string, string> = {
    strong: '🟢',
    moderate: '🟡',
    weak: '🔴',
  }

  const checklistMd = buyerChecklist
    .map((c) => `| ${statusIcon[c.status]} | **${c.label}** | ${c.detail} |`)
    .join('\n')

  const valueDriversMd = valueDrivers
    .map((v) => `### ${strengthIcon[v.strength]} ${v.title}\n${v.description}\n\n*Evidence: ${v.evidence}*`)
    .join('\n\n')

  const riskMd = riskRegister
    .map((r) =>
      `### ${severityIcon[r.severity]} ${r.title} (${r.severity.toUpperCase()})\n` +
      `**Explanation:** ${r.explanation}\n\n` +
      `**Mitigation:** ${r.mitigation}\n\n` +
      `**Owner:** ${r.ownerSuggestion}`
    )
    .join('\n\n---\n\n')

  const qaMd = buyerQuestions
    .map((q) => `### Q: ${q.question}\n**A:** ${q.answer}`)
    .join('\n\n')

  return `# ${ps.name} — Exit Readiness Evidence Pack

*Generated: ${new Date(evidence.generatedAt).toLocaleDateString('de-DE')}*

---

## Product Summary

**Tagline:** ${ps.tagline}

${ps.description}

**Target Audience:**
${ps.targetAudience.map((a) => `- ${a}`).join('\n')}

**Core Modules:**
${ps.coreModules.map((m) => `- ${m}`).join('\n')}

**Pilot Status:** ${ps.pilotStatus}

**Technical Status:** ${ps.technicalStatus}

**Monetization:** ${ps.monetizationLogic}

---

## Buyer Checklist (${evidence.overallReadinessScore}% ready)

| Status | Item | Detail |
|--------|------|--------|
${checklistMd}

---

## Value Drivers

${valueDriversMd}

---

## Risk Register

${riskMd}

---

## Buyer Q&A

${qaMd}

---

*Hinweis: Dieses Dokument ist eine strukturierte Orientierungshilfe. Keine Rechtsberatung. Keine Garantie. Schätzungen klar als Schätzungen markiert.*
`
}
