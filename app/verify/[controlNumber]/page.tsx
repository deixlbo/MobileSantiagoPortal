import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CheckCircle2, XCircle, Clock, FileText, Calendar, User, MapPin, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Document Verification | Barangay Santiago",
  description: "Verify the authenticity of documents issued by Barangay Santiago"
}

// Mock document database - in production, this would query a real database
const mockDocuments: Record<string, {
  controlNumber: string
  documentType: string
  residentName: string
  purpose: string
  status: "valid" | "expired" | "revoked" | "pending"
  issuedDate: string
  expiryDate?: string
  validUntil?: string
  issuedBy: string
  purok: string
  remarks?: string
}> = {
  "BRGY-STG-2026-00001": {
    controlNumber: "BRGY-STG-2026-00001",
    documentType: "Barangay Clearance",
    residentName: "Juan Dela Cruz",
    purpose: "Employment",
    status: "valid",
    issuedDate: "April 25, 2026",
    validUntil: "October 25, 2026",
    issuedBy: "Hon. Rolando C. Borja",
    purok: "Purok 3"
  },
  "BRGY-STG-2026-00002": {
    controlNumber: "BRGY-STG-2026-00002",
    documentType: "Certificate of Residency",
    residentName: "Maria Santos",
    purpose: "Passport Application",
    status: "valid",
    issuedDate: "April 20, 2026",
    validUntil: "July 20, 2026",
    issuedBy: "Hon. Rolando C. Borja",
    purok: "Purok 1"
  },
  "BRGY-STG-2026-00003": {
    controlNumber: "BRGY-STG-2026-00003",
    documentType: "Certificate of Indigency",
    residentName: "Pedro Reyes",
    purpose: "Medical Assistance",
    status: "expired",
    issuedDate: "January 15, 2026",
    expiryDate: "April 15, 2026",
    issuedBy: "Hon. Rolando C. Borja",
    purok: "Purok 5",
    remarks: "Document has expired. Please request a new certificate."
  },
  "BRGY-STG-2026-00004": {
    controlNumber: "BRGY-STG-2026-00004",
    documentType: "Barangay Business Clearance",
    residentName: "Ana Garcia - Sari-Sari Store",
    purpose: "Business Permit Renewal",
    status: "valid",
    issuedDate: "March 1, 2026",
    validUntil: "December 31, 2026",
    issuedBy: "Hon. Rolando C. Borja",
    purok: "Purok 2"
  },
  "BRGY-STG-2026-00005": {
    controlNumber: "BRGY-STG-2026-00005",
    documentType: "Barangay Clearance",
    residentName: "Roberto Cruz",
    purpose: "NBI Clearance",
    status: "revoked",
    issuedDate: "February 10, 2026",
    issuedBy: "Hon. Rolando C. Borja",
    purok: "Purok 4",
    remarks: "Document revoked due to pending case. Contact the Barangay Office for details."
  }
}

function getStatusConfig(status: string) {
  switch (status) {
    case "valid":
      return {
        icon: CheckCircle2,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        label: "Valid Document",
        description: "This document is authentic and currently valid."
      }
    case "expired":
      return {
        icon: Clock,
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        label: "Expired",
        description: "This document has expired and is no longer valid."
      }
    case "revoked":
      return {
        icon: XCircle,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        label: "Revoked",
        description: "This document has been revoked and is not valid."
      }
    case "pending":
      return {
        icon: Clock,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        label: "Pending",
        description: "This document is still being processed."
      }
    default:
      return {
        icon: AlertTriangle,
        color: "text-gray-600",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
        label: "Unknown",
        description: "Unable to determine document status."
      }
  }
}

export default async function VerifyDocumentPage({ 
  params 
}: { 
  params: Promise<{ controlNumber: string }> 
}) {
  const { controlNumber } = await params
  const decodedControlNumber = decodeURIComponent(controlNumber)
  const document = mockDocuments[decodedControlNumber]

  if (!document) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
        <div className="container mx-auto px-4 py-8 max-w-lg">
          {/* Header */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <Image 
              src="/images/santiagologo.jpg" 
              alt="Barangay Santiago" 
              width={60} 
              height={60} 
              className="rounded-full"
            />
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Republic of the Philippines</p>
              <p className="font-semibold">Barangay Santiago</p>
              <p className="text-xs text-muted-foreground">San Antonio, Zambales</p>
            </div>
            <Image 
              src="/images/saz.jpg" 
              alt="San Antonio" 
              width={60} 
              height={60} 
              className="rounded-full"
            />
          </div>

          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-red-100 p-4 mb-4">
                  <XCircle className="h-12 w-12 text-red-600" />
                </div>
                <h1 className="text-xl font-bold text-red-800 mb-2">Document Not Found</h1>
                <p className="text-sm text-red-600 mb-4">
                  No document found with control number:
                </p>
                <code className="bg-white px-4 py-2 rounded-lg text-sm font-mono border border-red-200">
                  {decodedControlNumber}
                </code>
                <p className="text-xs text-muted-foreground mt-6 max-w-xs">
                  This could mean the document was not issued by Barangay Santiago or the control number is incorrect.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground mb-4">
              If you believe this is an error, please contact the Barangay Office.
            </p>
            <Link href="/">
              <Button variant="outline">
                Go to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const statusConfig = getStatusConfig(document.status)
  const StatusIcon = statusConfig.icon

  return (
    <div className={`min-h-screen ${statusConfig.bgColor}`}>
      <div className="container mx-auto px-4 py-8 max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <Image 
            src="/images/santiagologo.jpg" 
            alt="Barangay Santiago" 
            width={60} 
            height={60} 
            className="rounded-full"
          />
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Republic of the Philippines</p>
            <p className="font-semibold">Barangay Santiago</p>
            <p className="text-xs text-muted-foreground">San Antonio, Zambales</p>
          </div>
          <Image 
            src="/images/saz.jpg" 
            alt="San Antonio" 
            width={60} 
            height={60} 
            className="rounded-full"
          />
        </div>

        {/* Verification Result */}
        <Card className={`border-2 ${statusConfig.borderColor}`}>
          <CardHeader className="pb-4">
            <div className="flex flex-col items-center text-center">
              <div className={`rounded-full ${statusConfig.bgColor} p-4 mb-4`}>
                <StatusIcon className={`h-12 w-12 ${statusConfig.color}`} />
              </div>
              <CardTitle className={`text-xl ${statusConfig.color}`}>
                {statusConfig.label}
              </CardTitle>
              <CardDescription className="mt-2">
                {statusConfig.description}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Control Number */}
            <div className="rounded-xl bg-white/80 p-4 text-center border">
              <p className="text-xs text-muted-foreground mb-1">Control Number</p>
              <p className="font-mono font-bold text-lg">{document.controlNumber}</p>
            </div>

            {/* Document Details */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/80 border">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Document Type</p>
                  <p className="font-medium">{document.documentType}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/80 border">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Issued To</p>
                  <p className="font-medium">{document.residentName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/80 border">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="font-medium">{document.purok}, Barangay Santiago</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/80 border">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Issued Date</p>
                    <p className="font-medium text-sm">{document.issuedDate}</p>
                  </div>
                </div>
                {document.validUntil && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-white/80 border">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Valid Until</p>
                      <p className="font-medium text-sm">{document.validUntil}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 rounded-lg bg-white/80 border">
                <p className="text-xs text-muted-foreground">Purpose</p>
                <Badge variant="secondary" className="mt-1">{document.purpose}</Badge>
              </div>

              <div className="p-3 rounded-lg bg-white/80 border">
                <p className="text-xs text-muted-foreground">Issued By</p>
                <p className="font-medium">{document.issuedBy}</p>
                <p className="text-xs text-muted-foreground">Punong Barangay</p>
              </div>
            </div>

            {/* Remarks */}
            {document.remarks && (
              <div className={`p-4 rounded-xl ${statusConfig.bgColor} border ${statusConfig.borderColor}`}>
                <p className={`text-sm ${statusConfig.color}`}>
                  <AlertTriangle className="h-4 w-4 inline mr-2" />
                  {document.remarks}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center space-y-4">
          <p className="text-xs text-muted-foreground">
            Verified on {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/">
              <Button variant="outline" size="sm">
                Go to Homepage
              </Button>
            </Link>
            <Link href="/resident">
              <Button size="sm">
                Request Document
              </Button>
            </Link>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Barangay Santiago Management System
          </p>
        </div>
      </div>
    </div>
  )
}
