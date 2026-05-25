"use client"

import { useState, useRef } from "react"
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
import { 
  AlertTriangle, 
  Plus, 
  Clock, 
  CheckCircle2, 
  MapPin,
  FileText,
  Printer,
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
    date: "April 22, 2026",
    resolution: "Parties agreed to limit karaoke hours until 9PM",
    resolutionDate: "April 25, 2026",
    resolutionDocument: "/documents/resolution-BLT-2026-001.pdf",
    complainant: "Juan Dela Cruz",
    respondent: "Pedro Santos"
  },
  {
    id: "BLT-2026-002",
    type: "Property Dispute",
    description: "Fence encroachment on neighboring lot",
    location: "Purok 2, Lot 15",
    status: "processing",
    date: "April 26, 2026",
    resolution: null,
    resolutionDate: null,
    resolutionDocument: null,
    complainant: "Juan Dela Cruz",
    respondent: "Maria Garcia"
  },
  {
    id: "BLT-2026-003",
    type: "Neighborhood Dispute",
    description: "Ongoing argument about water drainage",
    location: "Purok 1",
    status: "filed",
    date: "April 28, 2026",
    resolution: null,
    resolutionDate: null,
    resolutionDocument: null,
    complainant: "Juan Dela Cruz",
    respondent: "Jose Reyes"
  },
]

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

export default function BlotterPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showPreview, setShowPreview] = useState<typeof mockBlotters[0] | null>(null)
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    if (!showPreview) return
    
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Blotter Report - ${showPreview.id}</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; font-size: 13px; line-height: 1.6; }
              .header { text-align: center; margin-bottom: 24px; }
              .header-row { display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 16px; }
              .logo { width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 2px solid #e5e5e5; }
              .header-text { text-align: center; }
              .header-text p { margin: 2px 0; font-size: 12px; }
              .header-text .bold { font-weight: 600; }
              .title-bar { border-top: 2px solid black; border-bottom: 2px solid black; padding: 12px; margin: 24px 0; text-align: center; font-weight: bold; font-size: 16px; }
              .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
              .label { color: #666; font-size: 11px; margin-bottom: 2px; }
              .value { font-weight: 500; }
              .section { margin-top: 20px; padding-top: 16px; border-top: 1px solid #e5e5e5; }
              .section-title { color: #666; font-size: 12px; margin-bottom: 8px; text-transform: uppercase; }
              .resolution { background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 16px; margin: 24px 0; }
              .resolution-label { color: #166534; font-size: 12px; font-weight: bold; margin-bottom: 8px; }
              .resolution-content { font-size: 14px; color: #166534; }
              .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; margin-top: 60px; text-align: center; }
              .signature-box .name { border-top: 1px solid #000; padding-top: 8px; font-weight: bold; font-size: 14px; }
              .signature-box .title { font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="header-row">
                <img src="/images/santiagologo.jpg" alt="Barangay Santiago" class="logo" />
                <div class="header-text">
                  <p>Republic of the Philippines</p>
                  <p>Province of Zambales</p>
                  <p>Municipality of San Antonio</p>
                  <p class="bold">Barangay Santiago</p>
                </div>
                <img src="/images/saz.jpg" alt="Municipal Seal" class="logo" />
              </div>
            </div>
            
            <div class="title-bar">BLOTTER REPORT</div>
            
            <div class="grid">
              <div>
                <p class="label">Reference No:</p>
                <p class="value">${showPreview.id}</p>
              </div>
              <div>
                <p class="label">Date Reported:</p>
                <p class="value">${showPreview.date}</p>
              </div>
              <div>
                <p class="label">Incident Type:</p>
                <p class="value">${showPreview.type}</p>
              </div>
              <div>
                <p class="label">Status:</p>
                <p class="value">${showPreview.status.toUpperCase()}</p>
              </div>
            </div>
            
            <div>
              <p class="label">Location:</p>
              <p class="value">${showPreview.location}</p>
            </div>
            
            <div class="grid" style="margin-top: 16px;">
              <div>
                <p class="label">Complainant:</p>
                <p class="value">${showPreview.complainant}</p>
              </div>
              <div>
                <p class="label">Respondent:</p>
                <p class="value">${showPreview.respondent}</p>
              </div>
            </div>
            
            <div class="section">
              <p class="section-title">INCIDENT DESCRIPTION</p>
              <p style="text-align: justify;">${showPreview.description}</p>
            </div>
            
            ${showPreview.resolution ? `
            <div class="resolution">
              <p class="resolution-label">RESOLUTION</p>
              <p class="resolution-content">${showPreview.resolution}</p>
              <p style="margin-top: 8px; font-size: 12px; color: #166534;">Resolved on: ${showPreview.resolutionDate}</p>
            </div>
            ` : ''}
            
            <div class="signatures">
              <div class="signature-box">
                <p class="name">${showPreview.complainant.toUpperCase()}</p>
                <p class="title">Complainant</p>
              </div>
              <div class="signature-box">
                <p class="name">ROLANDO C. BORJA</p>
                <p class="title">Punong Barangay</p>
              </div>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      
      setTimeout(() => {
        printWindow.print()
      }, 500)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Blotter Reports</h1>
          <p className="text-sm text-muted-foreground">File and track incident reports</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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

              <div className="space-y-2">
                <Label>Location</Label>
                <Input placeholder="e.g., Purok 3, near the chapel" />
              </div>

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
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">
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
              <TabsTrigger value="filed" className="text-xs sm:text-sm">Filed</TabsTrigger>
              <TabsTrigger value="processing" className="text-xs sm:text-sm">Processing</TabsTrigger>
              <TabsTrigger value="resolved" className="text-xs sm:text-sm">Resolved</TabsTrigger>
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
                        {blotter.id} | {blotter.date}
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
            <TabsContent value="filed" className="mt-4">
              <div className="space-y-3 sm:space-y-4">
                {mockBlotters.filter(b => b.status === "filed").map((blotter) => (
                  <div 
                    key={blotter.id}
                    className="rounded-lg border p-3 sm:p-4 cursor-pointer transition-all hover:bg-muted/50 hover:border-primary hover:shadow-md"
                    onClick={() => setShowPreview(blotter)}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-sm">{blotter.type}</span>
                      {getStatusBadge(blotter.status)}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{blotter.id} | {blotter.date}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="processing" className="mt-4">
              <div className="space-y-3 sm:space-y-4">
                {mockBlotters.filter(b => b.status === "processing").map((blotter) => (
                  <div 
                    key={blotter.id}
                    className="rounded-lg border p-3 sm:p-4 cursor-pointer transition-all hover:bg-muted/50 hover:border-primary hover:shadow-md"
                    onClick={() => setShowPreview(blotter)}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-sm">{blotter.type}</span>
                      {getStatusBadge(blotter.status)}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{blotter.id} | {blotter.date}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="resolved" className="mt-4">
              <div className="space-y-3 sm:space-y-4">
                {mockBlotters.filter(b => b.status === "resolved").map((blotter) => (
                  <div 
                    key={blotter.id}
                    className="rounded-lg border p-3 sm:p-4 cursor-pointer transition-all hover:bg-muted/50 hover:border-primary hover:shadow-md"
                    onClick={() => setShowPreview(blotter)}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-sm">{blotter.type}</span>
                      {getStatusBadge(blotter.status)}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{blotter.id} | {blotter.date}</p>
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
                <Tabs defaultValue="blotter" className="w-full">
                  <TabsList className="w-full grid grid-cols-2 bg-muted">
                    <TabsTrigger value="blotter" className="text-xs sm:text-sm">
                      <FileText className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                      Blotter Report
                    </TabsTrigger>
                    <TabsTrigger value="resolution" className="text-xs sm:text-sm">
                      <CheckCircle2 className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                      Resolution
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="blotter" className="mt-4">
                    <ScrollArea className="max-h-[55vh]">
                      <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-xs text-gray-500">Reference No:</p>
                            <p className="font-medium text-gray-900">{showPreview.id}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Date Reported:</p>
                            <p className="font-medium text-gray-900">{showPreview.date}</p>
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
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" onClick={() => setShowPreview(null)} className="flex-1">
                        Close
                      </Button>
                      <Button onClick={handlePrint} className="flex-1">
                        <Printer className="mr-2 h-4 w-4" />
                        Print Blotter
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
                      {showPreview.resolutionDocument && (
                        <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" asChild>
                          <a href={showPreview.resolutionDocument} download>
                            <Download className="mr-2 h-4 w-4" />
                            Download Resolution
                          </a>
                        </Button>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                /* Show only blotter report if not resolved */
                <>
                  <ScrollArea className="max-h-[60vh]">
                    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-gray-500">Reference No:</p>
                          <p className="font-medium text-gray-900">{showPreview.id}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Date Reported:</p>
                          <p className="font-medium text-gray-900">{showPreview.date}</p>
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
                  <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button variant="outline" onClick={() => setShowPreview(null)} className="w-full sm:w-auto">
                      Close
                    </Button>
                    <Button onClick={handlePrint} className="w-full sm:w-auto">
                      <Printer className="mr-2 h-4 w-4" />
                      Print Report
                    </Button>
                  </DialogFooter>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
