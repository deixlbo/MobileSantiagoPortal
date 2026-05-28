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

    const { data: qrData, error } = await supabase
      .from('qr_verifications')
      .select('*')
      .eq('document_id', documentId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return NextResponse.json(qrData || { verified: false });
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
    const { documentId, qrCode } = body;

    // Generate QR code data
    const verificationCode = `${documentId}-${Date.now()}`;
    const { data: qrData, error } = await supabase
      .from('qr_verifications')
      .insert([
        {
          document_id: documentId,
          qr_code: qrCode,
          verification_code: verificationCode,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(qrData, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
