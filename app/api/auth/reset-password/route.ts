import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Lazy load Supabase client
let supabase: any = null
function getSupabaseClient() {
  if (!supabase && supabaseUrl && supabaseServiceKey) {
    supabase = createClient(supabaseUrl, supabaseServiceKey)
  }
  return supabase
}

interface TokenPayload {
  userId: string
  email: string
  type: string
  iat: number
  exp: number
}

function decodeToken(token: string): TokenPayload | null {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json()

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Token and new password are required' },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
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

    // Decode and validate token
    const payload = decodeToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid reset token' },
        { status: 400 }
      )
    }

    // Check token expiry
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp < now) {
      return NextResponse.json(
        { error: 'Reset link has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Verify token type
    if (payload.type !== 'password_reset') {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 400 }
      )
    }

    // Update user password in Supabase Auth
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      payload.userId,
      {
        password: newPassword
      }
    )

    if (updateError) {
      console.error('[v0] Password update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update password' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully. You can now login with your new password.'
    })
  } catch (error) {
    console.error('[v0] Reset password error:', error)
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    )
  }
}
