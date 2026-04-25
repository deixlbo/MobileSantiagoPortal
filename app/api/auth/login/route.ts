import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, userType } = body;

    if (!email || !password || !userType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = createSupabaseClient();

    // Sign in with Supabase auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    // Verify user type from database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, user_type, status')
      .eq('id', data.user.id)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (userData.user_type !== userType) {
      return NextResponse.json(
        { error: 'Invalid user type' },
        { status: 403 }
      );
    }

    if (userData.status !== 'active') {
      return NextResponse.json(
        { error: `Account is ${userData.status}` },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      session: data.session,
      user: {
        id: data.user.id,
        email: data.user.email,
        user_type: userData.user_type,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
