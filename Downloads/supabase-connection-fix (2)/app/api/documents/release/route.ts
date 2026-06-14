import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

async function getBearerToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization')
  return authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader
}

async function getCurrentUser(request: NextRequest) {
  const token = await getBearerToken(request)
  if (!token) return null

  const { data: userData, error } = await supabaseServer.auth.getUser(token)
  if (error || !userData?.user) return null

  return userData.user
}

async function isOfficial(userId: string): Promise<boolean> {
  const { data: profile } = await supabaseServer
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()

  return profile?.role === 'official'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { documentRequestId, releasedBy } = body

    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isOfficialUser = await isOfficial(user.id)
    if (!isOfficialUser) {
      return NextResponse.json({ error: 'Only officials can release document requests' }, { status: 403 })
    }

    if (!documentRequestId) {
      return NextResponse.json({ error: 'Missing documentRequestId' }, { status: 400 })
    }
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


    return NextResponse.json({ success: true, id: documentRequestId })
  } catch (error) {
    console.error('Error in release route:', error)
    return NextResponse.json({ error: 'Failed to release document' }, { status: 500 })
  }
}
