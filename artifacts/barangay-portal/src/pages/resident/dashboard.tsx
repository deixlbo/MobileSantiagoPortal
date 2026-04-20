import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PortalHeader } from "@/components/portal/header";
import { useSidebarToggle } from "@/components/portal/portal-layout";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import {
  FileText, ClipboardList, Megaphone, FolderKanban,
  CheckCircle2, Clock, XCircle, AlertCircle, ArrowRight
} from "lucide-react";

export default function ResidentDashboard() {
  const { userData } = useAuth();
  const { toggle } = useSidebarToggle();
  const [myDocs, setMyDocs] = useState<any[]>([]);
  const [myBlotters, setMyBlotters] = useState<any[]>([]);
  const [latestAnnouncement, setLatestAnnouncement] = useState<any | null>(null);

  useEffect(() => {
    if (userData?.uid) {
      api.documents.list(userData.uid).then(setMyDocs).catch(console.error);
      api.blotter.list(userData.uid).then(setMyBlotters).catch(console.error);
    }
    api.announcements.list().then(list => setLatestAnnouncement(list[0] ?? null)).catch(console.error);
  }, [userData?.uid]);

  const statusColor = {
    approved: "text-emerald-600 bg-emerald-50 border-emerald-200",
    pending: "text-amber-600 bg-amber-50 border-amber-200",
    processing: "text-blue-600 bg-blue-50 border-blue-200",
    rejected: "text-red-600 bg-red-50 border-red-200",
  };

  const statusIcon = {
    approved: <CheckCircle2 className="w-3.5 h-3.5" />,
    pending: <Clock className="w-3.5 h-3.5" />,
    processing: <AlertCircle className="w-3.5 h-3.5" />,
    rejected: <XCircle className="w-3.5 h-3.5" />,
  };

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Dashboard"
        description={`Welcome back, ${userData?.fullName?.split(" ")[0] ?? "Resident"}!`}
        onMenuClick={toggle}
        showNotifications
      />

      <div className="p-4 sm:p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Quick Actions */}
        <section>
          <h2 className="font-semibold text-foreground mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: FileText, label: "Request Document", href: "/resident/documents", color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
              { icon: ClipboardList, label: "File Blotter", href: "/resident/blotter", color: "bg-red-50 text-red-600 border-red-200" },
              { icon: Megaphone, label: "Announcements", href: "/resident/announcements", color: "bg-blue-50 text-blue-600 border-blue-200" },
              { icon: FolderKanban, label: "View Programs", href: "/resident/programs", color: "bg-purple-50 text-purple-600 border-purple-200" },
            ].map((action, i) => (
              <Link key={i} href={action.href}>
                <Card className={`p-4 text-center cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 border ${action.color}`} data-testid={`card-quickaction-${i}`}>
                  <action.icon className="w-7 h-7 mx-auto mb-2" />
                  <p className="text-xs font-medium leading-tight">{action.label}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Latest Announcement */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-foreground">Latest Announcement</h2>
              <Link href="/resident/announcements">
                <button className="text-xs text-primary hover:text-primary/80 flex items-center gap-1">
                  View All <ArrowRight className="w-3 h-3" />
                </button>
              </Link>
            </div>
            {latestAnnouncement ? (
              <Card className="p-5 border-primary/15">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Megaphone className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs border-primary/30 text-primary">{latestAnnouncement.category}</Badge>
                      {latestAnnouncement.priority === "high" && (
                        <Badge className="text-xs bg-red-100 text-red-600 border-red-200">Urgent</Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-foreground text-sm mb-1">{latestAnnouncement.title}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3">{latestAnnouncement.content}</p>
                    <p className="text-muted-foreground/70 text-xs mt-2">{latestAnnouncement.date ? new Date(latestAnnouncement.date).toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" }) : ""}</p>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-8 text-center border-dashed border-border/50">
                <Megaphone className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No announcements yet</p>
              </Card>
            )}
          </section>

          {/* My Document Requests */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-foreground">My Document Requests</h2>
              <Link href="/resident/documents">
                <button className="text-xs text-primary hover:text-primary/80 flex items-center gap-1">
                  View All <ArrowRight className="w-3 h-3" />
                </button>
              </Link>
            </div>
            {myDocs.length > 0 ? (
              <div className="space-y-2">
                {myDocs.map((doc) => (
                  <Card key={doc.id} className="p-4 border-border/50" data-testid={`doc-card-${doc.id}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{doc.documentType}</p>
                          <p className="text-xs text-muted-foreground">For: {doc.purpose}</p>
                        </div>
                      </div>
                      <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${statusColor[doc.status as keyof typeof statusColor] ?? statusColor.pending}`}>
                        {statusIcon[doc.status as keyof typeof statusIcon] ?? statusIcon.pending} {doc.status}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center border-dashed border-border/50">
                <FileText className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No document requests yet</p>
                <Link href="/resident/documents">
                  <Button size="sm" variant="outline" className="mt-3 border-primary/30 text-primary">Request a Document</Button>
                </Link>
              </Card>
            )}
          </section>
        </div>

        {/* Blotter Summary */}
        {myBlotters.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-foreground">My Blotter Reports</h2>
              <Link href="/resident/blotter">
                <button className="text-xs text-primary hover:text-primary/80 flex items-center gap-1">
                  View All <ArrowRight className="w-3 h-3" />
                </button>
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {myBlotters.map((b) => (
                <Card key={b.id} className="p-4 border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <ClipboardList className="w-4.5 h-4.5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-mono text-muted-foreground">{b.id}</span>
                        <BlotterStatusBadge status={b.status} />
                      </div>
                      <p className="text-sm font-medium truncate">{b.incidentType}</p>
                      <p className="text-xs text-muted-foreground">{new Date(b.date).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function BlotterStatusBadge({ status }: { status: string }) {
  const styles = {
    reported: "bg-gray-100 text-gray-600",
    investigating: "bg-blue-100 text-blue-600",
    mediation: "bg-amber-100 text-amber-600",
    resolved: "bg-emerald-100 text-emerald-600",
    escalated: "bg-red-100 text-red-600",
  };
  return (
    <span className={`text-xs font-medium px-1.5 py-0.5 rounded capitalize ${styles[status as keyof typeof styles] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}
