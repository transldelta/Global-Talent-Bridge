/**
 * outreach.templates.test.ts
 *
 * Unit-Tests für lib/outreach/templates.ts
 * Testet Template-Generierung, Korridor-Inferenz, Employer-Type-Erkennung
 */
import { describe, it, expect } from 'vitest'
import {
  getEmployerType,
  inferCorridor,
  generateTemplates,
  PILOT_STATUS_LABELS,
  FEEDBACK_STATE_LABELS,
  FEEDBACK_STATE_NOTES,
  type EmployerContext,
} from '@/lib/outreach/templates'

// ── getEmployerType ──────────────────────────────────────────────────────────

describe('getEmployerType — Branchenklassifikation', () => {
  it('erkennt Pflegeheim', () => {
    expect(getEmployerType('Pflegeheim')).toBe('Pflegeheim')
    expect(getEmployerType('Altenpflege')).toBe('Pflegeheim')
    expect(getEmployerType('Nursing Home')).toBe('Pflegeheim')
    expect(getEmployerType('Seniorenheim')).toBe('Pflegeheim')
    expect(getEmployerType('Care')).toBe('Pflegeheim')
  })

  it('erkennt Klinik', () => {
    expect(getEmployerType('Klinik')).toBe('Klinik')
    expect(getEmployerType('Krankenhaus')).toBe('Klinik')
    expect(getEmployerType('Hospital')).toBe('Klinik')
    expect(getEmployerType('Klinisches Institut')).toBe('Klinik')
  })

  it('erkennt IT-Unternehmen', () => {
    expect(getEmployerType('IT')).toBe('IT-Unternehmen')
    expect(getEmployerType('Software')).toBe('IT-Unternehmen')
    expect(getEmployerType('Tech')).toBe('IT-Unternehmen')
    expect(getEmployerType('Tech-Startup')).toBe('IT-Unternehmen')
  })

  it('erkennt Personalvermittler', () => {
    expect(getEmployerType('Recruiter')).toBe('Personalvermittler')
    expect(getEmployerType('Personalvermittlung')).toBe('Personalvermittler')
    expect(getEmployerType('Headhunter')).toBe('Personalvermittler')
    expect(getEmployerType('HR-Agentur')).toBe('Personalvermittler')
  })

  it('erkennt Sprachschule', () => {
    expect(getEmployerType('Sprachschule')).toBe('Sprachschule')
    expect(getEmployerType('Language School')).toBe('Sprachschule')
    expect(getEmployerType('Bildungsinstitut')).toBe('Sprachschule')
    expect(getEmployerType('Schule')).toBe('Sprachschule')
  })

  it('gibt Sonstige für unbekannte Industrie', () => {
    expect(getEmployerType('Bäckerei')).toBe('Sonstige')
    expect(getEmployerType('')).toBe('Sonstige')
    expect(getEmployerType(null)).toBe('Sonstige')
  })
})

// ── inferCorridor ────────────────────────────────────────────────────────────

describe('inferCorridor — Korridor-Inferenz', () => {
  it('Philippinen + Pflege → spezifischer Korridor', () => {
    const c = inferCorridor('Philippinen', 'Pflegeheim')
    expect(c).toBe('Philippinen → Deutschland (Pflege)')
  })

  it('Vietnam + Care → Vietnam-Korridor', () => {
    const c = inferCorridor('Vietnam', 'Care')
    expect(c).toBe('Vietnam → Deutschland (Pflege)')
  })

  it('Indien + IT → EU-IT-Korridor', () => {
    const c = inferCorridor('Indien', 'IT')
    expect(c).toBe('Indien → EU (IT / Software)')
  })

  it('Ukraine + Software → DE-IT-Korridor', () => {
    const c = inferCorridor('Ukraine', 'Software')
    expect(c).toBe('Ukraine → Deutschland (IT)')
  })

  it('Sprache → Sprachausbildungs-Korridor', () => {
    const c = inferCorridor('Deutschland', 'Sprachschule')
    expect(c).toBe('Mehrere Länder → Deutschland (Sprachausbildung)')
  })

  it('Recruiter/HR → Talentpool-Korridor', () => {
    const c = inferCorridor('Deutschland', 'Recruiter')
    expect(c).toBe('Globaler Talentpool → Ihre Kunden')
  })

  it('Unbekannte Kombination → Fallback mit Land', () => {
    const c = inferCorridor('Brasilien', 'Bäckerei')
    expect(c).toBe('Brasilien → Deutschland')
  })
})

// ── generateTemplates ────────────────────────────────────────────────────────

describe('generateTemplates — Template-Generierung', () => {
  const ctx: EmployerContext = {
    companyName: 'Seniorenheim Sonnenschein',
    contactName: 'Marta Schmidt',
    country: 'Philippinen',
    industry: 'Pflegeheim',
    corridor: 'Philippinen → Deutschland (Pflege)',
  }

  it('gibt alle 3 Kanäle zurück', () => {
    const t = generateTemplates(ctx)
    expect(t.email).toBeDefined()
    expect(t.whatsapp).toBeDefined()
    expect(t.linkedin).toBeDefined()
  })

  it('erkannte Type ist Pflegeheim', () => {
    const t = generateTemplates(ctx)
    expect(t.type).toBe('Pflegeheim')
  })

  it('E-Mail hat Betreff', () => {
    const t = generateTemplates(ctx)
    expect(t.email.subject).toBeDefined()
    expect(t.email.subject!.length).toBeGreaterThan(10)
  })

  it('E-Mail enthält Firmenname', () => {
    const t = generateTemplates(ctx)
    expect(t.email.subject).toContain('Seniorenheim Sonnenschein')
  })

  it('E-Mail enthält Korridor', () => {
    const t = generateTemplates(ctx)
    expect(t.email.body).toContain('Philippinen')
  })

  it('WhatsApp enthält Firmennamen', () => {
    const t = generateTemplates(ctx)
    expect(t.whatsapp.body).toContain('Seniorenheim Sonnenschein')
  })

  it('LinkedIn enthält Firmennamen', () => {
    const t = generateTemplates(ctx)
    expect(t.linkedin.body).toContain('Seniorenheim Sonnenschein')
  })

  it('alle Kanäle haben nicht-leeren Body', () => {
    const t = generateTemplates(ctx)
    expect(t.email.body.length).toBeGreaterThan(50)
    expect(t.whatsapp.body.length).toBeGreaterThan(20)
    expect(t.linkedin.body.length).toBeGreaterThan(20)
  })

  it('E-Mail enthält neutrale Signatur "Global Talent Bridge Team"', () => {
    const t = generateTemplates(ctx)
    expect(t.email.body).toContain('Global Talent Bridge Team')
    expect(t.email.body).not.toContain('[Ihr Name]')
  })

  it('Kanäle sind korrekt gesetzt', () => {
    const t = generateTemplates(ctx)
    expect(t.email.channel).toBe('email')
    expect(t.whatsapp.channel).toBe('whatsapp')
    expect(t.linkedin.channel).toBe('linkedin')
  })
})

describe('generateTemplates — Klinik', () => {
  const ctx: EmployerContext = {
    companyName: 'Universitätsklinikum München',
    contactName: null,
    country: 'Vietnam',
    industry: 'Klinik',
    corridor: 'Vietnam → Deutschland (Pflege)',
  }

  it('erkannte Type ist Klinik', () => {
    expect(generateTemplates(ctx).type).toBe('Klinik')
  })

  it('funktioniert ohne Kontaktname (null)', () => {
    const t = generateTemplates(ctx)
    expect(t.email.body).toContain('Damen und Herren')
  })
})

describe('generateTemplates — IT', () => {
  const ctx: EmployerContext = {
    companyName: 'Tech AG',
    contactName: 'Max Muster',
    country: 'Indien',
    industry: 'Software',
    corridor: 'Indien → EU (IT / Software)',
  }

  it('erkannte Type ist IT-Unternehmen', () => {
    expect(generateTemplates(ctx).type).toBe('IT-Unternehmen')
  })

  it('E-Mail-Betreff enthält IT-Bezug', () => {
    const t = generateTemplates(ctx)
    expect(t.email.subject).toBeDefined()
  })
})

describe('generateTemplates — Personalvermittler', () => {
  const ctx: EmployerContext = {
    companyName: 'Recruit Pro GmbH',
    contactName: 'Anna Meier',
    country: 'Deutschland',
    industry: 'Personalvermittlung',
    corridor: 'Globaler Talentpool → Ihre Kunden',
  }

  it('erkannte Type ist Personalvermittler', () => {
    expect(generateTemplates(ctx).type).toBe('Personalvermittler')
  })

  it('E-Mail erwähnt Provisionsmodell', () => {
    const t = generateTemplates(ctx)
    expect(t.email.body.toLowerCase()).toContain('provision')
  })
})

describe('generateTemplates — Sprachschule', () => {
  const ctx: EmployerContext = {
    companyName: 'Lingua Institut',
    contactName: 'Dr. Weber',
    country: 'Deutschland',
    industry: 'Sprachschule',
    corridor: 'Mehrere Länder → Deutschland (Sprachausbildung)',
  }

  it('erkannte Type ist Sprachschule', () => {
    expect(generateTemplates(ctx).type).toBe('Sprachschule')
  })

  it('E-Mail erwähnt B1/B2', () => {
    const t = generateTemplates(ctx)
    expect(t.email.body).toContain('B1/B2')
  })
})

// ── PILOT_STATUS_LABELS ──────────────────────────────────────────────────────

describe('PILOT_STATUS_LABELS — Status-Konfiguration', () => {
  it('enthält alle 7 gültigen Status', () => {
    const keys = Object.keys(PILOT_STATUS_LABELS)
    expect(keys).toContain('identified')
    expect(keys).toContain('contacted_manual')
    expect(keys).toContain('interested')
    expect(keys).toContain('demo_scheduled')
    expect(keys).toContain('onboarding')
    expect(keys).toContain('active_pilot')
    expect(keys).toContain('rejected')
    expect(keys).toHaveLength(7)
  })

  it('jeder Status hat label und color', () => {
    for (const [, meta] of Object.entries(PILOT_STATUS_LABELS)) {
      expect(meta.label).toBeDefined()
      expect(meta.color).toBeDefined()
      expect(meta.label.length).toBeGreaterThan(0)
      expect(meta.color).toContain('text-')
    }
  })

  it('active_pilot hat grüne Farbe', () => {
    expect(PILOT_STATUS_LABELS['active_pilot'].color).toContain('green')
  })

  it('rejected hat rote Farbe', () => {
    expect(PILOT_STATUS_LABELS['rejected'].color).toContain('red')
  })
})

// ── FEEDBACK_STATE_LABELS ────────────────────────────────────────────────────

describe('FEEDBACK_STATE_LABELS — Feedback-Konfiguration', () => {
  it('enthält alle 5 Feedback-Zustände', () => {
    expect(FEEDBACK_STATE_LABELS['interesse']).toBeDefined()
    expect(FEEDBACK_STATE_LABELS['kein_interesse']).toBeDefined()
    expect(FEEDBACK_STATE_LABELS['rueckruf']).toBeDefined()
    expect(FEEDBACK_STATE_LABELS['demo']).toBeDefined()
    expect(FEEDBACK_STATE_LABELS['einwand']).toBeDefined()
  })

  it('jeder Zustand hat FEEDBACK_STATE_NOTES', () => {
    for (const key of Object.keys(FEEDBACK_STATE_LABELS)) {
      const note = FEEDBACK_STATE_NOTES[key as keyof typeof FEEDBACK_STATE_NOTES]
      expect(note).toBeDefined()
      expect(note.length).toBeGreaterThan(10)
    }
  })

  it('interesse enthält Interesse-Emoji', () => {
    expect(FEEDBACK_STATE_LABELS['interesse']).toContain('✅')
  })

  it('demo enthält Demo-Emoji', () => {
    expect(FEEDBACK_STATE_LABELS['demo']).toContain('🎯')
  })

  it('kein_interesse enthält Ablehnung-Emoji', () => {
    expect(FEEDBACK_STATE_LABELS['kein_interesse']).toContain('❌')
  })
})

// ── Edge Cases ───────────────────────────────────────────────────────────────

describe('Edge Cases', () => {
  it('generateTemplates mit leerer Industry → Sonstige Type', () => {
    const ctx: EmployerContext = {
      companyName: 'Unbekannt GmbH',
      contactName: null,
      country: 'Österreich',
      industry: null,
      corridor: 'Österreich → Deutschland',
    }
    const t = generateTemplates(ctx)
    expect(t.type).toBe('Sonstige')
    expect(t.email.body).toBeDefined()
    expect(t.whatsapp.body).toBeDefined()
    expect(t.linkedin.body).toBeDefined()
  })

  it('E-Mail-Body enthält keine undefined-Strings', () => {
    const ctx: EmployerContext = {
      companyName: 'Test GmbH',
      contactName: null,
      country: 'Polen',
      industry: null,
      corridor: 'Polen → Deutschland',
    }
    const t = generateTemplates(ctx)
    expect(t.email.body).not.toContain('undefined')
    expect(t.whatsapp.body).not.toContain('undefined')
    expect(t.linkedin.body).not.toContain('undefined')
  })

  it('Korridor wird in generateTemplates gespeichert', () => {
    const ctx: EmployerContext = {
      companyName: 'Test AG',
      contactName: 'Hans',
      country: 'Philippinen',
      industry: 'Pflege',
      corridor: 'Philippinen → Deutschland (Pflege)',
    }
    const t = generateTemplates(ctx)
    expect(t.corridor).toBe('Philippinen → Deutschland (Pflege)')
  })
})

// ── Sonstige-Template-Korrektheit (Regression: kein Pflegeheim-Fallback) ─────

describe('Sonstige — generisches Template (kein Pflegeheim-Fallback)', () => {
  const sonstigeCtx = (industry: string | null): EmployerContext => ({
    companyName: 'Hospitality Group Wien',
    contactName: 'K. Fischer',
    country: 'Österreich',
    industry,
    corridor: 'Österreich → Deutschland',
  })

  it('Gastronomie → Sonstige', () => {
    expect(generateTemplates(sonstigeCtx('Gastronomie')).type).toBe('Sonstige')
  })

  it('Bau → Sonstige', () => {
    expect(generateTemplates(sonstigeCtx('Bau')).type).toBe('Sonstige')
  })

  it('Sonstige E-Mail enthält NICHT "Pflegekräfte"', () => {
    const t = generateTemplates(sonstigeCtx('Gastronomie'))
    expect(t.email.body).not.toContain('Pflegekräfte')
  })

  it('Sonstige E-Mail enthält NICHT "Pflegeeinrichtungen"', () => {
    const t = generateTemplates(sonstigeCtx('Bau'))
    expect(t.email.body).not.toContain('Pflegeeinrichtungen')
  })

  it('Sonstige E-Mail enthält Firmennamen', () => {
    const t = generateTemplates(sonstigeCtx('Gastronomie'))
    expect(t.email.body).toContain('Hospitality Group Wien')
  })

  it('Sonstige E-Mail hat Betreff', () => {
    const t = generateTemplates(sonstigeCtx('Gastronomie'))
    expect(t.email.subject).toBeDefined()
    expect(t.email.subject!.length).toBeGreaterThan(10)
  })

  it('Sonstige E-Mail enthält generische Formulierung "Fachkräfte"', () => {
    const t = generateTemplates(sonstigeCtx('Gastronomie'))
    expect(t.email.body.toLowerCase()).toContain('fachkräfte')
  })

  it('Sonstige E-Mail enthält neutrale Signatur "Global Talent Bridge Team"', () => {
    const t = generateTemplates(sonstigeCtx('Gastronomie'))
    expect(t.email.body).toContain('Global Talent Bridge Team')
    expect(t.email.body).not.toContain('[Ihr Name]')
  })

  it('Sonstige WhatsApp ist generisch (ohne Pflegebezug)', () => {
    const t = generateTemplates(sonstigeCtx('Gastronomie'))
    expect(t.whatsapp.body).not.toContain('Pflegekräfte')
    expect(t.whatsapp.body).not.toContain('Pflegeeinrichtungen')
  })

  it('alle 3 Kanäle haben Body für Sonstige', () => {
    const t = generateTemplates(sonstigeCtx('Bau'))
    expect(t.email.body.length).toBeGreaterThan(50)
    expect(t.whatsapp.body.length).toBeGreaterThan(20)
    expect(t.linkedin.body.length).toBeGreaterThan(20)
  })
})

// ── Realdata-Simulation — die 10 DB-Arbeitgeber ─────────────────────────────

describe('Realdata-Simulation — Seed-Arbeitgeber aus DB', () => {
  const dbEmployers = [
    { company: 'Sydney CareFirst Services', country: 'Australia', industry: 'Care' },
    { company: 'NorthStar Tech Canada Inc.', country: 'Canada', industry: 'IT' },
    { company: 'NHS London Royal Trust', country: 'United Kingdom', industry: 'Nursing' },
    { company: 'Pflege Plus GmbH Karlsruhe', country: 'Germany', industry: 'Care' },
    { company: 'Berlin Digital Solutions GmbH', country: 'Germany', industry: 'IT' },
    { company: 'Pflege Plus GmbH', country: 'Deutschland', industry: 'Pflege' },
    { company: 'MedCare Bayern', country: 'Deutschland', industry: 'Pflege' },
    { company: 'TechRecruit Berlin', country: 'Deutschland', industry: 'IT' },
    { company: 'Hospitality Group Wien', country: 'Österreich', industry: 'Gastronomie' },
    { company: 'Bau AG Hamburg', country: 'Deutschland', industry: 'Bau' },
  ]

  it('alle 10 Arbeitgeber erzeugen valide Templates ohne Fehler', () => {
    for (const emp of dbEmployers) {
      const corridor = inferCorridor(emp.country, emp.industry)
      const ctx: EmployerContext = {
        companyName: emp.company,
        contactName: null,
        country: emp.country,
        industry: emp.industry,
        corridor,
      }
      const t = generateTemplates(ctx)
      expect(t.email.body.length).toBeGreaterThan(50)
      expect(t.whatsapp.body.length).toBeGreaterThan(10)
      expect(t.linkedin.body.length).toBeGreaterThan(10)
      expect(t.email.body).not.toContain('undefined')
      expect(t.whatsapp.body).not.toContain('undefined')
      expect(t.linkedin.body).not.toContain('undefined')
    }
  })

  it('Gastronomie und Bau erzeugen KEIN Pflegeheim-Template', () => {
    for (const emp of dbEmployers.filter((e) => ['Gastronomie', 'Bau'].includes(e.industry))) {
      const corridor = inferCorridor(emp.country, emp.industry)
      const ctx: EmployerContext = {
        companyName: emp.company,
        contactName: null,
        country: emp.country,
        industry: emp.industry,
        corridor,
      }
      const t = generateTemplates(ctx)
      expect(t.type).toBe('Sonstige')
      expect(t.email.body).not.toContain('Pflegekräfte')
      expect(t.email.body).not.toContain('Pflegeeinrichtungen')
    }
  })

  it('Pflege-Arbeitgeber erzeugen Pflegeheim-Template', () => {
    const pflegeEmps = dbEmployers.filter((e) =>
      ['Care', 'Nursing', 'Pflege'].includes(e.industry)
    )
    expect(pflegeEmps).toHaveLength(5)
    for (const emp of pflegeEmps) {
      const corridor = inferCorridor(emp.country, emp.industry)
      const ctx: EmployerContext = {
        companyName: emp.company,
        contactName: null,
        country: emp.country,
        industry: emp.industry,
        corridor,
      }
      const t = generateTemplates(ctx)
      expect(t.type).toBe('Pflegeheim')
    }
  })

  it('IT-Arbeitgeber erzeugen IT-Template', () => {
    const itEmps = dbEmployers.filter((e) => e.industry === 'IT')
    expect(itEmps).toHaveLength(3)
    for (const emp of itEmps) {
      const corridor = inferCorridor(emp.country, emp.industry)
      const ctx: EmployerContext = {
        companyName: emp.company,
        contactName: null,
        country: emp.country,
        industry: emp.industry,
        corridor,
      }
      const t = generateTemplates(ctx)
      expect(t.type).toBe('IT-Unternehmen')
    }
  })
})
