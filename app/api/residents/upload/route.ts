import { NextRequest, NextResponse } from 'next/server'
import { put, del } from '@vercel/blob'
import { supabaseServer } from '@/lib/supabase-server'

// Allowed file types for resident uploads
const ALLOWED_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'application/pdf': ['.pdf'],
  'image/webp': ['.webp'],
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

interface UploadResponse {
  success: boolean
  url?: string
  filename?: string
  size?: number
  error?: string
}

/**
 * POST /api/residents/upload
 * Handles file uploads for resident documents and photos
 * Stores files in Vercel Blob and links them to Supabase profiles
 */
export async function POST(request: NextRequest): Promise<NextResponse<UploadResponse>> {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const residentId = formData.get('residentId') as string
    const uploadType = formData.get('uploadType') as string // 'id_photo', 'document', 'proof_of_residency'

    // Validate required fields
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!residentId) {
      return NextResponse.json(
        { success: false, error: 'Resident ID is required' },
        { status: 400 }
      )
    }

    if (!uploadType) {
      return NextResponse.json(
        { success: false, error: 'Upload type is required (id_photo, document, proof_of_residency)' },
        { status: 400 }
      )
    }

    // Validate file type
    const mimeType = file.type
    if (!ALLOWED_TYPES[mimeType as keyof typeof ALLOWED_TYPES]) {
      const allowedTypes = Object.keys(ALLOWED_TYPES).join(', ')
      return NextResponse.json(
        { success: false, error: `Invalid file type. Allowed types: ${allowedTypes}` },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: `File size exceeds maximum of 5MB. Your file: ${(file.size / 1024 / 1024).toFixed(2)}MB` },
        { status: 400 }
      )
    }

    // Verify resident exists in Supabase
    const { data: resident, error: residentError } = await supabaseServer
      .from('profiles')
      .select('id, email')
      .eq('id', residentId)
      .single()

    if (residentError || !resident) {
      console.error('[Residents Upload] Resident not found:', residentId, residentError)
      return NextResponse.json(
        { success: false, error: 'Resident account not found' },
        { status: 404 }
      )
    }

    // Create unique filename with resident ID and timestamp
    const timestamp = Date.now()
    const ext = file.name.substring(file.name.lastIndexOf('.')) || '.bin'
    const filename = `residents/${residentId}/${uploadType}-${timestamp}${ext}`

    console.log('[v0] Starting file upload to Blob:', filename)

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'private',
      metadata: {
        residentId,
        uploadType,
        originalFilename: file.name,
        uploadedAt: new Date().toISOString(),
      },
    })

    console.log('[v0] File uploaded to Blob successfully:', blob.url)

    // Update resident profile with uploaded file URL based on upload type
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (uploadType === 'id_photo') {
      updateData.id_path = blob.url
    } else if (uploadType === 'document') {
      updateData.document_path = blob.url
    } else if (uploadType === 'proof_of_residency') {
      updateData.proof_of_residency_path = blob.url
    }

    const { data: updatedResident, error: updateError } = await supabaseServer
      .from('profiles')
      .update(updateData)
      .eq('id', residentId)
      .select()
      .single()

    if (updateError) {
      console.error('[Residents Upload] Failed to update profile:', updateError.message)
      // Note: File was uploaded to Blob but profile update failed
      return NextResponse.json(
        { 
          success: true, 
          url: blob.url,
          filename: blob.filename,
          size: file.size,
          error: 'File uploaded but profile link failed. Please contact admin.'
        },
        { status: 201 }
      )
    }

    console.log('[v0] Resident profile updated with file URL')

    return NextResponse.json(
      {
        success: true,
        url: blob.url,
        filename: blob.filename,
        size: file.size,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[Residents Upload Exception]', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message || 'Failed to upload file' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/residents/upload
 * Deletes a file from Blob storage and clears the profile reference
 */
export async function DELETE(request: NextRequest): Promise<NextResponse<UploadResponse>> {
  try {
    const { searchParams } = new URL(request.url)
    const fileUrl = searchParams.get('url') as string
    const residentId = searchParams.get('residentId') as string
    const uploadType = searchParams.get('uploadType') as string

    if (!fileUrl) {
      return NextResponse.json(
        { success: false, error: 'File URL is required' },
        { status: 400 }
      )
    }

    if (!residentId || !uploadType) {
      return NextResponse.json(
        { success: false, error: 'Resident ID and upload type are required' },
        { status: 400 }
      )
    }

    // Delete from Blob
    try {
      await del(fileUrl)
      console.log('[v0] File deleted from Blob:', fileUrl)
    } catch (blobError) {
      console.warn('[Residents Upload] Blob deletion warning:', blobError instanceof Error ? blobError.message : String(blobError))
      // Continue - blob file might already be deleted
    }

    // Clear the file reference from Supabase profile
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (uploadType === 'id_photo') {
      updateData.id_path = null
    } else if (uploadType === 'document') {
      updateData.document_path = null
    } else if (uploadType === 'proof_of_residency') {
      updateData.proof_of_residency_path = null
    }

    const { data: updatedResident, error: updateError } = await supabaseServer
      .from('profiles')
      .update(updateData)
      .eq('id', residentId)
      .select()
      .single()

    if (updateError) {
      console.error('[Residents Upload] Failed to clear profile reference:', updateError.message)
      return NextResponse.json(
        { success: false, error: 'Failed to clear file reference from profile' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      filename: fileUrl,
    }, { status: 200 })
  } catch (error) {
    console.error('[Residents Upload DELETE Exception]', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message || 'Failed to delete file' },
      { status: 500 }
    )
  }
}
