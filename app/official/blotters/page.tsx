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
import { printElementById } from "@/lib/utils"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Search, 
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Printer,
  FileText,
  RefreshCw
} from "lucide-react"

const mockBlotters = [
  {
    id: "BLT-2026-001",
    type: "Noise Complaint",
    description: "Loud karaoke past 10PM in Purok 3, disturbing nearby residents.",
    location: "Purok 3, near the chapel",
    complainant: "Juan Dela Cruz",
    complainantAddress: "Purok 3, Barangay Santiago",
    respondent: "Unknown",
    respondentAddress: "Purok 3",
    status: "filed",
    date: "April 28, 2026",
    actionTaken: null,
    resolution: null
  },
  {
    id: "BLT-2026-002",
    type: "Property Dispute",
    description: "Fence encroachment on neighboring lot.",
    location: "Purok 2, Lot 15",
    complainant: "Maria Santos",
    complainantAddress: "Lot 14, Purok 2",
    respondent: "Pedro Reyes",
    respondentAddress: "Lot 16, Purok 2",
    status: "processing",
    date: "April 26, 2026",
    actionTaken: "Mediation scheduled for May 2, 2026",
    resolution: null
  },
  {
    id: "BLT-2026-003",
    type: "Neighborhood Dispute",
    description: "Ongoing argument about water drainage causing flooding.",
    location: "Purok 1",
    complainant: "Ana Garcia",
    complainantAddress: "Purok 1, Barangay Santiago",
    respondent: "Carlos Mendoza",
    respondentAddress: "Purok 1, Barangay Santiago",
    status: "resolved",
    date: "April 20, 2026",
    actionTaken: "Mediation conducted on April 23, 2026",
    resolution: "Both parties agreed to share the cost of installing proper drainage."
  },
]

function getStatusBadge(status: string) {
  switch (status) {
    case "resolved":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-[10px] md:text-xs">
          <CheckCircle2 className="mr-0.5 md:mr-1 h-2.5 w-2.5 md:h-3 md:w-3" />
          <span className="hidden sm:inline">Resolved</span>
          <span className="sm:hidden">Done</span>
        </Badge>
      )
    case "processing":
      return (
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-[10px] md:text-xs">
          <Clock className="mr-0.5 md:mr-1 h-2.5 w-2.5 md:h-3 md:w-3" />
          <span className="hidden sm:inline">Processing</span>
          <span className="sm:hidden">In Progress</span>
        </Badge>
      )
    case "filed":
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-[10px] md:text-xs">
          <FileText className="mr-0.5 md:mr-1 h-2.5 w-2.5 md:h-3 md:w-3" />
          <span className="hidden sm:inline">Filed</span>
          <span className="sm:hidden">New</span>
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
function DocumentHeader({ printOnly = false }: { printOnly?: boolean }) {
  return (
    <div className={`flex items-center justify-between mb-4 p-4 border-b ${printOnly ? 'hidden print:flex' : ''}`}>
      <Image src="/images/santiagologo.jpg" alt="Barangay Santiago" width={60} height={60} className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover shrink-0" />
      <div className="text-center flex-1 px-2">
        <p className="text-[10px] md:text-xs text-muted-foreground print:text-black">Republic of the Philippines</p>
        <p className="text-[10px] md:text-xs text-muted-foreground print:text-black">Province of Zambales</p>
        <p className="text-[10px] md:text-xs text-muted-foreground print:text-black">Municipality of San Antonio</p>
        <p className="text-xs md:text-sm font-semibold print:text-black">Barangay Santiago</p>
      </div>
      <Image src="/images/saz.jpg" alt="Municipality" width={60} height={60} className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover shrink-0" />
    </div>
  )
}

export default function OfficialBlottersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBlotter, setSelectedBlotter] = useState<typeof mockBlotters[0] | null>(null)
  const [showUpdateDialog, setShowUpdateDialog] = useState(false)
  const [showPrintPreview, setShowPrintPreview] = useState(false)

  const filedCount = mockBlotters.filter(b => b.status === "filed").length
  const processingCount = mockBlotters.filter(b => b.status === "processing").length
  const resolvedCount = mockBlotters.filter(b => b.status === "resolved").length

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 md:space-y-6"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Blotter Records</h1>
          <p className="text-xs md:text-sm text-muted-foreground">Manage and process incident reports</p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-4 gap-2 md:gap-4">
        <Card>
          <CardContent className="p-2 md:p-4">
            <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4">
              <div className="rounded-lg bg-blue-100 p-1.5 md:p-2">
                <FileText className="h-4 w-4 md:h-5 md:w-5 text-blue-700" />
              </div>
              <div className="text-center md:text-left">
                <p className="text-lg md:text-2xl font-bold">{filedCount}</p>
                <p className="text-[10px] md:text-sm text-muted-foreground">New</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2 md:p-4">
            <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4">
              <div className="rounded-lg bg-amber-100 p-1.5 md:p-2">
                <Clock className="h-4 w-4 md:h-5 md:w-5 text-amber-700" />
              </div>
              <div className="text-center md:text-left">
                <p className="text-lg md:text-2xl font-bold">{processingCount}</p>
                <p className="text-[10px] md:text-sm text-muted-foreground">Processing</p>
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
                <p className="text-lg md:text-2xl font-bold">{resolvedCount}</p>
                <p className="text-[10px] md:text-sm text-muted-foreground">Resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2 md:p-4">
            <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4">
              <div className="rounded-lg bg-primary/10 p-1.5 md:p-2">
                <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              </div>
              <div className="text-center md:text-left">
                <p className="text-lg md:text-2xl font-bold">{mockBlotters.length}</p>
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
          placeholder="Search blotter records..." 
          className="pl-10 h-9 md:h-10 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </motion.div>

      {/* Blotters Table */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="p-3 md:p-6 pb-2 md:pb-4">
            <CardTitle className="text-base md:text-lg">Blotter Records</CardTitle>
            <CardDescription className="text-xs md:text-sm">Process and resolve incident reports</CardDescription>
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-0">
            <Tabs defaultValue="filed">
              <TabsList className="h-8 md:h-9 w-full justify-start overflow-x-auto">
                <TabsTrigger value="filed" className="text-xs md:text-sm px-2 md:px-3">New ({filedCount})</TabsTrigger>
                <TabsTrigger value="processing" className="text-xs md:text-sm px-2 md:px-3">Processing ({processingCount})</TabsTrigger>
                <TabsTrigger value="all" className="text-xs md:text-sm px-2 md:px-3">All Records</TabsTrigger>
              </TabsList>
              <TabsContent value="filed" className="mt-3 md:mt-4">
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs md:text-sm">Reference</TableHead>
                        <TableHead className="text-xs md:text-sm hidden sm:table-cell">Type</TableHead>
                        <TableHead className="text-xs md:text-sm hidden md:table-cell">Complainant</TableHead>
                        <TableHead className="text-xs md:text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockBlotters.filter(b => b.status === "filed").map((blotter) => (
                        <TableRow key={blotter.id}>
                          <TableCell className="font-medium text-xs md:text-sm py-2 md:py-4">{blotter.id}</TableCell>
                          <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden sm:table-cell">{blotter.type}</TableCell>
                          <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden md:table-cell">{blotter.complainant}</TableCell>
                          <TableCell className="py-2 md:py-4">
                            <div className="flex gap-1 md:gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="h-7 md:h-8 px-2 md:px-3 text-xs"
                                onClick={() => setSelectedBlotter(blotter)}
                              >
                                <Eye className="h-3 w-3 md:mr-1" />
                                <span className="hidden md:inline">View</span>
                              </Button>
                              <Button 
                                size="sm"
                                className="h-7 md:h-8 px-2 md:px-3 text-xs bg-emerald-600 hover:bg-emerald-700"
                                onClick={() => {
                                  setSelectedBlotter(blotter)
                                  setShowUpdateDialog(true)
                                }}
                              >
                                <RefreshCw className="h-3 w-3 md:mr-1" />
                                <span className="hidden md:inline">Process</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              <TabsContent value="processing" className="mt-3 md:mt-4">
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs md:text-sm">Reference</TableHead>
                        <TableHead className="text-xs md:text-sm hidden sm:table-cell">Type</TableHead>
                        <TableHead className="text-xs md:text-sm hidden md:table-cell">Parties</TableHead>
                        <TableHead className="text-xs md:text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockBlotters.filter(b => b.status === "processing").map((blotter) => (
                        <TableRow key={blotter.id}>
                          <TableCell className="font-medium text-xs md:text-sm py-2 md:py-4">{blotter.id}</TableCell>
                          <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden sm:table-cell">{blotter.type}</TableCell>
                          <TableCell className="py-2 md:py-4 hidden md:table-cell">
                            <div className="text-xs md:text-sm">
                              <p>{blotter.complainant} vs</p>
                              <p className="text-muted-foreground">{blotter.respondent}</p>
                            </div>
                          </TableCell>
                          <TableCell className="py-2 md:py-4">
                            <div className="flex gap-1 md:gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="h-7 md:h-8 px-2 md:px-3 text-xs"
                                onClick={() => setSelectedBlotter(blotter)}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button 
                                size="sm"
                                className="h-7 md:h-8 px-2 md:px-3 text-xs bg-emerald-600 hover:bg-emerald-700"
                                onClick={() => {
                                  setSelectedBlotter(blotter)
                                  setShowUpdateDialog(true)
                                }}
                              >
                                <RefreshCw className="h-3 w-3" />
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
                        <TableHead className="text-xs md:text-sm">Reference</TableHead>
                        <TableHead className="text-xs md:text-sm hidden sm:table-cell">Type</TableHead>
                        <TableHead className="text-xs md:text-sm hidden md:table-cell">Complainant</TableHead>
                        <TableHead className="text-xs md:text-sm">Status</TableHead>
                        <TableHead className="text-xs md:text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockBlotters.map((blotter) => (
                        <TableRow key={blotter.id}>
                          <TableCell className="font-medium text-xs md:text-sm py-2 md:py-4">{blotter.id}</TableCell>
                          <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden sm:table-cell">{blotter.type}</TableCell>
                          <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden md:table-cell">{blotter.complainant}</TableCell>
                          <TableCell className="py-2 md:py-4">{getStatusBadge(blotter.status)}</TableCell>
                          <TableCell className="py-2 md:py-4">
                            <div className="flex gap-1">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="h-7 md:h-8 px-2 text-xs"
                                onClick={() => setSelectedBlotter(blotter)}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="h-7 md:h-8 px-2 text-xs"
                                onClick={() => {
                                  setSelectedBlotter(blotter)
                                  setShowPrintPreview(true)
                                }}
                              >
                                <Printer className="h-3 w-3" />
                              </Button>
                            </div>
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

      {/* Blotter Details Modal */}
      <Dialog open={!!selectedBlotter && !showUpdateDialog && !showPrintPreview} onOpenChange={() => setSelectedBlotter(null)}>
        <DialogContent className="w-[95vw] max-w-lg sm:w-full bg-white">
          <DialogHeader>
            <DialogTitle className="text-base md:text-lg">Blotter Details</DialogTitle>
            <DialogDescription className="text-xs md:text-sm">
              View complete incident report
            </DialogDescription>
          </DialogHeader>
          {selectedBlotter && (
            <ScrollArea className="max-h-[50vh]">
              <div className="space-y-3 pr-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="font-medium text-sm">{selectedBlotter.id}</span>
                  {getStatusBadge(selectedBlotter.status)}
                </div>
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                  <div>
                    <p className="text-[10px] md:text-sm text-muted-foreground">Incident Type</p>
                    <p className="font-medium text-sm">{selectedBlotter.type}</p>
                  </div>
                  <div>
                    <p className="text-[10px] md:text-sm text-muted-foreground">Date Reported</p>
                    <p className="font-medium text-sm">{selectedBlotter.date}</p>
                  </div>
                  <div>
                    <p className="text-[10px] md:text-sm text-muted-foreground">Complainant</p>
                    <p className="font-medium text-sm">{selectedBlotter.complainant}</p>
                  </div>
                  <div>
                    <p className="text-[10px] md:text-sm text-muted-foreground">Respondent</p>
                    <p className="font-medium text-sm">{selectedBlotter.respondent}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-[10px] md:text-sm text-muted-foreground">Location</p>
                    <p className="font-medium text-sm">{selectedBlotter.location}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-[10px] md:text-sm text-muted-foreground">Description</p>
                    <p className="font-medium text-sm">{selectedBlotter.description}</p>
                  </div>
                </div>
                {selectedBlotter.actionTaken && (
                  <div className="border-t pt-3">
                    <p className="text-[10px] md:text-sm text-muted-foreground">Action Taken</p>
                    <p className="text-sm">{selectedBlotter.actionTaken}</p>
                  </div>
                )}
                {selectedBlotter.resolution && (
                  <div className="rounded-lg bg-emerald-50 p-3">
                    <p className="text-xs font-medium text-emerald-800">Resolution</p>
                    <p className="text-xs text-emerald-700">{selectedBlotter.resolution}</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            {selectedBlotter?.status !== "resolved" && (
              <Button size="sm" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700" onClick={() => setShowUpdateDialog(true)}>
                Update
              </Button>
            )}
            <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => setShowPrintPreview(true)}>
              <Printer className="mr-1 h-3 w-3" />
              Print
            </Button>
            <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => setSelectedBlotter(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent className="w-[95vw] max-w-lg sm:w-full bg-white">
          <DialogHeader>
            <DialogTitle className="text-base md:text-lg">Update Blotter Status</DialogTitle>
            <DialogDescription className="text-xs md:text-sm">
              Record action taken and update case status
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label className="text-xs md:text-sm">Action Taken</Label>
              <Textarea 
                placeholder="Describe the action taken..."
                className="text-sm min-h-[60px]"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs md:text-sm">Resolution (if resolved)</Label>
              <Textarea 
                placeholder="Enter resolution details if the case is resolved..."
                className="text-sm min-h-[60px]"
              />
            </div>
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button size="sm" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700" onClick={() => {
              setShowUpdateDialog(false)
              setSelectedBlotter(null)
            }}>
              Save & Notify
            </Button>
            <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => setShowUpdateDialog(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Print Preview Dialog */}
      <Dialog open={showPrintPreview} onOpenChange={setShowPrintPreview}>
        <DialogContent className="w-[95vw] max-w-4xl sm:w-full max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base md:text-lg">Blotter Report Preview</DialogTitle>
          </DialogHeader>
          {selectedBlotter && (
            <div id="print-content" className="rounded-lg border bg-white p-3 sm:p-4 md:p-8 text-black print:p-0 print:border-0 print:bg-white print-only">
                {/* Title */}
                <div className="text-center mb-4 sm:mb-6">
                  <h2 className="text-sm sm:text-base md:text-lg font-bold border-y-2 border-black py-1 sm:py-2 print:text-black">BLOTTER REPORT</h2>
                </div>
                
                {/* Reference and Status */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3 sm:mb-4">
                  <span className="text-xs sm:text-sm font-medium print:text-black">Reference: {selectedBlotter.id}</span>
                  {getStatusBadge(selectedBlotter.status)}
                </div>
                
                {/* Details Grid */}
                <div className="space-y-2 sm:space-y-3 md:space-y-4 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4 p-2 sm:p-3 bg-gray-50 rounded-lg print:bg-white print:border print:border-gray-300">
                    <div>
                      <p className="text-gray-500 text-[9px] sm:text-[10px] uppercase print:text-gray-600">Date Filed</p>
                      <p className="font-semibold text-xs sm:text-sm print:text-black">{selectedBlotter.date}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-[9px] sm:text-[10px] uppercase print:text-gray-600">Incident Type</p>
                      <p className="font-semibold text-xs sm:text-sm print:text-black">{selectedBlotter.type}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                    <div className="p-2 sm:p-3 border rounded-lg">
                      <p className="text-gray-500 text-[9px] sm:text-[10px] uppercase print:text-gray-600">Complainant</p>
                      <p className="font-semibold text-xs sm:text-sm print:text-black">{selectedBlotter.complainant}</p>
                      <p className="text-[9px] sm:text-[10px] text-gray-500 print:text-gray-600">{selectedBlotter.complainantAddress}</p>
                    </div>
                    <div className="p-2 sm:p-3 border rounded-lg">
                      <p className="text-gray-500 text-[9px] sm:text-[10px] uppercase print:text-gray-600">Respondent</p>
                      <p className="font-semibold text-xs sm:text-sm print:text-black">{selectedBlotter.respondent}</p>
                      <p className="text-[9px] sm:text-[10px] text-gray-500 print:text-gray-600">{selectedBlotter.respondentAddress}</p>
                    </div>
                  </div>
                  
                  <div className="p-2 sm:p-3 border rounded-lg">
                    <p className="text-gray-500 text-[9px] sm:text-[10px] uppercase print:text-gray-600">Location</p>
                    <p className="font-semibold text-xs sm:text-sm print:text-black">{selectedBlotter.location}</p>
                  </div>
                  
                  <div className="border-t pt-2 sm:pt-3 md:pt-4">
                    <p className="font-bold text-[9px] sm:text-xs md:text-xs uppercase mb-1 sm:mb-2 print:text-black">Description of Incident</p>
                    <p className="leading-relaxed text-xs sm:text-sm print:text-black">{selectedBlotter.description}</p>
                  </div>
                  
                  {selectedBlotter.actionTaken && (
                    <div className="border-t pt-2 sm:pt-3 md:pt-4">
                      <p className="font-bold text-[9px] sm:text-xs uppercase mb-1 sm:mb-2 print:text-black">Action Taken</p>
                      <p className="leading-relaxed text-xs sm:text-sm print:text-black">{selectedBlotter.actionTaken}</p>
                    </div>
                  )}
                  
                  {selectedBlotter.resolution && (
                    <div className="p-2 sm:p-3 bg-emerald-50 rounded-lg border border-emerald-200 print:bg-white print:border-gray-300">
                      <p className="font-bold text-[9px] sm:text-xs uppercase mb-1 sm:mb-2 text-emerald-800 print:text-black">Resolution</p>
                      <p className="leading-relaxed text-xs sm:text-sm text-emerald-700 print:text-black">{selectedBlotter.resolution}</p>
                    </div>
                  )}
                </div>
                
                {/* Signature Section */}
                <div className="mt-6 sm:mt-8 md:mt-10 pt-4 sm:pt-6 border-t">
                  <p className="text-[8px] sm:text-[10px] text-gray-500 text-center mb-4 sm:mb-6 print:text-gray-600">Certified Correct:</p>
                  <div className="flex justify-between gap-2 sm:gap-4">
                    <div className="flex-1 text-center">
                      <div className="border-b border-black mb-1 h-6 sm:h-8" />
                      <p className="font-bold text-[9px] sm:text-xs print:text-black">ROLANDO C. BORJA</p>
                      <p className="text-[8px] sm:text-[10px] text-gray-600 print:text-gray-600">Barangay Captain</p>
                    </div>
                    <div className="flex-1 text-center">
                      <div className="border-b border-black mb-1 h-6 sm:h-8" />
                      <p className="font-bold text-[9px] sm:text-xs print:text-black">Date</p>
                      <p className="text-[8px] sm:text-[10px] text-gray-600 print:text-gray-600">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
                </div>
                
                {/* Footer */}
                <div className="mt-4 sm:mt-6 pt-2 sm:pt-4 border-t text-center text-[8px] sm:text-[10px] text-gray-500 print:text-gray-600">
                  <p>This document is generated by the Barangay Santiago Management System</p>
                </div>
            </div>
          )}
          <DialogFooter className="flex-col-reverse sm:flex-row gap-2 pt-3 sm:pt-4">
            <Button size="sm" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700" onClick={() => printElementById('print-content')}>
              <Printer className="mr-2 h-3 w-3" />
              Print
            </Button>
            <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => setShowPrintPreview(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
