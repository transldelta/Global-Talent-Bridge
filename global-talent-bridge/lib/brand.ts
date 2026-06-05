/**
 * lib/brand.ts
 *
 * Zentrale Marken-Konfiguration für CorridorWork.
 *
 * ALLE sichtbaren Markenwerte kommen von hier.
 * Niemals "CorridorWork" oder "corridorwork.com" direkt hartkodieren —
 * immer diese Konstanten verwenden.
 *
 * Technische Namen (DB-Tabellen, API-Routen, interne Funktionsnamen)
 * werden NICHT von hier gesteuert — die bleiben wie sie sind.
 */

export const BRAND = {
  // ── Markenname ──────────────────────────────────────────────────────────────
  name:         'CorridorWork',
  nameShort:    'CW',
  tagline:      'Cross-border hiring, fully controlled.',
  taglineDe:    'Internationales Recruiting. Vollständig kontrolliert.',

  // ── Domain & URLs ───────────────────────────────────────────────────────────
  domain:       'corridorwork.com',
  url:          'https://corridorwork.com',
  appUrl:       'https://app.corridorwork.com',

  // ── E-Mail ──────────────────────────────────────────────────────────────────
  emailTeam:    'team@corridorwork.com',
  emailSupport: 'support@corridorwork.com',

  // ── Signaturen (Outreach) ───────────────────────────────────────────────────
  /** Standard-Signatur für alle Outreach-Texte */
  signatureTeam:   'CorridorWork Team',
  /** Ausführliche Signatur für E-Mail-Templates */
  signatureFull:   'Viele Grüße\nCorridorWork Team',
  /** WhatsApp / LinkedIn kurz */
  signatureShort:  'CorridorWork Team',

  // ── Rechtliches ─────────────────────────────────────────────────────────────
  legalName:    'CorridorWork',
  operatedBy:   'Delta Translation, Karlsruhe',

  // ── Plattform-Beschreibung ──────────────────────────────────────────────────
  descriptionDe:
    'Approval-basierte Plattform für internationales Fachkräfte-Recruiting. ' +
    'Strukturiertes Matching, manuelle Freigabe, vollständige Risikokontrolle.',
  descriptionEn:
    'Approval-based platform for cross-border workforce recruitment. ' +
    'Structured matching, manual sign-off, full risk control.',

  // ── Social / SEO ─────────────────────────────────────────────────────────────
  keywords: [
    'internationales Recruiting',
    'Cross-border Hiring',
    'internationale Fachkräfte',
    'Arbeitgeber internationale Kandidaten',
    'Workforce Corridor',
    'approval-based hiring',
  ],
} as const

/** Gibt die Standard-Team-Signatur zurück (für Outreach-Templates) */
export function getBrandSignature(
  style: 'full' | 'short' | 'team' = 'full',
): string {
  if (style === 'full')  return BRAND.signatureFull
  if (style === 'short') return BRAND.signatureShort
  return BRAND.signatureTeam
}

/** Gibt die vollständige E-Mail-Footer-Signatur zurück */
export function getEmailSignatureBlock(extras?: string): string {
  const lines = [
    BRAND.signatureFull,
    extras ?? `[KONTAKT-E-MAIL]`,
    `[TELEFON / WHATSAPP]`,
    BRAND.url,
  ]
  return lines.join('\n')
}
