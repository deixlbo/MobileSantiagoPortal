"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Timer, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

interface DocumentRequest {
  id: string
  resident_id: string
  document_type: string
  status: string
  created_at: string
  purpose: string
  control_number: string
  profiles?: {
    first_name: string
    last_name: string
  }
}

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
            last_name
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setRequests(data || [])
    } catch (error) {
      console.error('Error fetching requests:', error)
      toast.error('Failed to load document requests')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    setActionLoading(id)
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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Document Requests</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Manage requested documents</h1>
          <p className="max-w-2xl text-sm text-slate-600 mt-2">
            Approve or reject requests, change status, print documents, and manage timelines.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <FileText className="h-4 w-4 text-slate-500" /> {requests.length} total requests
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="space-y-4">
          <CardHeader>
            <CardTitle>Live requests</CardTitle>
            <CardDescription>Track document request status and actions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {requests.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                No document requests yet
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div key={request.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-lg font-semibold text-slate-900">
                          {formatDocType(request.document_type)}
                        </p>
                        <p className="text-sm text-slate-600">
                          Requested by {request.profiles?.first_name} {request.profiles?.last_name}
                        </p>
                        <p className="text-sm text-slate-500">{formatTimeAgo(request.created_at)}</p>
                        {request.control_number && (
                          <p className="text-xs text-slate-400 mt-1">Control #: {request.control_number}</p>
                        )}
                      </div>
                      <Badge className={statusStyles[request.status] || statusStyles.pending}>
                        {request.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {request.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            onClick={() => updateStatus(request.id, "approved")}
                            disabled={actionLoading === request.id}
                          >
                            {actionLoading === request.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Approve'}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => updateStatus(request.id, "declined")}
                            disabled={actionLoading === request.id}
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
                        >
                          Ready to Print
                        </Button>
                      )}
                      {request.status === 'ready_to_print' && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => toast.info('Printing document...')}>
                            Print
                          </Button>
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            onClick={() => updateStatus(request.id, "released")}
                            disabled={actionLoading === request.id}
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
            <CardTitle>Request timeline</CardTitle>
            <CardDescription>Audit request activity and status updates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-3 text-slate-900">
                <Timer className="h-4 w-4" />
                <p className="font-semibold">Recent activity</p>
              </div>
              <div className="grid gap-2 text-sm text-slate-600">
                {requests.slice(0, 5).map((request) => (
                  <div key={request.id} className="rounded-2xl bg-white p-3 shadow-sm">
                    {formatDocType(request.document_type)} - {request.status.replace('_', ' ')}
                    <span className="block text-xs text-slate-400">{formatTimeAgo(request.created_at)}</span>
                  </div>
                ))}
                {requests.length === 0 && (
                  <p className="text-center text-slate-400">No activity yet</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
