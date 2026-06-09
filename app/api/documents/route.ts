import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const requestId = searchParams.get('id')
    const residentId = searchParams.get('residentId')

    if (action === 'stats') {
      const days = parseInt(searchParams.get('days') || '30')
      const fromDate = new Date()
      fromDate.setDate(fromDate.getDate() - days)

      const { data, error } = await supabaseServer
        .from('document_requests')
        .select('id, resident_id, status, created_at')
        .gte('created_at', fromDate.toISOString())

      if (error) {
        console.error('[Documents Stats Error]', error.message)
        return NextResponse.json({ error: 'Failed to fetch document stats' }, { status: 500 })
      }

      return NextResponse.json({ success: true, count: data?.length ?? 0 })
    }

    // Optimize query with proper filtering
    let query = supabaseServer
      .from('document_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (requestId) {
      query = query.eq('id', requestId)
    } else if (residentId) {
      query = query.eq('resident_id', residentId)
    }

    const { data: supabaseDocuments, error } = await query

    if (error) {
      console.error('[Documents GET Error]', error.message)
      return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
    }

    if (!supabaseDocuments) {
      return NextResponse.json([], { status: 200 })
    }

    // If querying by requestId, return single result or 404
    if (requestId) {
      const doc = supabaseDocuments[0]
      if (!doc) {
        return NextResponse.json({ error: 'Document not found' }, { status: 404 })
      }
      return NextResponse.json(doc)
    }

    return NextResponse.json(supabaseDocuments)
  } catch (error) {
    console.error('[Documents GET Exception]', error)
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { residentId, documentType, purpose } = body

    // Validate required fields
    if (!residentId || !documentType) {
      return NextResponse.json(
        { error: 'Missing required fields: residentId, documentType' },
        { status: 400 }
      )
    }

    // Check resident verification status
    const { data: profile, error: profileError } = await supabaseServer
      .from('profiles')
      .select('verification_status')
      .eq('id', residentId)
      .single()

    if (profileError || !profile) {
      console.error('[Documents POST: Profile fetch error]', profileError)
      return NextResponse.json(
        { error: 'Unable to verify resident account' },
        { status: 404 }
      )
    }

    const verificationStatus = profile.verification_status

    if (verificationStatus !== 'verified') {
      return NextResponse.json(
        {
          error: 'Account verification required',
          message: verificationStatus === 'pending'
            ? 'Your account is pending verification. Document requests will be available once your account is verified.'
            : 'Your account verification was declined. Please contact barangay officials for more information.',
          verificationStatus,
        },
        { status: 403 }
      )
    }

    // Generate control number
    const controlNumber = `${documentType.substring(0, 2).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
    const now = new Date().toISOString()

    const insertBody = {
      resident_id: residentId,
      document_type: documentType,
      status: 'pending',
      control_number: controlNumber,
      purpose: purpose || '',
      created_at: now,
      updated_at: now,
    }

    const { data: inserted, error: insertError } = await supabaseServer
      .from('document_requests')
      .insert([insertBody])
      .select()
      .single()

    if (insertError) {
      console.error('[Documents POST Insert Error]', insertError.message)
      return NextResponse.json({ error: 'Failed to create document request' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      documentRequest: inserted,
    }, { status: 201 })
  } catch (error) {
    console.error('[Documents POST Exception]', error)
    return NextResponse.json(
      { error: 'Failed to create document request' },
      { status: 500 }
    )
  }
}
