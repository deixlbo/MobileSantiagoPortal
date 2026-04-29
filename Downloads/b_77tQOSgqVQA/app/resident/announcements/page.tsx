"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Eye, Printer, Megaphone, Calendar, MapPin, Clock } from "lucide-react"

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
    <Badge className={`${colors[category] || "bg-gray-100 text-gray-700"} hover:${colors[category]}`}>
      {category}
    </Badge>
  )
}

export default function AnnouncementsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<typeof mockAnnouncements[0] | null>(null)

  const filteredAnnouncements = mockAnnouncements.filter(ann => 
    ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ann.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Announcements</h1>
        <p className="text-muted-foreground">Stay updated with the latest barangay news and events</p>
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
      <div className="space-y-4">
        {filteredAnnouncements.map((announcement) => (
          <Card key={announcement.id} className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                {getCategoryBadge(announcement.category)}
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Posted: {announcement.date}
                </span>
              </div>
              <CardTitle className="text-lg">{announcement.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {announcement.content}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {announcement.eventDate && (
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
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
              <Button 
                variant="outline"
                onClick={() => setSelectedAnnouncement(announcement)}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Button>
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
              <div className="rounded-lg border bg-white p-8 text-black print:border-0 print:p-0">
                {/* Header */}
                <div className="text-center space-y-1 mb-6">
                  <p className="text-sm">Republic of the Philippines</p>
                  <p className="text-sm">Province of Zambales</p>
                  <p className="text-sm">Municipality of San Antonio</p>
                  <p className="text-sm font-semibold">Barangay Santiago</p>
                </div>

                <div className="border-t border-b border-black py-4 my-6">
                  <h2 className="text-center font-bold">BARANGAY ANNOUNCEMENT</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600 text-sm">Title:</p>
                    <p className="font-bold text-lg">{selectedAnnouncement.title}</p>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm">Date Posted:</p>
                    <p className="font-medium">{selectedAnnouncement.date}</p>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-gray-600 text-sm">DETAILS</p>
                    <p className="mt-2 text-justify leading-relaxed">{selectedAnnouncement.content}</p>
                  </div>

                  {selectedAnnouncement.eventDate && (
                    <div className="border-t pt-4">
                      <p className="text-gray-600 text-sm">EVENT INFORMATION</p>
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
                <div className="mt-12 text-center">
                  <p className="text-sm text-gray-600">Issued by:</p>
                  <p className="font-semibold mt-2">Barangay Office</p>
                  <p className="text-sm">Barangay Santiago, San Antonio, Zambales</p>
                </div>
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedAnnouncement(null)}>Close</Button>
            <Button onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
