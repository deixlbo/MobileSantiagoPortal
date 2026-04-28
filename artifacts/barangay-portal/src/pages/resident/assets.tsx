import { ResidentLayout } from "@/components/resident-layout";
import { useListAssets } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Search, Download, FileImage, FileText, Film, FolderOpen, File } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

export default function ResidentAssets() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedAsset, setSelectedAsset] = useState<any>(null);

  const { data: assets = [], isLoading } = useListAssets({ 
    search: search || undefined,
    type: typeFilter !== "all" ? typeFilter : undefined 
  });

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'image': return <FileImage className="w-8 h-8 text-amber-500" />;
      case 'video': return <Film className="w-8 h-8 text-purple-500" />;
      case 'document': return <FileText className="w-8 h-8 text-emerald-500" />;
      default: return <File className="w-8 h-8 text-muted-foreground" />;
    }
  };

  const formatSize = (kb: number) => {
    if (kb < 1024) return `${kb} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  const handleDownload = () => {
    toast.success(`Download started for ${selectedAsset.fileName}`);
    setSelectedAsset(null);
  };

  return (
    <ResidentLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Public Files & Assets</h2>
          <p className="text-muted-foreground">Download public forms, event photos, and barangay media.</p>
        </div>

        <Card>
          <div className="p-4 border-b flex flex-col sm:flex-row gap-4 items-center justify-between bg-muted/10">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files by name..."
                className="pl-8 bg-background"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="All File Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All File Types</SelectItem>
                  <SelectItem value="document">Documents (PDF/Doc)</SelectItem>
                  <SelectItem value="image">Images (PNG/JPG)</SelectItem>
                  <SelectItem value="video">Videos (MP4)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px] text-center">Type</TableHead>
                  <TableHead>File Name & Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Date Uploaded</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">Loading files...</TableCell>
                  </TableRow>
                ) : assets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3 text-muted-foreground">
                        <FolderOpen className="w-10 h-10 opacity-40" />
                        <p>No public files match your search criteria.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  assets.map((asset) => (
                    <TableRow 
                      key={asset.id} 
                      className="hover:bg-muted/30 cursor-pointer transition-colors"
                      onClick={() => setSelectedAsset(asset)}
                    >
                      <TableCell className="text-center flex justify-center py-4">
                        {getFileIcon(asset.type)}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="font-semibold text-foreground">{asset.fileName}</div>
                        {asset.description && (
                          <div className="text-sm text-muted-foreground mt-1 line-clamp-1 max-w-md">
                            {asset.description}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-normal">{asset.category}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatSize(asset.sizeKb)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(asset.uploadedDate), "MMM d, yyyy")}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      <Dialog open={!!selectedAsset} onOpenChange={(open) => !open && setSelectedAsset(null)}>
        {selectedAsset && (
          <DialogContent className="max-w-md">
            <DialogHeader>
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4 mx-auto border border-border">
                {getFileIcon(selectedAsset.type)}
              </div>
              <DialogTitle className="text-center text-xl break-all">{selectedAsset.fileName}</DialogTitle>
              <DialogDescription className="text-center">
                {selectedAsset.category} • {formatSize(selectedAsset.sizeKb)}
              </DialogDescription>
            </DialogHeader>

            {/* Preview Placeholder */}
            <div className="my-6 aspect-video bg-muted/30 rounded-lg border-2 border-dashed border-border/50 flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
              {selectedAsset.type === 'image' ? (
                <>
                  <FileImage className="w-12 h-12 mb-2 opacity-50" />
                  <p className="text-sm font-medium">Image Preview Unavailable</p>
                </>
              ) : selectedAsset.type === 'video' ? (
                <>
                  <Film className="w-12 h-12 mb-2 opacity-50" />
                  <p className="text-sm font-medium">Video Player Unavailable</p>
                </>
              ) : (
                <>
                  <FileText className="w-12 h-12 mb-2 opacity-50" />
                  <p className="text-sm font-medium">Document Preview Unavailable</p>
                </>
              )}
              <p className="text-xs mt-1">Please download the file to view its contents.</p>
            </div>

            {selectedAsset.description && (
              <div className="mb-6 bg-muted/50 p-4 rounded-md text-sm text-center">
                {selectedAsset.description}
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setSelectedAsset(null)}>Close</Button>
              <Button className="flex-1 shadow-md" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" /> Download
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </ResidentLayout>
  );
}
