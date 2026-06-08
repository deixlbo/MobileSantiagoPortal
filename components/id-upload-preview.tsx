'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']

interface IDUploadPreviewProps {
  onFileSelected?: (file: File, preview: string | null) => void
  currentFile?: { name: string; url: string } | null
}

export default function IDUploadPreview({ onFileSelected, currentFile }: IDUploadPreviewProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileInfo, setFileInfo] = useState<{
    name: string
    size: number
    type: string
    uploadedAt?: string
  } | null>(null)

  const validateFile = (file: File): { valid: boolean; error: string } => {
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File size must be less than 5MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`
      }
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: 'Only PDF, JPG, and PNG files are allowed'
      }
    }

    return { valid: true, error: '' }
  }

  const generatePreview = (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          resolve(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      } else if (file.type === 'application/pdf') {
        // For PDFs, we'll show a placeholder
        resolve(null)
      }
    })
  }

  const handleFileSelect = async (file: File) => {
    setError('')

    const validation = validateFile(file)
    if (!validation.valid) {
      setError(validation.error)
      return
    }

    const imagePreview = await generatePreview(file)
    setSelectedFile(file)
    setPreview(imagePreview)
    setFileInfo({
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toLocaleString()
    })

    if (onFileSelected) {
      onFileSelected(file, imagePreview)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const clearFile = () => {
    setSelectedFile(null)
    setPreview(null)
    setFileInfo(null)
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Valid ID Upload</CardTitle>
        <CardDescription>
          Upload a clear photo or scan of your government-issued ID (PDF, JPG, or PNG)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area or Preview */}
        {!selectedFile && !currentFile ? (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center hover:border-emerald-400 transition-colors cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="rounded-full bg-emerald-100 p-3 group-hover:bg-emerald-200 transition-colors">
                <Upload className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Drop your ID here or click to browse</p>
                <p className="text-sm text-muted-foreground mt-1">PDF, JPG, or PNG • Max 5MB</p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleInputChange}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Preview Section */}
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              {preview ? (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-emerald-900">Image Preview</p>
                  <div className="relative h-40 w-full rounded-md overflow-hidden bg-white border border-emerald-200">
                    <Image
                      src={preview}
                      alt="ID Preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-emerald-600" />
                    <p className="text-sm font-semibold text-emerald-900">PDF Document</p>
                  </div>
                  <p className="text-sm text-emerald-800">
                    Your PDF will be stored and verified by officials
                  </p>
                </div>
              )}
            </div>

            {/* File Information */}
            <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground truncate">{fileInfo?.name}</p>
                  <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                    <span>{(fileInfo?.size || 0) / 1024 > 1024 ? `${((fileInfo?.size || 0) / 1024 / 1024).toFixed(2)}MB` : `${((fileInfo?.size || 0) / 1024).toFixed(2)}KB`}</span>
                    {fileInfo?.type && (
                      <span>{fileInfo.type === 'application/pdf' ? 'PDF' : 'Image'}</span>
                    )}
                  </div>
                </div>
                <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                Change File
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={clearFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex gap-3 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Info Box */}
        <div className="rounded-lg bg-blue-50 p-3 border border-blue-200">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">Accepted IDs:</span> National ID, Driver License, Passport, or any government-issued ID
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
