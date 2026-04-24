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

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Handle getting a single announcement by ID
    if (id) {
      const announcement = mockAnnouncements.find(a => a.id === id);
      if (!announcement) {
        return NextResponse.json(
          { success: false, error: 'Announcement not found' } as ApiResponse<null>,
          { status: 404 }
        );
      }
      return NextResponse.json(
        { success: true, data: announcement } as ApiResponse<Announcement>,
        { status: 200 }
      );
    }

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
    const body = await request.json();
    const { title, description, category, priority, author } = body;

    if (!title || !category || !priority) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // TODO: Verify user is an official

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
    return NextResponse.json(
      { success: false, error: 'Failed to create announcement' } as ApiResponse<null>,
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
        { success: false, error: 'Announcement ID is required' } as ApiResponse<null>,
        { status: 400 }
      );
    }

    const announcementIndex = mockAnnouncements.findIndex((a) => a.id === id);
    if (announcementIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Announcement not found' } as ApiResponse<null>,
        { status: 404 }
      );
    }

    mockAnnouncements[announcementIndex] = { ...mockAnnouncements[announcementIndex], ...updates };

    return NextResponse.json(
      { success: true, data: mockAnnouncements[announcementIndex] } as ApiResponse<Announcement>,
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update announcement' } as ApiResponse<null>,
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
        { success: false, error: 'Announcement ID is required' } as ApiResponse<null>,
        { status: 400 }
      );
    }

    const announcementIndex = mockAnnouncements.findIndex((a) => a.id === id);
    if (announcementIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Announcement not found' } as ApiResponse<null>,
        { status: 404 }
      );
    }

    mockAnnouncements.splice(announcementIndex, 1);

    return NextResponse.json(
      { success: true, data: null } as ApiResponse<null>,
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete announcement' } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
