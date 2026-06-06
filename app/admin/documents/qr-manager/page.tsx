'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, QrCode, Download, Trash2, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface QRCode {
  id: string;
  code: string;
  documentRequestId: string;
  documentType: string;
  residentName: string;
  status: 'active' | 'used' | 'expired';
  expiryDate: string;
  qrCodeDataUrl?: string;
}

export default function QRCodeManager() {
  const [qrCodes, setQRCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [documentRequestId, setDocumentRequestId] = useState('');
  const [documentType, setDocumentType] = useState('birth-certificate');
  const [residentName, setResidentName] = useState('');
  const [controlNumber, setControlNumber] = useState('');

  const documentTypes = [
    { value: 'birth-certificate', label: 'Birth Certificate' },
    { value: 'death-certificate', label: 'Death Certificate' },
    { value: 'marriage-certificate', label: 'Marriage Certificate' },
    { value: 'barangay-clearance', label: 'Barangay Clearance' },
    { value: 'business-permit', label: 'Business Permit' },
    { value: 'residency-certificate', label: 'Residency Certificate' },
  ];

  const handleGenerateQR = async () => {
    if (!documentRequestId || !residentName || !documentType) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/qr/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentRequestId,
          documentType,
          residentName,
          controlNumber: controlNumber || `CTRL-${Date.now()}`,
        }),
      });

      const data = await response.json();
      if (data.success) {
        const newQR: QRCode = {
          id: data.code,
          code: data.code,
          documentRequestId,
          documentType,
          residentName,
          status: 'active',
          expiryDate: data.expiryDate,
          qrCodeDataUrl: data.qrCode,
        };
        setQRCodes((prev) => [newQR, ...prev]);
        toast.success('QR code generated successfully!');
        setDocumentRequestId('');
        setResidentName('');
        setControlNumber('');
      } else {
        toast.error(data.error || 'Failed to generate QR code');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadQR = (qr: QRCode) => {
    if (!qr.qrCodeDataUrl) return;

    const link = document.createElement('a');
    link.href = qr.qrCodeDataUrl;
    link.download = `QR-${qr.code}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR code downloaded!');
  };

  const handleDeleteQR = async (id: string) => {
    try {
      setQRCodes((prev) => prev.filter((qr) => qr.id !== id));
      toast.success('QR code deleted');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to delete QR code');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'used':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Generator Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-emerald-700" />
            Generate QR Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="req-id">Document Request ID</Label>
              <Input
                id="req-id"
                placeholder="e.g., DOC-2024-001"
                value={documentRequestId}
                onChange={(e) => setDocumentRequestId(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resident">Resident Name</Label>
              <Input
                id="resident"
                placeholder="e.g., Juan Dela Cruz"
                value={residentName}
                onChange={(e) => setResidentName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="doc-type">Document Type</Label>
              <select
                id="doc-type"
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                {documentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="control">Control Number (Optional)</Label>
              <Input
                id="control"
                placeholder="e.g., CTRL-20240115-001"
                value={controlNumber}
                onChange={(e) => setControlNumber(e.target.value)}
              />
            </div>
          </div>

          <Button
            onClick={handleGenerateQR}
            disabled={loading}
            className="w-full bg-emerald-700 hover:bg-emerald-800"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <QrCode className="mr-2 h-4 w-4" />
                Generate QR Code
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* QR Codes List */}
      {qrCodes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated QR Codes ({qrCodes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {qrCodes.map((qr) => (
                <div
                  key={qr.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">
                        {qr.residentName}
                      </h3>
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded ${getStatusBadge(
                          qr.status
                        )}`}
                      >
                        {qr.status.charAt(0).toUpperCase() + qr.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">
                      {qr.documentType.replace(/-/g, ' ')} • {qr.code}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Expires: {new Date(qr.expiryDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {qr.qrCodeDataUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadQR(qr)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteQR(qr.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {qrCodes.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <QrCode className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">No QR codes generated yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
