"use client"

import { useState, useMemo } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { AlertTriangle, Plus, Clock, CheckCircle, Loader2, Search, MapPin, Calendar } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { mockBlotterReports } from "@/lib/mock-data"

const incidentTypes = [
  "Noise Complaint",
  "Property Dispute",
  "Physical Altercation",
  "Theft/Robbery",
  "Animal Complaint",
  "Vandalism",
  "Lost Item",
  "Family Dispute",
  "Other"
]

export default function ResidentBlotter() {
  const { user } = useAuth()
  const residentId = user?.residentId || ""
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [incidentType, setIncidentType] = useState("")
  const [respondentName, setRespondentName] = useState("")
  const [description, setDescription] = useState("")
  const [incidentDate, setIncidentDate] = useState("")
  const [incidentTime, setIncidentTime] = useState("")
  const [location, setLocation] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [localReports, setLocalReports] = useState(mockBlotterReports)

  // Filter blotters for this resident only
  const myBlotters = useMemo(() => 
    localReports.filter(b => b.residentId === residentId),
    [localReports, residentId]
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1000))

    const newReport = {
      id: `${Date.now()}`,
      residentId,
      complainantName: user?.fullName || "Resident",
      respondentName: respondentName || "Unknown",
      incidentType,
      description,
      incidentDate,
      incidentTime,
      location,
      status: "pending" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setLocalReports(prev => [newReport, ...prev])
    setIsDialogOpen(false)
    setIncidentType("")
    setRespondentName("")
    setDescription("")
    setIncidentDate("")
    setIncidentTime("")
    setLocation("")
    setIsSubmitting(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Resolved</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "investigating":
        return <Badge variant="outline" className="border-blue-300 text-blue-700">Investigating</Badge>
      case "dismissed":
        return <Badge variant="destructive">Dismissed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Incident Reports</h1>
          <p className="text-muted-foreground">File and track your blotter reports</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" className="gap-2">
              <AlertTriangle className="w-4 h-4" />
              Report Incident
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                File Incident Report
              </DialogTitle>
              <DialogDescription>
                Provide details about the incident for barangay records
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="incidentType">Incident Type</Label>
                <Select value={incidentType} onValueChange={setIncidentType} required>
                  <SelectTrigger id="incidentType">
                    <SelectValue placeholder="Select incident type" />
                  </SelectTrigger>
                  <SelectContent>
                    {incidentTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="respondent">Respondent Name (if known)</Label>
                <Input
                  id="respondent"
                  placeholder="Name of person involved (optional)"
                  value={respondentName}
                  onChange={(e) => setRespondentName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Incident Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Incident Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={incidentTime}
                    onChange={(e) => setIncidentTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Where did the incident occur?"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed description of the incident..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="destructive"
                  disabled={isSubmitting || !incidentType || !description || !incidentDate || !location}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Report"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold">{myBlotters.length}</div>
            <p className="text-xs text-muted-foreground">Total Reports</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-amber-600">
              {myBlotters.filter(b => b.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-blue-600">
              {myBlotters.filter(b => b.status === 'investigating').length}
            </div>
            <p className="text-xs text-muted-foreground">Investigating</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-green-600">
              {myBlotters.filter(b => b.status === 'resolved').length}
            </div>
            <p className="text-xs text-muted-foreground">Resolved</p>
          </CardContent>
        </Card>
      </div>

      {/* Blotter Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">My Incident Reports</CardTitle>
          <CardDescription>Track the status of your filed reports</CardDescription>
        </CardHeader>
        <CardContent>
          {myBlotters.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Incident Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myBlotters.map((blotter) => (
                      <TableRow key={blotter.id}>
                        <TableCell>
                          <div>
                            <span className="font-medium">{blotter.incidentType}</span>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {blotter.description}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{blotter.location}</TableCell>
                        <TableCell>
                          {format(new Date(blotter.incidentDate), 'MMM d, yyyy')}
                          {blotter.incidentTime && (
                            <span className="text-muted-foreground"> at {blotter.incidentTime}</span>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(blotter.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {myBlotters.map((blotter) => (
                  <div key={blotter.id} className="p-4 rounded-lg border bg-card">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
                        <span className="font-medium text-sm">{blotter.incidentType}</span>
                      </div>
                      {getStatusBadge(blotter.status)}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                      {blotter.description}
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {blotter.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(blotter.incidentDate), 'MMM d, yyyy')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold mb-1">No incident reports filed</h3>
              <p className="text-sm text-muted-foreground mb-4">
                File a report if you need to document an incident
              </p>
              <Button variant="destructive" onClick={() => setIsDialogOpen(true)} className="gap-2">
                <AlertTriangle className="w-4 h-4" />
                Report Incident
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
