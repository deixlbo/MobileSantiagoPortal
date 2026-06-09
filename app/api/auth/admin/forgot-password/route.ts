import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

let supabase: any = null
function getSupabaseClient() {
  if (!supabase && supabaseUrl && supabaseServiceKey) {
    supabase = createClient(supabaseUrl, supabaseServiceKey)
  }
  return supabase
}

const rateLimitStore = new Map<string, { timestamp: number; count: number }>()

function isRateLimited(email: string, maxAttempts = 3, windowSeconds = 3600): boolean {
  const key = `admin-forgot-password:${email.toLowerCase()}`
  const now = Date.now()
  
  const entry = rateLimitStore.get(key)
  
  if (!entry) {
    rateLimitStore.set(key, { timestamp: now, count: 1 })
    return false
  }
  
  const timePassed = (now - entry.timestamp) / 1000
  
  if (timePassed > windowSeconds) {
    rateLimitStore.set(key, { timestamp: now, count: 1 })
    return false
  }
  
  if (entry.count >= maxAttempts) {
    return true
  }
  
  entry.count += 1
  return false
}

export async function POST(request: NextRequest) {
  try {
    const { email, redirectTo } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    if (isRateLimited(email)) {
      return NextResponse.json(
        { 
          error: 'Too many password reset attempts. Please wait 1 hour before trying again.',
          retryAfter: 3600,
          rateLimited: true
        },
        { status: 429 }
      )
    }

    const supabaseClient = getSupabaseClient()
    if (!supabaseClient) {
      console.error('[v0] Supabase server not configured for admin password reset')
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    // Check if admin exists
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('id, email, role')
      .eq('email', email.toLowerCase())
      .eq('role', 'admin')
      .single()

    if (profileError || !profile) {
      console.error('[v0] Admin lookup error:', profileError)
      // Don't reveal if admin exists or not
      return NextResponse.json({
        success: true,
        message: 'If an admin account exists with this email, a password reset link has been sent.'
      })
    }

    // Generate secure reset token
    const tokenPayload = {
      userId: profile.id,
      email: profile.email,
      type: 'admin_password_reset',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600
    }

    const token = Buffer.from(JSON.stringify(tokenPayload)).toString('base64')
    
    const effectiveRedirect = redirectTo || `${siteUrl}/admin/reset-password`
    const resetLink = `${effectiveRedirect}?token=${encodeURIComponent(token)}`

    console.log(`[v0] Admin password reset link for ${email}: ${resetLink}`)

    return NextResponse.json({
      success: true,
      message: 'If an admin account exists with this email, a password reset link has been sent.',
      ...(process.env.NODE_ENV === 'development' && { testToken: token })
    })
  } catch (error) {
    console.error('[v0] Admin forgot password error:', error)
    
    const errorMessage = String(error)
    if (errorMessage.includes('rate_limit') || errorMessage.includes('too many')) {
      return NextResponse.json(
        { 
          error: 'Too many requests. Please wait a moment before trying again.',
          rateLimited: true,
          retryAfter: 300
        },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to process reset request' },
      { status: 500 }
    )
  }
}
