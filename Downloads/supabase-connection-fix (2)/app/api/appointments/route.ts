import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  try {
    const { searchParams } = new URL(req.url);
    const residentId = searchParams.get('residentId');
    const status = searchParams.get('status');

    let query = supabase.from('appointments').select('*');

    if (residentId) {
      query = query.eq('resident_id', residentId);
    }
    if (status) {
      query = query.eq('status', status);
    }

    const { data: appointments, error } = await query.order('scheduled_at');

    if (error) throw error;

    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  try {
    const body = await req.json();
    const { residentId, scheduledAt, durationMinutes, purpose, notes } = body;

    // Check for conflicts
    const { data: conflicts } = await supabase
      .from('appointments')
      .select('id')
      .eq('status', 'confirmed')
      .gte('scheduled_at', scheduledAt)
      .lt('scheduled_at', new Date(new Date(scheduledAt).getTime() + durationMinutes * 60000).toISOString());

    if (conflicts && conflicts.length > 0) {
      return NextResponse.json(
        { error: 'Time slot is already booked' },
        { status: 400 }
      );
    }

    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert([
        {
          resident_id: residentId,
          scheduled_at: scheduledAt,
          duration_minutes: durationMinutes,
          purpose,
          notes,
          status: 'confirmed',
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Send reminder notification
    await supabase.from('notifications').insert([
      {
        user_id: residentId,
        title: 'Appointment Confirmed',
        message: `Your appointment has been scheduled for ${new Date(scheduledAt).toLocaleDateString()}. Purpose: ${purpose}`,
        type: 'general',
        link: null,
        read: false,
        created_at: new Date().toISOString()
      },
    ]);

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  try {
    const body = await req.json();
    const { appointmentId, status } = body;

    const { data: appointment, error } = await supabase
      .from('appointments')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', appointmentId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(appointment);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
