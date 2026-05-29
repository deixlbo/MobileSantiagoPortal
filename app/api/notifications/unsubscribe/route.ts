import { NextRequest, NextResponse } from 'next/server'

// Initialize Supabase client only if credentials are available
const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return null
  }

  const { createClient } = require('@supabase/supabase-js')
  return createClient(supabaseUrl, supabaseServiceKey)
}

const supabase = getSupabaseClient()
if (!supabase) {
  throw new Error('Supabase client is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SERVICE_KEY.')
}

/**
 * Unsubscribe user from push notifications
 * Marks subscription as inactive in the database
 */
export async function POST(request: NextRequest) {
  try {
    const { endpoint, userId } = await request.json()

    if (!endpoint) {
      return NextResponse.json(
        { error: 'Missing endpoint' },
        { status: 400 }
      )
    }

    // Mark subscription as inactive
    const { error } = await supabase
      .from('push_subscriptions')
      .update({ is_active: false, unsubscribed_at: new Date().toISOString() })
      .eq('endpoint', endpoint)

    if (error) {
      console.error('Error unsubscribing:', error)
      return NextResponse.json(
        { error: 'Failed to unsubscribe' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from push notifications',
    })
  } catch (error) {
    console.error('Unsubscribe error:', error)
    return NextResponse.json(
      { error: 'Unsubscribe failed' },
      { status: 500 }
    )
  }
}
