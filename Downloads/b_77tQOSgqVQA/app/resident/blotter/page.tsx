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
import { 
  AlertTriangle, 
  Plus, 
  Clock, 
  CheckCircle2, 
  MapPin,
  FileText,
  Eye
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
    resolution: "Parties agreed to limit karaoke hours until 9PM"
  },
  {
    id: "BLT-2026-002",
    type: "Property Dispute",
    description: "Fence encroachment on neighboring lot",
    location: "Purok 2, Lot 15",
    status: "processing",
    date: "April 26, 2026",
    resolution: null
  },
  {
    id: "BLT-2026-003",
    type: "Neighborhood Dispute",
    description: "Ongoing argument about water drainage",
    location: "Purok 1",
    status: "filed",
    date: "April 28, 2026",
    resolution: null
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Blotter Reports</h1>
          <p className="text-muted-foreground">File and track incident reports</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              File Report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
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
                <div className="rounded-lg border bg-muted/50 p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>Pin location on map (Optional)</span>
                  </div>
                  <div className="mt-2 aspect-video rounded bg-muted flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">Interactive Map</span>
                  </div>
                </div>
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
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>
                Submit Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Info Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex items-start gap-4 p-4">
          <AlertTriangle className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <p className="font-medium">Filing a Blotter Report</p>
            <p className="text-sm text-muted-foreground">
              Blotter reports are official records of incidents reported to the barangay. 
              After filing, officials will review and process your report. You will be notified of any updates.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">My Reports</CardTitle>
          <CardDescription>Track your filed incident reports</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="filed">Filed</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <div className="space-y-4">
                {mockBlotters.map((blotter) => (
                  <div 
                    key={blotter.id}
                    className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-start sm:justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{blotter.type}</span>
                        {getStatusBadge(blotter.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {blotter.id} | {blotter.date}
                      </p>
                      <p className="text-sm">{blotter.description}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {blotter.location}
                      </div>
                      {blotter.resolution && (
                        <div className="rounded bg-emerald-50 p-2 text-sm text-emerald-700">
                          <strong>Resolution:</strong> {blotter.resolution}
                        </div>
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowPreview(blotter)}
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="filed" className="mt-4">
              <div className="space-y-4">
                {mockBlotters.filter(b => b.status === "filed").map((blotter) => (
                  <div 
                    key={blotter.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{blotter.type}</span>
                        {getStatusBadge(blotter.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{blotter.id} | {blotter.date}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setShowPreview(blotter)}>
                      <Eye className="mr-1 h-4 w-4" />
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="processing" className="mt-4">
              <div className="space-y-4">
                {mockBlotters.filter(b => b.status === "processing").map((blotter) => (
                  <div 
                    key={blotter.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{blotter.type}</span>
                        {getStatusBadge(blotter.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{blotter.id} | {blotter.date}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setShowPreview(blotter)}>
                      <Eye className="mr-1 h-4 w-4" />
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="resolved" className="mt-4">
              <div className="space-y-4">
                {mockBlotters.filter(b => b.status === "resolved").map((blotter) => (
                  <div 
                    key={blotter.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{blotter.type}</span>
                        {getStatusBadge(blotter.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{blotter.id} | {blotter.date}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setShowPreview(blotter)}>
                      <Eye className="mr-1 h-4 w-4" />
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Blotter Preview Modal */}
      <Dialog open={!!showPreview} onOpenChange={() => setShowPreview(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Blotter Report Details</DialogTitle>
          </DialogHeader>
          {showPreview && (
            <div className="rounded-lg border bg-white p-8 text-black">
              <div className="text-center space-y-1 mb-6">
                <p className="text-sm">Republic of the Philippines</p>
                <p className="text-sm">Province of Zambales</p>
                <p className="text-sm">Municipality of San Antonio</p>
                <p className="text-sm font-semibold">Barangay Santiago</p>
              </div>
              <h2 className="text-center text-lg font-bold mb-6">BLOTTER REPORT</h2>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Reference No:</p>
                    <p className="font-medium">{showPreview.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Date Reported:</p>
                    <p className="font-medium">{showPreview.date}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600">Incident Type:</p>
                  <p className="font-medium">{showPreview.type}</p>
                </div>
                <div>
                  <p className="text-gray-600">Location:</p>
                  <p className="font-medium">{showPreview.location}</p>
                </div>
                <div>
                  <p className="text-gray-600">Description:</p>
                  <p className="font-medium">{showPreview.description}</p>
                </div>
                <div>
                  <p className="text-gray-600">Status:</p>
                  <p className="font-medium capitalize">{showPreview.status}</p>
                </div>
                {showPreview.resolution && (
                  <div className="border-t pt-4">
                    <p className="text-gray-600">Resolution:</p>
                    <p className="font-medium">{showPreview.resolution}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
