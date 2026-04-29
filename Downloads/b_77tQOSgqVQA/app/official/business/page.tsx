"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Search, 
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  Printer,
  Settings
} from "lucide-react"

const mockBusinessApplications = [
  {
    id: "BUS-2026-001",
    businessName: "Juan's Sari-sari Store",
    businessType: "Retail",
    owner: "Juan Dela Cruz",
    address: "Purok 3, Barangay Santiago",
    email: "juan@example.com",
    contact: "0917-123-4567",
    status: "pending",
    date: "April 26, 2026",
    documentsComplete: true
  },
  {
    id: "BUS-2026-002",
    businessName: "Maria's Eatery",
    businessType: "Food Service",
    owner: "Maria Santos",
    address: "Purok 1, Barangay Santiago",
    email: "maria@example.com",
    contact: "0918-234-5678",
    status: "approved",
    date: "April 20, 2026",
    documentsComplete: true
  },
  {
    id: "BUS-2026-003",
    businessName: "Pedro's Hardware",
    businessType: "Retail",
    owner: "Pedro Reyes",
    address: "Purok 2, Barangay Santiago",
    email: "pedro@example.com",
    contact: "0919-345-6789",
    status: "pending",
    date: "April 28, 2026",
    documentsComplete: false,
    missingDocs: ["DTI Registration", "Fire Safety Certificate"]
  },
  {
    id: "BUS-2026-004",
    businessName: "Ana's Beauty Salon",
    businessType: "Services",
    owner: "Ana Garcia",
    address: "Purok 4, Barangay Santiago",
    email: "ana@example.com",
    contact: "0920-456-7890",
    status: "rejected",
    date: "April 15, 2026",
    documentsComplete: true,
    remarks: "Location not zoned for commercial use"
  },
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

// Document Header Component with Logos
function DocumentHeader() {
  return (
    <div className="flex items-center justify-between mb-4 p-4 border-b">
      <Image src="/images/santiago.jpg" alt="Barangay Santiago" width={60} height={60} className="w-12 h-12 md:w-16 md:h-16 object-contain" />
      <div className="text-center flex-1">
        <p className="text-[10px] md:text-xs text-muted-foreground">Republic of the Philippines</p>
        <p className="text-xs md:text-sm font-semibold">BARANGAY SANTIAGO</p>
        <p className="text-[10px] md:text-xs text-muted-foreground">City of Santiago, Isabela</p>
      </div>
      <Image src="/images/saz.jpg" alt="City of Santiago" width={60} height={60} className="w-12 h-12 md:w-16 md:h-16 object-contain" />
    </div>
  )
}

export default function OfficialBusinessPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBusiness, setSelectedBusiness] = useState<typeof mockBusinessApplications[0] | null>(null)
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showPrintPreview, setShowPrintPreview] = useState(false)

  const pendingCount = mockBusinessApplications.filter(b => b.status === "pending").length
  const approvedCount = mockBusinessApplications.filter(b => b.status === "approved").length
  const rejectedCount = mockBusinessApplications.filter(b => b.status === "rejected").length

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 md:space-y-6"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Business Permits</h1>
          <p className="text-xs md:text-sm text-muted-foreground">Process and manage business permit applications</p>
        </div>
        <Button variant="outline" size="sm" className="w-fit h-8 text-xs">
          <Settings className="h-3 w-3 md:mr-2" />
          <span className="hidden md:inline">Manage Requirements</span>
        </Button>
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
              <div className="rounded-lg bg-red-100 p-1.5 md:p-2">
                <XCircle className="h-4 w-4 md:h-5 md:w-5 text-red-700" />
              </div>
              <div className="text-center md:text-left">
                <p className="text-lg md:text-2xl font-bold">{rejectedCount}</p>
                <p className="text-[10px] md:text-sm text-muted-foreground">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2 md:p-4">
            <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4">
              <div className="rounded-lg bg-primary/10 p-1.5 md:p-2">
                <Building2 className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              </div>
              <div className="text-center md:text-left">
                <p className="text-lg md:text-2xl font-bold">{mockBusinessApplications.length}</p>
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
          placeholder="Search businesses..." 
          className="pl-10 h-9 md:h-10 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </motion.div>

      {/* Applications Table */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="p-3 md:p-6 pb-2 md:pb-4">
            <CardTitle className="text-base md:text-lg">Business Applications</CardTitle>
            <CardDescription className="text-xs md:text-sm">Review and process business permit applications</CardDescription>
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-0">
            <Tabs defaultValue="pending">
              <TabsList className="h-8 md:h-9 w-full justify-start overflow-x-auto">
                <TabsTrigger value="pending" className="text-xs md:text-sm px-2 md:px-3">Pending ({pendingCount})</TabsTrigger>
                <TabsTrigger value="approved" className="text-xs md:text-sm px-2 md:px-3">Approved</TabsTrigger>
                <TabsTrigger value="all" className="text-xs md:text-sm px-2 md:px-3">All Applications</TabsTrigger>
              </TabsList>
              <TabsContent value="pending" className="mt-3 md:mt-4">
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs md:text-sm">Application ID</TableHead>
                        <TableHead className="text-xs md:text-sm hidden sm:table-cell">Business Name</TableHead>
                        <TableHead className="text-xs md:text-sm hidden md:table-cell">Owner</TableHead>
                        <TableHead className="text-xs md:text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockBusinessApplications.filter(b => b.status === "pending").map((business) => (
                        <TableRow key={business.id}>
                          <TableCell className="font-medium text-xs md:text-sm py-2 md:py-4">{business.id}</TableCell>
                          <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden sm:table-cell">{business.businessName}</TableCell>
                          <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden md:table-cell">{business.owner}</TableCell>
                          <TableCell className="py-2 md:py-4">
                            <div className="flex gap-1 md:gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="h-7 md:h-8 px-2 md:px-3 text-xs"
                                onClick={() => setSelectedBusiness(business)}
                              >
                                <Eye className="h-3 w-3 md:mr-1" />
                                <span className="hidden md:inline">Review</span>
                              </Button>
                              {business.documentsComplete && (
                                <Button 
                                  size="sm"
                                  className="h-7 md:h-8 px-2 md:px-3 text-xs bg-emerald-600 hover:bg-emerald-700"
                                  onClick={() => {
                                    setSelectedBusiness(business)
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
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs md:text-sm">Application ID</TableHead>
                        <TableHead className="text-xs md:text-sm hidden sm:table-cell">Business Name</TableHead>
                        <TableHead className="text-xs md:text-sm hidden md:table-cell">Owner</TableHead>
                        <TableHead className="text-xs md:text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockBusinessApplications.filter(b => b.status === "approved").map((business) => (
                        <TableRow key={business.id}>
                          <TableCell className="font-medium text-xs md:text-sm py-2 md:py-4">{business.id}</TableCell>
                          <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden sm:table-cell">{business.businessName}</TableCell>
                          <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden md:table-cell">{business.owner}</TableCell>
                          <TableCell className="py-2 md:py-4">
                            <div className="flex gap-1 md:gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="h-7 md:h-8 px-2 md:px-3 text-xs"
                                onClick={() => setSelectedBusiness(business)}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button 
                                size="sm"
                                className="h-7 md:h-8 px-2 md:px-3 text-xs bg-emerald-600 hover:bg-emerald-700"
                                onClick={() => {
                                  setSelectedBusiness(business)
                                  setShowPrintPreview(true)
                                }}
                              >
                                <Printer className="h-3 w-3 md:mr-1" />
                                <span className="hidden md:inline">Print</span>
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
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs md:text-sm">Application ID</TableHead>
                        <TableHead className="text-xs md:text-sm hidden sm:table-cell">Business Name</TableHead>
                        <TableHead className="text-xs md:text-sm hidden md:table-cell">Owner</TableHead>
                        <TableHead className="text-xs md:text-sm">Status</TableHead>
                        <TableHead className="text-xs md:text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockBusinessApplications.map((business) => (
                        <TableRow key={business.id}>
                          <TableCell className="font-medium text-xs md:text-sm py-2 md:py-4">{business.id}</TableCell>
                          <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden sm:table-cell">{business.businessName}</TableCell>
                          <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden md:table-cell">{business.owner}</TableCell>
                          <TableCell className="py-2 md:py-4">{getStatusBadge(business.status)}</TableCell>
                          <TableCell className="py-2 md:py-4">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="h-7 md:h-8 px-2 md:px-3 text-xs"
                              onClick={() => setSelectedBusiness(business)}
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
          </CardContent>
        </Card>
      </motion.div>

      {/* Business Details Modal */}
      <Dialog open={!!selectedBusiness && !showApproveDialog && !showPrintPreview} onOpenChange={() => setSelectedBusiness(null)}>
        <DialogContent className="max-w-lg mx-4 md:mx-auto">
          <DocumentHeader />
          <DialogHeader>
            <DialogTitle className="text-base md:text-lg">Business Application Details</DialogTitle>
            <DialogDescription className="text-xs md:text-sm">
              Review business permit application
            </DialogDescription>
          </DialogHeader>
          {selectedBusiness && (
            <ScrollArea className="max-h-[50vh]">
              <div className="space-y-3 md:space-y-4 pr-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{selectedBusiness.id}</span>
                  {getStatusBadge(selectedBusiness.status)}
                </div>
                <div className="grid gap-3 grid-cols-2">
                  <div>
                    <p className="text-[10px] md:text-sm text-muted-foreground">Business Name</p>
                    <p className="font-medium text-sm">{selectedBusiness.businessName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] md:text-sm text-muted-foreground">Business Type</p>
                    <p className="font-medium text-sm">{selectedBusiness.businessType}</p>
                  </div>
                  <div>
                    <p className="text-[10px] md:text-sm text-muted-foreground">Owner</p>
                    <p className="font-medium text-sm">{selectedBusiness.owner}</p>
                  </div>
                  <div>
                    <p className="text-[10px] md:text-sm text-muted-foreground">Contact</p>
                    <p className="font-medium text-sm">{selectedBusiness.contact}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] md:text-sm text-muted-foreground">Address</p>
                    <p className="font-medium text-sm">{selectedBusiness.address}</p>
                  </div>
                </div>
                {selectedBusiness.remarks && (
                  <div className="rounded-lg bg-red-50 p-3">
                    <p className="text-xs font-medium text-red-800">Rejection Reason</p>
                    <p className="text-xs text-red-700">{selectedBusiness.remarks}</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setSelectedBusiness(null)}>Close</Button>
            {selectedBusiness?.status === "pending" && selectedBusiness.documentsComplete && (
              <>
                <Button variant="destructive" size="sm">Reject</Button>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setShowApproveDialog(true)}>Approve</Button>
              </>
            )}
            {selectedBusiness?.status === "approved" && (
              <Button size="sm" onClick={() => setShowPrintPreview(true)}>
                <Printer className="mr-2 h-3 w-3" />
                Print Permit
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent className="mx-4 md:mx-auto">
          <DocumentHeader />
          <DialogHeader>
            <DialogTitle className="text-base md:text-lg">Approve Business Permit</DialogTitle>
            <DialogDescription className="text-xs md:text-sm">
              Confirm approval and set permit details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label className="text-xs md:text-sm">Permit Fee</Label>
              <Input defaultValue="200" placeholder="Enter permit fee" className="h-8 md:h-10 text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs md:text-sm">Validity Period</Label>
              <Input type="date" className="h-8 md:h-10 text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs md:text-sm">Notes (Optional)</Label>
              <Textarea placeholder="Additional notes..." className="text-sm min-h-[60px]" />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setShowApproveDialog(false)}>Cancel</Button>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => {
              setShowApproveDialog(false)
              setSelectedBusiness(null)
            }}>
              Approve & Issue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Print Preview Dialog */}
      <Dialog open={showPrintPreview} onOpenChange={setShowPrintPreview}>
        <DialogContent className="max-w-2xl mx-4 md:mx-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-base md:text-lg">Business Clearance Preview</DialogTitle>
          </DialogHeader>
          {selectedBusiness && (
            <ScrollArea className="max-h-[60vh]">
              <div className="rounded-lg border bg-white p-4 md:p-8 text-black">
                <div className="flex items-center justify-between mb-4">
                  <Image src="/images/santiago.jpg" alt="Barangay Santiago" width={60} height={60} className="w-12 h-12 md:w-16 md:h-16 object-contain" />
                  <div className="text-center flex-1">
                    <p className="text-[10px] md:text-sm">Republic of the Philippines</p>
                    <p className="text-sm md:text-lg font-bold">BARANGAY SANTIAGO</p>
                    <p className="text-[10px] md:text-sm">City of Santiago, Isabela</p>
                  </div>
                  <Image src="/images/saz.jpg" alt="City of Santiago" width={60} height={60} className="w-12 h-12 md:w-16 md:h-16 object-contain" />
                </div>
                <div className="text-center mb-6">
                  <h2 className="text-lg md:text-xl font-bold underline">BARANGAY BUSINESS CLEARANCE</h2>
                </div>
                <div className="space-y-2 text-sm md:text-base">
                  <p>This is to certify that:</p>
                  <p className="font-bold text-center text-base md:text-lg">{selectedBusiness.businessName}</p>
                  <p className="text-center text-sm">owned and operated by</p>
                  <p className="font-bold text-center text-base md:text-lg">{selectedBusiness.owner}</p>
                  <p>located at {selectedBusiness.address} has been granted clearance to operate within this barangay.</p>
                </div>
                <div className="mt-8 flex justify-between text-sm">
                  <div className="text-center">
                    <div className="w-32 md:w-40 border-t border-black pt-1">
                      <p className="font-bold">ROBERTO BORJA</p>
                      <p className="text-xs">Barangay Captain</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-32 md:w-40 border-t border-black pt-1">
                      <p className="font-bold">Date Issued</p>
                      <p className="text-xs">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setShowPrintPreview(false)}>Close</Button>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
              <Printer className="mr-2 h-3 w-3" />
              Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
