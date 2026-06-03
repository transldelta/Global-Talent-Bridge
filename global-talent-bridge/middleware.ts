import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Middleware: aktualisiert Supabase Auth Session Cookies bei jedem Request.
 * Leitet nicht authentifizierte Nutzer auf /auth/login weiter
 * wenn sie auf geschützte Routen zugreifen.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          // Cookie im Request setzen
          request.cookies.set(name, value)
          // Neue Response mit aktualisiertem Cookie
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set(name, value, options as Parameters<typeof response.cookies.set>[2])
        },
        remove(name: string, options: Record<string, unknown>) {
          request.cookies.set(name, '')
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set(name, '', options as Parameters<typeof response.cookies.set>[2])
        },
      },
    }
  )

  // Session auffrischen — wichtig für Supabase Auth
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Geschützte Routen — nicht eingeloggte Nutzer weiterleiten
  const protectedPaths = [
    '/candidate',
    '/employer',
    '/jobs',
    '/admin',
  ]

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path))

  if (isProtected && !user) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Alle Routen außer:
     * - _next/static
     * - _next/image
     * - favicon.ico
     * - public-Ordner
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
