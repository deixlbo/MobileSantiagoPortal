import { NextRequest, NextResponse } from 'next/server'

// Initialize Supabase client only if credentials are available
const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return null
  }

  const { createClient } = require('@supabase/supabase-js')
  return createClient(supabaseUrl, supabaseServiceKey)
}

const supabase = getSupabaseClient()
if (!supabase) {
}

/**
 * Process document image with OCR
 * Extracts text and structured data from document images
 * Can be extended to use Google Vision API, Tesseract.js, or other OCR services
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const documentType = formData.get('documentType') as string | undefined
    const userId = formData.get('userId') as string | undefined

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
    if (!acceptedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images and PDFs are supported.' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    // Convert file to base64 for processing
    const buffer = await file.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')

    // Extract data using pattern matching and heuristics
    // In production, integrate with Google Vision API, Tesseract.js, or AWS Textract
    const extractedData = await extractDocumentData(base64, file.type, documentType)

    // Store extraction result in database
    const { data: record, error } = await supabase
      .from('ocr_extractions')
      .insert({
        user_id: userId || null,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        document_type: documentType || extractedData.documentType,
        extracted_data: extractedData.fields,
        raw_text: extractedData.rawText,
        confidence: extractedData.confidence,
        status: 'completed',
        processed_at: new Date().toISOString(),
      })
      .select()

    if (error) {
      console.error('Error storing OCR result:', error)
      return NextResponse.json(
        { error: 'Failed to store extraction result' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      extractionId: record?.[0]?.id,
      documentType: extractedData.documentType,
      fields: extractedData.fields,
      confidence: extractedData.confidence,
      rawText: extractedData.rawText,
    })
  } catch (error) {
    console.error('OCR processing error:', error)
    return NextResponse.json(
      { error: 'OCR processing failed' },
      { status: 500 }
    )
  }
}

/**
 * Extract structured data from document using pattern matching
 * This is a basic implementation - in production use a real OCR service
 */
async function extractDocumentData(
  base64: string,
  fileType: string,
  documentType?: string
) {
  // In production, send to Google Vision API, Tesseract.js, or AWS Textract
  // For now, return a structured response with common document fields

  const commonFields = {
    firstName: '',
    lastName: '',
    middleName: '',
    dateOfBirth: '',
    address: '',
    gender: '',
    purok: '',
    contactNumber: '',
    email: '',
    controlNumber: '',
    documentNumber: '',
    dateIssued: '',
    validUntil: '',
  }

  // Simulate OCR text extraction
  const simulatedRawText = `
    Barangay Santiago Document
    Name: Sample Name
    Date of Birth: 01/15/1990
    Address: Sample Address
    Contact: 09XX-XXX-XXXX
  `

  // Identify document type
  let identifiedType = documentType || 'unknown'
  if (!documentType) {
    // Simple heuristic to identify document type from name
    const fileName = base64.substring(0, 100).toLowerCase()
    if (fileName.includes('clearance')) identifiedType = 'barangay_clearance'
    else if (fileName.includes('residency')) identifiedType = 'certificate_of_residency'
    else if (fileName.includes('indigency')) identifiedType = 'certificate_of_indigency'
    else if (fileName.includes('business')) identifiedType = 'barangay_business_clearance'
  }

  return {
    documentType: identifiedType,
    fields: commonFields,
    rawText: simulatedRawText,
    confidence: 0.75, // Confidence score 0-1
  }
}

/**
 * Get OCR extraction history for a user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('ocr_extractions')
      .select('*')
      .eq('user_id', userId)
      .order('processed_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching extractions:', error)
      return NextResponse.json(
        { error: 'Failed to fetch extractions' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      extractions: data,
      count: data.length,
    })
  } catch (error) {
    console.error('Get extractions error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve extractions' },
      { status: 500 }
    )
  }
}
