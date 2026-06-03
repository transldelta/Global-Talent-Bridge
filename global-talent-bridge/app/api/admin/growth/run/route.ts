import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { runGrowthAgent } from '@/lib/agents/growth-agent'

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

export async function POST() {
  const adminUser = await getCurrentAdminUser()
  if (!adminUser) {
    return NextResponse.json({ error: 'Zugriff verweigert.' }, { status: 403 })
  }

  try {
    const result = await runGrowthAgent()
    return NextResponse.json({ success: true, ...result })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unbekannter Fehler'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
