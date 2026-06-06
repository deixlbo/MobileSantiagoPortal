import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

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
    const { householdId, residentId } = body;

    // Add resident to household
    const { data: updated, error: updateError } = await supabase
      .from('profiles')
      .update({ household_id: householdId })
      .eq('id', residentId)
      .select();

    if (updateError) throw updateError;

    // Update household member count
    const { data: members } = await supabase
      .from('profiles')
      .select('id')
      .eq('household_id', householdId);

    if (members) {
      await supabase
        .from('households')
        .update({ total_members: members.length })
        .eq('id', householdId);
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
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
    const { householdId, residentId } = body;

    // Remove resident from household
    const { data: updated, error: updateError } = await supabase
      .from('profiles')
      .update({ household_id: null })
      .eq('id', residentId)
      .select();

    if (updateError) throw updateError;

    // Update household member count
    const { data: members } = await supabase
      .from('profiles')
      .select('id')
      .eq('household_id', householdId);

    if (members) {
      await supabase
        .from('households')
        .update({ total_members: members.length })
        .eq('id', householdId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
