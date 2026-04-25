import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, Announcement } from '@/lib/types';

// Mock data store
const mockAnnouncements: Announcement[] = [
  {
    id: 'ann-001',
    title: 'Clean-Up Drive - April 13',
    description: 'Join us for the monthly community clean-up',
    category: 'Event',
    priority: 'medium',
    createdAt: new Date('2024-04-01'),
    author: 'Hon. Rolando C. Borja',
  },
  {
    id: 'ann-002',
    title: 'Free Medical Mission',
    description: 'Free health check-up and medical consultation',
    category: 'Event',
    priority: 'high',
    createdAt: new Date('2024-04-05'),
    author: 'Health Officer',
  },
];

export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check
    // TODO: Implement sorting and filtering

    return NextResponse.json(
      { success: true, data: mockAnnouncements } as ApiResponse<Announcement[]>,
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch announcements' } as ApiResponse<null>,
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

    const { title, description, category, priority, author } = body;

    if (!title || !category || !priority) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' } as ApiResponse<null>,
        { status: 400 }
      );
    }

    const newAnnouncement: Announcement = {
      id: `ann-${Date.now()}`,
      title,
      description,
      category,
      priority,
      createdAt: new Date(),
      author,
    };

    mockAnnouncements.push(newAnnouncement);

    return NextResponse.json(
      { success: true, data: newAnnouncement } as ApiResponse<Announcement>,
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create announcement';
    return NextResponse.json(
      { success: false, error: errorMessage } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
