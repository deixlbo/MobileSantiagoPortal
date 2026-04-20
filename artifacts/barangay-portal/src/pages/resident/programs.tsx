import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PortalHeader } from "@/components/portal/header";
import { useSidebarToggle } from "@/components/portal/portal-layout";
import { api } from "@/lib/api";
import { FolderKanban, Users, MapPin, CalendarDays, CheckCircle2, Clock, ArrowRight, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ProjectStatus = "planning" | "ongoing" | "completed";

type Project = { 
  id: string; 
  title: string; 
  description: string; 
  category: string; 
  status: ProjectStatus; 
  startDate: string; 
  endDate: string; 
  location: string; 
  budget: number; 
  leadBy: string; 
  beneficiaries: number; 
  fundSource: string; 
  milestones?: Array<{ name: string; date: string; status: "completed" | "pending" }>;
  objectives?: string; 
  targetBeneficiaries?: string; 
  expectedOutput?: string; 
};

export default function ResidentProgramsPage() {
  const { toggle } = useSidebarToggle();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selected, setSelected] = useState<Project | null>(null);
  const [joined, setJoined] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<"all" | ProjectStatus>("all");

  useEffect(() => {
    api.projects.list().then(data => setProjects(data as Project[])).catch(console.error);
  }, []);

  const statusStyles: Record<ProjectStatus, string> = {
    planning: "bg-blue-50 text-blue-700 border-blue-200",
    ongoing: "bg-amber-50 text-amber-700 border-amber-200",
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  const filtered = projects.filter(p => filter === "all" || p.status === filter);

  const handleJoin = (proj: Project) => {
    setJoined(prev => {
      const next = new Set(prev);
      next.add(proj.id);
      return next;
    });
    toast({ title: "Registered!", description: `You have registered for "${proj.title}". The barangay will contact you with details.` });
    setSelected(null);
  };

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader title="Community Programs" description="Barangay projects and events" onMenuClick={toggle} />

      <div className="p-4 sm:p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {(["all", "planning", "ongoing", "completed"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-sm px-3 py-1.5 rounded-full border font-medium transition-all ${filter === f ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40"}`}
              data-testid={`filter-${f}`}
            >
              {f === "all" ? "All Programs" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Detail view */}
        {selected ? (
          <Card className="p-6 border-primary/20 animate-fadeUp">
            <button onClick={() => setSelected(null)} className="text-sm text-muted-foreground hover:text-foreground mb-4">← Back to list</button>
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs border-primary/30 text-primary">{selected.category}</Badge>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusStyles[selected.status]}`}>{selected.status}</span>
                </div>
                <h2 className="text-xl font-bold text-foreground">{selected.title}</h2>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-5">{selected.description}</p>
            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              {[
                { label: "Location", value: selected.location, icon: <MapPin className="w-4 h-4" /> },
                { label: "Lead By", value: selected.leadBy, icon: <Users className="w-4 h-4" /> },
                { label: "Start Date", value: new Date(selected.startDate).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" }), icon: <CalendarDays className="w-4 h-4" /> },
                { label: "Target Beneficiaries", value: `${selected.beneficiaries} residents`, icon: <Users className="w-4 h-4" /> },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                  <span className="text-primary mt-0.5">{item.icon}</span>
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-medium text-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Milestones */}
            <h3 className="font-semibold text-foreground mb-3">Timeline & Milestones</h3>
            <div className="space-y-2 mb-5">
              {selected.milestones?.map((m: { name: string; date: string; status: "completed" | "pending" }, i: number) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/40">
                  {m.status === "completed"
                    ? <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                    : <Clock className="w-4.5 h-4.5 text-muted-foreground shrink-0" />
                  }
                  <span className={`text-sm flex-1 ${m.status === "completed" ? "text-foreground" : "text-muted-foreground"}`}>{m.name}</span>
                  <span className="text-xs text-muted-foreground">{new Date(m.date).toLocaleDateString("en-PH", { month: "short", day: "numeric" })}</span>
                </div>
              ))}
            </div>

            {selected.status !== "completed" && (
              <Button
                onClick={() => handleJoin(selected)}
                disabled={joined.has(selected.id)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 w-full sm:w-auto"
                data-testid="button-join-program"
              >
                {joined.has(selected.id) ? <><CheckCircle2 className="w-4 h-4" /> Registered</> : "Register / Join Program"}
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {filtered.map((proj) => (
              <Card
                key={proj.id}
                onClick={() => setSelected(proj)}
                className="p-5 cursor-pointer hover:shadow-md hover:border-primary/30 transition-all"
                data-testid={`program-card-${proj.id}`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <Badge variant="outline" className="text-xs mb-2 border-primary/20 text-primary">{proj.category}</Badge>
                    <h3 className="font-semibold text-foreground leading-tight">{proj.title}</h3>
                  </div>
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full border font-medium ${statusStyles[proj.status]}`}>{proj.status}</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{proj.description}</p>
                <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground pt-3 border-t border-border/50">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{proj.location}</span>
                  <span className="flex items-center gap-1 text-primary font-medium">
                    {joined.has(proj.id) ? <><CheckCircle2 className="w-3 h-3" /> Registered</> : <>Details <ArrowRight className="w-3 h-3" /></>}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
