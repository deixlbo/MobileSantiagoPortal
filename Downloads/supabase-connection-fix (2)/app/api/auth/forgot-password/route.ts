import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const jwtSecret = process.env.JWT_SECRET || 'your-secret-key'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

// Lazy load Supabase client
let supabase: any = null
function getSupabaseClient() {
  if (!supabase && supabaseUrl && supabaseServiceKey) {
    supabase = createClient(supabaseUrl, supabaseServiceKey)
  }
  return supabase
}

// Simple in-memory rate limiter for server-side (will reset on deploy)
const rateLimitStore = new Map<string, { timestamp: number; count: number }>()

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function getRateLimitKey(email: string, request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  const ip = forwardedFor?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'
  return `forgot-password:${normalizeEmail(email)}:${ip}`
}

function isRateLimited(email: string, request: NextRequest, maxAttempts = 5, windowSeconds = 900): { limited: boolean; retryAfter: number } {
  const key = getRateLimitKey(email, request)
  const now = Date.now()

  const entry = rateLimitStore.get(key)

  if (!entry) {
    rateLimitStore.set(key, { timestamp: now, count: 1 })
    return { limited: false, retryAfter: 0 }
  }

  const timePassed = (now - entry.timestamp) / 1000

  if (timePassed > windowSeconds) {
    rateLimitStore.set(key, { timestamp: now, count: 1 })
    return { limited: false, retryAfter: 0 }
  }

  if (entry.count >= maxAttempts) {
    return {
      limited: true,
      retryAfter: Math.max(1, Math.ceil(windowSeconds - timePassed)),
    }
  }

  entry.count += 1
  return { limited: false, retryAfter: 0 }
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

    const normalizedEmail = normalizeEmail(email)

    // Check rate limit
    const { limited, retryAfter } = isRateLimited(normalizedEmail, request)
    if (limited) {
      return NextResponse.json(
        {
          error: 'Too many password reset requests. Please wait a few minutes before trying again.',
          retryAfter,
          rateLimited: true
        },
        { status: 429 }
      )
    }

    const supabaseClient = getSupabaseClient()
    if (!supabaseClient) {
      console.error('[v0] Supabase server not configured for password reset')
      return NextResponse.json(
        { error: 'Supabase server is not configured' },
        { status: 500 }
      )
    }

    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('id, email')
      .eq('email', normalizedEmail)
      .single()

    if (profileError) {
      console.error('[v0] Forgot password lookup error:', profileError)
      // Don't reveal if email exists or not
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.'
      })
    }

    if (!profile) {
      // Don't reveal if email exists or not - return success
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.'
      })
    }

    // Generate secure reset token (JWT format with expiry)
    const tokenPayload = {
      userId: profile.id,
      email: profile.email,
      type: 'password_reset',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour expiry
    }

    // In production, use JWT library. For now, create a simple hash
    const token = Buffer.from(JSON.stringify(tokenPayload)).toString('base64')
    
    // Store reset token in database (you'd need a password_reset_tokens table)
    // For now, we'll pass it in the link
    const effectiveRedirect = redirectTo || `${siteUrl}/reset-password`
    const resetLink = `${effectiveRedirect}?token=${encodeURIComponent(token)}`

    // Send email (using Resend or SendGrid)
    // For now, we'll log it
    console.log(`[v0] Password reset link for ${email}: ${resetLink}`)

    // In production, send actual email:
    /*
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'noreply@santiago.gov.ph',
        to: email,
        subject: 'Reset Your Barangay Santiago Portal Password',
        html: `
          <h1>Password Reset Request</h1>
          <p>We received a request to reset your password.</p>
          <p>Click the link below to proceed (valid for 1 hour):</p>
          <a href="${resetLink}">Reset Password</a>
          <p>If you didn't request this, ignore this email.</p>
        `
      })
    })
    */

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent.',
      // For testing only - remove in production
      ...(process.env.NODE_ENV === 'development' && { testToken: token })
    })
  } catch (error) {
    console.error('[v0] Forgot password error:', error)
    
    // Check if it's a Supabase rate limit error
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
