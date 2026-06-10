"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Search, 
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  Download
} from "lucide-react"

const mockResidents = [
  {
    id: "RES-001",
    name: "Juan Dela Cruz",
    email: "juan@example.com",
    purok: "Purok 3",
    gender: "Male",
    status: "verified",
    documentType: "Valid ID",
    registeredDate: "April 15, 2026"
  },
  {
    id: "RES-002",
    name: "Maria Santos",
    email: "maria@example.com",
    purok: "Purok 1",
    gender: "Female",
    status: "pending",
    documentType: "Birth Certificate",
    registeredDate: "April 25, 2026"
  },
  {
    id: "RES-003",
    name: "Pedro Reyes",
    email: "pedro@example.com",
    purok: "Purok 2",
    gender: "Male",
    status: "pending",
    documentType: "Voter's ID",
    registeredDate: "April 27, 2026"
  },
  {
    id: "RES-004",
    name: "Ana Garcia",
    email: "ana@example.com",
    purok: "Purok 4",
    gender: "Female",
    status: "verified",
    documentType: "Valid ID",
    registeredDate: "March 10, 2026"
  },
  {
    id: "RES-005",
    name: "Carlos Mendoza",
    email: "carlos@example.com",
    purok: "Purok 5",
    gender: "Male",
    status: "rejected",
    documentType: "Birth Certificate",
    remarks: "Invalid document uploaded",
    registeredDate: "April 20, 2026"
  },
]

function getStatusBadge(status: string) {
  switch (status) {
    case "verified":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-[10px] md:text-xs">
          <CheckCircle2 className="mr-1 h-2.5 w-2.5 md:h-3 md:w-3" />
          <span className="hidden sm:inline">Verified</span>
          <span className="sm:hidden">OK</span>
        </Badge>
      )
    case "pending":
      return (
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-[10px] md:text-xs">
          <Clock className="mr-1 h-2.5 w-2.5 md:h-3 md:w-3" />
          <span className="hidden sm:inline">Pending</span>
          <span className="sm:hidden">Wait</span>
        </Badge>
      )
    case "rejected":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 text-[10px] md:text-xs">
          <XCircle className="mr-1 h-2.5 w-2.5 md:h-3 md:w-3" />
          <span className="hidden sm:inline">Rejected</span>
          <span className="sm:hidden">No</span>
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function ResidentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedResident, setSelectedResident] = useState<typeof mockResidents[0] | null>(null)

  const filteredResidents = mockResidents.filter(res => 
    res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    res.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    res.purok.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const pendingCount = mockResidents.filter(r => r.status === "pending").length
  const verifiedCount = mockResidents.filter(r => r.status === "verified").length

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 md:space-y-6"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Residents Management</h1>
          <p className="text-xs md:text-sm text-muted-foreground">Manage and verify resident accounts</p>
        </div>
        <Button variant="outline" size="sm" className="w-fit h-8 md:h-9 text-xs md:text-sm">
          <Download className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
          <span className="hidden md:inline">Export CSV</span>
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-2 md:gap-4">
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="rounded-lg bg-primary/10 p-1.5 md:p-2">
                <Users className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              </div>
              <div>
                <p className="text-lg md:text-2xl font-bold">{mockResidents.length}</p>
                <p className="text-[10px] md:text-sm text-muted-foreground">Total Residents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="rounded-lg bg-amber-100 p-1.5 md:p-2">
                <Clock className="h-4 w-4 md:h-5 md:w-5 text-amber-700" />
              </div>
              <div>
                <p className="text-lg md:text-2xl font-bold">{pendingCount}</p>
                <p className="text-[10px] md:text-sm text-muted-foreground">Pending Verification</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="rounded-lg bg-emerald-100 p-1.5 md:p-2">
                <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-emerald-700" />
              </div>
              <div>
                <p className="text-lg md:text-2xl font-bold">{verifiedCount}</p>
                <p className="text-[10px] md:text-sm text-muted-foreground">Verified</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search */}
      <motion.div variants={itemVariants} className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Search residents..." 
          className="pl-10 h-9 md:h-10 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </motion.div>

      {/* Residents Table */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="p-3 md:p-6 pb-2 md:pb-4">
            <CardTitle className="text-base md:text-lg">Resident List</CardTitle>
            <CardDescription className="text-xs md:text-sm">All registered residents in Barangay Santiago</CardDescription>
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-0 md:pt-0">
            <Tabs defaultValue="all">
              <TabsList className="h-8 md:h-9 text-xs md:text-sm w-full justify-start overflow-x-auto">
                <TabsTrigger value="all" className="text-xs md:text-sm px-2 md:px-3">All ({mockResidents.length})</TabsTrigger>
                <TabsTrigger value="pending" className="text-xs md:text-sm px-2 md:px-3">Pending ({pendingCount})</TabsTrigger>
                <TabsTrigger value="verified" className="text-xs md:text-sm px-2 md:px-3">Verified ({verifiedCount})</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-3 md:mt-4">
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs md:text-sm">Name</TableHead>
                        <TableHead className="text-xs md:text-sm hidden sm:table-cell">Email</TableHead>
                        <TableHead className="text-xs md:text-sm hidden md:table-cell">Purok</TableHead>
                        <TableHead className="text-xs md:text-sm">Status</TableHead>
                        <TableHead className="text-xs md:text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredResidents.map((resident) => (
                        <TableRow key={resident.id}>
                          <TableCell className="font-medium text-xs md:text-sm py-2 md:py-4">{resident.name}</TableCell>
                          <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden sm:table-cell">{resident.email}</TableCell>
                          <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden md:table-cell">{resident.purok}</TableCell>
                          <TableCell className="py-2 md:py-4">{getStatusBadge(resident.status)}</TableCell>
                          <TableCell className="py-2 md:py-4">
                            <div className="flex gap-1 md:gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="h-7 md:h-8 px-2 md:px-3 text-xs"
                                onClick={() => setSelectedResident(resident)}
                              >
                                <Eye className="h-3 w-3 md:mr-1" />
                                <span className="hidden md:inline">View</span>
                              </Button>
                              {resident.status === "pending" && (
                                <>
                                  <Button size="sm" className="h-7 md:h-8 px-2 md:px-3 text-xs bg-emerald-600 hover:bg-emerald-700">
                                    <CheckCircle2 className="h-3 w-3 md:mr-1" />
                                    <span className="hidden md:inline">Verify</span>
                                  </Button>
                                  <Button size="sm" variant="destructive" className="h-7 md:h-8 px-2 md:px-3 text-xs">
                                    <XCircle className="h-3 w-3 md:mr-1" />
                                    <span className="hidden lg:inline">Reject</span>
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              <TabsContent value="pending" className="mt-3 md:mt-4">
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs md:text-sm">Name</TableHead>
                        <TableHead className="text-xs md:text-sm hidden sm:table-cell">Email</TableHead>
                        <TableHead className="text-xs md:text-sm hidden md:table-cell">Document</TableHead>
                        <TableHead className="text-xs md:text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredResidents.filter(r => r.status === "pending").map((resident) => (
                        <TableRow key={resident.id}>
                          <TableCell className="font-medium text-xs md:text-sm py-2 md:py-4">{resident.name}</TableCell>
                          <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden sm:table-cell">{resident.email}</TableCell>
                          <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden md:table-cell">{resident.documentType}</TableCell>
                          <TableCell className="py-2 md:py-4">
                            <div className="flex gap-1 md:gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="h-7 md:h-8 px-2 md:px-3 text-xs"
                                onClick={() => setSelectedResident(resident)}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" className="h-7 md:h-8 px-2 md:px-3 text-xs bg-emerald-600 hover:bg-emerald-700">
                                <CheckCircle2 className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="destructive" className="h-7 md:h-8 px-2 md:px-3 text-xs">
                                <XCircle className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              <TabsContent value="verified" className="mt-3 md:mt-4">
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs md:text-sm">Name</TableHead>
                        <TableHead className="text-xs md:text-sm hidden sm:table-cell">Email</TableHead>
                        <TableHead className="text-xs md:text-sm hidden md:table-cell">Registered</TableHead>
                        <TableHead className="text-xs md:text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredResidents.filter(r => r.status === "verified").map((resident) => (
                        <TableRow key={resident.id}>
                          <TableCell className="font-medium text-xs md:text-sm py-2 md:py-4">{resident.name}</TableCell>
                          <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden sm:table-cell">{resident.email}</TableCell>
                          <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden md:table-cell">{resident.registeredDate}</TableCell>
                          <TableCell className="py-2 md:py-4">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="h-7 md:h-8 px-2 md:px-3 text-xs"
                              onClick={() => setSelectedResident(resident)}
                            >
                              <Eye className="h-3 w-3 md:mr-1" />
                              <span className="hidden md:inline">View Profile</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* Resident Details Modal */}
      <Dialog open={!!selectedResident} onOpenChange={() => setSelectedResident(null)}>
        <DialogContent className="max-w-lg mx-4 md:mx-auto">
          <DialogHeader>
            <DialogTitle className="text-base md:text-lg">Resident Details</DialogTitle>
            <DialogDescription className="text-xs md:text-sm">
              View resident information and verification status
            </DialogDescription>
          </DialogHeader>
          {selectedResident && (
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs md:text-sm text-muted-foreground">Status</span>
                {getStatusBadge(selectedResident.status)}
              </div>
              <div className="grid gap-3 md:gap-4 grid-cols-2">
                <div>
                  <p className="text-[10px] md:text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium text-sm md:text-base">{selectedResident.name}</p>
                </div>
                <div>
                  <p className="text-[10px] md:text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-sm md:text-base truncate">{selectedResident.email}</p>
                </div>
                <div>
                  <p className="text-[10px] md:text-sm text-muted-foreground">Purok</p>
                  <p className="font-medium text-sm md:text-base">{selectedResident.purok}</p>
                </div>
                <div>
                  <p className="text-[10px] md:text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium text-sm md:text-base">{selectedResident.gender}</p>
                </div>
                <div>
                  <p className="text-[10px] md:text-sm text-muted-foreground">Document Type</p>
                  <p className="font-medium text-sm md:text-base">{selectedResident.documentType}</p>
                </div>
                <div>
                  <p className="text-[10px] md:text-sm text-muted-foreground">Registered Date</p>
                  <p className="font-medium text-sm md:text-base">{selectedResident.registeredDate}</p>
                </div>
              </div>
              <div className="rounded-lg border p-3 md:p-4">
                <p className="text-xs md:text-sm text-muted-foreground mb-2">Uploaded Document</p>
                <div className="aspect-video rounded bg-muted flex items-center justify-center">
                  <span className="text-xs md:text-sm text-muted-foreground">Document Preview</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setSelectedResident(null)}>Close</Button>
            {selectedResident?.status === "pending" && (
              <>
                <Button variant="destructive" size="sm">Reject</Button>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">Verify</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
