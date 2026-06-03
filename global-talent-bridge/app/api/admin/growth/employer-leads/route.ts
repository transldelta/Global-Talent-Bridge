import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const adminSupabase = createAdminClient()
    const { data, error } = await adminSupabase
      .from('employer_leads')
      .select('*')
      .order('score', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ leads: data ?? [] })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Fehler'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const adminSupabase = createAdminClient()
    const body = await request.json() as {
      company_name: string
      contact_name?: string
      contact_email?: string
      city?: string
      sector?: string
      company_size?: string
      source?: string
      notes?: string
    }

    if (!body.company_name) {
      return NextResponse.json({ error: 'company_name ist erforderlich.' }, { status: 400 })
    }

    const { data, error } = await adminSupabase
      .from('employer_leads')
      .insert({
        company_name: body.company_name,
        contact_name: body.contact_name ?? null,
        contact_email: body.contact_email ?? null,
        city: body.city ?? null,
        sector: body.sector ?? null,
        company_size: body.company_size ?? 'medium',
        source: body.source ?? 'manual',
        notes: body.notes ?? null,
        status: 'new',
        priority: 'medium',
        score: 0,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ success: true, lead: data })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Fehler'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
