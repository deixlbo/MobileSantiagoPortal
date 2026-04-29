"use client"

import { useState } from "react"
import Link from "next/link"
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
  PlayCircle,
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
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Barangay Santiago</h1>
              <p className="text-xs text-muted-foreground">San Antonio, Zambales</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 md:flex">
            <a href="#services" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Services</a>
            <a href="#announcements" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Announcements</a>
            <a href="#projects" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Projects</a>
            <a href="#officials" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Officials</a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/resident/login">
              <Button variant="outline">Resident Login</Button>
            </Link>
            <Link href="/official/login">
              <Button>Official Portal</Button>
            </Link>
          </div>

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
              <hr className="my-2" />
              <Link href="/resident/login">
                <Button variant="outline" className="w-full">Resident Login</Button>
              </Link>
              <Link href="/official/login">
                <Button className="w-full">Official Portal</Button>
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <Badge variant="secondary" className="mb-4">
                Digital Barangay Services
              </Badge>
              <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                Welcome to Barangay Santiago
              </h1>
              <p className="text-pretty text-lg text-muted-foreground md:text-xl">
                Access barangay services online. Request documents, file reports, and stay updated with community announcements and projects.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/resident/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Register as Resident
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Watch Video
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video overflow-hidden rounded-xl border bg-card shadow-2xl">
                <div className="flex h-full items-center justify-center bg-muted">
                  <div className="text-center">
                    <PlayCircle className="mx-auto h-16 w-16 text-muted-foreground/50" />
                    <p className="mt-4 text-sm text-muted-foreground">Barangay Santiago Promotional Video</p>
                    <p className="text-xs text-muted-foreground">santiago.mp4</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-foreground">Our Services</h2>
            <p className="mt-2 text-muted-foreground">Request documents and access barangay services online</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <Card key={index} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/resident/login">
                    <Button variant="link" className="h-auto p-0">
                      Request Now <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      <section id="announcements" className="bg-muted/50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Announcements</h2>
              <p className="mt-2 text-muted-foreground">Stay updated with the latest barangay news</p>
            </div>
            <Link href="/resident/login">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {announcements.map((announcement) => (
              <Card key={announcement.id}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Megaphone className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">{announcement.date}</span>
                  </div>
                  <CardTitle className="text-lg">{announcement.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{announcement.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Community Projects</h2>
              <p className="mt-2 text-muted-foreground">Track ongoing and completed barangay projects</p>
            </div>
            <Link href="/resident/login">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant={
                      project.status === "Completed" ? "default" :
                      project.status === "Ongoing" ? "secondary" : "outline"
                    }>
                      {project.status}
                    </Badge>
                    <span className="text-sm font-medium">{project.progress}%</span>
                  </div>
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <CardDescription>{project.type}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div 
                        className="h-full bg-primary transition-all" 
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {project.location}
                      </span>
                      <span>PHP {project.budget}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Officials Section */}
      <section id="officials" className="bg-muted/50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-foreground">Barangay Officials</h2>
            <p className="mt-2 text-muted-foreground">Meet your elected officials serving the community</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {officials.map((official) => (
              <Card 
                key={official.id} 
                className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
                onClick={() => setSelectedOfficial(official)}
              >
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full bg-muted">
                    <div className="flex h-full items-center justify-center">
                      <Users className="h-12 w-12 text-muted-foreground/50" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground">{official.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{official.position}</p>
                  <Button variant="link" className="mt-2 h-auto p-0 text-sm">
                    View Profile <ChevronRight className="ml-1 h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Official Profile Modal */}
      <Dialog open={!!selectedOfficial} onOpenChange={() => setSelectedOfficial(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Official Profile</DialogTitle>
          </DialogHeader>
          {selectedOfficial && (
            <ScrollArea className="max-h-[70vh]">
              <div className="space-y-6 p-1">
                {/* Profile Header */}
                <div className="flex items-start gap-6">
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full bg-muted">
                    <div className="flex h-full items-center justify-center">
                      <Users className="h-12 w-12 text-muted-foreground/50" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{selectedOfficial.name}</h3>
                    <Badge>{selectedOfficial.position}</Badge>
                    <p className="text-sm text-muted-foreground">{selectedOfficial.bio}</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="rounded-lg border p-4">
                  <h4 className="mb-3 font-semibold">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedOfficial.contact}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedOfficial.email}</span>
                    </div>
                  </div>
                </div>

                {/* Ordinances */}
                {selectedOfficial.ordinances.length > 0 && (
                  <div className="rounded-lg border p-4">
                    <h4 className="mb-3 font-semibold flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Authored Ordinances
                    </h4>
                    <div className="space-y-2">
                      {selectedOfficial.ordinances.map((ord) => (
                        <div key={ord.id} className="flex items-center justify-between rounded bg-muted/50 p-3">
                          <span className="text-sm">{ord.title}</span>
                          <Badge variant="secondary">{ord.status}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {selectedOfficial.projects.length > 0 && (
                  <div className="rounded-lg border p-4">
                    <h4 className="mb-3 font-semibold flex items-center gap-2">
                      <FolderOpen className="h-4 w-4" />
                      Handled Projects
                    </h4>
                    <div className="space-y-3">
                      {selectedOfficial.projects.map((proj) => (
                        <div key={proj.id} className="rounded bg-muted/50 p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">{proj.title}</span>
                            <Badge variant={proj.status === "Completed" ? "default" : "outline"}>
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
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="rounded-2xl bg-primary p-8 text-primary-foreground md:p-12">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="text-2xl font-bold md:text-3xl">Visit Barangay Hall</h2>
                <p className="mt-2 opacity-90">We are here to serve you. Visit us during office hours or contact us for inquiries.</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5" />
                  <span>Barangay Santiago, San Antonio, Zambales</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5" />
                  <span>(047) 123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5" />
                  <span>info@barangaysantiago.gov.ph</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5" />
                  <span>Monday - Friday: 8:00 AM - 5:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold">Barangay Santiago</span>
            </div>
            <p className="text-sm text-muted-foreground">
              2026 Barangay Santiago Management System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
