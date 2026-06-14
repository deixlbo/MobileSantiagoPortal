import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

async function fetchUploadsForDocument(documentId: string, residentId?: string | null, documentField: 'document_request_id' | 'document_id' = 'document_request_id') {
  let query = supabaseServer
    .from('document_uploads')
    .select('*')
    .eq(documentField, documentId)
    .order('uploaded_at', { ascending: false })

  if (residentId) {
    const byUploader = await query.eq('uploaded_by', residentId)
    if (!byUploader.error && Array.isArray(byUploader.data) && byUploader.data.length > 0) {
      return { data: byUploader.data, error: null }
    }

    const byResident = await query.eq('resident_id', residentId)
    if (!byResident.error && Array.isArray(byResident.data) && byResident.data.length > 0) {
      return { data: byResident.data, error: null }
    }

    if (byUploader.error) {
      const message = String(byUploader.error?.message || '')
      if (message.includes('column') || message.includes('does not exist')) {
        return query
      }
      return { data: null, error: byUploader.error }
    }

    if (byResident.error) {
      const message = String(byResident.error?.message || '')
      if (message.includes('column') || message.includes('does not exist')) {
        return query
      }
      return { data: null, error: byResident.error }
    }
  }

  return query
}

async function attachUploadUrls(uploads: any[] = []) {
  if (!Array.isArray(uploads) || uploads.length === 0) {
    return []
  }

  return Promise.all(
    uploads.map(async (upload: any) => {
      const storagePath = upload.file_path || upload.storage_path || ''
      if (!storagePath) {
        return { ...upload, file_url: upload.file_url || '' }
      }

      if (upload.file_url) {
        return upload
      }

      try {
        const { data, error } = await supabaseServer.storage
          .from('resident-uploads')
          .createSignedUrl(storagePath, 60 * 60 * 24)

        if (!error && data?.signedUrl) {
          return { ...upload, file_url: data.signedUrl }
        }
      } catch (error) {
        console.warn('[documents/uploads] Failed to create signed URL:', error)
      }

      return { ...upload, file_url: upload.file_url || '' }
    })
  )
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get('documentId')
    const residentId = searchParams.get('residentId')

    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      )
    }

    const fields: Array<'document_request_id' | 'document_id'> = ['document_request_id', 'document_id']
    let uploads: any[] = []

    for (const field of fields) {
      const { data, error } = await fetchUploadsForDocument(documentId, residentId, field)

      if (error) {
        const message = String(error?.message || '')
        if (!message.includes('column') && !message.includes('does not exist')) {
          console.error('[v0] Fetch error:', error)
          return NextResponse.json(
            { error: 'Failed to fetch uploads' },
            { status: 500 }
          )
        }
        continue
      }

      uploads = Array.isArray(data) ? data : []
      if (uploads.length > 0 || !residentId) {
        break
      }
    }

    const uploadsWithUrls = await attachUploadUrls(uploads)

    return NextResponse.json(
      {
        success: true,
        uploads: uploadsWithUrls,
        count: uploadsWithUrls.length,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const uploadId = searchParams.get('uploadId')
    const residentId = searchParams.get('residentId')

    if (!uploadId) {
      return NextResponse.json({ error: 'Upload ID is required' }, { status: 400 })
    }

    const { data: upload, error: fetchError } = await supabaseServer
      .from('document_uploads')
      .select('*')
      .eq('id', uploadId)
      .single()

    if (fetchError || !upload) {
      return NextResponse.json({ error: 'Upload not found' }, { status: 404 })
    }

    if (residentId && upload.uploaded_by !== residentId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    if (upload.file_path) {
      await supabaseServer.storage.from('resident-uploads').remove([upload.file_path])
    }

    const { error: deleteError } = await supabaseServer
      .from('document_uploads')
      .delete()
      .eq('id', uploadId)

    if (deleteError) {
      return NextResponse.json({ error: 'Failed to delete upload' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Delete upload error:', error)
    return NextResponse.json({ error: 'Failed to delete upload' }, { status: 500 })
  }
}
