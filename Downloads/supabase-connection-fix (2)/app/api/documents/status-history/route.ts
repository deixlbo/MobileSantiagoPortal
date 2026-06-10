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
    const documentId = searchParams.get('documentId');

    if (documentId) {
      // Get current document request status
      const { data: history, error } = await supabase
        .from('document_requests')
        .select('id, document_type, status, updated_at')
        .eq('id', documentId)
        .single();

      if (error) throw error;

      return NextResponse.json([
        {
          document_id: history.id,
          document_type: history.document_type,
          status: history.status,
          updated_at: history.updated_at,
          note: 'Status history is not available for this schema; showing current status only.'
        }
      ]);
    }

    throw new Error('documentId is required');
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
    const { documentId, oldStatus, newStatus, changedBy, reason } = body;

    // Get document request
    const { data: document, error: documentError } = await supabase
      .from('document_requests')
      .select('*')
      .eq('id', documentId)
      .single();

    if (documentError) throw documentError;

    // Update document request status
    const { data: updated, error: updateError } = await supabase
      .from('document_requests')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', documentId)
      .select()
      .single();

    if (updateError) throw updateError;

    if (updated) {
      await supabase.from('notifications').insert([
        {
          user_id: document.resident_id,
          title: `Document request status updated`,
          message: `Your ${document.document_type || 'document'} request status has been updated to ${newStatus}.${reason ? ` Reason: ${reason}` : ''}`,
          type: 'general',
          link: null,
          read: false,
          created_at: new Date().toISOString()
        }
      ]);
    }

    return NextResponse.json({ success: true, document: updated });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
