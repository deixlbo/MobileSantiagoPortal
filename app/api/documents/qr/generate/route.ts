import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

/**
 * Generate a QR code with cryptographic signature for document verification
 * Creates an immutable record of the QR code generation for audit trails
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { documentId, documentType, issuedDate, expiryDate, issuedBy } = body

    if (!documentId || !documentType || !issuedBy) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate document hash for tamper detection
    const documentData = JSON.stringify({
      documentId,
      documentType,
      issuedDate: issuedDate || new Date().toISOString(),
      expiryDate: expiryDate || null,
      issuedBy,
      timestamp: new Date().toISOString(),
    })

    const documentHash = generateHash(documentData)
    const signature = generateSignature(documentHash)

    // Generate QR code data with signature
    const qrPayload = {
      documentId,
      documentHash,
      signature,
      issuedDate: issuedDate || new Date().toISOString(),
      expiryDate: expiryDate || null,
      verificationUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify/${documentId}`,
    }

    const qrData = Buffer.from(JSON.stringify(qrPayload)).toString('base64')

    // Store QR record in database for audit trail
    const { data: qrRecord, error } = await supabase
      .from('document_qr_records')
      .insert({
        document_id: documentId,
        document_type: documentType,
        document_hash: documentHash,
        signature,
        qr_payload: qrPayload,
        issued_by: issuedBy,
        issued_at: new Date().toISOString(),
        expires_at: expiryDate || null,
        is_valid: true,
      })
      .select()

    if (error) {
      console.error('Error storing QR record:', error)
      return NextResponse.json(
        { error: 'Failed to generate QR code' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      documentId,
      qrData,
      qrPayload,
      recordId: qrRecord?.[0]?.id,
      message: 'QR code generated successfully',
    })
  } catch (error) {
    console.error('QR generation error:', error)
    return NextResponse.json(
      { error: 'QR code generation failed' },
      { status: 500 }
    )
  }
}

function generateHash(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex')
}

function generateSignature(hash: string): string {
  // In production, sign with a private key
  // For now, use HMAC with server secret
  const secret = process.env.QR_SIGNATURE_SECRET || 'default-secret'
  return crypto
    .createHmac('sha256', secret)
    .update(hash)
    .digest('hex')
}
