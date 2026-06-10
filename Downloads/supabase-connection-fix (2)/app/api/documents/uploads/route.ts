import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get('documentId')
    const residentId = searchParams.get('residentId')

    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      )
    }

    let query = supabase
      .from('document_uploads')
      .select('*')
      .eq('document_request_id', documentId)
      .order('uploaded_at', { ascending: false })

    if (residentId) {
      query = query.eq('uploaded_by', residentId)
    }

    const { data, error } = await query

    if (error) {
      console.error('[v0] Fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch uploads' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        uploads: data || [],
        count: (data || []).length,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
