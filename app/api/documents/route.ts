import { NextRequest, NextResponse } from 'next/server'
import { generateDocumentHTML, generateControlNumber, DocumentData } from '@/lib/document-generator'
import { DocumentRequest, DocumentType } from '@/lib/database'

// In-memory storage for demo (replace with Supabase in production)
const documentRequests: Map<string, DocumentRequest> = new Map()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { residentId, residentName, address, documentType, purpose, barangayCaptan } = body

    if (!residentId || !documentType || !residentName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const controlNumber = generateControlNumber()
    const now = new Date()

    // Generate document
    const documentData: DocumentData = {
      residentName,
      address: address || 'Barangay Santiago',
      controlNumber,
      issuedDate: now,
      barangayCaptan: barangayCaptan || 'Rolando C. Borja',
      purpose,
    }

    const documentHTML = generateDocumentHTML(documentType as DocumentType, documentData)

    // Create request record
    const docRequest: DocumentRequest = {
      id: `doc-${Date.now()}`,
      residentId,
      documentType: documentType as DocumentType,
      status: 'pending',
      controlNumber,
      purpose: purpose || '',
      createdAt: now,
      createdBy: residentId,
    }

    documentRequests.set(docRequest.id, docRequest)

    return NextResponse.json({
      success: true,
      documentRequest: docRequest,
      documentHTML,
    })
  } catch (error) {
    console.error('Error creating document request:', error)
    return NextResponse.json(
      { error: 'Failed to create document request' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const requestId = searchParams.get('id')
    const residentId = searchParams.get('residentId')

    if (requestId) {
      const docRequest = documentRequests.get(requestId)
      if (!docRequest) {
        return NextResponse.json(
          { error: 'Document request not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(docRequest)
    }

    if (residentId) {
      const requests = Array.from(documentRequests.values()).filter(
        (req) => req.residentId === residentId
      )
      return NextResponse.json(requests)
    }

    const allRequests = Array.from(documentRequests.values())
    return NextResponse.json(allRequests)
  } catch (error) {
    console.error('Error fetching document requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch document requests' },
      { status: 500 }
    )
  }
}
