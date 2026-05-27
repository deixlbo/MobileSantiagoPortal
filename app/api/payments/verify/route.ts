import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { method, referenceNumber, senderName, amount, documentReferenceId } = await request.json()

    // Validate required fields
    if (!method || !referenceNumber || !senderName || !amount || !documentReferenceId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate payment method
    if (!['gcash', 'maya', 'bank'].includes(method)) {
      return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 })
    }

    // Generate transaction ID
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    // TODO: Save payment record to database for verification
    // await db.payments.create({
    //   data: {
    //     transactionId,
    //     method,
    //     referenceNumber,
    //     senderName,
    //     amount,
    //     documentReferenceId,
    //     status: 'pending_verification',
    //     createdAt: new Date(),
    //   }
    // })

    // TODO: Notify staff for verification
    // await notifyStaff('new_payment', { transactionId, amount, method })

    return NextResponse.json({ 
      success: true, 
      transactionId,
      message: 'Payment submitted for verification'
    })
  } catch (error) {
    console.error('[API] Payment verify error:', error)
    return NextResponse.json({ error: 'Failed to process payment' }, { status: 500 })
  }
}
