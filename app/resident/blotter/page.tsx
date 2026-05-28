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
import { ScrollArea } from "@/components/ui/scroll-area"
import { LocationPicker } from "@/components/location-picker"
import { ComplaintStatusTimeline } from "@/components/complaint-status-timeline"
import { deleteBlotter } from "@/lib/blotter-utils"
import { QRCodeCanvas } from 'qrcode.react'
import { 
  AlertTriangle, 
  Plus, 
  Clock, 
  CheckCircle2, 
  MapPin,
  FileText,
  Download
} from "lucide-react"

const incidentTypes = [
  "Noise Complaint",
  "Property Dispute",
  "Physical Altercation",
  "Theft",
  "Vandalism",
  "Domestic Issue",
  "Neighborhood Dispute",
  "Other"
]

const mockBlotters = [
  {
    id: "BLT-2026-001",
    type: "Noise Complaint",
    description: "Loud karaoke past 10PM in Purok 3",
    location: "Purok 3, near the chapel",
    status: "resolved",
    filedDate: "April 20, 2026",
    investigationDate: "April 21, 2026",
    mediationScheduledDate: "April 23, 2026",
    hearingDate: "April 24, 2026",
    resolutionDate: "April 25, 2026",
    resolution: "Parties agreed to limit karaoke hours until 9PM",
    resolutionDocument: "/documents/resolution-BLT-2026-001.pdf",
    complainant: "Juan Dela Cruz",
    respondent: "Pedro Santos"
  },
  {
    id: "BLT-2026-002",
    type: "Property Dispute",
    description: "Fence encroachment on neighboring lot",
    location: "Purok 2, Lot 15",
    status: "scheduled-mediation",
    filedDate: "April 26, 2026",
    investigationDate: "April 27, 2026",
    mediationScheduledDate: "May 2, 2026",
    hearingDate: null,
    resolutionDate: null,
    resolution: null,
    resolutionDocument: null,
    complainant: "Juan Dela Cruz",
    respondent: "Maria Garcia"
  },
  {
    id: "BLT-2026-003",
    type: "Neighborhood Dispute",
    description: "Ongoing argument about water drainage",
    location: "Purok 1",
    status: "pending-review",
    filedDate: "April 28, 2026",
    investigationDate: null,
    mediationScheduledDate: null,
    hearingDate: null,
    resolutionDate: null,
    resolution: null,
    resolutionDocument: null,
    complainant: "Juan Dela Cruz",
    respondent: "Jose Reyes"
  },
]

function getStatusBadge(status: string) {
  switch (status) {
    case "pending-review":
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
          <FileText className="mr-1 h-3 w-3" />
          Pending Review
        </Badge>
      )
    case "under-investigation":
      return (
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
          <Clock className="mr-1 h-3 w-3" />
          Under Investigation
        </Badge>
      )
    case "scheduled-mediation":
      return (
        <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
          <Clock className="mr-1 h-3 w-3" />
          Scheduled for Mediation
        </Badge>
      )
    case "ongoing-hearing":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Ongoing Hearing
        </Badge>
      )
    case "resolved":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Resolved
        </Badge>
      )
    case "dismissed":
      return (
        <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
          <FileText className="mr-1 h-3 w-3" />
          Dismissed
        </Badge>
      )
    case "escalated":
      return (
        <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Escalated
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function BlotterPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showPreview, setShowPreview] = useState<typeof mockBlotters[0] | null>(null)
  const [location, setLocation] = useState("")
  const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number } | null>(null)

  const handleLocationChange = (newLocation: string, coords?: { lat: number; lng: number }) => {
    setLocation(newLocation)
    if (coords) {
      setLocationCoords(coords)
    }
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setLocation("")
    setLocationCoords(null)
  }

  const handleDeleteBlotter = async (blotterId: string) => {
    if (!confirm('Are you sure you want to delete this blotter report? This action cannot be undone.')) {
      return
    }
    
    try {
      await deleteBlotter(blotterId)
      // Remove from mock data for now
      setShowPreview(null)
      // In a real app, you would refetch the list here
    } catch (error) {
      console.error('Failed to delete blotter:', error)
      alert('Failed to delete blotter report')
    }
  }

  const handleDownloadBlotterQRCode = (blotterId: string) => {
    const canvas = document.getElementById(`blotter-qr-${blotterId}`) as HTMLCanvasElement | null
      || document.getElementById(`blotter-qr-pending-${blotterId}`) as HTMLCanvasElement | null
    if (!canvas) return
    try {
      const url = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      a.download = `${blotterId}-qr.png`
      a.click()
    } catch (e) {
      console.error('Failed to download blotter QR', e)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Blotter Reports</h1>
          <p className="text-sm text-muted-foreground">File and track incident reports</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (!open) handleDialogClose()
          else setIsDialogOpen(open)
        }}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              File Report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>File Blotter Report</DialogTitle>
              <DialogDescription>
                Report an incident to the barangay
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Incident Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select incident type" />
                  </SelectTrigger>
                  <SelectContent>
                    {incidentTypes.map((type) => (
                      <SelectItem key={type} value={type.toLowerCase().replace(" ", "-")}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date of Incident</Label>
                <Input type="date" />
              </div>

              <LocationPicker
                value={location}
                onChange={handleLocationChange}
                placeholder="e.g., Purok 3, malapit sa chapel"
              />

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  placeholder="Provide a detailed description of the incident..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Respondent Name (if known)</Label>
                <Input placeholder="Name of person involved" />
              </div>

              <div className="space-y-2">
                <Label>Respondent Address (if known)</Label>
                <Input placeholder="Address of person involved" />
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={handleDialogClose} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button onClick={handleDialogClose} className="w-full sm:w-auto">
                Submit Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Info Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4">
          <AlertTriangle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-sm sm:text-base">Filing a Blotter Report</p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Blotter reports are official records of incidents reported to the barangay. 
              After filing, officials will review and process your report. You will be notified of any updates.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">My Reports</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Track your filed incident reports</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="w-full sm:w-auto grid grid-cols-4 sm:flex">
              <TabsTrigger value="all" className="text-xs sm:text-sm">All</TabsTrigger>
              <TabsTrigger value="pending" className="text-xs sm:text-sm">Pending</TabsTrigger>
              <TabsTrigger value="processing" className="text-xs sm:text-sm">Processing</TabsTrigger>
              <TabsTrigger value="resolved" className="text-xs sm:text-sm">Closed</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <div className="space-y-3 sm:space-y-4">
                {mockBlotters.map((blotter) => (
                  <div 
                    key={blotter.id}
                    className="rounded-lg border p-3 sm:p-4 cursor-pointer transition-all hover:bg-muted/50 hover:border-primary hover:shadow-md"
                    onClick={() => setShowPreview(blotter)}
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-sm sm:text-base">{blotter.type}</span>
                        {getStatusBadge(blotter.status)}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {blotter.id} | {blotter.filedDate}
                      </p>
                      <p className="text-xs sm:text-sm">{blotter.description}</p>
                      <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {blotter.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="pending" className="mt-4">
              <div className="space-y-3 sm:space-y-4">
                {mockBlotters.filter(b => b.status === "pending-review").map((blotter) => (
                  <div 
                    key={blotter.id}
                    className="rounded-lg border p-3 sm:p-4 cursor-pointer transition-all hover:bg-muted/50 hover:border-primary hover:shadow-md"
                    onClick={() => setShowPreview(blotter)}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-sm">{blotter.type}</span>
                      {getStatusBadge(blotter.status)}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{blotter.id} | {blotter.filedDate}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="processing" className="mt-4">
              <div className="space-y-3 sm:space-y-4">
                {mockBlotters.filter(b => ["under-investigation", "scheduled-mediation", "ongoing-hearing"].includes(b.status)).map((blotter) => (
                  <div 
                    key={blotter.id}
                    className="rounded-lg border p-3 sm:p-4 cursor-pointer transition-all hover:bg-muted/50 hover:border-primary hover:shadow-md"
                    onClick={() => setShowPreview(blotter)}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-sm">{blotter.type}</span>
                      {getStatusBadge(blotter.status)}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{blotter.id} | {blotter.filedDate}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="resolved" className="mt-4">
              <div className="space-y-3 sm:space-y-4">
                {mockBlotters.filter(b => ["resolved", "dismissed", "escalated"].includes(b.status)).map((blotter) => (
                  <div 
                    key={blotter.id}
                    className="rounded-lg border p-3 sm:p-4 cursor-pointer transition-all hover:bg-muted/50 hover:border-primary hover:shadow-md"
                    onClick={() => setShowPreview(blotter)}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-sm">{blotter.type}</span>
                      {getStatusBadge(blotter.status)}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{blotter.id} | {blotter.filedDate}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Blotter Preview Modal */}
      <Dialog open={!!showPreview} onOpenChange={() => setShowPreview(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] bg-white">
          <DialogHeader>
            <DialogTitle className="text-foreground">Case Details - {showPreview?.id}</DialogTitle>
          </DialogHeader>
          {showPreview && (
            <div className="bg-white rounded-lg">
              {/* Show tabs only if resolved (has resolution) */}
              {showPreview.status === "resolved" && showPreview.resolution ? (
                <Tabs defaultValue="timeline" className="w-full">
                  <TabsList className="w-full grid grid-cols-4 bg-muted">
                    <TabsTrigger value="blotter" className="text-xs sm:text-sm">
                      <FileText className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                      Blotter Report
                    </TabsTrigger>
                    <TabsTrigger value="timeline" className="text-xs sm:text-sm">
                      <Clock className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                      Timeline
                    </TabsTrigger>
                    <TabsTrigger value="qr" className="text-xs sm:text-sm">
                      <FileText className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                      QR
                    </TabsTrigger>
                    <TabsTrigger value="resolution" className="text-xs sm:text-sm">
                      <CheckCircle2 className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                      Resolution
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="blotter" className="mt-4 space-y-4">
                    <ScrollArea className="max-h-[40vh]">
                      <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-xs text-gray-500">Reference No:</p>
                            <p className="font-medium text-gray-900">{showPreview.id}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Date Reported:</p>
                            <p className="font-medium text-gray-900">{showPreview.filedDate}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Incident Type:</p>
                            <p className="font-medium text-gray-900">{showPreview.type}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Status:</p>
                            {getStatusBadge(showPreview.status)}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Location:</p>
                          <p className="font-medium text-sm text-gray-900">{showPreview.location}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-xs text-gray-500">Complainant:</p>
                            <p className="font-medium text-gray-900">{showPreview.complainant}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Respondent:</p>
                            <p className="font-medium text-gray-900">{showPreview.respondent}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Description:</p>
                          <p className="text-sm text-gray-900">{showPreview.description}</p>
                        </div>
                      </div>
                    </ScrollArea>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setShowPreview(null)} className="flex-1">
                        Close
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="timeline" className="mt-4">
                    <ComplaintStatusTimeline
                      currentStatus={showPreview.status as any}
                      filedDate={showPreview.filedDate}
                      investigationDate={showPreview.investigationDate}
                      mediationScheduledDate={showPreview.mediationScheduledDate}
                      hearingDate={showPreview.hearingDate}
                      resolutionDate={showPreview.resolutionDate}
                    />
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" onClick={() => setShowPreview(null)} className="flex-1">
                        Close
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="qr" className="mt-4">
                    <div className="rounded-lg border p-4 bg-white space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-blue-100 p-2 text-blue-700">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">Blotter QR Code</p>
                          <p className="text-xs text-muted-foreground">Contains complaint details for verification</p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="flex flex-col items-center gap-2">
                          <div className="rounded-lg border bg-muted/30 p-3">
                            <QRCodeCanvas
                              id={`blotter-qr-${showPreview.id}`}
                              value={`Name: ${showPreview.complainant}\nComplaint #: ${showPreview.id}\nStatus: ${showPreview.status.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}\nType: ${showPreview.type}`}
                              size={140}
                              level="H"
                              includeMargin={true}
                            />
                          </div>
                        </div>
                        <div className="text-sm space-y-1 flex-1">
                          <div className="rounded border bg-slate-50 p-2">
                            <p className="text-xs text-muted-foreground">Complainant</p>
                            <p className="font-medium">{showPreview.complainant}</p>
                          </div>
                          <div className="rounded border bg-slate-50 p-2">
                            <p className="text-xs text-muted-foreground">Complaint #</p>
                            <p className="font-medium">{showPreview.id}</p>
                          </div>
                          <div className="rounded border bg-slate-50 p-2">
                            <p className="text-xs text-muted-foreground">Status</p>
                            <p className="font-medium">{showPreview.status.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                          </div>
                          <div className="rounded border bg-slate-50 p-2">
                            <p className="text-xs text-muted-foreground">Incident Type</p>
                            <p className="font-medium">{showPreview.type}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" onClick={() => handleDownloadBlotterQRCode(showPreview.id)} className="flex-1">
                        <Download className="mr-2 h-4 w-4" />
                        Download QR
                      </Button>
                      <Button variant="outline" onClick={() => setShowPreview(null)} className="flex-1">
                        Close
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="resolution" className="mt-4">
                    <ScrollArea className="max-h-[55vh]">
                      <div className="rounded-lg border bg-emerald-50 p-4 sm:p-6 space-y-4">
                        <div className="flex items-center gap-2 text-emerald-700">
                          <CheckCircle2 className="h-5 w-5" />
                          <span className="font-semibold">Case Resolved</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-xs text-emerald-600">Reference No:</p>
                            <p className="font-medium text-emerald-800">{showPreview.id}</p>
                          </div>
                          <div>
                            <p className="text-xs text-emerald-600">Resolution Date:</p>
                            <p className="font-medium text-emerald-800">{showPreview.resolutionDate}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-emerald-600 mb-1">Resolution Details:</p>
                          <p className="text-sm text-emerald-800">{showPreview.resolution}</p>
                        </div>
                      </div>
                    </ScrollArea>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" onClick={() => setShowPreview(null)} className="flex-1">
                        Close
                      </Button>
                      {showPreview.status === "pending-review" && (
                        <Button 
                          variant="destructive" 
                          onClick={() => handleDeleteBlotter(showPreview.id)}
                          className="flex-1"
                        >
                          Delete Report
                        </Button>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                /* Show only blotter report if not resolved */
                <div className="space-y-4">
                  <ScrollArea className="max-h-[40vh]">
                    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-gray-500">Reference No:</p>
                          <p className="font-medium text-gray-900">{showPreview.id}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Date Reported:</p>
                          <p className="font-medium text-gray-900">{showPreview.filedDate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Incident Type:</p>
                          <p className="font-medium text-gray-900">{showPreview.type}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Status:</p>
                          {getStatusBadge(showPreview.status)}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Location:</p>
                        <p className="font-medium text-sm text-gray-900">{showPreview.location}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-gray-500">Complainant:</p>
                          <p className="font-medium text-gray-900">{showPreview.complainant}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Respondent:</p>
                          <p className="font-medium text-gray-900">{showPreview.respondent}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Description:</p>
                        <p className="text-sm text-gray-900">{showPreview.description}</p>
                      </div>
                    </div>
                  </ScrollArea>
                  
                  {/* Timeline for non-resolved */}
                  <ComplaintStatusTimeline
                    currentStatus={showPreview.status as any}
                    filedDate={showPreview.filedDate}
                    investigationDate={showPreview.investigationDate}
                    mediationScheduledDate={showPreview.mediationScheduledDate}
                    hearingDate={showPreview.hearingDate}
                    resolutionDate={showPreview.resolutionDate}
                  />
                  
                  {/* Blotter QR Code Section */}
                  <div className="rounded-lg border p-4 bg-white space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-blue-100 p-2 text-blue-700">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Blotter QR Code</p>
                        <p className="text-xs text-muted-foreground">Contains complaint details for verification</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="flex flex-col items-center gap-2">
                        <div className="rounded-lg border bg-muted/30 p-3">
                          <QRCodeCanvas
                            id={`blotter-qr-pending-${showPreview.id}`}
                            value={`Name: ${showPreview.complainant}\nComplaint #: ${showPreview.id}\nStatus: ${showPreview.status.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}\nType: ${showPreview.type}`}
                            size={140}
                            level="H"
                            includeMargin={true}
                          />
                        </div>
                      </div>
                      <div className="text-sm space-y-1 flex-1">
                        <div className="rounded border bg-slate-50 p-2">
                          <p className="text-xs text-muted-foreground">Complainant</p>
                          <p className="font-medium">{showPreview.complainant}</p>
                        </div>
                        <div className="rounded border bg-slate-50 p-2">
                          <p className="text-xs text-muted-foreground">Complaint #</p>
                          <p className="font-medium">{showPreview.id}</p>
                        </div>
                        <div className="rounded border bg-slate-50 p-2">
                          <p className="text-xs text-muted-foreground">Status</p>
                          <p className="font-medium">{showPreview.status.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                        </div>
                        <div className="rounded border bg-slate-50 p-2">
                          <p className="text-xs text-muted-foreground">Incident Type</p>
                          <p className="font-medium">{showPreview.type}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter className="flex-col sm:flex-row gap-2">
                    {showPreview.status === "pending-review" && (
                      <Button 
                        variant="destructive" 
                        onClick={() => handleDeleteBlotter(showPreview.id)}
                        className="w-full sm:w-auto"
                      >
                        Delete Report
                      </Button>
                    )}
                    <Button variant="outline" onClick={() => handleDownloadBlotterQRCode(showPreview.id)} className="w-full sm:w-auto">
                      <Download className="mr-2 h-4 w-4" />
                      Download QR
                    </Button>
                    <Button variant="outline" onClick={() => setShowPreview(null)} className="w-full sm:w-auto">
                      Close
                    </Button>
                  </DialogFooter>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
