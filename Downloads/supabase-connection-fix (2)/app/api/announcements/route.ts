import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Announcement } from '@/lib/database'
import { supabaseServer } from '@/lib/supabase-server'
import { isMissingAnnouncementImageColumnError } from '@/lib/announcement-errors'

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

async function isOfficial(userId: string): Promise<boolean> {
  const { data: profile } = await supabaseServer
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()

  return profile?.role === 'official'
}

async function getAuthenticatedSupabaseClient(request: NextRequest) {
  const token = await getBearerToken(request)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!token || !supabaseUrl || !supabaseAnonKey) {
    return null
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })
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

    const isOfficialUser = await isOfficial(user.id)
    if (!isOfficialUser) {
      return NextResponse.json(
        { error: 'Only officials can create announcements' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      title,
      content,
      priority,
      status,
      category,
      targetAudience,
      publishDate,
      expiryDate,
      createdBy,
      author,
      imageUrl,
      image_url,
    } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const dbClient = (await getAuthenticatedSupabaseClient(request)) || supabaseServer

    const insertPayload: Record<string, any> = {
      title,
      content,
      priority: priority || 'normal',
      status: status || 'draft',
      category: category || null,
      target_audience: targetAudience || 'all',
      publish_date: publishDate ? new Date(publishDate) : null,
      expiry_date: expiryDate ? new Date(expiryDate) : null,
      author: author || createdBy || 'Official',
      created_by: createdBy || null,
    }

    const resolvedImageUrl = imageUrl || image_url || ''
    if (resolvedImageUrl) {
      insertPayload.image_url = resolvedImageUrl
    }

    const { data: announcement, error } = await dbClient
      .from('announcements')
      .insert([insertPayload])
      .select()
      .single()

    if (error) {
      if (isMissingAnnouncementImageColumnError(error)) {
        const { image_url: _ignoredImageUrl, ...fallbackPayload } = insertPayload
        const { data: fallbackAnnouncement, error: fallbackError } = await dbClient
          .from('announcements')
          .insert([fallbackPayload])
          .select()
          .single()

        if (fallbackError) throw fallbackError
        return NextResponse.json({ success: true, announcement: fallbackAnnouncement })
      }

      throw error
    }

    return NextResponse.json({
      success: true,
      announcement,
    })
  } catch (error) {
    let errorMessage = 'Unknown error'
    if (error instanceof Error) {
      errorMessage = error.message
    } else if (error && typeof error === 'object') {
      errorMessage = (error as any).message || (error as any).error_description || JSON.stringify(error)
    }
    console.error('Error creating announcement:', errorMessage, error)
    return NextResponse.json(
      { error: `Failed to create announcement: ${errorMessage}` },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const announcementId = searchParams.get('id')
    const targetAudience = searchParams.get('targetAudience')

    if (announcementId) {
      const { data: announcement, error } = await supabaseServer
        .from('announcements')
        .select('*')
        .eq('id', announcementId)
        .single()

      if (error) {
        return NextResponse.json(
          { error: error.message || 'Announcement not found' },
          { status: 404 }
        )
      }

      const normalizedAnnouncement = {
        ...announcement,
        title: String(announcement?.title ?? ''),
        content: String(announcement?.content ?? ''),
        priority: announcement?.priority ?? 'normal',
        status: announcement?.status ?? 'draft',
        category: announcement?.category ?? null,
        author: announcement?.author ?? 'Official',
        views: Number(announcement?.views ?? 0),
      }

      return NextResponse.json(normalizedAnnouncement)
    }

    let query = supabaseServer
      .from('announcements')
      .select('*')
      .eq('is_active', true)
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (targetAudience) {
      query = query.in('target_audience', ['all', targetAudience])
    }

    const { data: announcements, error } = await query
    if (error) throw error

    const normalizedAnnouncements = (announcements || []).map((announcement: any) => ({
      ...announcement,
      title: String(announcement?.title ?? ''),
      content: String(announcement?.content ?? ''),
      priority: announcement?.priority ?? 'normal',
      status: announcement?.status ?? 'draft',
      category: announcement?.category ?? null,
      author: announcement?.author ?? 'Official',
      views: Number(announcement?.views ?? 0),
    }))

    return NextResponse.json(normalizedAnnouncements)
  } catch (error) {
    let errorMessage = 'Unknown error'
    if (error instanceof Error) {
      errorMessage = error.message
    } else if (error && typeof error === 'object') {
      errorMessage = (error as any).message || (error as any).error_description || JSON.stringify(error)
    }
    console.error('Error fetching announcements:', errorMessage, error)
    return NextResponse.json(
      { error: `Failed to fetch announcements: ${errorMessage}` },
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

    const isOfficialUser = await isOfficial(user.id)
    if (!isOfficialUser) {
      return NextResponse.json(
        { error: 'Only officials can update announcements' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      id,
      title,
      content,
      priority,
      status,
      category,
      targetAudience,
      publishDate,
      expiryDate,
      isActive,
      createdBy,
      author,
      imageUrl,
      image_url,
    } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Announcement id required' },
        { status: 400 }
      )
    }

    const updateBody: any = {}
    if (title !== undefined) updateBody.title = title
    if (content !== undefined) updateBody.content = content
    if (priority !== undefined) updateBody.priority = priority
    if (status !== undefined) updateBody.status = status
    if (category !== undefined) updateBody.category = category
    if (targetAudience !== undefined)
      updateBody.target_audience = targetAudience
    if (publishDate !== undefined)
      updateBody.publish_date = publishDate ? new Date(publishDate) : null
    if (expiryDate !== undefined)
      updateBody.expiry_date = expiryDate ? new Date(expiryDate) : null
    if (isActive !== undefined) updateBody.is_active = isActive
    if (createdBy !== undefined) updateBody.created_by = createdBy
    if (author !== undefined) updateBody.author = author
    if (imageUrl !== undefined || image_url !== undefined) {
      const resolvedImageUrl = imageUrl ?? image_url ?? ''
      updateBody.image_url = resolvedImageUrl || null
    }

    const dbClient = (await getAuthenticatedSupabaseClient(request)) || supabaseServer

    const { data: announcement, error } = await dbClient
      .from('announcements')
      .update(updateBody)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (isMissingAnnouncementImageColumnError(error) && 'image_url' in updateBody) {
        const { image_url: _ignoredImageUrl, ...fallbackBody } = updateBody
        const { data: fallbackAnnouncement, error: fallbackError } = await dbClient
          .from('announcements')
          .update(fallbackBody)
          .eq('id', id)
          .select()
          .single()

        if (fallbackError) {
          return NextResponse.json(
            { error: fallbackError.message || 'Announcement not found' },
            { status: 404 }
          )
        }

        return NextResponse.json({ success: true, announcement: fallbackAnnouncement })
      }

      return NextResponse.json(
        { error: error.message || 'Announcement not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      announcement,
    })
  } catch (error) {
    let errorMessage = 'Unknown error'
    if (error instanceof Error) {
      errorMessage = error.message
    } else if (error && typeof error === 'object') {
      errorMessage = (error as any).message || (error as any).error_description || JSON.stringify(error)
    }
    console.error('Error updating announcement:', errorMessage, error)
    return NextResponse.json(
      { error: `Failed to update announcement: ${errorMessage}` },
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

    const isOfficialUser = await isOfficial(user.id)
    if (!isOfficialUser) {
      return NextResponse.json(
        { error: 'Only officials can delete announcements' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const announcementId = searchParams.get('id')

    if (!announcementId) {
      return NextResponse.json(
        { error: 'Announcement id required' },
        { status: 400 }
      )
    }

    const dbClient = (await getAuthenticatedSupabaseClient(request)) || supabaseServer

    const { error } = await dbClient
      .from('announcements')
      .delete()
      .eq('id', announcementId)

    if (error) {
      return NextResponse.json(
        { error: error.message || 'Failed to delete announcement' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    let errorMessage = 'Unknown error'
    if (error instanceof Error) {
      errorMessage = error.message
    } else if (error && typeof error === 'object') {
      errorMessage = (error as any).message || (error as any).error_description || JSON.stringify(error)
    }
    console.error('Error deleting announcement:', errorMessage, error)
    return NextResponse.json(
      { error: `Failed to delete announcement: ${errorMessage}` },
      { status: 500 }
    )
  }
}
