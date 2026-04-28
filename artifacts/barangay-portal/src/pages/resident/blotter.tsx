import { ResidentLayout } from "@/components/resident-layout";
import { useResident } from "@/lib/use-resident";
import { useListBlotterReports, useCreateBlotterReport, getListBlotterReportsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileWarning, AlertTriangle, Scale, CheckCircle2, History, ChevronRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { formatDateLong } from "@/lib/format";

export default function ResidentBlotter() {
  const queryClient = useQueryClient();
  const { resident } = useResident();
  const [activeTab, setActiveTab] = useState("file");
  const [selectedReport, setSelectedReport] = useState<any>(null);

  const { data: allReports = [], isLoading } = useListBlotterReports();
  
  // Filter client-side
  const myReports = allReports.filter(rep => rep.reporter === resident?.fullName);

  const createReport = useCreateBlotterReport({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListBlotterReportsQueryKey() });
        toast.success("Incident report filed successfully");
        setActiveTab("my-reports");
        const form = document.getElementById("blotterForm") as HTMLFormElement;
        if(form) form.reset();
      }
    }
  });

  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!resident) return;
    
    const formData = new FormData(e.currentTarget);
    
    createReport.mutate({
      data: {
        reporter: resident.fullName,
        category: formData.get("category") as string,
        respondent: formData.get("respondent") as string || undefined,
        location: formData.get("location") as string,
        dateReported: formData.get("dateReported") as string,
        description: formData.get("description") as string,
        status: "pending",
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved': return <Badge className="bg-emerald-500">Resolved</Badge>;
      case 'investigating': return <Badge className="bg-blue-500">Investigating</Badge>;
      case 'for-mediation': return <Badge className="bg-purple-500">For Mediation</Badge>;
      case 'archived': return <Badge variant="secondary">Archived</Badge>;
      default: return <Badge className="bg-amber-500 text-amber-950">Pending Review</Badge>;
    }
  };

  return (
    <ResidentLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Blotter & Incident Reports</h2>
          <p className="text-muted-foreground">File complaints and report incidents to the barangay justice system.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full sm:w-[400px] grid-cols-2 mb-6">
            <TabsTrigger value="file">File a Report</TabsTrigger>
            <TabsTrigger value="my-reports">My Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="file" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="border-border/50 shadow-sm">
                  <CardHeader className="border-b bg-muted/10 pb-4">
                    <CardTitle className="text-lg">Incident Report Form</CardTitle>
                    <CardDescription>All information provided must be truthful and accurate.</CardDescription>
                  </CardHeader>
                  <form id="blotterForm" onSubmit={handleSubmitForm}>
                    <CardContent className="space-y-6 pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="category">Nature of Incident</Label>
                          <Select name="category" required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Noise Complaint">Noise Complaint</SelectItem>
                              <SelectItem value="Theft">Theft/Robbery</SelectItem>
                              <SelectItem value="Property Damage">Property Damage</SelectItem>
                              <SelectItem value="Animal Complaint">Animal Complaint</SelectItem>
                              <SelectItem value="Physical Altercation">Physical Altercation</SelectItem>
                              <SelectItem value="Others">Others</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="dateReported">Date of Incident</Label>
                          <Input 
                            id="dateReported" 
                            name="dateReported" 
                            type="date" 
                            required 
                            defaultValue={new Date().toISOString().split('T')[0]} 
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="location">Exact Location of Incident</Label>
                          <Input id="location" name="location" required placeholder="e.g. Purok 1, near the basketball court" />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="respondent">Name of Respondent / Accused (Optional)</Label>
                          <Input id="respondent" name="respondent" placeholder="Leave blank if unknown" />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="description">Detailed Narrative of the Incident</Label>
                          <Textarea 
                            id="description" 
                            name="description" 
                            required 
                            rows={6}
                            placeholder="Please describe exactly what happened, including time, involved persons, and witnesses..." 
                          />
                        </div>
                      </div>
                    </CardContent>
                    <div className="bg-amber-50/50 p-4 border-t border-amber-100 flex gap-3 text-sm text-amber-800">
                      <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
                      <p>
                        By submitting this report, you attest that all information is true to the best of your knowledge. 
                        False reporting is punishable under the law. You may be summoned to the barangay hall for mediation.
                      </p>
                    </div>
                    <div className="p-6 pt-0 flex justify-end bg-card">
                      <Button type="submit" disabled={createReport.isPending} className="px-8 mt-6">
                        {createReport.isPending ? "Filing Report..." : "Submit Official Report"}
                      </Button>
                    </div>
                  </form>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-primary flex items-center gap-2 text-base">
                      <Scale className="w-5 h-5" />
                      Katarungang Pambarangay
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-4">
                    <p>The barangay justice system aims to resolve disputes amicably before they reach the courts.</p>
                    <ul className="space-y-2 pl-4 list-disc">
                      <li>Reports are first evaluated by the Lupon.</li>
                      <li>Mediation sessions will be scheduled.</li>
                      <li>Both parties must appear in person.</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="my-reports" className="mt-0">
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">Loading your reports...</div>
            ) : myReports.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed rounded-xl bg-muted/20 max-w-3xl mx-auto">
                <FileWarning className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                <h3 className="font-semibold text-lg mb-1">No Active Reports</h3>
                <p className="text-muted-foreground">You haven't filed any blotter or incident reports.</p>
              </div>
            ) : (
              <div className="max-w-4xl space-y-4">
                {myReports.map((report) => (
                  <Card key={report.id} className="hover-elevate cursor-pointer border-border/50" onClick={() => setSelectedReport(report)}>
                    <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-primary px-2 py-1 bg-primary/10 rounded">#{report.referenceNo}</span>
                          {getStatusBadge(report.status)}
                        </div>
                        <h4 className="font-semibold text-lg">{report.category}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <History className="w-4 h-4" />
                          Reported on {formatDateLong(report.dateReported)}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="hidden sm:flex text-muted-foreground">
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Details Modal */}
      <Dialog open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
        {selectedReport && (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <div className="flex justify-between items-center pr-6 mb-2">
                <Badge variant="outline" className="font-mono">Ref: {selectedReport.referenceNo}</Badge>
                {getStatusBadge(selectedReport.status)}
              </div>
              <DialogTitle className="text-xl">{selectedReport.category}</DialogTitle>
            </DialogHeader>
            
            <div className="py-4 space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm bg-muted/20 p-4 rounded-lg border border-border/50">
                <div>
                  <div className="text-muted-foreground text-xs uppercase font-medium tracking-wider mb-1">Date of Incident</div>
                  <div className="font-medium">{formatDateLong(selectedReport.dateReported)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs uppercase font-medium tracking-wider mb-1">Location</div>
                  <div className="font-medium">{selectedReport.location}</div>
                </div>
                <div className="col-span-2 border-t pt-3 mt-1">
                  <div className="text-muted-foreground text-xs uppercase font-medium tracking-wider mb-1">Respondent / Accused</div>
                  <div className="font-medium">{selectedReport.respondent || 'Not specified'}</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold border-b pb-2 mb-3">Incident Narrative</h4>
                <p className="text-sm whitespace-pre-wrap leading-relaxed text-muted-foreground bg-muted/10 p-4 rounded-md">
                  {selectedReport.description}
                </p>
              </div>

              {(selectedReport.actionTaken || selectedReport.resolutionNotes) && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-4">
                  <h4 className="font-semibold text-primary flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> 
                    Barangay Action & Resolution
                  </h4>
                  
                  {selectedReport.actionTaken && (
                    <div>
                      <div className="text-xs font-semibold uppercase text-primary/70 mb-1">Action Taken</div>
                      <p className="text-sm">{selectedReport.actionTaken}</p>
                    </div>
                  )}
                  
                  {selectedReport.resolutionNotes && (
                    <div className="border-t border-primary/10 pt-3">
                      <div className="text-xs font-semibold uppercase text-primary/70 mb-1">Resolution</div>
                      <p className="text-sm">{selectedReport.resolutionNotes}</p>
                    </div>
                  )}
                  
                  {selectedReport.dateResolved && (
                    <div className="text-xs text-primary/60 pt-2 font-medium">
                      Resolved on: {formatDateLong(selectedReport.dateResolved)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>

    </ResidentLayout>
  );
}
