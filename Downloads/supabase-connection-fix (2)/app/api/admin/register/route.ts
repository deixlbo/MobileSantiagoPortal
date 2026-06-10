import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName, role, position, purok, gender, occupation, contactNumber, address, dateOfBirth, civilStatus } = body

    if (!email || !password || !firstName || !lastName || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const authRole = role === 'admin' ? 'admin' : role === 'official' ? 'official' : 'resident'
    const profileRole = authRole

    console.log('[v0] Creating auth user:', { email, role: authRole })

    const { data: userData, error: authError } = await supabaseServer.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        role: authRole,
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

    // Determine if the request caller is an admin by reading the Authorization header
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader
    let creatorIsAdmin = false
    if (token) {
      const { data: callerData, error: callerError } = await supabaseServer.auth.getUser(token)
      const caller = callerData?.user
      if (caller) {
        // Prefer metadata role if present, otherwise check profiles table
        const metaRole = caller.user_metadata?.role ?? caller.app_metadata?.role
        if (metaRole === 'admin') {
          creatorIsAdmin = true
        } else {
          const { data: callerProfile } = await supabaseServer.from('profiles').select('role').eq('id', caller.id).single()
          if (callerProfile?.role === 'admin') creatorIsAdmin = true
        }
      }
    }

    const profilePayload: Record<string, any> = {
      id: userId,
      email,
      role: profileRole,
      first_name: firstName,
      last_name: lastName,
      verification_status:
        profileRole === 'official'
          ? 'verified'
          : profileRole === 'resident'
            ? creatorIsAdmin
              ? 'verified'
              : 'pending'
            : undefined,
      purok: purok || undefined,
      gender: gender || undefined,
      occupation: occupation || undefined,
      date_of_birth: dateOfBirth || undefined,
      civil_status: civilStatus || undefined,
      contact_number: contactNumber || undefined,
      address: address || undefined,
    }

    if (profileRole === 'admin') {
      profilePayload.position = position || 'Administrator'
    } else if (position) {
      profilePayload.position = position
    }

    // Insert profile into database
    const { data: profile, error: profileError } = await supabaseServer
      .from('profiles')
      .insert([profilePayload])
      .select()
      .single()

    if (profileError) {
      console.error('[v0] Profile insertion error:', profileError)
      // Only show specific error if it's a meaningful one
      let errorMsg = profileError.message
      if (errorMsg.includes('schema cache')) {
        errorMsg = 'Database schema cache is syncing. Please try again in a moment.'
      }
      return NextResponse.json({ error: `Failed to create profile: ${errorMsg}` }, { status: 500 })
    }

    console.log('[v0] Account created successfully:', { userId, email, role: authRole })
    return NextResponse.json({ success: true, user: userData.user, profile }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
