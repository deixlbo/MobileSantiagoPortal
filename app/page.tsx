"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  Scale,
  Megaphone,
  Users,
  Calendar,
  MapPin,
  ChevronRight,
  Menu,
  X,
  Phone,
  Mail,
  Clock,
  Building2,
  Eye
} from "lucide-react"
import {
  mockOfficials,
  mockAnnouncements,
  mockOrdinances,
  mockDocumentTypes
} from "@/lib/mock-data"

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedOrdinance, setSelectedOrdinance] = useState<typeof mockOrdinances[0] | null>(null)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<typeof mockAnnouncements[0] | null>(null)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="font-bold text-primary leading-tight">Barangay Santiago</div>
              <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                San Antonio, Zambales
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#officials" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Officials
            </a>
            <a href="#announcements" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Announcements
            </a>
            <a href="#ordinances" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Ordinances
            </a>
            <a href="#documents" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Documents
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:block">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/login">
              <Button size="sm">Get Started</Button>
            </Link>
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background p-4 space-y-3">
            <a href="#officials" className="block py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Officials
            </a>
            <a href="#announcements" className="block py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Announcements
            </a>
            <a href="#ordinances" className="block py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Ordinances
            </a>
            <a href="#documents" className="block py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Documents
            </a>
            <Link href="/login" className="block">
              <Button className="w-full mt-2">Sign In</Button>
            </Link>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
          <div className="container relative mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <Badge variant="secondary" className="mb-4">
                Welcome to Barangay Santiago
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
                Your Gateway to Barangay Services
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                Access barangay documents, stay updated with announcements, and connect with your local government.
                Register now to request documents and file reports online.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/login?portal=resident">
                  <Button size="lg" className="w-full sm:w-auto gap-2">
                    Resident Portal <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/login?portal=official">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                    Official Portal <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Officials Section */}
        <section id="officials" className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <Badge variant="outline" className="mb-4">
                <Users className="w-3 h-3 mr-1" /> Barangay Council
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold">Our Barangay Officials</h2>
              <p className="text-muted-foreground mt-2">Meet the dedicated public servants of Barangay Santiago</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
              {mockOfficials.map((official) => (
                <Card key={official.id} className="text-center hover:shadow-md transition-shadow">
                  <CardContent className="pt-6 pb-4">
                    <Avatar className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 bg-primary/10">
                      <AvatarFallback className="text-lg md:text-xl font-semibold text-primary">
                        {official.fullName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-sm md:text-base line-clamp-2">{official.fullName}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1">{official.position}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Announcements Section */}
        <section id="announcements" className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <Badge variant="outline" className="mb-4">
                <Megaphone className="w-3 h-3 mr-1" /> News & Updates
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold">Announcements</h2>
              <p className="text-muted-foreground mt-2">Stay informed about community events and notices</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {mockAnnouncements.map((announcement) => (
                <Card 
                  key={announcement.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedAnnouncement(announcement)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">{announcement.category}</Badge>
                    </div>
                    <CardTitle className="text-base md:text-lg line-clamp-2">{announcement.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-3">{announcement.body}</p>
                    {announcement.scheduledDate && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{format(new Date(announcement.scheduledDate), 'MMM d, yyyy')}</span>
                        {announcement.scheduledTime && <span>at {announcement.scheduledTime}</span>}
                      </div>
                    )}
                    {announcement.venue && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>{announcement.venue}</span>
                      </div>
                    )}
                    <Button variant="ghost" size="sm" className="w-full mt-2 text-xs">
                      <Eye className="w-3 h-3 mr-1" /> View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Ordinances Section */}
        <section id="ordinances" className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <Badge variant="outline" className="mb-4">
                <Scale className="w-3 h-3 mr-1" /> Local Legislation
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold">Barangay Ordinances</h2>
              <p className="text-muted-foreground mt-2">Local laws and regulations for our community</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
              {mockOrdinances.map((ordinance) => (
                <Card 
                  key={ordinance.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedOrdinance(ordinance)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <Badge variant="outline">Ordinance No. {ordinance.ordinanceNumber}</Badge>
                      <Badge variant={ordinance.status === 'enacted' ? 'default' : 'secondary'}>
                        {ordinance.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-base md:text-lg mt-2">{ordinance.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{ordinance.purpose}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Enacted: {format(new Date(ordinance.enactedDate), 'MMM d, yyyy')}
                      </span>
                      <Button variant="ghost" size="sm" className="text-xs">
                        <Eye className="w-3 h-3 mr-1" /> View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Documents Section (View Only - No Download) */}
        <section id="documents" className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <Badge variant="outline" className="mb-4">
                <FileText className="w-3 h-3 mr-1" /> Available Services
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold">Barangay Documents</h2>
              <p className="text-muted-foreground mt-2">
                View available documents. Sign in to request and download.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
              {mockDocumentTypes.map((doc) => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base">{doc.name}</CardTitle>
                        <Badge variant="outline" className="text-xs mt-1">{doc.category}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{doc.description}</p>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm font-medium">
                        {doc.fee > 0 ? `₱${doc.fee}.00` : 'Free'}
                      </span>
                      <Badge variant={doc.available ? 'default' : 'secondary'}>
                        {doc.available ? 'Available' : 'Unavailable'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <p className="text-muted-foreground mb-4">
                Want to request documents? Register or sign in to access our services.
              </p>
              <Link href="/login?portal=resident">
                <Button size="lg" className="gap-2">
                  Sign In to Request <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Contact Us</h3>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">(047) 123-4567</span>
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">barangay.santiago@sanantonio.gov.ph</span>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Office Hours</h3>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Monday - Friday: 8:00 AM - 5:00 PM</span>
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Saturday: 8:00 AM - 12:00 PM</span>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Address</h3>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Barangay Santiago, San Antonio, Zambales</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Barangay Santiago, San Antonio, Zambales. All rights reserved.</p>
        </div>
      </footer>

      {/* Ordinance Dialog */}
      <Dialog open={!!selectedOrdinance} onOpenChange={() => setSelectedOrdinance(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">Ordinance No. {selectedOrdinance?.ordinanceNumber}</Badge>
              <Badge>{selectedOrdinance?.status}</Badge>
            </div>
            <DialogTitle>{selectedOrdinance?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-1">Purpose</h4>
              <p className="text-sm">{selectedOrdinance?.purpose}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-1">Content</h4>
              <p className="text-sm whitespace-pre-wrap">{selectedOrdinance?.body}</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t">
              <span>Series of {selectedOrdinance?.seriesYear}</span>
              <span>Enacted: {selectedOrdinance && format(new Date(selectedOrdinance.enactedDate), 'MMMM d, yyyy')}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Announcement Dialog */}
      <Dialog open={!!selectedAnnouncement} onOpenChange={() => setSelectedAnnouncement(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <Badge variant="secondary" className="w-fit mb-2">{selectedAnnouncement?.category}</Badge>
            <DialogTitle>{selectedAnnouncement?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm">{selectedAnnouncement?.body}</p>
            {(selectedAnnouncement?.scheduledDate || selectedAnnouncement?.venue) && (
              <div className="space-y-2 pt-4 border-t">
                {selectedAnnouncement.scheduledDate && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {format(new Date(selectedAnnouncement.scheduledDate), 'MMMM d, yyyy')}
                      {selectedAnnouncement.scheduledTime && ` at ${selectedAnnouncement.scheduledTime}`}
                    </span>
                  </div>
                )}
                {selectedAnnouncement.venue && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedAnnouncement.venue}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
