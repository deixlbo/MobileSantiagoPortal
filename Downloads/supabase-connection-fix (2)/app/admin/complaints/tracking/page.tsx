'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, Filter, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';

interface Complaint {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  residentName: string;
  residentEmail?: string;
  createdAt: string;
  updatedAt?: string;
}

export default function ComplaintTracking() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    priority: 'medium',
    residentName: '',
    residentEmail: '',
  });

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'services', label: 'Services' },
    { value: 'cleanliness', label: 'Cleanliness' },
    { value: 'safety', label: 'Safety' },
    { value: 'noise', label: 'Noise' },
    { value: 'other', label: 'Other' },
  ];

  const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ];

  const statuses = [
    { value: 'all', label: 'All' },
    { value: 'open', label: 'Open' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
  ];

  useEffect(() => {
    fetchComplaints();
  }, [filter]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      // Simulated data - in real app would fetch from API
      const mockComplaints: Complaint[] = [
        {
          id: '1',
          title: 'Pothole on Main Street',
          description: 'Large pothole near the market area needs repair',
          status: 'open',
          category: 'infrastructure',
          priority: 'high',
          residentName: 'Maria Santos',
          residentEmail: 'maria@example.com',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          title: 'Excessive Noise at Night',
          description: 'Construction noise continuing past 10 PM',
          status: 'in-progress',
          category: 'noise',
          priority: 'medium',
          residentName: 'Juan Dela Cruz',
          residentEmail: 'juan@example.com',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          title: 'Street Lighting Issue',
          description: 'Multiple street lamps not working on Rizal Street',
          status: 'resolved',
          category: 'safety',
          priority: 'high',
          residentName: 'Rosa Garcia',
          residentEmail: 'rosa@example.com',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];

      if (filter !== 'all') {
        const filtered = mockComplaints.filter((c) => c.status === filter);
        setComplaints(filtered);
      } else {
        setComplaints(mockComplaints);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComplaint = async () => {
    if (!formData.title || !formData.description || !formData.residentName) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      const newComplaint: Complaint = {
        id: `comp-${Date.now()}`,
        ...formData,
        status: 'open',
        createdAt: new Date().toISOString(),
      };

      setComplaints((prev) => [newComplaint, ...prev]);
      setFormData({
        title: '',
        description: '',
        category: 'general',
        priority: 'medium',
        residentName: '',
        residentEmail: '',
      });
      setShowForm(false);
      toast.success('Complaint submitted successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'resolved':
      case 'closed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-blue-100 text-blue-800';
      case 'closed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-50 border-red-200';
      case 'high':
        return 'bg-orange-50 border-orange-200';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200';
      case 'low':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-950">Complaint Tracking</h1>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-700 hover:bg-emerald-800"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Complaint
        </Button>
      </div>

      {/* New Complaint Form */}
      {showForm && (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardHeader>
            <CardTitle>File a New Complaint</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Resident Name *</Label>
                <Input
                  id="name"
                  placeholder="Full name"
                  value={formData.residentName}
                  onChange={(e) =>
                    setFormData({ ...formData, residentName: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email address"
                  value={formData.residentEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, residentEmail: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Complaint Title *</Label>
                <Input
                  id="title"
                  placeholder="Brief title of the complaint"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value as any })
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                >
                  {priorities.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Detailed description of the complaint..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="min-h-32"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSubmitComplaint}
                disabled={loading}
                className="flex-1 bg-emerald-700 hover:bg-emerald-800"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Complaint'
                )}
              </Button>
              <Button
                onClick={() => setShowForm(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4 text-slate-600" />
        {statuses.map((status) => (
          <Button
            key={status.value}
            variant={filter === status.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(status.value)}
            className={
              filter === status.value ? 'bg-emerald-700 text-white' : ''
            }
          >
            {status.label}
          </Button>
        ))}
      </div>

      {/* Complaints List */}
      {loading && !showForm ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-700" />
        </div>
      ) : complaints.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">No complaints found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {complaints.map((complaint) => (
            <Card
              key={complaint.id}
              className={`border ${getPriorityColor(complaint.priority)}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(complaint.status)}
                      <h3 className="font-semibold text-slate-950">
                        {complaint.title}
                      </h3>
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded ${getStatusColor(
                          complaint.status
                        )}`}
                      >
                        {complaint.status.replace(/-/g, ' ')}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 mb-2">
                      {complaint.description}
                    </p>

                    <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                      <span>Category: {complaint.category}</span>
                      <span>Priority: {complaint.priority.toUpperCase()}</span>
                      <span>By: {complaint.residentName}</span>
                      <span>
                        Filed:{' '}
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
