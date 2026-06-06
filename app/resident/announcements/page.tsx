"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DocumentHeader } from "@/components/document-header"
import { Search, Megaphone, Calendar, MapPin, Clock } from "lucide-react"

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
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any | null>(null)

  const filteredAnnouncements = announcements.filter(ann => 
    ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ann.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
              <div className="rounded-lg border bg-white p-4 sm:p-8 text-black">
                <DocumentHeader title="BARANGAY ANNOUNCEMENT" />

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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
