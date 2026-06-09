import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      email,
      firstName,
      middleName,
      lastName,
      suffix,
      civilStatus,
      purok,
      gender,
      occupation,
      contactNumber,
      address,
      dateOfBirth,
      idType,
      idPath,
    } = body

    // Validate required fields
    if (!userId || !email || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, email, firstName, lastName' },
        { status: 400 }
      )
    }

    console.log('[v0] Creating resident profile for user:', userId)

    const supabaseServer = getSupabaseServer()
    if (!supabaseServer) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const now = new Date().toISOString()

    // Insert profile into database using service role (bypasses RLS)
    const { data: profile, error: profileError } = await supabaseServer
      .from('profiles')
      .insert([
        {
          id: userId,
          email,
          role: 'resident',
          first_name: firstName,
          middle_name: middleName || null,
          last_name: lastName,
          suffix: suffix || null,
          civil_status: civilStatus || null,
          purok: purok || null,
          gender: gender || null,
          occupation: occupation || null,
          contact_number: contactNumber || null,
          address: address || null,
          date_of_birth: dateOfBirth || null,
          verification_status: 'pending',
          id_type: idType || null,
          id_path: idPath || null,
          created_at: now,
          updated_at: now,
        },
      ])
      .select()
      .single()

    if (profileError) {
      console.error('[v0] Profile creation error:', profileError.message)
      return NextResponse.json(
        { error: `Failed to create profile: ${profileError.message}` },
        { status: 500 }
      )
    }

    console.log('[v0] Resident profile created successfully:', userId)
    return NextResponse.json({ success: true, profile }, { status: 201 })
  } catch (error) {
    console.error('[v0] Register Resident Exception:', error)
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to create resident account' },
      { status: 500 }
    )
  }
}
