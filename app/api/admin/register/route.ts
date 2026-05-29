import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName } = body

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data: userData, error: authError } = await supabaseServer.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        role: 'admin',
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
      return NextResponse.json({ error: 'Failed to create admin user' }, { status: 500 })
    }

    const { data: profile, error: profileError } = await supabaseServer
      .from('profiles')
      .upsert([
        {
          id: userId,
          email,
          role: 'admin',
          first_name: firstName,
          last_name: lastName,
          position: 'Administrator',
        },
      ])
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
