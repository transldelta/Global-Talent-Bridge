/**
 * app/api/admin/promo-video/voiceover-upload/route.ts
 *
 * Admin-only endpoint: receives a voiceover audio file and saves it to
 * public/promo-video/source-clips/audio/ for local development use.
 *
 * IMPORTANT: Vercel serverless functions have an ephemeral filesystem.
 * Writes to /tmp or the project directory do NOT persist between requests.
 * This endpoint only works in local development (npm run dev).
 * In production (Vercel), it returns an honest "local-only" response.
 *
 * Safety: no robot voice · no TTS · no Stripe · no email sending · no scraping ·
 *         no job guarantee · no visa guarantee · admin-only
 */
import { type NextRequest, NextResponse } from 'next/server'
import { getCurrentAdminUser } from '@/lib/admin'

const ALLOWED_TYPES = [
  'audio/webm',
  'audio/ogg',
  'audio/mp4',
  'audio/mpeg',
  'audio/wav',
  'audio/x-wav',
  'audio/x-m4a',
  'audio/m4a',
]

const MAX_SIZE_BYTES = 50 * 1024 * 1024 // 50 MB

export async function POST(req: NextRequest) {
  // Auth check
  const admin = await getCurrentAdminUser()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Vercel production: filesystem not persistent — honest response
  const isVercel = !!process.env.VERCEL
  if (isVercel) {
    return NextResponse.json({
      saved: false,
      localOnly: true,
      message:
        'Running on Vercel — the serverless filesystem is not persistent. ' +
        'Please download the file from the recorder and provide it to Claude for mixing, ' +
        'or run the mix script locally: bash scripts/mix-human-voiceover.sh <your-file>',
    })
  }

  // Local development: save file
  try {
    const formData = await req.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate size
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: 'File too large (max 50 MB)' }, { status: 400 })
    }

    // Validate type
    const fileType = file.type.toLowerCase().split(';')[0]
    if (!ALLOWED_TYPES.includes(fileType)) {
      return NextResponse.json({
        error: `Unsupported file type: ${file.type}. Accepted: webm, ogg, mp4, mp3, wav, m4a`
      }, { status: 400 })
    }

    // Determine extension
    const extMap: Record<string, string> = {
      'audio/webm': 'webm',
      'audio/ogg': 'ogg',
      'audio/mp4': 'm4a',
      'audio/mpeg': 'mp3',
      'audio/wav': 'wav',
      'audio/x-wav': 'wav',
      'audio/x-m4a': 'm4a',
      'audio/m4a': 'm4a',
    }
    const ext = extMap[fileType] ?? 'webm'
    const filename = `corridorwork-vo-en-human.${ext}`

    // Save to source-clips/audio/
    const { writeFile, mkdir } = await import('fs/promises')
    const { join } = await import('path')

    const audioDir = join(process.cwd(), 'public', 'promo-video', 'source-clips', 'audio')
    await mkdir(audioDir, { recursive: true })

    const destPath = join(audioDir, filename)
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(destPath, buffer)

    return NextResponse.json({
      saved: true,
      filename,
      path: `public/promo-video/source-clips/audio/${filename}`,
      size: file.size,
      message:
        `Saved to public/promo-video/source-clips/audio/${filename}. ` +
        `Now run: bash scripts/mix-human-voiceover.sh public/promo-video/source-clips/audio/${filename}`,
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: `Save failed: ${msg}` }, { status: 500 })
  }
}
