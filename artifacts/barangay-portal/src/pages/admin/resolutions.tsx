import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Printer, Download, Eye, Scale, FileText, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const resolutionSchema = z.object({
  resolutionNumber: z.string().min(1),
  blotterEntryNo: z.string().optional(),
  resolutionType: z.string().min(1),
  complainerName: z.string(),
  respondentName: z.string(),
  caseDetails: z.string(),
  dateOfIncident: z.string(),
  timeOfIncident: z.string(),
  placeOfIncident: z.string(),
  natureOfCase: z.string(),
  mediationDate: z.string(),
  agreement: z.string(),
  approvedDate: z.string(),
  caseStatus: z.string(),
  preparedBy: z.string(),
  checkedBy: z.string(),
  approvedBy: z.string(),
  notedBy: z.string(),
});

// Mock data for demo
const mockResolutions = [
  {
    id: 1,
    resolutionNumber: "2024-056",
    blotterEntryNo: "2024-05-0156",
    resolutionType: "blotter",
    complainerName: "JUAN DELA CRUZ",
    respondentName: "PEDRO REYES",
    caseDetails: "Noise Disturbance and Verbal Altercation",
    dateOfIncident: "2024-05-04",
    timeOfIncident: "9:00 PM",
    placeOfIncident: "Barangay Santiago",
    natureOfCase: "Noise Disturbance",
    mediationDate: "2024-05-07",
    agreement: "The respondent acknowledged the complaint and apologized to the complainant. The parties agreed to settle the matter amicably. The respondent will not repeat the act and will observe peaceful co-existence and respect within the community.",
    approvedDate: "2024-05-07",
    caseStatus: "RESOLVED",
    preparedBy: "Juan Dela Cruz",
    checkedBy: "Maria Santos",
    approvedBy: "Maria Lourdes P. Reyes",
    notedBy: "Luis D. Mendoza",
  }
];

export default function Resolutions() {
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [selectedResolution, setSelectedResolution] = useState<any>(null);
  const [resolutions, setResolutions] = useState(mockResolutions);

  const form = useForm<z.infer<typeof resolutionSchema>>({
    resolver: zodResolver(resolutionSchema),
    defaultValues: {
      resolutionType: "blotter",
      caseStatus: "pending",
    }
  });

  const handleCreateSubmit = (data: z.infer<typeof resolutionSchema>) => {
    const newResolution = {
      id: resolutions.length + 1,
      ...data,
    };
    setResolutions([newResolution, ...resolutions]);
    toast.success("Resolution created successfully");
    setIsCreateOpen(false);
    form.reset();
  };

  const openDetails = (resolution: any) => {
    setSelectedResolution(resolution);
    setIsDetailsOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'RESOLVED': return <Badge className="bg-emerald-500">Resolved</Badge>;
      case 'PENDING': return <Badge className="bg-amber-500">Pending</Badge>;
      case 'ONGOING': return <Badge className="bg-blue-500">Ongoing</Badge>;
      case 'CLOSED': return <Badge className="bg-slate-500">Closed</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'blotter': return 'Blotter Case';
      case 'resolution': return 'Resolution';
      case 'ordinance': return 'Ordinance';
      case 'clearance': return 'Clearance';
      default: return type;
    }
  };

  const filteredResolutions = resolutions.filter((r) =>
    r.resolutionNumber.toLowerCase().includes(search.toLowerCase()) ||
    r.complainerName.toLowerCase().includes(search.toLowerCase()) ||
    r.respondentName.toLowerCase().includes(search.toLowerCase()) ||
    r.caseDetails.toLowerCase().includes(search.toLowerCase())
  );

  const statCards = [
    { label: "Total Cases", value: resolutions.length, icon: FileText, color: "text-blue-600", bg: "bg-blue-600/10" },
    { label: "Resolved", value: resolutions.filter(r => r.caseStatus === "RESOLVED").length, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-600/10" },
    { label: "Pending", value: resolutions.filter(r => r.caseStatus === "PENDING").length, icon: Scale, color: "text-amber-600", bg: "bg-amber-600/10" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Barangay Resolutions & Blotter Cases</h2>
            <p className="text-muted-foreground">Manage blotter cases, resolutions, and official documents.</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" /> Create Resolution</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Resolution / Blotter Case</DialogTitle>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(handleCreateSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="resolutionType">Document Type *</Label>
                    <Select onValueChange={(val) => form.setValue("resolutionType", val)} defaultValue={form.getValues("resolutionType")}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blotter">Blotter Case</SelectItem>
                        <SelectItem value="resolution">Resolution</SelectItem>
                        <SelectItem value="ordinance">Ordinance</SelectItem>
                        <SelectItem value="clearance">Clearance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="resolutionNumber">Resolution Number *</Label>
                    <Input id="resolutionNumber" {...form.register("resolutionNumber")} placeholder="e.g., 2024-056" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="blotterEntryNo">Blotter Entry No.</Label>
                    <Input id="blotterEntryNo" {...form.register("blotterEntryNo")} placeholder="e.g., 2024-05-0156" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="caseStatus">Case Status</Label>
                    <Select onValueChange={(val) => form.setValue("caseStatus", val)} defaultValue={form.getValues("caseStatus")}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="ONGOING">Ongoing</SelectItem>
                        <SelectItem value="RESOLVED">Resolved</SelectItem>
                        <SelectItem value="CLOSED">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="complainerName">Complainer / Requestor Name *</Label>
                    <Input id="complainerName" {...form.register("complainerName")} required />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="respondentName">Respondent Name *</Label>
                    <Input id="respondentName" {...form.register("respondentName")} />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="caseDetails">Case Details / Nature *</Label>
                    <Textarea id="caseDetails" {...form.register("caseDetails")} rows={2} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfIncident">Date of Incident</Label>
                    <Input id="dateOfIncident" type="date" {...form.register("dateOfIncident")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeOfIncident">Time of Incident</Label>
                    <Input id="timeOfIncident" {...form.register("timeOfIncident")} type="time" />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="placeOfIncident">Place of Incident</Label>
                    <Input id="placeOfIncident" {...form.register("placeOfIncident")} />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="natureOfCase">Nature of Case</Label>
                    <Textarea id="natureOfCase" {...form.register("natureOfCase")} rows={2} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mediationDate">Mediation / Hearing Date</Label>
                    <Input id="mediationDate" type="date" {...form.register("mediationDate")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="approvedDate">Approved Date</Label>
                    <Input id="approvedDate" type="date" {...form.register("approvedDate")} />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="agreement">Settlement / Agreement</Label>
                    <Textarea id="agreement" {...form.register("agreement")} rows={2} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preparedBy">Prepared By</Label>
                    <Input id="preparedBy" {...form.register("preparedBy")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="checkedBy">Checked By</Label>
                    <Input id="checkedBy" {...form.register("checkedBy")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="approvedBy">Approved By</Label>
                    <Input id="approvedBy" {...form.register("approvedBy")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notedBy">Noted By</Label>
                    <Input id="notedBy" {...form.register("notedBy")} />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button type="submit">Create Resolution</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

        <Card>
          <div className="p-4 border-b flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by number, name, or case details..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="divide-y">
            {filteredResolutions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No resolutions found</div>
            ) : (
              filteredResolutions.map((resolution) => (
                <div
                  key={resolution.id}
                  className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => openDetails(resolution)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold">Resolution No. {resolution.resolutionNumber}</h4>
                        {getStatusBadge(resolution.caseStatus)}
                        <Badge variant="outline" className="text-xs">{getTypeLabel(resolution.resolutionType)}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {resolution.complainerName} vs {resolution.respondentName}
                      </p>
                      <p className="text-sm">{resolution.caseDetails}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Case Date: {format(new Date(resolution.dateOfIncident), "MMM d, yyyy")} • Mediation: {format(new Date(resolution.mediationDate), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Barangay Resolution Document</DialogTitle>
          </DialogHeader>
          {selectedResolution && (
            <div className="space-y-6 bg-white p-8 border rounded-lg">
              {/* Header with logos */}
              <div className="text-center border-b pb-4 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                    <img src="/images/santiago.jpg" alt="Santiago" className="h-full w-full object-cover rounded-full" />
                  </div>
                  <div className="text-center flex-1">
                    <h3 className="font-bold text-lg">REPUBLIC OF THE PHILIPPINES</h3>
                    <p className="text-sm">PROVINCE OF ZAMBALES</p>
                    <p className="text-sm">MUNICIPALITY OF SAN ANTONIO</p>
                    <h2 className="font-bold text-xl mt-2">BARANGAY SANTIAGO</h2>
                    <p className="text-xs">SAMA-SAMA, TAO'Y UMASENSE</p>
                  </div>
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                    <img src="/images/saz.jpg" alt="San Antonio Zambales" className="h-full w-full object-cover rounded-full" />
                  </div>
                </div>
              </div>

              {/* Document Title */}
              <div className="text-center border-b pb-4">
                <h1 className="font-bold text-xl">BARANGAY RESOLUTION NO. {selectedResolution.resolutionNumber}</h1>
                <p className="text-sm">Series of 2024</p>
                <p className="text-sm mt-2 font-semibold">A RESOLUTION RESOLVING A BARANGAY BLOTTER CASE</p>
              </div>

              {/* WHEREAS Clauses */}
              <div className="space-y-3 text-sm">
                <p>
                  <strong>WHEREAS,</strong> a complaint was filed by <strong>{selectedResolution.complainerName}</strong>, a resident of Barangay Santiago, against <strong>{selectedResolution.respondentName}</strong>, also a resident of the same barangay, regarding <strong>{selectedResolution.caseDetails}</strong>;
                </p>
                <p>
                  <strong>WHEREAS,</strong> the said complaint was recorded in the Barangay Blotter on <strong>{format(new Date(selectedResolution.dateOfIncident), "MMMM d, yyyy")}</strong>, under Blotter Entry No. {selectedResolution.blotterEntryNo};
                </p>
                <p>
                  <strong>WHEREAS,</strong> both parties were summoned by the Barangay for mediation/conciliation proceedings conducted on <strong>{format(new Date(selectedResolution.mediationDate), "MMMM d, yyyy")}</strong>;
                </p>
                <p>
                  <strong>WHEREAS,</strong> after due proceedings and discussion, the parties have reached the following agreement/resolution:
                </p>
              </div>

              {/* Agreement Box */}
              <div className="border-2 border-gray-300 p-4 bg-gray-50 rounded">
                <p className="text-sm">{selectedResolution.agreement}</p>
              </div>

              {/* Closing Clause */}
              <div className="text-sm space-y-2">
                <p>
                  <strong>WHEREAS,</strong> the Barangay recognizes the importance of resolving disputes amicably in accordance with the Katarungang Pambara​ngay Law;
                </p>
                <p>
                  <strong>NOW, THEREFORE,</strong> upon motion duly seconded,
                </p>
                <p>
                  <strong>BE IT RESOLVED,</strong> as it is hereby RESOLVED, to formally close and resolve the blotter case filed by <strong>{selectedResolution.complainerName}</strong> against <strong>{selectedResolution.respondentName}</strong>, in accordance with the agreement reached by both parties.
                </p>
                <p>
                  <strong>RESOLVED FURTHER,</strong> that a copy of this resolution be furnished to all concerned parties for their reference and compliance.
                </p>
              </div>

              {/* Approval Section */}
              <div className="text-sm pt-4 border-t">
                <p>
                  <strong>APPROVED this {format(new Date(selectedResolution.approvedDate), "do")} day of {format(new Date(selectedResolution.approvedDate), "MMMM")}, 2024,</strong> at Barangay Santiago, San Antonio, Zambales.
                </p>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 pt-8 text-center text-xs">
                <div>
                  <div className="h-16 mb-2"></div>
                  <p className="font-bold">{selectedResolution.preparedBy}</p>
                  <p>Barangay Staff</p>
                </div>
                <div>
                  <div className="h-16 mb-2"></div>
                  <p className="font-bold">{selectedResolution.checkedBy}</p>
                  <p>Barangay Treasurer</p>
                </div>
                <div>
                  <div className="h-16 mb-2"></div>
                  <p className="font-bold">{selectedResolution.approvedBy}</p>
                  <p>Barangay Captain</p>
                </div>
                <div>
                  <div className="h-16 mb-2"></div>
                  <p className="font-bold">{selectedResolution.notedBy}</p>
                  <p>Municipal Engineer's Office</p>
                </div>
              </div>

              {/* Seal */}
              <div className="flex justify-end pt-4">
                <div className="text-center">
                  <div className="h-20 w-20 border-4 border-yellow-600 rounded-full flex items-center justify-center mb-2 mx-auto">
                    <img src="/images/santiago.jpg" alt="Official Seal" className="h-full w-full object-cover rounded-full" />
                  </div>
                  <p className="text-xs font-semibold">Official Barangay Seal</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>Close</Button>
                <Button onClick={() => window.print()}>
                  <Printer className="w-4 h-4 mr-2" /> Print Resolution
                </Button>
                <Button>
                  <Download className="w-4 h-4 mr-2" /> Export PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
