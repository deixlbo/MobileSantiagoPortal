import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, title, message, type, link } = body

    // Validate required fields
    if (!userId || !title || !message || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, title, message, type' },
        { status: 400 }
      )
    }

    const now = new Date().toISOString()

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
          created_at: now,
          updated_at: now,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('[Notifications POST Error]', error.message)
      return NextResponse.json(
        { error: 'Failed to create notification' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      notification,
    }, { status: 201 })
  } catch (error) {
    console.error('[Notifications POST Exception]', error)
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
        { error: 'userId query parameter is required' },
        { status: 400 }
      )
    }

    let query = supabaseServer.from('notifications').select('*').eq('user_id', userId)
    if (unreadOnly) {
      query = query.eq('read', false)
    }

    const { data: userNotifications, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('[Notifications GET Error]', error.message)
      return NextResponse.json(
        { error: 'Failed to fetch notifications' },
        { status: 500 }
      )
    }

    return NextResponse.json(userNotifications || [])
  } catch (error) {
    console.error('[Notifications GET Exception]', error)
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

    if (!id) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      )
    }

    if (typeof read !== 'boolean') {
      return NextResponse.json(
        { error: 'read field must be a boolean' },
        { status: 400 }
      )
    }

    const { data: notification, error } = await supabaseServer
      .from('notifications')
      .update({ read, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[Notifications PUT Error]', error.message)
      return NextResponse.json(
        { error: 'Notification not found or update failed' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, notification })
  } catch (error) {
    console.error('[Notifications PUT Exception]', error)
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    )
  }
}
