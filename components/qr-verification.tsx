'use client'

import { useState } from 'react'
import QRCode from 'qrcode.react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Check, Copy, QrCode as QrCodeIcon, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface QRVerificationProps {
  documentId: string
  documentName: string
  issuedDate: Date
  expiryDate?: Date
  issuedBy: string
  verificationUrl?: string
}

export function QRVerification({
  documentId,
  documentName,
  issuedDate,
  expiryDate,
  issuedBy,
  verificationUrl,
}: QRVerificationProps) {
  const [showQRDialog, setShowQRDialog] = useState(false)
  const [copied, setCopied] = useState(false)

  // Generate QR code data
  const qrData = JSON.stringify({
    documentId,
    documentName,
    issuedDate: issuedDate.toISOString(),
    expiryDate: expiryDate?.toISOString(),
    issuedBy,
    verificationUrl: verificationUrl || `${typeof window !== 'undefined' ? window.location.origin : ''}/verify/${documentId}`,
  })

  const handleCopyUrl = () => {
    const url = verificationUrl || `${typeof window !== 'undefined' ? window.location.origin : ''}/verify/${documentId}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success('Verification URL copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadQR = () => {
    const qrElement = document.getElementById('qr-code-download')
    if (qrElement) {
      const canvas = qrElement.querySelector('canvas') as HTMLCanvasElement
      if (canvas) {
        const link = document.createElement('a')
        link.href = canvas.toDataURL('image/png')
        link.download = `${documentId}-qr.png`
        link.click()
        toast.success('QR code downloaded')
      }
    }
  }

  return (
    <>
      <Card className="border-0 bg-card/60 backdrop-blur">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <QrCodeIcon className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-sm">Document Verification</CardTitle>
                <CardDescription>Scan or verify this document</CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="bg-primary/10">Active</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-border/50 bg-muted/30 p-4 text-center">
            <QRCode
              value={qrData}
              size={150}
              level="H"
              includeMargin={true}
              className="mx-auto"
            />
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Document ID:</span>
              <span className="font-mono font-medium">{documentId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Issued:</span>
              <span className="font-medium">{issuedDate.toLocaleDateString()}</span>
            </div>
            {expiryDate && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Expires:</span>
                <span className="font-medium">{expiryDate.toLocaleDateString()}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Issued By:</span>
              <span className="font-medium">{issuedBy}</span>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setShowQRDialog(true)}
            >
              <QrCodeIcon className="mr-2 h-4 w-4" />
              View Full QR Code
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={handleCopyUrl}
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Verification URL
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Document QR Code</DialogTitle>
            <DialogDescription>
              Scan this code to verify the document authenticity
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-lg border border-border/50 bg-muted/30 p-6 text-center" id="qr-code-download">
              <QRCode
                value={qrData}
                size={250}
                level="H"
                includeMargin={true}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadQR}
              >
                Download
              </Button>
              <Button
                size="sm"
                onClick={handleCopyUrl}
              >
                {copied ? 'Copied!' : 'Copy URL'}
              </Button>
            </div>

            <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 flex gap-3">
              <AlertCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">How to verify:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Scan the QR code with any smartphone camera</li>
                  <li>Visit the verification page to confirm authenticity</li>
                  <li>Check issue date, expiry date, and issuer details</li>
                </ul>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
