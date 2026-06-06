"use client"

import { useState, useEffect } from "react"
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
  Edit,
  MapPin,
  Calendar,
  Wallet
} from "lucide-react"
import { Trash2 } from "lucide-react"
import { createProject, updateProject, deleteProject, updateProjectStatus, updateProjectProgress } from "@/lib/project-utils"


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
  const [projects, setProjects] = useState<any[]>([])
  const [selectedProject, setSelectedProject] = useState<any | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [confirmDeleteProjectId, setConfirmDeleteProjectId] = useState<string | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<any | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showProgressDialog, setShowProgressDialog] = useState(false)
  const [newProgress, setNewProgress] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isProgressSaving, setIsProgressSaving] = useState(false)
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

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/projects')
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data?.error || 'Failed to load projects')
        }
        setProjects(data || [])
      } catch (error) {
        console.error('Failed to load projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const requestDeleteProject = (id: string) => {
    setConfirmDeleteProjectId(id)
    setIsConfirmOpen(true)
  }

  const confirmDeleteProject = async () => {
    if (!confirmDeleteProjectId) return
    try {
      setLoading(true)
      await deleteProject(confirmDeleteProjectId)
      setProjects((s) => s.filter((p) => p.id !== confirmDeleteProjectId))
    } catch (error) {
      console.error('Failed to delete project:', error)
      alert('Failed to delete project')
    } finally {
      setConfirmDeleteProjectId(null)
      setIsConfirmOpen(false)
      setLoading(false)
    }
  }

  const handleCreateProject = async () => {
    if (!formData.title || !formData.type || !formData.location) {
      alert('Please fill in all required fields')
      return
    }

    setIsSaving(true)
    try {
      const created = await createProject({
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate || new Date().toISOString().split('T')[0],
        endDate: formData.targetCompletion || undefined,
        progress: 0,
        budget: formData.budget,
        spent: 0,
        location: formData.location,
        status: formData.status,
        createdBy: 'system',
      })

      const newProject = created?.project ?? created
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
    } catch (error) {
      console.error('Failed to create project:', error)
      alert('Failed to create project')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditProject = (project: any) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      type: project.type,
      description: project.description,
      location: project.location,
      startDate: project.start_date || project.startDate || "",
      targetCompletion: project.end_date || project.targetCompletion || "",
      status: project.status || "Planned",
      budget: project.budget || "",
      source: project.source || "",
      projectHead: project.projectHead || "",
      projectHeadPosition: project.projectHeadPosition || "",
      beneficiaries: project.beneficiaries || "",
      remarks: project.remarks || "",
    })
    setShowEditDialog(true)
  }

  const handleUpdateProject = async () => {
    if (!editingProject) return

    setIsUpdating(true)
    try {
      const updatedResponse = await updateProject(editingProject.id, {
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.targetCompletion,
        status: formData.status,
        budget: formData.budget,
        source: formData.source,
        location: formData.location,
      })

      const updatedProject = updatedResponse?.project ?? updatedResponse
      setProjects(projects.map(p => p.id === editingProject.id ? updatedProject : p))
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
    } catch (error) {
      console.error('Failed to update project:', error)
      alert('Failed to update project')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleUpdateProgress = async () => {
    if (!selectedProject) return

    setIsProgressSaving(true)
    try {
      const updatedResponse = await updateProjectProgress(selectedProject.id, newProgress)
      const updatedProject = updatedResponse?.project ?? updatedResponse
      setProjects(projects.map(p => p.id === selectedProject.id ? updatedProject : p))
      setSelectedProject(updatedProject)
      setShowProgressDialog(false)
    } catch (error) {
      console.error('Failed to update project progress:', error)
      alert('Failed to update project progress')
    } finally {
      setIsProgressSaving(false)
    }
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
                <p className="text-2xl font-bold">{projects.filter((p: any) => p.status === "Planned").length}</p>
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
                <p className="text-2xl font-bold">{projects.length}</p>
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Project Details Modal */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
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
