import 'server-only'
import { createClient } from '@supabase/supabase-js'

/**
 * Admin Supabase client mit Service Role Key.
 * NUR serverseitig — niemals im Client verwenden.
 * Umgeht RLS — nur für Admin-Routen und System-Operationen.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL und SUPABASE_SERVICE_ROLE_KEY müssen gesetzt sein.'
    )
  }

  // Platzhalter-Wert erkennen — gibt Warnung aus, bricht aber nicht den Build ab
  if (serviceRoleKey === 'HIER_SERVICE_ROLE_KEY_EINTRAGEN' || !serviceRoleKey.startsWith('eyJ')) {
    console.warn(
      '[createAdminClient] SUPABASE_SERVICE_ROLE_KEY ist der Platzhalter oder ungültig. ' +
      'DB-Abfragen schlagen fehl. Trage den echten Key aus dem Supabase Dashboard in .env.local ein.'
    )
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
