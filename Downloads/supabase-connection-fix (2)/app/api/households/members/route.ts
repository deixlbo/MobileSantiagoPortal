import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

async function getCookieSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
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
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { householdId, residentId, relationship } = body;

    if (!householdId || !residentId) {
      return NextResponse.json(
        { error: 'householdId and residentId are required' },
        { status: 400 }
      );
    }

    // Get resident profile to get name
    const { data: resident, error: residentError } = await supabaseServer
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', residentId)
      .single();

    if (residentError) throw residentError;

    // Add to household_members table
    const { data: member, error: insertError } = await supabaseServer
      .from('household_members')
      .insert([
        {
          household_id: householdId,
          member_id: residentId,
          first_name: resident.first_name,
          last_name: resident.last_name,
          relationship: relationship || 'Family Member',
        },
      ])
      .select()
      .single();

    if (insertError) throw insertError;

    // Update household member count
    const { data: members } = await supabaseServer
      .from('household_members')
      .select('id')
      .eq('household_id', householdId);

    if (members) {
      await supabaseServer
        .from('households')
        .update({ member_count: members.length })
        .eq('id', householdId);
    }

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error('Error adding household member:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { householdId, residentId } = body;

    if (!householdId || !residentId) {
      return NextResponse.json(
        { error: 'householdId and residentId are required' },
        { status: 400 }
      );
    }

    // Remove from household_members table
    const { error: deleteError } = await supabaseServer
      .from('household_members')
      .delete()
      .eq('household_id', householdId)
      .eq('member_id', residentId);

    if (deleteError) throw deleteError;

    // Update household member count
    const { data: members } = await supabaseServer
      .from('household_members')
      .select('id')
      .eq('household_id', householdId);

    if (members) {
      await supabaseServer
        .from('households')
        .update({ member_count: members.length })
        .eq('id', householdId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing household member:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
