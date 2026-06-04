import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Supabase Auth Callback — Code-Exchange für Password Reset und E-Mail-Bestätigung.
 * Supabase leitet nach resetPasswordForEmail hierher weiter mit ?code=...
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/'

  const baseUrl = requestUrl.origin

  if (code) {
    const supabase = createClient()

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('[auth/callback] Code-Exchange-Fehler:', error.message)
      return NextResponse.redirect(
        `${baseUrl}/auth/login?error=${encodeURIComponent('Reset-Link ungültig oder abgelaufen.')}`
      )
    }
  }

  // Weiterleitung zur Zielseite (z.B. /auth/update-password)
  return NextResponse.redirect(`${baseUrl}${next}`)
}
