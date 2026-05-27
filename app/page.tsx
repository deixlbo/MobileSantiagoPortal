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

// Mock data for officials
const officials = [
  {
    id: "1",
    name: "Rolando C. Borja",
    position: "Barangay Captain",
    image: "/placeholder.svg?height=200&width=200",
    contact: "0917-123-4567",
    email: "captain@barangaysantiago.gov.ph",
    bio: "Serving Barangay Santiago since 2022. Committed to community development and public service.",
    ordinances: [
      { id: "1", title: "Noise Regulation Ordinance", status: "Published" },
      { id: "2", title: "Waste Management Ordinance", status: "Published" }
    ],
    projects: [
      { id: "1", title: "Road Improvement Project", status: "Ongoing", progress: 65 },
      { id: "2", title: "Health Center Renovation", status: "Completed", progress: 100 }
    ]
  },
  {
    id: "2",
    name: "April Joy C. Cano",
    position: "Barangay Secretary",
    image: "/placeholder.svg?height=200&width=200",
    contact: "0918-234-5678",
    email: "secretary@barangaysantiago.gov.ph",
    bio: "Managing barangay records and documentation with efficiency and transparency.",
    ordinances: [
      { id: "3", title: "Business Permit Guidelines", status: "Published" }
    ],
    projects: [
      { id: "3", title: "Digital Records System", status: "Ongoing", progress: 80 }
    ]
  },
  {
    id: "3",
    name: "Juan Dela Cruz",
    position: "Barangay Kagawad - Peace and Order",
    image: "/placeholder.svg?height=200&width=200",
    contact: "0919-345-6789",
    email: "kagawad1@barangaysantiago.gov.ph",
    bio: "Ensuring peace and order in the community through proactive measures.",
    ordinances: [],
    projects: [
      { id: "4", title: "Community Watch Program", status: "Ongoing", progress: 45 }
    ]
  },
  {
    id: "4",
    name: "Maria Santos",
    position: "Barangay Kagawad - Health",
    image: "/placeholder.svg?height=200&width=200",
    contact: "0920-456-7890",
    email: "kagawad2@barangaysantiago.gov.ph",
    bio: "Promoting health and wellness programs for all residents.",
    ordinances: [],
    projects: [
      { id: "5", title: "Medical Mission Program", status: "Planned", progress: 0 }
    ]
  },
  {
    id: "5",
    name: "Pedro Reyes",
    position: "Barangay Treasurer",
    image: "/placeholder.svg?height=200&width=200",
    contact: "0921-567-8901",
    email: "treasurer@barangaysantiago.gov.ph",
    bio: "Managing barangay funds with integrity and accountability.",
    ordinances: [],
    projects: []
  }
]

const announcements = [
  {
    id: "1",
    title: "Community Clean-up Drive",
    date: "April 25, 2026",
    content: "Join us for a community-wide clean-up drive this Saturday at 7:00 AM. Meet at the Barangay Hall."
  },
  {
    id: "2",
    title: "Free Medical Check-up",
    date: "April 28, 2026",
    content: "Free medical check-up for all residents at the Barangay Health Center. Bring your Barangay ID."
  },
  {
    id: "3",
    title: "Barangay Assembly Meeting",
    date: "May 1, 2026",
    content: "All residents are invited to attend the quarterly Barangay Assembly at 2:00 PM."
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
  const [selectedOfficial, setSelectedOfficial] = useState<typeof officials[0] | null>(null)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-primary">
              <Image 
                src="/images/santiago.jpg" 
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

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative overflow-hidden bg-background py-20 md:py-40"
      >
        <div className="pointer-events-none absolute -left-10 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-24 h-56 w-56 rounded-full bg-secondary/15 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="space-y-10 text-center">
            <div className="space-y-5 md:space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/90">Barangay Santiago Portal</p>
              <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl leading-tight">
                Barangay Services <span className="text-primary">Made Easier</span>
              </h1>
              <p className="mx-auto max-w-3xl text-lg text-muted-foreground sm:text-xl md:text-2xl leading-relaxed">
                Request clearances, file reports, track projects, and stay connected with your barangay—all from one polished and responsive portal.
              </p>
            </div>

            <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
              <Link href="/resident/login" className="w-full">
                <Button size="lg" className="w-full rounded-2xl px-10 h-14 text-base font-semibold shadow-lg shadow-primary/10 hover:shadow-xl transition-shadow">
                  Resident Login
                </Button>
              </Link>
              <Link href="/official/login" className="w-full">
                <Button size="lg" variant="outline" className="w-full rounded-2xl px-10 h-14 text-base font-semibold border-2 border-primary/70 hover:bg-primary/10 transition-colors">
                  Official Login
                </Button>
              </Link>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {[
                { label: "Fast Requests", value: "3 min", description: "Complete applications in one place." },
                { label: "Secure Documents", value: "Verified", description: "QR-secure and printable official copies." },
                { label: "Community Support", value: "24/7", description: "Help for residents and officials." },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl border border-border/80 bg-card/75 p-5 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-lg">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">{item.label}</p>
                  <p className="mt-3 text-3xl font-bold text-foreground">{item.value}</p>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              ))}
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
        className="py-20 md:py-32 border-t"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-16 space-y-3 text-center md:mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">Popular Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Request important documents and access barangay services online.</p>
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
                  <Card className="h-full overflow-hidden border-0 bg-card/60 backdrop-blur transition-all duration-300 hover:shadow-xl hover:bg-card">
                    <CardHeader>
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15">
                        <service.icon className="h-7 w-7 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <CardDescription className="text-base text-muted-foreground">{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
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
        className="py-20 md:py-32 bg-muted/30"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-16 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:mb-20">
            <div className="space-y-2">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">Latest Updates</h2>
              <p className="text-lg text-muted-foreground">Stay informed with community news and events</p>
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
                <Card className="overflow-hidden border-0 bg-card/60 backdrop-blur hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
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
        className="py-20 md:py-32 border-t"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-16 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:mb-20">
            <div className="space-y-2">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">Community Projects</h2>
              <p className="text-lg text-muted-foreground">Track progress on barangay development initiatives</p>
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
                <Card className="overflow-hidden border-0 bg-card/60 backdrop-blur hover:shadow-lg transition-all hover:-translate-y-1">
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
      <section id="officials" className="py-20 md:py-32 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-16 space-y-2 text-center md:mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">Leadership Team</h2>
            <p className="text-lg text-muted-foreground">Meet the officials serving Barangay Santiago</p>
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
                  className="cursor-pointer transition-all border-0 bg-card/60 backdrop-blur hover:shadow-lg hover:-translate-y-2 overflow-hidden group"
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

      {/* Contact Section */}
      <section className="py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="rounded-2xl bg-primary p-5 text-primary-foreground sm:p-6 md:p-8">
            <div className="grid gap-4 md:gap-6 md:grid-cols-2">
              <div>
                <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">Visit Barangay Hall</h2>
                <p className="mt-2 text-sm opacity-90 sm:text-base">We are here to serve you. Visit us during office hours or contact us for inquiries.</p>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base">Barangay Santiago, San Antonio, Zambales</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base">(047) 123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
                  <span className="text-sm break-all sm:text-base">brgy.santiago.saz@gmail.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base">Monday - Friday: 8:00 AM - 5:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-4 sm:py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <div className="flex items-center gap-2">
              <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full border border-primary">
                <Image 
                  src="/images/santiago.jpg" 
                  alt="Barangay Santiago Logo" 
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-semibold">Barangay Santiago</span>
            </div>
            <p className="text-xs text-muted-foreground sm:text-sm">
              2026 Barangay Santiago Management System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
