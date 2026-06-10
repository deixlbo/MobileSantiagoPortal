import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import { getMockOrdinances } from '@/lib/mock-data'

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

function parseOrdinanceRow(row: any) {
  const base = {
    id: row.id,
    title: row.title || '',
    fullTitle: row.title || '',
    category: row.category || 'Ordinance',
    uploaded_at: row.uploaded_at,
    uploaded_by: row.uploaded_by,
  }

  if (!row.content) {
    return {
      ...base,
      number: '',
      year: '',
      status: 'Draft',
      date: '',
      author: '',
      whereas: [],
      sections: [],
    }
  }

  if (typeof row.content === 'string') {
    try {
      const content = JSON.parse(row.content)
      return {
        ...base,
        ...content,
        title: content.title || base.title,
        fullTitle: content.fullTitle || content.title || base.fullTitle,
        category: row.category || content.category || base.category,
      }
    } catch {
      return {
        ...base,
        number: '',
        year: '',
        status: 'Draft',
        date: row.uploaded_at ? new Date(row.uploaded_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '',
        author: '',
        whereas: [],
        sections: [{ title: 'Content', content: row.content }],
      }
    }
  }

  return {
    ...base,
    ...row.content,
    title: row.content.title || base.title,
    fullTitle: row.content.fullTitle || row.content.title || base.fullTitle,
    category: row.category || row.content.category || base.category,
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
      const { data, error } = await supabaseServer
        .from('ordinances')
        .select('*')
        .order('uploaded_at', { ascending: false })

      if (error) {
        console.warn('[Ordinances GET] Supabase fetch failed, falling back to mock ordinances', error)
        ordinances = getMockOrdinances()
      } else {
        ordinances = (data || []).map(parseOrdinanceRow)
      }
    } catch (supabaseError) {
      console.warn('[Ordinances GET] Supabase unavailable, using mock ordinances', supabaseError)
      ordinances = getMockOrdinances()
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
      filtered = filtered.filter((item) => String(item.status || '').toLowerCase() === 'published')
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
          uploaded_by: body.uploadedBy || null,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(parseOrdinanceRow(data))
  } catch (error) {
    console.error('Error creating ordinance:', error)
    return NextResponse.json({ error: 'Failed to create ordinance' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
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
      console.error('Error deleting ordinance:', error)
      return NextResponse.json({ error: 'Failed to delete ordinance' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting ordinance:', error)
    return NextResponse.json({ error: 'Failed to delete ordinance' }, { status: 500 })
  }
}
