'use client'

import { useState, useCallback } from 'react'
import { Upload, FileText, Loader2, Check, AlertCircle, Camera, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'

interface ExtractedField {
  label: string
  value: string
  confidence: number
}

interface OCRResult {
  documentType: string
  fields: Record<string, string>
  confidence: number
  rawText: string
}

interface OCRDocumentScannerProps {
  onExtracted: (data: OCRResult) => void
  onError?: (error: string) => void
  acceptedTypes?: string[]
}

export function OCRDocumentScanner({
  onExtracted,
  onError,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
}: OCRDocumentScannerProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<OCRResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = useCallback((selectedFile: File) => {
    if (!acceptedTypes.includes(selectedFile.type)) {
      setError('Invalid file type. Please upload an image or PDF.')
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File too large. Maximum size is 10MB.')
      return
    }

    setFile(selectedFile)
    setError(null)
    setResult(null)

    // Create preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target?.result as string)
      reader.readAsDataURL(selectedFile)
    } else {
      setPreview(null)
    }
  }, [acceptedTypes])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }, [handleFileSelect])

  const handleCapture = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.capture = 'environment'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) handleFileSelect(file)
    }
    input.click()
  }, [handleFileSelect])

  const processDocument = async () => {
    if (!file) return

    setIsProcessing(true)
    setProgress(0)
    setError(null)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/ocr', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'OCR processing failed')
      }

      const data = await response.json()
      setResult(data.data)
      onExtracted(data.data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Processing failed'
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const clearFile = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
    setProgress(0)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Document Scanner (OCR)
        </CardTitle>
        <CardDescription>
          I-upload o i-capture ang iyong dokumento para automatic na ma-extract ang information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!file ? (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors"
          >
            <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop your document here, or
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Label htmlFor="file-upload" className="cursor-pointer">
                <Input
                  id="file-upload"
                  type="file"
                  accept={acceptedTypes.join(',')}
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) handleFileSelect(f)
                  }}
                  className="hidden"
                />
                <Button variant="outline" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Browse Files
                  </span>
                </Button>
              </Label>
              <Button variant="outline" onClick={handleCapture}>
                <Camera className="h-4 w-4 mr-2" />
                Take Photo
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Supported: JPG, PNG, WebP, PDF (max 10MB)
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* File Preview */}
            <div className="relative rounded-lg border overflow-hidden">
              {preview ? (
                <img
                  src={preview}
                  alt="Document preview"
                  className="w-full h-48 object-contain bg-muted"
                />
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-muted">
                  <FileText className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={clearFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="truncate">{file.name}</span>
              <span className="text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB
              </span>
            </div>

            {/* Progress */}
            {isProcessing && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-xs text-center text-muted-foreground">
                  Processing document... {progress}%
                </p>
              </div>
            )}

            {/* Process Button */}
            {!result && !isProcessing && (
              <Button onClick={processDocument} className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Process Document
              </Button>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-600" />
              <span className="font-medium">Extracted Information</span>
              <span className="text-muted-foreground">
                ({Math.round(result.confidence * 100)}% confidence)
              </span>
            </div>

            <div className="rounded-lg bg-muted p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Document Type</span>
                <span className="font-medium capitalize">
                  {result.documentType.replace(/_/g, ' ')}
                </span>
              </div>
              
              {Object.entries(result.fields).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="font-medium">{value || '-'}</span>
                </div>
              ))}
            </div>

            <Button variant="outline" onClick={clearFile} className="w-full">
              Scan Another Document
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
