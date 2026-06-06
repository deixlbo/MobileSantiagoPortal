import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get('days') || '30');
    const metricType = searchParams.get('type') || 'all';

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Fetch document request trends
    const { data: documentTrends } = await supabase
      .from('document_requests')
      .select('created_at, status')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    // Fetch complaint trends
    const { data: complaintTrends } = await supabase
      .from('complaints')
      .select('created_at, status')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    // Fetch appointment trends
    const { data: appointmentTrends } = await supabase
      .from('appointments')
      .select('created_at, status')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    // Process data for analytics
    const analytics = {
      documentRequests: {
        total: documentTrends?.length || 0,
        approved: documentTrends?.filter((d: any) => d.status === 'approved').length || 0,
        pending: documentTrends?.filter((d: any) => d.status === 'pending').length || 0,
        declined: documentTrends?.filter((d: any) => d.status === 'declined').length || 0,
      },
      complaints: {
        total: complaintTrends?.length || 0,
        open: complaintTrends?.filter((c: any) => c.status === 'open').length || 0,
        resolved: complaintTrends?.filter((c: any) => c.status === 'resolved').length || 0,
      },
      appointments: {
        total: appointmentTrends?.length || 0,
        confirmed: appointmentTrends?.filter((a: any) => a.status === 'confirmed').length || 0,
        pending: appointmentTrends?.filter((a: any) => a.status === 'pending').length || 0,
      },
      period: {
        days,
        startDate: startDate.toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
      },
    };

    // Simple predictions based on trends
    const predictions = {
      expectedDocumentRequests: Math.round((analytics.documentRequests.total / days) * 7),
      expectedComplaints: Math.round((analytics.complaints.total / days) * 7),
      expectedAppointments: Math.round((analytics.appointments.total / days) * 7),
      resolutionTimeAverage: '3-5 days',
      busyDays: ['Monday', 'Tuesday'],
    };

    return NextResponse.json({
      success: true,
      analytics,
      predictions,
    });
  } catch (error: any) {
    console.error('[Analytics API Error]', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
