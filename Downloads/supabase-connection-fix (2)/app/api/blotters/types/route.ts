import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase-server'

type BlotterTypeRecord = {
  id: string
  name: string
  description?: string | null
  is_active: boolean
}

const memoryBlotterTypes: BlotterTypeRecord[] = [
  { id: 'default-type', name: 'Other', description: 'General incident', is_active: true },
]

function createId() {
  return typeof globalThis.crypto?.randomUUID === 'function'
    ? globalThis.crypto.randomUUID()
    : `type-${Date.now()}`
}

function normalizeType(row: any): BlotterTypeRecord {
  return {
    id: row?.id ?? createId(),
    name: row?.name ?? 'Other',
    description: row?.description ?? null,
    is_active: row?.is_active ?? true,
  }
}

async function readTypes(active?: string | null) {
  try {
    const supabase = getSupabaseServer()
    if (supabase?.from) {
      let query = supabase.from('blotter_types').select('*')
      if (active === 'true') {
        query = query.eq('is_active', true)
      } else if (active === 'false') {
        query = query.eq('is_active', false)
      } else if (active === 'all') {
        query = query.order('name', { ascending: true })
      }

      const { data, error } = await query.order('name', { ascending: true })
      if (!error && Array.isArray(data)) {
        const mapped = data.map(normalizeType)
        if (mapped.length > 0) {
          return mapped
        }
      }
    }
  } catch {
    // Fall back to in-memory storage
  }

  let types = memoryBlotterTypes.slice()
  if (active === 'true') {
    types = types.filter((item) => item.is_active)
  }

  return types
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const active = searchParams.get('active')
  const types = await readTypes(active)
  return NextResponse.json(types)
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const name = payload.name?.trim()
    if (!name) {
      return NextResponse.json({ error: 'Type name is required' }, { status: 400 })
    }

    const typeRecord = normalizeType({
      id: createId(),
      name,
      description: payload.description ?? null,
      is_active: payload.is_active ?? true,
    })

    try {
      const supabase = getSupabaseServer()
      if (supabase?.from) {
        const { data, error } = await supabase.from('blotter_types').insert([{
          id: typeRecord.id,
          name: typeRecord.name,
          description: typeRecord.description,
          is_active: typeRecord.is_active,
        }]).select().single()

        if (!error && data) {
          return NextResponse.json(normalizeType(data), { status: 201 })
        }
      }
    } catch {
      // Fall back to in-memory storage
    }

    memoryBlotterTypes.unshift(typeRecord)
    return NextResponse.json(typeRecord, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create blotter type' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const payload = await request.json()
    if (!payload.id) {
      return NextResponse.json({ error: 'Type id is required' }, { status: 400 })
    }

    const index = memoryBlotterTypes.findIndex((item) => item.id === payload.id)
    if (index < 0) {
      return NextResponse.json({ error: 'Blotter type not found' }, { status: 404 })
    }

    const nextType = normalizeType({
      ...memoryBlotterTypes[index],
      ...payload,
      id: payload.id,
      name: payload.name?.trim() || memoryBlotterTypes[index].name,
      description: payload.description ?? memoryBlotterTypes[index].description,
      is_active: payload.is_active ?? memoryBlotterTypes[index].is_active,
    })

    try {
      const supabase = getSupabaseServer()
      if (supabase?.from) {
        const { data, error } = await supabase
          .from('blotter_types')
          .update({
            name: nextType.name,
            description: nextType.description,
            is_active: nextType.is_active,
          })
          .eq('id', payload.id)
          .select()
          .single()

        if (!error && data) {
          return NextResponse.json(normalizeType(data))
        }
      }
    } catch {
      // Fall back to in-memory storage
    }

    memoryBlotterTypes[index] = nextType
    return NextResponse.json(nextType)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update blotter type' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Type id is required' }, { status: 400 })
    }

    try {
      const supabase = getSupabaseServer()
      if (supabase?.from) {
        const { error } = await supabase.from('blotter_types').delete().eq('id', id)
        if (!error) {
          return NextResponse.json({ success: true })
        }
      }
    } catch {
      // Fall back to in-memory storage
    }

    const index = memoryBlotterTypes.findIndex((item) => item.id === id)
    if (index >= 0) {
      memoryBlotterTypes.splice(index, 1)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete blotter type' }, { status: 500 })
  }
}
