import { NextRequest, NextResponse } from 'next/server'
import {
  getMockComplaintStats,
  getMockDocumentStats,
  getMockAppointmentStats,
} from '@/lib/mock-data'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const days = parseInt(searchParams.get('days') || '30')

    const complaintStats = getMockComplaintStats(days)
    const documentStats = getMockDocumentStats(days)
    const appointmentStats = getMockAppointmentStats(days)

    // Generate predictive analytics
    const avgComplaintsPerDay = Math.ceil(complaintStats.total / days)
    const avgDocumentsPerDay = Math.ceil(documentStats.total / days)
    const avgAppointmentsPerDay = Math.ceil(appointmentStats.total / days)

    const predictions = {
      nextWeek: {
        complaints: avgComplaintsPerDay * 7,
        documents: avgDocumentsPerDay * 7,
        appointments: avgAppointmentsPerDay * 7,
      },
      busyDays: ['Monday', 'Wednesday', 'Friday'],
      trends: {
        complaints: 'increasing',
        documents: 'stable',
        appointments: 'increasing',
      },
    }

    return NextResponse.json({
      success: true,
      analytics: {
        period: `Last ${days} days`,
        complaints: complaintStats,
        documents: documentStats,
        appointments: appointmentStats,
        predictions,
      },
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
