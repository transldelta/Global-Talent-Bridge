import { NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * POST /api/admin/agents/suggestions/[id]/reject
 * Setzt Vorschlag auf "rejected".
 */
export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const adminUser = await getCurrentAdminUser()
  if (!adminUser) {
    return NextResponse.json({ error: 'Zugriff verweigert.' }, { status: 403 })
  }

  const supabase = createAdminClient()

  const { error } = await supabase
    .from('agent_suggestions')
    .update({ status: 'rejected' })
    .eq('id', params.id)
    .in('status', ['suggested', 'approved'])

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await supabase.from('system_logs').insert({
    agent_name: 'suggestion_reject',
    status: 'success',
    message: `Vorschlag ${params.id} abgelehnt von ${adminUser.email}`,
  })

  return NextResponse.json({ success: true, id: params.id, status: 'rejected' })
}
