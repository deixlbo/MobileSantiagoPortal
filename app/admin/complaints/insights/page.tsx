'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Lightbulb, AlertCircle, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface ComplaintInsight {
  trend: string;
  commonIssues: string[];
  recommendations: string[];
  resolutionRate: number;
  averageResolutionTime: string;
}

export default function ComplaintsInsights() {
  const [insights, setInsights] = useState<ComplaintInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/complaints/insights');
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      
      if (data.success) {
        setInsights(data.insights);
      } else {
        setError(data.error || 'Failed to fetch insights');
        toast.error('Failed to load insights');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to fetch insights');
      toast.error('Failed to load insights');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-700" />
      </div>
    );
  }

  if (error || !insights) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-slate-600">
            <AlertCircle className="h-5 w-5" />
            <p>{error || 'Unable to load insights'}</p>
            <Button onClick={fetchInsights} variant="outline" size="sm">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Trend Summary */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-700" />
            Complaint Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base font-medium text-slate-950 mb-2">
            {insights.trend}
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-600">Resolution Rate</p>
              <p className="mt-2 text-3xl font-bold text-slate-950">
                {insights.resolutionRate}%
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-600">Avg Resolution Time</p>
              <p className="mt-2 text-3xl font-bold text-slate-950">
                {insights.averageResolutionTime}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Common Issues */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            Most Common Issues
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {insights.commonIssues.map((issue, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-lg border border-slate-200 p-3"
              >
                <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-orange-100">
                  <span className="text-xs font-bold text-orange-600">
                    {index + 1}
                  </span>
                </div>
                <p className="text-slate-700">{issue}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.recommendations.map((rec, index) => (
              <div
                key={index}
                className="rounded-lg border-l-4 border-emerald-700 bg-emerald-50 p-4"
              >
                <p className="text-sm font-medium text-emerald-900">
                  Recommendation {index + 1}
                </p>
                <p className="mt-1 text-sm text-emerald-800">{rec}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Refresh Button */}
      <Button
        onClick={fetchInsights}
        className="w-full bg-emerald-700 hover:bg-emerald-800"
      >
        Refresh Insights
      </Button>
    </div>
  );
}
