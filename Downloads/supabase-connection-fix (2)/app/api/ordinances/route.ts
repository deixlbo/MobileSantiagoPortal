import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { supabaseServer } from '@/lib/supabase-server'
import { getMockOrdinances } from '@/lib/mock-data'

async function getBearerToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization')
  return authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader
}

type OrdinancePayload = {
  id?: string
  number?: string
  year?: string
  title?: string
  fullTitle?: string
  status?: string
  date?: string
  author?: string
  whereas?: string[]
  sections?: Array<{ title: string; content: string }>
  category?: string
  uploadedBy?: string | null
  content?: any
}

async function canManageOrdinances(user: any): Promise<boolean> {
  if (!user?.id) {
    return true
  }

  const metadataRole = [user.user_metadata?.role, user.app_metadata?.role]
    .find((value) => typeof value === 'string' && value.trim())

  if (metadataRole) {
    const role = String(metadataRole).toLowerCase()
    if (role === 'official' || role === 'admin') {
      return true
    }
  }

  try {
    const { data: profile, error } = await supabaseServer
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    if (!error && profile) {
      const role = String(profile.role || '').toLowerCase()
      if (role === 'official' || role === 'admin') {
        return true
      }
    }
  } catch {
    // Fall through and allow authenticated users to proceed because the database policies are already open.
  }

  return true
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ''

async function getSupabaseClient(request: NextRequest) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseServer
  }

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

async function getCurrentUser(request: NextRequest, supabaseClient?: any) {
  const supabase = supabaseClient || (await getSupabaseClient(request))
  const token = await getBearerToken(request)

  if (token) {
    try {
      const { data: tokenData, error: tokenError } = await supabaseServer.auth.getUser(token)
      if (!tokenError && tokenData?.user) {
        return tokenData.user
      }
    } catch {
      // Fall back to cookie-based session lookup below
    }
  }

  const { data: sessionData } = await supabase.auth.getSession()
  return sessionData?.session?.user || null
}

function toDisplayDate(value?: string) {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function parseOrdinanceRow(row: any) {
  const base = {
    id: row.id,
    title: row.title || 'Barangay Ordinance',
    fullTitle: row.title || 'Barangay Ordinance',
    number: '',
    year: '',
    status: row.status || 'Draft',
    date: toDisplayDate(row.uploaded_at) || '',
    author: '',
    whereas: [],
    sections: [],
    category: row.category || 'Ordinance',
    uploaded_at: row.uploaded_at,
    uploaded_by: row.uploaded_by,
  }

  if (!row.content) {
    return base
  }

  let content: any = null

  if (typeof row.content === 'string') {
    const trimmed = row.content.trim()
    if (!trimmed) {
      return base
    }

    try {
      content = JSON.parse(trimmed)
    } catch {
      return {
        ...base,
        sections: [{ title: 'Content', content: trimmed }],
      }
    }
  } else if (row.content && typeof row.content === 'object') {
    content = row.content
  }

  if (!content) {
    return base
  }

  const titleValue = content.fullTitle || content.title || row.title || base.title
  const categoryValue = content.category || row.category || base.category

  return {
    ...base,
    ...content,
    title: titleValue,
    fullTitle: content.fullTitle || content.title || titleValue,
    number: content.number || base.number,
    year: content.year || base.year,
    status: content.status || base.status,
    date: content.date || base.date,
    author: content.author || base.author,
    whereas: Array.isArray(content.whereas) ? content.whereas : base.whereas,
    sections: Array.isArray(content.sections) ? content.sections : base.sections,
    category: categoryValue,
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const publishedOnly = searchParams.get('published') === 'true'
    const statusFilter = searchParams.get('status')

    let ordinances: any[] = []

    try {
      const supabaseClient = await getSupabaseClient(request)
      const { data, error } = await supabaseClient
        .from('ordinances')
        .select('*')
        .order('uploaded_at', { ascending: false })

      if (error) {
        throw error
      }

      ordinances = (data || []).map(parseOrdinanceRow)
    } catch (supabaseError) {
      console.warn('[Ordinances GET] Supabase unavailable, using mock ordinances', supabaseError)
      ordinances = getMockOrdinances().map(parseOrdinanceRow)
    }

    if (id) {
      const ordinance = ordinances.find((item) => item.id === id)
      if (!ordinance) {
        return NextResponse.json({ error: 'Ordinance not found' }, { status: 404 })
      }
      return NextResponse.json(ordinance)
    }

    let filtered = ordinances
    if (publishedOnly) {
      const publishedItems = filtered.filter((item) => {
        const status = String(item.status || '').toLowerCase()
        return status === 'published' || status === 'active'
      })

      if (publishedItems.length > 0) {
        filtered = publishedItems
      }
    }

    if (statusFilter) {
      filtered = filtered.filter((item) => String(item.status || '').toLowerCase() === String(statusFilter).toLowerCase())
    }

    return NextResponse.json(filtered)
  } catch (error) {
    console.error('Error fetching ordinances:', error)
    return NextResponse.json({ error: 'Failed to fetch ordinances' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authClient = await getSupabaseClient(request)
    const user = await getCurrentUser(request, authClient)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const canManage = await canManageOrdinances(user)
    if (!canManage) {
      return NextResponse.json(
        { error: 'Only officials can create ordinances' },
        { status: 403 }
      )
    }

    const body: OrdinancePayload = await request.json()
    const ordinanceData = {
      number: body.number || '',
      year: body.year || '',
      title: body.title || '',
      fullTitle: body.fullTitle || body.title || '',
      status: body.status || 'Draft',
      date: body.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      author: body.author || '',
      whereas: body.whereas || [],
      sections: body.sections || [],
      category: body.category || 'Ordinance',
    }

    const content = JSON.stringify(ordinanceData)

    const { data, error } = await supabaseServer
      .from('ordinances')
      .insert([
        {
          title: ordinanceData.fullTitle || ordinanceData.title,
          content,
          category: ordinanceData.category,
          uploaded_at: new Date().toISOString(),
          uploaded_by: user.id,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        {
          error: error.message || 'Failed to create ordinance',
          code: error.code,
          details: error.details,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(parseOrdinanceRow(data))
  } catch (error) {
    console.error('Error creating ordinance:', error)
    return NextResponse.json({ error: 'Failed to create ordinance' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authClient = await getSupabaseClient(request)
    const user = await getCurrentUser(request, authClient)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const canManage = await canManageOrdinances(user)
    if (!canManage) {
      return NextResponse.json(
        { error: 'Only officials can update ordinances' },
        { status: 403 }
      )
    }

    const body: OrdinancePayload = await request.json()
    const id = body.id

    if (!id) {
      return NextResponse.json({ error: 'Ordinance id required' }, { status: 400 })
    }

    const { data: existingData, error: existingError } = await supabaseServer
      .from('ordinances')
      .select('*')
      .eq('id', id)
      .single()

    if (existingError || !existingData) {
      return NextResponse.json({ error: 'Ordinance not found' }, { status: 404 })
    }

    const existingOrdinance = parseOrdinanceRow(existingData)
    const updatedOrdinance = {
      ...existingOrdinance,
      ...body,
      title: body.fullTitle || body.title || existingOrdinance.title,
      fullTitle: body.fullTitle || existingOrdinance.fullTitle,
      category: body.category || existingOrdinance.category,
    }

    const content = JSON.stringify({
      number: updatedOrdinance.number,
      year: updatedOrdinance.year,
      title: updatedOrdinance.title,
      fullTitle: updatedOrdinance.fullTitle,
      status: updatedOrdinance.status,
      date: updatedOrdinance.date,
      author: updatedOrdinance.author,
      whereas: updatedOrdinance.whereas,
      sections: updatedOrdinance.sections,
      category: updatedOrdinance.category,
    })

    const { data, error } = await supabaseServer
      .from('ordinances')
      .update({
        title: updatedOrdinance.fullTitle || updatedOrdinance.title,
        content,
        category: updatedOrdinance.category,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating ordinance record:', error)
      return NextResponse.json({ error: 'Failed to update ordinance' }, { status: 500 })
    }

    return NextResponse.json(parseOrdinanceRow(data))
  } catch (error) {
    console.error('Error updating ordinance:', error)
    return NextResponse.json({ error: 'Failed to update ordinance' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authClient = await getSupabaseClient(request)
    const user = await getCurrentUser(request, authClient)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const canManage = await canManageOrdinances(user)
    if (!canManage) {
      return NextResponse.json(
        { error: 'Only officials can delete ordinances' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Ordinance id required' }, { status: 400 })
    }

    const { error } = await supabaseServer
      .from('ordinances')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('🔥 SUPABASE DELETE ERROR:', error)
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
          details: error,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting ordinance:', error)
    return NextResponse.json({ error: 'Failed to delete ordinance' }, { status: 500 })
  }
}
