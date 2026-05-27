import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Simulated SMS/Email service (use Twilio/SendGrid in production)
async function sendSMS(phone: string, message: string) {
  // TODO: Integrate with Twilio
  console.log(`[SMS to ${phone}]: ${message}`);
  return true;
}

async function sendEmail(email: string, subject: string, body: string) {
  // TODO: Integrate with SendGrid
  console.log(`[Email to ${email}]: ${subject} - ${body}`);
  return true;
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
    const { userId, type, recipient, subject, message, triggeredBy, relatedId } = body;

    // Get user preferences
    const { data: preferences } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Log notification
    const { data: log, error: logError } = await supabase
      .from('notification_logs')
      .insert([
        {
          user_id: userId,
          notification_type: type,
          recipient,
          subject,
          body: message,
          status: 'sent',
          triggered_by: triggeredBy,
          related_id: relatedId,
        },
      ])
      .select()
      .single();

    if (logError) throw logError;

    // Send notification if enabled
    let sent = false;
    if (type === 'sms' && preferences?.notify_sms) {
      sent = await sendSMS(recipient, message);
    } else if (type === 'email' && preferences?.notify_email) {
      sent = await sendEmail(recipient, subject!, message);
    }

    // Update status
    if (sent) {
      await supabase
        .from('notification_logs')
        .update({ status: 'delivered' })
        .eq('id', log.id);
    }

    return NextResponse.json({ success: sent, log });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

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
    const userId = searchParams.get('userId');

    const { data: logs, error } = await supabase
      .from('notification_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
