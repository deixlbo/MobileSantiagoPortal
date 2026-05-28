import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Check, X, AlertTriangle, Loader2 } from 'lucide-react'

interface VerifyPageProps {
  params: Promise<{ documentId: string }>
  searchParams: Promise<{ qr?: string; signature?: string }>
}

async function VerifyContent({
  documentId,
  qrData,
  signature,
}: {
  documentId: string
  qrData?: string
  signature?: string
}) {
  try {
    // If no QR data provided, show document info from database
    if (!qrData) {
      return (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No QR verification data provided. Scan the QR code from the document.
          </AlertDescription>
        </Alert>
      )
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/documents/qr/verify`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId,
          qrData,
          signature,
        }),
      }
    )

    const result = await response.json()

    if (!response.ok) {
      return (
        <div className="space-y-4">
          <Alert variant="destructive">
            <X className="h-4 w-4" />
            <AlertDescription>{result.error}</AlertDescription>
          </Alert>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        {/* Verification Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Verification Status</CardTitle>
                <CardDescription>QR Code Authentication Result</CardDescription>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                {result.verified ? (
                  <Check className="h-6 w-6 text-green-600" />
                ) : (
                  <X className="h-6 w-6 text-red-600" />
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant={result.verified ? 'default' : 'destructive'}>
                  {result.verified ? 'Valid' : 'Invalid'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Signature:</span>
                <Badge
                  variant={result.tampered ? 'destructive' : 'secondary'}
                >
                  {result.tampered ? 'Tampered' : 'Verified'}
                </Badge>
              </div>
              {result.isExpired && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expiry:</span>
                  <Badge variant="outline">Expired</Badge>
                </div>
              )}
            </div>

            {result.message && (
              <Alert>
                <AlertDescription>{result.message}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Document Details */}
        {result.documentRecord && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Document Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Document ID</p>
                  <p className="font-mono text-sm font-medium">
                    {result.documentId}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium text-sm">
                    {result.documentRecord.document_type}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Issued</p>
                  <p className="font-medium text-sm">
                    {new Date(result.issuedDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Issued By</p>
                  <p className="font-medium text-sm">
                    {result.documentRecord.issued_by}
                  </p>
                </div>
              </div>

              {result.expiryDate && (
                <div className="border-t pt-3">
                  <p className="text-sm text-muted-foreground">Expires</p>
                  <p className="font-medium text-sm">
                    {new Date(result.expiryDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Security Notice */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This verification confirms the document has not been tampered with. For official use, verify with Barangay Santiago directly.
          </AlertDescription>
        </Alert>
      </div>
    )
  } catch (error) {
    console.error('Verification error:', error)
    return (
      <Alert variant="destructive">
        <X className="h-4 w-4" />
        <AlertDescription>
          An error occurred during verification. Please try again.
        </AlertDescription>
      </Alert>
    )
  }
}

export default async function VerifyPage(props: VerifyPageProps) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { documentId } = params
  const { qr, signature } = searchParams

  if (!documentId) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Document Verification</h1>
          <p className="text-muted-foreground mt-2">
            Verify the authenticity of your Barangay Santiago document
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Barangay Santiago Portal</CardTitle>
            <CardDescription>Official Document Verification</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Verifying document...
                    </p>
                  </div>
                </div>
              }
            >
              <VerifyContent
                documentId={documentId}
                qrData={qr}
                signature={signature}
              />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
