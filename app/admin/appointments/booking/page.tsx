'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Calendar, Clock, MapPin, CheckCircle, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Appointment {
  id: string;
  residentName: string;
  residentEmail?: string;
  purpose: string;
  appointmentDate: string;
  appointmentTime: string;
  location: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

export default function AppointmentBooking() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');

  const [formData, setFormData] = useState({
    residentName: '',
    residentEmail: '',
    purpose: 'document-request',
    appointmentDate: '',
    appointmentTime: '',
    location: 'office',
    notes: '',
  });

  const purposes = [
    { value: 'document-request', label: 'Document Request' },
    { value: 'complaint-filing', label: 'Complaint Filing' },
    { value: 'permit-application', label: 'Permit Application' },
    { value: 'consultation', label: 'Consultation' },
    { value: 'payment', label: 'Payment' },
    { value: 'other', label: 'Other' },
  ];

  const locations = [
    { value: 'office', label: 'Barangay Office' },
    { value: 'satellite', label: 'Satellite Office' },
    { value: 'online', label: 'Online' },
  ];

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      // Simulated data
      const mockAppointments: Appointment[] = [
        {
          id: '1',
          residentName: 'Maria Santos',
          residentEmail: 'maria@example.com',
          purpose: 'document-request',
          appointmentDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
          appointmentTime: '09:00',
          location: 'office',
          status: 'confirmed',
          notes: 'Birth certificate request',
        },
        {
          id: '2',
          residentName: 'Juan Dela Cruz',
          residentEmail: 'juan@example.com',
          purpose: 'complaint-filing',
          appointmentDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
          appointmentTime: '10:30',
          location: 'office',
          status: 'pending',
          notes: 'Road maintenance complaint',
        },
        {
          id: '3',
          residentName: 'Rosa Garcia',
          residentEmail: 'rosa@example.com',
          purpose: 'permit-application',
          appointmentDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
          appointmentTime: '14:00',
          location: 'office',
          status: 'completed',
          notes: 'Business permit application',
        },
      ];

      if (filter !== 'all') {
        const filtered = mockAppointments.filter((a) => a.status === filter);
        setAppointments(filtered);
      } else {
        setAppointments(mockAppointments);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async () => {
    if (!formData.residentName || !formData.appointmentDate || !formData.appointmentTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      const newAppointment: Appointment = {
        id: `apt-${Date.now()}`,
        ...formData,
        status: 'pending',
      };

      setAppointments((prev) => [newAppointment, ...prev]);
      setFormData({
        residentName: '',
        residentEmail: '',
        purpose: 'document-request',
        appointmentDate: '',
        appointmentTime: '',
        location: 'office',
        notes: '',
      });
      setShowForm(false);
      toast.success('Appointment booked successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const isDatePassed = (dateStr: string) => {
    return new Date(dateStr) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-950">Appointment Booking</h1>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-700 hover:bg-emerald-800"
        >
          <Plus className="mr-2 h-4 w-4" />
          Book Appointment
        </Button>
      </div>

      {/* Booking Form */}
      {showForm && (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardHeader>
            <CardTitle>Book New Appointment</CardTitle>
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
                <Label htmlFor="purpose">Purpose of Visit *</Label>
                <select
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e) =>
                    setFormData({ ...formData, purpose: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                >
                  {purposes.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <select
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                >
                  {locations.map((loc) => (
                    <option key={loc.value} value={loc.value}>
                      {loc.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.appointmentDate}
                  onChange={(e) =>
                    setFormData({ ...formData, appointmentDate: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.appointmentTime}
                  onChange={(e) =>
                    setFormData({ ...formData, appointmentTime: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                placeholder="Additional notes..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 min-h-20"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleBookAppointment}
                disabled={loading}
                className="flex-1 bg-emerald-700 hover:bg-emerald-800"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Booking...
                  </>
                ) : (
                  'Book Appointment'
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
      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(status)}
            className={
              filter === status ? 'bg-emerald-700 text-white' : ''
            }
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>

      {/* Appointments List */}
      {loading && !showForm ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-700" />
        </div>
      ) : appointments.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">No appointments found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {appointments.map((apt) => (
            <Card key={apt.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle className="h-5 w-5 text-emerald-700" />
                      <h3 className="font-semibold text-slate-950">
                        {apt.residentName}
                      </h3>
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded ${getStatusColor(
                          apt.status
                        )}`}
                      >
                        {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 mb-3">
                      {purposes.find((p) => p.value === apt.purpose)?.label ||
                        apt.purpose}
                    </p>

                    <div className="flex flex-wrap gap-4 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(apt.appointmentDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {apt.appointmentTime}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {locations.find((l) => l.value === apt.location)
                          ?.label || apt.location}
                      </div>
                    </div>

                    {apt.notes && (
                      <p className="text-sm text-slate-500 mt-2">
                        Notes: {apt.notes}
                      </p>
                    )}
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
