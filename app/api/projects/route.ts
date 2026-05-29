import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

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

    const { data: project, error } = await supabaseServer
      .from('projects')
      .insert([
        {
          title,
          description: description || '',
          start_date: new Date(startDate),
          end_date: endDate ? new Date(endDate) : undefined,
          progress: progress || 0,
          budget: budget || undefined,
          spent: spent || undefined,
          location: location || 'Barangay Santiago',
          status: status || 'planning',
          created_at: new Date(),
          updated_at: new Date(),
          created_by: createdBy,
        },
      ])
      .select()
      .single()

    if (error) throw error

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
      const { data: project, error } = await supabaseServer
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single()
      if (error) {
        return NextResponse.json(
          { error: error.message || 'Project not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(project)
    }

    let query = supabaseServer.from('projects').select('*')
    if (status) {
      query = query.eq('status', status)
    }
    const { data: allProjects, error } = await query
    if (error) throw error
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

    const { data: project, error } = await supabaseServer
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()
    if (error) {
      return NextResponse.json(
        { error: error.message || 'Project not found' },
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

    const { data: updatedProject, error: updateError } = await supabaseServer
      .from('projects')
      .update({
        ...updates,
        progress: progress !== undefined ? Math.min(100, Math.max(0, progress)) : undefined,
        status,
        spent,
        updated_at: new Date(),
      })
      .eq('id', id)
      .select()
      .single()
    if (updateError) throw updateError

    return NextResponse.json({
      success: true,
      project: updatedProject,
    })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}
