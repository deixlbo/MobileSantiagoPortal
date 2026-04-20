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
  ClipboardList, Search, Plus, X, MapPin, Clock, User, Eye,
  CalendarDays, List, CheckCircle2, XCircle, AlertCircle, Ban,
  Printer, Users, MessageSquare, PhoneCall, Scale
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type BlotterStatus = "reported" | "investigating" | "mediation" | "resolved" | "escalated" | "closed" | "cancelled" | "scheduled" | "settled" | "unsettled" | "no-show";

interface Hearing {
  date: string;
  time: string;
  luponOfficer: string;
}

interface BlotterCase {
  id: string;
  incidentType: string;
  location: string;
  reportedBy: string;
  reportedById: string;
  respondent?: string;
  status: BlotterStatus;
  date: string;
  time: string;
  description: string;
  narrative: string;
  witnesses?: string[];
  assignedTo?: string;
  resolution?: string;
  resolutionDetails?: string;
  agreementDetails?: string;
  remarks?: string;
  cancellationReason?: string;
  rejectionReason?: string;
  hearing?: Hearing;
  complainantPresent?: boolean;
  respondentPresent?: boolean;
}

const incidentTypes = [
  "Noise Complaint", "Property Dispute", "Physical Altercation", "Verbal Abuse",
  "Theft/Burglary", "Vandalism", "Domestic Issue", "Trespassing", "Illegal Parking", "Others"
];

const statusColors: Record<BlotterStatus, string> = {
  reported: "bg-gray-100 text-gray-700 border-gray-200",
  investigating: "bg-blue-100 text-blue-700 border-blue-200",
  mediation: "bg-amber-100 text-amber-700 border-amber-200",
  resolved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  escalated: "bg-red-100 text-red-700 border-red-200",
  closed: "bg-slate-100 text-slate-700 border-slate-200",
  cancelled: "bg-pink-100 text-pink-700 border-pink-200",
  scheduled: "bg-indigo-100 text-indigo-700 border-indigo-200",
  settled: "bg-teal-100 text-teal-700 border-teal-200",
  unsettled: "bg-orange-100 text-orange-700 border-orange-200",
  "no-show": "bg-rose-100 text-rose-700 border-rose-200",
};

const CANCELLATION_REASONS = ["Issue resolved", "Filed by mistake", "Duplicate report", "Personal reason", "Other"];

function BlotterReportPrint({ c, onClose }: { c: BlotterCase; onClose: () => void }) {
  const today = new Date().toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" });
  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-start justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-2xl shadow-2xl my-4 bg-white">
        <div className="flex items-center justify-between px-6 py-4 border-b print:hidden">
          <h2 className="font-bold">Blotter Report</h2>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => window.print()} className="gap-1.5"><Printer className="w-4 h-4" /> Print</Button>
            <button onClick={onClose} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"><X className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="p-8 sm:p-12 bg-white" id="print-area">
          <div className="text-center mb-6">
            <p className="text-sm font-semibold">Republic of the Philippines</p>
            <p className="text-sm">Province of Zambales · Municipality of San Antonio</p>
            <p className="text-base font-bold mt-1">BARANGAY SANTIAGO SAZ</p>
            <p className="text-sm">Office of the Punong Barangay</p>
            <div className="border-b-2 border-gray-800 mt-4 mb-4" />
            <h1 className="text-xl font-bold uppercase">Barangay Blotter Record</h1>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div><span className="font-semibold">Case No.:</span> {c.id}</div>
            <div><span className="font-semibold">Date:</span> {today}</div>
            <div><span className="font-semibold">Incident Type:</span> {c.incidentType}</div>
            <div><span className="font-semibold">Status:</span> {c.status}</div>
            <div><span className="font-semibold">Complainant:</span> {c.reportedBy}</div>
            <div><span className="font-semibold">Respondent:</span> {c.respondent || "Unknown"}</div>
            <div><span className="font-semibold">Location:</span> {c.location}</div>
            <div><span className="font-semibold">Date of Incident:</span> {new Date(c.date).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" })} {c.time}</div>
          </div>
          <div className="mb-4">
            <p className="font-semibold text-sm mb-1">Description:</p>
            <p className="text-sm border border-gray-300 rounded p-2 min-h-[40px]">{c.description}</p>
          </div>
          <div className="mb-4">
            <p className="font-semibold text-sm mb-1">Narrative:</p>
            <p className="text-sm border border-gray-300 rounded p-2 min-h-[80px] whitespace-pre-wrap">{c.narrative}</p>
          </div>
          {c.hearing && (
            <div className="mb-4">
              <p className="font-semibold text-sm mb-1">Hearing / Mediation:</p>
              <p className="text-sm">{new Date(c.hearing.date).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" })} at {c.hearing.time} — {c.hearing.luponOfficer}</p>
            </div>
          )}
          {c.resolutionDetails && (
            <div className="mb-4">
              <p className="font-semibold text-sm mb-1">Resolution:</p>
              <p className="text-sm border border-gray-300 rounded p-2 min-h-[40px]">{c.resolutionDetails}</p>
            </div>
          )}
          {c.remarks && (
            <div className="mb-4">
              <p className="font-semibold text-sm mb-1">Remarks:</p>
              <p className="text-sm">{c.remarks}</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-8 mt-10">
            <div>
              <p className="text-sm font-semibold mb-6">Recorded by:</p>
              <div className="border-b border-gray-500" />
              <p className="text-xs text-gray-500 mt-1">Barangay Secretary</p>
            </div>
            <div>
              <p className="text-sm font-semibold mb-6">Noted by:</p>
              <div className="border-b border-gray-500" />
              <p className="text-xs text-gray-500 mt-1">HON. ROLANDO C. BORJA / Punong Barangay</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function OfficialBlotterPage() {
  const { toggle } = useSidebarToggle();
  const { toast } = useToast();
  const [cases, setCases] = useState<BlotterCase[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | BlotterStatus>("all");
  const [selected, setSelected] = useState<BlotterCase | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [view, setView] = useState<"list" | "calendar">("list");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [printCase, setPrintCase] = useState<BlotterCase | null>(null);

  // Sub-form states
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showHearingForm, setShowHearingForm] = useState(false);
  const [hearing, setHearing] = useState({ date: "", time: "", luponOfficer: "" });
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelReason, setCancelReason] = useState(CANCELLATION_REASONS[0]);
  const [cancelNote, setCancelNote] = useState("");
  const [showResolutionForm, setShowResolutionForm] = useState(false);
  const [resolution, setResolution] = useState({ details: "", agreement: "", remarks: "", outcome: "settled" as "settled" | "unsettled" | "no-show" });
  const [showAttendance, setShowAttendance] = useState(false);
  const [attendance, setAttendance] = useState({ complainant: true, respondent: true });

  useEffect(() => {
    api.blotter.list().then(data => setCases(data as BlotterCase[])).catch(console.error);
  }, []);

  const markedDates = cases.map(c => c.date);
  const getDateCount = (date: string) => cases.filter(c => c.date === date).length;

  const filtered = cases.filter(c => {
    const matchSearch = c.id.toLowerCase().includes(search.toLowerCase())
      || c.incidentType.toLowerCase().includes(search.toLowerCase())
      || c.reportedBy.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || c.status === filter;
    const matchDate = !selectedDate || c.date === selectedDate;
    return matchSearch && matchFilter && matchDate;
  });

  const updateStatus = async (id: string, status: BlotterStatus, extra?: Partial<BlotterCase>) => {
    await api.blotter.update(id, { status, ...extra });
    setCases(prev => prev.map(c => c.id === id ? { ...c, status, ...extra } : c));
    setSelected(prev => prev ? { ...prev, status, ...extra } : null);
    toast({ title: "Status Updated", description: `Case updated to: ${status}` });
  };

  const handleApprove = () => {
    if (!selected) return;
    updateStatus(selected.id, "investigating");
    toast({ title: "Blotter Approved", description: "Case is now under investigation. Both parties will be notified." });
  };

  const handleReject = () => {
    if (!selected || !rejectionReason.trim()) return;
    updateStatus(selected.id, "cancelled", { rejectionReason });
    setShowRejectForm(false);
    setRejectionReason("");
    toast({ title: "Blotter Rejected", description: "Complainant has been notified with the reason." });
  };

  const handleScheduleHearing = () => {
    if (!selected || !hearing.date || !hearing.time || !hearing.luponOfficer) return;
    updateStatus(selected.id, "scheduled", { hearing: { ...hearing } });
    setShowHearingForm(false);
    setHearing({ date: "", time: "", luponOfficer: "" });
    toast({ title: "Hearing Scheduled", description: `Both parties notified for ${new Date(hearing.date).toLocaleDateString("en-PH", { month: "long", day: "numeric" })} at ${hearing.time}.` });
  };

  const handleRecordAttendance = () => {
    if (!selected) return;
    updateStatus(selected.id, "mediation", {
      complainantPresent: attendance.complainant,
      respondentPresent: attendance.respondent,
    });
    setShowAttendance(false);
    toast({ title: "Attendance Recorded", description: "Hearing attendance has been noted." });
  };

  const handleRecordResolution = () => {
    if (!selected) return;
    const newStatus: BlotterStatus = resolution.outcome === "settled" ? "settled"
      : resolution.outcome === "no-show" ? "no-show" : "unsettled";
    updateStatus(selected.id, newStatus, {
      resolutionDetails: resolution.details,
      agreementDetails: resolution.agreement,
      remarks: resolution.remarks,
    });
    setShowResolutionForm(false);
    setResolution({ details: "", agreement: "", remarks: "", outcome: "settled" });
    toast({ title: "Resolution Recorded", description: `Case outcome: ${resolution.outcome}.` });
  };

  const handleCancelApprove = () => {
    if (!selected) return;
    const reason = cancelReason === "Other" ? cancelNote : cancelReason;
    updateStatus(selected.id, "cancelled", { cancellationReason: reason });
    setShowCancelForm(false);
    setCancelNote("");
    setCancelReason(CANCELLATION_REASONS[0]);
    setSelected(null);
    toast({ title: "Cancellation Approved", description: "Case has been marked as cancelled." });
  };

  const [form, setForm] = useState({
    incidentType: incidentTypes[0],
    location: "",
    date: new Date().toISOString().split("T")[0],
    time: "",
    reportedBy: "",
    respondent: "",
    description: "",
    narrative: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextId = `BLT-00${33 + cases.length}`;
    setCases(prev => [{
      id: nextId,
      incidentType: form.incidentType,
      location: form.location,
      reportedBy: form.reportedBy,
      reportedById: "official-entry",
      respondent: form.respondent || undefined,
      status: "reported",
      date: form.date,
      time: form.time,
      description: form.description,
      narrative: form.narrative,
      witnesses: [],
    }, ...prev]);
    setShowForm(false);
    toast({ title: "Blotter Filed", description: `Case ${nextId} has been recorded.` });
  };

  const calendarCases = selectedDate ? cases.filter(c => c.date === selectedDate) : [];

  const closeAllSubForms = () => {
    setShowRejectForm(false);
    setShowHearingForm(false);
    setShowCancelForm(false);
    setShowResolutionForm(false);
    setShowAttendance(false);
  };

  return (
    <div className="flex-1 flex flex-col">
      {printCase && <BlotterReportPrint c={printCase} onClose={() => setPrintCase(null)} />}

      <PortalHeader
        title="Blotter Cases"
        description={`${cases.filter(c => !["resolved", "closed", "cancelled", "settled"].includes(c.status)).length} active cases`}
        onMenuClick={toggle}
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant={view === "list" ? "default" : "outline"} onClick={() => setView("list")} className="gap-1.5">
              <List className="w-4 h-4" /><span className="hidden sm:inline">List</span>
            </Button>
            <Button size="sm" variant={view === "calendar" ? "default" : "outline"} onClick={() => setView("calendar")} className="gap-1.5">
              <CalendarDays className="w-4 h-4" /><span className="hidden sm:inline">Calendar</span>
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90 gap-2" onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4" /><span className="hidden sm:inline">New Case</span>
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
                    {" — "}<span className="text-muted-foreground">{calendarCases.length} case(s)</span>
                  </p>
                  {calendarCases.length === 0 ? (
                    <Card className="p-8 text-center">
                      <ClipboardList className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-muted-foreground text-sm">No cases on this date</p>
                    </Card>
                  ) : (
                    calendarCases.map(c => (
                      <Card key={c.id} className="p-4 border-border/50 hover:border-primary/30 cursor-pointer transition-all" onClick={() => setSelected(c)}>
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <span className="text-xs font-mono text-muted-foreground">{c.id}</span>
                            <p className="text-sm font-semibold text-foreground">{c.incidentType}</p>
                            <p className="text-xs text-muted-foreground">{c.reportedBy} · {c.location}</p>
                          </div>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusColors[c.status]}`}>{c.status}</span>
                        </div>
                      </Card>
                    ))
                  )}
                </>
              ) : (
                <Card className="p-8 text-center border-dashed">
                  <CalendarDays className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">Click a highlighted date to see cases</p>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* List View */}
        {view === "list" && (
          <>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="Search cases..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {(["all", "reported", "investigating", "scheduled", "mediation", "settled", "unsettled", "no-show", "resolved", "escalated", "closed", "cancelled"] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`text-xs px-2.5 py-1.5 rounded-full border font-medium transition-all ${filter === f ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
                  >
                    {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1).replace(/-/g, " ")}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {filtered.length === 0 ? (
                <div className="text-center py-12">
                  <ClipboardList className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">No cases found</p>
                </div>
              ) : (
                filtered.map(c => (
                  <Card
                    key={c.id}
                    className="p-4 border-border/50 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer"
                    onClick={() => { setSelected(c); closeAllSubForms(); }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <ClipboardList className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-mono text-muted-foreground">{c.id}</span>
                            <span className="text-xs text-muted-foreground">{new Date(c.date).toLocaleDateString("en-PH", { month: "short", day: "numeric" })}</span>
                          </div>
                          <p className="text-sm font-semibold text-foreground">{c.incidentType}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><User className="w-3 h-3" />{c.reportedBy}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{c.location}</span>
                          </div>
                          {c.hearing && (
                            <p className="text-xs text-indigo-600 mt-1">Hearing: {new Date(c.hearing.date).toLocaleDateString("en-PH", { month: "short", day: "numeric" })} at {c.hearing.time}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border capitalize ${statusColors[c.status]}`}>{c.status.replace(/-/g, " ")}</span>
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </>
        )}

        {/* Case Detail Modal */}
        {selected && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <Card className="w-full max-w-2xl p-6 shadow-2xl my-4 animate-fadeUp">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-xs font-mono text-muted-foreground">{selected.id}</span>
                  <h2 className="text-lg font-bold text-foreground">{selected.incidentType}</h2>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <button
                    onClick={() => setPrintCase(selected)}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition"
                    title="Generate Printable Report"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  <button onClick={() => { setSelected(null); closeAllSubForms(); }} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                {[
                  { label: "Complainant", value: selected.reportedBy },
                  { label: "Respondent", value: selected.respondent || "Unknown" },
                  { label: "Location", value: selected.location },
                  { label: "Date/Time", value: `${new Date(selected.date).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })} ${selected.time}` },
                ].map((item, i) => (
                  <div key={i} className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-medium text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mb-4 p-4 bg-muted/40 rounded-lg">
                <p className="text-xs font-medium text-muted-foreground mb-1">Description</p>
                <p className="text-sm text-foreground">{selected.description}</p>
                {selected.narrative && (
                  <>
                    <p className="text-xs font-medium text-muted-foreground mt-3 mb-1">Narrative</p>
                    <p className="text-sm text-foreground leading-relaxed">{selected.narrative}</p>
                  </>
                )}
              </div>

              {/* Hearing info */}
              {selected.hearing && (
                <div className="mb-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                  <p className="text-xs font-semibold text-indigo-800 mb-1">Scheduled Hearing</p>
                  <p className="text-sm text-indigo-700">
                    {new Date(selected.hearing.date).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" })} at {selected.hearing.time}
                  </p>
                  <p className="text-xs text-indigo-600">Lupon: {selected.hearing.luponOfficer}</p>
                </div>
              )}

              {/* Attendance */}
              {(selected.complainantPresent !== undefined || selected.respondentPresent !== undefined) && (
                <div className="mb-4 p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Attendance</p>
                  <div className="flex gap-4 text-sm">
                    <span className={selected.complainantPresent ? "text-emerald-600" : "text-red-600"}>
                      Complainant: {selected.complainantPresent ? "Present" : "Absent"}
                    </span>
                    <span className={selected.respondentPresent ? "text-emerald-600" : "text-red-600"}>
                      Respondent: {selected.respondentPresent ? "Present" : "Absent"}
                    </span>
                  </div>
                </div>
              )}

              {/* Resolution details */}
              {selected.resolutionDetails && (
                <div className="mb-4 p-3 bg-teal-50 rounded-lg border border-teal-200">
                  <p className="text-xs font-semibold text-teal-800 mb-1">Resolution</p>
                  <p className="text-sm text-teal-700">{selected.resolutionDetails}</p>
                  {selected.agreementDetails && <p className="text-xs text-teal-600 mt-1">Agreement: {selected.agreementDetails}</p>}
                  {selected.remarks && <p className="text-xs text-teal-600 mt-1">Remarks: {selected.remarks}</p>}
                </div>
              )}

              {selected.rejectionReason && (
                <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-xs font-medium text-red-800 mb-0.5">Rejection Reason</p>
                  <p className="text-sm text-red-700">{selected.rejectionReason}</p>
                </div>
              )}

              {selected.cancellationReason && (
                <div className="mb-4 p-3 bg-pink-50 rounded-lg border border-pink-200">
                  <p className="text-xs font-medium text-pink-800 mb-0.5">Cancellation Reason</p>
                  <p className="text-sm text-pink-700">{selected.cancellationReason}</p>
                </div>
              )}

              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-medium text-foreground">Status:</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${statusColors[selected.status]}`}>{selected.status.replace(/-/g, " ")}</span>
              </div>

              {/* ── STEP 5: Review — Approve or Reject ── */}
              {selected.status === "reported" && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs font-semibold text-blue-800 mb-3">Step 5: Review Blotter Report</p>
                  {showRejectForm ? (
                    <div className="space-y-2">
                      <Label className="text-xs">Rejection Reason</Label>
                      <Textarea value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} placeholder="State reason for rejection..." className="min-h-[60px] text-sm" />
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setShowRejectForm(false)} className="flex-1">Cancel</Button>
                        <Button size="sm" onClick={handleReject} className="flex-1 bg-red-600 hover:bg-red-700 text-white gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Confirm Reject
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleApprove} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setShowRejectForm(true)} className="flex-1 border-red-300 text-red-700 hover:bg-red-50 gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* ── STEP 7: Schedule Hearing ── */}
              {(selected.status === "investigating" || selected.status === "mediation") && !selected.hearing && (
                <div className="mb-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <p className="text-xs font-semibold text-indigo-800 mb-3">Step 7: Set Mediation / Hearing</p>
                  {showHearingForm ? (
                    <div className="space-y-3">
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div><Label className="text-xs">Date</Label><Input type="date" value={hearing.date} onChange={e => setHearing(p => ({ ...p, date: e.target.value }))} className="mt-0.5 h-8 text-sm" /></div>
                        <div><Label className="text-xs">Time</Label><Input type="time" value={hearing.time} onChange={e => setHearing(p => ({ ...p, time: e.target.value }))} className="mt-0.5 h-8 text-sm" /></div>
                      </div>
                      <div><Label className="text-xs">Lupon Tagapamayapa / Officer</Label><Input value={hearing.luponOfficer} onChange={e => setHearing(p => ({ ...p, luponOfficer: e.target.value }))} placeholder="Name of assigned officer" className="mt-0.5 h-8 text-sm" /></div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setShowHearingForm(false)} className="flex-1">Cancel</Button>
                        <Button size="sm" onClick={handleScheduleHearing} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white gap-1">
                          <CalendarDays className="w-3.5 h-3.5" /> Schedule & Notify
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button size="sm" onClick={() => setShowHearingForm(true)} className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white">
                      <CalendarDays className="w-3.5 h-3.5" /> Schedule Hearing
                    </Button>
                  )}
                  <div className="mt-2 flex items-center gap-4 text-xs text-indigo-700">
                    <span className="flex items-center gap-1"><PhoneCall className="w-3 h-3" /> Complainant will be notified</span>
                    <span className="flex items-center gap-1"><PhoneCall className="w-3 h-3" /> Respondent will be notified</span>
                  </div>
                </div>
              )}

              {/* ── STEP 9: Record Attendance ── */}
              {selected.status === "scheduled" && (
                <div className="mb-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-xs font-semibold text-amber-800 mb-3">Step 9: Conduct Hearing — Record Attendance</p>
                  {showAttendance ? (
                    <div className="space-y-3">
                      {[
                        { key: "complainant", label: `Complainant (${selected.reportedBy})` },
                        { key: "respondent", label: `Respondent (${selected.respondent || "Unknown"})` },
                      ].map(({ key, label }) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-sm">{label}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setAttendance(p => ({ ...p, [key]: true }))}
                              className={`text-xs px-2.5 py-1 rounded-full border transition ${attendance[key as "complainant" | "respondent"] ? "bg-emerald-600 text-white border-emerald-600" : "border-border text-muted-foreground hover:bg-muted"}`}
                            >
                              Present
                            </button>
                            <button
                              onClick={() => setAttendance(p => ({ ...p, [key]: false }))}
                              className={`text-xs px-2.5 py-1 rounded-full border transition ${!attendance[key as "complainant" | "respondent"] ? "bg-red-500 text-white border-red-500" : "border-border text-muted-foreground hover:bg-muted"}`}
                            >
                              Absent
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline" onClick={() => setShowAttendance(false)} className="flex-1">Cancel</Button>
                        <Button size="sm" onClick={handleRecordAttendance} className="flex-1 bg-amber-600 hover:bg-amber-700 text-white">
                          <Users className="w-3.5 h-3.5 mr-1" /> Save Attendance
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button size="sm" onClick={() => setShowAttendance(true)} className="gap-1.5 bg-amber-600 hover:bg-amber-700 text-white">
                      <Users className="w-3.5 h-3.5" /> Record Attendance
                    </Button>
                  )}
                </div>
              )}

              {/* ── STEP 10–12: Outcome & Resolution ── */}
              {(selected.status === "mediation" || selected.status === "scheduled") && (
                <div className="mb-4 p-4 bg-teal-50 rounded-lg border border-teal-200">
                  <p className="text-xs font-semibold text-teal-800 mb-3">Step 10–12: Record Hearing Outcome & Resolution</p>
                  {showResolutionForm ? (
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs">Outcome</Label>
                        <div className="flex gap-2 mt-1">
                          {(["settled", "unsettled", "no-show"] as const).map(o => (
                            <button
                              key={o}
                              onClick={() => setResolution(p => ({ ...p, outcome: o }))}
                              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition capitalize ${resolution.outcome === o
                                ? o === "settled" ? "bg-teal-600 text-white border-teal-600"
                                  : o === "no-show" ? "bg-rose-500 text-white border-rose-500"
                                  : "bg-orange-500 text-white border-orange-500"
                                : "border-border text-muted-foreground hover:bg-muted"}`}
                            >
                              {o === "settled" ? "🤝 Settled" : o === "unsettled" ? "⚖️ Unsettled" : "🚫 No Show"}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div><Label className="text-xs">Resolution Details</Label><Textarea value={resolution.details} onChange={e => setResolution(p => ({ ...p, details: e.target.value }))} className="mt-0.5 min-h-[60px] text-sm" placeholder="Describe the resolution..." /></div>
                      {resolution.outcome === "settled" && (
                        <div><Label className="text-xs">Agreement Details</Label><Textarea value={resolution.agreement} onChange={e => setResolution(p => ({ ...p, agreement: e.target.value }))} className="mt-0.5 min-h-[60px] text-sm" placeholder="Terms of agreement..." /></div>
                      )}
                      <div><Label className="text-xs">Remarks</Label><Input value={resolution.remarks} onChange={e => setResolution(p => ({ ...p, remarks: e.target.value }))} className="mt-0.5 text-sm" placeholder="Additional remarks..." /></div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setShowResolutionForm(false)} className="flex-1">Cancel</Button>
                        <Button size="sm" onClick={handleRecordResolution} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white">
                          <Scale className="w-3.5 h-3.5 mr-1" /> Save Outcome
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button size="sm" onClick={() => setShowResolutionForm(true)} className="gap-1.5 bg-teal-600 hover:bg-teal-700 text-white">
                      <Scale className="w-3.5 h-3.5" /> Encode Outcome
                    </Button>
                  )}
                </div>
              )}

              {/* Cancel form */}
              {showCancelForm && (
                <div className="mb-4 p-3 bg-pink-50 rounded-lg border border-pink-200">
                  <p className="text-xs font-semibold text-pink-800 mb-2">Process Cancellation Request</p>
                  <div className="mb-2">
                    <Label className="text-xs">Cancellation Reason</Label>
                    <select value={cancelReason} onChange={e => setCancelReason(e.target.value)} className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none">
                      {CANCELLATION_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  {cancelReason === "Other" && (
                    <Textarea value={cancelNote} onChange={e => setCancelNote(e.target.value)} placeholder="Specify reason..." className="mb-2 min-h-[60px] text-sm" />
                  )}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setShowCancelForm(false)} className="flex-1">Cancel</Button>
                    <Button size="sm" onClick={handleCancelApprove} className="flex-1 bg-pink-600 hover:bg-pink-700 text-white gap-1">
                      <Ban className="w-3.5 h-3.5" /> Approve Cancellation
                    </Button>
                  </div>
                </div>
              )}

              {/* Main action buttons */}
              <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
                {!["reported"].includes(selected.status) && (
                  <Button size="sm" variant="outline" onClick={() => updateStatus(selected.id, "investigating")} className="gap-1 border-blue-300 text-blue-700">
                    <AlertCircle className="w-3.5 h-3.5" /> Investigate
                  </Button>
                )}
                {!["reported"].includes(selected.status) && (
                  <Button size="sm" variant="outline" onClick={() => updateStatus(selected.id, "mediation")} className="gap-1 border-amber-300 text-amber-700">
                    <MessageSquare className="w-3.5 h-3.5" /> Mediation
                  </Button>
                )}
                <Button size="sm" onClick={() => updateStatus(selected.id, "resolved")} className="gap-1 bg-emerald-600 hover:bg-emerald-700 text-white">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Resolve
                </Button>
                <Button size="sm" onClick={() => updateStatus(selected.id, "escalated")} variant="destructive" className="gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Escalate
                </Button>
                <Button size="sm" onClick={() => updateStatus(selected.id, "closed")} variant="outline" className="gap-1 border-slate-300 text-slate-700">
                  <XCircle className="w-3.5 h-3.5" /> Close
                </Button>
                <Button size="sm" onClick={() => { setShowCancelForm(!showCancelForm); setShowRejectForm(false); setShowHearingForm(false); setShowResolutionForm(false); }} variant="outline" className="gap-1 border-pink-300 text-pink-700 hover:bg-pink-50">
                  <Ban className="w-3.5 h-3.5" /> Cancellation
                </Button>
                <Button size="sm" variant="outline" onClick={() => setPrintCase(selected)} className="gap-1 border-gray-300 text-gray-700">
                  <Printer className="w-3.5 h-3.5" /> Print Report
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Add Case Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <Card className="w-full max-w-2xl p-6 shadow-2xl my-4 animate-fadeUp">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-foreground">Record New Blotter Case</h2>
                <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Incident Type</Label>
                    <select value={form.incidentType} onChange={e => setForm(p => ({ ...p, incidentType: e.target.value }))} className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                      {incidentTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="Location of incident" className="mt-1" required />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Complainant / Reported By</Label>
                    <Input value={form.reportedBy} onChange={e => setForm(p => ({ ...p, reportedBy: e.target.value }))} placeholder="Full name" className="mt-1" required />
                  </div>
                  <div>
                    <Label>Respondent (Optional)</Label>
                    <Input value={form.respondent} onChange={e => setForm(p => ({ ...p, respondent: e.target.value }))} placeholder="Full name" className="mt-1" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><Label>Date</Label><Input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="mt-1" required /></div>
                  <div><Label>Time</Label><Input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} className="mt-1" required /></div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description" className="mt-1" required />
                </div>
                <div>
                  <Label>Narrative</Label>
                  <Textarea value={form.narrative} onChange={e => setForm(p => ({ ...p, narrative: e.target.value }))} placeholder="Detailed account of events..." className="mt-1 min-h-[100px]" />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">Cancel</Button>
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">Submit</Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
