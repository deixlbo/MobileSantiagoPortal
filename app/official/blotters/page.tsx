"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
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
import { Checkbox } from "@/components/ui/checkbox"
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

const LocationMap = dynamic(() => import("@/components/location-map"), {
  ssr: false,
  loading: () => (
    <div className="h-[240px] w-full flex items-center justify-center bg-gray-100 rounded-lg">
      <p className="text-xs text-muted-foreground">Loading map...</p>
    </div>
  )
})

const mockBlotters = [
  {
    id: "BLT-2026-001",
    type: "Noise Complaint",
    description: "Loud karaoke past 10PM in Purok 3, disturbing nearby residents.",
    location: "Purok 3, near the chapel",
    locationCoords: { lat: 15.1355, lng: 120.0462 },
    complainant: "Juan Dela Cruz",
    complainantAddress: "Purok 3, Barangay Santiago",
    respondent: "Pedro Santos",
    respondentAddress: "Purok 3, Barangay Santiago",
    status: "filed",
    date: "April 28, 2026",
    actionTaken: null,
    resolution: null,
    resolutionDate: null,
    resolutionDocument: null
  },
  {
    id: "BLT-2026-002",
    type: "Property Dispute",
    description: "Fence encroachment on neighboring lot.",
    location: "Purok 2, Lot 15",
    locationCoords: { lat: 15.1328, lng: 120.0440 },
    complainant: "Maria Santos",
    complainantAddress: "Lot 14, Purok 2",
    respondent: "Pedro Reyes",
    respondentAddress: "Lot 16, Purok 2",
    status: "processing",
    date: "April 26, 2026",
    actionTaken: "Mediation scheduled for May 2, 2026",
    resolution: null,
    resolutionDate: null,
    resolutionDocument: null
  },
  {
    id: "BLT-2026-003",
    type: "Neighborhood Dispute",
    description: "Ongoing argument about water drainage causing flooding.",
    location: "Purok 1, near the drainage canal",
    locationCoords: { lat: 15.1310, lng: 120.0432 },
    complainant: "Ana Garcia",
    complainantAddress: "Purok 1, Barangay Santiago",
    respondent: "Carlos Mendoza",
    respondentAddress: "Purok 1, Barangay Santiago",
    status: "resolved",
    date: "April 20, 2026",
    actionTaken: "Mediation conducted on April 23, 2026",
    resolution: "Both parties agreed to share the cost of installing proper drainage.",
    resolutionDate: "April 25, 2026",
    resolutionDocument: "/documents/resolution-BLT-2026-003.pdf"
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
  const [blotters, setBlotters] = useState(mockBlotters)
  const [selectedBlotter, setSelectedBlotter] = useState<typeof mockBlotters[0] | null>(null)
  const [selectedPrintBlotter, setSelectedPrintBlotter] = useState<typeof mockBlotters[0] | null>(null)
  const [showUpdateDialog, setShowUpdateDialog] = useState(false)
  const [actionTaken, setActionTaken] = useState("")
  const [resolution, setResolution] = useState("")
  const [partiesInvited, setPartiesInvited] = useState(true)

  const filteredBlotters = blotters.filter((b) =>
    b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.complainant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.respondent.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filedCount = blotters.filter(b => b.status === "filed").length
  const processingCount = blotters.filter(b => b.status === "processing").length
  const resolvedCount = blotters.filter(b => b.status === "resolved").length

  const handlePrintBlotter = (blotter: typeof mockBlotters[0]) => {
    setSelectedPrintBlotter(blotter)
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        printElementById("print-content")
        setSelectedPrintBlotter(null)
      })
    })
  }

  const handleSaveUpdate = () => {
    if (!selectedBlotter) return

    const updatedBlotters = blotters.map((blotter) => {
      if (blotter.id !== selectedBlotter.id) return blotter

      const updatedResolutionDate = resolution ?
        new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) :
        blotter.resolutionDate

      return {
        ...blotter,
        actionTaken: actionTaken || blotter.actionTaken,
        resolution: resolution || blotter.resolution,
        resolutionDate: updatedResolutionDate,
        status: resolution ? "resolved" : "processing",
        resolutionDocument: resolution ? blotter.resolutionDocument ?? `/documents/resolution-${blotter.id}.pdf` : blotter.resolutionDocument,
      }
    })

    setBlotters(updatedBlotters)
    setSelectedBlotter(updatedBlotters.find((b) => b.id === selectedBlotter.id) ?? null)
    setActionTaken("")
    setResolution("")
    setShowUpdateDialog(false)
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
                      {filteredBlotters.filter(b => b.status === "filed").map((blotter) => (
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
                      {filteredBlotters.filter(b => b.status === "processing").map((blotter) => (
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
                      {filteredBlotters.map((blotter) => (
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
                                onClick={() => handlePrintBlotter(blotter)}
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
      <Dialog open={!!selectedBlotter && !showUpdateDialog} onOpenChange={() => setSelectedBlotter(null)}>
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
            <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => selectedBlotter && handlePrintBlotter(selectedBlotter)}>
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
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
              />
            </div>
            <div className="flex items-start gap-2 pt-2">
              <Checkbox
                id="invite-parties"
                checked={partiesInvited}
                onCheckedChange={(checked) => setPartiesInvited(!!checked)}
              />
              <div className="text-xs">
                <Label htmlFor="invite-parties" className="font-medium">Invite both parties</Label>
                <p className="text-muted-foreground">Confirm the complainant and respondent are notified for mediation and resolution.</p>
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button size="sm" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700" onClick={handleSaveUpdate}>
              Save & Notify
            </Button>
            <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => setShowUpdateDialog(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedPrintBlotter && (
        <div id="print-content" className="print-only hidden">
          <div className="rounded-lg border bg-white p-8 text-black">
            <div className="text-center mb-6">
              <h2 className="text-lg md:text-xl font-bold border-y-2 border-black py-3">BLOTTER REPORT</h2>
            </div>
            <div className="grid gap-4 text-sm md:text-base">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg print:bg-white print:border print:border-gray-300">
                <div>
                  <p className="text-xs uppercase text-gray-600">Reference</p>
                  <p className="font-semibold">{selectedPrintBlotter.id}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-600">Status</p>
                  <p className="font-semibold">{selectedPrintBlotter.status}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-600">Date Filed</p>
                  <p className="font-semibold">{selectedPrintBlotter.date}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-600">Incident Type</p>
                  <p className="font-semibold">{selectedPrintBlotter.type}</p>
                </div>
              </div>
              <div className="grid gap-4 text-xs md:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <p className="text-xs uppercase text-gray-600">Complainant</p>
                    <p className="font-semibold">{selectedPrintBlotter.complainant}</p>
                    <p className="text-xs text-gray-500">{selectedPrintBlotter.complainantAddress}</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-xs uppercase text-gray-600">Respondent</p>
                    <p className="font-semibold">{selectedPrintBlotter.respondent}</p>
                    <p className="text-xs text-gray-500">{selectedPrintBlotter.respondentAddress}</p>
                  </div>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="text-xs uppercase text-gray-600">Location</p>
                  <p className="font-semibold">{selectedPrintBlotter.location}</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="text-xs uppercase text-gray-600">Description</p>
                  <p className="leading-relaxed">{selectedPrintBlotter.description}</p>
                </div>
                {selectedPrintBlotter.actionTaken && (
                  <div className="p-3 border rounded-lg">
                    <p className="text-xs uppercase text-gray-600">Action Taken</p>
                    <p>{selectedPrintBlotter.actionTaken}</p>
                  </div>
                )}
                {selectedPrintBlotter.resolution && (
                  <div className="p-3 border rounded-lg bg-emerald-50 print:bg-white print:border-gray-300">
                    <p className="text-xs uppercase text-gray-600">Resolution</p>
                    <p>{selectedPrintBlotter.resolution}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-8 pt-4 border-t text-xs text-gray-600">
              <p className="mb-1">Certified Correct:</p>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="border-b border-black h-6 mb-1" />
                  <p className="font-semibold">ROLANDO C. BORJA</p>
                  <p>Barangay Captain</p>
                </div>
                <div>
                  <div className="border-b border-black h-6 mb-1" />
                  <p className="font-semibold">Date</p>
                  <p>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 border-t pt-2 text-center text-[10px] text-gray-500">
              <p>This document is generated by the Barangay Santiago Management System</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
