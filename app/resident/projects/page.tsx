"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { DocumentHeader } from "@/components/document-header"
import { Search, Printer, FolderKanban, MapPin, Calendar, Wallet } from "lucide-react"

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
  const [selectedProject, setSelectedProject] = useState<typeof mockProjects[0] | null>(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const printRef = useRef<HTMLDivElement>(null)

  const filteredProjects = mockProjects.filter(proj => {
    const matchesSearch = proj.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || proj.status.toLowerCase() === filterStatus
    return matchesSearch && matchesStatus
  })

  const handlePrint = () => {
    if (!selectedProject) return
    
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Project Report - ${selectedProject.title}</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; font-size: 13px; line-height: 1.6; }
              .header { text-align: center; margin-bottom: 24px; }
              .header-row { display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 16px; }
              .logo { width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 2px solid #e5e5e5; }
              .header-text { text-align: center; }
              .header-text p { margin: 2px 0; font-size: 12px; }
              .header-text .bold { font-weight: 600; }
              .title-bar { border-top: 1px solid black; border-bottom: 1px solid black; padding: 12px; margin: 24px 0; text-align: center; font-weight: bold; font-size: 13px; }
              .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
              .label { color: #666; font-size: 12px; margin-bottom: 2px; }
              .value { font-weight: 500; }
              .section { margin-top: 20px; padding-top: 16px; border-top: 1px solid #e5e5e5; }
              .section-title { color: #666; font-size: 12px; margin-bottom: 8px; text-transform: uppercase; }
              .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; text-align: center; margin-top: 48px; }
              .signature-box { }
              .signature-line { border-top: 1px solid black; padding-top: 4px; }
              .signature-label { font-size: 11px; color: #666; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="header-row">
                <img src="/images/santiagologo.jpg" alt="Barangay Santiago" class="logo" />
                <div class="header-text">
                  <p>Republic of the Philippines</p>
                  <p>Province of Zambales</p>
                  <p>Municipality of San Antonio</p>
                  <p class="bold">Barangay Santiago</p>
                </div>
                <img src="/images/saz.jpg" alt="Municipal Seal" class="logo" />
              </div>
            </div>
            
            <div class="title-bar">BARANGAY PROJECT REPORT</div>
            
            <div class="grid">
              <div>
                <p class="label">Project Title:</p>
                <p class="value" style="font-weight: bold;">${selectedProject.title}</p>
              </div>
              <div>
                <p class="label">Project Type:</p>
                <p class="value">${selectedProject.type}</p>
              </div>
            </div>
            
            <div>
              <p class="label">Location:</p>
              <p class="value">${selectedProject.location}</p>
            </div>
            
            <div class="grid" style="margin-top: 16px;">
              <div>
                <p class="label">Start Date:</p>
                <p class="value">${selectedProject.startDate}</p>
              </div>
              <div>
                <p class="label">Target Completion:</p>
                <p class="value">${selectedProject.targetCompletion}</p>
              </div>
            </div>
            
            <div class="section">
              <p class="section-title">PROJECT DESCRIPTION</p>
              <p>${selectedProject.description}</p>
            </div>
            
            <div class="section">
              <p class="section-title">BUDGET DETAILS</p>
              <div class="grid" style="margin-top: 8px;">
                <div>
                  <p class="label">Total Budget:</p>
                  <p class="value" style="font-weight: bold;">PHP ${selectedProject.budget}</p>
                </div>
                <div>
                  <p class="label">Source of Funds:</p>
                  <p class="value">${selectedProject.source}</p>
                </div>
              </div>
            </div>
            
            <div class="section">
              <p class="section-title">PROJECT STATUS</p>
              <div class="grid" style="margin-top: 8px;">
                <div>
                  <p class="label">Status:</p>
                  <p class="value">${selectedProject.status}</p>
                </div>
                <div>
                  <p class="label">Progress:</p>
                  <p class="value" style="font-weight: bold;">${selectedProject.progress}%</p>
                </div>
              </div>
            </div>
            
            <div class="section">
              <p class="section-title">PROJECT HEAD</p>
              <p class="value" style="font-weight: bold;">${selectedProject.projectHead}</p>
              <p>${selectedProject.projectHeadPosition}</p>
            </div>
            
            <div class="section">
              <p class="section-title">BENEFICIARIES</p>
              <p class="value">${selectedProject.beneficiaries}</p>
            </div>
            
            <div class="section">
              <p class="section-title">REMARKS</p>
              <p>${selectedProject.remarks}</p>
            </div>
            
            <div class="signatures">
              <div class="signature-box">
                <p class="signature-line">Prepared by</p>
              </div>
              <div class="signature-box">
                <p class="signature-line" style="font-weight: 600;">ROLANDO C. BORJA</p>
                <p>Punong Barangay</p>
                <p class="signature-label">Approved by</p>
              </div>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      
      setTimeout(() => {
        printWindow.print()
      }, 500)
    }
  }

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
              <div ref={printRef} className="rounded-lg border bg-white p-4 sm:p-8 text-black print:border-0 print:p-0">
                <DocumentHeader title="BARANGAY PROJECT REPORT" printOnly />

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

                  <div className="border-t pt-4">
                    <p className="text-gray-600">REMARKS</p>
                    <p>{selectedProject.remarks}</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-8 sm:mt-12 grid grid-cols-2 gap-4 sm:gap-8 text-center text-xs sm:text-sm">
                  <div>
                    <p className="border-t border-black pt-1">Prepared by</p>
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
            <Button onClick={handlePrint} className="w-full sm:w-auto">
              <Printer className="mr-2 h-4 w-4" />
              Print Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
