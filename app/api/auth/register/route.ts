import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, userType, fullName, phone, address } = body;

    if (!email || !password || !userType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate user type
    if (!['admin', 'resident', 'official'].includes(userType)) {
      return NextResponse.json(
        { error: 'Invalid user type' },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdminClient();

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    // Create user record in database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        user_type: userType,
        status: userType === 'admin' ? 'pending' : 'pending',
        full_name: fullName || email,
      })
      .select()
      .single();

    if (userError) {
      // Rollback: delete auth user if user record creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: 'Failed to create user record' },
        { status: 500 }
      );
    }

    // If resident, create resident record
    if (userType === 'resident') {
      await supabase
        .from('residents')
        .insert({
          user_id: authData.user.id,
          address: address || '',
          phone: phone || '',
        });
    }

    return NextResponse.json({
      success: true,
      message: 'Registration successful. Please wait for admin approval.',
      user: {
        id: userData.id,
        email: userData.email,
        user_type: userData.user_type,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
