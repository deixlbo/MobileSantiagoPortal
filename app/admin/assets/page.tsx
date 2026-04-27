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
  FolderOpen, Plus, Search, Filter, Upload, FileText, Image, Video,
  MoreHorizontal, Eye, Download, Trash2, Edit, Link2
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { mockAssets, mockProjects, mockAnnouncements } from "@/lib/mock-data"

type Asset = typeof mockAssets[0]

export default function AdminAssets() {
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [assets, setAssets] = useState(mockAssets)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [newAsset, setNewAsset] = useState({
    name: '',
    type: 'Document',
    category: 'Project',
    linkedTo: '',
    linkedId: '',
    description: ''
  })

  const filteredAssets = assets
    .filter(a => filter === "all" || a.type.toLowerCase() === filter)
    .filter(a =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.linkedTo.toLowerCase().includes(searchTerm.toLowerCase())
    )

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

  const handleDelete = (id: string) => {
    setAssets(assets.filter(a => a.id !== id))
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'image':
        return <Image className="w-5 h-5 text-blue-500" />
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
        
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search assets..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="document">Documents</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="animate-fade-in-up">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FolderOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{assets.length}</div>
                <p className="text-xs text-muted-foreground">Total Assets</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <FileText className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600">
                  {assets.filter(a => a.type === 'Document').length}
                </div>
                <p className="text-xs text-muted-foreground">Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Image className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {assets.filter(a => a.type === 'Image').length}
                </div>
                <p className="text-xs text-muted-foreground">Images</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Video className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {assets.filter(a => a.type === 'Video').length}
                </div>
                <p className="text-xs text-muted-foreground">Videos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
                      <TableHead>File Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Linked To</TableHead>
                      <TableHead>Date Uploaded</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssets.map((asset) => (
                      <TableRow key={asset.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {getTypeIcon(asset.type)}
                            <div>
                              <p className="font-medium">{asset.name}</p>
                              <p className="text-xs text-muted-foreground">{asset.size}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getTypeBadge(asset.type)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Link2 className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm">{asset.linkedTo}</span>
                          </div>
                        </TableCell>
                        <TableCell>{format(new Date(asset.uploadedAt), 'MMM d, yyyy')}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleDelete(asset.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
                        <div className="p-2 rounded-lg bg-muted">
                          {getTypeIcon(asset.type)}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{asset.name}</p>
                          <p className="text-xs text-muted-foreground">{asset.size}</p>
                        </div>
                      </div>
                      {getTypeBadge(asset.type)}
                    </div>
                    <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Link2 className="w-3 h-3" />
                        <span>{asset.linkedTo}</span>
                      </div>
                      <p>Uploaded: {format(new Date(asset.uploadedAt), 'MMM d, yyyy')}</p>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDelete(asset.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold mb-1">No assets found</h3>
              <p className="text-sm text-muted-foreground">
                {filter !== 'all' ? 'No assets match the current filter' : 'Upload your first asset to get started'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Upload Asset</DialogTitle>
            <DialogDescription>Upload a new file to the system</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag & drop files here or click to browse
              </p>
              <Button variant="outline" size="sm">
                Choose File
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="assetName">Asset Title</Label>
                <Input
                  id="assetName"
                  placeholder="Enter asset name"
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>File Type</Label>
                <Select
                  value={newAsset.type}
                  onValueChange={(v) => setNewAsset({ ...newAsset, type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Document">Document</SelectItem>
                    <SelectItem value="Image">Image</SelectItem>
                    <SelectItem value="Video">Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={newAsset.category}
                  onValueChange={(v) => setNewAsset({ ...newAsset, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Project">Project</SelectItem>
                    <SelectItem value="Announcement">Announcement</SelectItem>
                    <SelectItem value="Document">Document</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-2 space-y-2">
                <Label>Link to</Label>
                <Select
                  value={newAsset.linkedTo}
                  onValueChange={(v) => {
                    const project = mockProjects.find(p => p.name === v)
                    const announcement = mockAnnouncements.find(a => a.title === v)
                    setNewAsset({ 
                      ...newAsset, 
                      linkedTo: v,
                      linkedId: project?.id || announcement?.id || ''
                    })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project or announcement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="" disabled>Projects</SelectItem>
                    {mockProjects.map(p => (
                      <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                    ))}
                    <SelectItem value="" disabled>Announcements</SelectItem>
                    {mockAnnouncements.map(a => (
                      <SelectItem key={a.id} value={a.title}>{a.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowUploadModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload}>
              <Upload className="w-4 h-4 mr-2" />
              Save Updates
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
