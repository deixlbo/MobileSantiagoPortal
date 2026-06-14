import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase-server'

type BlotterRecord = {
  id: string
  type: string
  description: string
  location: string
  complainant: string
  complainantAddress?: string | null
  respondent?: string | null
  respondentAddress?: string | null
  residentId?: string | null
  status: string
  filedDate?: string | null
  investigationDate?: string | null
  mediationScheduledDate?: string | null
  hearingDate?: string | null
  actionTaken?: string | null
  resolution?: string | null
  resolutionDate?: string | null
  createdBy?: string | null
  createdAt?: string | null
}

const memoryBlotters: BlotterRecord[] = []

function createId() {
  return typeof globalThis.crypto?.randomUUID === 'function'
    ? globalThis.crypto.randomUUID()
    : `blt-${Date.now()}`
}

function toDateString(value?: string | null) {
  if (value) return value
  return new Date().toISOString().slice(0, 10)
}

function normalizeBlotter(row: any): BlotterRecord {
  return {
    id: row?.id ?? createId(),
    type: row?.type ?? row?.incident_type ?? row?.incidentType ?? 'Other',
    description: row?.description ?? row?.incident_description ?? row?.incidentDescription ?? row?.details ?? '',
    location: row?.location ?? row?.incident_location ?? row?.incidentLocation ?? row?.locationDetails ?? '',
    complainant: row?.complainant ?? row?.complainant_name ?? row?.complainantName ?? row?.reported_by ?? row?.reportedBy ?? '',
    complainantAddress: row?.complainant_address ?? row?.complainantAddress ?? null,
    respondent: row?.respondent ?? row?.respondent_name ?? row?.respondentName ?? row?.accused ?? null,
    respondentAddress: row?.respondent_address ?? row?.respondentAddress ?? null,
    residentId: row?.resident_id ?? row?.residentId ?? null,
    status: row?.status ?? 'pending-review',
    filedDate: row?.filed_date ?? row?.filedDate ?? row?.reported_date ?? row?.reportedDate ?? row?.incident_date ?? row?.incidentDate ?? toDateString(row?.filed_date),
    investigationDate: row?.investigation_date ?? row?.investigationDate ?? null,
    mediationScheduledDate: row?.mediation_scheduled_date ?? row?.mediationScheduledDate ?? null,
    hearingDate: row?.hearing_date ?? row?.hearingDate ?? null,
    actionTaken: row?.action_taken ?? row?.actionTaken ?? null,
    resolution: row?.resolution ?? null,
    resolutionDate: row?.resolution_date ?? row?.resolutionDate ?? null,
    createdBy: row?.created_by ?? row?.createdBy ?? null,
    createdAt: row?.created_at ?? row?.createdAt ?? null,
  }
}

async function readBlotters(residentId?: string | null) {
  try {
    const supabase = getSupabaseServer()
    if (supabase?.from) {
      let query = supabase.from('blotters').select('*')
      if (residentId) {
        query = query.eq('resident_id', residentId)
      }
      const { data, error } = await query.order('created_at', { ascending: false })
      if (!error && Array.isArray(data)) {
        return data.map(normalizeBlotter)
      }
    }
  } catch {
    // Fall back to in-memory storage
  }

  return memoryBlotters
    .filter((item) => !residentId || item.residentId === residentId)
    .slice()
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
}

async function createBlotter(payload: Record<string, any>) {
  const type = payload.type?.trim() || payload.incidentType?.trim() || payload.incident_type?.trim() || 'Other'
  const description = payload.description?.trim() || payload.incidentDescription?.trim() || payload.incident_description?.trim() || payload.details?.trim() || ''
  const location = payload.location || payload.incidentLocation || payload.incident_location || payload.locationDetails || ''
  const complainant = payload.complainant?.trim() || payload.complainantName?.trim() || payload.complainant_name?.trim() || payload.reportedBy?.trim() || payload.reported_by?.trim() || ''
  const respondent = payload.respondent?.trim() || payload.respondentName?.trim() || payload.respondent_name?.trim() || payload.accused?.trim() || ''

  const record = {
    id: createId(),
    type,
    description,
    location,
    complainant,
    respondent,
    resident_id: payload.residentId || payload.resident_id || null,
    complainant_address: payload.complainantAddress || payload.complainant_address || null,
    respondent_address: payload.respondentAddress || payload.respondent_address || null,
    status: payload.status || 'pending-review',
    filed_date: payload.filedDate || payload.filed_date || toDateString(payload.filedDate),
    action_taken: payload.actionTaken || payload.action_taken || null,
    resolution: payload.resolution || null,
    resolution_date: payload.resolutionDate || payload.resolution_date || null,
    investigation_date: payload.investigationDate || payload.investigation_date || null,
    mediation_scheduled_date: payload.mediationScheduledDate || payload.mediation_scheduled_date || null,
    hearing_date: payload.hearingDate || payload.hearing_date || null,
    created_by: payload.createdBy || payload.created_by || payload.residentId || payload.resident_id || null,
  }

  try {
    const supabase = getSupabaseServer()
    if (supabase?.from) {
      const { data, error } = await supabase.from('blotters').insert([record]).select().single()
      if (!error && data) {
        return normalizeBlotter(data)
      }
    }
  } catch {
    // Fall back to in-memory storage
  }

  const stored = normalizeBlotter(record)
  memoryBlotters.unshift(stored)
  return stored
}

async function updateBlotter(id: string, updates: Record<string, any>) {
  const current = await readBlotters()
  const existing = current.find((item) => item.id === id)
  if (!existing) {
    throw new Error('Blotter not found')
  }

  const next = {
    ...existing,
    ...updates,
    id: existing.id,
    residentId: updates.residentId ?? updates.resident_id ?? existing.residentId,
    complainant: updates.complainant ?? existing.complainant,
    respondent: updates.respondent ?? existing.respondent,
    type: updates.type ?? existing.type,
    description: updates.description ?? existing.description,
    location: updates.location ?? existing.location,
    status: updates.status ?? existing.status,
    filedDate: updates.filedDate ?? updates.filed_date ?? existing.filedDate,
    investigationDate: updates.investigationDate ?? updates.investigation_date ?? existing.investigationDate,
    mediationScheduledDate: updates.mediationScheduledDate ?? updates.mediation_scheduled_date ?? existing.mediationScheduledDate,
    hearingDate: updates.hearingDate ?? updates.hearing_date ?? existing.hearingDate,
    actionTaken: updates.actionTaken ?? updates.action_taken ?? existing.actionTaken,
    resolution: updates.resolution ?? existing.resolution,
    resolutionDate: updates.resolutionDate ?? updates.resolution_date ?? existing.resolutionDate,
  }

  try {
    const supabase = getSupabaseServer()
    if (supabase?.from) {
      const { data, error } = await supabase
        .from('blotters')
        .update({
          type: next.type,
          description: next.description,
          location: next.location,
          complainant: next.complainant,
          respondent: next.respondent,
          resident_id: next.residentId,
          status: next.status,
          filed_date: next.filedDate,
          investigation_date: next.investigationDate,
          mediation_scheduled_date: next.mediationScheduledDate,
          hearing_date: next.hearingDate,
          action_taken: next.actionTaken,
          resolution: next.resolution,
          resolution_date: next.resolutionDate,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (!error && data) {
        return normalizeBlotter(data)
      }
    }
  } catch {
    // Fall back to in-memory storage
  }

  const index = memoryBlotters.findIndex((item) => item.id === id)
  if (index >= 0) {
    memoryBlotters[index] = next
  } else {
    memoryBlotters.unshift(next)
  }

  return next
}

async function deleteBlotter(id: string) {
  try {
    const supabase = getSupabaseServer()
    if (supabase?.from) {
      const { error } = await supabase.from('blotters').delete().eq('id', id)
      if (!error) {
        return true
      }
    }
  } catch {
    // Fall back to in-memory storage
  }

  const index = memoryBlotters.findIndex((item) => item.id === id)
  if (index >= 0) {
    memoryBlotters.splice(index, 1)
  }
  return true
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const residentId = searchParams.get('residentId')
    const blotters = await readBlotters(residentId)
    return NextResponse.json(blotters)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch blotters' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const type = payload.type?.trim()
    const description = payload.description?.trim()
    const complainant = payload.complainant?.trim()

    if (!type || !description || !complainant) {
      return NextResponse.json({ error: 'Type, description, and complainant are required' }, { status: 400 })
    }

    const report = await createBlotter(payload)
    return NextResponse.json({ success: true, report, blotter: report }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create blotter' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const payload = await request.json()
    if (!payload.id) {
      return NextResponse.json({ error: 'Blotter id is required' }, { status: 400 })
    }

    const blotter = await updateBlotter(payload.id, payload)
    return NextResponse.json({ success: true, blotter })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update blotter' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Blotter id is required' }, { status: 400 })
    }

    await deleteBlotter(id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete blotter' }, { status: 500 })
  }
}