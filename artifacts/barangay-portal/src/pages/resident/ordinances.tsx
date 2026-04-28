import { ResidentLayout } from "@/components/resident-layout";
import { useListOrdinances } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Scale, Eye, Printer, FileText } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { OrdinancePreview, PrintModal } from "@/components/document-template";

export default function ResidentOrdinances() {
  const [search, setSearch] = useState("");
  const [selectedOrdinance, setSelectedOrdinance] = useState<any>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const { data: ordinances = [], isLoading } = useListOrdinances({ 
    status: "enacted",
    search: search || undefined
  });

  const handleView = (ordinance: any) => {
    setSelectedOrdinance(ordinance);
    setIsPrintModalOpen(true);
  };

  return (
    <ResidentLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Barangay Ordinances</h2>
          <p className="text-muted-foreground">Browse enacted local laws and resolutions of Barangay Santiago.</p>
        </div>

        <Card>
          <div className="p-4 border-b flex flex-col sm:flex-row gap-4 items-center justify-between bg-muted/10">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search ordinances by title or number..."
                className="pl-8 bg-background"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Scale className="w-4 h-4" />
              <span>{ordinances.length} Enacted Ordinances</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Ord. No.</TableHead>
                  <TableHead>Title & Description</TableHead>
                  <TableHead className="w-[150px]">Date Enacted</TableHead>
                  <TableHead className="w-[100px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12">Loading ordinances...</TableCell>
                  </TableRow>
                ) : ordinances.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <FileText className="w-8 h-8 opacity-50" />
                        <p>No ordinances found.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  ordinances.map((ord) => (
                    <TableRow key={ord.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium whitespace-nowrap align-top pt-4">
                        {ord.ordinanceNumber}
                        <div className="text-xs font-normal text-muted-foreground mt-1">{ord.ordinanceType}</div>
                      </TableCell>
                      <TableCell className="align-top pt-4">
                        <div className="font-semibold text-foreground mb-1 pr-4">{ord.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-2 pr-4">{ord.description}</div>
                        <div className="text-xs text-muted-foreground mt-2 italic">Author: {ord.author}</div>
                      </TableCell>
                      <TableCell className="align-top pt-4 text-sm">
                        {ord.enactedDate ? format(new Date(ord.enactedDate), "MMM d, yyyy") : '-'}
                      </TableCell>
                      <TableCell className="align-top pt-4 text-right">
                        <Button variant="ghost" size="sm" className="h-8" onClick={() => handleView(ord)}>
                          <Eye className="w-4 h-4 mr-2 text-primary" /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      <PrintModal 
        title={`View Ordinance: ${selectedOrdinance?.ordinanceNumber}`} 
        open={isPrintModalOpen} 
        onOpenChange={setIsPrintModalOpen}
      >
        {selectedOrdinance && <OrdinancePreview ordinance={selectedOrdinance} />}
      </PrintModal>
    </ResidentLayout>
  );
}
