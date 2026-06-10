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

    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

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
          date_of_birth: dateOfBirth ? new Date(dateOfBirth) : null,
          contact_number: contactNumber || '',
          verification_status: 'pending',
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      resident,
    })
  } catch (error) {
    console.error('Error creating resident:', error)
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
        return NextResponse.json(
          { error: error.message || 'Resident not found' },
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
        return NextResponse.json(null)
      }
      return NextResponse.json(resident)
    }

    let query = supabaseServer.from('profiles').select('*').eq('role', 'resident')
    if (status) {
      query = query.eq('verification_status', status)
    }

    const { data: allResidents, error } = await query
    if (error) throw error
    return NextResponse.json(allResidents)
  } catch (error) {
    console.error('Error fetching residents:', error)
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

    const updateBody: any = { ...updates }
    if (verificationStatus) {
      updateBody.verification_status = verificationStatus
    }

    const { data: resident, error } = await supabaseServer
      .from('profiles')
      .update(updateBody)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message || 'Resident not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      resident,
    })
  } catch (error) {
    console.error('Error updating resident:', error)
    return NextResponse.json(
      { error: 'Failed to update resident' },
      { status: 500 }
    )
  }
}
