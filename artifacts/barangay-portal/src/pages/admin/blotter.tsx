import { AdminLayout } from "@/components/admin-layout";
import { useListBlotterReports, useGetBlotterStats, useCreateBlotterReport, useUpdateBlotterReport, getListBlotterReportsQueryKey, getGetBlotterStatsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { FileWarning, AlertCircle, Search, Filter, Plus, MoreHorizontal, ShieldAlert, CheckCircle2, History, FolderOpen } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

export default function Blotter() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  const { data: stats } = useGetBlotterStats();
  const { data: reports = [], isLoading } = useListBlotterReports({ search: search || undefined });

  const createReport = useCreateBlotterReport({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListBlotterReportsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetBlotterStatsQueryKey() });
        toast.success("Blotter report created successfully");
        setIsCreateOpen(false);
      }
    }
  });

  const updateReport = useUpdateBlotterReport({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListBlotterReportsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetBlotterStatsQueryKey() });
        toast.success("Status updated successfully");
      }
    }
  });

  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createReport.mutate({
      data: {
        reporter: formData.get("reporter") as string,
        category: formData.get("category") as string,
        location: formData.get("location") as string,
        dateReported: formData.get("dateReported") as string,
        description: formData.get("description") as string,
        status: "pending",
      }
    });
  };

  const handleStatusUpdate = (id: number, status: string) => {
    updateReport.mutate({ id, data: { status, description: "" } }); // description is required by input schema, passing empty if not changing
  };

  const statCards = [
    { label: "Total Reports", value: stats?.total || 0, icon: FileWarning, color: "text-blue-600", bg: "bg-blue-600/10" },
    { label: "Pending", value: stats?.pending || 0, icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-600/10" },
    { label: "Investigating", value: stats?.investigating || 0, icon: ShieldAlert, color: "text-indigo-600", bg: "bg-indigo-600/10" },
    { label: "Resolved", value: stats?.resolved || 0, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-600/10" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved': return <Badge className="bg-emerald-500 hover:bg-emerald-600">Resolved</Badge>;
      case 'investigating': return <Badge className="bg-blue-500 hover:bg-blue-600">Investigating</Badge>;
      case 'dismissed': return <Badge variant="destructive">Dismissed</Badge>;
      default: return <Badge className="bg-amber-500 hover:bg-amber-600">Pending</Badge>;
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
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>File New Blotter Report</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label htmlFor="reporter">Complainant / Reporter</Label>
                    <Input id="reporter" name="reporter" required />
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label htmlFor="category">Incident Category</Label>
                    <Select name="category" defaultValue="Disturbance">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Disturbance">Noise/Disturbance</SelectItem>
                        <SelectItem value="Theft">Theft/Robbery</SelectItem>
                        <SelectItem value="Assault">Physical Altercation</SelectItem>
                        <SelectItem value="Property">Property Dispute</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label htmlFor="location">Location of Incident</Label>
                    <Input id="location" name="location" required />
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label htmlFor="dateReported">Date of Incident</Label>
                    <Input id="dateReported" name="dateReported" type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="description">Incident Narrative</Label>
                    <Textarea id="description" name="description" rows={4} required placeholder="Detailed description of the incident..." />
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
                placeholder="Search records, names..."
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
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">Loading records...</TableCell>
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
                      <TableCell>{report.category}</TableCell>
                      <TableCell className="max-w-[150px] truncate" title={report.location}>{report.location}</TableCell>
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
                            <Dialog>
                              <DialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>View Details</DropdownMenuItem>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <div className="flex items-center justify-between pr-6">
                                    <DialogTitle>Case {report.referenceNo}</DialogTitle>
                                    {getStatusBadge(report.status)}
                                  </div>
                                </DialogHeader>
                                <Tabs defaultValue="details" className="mt-4">
                                  <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="details">Details</TabsTrigger>
                                    <TabsTrigger value="investigation">Investigation</TabsTrigger>
                                    <TabsTrigger value="documents">Documents</TabsTrigger>
                                    <TabsTrigger value="history">History</TabsTrigger>
                                  </TabsList>
                                  <TabsContent value="details" className="space-y-4 mt-4">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <div className="text-muted-foreground mb-1">Complainant</div>
                                        <div className="font-medium">{report.reporter}</div>
                                      </div>
                                      <div>
                                        <div className="text-muted-foreground mb-1">Date Reported</div>
                                        <div className="font-medium">{format(new Date(report.dateReported), "MMMM d, yyyy")}</div>
                                      </div>
                                      <div>
                                        <div className="text-muted-foreground mb-1">Category</div>
                                        <div className="font-medium">{report.category}</div>
                                      </div>
                                      <div>
                                        <div className="text-muted-foreground mb-1">Location</div>
                                        <div className="font-medium">{report.location}</div>
                                      </div>
                                    </div>
                                    <div className="pt-4 border-t">
                                      <div className="text-muted-foreground text-sm mb-2">Incident Narrative</div>
                                      <p className="text-sm bg-muted/30 p-4 rounded-md whitespace-pre-wrap">
                                        {report.description}
                                      </p>
                                    </div>
                                  </TabsContent>
                                  <TabsContent value="investigation" className="mt-4">
                                    <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                                      <ShieldAlert className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                      <p>Investigation notes will appear here.</p>
                                      <Button variant="outline" size="sm" className="mt-4">Add Note</Button>
                                    </div>
                                  </TabsContent>
                                  <TabsContent value="documents" className="mt-4">
                                    <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                                      <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                      <p>Attached evidence and documents.</p>
                                      <Button variant="outline" size="sm" className="mt-4">Upload File</Button>
                                    </div>
                                  </TabsContent>
                                  <TabsContent value="history" className="mt-4">
                                    <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                                      <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                      <p>Case timeline and status changes.</p>
                                    </div>
                                  </TabsContent>
                                </Tabs>
                              </DialogContent>
                            </Dialog>
                            <DropdownMenuSeparator />
                            {report.status !== 'investigating' && report.status !== 'resolved' && (
                              <DropdownMenuItem onClick={() => handleStatusUpdate(report.id, 'investigating')} className="text-blue-600">Start Investigation</DropdownMenuItem>
                            )}
                            {report.status !== 'resolved' && (
                              <DropdownMenuItem onClick={() => handleStatusUpdate(report.id, 'resolved')} className="text-emerald-600">Mark Resolved</DropdownMenuItem>
                            )}
                            {report.status === 'pending' && (
                              <DropdownMenuItem onClick={() => handleStatusUpdate(report.id, 'dismissed')} className="text-destructive">Dismiss Case</DropdownMenuItem>
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
