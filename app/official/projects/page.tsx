"use client"

import { useState } from "react"
import Image from "next/image"
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
import { Trash2 } from "lucide-react"
import { updateProject, deleteProject, updateProjectStatus, updateProjectProgress } from "@/lib/project-utils"

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
  const [projects, setProjects] = useState(mockProjects)
  const [selectedProject, setSelectedProject] = useState<typeof mockProjects[0] | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [confirmDeleteProjectId, setConfirmDeleteProjectId] = useState<string | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<typeof mockProjects[0] | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showProgressDialog, setShowProgressDialog] = useState(false)
  const [newProgress, setNewProgress] = useState(0)
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    description: "",
    location: "",
    startDate: "",
    targetCompletion: "",
    status: "Planned",
    budget: "",
    source: "",
    projectHead: "",
    projectHeadPosition: "",
    beneficiaries: "",
    remarks: "",
  })

  const requestDeleteProject = (id: string) => {
    setConfirmDeleteProjectId(id)
    setIsConfirmOpen(true)
  }

  const confirmDeleteProject = () => {
    if (!confirmDeleteProjectId) return
    setProjects((s) => s.filter((p) => p.id !== confirmDeleteProjectId))
    setConfirmDeleteProjectId(null)
    setIsConfirmOpen(false)
  }

  const handleCreateProject = () => {
    if (!formData.title || !formData.type || !formData.location) {
      alert('Please fill in all required fields')
      return
    }
    const newId = `PRJ-2026-${String(projects.length + 1).padStart(3, "0")}`
    const newProject = {
      id: newId,
      title: formData.title,
      type: formData.type,
      description: formData.description,
      location: formData.location,
      startDate: formData.startDate,
      targetCompletion: formData.targetCompletion,
      status: formData.status,
      progress: 0,
      budget: formData.budget,
      source: formData.source,
      projectHead: formData.projectHead,
      projectHeadPosition: formData.projectHeadPosition,
      beneficiaries: formData.beneficiaries,
      remarks: formData.remarks,
    }
    setProjects([newProject, ...projects])
    setShowCreateDialog(false)
    setFormData({
      title: "",
      type: "",
      description: "",
      location: "",
      startDate: "",
      targetCompletion: "",
      status: "Planned",
      budget: "",
      source: "",
      projectHead: "",
      projectHeadPosition: "",
      beneficiaries: "",
      remarks: "",
    })
  }

  const handleEditProject = (project: typeof mockProjects[0]) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      type: project.type,
      description: project.description,
      location: project.location,
      startDate: project.startDate,
      targetCompletion: project.targetCompletion,
      status: project.status,
      budget: project.budget,
      source: project.source,
      projectHead: project.projectHead,
      projectHeadPosition: project.projectHeadPosition,
      beneficiaries: project.beneficiaries,
      remarks: project.remarks,
    })
    setShowEditDialog(true)
  }

  const handleUpdateProject = () => {
    if (!editingProject) return
    const updated = {
      ...editingProject,
      ...formData,
    }
    setProjects(projects.map(p => p.id === editingProject.id ? updated : p))
    setShowEditDialog(false)
    setEditingProject(null)
    setFormData({
      title: "",
      type: "",
      description: "",
      location: "",
      startDate: "",
      targetCompletion: "",
      status: "Planned",
      budget: "",
      source: "",
      projectHead: "",
      projectHeadPosition: "",
      beneficiaries: "",
      remarks: "",
    })
  }

  const handleUpdateProgress = () => {
    if (!selectedProject) return
    const updated = {
      ...selectedProject,
      progress: newProgress,
    }
    setProjects(projects.map(p => p.id === selectedProject.id ? updated : p))
    setSelectedProject(updated)
    setShowProgressDialog(false)
  }

  const handleDirectPrint = (project: typeof mockProjects[0]) => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const documentContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Project Report - ${project.id}</title>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          @page { size: A4; margin: 0.5in; }
          body { font-family: Arial, sans-serif; font-size: 10pt; line-height: 1.5; color: #000; background: white; }
          .container { width: 100%; max-width: 8.5in; margin: 0 auto; }
          .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.3in; padding-bottom: 0.15in; border-bottom: 3px solid #333; }
          .logo { width: 0.9in; height: 0.9in; border-radius: 50%; object-fit: cover; }
          .header-text { flex: 1; text-align: center; padding: 0 0.2in; }
          .header-text p { margin: 0; font-size: 10pt; }
          .header-text .main-title { font-size: 13pt; font-weight: bold; margin-top: 0.05in; }
          .document-title { text-align: center; margin: 0.2in 0; padding: 0.12in 0; border-top: 2px solid #000; border-bottom: 2px solid #000; }
          .document-title h1 { font-size: 13pt; font-weight: bold; }
          .reference { display: flex; justify-content: space-between; margin: 0.15in 0; font-size: 10pt; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.1in; margin: 0.15in 0; padding: 0.1in; border: 1px solid #ccc; border-radius: 4px; }
          .info-item .label { font-size: 8pt; color: #666; text-transform: uppercase; }
          .info-item .value { font-weight: 600; font-size: 10pt; }
          .full-width { grid-column: 1 / -1; }
          .section { margin: 0.15in 0; }
          .section-title { font-weight: bold; font-size: 10pt; text-transform: uppercase; margin-bottom: 0.08in; border-bottom: 1px solid #ccc; padding-bottom: 0.05in; }
          .section-content { font-size: 10pt; line-height: 1.6; }
          .budget-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.1in; }
          .budget-box { padding: 0.1in; border: 1px solid #ccc; border-radius: 4px; }
          .budget-box .label { font-size: 8pt; color: #666; }
          .budget-box .value { font-weight: bold; font-size: 11pt; }
          .progress-bar { width: 100%; height: 0.15in; background: #e5e5e5; border-radius: 0.05in; overflow: hidden; margin-top: 0.05in; }
          .progress-fill { height: 100%; background: #22c55e; }
          .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 0.4in; margin-top: 0.4in; padding-top: 0.2in; }
          .signature-block { text-align: center; }
          .signature-line { border-bottom: 1px solid #000; height: 0.4in; margin-bottom: 0.05in; }
          .signature-name { font-weight: bold; font-size: 10pt; }
          .signature-title { font-size: 9pt; color: #666; }
          .footer { margin-top: 0.2in; text-align: center; font-size: 8pt; color: #666; border-top: 1px solid #ccc; padding-top: 0.1in; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="/images/santiagologo.jpg" alt="Barangay Santiago" class="logo" />
            <div class="header-text">
              <p>Republic of the Philippines</p>
              <p>Province of Zambales</p>
              <p>Municipality of San Antonio</p>
              <p class="main-title">Barangay Santiago</p>
            </div>
            <img src="/images/saz.jpg" alt="Municipality Seal" class="logo" />
          </div>
          
          <div class="document-title">
            <h1>PROJECT REPORT</h1>
          </div>
          
          <div class="reference">
            <span><strong>Reference No:</strong> ${project.id}</span>
            <span><strong>Status:</strong> ${project.status}</span>
          </div>
          
          <div class="info-grid">
            <div class="info-item">
              <div class="label">Project Title</div>
              <div class="value">${project.title}</div>
            </div>
            <div class="info-item">
              <div class="label">Project Type</div>
              <div class="value">${project.type}</div>
            </div>
            <div class="info-item full-width">
              <div class="label">Location</div>
              <div class="value">${project.location}</div>
            </div>
          </div>
          
          <div class="info-grid">
            <div class="info-item">
              <div class="label">Start Date</div>
              <div class="value">${project.startDate}</div>
            </div>
            <div class="info-item">
              <div class="label">Target Completion</div>
              <div class="value">${project.targetCompletion}</div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Project Description</div>
            <div class="section-content">${project.description}</div>
          </div>
          
          <div class="section">
            <div class="section-title">Budget Details</div>
            <div class="budget-grid">
              <div class="budget-box">
                <div class="label">Total Budget</div>
                <div class="value">PHP ${project.budget}</div>
              </div>
              <div class="budget-box">
                <div class="label">Fund Source</div>
                <div class="value">${project.source}</div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Progress: ${project.progress}%</div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${project.progress}%"></div>
            </div>
          </div>
          
          <div class="info-grid">
            <div class="info-item">
              <div class="label">Project Head</div>
              <div class="value">${project.projectHead}</div>
              <div style="font-size: 9pt; color: #666;">${project.projectHeadPosition}</div>
            </div>
            <div class="info-item">
              <div class="label">Beneficiaries</div>
              <div class="value">${project.beneficiaries}</div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Remarks</div>
            <div class="section-content">${project.remarks || "No remarks"}</div>
          </div>
          
          <div class="signatures">
            <div class="signature-block">
              <div class="signature-line"></div>
              <div class="signature-name">${project.projectHead}</div>
              <div class="signature-title">${project.projectHeadPosition}</div>
            </div>
            <div class="signature-block">
              <div class="signature-line"></div>
              <div class="signature-name">ROLANDO C. BORJA</div>
              <div class="signature-title">Barangay Captain</div>
            </div>
          </div>
          
          <div class="footer">
            <p>This document is generated by the Barangay Santiago Management System</p>
            <p>Date Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
        <script>window.onload = function() { window.print(); };</script>
      </body>
      </html>
    `

    printWindow.document.write(documentContent)
    printWindow.document.close()
  }

  const ongoingCount = projects.filter(p => p.status === "Ongoing").length
  const completedCount = projects.filter(p => p.status === "Completed").length

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
                  <Input 
                    placeholder="Enter project title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Project Type</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input 
                      placeholder="e.g., Purok 3"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea 
                    placeholder="Project description..." 
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input 
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Target Completion</Label>
                    <Input 
                      type="date"
                      value={formData.targetCompletion}
                      onChange={(e) => setFormData({...formData, targetCompletion: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Total Budget (PHP)</Label>
                    <Input 
                      placeholder="e.g., 100000"
                      value={formData.budget}
                      onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Source of Funds</Label>
                    <Input 
                      placeholder="e.g., Barangay Fund"
                      value={formData.source}
                      onChange={(e) => setFormData({...formData, source: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Project Head</Label>
                    <Input 
                      placeholder="Assigned official name"
                      value={formData.projectHead}
                      onChange={(e) => setFormData({...formData, projectHead: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Position</Label>
                    <Input 
                      placeholder="e.g., Barangay Kagawad"
                      value={formData.projectHeadPosition}
                      onChange={(e) => setFormData({...formData, projectHeadPosition: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Beneficiaries</Label>
                  <Input 
                    placeholder="Who will benefit from this project?"
                    value={formData.beneficiaries}
                    onChange={(e) => setFormData({...formData, beneficiaries: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Remarks (Optional)</Label>
                  <Textarea 
                    placeholder="Additional notes..." 
                    rows={2}
                    value={formData.remarks}
                    onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                  />
                </div>
              </div>
            </ScrollArea>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowCreateDialog(false)
                setFormData({
                  title: "",
                  type: "",
                  description: "",
                  location: "",
                  startDate: "",
                  targetCompletion: "",
                  status: "Planned",
                  budget: "",
                  source: "",
                  projectHead: "",
                  projectHeadPosition: "",
                  beneficiaries: "",
                  remarks: "",
                })
              }}>Cancel</Button>
              <Button onClick={handleCreateProject}>Create Project</Button>
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
        {projects.map((project) => (
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
                <Button variant="outline" size="sm" onClick={() => handleEditProject(project)}>
                  <Edit className="mr-1 h-3 w-3" />
                  Update
                </Button>
                  <Button variant="outline" size="sm" className="text-destructive" onClick={() => requestDeleteProject(project.id)}>
                    <Trash2 className="mr-1 h-3 w-3" />
                    Delete
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
            <Button variant="outline" onClick={() => {
              setNewProgress(selectedProject?.progress || 0)
              setShowProgressDialog(true)
            }}>Update Progress</Button>
            <Button onClick={() => selectedProject && handleDirectPrint(selectedProject)}>
              <Printer className="mr-2 h-4 w-4" />
              Print Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update project details
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 pr-4">
              <div className="space-y-2">
                <Label>Project Title</Label>
                <Input 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Project Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {projectTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Planned">Planned</SelectItem>
                      <SelectItem value="Ongoing">Ongoing</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input 
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input 
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Target Completion</Label>
                  <Input 
                    type="date"
                    value={formData.targetCompletion}
                    onChange={(e) => setFormData({...formData, targetCompletion: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Budget (PHP)</Label>
                  <Input 
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Source of Funds</Label>
                  <Input 
                    value={formData.source}
                    onChange={(e) => setFormData({...formData, source: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Project Head</Label>
                  <Input 
                    value={formData.projectHead}
                    onChange={(e) => setFormData({...formData, projectHead: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Position</Label>
                  <Input 
                    value={formData.projectHeadPosition}
                    onChange={(e) => setFormData({...formData, projectHeadPosition: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Beneficiaries</Label>
                <Input 
                  value={formData.beneficiaries}
                  onChange={(e) => setFormData({...formData, beneficiaries: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Remarks</Label>
                <Textarea 
                  rows={2}
                  value={formData.remarks}
                  onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                />
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowEditDialog(false)
              setEditingProject(null)
            }}>Cancel</Button>
            <Button onClick={handleUpdateProject}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Progress Dialog */}
      <Dialog open={showProgressDialog} onOpenChange={setShowProgressDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Project Progress</DialogTitle>
            <DialogDescription>
              Set the project completion percentage
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Progress: {newProgress}%</Label>
              </div>
              <Input 
                type="range" 
                min="0" 
                max="100" 
                value={newProgress}
                onChange={(e) => setNewProgress(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">0%</Button>
              <Button variant="outline" className="flex-1" onClick={() => setNewProgress(25)}>25%</Button>
              <Button variant="outline" className="flex-1" onClick={() => setNewProgress(50)}>50%</Button>
              <Button variant="outline" className="flex-1" onClick={() => setNewProgress(75)}>75%</Button>
              <Button variant="outline" className="flex-1" onClick={() => setNewProgress(100)}>100%</Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProgressDialog(false)}>Cancel</Button>
            <Button onClick={handleUpdateProgress}>Update Progress</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>This action will permanently delete the project. Are you sure?</DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <p className="text-sm">{confirmDeleteProjectId ? `Delete project ${confirmDeleteProjectId}? This cannot be undone.` : "Delete selected project?"}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteProject}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
