"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import * as XLSX from "xlsx"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { printElementById } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { exportToCSV, exportToXLSX, prepareDataForExport } from "@/lib/export-utils"

import { DocumentStatusTimeline } from "@/components/document-status-timeline"
import { 
  Search, 
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Download,
  Printer,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Bell,
  Paperclip,
  Image as ImageIcon,
  File
} from "lucide-react"

const mockRequests = [
  {
    id: "REQ-2026-001",
    type: "Barangay Clearance",
    purpose: "Employment",
    requester: "Juan Dela Cruz",
    email: "juan@example.com",
    purok: "Purok 3",
    status: "pending",
    date: "April 28, 2026",
    fee: "50",
    documentsUploaded: true,
    uploadedFiles: [
      { name: "Valid_ID_Front.jpg", type: "image", size: "245 KB", uploadDate: "April 28, 2026" },
      { name: "Valid_ID_Back.jpg", type: "image", size: "198 KB", uploadDate: "April 28, 2026" },
      { name: "Proof_of_Residency.pdf", type: "document", size: "1.2 MB", uploadDate: "April 28, 2026" }
    ]
  },
  {
    id: "REQ-2026-002",
    type: "Certificate of Residency",
    purpose: "School Enrollment",
    requester: "Maria Santos",
    email: "maria@example.com",
    purok: "Purok 1",
    status: "approved",
    date: "April 27, 2026",
    fee: "30",
    pickupTime: "April 30, 2026, 2:00 PM",
    documentsUploaded: true,
    uploadedFiles: [
      { name: "National_ID.jpg", type: "image", size: "320 KB", uploadDate: "April 27, 2026" }
    ]
  },
  {
    id: "REQ-2026-003",
    type: "Business Clearance",
    purpose: "Business Permit Application",
    requester: "Pedro Reyes",
    email: "pedro@example.com",
    purok: "Purok 2",
    status: "pending",
    date: "April 26, 2026",
    fee: "200",
    documentsUploaded: false,
    uploadedFiles: [
      { name: "Business_Permit.pdf", type: "document", size: "890 KB", uploadDate: "April 26, 2026" }
    ],
    missingDocuments: ["DTI Registration", "Barangay Clearance"]
  },
  {
    id: "REQ-2026-004",
    type: "Certificate of Indigency",
    purpose: "Medical Assistance",
    requester: "Ana Garcia",
    email: "ana@example.com",
    purok: "Purok 4",
    status: "released",
    date: "April 20, 2026",
    fee: "Free",
    releaseDate: "April 22, 2026",
    documentsUploaded: true,
    uploadedFiles: [
      { name: "Valid_ID.jpg", type: "image", size: "210 KB", uploadDate: "April 20, 2026" },
      { name: "Birth_Certificate.pdf", type: "document", size: "456 KB", uploadDate: "April 20, 2026" }
    ]
  },
]

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
    case "rejected":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 text-[10px] md:text-xs">
          <XCircle className="mr-0.5 md:mr-1 h-2.5 w-2.5 md:h-3 md:w-3" />
          <span className="hidden sm:inline">Rejected</span>
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

// Document Header Component with Logos - Only visible when printing
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
  const [selectedRequest, setSelectedRequest] = useState<typeof mockRequests[0] | null>(null)
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [showManageTypes, setShowManageTypes] = useState(false)
  const [documentTypes, setDocumentTypes] = useState(defaultDocumentTypes)
  const [editingType, setEditingType] = useState<typeof defaultDocumentTypes[0] | null>(null)
  const [newTypeName, setNewTypeName] = useState("")
  const [newTypeRequirements, setNewTypeRequirements] = useState<string[]>([""])
  const [newTypeFee, setNewTypeFee] = useState("")
  const [showPrintDocument, setShowPrintDocument] = useState(false)
  const [printRequest, setPrintRequest] = useState<typeof mockRequests[0] | null>(null)
  const [exportDateFrom, setExportDateFrom] = useState("")
  const [exportDateTo, setExportDateTo] = useState("")
  const [showNotifyDialog, setShowNotifyDialog] = useState(false)
  const [notifyRequest, setNotifyRequest] = useState<typeof mockRequests[0] | null>(null)
  const [notifyMessage, setNotifyMessage] = useState("")
  const [requiredDocuments, setRequiredDocuments] = useState<string[]>([])

  const pendingCount = mockRequests.filter(r => r.status === "pending").length
  const approvedCount = mockRequests.filter(r => r.status === "approved").length
  const releasedCount = mockRequests.filter(r => r.status === "released").length

  const handleExportToExcel = () => {
    if (!exportDateFrom || !exportDateTo) {
      alert("Please select both from and to dates")
      return
    }

    const wb = XLSX.utils.book_new()
    const documentTypes = ["Barangay Clearance", "Certificate of Residency", "Business Clearance", "Certificate of Indigency"]

    // Filter requests by date range
    const filteredByDate = mockRequests.filter(req => {
      const reqDate = new Date(req.date.split(',')[0].trim() + ', 2026')
      const fromDate = new Date(exportDateFrom)
      const toDate = new Date(exportDateTo)
      return reqDate >= fromDate && reqDate <= toDate
    })

    // Group by document type and create sheets
    documentTypes.forEach(docType => {
      const typeRequests = filteredByDate.filter(req => req.type === docType)
      
      if (typeRequests.length > 0) {
        const sheetData = prepareDataForExport(typeRequests, {
          id: "Request ID",
          type: "Type",
          requester: "Requester",
          email: "Email",
          purok: "Purok",
          purpose: "Purpose",
          status: "Status",
          date: "Date",
          fee: "Fee",
          documentsUploaded: "Documents",
        })

        const ws = XLSX.utils.json_to_sheet(sheetData)
        
        // Set column widths
        ws['!cols'] = [
          { wch: 12 }, // Request ID
          { wch: 20 }, // Type
          { wch: 15 }, // Requester
          { wch: 20 }, // Email
          { wch: 10 }, // Purok
          { wch: 15 }, // Purpose
          { wch: 12 }, // Status
          { wch: 15 }, // Date
          { wch: 10 }, // Fee
          { wch: 12 }, // Documents
        ]

        const sheetName = docType.substring(0, 31) // Excel sheet name limit
        XLSX.utils.book_append_sheet(wb, ws, sheetName)
      }
    })

    // Generate Excel file
    const fileName = `DocumentRequests_${new Date(exportDateFrom).toLocaleDateString()}_to_${new Date(exportDateTo).toLocaleDateString()}.xlsx`
    XLSX.writeFile(wb, fileName)
    toast.success('Excel export complete')
    setShowExportDialog(false)
  }

  const handleExportToCSV = () => {
    const filteredRequests = mockRequests
      .filter(req => req.date && (!exportDateFrom || !exportDateTo || (new Date(req.date.split(',')[0].trim() + ', 2026') >= new Date(exportDateFrom) && new Date(req.date.split(',')[0].trim() + ', 2026') <= new Date(exportDateTo))))
      .map(req => ({
        id: req.id,
        type: req.type,
        requester: req.requester,
        email: req.email,
        purok: req.purok,
        purpose: req.purpose,
        status: req.status,
        date: req.date,
        fee: `₱${req.fee}`,
        documentsUploaded: req.documentsUploaded ? 'Yes' : 'No',
      }))

    const csvData = prepareDataForExport(filteredRequests, {
      id: 'Request ID',
      type: 'Type',
      requester: 'Requester',
      email: 'Email',
      purok: 'Purok',
      purpose: 'Purpose',
      status: 'Status',
      date: 'Date',
      fee: 'Fee',
      documentsUploaded: 'Documents'
    })

    exportToCSV(csvData, `DocumentRequests_${new Date().toISOString().slice(0,10)}.csv`)
    toast.success('CSV export complete')
    setShowExportDialog(false)
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
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setShowExportDialog(true)}>
            <Download className="h-3 w-3 md:mr-2" />
            <span className="hidden md:inline">Export Excel</span>
          </Button>
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
                <p className="text-lg md:text-2xl font-bold">{mockRequests.length}</p>
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
            <CardDescription className="text-xs md:text-sm">Process pending requests and manage approvals</CardDescription>
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-0">
            <div className="space-y-4">
              {/* Tabs */}
              <Tabs defaultValue="pending">
                <TabsList className="h-10 w-full justify-start overflow-x-auto bg-muted/50 p-1">
                  <TabsTrigger value="pending" className="relative text-sm px-4 py-1.5 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    Pending ({pendingCount})
                    {pendingCount > 0 && <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-amber-500"></span>}
                  </TabsTrigger>
                  <TabsTrigger value="approved" className="relative text-sm px-4 py-1.5 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    For Pickup ({approvedCount})
                  </TabsTrigger>
                  <TabsTrigger value="all" className="relative text-sm px-4 py-1.5 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    All Requests ({mockRequests.length})
                  </TabsTrigger>
                </TabsList>
              <TabsContent value="pending" className="mt-3 md:mt-4">
                <div className="rounded-md border overflow-x-auto md:overflow-x-visible">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs md:text-sm">Request ID</TableHead>
                        <TableHead className="text-xs md:text-sm hidden sm:table-cell">Type</TableHead>
                        <TableHead className="text-xs md:text-sm hidden md:table-cell">Requester</TableHead>
                        <TableHead className="text-xs md:text-sm hidden lg:table-cell">Date</TableHead>
                        <TableHead className="text-xs md:text-sm text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockRequests.filter(r => r.status === "pending").map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium text-xs md:text-sm py-2 md:py-4">{request.id}</TableCell>
                          <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden sm:table-cell truncate">{request.type}</TableCell>
                          <TableCell className="py-2 md:py-4 hidden md:table-cell">
                            <div>
                              <p className="font-medium text-xs md:text-sm">{request.requester}</p>
                              <p className="text-[10px] md:text-xs text-muted-foreground">{request.purok}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden lg:table-cell whitespace-nowrap">{request.date}</TableCell>
                          <TableCell className="py-2 md:py-4 text-right">
                            <div className="flex gap-1 md:gap-2 justify-end">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="h-7 md:h-8 px-2 md:px-3 text-xs flex-shrink-0"
                                onClick={() => setSelectedRequest(request)}
                              >
                                <Eye className="h-3 w-3 md:mr-1" />
                                <span className="hidden md:inline">View</span>
                              </Button>
                              {request.documentsUploaded && (
                                <Button 
                                  size="sm"
                                  className="h-7 md:h-8 px-2 md:px-3 text-xs bg-emerald-600 hover:bg-emerald-700 flex-shrink-0"
                                  onClick={() => {
                                    setSelectedRequest(request)
                                    setShowApproveDialog(true)
                                  }}
                                >
                                  <CheckCircle2 className="h-3 w-3 md:mr-1" />
                                  <span className="hidden md:inline">Approve</span>
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              <TabsContent value="approved" className="mt-3 md:mt-4">
                <div className="rounded-md border overflow-x-auto md:overflow-x-visible">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs md:text-sm">Request ID</TableHead>
                        <TableHead className="text-xs md:text-sm hidden sm:table-cell">Type</TableHead>
                        <TableHead className="text-xs md:text-sm hidden md:table-cell">Requester</TableHead>
                        <TableHead className="text-xs md:text-sm text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockRequests.filter(r => r.status === "approved").map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium text-xs md:text-sm py-2 md:py-4">{request.id}</TableCell>
                          <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden sm:table-cell truncate">{request.type}</TableCell>
                          <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden md:table-cell">{request.requester}</TableCell>
                          <TableCell className="py-2 md:py-4 text-right">
                            <div className="flex gap-1 md:gap-2 justify-end">
                              <Button variant="outline" size="sm" className="h-7 md:h-8 px-2 md:px-3 text-xs flex-shrink-0" onClick={() => {
                                setPrintRequest(request)
                                setShowPrintDocument(true)
                              }}>
                                <Printer className="h-3 w-3 md:mr-1" />
                                <span className="hidden md:inline">Print</span>
                              </Button>
                              <Button size="sm" className="h-7 md:h-8 px-2 md:px-3 text-xs bg-emerald-600 hover:bg-emerald-700 flex-shrink-0">
                                <CheckCircle2 className="h-3 w-3 md:mr-1" />
                                <span className="hidden lg:inline">Released</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              <TabsContent value="all" className="mt-3 md:mt-4">
                <div className="rounded-md border overflow-x-auto md:overflow-x-visible">
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
                      {mockRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium text-xs md:text-sm py-2 md:py-4">{request.id}</TableCell>
                          <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden sm:table-cell truncate">{request.type}</TableCell>
                          <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden md:table-cell">{request.requester}</TableCell>
                          <TableCell className="py-2 md:py-4">{getStatusBadge(request.status)}</TableCell>
                          <TableCell className="py-2 md:py-4 text-right">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="h-7 md:h-8 px-2 md:px-3 text-xs flex-shrink-0"
                              onClick={() => setSelectedRequest(request)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Request Details Modal */}
      <Dialog open={!!selectedRequest && !showApproveDialog} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="w-[95vw] max-w-2xl sm:w-full bg-white">
          <DialogHeader>
            <DialogTitle className="text-base md:text-lg">Request Details</DialogTitle>
            <DialogDescription className="text-xs md:text-sm">
              View complete request information
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-3 md:space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="font-medium text-sm md:text-base">{selectedRequest.id}</span>
                {getStatusBadge(selectedRequest.status)}
              </div>
              <div className="grid gap-2 md:gap-3 grid-cols-1 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] md:text-xs text-muted-foreground">Document Type</p>
                  <p className="font-medium text-sm md:text-base">{selectedRequest.type}</p>
                </div>
                <div>
                  <p className="text-[10px] md:text-xs text-muted-foreground">Purpose</p>
                  <p className="font-medium text-sm md:text-base">{selectedRequest.purpose}</p>
                </div>
                <div>
                  <p className="text-[10px] md:text-xs text-muted-foreground">Requester</p>
                  <p className="font-medium text-sm md:text-base">{selectedRequest.requester}</p>
                </div>
                <div>
                  <p className="text-[10px] md:text-xs text-muted-foreground">Purok</p>
                  <p className="font-medium text-sm md:text-base">{selectedRequest.purok}</p>
                </div>
                <div>
                  <p className="text-[10px] md:text-xs text-muted-foreground">Fee</p>
                  <p className="font-medium text-sm md:text-base">PHP {selectedRequest.fee}</p>
                </div>
                <div>
                  <p className="text-[10px] md:text-xs text-muted-foreground">Date</p>
                  <p className="font-medium text-sm md:text-base">{selectedRequest.date}</p>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2 mt-4">
                <div className="rounded-lg border border-muted/60 bg-muted/40 p-4">
                  <p className="text-xs font-semibold text-muted-foreground mb-3">Status Timeline</p>
                  <DocumentStatusTimeline
                    currentStatus={selectedRequest.status === 'pending' ? 'processing' : selectedRequest.status === 'released' ? 'ready' : selectedRequest.status as any}
                    submittedDate={new Date(selectedRequest.date.split(',')[0].trim() + ', 2026')}
                    processingDate={selectedRequest.status !== 'pending' ? new Date(selectedRequest.date.split(',')[0].trim() + ', 2026') : undefined}
                    approvedDate={selectedRequest.status === 'approved' ? new Date(selectedRequest.date.split(',')[0].trim() + ', 2026') : undefined}
                    readyDate={selectedRequest.status === 'released' ? new Date(selectedRequest.date.split(',')[0].trim() + ', 2026') : undefined}
                  />
                </div>

              </div>

              {/* Uploaded Files Section */}
              <div className="border-t pt-3 mt-3">
                <div className="flex items-center gap-2 mb-3">
                  <Paperclip className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium text-sm">Uploaded Documents</p>
                  <Badge variant="secondary" className="text-xs">
                    {selectedRequest.uploadedFiles?.length || 0} files
                  </Badge>
                </div>
                
                {selectedRequest.uploadedFiles && selectedRequest.uploadedFiles.length > 0 ? (
                  <div className="space-y-2">
                    {selectedRequest.uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg border">
                        <div className="flex items-center gap-3">
                          {file.type === "image" ? (
                            <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center">
                              <ImageIcon className="h-4 w-4 text-blue-600" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded bg-amber-100 flex items-center justify-center">
                              <File className="h-4 w-4 text-amber-600" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{file.size} - {file.uploadDate}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-sm text-amber-700">No documents uploaded yet</p>
                  </div>
                )}
              </div>

              {/* Missing Documents Warning */}
              {selectedRequest.missingDocuments && selectedRequest.missingDocuments.length > 0 && (
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <p className="text-sm font-medium text-red-700">Missing Documents</p>
                  </div>
                  <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                    {selectedRequest.missingDocuments.map((doc, index) => (
                      <li key={index}>{doc}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="flex-col-reverse sm:flex-row gap-2 pt-4">
            <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => setSelectedRequest(null)}>Close</Button>
            {selectedRequest?.status === "pending" && !selectedRequest.documentsUploaded && (
              <Button 
                variant="secondary" 
                size="sm" 
                className="w-full sm:w-auto gap-1"
                onClick={() => {
                  setNotifyRequest(selectedRequest)
                  setRequiredDocuments(selectedRequest.missingDocuments || [])
                  setShowNotifyDialog(true)
                }}
              >
                <Bell className="h-3 w-3" />
                Request Documents
              </Button>
            )}
            {selectedRequest?.status === "pending" && selectedRequest.documentsUploaded && (
              <>
                <Button variant="destructive" size="sm" className="w-full sm:w-auto">Reject</Button>
                <Button size="sm" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700" onClick={() => setShowApproveDialog(true)}>Approve</Button>
              </>
            )}
            {selectedRequest?.status === "approved" && (
              <Button size="sm" className="w-full sm:w-auto" onClick={() => {
                setPrintRequest(selectedRequest)
                setShowPrintDocument(true)
              }}>
                <Printer className="mr-2 h-3 w-3" />
                Print Document
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent className="mx-4 md:mx-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-base md:text-lg">Approve Request</DialogTitle>
            <DialogDescription className="text-xs md:text-sm">
              Set pickup details for the approved document
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 md:space-y-4 py-2 md:py-4">
            <div className="space-y-1 md:space-y-2">
              <Label className="text-xs md:text-sm">Pickup Date</Label>
              <Input type="date" className="h-8 md:h-10 text-sm" />
            </div>
            <div className="space-y-1 md:space-y-2">
              <Label className="text-xs md:text-sm">Pickup Time</Label>
              <Input type="time" className="h-8 md:h-10 text-sm" />
            </div>
            <div className="space-y-1 md:space-y-2">
              <Label className="text-xs md:text-sm">Fee Amount</Label>
              <Input defaultValue={selectedRequest?.fee} placeholder="Enter fee" className="h-8 md:h-10 text-sm" />
            </div>
            <div className="space-y-1 md:space-y-2">
              <Label className="text-xs md:text-sm">Notes (Optional)</Label>
              <Textarea placeholder="Additional instructions..." className="text-sm min-h-[60px] md:min-h-[80px]" />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setShowApproveDialog(false)}>Cancel</Button>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => {
              setShowApproveDialog(false)
              setSelectedRequest(null)
            }}>
              Approve & Notify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export to Excel Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-md mx-4 md:mx-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-base md:text-lg">Export Document Requests</DialogTitle>
            <DialogDescription className="text-xs md:text-sm">
              Download all document requests as Excel file with separate sheets for each document type
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-xs md:text-sm">From Date</Label>
              <Input 
                type="date" 
                value={exportDateFrom}
                onChange={(e) => setExportDateFrom(e.target.value)}
                className="h-8 md:h-10 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs md:text-sm">To Date</Label>
              <Input 
                type="date" 
                value={exportDateTo}
                onChange={(e) => setExportDateTo(e.target.value)}
                className="h-8 md:h-10 text-sm"
              />
            </div>
            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs md:text-sm font-semibold mb-2">Excel sheets included:</p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• Barangay Clearance</li>
                <li>• Certificate of Residency</li>
                <li>• Business Clearance</li>
                <li>• Certificate of Indigency</li>
              </ul>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowExportDialog(false)}>Cancel</Button>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button size="sm" className="w-full sm:w-auto" onClick={handleExportToCSV}>
                <FileText className="h-3 w-3 mr-1" />
                Export CSV
              </Button>
              <Button size="sm" className="w-full sm:w-auto" onClick={handleExportToExcel}>
                <Download className="h-3 w-3 mr-1" />
                Export Excel
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Print Document Dialog */}
      <Dialog open={showPrintDocument} onOpenChange={setShowPrintDocument}>
        <DialogContent className="w-[95vw] max-w-4xl sm:w-full max-h-[95vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-base md:text-lg text-foreground">Document Preview & Print</DialogTitle>
          </DialogHeader>
          {printRequest && (
            <div id="print-document" className="bg-white text-gray-900">
              <style>{`
                @media print {
                  @page {
                    size: A4;
                    margin: 0.5in;
                  }
                  body { margin: 0; padding: 0; }
                  #print-document { margin: 0; padding: 0; }
                  .no-print { display: none !important; }
                }
              `}</style>
              
              <div className="p-4 md:p-8">
                {/* Header - Visible in both preview and print */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b-4 border-gray-400">
                  <div className="flex-shrink-0 w-20 h-20">
                    <Image src="/images/santiagologo.jpg" alt="Barangay Santiago" width={80} height={80} className="w-full h-full rounded-full object-cover" priority />
                  </div>
                  <div className="text-center flex-1 px-4">
                    <p className="text-xs text-gray-700">Republic of the Philippines</p>
                    <p className="text-xs text-gray-700">Province of Zambales</p>
                    <p className="text-xs text-gray-700">Municipality of San Antonio</p>
                    <p className="text-lg font-bold text-gray-900">Barangay Santiago</p>
                  </div>
                  <div className="flex-shrink-0 w-20 h-20">
                    <Image src="/images/saz.jpg" alt="Municipality" width={80} height={80} className="w-full h-full rounded-full object-cover" priority />
                  </div>
                </div>

                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold uppercase tracking-wide text-gray-900 mb-2">{printRequest.type}</h2>
                  <p className="text-sm text-gray-600">Request ID: {printRequest.id}</p>
                </div>

                {/* Document Body */}
                <div className="space-y-4 text-sm leading-relaxed text-gray-900">
                  <p className="font-semibold">TO WHOM IT MAY CONCERN:</p>

                  {printRequest.type === "Barangay Clearance" && (
                    <>
                      <p className="text-justify">This is to certify that <span className="font-bold">{printRequest.requester}</span>, a resident of Barangay Santiago, San Antonio, Zambales, is of good moral character and has no derogatory record on file in this office.</p>
                      <p className="text-justify">This certification is issued upon request for <span className="font-bold">{printRequest.purpose}</span>.</p>
                    </>
                  )}

                  {printRequest.type === "Certificate of Residency" && (
                    <>
                      <p className="text-justify">This is to certify that <span className="font-bold">{printRequest.requester}</span> is a bonafide resident of Barangay Santiago, San Antonio, Zambales.</p>
                      <p className="text-justify">This certification is issued upon request for <span className="font-bold">{printRequest.purpose}</span>.</p>
                    </>
                  )}

                  {printRequest.type === "Certificate of Indigency" && (
                    <>
                      <p className="text-justify">This is to certify that <span className="font-bold">{printRequest.requester}</span> is a resident of Barangay Santiago, San Antonio, Zambales, and belongs to an indigent family in this barangay.</p>
                      <p className="text-justify">This certification is issued upon request for <span className="font-bold">{printRequest.purpose}</span>.</p>
                    </>
                  )}

                  {printRequest.type === "Business Clearance" && (
                    <>
                      <p className="text-justify">This is to certify that <span className="font-bold">{printRequest.requester}</span>, owner/operator of <span className="font-bold">{printRequest.purpose}</span>, located at Barangay Santiago, San Antonio, Zambales, has been granted clearance to operate their business in this barangay.</p>
                      <p className="text-justify">This certification is issued upon request for business operations.</p>
                    </>
                  )}

                  <p className="mt-8">Issued this <span className="font-semibold">{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span> at Barangay Santiago, San Antonio, Zambales.</p>

                  <div className="mt-12 pt-8 border-t-2 border-gray-300">
                    <div className="inline-block w-64">
                      <div className="h-16 mb-2" />
                      <p className="font-bold text-center text-gray-900 text-lg">ROLANDO C. BORJA</p>
                      <p className="text-center text-gray-800 font-semibold">Barangay Captain</p>
                    </div>
                  </div>
                </div>

                {/* Footer - Visible in both preview and print */}
                <div className="mt-8 pt-6 border-t-2 border-gray-300 text-center space-y-1">
                  <p className="text-xs text-gray-600">This is an official document from Barangay Santiago</p>
                  <p className="text-xs text-gray-600">For inquiries, visit the Barangay Hall or call the office</p>
                  <p className="text-xs font-semibold text-gray-700 mt-2">Barangay Santiago Official Seal</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex-col-reverse sm:flex-row gap-2 pt-4">
            <Button variant="outline" size="sm" onClick={() => setShowPrintDocument(false)}>Close</Button>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => printElementById('print-document')}>
              <Printer className="mr-2 h-3 w-3" />
              Print Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Document Types Dialog */}
      <Dialog open={showManageTypes} onOpenChange={setShowManageTypes}>
        <DialogContent className="w-[95vw] max-w-2xl sm:w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base md:text-lg">Manage Document Types</DialogTitle>
            <DialogDescription className="text-xs md:text-sm">
              Create, edit, and manage document types with requirements
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 md:space-y-5">
            {/* Add New Type Form */}
            <div className="rounded-lg border p-3 md:p-4 bg-blue-50 dark:bg-blue-950/20">
              <div className="flex items-center gap-2 mb-3">
                <Plus className="w-4 h-4 text-blue-600" />
                <p className="text-xs md:text-sm font-semibold">Add New Document Type</p>
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs md:text-sm">Document Type Name</Label>
                  <Input 
                    placeholder="e.g., Barangay Clearance"
                    value={newTypeName}
                    onChange={(e) => setNewTypeName(e.target.value)}
                    className="h-8 md:h-10 text-xs md:text-sm mt-1"
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs md:text-sm">Requirements</Label>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-6 px-2 gap-1"
                      onClick={() => {
                        setNewTypeRequirements([...newTypeRequirements, ""])
                      }}
                    >
                      <Plus className="w-3 h-3" />
                      <span className="text-xs">Add</span>
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {newTypeRequirements.map((requirement, index) => (
                      <div key={index} className="flex gap-2">
                        <Input 
                          placeholder={`Requirement ${index + 1}`}
                          value={requirement}
                          onChange={(e) => {
                            const updated = [...newTypeRequirements]
                            updated[index] = e.target.value
                            setNewTypeRequirements(updated)
                          }}
                          className="h-8 md:h-10 text-xs md:text-sm flex-1"
                        />
                        {newTypeRequirements.length > 1 && (
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              setNewTypeRequirements(newTypeRequirements.filter((_, i) => i !== index))
                            }}
                          >
                            <Trash2 className="w-3 h-3 text-red-500" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label className="text-xs md:text-sm">Fee</Label>
                  <Input 
                    placeholder="e.g., 50 or Free"
                    value={newTypeFee}
                    onChange={(e) => setNewTypeFee(e.target.value)}
                    className="h-8 md:h-10 text-xs md:text-sm mt-1"
                  />
                </div>
                
                <Button 
                  size="sm" 
                  className="w-full gap-2 bg-blue-600 hover:bg-blue-700 mt-2"
                  onClick={() => {
                    if (newTypeName.trim()) {
                      const newType = {
                        id: Math.random().toString(),
                        name: newTypeName,
                        requirements: newTypeRequirements.filter(r => r.trim()).join(", "),
                        fee: newTypeFee
                      }
                      setDocumentTypes([...documentTypes, newType])
                      setNewTypeName("")
                      setNewTypeRequirements([""])
                      setNewTypeFee("")
                    }
                  }}
                >
                  <Plus className="w-3 h-3" />
                  Add Type
                </Button>
              </div>
            </div>

            {/* Existing Types List */}
            <div className="space-y-2">
              <p className="text-xs md:text-sm font-semibold">Existing Document Types</p>
              <div className="space-y-2 max-h-[40vh] overflow-y-auto">
                {documentTypes.map((type) => (
                  <div key={type.id} className="p-3 border rounded-lg bg-muted/50">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-xs md:text-sm">{type.name}</p>
                        <p className="text-[10px] md:text-xs text-muted-foreground mt-1">Requirements: {type.requirements}</p>
                        <p className="text-[10px] md:text-xs text-muted-foreground">Fee: {type.fee}</p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={() => {
                            setEditingType(type)
                            setNewTypeName(type.name)
                            setNewTypeRequirements(type.requirements.split(", "))
                            setNewTypeFee(type.fee)
                          }}
                        >
                          <Edit2 className="w-3 h-3 text-blue-500" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={() => {
                            setDocumentTypes(documentTypes.filter(t => t.id !== type.id))
                          }}
                        >
                          <Trash2 className="w-3 h-3 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col-reverse sm:flex-row gap-2 pt-4">
            <Button variant="outline" size="sm" onClick={() => {
              setShowManageTypes(false)
              setEditingType(null)
              setNewTypeName("")
              setNewTypeRequirements([""])
              setNewTypeFee("")
            }}>
              Close
            </Button>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => {
              setShowManageTypes(false)
              setEditingType(null)
            }}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notify Resident Dialog - Request Additional Documents */}
      <Dialog open={showNotifyDialog} onOpenChange={(open) => {
        setShowNotifyDialog(open)
        if (!open) {
          setNotifyRequest(null)
          setNotifyMessage("")
          setRequiredDocuments([])
        }
      }}>
        <DialogContent className="w-[95vw] max-w-lg sm:w-full bg-white">
          <DialogHeader>
            <DialogTitle className="text-base md:text-lg flex items-center gap-2">
              <Bell className="h-5 w-5 text-amber-500" />
              Request Additional Documents
            </DialogTitle>
            <DialogDescription className="text-xs md:text-sm">
              Notify the resident to submit missing or additional documents for their request
            </DialogDescription>
          </DialogHeader>
          
          {notifyRequest && (
            <div className="space-y-4">
              {/* Request Info */}
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium">{notifyRequest.requester}</p>
                <p className="text-xs text-muted-foreground">{notifyRequest.type} - {notifyRequest.id}</p>
                <p className="text-xs text-muted-foreground">Email: {notifyRequest.email}</p>
              </div>

              {/* Required Documents */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Required Documents</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 gap-1 text-xs"
                    onClick={() => setRequiredDocuments([...requiredDocuments, ""])}
                  >
                    <Plus className="h-3 w-3" />
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {requiredDocuments.map((doc, index) => (
                    <div key={index} className="flex gap-2">
                      <Input 
                        placeholder="e.g., Birth Certificate, Valid ID"
                        value={doc}
                        onChange={(e) => {
                          const updated = [...requiredDocuments]
                          updated[index] = e.target.value
                          setRequiredDocuments(updated)
                        }}
                        className="h-9 text-sm flex-1"
                      />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-9 w-9 p-0"
                        onClick={() => setRequiredDocuments(requiredDocuments.filter((_, i) => i !== index))}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                  {requiredDocuments.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-2">Click &quot;Add&quot; to specify required documents</p>
                  )}
                </div>
              </div>

              {/* Additional Message */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Additional Message (Optional)</Label>
                <Textarea 
                  placeholder="Add any additional instructions or notes for the resident..."
                  value={notifyMessage}
                  onChange={(e) => setNotifyMessage(e.target.value)}
                  className="min-h-[80px] text-sm"
                />
              </div>

              {/* Preview */}
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-xs font-medium text-amber-800 mb-2">Notification Preview:</p>
                <p className="text-xs text-amber-700">
                  Dear {notifyRequest.requester}, your document request ({notifyRequest.id}) requires additional documents: 
                  {requiredDocuments.filter(d => d.trim()).join(", ") || "[No documents specified]"}. 
                  {notifyMessage && ` Note: ${notifyMessage}`}
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex-col-reverse sm:flex-row gap-2 pt-4">
            <Button variant="outline" size="sm" onClick={() => {
              setShowNotifyDialog(false)
              setNotifyRequest(null)
              setNotifyMessage("")
              setRequiredDocuments([])
            }}>
              Cancel
            </Button>
            <Button 
              size="sm" 
              className="bg-amber-600 hover:bg-amber-700 gap-1"
              disabled={requiredDocuments.filter(d => d.trim()).length === 0}
              onClick={() => {
                // Handle notification logic here
                alert(`Notification sent to ${notifyRequest?.email}`)
                setShowNotifyDialog(false)
                setNotifyRequest(null)
                setNotifyMessage("")
                setRequiredDocuments([])
                setSelectedRequest(null)
              }}
            >
              <Bell className="h-3 w-3" />
              Send Notification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
