import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { residentId, title, description, category, priority } = await request.json();

    if (!residentId || !title || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('complaints')
      .insert({
        resident_id: residentId,
        title,
        description,
        category: category || 'general',
        priority: priority || 'normal',
        status: 'open',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      complaint: data,
    });
  } catch (error: any) {
    console.error('[Complaints API Error]', error);
    return NextResponse.json(
      { error: 'Failed to create complaint' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const residentId = searchParams.get('residentId');
    const status = searchParams.get('status');

    let query = supabase.from('complaints').select('*');

    if (residentId) {
      query = query.eq('resident_id', residentId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      complaints: data,
    });
  } catch (error: any) {
    console.error('[Complaints GET Error]', error);
    return NextResponse.json(
      { error: 'Failed to fetch complaints' },
      { status: 500 }
    );
  }
}
