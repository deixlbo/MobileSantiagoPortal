"use client"

import { useMemo, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, FileCheck, Loader2, Eye, EyeOff } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { createResident } from "@/lib/auth"
import { toast } from "sonner"

interface Resident {
  id: string
  first_name: string
  last_name: string
  purok: string
  verification_status: string
  household_id?: string
}

export default function AdminResidentManagementPage() {
  const [query, setQuery] = useState("")
  const [residents, setResidents] = useState<Resident[]>([])
  const [loading, setLoading] = useState(true)
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    purok: "",
    gender: "",
    occupation: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    fetchResidents()
  }, [])

  async function fetchResidents() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'resident')
        .order('created_at', { ascending: false })

      if (error) throw error
      setResidents(data || [])
    } catch (error) {
      console.error('Error fetching residents:', error)
      toast.error('Failed to load residents')
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(
    () =>
      residents.filter((resident) => {
        const fullName = `${resident.first_name} ${resident.last_name}`.toLowerCase()
        const searchTerm = query.toLowerCase()
        return (
          fullName.includes(searchTerm) ||
          (resident.purok?.toLowerCase().includes(searchTerm))
        )
      }),
    [query, residents]
  )

  const updateCreateField = (field: string, value: string) => {
    setCreateForm((current) => ({ ...current, [field]: value }))
  }

  const handleCreateResidentAccount = async () => {
    if (!createForm.name || !createForm.email || !createForm.password || !createForm.confirmPassword) {
      toast.error('Please complete all required fields')
      return
    }

    if (createForm.password !== createForm.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (createForm.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setIsCreating(true)

    try {
      const [firstName, ...lastNameParts] = createForm.name.trim().split(' ')
      const lastName = lastNameParts.join(' ') || firstName

      const result = await createResident({
        email: createForm.email,
        password: createForm.password,
        firstName,
        lastName,
        purok: createForm.purok,
        gender: createForm.gender,
        occupation: createForm.occupation,
      })

      if (result?.error) {
        toast.error(result.error)
        return
      }

      const newResident = result.profile
        ? {
            id: result.profile.id,
            first_name: result.profile.first_name,
            last_name: result.profile.last_name,
            purok: result.profile.purok,
            verification_status: result.profile.verification_status || 'pending',
          }
        : {
            id: `new-${Date.now()}`,
            first_name: firstName,
            last_name: lastName,
            purok: createForm.purok,
            verification_status: 'pending',
          }

      setResidents((current) => [newResident, ...current])
      setCreateForm({ name: '', email: '', password: '', confirmPassword: '', purok: '', gender: '', occupation: '' })
      toast.success('Resident account created successfully')
    } catch (error) {
      console.error('Create resident failed', error)
      toast.error('Failed to create resident account')
    } finally {
      setIsCreating(false)
    }
  }

  const deleteResident = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resident?')) return

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id)

      if (error) throw error

      setResidents((current) => current.filter((resident) => resident.id !== id))
      toast.success('Resident deleted successfully')
    } catch (error) {
      console.error('Error deleting resident:', error)
      toast.error('Failed to delete resident')
    }
  }

  const exportCSV = () => {
    const headers = ['Name', 'Purok', 'Status']
    const csvData = filtered.map(r => [
      `${r.first_name} ${r.last_name}`,
      r.purok || 'N/A',
      r.verification_status || 'pending'
    ])

    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `residents-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('CSV exported successfully')
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'verified':
        return 'default'
      case 'pending':
        return 'secondary'
      case 'declined':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Resident Management</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Manage resident database</h1>
          <p className="max-w-2xl text-sm text-slate-600 mt-2">
            View residents, edit info, delete entries and export data.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <FileCheck className="h-4 w-4 text-slate-500" /> {residents.length} total residents
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <Card className="space-y-4">
          <CardHeader>
            <CardTitle>Resident list</CardTitle>
            <CardDescription>Search, filter, and update resident records.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <Search className="h-4 w-4 text-slate-500" />
                <Input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search residents or purok"
                  className="border-0 bg-transparent p-0 text-sm"
                />
              </div>
              <Button variant="secondary" onClick={exportCSV}>Export CSV</Button>
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                {query ? 'No residents found matching your search' : 'No residents registered yet'}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((resident) => (
                  <div key={resident.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold text-slate-900">
                          {resident.first_name} {resident.last_name}
                        </p>
                        <p className="text-sm text-slate-500">{resident.purok || 'No purok assigned'}</p>
                      </div>
                      <Badge variant={getStatusVariant(resident.verification_status || 'pending')}>
                        {resident.verification_status || 'Pending'}
                      </Badge>
                    </div>
                    <div className="mt-4 flex flex-col gap-2 text-sm sm:flex-row sm:items-center">
                      <Button size="sm" variant="outline" className="w-full sm:w-auto">View details</Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        className="w-full sm:w-auto" 
                        onClick={() => deleteResident(resident.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="space-y-4">
          <CardHeader>
            <CardTitle>Create resident account</CardTitle>
            <CardDescription>Register a resident so they can log in with email and password.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="resident-name">Full name</Label>
                <Input
                  id="resident-name"
                  value={createForm.name}
                  onChange={(e) => updateCreateField('name', e.target.value)}
                  placeholder="First and last name"
                />
              </div>
              <div>
                <Label htmlFor="resident-email">Email</Label>
                <Input
                  id="resident-email"
                  type="email"
                  value={createForm.email}
                  onChange={(e) => updateCreateField('email', e.target.value)}
                  placeholder="resident@example.com"
                />
              </div>
              <div>
                <Label htmlFor="resident-password">Password</Label>
                <div className="relative">
                  <Input
                    id="resident-password"
                    type={showPassword ? 'text' : 'password'}
                    value={createForm.password}
                    onChange={(e) => updateCreateField('password', e.target.value)}
                    placeholder="Create password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((open) => !open)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <Label htmlFor="resident-confirm-password">Confirm password</Label>
                <div className="relative">
                  <Input
                    id="resident-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={createForm.confirmPassword}
                    onChange={(e) => updateCreateField('confirmPassword', e.target.value)}
                    placeholder="Confirm password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((open) => !open)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <Label htmlFor="resident-purok">Purok</Label>
                <Input
                  id="resident-purok"
                  value={createForm.purok}
                  onChange={(e) => updateCreateField('purok', e.target.value)}
                  placeholder="Purok 1"
                />
              </div>
              <div>
                <Label htmlFor="resident-gender">Gender</Label>
                <Input
                  id="resident-gender"
                  value={createForm.gender}
                  onChange={(e) => updateCreateField('gender', e.target.value)}
                  placeholder="male / female / other"
                />
              </div>
              <div>
                <Label htmlFor="resident-occupation">Occupation</Label>
                <Input
                  id="resident-occupation"
                  value={createForm.occupation}
                  onChange={(e) => updateCreateField('occupation', e.target.value)}
                  placeholder="Occupation (optional)"
                />
              </div>
            </div>
          </CardContent>
          <CardContent className="p-4 pt-0">
            <Button className="w-full" onClick={handleCreateResidentAccount} disabled={isCreating}>
              {isCreating ? 'Creating resident...' : 'Create resident account'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
