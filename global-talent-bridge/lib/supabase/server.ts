import { createServerClient } from '@supabase/ssr'
import { type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Server-side Supabase client (Anon Key).
 * Für Server Components, Route Handlers und Server Actions.
 * Kein Service Role Key — RLS aktiv.
 */
export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch {
            // In Server Components kann set() nicht aufgerufen werden — ignorieren
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch {
            // In Server Components kann remove() nicht aufgerufen werden — ignorieren
          }
        },
      },
    }
  )
}
