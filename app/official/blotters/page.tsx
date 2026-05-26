"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { printElementById } from "@/lib/utils"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { 
  Search, 
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Printer,
  FileText,
  RefreshCw,
  Calendar,
  Send,
  Users,
  FileCheck,
  RotateCcw,
  Scale,
  Download,
  History,
  Gavel,
  MessageSquare,
  ArrowRight
} from "lucide-react"
import { exportToCSV } from "@/lib/mock-data"

const LocationMap = dynamic(() => import("@/components/location-map"), {
  ssr: false,
  loading: () => (
    <div className="h-[240px] w-full flex items-center justify-center bg-muted rounded-lg">
      <p className="text-xs text-muted-foreground">Loading map...</p>
    </div>
  )
})

// Enhanced blotter data with full workflow
const initialBlotters = [
  {
    id: "BLT-2026-001",
    type: "Noise Complaint",
    description: "Loud karaoke past 10PM in Purok 3, disturbing nearby residents.",
    location: "Purok 3, near the chapel",
    locationCoords: { lat: 15.1355, lng: 120.0462 },
    complainant: "Juan Dela Cruz",
    complainantAddress: "Purok 3, Barangay Santiago",
    complainantContact: "0917-123-4567",
    respondent: "Pedro Santos",
    respondentAddress: "Purok 3, Barangay Santiago",
    respondentContact: "0918-234-5678",
    status: "filed",
    date: "April 28, 2026",
    dateOfIncident: "April 27, 2026",
    actionTaken: null,
    resolution: null,
    resolutionDate: null,
    resolutionDocument: null,
    hearingDate: null,
    summonsSent: false,
    summonsDate: null,
    mediationNotes: [],
    timeline: [
      { date: "April 28, 2026", action: "Report Filed", description: "Blotter report submitted by complainant" }
    ]
  },
  {
    id: "BLT-2026-002",
    type: "Property Dispute",
    description: "Fence encroachment on neighboring lot. Respondent allegedly moved fence 2 meters into complainant's property.",
    location: "Purok 2, Lot 15",
    locationCoords: { lat: 15.1328, lng: 120.0440 },
    complainant: "Maria Santos",
    complainantAddress: "Lot 14, Purok 2",
    complainantContact: "0919-345-6789",
    respondent: "Pedro Reyes",
    respondentAddress: "Lot 16, Purok 2",
    respondentContact: "0920-456-7890",
    status: "processing",
    date: "April 26, 2026",
    dateOfIncident: "April 25, 2026",
    actionTaken: "Mediation scheduled for May 2, 2026",
    resolution: null,
    resolutionDate: null,
    resolutionDocument: null,
    hearingDate: "May 2, 2026",
    summonsSent: true,
    summonsDate: "April 27, 2026",
    mediationNotes: [
      { date: "April 27, 2026", note: "Summons sent to both parties via barangay tanod" }
    ],
    timeline: [
      { date: "April 26, 2026", action: "Report Filed", description: "Blotter report submitted by complainant" },
      { date: "April 27, 2026", action: "Summons Sent", description: "Official summons delivered to both parties" },
      { date: "April 27, 2026", action: "Hearing Scheduled", description: "Mediation set for May 2, 2026 at 2:00 PM" }
    ]
  },
  {
    id: "BLT-2026-003",
    type: "Neighborhood Dispute",
    description: "Ongoing argument about water drainage causing flooding in complainant's property during rainy season.",
    location: "Purok 1, near the drainage canal",
    locationCoords: { lat: 15.1310, lng: 120.0432 },
    complainant: "Ana Garcia",
    complainantAddress: "Purok 1, Barangay Santiago",
    complainantContact: "0921-567-8901",
    respondent: "Carlos Mendoza",
    respondentAddress: "Purok 1, Barangay Santiago",
    respondentContact: "0922-678-9012",
    status: "resolved",
    date: "April 20, 2026",
    dateOfIncident: "April 18, 2026",
    actionTaken: "Mediation conducted on April 23, 2026",
    resolution: "Both parties agreed to share the cost of installing proper drainage. Work to be completed within 30 days.",
    resolutionDate: "April 25, 2026",
    resolutionDocument: "/documents/resolution-BLT-2026-003.pdf",
    hearingDate: "April 23, 2026",
    summonsSent: true,
    summonsDate: "April 21, 2026",
    mediationNotes: [
      { date: "April 21, 2026", note: "Summons sent to both parties" },
      { date: "April 23, 2026", note: "First mediation session conducted. Both parties present." },
      { date: "April 25, 2026", note: "Agreement reached. Settlement document signed." }
    ],
    timeline: [
      { date: "April 20, 2026", action: "Report Filed", description: "Blotter report submitted by complainant" },
      { date: "April 21, 2026", action: "Summons Sent", description: "Official summons delivered to both parties" },
      { date: "April 21, 2026", action: "Hearing Scheduled", description: "Mediation set for April 23, 2026" },
      { date: "April 23, 2026", action: "Mediation Conducted", description: "Both parties attended. Initial agreement discussed." },
      { date: "April 25, 2026", action: "Case Resolved", description: "Settlement agreement signed by both parties" }
    ]
  },
  {
    id: "BLT-2026-004",
    type: "Verbal Altercation",
    description: "Heated argument between neighbors over parking space. Threats were exchanged.",
    location: "Purok 5, Main Road",
    locationCoords: { lat: 15.1340, lng: 120.0450 },
    complainant: "Roberto Cruz",
    complainantAddress: "Purok 5, Barangay Santiago",
    complainantContact: "0923-789-0123",
    respondent: "Elena Torres",
    respondentAddress: "Purok 5, Barangay Santiago",
    respondentContact: "0924-890-1234",
    status: "filed",
    date: "April 29, 2026",
    dateOfIncident: "April 29, 2026",
    actionTaken: null,
    resolution: null,
    resolutionDate: null,
    resolutionDocument: null,
    hearingDate: null,
    summonsSent: false,
    summonsDate: null,
    mediationNotes: [],
    timeline: [
      { date: "April 29, 2026", action: "Report Filed", description: "Blotter report submitted by complainant" }
    ]
  },
  {
    id: "BLT-2026-005",
    type: "Theft",
    description: "Reported theft of motorcycle parts (side mirror, seat cover) parked in front of complainant's house.",
    location: "Purok 4, near sari-sari store",
    locationCoords: { lat: 15.1335, lng: 120.0445 },
    complainant: "Fernando Reyes",
    complainantAddress: "Purok 4, Barangay Santiago",
    complainantContact: "0925-901-2345",
    respondent: "Unknown",
    respondentAddress: "Unknown",
    respondentContact: "",
    status: "processing",
    date: "April 25, 2026",
    dateOfIncident: "April 24, 2026",
    actionTaken: "Under investigation. Coordinating with PNP.",
    resolution: null,
    resolutionDate: null,
    resolutionDocument: null,
    hearingDate: null,
    summonsSent: false,
    summonsDate: null,
    mediationNotes: [
      { date: "April 26, 2026", note: "Case referred to PNP for investigation" }
    ],
    timeline: [
      { date: "April 25, 2026", action: "Report Filed", description: "Blotter report submitted by complainant" },
      { date: "April 26, 2026", action: "Investigation Started", description: "Case referred to PNP San Antonio" }
    ]
  }
]

type Blotter = typeof initialBlotters[0]

function getStatusBadge(status: string) {
  switch (status) {
    case "resolved":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Resolved
        </Badge>
      )
    case "processing":
      return (
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
          <Clock className="mr-1 h-3 w-3" />
          Processing
        </Badge>
      )
    case "filed":
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
          <FileText className="mr-1 h-3 w-3" />
          Filed
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

export default function OfficialBlottersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [blotters, setBlotters] = useState(initialBlotters)
  const [selectedBlotter, setSelectedBlotter] = useState<Blotter | null>(null)
  const [selectedPrintBlotter, setSelectedPrintBlotter] = useState<Blotter | null>(null)
  const [showUpdateDialog, setShowUpdateDialog] = useState(false)
  const [showSummonsDialog, setShowSummonsDialog] = useState(false)
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [showResolveDialog, setShowResolveDialog] = useState(false)
  const [showReopenDialog, setShowReopenDialog] = useState(false)
  const [detailsTab, setDetailsTab] = useState("details")
  
  // Form states
  const [actionTaken, setActionTaken] = useState("")
  const [resolution, setResolution] = useState("")
  const [hearingDate, setHearingDate] = useState("")
  const [hearingTime, setHearingTime] = useState("14:00")
  const [mediationNote, setMediationNote] = useState("")
  const [reopenReason, setReopenReason] = useState("")

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

  const handlePrintBlotter = (blotter: Blotter) => {
    setSelectedPrintBlotter(blotter)
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        printElementById("print-content")
        setSelectedPrintBlotter(null)
      })
    })
  }

  const handleSendSummons = () => {
    if (!selectedBlotter) return
    
    const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    const updatedBlotters = blotters.map((b) => {
      if (b.id !== selectedBlotter.id) return b
      return {
        ...b,
        summonsSent: true,
        summonsDate: today,
        status: "processing",
        mediationNotes: [...b.mediationNotes, { date: today, note: "Official summons sent to complainant and respondent" }],
        timeline: [...b.timeline, { date: today, action: "Summons Sent", description: "Official summons delivered to both parties" }]
      }
    })
    
    setBlotters(updatedBlotters)
    setSelectedBlotter(updatedBlotters.find(b => b.id === selectedBlotter.id) || null)
    setShowSummonsDialog(false)
    toast.success("Summons sent to both parties")
  }

  const handleScheduleHearing = () => {
    if (!selectedBlotter || !hearingDate) return
    
    const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    const formattedHearingDate = new Date(hearingDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    
    const updatedBlotters = blotters.map((b) => {
      if (b.id !== selectedBlotter.id) return b
      return {
        ...b,
        hearingDate: `${formattedHearingDate} at ${hearingTime}`,
        status: "processing",
        actionTaken: `Mediation scheduled for ${formattedHearingDate} at ${hearingTime}`,
        mediationNotes: [...b.mediationNotes, { date: today, note: `Mediation hearing scheduled for ${formattedHearingDate} at ${hearingTime}` }],
        timeline: [...b.timeline, { date: today, action: "Hearing Scheduled", description: `Mediation set for ${formattedHearingDate} at ${hearingTime}` }]
      }
    })
    
    setBlotters(updatedBlotters)
    setSelectedBlotter(updatedBlotters.find(b => b.id === selectedBlotter.id) || null)
    setShowScheduleDialog(false)
    setHearingDate("")
    toast.success("Hearing scheduled successfully")
  }

  const handleAddMediationNote = () => {
    if (!selectedBlotter || !mediationNote) return
    
    const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    const updatedBlotters = blotters.map((b) => {
      if (b.id !== selectedBlotter.id) return b
      return {
        ...b,
        mediationNotes: [...b.mediationNotes, { date: today, note: mediationNote }],
        timeline: [...b.timeline, { date: today, action: "Note Added", description: mediationNote }]
      }
    })
    
    setBlotters(updatedBlotters)
    setSelectedBlotter(updatedBlotters.find(b => b.id === selectedBlotter.id) || null)
    setMediationNote("")
    toast.success("Note added to case file")
  }

  const handleResolveCase = () => {
    if (!selectedBlotter || !resolution) return
    
    const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    const updatedBlotters = blotters.map((b) => {
      if (b.id !== selectedBlotter.id) return b
      return {
        ...b,
        status: "resolved",
        resolution,
        resolutionDate: today,
        resolutionDocument: `/documents/resolution-${b.id}.pdf`,
        mediationNotes: [...b.mediationNotes, { date: today, note: `Case resolved: ${resolution}` }],
        timeline: [...b.timeline, { date: today, action: "Case Resolved", description: "Settlement agreement signed by both parties" }]
      }
    })
    
    setBlotters(updatedBlotters)
    setSelectedBlotter(updatedBlotters.find(b => b.id === selectedBlotter.id) || null)
    setShowResolveDialog(false)
    setResolution("")
    toast.success("Case marked as resolved")
  }

  const handleReopenCase = () => {
    if (!selectedBlotter || !reopenReason) return
    
    const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    const updatedBlotters = blotters.map((b) => {
      if (b.id !== selectedBlotter.id) return b
      return {
        ...b,
        status: "processing",
        resolution: null,
        resolutionDate: null,
        mediationNotes: [...b.mediationNotes, { date: today, note: `Case reopened: ${reopenReason}` }],
        timeline: [...b.timeline, { date: today, action: "Case Reopened", description: reopenReason }]
      }
    })
    
    setBlotters(updatedBlotters)
    setSelectedBlotter(updatedBlotters.find(b => b.id === selectedBlotter.id) || null)
    setShowReopenDialog(false)
    setReopenReason("")
    toast.success("Case has been reopened")
  }

  const handleExportCSV = () => {
    const exportData = blotters.map(b => ({
      Reference: b.id,
      Type: b.type,
      Status: b.status,
      DateFiled: b.date,
      DateOfIncident: b.dateOfIncident,
      Complainant: b.complainant,
      ComplainantAddress: b.complainantAddress,
      Respondent: b.respondent,
      RespondentAddress: b.respondentAddress,
      Location: b.location,
      Description: b.description,
      ActionTaken: b.actionTaken || '',
      Resolution: b.resolution || '',
      ResolutionDate: b.resolutionDate || '',
      HearingDate: b.hearingDate || ''
    }))
    exportToCSV(exportData, 'blotter_records')
    toast.success("Blotter records exported to CSV")
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
          <p className="text-xs md:text-sm text-muted-foreground">Manage incident reports and mediation cases</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExportCSV}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-100 p-2.5">
                <FileText className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <p className="text-2xl font-bold">{filedCount}</p>
                <p className="text-xs text-muted-foreground">New Cases</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-amber-100 p-2.5">
                <Clock className="h-5 w-5 text-amber-700" />
              </div>
              <div>
                <p className="text-2xl font-bold">{processingCount}</p>
                <p className="text-xs text-muted-foreground">Processing</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-100 p-2.5">
                <CheckCircle2 className="h-5 w-5 text-emerald-700" />
              </div>
              <div>
                <p className="text-2xl font-bold">{resolvedCount}</p>
                <p className="text-xs text-muted-foreground">Resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-2.5">
                <Scale className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{blotters.length}</p>
                <p className="text-xs text-muted-foreground">Total Cases</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search */}
      <motion.div variants={itemVariants} className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Search by ID, type, parties, or location..." 
          className="pl-10 h-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </motion.div>

      {/* Blotters Table */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Case Management</CardTitle>
            <CardDescription>Process and resolve incident reports through mediation</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="filed">
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="filed">New ({filedCount})</TabsTrigger>
                <TabsTrigger value="processing">Processing ({processingCount})</TabsTrigger>
                <TabsTrigger value="resolved">Resolved ({resolvedCount})</TabsTrigger>
                <TabsTrigger value="all">All Records</TabsTrigger>
              </TabsList>

              {["filed", "processing", "resolved", "all"].map((tab) => (
                <TabsContent key={tab} value={tab} className="mt-4">
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Reference</TableHead>
                          <TableHead className="hidden sm:table-cell">Type</TableHead>
                          <TableHead className="hidden md:table-cell">Parties</TableHead>
                          <TableHead className="hidden lg:table-cell">Date Filed</TableHead>
                          {tab === "all" && <TableHead>Status</TableHead>}
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBlotters
                          .filter(b => tab === "all" ? true : b.status === tab)
                          .map((blotter) => (
                          <TableRow key={blotter.id}>
                            <TableCell className="font-medium">{blotter.id}</TableCell>
                            <TableCell className="hidden sm:table-cell">{blotter.type}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="text-sm">
                                <p>{blotter.complainant}</p>
                                <p className="text-muted-foreground text-xs">vs {blotter.respondent}</p>
                              </div>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell text-sm">{blotter.date}</TableCell>
                            {tab === "all" && <TableCell>{getStatusBadge(blotter.status)}</TableCell>}
                            <TableCell>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    setSelectedBlotter(blotter)
                                    setDetailsTab("details")
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {blotter.status !== "resolved" && (
                                  <Button 
                                    size="sm"
                                    className="bg-primary hover:bg-primary/90"
                                    onClick={() => {
                                      setSelectedBlotter(blotter)
                                      setDetailsTab("actions")
                                    }}
                                  >
                                    <Gavel className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handlePrintBlotter(blotter)}
                                >
                                  <Printer className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredBlotters.filter(b => tab === "all" ? true : b.status === tab).length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                              No records found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* Blotter Details Modal */}
      <Dialog open={!!selectedBlotter && !showSummonsDialog && !showScheduleDialog && !showResolveDialog && !showReopenDialog} onOpenChange={() => setSelectedBlotter(null)}>
        <DialogContent className="w-[95vw] max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-lg">{selectedBlotter?.id}</DialogTitle>
                <DialogDescription>{selectedBlotter?.type}</DialogDescription>
              </div>
              {selectedBlotter && getStatusBadge(selectedBlotter.status)}
            </div>
          </DialogHeader>
          
          {selectedBlotter && (
            <Tabs value={detailsTab} onValueChange={setDetailsTab}>
              <TabsList className="w-full">
                <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
                <TabsTrigger value="timeline" className="flex-1">Timeline</TabsTrigger>
                <TabsTrigger value="actions" className="flex-1">Actions</TabsTrigger>
              </TabsList>
              
              <ScrollArea className="max-h-[50vh] mt-4">
                <TabsContent value="details" className="space-y-4 pr-4">
                  {/* Parties */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl bg-blue-50 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <p className="text-xs font-semibold text-blue-800">COMPLAINANT</p>
                      </div>
                      <p className="font-medium">{selectedBlotter.complainant}</p>
                      <p className="text-xs text-muted-foreground">{selectedBlotter.complainantAddress}</p>
                      <p className="text-xs text-blue-600 mt-1">{selectedBlotter.complainantContact}</p>
                    </div>
                    <div className="rounded-xl bg-red-50 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-red-600" />
                        <p className="text-xs font-semibold text-red-800">RESPONDENT</p>
                      </div>
                      <p className="font-medium">{selectedBlotter.respondent}</p>
                      <p className="text-xs text-muted-foreground">{selectedBlotter.respondentAddress}</p>
                      <p className="text-xs text-red-600 mt-1">{selectedBlotter.respondentContact}</p>
                    </div>
                  </div>
                  
                  {/* Incident Details */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Date of Incident</p>
                        <p className="text-sm font-medium">{selectedBlotter.dateOfIncident}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Date Reported</p>
                        <p className="text-sm font-medium">{selectedBlotter.date}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="text-sm font-medium">{selectedBlotter.location}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Description</p>
                      <p className="text-sm">{selectedBlotter.description}</p>
                    </div>
                  </div>
                  
                  {/* Status Info */}
                  {selectedBlotter.hearingDate && (
                    <div className="rounded-xl bg-amber-50 p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-amber-600" />
                        <p className="text-sm font-medium text-amber-800">Hearing Scheduled: {selectedBlotter.hearingDate}</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedBlotter.resolution && (
                    <div className="rounded-xl bg-emerald-50 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <p className="text-xs font-semibold text-emerald-800">RESOLUTION</p>
                      </div>
                      <p className="text-sm text-emerald-700">{selectedBlotter.resolution}</p>
                      <p className="text-xs text-emerald-600 mt-2">Resolved on {selectedBlotter.resolutionDate}</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="timeline" className="pr-4">
                  <div className="space-y-4">
                    {selectedBlotter.timeline.map((event, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`h-3 w-3 rounded-full ${idx === selectedBlotter.timeline.length - 1 ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                          {idx < selectedBlotter.timeline.length - 1 && <div className="w-0.5 flex-1 bg-muted-foreground/20" />}
                        </div>
                        <div className="pb-4">
                          <p className="text-xs text-muted-foreground">{event.date}</p>
                          <p className="font-medium text-sm">{event.action}</p>
                          <p className="text-xs text-muted-foreground">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Mediation Notes */}
                  {selectedBlotter.mediationNotes.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Case Notes
                      </h4>
                      <div className="space-y-2">
                        {selectedBlotter.mediationNotes.map((note, idx) => (
                          <div key={idx} className="rounded-lg bg-muted/50 p-3">
                            <p className="text-xs text-muted-foreground">{note.date}</p>
                            <p className="text-sm">{note.note}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="actions" className="space-y-4 pr-4">
                  {selectedBlotter.status !== "resolved" ? (
                    <>
                      {/* Workflow Actions */}
                      <div className="grid gap-3">
                        {!selectedBlotter.summonsSent && (
                          <Button 
                            variant="outline" 
                            className="justify-start h-auto py-3"
                            onClick={() => setShowSummonsDialog(true)}
                          >
                            <Send className="mr-3 h-5 w-5 text-blue-600" />
                            <div className="text-left">
                              <p className="font-medium">Send Summons</p>
                              <p className="text-xs text-muted-foreground">Notify both parties to appear for mediation</p>
                            </div>
                          </Button>
                        )}
                        
                        {selectedBlotter.summonsSent && !selectedBlotter.hearingDate && (
                          <Button 
                            variant="outline" 
                            className="justify-start h-auto py-3"
                            onClick={() => setShowScheduleDialog(true)}
                          >
                            <Calendar className="mr-3 h-5 w-5 text-amber-600" />
                            <div className="text-left">
                              <p className="font-medium">Schedule Hearing</p>
                              <p className="text-xs text-muted-foreground">Set date and time for mediation session</p>
                            </div>
                          </Button>
                        )}
                        
                        <Button 
                          variant="outline" 
                          className="justify-start h-auto py-3"
                          onClick={() => setShowResolveDialog(true)}
                        >
                          <FileCheck className="mr-3 h-5 w-5 text-emerald-600" />
                          <div className="text-left">
                            <p className="font-medium">Mark as Resolved</p>
                            <p className="text-xs text-muted-foreground">Record settlement agreement</p>
                          </div>
                        </Button>
                      </div>
                      
                      {/* Add Note */}
                      <div className="border-t pt-4">
                        <Label className="text-sm">Add Case Note</Label>
                        <div className="flex gap-2 mt-2">
                          <Textarea 
                            placeholder="Enter mediation notes, observations, etc..."
                            className="min-h-[80px]"
                            value={mediationNote}
                            onChange={(e) => setMediationNote(e.target.value)}
                          />
                        </div>
                        <Button 
                          size="sm" 
                          className="mt-2"
                          disabled={!mediationNote}
                          onClick={handleAddMediationNote}
                        >
                          Add Note
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div className="rounded-xl bg-emerald-50 p-4 text-center">
                        <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                        <p className="font-medium text-emerald-800">Case Resolved</p>
                        <p className="text-sm text-emerald-600">{selectedBlotter.resolutionDate}</p>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="w-full justify-center"
                        onClick={() => setShowReopenDialog(true)}
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reopen Case
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </ScrollArea>
            </Tabs>
          )}
          
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={() => selectedBlotter && handlePrintBlotter(selectedBlotter)}>
              <Printer className="mr-2 h-4 w-4" />
              Print Report
            </Button>
            <Button variant="outline" onClick={() => setSelectedBlotter(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Summons Dialog */}
      <Dialog open={showSummonsDialog} onOpenChange={setShowSummonsDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Summons</DialogTitle>
            <DialogDescription>
              Official summons will be sent to both parties
            </DialogDescription>
          </DialogHeader>
          {selectedBlotter && (
            <div className="space-y-4 py-4">
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-sm font-medium">Complainant</p>
                <p className="text-sm">{selectedBlotter.complainant}</p>
                <p className="text-xs text-muted-foreground">{selectedBlotter.complainantAddress}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-sm font-medium">Respondent</p>
                <p className="text-sm">{selectedBlotter.respondent}</p>
                <p className="text-xs text-muted-foreground">{selectedBlotter.respondentAddress}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Both parties will be notified to appear at the Barangay Hall for mediation.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSummonsDialog(false)}>Cancel</Button>
            <Button onClick={handleSendSummons}>
              <Send className="mr-2 h-4 w-4" />
              Send Summons
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Hearing Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Mediation Hearing</DialogTitle>
            <DialogDescription>
              Set the date and time for the mediation session
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Hearing Date</Label>
              <Input 
                type="date" 
                value={hearingDate}
                onChange={(e) => setHearingDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label>Hearing Time</Label>
              <Select value={hearingTime} onValueChange={setHearingTime}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">9:00 AM</SelectItem>
                  <SelectItem value="10:00">10:00 AM</SelectItem>
                  <SelectItem value="14:00">2:00 PM</SelectItem>
                  <SelectItem value="15:00">3:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>Cancel</Button>
            <Button onClick={handleScheduleHearing} disabled={!hearingDate}>
              <Calendar className="mr-2 h-4 w-4" />
              Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resolve Case Dialog */}
      <Dialog open={showResolveDialog} onOpenChange={setShowResolveDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Resolve Case</DialogTitle>
            <DialogDescription>
              Record the settlement agreement for this case
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Resolution Details</Label>
              <Textarea 
                placeholder="Describe the settlement agreement reached by both parties..."
                className="min-h-[120px]"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResolveDialog(false)}>Cancel</Button>
            <Button onClick={handleResolveCase} disabled={!resolution} className="bg-emerald-600 hover:bg-emerald-700">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Mark Resolved
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reopen Case Dialog */}
      <Dialog open={showReopenDialog} onOpenChange={setShowReopenDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reopen Case</DialogTitle>
            <DialogDescription>
              Provide a reason for reopening this resolved case
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Reason for Reopening</Label>
              <Textarea 
                placeholder="Why is this case being reopened?"
                className="min-h-[100px]"
                value={reopenReason}
                onChange={(e) => setReopenReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReopenDialog(false)}>Cancel</Button>
            <Button onClick={handleReopenCase} disabled={!reopenReason} variant="destructive">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reopen Case
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Print Content */}
      {selectedPrintBlotter && (
        <div id="print-content" className="print-only hidden">
          <div className="rounded-lg border bg-white p-8 text-black">
            <div className="flex items-center justify-between mb-6 pb-4 border-b">
              <Image src="/images/santiagologo.jpg" alt="Barangay Santiago" width={60} height={60} className="w-16 h-16 rounded-full object-cover" />
              <div className="text-center flex-1 px-4">
                <p className="text-xs">Republic of the Philippines</p>
                <p className="text-xs">Province of Zambales</p>
                <p className="text-xs">Municipality of San Antonio</p>
                <p className="font-bold">BARANGAY SANTIAGO</p>
              </div>
              <Image src="/images/saz.jpg" alt="Municipality" width={60} height={60} className="w-16 h-16 rounded-full object-cover" />
            </div>
            
            <h2 className="text-xl font-bold text-center border-y-2 border-black py-3 mb-6">BLOTTER REPORT</h2>
            
            <div className="grid gap-4 text-sm">
              <div className="grid grid-cols-2 gap-4 p-3 border rounded">
                <div>
                  <p className="text-xs uppercase text-gray-600">Reference</p>
                  <p className="font-semibold">{selectedPrintBlotter.id}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-600">Status</p>
                  <p className="font-semibold capitalize">{selectedPrintBlotter.status}</p>
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
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border rounded">
                  <p className="text-xs uppercase text-gray-600">Complainant</p>
                  <p className="font-semibold">{selectedPrintBlotter.complainant}</p>
                  <p className="text-xs text-gray-500">{selectedPrintBlotter.complainantAddress}</p>
                </div>
                <div className="p-3 border rounded">
                  <p className="text-xs uppercase text-gray-600">Respondent</p>
                  <p className="font-semibold">{selectedPrintBlotter.respondent}</p>
                  <p className="text-xs text-gray-500">{selectedPrintBlotter.respondentAddress}</p>
                </div>
              </div>
              
              <div className="p-3 border rounded">
                <p className="text-xs uppercase text-gray-600">Location of Incident</p>
                <p className="font-semibold">{selectedPrintBlotter.location}</p>
              </div>
              
              <div className="p-3 border rounded">
                <p className="text-xs uppercase text-gray-600">Description</p>
                <p className="leading-relaxed">{selectedPrintBlotter.description}</p>
              </div>
              
              {selectedPrintBlotter.actionTaken && (
                <div className="p-3 border rounded">
                  <p className="text-xs uppercase text-gray-600">Action Taken</p>
                  <p>{selectedPrintBlotter.actionTaken}</p>
                </div>
              )}
              
              {selectedPrintBlotter.resolution && (
                <div className="p-3 border rounded bg-gray-50">
                  <p className="text-xs uppercase text-gray-600">Resolution</p>
                  <p>{selectedPrintBlotter.resolution}</p>
                  <p className="text-xs text-gray-500 mt-1">Resolved on {selectedPrintBlotter.resolutionDate}</p>
                </div>
              )}
            </div>
            
            <div className="mt-8 pt-4 border-t">
              <p className="text-xs mb-4">Certified Correct:</p>
              <div className="grid grid-cols-2 gap-8 text-center mt-8">
                <div>
                  <div className="border-b border-black w-48 mx-auto mb-1" />
                  <p className="font-semibold">ROLANDO C. BORJA</p>
                  <p className="text-xs">Barangay Captain</p>
                </div>
                <div>
                  <div className="border-b border-black w-48 mx-auto mb-1" />
                  <p className="font-semibold">APRIL JOY C. CANO</p>
                  <p className="text-xs">Barangay Secretary</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-2 border-t text-center text-[10px] text-gray-500">
              <p>Generated by Barangay Santiago Management System on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
