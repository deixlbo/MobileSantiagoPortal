'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, AlertCircle, Wand2 } from 'lucide-react';
import { getErrorMessage } from '@/lib/utils';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ValidationResult {
  status: 'valid' | 'invalid' | string;
  missingInfo?: string[];
  issues?: string[];
  recommendations?: string[];
  raw?: string;
}

export default function DocumentValidation() {
  const [documentType, setDocumentType] = useState('certification');
  const [documentContent, setDocumentContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(
    null
  );

  const documentTypes = [
    { value: 'certification', label: 'Certification' },
    { value: 'permit', label: 'Permit' },
    { value: 'resolution', label: 'Resolution' },
    { value: 'ordinance', label: 'Ordinance' },
    { value: 'letter', label: 'Official Letter' },
  ];

  const handleValidate = async () => {
    if (!documentContent.trim()) {
      toast.error('Please enter document content to validate');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/documents/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType,
          documentContent,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Validation failed: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setValidationResult(data.validation);
        toast.success('Document validated');
      } else {
        toast.error(String(getErrorMessage(data.error, 'Validation failed')));
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to validate document');
    } finally {
      setLoading(false);
    }
  };

  const isValid = validationResult?.status === 'valid' || validationResult?.status?.includes('valid');

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Validation Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-emerald-700" />
              Validate Document
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <Label htmlFor="content">Document Content</Label>
              <Textarea
                id="content"
                placeholder="Paste your document content here..."
                value={documentContent}
                onChange={(e) => setDocumentContent(e.target.value)}
                className="min-h-64"
              />
            </div>

            <Button
              onClick={handleValidate}
              disabled={loading || !documentContent.trim()}
              className="w-full bg-emerald-700 hover:bg-emerald-800"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Validate Document
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Validation Results */}
        {validationResult && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Validation Results</CardTitle>
              {isValid ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <AlertCircle className="h-6 w-6 text-red-600" />
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status */}
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-sm font-medium text-slate-900">
                  Status:{' '}
                  <span
                    className={
                      isValid ? 'text-green-600 font-bold' : 'text-red-600 font-bold'
                    }
                  >
                    {String(validationResult.status).toUpperCase()}
                  </span>
                </p>
              </div>

              {/* Missing Info */}
              {validationResult.missingInfo && validationResult.missingInfo.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-slate-900 mb-2">
                    Missing Information:
                  </p>
                  <ul className="space-y-1 text-sm text-slate-700">
                    {validationResult.missingInfo.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-red-600 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Issues */}
              {validationResult.issues && validationResult.issues.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-slate-900 mb-2">Issues Found:</p>
                  <ul className="space-y-1 text-sm text-slate-700">
                    {validationResult.issues.map((issue, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-orange-600 mt-1">•</span>
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {validationResult.recommendations && validationResult.recommendations.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-slate-900 mb-2">
                    Recommendations:
                  </p>
                  <ul className="space-y-1 text-sm text-slate-700">
                    {validationResult.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-600 mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Raw Output */}
              {validationResult.raw && (
                <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded overflow-auto max-h-32">
                  {validationResult.raw}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
