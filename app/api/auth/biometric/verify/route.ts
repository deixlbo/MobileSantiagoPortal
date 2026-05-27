import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

/**
 * Verify a biometric credential
 * Checks if the credential exists and is active for the user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, credentialId } = body

    if (!userId || !credentialId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if credential exists and belongs to this user
    const { data: credential, error } = await supabase
      .from('biometric_credentials')
      .select('id, public_key, is_active')
      .eq('user_id', userId)
      .eq('credential_id', credentialId)
      .single()

    if (error || !credential) {
      return NextResponse.json(
        { error: 'Credential not found or inactive' },
        { status: 404 }
      )
    }

    if (!credential.is_active) {
      return NextResponse.json(
        { error: 'Credential is inactive' },
        { status: 403 }
      )
    }

    // Update last used timestamp
    await supabase
      .from('biometric_credentials')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', credential.id)

    return NextResponse.json({
      success: true,
      verified: true,
      publicKey: credential.public_key,
    })
  } catch (error) {
    console.error('Biometric verification error:', error)
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    )
  }
}
