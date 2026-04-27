"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  DialogTitle,
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
  FolderOpen, Plus, Search, Filter, Upload, FileText, Image as ImageIcon, Video,
  MoreVertical, Eye, Download, Trash2, Edit, Link2, X, ChevronLeft, ChevronRight,
  ZoomIn, ZoomOut, Maximize2, Printer, RotateCw, Pencil, RefreshCw
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { mockAssets, mockProjects, mockAnnouncements } from "@/lib/mock-data"

type Asset = typeof mockAssets[0]

export default function AdminAssets() {
  const [typeFilter, setTypeFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [searchTerm, setSearchTerm] = useState("")
  const [assets, setAssets] = useState(mockAssets)
  
  // Modal states
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showViewImageModal, setShowViewImageModal] = useState(false)
  const [showViewDocModal, setShowViewDocModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showRenameModal, setShowRenameModal] = useState(false)
  
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null)
  const [renameValue, setRenameValue] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [docPage, setDocPage] = useState(1)
  const totalDocPages = 5
  
  const [newAsset, setNewAsset] = useState({
    name: '',
    type: 'Document',
    category: 'Project',
    linkedTo: '',
    linkedId: '',
    description: ''
  })

  // Get unique categories from assets
  const categories = [...new Set(assets.map(a => a.category))]

  const filteredAssets = assets
    .filter(a => typeFilter === "all" || a.type.toLowerCase() === typeFilter.toLowerCase())
    .filter(a => categoryFilter === "all" || a.category === categoryFilter)
    .filter(a =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.linkedTo.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      if (sortBy === "oldest") return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
      if (sortBy === "name") return a.name.localeCompare(b.name)
      return 0
    })

  const handleUpload = () => {
    const asset: Asset = {
      id: String(assets.length + 1),
      name: newAsset.name || 'new-file.pdf',
      type: newAsset.type,
      category: newAsset.category,
      linkedTo: newAsset.linkedTo,
      linkedId: newAsset.linkedId,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'Admin',
      size: '1.2 MB',
      url: '/placeholder.svg'
    }
    setAssets([...assets, asset])
    setShowUploadModal(false)
    setNewAsset({
      name: '',
      type: 'Document',
      category: 'Project',
      linkedTo: '',
      linkedId: '',
      description: ''
    })
  }

  const handleDelete = () => {
    if (assetToDelete) {
      setAssets(assets.filter(a => a.id !== assetToDelete.id))
      setAssetToDelete(null)
      setShowDeleteConfirm(false)
    }
  }

  const handleRename = () => {
    if (selectedAsset && renameValue.trim()) {
      setAssets(assets.map(a => 
        a.id === selectedAsset.id ? { ...a, name: renameValue } : a
      ))
      setShowRenameModal(false)
      setRenameValue("")
    }
  }

  const openViewModal = (asset: Asset) => {
    setSelectedAsset(asset)
    if (asset.type.toLowerCase() === 'image') {
      setShowViewImageModal(true)
    } else {
      setShowViewDocModal(true)
      setDocPage(1)
    }
  }

  const openDetailsModal = (asset: Asset) => {
    setSelectedAsset(asset)
    setShowDetailsModal(true)
  }

  const openDeleteConfirm = (asset: Asset) => {
    setAssetToDelete(asset)
    setShowDeleteConfirm(true)
  }

  const openRenameModal = (asset: Asset) => {
    setSelectedAsset(asset)
    setRenameValue(asset.name)
    setShowRenameModal(true)
  }

  const resetFilters = () => {
    setTypeFilter("all")
    setCategoryFilter("all")
    setSortBy("newest")
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'image':
        return <ImageIcon className="w-5 h-5 text-blue-500" />
      case 'video':
        return <Video className="w-5 h-5 text-purple-500" />
      default:
        return <FileText className="w-5 h-5 text-amber-500" />
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case 'image':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Image</Badge>
      case 'video':
        return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Video</Badge>
      default:
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Document</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Assets</h1>
            <p className="text-muted-foreground">Manage files and documents</p>
          </div>
          <Button onClick={() => setShowUploadModal(true)} className="gap-2">
            <Upload className="w-4 h-4" />
            Upload Asset
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search assets..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg border">
                <FolderOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">{assets.length}</div>
                <p className="text-xs text-muted-foreground">Total Assets</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg border">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {assets.filter(a => a.type === 'Document').length}
                </div>
                <p className="text-xs text-muted-foreground">Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg border">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {assets.filter(a => a.type === 'Image').length}
                </div>
                <p className="text-xs text-muted-foreground">Images</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg border">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {assets.filter(a => a.type === 'Video').length}
                </div>
                <p className="text-xs text-muted-foreground">Videos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter & Sort Controls */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Type</span>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="document">Documents</SelectItem>
                    <SelectItem value="image">Images</SelectItem>
                    <SelectItem value="video">Videos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Category / Project</span>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Sort By</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button variant="outline" size="sm" onClick={resetFilters} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Assets Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Assets</CardTitle>
          <CardDescription>Manage uploaded files and documents</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAssets.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>File Name</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Category / Project</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssets.map((asset) => (
                      <TableRow key={asset.id}>
                        <TableCell>
                          <div className="w-10 h-10 rounded border bg-muted flex items-center justify-center">
                            {getTypeIcon(asset.type)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{asset.name}</p>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{asset.size}</TableCell>
                        <TableCell>{getTypeBadge(asset.type)}</TableCell>
                        <TableCell>{asset.linkedTo}</TableCell>
                        <TableCell>{format(new Date(asset.uploadedAt), 'MMM d, yyyy')}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="outline" size="sm" onClick={() => openViewModal(asset)}>
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              Download
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openDetailsModal(asset)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="w-4 h-4 mr-2" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openRenameModal(asset)}>
                                  <Pencil className="w-4 h-4 mr-2" />
                                  Rename
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => openDeleteConfirm(asset)}
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
              <div className="lg:hidden space-y-3">
                {filteredAssets.map((asset) => (
                  <div key={asset.id} className="p-4 rounded-lg border bg-card">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg border bg-muted flex items-center justify-center shrink-0">
                          {getTypeIcon(asset.type)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{asset.name}</p>
                          <p className="text-xs text-muted-foreground">{asset.size}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="shrink-0">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openViewModal(asset)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openDetailsModal(asset)}>
                            <FileText className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openRenameModal(asset)}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => openDeleteConfirm(asset)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {getTypeBadge(asset.type)}
                      <span className="text-xs text-muted-foreground">{asset.linkedTo}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(asset.uploadedAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Showing 1 to {filteredAssets.length} of {filteredAssets.length} assets
                </p>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="icon" disabled>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="min-w-[36px]">1</Button>
                  <Button variant="outline" size="icon" disabled>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold mb-1">No assets found</h3>
              <p className="text-sm text-muted-foreground">
                {typeFilter !== 'all' || categoryFilter !== 'all' 
                  ? 'No assets match the current filters' 
                  : 'Upload your first asset to get started'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Asset Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Upload New Asset</DialogTitle>
            <DialogDescription>Upload a new file to the system</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <Label className="text-sm">
                File <span className="text-destructive">*</span>
              </Label>
              <div className="mt-2 border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                <p className="font-medium mb-1">
                  Click to upload <span className="text-muted-foreground font-normal">or drag and drop</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG, PDF, DOC, DOCX, MP4 (Max. 50MB)
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assetName">
                  File Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="assetName"
                  placeholder="Enter file name"
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>
                  Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={newAsset.type}
                  onValueChange={(v) => setNewAsset({ ...newAsset, type: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Document">Document</SelectItem>
                    <SelectItem value="Image">Image</SelectItem>
                    <SelectItem value="Video">Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Category / Project</Label>
              <Select
                value={newAsset.linkedTo}
                onValueChange={(v) => {
                  const project = mockProjects.find(p => p.name === v)
                  const announcement = mockAnnouncements.find(a => a.title === v)
                  setNewAsset({ 
                    ...newAsset, 
                    linkedTo: v,
                    linkedId: project?.id || announcement?.id || '',
                    category: project ? 'Project' : 'Announcement'
                  })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category or project" />
                </SelectTrigger>
                <SelectContent>
                  {mockProjects.map(p => (
                    <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Textarea 
                placeholder="Enter description..."
                value={newAsset.description}
                onChange={(e) => setNewAsset({ ...newAsset, description: e.target.value })}
              />
            </div>
          </div>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowUploadModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload}>
              Upload Asset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Image Modal */}
      <Dialog open={showViewImageModal} onOpenChange={setShowViewImageModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader className="flex flex-row items-center justify-between">
            <div>
              <DialogTitle>{selectedAsset?.name}</DialogTitle>
            </div>
          </DialogHeader>
          
          <div className="flex gap-6">
            {/* Image Preview */}
            <div className="flex-1 bg-muted rounded-lg aspect-video flex items-center justify-center relative overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <ImageIcon className="w-16 h-16 text-gray-400" />
              </div>
            </div>
            
            {/* Image Details */}
            <div className="w-48 space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground">File Name</p>
                <p className="font-medium">{selectedAsset?.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Type</p>
                {selectedAsset && getTypeBadge(selectedAsset.type)}
              </div>
              <div>
                <p className="text-muted-foreground">Size</p>
                <p className="font-medium">{selectedAsset?.size}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Category / Project</p>
                <p className="font-medium">{selectedAsset?.linkedTo}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Uploaded</p>
                <p className="font-medium">
                  {selectedAsset && format(new Date(selectedAsset.uploadedAt), 'MMM d, yyyy h:mm a')}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Uploaded By</p>
                <p className="font-medium">{selectedAsset?.uploadedBy}</p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Download
            </Button>
            <Button variant="outline" onClick={() => setShowViewImageModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Document Modal */}
      <Dialog open={showViewDocModal} onOpenChange={setShowViewDocModal}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader className="flex flex-row items-start justify-between">
            <div>
              <DialogTitle>{selectedAsset?.name}</DialogTitle>
              <DialogDescription>PDF - {selectedAsset?.size}</DialogDescription>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon">
                <Download className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Printer className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="flex gap-6">
            {/* Document Preview */}
            <div className="flex-1 bg-white border rounded-lg p-8 min-h-[500px]">
              <div className="text-center mb-6">
                <p className="text-xs text-muted-foreground mb-2">BARANGAY SANTIAGO</p>
                <h3 className="font-bold text-lg">ROAD REPAIR PROJECT</h3>
                <h4 className="font-semibold">BUDGET PROPOSAL</h4>
                <p className="text-sm text-muted-foreground mt-2">Prepared by: Barangay Council</p>
                <p className="text-sm text-muted-foreground">Date: April 10, 2026</p>
              </div>
              
              <div className="space-y-4 text-sm">
                <div>
                  <h5 className="font-semibold mb-2">I. PROJECT OVERVIEW</h5>
                  <p className="text-muted-foreground">
                    This project aims to repair damaged roads in Purok 3 and Purok 4 including strategic improvement for better drainage.
                  </p>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-2">II. BUDGET SUMMARY</h5>
                  <table className="w-full border-collapse border text-sm">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border p-2 text-left">Item</th>
                        <th className="border p-2 text-right">Amount (PHP)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border p-2">Materials</td>
                        <td className="border p-2 text-right">250,000.00</td>
                      </tr>
                      <tr>
                        <td className="border p-2">Labor</td>
                        <td className="border p-2 text-right">150,000.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            {/* Document Details */}
            <div className="w-48 space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground">File Name</p>
                <p className="font-medium">{selectedAsset?.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Type</p>
                {selectedAsset && getTypeBadge(selectedAsset.type)}
              </div>
              <div>
                <p className="text-muted-foreground">Size</p>
                <p className="font-medium">{selectedAsset?.size}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Category / Project</p>
                <p className="font-medium">{selectedAsset?.linkedTo}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Uploaded</p>
                <p className="font-medium">
                  {selectedAsset && format(new Date(selectedAsset.uploadedAt), 'MMM d, yyyy h:mm a')}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Uploaded By</p>
                <p className="font-medium">{selectedAsset?.uploadedBy}</p>
              </div>
            </div>
          </div>
          
          {/* Page Controls */}
          <div className="flex items-center justify-center gap-2 pt-4 border-t">
            <span className="text-sm">Page</span>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setDocPage(Math.max(1, docPage - 1))}
              disabled={docPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm min-w-[60px] text-center">{docPage} / {totalDocPages}</span>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setDocPage(Math.min(totalDocPages, docPage + 1))}
              disabled={docPage === totalDocPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-1 ml-4">
              <Button variant="ghost" size="icon">
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm">100%</span>
              <Button variant="ghost" size="icon">
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Download
            </Button>
            <Button variant="outline" onClick={() => setShowViewDocModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Asset Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Asset Details</DialogTitle>
          </DialogHeader>
          
          <div className="flex gap-4">
            <div className="w-24 h-24 rounded-lg border bg-muted flex items-center justify-center shrink-0">
              {selectedAsset && getTypeIcon(selectedAsset.type)}
            </div>
            <div className="space-y-3 flex-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">File Name</span>
                <span className="font-medium">{selectedAsset?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                {selectedAsset && getTypeBadge(selectedAsset.type)}
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Size</span>
                <span>{selectedAsset?.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category / Project</span>
                <span>{selectedAsset?.linkedTo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Description</span>
                <span className="text-right max-w-[200px]">
                  Monthly clean-up drive report and summary.
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Uploaded</span>
                <span>
                  {selectedAsset && format(new Date(selectedAsset.uploadedAt), 'MMM d, yyyy h:mm a')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Uploaded By</span>
                <span>{selectedAsset?.uploadedBy}</span>
              </div>
            </div>
          </div>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" className="gap-2" onClick={() => {
              if (selectedAsset) openViewModal(selectedAsset)
              setShowDetailsModal(false)
            }}>
              <Eye className="w-4 h-4" />
              View
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Download
            </Button>
            <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Modal */}
      <Dialog open={showRenameModal} onOpenChange={setShowRenameModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Rename Asset</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-2">
            <Label>File Name</Label>
            <Input
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              placeholder="Enter new file name"
            />
          </div>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowRenameModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleRename}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-destructive" />
              </div>
            </div>
            <AlertDialogTitle className="text-center">
              Are you sure you want to delete
              <br />
              &quot;{assetToDelete?.name}&quot;?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
