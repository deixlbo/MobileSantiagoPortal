"use client"

import { useState } from "react"
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
import { Scale, Plus, Edit2, Trash2, Eye, Loader2, Printer } from "lucide-react"
import { mockOrdinances } from "@/lib/mock-data"

export default function AdminOrdinances() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [localOrdinances, setLocalOrdinances] = useState(mockOrdinances)
  const [selectedOrdinance, setSelectedOrdinance] = useState<typeof mockOrdinances[0] | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [ordinanceNumber, setOrdinanceNumber] = useState("")
  const [title, setTitle] = useState("")
  const [purpose, setPurpose] = useState("")
  const [body, setBody] = useState("")
  const [seriesYear, setSeriesYear] = useState(new Date().getFullYear().toString())
  const [enactedDate, setEnactedDate] = useState("")
  const [status, setStatus] = useState("enacted")

  const resetForm = () => {
    setOrdinanceNumber("")
    setTitle("")
    setPurpose("")
    setBody("")
    setSeriesYear(new Date().getFullYear().toString())
    setEnactedDate("")
    setStatus("enacted")
    setEditingId(null)
  }

  const handleEdit = (ordinance: typeof mockOrdinances[0]) => {
    setOrdinanceNumber(ordinance.ordinanceNumber)
    setTitle(ordinance.title)
    setPurpose(ordinance.purpose)
    setBody(ordinance.body)
    setSeriesYear(ordinance.seriesYear.toString())
    setEnactedDate(ordinance.enactedDate)
    setStatus(ordinance.status)
    setEditingId(ordinance.id)
    setIsDialogOpen(true)
  }

  const handleView = (ordinance: typeof mockOrdinances[0]) => {
    setSelectedOrdinance(ordinance)
    setViewDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 500))

    if (editingId) {
      setLocalOrdinances(prev => prev.map(o =>
        o.id === editingId
          ? { ...o, ordinanceNumber, title, purpose, body, seriesYear: parseInt(seriesYear), enactedDate, status }
          : o
      ))
    } else {
      const newOrdinance = {
        id: `${Date.now()}`,
        ordinanceNumber,
        title,
        purpose,
        body,
        seriesYear: parseInt(seriesYear),
        enactedDate,
        status
      }
      setLocalOrdinances(prev => [newOrdinance, ...prev])
    }

    setIsDialogOpen(false)
    resetForm()
    setIsSubmitting(false)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this ordinance?")) {
      setLocalOrdinances(prev => prev.filter(o => o.id !== id))
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "enacted":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Enacted</Badge>
      case "draft":
        return <Badge variant="secondary">Draft</Badge>
      case "repealed":
        return <Badge variant="destructive">Repealed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Ordinances</h1>
          <p className="text-muted-foreground">Manage barangay ordinances and local legislation</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Ordinance
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Ordinance" : "Create Ordinance"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Update the ordinance details" : "Fill out the form to create a new ordinance"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="number">Ordinance Number</Label>
                  <Input
                    id="number"
                    placeholder="e.g., 2026-001"
                    value={ordinanceNumber}
                    onChange={(e) => setOrdinanceNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Series Year</Label>
                  <Input
                    id="year"
                    type="number"
                    min="2000"
                    max="2100"
                    value={seriesYear}
                    onChange={(e) => setSeriesYear(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Ordinance title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose</Label>
                <Input
                  id="purpose"
                  placeholder="Brief purpose statement"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="body">Content / Body</Label>
                <Textarea
                  id="body"
                  placeholder="Full text of the ordinance..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={6}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="enactedDate">Enacted Date</Label>
                  <Input
                    id="enactedDate"
                    type="date"
                    value={enactedDate}
                    onChange={(e) => setEnactedDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="enacted">Enacted</SelectItem>
                      <SelectItem value="repealed">Repealed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={() => {
                  setIsDialogOpen(false)
                  resetForm()
                }}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || !ordinanceNumber || !title || !purpose || !body || !enactedDate}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {editingId ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    editingId ? "Update" : "Create"
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
            <div className="text-2xl font-bold">{localOrdinances.length}</div>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-green-600">
              {localOrdinances.filter(o => o.status === 'enacted').length}
            </div>
            <p className="text-xs text-muted-foreground">Enacted</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-amber-600">
              {localOrdinances.filter(o => o.status === 'draft').length}
            </div>
            <p className="text-xs text-muted-foreground">Draft</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-rose-600">
              {localOrdinances.filter(o => o.status === 'repealed').length}
            </div>
            <p className="text-xs text-muted-foreground">Repealed</p>
          </CardContent>
        </Card>
      </div>

      {/* Ordinances Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Ordinances</CardTitle>
          <CardDescription>View and manage barangay ordinances</CardDescription>
        </CardHeader>
        <CardContent>
          {localOrdinances.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ordinance No.</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Enacted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {localOrdinances.map((ordinance) => (
                      <TableRow key={ordinance.id}>
                        <TableCell className="font-mono">{ordinance.ordinanceNumber}</TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="font-medium truncate">{ordinance.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{ordinance.purpose}</p>
                          </div>
                        </TableCell>
                        <TableCell>{format(new Date(ordinance.enactedDate), 'MMM d, yyyy')}</TableCell>
                        <TableCell>{getStatusBadge(ordinance.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleView(ordinance)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(ordinance)}>
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(ordinance.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {localOrdinances.map((ordinance) => (
                  <div key={ordinance.id} className="p-4 rounded-lg border bg-card">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge variant="outline" className="font-mono">{ordinance.ordinanceNumber}</Badge>
                      {getStatusBadge(ordinance.status)}
                    </div>
                    <h4 className="font-medium text-sm mb-1">{ordinance.title}</h4>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{ordinance.purpose}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(ordinance.enactedDate), 'MMM d, yyyy')}
                      </span>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleView(ordinance)}>
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(ordinance)}>
                          <Edit2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Scale className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold mb-1">No ordinances yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first ordinance to establish local legislation
              </p>
              <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Create Ordinance
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Ordinance Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">Ordinance No. {selectedOrdinance?.ordinanceNumber}</Badge>
              {selectedOrdinance && getStatusBadge(selectedOrdinance.status)}
            </div>
            <DialogTitle>{selectedOrdinance?.title}</DialogTitle>
          </DialogHeader>
          {selectedOrdinance && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-1">Purpose</h4>
                <p className="text-sm">{selectedOrdinance.purpose}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-1">Content</h4>
                <p className="text-sm whitespace-pre-wrap">{selectedOrdinance.body}</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t">
                <span>Series of {selectedOrdinance.seriesYear}</span>
                <span>Enacted: {format(new Date(selectedOrdinance.enactedDate), 'MMMM d, yyyy')}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
