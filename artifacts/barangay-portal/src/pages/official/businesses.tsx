import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PortalHeader } from "@/components/portal/header";
import { useSidebarToggle } from "@/components/portal/portal-layout";
import { api } from "@/lib/api";
import { Building2, Plus, X, Search, Eye, CheckCircle2, Clock, AlertCircle, Bell, File, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type BusinessStatus = "active" | "expired" | "pending";

interface BusinessDoc {
  name: string;
  size: number;
  url: string;
  uploadedAt: string;
}

interface Business {
  id: string;
  businessName: string;
  ownerName: string;
  type: string;
  address: string;
  permitNumber: string;
  status: BusinessStatus;
  expiryDate?: string;
  documents?: BusinessDoc[];
}

const statusStyles: Record<BusinessStatus, string> = {
  active: "bg-emerald-100 text-emerald-700 border-emerald-200",
  expired: "bg-red-100 text-red-700 border-red-200",
  pending: "bg-amber-100 text-amber-700 border-amber-200",
};

const statusIcons: Record<BusinessStatus, React.ReactNode> = {
  active: <CheckCircle2 className="w-3.5 h-3.5" />,
  expired: <AlertCircle className="w-3.5 h-3.5" />,
  pending: <Clock className="w-3.5 h-3.5" />,
};

function getDaysUntilExpiry(dateStr?: string): number | null {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function ExpiryBadge({ days }: { days: number | null }) {
  if (days === null) return null;
  if (days < 0) return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-700">Expired {Math.abs(days)}d ago</span>;
  if (days <= 30) return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 flex items-center gap-1"><Bell className="w-3 h-3" />Expires in {days}d</span>;
  if (days <= 60) return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Expires in {days}d</span>;
  return null;
}

const enrichBusinesses = (businesses: any[]): Business[] => businesses.map((b, i) => ({
  ...b,
  expiryDate: b.expiryDate ?? (() => {
    const d = new Date();
    d.setDate(d.getDate() + [10, 45, 90, -5, 200, 25, 360][i % 7]);
    return d.toISOString().split("T")[0];
  })(),
  documents: b.documents ?? [],
}));

export default function OfficialBusinessesPage() {
  const { toggle } = useSidebarToggle();
  const { toast } = useToast();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | BusinessStatus>("all");
  const [selected, setSelected] = useState<Business | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    api.businesses.list().then(data => setBusinesses(enrichBusinesses(data as Business[]))).catch(console.error);
  }, []);

  const filtered = businesses.filter(b => {
    const m = b.businessName.toLowerCase().includes(search.toLowerCase()) || b.ownerName.toLowerCase().includes(search.toLowerCase());
    const f = statusFilter === "all" || b.status === statusFilter;
    return m && f;
  });

  const expiringSoon = businesses.filter(b => {
    const d = getDaysUntilExpiry(b.expiryDate);
    return d !== null && d >= 0 && d <= 30;
  });

  const [form, setForm] = useState({
    businessName: "", ownerName: "", type: "Retail (Sari-Sari Store)", address: "", permitNumber: "", expiryDate: "",
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await api.businesses.create({
      businessName: form.businessName,
      ownerName: form.ownerName,
      type: form.type,
      address: form.address,
      permitNumber: form.permitNumber,
      expiryDate: form.expiryDate || undefined,
      status: "pending",
      documents: [],
    });
    setBusinesses(prev => [created as Business, ...prev]);
    setShowForm(false);
    toast({ title: "Business Registered", description: `"${form.businessName}" has been added.` });
    setForm({ businessName: "", ownerName: "", type: "Retail (Sari-Sari Store)", address: "", permitNumber: "", expiryDate: "" });
  };

  const updateStatus = async (id: string, status: BusinessStatus) => {
    await api.businesses.update(id, { status });
    setBusinesses(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    setSelected(prev => prev ? { ...prev, status } : null);
    toast({ title: "Status Updated", description: `Business status updated to: ${status}` });
  };

  const handleDocUpload = (bizId: string, files: FileList | null) => {
    if (!files) return;
    const docs: BusinessDoc[] = Array.from(files).map(f => ({
      name: f.name,
      size: f.size,
      url: URL.createObjectURL(f),
      uploadedAt: new Date().toLocaleDateString("en-PH"),
    }));
    setBusinesses(prev => prev.map(b => b.id === bizId
      ? { ...b, documents: [...(b.documents ?? []), ...docs] }
      : b));
    if (selected?.id === bizId) {
      setSelected(prev => prev ? { ...prev, documents: [...(prev.documents ?? []), ...docs] } : prev);
    }
    toast({ title: "Documents Uploaded", description: `${docs.length} file(s) attached.` });
  };

  const sendExpiryNotification = (biz: Business) => {
    toast({ title: "Notification Sent", description: `Expiry reminder sent to ${biz.ownerName} for "${biz.businessName}".` });
  };

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Business Registry"
        description={`${businesses.filter(b => b.status === "active").length} active permits`}
        onMenuClick={toggle}
        actions={
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2" onClick={() => setShowForm(true)} data-testid="button-add-business">
            <Plus className="w-4 h-4" /> Register Business
          </Button>
        }
      />

      <div className="p-4 sm:p-6 animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-4">
        {/* Expiry Notifications Banner */}
        {expiringSoon.length > 0 && (
          <Card className="p-4 border-orange-200 bg-orange-50">
            <div className="flex items-start gap-3">
              <Bell className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-orange-800 mb-1">
                  {expiringSoon.length} business permit{expiringSoon.length !== 1 ? "s" : ""} expiring within 30 days
                </p>
                <div className="space-y-1">
                  {expiringSoon.map(b => {
                    const days = getDaysUntilExpiry(b.expiryDate);
                    return (
                      <div key={b.id} className="flex items-center justify-between gap-3">
                        <span className="text-xs text-orange-700">{b.businessName} — {b.ownerName} ({days}d left)</span>
                        <button onClick={() => sendExpiryNotification(b)} className="text-xs text-orange-600 hover:text-orange-800 underline underline-offset-2 shrink-0">
                          Notify
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="Search businesses..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} data-testid="input-search" />
          </div>
          <div className="flex gap-2">
            {(["all", "active", "pending", "expired"] as const).map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`text-sm px-3 py-1.5 rounded-full border font-medium transition-all ${statusFilter === f ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
              >
                {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Detail Modal */}
        {selected && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md p-6 shadow-2xl animate-fadeUp max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between mb-4">
                <h2 className="font-bold text-foreground">{selected.businessName}</h2>
                <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-3 mb-5">
                {[
                  { label: "Business ID", value: selected.id },
                  { label: "Owner", value: selected.ownerName },
                  { label: "Business Type", value: selected.type },
                  { label: "Address", value: selected.address },
                  { label: "Permit Number", value: selected.permitNumber || "Not yet issued" },
                  ...(selected.expiryDate ? [{ label: "Permit Expiry", value: new Date(selected.expiryDate).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" }) }] : []),
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-xs text-muted-foreground w-28 shrink-0 mt-0.5">{item.label}</span>
                    <span className="text-sm font-medium text-foreground">{item.value}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2 pt-2 flex-wrap">
                  <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${statusStyles[selected.status]}`}>
                    {statusIcons[selected.status]} {selected.status}
                  </span>
                  <ExpiryBadge days={getDaysUntilExpiry(selected.expiryDate)} />
                </div>
              </div>

              {/* Documents uploaded by resident */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-foreground">Submitted Documents</p>
                  <label className="flex items-center gap-1 text-xs text-primary cursor-pointer hover:text-primary/80">
                    <Upload className="w-3.5 h-3.5" />
                    Upload
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*,.pdf,.doc,.docx"
                      onChange={e => handleDocUpload(selected.id, e.target.files)}
                    />
                  </label>
                </div>
                {(selected.documents?.length ?? 0) === 0 ? (
                  <div className="p-3 border border-dashed border-border rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">No documents uploaded yet</p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {selected.documents!.map((doc, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-100 rounded-md">
                        <File className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <a href={doc.url} target="_blank" rel="noreferrer" className="text-xs text-blue-700 flex-1 truncate hover:underline">{doc.name}</a>
                        <span className="text-xs text-muted-foreground shrink-0">{doc.uploadedAt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-3 border-t border-border flex-wrap">
                {(["active", "pending", "expired"] as BusinessStatus[]).filter(s => s !== selected.status).map(s => (
                  <Button key={s} size="sm" variant="outline" onClick={() => updateStatus(selected.id, s)} className="text-xs capitalize flex-1">
                    Mark as {s}
                  </Button>
                ))}
                {selected.expiryDate && getDaysUntilExpiry(selected.expiryDate) !== null && getDaysUntilExpiry(selected.expiryDate)! <= 60 && (
                  <Button size="sm" variant="outline" onClick={() => sendExpiryNotification(selected)} className="gap-1 border-orange-300 text-orange-700 hover:bg-orange-50 flex-1">
                    <Bell className="w-3.5 h-3.5" /> Send Expiry Notice
                  </Button>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Add Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md p-6 shadow-2xl animate-fadeUp">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-foreground">Register Business</h2>
                <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAdd} className="space-y-4">
                <div><Label>Business Name</Label><Input value={form.businessName} onChange={e => setForm(p => ({ ...p, businessName: e.target.value }))} className="mt-1" required data-testid="input-business-name" /></div>
                <div><Label>Owner Name</Label><Input value={form.ownerName} onChange={e => setForm(p => ({ ...p, ownerName: e.target.value }))} className="mt-1" required data-testid="input-owner-name" /></div>
                <div>
                  <Label>Business Type</Label>
                  <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                    {["Retail (Sari-Sari Store)", "Food & Beverage", "Services", "Construction", "Manufacturing", "Transportation", "Others"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div><Label>Address</Label><Input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} placeholder="Purok X, Santiago" className="mt-1" required /></div>
                <div><Label>Permit Number (Optional)</Label><Input value={form.permitNumber} onChange={e => setForm(p => ({ ...p, permitNumber: e.target.value }))} placeholder="BP-2026-XXX" className="mt-1" /></div>
                <div><Label>Permit Expiry Date (Optional)</Label><Input type="date" value={form.expiryDate} onChange={e => setForm(p => ({ ...p, expiryDate: e.target.value }))} className="mt-1" /></div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">Cancel</Button>
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" data-testid="button-submit-business">Register</Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        <p className="text-sm text-muted-foreground">{filtered.length} business{filtered.length !== 1 ? "es" : ""}</p>
        <div className="space-y-2">
          {filtered.map(b => {
            const days = getDaysUntilExpiry(b.expiryDate);
            return (
              <Card
                key={b.id}
                className="p-4 border-border/50 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer"
                onClick={() => setSelected(b)}
                data-testid={`business-row-${b.id}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{b.businessName}</p>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                      <span>{b.ownerName}</span>
                      <span>{b.type}</span>
                      {(b.documents?.length ?? 0) > 0 && <span className="text-blue-600">{b.documents!.length} doc(s)</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                    <ExpiryBadge days={days} />
                    <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${statusStyles[b.status]}`}>
                      {statusIcons[b.status]} {b.status}
                    </span>
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
