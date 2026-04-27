"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Megaphone, Plus, Edit2, Trash2, Calendar, MapPin, Eye, EyeOff, Loader2 } from "lucide-react"
import { mockAnnouncements } from "@/lib/mock-data"

const categories = ["General", "Event", "Health", "Meeting", "Announcement", "Emergency"]

export default function AdminAnnouncements() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [localAnnouncements, setLocalAnnouncements] = useState(mockAnnouncements)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [category, setCategory] = useState("")
  const [scheduledDate, setScheduledDate] = useState("")
  const [scheduledTime, setScheduledTime] = useState("")
  const [venue, setVenue] = useState("")
  const [published, setPublished] = useState(true)

  const resetForm = () => {
    setTitle("")
    setBody("")
    setCategory("")
    setScheduledDate("")
    setScheduledTime("")
    setVenue("")
    setPublished(true)
    setEditingId(null)
  }

  const handleEdit = (announcement: typeof mockAnnouncements[0]) => {
    setTitle(announcement.title)
    setBody(announcement.body)
    setCategory(announcement.category)
    setScheduledDate(announcement.scheduledDate || "")
    setScheduledTime(announcement.scheduledTime || "")
    setVenue(announcement.venue || "")
    setPublished(announcement.published)
    setEditingId(announcement.id)
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 500))

    if (editingId) {
      setLocalAnnouncements(prev => prev.map(a =>
        a.id === editingId
          ? { ...a, title, body, category, scheduledDate, scheduledTime, venue, published }
          : a
      ))
    } else {
      const newAnnouncement = {
        id: `${Date.now()}`,
        title,
        body,
        category,
        scheduledDate,
        scheduledTime,
        venue,
        published,
        createdAt: new Date().toISOString()
      }
      setLocalAnnouncements(prev => [newAnnouncement, ...prev])
    }

    setIsDialogOpen(false)
    resetForm()
    setIsSubmitting(false)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      setLocalAnnouncements(prev => prev.filter(a => a.id !== id))
    }
  }

  const togglePublish = (id: string) => {
    setLocalAnnouncements(prev => prev.map(a =>
      a.id === id ? { ...a, published: !a.published } : a
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Announcements</h1>
          <p className="text-muted-foreground">Broadcast news and events to residents</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Announcement" : "Create Announcement"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Update the announcement details" : "Fill out the form to create a new announcement"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Announcement title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="body">Content</Label>
                <Textarea
                  id="body"
                  placeholder="Write your announcement..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={4}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Event Date (Optional)</Label>
                  <Input
                    id="date"
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Event Time (Optional)</Label>
                  <Input
                    id="time"
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="venue">Venue (Optional)</Label>
                <Input
                  id="venue"
                  placeholder="Event location"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Publish immediately</Label>
                  <p className="text-xs text-muted-foreground">Make visible on the landing page</p>
                </div>
                <Switch checked={published} onCheckedChange={setPublished} />
              </div>
              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={() => {
                  setIsDialogOpen(false)
                  resetForm()
                }}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || !title || !body || !category}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {editingId ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    editingId ? "Update" : "Create"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold">{localAnnouncements.length}</div>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-green-600">
              {localAnnouncements.filter(a => a.published).length}
            </div>
            <p className="text-xs text-muted-foreground">Published</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-amber-600">
              {localAnnouncements.filter(a => !a.published).length}
            </div>
            <p className="text-xs text-muted-foreground">Draft</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-blue-600">
              {localAnnouncements.filter(a => a.category === 'Event').length}
            </div>
            <p className="text-xs text-muted-foreground">Events</p>
          </CardContent>
        </Card>
      </div>

      {/* Announcements Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {localAnnouncements.map((announcement) => (
          <Card key={announcement.id} className={!announcement.published ? "opacity-60" : ""}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <Badge variant={announcement.published ? "secondary" : "outline"}>
                  {announcement.category}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => togglePublish(announcement.id)}
                >
                  {announcement.published ? (
                    <Eye className="w-4 h-4 text-green-600" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              <CardTitle className="text-base line-clamp-2">{announcement.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-3">{announcement.body}</p>
              {announcement.scheduledDate && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(announcement.scheduledDate), 'MMM d, yyyy')}
                  {announcement.scheduledTime && ` at ${announcement.scheduledTime}`}
                </div>
              )}
              {announcement.venue && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {announcement.venue}
                </div>
              )}
              <div className="flex items-center gap-2 pt-3 border-t">
                <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => handleEdit(announcement)}>
                  <Edit2 className="w-3 h-3" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDelete(announcement.id)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {localAnnouncements.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Megaphone className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="font-semibold mb-1">No announcements yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first announcement to inform residents
            </p>
            <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Create Announcement
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
