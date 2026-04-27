"use client"

import { useState, useMemo } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  Megaphone, Plus, Search, Calendar, MapPin, Eye, EyeOff,
  Edit2, Trash2, MoreVertical, Loader2, Upload, Clock, Check, X,
  ChevronLeft, ChevronRight, FileText, Send
} from "lucide-react"
import { mockAnnouncements } from "@/lib/mock-data"

const categories = ["Announcement", "Event", "Health", "Meeting", "Other"]
const categoryColors: Record<string, string> = {
  "Event": "bg-green-500",
  "Health": "bg-blue-500",
  "Meeting": "bg-purple-500",
  "Announcement": "bg-amber-500",
  "Other": "bg-gray-500"
}

type Announcement = typeof mockAnnouncements[0] & {
  coverImage?: string
  postedBy?: string
  dateCreated?: string
  lastUpdated?: string
}

export default function AdminAnnouncements() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [localAnnouncements, setLocalAnnouncements] = useState<Announcement[]>(
    mockAnnouncements.map(a => ({
      ...a,
      postedBy: 'Admin',
      dateCreated: a.createdAt,
      lastUpdated: a.createdAt
    }))
  )
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showPublishDialog, setShowPublishDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    category: '',
    scheduledDate: '',
    scheduledTime: '',
    venue: '',
    published: true,
    categoryColor: 'bg-green-500'
  })

  const filteredAnnouncements = useMemo(() => {
    return localAnnouncements
      .filter(a => typeFilter === "all" || a.category === typeFilter)
      .filter(a => {
        if (statusFilter === "all") return true
        if (statusFilter === "published") return a.published
        if (statusFilter === "draft") return !a.published
        return true
      })
      .filter(a =>
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.body.toLowerCase().includes(searchTerm.toLowerCase())
      )
  }, [localAnnouncements, typeFilter, statusFilter, searchTerm])

  const paginatedAnnouncements = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredAnnouncements.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredAnnouncements, currentPage])

  const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage)

  const stats = useMemo(() => ({
    total: localAnnouncements.length,
    published: localAnnouncements.filter(a => a.published).length,
    draft: localAnnouncements.filter(a => !a.published).length,
    events: localAnnouncements.filter(a => a.category === 'Event').length
  }), [localAnnouncements])

  const resetForm = () => {
    setFormData({
      title: '',
      body: '',
      category: '',
      scheduledDate: '',
      scheduledTime: '',
      venue: '',
      published: true,
      categoryColor: 'bg-green-500'
    })
  }

  const handleCreate = async () => {
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 500))

    const newAnnouncement: Announcement = {
      id: `${Date.now()}`,
      title: formData.title,
      body: formData.body,
      category: formData.category,
      scheduledDate: formData.scheduledDate,
      scheduledTime: formData.scheduledTime,
      venue: formData.venue,
      published: formData.published,
      createdAt: new Date().toISOString(),
      postedBy: 'Admin',
      dateCreated: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    }

    setLocalAnnouncements(prev => [newAnnouncement, ...prev])
    setShowCreateModal(false)
    resetForm()
    setIsSubmitting(false)
  }

  const handleEdit = async () => {
    if (!selectedAnnouncement) return
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 500))

    setLocalAnnouncements(prev => prev.map(a =>
      a.id === selectedAnnouncement.id
        ? {
            ...a,
            title: formData.title,
            body: formData.body,
            category: formData.category,
            scheduledDate: formData.scheduledDate,
            scheduledTime: formData.scheduledTime,
            venue: formData.venue,
            published: formData.published,
            lastUpdated: new Date().toISOString()
          }
        : a
    ))

    setShowEditModal(false)
    resetForm()
    setIsSubmitting(false)
  }

  const handleDelete = async () => {
    if (!selectedAnnouncement) return
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 500))

    setLocalAnnouncements(prev => prev.filter(a => a.id !== selectedAnnouncement.id))
    setShowDeleteDialog(false)
    setSelectedAnnouncement(null)
    setIsSubmitting(false)
  }

  const togglePublish = async () => {
    if (!selectedAnnouncement) return
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 500))

    setLocalAnnouncements(prev => prev.map(a =>
      a.id === selectedAnnouncement.id
        ? { ...a, published: !a.published }
        : a
    ))

    setShowPublishDialog(false)
    setSelectedAnnouncement(null)
    setIsSubmitting(false)
  }

  const openEditModal = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement)
    setFormData({
      title: announcement.title,
      body: announcement.body,
      category: announcement.category,
      scheduledDate: announcement.scheduledDate || '',
      scheduledTime: announcement.scheduledTime || '',
      venue: announcement.venue || '',
      published: announcement.published,
      categoryColor: categoryColors[announcement.category] || 'bg-green-500'
    })
    setShowEditModal(true)
  }

  const openViewModal = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement)
    setShowViewModal(true)
  }

  const getCategoryBadge = (category: string) => {
    const colorClass = categoryColors[category] || 'bg-gray-500'
    return (
      <Badge className={`${colorClass} text-white hover:${colorClass}`}>
        {category}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Announcements</h1>
            <p className="text-muted-foreground">Broadcast news and events to residents</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            New Announcement
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg border flex items-center justify-center">
                <Megaphone className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg border flex items-center justify-center bg-green-50">
                <Send className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.published}</div>
                <p className="text-xs text-muted-foreground">Published</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg border flex items-center justify-center bg-amber-50">
                <FileText className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600">{stats.draft}</div>
                <p className="text-xs text-muted-foreground">Draft</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg border flex items-center justify-center bg-blue-50">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.events}</div>
                <p className="text-xs text-muted-foreground">Events</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {paginatedAnnouncements.map((announcement) => (
          <Card key={announcement.id} className={!announcement.published ? "opacity-70" : ""}>
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Category Color Bar */}
                <div className="flex items-start gap-4 lg:w-8">
                  <div className={`w-2 h-full min-h-[80px] rounded-full ${categoryColors[announcement.category] || 'bg-gray-400'}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {getCategoryBadge(announcement.category)}
                      <span className="font-semibold text-lg">{announcement.title}</span>
                    </div>
                    <Badge variant={announcement.published ? "default" : "secondary"}>
                      {announcement.published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{announcement.body}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {announcement.scheduledDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(announcement.scheduledDate), 'MMM d, yyyy')} at {announcement.scheduledTime}</span>
                      </div>
                    )}
                    {announcement.venue && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{announcement.venue}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 lg:flex-col">
                  <Button variant="outline" size="sm" onClick={() => openEditModal(announcement)}>
                    Edit
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openViewModal(announcement)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setSelectedAnnouncement(announcement)
                        setShowPublishDialog(true)
                      }}>
                        {announcement.published ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-2" />
                            Unpublish
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Publish
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => {
                          setSelectedAnnouncement(announcement)
                          setShowDeleteDialog(true)
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredAnnouncements.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Megaphone className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold mb-1">No announcements found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {typeFilter !== 'all' || statusFilter !== 'all' ? 'No announcements match the current filters' : 'Create your first announcement'}
              </p>
              <Button onClick={() => setShowCreateModal(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Create Announcement
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {filteredAnnouncements.length > 0 && (
          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAnnouncements.length)} of {filteredAnnouncements.length} announcements
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm px-3 py-1 border rounded">{currentPage}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Announcement</DialogTitle>
            <DialogDescription>Fill in the details for your announcement</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Announcement Type</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  placeholder="Enter announcement title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Content / Description</Label>
              <Textarea
                placeholder="Write announcement details here..."
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Time</Label>
                <Input
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Location / Venue</Label>
              <Input
                placeholder="Enter location or venue"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Cover Image (optional)</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG (Max. 5MB)</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <RadioGroup
                value={formData.published ? "published" : "draft"}
                onValueChange={(v) => setFormData({ ...formData, published: v === "published" })}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="published" id="published" />
                  <Label htmlFor="published" className="font-normal">Published</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="draft" id="draft" />
                  <Label htmlFor="draft" className="font-normal">Draft</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => {
              setShowCreateModal(false)
              resetForm()
            }}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={isSubmitting || !formData.title || !formData.body || !formData.category}>
              {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Create Announcement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Announcement Type</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Content / Description</Label>
              <Textarea
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Time</Label>
                <Input
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Location / Venue</Label>
              <Input
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Cover Image (optional)</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Change Image</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <RadioGroup
                value={formData.published ? "published" : "draft"}
                onValueChange={(v) => setFormData({ ...formData, published: v === "published" })}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="published" id="edit-published" />
                  <Label htmlFor="edit-published" className="font-normal">Published</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="draft" id="edit-draft" />
                  <Label htmlFor="edit-draft" className="font-normal">Draft</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => {
              setShowEditModal(false)
              resetForm()
            }}>
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Announcement Details</DialogTitle>
          </DialogHeader>

          {selectedAnnouncement && (
            <div className="space-y-4">
              {/* Header with image placeholder */}
              <div className="relative aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className={`inline-flex px-3 py-1 rounded-full text-white text-sm mb-2 ${categoryColors[selectedAnnouncement.category] || 'bg-gray-400'}`}>
                    {selectedAnnouncement.category}
                  </div>
                  <Badge className="absolute top-3 right-3">
                    {selectedAnnouncement.published ? "Published" : "Draft"}
                  </Badge>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg">{selectedAnnouncement.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{selectedAnnouncement.body}</p>
              </div>

              {selectedAnnouncement.scheduledDate && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{format(new Date(selectedAnnouncement.scheduledDate), 'MMMM d, yyyy')} at {selectedAnnouncement.scheduledTime}</span>
                </div>
              )}

              {selectedAnnouncement.venue && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedAnnouncement.venue}</span>
                </div>
              )}

              <div className="pt-4 border-t space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span>{selectedAnnouncement.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span>{selectedAnnouncement.published ? 'Published' : 'Draft'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Posted By</span>
                  <span>{selectedAnnouncement.postedBy || 'Admin'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date Created</span>
                  <span>{format(new Date(selectedAnnouncement.createdAt), 'MMM d, yyyy hh:mm a')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span>{format(new Date(selectedAnnouncement.lastUpdated || selectedAnnouncement.createdAt), 'MMM d, yyyy hh:mm a')}</span>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setShowViewModal(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  setShowViewModal(false)
                  openEditModal(selectedAnnouncement)
                }}>
                  Edit Announcement
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Publish/Unpublish Confirmation */}
      <AlertDialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <div className={`p-4 rounded-full ${selectedAnnouncement?.published ? 'bg-amber-100' : 'bg-green-100'}`}>
                {selectedAnnouncement?.published ? (
                  <X className="w-8 h-8 text-amber-600" />
                ) : (
                  <Check className="w-8 h-8 text-green-600" />
                )}
              </div>
            </div>
            <AlertDialogTitle className="text-center">
              {selectedAnnouncement?.published ? 'Unpublish Announcement?' : 'Publish Announcement?'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              {selectedAnnouncement?.published
                ? 'Are you sure you want to unpublish this announcement? It will no longer be visible to residents.'
                : 'Are you sure you want to publish this announcement? It will be visible to all residents.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={togglePublish}>
              {selectedAnnouncement?.published ? 'Unpublish' : 'Publish'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-destructive/10">
                <Trash2 className="w-8 h-8 text-destructive" />
              </div>
            </div>
            <AlertDialogTitle className="text-center">Delete Announcement?</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Are you sure you want to delete this announcement? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {selectedAnnouncement && (
            <div className="p-4 bg-muted/50 rounded-lg text-center my-4">
              <p className="font-semibold">{selectedAnnouncement.title}</p>
              <p className="text-sm text-muted-foreground">
                {selectedAnnouncement.scheduledDate && format(new Date(selectedAnnouncement.scheduledDate), 'MMM d, yyyy')} | {selectedAnnouncement.venue}
              </p>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
