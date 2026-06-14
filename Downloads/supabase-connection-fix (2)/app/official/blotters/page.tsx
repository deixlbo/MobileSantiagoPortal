"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  RefreshCw,
  Plus,
  Trash2,
  Edit2,
  Loader2,
} from "lucide-react"

// Types
interface Blotter {
  id: string
  type: string
  description: string
  location: string
  complainant: string
  complainantAddress?: string
  respondent?: string
  respondentAddress?: string
  residentId?: string
  status: string
  filedDate?: string
  investigationDate?: string
  mediationScheduledDate?: string
  hearingDate?: string
  actionTaken?: string
  resolution?: string
  resolutionDate?: string
  createdBy?: string
  createdByProfile?: {
    id: string
    first_name: string
    last_name: string
    position: string
    role: string
  }
}

interface BlotterType {
  id: string
  name: string
  description?: string
  is_active: boolean
}

function getBlotterPrintData(blotter: Blotter | null) {
  if (!blotter) return null

  const raw = blotter as Blotter & Record<string, any>

  return {
    id: raw.id || '',
    type: raw.type || raw.incidentType || raw.incident_type || 'Other',
    description: raw.description || raw.incidentDescription || raw.incident_description || raw.details || '',
    location: raw.location || raw.incidentLocation || raw.incident_location || raw.locationDetails || '',
    complainant: raw.complainant || raw.complainantName || raw.complainant_name || raw.reportedBy || raw.reported_by || '',
    respondent: raw.respondent || raw.respondentName || raw.respondent_name || raw.accused || '',
    filedDate: raw.filedDate || raw.filed_date || raw.reportedDate || raw.reported_date || raw.incidentDate || raw.incident_date || '',
    status: raw.status || 'pending-review',
    actionTaken: raw.actionTaken || raw.action_taken || '',
    resolution: raw.resolution || raw.resolutionRemarks || raw.resolution_remark || '',
  }
}

// Status badge helper
function getStatusBadge(status: string) {
  switch (status) {
    case "pending-review":
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-[10px] md:text-xs">
          <AlertTriangle className="mr-0.5 md:mr-1 h-2.5 w-2.5 md:h-3 md:w-3" />
          <span className="hidden sm:inline">Pending Review</span>
          <span className="sm:hidden">Pending</span>
        </Badge>
      )
    case "under-investigation":
      return (
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-[10px] md:text-xs">
          <Clock className="mr-0.5 md:mr-1 h-2.5 w-2.5 md:h-3 md:w-3" />
          <span className="hidden sm:inline">Under Investigation</span>
          <span className="sm:hidden">Investigating</span>
        </Badge>
      )
    case "scheduled-mediation":
      return (
        <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 text-[10px] md:text-xs">
          <Clock className="mr-0.5 md:mr-1 h-2.5 w-2.5 md:h-3 md:w-3" />
          <span className="hidden sm:inline">Scheduled for Mediation</span>
          <span className="sm:hidden">Mediation</span>
        </Badge>
      )
    case "ongoing-hearing":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 text-[10px] md:text-xs">
          <AlertTriangle className="mr-0.5 md:mr-1 h-2.5 w-2.5 md:h-3 md:w-3" />
          <span className="hidden sm:inline">Ongoing Hearing</span>
          <span className="sm:hidden">Hearing</span>
        </Badge>
      )
    case "resolved":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-[10px] md:text-xs">
          <CheckCircle2 className="mr-0.5 md:mr-1 h-2.5 w-2.5 md:h-3 md:w-3" />
          <span className="hidden sm:inline">Resolved</span>
          <span className="sm:hidden">Done</span>
        </Badge>
      )
    case "dismissed":
      return (
        <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 text-[10px] md:text-xs">
          <FileText className="mr-0.5 md:mr-1 h-2.5 w-2.5 md:h-3 md:w-3" />
          <span className="hidden sm:inline">Dismissed</span>
          <span className="sm:hidden">Dismissed</span>
        </Badge>
      )
    case "escalated":
      return (
        <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 text-[10px] md:text-xs">
          <AlertTriangle className="mr-0.5 md:mr-1 h-2.5 w-2.5 md:h-3 md:w-3" />
          <span className="hidden sm:inline">Escalated</span>
          <span className="sm:hidden">Escalated</span>
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

// Print header component
function PrintHeader() {
  return (
    <div className="hidden print:flex w-full items-center justify-between mb-4 p-6 border-b bg-white">
      <Image src="/logos/saz-logo.png" alt="Municipality Seal" width={80} height={80} className="w-16 h-16 md:w-20 md:h-20 object-contain shrink-0" />
      <div className="text-center flex-1 px-4">
        <p className="text-xs text-black">Republic of the Philippines</p>
        <p className="text-xs text-black">Province of Zambales</p>
        <p className="text-xs text-black">Municipality of San Antonio</p>
        <p className="text-sm font-semibold text-black">Barangay Santiago</p>
        <p className="text-sm font-semibold text-black">Office of the Barangay Captain</p>
      </div>
      <Image src="/logos/santiago-logo.png" alt="Barangay Santiago Logo" width={80} height={80} className="w-16 h-16 md:w-20 md:h-20 object-contain shrink-0" />
    </div>
  )
}

// Table Component
function BlottersTable({ 
  blotters, 
  loading,
  onView,
  onUpdate,
}: { 
  blotters: Blotter[]
  loading: boolean
  onView: (b: Blotter) => void
  onUpdate: (b: Blotter) => void
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (blotters.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-sm">No blotter records found</p>
      </div>
    )
  }

  return (
    <>
      {/* Mobile Cards */}
      <div className="space-y-3 sm:hidden">
        {blotters.map((blotter) => (
          <div key={blotter.id} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{blotter.id}</p>
                <p className="text-xs text-slate-600 truncate">{blotter.type}</p>
                <p className="text-xs text-slate-400 mt-1">{blotter.complainant}</p>
              </div>
              <div className="shrink-0">{getStatusBadge(blotter.status)}</div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => onView(blotter)}>
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
              <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => onUpdate(blotter)}>
                <RefreshCw className="h-3 w-3 mr-1" />
                Process
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs md:text-sm">Reference</TableHead>
              <TableHead className="text-xs md:text-sm hidden sm:table-cell">Type</TableHead>
              <TableHead className="text-xs md:text-sm hidden md:table-cell">Complainant</TableHead>
              <TableHead className="text-xs md:text-sm">Status</TableHead>
              <TableHead className="text-xs md:text-sm">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blotters.map((blotter) => (
              <TableRow key={blotter.id}>
                <TableCell className="font-medium text-xs md:text-sm py-2 md:py-4">{blotter.id}</TableCell>
                <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden sm:table-cell">{blotter.type}</TableCell>
                <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden md:table-cell">{blotter.complainant}</TableCell>
                <TableCell className="py-2 md:py-4">{getStatusBadge(blotter.status)}</TableCell>
                <TableCell className="py-2 md:py-4">
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" className="h-7 md:h-8 px-2 text-xs" onClick={() => onView(blotter)}>
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button size="sm" className="h-7 md:h-8 px-2 text-xs bg-emerald-600 hover:bg-emerald-700" onClick={() => onUpdate(blotter)}>
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

export default function OfficialBlottersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [blotters, setBlotters] = useState<Blotter[]>([])
  const [selectedBlotter, setSelectedBlotter] = useState<Blotter | null>(null)
  const [showUpdateDialog, setShowUpdateDialog] = useState(false)
  const [showTypeDialog, setShowTypeDialog] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>("under-investigation")
  const [actionTaken, setActionTaken] = useState("")
  const [resolution, setResolution] = useState("")
  const [blotterTypes, setBlotterTypes] = useState<BlotterType[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [typeName, setTypeName] = useState("")
  const [typeDescription, setTypeDescription] = useState("")
  const [typeIsActive, setTypeIsActive] = useState(true)
  const [editingTypeId, setEditingTypeId] = useState<string | null>(null)

  const fetchBlotters = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/blotters')
      const data = await response.json()
      
      if (!response.ok) {
        console.error('Failed to fetch blotters:', data)
        return
      }
      
      setBlotters(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching blotters:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchBlotterTypes = async () => {
    try {
      const response = await fetch('/api/blotters/types')
      const data = await response.json()
      if (!response.ok) {
        console.error('Failed to fetch blotter types:', data)
        return
      }

      const normalizedTypes = Array.isArray(data)
        ? data.map((type: any) => ({
            id: type.id || type.name,
            name: type.name || 'Other',
            description: type.description ?? null,
            is_active: type.is_active ?? true,
          }))
        : []

      setBlotterTypes(normalizedTypes)
    } catch (error) {
      console.error('Error fetching blotter types:', error)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      await fetchBlotterTypes()
      await fetchBlotters()
    }

    loadData()
  }, [])

  useEffect(() => {
    if (selectedBlotter) {
      setSelectedStatus(selectedBlotter.status)
      setActionTaken(selectedBlotter.actionTaken || "")
      setResolution(selectedBlotter.resolution || "")
    }
  }, [selectedBlotter])

  const filteredBlotters = blotters.filter((b) =>
    b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.complainant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.respondent?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    b.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const pendingCount = blotters.filter(b => b.status === "pending-review").length
  const processingCount = blotters.filter(b => ["under-investigation", "scheduled-mediation", "ongoing-hearing"].includes(b.status)).length
  const resolvedCount = blotters.filter(b => ["resolved", "dismissed", "escalated"].includes(b.status)).length
  const visibleTypeTabs = blotterTypes.filter((type) => {
    if (!type.is_active) return false
    return filteredBlotters.some((item) => item.type.toLowerCase() === type.name.toLowerCase())
  })

  const getBlottersForTab = (tab: string) => {
    if (tab === "all") {
      return filteredBlotters
    }

    if (tab === "other") {
      return filteredBlotters.filter((item) => !blotterTypes.some((type) => type.name.toLowerCase() === item.type.toLowerCase()))
    }

    const selectedType = blotterTypes.find((type) => `type-${type.id}` === tab)
    if (!selectedType) {
      return []
    }

    return filteredBlotters.filter((item) => item.type.toLowerCase() === selectedType.name.toLowerCase())
  }

  const handleSaveUpdate = async () => {
    if (!selectedBlotter) return

    const trimmedAction = actionTaken.trim()
    const trimmedResolution = resolution.trim()
    const finalStatus = selectedStatus || selectedBlotter.status

    if (finalStatus === "resolved" && !trimmedResolution) {
      alert('Please enter a resolution before marking this case as resolved.')
      return
    }

    try {
      const response = await fetch('/api/blotters', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedBlotter.id,
          status: finalStatus,
          actionTaken: trimmedAction || selectedBlotter.actionTaken,
          resolution: finalStatus === 'resolved' ? trimmedResolution || selectedBlotter.resolution : selectedBlotter.resolution,
          resolutionDate: finalStatus === 'resolved' ? new Date().toISOString() : selectedBlotter.resolutionDate,
          mediationScheduledDate: finalStatus === 'scheduled-mediation' ? new Date().toISOString() : selectedBlotter.mediationScheduledDate,
          hearingDate: finalStatus === 'ongoing-hearing' ? new Date().toISOString() : selectedBlotter.hearingDate,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || 'Failed to update blotter')
        return
      }

      await fetchBlotters()
      setSelectedBlotter(null)
      setActionTaken("")
      setResolution("")
      setShowUpdateDialog(false)
    } catch (error) {
      console.error('Failed to update blotter:', error)
      alert('Failed to update blotter')
    }
  }

  const handleDeleteBlotter = async (blotterId: string) => {
    if (!confirm('Are you sure you want to delete this blotter?')) {
      return
    }

    try {
      const response = await fetch(`/api/blotters?id=${blotterId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || 'Failed to delete blotter')
        return
      }

      setBlotters(blotters.filter(b => b.id !== blotterId))
      setSelectedBlotter(null)
    } catch (error) {
      console.error('Failed to delete blotter:', error)
      alert('Failed to delete blotter')
    }
  }

  const getAuthHeaders = (): HeadersInit => {
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`
    }

    return headers
  }

  const handleSaveType = async () => {
    if (!typeName.trim()) {
      alert('Please enter a blotter type name')
      return
    }

    try {
      if (editingTypeId) {
        const response = await fetch('/api/blotters/types', {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            id: editingTypeId,
            name: typeName.trim(),
            description: typeDescription.trim() || null,
            is_active: typeIsActive
          })
        })
        
        if (!response.ok) {
          const error = await response.json()
          alert(`Failed to update type: ${error.error}`)
          return
        }
      } else {
        const response = await fetch('/api/blotters/types', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            name: typeName.trim(),
            description: typeDescription.trim() || null
          })
        })

        if (!response.ok) {
          const error = await response.json()
          alert(`Failed to create type: ${error.error}`)
          return
        }
      }

      await fetchBlotterTypes()
      setTypeName("")
      setTypeDescription("")
      setTypeIsActive(true)
      setEditingTypeId(null)
    } catch (error) {
      console.error('Error saving type:', error)
      alert('Failed to save blotter type')
    }
  }

  const handleEditType = (type: BlotterType) => {
    setTypeName(type.name)
    setTypeDescription(type.description || "")
    setTypeIsActive(type.is_active)
    setEditingTypeId(type.id)
  }

  const handleDeleteType = async (typeId: string) => {
    if (!confirm('Are you sure you want to delete this blotter type?')) {
      return
    }

    try {
      const response = await fetch(`/api/blotters/types?id=${typeId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      if (!response.ok) {
        const error = await response.json()
        alert(`Failed to delete type: ${error.error}`)
        return
      }

      setBlotterTypes(blotterTypes.filter(t => t.id !== typeId))
    } catch (error) {
      console.error('Error deleting type:', error)
      alert('Failed to delete blotter type')
    }
  }

  const openTypeDialog = async () => {
    setTypeName("")
    setTypeDescription("")
    setTypeIsActive(true)
    setEditingTypeId(null)
    await fetchBlotterTypes()
    setShowTypeDialog(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 md:space-y-6 p-4 md:p-6"
    >
      {/* Print Header */}
      <PrintHeader />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Blotter Records</h1>
          <p className="text-xs md:text-sm text-muted-foreground">Manage and process incident reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="w-fit h-8 md:h-9 text-xs md:text-sm" onClick={openTypeDialog}>
            <FileText className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
            <span className="hidden md:inline">Types</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        <Card>
          <CardContent className="p-2 md:p-4">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="rounded-lg bg-blue-100 p-1.5 md:p-2">
                <FileText className="h-4 w-4 md:h-5 md:w-5 text-blue-700" />
              </div>
              <div>
                <p className="text-lg md:text-2xl font-bold">{pendingCount}</p>
                <p className="text-[10px] md:text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2 md:p-4">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="rounded-lg bg-amber-100 p-1.5 md:p-2">
                <Clock className="h-4 w-4 md:h-5 md:w-5 text-amber-700" />
              </div>
              <div>
                <p className="text-lg md:text-2xl font-bold">{processingCount}</p>
                <p className="text-[10px] md:text-sm text-muted-foreground">Processing</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2 md:p-4">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="rounded-lg bg-emerald-100 p-1.5 md:p-2">
                <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-emerald-700" />
              </div>
              <div>
                <p className="text-lg md:text-2xl font-bold">{resolvedCount}</p>
                <p className="text-[10px] md:text-sm text-muted-foreground">Resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2 md:p-4">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="rounded-lg bg-primary/10 p-1.5 md:p-2">
                <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              </div>
              <div>
                <p className="text-lg md:text-2xl font-bold">{blotters.length}</p>
                <p className="text-[10px] md:text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Search blotter records..." 
          className="pl-10 h-9 md:h-10 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Blotters Table */}
      <Card>
        <CardHeader className="p-3 md:p-6 pb-2 md:pb-4">
          <CardTitle className="text-base md:text-lg">Blotter Records</CardTitle>
          <CardDescription className="text-xs md:text-sm">Process and resolve incident reports</CardDescription>
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="h-8 md:h-9 w-full justify-start overflow-x-auto">
              <TabsTrigger value="all" className="text-xs md:text-sm px-2 md:px-3">All Blotters ({filteredBlotters.length})</TabsTrigger>
              {visibleTypeTabs.map((type) => (
                <TabsTrigger key={`type-${type.id}`} value={`type-${type.id}`} className="text-xs md:text-sm px-2 md:px-3">
                  {type.name} ({getBlottersForTab(`type-${type.id}`).length})
                </TabsTrigger>
              ))}
              {getBlottersForTab("other").length > 0 && (
                <TabsTrigger value="other" className="text-xs md:text-sm px-2 md:px-3">Other ({getBlottersForTab("other").length})</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="all" className="mt-3 md:mt-4">
              <BlottersTable
                blotters={getBlottersForTab("all")}
                loading={loading}
                onView={setSelectedBlotter}
                onUpdate={(b) => { setSelectedBlotter(b); setShowUpdateDialog(true); }}
              />
            </TabsContent>

            {visibleTypeTabs.map((type) => (
              <TabsContent key={`type-content-${type.id}`} value={`type-${type.id}`} className="mt-3 md:mt-4">
                <BlottersTable
                  blotters={getBlottersForTab(`type-${type.id}`)}
                  loading={loading}
                  onView={setSelectedBlotter}
                  onUpdate={(b) => { setSelectedBlotter(b); setShowUpdateDialog(true); }}
                />
              </TabsContent>
            ))}

            {getBlottersForTab("other").length > 0 && (
              <TabsContent value="other" className="mt-3 md:mt-4">
                <BlottersTable
                  blotters={getBlottersForTab("other")}
                  loading={loading}
                  onView={setSelectedBlotter}
                  onUpdate={(b) => { setSelectedBlotter(b); setShowUpdateDialog(true); }}
                />
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={!!selectedBlotter && !showUpdateDialog} onOpenChange={() => setSelectedBlotter(null)}>
        <DialogContent className="w-[95vw] sm:w-auto max-h-[95vh] overflow-auto max-w-lg bg-white">
          <DialogHeader>
            <DialogTitle className="text-base md:text-lg">Blotter Details</DialogTitle>
            <DialogDescription className="text-xs md:text-sm">
              View complete incident report
            </DialogDescription>
          </DialogHeader>
          {selectedBlotter && (
            <ScrollArea className="max-h-[50vh]">
              <div className="space-y-3 pr-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="font-medium text-sm">{selectedBlotter.id}</span>
                  {getStatusBadge(selectedBlotter.status)}
                </div>
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                  <div>
                    <p className="text-[10px] md:text-sm text-muted-foreground">Incident Type</p>
                    <p className="font-medium text-sm">{selectedBlotter.type}</p>
                  </div>
                  <div>
                    <p className="text-[10px] md:text-sm text-muted-foreground">Date Reported</p>
                    <p className="font-medium text-sm">{selectedBlotter.filedDate}</p>
                  </div>
                  <div>
                    <p className="text-[10px] md:text-sm text-muted-foreground">Complainant</p>
                    <p className="font-medium text-sm">{selectedBlotter.complainant}</p>
                  </div>
                  <div>
                    <p className="text-[10px] md:text-sm text-muted-foreground">Respondent</p>
                    <p className="font-medium text-sm">{selectedBlotter.respondent || 'N/A'}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-[10px] md:text-sm text-muted-foreground">Location</p>
                    <p className="font-medium text-sm">{selectedBlotter.location}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-[10px] md:text-sm text-muted-foreground">Description</p>
                    <p className="font-medium text-sm">{selectedBlotter.description}</p>
                  </div>
                </div>
                {selectedBlotter.investigationDate && (
                  <div>
                    <p className="text-[10px] md:text-sm text-muted-foreground">Investigation Date</p>
                    <p className="font-medium text-sm">{selectedBlotter.investigationDate}</p>
                  </div>
                )}
                {selectedBlotter.actionTaken && (
                  <div className="border-t pt-3">
                    <p className="text-[10px] md:text-sm text-muted-foreground">Action Taken</p>
                    <p className="text-sm">{selectedBlotter.actionTaken}</p>
                  </div>
                )}
                {selectedBlotter.resolution && (
                  <div className="rounded-lg bg-emerald-50 p-3">
                    <p className="text-xs font-medium text-emerald-800">Resolution</p>
                    <p className="text-xs text-emerald-700">{selectedBlotter.resolution}</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            {selectedBlotter?.status !== "resolved" && (
              <Button size="sm" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700" onClick={() => setShowUpdateDialog(true)}>
                Update
              </Button>
            )}
            <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => setSelectedBlotter(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Dialog */}
      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent className="w-[95vw] sm:w-auto max-h-[95vh] overflow-auto max-w-lg bg-white">
          <DialogHeader>
            <DialogTitle className="text-base md:text-lg">Update Blotter Status</DialogTitle>
            <DialogDescription className="text-xs md:text-sm">
              Record action taken and update case status
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label className="text-xs md:text-sm">Blotter Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="pending-review">Pending Review</SelectItem>
                    <SelectItem value="under-investigation">Under Investigation</SelectItem>
                    <SelectItem value="scheduled-mediation">Scheduled for Mediation</SelectItem>
                    <SelectItem value="ongoing-hearing">Ongoing Hearing</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="dismissed">Dismissed</SelectItem>
                    <SelectItem value="escalated">Escalated</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs md:text-sm">Action Taken</Label>
              <Textarea 
                placeholder="Describe the action taken..."
                className="text-sm min-h-[60px]"
                value={actionTaken}
                onChange={(e) => setActionTaken(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs md:text-sm">Resolution (if resolved)</Label>
              <Textarea 
                placeholder="Enter resolution details..."
                className="text-sm min-h-[60px]"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button 
              size="sm" 
              variant="destructive"
              className="w-full sm:w-auto"
              onClick={() => selectedBlotter && handleDeleteBlotter(selectedBlotter.id)}
            >
              Delete
            </Button>
            <div className="flex gap-2 flex-1 sm:flex-initial">
              <Button variant="outline" size="sm" className="flex-1 sm:flex-initial" onClick={() => setShowUpdateDialog(false)}>Cancel</Button>
              <Button size="sm" className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-700" onClick={handleSaveUpdate}>
                Save
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Type Management Dialog */}
      <Dialog open={showTypeDialog} onOpenChange={setShowTypeDialog}>
        <DialogContent className="w-[95vw] sm:w-auto max-h-[95vh] overflow-auto max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-base md:text-lg">Manage Blotter Types</DialogTitle>
            <DialogDescription className="text-xs md:text-sm">
              Create, edit, or delete blotter incident types
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs md:text-sm">Type Name</Label>
                  <Input
                    placeholder="e.g., Theft, Dispute, Accident..."
                    value={typeName}
                    onChange={(e) => setTypeName(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs md:text-sm">Description</Label>
                  <Textarea                    placeholder="Describe this incident type..."
                    value={typeDescription}
                    onChange={(e) => setTypeDescription(e.target.value)}
                    className="text-sm min-h-[60px]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="type-active"
                    checked={typeIsActive}
                    onCheckedChange={(checked) => setTypeIsActive(!!checked)}
                  />
                  <Label htmlFor="type-active" className="text-xs md:text-sm font-medium cursor-pointer">
                    Active
                  </Label>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setTypeName("")
                    setTypeDescription("")
                    setTypeIsActive(true)
                    setEditingTypeId(null)
                  }}
                  disabled={!editingTypeId}
                >
                  Clear
                </Button>
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 flex-1"
                  onClick={handleSaveType}
                >
                  {editingTypeId ? 'Update Type' : 'Add Type'}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs md:text-sm font-medium">Existing Types ({blotterTypes.length})</Label>
              <div className="border rounded-lg bg-white max-h-[300px] overflow-y-auto">
                {blotterTypes.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No blotter types yet
                  </div>
                ) : (
                  <div className="space-y-1">
                    {blotterTypes.map((type) => (
                      <div key={type.id} className="flex items-start justify-between gap-3 p-3 border-b last:border-b-0 hover:bg-gray-50">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">{type.name}</p>
                          {type.description && (
                            <p className="text-xs text-muted-foreground line-clamp-1">{type.description}</p>
                          )}
                          <div className="flex gap-2 mt-1">
                            {type.is_active ? (
                              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">Active</Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs bg-gray-100 text-gray-600">Inactive</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button variant="ghost" size="sm" onClick={() => handleEditType(type)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteType(type.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowTypeDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </motion.div>
  )
}