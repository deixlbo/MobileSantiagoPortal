import { useState, useCallback } from 'react'

interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

interface UploadResult {
  success: boolean
  url?: string
  filename?: string
  size?: number
  error?: string
}

interface UseFileUploadOptions {
  maxSize?: number // in bytes, default 5MB
  allowedTypes?: string[]
  onProgress?: (progress: UploadProgress) => void
}

const DEFAULT_OPTIONS: UseFileUploadOptions = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'application/pdf', 'image/webp'],
}

/**
 * Hook for uploading resident files
 * Handles validation, progress tracking, and error handling
 */
export function useFileUpload(options: UseFileUploadOptions = {}) {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options }
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState<UploadProgress | null>(null)
  const [error, setError] = useState<string | null>(null)

  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file type
      if (!mergedOptions.allowedTypes?.includes(file.type)) {
        return `Invalid file type: ${file.type}. Allowed types: ${mergedOptions.allowedTypes?.join(', ')}`
      }

      // Check file size
      if (file.size > (mergedOptions.maxSize || 5 * 1024 * 1024)) {
        const maxMB = ((mergedOptions.maxSize || 5 * 1024 * 1024) / 1024 / 1024).toFixed(2)
        const fileMB = (file.size / 1024 / 1024).toFixed(2)
        return `File size (${fileMB}MB) exceeds maximum of ${maxMB}MB`
      }

      return null
    },
    [mergedOptions]
  )

  const upload = useCallback(
    async (file: File, residentId: string, uploadType: string): Promise<UploadResult> => {
      // Reset state
      setError(null)
      setProgress(null)

      // Validate file
      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        return { success: false, error: validationError }
      }

      // Validate inputs
      if (!residentId || !uploadType) {
        const err = 'Resident ID and upload type are required'
        setError(err)
        return { success: false, error: err }
      }

      try {
        setIsUploading(true)

        // Create FormData
        const formData = new FormData()
        formData.append('file', file)
        formData.append('residentId', residentId)
        formData.append('uploadType', uploadType)

        // Track upload progress
        const xhr = new XMLHttpRequest()
        
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const loaded = event.loaded
            const total = event.total
            const percentage = Math.round((loaded / total) * 100)
            
            const progressData: UploadProgress = {
              loaded,
              total,
              percentage,
            }
            
            setProgress(progressData)
            mergedOptions.onProgress?.(progressData)
          }
        })

        // Handle completion
        const uploadPromise = new Promise<UploadResult>((resolve, reject) => {
          xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const response = JSON.parse(xhr.responseText) as UploadResult
                resolve(response)
              } catch {
                reject(new Error('Failed to parse upload response'))
              }
            } else {
              try {
                const errorResponse = JSON.parse(xhr.responseText)
                reject(new Error(errorResponse.error || 'Upload failed'))
              } catch {
                reject(new Error(`Upload failed with status ${xhr.status}`))
              }
            }
          })

          xhr.addEventListener('error', () => {
            reject(new Error('Network error during upload'))
          })

          xhr.addEventListener('abort', () => {
            reject(new Error('Upload cancelled'))
          })
        })

        // Send request
        xhr.open('POST', '/api/residents/upload')
        xhr.send(formData)

        const result = await uploadPromise
        
        if (result.success) {
          console.log('[v0] Upload successful:', result.filename)
        } else {
          setError(result.error || 'Upload failed')
        }

        return result
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Upload failed'
        setError(errorMsg)
        return { success: false, error: errorMsg }
      } finally {
        setIsUploading(false)
        setProgress(null)
      }
    },
    [validateFile, mergedOptions]
  )

  const deleteFile = useCallback(
    async (fileUrl: string, residentId: string, uploadType: string): Promise<UploadResult> => {
      setError(null)

      try {
        setIsUploading(true)

        const params = new URLSearchParams({
          url: fileUrl,
          residentId,
          uploadType,
        })

        const response = await fetch(`/api/residents/upload?${params.toString()}`, {
          method: 'DELETE',
        })

        const result = (await response.json()) as UploadResult

        if (!result.success) {
          setError(result.error || 'Failed to delete file')
        }

        return result
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to delete file'
        setError(errorMsg)
        return { success: false, error: errorMsg }
      } finally {
        setIsUploading(false)
      }
    },
    []
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    upload,
    deleteFile,
    isUploading,
    progress,
    error,
    clearError,
    validateFile,
  }
}
