'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { db } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Search, Check, X, Clock, Eye, Mail, Phone, MapPin } from 'lucide-react';

export default function AdminResidentManagement() {
  const { user } = useAuth();
  const router = useRouter();
  const [residents, setResidents] = useState<any[]>([]);
  const [filteredResidents, setFilteredResidents] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'active' | 'rejected'>('all');
  const [selectedResident, setSelectedResident] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    // Only admins can access this
    if (!user || user.role !== 'admin') {
      router.push('/admin/dashboard');
      return;
    }

    loadResidents();
  }, [user, router]);

  const loadResidents = async () => {
    try {
      const { data } = await db.getResidents();
      setResidents(data || []);
      filterResidents(data || [], search, filter);
    } catch (error) {
      console.error('Error loading residents:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterResidents = (list: any[], searchTerm: string, statusFilter: string) => {
    let filtered = list;

    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }

    setFilteredResidents(filtered);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    filterResidents(residents, value, filter);
  };

  const handleFilter = (newFilter: string) => {
    setFilter(newFilter as any);
    filterResidents(residents, search, newFilter);
  };

  const handleApprove = async (residentId: string) => {
    try {
      await db.updateResidentStatus(residentId, 'active');
      loadResidents();
      setSelectedResident(null);
    } catch (error) {
      console.error('Error approving resident:', error);
    }
  };

  const handleReject = async (residentId: string) => {
    try {
      await db.updateResidentStatus(residentId, 'rejected', rejectionReason);
      loadResidents();
      setSelectedResident(null);
      setRejectionReason('');
    } catch (error) {
      console.error('Error rejecting resident:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sidebar/20 border-t-sidebar rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading residents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Resident Management</h1>
        <p className="text-muted-foreground mt-2">Admin-only: Verify, approve, and manage resident accounts</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Residents</p>
          <p className="text-3xl font-bold text-foreground mt-2">{residents.length}</p>
        </Card>
        <Card className="p-6 border-l-4 border-l-amber-500">
          <p className="text-sm text-muted-foreground">Pending Approval</p>
          <p className="text-3xl font-bold text-amber-600 mt-2">
            {residents.filter(r => r.status === 'pending').length}
          </p>
        </Card>
        <Card className="p-6 border-l-4 border-l-emerald-500">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="text-3xl font-bold text-emerald-600 mt-2">
            {residents.filter(r => r.status === 'active').length}
          </p>
        </Card>
        <Card className="p-6 border-l-4 border-l-red-500">
          <p className="text-sm text-muted-foreground">Rejected</p>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {residents.filter(r => r.status === 'rejected').length}
          </p>
        </Card>
      </div>

      {/* Search & Filter */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {(['all', 'pending', 'active', 'rejected'] as const).map(status => (
              <Button
                key={status}
                variant={filter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Residents List */}
        {filteredResidents.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No residents found</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredResidents.map(resident => (
              <Card
                key={resident.id}
                className="p-4 hover:shadow-md transition cursor-pointer border-l-4"
                onClick={() => setSelectedResident(resident)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-sidebar/20 text-sidebar flex items-center justify-center font-semibold flex-shrink-0">
                      {resident.first_name?.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">
                        {resident.first_name} {resident.last_name}
                      </p>
                      <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {resident.email}
                        </div>
                        {resident.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {resident.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                    resident.status === 'active' ? 'bg-emerald-50 text-emerald-700' :
                    resident.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                    'bg-red-50 text-red-700'
                  }`}>
                    {resident.status}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {/* Resident Details Modal */}
      {selectedResident && (
        <Card className="p-8 border-2 border-sidebar">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              {selectedResident.first_name} {selectedResident.last_name}
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setSelectedResident(null)}>
              ✕
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium text-foreground">{selectedResident.email}</p>
            </div>
            {selectedResident.phone && (
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium text-foreground">{selectedResident.phone}</p>
              </div>
            )}
            {selectedResident.address && (
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium text-foreground">{selectedResident.address}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className={`font-semibold mt-1 ${
                selectedResident.status === 'active' ? 'text-emerald-600' :
                selectedResident.status === 'pending' ? 'text-amber-600' :
                'text-red-600'
              }`}>
                {selectedResident.status.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Admin Actions */}
          {selectedResident.status === 'pending' && (
            <div className="space-y-4 border-t pt-6">
              <h3 className="font-semibold text-foreground">Admin Actions</h3>
              <div className="flex gap-3">
                <Button
                  onClick={() => handleApprove(selectedResident.id)}
                  className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700"
                >
                  <Check className="w-4 h-4" />
                  Approve Registration
                </Button>
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Rejection reason (if rejecting)..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
                <Button
                  onClick={() => handleReject(selectedResident.id)}
                  variant="destructive"
                  className="w-full gap-2"
                >
                  <X className="w-4 h-4" />
                  Reject Registration
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
