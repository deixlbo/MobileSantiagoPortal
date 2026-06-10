import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { RESIDENT_UPLOAD_BUCKET, DOCUMENT_STORAGE_PREFIX } from '@/lib/storage'

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

    // Convert file to buffer
    const buffer = await file.arrayBuffer()
    const fileName = `${Date.now()}-${file.name}`
    const storagePath = `${DOCUMENT_STORAGE_PREFIX}/${residentId}/${documentId}/${fileName}`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
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

    // Get public URL
    const { data: publicUrl } = supabase.storage
      .from(RESIDENT_UPLOAD_BUCKET)
      .getPublicUrl(storagePath)

    // Record upload in database
    // The document_uploads table uses document_request_id, not document_id
    const uploadPayload = {
      document_request_id: documentId,
      file_name: file.name,
      file_path: storagePath,
      file_size: file.size,
      file_type: file.type,
      uploaded_by: residentId,
      uploaded_at: new Date().toISOString(),
      upload_status: 'uploaded',
    }

    const result = await supabase
      .from('document_uploads')
      .insert([uploadPayload])
      .select()
      .single()

    const uploadRecord = result.data
    const dbError = result.error

    if (dbError) {
      console.error('[v0] Database error:', dbError)
      // Clean up storage if database insert/update fails
      await supabase.storage
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
