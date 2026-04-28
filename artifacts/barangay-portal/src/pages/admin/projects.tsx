import { AdminLayout } from "@/components/admin-layout";
import { useListProjects, useGetProjectStats, useCreateProject, useUpdateProject, getListProjectsQueryKey, getGetProjectStatsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { HardHat, Plus, Activity, Calendar, LayoutTemplate, CheckCircle2, Printer } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { PrintModal, ProjectReport as ProjectReportTemplate } from "@/components/document-template";

export default function Projects() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [tempProgress, setTempProgress] = useState<number>(0);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const { data: stats } = useGetProjectStats();
  const { data: projects = [], isLoading } = useListProjects();

  const createProject = useCreateProject({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetProjectStatsQueryKey() });
        toast.success("Project created successfully");
        setIsCreateOpen(false);
      }
    }
  });

  const updateProject = useUpdateProject({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetProjectStatsQueryKey() });
        toast.success("Project updated successfully");
      }
    }
  });

  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Parse budget breakdown from JSON
    let budgetBreakdown = [];
    try {
      const bdStr = formData.get("budgetBreakdown") as string;
      if (bdStr) {
        budgetBreakdown = JSON.parse(bdStr);
      }
    } catch (e) {
      budgetBreakdown = [
        { category: "Materials", amount: Number(formData.get("budget")) * 0.625 },
        { category: "Labor", amount: Number(formData.get("budget")) * 0.292 },
        { category: "Others", amount: Number(formData.get("budget")) * 0.083 }
      ];
    }

    createProject.mutate({
      data: {
        title: formData.get("title") as string,
        code: formData.get("code") as string,
        category: formData.get("category") as string,
        description: formData.get("description") as string,
        objectives: [formData.get("objectives") as string],
        budget: Number(formData.get("budget")),
        budgetBreakdown: budgetBreakdown,
        startDate: formData.get("startDate") as string,
        targetDate: formData.get("targetDate") as string,
        location: formData.get("location") as string,
        projectLeader: formData.get("projectLeader") as string,
        status: formData.get("status") as string,
        progress: Number(formData.get("progress") || 0),
        sourceOfFunds: formData.get("sourceOfFunds") as string,
        engineer: formData.get("engineer") as string,
        chairman: formData.get("chairman") as string,
        captain: formData.get("captain") as string,
      }
    });
  };

  const handleUpdateProgress = () => {
    if (!selectedProject) return;
    updateProject.mutate({
      id: selectedProject.id,
      data: {
        ...selectedProject,
        progress: tempProgress,
        status: tempProgress === 100 ? "completed" : selectedProject.status,
      }
    });
  };

  const openDetails = (project: any) => {
    setSelectedProject(project);
    setTempProgress(project.progress);
    setIsDetailsOpen(true);
  };

  const statCards = [
    { label: "All Projects", value: stats?.total || 0, icon: LayoutTemplate, color: "text-blue-600", bg: "bg-blue-600/10" },
    { label: "Ongoing", value: stats?.ongoing || 0, icon: Activity, color: "text-amber-600", bg: "bg-amber-600/10" },
    { label: "In Planning", value: stats?.planning || 0, icon: Calendar, color: "text-purple-600", bg: "bg-purple-600/10" },
    { label: "Completed", value: stats?.completed || 0, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-600/10" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge className="bg-emerald-500">Completed</Badge>;
      case 'ongoing': return <Badge className="bg-blue-500">Ongoing</Badge>;
      case 'planning': return <Badge className="bg-purple-500">Planning</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Barangay Projects</h2>
            <p className="text-muted-foreground">Manage infrastructure, health, and community programs.</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" /> New Project</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="title">Project Title *</Label>
                    <Input id="title" name="title" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code">Project Code</Label>
                    <Input id="code" name="code" placeholder="e.g., BS-2024-INF-001" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select name="category" defaultValue="Infrastructure">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                        <SelectItem value="Health">Health & Sanitation</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Livelihood">Livelihood</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" placeholder="e.g., Purok 3, Barangay Santiago" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sourceOfFunds">Source of Funds</Label>
                    <Input id="sourceOfFunds" name="sourceOfFunds" placeholder="e.g., Barangay Fund" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">Total Budget (PHP) *</Label>
                    <Input id="budget" name="budget" type="number" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input id="startDate" name="startDate" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetDate">Target Completion Date *</Label>
                    <Input id="targetDate" name="targetDate" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectLeader">Project Leader/Engineer *</Label>
                    <Input id="projectLeader" name="projectLeader" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="engineer">Engineer</Label>
                    <Input id="engineer" name="engineer" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="chairman">Barangay Chairman/Captain</Label>
                    <Input id="chairman" name="chairman" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="captain">Barangay Captain</Label>
                    <Input id="captain" name="captain" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select name="status" defaultValue="planning">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="objectives">Project Objectives</Label>
                    <Textarea id="objectives" name="objectives" rows={2} placeholder="List main objectives..." />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="description">Project Description *</Label>
                    <Textarea id="description" name="description" rows={3} required />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={createProject.isPending}>
                    {createProject.isPending ? "Creating..." : "Create Project"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between pb-2">
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <div className={`w-8 h-8 rounded-full ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="animate-pulse h-[300px]"></Card>
            ))
          ) : projects.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
              No projects found.
            </div>
          ) : (
            projects.map((project) => (
              <Card key={project.id} className="flex flex-col hover-elevate cursor-pointer" onClick={() => openDetails(project)}>
                <div className="h-32 bg-muted/50 rounded-t-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay" />
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <HardHat className="w-8 h-8 opacity-20" />
                  </div>
                  <div className="absolute top-2 right-2">
                    {getStatusBadge(project.status)}
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-primary mb-1">
                    {project.category}
                  </div>
                  <CardTitle className="text-lg line-clamp-1">{project.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 pb-2">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {project.description}
                  </p>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Budget:</span>
                      <span className="font-semibold">
                        {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(project.budget)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Project Information Sheet</DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">{selectedProject.title}</h3>
                  {selectedProject.code && <p className="text-sm text-muted-foreground">Code: {selectedProject.code}</p>}
                </div>
                {getStatusBadge(selectedProject.status)}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm bg-muted/20 p-4 rounded-lg">
                <div><span className="text-muted-foreground block text-xs font-semibold">CATEGORY</span> {selectedProject.category}</div>
                <div><span className="text-muted-foreground block text-xs font-semibold">LOCATION</span> {selectedProject.location || "Not specified"}</div>
                <div><span className="text-muted-foreground block text-xs font-semibold">PROJECT LEADER</span> {selectedProject.projectLeader}</div>
                <div><span className="text-muted-foreground block text-xs font-semibold">SOURCE OF FUNDS</span> {selectedProject.sourceOfFunds || "Not specified"}</div>
                <div><span className="text-muted-foreground block text-xs font-semibold">START DATE</span> {format(new Date(selectedProject.startDate), "MMM d, yyyy")}</div>
                <div><span className="text-muted-foreground block text-xs font-semibold">TARGET COMPLETION</span> {format(new Date(selectedProject.targetDate), "MMM d, yyyy")}</div>
              </div>

              <div className="bg-muted/20 p-4 rounded-lg space-y-3">
                <div>
                  <span className="text-xs font-semibold text-muted-foreground block">TOTAL BUDGET</span> 
                  <span className="font-bold text-lg">{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(selectedProject.budget)}</span>
                </div>
                {selectedProject.budgetBreakdown && Array.isArray(selectedProject.budgetBreakdown) && selectedProject.budgetBreakdown.length > 0 && (
                  <div className="space-y-2 pt-3 border-t">
                    <span className="text-xs font-semibold text-muted-foreground block">BUDGET BREAKDOWN</span>
                    {selectedProject.budgetBreakdown.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{item.category}</span>
                        <span className="font-semibold">{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(item.amount)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <span className="text-xs font-semibold text-muted-foreground block mb-2">PROJECT DESCRIPTION</span>
                <p className="text-sm text-foreground">{selectedProject.description}</p>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div>
                  <Label className="text-xs font-semibold">Progress: {tempProgress}%</Label>
                  <Progress value={tempProgress} className="h-2 mt-2" />
                </div>
                <div className="flex items-center gap-4">
                  <Slider 
                    value={[tempProgress]} 
                    onValueChange={(vals) => setTempProgress(vals[0])} 
                    max={100} 
                    step={5} 
                    className="flex-1"
                  />
                  <Button onClick={handleUpdateProgress} disabled={updateProject.isPending} size="sm">
                    Update
                  </Button>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t gap-2">
                <Button variant="outline" onClick={() => setIsPrintModalOpen(true)}>
                  <Printer className="w-4 h-4 mr-2" /> Generate PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <PrintModal 
        title="Project Report"
        open={isPrintModalOpen}
        onOpenChange={setIsPrintModalOpen}
      >
        {selectedProject && <ProjectReportTemplate project={selectedProject} />}
      </PrintModal>

    </AdminLayout>
  );
}
