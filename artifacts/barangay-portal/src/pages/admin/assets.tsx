import { AdminLayout } from "@/components/admin-layout";
import { useListAssets, useGetAssetStats, useCreateAsset, useUpdateAsset, useDeleteAsset, getListAssetsQueryKey, getGetAssetStatsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Search, Filter, Plus, FileImage, FileText, Film, FolderOpen, Download, Trash, MoreHorizontal, File, Edit, Eye, Wrench, BarChart3 } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const assetSchema = z.object({
  assetName: z.string().min(1),
  assetCode: z.string().min(1),
  assetType: z.string().min(1),
  category: z.string().min(1),
  condition: z.string().optional(),
  status: z.string().optional(),
  location: z.string().optional(),
  assignedTo: z.string().optional(),
  description: z.string().optional(),
  acquisitionCost: z.string().optional(),
  acquisitionDate: z.string().optional(),
  quantity: z.string().optional(),
  unit: z.string().optional(),
  brandModel: z.string().optional(),
  serialNumber: z.string().optional(),
});

export default function Assets() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [newMaintenance, setNewMaintenance] = useState({ date: "", type: "Preventive Maintenance", description: "", cost: "" });

  const { data: stats } = useGetAssetStats();
  const { data: assets = [], isLoading } = useListAssets({ search: search || undefined });

  const createAsset = useCreateAsset({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAssetsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetAssetStatsQueryKey() });
        toast.success("Asset created successfully");
        setIsCreateOpen(false);
        form.reset();
      }
    }
  });

  const updateAsset = useUpdateAsset({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAssetsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetAssetStatsQueryKey() });
        toast.success("Asset updated successfully");
        setIsDetailsOpen(false);
      }
    }
  });

  const deleteAsset = useDeleteAsset({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAssetsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetAssetStatsQueryKey() });
        toast.success("Asset deleted successfully");
      }
    }
  });

  const form = useForm<z.infer<typeof assetSchema>>({
    resolver: zodResolver(assetSchema),
    defaultValues: { 
      assetType: "Equipment",
      category: "General",
      status: "available",
      condition: "good"
    }
  });

  const handleCreateSubmit = (data: z.infer<typeof assetSchema>) => {
    createAsset.mutate({
      data: {
        assetName: data.assetName,
        assetCode: data.assetCode,
        assetType: data.assetType,
        category: data.category,
        condition: data.condition || "good",
        status: data.status || "available",
        location: data.location,
        assignedTo: data.assignedTo,
        description: data.description,
        acquisitionCost: data.acquisitionCost ? parseFloat(data.acquisitionCost) : 0,
        acquisitionDate: data.acquisitionDate,
        quantity: data.quantity ? parseInt(data.quantity) : 1,
        unit: data.unit || "unit",
        brandModel: data.brandModel,
        serialNumber: data.serialNumber,
        uploadedBy: "Admin User",
      }
    });
  };

  const openDetails = (asset: any) => {
    setSelectedAsset(asset);
    setIsDetailsOpen(true);
  };

  const handleAddMaintenance = () => {
    if (!newMaintenance.date || !newMaintenance.description) {
      toast.error("Please fill in required fields");
      return;
    }

    if (selectedAsset) {
      const records = selectedAsset.maintenanceRecords || [];
      const updated = {
        ...selectedAsset,
        maintenanceRecords: [
          ...records,
          {
            date: newMaintenance.date,
            type: newMaintenance.type,
            description: newMaintenance.description,
            cost: newMaintenance.cost ? parseFloat(newMaintenance.cost) : 0,
            performedBy: "Admin User"
          }
        ]
      };
      updateAsset.mutate({
        id: selectedAsset.id,
        data: updated
      });
      setNewMaintenance({ date: "", type: "Preventive Maintenance", description: "", cost: "" });
      setIsMaintenanceOpen(false);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this asset?")) {
      deleteAsset.mutate({ id });
    }
  };

  const statCards = [
    { label: "Total Assets", value: stats?.total || 0, icon: FolderOpen, color: "text-blue-600", bg: "bg-blue-600/10" },
    { label: "Available", value: stats?.available || 0, icon: FileImage, color: "text-emerald-600", bg: "bg-emerald-600/10" },
    { label: "In Use", value: stats?.inUse || 0, icon: BarChart3, color: "text-amber-600", bg: "bg-amber-600/10" },
    { label: "Under Maintenance", value: stats?.maintenance || 0, icon: Wrench, color: "text-purple-600", bg: "bg-purple-600/10" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'available': return <Badge className="bg-emerald-500">Available</Badge>;
      case 'in use': return <Badge className="bg-blue-500">In Use</Badge>;
      case 'maintenance': return <Badge className="bg-amber-500">Maintenance</Badge>;
      case 'retired': return <Badge className="bg-destructive">Retired</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const getConditionBadge = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case 'excellent': return <Badge variant="outline" className="border-emerald-500 text-emerald-600">Excellent</Badge>;
      case 'good': return <Badge variant="outline" className="border-blue-500 text-blue-600">Good</Badge>;
      case 'fair': return <Badge variant="outline" className="border-amber-500 text-amber-600">Fair</Badge>;
      case 'poor': return <Badge variant="outline" className="border-destructive text-destructive">Poor</Badge>;
      default: return <Badge variant="outline">{condition}</Badge>;
    }
  };

  const filteredAssets = filterCategory === "All" 
    ? assets 
    : assets.filter((a: any) => a.category === filterCategory);

  const categories = ["All", ...new Set(assets.map((a: any) => a.category))];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Asset Management</h2>
            <p className="text-muted-foreground">Track barangay vehicles, equipment, and fixed assets with maintenance history.</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" /> Register Asset</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Register New Asset</DialogTitle>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(handleCreateSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="assetName">Asset Name *</Label>
                    <Input id="assetName" {...form.register("assetName")} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assetCode">Asset Code / ID *</Label>
                    <Input id="assetCode" {...form.register("assetCode")} placeholder="e.g., AST-2024-001" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select onValueChange={(val) => form.setValue("category", val)} defaultValue={form.getValues("category")}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Transportation">Transportation</SelectItem>
                        <SelectItem value="Office Equipment">Office Equipment</SelectItem>
                        <SelectItem value="Furniture">Furniture</SelectItem>
                        <SelectItem value="Tools">Tools & Equipment</SelectItem>
                        <SelectItem value="General">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assetType">Asset Type</Label>
                    <Select onValueChange={(val) => form.setValue("assetType", val)} defaultValue={form.getValues("assetType")}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Vehicle">Vehicle</SelectItem>
                        <SelectItem value="Equipment">Equipment</SelectItem>
                        <SelectItem value="Furniture">Furniture</SelectItem>
                        <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input id="quantity" type="number" {...form.register("quantity")} defaultValue="1" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Input id="unit" {...form.register("unit")} placeholder="e.g., unit, set, pcs" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="acquisitionDate">Acquisition Date</Label>
                    <Input id="acquisitionDate" type="date" {...form.register("acquisitionDate")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="acquisitionCost">Acquisition Cost (PHP)</Label>
                    <Input id="acquisitionCost" type="number" {...form.register("acquisitionCost")} step="0.01" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location / Assigned To</Label>
                    <Input id="location" {...form.register("location")} placeholder="e.g., Barangay Hall" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assignedTo">Assigned To (Person/Office)</Label>
                    <Input id="assignedTo" {...form.register("assignedTo")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition</Label>
                    <Select onValueChange={(val) => form.setValue("condition", val)} defaultValue={form.getValues("condition")}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Excellent">Excellent</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Fair">Fair</SelectItem>
                        <SelectItem value="Poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select onValueChange={(val) => form.setValue("status", val)} defaultValue={form.getValues("status")}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="In Use">In Use</SelectItem>
                        <SelectItem value="Maintenance">Under Maintenance</SelectItem>
                        <SelectItem value="Retired">Retired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brandModel">Brand / Model</Label>
                    <Input id="brandModel" {...form.register("brandModel")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serialNumber">Serial / Plate Number</Label>
                    <Input id="serialNumber" {...form.register("serialNumber")} />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="description">Description / Remarks</Label>
                    <Textarea id="description" {...form.register("description")} rows={2} />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={createAsset.isPending}>
                    {createAsset.isPending ? "Registering..." : "Register Asset"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between pb-2">
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <div className={`w-8 h-8 rounded-full ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <div className="p-4 border-b flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assets..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat: string) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset Code</TableHead>
                  <TableHead>Asset Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">Loading...</TableCell>
                  </TableRow>
                ) : filteredAssets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No assets found</TableCell>
                  </TableRow>
                ) : (
                  filteredAssets.map((asset: any) => (
                    <TableRow key={asset.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openDetails(asset)}>
                      <TableCell className="font-mono text-sm">{asset.assetCode}</TableCell>
                      <TableCell className="font-medium">{asset.assetName}</TableCell>
                      <TableCell><Badge variant="outline">{asset.category}</Badge></TableCell>
                      <TableCell>{getStatusBadge(asset.status)}</TableCell>
                      <TableCell>{getConditionBadge(asset.condition)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{asset.assignedTo || "Unassigned"}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => openDetails(asset)}>
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {setSelectedAsset(asset); setIsMaintenanceOpen(true);}}>
                              <Wrench className="mr-2 h-4 w-4" /> Add Maintenance
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDelete(asset.id)} className="text-destructive">
                              <Trash className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Asset Information Sheet</DialogTitle>
          </DialogHeader>
          {selectedAsset && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">{selectedAsset.assetName}</h3>
                  <p className="text-sm text-muted-foreground font-mono">Code: {selectedAsset.assetCode}</p>
                </div>
                <div className="flex gap-2">{getStatusBadge(selectedAsset.status)}{getConditionBadge(selectedAsset.condition)}</div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm bg-muted/20 p-4 rounded-lg">
                <div><span className="text-muted-foreground block text-xs font-semibold">CATEGORY</span> {selectedAsset.category}</div>
                <div><span className="text-muted-foreground block text-xs font-semibold">TYPE</span> {selectedAsset.assetType}</div>
                <div><span className="text-muted-foreground block text-xs font-semibold">QUANTITY</span> {selectedAsset.quantity} {selectedAsset.unit}</div>
                <div><span className="text-muted-foreground block text-xs font-semibold">CONDITION</span> {selectedAsset.condition}</div>
                <div><span className="text-muted-foreground block text-xs font-semibold">LOCATION</span> {selectedAsset.location || "Not specified"}</div>
                <div><span className="text-muted-foreground block text-xs font-semibold">ASSIGNED TO</span> {selectedAsset.assignedTo || "Unassigned"}</div>
              </div>

              {(selectedAsset.brandModel || selectedAsset.serialNumber) && (
                <div className="grid grid-cols-2 gap-4 text-sm bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-900/30">
                  {selectedAsset.brandModel && <div><span className="text-muted-foreground block text-xs font-semibold">BRAND / MODEL</span> {selectedAsset.brandModel}</div>}
                  {selectedAsset.serialNumber && <div><span className="text-muted-foreground block text-xs font-semibold">SERIAL / PLATE NO.</span> {selectedAsset.serialNumber}</div>}
                </div>
              )}

              {selectedAsset.acquisitionDate && (
                <div className="grid grid-cols-2 gap-4 text-sm bg-muted/20 p-4 rounded-lg">
                  <div><span className="text-muted-foreground block text-xs font-semibold">ACQUISITION DATE</span> {format(new Date(selectedAsset.acquisitionDate), "MMM d, yyyy")}</div>
                  <div><span className="text-muted-foreground block text-xs font-semibold">ACQUISITION COST</span> {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(selectedAsset.acquisitionCost || 0)}</div>
                </div>
              )}

              {selectedAsset.description && (
                <div>
                  <span className="text-xs font-semibold text-muted-foreground block mb-2">DESCRIPTION / REMARKS</span>
                  <p className="text-sm text-foreground">{selectedAsset.description}</p>
                </div>
              )}

              {selectedAsset.maintenanceRecords && Array.isArray(selectedAsset.maintenanceRecords) && selectedAsset.maintenanceRecords.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Maintenance Record</h4>
                  <div className="space-y-3">
                    {selectedAsset.maintenanceRecords.map((record: any, idx: number) => (
                      <div key={idx} className="border rounded-lg p-3 bg-muted/30">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-semibold text-sm">{record.type}</div>
                            <div className="text-xs text-muted-foreground">{format(new Date(record.date), "MMM d, yyyy")}</div>
                          </div>
                          {record.cost && <div className="font-semibold text-sm">{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(record.cost)}</div>}
                        </div>
                        <p className="text-sm text-foreground">{record.description}</p>
                        {record.performedBy && <p className="text-xs text-muted-foreground mt-2">By: {record.performedBy}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>Close</Button>
                <Button onClick={() => {setIsMaintenanceOpen(true); setIsDetailsOpen(false);}}>
                  <Wrench className="w-4 h-4 mr-2" /> Add Maintenance
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isMaintenanceOpen} onOpenChange={setIsMaintenanceOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Maintenance Record</DialogTitle>
            <DialogDescription>{selectedAsset?.assetName} ({selectedAsset?.assetCode})</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mainDate">Date of Maintenance *</Label>
              <Input 
                id="mainDate"
                type="date" 
                value={newMaintenance.date}
                onChange={(e) => setNewMaintenance({...newMaintenance, date: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mainType">Type of Maintenance</Label>
              <Select value={newMaintenance.type} onValueChange={(val) => setNewMaintenance({...newMaintenance, type: val})}>
                <SelectTrigger id="mainType"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Preventive Maintenance">Preventive Maintenance</SelectItem>
                  <SelectItem value="General Repair">General Repair</SelectItem>
                  <SelectItem value="Parts Replacement">Parts Replacement</SelectItem>
                  <SelectItem value="Inspection">Inspection</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mainDesc">Description *</Label>
              <Textarea 
                id="mainDesc"
                value={newMaintenance.description}
                onChange={(e) => setNewMaintenance({...newMaintenance, description: e.target.value})}
                rows={3}
                placeholder="Details of maintenance performed..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mainCost">Cost (PHP)</Label>
              <Input 
                id="mainCost"
                type="number" 
                step="0.01"
                value={newMaintenance.cost}
                onChange={(e) => setNewMaintenance({...newMaintenance, cost: e.target.value})}
                placeholder="0.00"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsMaintenanceOpen(false)}>Cancel</Button>
              <Button onClick={handleAddMaintenance} disabled={updateAsset.isPending}>
                {updateAsset.isPending ? "Saving..." : "Save Record"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
