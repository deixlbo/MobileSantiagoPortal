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
  FileText, Search, CheckCircle2, XCircle, Clock, AlertCircle, Eye,
  Printer, CalendarDays, List, FileQuestion, Settings, Plus, Trash2,
  Bell, Upload, File, CreditCard, Banknote
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type DocStatus = "approved" | "pending" | "processing" | "rejected" | "needs-docs" | "awaiting-payment" | "paid";

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  url: string;
}

interface DocRequest {
  id: string;
  residentId: string;
  residentName: string;
  documentType: string;
  purpose: string;
  status: DocStatus;
  date: string;
  address: string;
  notes: string;
  uploadedFiles?: UploadedFile[];
  paymentAmount?: number;
  paymentMethod?: "gcash" | "bank" | "cash";
  paymentDate?: string;
  paymentRef?: string;
}

interface DocType {
  name: string;
  requirements: string[];
}

const defaultDocTypes: DocType[] = [
  { name: "Barangay Clearance", requirements: ["Valid ID", "Recent photo (2x2)", "Proof of residency"] },
  { name: "Certificate of Indigency", requirements: ["Valid ID", "Recent photo (2x2)", "Proof of residency"] },
  { name: "Certificate of Residency", requirements: ["Valid ID", "Utility bill or proof of address"] },
  { name: "Business Clearance", requirements: ["Valid ID", "Business permit application", "Lease contract or proof of ownership"] },
  { name: "Certificate of Good Moral Character", requirements: ["Valid ID", "Recent photo (2x2)", "Recommendation letter (optional)"] },
];

const statusStyles: Record<DocStatus, string> = {
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  "needs-docs": "bg-purple-50 text-purple-700 border-purple-200",
  "awaiting-payment": "bg-orange-50 text-orange-700 border-orange-200",
  paid: "bg-teal-50 text-teal-700 border-teal-200",
};
const statusIcons: Record<DocStatus, React.ReactNode> = {
  approved: <CheckCircle2 className="w-3.5 h-3.5" />,
  pending: <Clock className="w-3.5 h-3.5" />,
  processing: <AlertCircle className="w-3.5 h-3.5" />,
  rejected: <XCircle className="w-3.5 h-3.5" />,
  "needs-docs": <FileQuestion className="w-3.5 h-3.5" />,
  "awaiting-payment": <CreditCard className="w-3.5 h-3.5" />,
  paid: <Banknote className="w-3.5 h-3.5" />,
};
const statusLabel: Record<DocStatus, string> = {
  approved: "Approved",
  pending: "Pending",
  processing: "Processing",
  rejected: "Rejected",
  "needs-docs": "Needs Docs",
  "awaiting-payment": "Awaiting Payment",
  paid: "Paid",
};

function SealImage({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-full overflow-hidden border-2 border-gray-300 bg-white flex items-center justify-center ${className}`}>
      <img src="/santiago.jpg" alt="Barangay Santiago Seal" className="w-full h-full object-cover"
        onError={e => { const t = e.currentTarget as HTMLImageElement; t.style.display = "none"; const p = t.parentElement; if (p) p.innerHTML = `<span style="font-size:8px;font-weight:700;text-align:center;color:#1a6b3c;padding:2px;">BRGY<br/>SGO</span>`; }} />
    </div>
  );
}
function SazImage({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-full overflow-hidden border-2 border-gray-300 bg-white flex items-center justify-center ${className}`}>
      <img src="/saz.jpg" alt="Saz Seal" className="w-full h-full object-cover"
        onError={e => { const t = e.currentTarget as HTMLImageElement; t.style.display = "none"; const p = t.parentElement; if (p) p.innerHTML = `<span style="font-size:8px;font-weight:700;text-align:center;color:#1a3c6b;padding:2px;">SAZ<br/>SAN<br/>ANT</span>`; }} />
    </div>
  );
}

function PrintDocument({ doc, onClose }: { doc: DocRequest; onClose: () => void }) {
  const today = new Date().toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" });
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-2xl p-8 shadow-2xl my-4 bg-white">
        <div className="flex justify-between items-start mb-6 print:hidden">
          <h2 className="font-bold text-foreground">Document Preview</h2>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => window.print()} className="gap-1.5 bg-primary"><Printer className="w-4 h-4" /> Print</Button>
            <Button size="sm" variant="outline" onClick={onClose}>Close</Button>
          </div>
        </div>
        <div className="border border-border rounded-lg p-8 text-sm print:border-0 bg-white" id="print-area">
          <div className="flex items-center justify-between mb-4">
            <SealImage className="w-20 h-20" />
            <div className="text-center flex-1 px-4">
              <p className="text-xs text-gray-600">Republic of the Philippines</p>
              <p className="text-xs text-gray-600">Province of Zambales · Municipality of San Antonio</p>
              <h1 className="font-bold text-base mt-1 uppercase">BARANGAY SANTIAGO SAZ</h1>
              <p className="text-xs text-gray-600">Office of the Punong Barangay</p>
            </div>
            <SazImage className="w-20 h-20" />
          </div>
          <div className="border-b-2 border-gray-800 mb-4" />
          <div className="text-center mb-6"><h2 className="font-bold text-base uppercase tracking-wide">{doc.documentType}</h2></div>
          <p className="text-muted-foreground text-xs mb-6">Date: <strong className="text-foreground">{today}</strong></p>
          <p className="leading-relaxed mb-4"><strong>TO WHOM IT MAY CONCERN:</strong></p>
          <p className="leading-relaxed mb-4">
            This is to certify that <strong>{doc.residentName}</strong>, a bonafide resident of <strong>{doc.address}</strong>,
            is hereby granted this <strong>{doc.documentType}</strong> for the purpose of <strong>{doc.purpose}</strong>.
          </p>
          <p className="leading-relaxed mb-4">This certification is issued upon the request of the above-named person and is for whatever legal purpose it may serve.</p>
          <div className="mt-12 text-center">
            <div className="inline-block">
              <p className="font-bold">HON. ROLANDO C. BORJA</p>
              <p className="text-xs text-muted-foreground">Punong Barangay</p>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">Doc Ref: {doc.id} · Issued: {today}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ReceiptDocument({ doc, onClose }: { doc: DocRequest; onClose: () => void }) {
  const receiptNo = `OR-${doc.id.replace("doc-", "").toUpperCase()}`;
  const payDate = doc.paymentDate ? new Date(doc.paymentDate).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" }) : new Date().toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" });
  const methodLabel: Record<string, string> = { gcash: "GCash", bank: "Bank Transfer", cash: "Cash" };
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-md p-8 shadow-2xl my-4 bg-white">
        <div className="flex justify-between items-start mb-6 print:hidden">
          <h2 className="font-bold text-foreground">Payment Receipt</h2>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => window.print()} className="gap-1.5 bg-primary"><Printer className="w-4 h-4" /> Print</Button>
            <Button size="sm" variant="outline" onClick={onClose}>Close</Button>
          </div>
        </div>
        <div className="border-2 border-gray-300 rounded-lg p-6 bg-white" id="receipt-area">
          {/* Header */}
          <div className="text-center mb-4">
            <p className="text-xs text-gray-600">Republic of the Philippines</p>
            <p className="text-xs text-gray-600">Province of Zambales · Municipality of San Antonio</p>
            <p className="text-sm font-bold text-gray-900 mt-1 uppercase">Barangay Santiago Saz</p>
            <div className="border-b-2 border-gray-800 mt-3 mb-3" />
            <p className="text-lg font-bold text-gray-900 uppercase tracking-widest">Official Receipt</p>
            <p className="text-xs font-mono text-gray-500 mt-1">{receiptNo}</p>
          </div>
          {/* Details */}
          <div className="space-y-3 mb-5">
            {[
              { label: "Received from", value: doc.residentName },
              { label: "Document Type", value: doc.documentType },
              { label: "Purpose", value: doc.purpose },
              { label: "Payment Date", value: payDate },
              { label: "Payment Method", value: methodLabel[doc.paymentMethod ?? "cash"] ?? "Cash" },
              ...(doc.paymentRef ? [{ label: "Reference No.", value: doc.paymentRef }] : []),
            ].map((item, i) => (
              <div key={i} className="flex justify-between gap-4 text-sm border-b border-dashed border-gray-200 pb-2">
                <span className="text-gray-500 text-xs">{item.label}</span>
                <span className="font-medium text-gray-800 text-right text-xs">{item.value}</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-2">
              <span className="text-base font-bold text-gray-900">Total Amount Paid</span>
              <span className="text-xl font-bold text-emerald-700">₱{(doc.paymentAmount ?? 0).toFixed(2)}</span>
            </div>
          </div>
          {/* Signature */}
          <div className="mt-8 text-center border-t border-gray-300 pt-4">
            <p className="font-bold text-sm">HON. ROLANDO C. BORJA</p>
            <p className="text-xs text-gray-500">Punong Barangay / Authorized Collecting Officer</p>
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">This is an official receipt of Barangay Santiago Saz.</p>
        </div>
      </Card>
    </div>
  );
}

export default function OfficialDocumentsPage() {
  const { toggle } = useSidebarToggle();
  const { toast } = useToast();
  const [docs, setDocs] = useState<DocRequest[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | DocStatus>("all");
  const [selected, setSelected] = useState<DocRequest | null>(null);
  const [printDoc, setPrintDoc] = useState<DocRequest | null>(null);
  const [receiptDoc, setReceiptDoc] = useState<DocRequest | null>(null);
  const [view, setView] = useState<"list" | "calendar" | "settings">("list");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [needsDocsNote, setNeedsDocsNote] = useState("");
  const [showNeedsDocsForm, setShowNeedsDocsForm] = useState(false);
  const [showPayNotifyForm, setShowPayNotifyForm] = useState(false);
  const [payNotifyAmount, setPayNotifyAmount] = useState("");
  const [docTypes, setDocTypes] = useState<DocType[]>(defaultDocTypes);
  const [editingDocType, setEditingDocType] = useState<DocType | null>(null);
  const [newDocTypeName, setNewDocTypeName] = useState("");
  const [newReq, setNewReq] = useState("");

  useEffect(() => {
    api.documents.list().then(data => setDocs(data as DocRequest[])).catch(console.error);
  }, []);

  const markedDates = docs.map(d => d.date);
  const getDateCount = (date: string) => docs.filter(d => d.date === date).length;

  const filtered = docs.filter(d => {
    const matchSearch = d.residentName.toLowerCase().includes(search.toLowerCase())
      || d.documentType.toLowerCase().includes(search.toLowerCase())
      || d.id.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || d.status === filter;
    const matchDate = !selectedDate || d.date === selectedDate;
    return matchSearch && matchFilter && matchDate;
  });

  const updateDoc = async (id: string, patch: Partial<DocRequest>) => {
    await api.documents.update(id, patch);
    setDocs(prev => prev.map(d => d.id === id ? { ...d, ...patch } : d));
    setSelected(prev => prev?.id === id ? { ...prev, ...patch } as DocRequest : prev);
  };

  const updateStatus = (id: string, status: DocStatus, notes = "") => {
    updateDoc(id, { status, notes });
    toast({ title: `Status updated to: ${statusLabel[status]}`, description: "Resident has been notified via system." });
  };

  const handleNeedsMoreDocs = () => {
    if (!selected) return;
    updateStatus(selected.id, "needs-docs", needsDocsNote || "Please submit additional documents.");
    setShowNeedsDocsForm(false);
    setNeedsDocsNote("");
    setSelected(null);
  };

  const handleNotifyPayment = () => {
    if (!selected || !payNotifyAmount) return;
    const amount = parseFloat(payNotifyAmount);
    if (isNaN(amount) || amount <= 0) return;
    updateDoc(selected.id, { status: "awaiting-payment", paymentAmount: amount });
    toast({ title: "Payment Notification Sent", description: `Resident notified to pay ₱${amount.toFixed(2)}.` });
    setShowPayNotifyForm(false);
    setPayNotifyAmount("");
    setSelected(null);
  };

  const addRequirement = (dtName: string) => {
    if (!newReq.trim()) return;
    setDocTypes(prev => prev.map(dt => dt.name === dtName ? { ...dt, requirements: [...dt.requirements, newReq.trim()] } : dt));
    setNewReq("");
  };

  const removeRequirement = (dtName: string, req: string) => {
    setDocTypes(prev => prev.map(dt => dt.name === dtName ? { ...dt, requirements: dt.requirements.filter(r => r !== req) } : dt));
  };

  const addDocType = () => {
    if (!newDocTypeName.trim()) return;
    setDocTypes(prev => [...prev, { name: newDocTypeName.trim(), requirements: [] }]);
    setNewDocTypeName("");
  };

  const removeDocType = (name: string) => {
    setDocTypes(prev => prev.filter(dt => dt.name !== name));
  };

  const handleFileUpload = (docId: string, files: FileList | null) => {
    if (!files) return;
    const uploaded: UploadedFile[] = Array.from(files).map(f => ({ name: f.name, size: f.size, type: f.type, url: URL.createObjectURL(f) }));
    const patch = (d: DocRequest) => d.id === docId ? { ...d, uploadedFiles: [...(d.uploadedFiles ?? []), ...uploaded] } : d;
    setDocs(prev => prev.map(patch));
    setSelected(prev => prev ? patch(prev) as DocRequest : prev);
    toast({ title: "Files Uploaded", description: `${uploaded.length} file(s) attached.` });
  };

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Document Requests"
        description={`${docs.filter(d => d.status === "pending").length} pending review`}
        onMenuClick={toggle}
        actions={
          <div className="flex gap-2">
            {(["list", "calendar", "settings"] as const).map(v => (
              <Button key={v} size="sm" variant={view === v ? "default" : "outline"} onClick={() => setView(v)} className="gap-1.5">
                {v === "list" && <List className="w-4 h-4" />}
                {v === "calendar" && <CalendarDays className="w-4 h-4" />}
                {v === "settings" && <Settings className="w-4 h-4" />}
                <span className="hidden sm:inline capitalize">{v === "settings" ? "Doc Types" : v}</span>
              </Button>
            ))}
          </div>
        }
      />

      {printDoc && <PrintDocument doc={printDoc} onClose={() => setPrintDoc(null)} />}
      {receiptDoc && <ReceiptDocument doc={receiptDoc} onClose={() => setReceiptDoc(null)} />}

      <div className="p-4 sm:p-6 space-y-4">
        {/* Settings */}
        {view === "settings" && (
          <div className="space-y-4">
            <Card className="p-5">
              <h3 className="font-semibold text-foreground mb-4">Available Document Types & Requirements</h3>
              <div className="flex gap-2 mb-4">
                <Input placeholder="New document type name..." value={newDocTypeName} onChange={e => setNewDocTypeName(e.target.value)} onKeyDown={e => e.key === "Enter" && addDocType()} />
                <Button onClick={addDocType} size="sm" className="gap-1 shrink-0"><Plus className="w-4 h-4" /> Add</Button>
              </div>
              <div className="space-y-4">
                {docTypes.map(dt => (
                  <div key={dt.name} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-foreground">{dt.name}</h4>
                      <button onClick={() => removeDocType(dt.name)} className="text-muted-foreground hover:text-destructive p-1 rounded hover:bg-destructive/10 transition"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <div className="space-y-1.5 mb-3">
                      {dt.requirements.map(req => (
                        <div key={req} className="flex items-center justify-between bg-muted/50 px-3 py-1.5 rounded-md">
                          <span className="text-sm text-foreground">{req}</span>
                          <button onClick={() => removeRequirement(dt.name, req)} className="text-muted-foreground hover:text-destructive ml-2"><XCircle className="w-3.5 h-3.5" /></button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input placeholder="Add requirement..." className="text-sm h-8"
                        onKeyDown={e => { if (e.key === "Enter") { addRequirement(dt.name); } }}
                        onChange={e => { if (editingDocType?.name === dt.name) setNewReq(e.target.value); else { setEditingDocType(dt); setNewReq(e.target.value); } }}
                        value={editingDocType?.name === dt.name ? newReq : ""}
                        onFocus={() => setEditingDocType(dt)} />
                      <Button size="sm" variant="outline" className="h-8 shrink-0" onClick={() => { if (editingDocType?.name === dt.name) addRequirement(dt.name); }}><Plus className="w-3.5 h-3.5" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Calendar View */}
        {view === "calendar" && (
          <div className="grid lg:grid-cols-[300px_1fr] gap-4">
            <MiniCalendar markedDates={markedDates} selectedDate={selectedDate} onSelectDate={setSelectedDate} getDateCount={getDateCount} />
            <div className="space-y-3">
              {selectedDate ? (
                <>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(selectedDate).toLocaleDateString("en-PH", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                    {" — "}<span className="text-muted-foreground">{docs.filter(d => d.date === selectedDate).length} request(s)</span>
                  </p>
                  {docs.filter(d => d.date === selectedDate).length === 0 ? (
                    <Card className="p-8 text-center"><FileText className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" /><p className="text-muted-foreground text-sm">No document requests on this date</p></Card>
                  ) : (
                    docs.filter(d => d.date === selectedDate).map(doc => (
                      <Card key={doc.id} className="p-4 border-border/50 hover:border-primary/30 cursor-pointer transition-all" onClick={() => setSelected(doc)}>
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-foreground">{doc.documentType}</p>
                            <p className="text-xs text-muted-foreground">{doc.residentName} · {doc.purpose}</p>
                          </div>
                          <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${statusStyles[doc.status]}`}>{statusIcons[doc.status]} {statusLabel[doc.status]}</span>
                        </div>
                      </Card>
                    ))
                  )}
                </>
              ) : (
                <Card className="p-8 text-center border-dashed">
                  <CalendarDays className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">Click a highlighted date on the calendar to view requests</p>
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
                <Input placeholder="Search by name, type, ID..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="flex gap-2 flex-wrap">
                {(["all", "pending", "processing", "approved", "rejected", "needs-docs", "awaiting-payment", "paid"] as const).map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${filter === f ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
                    {f === "all" ? "All" : statusLabel[f as DocStatus]}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {filtered.length === 0 ? (
                <div className="text-center py-12"><FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" /><p className="text-muted-foreground">No document requests found</p></div>
              ) : (
                filtered.map(doc => (
                  <Card key={doc.id} className="p-4 border-border/50 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer" onClick={() => setSelected(doc)}>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0"><FileText className="w-5 h-5 text-muted-foreground" /></div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-muted-foreground">{doc.id}</span>
                            <span className="text-xs text-muted-foreground">{new Date(doc.date).toLocaleDateString("en-PH", { month: "short", day: "numeric" })}</span>
                          </div>
                          <p className="text-sm font-semibold text-foreground truncate">{doc.documentType}</p>
                          <p className="text-xs text-muted-foreground">{doc.residentName} · {doc.purpose}</p>
                          {doc.status === "awaiting-payment" && doc.paymentAmount && (
                            <p className="text-xs text-orange-600 font-medium mt-0.5">Fee: ₱{doc.paymentAmount.toFixed(2)}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${statusStyles[doc.status]}`}>
                          {statusIcons[doc.status]} {statusLabel[doc.status]}
                        </span>
                        {doc.status === "approved" && (
                          <button onClick={e => { e.stopPropagation(); setPrintDoc(doc); }} className="p-1.5 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition" title="Print Document">
                            <Printer className="w-4 h-4" />
                          </button>
                        )}
                        {doc.status === "paid" && (
                          <button onClick={e => { e.stopPropagation(); setReceiptDoc(doc); }} className="p-1.5 rounded-md bg-teal-50 text-teal-600 hover:bg-teal-100 transition" title="View Receipt">
                            <Banknote className="w-4 h-4" />
                          </button>
                        )}
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg p-6 shadow-2xl animate-fadeUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-foreground">{selected.documentType}</h2>
              <button onClick={() => { setSelected(null); setShowNeedsDocsForm(false); setShowPayNotifyForm(false); }} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-5">
              {[
                { label: "Request ID", value: selected.id },
                { label: "Resident", value: selected.residentName },
                { label: "Address", value: selected.address || "Not provided" },
                { label: "Purpose", value: selected.purpose },
                { label: "Date Filed", value: new Date(selected.date).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" }) },
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-xs text-muted-foreground w-24 shrink-0 mt-0.5">{item.label}</span>
                  <span className="text-sm font-medium text-foreground">{item.value}</span>
                </div>
              ))}
              {selected.paymentAmount && (
                <div className="flex gap-3">
                  <span className="text-xs text-muted-foreground w-24 shrink-0 mt-0.5">Fee</span>
                  <span className="text-sm font-bold text-orange-700">₱{selected.paymentAmount.toFixed(2)}</span>
                </div>
              )}
              {selected.paymentMethod && (
                <div className="flex gap-3">
                  <span className="text-xs text-muted-foreground w-24 shrink-0 mt-0.5">Payment</span>
                  <span className="text-sm font-medium text-teal-700 capitalize">{selected.paymentMethod === "gcash" ? "GCash" : selected.paymentMethod === "bank" ? "Bank Transfer" : "Cash"}{selected.paymentRef ? ` · Ref: ${selected.paymentRef}` : ""}</span>
                </div>
              )}
              <div className="flex items-center gap-2 pt-1">
                <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${statusStyles[selected.status]}`}>
                  {statusIcons[selected.status]} {statusLabel[selected.status]}
                </span>
              </div>
              {selected.notes && (
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-sm text-amber-800">
                  <p className="font-medium text-xs mb-0.5">Notes</p>
                  {selected.notes}
                </div>
              )}
            </div>

            {/* Required Documents */}
            {(() => {
              const dt = docTypes.find(d => d.name === selected.documentType);
              return dt ? (
                <div className="mb-5 p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Required Documents</p>
                  <ul className="space-y-1 mb-3">
                    {dt.requirements.map(r => (
                      <li key={r} className="flex items-center gap-2 text-sm text-foreground"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> {r}</li>
                    ))}
                  </ul>
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium text-muted-foreground">Uploaded by Resident</p>
                      <label className="flex items-center gap-1 text-xs text-primary cursor-pointer hover:text-primary/80 transition">
                        <Upload className="w-3.5 h-3.5" /> Upload File
                        <input type="file" className="hidden" multiple accept="image/*,.pdf,.doc,.docx" onChange={e => handleFileUpload(selected.id, e.target.files)} />
                      </label>
                    </div>
                    {(selected.uploadedFiles?.length ?? 0) === 0 ? (
                      <p className="text-xs text-muted-foreground italic">No files uploaded yet</p>
                    ) : (
                      <div className="space-y-1.5">
                        {selected.uploadedFiles!.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-100 rounded-md">
                            <File className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <a href={f.url} target="_blank" rel="noreferrer" className="text-xs text-blue-700 truncate flex-1 hover:underline">{f.name}</a>
                            <span className="text-xs text-muted-foreground shrink-0">{(f.size / 1024).toFixed(0)} KB</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : null;
            })()}

            {/* Needs Docs Form */}
            {showNeedsDocsForm && (
              <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <Label className="text-xs font-medium text-purple-800 mb-1 block">Message to Resident</Label>
                <Textarea value={needsDocsNote} onChange={e => setNeedsDocsNote(e.target.value)} placeholder="Please submit: valid ID, recent utility bill..." className="min-h-[80px] text-sm mb-2 border-purple-300" />
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setShowNeedsDocsForm(false)} className="flex-1">Cancel</Button>
                  <Button size="sm" onClick={handleNeedsMoreDocs} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"><Bell className="w-3.5 h-3.5 mr-1" /> Send & Mark</Button>
                </div>
              </div>
            )}

            {/* Pay Notify Form */}
            {showPayNotifyForm && (
              <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <Label className="text-xs font-medium text-orange-800 mb-1 block">Fee Amount (₱)</Label>
                <Input
                  type="number"
                  min="1"
                  step="0.01"
                  value={payNotifyAmount}
                  onChange={e => setPayNotifyAmount(e.target.value)}
                  placeholder="e.g. 50.00"
                  className="mb-2 border-orange-300"
                />
                <p className="text-xs text-orange-700 mb-2">Resident will be notified to pay this amount via GCash, bank transfer, or cash.</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setShowPayNotifyForm(false)} className="flex-1">Cancel</Button>
                  <Button size="sm" onClick={handleNotifyPayment} className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"><CreditCard className="w-3.5 h-3.5 mr-1" /> Notify to Pay</Button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
              {selected.status !== "awaiting-payment" && selected.status !== "paid" && (
                <Button size="sm" variant="outline" onClick={() => { setShowPayNotifyForm(true); setShowNeedsDocsForm(false); }} className="gap-1.5 border-orange-300 text-orange-700 hover:bg-orange-50">
                  <CreditCard className="w-3.5 h-3.5" /> Notify to Pay
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={() => { setShowNeedsDocsForm(true); setShowPayNotifyForm(false); }} className="gap-1.5 border-purple-300 text-purple-700 hover:bg-purple-50">
                <FileQuestion className="w-3.5 h-3.5" /> Needs Docs
              </Button>
              <Button size="sm" variant="outline" onClick={() => updateStatus(selected.id, "processing")} className="gap-1 border-blue-300 text-blue-700">
                <AlertCircle className="w-3.5 h-3.5" /> Processing
              </Button>
              <Button size="sm" onClick={() => { updateStatus(selected.id, "approved"); setPrintDoc(selected); setSelected(null); }} className="gap-1 bg-emerald-600 hover:bg-emerald-700 text-white">
                <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Print
              </Button>
              <Button size="sm" variant="outline" onClick={() => updateStatus(selected.id, "rejected")} className="gap-1 border-red-300 text-red-700 hover:bg-red-50">
                <XCircle className="w-3.5 h-3.5" /> Reject
              </Button>
              {selected.status === "paid" && (
                <Button size="sm" variant="outline" onClick={() => { setReceiptDoc(selected); setSelected(null); }} className="gap-1 border-teal-300 text-teal-700 hover:bg-teal-50">
                  <Banknote className="w-3.5 h-3.5" /> View Receipt
                </Button>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
