import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PortalHeader } from "@/components/portal/header";
import { useSidebarToggle } from "@/components/portal/portal-layout";
import { MiniCalendar } from "@/components/portal/mini-calendar";
import { api } from "@/lib/api";
import {
  FolderKanban, Plus, X, Users, MapPin, CheckCircle2, Clock,
  DollarSign, CalendarDays, List, Pencil, Trash2, Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ProjectStatus = "planning" | "ongoing" | "completed";

interface WorkPlanRow {
  activity: string;
  responsible: string;
  timeline: string;
}

interface BudgetRow {
  item: string;
  quantity: string;
  unitCost: string;
  totalCost: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  location: string;
  budget: number;
  actualCost: number;
  leadBy: string;
  beneficiaries: number;
  fundSource: string;
  milestones: Array<{ name: string; date: string; status: "completed" | "pending" }>;
  objectives?: string;
  targetBeneficiaries?: string;
  expectedOutput?: string;
  monitoring?: string;
  workPlan?: WorkPlanRow[];
  budgetItems?: BudgetRow[];
  preparedBy?: string;
  approvedBy?: string;
}

const statusStyles: Record<ProjectStatus, string> = {
  planning: "bg-blue-50 text-blue-700 border-blue-200",
  ongoing: "bg-amber-50 text-amber-700 border-amber-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const defaultWorkPlan: WorkPlanRow[] = [
  { activity: "", responsible: "", timeline: "" },
  { activity: "", responsible: "", timeline: "" },
];

const defaultBudget: BudgetRow[] = [
  { item: "", quantity: "", unitCost: "", totalCost: "" },
  { item: "", quantity: "", unitCost: "", totalCost: "" },
];

const emptyForm = {
  title: "",
  description: "",
  category: "Health & Nutrition",
  startDate: "",
  endDate: "",
  location: "",
  budget: "",
  leadBy: "",
  beneficiaries: "",
  fundSource: "",
  objectives: "",
  targetBeneficiaries: "",
  expectedOutput: "",
  monitoring: "",
  workPlan: defaultWorkPlan,
  budgetItems: defaultBudget,
  preparedBy: "",
  approvedBy: "",
};

export default function OfficialProjectsPage() {
  const { toggle } = useSidebarToggle();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selected, setSelected] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | ProjectStatus>("all");
  const [view, setView] = useState<"list" | "calendar">("list");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    api.projects.list().then(data => setProjects(data as Project[])).catch(console.error);
  }, []);

  const filtered = filter === "all" ? projects : projects.filter(p => p.status === filter);
  const markedDates = projects.flatMap(p => [p.startDate, p.endDate]).filter(Boolean);
  const getDateCount = (date: string) => projects.filter(p => p.startDate === date || p.endDate === date).length;
  const calendarProjects = selectedDate
    ? projects.filter(p => {
        const start = new Date(p.startDate);
        const end = new Date(p.endDate);
        const sel = new Date(selectedDate);
        return sel >= start && sel <= end;
      })
    : [];

  const updateWorkPlan = (idx: number, field: keyof WorkPlanRow, value: string) => {
    setForm(prev => {
      const updated = [...prev.workPlan];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, workPlan: updated };
    });
  };

  const addWorkPlanRow = () => setForm(prev => ({ ...prev, workPlan: [...prev.workPlan, { activity: "", responsible: "", timeline: "" }] }));
  const removeWorkPlanRow = (idx: number) => setForm(prev => ({ ...prev, workPlan: prev.workPlan.filter((_, i) => i !== idx) }));

  const updateBudgetRow = (idx: number, field: keyof BudgetRow, value: string) => {
    setForm(prev => {
      const updated = [...prev.budgetItems];
      updated[idx] = { ...updated[idx], [field]: value };
      const q = parseFloat(updated[idx].quantity) || 0;
      const u = parseFloat(updated[idx].unitCost) || 0;
      updated[idx].totalCost = field === "quantity" || field === "unitCost" ? String(q * u) : updated[idx].totalCost;
      return { ...prev, budgetItems: updated };
    });
  };

  const addBudgetRow = () => setForm(prev => ({ ...prev, budgetItems: [...prev.budgetItems, { item: "", quantity: "", unitCost: "", totalCost: "" }] }));
  const removeBudgetRow = (idx: number) => setForm(prev => ({ ...prev, budgetItems: prev.budgetItems.filter((_, i) => i !== idx) }));

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (proj: Project) => {
    setForm({
      title: proj.title,
      description: proj.description,
      category: proj.category,
      startDate: proj.startDate,
      endDate: proj.endDate,
      location: proj.location,
      budget: String(proj.budget),
      leadBy: proj.leadBy,
      beneficiaries: String(proj.beneficiaries),
      fundSource: proj.fundSource,
      objectives: proj.objectives ?? "",
      targetBeneficiaries: proj.targetBeneficiaries ?? "",
      expectedOutput: proj.expectedOutput ?? "",
      monitoring: proj.monitoring ?? "",
      workPlan: proj.workPlan && proj.workPlan.length > 0 ? proj.workPlan : defaultWorkPlan,
      budgetItems: proj.budgetItems && proj.budgetItems.length > 0 ? proj.budgetItems : defaultBudget,
      preparedBy: proj.preparedBy ?? "",
      approvedBy: proj.approvedBy ?? "",
    });
    setEditingId(proj.id);
    setShowForm(true);
    setSelected(null);
  };

  const handleDelete = async (id: string) => {
    await api.projects.delete(id);
    setProjects(prev => prev.filter(p => p.id !== id));
    setSelected(null);
    toast({ title: "Project Deleted", description: "The project has been removed." });
  };

  const totalBudget = (form.budgetItems ?? []).reduce((sum, r) => sum + (parseFloat(r.totalCost) || 0), 0);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const budgetValue = totalBudget > 0 ? totalBudget : parseFloat(form.budget) || 0;
    const payload = {
      title: form.title, description: form.description, category: form.category,
      startDate: form.startDate, endDate: form.endDate, location: form.location,
      budget: budgetValue, leadBy: form.leadBy,
      beneficiaries: parseInt(form.beneficiaries) || 0, fundSource: form.fundSource,
      objectives: form.objectives, targetBeneficiaries: form.targetBeneficiaries,
      expectedOutput: form.expectedOutput, monitoring: form.monitoring,
      workPlan: form.workPlan.filter(r => r.activity),
      budgetItems: form.budgetItems.filter(r => r.item),
      preparedBy: form.preparedBy, approvedBy: form.approvedBy,
    };
    if (editingId) {
      const updated = await api.projects.update(editingId, payload);
      setProjects(prev => prev.map(p => p.id === editingId ? { ...p, ...updated } as Project : p));
      toast({ title: "Project Updated", description: `"${form.title}" has been updated.` });
    } else {
      const created = await api.projects.create({ ...payload, status: "planning", actualCost: 0, milestones: [] });
      setProjects(prev => [created as Project, ...prev]);
      toast({ title: "Project Proposal Added", description: `"${form.title}" has been recorded.` });
    }
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const sectionLabel = (roman: string, title: string) => (
    <div className="flex items-center gap-2 pt-2">
      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{roman}</span>
      <p className="text-sm font-semibold text-foreground">{title}</p>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Projects & Programs"
        description={`${projects.filter(p => p.status === "ongoing").length} ongoing`}
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
              <Plus className="w-4 h-4" /><span className="hidden sm:inline">Add Proposal</span>
            </Button>
          </div>
        }
      />

      <div className="p-4 sm:p-6 animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-4">

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
                    {" — "}<span className="text-muted-foreground">{calendarProjects.length} project(s) active</span>
                  </p>
                  {calendarProjects.length === 0 ? (
                    <Card className="p-8 text-center">
                      <FolderKanban className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-muted-foreground text-sm">No projects active on this date</p>
                    </Card>
                  ) : (
                    calendarProjects.map(proj => (
                      <Card key={proj.id} className="p-4 border-border/50 hover:border-primary/30 cursor-pointer transition-all" onClick={() => setSelected(proj)}>
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <span className="text-xs text-primary border border-primary/20 px-1.5 py-0.5 rounded-full">{proj.category}</span>
                            <p className="text-sm font-semibold text-foreground mt-1">{proj.title}</p>
                            <p className="text-xs text-muted-foreground">{proj.location} · {proj.leadBy}</p>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium shrink-0 ${statusStyles[proj.status]}`}>{proj.status}</span>
                        </div>
                      </Card>
                    ))
                  )}
                </>
              ) : (
                <Card className="p-8 text-center border-dashed">
                  <CalendarDays className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">Click a date to see projects active on that day</p>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* List View */}
        {view === "list" && (
          <>
            <div className="flex gap-2 flex-wrap">
              {(["all", "planning", "ongoing", "completed"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-sm px-3 py-1.5 rounded-full border font-medium transition-all ${filter === f ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
                >
                  {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {filtered.map(proj => (
                <Card
                  key={proj.id}
                  className="p-5 border-border/50 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setSelected(proj)}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-xs border border-primary/20 text-primary px-1.5 py-0.5 rounded-full">{proj.category}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusStyles[proj.status]}`}>{proj.status}</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{proj.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{proj.description}</p>
                  <div className="pt-3 border-t border-border/50 space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>₱{proj.budget.toLocaleString()}</span>
                      <span>{proj.beneficiaries} beneficiaries</span>
                    </div>
                    {proj.budget > 0 && (
                      <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                        <div className="bg-primary h-1.5 rounded-full" style={{ width: `${Math.min(100, (proj.actualCost / proj.budget) * 100)}%` }} />
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Detail View */}
        {selected && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <Card className="w-full max-w-2xl p-6 shadow-2xl my-4 animate-fadeUp">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-xs border border-primary/20 text-primary px-1.5 py-0.5 rounded-full mb-1 inline-block">{selected.category}</span>
                  <h2 className="text-xl font-bold text-foreground">{selected.title}</h2>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <button onClick={() => openEdit(selected)} className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(selected.id)} className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setSelected(null)} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusStyles[selected.status]}`}>{selected.status}</span>
                <div className="flex gap-1">
                  {(["planning", "ongoing", "completed"] as ProjectStatus[]).map(s => (
                    <button
                      key={s}
                      onClick={() => setProjects(prev => prev.map(p => p.id === selected.id ? { ...p, status: s } : p))}
                      className={`text-xs px-2 py-0.5 rounded-full border transition ${selected.status === s ? "opacity-50 cursor-default" : "hover:bg-muted"}`}
                    >
                      → {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">I. Project Description</p>
                  <p className="text-foreground leading-relaxed">{selected.description}</p>
                </div>
                {selected.objectives && (
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">II. Objectives</p>
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap">{selected.objectives}</p>
                  </div>
                )}
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { label: "IV. Location", value: selected.location, icon: <MapPin className="w-4 h-4 text-primary" /> },
                    { label: "Lead By", value: selected.leadBy, icon: <Users className="w-4 h-4 text-primary" /> },
                    { label: "VII. Budget", value: `₱${selected.budget.toLocaleString()}`, icon: <DollarSign className="w-4 h-4 text-primary" /> },
                    { label: "III. Beneficiaries", value: `${selected.beneficiaries} residents`, icon: <Users className="w-4 h-4 text-primary" /> },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                      {item.icon}
                      <div>
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        <p className="text-sm font-medium text-foreground">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {selected.targetBeneficiaries && (
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">Target Beneficiaries</p>
                    <p className="text-foreground">{selected.targetBeneficiaries}</p>
                  </div>
                )}
                {selected.expectedOutput && (
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">IX. Expected Output</p>
                    <p className="text-foreground whitespace-pre-wrap">{selected.expectedOutput}</p>
                  </div>
                )}
                {selected.monitoring && (
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">X. Monitoring & Evaluation</p>
                    <p className="text-foreground whitespace-pre-wrap">{selected.monitoring}</p>
                  </div>
                )}
                {selected.workPlan && selected.workPlan.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">VI. Activities / Work Plan</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs border-collapse border border-border/50">
                        <thead className="bg-muted/40">
                          <tr>
                            <th className="border border-border/50 px-2 py-1.5 text-left font-semibold">Activity</th>
                            <th className="border border-border/50 px-2 py-1.5 text-left font-semibold">Responsible</th>
                            <th className="border border-border/50 px-2 py-1.5 text-left font-semibold">Timeline</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selected.workPlan.map((row, i) => (
                            <tr key={i}>
                              <td className="border border-border/50 px-2 py-1.5">{row.activity}</td>
                              <td className="border border-border/50 px-2 py-1.5">{row.responsible}</td>
                              <td className="border border-border/50 px-2 py-1.5">{row.timeline}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                {selected.budgetItems && selected.budgetItems.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">VII. Budgetary Requirements</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs border-collapse border border-border/50">
                        <thead className="bg-muted/40">
                          <tr>
                            <th className="border border-border/50 px-2 py-1.5 text-left font-semibold">Item</th>
                            <th className="border border-border/50 px-2 py-1.5 text-right font-semibold">Qty</th>
                            <th className="border border-border/50 px-2 py-1.5 text-right font-semibold">Unit Cost</th>
                            <th className="border border-border/50 px-2 py-1.5 text-right font-semibold">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selected.budgetItems.map((row, i) => (
                            <tr key={i}>
                              <td className="border border-border/50 px-2 py-1.5">{row.item}</td>
                              <td className="border border-border/50 px-2 py-1.5 text-right">{row.quantity}</td>
                              <td className="border border-border/50 px-2 py-1.5 text-right">₱{parseFloat(row.unitCost || "0").toLocaleString()}</td>
                              <td className="border border-border/50 px-2 py-1.5 text-right">₱{parseFloat(row.totalCost || "0").toLocaleString()}</td>
                            </tr>
                          ))}
                          <tr className="bg-muted/30 font-semibold">
                            <td colSpan={3} className="border border-border/50 px-2 py-1.5 text-right">Total</td>
                            <td className="border border-border/50 px-2 py-1.5 text-right">₱{selected.budget.toLocaleString()}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Budget Utilization</span>
                    <span className="font-semibold">{selected.budget > 0 ? Math.round((selected.actualCost / selected.budget) * 100) : 0}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${Math.min(100, selected.budget > 0 ? (selected.actualCost / selected.budget) * 100 : 0)}%` }} />
                  </div>
                </div>
                {selected.milestones.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Milestones</p>
                    <div className="space-y-2">
                      {selected.milestones.map((m, i) => (
                        <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/40">
                          {m.status === "completed" ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <Clock className="w-4 h-4 text-muted-foreground shrink-0" />}
                          <span className={`text-sm flex-1 ${m.status === "completed" ? "text-foreground" : "text-muted-foreground"}`}>{m.name}</span>
                          <span className="text-xs text-muted-foreground">{new Date(m.date).toLocaleDateString("en-PH", { month: "short", day: "numeric" })}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {(selected.preparedBy || selected.approvedBy) && (
                  <div className="grid grid-cols-2 gap-6 pt-4 border-t border-border/50">
                    {selected.preparedBy && (
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground mb-4">Prepared by:</p>
                        <div className="border-b border-muted-foreground/50" />
                        <p className="text-xs text-muted-foreground mt-1">{selected.preparedBy}</p>
                      </div>
                    )}
                    {selected.approvedBy && (
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground mb-4">Approved by:</p>
                        <div className="border-b border-muted-foreground/50" />
                        <p className="text-xs text-muted-foreground mt-1">{selected.approvedBy}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Add/Edit Proposal Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <Card className="w-full max-w-3xl shadow-2xl my-4 animate-fadeUp">
              {/* Gov Header */}
              <div className="px-6 pt-6 pb-4 border-b border-border">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h2 className="font-bold text-foreground text-lg">{editingId ? "Edit Project Proposal" : "New Project Proposal"}</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Republic of the Philippines · Province of Zambales · Municipality of San Antonio · Barangay Santiago Saz</p>
                  </div>
                  <button onClick={() => { setShowForm(false); setEditingId(null); }} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted ml-4">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleAdd} className="p-6 space-y-6">

                {/* I. Description */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">I</span>
                    <p className="text-sm font-semibold text-foreground">Project / Program Description</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <Label>Title / Name of Project <span className="text-destructive">*</span></Label>
                      <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="mt-1" required />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                        {["Health & Nutrition", "Infrastructure", "Livelihood", "Sports & Recreation", "Education", "Environment", "Peace & Order", "Others"].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <Label>Lead By / Project Head <span className="text-destructive">*</span></Label>
                      <Input value={form.leadBy} onChange={e => setForm(p => ({ ...p, leadBy: e.target.value }))} className="mt-1" required />
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Brief Description <span className="text-destructive">*</span></Label>
                      <Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="mt-1 min-h-[70px]" required />
                    </div>
                  </div>
                </div>

                {/* II. Objectives */}
                <div className="space-y-2 pt-2 border-t border-border/40">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">II</span>
                    <p className="text-sm font-semibold text-foreground">Objectives</p>
                  </div>
                  <Textarea value={form.objectives} onChange={e => setForm(p => ({ ...p, objectives: e.target.value }))} placeholder="State the general and specific objectives of the project..." className="min-h-[80px]" />
                </div>

                {/* III. Beneficiaries */}
                <div className="space-y-2 pt-2 border-t border-border/40">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">III</span>
                    <p className="text-sm font-semibold text-foreground">Beneficiaries</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Number of Beneficiaries</Label>
                      <Input type="number" value={form.beneficiaries} onChange={e => setForm(p => ({ ...p, beneficiaries: e.target.value }))} className="mt-1" />
                    </div>
                    <div>
                      <Label>Target Beneficiaries</Label>
                      <Input value={form.targetBeneficiaries} onChange={e => setForm(p => ({ ...p, targetBeneficiaries: e.target.value }))} placeholder="e.g., Youth, Residents, Senior Citizens" className="mt-1" />
                    </div>
                  </div>
                </div>

                {/* IV. Location & V. Duration */}
                <div className="grid sm:grid-cols-2 gap-6 pt-2 border-t border-border/40">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">IV</span>
                      <p className="text-sm font-semibold text-foreground">Location / Venue</p>
                    </div>
                    <Input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="Venue or location of project" required />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">V</span>
                      <p className="text-sm font-semibold text-foreground">Duration</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Start Date</Label>
                        <Input type="date" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} className="mt-1" required />
                      </div>
                      <div>
                        <Label className="text-xs">End Date</Label>
                        <Input type="date" value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))} className="mt-1" required />
                      </div>
                    </div>
                  </div>
                </div>

                {/* VI. Work Plan */}
                <div className="space-y-2 pt-2 border-t border-border/40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">VI</span>
                      <p className="text-sm font-semibold text-foreground">Activities / Work Plan</p>
                    </div>
                    <Button type="button" size="sm" variant="outline" onClick={addWorkPlanRow} className="text-xs gap-1">
                      <Plus className="w-3 h-3" /> Add Row
                    </Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="bg-muted/40">
                          <th className="border border-border/50 px-2 py-1.5 text-left font-semibold w-1/2">Activity</th>
                          <th className="border border-border/50 px-2 py-1.5 text-left font-semibold">Person Responsible</th>
                          <th className="border border-border/50 px-2 py-1.5 text-left font-semibold">Timeline</th>
                          <th className="border border-border/50 px-1 py-1.5 w-8" />
                        </tr>
                      </thead>
                      <tbody>
                        {form.workPlan.map((row, i) => (
                          <tr key={i}>
                            <td className="border border-border/50 p-1"><Input value={row.activity} onChange={e => updateWorkPlan(i, "activity", e.target.value)} placeholder="e.g., Preparation of materials" className="h-7 text-xs" /></td>
                            <td className="border border-border/50 p-1"><Input value={row.responsible} onChange={e => updateWorkPlan(i, "responsible", e.target.value)} placeholder="Name / Committee" className="h-7 text-xs" /></td>
                            <td className="border border-border/50 p-1"><Input value={row.timeline} onChange={e => updateWorkPlan(i, "timeline", e.target.value)} placeholder="e.g., Week 1" className="h-7 text-xs" /></td>
                            <td className="border border-border/50 p-1 text-center">
                              <button type="button" onClick={() => removeWorkPlanRow(i)} className="text-muted-foreground hover:text-destructive transition">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* VII. Budget */}
                <div className="space-y-2 pt-2 border-t border-border/40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">VII</span>
                      <p className="text-sm font-semibold text-foreground">Budgetary Requirements</p>
                    </div>
                    <Button type="button" size="sm" variant="outline" onClick={addBudgetRow} className="text-xs gap-1">
                      <Plus className="w-3 h-3" /> Add Row
                    </Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="bg-muted/40">
                          <th className="border border-border/50 px-2 py-1.5 text-left font-semibold w-1/2">Item / Description</th>
                          <th className="border border-border/50 px-2 py-1.5 text-right font-semibold w-16">Qty</th>
                          <th className="border border-border/50 px-2 py-1.5 text-right font-semibold w-24">Unit Cost (₱)</th>
                          <th className="border border-border/50 px-2 py-1.5 text-right font-semibold w-24">Total (₱)</th>
                          <th className="border border-border/50 px-1 py-1.5 w-8" />
                        </tr>
                      </thead>
                      <tbody>
                        {form.budgetItems.map((row, i) => (
                          <tr key={i}>
                            <td className="border border-border/50 p-1"><Input value={row.item} onChange={e => updateBudgetRow(i, "item", e.target.value)} placeholder="e.g., Printing materials" className="h-7 text-xs" /></td>
                            <td className="border border-border/50 p-1"><Input type="number" value={row.quantity} onChange={e => updateBudgetRow(i, "quantity", e.target.value)} className="h-7 text-xs text-right" /></td>
                            <td className="border border-border/50 p-1"><Input type="number" value={row.unitCost} onChange={e => updateBudgetRow(i, "unitCost", e.target.value)} className="h-7 text-xs text-right" /></td>
                            <td className="border border-border/50 p-1 text-right pr-2 font-medium">{parseFloat(row.totalCost || "0").toLocaleString()}</td>
                            <td className="border border-border/50 p-1 text-center">
                              <button type="button" onClick={() => removeBudgetRow(i)} className="text-muted-foreground hover:text-destructive transition">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-muted/30 font-semibold text-xs">
                          <td colSpan={3} className="border border-border/50 px-2 py-1.5 text-right">TOTAL</td>
                          <td className="border border-border/50 px-2 py-1.5 text-right">₱{totalBudget.toLocaleString()}</td>
                          <td className="border border-border/50" />
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 mt-2">
                    <div>
                      <Label className="text-xs">VIII. Source of Funding</Label>
                      <Input value={form.fundSource} onChange={e => setForm(p => ({ ...p, fundSource: e.target.value }))} placeholder="e.g., Barangay Development Fund" className="mt-1" />
                    </div>
                    {totalBudget === 0 && (
                      <div>
                        <Label className="text-xs">Total Budget (₱) <span className="text-muted-foreground font-normal">if not using table above</span></Label>
                        <Input type="number" value={form.budget} onChange={e => setForm(p => ({ ...p, budget: e.target.value }))} className="mt-1" />
                      </div>
                    )}
                  </div>
                </div>

                {/* IX. Expected Output */}
                <div className="space-y-2 pt-2 border-t border-border/40">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">IX</span>
                    <p className="text-sm font-semibold text-foreground">Expected Output</p>
                  </div>
                  <Textarea value={form.expectedOutput} onChange={e => setForm(p => ({ ...p, expectedOutput: e.target.value }))} placeholder="What outcomes are expected from this project?" className="min-h-[70px]" />
                </div>

                {/* X. Monitoring */}
                <div className="space-y-2 pt-2 border-t border-border/40">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">X</span>
                    <p className="text-sm font-semibold text-foreground">Monitoring & Evaluation</p>
                  </div>
                  <Textarea value={form.monitoring} onChange={e => setForm(p => ({ ...p, monitoring: e.target.value }))} placeholder="How will this project be monitored and evaluated?" className="min-h-[70px]" />
                </div>

                {/* Signatures */}
                <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-border/40">
                  <div>
                    <Label className="text-sm font-semibold">Prepared by</Label>
                    <Input value={form.preparedBy} onChange={e => setForm(p => ({ ...p, preparedBy: e.target.value }))} placeholder="Name and position" className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Approved by</Label>
                    <Input value={form.approvedBy} onChange={e => setForm(p => ({ ...p, approvedBy: e.target.value }))} placeholder="e.g., HON. ROLANDO C. BORJA, Punong Barangay" className="mt-1" />
                  </div>
                </div>

                <div className="flex gap-3 pt-2 border-t border-border">
                  <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }} className="flex-1">Cancel</Button>
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">{editingId ? "Save Changes" : "Submit Proposal"}</Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
