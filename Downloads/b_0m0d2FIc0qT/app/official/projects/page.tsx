"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Search, 
  Eye,
  Plus,
  FolderKanban,
  Printer,
  Edit,
  MapPin,
  Calendar,
  Wallet
} from "lucide-react"

const mockProjects = [
  {
    id: "PRJ-2026-001",
    title: "Road Improvement Project",
    type: "Infrastructure",
    description: "This project aims to improve road accessibility in Purok 3 to ensure safer and more efficient transportation for residents.",
    location: "Purok 3, Barangay Santiago",
    startDate: "January 10, 2026",
    targetCompletion: "March 30, 2026",
    status: "Ongoing",
    progress: 65,
    budget: "150,000",
    source: "Barangay Development Fund",
    projectHead: "Juan Dela Cruz",
    projectHeadPosition: "Barangay Kagawad",
    beneficiaries: "Residents of Purok 3",
    remarks: "Project is progressing as scheduled with no major delays."
  },
  {
    id: "PRJ-2026-002",
    title: "Health Center Renovation",
    type: "Health",
    description: "Renovation of the barangay health center to provide better medical services to residents.",
    location: "Barangay Center",
    startDate: "November 1, 2025",
    targetCompletion: "February 28, 2026",
    status: "Completed",
    progress: 100,
    budget: "200,000",
    source: "LGU Support",
    projectHead: "Maria Santos",
    projectHeadPosition: "Barangay Kagawad - Health",
    beneficiaries: "All Barangay Santiago Residents",
    remarks: "Successfully completed ahead of schedule."
  },
  {
    id: "PRJ-2026-003",
    title: "Solar Street Lights Installation",
    type: "Infrastructure",
    description: "Installation of solar-powered street lights along the main road.",
    location: "Main Road, Barangay Santiago",
    startDate: "May 1, 2026",
    targetCompletion: "June 30, 2026",
    status: "Planned",
    progress: 0,
    budget: "100,000",
    source: "Barangay Fund",
    projectHead: "Pedro Reyes",
    projectHeadPosition: "Barangay Treasurer",
    beneficiaries: "All Residents",
    remarks: "Awaiting procurement of materials."
  },
]

const projectTypes = ["Infrastructure", "Health", "Education", "Environment", "Peace and Order", "Social Welfare"]

function getStatusBadge(status: string) {
  switch (status) {
    case "Completed":
      return <Badge className="bg-emerald-100 text-emerald-700">{status}</Badge>
    case "Ongoing":
      return <Badge className="bg-blue-100 text-blue-700">{status}</Badge>
    case "Planned":
      return <Badge variant="outline">{status}</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function OfficialProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProject, setSelectedProject] = useState<typeof mockProjects[0] | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showPrintPreview, setShowPrintPreview] = useState(false)

  const ongoingCount = mockProjects.filter(p => p.status === "Ongoing").length
  const completedCount = mockProjects.filter(p => p.status === "Completed").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Community Projects</h1>
          <p className="text-muted-foreground">Create and manage barangay projects</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Add a new community project
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4 pr-4">
                <div className="space-y-2">
                  <Label>Project Title</Label>
                  <Input placeholder="Enter project title" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Project Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectTypes.map((type) => (
                          <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input placeholder="e.g., Purok 3" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Project description..." rows={3} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>Target Completion</Label>
                    <Input type="date" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Total Budget (PHP)</Label>
                    <Input placeholder="e.g., 100000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Source of Funds</Label>
                    <Input placeholder="e.g., Barangay Fund" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Project Head</Label>
                    <Input placeholder="Assigned official name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Position</Label>
                    <Input placeholder="e.g., Barangay Kagawad" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Beneficiaries</Label>
                  <Input placeholder="Who will benefit from this project?" />
                </div>
                <div className="space-y-2">
                  <Label>Remarks (Optional)</Label>
                  <Textarea placeholder="Additional notes..." rows={2} />
                </div>
              </div>
            </ScrollArea>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
              <Button>Create Project</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-2">
                <FolderKanban className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <p className="text-2xl font-bold">{ongoingCount}</p>
                <p className="text-sm text-muted-foreground">Ongoing</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-emerald-100 p-2">
                <FolderKanban className="h-5 w-5 text-emerald-700" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedCount}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-gray-100 p-2">
                <FolderKanban className="h-5 w-5 text-gray-700" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockProjects.filter(p => p.status === "Planned").length}</p>
                <p className="text-sm text-muted-foreground">Planned</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-2">
                <FolderKanban className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockProjects.length}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Search projects..." 
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Projects Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockProjects.map((project) => (
          <Card key={project.id} className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{project.type}</Badge>
                {getStatusBadge(project.status)}
              </div>
              <CardTitle className="text-lg leading-tight">{project.title}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {project.location}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Wallet className="h-3 w-3" />
                  PHP {project.budget}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {project.targetCompletion}
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedProject(project)}
                >
                  <Eye className="mr-1 h-3 w-3" />
                  View
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="mr-1 h-3 w-3" />
                  Update
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSelectedProject(project)
                    setShowPrintPreview(true)
                  }}
                >
                  <Printer className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Project Details Modal */}
      <Dialog open={!!selectedProject && !showPrintPreview} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Project Details</DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4 pr-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{selectedProject.type}</Badge>
                  {getStatusBadge(selectedProject.status)}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedProject.title}</h3>
                  <p className="text-muted-foreground">{selectedProject.id}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{selectedProject.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Project Head</p>
                    <p className="font-medium">{selectedProject.projectHead}</p>
                    <p className="text-sm text-muted-foreground">{selectedProject.projectHeadPosition}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-medium">{selectedProject.startDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Target Completion</p>
                    <p className="font-medium">{selectedProject.targetCompletion}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="font-medium">PHP {selectedProject.budget}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fund Source</p>
                    <p className="font-medium">{selectedProject.source}</p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="mt-1">{selectedProject.description}</p>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">Beneficiaries</p>
                  <p className="mt-1">{selectedProject.beneficiaries}</p>
                </div>
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Progress</p>
                    <p className="font-medium">{selectedProject.progress}%</p>
                  </div>
                  <Progress value={selectedProject.progress} />
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">Remarks</p>
                  <p className="mt-1">{selectedProject.remarks}</p>
                </div>
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedProject(null)}>Close</Button>
            <Button variant="outline">Update Progress</Button>
            <Button onClick={() => setShowPrintPreview(true)}>
              <Printer className="mr-2 h-4 w-4" />
              Print Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Print Preview Modal */}
      <Dialog open={showPrintPreview} onOpenChange={setShowPrintPreview}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Project Report Preview</DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <ScrollArea className="max-h-[70vh]">
              <div className="rounded-lg border bg-white p-8 text-black">
                <div className="text-center space-y-1 mb-6">
                  <p className="text-sm">Republic of the Philippines</p>
                  <p className="text-sm">Province of Zambales</p>
                  <p className="text-sm">Municipality of San Antonio</p>
                  <p className="text-sm font-semibold">Barangay Santiago</p>
                </div>
                <h2 className="text-center text-lg font-bold mb-6 border-t border-b py-4">BARANGAY PROJECT REPORT</h2>
                <div className="space-y-4 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600">Project Title:</p>
                      <p className="font-bold">{selectedProject.title}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Project Type:</p>
                      <p className="font-medium">{selectedProject.type}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600">Location:</p>
                    <p className="font-medium">{selectedProject.location}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600">Start Date:</p>
                      <p className="font-medium">{selectedProject.startDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Target Completion:</p>
                      <p className="font-medium">{selectedProject.targetCompletion}</p>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <p className="font-semibold">PROJECT DESCRIPTION</p>
                    <p className="mt-1">{selectedProject.description}</p>
                  </div>
                  <div className="border-t pt-4">
                    <p className="font-semibold">BUDGET DETAILS</p>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <p>Total Budget: <strong>PHP {selectedProject.budget}</strong></p>
                      </div>
                      <div>
                        <p>Source: <strong>{selectedProject.source}</strong></p>
                      </div>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <p className="font-semibold">PROJECT STATUS</p>
                    <p>Status: <strong>{selectedProject.status}</strong></p>
                    <p>Progress: <strong>{selectedProject.progress}%</strong></p>
                  </div>
                  <div className="border-t pt-4">
                    <p className="font-semibold">PROJECT HEAD</p>
                    <p className="font-bold">{selectedProject.projectHead}</p>
                    <p>{selectedProject.projectHeadPosition}</p>
                  </div>
                  <div className="border-t pt-4">
                    <p className="font-semibold">BENEFICIARIES</p>
                    <p>{selectedProject.beneficiaries}</p>
                  </div>
                  <div className="border-t pt-4">
                    <p className="font-semibold">REMARKS</p>
                    <p>{selectedProject.remarks}</p>
                  </div>
                </div>
                <div className="mt-12 grid grid-cols-2 gap-8 text-center text-sm">
                  <div>
                    <p className="border-t border-black pt-1">Prepared by</p>
                  </div>
                  <div>
                    <p className="border-t border-black pt-1 font-semibold">ROLANDO C. BORJA</p>
                    <p>Punong Barangay</p>
                    <p className="text-xs text-gray-600 mt-1">Approved by</p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPrintPreview(false)}>Close</Button>
            <Button onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" />
              Print Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
