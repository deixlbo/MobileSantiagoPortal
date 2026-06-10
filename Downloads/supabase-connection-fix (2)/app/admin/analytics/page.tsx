'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, TrendingUp, FileText, Clock, CheckCircle } from 'lucide-react';

interface Analytics {
  documentRequests: {
    total: number;
    approved: number;
    pending: number;
    declined: number;
  };
  complaints: {
    total: number;
    open: number;
    resolved: number;
  };
  appointments: {
    total: number;
    confirmed: number;
    pending: number;
  };
  period: {
    days: number;
    startDate: string;
    endDate: string;
  };
}

interface Predictions {
  expectedDocumentRequests: number;
  expectedComplaints: number;
  expectedAppointments: number;
  resolutionTimeAverage: string;
  busyDays: string[];
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [predictions, setPredictions] = useState<Predictions | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/analytics?days=${days}`);
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data.success) {
          setAnalytics(data.analytics);
          setPredictions(data.predictions);
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [days]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-700" />
      </div>
    );
  }

  if (!analytics || !predictions) {
    return (
      <div className="p-8 text-center text-slate-600">
        Unable to load analytics data
      </div>
    );
  }

  const documentData = [
    { name: 'Approved', value: analytics.documentRequests.approved },
    { name: 'Pending', value: analytics.documentRequests.pending },
    { name: 'Declined', value: analytics.documentRequests.declined },
  ];

  const complaintData = [
    { name: 'Open', value: analytics.complaints.open },
    { name: 'Resolved', value: analytics.complaints.resolved },
  ];

  const appointmentData = [
    { name: 'Confirmed', value: analytics.appointments.confirmed },
    { name: 'Pending', value: analytics.appointments.pending },
  ];

  const trendsData = [
    {
      name: 'Documents',
      actual: analytics.documentRequests.total,
      predicted: predictions.expectedDocumentRequests,
    },
    {
      name: 'Complaints',
      actual: analytics.complaints.total,
      predicted: predictions.expectedComplaints,
    },
    {
      name: 'Appointments',
      actual: analytics.appointments.total,
      predicted: predictions.expectedAppointments,
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-950">Analytics Dashboard</h1>
        <select
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value))}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Document Requests</CardTitle>
            <FileText className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-950">{analytics.documentRequests.total}</div>
            <p className="text-xs text-slate-600">
              {analytics.documentRequests.approved} approved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Complaints</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-950">{analytics.complaints.total}</div>
            <p className="text-xs text-slate-600">
              {analytics.complaints.resolved} resolved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <Clock className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-950">{analytics.appointments.total}</div>
            <p className="text-xs text-slate-600">
              {analytics.appointments.confirmed} confirmed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
            <CheckCircle className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-950">{predictions.resolutionTimeAverage}</div>
            <p className="text-xs text-slate-600">
              for complaints
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Document Requests Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={documentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Complaint Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={complaintData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#0891b2" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Predicted vs Actual Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="actual" stroke="#16a34a" name="Actual" strokeWidth={2} />
                <Line type="monotone" dataKey="predicted" stroke="#f59e0b" name="Predicted" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Predictions */}
      <Card>
        <CardHeader>
          <CardTitle>AI Predictions for Next 7 Days</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-sm font-medium text-slate-600">Expected Document Requests</p>
              <p className="mt-2 text-2xl font-bold text-slate-950">{predictions.expectedDocumentRequests}</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-sm font-medium text-slate-600">Expected Complaints</p>
              <p className="mt-2 text-2xl font-bold text-slate-950">{predictions.expectedComplaints}</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-sm font-medium text-slate-600">Expected Appointments</p>
              <p className="mt-2 text-2xl font-bold text-slate-950">{predictions.expectedAppointments}</p>
            </div>
          </div>
          <div className="mt-4 rounded-lg bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-900">Busiest Days Predicted</p>
            <div className="mt-2 flex gap-2">
              {predictions.busyDays.map((day) => (
                <span key={day} className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                  {day}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
