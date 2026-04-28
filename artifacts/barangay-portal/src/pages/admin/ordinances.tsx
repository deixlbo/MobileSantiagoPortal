import { AdminLayout } from "@/components/admin-layout";
import { useListOrdinances, useGetOrdinanceStats, useCreateOrdinance, useUpdateOrdinance, useDeleteOrdinance, getListOrdinancesQueryKey, getGetOrdinanceStatsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Scale, Plus, Search, Filter, FileText, CheckCircle2, AlertCircle, Edit, Trash, FileArchive, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Ordinances() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: stats } = useGetOrdinanceStats();
  const { data: ordinances = [], isLoading } = useListOrdinances({ search: search || undefined });

  const createOrdinance = useCreateOrdinance({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListOrdinancesQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetOrdinanceStatsQueryKey() });
        toast.success("Ordinance created successfully");
        setIsCreateOpen(false);
      }
    }
  });

  const updateOrdinance = useUpdateOrdinance({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListOrdinancesQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetOrdinanceStatsQueryKey() });
        toast.success("Ordinance updated successfully");
      }
    }
  });

  const deleteOrdinance = useDeleteOrdinance({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListOrdinancesQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetOrdinanceStatsQueryKey() });
        toast.success("Ordinance deleted successfully");
      }
    }
  });

  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createOrdinance.mutate({
      data: {
        ordinanceNumber: formData.get("ordinanceNumber") as string,
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        ordinanceType: formData.get("ordinanceType") as string,
        author: formData.get("author") as string,
        status: formData.get("status") as string,
        enactedDate: formData.get("enactedDate") as string || undefined,
      }
    });
  };

  const handleStatusUpdate = (id: number, status: string, currentData: any) => {
    updateOrdinance.mutate({ id, data: { ...currentData, status } });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this ordinance?")) {
      deleteOrdinance.mutate({ id });
    }
  };

  const statCards = [
    { label: "Total Ordinances", value: stats?.total || 0, icon: Scale, color: "text-blue-600", bg: "bg-blue-600/10" },
    { label: "Enacted", value: stats?.enacted || 0, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-600/10" },
    { label: "Draft", value: stats?.draft || 0, icon: FileText, color: "text-amber-600", bg: "bg-amber-600/10" },
    { label: "Repealed", value: stats?.repealed || 0, icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-600/10" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'enacted': return <Badge className="bg-emerald-500">Enacted</Badge>;
      case 'draft': return <Badge variant="secondary">Draft</Badge>;
      case 'repealed': return <Badge variant="destructive">Repealed</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Barangay Ordinances</h2>
            <p className="text-muted-foreground">Manage local laws, resolutions, and regulations.</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" /> New Ordinance</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Draft New Ordinance</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label htmlFor="ordinanceNumber">Ordinance/Resolution No.</Label>
                    <Input id="ordinanceNumber" name="ordinanceNumber" required placeholder="e.g. Ord No. 2024-01" />
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label htmlFor="ordinanceType">Type</Label>
                    <Select name="ordinanceType" defaultValue="Ordinance">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ordinance">Ordinance</SelectItem>
                        <SelectItem value="Resolution">Resolution</SelectItem>
                        <SelectItem value="Executive Order">Executive Order</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" required />
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label htmlFor="author">Author / Proponent</Label>
                    <Input id="author" name="author" required />
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue="draft">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="enacted">Enacted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label htmlFor="enactedDate">Enacted Date (if applicable)</Label>
                    <Input id="enactedDate" name="enactedDate" type="date" />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Attachment</Label>
                    <div className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                      <FileArchive className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                      <span className="text-sm font-medium">Click to upload PDF document</span>
                    </div>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="description">Description / Abstract</Label>
                    <Textarea id="description" name="description" rows={4} required />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={createOrdinance.isPending}>
                    {createOrdinance.isPending ? "Saving..." : "Save Document"}
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
                placeholder="Search ordinances..."
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
                  <TableHead>No.</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Enacted Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">Loading...</TableCell>
                  </TableRow>
                ) : ordinances.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No ordinances found</TableCell>
                  </TableRow>
                ) : (
                  ordinances.map((ord) => (
                    <TableRow key={ord.id}>
                      <TableCell className="font-medium whitespace-nowrap">{ord.ordinanceNumber}</TableCell>
                      <TableCell className="max-w-[300px]">
                        <div className="font-medium truncate" title={ord.title}>{ord.title}</div>
                        <div className="text-xs text-muted-foreground truncate">{ord.description}</div>
                      </TableCell>
                      <TableCell>{ord.ordinanceType}</TableCell>
                      <TableCell>{ord.author}</TableCell>
                      <TableCell>{ord.enactedDate ? format(new Date(ord.enactedDate), "MMM d, yyyy") : '-'}</TableCell>
                      <TableCell>{getStatusBadge(ord.status)}</TableCell>
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
                              <FileText className="mr-2 h-4 w-4" /> View Document
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" /> Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {ord.status === 'draft' && (
                              <DropdownMenuItem onClick={() => handleStatusUpdate(ord.id, 'enacted', ord)} className="text-emerald-600">
                                Mark Enacted
                              </DropdownMenuItem>
                            )}
                            {ord.status === 'enacted' && (
                              <DropdownMenuItem onClick={() => handleStatusUpdate(ord.id, 'repealed', ord)} className="text-rose-600">
                                Mark Repealed
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDelete(ord.id)} className="text-destructive">
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
