import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

const FALLBACK_DOCUMENT_TYPES = [
  {
    id: 'fallback-clearance',
    name: 'Barangay Clearance',
    fee: '100.00',
    requirements: ['Valid ID', 'Letter of Intent'],
    is_active: true,
  },
  {
    id: 'fallback-residency',
    name: 'Certificate of Residency',
    fee: '50.00',
    requirements: ['Valid ID', 'Proof of residence'],
    is_active: true,
  },
  {
    id: 'fallback-indigency',
    name: 'Certificate of Indigency',
    fee: '50.00',
    requirements: ['Valid ID', 'Proof of low income'],
    is_active: true,
  },
]

function normalizeRequirements(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item ?? '').trim())
      .filter(Boolean)
      .map((item) => item.replace(/^['"\[\]\s]+|['"\[\]\s]+$/g, ''))
      .filter(Boolean)
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return []

    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed)
        return normalizeRequirements(parsed)
      } catch {
        // fall through to simple split
      }
    }

    return trimmed
      .split(/\r?\n|,|;/)
      .map((item) => item.replace(/^['"\[\]\s]+|['"\[\]\s]+$/g, '').trim())
      .filter(Boolean)
  }

  return []
}

function normalizeTypeEntry(type: any) {
  if (!type) return null

  const requirements = normalizeRequirements(type.requirements)

  return {
    id: type.id || type.name,
    name: type.name || 'Document Type',
    fee: type.fee ?? '0.00',
    requirements,
    is_active: type.is_active ?? true,
  }
}

function getFallbackDocumentTypes() {
  return FALLBACK_DOCUMENT_TYPES.map(normalizeTypeEntry).filter(Boolean)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('active') === 'true'

    const hasSupabaseConfig = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    if (!hasSupabaseConfig) {
      return NextResponse.json(getFallbackDocumentTypes())
    }

    let query = supabaseServer
      .from('document_types')
      .select('*')
      .order('created_at', { ascending: false })

    if (activeOnly) {
      query = query.eq('is_active', true)
    }

    const { data, error } = await query

    if (error || !Array.isArray(data) || data.length === 0) {
      console.warn('[documents/types] Falling back to seed document types', error)
      return NextResponse.json(getFallbackDocumentTypes())
    }

    const normalized = data.map(normalizeTypeEntry).filter(Boolean)
    return NextResponse.json(normalized.length > 0 ? normalized : getFallbackDocumentTypes())
  } catch (error) {
    console.error('[documents/types] Route error:', error)
    return NextResponse.json(getFallbackDocumentTypes())
  }
}
