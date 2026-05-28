"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Search, 
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  Download,
  FileText,
  Filter,
  Home,
  Plus,
  UserPlus,
  ChevronRight,
  Trash2
} from "lucide-react"

// Type for family members
type FamilyMember = {
  id: string
  name: string
  relationship: string
  age: number
  gender: string
  occupation?: string
}

// Type for resident with family
type Resident = {
  id: string
  name: string
  email: string
  purok: string
  gender: string
  age: number
  status: string
  documentType: string
  registeredDate: string
  remarks?: string
  householdId?: string
  isHouseholdHead?: boolean
  familyMembers?: FamilyMember[]
}

// Type for household
type Household = {
  id: string
  householdNumber: string
  address: string
  purok: string
  headOfFamily: string
  headId: string
  totalMembers: number
  members: FamilyMember[]
  registeredDate: string
}

const mockResidents: Resident[] = [
  {
    id: "RES-001",
    name: "Juan Dela Cruz",
    email: "juan@example.com",
    purok: "Purok 3",
    gender: "Male",
    age: 45,
    status: "verified",
    documentType: "Valid ID",
    registeredDate: "April 15, 2026",
    householdId: "HH-001",
    isHouseholdHead: true,
    familyMembers: [
      { id: "FM-001", name: "Maria Dela Cruz", relationship: "Spouse", age: 42, gender: "Female", occupation: "Housewife" },
      { id: "FM-002", name: "Jose Dela Cruz", relationship: "Son", age: 20, gender: "Male", occupation: "Student" },
      { id: "FM-003", name: "Anna Dela Cruz", relationship: "Daughter", age: 17, gender: "Female", occupation: "Student" },
    ]
  },
  {
    id: "RES-002",
    name: "Maria Santos",
    email: "maria@example.com",
    purok: "Purok 1",
    gender: "Female",
    age: 19,
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
    age: 35,
    status: "verified",
    documentType: "Voter's ID",
    registeredDate: "April 27, 2026",
    householdId: "HH-002",
    isHouseholdHead: true,
    familyMembers: [
      { id: "FM-004", name: "Lorna Reyes", relationship: "Spouse", age: 33, gender: "Female", occupation: "Teacher" },
      { id: "FM-005", name: "Miguel Reyes", relationship: "Son", age: 8, gender: "Male", occupation: "Student" },
    ]
  },
  {
    id: "RES-004",
    name: "Ana Garcia",
    email: "ana@example.com",
    purok: "Purok 4",
    gender: "Female",
    age: 52,
    status: "verified",
    documentType: "Valid ID",
    registeredDate: "March 10, 2026",
    householdId: "HH-003",
    isHouseholdHead: true,
    familyMembers: [
      { id: "FM-006", name: "Roberto Garcia", relationship: "Spouse", age: 55, gender: "Male", occupation: "Farmer" },
    ]
  },
  {
    id: "RES-005",
    name: "Carlos Mendoza",
    email: "carlos@example.com",
    purok: "Purok 5",
    gender: "Male",
    age: 28,
    status: "declined",
    documentType: "Birth Certificate",
    remarks: "Invalid document uploaded",
    registeredDate: "April 20, 2026"
  },
]

const mockHouseholds: Household[] = [
  {
    id: "HH-001",
    householdNumber: "HH-2026-001",
    address: "123 Main Street",
    purok: "Purok 3",
    headOfFamily: "Juan Dela Cruz",
    headId: "RES-001",
    totalMembers: 4,
    members: [
      { id: "RES-001", name: "Juan Dela Cruz", relationship: "Head", age: 45, gender: "Male", occupation: "Farmer" },
      { id: "FM-001", name: "Maria Dela Cruz", relationship: "Spouse", age: 42, gender: "Female", occupation: "Housewife" },
      { id: "FM-002", name: "Jose Dela Cruz", relationship: "Son", age: 20, gender: "Male", occupation: "Student" },
      { id: "FM-003", name: "Anna Dela Cruz", relationship: "Daughter", age: 17, gender: "Female", occupation: "Student" },
    ],
    registeredDate: "April 15, 2026"
  },
  {
    id: "HH-002",
    householdNumber: "HH-2026-002",
    address: "456 Secondary Road",
    purok: "Purok 2",
    headOfFamily: "Pedro Reyes",
    headId: "RES-003",
    totalMembers: 3,
    members: [
      { id: "RES-003", name: "Pedro Reyes", relationship: "Head", age: 35, gender: "Male", occupation: "Carpenter" },
      { id: "FM-004", name: "Lorna Reyes", relationship: "Spouse", age: 33, gender: "Female", occupation: "Teacher" },
      { id: "FM-005", name: "Miguel Reyes", relationship: "Son", age: 8, gender: "Male", occupation: "Student" },
    ],
    registeredDate: "April 27, 2026"
  },
  {
    id: "HH-003",
    householdNumber: "HH-2026-003",
    address: "789 Coastal Ave",
    purok: "Purok 4",
    headOfFamily: "Ana Garcia",
    headId: "RES-004",
    totalMembers: 2,
    members: [
      { id: "RES-004", name: "Ana Garcia", relationship: "Head", age: 52, gender: "Female", occupation: "Vendor" },
      { id: "FM-006", name: "Roberto Garcia", relationship: "Spouse", age: 55, gender: "Male", occupation: "Farmer" },
    ],
    registeredDate: "March 10, 2026"
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
    case "declined":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 text-[10px] md:text-xs">
          <XCircle className="mr-1 h-2.5 w-2.5 md:h-3 md:w-3" />
          <span className="hidden sm:inline">Declined</span>
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
  const [residents, setResidents] = useState<Resident[]>(mockResidents)
  const [households, setHouseholds] = useState<Household[]>(mockHouseholds)
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null)
  const [selectedHousehold, setSelectedHousehold] = useState<Household | null>(null)
  const [selectedPuroks, setSelectedPuroks] = useState<string[]>([])
  const [selectedAgeRanges, setSelectedAgeRanges] = useState<string[]>([])
  const [activeMainTab, setActiveMainTab] = useState("residents")
  const [showAddFamilyMember, setShowAddFamilyMember] = useState(false)
  const [newFamilyMember, setNewFamilyMember] = useState({
    name: "",
    relationship: "",
    age: "",
    gender: "",
    occupation: ""
  })

  // Get unique puroks
  const puroks = Array.from(new Set(mockResidents.map(r => r.purok))).sort()

  // Age ranges for filtering
  const ageRanges = [
    { label: "18-21", min: 18, max: 21 },
    { label: "22-25", min: 22, max: 25 },
    { label: "26-30", min: 26, max: 30 },
    { label: "31+", min: 31, max: 999 }
  ]

  // Filter residents
  const filteredResidents = residents.filter(res => {
    const matchesSearch = res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPurok = selectedPuroks.length === 0 || selectedPuroks.includes(res.purok)
    let matchesAge = selectedAgeRanges.length === 0
    if (selectedAgeRanges.length > 0) {
      matchesAge = selectedAgeRanges.some(range => {
        const ageRange = ageRanges.find(ar => ar.label === range)
        return ageRange && res.age >= ageRange.min && res.age <= ageRange.max
      })
    }
    return matchesSearch && matchesPurok && matchesAge
  })

  // Filter households
  const filteredHouseholds = households.filter(hh => 
    hh.headOfFamily.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hh.householdNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hh.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate stats
  const maleCount = filteredResidents.filter(r => r.gender === "Male").length
  const femaleCount = filteredResidents.filter(r => r.gender === "Female").length
  const pendingCount = residents.filter(r => r.status === "pending").length
  const verifiedCount = residents.filter(r => r.status === "verified").length
  const totalHouseholds = households.length
  const totalPopulation = households.reduce((sum, hh) => sum + hh.totalMembers, 0)

  // Toggle purok selection
  const togglePurok = (purok: string) => {
    setSelectedPuroks(prev => 
      prev.includes(purok) ? prev.filter(p => p !== purok) : [...prev, purok]
    )
  }

  // Toggle age range selection
  const toggleAgeRange = (range: string) => {
    setSelectedAgeRanges(prev => 
      prev.includes(range) ? prev.filter(r => r !== range) : [...prev, range]
    )
  }

  // Reset filters
  const resetFilters = () => {
    setSelectedPuroks([])
    setSelectedAgeRanges([])
    setSearchTerm("")
  }

  // Add family member to resident
  const handleAddFamilyMember = () => {
    if (!selectedResident || !newFamilyMember.name || !newFamilyMember.relationship) return
    
    const newMember: FamilyMember = {
      id: `FM-${Date.now()}`,
      name: newFamilyMember.name,
      relationship: newFamilyMember.relationship,
      age: parseInt(newFamilyMember.age) || 0,
      gender: newFamilyMember.gender,
      occupation: newFamilyMember.occupation
    }

    const updatedResidents = residents.map(r => {
      if (r.id === selectedResident.id) {
        return {
          ...r,
          familyMembers: [...(r.familyMembers || []), newMember]
        }
      }
      return r
    })

    setResidents(updatedResidents)
    setSelectedResident({
      ...selectedResident,
      familyMembers: [...(selectedResident.familyMembers || []), newMember]
    })

    // Also update household if exists
    if (selectedResident.householdId) {
      const updatedHouseholds = households.map(hh => {
        if (hh.id === selectedResident.householdId) {
          return {
            ...hh,
            totalMembers: hh.totalMembers + 1,
            members: [...hh.members, newMember]
          }
        }
        return hh
      })
      setHouseholds(updatedHouseholds)
    }

    setNewFamilyMember({ name: "", relationship: "", age: "", gender: "", occupation: "" })
    setShowAddFamilyMember(false)
  }

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
          <p className="text-xs md:text-sm text-muted-foreground">Manage residents, households, and census data</p>
        </div>
        <Button variant="outline" size="sm" className="w-fit h-8 md:h-9 text-xs md:text-sm">
          <Download className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
          <span className="hidden md:inline">Export Census</span>
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4">
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="rounded-lg bg-primary/10 p-1.5 md:p-2">
                <Users className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              </div>
              <div>
                <p className="text-lg md:text-2xl font-bold">{filteredResidents.length}</p>
                <p className="text-[10px] md:text-sm text-muted-foreground">Residents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="rounded-lg bg-amber-100 p-1.5 md:p-2">
                <Home className="h-4 w-4 md:h-5 md:w-5 text-amber-700" />
              </div>
              <div>
                <p className="text-lg md:text-2xl font-bold">{totalHouseholds}</p>
                <p className="text-[10px] md:text-sm text-muted-foreground">Households</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="rounded-lg bg-blue-100 p-1.5 md:p-2">
                <Users className="h-4 w-4 md:h-5 md:w-5 text-blue-700" />
              </div>
              <div>
                <p className="text-lg md:text-2xl font-bold">{maleCount}</p>
                <p className="text-[10px] md:text-sm text-muted-foreground">Male</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="rounded-lg bg-pink-100 p-1.5 md:p-2">
                <Users className="h-4 w-4 md:h-5 md:w-5 text-pink-700" />
              </div>
              <div>
                <p className="text-lg md:text-2xl font-bold">{femaleCount}</p>
                <p className="text-[10px] md:text-sm text-muted-foreground">Female</p>
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
                <p className="text-lg md:text-2xl font-bold">{totalPopulation}</p>
                <p className="text-[10px] md:text-sm text-muted-foreground">Population</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Tabs: Residents vs Households */}
      <motion.div variants={itemVariants}>
        <Tabs value={activeMainTab} onValueChange={setActiveMainTab}>
          <TabsList className="h-10 w-full justify-start bg-muted/50">
            <TabsTrigger value="residents" className="text-sm px-4">
              <Users className="h-4 w-4 mr-2" />
              Residents
            </TabsTrigger>
            <TabsTrigger value="households" className="text-sm px-4">
              <Home className="h-4 w-4 mr-2" />
              Housing / Census
            </TabsTrigger>
          </TabsList>

          {/* Residents Tab Content */}
          <TabsContent value="residents" className="mt-4 space-y-4">
            {/* Filters */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filter by Purok
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-3">
                    {puroks.map((purok) => (
                      <label key={purok} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox 
                          checked={selectedPuroks.includes(purok)}
                          onCheckedChange={() => togglePurok(purok)}
                          className="h-4 w-4"
                        />
                        <span className="text-sm">{purok}</span>
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filter by Age
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-3">
                    {ageRanges.map((range) => (
                      <label key={range.label} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox 
                          checked={selectedAgeRanges.includes(range.label)}
                          onCheckedChange={() => toggleAgeRange(range.label)}
                          className="h-4 w-4"
                        />
                        <span className="text-sm">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Active Filters */}
            {(selectedPuroks.length > 0 || selectedAgeRanges.length > 0) && (
              <div className="flex items-center gap-2 flex-wrap p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {selectedPuroks.map(purok => (
                  <Badge key={purok} variant="secondary">{purok}</Badge>
                ))}
                {selectedAgeRanges.map(range => (
                  <Badge key={range} variant="secondary">{range} yrs</Badge>
                ))}
                <Button variant="ghost" size="sm" className="ml-auto text-xs" onClick={resetFilters}>
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search residents..." 
                className="pl-10 h-9 md:h-10 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Residents Table */}
            <Card>
              <CardHeader className="p-3 md:p-6 pb-2 md:pb-4">
                <CardTitle className="text-base md:text-lg">Resident List</CardTitle>
                <CardDescription className="text-xs md:text-sm">Click on a resident to view family members</CardDescription>
              </CardHeader>
              <CardContent className="p-3 md:p-6 pt-0">
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs md:text-sm">Name</TableHead>
                        <TableHead className="text-xs md:text-sm hidden sm:table-cell">Purok</TableHead>
                        <TableHead className="text-xs md:text-sm hidden md:table-cell">Family Members</TableHead>
                        <TableHead className="text-xs md:text-sm">Status</TableHead>
                        <TableHead className="text-xs md:text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredResidents.map((resident) => (
                        <TableRow key={resident.id}>
                          <TableCell className="font-medium text-xs md:text-sm py-2 md:py-4">
                            <div>
                              {resident.name}
                              {resident.isHouseholdHead && (
                                <Badge variant="outline" className="ml-2 text-[10px]">Head</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden sm:table-cell">{resident.purok}</TableCell>
                          <TableCell className="text-xs md:text-sm py-2 md:py-4 hidden md:table-cell">
                            {resident.familyMembers?.length || 0} members
                          </TableCell>
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
                                <Button size="sm" className="h-7 md:h-8 px-2 md:px-3 text-xs bg-emerald-600 hover:bg-emerald-700">
                                  <CheckCircle2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Households Tab Content */}
          <TabsContent value="households" className="mt-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search households..." 
                className="pl-10 h-9 md:h-10 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Households Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredHouseholds.map((household) => (
                <Card 
                  key={household.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedHousehold(household)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">{household.householdNumber}</Badge>
                      <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                        {household.totalMembers} members
                      </Badge>
                    </div>
                    <CardTitle className="text-base mt-2">{household.headOfFamily}</CardTitle>
                    <CardDescription className="text-xs">{household.address}, {household.purok}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Family Members:</p>
                      <div className="flex flex-wrap gap-1">
                        {household.members.slice(0, 3).map((member) => (
                          <Badge key={member.id} variant="secondary" className="text-[10px]">
                            {member.name.split(" ")[0]}
                          </Badge>
                        ))}
                        {household.members.length > 3 && (
                          <Badge variant="secondary" className="text-[10px]">
                            +{household.members.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t">
                      <p className="text-xs text-muted-foreground">Registered: {household.registeredDate}</p>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Resident Details Modal with Family Members */}
      <Dialog open={!!selectedResident} onOpenChange={() => setSelectedResident(null)}>
        <DialogContent className="w-[95vw] sm:w-full max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-base md:text-lg">Resident Profile</DialogTitle>
            <DialogDescription className="text-xs md:text-sm">
              View resident information and family members
            </DialogDescription>
          </DialogHeader>
          {selectedResident && (
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-4">
                {/* Basic Info */}
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedResident.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedResident.email}</p>
                  </div>
                  {getStatusBadge(selectedResident.status)}
                </div>

                <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Purok</p>
                    <p className="font-medium text-sm">{selectedResident.purok}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Age</p>
                    <p className="font-medium text-sm">{selectedResident.age} years old</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Gender</p>
                    <p className="font-medium text-sm">{selectedResident.gender}</p>
                  </div>
                </div>
                
                {/* Family Members Section */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <p className="font-semibold text-sm">Family Members</p>
                      <Badge variant="secondary" className="text-xs">
                        {selectedResident.familyMembers?.length || 0}
                      </Badge>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="h-8 text-xs"
                      onClick={() => setShowAddFamilyMember(true)}
                    >
                      <UserPlus className="h-3 w-3 mr-1" />
                      Add Member
                    </Button>
                  </div>

                  {selectedResident.familyMembers && selectedResident.familyMembers.length > 0 ? (
                    <div className="space-y-2">
                      {selectedResident.familyMembers.map((member) => (
                        <div 
                          key={member.id} 
                          className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-sm">{member.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {member.relationship} - {member.age} yrs - {member.gender}
                              {member.occupation && ` - ${member.occupation}`}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-[10px]">{member.relationship}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No family members added yet</p>
                      <p className="text-xs">Click Add Member to start building the household</p>
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedResident(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Family Member Dialog */}
      <Dialog open={showAddFamilyMember} onOpenChange={setShowAddFamilyMember}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Family Member</DialogTitle>
            <DialogDescription>
              Add a new family member to {selectedResident?.name}&apos;s household
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input 
                placeholder="Enter full name"
                value={newFamilyMember.name}
                onChange={(e) => setNewFamilyMember({...newFamilyMember, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Relationship</Label>
                <Select 
                  value={newFamilyMember.relationship} 
                  onValueChange={(v) => setNewFamilyMember({...newFamilyMember, relationship: v})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Spouse">Spouse</SelectItem>
                    <SelectItem value="Son">Son</SelectItem>
                    <SelectItem value="Daughter">Daughter</SelectItem>
                    <SelectItem value="Father">Father</SelectItem>
                    <SelectItem value="Mother">Mother</SelectItem>
                    <SelectItem value="Brother">Brother</SelectItem>
                    <SelectItem value="Sister">Sister</SelectItem>
                    <SelectItem value="Grandparent">Grandparent</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Age</Label>
                <Input 
                  type="number"
                  placeholder="Age"
                  value={newFamilyMember.age}
                  onChange={(e) => setNewFamilyMember({...newFamilyMember, age: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select 
                  value={newFamilyMember.gender} 
                  onValueChange={(v) => setNewFamilyMember({...newFamilyMember, gender: v})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Occupation</Label>
                <Input 
                  placeholder="e.g., Student"
                  value={newFamilyMember.occupation}
                  onChange={(e) => setNewFamilyMember({...newFamilyMember, occupation: e.target.value})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddFamilyMember(false)}>Cancel</Button>
            <Button onClick={handleAddFamilyMember}>Add Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Household Details Modal */}
      <Dialog open={!!selectedHousehold} onOpenChange={() => setSelectedHousehold(null)}>
        <DialogContent className="w-[95vw] sm:w-full max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-base md:text-lg">Household Census</DialogTitle>
            <DialogDescription className="text-xs md:text-sm">
              Complete household information and members
            </DialogDescription>
          </DialogHeader>
          {selectedHousehold && (
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-4">
                {/* Household Info */}
                <div className="grid gap-3 grid-cols-2">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Household Number</p>
                    <p className="font-semibold">{selectedHousehold.householdNumber}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Head of Family</p>
                    <p className="font-semibold">{selectedHousehold.headOfFamily}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 col-span-2">
                    <p className="text-xs text-muted-foreground">Address</p>
                    <p className="font-semibold">{selectedHousehold.address}, {selectedHousehold.purok}</p>
                  </div>
                </div>

                {/* Members Table */}
                <div className="border rounded-lg">
                  <div className="p-3 border-b bg-muted/30">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm">Household Members</p>
                      <Badge>{selectedHousehold.totalMembers} total</Badge>
                    </div>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Name</TableHead>
                        <TableHead className="text-xs">Relationship</TableHead>
                        <TableHead className="text-xs">Age</TableHead>
                        <TableHead className="text-xs">Gender</TableHead>
                        <TableHead className="text-xs hidden sm:table-cell">Occupation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedHousehold.members.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="text-xs font-medium">{member.name}</TableCell>
                          <TableCell className="text-xs">
                            <Badge variant={member.relationship === "Head" ? "default" : "secondary"} className="text-[10px]">
                              {member.relationship}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs">{member.age}</TableCell>
                          <TableCell className="text-xs">{member.gender}</TableCell>
                          <TableCell className="text-xs hidden sm:table-cell">{member.occupation || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Census Summary */}
                <div className="grid gap-3 grid-cols-3">
                  <div className="p-3 rounded-lg bg-blue-50 text-center">
                    <p className="text-lg font-bold text-blue-700">
                      {selectedHousehold.members.filter(m => m.gender === "Male").length}
                    </p>
                    <p className="text-xs text-blue-600">Male</p>
                  </div>
                  <div className="p-3 rounded-lg bg-pink-50 text-center">
                    <p className="text-lg font-bold text-pink-700">
                      {selectedHousehold.members.filter(m => m.gender === "Female").length}
                    </p>
                    <p className="text-xs text-pink-600">Female</p>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-50 text-center">
                    <p className="text-lg font-bold text-emerald-700">{selectedHousehold.totalMembers}</p>
                    <p className="text-xs text-emerald-600">Total</p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedHousehold(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
