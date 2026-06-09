'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getErrorMessage } from '@/lib/utils'
import { toast } from 'sonner'
import { AlertTriangle, Clock, CheckCircle2 } from 'lucide-react'

const DOCUMENT_TYPES = [
  { value: 'barangay_clearance', label: 'Barangay Clearance' },
  { value: 'certificate_of_residency', label: 'Certificate of Residency' },
  { value: 'certificate_of_indigency', label: 'Certificate of Indigency' },
  { value: 'certificate_of_solo_parent', label: 'Solo Parent Certification' },
]

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null)
  const [residentId, setResidentId] = useState<string | null>(null)
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false)
  const [selectedDocumentType, setSelectedDocumentType] = useState('')
  const [requestPurpose, setRequestPurpose] = useState('')
  const [isRequestSubmitting, setIsRequestSubmitting] = useState(false)
  const [profileName, setProfileName] = useState('')
  const [qrDialogOpen, setQrDialogOpen] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [qrGeneratingId, setQrGeneratingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileResponse = await fetch('/api/profile')
        if (profileResponse.ok) {
          const profileData = await profileResponse.json()
          setVerificationStatus(profileData.verification_status || null)
          setResidentId(profileData.id || null)
          setProfileName(`${profileData.first_name || ''} ${profileData.last_name || ''}`.trim())
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    }

    fetchProfile()
    const pollingInterval = setInterval(fetchProfile, 5000)
    return () => clearInterval(pollingInterval)
  }, [])

  useEffect(() => {
    if (!residentId) {
      setLoading(false)
      return
    }

    const fetchDocuments = async () => {
      try {
        const response = await fetch(`/api/documents?residentId=${residentId}`)
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`)
        }
        const data = await response.json()
        setDocuments(data.documents || data || [])
      } catch (error) {
        console.error('Error fetching documents:', error)
        toast.error('Failed to load documents')
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
    const documentsInterval = setInterval(fetchDocuments, 5000)
    return () => clearInterval(documentsInterval)
  }, [residentId])

  const handleRequestDocument = () => {
    if (verificationStatus !== 'verified') {
      if (documents.length > 0) {
        toast.error('Documents already submitted. Please wait for verification')
      } else {
        toast.error('Want to request document? Verify your account first')
      }
      return
    }
    setIsRequestDialogOpen(true)
  }

  const submitDocumentRequest = async () => {
    if (!selectedDocumentType) {
      toast.error('Please choose a document type')
      return
    }
    if (!requestPurpose.trim()) {
      toast.error('Please enter the purpose of your request')
      return
    }
    if (!residentId) {
      toast.error('Unable to identify resident profile')
      return
    }

    setIsRequestSubmitting(true)
    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          residentId,
          documentType: selectedDocumentType,
          purpose: requestPurpose.trim(),
        }),
      })
      const data = await response.json()

      if (!response.ok || data.error) {
        toast.error(getErrorMessage(data.message || data.error, 'Unable to submit document request'))
        return
      }

      const created = data.documentRequest || data.document || data
      setDocuments((current) => [created, ...current])
      setIsRequestDialogOpen(false)
      setSelectedDocumentType('')
      setRequestPurpose('')
      toast.success('Document request submitted successfully')
    } catch (error) {
      console.error('Error submitting document request:', error)
      toast.error('Failed to submit document request')
    } finally {
      setIsRequestSubmitting(false)
    }
  }

  const hasPendingDocuments = documents.some((doc) => doc.status === 'pending' || doc.status === 'processing')
  const hasSubmittedDocuments = documents.length > 0

  const generateDocumentQRCode = async (doc: any) => {
    if (!residentId) {
      toast.error('Unable to identify resident profile')
      return
    }

    const requestType = doc.document_type || doc.type || 'document'
    const controlNumber = doc.control_number || doc.id || `DOC-${Date.now()}`
    const requestName = profileName || 'Resident'

    setQrGeneratingId(doc.id)

    try {
      const response = await fetch('/api/qr/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentRequestId: doc.id,
          documentType: requestType,
          residentName: requestName,
          controlNumber,
        }),
      })
      const data = await response.json()

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to generate QR code')
      }

      setQrCodeUrl(data.qrCode)
      setQrDialogOpen(true)
      toast.success('QR code generated successfully. Show it to barangay staff for pickup.')
    } catch (error) {
      console.error('Error generating QR code:', error)
      const message = error instanceof Error ? error.message : 'Failed to generate QR code'
      toast.error(message)
    } finally {
      setQrGeneratingId(null)
    }
  }

  const downloadQrCode = () => {
    if (!qrCodeUrl) return
    const link = document.createElement('a')
    link.href = qrCodeUrl
    link.download = 'document-request-qr.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Document Requests</h1>
        <p className="text-muted-foreground mt-2">Track and manage your document requests</p>
      </div>

      {verificationStatus === 'pending' && (
        <Alert className="border-amber-200 bg-amber-50">
          <Clock className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 ml-2">
            {hasSubmittedDocuments ? (
              <>
                <strong>Document Already Submitted:</strong> You have already submitted document requests. Please wait for your account verification to be completed. This typically takes 1-2 business days. Once verified, you can request more documents.
              </>
            ) : (
              <>
                <strong>Want to Request Document? Get Verified First:</strong> Your account is currently being verified by the barangay officials. You can request documents once your account is verified. This typically takes 1-2 business days.
              </>
            )}
          </AlertDescription>
        </Alert>
      )}

      {verificationStatus === 'verified' && (
        <Alert className="border-emerald-200 bg-emerald-50">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <AlertDescription className="text-emerald-800 ml-2">
            <strong>Account Verified:</strong> Your account has been verified. You can now request documents.
          </AlertDescription>
        </Alert>
      )}

      {verificationStatus === 'declined' && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 ml-2">
            <strong>Account Verification Declined:</strong> Your account verification was declined. You cannot request documents at this time. Please contact barangay officials for more information.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        <Button
          onClick={handleRequestDocument}
          disabled={verificationStatus !== 'verified'}
          className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50"
        >
          Request Document
        </Button>
      </div>

      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Submit Document Request</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="document-type">Document type</Label>
              <Select value={selectedDocumentType} onValueChange={(value) => setSelectedDocumentType(value)}>
                <SelectTrigger id="document-type">
                  <SelectValue placeholder="Choose document type" />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="request-purpose">Purpose</Label>
              <Textarea
                id="request-purpose"
                value={requestPurpose}
                onChange={(event) => setRequestPurpose(event.target.value)}
                placeholder="Describe why you need this document"
                className="min-h-[120px]"
              />
            </div>
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsRequestDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitDocumentRequest} disabled={isRequestSubmitting}>
              {isRequestSubmitting ? 'Submitting...' : 'Send request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading documents...</p>
          </div>
        </div>
      ) : documents.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground py-8">No documents found. Start by requesting a document.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {documents.map((doc) => (
            <Card key={doc.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{doc.document_type || doc.type || 'Document'}</CardTitle>
                    <CardDescription>ID: {doc.id || doc.control_number}</CardDescription>
                  </div>
                  <Badge
                    variant={doc.status === 'approved' ? 'default' : doc.status === 'pending' ? 'secondary' : 'destructive'}
                  >
                    {doc.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>
                    Status: <span className="font-medium">{doc.status}</span>
                  </p>
                  <p>Created: {new Date(doc.created_at).toLocaleDateString()}</p>
                  {doc.purpose && <p>Purpose: {doc.purpose}</p>}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(doc.status === 'approved' || doc.status === 'released' || doc.status === 'pending') && (
                    <Button
                      variant="outline"
                      onClick={() => generateDocumentQRCode(doc)}
                      disabled={Boolean(qrGeneratingId && qrGeneratingId === doc.id)}
                    >
                      {qrGeneratingId === doc.id ? 'Generating QR…' : 'Generate Pickup QR'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Document Pickup QR Code</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {qrCodeUrl ? (
              <div className="text-center">
                <img src={qrCodeUrl} alt="Document QR Code" className="mx-auto rounded-lg border border-slate-200" />
                <p className="text-sm text-muted-foreground mt-3">
                  Show this QR code to the barangay official when picking up your document.
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Preparing QR code...</p>
            )}
          </div>
          <DialogFooter className="flex justify-between gap-2">
            <Button variant="outline" onClick={() => setQrDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={downloadQrCode} disabled={!qrCodeUrl}>
              Download QR
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
