import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, Document } from '@/lib/types';

// Mock data store
const mockDocuments: Document[] = [
  {
    id: 'doc-001',
    title: 'Barangay Clearance',
    type: 'Barangay Clearance',
    status: 'approved',
    requestedAt: new Date('2024-04-01'),
    completedAt: new Date('2024-04-03'),
  },
  {
    id: 'doc-002',
    title: 'Residency Certificate',
    type: 'Residency',
    status: 'pending',
    requestedAt: new Date('2024-04-15'),
  },
];

export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check
    // TODO: Filter documents based on user role and ID

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');

    // Handle getting a single document by ID
    if (id) {
      const doc = mockDocuments.find(d => d.id === id);
      if (!doc) {
        return NextResponse.json(
          { success: false, error: 'Document not found' } as ApiResponse<null>,
          { status: 404 }
        );
      }
      return NextResponse.json(
        { success: true, data: doc } as ApiResponse<Document>,
        { status: 200 }
      );
    }

    // Handle listing all documents or by userId
    let filtered = [...mockDocuments];
    if (userId) {
      filtered = filtered.filter(d => d.residentId === userId);
    }

    return NextResponse.json(
      { success: true, data: filtered } as ApiResponse<Document[]>,
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch documents' } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, type, residentId } = body;

    if (!title || !type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // TODO: Implement document creation in database
    const newDocument: Document = {
      id: `doc-${Date.now()}`,
      title,
      type,
      status: 'pending',
      requestedAt: new Date(),
      residentId,
    };

    mockDocuments.push(newDocument);

    return NextResponse.json(
      { success: true, data: newDocument } as ApiResponse<Document>,
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create document' } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Document ID is required' } as ApiResponse<null>,
        { status: 400 }
      );
    }

    const docIndex = mockDocuments.findIndex((d) => d.id === id);
    if (docIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Document not found' } as ApiResponse<null>,
        { status: 404 }
      );
    }

    mockDocuments[docIndex] = { ...mockDocuments[docIndex], ...updates };

    return NextResponse.json(
      { success: true, data: mockDocuments[docIndex] } as ApiResponse<Document>,
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update document' } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Document ID is required' } as ApiResponse<null>,
        { status: 400 }
      );
    }

    const docIndex = mockDocuments.findIndex((d) => d.id === id);
    if (docIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Document not found' } as ApiResponse<null>,
        { status: 404 }
      );
    }

    mockDocuments.splice(docIndex, 1);

    return NextResponse.json(
      { success: true, data: null } as ApiResponse<null>,
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete document' } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
