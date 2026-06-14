"use client"

import { useMemo, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, FileCheck, Loader2, Eye, EyeOff } from "lucide-react"
import { createResident } from "@/lib/auth"
import { getErrorMessage } from "@/lib/utils"
import { toast } from "sonner"

interface Resident {
  id?: string
  first_name: string
  last_name: string
  purok: string
  verification_status: string
  household_id?: string
}

const normalizeResident = (resident: any): Resident => {
  const id = resident?.id || resident?.user_id || resident?.profile?.id || resident?.profile_id
  if (!id) {
    console.warn('Resident record missing id:', resident)
  }

  return {
    id,
    first_name: resident?.first_name || resident?.firstName || '',
    last_name: resident?.last_name || resident?.lastName || '',
    purok: resident?.purok || resident?.purok || 'Unknown',
    verification_status: resident?.verification_status || resident?.verificationStatus || 'pending',
    household_id: resident?.household_id || resident?.householdId,
  }
}

export default function AdminResidentManagementPage() {
  const [query, setQuery] = useState("")
  const [residents, setResidents] = useState<Resident[]>([])
  const [loading, setLoading] = useState(true)
  const [createForm, setCreateForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    purok: "",
    gender: "",
    occupation: "",
    dateOfBirth: "",
    civilStatus: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null)

  useEffect(() => {
    fetchResidents()
  }, [])

  async function fetchResidents() {
    try {
      const response = await fetch('/api/residents')
      const data = await response.json()

      if (!response.ok) {
        const errorMessage = data?.error || `${response.status} ${response.statusText}`
        throw new Error(errorMessage)
      }

      const validResidents = Array.isArray(data)
        ? data.map(normalizeResident).filter((resident) => !!resident.id)
        : []

      if (Array.isArray(data) && validResidents.length !== data.length) {
        console.warn('Some fetched residents were missing IDs and were excluded from the list')
      }

      setResidents(validResidents)
    } catch (error) {
      console.error('Error fetching residents:', error)
      toast.error(String(error instanceof Error ? error.message : 'Failed to load residents'))
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
    if (!createForm.firstName || !createForm.lastName || !createForm.email || !createForm.password || !createForm.confirmPassword) {
      toast.error('Please complete all required fields')
      return
    }

    if (!createForm.purok) {
      toast.error('Please select a purok')
      return
    }

    if (!createForm.gender) {
      toast.error('Please select a gender')
      return
    }

    if (!createForm.dateOfBirth || !createForm.civilStatus) {
      toast.error('Please enter date of birth and civil status')
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
      const firstName = createForm.firstName.trim()
      const lastName = createForm.lastName.trim()

      const result = await createResident({
        email: createForm.email,
        password: createForm.password,
        firstName,
        lastName,
        purok: createForm.purok,
        gender: createForm.gender,
        occupation: createForm.occupation,
        dateOfBirth: createForm.dateOfBirth,
        civilStatus: createForm.civilStatus,
      })

      if (result?.error) {
        toast.error(String(getErrorMessage(result.error, 'Failed to create resident account')))
        return
      }

      const profile = result?.data?.profile
      const newResident = profile
        ? {
            id: profile.id,
            first_name: profile.first_name,
            last_name: profile.last_name,
            purok: profile.purok,
            verification_status: profile.verification_status || 'pending',
          }
        : {
            id: `new-${Date.now()}`,
            first_name: firstName,
            last_name: lastName,
            purok: createForm.purok,
            verification_status: 'pending',
          }

      setResidents((current) => [newResident, ...current])
      setCreateForm({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        purok: '',
        gender: '',
        occupation: '',
        dateOfBirth: '',
        civilStatus: '',
      })
      toast.success('Resident account created successfully')
    } catch (error) {
      console.error('Create resident failed', error)
      toast.error('Failed to create resident account')
    } finally {
      setIsCreating(false)
    }
  }

  const updateResidentVerificationStatus = async (id: string | undefined, nextStatus: string) => {
    if (!id?.trim()) {
      toast.error('Resident ID is required')
      return
    }

    setUpdatingStatusId(id)

    try {
      const response = await fetch('/api/residents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, verificationStatus: nextStatus }),
      })

      const result = await response.json()
      if (!response.ok || result?.error) {
        throw new Error(result?.error || 'Failed to update resident status')
      }

      setResidents((current) =>
        current.map((resident) =>
          resident.id === id ? { ...resident, verification_status: nextStatus } : resident
        )
      )
      toast.success(`Resident marked as ${nextStatus}`)
    } catch (error) {
      console.error('Error updating resident status:', error)
      toast.error(String(getErrorMessage(error, 'Failed to update resident status')))
    } finally {
      setUpdatingStatusId(null)
    }
  }

  const deleteResident = async (id?: string) => {
    if (!id?.trim()) {
      toast.error('Resident ID is required')
      return
    }

    if (!confirm('Are you sure you want to delete this resident?')) return

    try {
      const encodedId = encodeURIComponent(id)
      const response = await fetch(`/api/admin/residents/${encodedId}`, {
        method: 'DELETE',
      })

      const result = await response.json()
      if (!response.ok || result?.error) {
        throw new Error(result?.error || 'Failed to delete resident')
      }

      setResidents((current) => current.filter((resident) => resident.id !== id))
      toast.success('Resident deleted successfully')
    } catch (error) {
      console.error('Error deleting resident:', error)
      toast.error(String(getErrorMessage(error, 'Failed to delete resident')))
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
            View residents, update verification status, delete entries and export data.
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
                    <div className="mt-4 space-y-2">
                      <div className="text-xs font-medium text-slate-500">Verification status</div>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Select
                          value={resident.verification_status || 'pending'}
                          onValueChange={(value) => updateResidentVerificationStatus(resident.id, value)}
                          disabled={!resident.id || updatingStatusId === resident.id}
                        >
                          <SelectTrigger className="h-9 w-full sm:w-[180px]">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="verified">Verified</SelectItem>
                            <SelectItem value="declined">Declined</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="w-full sm:w-auto"
                          onClick={() => deleteResident(resident.id)}
                          disabled={!resident.id}
                        >
                          Delete
                        </Button>
                      </div>
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
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="resident-first-name">First name</Label>
                  <Input
                    id="resident-first-name"
                    value={createForm.firstName}
                    onChange={(e) => updateCreateField('firstName', e.target.value)}
                    placeholder="First name"
                  />
                </div>
                <div>
                  <Label htmlFor="resident-last-name">Last name</Label>
                  <Input
                    id="resident-last-name"
                    value={createForm.lastName}
                    onChange={(e) => updateCreateField('lastName', e.target.value)}
                    placeholder="Last name"
                  />
                </div>
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
                <Select value={createForm.purok} onValueChange={(value) => updateCreateField('purok', value)}>
                  <SelectTrigger id="resident-purok">
                    <SelectValue placeholder="Select Purok" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Purok 1">Purok 1</SelectItem>
                    <SelectItem value="Purok 2">Purok 2</SelectItem>
                    <SelectItem value="Purok 3">Purok 3</SelectItem>
                    <SelectItem value="Purok 4">Purok 4</SelectItem>
                    <SelectItem value="Purok 5">Purok 5</SelectItem>
                    <SelectItem value="Purok 6">Purok 6</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="resident-gender">Gender</Label>
                <Select value={createForm.gender} onValueChange={(value) => updateCreateField('gender', value)}>
                  <SelectTrigger id="resident-gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="resident-date-of-birth">Date of birth</Label>
                <Input
                  id="resident-date-of-birth"
                  type="date"
                  value={createForm.dateOfBirth}
                  onChange={(e) => updateCreateField('dateOfBirth', e.target.value)}
                  placeholder="Date of birth"
                />
              </div>
              <div>
                <Label htmlFor="resident-civil-status">Civil status</Label>
                <Select value={createForm.civilStatus} onValueChange={(value) => updateCreateField('civilStatus', value)}>
                  <SelectTrigger id="resident-civil-status">
                    <SelectValue placeholder="Select civil status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                    <SelectItem value="separated">Separated</SelectItem>
                  </SelectContent>
                </Select>
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
