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

    return NextResponse.json(
      { success: true, data: mockDocuments } as ApiResponse<Document[]>,
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
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' } as ApiResponse<null>,
        { status: 400 }
      );
    }

    const { title, type, residentId } = body;

    if (!title || !type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' } as ApiResponse<null>,
        { status: 400 }
      );
    }

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
    const errorMessage = error instanceof Error ? error.message : 'Failed to create document';
    return NextResponse.json(
      { success: false, error: errorMessage } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
