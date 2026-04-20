import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PortalHeader } from "@/components/portal/header";
import { useSidebarToggle } from "@/components/portal/portal-layout";
import { api } from "@/lib/api";
import { BookOpen, Plus, X, Search, Printer, Pencil, Trash2, Eye, Calendar, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type OrdinanceType = "Ordinance" | "Resolution";
type OrdinanceStatus = "Active" | "Repealed" | "Superseded";

interface Ordinance {
  id: string;
  number: string;
  title: string;
  type: OrdinanceType;
  dateEnacted: string;
  author: string;
  status: OrdinanceStatus;
  summary: string;
  fullText: string;
}

const statusStyle: Record<OrdinanceStatus, string> = {
  Active: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Repealed: "bg-gray-100 text-gray-600 border-gray-200",
  Superseded: "bg-amber-100 text-amber-700 border-amber-200",
};

function generateOrdinanceTemplate(type: OrdinanceType, number: string, title: string, author: string, dateEnacted: string): string {
  const date = dateEnacted ? new Date(dateEnacted).toLocaleDateString("en-PH", { day: "numeric", month: "long", year: "numeric" }) : "[Date]";
  return `BARANGAY ${type.toUpperCase()} NO. ${number || "[Year-Number]"}

AN ${type.toUpperCase()} ENTITLED:
"An ${type} ${title || "[Title of the " + type + "]"}"

---

BE IT ORDAINED by the Sangguniang Barangay of Barangay Santiago, that:

---

SECTION 1. TITLE

This ${type} shall be known as the "${title || "[Short Title of the " + type + "]"}".

---

SECTION 2. PURPOSE

This ${type} is enacted to [state the purpose or objective].

---

SECTION 3. COVERAGE

This ${type} shall apply to [who or what is covered].

---

SECTION 4. DEFINITION OF TERMS

For purposes of this ${type}, the following terms are defined as:
a. [Term 1] – [Definition]
b. [Term 2] – [Definition]

---

SECTION 5. PROHIBITED ACTS / REGULATIONS

The following acts are hereby prohibited:
a. [Act 1]
b. [Act 2]

---

SECTION 6. PENALTIES

Any person found violating this ${type} shall be penalized as follows:

* First Offense: [Penalty]
* Second Offense: [Penalty]
* Third Offense: [Penalty]

---

SECTION 7. IMPLEMENTING BODY

The Barangay Officials, led by the Punong Barangay, shall implement this ${type}.

---

SECTION 8. SEPARABILITY CLAUSE

If any provision of this ${type} is declared invalid, the remaining provisions shall not be affected.

---

SECTION 9. REPEALING CLAUSE

All ordinances or parts thereof inconsistent with this ${type} are hereby repealed or modified accordingly.

---

SECTION 10. EFFECTIVITY

This ${type} shall take effect upon approval and posting in conspicuous places in the barangay.

---

ENACTED this ${date} at Barangay Santiago.

---

Certified Correct:
[Barangay Secretary Name]
Barangay Secretary

---

Approved by:
${author || "HON. ROLANDO C. BORJA"}
Punong Barangay

---

Barangay Councilors:
* [Name]
* [Name]
* [Name]`;
}

function parseDocumentSections(text: string) {
  return text
    .split(/\n---\n/)
    .map(s => s.trim())
    .filter(Boolean);
}

function OrdinanceDocument({ ord, onClose, onEdit, onDelete }: {
  ord: Ordinance;
  onClose: () => void;
  onEdit: (ord: Ordinance) => void;
  onDelete: (id: string) => void;
}) {
  const sections = parseDocumentSections(ord.fullText);
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-3xl shadow-2xl my-4 bg-white animate-fadeUp">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full border border-primary/20 text-primary">{ord.type}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusStyle[ord.status]}`}>{ord.status}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => window.print()}>
              <Printer className="w-4 h-4" /> Print
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5 border-blue-300 text-blue-700 hover:bg-blue-50" onClick={() => { onClose(); onEdit(ord); }}>
              <Pencil className="w-4 h-4" /> Edit
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5 border-red-300 text-red-700 hover:bg-red-50" onClick={() => { onDelete(ord.id); onClose(); }}>
              <Trash2 className="w-4 h-4" /> Delete
            </Button>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted ml-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Body */}
        <div className="p-8 sm:p-12 bg-white" id="print-area">
          {/* Gov Header */}
          <div className="text-center mb-8">
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Republic of the Philippines</p>
            <p className="text-xs text-gray-600">Province of Zambales · Municipality of San Antonio</p>
            <p className="text-sm font-bold text-gray-900 mt-1 uppercase">Barangay Santiago Saz</p>
            <p className="text-xs text-gray-500">Sangguniang Barangay</p>
            <div className="border-b-2 border-gray-800 mt-4 mb-6" />
            <p className="text-xs font-mono text-gray-500 mb-2 tracking-widest">{ord.number}</p>
            <h1 className="text-base font-bold text-gray-900 uppercase leading-snug max-w-lg mx-auto">{ord.title}</h1>
            <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><User className="w-3 h-3" />{ord.author}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(ord.dateEnacted).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" })}</span>
            </div>
          </div>

          {/* Summary callout */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-5 py-3 mb-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Summary</p>
            <p className="text-sm text-gray-700 italic leading-relaxed">{ord.summary}</p>
          </div>

          {/* Full Text Sections */}
          <div className="space-y-4">
            {sections.map((section, i) => {
              const lines = section.split("\n");
              const firstLine = lines[0];
              const rest = lines.slice(1).join("\n").trim();
              const isSectionHeader = /^SECTION\s+\d+/i.test(firstLine) || /^(BARANGAY|AN ORDINANCE|AN RESOLUTION|BE IT|ENACTED|Certified|Approved|Barangay Councilors)/i.test(firstLine);
              return (
                <div key={i} className={isSectionHeader ? "pt-2" : ""}>
                  {isSectionHeader ? (
                    <>
                      <p className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-1">{firstLine}</p>
                      {rest && <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{rest}</p>}
                    </>
                  ) : (
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{section}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function OfficialOrdinancesPage() {
  const { toggle } = useSidebarToggle();
  const { toast } = useToast();
  const [ordinances, setOrdinances] = useState<Ordinance[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Ordinance | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<"all" | OrdinanceType>("all");

  useEffect(() => {
    api.ordinances.list().then(data => setOrdinances(data as Ordinance[])).catch(console.error);
  }, []);

  const filtered = ordinances.filter(o => {
    const m = o.title.toLowerCase().includes(search.toLowerCase())
      || o.number.toLowerCase().includes(search.toLowerCase())
      || o.summary.toLowerCase().includes(search.toLowerCase());
    const f = typeFilter === "all" || o.type === typeFilter;
    return m && f;
  });

  const [form, setForm] = useState({
    number: "", title: "", type: "Ordinance" as OrdinanceType,
    dateEnacted: "", author: "", summary: "", fullText: "",
  });

  const openCreate = () => {
    setForm({ number: "", title: "", type: "Ordinance", dateEnacted: "", author: "", summary: "", fullText: "" });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (ord: Ordinance) => {
    setForm({
      number: ord.number, title: ord.title, type: ord.type,
      dateEnacted: ord.dateEnacted, author: ord.author,
      summary: ord.summary, fullText: ord.fullText,
    });
    setEditingId(ord.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    await api.ordinances.delete(id);
    setOrdinances(prev => prev.filter(o => o.id !== id));
    toast({ title: "Ordinance Deleted", description: "The record has been removed." });
  };

  const handleUseTemplate = () => {
    const tpl = generateOrdinanceTemplate(form.type, form.number, form.title, form.author, form.dateEnacted);
    setForm(p => ({ ...p, fullText: tpl, summary: p.summary || `This ${p.type} addresses ${p.title.toLowerCase()} within Barangay Santiago.` }));
    toast({ title: "Template Applied", description: "Standard ordinance template has been loaded." });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      number: form.number, title: form.title.toUpperCase(),
      type: form.type, dateEnacted: form.dateEnacted, author: form.author,
      summary: form.summary, fullText: form.fullText,
    };
    if (editingId) {
      const updated = await api.ordinances.update(editingId, payload);
      setOrdinances(prev => prev.map(o => o.id === editingId ? { ...o, ...updated } as Ordinance : o));
      toast({ title: "Ordinance Updated", description: `${form.number} has been updated.` });
    } else {
      const created = await api.ordinances.create({ ...payload, status: "Active" });
      setOrdinances(prev => [created as Ordinance, ...prev]);
      toast({ title: "Ordinance Added", description: `${form.number} has been recorded.` });
    }
    setShowForm(false);
    setEditingId(null);
    setForm({ number: "", title: "", type: "Ordinance", dateEnacted: "", author: "", summary: "", fullText: "" });
  };

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Ordinances & Resolutions"
        description={`${ordinances.filter(o => o.status === "Active").length} active`}
        onMenuClick={toggle}
        actions={
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2" onClick={openCreate} data-testid="button-add-ordinance">
            <Plus className="w-4 h-4" /> Add Ordinance
          </Button>
        }
      />

      <div className="p-4 sm:p-6 animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="Search ordinances..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} data-testid="input-search" />
          </div>
          <div className="flex gap-2">
            {(["all", "Ordinance", "Resolution"] as const).map(f => (
              <button
                key={f}
                onClick={() => setTypeFilter(f)}
                className={`text-sm px-3 py-1.5 rounded-full border font-medium transition-all ${typeFilter === f ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
              >
                {f === "all" ? "All" : f}
              </button>
            ))}
          </div>
        </div>

        {/* Document Viewer */}
        {selected && (
          <OrdinanceDocument
            ord={selected}
            onClose={() => setSelected(null)}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <Card className="w-full max-w-lg p-6 shadow-2xl my-4 animate-fadeUp">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-foreground">{editingId ? "Edit Ordinance/Resolution" : "Add Ordinance/Resolution"}</h2>
                <button onClick={() => { setShowForm(false); setEditingId(null); }} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Document Number</Label>
                    <Input value={form.number} onChange={e => setForm(p => ({ ...p, number: e.target.value }))} placeholder="BO-2026-XXX" className="mt-1" required data-testid="input-number" />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as OrdinanceType }))} className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                      <option>Ordinance</option><option>Resolution</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label>Title</Label>
                  <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Title of the ordinance..." className="mt-1" required data-testid="input-title" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><Label>Date Enacted</Label><Input type="date" value={form.dateEnacted} onChange={e => setForm(p => ({ ...p, dateEnacted: e.target.value }))} className="mt-1" required /></div>
                  <div><Label>Author / Sponsor</Label><Input value={form.author} onChange={e => setForm(p => ({ ...p, author: e.target.value }))} className="mt-1" required /></div>
                </div>
                <div><Label>Summary</Label><Input value={form.summary} onChange={e => setForm(p => ({ ...p, summary: e.target.value }))} placeholder="Brief description" className="mt-1" required /></div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label>Full Text</Label>
                    <Button type="button" size="sm" variant="outline" onClick={handleUseTemplate} className="h-7 text-xs gap-1 border-primary/30 text-primary hover:bg-primary/5">
                      Use Template
                    </Button>
                  </div>
                  <Textarea value={form.fullText} onChange={e => setForm(p => ({ ...p, fullText: e.target.value }))} className="min-h-[200px] font-mono text-xs" placeholder="Full text of the ordinance or resolution..." />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }} className="flex-1">Cancel</Button>
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" data-testid="button-submit-ordinance">{editingId ? "Update" : "Add"}</Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Ordinance Cards Grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.length === 0 ? (
            <div className="sm:col-span-2 text-center py-12">
              <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No ordinances found</p>
            </div>
          ) : (
            filtered.map(ord => (
              <Card
                key={ord.id}
                className="p-5 border-border/50 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group"
                onClick={() => setSelected(ord)}
                data-testid={`ordinance-row-${ord.id}`}
              >
                {/* Top row: type + status */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full border border-primary/20 text-primary bg-primary/5">{ord.type}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusStyle[ord.status]}`}>{ord.status}</span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-3 mb-3 uppercase">{ord.title}</h3>

                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" />{ord.author}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(ord.dateEnacted).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}</span>
                </div>

                {/* Summary */}
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4">{ord.summary}</p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                  <span className="text-xs font-mono text-muted-foreground/70">{ord.number}</span>
                  <div className="flex items-center gap-1">
                    <span className="flex items-center gap-1 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="w-3.5 h-3.5" /> View
                    </span>
                    <div className="flex gap-1 ml-2" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={e => { e.stopPropagation(); openEdit(ord); }}
                        className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); handleDelete(ord.id); }}
                        className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
