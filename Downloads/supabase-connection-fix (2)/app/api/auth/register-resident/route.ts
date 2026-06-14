import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase-server'
import { persistProfileImageUpload } from '@/lib/profile-upload'

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''
    let body: Record<string, any> = {}
    let profileImageFile: File | null = null

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      profileImageFile = formData.get('profileImage') as File | null
      body = Object.fromEntries(formData.entries())
    } else {
      body = await request.json()
    }

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

    if (!userId || !email || !firstName || !lastName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    console.log('[v0] Creating resident profile for user:', userId)

    const supabaseServer = getSupabaseServer()
    if (!supabaseServer) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

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
        },
      ])
      .select()
      .single()

    if (profileError) {
      console.error('[v0] Profile creation error:', profileError)
      return NextResponse.json({ error: `Failed to create profile: ${profileError.message}` }, { status: 500 })
    }

    if (profileImageFile && profileImageFile.size > 0) {
      try {
        await persistProfileImageUpload({
          userId,
          file: profileImageFile,
        })
      } catch (photoError) {
        console.error('[v0] Profile photo upload error:', photoError)
      }
    }

    console.log('[v0] Resident profile created successfully:', userId)
    return NextResponse.json({ success: true, profile }, { status: 201 })
  } catch (error) {
    console.error('[v0] Error:', error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
