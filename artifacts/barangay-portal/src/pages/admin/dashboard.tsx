import { AdminLayout } from "@/components/admin-layout";
import { useGetDashboardSummary, useGetRecentActivity } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileWarning, HardHat, Megaphone, Scale, FileText, FolderOpen, Activity } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function Dashboard() {
  const { data: summary } = useGetDashboardSummary();
  const { data: activity = [] } = useGetRecentActivity();

  const stats = [
    { label: "Total Residents", value: summary?.totalResidents || 0, icon: Users, sub: `${summary?.activeResidents || 0} active`, color: "text-blue-600", bg: "bg-blue-600/10" },
    { label: "Blotter Reports", value: summary?.totalBlotterReports || 0, icon: FileWarning, sub: `${summary?.pendingBlotterReports || 0} pending`, color: "text-amber-600", bg: "bg-amber-600/10" },
    { label: "Projects", value: summary?.totalProjects || 0, icon: HardHat, sub: `${summary?.ongoingProjects || 0} ongoing`, color: "text-emerald-600", bg: "bg-emerald-600/10" },
    { label: "Announcements", value: summary?.totalAnnouncements || 0, icon: Megaphone, sub: `${summary?.publishedAnnouncements || 0} published`, color: "text-purple-600", bg: "bg-purple-600/10" },
    { label: "Ordinances", value: summary?.totalOrdinances || 0, icon: Scale, sub: `${summary?.enactedOrdinances || 0} enacted`, color: "text-indigo-600", bg: "bg-indigo-600/10" },
    { label: "Document Reqs", value: summary?.totalDocumentRequests || 0, icon: FileText, sub: `${summary?.pendingDocumentRequests || 0} pending`, color: "text-rose-600", bg: "bg-rose-600/10" },
    { label: "Digital Assets", value: summary?.totalAssets || 0, icon: FolderOpen, sub: `Files & Media`, color: "text-cyan-600", bg: "bg-cyan-600/10" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground">Welcome back. Here's what's happening in Barangay Santiago today.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <Card key={i} className="border-border/50 shadow-sm hover-elevate">
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <div className={`w-8 h-8 rounded-full ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-3xl font-bold tracking-tight">{stat.value.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1 font-medium">
                  {stat.sub}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity Feed */}
          <Card className="col-span-1 shadow-sm border-border/50">
            <CardHeader className="border-b bg-muted/10 pb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {activity.length > 0 ? (
                  activity.map((item) => (
                    <div key={item.id} className="p-4 hover:bg-muted/20 transition-colors flex gap-4">
                      <div className="mt-0.5">
                        {item.kind === 'resident' && <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />}
                        {item.kind === 'blotter' && <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5" />}
                        {item.kind === 'project' && <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5" />}
                        {item.kind === 'announcement' && <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5" />}
                        {item.kind === 'ordinance' && <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5" />}
                        {item.kind === 'document' && <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5" />}
                        {item.kind === 'asset' && <div className="w-2 h-2 rounded-full bg-cyan-500 mt-1.5" />}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <p className="text-xs text-muted-foreground/70">
                          {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    No recent activity to display.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Placeholders for future widgets */}
          <div className="space-y-8">
            <Card className="shadow-sm border-border/50">
              <CardHeader className="border-b bg-muted/10 pb-4">
                <CardTitle className="text-lg">System Status</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Database Connection</span>
                    <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" /> Operational
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">API Endpoints</span>
                    <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" /> Online
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Storage Quota</span>
                    <span className="text-sm text-muted-foreground">1.2 GB / 5 GB (24%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-border/50 bg-primary/5 border-primary/20">
              <CardContent className="p-6 text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HardHat className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-primary">Need Help?</h3>
                <p className="text-sm text-muted-foreground">
                  Contact the IT department for system support or feature requests.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
