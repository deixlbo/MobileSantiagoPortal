import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { qrCode } = await request.json();

    if (!qrCode) {
      return NextResponse.json(
        { error: 'QR code is required' },
        { status: 400 }
      );
    }

    // Find QR code in database
    const { data: qrData, error: qrError } = await supabase
      .from('qr_codes')
      .select('*, document_requests(*)')
      .eq('code', qrCode)
      .single();

    if (qrError || !qrData) {
      return NextResponse.json(
        { error: 'Invalid or expired QR code' },
        { status: 404 }
      );
    }

    // Check if expired
    if (qrData.expiry_date && new Date(qrData.expiry_date) < new Date()) {
      return NextResponse.json(
        { error: 'QR code has expired' },
        { status: 401 }
      );
    }

    // Check if revoked
    if (qrData.status === 'revoked') {
      return NextResponse.json(
        { error: 'QR code has been revoked' },
        { status: 403 }
      );
    }

    // Update scan count and last scanned
    const { error: updateError } = await supabase
      .from('qr_codes')
      .update({
        scan_count: (qrData.scan_count || 0) + 1,
        last_scanned: new Date().toISOString(),
      })
      .eq('id', qrData.id);

    if (updateError) throw updateError;

    return NextResponse.json({
      verified: true,
      documentData: qrData.qr_data,
      documentRequest: qrData.document_requests,
      status: qrData.status,
      scanCount: (qrData.scan_count || 0) + 1,
    });
  } catch (error: any) {
    console.error('[QR Verification Error]', error);
    return NextResponse.json(
      { error: 'Failed to verify QR code' },
      { status: 500 }
    );
  }
}
