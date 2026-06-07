/**
 * GET /api/admin/dns-check?txt=<value>
 *
 * Prüft, ob ein bestimmter TXT-Wert für corridorwork.com öffentlich im DNS sichtbar ist.
 *
 * Admin-geschützt (Supabase Session).
 * Kein Scraping — nur Standard-DNS-Abfrage via Node.js dns-Modul.
 * Kein Google API. Kein externer Dienst.
 * Kostenlos, kein Stripe.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient }              from '@/lib/supabase/server'
import { isAdminEmail }              from '@/lib/admin'
import { promises as dns }           from 'dns'

const DOMAIN = 'corridorwork.com'

export async function GET(req: NextRequest) {
  // ── 1. Admin-Auth ──────────────────────────────────────────────────────────
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.email || !isAdminEmail(user.email)) {
    return NextResponse.json(
      { error: 'Unauthorized', code: 'unauthorized' },
      { status: 401 }
    )
  }

  // ── 2. TXT-Wert aus Query-Parameter lesen ─────────────────────────────────
  const { searchParams } = new URL(req.url)
  const txtValue = searchParams.get('txt')?.trim()

  if (!txtValue || txtValue.length < 10) {
    return NextResponse.json(
      { error: 'TXT-Wert fehlt oder zu kurz', code: 'missing_txt' },
      { status: 400 }
    )
  }

  // ── 3. DNS TXT-Abfrage (kein Scraping, nur Node.js dns-Modul) ─────────────
  let records: string[][] = []
  let dnsError: string | null = null

  try {
    records = await dns.resolveTxt(DOMAIN)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    // ENODATA / ENOTFOUND = Domain hat keine TXT-Records oder kein DNS
    dnsError = msg
  }

  // TXT-Records zusammenführen (ein Record kann aus mehreren Strings bestehen)
  const flatRecords = records.map(r => r.join(''))

  // Prüfen ob der gesuchte TXT-Wert vorhanden ist
  const found = flatRecords.some(r => r === txtValue)

  // ── 4. Antwort ────────────────────────────────────────────────────────────
  return NextResponse.json({
    ok:          true,
    domain:      DOMAIN,
    found,
    txtValue,
    recordCount: flatRecords.length,
    dnsError,
    // Alle TXT-Records zurückgeben (keine Secrets — DNS ist öffentlich)
    allRecords:  flatRecords,
    // Safety bestätigen
    noScraping:       true,
    noGoogleApi:      true,
    noEmailSent:      true,
    noStripe:         true,
    checkedAt:        new Date().toISOString(),
  })
}
