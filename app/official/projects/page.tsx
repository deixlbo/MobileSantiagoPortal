"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { printElementById } from "@/lib/utils"
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

// Document Header Component with Logos - Only visible when printing
function DocumentHeader({ printOnly = false }: { printOnly?: boolean }) {
  return (
    <div className={`flex items-center justify-between mb-4 p-4 border-b ${printOnly ? 'hidden print:flex' : ''}`}>
      <Image src="/images/santiagologo.jpg" alt="Barangay Santiago" width={60} height={60} className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover shrink-0" />
      <div className="text-center flex-1 px-2">
        <p className="text-[10px] md:text-xs text-muted-foreground print:text-black">Republic of the Philippines</p>
        <p className="text-[10px] md:text-xs text-muted-foreground print:text-black">Province of Zambales</p>
        <p className="text-[10px] md:text-xs text-muted-foreground print:text-black">Municipality of San Antonio</p>
        <p className="text-xs md:text-sm font-semibold print:text-black">Barangay Santiago</p>
      </div>
      <Image src="/images/saz.jpg" alt="Municipality" width={60} height={60} className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover shrink-0" />
    </div>
  )
}

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
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Project Report Preview</DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <ScrollArea className="max-h-[70vh]">
              <div id="print-content" className="rounded-lg border bg-white p-6 md:p-8 text-black print:p-0 print:border-0 print-only">
                {/* Document Title */}
                <h2 className="text-center text-base md:text-lg font-bold mb-6 py-3 border-y-2 border-black print:text-black">
                  PROJECT REPORT
                </h2>
                
                {/* Project Reference */}
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm print:text-black"><strong>Reference No:</strong> {selectedProject.id}</p>
                  <Badge className={`print:border print:border-black ${
                    selectedProject.status === "Completed" ? "bg-emerald-100 text-emerald-700" :
                    selectedProject.status === "Ongoing" ? "bg-blue-100 text-blue-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>{selectedProject.status}</Badge>
                </div>

                {/* Main Content */}
                <div className="space-y-5 text-sm">
                  {/* Project Info Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg print:bg-white print:border print:border-gray-300">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide print:text-gray-600">Project Title</p>
                      <p className="font-bold text-base print:text-black">{selectedProject.title}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide print:text-gray-600">Project Type</p>
                      <p className="font-semibold print:text-black">{selectedProject.type}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wide print:text-gray-600">Location</p>
                      <p className="font-semibold print:text-black">{selectedProject.location}</p>
                    </div>
                  </div>

                  {/* Timeline Section */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 border rounded-lg print:border-gray-300">
                      <p className="text-xs text-gray-500 uppercase tracking-wide print:text-gray-600">Start Date</p>
                      <p className="font-semibold print:text-black">{selectedProject.startDate}</p>
                    </div>
                    <div className="p-3 border rounded-lg print:border-gray-300">
                      <p className="text-xs text-gray-500 uppercase tracking-wide print:text-gray-600">Target Completion</p>
                      <p className="font-semibold print:text-black">{selectedProject.targetCompletion}</p>
                    </div>
                  </div>

                  {/* Description Section */}
                  <div className="border-t pt-4">
                    <p className="font-bold text-sm uppercase tracking-wide mb-2 print:text-black">Project Description</p>
                    <p className="leading-relaxed print:text-black">{selectedProject.description}</p>
                  </div>

                  {/* Budget Section */}
                  <div className="border-t pt-4">
                    <p className="font-bold text-sm uppercase tracking-wide mb-3 print:text-black">Budget Details</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-green-50 rounded-lg print:bg-white print:border print:border-gray-300">
                        <p className="text-xs text-gray-500 print:text-gray-600">Total Budget</p>
                        <p className="font-bold text-lg text-green-700 print:text-black">PHP {selectedProject.budget}</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg print:bg-white print:border print:border-gray-300">
                        <p className="text-xs text-gray-500 print:text-gray-600">Fund Source</p>
                        <p className="font-semibold print:text-black">{selectedProject.source}</p>
                      </div>
                    </div>
                  </div>

                  {/* Status Section */}
                  <div className="border-t pt-4">
                    <p className="font-bold text-sm uppercase tracking-wide mb-3 print:text-black">Project Status</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 print:text-gray-600">Current Status</p>
                        <p className="font-semibold print:text-black">{selectedProject.status}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 print:text-gray-600">Progress</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden print:border print:border-gray-400">
                            <div className="h-full bg-green-600 print:bg-gray-600" style={{ width: `${selectedProject.progress}%` }} />
                          </div>
                          <span className="font-bold print:text-black">{selectedProject.progress}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Project Head & Beneficiaries */}
                  <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-bold text-sm uppercase tracking-wide mb-2 print:text-black">Project Head</p>
                      <p className="font-semibold print:text-black">{selectedProject.projectHead}</p>
                      <p className="text-gray-600 text-xs print:text-gray-600">{selectedProject.projectHeadPosition}</p>
                    </div>
                    <div>
                      <p className="font-bold text-sm uppercase tracking-wide mb-2 print:text-black">Beneficiaries</p>
                      <p className="print:text-black">{selectedProject.beneficiaries}</p>
                    </div>
                  </div>

                  {/* Remarks Section */}
                  <div className="border-t pt-4">
                    <p className="font-bold text-sm uppercase tracking-wide mb-2 print:text-black">Remarks</p>
                    <p className="leading-relaxed print:text-black">{selectedProject.remarks || "No remarks"}</p>
                  </div>

                  {/* Signature Section */}
                  <div className="mt-10 pt-8 border-t">
                    <p className="text-xs text-gray-500 mb-6 text-center print:text-gray-600">Prepared and Certified Correct:</p>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="text-center">
                        <div className="border-b border-black mx-4 md:mx-8 mb-1 h-8" />
                        <p className="font-semibold text-sm print:text-black">{selectedProject.projectHead}</p>
                        <p className="text-xs text-gray-600 print:text-gray-600">{selectedProject.projectHeadPosition}</p>
                      </div>
                      <div className="text-center">
                        <div className="border-b border-black mx-4 md:mx-8 mb-1 h-8" />
                        <p className="font-semibold text-sm print:text-black">Rolando C. Borja</p>
                        <p className="text-xs text-gray-600 print:text-gray-600">Barangay Captain</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-8 pt-4 border-t text-center text-xs text-gray-500 print:text-gray-600">
                    <p>This document is generated by the Barangay Santiago Management System</p>
                    <p>Date Generated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowPrintPreview(false)}>Close</Button>
            <Button onClick={() => printElementById('print-content')}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
