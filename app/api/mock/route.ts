import { NextResponse } from 'next/server'
import { getMockComplaints, getMockDocuments } from '../../../lib/mock-data'

export async function GET() {
  return NextResponse.json({
    complaints: getMockComplaints(),
    documents: getMockDocuments(),
  })
}
