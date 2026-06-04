import 'server-only'
import { NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  const admin = await getCurrentAdminUser()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('migration_intelligence')
    .select(`
      id,
      corridor_id,
      source_country,
      target_country,
      sector,
      visa_complexity,
      recognition_complexity,
      language_complexity,
      document_complexity,
      estimated_success_score,
      risk_level,
      required_documents,
      language_requirements,
      recognition_steps,
      visa_pathways,
      recommended_next_steps,
      disclaimer,
      status,
      created_at,
      updated_at
    `)
    .order('estimated_success_score', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}
