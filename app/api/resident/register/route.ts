import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName, purok, gender, occupation, contact_number, address } = body

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    console.log('[v0] Creating resident auth user:', { email })

    const { data: userData, error: authError } = await supabaseServer.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        role: 'resident',
        firstName,
        lastName,
      },
      email_confirm: true,
    })

    if (authError) {
      console.error('[v0] Auth creation error:', authError)
      return NextResponse.json({ error: `Failed to create user: ${authError.message}` }, { status: 400 })
    }

    if (!userData.user) {
      console.error('[v0] No user returned from auth creation')
      return NextResponse.json({ error: 'No user created' }, { status: 400 })
    }

    const userId = userData.user.id
    if (!userId) {
      console.error('[v0] No user ID from auth creation')
      return NextResponse.json({ error: 'Failed to create user account' }, { status: 500 })
    }

    const profilePayload: Record<string, any> = {
      id: userId,
      email,
      role: 'resident',
      first_name: firstName,
      last_name: lastName,
      verification_status: 'pending',
      purok: purok || undefined,
      gender: gender || undefined,
      occupation: occupation || undefined,
      contact_number: contact_number || undefined,
      address: address || undefined,
    }

    console.log('[v0] Creating resident profile:', { userId, email })

    const { data: profile, error: profileError } = await supabaseServer
      .from('profiles')
      .insert([profilePayload])
      .select()
      .single()

    if (profileError) {
      console.error('[v0] Profile insertion error:', profileError)
      return NextResponse.json({ error: `Failed to create profile: ${profileError.message}` }, { status: 500 })
    }

    console.log('[v0] Resident account created successfully:', { userId, email })
    return NextResponse.json({ success: true, user: userData.user, profile }, { status: 201 })
  } catch (error) {
    console.error('[v0] Registration error:', error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
