import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName, role, position, purok, gender, occupation, contactNumber, address } = body

    if (!email || !password || !firstName || !lastName || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const authRole = role === 'admin' ? 'admin' : role === 'official' ? 'official' : 'resident'
    const profileRole = authRole

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
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    const userId = userData.user?.id
    if (!userId) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
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
      // If an admin created the resident account, mark as verified immediately
      verification_status: profileRole === 'resident' ? (creatorIsAdmin ? 'verified' : 'pending') : undefined,
      purok: purok || undefined,
      gender: gender || undefined,
      occupation: occupation || undefined,
      contact_number: contactNumber || undefined,
      address: address || undefined,
    }

    if (profileRole === 'admin') {
      profilePayload.position = position || 'Administrator'
    } else if (position) {
      profilePayload.position = position
    }

    const { data: profile, error: profileError } = await supabaseServer
      .from('profiles')
      .upsert([profilePayload])
      .select()
      .single()

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, user: userData.user, profile })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
