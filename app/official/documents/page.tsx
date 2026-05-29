"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { printElementById } from "@/lib/utils"
import { supabase } from "@/lib/supabase"

import { 
  Search, 
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Printer,
  Settings,
  Loader2
} from "lucide-react"

type DocumentRequest = {
  id: string
  request_number: string
  type: string
  purpose: string
  requester_id: string | null
  requester_name: string
  requester_email: string
  purok: string
  status: string
  fee: string
  pickup_time: string | null
  release_date: string | null
  documents_uploaded: boolean
  missing_documents: string[] | null
  created_at: string
}

const defaultDocumentTypes = [
  { id: "1", name: "Barangay Clearance", requirements: "Valid ID, Proof of Residency", fee: "50" },
  { id: "2", name: "Certificate of Residency", requirements: "Proof of Address, Valid ID", fee: "30" },
  { id: "3", name: "Business Clearance", requirements: "Business Registration, Valid ID", fee: "200" },
  { id: "4", name: "Certificate of Indigency", requirements: "Proof of Residency, Income Statement", fee: "Free" },
]

function getStatusBadge(status: string) {
  switch (status) {
    case "approved":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-[10px] md:text-xs">
          <CheckCircle2 className="mr-0.5 md:mr-1 h-2.5 w-2.5 md:h-3 md:w-3" />
          <span className="hidden sm:inline">Approved</span>
          <span className="sm:hidden">OK</span>
        </Badge>
      )
    case "pending":
      return (
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-[10px] md:text-xs">
          <Clock className="mr-0.5 md:mr-1 h-2.5 w-2.5 md:h-3 md:w-3" />
          <span className="hidden sm:inline">Pending</span>
          <span className="sm:hidden">Wait</span>
        </Badge>
      )
    case "declined":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 text-[10px] md:text-xs">
          <XCircle className="mr-0.5 md:mr-1 h-2.5 w-2.5 md:h-3 md:w-3" />
          <span className="hidden sm:inline">Declined</span>
          <span className="sm:hidden">No</span>
        </Badge>
      )
    case "released":
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-[10px] md:text-xs">
          <CheckCircle2 className="mr-0.5 md:mr-1 h-2.5 w-2.5 md:h-3 md:w-3" />
          <span className="hidden sm:inline">Released</span>
          <span className="sm:hidden">Done</span>
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

function OfficialDocumentHeader({ printOnly = false }: { printOnly?: boolean }) {
  return (
    <div className={`flex items-center justify-between mb-4 p-4 border-b ${printOnly ? 'hidden print:flex' : ''}`}>
      <Image src="/images/santiagologo.jpg" alt="Barangay Santiago" width={60} height={60} className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover shrink-0" />
      <div className="text-center flex-1 px-2">
        <p className="text-[10px] md:text-xs text-muted-foreground print:text-black">Republic of the Philippines</p>
        <p className="text-[10px] md:text-xs text-muted-foreground print:text-black">Province of Zambales</p>
        <p className="text-[10px] md:text-xs text-muted-foreground print:text-black">Municipality of San Antonio</p>
        <p className="text-xs md:text-sm font-semibold print:text-black">Barangay Santiago</p>
      </div>
      <Image src="/images/saz.jpg" alt="Office of the Municipal Mayor" width={60} height={60} className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover shrink-0" />
    </div>
  )
}

export default function OfficialDocumentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [requests, setRequests] = useState<DocumentRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<DocumentRequest | null>(null)
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showManageTypes, setShowManageTypes] = useState(false)
  const [documentTypes] = useState(defaultDocumentTypes)
  const [loading, setLoading] = useState(true)
  const [selectedPrintRequest, setSelectedPrintRequest] = useState<DocumentRequest | null>(null)

  useEffect(() => {
    fetchRequests()
  }, [])

  async function fetchRequests() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('document_requests')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setRequests(data || [])
    } catch (error) {
      console.error('Error fetching document requests:', error)
      toast.error('Failed to load document requests')
    } finally {
      setLoading(false)
    }
  }

  const handlePrintRequest = (request: DocumentRequest) => {
    setSelectedPrintRequest(request)
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        printElementById("print-request-content")
        setSelectedPrintRequest(null)
      })
    })
  }

  const handleApproveRequest = async (requestId: string) => {
    try {
      const pickupDate = new Date()
      pickupDate.setDate(pickupDate.getDate() + 2)
      
      const { error } = await supabase
        .from('document_requests')
        .update({ 
          status: 'approved',
          pickup_time: pickupDate.toISOString()
        })
        .eq('id', requestId)

      if (error) throw error

      setRequests(prev => prev.map(r => 
        r.id === requestId ? { ...r, status: 'approved', pickup_time: pickupDate.toISOString() } : r
      ))
      setShowApproveDialog(false)
      toast.success('Request approved successfully')
    } catch (error) {
      console.error('Error approving request:', error)
      toast.error('Failed to approve request')
    }
  }

  const handleReleaseDocument = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('document_requests')
        .update({ 
          status: 'released',
          release_date: new Date().toISOString()
        })
        .eq('id', requestId)

      if (error) throw error

      setRequests(prev => prev.map(r => 
        r.id === requestId ? { ...r, status: 'released', release_date: new Date().toISOString() } : r
      ))
      toast.success('Document marked as released')
    } catch (error) {
      console.error('Error releasing document:', error)
      toast.error('Failed to release document')
    }
  }

  const filteredRequests = requests.filter(r =>
    r.request_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.requester_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.type?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const pendingCount = requests.filter(r => r.status === "pending").length
  const approvedCount = requests.filter(r => r.status === "approved").length
  const releasedCount = requests.filter(r => r.status === "released").length

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 md:space-y-6"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Document Requests</h1>
          <p className="text-xs md:text-sm text-muted-foreground">Process and manage document requests</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setShowManageTypes(true)}>
            <Settings className="h-3 w-3 md:mr-2" />
            <span className="hidden md:inline">Manage Types</span>
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-4 gap-2 md:gap-4">
        <Card>
          <CardContent className="p-2 md:p-4">
            <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4">
              <div className="rounded-lg bg-amber-100 p-1.5 md:p-2">
                <Clock className="h-4 w-4 md:h-5 md:w-5 text-amber-700" />
              </div>
              <div className="text-center md:text-left">
                <p className="text-lg md:text-2xl font-bold">{pendingCount}</p>
                <p className="text-[10px] md:text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2 md:p-4">
            <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4">
              <div className="rounded-lg bg-emerald-100 p-1.5 md:p-2">
                <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-emerald-700" />
              </div>
              <div className="text-center md:text-left">
                <p className="text-lg md:text-2xl font-bold">{approvedCount}</p>
                <p className="text-[10px] md:text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2 md:p-4">
            <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4">
              <div className="rounded-lg bg-blue-100 p-1.5 md:p-2">
                <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-blue-700" />
              </div>
              <div className="text-center md:text-left">
                <p className="text-lg md:text-2xl font-bold">{releasedCount}</p>
                <p className="text-[10px] md:text-sm text-muted-foreground">Released</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2 md:p-4">
            <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4">
              <div className="rounded-lg bg-primary/10 p-1.5 md:p-2">
                <FileText className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              </div>
              <div className="text-center md:text-left">
                <p className="text-lg md:text-2xl font-bold">{requests.length}</p>
                <p className="text-[10px] md:text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search */}
      <motion.div variants={itemVariants} className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Search requests..." 
          className="pl-10 h-9 md:h-10 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </motion.div>

      {/* Requests Table */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="p-3 md:p-6 pb-2 md:pb-4">
            <CardTitle className="text-base md:text-lg">Document Requests</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              {requests.length === 0 ? "No document requests yet" : `${filteredRequests.length} request${filteredRequests.length !== 1 ? 's' : ''} found`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-0">
            {requests.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No document requests</p>
                <p className="text-sm">Requests will appear here once residents submit them</p>
              </div>
            ) : (
              <Tabs defaultValue="pending">
                <TabsList className="h-10 w-full justify-start overflow-x-auto bg-muted/50 p-1">
                  <TabsTrigger value="pending" className="relative text-sm px-4 py-1.5 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    Pending ({pendingCount})
                  </TabsTrigger>
                  <TabsTrigger value="approved" className="relative text-sm px-4 py-1.5 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    For Pickup ({approvedCount})
                  </TabsTrigger>
                  <TabsTrigger value="all" className="relative text-sm px-4 py-1.5 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    All ({requests.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="mt-3 md:mt-4">
                  <RequestsTable 
                    requests={filteredRequests.filter(r => r.status === "pending")}
                    onView={setSelectedRequest}
                    onApprove={(r) => { setSelectedRequest(r); setShowApproveDialog(true); }}
                    formatDate={formatDate}
                    showApproveButton
                  />
                </TabsContent>

                <TabsContent value="approved" className="mt-3 md:mt-4">
                  <RequestsTable 
                    requests={filteredRequests.filter(r => r.status === "approved")}
                    onView={setSelectedRequest}
                    onPrint={handlePrintRequest}
                    onRelease={handleReleaseDocument}
                    formatDate={formatDate}
                    showReleaseButton
                  />
                </TabsContent>

                <TabsContent value="all" className="mt-3 md:mt-4">
                  <RequestsTable 
                    requests={filteredRequests}
                    onView={setSelectedRequest}
                    formatDate={formatDate}
                  />
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Request Details Modal */}
      <Dialog open={!!selectedRequest && !showApproveDialog} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="w-[95vw] sm:w-full max-w-lg">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
            <DialogDescription>Request #{selectedRequest?.request_number}</DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{selectedRequest.type}</h3>
                {getStatusBadge(selectedRequest.status)}
              </div>
              <div className="grid gap-3 grid-cols-2">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Requester</p>
                  <p className="font-medium text-sm">{selectedRequest.requester_name}</p>
                  <p className="text-xs text-muted-foreground">{selectedRequest.requester_email}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Purok</p>
                  <p className="font-medium text-sm">{selectedRequest.purok}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Purpose</p>
                  <p className="font-medium text-sm">{selectedRequest.purpose}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Fee</p>
                  <p className="font-medium text-sm">PHP {selectedRequest.fee}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRequest(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Approve Request</DialogTitle>
            <DialogDescription>
              Approve document request from {selectedRequest?.requester_name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm">
              Are you sure you want to approve this {selectedRequest?.type} request?
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>Cancel</Button>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => selectedRequest && handleApproveRequest(selectedRequest.id)}
            >
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Types Dialog */}
      <Dialog open={showManageTypes} onOpenChange={setShowManageTypes}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Document Types</DialogTitle>
            <DialogDescription>Available document types and fees</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {documentTypes.map((type) => (
              <div key={type.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">{type.name}</p>
                  <Badge variant="outline">PHP {type.fee}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{type.requirements}</p>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowManageTypes(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Print Content */}
      {selectedPrintRequest && (
        <div id="print-request-content" className="hidden print:block p-8">
          <OfficialDocumentHeader />
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold">{selectedPrintRequest.type.toUpperCase()}</h2>
            <p className="text-sm">Request No: {selectedPrintRequest.request_number}</p>
          </div>
          <div className="space-y-4 text-sm">
            <p>This is to certify that <strong>{selectedPrintRequest.requester_name}</strong> of {selectedPrintRequest.purok}, Barangay Santiago, San Antonio, Zambales has requested this document for the purpose of <strong>{selectedPrintRequest.purpose}</strong>.</p>
            <p>Issued this {formatDate(new Date().toISOString())} at Barangay Santiago, San Antonio, Zambales.</p>
            <div className="mt-12 text-center">
              <p className="border-t border-black w-48 mx-auto pt-2">Punong Barangay</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

function RequestsTable({ 
  requests, 
  onView,
  onApprove,
  onPrint,
  onRelease,
  formatDate,
  showApproveButton,
  showReleaseButton
}: { 
  requests: DocumentRequest[]
  onView: (r: DocumentRequest) => void
  onApprove?: (r: DocumentRequest) => void
  onPrint?: (r: DocumentRequest) => void
  onRelease?: (id: string) => void
  formatDate: (d: string | null) => string
  showApproveButton?: boolean
  showReleaseButton?: boolean
}) {
  if (requests.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-sm">No requests found</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs md:text-sm">Request ID</TableHead>
            <TableHead className="text-xs md:text-sm hidden sm:table-cell">Type</TableHead>
            <TableHead className="text-xs md:text-sm hidden md:table-cell">Requester</TableHead>
            <TableHead className="text-xs md:text-sm">Status</TableHead>
            <TableHead className="text-xs md:text-sm text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="font-medium text-xs md:text-sm py-2 md:py-4">{request.request_number}</TableCell>
              <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden sm:table-cell">{request.type}</TableCell>
              <TableCell className="py-2 md:py-4 hidden md:table-cell">
                <p className="font-medium text-xs md:text-sm">{request.requester_name}</p>
              </TableCell>
              <TableCell className="py-2 md:py-4">{getStatusBadge(request.status)}</TableCell>
              <TableCell className="py-2 md:py-4 text-right">
                <div className="flex gap-1 md:gap-2 justify-end">
                  <Button variant="outline" size="sm" className="h-7 md:h-8 px-2 md:px-3 text-xs" onClick={() => onView(request)}>
                    <Eye className="h-3 w-3 md:mr-1" />
                    <span className="hidden md:inline">View</span>
                  </Button>
                  {showApproveButton && onApprove && (
                    <Button size="sm" className="h-7 md:h-8 px-2 md:px-3 text-xs bg-emerald-600 hover:bg-emerald-700" onClick={() => onApprove(request)}>
                      <CheckCircle2 className="h-3 w-3 md:mr-1" />
                      <span className="hidden md:inline">Approve</span>
                    </Button>
                  )}
                  {showReleaseButton && onPrint && (
                    <Button variant="outline" size="sm" className="h-7 md:h-8 px-2 md:px-3 text-xs" onClick={() => onPrint(request)}>
                      <Printer className="h-3 w-3" />
                    </Button>
                  )}
                  {showReleaseButton && onRelease && (
                    <Button size="sm" className="h-7 md:h-8 px-2 md:px-3 text-xs bg-emerald-600 hover:bg-emerald-700" onClick={() => onRelease(request.id)}>
                      <CheckCircle2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
