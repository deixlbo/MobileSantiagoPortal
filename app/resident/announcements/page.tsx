"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DocumentHeader } from "@/components/document-header"
import { Search, Printer, Megaphone, Calendar, MapPin, Clock } from "lucide-react"

const mockAnnouncements = [
  {
    id: "ANN-2026-001",
    title: "Community Clean-up Drive",
    date: "April 25, 2026",
    content: "Join us for a community-wide clean-up drive this Saturday. All residents are encouraged to participate in maintaining the cleanliness of our barangay. Together, we can create a cleaner and healthier environment for everyone.",
    eventDate: "April 27, 2026",
    eventTime: "7:00 AM - 12:00 PM",
    venue: "Starting point: Barangay Hall",
    category: "Event"
  },
  {
    id: "ANN-2026-002",
    title: "Free Medical Check-up",
    date: "April 28, 2026",
    content: "The barangay health center, in partnership with the Municipal Health Office, will be conducting a free medical check-up for all residents. Services include blood pressure monitoring, blood sugar testing, and general consultation. Please bring your Barangay ID.",
    eventDate: "May 5, 2026",
    eventTime: "8:00 AM - 4:00 PM",
    venue: "Barangay Health Center",
    category: "Health"
  },
  {
    id: "ANN-2026-003",
    title: "Barangay Assembly Meeting",
    date: "April 20, 2026",
    content: "All residents are invited to attend the quarterly Barangay Assembly. This is an opportunity to hear updates on barangay projects, ordinances, and financial reports. Your participation is important in shaping our community.",
    eventDate: "May 1, 2026",
    eventTime: "2:00 PM - 5:00 PM",
    venue: "Barangay Multipurpose Hall",
    category: "Meeting"
  },
  {
    id: "ANN-2026-004",
    title: "Water Service Interruption Notice",
    date: "April 22, 2026",
    content: "Please be advised that there will be a scheduled water service interruption on April 30, 2026, from 8:00 AM to 6:00 PM due to pipeline maintenance works in Purok 2 and Purok 3. Residents are advised to store enough water for their daily needs.",
    eventDate: "April 30, 2026",
    eventTime: "8:00 AM - 6:00 PM",
    venue: "Purok 2 and Purok 3",
    category: "Advisory"
  },
  {
    id: "ANN-2026-005",
    title: "Scholarship Program Application",
    date: "April 15, 2026",
    content: "The barangay is now accepting applications for the Educational Assistance Program for the upcoming school year. Qualified applicants must be bona fide residents of Barangay Santiago and must submit the required documents. Deadline of submission is on May 15, 2026.",
    eventDate: null,
    eventTime: null,
    venue: "Submit at Barangay Hall",
    category: "Program"
  },
]

function getCategoryBadge(category: string) {
  const colors: Record<string, string> = {
    Event: "bg-blue-100 text-blue-700",
    Health: "bg-emerald-100 text-emerald-700",
    Meeting: "bg-amber-100 text-amber-700",
    Advisory: "bg-red-100 text-red-700",
    Program: "bg-purple-100 text-purple-700",
  }
  return (
    <Badge className={`${colors[category] || "bg-gray-100 text-gray-700"} text-xs`}>
      {category}
    </Badge>
  )
}

export default function AnnouncementsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<typeof mockAnnouncements[0] | null>(null)
  const printRef = useRef<HTMLDivElement>(null)

  const filteredAnnouncements = mockAnnouncements.filter(ann => 
    ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ann.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handlePrint = () => {
    if (!selectedAnnouncement) return
    
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Announcement - ${selectedAnnouncement.title}</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
              .header { text-align: center; margin-bottom: 24px; }
              .header-row { display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 16px; }
              .logo { width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 2px solid #e5e5e5; }
              .header-text { text-align: center; }
              .header-text p { margin: 2px 0; font-size: 12px; }
              .header-text .bold { font-weight: 600; }
              .title-bar { border-top: 1px solid black; border-bottom: 1px solid black; padding: 12px; margin: 24px 0; text-align: center; font-weight: bold; font-size: 14px; }
              .content { font-size: 13px; line-height: 1.6; }
              .label { color: #666; margin-bottom: 4px; }
              .value { font-weight: 500; margin-bottom: 16px; }
              .section { margin-top: 20px; padding-top: 16px; border-top: 1px solid #e5e5e5; }
              .section-title { color: #666; font-size: 12px; margin-bottom: 8px; }
              .event-info { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-size: 13px; }
              .footer { margin-top: 48px; text-align: center; font-size: 12px; }
              .footer .name { font-weight: 600; margin-top: 8px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="header-row">
                <img src="/images/santiagologo.jpg" alt="Barangay Santiago" class="logo" />
                <div class="header-text">
                  <p>Republic of the Philippines</p>
                  <p>Province of Zambales</p>
                  <p>Municipality of San Antonio</p>
                  <p class="bold">Barangay Santiago</p>
                </div>
                <img src="/images/saz.jpg" alt="Municipal Seal" class="logo" />
              </div>
            </div>
            
            <div class="title-bar">BARANGAY ANNOUNCEMENT</div>
            
            <div class="content">
              <p class="label">Title:</p>
              <p class="value" style="font-size: 16px; font-weight: bold;">${selectedAnnouncement.title}</p>
              
              <p class="label">Date Posted:</p>
              <p class="value">${selectedAnnouncement.date}</p>
              
              <div class="section">
                <p class="section-title">DETAILS</p>
                <p style="text-align: justify;">${selectedAnnouncement.content}</p>
              </div>
              
              ${selectedAnnouncement.eventDate ? `
              <div class="section">
                <p class="section-title">EVENT INFORMATION</p>
                <div class="event-info">Date: ${selectedAnnouncement.eventDate}</div>
                ${selectedAnnouncement.eventTime ? `<div class="event-info">Time: ${selectedAnnouncement.eventTime}</div>` : ''}
                <div class="event-info">Venue: ${selectedAnnouncement.venue}</div>
              </div>
              ` : ''}
            </div>
            
            <div class="footer">
              <p>Issued by:</p>
              <p class="name">Barangay Office</p>
              <p>Barangay Santiago, San Antonio, Zambales</p>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      
      // Wait for images to load before printing
      setTimeout(() => {
        printWindow.print()
      }, 500)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Announcements</h1>
        <p className="text-sm text-muted-foreground">Stay updated with the latest barangay news and events</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Search announcements..." 
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Announcements List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredAnnouncements.map((announcement) => (
          <Card 
            key={announcement.id} 
            className="transition-all hover:shadow-lg cursor-pointer hover:border-primary"
            onClick={() => setSelectedAnnouncement(announcement)}
          >
            <CardHeader className="pb-2 sm:pb-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                {getCategoryBadge(announcement.category)}
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Posted: {announcement.date}
                </span>
              </div>
              <CardTitle className="text-sm sm:text-lg">{announcement.title}</CardTitle>
              <CardDescription className="line-clamp-2 text-xs sm:text-sm">
                {announcement.content}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {announcement.eventDate && (
                <div className="flex flex-wrap gap-2 sm:gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {announcement.eventDate}
                  </span>
                  {announcement.eventTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {announcement.eventTime}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {announcement.venue}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAnnouncements.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Megaphone className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No announcements found</h3>
          <p className="text-muted-foreground">Try adjusting your search term</p>
        </div>
      )}

      {/* Announcement Preview Modal */}
      <Dialog open={!!selectedAnnouncement} onOpenChange={() => setSelectedAnnouncement(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Announcement</DialogTitle>
          </DialogHeader>
          {selectedAnnouncement && (
            <ScrollArea className="max-h-[70vh]">
              <div ref={printRef} className="rounded-lg border bg-white p-4 sm:p-8 text-black print:border-0 print:p-0">
                <DocumentHeader title="BARANGAY ANNOUNCEMENT" printOnly />

                <div className="space-y-4 text-xs sm:text-sm">
                  <div>
                    <p className="text-gray-600">Title:</p>
                    <p className="font-bold text-base sm:text-lg">{selectedAnnouncement.title}</p>
                  </div>

                  <div>
                    <p className="text-gray-600">Date Posted:</p>
                    <p className="font-medium">{selectedAnnouncement.date}</p>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-gray-600">DETAILS</p>
                    <p className="mt-2 text-justify leading-relaxed">{selectedAnnouncement.content}</p>
                  </div>

                  {selectedAnnouncement.eventDate && (
                    <div className="border-t pt-4">
                      <p className="text-gray-600">EVENT INFORMATION</p>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>Date: {selectedAnnouncement.eventDate}</span>
                        </div>
                        {selectedAnnouncement.eventTime && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span>Time: {selectedAnnouncement.eventTime}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>Venue: {selectedAnnouncement.venue}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-8 sm:mt-12 text-center text-xs sm:text-sm">
                  <p className="text-gray-600">Issued by:</p>
                  <p className="font-semibold mt-2">Barangay Office</p>
                  <p>Barangay Santiago, San Antonio, Zambales</p>
                </div>
              </div>
            </ScrollArea>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setSelectedAnnouncement(null)} className="w-full sm:w-auto">
              Close
            </Button>
            <Button onClick={handlePrint} className="w-full sm:w-auto">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
