import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Erlaubte MIME-Types
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

// Max. Dateigröße: 5 MB
const MAX_SIZE_BYTES = 5 * 1024 * 1024

export async function POST(request: NextRequest) {
  // Auth prüfen
  const supabase = createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Nicht authentifiziert.' }, { status: 401 })
  }

  // FormData parsen
  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 })
  }

  const file = formData.get('cv') as File | null

  if (!file) {
    return NextResponse.json({ error: 'Keine Datei übermittelt.' }, { status: 400 })
  }

  // Dateityp validieren
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({
      error: 'Nur PDF, DOC und DOCX-Dateien sind erlaubt.',
    }, { status: 422 })
  }

  // Dateigröße validieren
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({
      error: `Datei ist zu groß. Maximum: 5 MB. Deine Datei: ${(file.size / 1024 / 1024).toFixed(1)} MB`,
    }, { status: 422 })
  }

  // Dateiname sichern (nur alphanumerisch + .-_)
  const originalName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const timestamp = Date.now()
  const storagePath = `${user.id}/${timestamp}_${originalName}`

  // Upload über service_role (umgeht RLS für Storage beim Upload durch API)
  const adminClient = createAdminClient()
  const fileBuffer = await file.arrayBuffer()

  const { error: uploadError } = await adminClient
    .storage
    .from('candidate-cvs')
    .upload(storagePath, fileBuffer, {
      contentType: file.type,
      upsert: false,
    })

  if (uploadError) {
    console.error('[upload-cv] Storage-Fehler:', uploadError.message)
    return NextResponse.json({
      error: 'Upload fehlgeschlagen. Bitte erneut versuchen.',
    }, { status: 500 })
  }

  // cv_url in candidates-Tabelle aktualisieren
  const { error: dbError } = await adminClient
    .from('candidates')
    .update({
      cv_url: storagePath,
      cv_filename: originalName,
      cv_uploaded_at: new Date().toISOString(),
    })
    .eq('user_id', user.id)

  if (dbError) {
    console.error('[upload-cv] DB-Update-Fehler:', dbError.message)
    // Datei trotzdem hochgeladen — kein Fehler zurückgeben
  }

  // system_logs Eintrag
  await adminClient.from('system_logs').insert({
    type: 'cv_upload',
    message: `CV hochgeladen: ${originalName}`,
    metadata: {
      user_id: user.id,
      path: storagePath,
      size_bytes: file.size,
      mime_type: file.type,
    },
  }).then(() => {})

  return NextResponse.json({
    success: true,
    path: storagePath,
    filename: originalName,
  })
}
