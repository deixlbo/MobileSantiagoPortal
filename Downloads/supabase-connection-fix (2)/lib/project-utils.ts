import { supabase } from './supabase'

// Project CRUD Operations

interface Project {
  id: string
  title: string
  type: string
  description: string
  location: string
  startDate: string
  endDate?: string
  status: "Planned" | "Ongoing" | "Completed" | "Suspended"
  progress: number
  budget: number | string
  spent: number
  source: string
  projectHead: string
  projectHeadPosition: string
  beneficiaries: string
  remarks: string
  createdBy?: string
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (typeof window !== 'undefined') {
    try {
      const { data } = await supabase.auth.getSession()
      const token = data?.session?.access_token
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }
    } catch {
      const token = window.localStorage.getItem('auth_token')
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }
    }
  }

  return headers
}

export async function createProject(project: Omit<Project, 'id'>): Promise<Project> {
  try {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(project),
    })
    const result = await response.json().catch(() => null)
    if (!response.ok) {
      const message = result?.error || result?.message || `Failed to create project (status ${response.status})`
      throw new Error(message)
    }
    return result.project || result
  } catch (error) {
    console.error('Error creating project:', error)
    throw error
  }
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project> {
  try {
    const response = await fetch('/api/projects', {
      method: 'PUT',
      headers: await getAuthHeaders(),
      body: JSON.stringify({ id, ...updates }),
    })
    const result = await response.json().catch(() => null)
    if (!response.ok) {
      const message = result?.error || result?.message || `Failed to update project (status ${response.status})`
      throw new Error(message)
    }
    return result.project || result
  } catch (error) {
    console.error('Error updating project:', error)
    throw error
  }
}

export async function deleteProject(id: string): Promise<void> {
  try {
    const response = await fetch('/api/projects?id=' + id, {
      method: 'DELETE',
      headers: await getAuthHeaders(),
    })
    const result = await response.json().catch(() => null)
    if (!response.ok) {
      const message = result?.error || result?.message || `Failed to delete project (status ${response.status})`
      throw new Error(message)
    }
  } catch (error) {
    console.error('Error deleting project:', error)
    throw error
  }
}

export async function updateProjectProgress(id: string, progress: number): Promise<Project> {
  return updateProject(id, { progress })
}

export async function updateProjectStatus(id: string, status: Project['status']): Promise<Project> {
  return updateProject(id, { status })
}

export async function completeProject(id: string): Promise<Project> {
  return updateProject(id, { status: 'Completed', progress: 100 })
}
