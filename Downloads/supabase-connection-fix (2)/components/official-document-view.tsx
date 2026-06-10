'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  FileText,
  Download,
  Eye,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Archive,
} from 'lucide-react'

interface DocumentUpload {
  id: string
  requirement_name: string
  file_name: string
  file_size: number
  file_type: string
  file_url: string
  upload_date: string
  is_verified: boolean
  verification_notes?: string
}

interface OfficialDocumentViewProps {
  documentId: string
  residentName: string
  documentType: string
  requirements: string[]
}

export default function OfficialDocumentView({
  documentId,
  residentName,
  documentType,
  requirements,
}: OfficialDocumentViewProps) {
  const [uploads, setUploads] = useState<DocumentUpload[]>([])
  const [loading, setLoading] = useState(true)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [previewFile, setPreviewFile] = useState<string | null>(null)

  useEffect(() => {
    fetchUploads()
  }, [documentId])

  const fetchUploads = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/documents/uploads?documentId=${documentId}`
      )
      if (response.ok) {
        const data = await response.json()
        setUploads(data.uploads || [])
      } else {
        toast.error('Failed to load document uploads')
      }
    } catch (error) {
      console.error('[v0] Fetch error:', error)
      toast.error('Error loading uploads')
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const downloadFile = (fileUrl: string, fileName: string) => {
    try {
      const link = document.createElement('a')
      link.href = fileUrl
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success(`Downloading ${fileName}`)
    } catch (error) {
      console.error('[v0] Download error:', error)
      toast.error('Failed to download file')
    }
  }

  const downloadAll = async () => {
    try {
      // Create a zip file with all uploads
      for (const upload of uploads) {
        downloadFile(upload.file_url, upload.file_name)
      }
      toast.success('All files downloaded')
    } catch (error) {
      console.error('[v0] Error:', error)
      toast.error('Failed to download files')
    }
  }

  const groupByRequirement = requirements.reduce(
    (acc, req) => {
      acc[req] = uploads.filter((u) => u.requirement_name === req)
      return acc
    },
    {} as Record<string, DocumentUpload[]>
  )

  const completionPercentage = Math.round(
    (uploads.length / requirements.length) * 100
  )

  return (
    <div className="space-y-6">
      {/* Document Summary */}
      <Card>
        <CardHeader>
          <CardTitle>{documentType}</CardTitle>
          <CardDescription>
            Requested by: <span className="font-semibold text-foreground">{residentName}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Completion Status */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Completion Status</p>
              <Badge variant={completionPercentage === 100 ? 'default' : 'secondary'}>
                {uploads.length}/{requirements.length} requirements
              </Badge>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {uploads.length > 0 && (
              <Button
                onClick={downloadAll}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
            )}
            <Button
              onClick={fetchUploads}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Requirements Tabs */}
      {loading ? (
        <Card>
          <CardContent className="py-8 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      ) : uploads.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No files uploaded yet. The resident has not submitted any supporting documents.
          </AlertDescription>
        </Alert>
      ) : (
        <Tabs defaultValue={requirements[0]} className="w-full">
          <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(120px, 1fr))` }}>
            {requirements.map((req) => (
              <TabsTrigger key={req} value={req} className="text-xs">
                {req.length > 15 ? req.substring(0, 12) + '...' : req}
              </TabsTrigger>
            ))}
          </TabsList>

          {requirements.map((req) => (
            <TabsContent key={req} value={req}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{req}</CardTitle>
                  <CardDescription>
                    {groupByRequirement[req]?.length || 0} file(s) submitted
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {groupByRequirement[req]?.length > 0 ? (
                    <div className="space-y-2">
                      {groupByRequirement[req].map((upload) => (
                        <div
                          key={upload.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <FileText className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium truncate">
                                {upload.file_name}
                              </p>
                              <div className="flex items-center gap-2">
                                <p className="text-xs text-muted-foreground">
                                  {formatFileSize(upload.file_size)}
                                </p>
                                <span className="text-xs text-muted-foreground">•</span>
                                <p className="text-xs text-muted-foreground">
                                  {formatDate(upload.upload_date)}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                            {upload.is_verified && (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            )}
                            <Button
                              onClick={() => {
                                setPreviewUrl(upload.file_url)
                                setPreviewFile(upload.file_name)
                              }}
                              variant="ghost"
                              size="sm"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => downloadFile(upload.file_url, upload.file_name)}
                              variant="ghost"
                              size="sm"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        No files uploaded for this requirement.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* File Preview Dialog */}
      <Dialog open={!!previewUrl} onOpenChange={() => setPreviewUrl(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{previewFile}</DialogTitle>
          </DialogHeader>
          <div className="w-full h-[60vh] bg-muted rounded-lg overflow-hidden">
            {previewFile?.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
              <img
                src={previewUrl || ''}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            ) : previewFile?.toLowerCase().endsWith('.pdf') ? (
              <iframe
                src={previewUrl}
                className="w-full h-full"
                title="PDF Preview"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Archive className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Preview not available for this file type
                  </p>
                  <Button
                    onClick={() => previewUrl && downloadFile(previewUrl, previewFile || 'file')}
                    variant="outline"
                    size="sm"
                    className="mt-4"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download File
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
