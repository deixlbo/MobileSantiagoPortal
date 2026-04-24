import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, Resident } from '@/lib/types';

// Mock data store
const mockResidents: Resident[] = [
  {
    id: 'res-001',
    email: 'juan@email.com',
    fullName: 'Juan dela Cruz',
    address: 'Purok 1, Barangay Santiago',
    phone: '09123456789',
    purok: '1',
    status: 'active',
    registeredAt: new Date('2020-01-15'),
  },
  {
    id: 'res-002',
    email: 'maria@email.com',
    fullName: 'Maria Santos',
    address: 'Purok 2, Barangay Santiago',
    phone: '09987654321',
    purok: '2',
    status: 'active',
    registeredAt: new Date('2021-03-20'),
  },
];

export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check (officials only)
    // TODO: Implement pagination
    // TODO: Add search and filter functionality

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const purok = searchParams.get('purok');
    const status = searchParams.get('status');

    // Handle getting a single resident by ID
    if (id) {
      const resident = mockResidents.find(r => r.id === id);
      if (!resident) {
        return NextResponse.json(
          { success: false, error: 'Resident not found' } as ApiResponse<null>,
          { status: 404 }
        );
      }
      return NextResponse.json(
        { success: true, data: resident } as ApiResponse<Resident>,
        { status: 200 }
      );
    }

    let filtered = [...mockResidents];

    if (purok) {
      filtered = filtered.filter((r) => r.purok === purok);
    }

    if (status) {
      filtered = filtered.filter((r) => r.status === status);
    }

    return NextResponse.json(
      { success: true, data: filtered } as ApiResponse<Resident[]>,
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch residents' } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, address, phone, purok } = body;

    if (!fullName || !email) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // TODO: Implement resident registration in database

    const newResident: Resident = {
      id: `res-${Date.now()}`,
      email,
      fullName,
      address,
      phone,
      purok,
      status: 'active',
      registeredAt: new Date(),
    };

    mockResidents.push(newResident);

    return NextResponse.json(
      { success: true, data: newResident } as ApiResponse<Resident>,
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to register resident' } as ApiResponse<null>,
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
        { success: false, error: 'Resident ID is required' } as ApiResponse<null>,
        { status: 400 }
      );
    }

    const residentIndex = mockResidents.findIndex((r) => r.id === id);
    if (residentIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Resident not found' } as ApiResponse<null>,
        { status: 404 }
      );
    }

    mockResidents[residentIndex] = { ...mockResidents[residentIndex], ...updates };

    return NextResponse.json(
      { success: true, data: mockResidents[residentIndex] } as ApiResponse<Resident>,
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update resident' } as ApiResponse<null>,
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
        { success: false, error: 'Resident ID is required' } as ApiResponse<null>,
        { status: 400 }
      );
    }

    const residentIndex = mockResidents.findIndex((r) => r.id === id);
    if (residentIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Resident not found' } as ApiResponse<null>,
        { status: 404 }
      );
    }

    mockResidents.splice(residentIndex, 1);

    return NextResponse.json(
      { success: true, data: null } as ApiResponse<null>,
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete resident' } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
