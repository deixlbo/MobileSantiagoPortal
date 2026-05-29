import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    // Convert file to base64 for OCR processing
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')

    // Mock OCR response - in production, integrate with actual OCR service
    // Options: Google Cloud Vision, AWS Textract, Azure Computer Vision, Tesseract.js
    
    const extractedData = {
      documentType: detectDocumentType(file.name),
      fields: {
        name: 'Juan Dela Cruz',
        address: 'Purok 1, Barangay Santiago',
        birthDate: '1990-01-15',
        civilStatus: 'Single',
        purpose: '',
      },
      confidence: 0.85,
      rawText: 'Sample extracted text from document...',
    }

    // TODO: Implement actual OCR
    // const ocrResult = await performOCR(base64, file.type)
    // const extractedData = parseOCRResult(ocrResult)

    return NextResponse.json({
      success: true,
      data: extractedData,
    })
  } catch (error) {
    console.error('[API] OCR error:', error)
    return NextResponse.json({ error: 'OCR processing failed' }, { status: 500 })
  }
}

function detectDocumentType(filename: string): string {
  const lower = filename.toLowerCase()
  
  if (lower.includes('id') || lower.includes('identification')) {
    return 'government_id'
  }
  if (lower.includes('cedula')) {
    return 'cedula'
  }
  if (lower.includes('bill') || lower.includes('billing')) {
    return 'utility_bill'
  }
  if (lower.includes('birth')) {
    return 'birth_certificate'
  }
  
  return 'unknown'
}
