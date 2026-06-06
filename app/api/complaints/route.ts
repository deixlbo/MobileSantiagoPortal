import { NextRequest, NextResponse } from 'next/server'
import { getMockComplaints, getMockComplaintStats } from '@/lib/mock-data'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get('action')
    const status = searchParams.get('status')
    const residentId = searchParams.get('residentId')

    if (action === 'stats') {
      const days = parseInt(searchParams.get('days') || '30')
      const stats = getMockComplaintStats(days)
      return NextResponse.json({ success: true, ...stats })
    }

    let complaints = getMockComplaints()

    if (status) {
      complaints = complaints.filter(c => c.status === status)
    }

    if (residentId) {
      complaints = complaints.filter(c => c.resident_id === residentId)
    }

    return NextResponse.json({ success: true, complaints })
  } catch (error: any) {
    console.error('[Complaints GET Error]', error)
    return NextResponse.json(
      { error: 'Failed to fetch complaints' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { residentId, title, description, category, priority } = await request.json()

    if (!residentId || !title || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const newComplaint = {
      id: `complaint-${Date.now()}`,
      resident_id: residentId,
      title,
      description,
      category: category || 'general',
      priority: priority || 'normal',
      status: 'open',
      created_at: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      complaint: newComplaint,
    })
  } catch (error: any) {
    console.error('[Complaints API Error]', error)
    return NextResponse.json(
      { error: 'Failed to create complaint' },
      { status: 500 }
    )
  }
}
