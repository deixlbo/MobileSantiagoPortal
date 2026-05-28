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
      // Get document status history
      const { data: history, error } = await supabase
        .from('document_status_history')
        .select(
          `
          *,
          changed_by(id, email)
        `
        )
        .eq('document_id', documentId)
        .order('created_at');

      if (error) throw error;

      return NextResponse.json(history);
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

    // Get document
    const { data: document } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();

    // Record status change
    const { data: history, error: historyError } = await supabase
      .from('document_status_history')
      .insert([
        {
          document_id: documentId,
          old_status: oldStatus,
          new_status: newStatus,
          changed_by: changedBy,
          reason,
        },
      ])
      .select()
      .single();

    if (historyError) throw historyError;

    // Update document status
    const { error: updateError } = await supabase
      .from('documents')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', documentId);

    if (updateError) throw updateError;

    // Send notification
    if (document) {
      const { data: resident } = await supabase
        .from('residents')
        .select('email, phone')
        .eq('id', document.resident_id)
        .single();

      if (resident?.email) {
        // Send email notification
        await supabase.from('notification_logs').insert([
          {
            user_id: document.resident_id,
            notification_type: 'email',
            recipient: resident.email,
            subject: `Document Status Updated: ${newStatus}`,
            body: `Your ${document.doc_type} request status has been updated to ${newStatus}.${reason ? ` Reason: ${reason}` : ''}`,
            status: 'sent',
            triggered_by: 'document_status_change',
            related_id: documentId,
          },
        ]);
      }
    }

    return NextResponse.json(history);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
