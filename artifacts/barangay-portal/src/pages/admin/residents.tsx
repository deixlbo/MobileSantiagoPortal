import { AdminLayout } from "@/components/admin-layout";
import { useListResidents, useGetResidentStats, useUpdateResident, useCreateResident, getListResidentsQueryKey, getGetResidentStatsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, UserCheck, Clock, CalendarDays, Search, Filter, Plus, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Residents() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

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
      }
    }
  });

  const handleStatusUpdate = (id: number, status: string) => {
    updateResident.mutate({ id, data: { status } });
  };

  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createResident.mutate({
      data: {
        fullName: formData.get("fullName") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        purok: formData.get("purok") as string,
        gender: formData.get("gender") as string,
        civilStatus: formData.get("civilStatus") as string,
        birthDate: formData.get("birthDate") as string,
        address: formData.get("address") as string,
        status: formData.get("status") as string,
      }
    });
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
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" name="fullName" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purok">Purok</Label>
                    <Select name="purok" defaultValue="Purok 1">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 7 }).map((_, i) => (
                          <SelectItem key={i} value={`Purok ${i+1}`}>Purok {i+1}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select name="gender" defaultValue="Male">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="civilStatus">Civil Status</Label>
                    <Select name="civilStatus" defaultValue="Single">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Married">Married</SelectItem>
                        <SelectItem value="Widowed">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Birth Date</Label>
                    <Input id="birthDate" name="birthDate" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue="active">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" name="address" required />
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
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {resident.status === 'pending' && (
                              <>
                                <DropdownMenuItem onClick={() => handleStatusUpdate(resident.id, 'active')} className="text-emerald-600">Activate</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusUpdate(resident.id, 'inactive')} className="text-destructive">Reject</DropdownMenuItem>
                              </>
                            )}
                            {resident.status === 'active' && (
                              <DropdownMenuItem onClick={() => handleStatusUpdate(resident.id, 'inactive')} className="text-destructive">Deactivate</DropdownMenuItem>
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
