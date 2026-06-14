import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import { RESIDENT_UPLOAD_BUCKET, DOCUMENT_STORAGE_PREFIX } from '@/lib/storage'

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  if (error && typeof error === 'object') {
    return (error as any).message || (error as any).error_description || JSON.stringify(error)
  }

  return 'Unknown error'
}

async function insertUploadRecord(payload: Record<string, any>) {
  const timestamp = payload.uploaded_at || new Date().toISOString()
  const attempts = [
    {
      document_id: payload.document_id ?? payload.document_request_id,
      resident_id: payload.resident_id,
      requirement_name: payload.requirement_name,
      file_name: payload.file_name,
      file_url: payload.file_url,
      file_type: payload.file_type,
      file_size: payload.file_size,
      storage_path: payload.storage_path,
      upload_date: timestamp,
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      document_id: payload.document_id ?? payload.document_request_id,
      resident_id: payload.resident_id,
      requirement_name: payload.requirement_name,
      file_name: payload.file_name,
      file_path: payload.storage_path,
      file_url: payload.file_url,
      file_size: payload.file_size,
      file_type: payload.file_type,
      uploaded_by: payload.uploaded_by,
      uploaded_at: timestamp,
      upload_status: payload.upload_status || 'uploaded',
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      document_request_id: payload.document_request_id,
      resident_id: payload.resident_id,
      requirement_name: payload.requirement_name,
      file_name: payload.file_name,
      file_path: payload.storage_path,
      file_size: payload.file_size,
      file_type: payload.file_type,
      uploaded_by: payload.uploaded_by,
      uploaded_at: timestamp,
      upload_status: payload.upload_status || 'uploaded',
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      file_name: payload.file_name,
      file_path: payload.storage_path,
      file_size: payload.file_size,
      file_type: payload.file_type,
      uploaded_by: payload.uploaded_by,
      uploaded_at: timestamp,
      upload_status: payload.upload_status || 'uploaded',
    },
  ]

  for (const attempt of attempts) {
    const { data, error } = await supabaseServer
      .from('document_uploads')
      .insert([attempt])
      .select()
      .single()

    if (!error) {
      return { data, error: null }
    }

    const message = String(error?.message || '')
    if (!message.includes('column') && !message.includes('does not exist')) {
      return { data: null, error }
    }
  }

  return { data: null, error: new Error('Unable to record upload in document_uploads table') }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: userData, error: authError } = await supabaseServer.auth.getUser(token)
    if (authError || !userData?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Missing file upload' }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const safeFileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    const storagePath = `${DOCUMENT_STORAGE_PREFIX}/announcements/${userData.user.id}/${safeFileName}`

    const { data: uploadData, error: uploadError } = await supabaseServer.storage
      .from(RESIDENT_UPLOAD_BUCKET)
      .upload(storagePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      return NextResponse.json({ error: `Failed to upload file: ${getErrorMessage(uploadError)}` }, { status: 500 })
    }

    const { data: publicUrlData } = supabaseServer.storage
      .from(RESIDENT_UPLOAD_BUCKET)
      .getPublicUrl(storagePath)

    const uploadPayload = {
      requirement_name: 'announcement_image',
      file_name: file.name,
      file_url: publicUrlData.publicUrl,
      file_type: file.type,
      file_size: file.size,
      storage_path: storagePath,
      uploaded_by: userData.user.id,
      upload_status: 'uploaded',
    }

    const { data: uploadRecord, error: dbError } = await insertUploadRecord(uploadPayload)

    if (dbError) {
      await supabaseServer.storage.from(RESIDENT_UPLOAD_BUCKET).remove([storagePath])
      return NextResponse.json({ error: `Failed to record upload: ${getErrorMessage(dbError)}` }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      upload: uploadRecord,
      fileUrl: publicUrlData.publicUrl,
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: `Upload failed: ${getErrorMessage(error)}` }, { status: 500 })
  }
}
