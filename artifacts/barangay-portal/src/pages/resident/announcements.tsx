import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PortalHeader } from "@/components/portal/header";
import { useSidebarToggle } from "@/components/portal/portal-layout";
import { api } from "@/lib/api";
import { Megaphone, Search, AlertTriangle, CalendarDays, User, X } from "lucide-react";

export default function ResidentAnnouncementsPage() {
  const { toggle } = useSidebarToggle();
  const [search, setSearch] = useState("");
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    api.announcements.list().then(setAnnouncements).catch(console.error);
  }, []);

  const filtered = announcements.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.content.toLowerCase().includes(search.toLowerCase()) ||
    (a.category ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const priorityBadge: Record<string, string> = {
    high: "bg-red-100 text-red-700 border-red-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    low: "bg-green-100 text-green-700 border-green-200",
  };

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader title="Announcements" description="Official barangay news and updates" onMenuClick={toggle} />

      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <Card className="w-full max-w-3xl shadow-2xl my-4 bg-white">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-primary/30 text-primary">{selected.category}</Badge>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${priorityBadge[selected.priority] ?? ""}`}>
                  {selected.priority === "high" ? "Urgent" : selected.priority?.charAt(0).toUpperCase() + selected.priority?.slice(1)} Priority
                </span>
              </div>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 sm:p-12 bg-white">
              <div className="text-center mb-8">
                <p className="text-sm font-semibold text-gray-700">Republic of the Philippines</p>
                <p className="text-sm text-gray-600">Province of Zambales · Municipality of San Antonio</p>
                <p className="text-base font-bold text-gray-900 mt-1">BARANGAY SANTIAGO SAZ</p>
                <div className="border-b-2 border-gray-800 mt-4 mb-6" />
                <h1 className="text-lg font-bold text-gray-900 uppercase leading-tight">{selected.title}</h1>
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500 mt-3">
                  <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{selected.author}</span>
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {selected.date ? new Date(selected.date).toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" }) : ""}
                  </span>
                </div>
              </div>

              <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                {selected.content}
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="p-4 sm:p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search announcements..."
            className="pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
            data-testid="input-search"
          />
        </div>

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <Megaphone className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No announcements found</p>
            </div>
          ) : (
            filtered.map((ann) => (
              <Card
                key={ann.id}
                onClick={() => setSelected(ann)}
                className="p-5 cursor-pointer hover:shadow-md hover:border-primary/30 transition-all border-border/50"
                data-testid={`announcement-item-${ann.id}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${ann.priority === "high" ? "bg-red-100" : ann.priority === "medium" ? "bg-amber-100" : "bg-green-100"}`}>
                    {ann.priority === "high"
                      ? <AlertTriangle className="w-5 h-5 text-red-600" />
                      : <Megaphone className={`w-5 h-5 ${ann.priority === "medium" ? "text-amber-600" : "text-green-600"}`} />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs border-primary/20 text-primary">{ann.category}</Badge>
                      {ann.priority === "high" && (
                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full border ${priorityBadge.high}`}>Urgent</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-foreground text-sm mb-1">{ann.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{ann.content}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground/70">
                      <span className="flex items-center gap-1"><User className="w-3 h-3" />{ann.author}</span>
                      <span>{ann.date ? new Date(ann.date).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" }) : ""}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
