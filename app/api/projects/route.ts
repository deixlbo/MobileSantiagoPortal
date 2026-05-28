import { NextRequest, NextResponse } from 'next/server'
import { Project } from '@/lib/database'

// In-memory storage for projects
const projects: Map<string, Project> = new Map()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      startDate,
      endDate,
      progress,
      budget,
      spent,
      location,
      status,
      createdBy,
    } = body

    if (!title || !createdBy) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const project: Project = {
      id: `project-${Date.now()}`,
      title,
      description: description || '',
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      progress: progress || 0,
      budget: budget || undefined,
      spent: spent || undefined,
      location: location || 'Barangay Santiago',
      status: status || 'planning',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy,
    }

    projects.set(project.id, project)

    return NextResponse.json({
      success: true,
      project,
    })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('id')
    const status = searchParams.get('status')

    if (projectId) {
      const project = projects.get(projectId)
      if (!project) {
        return NextResponse.json(
          { error: 'Project not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(project)
    }

    let allProjects = Array.from(projects.values())

    if (status) {
      allProjects = allProjects.filter((p) => p.status === status)
    }

    return NextResponse.json(allProjects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, progress, status, spent, ...updates } = body

    const project = projects.get(id)
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    if (progress !== undefined) {
      project.progress = Math.min(100, Math.max(0, progress))
    }
    if (status) {
      project.status = status
    }
    if (spent !== undefined) {
      project.spent = spent
    }

    Object.assign(project, updates)
    project.updatedAt = new Date()

    projects.set(id, project)

    return NextResponse.json({
      success: true,
      project,
    })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}
