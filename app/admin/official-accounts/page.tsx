"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, ShieldCheck, Repeat, Eye, EyeOff } from "lucide-react"
import { createOfficial } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { getErrorMessage } from "@/lib/utils"
import { toast } from "sonner"

const roles = ["Captain", "Secretary", "Kagawad", "Staff"]

export default function AdminOfficialAccountsPage() {
  const [officials, setOfficials] = useState<any[]>([])
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [role, setRole] = useState(roles[0])

  const fetchOfficials = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, position, role, verification_status')
        .eq('role', 'official')

      if (error) throw error

      setOfficials(
        (data || []).map((profile: any) => ({
          id: profile.id,
          name: `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim() || 'Official',
          email: profile.email,
          role: profile.position || 'Official',
          status: profile.verification_status === 'active' ? 'Active' : 'Active',
        }))
      )
    } catch (error) {
      console.error('Failed to load official users:', error)
    }
  }

  useEffect(() => {
    fetchOfficials()
  }, [])

  const addOfficial = async () => {
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    setIsCreating(true)

    try {
      const [firstName, ...lastNameParts] = name.trim().split(" ")
      const lastName = lastNameParts.join(" ") || firstName

      const result = await createOfficial({
        email,
        password,
        firstName,
        lastName,
        position: role,
      })

      if (result?.error) {
        toast.error(String(getErrorMessage(result.error, 'Failed to create official account')))
        return
      }

      await fetchOfficials()
      setName("")
      setEmail("")
      setPassword("")
      setConfirmPassword("")
      setRole(roles[0])
      toast.success("Official account created successfully")
    } catch (error) {
      toast.error("Failed to create official account")
    } finally {
      setIsCreating(false)
    }
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
                <Label htmlFor="official-password">Password</Label>
                <div className="relative">
                  <Input
                    id="official-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                    onClick={() => setShowPassword((current) => !current)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <Label htmlFor="official-confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="official-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                    onClick={() => setShowConfirmPassword((current) => !current)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
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
            <Button className="w-full" onClick={addOfficial} disabled={isCreating}>
              <Plus className="mr-2 h-4 w-4" /> {isCreating ? 'Creating...' : 'Create official account'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
