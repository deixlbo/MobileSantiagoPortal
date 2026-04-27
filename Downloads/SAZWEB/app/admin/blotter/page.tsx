"use client"

import { useState, useMemo } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertTriangle, Search, CheckCircle, XCircle, MapPin, Calendar,
  Clock, FileText, Upload, Eye, Download, Trash2, ChevronLeft, ChevronRight,
  MoreHorizontal, X, Loader2
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { mockBlotterReports } from "@/lib/mock-data"

type Report = typeof mockBlotterReports[0] & {
  investigation?: {
    date: string
    investigator: string
    notes: string
    documents: Array<{ name: string; type: string; uploadedAt: string; uploadedBy: string }>
  }
  resolution?: {
    date: string
    status: string
    actions: string
    remarks: string
  }
  dismissal?: {
    reason: string
  }
  history: Array<{ date: string; time: string; action: string; by: string }>
}

export default function AdminBlotter() {
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [localReports, setLocalReports] = useState<Report[]>(
    mockBlotterReports.map(r => ({
      ...r,
      history: [
        { date: r.createdAt.split('T')[0], time: format(new Date(r.createdAt), 'hh:mm a'), action: 'Report submitted', by: r.complainantName }
      ]
    }))
  )
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [showInvestigateModal, setShowInvestigateModal] = useState(false)
  const [showResolveModal, setShowResolveModal] = useState(false)
  const [showDismissModal, setShowDismissModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form states
  const [investigationDate, setInvestigationDate] = useState("")
  const [investigator, setInvestigator] = useState("")
  const [investigationNotes, setInvestigationNotes] = useState("")
  const [resolutionDate, setResolutionDate] = useState("")
  const [resolutionStatus, setResolutionStatus] = useState("")
  const [resolutionActions, setResolutionActions] = useState("")
  const [resolutionRemarks, setResolutionRemarks] = useState("")
  const [dismissReason, setDismissReason] = useState("")

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredReports = useMemo(() => {
    return localReports
      .filter(r => filter === "all" || r.status === filter)
      .filter(r =>
        r.complainantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.incidentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.blotterNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
  }, [localReports, filter, searchTerm])

  const paginatedReports = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredReports.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredReports, currentPage])

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage)

  const stats = useMemo(() => ({
    total: localReports.length,
    pending: localReports.filter(r => r.status === 'pending').length,
    investigating: localReports.filter(r => r.status === 'investigating').length,
    resolved: localReports.filter(r => r.status === 'resolved').length
  }), [localReports])

  const resetForms = () => {
    setInvestigationDate("")
    setInvestigator("")
    setInvestigationNotes("")
    setResolutionDate("")
    setResolutionStatus("")
    setResolutionActions("")
    setResolutionRemarks("")
    setDismissReason("")
  }

  const handleInvestigate = async () => {
    if (!selectedReport) return
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 500))

    const now = new Date()
    setLocalReports(prev => prev.map(r =>
      r.id === selectedReport.id
        ? {
            ...r,
            status: 'investigating',
            investigation: {
              date: investigationDate,
              investigator,
              notes: investigationNotes,
              documents: r.investigation?.documents || []
            },
            history: [
              ...r.history,
              {
                date: format(now, 'yyyy-MM-dd'),
                time: format(now, 'hh:mm a'),
                action: 'Status changed to Investigating',
                by: 'Admin'
              },
              {
                date: format(now, 'yyyy-MM-dd'),
                time: format(now, 'hh:mm a'),
                action: `Investigation notes added by ${investigator}`,
                by: 'Admin'
              }
            ]
          }
        : r
    ))

    setShowInvestigateModal(false)
    resetForms()
    setIsSubmitting(false)
  }

  const handleResolve = async () => {
    if (!selectedReport) return
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 500))

    const now = new Date()
    setLocalReports(prev => prev.map(r =>
      r.id === selectedReport.id
        ? {
            ...r,
            status: 'resolved',
            resolution: {
              date: resolutionDate,
              status: resolutionStatus,
              actions: resolutionActions,
              remarks: resolutionRemarks
            },
            history: [
              ...r.history,
              {
                date: format(now, 'yyyy-MM-dd'),
                time: format(now, 'hh:mm a'),
                action: `Status changed to ${resolutionStatus}`,
                by: 'Admin'
              }
            ]
          }
        : r
    ))

    setShowResolveModal(false)
    resetForms()
    setIsSubmitting(false)
  }

  const handleDismiss = async () => {
    if (!selectedReport) return
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 500))

    const now = new Date()
    setLocalReports(prev => prev.map(r =>
      r.id === selectedReport.id
        ? {
            ...r,
            status: 'dismissed',
            dismissal: { reason: dismissReason },
            history: [
              ...r.history,
              {
                date: format(now, 'yyyy-MM-dd'),
                time: format(now, 'hh:mm a'),
                action: `Report dismissed: ${dismissReason}`,
                by: 'Admin'
              }
            ]
          }
        : r
    ))

    setShowDismissModal(false)
    resetForms()
    setIsSubmitting(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Resolved</Badge>
      case "pending":
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200">Pending</Badge>
      case "investigating":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">Investigating</Badge>
      case "dismissed":
        return <Badge variant="destructive">Dismissed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const openInvestigateModal = (report: Report) => {
    setSelectedReport(report)
    setActiveTab("investigation")
    setShowInvestigateModal(true)
  }

  const openResolveModal = (report: Report) => {
    setSelectedReport(report)
    setShowResolveModal(true)
  }

  const openDismissModal = (report: Report) => {
    setSelectedReport(report)
    setShowDismissModal(true)
  }

  const openViewModal = (report: Report) => {
    setSelectedReport(report)
    setActiveTab("details")
    setShowViewModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Blotter Reports</h1>
          <p className="text-muted-foreground">Manage and resolve incident reports</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter("all")}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg border flex items-center justify-center">
                <FileText className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">Total Reports</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter("pending")}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg border flex items-center justify-center bg-amber-50">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.pending}</div>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter("investigating")}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg border flex items-center justify-center bg-blue-50">
                <Search className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.investigating}</div>
                <p className="text-xs text-muted-foreground">Investigating</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter("resolved")}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg border flex items-center justify-center bg-green-50">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.resolved}</div>
                <p className="text-xs text-muted-foreground">Resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Table */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">All Incident Reports</CardTitle>
          <CardDescription>Review and process blotter reports from residents</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, type, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {paginatedReports.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Reporter</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Date Reported</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                {report.complainantName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{report.complainantName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{report.blotterNumber || report.residentId}</TableCell>
                        <TableCell>{report.incidentType}</TableCell>
                        <TableCell className="max-w-[150px] truncate">{report.location}</TableCell>
                        <TableCell>{format(new Date(report.incidentDate), 'MMM d, yyyy')}</TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openInvestigateModal(report)}
                              disabled={report.status === 'resolved' || report.status === 'dismissed'}
                            >
                              Investigate
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openResolveModal(report)}
                              disabled={report.status === 'resolved' || report.status === 'dismissed'}
                            >
                              Resolve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openDismissModal(report)}
                              disabled={report.status === 'resolved' || report.status === 'dismissed'}
                            >
                              Dismiss
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-3">
                {paginatedReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-4 rounded-lg border bg-card cursor-pointer"
                    onClick={() => openViewModal(report)}
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {report.complainantName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{report.complainantName}</p>
                          <p className="text-xs text-muted-foreground font-mono">{report.blotterNumber || report.residentId}</p>
                        </div>
                      </div>
                      {getStatusBadge(report.status)}
                    </div>
                    <div className="space-y-2 text-sm mb-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-3 h-3 text-destructive shrink-0" />
                        <span>{report.incidentType}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{report.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3 shrink-0" />
                        <span>{format(new Date(report.incidentDate), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openInvestigateModal(report)}
                        disabled={report.status === 'resolved' || report.status === 'dismissed'}
                      >
                        Investigate
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => openResolveModal(report)}
                        disabled={report.status === 'resolved' || report.status === 'dismissed'}
                      >
                        Resolve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => openDismissModal(report)}
                        disabled={report.status === 'resolved' || report.status === 'dismissed'}
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredReports.length)} of {filteredReports.length} entries
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm px-3 py-1 border rounded">{currentPage}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold mb-1">No blotter reports</h3>
              <p className="text-sm text-muted-foreground">
                {filter !== 'all' ? 'No reports match the current filter' : 'No reports have been filed yet'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Investigate Modal */}
      <Dialog open={showInvestigateModal} onOpenChange={setShowInvestigateModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Investigate Report</DialogTitle>
              {selectedReport && getStatusBadge(selectedReport.status)}
            </div>
          </DialogHeader>

          {selectedReport && (
            <>
              {/* Report Info Header */}
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg mb-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {selectedReport.complainantName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">{selectedReport.complainantName}</p>
                  <p className="text-sm text-muted-foreground font-mono">{selectedReport.blotterNumber || selectedReport.residentId}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="text-muted-foreground">Category: <span className="text-foreground">{selectedReport.incidentType}</span></p>
                  <p className="text-muted-foreground">Location: <span className="text-foreground">{selectedReport.location}</span></p>
                  <p className="text-muted-foreground">Date Reported: <span className="text-foreground">{format(new Date(selectedReport.incidentDate), 'MMM d, yyyy')}</span></p>
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="details">Case Details</TabsTrigger>
                  <TabsTrigger value="investigation">Investigation</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4 mt-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Description</Label>
                    <p className="text-sm mt-1">{selectedReport.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Incident Date</Label>
                      <p className="text-sm mt-1">{format(new Date(selectedReport.incidentDate), 'MMMM d, yyyy')}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Incident Time</Label>
                      <p className="text-sm mt-1">{selectedReport.incidentTime}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Respondent</Label>
                      <p className="text-sm mt-1">{selectedReport.respondentName || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Purpose</Label>
                      <p className="text-sm mt-1">{selectedReport.purpose}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="investigation" className="space-y-4 mt-4">
                  <p className="text-sm text-muted-foreground">Document the steps and findings of your investigation.</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="invDate">Date of Investigation</Label>
                      <Input
                        id="invDate"
                        type="date"
                        value={investigationDate}
                        onChange={(e) => setInvestigationDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="investigator">Investigated By</Label>
                      <Select value={investigator} onValueChange={setInvestigator}>
                        <SelectTrigger>
                          <SelectValue placeholder="Enter your name or officer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Jose Mendoza">Jose Mendoza</SelectItem>
                          <SelectItem value="Maria Santos">Maria Santos</SelectItem>
                          <SelectItem value="Pedro Reyes">Pedro Reyes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invNotes">Investigation Notes</Label>
                    <Textarea
                      id="invNotes"
                      placeholder="Describe your investigation process, observations, statements from involved parties, etc."
                      rows={5}
                      value={investigationNotes}
                      onChange={(e) => setInvestigationNotes(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Evidence / Attachments (optional)</Label>
                    <div
                      className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setShowUploadModal(true)}
                    >
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Click to upload</span> or drag and drop files here
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">JPG, PNG, PDF (Max. 5MB each)</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Case Documents</h4>
                      <p className="text-sm text-muted-foreground">All documents and attachments related to this case.</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setShowUploadModal(true)}>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Document
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Document Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Uploaded By</TableHead>
                        <TableHead>Date Uploaded</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>complaint_photo.jpg</TableCell>
                        <TableCell>Image</TableCell>
                        <TableCell>Admin</TableCell>
                        <TableCell>Apr 15, 2026 02:30 PM</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon"><Download className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>investigation_report.pdf</TableCell>
                        <TableCell>PDF</TableCell>
                        <TableCell>Admin</TableCell>
                        <TableCell>Apr 16, 2026 10:15 AM</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon"><Download className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="history" className="space-y-4 mt-4">
                  <div>
                    <h4 className="font-medium">Case History</h4>
                    <p className="text-sm text-muted-foreground">Track all activities and updates made on this report.</p>
                  </div>
                  <div className="relative border-l-2 border-muted-foreground/20 pl-6 ml-2 space-y-6">
                    {selectedReport.history.map((entry, index) => (
                      <div key={index} className="relative">
                        <div className="absolute -left-[29px] w-4 h-4 rounded-full bg-background border-2 border-muted-foreground/20" />
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(entry.date), 'MMM d, yyyy')} {entry.time}
                            </p>
                            <p className="font-medium text-sm">{entry.action}</p>
                            <p className="text-xs text-muted-foreground">by {entry.by}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setShowInvestigateModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleInvestigate} disabled={isSubmitting || !investigationDate || !investigator}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Save Investigation
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Resolve Modal */}
      <Dialog open={showResolveModal} onOpenChange={setShowResolveModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Resolve Report</DialogTitle>
          </DialogHeader>

          {selectedReport && (
            <>
              {/* Report Info Header */}
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg mb-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {selectedReport.complainantName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">{selectedReport.complainantName}</p>
                  <p className="text-sm text-muted-foreground font-mono">{selectedReport.blotterNumber || selectedReport.residentId}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="text-muted-foreground">Category: <span className="text-foreground">{selectedReport.incidentType}</span></p>
                  <p className="text-muted-foreground">Location: <span className="text-foreground">{selectedReport.location}</span></p>
                  <p className="text-muted-foreground">Date Reported: <span className="text-foreground">{format(new Date(selectedReport.incidentDate), 'MMM d, yyyy')}</span></p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Resolution Details</h4>
                <p className="text-sm text-muted-foreground">Provide the resolution and actions taken for this case.</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="resDate">Resolution Date</Label>
                    <Input
                      id="resDate"
                      type="date"
                      value={resolutionDate}
                      onChange={(e) => setResolutionDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="resStatus">Resolution Status</Label>
                    <Select value={resolutionStatus} onValueChange={setResolutionStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                        <SelectItem value="Referred to Higher Authority">Referred to Higher Authority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resActions">Resolution / Action Taken</Label>
                  <Textarea
                    id="resActions"
                    placeholder="Describe the resolution and actions taken."
                    rows={4}
                    value={resolutionActions}
                    onChange={(e) => setResolutionActions(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resRemarks">Remarks (optional)</Label>
                  <Textarea
                    id="resRemarks"
                    placeholder="Additional remarks..."
                    rows={2}
                    value={resolutionRemarks}
                    onChange={(e) => setResolutionRemarks(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setShowResolveModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleResolve} disabled={isSubmitting || !resolutionDate || !resolutionStatus}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Save Resolution
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Dismiss Modal */}
      <Dialog open={showDismissModal} onOpenChange={setShowDismissModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Dismiss Report</DialogTitle>
          </DialogHeader>

          {selectedReport && (
            <>
              {/* Report Info Header */}
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg mb-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {selectedReport.complainantName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">{selectedReport.complainantName}</p>
                  <p className="text-sm text-muted-foreground font-mono">{selectedReport.blotterNumber || selectedReport.residentId}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="text-muted-foreground">Category: <span className="text-foreground">{selectedReport.incidentType}</span></p>
                  <p className="text-muted-foreground">Location: <span className="text-foreground">{selectedReport.location}</span></p>
                  <p className="text-muted-foreground">Date Reported: <span className="text-foreground">{format(new Date(selectedReport.incidentDate), 'MMM d, yyyy')}</span></p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Dismiss Details</h4>
                <p className="text-sm text-muted-foreground">Provide reason for dismissing this report.</p>

                <div className="space-y-2">
                  <Label htmlFor="dismissReason">Reason for Dismissal</Label>
                  <Select value={dismissReason} onValueChange={setDismissReason}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Duplicate Report">Duplicate Report</SelectItem>
                      <SelectItem value="Insufficient Information">Insufficient Information</SelectItem>
                      <SelectItem value="Not a Barangay Concern">Not a Barangay Concern</SelectItem>
                      <SelectItem value="Invalid Report">Invalid Report</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setShowDismissModal(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDismiss} disabled={isSubmitting || !dismissReason}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Dismiss Report
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* View Report Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Blotter Report Details</DialogTitle>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4">
              {/* Report Info Header */}
              <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {selectedReport.complainantName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">{selectedReport.complainantName}</p>
                  <p className="text-sm text-muted-foreground font-mono">{selectedReport.blotterNumber || selectedReport.residentId}</p>
                </div>
                {getStatusBadge(selectedReport.status)}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Category</p>
                  <p className="font-medium">{selectedReport.incidentType}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Location</p>
                  <p className="font-medium">{selectedReport.location}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Date Reported</p>
                  <p className="font-medium">{format(new Date(selectedReport.incidentDate), 'MMM d, yyyy hh:mm a')}</p>
                </div>
              </div>

              <div>
                <p className="text-muted-foreground text-xs mb-1">Description</p>
                <p className="text-sm">{selectedReport.description}</p>
              </div>

              <div className="pt-4 border-t">
                <p className="text-muted-foreground text-xs mb-2">Attachments</p>
                <div className="bg-muted/50 rounded-lg p-8 text-center">
                  <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No attachments</p>
                </div>
              </div>

              <Button variant="outline" className="w-full" onClick={() => setShowViewModal(false)}>
                <Eye className="w-4 h-4 mr-2" />
                View All Documents
              </Button>

              <DialogFooter>
                <Button variant="outline" className="w-full" onClick={() => setShowViewModal(false)}>
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Upload Document Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Document Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="investigation">Investigation Report</SelectItem>
                  <SelectItem value="photo">Photo Evidence</SelectItem>
                  <SelectItem value="statement">Witness Statement</SelectItem>
                  <SelectItem value="other">Other Document</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>File Upload</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Click to upload</span> or drag and drop files here
                </p>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG, PDF (Max. 5MB each)</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Input placeholder="Enter description for this document..." />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowUploadModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowUploadModal(false)}>
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
