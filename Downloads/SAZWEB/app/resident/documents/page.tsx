"use client"

import { useState, useMemo } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { FileText, Plus, Clock, CheckCircle, Loader2, XCircle, Download, Search, Eye, ChevronRight, CreditCard, Wallet, Banknote } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { mockDocumentRequests, mockDocumentTypes } from "@/lib/mock-data"

// Document categories with details
const documentCategories = [
  {
    id: "clearance",
    name: "Barangay Clearance",
    description: "Certification of residency and good standing.",
    fee: 50.00,
    icon: FileText,
    requirements: ["Valid ID (Original and Photocopy)", "Proof of Residency", "Filled-out Request Form"],
    purpose: "For employment, business, and other legal purposes.",
    processingTime: "1-2 Working Days"
  },
  {
    id: "indigency",
    name: "Certificate of Indigency",
    description: "For financial assistance and other purposes.",
    fee: 30.00,
    icon: FileText,
    requirements: ["Valid ID", "Proof of Income/No Income"],
    purpose: "For financial assistance.",
    processingTime: "1 Working Day"
  },
  {
    id: "business",
    name: "Business Permit",
    description: "For business operations in the barangay.",
    fee: 100.00,
    icon: FileText,
    requirements: ["DTI Registration", "Valid ID", "Lease Contract"],
    purpose: "For business operations.",
    processingTime: "3-5 Working Days"
  },
  {
    id: "residency",
    name: "Certificate of Residency",
    description: "Proof of residency in the barangay.",
    fee: 50.00,
    icon: FileText,
    requirements: ["Valid ID", "Utility Bill", "Proof of Address"],
    purpose: "For proof of residency.",
    processingTime: "1-2 Working Days"
  },
  {
    id: "employment",
    name: "Certificate of Employment",
    description: "For employment under barangay transactions.",
    fee: 50.00,
    icon: FileText,
    requirements: ["Valid ID", "Employment Records"],
    purpose: "For employment purposes.",
    processingTime: "1-2 Working Days"
  },
  {
    id: "others",
    name: "Others",
    description: "Other documents not listed.",
    fee: 0,
    icon: FileText,
    requirements: ["Varies"],
    purpose: "Various",
    processingTime: "Varies"
  }
]

type RequestStep = "category" | "form" | "review" | "payment" | "success" | "tracking"

export default function ResidentDocuments() {
  const { user } = useAuth()
  const residentId = user?.residentId || ""
  
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [localRequests, setLocalRequests] = useState(mockDocumentRequests)
  
  // Request flow states
  const [showRequestFlow, setShowRequestFlow] = useState(false)
  const [currentStep, setCurrentStep] = useState<RequestStep>("category")
  const [selectedCategory, setSelectedCategory] = useState<typeof documentCategories[0] | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<typeof mockDocumentRequests[0] | null>(null)
  
  // Form states
  const [purpose, setPurpose] = useState("")
  const [deliveryMethod, setDeliveryMethod] = useState("pickup")
  const [additionalNotes, setAdditionalNotes] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newRequestRef, setNewRequestRef] = useState("")

  // Filter documents for this resident only
  const myDocuments = useMemo(() => 
    localRequests.filter(d => d.residentId === residentId),
    [localRequests, residentId]
  )

  const filteredDocuments = myDocuments.filter(doc => {
    const matchesSearch = doc.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.purpose.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || doc.status === categoryFilter
    return matchesSearch && matchesCategory
  })

  const startRequest = () => {
    setShowRequestFlow(true)
    setCurrentStep("category")
    setSelectedCategory(null)
    setPurpose("")
    setDeliveryMethod("pickup")
    setAdditionalNotes("")
    setPaymentMethod("")
  }

  const selectCategory = (category: typeof documentCategories[0]) => {
    setSelectedCategory(category)
    setCurrentStep("form")
  }

  const goToReview = () => {
    if (purpose && deliveryMethod) {
      setCurrentStep("review")
    }
  }

  const goToPayment = () => {
    setCurrentStep("payment")
  }

  const handlePayment = async () => {
    if (!paymentMethod) return
    setIsSubmitting(true)
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const refNo = `REF-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
    setNewRequestRef(refNo)
    
    const newRequest = {
      id: refNo,
      residentId,
      residentName: user?.fullName || "Resident",
      documentType: selectedCategory?.name || "",
      purpose,
      address: user?.address || "Purok 1, Barangay Santiago",
      notes: additionalNotes,
      status: "processing" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setLocalRequests(prev => [newRequest, ...prev])
    setIsSubmitting(false)
    setCurrentStep("success")
  }

  const viewRequestDetails = (request: typeof mockDocumentRequests[0]) => {
    setSelectedRequest(request)
    setShowDetailsModal(true)
  }

  const closeRequestFlow = () => {
    setShowRequestFlow(false)
    setCurrentStep("category")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
      case "ready":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Ready</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "processing":
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Processing</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      case "claimed":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Claimed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Documents Request</h1>
          <p className="text-muted-foreground">Request barangay documents and certificates.</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search documents..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="approved">Ready</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Document Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Document Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {documentCategories.slice(0, 6).map((category) => (
              <div
                key={category.id}
                className="p-4 rounded-lg border hover:border-primary/50 transition-all cursor-pointer group"
                onClick={() => {
                  setSelectedCategory(category)
                  startRequest()
                  selectCategory(category)
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg border flex items-center justify-center shrink-0">
                    <category.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm">{category.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {category.description}
                    </p>
                    <p className="text-sm font-semibold mt-2">
                      {category.fee > 0 ? `PHP ${category.fee.toFixed(2)}` : 'Free'}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Request Flow Dialog */}
      <Dialog open={showRequestFlow} onOpenChange={setShowRequestFlow}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          {/* Step 1: Document Details */}
          {currentStep === "category" && selectedCategory && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedCategory.name}</DialogTitle>
                <DialogDescription>PHP {selectedCategory.fee.toFixed(2)}</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Requirements</h4>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                    {selectedCategory.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ol>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm mb-1">Purpose</h4>
                  <p className="text-sm text-muted-foreground">{selectedCategory.purpose}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm mb-1">Processing Time</h4>
                  <p className="text-sm text-muted-foreground">{selectedCategory.processingTime}</p>
                </div>
              </div>
              
              <DialogFooter>
                <Button onClick={() => setCurrentStep("form")} className="w-full">
                  Request Now
                </Button>
              </DialogFooter>
            </>
          )}

          {/* Step 2: Request Form */}
          {currentStep === "form" && selectedCategory && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedCategory.name}</DialogTitle>
                <DialogDescription>PHP {selectedCategory.fee.toFixed(2)}</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Purpose</Label>
                  <Select value={purpose} onValueChange={setPurpose}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employment">Employment</SelectItem>
                      <SelectItem value="school">School Requirement</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="legal">Legal Purpose</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Delivery Method</Label>
                  <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup" className="font-normal">Pick-up</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label>Additional Notes (Optional)</Label>
                  <Textarea
                    placeholder="Enter notes..."
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              
              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => setCurrentStep("category")}>
                  Cancel
                </Button>
                <Button onClick={goToReview} disabled={!purpose}>
                  Continue
                </Button>
              </DialogFooter>
            </>
          )}

          {/* Step 3: Review */}
          {currentStep === "review" && selectedCategory && (
            <>
              <DialogHeader>
                <DialogTitle>Review Your Request</DialogTitle>
                <DialogDescription>
                  Please review your request details before proceeding to payment.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Document</p>
                    <p className="font-medium">{selectedCategory.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Purpose</p>
                    <p className="font-medium capitalize">{purpose}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Delivery Method</p>
                    <p className="font-medium">Pick-up</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Amount to Pay</p>
                    <p className="font-medium">PHP {selectedCategory.fee.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => setCurrentStep("form")}>
                  Back
                </Button>
                <Button onClick={goToPayment}>
                  Proceed to Payment
                </Button>
              </DialogFooter>
            </>
          )}

          {/* Step 4: Payment */}
          {currentStep === "payment" && selectedCategory && (
            <>
              <DialogHeader>
                <DialogTitle>Select Payment Method</DialogTitle>
                <DialogDescription>
                  Choose how you&apos;d like to pay
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-3 py-4">
                <button
                  className={`w-full p-4 rounded-lg border text-left flex items-center gap-3 transition-colors ${
                    paymentMethod === "gcash" ? "border-primary bg-primary/5" : "hover:border-muted-foreground/50"
                  }`}
                  onClick={() => setPaymentMethod("gcash")}
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">GCash</p>
                    <p className="text-xs text-muted-foreground">Pay using GCash</p>
                  </div>
                </button>
                
                <button
                  className={`w-full p-4 rounded-lg border text-left flex items-center gap-3 transition-colors ${
                    paymentMethod === "maya" ? "border-primary bg-primary/5" : "hover:border-muted-foreground/50"
                  }`}
                  onClick={() => setPaymentMethod("maya")}
                >
                  <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">Maya</p>
                    <p className="text-xs text-muted-foreground">Pay using Maya</p>
                  </div>
                </button>
                
                <button
                  className={`w-full p-4 rounded-lg border text-left flex items-center gap-3 transition-colors ${
                    paymentMethod === "cash" ? "border-primary bg-primary/5" : "hover:border-muted-foreground/50"
                  }`}
                  onClick={() => setPaymentMethod("cash")}
                >
                  <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
                    <Banknote className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">Cash Payment</p>
                    <p className="text-xs text-muted-foreground">Pay at Barangay Hall</p>
                  </div>
                </button>
              </div>
              
              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => setCurrentStep("review")}>
                  Back
                </Button>
                <Button onClick={handlePayment} disabled={!paymentMethod || isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Complete Payment"
                  )}
                </Button>
              </DialogFooter>
            </>
          )}

          {/* Step 5: Success */}
          {currentStep === "success" && (
            <>
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
                <p className="text-muted-foreground mb-4">
                  Your payment of PHP {selectedCategory?.fee.toFixed(2)} has been received.
                </p>
                <div className="bg-muted rounded-lg p-4 mb-4">
                  <p className="text-sm text-muted-foreground">Reference No.</p>
                  <p className="font-mono font-bold text-lg">{newRequestRef}</p>
                </div>
              </div>
              
              <DialogFooter>
                <Button onClick={() => {
                  closeRequestFlow()
                }} className="w-full">
                  View My Requests
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Request Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>{selectedRequest?.documentType}</DialogTitle>
              {selectedRequest && getStatusBadge(selectedRequest.status)}
            </div>
            <DialogDescription>{selectedRequest?.id}</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Purpose</p>
                <p className="font-medium capitalize">{selectedRequest?.purpose}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Amount Paid</p>
                <p className="font-medium">PHP 50.00</p>
              </div>
              <div>
                <p className="text-muted-foreground">Date Requested</p>
                <p className="font-medium">
                  {selectedRequest && format(new Date(selectedRequest.createdAt), 'MMM d, yyyy')}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                <p className="font-medium capitalize">{selectedRequest?.status}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Processing Time</p>
                <p className="font-medium">1-2 Working Days</p>
              </div>
              <div>
                <p className="text-muted-foreground">Remarks</p>
                <p className="font-medium text-xs">Your request is being processed.</p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsModal(false)} className="w-full">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* My Requests Section */}
      {myDocuments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">My Requests</CardTitle>
            <CardDescription>Track the status of your document requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredDocuments.map((doc) => (
                <div 
                  key={doc.id} 
                  className="p-4 rounded-lg border bg-card hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => viewRequestDetails(doc)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg border flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{doc.documentType}</p>
                        <p className="text-xs text-muted-foreground">{doc.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(doc.status)}
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
