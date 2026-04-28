import { AdminLayout } from "@/components/admin-layout";
import { useListDocumentRequests, useGetDocumentStats, useUpdateDocumentRequest, useDeleteDocumentRequest, useCreateDocumentRequest, getListDocumentRequestsQueryKey, getGetDocumentStatsQueryKey, useListResidents, useListDocumentCategories } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Search, Filter, Clock, CheckCircle2, FileClock, Printer, Eye, MoreHorizontal, Plus, Trash, Edit } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PrintModal, DocumentTemplate } from "@/components/document-template";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { formatPHP } from "@/lib/format";

const requestSchema = z.object({
  residentName: z.string().min(1, "Required"),
  residentId: z.coerce.number().optional(),
  documentType: z.string().min(1, "Required"),
  purpose: z.string().min(1, "Required"),
  price: z.coerce.number(),
  status: z.string().default("pending"),
  paymentMethod: z.string().optional(),
  businessName: z.string().optional(),
  businessAddress: z.string().optional(),
});

export default function DocumentsAdmin() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const { data: stats } = useGetDocumentStats();
  const { data: requests = [], isLoading } = useListDocumentRequests({ search: search || undefined });
  const { data: categories = [] } = useListDocumentCategories();
  const { data: residents = [] } = useListResidents();

  const createRequest = useCreateDocumentRequest({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListDocumentRequestsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetDocumentStatsQueryKey() });
        toast.success("Request created successfully");
        setIsCreateOpen(false);
        form.reset();
      }
    }
  });

  const updateRequest = useUpdateDocumentRequest({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListDocumentRequestsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetDocumentStatsQueryKey() });
        toast.success("Request updated successfully");
      }
    }
  });

  const deleteRequest = useDeleteDocumentRequest({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListDocumentRequestsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetDocumentStatsQueryKey() });
        toast.success("Request deleted");
      }
    }
  });

  const form = useForm<z.infer<typeof requestSchema>>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      status: "pending",
      paymentMethod: "cash",
      price: 0,
    }
  });

  const handleStatusUpdate = (id: number, status: string, currentData: any) => {
    updateRequest.mutate({ id, data: { ...currentData, status } });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this request?")) {
      deleteRequest.mutate({ id });
    }
  };

  const handleCreateSubmit = (data: z.infer<typeof requestSchema>) => {
    createRequest.mutate({ data: { ...data, requestedDate: new Date().toISOString() } });
  };

  const handlePreview = (req: any) => {
    setSelectedRequest(req);
    setIsPrintModalOpen(true);
  };

  const statCards = [
    { label: "Total Requests", value: stats?.total || 0, icon: FileText, color: "text-blue-600", bg: "bg-blue-600/10" },
    { label: "Pending", value: stats?.pending || 0, icon: Clock, color: "text-amber-600", bg: "bg-amber-600/10" },
    { label: "Processing", value: stats?.processing || 0, icon: FileClock, color: "text-purple-600", bg: "bg-purple-600/10" },
    { label: "Ready / Claimed", value: (stats?.ready || 0) + (stats?.claimed || 0), icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-600/10" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'claimed': return <Badge className="bg-emerald-500">Claimed</Badge>;
      case 'ready': return <Badge className="bg-emerald-500">Ready</Badge>;
      case 'processing': return <Badge className="bg-purple-500">Processing</Badge>;
      case 'rejected': return <Badge variant="destructive">Rejected</Badge>;
      default: return <Badge variant="secondary">Pending</Badge>;
    }
  };

  // Find resident data for the template if residentId exists
  const associatedResident = selectedRequest?.residentId ? residents.find(r => r.id === selectedRequest.residentId) : null;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Document Requests</h2>
            <p className="text-muted-foreground">Manage resident requests for clearances and certificates.</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" /> New Request</Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Create Document Request</DialogTitle>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(handleCreateSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label>Resident Name</Label>
                    <Input {...form.register("residentName")} required />
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label>Resident ID (Optional)</Label>
                    <Input type="number" {...form.register("residentId")} placeholder="For registered residents" />
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label>Document Type</Label>
                    <Select onValueChange={(val) => {
                      form.setValue("documentType", val);
                      const cat = categories.find(c => c.name === val);
                      if (cat) form.setValue("price", cat.price);
                    }}>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        {categories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label>Price (PHP)</Label>
                    <Input type="number" {...form.register("price")} required />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Purpose</Label>
                    <Input {...form.register("purpose")} required />
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label>Status</Label>
                    <Select onValueChange={(val) => form.setValue("status", val)} defaultValue={form.getValues("status")}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="ready">Ready</SelectItem>
                        <SelectItem value="claimed">Claimed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label>Payment Method</Label>
                    <Select onValueChange={(val) => form.setValue("paymentMethod", val)} defaultValue={form.getValues("paymentMethod")}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="gcash">GCash</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={createRequest.isPending}>
                    {createRequest.isPending ? "Creating..." : "Create Request"}
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
                placeholder="Search reference no, name..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" className="w-full sm:w-auto"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Control/Ref No.</TableHead>
                  <TableHead>Resident</TableHead>
                  <TableHead>Document Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">Loading...</TableCell>
                  </TableRow>
                ) : requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No requests found</TableCell>
                  </TableRow>
                ) : (
                  requests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-mono text-sm font-medium">
                        {req.controlNo || req.referenceNo}
                      </TableCell>
                      <TableCell className="font-medium">{req.residentName}</TableCell>
                      <TableCell>
                        <div>{req.documentType}</div>
                        <div className="text-xs text-muted-foreground">{req.purpose}</div>
                      </TableCell>
                      <TableCell>{format(new Date(req.requestedDate), "MMM d, yyyy")}</TableCell>
                      <TableCell>{getStatusBadge(req.status)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handlePreview(req)}>
                              <Eye className="mr-2 h-4 w-4" /> Preview / Print
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {req.status === 'pending' && (
                              <DropdownMenuItem onClick={() => handleStatusUpdate(req.id, 'processing', req)} className="text-purple-600">Mark Processing</DropdownMenuItem>
                            )}
                            {req.status === 'processing' && (
                              <DropdownMenuItem onClick={() => handleStatusUpdate(req.id, 'ready', req)} className="text-emerald-600">Mark Ready</DropdownMenuItem>
                            )}
                            {req.status === 'ready' && (
                              <DropdownMenuItem onClick={() => handleStatusUpdate(req.id, 'claimed', req)} className="text-emerald-600">Mark Claimed</DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDelete(req.id)} className="text-destructive">
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

      <PrintModal 
        title={`Preview: ${selectedRequest?.documentType}`}
        open={isPrintModalOpen}
        onOpenChange={setIsPrintModalOpen}
      >
        {selectedRequest && <DocumentTemplate request={selectedRequest} resident={associatedResident} />}
      </PrintModal>
    </AdminLayout>
  );
}
