import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PortalHeader } from "@/components/portal/header";
import { useSidebarToggle } from "@/components/portal/portal-layout";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { MapPicker } from "@/components/portal/map-picker";
import {
  ClipboardList, Plus, X, MapPin, Clock, User, AlertCircle, Upload,
  Ban, ChevronDown
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type BlotterStatus = "reported" | "investigating" | "mediation" | "resolved" | "escalated" | "closed" | "cancelled";

interface BlotterCase {
  id: string;
  incidentType: string;
  location: string;
  reportedBy: string;
  reportedById: string;
  status: BlotterStatus;
  date: string;
  time: string;
  description: string;
  narrative: string;
  respondent?: string;
  assignedTo?: string;
  cancellationReason?: string;
  evidence?: string[];
}

const incidentTypes = [
  "Noise Complaint", "Property Dispute", "Physical Altercation", "Verbal Abuse",
  "Theft/Burglary", "Vandalism", "Domestic Issue", "Trespassing", "Illegal Parking", "Others",
];

const CANCEL_REASONS = [
  "Issue resolved",
  "Filed by mistake",
  "Duplicate report",
  "Personal reason",
  "Other",
];

const statusStyles: Record<BlotterStatus, string> = {
  reported: "bg-gray-100 text-gray-700 border-gray-200",
  investigating: "bg-blue-100 text-blue-700 border-blue-200",
  mediation: "bg-amber-100 text-amber-700 border-amber-200",
  resolved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  escalated: "bg-red-100 text-red-700 border-red-200",
  closed: "bg-slate-100 text-slate-700 border-slate-200",
  cancelled: "bg-pink-100 text-pink-700 border-pink-200",
};

export default function ResidentBlotterPage() {
  const { userData } = useAuth();
  const { toggle } = useSidebarToggle();
  const { toast } = useToast();
  const evidenceRef = useRef<HTMLInputElement>(null);

  const [cases, setCases] = useState<BlotterCase[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (userData?.uid) {
      api.blotter.list(userData.uid).then(setCases).catch(console.error);
    }
  }, [userData?.uid]);
  const [loading, setLoading] = useState(false);
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [cancelModal, setCancelModal] = useState<BlotterCase | null>(null);
  const [cancelReason, setCancelReason] = useState(CANCEL_REASONS[0]);
  const [cancelNote, setCancelNote] = useState("");

  const [form, setForm] = useState({
    incidentType: incidentTypes[0],
    location: "",
    lat: 0,
    lng: 0,
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
    description: "",
    narrative: "",
    respondent: "",
  });

  const handleMapChange = (address: string, lat: number, lng: number) => {
    setForm(p => ({ ...p, location: address, lat, lng }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.location.trim() || !form.description.trim()) return;
    setLoading(true);
    try {
      const blotterNum = `BLT-00${String(Date.now()).slice(-4)}`;
      const created = await api.blotter.create({
        id: blotterNum,
        incidentType: form.incidentType,
        location: form.location,
        reportedBy: userData?.fullName ?? "Resident",
        reportedById: userData?.uid ?? "",
        status: "reported",
        date: form.date,
        time: form.time,
        description: form.description,
        narrative: form.narrative,
        respondent: form.respondent || null,
        notifyParties: true,
      });
      setCases(prev => [created, ...prev]);
      setShowForm(false);
      setForm({
        incidentType: incidentTypes[0], location: "", lat: 0, lng: 0,
        date: new Date().toISOString().split("T")[0], time: "", description: "", narrative: "", respondent: "",
      });
      setEvidenceFiles([]);
      toast({ title: "Blotter Filed", description: `Case ${created.id} has been filed and will be reviewed by barangay officials.` });
    } catch (err) {
      toast({ title: "Error", description: "Failed to file blotter case. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    if (!cancelModal) return;
    const reason = cancelReason === "Other" ? cancelNote : cancelReason;
    await api.blotter.update(cancelModal.id, { status: "cancelled", cancellationReason: reason });
    setCases(prev => prev.map(c => c.id === cancelModal.id
      ? { ...c, cancellationReason: reason, status: "cancelled" }
      : c
    ));
    setCancelModal(null);
    setCancelReason(CANCEL_REASONS[0]);
    setCancelNote("");
    toast({ title: "Cancellation Requested", description: "Your cancellation request has been submitted to barangay officials for review." });
  };

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Blotter Report"
        description="File and track incident reports"
        onMenuClick={toggle}
        actions={
          <Button size="sm" className="bg-primary hover:bg-primary/90 gap-2" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" /> File Report
          </Button>
        }
      />

      <div className="p-4 sm:p-6 animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-4">
        {/* File Blotter Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-[999] flex items-start justify-center p-4 overflow-y-auto">
            <Card className="w-full max-w-2xl p-6 shadow-2xl my-4 animate-fadeUp">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-foreground">File Blotter Report</h2>
                <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Incident Type */}
                <div>
                  <Label>Incident Type</Label>
                  <select
                    value={form.incidentType}
                    onChange={e => setForm(p => ({ ...p, incidentType: e.target.value }))}
                    className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    {incidentTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                {/* Interactive Map Location */}
                <div>
                  <Label>Location of Incident</Label>
                  <div className="mt-1">
                    <MapPicker value={form.location} onChange={handleMapChange} />
                  </div>
                  {!form.location && (
                    <p className="text-xs text-destructive mt-0.5">Please click the map to set the location</p>
                  )}
                </div>

                {/* Date & Time */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Date</Label>
                    <Input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="mt-1" required />
                  </div>
                  <div>
                    <Label>Time</Label>
                    <Input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} className="mt-1" required />
                  </div>
                </div>

                {/* Respondent */}
                <div>
                  <Label>Respondent (Optional)</Label>
                  <Input
                    value={form.respondent}
                    onChange={e => setForm(p => ({ ...p, respondent: e.target.value }))}
                    placeholder="Name of person/party involved"
                    className="mt-1"
                  />
                </div>

                {/* Description */}
                <div>
                  <Label>Brief Description <span className="text-destructive">*</span></Label>
                  <Input
                    value={form.description}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Short description of what happened"
                    className="mt-1"
                    required
                  />
                </div>

                {/* Narrative */}
                <div>
                  <Label>Narrative (Detailed Account)</Label>
                  <Textarea
                    value={form.narrative}
                    onChange={e => setForm(p => ({ ...p, narrative: e.target.value }))}
                    placeholder="Describe in detail what happened, who was involved, and any witnesses..."
                    className="mt-1 min-h-[100px]"
                  />
                </div>

                {/* Evidence Upload */}
                <div>
                  <Label>Upload Evidence (Optional)</Label>
                  <div
                    className="mt-1 border-2 border-dashed border-border rounded-xl p-4 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all"
                    onClick={() => evidenceRef.current?.click()}
                  >
                    <input
                      ref={evidenceRef}
                      type="file"
                      multiple
                      accept="image/*,video/*,.pdf"
                      className="hidden"
                      onChange={e => setEvidenceFiles(prev => [...prev, ...Array.from(e.target.files ?? [])])}
                    />
                    <Upload className="w-6 h-6 text-muted-foreground/50 mx-auto mb-1.5" />
                    <p className="text-sm text-muted-foreground">Photos, videos, or documents as evidence</p>
                  </div>
                  {evidenceFiles.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {evidenceFiles.map((f, i) => (
                        <div key={i} className="flex items-center justify-between px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                          <span className="text-blue-700 truncate flex-1">{f.name}</span>
                          <button type="button" onClick={() => setEvidenceFiles(prev => prev.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive ml-2">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Warning */}
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Filing false blotter reports is a punishable offense. Ensure all information is accurate and truthful.</span>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">Cancel</Button>
                  <Button
                    type="submit"
                    disabled={loading || !form.location}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {loading
                      ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />Filing...</span>
                      : "Submit Blotter"
                    }
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Cancel Request Modal */}
        {cancelModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md p-6 shadow-2xl animate-fadeUp">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-foreground">Request Cancellation</h2>
                <button onClick={() => setCancelModal(null)} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Case <span className="font-mono font-medium text-foreground">{cancelModal.id}</span> — {cancelModal.incidentType}
              </p>
              <div className="space-y-3">
                <div>
                  <Label>Reason for Cancellation</Label>
                  <select
                    value={cancelReason}
                    onChange={e => setCancelReason(e.target.value)}
                    className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    {CANCEL_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                {cancelReason === "Other" && (
                  <div>
                    <Label>Please specify</Label>
                    <Textarea
                      value={cancelNote}
                      onChange={e => setCancelNote(e.target.value)}
                      placeholder="Describe the reason..."
                      className="mt-1 min-h-[80px]"
                    />
                  </div>
                )}
                <div className="p-3 bg-pink-50 border border-pink-200 rounded-lg text-xs text-pink-700 flex items-start gap-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>Your cancellation request will be reviewed by barangay officials before it is processed.</span>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setCancelModal(null)} className="flex-1">Cancel</Button>
                  <Button onClick={handleCancelRequest} className="flex-1 bg-pink-600 hover:bg-pink-700 text-white gap-1">
                    <Ban className="w-3.5 h-3.5" /> Submit Cancellation
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Cases List */}
        <h2 className="font-semibold text-foreground">My Blotter Reports ({cases.length})</h2>
        {cases.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-border/60">
            <ClipboardList className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No blotter reports filed</p>
            <Button size="sm" className="mt-3 bg-primary hover:bg-primary/90 gap-2" onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4" /> File a Report
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {cases.map(c => (
              <Card key={c.id} className="p-5 border-border/50 hover:border-primary/30 transition-all">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <span className="text-xs font-mono text-muted-foreground">{c.id}</span>
                    <h3 className="font-semibold text-foreground mt-0.5">{c.incidentType}</h3>
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border capitalize ${statusStyles[c.status]}`}>
                    {c.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{c.description}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{c.location.split(",").slice(0, 2).join(", ")}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(c.date).toLocaleDateString("en-PH", { month: "short", day: "numeric" })} {c.time}</span>
                  {c.assignedTo && (
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />Assigned: {c.assignedTo}</span>
                  )}
                </div>
                {c.cancellationReason && (
                  <div className="mb-3 text-xs text-pink-700 bg-pink-50 px-3 py-2 rounded-lg border border-pink-200">
                    Cancellation reason: {c.cancellationReason}
                  </div>
                )}
                {c.evidence && c.evidence.length > 0 && (
                  <p className="text-xs text-muted-foreground mb-3">Evidence: {c.evidence.join(", ")}</p>
                )}
                {/* Cancel Request button only for active cases */}
                {!["resolved", "closed", "cancelled", "escalated"].includes(c.status) && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-pink-300 text-pink-700 hover:bg-pink-50 gap-1.5 text-xs"
                    onClick={() => { setCancelModal(c); setCancelReason(CANCEL_REASONS[0]); }}
                  >
                    <Ban className="w-3.5 h-3.5" /> Request Cancellation
                  </Button>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
