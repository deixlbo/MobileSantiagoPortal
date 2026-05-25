import { NextRequest, NextResponse } from 'next/server'
import { BlotterReport } from '@/lib/database'

// In-memory storage for blotter reports
const blotterReports: Map<string, BlotterReport> = new Map()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      residentId,
      complainantName,
      respondentName,
      natureOfCase,
      dateOfIncident,
      notes,
      createdBy,
    } = body

    if (!residentId || !complainantName || !natureOfCase) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const report: BlotterReport = {
      id: `blotter-${Date.now()}`,
      residentId,
      complainantName,
      respondentName: respondentName || '',
      natureOfCase,
      dateOfIncident: new Date(dateOfIncident),
      status: 'pending',
      notes: notes || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: createdBy || residentId,
    }

    blotterReports.set(report.id, report)

    return NextResponse.json({
      success: true,
      report,
    })
  } catch (error) {
    console.error('Error creating blotter report:', error)
    return NextResponse.json(
      { error: 'Failed to create blotter report' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reportId = searchParams.get('id')
    const residentId = searchParams.get('residentId')
    const status = searchParams.get('status')

    if (reportId) {
      const report = blotterReports.get(reportId)
      if (!report) {
        return NextResponse.json(
          { error: 'Blotter report not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(report)
    }

    let allReports = Array.from(blotterReports.values())

    if (residentId) {
      allReports = allReports.filter((r) => r.residentId === residentId)
    }

    if (status) {
      allReports = allReports.filter((r) => r.status === status)
    }

    return NextResponse.json(allReports)
  } catch (error) {
    console.error('Error fetching blotter reports:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blotter reports' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, scheduledHearingDate, notes } = body

    const report = blotterReports.get(id)
    if (!report) {
      return NextResponse.json(
        { error: 'Blotter report not found' },
        { status: 404 }
      )
    }

    if (status) {
      report.status = status
    }
    if (scheduledHearingDate) {
      report.scheduledHearingDate = new Date(scheduledHearingDate)
    }
    if (notes !== undefined) {
      report.notes = notes
    }
    report.updatedAt = new Date()

    blotterReports.set(id, report)

    return NextResponse.json({
      success: true,
      report,
    })
  } catch (error) {
    console.error('Error updating blotter report:', error)
    return NextResponse.json(
      { error: 'Failed to update blotter report' },
      { status: 500 }
    )
  }
}
