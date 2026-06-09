'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Wand2, Megaphone, Copy, Check } from 'lucide-react';
import { getErrorMessage } from '@/lib/utils';
import { toast } from 'sonner';

interface Announcement {
  title: string;
  content: string;
  generatedAt: string;
}

export default function AnnouncementGenerator() {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('formal');
  const [targetAudience, setTargetAudience] = useState('all');
  const [loading, setLoading] = useState(false);
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic) {
      toast.error('Please enter announcement topic');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          tone,
          targetAudience,
          userId: 'system', // Would come from auth in real app
        }),
      });

      const data = await response.json();
      if (data.success && data.announcement) {
        setAnnouncement({
          title: data.announcement.title,
          content: data.announcement.content,
          generatedAt: new Date().toLocaleString(),
        });
        toast.success('Announcement generated successfully!');
      } else {
        toast.error(String(getErrorMessage(data.error, 'Failed to generate announcement')));
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate announcement');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (announcement) {
      navigator.clipboard.writeText(`${announcement.title}\n\n${announcement.content}`);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePublish = async () => {
    if (!announcement) return;

    try {
      setLoading(true);
      const response = await fetch('/api/announcements', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'published',
        }),
      });

      if (response.ok) {
        toast.success('Announcement published!');
        setAnnouncement(null);
        setTopic('');
      } else {
        toast.error('Failed to publish announcement');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to publish announcement');
    } finally {
      setLoading(false);
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
              Generate Announcement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Announcement Topic</Label>
              <Input
                id="topic"
                placeholder="e.g., Community Cleanup Drive"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <select
                id="tone"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                <option value="formal">Formal</option>
                <option value="friendly">Friendly</option>
                <option value="urgent">Urgent</option>
                <option value="informative">Informative</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience">Target Audience</Label>
              <select
                id="audience"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                <option value="all">All Residents</option>
                <option value="businesses">Business Owners</option>
                <option value="students">Students</option>
                <option value="seniors">Seniors</option>
                <option value="families">Families</option>
              </select>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading || !topic}
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
                  Generate Announcement
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Announcement Preview */}
        {announcement && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-emerald-700" />
                Preview
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
                  Generated at {announcement.generatedAt}
                </p>
                <div className="rounded-lg bg-slate-50 p-4 max-h-96 overflow-y-auto">
                  <h3 className="font-semibold text-slate-950 mb-2">
                    {announcement.title}
                  </h3>
                  <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap">
                    {announcement.content}
                  </div>
                </div>
                <Button
                  onClick={handlePublish}
                  disabled={loading}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 mt-4"
                >
                  Publish Announcement
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
