"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Package, Wrench, AlertTriangle, CheckCircle2, Edit, Trash2, Eye } from "lucide-react"

type AssetStatus = "operational" | "maintenance" | "damaged" | "disposed"
type AssetCategory = "vehicle" | "equipment" | "furniture" | "electronics" | "infrastructure"

interface Asset {
  id: string
  name: string
  category: AssetCategory
  description: string
  acquisitionDate: string
  acquisitionCost: number
  currentValue: number
  location: string
  status: AssetStatus
  serialNumber: string
  lastMaintenance: string
  assignedTo: string
  image?: string
}


const categoryLabels: Record<AssetCategory, string> = {
  vehicle: "Vehicle",
  equipment: "Equipment",
  furniture: "Furniture",
  electronics: "Electronics",
  infrastructure: "Infrastructure",
}

const statusConfig: Record<AssetStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof CheckCircle2 }> = {
  operational: { label: "Operational", variant: "default", icon: CheckCircle2 },
  maintenance: { label: "Under Maintenance", variant: "secondary", icon: Wrench },
  damaged: { label: "Damaged", variant: "destructive", icon: AlertTriangle },
  disposed: { label: "Disposed", variant: "outline", icon: Package },
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null)

  const [newAsset, setNewAsset] = useState({
    name: "",
    category: "equipment" as AssetCategory,
    description: "",
    acquisitionDate: "",
    acquisitionCost: "",
    location: "",
    status: "operational" as AssetStatus,
    serialNumber: "",
    assignedTo: "",
    image: "",
  })

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || asset.category === categoryFilter
    const matchesStatus = statusFilter === "all" || asset.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleAddAsset = () => {
    const cost = parseFloat(newAsset.acquisitionCost) || 0
    const asset: Asset = {
      id: `AST-${String(assets.length + 1).padStart(3, "0")}`,
      name: newAsset.name,
      category: newAsset.category,
      description: newAsset.description,
      acquisitionDate: newAsset.acquisitionDate,
      acquisitionCost: cost,
      currentValue: cost,
      location: newAsset.location,
      status: newAsset.status,
      serialNumber: newAsset.serialNumber,
      lastMaintenance: newAsset.acquisitionDate,
      assignedTo: newAsset.assignedTo,
      image: imagePreview,
    }
    setAssets([asset, ...assets])
    setNewAsset({
      name: "",
      category: "equipment",
      description: "",
      acquisitionDate: "",
      acquisitionCost: "",
      location: "",
      status: "operational",
      serialNumber: "",
      assignedTo: "",
      image: "",
    })
    setImagePreview("")
    setIsAddDialogOpen(false)
  }

  const handleEditAsset = () => {
    if (!editingAsset) return
    const updatedAssets = assets.map(a => 
      a.id === editingAsset.id 
        ? { ...editingAsset, image: imagePreview }
        : a
    )
    setAssets(updatedAssets)
    setEditingAsset(null)
    setImagePreview("")
    setIsEditDialogOpen(false)
  }

  const handleDeleteAsset = (id: string) => {
    // immediate delete kept for programmatic calls; UI uses confirmation
    setAssets(assets.filter((a) => a.id !== id))
  }

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const requestDeleteAsset = (id: string) => {
    setConfirmDeleteId(id)
    setIsConfirmOpen(true)
  }

  const confirmDeleteAsset = () => {
    if (!confirmDeleteId) return
    setAssets((s) => s.filter((a) => a.id !== confirmDeleteId))
    setConfirmDeleteId(null)
    setIsConfirmOpen(false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreview(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const openEditDialog = (asset: Asset) => {
    setEditingAsset({ ...asset })
    setImagePreview(asset.image || "")
    setIsEditDialogOpen(true)
  }

  const totalValue = assets.reduce((sum, a) => sum + a.currentValue, 0)
  const operationalCount = assets.filter((a) => a.status === "operational").length
  const maintenanceCount = assets.filter((a) => a.status === "maintenance").length
  const damagedCount = assets.filter((a) => a.status === "damaged").length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Asset Management</h1>
          <p className="text-muted-foreground">Track and manage barangay assets and equipment</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Asset
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] sm:w-auto max-h-[95vh] overflow-auto max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Asset</DialogTitle>
              <DialogDescription>Register a new barangay asset or equipment</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Asset Name</Label>
                  <Input
                    id="name"
                    value={newAsset.name}
                    onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                    placeholder="Enter asset name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newAsset.category}
                    onValueChange={(v) => setNewAsset({ ...newAsset, category: v as AssetCategory })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newAsset.description}
                  onChange={(e) => setNewAsset({ ...newAsset, description: e.target.value })}
                  placeholder="Describe the asset"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="serialNumber">Serial Number</Label>
                  <Input
                    id="serialNumber"
                    value={newAsset.serialNumber}
                    onChange={(e) => setNewAsset({ ...newAsset, serialNumber: e.target.value })}
                    placeholder="Enter serial number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="acquisitionDate">Acquisition Date</Label>
                  <Input
                    id="acquisitionDate"
                    type="date"
                    value={newAsset.acquisitionDate}
                    onChange={(e) => setNewAsset({ ...newAsset, acquisitionDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="acquisitionCost">Acquisition Cost (PHP)</Label>
                  <Input
                    id="acquisitionCost"
                    type="number"
                    value={newAsset.acquisitionCost}
                    onChange={(e) => setNewAsset({ ...newAsset, acquisitionCost: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newAsset.status}
                    onValueChange={(v) => setNewAsset({ ...newAsset, status: v as AssetStatus })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusConfig).map(([value, config]) => (
                        <SelectItem key={value} value={value}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newAsset.location}
                    onChange={(e) => setNewAsset({ ...newAsset, location: e.target.value })}
                    placeholder="Where is the asset located?"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Input
                    id="assignedTo"
                    value={newAsset.assignedTo}
                    onChange={(e) => setNewAsset({ ...newAsset, assignedTo: e.target.value })}
                    placeholder="Person or committee"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Asset Image</Label>
                <div className="flex gap-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="flex-1"
                  />
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="h-10 w-10 rounded object-cover" />
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddAsset} disabled={!newAsset.name || !newAsset.serialNumber}>
                Add Asset
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Asset Value</CardDescription>
            <CardTitle className="text-2xl">PHP {totalValue.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Operational</CardDescription>
            <CardTitle className="flex items-center gap-2 text-2xl text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              {operationalCount}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Under Maintenance</CardDescription>
            <CardTitle className="flex items-center gap-2 text-2xl text-yellow-600">
              <Wrench className="h-5 w-5" />
              {maintenanceCount}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Damaged</CardDescription>
            <CardTitle className="flex items-center gap-2 text-2xl text-red-600">
              <AlertTriangle className="h-5 w-5" />
              {damagedCount}
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
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
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

      {/* Mobile asset cards (small screens) */}
      <div className="space-y-3 sm:hidden">
        {filteredAssets.map((asset) => {
          const statusInfo = statusConfig[asset.status]
          const StatusIcon = statusInfo.icon
          return (
            <div key={asset.id} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded overflow-hidden bg-muted shrink-0">
                  {asset.image ? <img src={asset.image} alt={asset.name} className="h-12 w-12 object-cover" /> : <Package className="h-6 w-6 text-muted-foreground m-3" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900 truncate">{asset.name}</p>
                  <p className="text-xs text-muted-foreground">{categoryLabels[asset.category]} • {asset.serialNumber}</p>
                  <p className="text-xs text-slate-500 mt-1">PHP {asset.currentValue.toLocaleString()}</p>
                </div>
                <div className="shrink-0">
                  <Badge variant={statusInfo.variant} className="gap-1">
                    <StatusIcon className="h-3 w-3" />
                    {statusInfo.label}
                  </Badge>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button size="sm" className="flex-1" onClick={() => { setSelectedAsset(asset); setIsViewDialogOpen(true); }}>View</Button>
                <Button size="sm" variant="ghost" className="flex-1" onClick={() => openEditDialog(asset)}>Edit</Button>
                <Button size="sm" variant="destructive" className="flex-1" onClick={() => requestDeleteAsset(asset.id)}>Delete</Button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Assets Table for larger screens */}
      <Card>
        <CardContent className="p-0 hidden sm:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset ID</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.map((asset) => {
                const statusInfo = statusConfig[asset.status]
                const StatusIcon = statusInfo.icon
                return (
                  <TableRow key={asset.id}>
                    <TableCell className="font-medium">{asset.id}</TableCell>
                    <TableCell>
                      {asset.image ? (
                        <img src={asset.image} alt={asset.name} className="h-10 w-10 rounded object-cover" />
                      ) : (
                        <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{asset.name}</p>
                        <p className="text-sm text-muted-foreground">{asset.serialNumber}</p>
                      </div>
                    </TableCell>
                    <TableCell>{categoryLabels[asset.category]}</TableCell>
                    <TableCell>{asset.location}</TableCell>
                    <TableCell>PHP {asset.currentValue.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={statusInfo.variant} className="gap-1">
                        <StatusIcon className="h-3 w-3" />
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedAsset(asset)
                              setIsViewDialogOpen(true)
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditDialog(asset)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => requestDeleteAsset(asset.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Asset Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="w-[95vw] sm:w-auto max-h-[95vh] overflow-auto max-w-2xl">
          <DialogHeader>
            <DialogTitle>Asset Details</DialogTitle>
            <DialogDescription>Complete information about this asset</DialogDescription>
          </DialogHeader>
          {selectedAsset && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Asset ID</p>
                  <p className="font-medium">{selectedAsset.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Serial Number</p>
                  <p className="font-medium">{selectedAsset.serialNumber}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{selectedAsset.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p>{selectedAsset.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{categoryLabels[selectedAsset.category]}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={statusConfig[selectedAsset.status].variant}>
                    {statusConfig[selectedAsset.status].label}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Acquisition Date</p>
                  <p className="font-medium">
                    {new Date(selectedAsset.acquisitionDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Maintenance</p>
                  <p className="font-medium">
                    {new Date(selectedAsset.lastMaintenance).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Acquisition Cost</p>
                  <p className="font-medium">PHP {selectedAsset.acquisitionCost.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Value</p>
                  <p className="font-medium">PHP {selectedAsset.currentValue.toLocaleString()}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{selectedAsset.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Assigned To</p>
                  <p className="font-medium">{selectedAsset.assignedTo}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>This action will permanently delete the asset. Are you sure?</DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <p className="text-sm">{confirmDeleteId ? `Delete asset ${confirmDeleteId}? This cannot be undone.` : "Delete selected asset?"}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteAsset}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Asset Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-[95vw] sm:w-auto max-h-[95vh] overflow-auto max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Asset</DialogTitle>
            <DialogDescription>Update asset details and information</DialogDescription>
          </DialogHeader>
          {editingAsset && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Asset Name</Label>
                <Input
                  id="edit-name"
                  value={editingAsset.name}
                  onChange={(e) => setEditingAsset({ ...editingAsset, name: e.target.value })}
                  placeholder="Asset name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingAsset.description}
                  onChange={(e) => setEditingAsset({ ...editingAsset, description: e.target.value })}
                  placeholder="Describe the asset"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-serialNumber">Serial Number</Label>
                  <Input
                    id="edit-serialNumber"
                    value={editingAsset.serialNumber}
                    onChange={(e) => setEditingAsset({ ...editingAsset, serialNumber: e.target.value })}
                    placeholder="Enter serial number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={editingAsset.category}
                    onValueChange={(v) => setEditingAsset({ ...editingAsset, category: v as AssetCategory })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-location">Location</Label>
                  <Input
                    id="edit-location"
                    value={editingAsset.location}
                    onChange={(e) => setEditingAsset({ ...editingAsset, location: e.target.value })}
                    placeholder="Where is the asset located?"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editingAsset.status}
                    onValueChange={(v) => setEditingAsset({ ...editingAsset, status: v as AssetStatus })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusConfig).map(([value, config]) => (
                        <SelectItem key={value} value={value}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-image">Asset Image</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="edit-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="flex-1"
                  />
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="h-10 w-10 rounded object-cover" />
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditAsset}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
