"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, ShieldCheck, Repeat, UserPlus } from "lucide-react"

const initialOfficials = [
  { id: "o-1", name: "Rolando Borja", email: "admin@barangaysantiago.gov.ph", role: "Captain", status: "Active" },
  { id: "o-2", name: "Elena Reyes", email: "secretary@barangaysantiago.gov.ph", role: "Secretary", status: "Active" },
  { id: "o-3", name: "Jun Mendoza", email: "kagawad@barangaysantiago.gov.ph", role: "Kagawad", status: "Deactivated" },
]

const roles = ["Captain", "Secretary", "Kagawad", "Staff"]

export default function AdminOfficialAccountsPage() {
  const [officials, setOfficials] = useState(initialOfficials)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState(roles[0])

  const addOfficial = () => {
    if (!name || !email) return
    setOfficials((current) => [
      ...current,
      { id: `o-${Date.now()}`, name, email, role, status: "Active" },
    ])
    setName("")
    setEmail("")
    setRole(roles[0])
  }

  const toggleStatus = (id: string) => {
    setOfficials((current) =>
      current.map((official) =>
        official.id === id
          ? { ...official, status: official.status === "Active" ? "Deactivated" : "Active" }
          : official
      )
    )
  }

  const resetPassword = (id: string) => {
    setOfficials((current) =>
      current.map((official) =>
        official.id === id ? { ...official, passwordReset: true } : official
      )
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Official Account Creation</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Create and manage officials</h1>
          <p className="max-w-2xl text-sm text-slate-600 mt-2">
            Add official accounts, assign roles, reset passwords, and activate or deactivate accounts.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          Super admin only
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-4">
          <CardHeader>
            <CardTitle>Official accounts</CardTitle>
            <CardDescription>Current barangay official users and account actions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              {officials.map((official) => (
                <div key={official.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-slate-900">{official.name}</p>
                      <p className="text-sm text-slate-600">{official.email}</p>
                      <p className="text-sm text-slate-500">Role: {official.role}</p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <Badge variant={official.status === "Active" ? "default" : "outline"}>{official.status}</Badge>
                      <Button size="sm" variant="secondary" className="w-full sm:w-auto" onClick={() => resetPassword(official.id)}>
                        <Repeat className="h-4 w-4" /> Reset password
                      </Button>
                      <Button size="sm" variant="ghost" className="w-full sm:w-auto" onClick={() => toggleStatus(official.id)}>
                        {official.status === "Active" ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="space-y-4">
          <CardHeader>
            <CardTitle>Create official account</CardTitle>
            <CardDescription>Assign role and add a new official user.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="official-name">Name</Label>
                <Input id="official-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
              </div>
              <div>
                <Label htmlFor="official-email">Email</Label>
                <Input id="official-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" />
              </div>
              <div>
                <Label htmlFor="official-role">Role</Label>
                <select
                  id="official-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {roles.map((currentRole) => (
                    <option key={currentRole} value={currentRole}>{currentRole}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
          <div className="p-4">
            <Button className="w-full" onClick={addOfficial}>
              <Plus className="mr-2 h-4 w-4" /> Create official account
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
