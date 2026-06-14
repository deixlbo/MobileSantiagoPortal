import { RESIDENT_UPLOAD_BUCKET, ID_STORAGE_PREFIX } from './storage'
import { getSupabaseServer } from './supabase-server'

export function buildProfileImageStoragePath(userId: string, fileName: string) {
  const safeName = fileName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9._-]/g, '-')
  return `${ID_STORAGE_PREFIX}/${userId}/${Date.now()}-${safeName}`
}

export function buildProfileImageUploadPayload(input: {
  userId: string
  fileName: string
  fileType: string
  fileSize: number
  storagePath: string
  publicUrl: string
}) {
  return {
    requirement_name: 'profile_photo',
    file_name: input.fileName,
    file_type: input.fileType,
    file_size: input.fileSize,
    file_path: input.storagePath,
    file_url: input.publicUrl,
    uploaded_by: input.userId,
    uploaded_at: new Date().toISOString(),
    upload_status: 'uploaded',
  }
}

async function insertProfileImageUploadRecord(payload: Record<string, any>) {
  const supabaseServer = getSupabaseServer()
  const attempts = [
    payload,
    {
      resident_id: payload.uploaded_by,
      requirement_name: payload.requirement_name,
      file_url: payload.file_url,
      file_name: payload.file_name,
      file_type: payload.file_type,
      file_size: payload.file_size,
      storage_path: payload.file_path,
      uploaded_at: payload.uploaded_at,
      upload_status: payload.upload_status,
    },
    {
      uploaded_by: payload.uploaded_by,
      requirement_name: payload.requirement_name,
      file_url: payload.file_url,
      file_name: payload.file_name,
      file_type: payload.file_type,
      file_size: payload.file_size,
      file_path: payload.file_path,
      uploaded_at: payload.uploaded_at,
      upload_status: payload.upload_status,
    },
  ]

  for (const attempt of attempts) {
    const { data, error } = await supabaseServer
      .from('document_uploads')
      .insert([attempt])
      .select()
      .maybeSingle()

    if (!error) {
      return { data, error: null }
    }

    const message = String(error?.message || '')
    if (!message.includes('column') && !message.includes('does not exist')) {
      return { data: null, error }
    }
  }

  return { data: null, error: new Error('Unable to record profile photo in document_uploads table') }
}

export async function persistProfileImageUpload({
  userId,
  file,
  bucket = RESIDENT_UPLOAD_BUCKET,
}: {
  userId: string
  file: File | Blob
  bucket?: string
}) {
  const storagePath = buildProfileImageStoragePath(userId, file instanceof File ? file.name : 'profile-image')
  const arrayBuffer = await file.arrayBuffer()
  const supabaseServer = getSupabaseServer()

  const { data: uploadData, error: uploadError } = await supabaseServer.storage
    .from(bucket)
    .upload(storagePath, arrayBuffer, {
      contentType: file.type || 'image/jpeg',
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) {
    throw uploadError
  }

  const { data: publicUrlData } = supabaseServer.storage.from(bucket).getPublicUrl(storagePath)
  const publicUrl = publicUrlData?.publicUrl || ''

  const payload = buildProfileImageUploadPayload({
    userId,
    fileName: file instanceof File ? file.name : 'profile-image',
    fileType: file.type || 'image/jpeg',
    fileSize: file.size,
    storagePath,
    publicUrl,
  })

  const { data: uploadRecord, error: uploadRecordError } = await insertProfileImageUploadRecord(payload)
  if (uploadRecordError) {
    throw uploadRecordError
  }

  const avatarColumns = ['profile_image_url', 'avatar_url', 'avatar'] as const
  for (const column of avatarColumns) {
    const { error } = await supabaseServer
      .from('profiles')
      .update({ [column]: publicUrl })
      .eq('id', userId)

    if (!error) {
      break
    }
  }

  return {
    storagePath,
    publicUrl,
    uploadRecord,
    uploadData,
  }
}
