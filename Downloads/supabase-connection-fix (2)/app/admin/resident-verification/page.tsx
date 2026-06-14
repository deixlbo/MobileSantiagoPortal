"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, UserCheck, XCircle, Search, FileImage, Download, Loader2 } from "lucide-react"
import { getResidentDocument } from "@/lib/auth"

type ResidentStatus = "Pending" | "Verified" | "Declined"

export default function AdminResidentVerificationPage() {
  const [query, setQuery] = useState("")
  const [residents, setResidents] = useState<any[]>([])
  const [selectedResident, setSelectedResident] = useState<any | null>(null)
  const [residentDocument, setResidentDocument] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingDocument, setLoadingDocument] = useState(false)

  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const response = await fetch('/api/residents?status=pending')
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        if (data && Array.isArray(data)) {
          const mapped = data.map((resident: any) => ({
            ...resident,
            name: `${resident.first_name || ''} ${resident.last_name || ''}`.trim(),
            status: resident.verification_status === 'pending' ? 'Pending' : resident.verification_status === 'verified' ? 'Verified' : 'Declined',
          }))
          setResidents(mapped)
          if (mapped.length > 0) {
            setSelectedResident(mapped[0])
            setLoadingDocument(true)
            const doc = await getResidentDocument(mapped[0].id)
            setResidentDocument(doc)
            setLoadingDocument(false)
          }
        }
      } catch (error) {
        console.error('Failed to load pending residents:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchResidents()
  }, [])

  const filteredResidents = useMemo(
    () =>
      residents.filter((resident) => {
        const search = query.toLowerCase().trim()
        if (!search) return true

        const fullName = `${resident.first_name || ''} ${resident.last_name || ''}`.toLowerCase()
        const email = `${resident.email || ''}`.toLowerCase()
        const purok = `${resident.purok || ''}`.toLowerCase()

        return fullName.includes(search) || email.includes(search) || purok.includes(search)
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
        throw new Error(result.error)
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

  const handleSelectResident = async (resident: any) => {
    setSelectedResident(resident)
    setLoadingDocument(true)
    setResidentDocument(null)
    try {
      const doc = await getResidentDocument(resident.id)
      setResidentDocument(doc)
    } catch (error) {
      console.error('Failed to load resident document:', error)
      setResidentDocument(null)
    } finally {
      setLoadingDocument(false)
    }
  }

  const statusColors: Record<ResidentStatus, string> = {
    Pending: "bg-amber-100 text-amber-800",
    Verified: "bg-emerald-100 text-emerald-800",
    Declined: "bg-red-100 text-red-800",
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
      </div>
    )
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

          {filteredResidents.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
              No pending residents match your search.
            </div>
          ) : (
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
                    <Button size="sm" variant="outline" className="w-full sm:w-auto" onClick={() => handleSelectResident(resident)}>
                      View profile
                    </Button>
                    <Button size="sm" variant="ghost" className="w-full sm:w-auto" onClick={() => updateStatus(resident.id, "Verified")}>Approve</Button>
                    <Button size="sm" variant="destructive" className="w-full sm:w-auto" onClick={() => updateStatus(resident.id, "Declined")}>Decline</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
                  <p><span className="font-semibold">Contact:</span> {selectedResident.contact_number || 'N/A'}</p>
                  <p><span className="font-semibold">ID Type:</span> {selectedResident.id_type?.replace('_', ' ').toUpperCase() || 'N/A'}</p>
                  <p><span className="font-semibold">Address:</span> {selectedResident.address || 'N/A'}</p>
                  <p><span className="font-semibold">Occupation:</span> {selectedResident.occupation || 'N/A'}</p>
                </div>

                {/* Display Uploaded ID Document */}
                {loadingDocument ? (
                  <div className="mt-4 flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading document...
                  </div>
                ) : residentDocument ? (
                  <div className="mt-4 space-y-3">
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-3">
                      <p className="mb-3 flex items-center gap-2 text-xs font-semibold text-emerald-900">
                        <FileImage className="h-4 w-4" />
                        Uploaded ID Document
                      </p>

                      {residentDocument.data?.startsWith('data:image') ? (
                        <img
                          src={residentDocument.data}
                          alt="Uploaded ID"
                          className="max-h-48 w-full rounded-xl border border-slate-200 object-cover"
                        />
                      ) : (
                        <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-600">
                          Preview not available. You can still download the file.
                        </div>
                      )}

                      <div className="mt-2 space-y-2 text-xs text-slate-600">
                        <p><span className="font-semibold">File:</span> {residentDocument.fileName}</p>
                        <p><span className="font-semibold">Uploaded:</span> {residentDocument.uploadedAt ? new Date(residentDocument.uploadedAt).toLocaleDateString() : 'N/A'}</p>
                      </div>

                      <a
                        href={residentDocument.data}
                        download={residentDocument.fileName}
                        className="mt-2 inline-flex items-center gap-2 text-xs font-medium text-emerald-700 hover:text-emerald-800"
                      >
                        <Download className="h-3 w-3" />
                        Download
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/50 p-3">
                    <p className="flex items-center gap-2 text-xs font-semibold text-amber-900">
                      <FileImage className="h-4 w-4" />
                      No ID document uploaded
                    </p>
                  </div>
                )}
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
