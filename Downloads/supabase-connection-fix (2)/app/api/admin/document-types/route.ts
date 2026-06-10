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

export async function GET(request: NextRequest) {
  const authErrorResponse = await authorizeAdminOrOfficial(request)
  if (authErrorResponse) return authErrorResponse

  try {
    const { data, error } = await supabaseServer
      .from('document_types')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[admin/document-types GET] Supabase error:', error)
      return NextResponse.json({ error: error.message || 'Failed to load document types' }, { status: 500 })
    }

    return NextResponse.json({ data: data || [] })
  } catch (error) {
    console.error('[admin/document-types GET] Route error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authErrorResponse = await authorizeAdminOrOfficial(request)
  if (authErrorResponse) return authErrorResponse

  try {
    const body = await request.json()
    const { name, requirements, fee, is_active } = body

    if (!name || !Array.isArray(requirements) || !fee) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabaseServer
      .from('document_types')
      .insert([
        {
          name: name.trim(),
          requirements,
          fee: fee.trim(),
          is_active: is_active ?? true,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('[admin/document-types POST] Supabase error:', error)
      return NextResponse.json({ error: error.message || 'Failed to create document type' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('[admin/document-types POST] Route error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const authErrorResponse = await authorizeAdminOrOfficial(request)
  if (authErrorResponse) return authErrorResponse

  try {
    const body = await request.json()
    const { id, name, requirements, fee, is_active } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing document type id' }, { status: 400 })
    }

    const updatePayload: Record<string, unknown> = {}
    if (name !== undefined) updatePayload.name = String(name).trim()
    if (requirements !== undefined) updatePayload.requirements = requirements
    if (fee !== undefined) updatePayload.fee = String(fee).trim()
    if (is_active !== undefined) updatePayload.is_active = Boolean(is_active)

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    const { data, error } = await supabaseServer
      .from('document_types')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[admin/document-types PUT] Supabase error:', error)
      return NextResponse.json({ error: error.message || 'Failed to update document type' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('[admin/document-types PUT] Route error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const authErrorResponse = await authorizeAdminOrOfficial(request)
  if (authErrorResponse) return authErrorResponse

  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing document type id' }, { status: 400 })
    }

    const { error } = await supabaseServer
      .from('document_types')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('[admin/document-types DELETE] Supabase error:', error)
      return NextResponse.json({ error: error.message || 'Failed to delete document type' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[admin/document-types DELETE] Route error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 })
  }
}
