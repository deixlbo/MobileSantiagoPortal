"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { DocumentHeader } from "@/components/document-header"
import { Search, FolderKanban, MapPin, Calendar, Wallet } from "lucide-react"

type ResidentProject = {
  id: string
  title?: string
  type?: string
  description?: string
  location?: string
  start_date?: string
  target_completion?: string
  status?: string
  progress?: number
  budget?: string
  source?: string
  project_head?: string
  project_head_position?: string
  beneficiaries?: string
}

function getStatusBadge(status: string | undefined) {
  switch (status) {
    case "Completed":
      return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-xs">{status}</Badge>
    case "Ongoing":
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-xs">{status}</Badge>
    case "Planned":
      return <Badge variant="outline" className="text-xs">{status}</Badge>
    default:
      return <Badge variant="secondary" className="text-xs">{status}</Badge>
  }
}

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [projects, setProjects] = useState<ResidentProject[]>([])
  const [selectedProject, setSelectedProject] = useState<ResidentProject | null>(null)
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredProjects = projects.filter(proj => {
    const matchesSearch = proj.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || proj.status.toLowerCase() === filterStatus
    return matchesSearch && matchesStatus
  })


  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Community Projects</h1>
        <p className="text-sm text-muted-foreground">View ongoing and completed barangay projects</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search projects..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={filterStatus === "all" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilterStatus("all")}
            className="text-xs sm:text-sm"
          >
            All
          </Button>
          <Button 
            variant={filterStatus === "ongoing" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilterStatus("ongoing")}
            className="text-xs sm:text-sm"
          >
            Ongoing
          </Button>
          <Button 
            variant={filterStatus === "completed" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilterStatus("completed")}
            className="text-xs sm:text-sm"
          >
            Completed
          </Button>
          <Button 
            variant={filterStatus === "planned" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilterStatus("planned")}
            className="text-xs sm:text-sm"
          >
            Planned
          </Button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <Card 
            key={project.id} 
            className="transition-all hover:shadow-lg cursor-pointer hover:border-primary"
            onClick={() => setSelectedProject(project)}
          >
            <CardHeader className="pb-2 sm:pb-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge variant="outline" className="text-xs">{project.type}</Badge>
                {getStatusBadge(project.status)}
              </div>
              <CardTitle className="text-sm sm:text-lg leading-tight">{project.title}</CardTitle>
              <CardDescription className="flex items-center gap-1 text-xs">
                <MapPin className="h-3 w-3" />
                {project.location}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Wallet className="h-3 w-3" />
                  PHP {project.budget}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {project.targetCompletion}
                </div>
              </div>
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
              <div className="rounded-lg border bg-white p-4 sm:p-8 text-black">
                <DocumentHeader title="BARANGAY PROJECT REPORT" />

                {/* Project Details */}
                <div className="space-y-4 text-xs sm:text-sm">
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
                    <p className="text-gray-600">PROJECT DESCRIPTION</p>
                    <p className="mt-1">{selectedProject.description}</p>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-gray-600">BUDGET DETAILS</p>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <p>Total Budget:</p>
                        <p className="font-bold">PHP {selectedProject.budget}</p>
                      </div>
                      <div>
                        <p>Source of Funds:</p>
                        <p className="font-medium">{selectedProject.source}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-gray-600">PROJECT STATUS</p>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <p>Status:</p>
                        <p className="font-medium">{selectedProject.status}</p>
                      </div>
                      <div>
                        <p>Progress:</p>
                        <p className="font-bold">{selectedProject.progress}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-gray-600">PROJECT HEAD</p>
                    <p className="font-bold">{selectedProject.projectHead}</p>
                    <p>{selectedProject.projectHeadPosition}</p>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-gray-600">BENEFICIARIES</p>
                    <p className="font-medium">{selectedProject.beneficiaries}</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-8 sm:mt-12 grid grid-cols-2 gap-4 sm:gap-8 text-center text-xs sm:text-sm">
                  <div>
                    <p className="border-t border-black pt-1 font-semibold">ROLANDO C. BORJA</p>
                    <p>Punong Barangay</p>
                    <p className="text-gray-600 mt-1">Prepared by</p>
                  </div>
                  <div>
                    <p className="border-t border-black pt-1 font-semibold">ROLANDO C. BORJA</p>
                    <p>Punong Barangay</p>
                    <p className="text-gray-600 mt-1">Approved by</p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setSelectedProject(null)} className="w-full sm:w-auto">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
