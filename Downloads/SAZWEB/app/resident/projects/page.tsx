"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FolderKanban, Search, Filter, Calendar, DollarSign,
  Clock, CheckCircle, AlertCircle, Eye, ChevronLeft, FileText, Image
} from "lucide-react"
import { mockProjects, mockAssets } from "@/lib/mock-data"

type Project = typeof mockProjects[0]

export default function ResidentProjects() {
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const filteredProjects = mockProjects
    .filter(p => filter === "all" || p.status === filter)
    .filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.type.toLowerCase().includes(searchTerm.toLowerCase())
    )

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
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Barangay Projects</h1>
          <p className="text-muted-foreground">View ongoing and completed barangay projects</p>
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
      <div className="grid grid-cols-3 gap-4">
        <Card className="animate-fade-in-up">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {mockProjects.filter(p => p.status === 'ongoing').length}
                </div>
                <p className="text-xs text-muted-foreground">Ongoing</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600">
                  {mockProjects.filter(p => p.status === 'planning').length}
                </div>
                <p className="text-xs text-muted-foreground">Planning</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {mockProjects.filter(p => p.status === 'completed').length}
                </div>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredProjects.map(project => (
          <Card 
            key={project.id} 
            className="hover:shadow-md transition-all cursor-pointer hover:scale-[1.01]"
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
                  <Calendar className="w-3 h-3" />
                  <span>Target: {format(new Date(project.targetCompletion), 'MMM yyyy')}</span>
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
              {filter !== 'all' ? 'No projects match the current filter' : 'No projects available'}
            </p>
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              {selectedProject && getStatusBadge(selectedProject.status)}
              <Badge variant="outline">{selectedProject?.type}</Badge>
            </div>
            <DialogTitle className="text-xl">{selectedProject?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedProject && (
            <Tabs defaultValue="details" className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4 mt-4">
                <p className="text-sm text-muted-foreground">{selectedProject.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Progress</Label>
                    <span className="text-sm font-medium">{selectedProject.progress}%</span>
                  </div>
                  <Progress value={selectedProject.progress} className="h-3 animate-progress" />
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t">
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
                </div>
                
                {projectAssets.length > 0 && (
                  <div className="pt-4 border-t">
                    <Label className="text-xs text-muted-foreground mb-2 block">Project Files</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {projectAssets.map(asset => (
                        <div key={asset.id} className="border rounded p-2 text-center text-xs">
                          {asset.type === 'Image' ? (
                            <Image className="w-6 h-6 mx-auto text-muted-foreground mb-1" />
                          ) : (
                            <FileText className="w-6 h-6 mx-auto text-muted-foreground mb-1" />
                          )}
                          <p className="truncate">{asset.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="timeline" className="space-y-4 mt-4">
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
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
