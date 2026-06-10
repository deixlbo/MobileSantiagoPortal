"use client"

import { useEffect, useState } from "react"
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
import { getCurrentUser, getProfile } from "@/lib/auth"
import { QRCodeCanvas } from 'qrcode.react'
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  MapPin,
  FileText,
  Download
} from "lucide-react"

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
  const [residentId, setResidentId] = useState<string | null>(null)
  const [incidentTypes] = useState<string[]>([
    'Theft',
    'Assault',
    'Vandalism',
    'Dispute',
    'Noise Complaint',
    'Traffic Violation',
    'Other',
  ])
  const [selectedIncidentType, setSelectedIncidentType] = useState('')
  const [otherIncidentDetails, setOtherIncidentDetails] = useState('')
  const [description, setDescription] = useState('')
  const [complainant, setComplainant] = useState('')
  const [respondent, setRespondent] = useState('')
  const [filedDate, setFiledDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [blotters, setBlotters] = useState<any[]>([])
  const [profileLoaded, setProfileLoaded] = useState(false)
  const [showPreview, setShowPreview] = useState<any | null>(null)
  const [location, setLocation] = useState("")
  const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

function CreatedByInfo({ blotter }: { blotter: any }) {
  if (!blotter) return null
  const profile = blotter.createdByProfile
  const name = profile
    ? [profile.first_name, profile.last_name].filter(Boolean).join(' ')
    : blotter.createdBy

  if (!name && !profile?.position) return null

  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <p className="text-xs text-gray-500">Filed By</p>
        <p className="font-medium text-gray-900">{name || 'Resident'}</p>
      </div>
      {profile?.position && (
        <div>
          <p className="text-xs text-gray-500">Official Position</p>
          <p className="font-medium text-gray-900">{profile.position}</p>
        </div>
      )}
    </div>
  )
}

  useEffect(() => {
    const loadResidentData = async () => {
      const { profile, error } = await getProfile()
      if (profile?.id) {
        setResidentId(profile.id)
        if (profile.first_name || profile.last_name) {
          setComplainant(`${profile.first_name || ''} ${profile.last_name || ''}`.trim())
        }
        await fetchBlotters(profile.id)
      } else {
        console.warn('Resident profile lookup failed, falling back to auth user.', error)
        const user = await getCurrentUser()
        if (user?.id) {
          setResidentId(user.id)
          await fetchBlotters(user.id)
        }
      }
      setProfileLoaded(true)
    }

    loadResidentData()
  }, [])

  const fetchBlotters = async (residentIdOverride?: string) => {
    const id = residentIdOverride || residentId
    if (!id) return

    try {
      const response = await fetch(`/api/blotters?residentId=${encodeURIComponent(id)}`)
      if (!response.ok) throw new Error('Failed to load blotter reports')
      const data = await response.json()
      setBlotters(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching blotter reports:', error)
    }
  }

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
      setShowPreview(null)
      await fetchBlotters()
    } catch (error) {
      console.error('Failed to delete blotter:', error)
      alert('Failed to delete blotter report')
    }
  }

  const handleSubmitBlotter = async () => {
    if (!selectedIncidentType) {
      alert('Please select an incident type.')
      return
    }

    if (selectedIncidentType === 'Other' && !otherIncidentDetails.trim()) {
      alert('Please provide details for the incident.')
      return
    }

    if (!description.trim()) {
      alert('Please describe the incident.')
      return
    }

    if (!complainant.trim()) {
      alert('Please enter the complainant name.')
      return
    }

    if (!residentId) {
      alert('Unable to identify resident profile. Please sign in again or refresh the page.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/blotters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          residentId,
          type: selectedIncidentType === 'Other' ? otherIncidentDetails.trim() : selectedIncidentType,
          description: description.trim(),
          location,
          complainant: complainant.trim(),
          respondent: respondent.trim() || null,
          filedDate,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit blotter report')
      }

      const newReport = data.report
      if (newReport) {
        setBlotters((prev) => [newReport, ...(prev || [])])
      }

      setIsDialogOpen(false)
      setSelectedIncidentType('')
      setOtherIncidentDetails('')
      setDescription('')
      setRespondent('')
      setLocation('')
      setLocationCoords(null)
      setFiledDate(new Date().toISOString().slice(0, 10))

      if (!newReport) {
        await fetchBlotters()
      }
    } catch (error) {
      console.error('Error submitting blotter report:', error)
      alert('Failed to submit blotter report')
    } finally {
      setIsSubmitting(false)
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
            <Button className="w-full sm:w-auto">Report Blotter</Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] sm:w-auto max-h-[95vh] overflow-auto max-w-lg">
            <DialogHeader>
              <DialogTitle>File Blotter Report</DialogTitle>
              <DialogDescription>
                Filing a Blotter Report. Blotter reports are official records of incidents reported to the barangay. After filing, officials will review and process your report. You will be notified of any updates.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Incident Type</Label>
                <Select value={selectedIncidentType} onValueChange={setSelectedIncidentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select incident type" />
                  </SelectTrigger>
                  <SelectContent>
                    {incidentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedIncidentType === 'Other' && (
                <div className="space-y-2">
                  <Label>Other Incident Details</Label>
                  <Textarea
                    placeholder="Describe the incident type in your own words"
                    value={otherIncidentDetails}
                    onChange={(e) => setOtherIncidentDetails(e.target.value)}
                    rows={3}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Date of Incident</Label>
                <Input
                  type="date"
                  value={filedDate}
                  onChange={(e) => setFiledDate(e.target.value)}
                />
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Complainant Name</Label>
                <Input
                  placeholder="Your name"
                  value={complainant}
                  onChange={(e) => setComplainant(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Respondent Name (optional)</Label>
                <Input
                  placeholder="Name of person involved"
                  value={respondent}
                  onChange={(e) => setRespondent(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={handleDialogClose} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button
                onClick={handleSubmitBlotter}
                className="w-full sm:w-auto"
                disabled={isSubmitting || !profileLoaded}
              >
                {isSubmitting ? 'Submitting...' : !profileLoaded ? 'Preparing...' : 'Submit Report'}
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
                {blotters.map((blotter) => (
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
                {blotters.filter(b => b.status === "pending-review").map((blotter) => (
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
                {blotters.filter(b => ["under-investigation", "scheduled-mediation", "ongoing-hearing"].includes(b.status)).map((blotter) => (
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
                {blotters.filter(b => ["resolved", "dismissed", "escalated"].includes(b.status)).map((blotter) => (
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
        <DialogContent className="w-[95vw] sm:w-auto max-h-[95vh] overflow-auto max-w-2xl bg-white">
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
                        <CreatedByInfo blotter={showPreview} />
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
                              value={`Name: ${showPreview.complainant}\nComplaint #: ${showPreview.id}\nStatus: ${showPreview.status.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}\nType: ${showPreview.type}`}
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
                            <p className="font-medium">{showPreview.status.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</p>
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
                      <CreatedByInfo blotter={showPreview} />
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
                            value={`Name: ${showPreview.complainant}\nComplaint #: ${showPreview.id}\nStatus: ${showPreview.status.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}\nType: ${showPreview.type}`}
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
                          <p className="font-medium">{showPreview.status.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</p>
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
