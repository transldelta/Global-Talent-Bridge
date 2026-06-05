/**
 * lib/demo-mode.ts
 *
 * Buyer Demo Mode — zentrale Steuerungslogik.
 * Keine UI. Keine Server-Imports. Vollständig testbar mit Vitest.
 *
 * CONSTRAINTS:
 * - Keine Fake-Umsätze als echte Umsätze darstellen
 * - Keine echten Kunden als Demo-Kunden ausgeben
 * - Demo-Daten müssen immer klar als demo/sample/synthetic markiert sein
 * - Kein automatischer Versand im Demo Mode
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export type DemoModeConfig = {
  enabled: boolean
  label: string
  bannerText: string
  exportLabel: string
  disclaimer: string
  dataTag: 'demo' | 'sample' | 'synthetic' | 'example'
}

export type DemoDataTag = {
  demo: true
  dataSource: 'synthetic' | 'sample' | 'example'
  notRealCustomer: true
  notRealRevenue: true
}

// ── Demo Mode Detection ───────────────────────────────────────────────────────

/**
 * Server-side: reads BUYER_DEMO_MODE env var.
 * Client-side component: reads NEXT_PUBLIC_BUYER_DEMO_MODE.
 *
 * Returns true if either is set to "true" (case-insensitive).
 *
 * Usage:
 *   Server component / API route: isDemoModeEnabled()
 *   Client component: isDemoModeEnabledClient()
 */
export function isDemoModeEnabled(): boolean {
  // Server-side check (works in Node.js / Next.js server components)
  if (typeof process !== 'undefined' && process.env) {
    const serverVar = process.env.BUYER_DEMO_MODE
    const publicVar = process.env.NEXT_PUBLIC_BUYER_DEMO_MODE
    if (serverVar?.toLowerCase() === 'true') return true
    if (publicVar?.toLowerCase() === 'true') return true
  }
  return false
}

/**
 * Client-side only — reads NEXT_PUBLIC_BUYER_DEMO_MODE.
 * Safe to call in 'use client' components.
 */
export function isDemoModeEnabledClient(): boolean {
  if (typeof process !== 'undefined' && process.env) {
    const v = process.env.NEXT_PUBLIC_BUYER_DEMO_MODE
    return v?.toLowerCase() === 'true'
  }
  return false
}

// ── Labels & Texts ────────────────────────────────────────────────────────────

export function getDemoModeLabel(): string {
  return '🎬 Demo Mode'
}

export function getDemoBannerText(): string {
  return 'Demo-Modus aktiv — Beispieldaten, keine echten Kunden oder Umsätze.'
}

export function getDemoBannerTextEn(): string {
  return 'Demo Mode — sample data only, not real customers or revenue.'
}

export function getDemoDisclaimer(): string {
  return (
    'Alle in diesem Bereich angezeigten Daten sind synthetische Beispieldaten (demo: true). ' +
    'Sie repräsentieren keine echten Kunden, keine echten Umsätze und keine echten Vermittlungen. ' +
    'Schätzungen und Prognosen sind klar als Schätzungen markiert. ' +
    'Keine Rechtsberatung. Keine Finanzberatung. Keine Garantie.'
  )
}

export function getDemoDisclaimerEn(): string {
  return (
    'All data shown in this section is synthetic sample data (demo: true). ' +
    'It does not represent real customers, real revenue, or real placements. ' +
    'Estimates and projections are clearly labeled as estimates. ' +
    'No legal advice. No financial advice. No guarantee.'
  )
}

export function getDemoModeConfig(): DemoModeConfig {
  return {
    enabled: isDemoModeEnabled(),
    label: getDemoModeLabel(),
    bannerText: getDemoBannerText(),
    exportLabel: 'Export (Demo Data)',
    disclaimer: getDemoDisclaimer(),
    dataTag: 'demo',
  }
}

// ── Data Tag Assertion ────────────────────────────────────────────────────────

/**
 * Creates a standard demo data tag to attach to all demo objects.
 * Using this function (instead of inline objects) ensures consistent tagging.
 */
export function createDemoDataTag(): DemoDataTag {
  return {
    demo: true,
    dataSource: 'synthetic',
    notRealCustomer: true,
    notRealRevenue: true,
  }
}

/**
 * Asserts that a given object is clearly marked as demo data.
 * Throws if the demo flag is missing or false.
 * Use in tests to verify all demo items are tagged.
 */
export function assertDemoDataIsClearlyMarked(item: { demo?: boolean }, label?: string): void {
  if (item.demo !== true) {
    throw new Error(
      `Demo data item${label ? ` "${label}"` : ''} is missing the required 'demo: true' marker. ` +
      'All synthetic data must be explicitly tagged to prevent confusion with real data.'
    )
  }
}

/**
 * Validates an array of demo data items, asserting all have demo: true.
 * Returns the count of validated items.
 */
export function validateDemoDataArray(
  items: Array<{ demo?: boolean }>,
  collectionName: string
): number {
  for (let i = 0; i < items.length; i++) {
    assertDemoDataIsClearlyMarked(items[i], `${collectionName}[${i}]`)
  }
  return items.length
}

// ── Static Demo Mode Info ─────────────────────────────────────────────────────

/**
 * Returns instructions for enabling demo mode in .env.local
 */
export function getDemoModeSetupInstructions(): string[] {
  return [
    '# Add to .env.local to enable Buyer Demo Mode:',
    'NEXT_PUBLIC_BUYER_DEMO_MODE=true',
    'BUYER_DEMO_MODE=true',
    '',
    '# Remove or set to false to disable:',
    'NEXT_PUBLIC_BUYER_DEMO_MODE=false',
    'BUYER_DEMO_MODE=false',
  ]
}
