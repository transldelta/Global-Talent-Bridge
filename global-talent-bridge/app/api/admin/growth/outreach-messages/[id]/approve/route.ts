import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

async function getCurrentAdminUser() {
  try {
    const adminSupabase = createAdminClient()
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('role, full_name, email')
      .eq('id', user.id)
      .single()
    if (!profile || profile.role !== 'admin') return null
    return { ...user, full_name: profile.full_name, email_addr: profile.email ?? user.email }
  } catch {
    return null
  }
}

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const adminUser = await getCurrentAdminUser()
  if (!adminUser) {
    return NextResponse.json({ error: 'Zugriff verweigert.' }, { status: 403 })
  }

  const adminSupabase = createAdminClient()
  const { error } = await adminSupabase
    .from('outreach_messages')
    .update({
      status: 'approved',
      approved_by: adminUser.email ?? 'admin',
      approved_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', params.id)
    .eq('status', 'draft')

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true, note: 'Nachricht freigegeben. Kann jetzt versendet werden.' })
}
