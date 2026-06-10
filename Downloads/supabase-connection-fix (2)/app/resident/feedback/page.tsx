"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { getCurrentUser, getProfile } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Loader2, Edit3, Trash2, Save, X } from "lucide-react"

interface ResidentFeedback {
  id: string
  message: string
  rating: number
  created_at: string
  status?: string
}

export default function ResidentFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<ResidentFeedback[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editMessage, setEditMessage] = useState<string>("")
  const [editRating, setEditRating] = useState<number>(5)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchResidentFeedbacks()
  }, [])

  const formatError = (err: unknown) => {
    if (!err) return 'Unknown error occurred.'
    if (err instanceof Error) return err.message
    if (typeof err === 'string') return err
    if (typeof err === 'object' && err !== null) {
      if ('message' in err && typeof (err as any).message === 'string') {
        return (err as any).message
      }
      try {
        return JSON.stringify(err)
      } catch {
        return String(err)
      }
    }
    return String(err)
  }

  const resolveResidentId = async () => {
    const { profile } = await getProfile()
    if (profile?.id) {
      return profile.id
    }

    const user = await getCurrentUser()
    return user?.id || null
  }

  const fetchResidentFeedbacks = async () => {
    setLoading(true)
    setError(null)

    try {
      const residentId = await resolveResidentId()
      if (!residentId) {
        throw new Error('Unable to verify your session. Please log in again.')
      }

      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .eq('resident_id', residentId)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(error.message || 'Failed to load your feedback.')
      }

      setFeedbacks(data || [])
    } catch (err: unknown) {
      const formatted = formatError(err)
      console.error('[resident feedback] fetch error:', formatted, err)
      setError(formatted || 'Failed to load your feedback.')
    } finally {
      setLoading(false)
    }
  }

  const handleStartEdit = (item: ResidentFeedback) => {
    setEditingId(item.id)
    setEditMessage(item.message)
    setEditRating(item.rating)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditMessage("")
    setEditRating(5)
  }

  const handleSaveEdit = async () => {
    if (!editingId) return
    setSavingId(editingId)

    try {
      const residentId = await resolveResidentId()
      if (!residentId) {
        throw new Error('Unable to verify your session. Please log in again.')
      }

      const { error } = await supabase
        .from('feedback')
        .update({ message: editMessage, rating: editRating })
        .eq('id', editingId)
        .eq('resident_id', residentId)
        .single()

      if (error) {
        throw new Error(error.message || 'Unable to update feedback.')
      }

      setFeedbacks(prev => prev.map(item => item.id === editingId ? { ...item, message: editMessage, rating: editRating } : item))
      handleCancelEdit()
    } catch (err: unknown) {
      const formatted = formatError(err)
      console.error('[resident feedback] update error:', formatted, err)
      setError(formatted || 'Unable to save changes.')
    } finally {
      setSavingId(null)
    }
  }

  const handleDelete = async (feedbackId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this feedback?')
    if (!confirmDelete) return

    setDeletingId(feedbackId)
    setError(null)

    try {
      const residentId = await resolveResidentId()
      if (!residentId) {
        throw new Error('Unable to verify your session. Please log in again.')
      }

      const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', feedbackId)
        .eq('resident_id', residentId)

      if (error) {
        throw new Error(error.message || 'Unable to delete feedback.')
      }

      setFeedbacks(prev => prev.filter(item => item.id !== feedbackId))
    } catch (err: unknown) {
      const formatted = formatError(err)
      console.error('[resident feedback] delete error:', formatted, err)
      setError(formatted || 'Unable to delete feedback.')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-border bg-white p-10 text-center shadow-sm">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-600" />
        <p className="mt-4 text-sm text-slate-600">Loading your feedback...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-700">Resident Feedback</p>
          <h1 className="text-3xl font-semibold text-slate-900">Your feedback list</h1>
          <p className="max-w-2xl text-sm text-slate-600">
            Review, edit, or remove the feedback you shared. This page shows only your personal entries.
          </p>
        </div>
        <Link href="/resident/dashboard">
          <Button variant="outline" size="sm">Back to dashboard</Button>
        </Link>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {feedbacks.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
          <p className="text-lg font-medium text-slate-900">No feedback posted yet.</p>
          <p className="mt-2 text-sm text-slate-600">You can leave feedback anytime from the main portal page.</p>
          <Link href="/resident/dashboard" className="mt-4 inline-flex rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {feedbacks.map((item) => (
            <div key={item.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span className="rounded-full bg-emerald-100 px-2 py-1 font-medium text-emerald-700">Rating {item.rating}/5</span>
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    {item.status && <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">{item.status}</span>}
                  </div>
                  <p className="mt-3 text-lg font-semibold text-slate-900">Feedback</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(item)}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    <Edit3 className="h-4 w-4" /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Trash2 className="h-4 w-4" />
                    {deletingId === item.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>

              {editingId === item.id ? (
                <div className="mt-5 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Rating</label>
                    <select
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500"
                      value={editRating}
                      onChange={(event) => setEditRating(Number(event.target.value))}
                    >
                      {[5, 4, 3, 2, 1].map((ratingOption) => (
                        <option key={ratingOption} value={ratingOption}>
                          {ratingOption} star{ratingOption > 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700">Message</label>
                    <textarea
                      className="mt-2 min-h-[140px] w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500"
                      value={editMessage}
                      onChange={(event) => setEditMessage(event.target.value)}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={handleSaveEdit}
                      disabled={Boolean(savingId)}
                      className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Save className="h-4 w-4" /> {savingId === item.id ? 'Saving...' : 'Save changes'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                      <X className="h-4 w-4" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm leading-7 text-slate-700 whitespace-pre-line">{item.message}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
