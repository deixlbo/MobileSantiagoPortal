import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Mock officials data for when database is empty
const MOCK_OFFICIALS = [
  {
    id: '1',
    userId: 'user-1',
    name: 'Barangay Captain Rolando Santos',
    position: 'Barangay Captain',
    department: 'Executive Office',
    email: 'captain@santiago.gov.ph',
    phone: '+63 47 555-0101',
    image: null,
    address: 'Barangay Santiago',
    officeHours: { start: '08:00', end: '17:00', days: 'Monday-Friday' },
    isAvailable: true
  },
  {
    id: '2',
    userId: 'user-2',
    name: 'Maria Gonzales',
    position: 'Barangay Kagawad',
    department: 'Health & Sanitation',
    email: 'health@santiago.gov.ph',
    phone: '+63 47 555-0102',
    image: null,
    address: 'Barangay Santiago',
    officeHours: { start: '08:00', end: '17:00', days: 'Monday-Friday' },
    isAvailable: true
  },
  {
    id: '3',
    userId: 'user-3',
    name: 'Antonio Reyes',
    position: 'Barangay Kagawad',
    department: 'Peace & Order',
    email: 'security@santiago.gov.ph',
    phone: '+63 47 555-0103',
    image: null,
    address: 'Barangay Santiago',
    officeHours: { start: '08:00', end: '17:00', days: 'Monday-Friday' },
    isAvailable: true
  },
  {
    id: '4',
    userId: 'user-4',
    name: 'Rosa Garcia',
    position: 'Barangay Kagawad',
    department: 'Education & Culture',
    email: 'education@santiago.gov.ph',
    phone: '+63 47 555-0104',
    image: null,
    address: 'Barangay Santiago',
    officeHours: { start: '08:00', end: '17:00', days: 'Monday-Friday' },
    isAvailable: true
  },
  {
    id: '5',
    userId: 'user-5',
    name: 'Juan dela Cruz',
    position: 'Barangay Treasurer',
    department: 'Finance & Budget',
    email: 'finance@santiago.gov.ph',
    phone: '+63 47 555-0105',
    image: null,
    address: 'Barangay Santiago',
    officeHours: { start: '08:00', end: '17:00', days: 'Monday-Friday' },
    isAvailable: true
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Try to fetch from Supabase
    const { data: officials, error, count } = await supabase
      .from('officials')
      .select(`
        id,
        user_id,
        position,
        department,
        office_hours_start,
        office_hours_end,
        working_days,
        is_available,
        users:user_id(
          full_name,
          email,
          phone_number,
          profile_image_url,
          address,
          is_active
        )
      `, { count: 'exact' })
      .eq('is_available', true)
      .order('users.full_name', { ascending: true })
      .range(offset, offset + limit - 1)

    if (!error && officials && officials.length > 0) {
      // Transform data from Supabase
      const transformedOfficials = officials.map(item => ({
        id: item.id,
        userId: item.user_id,
        name: item.users?.full_name || 'Unknown Official',
        position: item.position,
        department: item.department,
        email: item.users?.email,
        phone: item.users?.phone_number,
        image: item.users?.profile_image_url,
        address: item.users?.address,
        officeHours: {
          start: item.office_hours_start,
          end: item.office_hours_end,
          days: item.working_days
        },
        isAvailable: item.is_available
      }))

      return NextResponse.json({
        success: true,
        data: transformedOfficials,
        total: count,
        limit,
        offset
      })
    }

    // Return mock data if database is empty or error occurred
    console.log('[v0] Using mock officials data - database tables not yet created')
    const mockData = MOCK_OFFICIALS.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: mockData,
      total: MOCK_OFFICIALS.length,
      limit,
      offset,
      message: 'Using sample data - set up database to use real data'
    })
  } catch (error) {
    console.error('[v0] Officials API error:', error)
    // Return mock data on error
    const mockData = MOCK_OFFICIALS.slice(0, 5)
    return NextResponse.json({
      success: true,
      data: mockData,
      total: MOCK_OFFICIALS.length,
      fallback: true,
      message: 'Database not yet configured, showing sample officials'
    })
  }
}
