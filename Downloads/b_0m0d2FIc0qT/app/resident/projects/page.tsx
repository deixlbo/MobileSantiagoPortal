"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Search, Eye, Printer, FolderKanban, MapPin, Calendar, Wallet } from "lucide-react"

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
    description: "Installation of solar-powered street lights along the main road for improved safety and visibility at night.",
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
  {
    id: "PRJ-2026-004",
    title: "Community Watch Program",
    type: "Peace and Order",
    description: "Establishment of a community watch program to enhance peace and security in all puroks.",
    location: "All Puroks",
    startDate: "February 1, 2026",
    targetCompletion: "December 31, 2026",
    status: "Ongoing",
    progress: 45,
    budget: "50,000",
    source: "Barangay Fund",
    projectHead: "Juan Dela Cruz",
    projectHeadPosition: "Barangay Kagawad - Peace and Order",
    beneficiaries: "All Residents",
    remarks: "Volunteer recruitment ongoing in Puroks 4-6."
  },
]

function getStatusBadge(status: string) {
  switch (status) {
    case "Completed":
      return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">{status}</Badge>
    case "Ongoing":
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">{status}</Badge>
    case "Planned":
      return <Badge variant="outline">{status}</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProject, setSelectedProject] = useState<typeof mockProjects[0] | null>(null)
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredProjects = mockProjects.filter(proj => {
    const matchesSearch = proj.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || proj.status.toLowerCase() === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Community Projects</h1>
        <p className="text-muted-foreground">View ongoing and completed barangay projects</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search projects..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant={filterStatus === "all" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilterStatus("all")}
          >
            All
          </Button>
          <Button 
            variant={filterStatus === "ongoing" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilterStatus("ongoing")}
          >
            Ongoing
          </Button>
          <Button 
            variant={filterStatus === "completed" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilterStatus("completed")}
          >
            Completed
          </Button>
          <Button 
            variant={filterStatus === "planned" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilterStatus("planned")}
          >
            Planned
          </Button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
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
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setSelectedProject(project)}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FolderKanban className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No projects found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter</p>
        </div>
      )}

      {/* Project Preview Modal */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Project Report</DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <ScrollArea className="max-h-[70vh]">
              <div className="rounded-lg border bg-white p-8 text-black print:border-0 print:p-0">
                {/* Header */}
                <div className="text-center space-y-1 mb-6">
                  <p className="text-sm">Republic of the Philippines</p>
                  <p className="text-sm">Province of Zambales</p>
                  <p className="text-sm">Municipality of San Antonio</p>
                  <p className="text-sm font-semibold">Barangay Santiago</p>
                </div>

                <div className="border-t border-b border-black py-4 my-6">
                  <h2 className="text-center font-bold">BARANGAY PROJECT REPORT</h2>
                </div>

                {/* Project Details */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600 text-sm">Project Title:</p>
                      <p className="font-bold">{selectedProject.title}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Project Type:</p>
                      <p className="font-medium">{selectedProject.type}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm">Location:</p>
                    <p className="font-medium">{selectedProject.location}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600 text-sm">Start Date:</p>
                      <p className="font-medium">{selectedProject.startDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Target Completion:</p>
                      <p className="font-medium">{selectedProject.targetCompletion}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-gray-600 text-sm">PROJECT DESCRIPTION</p>
                    <p className="mt-1">{selectedProject.description}</p>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-gray-600 text-sm">BUDGET DETAILS</p>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-sm">Total Budget:</p>
                        <p className="font-bold">PHP {selectedProject.budget}</p>
                      </div>
                      <div>
                        <p className="text-sm">Source of Funds:</p>
                        <p className="font-medium">{selectedProject.source}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-gray-600 text-sm">PROJECT STATUS</p>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-sm">Status:</p>
                        <p className="font-medium">{selectedProject.status}</p>
                      </div>
                      <div>
                        <p className="text-sm">Progress:</p>
                        <p className="font-bold">{selectedProject.progress}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-gray-600 text-sm">PROJECT HEAD</p>
                    <p className="font-bold">{selectedProject.projectHead}</p>
                    <p className="text-sm">{selectedProject.projectHeadPosition}</p>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-gray-600 text-sm">BENEFICIARIES</p>
                    <p className="font-medium">{selectedProject.beneficiaries}</p>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-gray-600 text-sm">REMARKS</p>
                    <p>{selectedProject.remarks}</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-12 grid grid-cols-2 gap-8 text-center">
                  <div>
                    <p className="border-t border-black pt-1">Prepared by</p>
                  </div>
                  <div>
                    <p className="border-t border-black pt-1 font-semibold">ROLANDO C. BORJA</p>
                    <p className="text-sm">Punong Barangay</p>
                    <p className="text-xs text-gray-600 mt-1">Approved by</p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedProject(null)}>Close</Button>
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
