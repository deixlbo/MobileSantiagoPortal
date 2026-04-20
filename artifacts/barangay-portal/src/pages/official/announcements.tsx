import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PortalHeader } from "@/components/portal/header";
import { useSidebarToggle } from "@/components/portal/portal-layout";
import { MiniCalendar } from "@/components/portal/mini-calendar";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import {
  Megaphone, Plus, X, Trash2, AlertTriangle, CalendarDays, List,
  Pencil, Check, MapPin, Clock, Users, Phone, Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Priority = "high" | "medium" | "low";

const TARGET_GROUPS = [
  "All Residents", "Youth (15–30)", "Senior Citizens (60+)",
  "Persons with Disability (PWD)", "Women", "Business Owners",
  "Farmers / Fisherfolk", "Others",
];

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: Priority;
  date: string;
  author: string;
  eventDate?: string;
  eventTime?: string;
  venue?: string;
  targetGroups?: string[];
  reminders?: string;
  contactInfo?: string;
  issuedBy?: string;
}

const priorityBadge: Record<Priority, string> = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  low: "bg-green-100 text-green-700 border-green-200",
};

const emptyForm = {
  title: "",
  content: "",
  category: "Event",
  priority: "medium" as Priority,
  eventDate: "",
  eventTime: "",
  venue: "",
  targetGroups: [] as string[],
  reminders: "",
  contactInfo: "",
  issuedBy: "",
};

export default function OfficialAnnouncementsPage() {
  const { userData } = useAuth();
  const { toggle } = useSidebarToggle();
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "calendar">("list");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [viewAnn, setViewAnn] = useState<Announcement | null>(null);

  const markedDates = announcements.map(a => a.date);
  const getDateCount = (date: string) => announcements.filter(a => a.date === date).length;

  const displayed = selectedDate && view === "list"
    ? announcements.filter(a => a.date === selectedDate)
    : announcements;

  const toggleGroup = (group: string) => {
    setForm(prev => ({
      ...prev,
      targetGroups: prev.targetGroups.includes(group)
        ? prev.targetGroups.filter(g => g !== group)
        : [...prev.targetGroups, group],
    }));
  };

  const openCreate = () => {
    setForm({ ...emptyForm, issuedBy: userData?.fullName ?? "" });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (ann: Announcement) => {
    setForm({
      title: ann.title,
      content: ann.content,
      category: ann.category,
      priority: ann.priority,
      eventDate: ann.eventDate ?? "",
      eventTime: ann.eventTime ?? "",
      venue: ann.venue ?? "",
      targetGroups: ann.targetGroups ?? [],
      reminders: ann.reminders ?? "",
      contactInfo: ann.contactInfo ?? "",
      issuedBy: ann.issuedBy ?? "",
    });
    setEditingId(ann.id);
    setShowForm(true);
  };

  useEffect(() => {
    api.announcements.list().then(data => setAnnouncements(data as Announcement[])).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const updated = await api.announcements.update(editingId, form);
      setAnnouncements(prev => prev.map(a => a.id === editingId ? { ...a, ...updated } : a));
      toast({ title: "Announcement Updated", description: "Changes saved successfully." });
    } else {
      const created = await api.announcements.create({
        title: form.title,
        content: form.content,
        category: form.category,
        priority: form.priority,
        date: new Date().toISOString().split("T")[0],
        author: userData?.fullName ?? "Barangay Official",
        eventDate: form.eventDate || null,
        eventTime: form.eventTime || null,
        venue: form.venue || null,
        targetGroups: form.targetGroups.length > 0 ? form.targetGroups : null,
        reminders: form.reminders || null,
        contactInfo: form.contactInfo || null,
        issuedBy: form.issuedBy || null,
      });
      setAnnouncements(prev => [created as Announcement, ...prev]);
      toast({ title: "Announcement Posted", description: "Your announcement has been published." });
    }
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = async (id: string) => {
    await api.announcements.delete(id);
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    toast({ title: "Deleted", description: "Announcement removed." });
  };

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Announcements"
        description={`${announcements.length} announcements published`}
        onMenuClick={toggle}
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant={view === "list" ? "default" : "outline"} onClick={() => setView("list")} className="gap-1.5">
              <List className="w-4 h-4" /><span className="hidden sm:inline">List</span>
            </Button>
            <Button size="sm" variant={view === "calendar" ? "default" : "outline"} onClick={() => setView("calendar")} className="gap-1.5">
              <CalendarDays className="w-4 h-4" /><span className="hidden sm:inline">Calendar</span>
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90 gap-2" onClick={openCreate}>
              <Plus className="w-4 h-4" /><span className="hidden sm:inline">Post</span>
            </Button>
          </div>
        }
      />

      <div className="p-4 sm:p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">

        {/* Create/Edit Form — Government Template */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <Card className="w-full max-w-2xl shadow-2xl my-4 animate-fadeUp">
              {/* Header */}
              <div className="px-6 pt-6 pb-4 border-b border-border">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="font-bold text-foreground text-lg">
                    {editingId ? "Edit Announcement" : "Post Announcement"}
                  </h2>
                  <button onClick={() => { setShowForm(false); setEditingId(null); }} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">Republic of the Philippines · Province of Zambales · Municipality of San Antonio · Barangay Santiago Saz</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">

                {/* Subject / Title */}
                <div>
                  <Label className="text-sm font-semibold">Subject / Title <span className="text-destructive">*</span></Label>
                  <Input
                    value={form.title}
                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="e.g., Community Clean-Up Drive"
                    className="mt-1"
                    required
                  />
                </div>

                {/* Category & Priority */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold">Category</Label>
                    <select
                      value={form.category}
                      onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                      className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                      {["Event", "Meeting", "Maintenance", "Warning", "Health", "General"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Priority</Label>
                    <select
                      value={form.priority}
                      onChange={e => setForm(p => ({ ...p, priority: e.target.value as Priority }))}
                      className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                      <option value="high">High (Urgent)</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>

                {/* Announcement Details */}
                <div>
                  <Label className="text-sm font-semibold">Announcement Details <span className="text-destructive">*</span></Label>
                  <Textarea
                    value={form.content}
                    onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                    placeholder="Write the full announcement content here..."
                    className="mt-1 min-h-[120px]"
                    required
                  />
                </div>

                {/* Date / Time of Event */}
                <div>
                  <Label className="text-sm font-semibold">Date & Time of Event <span className="text-xs font-normal text-muted-foreground">(if applicable)</span></Label>
                  <div className="grid sm:grid-cols-2 gap-3 mt-1">
                    <Input
                      type="date"
                      value={form.eventDate}
                      onChange={e => setForm(p => ({ ...p, eventDate: e.target.value }))}
                    />
                    <Input
                      type="time"
                      value={form.eventTime}
                      onChange={e => setForm(p => ({ ...p, eventTime: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Venue */}
                <div>
                  <Label className="text-sm font-semibold">Venue / Location <span className="text-xs font-normal text-muted-foreground">(if applicable)</span></Label>
                  <Input
                    value={form.venue}
                    onChange={e => setForm(p => ({ ...p, venue: e.target.value }))}
                    placeholder="e.g., Barangay Santiago Multi-Purpose Hall"
                    className="mt-1"
                  />
                </div>

                {/* Target Group */}
                <div>
                  <Label className="text-sm font-semibold">Target Group</Label>
                  <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {TARGET_GROUPS.map(group => (
                      <label key={group} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={form.targetGroups.includes(group)}
                          onChange={() => toggleGroup(group)}
                          className="w-4 h-4 rounded border-input accent-primary"
                        />
                        <span className="text-xs text-foreground group-hover:text-primary transition-colors leading-tight">{group}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Important Reminders */}
                <div>
                  <Label className="text-sm font-semibold">Important Reminders</Label>
                  <Textarea
                    value={form.reminders}
                    onChange={e => setForm(p => ({ ...p, reminders: e.target.value }))}
                    placeholder="e.g., Please bring valid ID, Attendance is mandatory..."
                    className="mt-1 min-h-[70px]"
                  />
                </div>

                {/* Contact Information */}
                <div>
                  <Label className="text-sm font-semibold">Contact Information</Label>
                  <Input
                    value={form.contactInfo}
                    onChange={e => setForm(p => ({ ...p, contactInfo: e.target.value }))}
                    placeholder="e.g., Brgy. Hall: (047) 123-4567 / brgy.santiago@example.gov.ph"
                    className="mt-1"
                  />
                </div>

                {/* Issued By */}
                <div>
                  <Label className="text-sm font-semibold">Issued By</Label>
                  <Input
                    value={form.issuedBy}
                    onChange={e => setForm(p => ({ ...p, issuedBy: e.target.value }))}
                    placeholder="Name and position of issuing official"
                    className="mt-1"
                  />
                </div>

                <div className="flex gap-3 pt-2 border-t border-border">
                  <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }} className="flex-1">Cancel</Button>
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
                    {editingId ? <><Check className="w-4 h-4 mr-1" /> Save Changes</> : "Post Announcement"}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Announcement Detail View */}
        {viewAnn && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <Card className="w-full max-w-2xl shadow-2xl my-4 bg-white animate-fadeUp">
              <div className="flex items-center justify-between px-6 py-4 border-b print:hidden">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${priorityBadge[viewAnn.priority]}`}>{viewAnn.priority} priority</span>
                <div className="flex gap-2">
                  <button onClick={() => { openEdit(viewAnn); setViewAnn(null); }} className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => setViewAnn(null)} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-8 sm:p-10">
                {/* Gov Header */}
                <div className="text-center mb-6 border-b-2 border-gray-800 pb-5">
                  <p className="text-xs font-semibold text-gray-700">Republic of the Philippines</p>
                  <p className="text-xs text-gray-600">Province of Zambales · Municipality of San Antonio</p>
                  <p className="text-sm font-bold mt-1 text-gray-800 uppercase">Barangay Santiago Saz</p>
                  <p className="text-xs text-gray-600">Office of the Punong Barangay</p>
                </div>

                <h1 className="text-xl font-bold text-center text-gray-900 uppercase mb-1">ANNOUNCEMENT</h1>
                <h2 className="text-base font-semibold text-center text-gray-800 mb-5">{viewAnn.title}</h2>

                {/* Details */}
                <div className="mb-4">
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Announcement Details</p>
                  <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{viewAnn.content}</p>
                </div>

                {(viewAnn.eventDate || viewAnn.eventTime) && (
                  <div className="flex items-start gap-2 mb-3">
                    <Clock className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Date & Time</p>
                      <p className="text-sm text-gray-800">
                        {viewAnn.eventDate ? new Date(viewAnn.eventDate).toLocaleDateString("en-PH", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) : ""}{viewAnn.eventTime ? ` at ${viewAnn.eventTime}` : ""}
                      </p>
                    </div>
                  </div>
                )}

                {viewAnn.venue && (
                  <div className="flex items-start gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Venue</p>
                      <p className="text-sm text-gray-800">{viewAnn.venue}</p>
                    </div>
                  </div>
                )}

                {viewAnn.targetGroups && viewAnn.targetGroups.length > 0 && (
                  <div className="flex items-start gap-2 mb-3">
                    <Users className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Target Group</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {viewAnn.targetGroups.map(g => (
                          <span key={g} className="text-xs bg-gray-100 border border-gray-300 px-2 py-0.5 rounded-full text-gray-700">{g}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {viewAnn.reminders && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-1">Important Reminders</p>
                    <p className="text-sm text-amber-900 whitespace-pre-wrap">{viewAnn.reminders}</p>
                  </div>
                )}

                {viewAnn.contactInfo && (
                  <div className="flex items-start gap-2 mt-4">
                    <Phone className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Contact Information</p>
                      <p className="text-sm text-gray-800">{viewAnn.contactInfo}</p>
                    </div>
                  </div>
                )}

                <div className="border-t-2 border-gray-800 mt-8 pt-6 grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-6">Issued by:</p>
                    <div className="border-b border-gray-500" />
                    <p className="text-xs text-gray-500 mt-1">{viewAnn.issuedBy || viewAnn.author}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-6">Date issued:</p>
                    <div className="border-b border-gray-500" />
                    <p className="text-xs text-gray-500 mt-1">{new Date(viewAnn.date).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" })}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Calendar View */}
        {view === "calendar" && (
          <div className="grid lg:grid-cols-[300px_1fr] gap-4">
            <MiniCalendar
              markedDates={markedDates}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              getDateCount={getDateCount}
            />
            <div className="space-y-3">
              {selectedDate ? (
                <>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(selectedDate).toLocaleDateString("en-PH", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                    {" — "}<span className="text-muted-foreground">{announcements.filter(a => a.date === selectedDate).length} announcement(s)</span>
                  </p>
                  {announcements.filter(a => a.date === selectedDate).length === 0 ? (
                    <Card className="p-8 text-center">
                      <Megaphone className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-muted-foreground text-sm">No announcements on this date</p>
                    </Card>
                  ) : (
                    announcements.filter(a => a.date === selectedDate).map(ann => (
                      <Card key={ann.id} className="p-4 border-border/50 cursor-pointer hover:border-primary/30 transition" onClick={() => setViewAnn(ann)}>
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full border ${priorityBadge[ann.priority]}`}>{ann.priority}</span>
                              <span className="text-xs text-muted-foreground">{ann.category}</span>
                            </div>
                            <h3 className="font-semibold text-foreground">{ann.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{ann.content}</p>
                          </div>
                          <div className="flex gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                            <button onClick={() => openEdit(ann)} className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(ann.id)} className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </>
              ) : (
                <Card className="p-8 text-center border-dashed">
                  <CalendarDays className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">Click a highlighted date to see announcements</p>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* List View */}
        {view === "list" && (
          <div className="space-y-3">
            {displayed.map(ann => (
              <Card
                key={ann.id}
                className="p-5 border-border/50 hover:border-primary/30 transition cursor-pointer"
                onClick={() => setViewAnn(ann)}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${ann.priority === "high" ? "bg-red-100" : ann.priority === "medium" ? "bg-amber-100" : "bg-green-100"}`}>
                    {ann.priority === "high"
                      ? <AlertTriangle className="w-5 h-5 text-red-600" />
                      : <Megaphone className={`w-5 h-5 ${ann.priority === "medium" ? "text-amber-600" : "text-green-600"}`} />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs border border-primary/20 text-primary px-1.5 py-0.5 rounded-full">{ann.category}</span>
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full border ${priorityBadge[ann.priority]}`}>{ann.priority}</span>
                    </div>
                    <h3 className="font-semibold text-foreground">{ann.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{ann.content}</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5 text-xs text-muted-foreground/70">
                      {ann.eventDate && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(ann.eventDate).toLocaleDateString("en-PH", { month: "short", day: "numeric" })}
                          {ann.eventTime && ` ${ann.eventTime}`}
                        </span>
                      )}
                      {ann.venue && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{ann.venue}</span>}
                      <span>{ann.author} · {new Date(ann.date).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                    <button onClick={() => setViewAnn(ann)} className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition" title="View">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => openEdit(ann)} className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition" title="Edit">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(ann.id)} className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
