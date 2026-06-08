/**
 * app/admin/contact-copilot/page.tsx — /admin/contact-copilot
 *
 * Approval-Based Contact Copilot — prepares outreach, never sends automatically.
 * Admin-only. No automatic sending. No send button. No scraping.
 */
import { getCurrentAdminUser }    from '@/lib/admin'
import { redirect }               from 'next/navigation'
import { NavBar }                 from '@/app/_components/NavBar'
import { ContactCopilotClient }   from './_components/ContactCopilotClient'

export const metadata = {
  title:  'Contact Copilot | CorridorWork Admin',
  robots: 'noindex, nofollow',
}

export default async function ContactCopilotPage() {
  // ── Admin Guard ──────────────────────────────────────────────────────────
  const admin = await getCurrentAdminUser()
  if (!admin) redirect('/auth/login?redirectTo=/admin/contact-copilot')

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <NavBar badge="Admin" badgeColor="purple" />

      <div className="max-w-3xl mx-auto px-4 py-10">
        <ContactCopilotClient />
      </div>
    </div>
  )
}
