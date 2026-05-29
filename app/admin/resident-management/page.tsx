"use client"

import { useMemo, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, FileCheck, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
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
    </div>
  )
}
