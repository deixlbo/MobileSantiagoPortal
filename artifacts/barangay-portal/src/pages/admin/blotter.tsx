import { AdminLayout } from "@/components/admin-layout";
import { useListBlotterReports, useGetBlotterStats, useCreateBlotterReport, useUpdateBlotterReport, getListBlotterReportsQueryKey, getGetBlotterStatsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { FileWarning, AlertCircle, Search, Filter, Plus, MoreHorizontal, ShieldAlert, CheckCircle2, FileText } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PrintModal, BlotterTemplate } from "@/components/document-template";

const blotterSchema = z.object({
  reporter: z.string().min(1, "Required"),
  respondent: z.string().optional(),
  category: z.string().min(1, "Required"),
  location: z.string().min(1, "Required"),
  dateReported: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  status: z.string().default("pending"),
});

const updateSchema = z.object({
  status: z.string().min(1, "Required"),
  resolutionNotes: z.string().optional(),
  dateResolved: z.string().optional(),
  preparedBy: z.string().optional(),
  actionTaken: z.string().optional(),
  description: z.string().min(1),
});

export default function Blotter() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const { data: stats } = useGetBlotterStats();
  const { data: reports = [], isLoading } = useListBlotterReports({ search: search || undefined });

  const createReport = useCreateBlotterReport({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListBlotterReportsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetBlotterStatsQueryKey() });
        toast.success("Blotter report created successfully");
        setIsCreateOpen(false);
        createForm.reset();
      }
    }
  });

  const updateReport = useUpdateBlotterReport({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListBlotterReportsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetBlotterStatsQueryKey() });
        toast.success("Report updated successfully");
        setSelectedReport(null);
      }
    }
  });

  const createForm = useForm<z.infer<typeof blotterSchema>>({
    resolver: zodResolver(blotterSchema),
    defaultValues: {
      category: "Others",
      dateReported: new Date().toISOString().split('T')[0],
      status: "pending",
    }
  });

  const updateForm = useForm<z.infer<typeof updateSchema>>({
    resolver: zodResolver(updateSchema)
  });

  const handleCreateSubmit = (data: z.infer<typeof blotterSchema>) => {
    createReport.mutate({ data });
  };

  const handleUpdateSubmit = (data: z.infer<typeof updateSchema>) => {
    if (!selectedReport) return;
    const merged = {
      reporter: selectedReport.reporter,
      respondent: selectedReport.respondent,
      category: selectedReport.category,
      location: selectedReport.location,
      dateReported: selectedReport.dateReported,
      ...data,
    };
    updateReport.mutate({ id: selectedReport.id, data: merged });
  };

  const openUpdateModal = (report: any) => {
    setSelectedReport(report);
    updateForm.reset({
      status: report.status,
      resolutionNotes: report.resolutionNotes || "",
      dateResolved: report.dateResolved ? new Date(report.dateResolved).toISOString().split('T')[0] : "",
      preparedBy: report.preparedBy || "",
      actionTaken: report.actionTaken || "",
      description: report.description,
    });
  };

  const handlePrint = (report: any) => {
    setSelectedReport(report);
    setIsPrintModalOpen(true);
  };

  const statCards = [
    { label: "Total Reports", value: stats?.total || 0, icon: FileWarning, color: "text-blue-600", bg: "bg-blue-600/10" },
    { label: "Pending", value: stats?.pending || 0, icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-600/10" },
    { label: "Investigating", value: stats?.investigating || 0, icon: ShieldAlert, color: "text-indigo-600", bg: "bg-indigo-600/10" },
    { label: "Resolved", value: stats?.resolved || 0, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-600/10" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved': return <Badge className="bg-emerald-500">Resolved</Badge>;
      case 'investigating': return <Badge className="bg-blue-500">Investigating</Badge>;
      case 'for-mediation': return <Badge className="bg-purple-500">For Mediation</Badge>;
      case 'archived': return <Badge variant="secondary">Archived</Badge>;
      default: return <Badge className="bg-amber-500">Pending</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Blotter Reports</h2>
            <p className="text-muted-foreground">Manage incidents, complaints, and barangay disputes.</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-700 hover:bg-red-800 text-white"><Plus className="w-4 h-4 mr-2" /> File Report</Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>File New Blotter Report</DialogTitle>
              </DialogHeader>
              <form onSubmit={createForm.handleSubmit(handleCreateSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label>Complainant / Reporter</Label>
                    <Input {...createForm.register("reporter")} required />
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label>Respondent / Accused (Optional)</Label>
                    <Input {...createForm.register("respondent")} />
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label>Incident Category</Label>
                    <Select onValueChange={(val) => createForm.setValue("category", val)} defaultValue={createForm.getValues("category")}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Noise Complaint">Noise Complaint</SelectItem>
                        <SelectItem value="Theft">Theft/Robbery</SelectItem>
                        <SelectItem value="Property Damage">Property Damage</SelectItem>
                        <SelectItem value="Animal Complaint">Animal Complaint</SelectItem>
                        <SelectItem value="Physical Altercation">Physical Altercation</SelectItem>
                        <SelectItem value="Others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label>Date of Incident</Label>
                    <Input type="date" {...createForm.register("dateReported")} required />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Exact Location</Label>
                    <Input {...createForm.register("location")} required />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Incident Narrative</Label>
                    <Textarea {...createForm.register("description")} rows={4} required />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={createReport.isPending}>
                    {createReport.isPending ? "Filing..." : "Submit Report"}
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
                placeholder="Search records..."
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
                  <TableHead>Case Ref</TableHead>
                  <TableHead>Reporter</TableHead>
                  <TableHead>Respondent</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">Loading...</TableCell>
                  </TableRow>
                ) : reports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No blotter records found</TableCell>
                  </TableRow>
                ) : (
                  reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-mono text-sm font-medium">{report.referenceNo}</TableCell>
                      <TableCell className="font-medium">{report.reporter}</TableCell>
                      <TableCell>{report.respondent || '-'}</TableCell>
                      <TableCell>{report.category}</TableCell>
                      <TableCell>{format(new Date(report.dateReported), "MMM d, yyyy")}</TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => openUpdateModal(report)}>View / Update Case</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handlePrint(report)}><FileText className="w-4 h-4 mr-2" /> Print Report</DropdownMenuItem>
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

      <Dialog open={!!selectedReport && !isPrintModalOpen} onOpenChange={(open) => !open && setSelectedReport(null)}>
        {selectedReport && (
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between pr-6">
                <DialogTitle>Case {selectedReport.referenceNo}</DialogTitle>
                {getStatusBadge(selectedReport.status)}
              </div>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4 text-sm mt-4 p-4 bg-muted/20 rounded-lg">
              <div><span className="font-medium">Complainant:</span> {selectedReport.reporter}</div>
              <div><span className="font-medium">Respondent:</span> {selectedReport.respondent || '-'}</div>
              <div><span className="font-medium">Date Reported:</span> {format(new Date(selectedReport.dateReported), "MMMM d, yyyy")}</div>
              <div><span className="font-medium">Category:</span> {selectedReport.category}</div>
              <div className="col-span-2"><span className="font-medium">Location:</span> {selectedReport.location}</div>
              <div className="col-span-2">
                <span className="font-medium">Narrative:</span>
                <p className="mt-1 p-3 bg-background rounded border whitespace-pre-wrap">{selectedReport.description}</p>
              </div>
            </div>

            <div className="mt-6 border-t pt-4">
              <h3 className="font-semibold mb-4">Update Case Status</h3>
              <form onSubmit={updateForm.handleSubmit(handleUpdateSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label>Status</Label>
                    <Select onValueChange={(val) => updateForm.setValue("status", val)} defaultValue={updateForm.getValues("status")}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="investigating">Investigating</SelectItem>
                        <SelectItem value="for-mediation">For Mediation</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label>Date Resolved</Label>
                    <Input type="date" {...updateForm.register("dateResolved")} />
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label>Prepared By</Label>
                    <Input {...updateForm.register("preparedBy")} placeholder="Officer in charge" />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Action Taken</Label>
                    <Textarea {...updateForm.register("actionTaken")} rows={3} placeholder="Describe actions taken by the barangay..." />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Resolution Notes</Label>
                    <Textarea {...updateForm.register("resolutionNotes")} rows={3} placeholder="Final resolution or agreement..." />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setSelectedReport(null)}>Cancel</Button>
                  <Button type="submit" disabled={updateReport.isPending}>
                    {updateReport.isPending ? "Saving..." : "Save Updates"}
                  </Button>
                </div>
              </form>
            </div>
          </DialogContent>
        )}
      </Dialog>

      <PrintModal 
        title="Print Blotter Report"
        open={isPrintModalOpen}
        onOpenChange={setIsPrintModalOpen}
      >
        {selectedReport && <BlotterTemplate report={selectedReport} />}
      </PrintModal>

    </AdminLayout>
  );
}
