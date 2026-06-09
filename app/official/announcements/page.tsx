"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { printElementById } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Megaphone, Edit, Trash2, Eye, Send, Calendar, AlertCircle, Info, CheckCircle2, Printer, Loader2 } from "lucide-react"

type AnnouncementPriority = "urgent" | "important" | "normal"
type AnnouncementStatus = "draft" | "published" | "archived"

interface Announcement {
  id: string
  title: string
  content: string
  priority: AnnouncementPriority
  status: AnnouncementStatus
  category: string
  publish_date: string
  expiry_date: string
  author: string
  views: number
  created_at?: string
}

const priorityConfig: Record<AnnouncementPriority, { label: string; variant: "destructive" | "default" | "secondary"; icon: typeof AlertCircle }> = {
  urgent: { label: "Urgent", variant: "destructive", icon: AlertCircle },
  important: { label: "Important", variant: "default", icon: Info },
  normal: { label: "Normal", variant: "secondary", icon: CheckCircle2 },
}

const statusConfig: Record<AnnouncementStatus, { label: string; variant: "default" | "secondary" | "outline" }> = {
  draft: { label: "Draft", variant: "outline" },
  published: { label: "Published", variant: "default" },
  archived: { label: "Archived", variant: "secondary" },
}

const categories = ["Events", "Utilities", "Health", "Governance", "Social Services", "Safety", "Education", "Environment"]

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [showPrintPreview, setShowPrintPreview] = useState(false)

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    priority: "normal" as AnnouncementPriority,
    category: "Events",
    publishDate: "",
    expiryDate: "",
  })

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  async function fetchAnnouncements() {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setAnnouncements(data || [])
    } catch (error) {
      const dumpError = (e: any) => {
        try { return JSON.stringify(e, Object.getOwnPropertyNames(e), 2) } catch { return String(e) }
      }
      console.error('Error fetching announcements:', error, dumpError(error))
      toast.error(`Failed to load announcements: ${dumpError(error)}`)
    } finally {
      setLoading(false)
    }
  }

  const filteredAnnouncements = announcements.filter((ann) => {
    const matchesSearch =
      ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ann.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = priorityFilter === "all" || ann.priority === priorityFilter
    const matchesStatus = statusFilter === "all" || ann.status === statusFilter
    return matchesSearch && matchesPriority && matchesStatus
  })

  const handleAddAnnouncement = async (asDraft: boolean) => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .insert([{
          title: newAnnouncement.title,
          content: newAnnouncement.content,
          priority: newAnnouncement.priority,
          status: asDraft ? "draft" : "published",
          category: newAnnouncement.category,
          publish_date: newAnnouncement.publishDate || new Date().toISOString().split("T")[0],
          expiry_date: newAnnouncement.expiryDate || null,
          author: "Current Official",
          views: 0,
        }])
        .select()
        .single()

      if (error) throw error

      setAnnouncements([data, ...announcements])
      setNewAnnouncement({
        title: "",
        content: "",
        priority: "normal",
        category: "Events",
        publishDate: "",
        expiryDate: "",
      })
      setIsAddDialogOpen(false)
      toast.success(asDraft ? 'Draft saved' : 'Announcement published')
    } catch (error) {
      console.error('Error creating announcement:', error)
      toast.error('Failed to create announcement')
    }
  }

  const handlePublish = async (id: string) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .update({ status: 'published' })
        .eq('id', id)

      if (error) throw error

      setAnnouncements(
        announcements.map((ann) =>
          ann.id === id ? { ...ann, status: "published" as AnnouncementStatus } : ann
        )
      )
      toast.success('Announcement published')
    } catch (error) {
      toast.error('Failed to publish')
    }
  }

  const handleArchive = async (id: string) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .update({ status: 'archived' })
        .eq('id', id)

      if (error) throw error

      setAnnouncements(
        announcements.map((ann) =>
          ann.id === id ? { ...ann, status: "archived" as AnnouncementStatus } : ann
        )
      )
      toast.success('Announcement archived')
    } catch (error) {
      toast.error('Failed to archive')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id)

      if (error) throw error

      setAnnouncements(announcements.filter((ann) => ann.id !== id))
      toast.success('Announcement deleted')
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  const requestDeleteAnnouncement = (id: string) => {
    setConfirmDeleteId(id)
    setIsConfirmOpen(true)
  }

  const confirmDeleteAnnouncement = () => {
    if (!confirmDeleteId) return
    setAnnouncements((s) => s.filter((a) => a.id !== confirmDeleteId))
    setConfirmDeleteId(null)
    setIsConfirmOpen(false)
  }

  const handleEditAnnouncement = (announcement: Announcement) => {
    setEditingAnnouncement(announcement)
    setNewAnnouncement({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
      category: announcement.category,
      publishDate: announcement.publishDate,
      expiryDate: announcement.expiryDate,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateAnnouncement = () => {
    if (!editingAnnouncement) return
    const updated: Announcement = {
      ...editingAnnouncement,
      ...newAnnouncement,
    }
    setAnnouncements(announcements.map(a => a.id === editingAnnouncement.id ? updated : a))
    setIsEditDialogOpen(false)
    setEditingAnnouncement(null)
    setNewAnnouncement({
      title: "",
      content: "",
      priority: "normal",
      category: "Events",
      publishDate: "",
      expiryDate: "",
    })
  }

  const publishedCount = announcements.filter((a) => a.status === "published").length
  const draftCount = announcements.filter((a) => a.status === "draft").length
  const urgentCount = announcements.filter((a) => a.priority === "urgent" && a.status === "published").length
  const totalViews = announcements.reduce((sum, a) => sum + a.views, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Announcements</h1>
          <p className="text-muted-foreground">Create and manage barangay announcements</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Announcement</DialogTitle>
              <DialogDescription>Create a new announcement for barangay residents</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  placeholder="Enter announcement title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  placeholder="Write your announcement here..."
                  rows={5}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newAnnouncement.priority}
                    onValueChange={(v) => setNewAnnouncement({ ...newAnnouncement, priority: v as AnnouncementPriority })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(priorityConfig).map(([value, config]) => (
                        <SelectItem key={value} value={value}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newAnnouncement.category}
                    onValueChange={(v) => setNewAnnouncement({ ...newAnnouncement, category: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="publishDate">Publish Date</Label>
                  <Input
                    id="publishDate"
                    type="date"
                    value={newAnnouncement.publishDate}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, publishDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={newAnnouncement.expiryDate}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, expiryDate: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="secondary" onClick={() => handleAddAnnouncement(true)} disabled={!newAnnouncement.title}>
                Save as Draft
              </Button>
              <Button onClick={() => handleAddAnnouncement(false)} disabled={!newAnnouncement.title || !newAnnouncement.content}>
                <Send className="mr-2 h-4 w-4" />
                Publish
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Published</CardDescription>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Megaphone className="h-5 w-5 text-primary" />
              {publishedCount}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Drafts</CardDescription>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Edit className="h-5 w-5 text-muted-foreground" />
              {draftCount}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Urgent Active</CardDescription>
            <CardTitle className="flex items-center gap-2 text-2xl text-red-600">
              <AlertCircle className="h-5 w-5" />
              {urgentCount}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Views</CardDescription>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Eye className="h-5 w-5 text-muted-foreground" />
              {totalViews.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                {Object.entries(priorityConfig).map(([value, config]) => (
                  <SelectItem key={value} value={value}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {Object.entries(statusConfig).map(([value, config]) => (
                  <SelectItem key={value} value={value}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Announcements Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredAnnouncements.map((announcement) => {
          const priorityInfo = priorityConfig[announcement.priority]
          const PriorityIcon = priorityInfo.icon
          return (
            <Card key={announcement.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge variant={priorityInfo.variant} className="gap-1">
                        <PriorityIcon className="h-3 w-3" />
                        {priorityInfo.label}
                      </Badge>
                      <Badge variant={statusConfig[announcement.status].variant}>
                        {statusConfig[announcement.status].label}
                      </Badge>
                      <Badge variant="outline">{announcement.category}</Badge>
                    </div>
                    <CardTitle className="text-lg">{announcement.title}</CardTitle>
                    <CardDescription className="mt-1">
                      By {announcement.author} | {announcement.views} views
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedAnnouncement(announcement)
                          setIsViewDialogOpen(true)
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditAnnouncement(announcement)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      {announcement.status === "draft" && (
                        <DropdownMenuItem onClick={() => handlePublish(announcement.id)}>
                          <Send className="mr-2 h-4 w-4" />
                          Publish
                        </DropdownMenuItem>
                      )}
                      {announcement.status === "published" && (
                        <DropdownMenuItem onClick={() => handleArchive(announcement.id)}>
                          <Calendar className="mr-2 h-4 w-4" />
                          Archive
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => requestDeleteAnnouncement(announcement.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="line-clamp-3 text-sm text-muted-foreground">{announcement.content}</p>
              </CardContent>
              <CardContent className="border-t pt-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Published: {new Date(announcement.publishDate).toLocaleDateString()}</span>
                  {announcement.expiryDate && (
                    <span>Expires: {new Date(announcement.expiryDate).toLocaleDateString()}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* View Announcement Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Announcement Details</DialogTitle>
          </DialogHeader>
          {selectedAnnouncement && (
            <div className="space-y-4 py-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant={priorityConfig[selectedAnnouncement.priority].variant}>
                  {priorityConfig[selectedAnnouncement.priority].label}
                </Badge>
                <Badge variant={statusConfig[selectedAnnouncement.status].variant}>
                  {statusConfig[selectedAnnouncement.status].label}
                </Badge>
                <Badge variant="outline">{selectedAnnouncement.category}</Badge>
              </div>
              <div>
                <h3 className="text-xl font-semibold">{selectedAnnouncement.title}</h3>
                <p className="text-sm text-muted-foreground">
                  By {selectedAnnouncement.author} | {selectedAnnouncement.views} views
                </p>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <p className="whitespace-pre-wrap">{selectedAnnouncement.content}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Published</p>
                  <p className="font-medium">
                    {new Date(selectedAnnouncement.publishDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Expires</p>
                  <p className="font-medium">
                    {selectedAnnouncement.expiryDate
                      ? new Date(selectedAnnouncement.expiryDate).toLocaleDateString()
                      : "No expiry"}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            <Button onClick={() => {
              setShowPrintPreview(true)
              setIsViewDialogOpen(false)
            }}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Announcement Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
            <DialogDescription>Update the announcement details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                placeholder="Enter announcement title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                value={newAnnouncement.content}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                placeholder="Write your announcement here..."
                rows={5}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-priority">Priority</Label>
                <Select
                  value={newAnnouncement.priority}
                  onValueChange={(v) => setNewAnnouncement({ ...newAnnouncement, priority: v as AnnouncementPriority })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(priorityConfig).map(([value, config]) => (
                      <SelectItem key={value} value={value}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={newAnnouncement.category}
                  onValueChange={(v) => setNewAnnouncement({ ...newAnnouncement, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-publishDate">Publish Date</Label>
                <Input
                  id="edit-publishDate"
                  type="date"
                  value={newAnnouncement.publishDate}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, publishDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-expiryDate">Expiry Date</Label>
                <Input
                  id="edit-expiryDate"
                  type="date"
                  value={newAnnouncement.expiryDate}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, expiryDate: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false)
              setEditingAnnouncement(null)
              setNewAnnouncement({
                title: "",
                content: "",
                priority: "normal",
                category: "Events",
                publishDate: "",
                expiryDate: "",
              })
            }}>
              Cancel
            </Button>
            <Button onClick={handleUpdateAnnouncement} disabled={!newAnnouncement.title || !newAnnouncement.content}>
              Update Announcement
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Print Preview Dialog */}
      <Dialog open={showPrintPreview} onOpenChange={setShowPrintPreview}>
        <DialogContent className="w-[95vw] sm:w-auto max-h-[95vh] overflow-auto max-w-2xl">
          <DialogHeader>
            <DialogTitle>Announcement Print Preview</DialogTitle>
          </DialogHeader>
          {selectedAnnouncement && (
            <ScrollArea className="max-h-[60vh]">
              <div id="announcement-print" className="rounded-3xl border-4 border-black bg-white p-6 md:p-8 shadow-xl">
                <div className="flex items-center justify-between mb-4 pb-4 border-b">
                  <Image src="/logos/santiago-logo.png" alt="Barangay Santiago" width={60} height={60} className="w-12 h-12 md:w-16 md:h-16 object-cover" />
                  <div className="text-center flex-1 px-2">
                    <p className="text-xs">Republic of the Philippines</p>
                    <p className="text-xs">Province of Zambales</p>
                    <p className="text-xs">Municipality of San Antonio</p>
                    <p className="text-sm font-semibold">Barangay Santiago</p>
                  </div>
                  <Image src="/logos/saz-logo.png" alt="Municipality" width={60} height={60} className="w-12 h-12 md:w-16 md:h-16 object-cover" />
                </div>

                {/* Title */}
                <div className="border-b py-4 mb-4">
                  <h2 className="text-center font-bold text-lg mb-2">ANNOUNCEMENT</h2>
                  <h3 className="text-center font-semibold text-base">{selectedAnnouncement.title}</h3>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="text-muted-foreground font-medium">Priority:</p>
                      <p>{priorityConfig[selectedAnnouncement.priority].label}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-medium">Category:</p>
                      <p>{selectedAnnouncement.category}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-medium">Status:</p>
                      <p>{statusConfig[selectedAnnouncement.status].label}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-muted-foreground font-medium mb-2">Content:</p>
                    <div className="bg-gray-50 p-4 rounded whitespace-pre-wrap text-sm">
                      {selectedAnnouncement.content}
                    </div>
                  </div>

                  <div className="border-t pt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground font-medium">Published:</p>
                      <p>{new Date(selectedAnnouncement.publishDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-medium">Expires:</p>
                      <p>{selectedAnnouncement.expiryDate ? new Date(selectedAnnouncement.expiryDate).toLocaleDateString() : "No expiry"}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground font-medium">Author:</p>
                      <p>{selectedAnnouncement.author}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4 text-center text-xs text-muted-foreground">
                    <p>Views: {selectedAnnouncement.views}</p>
                    <p>Printed: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPrintPreview(false)}>Close</Button>
            <Button onClick={() => printElementById('announcement-print')}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>This action will permanently delete the announcement. Are you sure?</DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <p className="text-sm">{confirmDeleteId ? `Delete announcement ${confirmDeleteId}? This cannot be undone.` : "Delete selected announcement?"}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteAnnouncement}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
