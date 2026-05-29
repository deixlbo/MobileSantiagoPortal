"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Search, 
  Eye,
  Plus,
  Scroll,
  Edit,
  Calendar
} from "lucide-react"
import { Trash2 } from "lucide-react"
import { updateOrdinance, deleteOrdinance, publishOrdinance, draftOrdinance } from "@/lib/ordinance-utils"

const mockOrdinances = [
  {
    id: "ORD-2026-001",
    number: "001",
    year: "2026",
    title: "Noise Regulation Ordinance of Barangay Santiago",
    fullTitle: "AN ORDINANCE REGULATING NOISE DISTURBANCE IN BARANGAY SANTIAGO",
    status: "Published",
    date: "March 15, 2026",
    author: "Rolando C. Borja",
    whereas: [
      "WHEREAS, excessive noise has caused disturbances among residents;",
      "WHEREAS, maintaining peace and order is essential for community welfare;",
    ],
    sections: [
      { title: "TITLE", content: "This Ordinance shall be known as the \"Noise Regulation Ordinance of Barangay Santiago.\"" },
      { title: "COVERAGE", content: "This Ordinance applies to all residents and establishments within Barangay Santiago." },
      { title: "PENALTIES", content: "First Offense: Warning\nSecond Offense: PHP 500 Fine\nSubsequent Offenses: PHP 1,000 Fine" },
    ]
  },
  {
    id: "ORD-2026-002",
    number: "002",
    year: "2026",
    title: "Waste Management Ordinance",
    fullTitle: "AN ORDINANCE IMPLEMENTING PROPER WASTE MANAGEMENT IN BARANGAY SANTIAGO",
    status: "Draft",
    date: "April 10, 2026",
    author: "Rolando C. Borja",
    whereas: ["WHEREAS, proper waste management is essential for community health;"],
    sections: [{ title: "TITLE", content: "This Ordinance shall be known as the \"Waste Management Ordinance of Barangay Santiago.\"" }]
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function OfficialOrdinancesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [ordinances, setOrdinances] = useState(mockOrdinances)
  const [selectedOrdinance, setSelectedOrdinance] = useState<typeof mockOrdinances[0] | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [editingOrdinance, setEditingOrdinance] = useState<typeof mockOrdinances[0] | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [formData, setFormData] = useState({
    number: "",
    year: "2026",
    title: "",
    fullTitle: "",
    whereas: "",
    sections: "",
  })

  const requestDeleteOrdinance = (id: string) => {
    setConfirmDeleteId(id)
    setIsConfirmOpen(true)
  }

  const confirmDeleteOrdinance = async () => {
    if (!confirmDeleteId) return
    try {
      await deleteOrdinance(confirmDeleteId)
      setOrdinances((s) => s.filter((o) => o.id !== confirmDeleteId))
      setConfirmDeleteId(null)
      setIsConfirmOpen(false)
    } catch (error) {
      console.error('Failed to delete ordinance:', error)
      alert('Failed to delete ordinance')
    }
  }

  const handlePublish = async (ordinanceId: string) => {
    try {
      await publishOrdinance(ordinanceId)
      setOrdinances((s) => s.map((o) => 
        o.id === ordinanceId ? { ...o, status: "Published" } : o
      ))
    } catch (error) {
      console.error('Failed to publish ordinance:', error)
      alert('Failed to publish ordinance')
    }
  }

  const handleDraft = async (ordinanceId: string) => {
    try {
      await draftOrdinance(ordinanceId)
      setOrdinances((s) => s.map((o) => 
        o.id === ordinanceId ? { ...o, status: "Draft" } : o
      ))
    } catch (error) {
      console.error('Failed to draft ordinance:', error)
      alert('Failed to draft ordinance')
    }
  }

  const handleCreateOrdinance = () => {
    const newId = `ORD-2026-${String(ordinances.length + 1).padStart(3, "0")}`
    const whereasArray = formData.whereas.split('\n').filter(w => w.trim())
    const sectionsArray = formData.sections.split('\n\n').filter(s => s.trim()).map((section, i) => ({
      title: `SECTION ${i + 1}`,
      content: section.trim()
    }))

    const newOrdinance = {
      id: newId,
      number: formData.number,
      year: formData.year,
      title: formData.title,
      fullTitle: formData.fullTitle || formData.title,
      status: "Draft" as const,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      author: "Rolando C. Borja",
      whereas: whereasArray,
      sections: sectionsArray
    }
    
    setOrdinances([newOrdinance, ...ordinances])
    setShowCreateDialog(false)
    setFormData({ number: "", year: "2026", title: "", fullTitle: "", whereas: "", sections: "" })
  }

  const handleEditOrdinance = (ordinance: typeof mockOrdinances[0]) => {
    setEditingOrdinance(ordinance)
    setFormData({
      number: ordinance.number,
      year: ordinance.year,
      title: ordinance.title,
      fullTitle: ordinance.fullTitle,
      whereas: ordinance.whereas.join('\n'),
      sections: ordinance.sections.map(s => s.content).join('\n\n')
    })
    setShowEditDialog(true)
  }

  const handleUpdateOrdinance = async () => {
    if (!editingOrdinance) return
    
    const whereasArray = formData.whereas.split('\n').filter(w => w.trim())
    const sectionsArray = formData.sections.split('\n\n').filter(s => s.trim()).map((section, i) => ({
      title: `SECTION ${i + 1}`,
      content: section.trim()
    }))

    const updated = {
      ...editingOrdinance,
      number: formData.number,
      year: formData.year,
      title: formData.title,
      fullTitle: formData.fullTitle || formData.title,
      whereas: whereasArray,
      sections: sectionsArray
    }

    try {
      await updateOrdinance(updated.id, updated)
      setOrdinances(ordinances.map(o => o.id === editingOrdinance.id ? updated : o))
      setShowEditDialog(false)
      setEditingOrdinance(null)
      setFormData({ number: "", year: "2026", title: "", fullTitle: "", whereas: "", sections: "" })
    } catch (error) {
      console.error('Failed to update ordinance:', error)
      alert('Failed to update ordinance')
    }
  }

  const publishedCount = ordinances.filter(o => o.status === "Published").length
  const draftCount = ordinances.filter(o => o.status === "Draft").length

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 md:space-y-6"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Ordinances & Resolutions</h1>
          <p className="text-xs md:text-sm text-muted-foreground">Create and manage barangay ordinances</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button size="sm" className="w-fit h-8 text-xs bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-3 w-3 md:mr-2" />
              <span className="hidden md:inline">Create Ordinance</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl mx-4 md:mx-auto max-h-[90vh] bg-white">
            <DialogHeader>
              <DialogTitle className="text-base md:text-lg">Create New Ordinance</DialogTitle>
              <DialogDescription className="text-xs md:text-sm">Fill in the ordinance template</DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[50vh]">
              <div className="space-y-3 pr-4">
                <div className="grid gap-3 grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-xs md:text-sm">Ordinance Number</Label>
                    <Input 
                      placeholder="e.g., 003" 
                      className="h-8 md:h-10 text-sm"
                      value={formData.number}
                      onChange={(e) => setFormData({...formData, number: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs md:text-sm">Series Year</Label>
                    <Input 
                      placeholder="e.g., 2026" 
                      value={formData.year}
                      className="h-8 md:h-10 text-sm"
                      onChange={(e) => setFormData({...formData, year: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs md:text-sm">Title</Label>
                  <Input 
                    placeholder="AN ORDINANCE..." 
                    className="h-8 md:h-10 text-sm"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs md:text-sm">Full Title (Optional)</Label>
                  <Input 
                    placeholder="Full title if different..." 
                    className="h-8 md:h-10 text-sm"
                    value={formData.fullTitle}
                    onChange={(e) => setFormData({...formData, fullTitle: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs md:text-sm">Whereas Clauses</Label>
                  <Textarea 
                    placeholder="Enter each whereas clause on a new line..." 
                    className="text-sm min-h-[60px]"
                    value={formData.whereas}
                    onChange={(e) => setFormData({...formData, whereas: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs md:text-sm">Sections Content</Label>
                  <Textarea 
                    placeholder="Enter ordinance sections (separate with blank lines)..." 
                    className="text-sm min-h-[80px]"
                    value={formData.sections}
                    onChange={(e) => setFormData({...formData, sections: e.target.value})}
                  />
                </div>
              </div>
            </ScrollArea>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" size="sm" onClick={() => {
                setShowCreateDialog(false)
                setFormData({ number: "", year: "2026", title: "", fullTitle: "", whereas: "", sections: "" })
              }}>Cancel</Button>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={handleCreateOrdinance}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-2 md:gap-4">
        <Card>
          <CardContent className="p-2 md:p-4">
            <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4">
              <div className="rounded-lg bg-emerald-100 p-1.5 md:p-2">
                <Scroll className="h-4 w-4 md:h-5 md:w-5 text-emerald-700" />
              </div>
              <div className="text-center md:text-left">
                <p className="text-lg md:text-2xl font-bold">{publishedCount}</p>
                <p className="text-[10px] md:text-sm text-muted-foreground">Published</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2 md:p-4">
            <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4">
              <div className="rounded-lg bg-amber-100 p-1.5 md:p-2">
                <Edit className="h-4 w-4 md:h-5 md:w-5 text-amber-700" />
              </div>
              <div className="text-center md:text-left">
                <p className="text-lg md:text-2xl font-bold">{draftCount}</p>
                <p className="text-[10px] md:text-sm text-muted-foreground">Drafts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2 md:p-4">
            <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4">
              <div className="rounded-lg bg-primary/10 p-1.5 md:p-2">
                <Scroll className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              </div>
              <div className="text-center md:text-left">
                <p className="text-lg md:text-2xl font-bold">{mockOrdinances.length}</p>
                <p className="text-[10px] md:text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search */}
      <motion.div variants={itemVariants} className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Search ordinances..." 
          className="pl-10 h-9 md:h-10 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </motion.div>

      {/* Ordinances List */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="all">
          <TabsList className="h-8 md:h-9 w-full justify-start overflow-x-auto">
            <TabsTrigger value="all" className="text-xs md:text-sm px-2 md:px-3">All ({mockOrdinances.length})</TabsTrigger>
            <TabsTrigger value="published" className="text-xs md:text-sm px-2 md:px-3">Published ({publishedCount})</TabsTrigger>
            <TabsTrigger value="drafts" className="text-xs md:text-sm px-2 md:px-3">Drafts ({draftCount})</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-3 md:mt-4">
            <div className="space-y-3 md:space-y-4">
              {ordinances.map((ordinance) => (
                <Card key={ordinance.id} className="transition-shadow hover:shadow-lg">
                  <CardHeader className="p-3 md:p-6 pb-2 md:pb-4">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="secondary" className="text-[10px] md:text-xs">
                        No. {ordinance.number} Series of {ordinance.year}
                      </Badge>
                      <Badge className={`text-[10px] md:text-xs ${ordinance.status === "Published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                        {ordinance.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-sm md:text-lg leading-tight">{ordinance.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1 text-xs">
                      <Calendar className="h-3 w-3" />
                      {ordinance.date}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 md:p-6 pt-0 md:pt-0">
                    <div className="flex gap-1 md:gap-2">
                      <Button variant="outline" size="sm" className="h-7 md:h-8 px-2 md:px-3 text-xs" onClick={() => setSelectedOrdinance(ordinance)}>
                        <Eye className="h-3 w-3 md:mr-1" />
                        <span className="hidden md:inline">View</span>
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 md:h-8 px-2 md:px-3 text-xs" onClick={() => handleEditOrdinance(ordinance)}>
                        <Edit className="h-3 w-3 md:mr-1" />
                        <span className="hidden md:inline">Edit</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="published" className="mt-3 md:mt-4">
            <div className="space-y-3 md:space-y-4">
              {ordinances.filter(o => o.status === "Published").map((ordinance) => (
                <Card key={ordinance.id}>
                  <CardHeader className="p-3 md:p-6 pb-2 md:pb-4">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="secondary" className="text-[10px] md:text-xs">No. {ordinance.number} Series of {ordinance.year}</Badge>
                      <Badge className="bg-emerald-100 text-emerald-700 text-[10px] md:text-xs">Published</Badge>
                    </div>
                    <CardTitle className="text-sm md:text-lg leading-tight">{ordinance.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 md:p-6 pt-0">
                    <div className="flex gap-1 md:gap-2">
                      <Button variant="outline" size="sm" className="h-7 md:h-8 px-2 text-xs" onClick={() => setSelectedOrdinance(ordinance)}>
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="drafts" className="mt-3 md:mt-4">
            <div className="space-y-3 md:space-y-4">
              {ordinances.filter(o => o.status === "Draft").map((ordinance) => (
                <Card key={ordinance.id}>
                  <CardHeader className="p-3 md:p-6 pb-2 md:pb-4">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="secondary" className="text-[10px] md:text-xs">No. {ordinance.number} Series of {ordinance.year}</Badge>
                      <Badge className="bg-amber-100 text-amber-700 text-[10px] md:text-xs">Draft</Badge>
                    </div>
                    <CardTitle className="text-sm md:text-lg leading-tight">{ordinance.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 md:p-6 pt-0">
                    <div className="flex gap-1 md:gap-2">
                      <Button variant="outline" size="sm" className="h-7 md:h-8 px-2 text-xs" onClick={() => handleEditOrdinance(ordinance)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" className="h-7 md:h-8 px-2 text-xs bg-emerald-600 hover:bg-emerald-700" onClick={() => handlePublish(ordinance.id)}>Publish</Button>
                      <Button variant="outline" size="sm" className="h-7 md:h-8 px-2 text-xs text-destructive" onClick={() => requestDeleteOrdinance(ordinance.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* View Details Modal */}
      <Dialog open={!!selectedOrdinance} onOpenChange={() => setSelectedOrdinance(null)}>
        <DialogContent className="max-w-lg mx-4 md:mx-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-base md:text-lg">Ordinance Details</DialogTitle>
          </DialogHeader>
          {selectedOrdinance && (
            <ScrollArea className="max-h-[50vh]">
              <div className="space-y-3 pr-4">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="secondary" className="text-[10px] md:text-xs">Ordinance No. {selectedOrdinance.number} Series of {selectedOrdinance.year}</Badge>
                  <Badge className={`text-[10px] md:text-xs ${selectedOrdinance.status === "Published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {selectedOrdinance.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-[10px] md:text-sm text-muted-foreground">Full Title</p>
                  <p className="font-medium text-sm">{selectedOrdinance.fullTitle}</p>
                </div>
                <div>
                  <p className="text-[10px] md:text-sm text-muted-foreground">Author</p>
                  <p className="font-medium text-sm">{selectedOrdinance.author}</p>
                </div>
                <div className="border-t pt-3">
                  <p className="font-semibold text-sm mb-2">Whereas Clauses</p>
                  {selectedOrdinance.whereas.map((clause, i) => (
                    <p key={i} className="text-xs mb-1">{clause}</p>
                  ))}
                </div>
                <div className="border-t pt-3">
                  <p className="font-semibold text-sm mb-2">Sections</p>
                  {selectedOrdinance.sections.map((section, i) => (
                    <div key={i} className="mb-2">
                      <p className="text-xs font-medium">Section {i + 1}: {section.title}</p>
                      <p className="text-xs text-muted-foreground whitespace-pre-line">{section.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setSelectedOrdinance(null)}>Close</Button>
            <Button variant="outline" size="sm" onClick={() => {
              setSelectedOrdinance(null)
              setTimeout(() => handleEditOrdinance(selectedOrdinance!), 100)
            }}>Edit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl mx-4 md:mx-auto max-h-[90vh] bg-white">
          <DialogHeader>
            <DialogTitle className="text-base md:text-lg">Edit Ordinance</DialogTitle>
            <DialogDescription className="text-xs md:text-sm">Update the ordinance details</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[50vh]">
            <div className="space-y-3 pr-4">
              <div className="grid gap-3 grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs md:text-sm">Ordinance Number</Label>
                  <Input 
                    placeholder="e.g., 003" 
                    className="h-8 md:h-10 text-sm"
                    value={formData.number}
                    onChange={(e) => setFormData({...formData, number: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs md:text-sm">Series Year</Label>
                  <Input 
                    placeholder="e.g., 2026" 
                    value={formData.year}
                    className="h-8 md:h-10 text-sm"
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs md:text-sm">Title</Label>
                <Input 
                  placeholder="AN ORDINANCE..." 
                  className="h-8 md:h-10 text-sm"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs md:text-sm">Full Title</Label>
                <Input 
                  placeholder="Full title..." 
                  className="h-8 md:h-10 text-sm"
                  value={formData.fullTitle}
                  onChange={(e) => setFormData({...formData, fullTitle: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs md:text-sm">Whereas Clauses</Label>
                <Textarea 
                  placeholder="Enter each whereas clause on a new line..." 
                  className="text-sm min-h-[60px]"
                  value={formData.whereas}
                  onChange={(e) => setFormData({...formData, whereas: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs md:text-sm">Sections Content</Label>
                <Textarea 
                  placeholder="Enter ordinance sections (separate with blank lines)..." 
                  className="text-sm min-h-[80px]"
                  value={formData.sections}
                  onChange={(e) => setFormData({...formData, sections: e.target.value})}
                />
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => {
              setShowEditDialog(false)
              setEditingOrdinance(null)
              setFormData({ number: "", year: "2026", title: "", fullTitle: "", whereas: "", sections: "" })
            }}>Cancel</Button>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={handleUpdateOrdinance}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>This action will permanently delete the ordinance. Are you sure?</DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <p className="text-sm">{confirmDeleteId ? `Delete ordinance ${confirmDeleteId}? This cannot be undone.` : "Delete selected ordinance?"}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" size="sm" onClick={confirmDeleteOrdinance}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
