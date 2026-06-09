"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DocumentHeader } from "@/components/document-header"
import { Search, Scroll, Calendar } from "lucide-react"

export default function OrdinancesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [ordinances, setOrdinances] = useState<any[]>([])
  const [selectedOrdinance, setSelectedOrdinance] = useState<any | null>(null)
  const filteredOrdinances = ordinances.filter(ord => 
    ord.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ord.number.includes(searchTerm)
  )

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Ordinances</h1>
        <p className="text-sm text-muted-foreground">View published barangay ordinances and resolutions</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Search ordinances..." 
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Ordinances List */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredOrdinances.map((ordinance) => (
          <Card 
            key={ordinance.id} 
            className="transition-shadow hover:shadow-lg cursor-pointer"
            onClick={() => setSelectedOrdinance(ordinance)}
          >
            <CardHeader className="pb-2 sm:pb-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge variant="secondary" className="text-xs">
                  No. {ordinance.number} Series of {ordinance.year}
                </Badge>
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-xs">
                  {ordinance.status}
                </Badge>
              </div>
              <CardTitle className="text-sm sm:text-lg leading-tight">{ordinance.title}</CardTitle>
              <CardDescription className="flex items-center gap-1 text-xs">
                <Calendar className="h-3 w-3" />
                {ordinance.date}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2">
                <Scroll className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs sm:text-sm text-muted-foreground">By: {ordinance.author}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrdinances.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
          <Scroll className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground/50" />
          <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold">No ordinances found</h3>
          <p className="text-sm text-muted-foreground">Try adjusting your search term</p>
        </div>
      )}

      {/* Ordinance Preview Modal */}
      <Dialog open={!!selectedOrdinance} onOpenChange={() => setSelectedOrdinance(null)}>
        <DialogContent className="w-[95vw] sm:w-auto max-h-[95vh] overflow-auto max-w-3xl mx-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg text-foreground">Ordinance Document</DialogTitle>
          </DialogHeader>
          {selectedOrdinance && (
            <ScrollArea className="max-h-[65vh] sm:max-h-[70vh]">
              <div className="rounded-lg border border-gray-200 bg-white p-3 sm:p-6 md:p-8 text-gray-900">
                <DocumentHeader title={`BARANGAY ORDINANCE NO. ${selectedOrdinance.number} SERIES OF ${selectedOrdinance.year}`} />

                <h3 className="text-center font-bold mb-6 text-xs sm:text-sm">{selectedOrdinance.fullTitle}</h3>

                {/* Whereas Clauses */}
                <div className="mb-6">
                  <p className="font-bold mb-2 text-xs sm:text-sm">WHEREAS:</p>
                  {selectedOrdinance.whereas.map((clause, i) => (
                    <p key={i} className="mb-2 text-justify text-xs sm:text-sm">{clause}</p>
                  ))}
                </div>

                {/* Now Therefore */}
                <div className="mb-6">
                  <p className="font-bold mb-2 text-xs sm:text-sm">NOW THEREFORE:</p>
                  <p className="text-justify text-xs sm:text-sm">
                    BE IT ORDAINED by the Sangguniang Barangay of Barangay Santiago, Municipality of San Antonio, 
                    Province of Zambales, in session duly assembled, that:
                  </p>
                </div>

                {/* Sections */}
                {selectedOrdinance.sections.map((section, i) => (
                  <div key={i} className="mb-4">
                    <p className="font-bold text-xs sm:text-sm">SECTION {i + 1}. {section.title}</p>
                    <p className="text-justify whitespace-pre-line text-xs sm:text-sm">{section.content}</p>
                  </div>
                ))}

                {/* Footer */}
                <div className="mt-8 pt-4 border-t">
                  <p className="mb-8 text-xs sm:text-sm">ENACTED this {selectedOrdinance.date} at Barangay Santiago.</p>
                  
                  <div className="grid grid-cols-2 gap-4 sm:gap-8 text-center mt-8 sm:mt-12 text-xs sm:text-sm">
                    <div>
                      <p className="border-t border-black pt-1 font-semibold">APRIL JOY C. CANO</p>
                      <p>Barangay Secretary</p>
                      <p className="text-gray-600 mt-1">CERTIFIED CORRECT</p>
                    </div>
                    <div>
                      <p className="border-t border-black pt-1 font-semibold">ROLANDO C. BORJA</p>
                      <p>Punong Barangay</p>
                      <p className="text-gray-600 mt-1">ATTESTED BY</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
          <DialogFooter className="flex-col-reverse sm:flex-row gap-2 pt-2">
            <Button variant="outline" onClick={() => setSelectedOrdinance(null)} className="w-full sm:w-auto text-sm">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
