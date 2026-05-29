"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  CheckCircle2,
  Shield,
  FileText,
  Users,
  Search,
  UserPlus,
  Clock,
  Trash2,
  AlertTriangle,
  Eye
} from "lucide-react"

// Mock user data
const mockUser = {
  id: "resident-001",
  firstName: "Juan",
  middleName: "Santos",
  lastName: "Dela Cruz",
  suffix: "",
  birthDate: "1990-05-15",
  gender: "Male",
  civilStatus: "Married",
  email: "juan.delacruz@email.com",
  phone: "09123456789",
  address: "Purok 3, Barangay Santiago",
  municipality: "San Antonio",
  province: "Zambales",
  zipCode: "2206",
  occupation: "Teacher",
  employer: "San Antonio National High School",
  registrationDate: "January 15, 2024",
  verificationStatus: "verified",
  avatar: "/placeholder-avatar.jpg",
  birthCertificate: "/documents/birth-certificate.pdf",
  validId: "/documents/valid-id.pdf"
}

// Mock family members with personal info
const mockFamilyMembers = [
  {
    id: "resident-002",
    name: "Maria Dela Cruz",
    relationship: "Spouse",
    status: "accepted",
    avatar: null,
    firstName: "Maria",
    middleName: "Santos",
    lastName: "Dela Cruz",
    suffix: "",
    birthDate: "1992-08-20",
    gender: "Female",
    civilStatus: "Married"
  },
  {
    id: "resident-003",
    name: "Pedro Dela Cruz Jr.",
    relationship: "Son",
    status: "accepted",
    avatar: null,
    firstName: "Pedro",
    middleName: "Santos",
    lastName: "Dela Cruz",
    suffix: "Jr.",
    birthDate: "2015-03-10",
    gender: "Male",
    civilStatus: "Single"
  }
]

// Mock pending family requests
const mockPendingRequests = [
  {
    id: "resident-004",
    name: "Ana Santos",
    relationship: "Sister",
    requestedBy: "Ana Santos",
    status: "pending"
  }
]

// Mock search results
const mockSearchResults = [
  { id: "resident-005", name: "Jose Dela Cruz", address: "Purok 2, Barangay Santiago" },
  { id: "resident-006", name: "Rosa Dela Cruz", address: "Purok 4, Barangay Santiago" },
]

export default function ProfilePage() {
  const [formData] = useState(mockUser)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showAddFamilyDialog, setShowAddFamilyDialog] = useState(false)
  const [showDocumentPreview, setShowDocumentPreview] = useState<string | null>(null)
  const [familySearch, setFamilySearch] = useState("")
  const [searchResults, setSearchResults] = useState<typeof mockSearchResults>([])
  const [selectedRelationship, setSelectedRelationship] = useState("")
  const [selectedFamilyMember, setSelectedFamilyMember] = useState<typeof mockFamilyMembers[0] | null>(null)

  const handleFamilySearch = () => {
    if (familySearch.trim()) {
      // Mock search - in real app, this would query the database
      setSearchResults(mockSearchResults.filter(r => 
        r.name.toLowerCase().includes(familySearch.toLowerCase())
      ))
    }
  }

  const handleSendFamilyRequest = (residentId: string) => {
    // Handle sending family request
    setShowAddFamilyDialog(false)
    setFamilySearch("")
    setSearchResults([])
    setSelectedRelationship("")
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">My Profile</h1>
        <p className="text-sm text-muted-foreground">View your personal information</p>
      </div>

      {/* Profile Header Card */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="relative">
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24 ring-4 ring-primary/20">
                <AvatarImage src={formData.avatar} alt="Profile" />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl sm:text-2xl">
                  {formData.firstName[0]}{formData.lastName[0]}
                </AvatarFallback>
              </Avatar>
              {formData.verificationStatus === "verified" && (
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              )}
            </div>
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-xl sm:text-2xl font-bold">
                {formData.firstName} {formData.middleName} {formData.lastName} {formData.suffix}
              </h2>
              <p className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1 mt-1">
                <MapPin className="h-4 w-4" />
                {formData.address}, {formData.municipality}, {formData.province}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                <Badge className="bg-emerald-100 text-emerald-700">
                  <Shield className="mr-1 h-3 w-3" />
                  Verified Resident
                </Badge>
                <Badge variant="outline">
                  Since {formData.registrationDate}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Details */}
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="personal" className="text-xs sm:text-sm">Personal</TabsTrigger>
          <TabsTrigger value="contact" className="text-xs sm:text-sm">Contact</TabsTrigger>
          <TabsTrigger value="employment" className="text-xs sm:text-sm">Employment</TabsTrigger>
          <TabsTrigger value="family" className="text-xs sm:text-sm">Family</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-4">
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
                Personal Information
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Your basic personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">First Name</Label>
                  <p className="text-sm font-medium p-2 bg-muted rounded-md">{formData.firstName}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Middle Name</Label>
                  <p className="text-sm font-medium p-2 bg-muted rounded-md">{formData.middleName}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Last Name</Label>
                  <p className="text-sm font-medium p-2 bg-muted rounded-md">{formData.lastName}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Suffix</Label>
                  <p className="text-sm font-medium p-2 bg-muted rounded-md">{formData.suffix || "N/A"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Birth Date</Label>
                  <p className="text-sm font-medium p-2 bg-muted rounded-md flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {new Date(formData.birthDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Gender</Label>
                  <p className="text-sm font-medium p-2 bg-muted rounded-md">{formData.gender}</p>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-xs sm:text-sm">Civil Status</Label>
                  <p className="text-sm font-medium p-2 bg-muted rounded-md">{formData.civilStatus}</p>
                </div>
              </div>

              {/* Uploaded Documents */}
              <div className="border-t pt-4 mt-4">
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Registration Documents
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowDocumentPreview("birth-certificate")}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Birth Certificate</p>
                      <p className="text-xs text-muted-foreground">Click to view</p>
                    </div>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => setShowDocumentPreview("valid-id")}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Valid ID</p>
                      <p className="text-xs text-muted-foreground">Click to view</p>
                    </div>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="mt-4">
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                Contact Information
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Your contact details and address</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Email Address</Label>
                  <p className="text-sm font-medium p-2 bg-muted rounded-md flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {formData.email}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Phone Number</Label>
                  <p className="text-sm font-medium p-2 bg-muted rounded-md flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {formData.phone}
                  </p>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-xs sm:text-sm">Complete Address</Label>
                  <p className="text-sm font-medium p-2 bg-muted rounded-md flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {formData.address}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Municipality</Label>
                  <p className="text-sm font-medium p-2 bg-muted rounded-md">{formData.municipality}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Province</Label>
                  <p className="text-sm font-medium p-2 bg-muted rounded-md">{formData.province}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Zip Code</Label>
                  <p className="text-sm font-medium p-2 bg-muted rounded-md">{formData.zipCode}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employment" className="mt-4">
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                Employment Information
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Your work and occupation details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Occupation</Label>
                  <p className="text-sm font-medium p-2 bg-muted rounded-md">{formData.occupation}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Employer / Company</Label>
                  <p className="text-sm font-medium p-2 bg-muted rounded-md">{formData.employer}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="family" className="mt-4 space-y-4">
          {/* Add Family Button */}
          <div className="flex justify-end">
            <Button onClick={() => setShowAddFamilyDialog(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Family Member
            </Button>
          </div>

          {/* Pending Requests */}
          {mockPendingRequests.length > 0 && (
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                  Pending Requests
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">Family connection requests awaiting your approval</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockPendingRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 rounded-lg border bg-amber-50">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{request.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{request.name}</p>
                          <p className="text-xs text-muted-foreground">Wants to add you as: {request.relationship}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-xs">
                          Decline
                        </Button>
                        <Button size="sm" className="text-xs">
                          Accept
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Family Members */}
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                Family Members
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Your connected family members in the barangay database
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mockFamilyMembers.length > 0 ? (
                <div className="space-y-3">
                  {mockFamilyMembers.map((member) => (
                    <button
                      key={member.id} 
                      className="w-full flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors text-left"
                      onClick={() => setSelectedFamilyMember(member)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.relationship}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-emerald-100 text-emerald-700">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Connected
                        </Badge>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No family members connected yet</p>
                  <p className="text-xs">Search and add family members from the barangay database</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Account Actions Section */}
      <Card className="border-destructive/20">
        <CardContent className="p-4 sm:p-6">
          <p className="text-sm text-muted-foreground">
            If you want to delete your account,{" "}
            <button 
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive hover:underline font-medium"
            >
              delete account
            </button>
          </p>
        </CardContent>
      </Card>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Account
            </DialogTitle>
            <DialogDescription>
              To delete your account, please follow these steps:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <div className="flex gap-3 p-3 rounded-lg bg-muted">
                <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="text-sm font-medium">Bring Required Documents</p>
                  <p className="text-xs text-muted-foreground">
                    Prepare the documents you used during registration (Valid ID, Birth Certificate, etc.)
                  </p>
                </div>
              </div>
              <div className="flex gap-3 p-3 rounded-lg bg-muted">
                <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="text-sm font-medium">Visit Barangay Hall</p>
                  <p className="text-xs text-muted-foreground">
                    Go to the Barangay Santiago Office during office hours (8:00 AM - 5:00 PM, Monday to Friday)
                  </p>
                </div>
              </div>
              <div className="flex gap-3 p-3 rounded-lg bg-muted">
                <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="text-sm font-medium">Verification by Official</p>
                  <p className="text-xs text-muted-foreground">
                    A barangay official or staff will verify your identity and process your account deletion request
                  </p>
                </div>
              </div>
              <div className="flex gap-3 p-3 rounded-lg bg-muted">
                <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <p className="text-sm font-medium">Account Deletion</p>
                  <p className="text-xs text-muted-foreground">
                    Once verified, your account and all associated data will be permanently deleted
                  </p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-xs text-amber-800 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Important:</strong> This action cannot be undone. All your data including document requests, 
                  blotter reports, and family connections will be permanently removed.
                </span>
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="w-full">
              I Understand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Family Member Dialog */}
      <Dialog open={showAddFamilyDialog} onOpenChange={(open) => {
        setShowAddFamilyDialog(open)
        if (!open) {
          setFamilySearch("")
          setSearchResults([])
          setSelectedRelationship("")
        }
      }}>
        <DialogContent className="max-w-md max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Add Family Member
            </DialogTitle>
            <DialogDescription>
              Search for a registered resident to add as a family member
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Search Resident</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter name..." 
                    value={familySearch}
                    onChange={(e) => setFamilySearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleFamilySearch()}
                  />
                  <Button variant="outline" onClick={handleFamilySearch}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-2">
                  <Label>Search Results</Label>
                  <div className="space-y-2">
                    {searchResults.map((result) => (
                      <div 
                        key={result.id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{result.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{result.name}</p>
                            <p className="text-xs text-muted-foreground">{result.address}</p>
                          </div>
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => handleSendFamilyRequest(result.id)}
                        >
                          <UserPlus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {familySearch && searchResults.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  <Search className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No residents found</p>
                  <p className="text-xs">Try a different search term</p>
                </div>
              )}

              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong>Note:</strong> When you send a family request, the other resident will receive a 
                  notification. Once they accept, you will be able to see their basic information (name, 
                  relationship) but not their complete personal details.
                </p>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddFamilyDialog(false)
              setFamilySearch("")
              setSearchResults([])
            }} className="w-full">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Preview Dialog */}
      <Dialog open={!!showDocumentPreview} onOpenChange={() => setShowDocumentPreview(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {showDocumentPreview === "birth-certificate" ? "Birth Certificate" : "Valid ID"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-8 bg-muted rounded-lg min-h-[300px]">
            <div className="text-center text-muted-foreground">
              <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-sm">Document Preview</p>
              <p className="text-xs">Your uploaded {showDocumentPreview === "birth-certificate" ? "birth certificate" : "valid ID"} will be displayed here</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDocumentPreview(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Family Member Info Dialog */}
      <Dialog open={!!selectedFamilyMember} onOpenChange={() => setSelectedFamilyMember(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </DialogTitle>
            <DialogDescription>Basic personal details</DialogDescription>
          </DialogHeader>
          {selectedFamilyMember && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4 pb-4 border-b">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {selectedFamilyMember.firstName[0]}{selectedFamilyMember.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg">{selectedFamilyMember.name}</p>
                  <Badge variant="outline">{selectedFamilyMember.relationship}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">First Name</Label>
                  <p className="text-sm font-medium">{selectedFamilyMember.firstName}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Middle Name</Label>
                  <p className="text-sm font-medium">{selectedFamilyMember.middleName}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Last Name</Label>
                  <p className="text-sm font-medium">{selectedFamilyMember.lastName}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Suffix</Label>
                  <p className="text-sm font-medium">{selectedFamilyMember.suffix || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Birth Date</Label>
                  <p className="text-sm font-medium">
                    {new Date(selectedFamilyMember.birthDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Gender</Label>
                  <p className="text-sm font-medium">{selectedFamilyMember.gender}</p>
                </div>
                <div className="space-y-1 col-span-2">
                  <Label className="text-xs text-muted-foreground">Civil Status</Label>
                  <p className="text-sm font-medium">{selectedFamilyMember.civilStatus}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedFamilyMember(null)} className="w-full">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
