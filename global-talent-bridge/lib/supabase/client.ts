import { createBrowserClient } from '@supabase/ssr'

/**
 * Client-side Supabase client.
 * Nur NEXT_PUBLIC_* Variablen — kein Service Role Key.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
