import { NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/admin'
import { runPilotLaunchAgent } from '@/lib/agents/pilot-launch-agent'

export async function POST() {
  const admin = await getCurrentAdminUser()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const result = await runPilotLaunchAgent()
    return NextResponse.json({ success: true, result })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
