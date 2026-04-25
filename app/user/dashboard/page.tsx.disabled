'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { db } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Bell, AlertTriangle, CheckCircle2, Clock, LogOut } from 'lucide-react';

export default function ResidentDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [resident, setResident] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'resident') {
      router.push('/login');
      return;
    }

    const loadData = async () => {
      try {
        // Load resident data
        const { data: residentData } = await db.getResident(user.uid);
        setResident(residentData);

        // Load user's documents
        if (residentData) {
          const { data: docsData } = await db.getDocuments(residentData.id);
          setDocuments(docsData || []);
        }

        // Load latest announcements
        const { data: announcementsData } = await db.getAnnouncements();
        setAnnouncements((announcementsData || []).slice(0, 5));
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const pendingDocuments = documents.filter(d => d.status === 'pending').length;
  const approvedDocuments = documents.filter(d => d.status === 'approved').length;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              {resident?.first_name?.charAt(0) || 'R'}
            </div>
            <div>
              <p className="font-semibold text-foreground">Welcome, {resident?.first_name || 'Resident'}</p>
              <p className="text-xs text-muted-foreground">Barangay Santiago Portal</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 border-l-4 border-l-primary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                <p className="text-3xl font-bold text-foreground mt-2">{documents.length}</p>
              </div>
              <FileText className="w-12 h-12 text-primary/20" />
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-amber-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold text-amber-600 mt-2">{pendingDocuments}</p>
              </div>
              <Clock className="w-12 h-12 text-amber-500/20" />
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-emerald-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <p className="text-3xl font-bold text-emerald-600 mt-2">{approvedDocuments}</p>
              </div>
              <CheckCircle2 className="w-12 h-12 text-emerald-500/20" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/user/documents" className="block">
                  <Button className="w-full justify-start gap-2" variant="outline">
                    <FileText className="w-4 h-4" />
                    Request Document
                  </Button>
                </Link>
                <Link href="/user/announcements" className="block">
                  <Button className="w-full justify-start gap-2" variant="outline">
                    <Bell className="w-4 h-4" />
                    View Announcements
                  </Button>
                </Link>
                <Link href="/user/blotter" className="block">
                  <Button className="w-full justify-start gap-2" variant="outline">
                    <AlertTriangle className="w-4 h-4" />
                    File Incident Report
                  </Button>
                </Link>
                <Link href="/user/profile" className="block">
                  <Button className="w-full justify-start gap-2" variant="outline">
                    Update Profile
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* Recent Documents */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Recent Document Requests</h3>
              {documents.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-muted-foreground">No document requests yet</p>
                  <Link href="/user/documents">
                    <Button size="sm" className="mt-4">Request a Document</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {documents.slice(0, 5).map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition">
                      <div>
                        <p className="font-medium text-foreground">{doc.type}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(doc.requested_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        doc.status === 'approved' ? 'bg-emerald-50 text-emerald-700' :
                        doc.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                        'bg-red-50 text-red-700'
                      }`}>
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <Link href="/user/documents" className="block mt-4">
                <Button variant="outline" className="w-full">View All Documents</Button>
              </Link>
            </Card>
          </div>
        </div>

        {/* Announcements */}
        {announcements.length > 0 && (
          <Card className="p-6 mt-8">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Latest Announcements</h3>
            </div>
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="p-4 rounded-lg border-l-4 border-l-primary bg-primary/5">
                  <h4 className="font-medium text-foreground">{announcement.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{announcement.content}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(announcement.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
            <Link href="/user/announcements" className="block mt-4">
              <Button variant="outline" className="w-full">View All Announcements</Button>
            </Link>
          </Card>
        )}
      </main>
    </div>
  );
}
