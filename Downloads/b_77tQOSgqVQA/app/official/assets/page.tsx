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
}

const mockAssets: Asset[] = [
  {
    id: "AST-001",
    name: "Barangay Service Vehicle",
    category: "vehicle",
    description: "Toyota Hiace for community service",
    acquisitionDate: "2022-03-15",
    acquisitionCost: 1500000,
    currentValue: 1200000,
    location: "Barangay Hall Garage",
    status: "operational",
    serialNumber: "TH-2022-001",
    lastMaintenance: "2024-01-10",
    assignedTo: "Barangay Captain",
  },
  {
    id: "AST-002",
    name: "Emergency Response Kit",
    category: "equipment",
    description: "Complete first aid and rescue equipment",
    acquisitionDate: "2023-06-20",
    acquisitionCost: 150000,
    currentValue: 120000,
    location: "Barangay Health Center",
    status: "operational",
    serialNumber: "ERK-2023-001",
    lastMaintenance: "2024-02-15",
    assignedTo: "Health Committee",
  },
  {
    id: "AST-003",
    name: "Conference Table Set",
    category: "furniture",
    description: "12-seater conference table with chairs",
    acquisitionDate: "2021-08-10",
    acquisitionCost: 80000,
    currentValue: 50000,
    location: "Barangay Hall Conference Room",
    status: "operational",
    serialNumber: "FRN-2021-001",
    lastMaintenance: "2023-12-01",
    assignedTo: "General Use",
  },
  {
    id: "AST-004",
    name: "Desktop Computer Set",
    category: "electronics",
    description: "Dell desktop with monitor for office use",
    acquisitionDate: "2023-01-05",
    acquisitionCost: 45000,
    currentValue: 35000,
    location: "Secretary Office",
    status: "maintenance",
    serialNumber: "PC-2023-001",
    lastMaintenance: "2024-03-01",
    assignedTo: "Barangay Secretary",
  },
  {
    id: "AST-005",
    name: "Basketball Court Lights",
    category: "infrastructure",
    description: "LED floodlights for basketball court",
    acquisitionDate: "2022-11-20",
    acquisitionCost: 200000,
    currentValue: 160000,
    location: "Barangay Basketball Court",
    status: "damaged",
    serialNumber: "INF-2022-001",
    lastMaintenance: "2023-10-15",
    assignedTo: "Sports Committee",
  },
]

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
  const [assets, setAssets] = useState<Asset[]>(mockAssets)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

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
    })
    setIsAddDialogOpen(false)
  }

  const handleDeleteAsset = (id: string) => {
    setAssets(assets.filter((a) => a.id !== id))
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
          <DialogContent className="max-w-2xl">
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

      {/* Assets Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset ID</TableHead>
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
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Wrench className="mr-2 h-4 w-4" />
                            Log Maintenance
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteAsset(asset.id)}
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
        <DialogContent className="max-w-2xl">
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
    </div>
  )
}
