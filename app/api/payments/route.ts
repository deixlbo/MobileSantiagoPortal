import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Stripe (in production)
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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

    const { data: payments, error } = await supabase
      .from('payments')
      .select(
        `
        *,
        document(id, doc_type, status)
      `
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(payments);
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
    const { documentId, userId, amount, paymentMethod } = body;

    // Create payment record
    const { data: payment, error } = await supabase
      .from('payments')
      .insert([
        {
          document_id: documentId,
          user_id: userId,
          amount,
          payment_method: paymentMethod,
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // TODO: Initialize payment with Stripe/GCash/PayMaya based on paymentMethod
    // For now, simulate payment session

    return NextResponse.json({
      payment,
      paymentUrl: `/payment/session/${payment.id}`,
      message: 'Payment initiated. Redirect to payment gateway.',
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
