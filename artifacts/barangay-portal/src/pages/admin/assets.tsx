import { AdminLayout } from "@/components/admin-layout";
import { useListAssets, useGetAssetStats, useCreateAsset, useDeleteAsset, getListAssetsQueryKey, getGetAssetStatsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Plus, FileImage, FileText, Film, FolderOpen, Download, Trash, MoreHorizontal, File } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Assets() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: stats } = useGetAssetStats();
  const { data: assets = [], isLoading } = useListAssets({ search: search || undefined });

  const createAsset = useCreateAsset({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAssetsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetAssetStatsQueryKey() });
        toast.success("Asset uploaded successfully");
        setIsCreateOpen(false);
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

  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createAsset.mutate({
      data: {
        fileName: formData.get("fileName") as string,
        type: formData.get("type") as string,
        category: formData.get("category") as string,
        description: formData.get("description") as string || undefined,
        sizeKb: Math.floor(Math.random() * 5000) + 100, // mock size
        uploadedBy: "Admin User",
      }
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this asset?")) {
      deleteAsset.mutate({ id });
    }
  };

  const statCards = [
    { label: "Total Assets", value: stats?.total || 0, icon: FolderOpen, color: "text-blue-600", bg: "bg-blue-600/10" },
    { label: "Documents", value: stats?.documents || 0, icon: FileText, color: "text-emerald-600", bg: "bg-emerald-600/10" },
    { label: "Images", value: stats?.images || 0, icon: FileImage, color: "text-amber-600", bg: "bg-amber-600/10" },
    { label: "Videos", value: stats?.videos || 0, icon: Film, color: "text-purple-600", bg: "bg-purple-600/10" },
  ];

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'image': return <FileImage className="w-5 h-5 text-amber-500" />;
      case 'video': return <Film className="w-5 h-5 text-purple-500" />;
      case 'document': return <FileText className="w-5 h-5 text-emerald-500" />;
      default: return <File className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const formatSize = (kb: number) => {
    if (kb < 1024) return `${kb} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Digital Assets</h2>
            <p className="text-muted-foreground">Manage uploaded files, documents, and media.</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" /> Upload Asset</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Upload New Asset</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>File Upload</Label>
                  <div className="border-2 border-dashed rounded-md p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <FolderOpen className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <span className="text-sm font-medium">Click to upload or drag and drop</span>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG, PDF, MP4 up to 50MB</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fileName">Display Name</Label>
                  <Input id="fileName" name="fileName" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">File Type</Label>
                    <Select name="type" defaultValue="document">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="document">Document (PDF/Doc)</SelectItem>
                        <SelectItem value="image">Image (PNG/JPG)</SelectItem>
                        <SelectItem value="video">Video (MP4)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" defaultValue="General">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General">General</SelectItem>
                        <SelectItem value="Project">Project File</SelectItem>
                        <SelectItem value="Ordinance">Ordinance Doc</SelectItem>
                        <SelectItem value="Profile">Profile Picture</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input id="description" name="description" />
                </div>
                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={createAsset.isPending}>
                    {createAsset.isPending ? "Uploading..." : "Upload File"}
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
          <div className="p-4 border-b flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" className="w-full sm:w-auto"><Filter className="w-4 h-4 mr-2" /> Filter Types</Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>File Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Uploaded By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">Loading...</TableCell>
                  </TableRow>
                ) : assets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No assets found</TableCell>
                  </TableRow>
                ) : (
                  assets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="text-center">
                        {getFileIcon(asset.type)}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium truncate max-w-[250px]" title={asset.fileName}>{asset.fileName}</div>
                        {asset.description && <div className="text-xs text-muted-foreground truncate max-w-[250px]">{asset.description}</div>}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{asset.category}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{formatSize(asset.sizeKb)}</TableCell>
                      <TableCell>{asset.uploadedBy}</TableCell>
                      <TableCell>{format(new Date(asset.uploadedDate), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" /> Download
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
    </AdminLayout>
  );
}
