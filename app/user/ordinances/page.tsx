'use client';

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, X, Eye, Calendar, User } from "lucide-react";

type OrdinanceType = "Ordinance" | "Resolution";
type OrdinanceStatus = "Active" | "Repealed" | "Superseded";

interface Ordinance {
  id: string;
  number: string;
  title: string;
  type: OrdinanceType;
  dateEnacted: string;
  author: string;
  status: OrdinanceStatus;
  summary: string;
  fullText: string;
}

const statusStyle: Record<OrdinanceStatus, string> = {
  Active: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Repealed: "bg-gray-100 text-gray-600 border-gray-200",
  Superseded: "bg-amber-100 text-amber-700 border-amber-200",
};

function parseDocumentSections(text: string) {
  return text
    .split(/\n---\n/)
    .map(s => s.trim())
    .filter(Boolean);
}

function OrdinanceDocument({ ord, onClose }: { ord: Ordinance; onClose: () => void }) {
  const sections = parseDocumentSections(ord.fullText);
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-3xl shadow-2xl my-4 bg-white animate-fadeUp">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full border border-primary/20 text-primary">{ord.type}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusStyle[ord.status]}`}>{ord.status}</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Document Body */}
        <div className="p-8 sm:p-12 bg-white">
          {/* Gov Header */}
          <div className="text-center mb-8">
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Republic of the Philippines</p>
            <p className="text-xs text-gray-600">Province of Zambales · Municipality of San Antonio</p>
            <p className="text-sm font-bold text-gray-900 mt-1 uppercase">Barangay Santiago Saz</p>
            <p className="text-xs text-gray-500">Sangguniang Barangay</p>
            <div className="border-b-2 border-gray-800 mt-4 mb-6" />
            <p className="text-xs font-mono text-gray-500 mb-2 tracking-widest">{ord.number}</p>
            <h1 className="text-base font-bold text-gray-900 uppercase leading-snug max-w-lg mx-auto">{ord.title}</h1>
            <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><User className="w-3 h-3" />{ord.author}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(ord.dateEnacted).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" })}</span>
            </div>
          </div>

          {/* Summary callout */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-5 py-3 mb-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Summary</p>
            <p className="text-sm text-gray-700 italic leading-relaxed">{ord.summary}</p>
          </div>

          {/* Full Text Sections */}
          <div className="space-y-4">
            {sections.map((section, i) => {
              const lines = section.split("\n");
              const firstLine = lines[0];
              const rest = lines.slice(1).join("\n").trim();
              const isSectionHeader = /^SECTION\s+\d+/i.test(firstLine) || /^(BARANGAY|AN ORDINANCE|AN RESOLUTION|BE IT|ENACTED|Certified|Approved|Barangay Councilors)/i.test(firstLine);
              return (
                <div key={i} className={isSectionHeader ? "pt-2" : ""}>
                  {isSectionHeader ? (
                    <>
                      <p className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-1">{firstLine}</p>
                      {rest && <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{rest}</p>}
                    </>
                  ) : (
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{section}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function ResidentOrdinancesPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Ordinance | null>(null);
  const [typeFilter, setTypeFilter] = useState<"all" | OrdinanceType>("all");
  const [ordinances, setOrdinances] = useState<Ordinance[]>([]);

  useEffect(() => {
    api.ordinances.list().then(setOrdinances).catch(console.error);
  }, []);

  const filtered = ordinances.filter(o => {
    const m = o.title.toLowerCase().includes(search.toLowerCase())
      || o.number.toLowerCase().includes(search.toLowerCase())
      || (o.summary ?? "").toLowerCase().includes(search.toLowerCase());
    const f = typeFilter === "all" || o.type === typeFilter;
    return m && f;
  });

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Ordinances & Resolutions"
        description="Official barangay laws and resolutions"
        onMenuClick={toggle}
      />

      {selected && <OrdinanceDocument ord={selected} onClose={() => setSelected(null)} />}

      <div className="p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="Search ordinances..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            {(["all", "Ordinance", "Resolution"] as const).map(f => (
              <button
                key={f}
                onClick={() => setTypeFilter(f)}
                className={`text-sm px-3 py-1.5 rounded-full border font-medium transition-all ${typeFilter === f ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
              >
                {f === "all" ? "All" : f}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">{filtered.length} {filtered.length === 1 ? "record" : "records"} — Click any card to read the full document</p>

        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.length === 0 ? (
            <div className="sm:col-span-2 text-center py-12">
              <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No ordinances found</p>
            </div>
          ) : (
            filtered.map(ord => (
              <Card
                key={ord.id}
                className="p-5 border-border/50 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group"
                onClick={() => setSelected(ord)}
              >
                {/* Top row: type + status */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full border border-primary/20 text-primary bg-primary/5">{ord.type}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusStyle[ord.status]}`}>{ord.status}</span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-3 mb-3 uppercase">{ord.title}</h3>

                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" />{ord.author}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(ord.dateEnacted).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}</span>
                </div>

                {/* Summary */}
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4">{ord.summary}</p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                  <span className="text-xs font-mono text-muted-foreground/70">{ord.number}</span>
                  <span className="flex items-center gap-1 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="w-3.5 h-3.5" /> View Document
                  </span>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
