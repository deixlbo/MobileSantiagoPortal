import { supabase } from './supabase'

export const RESIDENT_UPLOAD_BUCKET = 'resident-uploads'
export const ASSETS_BUCKET = 'assets'
export const DOCUMENT_STORAGE_PREFIX = 'documents'
export const ID_STORAGE_PREFIX = 'ids'
export const ASSETS_IMAGES_PREFIX = 'images'

/**
 * Initialize storage buckets if they don't exist
 * This should be called once during app initialization
 */
export async function initializeStorageBuckets() {
  try {
    // Check if buckets exist
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.warn('[Storage] Error listing buckets:', listError)
      return false
    }

    const residentBucketExists = buckets?.some(b => b.name === RESIDENT_UPLOAD_BUCKET)
    const assetsBucketExists = buckets?.some(b => b.name === ASSETS_BUCKET)

    // Create resident-uploads bucket if needed
    if (!residentBucketExists) {
      console.log('[Storage] Creating resident-uploads bucket...')
      const { error: createError } = await supabase.storage.createBucket(RESIDENT_UPLOAD_BUCKET, {
        public: false,
      })

      if (createError && !createError.message.includes('already exists')) {
        console.error('[Storage] Error creating resident-uploads bucket:', createError)
        return false
      }

      console.log('[Storage] Resident-uploads bucket created successfully')
    } else {
      console.log('[Storage] Resident-uploads bucket already exists')
    }

    // Create assets bucket if needed
    if (!assetsBucketExists) {
      console.log('[Storage] Creating assets bucket...')
      const { error: createError } = await supabase.storage.createBucket(ASSETS_BUCKET, {
        public: true,
      })

      if (createError && !createError.message.includes('already exists')) {
        console.error('[Storage] Error creating assets bucket:', createError)
        return false
      }

      console.log('[Storage] Assets bucket created successfully')
    } else {
      console.log('[Storage] Assets bucket already exists')
    }

    return true
  } catch (error) {
    console.error('[Storage] Fatal error initializing buckets:', error)
    return false
  }
}

/**
 * Generate public URL for a storage object
 */
export function getPublicUrl(path: string): string {
  const { data } = supabase.storage
    .from(RESIDENT_UPLOAD_BUCKET)
    .getPublicUrl(path)
  
  return data.publicUrl
}

/**
 * Upload a file to storage
 */
export async function uploadFile(
  path: string,
  file: File | Buffer,
  options?: { contentType?: string; upsert?: boolean }
) {
  try {
    const { data, error } = await supabase.storage
      .from(RESIDENT_UPLOAD_BUCKET)
      .upload(path, file, {
        contentType: options?.contentType,
        upsert: options?.upsert ?? false,
        cacheControl: '3600',
      })

    if (error) {
      throw error
    }

    return { data, error: null }
  } catch (error) {
    console.error('[Storage] Upload error:', error)
    return { data: null, error }
  }
}

/**
 * Download a file from storage
 */
export async function downloadFile(path: string) {
  try {
    const { data, error } = await supabase.storage
      .from(RESIDENT_UPLOAD_BUCKET)
      .download(path)

    if (error) {
      throw error
    }

    return { data, error: null }
  } catch (error) {
    console.error('[Storage] Download error:', error)
    return { data: null, error }
  }
}

/**
 * Delete a file from storage
 */
export async function deleteFile(path: string) {
  try {
    const { data, error } = await supabase.storage
      .from(RESIDENT_UPLOAD_BUCKET)
      .remove([path])

    if (error) {
      throw error
    }

    return { data, error: null }
  } catch (error) {
    console.error('[Storage] Delete error:', error)
    return { data: null, error }
  }
}

/**
 * Delete multiple files from storage
 */
export async function deleteFiles(paths: string[]) {
  try {
    const { data, error } = await supabase.storage
      .from(RESIDENT_UPLOAD_BUCKET)
      .remove(paths)

    if (error) {
      throw error
    }

    return { data, error: null }
  } catch (error) {
    console.error('[Storage] Batch delete error:', error)
    return { data: null, error }
  }
}

/**
 * List files in a directory
 */
export async function listFiles(path: string) {
  try {
    const { data, error } = await supabase.storage
      .from(RESIDENT_UPLOAD_BUCKET)
      .list(path, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      })

    if (error) {
      throw error
    }

    return { data, error: null }
  } catch (error) {
    console.error('[Storage] List error:', error)
    return { data: null, error }
  }
}

/**
 * Upload asset image to storage
 */
export async function uploadAssetImage(
  assetId: string,
  file: File | ArrayBuffer,
  options?: { contentType?: string; upsert?: boolean }
) {
  try {
    await initializeStorageBuckets()

    const fileName = `${Date.now()}-${file instanceof File ? file.name : 'image'}`
    const storagePath = `${ASSETS_IMAGES_PREFIX}/${assetId}/${fileName}`
    const uploadFile = file instanceof File ? file : new Uint8Array(file)

    const { data, error } = await supabase.storage
      .from(ASSETS_BUCKET)
      .upload(storagePath, uploadFile, {
        contentType: options?.contentType || (file instanceof File ? file.type : 'image/jpeg'),
        upsert: options?.upsert ?? false,
        cacheControl: '3600',
      })

    if (error) {
      throw error
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(ASSETS_BUCKET)
      .getPublicUrl(storagePath)

    return { data, publicUrl: publicUrlData.publicUrl, error: null }
  } catch (error) {
    console.error('[Storage] Asset image upload error:', error)
    return { data: null, publicUrl: null, error }
  }
}

/**
 * Get public URL for asset image
 */
export function getAssetImageUrl(assetId: string, fileName: string): string {
  const storagePath = `${ASSETS_IMAGES_PREFIX}/${assetId}/${fileName}`
  const { data } = supabase.storage
    .from(ASSETS_BUCKET)
    .getPublicUrl(storagePath)
  
  return data.publicUrl
}

/**
 * Delete asset image from storage
 */
export async function deleteAssetImage(assetId: string, fileName: string) {
  try {
    const storagePath = `${ASSETS_IMAGES_PREFIX}/${assetId}/${fileName}`
    const { data, error } = await supabase.storage
      .from(ASSETS_BUCKET)
      .remove([storagePath])

    if (error) {
      throw error
    }

    return { data, error: null }
  } catch (error) {
    console.error('[Storage] Asset image delete error:', error)
    return { data: null, error }
  }
}
