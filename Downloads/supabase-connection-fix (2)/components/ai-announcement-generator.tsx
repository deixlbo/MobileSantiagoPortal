"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Loader2, Sparkles, Edit2, Trash2, Send, MessageCircle } from "lucide-react"

interface Announcement {
  id: string
  title: string
  content: string
  category: string
  generatedBy: "human" | "ai"
  status: "draft" | "scheduled" | "published"
  scheduledDate?: string
  views?: number
  engagement?: number
  createdDate: string
}

const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Barangay Hall Extended Hours",
    content: "The Barangay Hall will now be open on Saturdays from 8:00 AM to 12:00 PM to better serve residents.",
    category: "Administrative",
    generatedBy: "human",
    status: "published",
    views: 324,
    engagement: 48,
    createdDate: "2026-06-05"
  },
  {
    id: "2",
    title: "Community Clean-Up Drive - June 8",
    content: "All residents are invited to join us for our monthly clean-up drive at the barangay plaza.",
    category: "Community",
    generatedBy: "ai",
    status: "scheduled",
    scheduledDate: "2026-06-08",
    createdDate: "2026-06-04"
  }
]

export function AIAnnouncementGenerator() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements)
  const [topic, setTopic] = useState<string>("")
  const [category, setCategory] = useState<string>("")
  const [tone, setTone] = useState<"formal" | "casual" | "urgent">("formal")
  const [generatedContent, setGeneratedContent] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [announcementTitle, setAnnouncementTitle] = useState<string>("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)

  const handleGenerateAnnouncement = async () => {
    if (!topic || !category) return

    setIsGenerating(true)
    // Simulate AI generation delay
    setTimeout(() => {
      let content = ""
      const templates: Record<string, string> = {
        Administrative: `Dear Residents,\n\nWe are pleased to inform you about ${topic}. This initiative is part of our commitment to better serve the community.\n\nFor more information, please contact the Barangay Hall during office hours.\n\nThank you for your continued support.`,
        Community: `🎉 Community Update!\n\n${topic}\n\nWe invite all residents to participate and support this community effort. Together, we can make Barangay Santiago a better place.\n\nFor details, please reach out to us.`,
        Emergency: `⚠️ URGENT NOTICE\n\n${topic}\n\nAll residents are advised to take necessary precautions. Stay tuned for further updates.\n\nFor assistance, contact: (047) 123-4567`,
        Event: `📅 Mark Your Calendar!\n\n${topic}\n\nDon't miss out on this exciting event. Join your neighbors and friends.\n\nFor registration, visit our office or call us at (047) 123-4567`
      }

      content = templates[category] || templates.Administrative
      setGeneratedContent(content)
      setAnnouncementTitle(`${category}: ${topic}`)
    }, 2000)

    setIsGenerating(false)
  }

  const handlePublishAnnouncement = () => {
    if (!announcementTitle || !generatedContent || !category) return

    const newAnnouncement: Announcement = {
      id: String(announcements.length + 1),
      title: announcementTitle,
      content: generatedContent,
      category,
      generatedBy: "ai",
      status: "draft",
      createdDate: new Date().toISOString().split("T")[0]
    }

    setAnnouncements([newAnnouncement, ...announcements])
    setGeneratedContent("")
    setAnnouncementTitle("")
    setTopic("")
    setCategory("")
  }

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter(a => a.id !== id))
  }

  const filteredAnnouncements = filterStatus === "all"
    ? announcements
    : announcements.filter(a => a.status === filterStatus)

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Administrative: "bg-blue-100 text-blue-800",
      Community: "bg-green-100 text-green-800",
      Emergency: "bg-red-100 text-red-800",
      Event: "bg-purple-100 text-purple-800"
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Announcement Generator</h2>
          <p className="text-muted-foreground">Create and manage community announcements</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-lg">
              <Sparkles className="mr-2 h-4 w-4" /> Generate Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] sm:w-auto max-h-[95vh] overflow-auto max-w-2xl">
            <DialogHeader>
              <DialogTitle>Generate Announcement with AI</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="topic">Topic/Subject</Label>
                <Input
                  id="topic"
                  placeholder="e.g., New community health program, Road maintenance schedule"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="mt-2 rounded-lg"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="mt-2 rounded-lg">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Administrative">Administrative</SelectItem>
                      <SelectItem value="Community">Community</SelectItem>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                      <SelectItem value="Event">Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tone">Tone</Label>
                  <Select value={tone} onValueChange={(v) => setTone(v as "formal" | "casual" | "urgent")}>
                    <SelectTrigger className="mt-2 rounded-lg">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {!generatedContent ? (
                <Button
                  onClick={handleGenerateAnnouncement}
                  disabled={!topic || !category || isGenerating}
                  className="w-full rounded-lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" /> Generate Content
                    </>
                  )}
                </Button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={announcementTitle}
                      onChange={(e) => setAnnouncementTitle(e.target.value)}
                      className="mt-2 rounded-lg"
                    />
                  </div>

                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={generatedContent}
                      onChange={(e) => setGeneratedContent(e.target.value)}
                      className="mt-2 rounded-lg"
                      rows={6}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setGeneratedContent("")
                        setAnnouncementTitle("")
                      }}
                      className="rounded-lg flex-1"
                    >
                      Regenerate
                    </Button>
                    <Button onClick={handlePublishAnnouncement} className="rounded-lg flex-1">
                      Save as Draft
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {["all", "draft", "scheduled", "published"].map((status) => (
          <Button
            key={status}
            variant={filterStatus === status ? "default" : "outline"}
            onClick={() => setFilterStatus(status)}
            className="rounded-lg capitalize"
            size="sm"
          >
            {status}
          </Button>
        ))}
      </div>

      {/* Announcements List */}
      <div className="grid gap-4">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((announcement, index) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Dialog open={selectedAnnouncement?.id === announcement.id} onOpenChange={() => setSelectedAnnouncement(null)}>
                <DialogTrigger asChild>
                  <Card
                    className="cursor-pointer rounded-2xl border border-slate-200/70 transition-all hover:shadow-lg"
                    onClick={() => setSelectedAnnouncement(announcement)}
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            {announcement.generatedBy === "ai" && (
                              <Badge variant="secondary" className="text-xs">
                                <Sparkles className="mr-1 h-3 w-3" /> AI Generated
                              </Badge>
                            )}
                            <Badge className={`text-xs capitalize ${getCategoryColor(announcement.category)}`}>
                              {announcement.category}
                            </Badge>
                            <Badge
                              variant={
                                announcement.status === "published"
                                  ? "default"
                                  : announcement.status === "scheduled"
                                  ? "secondary"
                                  : "outline"
                              }
                              className="text-xs capitalize"
                            >
                              {announcement.status}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-foreground line-clamp-1">{announcement.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{announcement.content}</p>
                          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                            <span>{announcement.createdDate}</span>
                            {announcement.views && (
                              <div className="flex items-center gap-1">
                                <MessageCircle className="h-3 w-3" />
                                {announcement.views} views
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteAnnouncement(announcement.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>

                <DialogContent className="w-[95vw] sm:w-auto max-h-[95vh] overflow-auto max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{selectedAnnouncement?.title}</DialogTitle>
                  </DialogHeader>
                  {selectedAnnouncement && (
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {selectedAnnouncement.generatedBy === "ai" && (
                          <Badge variant="secondary" className="text-xs">
                            <Sparkles className="mr-1 h-3 w-3" /> AI Generated
                          </Badge>
                        )}
                        <Badge className={`text-xs capitalize ${getCategoryColor(selectedAnnouncement.category)}`}>
                          {selectedAnnouncement.category}
                        </Badge>
                        <Badge className="text-xs capitalize">{selectedAnnouncement.status}</Badge>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm mb-2">Content:</p>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{selectedAnnouncement.content}</p>
                      </div>
                      {selectedAnnouncement.views && (
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Views</p>
                            <p className="font-semibold text-lg">{selectedAnnouncement.views}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Engagement</p>
                            <p className="font-semibold text-lg">{selectedAnnouncement.engagement}</p>
                          </div>
                        </div>
                      )}
                      <Button className="w-full rounded-lg mt-4">
                        <Send className="mr-2 h-4 w-4" /> Publish
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </motion.div>
          ))
        ) : (
          <Card className="rounded-2xl border border-slate-200/70">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No announcements found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
