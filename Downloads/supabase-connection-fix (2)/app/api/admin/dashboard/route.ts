import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function GET() {
  try {
    const [residentsResult, householdsResult, pendingVerificationsResult, pendingDocumentsResult] = await Promise.all([
      supabaseServer
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'resident'),
      supabaseServer
        .from('households')
        .select('*', { count: 'exact', head: true }),
      supabaseServer
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'resident')
        .eq('verification_status', 'pending'),
      supabaseServer
        .from('document_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending'),
    ])

    return NextResponse.json({
      totalResidents: residentsResult.count ?? 0,
      totalHouseholds: householdsResult.count ?? 0,
      pendingVerifications: pendingVerificationsResult.count ?? 0,
      pendingDocuments: pendingDocumentsResult.count ?? 0,
    })
  } catch (error) {
    console.error('[admin dashboard] Failed to load stats:', error)
    return NextResponse.json(
      {
        totalResidents: 0,
        totalHouseholds: 0,
        pendingVerifications: 0,
        pendingDocuments: 0,
      },
      { status: 500 }
    )
  }
}
