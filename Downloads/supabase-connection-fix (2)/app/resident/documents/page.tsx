'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { getErrorMessage } from '@/lib/utils'
import { getProfile } from '@/lib/auth'
import { toast } from 'sonner'
import { AlertTriangle, Clock, CheckCircle2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import DocumentUpload from '@/components/document-upload'

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null)
  const [residentId, setResidentId] = useState<string | null>(null)
  const [selectedDocumentType, setSelectedDocumentType] = useState<any | null>(null)
  const [documentRequest, setDocumentRequest] = useState<any | null>(null)
  const [requestPurpose, setRequestPurpose] = useState('')
  const [isRequestSubmitting, setIsRequestSubmitting] = useState(false)
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false)
  const [profileName, setProfileName] = useState('')
  const [availableDocumentTypes, setAvailableDocumentTypes] = useState<any[]>([])
  const [qrDialogOpen, setQrDialogOpen] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [qrGeneratingId, setQrGeneratingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { profile, error } = await getProfile()
        if (error) {
          console.error('Error fetching profile:', error)
          return
        }
        if (profile) {
          setVerificationStatus(profile.verification_status || null)
          setResidentId(profile.id || null)
          setProfileName(`${profile.first_name || ''} ${profile.last_name || ''}`.trim())
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
    const fetchDocumentTypes = async () => {
      try {
        const { data, error } = await supabase
          .from('document_types')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })

        if (error) {
          throw error
        }

        setAvailableDocumentTypes(data || [])
      } catch (error) {
        console.error('Error loading document types:', error)
      }
    }

    fetchDocumentTypes()
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

  const handleSelectDocumentType = (type: any) => {
    if (verificationStatus !== 'verified') {
      toast.error(
        verificationStatus === 'pending'
          ? 'Please wait for verification before requesting documents.'
          : 'Please verify your account before requesting documents.'
      )
      return
    }

    setSelectedDocumentType(type)
    setDocumentRequest(null)
    setRequestPurpose('')
    setIsTypeDialogOpen(true)
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
          documentType: selectedDocumentType?.name || '',
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
      setDocumentRequest(created)
      setIsTypeDialogOpen(true)
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

      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Choose a document type below to create a request and upload the required documents.</p>
        {availableDocumentTypes.length === 0 ? (
          <Alert className="border-slate-200 bg-slate-50">
            <AlertDescription className="ml-2 text-slate-700">
              No active document types are available yet. Please check back later.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {availableDocumentTypes.map((type) => (
              <Card key={type.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{type.name}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    Fee: PHP {type.fee || '0.00'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Array.isArray(type.requirements) && type.requirements.length > 0 ? (
                    <ul className="space-y-1 text-sm">
                      {type.requirements.map((req: string) => (
                        <li key={req} className="list-disc list-inside">
                          {req}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No document requirements specified.</p>
                  )}
                  <Button
                    onClick={() => handleSelectDocumentType(type)}
                    className="w-full"
                    disabled={verificationStatus !== 'verified'}
                  >
                    {verificationStatus === 'verified' ? 'Select this document' : 'Verify your account first'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isTypeDialogOpen} onOpenChange={setIsTypeDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {documentRequest ? `Upload documents for ${selectedDocumentType?.name}` : selectedDocumentType?.name || 'Document request'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {selectedDocumentType && (
              <div className="space-y-3">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="font-medium">Document Type</p>
                  <p className="text-sm text-slate-700">{selectedDocumentType.name}</p>
                  <p className="font-medium mt-3">Requirements</p>
                  <div className="text-sm text-slate-700 space-y-1">
                    {Array.isArray(selectedDocumentType.requirements) && selectedDocumentType.requirements.length > 0 ? (
                      selectedDocumentType.requirements.map((req: string) => (
                        <p key={req}>• {req}</p>
                      ))
                    ) : (
                      <p>No specific requirements defined.</p>
                    )}
                  </div>
                  <p className="text-sm mt-3 text-slate-500">Fee: PHP {selectedDocumentType.fee || '0.00'}</p>
                </div>

                {!documentRequest ? (
                  <div className="space-y-4">
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
                ) : (
                  <div className="space-y-4">
                    <Alert className="border-emerald-200 bg-emerald-50">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <AlertDescription className="ml-2 text-emerald-800">
                        Your request has been created. Upload the required files below to complete the submission.
                      </AlertDescription>
                    </Alert>
                    <DocumentUpload
                      documentId={documentRequest.id}
                      residentId={residentId || ''}
                      requirements={Array.isArray(selectedDocumentType.requirements)
                        ? selectedDocumentType.requirements
                        : []}
                      onUploadSuccess={() => {
                        setDocuments((current) =>
                          current.map((doc) => (doc.id === documentRequest.id ? { ...doc, status: 'pending' } : doc))
                        )
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsTypeDialogOpen(false)}>
              Close
            </Button>
            {!documentRequest && (
              <Button onClick={submitDocumentRequest} disabled={isRequestSubmitting || !selectedDocumentType}>
                {isRequestSubmitting ? 'Submitting...' : 'Create request'}
              </Button>
            )}
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
            <p className="text-center text-muted-foreground py-8">No document requests found. Select a document type above to begin.</p>
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
