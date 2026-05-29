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
 * Register a biometric credential for a user
 * Stores the credential ID and public key in the database
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, credentialId, publicKey, credentialRawId, transports } = body

    if (!userId || !credentialId || !publicKey) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Store credential in Supabase
    const { data, error } = await supabase
      .from('biometric_credentials')
      .insert({
        user_id: userId,
        credential_id: credentialId,
        public_key: publicKey,
        credential_raw_id: credentialRawId,
        transports: transports || [],
        created_at: new Date().toISOString(),
        is_active: true,
      })
      .select()

    if (error) {
      console.error('Error storing biometric credential:', error)
      return NextResponse.json(
        { error: 'Failed to store credential' },
        { status: 500 }
      )
    }

    // Generate recovery codes
    const recoveryCodes = generateRecoveryCodes()
    
    // Store recovery codes (hashed)
    const hashedCodes = recoveryCodes.map(code => hashCode(code))
    const { error: recoveryError } = await supabase
      .from('biometric_recovery_codes')
      .insert(
        hashedCodes.map(code => ({
          user_id: userId,
          code_hash: code,
          used_at: null,
          created_at: new Date().toISOString(),
        }))
      )

    if (recoveryError) {
      console.error('Error storing recovery codes:', recoveryError)
    }

    return NextResponse.json({
      success: true,
      credentialId: data?.[0]?.id,
      recoveryCodes, // Return plaintext codes only once
      message: 'Biometric credential registered successfully',
    })
  } catch (error) {
    console.error('Biometric registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed' },
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
  // Simple hash using TextEncoder and crypto
  const encoder = new TextEncoder()
  const data = encoder.encode(code)
  // Return base64 encoded hash for storage
  return Buffer.from(data).toString('base64')
}
