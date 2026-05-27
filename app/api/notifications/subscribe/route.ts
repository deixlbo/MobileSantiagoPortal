import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

/**
 * Subscribe user to push notifications
 * Stores the push subscription and notification preferences in database
 */
export async function POST(request: NextRequest) {
  try {
    const { subscription, preferences, userId } = await request.json()

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { error: 'Invalid subscription' },
        { status: 400 }
      )
    }

    // Store subscription in database
    const { data, error } = await supabase
      .from('push_subscriptions')
      .insert({
        user_id: userId || null,
        endpoint: subscription.endpoint,
        auth: subscription.keys?.auth || null,
        p256dh: subscription.keys?.p256dh || null,
        preferences: preferences || {
          documentUpdates: true,
          announcements: true,
          reminders: true,
          emergencyAlerts: true,
        },
        is_active: true,
        subscribed_at: new Date().toISOString(),
      })
      .select()

    if (error) {
      console.error('Error storing subscription:', error)
      return NextResponse.json(
        { error: 'Failed to store subscription' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      subscriptionId: data?.[0]?.id,
      message: 'Successfully subscribed to push notifications',
    })
  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json(
      { error: 'Subscription failed' },
      { status: 500 }
    )
  }
}
