import { ResidentLayout } from "@/components/resident-layout";
import { useResident } from "@/lib/use-resident";
import { useListAnnouncements } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, FileWarning, Megaphone, ArrowRight, CalendarDays } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";

export default function ResidentDashboard() {
  const { resident } = useResident();
  const { data: announcements = [] } = useListAnnouncements({ status: "published" });

  const recentAnnouncements = announcements.slice(0, 3);

  if (!resident) return null;

  return (
    <ResidentLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Welcome Card */}
        <Card className="bg-primary text-primary-foreground overflow-hidden relative border-none">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-foreground/10 to-transparent mix-blend-overlay" />
          <CardContent className="p-8 relative z-10">
            <h2 className="text-3xl font-bold mb-2">Hello, {resident.fullName.split(' ')[0]}!</h2>
            <p className="text-primary-foreground/80 text-lg">Welcome to your Barangay Santiago Resident Portal.</p>
            <div className="mt-6 inline-flex items-center gap-2 bg-primary-foreground/20 rounded-full px-4 py-1.5 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Verified Resident • {resident.purok}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div>
          <h3 className="text-xl font-bold mb-4 tracking-tight">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/resident/documents">
              <Card className="hover-elevate cursor-pointer h-full border-border/50 transition-colors hover:border-primary/50 group">
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Request a Document</h4>
                    <p className="text-sm text-muted-foreground mt-1">Clearances, Certificates, and Permits</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/resident/blotter">
              <Card className="hover-elevate cursor-pointer h-full border-border/50 transition-colors hover:border-primary/50 group">
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileWarning className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">File a Blotter Report</h4>
                    <p className="text-sm text-muted-foreground mt-1">Report incidents or complaints</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/resident/announcements">
              <Card className="hover-elevate cursor-pointer h-full border-border/50 transition-colors hover:border-primary/50 group">
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Megaphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">View Announcements</h4>
                    <p className="text-sm text-muted-foreground mt-1">Stay updated with barangay news</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Recent Announcements */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold tracking-tight">Latest from the Barangay</h3>
            <Link href="/resident/announcements">
              <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentAnnouncements.length > 0 ? (
              recentAnnouncements.map((item) => (
                <Card key={item.id} className="overflow-hidden hover-elevate transition-all border-border/50 bg-card">
                  <div className="h-2 bg-primary/20" />
                  <CardHeader>
                    <div className="flex items-center gap-2 text-xs font-medium text-primary mb-2">
                      <Megaphone className="h-3.5 w-3.5" />
                      {item.type}
                    </div>
                    <CardTitle className="line-clamp-2 leading-snug text-lg">{item.title}</CardTitle>
                    <CardDescription>
                      {format(new Date(item.createdAt), "MMMM d, yyyy")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {item.content}
                    </p>
                    {item.eventDate && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium bg-muted/50 p-2 rounded-md">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {format(new Date(item.eventDate), "MMM d, yyyy")} 
                        {item.eventTime && ` at ${item.eventTime}`}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-12 text-center border-2 border-dashed rounded-xl bg-muted/20">
                <p className="text-muted-foreground">No recent announcements</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </ResidentLayout>
  );
}
