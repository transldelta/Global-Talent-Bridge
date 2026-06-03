import 'server-only'
import { createClient } from '@/lib/supabase/server'

/**
 * Liest Admin-E-Mails aus ADMIN_EMAILS Umgebungsvariable.
 * Nur serverseitig — niemals im Client verwenden.
 */
export function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? ''
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

/**
 * Prüft ob eine E-Mail-Adresse Admin-Rechte hat.
 * Case-insensitive. Mehrere E-Mails per Komma erlaubt.
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return getAdminEmails().includes(email.toLowerCase())
}

/**
 * Gibt den aktuell eingeloggten Admin-User zurück.
 * Nutzt den Supabase Server Client (Anon Key + Session aus Cookies).
 * Gibt null zurück wenn nicht eingeloggt oder kein Admin.
 */
export async function getCurrentAdminUser(): Promise<{
  id: string
  email: string
} | null> {
  try {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user || !user.email) return null
    if (!isAdminEmail(user.email)) return null

    return { id: user.id, email: user.email }
  } catch {
    return null
  }
}
