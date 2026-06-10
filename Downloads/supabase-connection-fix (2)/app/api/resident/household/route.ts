import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

async function getCurrentUser(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {},
      },
    }
  );

  const { data: sessionData } = await supabase.auth.getSession();
  let user = sessionData?.session?.user;

  if (!user) {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : null;
    if (token) {
      const { data: tokenData, error: tokenError } = await supabaseServer.auth.getUser(token);
      if (!tokenError) {
        user = tokenData?.user;
      }
    }
  }

  return user;
}

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get the resident's household (where they are head or member)
    let household = null;
    let members = [];

    // First, check if they're the head of a household
    let { data: headHousehold, error: headError } = await supabaseServer
      .from('households')
      .select('id, name, address')
      .eq('head_id', user.id)
      .maybeSingle();

    if (headError && headError.code !== 'PGRST116') {
      throw headError;
    }

    if (headHousehold) {
      household = headHousehold;
    } else {
      // Check if they're a member of a household
      const { data: memberRecord, error: memberError } = await supabaseServer
        .from('household_members')
        .select('household_id')
        .eq('member_id', user.id)
        .maybeSingle();

      if (memberError && memberError.code !== 'PGRST116') {
        throw memberError;
      }

      if (memberRecord) {
        const { data: memberHousehold, error: householdError } = await supabaseServer
          .from('households')
          .select('id, name, address')
          .eq('id', memberRecord.household_id)
          .single();

        if (householdError) throw householdError;
        household = memberHousehold;
      }
    }

    // Get all household members for this household
    if (household) {
      const { data: householdMembers, error: membersError } = await supabaseServer
        .from('household_members')
        .select('id, first_name, last_name, relationship, date_of_birth, gender, occupation')
        .eq('household_id', household.id)
        .order('created_at');

      if (membersError) throw membersError;
      members = householdMembers || [];
    }

    return NextResponse.json({
      household,
      members,
    });
  } catch (error) {
    console.error('Error fetching household:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
