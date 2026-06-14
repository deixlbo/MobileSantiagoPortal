import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ error: 'Feedback API removed' }, { status: 410 })
}
