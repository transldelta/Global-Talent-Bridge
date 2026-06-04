import { NextRequest, NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/admin/download-cv?path=<storage-path>
 *
 * Generiert eine signierte 15-Minuten-URL zum CV-Download.
 * Nur für authentifizierte Admins zugänglich.
 */
export async function GET(request: NextRequest) {
  // Admin-Prüfung
  try {
    await getCurrentAdminUser()
  } catch {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 403 })
  }

  const path = request.nextUrl.searchParams.get('path')

  if (!path) {
    return NextResponse.json({ error: 'Storage-Pfad fehlt.' }, { status: 400 })
  }

  const adminClient = createAdminClient()

  const { data, error } = await adminClient
    .storage
    .from('candidate-cvs')
    .createSignedUrl(path, 900) // 15 Minuten

  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: 'Signierte URL konnte nicht erstellt werden.' }, { status: 500 })
  }

  // System-Log
  await adminClient.from('system_logs').insert({
    type: 'admin_cv_download',
    message: `Admin hat CV-Download-Link erstellt: ${path.split('/').pop()}`,
    metadata: { storage_path: path },
  }).then(() => {})

  // Weiterleitung zum signierten Download-Link
  return NextResponse.redirect(data.signedUrl)
}
