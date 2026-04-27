"use client"

import { useState, useRef } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  FileText, MoreHorizontal, CheckCircle, Clock, Loader2, XCircle, 
  Printer, Download, Eye, Search, Filter, User, MapPin, Calendar,
  Hash, Receipt, FileCheck
} from "lucide-react"
import { 
  mockDocumentRequests, 
  mockResidents, 
  generateControlNumber, 
  generateORNumber,
  getResidentById,
  type DocumentRequest,
  type Resident
} from "@/lib/mock-data"
import { getDocumentTemplate } from "@/components/document-templates"
import { useReactToPrint } from "react-to-print"

export default function AdminDocuments() {
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [localRequests, setLocalRequests] = useState(mockDocumentRequests)
  const [selectedRequest, setSelectedRequest] = useState<DocumentRequest | null>(null)
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null)
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showPrintModal, setShowPrintModal] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const printRef = useRef<HTMLDivElement>(null)

  const filteredRequests = localRequests
    .filter(r => filter === "all" || r.status === filter)
    .filter(r => 
      r.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.residentId.toLowerCase().includes(searchTerm.toLowerCase())
    )

  const handleViewRequest = (request: DocumentRequest) => {
    setSelectedRequest(request)
    const resident = getResidentById(request.residentId)
    setSelectedResident(resident || null)
  }

  const handleOpenApproveModal = (request: DocumentRequest) => {
    handleViewRequest(request)
    setShowApproveModal(true)
  }

  const handleOpenRejectModal = (request: DocumentRequest) => {
    handleViewRequest(request)
    setShowRejectModal(true)
  }

  const handleOpenPrintModal = (request: DocumentRequest) => {
    handleViewRequest(request)
    setShowPrintModal(true)
  }

  const handleApprove = () => {
    if (!selectedRequest) return
    
    const controlNumber = generateControlNumber(selectedRequest.documentType)
    const orNumber = generateORNumber()
    const fee = selectedRequest.documentType === 'Certificate of Indigency' ? 0 : 
                selectedRequest.documentType === 'Business Permit' ? 200 : 50
    
    setLocalRequests(prev => prev.map(r => 
      r.id === selectedRequest.id ? {
        ...r,
        status: 'approved',
        controlNumber,
        orNumber,
        fee,
        approvedBy: 'Hon. Roberto S. Dela Cruz',
        approvedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } : r
    ))
    
    setSelectedRequest(prev => prev ? {
      ...prev,
      status: 'approved',
      controlNumber,
      orNumber,
      fee,
      approvedBy: 'Hon. Roberto S. Dela Cruz',
      approvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } : null)
    
    setShowApproveModal(false)
    setShowPrintModal(true)
  }

  const handleReject = () => {
    if (!selectedRequest) return
    
    setLocalRequests(prev => prev.map(r => 
      r.id === selectedRequest.id ? {
        ...r,
        status: 'rejected',
        notes: rejectReason,
        updatedAt: new Date().toISOString()
      } : r
    ))
    
    setShowRejectModal(false)
    setRejectReason("")
    setSelectedRequest(null)
  }

  const handleStatusChange = (id: string, newStatus: string) => {
    setLocalRequests(prev => prev.map(r => 
      r.id === id ? { ...r, status: newStatus, updatedAt: new Date().toISOString() } : r
    ))
  }

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: selectedRequest ? `${selectedRequest.documentType}-${selectedRequest.controlNumber}` : 'document',
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Approved</Badge>
      case "pending":
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Pending</Badge>
      case "processing":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Processing</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const DocumentTemplate = selectedRequest ? getDocumentTemplate(selectedRequest.documentType) : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Document Requests</h1>
          <p className="text-muted-foreground">Process and manage document requests from residents</p>
        </div>
        
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name, document type, or ID..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Requests</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="animate-fade-in-up">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{localRequests.length}</div>
                <p className="text-xs text-muted-foreground">Total Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600">
                  {localRequests.filter(r => r.status === 'pending').length}
                </div>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Loader2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {localRequests.filter(r => r.status === 'processing').length}
                </div>
                <p className="text-xs text-muted-foreground">Processing</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {localRequests.filter(r => r.status === 'approved').length}
                </div>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Document Requests</CardTitle>
          <CardDescription>Click on a request to view details and process</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredRequests.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Resident</TableHead>
                      <TableHead>Document Type</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((doc) => (
                      <TableRow 
                        key={doc.id} 
                        className="cursor-pointer hover:bg-accent/50 transition-colors"
                        onClick={() => handleViewRequest(doc)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{doc.residentName}</p>
                              <p className="text-xs text-muted-foreground">{doc.residentId}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            {doc.documentType}
                          </div>
                        </TableCell>
                        <TableCell>{doc.purpose}</TableCell>
                        <TableCell>{format(new Date(doc.createdAt), 'MMM d, yyyy')}</TableCell>
                        <TableCell>{getStatusBadge(doc.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleViewRequest(doc); }}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              {doc.status === 'pending' && (
                                <>
                                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleStatusChange(doc.id, 'processing'); }}>
                                    <Loader2 className="w-4 h-4 mr-2" />
                                    Mark Processing
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleOpenApproveModal(doc); }}>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleOpenRejectModal(doc); }}>
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Reject
                                  </DropdownMenuItem>
                                </>
                              )}
                              {doc.status === 'processing' && (
                                <>
                                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleOpenApproveModal(doc); }}>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleOpenRejectModal(doc); }}>
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Reject
                                  </DropdownMenuItem>
                                </>
                              )}
                              {doc.status === 'approved' && (
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleOpenPrintModal(doc); }}>
                                  <Printer className="w-4 h-4 mr-2" />
                                  Print Document
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-3">
                {filteredRequests.map((doc) => (
                  <div 
                    key={doc.id} 
                    className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleViewRequest(doc)}
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{doc.residentName}</p>
                          <p className="text-xs text-muted-foreground">{doc.residentId}</p>
                        </div>
                      </div>
                      {getStatusBadge(doc.status)}
                    </div>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <FileText className="w-4 h-4" />
                        <span>{doc.documentType}</span>
                      </div>
                      <p className="text-xs">Purpose: {doc.purpose}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(doc.createdAt), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {doc.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => { e.stopPropagation(); handleStatusChange(doc.id, 'processing'); }}
                          >
                            <Loader2 className="w-3 h-3 mr-1" />
                            Process
                          </Button>
                          <Button 
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); handleOpenApproveModal(doc); }}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={(e) => { e.stopPropagation(); handleOpenRejectModal(doc); }}
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      {doc.status === 'processing' && (
                        <>
                          <Button 
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); handleOpenApproveModal(doc); }}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={(e) => { e.stopPropagation(); handleOpenRejectModal(doc); }}
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      {doc.status === 'approved' && (
                        <Button 
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); handleOpenPrintModal(doc); }}
                        >
                          <Printer className="w-3 h-3 mr-1" />
                          Print
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold mb-1">No document requests</h3>
              <p className="text-sm text-muted-foreground">
                {filter !== 'all' ? 'No requests match the current filter' : 'No requests have been submitted yet'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Request Details Dialog */}
      <Dialog open={!!selectedRequest && !showApproveModal && !showRejectModal && !showPrintModal} onOpenChange={(open) => !open && setSelectedRequest(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
            <DialogDescription>
              Review the document request and resident information
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <Tabs defaultValue="request" className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="request">Request Info</TabsTrigger>
                <TabsTrigger value="resident">Resident Info</TabsTrigger>
              </TabsList>
              
              <TabsContent value="request" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Document Type</Label>
                    <p className="font-medium">{selectedRequest.documentType}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Status</Label>
                    <div>{getStatusBadge(selectedRequest.status)}</div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Purpose</Label>
                    <p className="font-medium">{selectedRequest.purpose}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Date Requested</Label>
                    <p className="font-medium">{format(new Date(selectedRequest.createdAt), 'MMMM d, yyyy')}</p>
                  </div>
                  {selectedRequest.controlNumber && (
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Control Number</Label>
                      <p className="font-medium font-mono">{selectedRequest.controlNumber}</p>
                    </div>
                  )}
                  {selectedRequest.orNumber && (
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">O.R. Number</Label>
                      <p className="font-medium font-mono">{selectedRequest.orNumber}</p>
                    </div>
                  )}
                  {selectedRequest.fee !== undefined && (
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Fee</Label>
                      <p className="font-medium">PHP {selectedRequest.fee.toFixed(2)}</p>
                    </div>
                  )}
                  {selectedRequest.approvedBy && (
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Approved By</Label>
                      <p className="font-medium">{selectedRequest.approvedBy}</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="resident" className="space-y-4 mt-4">
                {selectedResident ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Full Name</Label>
                      <p className="font-medium">{selectedResident.fullName}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Resident ID</Label>
                      <p className="font-medium font-mono">{selectedResident.residentId}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Age</Label>
                      <p className="font-medium">{selectedResident.age} years old</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Gender</Label>
                      <p className="font-medium">{selectedResident.gender}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Civil Status</Label>
                      <p className="font-medium">{selectedResident.civilStatus}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Contact</Label>
                      <p className="font-medium">{selectedResident.contactNumber}</p>
                    </div>
                    <div className="col-span-2 space-y-1">
                      <Label className="text-xs text-muted-foreground">Address</Label>
                      <p className="font-medium">{selectedResident.address}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Years of Residency</Label>
                      <p className="font-medium">{selectedResident.yearsOfResidency} years</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Occupation</Label>
                      <p className="font-medium">{selectedResident.occupation}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Resident data not found</p>
                    <p className="text-xs">Using request data as fallback</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
          
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            {selectedRequest?.status === 'pending' && (
              <>
                <Button variant="outline" onClick={() => { setSelectedRequest(null); }}>
                  Close
                </Button>
                <Button variant="destructive" onClick={() => setShowRejectModal(true)}>
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button onClick={() => setShowApproveModal(true)}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
              </>
            )}
            {selectedRequest?.status === 'processing' && (
              <>
                <Button variant="outline" onClick={() => { setSelectedRequest(null); }}>
                  Close
                </Button>
                <Button variant="destructive" onClick={() => setShowRejectModal(true)}>
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button onClick={() => setShowApproveModal(true)}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
              </>
            )}
            {selectedRequest?.status === 'approved' && (
              <>
                <Button variant="outline" onClick={() => { setSelectedRequest(null); }}>
                  Close
                </Button>
                <Button onClick={() => setShowPrintModal(true)}>
                  <Printer className="w-4 h-4 mr-2" />
                  Print Document
                </Button>
              </>
            )}
            {(selectedRequest?.status === 'rejected') && (
              <Button variant="outline" onClick={() => { setSelectedRequest(null); }}>
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Modal */}
      <Dialog open={showApproveModal} onOpenChange={setShowApproveModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-100">
                <FileCheck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <DialogTitle>Approve Request</DialogTitle>
                <DialogDescription>
                  Review and confirm the document approval
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4 mt-4">
              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{selectedRequest.residentName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedRequest.documentType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{selectedRequest.address}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    Control Number (Auto-generated)
                  </Label>
                  <p className="font-mono text-sm p-2 bg-muted rounded">
                    {generateControlNumber(selectedRequest.documentType).split('-').slice(0, 2).join('-')}-XXXX
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs flex items-center gap-1">
                    <Receipt className="w-3 h-3" />
                    O.R. Number (Auto-generated)
                  </Label>
                  <p className="font-mono text-sm p-2 bg-muted rounded">
                    OR-{new Date().getFullYear()}-XXXX
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <span className="text-sm font-medium">Processing Fee:</span>
                <span className="font-bold text-green-700">
                  PHP {selectedRequest.documentType === 'Certificate of Indigency' ? '0.00' : 
                       selectedRequest.documentType === 'Business Permit' ? '200.00' : '50.00'}
                </span>
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="outline" onClick={() => setShowApproveModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve & Generate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-red-100">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <DialogTitle>Reject Request</DialogTitle>
                <DialogDescription>
                  Please provide a reason for rejection
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4 mt-4">
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <p className="font-medium">{selectedRequest.residentName}</p>
                <p className="text-sm text-muted-foreground">{selectedRequest.documentType}</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rejectReason">Reason for Rejection</Label>
                <Textarea
                  id="rejectReason"
                  placeholder="Enter the reason why this request is being rejected..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="outline" onClick={() => { setShowRejectModal(false); setRejectReason(""); }}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={!rejectReason.trim()}>
              <XCircle className="w-4 h-4 mr-2" />
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Print Modal */}
      <Dialog open={showPrintModal} onOpenChange={setShowPrintModal}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-100">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <DialogTitle>Request Approved!</DialogTitle>
                  <DialogDescription>
                    You can now generate and print this document.
                  </DialogDescription>
                </div>
              </div>
            </div>
          </DialogHeader>
          
          {selectedRequest && DocumentTemplate && (
            <div className="mt-4">
              <div className="flex gap-3 mb-4 no-print">
                <Button onClick={handlePrint} className="flex-1">
                  <Printer className="w-4 h-4 mr-2" />
                  Print Document
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
              
              <div className="border rounded-lg overflow-hidden shadow-sm">
                <DocumentTemplate
                  ref={printRef}
                  request={selectedRequest}
                  resident={selectedResident || undefined}
                  captain="Hon. Roberto S. Dela Cruz"
                />
              </div>
            </div>
          )}
          
          <DialogFooter className="mt-4 no-print">
            <Button variant="outline" onClick={() => { setShowPrintModal(false); setSelectedRequest(null); }}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
