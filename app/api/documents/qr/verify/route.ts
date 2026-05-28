import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Initialize Supabase client only if credentials are available
const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return null
  }

  const { createClient } = require('@supabase/supabase-js')
  return createClient(supabaseUrl, supabaseServiceKey)
}

interface QRPayload {
  documentId: string
  documentHash: string
  signature: string
  issuedDate: string
  expiryDate?: string | null
  verificationUrl: string
}

/**
 * Verify a QR code and check for tampering
 * Validates the signature and checks expiry status
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { documentId, qrData, signature } = body

    if (!documentId || !qrData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Decode QR payload
    let qrPayload: QRPayload
    try {
      const decodedData = Buffer.from(qrData, 'base64').toString('utf-8')
      qrPayload = JSON.parse(decodedData)
    } catch (err) {
      return NextResponse.json(
        { error: 'Invalid QR data format' },
        { status: 400 }
      )
    }

    // Verify document ID matches
    if (qrPayload.documentId !== documentId) {
      return NextResponse.json(
        { success: false, tampered: true, message: 'Document ID mismatch' },
        { status: 400 }
      )
    }

    // Verify signature
    const expectedSignature = generateSignature(qrPayload.documentHash)
    const signatureValid = qrPayload.signature === expectedSignature

    if (!signatureValid) {
      return NextResponse.json(
        { success: false, tampered: true, message: 'Signature verification failed' },
        { status: 400 }
      )
    }

    // Check expiry
    let isExpired = false
    if (qrPayload.expiryDate) {
      const expiryTime = new Date(qrPayload.expiryDate).getTime()
      isExpired = expiryTime < Date.now()
    }

    // Get document details from database
    const { data: docRecord } = await supabase
      .from('document_qr_records')
      .select('*')
      .eq('document_id', documentId)
      .single()

    // Log verification attempt
    await supabase
      .from('document_verification_logs')
      .insert({
        document_id: documentId,
        verified_at: new Date().toISOString(),
        signature_valid: signatureValid,
        is_expired: isExpired,
        ip_address: request.ip,
      })

    return NextResponse.json({
      success: true,
      verified: !isExpired && signatureValid,
      tampered: !signatureValid,
      isExpired,
      documentId: qrPayload.documentId,
      issuedDate: qrPayload.issuedDate,
      expiryDate: qrPayload.expiryDate,
      documentRecord: docRecord,
      message: isExpired ? 'Document has expired' : 'Document verified successfully',
    })
  } catch (error) {
    console.error('QR verification error:', error)
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    )
  }
}

function generateSignature(hash: string): string {
  const secret = process.env.QR_SIGNATURE_SECRET || 'default-secret'
  return crypto
    .createHmac('sha256', secret)
    .update(hash)
    .digest('hex')
}
