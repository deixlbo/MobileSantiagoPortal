'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Wand2, FileText, Copy, Check } from 'lucide-react';
import { getErrorMessage } from '@/lib/utils';
import { toast } from 'sonner';

interface GeneratedDocument {
  title: string;
  content: string;
  generatedAt: string;
}

export default function AIDocumentGenerator() {
  const [documentType, setDocumentType] = useState('');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState<GeneratedDocument | null>(null);
  const [copied, setCopied] = useState(false);

  const documentTypes = [
    { value: 'permit', label: 'Permit Document' },
    { value: 'certification', label: 'Certification' },
    { value: 'letter', label: 'Official Letter' },
    { value: 'resolution', label: 'Resolution' },
    { value: 'ordinance', label: 'Ordinance' },
  ];

  const handleGenerate = async () => {
    if (!documentType || !topic) {
      toast.error('Please select document type and enter topic');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/documents/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType,
          topic,
          format: 'markdown',
        }),
      });

      const data = await response.json();
      if (data.success && data.document) {
        setGeneratedDoc({
          title: data.document.title,
          content: data.document.content,
          generatedAt: new Date().toLocaleString(),
        });
        toast.success('Document generated successfully!');
      } else {
        toast.error(String(getErrorMessage(data.error, 'Failed to generate document')));
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate document');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (generatedDoc) {
      navigator.clipboard.writeText(generatedDoc.content);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Generator Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-emerald-700" />
              AI Document Generator
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
                <option value="">Select a document type...</option>
                {documentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">Topic / Subject</Label>
              <Input
                id="topic"
                placeholder="e.g., Road Maintenance Program"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading || !documentType || !topic}
              className="w-full bg-emerald-700 hover:bg-emerald-800"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Document
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Document Preview */}
        {generatedDoc && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-700" />
                Generated Document
              </CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-xs text-slate-500">
                  Generated at {generatedDoc.generatedAt}
                </p>
                <div className="rounded-lg bg-slate-50 p-4 max-h-96 overflow-y-auto">
                  <h3 className="font-semibold text-slate-950 mb-2">
                    {generatedDoc.title}
                  </h3>
                  <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap">
                    {generatedDoc.content}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
