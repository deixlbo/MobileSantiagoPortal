export function buildProfileImageStoragePath(userId, fileName) {
  const safeName = fileName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9._-]/g, '-')
  return `profiles/${userId}/${Date.now()}-${safeName}`
}

export function buildProfileImageUploadPayload(input) {
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
