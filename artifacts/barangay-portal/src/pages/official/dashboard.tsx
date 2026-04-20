import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PortalHeader } from "@/components/portal/header";
import { useSidebarToggle } from "@/components/portal/portal-layout";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import {
  Users, FileText, ClipboardList, FolderKanban,
  CheckCircle2, ArrowRight
} from "lucide-react";

export default function OfficialDashboard() {
  const { userData } = useAuth();
  const { toggle } = useSidebarToggle();
  const [allDocs, setAllDocs] = useState<any[]>([]);
  const [allBlotter, setAllBlotter] = useState<any[]>([]);
  const [allResidents, setAllResidents] = useState<any[]>([]);
  const [allAnn, setAllAnn] = useState<any[]>([]);
  const [allProjects, setAllProjects] = useState<any[]>([]);

  useEffect(() => {
    api.documents.list().then(setAllDocs).catch(console.error);
    api.blotter.list().then(setAllBlotter).catch(console.error);
    api.residents.list().then(setAllResidents).catch(console.error);
    api.announcements.list().then(setAllAnn).catch(console.error);
    api.projects.list().then(setAllProjects).catch(console.error);
  }, []);

  const stats = [
    { label: "Total Residents", value: allResidents.length + 4820, icon: Users, color: "text-blue-600 bg-blue-50 border-blue-200", href: "/official/residents" },
    { label: "Pending Documents", value: allDocs.filter(d => d.status === "pending" || d.status === "processing").length, icon: FileText, color: "text-amber-600 bg-amber-50 border-amber-200", href: "/official/documents" },
    { label: "Active Cases", value: allBlotter.filter(b => b.status !== "resolved").length, icon: ClipboardList, color: "text-red-600 bg-red-50 border-red-200", href: "/official/blotter" },
    { label: "Ongoing Projects", value: allProjects.filter(p => p.status === "ongoing").length, icon: FolderKanban, color: "text-purple-600 bg-purple-50 border-purple-200", href: "/official/projects" },
  ];

  const pendingDocs = allDocs.filter(d => d.status === "pending" || d.status === "processing").slice(0, 4);
  const recentBlotter = allBlotter.filter(b => b.status !== "resolved").slice(0, 3);
  const recentAnn = allAnn.slice(0, 3);

  const statusColor = {
    approved: "text-emerald-600 bg-emerald-50",
    pending: "text-amber-600 bg-amber-50",
    processing: "text-blue-600 bg-blue-50",
    rejected: "text-red-600 bg-red-50",
  };

  const blotterStatusColor = {
    reported: "bg-gray-100 text-gray-700",
    investigating: "bg-blue-100 text-blue-700",
    mediation: "bg-amber-100 text-amber-700",
    resolved: "bg-emerald-100 text-emerald-700",
    escalated: "bg-red-100 text-red-700",
  };

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Official Dashboard"
        description={`Good day, ${userData?.fullName}!`}
        onMenuClick={toggle}
        showNotifications
      />

      <div className="p-4 sm:p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Stats Grid */}
        <section>
          <h2 className="font-semibold text-foreground mb-3">Overview</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((s, i) => (
              <Link key={i} href={s.href}>
                <Card className={`p-4 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all border ${s.color}`} data-testid={`stat-card-${i}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium opacity-80 mb-1">{s.label}</p>
                      <p className="text-2xl font-bold">{s.value.toLocaleString()}</p>
                    </div>
                    <s.icon className="w-6 h-6 opacity-70" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Pending Document Requests */}
          <section className="lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-foreground">Pending Document Requests</h2>
              <Link href="/official/documents">
                <button className="text-xs text-primary hover:text-primary/80 flex items-center gap-1">
                  View All <ArrowRight className="w-3 h-3" />
                </button>
              </Link>
            </div>
            <Card className="overflow-hidden border-border/50">
              {pendingDocs.length === 0 ? (
                <div className="p-8 text-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">All requests processed!</p>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {pendingDocs.map(doc => (
                    <div key={doc.id} className="p-4 flex items-center justify-between gap-4" data-testid={`official-doc-${doc.id}`}>
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <FileText className="w-4.5 h-4.5 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{doc.documentType}</p>
                          <p className="text-xs text-muted-foreground">{doc.residentName}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor[doc.status as keyof typeof statusColor]}`}>{doc.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </section>

          {/* Active Blotter Cases */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-foreground">Active Cases</h2>
              <Link href="/official/blotter">
                <button className="text-xs text-primary hover:text-primary/80 flex items-center gap-1">
                  All <ArrowRight className="w-3 h-3" />
                </button>
              </Link>
            </div>
            <div className="space-y-2">
              {recentBlotter.map(b => (
                <Card key={b.id} className="p-3 border-border/50">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-mono text-muted-foreground">{b.id}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded capitalize ${blotterStatusColor[b.status as keyof typeof blotterStatusColor]}`}>{b.status}</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{b.incidentType}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{b.location}</p>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* Recent Announcements */}
        <div className="grid lg:grid-cols-2 gap-5">
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-foreground">Recent Announcements</h2>
              <Link href="/official/announcements">
                <button className="text-xs text-primary hover:text-primary/80 flex items-center gap-1">
                  Manage <ArrowRight className="w-3 h-3" />
                </button>
              </Link>
            </div>
            <div className="space-y-2">
              {recentAnn.map(ann => (
                <Card key={ann.id} className="p-3 border-border/50">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Badge variant="outline" className="text-xs border-primary/20 text-primary">{ann.category}</Badge>
                    {ann.priority === "high" && <span className="text-xs font-medium text-red-600">Urgent</span>}
                  </div>
                  <p className="text-sm font-medium text-foreground">{ann.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{new Date(ann.date).toLocaleDateString("en-PH", { month: "short", day: "numeric" })}</p>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
