import { AdminLayout } from "@/components/admin-layout";
import { useListDocumentRequests, useGetDocumentStats, useUpdateDocumentRequest, getListDocumentRequestsQueryKey, getGetDocumentStatsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Search, Filter, Clock, CheckCircle2, FileClock, Printer, Eye, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function DocumentsAdmin() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: stats } = useGetDocumentStats();
  const { data: requests = [], isLoading } = useListDocumentRequests({ search: search || undefined });

  const updateRequest = useUpdateDocumentRequest({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListDocumentRequestsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetDocumentStatsQueryKey() });
        toast.success("Request status updated successfully");
      }
    }
  });

  const handleStatusUpdate = (id: number, status: string, currentData: any) => {
    updateRequest.mutate({ id, data: { ...currentData, status } });
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

  const steps = [
    { id: 'pending', label: 'Requested' },
    { id: 'processing', label: 'Processing' },
    { id: 'ready', label: 'Ready for Pickup' },
    { id: 'claimed', label: 'Claimed' }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Document Requests</h2>
            <p className="text-muted-foreground">Manage resident requests for clearances and certificates.</p>
          </div>
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
                  <TableHead>Ref No.</TableHead>
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
                      <TableCell className="font-mono text-sm font-medium">{req.referenceNo}</TableCell>
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
                            <Dialog>
                              <DialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Eye className="mr-2 h-4 w-4" /> View Details
                                </DropdownMenuItem>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <div className="flex items-center justify-between pr-6">
                                    <DialogTitle>Request {req.referenceNo}</DialogTitle>
                                    {getStatusBadge(req.status)}
                                  </div>
                                </DialogHeader>
                                <div className="mt-6">
                                  {/* Stepper */}
                                  <div className="relative flex justify-between mb-8">
                                    <div className="absolute left-0 top-1/2 w-full h-0.5 bg-muted -z-10 -translate-y-1/2"></div>
                                    {steps.map((step, idx) => {
                                      const currentIndex = steps.findIndex(s => s.id === req.status);
                                      const isCompleted = currentIndex >= idx || req.status === 'claimed';
                                      const isCurrent = req.status === step.id;
                                      
                                      return (
                                        <div key={step.id} className="flex flex-col items-center gap-2">
                                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 ${isCompleted ? 'bg-primary border-primary text-primary-foreground' : 'bg-background border-muted text-muted-foreground'}`}>
                                            {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                                          </div>
                                          <span className={`text-xs font-medium ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`}>{step.label}</span>
                                        </div>
                                      );
                                    })}
                                  </div>

                                  <div className="grid grid-cols-2 gap-4 text-sm mt-8 border-t pt-6">
                                    <div>
                                      <div className="text-muted-foreground mb-1">Resident</div>
                                      <div className="font-medium">{req.residentName}</div>
                                    </div>
                                    <div>
                                      <div className="text-muted-foreground mb-1">Document Requested</div>
                                      <div className="font-medium">{req.documentType}</div>
                                    </div>
                                    <div>
                                      <div className="text-muted-foreground mb-1">Purpose</div>
                                      <div className="font-medium">{req.purpose}</div>
                                    </div>
                                    <div>
                                      <div className="text-muted-foreground mb-1">Amount</div>
                                      <div className="font-medium">{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(req.price)}</div>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <DropdownMenuItem>
                              <Printer className="mr-2 h-4 w-4" /> Print Document
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {req.status === 'pending' && (
                              <DropdownMenuItem onClick={() => handleStatusUpdate(req.id, 'processing', req)} className="text-purple-600">Mark as Processing</DropdownMenuItem>
                            )}
                            {req.status === 'processing' && (
                              <DropdownMenuItem onClick={() => handleStatusUpdate(req.id, 'ready', req)} className="text-emerald-600">Mark as Ready</DropdownMenuItem>
                            )}
                            {req.status === 'ready' && (
                              <DropdownMenuItem onClick={() => handleStatusUpdate(req.id, 'claimed', req)} className="text-emerald-600">Mark as Claimed</DropdownMenuItem>
                            )}
                            {req.status !== 'claimed' && req.status !== 'rejected' && (
                              <DropdownMenuItem onClick={() => handleStatusUpdate(req.id, 'rejected', req)} className="text-destructive">Reject Request</DropdownMenuItem>
                            )}
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
