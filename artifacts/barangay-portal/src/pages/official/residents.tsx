import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PortalHeader } from "@/components/portal/header";
import { useSidebarToggle } from "@/components/portal/portal-layout";
import { api } from "@/lib/api";
import {
  Users, Search, Plus, X, Phone, MapPin, User, Eye, FileText, ClipboardList,
  CheckCircle2, Clock, XCircle, AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Gender = "Male" | "Female";
type CivilStatus = "Single" | "Married" | "Widowed" | "Separated";
type ResidentStatus = "active" | "inactive";
type ProfileTab = "profile" | "documents" | "history";

interface Resident {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  birthDate: string;
  gender: Gender;
  civilStatus: CivilStatus;
  status: ResidentStatus;
}

const statusIcons: Record<string, React.ReactNode> = {
  approved: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
  pending: <Clock className="w-3.5 h-3.5 text-amber-500" />,
  processing: <AlertCircle className="w-3.5 h-3.5 text-blue-500" />,
  rejected: <XCircle className="w-3.5 h-3.5 text-red-500" />,
  "needs-docs": <AlertCircle className="w-3.5 h-3.5 text-purple-500" />,
};

const statusClasses: Record<string, string> = {
  approved: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  processing: "bg-blue-50 text-blue-700",
  rejected: "bg-red-50 text-red-700",
  "needs-docs": "bg-purple-50 text-purple-700",
  resolved: "bg-emerald-50 text-emerald-700",
  reported: "bg-gray-50 text-gray-700",
  investigating: "bg-blue-50 text-blue-700",
  mediation: "bg-amber-50 text-amber-700",
  escalated: "bg-red-50 text-red-700",
  closed: "bg-slate-50 text-slate-700",
  cancelled: "bg-pink-50 text-pink-700",
};

export default function OfficialResidentsPage() {
  const { toggle } = useSidebarToggle();
  const { toast } = useToast();
  const [residents, setResidents] = useState<Resident[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | ResidentStatus>("all");
  const [selected, setSelected] = useState<Resident | null>(null);
  const [activeTab, setActiveTab] = useState<ProfileTab>("profile");
  const [showForm, setShowForm] = useState(false);
  const [allDocs, setAllDocs] = useState<any[]>([]);
  const [allBlotter, setAllBlotter] = useState<any[]>([]);

  useEffect(() => {
    api.residents.list().then(data => setResidents(data as Resident[])).catch(console.error);
    api.documents.list().then(setAllDocs).catch(console.error);
    api.blotter.list().then(setAllBlotter).catch(console.error);
  }, []);

  const residentDocs = selected ? allDocs.filter(d => d.residentId === selected.id || d.residentName === selected.name) : [];
  const residentBlotter = selected ? allBlotter.filter(b => b.reportedBy === selected.name) : [];

  const filtered = residents.filter(r => {
    const m = r.name.toLowerCase().includes(search.toLowerCase())
      || r.id.toLowerCase().includes(search.toLowerCase())
      || r.address.toLowerCase().includes(search.toLowerCase());
    const f = filter === "all" || r.status === filter;
    return m && f;
  });

  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "",
    birthDate: "", gender: "Male" as Gender,
    civilStatus: "Single" as CivilStatus,
  });

  const handleAddResident = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await api.residents.create({ ...form, status: "active" });
    setResidents(prev => [created as Resident, ...prev]);
    setShowForm(false);
    toast({ title: "Resident Added", description: `${form.name} has been registered.` });
    setForm({ name: "", email: "", phone: "", address: "", birthDate: "", gender: "Male", civilStatus: "Single" });
  };

  const getAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const openResident = (r: Resident) => {
    setSelected(r);
    setActiveTab("profile");
  };

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Residents"
        description={`${residents.filter(r => r.status === "active").length} active residents`}
        onMenuClick={toggle}
        actions={
          <Button size="sm" className="bg-primary hover:bg-primary/90 gap-2" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" /> Add Resident
          </Button>
        }
      />

      <div className="p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="Search residents..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            {(["all", "active", "inactive"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-sm px-3 py-1.5 rounded-full border font-medium transition-all ${filter === f ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
              >
                {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Resident Profile Modal */}
        {selected && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <Card className="w-full max-w-2xl shadow-2xl my-4 animate-fadeUp overflow-hidden">
              {/* Header */}
              <div className="p-6 bg-primary/5 border-b border-border">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">{selected.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h2 className="font-bold text-foreground text-lg">{selected.name}</h2>
                      <p className="text-sm text-muted-foreground">{selected.id}</p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block ${selected.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"}`}>
                        {selected.status}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mt-5">
                  {([
                    { key: "profile", label: "Profile", icon: <User className="w-3.5 h-3.5" /> },
                    { key: "documents", label: `Documents (${residentDocs.length})`, icon: <FileText className="w-3.5 h-3.5" /> },
                    { key: "history", label: `Blotter (${residentBlotter.length})`, icon: <ClipboardList className="w-3.5 h-3.5" /> },
                  ] as { key: ProfileTab; label: string; icon: React.ReactNode }[]).map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                    >
                      {tab.icon} {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "profile" && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { label: "Email", value: selected.email },
                      { label: "Phone", value: selected.phone },
                      { label: "Address", value: selected.address },
                      { label: "Birth Date", value: `${new Date(selected.birthDate).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" })} (${getAge(selected.birthDate)} yrs)` },
                      { label: "Gender", value: selected.gender },
                      { label: "Civil Status", value: selected.civilStatus },
                    ].map((item, i) => (
                      <div key={i} className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        <p className="text-sm font-medium text-foreground">{item.value}</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "documents" && (
                  <div className="space-y-3">
                    {residentDocs.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                        <p className="text-muted-foreground text-sm">No document requests found for this resident</p>
                      </div>
                    ) : (
                      residentDocs.map((doc: any) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-foreground">{doc.documentType}</p>
                            <p className="text-xs text-muted-foreground">{doc.purpose} · {new Date(doc.date).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}</p>
                          </div>
                          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${statusClasses[doc.status] || "bg-gray-50 text-gray-700"}`}>
                            {statusIcons[doc.status]}
                            <span>{doc.status}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === "history" && (
                  <div className="space-y-3">
                    {residentBlotter.length === 0 ? (
                      <div className="text-center py-8">
                        <ClipboardList className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                        <p className="text-muted-foreground text-sm">No blotter reports filed by this resident</p>
                      </div>
                    ) : (
                      residentBlotter.map((b: any) => (
                        <div key={b.id} className="p-3 bg-muted/40 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-mono text-muted-foreground">{b.id}</span>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusClasses[b.status] || "bg-gray-50 text-gray-700"}`}>{b.status}</span>
                          </div>
                          <p className="text-sm font-medium text-foreground">{b.incidentType}</p>
                          <p className="text-xs text-muted-foreground">{b.location} · {new Date(b.date).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Add Resident Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <Card className="w-full max-w-lg p-6 shadow-2xl my-4 animate-fadeUp">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-foreground">Register New Resident</h2>
                <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddResident} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label>Full Name</Label>
                    <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Juan dela Cruz" className="mt-1" required />
                  </div>
                  <div><Label>Email</Label><Input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} type="email" className="mt-1" required /></div>
                  <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="09XXXXXXXXX" className="mt-1" required /></div>
                  <div className="sm:col-span-2">
                    <Label>Address (Purok)</Label>
                    <Input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} placeholder="Purok X, Barangay Santiago" className="mt-1" required />
                  </div>
                  <div><Label>Birth Date</Label><Input type="date" value={form.birthDate} onChange={e => setForm(p => ({ ...p, birthDate: e.target.value }))} className="mt-1" required /></div>
                  <div>
                    <Label>Gender</Label>
                    <select value={form.gender} onChange={e => setForm(p => ({ ...p, gender: e.target.value as Gender }))} className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                      <option>Male</option><option>Female</option>
                    </select>
                  </div>
                  <div>
                    <Label>Civil Status</Label>
                    <select value={form.civilStatus} onChange={e => setForm(p => ({ ...p, civilStatus: e.target.value as CivilStatus }))} className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                      <option>Single</option><option>Married</option><option>Widowed</option><option>Separated</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">Cancel</Button>
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">Register Resident</Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Residents List */}
        <p className="text-sm text-muted-foreground">{filtered.length} resident{filtered.length !== 1 ? "s" : ""} found</p>
        <div className="space-y-2">
          {filtered.map(r => (
            <Card
              key={r.id}
              className="p-4 border-border/50 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer"
              onClick={() => openResident(r)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center shrink-0">
                  <span className="font-bold text-primary text-sm">{r.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{r.name}</p>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{r.address.split(",")[0]}</span>
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{r.phone}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${r.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"}`}>
                    {r.status}
                  </span>
                  <Eye className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
