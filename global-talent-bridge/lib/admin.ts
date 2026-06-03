import 'server-only'

/**
 * Prüft ob die gegebene E-Mail-Adresse Administrator-Rechte hat.
 * Admin-Liste kommt aus der ADMIN_EMAILS Umgebungsvariable (serverseitig).
 * Diese Funktion darf NIEMALS im Client verwendet werden.
 */
export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false

  const adminEmailsRaw = process.env.ADMIN_EMAILS ?? ''
  const adminEmails = adminEmailsRaw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)

  return adminEmails.includes(email.toLowerCase())
}
