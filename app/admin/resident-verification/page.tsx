"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, UserCheck, XCircle, Search } from "lucide-react"

type ResidentStatus = "Pending" | "Verified" | "Declined"

export default function AdminResidentVerificationPage() {
  const [query, setQuery] = useState("")
  const [residents, setResidents] = useState<any[]>([])
  const [selectedResident, setSelectedResident] = useState<any | null>(null)

  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const response = await fetch('/api/residents?status=pending')
        const data = await response.json()
        const mapped = (data || []).map((resident: any) => ({
          ...resident,
          name: `${resident.first_name || ''} ${resident.last_name || ''}`.trim(),
          status: resident.verification_status || 'pending',
        }))
        setResidents(mapped)
        setSelectedResident(mapped[0] ?? null)
      } catch (error) {
        console.error('Failed to load pending residents:', error)
      }
    }

    fetchResidents()
  }, [])

  const filteredResidents = useMemo(
    () =>
      residents.filter((resident) => {
        const fullName = `${resident.first_name} ${resident.last_name}`.toLowerCase()
        return (
          fullName.includes(query.toLowerCase()) ||
          resident.email.toLowerCase().includes(query.toLowerCase()) ||
          resident.purok.toLowerCase().includes(query.toLowerCase())
        )
      }),
    [query, residents]
  )

  const updateStatus = async (id: string, status: ResidentStatus) => {
    try {
      const response = await fetch('/api/residents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, verificationStatus: status.toLowerCase() }),
      })
      const result = await response.json()
      if (result.error) {
        console.error('Failed to update resident:', result.error)
        return
      }

      setResidents((current) =>
        current.map((resident) =>
          resident.id === id ? { ...resident, verification_status: status.toLowerCase(), status } : resident
        )
      )
      if (selectedResident?.id === id) {
        setSelectedResident((prev: any) => prev ? { ...prev, verification_status: status.toLowerCase(), status } : prev)
      }
    } catch (error) {
      console.error('Failed to update resident status:', error)
    }
  }

  const statusColors: Record<ResidentStatus, string> = {
    Pending: "bg-amber-100 text-amber-800",
    Verified: "bg-emerald-100 text-emerald-800",
    Declined: "bg-red-100 text-red-800",
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Resident Verification</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Verify resident accounts</h1>
          <p className="max-w-2xl text-sm text-slate-600 mt-2">
            Approve or decline registrations, review valid IDs, and update verification status.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => setQuery("")}>Clear search</Button>
        </div>
      </div>

      <Card className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <Search className="h-4 w-4 text-slate-500" />
              <Input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search residents"
                className="border-0 bg-transparent p-0 text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-2 text-sm text-slate-600">
              <span>{filteredResidents.length} residents</span>
              <span className="rounded-full bg-slate-100 px-3 py-1">Statuses: Pending, Verified, Declined</span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredResidents.map((resident) => (
              <div
                key={resident.id}
                className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm hover:border-slate-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-500">{resident.purok}</p>
                    <h2 className="text-lg font-semibold text-slate-900">{resident.name}</h2>
                    <p className="text-sm text-slate-600">{resident.email}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[resident.status as ResidentStatus]}`}>
                    {resident.status}
                  </span>
                </div>
                <div className="mt-4 flex flex-col gap-2 text-sm sm:flex-row sm:items-center">
                  <Button size="sm" variant="outline" className="w-full sm:w-auto" onClick={() => setSelectedResident(resident)}>
                    View profile
                  </Button>
                  <Button size="sm" variant="ghost" className="w-full sm:w-auto" onClick={() => updateStatus(resident.id, "Verified")}>Approve</Button>
                  <Button size="sm" variant="destructive" className="w-full sm:w-auto" onClick={() => updateStatus(resident.id, "Declined")}>Decline</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>

        <CardContent className="space-y-4 bg-slate-50 p-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            {selectedResident ? (
              <>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Selected resident</p>
                    <h2 className="text-xl font-semibold text-slate-900">{selectedResident.name}</h2>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[selectedResident.status as ResidentStatus]}`}>
                    {selectedResident.status}
                  </span>
                </div>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <p><span className="font-semibold">Purok:</span> {selectedResident.purok}</p>
                  <p><span className="font-semibold">Email:</span> {selectedResident.email}</p>
                  <p><span className="font-semibold">Uploaded IDs:</span> {selectedResident.validId || 'N/A'}</p>
                </div>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Button variant="secondary" className="w-full sm:w-auto" onClick={() => updateStatus(selectedResident.id, "Verified")}>Approve</Button>
                  <Button variant="destructive" className="w-full sm:w-auto" onClick={() => updateStatus(selectedResident.id, "Declined")}>Decline</Button>
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-sm text-slate-600">
                No pending resident selected yet. Select a pending profile to review its details and verify the account.
              </div>
            )}
          </div>

          <Card className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <CardHeader>
              <CardTitle>Verification status guide</CardTitle>
              <CardDescription>Pending residents must be verified before they become active.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-2xl bg-amber-50 p-3 text-sm text-amber-800">Pending: Account is waiting for review.</div>
              <div className="rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-800">Verified: Resident account is active.</div>
              <div className="rounded-2xl bg-red-50 p-3 text-sm text-red-800">Declined: Account was denied.</div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}
