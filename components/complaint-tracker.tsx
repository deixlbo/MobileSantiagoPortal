"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle, Clock, FileText, Plus } from "lucide-react"

interface Complaint {
  id: string
  title: string
  description: string
  category: string
  status: "submitted" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high"
  dateSubmitted: string
  lastUpdated: string
  attachments: string[]
  updates: { date: string; message: string }[]
}

const mockComplaints: Complaint[] = [
  {
    id: "C001",
    title: "Broken Street Light",
    description: "Street light at Purok 3 has been broken for weeks",
    category: "Infrastructure",
    status: "in-progress",
    priority: "high",
    dateSubmitted: "2026-05-28",
    lastUpdated: "2026-06-04",
    attachments: ["photo1.jpg"],
    updates: [
      { date: "2026-05-28", message: "Complaint received and filed" },
      { date: "2026-06-02", message: "Maintenance team assigned" }
    ]
  },
  {
    id: "C002",
    title: "Road Pothole Hazard",
    description: "Large pothole on Main Street causing accidents",
    category: "Infrastructure",
    status: "resolved",
    priority: "high",
    dateSubmitted: "2026-05-15",
    lastUpdated: "2026-06-01",
    attachments: [],
    updates: [
      { date: "2026-05-15", message: "Complaint received" },
      { date: "2026-05-25", message: "Road repair initiated" },
      { date: "2026-06-01", message: "Repair completed" }
    ]
  }
]

export function ComplaintTracker() {
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [newComplaint, setNewComplaint] = useState({ title: "", description: "", category: "", priority: "medium" })

  const filteredComplaints = filterStatus === "all" 
    ? complaints 
    : complaints.filter(c => c.status === filterStatus)

  const handleSubmitComplaint = () => {
    if (newComplaint.title && newComplaint.description && newComplaint.category) {
      const complaint: Complaint = {
        id: `C${String(complaints.length + 1).padStart(3, "0")}`,
        title: newComplaint.title,
        description: newComplaint.description,
        category: newComplaint.category,
        status: "submitted",
        priority: newComplaint.priority as "low" | "medium" | "high",
        dateSubmitted: new Date().toISOString().split("T")[0],
        lastUpdated: new Date().toISOString().split("T")[0],
        attachments: [],
        updates: [{ date: new Date().toISOString().split("T")[0], message: "Complaint submitted" }]
      }
      setComplaints([complaint, ...complaints])
      setNewComplaint({ title: "", description: "", category: "", priority: "medium" })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "resolved":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "secondary"
      case "in-progress":
        return "default"
      case "resolved":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Complaint Tracking</h2>
          <p className="text-muted-foreground">Monitor and manage community complaints</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-lg">
              <Plus className="mr-2 h-4 w-4" /> New Complaint
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>File a Complaint</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Complaint Title"
                value={newComplaint.title}
                onChange={(e) => setNewComplaint({ ...newComplaint, title: e.target.value })}
              />
              <Textarea
                placeholder="Describe the issue in detail"
                value={newComplaint.description}
                onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
                rows={4}
              />
              <Select value={newComplaint.category} onValueChange={(value) => setNewComplaint({ ...newComplaint, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="Sanitation">Sanitation</SelectItem>
                  <SelectItem value="Safety">Safety</SelectItem>
                  <SelectItem value="Services">Services</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Select value={newComplaint.priority} onValueChange={(value) => setNewComplaint({ ...newComplaint, priority: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleSubmitComplaint} className="w-full">Submit Complaint</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2">
        {["all", "submitted", "in-progress", "resolved"].map((status) => (
          <Button
            key={status}
            variant={filterStatus === status ? "default" : "outline"}
            onClick={() => setFilterStatus(status)}
            className="rounded-lg capitalize"
          >
            {status}
          </Button>
        ))}
      </div>

      <div className="grid gap-4">
        {filteredComplaints.map((complaint, index) => (
          <motion.div
            key={complaint.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Dialog open={selectedComplaint?.id === complaint.id} onOpenChange={() => setSelectedComplaint(null)}>
              <DialogTrigger asChild>
                <Card 
                  className="cursor-pointer transition-all hover:shadow-lg rounded-2xl border border-slate-200/70"
                  onClick={() => setSelectedComplaint(complaint)}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {getStatusIcon(complaint.status)}
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-foreground">{complaint.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{complaint.description}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant={getStatusColor(complaint.status)} className="capitalize text-xs">
                              {complaint.status}
                            </Badge>
                            <Badge variant="outline" className="capitalize text-xs">
                              {complaint.priority}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">{complaint.category}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-xs text-muted-foreground shrink-0">
                        <p>{complaint.id}</p>
                        <p>{complaint.lastUpdated}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Complaint #{complaint.id}</DialogTitle>
                </DialogHeader>
                {selectedComplaint && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">{selectedComplaint.title}</h3>
                      <p className="text-muted-foreground">{selectedComplaint.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground">Status</p>
                        <Badge className="mt-1 capitalize">{selectedComplaint.status}</Badge>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground">Priority</p>
                        <Badge variant="outline" className="mt-1 capitalize">{selectedComplaint.priority}</Badge>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground">Category</p>
                        <Badge variant="secondary" className="mt-1">{selectedComplaint.category}</Badge>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground">Date Submitted</p>
                        <p className="text-sm mt-1">{selectedComplaint.dateSubmitted}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Updates</h4>
                      <div className="space-y-2">
                        {selectedComplaint.updates.map((update, idx) => (
                          <div key={idx} className="text-sm bg-muted rounded-lg p-3">
                            <p className="font-medium text-muted-foreground">{update.date}</p>
                            <p>{update.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
