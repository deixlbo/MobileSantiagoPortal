"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Eye, Printer, Scroll, Calendar } from "lucide-react"

const mockOrdinances = [
  {
    id: "ORD-2026-001",
    number: "001",
    year: "2026",
    title: "Noise Regulation Ordinance of Barangay Santiago",
    fullTitle: "AN ORDINANCE REGULATING NOISE DISTURBANCE IN BARANGAY SANTIAGO",
    date: "March 15, 2026",
    status: "Published",
    author: "Rolando C. Borja",
    whereas: [
      "WHEREAS, excessive noise has caused disturbances among residents;",
      "WHEREAS, maintaining peace and order is essential for community welfare;",
      "WHEREAS, the barangay aims to promote a safe and harmonious environment;"
    ],
    sections: [
      { title: "TITLE", content: "This Ordinance shall be known as the \"Noise Regulation Ordinance of Barangay Santiago.\"" },
      { title: "DEFINITION OF TERMS", content: "Noise Disturbance - Any excessive or disruptive sound affecting residents\nCurfew Hours - Time period between 10:00 PM to 5:00 AM" },
      { title: "COVERAGE", content: "This Ordinance applies to all residents and establishments within Barangay Santiago." },
      { title: "PROHIBITED ACTS", content: "Playing loud music beyond allowed hours\nCausing unnecessary disturbances during curfew hours" },
      { title: "PENALTIES", content: "First Offense: Warning\nSecond Offense: PHP 500 Fine\nSubsequent Offenses: PHP 1,000 Fine or community service" },
    ]
  },
  {
    id: "ORD-2026-002",
    number: "002",
    year: "2026",
    title: "Waste Management Ordinance",
    fullTitle: "AN ORDINANCE IMPLEMENTING PROPER WASTE MANAGEMENT IN BARANGAY SANTIAGO",
    date: "February 20, 2026",
    status: "Published",
    author: "Rolando C. Borja",
    whereas: [
      "WHEREAS, proper waste management is essential for community health;",
      "WHEREAS, the barangay aims to maintain cleanliness and sanitation;",
    ],
    sections: [
      { title: "TITLE", content: "This Ordinance shall be known as the \"Waste Management Ordinance of Barangay Santiago.\"" },
      { title: "COVERAGE", content: "This Ordinance applies to all residents within Barangay Santiago." },
      { title: "PENALTIES", content: "First Offense: Warning\nSecond Offense: PHP 200 Fine" },
    ]
  },
  {
    id: "ORD-2025-003",
    number: "003",
    year: "2025",
    title: "Business Permit Guidelines",
    fullTitle: "AN ORDINANCE ESTABLISHING GUIDELINES FOR BUSINESS PERMITS IN BARANGAY SANTIAGO",
    date: "December 10, 2025",
    status: "Published",
    author: "April Joy C. Cano",
    whereas: [
      "WHEREAS, proper business regulation is essential for community development;",
    ],
    sections: [
      { title: "TITLE", content: "This Ordinance shall be known as the \"Business Permit Guidelines of Barangay Santiago.\"" },
    ]
  },
]

export default function OrdinancesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrdinance, setSelectedOrdinance] = useState<typeof mockOrdinances[0] | null>(null)

  const filteredOrdinances = mockOrdinances.filter(ord => 
    ord.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ord.number.includes(searchTerm)
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ordinances</h1>
        <p className="text-muted-foreground">View published barangay ordinances and resolutions</p>
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredOrdinances.map((ordinance) => (
          <Card key={ordinance.id} className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">
                  No. {ordinance.number} Series of {ordinance.year}
                </Badge>
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                  {ordinance.status}
                </Badge>
              </div>
              <CardTitle className="text-lg leading-tight">{ordinance.title}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {ordinance.date}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Scroll className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">By: {ordinance.author}</span>
              </div>
              <Button 
                variant="outline" 
                className="mt-4 w-full"
                onClick={() => setSelectedOrdinance(ordinance)}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Document
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrdinances.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Scroll className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No ordinances found</h3>
          <p className="text-muted-foreground">Try adjusting your search term</p>
        </div>
      )}

      {/* Ordinance Preview Modal */}
      <Dialog open={!!selectedOrdinance} onOpenChange={() => setSelectedOrdinance(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Ordinance Document</DialogTitle>
          </DialogHeader>
          {selectedOrdinance && (
            <ScrollArea className="max-h-[70vh]">
              <div className="rounded-lg border bg-white p-8 text-black print:border-0 print:p-0">
                {/* Header */}
                <div className="text-center space-y-1 mb-6">
                  <p className="text-sm">Republic of the Philippines</p>
                  <p className="text-sm">Province of Zambales</p>
                  <p className="text-sm">Municipality of San Antonio</p>
                  <p className="text-sm font-semibold">Barangay Santiago</p>
                </div>

                <div className="border-t border-b border-black py-4 my-6">
                  <h2 className="text-center font-bold">
                    BARANGAY ORDINANCE NO. {selectedOrdinance.number} SERIES OF {selectedOrdinance.year}
                  </h2>
                </div>

                <h3 className="text-center font-bold mb-6">{selectedOrdinance.fullTitle}</h3>

                {/* Whereas Clauses */}
                <div className="mb-6">
                  <p className="font-bold mb-2">WHEREAS:</p>
                  {selectedOrdinance.whereas.map((clause, i) => (
                    <p key={i} className="mb-2 text-justify">{clause}</p>
                  ))}
                </div>

                {/* Now Therefore */}
                <div className="mb-6">
                  <p className="font-bold mb-2">NOW THEREFORE:</p>
                  <p className="text-justify">
                    BE IT ORDAINED by the Sangguniang Barangay of Barangay Santiago, Municipality of San Antonio, 
                    Province of Zambales, in session duly assembled, that:
                  </p>
                </div>

                {/* Sections */}
                {selectedOrdinance.sections.map((section, i) => (
                  <div key={i} className="mb-4">
                    <p className="font-bold">SECTION {i + 1}. {section.title}</p>
                    <p className="text-justify whitespace-pre-line">{section.content}</p>
                  </div>
                ))}

                {/* Footer */}
                <div className="mt-8 pt-4 border-t">
                  <p className="mb-8">ENACTED this {selectedOrdinance.date} at Barangay Santiago.</p>
                  
                  <div className="grid grid-cols-2 gap-8 text-center mt-12">
                    <div>
                      <p className="border-t border-black pt-1 font-semibold">APRIL JOY C. CANO</p>
                      <p className="text-sm">Barangay Secretary</p>
                      <p className="text-xs text-gray-600 mt-1">CERTIFIED CORRECT</p>
                    </div>
                    <div>
                      <p className="border-t border-black pt-1 font-semibold">ROLANDO C. BORJA</p>
                      <p className="text-sm">Punong Barangay</p>
                      <p className="text-xs text-gray-600 mt-1">ATTESTED BY</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedOrdinance(null)}>Close</Button>
            <Button onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" />
              Print Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
