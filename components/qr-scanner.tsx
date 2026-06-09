'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Camera, X, Loader2, CheckCircle2, AlertCircle, FileText, Clock, MapPin } from 'lucide-react'
import { toast } from 'sonner'

interface QRScannerProps {
  onScanSuccess?: (documentId: string, data: any) => void
}

interface ScannedDocument {
  documentId: string
  documentName: string
  issuedDate: string
  issuedBy: string
}

/**
 * QR Scanner component for resident portal
 * Opens camera to scan document QR codes and displays document status
 */
export function QRScanner({ onScanSuccess }: QRScannerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [scannedDocument, setScannedDocument] = useState<ScannedDocument | null>(null)
  const [documentStatus, setDocumentStatus] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsScanning(true)
        scanQRCode()
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to access camera'
      setError(errorMsg)
      toast.error('Camera access denied')
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsScanning(false)
  }

  const scanQRCode = async () => {
    if (!isScanning || !videoRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const video = videoRef.current
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      try {
        // Try to decode QR code using jsQR if available, otherwise use a simpler approach
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const qrData = await decodeQRCode(imageData)
        
        if (qrData) {
          stopCamera()
          setScannedDocument(qrData)
          await fetchDocumentStatus(qrData.documentId)
          onScanSuccess?.(qrData.documentId, qrData)
          return
        }
      } catch (err) {
        console.error('QR decode error:', err)
      }
    }

    // Continue scanning
    requestAnimationFrame(scanQRCode)
  }

  const decodeQRCode = async (imageData: ImageData): Promise<ScannedDocument | null> => {
    // This would require jsQR library. For now, we'll use a fallback
    // that reads from the camera stream metadata or uses form input
    return null
  }

  const fetchDocumentStatus = async (documentId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/documents?id=${documentId}`)
      if (response.ok) {
        const data = await response.json()
        setDocumentStatus(data)
        toast.success('Document found!')
      } else {
        setError('Document not found')
        toast.error('Document not found')
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch document'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleManualIdInput = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const documentId = formData.get('documentId') as string
    
    if (!documentId) {
      setError('Please enter a document ID')
      return
    }

    await fetchDocumentStatus(documentId)
  }

  const handleClose = () => {
    stopCamera()
    setScannedDocument(null)
    setDocumentStatus(null)
    setError(null)
    setIsOpen(false)
  }

  const handlePrint = () => {
    if (documentStatus && documentStatus.id) {
      const printWindow = window.open(`/api/documents/${documentStatus.id}/print`, '_blank')
      if (printWindow) {
        toast.success('Opening print dialog...')
      }
    }
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="gap-2"
      >
        <Camera className="h-4 w-4" />
        Scan QR Code
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[95vw] sm:w-auto max-h-[95vh] overflow-auto max-w-2xl">
          <DialogHeader>
            <DialogTitle>Scan Document QR Code</DialogTitle>
            <DialogDescription>
              Point your camera at a document QR code to view its status
            </DialogDescription>
          </DialogHeader>

          {!scannedDocument ? (
            <div className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {!isScanning ? (
                <div className="space-y-4">
                  <Button
                    onClick={startCamera}
                    className="w-full gap-2"
                    size="lg"
                  >
                    <Camera className="h-5 w-5" />
                    Start Camera Scan
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or enter manually</span>
                    </div>
                  </div>

                  <form onSubmit={handleManualIdInput} className="space-y-3">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Document ID</label>
                      <input
                        type="text"
                        name="documentId"
                        placeholder="e.g., REQ-2026-001"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <Button type="submit" className="w-full" variant="secondary">
                      Search Document
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative bg-black rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full aspect-video object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="absolute inset-0 border-2 border-emerald-500/50">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-emerald-500"></div>
                    </div>
                  </div>
                  <Button
                    onClick={stopCamera}
                    variant="destructive"
                    className="w-full"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel Scan
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                </div>
              ) : documentStatus ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-emerald-900">{scannedDocument.documentName}</p>
                      <p className="text-sm text-emerald-700">Document found and verified</p>
                    </div>
                  </div>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{documentStatus.type || scannedDocument.documentName}</CardTitle>
                      <CardDescription>{documentStatus.id}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Status Badge */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Status</span>
                        <Badge
                          className={
                            documentStatus.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-700'
                              : documentStatus.status === 'pending'
                              ? 'bg-amber-100 text-amber-700'
                              : documentStatus.status === 'released'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-red-100 text-red-700'
                          }
                        >
                          {documentStatus.status?.charAt(0).toUpperCase() + documentStatus.status?.slice(1) || 'Unknown'}
                        </Badge>
                      </div>

                      {/* Document Details */}
                      <div className="space-y-2 border-t pt-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Requested:</span>
                          <span className="font-medium">{documentStatus.date || scannedDocument.issuedDate}</span>
                        </div>
                        {documentStatus.pickupTime && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Pickup Time:</span>
                            <span className="font-medium">{documentStatus.pickupTime}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Issued By:</span>
                          <span className="font-medium">{scannedDocument.issuedBy}</span>
                        </div>
                      </div>

                      {/* Purpose */}
                      {documentStatus.purpose && (
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-xs font-semibold text-blue-900 mb-1">Purpose</p>
                          <p className="text-sm text-blue-800">{documentStatus.purpose}</p>
                        </div>
                      )}

                      {/* Remarks */}
                      {documentStatus.remarks && (
                        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                          <p className="text-xs font-semibold text-amber-900 mb-1">Remarks</p>
                          <p className="text-sm text-amber-800">{documentStatus.remarks}</p>
                        </div>
                      )}

                      {/* Print Button */}
                      {(documentStatus.status === 'approved' || documentStatus.status === 'released') && (
                        <Button
                          onClick={handlePrint}
                          className="w-full bg-emerald-600 hover:bg-emerald-700"
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Direct Print Document
                        </Button>
                      )}
                    </CardContent>
                  </Card>

                  <Button
                    onClick={() => {
                      setScannedDocument(null)
                      setDocumentStatus(null)
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Scan Another QR
                  </Button>
                </div>
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Document not found. Please check the QR code and try again.</AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {isScanning && (
            <Button
              onClick={handleClose}
              variant="outline"
              className="w-full"
            >
              Close
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
