"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase"
import { Loader2, Plus, Trash2, Edit2 } from "lucide-react"
import { toast } from "sonner"

interface Ordinance {
  id: string
  title: string
  content: string
  category: string
  uploaded_at: string
  file_path: string
}

export default function OrdinancesPage() {
  const [ordinances, setOrdinances] = useState<Ordinance[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General',
  })

  useEffect(() => {
    fetchOrdinances()
  }, [])

  const fetchOrdinances = async () => {
    try {
      const { data, error } = await supabase
        .from('ordinances')
        .select('*')
        .order('uploaded_at', { ascending: false })

      if (error) throw error
      setOrdinances(data || [])
    } catch (error) {
      console.error('Error fetching ordinances:', error)
      toast.error('Failed to load ordinances')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Title and content are required')
      return
    }

    try {
      if (editingId) {
        // Update existing
        const { error } = await supabase
          .from('ordinances')
          .update({
            title: formData.title,
            content: formData.content,
            category: formData.category,
          })
          .eq('id', editingId)

        if (error) throw error
        toast.success('Ordinance updated successfully')
      } else {
        // Create new
        const { error } = await supabase
          .from('ordinances')
          .insert([{
            title: formData.title,
            content: formData.content,
            category: formData.category,
          }])

        if (error) throw error
        toast.success('Ordinance created successfully')
      }

      setFormData({ title: '', content: '', category: 'General' })
      setFormOpen(false)
      setEditingId(null)
      await fetchOrdinances()
    } catch (error) {
      console.error('Error saving ordinance:', error)
      toast.error('Failed to save ordinance')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return

    try {
      const { error } = await supabase
        .from('ordinances')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success('Ordinance deleted')
      await fetchOrdinances()
    } catch (error) {
      console.error('Error deleting:', error)
      toast.error('Failed to delete ordinance')
    }
  }

  const handleEdit = (ordinance: Ordinance) => {
    setFormData({
      title: ordinance.title,
      content: ordinance.content,
      category: ordinance.category || 'General',
    })
    setEditingId(ordinance.id)
    setFormOpen(true)
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
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Ordinances</h1>
          <p className="text-slate-600 mt-1">Manage barangay ordinances and regulations</p>
        </div>
        <Button onClick={() => { setFormOpen(true); setEditingId(null); setFormData({ title: '', content: '', category: 'General' }) }}>
          <Plus className="mr-2 h-4 w-4" />
          New Ordinance
        </Button>
      </div>

      {formOpen && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Ordinance' : 'Create Ordinance'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <Input
                placeholder="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
              <Textarea
                placeholder="Content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="min-h-32"
              />
              <div className="flex gap-2">
                <Button type="submit">{editingId ? 'Update' : 'Create'}</Button>
                <Button variant="outline" onClick={() => { setFormOpen(false); setEditingId(null) }}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {ordinances.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-slate-500">
              No ordinances yet. Create one to get started.
            </CardContent>
          </Card>
        ) : (
          ordinances.map((ordinance) => (
            <Card key={ordinance.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{ordinance.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{ordinance.content.substring(0, 100)}...</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">{ordinance.category}</span>
                      <span className="text-xs text-slate-500">{new Date(ordinance.uploaded_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(ordinance)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(ordinance.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
