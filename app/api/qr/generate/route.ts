import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const { documentRequestId, documentType, residentName, controlNumber } = await request.json();

    if (!documentRequestId || !documentType || !residentName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate unique QR code data
    const qrCode = uuidv4();
    const qrData = {
      documentRequestId,
      documentType,
      residentName,
      controlNumber,
      generatedAt: new Date().toISOString(),
      code: qrCode,
    };

    // Generate QR code image
    const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
      width: 300,
      margin: 2,
      errorCorrectionLevel: 'H',
    });

    // Store QR code in database
    const { data, error } = await supabase
      .from('qr_codes')
      .insert({
        document_request_id: documentRequestId,
        code: qrCode,
        qr_data: qrData,
        status: 'active',
        expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      qrCode: qrCodeDataUrl,
      code: qrCode,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
  } catch (error: any) {
    console.error('[QR Generation Error]', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}
