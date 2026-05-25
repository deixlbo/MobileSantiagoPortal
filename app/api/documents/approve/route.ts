import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for approvals
const documentApprovals: Map<string, any> = new Map()

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

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "approve" or "reject"' },
        { status: 400 }
      )
    }

    const approval = {
      id: `approval-${Date.now()}`,
      documentRequestId,
      action,
      reason: reason || null,
      approvedBy,
      createdAt: new Date(),
      status: action === 'approve' ? 'approved' : 'rejected',
    }

    documentApprovals.set(approval.id, approval)

    return NextResponse.json({
      success: true,
      approval,
    })
  } catch (error) {
    console.error('Error processing approval:', error)
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

    if (documentRequestId) {
      const approvals = Array.from(documentApprovals.values()).filter(
        (approval) => approval.documentRequestId === documentRequestId
      )
      return NextResponse.json(approvals)
    }

    const allApprovals = Array.from(documentApprovals.values())
    return NextResponse.json(allApprovals)
  } catch (error) {
    console.error('Error fetching approvals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch approvals' },
      { status: 500 }
    )
  }
}
