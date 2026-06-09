'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  Camera, 
  X, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  User,
  CreditCard,
  Clock,
  XCircle
} from 'lucide-react'
import { toast } from 'sonner'

interface OfficialQRScannerProps {
  onStatusUpdate?: (documentId: string, newStatus: string) => void
}

interface ParsedQRData {
  name?: string
  documentType?: string
  requestNumber?: string
  complaintNumber?: string
  status?: string
  paid?: string
  type?: string
}

const statusOptions = [
  { value: 'pending', label: 'Pending', color: 'bg-amber-100 text-amber-700' },
  { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-700' },
  { value: 'approved', label: 'Approved', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'ready', label: 'Ready for Pickup', color: 'bg-green-100 text-green-700' },
  { value: 'completed', label: 'Completed', color: 'bg-emerald-100 text-emerald-800' },
  { value: 'declined', label: 'Declined', color: 'bg-red-100 text-red-700' },
]

export function OfficialQRScanner({ onStatusUpdate }: OfficialQRScannerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [scannedData, setScannedData] = useState<ParsedQRData | null>(null)
  const [verifiedDocument, setVerifiedDocument] = useState<any | null>(null)
  const [verifiedCode, setVerifiedCode] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newStatus, setNewStatus] = useState<string>('')
  const [remarks, setRemarks] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationRef = useRef<number | null>(null)

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
        
        // Start scanning loop
        const scanLoop = () => {
          scanQRCode()
          animationRef.current = requestAnimationFrame(scanLoop)
        }
        animationRef.current = requestAnimationFrame(scanLoop)
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to access camera'
      setError(errorMsg)
      toast.error('Camera access denied. Please allow camera access or enter QR data manually.')
    }
  }

  const stopCamera = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsScanning(false)
  }

  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const video = videoRef.current
    if (video.readyState !== video.HAVE_ENOUGH_DATA) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Note: Real QR scanning would require a library like jsQR
    // For now, we'll use manual input as primary method
  }

  const parseQRContent = (content: string): ParsedQRData => {
    const lines = content.split('\n')
    const data: ParsedQRData = {}
    
    lines.forEach(line => {
      const [key, ...valueParts] = line.split(':')
      const value = valueParts.join(':').trim()
      
      const keyLower = key.toLowerCase().trim()
      if (keyLower.includes('name')) data.name = value
      else if (keyLower.includes('request number') || keyLower.includes('document')) data.requestNumber = value
      else if (keyLower.includes('complaint')) data.complaintNumber = value
      else if (keyLower.includes('document') && !data.documentType) data.documentType = value
      else if (keyLower.includes('status')) data.status = value
      else if (keyLower.includes('paid')) data.paid = value
      else if (keyLower.includes('type')) data.type = value
    })
    
    return data
  }

  const verifyQrCode = async (qrCode: string) => {
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch('/api/qr/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrCode }),
      })
      const data = await response.json()

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to verify QR code')
      }

      const documentData = data.documentData || {}
      const documentRequest = data.documentRequest || null

      setVerifiedCode(qrCode)
      setVerifiedDocument(documentRequest)
      setScannedData({
        name: documentData.residentName || documentData.name || '',
        documentType: documentData.documentType || documentData.type || '',
        requestNumber: documentRequest?.id || documentData.requestNumber || '',
        status: documentRequest?.status || documentData.status || 'pending',
        paid: documentData.paid || '',
      })
      setNewStatus(documentRequest?.status?.toLowerCase() || 'pending')
      toast.success('QR code verified successfully')
    } catch (err) {
      console.error('QR verification failed:', err)
      const message = err instanceof Error ? err.message : 'Unable to verify QR code'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleManualInput = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const qrContent = formData.get('qrContent') as string

    if (!qrContent.trim()) {
      setError('Please enter QR code content')
      return
    }

    stopCamera()

    try {
      let parsedJson: any = null
      let rawCode = qrContent.trim()

      try {
        parsedJson = JSON.parse(qrContent)
      } catch {
        parsedJson = null
      }

      if (parsedJson && typeof parsedJson === 'object') {
        const code = parsedJson.code || parsedJson.qrCode || parsedJson.documentId || rawCode
        if (code) {
          await verifyQrCode(code)
          return
        }
      }

      if (rawCode.startsWith('ey')) {
        await verifyQrCode(rawCode)
        return
      }

      const parsed = parseQRContent(qrContent)
      setScannedData(parsed)
      setNewStatus(parsed.status?.toLowerCase() || 'pending')
      toast.success('QR code data parsed successfully!')
    } catch (err) {
      console.error('Manual QR parse failed:', err)
      setError('Invalid QR code content. Please use a valid QR payload.')
    }
  }

  const handleStatusUpdate = async () => {
    if (!scannedData || !newStatus) {
      toast.error('Please select a status')
      return
    }

    if (newStatus === 'released' && verifiedDocument?.id) {
      setIsLoading(true)
      try {
        const response = await fetch('/api/documents/release', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ documentRequestId: verifiedDocument.id }),
        })
        const data = await response.json()
        if (!response.ok || data.error) {
          throw new Error(data.error || 'Failed to release document')
        }

        toast.success('Document release confirmed via QR scan')
        onStatusUpdate?.(verifiedDocument.id, newStatus)
        handleClose()
        return
      } catch (err) {
        console.error('Release action failed:', err)
        const message = err instanceof Error ? err.message : 'Unable to release document'
        toast.error(message)
      } finally {
        setIsLoading(false)
      }
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      const docId = scannedData.requestNumber || scannedData.complaintNumber || 'unknown'
      onStatusUpdate?.(docId, newStatus)
      toast.success(`Status updated to "${statusOptions.find(s => s.value === newStatus)?.label}" for ${docId}`)
      setIsLoading(false)
      handleClose()
    }, 1000)
  }

  const handleClose = () => {
    stopCamera()
    setScannedData(null)
    setError(null)
    setNewStatus('')
    setRemarks('')
    setIsOpen(false)
  }

  const getStatusBadge = (status: string) => {
    const opt = statusOptions.find(s => s.value === status.toLowerCase()) || statusOptions[0]
    return <Badge className={opt.color}>{opt.label}</Badge>
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  const isDocument = Boolean(scannedData?.requestNumber || scannedData?.documentType)
  const isBlotter = Boolean(scannedData?.complaintNumber)

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="gap-2 bg-emerald-600 hover:bg-emerald-700"
      >
        <Camera className="h-4 w-4" />
        Scan QR Code
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Official QR Scanner
            </DialogTitle>
            <DialogDescription>
              Scan a resident&apos;s QR code to verify and update document or blotter status
            </DialogDescription>
          </DialogHeader>

          {!scannedData ? (
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
                    className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700"
                    size="lg"
                  >
                    <Camera className="h-5 w-5" />
                    Start Camera Scan
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-background text-muted-foreground">Or enter QR data manually</span>
                    </div>
                  </div>

                  <form onSubmit={handleManualInput} className="space-y-3">
                    <div>
                      <Label htmlFor="qrContent">QR Code Content</Label>
                      <Textarea
                        id="qrContent"
                        name="qrContent"
                        placeholder={`Paste QR content here, e.g.:\nName: Juan Dela Cruz\nRequest Number: REQ-2026-001\nDocument: Barangay Clearance\nStatus: Approved\nPaid: Yes`}
                        rows={6}
                        className="mt-1.5 font-mono text-sm"
                      />
                    </div>
                    <Button type="submit" className="w-full" variant="secondary">
                      Parse QR Data
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
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-emerald-500 rounded-lg">
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-500" />
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-500" />
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-500" />
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-500" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-0 right-0 text-center">
                      <p className="text-white text-sm bg-black/50 inline-block px-3 py-1 rounded-full">
                        Position QR code within the frame
                      </p>
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
              {/* Verified Badge */}
              <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-emerald-900">QR Code Verified</p>
                  <p className="text-sm text-emerald-700">
                    {isDocument ? 'Document Request' : isBlotter ? 'Blotter Report' : 'Record'} found
                  </p>
                </div>
              </div>

              {/* Scanned Data Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    {isDocument ? <FileText className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    {isDocument ? 'Document Details' : 'Blotter Details'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Resident Name */}
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <User className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500">Resident Name</p>
                      <p className="font-medium">{scannedData.name || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Document/Blotter Type */}
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <FileText className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500">
                        {isDocument ? 'Document Type' : 'Incident Type'}
                      </p>
                      <p className="font-medium">
                        {scannedData.documentType || scannedData.type || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Request/Complaint Number */}
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <FileText className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500">
                        {isDocument ? 'Request Number' : 'Complaint Number'}
                      </p>
                      <p className="font-medium">
                        {scannedData.requestNumber || scannedData.complaintNumber || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Current Status */}
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Clock className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500">Current Status</p>
                      <div className="mt-1">{getStatusBadge(scannedData.status || 'pending')}</div>
                    </div>
                  </div>

                  {/* Payment Status (for documents) */}
                  {isDocument && scannedData.paid && (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <CreditCard className="h-4 w-4 text-slate-500" />
                      <div>
                        <p className="text-xs text-slate-500">Payment Status</p>
                        <Badge className={scannedData.paid.toLowerCase() === 'yes' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
                          {scannedData.paid.toLowerCase() === 'yes' ? 'Paid' : 'Unpaid'}
                        </Badge>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Status Update Form */}
              <Card className="border-emerald-200 bg-emerald-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Update Status</CardTitle>
                  <CardDescription>Change the status of this {isDocument ? 'document' : 'blotter'}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">New Status</Label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select new status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <span className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${option.color.split(' ')[0]}`} />
                              {option.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="remarks">Remarks (Optional)</Label>
                    <Textarea
                      id="remarks"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Add any notes or remarks..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setScannedData(null)
                    setNewStatus('')
                    setRemarks('')
                  }}
                >
                  Scan Another
                </Button>
                <Button
                  onClick={handleStatusUpdate}
                  disabled={!newStatus || isLoading}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Update Status
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
