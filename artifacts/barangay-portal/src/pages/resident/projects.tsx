import { ResidentLayout } from "@/components/resident-layout";
import { useListProjects } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { HardHat, Search, Calendar, FileText } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { formatPHP } from "@/lib/format";
import { PrintModal, ProjectReport } from "@/components/document-template";

export default function ResidentProjects() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const { data: projects = [], isLoading } = useListProjects({
    search: search || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined
  });

  const handleView = (project: any) => {
    setSelectedProject(project);
    setIsPrintModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge className="bg-emerald-500">Completed</Badge>;
      case 'ongoing': return <Badge className="bg-blue-500">Ongoing</Badge>;
      case 'planning': return <Badge className="bg-purple-500">Planning</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <ResidentLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Barangay Projects</h2>
          <p className="text-muted-foreground">Track infrastructure and community development initiatives.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border border-border/50 shadow-sm">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-9 bg-background h-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse h-[340px]"></Card>
            ))
          ) : projects.length === 0 ? (
            <div className="col-span-full py-16 text-center border-2 border-dashed rounded-xl bg-muted/20">
              <HardHat className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-4" />
              <p className="text-muted-foreground text-lg">No projects match your filters.</p>
            </div>
          ) : (
            projects.map((project) => (
              <Card key={project.id} className="flex flex-col hover-elevate transition-all border-border/50 overflow-hidden bg-card group">
                <div className="h-28 bg-muted relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent mix-blend-overlay z-10" />
                  <HardHat className="w-12 h-12 text-muted-foreground opacity-20 group-hover:scale-110 transition-transform duration-500 z-0" />
                  <div className="absolute top-3 right-3 z-20 shadow-sm">
                    {getStatusBadge(project.status)}
                  </div>
                  <div className="absolute bottom-3 left-3 z-20">
                    <Badge variant="outline" className="bg-background/80 backdrop-blur-sm border-none shadow-sm text-foreground">
                      {project.category}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-2 pt-4">
                  <CardTitle className="text-lg line-clamp-1 leading-snug" title={project.title}>
                    {project.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="flex-1 pb-4">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-5 min-h-[40px]">
                    {project.description}
                  </p>
                  
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-muted-foreground uppercase tracking-wider">Progress</span>
                        <span className={project.progress === 100 ? "text-emerald-600" : "text-primary"}>{project.progress}%</span>
                      </div>
                      <Progress 
                        value={project.progress} 
                        className="h-2" 
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs border-t pt-4 border-border/50">
                      <div>
                        <span className="text-muted-foreground block mb-1">Budget</span>
                        <span className="font-semibold text-sm">{formatPHP(project.budget)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-1">Target Date</span>
                        <span className="font-medium text-sm flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-primary/70" />
                          {format(new Date(project.targetDate), "MMM yyyy")}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-0 p-4 border-t border-border/50">
                  <Button variant="ghost" className="w-full text-primary hover:bg-primary/10" onClick={() => handleView(project)}>
                    <FileText className="w-4 h-4 mr-2" /> View Full Report
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>

      <PrintModal 
        title="Project Accomplishment Report"
        open={isPrintModalOpen}
        onOpenChange={setIsPrintModalOpen}
      >
        {selectedProject && <ProjectReport project={selectedProject} />}
      </PrintModal>
    </ResidentLayout>
  );
}
