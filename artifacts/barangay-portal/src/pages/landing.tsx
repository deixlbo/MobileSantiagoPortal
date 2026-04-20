import { useState } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText, Megaphone, ClipboardList, Users, Phone, MapPin, Clock,
  Shield, Heart, AlertTriangle, Menu, X, Building2, CheckCircle2,
  ChevronRight, Sparkles, Globe, Lock
} from "lucide-react";
import { LayoutDashboard as DashboardIcon } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { userData } = useAuth();

  const getDashboardUrl = () => {
    if (userData?.role === "admin") return "/admin/dashboard";
    if (userData?.role === "official") return "/official/dashboard";
    if (userData?.role === "resident") return "/resident/dashboard";
    return null;
  };

  const dashboardUrl = getDashboardUrl();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-sidebar/95 backdrop-blur-sm border-b border-sidebar-border">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-3">
            {/* Left: Logo + Hamburger */}
            <div className="flex items-center gap-3">
              {/* Mobile Hamburger - now on left */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-sidebar-foreground p-2 rounded-md hover:bg-sidebar-accent/50 transition"
                data-testid="button-mobile-nav"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary/30 flex items-center justify-center">
                <img src="/santiago.jpg" alt="Brgy. Santiago" className="w-full h-full object-cover" />
              </div>
              <span className="text-sidebar-foreground font-bold text-base hidden sm:block">
                Barangay Santiago Saz
              </span>
              <span className="text-sidebar-foreground font-bold text-sm sm:hidden">
                Brgy. Santiago
              </span>
            </div>

            {/* Desktop Navigation - centered */}
            <div className="hidden md:flex items-center gap-1 mx-auto">
              {["#home", "#about", "#services", "#contact"].map((href, i) => (
                <a
                  key={href}
                  href={href}
                  className="text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/40 px-3 py-1.5 rounded-md text-sm font-medium transition"
                >
                  {["Home", "About", "Services", "Contact"][i]}
                </a>
              ))}
            </div>

            {/* Right: Login or Dashboard */}
            <div className="ml-auto hidden md:flex items-center gap-2">
              {dashboardUrl ? (
                <Link href={dashboardUrl}>
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                    <DashboardIcon className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login/resident">
                    <Button size="sm" variant="ghost" className="text-sidebar-foreground hover:bg-sidebar-accent/40 gap-1.5">
                      <Users className="w-4 h-4" />
                      Resident Login
                    </Button>
                  </Link>
                  <Link href="/login/official">
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5">
                      <Shield className="w-4 h-4" />
                      Official Login
                    </Button>
                  </Link>
                  <Link href="/login/admin">
                    <Button size="sm" variant="outline" className="border-sidebar-foreground/30 text-sidebar-foreground hover:bg-sidebar-accent/40 gap-1.5">
                      <Lock className="w-4 h-4" />
                      Admin
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-sidebar border-t border-sidebar-border">
            <div className="px-4 py-3 flex flex-col gap-1">
              {[["#home", "Home"], ["#about", "About"], ["#services", "Services"], ["#contact", "Contact"]].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/40 px-3 py-2.5 rounded-md text-sm font-medium transition"
                >
                  {label}
                </a>
              ))}
              <div className="pt-2 mt-1 border-t border-sidebar-border/50 flex flex-col gap-2">
                {dashboardUrl ? (
                  <Link href={dashboardUrl} onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground justify-start gap-2" size="sm">
                      <DashboardIcon className="w-4 h-4" /> Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/login/resident" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground justify-start gap-2" size="sm">
                        <Users className="w-4 h-4" /> Resident Login
                      </Button>
                    </Link>
                    <Link href="/login/official" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full border-sidebar-foreground/30 text-sidebar-foreground justify-start gap-2" size="sm">
                        <Shield className="w-4 h-4" /> Official Login
                      </Button>
                    </Link>
                    <Link href="/login/admin" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full border-sidebar-foreground/30 text-sidebar-foreground justify-start gap-2" size="sm">
                        <Lock className="w-4 h-4" /> Admin Login
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-16 min-h-[600px] flex items-center justify-center bg-gradient-to-br from-sidebar via-sidebar/90 to-primary/30">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-20 text-center">
          <div className="animate-fadeUp">
            <div className="flex items-center justify-center mb-6">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-primary/40 shadow-2xl overflow-hidden">
                <img src="/santiago.jpg" alt="Barangay Santiago Saz" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 border border-accent/30 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-semibold text-sidebar-foreground/90 uppercase tracking-wide">AI-Assisted Portal</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-sidebar-foreground mb-4 leading-tight">
              Barangay Santiago Saz
              <span className="block text-primary mt-1 text-2xl sm:text-4xl lg:text-5xl">Resident & Official Portal</span>
            </h1>
            <p className="text-base sm:text-lg text-sidebar-foreground/70 mb-8 max-w-2xl mx-auto leading-relaxed">
              Smart Document Processing and Resident Service Automation for Barangay Santiago, San Antonio, Zambales
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/login/resident">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 gap-2 shadow-lg" data-testid="button-resident-login">
                  <Users className="w-5 h-5" />
                  Resident Login
                </Button>
              </Link>
              <Link href="/login/official">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-sidebar-foreground/40 text-sidebar-foreground hover:bg-sidebar-foreground/10 px-8 gap-2" data-testid="button-official-login">
                  <Shield className="w-5 h-5" />
                  Official Login
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" className="w-full h-12 sm:h-20" preserveAspectRatio="none">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-primary py-6">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { value: "15,000+", label: "Residents Served" },
              { value: "6", label: "Puroks" },
              { value: "24/7", label: "Online Access" },
              { value: "AI", label: "Smart Processing" },
            ].map((stat, i) => (
              <div key={i} className="text-primary-foreground">
                <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
                <p className="text-primary-foreground/70 text-xs sm:text-sm mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Residents Section */}
      <section id="about" className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 animate-fadeUp">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">For Residents</span>
            <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">Easy Access to Barangay Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Request documents, file reports, view announcements, and participate in community programs — all from one convenient portal.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: FileText, title: "Request Documents", desc: "Clearance, Certificate of Residency, Indigency & more", color: "text-emerald-600 bg-emerald-50" },
              { icon: Megaphone, title: "View Announcements", desc: "Stay updated with barangay news and important alerts", color: "text-blue-600 bg-blue-50" },
              { icon: ClipboardList, title: "File Blotter Reports", desc: "Report incidents and track case status online", color: "text-red-600 bg-red-50" },
              { icon: FolderKanban, title: "Join Programs", desc: "Participate in community projects and activities", color: "text-purple-600 bg-purple-50" },
            ].map((item, index) => (
              <Card
                key={index}
                className="p-6 text-center hover:shadow-lg transition-all duration-200 border-primary/15 hover:border-primary/40 hover:-translate-y-1 animate-fadeUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 ${item.color}`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* For Officials Section */}
      <section id="services" className="py-16 bg-muted/40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 animate-fadeUp">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">For Officials</span>
            <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">Powerful Administrative Tools</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Efficiently manage resident services, documents, announcements, and community programs with AI-assisted tools.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: FileText, title: "Manage Document Requests", desc: "Approve, reject, and process barangay clearances, certificates, and permits." },
              { icon: Megaphone, title: "Post Announcements", desc: "Share important updates, alerts, and notices to all residents in the barangay." },
              { icon: ClipboardList, title: "Blotter Management", desc: "Record, review, and update incident reports with status tracking." },
              { icon: Users, title: "Resident Records", desc: "View and manage resident profiles, demographics, and contact information." },
              { icon: FolderKanban, title: "Projects & Programs", desc: "Organize barangay events, outreach programs, and community activities." },
              { icon: Sparkles, title: "AI-Assisted Processing", desc: "Faster document verification and smart severity classification for incidents." },
            ].map((item, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-all duration-200 border-primary/15 hover:border-primary/40 hover:-translate-y-1 animate-fadeUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / Community Info */}
      <section id="contact" className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 animate-fadeUp">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">Community</span>
            <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">Important Information</h2>
            <p className="text-muted-foreground">Emergency contacts and barangay information</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Card className="p-6 border-destructive/20 animate-fadeUp">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-destructive" />
                </div>
                <h3 className="font-semibold text-foreground">Emergency Hotlines</h3>
              </div>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex justify-between"><span>Barangay Office</span><span className="font-medium text-foreground">0912-345-6789</span></li>
                <li className="flex justify-between"><span>Police (PNP)</span><span className="font-medium text-foreground">911</span></li>
                <li className="flex justify-between"><span>Fire Department</span><span className="font-medium text-foreground">160</span></li>
                <li className="flex justify-between"><span>Medical Emergency</span><span className="font-medium text-foreground">143</span></li>
              </ul>
            </Card>

            <Card className="p-6 border-primary/20 animate-fadeUp" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Health Center</h3>
              </div>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>Brgy. Santiago Health Center</li>
                <li className="flex justify-between"><span>Contact</span><span className="font-medium text-foreground">0923-456-7890</span></li>
                <li className="flex justify-between"><span>Hours</span><span className="font-medium text-foreground">Mon-Fri 8AM-5PM</span></li>
              </ul>
            </Card>

            <Card className="p-6 border-primary/20 animate-fadeUp" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Office Hours</h3>
              </div>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex justify-between"><span>Monday–Friday</span><span className="font-medium text-foreground">8 AM – 5 PM</span></li>
                <li className="flex justify-between"><span>Saturday</span><span className="font-medium text-foreground">8 AM – 12 PM</span></li>
                <li className="flex justify-between"><span>Sunday</span><span className="font-medium text-foreground">Closed</span></li>
              </ul>
            </Card>

            <Card className="p-6 border-primary/20 animate-fadeUp" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Location</h3>
              </div>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>Barangay Santiago Hall</li>
                <li>San Antonio, Zambales</li>
                <li>Province of Zambales</li>
                <li className="flex items-center gap-1 text-primary text-xs font-medium mt-1">
                  <Globe className="w-3 h-3" /> Near Covered Court
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sidebar border-t border-sidebar-border py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Shield className="w-4 h-4 text-sidebar-foreground/80" />
            </div>
            <span className="text-sidebar-foreground font-bold">Barangay Santiago Saz</span>
          </div>
          <p className="text-sidebar-foreground/60 text-sm">
            Republic of the Philippines | Province of Zambales | Municipality of San Antonio
          </p>
          <p className="text-sidebar-foreground/40 text-xs mt-2">
            © 2026 Barangay Santiago Saz Portal. AI-Assisted Smart Document Processing.
          </p>
        </div>
      </footer>
    </div>
  );
}

function LayoutDashboard({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>;
}

function FolderKanban({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/><path d="M8 10v4"/><path d="M12 10v2"/><path d="M16 10v6"/></svg>;
}
