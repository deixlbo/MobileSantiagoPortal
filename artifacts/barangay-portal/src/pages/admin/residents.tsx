import { AdminLayout } from "@/components/admin-layout";
import { useListResidents, useGetResidentStats, useUpdateResident, useCreateResident, useDeleteResident, getListResidentsQueryKey, getGetResidentStatsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, UserCheck, Clock, CalendarDays, Search, Filter, Plus, MoreHorizontal, Edit, Trash, CheckCircle2, XCircle, Eye } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const residentSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  purok: z.string().min(1),
  gender: z.string().min(1),
  civilStatus: z.string().min(1),
  birthDate: z.string().min(1),
  address: z.string().min(1),
  status: z.string(),
});

export default function Residents() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedResident, setSelectedResident] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const { data: stats } = useGetResidentStats();
  const { data: residents = [], isLoading } = useListResidents({ 
    search: search || undefined, 
    status: statusFilter !== "all" ? (statusFilter as any) : undefined 
  });

  const updateResident = useUpdateResident({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListResidentsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetResidentStatsQueryKey() });
        toast.success("Resident updated successfully");
        setIsEditOpen(false);
      }
    }
  });

  const createResident = useCreateResident({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListResidentsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetResidentStatsQueryKey() });
        toast.success("Resident created successfully");
        setIsCreateOpen(false);
        form.reset();
      }
    }
  });

  const deleteResident = useDeleteResident({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListResidentsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetResidentStatsQueryKey() });
        toast.success("Resident deleted successfully");
      }
    }
  });

  const form = useForm<z.infer<typeof residentSchema>>({
    resolver: zodResolver(residentSchema),
    defaultValues: {
      purok: "Purok 1",
      gender: "Male",
      civilStatus: "Single",
      status: "active"
    }
  });

  const editForm = useForm<z.infer<typeof residentSchema>>({
    resolver: zodResolver(residentSchema)
  });

  const handleCreateSubmit = (data: z.infer<typeof residentSchema>) => {
    createResident.mutate({ data });
  };

  const handleEditSubmit = (data: z.infer<typeof residentSchema>) => {
    if (selectedResident) {
      updateResident.mutate({ id: selectedResident.id, data });
    }
  };

  const handleStatusUpdate = (id: number, status: string, currentData: any) => {
    updateResident.mutate({ id, data: { ...currentData, status } });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this resident record?")) {
      deleteResident.mutate({ id });
    }
  };

  const openEdit = (res: any) => {
    setSelectedResident(res);
    editForm.reset({
      fullName: res.fullName,
      email: res.email,
      phone: res.phone,
      purok: res.purok,
      gender: res.gender,
      civilStatus: res.civilStatus,
      birthDate: res.birthDate ? new Date(res.birthDate).toISOString().split('T')[0] : "",
      address: res.address,
      status: res.status,
    });
    setIsEditOpen(true);
  };

  const openView = (res: any) => {
    setSelectedResident(res);
    setIsViewOpen(true);
  };

  const statCards = [
    { label: "Total Residents", value: stats?.total || 0, icon: Users, color: "text-blue-600", bg: "bg-blue-600/10" },
    { label: "Active", value: stats?.active || 0, icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-600/10" },
    { label: "Pending Verification", value: stats?.pending || 0, icon: Clock, color: "text-amber-600", bg: "bg-amber-600/10" },
    { label: "Added This Month", value: stats?.thisMonth || 0, icon: CalendarDays, color: "text-purple-600", bg: "bg-purple-600/10" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Residents Directory</h2>
            <p className="text-muted-foreground">Manage barangay residents and verifications.</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" /> Add Resident</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Resident</DialogTitle>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(handleCreateSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input {...form.register("fullName")} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" {...form.register("email")} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input {...form.register("phone")} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Purok</Label>
                    <Select onValueChange={(val) => form.setValue("purok", val)} defaultValue={form.getValues("purok")}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 7 }).map((_, i) => (
                          <SelectItem key={i} value={`Purok ${i+1}`}>Purok {i+1}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select onValueChange={(val) => form.setValue("gender", val)} defaultValue={form.getValues("gender")}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Civil Status</Label>
                    <Select onValueChange={(val) => form.setValue("civilStatus", val)} defaultValue={form.getValues("civilStatus")}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Married">Married</SelectItem>
                        <SelectItem value="Widowed">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Birth Date</Label>
                    <Input type="date" {...form.register("birthDate")} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select onValueChange={(val) => form.setValue("status", val)} defaultValue={form.getValues("status")}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Address</Label>
                    <Input {...form.register("address")} required />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={createResident.isPending}>
                    {createResident.isPending ? "Saving..." : "Save Resident"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Resident</DialogTitle>
            </DialogHeader>
            <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input {...editForm.register("fullName")} required />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" {...editForm.register("email")} required />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input {...editForm.register("phone")} required />
                </div>
                <div className="space-y-2">
                  <Label>Purok</Label>
                  <Select onValueChange={(val) => editForm.setValue("purok", val)} defaultValue={editForm.getValues("purok")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 7 }).map((_, i) => (
                        <SelectItem key={i} value={`Purok ${i+1}`}>Purok {i+1}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select onValueChange={(val) => editForm.setValue("gender", val)} defaultValue={editForm.getValues("gender")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Civil Status</Label>
                  <Select onValueChange={(val) => editForm.setValue("civilStatus", val)} defaultValue={editForm.getValues("civilStatus")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Married">Married</SelectItem>
                      <SelectItem value="Widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Birth Date</Label>
                  <Input type="date" {...editForm.register("birthDate")} required />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select onValueChange={(val) => editForm.setValue("status", val)} defaultValue={editForm.getValues("status")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Address</Label>
                  <Input {...editForm.register("address")} required />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={updateResident.isPending}>
                  {updateResident.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Resident Profile</DialogTitle>
            </DialogHeader>
            {selectedResident && (
              <div className="space-y-4 text-sm mt-4">
                <div className="flex items-center gap-4 border-b pb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                    {selectedResident.fullName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{selectedResident.fullName}</h3>
                    <div className="flex gap-2 mt-1">
                      <Badge variant={selectedResident.status === 'active' ? 'default' : selectedResident.status === 'pending' ? 'secondary' : 'destructive'}
                        className={selectedResident.status === 'active' ? 'bg-emerald-500 text-white' : selectedResident.status === 'pending' ? 'bg-amber-500 text-white' : ''}>
                        {selectedResident.status.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">{selectedResident.purok}</Badge>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                  <div><span className="text-muted-foreground block mb-1">Email</span>{selectedResident.email}</div>
                  <div><span className="text-muted-foreground block mb-1">Phone</span>{selectedResident.phone}</div>
                  <div><span className="text-muted-foreground block mb-1">Gender</span>{selectedResident.gender}</div>
                  <div><span className="text-muted-foreground block mb-1">Civil Status</span>{selectedResident.civilStatus}</div>
                  <div><span className="text-muted-foreground block mb-1">Birth Date</span>{selectedResident.birthDate ? format(new Date(selectedResident.birthDate), "MMMM d, yyyy") : '-'}</div>
                  <div className="col-span-2"><span className="text-muted-foreground block mb-1">Full Address</span>{selectedResident.address}</div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

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
                placeholder="Search residents..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Purok</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">Loading...</TableCell>
                  </TableRow>
                ) : residents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No residents found</TableCell>
                  </TableRow>
                ) : (
                  residents.map((resident) => (
                    <TableRow key={resident.id}>
                      <TableCell className="font-medium">
                        <div>{resident.fullName}</div>
                        <div className="text-xs text-muted-foreground">{resident.email}</div>
                      </TableCell>
                      <TableCell>{resident.phone}</TableCell>
                      <TableCell>{resident.purok}</TableCell>
                      <TableCell>{format(new Date(resident.createdAt), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={resident.status === 'active' ? 'default' : resident.status === 'pending' ? 'secondary' : 'destructive'}
                          className={resident.status === 'active' ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : resident.status === 'pending' ? 'bg-amber-500 hover:bg-amber-600 text-white' : ''}
                        >
                          {resident.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => openView(resident)}>
                              <Eye className="mr-2 w-4 h-4" /> View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEdit(resident)}>
                              <Edit className="mr-2 w-4 h-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {resident.status !== 'active' && (
                              <DropdownMenuItem onClick={() => handleStatusUpdate(resident.id, 'active', resident)} className="text-emerald-600">
                                <CheckCircle2 className="mr-2 w-4 h-4" /> Verify
                              </DropdownMenuItem>
                            )}
                            {resident.status !== 'inactive' && (
                              <DropdownMenuItem onClick={() => handleStatusUpdate(resident.id, 'inactive', resident)} className="text-destructive">
                                <XCircle className="mr-2 w-4 h-4" /> Reject
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDelete(resident.id)} className="text-destructive">
                              <Trash className="mr-2 w-4 h-4" /> Delete
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
