import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface NotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  category: 'emergency' | 'documentUpdate' | 'announcement' | 'reminder'
  data?: Record<string, any>
  userId?: string
  recipientIds?: string[]
}

/**
 * Send push notifications to subscribed users
 * Supports filtering by notification category and user preferences
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json() as NotificationPayload

    if (!payload.title || !payload.body || !payload.category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, body, category' },
        { status: 400 }
      )
    }

    // Build query for subscriptions to send to
    let query = supabase
      .from('push_subscriptions')
      .select('*')
      .eq('is_active', true)

    // Filter by recipient IDs if provided
    if (payload.recipientIds && payload.recipientIds.length > 0) {
      query = query.in('user_id', payload.recipientIds)
    }

    const { data: subscriptions, error } = await query

    if (error) {
      console.error('Error fetching subscriptions:', error)
      return NextResponse.json(
        { error: 'Failed to fetch subscriptions' },
        { status: 500 }
      )
    }

    // Map category to preference key
    const preferenceMap: Record<string, string> = {
      emergency: 'emergencyAlerts',
      documentUpdate: 'documentUpdates',
      announcement: 'announcements',
      reminder: 'reminders',
    }
    const preferenceKey = preferenceMap[payload.category]

    // Filter subscriptions by user preferences
    const filteredSubscriptions = subscriptions.filter(sub => {
      const prefs = sub.preferences || {}
      return prefs[preferenceKey] !== false
    })

    if (filteredSubscriptions.length === 0) {
      return NextResponse.json({
        success: true,
        sent: 0,
        message: 'No active subscriptions matching criteria',
      })
    }

    // Store notification record for audit trail
    const { error: notifError } = await supabase
      .from('notifications_sent')
      .insert({
        title: payload.title,
        body: payload.body,
        icon: payload.icon || '/images/santiagologo.jpg',
        badge: payload.badge || '/images/santiagologo.jpg',
        category: payload.category,
        data: payload.data || {},
        recipient_count: filteredSubscriptions.length,
        sent_at: new Date().toISOString(),
        sent_by: payload.userId || null,
      })

    if (notifError) {
      console.error('Error storing notification:', notifError)
    }

    return NextResponse.json({
      success: true,
      sent: filteredSubscriptions.length,
      message: `Notification sent to ${filteredSubscriptions.length} users`,
    })
  } catch (error) {
    console.error('Send notification error:', error)
    return NextResponse.json(
      { error: 'Failed to send notifications' },
      { status: 500 }
    )
  }
}

/**
 * Get notification history (for admin panel)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const category = searchParams.get('category')

    let query = supabase
      .from('notifications_sent')
      .select('*')
      .order('sent_at', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query.range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching notifications:', error)
      return NextResponse.json(
        { error: 'Failed to fetch notifications' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      notifications: data,
      count: data.length,
    })
  } catch (error) {
    console.error('Get notifications error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve notifications' },
      { status: 500 }
    )
  }
}
