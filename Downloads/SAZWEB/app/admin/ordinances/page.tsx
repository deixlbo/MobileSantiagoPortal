"use client"

import { useState, useMemo } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
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
  Scale, Plus, Search, Edit2, Trash2, Eye, Loader2, Upload,
  Download, FileText, ChevronLeft, ChevronRight, MoreVertical,
  AlertTriangle, Clock, ZoomIn, ZoomOut, Maximize2
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { mockOrdinances } from "@/lib/mock-data"

type Ordinance = typeof mockOrdinances[0] & {
  type?: string
  author?: string
  approvingAuthority?: string
  attachments?: Array<{ name: string; size: string }>
  history?: Array<{ date: string; action: string; by: string; remarks?: string }>
}

const ordinanceTypes = ["Local Ordinance", "Resolution", "Executive Order"]

export default function AdminOrdinances() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [localOrdinances, setLocalOrdinances] = useState<Ordinance[]>(
    mockOrdinances.map(o => ({
      ...o,
      type: 'Local Ordinance',
      author: 'Barangay Council',
      approvingAuthority: 'Sangguniang Barangay',
      attachments: [{ name: `${o.ordinanceNumber}-document.pdf`, size: '245 KB' }],
      history: [
        { date: o.enactedDate, action: 'Ordinance Enacted', by: 'Admin', remarks: 'Ordinance has been enacted and published.' },
        { date: format(new Date(new Date(o.enactedDate).getTime() - 5 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), action: 'Ordinance Updated', by: 'Admin', remarks: 'Updated description and attachments.' },
        { date: format(new Date(new Date(o.enactedDate).getTime() - 10 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), action: 'Ordinance Created', by: 'Admin', remarks: 'Initial draft created.' }
      ]
    }))
  )
  const [selectedOrdinance, setSelectedOrdinance] = useState<Ordinance | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDocViewerModal, setShowDocViewerModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Form state
  const [formData, setFormData] = useState({
    ordinanceNumber: '',
    title: '',
    purpose: '',
    body: '',
    type: 'Local Ordinance',
    author: '',
    enactedDate: '',
    status: 'draft'
  })

  const filteredOrdinances = useMemo(() => {
    let result = localOrdinances
      .filter(o => statusFilter === "all" || o.status === statusFilter)
      .filter(o =>
        o.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.ordinanceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.purpose.toLowerCase().includes(searchTerm.toLowerCase())
      )

    // Sort
    if (sortBy === "newest") {
      result = [...result].sort((a, b) => new Date(b.enactedDate).getTime() - new Date(a.enactedDate).getTime())
    } else if (sortBy === "oldest") {
      result = [...result].sort((a, b) => new Date(a.enactedDate).getTime() - new Date(b.enactedDate).getTime())
    }

    return result
  }, [localOrdinances, statusFilter, searchTerm, sortBy])

  const paginatedOrdinances = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredOrdinances.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredOrdinances, currentPage])

  const totalPages = Math.ceil(filteredOrdinances.length / itemsPerPage)

  const stats = useMemo(() => ({
    total: localOrdinances.length,
    enacted: localOrdinances.filter(o => o.status === 'enacted').length,
    draft: localOrdinances.filter(o => o.status === 'draft').length,
    repealed: localOrdinances.filter(o => o.status === 'repealed').length
  }), [localOrdinances])

  const resetForm = () => {
    setFormData({
      ordinanceNumber: '',
      title: '',
      purpose: '',
      body: '',
      type: 'Local Ordinance',
      author: '',
      enactedDate: '',
      status: 'draft'
    })
  }

  const handleCreate = async () => {
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 500))

    const newOrdinance: Ordinance = {
      id: `${Date.now()}`,
      ordinanceNumber: formData.ordinanceNumber,
      title: formData.title,
      purpose: formData.purpose,
      body: formData.body,
      seriesYear: new Date().getFullYear(),
      enactedDate: formData.enactedDate,
      status: formData.status,
      type: formData.type,
      author: formData.author,
      approvingAuthority: 'Sangguniang Barangay',
      attachments: [],
      history: [{ date: format(new Date(), 'yyyy-MM-dd'), action: 'Ordinance Created', by: 'Admin', remarks: 'Initial draft created.' }]
    }

    setLocalOrdinances(prev => [newOrdinance, ...prev])
    setShowCreateModal(false)
    resetForm()
    setIsSubmitting(false)
  }

  const handleEdit = async () => {
    if (!selectedOrdinance) return
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 500))

    setLocalOrdinances(prev => prev.map(o =>
      o.id === selectedOrdinance.id
        ? {
            ...o,
            ordinanceNumber: formData.ordinanceNumber,
            title: formData.title,
            purpose: formData.purpose,
            body: formData.body,
            type: formData.type,
            author: formData.author,
            enactedDate: formData.enactedDate,
            status: formData.status,
            history: [
              { date: format(new Date(), 'yyyy-MM-dd'), action: 'Ordinance Updated', by: 'Admin', remarks: 'Details updated.' },
              ...(o.history || [])
            ]
          }
        : o
    ))

    setShowEditModal(false)
    resetForm()
    setIsSubmitting(false)
  }

  const handleDelete = async () => {
    if (!selectedOrdinance) return
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 500))

    setLocalOrdinances(prev => prev.filter(o => o.id !== selectedOrdinance.id))
    setShowDeleteDialog(false)
    setSelectedOrdinance(null)
    setIsSubmitting(false)
  }

  const openEditModal = (ordinance: Ordinance) => {
    setSelectedOrdinance(ordinance)
    setFormData({
      ordinanceNumber: ordinance.ordinanceNumber,
      title: ordinance.title,
      purpose: ordinance.purpose,
      body: ordinance.body,
      type: ordinance.type || 'Local Ordinance',
      author: ordinance.author || '',
      enactedDate: ordinance.enactedDate,
      status: ordinance.status
    })
    setShowEditModal(true)
  }

  const openViewModal = (ordinance: Ordinance) => {
    setSelectedOrdinance(ordinance)
    setShowViewModal(true)
  }

  const openHistoryModal = (ordinance: Ordinance) => {
    setSelectedOrdinance(ordinance)
    setShowHistoryModal(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "enacted":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Enacted</Badge>
      case "draft":
        return <Badge variant="secondary">Draft</Badge>
      case "repealed":
        return <Badge variant="destructive">Repealed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Ordinances</h1>
            <p className="text-muted-foreground">Manage barangay ordinances and local legislation</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            New Ordinance
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg border flex items-center justify-center">
                <FileText className="w-5 h-5 text-muted-foreground" />
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
                <Scale className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.enacted}</div>
                <p className="text-xs text-muted-foreground">Enacted</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg border flex items-center justify-center bg-amber-50">
                <Clock className="w-5 h-5 text-amber-600" />
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
              <div className="w-10 h-10 rounded-lg border flex items-center justify-center bg-red-50">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{stats.repealed}</div>
                <p className="text-xs text-muted-foreground">Repealed</p>
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
            placeholder="Search ordinances..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="enacted">Enacted</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="repealed">Repealed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Enacted Date (Newest)</SelectItem>
            <SelectItem value="oldest">Enacted Date (Oldest)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Ordinances Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Ordinances</CardTitle>
          <CardDescription>View and manage barangay ordinances</CardDescription>
        </CardHeader>
        <CardContent>
          {paginatedOrdinances.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ordinance No.</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Enacted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedOrdinances.map((ordinance) => (
                      <TableRow key={ordinance.id}>
                        <TableCell className="font-mono font-medium">{ordinance.ordinanceNumber}</TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="font-medium truncate">{ordinance.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{ordinance.purpose}</p>
                          </div>
                        </TableCell>
                        <TableCell>{format(new Date(ordinance.enactedDate), 'MMM d, yyyy')}</TableCell>
                        <TableCell>{getStatusBadge(ordinance.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => openViewModal(ordinance)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openEditModal(ordinance)}>
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setShowDocViewerModal(true)}>
                              <FileText className="w-4 h-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openHistoryModal(ordinance)}>
                                  <Clock className="w-4 h-4 mr-2" />
                                  View History
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => {
                                    setSelectedOrdinance(ordinance)
                                    setShowDeleteDialog(true)
                                  }}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {paginatedOrdinances.map((ordinance) => (
                  <div key={ordinance.id} className="p-4 rounded-lg border bg-card">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge variant="outline" className="font-mono">{ordinance.ordinanceNumber}</Badge>
                      {getStatusBadge(ordinance.status)}
                    </div>
                    <h4 className="font-medium text-sm mb-1">{ordinance.title}</h4>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{ordinance.purpose}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(ordinance.enactedDate), 'MMM d, yyyy')}
                      </span>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openViewModal(ordinance)}>
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openEditModal(ordinance)}>
                          <Edit2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredOrdinances.length)} of {filteredOrdinances.length} ordinances
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
            </>
          ) : (
            <div className="text-center py-12">
              <Scale className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold mb-1">No ordinances found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {statusFilter !== 'all' ? 'No ordinances match the current filter' : 'Create your first ordinance to get started'}
              </p>
              <Button onClick={() => setShowCreateModal(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Create Ordinance
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Ordinance</DialogTitle>
            <DialogDescription>Fill out the form to create a new ordinance</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ordinance Number</Label>
                <Input
                  placeholder="e.g. 2026-003"
                  value={formData.ordinanceNumber}
                  onChange={(e) => setFormData({ ...formData, ordinanceNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  placeholder="Enter ordinance title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Enter description / full text of the ordinance..."
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Ordinance Type</Label>
              <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {ordinanceTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Author / Proponent</Label>
              <Input
                placeholder="Enter author or proponent"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Attachments / Documents</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG (Max. 10MB each)</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <RadioGroup
                value={formData.status}
                onValueChange={(v) => setFormData({ ...formData, status: v })}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="draft" id="create-draft" />
                  <Label htmlFor="create-draft" className="font-normal">Draft</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="enacted" id="create-enacted" />
                  <Label htmlFor="create-enacted" className="font-normal">Enacted</Label>
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
            <Button onClick={handleCreate} disabled={isSubmitting || !formData.ordinanceNumber || !formData.title}>
              {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Create Ordinance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Ordinance</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ordinance Number</Label>
                <Input
                  value={formData.ordinanceNumber}
                  onChange={(e) => setFormData({ ...formData, ordinanceNumber: e.target.value })}
                />
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
              <Label>Description</Label>
              <Textarea
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Ordinance Type</Label>
              <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ordinanceTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Attachments / Documents</Label>
              {selectedOrdinance?.attachments?.map((att, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{att.name}</p>
                      <p className="text-xs text-muted-foreground">{att.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon"><Download className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <RadioGroup
                value={formData.status}
                onValueChange={(v) => setFormData({ ...formData, status: v })}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="draft" id="edit-draft" />
                  <Label htmlFor="edit-draft" className="font-normal">Draft</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="enacted" id="edit-enacted" />
                  <Label htmlFor="edit-enacted" className="font-normal">Enacted</Label>
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
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Scale className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ordinance No.</p>
                  <p className="font-semibold">{selectedOrdinance?.ordinanceNumber}</p>
                </div>
              </div>
              {selectedOrdinance && getStatusBadge(selectedOrdinance.status)}
            </div>
          </DialogHeader>

          {selectedOrdinance && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{selectedOrdinance.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedOrdinance.purpose}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Enacted Date</p>
                  <p className="font-medium">{format(new Date(selectedOrdinance.enactedDate), 'MMM d, yyyy')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-medium capitalize">{selectedOrdinance.status}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Ordinance Type</p>
                  <p className="font-medium">{selectedOrdinance.type || 'Local Ordinance'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Author / Proponent</p>
                  <p className="font-medium">{selectedOrdinance.author || 'Barangay Council'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Approving Authority</p>
                  <p className="font-medium">{selectedOrdinance.approvingAuthority || 'Sangguniang Barangay'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Effectivity Date</p>
                  <p className="font-medium">{format(new Date(selectedOrdinance.enactedDate), 'MMM d, yyyy')}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Full Text / Description</p>
                <div className="p-4 bg-muted/50 rounded-lg text-sm whitespace-pre-wrap">
                  {selectedOrdinance.body}
                </div>
              </div>

              {selectedOrdinance.attachments && selectedOrdinance.attachments.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Attachments / Documents</p>
                  {selectedOrdinance.attachments.map((att, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{att.name}</p>
                          <p className="text-xs text-muted-foreground">{att.size}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon"><Download className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowViewModal(false)}>
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Document Viewer Modal */}
      <Dialog open={showDocViewerModal} onOpenChange={setShowDocViewerModal}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Anti-Littering Ordinance.pdf</DialogTitle>
                <DialogDescription>PDF - 245 KB</DialogDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon"><Download className="w-4 h-4" /></Button>
              </div>
            </div>
          </DialogHeader>

          <div className="bg-muted/50 rounded-lg p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
            <div className="border rounded-lg p-8 bg-background max-w-md w-full">
              <h3 className="font-bold text-center mb-2">BARANGAY SANTIAGO</h3>
              <h4 className="font-bold text-center mb-4">ANTI-LITTERING ORDINANCE</h4>
              <p className="text-sm text-center mb-4">AN ORDINANCE TO PROMOTE CLEANLINESS AND<br />PROPER WASTE DISPOSAL IN THE BARANGAY.</p>
              <p className="text-sm mb-2"><strong>SECTION 1. Title</strong></p>
              <p className="text-sm mb-4">This ordinance shall be known as the "Anti-Littering Ordinance" of Barangay Santiago.</p>
              <p className="text-sm mb-2"><strong>SECTION 2. Declaration of Policy</strong></p>
              <p className="text-sm">It is the policy of this barangay to promote cleanliness, protect the environment and public health, and encourage proper waste disposal among all residents.</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              <span className="text-sm">Page 1 / 5</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon"><ZoomOut className="w-4 h-4" /></Button>
              <span className="text-sm">100%</span>
              <Button variant="outline" size="icon"><ZoomIn className="w-4 h-4" /></Button>
              <Button variant="outline" size="icon"><Maximize2 className="w-4 h-4" /></Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDocViewerModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* History Modal */}
      <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Ordinance History</DialogTitle>
              {selectedOrdinance && getStatusBadge(selectedOrdinance.status)}
            </div>
          </DialogHeader>

          {selectedOrdinance && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                  <Scale className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold">{selectedOrdinance.ordinanceNumber}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrdinance.title}</p>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date / Time</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>By</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(selectedOrdinance.history || []).map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-sm">
                        {format(new Date(entry.date), 'MMM d, yyyy')}
                        <br />
                        <span className="text-xs text-muted-foreground">02:30 PM</span>
                      </TableCell>
                      <TableCell>{entry.action}</TableCell>
                      <TableCell>{entry.by}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{entry.remarks}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowHistoryModal(false)}>
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-amber-100">
                <AlertTriangle className="w-8 h-8 text-amber-600" />
              </div>
            </div>
            <AlertDialogTitle className="text-center">Delete Ordinance?</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Are you sure you want to delete this ordinance?<br />
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {selectedOrdinance && (
            <div className="p-4 bg-muted/50 rounded-lg text-center my-4">
              <p className="font-semibold">Ordinance No. {selectedOrdinance.ordinanceNumber}</p>
              <p className="text-sm text-muted-foreground">{selectedOrdinance.title}</p>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Delete Ordinance
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
