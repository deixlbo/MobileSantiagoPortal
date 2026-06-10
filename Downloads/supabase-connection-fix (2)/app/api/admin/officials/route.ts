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

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const role = user.user_metadata?.role || user.app_metadata?.role
    if (role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { data, error, count } = await supabaseServer
      .from('profiles')
      .select('id, first_name, last_name, email, position, role, verification_status, contact_number, address', { count: 'exact' })
      .eq('role', 'official')
      .order('last_name', { ascending: true })

    if (error) {
      console.error('[admin/officials] Supabase error:', error)
      return NextResponse.json({ error: error.message || 'Failed to load official profiles' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: data || [], total: count ?? 0 })
  } catch (error) {
    console.error('[admin/officials] Route error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
