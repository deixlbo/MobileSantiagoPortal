import { ResidentLayout } from "@/components/resident-layout";
import { useListDocumentCategories, useListDocumentRequests, useCreateDocumentRequest, getListDocumentRequestsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useResident } from "@/lib/use-resident";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, FileCheck, CheckCircle2, Clock, FileClock, Search, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { formatPHP, formatDateLong } from "@/lib/format";
import { PrintModal, DocumentTemplate } from "@/components/document-template";
import { Input } from "@/components/ui/input";

export default function ResidentDocuments() {
  const queryClient = useQueryClient();
  const { resident } = useResident();
  const [activeTab, setActiveTab] = useState("catalog");
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [documentToPrint, setDocumentToPrint] = useState<any>(null);

  const { data: categories = [], isLoading: catsLoading } = useListDocumentCategories();
  const { data: allRequests = [], isLoading: reqsLoading } = useListDocumentRequests();
  
  // Filter client-side since API might not support residentId filter yet
  const myRequests = allRequests.filter(req => req.residentName === resident?.fullName || req.residentId === resident?.id);

  const createRequest = useCreateDocumentRequest({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListDocumentRequestsQueryKey() });
        toast.success("Document request submitted successfully");
        setRequestModalOpen(false);
        setActiveTab("requests");
      }
    }
  });

  const handleRequestClick = (category: any) => {
    setSelectedCategory(category);
    setRequestModalOpen(true);
  };

  const handlePrintClick = (request: any) => {
    setDocumentToPrint(request);
    setPrintModalOpen(true);
  };

  const handleSubmitRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!resident) return;
    
    const formData = new FormData(e.currentTarget);
    
    createRequest.mutate({
      data: {
        residentId: resident.id,
        residentName: resident.fullName,
        documentType: selectedCategory.name,
        purpose: formData.get("purpose") as string,
        paymentMethod: formData.get("paymentMethod") as string,
        price: selectedCategory.price,
        status: "pending",
        requestedDate: new Date().toISOString(),
        businessName: formData.get("businessName") as string || undefined,
        businessAddress: formData.get("businessAddress") as string || undefined,
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'claimed': return <Badge className="bg-emerald-500 text-white shadow-sm px-3">Claimed</Badge>;
      case 'ready': return <Badge className="bg-emerald-500 text-white shadow-sm px-3">Ready for Pickup</Badge>;
      case 'processing': return <Badge className="bg-purple-500 text-white shadow-sm px-3">Processing</Badge>;
      case 'rejected': return <Badge variant="destructive" className="shadow-sm px-3">Rejected</Badge>;
      default: return <Badge variant="secondary" className="shadow-sm px-3 border border-border">Pending</Badge>;
    }
  };

  const steps = [
    { id: 'pending', label: 'Requested' },
    { id: 'processing', label: 'Processing' },
    { id: 'ready', label: 'Ready' },
    { id: 'claimed', label: 'Claimed' }
  ];

  return (
    <ResidentLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Document Services</h2>
          <p className="text-muted-foreground">Request barangay clearances, certificates, and permits online.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full sm:w-[400px] grid-cols-2 mb-6">
            <TabsTrigger value="catalog">Request Document</TabsTrigger>
            <TabsTrigger value="requests">My Requests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="catalog" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {catsLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="animate-pulse h-48"></Card>
                ))
              ) : (
                categories.filter(c => c.available).map((cat) => (
                  <Card key={cat.id} className="hover-elevate transition-all border-border/50 bg-card flex flex-col">
                    <CardHeader className="pb-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                        <FileText className="w-6 h-6" />
                      </div>
                      <CardTitle className="text-lg">{cat.name}</CardTitle>
                      <CardDescription className="line-clamp-2 min-h-[40px]">{cat.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto pb-4">
                      <div className="text-xl font-bold text-foreground">
                        {cat.price === 0 ? "FREE" : formatPHP(cat.price)}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 border-t border-border/50 p-4">
                      <Button className="w-full" onClick={() => handleRequestClick(cat)}>
                        <Plus className="w-4 h-4 mr-2" /> Request Document
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="requests" className="mt-0 space-y-6">
            {reqsLoading ? (
              <div className="text-center py-12 text-muted-foreground">Loading your requests...</div>
            ) : myRequests.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed rounded-xl bg-muted/20">
                <FileCheck className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                <h3 className="font-semibold text-lg mb-1">No Document Requests</h3>
                <p className="text-muted-foreground">You haven't requested any documents yet.</p>
                <Button variant="outline" className="mt-4" onClick={() => setActiveTab("catalog")}>
                  Browse Documents
                </Button>
              </div>
            ) : (
              myRequests.map((req) => (
                <Card key={req.id} className="border-border/50 overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-6 md:w-1/3 bg-muted/20 border-b md:border-b-0 md:border-r border-border/50 flex flex-col justify-center">
                      <div className="text-sm font-mono text-muted-foreground mb-1">Ref: {req.referenceNo}</div>
                      <h3 className="font-bold text-lg leading-tight mb-2">{req.documentType}</h3>
                      <div className="text-sm text-muted-foreground mb-4">
                        Requested on {formatDateLong(req.requestedDate)}
                      </div>
                      <div>
                        {getStatusBadge(req.status)}
                      </div>
                    </div>
                    
                    <div className="p-6 md:w-2/3 flex flex-col">
                      {req.status === 'rejected' ? (
                        <div className="bg-destructive/10 text-destructive p-4 rounded-lg flex gap-3">
                          <Clock className="w-5 h-5 shrink-0" />
                          <div>
                            <p className="font-medium">Request Denied</p>
                            <p className="text-sm mt-1">Please visit the barangay hall for clarification regarding your request.</p>
                          </div>
                        </div>
                      ) : (
                        <div className="py-6 px-4">
                          {/* Status Stepper */}
                          <div className="relative flex justify-between max-w-md mx-auto">
                            <div className="absolute left-0 top-1/2 w-full h-0.5 bg-muted -z-10 -translate-y-1/2"></div>
                            {steps.map((step, idx) => {
                              const currentIndex = steps.findIndex(s => s.id === req.status);
                              const isCompleted = currentIndex >= idx || req.status === 'claimed';
                              const isCurrent = req.status === step.id;
                              
                              return (
                                <div key={step.id} className="flex flex-col items-center gap-2">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors ${isCompleted ? 'bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20' : 'bg-background border-muted text-muted-foreground'}`}>
                                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                                  </div>
                                  <span className={`text-xs font-medium ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`}>{step.label}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-auto pt-6 flex justify-between items-center border-t border-border/50">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Amount: </span>
                          <span className="font-semibold">{formatPHP(req.price)}</span>
                        </div>
                        
                        {(req.status === 'ready' || req.status === 'claimed') && (
                          <Button onClick={() => handlePrintClick(req)} variant="default" className="shadow-md">
                            <FileText className="w-4 h-4 mr-2" /> Preview & Print
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Request Modal */}
      <Dialog open={requestModalOpen} onOpenChange={setRequestModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request Document</DialogTitle>
          </DialogHeader>
          {selectedCategory && (
            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 mb-4">
                <div className="font-semibold text-primary">{selectedCategory.name}</div>
                <div className="text-2xl font-bold mt-1">
                  {selectedCategory.price === 0 ? "FREE" : formatPHP(selectedCategory.price)}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose of Request</Label>
                <Textarea 
                  id="purpose" 
                  name="purpose" 
                  required 
                  placeholder="e.g. For employment, school requirement, bank application..."
                  rows={3}
                />
              </div>

              {selectedCategory.name === "Business Permit" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input id="businessName" name="businessName" required placeholder="Enter business name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessAddress">Business Address</Label>
                    <Input id="businessAddress" name="businessAddress" required placeholder="Enter business address in Brgy. Santiago" />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select name="paymentMethod" defaultValue="cash">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Pay at Barangay Hall (Cash)</SelectItem>
                    <SelectItem value="gcash">GCash (On-site)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Note: Digital payments are processed upon claiming the document.
                </p>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button type="submit" disabled={createRequest.isPending} className="w-full">
                  {createRequest.isPending ? "Submitting..." : "Submit Request"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Print Modal */}
      <PrintModal
        title={`Official Document: ${documentToPrint?.documentType}`}
        open={printModalOpen}
        onOpenChange={setPrintModalOpen}
      >
        {documentToPrint && <DocumentTemplate request={documentToPrint} resident={resident} />}
      </PrintModal>

    </ResidentLayout>
  );
}
