import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

  const body = await request.json() as {
    candidate_id: string
    job_id?: string
    application_id?: string
    proposed_date?: string
    proposed_time?: string
    format?: string
    message?: string
  }

  if (!body.candidate_id) return NextResponse.json({ error: 'candidate_id fehlt.' }, { status: 400 })

  const supabase = createClient()
  const { data, error } = await supabase
    .from('interview_requests')
    .insert({
      employer_id: employerId,
      candidate_id: body.candidate_id,
      job_id: body.job_id ?? null,
      application_id: body.application_id ?? null,
      proposed_date: body.proposed_date ?? null,
      proposed_time: body.proposed_time ?? null,
      format: body.format ?? 'video',
      message: body.message ?? null,
      status: 'pending',
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ success: true, note: 'Interview-Anfrage bereits gestellt.' })
    }
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({
    success: true,
    id: data.id,
    note: 'Interview-Anfrage erstellt. Admin-Freigabe erforderlich bevor Kandidat informiert wird.',
  })
}
