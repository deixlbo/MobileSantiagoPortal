import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import { RESIDENT_UPLOAD_BUCKET, DOCUMENT_STORAGE_PREFIX } from '@/lib/storage'

async function insertUploadRecord(payload: Record<string, any>) {
  const timestamp = payload.uploaded_at || payload.upload_date || new Date().toISOString()
  const candidatePayloads = [
    {
      document_id: payload.document_id ?? payload.document_request_id,
      resident_id: payload.resident_id ?? payload.uploaded_by,
      requirement_name: payload.requirement_name,
      file_url: payload.file_url ?? payload.file_path ?? '',
      file_name: payload.file_name,
      file_type: payload.file_type,
      file_size: payload.file_size,
      storage_path: payload.storage_path ?? payload.file_path ?? '',
      upload_date: timestamp,
      created_at: timestamp,
      updated_at: timestamp,
      is_verified: false,
    },
    {
      document_id: payload.document_id ?? payload.document_request_id,
      resident_id: payload.resident_id ?? payload.uploaded_by,
      requirement_name: payload.requirement_name,
      file_name: payload.file_name,
      file_url: payload.file_url ?? payload.file_path ?? '',
      file_path: payload.file_path ?? payload.storage_path ?? '',
      file_size: payload.file_size,
      file_type: payload.file_type,
      uploaded_by: payload.uploaded_by ?? payload.resident_id,
      uploaded_at: timestamp,
      upload_status: payload.upload_status ?? 'uploaded',
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      document_request_id: payload.document_request_id ?? payload.document_id,
      resident_id: payload.resident_id ?? payload.uploaded_by,
      requirement_name: payload.requirement_name,
      file_name: payload.file_name,
      file_path: payload.file_path ?? payload.storage_path ?? '',
      file_url: payload.file_url ?? payload.file_path ?? '',
      file_size: payload.file_size,
      file_type: payload.file_type,
      uploaded_by: payload.uploaded_by ?? payload.resident_id,
      uploaded_at: timestamp,
      upload_status: payload.upload_status ?? 'uploaded',
      created_at: timestamp,
      updated_at: timestamp,
    },
  ]

  for (const attempt of candidatePayloads) {
    const { data, error } = await supabaseServer
      .from('document_uploads')
      .insert([attempt])
      .select()
      .single()

    if (!error) {
      return { data, error: null }
    }

    const message = String(error?.message || error?.details || '')
    if (!message.includes('column') && !message.includes('does not exist') && !message.includes('violates')) {
      return { data: null, error }
    }
  }

  return { data: null, error: new Error('Unable to record upload in document_uploads table') }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const documentId = formData.get('documentId') as string
    const residentId = formData.get('residentId') as string
    const requirementName = formData.get('requirementName') as string

    if (!file || !documentId || !residentId || !requirementName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      )
    }

    const buffer = await file.arrayBuffer()
    const fileName = `${Date.now()}-${file.name}`
    const storagePath = `${DOCUMENT_STORAGE_PREFIX}/${residentId}/${documentId}/${fileName}`

    const { data: uploadData, error: uploadError } = await supabaseServer.storage
      .from(RESIDENT_UPLOAD_BUCKET)
      .upload(storagePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('[v0] Storage error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      )
    }

    const { data: publicUrl } = supabaseServer.storage
      .from(RESIDENT_UPLOAD_BUCKET)
      .getPublicUrl(storagePath)

    const uploadPayload = {
      document_request_id: documentId,
      document_id: documentId,
      resident_id: residentId,
      requirement_name: requirementName,
      file_name: file.name,
      file_path: storagePath,
      file_url: publicUrl.publicUrl,
      file_size: file.size,
      file_type: file.type,
      uploaded_by: residentId,
      uploaded_at: new Date().toISOString(),
      upload_status: 'uploaded',
    }

    const { data: uploadRecord, error: dbError } = await insertUploadRecord(uploadPayload)

    if (dbError) {
      console.error('[v0] Database error:', dbError)
      await supabaseServer.storage
        .from(RESIDENT_UPLOAD_BUCKET)
        .remove([storagePath])

      return NextResponse.json(
        { error: 'Failed to record upload' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        upload: uploadRecord,
        fileUrl: publicUrl.publicUrl,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[v0] Upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
