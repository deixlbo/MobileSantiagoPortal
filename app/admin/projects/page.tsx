"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FolderKanban, Plus, Search, Filter, Calendar, Users, DollarSign,
  Clock, CheckCircle, AlertCircle, Edit, Eye, Upload, FileText,
  Image, ChevronLeft, Trash2
} from "lucide-react"
import { mockProjects, mockAssets } from "@/lib/mock-data"

type Project = typeof mockProjects[0]

export default function AdminProjects() {
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [projects, setProjects] = useState(mockProjects)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [newProject, setNewProject] = useState({
    name: '',
    type: 'Infrastructure',
    description: '',
    budget: 0,
    fundSource: '',
    startDate: '',
    targetCompletion: '',
    assignedTo: '',
    members: ''
  })
  const [newUpdate, setNewUpdate] = useState('')

  const filteredProjects = projects
    .filter(p => filter === "all" || p.status === filter)
    .filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.type.toLowerCase().includes(searchTerm.toLowerCase())
    )

  const handleCreateProject = () => {
    const project = {
      id: String(projects.length + 1),
      ...newProject,
      members: newProject.members.split(',').map(m => m.trim()),
      status: 'planning' as const,
      progress: 0,
      timeline: [{ date: format(new Date(), 'yyyy-MM-dd'), update: 'Project created' }],
      files: []
    }
    setProjects([...projects, project])
    setShowCreateModal(false)
    setNewProject({
      name: '',
      type: 'Infrastructure',
      description: '',
      budget: 0,
      fundSource: '',
      startDate: '',
      targetCompletion: '',
      assignedTo: '',
      members: ''
    })
  }

  const handleAddUpdate = () => {
    if (!selectedProject || !newUpdate.trim()) return
    
    setProjects(prev => prev.map(p => 
      p.id === selectedProject.id
        ? {
            ...p,
            timeline: [...p.timeline, { date: format(new Date(), 'yyyy-MM-dd'), update: newUpdate }]
          }
        : p
    ))
    setSelectedProject(prev => prev ? {
      ...prev,
      timeline: [...prev.timeline, { date: format(new Date(), 'yyyy-MM-dd'), update: newUpdate }]
    } : null)
    setNewUpdate('')
    setShowUpdateModal(false)
  }

  const handleUpdateProgress = (progress: number) => {
    if (!selectedProject) return
    
    const newStatus = progress === 100 ? 'completed' : progress > 0 ? 'ongoing' : 'planning'
    
    setProjects(prev => prev.map(p => 
      p.id === selectedProject.id
        ? { ...p, progress, status: newStatus }
        : p
    ))
    setSelectedProject(prev => prev ? { ...prev, progress, status: newStatus } : null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Completed</Badge>
      case "ongoing":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Ongoing</Badge>
      case "planning":
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Planning</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const projectAssets = selectedProject
    ? mockAssets.filter(a => a.linkedId === selectedProject.id && a.category === 'Project')
    : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground">Manage barangay projects and track progress</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Create Project
          </Button>
        </div>
        
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search projects..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="animate-fade-in-up">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FolderKanban className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{projects.length}</div>
                <p className="text-xs text-muted-foreground">Total Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {projects.filter(p => p.status === 'ongoing').length}
                </div>
                <p className="text-xs text-muted-foreground">Ongoing</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600">
                  {projects.filter(p => p.status === 'planning').length}
                </div>
                <p className="text-xs text-muted-foreground">Planning</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {projects.filter(p => p.status === 'completed').length}
                </div>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects List/Grid */}
      {selectedProject ? (
        // Project Details View
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 mb-4">
              <Button variant="ghost" size="sm" onClick={() => setSelectedProject(null)}>
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {getStatusBadge(selectedProject.status)}
                  <Badge variant="outline">{selectedProject.type}</Badge>
                </div>
                <CardTitle className="text-xl">{selectedProject.name}</CardTitle>
                <CardDescription className="mt-2">{selectedProject.description}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowUpdateModal(true)}>
                  <Edit className="w-4 h-4 mr-1" />
                  Add Update
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Progress</Label>
                    <span className="text-sm font-medium">{selectedProject.progress}%</span>
                  </div>
                  <Progress value={selectedProject.progress} className="h-3 animate-progress" />
                  <div className="flex gap-2 mt-2">
                    {[0, 25, 50, 75, 100].map(val => (
                      <Button
                        key={val}
                        size="sm"
                        variant={selectedProject.progress === val ? "default" : "outline"}
                        onClick={() => handleUpdateProgress(val)}
                      >
                        {val}%
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Budget</Label>
                    <p className="font-medium">PHP {selectedProject.budget.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Fund Source</Label>
                    <p className="font-medium">{selectedProject.fundSource}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Start Date</Label>
                    <p className="font-medium">{format(new Date(selectedProject.startDate), 'MMMM d, yyyy')}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Target Completion</Label>
                    <p className="font-medium">{format(new Date(selectedProject.targetCompletion), 'MMMM d, yyyy')}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Project Head</Label>
                    <p className="font-medium">{selectedProject.assignedTo}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Team Members</Label>
                    <p className="font-medium">{selectedProject.members.join(', ')}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="timeline" className="space-y-4">
                <div className="relative border-l-2 border-primary/20 pl-6 space-y-6">
                  {selectedProject.timeline.map((item, index) => (
                    <div key={index} className="relative animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="absolute -left-[29px] w-4 h-4 rounded-full bg-primary border-2 border-background" />
                      <div className="text-xs text-muted-foreground mb-1">
                        {format(new Date(item.date), 'MMMM d, yyyy')}
                      </div>
                      <p className="text-sm">{item.update}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="files" className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag & drop files here or click to browse
                  </p>
                  <Button variant="outline" size="sm">
                    Upload Files
                  </Button>
                </div>
                
                {projectAssets.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                    {projectAssets.map(asset => (
                      <div key={asset.id} className="border rounded-lg p-3 text-center">
                        {asset.type === 'Image' ? (
                          <Image className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        ) : (
                          <FileText className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        )}
                        <p className="text-xs font-medium truncate">{asset.name}</p>
                        <p className="text-xs text-muted-foreground">{asset.size}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No files uploaded yet
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ) : (
        // Projects Grid
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map(project => (
            <Card 
              key={project.id} 
              className="hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]"
              onClick={() => setSelectedProject(project)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 mb-2">
                  {getStatusBadge(project.status)}
                  <Badge variant="outline">{project.type}</Badge>
                </div>
                <CardTitle className="text-base">{project.name}</CardTitle>
                <CardDescription className="line-clamp-2 text-xs">{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    <span>PHP {(project.budget / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{format(new Date(project.targetCompletion), 'MMM yyyy')}</span>
                  </div>
                </div>
                
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  <Eye className="w-3 h-3 mr-1" />
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
          
          {filteredProjects.length === 0 && (
            <div className="col-span-full text-center py-12">
              <FolderKanban className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold mb-1">No projects found</h3>
              <p className="text-sm text-muted-foreground">
                {filter !== 'all' ? 'No projects match the current filter' : 'Create your first project to get started'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Create Project Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>Add a new barangay project to track</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="projectName">Project Title</Label>
                <Input
                  id="projectName"
                  placeholder="Enter project title"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="projectType">Project Type</Label>
                <Select
                  value={newProject.type}
                  onValueChange={(v) => setNewProject({ ...newProject, type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="Program">Program</SelectItem>
                    <SelectItem value="Event">Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fundSource">Source of Funds</Label>
                <Select
                  value={newProject.fundSource}
                  onValueChange={(v) => setNewProject({ ...newProject, fundSource: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LGU Funds">LGU Funds</SelectItem>
                    <SelectItem value="Barangay Funds">Barangay Funds</SelectItem>
                    <SelectItem value="DSWD Grant">DSWD Grant</SelectItem>
                    <SelectItem value="Donation">Donation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter project description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="budget">Budget (PHP)</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="0"
                  value={newProject.budget || ''}
                  onChange={(e) => setNewProject({ ...newProject, budget: Number(e.target.value) })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="assignedTo">Project Head</Label>
                <Input
                  id="assignedTo"
                  placeholder="Assigned personnel"
                  value={newProject.assignedTo}
                  onChange={(e) => setNewProject({ ...newProject, assignedTo: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newProject.startDate}
                  onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="targetCompletion">Target Completion</Label>
                <Input
                  id="targetCompletion"
                  type="date"
                  value={newProject.targetCompletion}
                  onChange={(e) => setNewProject({ ...newProject, targetCompletion: e.target.value })}
                />
              </div>
              
              <div className="col-span-2 space-y-2">
                <Label htmlFor="members">Team Members (comma separated)</Label>
                <Input
                  id="members"
                  placeholder="e.g., Juan, Pedro, Maria"
                  value={newProject.members}
                  onChange={(e) => setNewProject({ ...newProject, members: e.target.value })}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProject} disabled={!newProject.name || !newProject.description}>
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Update Modal */}
      <Dialog open={showUpdateModal} onOpenChange={setShowUpdateModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Project Update</DialogTitle>
            <DialogDescription>Add a progress update to the timeline</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="update">Update Details</Label>
              <Textarea
                id="update"
                placeholder="Enter update details..."
                value={newUpdate}
                onChange={(e) => setNewUpdate(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => { setShowUpdateModal(false); setNewUpdate(''); }}>
              Cancel
            </Button>
            <Button onClick={handleAddUpdate} disabled={!newUpdate.trim()}>
              Add Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
