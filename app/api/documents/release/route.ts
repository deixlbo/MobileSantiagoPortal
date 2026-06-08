import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { documentRequestId, releasedBy } = body

    if (!documentRequestId) {
      return NextResponse.json({ error: 'Missing documentRequestId' }, { status: 400 })
    }

    // fetch the existing request to get resident id
    const { data: existing, error: fetchErr } = await supabaseServer
      .from('document_requests')
      .select('id, resident_id, document_type, control_number')
      .eq('id', documentRequestId)
      .single()

    if (fetchErr || !existing) {
      console.error('Document request not found', fetchErr)
      return NextResponse.json({ error: 'Document request not found' }, { status: 404 })
    }

    const now = new Date().toISOString()

    const { error: updateErr } = await supabaseServer
      .from('document_requests')
      .update({ status: 'released', release_date: now, updated_at: now, approved_by: releasedBy || null })
      .eq('id', documentRequestId)

    if (updateErr) {
      console.error('Failed to update document request status:', updateErr)
      return NextResponse.json({ error: 'Failed to mark released' }, { status: 500 })
    }

    // insert notification for resident
    try {
      const notif = {
        user_id: existing.resident_id,
        title: 'Document released',
        message: `Your document request (${existing.control_number || existing.id}) has been released and is ready for pickup.`,
        type: 'approval',
        link: `/resident/documents/${documentRequestId}`,
        read: false,
        created_at: now,
      }

      await supabaseServer.from('notifications').insert([notif])
    } catch (err) {
      console.error('Failed to insert notification:', err)
    }

    // insert activity log
    try {
      const log = {
        user_id: releasedBy || null,
        action: 'release_document',
        target_type: 'document_request',
        target_id: documentRequestId,
        details: { document_type: existing.document_type, control_number: existing.control_number || null },
        created_at: now,
      }

      await supabaseServer.from('activity_logs').insert([log])
    } catch (err) {
      console.error('Failed to insert activity log:', err)
    }

    return NextResponse.json({ success: true, id: documentRequestId })
  } catch (error) {
    console.error('Error in release route:', error)
    return NextResponse.json({ error: 'Failed to release document' }, { status: 500 })
  }
}
