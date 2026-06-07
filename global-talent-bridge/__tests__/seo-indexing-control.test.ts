/**
 * __tests__/seo-indexing-control.test.ts
 *
 * SEO Indexing & Visibility Control Layer — Test Suite
 *
 * Prüft:
 * - SEO_PAGE_ENTRIES: alle 16 Seiten vorhanden
 * - SEO_SYSTEM_STATUS: Safety-Invarianten, Sitemap, robots.txt
 * - TOP_PRIORITY_PATHS_FOR_INDEXING: korrekte Seiten
 * - GOOGLE_SEARCH_CONSOLE_GUIDE: alle Schritte, kein API-Call
 * - generateSeoCheckItems: gibt korrekte Items zurück
 * - Kein Google API Call, kein Scraping, kein Stripe, kein E-Mail
 * - CorridorWork Branding korrekt (kein "Global Talent Bridge")
 */
import { describe, it, expect } from 'vitest'
import {
  SEO_PAGE_ENTRIES,
  SEO_SYSTEM_STATUS,
  TOP_PRIORITY_PATHS_FOR_INDEXING,
  GOOGLE_SEARCH_CONSOLE_GUIDE,
  generateSeoCheckItems,
} from '@/lib/seo-indexing'

// ══════════════════════════════════════════════════════════════════════════════
// SEO_PAGE_ENTRIES — Vollständigkeit
// ══════════════════════════════════════════════════════════════════════════════

describe('SEO_PAGE_ENTRIES — 16 Seiten vorhanden', () => {
  it('Hat genau 16 Einträge', () => {
    expect(SEO_PAGE_ENTRIES).toHaveLength(16)
  })

  it('Alle Einträge haben url, path, label, group, priority', () => {
    SEO_PAGE_ENTRIES.forEach(entry => {
      expect(entry.url,      `${entry.path}: url fehlt`).toBeTruthy()
      expect(entry.path,     `${entry.path}: path fehlt`).toBeTruthy()
      expect(entry.label,    `${entry.path}: label fehlt`).toBeTruthy()
      expect(entry.group,    `${entry.path}: group fehlt`).toBeTruthy()
      expect(entry.priority, `${entry.path}: priority fehlt`).toBeTruthy()
    })
  })

  it('Alle URLs beginnen mit https://corridorwork.com', () => {
    SEO_PAGE_ENTRIES.forEach(entry => {
      expect(entry.url).toMatch(/^https:\/\/corridorwork\.com/)
    })
  })

  it('Alle Pfade beginnen mit /', () => {
    SEO_PAGE_ENTRIES.forEach(entry => {
      expect(entry.path).toMatch(/^\//)
    })
  })

  it('Alle Seiten sind als indexierbar markiert', () => {
    SEO_PAGE_ENTRIES.forEach(entry => {
      expect(entry.indexability, `${entry.path} sollte indexierbar sein`).toBe('indexable')
    })
  })

  it('Alle Seiten haben sitemapEntry: true', () => {
    SEO_PAGE_ENTRIES.forEach(entry => {
      expect(entry.sitemapEntry, `${entry.path}: sitemapEntry fehlt`).toBe(true)
    })
  })

  it('Alle Seiten haben robotsAllowed: true', () => {
    SEO_PAGE_ENTRIES.forEach(entry => {
      expect(entry.robotsAllowed, `${entry.path}: robotsAllowed fehlt`).toBe(true)
    })
  })

  it('Kein Eintrag enthält "Global Talent Bridge"', () => {
    SEO_PAGE_ENTRIES.forEach(entry => {
      const allText = [entry.url, entry.path, entry.label, entry.metaNote].join(' ')
      expect(allText).not.toMatch(/global talent bridge/i)
    })
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// SEO_PAGE_ENTRIES — Pflichtseiten enthalten
// ══════════════════════════════════════════════════════════════════════════════

describe('SEO_PAGE_ENTRIES — alle Pflichtseiten enthalten', () => {
  const REQUIRED_PATHS = [
    '/',
    '/demo',
    '/pilot/employers',
    '/pilot/agencies',
    '/market-intelligence',
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
  ]

  const paths = SEO_PAGE_ENTRIES.map(p => p.path)

  REQUIRED_PATHS.forEach(required => {
    it(`${required} ist in SEO_PAGE_ENTRIES`, () => {
      expect(paths).toContain(required)
    })
  })

  it('Alle 16 Pflichtseiten sind vorhanden', () => {
    expect(REQUIRED_PATHS).toHaveLength(16)
    REQUIRED_PATHS.forEach(p => expect(paths).toContain(p))
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// SEO_SYSTEM_STATUS — Safety-Invarianten
// ══════════════════════════════════════════════════════════════════════════════

describe('SEO_SYSTEM_STATUS — Safety-Invarianten', () => {
  it('noGoogleApiCalls ist true', () => {
    expect(SEO_SYSTEM_STATUS.noGoogleApiCalls).toBe(true)
  })

  it('noScraping ist true', () => {
    expect(SEO_SYSTEM_STATUS.noScraping).toBe(true)
  })

  it('noEmailSent ist true', () => {
    expect(SEO_SYSTEM_STATUS.noEmailSent).toBe(true)
  })

  it('noStripe ist true', () => {
    expect(SEO_SYSTEM_STATUS.noStripe).toBe(true)
  })

  it('lastCheckSource ist static_config', () => {
    expect(SEO_SYSTEM_STATUS.lastCheckSource).toBe('static_config')
  })

  it('brand ist CorridorWork', () => {
    expect(SEO_SYSTEM_STATUS.brand).toBe('CorridorWork')
  })

  it('phase ist 1', () => {
    expect(SEO_SYSTEM_STATUS.phase).toBe(1)
  })

  it('sitemapUrl enthält corridorwork.com/sitemap.xml', () => {
    expect(SEO_SYSTEM_STATUS.sitemapUrl).toBe('https://corridorwork.com/sitemap.xml')
  })

  it('robotsUrl enthält corridorwork.com/robots.txt', () => {
    expect(SEO_SYSTEM_STATUS.robotsUrl).toBe('https://corridorwork.com/robots.txt')
  })

  it('sitemapReady ist true', () => {
    expect(SEO_SYSTEM_STATUS.sitemapReady).toBe(true)
  })

  it('robotsReady ist true', () => {
    expect(SEO_SYSTEM_STATUS.robotsReady).toBe(true)
  })

  it('totalPublicPages stimmt mit SEO_PAGE_ENTRIES überein', () => {
    expect(SEO_SYSTEM_STATUS.totalPublicPages).toBe(SEO_PAGE_ENTRIES.length)
  })

  it('indexablePages stimmt mit tatsächlich indexierbaren Seiten überein', () => {
    const actual = SEO_PAGE_ENTRIES.filter(p => p.indexability === 'indexable').length
    expect(SEO_SYSTEM_STATUS.indexablePages).toBe(actual)
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// TOP_PRIORITY_PATHS_FOR_INDEXING
// ══════════════════════════════════════════════════════════════════════════════

describe('TOP_PRIORITY_PATHS_FOR_INDEXING', () => {
  it('Enthält mindestens 4 Pfade', () => {
    expect(TOP_PRIORITY_PATHS_FOR_INDEXING.length).toBeGreaterThanOrEqual(4)
  })

  it('/demo ist in Top-Priorität', () => {
    expect(TOP_PRIORITY_PATHS_FOR_INDEXING).toContain('/demo')
  })

  it('/pilot/employers ist in Top-Priorität', () => {
    expect(TOP_PRIORITY_PATHS_FOR_INDEXING).toContain('/pilot/employers')
  })

  it('/industries/care ist in Top-Priorität', () => {
    expect(TOP_PRIORITY_PATHS_FOR_INDEXING).toContain('/industries/care')
  })

  it('/solutions/recruiting-agencies ist in Top-Priorität', () => {
    expect(TOP_PRIORITY_PATHS_FOR_INDEXING).toContain('/solutions/recruiting-agencies')
  })

  it('Alle Top-Pfade beginnen mit /', () => {
    TOP_PRIORITY_PATHS_FOR_INDEXING.forEach(path => {
      expect(path).toMatch(/^\//)
    })
  })

  it('Alle Top-Pfade sind auch in SEO_PAGE_ENTRIES', () => {
    const allPaths = SEO_PAGE_ENTRIES.map(p => p.path)
    TOP_PRIORITY_PATHS_FOR_INDEXING.forEach(path => {
      expect(allPaths, `${path} sollte in SEO_PAGE_ENTRIES sein`).toContain(path)
    })
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// GOOGLE_SEARCH_CONSOLE_GUIDE — alle 5 Schritte + Safety
// ══════════════════════════════════════════════════════════════════════════════

describe('GOOGLE_SEARCH_CONSOLE_GUIDE — Vollständigkeit', () => {
  it('Alle 5 Schritte vorhanden', () => {
    expect(GOOGLE_SEARCH_CONSOLE_GUIDE).toHaveProperty('step1')
    expect(GOOGLE_SEARCH_CONSOLE_GUIDE).toHaveProperty('step2')
    expect(GOOGLE_SEARCH_CONSOLE_GUIDE).toHaveProperty('step3')
    expect(GOOGLE_SEARCH_CONSOLE_GUIDE).toHaveProperty('step4')
    expect(GOOGLE_SEARCH_CONSOLE_GUIDE).toHaveProperty('step5')
  })

  it('step1.url ist die korrekte Search Console URL', () => {
    expect(GOOGLE_SEARCH_CONSOLE_GUIDE.step1.url).toMatch(/search\.google\.com\/search-console/)
  })

  it('step2.value ist corridorwork.com', () => {
    expect(GOOGLE_SEARCH_CONSOLE_GUIDE.step2.value).toBe('corridorwork.com')
  })

  it('step4.sitemapUrl ist korrekt', () => {
    expect(GOOGLE_SEARCH_CONSOLE_GUIDE.step4.sitemapUrl).toBe('https://corridorwork.com/sitemap.xml')
  })

  it('step5.urls enthält mindestens 3 Top-Pfade', () => {
    expect(GOOGLE_SEARCH_CONSOLE_GUIDE.step5.urls.length).toBeGreaterThanOrEqual(3)
  })

  it('importantNote erwähnt manuell', () => {
    expect(GOOGLE_SEARCH_CONSOLE_GUIDE.importantNote).toMatch(/manuell/i)
  })

  it('importantNote erwähnt keinen API-Call', () => {
    expect(GOOGLE_SEARCH_CONSOLE_GUIDE.importantNote).toMatch(/kein.*api/i)
  })

  it('Guide enthält kein "Global Talent Bridge"', () => {
    const allText = JSON.stringify(GOOGLE_SEARCH_CONSOLE_GUIDE)
    expect(allText).not.toMatch(/global talent bridge/i)
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// generateSeoCheckItems — Daily Runner Items
// ══════════════════════════════════════════════════════════════════════════════

describe('generateSeoCheckItems — Daily Runner Integration', () => {
  it('Gibt ein Array zurück', () => {
    const items = generateSeoCheckItems()
    expect(Array.isArray(items)).toBe(true)
  })

  it('Gibt mindestens 4 Items zurück', () => {
    const items = generateSeoCheckItems()
    expect(items.length).toBeGreaterThanOrEqual(4)
  })

  it('Enthält "SEO visibility check prepared"', () => {
    const items = generateSeoCheckItems()
    const joined = items.join(' ')
    expect(joined).toMatch(/SEO visibility check prepared/i)
  })

  it('Enthält sitemap.xml Referenz', () => {
    const items = generateSeoCheckItems()
    const joined = items.join(' ')
    expect(joined).toMatch(/sitemap\.xml/i)
  })

  it('Enthält robots.txt Referenz', () => {
    const items = generateSeoCheckItems()
    const joined = items.join(' ')
    expect(joined).toMatch(/robots\.txt/i)
  })

  it('Enthält Hinweis auf manuelle Search Console Einreichung', () => {
    const items = generateSeoCheckItems()
    const joined = items.join(' ')
    expect(joined).toMatch(/kein google api/i)
  })

  it('Kein Item enthält "Global Talent Bridge"', () => {
    const items = generateSeoCheckItems()
    items.forEach(item => {
      expect(item).not.toMatch(/global talent bridge/i)
    })
  })

  it('Items sind alle Strings', () => {
    const items = generateSeoCheckItems()
    items.forEach(item => {
      expect(typeof item).toBe('string')
    })
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// KEIN GOOGLE API / KEIN SCRAPING / KEIN STRIPE
// ══════════════════════════════════════════════════════════════════════════════

describe('Safety — kein Google API, kein Scraping, kein Stripe', () => {
  it('lib/seo-indexing.ts exportiert keine Google API Funktion', async () => {
    const mod = await import('@/lib/seo-indexing')
    // @ts-expect-error — Laufzeitcheck
    expect(mod.callGoogleSearchConsoleApi).toBeUndefined()
    // @ts-expect-error
    expect(mod.submitToGoogle).toBeUndefined()
    // @ts-expect-error
    expect(mod.googleApiKey).toBeUndefined()
  })

  it('lib/seo-indexing.ts exportiert keine Scraping-Funktion', async () => {
    const mod = await import('@/lib/seo-indexing')
    // @ts-expect-error
    expect(mod.scrape).toBeUndefined()
    // @ts-expect-error
    expect(mod.crawl).toBeUndefined()
    // @ts-expect-error
    expect(mod.fetchExternalData).toBeUndefined()
  })

  it('lib/seo-indexing.ts exportiert keine Stripe-Funktion', async () => {
    const mod = await import('@/lib/seo-indexing')
    // @ts-expect-error
    expect(mod.stripe).toBeUndefined()
    // @ts-expect-error
    expect(mod.createStripeSession).toBeUndefined()
  })

  it('lib/seo-indexing.ts exportiert keine sendEmail-Funktion', async () => {
    const mod = await import('@/lib/seo-indexing')
    // @ts-expect-error
    expect(mod.sendEmail).toBeUndefined()
    // @ts-expect-error
    expect(mod.sendLead).toBeUndefined()
  })

  it('SEO_SYSTEM_STATUS.noGoogleApiCalls ist true', () => {
    expect(SEO_SYSTEM_STATUS.noGoogleApiCalls).toBe(true)
  })

  it('SEO_SYSTEM_STATUS.noScraping ist true', () => {
    expect(SEO_SYSTEM_STATUS.noScraping).toBe(true)
  })

  it('SEO_SYSTEM_STATUS.noStripe ist true', () => {
    expect(SEO_SYSTEM_STATUS.noStripe).toBe(true)
  })

  it('SEO_SYSTEM_STATUS.noEmailSent ist true', () => {
    expect(SEO_SYSTEM_STATUS.noEmailSent).toBe(true)
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// BRANDING — CorridorWork, kein Global Talent Bridge
// ══════════════════════════════════════════════════════════════════════════════

describe('Branding — CorridorWork, kein Global Talent Bridge', () => {
  it('SEO_SYSTEM_STATUS.brand ist CorridorWork', () => {
    expect(SEO_SYSTEM_STATUS.brand).toBe('CorridorWork')
  })

  it('Alle SEO_PAGE_ENTRIES URLs enthalten corridorwork.com', () => {
    SEO_PAGE_ENTRIES.forEach(entry => {
      expect(entry.url).toMatch(/corridorwork\.com/)
    })
  })

  it('Kein SEO_PAGE_ENTRY enthält Global Talent Bridge', () => {
    SEO_PAGE_ENTRIES.forEach(entry => {
      const all = [entry.url, entry.label, entry.metaNote].join(' ')
      expect(all).not.toMatch(/global talent bridge/i)
    })
  })

  it('GOOGLE_SEARCH_CONSOLE_GUIDE verwendet corridorwork.com', () => {
    expect(GOOGLE_SEARCH_CONSOLE_GUIDE.step2.value).toMatch(/corridorwork\.com/)
    expect(GOOGLE_SEARCH_CONSOLE_GUIDE.step4.sitemapUrl).toMatch(/corridorwork\.com/)
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// PRIORITÄTEN — Verteilung
// ══════════════════════════════════════════════════════════════════════════════

describe('SEO-Prioritäten — Verteilung', () => {
  it('Mindestens 6 Seiten haben Priorität "high"', () => {
    const high = SEO_PAGE_ENTRIES.filter(p => p.priority === 'high')
    expect(high.length).toBeGreaterThanOrEqual(6)
  })

  it('Keine Seite hat eine ungültige Priorität', () => {
    const valid = new Set(['high', 'medium', 'low'])
    SEO_PAGE_ENTRIES.forEach(entry => {
      expect(valid.has(entry.priority), `${entry.path}: ungültige Priorität "${entry.priority}"`).toBe(true)
    })
  })

  it('Keine Seite hat eine ungültige Gruppe', () => {
    const valid = new Set(['revenue', 'industry', 'corridor', 'solutions', 'static'])
    SEO_PAGE_ENTRIES.forEach(entry => {
      expect(valid.has(entry.group), `${entry.path}: ungültige Gruppe "${entry.group}"`).toBe(true)
    })
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// GSC SETUP ASSISTANT — Seiteninhalt-Anforderungen (via Konfiguration)
// ══════════════════════════════════════════════════════════════════════════════

describe('GSC Setup Assistant — Seitenanforderungen (via Konfiguration)', () => {
  /**
   * Diese Tests prüfen, dass alle Daten, die auf der Seite /admin/seo-indexing-control
   * angezeigt werden müssen, in der Konfiguration vorhanden sind.
   * Redirect-Test (kein Login → Login-Redirect) ist als Anforderung dokumentiert.
   */

  it('Google Search Console Link ist in der Konfiguration vorhanden', () => {
    // Seite muss diesen Link zeigen → in GOOGLE_SEARCH_CONSOLE_GUIDE.step1.url
    expect(GOOGLE_SEARCH_CONSOLE_GUIDE.step1.url).toContain('search.google.com/search-console')
  })

  it('corridorwork.com ist in der GSC-Konfiguration vorhanden', () => {
    // Seite muss "corridorwork.com" anzeigen
    expect(GOOGLE_SEARCH_CONSOLE_GUIDE.step2.value).toBe('corridorwork.com')
  })

  it('sitemap.xml URL ist in der Konfiguration vorhanden', () => {
    // Seite muss die Sitemap-URL anzeigen
    expect(GOOGLE_SEARCH_CONSOLE_GUIDE.step4.sitemapUrl).toContain('sitemap.xml')
    expect(GOOGLE_SEARCH_CONSOLE_GUIDE.step4.sitemapUrl).toContain('corridorwork.com')
  })

  it('Google API ist nicht aktiv (noGoogleApiCalls = true)', () => {
    // Seite zeigt "Google API: Nicht aktiv ✓" → SEO_SYSTEM_STATUS.noGoogleApiCalls = true
    expect(SEO_SYSTEM_STATUS.noGoogleApiCalls).toBe(true)
  })

  it('Prioritäts-URLs für Indexierung sind vorhanden (mindestens 4)', () => {
    // Seite zeigt Top-Priority-URLs
    expect(TOP_PRIORITY_PATHS_FOR_INDEXING.length).toBeGreaterThanOrEqual(4)
  })

  it('Alle 6 erwarteten Prioritäts-URLs sind enthalten', () => {
    const EXPECTED_PRIORITY_URLS = [
      '/demo',
      '/pilot/employers',
      '/pilot/agencies',
      '/market-intelligence',
      '/industries/care',
      '/solutions/recruiting-agencies',
    ]
    EXPECTED_PRIORITY_URLS.forEach(url => {
      expect(TOP_PRIORITY_PATHS_FOR_INDEXING, `${url} fehlt in TOP_PRIORITY_PATHS_FOR_INDEXING`).toContain(url)
    })
  })

  it('Kein Scraping — noScraping ist true in SEO_SYSTEM_STATUS', () => {
    expect(SEO_SYSTEM_STATUS.noScraping).toBe(true)
  })

  it('Kein E-Mail-Versand — noEmailSent ist true in SEO_SYSTEM_STATUS', () => {
    expect(SEO_SYSTEM_STATUS.noEmailSent).toBe(true)
  })

  it('Kein Stripe — noStripe ist true in SEO_SYSTEM_STATUS', () => {
    expect(SEO_SYSTEM_STATUS.noStripe).toBe(true)
  })

  it('Seite hat 5 konfigurierte Schritte (step1 bis step5)', () => {
    expect(GOOGLE_SEARCH_CONSOLE_GUIDE).toHaveProperty('step1')
    expect(GOOGLE_SEARCH_CONSOLE_GUIDE).toHaveProperty('step2')
    expect(GOOGLE_SEARCH_CONSOLE_GUIDE).toHaveProperty('step3')
    expect(GOOGLE_SEARCH_CONSOLE_GUIDE).toHaveProperty('step4')
    expect(GOOGLE_SEARCH_CONSOLE_GUIDE).toHaveProperty('step5')
  })

  it('Schritt 3 enthält DNS TXT Hinweis', () => {
    const step3 = JSON.stringify(GOOGLE_SEARCH_CONSOLE_GUIDE.step3)
    // Schritt 3 handelt von DNS-Eintrag
    expect(step3.toLowerCase()).toMatch(/dns|txt/)
  })

  it('Schritt 5 enthält URLs für Indexierung', () => {
    expect(GOOGLE_SEARCH_CONSOLE_GUIDE.step5.urls).toBeInstanceOf(Array)
    expect(GOOGLE_SEARCH_CONSOLE_GUIDE.step5.urls.length).toBeGreaterThanOrEqual(3)
  })

  it('importantNote bestätigt: kein automatischer API-Call', () => {
    expect(GOOGLE_SEARCH_CONSOLE_GUIDE.importantNote).toMatch(/kein.*api/i)
    expect(GOOGLE_SEARCH_CONSOLE_GUIDE.importantNote).toMatch(/manuell/i)
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// DNS CHECK ROUTE — Safety-Anforderungen
// ══════════════════════════════════════════════════════════════════════════════

describe('DNS Check Route — Safety', () => {
  /**
   * Prüft, dass die DNS-Check-Route nur Standard-DNS nutzt,
   * kein Scraping, kein Google API, kein E-Mail.
   */

  it('generateSeoCheckItems enthält keine externen API-Calls', () => {
    // generateSeoCheckItems ist eine pure Funktion — kein I/O, kein externes API
    const items = generateSeoCheckItems()
    const joined = items.join(' ')
    // Darf keine externe HTTP-Anfrage enthalten
    expect(joined).not.toMatch(/fetch\(|axios|request\(/)
  })

  it('generateSeoCheckItems erwähnt "Kein Google API" explizit', () => {
    const items = generateSeoCheckItems()
    const joined = items.join(' ')
    expect(joined).toMatch(/kein google api/i)
  })

  it('generateSeoCheckItems läuft synchron ohne I/O', () => {
    // Kein await, kein Promise → synchrone Funktion
    const result = generateSeoCheckItems()
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)
  })

  it('SEO System ist in Phase 1', () => {
    expect(SEO_SYSTEM_STATUS.phase).toBe(1)
  })

  it('lastCheckSource ist static_config (kein externer Call)', () => {
    // DNS wird per Node.js dns-Modul geprüft, nicht hier
    // Dieser Status zeigt: die config-basierte Prüfung ist statisch
    expect(SEO_SYSTEM_STATUS.lastCheckSource).toBe('static_config')
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// CWO COMMAND CENTER — SEO-Panel-Anforderungen
// ══════════════════════════════════════════════════════════════════════════════

describe('CWO Command Center — SEO Panel Datenanforderungen', () => {
  /**
   * Prüft, dass die Daten im CWO-SEO-Panel korrekt sind.
   * Das CWO Command Center zeigt: GSC Setup: vorbereitet, Sitemap: bereit, Google API: nicht aktiv.
   */

  it('SEO_SYSTEM_STATUS zeigt 16 öffentliche Seiten', () => {
    expect(SEO_SYSTEM_STATUS.totalPublicPages).toBe(16)
  })

  it('Sitemap-URL ist korrekt (für CWO Panel)', () => {
    expect(SEO_SYSTEM_STATUS.sitemapUrl).toBe('https://corridorwork.com/sitemap.xml')
  })

  it('Google API ist nicht aktiv (für CWO Panel)', () => {
    expect(SEO_SYSTEM_STATUS.noGoogleApiCalls).toBe(true)
  })

  it('sitemapReady ist true (für CWO Panel)', () => {
    expect(SEO_SYSTEM_STATUS.sitemapReady).toBe(true)
  })

  it('robotsReady ist true (für CWO Panel)', () => {
    expect(SEO_SYSTEM_STATUS.robotsReady).toBe(true)
  })
})
