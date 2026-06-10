"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase"
import { Loader2, Plus, Trash2, Edit2 } from "lucide-react"
import { toast } from "sonner"

interface Project {
  id: string
  title: string
  description: string
  status: string
  budget: number
  progress: number
  start_date: string
  target_completion: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Planning',
    budget: '',
    progress: '0',
    start_date: '',
    target_completion: '',
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error('Title is required')
      return
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('projects')
          .update({
            title: formData.title,
            description: formData.description,
            status: formData.status,
            budget: parseFloat(formData.budget) || 0,
            progress: parseInt(formData.progress) || 0,
            start_date: formData.start_date,
            target_completion: formData.target_completion,
          })
          .eq('id', editingId)

        if (error) throw error
        toast.success('Project updated')
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([{
            title: formData.title,
            description: formData.description,
            status: formData.status,
            budget: parseFloat(formData.budget) || 0,
            progress: parseInt(formData.progress) || 0,
            start_date: formData.start_date,
            target_completion: formData.target_completion,
          }])

        if (error) throw error
        toast.success('Project created')
      }

      setFormData({ title: '', description: '', status: 'Planning', budget: '', progress: '0', start_date: '', target_completion: '' })
      setFormOpen(false)
      setEditingId(null)
      await fetchProjects()
    } catch (error) {
      console.error('Error saving project:', error)
      toast.error('Failed to save project')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success('Project deleted')
      await fetchProjects()
    } catch (error) {
      console.error('Error deleting:', error)
      toast.error('Failed to delete project')
    }
  }

  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description || '',
      status: project.status,
      budget: project.budget?.toString() || '',
      progress: project.progress?.toString() || '0',
      start_date: project.start_date,
      target_completion: project.target_completion,
    })
    setEditingId(project.id)
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
          <h1 className="text-3xl font-bold text-slate-900">Projects</h1>
          <p className="text-slate-600 mt-1">Manage barangay projects and initiatives</p>
        </div>
        <Button onClick={() => { setFormOpen(true); setEditingId(null); setFormData({ title: '', description: '', status: 'Planning', budget: '', progress: '0', start_date: '', target_completion: '' }) }}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {formOpen && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Project' : 'Create Project'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              <Textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} />
                <Input type="number" placeholder="Budget" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input type="number" placeholder="Progress %" value={formData.progress} onChange={(e) => setFormData({ ...formData, progress: e.target.value })} />
                <Input type="date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} />
              </div>
              <Input type="date" placeholder="Target Completion" value={formData.target_completion} onChange={(e) => setFormData({ ...formData, target_completion: e.target.value })} />
              <div className="flex gap-2">
                <Button type="submit">{editingId ? 'Update' : 'Create'}</Button>
                <Button variant="outline" onClick={() => { setFormOpen(false); setEditingId(null) }}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {projects.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-slate-500">
              No projects yet. Create one to get started.
            </CardContent>
          </Card>
        ) : (
          projects.map((project) => (
            <Card key={project.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{project.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{project.description?.substring(0, 100) || 'No description'}...</p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">{project.status}</span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Budget: ₱{project.budget?.toLocaleString() || '0'}</span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Progress: {project.progress}%</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(project)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(project.id)}>
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
