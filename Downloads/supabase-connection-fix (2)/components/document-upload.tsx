'use client'

import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Upload,
  FileText,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react'

interface DocumentUploadProps {
  documentId: string
  residentId: string
  requirements: string[]
  onUploadSuccess?: () => void
}

interface UploadedFile {
  id: string
  requirement_name: string
  file_name: string
  file_size: number
  file_type: string
  file_url: string
  upload_date: string
  is_verified: boolean
}

export default function DocumentUpload({
  documentId,
  residentId,
  requirements,
  onUploadSuccess,
}: DocumentUploadProps) {
  const [pendingFiles, setPendingFiles] = useState<Record<string, File[]>>({})
  const [uploadingRequirement, setUploadingRequirement] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [loading, setLoading] = useState(false)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const fetchUploadedFiles = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/documents/uploads?documentId=${documentId}&residentId=${residentId}`
      )
      if (response.ok) {
        const data = await response.json()
        setUploadedFiles(data.uploads || [])
      }
    } catch (error) {
      console.error('[v0] Fetch error:', error)
      toast.error('Failed to load uploaded files')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUploadedFiles()
  }, [documentId, residentId])

  const addFilesToRequirement = (requirement: string, files: FileList | null) => {
    if (!files?.length) return

    setPendingFiles((current) => ({
      ...current,
      [requirement]: [...(current[requirement] || []), ...Array.from(files)],
    }))
  }

  const removePendingFile = (requirement: string, index: number) => {
    setPendingFiles((current) => ({
      ...current,
      [requirement]: (current[requirement] || []).filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  const handleUploadRequirement = async (requirement: string) => {
    const filesToUpload = pendingFiles[requirement] || []

    if (!filesToUpload.length) {
      toast.error('Please select files to upload for this requirement')
      return
    }

    try {
      setUploadingRequirement(requirement)

      for (let index = 0; index < filesToUpload.length; index += 1) {
        const file = filesToUpload[index]
        const formData = new FormData()
        formData.append('file', file)
        formData.append('documentId', documentId)
        formData.append('residentId', residentId)
        formData.append('requirementName', requirement)

        const response = await fetch('/api/documents/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`)
        }
      }

      toast.success(`${filesToUpload.length} file(s) uploaded successfully`)
      setPendingFiles((current) => ({ ...current, [requirement]: [] }))
      await fetchUploadedFiles()
      onUploadSuccess?.()
    } catch (error) {
      console.error('[v0] Upload error:', error)
      toast.error(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploadingRequirement(null)
    }
  }

  const removeUploadedFile = async (uploadId: string) => {
    if (!confirm('Remove this uploaded file?')) return

    try {
      const response = await fetch(
        `/api/documents/uploads?uploadId=${encodeURIComponent(uploadId)}&residentId=${encodeURIComponent(residentId)}`,
        { method: 'DELETE' }
      )

      if (!response.ok) {
        throw new Error('Failed to remove uploaded file')
      }

      toast.success('File removed successfully')
      await fetchUploadedFiles()
    } catch (error) {
      console.error('[v0] Delete error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to remove file')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const uploadsByRequirement = requirements.reduce(
    (acc, req) => {
      acc[req] = uploadedFiles.filter((upload) => upload.requirement_name === req)
      return acc
    },
    {} as Record<string, UploadedFile[]>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Document Requirements
          </CardTitle>
          <CardDescription>
            Upload supporting files for each requirement. You can remove files before or after upload.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {requirements.map((requirement) => {
            const selectedFiles = pendingFiles[requirement] || []
            const existingUploads = uploadsByRequirement[requirement] || []

            return (
              <div key={requirement} className="rounded-lg border bg-muted/20 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{requirement}</p>
                    <p className="text-sm text-muted-foreground">
                      {existingUploads.length} uploaded file{existingUploads.length === 1 ? '' : 's'}
                    </p>
                  </div>
                  <Badge variant="secondary">{selectedFiles.length} pending</Badge>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRefs.current[requirement]?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Choose Files
                  </Button>
                  <input
                    ref={(element) => {
                      fileInputRefs.current[requirement] = element
                    }}
                    type="file"
                    multiple
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    className="hidden"
                    onChange={(event) => {
                      addFilesToRequirement(requirement, event.target.files)
                      event.target.value = ''
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleUploadRequirement(requirement)}
                    disabled={!selectedFiles.length || uploadingRequirement === requirement}
                  >
                    {uploadingRequirement === requirement ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Files
                      </>
                    )}
                  </Button>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={`${requirement}-${file.name}-${index}`} className="flex items-center justify-between rounded-md border bg-background p-3">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removePendingFile(requirement, index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {existingUploads.length > 0 ? (
                  <div className="mt-3 space-y-2">
                    {existingUploads.map((upload) => (
                      <div key={upload.id} className="flex items-center justify-between rounded-md border bg-background p-3">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <div>
                            <p className="text-sm font-medium">{upload.file_name}</p>
                            <p className="text-xs text-muted-foreground">{formatFileSize(upload.file_size)}</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeUploadedFile(upload.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">No files uploaded for this requirement yet.</p>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Uploaded Files
          </CardTitle>
          <CardDescription>
            {uploadedFiles.length} file(s) uploaded
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : uploadedFiles.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No files uploaded yet. Start by uploading the required documents.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {requirements.map((requirement) => {
                const uploads = uploadsByRequirement[requirement] || []
                if (!uploads.length) return null

                return (
                  <div key={requirement} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{requirement}</p>
                      <Badge variant="secondary">
                        {uploads.length} file{uploads.length === 1 ? '' : 's'}
                      </Badge>
                    </div>
                    <div className="space-y-2 pl-4">
                      {uploads.map((upload) => (
                        <div key={upload.id} className="flex items-center justify-between rounded-md border bg-background p-2 text-sm">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <div>
                              <p className="font-medium">{upload.file_name}</p>
                              <p className="text-xs text-muted-foreground">{formatFileSize(upload.file_size)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {upload.is_verified && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeUploadedFile(upload.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
