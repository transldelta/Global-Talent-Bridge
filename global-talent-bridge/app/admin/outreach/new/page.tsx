import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentAdminUser } from '@/lib/admin'
import { NavBar } from '@/app/_components/NavBar'
import { NewTargetForm } from './NewTargetForm'

export default async function NewOutreachTargetPage() {
  const admin = await getCurrentAdminUser()
  if (!admin) redirect('/auth/login')

  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar badge="Admin" badgeColor="purple" />

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        <div>
          <Link
            href="/admin/outreach"
            className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            ← Zurück zu Outreach
          </Link>
          <h1 className="text-2xl font-bold text-white mt-3">➕ Neues Outreach-Ziel</h1>
          <p className="text-gray-400 text-sm mt-1">
            Firma manuell erfassen. Keine E-Mail wird gesendet. Kein Massenkontakt.
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <NewTargetForm />
        </div>

        <div className="p-4 bg-green-900/10 border border-green-800/30 rounded-xl flex items-start gap-3">
          <span className="text-green-400 shrink-0">🔒</span>
          <p className="text-green-300/70 text-xs leading-relaxed">
            Alle Daten werden über den Service Role Key serverseitig gespeichert.
            Kein öffentlicher Zugriff. RLS aktiv ohne permissive Policies für anon/authenticated.
          </p>
        </div>
      </div>
    </div>
  )
}
