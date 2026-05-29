import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

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

    const { data: notification, error } = await supabaseServer
      .from('notifications')
      .insert([
        {
          user_id: userId,
          title,
          message,
          type,
          link: link || null,
          read: false,
          created_at: new Date(),
        },
      ])
      .select()
      .single()

    if (error) throw error

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

    let query = supabaseServer.from('notifications').select('*').eq('user_id', userId)
    if (unreadOnly) query = query.eq('read', false)
    const { data: userNotifications, error } = await query.order('created_at', { ascending: false })
    if (error) throw error
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

    const { data: notification, error } = await supabaseServer
      .from('notifications')
      .update({ read })
      .eq('id', id)
      .select()
      .single()
    if (error) {
      return NextResponse.json({ error: error.message || 'Notification not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, notification })
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    )
  }
}
