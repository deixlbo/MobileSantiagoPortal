"use client"

import { useEffect, useRef, useState } from "react"
import QRCode from "qrcode"
import { Button } from "@/components/ui/button"
import { Download, Printer } from "lucide-react"

interface QRCodeGeneratorProps {
  data: string
  size?: number
  title?: string
  subtitle?: string
  className?: string
}

export function QRCodeGenerator({ 
  data, 
  size = 200, 
  title,
  subtitle,
  className = "" 
}: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [qrDataUrl, setQrDataUrl] = useState<string>("")

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, data, {
        width: size,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF"
        },
        errorCorrectionLevel: 'H'
      }, (error) => {
        if (error) console.error("Error generating QR code:", error)
      })

      // Also generate data URL for download
      QRCode.toDataURL(data, {
        width: size,
        margin: 2,
        errorCorrectionLevel: 'H'
      }).then(url => setQrDataUrl(url))
    }
  }, [data, size])

  const handleDownload = () => {
    if (!qrDataUrl) return
    const link = document.createElement("a")
    link.download = `qr-code-${Date.now()}.png`
    link.href = qrDataUrl
    link.click()
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code - ${title || 'Document Verification'}</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              font-family: system-ui, sans-serif;
            }
            .container {
              text-align: center;
              padding: 20px;
            }
            h1 { font-size: 18px; margin-bottom: 8px; }
            p { font-size: 14px; color: #666; margin-bottom: 20px; }
            img { max-width: ${size}px; }
            .footer { font-size: 10px; color: #999; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            ${title ? `<h1>${title}</h1>` : ''}
            ${subtitle ? `<p>${subtitle}</p>` : ''}
            <img src="${qrDataUrl}" alt="QR Code" />
            <p class="footer">Scan to verify document authenticity</p>
          </div>
          <script>window.onload = () => { window.print(); window.close(); }</script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {title && <p className="text-sm font-medium mb-1">{title}</p>}
      {subtitle && <p className="text-xs text-muted-foreground mb-3">{subtitle}</p>}
      <div className="rounded-xl border bg-white p-4">
        <canvas ref={canvasRef} />
      </div>
      <p className="text-[10px] text-muted-foreground mt-2 text-center max-w-[200px]">
        Scan to verify document authenticity
      </p>
      <div className="flex gap-2 mt-3">
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="mr-1 h-3 w-3" />
          Save
        </Button>
        <Button variant="outline" size="sm" onClick={handlePrint}>
          <Printer className="mr-1 h-3 w-3" />
          Print
        </Button>
      </div>
    </div>
  )
}

// Utility function to generate verification URL
export function generateVerificationUrl(controlNumber: string): string {
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://barangay-santiago.vercel.app'
  return `${baseUrl}/verify/${encodeURIComponent(controlNumber)}`
}

// Compact QR code for embedding in documents
export function DocumentQRCode({ 
  controlNumber, 
  size = 100 
}: { 
  controlNumber: string
  size?: number 
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const verificationUrl = generateVerificationUrl(controlNumber)

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, verificationUrl, {
        width: size,
        margin: 1,
        color: {
          dark: "#000000",
          light: "#FFFFFF"
        },
        errorCorrectionLevel: 'M'
      }, (error) => {
        if (error) console.error("Error generating QR code:", error)
      })
    }
  }, [verificationUrl, size])

  return (
    <div className="inline-flex flex-col items-center">
      <canvas ref={canvasRef} className="rounded" />
      <p className="text-[8px] text-gray-500 mt-1">Scan to verify</p>
    </div>
  )
}
