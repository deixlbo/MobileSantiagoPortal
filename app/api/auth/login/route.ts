import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, User, UserRole } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    // Safely parse the request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' } as ApiResponse<null>,
        { status: 400 }
      );
    }

    const { email, password, role }: { email: string; password: string; role: UserRole } = body;

    if (!email || !password || !role) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Mock user data for demonstration
    const mockUsers: Record<string, User> = {
      'juan@email.com': {
        uid: 'res-001',
        email: 'juan@email.com',
        fullName: 'Juan dela Cruz',
        role: 'resident',
        address: 'Purok 1, Barangay Santiago',
        phone: '09123456789',
      },
      'captain@brgy-santiago.gov.ph': {
        uid: 'off-001',
        email: 'captain@brgy-santiago.gov.ph',
        fullName: 'Hon. Rolando C. Borja',
        role: 'official',
        address: 'Barangay Hall, Santiago',
      },
    };

    const user = mockUsers[email.toLowerCase()];

    if (!user || password.length < 4) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' } as ApiResponse<null>,
        { status: 401 }
      );
    }

    if (user.role !== role) {
      return NextResponse.json(
        { success: false, error: 'User role mismatch' } as ApiResponse<null>,
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: true, data: user } as ApiResponse<User>,
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: errorMessage } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
