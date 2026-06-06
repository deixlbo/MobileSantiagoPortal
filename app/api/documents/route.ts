import { NextRequest, NextResponse } from 'next/server'
import { getMockDocuments, getMockDocumentStats } from '@/lib/mock-data'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const requestId = searchParams.get('id')
    const residentId = searchParams.get('residentId')

    if (action === 'stats') {
      const days = parseInt(searchParams.get('days') || '30')
      const stats = getMockDocumentStats(days)
      return NextResponse.json({ success: true, ...stats })
    }

    let documents = getMockDocuments()

    if (requestId) {
      const doc = documents.find(d => d.id === requestId)
      if (!doc) {
        return NextResponse.json({ error: 'Document not found' }, { status: 404 })
      }
      return NextResponse.json(doc)
    }

    if (residentId) {
      documents = documents.filter(d => d.resident_id === residentId)
    }

    return NextResponse.json(documents)
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
    const { residentId, documentType, purpose } = body

    if (!residentId || !documentType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const controlNumber = `${documentType.substring(0, 2).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`
    
    const newDocument = {
      id: `doc-${Date.now()}`,
      resident_id: residentId,
      document_type: documentType,
      status: 'pending',
      control_number: controlNumber,
      purpose: purpose || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      profiles: {
        first_name: 'Resident',
        last_name: 'Demo',
      },
    }

    return NextResponse.json({
      success: true,
      documentRequest: newDocument,
    })
  } catch (error) {
    console.error('Error creating document request:', error)
    return NextResponse.json(
      { error: 'Failed to create document request' },
      { status: 500 }
    )
  }
}
