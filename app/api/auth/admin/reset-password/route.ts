import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

let supabase: any = null
function getSupabaseClient() {
  if (!supabase && supabaseUrl && supabaseServiceKey) {
    supabase = createClient(supabaseUrl, supabaseServiceKey)
  }
  return supabase
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

    let tokenPayload: any
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8')
      tokenPayload = JSON.parse(decoded)
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid reset token' },
        { status: 400 }
      )
    }

    // Validate token
    if (!tokenPayload.userId || tokenPayload.type !== 'admin_password_reset') {
      return NextResponse.json(
        { error: 'Invalid reset token' },
        { status: 400 }
      )
    }

    if (tokenPayload.exp < Math.floor(Date.now() / 1000)) {
      return NextResponse.json(
        { error: 'Reset token has expired' },
        { status: 400 }
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

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    // Update user password using Auth Admin API
    const { data, error: updateError } = await supabaseClient.auth.admin.updateUserById(
      tokenPayload.userId,
      { password: newPassword }
    )

    if (updateError) {
      console.error('[v0] Admin password update error:', updateError.message)
      return NextResponse.json(
        { error: 'Failed to update password' },
        { status: 500 }
      )
    }

    // Also update the hashed password in profiles table if needed
    await supabaseClient
      .from('profiles')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', tokenPayload.userId)

    console.log(`[v0] Admin password reset successful for ${tokenPayload.email}`)

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully'
    })
  } catch (error) {
    console.error('[v0] Admin reset password error:', error)
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    )
  }
}
