import { PublicLayout } from "@/components/public-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, FileText, Megaphone, Scale, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { useListAnnouncements, useListOrdinances } from "@workspace/api-client-react";
import { format } from "date-fns";

const officials = [
  { name: "Hon. Roberto S. Dela Cruz", role: "Punong Barangay", image: "/official-1.png" },
  { name: "Hon. Maria C. Santos", role: "Barangay Kagawad", image: "/official-2.png" },
  { name: "Hon. Juan T. Reyes", role: "Barangay Kagawad", image: "/official-3.png" },
  { name: "Hon. Elena P. Garcia", role: "Barangay Kagawad", image: "/official-4.png" },
  { name: "Hon. Ricardo D. Bautista", role: "Barangay Kagawad", image: "/official-1.png" },
  { name: "Hon. Carmen L. Villanueva", role: "Barangay Kagawad", image: "/official-2.png" },
  { name: "Hon. Jose B. Mendoza", role: "Barangay Kagawad", image: "/official-3.png" },
  { name: "Hon. Antonio R. Castro", role: "SK Chairperson", image: "/official-3.png" },
];

export default function Home() {
  const { data: announcements = [] } = useListAnnouncements({ status: "published" });
  const { data: ordinances = [] } = useListOrdinances({ status: "enacted" });

  const recentAnnouncements = announcements.slice(0, 3);
  const recentOrdinances = ordinances.slice(0, 3);

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-primary/10">
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero.png" 
            alt="Barangay Santiago Hall" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 py-24 md:py-32 lg:py-40">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
              <span className="flex h-2 w-2 rounded-full bg-primary"></span>
              Official Digital Portal
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
              Welcome to<br />
              <span className="text-primary">Barangay Santiago</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[600px] leading-relaxed">
              Serving our community with transparency, efficiency, and dedication. Access barangay services, stay updated with local news, and connect with your local officials.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link href="/register">
                <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/20 hover-elevate">
                  Resident Portal <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-background/50 backdrop-blur-sm hover:bg-background/80 hover-elevate border-primary/20 text-primary">
                  Official Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Banner */}
      <section className="bg-primary text-primary-foreground py-12 border-y border-primary-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary-foreground/10 flex items-center justify-center shrink-0">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Document Requests</h3>
                <p className="text-primary-foreground/70 text-sm">Clearances & certificates</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary-foreground/10 flex items-center justify-center shrink-0">
                <Megaphone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Announcements</h3>
                <p className="text-primary-foreground/70 text-sm">Latest news & events</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary-foreground/10 flex items-center justify-center shrink-0">
                <Scale className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Local Ordinances</h3>
                <p className="text-primary-foreground/70 text-sm">Rules & regulations</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary-foreground/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Verified Residents</h3>
                <p className="text-primary-foreground/70 text-sm">Secure digital ID</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements */}
      <section id="announcements" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight mb-2">Latest Announcements</h2>
              <p className="text-muted-foreground">Stay informed about the latest news, events, and important notices from the barangay council.</p>
            </div>
            <Link href="/announcements" className="hidden">
              <Button variant="ghost" className="text-primary hover:bg-primary/10">
                View All <ArrowRight className="ml-2 h-4 w-4" />
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
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {item.content}
                    </p>
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
      </section>

      {/* Document Requests CTA */}
      <section className="py-20 bg-muted/30 border-y border-border/40">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Need a Barangay Document?</h2>
            <p className="text-lg text-muted-foreground">
              Request Barangay Clearances, Certificates of Indigency, Cedula, and Business Permits entirely online. Pay securely and track your request status.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Link href="/documents">
                <Button size="lg" className="w-full sm:w-auto hover-elevate">
                  View Available Documents
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-background hover-elevate">
                  Sign In to Request
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ordinances Preview */}
      <section id="ordinances" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mb-10">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Barangay Ordinances</h2>
            <p className="text-muted-foreground">Recent local laws and regulations enacted by the Sangguniang Barangay.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentOrdinances.length > 0 ? (
              recentOrdinances.map((item) => (
                <Card key={item.id} className="hover-elevate transition-all border-border/50">
                  <CardHeader>
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                      <Scale className="h-3.5 w-3.5" />
                      {item.ordinanceNumber}
                    </div>
                    <CardTitle className="text-base line-clamp-2">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {item.description}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      Enacted: {item.enactedDate ? format(new Date(item.enactedDate), "MMM d, yyyy") : 'N/A'}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-12 text-center border-2 border-dashed rounded-xl bg-muted/20">
                <p className="text-muted-foreground">No enacted ordinances available online yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Officials */}
      <section id="officials" className="py-24 bg-muted/30 border-t border-border/40">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Our Barangay Officials</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-16">
            The dedicated public servants of Barangay Santiago, working together to build a safer, cleaner, and more progressive community.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
            {officials.map((official, i) => (
              <div key={i} className="flex flex-col items-center group">
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-4 shadow-lg ring-4 ring-background group-hover:ring-primary/20 transition-all duration-300">
                  <img 
                    src={official.image} 
                    alt={official.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-bold text-foreground text-lg">{official.name}</h3>
                <p className="text-sm text-primary font-medium mt-1">{official.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
