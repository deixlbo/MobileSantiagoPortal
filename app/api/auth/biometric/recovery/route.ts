import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

/**
 * Use a recovery code to access account without biometric
 * Each code can only be used once
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, recoveryCode } = body

    if (!userId || !recoveryCode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Hash the recovery code
    const codeHash = hashCode(recoveryCode)

    // Check if code exists and hasn't been used
    const { data: record, error } = await supabase
      .from('biometric_recovery_codes')
      .select('id')
      .eq('user_id', userId)
      .eq('code_hash', codeHash)
      .is('used_at', null)
      .single()

    if (error || !record) {
      return NextResponse.json(
        { error: 'Invalid or already used recovery code' },
        { status: 401 }
      )
    }

    // Mark code as used
    await supabase
      .from('biometric_recovery_codes')
      .update({ used_at: new Date().toISOString() })
      .eq('id', record.id)

    // Create a temporary session or auth token
    // This is typically handled by your auth system
    return NextResponse.json({
      success: true,
      message: 'Recovery code accepted. Please set up a new biometric credential.',
      recoveryCodeUsed: true,
    })
  } catch (error) {
    console.error('Recovery code error:', error)
    return NextResponse.json(
      { error: 'Recovery failed' },
      { status: 500 }
    )
  }
}

/**
 * Regenerate recovery codes
 * Creates new set of recovery codes for the user
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing user ID' },
        { status: 400 }
      )
    }

    // Delete old unused recovery codes
    await supabase
      .from('biometric_recovery_codes')
      .update({ used_at: new Date().toISOString() })
      .eq('user_id', userId)
      .is('used_at', null)

    // Generate new codes
    const newCodes = generateRecoveryCodes()
    const hashedCodes = newCodes.map(code => hashCode(code))

    // Store new codes
    const { error } = await supabase
      .from('biometric_recovery_codes')
      .insert(
        hashedCodes.map(code => ({
          user_id: userId,
          code_hash: code,
          used_at: null,
          created_at: new Date().toISOString(),
        }))
      )

    if (error) {
      return NextResponse.json(
        { error: 'Failed to generate codes' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      recoveryCodes: newCodes,
      message: 'New recovery codes generated',
    })
  } catch (error) {
    console.error('Recovery code generation error:', error)
    return NextResponse.json(
      { error: 'Generation failed' },
      { status: 500 }
    )
  }
}

function generateRecoveryCodes(count = 8): string[] {
  const codes: string[] = []
  for (let i = 0; i < count; i++) {
    const code = Array.from(crypto.getRandomValues(new Uint8Array(4)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('-')
    codes.push(code)
  }
  return codes
}

function hashCode(code: string): string {
  const encoder = new TextEncoder()
  const data = encoder.encode(code)
  return Buffer.from(data).toString('base64')
}
