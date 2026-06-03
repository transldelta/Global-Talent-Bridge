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
      .select('role')
      .eq('id', user.id)
      .single()
    if (!profile || profile.role !== 'admin') return null
    return user
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

  // Only allow marking as sent if status is 'approved'
  const { data: msg } = await adminSupabase
    .from('outreach_messages')
    .select('status')
    .eq('id', params.id)
    .single()

  if (!msg || msg.status !== 'approved') {
    return NextResponse.json(
      { success: false, error: 'Nachricht muss zuerst freigegeben werden.' },
      { status: 400 }
    )
  }

  const { error } = await adminSupabase
    .from('outreach_messages')
    .update({
      status: 'sent',
      sent_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', params.id)

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true, note: 'Als versendet markiert.' })
}
