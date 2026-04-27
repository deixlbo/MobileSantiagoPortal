"use client"

import { useState, useMemo } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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
  Users, Search, Mail, Phone, MapPin, Eye, FileText, ClipboardList,
  CheckCircle, XCircle, ChevronLeft, ChevronRight, Loader2, Calendar, X,
  AlertTriangle
} from "lucide-react"
import { mockUsers } from "@/lib/auth"
import { mockResidents } from "@/lib/mock-data"

interface Resident {
  id: string
  residentId: string
  fullName: string
  email: string
  phone: string
  address: string
  purok: string
  birthDate: string
  civilStatus: string
  gender: string
  status: 'active' | 'pending' | 'rejected'
  registeredAt: string
  documents?: Array<{ name: string; type: string; preview?: string }>
  activityLogs?: Array<{ date: string; time: string; action: string }>
}

const pendingResidents: Resident[] = [
  {
    id: 'pend-1',
    residentId: 'RES-2024-004',
    fullName: 'Juan Dela Cruz',
    email: 'juan.delacruz@email.com',
    phone: '0917-100-1000',
    address: 'Purok 1, Barangay Santiago',
    purok: 'Purok 1',
    birthDate: '1990-01-01',
    civilStatus: 'Single',
    gender: 'Male',
    status: 'pending',
    registeredAt: '2026-05-05T10:30:00Z',
    documents: [{ name: 'ID_juan_delacruz.jpg', type: 'Valid ID' }],
    activityLogs: [
      { date: '2026-05-05', time: '10:30 AM', action: 'Account created' },
      { date: '2026-05-05', time: '09:45 AM', action: 'Uploaded document (Valid ID)' },
      { date: '2026-05-05', time: '09:30 AM', action: 'Submitted registration' }
    ]
  },
  {
    id: 'pend-2',
    residentId: 'RES-2024-005',
    fullName: 'Maria Cruz',
    email: 'maria.cruz@email.com',
    phone: '0918-200-2000',
    address: 'Purok 2, Barangay Santiago',
    purok: 'Purok 2',
    birthDate: '1985-03-15',
    civilStatus: 'Married',
    gender: 'Female',
    status: 'pending',
    registeredAt: '2026-05-06T09:15:00Z',
    documents: [{ name: 'ID_maria_cruz.jpg', type: 'Valid ID' }],
    activityLogs: [
      { date: '2026-05-06', time: '09:15 AM', action: 'Account created' }
    ]
  },
  {
    id: 'pend-3',
    residentId: 'RES-2024-006',
    fullName: 'Ramon Lopez',
    email: 'ramon.lopez@email.com',
    phone: '0919-300-3000',
    address: 'Purok 3, Barangay Santiago',
    purok: 'Purok 3',
    birthDate: '1978-07-22',
    civilStatus: 'Single',
    gender: 'Male',
    status: 'pending',
    registeredAt: '2026-05-06T11:45:00Z',
    documents: [{ name: 'ID_ramon_lopez.jpg', type: 'Valid ID' }],
    activityLogs: [
      { date: '2026-05-06', time: '11:45 AM', action: 'Account created' }
    ]
  }
]

export default function AdminResidents() {
  const [activeTab, setActiveTab] = useState("residents")
  const [searchQuery, setSearchQuery] = useState("")
  const [purokFilter, setPurokFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Resident states
  const [residents, setResidents] = useState<Resident[]>(
    mockResidents.map(r => ({
      id: r.id,
      residentId: r.residentId,
      fullName: r.fullName,
      email: r.email,
      phone: r.contactNumber,
      address: r.address,
      purok: r.purok,
      birthDate: r.birthDate,
      civilStatus: r.civilStatus,
      gender: r.gender,
      status: 'active' as const,
      registeredAt: r.registeredAt,
      activityLogs: [
        { date: r.registeredAt.split('T')[0], time: '09:30 AM', action: 'Account activated by Admin' },
        { date: r.registeredAt.split('T')[0], time: '09:00 AM', action: 'Submitted registration' }
      ]
    }))
  )
  const [pendingList, setPendingList] = useState<Resident[]>(pendingResidents)

  // Modal states
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showLogsModal, setShowLogsModal] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [showRequestDocsModal, setShowRequestDocsModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [requestMessage, setRequestMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredResidents = useMemo(() => {
    return residents
      .filter(r => purokFilter === "all" || r.purok === purokFilter)
      .filter(r =>
        r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.residentId.toLowerCase().includes(searchQuery.toLowerCase())
      )
  }, [residents, purokFilter, searchQuery])

  const paginatedResidents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredResidents.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredResidents, currentPage])

  const totalPages = Math.ceil(filteredResidents.length / itemsPerPage)

  const stats = useMemo(() => ({
    total: residents.length,
    active: residents.filter(r => r.status === 'active').length,
    puroks: new Set(residents.map(r => r.purok)).size,
    thisMonth: residents.filter(r => {
      const regDate = new Date(r.registeredAt)
      const now = new Date()
      return regDate.getMonth() === now.getMonth() && regDate.getFullYear() === now.getFullYear()
    }).length
  }), [residents])

  const handleActivate = async () => {
    if (!selectedResident) return
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 500))

    // Move from pending to active
    const activatedResident: Resident = {
      ...selectedResident,
      status: 'active',
      activityLogs: [
        { date: format(new Date(), 'yyyy-MM-dd'), time: format(new Date(), 'hh:mm a'), action: 'Account activated by Admin' },
        ...(selectedResident.activityLogs || [])
      ]
    }

    setResidents(prev => [...prev, activatedResident])
    setPendingList(prev => prev.filter(r => r.id !== selectedResident.id))

    setShowReviewModal(false)
    setShowSuccessModal(true)
    setIsSubmitting(false)
  }

  const handleReject = async () => {
    if (!selectedResident) return
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 500))

    setPendingList(prev => prev.filter(r => r.id !== selectedResident.id))

    setShowReviewModal(false)
    setIsSubmitting(false)
  }

  const handleRequestMoreDocs = async () => {
    if (!selectedResident) return
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 500))

    // Update pending resident with request
    setPendingList(prev => prev.map(r =>
      r.id === selectedResident.id
        ? {
            ...r,
            activityLogs: [
              { date: format(new Date(), 'yyyy-MM-dd'), time: format(new Date(), 'hh:mm a'), action: `Document request sent: ${requestMessage}` },
              ...(r.activityLogs || [])
            ]
          }
        : r
    ))

    setShowRequestDocsModal(false)
    setRequestMessage("")
    setIsSubmitting(false)
  }

  const openViewModal = (resident: Resident) => {
    setSelectedResident(resident)
    setShowViewModal(true)
  }

  const openLogsModal = (resident: Resident) => {
    setSelectedResident(resident)
    setShowLogsModal(true)
  }

  const openReviewModal = (resident: Resident) => {
    setSelectedResident(resident)
    setShowReviewModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Residents</h1>
          <p className="text-muted-foreground">Manage registered barangay residents</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg border flex items-center justify-center">
                <Users className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">Total Residents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg border flex items-center justify-center bg-green-50">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg border flex items-center justify-center bg-blue-50">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.puroks}</div>
                <p className="text-xs text-muted-foreground">Puroks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg border flex items-center justify-center bg-amber-50">
                <Calendar className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600">{stats.thisMonth}</div>
                <p className="text-xs text-muted-foreground">This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content with Tabs */}
      <Card>
        <CardHeader className="pb-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <TabsList>
                <TabsTrigger value="residents" className="gap-2">
                  <Users className="w-4 h-4" />
                  Residents
                </TabsTrigger>
                <TabsTrigger value="requests" className="gap-2">
                  <ClipboardList className="w-4 h-4" />
                  Requests
                  {pendingList.length > 0 && (
                    <Badge variant="destructive" className="ml-1 px-1.5 py-0.5 text-[10px]">
                      {pendingList.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="residents" className="mt-4">
              <div className="space-y-4">
                <CardTitle className="text-lg">Resident Directory</CardTitle>
                <CardDescription>Search and view resident information</CardDescription>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, email, or ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={purokFilter} onValueChange={setPurokFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by Purok" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Purok 1">Purok 1</SelectItem>
                      <SelectItem value="Purok 2">Purok 2</SelectItem>
                      <SelectItem value="Purok 3">Purok 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Resident</TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedResidents.map((resident) => (
                        <TableRow key={resident.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                  {resident.fullName.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{resident.fullName}</p>
                                <p className="text-xs text-muted-foreground">{resident.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{resident.residentId}</TableCell>
                          <TableCell>{resident.phone}</TableCell>
                          <TableCell>{resident.address}</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                              Active
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="outline" size="sm" onClick={() => openViewModal(resident)}>
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => openLogsModal(resident)}>
                                <ClipboardList className="w-4 h-4 mr-1" />
                                Logs
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
                  {paginatedResidents.map((resident) => (
                    <div key={resident.id} className="p-4 rounded-lg border bg-card">
                      <div className="flex items-start gap-3 mb-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {resident.fullName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{resident.fullName}</p>
                          <p className="text-xs text-muted-foreground font-mono">{resident.residentId}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 shrink-0">
                          Active
                        </Badge>
                      </div>
                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3" />
                          {resident.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3" />
                          {resident.phone}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3" />
                          {resident.address}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => openViewModal(resident)}>
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => openLogsModal(resident)}>
                          <ClipboardList className="w-3 h-3 mr-1" />
                          Logs
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {filteredResidents.length > 0 && (
                  <div className="flex items-center justify-between pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredResidents.length)} of {filteredResidents.length} entries
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
                )}

                {filteredResidents.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="font-semibold mb-1">No residents found</h3>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search query or filter
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="requests" className="mt-4">
              <div className="space-y-4">
                <CardTitle className="text-lg">Pending Resident Verification</CardTitle>
                <CardDescription>Review and verify new resident registrations</CardDescription>

                {pendingList.length > 0 ? (
                  <>
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Resident</TableHead>
                            <TableHead>ID</TableHead>
                            <TableHead>Purok</TableHead>
                            <TableHead>Date Registered</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pendingList.map((resident) => (
                            <TableRow key={resident.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="w-8 h-8">
                                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                      {resident.fullName.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{resident.fullName}</p>
                                    <p className="text-xs text-muted-foreground">{resident.email}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="font-mono text-sm">{resident.residentId}</TableCell>
                              <TableCell>{resident.purok}</TableCell>
                              <TableCell>
                                <div>
                                  <p>{format(new Date(resident.registeredAt), 'MMM d, yyyy')}</p>
                                  <p className="text-xs text-muted-foreground">{format(new Date(resident.registeredAt), 'hh:mm a')}</p>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="outline" size="sm" onClick={() => openReviewModal(resident)}>
                                  Review
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-3">
                      {pendingList.map((resident) => (
                        <div key={resident.id} className="p-4 rounded-lg border bg-card">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10">
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {resident.fullName.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{resident.fullName}</p>
                                <p className="text-xs text-muted-foreground">{resident.email}</p>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                            <div>
                              <p className="text-xs text-muted-foreground">ID</p>
                              <p className="font-mono">{resident.residentId}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Purok</p>
                              <p>{resident.purok}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-xs text-muted-foreground">Date Registered</p>
                              <p>{format(new Date(resident.registeredAt), 'MMM d, yyyy hh:mm a')}</p>
                            </div>
                          </div>
                          <Button variant="outline" className="w-full" onClick={() => openReviewModal(resident)}>
                            Review
                          </Button>
                        </div>
                      ))}
                    </div>

                    {/* Pagination info */}
                    <div className="pt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        Showing 1 to {pendingList.length} of {pendingList.length} entries
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <CheckCircle className="w-12 h-12 mx-auto text-green-500/50 mb-4" />
                    <h3 className="font-semibold mb-1">All caught up!</h3>
                    <p className="text-sm text-muted-foreground">
                      No pending resident verifications
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardHeader>
        <CardContent />
      </Card>

      {/* View Resident Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Resident Profile - {selectedResident?.fullName}</DialogTitle>
          </DialogHeader>

          {selectedResident && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="text-xl bg-primary/10 text-primary">
                    {selectedResident.fullName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Badge className="bg-green-100 text-green-700 mb-1">Active</Badge>
                  <p className="font-mono text-sm text-muted-foreground">ID: {selectedResident.residentId}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-xs text-muted-foreground">Full Name</Label>
                  <p className="font-medium">{selectedResident.fullName}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <p className="font-medium">{selectedResident.email}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Phone Number</Label>
                  <p className="font-medium">{selectedResident.phone}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Purok</Label>
                  <p className="font-medium">{selectedResident.purok}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-xs text-muted-foreground">Address</Label>
                  <p className="font-medium">{selectedResident.address}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Birth Date</Label>
                  <p className="font-medium">{format(new Date(selectedResident.birthDate), 'MMMM d, yyyy')}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Civil Status</Label>
                  <p className="font-medium">{selectedResident.civilStatus}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Gender</Label>
                  <p className="font-medium">{selectedResident.gender}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Date Registered</Label>
                  <p className="font-medium">{format(new Date(selectedResident.registeredAt), 'MMM d, yyyy hh:mm a')}</p>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowViewModal(false)}>
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Activity Logs Modal */}
      <Dialog open={showLogsModal} onOpenChange={setShowLogsModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Activity Logs - {selectedResident?.fullName}</DialogTitle>
          </DialogHeader>

          {selectedResident && (
            <div className="space-y-4">
              <div className="relative border-l-2 border-muted-foreground/20 pl-6 ml-2 space-y-6">
                {(selectedResident.activityLogs || []).map((log, index) => (
                  <div key={index} className="relative">
                    <div className="absolute -left-[29px] w-4 h-4 rounded-full bg-background border-2 border-muted-foreground/20" />
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(log.date), 'MMM d, yyyy')} {log.time}
                    </p>
                    <p className="font-medium text-sm">{log.action}</p>
                  </div>
                ))}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowLogsModal(false)}>
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Review Resident Modal */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Review Resident</DialogTitle>
          </DialogHeader>

          {selectedResident && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="text-xl bg-primary/10 text-primary">
                    {selectedResident.fullName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">{selectedResident.fullName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <p className="font-medium">{selectedResident.email}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Phone Number</Label>
                  <p className="font-medium">{selectedResident.phone}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Purok</Label>
                  <p className="font-medium">{selectedResident.purok}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Address</Label>
                  <p className="font-medium">{selectedResident.address}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Birth Date</Label>
                  <p className="font-medium">{format(new Date(selectedResident.birthDate), 'MMMM d, yyyy')}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Civil Status</Label>
                  <p className="font-medium">{selectedResident.civilStatus}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Gender</Label>
                  <p className="font-medium">{selectedResident.gender}</p>
                </div>
              </div>

              {/* Uploaded Documents */}
              <div>
                <Label className="text-xs text-muted-foreground">Uploaded Documents</Label>
                <div className="mt-2 space-y-2">
                  {(selectedResident.documents || []).map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{doc.type}</p>
                          <p className="text-xs text-muted-foreground">{doc.name}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <DialogFooter className="flex gap-2">
                <Button variant="outline" onClick={() => handleReject()} disabled={isSubmitting}>
                  Reject
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowReviewModal(false)
                    setShowRequestDocsModal(true)
                  }}
                >
                  Request More Documents
                </Button>
                <Button onClick={handleActivate} disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Activate
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Request More Documents Modal */}
      <Dialog open={showRequestDocsModal} onOpenChange={setShowRequestDocsModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-amber-100">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <DialogTitle>Action Required</DialogTitle>
                <DialogDescription>
                  Please upload additional or clearer documents to verify your residency.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Message to Resident (optional)</Label>
              <Textarea
                placeholder="Enter message..."
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRequestDocsModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleRequestMoreDocs} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Send Notification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-sm text-center">
          <div className="flex flex-col items-center py-4">
            <div className="p-4 rounded-full bg-green-100 mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <DialogTitle className="text-xl mb-2">Success!</DialogTitle>
            <DialogDescription>
              {selectedResident?.fullName} has been successfully activated as a resident.
            </DialogDescription>
          </div>
          <DialogFooter>
            <Button className="w-full" onClick={() => setShowSuccessModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
