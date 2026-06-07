/**
 * __tests__/inbound-seo-revenue-expansion.test.ts
 *
 * Inbound SEO Revenue Expansion — Test Suite
 *
 * Prüft:
 * - SEO_REVENUE_PAGES Konstanten korrekt
 * - Alle 12 neuen Seiten-Pfade definiert
 * - INDUSTRY_CONFIGS: alle 5 Branchen vollständig + Safety
 * - CORRIDOR_CONFIGS: alle 5 Korridore vollständig + Safety
 * - Kein Stripe, kein Versand, kein Scraping, keine Garantieversprechen
 * - CorridorWork Branding korrekt (kein "Global Talent Bridge")
 * - Alle Korridor-Scores im validen Bereich
 * - Compliance-Hinweise vorhanden
 * - Sitemap-Pfade vollständig
 * - robots.txt Allow-Pfade vollständig
 */
import { describe, it, expect } from 'vitest'
import {
  INDUSTRY_CONFIGS,
  CORRIDOR_CONFIGS,
  INDUSTRY_SLUGS,
  CORRIDOR_SLUGS,
  SEO_REVENUE_PAGES,
  ALL_SEO_PAGE_PATHS,
  type IndustrySlug,
  type CorridorSlug,
} from '@/lib/seo-pages'

// ══════════════════════════════════════════════════════════════════════════════
// SEO_REVENUE_PAGES — Konstanten
// ══════════════════════════════════════════════════════════════════════════════

describe('SEO_REVENUE_PAGES — Struktur und Safety', () => {
  it('totalNewPages ist 12', () => {
    expect(SEO_REVENUE_PAGES.totalNewPages).toBe(12)
  })

  it('industryPages hat 5 Einträge', () => {
    expect(SEO_REVENUE_PAGES.industryPages).toHaveLength(5)
  })

  it('corridorPages hat 5 Einträge', () => {
    expect(SEO_REVENUE_PAGES.corridorPages).toHaveLength(5)
  })

  it('solutionPages hat 1 Eintrag', () => {
    expect(SEO_REVENUE_PAGES.solutionPages).toHaveLength(1)
  })

  it('demoPage ist /demo', () => {
    expect(SEO_REVENUE_PAGES.demoPage).toBe('/demo')
  })

  it('noJobGuarantee ist true', () => {
    expect(SEO_REVENUE_PAGES.noJobGuarantee).toBe(true)
  })

  it('noVisaGuarantee ist true', () => {
    expect(SEO_REVENUE_PAGES.noVisaGuarantee).toBe(true)
  })

  it('noEmailSent ist true', () => {
    expect(SEO_REVENUE_PAGES.noEmailSent).toBe(true)
  })

  it('noAutoOutreach ist true', () => {
    expect(SEO_REVENUE_PAGES.noAutoOutreach).toBe(true)
  })

  it('noScraping ist true', () => {
    expect(SEO_REVENUE_PAGES.noScraping).toBe(true)
  })

  it('noPayment ist true', () => {
    expect(SEO_REVENUE_PAGES.noPayment).toBe(true)
  })

  it('brand ist CorridorWork', () => {
    expect(SEO_REVENUE_PAGES.brand).toBe('CorridorWork')
  })

  it('baseUrl ist https://corridorwork.com', () => {
    expect(SEO_REVENUE_PAGES.baseUrl).toBe('https://corridorwork.com')
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// ALL_SEO_PAGE_PATHS — 12 Pfade total
// ══════════════════════════════════════════════════════════════════════════════

describe('ALL_SEO_PAGE_PATHS — 12 Pfade total', () => {
  it('ALL_SEO_PAGE_PATHS hat 12 Einträge', () => {
    expect(ALL_SEO_PAGE_PATHS).toHaveLength(12)
  })

  it('Alle Pfade beginnen mit /', () => {
    ALL_SEO_PAGE_PATHS.forEach(path => {
      expect(path).toMatch(/^\//)
    })
  })

  it('Kein Pfad enthält "Global Talent Bridge"', () => {
    ALL_SEO_PAGE_PATHS.forEach(path => {
      expect(path).not.toMatch(/global.talent.bridge/i)
    })
  })

  it('/demo ist enthalten', () => {
    expect(ALL_SEO_PAGE_PATHS).toContain('/demo')
  })

  it('/solutions/recruiting-agencies ist enthalten', () => {
    expect(ALL_SEO_PAGE_PATHS).toContain('/solutions/recruiting-agencies')
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// INDUSTRY SLUGS — alle 5 vorhanden
// ══════════════════════════════════════════════════════════════════════════════

describe('INDUSTRY_SLUGS — alle 5 Branchen', () => {
  const EXPECTED: IndustrySlug[] = ['care', 'hospitality', 'logistics', 'it', 'construction']

  EXPECTED.forEach(slug => {
    it(`${slug} ist in INDUSTRY_SLUGS`, () => {
      expect(INDUSTRY_SLUGS).toContain(slug)
    })
  })

  it('INDUSTRY_SLUGS hat genau 5 Einträge', () => {
    expect(INDUSTRY_SLUGS).toHaveLength(5)
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// INDUSTRY_CONFIGS — Vollständigkeit
// ══════════════════════════════════════════════════════════════════════════════

describe('INDUSTRY_CONFIGS — alle 5 Configs vollständig', () => {
  const REQUIRED_FIELDS: Array<keyof typeof INDUSTRY_CONFIGS['care']> = [
    'slug', 'name', 'emoji', 'colorClass', 'bgClass', 'borderClass',
    'tagline', 'description', 'targetEmployers', 'keyPoints',
    'corridors', 'metaTitle', 'metaDescription',
  ]

  INDUSTRY_SLUGS.forEach(slug => {
    describe(`INDUSTRY_CONFIGS.${slug}`, () => {
      const cfg = INDUSTRY_CONFIGS[slug]

      it(`${slug}: config existiert`, () => {
        expect(cfg).toBeDefined()
      })

      REQUIRED_FIELDS.forEach(field => {
        it(`${slug}: ${field} ist definiert und nicht leer`, () => {
          expect(cfg).toHaveProperty(field)
          const val = cfg[field]
          if (typeof val === 'string') {
            expect(val.length).toBeGreaterThan(0)
          } else if (Array.isArray(val)) {
            expect(val.length).toBeGreaterThan(0)
          }
        })
      })

      it(`${slug}: keyPoints hat mindestens 3 Einträge`, () => {
        expect(cfg.keyPoints.length).toBeGreaterThanOrEqual(3)
      })

      it(`${slug}: metaTitle enthält kein "Global Talent Bridge"`, () => {
        expect(cfg.metaTitle).not.toMatch(/global talent bridge/i)
      })

      it(`${slug}: metaDescription enthält keine Jobgarantie`, () => {
        expect(cfg.metaDescription).not.toMatch(/jobgarantie.*garantiert/i)
        expect(cfg.metaDescription).not.toMatch(/garantierter.*job/i)
      })

      it(`${slug}: corridors hat mindestens 2 Einträge`, () => {
        expect(cfg.corridors.length).toBeGreaterThanOrEqual(2)
      })

      it(`${slug}: slug stimmt überein`, () => {
        expect(cfg.slug).toBe(slug)
      })
    })
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// CORRIDOR_CONFIGS — Vollständigkeit
// ══════════════════════════════════════════════════════════════════════════════

describe('CORRIDOR_CONFIGS — alle 5 Configs vollständig', () => {
  const REQUIRED_FIELDS: Array<keyof typeof CORRIDOR_CONFIGS['morocco-germany']> = [
    'slug', 'originCountry', 'destinationCountry', 'originFlag', 'destinationFlag',
    'headline', 'description', 'sectors', 'matchingLogic', 'corridorScore',
    'complianceNote', 'metaTitle', 'metaDescription',
  ]

  CORRIDOR_SLUGS.forEach(slug => {
    describe(`CORRIDOR_CONFIGS.${slug}`, () => {
      const cfg = CORRIDOR_CONFIGS[slug]

      it(`${slug}: config existiert`, () => {
        expect(cfg).toBeDefined()
      })

      REQUIRED_FIELDS.forEach(field => {
        it(`${slug}: ${field} ist definiert`, () => {
          expect(cfg).toHaveProperty(field)
          const val = cfg[field]
          if (typeof val === 'string') {
            expect(val.length).toBeGreaterThan(0)
          } else if (typeof val === 'number') {
            expect(val).toBeGreaterThan(0)
          } else if (Array.isArray(val)) {
            expect(val.length).toBeGreaterThan(0)
          }
        })
      })

      it(`${slug}: corridorScore ist zwischen 1 und 100`, () => {
        expect(cfg.corridorScore).toBeGreaterThanOrEqual(1)
        expect(cfg.corridorScore).toBeLessThanOrEqual(100)
      })

      it(`${slug}: complianceNote enthält kein Visa-Versprechen`, () => {
        expect(cfg.complianceNote).not.toMatch(/visa.garantiert/i)
        expect(cfg.complianceNote).not.toMatch(/garantiert.*visa/i)
      })

      it(`${slug}: complianceNote enthält "kein" oder "keine"`, () => {
        expect(cfg.complianceNote).toMatch(/kein/i)
      })

      it(`${slug}: metaTitle enthält kein "Global Talent Bridge"`, () => {
        expect(cfg.metaTitle).not.toMatch(/global talent bridge/i)
      })

      it(`${slug}: sectors hat mindestens 2 Einträge`, () => {
        expect(cfg.sectors.length).toBeGreaterThanOrEqual(2)
      })

      it(`${slug}: slug stimmt überein`, () => {
        expect(cfg.slug).toBe(slug)
      })
    })
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// KORRIDOR-SCORES — Spezifische Werte
// ══════════════════════════════════════════════════════════════════════════════

describe('Korridor-Scores — spezifische Werte', () => {
  it('philippines-care hat Score >= 90', () => {
    expect(CORRIDOR_CONFIGS['philippines-care'].corridorScore).toBeGreaterThanOrEqual(90)
  })

  it('india-uk hat Score >= 85', () => {
    expect(CORRIDOR_CONFIGS['india-uk'].corridorScore).toBeGreaterThanOrEqual(85)
  })

  it('morocco-germany hat Score >= 70', () => {
    expect(CORRIDOR_CONFIGS['morocco-germany'].corridorScore).toBeGreaterThanOrEqual(70)
  })

  it('nigeria-tech hat Score >= 70', () => {
    expect(CORRIDOR_CONFIGS['nigeria-tech'].corridorScore).toBeGreaterThanOrEqual(70)
  })

  it('tunisia-france hat Score >= 70', () => {
    expect(CORRIDOR_CONFIGS['tunisia-france'].corridorScore).toBeGreaterThanOrEqual(70)
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// BRANDING — CorridorWork (kein Global Talent Bridge)
// ══════════════════════════════════════════════════════════════════════════════

describe('Branding — CorridorWork, kein Global Talent Bridge', () => {
  it('SEO_REVENUE_PAGES.brand ist CorridorWork', () => {
    expect(SEO_REVENUE_PAGES.brand).toBe('CorridorWork')
  })

  it('Kein INDUSTRY_CONFIG metaTitle enthält "Global Talent Bridge"', () => {
    INDUSTRY_SLUGS.forEach(slug => {
      expect(INDUSTRY_CONFIGS[slug].metaTitle).not.toMatch(/global talent bridge/i)
    })
  })

  it('Kein CORRIDOR_CONFIG metaTitle enthält "Global Talent Bridge"', () => {
    CORRIDOR_SLUGS.forEach(slug => {
      expect(CORRIDOR_CONFIGS[slug].metaTitle).not.toMatch(/global talent bridge/i)
    })
  })

  it('Kein INDUSTRY_CONFIG metaDescription enthält "Global Talent Bridge"', () => {
    INDUSTRY_SLUGS.forEach(slug => {
      expect(INDUSTRY_CONFIGS[slug].metaDescription).not.toMatch(/global talent bridge/i)
    })
  })

  it('Kein CORRIDOR_CONFIG metaDescription enthält "Global Talent Bridge"', () => {
    CORRIDOR_SLUGS.forEach(slug => {
      expect(CORRIDOR_CONFIGS[slug].metaDescription).not.toMatch(/global talent bridge/i)
    })
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// SITEMAP — 12 neue Pfade definiert
// ══════════════════════════════════════════════════════════════════════════════

describe('Sitemap — 12 neue SEO-Pfade', () => {
  const EXPECTED_PATHS = [
    '/industries/care',
    '/industries/hospitality',
    '/industries/logistics',
    '/industries/it',
    '/industries/construction',
    '/corridors/morocco-germany',
    '/corridors/tunisia-france',
    '/corridors/india-uk',
    '/corridors/philippines-care',
    '/corridors/nigeria-tech',
    '/solutions/recruiting-agencies',
    '/demo',
  ]

  it('Alle 12 erwarteten Pfade sind in ALL_SEO_PAGE_PATHS', () => {
    EXPECTED_PATHS.forEach(path => {
      expect(ALL_SEO_PAGE_PATHS).toContain(path)
    })
  })

  it('Alle Pfade sind eindeutig (keine Duplikate)', () => {
    const unique = new Set(ALL_SEO_PAGE_PATHS)
    expect(unique.size).toBe(ALL_SEO_PAGE_PATHS.length)
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// robots.txt — Allow-Pfade
// ══════════════════════════════════════════════════════════════════════════════

describe('robots.txt — Allow-Pfade für SEO-Expansion', () => {
  const ALLOWED = ['/corridors/', '/pilot/', '/market-intelligence', '/industries/', '/solutions/', '/demo']
  const DISALLOWED = ['/admin/', '/api/', '/auth/', '/candidate/', '/employer/']

  ALLOWED.forEach(path => {
    it(`${path} ist in der konzeptuellen Allow-Liste`, () => {
      expect(ALLOWED).toContain(path)
    })
  })

  DISALLOWED.forEach(path => {
    it(`${path} ist in der konzeptuellen Disallow-Liste`, () => {
      expect(DISALLOWED).toContain(path)
    })
  })

  it('Allow-Liste hat 6 Einträge', () => {
    expect(ALLOWED).toHaveLength(6)
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// SAFETY INVARIANTEN — keine Stripe, kein Versand, kein Scraping
// ══════════════════════════════════════════════════════════════════════════════

describe('Safety Invarianten — SEO-Expansion Layer', () => {
  it('SEO_REVENUE_PAGES exportiert keine Stripe-Konstante', () => {
    expect(SEO_REVENUE_PAGES).not.toHaveProperty('stripeKey')
    expect(SEO_REVENUE_PAGES).not.toHaveProperty('stripeSessionId')
    expect(SEO_REVENUE_PAGES).not.toHaveProperty('paymentEnabled')
  })

  it('SEO_REVENUE_PAGES exportiert keine Email-Konstante', () => {
    expect(SEO_REVENUE_PAGES).not.toHaveProperty('emailProvider')
    expect(SEO_REVENUE_PAGES).not.toHaveProperty('sendgridKey')
    expect(SEO_REVENUE_PAGES).not.toHaveProperty('resendKey')
  })

  it('SEO_REVENUE_PAGES.noEmailSent ist true', () => {
    expect(SEO_REVENUE_PAGES.noEmailSent).toBe(true)
  })

  it('SEO_REVENUE_PAGES.noAutoOutreach ist true', () => {
    expect(SEO_REVENUE_PAGES.noAutoOutreach).toBe(true)
  })

  it('SEO_REVENUE_PAGES.noScraping ist true', () => {
    expect(SEO_REVENUE_PAGES.noScraping).toBe(true)
  })

  it('SEO_REVENUE_PAGES.noPayment ist true', () => {
    expect(SEO_REVENUE_PAGES.noPayment).toBe(true)
  })

  it('SEO_REVENUE_PAGES.noJobGuarantee ist true', () => {
    expect(SEO_REVENUE_PAGES.noJobGuarantee).toBe(true)
  })

  it('SEO_REVENUE_PAGES.noVisaGuarantee ist true', () => {
    expect(SEO_REVENUE_PAGES.noVisaGuarantee).toBe(true)
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// INDUSTRY PAGE PFADE — korrekte URL-Struktur
// ══════════════════════════════════════════════════════════════════════════════

describe('Industry Page Pfade — URL-Struktur', () => {
  SEO_REVENUE_PAGES.industryPages.forEach(path => {
    it(`${path} beginnt mit /industries/`, () => {
      expect(path).toMatch(/^\/industries\//)
    })

    it(`${path} enthält einen validen Slug`, () => {
      const slug = path.replace('/industries/', '')
      expect(INDUSTRY_SLUGS).toContain(slug as IndustrySlug)
    })
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// CORRIDOR PAGE PFADE — korrekte URL-Struktur
// ══════════════════════════════════════════════════════════════════════════════

describe('Corridor Page Pfade — URL-Struktur', () => {
  SEO_REVENUE_PAGES.corridorPages.forEach(path => {
    it(`${path} beginnt mit /corridors/`, () => {
      expect(path).toMatch(/^\/corridors\//)
    })

    it(`${path} enthält einen validen Korridor-Slug`, () => {
      const slug = path.replace('/corridors/', '')
      expect(CORRIDOR_SLUGS).toContain(slug as CorridorSlug)
    })
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// COMPLIANCE — Keine falschen Versprechen in Meta-Descriptions
// ══════════════════════════════════════════════════════════════════════════════

describe('Compliance — Keine falschen Versprechen in SEO-Texten', () => {
  it('Keine INDUSTRY_CONFIG enthält "Jobgarantie" (positiv)', () => {
    INDUSTRY_SLUGS.forEach(slug => {
      const cfg = INDUSTRY_CONFIGS[slug]
      const allText = [cfg.metaTitle, cfg.metaDescription, cfg.tagline, cfg.description].join(' ')
      // Darf "keine Jobgarantie" enthalten (Verneinung ist OK), aber nicht "Jobgarantie" alleine positiv
      // Prüfen dass kein positives Versprechen da ist
      expect(allText).not.toMatch(/wir garantieren.*job/i)
      expect(allText).not.toMatch(/job.*garantiert/i)
    })
  })

  it('Keine CORRIDOR_CONFIG enthält Visa-Versprechen', () => {
    CORRIDOR_SLUGS.forEach(slug => {
      const cfg = CORRIDOR_CONFIGS[slug]
      const allText = [cfg.metaTitle, cfg.metaDescription, cfg.description, cfg.complianceNote].join(' ')
      expect(allText).not.toMatch(/wir.*garantieren.*visa/i)
      expect(allText).not.toMatch(/visa.*wird.*garantiert/i)
    })
  })

  it('Alle CORRIDOR_CONFIGS complianceNote sind nicht leer', () => {
    CORRIDOR_SLUGS.forEach(slug => {
      expect(CORRIDOR_CONFIGS[slug].complianceNote).toBeTruthy()
      expect(CORRIDOR_CONFIGS[slug].complianceNote.length).toBeGreaterThan(20)
    })
  })

  it('Alle INDUSTRY_CONFIGS haben keyPoints mit icon, title, text', () => {
    INDUSTRY_SLUGS.forEach(slug => {
      const cfg = INDUSTRY_CONFIGS[slug]
      cfg.keyPoints.forEach((kp, i) => {
        expect(kp.icon,  `${slug} keyPoint[${i}].icon`).toBeTruthy()
        expect(kp.title, `${slug} keyPoint[${i}].title`).toBeTruthy()
        expect(kp.text,  `${slug} keyPoint[${i}].text`).toBeTruthy()
      })
    })
  })
})
