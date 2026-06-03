import { NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * POST /api/admin/notifications/mark-read
 * Body: { id: string } oder { all: true }
 */
export async function POST(req: Request) {
  const adminUser = await getCurrentAdminUser()
  if (!adminUser) {
    return NextResponse.json({ error: 'Zugriff verweigert.' }, { status: 403 })
  }

  const body = await req.json().catch(() => ({})) as { id?: string; all?: boolean }
  const supabase = createAdminClient()

  if (body.all === true) {
    const { error } = await supabase
      .from('agent_notifications')
      .update({ is_read: true })
      .eq('is_read', false)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, marked: 'all' })
  }

  if (body.id) {
    const { error } = await supabase
      .from('agent_notifications')
      .update({ is_read: true })
      .eq('id', body.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, id: body.id })
  }

  return NextResponse.json({ error: 'id oder all=true erforderlich.' }, { status: 400 })
}
