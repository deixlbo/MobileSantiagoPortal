import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { endpoint } = await request.json()

    if (!endpoint) {
      return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 })
    }

    // TODO: Remove subscription from database
    // await db.pushSubscriptions.delete({
    //   where: { endpoint }
    // })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API] Push unsubscribe error:', error)
    return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 })
  }
}
