import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase-server'
import { persistProfileImageUpload } from '@/lib/profile-upload'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const userId = formData.get('userId') as string | null
    const file = formData.get('file') as File | null

    if (!userId || !file || !(file instanceof File)) {
      return NextResponse.json({ error: 'Missing file or user id' }, { status: 400 })
    }

    const result = await persistProfileImageUpload({ userId, file })

    return NextResponse.json({
      success: true,
      fileUrl: result.publicUrl,
      storagePath: result.storagePath,
    })
  } catch (error) {
    console.error('[profile-photo] upload failed', error)
    return NextResponse.json({ error: 'Unable to upload profile photo' }, { status: 500 })
  }
}
