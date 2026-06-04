import { NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  const admin = await getCurrentAdminUser()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()

  const [
    employersRes, candidatesRes, tasksRes, feedbackRes, campaignsRes,
  ] = await Promise.all([
    supabase.from('pilot_employers').select('*').order('created_at', { ascending: false }),
    supabase.from('pilot_candidates').select('*').order('quality_score', { ascending: false }),
    supabase.from('pilot_tasks').select('*').order('created_at', { ascending: false }),
    supabase.from('pilot_feedback').select('*').order('created_at', { ascending: false }),
    supabase.from('pilot_campaigns').select('*').order('created_at', { ascending: false }),
  ])

  return NextResponse.json({
    employers:  employersRes.data  ?? [],
    candidates: candidatesRes.data ?? [],
    tasks:      tasksRes.data      ?? [],
    feedback:   feedbackRes.data   ?? [],
    campaigns:  campaignsRes.data  ?? [],
  })
}
