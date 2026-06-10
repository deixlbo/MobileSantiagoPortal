import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

async function getCookieSupabase() {
  const cookieStore = await cookies()
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)
        )
      },
    },
  })
}

async function getCurrentUser(request: NextRequest) {
  const supabase = await getCookieSupabase()
  const { data: sessionData } = await supabase.auth.getSession()
  let user = sessionData?.session?.user

  if (!user) {
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : null
    if (token) {
      const { data: tokenData, error: tokenError } = await supabaseServer.auth.getUser(token)
      if (!tokenError) {
        user = tokenData?.user
      }
    }
  }

  return user
}

async function authorizeAdminOrOfficial(request: NextRequest) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { data: profile, error } = await supabaseServer
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (error || !profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  if (!['admin', 'official'].includes(profile.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  return null
}

export async function GET(req: NextRequest) {
  const authErrorResponse = await authorizeAdminOrOfficial(req)
  if (authErrorResponse) return authErrorResponse

  try {
    const { searchParams } = new URL(req.url)
    const householdId = searchParams.get('householdId')

    if (householdId) {
      const { data: household, error: householdError } = await supabaseServer
        .from('households')
        .select('*')
        .eq('id', householdId)
        .single()

      if (householdError) throw householdError

      const { data: members, error: membersError } = await supabaseServer
        .from('household_members')
        .select('id, first_name, last_name, relationship')
        .eq('household_id', householdId)
        .order('created_at')

      if (membersError) throw membersError

      return NextResponse.json({ household, members })
    }

    const { data: households, error } = await supabaseServer
      .from('households')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(households)
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const authErrorResponse = await authorizeAdminOrOfficial(req)
  if (authErrorResponse) return authErrorResponse

  try {
    const body = await req.json()
    const { name, address, purok, head_id } = body

    if (!name || !address) {
      return NextResponse.json(
        { error: 'household name and address are required' },
        { status: 400 }
      )
    }

    const { data: household, error } = await supabaseServer
      .from('households')
      .insert([
        {
          name,
          address,
          purok,
          head_id: head_id || null,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(household, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}
