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
      const { data, error } = await supabaseServer
        .from('document_requests')
        .select('id, resident_id, status, created_at')
        .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())

      if (error) {
        console.error('Error fetching document stats:', error)
        return NextResponse.json({ error: 'Failed to fetch document stats' }, { status: 500 })
      }

      return NextResponse.json({ success: true, count: data?.length ?? 0 })
    }

    if (requestId) {
      const { data: documentRequest, error } = await supabaseServer
        .from('document_requests')
        .select('*')
        .eq('id', requestId)
        .single()

      if (error) {
        return NextResponse.json({ error: error.message || 'Document not found' }, { status: 404 })
      }

      return NextResponse.json(documentRequest)
    }

    if (residentId) {
      const { data: residentDocuments, error } = await supabaseServer
        .from('document_requests')
        .select('*')
        .eq('resident_id', residentId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching resident document requests:', error)
        return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
      }

      return NextResponse.json(residentDocuments || [])
    }

    const { data: supabaseDocuments, error } = await supabaseServer
      .from('document_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching document requests:', error)
      return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
    }

    return NextResponse.json(supabaseDocuments || [])
  } catch (error) {
    console.error('Error fetching documents:', error)
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

    if (!residentId || !documentType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data: profile, error: profileError } = await supabaseServer
      .from('profiles')
      .select('verification_status')
      .eq('id', residentId)
      .single()

    if (profileError || !profile) {
      console.error('Error fetching resident verification status:', profileError)
      return NextResponse.json(
        { error: 'Unable to verify resident account' },
        { status: 500 }
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

    const controlNumber = `${documentType.substring(0, 2).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`

    const insertBody = {
      resident_id: residentId,
      document_type: documentType,
      status: 'pending',
      control_number: controlNumber,
      purpose: purpose || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data: inserted, error: insertError } = await supabaseServer
      .from('document_requests')
      .insert([insertBody])
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting document request:', insertError)
      return NextResponse.json({ error: 'Failed to create document request' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      documentRequest: inserted,
    })
  } catch (error) {
    console.error('Error creating document request:', error)
    return NextResponse.json(
      { error: 'Failed to create document request' },
      { status: 500 }
    )
  }
}
