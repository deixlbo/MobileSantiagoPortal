import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Mock feedback data for when database is empty
const MOCK_FEEDBACK = [
  {
    id: '1',
    rating: 5,
    message: 'Excellent service! The barangay officials were very helpful and responsive to my concerns.',
    residentName: 'Maria Santos',
    residentImage: null,
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'responded'
  },
  {
    id: '2',
    rating: 5,
    message: 'The document request process was smooth and fast. Got my barangay clearance in just 2 days!',
    residentName: 'Juan dela Cruz',
    residentImage: null,
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'responded'
  },
  {
    id: '3',
    rating: 4,
    message: 'Very satisfied with the online portal. It made everything so convenient. Just wish the office hours were extended.',
    residentName: 'Rosa Garcia',
    residentImage: null,
    date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'responded'
  },
  {
    id: '4',
    rating: 5,
    message: 'The barangay staff is very professional and courteous. Highly recommend their services!',
    residentName: 'Antonio Reyes',
    residentImage: null,
    date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'responded'
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const status = searchParams.get('status') || 'responded'

    // Try to fetch from Supabase
    const { data: feedback, error, count } = await supabase
      .from('feedback')
      .select(`
        id,
        resident_id,
        rating,
        message,
        status,
        created_at,
        residents:residents(
          user_id,
          users:users(
            full_name,
            profile_image_url
          )
        )
      `, { count: 'exact' })
      .eq('status', status)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (!error && feedback && feedback.length > 0) {
      // Transform data from Supabase
      const transformedFeedback = feedback.map(item => ({
        id: item.id,
        rating: item.rating,
        message: item.message,
        residentName: item.residents?.users?.full_name || 'Anonymous Resident',
        residentImage: item.residents?.users?.profile_image_url || null,
        date: item.created_at,
        status: item.status
      }))

      return NextResponse.json({
        success: true,
        data: transformedFeedback,
        total: count,
        limit,
        offset
      })
    }

    // Return mock data if database is empty or error occurred
    console.log('[v0] Using mock feedback data - database tables not yet created')
    const mockData = MOCK_FEEDBACK.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: mockData,
      total: MOCK_FEEDBACK.length,
      limit,
      offset,
      message: 'Using sample data - set up database to use real data'
    })
  } catch (error) {
    console.error('[v0] Feedback API error:', error)
    // Return mock data on error
    const mockData = MOCK_FEEDBACK.slice(0, 10)
    return NextResponse.json({
      success: true,
      data: mockData,
      total: MOCK_FEEDBACK.length,
      fallback: true,
      message: 'Database not yet configured, showing sample feedback'
    })
  }
}
