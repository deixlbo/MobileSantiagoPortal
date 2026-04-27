"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { AlertTriangle, MoreHorizontal, CheckCircle, Search, XCircle, MapPin, Calendar, Clock } from "lucide-react"
import { mockBlotterReports } from "@/lib/mock-data"

export default function AdminBlotter() {
  const [filter, setFilter] = useState("all")
  const [localReports, setLocalReports] = useState(mockBlotterReports)
  const [selectedReport, setSelectedReport] = useState<typeof mockBlotterReports[0] | null>(null)

  const filteredReports = filter === "all" 
    ? localReports 
    : localReports.filter(r => r.status === filter)

  const handleStatusChange = (id: string, newStatus: string) => {
    setLocalReports(prev => prev.map(r => 
      r.id === id ? { ...r, status: newStatus, updatedAt: new Date().toISOString() } : r
    ))
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
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Blotter Reports</h1>
          <p className="text-muted-foreground">Manage and resolve incident reports</p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reports</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="investigating">Investigating</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="dismissed">Dismissed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold">{localReports.length}</div>
            <p className="text-xs text-muted-foreground">Total Reports</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-amber-600">
              {localReports.filter(r => r.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-blue-600">
              {localReports.filter(r => r.status === 'investigating').length}
            </div>
            <p className="text-xs text-muted-foreground">Investigating</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-green-600">
              {localReports.filter(r => r.status === 'resolved').length}
            </div>
            <p className="text-xs text-muted-foreground">Resolved</p>
          </CardContent>
        </Card>
      </div>

      {/* Blotter Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Incident Reports</CardTitle>
          <CardDescription>Review and process blotter reports from residents</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredReports.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Complainant</TableHead>
                      <TableHead>Incident Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report.id} className="cursor-pointer" onClick={() => setSelectedReport(report)}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{report.complainantName}</p>
                            <p className="text-xs text-muted-foreground">{report.residentId}</p>
                          </div>
                        </TableCell>
                        <TableCell>{report.incidentType}</TableCell>
                        <TableCell className="max-w-[150px] truncate">{report.location}</TableCell>
                        <TableCell>{format(new Date(report.incidentDate), 'MMM d, yyyy')}</TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleStatusChange(report.id, 'investigating')}>
                                <Search className="w-4 h-4 mr-2" />
                                Mark Investigating
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(report.id, 'resolved')}>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Mark Resolved
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(report.id, 'dismissed')}>
                                <XCircle className="w-4 h-4 mr-2" />
                                Dismiss
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-3">
                {filteredReports.map((report) => (
                  <div 
                    key={report.id} 
                    className="p-4 rounded-lg border bg-card cursor-pointer"
                    onClick={() => setSelectedReport(report)}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="font-medium text-sm">{report.complainantName}</p>
                        <p className="text-xs text-muted-foreground">{report.residentId}</p>
                      </div>
                      {getStatusBadge(report.status)}
                    </div>
                    <div className="space-y-1 text-sm mb-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-3 h-3 text-destructive" />
                        {report.incidentType}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {report.location}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(report.incidentDate), 'MMM d, yyyy')}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStatusChange(report.id, 'investigating')}
                      >
                        Investigate
                      </Button>
                      <Button 
                        size="sm" 
                        variant="default"
                        onClick={() => handleStatusChange(report.id, 'resolved')}
                      >
                        Resolve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleStatusChange(report.id, 'dismissed')}
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                ))}
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

      {/* Report Detail Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <DialogTitle>{selectedReport?.incidentType}</DialogTitle>
            </div>
            <DialogDescription>Blotter Report Details</DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Complainant</p>
                  <p className="font-medium">{selectedReport.complainantName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Respondent</p>
                  <p className="font-medium">{selectedReport.respondentName || 'N/A'}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Description</p>
                <p className="text-sm mt-1">{selectedReport.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Date & Time</p>
                  <p className="text-sm">
                    {format(new Date(selectedReport.incidentDate), 'MMM d, yyyy')}
                    {selectedReport.incidentTime && ` at ${selectedReport.incidentTime}`}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm">{selectedReport.location}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Status</p>
                {getStatusBadge(selectedReport.status)}
              </div>
              <div className="flex gap-2 pt-4 border-t">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    handleStatusChange(selectedReport.id, 'investigating')
                    setSelectedReport(null)
                  }}
                >
                  Investigate
                </Button>
                <Button 
                  size="sm"
                  onClick={() => {
                    handleStatusChange(selectedReport.id, 'resolved')
                    setSelectedReport(null)
                  }}
                >
                  Resolve
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => {
                    handleStatusChange(selectedReport.id, 'dismissed')
                    setSelectedReport(null)
                  }}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
