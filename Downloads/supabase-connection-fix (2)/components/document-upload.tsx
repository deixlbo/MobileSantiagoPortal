'use client'

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import {
  Upload,
  FileText,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
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
  const [selectedRequirement, setSelectedRequirement] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch already uploaded files
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

  // Auto-fetch uploaded files on mount
  useEffect(() => {
    fetchUploadedFiles()
  }, [documentId, residentId])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpg', '.jpeg', '.png'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    onDrop: (acceptedFiles) => {
      setFiles([...files, ...acceptedFiles])
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const handleUpload = async () => {
    if (!selectedRequirement) {
      toast.error('Please select a requirement')
      return
    }

    if (files.length === 0) {
      toast.error('Please select files to upload')
      return
    }

    try {
      setUploading(true)
      setUploadProgress(0)

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append('file', file)
        formData.append('documentId', documentId)
        formData.append('residentId', residentId)
        formData.append('requirementName', selectedRequirement)

        const response = await fetch('/api/documents/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`)
        }

        setUploadProgress(((i + 1) / files.length) * 100)
      }

      toast.success(`${files.length} file(s) uploaded successfully`)
      setFiles([])
      setSelectedRequirement('')
      setUploadProgress(0)
      
      // Refresh uploaded files list
      await fetchUploadedFiles()
      onUploadSuccess?.()
    } catch (error) {
      console.error('[v0] Upload error:', error)
      toast.error(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  // Group uploaded files by requirement
  const uploadsByRequirement = requirements.reduce(
    (acc, req) => {
      acc[req] = uploadedFiles.filter((u) => u.requirement_name === req)
      return acc
    },
    {} as Record<string, UploadedFile[]>
  )

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Document Requirements
          </CardTitle>
          <CardDescription>
            Upload supporting files for each requirement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Requirement Selector */}
          <div>
            <Label htmlFor="requirement">Select Requirement *</Label>
            <select
              id="requirement"
              value={selectedRequirement}
              onChange={(e) => setSelectedRequirement(e.target.value)}
              className="w-full px-3 py-2 border border-input bg-background rounded-md"
            >
              <option value="">Choose a requirement...</option>
              {requirements.map((req) => (
                <option key={req} value={req}>
                  {req}
                </option>
              ))}
            </select>
          </div>

          {/* Drag & Drop Zone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium">
              {isDragActive
                ? 'Drop files here...'
                : 'Drag & drop files here, or click to select'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PDF, images, or documents (Max 10MB)
            </p>
          </div>

          {/* Selected Files Preview */}
          {files.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Files ({files.length})</Label>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted rounded-md"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <FileText className="h-4 w-4 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-destructive hover:bg-destructive/10 p-1 rounded"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Uploading...</span>
                <span className="text-sm text-muted-foreground">{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={files.length === 0 || !selectedRequirement || uploading}
            className="w-full"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Files
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Uploaded Files Status */}
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
              {requirements.map((req) => (
                <div key={req} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{req}</p>
                    <Badge variant="secondary">
                      {uploadsByRequirement[req]?.length || 0} file(s)
                    </Badge>
                  </div>
                  {uploadsByRequirement[req]?.length > 0 ? (
                    <div className="space-y-2 pl-4">
                      {uploadsByRequirement[req].map((upload) => (
                        <div
                          key={upload.id}
                          className="flex items-center justify-between p-2 bg-muted rounded text-sm"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <FileText className="h-4 w-4 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="truncate">{upload.file_name}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(upload.file_size)}
                              </p>
                            </div>
                          </div>
                          {upload.is_verified && (
                            <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground pl-4">No files uploaded</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
