"use client"

import { useState, useMemo } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  FolderKanban, Plus, Search, Calendar, DollarSign,
  Clock, CheckCircle, AlertCircle, Edit, Eye, Upload, FileText,
  Image, Trash2, MoreVertical, Loader2, Download, ChevronLeft, ChevronRight
} from "lucide-react"
import { mockProjects, mockAssets } from "@/lib/mock-data"

type Project = typeof mockProjects[0] & {
  history?: Array<{ date: string; action: string; by: string; remarks?: string }>
}

export default function AdminProjects() {
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [projects, setProjects] = useState<Project[]>(mockProjects.map(p => ({
    ...p,
    history: p.timeline.map(t => ({ date: t.date, action: t.update, by: 'Admin' }))
  })))
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showProgressModal, setShowProgressModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Form states
  const [newProject, setNewProject] = useState({
    name: '',
    type: '',
    description: '',
    budget: '',
    fundSource: '',
    startDate: '',
    targetCompletion: '',
    assignedTo: '',
    status: 'planning'
  })
  const [progressValue, setProgressValue] = useState(0)
  const [progressNotes, setProgressNotes] = useState("")

  const filteredProjects = useMemo(() => {
    return projects
      .filter(p => filter === "all" || p.status === filter)
      .filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
  }, [projects, filter, searchTerm])

  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredProjects.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredProjects, currentPage])

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage)

  const stats = useMemo(() => ({
    total: projects.length,
    ongoing: projects.filter(p => p.status === 'ongoing').length,
    planning: projects.filter(p => p.status === 'planning').length,
    completed: projects.filter(p => p.status === 'completed').length
  }), [projects])

  const resetForm = () => {
    setNewProject({
      name: '',
      type: '',
      description: '',
      budget: '',
      fundSource: '',
      startDate: '',
      targetCompletion: '',
      assignedTo: '',
      status: 'planning'
    })
    setProgressValue(0)
    setProgressNotes("")
  }

  const handleCreateProject = async () => {
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 500))

    const project: Project = {
      id: String(projects.length + 1),
      name: newProject.name,
      type: newProject.type,
      description: newProject.description,
      budget: Number(newProject.budget),
      fundSource: newProject.fundSource,
      status: newProject.status as 'planning' | 'ongoing' | 'completed',
      startDate: newProject.startDate,
      targetCompletion: newProject.targetCompletion,
      progress: 0,
      assignedTo: newProject.assignedTo,
      members: [],
      timeline: [{ date: format(new Date(), 'yyyy-MM-dd'), update: 'Project created' }],
      files: [],
      history: [{ date: format(new Date(), 'yyyy-MM-dd'), action: 'Project created', by: 'Admin' }]
    }

    setProjects([...projects, project])
    setShowCreateModal(false)
    resetForm()
    setIsSubmitting(false)
  }

  const handleEditProject = async () => {
    if (!selectedProject) return
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 500))

    setProjects(prev => prev.map(p =>
      p.id === selectedProject.id
        ? {
            ...p,
            name: newProject.name,
            type: newProject.type,
            description: newProject.description,
            budget: Number(newProject.budget),
            fundSource: newProject.fundSource,
            status: newProject.status as 'planning' | 'ongoing' | 'completed',
            startDate: newProject.startDate,
            targetCompletion: newProject.targetCompletion,
            assignedTo: newProject.assignedTo,
            history: [
              ...(p.history || []),
              { date: format(new Date(), 'yyyy-MM-dd'), action: 'Project details updated', by: 'Admin' }
            ]
          }
        : p
    ))

    setShowEditModal(false)
    resetForm()
    setIsSubmitting(false)
  }

  const handleUpdateProgress = async () => {
    if (!selectedProject) return
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 500))

    const newStatus = progressValue === 100 ? 'completed' : progressValue > 0 ? 'ongoing' : 'planning'

    setProjects(prev => prev.map(p =>
      p.id === selectedProject.id
        ? {
            ...p,
            progress: progressValue,
            status: newStatus,
            timeline: [...p.timeline, { date: format(new Date(), 'yyyy-MM-dd'), update: `Progress updated to ${progressValue}%` }],
            history: [
              ...(p.history || []),
              { date: format(new Date(), 'yyyy-MM-dd'), action: `Progress updated to ${progressValue}%`, by: 'Admin', remarks: progressNotes }
            ]
          }
        : p
    ))

    setSelectedProject(prev => prev ? { ...prev, progress: progressValue, status: newStatus } : null)
    setShowProgressModal(false)
    setProgressNotes("")
    setIsSubmitting(false)
  }

  const handleDeleteProject = async () => {
    if (!selectedProject) return
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 500))

    setProjects(prev => prev.filter(p => p.id !== selectedProject.id))
    setShowDeleteDialog(false)
    setSelectedProject(null)
    setIsSubmitting(false)
  }

  const openEditModal = (project: Project) => {
    setSelectedProject(project)
    setNewProject({
      name: project.name,
      type: project.type,
      description: project.description,
      budget: String(project.budget),
      fundSource: project.fundSource,
      startDate: project.startDate,
      targetCompletion: project.targetCompletion,
      assignedTo: project.assignedTo,
      status: project.status
    })
    setShowEditModal(true)
  }

  const openProgressModal = (project: Project) => {
    setSelectedProject(project)
    setProgressValue(project.progress)
    setShowProgressModal(true)
  }

  const openDetailsModal = (project: Project) => {
    setSelectedProject(project)
    setActiveTab("overview")
    setShowDetailsModal(true)
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

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter("all")}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg border flex items-center justify-center">
                <FolderKanban className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">Total Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter("ongoing")}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg border flex items-center justify-center bg-blue-50">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.ongoing}</div>
                <p className="text-xs text-muted-foreground">Ongoing</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter("planning")}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg border flex items-center justify-center bg-amber-50">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600">{stats.planning}</div>
                <p className="text-xs text-muted-foreground">Planning</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter("completed")}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg border flex items-center justify-center bg-green-50">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {paginatedProjects.map(project => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Left: Status & Type */}
                <div className="flex items-center gap-3 lg:w-32">
                  <div className="flex flex-col gap-1">
                    {getStatusBadge(project.status)}
                    <Badge variant="outline" className="text-xs">{project.type}</Badge>
                  </div>
                </div>

                {/* Middle: Project Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate">{project.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                </div>

                {/* Progress */}
                <div className="lg:w-32">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                {/* Budget & Target */}
                <div className="flex gap-4 lg:w-48">
                  <div className="text-sm">
                    <p className="text-muted-foreground">Budget</p>
                    <p className="font-medium">PHP {(project.budget / 1000).toFixed(0)}k</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-muted-foreground">Target Date</p>
                    <p className="font-medium">{format(new Date(project.targetCompletion), 'MMM yyyy')}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => openDetailsModal(project)}>
                    View Details
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openProgressModal(project)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Update Progress
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditModal(project)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Project
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => {
                          setSelectedProject(project)
                          setShowDeleteDialog(true)
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredProjects.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <FolderKanban className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold mb-1">No projects found</h3>
              <p className="text-sm text-muted-foreground">
                {filter !== 'all' ? 'No projects match the current filter' : 'Create your first project to get started'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {filteredProjects.length > 0 && (
          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredProjects.length)} of {filteredProjects.length} projects
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm px-3 py-1 border rounded">{currentPage}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Project Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Project Details</DialogTitle>
          </DialogHeader>

          {selectedProject && (
            <>
              {/* Project Header */}
              <div className="p-4 bg-muted/50 rounded-lg mb-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-background border flex items-center justify-center">
                    <FolderKanban className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusBadge(selectedProject.status)}
                      <Badge variant="outline">{selectedProject.type}</Badge>
                    </div>
                    <h3 className="font-semibold text-lg">{selectedProject.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedProject.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Project ID</p>
                    <p className="font-mono">PRJ-{selectedProject.id.padStart(4, '0')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Budget</p>
                    <p className="font-medium">PHP {selectedProject.budget.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Target Date</p>
                    <p className="font-medium">{format(new Date(selectedProject.targetCompletion), 'MMM yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <p className="font-medium capitalize">{selectedProject.status}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Start Date</p>
                    <p className="font-medium">{format(new Date(selectedProject.startDate), 'MMM d, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Project Leader</p>
                    <p className="font-medium">{selectedProject.assignedTo}</p>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <Label>Progress</Label>
                  <span className="font-semibold">{selectedProject.progress}%</span>
                </div>
                <Progress value={selectedProject.progress} className="h-3" />
                <p className="text-xs text-muted-foreground mt-1">
                  Last updated: {selectedProject.timeline[selectedProject.timeline.length - 1]?.date}
                </p>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="milestones">Milestones</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 mt-4">
                  <div>
                    <h4 className="font-medium mb-2">Project Overview</h4>
                    <p className="text-sm text-muted-foreground">{selectedProject.description}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Objectives</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>Improve road conditions for safer travel</li>
                      <li>Enhance drainage system</li>
                      <li>Promote accessibility for all residents</li>
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="milestones" className="space-y-4 mt-4">
                  <div className="relative border-l-2 border-primary/20 pl-6 ml-2 space-y-6">
                    {selectedProject.timeline.map((item, index) => (
                      <div key={index} className="relative">
                        <div className="absolute -left-[29px] w-4 h-4 rounded-full bg-primary border-2 border-background" />
                        <div className="text-xs text-muted-foreground mb-1">
                          {format(new Date(item.date), 'MMMM d, yyyy')}
                        </div>
                        <p className="text-sm">{item.update}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Project Documents</h4>
                    <Button variant="outline" size="sm" onClick={() => setShowUploadModal(true)}>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Document
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Document Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Uploaded By</TableHead>
                        <TableHead>Date Uploaded</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Project Proposal.pdf</TableCell>
                        <TableCell>PDF</TableCell>
                        <TableCell>Admin</TableCell>
                        <TableCell>Jan 5, 2026</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon"><Download className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Budget Breakdown.xlsx</TableCell>
                        <TableCell>Excel</TableCell>
                        <TableCell>Admin</TableCell>
                        <TableCell>Jan 6, 2026</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon"><Download className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="history" className="space-y-4 mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date / Time</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>By</TableHead>
                        <TableHead>Remarks</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(selectedProject.history || []).map((entry, index) => (
                        <TableRow key={index}>
                          <TableCell className="text-sm">
                            {format(new Date(entry.date), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell>{entry.action}</TableCell>
                          <TableCell>{entry.by}</TableCell>
                          <TableCell>{entry.remarks || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>

              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Project Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>Add a new barangay project to track</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="projectTitle">Project Title</Label>
              <Input
                id="projectTitle"
                placeholder="Enter project title"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={newProject.type} onValueChange={(v) => setNewProject({ ...newProject, type: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="Program">Program</SelectItem>
                  <SelectItem value="Event">Event</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Enter project description..."
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Budget (PHP)</Label>
                <Input
                  type="number"
                  placeholder="Enter budget"
                  value={newProject.budget}
                  onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Target Date</Label>
                <Input
                  type="date"
                  value={newProject.targetCompletion}
                  onChange={(e) => setNewProject({ ...newProject, targetCompletion: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={newProject.startDate}
                  onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Project Leader</Label>
                <Input
                  placeholder="Enter project leader"
                  value={newProject.assignedTo}
                  onChange={(e) => setNewProject({ ...newProject, assignedTo: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={newProject.status} onValueChange={(v) => setNewProject({ ...newProject, status: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Upload Project Plan / Document (optional)</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG (Max. 5MB)</p>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProject} disabled={isSubmitting || !newProject.name}>
              {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Project Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ordinance Number</Label>
                <Input value={`PRJ-${selectedProject?.id.padStart(4, '0')}`} disabled />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={newProject.type} onValueChange={(v) => setNewProject({ ...newProject, type: v })}>
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
              <div />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Budget (PHP)</Label>
                <Input
                  type="number"
                  value={newProject.budget}
                  onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Target Date</Label>
                <Input
                  type="date"
                  value={newProject.targetCompletion}
                  onChange={(e) => setNewProject({ ...newProject, targetCompletion: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={newProject.startDate}
                  onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Project Leader</Label>
                <Input
                  value={newProject.assignedTo}
                  onChange={(e) => setNewProject({ ...newProject, assignedTo: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={newProject.status} onValueChange={(v) => setNewProject({ ...newProject, status: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditProject} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Progress Modal */}
      <Dialog open={showProgressModal} onOpenChange={setShowProgressModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Project Progress</DialogTitle>
          </DialogHeader>

          {selectedProject && (
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="font-medium">{selectedProject.name} (PRJ-{selectedProject.id.padStart(4, '0')})</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Current Progress</Label>
                  <span className="font-medium">{selectedProject.progress}%</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Update Progress (%)</Label>
                  <span className="font-medium">{progressValue}%</span>
                </div>
                <Slider
                  value={[progressValue]}
                  onValueChange={([val]) => setProgressValue(val)}
                  max={100}
                  step={5}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Progress Notes</Label>
                <Textarea
                  placeholder="Enter progress notes, accomplishments, issues, etc..."
                  value={progressNotes}
                  onChange={(e) => setProgressNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Upload Photos (optional)</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG (Max. 5MB each)</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowProgressModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProgress} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Update Progress
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-amber-100">
                <AlertCircle className="w-8 h-8 text-amber-600" />
              </div>
            </div>
            <AlertDialogTitle className="text-center">Delete Project</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Are you sure you want to delete this project?<br />
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {selectedProject && (
            <div className="p-4 bg-muted/50 rounded-lg text-center my-4">
              <p className="font-semibold">{selectedProject.name}</p>
              <p className="text-sm text-muted-foreground font-mono">PRJ-{selectedProject.id.padStart(4, '0')}</p>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteProject}
            >
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
