"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  FileText, 
  Plus, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Printer,
  Eye,
  Upload
} from "lucide-react"

// Available document types
const documentTypes = [
  { id: "clearance", name: "Barangay Clearance", fee: "50", requirements: ["Valid ID", "Proof of Residency"] },
  { id: "residency", name: "Certificate of Residency", fee: "30", requirements: ["Valid ID"] },
  { id: "indigency", name: "Certificate of Indigency", fee: "Free", requirements: ["Valid ID", "Barangay Clearance"] },
  { id: "business", name: "Business Clearance", fee: "200", requirements: ["Valid ID", "DTI Registration", "Barangay Clearance"] },
]

// Mock requests data
const mockRequests = [
  {
    id: "REQ-2026-001",
    type: "Barangay Clearance",
    purpose: "Employment",
    status: "approved",
    date: "April 25, 2026",
    fee: "50",
    pickupTime: "April 28, 2026, 2:00 PM",
  },
  {
    id: "REQ-2026-002",
    type: "Certificate of Residency",
    purpose: "School Enrollment",
    status: "pending",
    date: "April 28, 2026",
    fee: "30",
    pickupTime: null,
  },
  {
    id: "REQ-2026-003",
    type: "Business Clearance",
    purpose: "Business Permit Application",
    status: "rejected",
    date: "April 20, 2026",
    fee: "200",
    remarks: "Missing DTI Registration document",
  },
]

function getStatusBadge(status: string) {
  switch (status) {
    case "approved":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Approved
        </Badge>
      )
    case "pending":
      return (
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
          <Clock className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      )
    case "rejected":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
          <XCircle className="mr-1 h-3 w-3" />
          Rejected
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function DocumentsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<string>("")
  const [showPreview, setShowPreview] = useState<string | null>(null)

  const selectedDoc = documentTypes.find(d => d.id === selectedType)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Document Requests</h1>
          <p className="text-muted-foreground">Request and track your document applications</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Request Document</DialogTitle>
              <DialogDescription>
                Select a document type and provide required information
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Document Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map((doc) => (
                      <SelectItem key={doc.id} value={doc.id}>
                        {doc.name} - PHP {doc.fee}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedDoc && (
                <>
                  <div className="rounded-lg border bg-muted/50 p-3">
                    <p className="text-sm font-medium">Requirements:</p>
                    <ul className="mt-1 list-inside list-disc text-sm text-muted-foreground">
                      {selectedDoc.requirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                    <p className="mt-2 text-sm">
                      <span className="font-medium">Fee:</span> PHP {selectedDoc.fee}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Purpose</Label>
                    <Input placeholder="e.g., Employment, School Enrollment" />
                  </div>

                  <div className="space-y-2">
                    <Label>Upload Requirements</Label>
                    <div className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 transition-colors hover:border-primary/50">
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Click to upload documents
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Additional Notes (Optional)</Label>
                    <Textarea placeholder="Any additional information..." />
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsDialogOpen(false)} disabled={!selectedType}>
                Submit Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Available Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Available Documents</CardTitle>
          <CardDescription>Documents you can request from the barangay</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {documentTypes.map((doc) => (
              <div 
                key={doc.id}
                className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium">{doc.name}</h3>
                <p className="text-sm text-muted-foreground">Fee: PHP {doc.fee}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Request History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">My Requests</CardTitle>
          <CardDescription>Track your document request status</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <div className="space-y-4">
                {mockRequests.map((request) => (
                  <div 
                    key={request.id}
                    className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{request.type}</span>
                        {getStatusBadge(request.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {request.id} | {request.date}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Purpose: {request.purpose}
                      </p>
                      {request.status === "approved" && request.pickupTime && (
                        <p className="text-sm text-accent font-medium">
                          Pickup: {request.pickupTime} | Fee: PHP {request.fee}
                        </p>
                      )}
                      {request.status === "rejected" && request.remarks && (
                        <p className="text-sm text-destructive">
                          Reason: {request.remarks}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {request.status === "approved" && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setShowPreview(request.id)}
                          >
                            <Eye className="mr-1 h-4 w-4" />
                            Preview
                          </Button>
                          <Button size="sm">
                            <Printer className="mr-1 h-4 w-4" />
                            Print
                          </Button>
                        </>
                      )}
                      {request.status === "rejected" && (
                        <Button variant="outline" size="sm">
                          Resubmit
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="pending" className="mt-4">
              <div className="space-y-4">
                {mockRequests.filter(r => r.status === "pending").map((request) => (
                  <div 
                    key={request.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{request.type}</span>
                        {getStatusBadge(request.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{request.id} | {request.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="approved" className="mt-4">
              <div className="space-y-4">
                {mockRequests.filter(r => r.status === "approved").map((request) => (
                  <div 
                    key={request.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{request.type}</span>
                        {getStatusBadge(request.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{request.id} | {request.date}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="mr-1 h-4 w-4" />
                        Preview
                      </Button>
                      <Button size="sm">
                        <Printer className="mr-1 h-4 w-4" />
                        Print
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="rejected" className="mt-4">
              <div className="space-y-4">
                {mockRequests.filter(r => r.status === "rejected").map((request) => (
                  <div 
                    key={request.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{request.type}</span>
                        {getStatusBadge(request.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{request.id} | {request.date}</p>
                      <p className="text-sm text-destructive">{request.remarks}</p>
                    </div>
                    <Button variant="outline" size="sm">Resubmit</Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Document Preview Modal */}
      <Dialog open={!!showPreview} onOpenChange={() => setShowPreview(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Document Preview</DialogTitle>
          </DialogHeader>
          <div className="rounded-lg border bg-white p-8 text-black">
            <div className="text-center space-y-1 mb-6">
              <p className="text-sm">Republic of the Philippines</p>
              <p className="text-sm">Province of Zambales</p>
              <p className="text-sm">Municipality of San Antonio</p>
              <p className="text-sm font-semibold">Barangay Santiago</p>
            </div>
            <h2 className="text-center text-lg font-bold mb-6">BARANGAY CLEARANCE</h2>
            <div className="space-y-4 text-sm">
              <p><strong>TO WHOM IT MAY CONCERN:</strong></p>
              <p className="text-justify leading-relaxed">
                This is to certify that <strong>JUAN DELA CRUZ</strong>, of legal age, Filipino, 
                and a resident of <strong>Purok 3, Barangay Santiago, San Antonio, Zambales</strong>, 
                has been known to be a person of good moral character and law-abiding citizen in the community.
              </p>
              <p className="text-justify leading-relaxed">
                This further certifies that as of this date, there are no records filed against him/her in this barangay.
              </p>
              <p className="text-justify leading-relaxed">
                This certification is issued upon the request of the above-named person for <strong>Employment</strong> purposes.
              </p>
              <p className="mt-6">
                Issued this <strong>25th</strong> day of <strong>April, 2026</strong> at Barangay Santiago.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8 text-center text-sm">
              <div>
                <p className="border-t border-black pt-1 font-semibold">APRIL JOY C. CANO</p>
                <p>Barangay Secretary</p>
              </div>
              <div>
                <p className="border-t border-black pt-1 font-semibold">ROLANDO C. BORJA</p>
                <p>Punong Barangay</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(null)}>Close</Button>
            <Button>
              <Printer className="mr-2 h-4 w-4" />
              Print Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
