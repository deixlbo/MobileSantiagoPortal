import { NextRequest, NextResponse } from 'next/server'
import { Notification } from '@/lib/database'

// In-memory storage for notifications
const notifications: Map<string, Notification> = new Map()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, title, message, type, link } = body

    if (!userId || !title || !message || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const notification: Notification = {
      id: `notif-${Date.now()}`,
      userId,
      title,
      message,
      type: type as any,
      link: link || undefined,
      read: false,
      createdAt: new Date(),
    }

    notifications.set(notification.id, notification)

    return NextResponse.json({
      success: true,
      notification,
    })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    let userNotifications = Array.from(notifications.values()).filter(
      (n) => n.userId === userId
    )

    if (unreadOnly) {
      userNotifications = userNotifications.filter((n) => !n.read)
    }

    userNotifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    return NextResponse.json(userNotifications)
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, read } = body

    const notification = notifications.get(id)
    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      )
    }

    if (read !== undefined) {
      notification.read = read
    }

    notifications.set(id, notification)

    return NextResponse.json({
      success: true,
      notification,
    })
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    )
  }
}
