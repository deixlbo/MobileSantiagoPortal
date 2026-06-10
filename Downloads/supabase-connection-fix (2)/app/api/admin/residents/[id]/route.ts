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

export async function DELETE(request: NextRequest, { params }: { params?: { id?: string | string[] } }) {
  const { searchParams } = new URL(request.url)
  const fallbackId = searchParams.get('id')
  const idParam = params?.id
  const id = Array.isArray(idParam) ? idParam[0] : idParam || fallbackId

  if (!id) {
    return NextResponse.json({ error: 'Resident ID is required' }, { status: 400 })
  }

  try {
    const user = await getCurrentUser(request)

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const role = user.user_metadata?.role || user.app_metadata?.role
    if (role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { error: profileError } = await supabaseServer
      .from('profiles')
      .delete()
      .eq('id', id)

    if (profileError) {
      console.error('[admin/residents/[id]] Profile delete error:', profileError)
      return NextResponse.json(
        { error: profileError.message || 'Failed to delete resident profile' },
        { status: 500 }
      )
    }

    const { error: authError } = await supabaseServer.auth.admin.deleteUser(id)
    if (authError) {
      console.error('[admin/residents/[id]] Auth delete error:', authError)
      return NextResponse.json(
        { error: authError.message || 'Failed to delete auth user' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[admin/residents/[id]] Delete error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete resident' },
      { status: 500 }
    )
  }
}
