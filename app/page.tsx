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
  Facebook,
  Menu,
  X,
  ArrowRight,
  BookOpen,
  Briefcase
} from "lucide-react"
import FeedbackSection from "@/components/feedback-section"
import OfficialsDirectory from "@/components/officials-directory"

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

  return (
    <div className="main-card-container relative min-h-screen bg-white text-slate-950">
      <div className="pointer-events-none absolute -left-10 top-0 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_top_left,_rgba(159,230,163,0.28),transparent_55%)] blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_top_right,_rgba(120,187,113,0.20),transparent_55%)] blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-44 h-60 w-60 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(15,23,42,0.08),transparent_55%)] blur-3xl" />
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white p-1">
              <Image 
                src="/logos/santiago-logo.png" 
                alt="Barangay Santiago Logo" 
                fill
                className="object-contain"
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

      <main className="mx-auto flex min-h-screen w-full max-w-full flex-col gap-y-10 px-4 sm:px-6">

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white py-10 md:py-14 shadow-[0_24px_100px_-40px_rgba(15,23,42,0.16)] min-h-[calc(100vh-4rem)]"
      >
        <div className="pointer-events-none absolute -left-10 top-0 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_top_left,_rgba(159,230,163,0.28),transparent_55%)] blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_top_right,_rgba(120,187,113,0.20),transparent_55%)] blur-3xl" />
        <div className="w-full px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr] items-start">
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
        className="py-10 md:py-12 border-t"
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
        className="py-10 md:py-12 bg-muted/10"
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
        className="py-10 md:py-12 border-t"
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

      {/* Feedback Section */}
      <section id="feedback" className="py-12 md:py-16 max-w-7xl mx-auto w-full px-4 sm:px-6">
        <FeedbackSection />
      </section>

      {/* Officials Section - Now uses dynamic OfficialsDirectory */}
      <section id="officials" className="py-12 md:py-16 bg-muted/10">
        <div className="w-full px-4 sm:px-6 max-w-7xl mx-auto">
          <OfficialsDirectory />
        </div>
      </section>


      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-[#F8FAFC] shadow-sm shadow-slate-200/20 text-sm">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:px-8">
          <div className="grid gap-8 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-2xl bg-white shadow-sm">
                  <Image
                    src="/logos/santiago-logo.png"
                    alt="Barangay Santiago Logo"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-900">Barangay Santiago</p>
                  <p className="text-sm text-slate-600">Barangay governance, resident services, and community support for San Antonio.</p>
                </div>
              </div>
              <p className="text-sm leading-6 text-slate-600 max-w-sm">
                Delivering modern, trusted community services with transparency and local government-grade reliability.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-900">Quick Links</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>
                  <Link href="/" className="transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#services" className="transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="#announcements" className="transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
                    Announcements
                  </Link>
                </li>
                <li>
                  <Link href="/resident" className="transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
                    Residents
                  </Link>
                </li>
                <li>
                  <a href="mailto:brgy.santiago.saz@gmail.com" className="transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
                    Contact Us
                  </a>
                </li>
                <li>
                  <Link href="/" className="transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
                    About
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-900">Contact Information</h3>
              <div className="space-y-3 text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <span className="mt-1 text-slate-500"><MapPin className="h-5 w-5" /></span>
                  <div>
                    <p className="font-medium text-slate-900">Barangay Hall Address</p>
                    <p className="text-slate-600">Barangay Santiago, San Antonio, Zambales</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 text-slate-500"><Phone className="h-5 w-5" /></span>
                  <div>
                    <p className="font-medium text-slate-900">Phone</p>
                  <p className="text-slate-600">09123804567</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 text-slate-500"><Mail className="h-5 w-5" /></span>
                  <div>
                    <p className="font-medium text-slate-900">Email</p>
                    <p className="text-slate-600">brgy.santiago.saz@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 text-slate-500"><Clock className="h-5 w-5" /></span>
                  <div>
                    <p className="font-medium text-slate-900">Office Hours</p>
                    <p className="text-slate-600">Monday – Friday, 8:00 AM – 5:00 PM</p>
                  </div>
                </div>
              </div>
              <Button asChild variant="outline" size="sm" className="w-full justify-center text-sm">
                <Link href="https://maps.app.goo.gl/sfmcpSv6hoVDPS8J9" target="_blank" rel="noopener noreferrer">
                  View Location on Google Maps
                </Link>
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-900">Emergency Contacts</h3>
              <div className="space-y-3 text-sm">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-sm font-semibold text-slate-900">Barangay Emergency Hotline</p>
                  <p className="text-slate-600">(047) 911-0000</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-sm font-semibold text-slate-900">Fire / Medical Response</p>
                  <p className="text-slate-600">(047) 911-0001</p>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="mb-3 text-sm font-semibold text-slate-900">Follow Us</p>
                <a
                  href="https://www.facebook.com/BarangaySantiagoOfficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                >
                  <Facebook className="h-4 w-4" aria-hidden="true" />
                  Facebook Page
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-slate-200 pt-5 text-center">
            <div className="flex flex-col gap-4 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-center">
              <p className="text-center">© 2026 Barangay Santiago Management System. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
