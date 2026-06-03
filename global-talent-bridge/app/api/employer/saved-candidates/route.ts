import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

async function getEmployerId() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: employer } = await supabase
    .from('employers')
    .select('id')
    .eq('user_id', user.id)
    .single()
  return employer?.id ?? null
}

export async function POST(request: Request) {
  const employerId = await getEmployerId()
  if (!employerId) return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 403 })

  const body = await request.json() as { candidate_id: string; job_id?: string; note?: string }
  if (!body.candidate_id) return NextResponse.json({ error: 'candidate_id fehlt.' }, { status: 400 })

  const supabase = createClient()
  const { error } = await supabase
    .from('saved_candidates')
    .insert({
      employer_id: employerId,
      candidate_id: body.candidate_id,
      job_id: body.job_id ?? null,
      note: body.note ?? null,
    })

  if (error) {
    if (error.code === '23505') return NextResponse.json({ success: true, note: 'Bereits gespeichert.' })
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true, note: 'Kandidat gespeichert.' })
}

export async function DELETE(request: Request) {
  const employerId = await getEmployerId()
  if (!employerId) return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 403 })

  const body = await request.json() as { candidate_id: string; job_id?: string }
  const supabase = createClient()

  const query = supabase
    .from('saved_candidates')
    .delete()
    .eq('employer_id', employerId)
    .eq('candidate_id', body.candidate_id)

  const { error } = body.job_id ? await query.eq('job_id', body.job_id) : await query

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}

export async function GET() {
  const employerId = await getEmployerId()
  if (!employerId) return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 403 })

  const adminSupabase = createAdminClient()
  const { data, error } = await adminSupabase
    .from('saved_candidates')
    .select('id, candidate_id, job_id, note, created_at')
    .eq('employer_id', employerId)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ saved: data ?? [] })
}
