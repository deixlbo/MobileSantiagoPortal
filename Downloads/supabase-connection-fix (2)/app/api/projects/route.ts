import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

async function getBearerToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization')
  return authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader
}

async function getCurrentUser(request: NextRequest) {
  const token = await getBearerToken(request)
  if (!token) return null

  const { data: userData, error } = await supabaseServer.auth.getUser(token)
  if (error || !userData?.user) return null

  return userData.user
}

async function getUserRole(user: { id: string; user_metadata?: Record<string, unknown>; app_metadata?: Record<string, unknown> } | null): Promise<string | null> {
  if (!user) return null

  const metadataRole = user.user_metadata?.role ?? user.app_metadata?.role
  if (typeof metadataRole === 'string' && metadataRole.trim()) {
    return metadataRole.trim().toLowerCase()
  }

  const { data: profile, error } = await supabaseServer
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (error || !profile?.role) return null
  return String(profile.role).toLowerCase()
}

async function isOfficial(user: { id: string; user_metadata?: Record<string, unknown>; app_metadata?: Record<string, unknown> } | null): Promise<boolean> {
  const role = await getUserRole(user)
  return role === 'official'
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const isOfficialUser = await isOfficial(user)
    if (!isOfficialUser) {
      return NextResponse.json(
        { error: 'Only officials can create projects' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      startDate,
      targetCompletion,
      endDate,
      progress,
      budget,
      spent,
      location,
      status,
      createdBy,
      type,
      source,
      projectHead,
      projectHeadPosition,
      beneficiaries,
      remarks,
    } = body

    if (!title || !type || !location) {
      return NextResponse.json(
        { error: 'Missing required fields: title, type, and location are required' },
        { status: 400 }
      )
    }

    // Normalize and convert budget and spent to numbers
    const cleanedBudget = budget !== undefined && budget !== null && budget !== '' ? String(budget).replace(/,/g, '') : ''
    const cleanedSpent = spent !== undefined && spent !== null && spent !== '' ? String(spent).replace(/,/g, '') : ''
    const parsedBudget = cleanedBudget ? parseFloat(cleanedBudget) : null
    const parsedSpent = cleanedSpent ? parseFloat(cleanedSpent) : null

    // Validate parsed numbers
    if (cleanedBudget && isNaN(parsedBudget)) {
      return NextResponse.json(
        { error: 'Budget must be a valid number' },
        { status: 400 }
      )
    }
    if (cleanedSpent && isNaN(parsedSpent)) {
      return NextResponse.json(
        { error: 'Spent amount must be a valid number' },
        { status: 400 }
      )
    }

    const startDateValue = startDate ? new Date(String(startDate)) : null
    const targetCompletionValue = targetCompletion
      ? new Date(String(targetCompletion))
      : endDate
      ? new Date(String(endDate))
      : null

    if (startDate && startDateValue instanceof Date && isNaN(startDateValue.getTime())) {
      return NextResponse.json(
        { error: 'Start date must be a valid date' },
        { status: 400 }
      )
    }

    if (targetCompletion && targetCompletionValue instanceof Date && isNaN(targetCompletionValue.getTime())) {
      return NextResponse.json(
        { error: 'Target completion date must be a valid date' },
        { status: 400 }
      )
    }

    const { data: project, error } = await supabaseServer
      .from('projects')
      .insert([
        {
          title,
          description: description || '',
          type: type || '',
          start_date: startDateValue,
          target_completion: targetCompletionValue,
          progress: progress ?? 0,
          budget: parsedBudget || null,
          spent: parsedSpent || null,
          location: location || 'AI-Assisted Barangay Santiago Portal: Smart Document Processing and Resident Service Automation',
          status: status || 'Planned',
          source: source || '',
          project_head: projectHead || '',
          project_head_position: projectHeadPosition || '',
          beneficiaries: beneficiaries || '',
          remarks: remarks || '',
          created_at: new Date(),
          updated_at: new Date(),
          created_by: user.id,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    return NextResponse.json({
      success: true,
      project,
    })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create project' },
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
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const isOfficialUser = await isOfficial(user)
    if (!isOfficialUser) {
      return NextResponse.json(
        { error: 'Only officials can update projects' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      id,
      progress,
      status,
      spent,
      budget,
      startDate,
      targetCompletion,
      endDate,
      ...updates
    } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Project id is required' },
        { status: 400 }
      )
    }

    const parsedBudget = budget !== undefined && budget !== null && budget !== ''
      ? Number(String(budget).replace(/,/g, ''))
      : undefined
    const parsedSpent = spent !== undefined && spent !== null && spent !== ''
      ? Number(String(spent).replace(/,/g, ''))
      : undefined

    const updatePayload: Record<string, unknown> = {
      updated_at: new Date(),
    }

    if (progress !== undefined) {
      updatePayload.progress = Math.min(100, Math.max(0, Number(progress)))
    }
    if (status !== undefined) {
      updatePayload.status = status
    }
    if (parsedBudget !== undefined && !Number.isNaN(parsedBudget)) {
      updatePayload.budget = parsedBudget
    }
    if (parsedSpent !== undefined && !Number.isNaN(parsedSpent)) {
      updatePayload.spent = parsedSpent
    }

    const fieldMap: Record<string, string> = {
      projectHead: 'project_head',
      projectHeadPosition: 'project_head_position',
      targetCompletion: 'target_completion',
      endDate: 'target_completion',
      startDate: 'start_date',
    }

    const allowedColumns = new Set([
      'title',
      'description',
      'type',
      'location',
      'status',
      'progress',
      'budget',
      'spent',
      'source',
      'project_head',
      'project_head_position',
      'beneficiaries',
      'remarks',
      'start_date',
      'target_completion',
    ])

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || ['imageUrl', 'image_url'].includes(key)) return
      const mappedKey = fieldMap[key] || key
      if (!allowedColumns.has(mappedKey)) return
      updatePayload[mappedKey] = value
    })

    if (startDate !== undefined) {
      updatePayload.start_date = startDate ? new Date(String(startDate)) : null
    }
    if (targetCompletion !== undefined) {
      updatePayload.target_completion = targetCompletion ? new Date(String(targetCompletion)) : null
    } else if (endDate !== undefined) {
      updatePayload.target_completion = endDate ? new Date(String(endDate)) : null
    }

    const { data: updatedProject, error: updateError } = await supabaseServer
      .from('projects')
      .update(updatePayload)
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
      { error: error instanceof Error ? error.message : 'Failed to update project' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const isOfficialUser = await isOfficial(user)
    if (!isOfficialUser) {
      return NextResponse.json(
        { error: 'Only officials can delete projects' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('id')

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project id is required' },
        { status: 400 }
      )
    }

    const { error } = await supabaseServer
      .from('projects')
      .delete()
      .eq('id', projectId)

    if (error) {
      return NextResponse.json(
        { error: error.message || 'Failed to delete project' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}
