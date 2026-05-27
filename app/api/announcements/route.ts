import { NextRequest, NextResponse } from 'next/server'
import { Announcement } from '@/lib/database'

// In-memory storage for announcements
const announcements: Map<string, Announcement> = new Map()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      content,
      targetAudience,
      scheduledDate,
      createdBy,
    } = body

    if (!title || !content || !createdBy) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const announcement: Announcement = {
      id: `announcement-${Date.now()}`,
      title,
      content,
      targetAudience: targetAudience || 'all',
      scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined,
      postedAt: new Date(),
      createdBy,
      isActive: true,
    }

    announcements.set(announcement.id, announcement)

    return NextResponse.json({
      success: true,
      announcement,
    })
  } catch (error) {
    console.error('Error creating announcement:', error)
    return NextResponse.json(
      { error: 'Failed to create announcement' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const announcementId = searchParams.get('id')
    const targetAudience = searchParams.get('targetAudience')

    if (announcementId) {
      const announcement = announcements.get(announcementId)
      if (!announcement) {
        return NextResponse.json(
          { error: 'Announcement not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(announcement)
    }

    let allAnnouncements = Array.from(announcements.values()).filter(
      (a) => a.isActive
    )

    if (targetAudience) {
      allAnnouncements = allAnnouncements.filter(
        (a) => a.targetAudience === targetAudience || a.targetAudience === 'all'
      )
    }

    allAnnouncements.sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime())

    return NextResponse.json(allAnnouncements)
  } catch (error) {
    console.error('Error fetching announcements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch announcements' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, isActive, ...updates } = body

    const announcement = announcements.get(id)
    if (!announcement) {
      return NextResponse.json(
        { error: 'Announcement not found' },
        { status: 404 }
      )
    }

    if (isActive !== undefined) {
      announcement.isActive = isActive
    }

    Object.assign(announcement, updates)

    announcements.set(id, announcement)

    return NextResponse.json({
      success: true,
      announcement,
    })
  } catch (error) {
    console.error('Error updating announcement:', error)
    return NextResponse.json(
      { error: 'Failed to update announcement' },
      { status: 500 }
    )
  }
}
