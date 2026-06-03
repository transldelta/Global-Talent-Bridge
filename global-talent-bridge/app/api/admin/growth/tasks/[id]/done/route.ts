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
  const { error } = await adminSupabase
    .from('growth_tasks')
    .update({
      status: 'done',
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', params.id)

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true, note: 'Aufgabe als erledigt markiert.' })
}
