'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { OfficialQRScanner } from '@/components/official-qr-scanner'
import { Badge } from '@/components/ui/badge'
import { Camera, CheckCircle2, Clock, FileText, AlertTriangle } from 'lucide-react'

// Mock recent scans
const recentScans = [
  {
    id: 1,
    type: 'document',
    name: 'Juan Dela Cruz',
    documentType: 'Barangay Clearance',
    requestNumber: 'REQ-2026-001',
    status: 'approved',
    scannedAt: '10 minutes ago'
  },
  {
    id: 2,
    type: 'document',
    name: 'Maria Santos',
    documentType: 'Certificate of Residency',
    requestNumber: 'REQ-2026-002',
    status: 'completed',
    scannedAt: '25 minutes ago'
  },
  {
    id: 3,
    type: 'blotter',
    name: 'Pedro Reyes',
    documentType: 'Noise Complaint',
    requestNumber: 'BLT-2026-003',
    status: 'under-investigation',
    scannedAt: '1 hour ago'
  },
]

function getStatusBadge(status: string) {
  switch (status) {
    case 'approved':
      return (
        <Badge className="bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Approved
        </Badge>
      )
    case 'completed':
      return (
        <Badge className="bg-emerald-100 text-emerald-800">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Completed
        </Badge>
      )
    case 'pending':
      return (
        <Badge className="bg-amber-100 text-amber-700">
          <Clock className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      )
    case 'under-investigation':
      return (
        <Badge className="bg-blue-100 text-blue-700">
          <Clock className="mr-1 h-3 w-3" />
          Under Investigation
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function QRScanPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">QR Scanner</h1>
        <p className="text-muted-foreground">Scan and verify resident documents and blotter reports</p>
      </div>

      {/* Main Scanner Card */}
      <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-emerald-600" />
            Scan QR Code
          </CardTitle>
          <CardDescription>
            Use the camera to scan a resident&apos;s QR code from their document or blotter report
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="flex-1 space-y-3">
              <p className="text-sm text-muted-foreground">
                After scanning, you can:
              </p>
              <ul className="text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Verify document or blotter details
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Update status (Approve, Reject, Complete)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Add remarks or notes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Mark as ready for pickup
                </li>
              </ul>
            </div>
            <div className="w-full sm:w-auto">
              <OfficialQRScanner />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                <Camera className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">24</p>
                <p className="text-xs text-muted-foreground">Scans Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">18</p>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">4</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100 text-red-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-xs text-muted-foreground">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Scans */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Scans</CardTitle>
          <CardDescription>Documents and blotters scanned today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentScans.map((scan) => (
              <div 
                key={scan.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${scan.type === 'document' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
                    {scan.type === 'document' ? <FileText className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{scan.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {scan.documentType} | {scan.requestNumber}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(scan.status)}
                  <span className="text-xs text-muted-foreground hidden sm:block">{scan.scannedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
