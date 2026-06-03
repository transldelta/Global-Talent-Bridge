import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

async function getCurrentAdminEmail() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    const adminSupabase = createAdminClient()
    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    if (profile?.role !== 'admin') return null
    return user.email ?? 'admin'
  } catch {
    return null
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const adminEmail = await getCurrentAdminEmail()
  if (!adminEmail) return NextResponse.json({ error: 'Zugriff verweigert.' }, { status: 403 })

  const body = await request.json() as {
    action: 'approve' | 'reject' | 'notify_employer'
    admin_note?: string
  }

  if (!['approve', 'reject', 'notify_employer'].includes(body.action)) {
    return NextResponse.json({ error: 'Ungültige Aktion.' }, { status: 400 })
  }

  const adminSupabase = createAdminClient()
  const now = new Date().toISOString()

  let updateData: Record<string, string | null> = {
    reviewed_by: adminEmail,
    reviewed_at: now,
    admin_note: body.admin_note ?? null,
  }

  if (body.action === 'approve') {
    updateData.status = 'employer_notified'
    updateData.employer_notified_at = now
  } else if (body.action === 'reject') {
    updateData.status = 'rejected'
  } else if (body.action === 'notify_employer') {
    updateData.status = 'employer_notified'
    updateData.employer_notified_at = now
  }

  const { error } = await adminSupabase
    .from('application_requests')
    .update(updateData)
    .eq('id', params.id)

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 })

  const actionLabel =
    body.action === 'approve' ? 'Bewerbung freigegeben' :
    body.action === 'reject' ? 'Bewerbung abgelehnt' :
    'Arbeitgeber informiert'

  return NextResponse.json({ success: true, note: actionLabel })
}
