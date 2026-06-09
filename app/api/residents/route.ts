import { NextRequest, NextResponse } from 'next/server'
import { Resident } from '@/lib/database'
import { supabaseServer } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      email,
      firstName,
      lastName,
      purok,
      gender,
      address,
      dateOfBirth,
      contactNumber,
    } = body

    // Validate required fields
    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields: email, firstName, lastName' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const now = new Date().toISOString()

    const { data: resident, error } = await supabaseServer
      .from('profiles')
      .insert([
        {
          email,
          role: 'resident',
          first_name: firstName,
          last_name: lastName,
          purok: purok || 'Unknown',
          gender: gender || 'other',
          address: address || '',
          date_of_birth: dateOfBirth ? new Date(dateOfBirth).toISOString() : null,
          contact_number: contactNumber || '',
          verification_status: 'pending',
          created_at: now,
          updated_at: now,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('[Residents POST Error]', error.message)
      return NextResponse.json(
        { error: 'Failed to create resident: ' + error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      resident,
    }, { status: 201 })
  } catch (error) {
    console.error('[Residents POST Exception]', error)
    return NextResponse.json(
      { error: 'Failed to create resident' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const residentId = searchParams.get('id')
    const email = searchParams.get('email')
    const status = searchParams.get('status')

    if (residentId) {
      const { data: resident, error } = await supabaseServer
        .from('profiles')
        .select('*')
        .eq('id', residentId)
        .single()

      if (error) {
        console.error('[Residents GET by ID Error]', error.message)
        return NextResponse.json(
          { error: 'Resident not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(resident)
    }

    if (email) {
      const { data: resident, error } = await supabaseServer
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single()

      if (error) {
        // Not found is expected for email queries
        return NextResponse.json(null, { status: 200 })
      }
      return NextResponse.json(resident)
    }

    // Fetch all residents, optionally filtered by status
    let query = supabaseServer.from('profiles').select('*').eq('role', 'resident')
    if (status) {
      query = query.eq('verification_status', status)
    }

    const { data: allResidents, error } = await query.order('created_at', { ascending: false })
    
    if (error) {
      console.error('[Residents GET All Error]', error.message)
      return NextResponse.json(
        { error: 'Failed to fetch residents' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(allResidents || [])
  } catch (error) {
    console.error('[Residents GET Exception]', error)
    return NextResponse.json(
      { error: 'Failed to fetch residents' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, verificationStatus, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Resident ID is required' },
        { status: 400 }
      )
    }

    const updateBody: any = { ...updates }
    if (verificationStatus) {
      updateBody.verification_status = verificationStatus
    }
    updateBody.updated_at = new Date().toISOString()

    const { data: resident, error } = await supabaseServer
      .from('profiles')
      .update(updateBody)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[Residents PUT Error]', error.message)
      return NextResponse.json(
        { error: 'Resident not found or update failed' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      resident,
    })
  } catch (error) {
    console.error('[Residents PUT Exception]', error)
    return NextResponse.json(
      { error: 'Failed to update resident' },
      { status: 500 }
    )
  }
}
