import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PortalHeader } from "@/components/portal/header";
import { useSidebarToggle } from "@/components/portal/portal-layout";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import {
  FileText, CheckCircle2, Clock, AlertCircle, XCircle, X, Upload,
  ChevronRight, FileQuestion, Bell, CreditCard, Banknote, Printer, Smartphone, Building2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type DocStatus = "approved" | "pending" | "processing" | "rejected" | "needs-docs" | "awaiting-payment" | "paid";
type PayMethod = "gcash" | "bank" | "cash";

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
  uploadedFiles?: string[];
  paymentAmount?: number;
  paymentMethod?: PayMethod;
  paymentDate?: string;
  paymentRef?: string;
}

interface DocType {
  name: string;
  description: string;
  requirements: string[];
  fee: string;
  processingTime: string;
}

const AVAILABLE_DOCS: DocType[] = [
  { name: "Barangay Clearance", description: "General-purpose clearance for employment, business, or other transactions.", requirements: ["Valid Government ID (original + photocopy)", "Recent 2x2 ID photo (2 copies)", "Proof of residency"], fee: "₱50.00", processingTime: "1 business day" },
  { name: "Certificate of Indigency", description: "Certifies that the resident belongs to an indigent family. Required for PhilHealth, scholarships, etc.", requirements: ["Valid Government ID", "Recent 2x2 ID photo", "Proof of residency"], fee: "Free", processingTime: "Same day" },
  { name: "Certificate of Residency", description: "Proves that you are a registered resident of Barangay Santiago Saz.", requirements: ["Valid Government ID", "Utility bill or proof of address (within 3 months)"], fee: "₱30.00", processingTime: "Same day" },
  { name: "Business Clearance", description: "Required for business permit renewal at the municipal level.", requirements: ["Valid Government ID", "Business permit application form", "Lease contract or proof of ownership"], fee: "₱100.00", processingTime: "1–2 business days" },
  { name: "Certificate of Good Moral Character", description: "Character certificate required for employment, scholarships, or school enrollment.", requirements: ["Valid Government ID", "Recent 2x2 ID photo", "Letter of request (optional)"], fee: "₱30.00", processingTime: "Same day" },
  { name: "Cedula (Community Tax Certificate)", description: "Community Tax Certificate required for many legal and government transactions.", requirements: ["Valid Government ID", "Previous year's Cedula (if applicable)"], fee: "₱25.00 + tax based on income", processingTime: "Same day" },
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
  "needs-docs": "Needs Documents",
  "awaiting-payment": "Payment Required",
  paid: "Paid",
};

const PAY_METHODS: { id: PayMethod; label: string; icon: React.ReactNode; desc: string; color: string }[] = [
  { id: "gcash", label: "GCash", icon: <Smartphone className="w-5 h-5" />, desc: "Pay via GCash mobile wallet", color: "border-blue-400 text-blue-700 bg-blue-50" },
  { id: "bank", label: "Bank Transfer", icon: <Building2 className="w-5 h-5" />, desc: "Transfer to barangay bank account", color: "border-purple-400 text-purple-700 bg-purple-50" },
  { id: "cash", label: "Cash", icon: <Banknote className="w-5 h-5" />, desc: "Pay in person at barangay hall", color: "border-emerald-400 text-emerald-700 bg-emerald-50" },
];

function SealImage({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-full overflow-hidden border-2 border-gray-300 bg-white flex items-center justify-center ${className}`}>
      <img src="/santiago.jpg" alt="Seal" className="w-full h-full object-cover"
        onError={e => { const t = e.currentTarget as HTMLImageElement; t.style.display = "none"; const p = t.parentElement; if (p) p.innerHTML = `<span style="font-size:8px;font-weight:700;text-align:center;color:#1a6b3c;padding:2px;">BRGY<br/>SGO</span>`; }} />
    </div>
  );
}

function ReceiptModal({ doc, onClose }: { doc: DocRequest; onClose: () => void }) {
  const receiptNo = `OR-${doc.id.replace("doc-", "").toUpperCase()}`;
  const payDate = doc.paymentDate ? new Date(doc.paymentDate).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" }) : new Date().toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" });
  const methodLabel: Record<PayMethod, string> = { gcash: "GCash", bank: "Bank Transfer", cash: "Cash" };
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-sm shadow-2xl my-4 bg-white animate-fadeUp">
        <div className="flex justify-between items-center px-5 py-4 border-b print:hidden">
          <h2 className="font-bold text-foreground">Payment Receipt</h2>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => window.print()} className="gap-1.5 bg-primary"><Printer className="w-4 h-4" /> Print</Button>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted"><X className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="p-6 bg-white" id="receipt-area">
          <div className="text-center mb-5">
            <SealImage className="w-14 h-14 mx-auto mb-3" />
            <p className="text-xs text-gray-600">Republic of the Philippines</p>
            <p className="text-xs text-gray-600">Province of Zambales · Municipality of San Antonio</p>
            <p className="text-sm font-bold text-gray-900 mt-1 uppercase">Barangay Santiago Saz</p>
            <div className="border-b-2 border-gray-800 mt-3 mb-3" />
            <p className="text-base font-bold text-gray-900 uppercase tracking-widest">Official Receipt</p>
            <p className="text-xs font-mono text-gray-500 mt-1">{receiptNo}</p>
          </div>
          <div className="space-y-2.5 mb-5">
            {[
              { label: "Received from", value: doc.residentName },
              { label: "Document", value: doc.documentType },
              { label: "Purpose", value: doc.purpose },
              { label: "Date Paid", value: payDate },
              { label: "Method", value: methodLabel[doc.paymentMethod ?? "cash"] },
              ...(doc.paymentRef ? [{ label: "Reference No.", value: doc.paymentRef }] : []),
            ].map((item, i) => (
              <div key={i} className="flex justify-between gap-4 border-b border-dashed border-gray-200 pb-2">
                <span className="text-xs text-gray-500">{item.label}</span>
                <span className="text-xs font-medium text-gray-800 text-right">{item.value}</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-2">
              <span className="text-sm font-bold text-gray-900">Total Amount Paid</span>
              <span className="text-xl font-bold text-emerald-700">₱{(doc.paymentAmount ?? 0).toFixed(2)}</span>
            </div>
          </div>
          <div className="mt-6 text-center border-t border-gray-300 pt-4">
            <p className="font-bold text-sm">HON. ROLANDO C. BORJA</p>
            <p className="text-xs text-gray-500">Punong Barangay / Authorized Collecting Officer</p>
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">Official receipt of Barangay Santiago Saz</p>
        </div>
      </Card>
    </div>
  );
}

function PaymentModal({ doc, onPay, onClose }: { doc: DocRequest; onPay: (method: PayMethod, ref: string) => void; onClose: () => void }) {
  const [method, setMethod] = useState<PayMethod | null>(null);
  const [ref, setRef] = useState("");
  const [confirming, setConfirming] = useState(false);

  const handlePay = async () => {
    if (!method) return;
    setConfirming(true);
    await new Promise(r => setTimeout(r, 1000));
    onPay(method, ref);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-sm shadow-2xl my-4 bg-white animate-fadeUp">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div>
            <h2 className="font-bold text-foreground">Pay Document Fee</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{doc.documentType}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5">
          {/* Amount */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl px-5 py-4 text-center mb-5">
            <p className="text-xs text-orange-600 font-medium mb-1">Amount Due</p>
            <p className="text-3xl font-bold text-orange-700">₱{(doc.paymentAmount ?? 0).toFixed(2)}</p>
          </div>

          {/* Payment Method */}
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Choose Payment Method</p>
          <div className="space-y-2 mb-4">
            {PAY_METHODS.map(pm => (
              <button
                key={pm.id}
                onClick={() => setMethod(pm.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${method === pm.id ? pm.color + " border-current" : "border-border hover:border-primary/30"}`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${method === pm.id ? "bg-white/70" : "bg-muted"}`}>
                  {pm.icon}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold">{pm.label}</p>
                  <p className="text-xs text-muted-foreground">{pm.desc}</p>
                </div>
                {method === pm.id && <CheckCircle2 className="w-5 h-5 shrink-0" />}
              </button>
            ))}
          </div>

          {/* Reference Number (GCash / Bank) */}
          {(method === "gcash" || method === "bank") && (
            <div className="mb-4">
              <Label className="text-xs">Reference / Transaction Number</Label>
              <Input value={ref} onChange={e => setRef(e.target.value)} placeholder={method === "gcash" ? "e.g., 1234 5678 9012" : "e.g., TXN-20260416-XXXX"} className="mt-1" />
            </div>
          )}

          {method === "cash" && (
            <div className="mb-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-sm text-emerald-700">
              <p className="font-medium">Cash Payment</p>
              <p className="text-xs mt-0.5">Please visit the barangay hall and present this receipt after payment. A collection officer will mark it as paid.</p>
            </div>
          )}

          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2 mt-1"
            disabled={!method || confirming || ((method === "gcash" || method === "bank") && !ref.trim())}
            onClick={handlePay}
          >
            {confirming
              ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />Processing...</span>
              : <><CreditCard className="w-4 h-4" /> Confirm Payment</>
            }
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default function ResidentDocumentsPage() {
  const { userData } = useAuth();
  const { toggle } = useSidebarToggle();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [docs, setDocs] = useState<DocRequest[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocType | null>(null);

  useEffect(() => {
    if (userData?.uid) {
      api.documents.list(userData.uid).then(setDocs).catch(console.error);
    }
  }, [userData?.uid]);
  const [purpose, setPurpose] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"available" | "myrequests">("available");
  const [payingDoc, setPayingDoc] = useState<DocRequest | null>(null);
  const [receiptDoc, setReceiptDoc] = useState<DocRequest | null>(null);

  const handleSelectDoc = (doc: DocType) => { setSelectedDoc(doc); setPurpose(""); setUploadedFiles([]); };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { const files = Array.from(e.target.files ?? []); setUploadedFiles(prev => [...prev, ...files]); };
  const removeFile = (idx: number) => setUploadedFiles(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoc || !purpose.trim()) return;
    setLoading(true);
    try {
      const created = await api.documents.create({
        residentId: userData?.uid ?? "",
        residentName: userData?.fullName ?? "Resident",
        documentType: selectedDoc.name,
        purpose,
        status: "pending",
        date: new Date().toISOString().split("T")[0],
        address: userData?.address ?? "",
        notes: "",
      });
      setDocs(prev => [created, ...prev]);
      setSelectedDoc(null); setPurpose(""); setUploadedFiles([]);
      setActiveTab("myrequests");
      toast({ title: "Request Submitted", description: `Your ${selectedDoc.name} request has been submitted.` });
    } catch (err) {
      toast({ title: "Error", description: "Failed to submit request.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (doc: DocRequest, method: PayMethod, ref: string) => {
    const now = new Date().toISOString().split("T")[0];
    const updated = await api.documents.update(doc.id, { status: "paid", paymentMethod: method, paymentRef: ref || null, paymentDate: now });
    setDocs(prev => prev.map(d => d.id === doc.id ? { ...d, ...updated } : d));
    const paid = { ...doc, status: "paid" as DocStatus, paymentMethod: method, paymentRef: ref || undefined, paymentDate: now };
    setPayingDoc(null);
    setReceiptDoc(paid);
    toast({ title: "Payment Confirmed!", description: "Your receipt is ready to view and print." });
  };

  const pendingPaymentCount = docs.filter(d => d.status === "awaiting-payment").length;

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader title="Document Requests" description="Request and track barangay documents" onMenuClick={toggle} />

      {/* Request Form Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <Card className="w-full max-w-lg p-6 shadow-2xl my-4 animate-fadeUp">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-foreground">{selectedDoc.name}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{selectedDoc.processingTime} · {selectedDoc.fee}</p>
              </div>
              <button onClick={() => setSelectedDoc(null)} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted"><X className="w-5 h-5" /></button>
            </div>
            <div className="mb-5 p-4 bg-muted/50 rounded-xl">
              <p className="text-xs font-semibold text-foreground mb-2">Required Documents</p>
              <ul className="space-y-1.5">
                {selectedDoc.requirements.map(req => (
                  <li key={req} className="flex items-start gap-2 text-sm text-foreground"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />{req}</li>
                ))}
              </ul>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Purpose of Request <span className="text-destructive">*</span></Label>
                <Input value={purpose} onChange={e => setPurpose(e.target.value)} placeholder="e.g., Job application, School enrollment, Loan" className="mt-1" required />
              </div>
              <div>
                <Label>Upload Required Files</Label>
                <div className="mt-1 border-2 border-dashed border-border rounded-xl p-4 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all" onClick={() => fileRef.current?.click()}>
                  <input ref={fileRef} type="file" multiple accept="image/*,.pdf" className="hidden" onChange={handleFileChange} />
                  <Upload className="w-6 h-6 text-muted-foreground/50 mx-auto mb-1.5" />
                  <p className="text-sm text-muted-foreground">Click to upload files (images, PDF)</p>
                </div>
                {uploadedFiles.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {uploadedFiles.map((f, i) => (
                      <div key={i} className="flex items-center justify-between px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-sm">
                        <span className="text-emerald-700 truncate flex-1">{f.name}</span>
                        <button type="button" onClick={() => removeFile(i)} className="text-muted-foreground hover:text-destructive ml-2"><X className="w-3.5 h-3.5" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setSelectedDoc(null)} className="flex-1">Cancel</Button>
                <Button type="submit" disabled={loading} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                  {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />Submitting...</span> : "Submit Request"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Payment Modal */}
      {payingDoc && <PaymentModal doc={payingDoc} onClose={() => setPayingDoc(null)} onPay={(method, ref) => handlePay(payingDoc, method, ref)} />}

      {/* Receipt Modal */}
      {receiptDoc && <ReceiptModal doc={receiptDoc} onClose={() => setReceiptDoc(null)} />}

      <div className="p-4 sm:p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Tabs */}
        <div className="flex gap-2">
          <button onClick={() => setActiveTab("available")} className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${activeTab === "available" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
            Available Documents
          </button>
          <button onClick={() => setActiveTab("myrequests")} className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all border ${activeTab === "myrequests" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
            My Requests {docs.length > 0 && `(${docs.length})`}
            {pendingPaymentCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{pendingPaymentCount}</span>
            )}
          </button>
        </div>

        {/* Available Documents */}
        {activeTab === "available" && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Click a document to see requirements and submit a request.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {AVAILABLE_DOCS.map(doc => (
                <Card key={doc.name} className="p-4 border-border/50 hover:border-primary/40 hover:shadow-md cursor-pointer transition-all group" onClick={() => handleSelectDoc(doc)}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><FileText className="w-5 h-5 text-primary" /></div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">{doc.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{doc.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="text-primary font-medium">{doc.fee}</span>
                        <span>{doc.processingTime}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* My Requests */}
        {activeTab === "myrequests" && (
          <div className="space-y-3">
            {docs.length === 0 ? (
              <Card className="p-12 text-center border-dashed border-border/60">
                <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No document requests yet</p>
                <Button size="sm" className="mt-3 bg-primary hover:bg-primary/90 gap-2" onClick={() => setActiveTab("available")}>Browse Available Documents</Button>
              </Card>
            ) : (
              docs.map(doc => (
                <Card key={doc.id} className={`p-4 border transition ${doc.status === "awaiting-payment" ? "border-orange-300 bg-orange-50/30" : "border-border/50 hover:border-primary/30"}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><FileText className="w-5 h-5 text-primary" /></div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm">{doc.documentType}</h3>
                        <p className="text-xs text-muted-foreground">Purpose: {doc.purpose}</p>
                        <p className="text-xs text-muted-foreground">Submitted: {new Date(doc.date).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" })}</p>

                        {/* Needs Docs note */}
                        {doc.status === "needs-docs" && doc.notes && (
                          <div className="mt-1.5 flex items-start gap-1.5 text-xs text-purple-700 bg-purple-50 px-2 py-1.5 rounded-md border border-purple-200">
                            <Bell className="w-3 h-3 shrink-0 mt-0.5" /><span>Note from official: {doc.notes}</span>
                          </div>
                        )}

                        {/* Payment Required Banner */}
                        {doc.status === "awaiting-payment" && (
                          <div className="mt-2 p-3 bg-orange-100 border border-orange-300 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <CreditCard className="w-4 h-4 text-orange-600 shrink-0" />
                              <p className="text-sm font-semibold text-orange-800">Payment Required</p>
                            </div>
                            <p className="text-xl font-bold text-orange-700 mb-2">₱{(doc.paymentAmount ?? 0).toFixed(2)}</p>
                            <p className="text-xs text-orange-700 mb-3">The barangay office has assessed a fee for your document request. Please complete payment to proceed.</p>
                            <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white gap-1.5 w-full" onClick={() => setPayingDoc(doc)}>
                              <CreditCard className="w-3.5 h-3.5" /> Pay Now via GCash, Bank, or Cash
                            </Button>
                          </div>
                        )}

                        {/* Paid confirmation */}
                        {doc.status === "paid" && (
                          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-teal-700 bg-teal-50 px-2 py-1.5 rounded-md border border-teal-200">
                            <CheckCircle2 className="w-3 h-3 shrink-0" />
                            <span>Payment confirmed via {doc.paymentMethod === "gcash" ? "GCash" : doc.paymentMethod === "bank" ? "Bank Transfer" : "Cash"}</span>
                          </div>
                        )}

                        {doc.uploadedFiles && doc.uploadedFiles.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">Uploaded: {doc.uploadedFiles.join(", ")}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${statusStyles[doc.status]}`}>
                        {statusIcons[doc.status]} {statusLabel[doc.status]}
                      </span>

                      {doc.status === "needs-docs" && (
                        <Button size="sm" variant="outline" className="text-xs h-7 border-purple-300 text-purple-700 gap-1"
                          onClick={() => { const dt = AVAILABLE_DOCS.find(d => d.name === doc.documentType); if (dt) handleSelectDoc(dt); }}>
                          <Upload className="w-3 h-3" /> Submit Docs
                        </Button>
                      )}

                      {doc.status === "paid" && (
                        <Button size="sm" variant="outline" className="text-xs h-7 border-teal-300 text-teal-700 gap-1" onClick={() => setReceiptDoc(doc)}>
                          <Banknote className="w-3 h-3" /> View Receipt
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
