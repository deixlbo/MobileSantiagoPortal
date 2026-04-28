import { AdminLayout } from "@/components/admin-layout";
import { useListAnnouncements, useGetAnnouncementStats, useCreateAnnouncement, useUpdateAnnouncement, useDeleteAnnouncement, getListAnnouncementsQueryKey, getGetAnnouncementStatsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Megaphone, Plus, Search, Filter, CalendarDays, Edit, Trash, FileText, Send, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const announcementSchema = z.object({
  title: z.string().min(1, "Required"),
  type: z.string().min(1, "Required"),
  status: z.string(),
  content: z.string().min(1, "Required"),
  eventDate: z.string().optional(),
  eventTime: z.string().optional(),
  location: z.string().optional(),
});

export default function Announcements() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const { data: stats } = useGetAnnouncementStats();
  const { data: announcements = [], isLoading } = useListAnnouncements({ search: search || undefined });

  const createAnnouncement = useCreateAnnouncement({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAnnouncementsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetAnnouncementStatsQueryKey() });
        toast.success("Announcement created successfully");
        setIsCreateOpen(false);
      }
    }
  });

  const updateAnnouncement = useUpdateAnnouncement({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAnnouncementsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetAnnouncementStatsQueryKey() });
        toast.success("Announcement updated successfully");
        setIsEditOpen(false);
      }
    }
  });

  const deleteAnnouncement = useDeleteAnnouncement({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAnnouncementsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetAnnouncementStatsQueryKey() });
        toast.success("Announcement deleted successfully");
      }
    }
  });

  const form = useForm<z.infer<typeof announcementSchema>>({
    resolver: zodResolver(announcementSchema),
    defaultValues: { type: "Announcement", status: "draft" }
  });

  const editForm = useForm<z.infer<typeof announcementSchema>>({
    resolver: zodResolver(announcementSchema)
  });

  const handleCreateSubmit = (data: z.infer<typeof announcementSchema>) => {
    createAnnouncement.mutate({ data });
  };

  const handleEditSubmit = (data: z.infer<typeof announcementSchema>) => {
    if (selectedItem) {
      updateAnnouncement.mutate({ id: selectedItem.id, data });
    }
  };

  const handleStatusUpdate = (id: number, status: string, title: string, type: string, content: string) => {
    updateAnnouncement.mutate({ id, data: { title, type, content, status } });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      deleteAnnouncement.mutate({ id });
    }
  };

  const openEdit = (item: any) => {
    setSelectedItem(item);
    editForm.reset({
      title: item.title,
      type: item.type,
      status: item.status,
      content: item.content,
      eventDate: item.eventDate ? new Date(item.eventDate).toISOString().split('T')[0] : "",
      eventTime: item.eventTime || "",
      location: item.location || "",
    });
    setIsEditOpen(true);
  };

  const statCards = [
    { label: "Total Announcements", value: stats?.total || 0, icon: Megaphone, color: "text-blue-600", bg: "bg-blue-600/10" },
    { label: "Published", value: stats?.published || 0, icon: Send, color: "text-emerald-600", bg: "bg-emerald-600/10" },
    { label: "Drafts", value: stats?.draft || 0, icon: FileText, color: "text-amber-600", bg: "bg-amber-600/10" },
    { label: "Upcoming Events", value: stats?.events || 0, icon: CalendarDays, color: "text-purple-600", bg: "bg-purple-600/10" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Announcements</h2>
            <p className="text-muted-foreground">Manage public announcements and upcoming events.</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" /> New Announcement</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Announcement</DialogTitle>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(handleCreateSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label>Title</Label>
                    <Input {...form.register("title")} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select onValueChange={(val) => form.setValue("type", val)} defaultValue={form.getValues("type")}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Announcement">General Announcement</SelectItem>
                        <SelectItem value="Event">Event</SelectItem>
                        <SelectItem value="Health">Health Advisory</SelectItem>
                        <SelectItem value="Meeting">Meeting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select onValueChange={(val) => form.setValue("status", val)} defaultValue={form.getValues("status")}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label>Event Date (Optional)</Label>
                    <Input type="date" {...form.register("eventDate")} />
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label>Event Time (Optional)</Label>
                    <Input type="time" {...form.register("eventTime")} />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Location (Optional)</Label>
                    <Input {...form.register("location")} placeholder="e.g. Barangay Hall Plaza" />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Content</Label>
                    <Textarea {...form.register("content")} rows={5} required />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={createAnnouncement.isPending}>
                    {createAnnouncement.isPending ? "Creating..." : "Save Announcement"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Announcement</DialogTitle>
            </DialogHeader>
            <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label>Title</Label>
                  <Input {...editForm.register("title")} required />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select onValueChange={(val) => editForm.setValue("type", val)} defaultValue={editForm.getValues("type")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Announcement">General Announcement</SelectItem>
                      <SelectItem value="Event">Event</SelectItem>
                      <SelectItem value="Health">Health Advisory</SelectItem>
                      <SelectItem value="Meeting">Meeting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select onValueChange={(val) => editForm.setValue("status", val)} defaultValue={editForm.getValues("status")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <Label>Event Date (Optional)</Label>
                  <Input type="date" {...editForm.register("eventDate")} />
                </div>
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <Label>Event Time (Optional)</Label>
                  <Input type="time" {...editForm.register("eventTime")} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Location (Optional)</Label>
                  <Input {...editForm.register("location")} placeholder="e.g. Barangay Hall Plaza" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Content</Label>
                  <Textarea {...editForm.register("content")} rows={5} required />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={updateAnnouncement.isPending}>
                  {updateAnnouncement.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
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

        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="animate-pulse h-32"></Card>
            ))
          ) : announcements.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg bg-card">
              No announcements found.
            </div>
          ) : (
            announcements.map((announcement) => (
              <Card key={announcement.id} className="hover-elevate">
                <CardContent className="p-6 flex flex-col sm:flex-row gap-6">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                        {announcement.type}
                      </Badge>
                      {announcement.status === 'published' ? (
                        <Badge className="bg-emerald-500">Published</Badge>
                      ) : (
                        <Badge variant="secondary">Draft</Badge>
                      )}
                      <span className="text-xs text-muted-foreground ml-auto sm:ml-2">
                        {format(new Date(announcement.createdAt), "MMM d, yyyy")}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold">{announcement.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{announcement.content}</p>
                    
                    {(announcement.eventDate || announcement.location) && (
                      <div className="flex flex-wrap gap-4 mt-2 pt-2 border-t text-xs text-muted-foreground">
                        {announcement.eventDate && (
                          <div className="flex items-center gap-1">
                            <CalendarDays className="w-3.5 h-3.5" />
                            {format(new Date(announcement.eventDate), "MMM d, yyyy")} 
                            {announcement.eventTime && ` at ${announcement.eventTime}`}
                          </div>
                        )}
                        {announcement.location && (
                          <div className="flex items-center gap-1">
                            <span className="font-medium">📍</span> {announcement.location}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-row sm:flex-col items-center justify-end gap-2 border-t sm:border-t-0 sm:border-l pt-4 sm:pt-0 sm:pl-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => openEdit(announcement)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        {announcement.status === 'draft' ? (
                          <DropdownMenuItem onClick={() => handleStatusUpdate(announcement.id, 'published', announcement.title, announcement.type, announcement.content)}>
                            <Send className="mr-2 h-4 w-4" /> Publish
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleStatusUpdate(announcement.id, 'draft', announcement.title, announcement.type, announcement.content)}>
                            <FileText className="mr-2 h-4 w-4" /> Revert to Draft
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(announcement.id)} className="text-destructive">
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
