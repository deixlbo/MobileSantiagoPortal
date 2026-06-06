"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  FileText, 
  Users, 
  Shield, 
  Building2, 
  Megaphone, 
  FolderOpen,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Clock,
  Menu,
  X,
  ArrowRight,
  BookOpen,
  Briefcase
} from "lucide-react"

interface Official {
  id: string
  name: string
  position: string
  image: string
  contact: string
  email: string
  bio: string
  ordinances: { id: string; title: string; status: string }[]
  projects: { id: string; title: string; status: string; progress: number }[]
}

interface AnnouncementCard {
  id: string
  title: string
  date: string
  content: string
}

const officials: Official[] = [
  {
    id: "1",
    name: "Atty. Maria Santos",
    position: "Punong Barangay",
    image: "/images/official1.jpg",
    contact: "(047) 555-0123",
    email: "msantos@santiago.gov.ph",
    bio: "Leads community governance and local development initiatives.",
    ordinances: [
      { id: "o1", title: "Clean Barangay Ordinance", status: "Active" }
    ],
    projects: [
      { id: "p1", title: "Community Health Drive", status: "Ongoing", progress: 80 }
    ]
  },
  {
    id: "2",
    name: "Engr. Ramon Cruz",
    position: "Kagawad - Infrastructure",
    image: "/images/official2.jpg",
    contact: "(047) 555-0145",
    email: "rcruz@santiago.gov.ph",
    bio: "Oversees barangay infrastructure and public works projects.",
    ordinances: [
      { id: "o2", title: "Road Safety Ordinance", status: "Active" }
    ],
    projects: [
      { id: "p2", title: "Street Light Upgrade", status: "Planned", progress: 20 }
    ]
  },
  {
    id: "3",
    name: "Kum. Ana Reyes",
    position: "Kagawad - Health",
    image: "/images/official3.jpg",
    contact: "(047) 555-0198",
    email: "areyes@santiago.gov.ph",
    bio: "Supports health programs, vaccination drives, and community wellness.",
    ordinances: [
      { id: "o3", title: "Health Awareness Ordinance", status: "Active" }
    ],
    projects: [
      { id: "p3", title: "Barangay Wellness Fair", status: "Completed", progress: 100 }
    ]
  }
]

const announcements: AnnouncementCard[] = [
  {
    id: "a1",
    title: "Barangay Hall Open on Saturdays",
    date: "June 1, 2026",
    content: "Office hours are extended to serve residents with urgent concerns and document requests."
  },
  {
    id: "a2",
    title: "Community Clean-Up Drive",
    date: "May 28, 2026",
    content: "Join the barangay-led clean-up initiative at the public plaza this weekend."
  },
  {
    id: "a3",
    title: "Health Consultation Camp",
    date: "May 18, 2026",
    content: "Free check-ups and medical advice are available for all residents."
  }
]

const projects = [
  {
    id: "1",
    title: "Road Improvement Project",
    type: "Infrastructure",
    location: "Purok 3",
    status: "Ongoing",
    progress: 65,
    budget: "150,000"
  },
  {
    id: "2",
    title: "Health Center Renovation",
    type: "Health",
    location: "Barangay Center",
    status: "Completed",
    progress: 100,
    budget: "200,000"
  },
  {
    id: "3",
    title: "Solar Street Lights",
    type: "Infrastructure",
    location: "Main Road",
    status: "Planned",
    progress: 0,
    budget: "100,000"
  }
]

const services = [
  { icon: FileText, title: "Barangay Clearance", description: "Request clearance for employment, travel, or other purposes" },
  { icon: Users, title: "Certificate of Residency", description: "Proof of residence in Barangay Santiago" },
  { icon: Shield, title: "Blotter Report", description: "File incident reports for peace and order concerns" },
  { icon: Building2, title: "Business Permit", description: "Apply for business clearance and permits" },
  { icon: Briefcase, title: "Certificate of Indigency", description: "For financial assistance and medical aid" }
]

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedOfficial, setSelectedOfficial] = useState<Official | null>(null)

  return (
    <div className="relative min-h-screen bg-white text-slate-950">
      <div className="pointer-events-none absolute -left-10 top-0 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_top_left,_rgba(159,230,163,0.28),transparent_55%)] blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_top_right,_rgba(120,187,113,0.20),transparent_55%)] blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-44 h-60 w-60 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(15,23,42,0.08),transparent_55%)] blur-3xl" />
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-primary">
              <Image 
                src="/images/santiagologo.jpg" 
                alt="Barangay Santiago Logo" 
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Barangay Santiago</h1>
              <p className="text-xs text-muted-foreground">San Antonio, Zambales</p>
            </div>
          </div>

          {/* Desktop Navigation - Right Aligned */}
          <nav className="hidden items-center gap-6 md:flex ml-auto">
            <a href="#services" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Services</a>
            <a href="#announcements" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Announcements</a>
            <a href="#projects" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Projects</a>
            <a href="#officials" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Officials</a>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t bg-card px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-3">
              <a href="#services" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Services</a>
              <a href="#announcements" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Announcements</a>
              <a href="#projects" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Projects</a>
              <a href="#officials" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Officials</a>
            </nav>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6">

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white py-14 md:py-20 shadow-[0_24px_100px_-40px_rgba(15,23,42,0.16)]"
      >
        <div className="pointer-events-none absolute -left-10 top-0 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_top_left,_rgba(159,230,163,0.28),transparent_55%)] blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_top_right,_rgba(120,187,113,0.20),transparent_55%)] blur-3xl" />
        <div className="w-full px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr] items-start">
            <div className="space-y-8">
              <div className="space-y-5 max-w-3xl">
                <h1 className="text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
                  Barangay Services <span className="text-primary">Made Easier</span>
                </h1>
                <p className="text-lg leading-8 text-muted-foreground">
                  AI-Assisted Barangay Santiago Portal: Smart Document Processing and Resident Service Automation.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 max-w-xl">
                <Link href="/resident/login" className="w-full">
                  <Button size="lg" className="w-full rounded-2xl px-10 h-14 text-base font-semibold shadow-lg shadow-primary/10 hover:shadow-xl transition-shadow">
                    Resident Login
                  </Button>
                </Link>
                <Link href="/official/login-form" className="w-full">
                  <Button size="lg" variant="outline" className="w-full rounded-2xl px-10 h-14 text-base font-semibold border-2 border-primary/70 hover:bg-primary/10 transition-colors">
                    Official Login
                  </Button>
                </Link>
              </div>
            </div>

            <div className="rounded-[38px] border border-slate-200/70 bg-white/95 p-8 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.18)]">
              <div className="grid gap-4">
                {[
                  { label: "Fast Requests", value: "3 min", description: "Complete applications in one place." },
                  { label: "Secure Documents", value: "Verified", description: "QR-secure official copies." },
                  { label: "Community Support", value: "24/7", description: "Help for residents and officials." },
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl border border-slate-200/70 bg-slate-50 p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">{item.label}</p>
                    <p className="mt-3 text-3xl font-bold text-foreground">{item.value}</p>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Services Section */}
      <motion.section
        id="services"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="py-12 md:py-16 border-t"
      >
        <div className="w-full px-4 sm:px-6">
          <div className="mb-10 space-y-3 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Popular Services</h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">Request important documents and access barangay services online.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                whileHover={{ y: -4 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <Link href="/resident/login">
                  <Card className="h-full overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <CardHeader className="p-0">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15">
                        <service.icon className="h-7 w-7 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <CardDescription className="text-base text-muted-foreground">{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 pt-5">
                      <Button variant="ghost" className="p-0 h-auto font-semibold text-primary hover:text-primary/80">
                        Request Now →
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Announcements Section */}
      <motion.section
        id="announcements"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="py-12 md:py-16 bg-muted/10"
      >
        <div className="w-full px-4 sm:px-6">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Latest Updates</h2>
              <p className="text-base text-muted-foreground">Stay informed with community news and events</p>
            </div>
            <Link href="/resident/login">
              <Button variant="outline" className="w-full sm:w-auto rounded-lg px-6 h-12 font-semibold border-2">View All</Button>
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {announcements.map((announcement, index) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
              >
                <Card className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Megaphone className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium text-muted-foreground">{announcement.date}</span>
                    </div>
                    <CardTitle className="text-xl">{announcement.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">{announcement.content}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Projects Section */}
      <motion.section
        id="projects"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="py-12 md:py-16 border-t"
      >
        <div className="w-full px-4 sm:px-6">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Community Projects</h2>
              <p className="text-base text-muted-foreground">Track progress on barangay development initiatives</p>
            </div>
            <Link href="/resident/login">
              <Button variant="outline" className="w-full sm:w-auto rounded-lg px-6 h-12 font-semibold border-2">View All</Button>
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
              >
                <Card className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant={
                        project.status === "Completed" ? "default" :
                        project.status === "Ongoing" ? "secondary" : "outline"
                      } className="text-xs font-semibold py-1 px-3">
                        {project.status}
                      </Badge>
                      <span className="text-sm font-semibold text-primary">{project.progress}%</span>
                    </div>
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                    <CardDescription className="text-sm">{project.type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all rounded-full" 
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 flex-shrink-0" /> {project.location}
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 flex-shrink-0">₱</span> {project.budget}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Officials Section */}
      <section id="officials" className="py-12 md:py-16 bg-muted/10">
        <div className="w-full px-4 sm:px-6">
          <div className="mb-10 space-y-2 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Leadership Team</h2>
            <p className="text-base text-muted-foreground">Meet the officials serving Barangay Santiago</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {officials.map((official, index) => (
              <motion.div
                key={official.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
              >
                <Card 
                  className="cursor-pointer transition-all rounded-3xl border border-slate-200/70 bg-white/90 shadow-sm hover:shadow-lg hover:-translate-y-1 overflow-hidden group"
                  onClick={() => setSelectedOfficial(official)}
                >
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="mx-auto h-24 w-24 overflow-hidden rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/10 transition-all">
                      <Users className="h-12 w-12 text-primary/60" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold text-foreground text-lg">{official.name}</h3>
                      <p className="text-sm text-muted-foreground leading-snug">{official.position}</p>
                    </div>
                    <Button variant="ghost" className="w-full text-primary font-semibold hover:bg-primary/10">
                      View Profile →
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Official Profile Modal */}
      <Dialog open={!!selectedOfficial} onOpenChange={() => setSelectedOfficial(null)}>
        <DialogContent className="max-w-2xl w-[calc(100%-2rem)] sm:w-full mx-auto">
          <DialogHeader>
            <DialogTitle>Official Profile</DialogTitle>
          </DialogHeader>
          {selectedOfficial && (
            <ScrollArea className="max-h-[70vh]">
              <div className="space-y-4 p-1 sm:space-y-6">
                {/* Profile Header */}
                <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:gap-6 sm:text-left">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-muted sm:h-24 sm:w-24">
                    <div className="flex h-full items-center justify-center">
                      <Users className="h-10 w-10 text-muted-foreground/50 sm:h-12 sm:w-12" />
                    </div>
                  </div>
                  <div className="min-w-0 space-y-2">
                    <h3 className="text-lg font-bold sm:text-xl">{selectedOfficial.name}</h3>
                    <Badge className="text-xs">{selectedOfficial.position}</Badge>
                    <p className="text-sm text-muted-foreground">{selectedOfficial.bio}</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="rounded-lg p-3 sm:p-4">
                  <h4 className="mb-3 font-semibold text-sm sm:text-base">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span>{selectedOfficial.contact}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Mail className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
                      <span className="break-all">{selectedOfficial.email}</span>
                    </div>
                  </div>
                </div>

                {/* Ordinances */}
                {selectedOfficial.ordinances.length > 0 && (
                  <div className="rounded-lg border p-3 sm:p-4">
                    <h4 className="mb-3 font-semibold flex items-center gap-2 text-sm sm:text-base">
                      <BookOpen className="h-4 w-4 shrink-0" />
                      Authored Ordinances
                    </h4>
                    <div className="space-y-2">
                      {selectedOfficial.ordinances.map((ord) => (
                        <div key={ord.id} className="flex flex-col gap-2 rounded bg-muted/50 p-2 sm:flex-row sm:items-center sm:justify-between sm:p-3">
                          <span className="text-xs sm:text-sm">{ord.title}</span>
                          <Badge variant="secondary" className="w-fit text-xs">{ord.status}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {selectedOfficial.projects.length > 0 && (
                  <div className="rounded-lg border p-3 sm:p-4">
                    <h4 className="mb-3 font-semibold flex items-center gap-2 text-sm sm:text-base">
                      <FolderOpen className="h-4 w-4 shrink-0" />
                      Handled Projects
                    </h4>
                    <div className="space-y-3">
                      {selectedOfficial.projects.map((proj) => (
                        <div key={proj.id} className="rounded bg-muted/50 p-2 sm:p-3">
                          <div className="flex flex-col gap-2 mb-2 sm:flex-row sm:items-center sm:justify-between">
                            <span className="text-xs font-medium sm:text-sm">{proj.title}</span>
                            <Badge variant={proj.status === "Completed" ? "default" : "outline"} className="w-fit text-xs">
                              {proj.status}
                            </Badge>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                            <div 
                              className="h-full bg-primary transition-all" 
                              style={{ width: `${proj.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{proj.progress}% complete</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      </main>

      {/* Footer */}
      <footer className="border-t bg-card py-5 sm:py-6">
        <div className="w-full px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_min-content] md:items-center">
            <div className="flex flex-col justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-primary">
                  <Image 
                    src="/images/santiagologo.jpg" 
                    alt="Barangay Santiago Logo" 
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-base font-semibold">Barangay Santiago</p>
                  <p className="text-sm text-muted-foreground">San Antonio, Zambales</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground max-w-md">
                2026 Barangay Santiago Management System. All rights reserved.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-muted/70 p-4 max-w-lg">
              <h2 className="mb-2 text-base font-semibold">Visit Barangay Hall</h2>
              <p className="text-sm text-muted-foreground">We are here to serve you. Visit us during office hours or contact us for inquiries.</p>
              <div className="mt-4 space-y-1 text-sm text-foreground">
                <div>Barangay Santiago, San Antonio, Zambales</div>
                <div>(047) 123-4567</div>
                <div>brgy.santiago.saz@gmail.com</div>
                <div>Monday - Friday: 8:00 AM - 5:00 PM</div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
