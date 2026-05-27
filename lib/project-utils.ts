// Project CRUD Operations

interface Project {
  id: string
  title: string
  type: string
  description: string
  location: string
  startDate: string
  targetCompletion: string
  status: "Planned" | "Ongoing" | "Completed" | "Suspended"
  progress: number
  budget: string
  source: string
  projectHead: string
  projectHeadPosition: string
  beneficiaries: string
  remarks: string
}

export async function createProject(project: Omit<Project, 'id'>): Promise<Project> {
  try {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    })
    if (!response.ok) throw new Error('Failed to create project')
    return response.json()
  } catch (error) {
    console.error('Error creating project:', error)
    throw error
  }
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project> {
  try {
    const response = await fetch('/api/projects', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    })
    if (!response.ok) throw new Error('Failed to update project')
    return response.json()
  } catch (error) {
    console.error('Error updating project:', error)
    throw error
  }
}

export async function deleteProject(id: string): Promise<void> {
  try {
    const response = await fetch('/api/projects?id=' + id, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete project')
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
