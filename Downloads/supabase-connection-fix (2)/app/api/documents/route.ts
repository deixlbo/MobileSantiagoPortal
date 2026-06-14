import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import { buildDocumentRequestInsertPayload } from '@/lib/document-request-payload'

const ALLOWED_DOCUMENT_TYPES = new Set([
  'barangay_clearance',
  'certificate_of_residency',
  'certificate_of_indigency',
  'certificate_of_solo_parent',
  'barangay_business_clearance',
  'business_permit',
  'certificate_of_business_closure',
  'certificate_to_file_action',
  'medical_assistance_certificate',
  'blotter_report',
  'settlement_agreement',
])

function normalizeDocumentType(rawType: string) {
  const value = String(rawType || '').trim()
  if (!value) return null

  const normalized = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')

  const aliases: Record<string, string> = {
    barangay_clearance: 'barangay_clearance',
    clearances: 'barangay_clearance',
    clearance: 'barangay_clearance',
    certificate_of_residency: 'certificate_of_residency',
    residency: 'certificate_of_residency',
    residence: 'certificate_of_residency',
    certificate_of_indigency: 'certificate_of_indigency',
    indigency: 'certificate_of_indigency',
    certificate_of_solo_parent: 'certificate_of_solo_parent',
    solo_parent: 'certificate_of_solo_parent',
    barangay_business_clearance: 'barangay_business_clearance',
    business_clearance: 'barangay_business_clearance',
    business_permit: 'business_permit',
    business_permits: 'business_permit',
    permit: 'business_permit',
    certificate_of_business_closure: 'certificate_of_business_closure',
    business_closure: 'certificate_of_business_closure',
    certificate_to_file_action: 'certificate_to_file_action',
    file_action: 'certificate_to_file_action',
    medical_assistance_certificate: 'medical_assistance_certificate',
    medical_assistance: 'medical_assistance_certificate',
    blotter_report: 'blotter_report',
    blotter: 'blotter_report',
    settlement_agreement: 'settlement_agreement',
    settlement: 'settlement_agreement',
  }

  return aliases[normalized] || (ALLOWED_DOCUMENT_TYPES.has(normalized) ? normalized : null)
}

function isMissingColumnError(error: any) {
  const message = String(error?.message || error?.details || '')
  return error?.code === '42703' || /column .* does not exist|could not find the column|undefined column/i.test(message)
}

function getSupabaseErrorMessage(error: any) {
  if (!error) return null

  const parts = [error?.message, error?.details, error?.hint].filter(Boolean)
  const suffix = error?.code ? ` [${error.code}]` : ''
  return parts.length > 0 ? `${parts.join(' | ')}${suffix}` : `Unknown Supabase error${suffix}`
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const requestId = searchParams.get('id')
    const residentId = searchParams.get('residentId')

    if (action === 'stats') {
      const days = parseInt(searchParams.get('days') || '30')
      const { data, error } = await supabaseServer
        .from('document_requests')
        .select('id, resident_id, status, created_at')
        .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())

      if (error) {
        console.error('Error fetching document stats:', error)
        return NextResponse.json({ error: 'Failed to fetch document stats' }, { status: 500 })
      }

      return NextResponse.json({ success: true, count: data?.length ?? 0 })
    }

    if (requestId) {
      const { data: documentRequest, error } = await supabaseServer
        .from('document_requests')
        .select('*')
        .eq('id', requestId)
        .single()

      if (error) {
        return NextResponse.json({ error: error.message || 'Document not found' }, { status: 404 })
      }

      return NextResponse.json(documentRequest)
    }

    if (residentId) {
      const { data: residentDocuments, error } = await supabaseServer
        .from('document_requests')
        .select('*')
        .eq('resident_id', residentId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching resident document requests:', error)
        return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
      }

      return NextResponse.json(residentDocuments || [])
    }

    const { data: supabaseDocuments, error } = await supabaseServer
      .from('document_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching document requests:', error)
      return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
    }

    return NextResponse.json(supabaseDocuments || [])
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { residentId, documentType, purpose, businessPermitDetails } = body

    if (!residentId || !documentType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const normalizedDocumentType = normalizeDocumentType(documentType)
    if (!normalizedDocumentType) {
      return NextResponse.json(
        { error: 'Unsupported document type' },
        { status: 400 }
      )
    }

    const { data: profile, error: profileError } = await supabaseServer
      .from('profiles')
      .select('verification_status')
      .eq('id', residentId)
      .single()

    if (profileError || !profile) {
      console.error('Error fetching resident verification status:', profileError)
      return NextResponse.json(
        { error: 'Unable to verify resident account' },
        { status: 500 }
      )
    }

    const verificationStatus = profile.verification_status

    if (verificationStatus !== 'verified') {
      return NextResponse.json(
        {
          error: 'Account verification required',
          message: verificationStatus === 'pending'
            ? 'Your account is pending verification. Document requests will be available once your account is verified.'
            : 'Your account verification was declined. Please contact barangay officials for more information.',
          verificationStatus,
        },
        { status: 403 }
      )
    }

    const controlNumber = `${documentType.substring(0, 2).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`

    const { data: residentProfile, error: residentProfileError } = await supabaseServer
      .from('profiles')
      .select('first_name, middle_name, last_name, suffix, purok, civil_status, email')
      .eq('id', residentId)
      .single()

    if (residentProfileError) {
      console.warn('Unable to fetch full resident profile for document request:', residentProfileError)
    }

    const createdAt = new Date().toISOString()
    const normalizedBusinessPermitDetails = businessPermitDetails && typeof businessPermitDetails === 'object' ? businessPermitDetails : {}
    const compatibleDocumentType = normalizedDocumentType === 'business_permit' ? 'barangay_business_clearance' : normalizedDocumentType

    const insertPayloads = [
      buildDocumentRequestInsertPayload({
        residentId,
        documentType: normalizedDocumentType,
        purpose,
        residentProfile: residentProfile || undefined,
        controlNumber,
        createdAt,
        businessPermitDetails: normalizedBusinessPermitDetails,
      }),
      buildDocumentRequestInsertPayload({
        residentId,
        documentType: compatibleDocumentType,
        purpose,
        residentProfile: residentProfile || undefined,
        controlNumber,
        createdAt,
        includeRequesterFields: false,
        businessPermitDetails: normalizedBusinessPermitDetails,
      }),
      buildDocumentRequestInsertPayload({
        residentId,
        documentType: compatibleDocumentType,
        purpose,
        residentProfile: residentProfile || undefined,
        controlNumber,
        createdAt,
        includeRequesterFields: false,
        includeBusinessFields: false,
        businessPermitDetails: normalizedBusinessPermitDetails,
      }),
    ]

    let inserted: any = null
    let insertError: any = null
    let lastInsertErrorMessage: string | null = null

    for (const insertBody of insertPayloads) {
      const result = await supabaseServer
        .from('document_requests')
        .insert([insertBody])
        .select()
        .single()

      inserted = result.data
      insertError = result.error
      lastInsertErrorMessage = getSupabaseErrorMessage(insertError)

      if (!insertError) {
        break
      }

      if (!isMissingColumnError(insertError)) {
        break
      }

      console.warn('Retrying document request insert with a simpler payload due to schema mismatch:', lastInsertErrorMessage)
    }

    if (insertError || !inserted) {
      console.error('Error inserting document request:', insertError)
      return NextResponse.json({
        error: 'Failed to create document request',
        message: lastInsertErrorMessage || 'The document request could not be created.',
        details: insertError?.details || null,
        code: insertError?.code || null,
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      documentRequest: inserted,
    })
  } catch (error) {
    console.error('Error creating document request:', error)
    return NextResponse.json(
      { error: 'Failed to create document request' },
      { status: 500 }
    )
  }
}
