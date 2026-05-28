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
    const householdId = searchParams.get('householdId');

    if (householdId) {
      // Get household with members
      const { data: household, error: householdError } = await supabase
        .from('households')
        .select('*')
        .eq('id', householdId)
        .single();

      if (householdError) throw householdError;

      const { data: members, error: membersError } = await supabase
        .from('residents')
        .select('*')
        .eq('household_id', householdId)
        .order('created_at');

      if (membersError) throw membersError;

      return NextResponse.json({ household, members });
    }

    // Get all households
    const { data: households, error } = await supabase
      .from('households')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(households);
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
    const { householdHeadId, address, purok } = body;

    const { data: household, error } = await supabase
      .from('households')
      .insert([
        {
          household_head_id: householdHeadId,
          address,
          purok,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(household, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
