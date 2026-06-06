import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { documentRequestId, action, reason, approvedBy } = body

    if (!documentRequestId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!['approve', 'decline'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "approve" or "decline"' },
        { status: 400 }
      )
    }

    const status = action === 'approve' ? 'approved' : 'declined'
    const now = new Date()

    const { data: updatedRequest, error } = await supabaseServer
      .from('document_requests')
      .update({
        status,
        approved_at: action === 'approve' ? now : null,
        approved_by: approvedBy || null,
        rejection_reason: action === 'decline' ? reason : null,
        updated_at: now,
      })
      .eq('id', documentRequestId)
      .select()
      .single()

    if (error) {
      console.error('Error updating document request:', error.message || error)
      return NextResponse.json(
        { error: error.message || 'Failed to update document request' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      documentRequest: updatedRequest,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error)
    console.error('Error processing approval:', errorMessage)
    return NextResponse.json(
      { error: 'Failed to process approval' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const documentRequestId = searchParams.get('documentRequestId')
    const status = searchParams.get('status')

    let query = supabaseServer.from('document_requests').select('*')

    if (documentRequestId) {
      query = query.eq('id', documentRequestId)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching document requests:', error.message || error)
      return NextResponse.json(
        { error: error.message || 'Failed to fetch document requests' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error)
    console.error('Error fetching approvals:', errorMessage)
    return NextResponse.json(
      { error: 'Failed to fetch approvals', details: errorMessage },
      { status: 500 }
    )
  }
}
