"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, ClipboardList, FileText, ShieldCheck, Users } from "lucide-react"

const officialRoles = [
  {
    title: "Document Verifier",
    description: "Reviews and approves resident document requests.",
    icon: FileText,
  },
  {
    title: "Complaint Reviewer",
    description: "Handles blotter reports and case follow-ups.",
    icon: ShieldCheck,
  },
  {
    title: "Resident Support Officer",
    description: "Assists residents with account and service requests.",
    icon: Users,
  },
]

const officialToDo = [
  "Verify pending document requests",
  "Review new complaints and blotters",
  "Update resident records and verification status",
  "Follow up on official tasks and requests",
]

export default function OfficialDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-bold text-slate-900 sm:text-3xl">Official Dashboard</h1>
          <p className="text-sm text-slate-600 sm:text-base">Barangay Santiago Official Portal</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Briefcase className="h-5 w-5 text-blue-600" />
                Official Roles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {officialRoles.map((role) => {
                const Icon = role.icon
                return (
                  <div key={role.title} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                        <Icon className="h-4 w-4" />
                      </div>
                      <h3 className="font-semibold text-slate-900">{role.title}</h3>
                    </div>
                    <p className="text-sm text-slate-600">{role.description}</p>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ClipboardList className="h-5 w-5 text-emerald-600" />
                To Do
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {officialToDo.map((task) => (
                  <div key={task} className="flex items-start gap-3 rounded-lg border border-slate-200 p-3">
                    <Badge variant="secondary" className="mt-0.5 bg-emerald-100 text-emerald-700">
                      •
                    </Badge>
                    <p className="text-sm text-slate-700">{task}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
