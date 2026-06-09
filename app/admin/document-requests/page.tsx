"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Timer, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { generateDocumentHTML, generateControlNumber } from '@/lib/document-generator'
import { toast } from "sonner"

interface DocumentRequest {
  id: string
  resident_id: string
  document_type: string
  status: string
  created_at: string
  purpose: string
  control_number: string
  isMock?: boolean
  profiles?: {
    first_name: string
    last_name: string
    address?: string
    date_of_birth?: string
  }
}

const sampleAdminRequests: DocumentRequest[] = [
  {
    id: 'DEMO-ADMIN-001',
    resident_id: 'demo-resident-1',
    document_type: 'barangay_clearance',
    status: 'pending',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    purpose: 'Employment clearance',
    control_number: 'CTRL-2026-001',
    isMock: true,
    profiles: {
      first_name: 'Maria',
      last_name: 'Santos',
    },
  },
  {
    id: 'DEMO-ADMIN-002',
    resident_id: 'demo-resident-2',
    document_type: 'certificate_of_residency',
    status: 'approved',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    purpose: 'School enrollment',
    control_number: 'CTRL-2026-002',
    isMock: true,
    profiles: {
      first_name: 'Jose',
      last_name: 'Ramos',
    },
  },
  {
    id: 'DEMO-ADMIN-003',
    resident_id: 'demo-resident-3',
    document_type: 'certificate_of_indigency',
    status: 'ready_to_print',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(),
    purpose: 'Medical assistance',
    control_number: 'CTRL-2026-003',
    isMock: true,
    profiles: {
      first_name: 'Ana',
      last_name: 'Dela Cruz',
    },
  },
]

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  ready_to_print: "bg-sky-100 text-sky-800",
  released: "bg-slate-100 text-slate-800",
  declined: "bg-red-100 text-red-800",
}

const formatDocType = (type: string) => {
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default function AdminDocumentRequestsPage() {
  const [requests, setRequests] = useState<DocumentRequest[]>([])
  const [isMockRequestData, setIsMockRequestData] = useState(false)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchRequests()
  }, [])

  async function fetchRequests() {
    try {
      const { data, error } = await supabase
        .from('document_requests')
        .select(`
          *,
          profiles:resident_id (
            first_name,
            last_name,
            address,
            date_of_birth
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      if (!data || data.length === 0) {
        setRequests(sampleAdminRequests)
        setIsMockRequestData(true)
        return
      }

      setRequests(data || [])
      setIsMockRequestData(false)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : (error && typeof error === 'object' && 'message' in error ? (error as any).message : String(error))
      console.error('Error fetching requests:', errorMessage)
      toast.error('Failed to load document requests. Showing demo data.')
      setRequests(sampleAdminRequests)
      setIsMockRequestData(true)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    setActionLoading(id)
    const current = requests.find((request) => request.id === id)
    if (current?.isMock) {
      setRequests((prev) => prev.map((request) =>
        request.id === id ? { ...request, status } : request
      ))
      toast.success(`Demo request ${status}`)
      setActionLoading(null)
      return
    }

    try {
      const { error } = await supabase
        .from('document_requests')
        .update({ 
          status,
          updated_at: new Date().toISOString(),
          ...(status === 'approved' ? { approved_at: new Date().toISOString() } : {})
        })
        .eq('id', id)

      if (error) throw error

      setRequests((current) =>
        current.map((request) =>
          request.id === id ? { ...request, status } : request
        )
      )
      toast.success(`Request ${status}`)
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update status')
    } finally {
      setActionLoading(null)
    }
  }

  const previewDocument = (request: DocumentRequest) => {
    try {
      const residentName = `${request.profiles?.first_name || ''} ${request.profiles?.last_name || ''}`.trim()
      const data = {
        residentName: residentName || 'Resident Name',
        address: request.profiles?.address || 'Barangay Santiago, San Antonio, Zambales',
        controlNumber: request.control_number || generateControlNumber(),
        issuedDate: new Date(),
        barangayCaptan: 'Barangay Captain',
        orNumber: undefined,
        purpose: request.purpose || '',
      }

      let html = generateDocumentHTML(request.document_type as any, data as any)
      // Inject auto-print script before closing body
      if (html.includes('</body>')) {
        html = html.replace('</body>', `<script>window.onload=function(){window.focus();window.print();};</script></body>`)
      } else {
        html += `<script>window.onload=function(){window.focus();window.print();};</script>`
      }

      const w = window.open('', '_blank', 'noopener,noreferrer')
      if (!w) {
        toast.error('Unable to open preview window. Please allow pop-ups.')
        return
      }
      w.document.open()
      w.document.write(html)
      w.document.close()
    } catch (err) {
      console.error('Preview generation failed', err)
      toast.error('Failed to generate document preview')
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hr ago`
    return `${Math.floor(diffInMinutes / 1440)} days ago`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex-1">
          <p className="text-xs sm:text-sm font-medium text-slate-500">Document Requests</p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">Manage requested documents</h1>
          <p className="max-w-2xl text-xs sm:text-sm text-slate-600 mt-1 sm:mt-2">
            Approve or decline requests, change status, print documents, and manage timelines.
          </p>
          {isMockRequestData && (
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-amber-700">Demo request data is displayed because no live requests were available.</p>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 shrink-0">
          <FileText className="h-4 w-4 text-slate-500" /> {requests.length} requests
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="space-y-4">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Live requests</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Track document request status and actions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {requests.length === 0 ? (
              <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-8 text-center text-slate-500 text-xs sm:text-sm">
                No document requests yet
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {requests.map((request) => (
                  <div key={request.id} className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm">
                    <div className="flex flex-col gap-2 sm:gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base lg:text-lg font-semibold text-slate-900">
                          {formatDocType(request.document_type)}
                        </p>
                        <p className="text-xs sm:text-sm text-slate-600">
                          Requested by {request.profiles?.first_name} {request.profiles?.last_name}
                        </p>
                        <p className="text-xs text-slate-500">{formatTimeAgo(request.created_at)}</p>
                        {request.control_number && (
                          <p className="text-xs text-slate-400 mt-0.5 sm:mt-1">Control #: {request.control_number}</p>
                        )}
                      </div>
                      <Badge className={`${statusStyles[request.status] || statusStyles.pending} text-xs sm:text-sm shrink-0`}>
                        {request.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row flex-wrap gap-2">
                      {request.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            onClick={() => updateStatus(request.id, "approved")}
                            disabled={actionLoading === request.id}
                            className="text-xs sm:text-sm flex-1 sm:flex-none"
                          >
                            {actionLoading === request.id ? <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" /> : 'Approve'}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => updateStatus(request.id, "declined")}
                            disabled={actionLoading === request.id}
                            className="text-xs sm:text-sm flex-1 sm:flex-none"
                          >
                            Decline
                          </Button>
                        </>
                      )}
                      {request.status === 'approved' && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => updateStatus(request.id, "ready_to_print")}
                          disabled={actionLoading === request.id}
                          className="text-xs sm:text-sm w-full sm:w-auto"
                        >
                          Ready to Print
                        </Button>
                      )}
                      {request.status === 'ready_to_print' && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => previewDocument(request)} className="text-xs sm:text-sm flex-1 sm:flex-none">
                            Print / Preview
                          </Button>
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            onClick={() => updateStatus(request.id, "released")}
                            disabled={actionLoading === request.id}
                            className="text-xs sm:text-sm flex-1 sm:flex-none"
                          >
                            Mark as Released
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="space-y-4">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Request timeline</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Audit request activity and status updates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="space-y-2 sm:space-y-3 rounded-2xl sm:rounded-3xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3 text-slate-900">
                <Timer className="h-4 w-4 text-slate-700 shrink-0" />
                <p className="font-semibold text-sm sm:text-base">Recent activity</p>
              </div>
              <div className="grid gap-1 sm:gap-2 text-xs sm:text-sm text-slate-600">
                {requests.slice(0, 5).map((request) => (
                  <div key={request.id} className="rounded-lg sm:rounded-2xl bg-white p-2 sm:p-3 shadow-sm">
                    <div className="truncate">{formatDocType(request.document_type)} - {request.status.replace('_', ' ')}</div>
                    <span className="block text-xs text-slate-400 mt-0.5">{formatTimeAgo(request.created_at)}</span>
                  </div>
                ))}
                {requests.length === 0 && (
                  <p className="text-center text-slate-400 text-xs py-4">No activity yet</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
