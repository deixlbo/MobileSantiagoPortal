import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

function parseDate(value?: string) {
  if (!value) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

function mapBlotterResponse(record: any) {
  if (!record) return record

  const createdByProfile = record.created_by && typeof record.created_by === 'object'
    ? {
        id: record.created_by.id,
        first_name: record.created_by.first_name,
        last_name: record.created_by.last_name,
        position: record.created_by.position,
        role: record.created_by.role,
      }
    : undefined

  return {
    ...record,
    residentId: record.resident_id ?? record.residentId,
    complainantAddress: record.complainant_address ?? record.complainantAddress,
    respondentAddress: record.respondent_address ?? record.respondentAddress,
    filedDate: record.filed_date ?? record.filedDate,
    investigationDate: record.investigation_date ?? record.investigationDate,
    mediationScheduledDate: record.mediation_scheduled_date ?? record.mediationScheduledDate,
    hearingDate: record.hearing_date ?? record.hearingDate,
    resolutionDate: record.resolution_date ?? record.resolutionDate,
    resolutionDocument: record.resolution_document ?? record.resolutionDocument,
    createdBy: createdByProfile?.id ?? record.created_by ?? record.createdBy,
    createdByProfile,
    updatedAt: record.updated_at ?? record.updatedAt,
    date: record.date ?? record.filed_date ?? record.filedDate,
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      residentId,
      type,
      description,
      location,
      complainant,
      respondent,
      filedDate,
      createdBy,
    } = body

    if (!type || !description || !complainant) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data: report, error } = await supabaseServer
      .from('blotters')
      .insert([
        {
          resident_id: residentId || null,
          type,
          description,
          location: location || null,
          complainant,
          respondent: respondent || null,
          filed_date: parseDate(filedDate) || new Date(),
          status: 'pending-review',
          created_by: createdBy || residentId || null,
        },
      ])
      .select('*, created_by(id, first_name, last_name, position, role)')
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      report: mapBlotterResponse(report),
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
      const { data: report, error } = await supabaseServer
        .from('blotters')
        .select('*, created_by(id, first_name, last_name, position, role)')
        .eq('id', reportId)
        .single()

      if (error) {
        return NextResponse.json(
          { error: error.message || 'Blotter report not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(mapBlotterResponse(report))
    }

    let query = supabaseServer.from('blotters').select('*, created_by(id, first_name, last_name, position, role)')

    if (residentId) {
      query = query.eq('resident_id', residentId)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data: allReports, error } = await query
    if (error) throw error
    return NextResponse.json(
      Array.isArray(allReports) ? allReports.map(mapBlotterResponse) : []
    )
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
    const {
      id,
      type,
      description,
      location,
      complainant,
      respondent,
      status,
      filedDate,
      investigationDate,
      mediationScheduledDate,
      hearingDate,
      actionTaken,
      resolution,
      resolutionDate,
    } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Blotter report id required' },
        { status: 400 }
      )
    }

    const updateBody: any = {}
    if (type !== undefined) updateBody.type = type
    if (description !== undefined) updateBody.description = description
    if (location !== undefined) updateBody.location = location
    if (complainant !== undefined) updateBody.complainant = complainant
    if (respondent !== undefined) updateBody.respondent = respondent
    if (status !== undefined) updateBody.status = status
    if (filedDate !== undefined) updateBody.filed_date = parseDate(filedDate)
    if (investigationDate !== undefined)
      updateBody.investigation_date = parseDate(investigationDate)
    if (mediationScheduledDate !== undefined)
      updateBody.mediation_scheduled_date = parseDate(mediationScheduledDate)
    if (hearingDate !== undefined)
      updateBody.hearing_date = parseDate(hearingDate)
    if (actionTaken !== undefined) updateBody.action_taken = actionTaken
    if (resolution !== undefined) updateBody.resolution = resolution
    if (resolutionDate !== undefined)
      updateBody.resolution_date = parseDate(resolutionDate)

    const { data: report, error } = await supabaseServer
      .from('blotters')
      .update(updateBody)
      .eq('id', id)
      .select('*, created_by(id, first_name, last_name, position, role)')
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message || 'Blotter report not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      report: mapBlotterResponse(report),
    })
  } catch (error) {
    console.error('Error updating blotter report:', error)
    return NextResponse.json(
      { error: 'Failed to update blotter report' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Blotter ID required' },
        { status: 400 }
      )
    }

    const { data: deletedRows, error } = await supabaseServer
      .from('blotters')
      .delete()
      .eq('id', id)
      .select()

    if (error) throw error
    if (!deletedRows || deletedRows.length === 0) {
      return NextResponse.json(
        { error: 'Blotter report not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Blotter deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting blotter report:', error)
    return NextResponse.json(
      { error: 'Failed to delete blotter report' },
      { status: 500 }
    )
  }
}
