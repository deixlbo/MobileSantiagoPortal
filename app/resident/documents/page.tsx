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
import { FileText, Plus, Clock, CheckCircle, Loader2, XCircle, Download } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { mockDocumentRequests, mockDocumentTypes } from "@/lib/mock-data"

export default function ResidentDocuments() {
  const { user } = useAuth()
  const residentId = user?.residentId || ""
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [documentType, setDocumentType] = useState("")
  const [purpose, setPurpose] = useState("")
  const [address, setAddress] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [localRequests, setLocalRequests] = useState(mockDocumentRequests)

  // Filter documents for this resident only
  const myDocuments = useMemo(() => 
    localRequests.filter(d => d.residentId === residentId),
    [localRequests, residentId]
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1000))

    const newRequest = {
      id: `${Date.now()}`,
      residentId,
      residentName: user?.fullName || "Resident",
      documentType,
      purpose,
      address,
      notes,
      status: "pending" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setLocalRequests(prev => [newRequest, ...prev])
    setIsDialogOpen(false)
    setDocumentType("")
    setPurpose("")
    setAddress("")
    setNotes("")
    setIsSubmitting(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-amber-600" />
      case "processing":
        return <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Approved</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "processing":
        return <Badge variant="outline" className="border-blue-300 text-blue-700">Processing</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">My Documents</h1>
          <p className="text-muted-foreground">Request and track your barangay documents</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Request Document
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>New Document Request</DialogTitle>
              <DialogDescription>
                Fill out the form to request a barangay document
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="docType">Document Type</Label>
                <Select value={documentType} onValueChange={setDocumentType} required>
                  <SelectTrigger id="docType">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockDocumentTypes.filter(d => d.available).map((doc) => (
                      <SelectItem key={doc.id} value={doc.name}>
                        {doc.name} {doc.fee > 0 && `(₱${doc.fee})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose</Label>
                <Input
                  id="purpose"
                  placeholder="e.g., Employment, School Requirement"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Current Address</Label>
                <Input
                  id="address"
                  placeholder="Your complete address in the barangay"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || !documentType || !purpose || !address}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Request"
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
            <div className="text-2xl font-bold">{myDocuments.length}</div>
            <p className="text-xs text-muted-foreground">Total Requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-amber-600">
              {myDocuments.filter(d => d.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-blue-600">
              {myDocuments.filter(d => d.status === 'processing').length}
            </div>
            <p className="text-xs text-muted-foreground">Processing</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-green-600">
              {myDocuments.filter(d => d.status === 'approved').length}
            </div>
            <p className="text-xs text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
      </div>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Document Request History</CardTitle>
          <CardDescription>Track the status of your document requests</CardDescription>
        </CardHeader>
        <CardContent>
          {myDocuments.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document Type</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Date Requested</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.documentType}</TableCell>
                        <TableCell>{doc.purpose}</TableCell>
                        <TableCell>{format(new Date(doc.createdAt), 'MMM d, yyyy')}</TableCell>
                        <TableCell>{getStatusBadge(doc.status)}</TableCell>
                        <TableCell className="text-right">
                          {doc.status === 'approved' && (
                            <Button size="sm" variant="outline" className="gap-1">
                              <Download className="w-3 h-3" />
                              Download
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {myDocuments.map((doc) => (
                  <div key={doc.id} className="p-4 rounded-lg border bg-card">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary shrink-0" />
                          <span className="font-medium text-sm truncate">{doc.documentType}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{doc.purpose}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(doc.createdAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div className="shrink-0">{getStatusBadge(doc.status)}</div>
                    </div>
                    {doc.status === 'approved' && (
                      <Button size="sm" variant="outline" className="w-full mt-3 gap-1">
                        <Download className="w-3 h-3" />
                        Download Document
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold mb-1">No document requests yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start by requesting your first barangay document
              </p>
              <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Request Document
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
